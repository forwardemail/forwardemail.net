# Ofte stilte spørsmål {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="" class="rounded-lg" />

## Innholdsfortegnelse {#table-of-contents}

* [Hurtigstart](#quick-start)
* [Introduksjon](#introduction)
  * [Hva er videresendt e-post](#what-is-forward-email)
  * [Hvem bruker videresendt e-post](#who-uses-forward-email)
  * [Hva er historikken for videresendte e-poster](#what-is-forward-emails-history)
  * [Hvor rask er denne tjenesten](#how-fast-is-this-service)
* [E-postklienter](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [Mobile enheter](#mobile-devices)
  * [Slik sender du e-post som ved hjelp av Gmail](#how-to-send-mail-as-using-gmail)
  * [Hva er den eldre gratisveiledningen for Send e-post som med Gmail](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Avansert konfigurasjon av Gmail-ruting](#advanced-gmail-routing-configuration)
  * [Avansert konfigurasjon av Outlook-ruting](#advanced-outlook-routing-configuration)
* [Feilsøking](#troubleshooting)
  * [Hvorfor mottar jeg ikke test-e-postene mine](#why-am-i-not-receiving-my-test-emails)
  * [Hvordan konfigurerer jeg e-postklienten min til å fungere med videresendt e-post](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Hvorfor havner e-postene mine i søppelpost og søppelpost, og hvordan kan jeg sjekke domenets omdømme?](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [Hva bør jeg gjøre hvis jeg mottar spam-e-poster](#what-should-i-do-if-i-receive-spam-emails)
  * [Hvorfor vises test-e-postene som er sendt til meg selv i Gmail som «mistenkelige»?](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Kan jeg fjerne via forwardemail punktum .NET i Gmail?](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Datahåndtering](#data-management)
  * [Hvor er serverne deres plassert](#where-are-your-servers-located)
  * [Hvordan eksporterer og sikkerhetskopierer jeg postkassen min](#how-do-i-export-and-backup-my-mailbox)
  * [Hvordan importerer og migrerer jeg min eksisterende postboks](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Støtter du selvhosting?](#do-you-support-self-hosting)
* [E-postkonfigurasjon](#email-configuration)
  * [Hvordan kommer jeg i gang og konfigurerer videresending av e-post](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Kan jeg bruke flere MX-utvekslinger og servere for avansert videresending?](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Hvordan setter jeg opp en feriesvar (autosvar for fravær)?](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Hvordan konfigurerer jeg SPF for videresending av e-post](#how-do-i-set-up-spf-for-forward-email)
  * [Hvordan konfigurerer jeg DKIM for videresending av e-post](#how-do-i-set-up-dkim-for-forward-email)
  * [Hvordan konfigurerer jeg DMARC for videresending av e-post](#how-do-i-set-up-dmarc-for-forward-email)
  * [Hvordan kobler jeg til og konfigurerer kontaktene mine](#how-do-i-connect-and-configure-my-contacts)
  * [Hvordan kobler jeg til og konfigurerer kalenderne mine](#how-do-i-connect-and-configure-my-calendars)
  * [Hvordan legger jeg til flere kalendere og administrerer eksisterende kalendere?](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Hvordan konfigurerer jeg SRS for videresending av e-post](#how-do-i-set-up-srs-for-forward-email)
  * [Hvordan konfigurerer jeg MTA-STS for videresending av e-post?](#how-do-i-set-up-mta-sts-for-forward-email)
  * [Hvordan legger jeg til et profilbilde i e-postadressen min](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Avanserte funksjoner](#advanced-features)
  * [Støtter dere nyhetsbrev eller e-postlister for markedsføringsrelatert e-post?](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Støtter dere sending av e-post med API](#do-you-support-sending-email-with-api)
  * [Støtter dere mottak av e-post med IMAP](#do-you-support-receiving-email-with-imap)
  * [Støtter du POP3](#do-you-support-pop3)
  * [Støtter dere kalendere (CalDAV)?](#do-you-support-calendars-caldav)
  * [Støtter dere kontakter (CardDAV)](#do-you-support-contacts-carddav)
  * [Støtter dere sending av e-post med SMTP](#do-you-support-sending-email-with-smtp)
  * [Støtter dere OpenPGP/MIME, ende-til-ende-kryptering («E2EE») og Web Key Directory («WKD»)?](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Støtter du MTA-STS](#do-you-support-mta-sts)
  * [Støtter dere passord og WebAuthn?](#do-you-support-passkeys-and-webauthn)
  * [Støtter dere beste praksis for e-post](#do-you-support-email-best-practices)
  * [Støtter dere bounce webhooks](#do-you-support-bounce-webhooks)
  * [Støtter dere webhooks?](#do-you-support-webhooks)
  * [Støtter dere regulære uttrykk eller regex?](#do-you-support-regular-expressions-or-regex)
  * [Hva er grensene for utgående SMTP?](#what-are-your-outbound-smtp-limits)
  * [Trenger jeg godkjenning for å aktivere SMTP](#do-i-need-approval-to-enable-smtp)
  * [Hva er konfigurasjonsinnstillingene for SMTP-serveren din](#what-are-your-smtp-server-configuration-settings)
  * [Hva er konfigurasjonsinnstillingene for IMAP-serveren din](#what-are-your-imap-server-configuration-settings)
  * [Hva er konfigurasjonsinnstillingene for POP3-serveren din](#what-are-your-pop3-server-configuration-settings)
  * [Postfix SMTP-relékonfigurasjon](#postfix-smtp-relay-configuration)
* [Sikkerhet](#security)
  * [Avanserte serverherdingsteknikker](#advanced-server-hardening-techniques)
  * [Har du SOC 2- eller ISO 27001-sertifiseringer?](#do-you-have-soc-2-or-iso-27001-certifications)
  * [Bruker du TLS-kryptering for videresending av e-post](#do-you-use-tls-encryption-for-email-forwarding)
  * [Bevarer dere overskrifter for e-postautentisering](#do-you-preserve-email-authentication-headers)
  * [Bevarer dere originale e-postoverskrifter og forhindrer forfalskning?](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Hvordan beskytter du deg mot spam og misbruk](#how-do-you-protect-against-spam-and-abuse)
  * [Lagrer dere e-postinnhold på disk?](#do-you-store-email-content-on-disk)
  * [Kan e-postinnhold eksponeres under systemkrasj](#can-email-content-be-exposed-during-system-crashes)
  * [Hvem har tilgang til e-postinfrastrukturen din](#who-has-access-to-your-email-infrastructure)
  * [Hvilke infrastrukturleverandører bruker dere](#what-infrastructure-providers-do-you-use)
  * [Tilbyr dere en databehandleravtale (DPA)?](#do-you-offer-a-data-processing-agreement-dpa)
  * [Hvordan håndterer dere varsler om datainnbrudd](#how-do-you-handle-data-breach-notifications)
  * [Tilbyr dere et testmiljø](#do-you-offer-a-test-environment)
  * [Tilbyr dere overvåkings- og varslingsverktøy?](#do-you-provide-monitoring-and-alerting-tools)
  * [Hvordan sikrer du høy tilgjengelighet](#how-do-you-ensure-high-availability)
  * [Overholder du paragraf 889 i National Defense Authorization Act (NDAA)?](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [System- og tekniske detaljer](#system-and-technical-details)
  * [Lagrer du e-poster og innholdet i dem](#do-you-store-emails-and-their-contents)
  * [Hvordan fungerer systemet deres for videresending av e-post](#how-does-your-email-forwarding-system-work)
  * [Hvordan behandler du en e-post for videresending](#how-do-you-process-an-email-for-forwarding)
  * [Hvordan håndterer du problemer med e-postlevering](#how-do-you-handle-email-delivery-issues)
  * [Hvordan håndterer du at IP-adressene dine blir blokkert](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [Hva er postmesteradresser](#what-are-postmaster-addresses)
  * [Hva er adresser uten svar?](#what-are-no-reply-addresses)
  * [Hva er IP-adressene til serveren din?](#what-are-your-servers-ip-addresses)
  * [Har du en tillatelsesliste](#do-you-have-an-allowlist)
  * [Hvilke domenenavnutvidelser er godkjent som standard](#what-domain-name-extensions-are-allowlisted-by-default)
  * [Hva er kriteriene for tillatelseslisten din](#what-is-your-allowlist-criteria)
  * [Hvilke domenenavnutvidelser kan brukes gratis](#what-domain-name-extensions-can-be-used-for-free)
  * [Har du en gråliste](#do-you-have-a-greylist)
  * [Har du en avslagsliste](#do-you-have-a-denylist)
  * [Har du en takstbegrensning](#do-you-have-rate-limiting)
  * [Hvordan beskytter du mot tilbakespredning](#how-do-you-protect-against-backscatter)
  * [Forhindre returer fra kjente E-POSTFRA-spammere](#prevent-bounces-from-known-mail-from-spammers)
  * [Forhindre unødvendige sprett for å beskytte mot tilbakespredning](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Hvordan bestemmer du et e-postfingeravtrykk](#how-do-you-determine-an-email-fingerprint)
  * [Kan jeg videresende e-poster til andre porter enn 25 (f.eks. hvis internettleverandøren min har blokkert port 25)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Støtter den pluss-+-tegnet for Gmail-aliaser](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Støtter den underdomener?](#does-it-support-sub-domains)
  * [Videresender dette e-postoverskriftene mine?](#does-this-forward-my-emails-headers)
  * [Er dette godt testet](#is-this-well-tested)
  * [Sender du videre SMTP-svarmeldinger og -koder](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Hvordan forhindrer du spammere og sikrer et godt rykte for videresending av e-post](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Hvordan utfører du DNS-oppslag på domenenavn](#how-do-you-perform-dns-lookups-on-domain-names)
* [Konto og fakturering](#account-and-billing)
  * [Tilbyr dere pengene-tilbake-garanti på betalte planer](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Hvis jeg bytter plan, betaler dere forholdsmessig og refunderer differansen](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Kan jeg bare bruke denne e-postvideresendingstjenesten som en "fallback" eller "fallover" MX-server?](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Kan jeg deaktivere spesifikke aliaser](#can-i-disable-specific-aliases)
  * [Kan jeg videresende e-poster til flere mottakere](#can-i-forward-emails-to-multiple-recipients)
  * [Kan jeg ha flere globale mottakere som skal samles inn](#can-i-have-multiple-global-catch-all-recipients)
  * [Er det en maksimal grense for antall e-postadresser jeg kan videresende til per alias](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Kan jeg videresende e-poster rekursivt?](#can-i-recursively-forward-emails)
  * [Kan folk avregistrere seg eller registrere videresending av e-post uten min tillatelse](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Hvordan er det gratis](#how-is-it-free)
  * [Hva er maksimal e-poststørrelsesgrense](#what-is-the-max-email-size-limit)
  * [Lagrer dere logger av e-poster](#do-you-store-logs-of-emails)
  * [Lagrer dere feillogger](#do-you-store-error-logs)
  * [Leser du e-postene mine](#do-you-read-my-emails)
  * [Kan jeg «sende e-post som» i Gmail med dette?](#can-i-send-mail-as-in-gmail-with-this)
  * [Kan jeg "sende e-post som" i Outlook med dette?](#can-i-send-mail-as-in-outlook-with-this)
  * [Kan jeg «sende e-post som» i Apple Mail og iCloud Mail med dette?](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Kan jeg videresende et ubegrenset antall e-poster med dette](#can-i-forward-unlimited-emails-with-this)
  * [Tilbyr dere et ubegrenset antall domener til én pris](#do-you-offer-unlimited-domains-for-one-price)
  * [Hvilke betalingsmåter godtar dere](#which-payment-methods-do-you-accept)
* [Ytterligere ressurser](#additional-resources)

## Hurtigstart {#quick-start}

Slik kommer du i gang med videresending av e-post:

1. **Opprett en konto** på [forwardemail.net/register](https://forwardemail.net/register)

2. **Legg til og bekreft domenet ditt** under [Min konto → Domener](/my-account/domains)

3. **Legg til og konfigurer e-postaliaser/postkasser** under [Min konto → Domener](/my-account/domains) → Aliaser

4. **Test oppsettet ditt** ved å sende en e-post til et av de nye aliasene dine

> \[!TIP]
> Det kan ta opptil 24–48 timer før DNS-endringer trer i kraft globalt, men de trer ofte i kraft mye raskere.

> \[!IMPORTANT]
> For forbedret levering anbefaler vi å sette opp [SPF](#how-do-i-set-up-spf-for-forward-email)-, [DKIM](#how-do-i-set-up-dkim-for-forward-email)- og [DMARC](#how-do-i-set-up-dmarc-for-forward-email)-poster.

## Introduksjon {#introduction}

### Hva er videresendt e-post {#what-is-forward-email}

> \[!NOTE]
> Videresend e-post er perfekt for enkeltpersoner, små bedrifter og utviklere som ønsker profesjonelle e-postadresser uten kostnadene og vedlikeholdet av en komplett e-posthostingløsning.

Forward Email er en **fullverdig e-posttjenesteleverandør** og **e-posthotellleverandør for tilpassede domenenavn**.

Det er den eneste gratis tjenesten med åpen kildekode, og lar deg bruke e-postadresser med tilpassede domener uten kompleksiteten ved å sette opp og vedlikeholde din egen e-postserver.

Tjenesten vår videresender e-poster sendt til ditt tilpassede domene til din eksisterende e-postkonto – og du kan til og med bruke oss som din dedikerte e-posthotellleverandør.

Viktige funksjoner for videresendt e-post:

* **E-post med tilpasset domene**: Bruk profesjonelle e-postadresser med ditt eget domenenavn
* **Gratisnivå**: Grunnleggende videresending av e-post uten kostnad
* **Forbedret personvern**: Vi leser ikke e-postene dine eller selger dataene dine
* **Åpen kildekode**: Hele kodebasen vår er tilgjengelig på GitHub
* **Støtte for SMTP, IMAP og POP3**: Fullstendige muligheter for sending og mottak av e-post
* **End-to-End-kryptering**: Støtte for OpenPGP/MIME
* **Tilpassede Catch-All-aliaser**: Opprett et ubegrenset antall e-postaliaser

Du kan sammenligne oss med over 56 andre e-postleverandører på [vår side for e-postsammenligning](/blog/best-email-service).

> \[!TIP]
> Lær mer om videresending av e-post ved å lese vår gratis [Teknisk hvitbok](/technical-whitepaper.pdf)

### Hvem bruker videresending av e-post {#who-uses-forward-email}

Vi tilbyr e-posthosting og videresending av e-post til over 500 000 domener og disse bemerkelsesverdige brukerne:

| Kunde | Casestudie |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Det amerikanske marineakademiet | [:page_facing_up: Case Study](/blog/docs/federal-government-email-service-section-889-compliant) |
| Kanonisk | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Netflix-spill |  |
| Linux-stiftelsen | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| PHP-stiftelsen |  |
| Fox News Radio |  |
| Disney-annonsesalg |  |
| jQuery | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| LineageOS |  |
| Ubuntu | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Gratis | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Lubuntu | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Universitetet i Cambridge | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Universitetet i Maryland | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Universitetet i Washington | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Tufts University | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Swarthmore College | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Sør-Australias regjering |  |
| Den dominikanske republikks regjering |  |
| Fly<span>.</span>io |  |
| RCD-hoteller |  |
| Isaac Z. Schlueter (npm) | [:page_facing_up: Case Study](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |  |

### Hva er historikken for videresendte e-poster {#what-is-forward-emails-history}

Du kan finne ut mer om videresending av e-post på [vår Om-side](/about).

### Hvor rask er denne tjenesten {#how-fast-is-this-service}

> \[!NOTE]
> Systemet vårt er utviklet for hastighet og pålitelighet, med flere redundante servere for å sikre at e-postene dine leveres raskt.

Videresend e-post leverer meldinger med minimal forsinkelse, vanligvis innen sekunder etter mottak.

Ytelsesmålinger:

* **Gjennomsnittlig leveringstid**: Mindre enn 5–10 sekunder fra mottak til videresending ([se vår side for overvåking av tid til innboks «TTI»](/tti))
* **Oppetid**: 99,9 %+ tjenestetilgjengelighet
* **Global infrastruktur**: Servere strategisk plassert for optimal ruting
* **Automatisk skalering**: Systemet vårt skalerer i perioder med høy e-postbelastning

Vi opererer i sanntid, i motsetning til andre leverandører som er avhengige av forsinkede køer.

Vi skriver ikke til disk eller lagrer logger – med [unntak av feil](#do-you-store-error-logs) og [utgående SMTP](#do-you-support-sending-email-with-smtp) (se vår [Personvernerklæring](/privacy)).

Alt gjøres i minnet og [kildekoden vår er på GitHub](https://github.com/forwardemail).

## E-postklienter {#email-clients}

### Thunderbird {#thunderbird}

1. Opprett et nytt alias og generer et passord i dashbordet for videresending av e-post.
2. Åpne Thunderbird og gå til **Rediger → Kontoinnstillinger → Kontohandlinger → Legg til e-postkonto**
3. Skriv inn navn, videresendings-e-postadresse og passord.
4. Klikk på **Konfigurer manuelt** og skriv inn:
* Innkommende: IMAP, `imap.forwardemail.net`, port 993, SSL/TLS
* Utgående: SMTP, `smtp.forwardemail.net`, port 587, STARTTLS
5. Klikk på **Ferdig**

### Microsoft Outlook {#microsoft-outlook}

1. Opprett et nytt alias og generer et passord i dashbordet for videresending av e-post.
2. Gå til **Fil → Legg til konto**
3. Skriv inn e-postadressen din for videresending og klikk på **Koble til**
4. Velg **Avanserte alternativer** og velg **La meg sette opp kontoen min manuelt**
5. Velg **IMAP** og skriv inn:
* Innkommende: `imap.forwardemail.net`, port 993, SSL
* Utgående: `smtp.forwardemail.net`, port 587, TLS
* Brukernavn: Din fullstendige e-postadresse
* Passord: Ditt genererte passord
6. Klikk på **Koble til**

### Apple Mail {#apple-mail}

1. Opprett et nytt alias og generer et passord i dashbordet for videresending av e-post.
2. Gå til **E-post → Innstillinger → Kontoer → +**
3. Velg **Annen e-postkonto**
4. Skriv inn navn, videresendings-e-postadresse og passord.
5. For serverinnstillinger skriver du inn:
* Innkommende: `imap.forwardemail.net`
* Utgående: `smtp.forwardemail.net`
* Brukernavn: Din fullstendige e-postadresse.
* Passord: Ditt genererte passord.
6. Klikk på **Logg på**

### Mobilenheter {#mobile-devices}

For iOS:

1. Gå til **Innstillinger → E-post → Kontoer → Legg til konto → Annet**
2. Trykk på **Legg til e-postkonto** og skriv inn detaljene dine
3. For serverinnstillinger, bruk de samme IMAP- og SMTP-innstillingene som ovenfor

For Android:

1. Gå til **Innstillinger → Kontoer → Legg til konto → Personlig (IMAP)**
2. Skriv inn e-postadressen din for videresending og passord
3. Bruk de samme IMAP- og SMTP-innstillingene som ovenfor for serverinnstillinger

### Slik sender du e-post som bruker Gmail {#how-to-send-mail-as-using-gmail}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Anslått oppsetttid:</strong>
<span>Mindre enn 10 minutter</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Komme i gang:
</strong>
<span>
Hvis du har fulgt instruksjonene ovenfor under <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Hvordan kommer jeg i gang og konfigurerer videresending av e-post</a>, kan du fortsette å lese nedenfor.
</span>
</div>

<div id="send-e-post-som-innhold">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktig:
</strong>
<span>
Sørg for at du har lest våre <a href="/terms" class="alert-link" target="_blank">vilkår</a>, <a href="/privacy" class="alert-link" target="_blank">personvernerklæring</a> og <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">utgående SMTP-grenser</a> – din bruk anses som bekreftelse og samtykke.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktig:
</strong>
<span>
Hvis du er en utvikler, kan du se våre <a class="alert-link" href="/email-api#outbound-emails" target="_blank">dokumentasjoner for e-post-API</a>.
</span>
</div>

1. Gå til <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Innstillinger <i class="fa fa-angle-right"></i> Utgående SMTP-konfigurasjon og følg konfigurasjonsinstruksjonene.

2. Opprett et nytt alias for domenet ditt under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Aliaser (f.eks. <code><hello@example.com></code>)

3. Klikk på <strong class="text-success"><i class="fa fa-key"></i>Generer passord</strong> ved siden av det nyopprettede aliaset. Kopier til utklippstavlen og lagre det genererte passordet som vises på skjermen på en sikker måte.

4. Gå til [Gmail](https://gmail.com) og under [Innstillinger <i class="fa fa-angle-right"></i> Kontoer og import <i class="fa fa-angle-right"></i> Send e-post som](https://mail.google.com/mail/u/0/#settings/accounts) klikker du på «Legg til en annen e-postadresse».

5. Når du blir bedt om «Navn», skriver du inn navnet du vil at e-posten din skal sees som «Fra» (f.eks. «Linus Torvalds»).

6. Når du blir bedt om «E-postadresse», skriver du inn hele e-postadressen til et alias du opprettet under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Aliaser (f.eks. <code><hello@example.com></code>)

7. Fjern merket for «Behandle som et alias»

8. Klikk på «Neste trinn» for å fortsette

9. Når du blir bedt om å oppgi «SMTP-server», skriver du inn <code>smtp.forwardemail.net</code> og lar porten være <code>587</code>

10. Når du blir bedt om «Brukernavn», skriver du inn hele e-postadressen til et alias du opprettet under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Aliaser (f.eks. <code><hello@example.com></code>)

11. Når du blir bedt om «Passord», limer du inn passordet fra <strong class="text-success"><i class="fa fa-key"></i> Generer passord</strong> i trinn 3 ovenfor.

12. La alternativknappen være avmerket for «Sikker tilkobling med TLS»

13. Klikk på «Legg til konto» for å fortsette

14. Åpne en ny fane til [Gmail](https://gmail.com) og vent på at bekreftelses-e-posten din skal komme (du vil motta en bekreftelseskode som bekrefter at du er eieren av e-postadressen du prøver å «Sende e-post som»).

15. Når den ankommer, kopier og lim inn bekreftelseskoden ved forespørselen du fikk i forrige trinn

16. Når du har gjort det, går du tilbake til e-posten og klikker på lenken for å «bekrefte forespørselen». Du må mest sannsynlig gjøre dette trinnet og det forrige trinnet for at e-posten skal bli riktig konfigurert.

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

### Hva er den eldre gratisveiledningen for Send e-post som med Gmail {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Viktig:</strong> Denne eldre gratisveiledningen er utdatert fra mai 2023 siden <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">we nå støtter utgående SMTP</a>. Hvis du bruker veiledningen nedenfor, vil <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">this føre til at den utgående e-posten din</a> viser "<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>" i Gmail.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Anslått oppsetttid:</strong>
<span>Mindre enn 10 minutter</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Komme i gang:
</strong>
<span>
Hvis du har fulgt instruksjonene ovenfor under <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Hvordan kommer jeg i gang og konfigurerer videresending av e-post</a>, kan du fortsette å lese nedenfor.
</span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="Slik sender du e-post som ved hjelp av Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>"

<div id="arv-gratis-guide">

1. Du må ha aktivert [Gmails tofaktorautentisering][gmail-2fa] for at dette skal fungere. Gå til <https://www.google.com/landing/2step/> hvis du ikke har det aktivert.

2. Når tofaktorautentisering er aktivert (eller hvis du allerede hadde det aktivert), går du til <https://myaccount.google.com/apppasswords>.

3. Når du blir bedt om å velge «Velg appen og enheten du vil generere apppassordet for»:
* Velg «E-post» i rullegardinmenyen for «Velg app»
* Velg «Annet» i rullegardinmenyen for «Velg enhet»
* Når du blir bedt om å skrive inn tekst, skriver du inn e-postadressen til det tilpassede domenet du videresender fra (f.eks. <kode><hello@example.com></kode> – dette vil hjelpe deg med å holde oversikt hvis du bruker denne tjenesten for flere kontoer)

4. Kopier passordet til utklippstavlen som genereres automatisk.
<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktig:
</strong>
<span>
Hvis du bruker G Suite, kan du gå til administrasjonspanelet ditt <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Apper <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Innstillinger for Gmail <i class="fa fa-angle-right"></i> Innstillinger</a> og sørge for å merke av for "Tillat brukere å sende e-post via en ekstern SMTP-server...". Det vil være litt forsinkelse før denne endringen aktiveres, så vent noen minutter.
</span>
</div>

5. Gå til [Gmail](https://gmail.com) og under [Innstillinger <i class="fa fa-angle-right"></i> Kontoer og import <i class="fa fa-angle-right"></i> Send e-post som](https://mail.google.com/mail/u/0/#settings/accounts) klikker du på «Legg til en annen e-postadresse».

6. Når du blir bedt om «Navn», skriver du inn navnet du vil at e-posten din skal sees som «Fra» (f.eks. «Linus Torvalds»)

7. Når du blir bedt om «E-postadresse», skriver du inn e-postadressen med det egendefinerte domenet du brukte ovenfor (f.eks. <kode><hello@example.com></kode>)

8. Fjern merket for «Behandle som et alias»

9. Klikk på «Neste trinn» for å fortsette

10. Når du blir bedt om å oppgi «SMTP-server», skriver du inn <code>smtp.gmail.com</code> og lar porten være <code>587</code>

11. Når du blir bedt om «Brukernavn», skriver du inn den delen av Gmail-adressen din uten <span>gmail.com</span>-delen (f.eks. bare «bruker» hvis e-postadressen min er <span><bruker@gmail.com></span>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktig:
</strong>
<span>
Hvis «Brukernavn»-delen fylles ut automatisk, <u><strong>må du endre dette</strong></u> til brukernavn-delen av Gmail-adressen din i stedet.
</span>
</div>

12. Når du blir bedt om å skrive inn «Passord», limer du inn passordet du genererte i trinn 2 ovenfor fra utklippstavlen.

13. La alternativknappen være avmerket for «Sikker tilkobling med TLS»

14. Klikk på «Legg til konto» for å fortsette

15. Åpne en ny fane til [Gmail](https://gmail.com) og vent på at bekreftelses-e-posten din skal komme (du vil motta en bekreftelseskode som bekrefter at du er eieren av e-postadressen du prøver å «Sende e-post som»).

16. Når den ankommer, kopier og lim inn bekreftelseskoden ved forespørselen du fikk i forrige trinn

17. Når du har gjort det, går du tilbake til e-posten og klikker på lenken for å «bekrefte forespørselen». Du må mest sannsynlig gjøre dette trinnet og det forrige trinnet for at e-posten skal bli riktig konfigurert.

</div>

### Avansert konfigurasjon av Gmail-ruting {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Anslått oppsetttid:</strong>
<span>15–30 minutter</span>
</div>

Hvis du vil konfigurere avansert ruting i Gmail slik at aliaser som ikke samsvarer med en postboks videresender til e-postutvekslingene til Videresend e-post, følger du disse trinnene:

1. Logg på Google-administrasjonskonsollen din på [admin.google.com](https://admin.google.com)
2. Gå til **Apper → Google Workspace → Gmail → Ruting**
3. Klikk på **Legg til rute** og konfigurer følgende innstillinger:

**Innstillinger for enkeltmottaker:**

* Velg «Endre konvoluttmottaker» og skriv inn din primære Gmail-adresse.
* Merk av for «Legg til X-Gm-Original-To-overskrift med originalmottaker».

**Mottakermønstre for konvolutt:**

* Legg til et mønster som samsvarer med alle ikke-eksisterende postkasser (f.eks. `.*@yourdomain.com`)

**Innstillinger for e-postserver:**

* Velg «Rute til vert» og skriv inn `mx1.forwardemail.net` som primærserver
* Legg til `mx2.forwardemail.net` som backupserver
* Sett port til 25
* Velg «Krev TLS» for sikkerhet

4. Klikk på **Lagre** for å opprette ruten

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktig:
</strong>
<span>
Denne konfigurasjonen fungerer bare for Google Workspace-kontoer med egendefinerte domener, ikke for vanlige Gmail-kontoer.
</span>
</div>

### Avansert konfigurasjon av Outlook-ruting {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Anslått oppsetttid:</strong>
<span>15–30 minutter</span>
</div>

For Microsoft 365-brukere (tidligere Office 365) som ønsker å konfigurere avansert ruting slik at aliaser som ikke samsvarer med en postboks videresender til e-postutvekslingene for Videresend e-post:

1. Logg på Microsoft 365-administrasjonssenteret på [admin.microsoft.com](https://admin.microsoft.com)
2. Gå til **Exchange → E-postflyt → Regler**
3. Klikk på **Legg til en regel** og velg **Opprett en ny regel**
4. Navngi regelen din (f.eks. "Videresend ikke-eksisterende postbokser til Videresend e-post")
5. Under **Bruk denne regelen hvis** velger du:
* "Mottakeradressen samsvarer med..."
* Skriv inn et mønster som samsvarer med alle adressene på domenet ditt (f.eks. `*@yourdomain.com`)
6. Under **Gjør følgende** velger du:
* "Omdiriger meldingen til..."
* Velg "Følgende e-postserver"
* Skriv inn `mx1.forwardemail.net` og port 25
* Legg til `mx2.forwardemail.net` som en sikkerhetskopiserver
7. Under **Unntatt hvis** velger du:
* "Mottakeren er..."
* Legg til alle eksisterende postbokser som ikke skal videresendes
8. Angi regelprioriteten for å sikre at den kjører etter andre regler for e-postflyt
9. Klikk på **Lagre** for å aktiver regelen

## Feilsøking {#troubleshooting}

### Hvorfor mottar jeg ikke test-e-postene mine {#why-am-i-not-receiving-my-test-emails}

Hvis du sender en test-e-post til deg selv, kan det hende at den ikke vises i innboksen din fordi den har samme «Meldings-ID»-overskrift.

Dette er et allment kjent problem, og det påvirker også tjenester som Gmail. <a href="https://support.google.com/a/answer/1703601">Here er det offisielle svaret fra Gmail angående dette problemet</a>.

Hvis du fortsetter å ha problemer, er det mest sannsynlig et problem med DNS-forplantningen. Du må vente litt lenger og prøve på nytt (eller prøve å angi en lavere TTL-verdi på <strong class="notranslate">TXT</strong>-oppføringene dine).

**Har du fortsatt problemer?** <a href="/help">kontakt oss</a> slik at vi kan undersøke problemet og finne en rask løsning.

### Hvordan konfigurerer jeg e-postklienten min til å fungere med videresendt e-post {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
Tjenesten vår fungerer med populære e-postklienter som:
<ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
<li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android™</a></li>
<li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux™</a></li>
<li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> Skrivebord</a></li>
<li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> Mozilla Firefox®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i>Google Chrome®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i>Terminal</a></li>
</ul>
</div>

<div class="alert alert-primary">
Brukernavnet ditt er e-postadressen til aliaset ditt, og passordet er fra <strong class="text-success"><i class="fa fa-key"></i> Generer passord</strong> ("Vanlig passord").
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>Hvis du bruker Thunderbird, må du sørge for at «Tilkoblingssikkerhet» er satt til «SSL/TLS» og at autentiseringsmetoden er satt til «Vanlig passord».</span>
</div>

| Type | Vertsnavn | Protokoll | Porter |
| :--: | :---------------------: | :-------------------------------------: | :----------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` | SSL/TLS **Foretrukket** | `993` og `2993` |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **Foretrukket** eller TLS (STARTTLS) | `465` og `2465` for SSL/TLS (eller) `587`, `2587`, `2525` og `25` for TLS (STARTTLS) |

### Hvorfor havner e-postene mine i søppelpost og søppelpost, og hvordan kan jeg sjekke domenets omdømme? {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}

Denne delen veileder deg hvis utgående e-post bruker SMTP-serverne våre (f.eks. `smtp.forwardemail.net`) (eller videresendes via `mx1.forwardemail.net` eller `mx2.forwardemail.net`) og den leveres i søppelpost- eller søppelpostmappen til mottakerne.

Vi overvåker rutinemessig [IP-adresser](#what-are-your-servers-ip-addresses) mot [alle anerkjente DNS-avvisningslister](#how-do-you-handle-your-ip-addresses-becoming-blocked), **derfor er det mest sannsynlig et domenespesifikt omdømmeproblem**.

E-poster kan havne i spam-mapper av flere grunner:

1. **Mangler autentisering**: Konfigurer [SPF](#how-do-i-set-up-spf-for-forward-email)-, [DKIM](#how-do-i-set-up-dkim-for-forward-email)- og [DMARC](#how-do-i-set-up-dmarc-for-forward-email)-postene.

2. **Domeneomdømme**: Nye domener har ofte et nøytralt omdømme inntil de etablerer en avsenderhistorikk.

3. **Innholdsutløsere**: Enkelte ord eller uttrykk kan utløse spamfiltre.

4. **Sendemønstre**: Plutselige økninger i e-postvolumet kan virke mistenkelige.

Du kan prøve å bruke ett eller flere av disse verktøyene for å sjekke domenets omdømme og kategorisering:

| Verktøynavn | URL | Type |
| ------------------------------------------- | ---------------------------------------------------------------- | ---------------------- |
| Tilbakemelding om kategorisering av Cloudflare-domener | <https://radar.cloudflare.com/domains/feedback> | Kategorisering |
| Spamhaus IP- og domeneomdømmesjekker | <https://check.spamhaus.org/> | DNSBL |
| Cisco Talos IP- og domeneomdømmesenter | <https://talosintelligence.com/reputation_center> | Rykte |
| Barracuda IP og domeneomdømmeoppslag | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL |
| MX Toolbox svartelistesjekk | <https://mxtoolbox.com/blacklists.aspx> | Svarteliste |
| Google Postmaster-verktøy | <https://www.gmail.com/postmaster/> | Rykte |
| Yahoo Sender Hub | <https://senders.yahooinc.com/> | Rykte |
| MultiRBL.valli.org svartelistesjekk | <https://multirbl.valli.org/lookup/> | DNSBL |
| Avsenderpoengsum | <https://senderscore.org/act/blocklist-remover/> | Rykte |
| Verdsettelse | <https://www.invaluement.com/lookup/> | DNSBL |
| SURBL | <https://www.surbl.org/> | DNSBL |
| Fjerning av Apple/Proofpoint IP | <https://ipcheck.proofpoint.com/> | Fjerning |
| Fjerning av Cloudmark IP | <https://csi.cloudmark.com/en/reset/> | Fjerning |
| SpamCop | <https://www.spamcop.net/bl.shtml> | DNSBL |
| Fjerning av IP-adresser i Microsoft Outlook og Office 365 | <https://sendersupport.olc.protection.outlook.com/pm/Postmaster> | Fjerning |
| UCEPROTECTs nivåer 1, 2 og 3 | <https://www.uceprotect.net/en/rblcheck.php> | DNSBL |
| UCEPROTECTs backscatterer.org | <https://www.backscatterer.org/> | Beskyttelse mot tilbakespredning |
| UCEPROTECTs hviteliste.org | <https://www.whitelisted.org/> (krever et gebyr) | DNSWL |
| AT&T | `abuse_rbl@abuse-att.net` | Fjerning |
| AOL/Verizon (f.eks. `[IPTS04]`) | <https://senders.yahooinc.com/> | Fjerning |
| Cox Communications | `unblock.request@cox.net` | Fjerning |
| t-online.de (tysk/T-Mobile) | `tobr@rx.t-online.de` | Fjerning |

> \[!TIP]
> Start med et lavt volum av e-poster av høy kvalitet for å bygge et positivt omdømme før du sender inn større volumer.

> \[!IMPORTANT]
> Hvis domenet ditt er på en svarteliste, har hver svarteliste sin egen fjerningsprosess. Sjekk nettsidene deres for instruksjoner.

> \[!TIP]
> Hvis du trenger ytterligere hjelp eller finner ut at vi er falskt positivt oppført som spam av en bestemt e-postleverandør, kan du <a href="/help">kontakte oss</a>.

### Hva bør jeg gjøre hvis jeg mottar spam-e-poster {#what-should-i-do-if-i-receive-spam-emails}

Du bør melde deg av e-postlisten (hvis mulig) og blokkere avsenderen.

Ikke rapporter meldingen som spam, men videresend den i stedet til vårt manuelt kuraterte og personvernfokuserte system for forebygging av misbruk.

**E-postadressen du skal videresende spam til er:** <abuse@forwardemail.net>

### Hvorfor vises test-e-postene som sendes til meg i Gmail som «mistenkelige» {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Hvis du ser denne feilmeldingen i Gmail når du sender en test til deg selv, eller når en person du sender e-post til med aliaset ditt ser en e-post fra deg for første gang, **ikke bekymre deg** – da dette er en innebygd sikkerhetsfunksjon i Gmail.

Du kan ganske enkelt klikke på «Ser trygt ut». Hvis du for eksempel skulle sende en testmelding ved hjelp av «send e-post som»-funksjonen (til noen andre), vil de ikke se denne meldingen.

Men hvis de ser denne meldingen, er det fordi de vanligvis var vant til å se e-postene dine komme fra <john@gmail.com> i stedet for <john@customdomain.com> (bare et eksempel). Gmail vil varsle brukerne bare for å forsikre seg om at ting er trygt, i tilfelle det ikke finnes noen løsning.

### Kan jeg fjerne via forwardemail punktum nett i Gmail {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

Dette emnet er relatert til en [et allment kjent problem i Gmail der ekstra informasjon vises ved siden av avsendernavnet](https://support.google.com/mail/answer/1311182).

Fra mai 2023 støtter vi sending av e-post med SMTP som et tillegg for alle betalende brukere – som betyr at du kan fjerne <span class="notranslate">via forwardemail dot net</span> i Gmail.

Merk at dette vanlige emnet er spesifikt for de som bruker [Slik sender du e-post som ved hjelp av Gmail](#how-to-send-mail-as-using-gmail)-funksjonen.

Se delen om [Støtter dere sending av e-post med SMTP](#do-you-support-sending-email-with-smtp) for konfigurasjonsinstruksjoner.

## Datahåndtering {#data-management}

### Hvor er serverne dine plassert {#where-are-your-servers-located}

> \[!TIP]
> Vi kan snart annonsere hvor vårt EU-datasenter ligger under [forwardemail.eu](https://forwardemail.eu). Abonner på diskusjonen på <https://github.com/orgs/forwardemail/discussions/336> for oppdateringer.

Serverne våre er hovedsakelig plassert i Denver, Colorado – se <https://forwardemail.net/ips> for en fullstendig liste over IP-adresser.

Du kan finne ut mer om underdatabehandlerne våre på sidene våre [GDPR](/gdpr), [DPA](/dpa) og [Privatliv](/privacy).

### Hvordan eksporterer og sikkerhetskopierer jeg postkassen min {#how-do-i-export-and-backup-my-mailbox}

Du kan når som helst eksportere postkassene dine som [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions)-, [Mbox](https://en.wikipedia.org/wiki/Mbox)- eller krypterte [SQLite](https://en.wikipedia.org/wiki/SQLite)-formater.

Gå til <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Aliaser <i class="fa fa-angle-right"></i> Last ned sikkerhetskopi og velg ønsket eksportformattype.

Du vil motta en e-post med en lenke for å laste ned eksporten når den er ferdig.

Merk at denne nedlastingslenken for eksport utløper etter 4 timer av sikkerhetshensyn.

Hvis du trenger å inspisere de eksporterte EML- eller Mbox-formatene dine, kan disse verktøyene med åpen kildekode være nyttige:

| Navn | Format | Plattform | GitHub-URL |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| MBox Viewer | Mbox | Vinduer | <https://github.com/ename/mboxviewer> |
| mbox-web-viewer | Mbox | Alle plattformer | <https://github.com/PHMRanger/mbox-web-viewer> |
| EmlReader | EML | Vinduer | <https://github.com/ayamadori/EmlReader> |
| E-postvisning | EML | VS-kode | <https://github.com/joelharkes/vscode_email_viewer> |
| eml-leser | EML | Alle plattformer | <https://github.com/s0ph1e/eml-reader> |

Hvis du i tillegg trenger å konvertere en Mbox-fil til en EML-fil, kan du bruke <https://github.com/noelmartinon/mboxzilla>.

### Hvordan importerer og migrerer jeg min eksisterende postboks {#how-do-i-import-and-migrate-my-existing-mailbox}

Du kan enkelt importere e-posten din til Videresend e-post (f.eks. ved å bruke [Thunderbird](https://www.thunderbird.net)) med instruksjonene nedenfor:

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

| E-postleverandør | Eksportformat | Eksportinstruksjoner |
| -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gmail | MBOX | <https://takeout.google.com/settings/takeout/custom/gmail> |
| Utsikter | PST | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Tips:</strong> <span>Hvis du bruker Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">PST-eksportformat</a>), kan du ganske enkelt følge instruksjonene under «Annet» nedenfor. Vi har imidlertid lagt til lenker nedenfor for å konvertere PST til MBOX/EML-format basert på operativsystemet ditt:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba for Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst for Windows cygwin</a> – (f.eks. <code>readpst -u -o $OUT_DIR $IN_DIR</code> erstatter <code>$OUT_DIR</code> og <code>$IN_DIR</code> med output-katalogen og input-katalogen) stier henholdsvis).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst for Ubuntu/Linux</a> – (f.eks. <code>sudo apt-get install readpst</code> og deretter <code>readpst -u -o $OUT_DIR $IN_DIR</code>, og erstatter <code>$OUT_DIR</code> og <code>$IN_DIR</code> med henholdsvis stiene til utdatakatalogen og inndatakatalogen).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst for macOS (via brew)</a> – (f.eks. <code>brew install libpst</code> og deretter <code>readpst -u -o $OUT_DIR $IN_DIR</code>, og erstatter <code>$OUT_DIR</code> og <code>$IN_DIR</code> med henholdsvis stiene til utdatakatalogen og inndatakatalogen).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">PST-konverter for Windows (GitHub)</a></li></ul><br /></span></div> |
| Apple Mail | MBOX | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974> |
| Fastmail | EML | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail> |
| Proton Mail | MBOX/EML | <https://proton.me/support/export-emails-import-export-app> |
| Tutanota | EML | <https://github.com/crepererum-oss/tatutanatata> |
| Synes | EML | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents> |
| Zoho | EML | <https://www.zoho.com/mail/help/import-export-emails.html#alink2> |
| Annen | [Use Thunderbird](https://www.thunderbird.net) | Konfigurer din eksisterende e-postkonto i Thunderbird, og bruk deretter [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/)-pluginen for å eksportere og importere e-posten din. **Du kan kanskje også ganske enkelt kopiere/lime inn eller dra/slippe e-poster mellom én konto og en annen.** |

2. Last ned, installer og åpne [Thunderbird](https://www.thunderbird.net).

3. Opprett en ny konto med den fullstendige e-postadressen til aliaset ditt (f.eks. <kode><du@dittdomene.com></kode>) og det genererte passordet ditt. <strong>Hvis du ikke har et generert passord ennå, <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">se konfigurasjonsinstruksjonene våre</a></strong>.

4. Last ned og installer [ImportEksportVerktøy AV](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) Thunderbird-pluginen.

5. Opprett en ny lokal mappe i Thunderbird, og høyreklikk deretter på den → velg alternativet `ImportExportTools NG` → velg `Import mbox file` (for MBOX-eksportformat) – eller – `Import messages` / `Import all messages from a directory` (for EML-eksportformat).

6. Dra/slipp fra den lokale mappen til en ny (eller eksisterende) IMAP-mappe i Thunderbird som du ønsker å laste opp meldinger til i IMAP-lagring med tjenesten vår. Dette vil sikre at de sikkerhetskopieres på nett med vår SQLite-krypterte lagring.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>
Hvis du er usikker på hvordan du importerer til Thunderbird, kan du se de offisielle instruksjonene på <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> og <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktig:
</strong>
<span>
Når du har fullført eksport- og importprosessen, kan det også være lurt å aktivere videresending på din eksisterende e-postkonto og sette opp en automatisk svarer for å varsle avsendere om at du har en ny e-postadresse (f.eks. hvis du tidligere brukte Gmail og nå bruker en e-post med ditt egendefinerte domenenavn).
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

### Støtter du egenhosting? {#do-you-support-self-hosting}

Ja, fra og med mars 2025 støtter vi et selvhostet alternativ. Les bloggen [her](https://forwardemail.net/blog/docs/self-hosted-solution). Sjekk ut [selvbetjent guide](https://forwardemail.net/self-hosted) for å komme i gang. Og for de som er interessert i en mer detaljert trinnvis versjon, se våre [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu)- eller [Debian](https://forwardemail.net/guides/selfhosted-on-debian)-baserte guider.

## E-postkonfigurasjon {#email-configuration}

### Hvordan kommer jeg i gang og konfigurerer videresending av e-post {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Anslått oppsetttid:</strong>
<span>Mindre enn 10 minutter</span>
</div>

<div class="alert my-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Komme i gang:
</strong>
<span>
Les nøye og følg trinn én til åtte nedenfor. Sørg for å erstatte e-postadressen <code>bruker@gmail.com</code> med e-postadressen du vil videresende e-poster til (hvis den ikke allerede er nøyaktig). Sørg også for å erstatte <code>eksempel.com</code> med ditt egendefinerte domenenavn (hvis det ikke allerede er nøyaktig).
</span>
</div>

<ol>
<li class="mb-2 mb-md-3 mb-lg-5">Hvis du allerede har registrert domenenavnet ditt et sted, må du hoppe over dette trinnet helt og gå til trinn to! Ellers kan du <a href="/domain-registration" rel="noopener noreferrer">klikke her for å registrere domenenavnet ditt</a>.</li>
<li class="mb-2 mb-md-3 mb-lg-5">
Husker du hvor du registrerte domenet ditt? Når du husker dette, følger du instruksjonene nedenfor:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktig:
</strong>
<span>
Du må åpne en ny fane og logge på domeneregistratoren din. Du kan enkelt klikke på "Registrator" nedenfor for å gjøre dette automatisk. I denne nye fanen må du navigere til DNS-administrasjonssiden hos registratoren din – og vi har gitt trinnvise navigasjonstrinnene nedenfor under kolonnen "Trinn for konfigurasjon". Når du har navigert til denne siden i den nye fanen, kan du gå tilbake til denne fanen og fortsette til trinn tre nedenfor.
<strong class="font-weight-bold">Ikke lukk den åpnede fanen ennå; du trenger den for fremtidige trinn!</strong>
</span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr> <th>Registrator</th> <th>Trinn for å konfigurere</th>
</tr> </thead> <tbody> <tr> <td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>"
<td>Logg inn <i class="fa fa-angle-right"></i> Domenesenter <i class="fa fa-angle-right"></i> (Velg domenet ditt) <i class="fa fa-angle-right"></i> Rediger DNS-innstillinger</td>
</tr>
<tr> <td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Rute 53</a></td>
<td>Logg inn <i class="fa fa-angle-right"></i> Hostede soner <i class="fa fa-angle-right"></i> (Velg ditt domene)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
<td>Logg inn <i class="fa fa-angle-right"></i> Mine servere <i class="fa fa-angle-right"></i> Domeneadministrasjon <i class="fa fa-angle-right"></i> DNS-administrator</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
<td>FOR ROCK: Logg inn <i class="fa fa-angle-right"></i> Domener <i class="fa fa-angle-right"></i> (Klikk på ▼-ikonet ved siden av for å administrere) <i class="fa fa-angle-right"></i> DNS
<br />
FOR ELDRE VERSJONER: Logg inn <i class="fa fa-angle-right"></i> Domener <i class="fa fa-angle-right"></i> Soneredigeringsprogram <i class="fa fa-angle-right"></i> (Velg domenet ditt)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
<td>Logg inn <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Gjort enkelt</a></td>
<td>Logg inn <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Velg domenet ditt)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>"
<td>Logg inn <i class="fa fa-angle-right"></i> (Velg domenet ditt) <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Administrer</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
<td>Logg inn <i class="fa fa-angle-right"></i> Nettverk <i class="fa fa-angle-right"></i> Domener <i class="fa fa-angle-right"></i> (Velg domenet ditt) <i class="fa fa-angle-right"></i> Mer <i class="fa fa-angle-right"></i> Administrer domene</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>"
<td>Logg inn <i class="fa fa-angle-right"></i> I kortvisningen klikker du på administrer på domenet ditt <i class="fa fa-angle-right"></i> I listevisningen klikker du på
tannhjulikonet <i class="fa fa-angle-right"></i> DNS og navneservere <i class="fa fa-angle-right"></i> DNS-poster</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>"
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon0 class="fa fa-play-circle"></i> Se</a>
</td>
<td>Logg inn <i class="fa fa-angle-right"></i> (Velg domenet ditt) <i class="fa fa-angle-right"></i> Administrer <i class="fa fa-angle-right"></i> (klikk på tannhjulikonet) <i class="fa fa-angle-right"></i> Klikk på DNS og navneservere i menyen til venstre</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon1
<td>Logg inn <i class="fa fa-angle-right"></i> Panel <i class="fa fa-angle-right"></i> Domener <i class="fa fa-angle-right"></i> Administrer domener <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon2
<td>Logg inn <i class="fa fa-angle-right"></i> Oversikt <i class="fa fa-angle-right"></i> Administrer <i class="fa fa-angle-right"></i> Enkel redigering <i class="fa fa-angle-right"></i> Oppføringer</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon3
<td>Logg inn <i class="fa fa-angle-right"></i> (Velg domenet ditt) <i class="fa fa-angle-right"></i> Administrasjon <i class="fa fa-angle-right"></i> Rediger sonen</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon4
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon5 class="fa fa-play-circle"></i> Overvåk</a>
</td>
<td>Logg inn <i class="fa fa-angle-right"></i> Administrer domenene mine <i class="fa fa-angle-right"></i> (Velg domenet ditt) <i class="fa fa-angle-right"></i> Administrer DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon6 Domener</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon7 class="fa fa-play-circle"></i> Overvåk</a>
</td>
<td>Logg inn <i class="fa fa-angle-right"></i> (Velg ditt domene) <i class="fa fa-angle-right"></i> Konfigurer DNS</td>
</tr>
<tr> <td> <a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon8
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon9 class="fa fa-play-circle"></i> Overvåk</a>
</td>
<td>Logg inn <i class="fa fa-angle-right"></i> Domeneliste <i class="fa fa-angle-right"></i> (Velg ditt domene) <i class="fa fa-angle-right"></i> Administrer <i class="fa fa-angle-right"></i> Avansert DNS</td>
</tr>
<tr> <td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>0"
<td>Logg inn <i class="fa fa-angle-right"></i> (Velg domenet ditt) <i class="fa fa-angle-right"></i> Konfigurer Netlify DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>1 Løsninger</a></td>
<td>Logg inn <i class="fa fa-angle-right"></i> Kontoadministrator <i class="fa fa-angle-right"></i> Mine domenenavn <i class="fa fa-angle-right"></i> (Velg domenet ditt) <i class="fa fa-angle-right"></i> Administrer <i class="fa fa-angle-right"></i> Endre hvor domenet peker <i class="fa fa-angle-right"></i> Avansert DNS</td>
</tr>
<tr>
<td>
<a rel="noopener" noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>2
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>3 class="fa fa-play-circle"></i> Overvåk</a>
</td>
<td>Logg inn <i class="fa fa-angle-right"></i> Administrerte domener <i class="fa fa-angle-right"></i> (Velg domenet ditt) <i class="fa fa-angle-right"></i> DNS-innstillinger</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>4
<td>Logg inn <i class="fa fa-angle-right"></i> Hjemmeny <i class="fa fa-angle-right"></i> Innstillinger <i class="fa fa-angle-right"></i> Domener <i class="fa fa-angle-right"></i> (Velg domenet ditt) <i class="fa fa-angle-right"></i>
Avanserte innstillinger <i class="fa fa-angle-right"></i> Tilpassede poster</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>5 Nå</a></td>
<td>Bruker "now" CLI <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>6
<td>Logg inn <i class="fa fa-angle-right"></i> Domeneside <i class="fa fa-angle-right"></i> (Velg domenet ditt) <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>7
<td>Logg inn <i class="fa fa-angle-right"></i> Domener-siden <i class="fa fa-angle-right"></i> (Klikk på <i class="fa fa-ellipsis-h"></i>-ikonet) <i class="fa fa-angle-right"></i> Velg Administrer DNS-oppføringer</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>8
<td>Logg inn <i class="fa fa-angle-right"></i> Domener <i class="fa fa-angle-right"></i> Mine domener</td>
</tr>
<tr>
<td>Annet</td>
<td>
<div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Viktig:</strong> Ser du ikke navnet på registraren din oppført her? Bare søk på Internett etter «hvordan endre DNS-oppføringer på $REGISTRAR» (erstatt $REGISTRAR med navnet på registraren din – f.eks. «hvordan endre DNS-oppføringer på GoDaddy» hvis du bruker GoDaddy).</div>
</td>
</tr>
</tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">Bruk registraren din sin DNS-administrasjonsside (den andre fanen du har åpnet), og angi følgende «MX»-oppføringer:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktig:
</strong>
<span>
Merk at det IKKE skal være andre MX-poster angitt. Begge postene vist nedenfor MÅ eksistere. Sørg for at det ikke er noen skrivefeil, og at du har stavet både mx1 og mx2 riktig. Hvis det allerede fantes MX-poster, må du slette dem fullstendig.

"TTL"-verdien trenger ikke å være 3600, den kan være en lavere eller høyere verdi om nødvendig.
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vert/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Prioritet</th> <th>Svar/Verdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td>MX</td> <td>0</td> <td><code>mx1.forwardemail.net</code></td> </tr> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td>
<td>MX</td> <td>0</td> <td><code>mx2.forwardemail.net</code></td> </tr> </tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Bruk registrarens DNS-administrasjonsside (den andre fanen du har åpnet), og angi følgende <strong class="notranslate">TXT</strong>-oppføring(er):

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktig:
</strong>
<span>
Hvis du har et betalt abonnement, må du hoppe over dette trinnet helt og gå til trinn fem! Hvis du ikke har et betalt abonnement, vil dine videresendte adresser være offentlig søkbare – gå til <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domener</a> og oppgrader domenet ditt til et betalt abonnement hvis ønskelig. Hvis du vil vite mer om betalte abonnementer, kan du se vår <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Pris-</a>-side. Ellers kan du fortsette å velge én eller flere kombinasjoner fra alternativ A til alternativ F som er oppført nedenfor. </span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Alternativ A:
</strong>
<span>
Hvis du videresender alle e-poster fra domenet ditt (f.eks. "alle@eksempel.com", "hallo@eksempel.com" osv.) til en spesifikk adresse "bruker@gmail.com":
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vert/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Verdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=bruker@gmail.com</code> </td> </tr> </tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>
Sørg for å erstatte verdiene ovenfor i «Verdi»-kolonnen med din egen e-postadresse. «TTL»-verdien trenger ikke å være 3600, den kan være en lavere eller høyere verdi om nødvendig. En lavere «time to live»-verdi («TTL») vil sikre at fremtidige endringer i DNS-postene dine spres raskere over hele Internett – tenk på dette som hvor lenge det vil bli bufret i minnet (i sekunder). Du kan lære mer om <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL på Wikipedia</a>.
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Alternativ B:
</strong>
<span>
Hvis du bare trenger å videresende én enkelt e-postadresse (f.eks. <code>hello@example.com</code> til <code>user@gmail.com</code>; dette vil også videresende "hello+test@example.com" til "user+test@gmail.com" automatisk):
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vert/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Verdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=hello:user@gmail.com</code> </td> </tr> </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Alternativ C:
</strong>
<span>
Hvis du videresender flere e-poster, bør du skille dem med komma:
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vert/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Verdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code> </td> </tr> </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Alternativ D:
</strong>
<span>
Du kan ha et uendelig antall videresendings-e-poster satt opp – bare sørg for at du ikke bryter over 255 tegn på én linje og starter hver linje med "forward-email=". Et eksempel er gitt nedenfor:
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vert/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Verdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code> </td> </tr> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td>
<td class="notranslate">TXT</td> <td> <code>forward-email=help:user@gmail.com,foo:user@gmail.com</code> </td> </tr> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code> </td> </tr> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td>
<code>videresendings-epost=info:bruker@gmail.com,pip:bruker@gmail.com</code>
</td>
</tr> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>videresendings-epost=feil:bruker@gmail.com,pip:bruker@gmail.com</code> </td> </tr> </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Alternativ E:
</strong>
<span>
Du kan også spesifisere et domenenavn i <strong class="notranslate">TXT</strong>-oppføringen din for å få global alias-videresending (f.eks. vil "bruker@eksempel.com" bli videresendt til "bruker@eksempel.net"):
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vert/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Verdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=example.net</code> </td> </tr> </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Alternativ F:
</strong>
<span>
Du kan til og med bruke webhooks som et globalt eller individuelt alias å videresende e-poster til. Se eksemplet og hele avsnittet om webhooks med tittelen <a href="#do-you-support-webhooks" class="alert-link">Støtter dere webhooks</a> nedenfor.
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vert/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Verdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code>
</td> </tr> </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Alternativ G:
</strong>
<span>
Du kan til og med bruke regulære uttrykk ("regex") for å matche aliaser og for å håndtere erstatninger for å videresende e-poster til. Se eksemplene og hele avsnittet om regex med tittelen <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Støtter dere regulære uttrykk eller regex</a> nedenfor?
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Trenger du avansert regex med substitusjon?</strong> Se eksemplene og hele avsnittet om regex med tittelen <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Støtter dere regulære uttrykk eller regex</a> nedenfor.
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Enkelt eksempel:</strong> Hvis jeg vil at alle e-poster som går til `linus@example.com` eller `torvalds@example.com` skal videresendes til `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vert/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Verdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code> </td> </tr> </tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktig:
</strong>
<span>
Oppsamlingsregler for videresending kan også beskrives som «gjennomfallende».
Dette betyr at innkommende e-poster som samsvarer med minst én spesifikk videresendingsregel, vil bli brukt i stedet for oppsamlingsregelen.
Spesifikke regler inkluderer e-postadresser og regulære uttrykk.
<br /><br />
For eksempel:
<br /> <code>forward-email=hello:first@gmail.com,second@gmail.com</code>
<br />
E-poster sendt til <code>hello@example.com</code> vil **ikke** bli videresendt til <code>second@gmail.com</code> (oppsamlingsregler) med denne konfigurasjonen, og i stedet bare bli levert til <code>first@gmail.com</code>.
</span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Bruk registrarens DNS-administrasjonsside (den andre fanen du har åpnet), og angi i tillegg følgende <strong class="notranslate">TXT</strong>-post:

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vert/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Verdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktig:
</strong>
<span>
Hvis du bruker Gmail (f.eks. Send e-post som) eller G Suite, må du legge til <code>include:_spf.google.com</code> i verdien ovenfor, for eksempel:
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
Merk at det er forskjell på "-all" og "~all". "-" indikerer at SPF-sjekken skal FEILE hvis den ikke samsvarer, og "~" indikerer at SPF-sjekken skal FEILE MYKT. Vi anbefaler å bruke "-all"-tilnærmingen for å forhindre domeneforfalskning.
<br /><br />
Du må kanskje også inkludere SPF-posten for verten du sender e-post fra (f.eks. Outlook).
</span>
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Verifiser DNS-oppføringene dine ved hjelp av verktøyet vårt «Verifiser oppføringer», som er tilgjengelig på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Oppsett.

Send en test-e-post for å bekrefte at den fungerer. Merk at det kan ta litt tid før DNS-oppføringene dine spres.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>
</span>
Hvis du ikke mottar test-e-poster, eller mottar en test-e-post som sier «Vær forsiktig med denne meldingen», kan du se svarene for henholdsvis <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Hvorfor mottar jeg ikke test-e-postene mine</a> og <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Hvorfor vises test-e-postene mine som sendes til meg i Gmail som «mistenkelige»</a>.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Hvis du ønsker å «Sende e-post som» fra Gmail, må du <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">se denne videoen</a></strong>, eller følge trinnene under <a href="#how-to-send-mail-as-using-gmail">How for å sende e-post som ved hjelp av Gmail</a> nedenfor.

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
Valgfrie tillegg er listet opp nedenfor. Merk at disse tilleggene er helt valgfrie og kanskje ikke nødvendige. Vi ønsket i det minste å gi deg ytterligere informasjon om nødvendig.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Valgfritt tillegg:
</strong>
<span>
Hvis du bruker funksjonen <a class="alert-link" href="#how-to-send-mail-as-using-gmail">How til å sende e-post som med Gmail</a>, kan det være lurt å legge deg selv til på en tillatelsesliste. Se <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">disse instruksjonene fra Gmail</a> om dette emnet.
</span>
</div>

### Kan jeg bruke flere MX-utvekslinger og -servere for avansert videresending {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Ja, men **du skal bare ha én MX-utveksling oppført i DNS-oppføringene dine**.

Ikke forsøk å bruke «Prioritet» som en måte å konfigurere flere MX-utvekslinger på.

I stedet må du konfigurere den eksisterende MX-utvekslingen din til å videresende e-post for alle ikke-samsvarende aliaser til tjenestens utvekslinger (`mx1.forwardemail.net` og/eller `mx2.forwardemail.net`).

Hvis du bruker Google Workspace og vil videresende alle ikke-samsvarende alias til tjenesten vår, kan du se <https://support.google.com/a/answer/6297084>.

Hvis du bruker Microsoft 365 (Outlook) og du vil videresende alle ikke-samsvarende aliaser til tjenesten vår, kan du se <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> og <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### Hvordan setter jeg opp en feriesvar (autosvar for fravær) {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

Gå til <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Aliaser og enten opprett eller rediger aliaset du vil konfigurere en ferieautoresponder for.

Du har muligheten til å konfigurere en startdato, sluttdato, emne og melding, og aktivere eller deaktivere det når som helst:

* Emne og melding i ren tekst støttes for øyeblikket (vi bruker `striptags`-pakken internt for å fjerne all HTML).

* Emne er begrenset til 100 tegn.

* Meldingen er begrenset til 1000 tegn.

* Oppsettet krever utgående SMTP-konfigurasjon (f.eks. må du konfigurere DKIM-, DMARC- og Return-Path DNS-oppføringer).

* Gå til <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Innstillinger <i class="fa fa-angle-right"></i> Utgående SMTP-konfigurasjon og følg oppsettinstruksjonene.

* Feriesvar kan ikke aktiveres på globale vanity-domenenavn (f.eks. støttes ikke [engangsadresser](/disposable-addresses)).
* Feriesvar kan ikke aktiveres for aliaser med jokertegn/oppsamlingstegn (`*`) eller regulære uttrykk.

I motsetning til e-postsystemer som `postfix` (f.eks. som bruker feriefilterutvidelsen `sieve`) – legger Videresend e-post automatisk til DKIM-signaturen din, dummy-sikrer tilkoblingsproblemer når du sender feriesvar (f.eks. på grunn av vanlige SSL/TLS-tilkoblingsproblemer og eldre vedlikeholdte servere), og støtter til og med Open WKD- og PGP-kryptering for feriesvar.

<!--
* For å forhindre misbruk trekkes det fra 1 utgående SMTP-kreditt for hver feriesvarmelding som sendes.
* Alle betalte kontoer inkluderer 300 kreditter per dag som standard. Hvis du trenger et større beløp, kan du kontakte oss.
-->

1. Vi sender bare én gang per [tillatelsesliste](#do-you-have-an-allowlist)-avsender hver 4. dag (som ligner på Gmails oppførsel).

* Redis-hurtigbufferen vår bruker fingeravtrykket `alias_id` og `sender`, mens `alias_id` er alias MongoDB-ID-en og `sender` enten er Fra-adressen (hvis den er på tillatelseslisten) eller rotdomenet i Fra-adressen (hvis den ikke er på tillatelseslisten). For enkelhets skyld er utløpet av dette fingeravtrykket i hurtigbufferen satt til 4 dager.

* Vår tilnærming med å bruke rotdomenet som er analysert i Fra-adressen for avsendere som ikke er på tillatelseslisten, forhindrer at misbruk fra relativt ukjente avsendere (f.eks. ondsinnede aktører) oversvømmer feriesvarmeldinger.

2. Vi sender bare når MAIL FROM og/eller From ikke er blanke og ikke inneholder (ikke store og små bokstaver) en [postmaster brukernavn](#what-are-postmaster-addresses) (delen før @-tegnet i en e-post).

3. Vi sender ikke hvis den opprinnelige meldingen hadde noen av følgende overskrifter (ikke store og små bokstaver):

* Overskrift for `auto-submitted` med en verdi som ikke er lik `no`.
* Overskrift for `x-auto-response-suppress` med en verdi på `dr`, `autoreply`, `auto-reply`, `auto_reply` eller `all`.
* Overskrift for `list-id`, `list-subscribe`, `no`0, `no`1, `no`2, `no`3, `no`4, `no`5, `no`6 eller `no`7 (uavhengig av verdi).
* Overskrift for `no`8 med verdien `no`9, `x-auto-response-suppress`0, `x-auto-response-suppress`1, `x-auto-response-suppress`2 eller `x-auto-response-suppress`3.

4. Vi sender ikke hvis e-postadressen MAIL FROM eller Fra slutter med `+donotreply`, `-donotreply`, `+noreply` eller `-noreply`.

5. Vi sender ikke hvis brukernavndelen for e-postadressen «Fra» var `mdaemon` og den hadde en overskrift som ikke skiller mellom store og små bokstaver, `X-MDDSN-Message`.

6. Vi sender ikke hvis det var en `content-type`-header for `multipart/report` som ikke skiller mellom store og små bokstaver.

### Hvordan konfigurerer jeg SPF for videresending av e-post {#how-do-i-set-up-spf-for-forward-email}

Bruk DNS-administrasjonssiden til registraren din, og angi følgende <strong class="notranslate">TXT</strong>-oppføring:

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vert/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Verdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktig:
</strong>
<span>
Hvis du bruker Gmail (f.eks. Send e-post som) eller G Suite, må du legge til <code>include:_spf.google.com</code> i verdien ovenfor, for eksempel:
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
Hvis du bruker Microsoft Outlook eller Live.com, må du legge til <code>include:spf.protection.outlook.com</code> i SPF <strong class="notranslate">TXT</strong>-oppføringen din, for eksempel:
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
Merk at det er forskjell på "-all" og "~all". "-" indikerer at SPF-sjekken skal FEILE hvis den ikke samsvarer, og "~" indikerer at SPF-sjekken skal FEILE MYKT. Vi anbefaler å bruke "-all"-tilnærmingen for å forhindre domeneforfalskning.
<br /><br />
Du må kanskje også inkludere SPF-posten for verten du sender e-post fra (f.eks. Outlook).
</span>
</div>

### Hvordan konfigurerer jeg DKIM for videresending av e-post {#how-do-i-set-up-dkim-for-forward-email}

Gå til <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Innstillinger <i class="fa fa-angle-right"></i> Utgående SMTP-konfigurasjon og følg konfigurasjonsinstruksjonene.

### Hvordan konfigurerer jeg DMARC for videresending av e-post {#how-do-i-set-up-dmarc-for-forward-email}

Gå til <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Innstillinger <i class="fa fa-angle-right"></i> Utgående SMTP-konfigurasjon og følg konfigurasjonsinstruksjonene.

### Hvordan kobler jeg til og konfigurerer kontaktene mine {#how-do-i-connect-and-configure-my-contacts}

**For å konfigurere kontaktene dine, bruk CardDAV-URL-en til:** `https://carddav.forwardemail.net` (eller bare `carddav.forwardemail.net` hvis klienten din tillater det)**

### Hvordan kobler jeg til og konfigurerer kalenderne mine {#how-do-i-connect-and-configure-my-calendars}

**For å konfigurere kalenderen din, bruk CalDAV-URL-en til:** `https://caldav.forwardemail.net` (eller bare `caldav.forwardemail.net` hvis klienten din tillater det)**

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Videresend e-postkalender CalDAV Thunderbird Eksempeloppsett" />

### Hvordan legger jeg til flere kalendere og administrerer eksisterende kalendere {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Hvis du vil legge til flere kalendere, legger du bare til en ny kalender-URL: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**sørg for å erstatte `calendar-name` med ønsket kalendernavn**)

Du kan endre navn og farge på en kalender etter at den er opprettet – bruk bare kalenderprogrammet du foretrekker (f.eks. Apple Mail eller [Thunderbird](https://thunderbird.net)).

### Hvordan konfigurerer jeg SRS for videresending av e-post {#how-do-i-set-up-srs-for-forward-email}

Vi konfigurerer automatisk [Avsenderomskrivingsplan](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") – du trenger ikke å gjøre dette selv.

### Hvordan konfigurerer jeg MTA-STS for videresending av e-post {#how-do-i-set-up-mta-sts-for-forward-email}

Se [vår seksjon om MTA-STS](#do-you-support-mta-sts) for mer innsikt.

### Hvordan legger jeg til et profilbilde i e-postadressen min {#how-do-i-add-a-profile-picture-to-my-email-address}

Hvis du bruker Gmail, følger du disse trinnene nedenfor:

1. Gå til <https://google.com> og logg ut av alle e-postkontoer.
2. Klikk på «Logg på», og klikk på «annen konto» i rullegardinmenyen.
3. Velg «Bruk en annen konto».
4. Velg «Opprett konto».
5. Velg «Bruk min nåværende e-postadresse i stedet».
6. Skriv inn e-postadressen til ditt tilpassede domenenavn.
7. Hent bekreftelses-e-posten som ble sendt til e-postadressen din.
8. Skriv inn bekreftelseskoden fra denne e-posten.
9. Fullfør profilinformasjonen for den nye Google-kontoen din.
10. Godta alle retningslinjer for personvern og bruksvilkår.
11. Gå til <https://google.com>, og klikk på profilikonet ditt øverst til høyre, og klikk på «endre»-knappen.
12. Last opp et nytt bilde eller en avatar for kontoen din.
13. Endringer vil ta omtrent 1–2 timer før de trer i kraft, men noen ganger kan de gå veldig raskt.
14. Send en test-e-post, så skal profilbildet vises.

## Avanserte funksjoner {#advanced-features}

### Støtter dere nyhetsbrev eller e-postlister for markedsføringsrelatert e-post? {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Ja, du kan lese mer på <https://forwardemail.net/guides/newsletter-with-listmonk>.

Vær oppmerksom på at for å opprettholde IP-omdømmet og sikre leveringsdyktighet, har Forward Email en manuell gjennomgangsprosess på domenebasis for **godkjenning av nyhetsbrev**. Send en e-post til <support@forwardemail.net> eller åpne en [hjelpforespørsel](https://forwardemail.net/help) for godkjenning. Dette tar vanligvis mindre enn 24 timer, og de fleste forespørsler blir behandlet innen 1–2 timer. I nær fremtid tar vi sikte på å gjøre denne prosessen umiddelbar med ytterligere spamkontroller og varsler. Denne prosessen sikrer at e-postene dine når innboksen og at meldingene dine ikke blir merket som spam.

### Støtter dere sending av e-post med API {#do-you-support-sending-email-with-api}}

Ja, fra mai 2023 støtter vi sending av e-post med API som et tillegg for alle betalende brukere.

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktig:
</strong>
<span>
Sørg for at du har lest våre <a href="/terms" class="alert-link" target="_blank">vilkår</a>, <a href="/privacy" class="alert-link" target="_blank">personvernerklæring</a> og <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">utgående SMTP-grenser</a> – din bruk anses som bekreftelse og samtykke.
</span>
</div>

Se delen vår om [E-poster](/email-api#outbound-emails) i API-dokumentasjonen vår for alternativer, eksempler og mer innsikt.

For å sende utgående e-post med API-et vårt, må du bruke API-tokenet ditt som er tilgjengelig under [Min sikkerhet](/my-account/security).

### Støtter dere mottak av e-post med IMAP {#do-you-support-receiving-email-with-imap}

Ja, fra og med 16. oktober 2023 støtter vi mottak av e-post via IMAP som et tillegg for alle betalende brukere. **Les vår grundige artikkel** om [hvordan vår krypterte SQLite-postbokslagringsfunksjon fungerer](/blog/docs/best-quantum-safe-encrypted-email-service).**

<div id="imap-instruksjoner">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktig:
</strong>
<span>
Sørg for at du har lest våre <a href="/terms" class="alert-link" target="_blank">vilkår</a> og <a href="/privacy" class="alert-link" target="_blank">personvernerklæring</a>. Din bruk anses som bekreftelse og samtykke.
</span>
</div>

1. Opprett et nytt alias for domenet ditt under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Aliaser (f.eks. <code><hello@example.com></code>)

2. Klikk på <strong class="text-success"><i class="fa fa-key"></i>Generer passord</strong> ved siden av det nyopprettede aliaset. Kopier til utklippstavlen og lagre det genererte passordet som vises på skjermen på en sikker måte.

3. Bruk ditt foretrukne e-postprogram, legg til eller konfigurer en konto med det nyopprettede aliaset ditt (f.eks. <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>Vi anbefaler å bruke <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> eller <a href="/blog/open-source" class="alert-link" target="_blank">et åpen kildekode- og personvernfokusert alternativ</a>.</span>
</div>

4. Når du blir bedt om å oppgi IMAP-servernavn, skriver du inn `imap.forwardemail.net`

5. Når du blir bedt om å angi IMAP-serverport, skriv inn `993` (SSL/TLS) – se [alternative IMAP-porter](/faq#what-are-your-imap-server-configuration-settings) om nødvendig
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>Hvis du bruker Thunderbird, må du sørge for at «Tilkoblingssikkerhet» er satt til «SSL/TLS» og at autentiseringsmetoden er satt til «Vanlig passord».</span>
</div>

6. Når du blir bedt om å oppgi IMAP-serverpassordet, limer du inn passordet fra <strong class="text-success"><i class="fa fa-key"></i> Generer passord</strong> i trinn 2 ovenfor.

7. **Lagre innstillingene dine** – hvis du har problemer, kan du <a href="/help">kontakte oss</a>

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

### Støtter du POP3 {#do-you-support-pop3}

Ja, fra og med 4. desember 2023 støtter vi [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) som et tillegg for alle betalende brukere. **Les vår grundige artikkel** om [hvordan vår krypterte SQLite-postbokslagringsfunksjon fungerer](/blog/docs/best-quantum-safe-encrypted-email-service).**

<div id="pop3-instruksjoner">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktig:
</strong>
<span>
Sørg for at du har lest våre <a href="/terms" class="alert-link" target="_blank">vilkår</a> og <a href="/privacy" class="alert-link" target="_blank">personvernerklæring</a>. Din bruk anses som bekreftelse og samtykke.
</span>
</div>

1. Opprett et nytt alias for domenet ditt under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Aliaser (f.eks. <code><hello@example.com></code>)

2. Klikk på <strong class="text-success"><i class="fa fa-key"></i>Generer passord</strong> ved siden av det nyopprettede aliaset. Kopier til utklippstavlen og lagre det genererte passordet som vises på skjermen på en sikker måte.

3. Bruk ditt foretrukne e-postprogram, legg til eller konfigurer en konto med det nyopprettede aliaset ditt (f.eks. <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>Vi anbefaler å bruke <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> eller <a href="/blog/open-source" class="alert-link" target="_blank">et åpen kildekode- og personvernfokusert alternativ</a>.</span>
</div>

4. Når du blir bedt om å oppgi POP3-servernavn, skriver du inn `pop3.forwardemail.net`

5. Når du blir bedt om å angi POP3-serverport, skriv inn `995` (SSL/TLS) – se [alternative POP3-porter](/faq#what-are-your-pop3-server-configuration-settings) om nødvendig
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>Hvis du bruker Thunderbird, må du sørge for at «Tilkoblingssikkerhet» er satt til «SSL/TLS» og at autentiseringsmetoden er satt til «Vanlig passord».</span>
</div>

6. Når du blir bedt om å oppgi POP3-serverpassordet, limer du inn passordet fra <strong class="text-success"><i class="fa fa-key"></i> Generer passord</strong> i trinn 2 ovenfor.

7. **Lagre innstillingene dine** – hvis du har problemer, kan du <a href="/help">kontakte oss</a>

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

Ja, fra og med 5. februar 2024 har vi lagt til denne funksjonen. Serveren vår er `caldav.forwardemail.net` og overvåkes også på <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statussiden</a> vår.

Den støtter både IPv4 og IPv6 og er tilgjengelig over port `443` (HTTPS).

| Logg inn | Eksempel | Beskrivelse |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brukernavn | `user@example.com` | E-postadressen til et alias som finnes for domenet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a>. |
| Passord | `************************` | Aliasspesifikt generert passord. |

For å bruke kalenderstøtte må **brukeren** være e-postadressen til et alias som finnes for domenet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a> – og **passordet** må være et aliasspesifikt generert passord.

### Støtter du kontakter (CardDAV) {#do-you-support-contacts-carddav}

Ja, fra og med 12. juni 2025 har vi lagt til denne funksjonen. Serveren vår er `carddav.forwardemail.net` og overvåkes også på <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statussiden</a> vår.

Den støtter både IPv4 og IPv6 og er tilgjengelig over port `443` (HTTPS).

| Logg inn | Eksempel | Beskrivelse |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brukernavn | `user@example.com` | E-postadressen til et alias som finnes for domenet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a>. |
| Passord | `************************` | Aliasspesifikt generert passord. |

For å bruke kontaktstøtte må **brukeren** være e-postadressen til et alias som finnes for domenet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a> – og **passordet** må være et aliasspesifikt generert passord.

### Støtter dere sending av e-post med SMTP {#do-you-support-sending-email-with-smtp}

Ja, fra mai 2023 støtter vi sending av e-post med SMTP som et tillegg for alle betalende brukere.

<div id="smtp-instruksjoner">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktig:
</strong>
<span>
Sørg for at du har lest våre <a href="/terms" class="alert-link" target="_blank">vilkår</a>, <a href="/privacy" class="alert-link" target="_blank">personvernerklæring</a> og <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">utgående SMTP-grenser</a> – din bruk anses som bekreftelse og samtykke.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktig:
</strong>
<span>
Hvis du bruker Gmail, kan du se vår <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">veiledning for Send e-post som med Gmail</a>. Hvis du er en utvikler, kan du se vår <a class="alert-link" href="/email-api#outbound-emails" target="_blank">dokumentasjon for e-post-API</a>.
</span>
</div>

1. Gå til <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Innstillinger <i class="fa fa-angle-right"></i> Utgående SMTP-konfigurasjon og følg konfigurasjonsinstruksjonene.

2. Opprett et nytt alias for domenet ditt under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Aliaser (f.eks. <code><hello@example.com></code>)

3. Klikk på <strong class="text-success"><i class="fa fa-key"></i>Generer passord</strong> ved siden av det nyopprettede aliaset. Kopier til utklippstavlen og lagre det genererte passordet som vises på skjermen på en sikker måte.

4. Bruk ditt foretrukne e-postprogram, legg til eller konfigurer en konto med det nyopprettede aliaset ditt (f.eks. <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>Vi anbefaler å bruke <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> eller <a href="/blog/open-source" class="alert-link" target="_blank">et åpen kildekode- og personvernfokusert alternativ</a>.</span>
</div>

5. Når du blir bedt om å oppgi SMTP-servernavn, skriver du inn `smtp.forwardemail.net`

6. Når du blir bedt om å angi SMTP-serverport, skriv inn `465` (SSL/TLS) – se [alternative SMTP-porter](/faq#what-are-your-smtp-server-configuration-settings) om nødvendig
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>Hvis du bruker Thunderbird, må du sørge for at «Tilkoblingssikkerhet» er satt til «SSL/TLS» og at autentiseringsmetoden er satt til «Vanlig passord».</span>
</div>

7. Når du blir bedt om å oppgi SMTP-serverpassordet, limer du inn passordet fra <strong class="text-success"><i class="fa fa-key"></i> Generer passord</strong> i trinn 3 ovenfor.

8. **Lagre innstillingene dine og send din første test-e-post** – hvis du har problemer, kan du <a href="/help">kontakte oss</a>

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktig:
</strong>
<span>
Vær oppmerksom på at for å opprettholde IP-omdømmet og sikre leveringsdyktighet, har vi en manuell gjennomgangsprosess på domenebasis for utgående SMTP-godkjenning. Dette tar vanligvis mindre enn 24 timer, og de fleste forespørsler blir behandlet innen 1–2 timer. I nær fremtid tar vi sikte på å gjøre denne prosessen umiddelbar med ytterligere spamkontroller og varsler. Denne prosessen sikrer at e-postene dine når innboksen og at meldingene dine ikke blir merket som spam.
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

### Støtter dere OpenPGP/MIME, ende-til-ende-kryptering («E2EE») og webnøkkelkatalog («WKD») {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Ja, vi støtter [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [ende-til-ende-kryptering ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption) og oppdagelsen av offentlige nøkler ved hjelp av [Webnøkkelkatalog ("WKD")](https://wiki.gnupg.org/WKD). Du kan konfigurere OpenPGP ved hjelp av [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) eller [selvhost dine egne nøkler](https://wiki.gnupg.org/WKDHosting) (se [denne kjernen for WKD-serveroppsett](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* WKD-oppslag lagres i 1 time for å sikre rettidig e-postlevering → derfor, hvis du legger til, endrer eller fjerner WKD-nøkkelen din, vennligst send oss en e-post til `support@forwardemail.net` med e-postadressen din, slik at vi kan tømme hurtigbufferen manuelt.

* Vi støtter PGP-kryptering for meldinger som videresendes via WKD-oppslag eller ved bruk av en opplastet PGP-nøkkel i grensesnittet vårt.

* Opplastede nøkler har forrang så lenge PGP-avmerkingsboksen er aktivert/merket.

* Meldinger sendt til webhooks er for øyeblikket ikke kryptert med PGP.

* Hvis du har flere aliaser som samsvarer med en gitt videresendingsadresse (f.eks. regex/wildcard/exact-kombinasjon), og hvis mer enn ett av disse inneholder en opplastet PGP-nøkkel og har PGP merket av →, vil vi sende deg en feilmeldings-e-post og vil ikke kryptere meldingen med den opplastede PGP-nøkkelen din. Dette er svært sjeldent og gjelder vanligvis bare avanserte brukere med komplekse aliasregler.
* **PGP-kryptering vil ikke bli brukt på videresending av e-post via våre MX-servere hvis avsenderen hadde en DMARC-policy for avvisning. Hvis du trenger PGP-kryptering på *all* e-post, foreslår vi at du bruker IMAP-tjenesten vår og konfigurerer PGP-nøkkelen din for aliaset ditt for innkommende e-post.**

**Du kan validere oppsettet av webnøkkelkatalogen din på <https://wkd.chimbosonic.com/> (åpen kildekode) eller <https://www.webkeydirectory.com/> (proprietær).**

<div class="alert my-3 alert-success">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Automatisk kryptering:
</strong>
<span>Hvis du bruker vår <a href="#do-you-support-sending-email-with-smtp" class="alert-link">utgående SMTP-tjeneste</a> og sender ukrypterte meldinger, vil vi automatisk forsøke å kryptere meldinger per mottaker ved hjelp av <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Key Directory ("WKD")</a>.</span>
</div>

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktig:
</strong>
<span>
Du må følge alle de følgende trinnene for å aktivere OpenPGP for ditt tilpassede domenenavn.
</span>
</div>

1. Last ned og installer den anbefalte pluginen for e-postklienten din nedenfor:

| E-postklient | Plattform | Anbefalt plugin | Notater |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Thunderbird | Skrivebord | [Configure OpenPGP in Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird har innebygd støtte for OpenPGP. |
| Gmail | Nettleser | [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download) (proprietær lisens) | Gmail støtter ikke OpenPGP, men du kan laste ned plugin-modulen med åpen kildekode [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download). |
| Apple Mail | macOS | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) | Apple Mail støtter ikke OpenPGP, men du kan laste ned plugin-modulen med åpen kildekode [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation). |
| Apple Mail | iOS | [PGPro](https://github.com/opensourceios/PGPro/) eller [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (proprietær lisens) | Apple Mail støtter ikke OpenPGP, men du kan laste ned plugin-modulen med åpen kildekode [PGPro](https://github.com/opensourceios/PGPro/) eller [FlowCrypt](https://flowcrypt.com/download). |
| Utsikter | Vinduer | [gpg4win](https://www.gpg4win.de/index.html) | Outlooks e-postklient for skrivebord støtter ikke OpenPGP, men du kan laste ned plugin-modulen med åpen kildekode [gpg4win](https://www.gpg4win.de/index.html). |
| Utsikter | Nettleser | [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download) (proprietær lisens) | Outlooks nettbaserte e-postklient støtter ikke OpenPGP, men du kan laste ned plugin-modulen med åpen kildekode [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download). |
| Android | Mobil | [OpenKeychain](https://www.openkeychain.org/) eller [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) | [Android mail clients](/blog/open-source/android-email-clients), som for eksempel [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) og [FairEmail](https://github.com/M66B/FairEmail), støtter begge plugin-modulen med åpen kildekode [OpenKeychain](https://www.openkeychain.org/). Du kan alternativt bruke plugin-modulen med åpen kildekode (proprietær lisensiering) [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email). |
| Google Chrome | Nettleser | [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download) (proprietær lisens) | Du kan laste ned nettleserutvidelsen med åpen kildekode [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download). |
| Mozilla Firefox | Nettleser | [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download) (proprietær lisens) | Du kan laste ned nettleserutvidelsen med åpen kildekode [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download). |
| Microsoft Edge | Nettleser | [Mailvelope](https://mailvelope.com/) | Du kan laste ned nettleserutvidelsen med åpen kildekode [Mailvelope](https://mailvelope.com/). |
| Modig | Nettleser | [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download) (proprietær lisens) | Du kan laste ned nettleserutvidelsen med åpen kildekode [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download). |
| Balsa | Skrivebord | [Configure OpenPGP in Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING) | Balsa har innebygd støtte for OpenPGP. |
| KMail | Skrivebord | [Configure OpenPGP in KMail](https://userbase.kde.org/KMail/PGP_MIME) | KMail har innebygd støtte for OpenPGP. |
| GNOME-evolusjonen | Skrivebord | [Configure OpenPGP in Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en) | GNOME Evolution har innebygd støtte for OpenPGP. |
| Terminal | Skrivebord | [Configure gpg in Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key) | Du kan bruke åpen kildekode [gpg command line tool](https://www.gnupg.org/download/) til å generere en ny nøkkel fra kommandolinjen. |

2. Åpne plugin-modulen, opprett den offentlige nøkkelen din, og konfigurer e-postklienten din til å bruke den.

3. Last opp den offentlige nøkkelen din på <https://keys.openpgp.org/upload>.

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
Hvis du bruker vår <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">krypterte lagringstjenester (IMAP/POP3)</a> og ønsker at <i>all</i> e-post lagret i din (allerede krypterte) SQLite-database skal krypteres med din offentlige nøkkel, går du til <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Aliaser (f.eks. <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Rediger <i class="fa fa-angle-right"></i> OpenPGP og last opp den offentlige nøkkelen din.
</span>
</div>

4. Legg til en ny `CNAME`-post i domenenavnet ditt (f.eks. `example.com`):

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vert/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Verdi</th> </tr> </thead> <tbody> <tr> <td><code>openpgpkey</code></td> <td class="text-center">3600</td> <td class="notranslate">CNAME</td> <td><code>wkd.keys.openpgp.org</code></td> </tr> </tbody> </table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>Hvis aliaset ditt bruker våre <a class="alert-link" href="/disposable-addresses" target="_blank">vanity/disposable-domener</a> (f.eks. <code>hideaddress.net</code>), kan du hoppe over dette trinnet.</span>
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

### Støtter du MTA-STS {#do-you-support-mta-sts}

Ja, fra og med 2. mars 2023 støtter vi [MTA-STS](https://www.hardenize.com/blog/mta-sts). Du kan bruke [denne malen](https://github.com/jpawlowski/mta-sts.template) hvis du ønsker å aktivere det på domenet ditt.

Konfigurasjonen vår er offentlig tilgjengelig på GitHub på <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### Støtter dere tilgangsnøkler og WebAuthn {#do-you-support-passkeys-and-webauthn}

Ja! Fra og med 13. desember 2023 har vi lagt til støtte for passord [på grunn av høy etterspørsel](https://github.com/orgs/forwardemail/discussions/182).

Med tilgangsnøkler kan du logge inn sikkert uten å kreve passord og tofaktorautentisering.

Du kan bekrefte identiteten din med berøring, ansiktsgjenkjenning, enhetsbasert passord eller PIN-kode.

Vi lar deg administrere opptil 30 passord samtidig, slik at du enkelt kan logge inn med alle enhetene dine.

Lær mer om passord på følgende lenker:

* [Logg på applikasjoner og nettsteder med passord](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [Bruk passord for å logge på apper og nettsteder på iPhone](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Wikipedia-artikkel om passord](https://en.wikipedia.org/wiki/Passkey_\(credential\))

### Støtter dere beste praksis for e-post? {#do-you-support-email-best-practices}

Ja. Vi har innebygd støtte for SPF, DKIM, DMARC, ARC og SRS på tvers av alle abonnementer. Vi har også jobbet mye med de opprinnelige forfatterne av disse spesifikasjonene og andre e-posteksperter for å sikre perfeksjon og høy leveringsevne.

### Støtter dere avvisningswebhooks {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
Leter du etter dokumentasjon om e-post-webhooks? Se <a href="/faq#do-you-support-webhooks" class="alert-link">Støtter dere webhooks?</a> for mer innsikt.
<span>
</span>
</div>

Ja, fra og med 14. august 2024 har vi lagt til denne funksjonen. Du kan nå gå til Min konto → Domener → Innstillinger → Bounce Webhook URL og konfigurere en `http://`- eller `https://`-URL som vi sender en `POST`-forespørsel til når utgående SMTP-e-poster returneres.

Dette er nyttig for å administrere og overvåke utgående SMTP – og kan brukes til å opprettholde abonnenter, reservere seg mot og oppdage når det oppstår avvisninger.

Bounce webhook-nyttelaster sendes som en JSON med disse egenskapene:

* `email_id` (Streng) - e-post-ID som tilsvarer en e-post i Min konto → E-poster (utgående SMTP)
* `list_id` (Streng) - `List-ID`-overskriftsverdien (uavhengig av store og små bokstaver), hvis noen, fra den opprinnelige utgående e-posten
* `list_unsubscribe` (Streng) - `List-Unsubscribe`-overskriftsverdien (uavhengig av store og små bokstaver), hvis noen, fra den opprinnelige utgående e-posten
* `feedback_id` (Streng) - `Feedback-ID`-overskriftsverdien (uavhengig av store og små bokstaver), hvis noen, fra den opprinnelige utgående e-posten
* `recipient` (Streng) - e-postadressen til mottakeren som returnerte eller oppsto en feil
* `message` (Streng) - en detaljert feilmelding for returen
* `response` (Streng) - SMTP-svarmeldingen
* `list_id`0 (Tall) - den analysert SMTP-svarkode
* `list_id`1 (Streng) - hvis svarkoden var fra en klarert kilde, vil denne verdien bli fylt ut med rotdomenenavnet (f.eks. `list_id`2 eller `list_id`3)
* `list_id`4 (Objekt) - et objekt som inneholder følgende egenskaper som beskriver avvisnings- og avvisningsstatusen
* `list_id`5 (Streng) - avvisningshandling (f.eks. `list_id`6)
* `list_id`7 (Streng) - avvisningsårsak (f.eks. `list_id`8)
* `list_id`9 (Streng) - avvisningskategori (f.eks. `List-ID`0)
* `List-ID`1 (Tall) - avvisningsstatuskode (f.eks. `List-ID`2)
* `List-ID`3 (Streng) - returkode fra svarmelding (f.eks. `List-ID`4)
* `List-ID`5 (Nummer) - analysert linjenummer, hvis aktuelt, `List-ID`6 (f.eks. `List-ID`7)
* `List-ID`8 (Objekt) - nøkkelverdipar av overskrifter for den utgående e-posten
* `List-ID`9 (Streng) - `list_unsubscribe`0 formatert dato for når returfeilen oppsto

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

Her er noen tilleggsmerknader angående bounce webhooks:

* Hvis webhook-nyttelasten inneholder en `list_id`-, `list_unsubscribe`- eller `feedback_id`-verdi, bør du om nødvendig iverksette nødvendige tiltak for å fjerne `recipient` fra listen.
* Hvis `bounce.category`-verdien var én av `"block"`, `"recipient"`, `"spam"` eller `"virus"`, bør du absolutt fjerne brukeren fra listen.
* Hvis du trenger å bekrefte webhook-nyttelaster (for å sikre at de faktisk kommer fra serveren vår), kan du bruke [løse den eksterne klientens IP-adresse klientens vertsnavn ved hjelp av et omvendt oppslag](https://nodejs.org/api/dns.html#dnspromisesreverseip) – det skal være `list_unsubscribe`0.
* Du kan også sjekke IP-adressen mot `list_unsubscribe`1.
* Gå til Min konto → Domener → Innstillinger → Webhook Signature Payload Verification Key for å få tak i webhook-nøkkelen din.
* Du kan rotere denne nøkkelen når som helst av sikkerhetsmessige årsaker.
* Beregn og sammenlign `list_unsubscribe`2-verdien fra webhook-forespørselen vår med den beregnede brødtekstverdien ved hjelp av denne nøkkelen. Et eksempel på hvordan du gjør dette er tilgjengelig på `list_unsubscribe`3.
* Se diskusjonen på <`list_unsubscribe`4 for mer innsikt.
* Vi venter i opptil `list_unsubscribe`5 sekunder på at webhook-endepunktet ditt skal svare med statuskoden `list_unsubscribe`6, og vi prøver på nytt i opptil `list_unsubscribe`7 sekunder.
* Hvis vi oppdager at den avviste webhook-URL-en din har en feil mens vi prøver å sende en forespørsel til den, sender vi deg en e-post én gang i uken.

### Støtter dere webhooks? {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
Leter du etter dokumentasjon om bounce webhooks? Se <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Støtter dere bounce webhooks?</a> for mer innsikt.
<span>
</span>
</div>

Ja, fra og med 15. mai 2020 har vi lagt til denne funksjonen. Du kan ganske enkelt legge til webhook(er) akkurat som du ville gjort med en hvilken som helst mottaker! Sørg for at du har prefikset «http» eller «https» i webhookens URL.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Forbedret personvern:
</strong>
<span>
Hvis du har et betalt abonnement (som har forbedret personvern), kan du gå til <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domener</a> og klikke på "Aliaser" ved siden av domenet ditt for å konfigurere webhookene dine. Hvis du vil vite mer om betalte abonnementer, kan du se vår <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Prissettingsside</a>. Ellers kan du fortsette å følge instruksjonene nedenfor.
</span>
</div>

Hvis du har gratisabonnementet, legger du bare til en ny DNS-<strong class="notranslate">TXT</strong>-oppføring som vist nedenfor:

Hvis jeg for eksempel vil at alle e-poster som går til `alias@example.com` skal videresendes til et nytt [forespørselsboks](https://requestbin.com/r/en8pfhdgcculn?inspect) testendepunkt:

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vert/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Verdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr> </tbody>
</table>

Eller kanskje du vil at alle e-poster som går til `example.com` skal videresendes til dette endepunktet:

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vert/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Verdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr> </tbody>
</table>

**Her er ytterligere merknader angående webhooks:**

* Hvis du trenger å bekrefte webhook-nyttelaster (for å sikre at de faktisk kommer fra serveren vår), kan du bruke [løse den eksterne klientens IP-adresse klientens vertsnavn ved hjelp av et omvendt oppslag](https://nodejs.org/api/dns.html#dnspromisesreverseip) – det skal enten være `mx1.forwardemail.net` eller `mx2.forwardemail.net`.
* Du kan også sjekke IP-adressen mot [våre publiserte IP-adresser](#what-are-your-servers-ip-addresses).
* Hvis du har et betalt abonnement, går du til Min konto → Domener → Innstillinger → Webhook Signature Payload Verification Key for å få tak i webhook-nøkkelen din.
* Du kan rotere denne nøkkelen når som helst av sikkerhetsmessige årsaker.
* Beregn og sammenlign `X-Webhook-Signature`-verdien fra webhook-forespørselen vår med den beregnede kroppsverdien ved hjelp av denne nøkkelen. Et eksempel på hvordan du gjør dette er tilgjengelig på [dette Stack Overflow-innlegget](https://stackoverflow.com/a/68885281).
* Se diskusjonen på <https://github.com/forwardemail/free-email-forwarding/issues/235> for mer innsikt.
* Hvis en webhook ikke svarer med en `200` statuskode, lagrer vi svaret i [feillogg opprettet](#do-you-store-error-logs) – som er nyttig for feilsøking.
* Webhook HTTP-forespørsler vil prøve på nytt opptil 3 ganger per SMTP-tilkoblingsforsøk, med en maksimal tidsavbrudd på 60 sekunder per endepunkts-POST-forespørsel. **Merk at dette ikke betyr at den bare prøver på nytt 3 ganger**, den vil faktisk prøve på nytt kontinuerlig over tid ved å sende en SMTP-kode på 421 (som indikerer til avsenderen at den prøver på nytt senere) etter det tredje mislykkede HTTP POST-forespørselsforsøket. Dette betyr at e-posten vil prøve på nytt kontinuerlig i flere dager inntil en statuskode på 200 oppnås.
* Vi vil prøve på nytt automatisk basert på standardstatusen og feilkodene som brukes i [superagentens metode for nytt forsøk](https://ladjs.github.io/superagent/#retrying-requests) (vi er vedlikeholdere).
* Vi grupperer webhook HTTP-forespørsler til samme endepunkt i én forespørsel i stedet for flere) for å spare ressurser og øke responstiden. Hvis du for eksempel sender en e-post til <webhook1@example.com>, <webhook2@example.com> og <webhook3@example.com>, og alle disse er konfigurert til å treffe den samme *nøyaktige* endepunkts-URL-en, vil bare én forespørsel bli sendt. Vi grupperer sammen etter eksakt endepunktsamsvar med streng likhet.
* Merk at vi bruker `mx1.forwardemail.net`0-bibliotekets "simpleParser"-metode for å analysere meldingen til et JSON-vennlig objekt.
* Rå e-postverdi som en streng er gitt som egenskapen "raw".
* Autentiseringsresultater er gitt som egenskapene "dkim", "spf", "arc", "dmarc" og "bimi".
* De analyserte e-postoverskriftene er gitt som egenskapen "headers" – men merk også at du kan bruke "headerLines" for enklere iterasjon og parsing.
* De grupperte mottakerne for denne webhooken er gruppert sammen og gitt som egenskapen "recipients".
* SMTP-øktinformasjonen er gitt som egenskapen "session". Denne inneholder informasjon om avsenderen av meldingen, ankomsttid for meldingen, HELO og klientens vertsnavn. Klientens vertsnavnverdi som `mx1.forwardemail.net`1 er enten FQDN (fra et omvendt PTR-oppslag) eller `mx1.forwardemail.net`2 omsluttet av parenteser (f.eks. `mx1.forwardemail.net`3).
* Hvis du trenger en rask måte å få verdien av `mx1.forwardemail.net`4 på, kan du bruke verdien av `mx1.forwardemail.net`5 (se eksempel nedenfor). Overskriften `mx1.forwardemail.net`6 er en overskrift vi legger til i meldinger for feilsøking med den opprinnelige mottakeren (før maskert videresending) for meldingen.
* Hvis du trenger å fjerne `mx1.forwardemail.net`7 og/eller `mx1.forwardemail.net`8-egenskapene fra nyttelasten, legger du ganske enkelt til `mx1.forwardemail.net`9, `mx2.forwardemail.net`0 eller `mx2.forwardemail.net`1 til webhook-endepunktet ditt som en spørrestrengparameter (f.eks. `mx2.forwardemail.net`2).
* Hvis det finnes vedlegg, vil de bli lagt til i `mx2.forwardemail.net`3-arrayet med bufferverdier. Du kan analysere dem tilbake til innhold ved hjelp av en tilnærming med JavaScript, for eksempel:

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
Tips:
</strong>
Nysgjerrig på hvordan webhook-forespørselen ser ut fra videresendte e-poster? Vi har inkludert et eksempel nedenfor for deg!
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

Ja, fra og med 27. september 2021 har vi lagt til denne funksjonen. Du kan ganske enkelt skrive regulære uttrykk («regex») for å matche aliaser og utføre substitusjoner.

Aliaser som støttes av regulære uttrykk er de som starter med `/` og slutter med `/`, og mottakerne deres er e-postadresser eller webhooks. Mottakerne kan også inkludere støtte for regex-erstatning (f.eks. `$1`, `$2`).

Vi støtter to flagg for regulære uttrykk, inkludert `i` og `g`. Det store og små bokstav-flagget `i` er en permanent standard, og det håndheves alltid. Det globale flagget `g` kan legges til av deg ved å sette `/g` til slutten av `/`.

Merk at vi også støtter <a href="#can-i-disable-specific-aliases">disabled aliasfunksjonen</a> vår for mottakerdelen med støtte for regex.

Regulære uttrykk støttes ikke på <a href="/disposable-addresses" target="_blank">globale vanity-domener</a> (da dette kan være et sikkerhetsproblem).

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Forbedret personvern:
</strong>
<span>
Hvis du har et betalt abonnement (som har forbedret personvern), kan du gå til <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domener</a> og klikke på "Aliaser" ved siden av domenet ditt for å konfigurere regulære uttrykk. Hvis du vil vite mer om betalte abonnementer, kan du se vår <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Prissettingsside</a>. Ellers kan du fortsette å følge instruksjonene nedenfor.
</span>
</div>

Hvis du har gratisabonnementet, legger du ganske enkelt til en ny DNS-<strong class="notranslate">TXT</strong>-oppføring ved å bruke ett eller flere av eksemplene nedenfor:

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Enkelt eksempel:</strong> Hvis jeg vil at alle e-poster som går til `linus@example.com` eller `torvalds@example.com` skal videresendes til `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vert/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Verdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>videresendings-e-post=/^(linus|torvalds)$/:bruker@gmail.com</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Eksempel på erstatning av fornavn og etternavn:</strong> Tenk deg at alle e-postadressene i bedriften din har `firstname.lastname@example.com`-mønsteret. Hvis jeg vil at alle e-poster som går til mønsteret `firstname.lastname@example.com` skal videresendes til `firstname.lastname@company.com` med støtte for erstatning (<a href="https://regexr.com/66hnu" class="alert-link">se test på RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr> <th>Navn/Vert/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Verdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>videresendings-e-post=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@firma.com</code></td>
</tr> </tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Eksempel på erstatning av plusssymbolfiltrering:</strong> Hvis jeg vil at alle e-poster som går til `info@example.com` eller `support@example.com` skal videresendes til henholdsvis `user+info@gmail.com` eller `user+support@gmail.com` (med støtte for erstatning) (<a href="https://regexr.com/66ho7" class="alert-link">vis test på RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr> <th>Navn/Vert/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Verdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Eksempel på erstatning av webhook-spørrestreng:</strong> Kanskje du vil at alle e-poster som går til `example.com` skal gå til en <a href="#do-you-support-webhooks" class="alert-link">webhook</a> og ha en dynamisk spørrestrengnøkkel på "til" med en verdi av brukernavndelen av e-postadressen (<a href="https://regexr.com/66ho4" class="alert-link">vis test på RegExr</a>):
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vert/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Verdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>videresendings-e-post=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
</tr> </tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Eksempel på stille avvisning:</strong> Hvis du vil at alle e-poster som samsvarer med et bestemt mønster skal deaktiveres og stille avvises (vises for avsenderen som om meldingen ble sendt, men den går egentlig ingen vei) med statuskoden `250` (se <a href="#can-i-disable-specific-aliases" class="alert-link">Kan jeg deaktivere spesifikke aliaser</a>), bruk ganske enkelt samme tilnærming med et enkelt utropstegn "!". Dette indikerer for avsenderen at meldingen ble levert, men at den egentlig ikke kom noen vei (f.eks. svart hull eller `/dev/null`).
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr> <th>Navn/Vert/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Verdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>videresendings-e-post=/^(linus|torvalds)$/:!</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Eksempel på myk avvisning:</strong> Hvis du vil at alle e-poster som samsvarer med et bestemt mønster skal deaktiveres og myk avvises med statuskoden `421` (se <a href="#can-i-disable-specific-aliases" class="alert-link">Kan jeg deaktivere bestemte aliaser</a>), bruk ganske enkelt samme fremgangsmåte med et dobbelt utropstegn "!!". Dette indikerer at avsenderen må prøve e-posten sin på nytt, og e-poster til dette aliaset vil bli prøvd på nytt i omtrent 5 dager og deretter avvist permanent.
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vert/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Verdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>videresendings-e-post=/^(linus|torvalds)$/:!!</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Eksempel på hard avvisning:</strong> Hvis du vil at alle e-poster som samsvarer med et bestemt mønster skal deaktiveres og hard avvises med statuskoden `550` (se <a href="#can-i-disable-specific-aliases" class="alert-link">Kan jeg deaktivere bestemte aliaser</a>), bruk ganske enkelt samme tilnærming med et trippelt utropstegn "!!!". Dette indikerer en permanent feil for avsenderen, og e-poster vil ikke bli forsøkt på nytt. De vil bli avvist for dette aliaset.

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vert/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Verdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>videresendings-e-post=/^(linus|torvalds)$/:!!!</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
Nysgjerrig på hvordan man skriver et regulært uttrykk, eller trenger du å teste erstatningen din? Du kan gå til det gratis nettstedet for testing av regulære uttrykk <a href="https://regexr.com" class="alert-link">RegExr</a> på <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.">
<span>
</span>
</div>

### Hva er dine utgående SMTP-grenser {#what-are-your-outbound-smtp-limits}

Vi begrenser brukere og domener til 300 utgående SMTP-meldinger per dag. Dette tilsvarer gjennomsnittlig 9000+ e-poster i en kalendermåned. Hvis du trenger å overskride dette antallet eller har gjennomgående store e-poster, kan du [kontakt oss](https://forwardemail.net/help).

### Trenger jeg godkjenning for å aktivere SMTP {#do-i-need-approval-to-enable-smtp}

Ja, vær oppmerksom på at for å opprettholde IP-omdømmet og sikre leveringsdyktighet, har Forward Email en manuell gjennomgangsprosess på domenebasis for utgående SMTP-godkjenning. Send en e-post til <support@forwardemail.net> eller åpne en [hjelpforespørsel](https://forwardemail.net/help) for godkjenning. Dette tar vanligvis mindre enn 24 timer, og de fleste forespørsler blir behandlet innen 1–2 timer. I nær fremtid tar vi sikte på å gjøre denne prosessen umiddelbar med ytterligere spamkontroller og varsler. Denne prosessen sikrer at e-postene dine når innboksen og at meldingene dine ikke blir merket som spam.

### Hva er konfigurasjonsinnstillingene for SMTP-serveren din? {#what-are-your-smtp-server-configuration-settings}

Serveren vår er `smtp.forwardemail.net` og overvåkes også på <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statussiden</a> vår.

Den støtter både IPv4 og IPv6 og er tilgjengelig over portene `465` og `2465` for SSL/TLS og `587`, `2587`, `2525` og `25` for TLS (STARTTLS).

| Protokoll | Vertsnavn | Porter | IPv4 | IPv6 |
| :--------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: |
| `SSL/TLS` **Foretrukket** | `smtp.forwardemail.net` | `465`, `2465` | :hvitt_hakemerke: | :hvitt_hakemerke: |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :hvitt_hakemerke: | :hvitt_hakemerke: |

| Logg inn | Eksempel | Beskrivelse |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brukernavn | `user@example.com` | E-postadressen til et alias som finnes for domenet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a>. |
| Passord | `************************` | Aliasspesifikt generert passord. |

For å kunne sende utgående e-post med SMTP, må **SMTP-brukeren** være e-postadressen til et alias som finnes for domenet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mine konto <i class="fa fa-angle-right"></i> Domener</a> – og **SMTP-passordet** må være et aliasspesifikt generert passord.

Se [Støtter dere sending av e-post med SMTP](#do-you-support-sending-email-with-smtp) for trinnvise instruksjoner.

### Hva er konfigurasjonsinnstillingene for IMAP-serveren din {#what-are-your-imap-server-configuration-settings}

Serveren vår er `imap.forwardemail.net` og overvåkes også på <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statussiden</a> vår.

Den støtter både IPv4 og IPv6 og er tilgjengelig over portene `993` og `2993` for SSL/TLS.

| Protokoll | Vertsnavn | Porter | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Foretrukket** | `imap.forwardemail.net` | `993`, `2993` | :hvitt_hakemerke: | :hvitt_hakemerke: |

| Logg inn | Eksempel | Beskrivelse |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brukernavn | `user@example.com` | E-postadressen til et alias som finnes for domenet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a>. |
| Passord | `************************` | Aliasspesifikt generert passord. |

For å koble til med IMAP må **IMAP-brukeren** være e-postadressen til et alias som finnes for domenet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a> – og **IMAP-passordet** må være et aliasspesifikt generert passord.

Se [Støtter dere mottak av e-post med IMAP](#do-you-support-receiving-email-with-imap) for trinnvise instruksjoner.

### Hva er konfigurasjonsinnstillingene for POP3-serveren din {#what-are-your-pop3-server-configuration-settings}

Serveren vår er `pop3.forwardemail.net` og overvåkes også på <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statussiden</a> vår.

Den støtter både IPv4 og IPv6 og er tilgjengelig over portene `995` og `2995` for SSL/TLS.

| Protokoll | Vertsnavn | Porter | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Foretrukket** | `pop3.forwardemail.net` | `995`, `2995` | :hvitt_hakemerke: | :hvitt_hakemerke: |

| Logg inn | Eksempel | Beskrivelse |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brukernavn | `user@example.com` | E-postadressen til et alias som finnes for domenet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a>. |
| Passord | `************************` | Aliasspesifikt generert passord. |

For å koble til med POP3 må **POP3-brukeren** være e-postadressen til et alias som finnes for domenet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mine konto <i class="fa fa-angle-right"></i> Domener</a> – og **IMAP-passordet** må være et aliasspesifikt generert passord.

Se [Støtter du POP3](#do-you-support-pop3) for trinnvise instruksjoner.

### Postfix SMTP-relékonfigurasjon {#postfix-smtp-relay-configuration}

Du kan konfigurere Postfix til å videresende e-poster via SMTP-serverne til Forward Email. Dette er nyttig for serverapplikasjoner som trenger å sende e-poster.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Anslått oppsetttid:</strong>
<span>Mindre enn 15 minutter</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktig:
</strong>
<span>
Dette krever et betalt abonnement med SMTP-tilgang aktivert.
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

2. Velg «Internettsted» under installasjonen når du blir bedt om å oppgi konfigurasjonstype.

#### Konfigurasjon {#configuration}

1. Rediger hovedkonfigurasjonsfilen for Postfix:

```bash
sudo nano /etc/postfix/main.cf
```

2. Legg til eller endre disse innstillingene:

```
# SMTP relay configuration
relayhost = [smtp.forwardemail.net]:587
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Opprett SASL-passordfilen:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Legg til påloggingsinformasjonen din for videresending av e-post:

```
[smtp.forwardemail.net]:587 your-alias@yourdomain.com:your-generated-password
```

5. Sikre og hash passordfilen:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Start Postfix på nytt:

```bash
sudo systemctl restart postfix
```

#### Testing {#testing}

Test konfigurasjonen din ved å sende en test-e-post:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

## Sikkerhet {#security}

### Avanserte serverherdingsteknikker {#advanced-server-hardening-techniques}

> \[!TIP]
> Lær mer om sikkerhetsinfrastrukturen vår på [vår sikkerhetsside](/security).

Videresend e-post implementerer en rekke serverherdingsteknikker for å sikre sikkerheten til infrastrukturen vår og dataene dine:

1. **Nettverkssikkerhet**:
* IP-tabeller, brannmur med strenge regler
* Fail2ban for brute force-beskyttelse
* Regelmessige sikkerhetsrevisjoner og penetrasjonstesting
* Kun VPN-administratortilgang

2. **Systemherding**:** Minimal pakkeinstallasjon
* Regelmessige sikkerhetsoppdateringer
* SELinux i håndhevingsmodus
* Deaktivert root SSH-tilgang
* Kun nøkkelbasert autentisering

3. **Applikasjonssikkerhet**:
* Overskrifter for Content Security Policy (CSP)
* HTTPS Strict Transport Security (HSTS)
* Overskrifter for XSS-beskyttelse
* Overskrifter for rammealternativer og referansepolicyer
* Regelmessige avhengighetsrevisjoner

4. **Databeskyttelse**:** Full diskkryptering med LUKS
* Sikker nøkkelhåndtering
* Regelmessige sikkerhetskopier med kryptering
* Dataminimeringspraksis

5. **Overvåking og respons**:
* Inntrengingsdeteksjon i sanntid
* Automatisert sikkerhetsskanning
* Sentralisert logging og analyse
* Prosedyrer for hendelsesrespons

> \[!IMPORTANT]
> Våre sikkerhetsrutiner oppdateres kontinuerlig for å håndtere nye trusler og sårbarheter.

> \[!TIP]
> For maksimal sikkerhet anbefaler vi å bruke tjenesten vår med ende-til-ende-kryptering via OpenPGP.

### Har du SOC 2- eller ISO 27001-sertifiseringer? {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Videresend e-post bruker infrastruktur levert av sertifiserte underbehandlere for å sikre samsvar med bransjestandarder.

Videresendt e-post har ikke direkte SOC 2 Type II- eller ISO 27001-sertifiseringer. Tjenesten opererer imidlertid på infrastruktur levert av sertifiserte underdatabehandlere:

* **DigitalOcean**: SOC 2 Type II og SOC 3 Type II-sertifisert (revidert av Schellman & Company LLC), ISO 27001-sertifisert ved flere datasentre. Detaljer: <https://www.digitalocean.com/trust/certification-reports>

* **Vultr**: SOC 2+ (HIPAA)-sertifisert, ISO/IEC-sertifiseringer: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Detaljer: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: SOC 2-kompatibel (kontakt DataPacket direkte for å få sertifisering), infrastrukturleverandør i bedriftsklasse (Denver-lokasjon). Detaljer: <https://www.datapacket.com/datacenters/denver>

Videresend e-post følger beste praksis i bransjen for sikkerhetsrevisjoner og samarbeider jevnlig med uavhengige sikkerhetsforskere. Kilde: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### Bruker du TLS-kryptering for videresending av e-post? {#do-you-use-tls-encryption-for-email-forwarding}

Ja. Videresendt e-post håndhever strengt TLS 1.2+ for alle tilkoblinger (HTTPS, SMTP, IMAP, POP3) og implementerer MTA-STS for forbedret TLS-støtte. Implementeringen inkluderer:

* TLS 1.2+ håndheving for alle e-posttilkoblinger
* ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) nøkkelutveksling for perfekt videresendt hemmelighold
* Moderne krypteringspakker med regelmessige sikkerhetsoppdateringer
* HTTP/2-støtte for forbedret ytelse og sikkerhet
* HSTS (HTTP Strict Transport Security) med forhåndsinnlasting i de fleste nettlesere
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** for streng TLS-håndheving

Kilde: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**MTA-STS-implementering**: Videresendt e-post implementerer streng MTA-STS-håndhevelse i kodebasen. Når TLS-feil oppstår og MTA-STS håndheves, returnerer systemet 421 SMTP-statuskoder for å sikre at e-poster prøves på nytt senere i stedet for å bli levert usikkert. Implementeringsdetaljer:

* TLS-feildeteksjon: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* MTA-STS-håndhevelse i send-e-post-hjelperen: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Tredjepartsvalidering: <https://www.hardenize.com/report/forwardemail.net/1750312779> viser «God» vurdering for alle TLS- og transportsikkerhetstiltak.

### Bevarer dere overskrifter for e-postautentisering? {#do-you-preserve-email-authentication-headers}

Ja. Videresend e-post implementerer og bevarer e-postgodkjenningsoverskrifter på en omfattende måte:

* **SPF (Sender Policy Framework)**: Riktig implementert og bevart
* **DKIM (DomainKeys Identified Mail)**: Full støtte med riktig nøkkelhåndtering
* **DMARC**: Policyhåndhevelse for e-poster som ikke oppfyller SPF- eller DKIM-validering
* **ARC**: Selv om det ikke er eksplisitt detaljert, tyder tjenestens perfekte samsvarspoeng på omfattende håndtering av autentiseringshoder

Kilde: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Validering: Internet.nl Mail Test viser en poengsum på 100/100 spesifikt for implementeringen av «SPF, DKIM og DMARC». Hardenize-vurderingen bekrefter «God»-vurderinger for SPF og DMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Bevarer dere originale e-postoverskrifter og forhindrer forfalskning? {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Videresend e-post implementerer sofistikert beskyttelse mot forfalskning for å forhindre misbruk av e-post.

Videresend e-post bevarer originale e-postoverskrifter samtidig som den implementerer omfattende beskyttelse mot forfalskning gjennom MX-kodebasen:

* **Bevaring av overskrift**: Originale autentiseringsoverskrifter opprettholdes under videresending.** **Anti-forfalskning**: Håndheving av DMARC-policy forhindrer forfalskning av overskrift ved å avvise e-poster som ikke oppfyller SPF- eller DKIM-validering.** **Forebygging av overskriftsinjeksjon**: Validering og sanering av inndata ved hjelp av striptags-bibliotek.** **Avansert beskyttelse**: Sofistikert phishing-deteksjon med forfalskningsdeteksjon, forebygging av identitetstyveri og brukervarslingssystemer.

**MX-implementeringsdetaljer**: Kjernelogikken for e-postbehandling håndteres av MX-serverens kodebase, nærmere bestemt:

* Hoved MX-databehandler: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Vilkårlig e-postfiltrering (anti-forfalskning): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

`isArbitrary`-hjelperen implementerer sofistikerte regler mot forfalskning, inkludert deteksjon av domeneetterligning, blokkerte fraser og ulike phishing-mønstre.

Kilde: <https://forwardemail.net/technical-whitepaper.pdf#page=32>

### Hvordan beskytter du mot spam og misbruk {#how-do-you-protect-against-spam-and-abuse}

Videresend e-post implementerer omfattende flerlagsbeskyttelse:

* **Hastighetsbegrensning**: Brukes på autentiseringsforsøk, API-endepunkter og SMTP-tilkoblinger
* **Ressursisolasjon**: Mellom brukere for å forhindre påvirkning fra brukere med stort volum
* **DDoS-beskyttelse**: Flerlagsbeskyttelse gjennom DataPackets Shield-system og Cloudflare
* **Automatisk skalering**: Dynamisk ressursjustering basert på etterspørsel
* **Misbruksforebygging**: Brukerspesifikke kontroller for misbruksforebygging og hashbasert blokkering for skadelig innhold
* **E-postautentisering**: SPF-, DKIM- og DMARC-protokoller med avansert phishing-deteksjon

Kilder:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (DDoS-beskyttelsesdetaljer)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### Lagrer du e-postinnhold på disken {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Videresend e-post bruker en nullkunnskapsarkitektur som forhindrer at e-postinnhold skrives til disk.

* **Nullkunnskapsarkitektur**: Individuelt krypterte SQLite-postbokser betyr at videresendt e-post ikke kan få tilgang til e-postinnhold
* **Minnesbasert behandling**: E-postbehandling skjer utelukkende i minnet, og unngår disklagring
* **Ingen innholdslogging**: "Vi logger eller lagrer ikke e-postinnhold eller metadata på disk"
* **Sandboxed Encryption**: Krypteringsnøkler lagres aldri på disk i ren tekst

**MX-kodebasebevis**: MX-serveren behandler e-poster utelukkende i minnet uten å skrive innhold til disk. Hovedbehandleren for e-postbehandling demonstrerer denne tilnærmingen i minnet: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Kilder:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Sammendrag)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Detaljer uten kunnskap)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Sandkassekryptering)

### Kan e-postinnhold eksponeres under systemkrasj {#can-email-content-be-exposed-during-system-crashes}

Nei. Videresend e-post implementerer omfattende sikkerhetstiltak mot krasjrelatert dataeksponering:

* **Kjernedumper deaktivert**: Forhindrer minneeksponering under krasj
* **Bytteminne deaktivert**: Fullstendig deaktivert for å forhindre uttrekking av sensitive data fra byttefiler
* **Arkitektur i minnet**: E-postinnhold finnes bare i flyktig minne under behandling
* **Beskyttelse av krypteringsnøkkel**: Nøkler lagres aldri på disk i klartekst
* **Fysisk sikkerhet**: LUKS v2-krypterte disker forhindrer fysisk tilgang til data
* **USB-lagring deaktivert**: Forhindrer uautorisert datauttrekking

**Feilhåndtering for systemproblemer**: Videresend e-post bruker hjelpefunksjonene `isCodeBug` og `isTimeoutError` for å sikre at hvis det oppstår problemer med databasetilkobling, DNS-nettverk/blokkeringsliste eller oppstrømstilkobling, returnerer systemet 421 SMTP-statuskoder for å sikre at e-poster blir forsøkt på nytt senere i stedet for å gå tapt eller bli eksponert.

Implementeringsdetaljer:

* Feilklassifisering: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Håndtering av tidsavbruddsfeil i MX-prosessering: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Kilde: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### Hvem har tilgang til e-postinfrastrukturen din {#who-has-access-to-your-email-infrastructure}

Videresend e-post implementerer omfattende tilgangskontroller for sitt minimale ingeniørteam på 2–3 personer med strenge 2FA-krav:

* **Rollebasert tilgangskontroll**: For teamkontoer med ressursbaserte tillatelser
* **Prinsippet om minste privilegium**: Brukes på tvers av alle systemer
* **Ansvarsdeling**: Mellom operative roller
* **Brukeradministrasjon**: Separate distribusjons- og devops-brukere med distinkte tillatelser
* **Root-pålogging deaktivert**: Tvinger tilgang gjennom riktig autentiserte kontoer
* **Streng 2FA**: Ingen SMS-basert 2FA på grunn av risiko for MiTM-angrep - kun appbaserte eller maskinvaretokener
* **Omfattende revisjonslogging**: Med redigering av sensitive data
* **Automatisert anomalideteksjon**: For uvanlige tilgangsmønstre
* **Regelmessige sikkerhetsgjennomganger**: Av tilgangslogger
* **Forebygging av Evil Maid-angrep**: USB-lagring deaktivert og andre fysiske sikkerhetstiltak

Kilder:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Autorisasjonskontroller)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Nettverkssikkerhet)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Forebygging av Evil Maid-angrep)

### Hvilke infrastrukturleverandører bruker du {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Videresend e-post bruker flere infrastrukturdeltakere med omfattende samsvarssertifiseringer.

Fullstendige detaljer er tilgjengelige på vår GDPR-samsvarsside: <https://forwardemail.net/gdpr>

**Primære infrastrukturdeltakere:**

| Leverandør | Sertifisert rammeverk for personvern | GDPR-samsvarsside |
| ---------------- | -------------------------------- | ----------------------------------------------- |
| **Cloudflare** | ✅ Ja | <https://www.cloudflare.com/trust-hub/gdpr/> |
| **Datapakke** | ❌ Nei | <https://www.datapacket.com/privacy-policy> |
| **Digitalt hav** | ❌ Nei | <https://www.digitalocean.com/legal/gdpr> |
| **Vultr** | ❌ Nei | <https://www.vultr.com/legal/eea-gdpr-privacy/> |

**Detaljerte sertifiseringer:**

**Digitalt hav**

* SOC 2 Type II og SOC 3 Type II (revidert av Schellman & Company LLC)
* ISO 27001-sertifisert ved flere datasentre
* PCI-DSS-kompatibel
* CSA STAR Nivå 1-sertifisert
* APEC CBPR PRP-sertifisert
* Detaljer: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* SOC 2+ (HIPAA)-sertifisert
* PCI Merchant-kompatibel
* CSA STAR nivå 1-sertifisert
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Detaljer: <https://www.vultr.com/legal/compliance/>

**Datapakke**

* SOC 2-kompatibel (kontakt DataPacket direkte for å få sertifisering)
* Infrastruktur i bedriftsklasse (Denver-lokasjon)
* DDoS-beskyttelse gjennom Shield cybersecurity-stacken
* Teknisk støtte døgnet rundt
* Globalt nettverk på tvers av 58 datasentre
* Detaljer: <https://www.datapacket.com/datacenters/denver>

**Betalingsbehandlere:**

* **Stripe**: Sertifisert i henhold til rammeverket for personvern - <https://stripe.com/legal/privacy-center>
* **PayPal**: Ikke DPF-sertifisert - <https://www.paypal.com/uk/legalhub/privacy-full>

### Tilbyr dere en databehandleravtale (DPA) {#do-you-offer-a-data-processing-agreement-dpa}

Ja, Videresend e-post tilbyr en omfattende databehandleravtale (DPA) som kan signeres med vår bedriftsavtale. En kopi av vår DPA er tilgjengelig på: <https://forwardemail.net/dpa>

**DPA-detaljer:**

* Dekker GDPR-samsvar og EU-US/Sveits-US Privacy Shield-rammeverk
* Godtas automatisk når du godtar våre tjenestevilkår
* Ingen separat signatur kreves for standard DPA
* Tilpassede DPA-avtaler tilgjengelig gjennom Enterprise License

**GDPR-samsvarsrammeverk:**
Vår databehandleravtale beskriver samsvar med GDPR samt internasjonale krav til dataoverføring. Fullstendig informasjon er tilgjengelig på: <https://forwardemail.net/gdpr>

For bedriftskunder som trenger tilpassede DPA-vilkår eller spesifikke kontraktsmessige avtaler, kan disse håndteres gjennom vårt **Bedriftslisensprogram ($ 250/måned)**.

### Hvordan håndterer dere varsler om datainnbrudd {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Videresendt e-post sin nullkunnskapsarkitektur begrenser virkningen av sikkerhetsbrudd betydelig.

* **Begrenset dataeksponering**: Kan ikke få tilgang til kryptert e-postinnhold på grunn av nullkunnskapsarkitektur
* **Minimal datainnsamling**: Kun grunnleggende abonnentinformasjon og begrensede IP-logger for sikkerhet
* **Underdatabehandlerrammeverk**: DigitalOcean og Vultr opprettholder GDPR-kompatible hendelsesresponsprosedyrer

**Informasjon om GDPR-representant:**
Forward Email har utnevnt GDPR-representanter i samsvar med artikkel 27:

**EU-representant:**
Osano International Compliance Services Limited
ATTN: LFHC
3 Dublin Landings, North Wall Quay
Dublin 1, D01C4E0

**Representant for Storbritannia:**
Osano UK Compliance LTD
ATTN: LFHC
42–46 Fountain Street, Belfast
Antrim, BT1–5EF

For bedriftskunder som trenger spesifikke tjenestenivåavtaler for varsling om brudd, bør disse diskuteres som en del av en **bedriftslisensavtale**.

Kilder:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### Tilbyr dere et testmiljø {#do-you-offer-a-test-environment}

Den tekniske dokumentasjonen for Videresend e-post beskriver ikke eksplisitt en dedikert sandkassemodus. Potensielle testmetoder inkluderer imidlertid:

* **Alternativ for selvhosting**: Omfattende selvhostingsmuligheter for å lage testmiljøer
* **API-grensesnitt**: Potensial for programmatisk testing av konfigurasjoner
* **Åpen kildekode**: 100 % åpen kildekode lar kunder undersøke videresendingslogikk
* **Flere domener**: Støtte for flere domener kan muliggjøre opprettelse av testdomener

For bedriftskunder som trenger formelle sandkassefunksjoner, bør dette diskuteres som en del av en **bedriftslisens**-avtale.

Kilde: <https://github.com/forwardemail/forwardemail.net> (Detaljer om utviklingsmiljøet)

### Tilbyr dere overvåkings- og varslingsverktøy? {#do-you-provide-monitoring-and-alerting-tools}

Videresend e-post gir overvåking i sanntid med noen begrensninger:

**Tilgjengelig:**

* **Leveringsovervåking i sanntid**: Offentlig synlige ytelsesmålinger for store e-postleverandører
* **Automatisk varsling**: Ingeniørteamet varsles når leveringstiden overstiger 10 sekunder
* **Transparent overvåking**: 100 % åpen kildekode-overvåkingssystemer
* **Infrastrukturovervåking**: Automatisert avviksdeteksjon og omfattende revisjonslogging

**Begrensninger:**

* Kundevendte webhooks eller API-baserte leveringsstatusvarsler er ikke eksplisitt dokumentert.

For bedriftskunder som trenger detaljerte webhooks for leveringsstatus eller tilpassede overvåkingsintegrasjoner, kan disse funksjonene være tilgjengelige gjennom **bedriftslisens**-avtaler.

Kilder:

* <https://forwardemail.net> (Sanntidsovervåkingsvisning)
* <https://github.com/forwardemail/forwardemail.net> (Implementering av overvåking)

### Hvordan sikrer du høy tilgjengelighet {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Videresend e-post implementerer omfattende redundans på tvers av flere infrastrukturleverandører.

* **Distribuert infrastruktur**: Flere leverandører (DigitalOcean, Vultr, DataPacket) på tvers av geografiske regioner
* **Geografisk lastbalansering**: Cloudflare-basert geolokalisert lastbalansering med automatisk failover
* **Automatisk skalering**: Dynamisk ressursjustering basert på etterspørsel
* **Flerlags DDoS-beskyttelse**: Gjennom DataPackets Shield-system og Cloudflare
* **Serverredundans**: Flere servere per region med automatisk failover
* **Databasereplikering**: Sanntidsdatasynkronisering på tvers av flere lokasjoner
* **Overvåking og varsling**: Døgnåpen overvåking med automatisk hendelsesrespons

**Forpliktelse til oppetid**: 99,9 %+ tjenestetilgjengelighet med transparent overvåking tilgjengelig på <https://forwardemail.net>

Kilder:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Overholder du paragraf 889 i National Defense Authorization Act (NDAA) {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Videresendt e-post er i full samsvar med paragraf 889 gjennom nøye utvalg av infrastrukturpartnere.

Ja, videresending av e-post er **kompatibel med paragraf 889**. Paragraf 889 i National Defense Authorization Act (NDAA) forbyr offentlige etater å bruke eller inngå kontrakter med enheter som bruker telekommunikasjons- og videoovervåkingsutstyr fra bestemte selskaper (Huawei, ZTE, Hikvision, Dahua og Hytera).

**Hvordan videresendt e-post oppnår samsvar med paragraf 889:**

Videresendt e-post er utelukkende avhengig av to viktige infrastrukturleverandører, og ingen av dem bruker utstyr som er forbudt i henhold til paragraf 889:

1. **Cloudflare**: Vår primære partner for nettverkstjenester og e-postsikkerhet
2. **DataPacket**: Vår primære leverandør for serverinfrastruktur (med utelukkende Arista Networks- og Cisco-utstyr)
3. **Sikkerhetskopieringsleverandører**: Våre sikkerhetskopieringsleverandører av Digital Ocean og Vultr er i tillegg skriftlig bekreftet å være i samsvar med Section 889.

**Cloudflares forpliktelse**: Cloudflare oppgir eksplisitt i sin tredjeparts etiske retningslinjer at de ikke bruker telekommunikasjonsutstyr, videoovervåkingsprodukter eller tjenester fra noen enheter som er forbudt i henhold til paragraf 889.

**Brukseksempel for myndighetene**: Vår samsvarskrav for paragraf 889 ble validert da **US Naval Academy** valgte Videresend e-post for sine behov for sikker videresending av e-post, noe som krevde dokumentasjon av våre føderale samsvarsstandarder.

For fullstendige detaljer om vårt rammeverk for samsvar med myndighetene, inkludert bredere føderale forskrifter, les vår omfattende casestudie: [I samsvar med paragraf 889 i den føderale regjeringens e-posttjeneste](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)

## System- og tekniske detaljer {#system-and-technical-details}

### Lagrer du e-poster og innholdet i dem? {#do-you-store-emails-and-their-contents}

Nei, vi skriver ikke til disk eller lagrer logger – med [unntak av feil](#do-you-store-error-logs) og [utgående SMTP](#do-you-support-sending-email-with-smtp) (se vår [Personvernerklæring](/privacy)).

Alt gjøres i minnet og [kildekoden vår er på GitHub](https://github.com/forwardemail).

### Hvordan fungerer systemet deres for videresending av e-post? {#how-does-your-email-forwarding-system-work}

E-post er avhengig av [SMTP-protokoll](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). Denne protokollen består av kommandoer sendt til en server (som vanligvis kjører på port 25). Det er en innledende tilkobling, deretter angir avsenderen hvem e-posten er fra ("MAIL FROM"), etterfulgt av hvor den skal ("RCPT TO"), og til slutt overskriftene og brødteksten i selve e-posten ("DATA"). Flyten i vårt system for videresending av e-post er beskrevet i forhold til hver SMTP-protokollkommando nedenfor:

* Første tilkobling (ikke noe kommandonavn, f.eks. `telnet example.com 25`) – Dette er den første tilkoblingen. Vi sjekker avsendere som ikke er i vår [tillatelsesliste](#do-you-have-an-allowlist) mot vår [avslagsliste](#do-you-have-a-denylist). Til slutt, hvis en avsender ikke er i tillatelseslisten vår, sjekker vi om de har vært [grålistet](#do-you-have-a-greylist).

* `HELO` – Dette indikerer en hilsen for å identifisere avsenderens FQDN, IP-adresse eller navn på e-postbehandler. Denne verdien kan forfalskes, så vi er ikke avhengige av disse dataene og bruker i stedet omvendt vertsnavnoppslag av tilkoblingens IP-adresse.

* `MAIL FROM` – Dette angir konvoluttadressen til e-posten. Hvis en verdi skrives inn, må den være en gyldig RFC 5322-e-postadresse. Tomme verdier er tillatt. Vi bruker [sjekk for tilbakespredning](#how-do-you-protect-against-backscatter) her, og vi sjekker også MAIL FROM mot vår [avslagsliste](#do-you-have-a-denylist). Til slutt sjekker vi avsendere som ikke er på tillatelseslisten for hastighetsbegrensning (se avsnittet om [Hastighetsbegrensning](#do-you-have-rate-limiting) og [tillatelsesliste](#do-you-have-an-allowlist) for mer informasjon).

* `RCPT TO` – Dette angir mottakeren(e) av e-posten. Disse må være gyldige RFC 5322-e-postadresser. Vi tillater bare opptil 50 konvoluttmottakere per melding (dette er forskjellig fra «Til»-overskriften i en e-post). Vi sjekker også for en gyldig [Avsenderomskrivingsplan](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) («SRS»)-adresse her for å beskytte mot forfalskning med vårt SRS-domenenavn.

* `DATA` – Dette er kjernedelen av tjenesten vår som behandler en e-post. Se avsnittet [Hvordan behandler du en e-post for videresending](#how-do-you-process-an-email-for-forwarding) nedenfor for mer innsikt.

### Hvordan behandler du en e-post for videresending {#how-do-you-process-an-email-for-forwarding}

Denne delen beskriver prosessen vår knyttet til SMTP-protokollkommandoen `DATA` i delen [Hvordan fungerer systemet deres for videresending av e-post](#how-does-your-email-forwarding-system-work) ovenfor – det handler om hvordan vi behandler en e-posts overskrifter, brødtekst og sikkerhet, bestemmer hvor den skal leveres og hvordan vi håndterer tilkoblinger.

1. Hvis meldingen overstiger maksimalstørrelsen på 50 MB, blir den avvist med feilkoden 552.

2. Hvis meldingen ikke inneholdt en «Fra»-overskrift, eller hvis noen av verdiene i «Fra»-overskriften ikke var gyldige RFC 5322-e-postadresser, blir den avvist med en 550-feilkode.

3. Hvis meldingen hadde mer enn 25 «Mottatt»-overskrifter, ble det fastslått at den hadde blitt sittende fast i en omdirigeringsløkke, og den ble avvist med en 550-feilkode.

4. Ved å bruke e-postens fingeravtrykk (se delen om [Fingeravtrykk](#how-do-you-determine-an-email-fingerprint)) vil vi sjekke om meldingen har blitt forsøkt sendt på nytt i mer enn 5 dager (som samsvarer med [standard postfix-oppførsel](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)), og hvis det er tilfelle, vil den bli avvist med en 550-feilkode.

5. Vi lagrer resultatene fra skanningen av e-posten i minnet ved hjelp av [Spam-skanner](https://spamscanner.net).

6. Hvis det var noen vilkårlige resultater fra Spam Scanner, blir den avvist med en 554-feilkode. Vilkårlige resultater inkluderer bare GTUBE-testen i skrivende stund. Se <https://spamassassin.apache.org/gtube/> for mer innsikt.

7. Vi legger til følgende overskrifter i meldingen for feilsøking og forebygging av misbruk:

* `Received` – vi legger til denne standard Received-headeren med opprinnelses-IP og vert, overføringstype, TLS-tilkoblingsinformasjon, dato/klokkeslett og mottaker.
* `X-Original-To` – den opprinnelige mottakeren for meldingen:
* Dette er nyttig for å bestemme hvor en e-post opprinnelig ble levert til (i tillegg til "Received"-headeren).
* Dette legges til per mottaker ved IMAP og/eller maskert videresending (for å beskytte personvernet).
* `X-Forward-Email-Website` – inneholder en lenke til nettstedet vårt <https://forwardemail.net>
* `X-Forward-Email-Version` – den nåværende [SemVer](https://semver.org/)-versjonen fra `package.json` i kodebasen vår.
* `X-Forward-Email-Session-ID` – en økt-ID-verdi som brukes til feilsøkingsformål (gjelder kun i ikke-produksjonsmiljøer).
* `X-Forward-Email-Sender` - en kommaseparert liste som inneholder den opprinnelige konvoluttadressen MAIL FROM (hvis den ikke var tom), den omvendte PTR-klientens FQDN (hvis den finnes) og avsenderens IP-adresse.
* `X-Forward-Email-ID` - dette gjelder bare for utgående SMTP og korrelerer med e-post-ID-en som er lagret i Min konto → E-poster.
* `X-Original-To`0 - med verdien `X-Original-To`1.
* `X-Original-To`2 - med verdien `X-Original-To`3.
* `X-Original-To`4 - med verdien `X-Original-To`5.

8. Deretter sjekker vi meldingen for [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain) og [DMARC](https://en.wikipedia.org/wiki/DMARC).

* Hvis meldingen mislyktes i DMARC og domenet hadde en avvisningspolicy (f.eks. `p=reject` [var i DMARC-policyen](https://wikipedia.org/wiki/DMARC)), blir den avvist med en 550-feilkode. Vanligvis finnes en DMARC-policy for et domene i `_dmarc`-underdomenets <strong class="notranslate">TXT</strong>-post (f.eks. `dig _dmarc.example.com txt`).

* Hvis meldingen mislyktes i SPF og domenet hadde en hard fail-policy (f.eks. var `-all` i SPF-policyen i motsetning til `~all` eller ingen policy i det hele tatt), blir den avvist med en 550-feilkode. Vanligvis finnes en SPF-policy for et domene i <strong class="notranslate">TXT</strong>-posten for rotdomenet (f.eks. `dig example.com txt`). Se denne delen for mer informasjon om [sende e-post som med Gmail](#can-i-send-mail-as-in-gmail-with-this) angående SPF.

9. Nå behandler vi mottakerne av meldingen slik de er samlet inn fra `RCPT TO`-kommandoen i seksjonen [Hvordan fungerer systemet deres for videresending av e-post](#how-does-your-email-forwarding-system-work) ovenfor. For hver mottaker utfører vi følgende operasjoner:

* Vi slår opp <strong class="notranslate">TXT</strong>-postene for domenenavnet (delen etter `@`-symbolet, f.eks. `example.com` hvis e-postadressen var `test@example.com`). Hvis for eksempel domenet er `example.com`, gjør vi et DNS-oppslag, for eksempel `dig example.com txt`.

* Vi analyserer alle <strong class="notranslate">TXT</strong>-poster som starter med enten `forward-email=` (gratisabonnementer) eller `forward-email-site-verification=` (betalte abonnementer). Merk at vi analyserer begge for å behandle e-poster mens en bruker oppgraderer eller nedgraderer abonnementer.

* Fra disse analyserte <strong class="notranslate">TXT</strong>-postene itererer vi over dem for å trekke ut videresendingskonfigurasjonen (som beskrevet i avsnittet [Hvordan kommer jeg i gang og konfigurerer videresending av e-post](#how-do-i-get-started-and-set-up-email-forwarding) ovenfor). Merk at vi bare støtter én `forward-email-site-verification=`-verdi, og hvis mer enn én oppgis, vil det oppstå en 550-feil, og avsenderen vil motta en returmelding for denne mottakeren.
* Vi itererer rekursivt over den uttrukne videresendingskonfigurasjonen for å bestemme global videresending, regex-basert videresending og alle andre støttede videresendingskonfigurasjoner – som nå er kjent som våre "videresendingsadresser".
* For hver videresendingsadresse støtter vi ett rekursivt oppslag (som vil starte denne serien med operasjoner på nytt på den gitte adressen). Hvis det blir funnet et rekursivt samsvar, vil det overordnede resultatet bli fjernet fra videresendingsadressene, og de underordnede legges til.
* Videresendingsadresser analyseres for unikhet (siden vi ikke ønsker å sende duplikater til én adresse eller skape unødvendige SMTP-klientforbindelser).
* For hver videresendingsadresse slår vi opp domenenavnet mot API-endepunktet vårt `/v1/max-forwarded-addresses` (for å bestemme hvor mange adresser domenet har lov til å videresende e-post til per alias, f.eks. 10 som standard – se avsnittet om `example.com`0). Hvis denne grensen overskrides, vil det oppstå en 550-feil, og avsenderen vil motta en returmelding for denne mottakeren.

* Vi slår opp innstillingene til den opprinnelige mottakeren mot API-endepunktet vårt `example.com`1, som støtter et oppslag for betalende brukere (med en reserve for gratisbrukere). Dette returnerer et konfigurasjonsobjekt for avanserte innstillinger for `example.com`2 (tall, f.eks. `example.com`3), `example.com`4 (boolsk), `example.com`5 (boolsk), `example.com`6 (boolsk) og `example.com`7 (boolsk).

* Basert på disse innstillingene sjekker vi deretter mot resultatene fra Spam-skanneren, og hvis det oppstår feil, avvises meldingen med feilkoden 554 (f.eks. hvis `example.com`8 er aktivert, sjekker vi resultatene fra Spam-skanneren for virus). Merk at alle brukere av gratisabonnementet vil bli valgt inn for kontroller mot innhold for voksne, phishing, kjørbare filer og virus. Som standard er alle brukere av betalte abonnementer også valgt inn, men denne konfigurasjonen kan endres under Innstillinger-siden for et domene i dashbordet for videresending av e-post).

10. For hver behandlede mottakers videresendingsadresser utfører vi deretter følgende operasjoner:

* Adressen sjekkes mot vår [avslagsliste](#do-you-have-a-denylist), og hvis den var oppført, vil en 421-feilkode oppstå (indikerer at avsenderen må prøve på nytt senere).

* Hvis adressen er en webhook, setter vi en boolsk verdi for fremtidige operasjoner (se nedenfor – vi grupperer lignende webhooks for å lage én POST-forespørsel kontra flere for levering).

* Hvis adressen er en e-postadresse, analyserer vi verten for fremtidige operasjoner (se nedenfor – vi grupperer lignende verter for å lage én tilkobling kontra flere individuelle tilkoblinger for levering).

11. Hvis det ikke finnes noen mottakere og det ikke er noen returer, svarer vi med en 550-feilmelding om «Ugyldige mottakere».

12. Hvis det finnes mottakere, itererer vi over dem (gruppert sammen av samme vert) og leverer e-postene. Se avsnittet [Hvordan håndterer du problemer med e-postlevering](#how-do-you-handle-email-delivery-issues) nedenfor for mer innsikt.

* Hvis det oppstår feil under sending av e-post, lagrer vi dem i minnet for senere behandling.
* Vi tar den laveste feilkoden (hvis noen) fra sending av e-post – og bruker den som svarkode på `DATA`-kommandoen. Dette betyr at e-poster som ikke er levert, vanligvis blir forsøkt sendt på nytt av den opprinnelige avsenderen, men e-poster som allerede er levert, sendes ikke på nytt neste gang meldingen sendes (slik vi bruker [Fingeravtrykk](#how-do-you-determine-an-email-fingerprint)).
* Hvis det ikke oppsto noen feil, sender vi en SMTP-svarstatuskode på 250 vellykkede.
* En retur bestemmes som ethvert leveringsforsøk som resulterer i en statuskode som er >= 500 (permanente feil).

13. Hvis det ikke oppstod noen returer (permanente feil), returnerer vi en SMTP-svarstatuskode med den laveste feilkoden fra ikke-permanente feil (eller en statuskode på 250 vellykkede feil hvis det ikke fantes noen).

14. Hvis det oppstår avvisninger, sender vi avvisnings-e-poster i bakgrunnen etter at vi har returnert den laveste av alle feilkodene til avsenderen. Hvis den laveste feilkoden er >= 500, sender vi ingen avvisnings-e-poster. Dette er fordi hvis vi gjorde det, ville avsenderne motta en dobbel avvisnings-e-post (f.eks. én fra deres utgående MTA, for eksempel Gmail – og også én fra oss). Se avsnittet om [Hvordan beskytter du mot tilbakespredning](#how-do-you-protect-against-backscatter) nedenfor for mer innsikt.

### Hvordan håndterer dere problemer med e-postlevering {#how-do-you-handle-email-delivery-issues}

Merk at vi vil omskrive e-postene med «Friendly-From» hvis og bare hvis avsenderens DMARC-policy ikke ble godkjent OG ingen DKIM-signaturer var justert med «Fra»-overskriften. Dette betyr at vi vil endre «Fra»-overskriften på meldingen, sette «X-Original-From» og også sette en «Svar til» hvis den ikke allerede var angitt. Vi vil også forsegle ARC-forseglingen på meldingen på nytt etter å ha endret disse overskriftene.

Vi bruker også smart parsing av feilmeldinger på alle nivåer i stakken vår – i koden vår, DNS-forespørsler, Node.js-internals, HTTP-forespørsler (f.eks. 408, 413 og 429 er tilordnet SMTP-svarkoden 421 hvis mottakeren er en webhook), og e-postserversvar (f.eks. svar med "defer" eller "slowdown" ville bli prøvd på nytt som 421-feil).

Logikken vår er dummy-sikker, og den vil også prøve på nytt for SSL/TLS-feil, tilkoblingsproblemer og mer. Målet med dummy-proofing er å maksimere leveringsevnen til alle mottakere for en videresendingskonfigurasjon.

Hvis mottakeren er en webhook, vil vi tillate en tidsavbrudd på 60 sekunder for at forespørselen skal fullføres, med opptil 3 nye forsøk (så totalt 4 forespørsler før en feil). Merk at vi analyserer feilkodene 408, 413 og 429 riktig og tilordner dem til en SMTP-svarkode på 421.

Hvis mottakeren er en e-postadresse, vil vi forsøke å sende e-posten med opportunistisk TLS (vi forsøker å bruke STARTTLS hvis det er tilgjengelig på mottakerens e-postserver). Hvis det oppstår en SSL/TLS-feil under forsøket på å sende e-posten, vil vi forsøke å sende e-posten uten TLS (uten å bruke STARTTLS).

Hvis det oppstår DNS- eller tilkoblingsfeil, returnerer vi en SMTP-svarkode på 421 til `DATA`-kommandoen. Hvis det ellers er feil på nivået >= 500, sendes det returmeldinger.

Hvis vi oppdager at en e-postserver vi prøver å levere til har en eller flere av IP-adressene våre for e-postutveksling blokkert (f.eks. av hvilken som helst teknologi de bruker for å avvise spammere), sender vi en SMTP-svarkode på 421 slik at avsenderen kan prøve meldingen på nytt senere (og vi blir varslet om problemet slik at vi forhåpentligvis kan løse det før neste forsøk).

### Hvordan håndterer du at IP-adressene dine blir blokkert {#how-do-you-handle-your-ip-addresses-becoming-blocked}

Vi overvåker rutinemessig alle større DNS-avvisningslister, og hvis noen av våre IP-adresser for e-postutveksling ("MX") er oppført i en større avvisningsliste, vil vi trekke den ut av den relevante DNS A-posten om mulig inntil problemet er løst.

I skrivende stund er vi også oppført på flere DNS-godkjenningslister, og vi tar overvåking av avvisningslister på alvor. Hvis du ser noen problemer før vi har mulighet til å løse dem, vennligst gi oss beskjed skriftlig på <support@forwardemail.net>.

IP-adressene våre er offentlig tilgjengelige, [se denne delen nedenfor for mer innsikt](#what-are-your-servers-ip-addresses).

### Hva er postmasteradresser {#what-are-postmaster-addresses}

For å forhindre feiladresserte returer og sending av feriesvarmeldinger til uovervåkede eller ikke-eksisterende postbokser, vedlikeholder vi en liste over brukernavn som ligner på mailer-daemoner:

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
* [og enhver adresse uten svar](#what-are-no-reply-addresses)

Se [RFC 5320 avsnitt 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) for mer innsikt i hvordan lister som disse brukes til å lage effektive e-postsystemer.

### Hva er adresser uten svar {#what-are-no-reply-addresses}

E-postbrukernavn som tilsvarer ett av følgende (ikke store og små bokstaver) regnes som adresser med manglende svar:

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

### Hva er IP-adressene til serveren din? {#what-are-your-servers-ip-addresses}

Vi publiserer IP-adressene våre på <https://forwardemail.net/ips>.

### Har du en tillatelsesliste {#do-you-have-an-allowlist}

Ja, vi har en [liste over domenenavnutvidelser](#what-domain-name-extensions-are-allowlisted-by-default) som er på tillatelseslisten som standard og en dynamisk, bufret og rullerende tillatelsesliste basert på [strenge kriterier](#what-is-your-allowlist-criteria).

Alle e-poster, domener og mottakere fra kunder med betalte abonnementer legges automatisk til i tillatelseslisten vår.

### Hvilke domenenavnutvidelser er godkjent som standard {#what-domain-name-extensions-are-allowlisted-by-default}

Følgende domenenavnutvidelser anses som standard å være på godkjenningslisten (uavhengig av om de er på paraplypopularitetslisten eller ikke):

<ul class="list-inline"> <li class="list-inline-item"><code class="notranslate">edu</code></li> <li class="list-inline-item"><code class="notranslate">gov</code></li> <li class="list-inline-item"><code class="notranslate">mil</code></li> <li class="list-inline-item"><code class="notranslate">int</code></li> <li class="list-inline-item"><code class="notranslate">arpa</code></li> <li class="list-inline-item"><code class="notranslate">dni.us</code></li> <li class="list-inline-item"><code class="notranslate">fed.us</code></li> <li class="list-inline-item"><code class="notranslate">isa.us</code></li> <li class="list-inline-item"><code class="notranslate">kids.us</code></li> <li class="list-inline-item"><code class="notranslate">nsn.us</code></li> <li class="list-inline-item"><code class="notranslate">ak.us</code></li> <li class="list-inline-item"><code class="notranslate">al.us</code></li> <li class="list-inline-item"><code class="notranslate">ar.us</code></li> <li class="list-inline-item"><code class="notranslate">as.us</code></li> <li class="list-inline-item"><code class="notranslate">az.us</code></li> <li class="list-inline-item"><code class="notranslate">ca.us</code></li> <li class="list-inline-item"><code class="notranslate">co.us</code></li> <li class="list-inline-item"><code class="notranslate">ct.us</code></li> <li class="list-inline-item"><code class="notranslate">dc.us</code></li> <li class="list-inline-item"><code class="notranslate">de.us</code></li> <li class="list-inline-item"><code class="notranslate">fl.us</code></li> <li class="list-inline-item"><code class="notranslate">ga.us</code></li> <li class="list-inline-item"><code class="notranslate">gu.us</code></li> <li class="list-inline-item"><code class="notranslate">hi.us</code></li> <li class="list-inline-item"><code class="notranslate">ia.us</code></li> <li class="list-inline-item"><code class="notranslate">id.us</code></li> <li class="list-inline-item"><code class="notranslate">il.us</code></li> <li class="list-inline-item"><code class="notranslate">in.us</code></li> <li class="list-inline-item"><code class="notranslate">ks.us</code></li> <li class="list-inline-item"><code class="notranslate">ky.us</code></li> <li class="list-inline-item"><code class="notranslate">la.us</code></li> <li class="list-inline-item"><code class="notranslate">ma.us</code></li> <li class="list-inline-item"><code class="notranslate">md.us</code></li> <li class="list-inline-item"><code class="notranslate">me.us</code></li> <li class="list-inline-item"><code class="notranslate">mi.us</code></li> <li class="list-inline-item"><code class="notranslate">mn.us</code></li> <li class="list-inline-item"><code class="notranslate">mo.us</code></li> <li class="list-inline-item"><code class="notranslate">ms.us</code></li> <li class="list-inline-item"><code class="notranslate">mt.us</code></li> <li class="list-inline-item"><code class="notranslate">nc.us</code></li> <li class="list-inline-item"><code class="notranslate">nd.us</code></li> <li class="list-inline-item"><code class="notranslate">ne.us</code></li> <li class="list-inline-item"><code class="notranslate">nh.us</code></li> <li class="list-inline-item"><code class="notranslate">nm.us</code></li> <li class="list-inline-item"><code class="notranslate">nv.us</code></li> <li class="list-inline-item"><code class="notranslate">ny.us</code></li> <li class="list-inline-item"><code class="notranslate">oh.us</code></li> <li class="list-inline-item"><code class="notranslate">ok.us</code></li> <li class="list-inline-item"><code class="notranslate">or.us</code></li> <li class="list-inline-item"><code class="notranslate">pa.us</code></li> <li class="list-inline-item"><code class="notranslate">pr.us</code></li> <li class="list-inline-item"><code class="notranslate">ri.us</code></li> <li class="list-inline-item"><code class="notranslate">sc.us</code></li> <li class="list-inline-item"><code class="notranslate">sd.us</code></li> <li class="list-inline-item"><code class="notranslate">tn.us</code></li> <li class="list-inline-item"><code class="notranslate">tx.us</code></li> <li class="list-inline-item"><code class="notranslate">ut.us</code></li> <li class="list-inline-item"><code class="notranslate">va.us</code></li> <li class="list-inline-item"><code class="notranslate">vi.us</code></li> <li class="list-inline-item"><code class="notranslate">vt.us</code></li> <li class="list-inline-item"><code class="notranslate">wa.us</code></li> <li class="list-inline-item"><code class="notranslate">wi.us</code></li> <li class="list-inline-item"><code class="notranslate">wv.us</code></li> <li class="list-inline-item"><code class="notranslate">wy.us</code></li>
<li class="list-inline-item"><code class="notranslate">mil.tt</code></li>
<li class="list-inline-item"><code class="notranslate">edu.tt</code></li>
<li class="list-inline-item"><code class="notranslate">edu.tr</code></li>
<li class="list-inline-item"><code class="notranslate">edu.ua</code></li>
<li class="list-inline-item"><code class="notranslate">edu.au</code></li>
<li class="list-inline-item"><code class="notranslate">ac.at</code></li>
<li class="list-inline-item"><code class="notranslate">edu.br</code></li>
<li class="list-inline-item"><code class="notranslate">ac.nz</code></li>
<li class="list-inline-item"><code class="notranslate">skole.nz</code></li>
<li class="list-inline-item"><code class="notranslate">cri.nz</code></li>
<li class="list-inline-item"><code class="notranslate">helse.nz</code></li>
<li class="list-inline-item"><code class="notranslate">mil.nz</code></li>
<li class="list-inline-item"><code class="notranslate">parlament.nz</code></li>
<li class="list-inline-item"><code class="notranslate">ac.in</code></li>
<li class="list-inline-item"><code class="notranslate">edu.in</code></li>
<li class="list-inline-item"><code class="notranslate">mil.in</code></li> <li class="list-inline-item"><code class="notranslate">ac.jp</code></li> <li class="list-inline-item"><code class="notranslate">ed.jp</code></li> <li class="list-inline-item"><code class="notranslate">lg.jp</code></li> <li class="list-inline-item"><code class="notranslate">ac.za</code></li> <li class="list-inline-item"><code class="notranslate">edu.za</code></li> <li class="list-inline-item"><code class="notranslate">mil.za</code></li> <li class="list-inline-item"><code class="notranslate">skole.za</code></li> <li class="list-inline-item"><code class="notranslate">mil.kr</code></li>
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
<li class="list-inline-item"><code class="notranslate">gov.ad</code></li> <li class="list-inline-item"><code class="notranslate">gov.af</code></li> <li class="list-inline-item"><code class="notranslate">gov.ai</code></li> <li class="list-inline-item"><code class="notranslate">gov.al</code></li> <li class="list-inline-item"><code class="notranslate">gov.am</code></li> <li class="list-inline-item"><code class="notranslate">gov.ao</code></li> <li class="list-inline-item"><code class="notranslate">gov.au</code></li> <li class="list-inline-item"><code class="notranslate">gov.aw</code></li> <li class="list-inline-item"><code class="notranslate">gov.ax</code></li> <li class="list-inline-item"><code class="notranslate">gov.az</code></li> <li class="list-inline-item"><code class="notranslate">gov.bd</code></li> <li class="list-inline-item"><code class="notranslate">gov.be</code></li> <li class="list-inline-item"><code class="notranslate">gov.bg</code></li> <li class="list-inline-item"><code class="notranslate">gov.bm</code></li> <!--<li class="list-inline-item"><code class="notranslate">gov.br</code></li>--> <li class="list-inline-item"><code class="notranslate">gov.by</code></li> <li class="list-inline-item"><code class="notranslate">gov.cl</code></li>
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
<li class="list-inline-item"><code class="notranslate">gov.pt</code></li> <li class="list-inline-item"><code class="notranslate">gov.py</code></li> <li class="list-inline-item"><code class="notranslate">gov.ro</code></li> <li class="list-inline-item"><code class="notranslate">gov.ru</code></li> <li class="list-inline-item"><code class="notranslate">gov.scot</code></li> <li class="list-inline-item"><code class="notranslate">gov.se</code></li> <li class="list-inline-item"><code class="notranslate">gov.sg</code></li> <li class="list-inline-item"><code class="notranslate">gov.si</code></li> <li class="list-inline-item"><code class="notranslate">gov.sk</code></li>
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
<li class="list-inline-item"><code class="notranslate">judiciary.uk</code></li> <li class="list-inline-item"><code class="notranslate">mod.uk</code></li> <li class="list-inline-item"><code class="notranslate">nhs.uk</code></li> <li class="list-inline-item"><code class="notranslate">parlamentet.uk</code></li> <li class="list-inline-item"><code class="notranslate">politiet.uk</code></li> <li class="list-inline-item"><code class="notranslate">rct.uk</code></li> <li class="list-inline-item"><code class="notranslate">royal.uk</code></li> <li class="list-inline-item"><code class="notranslate">sch.uk</code></li> <li class="list-inline-item"><code class="notranslate">ukaea.uk</code></li>
</ul>

I tillegg er disse [merkevare- og bedriftsdomener på toppnivå](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) på tillatelseslisten som standard (f.eks. `apple` for `applecard.apple` for Apple Card-kontoutskrifter):

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">aaa</code></li>
<li class="list-inline-item"><code class="notranslate">aarp</code></li>
<li class="list-inline-item"><code class="notranslate">abarth</code></li>
<li class="list-inline-item"><code class="notranslate">abb</code></li>
<li class="list-inline-item"><code class="notranslate">abbott</code></li>
<li class="list-inline-item"><code class="notranslate">abbvie</code></li>
<li class="list-inline-item"><code class="notranslate">abc</code></li>
<li class="list-inline-item"><code class="notranslate">accenture</code></li>
<li class="list-inline-item"><code class="notranslate">aco</code></li> <li class="list-inline-item"><code class="notranslate">aeg</code></li> <li class="list-inline-item"><code class="notranslate">aetna</code></li> <li class="list-inline-item"><code class="notranslate">afl</code></li> <li class="list-inline-item"><code class="notranslate">agakhan</code></li> <li class="list-inline-item"><code class="notranslate">aig</code></li> <li class="list-inline-item"><code class="notranslate">aigo</code></li> <li class="list-inline-item"><code class="notranslate">airbus</code></li> <li class="list-inline-item"><code class="notranslate">airtel</code></li>
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
<li class="list-inline-item"><code class="notranslate">apple</code></li> <li class="list-inline-item"><code class="notranslate">akvarell</code></li> <li class="list-inline-item"><code class="notranslate">aramco</code></li> <li class="list-inline-item"><code class="notranslate">audi</code></li> <li class="list-inline-item"><code class="notranslate">auspost</code></li> <li class="list-inline-item"><code class="notranslate">aws</code></li> <li class="list-inline-item"><code class="notranslate">axa</code></li> <li class="list-inline-item"><code class="notranslate">azure</code></li> <li class="list-inline-item"><code class="notranslate">baidu</code></li> <li class="list-inline-item"><code class="notranslate">bananarepublic</code></li> <li class="list-inline-item"><code class="notranslate">barclaycard</code></li> <li class="list-inline-item"><code class="notranslate">barclays</code></li> <li class="list-inline-item"><code class="notranslate">basketball</code></li> <li class="list-inline-item"><code class="notranslate">bauhaus</code></li> <li class="list-inline-item"><code class="notranslate">bbc</code></li> <li class="list-inline-item"><code class="notranslate">bbt</code></li> <li class="list-inline-item"><code class="notranslate">bbva</code></li> <li class="list-inline-item"><code class="notranslate">bcg</code></li> <li class="list-inline-item"><code class="notranslate">bentley</code></li> <li class="list-inline-item"><code class="notranslate">bharti</code></li> <li class="list-inline-item"><code class="notranslate">bing</code></li> <li class="list-inline-item"><code class="notranslate">blanco</code></li> <li class="list-inline-item"><code class="notranslate">bloomberg</code></li> <li class="list-inline-item"><code class="notranslate">bms</code></li> <li class="list-inline-item"><code class="notranslate">BMW</code></li> <li class="list-inline-item"><code class="notranslate">bnl</code></li> <li class="list-inline-item"><code class="notranslate">bnpparibas</code></li> <li class="list-inline-item"><code class="notranslate">boehringer</code></li> <li class="list-inline-item"><code class="notranslate">obligasjon</code></li> <li class="list-inline-item"><code class="notranslate">booking</code></li> <li class="list-inline-item"><code class="notranslate">bosch</code></li> <li class="list-inline-item"><code class="notranslate">bostik</code></li> <li class="list-inline-item"><code class="notranslate">bradesco</code></li> <li class="list-inline-item"><code class="notranslate">bridgestone</code></li> <li class="list-inline-item"><code class="notranslate">brother</code></li> <li class="list-inline-item"><code class="notranslate">bugatti</code></li> <li class="list-inline-item"><code class="notranslate">cal</code></li> <li class="list-inline-item"><code class="notranslate">calvinklein</code></li> <li class="list-inline-item"><code class="notranslate">canon</code></li> <li class="list-inline-item"><code class="notranslate">capitalone</code></li> <li class="list-inline-item"><code class="notranslate">campingvogn</code></li> <li class="list-inline-item"><code class="notranslate">cartier</code></li> <li class="list-inline-item"><code class="notranslate">cba</code></li> <li class="list-inline-item"><code class="notranslate">cbn</code></li> <li class="list-inline-item"><code class="notranslate">cbre</code></li> <li class="list-inline-item"><code class="notranslate">cbs</code></li> <li class="list-inline-item"><code class="notranslate">cern</code></li> <li class="list-inline-item"><code class="notranslate">cfa</code></li> <li class="list-inline-item"><code class="notranslate">Chanel</code></li> <li class="list-inline-item"><code class="notranslate">Chase</code></li> <li class="list-inline-item"><code class="notranslate">Chintai</code></li> <li class="list-inline-item"><code class="notranslate">Chrysler</code></li> <li class="list-inline-item"><code class="notranslate">Cipriani</code></li> <li class="list-inline-item"><code class="notranslate">Cisco</code></li> <li class="list-inline-item"><code class="notranslate">Citadel</code></li> <li class="list-inline-item"><code class="notranslate">citi</code></li> <li class="list-inline-item"><code class="notranslate">citic</code></li> <li class="list-inline-item"><code class="notranslate">clubmed</code></li> <li class="list-inline-item"><code class="notranslate">comcast</code></li> <li class="list-inline-item"><code class="notranslate">commbank</code></li> <li class="list-inline-item"><code class="notranslate">kredittunion</code></li> <li class="list-inline-item"><code class="notranslate">krone</code></li> <li class="list-inline-item"><code class="notranslate">crs</code></li> <li class="list-inline-item"><code class="notranslate">csc</code></li> <li class="list-inline-item"><code class="notranslate">cuisinella</code></li> <li class="list-inline-item"><code class="notranslate">dabur</code></li> <li class="list-inline-item"><code class="notranslate">datsun</code></li> <li class="list-inline-item"><code class="notranslate">forhandler</code></li> <li class="list-inline-item"><code class="notranslate">dell</code></li> <li class="list-inline-item"><code class="notranslate">deloitte</code></li> <li class="list-inline-item"><code class="notranslate">delaitte</code></li> <li class="list-inline-item"><code class="notranslate">delaitte</code></li> <li class="list-inline-item"><code class="notranslate">dhl</code></li> <li class="list-inline-item"><code class="notranslate">oppdag</code></li> <li class="list-inline-item"><code class="notranslate">oppvask</code></li> <li class="list-inline-item"><code class="notranslate">dnp</code></li> <li class="list-inline-item"><code class="notranslate">dodge</code></li> <li class="list-inline-item"><code class="notranslate">dunlop</code></li> <li class="list-inline-item"><code class="notranslate">dupont</code></li> <li class="list-inline-item"><code class="notranslate">dvag</code></li> <li class="list-inline-item"><code class="notranslate">edeka</code></li> <li class="list-inline-item"><code class="notranslate">emerck</code></li> <li class="list-inline-item"><code class="notranslate">epson</code></li> <li class="list-inline-item"><code class="notranslate">ericsson</code></li> <li class="list-inline-item"><code class="notranslate">erni</code></li> <li class="list-inline-item"><code class="notranslate">forsikring</code></li> <li class="list-inline-item"><code class="notranslate">etisalat</code></li> <li class="list-inline-item"><code class="notranslate">eurovision</code></li> <li class="list-inline-item"><code class="notranslate">everbank</code></li> <li class="list-inline-item"><code class="notranslate">extraspace</code></li> <li class="list-inline-item"><code class="notranslate">fage</code></li> <li class="list-inline-item"><code class="notranslate">fairwinds</code></li> <li class="list-inline-item"><code class="notranslate">farmers</code></li> <li class="list-inline-item"><code class="notranslate">fedex</code></li> <li class="list-inline-item"><code class="notranslate">ferrari</code></li> <li class="list-inline-item"><code class="notranslate">ferrero</code></li> <li class="list-inline-item"><code class="notranslate">fiat</code></li> <li class="list-inline-item"><code class="notranslate">fidelity</code></li> <li class="list-inline-item"><code class="notranslate">firestone</code></li> <li class="list-inline-item"><code class="notranslate">firmdale</code></li> <li class="list-inline-item"><code class="notranslate">flickr</code></li> <li class="list-inline-item"><code class="notranslate">flir</code></li> <li class="list-inline-item"><code class="notranslate">flsmidth</code></li> <li class="list-inline-item"><code class="notranslate">ford</code></li> <li class="list-inline-item"><code class="notranslate">fox</code></li> <li class="list-inline-item"><code class="notranslate">fresenius</code></li> <li class="list-inline-item"><code class="notranslate">forex</code></li> <li class="list-inline-item"><code class="notranslate">frogans</code></li> <li class="list-inline-item"><code class="notranslate">frontier</code></li> <li class="list-inline-item"><code class="notranslate">fujitsu</code></li> <li class="list-inline-item"><code class="notranslate">fujixerox</code></li> <li class="list-inline-item"><code class="notranslate">gallo</code></li> <li class="list-inline-item"><code class="notranslate">gallup</code></li> <li class="list-inline-item"><code class="notranslate">gap</code></li> <li class="list-inline-item"><code class="notranslate">gbiz</code></li> <li class="list-inline-item"><code class="notranslate">gea</code></li> <li class="list-inline-item"><code class="notranslate">genting</code></li> <li class="list-inline-item"><code class="notranslate">giving</code></li> <li class="list-inline-item"><code class="notranslate">gle</code></li> <li class="list-inline-item"><code class="notranslate">globo</code></li> <li class="list-inline-item"><code class="notranslate">gmail</code></li>
<li class="list-inline-item"><code class="notranslate">gmo</code></li> <li class="list-inline-item"><code class="notranslate">gmx</code></li> <li class="list-inline-item"><code class="notranslate">godaddy</code></li> <li class="list-inline-item"><code class="notranslate">goldpoint</code></li> <li class="list-inline-item"><code class="notranslate">goodyear</code></li> <li class="list-inline-item"><code class="notranslate">goog</code></li> <li class="list-inline-item"><code class="notranslate">google</code></li> <li class="list-inline-item"><code class="notranslate">grainger</code></li> <li class="list-inline-item"><code class="notranslate">Guardian</code></li> <li class="list-inline-item"><code class="notranslate">Gucci</code></li> <li class="list-inline-item"><code class="notranslate">HBO</code></li> <li class="list-inline-item"><code class="notranslate">HDFC</code></li> <li class="list-inline-item"><code class="notranslate">HDFCBank</code></li> <li class="list-inline-item"><code class="notranslate">Hermes</code></li> <li class="list-inline-item"><code class="notranslate">Hisamitsu</code></li> <li class="list-inline-item"><code class="notranslate">Hitachi</code></li> <li class="list-inline-item"><code class="notranslate">hkt</code></li> <li class="list-inline-item"><code class="notranslate">honda</code></li> <li class="list-inline-item"><code class="notranslate">honeywell</code></li> <li class="list-inline-item"><code class="notranslate">hotmail</code></li> <li class="list-inline-item"><code class="notranslate">hsbc</code></li> <li class="list-inline-item"><code class="notranslate">hughes</code></li> <li class="list-inline-item"><code class="notranslate">hyatt</code></li> <li class="list-inline-item"><code class="notranslate">hyundai</code></li> <li class="list-inline-item"><code class="notranslate">ibm</code></li> <li class="list-inline-item"><code class="notranslate">ieee</code></li> <li class="list-inline-item"><code class="notranslate">ifm</code></li> <li class="list-inline-item"><code class="notranslate">ikano</code></li> <li class="list-inline-item"><code class="notranslate">imdb</code></li> <li class="list-inline-item"><code class="notranslate">infiniti</code></li> <li class="list-inline-item"><code class="notranslate">intel</code></li> <li class="list-inline-item"><code class="notranslate">intuit</code></li> <li class="list-inline-item"><code class="notranslate">ipiranga</code></li> <li class="list-inline-item"><code class="notranslate">iselect</code></li> <li class="list-inline-item"><code class="notranslate">Italia</code></li> <li class="list-inline-item"><code class="notranslate">itv</code></li> <li class="list-inline-item"><code class="notranslate">iveco</code></li> <li class="list-inline-item"><code class="notranslate">jaguar</code></li> <li class="list-inline-item"><code class="notranslate">java</code></li> <li class="list-inline-item"><code class="notranslate">jcb</code></li> <li class="list-inline-item"><code class="notranslate">jcp</code></li> <li class="list-inline-item"><code class="notranslate">jeep</code></li> <li class="list-inline-item"><code class="notranslate">jpmorgan</code></li> <li class="list-inline-item"><code class="notranslate">juniper</code></li> <li class="list-inline-item"><code class="notranslate">kddi</code></li> <li class="list-inline-item"><code class="notranslate">kerryhotels</code></li> <li class="list-inline-item"><code class="notranslate">kerrylogistics</code></li> <li class="list-inline-item"><code class="notranslate">kerryproperties</code></li> <li class="list-inline-item"><code class="notranslate">kfh</code></li> <li class="list-inline-item"><code class="notranslate">kia</code></li> <li class="list-inline-item"><code class="notranslate">kinder</code></li> <li class="list-inline-item"><code class="notranslate">kindle</code></li> <li class="list-inline-item"><code class="notranslate">komatsu</code></li> <li class="list-inline-item"><code class="notranslate">kpmg</code></li> <li class="list-inline-item"><code class="notranslate">kred</code></li> <li class="list-inline-item"><code class="notranslate">kuokgroup</code></li> <li class="list-inline-item"><code class="notranslate">lacaixa</code></li> <li class="list-inline-item"><code class="notranslate">ladbrokes</code></li> <li class="list-inline-item"><code class="notranslate">lamborghini</code></li> <li class="list-inline-item"><code class="notranslate">lancaster</code></li> <li class="list-inline-item"><code class="notranslate">lancia</code></li> <li class="list-inline-item"><code class="notranslate">lancome</code></li> <li class="list-inline-item"><code class="notranslate">landrover</code></li> <li class="list-inline-item"><code class="notranslate">lanxess</code></li> <li class="list-inline-item"><code class="notranslate">lasalle</code></li> <li class="list-inline-item"><code class="notranslate">latrobe</code></li> <li class="list-inline-item"><code class="notranslate">lds</code></li> <li class="list-inline-item"><code class="notranslate">leclerc</code></li> <li class="list-inline-item"><code class="notranslate">lego</code></li> <li class="list-inline-item"><code class="notranslate">liaison</code></li> <li class="list-inline-item"><code class="notranslate">lexus</code></li> <li class="list-inline-item"><code class="notranslate">lidl</code></li> <li class="list-inline-item"><code class="notranslate">livsstil</code></li> <li class="list-inline-item"><code class="notranslate">lilly</code></li> <li class="list-inline-item"><code class="notranslate">lincoln</code></li> <li class="list-inline-item"><code class="notranslate">linde</code></li> <li class="list-inline-item"><code class="notranslate">lipsy</code></li> <li class="list-inline-item"><code class="notranslate">lixil</code></li> <li class="list-inline-item"><code class="notranslate">locus</code></li> <li class="list-inline-item"><code class="notranslate">lotte</code></li> <li class="list-inline-item"><code class="notranslate">lpl</code></li> <li class="list-inline-item"><code class="notranslate">lplfinancial</code></li> <li class="list-inline-item"><code class="notranslate">lundbeck</code></li> <li class="list-inline-item"><code class="notranslate">lupin</code></li> <li class="list-inline-item"><code class="notranslate">macys</code></li> <li class="list-inline-item"><code class="notranslate">maif</code></li> <li class="list-inline-item"><code class="notranslate">mann</code></li> <li class="list-inline-item"><code class="notranslate">mango</code></li> <li class="list-inline-item"><code class="notranslate">Marriott</code></li> <li class="list-inline-item"><code class="notranslate">Maserati</code></li> <li class="list-inline-item"><code class="notranslate">Mattel</code></li> <li class="list-inline-item"><code class="notranslate">McKinsey</code></li> <li class="list-inline-item"><code class="notranslate">MetLife</code></li> <li class="list-inline-item"><code class="notranslate">Microsoft</code></li> <li class="list-inline-item"><code class="notranslate">Mini</code></li> <li class="list-inline-item"><code class="notranslate">Microsoft</code></li> <li class="list-inline-item"><code class="notranslate">Microsoft</code></li> class="notranslate">mitsubishi</code></li> <li class="list-inline-item"><code class="notranslate">mlb</code></li> <li class="list-inline-item"><code class="notranslate">mma</code></li> <li class="list-inline-item"><code class="notranslate">monash</code></li> <li class="list-inline-item"><code class="notranslate">mormon</code></li> <li class="list-inline-item"><code class="notranslate">moto</code></li> <li class="list-inline-item"><code class="notranslate">movistar</code></li> <li class="list-inline-item"><code class="notranslate">msd</code></li> <li class="list-inline-item"><code class="notranslate">mtn</code></li> <li class="list-inline-item"><code class="notranslate">mtr</code></li> <li class="list-inline-item"><code class="notranslate">gjensidig</code></li> <li class="list-inline-item"><code class="notranslate">nadex</code></li> <li class="list-inline-item"><code class="notranslate">landsdekkende</code></li> <li class="list-inline-item"><code class="notranslate">natura</code></ li> <li class="list-inline-item"><code class="notranslate">nba</code></li> <li class="list-inline-item"><code class="notranslate">nec</code></li> <li class="list-inline-item"><code class="notranslate">netflix</code></li> <li class="list-inline-item"><code class="notranslate">neustar</code></li> <li class="list-inline-item"><code class="notranslate">newholland</code></li> <li class="list-inline-item"><code class="notranslate">nfl</code></li> <li class="list-inline-item"><code class="notranslate">nhk</code></li> <li class="list-inline-item"><code class="notranslate">nico</code></li> <li class="list-inline-item"><code class="notranslate">nike</code></li> <li class="list-inline-item"><code class="notranslate">nikon</code></li> <li class="list-inline-item"><code class="notranslate">nissan</code></li> <li class="list-inline-item"><code class="notranslate">nissay</code></li> <li class="list-inline-item"><code class="notranslate">nokia</code></li> <li class="list-inline-item"><code class="notranslate">northwesternmutual</code></li> <li class="list-inline-item"><code class="notranslate">norton</code></li> <li class="list-inline-item"><code class="notranslate">nra</code></li> <li class="list-inline-item"><code class="notranslate">ntt</code></li>
<li class="list-inline-item"><code class="notranslate">obi</code></li>
<li class="list-inline-item"><code class="notranslate">office</code></li>
<li class="list-inline-item"><code class="notranslate">omega</code></li>
<li class="list-inline-item"><code class="notranslate">oracle</code></li>
<li class="list-inline-item"><code class="notranslate">oransje</code></li>
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
<li class="list-inline-item"><code class="notranslate">spill</code></li>
<li class="list-inline-item"><code class="notranslate">playstation</code></li>
<li class="list-inline-item"><code class="notranslate">pohl</code></li>
<li class="list-inline-item"><code class="notranslate">politikk</code></li>
<li class="list-inline-item"><code class="notranslate">praxis</code></li>
<li class="list-inline-item"><code class="notranslate">prod</code></li>
<li class="list-inline-item"><code class="notranslate">progressiv</code></li>
<li class="list-inline-item"><code class="notranslate">pru</code></li>
<li class="list-inline-item"><code class="notranslate">prudential</code></li> <li class="list-inline-item"><code class="notranslate">pwc</code></li> <!--<li class="list-inline-item"><code class="notranslate">quest</code></li>--> <li class="list-inline-item"><code class="notranslate">qvc</code></li> <li class="list-inline-item"><code class="notranslate">redstone</code></li> <li class="list-inline-item"><code class="notranslate">reliance</code></li> <li class="list-inline-item"><code class="notranslate">rexroth</code></li> <li class="list-inline-item"><code class="notranslate">ricoh</code></li> <li class="list-inline-item"><code class="notranslate">garanti</code></li> <li class="list-inline-item"><code class="notranslate">rocher</code></li> <li class="list-inline-item"><code class="notranslate">rogers</code></li> <li class="list-inline-item"><code class="notranslate">rwe</code></li> <li class="list-inline-item"><code class="notranslate">sikkerhet</code></li> <li class="list-inline-item"><code class="notranslate">sakura</code></li> <li class="list-inline-item"><code class="notranslate">samsung</code></li> <li class="list-inline-item"><code class="notranslate">sandvik</code></li> <li class="list-inline-item"><code class="notranslate">sandvikcoromant</code></li> <li class="list-inline-item"><code class="notranslate">sanofi</code></li> <li class="list-inline-item"><code class="notranslate">sap</code></li> <li class="list-inline-item"><code class="notranslate">saxo</code></li> <li class="list-inline-item"><code class="notranslate">sbi</code></li> <!--<li class="list-inline-item"><code class="notranslate">sbs</code></li>--> <li class="list-inline-item"><code class="notranslate">sca</code></li> <li class="list-inline-item"><code class="notranslate">scb</code></li> <li class="list-inline-item"><code class="notranslate">Schaeffler</code></li> <li class="list-inline-item"><code class="notranslate">Schmidt</code></li> <li class="list-inline-item"><code class="notranslate">Schwarz</code></li> <li class="list-inline-item"><code class="notranslate">Schoolman</code></li> <li class="list-inline-item"><code class="notranslate">Scor</code></li> <li class="list-inline-item"><code class="notranslate">Sete</code></li> <li class="list-inline-item"><code class="notranslate">Sener</code></li> <li class="list-inline-item"><code class="notranslate">Sener</code></li> <li class="list-inline-item"><code class="notranslate">Sener</code></li> <li class="list-inline-item"><code class="notranslate">Sener</code></li> class="notranslate">sy</code></li> <li class="list-inline-item"><code class="notranslate">syv</code></li> <li class="list-inline-item"><code class="notranslate">sfr</code></li> <li class="list-inline-item"><code class="notranslate">søk</code></li> <li class="list-inline-item"><code class="notranslate">shangrila</code></li> <li class="list-inline-item"><code class="notranslate">skarp</code></li> <li class="list-inline-item"><code class="notranslate">shaw</code></li> <li class="list-inline-item"><code class="notranslate">skall</code></li> <li class="list-inline-item"><code class="notranslate">shriram</code></li>
<li class="list-inline-item"><code class="notranslate">sina</code></li> <li class="list-inline-item"><code class="notranslate">sky</code></li> <li class="list-inline-item"><code class="notranslate">skype</code></li> <li class="list-inline-item"><code class="notranslate">smart</code></li> <li class="list-inline-item"><code class="notranslate">sncf</code></li> <li class="list-inline-item"><code class="notranslate">softbank</code></li> <li class="list-inline-item"><code class="notranslate">sohu</code></li> <li class="list-inline-item"><code class="notranslate">sony</code></li> <li class="list-inline-item"><code class="notranslate">Spiegel</code></li> <li class="list-inline-item"><code class="notranslate">Stadel</code></li> <li class="list-inline-item"><code class="notranslate">Stapel</code></li> <li class="list-inline-item"><code class="notranslate">Star</code></li> <li class="list-inline-item"><code class="notranslate">Statebank</code></li> <li class="list-inline-item"><code class="notranslate">Statefarm</code></li> <li class="list-inline-item"><code class="notranslate">Statoil</code></li> <li class="list-inline-item"><code class="notranslate">stc</code></li> <li class="list-inline-item"><code class="notranslate">stcgroup</code></li> <li class="list-inline-item"><code class="notranslate">suzuki</code></li> <li class="list-inline-item"><code class="notranslate">swatch</code></li> <li class="list-inline-item"><code class="notranslate">swintcover</code></li> <li class="list-inline-item"><code class="notranslate">symantec</code></li> <li class="list-inline-item"><code class="notranslate">taobao</code></li> <li class="list-inline-item"><code class="notranslate">target</code></li> <li class="list-inline-item"><code class="notranslate">tatamotors</code></li> <li class="list-inline-item"><code class="notranslate">tdk</code></li> <li class="list-inline-item"><code class="notranslate">telecity</code></li> <li class="list-inline-item"><code class="notranslate">telefonica</code></li> <li class="list-inline-item"><code class="notranslate">temasek</code></li> <li class="list-inline-item"><code class="notranslate">teva</code></li> <li class="list-inline-item"><code class="notranslate">tiffany</code></li> <li class="list-inline-item"><code class="notranslate">tjx</code></li> <li class="list-inline-item"><code class="notranslate">Toray</code></li> <li class="list-inline-item"><code class="notranslate">Toshiba</code></li> <li class="list-inline-item"><code class="notranslate">total</code></li> <li class="list-inline-item"><code class="notranslate">Toyota</code></li> <li class="list-inline-item"><code class="notranslate">reisekanal</code></li> <li class="list-inline-item"><code class="notranslate">reisende</code></li> <li class="list-inline-item"><code class="notranslate">tui</code></li> <li class="list-inline-item"><code class="notranslate">TV-er</code></li> <li class="list-inline-item"><code class="notranslate">ubs</code></li> <li class="list-inline-item"><code class="notranslate">unicom</code></li> <li class="list-inline-item"><code class="notranslate">uol</code></li> <li class="list-inline-item"><code class="notranslate">ups</code></li> <li class="list-inline-item"><code class="notranslate">vanguard</code></li> <li class="list-inline-item"><code class="notranslate">verisign</code></li> <li class="list-inline-item"><code class="notranslate">vig</code></li> <li class="list-inline-item"><code class="notranslate">viking</code></li> <li class="list-inline-item"><code class="notranslate">jomfru</code></li>
<li class="list-inline-item"><code class="notranslate">Visa</code></li>
<li class="list-inline-item"><code class="notranslate">Vista</code></li>
<li class="list-inline-item"><code class="notranslate">Vistaprint</code></li>
<li class="list-inline-item"><code class="notranslate">Vivo</code></li>
<li class="list-inline-item"><code class="notranslate">Volvo</code></li>
<li class="list-inline-item"><code class="notranslate">Volvo</code></li>
<li class="list-inline-item"><code class="notranslate">Walmart</code></li>
<li class="list-inline-item"><code class="notranslate">Walter</code></li>
<li class="list-inline-item"><code class="notranslate">værkanal</code></li>
<li class="list-inline-item"><code class="notranslate">weber</code></li>
<li class="list-inline-item"><code class="notranslate">demningsmur</code></li>
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

Fra og med 18. mars 2025 har vi også lagt til disse franske oversjøiske territoriene på denne listen ([i henhold til denne GitHub-forespørselen](https://github.com/forwardemail/forwardemail.net/issues/327)):

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

Fra og med 8. juli 2025 har vi lagt til disse Europaspesifikke landene:

<ul class="list-inline"> <li class="list-inline-item"><code class="notranslate">ax</code></li> <li class="list-inline-item"><code class="notranslate">bg</code></li> <li class="list-inline-item"><code class="notranslate">fo</code></li> <li class="list-inline-item"><code class="notranslate">gi</code></li> <li class="list-inline-item"><code class="notranslate">gr</code></li> <li class="list-inline-item"><code class="notranslate">hr</code></li> <li class="list-inline-item"><code class="notranslate">hu</code></li> <li class="list-inline-item"><code class="notranslate">lt</code></li> <li class="list-inline-item"><code class="notranslate">lu</code></li>
<li class="list-inline-item"><code class="notranslate">mc</code></li>
<li class="list-inline-item"><code class="notranslate">mk</code></li>
<li class="list-inline-item"><code class="notranslate">mt</code></li>
<li class="list-inline-item"><code class="notranslate">ro</code></li>
<li class="list-inline-item"><code class="notranslate">sk</code></li>
<li class="list-inline-item"><code class="notranslate">va</code></li>
</ul>

Vi inkluderte spesifikt ikke `cz`, `ru` og `ua` på grunn av høy spamaktivitet.

### Hva er kriteriene for tillatelseslisten din {#what-is-your-allowlist-criteria}

Vi har en statisk liste med [domenenavnutvidelser som standard er godkjent](#what-domain-name-extensions-are-allowlisted-by-default) – og vi vedlikeholder også en dynamisk, bufret, rullerende tillatelsesliste basert på følgende strenge kriterier:

* Avsenderens rotdomene må være av typen [domenenavnutvidelse som samsvarer med listen vi tilbyr på vår gratisplan](#what-domain-name-extensions-can-be-used-for-free) (med tillegg av `biz` og `info`). Vi inkluderer også delvise treff for `edu`, `gov` og `mil`, som for eksempel `xyz.gov.au` og `xyz.edu.au`.

* Avsenderens rotdomene må være blant de 100 000 unike rotdomenene som er analysert i [Paraply popularitetsliste](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") («UPL»).

* Avsenderens rotdomene må være blant de 50 000 beste resultatene fra unike rotdomener som vises i minst 4 av de siste 7 dagene med UPL-er (\~50 %+).

* Avsenderens rotdomene må ikke være [kategorisert](https://radar.cloudflare.com/categorization-feedback/) som innhold for voksne eller skadelig programvare fra Cloudflare.

* Avsenderens rotdomene må ha enten A- eller MX-poster angitt.
* Avsenderens rotdomene må ha enten A-post(er), MX-post(er), DMARC-post med `biz`0 eller `biz`1, eller en SPF-post med kvalifikator `biz`2 eller `biz`3.

Hvis dette kriteriet er oppfylt, vil avsenderens rotdomene bli mellomlagret i 7 dager. Merk at den automatiserte jobben vår kjører daglig – derfor er dette en rullerende tillatelsesliste-mellomlagre som oppdateres daglig.

Den automatiserte jobben vår vil laste ned de siste 7 dagene med UPL-filer i minnet, pakke dem ut og deretter analysere dem i minnet i henhold til de strenge kriteriene ovenfor.

Populære domener i skrivende stund, som Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify og flere, er selvfølgelig inkludert.

Hvis du er en avsender som ikke er på tillatelseslisten vår, vil du være [begrenset pris](#do-you-have-rate-limiting) og [grålistet](#do-you-have-a-greylist) første gang FQDN-rotdomenet eller IP-adressen din sender en e-post. Merk at dette er standard praksis som er tatt i bruk som en e-poststandard. De fleste e-postserverklienter vil prøve å prøve på nytt hvis de mottar en hastighetsgrense- eller grålistefeil (f.eks. en feilstatuskode på nivå 421 eller 4xx).

**Merk at bestemte avsendere som `a@gmail.com`, `b@xyz.edu` og `c@gov.au` fortsatt kan være [avvist](#do-you-have-a-denylist)** (f.eks. hvis vi automatisk oppdager spam, phishing eller skadelig programvare fra disse avsenderne).**

### Hvilke domenenavnutvidelser kan brukes gratis {#what-domain-name-extensions-can-be-used-for-free}

Fra og med 31. mars 2023 håndhevet vi en ny generell regel for spam for å beskytte brukerne og tjenesten vår.

Denne nye regelen tillater kun bruk av følgende domenenavnutvidelser på vår gratisplan:

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">ac</code></li>
<li class="list-inline-item"><code class="notranslate">annonse</code></li>
<li class="list-inline-item"><code class="notranslate">ag</code></li>
<li class="list-inline-item"><code class="notranslate">ai</code></li>
<li class="list-inline-item"><code class="notranslate">al</code></li>
<li class="list-inline-item"><code class="notranslate">am</code></li>
<li class="list-inline-item"><code class="notranslate">app</code></li>
<li class="list-inline-item"><code class="notranslate">as</code></li>
<li class="list-inline-item"><code class="notranslate">på</code></li>
<li class="list-inline-item"><code class="notranslate">au</code></li>
<li class="list-inline-item"><code class="notranslate">ba</code></li>
<li class="list-inline-item"><code class="notranslate">være</code></li>
<li class="list-inline-item"><code class="notranslate">br</code></li>
<li class="list-inline-item"><code class="notranslate">av</code></li>
<li class="list-inline-item"><code class="notranslate">ca</code></li>
<li class="list-inline-item"><code class="notranslate">cc</code></li>
<li class="list-inline-item"><code class="notranslate">cd</code></li> <li class="list-inline-item"><code class="notranslate">ch</code></li> <li class="list-inline-item"><code class="notranslate">ck</code></li> <li class="list-inline-item"><code class="notranslate">co</code></li> <li class="list-inline-item"><code class="notranslate">com</code></li> <li class="list-inline-item"><code class="notranslate">de</code></li> <li class="list-inline-item"><code class="notranslate">dev</code></li> <li class="list-inline-item"><code class="notranslate">dj</code></li> <li class="list-inline-item"><code class="notranslate">dk</code></li> <li class="list-inline-item"><code class="notranslate">ee</code></li> <li class="list-inline-item"><code class="notranslate">es</code></li> <li class="list-inline-item"><code class="notranslate">eu</code></li> <li class="list-inline-item"><code class="notranslate">familie</code></li> <li class="list-inline-item"><code class="notranslate">fi</code></li> <li class="list-inline-item"><code class="notranslate">fm</code></li> <li class="list-inline-item"><code class="notranslate">fr</code></li> <li class="list-inline-item"><code class="notranslate">gg</code></li> <li class="list-inline-item"><code class="notranslate">gl</code></li> <li class="list-inline-item"><code class="notranslate">id</code></li> <li class="list-inline-item"><code class="notranslate">ie</code></li> <li class="list-inline-item"><code class="notranslate">il</code></li> <li class="list-inline-item"><code class="notranslate">im</code></li> <li class="list-inline-item"><code class="notranslate">in</code></li> <li class="list-inline-item"><code class="notranslate">io</code></li> <li class="list-inline-item"><code class="notranslate">ir</code></li> <li class="list-inline-item"><code class="notranslate">er</code></li> <li class="list-inline-item"><code class="notranslate">det</code></li> <li class="list-inline-item"><code class="notranslate">je</code></li> <li class="list-inline-item"><code class="notranslate">jp</code></li> <li class="list-inline-item"><code class="notranslate">ke</code></li> <li class="list-inline-item"><code class="notranslate">kr</code></li> <li class="list-inline-item"><code class="notranslate">la</code></li> <li class="list-inline-item"><code class="notranslate">li</code></li> <li class="list-inline-item"><code class="notranslate">lv</code></li> <li class="list-inline-item"><code class="notranslate">ly</code></li> <li class="list-inline-item"><code class="notranslate">md</code></li> <li class="list-inline-item"><code class="notranslate">meg</code></li> <li class="list-inline-item"><code class="notranslate">mn</code></li> <li class="list-inline-item"><code class="notranslate">ms</code></li> <li class="list-inline-item"><code class="notranslate">mu</code></li> <li class="list-inline-item"><code class="notranslate">mx</code></li> <li class="list-inline-item"><code class="notranslate">net</code></li> <li class="list-inline-item"><code class="notranslate">ni</code></li> <li class="list-inline-item"><code class="notranslate">nl</code></li>
<li class="list-inline-item"><code class="notranslate">nei</code></li>
<li class="list-inline-item"><code class="notranslate">ny</code></li>
<li class="list-inline-item"><code class="notranslate">nz</code></li>
<li class="list-inline-item"><code class="notranslate">org</code></li>
<li class="list-inline-item"><code class="notranslate">pl</code></li>
<li class="list-inline-item"><code class="notranslate">pr</code></li>
<li class="list-inline-item"><code class="notranslate">pt</code></li>
<li class="list-inline-item"><code class="notranslate">pw</code></li> <li class="list-inline-item"><code class="notranslate">rs</code></li> <li class="list-inline-item"><code class="notranslate">sc</code></li> <li class="list-inline-item"><code class="notranslate">se</code></li> <li class="list-inline-item"><code class="notranslate">sh</code></li> <li class="list-inline-item"><code class="notranslate">si</code></li> <li class="list-inline-item"><code class="notranslate">sm</code></li> <li class="list-inline-item"><code class="notranslate">sr</code></li> <li class="list-inline-item"><code class="notranslate">st</code></li> <li class="list-inline-item"><code class="notranslate">tc</code></li> <li class="list-inline-item"><code class="notranslate">tm</code></li> <li class="list-inline-item"><code class="notranslate">til</code></li> <li class="list-inline-item"><code class="notranslate">tv</code></li> <li class="list-inline-item"><code class="notranslate">uk</code></li> <li class="list-inline-item"><code class="notranslate">us</code></li> <li class="list-inline-item"><code class="notranslate">uz</code></li> <li class="list-inline-item"><code class="notranslate">vc</code></li> <li class="list-inline-item"><code class="notranslate">vg</code></li>
<li class="list-inline-item"><code class="notranslate">vu</code></li>
<li class="list-inline-item"><code class="notranslate">ws</code></li>
<li class="list-inline-item"><code class="notranslate">xyz</code></li>
<li class="list-inline-item"><code class="notranslate">za</code></li>
</ul>

### Har du en gråliste {#do-you-have-a-greylist}

Ja, vi har en svært løs [grålisting av e-post](https://en.wikipedia.org/wiki/Greylisting_\(email\))-policy. Grålisting gjelder bare for avsendere som ikke er på tillatelseslisten vår, og lagres i hurtigbufferen vår i 30 dager.

For alle nye avsendere lagrer vi en nøkkel i Redis-databasen vår i 30 dager med en verdi satt til den opprinnelige ankomsttiden for deres første forespørsel. Vi avviser deretter e-posten deres med en statuskode for nytt forsøk på 450 og lar den bare passere når det har gått 5 minutter.

Hvis de har ventet i 5 minutter fra denne opprinnelige ankomsttiden, vil e-postene deres bli akseptert, og de vil ikke motta denne 450-statuskoden.

Nøkkelen består enten av FQDN-rotdomenet eller avsenderens IP-adresse. Dette betyr at ethvert underdomene som passerer grålisten også vil passere for rotdomenet, og omvendt (dette er hva vi mener med en "svært slapp" policy).

Hvis for eksempel en e-post kommer fra `test.example.com` før vi ser en e-post komme fra `example.com`, må enhver e-post fra `test.example.com` og/eller `example.com` vente i 5 minutter fra den opprinnelige ankomsttiden for tilkoblingen. Vi lar ikke både `test.example.com` og `example.com` vente i hver sin 5-minuttersperiode (våre grålistingsregler gjelder på rotdomenenivå).

Merk at grålisting ikke gjelder for noen avsendere på vår [tillatelsesliste](#do-you-have-an-allowlist) (f.eks. Meta, Amazon, Netflix, Google, Microsoft i skrivende stund).

### Har du en avslagsliste {#do-you-have-a-denylist}

Ja, vi driver vår egen avvisningsliste og oppdaterer den automatisk i sanntid og manuelt basert på spam og ondsinnet aktivitet som oppdages.

Vi henter også alle IP-adresser fra UCEPROTECT nivå 1-avvisningslisten på <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> hver time og legger dem inn i avvisningslisten vår med en utløpsdato på 7 dager.

Avsendere som finnes i avviserlisten vil motta en 421-feilkode (indikerer at avsenderen må prøve på nytt senere) hvis de [er ikke godkjent](#do-you-have-an-allowlist).

Ved å bruke en 421-statuskode i stedet for en 554-statuskode, kan potensielle falske positiver reduseres i sanntid, og meldingen kan deretter leveres på neste forsøk.

**Dette er utformet i motsetning til andre e-posttjenester**, der det oppstår en hard og permanent feil hvis du blir satt på en blokkeringsliste. Det er ofte vanskelig å be avsendere om å prøve meldinger på nytt (spesielt fra store organisasjoner), og derfor gir denne tilnærmingen omtrent 5 dager fra det første e-postforsøket for enten avsenderen, mottakeren eller oss til å gripe inn og løse problemet (ved å be om fjerning av avslagslisten).

Alle forespørsler om fjerning fra avslagslister overvåkes i sanntid av administratorer (f.eks. slik at gjentakende falske positiver kan settes permanent på godkjenningslisten av administratorer).

Forespørsler om fjerning av avslagslister kan sendes til <https://forwardemail.net/denylist>.. Betalende brukere får sine forespørsler om fjerning av avslagslister behandlet umiddelbart, mens ikke-betalende brukere må vente på at administratorer skal behandle forespørselen.

Avsendere som oppdages å sende spam eller virusinnhold, vil bli lagt til avviserlisten på følgende måte:

1. [fingeravtrykk for første melding](#how-do-you-determine-an-email-fingerprint) blir grålistet ved oppdagelse av spam eller blokkeringsliste fra en "pålitelig" avsender (f.eks. `gmail.com`, `microsoft.com`, `apple.com`).
* Hvis avsenderen var på tillatelseslisten, blir meldingen grålistet i 1 time.
* Hvis avsenderen ikke er på tillatelseslisten, blir meldingen grålistet i 6 timer.
2. Vi analyserer avvisningslistenøkler fra informasjon fra avsenderen og meldingen, og for hver av disse nøklene oppretter vi (hvis en ikke allerede finnes) en teller, øker den med 1 og bufrer den i 24 timer.
* For avsendere på tillatelseslisten:
* Legg til en nøkkel for konvolutten "MAIL FROM"-e-postadresse hvis den hadde eller ingen SPF, og den ikke var [et brukernavn for postmesteren](#what-are-postmaster-addresses) eller [et brukernavn uten svar](#what-are-no-reply-addresses).

* Hvis «Fra»-headeren var på tillatelseslisten, legg til en nøkkel for e-postadressen i «Fra»-headeren hvis den hadde bestått SPF eller bestått og justert DKIM.
* Hvis «Fra»-headeren ikke var på tillatelseslisten, legg til en nøkkel for e-postadressen i «Fra»-headeren og dens rotparsede domenenavn.
* For avsendere som ikke er på tillatelseslisten:
* Legg til en nøkkel for konvolutten «MAIL FROM»-e-postadresse hvis den hadde bestått SPF.
* Hvis «Fra»-headeren var på tillatelseslisten, legg til en nøkkel for e-postadressen i «Fra»-headeren hvis den hadde bestått SPF eller bestått og justert DKIM.
* Hvis «Fra»-headeren ikke var på tillatelseslisten, legg til en nøkkel for e-postadressen i «Fra»-headeren og dens rotparsede domenenavn.
* Legg til en nøkkel for avsenderens eksterne IP-adresse.
* Legg til en nøkkel for klientens løste vertsnavn ved omvendt oppslag fra avsenderens IP-adresse (hvis noen).
* Legg til en nøkkel for rotdomenet til klientens løste vertsnavn (hvis noen, og hvis det er forskjellig fra klientens løste vertsnavn).
3. Hvis telleren når 5 for en avsender og nøkkel som ikke er på tillatelseslisten, avviser vi nøkkelen i 30 dager, og en e-post sendes til misbruksteamet vårt. Disse tallene kan endres, og oppdateringer vil bli vist her mens vi overvåker misbruk.

4. Hvis telleren når 10 for en avsender og nøkkel på tillatelseslisten, avviser vi nøkkelen i 7 dager, og en e-post sendes til misbruksteamet vårt. Disse tallene kan endres, og oppdateringer vil bli vist her mens vi overvåker misbruk.

> **MERK:** I nær fremtid vil vi introdusere omdømmeovervåking. Omdømmeovervåking vil i stedet beregne når en avsender skal avvises basert på en prosentgrense (i motsetning til en rudimentær teller som nevnt ovenfor).

### Har du en hastighetsbegrensning {#do-you-have-rate-limiting}

Avsenderhastighetsbegrensning skjer enten via rotdomenet som analyseres fra et omvendt PTR-oppslag på avsenderens IP-adresse – eller hvis det ikke gir et resultat, bruker den ganske enkelt avsenderens IP-adresse. Merk at vi refererer til dette som `Sender` nedenfor.

Våre MX-servere har daglige grenser for innkommende e-post mottatt for [kryptert IMAP-lagring](/blog/docs/best-quantum-safe-encrypted-email-service):

* I stedet for å begrense innkommende e-post mottatt på et individuelt alias (f.eks. `you@yourdomain.com`) – begrenser vi hastigheten etter aliaset sitt domenenavn (f.eks. `yourdomain.com`). Dette forhindrer at `Senders` oversvømmer innboksene til alle aliaser på tvers av domenet ditt samtidig.

* Vi har generelle grenser som gjelder for alle `Senders` på tvers av tjenesten vår, uavhengig av mottaker:

* `Senders` som vi anser som "pålitelige" som en sannhetskilde (f.eks. `gmail.com`, `microsoft.com`, `apple.com`) er begrenset til å sende 100 GB per dag.

* `Senders` som er [tillatelsesliste](#do-you-have-an-allowlist) er begrenset til å sende 10 GB per dag.

* Alle andre `yourdomain.com`0 er begrenset til å sende 1 GB og/eller 1000 meldinger per dag.

* Vi har en spesifikk grense per `yourdomain.com`1 og `yourdomain.com`2 på 1 GB og/eller 1000 meldinger daglig.

MX-serverne begrenser også videresending av meldinger til én eller flere mottakere gjennom hastighetsbegrensning – men dette gjelder bare for `Senders`, ikke på [tillatelsesliste](#do-you-have-an-allowlist):

* Vi tillater kun opptil 100 tilkoblinger per time, per `Sender`-løst FQDN-rotdomene (eller) `Sender` ekstern IP-adresse (hvis ingen omvendt PTR er tilgjengelig), og per konvoluttmottaker. Vi lagrer nøkkelen for hastighetsbegrensning som en kryptografisk hash i Redis-databasen vår.

* Hvis du sender e-post gjennom systemet vårt, må du sørge for at du har satt opp en omvendt PTR for alle IP-adressene dine (ellers vil hvert unike FQDN-rotdomene eller IP-adresse du sender fra være hastighetsbegrenset).

* Merk at hvis du sender via et populært system som Amazon SES, vil du ikke bli begrenset i hastighet, siden Amazon SES (i skrivende stund) er oppført på tillatelseslisten vår.

* Hvis du sender fra et domene som `test.abc.123.example.com`, vil hastighetsgrensen bli pålagt `example.com`. Mange spammere bruker hundrevis av underdomener for å omgå vanlige spamfiltre som bare hastighetsbegrenser unike vertsnavn i motsetning til unike FQDN-rotdomener.

* `Senders` som overskrider hastighetsgrensen vil bli avvist med en 421-feil.

Våre IMAP- og SMTP-servere begrenser aliasene dine fra å ha mer enn `60` samtidige tilkoblinger samtidig.

MX-serverne våre begrenser [ikke på tillatelseslisten](#do-you-have-an-allowlist)-sendere fra å opprette mer enn 10 samtidige tilkoblinger (med en cache-utløpstid på 3 minutter for telleren, som gjenspeiler vår socket-timeout på 3 minutter).

### Hvordan beskytter du mot tilbakespredning {#how-do-you-protect-against-backscatter}

Feildirigerte returer eller returspam (kjent som «[Tilbakespredning](https://en.wikipedia.org/wiki/Backscatter_\(email\)») kan gi avsenderens IP-adresser et negativt rykte.

Vi tar to trinn for å beskytte mot tilbakespredning, som er beskrevet i de følgende avsnittene [Forhindre returer fra kjente E-POSTFRA-spammere](#prevent-bounces-from-known-mail-from-spammers) og [Forhindre unødvendige sprett for å beskytte mot tilbakespredning](#prevent-unnecessary-bounces-to-protect-against-backscatter) nedenfor.

### Forhindre avvisninger fra kjente E-POSTFRA-spammere {#prevent-bounces-from-known-mail-from-spammers}

Vi henter listen fra [Backscatter.org](https://www.backscatterer.org/) (drevet av [UCEPROTECT](https://www.uceprotect.net/)) på <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> hver time og mater den inn i Redis-databasen vår (vi sammenligner også differansen på forhånd; i tilfelle IP-adresser ble fjernet som må respekteres).

Hvis MAIL FROM er tom ELLER er lik (ikke-skillende mellom store og små bokstaver) en av [postmesteradresser](#what-are-postmaster-addresses) (delen før @-tegnet i en e-post), sjekker vi om avsender-IP-adressen samsvarer med en fra denne listen.

Hvis avsenderens IP-adresse er oppført (og ikke i vår [tillatelsesliste](#do-you-have-an-allowlist)), sender vi en 554-feil med meldingen `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`. Vi vil bli varslet hvis en avsender er på både Backscatterer-listen og i vår tillatelsesliste, slik at vi kan løse problemet om nødvendig.

Teknikkene som er beskrevet i denne delen følger anbefalingen «SIKKER MODUS» på <https://www.backscatterer.org/?target=usage> – der vi bare sjekker avsender-IP-adressen hvis visse betingelser allerede er oppfylt.

### Forhindre unødvendige sprett for å beskytte mot tilbakespredning {#prevent-unnecessary-bounces-to-protect-against-backscatter}

Avviste e-poster er e-poster som indikerer at videresending av e-post til mottakeren mislyktes fullstendig, og at e-posten ikke vil bli forsøkt på nytt.

En vanlig årsak til å bli oppført på Backscatterer-listen er feiladresserte returer eller spam, så vi må beskytte oss mot dette på noen måter:

1. Vi sender bare når det oppstår >= 500 statuskodefeil (når e-poster som ble forsøkt videresendt har mislyktes, f.eks. Gmail svarer med en feil på nivå 500).

2. Vi sender bare én gang (vi bruker en beregnet nøkkel for avvisningsfingeravtrykk og lagrer den i hurtigbufferen for å forhindre sending av duplikater). Avvisningsfingeravtrykket er en nøkkel som er meldingens fingeravtrykk kombinert med en hash av avvisningsadressen og feilkoden). Se avsnittet om [Fingeravtrykk](#how-do-you-determine-an-email-fingerprint) for mer innsikt i hvordan meldingsfingeravtrykket beregnes. Vellykket sendte avvisningsfingeravtrykk utløper etter 7 dager i Redis-hurtigbufferen vår.

3. Vi sender bare når MAIL FROM og/eller From ikke er blanke og ikke inneholder (ikke store og små bokstaver) en [postmaster brukernavn](#what-are-postmaster-addresses) (delen før @-tegnet i en e-post).

4. Vi sender ikke hvis den opprinnelige meldingen hadde noen av følgende overskrifter (ikke store og små bokstaver):

* Overskrift for `auto-submitted` med en verdi som ikke er lik `no`.
* Overskrift for `x-auto-response-suppress` med en verdi på `dr`, `autoreply`, `auto-reply`, `auto_reply` eller `all`.
* Overskrift for `list-id`, `list-subscribe`, `no`0, `no`1, `no`2, `no`3, `no`4, `no`5, `no`6 eller `no`7 (uavhengig av verdi).
* Overskrift for `no`8 med verdien `no`9, `x-auto-response-suppress`0, `x-auto-response-suppress`1, `x-auto-response-suppress`2 eller `x-auto-response-suppress`3.

5. Vi sender ikke hvis e-postadressen MAIL FROM eller Fra slutter med `+donotreply`, `-donotreply`, `+noreply` eller `-noreply`.

6. Vi sender ikke hvis delen for brukernavn i e-postadressen «Fra» var `mdaemon` og den hadde en overskrift som ikke skiller mellom store og små bokstaver, `X-MDDSN-Message`.

7. Vi sender ikke hvis det var en `content-type`-header for `multipart/report` som ikke skiller mellom store og små bokstaver.

### Hvordan bestemmer du et e-postfingeravtrykk {#how-do-you-determine-an-email-fingerprint}

Et fingeravtrykk av en e-post brukes til å bestemme hvor unik en e-post er og for å forhindre at dupliserte meldinger leveres og at [dupliserte avvisninger](#prevent-unnecessary-bounces-to-protect-against-backscatter) sendes.

Fingeravtrykket beregnes fra følgende liste:

* Klientens FQDN-oppløste vertsnavn eller IP-adresse
* `Message-ID`-overskriftsverdi (hvis noen)
* `Date`-overskriftsverdi (hvis noen)
* `From`-overskriftsverdi (hvis noen)
* `To`-overskriftsverdi (hvis noen)
* `Cc`-overskriftsverdi (hvis noen)
* `Subject`-overskriftsverdi (hvis noen)
* `Body`-verdi (hvis noen)

### Kan jeg videresende e-poster til andre porter enn 25 (f.eks. hvis internettleverandøren min har blokkert port 25) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Ja, fra og med 5. mai 2020 har vi lagt til denne funksjonen. Akkurat nå er funksjonen domenespesifikk, i motsetning til aliasspesifikk. Hvis du ønsker at den skal være aliasspesifikk, kan du kontakte oss for å gi oss beskjed om dine behov.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Forbedret personvern:
</strong>
<span>
Hvis du har et betalt abonnement (som har forbedret personvern), kan du gå til <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domener</a>, klikke på "Oppsett" ved siden av domenet ditt, og deretter klikke på "Innstillinger". Hvis du vil vite mer om betalte abonnementer, kan du se vår <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Prissettingsside</a>. Ellers kan du fortsette å følge instruksjonene nedenfor.
</span>
</div>

Hvis du har gratisabonnementet, legger du bare til en ny DNS-<strong class="notranslate">TXT</strong>-oppføring som vist nedenfor, men endrer porten fra 25 til den porten du ønsker.

Hvis jeg for eksempel vil at alle e-poster som går til `example.com` skal videresendes til aliasmottakernes SMTP-port 1337 i stedet for 25:

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vert/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Verdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email-port=1337</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
Det vanligste scenariet for oppsett av tilpasset portvideresending er når du vil videresende alle e-poster som går til example.com til en annen port på example.com, enn SMTP-standarden på port 25. For å sette opp dette, legger du ganske enkelt til følgende <strong class="notranslate">TXT</strong> catch-all-post.
<span>
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vert/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Verdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=example.com</code></td> </tr> </tbody>
</table>

### Støtter den plusstegnet + for Gmail-aliaser {#does-it-support-the-plus--symbol-for-gmail-aliases}}

Ja, absolutt.

### Støtter den underdomener {#does-it-support-sub-domains}

Ja, absolutt. I stedet for å bruke "@", ".", eller blankt som navn/vert/alias, bruker du bare underdomenenavnet som verdi i stedet.

Hvis du vil at `foo.example.com` skal videresende e-poster, skriver du inn `foo` som navn/vert/alias-verdi i DNS-innstillingene dine (for både MX- og <strong class="notranslate">TXT</strong>-oppføringer).

### Videresender dette e-postoverskriftene mine {#does-this-forward-my-emails-headers}

Ja, absolutt.

### Er dette godt testet {#is-this-well-tested}

Ja, den har tester skrevet med [ava](https://github.com/avajs/ava) og har også kodedekning.

### Sender du videre SMTP-svarmeldinger og -koder? {#do-you-pass-along-smtp-response-messages-and-codes}

Ja, absolutt. Hvis du for eksempel sender en e-post til `hello@example.com` og den er registrert for videresending til `user@gmail.com`, vil SMTP-svarmeldingen og koden fra SMTP-serveren «gmail.com» bli returnert i stedet for proxy-serveren på «mx1.forwardemail.net» eller «mx2.forwardemail.net».

### Hvordan forhindrer du spammere og sikrer et godt rykte for videresending av e-post {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Se avsnittene våre om [Hvordan fungerer systemet deres for videresending av e-post](#how-does-your-email-forwarding-system-work), [Hvordan håndterer du problemer med e-postlevering](#how-do-you-handle-email-delivery-issues) og [Hvordan håndterer du at IP-adressene dine blir blokkert](#how-do-you-handle-your-ip-addresses-becoming-blocked) ovenfor.

### Hvordan utfører du DNS-oppslag på domenenavn {#how-do-you-perform-dns-lookups-on-domain-names}

Vi opprettet et åpen kildekode-programvareprosjekt :tangerine: [Mandarin](https://github.com/forwardemail/tangerine) og bruker det til DNS-oppslag. Standard DNS-serverne som brukes er `1.1.1.1` og `1.0.0.1`, og DNS-spørringer går via [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") på applikasjonslaget.

:tangerine: [Mandarin](https://github.com/tangerine) bruker [CloudFlares personvern-første forbruker-DNS-tjeneste som standard][cloudflare-dns].

## Konto og fakturering {#account-and-billing}

### Tilbyr dere pengene-tilbake-garanti på betalte abonnementer? {#do-you-offer-a-money-back-guarantee-on-paid-plans}

Ja! Automatiske refusjoner skjer når du oppgraderer, nedgraderer eller kansellerer kontoen din innen 30 dager fra da planen din startet. Dette gjelder kun for førstegangskunder.

### Hvis jeg bytter plan, vil dere da forholdsmessig betale differansen og refundere den? {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

Vi verken forholdsmessig beregner eller refunderer differansen når du bytter abonnement. I stedet konverterer vi den gjenværende varigheten fra utløpsdatoen til ditt eksisterende abonnement til den nærmeste relative varigheten for ditt nye abonnement (avrundet nedover etter måned).

Merk at hvis du oppgraderer eller nedgraderer mellom betalte abonnementer innen et 30-dagers vindu etter at du startet et betalt abonnement, refunderer vi automatisk hele beløpet fra ditt eksisterende abonnement.

### Kan jeg bare bruke denne e-postvideresendingstjenesten som en "fallback" eller "fallover" MX-server {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

Nei, det anbefales ikke, siden du bare kan bruke én e-postutvekslingsserver om gangen. Reserver blir vanligvis aldri prøvd på nytt på grunn av feilkonfigurasjoner av prioritet og e-postservere som ikke respekterer MX-utvekslingsprioritetskontroll.

### Kan jeg deaktivere spesifikke aliaser {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktig:
</strong>
<span>
Hvis du har et betalt abonnement, må du gå til <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Aliaser <i class="fa fa-angle-right"></i> Rediger alias <i class="fa fa-angle-right"></i> Fjern merket for "Aktiv" <i class="fa fa-angle-right"></i> Fortsett.
</span>
</div>

Ja, bare rediger DNS-<strong class="notranslate">TXT</strong>-oppføringen din og legg enten ett, to eller tre utropstegn foran aliaset (se nedenfor).

Merk at du *bør* beholde ":"-tilordningen, da dette er nødvendig hvis du bestemmer deg for å slå dette av (og det brukes også til import hvis du oppgraderer til et av våre betalte abonnementer).

**For stille avvisning (ser ut for avsenderen som om meldingen ble sendt, men går egentlig ingen vei) (statuskode `250`):** Hvis du setter prefikset "!" (enkelt utropstegn) foran et alias, vil det returnere en vellykket statuskode på `250` til avsendere som prøver å sende til denne adressen, men selve e-postene vil ingen vei (f.eks. et svart hull eller `/dev/null`).

**For myk avvisning (statuskode `421`):** Hvis du setter prefikset "!!" (dobbelt utropstegn) foran et alias, vil det returnere en myk feilstatuskode på `421` til avsendere som prøver å sende til denne adressen, og e-postene vil ofte bli forsøkt på nytt i opptil 5 dager før avvisning og retur.

**For fullstendig avvisning (statuskode `550`):** Hvis du setter prefikset "!!!" (trippelt utropstegn) til et alias, vil det returnere en permanent feilstatuskode på `550` til avsendere som prøver å sende til denne adressen, og e-postene vil bli avvist og returneres.

Hvis jeg for eksempel vil at alle e-poster som går til `alias@example.com` skal slutte å flyte gjennom til `user@gmail.com` og bli avvist og returnert (f.eks. bruk tre utropstegn):

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vert/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Verdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>videresendings-e-post=!!!alias:bruker@gmail.com</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>
Du kan også omskrive adressen til den videresendte mottakeren til ganske enkelt "nobody@forwardemail.net", som vil rute den til nobody som i eksemplet nedenfor.
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vert/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Verdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>videresendings-e-post=!!!alias:nobody@forwardemail.net</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>
Hvis du ønsker økt sikkerhet, kan du også fjerne delen ":user@gmail.com" (eller ":nobody@forwardemail.net"), slik at bare "!!!alias" står igjen, som i eksemplet nedenfor.
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vert/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Verdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>videresendings-e-post=!!!alias</code></td> </tr> </tbody>
</table>

### Kan jeg videresende e-poster til flere mottakere {#can-i-forward-emails-to-multiple-recipients}

Ja, absolutt. Bare angi flere mottakere i <strong class="notranslate">TXT</strong>-oppføringene dine.

Hvis jeg for eksempel vil at en e-post som går til `hello@example.com` skal videresendes til `user+a@gmail.com` og `user+b@gmail.com`, vil <strong class="notranslate">TXT</strong>-oppføringen min se slik ut:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr> <th>Navn/Vert/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Verdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
</tr> </tbody>
</table>

Eller du kan spesifisere dem i to separate linjer, slik som dette:

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vert/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Verdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=hello:user+a@gmail.com</code></td> </tr> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>videresend-e-post=hello:bruker+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Det er opp til deg!

### Kan jeg ha flere globale mottakere med alle rettigheter {#can-i-have-multiple-global-catch-all-recipients}

Ja, det kan du. Bare angi flere globale mottakere i <strong class="notranslate">TXT</strong>-oppføringene dine.

Hvis jeg for eksempel vil at alle e-poster som går til `*@example.com` (stjernen betyr at det er et jokertegn, også kjent som «catch-all») skal videresendes til `user+a@gmail.com` og `user+b@gmail.com`, vil <strong class="notranslate">TXT</strong>-oppføringen min se slik ut:

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vert/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Verdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=bruker+a@gmail.com,bruker+b@gmail.com</code></td> </tr> </tbody>
</table>

Eller du kan spesifisere dem i to separate linjer, slik som dette:

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vert/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Verdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=user+a@gmail.com</code></td> </tr> <tr> <td><em>@, ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>videresendings-epost=bruker+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Det er opp til deg!

### Er det en maksimal grense for antall e-postadresser jeg kan videresende til per alias {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

Ja, standardgrensen er 10. Dette betyr IKKE at du bare kan ha 10 aliaser på domenenavnet ditt. Du kan ha så mange aliaser du vil (et ubegrenset antall). Det betyr at du bare kan videresende ett alias til 10 unike e-postadresser. Du kan ha `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (fra 1–10) – og alle e-poster til `hello@example.com` vil bli videresendt til `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (fra 1–10).

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>
Trenger du mer enn 10 mottakere per alias? Send oss en e-post, så øker vi gjerne kontogrensen din.
</span>
</div>

### Kan jeg videresende e-poster rekursivt {#can-i-recursively-forward-emails}

Ja, det kan du, men du må fortsatt overholde maksimumsgrensen. Hvis du har `hello:linus@example.com` og `linus:user@gmail.com`, vil e-poster til `hello@example.com` bli videresendt til `linus@example.com` og `user@gmail.com`. Merk at det vil oppstå en feilmelding hvis du prøver å videresende e-poster rekursivt utover maksimumsgrensen.

### Kan folk avregistrere eller registrere videresending av e-post uten min tillatelse {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

Vi bruker MX- og <strong class="notranslate">TXT</strong>-postverifisering, så hvis du legger til denne tjenestens respektive MX- og <strong class="notranslate">TXT</strong>-poster, er du registrert. Hvis du fjerner dem, er du avregistrert. Du eier domenet ditt og DNS-administrasjon, så hvis noen har tilgang til det, er det et problem.

### Hvordan er det gratis {#how-is-it-free}

Forward Email tilbyr et gratis nivå gjennom en kombinasjon av åpen kildekode-utvikling, effektiv infrastruktur og valgfrie betalte planer som støtter tjenesten.

Vårt gratisnivå støttes av:

1. **Utvikling med åpen kildekode**: Kodebasen vår er åpen kildekode, noe som tillater bidrag fra fellesskapet og transparent drift.

2. **Effektiv infrastruktur**: Vi har optimalisert systemene våre for å håndtere videresending av e-post med minimale ressurser.

3. **Betalte premiumabonnementer**: Brukere som trenger tilleggsfunksjoner som SMTP-sending, IMAP-mottak eller forbedrede personvernalternativer, abonnerer på våre betalte abonnementer.

4. **Rimelige bruksgrenser**: Gratisnivået har retningslinjer for rimelig bruk for å forhindre misbruk.

> \[!NOTE]
> Vi er forpliktet til å holde grunnleggende videresending av e-post gratis, samtidig som vi tilbyr premiumfunksjoner for brukere med mer avanserte behov.

> \[!TIP]
> Hvis du synes tjenesten vår er verdifull, bør du vurdere å oppgradere til en betalt plan for å støtte kontinuerlig utvikling og vedlikehold.

### Hva er den maksimale størrelsesgrensen for e-poster {#what-is-the-max-email-size-limit}

Vi har en standardstørrelsesgrense på 50 MB, som inkluderer innhold, overskrifter og vedlegg. Merk at tjenester som Gmail og Outlook kun tillater en størrelsesgrense på 25 MB, og hvis du overskrider grensen når du sender til adresser hos disse leverandørene, vil du motta en feilmelding.

En feil med riktig svarkode returneres hvis filstørrelsesgrensen overskrides.

### Lagrer dere logger av e-poster? {#do-you-store-logs-of-emails}

Nei, vi skriver ikke til disk eller lagrer logger – med [unntak av feil](#do-you-store-error-logs) og [utgående SMTP](#do-you-support-sending-email-with-smtp) (se vår [Personvernerklæring](/privacy)).

Alt gjøres i minnet og [kildekoden vår er på GitHub](https://github.com/forwardemail).

### Lagrer dere feillogger? {#do-you-store-error-logs}

**Ja. Du kan få tilgang til feillogger under [Min konto → Logger](/my-account/logs) eller [Min konto → Domener](/my-account/domains).**

Fra og med februar 2023 lagrer vi feillogger for SMTP-svarkodene `4xx` og `5xx` i en periode på 7 dager – disse inneholder SMTP-feilen, konvolutten og e-postoverskriftene (vi **lagrer** ikke e-postens brødtekst eller vedlegg).

Feillogger lar deg sjekke om viktige e-poster mangler og redusere falske positiver for spam for [domenene dine](/my-account/domains). De er også en god ressurs for feilsøking av problemer med [e-post webhooks](#do-you-support-webhooks) (siden feilloggene inneholder webhook-sluttpunktsvaret).

Feillogger for [hastighetsbegrensning](#do-you-have-rate-limiting) og [grålisting](#do-you-have-a-greylist) er ikke tilgjengelige siden tilkoblingen avsluttes tidlig (f.eks. før kommandoene `RCPT TO` og `MAIL FROM` kan overføres).

Se vår [Personvernerklæring](/privacy) for mer innsikt.

### Leser du e-postene mine {#do-you-read-my-emails}

Nei, absolutt ikke. Se vår [Personvernerklæring](/privacy).

Mange andre tjenester for videresending av e-post lagrer og kan potensielt lese e-posten din. Det er ingen grunn til at videresendte e-poster må lagres på disklagring – og derfor har vi utviklet den første åpen kildekode-løsningen som gjør alt dette i minnet.

Vi mener at du har rett til personvern, og vi respekterer det strengt. Koden som distribueres til serveren er [åpen kildekode-programvare på GitHub](https://github.com/forwardemail) for åpenhet og for å bygge tillit.

### Kan jeg «sende e-post som» i Gmail med denne {#can-i-send-mail-as-in-gmail-with-this}

Ja! Fra og med 2. oktober 2018 har vi lagt til denne funksjonen. Se [Slik sender du e-post som ved hjelp av Gmail](#how-to-send-mail-as-using-gmail) ovenfor!

Du bør også angi SPF-posten for Gmail i DNS-konfigurasjons-<strong class="notranslate">TXT</strong>-posten din.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktig:
</strong>
<span>
Hvis du bruker Gmail (f.eks. Send e-post som) eller G Suite, må du legge til <code>include:_spf.google.com</code> i SPF <strong class="notranslate">TXT</strong>-oppføringen din, for eksempel:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

### Kan jeg «sende e-post som» i Outlook med denne {#can-i-send-mail-as-in-outlook-with-this}

Ja! Fra og med 2. oktober 2018 har vi lagt til denne funksjonen. Bare se disse to lenkene fra Microsoft nedenfor:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

Du bør også angi SPF-posten for Outlook i DNS-konfigurasjons-<strong class="notranslate">TXT</strong>-posten din.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktig:
</strong>
<span>
Hvis du bruker Microsoft Outlook eller Live.com, må du legge til <code>include:spf.protection.outlook.com</code> i SPF <strong class="notranslate">TXT</strong>-oppføringen din, for eksempel:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
</span>
</div>

### Kan jeg «sende e-post som» i Apple Mail og iCloud Mail med denne {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

Hvis du abonnerer på iCloud+, kan du bruke et egendefinert domene. [Tjenesten vår er også kompatibel med Apple Mail](#apple-mail).

Se <https://support.apple.com/en-us/102540> for mer informasjon.

### Kan jeg videresende et ubegrenset antall e-poster med denne {#can-i-forward-unlimited-emails-with-this}

Ja, men «relativt ukjente» avsendere er begrenset til 100 tilkoblinger per time per vertsnavn eller IP-adresse. Se avsnittet om [Hastighetsbegrensning](#do-you-have-rate-limiting) og [Grålisting](#do-you-have-a-greylist) ovenfor.

Med «relativt ukjent» mener vi avsendere som ikke vises i [tillatelsesliste](#do-you-have-an-allowlist).

Hvis denne grensen overskrides, sender vi en 421-svarkode som ber avsenderens e-postserver om å prøve på nytt senere.

### Tilbyr dere et ubegrenset antall domener til én pris? {#do-you-offer-unlimited-domains-for-one-price}

Ja. Uansett hvilket abonnement du har, betaler du bare én månedlig pris – som dekker alle domenene dine.

### Hvilke betalingsmåter godtar dere? {#which-payment-methods-do-you-accept}

Videresendt e-post godtar følgende engangs- eller månedlige/kvartalsvise/årlige betalingsmetoder:

1. **Kreditt-/debetkort/bankoverføringer**: Visa, Mastercard, American Express, Discover, JCB, Diners Club, osv.

2. **PayPal**: Koble til PayPal-kontoen din for enkle betalinger

3. **Kryptovaluta**: Vi godtar betalinger via Stripes stablecoin-betalinger på Ethereum-, Polygon- og Solana-nettverkene

> \[!NOTE]
> Vi lagrer begrenset betalingsinformasjon på serverne våre, som kun inkluderer betalingsidentifikatorer og referanser til transaksjons-, kunde-, abonnements- og betalings-ID-er for [Stripe](https://stripe.com/global) og [PayPal](https://www.paypal.com).

> \[!TIP]
> For maksimal personvern bør du vurdere å bruke kryptovalutabetalinger.

Alle betalinger behandles sikkert via Stripe eller PayPal. Betalingsinformasjonen din lagres aldri på serverne våre.

## Ytterligere ressurser {#additional-resources}

> \[!TIP]
> Artiklene våre nedenfor oppdateres jevnlig med nye veiledninger, tips og teknisk informasjon. Kom ofte tilbake for det nyeste innholdet.

* [Casestudier og utviklerdokumentasjon](/blog/docs)
* [Ressurser](/resources)
* [Guider](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/