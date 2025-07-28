# Veelgestelde vragen {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="" class="rounded-lg" />

## Inhoudsopgave {#table-of-contents}

* [Snelle start](#quick-start)
* [Invoering](#introduction)
  * [Wat is doorsturen van e-mail?](#what-is-forward-email)
  * [Wie gebruikt Forward Email?](#who-uses-forward-email)
  * [Wat is de geschiedenis van Forward Email?](#what-is-forward-emails-history)
  * [Hoe snel is deze service?](#how-fast-is-this-service)
* [E-mailclients](#email-clients)
  * [Dondervogel](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [Mobiele apparaten](#mobile-devices)
  * [Hoe u e-mail kunt verzenden met Gmail](#how-to-send-mail-as-using-gmail)
  * [Wat is de gratis handleiding voor het verzenden van e-mails via Gmail?](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Geavanceerde Gmail-routeringsconfiguratie](#advanced-gmail-routing-configuration)
  * [Geavanceerde Outlook-routeringsconfiguratie](#advanced-outlook-routing-configuration)
* [Probleemoplossing](#troubleshooting)
  * [Waarom ontvang ik mijn test-e-mails niet?](#why-am-i-not-receiving-my-test-emails)
  * [Hoe configureer ik mijn e-mailclient om met Forward Email te werken?](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Waarom komen mijn e-mails in de spam- en ongewenste e-mailberichten terecht en hoe kan ik de reputatie van mijn domein controleren?](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [Wat moet ik doen als ik spam-e-mails ontvang?](#what-should-i-do-if-i-receive-spam-emails)
  * [Waarom worden mijn test-e-mails die naar mij zijn verzonden in Gmail weergegeven als 'verdacht'?](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Kan ik het via forwardemail punt net in Gmail verwijderen?](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Gegevensbeheer](#data-management)
  * [Waar bevinden uw servers zich?](#where-are-your-servers-located)
  * [Hoe exporteer en maak ik een back-up van mijn mailbox?](#how-do-i-export-and-backup-my-mailbox)
  * [Hoe importeer en migreer ik mijn bestaande mailbox?](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Ondersteunt u zelfhosting?](#do-you-support-self-hosting)
* [E-mailconfiguratie](#email-configuration)
  * [Hoe begin ik en stel ik e-maildoorsturen in?](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Kan ik meerdere MX-uitwisselingen en servers gebruiken voor geavanceerde doorsturing?](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Hoe stel ik een automatisch antwoordapparaat voor afwezigheid in?](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Hoe stel ik SPF in voor het doorsturen van e-mail?](#how-do-i-set-up-spf-for-forward-email)
  * [Hoe stel ik DKIM in voor het doorsturen van e-mail?](#how-do-i-set-up-dkim-for-forward-email)
  * [Hoe stel ik DMARC in voor het doorsturen van e-mail?](#how-do-i-set-up-dmarc-for-forward-email)
  * [Hoe maak ik verbinding met mijn contacten en hoe configureer ik ze?](#how-do-i-connect-and-configure-my-contacts)
  * [Hoe maak ik verbinding met mijn agenda's en hoe configureer ik ze?](#how-do-i-connect-and-configure-my-calendars)
  * [Hoe voeg ik meer agenda's toe en beheer ik bestaande agenda's?](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Hoe stel ik SRS in voor het doorsturen van e-mail?](#how-do-i-set-up-srs-for-forward-email)
  * [Hoe stel ik MTA-STS in voor het doorsturen van e-mail?](#how-do-i-set-up-mta-sts-for-forward-email)
  * [Hoe voeg ik een profielfoto toe aan mijn e-mailadres?](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Geavanceerde functies](#advanced-features)
  * [Ondersteunt u nieuwsbrieven of mailinglijsten voor marketinggerelateerde e-mails?](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Ondersteunt u het verzenden van e-mail met API?](#do-you-support-sending-email-with-api)
  * [Ondersteunt u het ontvangen van e-mail met IMAP?](#do-you-support-receiving-email-with-imap)
  * [Ondersteunt u POP3?](#do-you-support-pop3)
  * [Ondersteunt u kalenders (CalDAV)?](#do-you-support-calendars-caldav)
  * [Ondersteunt u contacten (CardDAV)?](#do-you-support-contacts-carddav)
  * [Ondersteunt u het verzenden van e-mail met SMTP?](#do-you-support-sending-email-with-smtp)
  * [Ondersteunt u OpenPGP/MIME, end-to-end-encryptie ("E2EE") en Web Key Directory ("WKD")?](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Ondersteunt u MTA-STS?](#do-you-support-mta-sts)
  * [Ondersteunt u wachtwoorden en WebAuthn?](#do-you-support-passkeys-and-webauthn)
  * [Ondersteunt u best practices voor e-mail?](#do-you-support-email-best-practices)
  * [Ondersteunt u bounce webhooks?](#do-you-support-bounce-webhooks)
  * [Ondersteunt u webhooks?](#do-you-support-webhooks)
  * [Ondersteunt u reguliere expressies of regex?](#do-you-support-regular-expressions-or-regex)
  * [Wat zijn uw uitgaande SMTP-limieten?](#what-are-your-outbound-smtp-limits)
  * [Heb ik goedkeuring nodig om SMTP in te schakelen?](#do-i-need-approval-to-enable-smtp)
  * [Wat zijn uw SMTP-serverconfiguratie-instellingen?](#what-are-your-smtp-server-configuration-settings)
  * [Wat zijn uw IMAP-serverconfiguratie-instellingen?](#what-are-your-imap-server-configuration-settings)
  * [Wat zijn uw POP3-serverconfiguratie-instellingen?](#what-are-your-pop3-server-configuration-settings)
  * [Postfix SMTP-relayconfiguratie](#postfix-smtp-relay-configuration)
* [Beveiliging](#security)
  * [Geavanceerde serververhardingstechnieken](#advanced-server-hardening-techniques)
  * [Heeft u SOC 2- of ISO 27001-certificeringen?](#do-you-have-soc-2-or-iso-27001-certifications)
  * [Gebruikt u TLS-encryptie voor het doorsturen van e-mails?](#do-you-use-tls-encryption-for-email-forwarding)
  * [Behoudt u e-mailauthenticatieheaders?](#do-you-preserve-email-authentication-headers)
  * [Behoudt u de originele e-mailheaders en voorkomt u spoofing?](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Hoe beschermt u zich tegen spam en misbruik?](#how-do-you-protect-against-spam-and-abuse)
  * [Slaat u e-mailinhoud op schijf op?](#do-you-store-email-content-on-disk)
  * [Kan de inhoud van e-mails worden blootgesteld tijdens systeemcrashes?](#can-email-content-be-exposed-during-system-crashes)
  * [Wie heeft toegang tot uw e-mailinfrastructuur?](#who-has-access-to-your-email-infrastructure)
  * [Welke infrastructuurproviders gebruikt u?](#what-infrastructure-providers-do-you-use)
  * [Biedt u een gegevensverwerkingsovereenkomst (DPA) aan?](#do-you-offer-a-data-processing-agreement-dpa)
  * [Hoe gaat u om met meldingen van datalekken?](#how-do-you-handle-data-breach-notifications)
  * [Biedt u een testomgeving aan?](#do-you-offer-a-test-environment)
  * [Biedt u monitoring- en waarschuwingshulpmiddelen?](#do-you-provide-monitoring-and-alerting-tools)
  * [Hoe zorgt u voor een hoge beschikbaarheid?](#how-do-you-ensure-high-availability)
  * [Voldoet u aan artikel 889 van de National Defense Authorization Act (NDAA)?](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [Systeem- en technische details](#system-and-technical-details)
  * [Slaat u e-mails en hun inhoud op?](#do-you-store-emails-and-their-contents)
  * [Hoe werkt uw e-mail doorstuursysteem?](#how-does-your-email-forwarding-system-work)
  * [Hoe verwerk je een e-mail voor doorsturen?](#how-do-you-process-an-email-for-forwarding)
  * [Hoe gaat u om met problemen met e-mailbezorging?](#how-do-you-handle-email-delivery-issues)
  * [Hoe ga je om met het blokkeren van je IP-adressen?](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [Wat zijn postmasteradressen?](#what-are-postmaster-addresses)
  * [Wat zijn no-reply-adressen?](#what-are-no-reply-addresses)
  * [Wat zijn de IP-adressen van uw server?](#what-are-your-servers-ip-addresses)
  * [Heb je een lijst met toegestane personen?](#do-you-have-an-allowlist)
  * [Welke domeinnaamextensies staan standaard op de toegestane lijst?](#what-domain-name-extensions-are-allowlisted-by-default)
  * [Wat zijn uw criteria voor de toegestane lijst?](#what-is-your-allowlist-criteria)
  * [Welke domeinnaamextensies kunnen gratis worden gebruikt?](#what-domain-name-extensions-can-be-used-for-free)
  * [Heeft u een grijze lijst?](#do-you-have-a-greylist)
  * [Heb je een weigeringslijst?](#do-you-have-a-denylist)
  * [Heeft u snelheidsbeperking?](#do-you-have-rate-limiting)
  * [Hoe bescherm je je tegen backscatter?](#how-do-you-protect-against-backscatter)
  * [Voorkom bounces van bekende MAIL FROM-spammers](#prevent-bounces-from-known-mail-from-spammers)
  * [Voorkom onnodige stuiters om te beschermen tegen backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Hoe bepaal je een e-mailvingerafdruk?](#how-do-you-determine-an-email-fingerprint)
  * [Kan ik e-mails doorsturen naar andere poorten dan 25 (bijvoorbeeld als mijn internetprovider poort 25 heeft geblokkeerd)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Ondersteunt het het plus-+ symbool voor Gmail-aliassen?](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Ondersteunt het subdomeinen?](#does-it-support-sub-domains)
  * [Stuurt dit de headers van mijn e-mail door?](#does-this-forward-my-emails-headers)
  * [Is dit goed getest?](#is-this-well-tested)
  * [Geeft u SMTP-antwoordberichten en -codes door?](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Hoe voorkomt u spammers en zorgt u voor een goede reputatie bij het doorsturen van e-mails?](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Hoe voer je DNS-lookups uit op domeinnamen?](#how-do-you-perform-dns-lookups-on-domain-names)
* [Account en facturering](#account-and-billing)
  * [Biedt u een geld-terug-garantie op betaalde abonnementen?](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Als ik van abonnement verander, wordt het verschil dan naar rato berekend en terugbetaald?](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Kan ik deze e-mail doorstuurservice gewoon gebruiken als een 'fallback'- of 'fallover'-MX-server?](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Kan ik specifieke aliassen uitschakelen?](#can-i-disable-specific-aliases)
  * [Kan ik e-mails doorsturen naar meerdere ontvangers?](#can-i-forward-emails-to-multiple-recipients)
  * [Kan ik meerdere wereldwijde catch-all-ontvangers hebben?](#can-i-have-multiple-global-catch-all-recipients)
  * [Bestaat er een maximumlimiet voor het aantal e-mailadressen waarnaar ik per alias kan doorsturen?](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Kan ik e-mails recursief doorsturen?](#can-i-recursively-forward-emails)
  * [Kunnen mensen mijn e-maildoorsturing registreren of afmelden zonder mijn toestemming?](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Hoe is het gratis?](#how-is-it-free)
  * [Wat is de maximale limiet voor e-mailgrootte?](#what-is-the-max-email-size-limit)
  * [Slaat u logs van e-mails op?](#do-you-store-logs-of-emails)
  * [Slaat u foutlogboeken op?](#do-you-store-error-logs)
  * [Lees je mijn e-mails?](#do-you-read-my-emails)
  * [Kan ik met deze optie "e-mail verzenden als" in Gmail?](#can-i-send-mail-as-in-gmail-with-this)
  * [Kan ik met deze functie in Outlook 'e-mail verzenden als'?](#can-i-send-mail-as-in-outlook-with-this)
  * [Kan ik met deze functie 'e-mail verzenden als' in Apple Mail en iCloud Mail?](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Kan ik hiermee onbeperkt e-mails doorsturen?](#can-i-forward-unlimited-emails-with-this)
  * [Biedt u onbeperkte domeinen aan voor één prijs?](#do-you-offer-unlimited-domains-for-one-price)
  * [Welke betaalmethoden accepteren jullie?](#which-payment-methods-do-you-accept)
* [Aanvullende bronnen](#additional-resources)

## Snelle start {#quick-start}

Aan de slag met Forward Email:

1. **Maak een account** aan op [forwardemail.net/register](https://forwardemail.net/register)

2. **Voeg uw domein toe en verifieer het** onder [Mijn account → Domeinen](/my-account/domains)

3. **E-mailaliassen/mailboxen toevoegen en configureren** onder [Mijn account → Domeinen](/my-account/domains) → Aliassen

4. **Test uw installatie** door een e-mail te sturen naar een van uw nieuwe aliassen

> \[!TIP]
> Het kan 24-48 uur duren voordat DNS-wijzigingen wereldwijd zijn doorgevoerd, maar vaak worden ze veel eerder van kracht.

> \[!IMPORTANT]
> Voor een betere leverbaarheid raden we aan om de records [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) en [DMARC](#how-do-i-set-up-dmarc-for-forward-email) in te stellen.

## Inleiding {#introduction}

### Wat is doorsturen van e-mail {#what-is-forward-email}

> \[!NOTE]
> Forward Email is perfect voor particulieren, kleine bedrijven en ontwikkelaars die professionele e-mailadressen willen zonder de kosten en het onderhoud van een complete e-mailhostingoplossing.

Forward Email is een **e-mailprovider met alle functies** en **e-mailhostingprovider voor aangepaste domeinnamen**.

Het is de enige gratis en open-source service waarmee u e-mailadressen met een aangepast domein kunt gebruiken zonder dat u uw eigen e-mailserver hoeft in te stellen en te onderhouden.

Onze service stuurt e-mails die naar uw eigen domein worden verzonden, door naar uw bestaande e-mailaccount. U kunt ons zelfs gebruiken als uw speciale e-mailhostingprovider.

Belangrijkste kenmerken van Forward Email:

* **Aangepast domein e-mailadres**: Gebruik professionele e-mailadressen met je eigen domeinnaam
* **Gratis niveau**: Eenvoudige e-maildoorsturing zonder kosten
* **Verbeterde privacy**: We lezen je e-mails niet en verkopen je gegevens niet
* **Open source**: Onze volledige codebase is beschikbaar op GitHub
* **SMTP-, IMAP- en POP3-ondersteuning**: Volledige mogelijkheden voor het verzenden en ontvangen van e-mails
* **End-to-end encryptie**: Ondersteuning voor OpenPGP/MIME
* **Aangepaste catch-all aliassen**: Maak een onbeperkt aantal e-mailaliassen

U kunt ons vergelijken met 56+ andere e-mail dienstverleners op [onze e-mailvergelijkingspagina](/blog/best-email-service).

> \[!TIP]
> Lees meer over het doorsturen van e-mail in onze gratis [Technisch whitepaper](/technical-whitepaper.pdf)

### Wie gebruikt Forward Email {#who-uses-forward-email}

Wij bieden e-mailhosting en e-maildoorstuurdiensten aan meer dan 500.000 domeinen en deze bekende gebruikers:

| Klant | Casestudy |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Amerikaanse Marine Academie | [:page_facing_up: Case Study](/blog/docs/federal-government-email-service-section-889-compliant) |
| Canoniek | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Netflix-spellen |  |
| De Linux Foundation | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| De PHP Foundation |  |
| Fox News Radio |  |
| Disney-advertentieverkoop |  |
| jQuery | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| LineageOS |  |
| Ubuntu | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Vrij | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Lubuntu | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| De Universiteit van Cambridge | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| De Universiteit van Maryland | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| De Universiteit van Washington | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Tufts Universiteit | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Swarthmore College | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Regering van Zuid-Australië |  |
| Regering van de Dominicaanse Republiek |  |
| Fly<span>.</span>io |  |
| RCD Hotels |  |
| Isaac Z. Schlueter (npm) | [:page_facing_up: Case Study](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |  |

### Wat is de geschiedenis van Forward Email {#what-is-forward-emails-history}

Meer informatie over het doorsturen van e-mail vindt u op [onze Over ons pagina](/about).

### Hoe snel is deze service {#how-fast-is-this-service}

> \[!NOTE]
> Ons systeem is ontworpen voor snelheid en betrouwbaarheid, met meerdere redundante servers om ervoor te zorgen dat uw e-mails snel worden afgeleverd.

Met Forward Email worden berichten met minimale vertraging afgeleverd, doorgaans binnen enkele seconden na ontvangst.

Prestatiegegevens:

* **Gemiddelde levertijd**: Minder dan 5-10 seconden van ontvangst tot doorsturen ([zie onze Time to Inbox "TTI" monitoringpagina](/tti))
* **Uptime**: Servicebeschikbaarheid van meer dan 99,9%
* **Wereldwijde infrastructuur**: Servers strategisch geplaatst voor optimale routering
* **Automatisch schalen**: Ons systeem schaalt mee tijdens piekmomenten in de e-mail

Wij werken in real-time, in tegenstelling tot andere aanbieders die afhankelijk zijn van vertraagde wachtrijen.

We schrijven geen logs naar schijf en slaan ze ook niet op – met [uitzondering van fouten](#do-you-store-error-logs) en [uitgaande SMTP](#do-you-support-sending-email-with-smtp) (zie onze [Privacybeleid](/privacy)).

Alles gebeurt in het geheugen en [onze broncode staat op GitHub](https://github.com/forwardemail).

## E-mailclients {#email-clients}

### Thunderbird {#thunderbird}

1. Maak een nieuwe alias aan en genereer een wachtwoord in je 'Doorsturen'-dashboard.
2. Open Thunderbird en ga naar **Bewerken → Accountinstellingen → Accountacties → E-mailaccount toevoegen**.
3. Voer je naam, je e-mailadres voor doorsturen en je wachtwoord in.
4. Klik op **Handmatig configureren** en voer het volgende in:
* Inkomend: IMAP, `imap.forwardemail.net`, poort 993, SSL/TLS
* Uitgaand: SMTP, `smtp.forwardemail.net`, poort 587, STARTTLS
5. Klik op **Gereed**

### Microsoft Outlook {#microsoft-outlook}

1. Maak een nieuwe alias aan en genereer een wachtwoord in je dashboard 'Doorsturen e-mail'
2. Ga naar **Bestand → Account toevoegen**
3. Voer je e-mailadres voor doorsturen in en klik op **Verbinden**
4. Kies **Geavanceerde opties** en selecteer **Laat mij mijn account handmatig instellen**
5. Selecteer **IMAP** en voer het volgende in:
* Inkomend: `imap.forwardemail.net`, poort 993, SSL
* Uitgaand: `smtp.forwardemail.net`, poort 587, TLS
* Gebruikersnaam: je volledige e-mailadres
* Wachtwoord: je gegenereerde wachtwoord
6. Klik op **Verbinden**

### Apple Mail {#apple-mail}

1. Maak een nieuwe alias aan en genereer een wachtwoord in je dashboard 'E-mail doorsturen'.
2. Ga naar **E-mail → Voorkeuren → Accounts → +**
3. Selecteer **Ander e-mailaccount**
4. Voer je naam, e-mailadres voor doorsturen en je wachtwoord in.
5. Voer voor de serverinstellingen het volgende in:
* Inkomend: `imap.forwardemail.net`
* Uitgaand: `smtp.forwardemail.net`
* Gebruikersnaam: je volledige e-mailadres
* Wachtwoord: je gegenereerde wachtwoord
6. Klik op **Aanmelden**

### Mobiele apparaten {#mobile-devices}

Voor iOS:

1. Ga naar **Instellingen → Mail → Accounts → Account toevoegen → Overig**
2. Tik op **E-mailaccount toevoegen** en voer je gegevens in.
3. Gebruik voor de serverinstellingen dezelfde IMAP- en SMTP-instellingen als hierboven.

Voor Android:

1. Ga naar **Instellingen → Accounts → Account toevoegen → Persoonlijk (IMAP)**
2. Voer uw doorstuuradres en wachtwoord in.
3. Gebruik voor de serverinstellingen dezelfde IMAP- en SMTP-instellingen als hierboven.

### Hoe e-mail verzenden als met Gmail {#how-to-send-mail-as-using-gmail}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Geschatte installatietijd:</strong>
<span>Minder dan 10 minuten</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Aan de slag:
</strong>
<span>
Als je de bovenstaande instructies onder <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Hoe begin ik en stel ik e-maildoorsturing in</a> hebt gevolgd, kun je hieronder verder lezen.
</span>
</div>

<div id="e-mail-verzenden-als-inhoud">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Belangrijk:
</strong>
<span>
Zorg ervoor dat u onze <a href="/terms" class="alert-link" target="_blank">Voorwaarden</a>, <a href="/privacy" class="alert-link" target="_blank">Privacybeleid</a> en <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Uitgaande SMTP-limieten</a> hebt gelezen - uw gebruik wordt beschouwd als erkenning en akkoord.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Belangrijk:
</strong>
<span>
Bent u een ontwikkelaar? Raadpleeg dan onze <a class="alert-link" href="/email-api#outbound-emails" target="_blank">documentatie voor de e-mail-API</a>.
</span>
</div>

1. Ga naar <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mijn account <i class="fa fa-angle-right"></i>Domeinen</a> <i class="fa fa-angle-right"></i>Instellingen <i class="fa fa-angle-right"></i>Uitgaande SMTP-configuratie en volg de installatie-instructies

2. Maak een nieuwe alias voor uw domein onder <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mijn account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Aliassen (bijv. <code><hello@example.com></code>)

3. Klik op <strong class="text-success"><i class="fa fa-key"></i>Wachtwoord genereren</strong> naast de zojuist aangemaakte alias. Kopieer het gegenereerde wachtwoord naar uw klembord en bewaar het veilig op het scherm.

4. Ga naar [Gmail](https://gmail.com) en klik onder [Instellingen <i class="fa fa-angle-right"></i> Accounts en importeren <i class="fa fa-angle-right"></i> E-mail verzenden als](https://mail.google.com/mail/u/0/#settings/accounts) op "Nog een e-mailadres toevoegen"

5. Wanneer u wordt gevraagd om "Naam", voer dan de naam in waaronder u wilt dat uw e-mail als "Van" wordt weergegeven (bijv. "Linus Torvalds").

6. Wanneer u wordt gevraagd om "E-mailadres", voert u het volledige e-mailadres in van een alias die u hebt gemaakt onder <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mijn account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Aliassen (bijv. <code><hello@example.com></code>)

7. Schakel 'Behandelen als alias' uit

8. Klik op "Volgende stap" om door te gaan

9. Wanneer u wordt gevraagd om "SMTP-server", voer dan <code>smtp.forwardemail.net</code> in en laat de poort staan op <code>587</code>

10. Wanneer u wordt gevraagd om een "Gebruikersnaam", voer dan het volledige e-mailadres in van een alias die u hebt aangemaakt onder <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Aliassen (bijv. <code><hello@example.com></code>)

11. Wanneer u om een wachtwoord wordt gevraagd, plakt u het wachtwoord uit <strong class="text-success"><i class="fa fa-key"></i> Wachtwoord genereren</strong> in stap 3 hierboven.

12. Laat de keuzerond voor 'Beveiligde verbinding via TLS' aangevinkt

13. Klik op "Account toevoegen" om door te gaan

14. Open een nieuw tabblad naar [Gmail](https://gmail.com) en wacht tot uw verificatiemail binnenkomt (u ontvangt een verificatiecode die bevestigt dat u de eigenaar bent van het e-mailadres waarnaar u probeert te 'Verzenden als').

15. Zodra het is aangekomen, kopieer en plak je de verificatiecode bij de prompt die je in de vorige stap hebt ontvangen

16. Ga daarna terug naar de e-mail en klik op de link om de aanvraag te bevestigen. Waarschijnlijk moet u deze en de vorige stap herhalen om de e-mail correct te configureren.

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Gefeliciteerd!
</strong>
<span>
Je hebt alle stappen succesvol voltooid.
</span>
</div>
</div>

</div>

### Wat is de gratis handleiding voor het verzenden van e-mails met Gmail {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Belangrijk:</strong> Deze oude gratis handleiding is sinds mei 2023 verouderd, omdat <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">we nu uitgaande SMTP ondersteunt</a>. Als u de onderstaande handleiding gebruikt, zorgt <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">this ervoor dat uw uitgaande e-mail</a> de melding "<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>" krijgt in Gmail.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Geschatte installatietijd:</strong>
<span>Minder dan 10 minuten</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Aan de slag:
</strong>
<span>
Als je de bovenstaande instructies onder <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Hoe begin ik en stel ik e-maildoorsturing in</a> hebt gevolgd, kun je hieronder verder lezen.
</span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="E-mail verzenden als met Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. Je moet [Gmail's twee-factorauthenticatie][gmail-2fa] ingeschakeld hebben om dit te laten werken. Ga naar <https://www.google.com/landing/2step/> als je dit niet hebt ingeschakeld.

2. Zodra twee-factor-authenticatie is ingeschakeld (of als u het al had ingeschakeld), gaat u naar <https://myaccount.google.com/apppasswords>.

3. Wanneer u wordt gevraagd om de app en het apparaat te selecteren waarvoor u het app-wachtwoord wilt genereren:
* Selecteer 'E-mail' in de vervolgkeuzelijst 'App selecteren'.
* Selecteer 'Overig' in de vervolgkeuzelijst 'App selecteren'.
* Voer het e-mailadres van uw aangepaste domein in waarvan u de berichten wilt doorsturen (bijv. <code><hello@example.com></code> - dit helpt u bij het bijhouden als u deze service voor meerdere accounts gebruikt).

4. Kopieer het wachtwoord naar je klembord dat automatisch wordt gegenereerd
<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Belangrijk:
</strong>
<span>
Als je G Suite gebruikt, ga dan naar je beheerderspaneel <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Apps <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Instellingen voor Gmail <i class="fa fa-angle-right"></i> Instellingen</a> en zorg ervoor dat je "Gebruikers toestaan e-mail te verzenden via een externe SMTP-server..." aanvinkt. Het kan enige tijd duren voordat deze wijziging wordt doorgevoerd, dus wacht een paar minuten.
</span>
</div>

5. Ga naar [Gmail](https://gmail.com) en klik onder [Instellingen <i class="fa fa-angle-right"></i> Accounts en importeren <i class="fa fa-angle-right"></i> E-mail verzenden als](https://mail.google.com/mail/u/0/#settings/accounts) op "Nog een e-mailadres toevoegen"

6. Wanneer u wordt gevraagd om een "Naam", voer dan de naam in waaronder u wilt dat uw e-mail als "Van" wordt weergegeven (bijv. "Linus Torvalds")

7. Wanneer u wordt gevraagd om 'E-mailadres', voert u het e-mailadres in met het aangepaste domein dat u hierboven hebt gebruikt (bijv. <code><hello@example.com></code>).

8. Schakel 'Behandelen als alias' uit

9. Klik op "Volgende stap" om door te gaan

10. Wanneer u wordt gevraagd om "SMTP-server", voer dan <code>smtp.gmail.com</code> in en laat de poort staan op <code>587</code>

11. Wanneer je wordt gevraagd om een gebruikersnaam, voer je het gedeelte van je Gmail-adres in zonder het gedeelte <span>gmail.com</span> (bijv. alleen "gebruiker" als mijn e-mailadres <span><user@gmail.com></span> is).
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Belangrijk:
</strong>
<span>
Als het gedeelte "Gebruikersnaam" automatisch wordt ingevuld, <u><strong>moet je dit</strong></u> wijzigen in het gedeelte gebruikersnaam van je Gmail-adres.
</span>
</div>

12. Wanneer u wordt gevraagd om "Wachtwoord", plakt u het wachtwoord dat u in stap 2 hierboven hebt gegenereerd vanuit uw klembord

13. Laat de keuzerond voor 'Beveiligde verbinding via TLS' aangevinkt

14. Klik op "Account toevoegen" om door te gaan

15. Open een nieuw tabblad naar [Gmail](https://gmail.com) en wacht tot uw verificatiemail binnenkomt (u ontvangt een verificatiecode die bevestigt dat u de eigenaar bent van het e-mailadres waarnaar u probeert te 'Verzenden als').

16. Zodra het is aangekomen, kopieer en plak je de verificatiecode bij de prompt die je in de vorige stap hebt ontvangen

17. Ga daarna terug naar de e-mail en klik op de link om de aanvraag te bevestigen. Waarschijnlijk moet u deze en de vorige stap herhalen om de e-mail correct te configureren.

</div>

### Geavanceerde Gmail-routeringsconfiguratie {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Geschatte installatietijd:</strong>
<span>15-30 minuten</span>
</div>

Als u geavanceerde routering in Gmail wilt instellen, zodat aliassen die niet overeenkomen met een mailbox, worden doorgestuurd naar de e-mailuitwisselingen van Forward Email, volgt u deze stappen:

1. Log in op je Google Admin Console via [admin.google.com](https://admin.google.com)
2. Ga naar **Apps → Google Workspace → Gmail → Routing**
3. Klik op **Route toevoegen** en configureer de volgende instellingen:

**Instellingen voor één ontvanger:**

* Selecteer 'Envelopontvanger wijzigen' en voer je primaire Gmail-adres in.
* Vink 'X-Gm-Original-To-header toevoegen met oorspronkelijke ontvanger' aan.

**Patronen voor envelopontvangers:**

* Voeg een patroon toe dat overeenkomt met alle niet-bestaande mailboxen (bijv. `.*@yourdomain.com`)

**E-mailserverinstellingen:**

* Selecteer "Route naar host" en voer `mx1.forwardemail.net` in als primaire server.
* Voeg `mx2.forwardemail.net` toe als back-upserver.
* Stel poort in op 25.
* Selecteer "TLS vereisen" voor beveiliging.

4. Klik op **Opslaan** om de route te maken

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Belangrijk:
</strong>
<span>
Deze configuratie werkt alleen voor Google Workspace-accounts met aangepaste domeinen, niet voor gewone Gmail-accounts.
</span>
</div>

### Geavanceerde Outlook-routeringsconfiguratie {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Geschatte installatietijd:</strong>
<span>15-30 minuten</span>
</div>

Voor Microsoft 365 (voorheen Office 365)-gebruikers die geavanceerde routering willen instellen, zodat aliassen die niet overeenkomen met een postvak, worden doorgestuurd naar de e-mailuitwisselingen van Forward Email:

1. Meld u aan bij het Microsoft 365-beheercentrum op [admin.microsoft.com](https://admin.microsoft.com)
2. Ga naar **Exchange → E-mailstroom → Regels**
3. Klik op **Een regel toevoegen** en selecteer **Een nieuwe regel maken**
4. Geef uw regel een naam (bijv. 'Niet-bestaande postvakken doorsturen naar E-mail doorsturen')
5. Selecteer onder **Deze regel toepassen als**:
* 'Het adres van de ontvanger komt overeen met...'
* Voer een patroon in dat overeenkomt met alle adressen in uw domein (bijv. `*@yourdomain.com`)
6. Selecteer onder **Doe het volgende**:
* 'Het bericht omleiden naar...'
* Kies 'De volgende mailserver'
* Voer `mx1.forwardemail.net` en poort 25 in
* Voeg `mx2.forwardemail.net` toe als back-upserver
7. Selecteer onder **Behalve als**:
* 'De ontvanger is...'
* Voeg al uw bestaande postvakken toe die niet moeten worden doorgestuurd
8. Stel de Regelprioriteit om ervoor te zorgen dat deze na andere e-mailstroomregels wordt uitgevoerd.
9. Klik op **Opslaan** om de regel te activeren.

## Problemen oplossen met {#troubleshooting}

### Waarom ontvang ik mijn test-e-mails niet {#why-am-i-not-receiving-my-test-emails}

Als u een test-e-mail naar uzelf stuurt, wordt deze mogelijk niet in uw inbox weergegeven omdat de e-mail dezelfde 'Bericht-ID'-header heeft.

Dit is een algemeen bekend probleem dat ook diensten zoals Gmail treft. <a href="https://support.google.com/a/answer/1703601">Here is het officiële Gmail-antwoord op dit probleem</a>.

Als de problemen aanhouden, is de kans groot dat er een probleem is met de DNS-propagatie. Wacht even en probeer het opnieuw (of stel een lagere TTL-waarde in voor uw <strong class="notranslate">TXT</strong>-records).

**Ondervindt u nog steeds problemen?** Neem dan <a href="/help">contact met ons op</a>, zodat we het probleem kunnen onderzoeken en snel een oplossing kunnen vinden.

### Hoe configureer ik mijn e-mailclient om met Forward Email {#how-do-i-configure-my-email-client-to-work-with-forward-email} te werken?

<div class="mb-3">
Onze service werkt met populaire e-mailclients zoals:
<ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
<li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android&trade;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> Desktop</a></li>
<li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> Mozilla Firefox®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i> Google Chrome®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i> Terminal</a></li>
</ul>
</div>

<div class="alert alert-primary">
Je gebruikersnaam is het e-mailadres van je alias en je wachtwoord is van <strong class="text-success"><i class="fa fa-key"></i> Genereer wachtwoord</strong> ("Normaal wachtwoord").
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>Als u Thunderbird gebruikt, zorg er dan voor dat "Verbindingsbeveiliging" is ingesteld op "SSL/TLS" en de authenticatiemethode op "Normaal wachtwoord".</span>
</div>

| Type | Hostnaam | Protocol | Havens |
| :--: | :---------------------: | :-------------------------------------: | :----------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` | SSL/TLS **Aanbevolen** | `993` en `2993` |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **Voorkeur** of TLS (STARTTLS) | `465` en `2465` voor SSL/TLS (of) `587`, `2587`, `2525` en `25` voor TLS (STARTTLS) |

### Waarom komen mijn e-mails in de spam- en ongewenste e-mail terecht en hoe kan ik de reputatie van mijn domein controleren {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}

In dit gedeelte wordt uitgelegd of uw uitgaande e-mail gebruikmaakt van onze SMTP-servers (bijvoorbeeld `smtp.forwardemail.net`) (of wordt doorgestuurd via `mx1.forwardemail.net` of `mx2.forwardemail.net`) en in de map Spam of Ongewenste e-mail van ontvangers terechtkomt.

Wij controleren routinematig onze [IP-adressen](#what-are-your-servers-ip-addresses) tegen [alle gerenommeerde DNS-weigerlijsten](#how-do-you-handle-your-ip-addresses-becoming-blocked), **daarom is het hoogstwaarschijnlijk een probleem dat verband houdt met de reputatie van het domein**.

Er zijn verschillende redenen waarom e-mails in de spamfolder terecht kunnen komen:

1. **Ontbrekende authenticatie**: Stel records [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) en [DMARC](#how-do-i-set-up-dmarc-for-forward-email) in.

2. **Domeinreputatie**: Nieuwe domeinen hebben vaak een neutrale reputatie totdat ze een verzendgeschiedenis hebben opgebouwd.

3. **Inhoudstriggers**: Bepaalde woorden of zinnen kunnen spamfilters activeren.

4. **Verzendpatronen**: Een plotselinge toename in het e-mailvolume kan verdacht overkomen.

U kunt een of meer van de volgende hulpmiddelen gebruiken om de reputatie en categorisatie van uw domein te controleren:

| Gereedschapsnaam | URL | Type |
| ------------------------------------------- | ---------------------------------------------------------------- | ---------------------- |
| Feedback over Cloudflare-domeincategorisatie | <https://radar.cloudflare.com/domeinen/feedback> | Categorisatie |
| Spamhaus IP- en domeinreputatiecontrole | <https://check.spamhaus.org/> | DNSBL |
| Cisco Talos IP en Domeinreputatiecentrum | <https://talosintelligence.com/reputatie_centrum> | Reputatie |
| Barracuda IP en domeinreputatie opzoeken | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL |
| MX Toolbox Blacklist-controle | <https://mxtoolbox.com/blacklists.aspx> | Zwarte lijst |
| Google Postmaster-hulpprogramma's | <https://www.gmail.com/postmaster/> | Reputatie |
| Yahoo Sender Hub | <https://senders.yahooinc.com/> | Reputatie |
| MultiRBL.valli.org Zwarte lijstcontrole | <https://multirbl.valli.org/lookup/> | DNSBL |
| Zenderscore | <https://senderscore.org/act/blocklist-remover/> | Reputatie |
| Inwaardering | <https://www.invaluement.com/lookup/> | DNSBL |
| SURBL | <https://www.surbl.org/> | DNSBL |
| Verwijdering van Apple/Proofpoint IP | <https://ipcheck.proofpoint.com/> | Verwijdering |
| Verwijdering van Cloudmark IP | <https://csi.cloudmark.com/en/reset/> | Verwijdering |
| SpamCop | <https://www.spamcop.net/bl.shtml> | DNSBL |
| Verwijderen van IP-adressen van Microsoft Outlook en Office 365 | <https://sendersupport.olc.protection.outlook.com/pm/Postmaster> | Verwijdering |
| Niveaus 1, 2 en 3 van UCEPROTECT | <https://www.uceprotect.net/en/rblcheck.php> | DNSBL |
| UCEPROTECT's backscatterer.org | <https://www.backscatterer.org/> | Backscatter-bescherming |
| UCEPROTECT's whitelisted.org | <https://www.whitelisted.org/> (vereist een vergoeding) | DNSWL |
| AT&T | `abuse_rbl@abuse-att.net` | Verwijdering |
| AOL/Verizon (bijv. `[IPTS04]`) | <https://senders.yahooinc.com/> | Verwijdering |
| Cox Communicatie | `unblock.request@cox.net` | Verwijdering |
| t-online.de (Duits/T-Mobile) | `tobr@rx.t-online.de` | Verwijdering |

> \[!TIP]
> Begin met een laag volume hoogwaardige e-mails om een positieve reputatie op te bouwen voordat u grotere volumes verstuurt.

> \[!IMPORTANT]
> Als uw domein op een zwarte lijst staat, heeft elke zwarte lijst zijn eigen verwijderingsproces. Raadpleeg de websites van de zwarte lijsten voor instructies.

> \[!TIP]
> Als u meer hulp nodig heeft of merkt dat we door een bepaalde e-mailprovider als vals-positief als spam worden aangemerkt, neem dan <a href="/help">contact met ons op</a>.

### Wat moet ik doen als ik spam-e-mails ontvang {#what-should-i-do-if-i-receive-spam-emails}

U dient zich af te melden van de e-maillijst (indien mogelijk) en de afzender te blokkeren.

Meld het bericht niet als spam, maar stuur het door naar ons handmatig samengestelde en op privacy gerichte systeem ter voorkoming van misbruik.

**Het e-mailadres waarnaar u spam kunt doorsturen is:** <abuse@forwardemail.net>

### Waarom worden mijn test-e-mails die naar mij zijn verzonden in Gmail weergegeven als 'verdacht' {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Als u deze foutmelding in Gmail ziet wanneer u een test naar uzelf verstuurt, of wanneer iemand met wie u e-mailt onder uw alias voor het eerst een e-mail van u ziet, hoeft u zich geen zorgen te maken. Dit is namelijk een ingebouwde veiligheidsfunctie van Gmail.

U kunt eenvoudig op 'Ziet er veilig uit' klikken. Als u bijvoorbeeld een testbericht naar iemand anders stuurt met de functie 'E-mail verzenden als', dan zal die persoon dit bericht niet zien.

Als ze deze melding echter wel zien, komt dat doordat ze gewend zijn dat je e-mails afkomstig zijn van <john@gmail.com> in plaats van <john@customdomain.com> (slechts een voorbeeld). Gmail waarschuwt gebruikers om de veiligheid te garanderen, voor het geval dat. Er is geen oplossing.

### Kan ik het via forwardemail punt net verwijderen in Gmail {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

Dit onderwerp is gerelateerd aan een [algemeen bekend probleem in Gmail waarbij extra informatie naast de naam van een afzender verschijnt](https://support.google.com/mail/answer/1311182).

Vanaf mei 2023 ondersteunen we het versturen van e-mail met SMTP als add-on voor alle betalende gebruikers. Dit betekent dat u <span class="notranslate">via forwardemail dot net</span> in Gmail kunt verwijderen.

Houd er rekening mee dat dit FAQ-onderwerp specifiek is voor degenen die de functie [Hoe u e-mail kunt verzenden met Gmail](#how-to-send-mail-as-using-gmail) gebruiken.

Zie de sectie over [Ondersteunt u het verzenden van e-mail met SMTP?](#do-you-support-sending-email-with-smtp) voor configuratie-instructies.

## Gegevensbeheer {#data-management}

### Waar bevinden uw servers zich {#where-are-your-servers-located}

> \[!TIP]
> We maken binnenkort mogelijk onze datacenterlocatie in de EU bekend, gehost onder [forwardemail.eu](https://forwardemail.eu). Abonneer u op de discussie op <https://github.com/orgs/forwardemail/discussions/336> voor updates.

Onze servers bevinden zich voornamelijk in Denver, Colorado – zie <https://forwardemail.net/ips> voor onze volledige lijst met IP-adressen.

Meer informatie over onze subverwerkers vindt u op onze pagina's [GDPR](/gdpr), [DPA](/dpa) en [Privacy](/privacy).

### Hoe exporteer en back-up ik mijn mailbox {#how-do-i-export-and-backup-my-mailbox}

U kunt uw postvakken op elk gewenst moment exporteren als [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox) of gecodeerde [SQLite](https://en.wikipedia.org/wiki/SQLite)-indelingen.

Ga naar <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mijn account <i class="fa fa-angle-right"></i>Domeinen</a> <i class="fa fa-angle-right"></i> Aliassen <i class="fa fa-angle-right"></i> Download Backup en selecteer het gewenste exportformaat.

Zodra de export is voltooid, ontvangt u per e-mail een link om de export te downloaden.

Houd er rekening mee dat deze exportdownloadlink na 4 uur verloopt vanwege veiligheidsredenen.

Als u uw geëxporteerde EML- of Mbox-formaten wilt controleren, kunnen deze open-sourcetools nuttig zijn:

| Naam | Formaat | Platform | GitHub-URL |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| MBox-viewer | Mbox | Ramen | <https://github.com/eneam/mboxviewer> |
| mbox-webviewer | Mbox | Alle platforms | <https://github.com/PHMRanger/mbox-web-viewer> |
| EmlReader | EML | Ramen | <https://github.com/ayamadori/EmlReader> |
| E-mailviewer | EML | VSCode | <https://github.com/joelharkes/vscode_email_viewer> |
| eml-lezer | EML | Alle platforms | <https://github.com/s0ph1e/eml-lezer> |

Als u bovendien een Mbox-bestand naar een EML-bestand moet converteren, kunt u <https://github.com/noelmartinon/mboxzilla>. gebruiken

### Hoe importeer en migreer ik mijn bestaande mailbox {#how-do-i-import-and-migrate-my-existing-mailbox}

U kunt uw e-mail eenvoudig importeren naar Forward Email (bijvoorbeeld met behulp van [Dondervogel](https://www.thunderbird.net)) met de onderstaande instructies:

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Belangrijk:
</strong>
<span>
Je moet alle volgende stappen volgen om je bestaande e-mailadres te importeren.
</span>
</div>

1. Exporteer uw e-mail van uw bestaande e-mailprovider:

| E-mailprovider | Exportformaat | Exportinstructies |
| -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gmail | MBOX | <https://takeout.google.com/settings/takeout/custom/gmail> |
| Vooruitzichten | PST | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Tip:</strong> <span>Als u Outlook gebruikt (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">PST-exportindeling</a>), kunt u eenvoudig de instructies onder 'Overig' hieronder volgen. We hebben echter hieronder links opgenomen om PST naar MBOX/EML-formaat te converteren, afhankelijk van uw besturingssysteem: <ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba voor Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst voor Windows cygwin</a> – (bijv. <code>readpst -u -o $OUT_DIR $IN_DIR</code> ter vervanging van <code>$OUT_DIR</code> en <code>$IN_DIR</code> met respectievelijk de paden van de uitvoer- en invoermap).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst voor Ubuntu/Linux</a> – (bijv. <code>sudo apt-get install readpst</code> en vervolgens <code>readpst -u -o $OUT_DIR $IN_DIR</code>, waarbij <code>$OUT_DIR</code> en <code>$IN_DIR</code> worden vervangen door respectievelijk de paden van de uitvoer- en invoermap).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst voor macOS (via brew)</a> – (bijv. <code>brew install libpst</code> en vervolgens <code>readpst -u -o $OUT_DIR $IN_DIR</code>, waarbij <code>$OUT_DIR</code> en <code>$IN_DIR</code> worden vervangen door respectievelijk de paden van de uitvoer- en invoermap.</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">PST Converter voor Windows (GitHub)</a></li></ul><br /></span></div> |
| Apple Mail | MBOX | <https://support.apple.com/guide/mail/mailboxen-importeren-of-exporteren-mlhlp1030/mac#apd37a3190755974> |
| Fastmail | EML | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-al-uw-gegevens#downloadmail> |
| Proton Mail | MBOX/EML | <https://proton.me/support/export-emails-import-export-app> |
| Tutanota | EML | <https://github.com/crepererum-oss/tatutanatata> |
| Denken | EML | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents> |
| Zoho | EML | <https://www.zoho.com/mail/help/import-export-emails.html#alink2> |
| Ander | [Use Thunderbird](https://www.thunderbird.net) | Stel uw bestaande e-mailaccount in Thunderbird in en gebruik vervolgens de plug-in [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) om uw e-mail te exporteren en importeren. **U kunt e-mails ook eenvoudig kopiëren en plakken of slepen en neerzetten tussen accounts.** |

2. Download, installeer en open [Dondervogel](https://www.thunderbird.net).

3. Maak een nieuw account aan met het volledige e-mailadres van uw alias (bijv. <code><u@uwdomein.com></code>) en het wachtwoord dat u heeft aangemaakt. <strong>Als u nog geen wachtwoord heeft aangemaakt, <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">raadpleeg dan onze installatie-instructies</a></strong>.

4. Download en installeer de [ImportExportTools VAN](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) Thunderbird-plug-in.

5. Maak een nieuwe lokale map in Thunderbird en klik er met de rechtermuisknop op → selecteer de optie `ImportExportTools NG` → kies `Import mbox file` (voor het MBOX-exportformaat) – of – `Import messages` / `Import all messages from a directory` (voor het EML-exportformaat).

6. Sleep de berichten vanuit de lokale map naar een nieuwe (of bestaande) IMAP-map in Thunderbird waarnaar u ze wilt uploaden in de IMAP-opslag van onze service. Zo weet u zeker dat ze online worden opgeslagen in onze met SQLite versleutelde opslag.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>
Als u niet zeker weet hoe u moet importeren in Thunderbird, raadpleeg dan de officiële instructies op <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> en <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Belangrijk:
</strong>
<span>
Nadat u het export- en importproces hebt voltooid, kunt u doorsturen inschakelen voor uw bestaande e-mailaccount en een autoresponder instellen om afzenders te informeren dat u een nieuw e-mailadres heeft (bijvoorbeeld als u voorheen Gmail gebruikte en nu een e-mailadres met uw eigen domeinnaam gebruikt).
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Gefeliciteerd!
</strong>
<span>
Je hebt alle stappen succesvol voltooid.
</span>
</div>
</div>

### Ondersteunt u zelfhosting {#do-you-support-self-hosting}

Ja, vanaf maart 2025 ondersteunen we een zelfgehoste optie. Lees de blog [hier](https://forwardemail.net/blog/docs/self-hosted-solution). Bekijk [zelf-gehoste gids](https://forwardemail.net/self-hosted) om aan de slag te gaan. En voor degenen die geïnteresseerd zijn in een meer gedetailleerde stapsgewijze versie, zie onze handleidingen gebaseerd op [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) of [Debian](https://forwardemail.net/guides/selfhosted-on-debian).

## E-mailconfiguratie {#email-configuration}

### Hoe ga ik aan de slag en stel ik e-maildoorsturen in? {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Geschatte installatietijd:</strong>
<span>Minder dan 10 minuten</span>
</div>

<div class="alert my-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Aan de slag:
</strong>
<span>
Lees en volg stap één tot en met acht hieronder zorgvuldig. Vervang het e-mailadres <code>gebruiker@gmail.com</code> door het e-mailadres waarnaar u e-mails wilt doorsturen (als dit nog niet correct is). Vervang ook <code>example.com</code> door uw eigen domeinnaam (als dit nog niet correct is).
</span>
</div>

<ol>
<li class="mb-2 mb-md-3 mb-lg-5">Als je je domeinnaam al ergens hebt geregistreerd, sla deze stap dan volledig over en ga direct naar stap twee! Anders kun je <a href="/domain-registration" rel="noopener noreferrer">hier klikken om je domeinnaam te registreren</a>.</li>
<li class="mb-2 mb-md-3 mb-lg-5">
Weet je nog waar je je domein hebt geregistreerd? Zodra je dit weet, volg je de onderstaande instructies:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Belangrijk:
</strong>
<span>
U moet een nieuw tabblad openen en inloggen bij uw domeinregistrar. U kunt eenvoudig hieronder op uw "Registrar" klikken om dit automatisch te doen. In dit nieuwe tabblad moet u naar de DNS-beheerpagina van uw registrar navigeren. We hebben de stapsgewijze navigatiestappen hieronder weergegeven in de kolom "Stappen om te configureren". Zodra u in het nieuwe tabblad naar deze pagina bent genavigeerd, kunt u terugkeren naar dit tabblad en doorgaan met stap drie hieronder.
<strong class="font-weight-bold">Sluit het geopende tabblad nog niet; u hebt het nodig voor toekomstige stappen!</strong>
</span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Registrar</th>
<th>Stappen om te configureren</th>
</tr>
</thead>
<tbody>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
<td>Inloggen <i class="fa fa-angle-right"></i> Domeincentrum <i class="fa fa-angle-right"></i> (Selecteer uw domein) <i class="fa fa-angle-right"></i> DNS-instellingen bewerken</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Route 53</a></td>
<td>Inloggen <i class="fa fa-angle-right"></i> Gehoste zones <i class="fa fa-angle-right"></i> (Selecteer je domein)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
<td>Inloggen <i class="fa fa-angle-right"></i> Mijn servers <i class="fa fa-angle-right"></i> Domeinbeheer <i class="fa fa-angle-right"></i> DNS-beheerder</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
<td>VOOR ROCK: Inloggen <i class="fa fa-angle-right"></i> Domeinen <i class="fa fa-angle-right"></i> (Klik op het ▼-icoontje naast 'Beheren') <i class="fa fa-angle-right"></i> DNS
<br />
VOOR VEROUDERDE FUNCTIES: Inloggen <i class="fa fa-angle-right"></i> Domeinen <i class="fa fa-angle-right"></i> Zone-editor <i class="fa fa-angle-right"></i> (Selecteer je domein)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
<td>Inloggen <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Gemakkelijk Gemaakt</a></td>
<td>Inloggen <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Selecteer uw domein)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
<td>Inloggen <i class="fa fa-angle-right"></i> (Selecteer uw domein) <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Beheer</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
<td>Inloggen <i class="fa fa-angle-right"></i> Netwerken <i class="fa fa-angle-right"></i> Domeinen <i class="fa fa-angle-right"></i> (Selecteer je domein) <i class="fa fa-angle-right"></i> Meer <i class="fa fa-angle-right"></i> Domein beheren</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
<td>Inloggen <i class="fa fa-angle-right"></i> Klik in de kaartweergave op 'Beheren' voor je domein <i class="fa fa-angle-right"></i> Klik in de lijstweergave op
het tandwielpictogram <i class="fa fa-angle-right"></i> DNS & Nameservers <i class="fa fa-angle-right"></i> DNS-records</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon0 class="fa fa-play-circle"></i> Bekijken</a>
</td>
<td>Inloggen <i class="fa fa-angle-right"></i> (Selecteer je domein) <i class="fa fa-angle-right"></i> Beheren <i class="fa fa-angle-right"></i> (klik op het tandwielpictogram) <i class="fa fa-angle-right"></i> Klik op DNS & Nameservers in het linkermenu</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon1
<td>Inloggen <i class="fa fa-angle-right"></i> Paneel <i class="fa fa-angle-right"></i> Domeinen <i class="fa fa-angle-right"></i> Domeinen beheren <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon2
<td>Inloggen <i class="fa fa-angle-right"></i> Overzicht <i class="fa fa-angle-right"></i> Beheer <i class="fa fa-angle-right"></i> Eenvoudige editor <i class="fa fa-angle-right"></i> Records</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon3
<td>Inloggen <i class="fa fa-angle-right"></i> (Selecteer uw domein) <i class="fa fa-angle-right"></i> Beheer <i class="fa fa-angle-right"></i> Bewerk de zone</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon4
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon5 class="fa fa-play-circle"></i> Bekijken</a>
</td>
<td>Inloggen <i class="fa fa-angle-right"></i> Beheer mijn domeinen <i class="fa fa-angle-right"></i> (Selecteer je domein) <i class="fa fa-angle-right"></i> Beheer DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon6 Domeinen</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon7 class="fa fa-play-circle"></i> Bekijken</a>
</td>
<td>Inloggen <i class="fa fa-angle-right"></i> (Selecteer je domein) <i class="fa fa-angle-right"></i> DNS configureren</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon8
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon9 class="fa fa-play-circle"></i> Bekijken</a>
</td>
<td>Inloggen <i class="fa fa-angle-right"></i> Domeinlijst <i class="fa fa-angle-right"></i> (Selecteer je domein) <i class="fa fa-angle-right"></i> Beheer <i class="fa fa-angle-right"></i> Geavanceerde DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>0
<td>Inloggen <i class="fa fa-angle-right"></i> (Selecteer je domein) <i class="fa fa-angle-right"></i> Netlify DNS instellen</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>1 Solutions</a></td>
<td>Inloggen <i class="fa fa-angle-right"></i> Accountmanager <i class="fa fa-angle-right"></i> Mijn domeinnamen <i class="fa fa-angle-right"></i> (Selecteer uw domein) <i class="fa fa-angle-right"></i> Beheer <i class="fa fa-angle-right"></i> Wijzig de bestemming van het domein <i class="fa fa-angle-right"></i> Geavanceerde DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>2
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>3 class="fa fa-play-circle"></i> Bekijken</a>
</td>
<td>Inloggen <i class="fa fa-angle-right"></i> Beheerde domeinen <i class="fa fa-angle-right"></i> (Selecteer je domein) <i class="fa fa-angle-right"></i> DNS-instellingen</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>4
<td>Inloggen <i class="fa fa-angle-right"></i> Startmenu <i class="fa fa-angle-right"></i> Instellingen <i class="fa fa-angle-right"></i> Domeinen <i class="fa fa-angle-right"></i> (Selecteer je domein) <i class="fa fa-angle-right"></i>
Geavanceerde instellingen <i class="fa fa-angle-right"></i> Aangepaste records</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>5 Nu</a></td>
<td>Met behulp van "now" CLI <i class="fa fa-angle-right"></i> <code>now dns add [domein] '@' MX [recordwaarde] [prioriteit]</code></td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>6
<td>Inloggen <i class="fa fa-angle-right"></i> Domeinpagina <i class="fa fa-angle-right"></i> (Selecteer uw domein) <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>7
<td>Inloggen <i class="fa fa-angle-right"></i> Domeinenpagina <i class="fa fa-angle-right"></i> (Klik op het pictogram <i class="fa fa-ellipsis-h"></i>) <i class="fa fa-angle-right"></i> Selecteer DNS-records beheren</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>8
<td>Inloggen <i class="fa fa-angle-right"></i> Domeinen <i class="fa fa-angle-right"></i> Mijn domeinen</td>
</tr>
<tr>
<td>Overig</td>
<td>
<div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Belangrijk:</strong> Staat de naam van uw registrar hier niet vermeld? Zoek dan gewoon op internet naar "hoe DNS-records wijzigen op $REGISTRAR" (vervang $REGISTRAR door de naam van uw registrar - bijvoorbeeld "hoe DNS-records wijzigen op GoDaddy" als u GoDaddy gebruikt).</div>
</td>
</tr>
</tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">Stel op de DNS-beheerpagina van uw registrar (het andere tabblad dat u hebt geopend) de volgende MX-records in:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Belangrijk:
</strong>
<span>
Houd er rekening mee dat er GEEN andere MX-records ingesteld mogen zijn. Beide hieronder getoonde records MOETEN bestaan. Zorg ervoor dat er geen typefouten in staan en dat zowel mx1 als mx2 correct gespeld zijn. Als er al MX-records bestonden, verwijder deze dan volledig.
De TTL-waarde hoeft niet 3600 te zijn; indien nodig kan dit een lagere of hogere waarde zijn.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Naam/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Type</th>
<th>Prioriteit</th>
<th>Antwoord/Waarde</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", of leeg</em></td>
<td class="text-center">3600</td>
<td>MX</td>
<td>0</td>
<td><code>mx1.forwardemail.net</code></td>
</tr>
<tr>
<td><em>"@", ".", of leeg</em></td>
<td class="text-center">3600</td>
<td>MX</td>
<td>0</td>
<td><code>mx2.forwardemail.net</code></td>
</tr>
</tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Stel via de DNS-beheerpagina van uw registrar (het andere tabblad dat u hebt geopend) de volgende <strong class="notranslate">TXT</strong>-record(s) in:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Belangrijk:
</strong>
<span>
Als u een betaald abonnement heeft, moet u deze stap volledig overslaan en doorgaan naar stap vijf! Als u geen betaald abonnement heeft, zijn uw doorgestuurde adressen openbaar vindbaar. Ga naar <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> en upgrade uw domein indien gewenst naar een betaald abonnement. Wilt u meer weten over betaalde abonnementen? Bekijk dan onze pagina <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Prijzen</a>. Anders kunt u doorgaan met het kiezen van een of meer combinaties van optie A tot en met optie F, zoals hieronder vermeld.
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Optie A:
</strong>
<span>
Als u alle e-mails van uw domein (bijv. "all@example.com", "hello@example.com", enz.) doorstuurt naar een specifiek adres, "user@gmail.com":
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Naam/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Type</th>
<th>Antwoord/Waarde</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", of leeg</em></td>
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
Vervang de bovenstaande waarden in de kolom "Waarde" door uw eigen e-mailadres. De TTL-waarde hoeft niet 3600 te zijn; indien nodig kunt u een lagere of hogere waarde kiezen. Een lagere TTL-waarde (time to live) zorgt ervoor dat toekomstige wijzigingen in uw DNS-records sneller over het internet worden verspreid – zie dit als de tijd dat de gegevens in het geheugen worden opgeslagen (in seconden). Meer informatie over <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL vindt u op Wikipedia</a>.
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Optie B:
</strong>
<span>
Als u slechts één e-mailadres wilt doorsturen (bijv. <code>hello@example.com</code> naar <code>user@gmail.com</code>; hiermee wordt "hello+test@example.com" ook automatisch doorgestuurd naar "user+test@gmail.com"):
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Naam/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Type</th>
<th>Antwoord/Waarde</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", of leeg</em></td>
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
Optie C:
</strong>
<span>
Als u meerdere e-mails doorstuurt, scheidt u deze met een komma:
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Naam/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Type</th>
<th>Antwoord/Waarde</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", of leeg</em></td>
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
Optie D:
</strong>
<span>
Je kunt een oneindig aantal doorstuurmails instellen – zorg er wel voor dat er niet meer dan 255 tekens op één regel staan en dat elke regel begint met "forward-email=". Hieronder vind je een voorbeeld:
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Naam/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Type</th>
<th>Antwoord/Waarde</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", of leeg</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", of leeg</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=help:gebruiker@gmail.com,foo:gebruiker@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", of leeg</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=bestellingen:gebruiker@gmail.com,baz:gebruiker@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", of leeg</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=info:gebruiker@gmail.com,piep:gebruiker@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", of leeg</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=fouten:gebruiker@gmail.com,piep:gebruiker@gmail.com</code>
</td>
</tr>
</tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Optie E:
</strong>
<span>
Je kunt ook een domeinnaam in je <strong class="notranslate">TXT</strong>-record opgeven voor globale aliasdoorsturing (bijv. "gebruiker@example.com" wordt doorgestuurd naar "gebruiker@example.net"):
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Naam/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Type</th>
<th>Antwoord/Waarde</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", of leeg</em></td>
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
Optie F:
</strong>
<span>
Je kunt webhooks zelfs gebruiken als een globale of individuele alias om e-mails naar door te sturen. Zie het voorbeeld en de volledige sectie over webhooks met de titel <a href="#do-you-support-webhooks" class="alert-link">Ondersteunen jullie webhooks</a> hieronder.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Naam/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Type</th>
<th>Antwoord/Waarde</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", of leeg</em></td>
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
Optie G:
</strong>
<span>
Je kunt zelfs reguliere expressies ("regex") gebruiken om aliassen te matchen en om vervangingen te verwerken waarnaar e-mails moeten worden doorgestuurd. Zie de voorbeelden en de volledige sectie over regex met de titel <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Ondersteunt u reguliere expressies of regex</a> hieronder.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Heeft u geavanceerde regex met substitutie nodig?</strong> Bekijk hieronder de voorbeelden en de volledige sectie over regex met de titel <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Ondersteunt u reguliere expressies of regex</a>.
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Eenvoudig voorbeeld:</strong> Als ik wil dat alle e-mails die naar `linus@example.com` of `torvalds@example.com` gaan, worden doorgestuurd naar `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Naam/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Type</th>
<th>Antwoord/Waarde</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", of leeg</em></td>
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
Belangrijk:
</strong>
<span>
Catch-all doorstuurregels kunnen ook worden omschreven als "fall-through".
Dit betekent dat inkomende e-mails die voldoen aan ten minste één specifieke doorstuurregel, worden gebruikt in plaats van de catch-all.
Specifieke regels omvatten e-mailadressen en reguliere expressies.
<br /><br />
Bijvoorbeeld:
<br />
<code>forward-email=hello:first@gmail.com,second@gmail.com</code>
<br />
E-mails die naar <code>hello@example.com</code> worden verzonden, worden met deze configuratie **niet** doorgestuurd naar <code>second@gmail.com</code> (catch-all), maar alleen afgeleverd bij <code>first@gmail.com</code>. </span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Stel via de DNS-beheerpagina van uw registrar (het andere tabblad dat u hebt geopend) ook het volgende <strong class="notranslate">TXT</strong>-record in:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Naam/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Type</th>
<th>Antwoord/Waarde</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", of leeg</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Belangrijk:
</strong>
<span>
Als u Gmail (bijv. E-mail verzenden als) of G Suite gebruikt, moet u <code>include:_spf.google.com</code> aan de bovenstaande waarde toevoegen, bijvoorbeeld:
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
Als u al een vergelijkbare regel met "v=spf1" heeft, moet u <code>include:spf.forwardemail.net</code> direct vóór alle bestaande "include:host.com"-records en vóór "-all" in dezelfde regel toevoegen, bijvoorbeeld:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
Houd er rekening mee dat er een verschil is tussen "-all" en "~all". De "-" geeft aan dat de SPF-controle moet MISLUKT als deze niet overeenkomt, en "~" geeft aan dat de SPF-controle moet SOFTFAILEN. We raden aan de "-all"-aanpak te gebruiken om domeinvervalsing te voorkomen.
<br /><br />
Mogelijk moet u ook de SPF-record toevoegen van de host waarvan u e-mail verzendt (bijv. Outlook).
</span>
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Verifieer uw DNS-records met onze tool 'Records verifiëren' die beschikbaar is op <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mijn account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Instellingen.

</li><li class="mb-2 mb-md-3 mb-lg-5">Stuur een testmail om te controleren of het werkt. Houd er rekening mee dat het even kan duren voordat uw DNS-records zijn verwerkt.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>
</span>
Als u geen testmails ontvangt, of een testmail ontvangt met de tekst "Wees voorzichtig met dit bericht", bekijk dan de antwoorden op respectievelijk <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Waarom ontvang ik mijn testmails niet</a> en <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Waarom worden mijn testmails die naar mij in Gmail zijn verzonden, weergegeven als "verdacht"</a>.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Als u e-mails wilt verzenden als vanuit Gmail, moet u <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">deze video bekijken</a></strong> of de stappen volgen onder <a href="#how-to-send-mail-as-using-gmail">How e-mails verzenden als via Gmail</a> hieronder.

</li></ol>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Gefeliciteerd!
</strong>
<span>
Je hebt alle stappen succesvol voltooid.
</span>
</div>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>
Optionele add-ons staan hieronder vermeld. Houd er rekening mee dat deze add-ons volledig optioneel zijn en mogelijk niet noodzakelijk. We wilden u in ieder geval aanvullende informatie verstrekken indien nodig.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Optionele add-on:
</strong>
<span>
Als je de functie <a class="alert-link" href="#how-to-send-mail-as-using-gmail">How om e-mail te verzenden als via Gmail</a> gebruikt, kun je jezelf toevoegen aan een toestemmingslijst. Zie <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">deze instructies van Gmail</a> over dit onderwerp.
</span>
</div>

### Kan ik meerdere MX-uitwisselingen en servers gebruiken voor geavanceerde doorsturing {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Ja, maar **u mag slechts één MX-exchange in uw DNS-records hebben vermeld**.

Probeer niet "Prioriteit" te gebruiken om meerdere MX-uitwisselingen te configureren.

In plaats daarvan moet u uw bestaande MX-exchange configureren om e-mail voor alle niet-overeenkomende aliassen door te sturen naar de exchanges van onze service (`mx1.forwardemail.net` en/of `mx2.forwardemail.net`).

Als u Google Workspace gebruikt en alle niet-overeenkomende aliassen naar onze service wilt doorsturen, raadpleeg dan <https://support.google.com/a/answer/6297084>.

Als u Microsoft 365 (Outlook) gebruikt en alle niet-overeenkomende aliassen naar onze service wilt doorsturen, raadpleeg dan <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> en <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### Hoe stel ik een vakantie-antwoord in (automatisch antwoord bij afwezigheid) {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

Ga naar <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mijn account <i class="fa fa-angle-right"></i>Domeinen</a> <i class="fa fa-angle-right"></i> Aliassen en maak of bewerk de alias waarvoor u een vakantie-autoresponder wilt configureren.

U kunt een begindatum, einddatum, onderwerp en bericht configureren en deze op elk gewenst moment in- of uitschakelen:

* Onderwerp en bericht in platte tekst worden momenteel ondersteund (intern gebruiken we het `striptags`-pakket om HTML te verwijderen).
* Onderwerp is beperkt tot 100 tekens.
* Bericht is beperkt tot 1000 tekens.
* Voor de installatie is configuratie voor uitgaande SMTP vereist (u moet bijvoorbeeld DKIM-, DMARC- en Return-Path DNS-records instellen).
* Ga naar <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Instellingen <i class="fa fa-angle-right"></i> Configuratie voor uitgaande SMTP en volg de installatie-instructies.
* De afwezigheidsfunctie kan niet worden ingeschakeld voor wereldwijde vanity-domeinnamen (bijvoorbeeld [wegwerpadressen](/disposable-addresses) wordt niet ondersteund).
* De vakantieantwoorder kan niet worden ingeschakeld voor aliassen met een wildcard/catch-all (`*`) of reguliere expressies.

In tegenstelling tot e-mailsystemen zoals `postfix` (die bijvoorbeeld de vakantiefilterextensie `sieve` gebruiken) voegt Forward Email automatisch uw DKIM-handtekening toe, biedt een dummy-proof van verbindingsproblemen bij het versturen van vakantieantwoorden (bijvoorbeeld vanwege veelvoorkomende SSL/TLS-verbindingsproblemen en verouderde, beheerde servers) en ondersteunt zelfs Open WKD- en PGP-versleuteling voor vakantieantwoorden.

<!--
* Om misbruik te voorkomen, wordt er voor elk verzonden bericht met een afwezigheidsbericht 1 uitgaand SMTP-tegoed afgetrokken.
* Alle betaalde accounts bevatten standaard 300 tegoeden per dag. Neem contact met ons op als u meer nodig heeft.
-->

1. We verzenden slechts één keer per [op de toelatingslijst geplaatst](#do-you-have-an-allowlist)-afzender, elke 4 dagen (vergelijkbaar met het gedrag van Gmail).

* Onze Redis-cache gebruikt een vingerafdruk van `alias_id` en `sender`, waarbij `alias_id` de alias MongoDB-ID is en `sender` het afzenderadres (indien op de whitelist) of het rootdomein in het afzenderadres (indien niet op de whitelist). Voor de eenvoud is de geldigheidsduur van deze vingerafdruk in de cache ingesteld op 4 dagen.

* Onze aanpak waarbij het root-domein wordt gebruikt dat is geparseerd in het Van-adres voor afzenders die niet op de toegestane lijst staan, voorkomt misbruik door relatief onbekende afzenders (bijvoorbeeld kwaadwillende actoren) door het overspoelen van automatische antwoordberichten.

2. Wij versturen alleen wanneer MAIL FROM en/of From niet leeg is en geen [gebruikersnaam postmeester](#what-are-postmaster-addresses) (het gedeelte vóór de @ in een e-mail) bevat (hoofdlettergevoelig).

3. We versturen geen e-mail als het oorspronkelijke bericht een van de volgende headers bevat (hoofdlettergevoelig):

* Header van `auto-submitted` met een waarde die niet gelijk is aan `no`.
* Header van `x-auto-response-suppress` met een waarde van `dr`, `autoreply`, `auto-reply`, `auto_reply` of `all`.
* Header van `list-id`, `list-subscribe`, `no`0, `no`1, `no`2, `no`3, `no`4, `no`5, `no`6 of `no`7 (ongeacht de waarde).
* Header van `no`8 met een waarde van `no`9, `x-auto-response-suppress`0, `x-auto-response-suppress`1, `x-auto-response-suppress`2 of `x-auto-response-suppress`3.

4. We versturen niets als het MAIL FROM- of Van-e-mailadres eindigt op `+donotreply`, `-donotreply`, `+noreply` of `-noreply`.

5. We versturen geen e-mail als het Van-e-mailadres als gebruikersnaam `mdaemon` heeft en de hoofdletterongevoelige header `X-MDDSN-Message` is.

6. We versturen niets als er een hoofdletterongevoelige `content-type` header van `multipart/report` is.

### Hoe stel ik SPF in voor het doorsturen van e-mail {#how-do-i-set-up-spf-for-forward-email}

Stel via de DNS-beheerpagina van uw registrar het volgende <strong class="notranslate">TXT</strong>-record in:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Naam/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Type</th>
<th>Antwoord/Waarde</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", of leeg</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Belangrijk:
</strong>
<span>
Als u Gmail (bijv. E-mail verzenden als) of G Suite gebruikt, moet u <code>include:_spf.google.com</code> aan de bovenstaande waarde toevoegen, bijvoorbeeld:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Belangrijk:
</strong>
<span>
Als u Microsoft Outlook of Live.com gebruikt, moet u <code>include:spf.protection.outlook.com</code> toevoegen aan uw SPF <strong class="notranslate">TXT</strong>-record, bijvoorbeeld:
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
Als u al een vergelijkbare regel met "v=spf1" heeft, moet u <code>include:spf.forwardemail.net</code> direct vóór alle bestaande "include:host.com"-records en vóór "-all" in dezelfde regel toevoegen, bijvoorbeeld:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
Houd er rekening mee dat er een verschil is tussen "-all" en "~all". De "-" geeft aan dat de SPF-controle moet MISLUKT als deze niet overeenkomt, en "~" geeft aan dat de SPF-controle moet SOFTFAILEN. We raden aan de "-all"-aanpak te gebruiken om domeinvervalsing te voorkomen.
<br /><br />
Mogelijk moet u ook de SPF-record toevoegen van de host waarvan u e-mail verzendt (bijv. Outlook).
</span>
</div>

### Hoe stel ik DKIM in voor het doorsturen van e-mail {#how-do-i-set-up-dkim-for-forward-email}

Ga naar <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mijn account <i class="fa fa-angle-right"></i>Domeinen</a> <i class="fa fa-angle-right"></i>Instellingen <i class="fa fa-angle-right"></i>Uitgaande SMTP-configuratie en volg de installatie-instructies.

### Hoe stel ik DMARC in voor het doorsturen van e-mails {#how-do-i-set-up-dmarc-for-forward-email}

Ga naar <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mijn account <i class="fa fa-angle-right"></i>Domeinen</a> <i class="fa fa-angle-right"></i>Instellingen <i class="fa fa-angle-right"></i>Uitgaande SMTP-configuratie en volg de installatie-instructies.

### Hoe verbind en configureer ik mijn contacten {#how-do-i-connect-and-configure-my-contacts}

**Om uw contacten te configureren, gebruikt u de CardDAV-URL van:** `https://carddav.forwardemail.net` (of gewoon `carddav.forwardemail.net` als uw klant dit toestaat)

### Hoe verbind en configureer ik mijn agenda's {#how-do-i-connect-and-configure-my-calendars}

**Om uw agenda te configureren, gebruikt u de CalDAV-URL van:** `https://caldav.forwardemail.net` (of gewoon `caldav.forwardemail.net` als uw client dit toestaat)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Voorbeeldinstallatie voor het doorsturen van e-mail in de agenda met CalDAV Thunderbird" />

### Hoe voeg ik meer agenda's toe en beheer ik bestaande agenda's {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Als u extra agenda's wilt toevoegen, voegt u gewoon een nieuwe agenda-URL toe: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**Vervang `calendar-name` met de gewenste agendanaam**)

U kunt de naam en kleur van een agenda wijzigen nadat u deze hebt aangemaakt. Gebruik hiervoor uw favoriete agenda-applicatie (bijvoorbeeld Apple Mail of [Dondervogel](https://thunderbird.net)).

### Hoe stel ik SRS in voor het doorsturen van e-mail {#how-do-i-set-up-srs-for-forward-email}

Wij configureren [Herschrijfschema voor afzender](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") automatisch – u hoeft dit niet zelf te doen.

### Hoe stel ik MTA-STS in voor het doorsturen van e-mail {#how-do-i-set-up-mta-sts-for-forward-email}

Raadpleeg [onze sectie over MTA-STS](#do-you-support-mta-sts) voor meer informatie.

### Hoe voeg ik een profielfoto toe aan mijn e-mailadres {#how-do-i-add-a-profile-picture-to-my-email-address}

Als u Gmail gebruikt, volgt u onderstaande stappen:

1. Ga naar <https://google.com> en meld je af bij alle e-mailaccounts.
2. Klik op 'Aanmelden' en klik in de vervolgkeuzelijst op 'Ander account'.
3. Selecteer 'Een ander account gebruiken'.
4. Selecteer 'Account aanmaken'.
5. Selecteer 'Mijn huidige e-mailadres gebruiken'.
6. Voer je e-mailadres voor je aangepaste domeinnaam in.
7. Haal de verificatiemail op die naar je e-mailadres is verzonden.
8. Voer de verificatiecode uit deze e-mail in.
9. Vul de profielgegevens voor je nieuwe Google-account in.
10. Ga akkoord met alle privacy- en gebruiksvoorwaarden.
11. Ga naar <https://google.com> en klik rechtsboven op je profielpictogram en vervolgens op de knop 'Wijzigen'.
12. Upload een nieuwe foto of avatar voor je account.
13. Het duurt ongeveer 1-2 uur voordat de wijzigingen zijn doorgevoerd, maar soms kan dit erg snel zijn.
14. Stuur een testmail en de profielfoto zou moeten verschijnen.

## Geavanceerde functies {#advanced-features}

### Ondersteunt u nieuwsbrieven of mailinglijsten voor marketinggerelateerde e-mails? {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Ja, u kunt meer lezen op <https://forwardemail.net/guides/newsletter-with-listmonk>.

Houd er rekening mee dat Forward Email een handmatig beoordelingsproces per domein hanteert voor de goedkeuring van **nieuwsbrieven** om de IP-reputatie te behouden en de afleverbaarheid te garanderen. Stuur een e-mail naar <support@forwardemail.net> of open een [hulpverzoek](https://forwardemail.net/help) voor goedkeuring. Dit duurt doorgaans minder dan 24 uur en de meeste verzoeken worden binnen 1-2 uur gehonoreerd. In de nabije toekomst willen we dit proces direct maken met extra spamcontroles en waarschuwingen. Dit proces zorgt ervoor dat uw e-mails de inbox bereiken en niet als spam worden gemarkeerd.

### Ondersteunt u het verzenden van e-mail met API {#do-you-support-sending-email-with-api}

Ja, vanaf mei 2023 ondersteunen we het versturen van e-mail met API als add-on voor alle betalende gebruikers.

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Belangrijk:
</strong>
<span>
Zorg ervoor dat u onze <a href="/terms" class="alert-link" target="_blank">Voorwaarden</a>, <a href="/privacy" class="alert-link" target="_blank">Privacybeleid</a> en <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Uitgaande SMTP-limieten</a> hebt gelezen - uw gebruik wordt beschouwd als erkenning en akkoord.
</span>
</div>

Bekijk het gedeelte over [E-mails](/email-api#outbound-emails) in onze API-documentatie voor opties, voorbeelden en meer inzicht.

Om uitgaande e-mail te versturen via onze API, moet u uw API-token gebruiken dat beschikbaar is onder [Mijn beveiliging](/my-account/security).

### Ondersteunt u het ontvangen van e-mail met IMAP {#do-you-support-receiving-email-with-imap}

Ja, vanaf 16 oktober 2023 ondersteunen we het ontvangen van e-mail via IMAP als add-on voor alle betalende gebruikers. **Lees ons uitgebreide artikel** over [hoe onze gecodeerde SQLite-mailboxopslagfunctie werkt](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="imap-instructies">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Belangrijk:
</strong>
<span>
Lees onze <a href="/terms" class="alert-link" target="_blank">Voorwaarden</a> en ons <a href="/privacy" class="alert-link" target="_blank">Privacybeleid</a> – uw gebruik wordt beschouwd als erkenning en instemming.
</span>
</div>

1. Maak een nieuwe alias voor uw domein onder <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mijn account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Aliassen (bijv. <code><hello@example.com></code>)

2. Klik op <strong class="text-success"><i class="fa fa-key"></i>Wachtwoord genereren</strong> naast de zojuist aangemaakte alias. Kopieer het gegenereerde wachtwoord naar uw klembord en bewaar het veilig op het scherm.

3. Voeg via uw favoriete e-mailapp een account toe of configureer deze met uw nieuwe alias (bijv. <code><hello@example.com></code>).
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>We raden aan om <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a> en <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, of <a href="/blog/open-source" class="alert-link" target="_blank">een open-source en privacygericht alternatief</a>.</span>
</div>

4. Wanneer u wordt gevraagd om de IMAP-servernaam, voert u `imap.forwardemail.net` in

5. Wanneer u wordt gevraagd naar de IMAP-serverpoort, voert u `993` (SSL/TLS) in – zie indien nodig [alternatieve IMAP-poorten](/faq#what-are-your-imap-server-configuration-settings).
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>Als u Thunderbird gebruikt, zorg er dan voor dat "Verbindingsbeveiliging" is ingesteld op "SSL/TLS" en de authenticatiemethode op "Normaal wachtwoord".</span>
</div>

6. Wanneer u wordt gevraagd om het wachtwoord voor de IMAP-server, plakt u het wachtwoord uit <strong class="text-success"><i class="fa fa-key"></i> Wachtwoord genereren</strong> in stap 2 hierboven.

7. **Sla uw instellingen op** – als u problemen ondervindt, neem dan <a href="/help">contact met ons op</a>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Gefeliciteerd!
</strong>
<span>
Je hebt alle stappen succesvol voltooid.
</span>
</div>
</div>

</div>

### Ondersteunt u POP3 {#do-you-support-pop3}

Ja, vanaf 4 december 2023 ondersteunen we [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) als add-on voor alle betalende gebruikers. **Lees ons uitgebreide artikel** over [hoe onze gecodeerde SQLite-mailboxopslagfunctie werkt](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="pop3-instructies">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Belangrijk:
</strong>
<span>
Lees onze <a href="/terms" class="alert-link" target="_blank">Voorwaarden</a> en ons <a href="/privacy" class="alert-link" target="_blank">Privacybeleid</a> – uw gebruik wordt beschouwd als erkenning en instemming.
</span>
</div>

1. Maak een nieuwe alias voor uw domein onder <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mijn account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Aliassen (bijv. <code><hello@example.com></code>)

2. Klik op <strong class="text-success"><i class="fa fa-key"></i>Wachtwoord genereren</strong> naast de zojuist aangemaakte alias. Kopieer het gegenereerde wachtwoord naar uw klembord en bewaar het veilig op het scherm.

3. Voeg via uw favoriete e-mailapp een account toe of configureer deze met uw nieuwe alias (bijv. <code><hello@example.com></code>).
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>We raden aan om <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a> en <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, of <a href="/blog/open-source" class="alert-link" target="_blank">een open-source en privacygericht alternatief</a>.</span>
</div>

4. Wanneer u wordt gevraagd om de POP3-servernaam, voert u `pop3.forwardemail.net` in

5. Wanneer u wordt gevraagd naar de POP3-serverpoort, voert u `995` (SSL/TLS) in – zie indien nodig [alternatieve POP3-poorten](/faq#what-are-your-pop3-server-configuration-settings).
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>Als u Thunderbird gebruikt, zorg er dan voor dat "Verbindingsbeveiliging" is ingesteld op "SSL/TLS" en de authenticatiemethode op "Normaal wachtwoord".</span>
</div>

6. Wanneer u wordt gevraagd om het wachtwoord van de POP3-server, plakt u het wachtwoord uit <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> in stap 2 hierboven.

7. **Sla uw instellingen op** – als u problemen ondervindt, neem dan <a href="/help">contact met ons op</a>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Gefeliciteerd!
</strong>
<span>
Je hebt alle stappen succesvol voltooid.
</span>
</div>
</div>

</div>

### Ondersteunt u kalenders (CalDAV) {#do-you-support-calendars-caldav}

Ja, sinds 5 februari 2024 hebben we deze functie toegevoegd. Onze server is `caldav.forwardemail.net` en wordt ook gemonitord op onze <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statuspagina</a>.

Het ondersteunt zowel IPv4 als IPv6 en is beschikbaar via poort `443` (HTTPS).

| Login | Voorbeeld | Beschrijving |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gebruikersnaam | `user@example.com` | E-mailadres van een alias die bestaat voor het domein op <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a>. |
| Wachtwoord | `************************` | Aliasspecifiek gegenereerd wachtwoord. |

Om gebruik te kunnen maken van de agendaondersteuning moet de **gebruiker** het e-mailadres zijn van een alias die bestaat voor het domein op <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> – en het **wachtwoord** moet een aliasspecifiek wachtwoord zijn dat is gegenereerd.

### Ondersteunt u contacten (CardDAV) {#do-you-support-contacts-carddav}

Ja, sinds 12 juni 2025 hebben we deze functie toegevoegd. Onze server is `carddav.forwardemail.net` en wordt ook gemonitord op onze <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statuspagina</a>.

Het ondersteunt zowel IPv4 als IPv6 en is beschikbaar via poort `443` (HTTPS).

| Login | Voorbeeld | Beschrijving |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gebruikersnaam | `user@example.com` | E-mailadres van een alias die bestaat voor het domein op <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a>. |
| Wachtwoord | `************************` | Aliasspecifiek gegenereerd wachtwoord. |

Om contactondersteuning te kunnen gebruiken, moet de **gebruiker** het e-mailadres zijn van een alias die bestaat voor het domein op <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> – en het **wachtwoord** moet een aliasspecifiek wachtwoord zijn dat is gegenereerd.

### Ondersteunt u het verzenden van e-mail met SMTP {#do-you-support-sending-email-with-smtp}

Ja, vanaf mei 2023 ondersteunen we het versturen van e-mail met SMTP als add-on voor alle betalende gebruikers.

<div id="smtp-instructies">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Belangrijk:
</strong>
<span>
Zorg ervoor dat u onze <a href="/terms" class="alert-link" target="_blank">Voorwaarden</a>, <a href="/privacy" class="alert-link" target="_blank">Privacybeleid</a> en <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Uitgaande SMTP-limieten</a> hebt gelezen - uw gebruik wordt beschouwd als erkenning en akkoord.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Belangrijk:
</strong>
<span>
Als u Gmail gebruikt, raadpleeg dan onze <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">handleiding 'E-mail verzenden als' met Gmail</a>. Bent u een ontwikkelaar, raadpleeg dan onze <a class="alert-link" href="/email-api#outbound-emails" target="_blank">documentatie over de e-mail-API</a>.
</span>
</div>

1. Ga naar <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mijn account <i class="fa fa-angle-right"></i>Domeinen</a> <i class="fa fa-angle-right"></i>Instellingen <i class="fa fa-angle-right"></i>Uitgaande SMTP-configuratie en volg de installatie-instructies

2. Maak een nieuwe alias voor uw domein onder <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mijn account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Aliassen (bijv. <code><hello@example.com></code>)

3. Klik op <strong class="text-success"><i class="fa fa-key"></i>Wachtwoord genereren</strong> naast de zojuist aangemaakte alias. Kopieer het gegenereerde wachtwoord naar uw klembord en bewaar het veilig op het scherm.

4. Voeg via uw favoriete e-mailapp een account toe of configureer deze met uw nieuwe alias (bijv. <code><hello@example.com></code>).
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>We raden aan om <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a> en <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, of <a href="/blog/open-source" class="alert-link" target="_blank">een open-source en privacygericht alternatief</a>.</span>
</div>

5. Wanneer u wordt gevraagd om de SMTP-servernaam, voert u `smtp.forwardemail.net` in

6. Wanneer u wordt gevraagd naar de SMTP-serverpoort, voert u `465` (SSL/TLS) in – zie indien nodig [alternatieve SMTP-poorten](/faq#what-are-your-smtp-server-configuration-settings).
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>Als u Thunderbird gebruikt, zorg er dan voor dat "Verbindingsbeveiliging" is ingesteld op "SSL/TLS" en de authenticatiemethode op "Normaal wachtwoord".</span>
</div>

7. Wanneer u wordt gevraagd om het wachtwoord voor de SMTP-server, plakt u het wachtwoord uit <strong class="text-success"><i class="fa fa-key"></i> Wachtwoord genereren</strong> in stap 3 hierboven.

8. **Sla uw instellingen op en verstuur uw eerste test-e-mail** – als u problemen ondervindt, neem dan <a href="/help">contact met ons op</a>

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Belangrijk:
</strong>
<span>
Houd er rekening mee dat we, om de reputatie van IP-adressen te behouden en de afleverbaarheid te garanderen, een handmatig beoordelingsproces per domein hanteren voor de goedkeuring van uitgaande SMTP-berichten. Dit duurt doorgaans minder dan 24 uur, waarbij de meeste verzoeken binnen 1-2 uur worden gehonoreerd. In de nabije toekomst streven we ernaar dit proces direct te maken met extra spamcontroles en waarschuwingen. Dit proces zorgt ervoor dat uw e-mails de inbox bereiken en niet als spam worden gemarkeerd.
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Gefeliciteerd!
</strong>
<span>
Je hebt alle stappen succesvol voltooid.
</span>
</div>
</div>

</div>

### Ondersteunt u OpenPGP/MIME, end-to-end-encryptie ("E2EE") en Web Key Directory ("WKD") {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Ja, we ondersteunen [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [end-to-end-encryptie ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption) en de detectie van openbare sleutels met [Websleutelmap ("WKD")](https://wiki.gnupg.org/WKD). U kunt OpenPGP configureren met [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) of [host uw eigen sleutels zelf](https://wiki.gnupg.org/WKDHosting) (zie [deze gist voor WKD-serverinstallatie](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* WKD-lookups worden 1 uur gecached om tijdige e-mailbezorging te garanderen. Als u uw WKD-sleutel toevoegt, wijzigt of verwijdert, stuur ons dan een e-mail op `support@forwardemail.net` met uw e-mailadres. Dan kunnen we de cache handmatig wissen.

* We ondersteunen PGP-versleuteling voor berichten die worden doorgestuurd via WKD-lookups of met een geüploade PGP-sleutel in onze interface.
* Geüploade sleutels hebben voorrang zolang het PGP-selectievakje is ingeschakeld/aangevinkt.
* Berichten die naar webhooks worden verzonden, worden momenteel niet met PGP versleuteld.
* Als u meerdere aliassen hebt die overeenkomen met een bepaald doorstuuradres (bijv. regex/wildcard/exacte combinatie) en als meer dan één van deze aliassen een geüploade PGP-sleutel bevat en PGP is aangevinkt, sturen we u een foutmelding per e-mail en versleutelen we het bericht niet met uw geüploade PGP-sleutel. Dit komt zeer zelden voor en is meestal alleen van toepassing op geavanceerde gebruikers met complexe aliasregels.
**PGP-encryptie wordt niet toegepast op e-maildoorsturing via onze MX-servers als de afzender een DMARC-beleid van afwijzing hanteert. Als u PGP-encryptie voor *alle* e-mail nodig hebt, raden we u aan onze IMAP-service te gebruiken en uw PGP-sleutel te configureren voor uw alias voor inkomende e-mail.**

**U kunt uw Web Key Directory-instelling valideren op <https://wkd.chimbosonic.com/> (open-source) of <https://www.webkeydirectory.com/> (proprietary).**

<div class="alert my-3 alert-success">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Automatische versleuteling:
</strong>
<span>Als u onze <a href="#do-you-support-sending-email-with-smtp" class="alert-link">uitgaande SMTP-service</a> gebruikt en ongecodeerde berichten verzendt, proberen we automatisch berichten per ontvanger te versleutelen met behulp van de <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Key Directory ("WKD")</a>.</span>
</div>

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Belangrijk:
</strong>
<span>
Je moet alle volgende stappen volgen om OpenPGP in te schakelen voor je aangepaste domeinnaam.
</span>
</div>

1. Download en installeer hieronder de aanbevolen plug-in van uw e-mailclient:

| E-mailclient | Platform | Aanbevolen plug-in | Notities |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dondervogel | Bureaublad | [Configure OpenPGP in Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird biedt ingebouwde ondersteuning voor OpenPGP. |
| Gmail | Browser | [Mailvelope](https://mailvelope.com/) of [FlowCrypt](https://flowcrypt.com/download) (propriëtaire licentie) | Gmail ondersteunt geen OpenPGP, maar u kunt de open-source plugin [Mailvelope](https://mailvelope.com/) of [FlowCrypt](https://flowcrypt.com/download) downloaden. |
| Apple Mail | macOS | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) | Apple Mail ondersteunt geen OpenPGP, maar u kunt de open-source plugin [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) downloaden. |
| Apple Mail | iOS | [PGPro](https://github.com/opensourceios/PGPro/) of [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (propriëtaire licentie) | Apple Mail ondersteunt geen OpenPGP, maar u kunt de open-source plugin [PGPro](https://github.com/opensourceios/PGPro/) of [FlowCrypt](https://flowcrypt.com/download) downloaden. |
| Vooruitzichten | Ramen | [gpg4win](https://www.gpg4win.de/index.html) | De desktop-e-mailclient van Outlook ondersteunt geen OpenPGP, maar u kunt de open-source-plug-in [gpg4win](https://www.gpg4win.de/index.html) downloaden. |
| Vooruitzichten | Browser | [Mailvelope](https://mailvelope.com/) of [FlowCrypt](https://flowcrypt.com/download) (propriëtaire licentie) | De webgebaseerde e-mailclient van Outlook ondersteunt geen OpenPGP, maar u kunt de open-source plug-in [Mailvelope](https://mailvelope.com/) of [FlowCrypt](https://flowcrypt.com/download) downloaden. |
| Android | Mobiel | [OpenKeychain](https://www.openkeychain.org/) of [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) | [Android mail clients](/blog/open-source/android-email-clients) zoals [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) en [FairEmail](https://github.com/M66B/FairEmail) ondersteunen beide de open-source plugin [OpenKeychain](https://www.openkeychain.org/). U kunt ook de open-source plugin (met propriëtaire licentie) [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) gebruiken. |
| Google Chrome | Browser | [Mailvelope](https://mailvelope.com/) of [FlowCrypt](https://flowcrypt.com/download) (propriëtaire licentie) | U kunt de open-source browserextensie [Mailvelope](https://mailvelope.com/) of [FlowCrypt](https://flowcrypt.com/download) downloaden. |
| Mozilla Firefox | Browser | [Mailvelope](https://mailvelope.com/) of [FlowCrypt](https://flowcrypt.com/download) (propriëtaire licentie) | U kunt de open-source browserextensie [Mailvelope](https://mailvelope.com/) of [FlowCrypt](https://flowcrypt.com/download) downloaden. |
| Microsoft Edge | Browser | [Mailvelope](https://mailvelope.com/) | U kunt de open-source browserextensie [Mailvelope](https://mailvelope.com/) downloaden. |
| Moedig | Browser | [Mailvelope](https://mailvelope.com/) of [FlowCrypt](https://flowcrypt.com/download) (propriëtaire licentie) | U kunt de open-source browserextensie [Mailvelope](https://mailvelope.com/) of [FlowCrypt](https://flowcrypt.com/download) downloaden. |
| Balsa | Bureaublad | [Configure OpenPGP in Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING) | Balsa heeft ingebouwde ondersteuning voor OpenPGP. |
| KMail | Bureaublad | [Configure OpenPGP in KMail](https://userbase.kde.org/KMail/PGP_MIME) | KMail heeft ingebouwde ondersteuning voor OpenPGP. |
| GNOME-evolutie | Bureaublad | [Configure OpenPGP in Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en) | GNOME Evolution heeft ingebouwde ondersteuning voor OpenPGP. |
| Terminal | Bureaublad | [Configure gpg in Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key) | U kunt de open-source [gpg command line tool](https://www.gnupg.org/download/) gebruiken om een nieuwe sleutel te genereren vanaf de opdrachtregel. |

2. Open de plug-in, maak uw openbare sleutel aan en configureer uw e-mailclient om deze te gebruiken.

3. Upload uw openbare sleutel op <https://keys.openpgp.org/upload>.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>Ga naar <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a> om je sleutel in de toekomst te beheren.</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Optionele add-on:
</strong>
<span>
Als u onze <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">versleutelde opslag (IMAP/POP3)</a> gebruikt en wilt dat <i>alle</i> e-mails die in uw (reeds versleutelde) SQLite-database zijn opgeslagen, worden versleuteld met uw openbare sleutel, ga dan naar <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mijn account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Aliassen (bijv. <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Bewerk <i class="fa fa-angle-right"></i> OpenPGP en upload je openbare sleutel.
</span>
</div>

4. Voeg een nieuw `CNAME`-record toe aan uw domeinnaam (bijv. `example.com`):

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Naam/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Type</th>
<th>Antwoord/Waarde</th>
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
<span>Als je alias onze <a class="alert-link" href="/disposable-addresses" target="_blank">vanity/disposable domeinen</a> gebruikt (bijv. <code>hideaddress.net</code>), kun je deze stap overslaan.</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Gefeliciteerd!
</strong>
<span>
Je hebt alle stappen succesvol voltooid.
</span>
</div>
</div>

### Ondersteunt u MTA-STS {#do-you-support-mta-sts}

Ja, vanaf 2 maart 2023 ondersteunen we [MTA-STS](https://www.hardenize.com/blog/mta-sts). U kunt [deze sjabloon](https://github.com/jpawlowski/mta-sts.template) gebruiken als u het op uw domein wilt inschakelen.

Onze configuratie is openbaar te vinden op GitHub op <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### Ondersteunt u wachtwoorden en WebAuthn {#do-you-support-passkeys-and-webauthn}

Ja! Vanaf 13 december 2023 hebben we ondersteuning toegevoegd voor de toegangssleutels [vanwege de grote vraag](https://github.com/orgs/forwardemail/discussions/182).

Met wachtwoordsleutels kunt u veilig inloggen zonder dat u een wachtwoord of twee-factor-authenticatie nodig hebt.

U kunt uw identiteit verifiëren met aanraking, gezichtsherkenning, een apparaatgebaseerd wachtwoord of een pincode.

U kunt met ons maximaal 30 toegangscodes tegelijk beheren, zodat u eenvoudig op al uw apparaten kunt inloggen.

Meer informatie over toegangscodes vindt u via de volgende links:

* [Meld u aan bij uw applicaties en websites met wachtwoorden](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [Gebruik toegangscodes om in te loggen bij apps en websites op de iPhone](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Wikipedia-artikel over toegangssleutels](https://en.wikipedia.org/wiki/Passkey_\(credential\))

### Ondersteunt u best practices voor e-mail {#do-you-support-email-best-practices}

Ja. We hebben ingebouwde ondersteuning voor SPF, DKIM, DMARC, ARC en SRS in al onze pakketten. We hebben ook uitgebreid samengewerkt met de oorspronkelijke auteurs van deze specificaties en andere e-mailexperts om perfectie en een hoge afleverbaarheid te garanderen.

### Ondersteunt u bounce-webhooks? {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
Zoekt u documentatie over e-mailwebhooks? Zie <a href="/faq#do-you-support-webhooks" class="alert-link">Ondersteunen jullie webhooks?</a> voor meer informatie.
<span>
</span>
</div>

Ja, vanaf 14 augustus 2024 hebben we deze functie toegevoegd. Je kunt nu naar Mijn Account → Domeinen → Instellingen → Bounce Webhook URL gaan en een `http://` of `https://` URL configureren waarnaar we een `POST`-verzoek sturen wanneer uitgaande SMTP-e-mails bouncen.

Dit is handig om uw uitgaande SMTP te beheren en te controleren. U kunt het ook gebruiken om abonnees te beheren, u af te melden en te detecteren wanneer er bounces optreden.

Bounce webhook-payloads worden verzonden als JSON met de volgende eigenschappen:

* `email_id` (tekenreeks) - e-mailadres dat overeenkomt met een e-mail in Mijn Account → E-mails (uitgaande SMTP)
* `list_id` (tekenreeks) - de waarde in de header `List-ID` (hoofdlettergevoelig), indien van toepassing, van de oorspronkelijke uitgaande e-mail
* `list_unsubscribe` (tekenreeks) - de waarde in de header `List-Unsubscribe` (hoofdlettergevoelig), indien van toepassing, van de oorspronkelijke uitgaande e-mail
* `feedback_id` (tekenreeks) - de waarde in de header `Feedback-ID` (hoofdlettergevoelig), indien van toepassing, van de oorspronkelijke uitgaande e-mail
* `recipient` (tekenreeks) - het e-mailadres van de ontvanger die de e-mail heeft teruggestuurd of een fout heeft veroorzaakt
* `message` (tekenreeks) - een gedetailleerde foutmelding voor de teruggestuurde e-mail
* `response` (Tekenreeks) - het SMTP-antwoordbericht
* `list_id`0 (Nummer) - de geparseerde SMTP-antwoordcode
* `list_id`1 (Tekenreeks) - als de antwoordcode afkomstig was van een vertrouwde bron, wordt deze waarde gevuld met de rootdomeinnaam (bijv. `list_id`2 of `list_id`3)
* `list_id`4 (Object) - een object met de volgende eigenschappen die de bounce- en afwijzingsstatus beschrijven: * `list_id`5 (Tekenreeks) - bounce-actie (bijv. `list_id`6)
* `list_id`7 (Tekenreeks) - bounce-reden (bijv. `list_id`8)
* `list_id`9 (Tekenreeks) - bounce-categorie (bijv. `List-ID`0)
* `List-ID`1 (Nummer) - bouncestatuscode (bijv. `List-ID`2)
* `List-ID`3 (Tekenreeks) - bouncecode van het antwoordbericht (bijv. `List-ID`4)
* `List-ID`5 (Nummer) - geparseerd regelnummer, indien van toepassing, `List-ID`6 (bijv. `List-ID`7)
* `List-ID`8 (Object) - sleutelwaardepaar van de headers voor de uitgaande e-mail
* `List-ID`9 (Tekenreeks) - `list_unsubscribe`0 geformatteerde datum waarop de bouncefout optrad

Bijvoorbeeld:

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

Hier zijn een paar aanvullende opmerkingen over bounce-webhooks:

* Als de webhook-payload een waarde van `list_id`, `list_unsubscribe` of `feedback_id` bevat, moet u passende maatregelen nemen om `recipient` indien nodig uit de lijst te verwijderen.
* Als de waarde van `bounce.category` een waarde van `"block"`, `"recipient"`, `"spam"` of `"virus"` was, moet u de gebruiker zeker uit de lijst verwijderen.
* Als u webhook-payloads moet verifiëren (om er zeker van te zijn dat ze daadwerkelijk van onze server komen), kunt u [het IP-adres van de externe client en de hostnaam van de client oplossen met behulp van een omgekeerde zoekopdracht](https://nodejs.org/api/dns.html#dnspromisesreverseip) gebruiken – dit zou `list_unsubscribe`0 moeten zijn.
* U kunt het IP-adres ook controleren met `list_unsubscribe`1. * Ga naar Mijn account → Domeinen → Instellingen → Verificatiesleutel voor webhook-handtekeningpayload om uw webhooksleutel te verkrijgen.
* U kunt deze sleutel om veiligheidsredenen op elk gewenst moment wijzigen.
* Bereken en vergelijk de waarde `list_unsubscribe`2 uit onze webhookaanvraag met de berekende bodywaarde met behulp van deze sleutel. Een voorbeeld hiervan is beschikbaar op `list_unsubscribe`3.
* Zie de discussie op <`list_unsubscribe`4 voor meer informatie.
* We wachten tot `list_unsubscribe`5 seconden totdat uw webhook-eindpunt reageert met een statuscode `list_unsubscribe`6 en we proberen het opnieuw tot `list_unsubscribe`7.
* Als we detecteren dat er een fout is opgetreden in uw bounce-webhook-URL terwijl we proberen er een aanvraag naartoe te sturen, sturen we u eenmaal per week een e-mail.

### Ondersteunt u webhooks? {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
Zoekt u documentatie over bounce-webhooks? Zie <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Ondersteunen jullie bounce-webhooks?</a> voor meer informatie.
<span>
</span>
</div>

Ja, sinds 15 mei 2020 hebben we deze functie toegevoegd. U kunt eenvoudig webhook(s) toevoegen, precies zoals u dat met elke ontvanger zou doen! Zorg ervoor dat het protocol "http" of "https" voor de URL van de webhook staat.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Verbeterde privacybescherming:
</strong>
<span>
Als u een betaald abonnement heeft (met verbeterde privacybescherming), ga dan naar <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mijn account <i class="fa fa-angle-right"></i> Domeinen</a> en klik op "Aliassen" naast uw domein om uw webhooks te configureren. Wilt u meer weten over betaalde abonnementen? Bekijk dan onze pagina <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Prijzen</a>. Anders kunt u de onderstaande instructies volgen.
</span>
</div>

Als u het gratis abonnement gebruikt, voegt u eenvoudig een nieuwe DNS <strong class="notranslate">TXT</strong>-record toe, zoals hieronder weergegeven:

Als ik bijvoorbeeld wil dat alle e-mails die naar `alias@example.com` gaan, worden doorgestuurd naar een nieuw test-eindpunt [verzoekbak](https://requestbin.com/r/en8pfhdgcculn?inspect):

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Naam/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Type</th>
<th>Antwoord/Waarde</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", of leeg</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

Of misschien wilt u dat alle e-mails die naar `example.com` gaan, naar dit eindpunt worden doorgestuurd:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Naam/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Type</th>
<th>Antwoord/Waarde</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", of leeg</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

**Hier zijn aanvullende opmerkingen over webhooks:**

* Als je webhook-payloads moet verifiëren (om er zeker van te zijn dat ze daadwerkelijk van onze server komen), kun je [het IP-adres van de externe client en de hostnaam van de client oplossen met behulp van een omgekeerde zoekopdracht](https://nodejs.org/api/dns.html#dnspromisesreverseip) gebruiken – dit zou `mx1.forwardemail.net` of `mx2.forwardemail.net` moeten zijn.
* Je kunt het IP-adres ook vergelijken met [onze gepubliceerde IP-adressen](#what-are-your-servers-ip-addresses).
* Als je een betaald abonnement hebt, ga dan naar Mijn Account → Domeinen → Instellingen → Verificatiesleutel voor webhook-handtekeningpayloads om je webhooksleutel te verkrijgen.
* Je kunt deze sleutel op elk moment wijzigen om veiligheidsredenen.
* Bereken en vergelijk de waarde `X-Webhook-Signature` uit onze webhook-aanvraag met de berekende body-waarde met behulp van deze sleutel. Een voorbeeld van hoe je dit kunt doen is beschikbaar op [dit Stack Overflow-bericht](https://stackoverflow.com/a/68885281).
* Zie de discussie op <https://github.com/forwardemail/free-email-forwarding/issues/235> voor meer informatie.
* Als een webhook niet reageert met een statuscode `200`, slaan we de reactie op in [foutenlogboek aangemaakt](#do-you-store-error-logs) – wat handig is voor foutopsporing.
* Webhook HTTP-verzoeken worden tot 3 keer per SMTP-verbindingspoging opnieuw geprobeerd, met een maximale time-out van 60 seconden per endpoint POST-verzoek. **Dit betekent niet dat er slechts 3 keer opnieuw wordt geprobeerd**, maar dat er continu opnieuw wordt geprobeerd door na de 3e mislukte HTTP POST-poging een SMTP-code 421 te sturen (die de afzender aangeeft dat er later opnieuw moet worden geprobeerd). Dit betekent dat de e-mail dagenlang continu opnieuw wordt geprobeerd totdat er een statuscode 200 is.
* We proberen automatisch opnieuw op basis van de standaardstatus- en foutcodes die in [de herhalingsmethode van de superagent](https://ladjs.github.io/superagent/#retrying-requests) worden gebruikt (wij zijn beheerders).
* We groeperen webhook HTTP-verzoeken naar hetzelfde endpoint in één verzoek in plaats van meerdere om resources te besparen en de responstijd te versnellen. Als u bijvoorbeeld een e-mail stuurt naar <webhook1@example.com>, <webhook2@example.com> en <webhook3@example.com>, en deze allemaal zijn geconfigureerd om dezelfde *exacte* eindpunt-URL te bereiken, wordt er slechts één verzoek gedaan. We groeperen op basis van exacte eindpuntmatching met strikte gelijkheid.
* Merk op dat we de "simpleParser"-methode van de `mx1.forwardemail.net`0-bibliotheek gebruiken om het bericht te parseren naar een JSON-vriendelijk object.
* De ruwe e-mailwaarde als een string wordt opgegeven als de eigenschap "raw".
* Authenticatieresultaten worden opgegeven als de eigenschappen "dkim", "spf", "arc", "dmarc" en "bimi".
* De geparseerde e-mailheaders worden opgegeven als de eigenschap "headers" – maar u kunt ook "headerLines" gebruiken voor eenvoudigere iteratie en parsing. * De gegroepeerde ontvangers voor deze webhook worden gegroepeerd en opgegeven als de eigenschap "recipients".
* De SMTP-sessiegegevens worden opgegeven als de eigenschap "session". Deze bevatten informatie over de afzender van het bericht, de aankomsttijd van het bericht, HELO en de hostnaam van de client. De waarde van de hostnaam van de client, `mx1.forwardemail.net`1, is ofwel de FQDN (van een omgekeerde PTR-opzoeking) of `mx1.forwardemail.net`2 tussen haakjes (bijv. `mx1.forwardemail.net`3).
* Als u snel de waarde van `mx1.forwardemail.net`4 wilt opvragen, kunt u de waarde van `mx1.forwardemail.net`5 gebruiken (zie het onderstaande voorbeeld). De header `mx1.forwardemail.net`6 is een header die we aan berichten toevoegen om te debuggen met de oorspronkelijke ontvanger (vóór gemaskeerde doorsturing) van het bericht. * Als u de eigenschappen `mx1.forwardemail.net`7 en/of `mx1.forwardemail.net`8 uit de payloadbody wilt verwijderen, voegt u eenvoudig `mx1.forwardemail.net`9, `mx2.forwardemail.net`0 of `mx2.forwardemail.net`1 toe aan uw webhook-eindpunt als querystringparameter (bijv. `mx2.forwardemail.net`2).
* Als er bijlagen zijn, worden deze toegevoegd aan de `mx2.forwardemail.net`3-array met bufferwaarden. U kunt ze terugparseren naar content met behulp van een JavaScript-aanpak, zoals:

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
Ben je benieuwd hoe de webhook-aanvraag eruitziet vanuit doorgestuurde e-mails? Hieronder vind je een voorbeeld!
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

### Ondersteunt u reguliere expressies of regex {#do-you-support-regular-expressions-or-regex}

Ja, sinds 27 september 2021 hebben we deze functie toegevoegd. U kunt eenvoudig reguliere expressies ("regex") schrijven om aliassen te matchen en substituties uit te voeren.

Aliassen die door reguliere expressies worden ondersteund, beginnen met `/` en eindigen met `/`. De ontvangers zijn e-mailadressen of webhooks. De ontvangers kunnen ook ondersteuning bieden voor regex-substitutie (bijv. `$1`, `$2`).

We ondersteunen twee reguliere expressievlaggen: `i` en `g`. De hoofdletterongevoelige vlag van `i` is een permanente standaard en wordt altijd gehandhaafd. De globale vlag van `g` kunt u zelf toevoegen door de extensie `/` te koppelen aan `/g`.

Houd er rekening mee dat we onze <a href="#can-i-disable-specific-aliases">disabled aliasfunctie</a> ook voor het ontvangersgedeelte ondersteunen met onze regex-ondersteuning.

Reguliere expressies worden niet ondersteund op <a href="/disposable-addresses" target="_blank">globale vanity-domeinen</a> (omdat dit een beveiligingslek kan zijn).

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Verbeterde privacybescherming:
</strong>
<span>
Als u een betaald abonnement heeft (met verbeterde privacybescherming), ga dan naar <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mijn account <i class="fa fa-angle-right"></i> Domeinen</a> en klik op "Aliassen" naast uw domein om reguliere expressies te configureren. Wilt u meer weten over betaalde abonnementen? Bekijk dan onze pagina <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Prijzen</a>. Anders kunt u de onderstaande instructies volgen.
</span>
</div>

Als u het gratis abonnement gebruikt, kunt u eenvoudig een nieuwe DNS <strong class="notranslate">TXT</strong>-record toevoegen met behulp van een of meer van de onderstaande voorbeelden:

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Eenvoudig voorbeeld:</strong> Als ik wil dat alle e-mails die naar `linus@example.com` of `torvalds@example.com` gaan, worden doorgestuurd naar `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Naam/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Type</th>
<th>Antwoord/Waarde</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", of leeg</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Voorbeeld van vervanging van voornaam en achternaam:</strong> Stel dat al uw bedrijfs-e-mailadressen het patroon `firstname.lastname@example.com` hebben. Als ik wil dat alle e-mailadressen met het patroon `firstname.lastname@example.com` worden doorgestuurd naar `firstname.lastname@company.com` met ondersteuning voor vervanging (<a href="https://regexr.com/66hnu" class="alert-link">test op RegExr bekijken</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Naam/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Type</th>
<th>Antwoord/Waarde</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", of leeg</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Voorbeeld van Plus-symboolfiltersubstitutie:</strong> Als ik wil dat alle e-mails die naar `info@example.com` of `support@example.com` gaan, worden doorgestuurd naar respectievelijk `user+info@gmail.com` of `user+support@gmail.com` (met substitutieondersteuning) (<a href="https://regexr.com/66ho7" class="alert-link">test op RegExr bekijken</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Naam/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Type</th>
<th>Antwoord/Waarde</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", of leeg</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Voorbeeld van webhook-querystringvervanging:</strong> Misschien wilt u dat alle e-mails die naar `example.com` gaan, naar een <a href="#do-you-support-webhooks" class="alert-link">webhook</a> gaan en een dynamische querystringsleutel van "to" hebben met een waarde van het gebruikersnaamgedeelte van het e-mailadres (<a href="https://regexr.com/66ho4" class="alert-link">test op RegExr bekijken</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Naam/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Type</th>
<th>Antwoord/Waarde</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", of leeg</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Voorbeeld van stille weigering:</strong> Als u wilt dat alle e-mails die aan een bepaald patroon voldoen, worden uitgeschakeld en stille weigering (het lijkt voor de afzender alsof het bericht succesvol is verzonden, maar het bericht gaat in werkelijkheid nergens heen) met statuscode `250` (zie <a href="#can-i-disable-specific-aliases" class="alert-link">Kan ik specifieke aliassen uitschakelen</a>), gebruik dan dezelfde aanpak met een enkel uitroepteken "!". Dit geeft de afzender aan dat het bericht succesvol is afgeleverd, maar dat het in werkelijkheid nergens heen is gegaan (bijv. blackhole of `/dev/null`).
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Naam/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Type</th>
<th>Antwoord/Waarde</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", of leeg</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Voorbeeld van zachte weigering:</strong> Als u wilt dat alle e-mails die aan een bepaald patroon voldoen, worden uitgeschakeld en zacht worden geweigerd met statuscode `421` (zie <a href="#can-i-disable-specific-aliases" class="alert-link">Kan ik specifieke aliassen uitschakelen</a>), gebruik dan dezelfde aanpak met een dubbel uitroepteken "!!". Dit geeft de afzender aan dat hij zijn e-mail opnieuw moet proberen. E-mails naar deze alias worden ongeveer 5 dagen opnieuw geprobeerd en vervolgens definitief geweigerd.
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Naam/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Type</th>
<th>Antwoord/Waarde</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", of leeg</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Voorbeeld van harde weigering:</strong> Als u wilt dat alle e-mails die aan een bepaald patroon voldoen, worden uitgeschakeld en hard worden geweigerd met statuscode `550` (zie <a href="#can-i-disable-specific-aliases" class="alert-link">Kan ik specifieke aliassen uitschakelen</a>), gebruik dan dezelfde aanpak met een drievoudig uitroepteken "!!!". Dit geeft de afzender een permanente fout aan en e-mails worden niet opnieuw geprobeerd; ze worden geweigerd voor deze alias.
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Naam/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Type</th>
<th>Antwoord/Waarde</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", of leeg</em></td>
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
Wil je weten hoe je een reguliere expressie schrijft of wil je je vervanging testen? Ga dan naar de gratis website voor het testen van reguliere expressies <a href="https://regexr.com" class="alert-link">RegExr</a> op <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
<span>
</span>
</div>

### Wat zijn uw uitgaande SMTP-limieten {#what-are-your-outbound-smtp-limits}

We hanteren een limiet van 300 uitgaande SMTP-berichten per dag voor gebruikers en domeinen. Dit komt neer op gemiddeld meer dan 9000 e-mails per kalendermaand. Als u dit aantal moet overschrijden of consistent grote e-mails ontvangt, gebruik dan [Neem contact met ons op](https://forwardemail.net/help).

### Heb ik goedkeuring nodig om SMTP in te schakelen {#do-i-need-approval-to-enable-smtp}

Ja, houd er rekening mee dat Forward Email een handmatig beoordelingsproces per domein hanteert voor uitgaande SMTP-goedkeuring om de IP-reputatie te behouden en de afleverbaarheid te garanderen. Stuur een e-mail naar <support@forwardemail.net> of open een [hulpverzoek](https://forwardemail.net/help) voor goedkeuring. Dit duurt doorgaans minder dan 24 uur, waarbij de meeste verzoeken binnen 1-2 uur worden gehonoreerd. In de nabije toekomst willen we dit proces direct maken met extra spamcontroles en waarschuwingen. Dit proces zorgt ervoor dat uw e-mails de inbox bereiken en niet als spam worden gemarkeerd.

### Wat zijn uw SMTP-serverconfiguratie-instellingen {#what-are-your-smtp-server-configuration-settings}

Onze server is `smtp.forwardemail.net` en wordt ook gecontroleerd op onze <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statuspagina</a>.

Het ondersteunt zowel IPv4 als IPv6 en is beschikbaar via poorten `465` en `2465` voor SSL/TLS en `587`, `2587`, `2525` en `25` voor TLS (STARTTLS).

| Protocol | Hostnaam | Havens | IPv4 | IPv6 |
| :--------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: |
| `SSL/TLS` **Voorkeur** | `smtp.forwardemail.net` | `465`, `2465` | :wit_vinkje: | :wit_vinkje: |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :wit_vinkje: | :wit_vinkje: |

| Login | Voorbeeld | Beschrijving |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gebruikersnaam | `user@example.com` | E-mailadres van een alias die bestaat voor het domein op <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a>. |
| Wachtwoord | `************************` | Aliasspecifiek gegenereerd wachtwoord. |

Om uitgaande e-mail met SMTP te kunnen versturen, moet de **SMTP-gebruiker** het e-mailadres zijn van een alias die bestaat voor het domein op <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> – en het **SMTP-wachtwoord** moet een aliasspecifiek wachtwoord zijn dat is gegenereerd.

Raadpleeg [Ondersteunt u het verzenden van e-mail met SMTP?](#do-you-support-sending-email-with-smtp) voor stapsgewijze instructies.

### Wat zijn uw IMAP-serverconfiguratie-instellingen {#what-are-your-imap-server-configuration-settings}

Onze server is `imap.forwardemail.net` en wordt ook gecontroleerd op onze <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statuspagina</a>.

Het ondersteunt zowel IPv4 als IPv6 en is beschikbaar via poorten `993` en `2993` voor SSL/TLS.

| Protocol | Hostnaam | Havens | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Voorkeur** | `imap.forwardemail.net` | `993`, `2993` | :wit_vinkje: | :wit_vinkje: |

| Login | Voorbeeld | Beschrijving |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gebruikersnaam | `user@example.com` | E-mailadres van een alias die bestaat voor het domein op <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a>. |
| Wachtwoord | `************************` | Aliasspecifiek gegenereerd wachtwoord. |

Om verbinding te kunnen maken met IMAP, moet de **IMAP-gebruiker** het e-mailadres zijn van een alias die bestaat voor het domein op <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> – en het **IMAP-wachtwoord** moet een aliasspecifiek wachtwoord zijn dat is gegenereerd.

Raadpleeg [Ondersteunt u het ontvangen van e-mail met IMAP?](#do-you-support-receiving-email-with-imap) voor stapsgewijze instructies.

### Wat zijn uw POP3-serverconfiguratie-instellingen {#what-are-your-pop3-server-configuration-settings}

Onze server is `pop3.forwardemail.net` en wordt ook gecontroleerd op onze <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statuspagina</a>.

Het ondersteunt zowel IPv4 als IPv6 en is beschikbaar via poorten `995` en `2995` voor SSL/TLS.

| Protocol | Hostnaam | Havens | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Voorkeur** | `pop3.forwardemail.net` | `995`, `2995` | :wit_vinkje: | :wit_vinkje: |

| Login | Voorbeeld | Beschrijving |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gebruikersnaam | `user@example.com` | E-mailadres van een alias die bestaat voor het domein op <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a>. |
| Wachtwoord | `************************` | Aliasspecifiek gegenereerd wachtwoord. |

Om verbinding te kunnen maken via POP3, moet de **POP3-gebruiker** het e-mailadres zijn van een alias die bestaat voor het domein op <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> – en het **IMAP-wachtwoord** moet een aliasspecifiek wachtwoord zijn dat is gegenereerd.

Raadpleeg [Ondersteunt u POP3?](#do-you-support-pop3) voor stapsgewijze instructies.

### Postfix SMTP-relayconfiguratie {#postfix-smtp-relay-configuration}

U kunt Postfix configureren om e-mails door te sturen via de SMTP-servers van Forward Email. Dit is handig voor servertoepassingen die e-mails moeten verzenden.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Geschatte installatietijd:</strong>
<span>Minder dan 15 minuten</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Belangrijk:
</strong>
<span>
Hiervoor is een betaald abonnement met SMTP-toegang vereist.
</span>
</div>

#### Installatie {#installation}

1. Installeer Postfix op uw server:

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. Selecteer tijdens de installatie 'Internetsite' wanneer u wordt gevraagd naar het configuratie type.

#### Configuratie {#configuration}

1. Bewerk het hoofdconfiguratiebestand van Postfix:

```bash
sudo nano /etc/postfix/main.cf
```

2. Voeg deze instellingen toe of wijzig ze:

```
# SMTP relay configuration
relayhost = [smtp.forwardemail.net]:587
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Maak het SASL-wachtwoordbestand:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Voeg uw Forward Email-inloggegevens toe:

```
[smtp.forwardemail.net]:587 your-alias@yourdomain.com:your-generated-password
```

5. Beveilig en hash het wachtwoordbestand:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Postfix opnieuw starten:

```bash
sudo systemctl restart postfix
```

#### Testen van {#testing}

Test uw configuratie door een test-e-mail te sturen:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

## Beveiliging {#security}

### Geavanceerde serververhardingstechnieken {#advanced-server-hardening-techniques}

> \[!TIP]
> Lees meer over onze beveiligingsinfrastructuur op [onze Beveiligingspagina](/security).

Forward Email implementeert talrijke serverbeveiligingstechnieken om de veiligheid van onze infrastructuur en uw gegevens te garanderen:

1. **Netwerkbeveiliging**:
* IP-tabellenfirewall met strikte regels
* Fail2ban voor bruteforce-beveiliging
* Regelmatige beveiligingsaudits en penetratietests
* Alleen VPN-beheerderstoegang

2. **Systeemverharding**:
* Minimale pakketinstallatie
* Regelmatige beveiligingsupdates
* SELinux in afdwingmodus
* Root SSH-toegang uitgeschakeld
* Alleen sleutelgebaseerde authenticatie

3. **Toepassingsbeveiliging**:
* Content Security Policy (CSP)-headers
* HTTPS Strict Transport Security (HSTS)
* XSS-beveiligingsheaders
* Frame-opties en referrer policy-headers
* Regelmatige afhankelijkheidscontroles

4. **Gegevensbescherming**:
* Volledige schijfversleuteling met LUKS
* Veilig sleutelbeheer
* Regelmatige back-ups met versleuteling
* Dataminimalisatiepraktijken

5. **Monitoring en respons**:
* Realtime inbraakdetectie
* Geautomatiseerde beveiligingsscans
* Gecentraliseerde logging en analyse
* Procedures voor incidentrespons

> \[!IMPORTANT]
> Onze beveiligingsprocedures worden voortdurend bijgewerkt om opkomende bedreigingen en kwetsbaarheden aan te pakken.

> \[!TIP]
> Voor maximale beveiliging raden we aan onze service te gebruiken met end-to-end-encryptie via OpenPGP.

### Heeft u SOC 2- of ISO 27001-certificeringen? {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email werkt op infrastructuur van gecertificeerde subverwerkers om naleving van industrienormen te garanderen.

Forward Email beschikt niet direct over SOC 2 Type II- of ISO 27001-certificeringen. De service werkt echter op infrastructuur van gecertificeerde subverwerkers:

* **DigitalOcean**: SOC 2 Type II en SOC 3 Type II gecertificeerd (gecontroleerd door Schellman & Company LLC), ISO 27001 gecertificeerd in meerdere datacenters. Details: <https://www.digitalocean.com/trust/certification-reports>

* **Vultr**: SOC 2+ (HIPAA) gecertificeerd, ISO/IEC-certificeringen: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Details: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: SOC 2-compatibel (neem rechtstreeks contact op met DataPacket voor certificering), leverancier van infrastructuur op ondernemingsniveau (locatie Denver). Details: <https://www.datapacket.com/datacenters/denver>

Forward Email volgt de beste praktijken in de branche voor beveiligingsaudits en werkt regelmatig samen met onafhankelijke beveiligingsonderzoekers. Bron: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### Gebruikt u TLS-encryptie voor het doorsturen van e-mails? {#do-you-use-tls-encryption-for-email-forwarding}

Ja. Forward Email hanteert strikt TLS 1.2+ voor alle verbindingen (HTTPS, SMTP, IMAP, POP3) en implementeert MTA-STS voor verbeterde TLS-ondersteuning. De implementatie omvat:

* TLS 1.2+ handhaving voor alle e-mailverbindingen
* ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) sleuteluitwisseling voor perfecte forward secrecy
* Moderne coderingssuites met regelmatige beveiligingsupdates
* HTTP/2-ondersteuning voor verbeterde prestaties en beveiliging
* HSTS (HTTP Strict Transport Security) met preloading in de belangrijkste browsers
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** voor strikte TLS-handhaving

Bron: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**MTA-STS-implementatie**: Forward Email implementeert strikte MTA-STS-handhaving in de codebase. Wanneer TLS-fouten optreden en MTA-STS wordt afgedwongen, retourneert het systeem 421 SMTP-statuscodes om ervoor te zorgen dat e-mails later opnieuw worden verzonden in plaats van onveilig te worden afgeleverd. Implementatiedetails:

* TLS-foutdetectie: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* MTA-STS-afdwinging in de helper voor het verzenden van e-mail: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Validatie door derden: <https://www.hardenize.com/report/forwardemail.net/1750312779> geeft de beoordeling "Goed" voor alle TLS- en transportbeveiligingsmaatregelen.

### Behoudt u e-mailauthenticatieheaders {#do-you-preserve-email-authentication-headers}

Ja. Forward Email implementeert en behoudt e-mailauthenticatieheaders uitgebreid:

* **SPF (Sender Policy Framework)**: Correct geïmplementeerd en bewaard
* **DKIM (DomainKeys Identified Mail)**: Volledige ondersteuning met correct sleutelbeheer
* **DMARC**: Beleidshandhaving voor e-mails die de SPF- of DKIM-validatie niet doorstaan
* **ARC**: Hoewel niet expliciet beschreven, suggereren de perfecte nalevingsscores van de service een uitgebreide verwerking van authenticatieheaders

Bron: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Validatie: Internet.nl Mail Test toont een score van 100/100 specifiek voor de implementatie van "SPF, DKIM en DMARC". Hardenize-beoordeling bevestigt de beoordeling "Goed" voor SPF en DMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Behoudt u originele e-mailheaders en voorkomt u spoofing {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email implementeert geavanceerde anti-spoofingbeveiliging om e-mailmisbruik te voorkomen.

Met Forward Email blijven de originele e-mailheaders behouden en wordt uitgebreide anti-spoofingbeveiliging geïmplementeerd via de MX-codebase:

* **Headerbehoud**: Originele authenticatieheaders blijven behouden tijdens het doorsturen
* **Anti-spoofing**: Handhaving van het DMARC-beleid voorkomt headerspoofing door e-mails te weigeren die de SPF- of DKIM-validatie niet doorstaan
* **Preventie van headerinjectie**: Validatie en opschoning van invoer met behulp van een striptagbibliotheek
* **Geavanceerde bescherming**: Geavanceerde phishingdetectie met spoofingdetectie, preventie van impersonatie en systemen voor gebruikersmeldingen

**MX-implementatiedetails**: De kernlogica voor e-mailverwerking wordt afgehandeld door de MX-servercodebase, met name:

* Hoofd MX-gegevenshandler: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Willekeurige e-mailfiltering (anti-spoofing): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

De helper `isArbitrary` implementeert geavanceerde anti-spoofingregels, waaronder detectie van domeinimitatie, geblokkeerde zinnen en verschillende phishingpatronen.

Bron: <https://forwardemail.net/technical-whitepaper.pdf#page=32>

### Hoe beschermt u zich tegen spam en misbruik {#how-do-you-protect-against-spam-and-abuse}

Forward Email implementeert uitgebreide bescherming op meerdere lagen:

* **Rate Limiting**: Toegepast op authenticatiepogingen, API-eindpunten en SMTP-verbindingen
* **Resource-isolatie**: Tussen gebruikers om impact van gebruikers met een hoog volume te voorkomen
* **DDoS-beveiliging**: Meerlaagse bescherming via het Shield-systeem van DataPacket en Cloudflare
* **Automatische schaalbaarheid**: Dynamische resource-aanpassing op basis van de vraag
* **Misbruikpreventie**: Gebruikerspecifieke controles ter voorkoming van misbruik en hash-gebaseerde blokkering van schadelijke content
* **E-mailauthenticatie**: SPF-, DKIM- en DMARC-protocollen met geavanceerde phishingdetectie

Bronnen:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (details DDoS-beveiliging)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### Slaat u e-mailinhoud op schijf {#do-you-store-email-content-on-disk} op?

> \[!IMPORTANT]
> Forward Email maakt gebruik van een zero-knowledge-architectuur die voorkomt dat e-mailinhoud naar schijf wordt geschreven.

* **Zero-Knowledge Architectuur**: Individueel versleutelde SQLite-mailboxen zorgen ervoor dat Forward Email geen toegang heeft tot e-mailinhoud.
* **In-Memory Processing**: E-mailverwerking vindt volledig in het geheugen plaats, waardoor schijfopslag overbodig is.
* **Geen contentregistratie**: "We registreren of bewaren geen e-mailinhoud of metadata op schijf."
* **Sandbox-encryptie**: Encryptiesleutels worden nooit als platte tekst op schijf opgeslagen.

**MX-codebasebewijs**: De MX-server verwerkt e-mails volledig in het geheugen zonder inhoud naar schijf te schrijven. De belangrijkste e-mailverwerkingshandler demonstreert deze in-memory-benadering: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Bronnen:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Abstract)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Zero-knowledge details)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Sandbox-encryptie)

### Kan e-mailinhoud worden blootgesteld tijdens systeemcrashes {#can-email-content-be-exposed-during-system-crashes}

Nee. Forward Email implementeert uitgebreide beschermingsmaatregelen tegen crashgerelateerde gegevensblootstelling:

* **Coredumps uitgeschakeld**: Voorkomt blootstelling van geheugen tijdens crashes
* **Swapgeheugen uitgeschakeld**: Volledig uitgeschakeld om extractie van gevoelige gegevens uit wisselbestanden te voorkomen
* **In-Memory-architectuur**: E-mailinhoud bevindt zich tijdens de verwerking alleen in vluchtig geheugen
* **Beveiliging met encryptiesleutel**: Sleutels worden nooit als platte tekst op schijf opgeslagen
* **Fysieke beveiliging**: Met LUKS v2 versleutelde schijven wordt fysieke toegang tot gegevens voorkomen
* **USB-opslag uitgeschakeld**: Voorkomt ongeautoriseerde extractie van gegevens

**Foutbehandeling bij systeemproblemen**: Forward Email maakt gebruik van de hulpfuncties `isCodeBug` en `isTimeoutError`. Bij problemen met de databaseconnectiviteit, het DNS-netwerk/de blokkeerlijst of de upstreamconnectiviteit retourneert het systeem 421 SMTP-statuscodes. Zo worden e-mails later opnieuw geprobeerd te versturen en raken ze niet verloren of worden ze blootgesteld.

Implementatiedetails:

* Foutclassificatie: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Time-outfoutafhandeling in MX-verwerking: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Bron: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### Wie heeft toegang tot uw e-mailinfrastructuur {#who-has-access-to-your-email-infrastructure}

Forward Email implementeert uitgebreide toegangscontroles voor de toegang van een minimaal 2-3-koppig engineeringteam met strikte 2FA-vereisten:

* **Rolgebaseerde toegangscontrole**: Voor teamaccounts met resourcegebaseerde machtigingen
* **Least Privilege Principle**: Toegepast in alle systemen
* **Scheiding van taken**: Tussen operationele rollen
* **Gebruikersbeheer**: Scheid implementatie- en devops-gebruikers met verschillende machtigingen
* **Root-aanmelding uitgeschakeld**: Forceert toegang via correct geauthenticeerde accounts
* **Strikte 2FA**: Geen sms-gebaseerde 2FA vanwege het risico op MiTM-aanvallen - alleen app- of hardwaretokens
* **Uitgebreide auditlogging**: Met censuur van gevoelige gegevens
* **Geautomatiseerde anomaliedetectie**: Voor ongebruikelijke toegangspatronen
* **Regelmatige beveiligingscontroles**: Van toegangslogboeken
* **Preventie van Evil Maid-aanvallen**: USB-opslag uitgeschakeld en andere fysieke beveiligingsmaatregelen

Bronnen:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Autorisatiebeheer)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Netwerkbeveiliging)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Voorkoming van aanvallen met Evil Maid)

### Welke infrastructuurproviders gebruikt u {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email maakt gebruik van meerdere infrastructuur-subprocessors met uitgebreide nalevingscertificeringen.

Volledige details zijn beschikbaar op onze AVG-nalevingspagina: <https://forwardemail.net/gdpr>

**Primaire infrastructuur-subverwerkers:**

| Aanbieder | Gecertificeerd Data Privacy Framework | AVG-nalevingspagina |
| ---------------- | -------------------------------- | ----------------------------------------------- |
| **Cloudflare** | ✅ Ja | <https://www.cloudflare.com/trust-hub/gdpr/> |
| **Datapakket** | ❌ Nee | <https://www.datapacket.com/privacybeleid> |
| **DigitaleOceaan** | ❌ Nee | <https://www.digitalocean.com/legal/gdpr> |
| **Vultr** | ❌ Nee | <https://www.vultr.com/legal/eea-gdpr-privacy/> |

**Gedetailleerde certificeringen:**

**DigitaleOceaan**

* SOC 2 Type II & SOC 3 Type II (geaudit door Schellman & Company LLC)
* ISO 27001-gecertificeerd in meerdere datacenters
* PCI-DSS-conform
* CSA STAR Level 1-gecertificeerd
* APEC CBPR PRP-gecertificeerd
* Details: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* SOC 2+ (HIPAA) gecertificeerd
* PCI Merchant-conform
* CSA STAR Level 1 gecertificeerd
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Details: <https://www.vultr.com/legal/compliance/>

**Datapakket**

* SOC 2-compatibel (neem rechtstreeks contact op met DataPacket voor certificering)
* Infrastructuur van enterprise-kwaliteit (locatie Denver)
* DDoS-bescherming via Shield cybersecurity stack
* 24/7 technische ondersteuning
* Wereldwijd netwerk met 58 datacenters
* Details: <https://www.datapacket.com/datacenters/denver>

**Betalingsverwerkers:**

* **Stripe**: Data Privacy Framework gecertificeerd - <https://stripe.com/legal/privacy-center>
* **PayPal**: Niet DPF-gecertificeerd - <https://www.paypal.com/uk/legalhub/privacy-full>

### Biedt u een gegevensverwerkingsovereenkomst (DPA) aan? {#do-you-offer-a-data-processing-agreement-dpa}

Ja, Forward Email biedt een uitgebreide gegevensverwerkingsovereenkomst (DPA) die samen met onze ondernemingsovereenkomst kan worden ondertekend. Een kopie van onze DPA is beschikbaar op: <https://forwardemail.net/dpa>

**DPA-gegevens:**

* Omvat AVG-naleving en EU-VS/Zwitsers-VS Privacy Shield-frameworks
* Automatisch geaccepteerd bij akkoord met onze Servicevoorwaarden
* Geen aparte handtekening vereist voor standaard DPA
* Aangepaste DPA-regelingen beschikbaar via Enterprise License

**AVG-nalevingskader:**
Onze DPA beschrijft de naleving van de AVG en de vereisten voor internationale gegevensoverdracht. Volledige informatie is beschikbaar op: <https://forwardemail.net/gdpr>

Zakelijke klanten die aangepaste DPA-voorwaarden of specifieke contractuele afspraken nodig hebben, kunnen hiervoor terecht bij ons **Enterprise License ($250/maand)**-programma.

### Hoe gaat u om met meldingen van datalekken {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> De zero-knowledge-architectuur van Forward Email beperkt de impact van inbreuken aanzienlijk.

* **Beperkte gegevensblootstelling**: Geen toegang tot versleutelde e-mailinhoud vanwege zero-knowledge-architectuur
* **Minimale gegevensverzameling**: Alleen basisgegevens van abonnees en beperkte IP-logs voor beveiliging
* **Subprocessorframeworks**: DigitalOcean en Vultr hanteren AVG-conforme incidentresponsprocedures

**Informatie over de AVG-vertegenwoordiger:**
Forward Email heeft AVG-vertegenwoordigers aangesteld in overeenstemming met artikel 27:

**EU-vertegenwoordiger:**
Osano International Compliance Services Limited
T.a.v.: LFHC
3 Dublin Landings, North Wall Quay
Dublin 1, D01C4E0

**Vertegenwoordiger VK:**
Osano UK Compliance LTD
T.a.v.: LFHC
42-46 Fountain Street, Belfast
Antrim, BT1 - 5EF

Voor zakelijke klanten die specifieke SLA's voor het melden van inbreuken nodig hebben, moeten deze worden besproken als onderdeel van een **Bedrijfslicentie**-overeenkomst.

Bronnen:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### Biedt u een testomgeving aan {#do-you-offer-a-test-environment}

De technische documentatie van Forward Email beschrijft niet expliciet een speciale sandboxmodus. Mogelijke testmethoden zijn echter:

* **Self-hostingoptie**: Uitgebreide self-hostingmogelijkheden voor het creëren van testomgevingen
* **API-interface**: Mogelijkheid voor programmatisch testen van configuraties
* **Open source**: 100% open source-code stelt klanten in staat om de doorstuurlogica te onderzoeken
* **Meerdere domeinen**: Ondersteuning voor meerdere domeinen kan het creëren van testdomeinen mogelijk maken

Voor zakelijke klanten die formele sandboxfunctionaliteit nodig hebben, dient dit te worden besproken als onderdeel van een **Enterprise License**-overeenkomst.

Bron: <https://github.com/forwardemail/forwardemail.net> (Details ontwikkelomgeving)

### Biedt u monitoring- en waarschuwingshulpmiddelen aan? {#do-you-provide-monitoring-and-alerting-tools}

Forward Email biedt realtime monitoring, maar er zijn enkele beperkingen:

**Beschikbaar:**

* **Realtime leveringsmonitoring**: Openbaar zichtbare prestatiegegevens voor grote e-mailproviders
* **Automatische waarschuwingen**: Het engineeringteam wordt gewaarschuwd wanneer de levertijden langer zijn dan 10 seconden
* **Transparante monitoring**: 100% open-source monitoringsystemen
* **Infrastructuurmonitoring**: Geautomatiseerde anomaliedetectie en uitgebreide auditregistratie

**Beperkingen:**

* Webhooks voor klanten of API-gebaseerde meldingen over de leveringsstatus worden niet expliciet gedocumenteerd

Voor zakelijke klanten die gedetailleerde webhooks voor de leveringsstatus of aangepaste monitoringintegraties nodig hebben, zijn deze mogelijkheden mogelijk beschikbaar via **Enterprise License**-regelingen.

Bronnen:

* <https://forwardemail.net> (Realtime monitoringweergave)
* <https://github.com/forwardemail/forwardemail.net> (Monitoringimplementatie)

### Hoe zorgt u voor hoge beschikbaarheid {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Forward Email implementeert uitgebreide redundantie over meerdere infrastructuurproviders.

* **Gedistribueerde infrastructuur**: Meerdere providers (DigitalOcean, Vultr, DataPacket) in verschillende geografische regio's
* **Geografische load balancing**: Cloudflare-gebaseerde, geografisch gelokaliseerde load balancing met automatische failover
* **Automatische schaalbaarheid**: Dynamische resource-aanpassing op basis van de vraag
* **Meerlaagse DDoS-beveiliging**: Via het Shield-systeem van DataPacket en Cloudflare
* **Serverredundantie**: Meerdere servers per regio met automatische failover
* **Databasereplicatie**: Realtime gegevenssynchronisatie over meerdere locaties
* **Monitoring en waarschuwingen**: 24/7 monitoring met automatische incidentrespons

**Uptime Commitment**: 99,9%+ servicebeschikbaarheid met transparante monitoring beschikbaar op <https://forwardemail.net>

Bronnen:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Voldoet u aan sectie 889 van de National Defense Authorization Act (NDAA) {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Forward Email voldoet volledig aan Sectie 889 dankzij een zorgvuldige selectie van infrastructuurpartners.

Ja, Forward Email voldoet aan **Sectie 889**. Sectie 889 van de National Defense Authorization Act (NDAA) verbiedt overheidsinstanties om telecommunicatie- en videobewakingsapparatuur van bepaalde bedrijven (Huawei, ZTE, Hikvision, Dahua en Hytera) te gebruiken of er contracten mee af te sluiten.

**Hoe Forward Email voldoet aan Sectie 889:**

Forward Email is uitsluitend afhankelijk van twee belangrijke infrastructuurproviders, die allebei geen van beiden apparatuur gebruiken die volgens sectie 889 verboden is:

1. **Cloudflare**: Onze primaire partner voor netwerkdiensten en e-mailbeveiliging
2. **DataPacket**: Onze primaire leverancier voor serverinfrastructuur (uitsluitend gebruikmakend van Arista Networks en Cisco-apparatuur)
3. **Back-upproviders**: Onze back-upproviders Digital Ocean en Vultr zijn bovendien schriftelijk bevestigd als zijnde Sectie 889-compatibel.

**Betrokkenheid van Cloudflare**: Cloudflare vermeldt expliciet in haar gedragscode voor derden dat zij geen telecommunicatieapparatuur, videobewakingsproducten of diensten gebruiken van entiteiten die volgens artikel 889 verboden zijn.

**Gebruiksscenario voor de overheid**: Onze naleving van Sectie 889 werd gevalideerd toen de **US Naval Academy** Forward Email selecteerde voor hun behoeften op het gebied van het veilig doorsturen van e-mail. Hiervoor was documentatie van onze federale nalevingsnormen vereist.

Voor volledige details over ons overheidscompliancekader, inclusief bredere federale regelgeving, lees onze uitgebreide casestudy: [Voldoet aan Sectie 889 van de e-mailservice van de federale overheid](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)

## Systeem- en technische details {#system-and-technical-details}

### Slaat u e-mails en hun inhoud op {#do-you-store-emails-and-their-contents}

Nee, we schrijven geen logs naar schijf en slaan deze ook niet op – met [uitzondering van fouten](#do-you-store-error-logs) en [uitgaande SMTP](#do-you-support-sending-email-with-smtp) (zie onze [Privacybeleid](/privacy)).

Alles gebeurt in het geheugen en [onze broncode staat op GitHub](https://github.com/forwardemail).

### Hoe werkt uw e-mail doorstuursysteem {#how-does-your-email-forwarding-system-work}

E-mail is afhankelijk van [SMTP-protocol](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). Dit protocol bestaat uit opdrachten die naar een server worden verzonden (meestal via poort 25). Er is een eerste verbinding, waarna de afzender aangeeft van wie de e-mail afkomstig is ("MAIL FROM"), gevolgd door de bestemming ("RCPT TO") en tot slot de headers en de hoofdtekst van de e-mail zelf ("DATA"). De stroom van ons e-maildoorstuursysteem wordt hieronder beschreven met betrekking tot elke SMTP-protocolopdracht:

* Initiële verbinding (geen commandonaam, bijvoorbeeld `telnet example.com 25`) - Dit is de initiële verbinding. We vergelijken afzenders die niet in onze [toegestane lijst](#do-you-have-an-allowlist) staan met onze [weigeringslijst](#do-you-have-a-denylist). Als een afzender niet in onze whitelist staat, controleren we of deze wel in onze [grijze lijst](#do-you-have-a-greylist) staat.

* `HELO` - Dit is een begroeting om de FQDN, het IP-adres of de naam van de e-mailhandler van de afzender te identificeren. Deze waarde kan vervalst zijn, dus we vertrouwen niet op deze gegevens en gebruiken in plaats daarvan de omgekeerde hostname-lookup van het IP-adres van de verbinding.

* `MAIL FROM` - Dit geeft het e-mailadres van de envelop van de e-mail aan. Als er een waarde wordt ingevoerd, moet dit een geldig RFC 5322-e-mailadres zijn. Lege waarden zijn toegestaan. We gebruiken hier [controleer op backscatter](#how-do-you-protect-against-backscatter) en controleren ook de MAIL FROM met onze [weigeringslijst](#do-you-have-a-denylist). Tot slot controleren we afzenders die niet op de whitelist staan op snelheidsbeperking (zie de sectie over [Snelheidsbeperking](#do-you-have-rate-limiting) en [toegestane lijst](#do-you-have-an-allowlist) voor meer informatie).

* `RCPT TO` - Dit geeft de ontvanger(s) van de e-mail aan. Dit moeten geldige RFC 5322-e-mailadressen zijn. We staan maximaal 50 envelopontvangers per bericht toe (dit is anders dan de 'Aan'-header van een e-mail). We controleren hier ook op een geldig [Herschrijfschema voor afzender](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS")-adres ter bescherming tegen spoofing met onze SRS-domeinnaam.

* `DATA` - Dit is het kernonderdeel van onze service dat e-mails verwerkt. Zie de sectie [Hoe verwerk je een e-mail voor doorsturen?](#how-do-you-process-an-email-for-forwarding) hieronder voor meer informatie.

### Hoe verwerk je een e-mail voor het doorsturen van {#how-do-you-process-an-email-for-forwarding}

In dit gedeelte wordt ons proces beschreven met betrekking tot de SMTP-protocolopdracht `DATA` uit het gedeelte [Hoe werkt uw e-mail doorstuursysteem?](#how-does-your-email-forwarding-system-work) hierboven. Dit proces gaat over hoe we de headers, de hoofdtekst en de beveiliging van een e-mail verwerken, hoe we bepalen waar het bericht moet worden afgeleverd en hoe we verbindingen afhandelen.

1. Als het bericht de maximale grootte van 50 MB overschrijdt, wordt het afgewezen en verschijnt er foutcode 552.

2. Als het bericht geen "Van"-header bevat, of als een van de waarden in de "Van"-header geen geldige RFC 5322-e-mailadressen zijn, wordt het bericht afgewezen met foutcode 550.

3. Als het bericht meer dan 25 "Received"-headers bevat, is vastgesteld dat het bericht in een redirect-loop is vastgelopen en wordt het afgewezen met foutcode 550.

4. Met behulp van de vingerafdruk van de e-mail (zie het gedeelte over [Vingerafdrukken](#how-do-you-determine-an-email-fingerprint)) controleren we of er langer dan 5 dagen is geprobeerd het bericht opnieuw te verzenden (wat overeenkomt met [standaard postfix-gedrag](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)). Als dit het geval is, wordt het bericht afgewezen met foutcode 550.

5. We slaan de resultaten van het scannen van de e-mail op in het geheugen met behulp van [Spamscanner](https://spamscanner.net).

6. Als Spam Scanner willekeurige resultaten heeft opgeleverd, wordt deze afgewezen met foutcode 554. De willekeurige resultaten omvatten op het moment van schrijven alleen de GTUBE-test. Zie <https://spamassassin.apache.org/gtube/> voor meer informatie.

7. We voegen de volgende headers toe aan het bericht voor foutopsporing en ter voorkoming van misbruik:

* `Received` - We voegen deze standaard Received-header toe met het IP-adres en de host van de afzender, het transmissietype, TLS-verbindingsinformatie, datum/tijd en de ontvanger.
* `X-Original-To` - De oorspronkelijke ontvanger van het bericht:
* Dit is handig om te bepalen waar een e-mail oorspronkelijk is afgeleverd (naast de "Received"-header).
* Dit wordt per ontvanger toegevoegd tijdens IMAP en/of gemaskeerde doorsturing (om de privacy te beschermen).
* `X-Forward-Email-Website` - Bevat een link naar onze website van <https://forwardemail.net>
* `X-Forward-Email-Version` - De huidige [SemVer](https://semver.org/)-versie van `package.json` van onze codebase.
* `X-Forward-Email-Session-ID` - Een sessie-ID-waarde die wordt gebruikt voor debugdoeleinden (alleen van toepassing in niet-productieomgevingen).

* `X-Forward-Email-Sender` - een door komma's gescheiden lijst met het oorspronkelijke MAIL FROM-adres (indien niet leeg), de FQDN van de reverse PTR-client (indien deze bestaat) en het IP-adres van de afzender.
* `X-Forward-Email-ID` - dit is alleen van toepassing op uitgaande SMTP en correleert met de e-mail-ID die is opgeslagen in Mijn Account → E-mails.
* `X-Original-To`0 - met de waarde `X-Original-To`1.
* `X-Original-To`2 - met de waarde `X-Original-To`3.
* `X-Original-To`4 - met de waarde `X-Original-To`5.

8. Vervolgens controleren we het bericht voor [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain) en [DMARC](https://en.wikipedia.org/wiki/DMARC).

* Als het bericht niet door de DMARC-test is gekomen en het domein een afwijzingsbeleid had (bijv. `p=reject` [stond in het DMARC-beleid](https://wikipedia.org/wiki/DMARC)), wordt het afgewezen met foutcode 550. Een DMARC-beleid voor een domein is doorgaans te vinden in de <strong class="notranslate">TXT</strong>-record van het subdomein `_dmarc` (bijv. `dig _dmarc.example.com txt`).
* Als het bericht niet door de SPF-test is gekomen en het domein een hard fail-beleid had (bijv. `-all` stond in het SPF-beleid in plaats van `~all` of helemaal geen beleid), wordt het afgewezen met foutcode 550. Een SPF-beleid voor een domein is doorgaans te vinden in de <strong class="notranslate">TXT</strong>-record van het rootdomein (bijv. `dig example.com txt`). Zie deze sectie voor meer informatie over [e-mail verzenden zoals met Gmail](#can-i-send-mail-as-in-gmail-with-this) met betrekking tot SPF.

9. Nu verwerken we de ontvangers van het bericht zoals verzameld met de opdracht `RCPT TO` in de sectie [Hoe werkt uw e-mail doorstuursysteem?](#how-does-your-email-forwarding-system-work) hierboven. Voor elke ontvanger voeren we de volgende bewerkingen uit:

* We zoeken de <strong class="notranslate">TXT</strong>-records van de domeinnaam op (het gedeelte na het symbool `@`, bijvoorbeeld `example.com` als het e-mailadres `test@example.com` was). Als het domein bijvoorbeeld `example.com` is, voeren we een DNS-lookup uit, bijvoorbeeld `dig example.com txt`.
* We parseren alle <strong class="notranslate">TXT</strong>-records die beginnen met `forward-email=` (gratis abonnementen) of `forward-email-site-verification=` (betaalde abonnementen). Let op: we parseren beide om e-mails te verwerken terwijl een gebruiker een abonnement upgradet of downgradet.
* Van deze geparseerde <strong class="notranslate">TXT</strong>-records itereren we eroverheen om de doorstuurconfiguratie te extraheren (zoals beschreven in de sectie [Hoe begin ik en stel ik e-maildoorsturen in?](#how-do-i-get-started-and-set-up-email-forwarding) hierboven). Houd er rekening mee dat we slechts één `forward-email-site-verification=`-waarde ondersteunen. Als er meer dan één waarde wordt opgegeven, treedt er een 550-fout op en ontvangt de afzender een bounce voor deze ontvanger.
* Recursief itereren we over de geëxtraheerde doorstuurconfiguratie om globale doorsturing, regex-gebaseerde doorsturing en alle andere ondersteunde doorstuurconfiguraties te bepalen – deze staan nu bekend als onze "doorstuuradressen".
* Voor elk doorstuuradres ondersteunen we één recursieve zoekopdracht (waarmee deze reeks bewerkingen opnieuw wordt gestart op het opgegeven adres). Als er een recursieve match is gevonden, wordt het bovenliggende resultaat uit de doorstuuradressen verwijderd en worden de onderliggende adressen toegevoegd.
* Doorstuuradressen worden geparseerd op uniciteit (omdat we geen duplicaten naar één adres willen sturen of onnodige SMTP-clientverbindingen willen genereren). * Voor elk doorstuuradres zoeken we de domeinnaam op via ons API-eindpunt `/v1/max-forwarded-addresses` (om te bepalen naar hoeveel adressen het domein e-mail per alias mag doorsturen, bijvoorbeeld standaard 10 – zie de sectie over `example.com`0). Als deze limiet wordt overschreden, treedt er een 550-fout op en ontvangt de afzender een bounce voor deze ontvanger.
* We zoeken de instellingen van de oorspronkelijke ontvanger op via ons API-eindpunt `example.com`1, dat een opzoekfunctie ondersteunt voor betalende gebruikers (met een fallback voor gratis gebruikers). Dit retourneert een configuratieobject voor geavanceerde instellingen voor `example.com`2 (nummer, bijvoorbeeld `example.com`3), `example.com`4 (Booleaans), `example.com`5 (Booleaans), `example.com`6 (Booleaans) en `example.com`7 (Booleaans).
* Op basis van deze instellingen controleren we vervolgens de resultaten van de Spam Scanner. Als er fouten optreden, wordt het bericht afgewezen met foutcode 554 (als `example.com`8 bijvoorbeeld is ingeschakeld, controleren we de resultaten van de Spam Scanner op virussen). Houd er rekening mee dat alle gebruikers van een gratis abonnement zich aanmelden voor controles op inhoud voor volwassenen, phishing, uitvoerbare bestanden en virussen. Standaard zijn alle gebruikers van een betaald abonnement ook aangemeld, maar deze configuratie kan worden gewijzigd op de pagina Instellingen voor een domein in het dashboard 'E-mail doorsturen').

10. Voor elk verwerkt doorstuuradres van de ontvanger voeren we vervolgens de volgende bewerkingen uit:

* Het adres wordt gecontroleerd aan de hand van onze [weigeringslijst](#do-you-have-a-denylist). Als het adres in de lijst staat, verschijnt er een foutcode 421 (waarmee de afzender wordt gevraagd het later opnieuw te proberen).
* Als het adres een webhook is, stellen we een Booleaanse waarde in voor toekomstige bewerkingen (zie hieronder – we groeperen vergelijkbare webhooks om één POST-verzoek te maken in plaats van meerdere voor bezorging).
* Als het adres een e-mailadres is, parseren we de host voor toekomstige bewerkingen (zie hieronder – we groeperen vergelijkbare hosts om één verbinding te maken in plaats van meerdere individuele verbindingen voor bezorging).

11. Als er geen ontvangers en geen bounces zijn, reageren we met de foutmelding 550: "Ongeldige ontvangers".

12. Als er ontvangers zijn, itereren we eroverheen (gegroepeerd door dezelfde host) en bezorgen we de e-mails. Zie de sectie [Hoe gaat u om met problemen met e-mailbezorging?](#how-do-you-handle-email-delivery-issues) hieronder voor meer informatie.

* Als er fouten optreden tijdens het verzenden van e-mails, slaan we deze op in het geheugen voor latere verwerking.
* We nemen de laagste foutcode (indien van toepassing) van de verzonden e-mails en gebruiken die als antwoordcode voor de opdracht `DATA`. Dit betekent dat e-mails die niet zijn afgeleverd doorgaans opnieuw worden verzonden door de oorspronkelijke afzender, maar dat e-mails die al zijn afgeleverd, niet opnieuw worden verzonden wanneer het bericht de volgende keer wordt verzonden (omdat we [Vingerafdrukken](#how-do-you-determine-an-email-fingerprint) gebruiken).
* Als er geen fouten zijn opgetreden, sturen we een SMTP-responsstatuscode van 250 succesvol.
* Een bounce wordt beschouwd als elke bezorgpoging die resulteert in een statuscode >= 500 (permanente mislukkingen).

13. Als er geen bounces zijn opgetreden (permanente fouten), dan retourneren we een SMTP-responsstatuscode van de laagste foutcode van niet-permanente fouten (of een statuscode 250 succesvol als er geen fouten zijn opgetreden).

14. Als er bounces zijn opgetreden, sturen we op de achtergrond bounce-e-mails nadat we de laagste foutcode aan de afzender hebben geretourneerd. Als de laagste foutcode echter >= 500 is, sturen we geen bounce-e-mails. Dit komt omdat afzenders anders twee bounce-e-mails zouden ontvangen (bijvoorbeeld één van hun uitgaande MTA, zoals Gmail, en één van ons). Zie het gedeelte over [Hoe bescherm je je tegen backscatter?](#how-do-you-protect-against-backscatter) hieronder voor meer informatie.

### Hoe ga je om met problemen met e-mailbezorging {#how-do-you-handle-email-delivery-issues}

Houd er rekening mee dat we de "Friendly-From"-vermelding in de e-mails alleen zullen herschrijven als het DMARC-beleid van de afzender niet werd goedgekeurd EN er geen DKIM-handtekeningen waren afgestemd op de "From"-header. Dit betekent dat we de "From"-header in het bericht zullen aanpassen, "X-Original-From" zullen instellen en ook een "Reply-To" zullen instellen als deze nog niet was ingesteld. We zullen ook de ARC-vermelding in het bericht opnieuw verzegelen na het wijzigen van deze headers.

We gebruiken ook slimme parsing van foutmeldingen op elk niveau van onze stack: in onze code, DNS-verzoeken, Node.js-interne processen, HTTP-verzoeken (bijv. 408, 413 en 429 worden toegewezen aan de SMTP-antwoordcode 421 als de ontvanger een webhook is) en mailserverreacties (bijv. reacties met "defer" of "slowdown" worden opnieuw geprobeerd als 421-fouten).

Onze logica is dummyproof en zal ook opnieuw proberen bij SSL/TLS-fouten, verbindingsproblemen en meer. Het doel van dummyproofing is om de afleverbaarheid van een doorstuurconfiguratie aan alle ontvangers te maximaliseren.

Als de ontvanger een webhook is, hanteren we een time-out van 60 seconden voor de aanvraag, met maximaal 3 pogingen (dus in totaal 4 aanvragen voordat een fout optreedt). Merk op dat we foutcodes 408, 413 en 429 correct parseren en koppelen aan SMTP-responscode 421.

Als de ontvanger een e-mailadres is, proberen we de e-mail te verzenden met opportunistische TLS (we proberen STARTTLS te gebruiken als dit beschikbaar is op de mailserver van de ontvanger). Als er een SSL/TLS-fout optreedt tijdens het verzenden van de e-mail, proberen we de e-mail te verzenden zonder TLS (zonder STARTTLS te gebruiken).

Indien er DNS- of verbindingsfouten optreden, sturen we de opdracht `DATA` een SMTP-responscode van 421 terug. Indien er fouten van niveau >= 500 optreden, worden er bounces verzonden.

Als we detecteren dat een e-mailserver waar we naartoe proberen te verzenden, een of meer van onze mail exchange IP-adressen heeft geblokkeerd (bijvoorbeeld door de technologie die ze gebruiken om spammers tegen te houden), dan sturen we een SMTP-responscode van 421 zodat de afzender het bericht later opnieuw kan verzenden (wij worden op de hoogte gesteld van het probleem, zodat we het hopelijk kunnen oplossen vóór de volgende poging).

### Hoe ga je om met het blokkeren van je IP-adressen? {#how-do-you-handle-your-ip-addresses-becoming-blocked}

Wij controleren routinematig alle belangrijke DNS-weigerlijsten en als een van onze mail exchange ("MX") IP-adressen op een belangrijke weigeringslijst staat, zullen we deze indien mogelijk uit de relevante DNS A-record round robin halen totdat het probleem is opgelost.

Op het moment van schrijven staan we ook op verschillende DNS-toestaanlijsten en nemen we het monitoren van weigeringslijsten serieus. Als u problemen ondervindt voordat we de kans hebben gehad deze op te lossen, kunt u ons dit schriftelijk laten weten via <support@forwardemail.net>.

Onze IP-adressen zijn openbaar beschikbaar, [zie dit gedeelte hieronder voor meer inzicht](#what-are-your-servers-ip-addresses).

### Wat zijn postmasteradressen {#what-are-postmaster-addresses}

Om te voorkomen dat e-mails onterecht worden teruggestuurd en dat er geen automatische antwoordberichten naar niet-gecontroleerde of niet-bestaande mailboxen worden gestuurd, houden we een lijst bij met gebruikersnamen die lijken op die van een mailer-daemon:

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
* [en elk no-reply-adres](#what-are-no-reply-addresses)

Zie [RFC 5320 Sectie 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) voor meer inzicht in hoe dit soort lijsten worden gebruikt om efficiënte e-mailsystemen te maken.

### Wat zijn no-reply-adressen {#what-are-no-reply-addresses}

E-mailgebruikersnamen die gelijk zijn aan een van de volgende (hoofdlettergevoelig) worden beschouwd als no-reply-adressen:

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

Deze lijst wordt bijgehouden door [als een open-sourceproject op GitHub](https://github.com/forwardemail/reserved-email-addresses-list).

### Wat zijn de IP-adressen van uw server {#what-are-your-servers-ip-addresses}

Wij publiceren onze IP-adressen op <https://forwardemail.net/ips>.

### Heb je een toestemmingslijst {#do-you-have-an-allowlist}

Ja, we hebben een [lijst met domeinnaamextensies](#what-domain-name-extensions-are-allowlisted-by-default) die standaard op de whitelist staat en een dynamische, gecachte en doorlopende whitelist op basis van [strenge criteria](#what-is-your-allowlist-criteria).

Alle e-mailadressen, domeinen en ontvangers van klanten met betaalde abonnementen worden automatisch toegevoegd aan onze whitelist.

### Welke domeinnaamextensies staan standaard op de toegestane lijst? {#what-domain-name-extensions-are-allowlisted-by-default}

De volgende domeinnaamextensies staan standaard op de whitelist (ongeacht of ze op de Umbrella Popularity List staan of niet):

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
<li class="lijst-inline-item"><code class="notranslate">ct.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">dc.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">de.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">fl.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">ga.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">gu.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">hi.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">ia.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">id.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">il.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">in.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">ks.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">ky.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">la.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">ma.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">md.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">me.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">mi.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">mn.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">mo.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">ms.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">mt.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">nc.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">nd.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">ne.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">nh.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">nj.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">nm.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">nv.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">ny.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">oh.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">ok.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">or.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">pa.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">pr.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">ri.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">sc.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">sd.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">tn.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">tx.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">ut.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">va.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">vi.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">vt.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">wa.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">wi.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">wv.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">wv.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">wy.us</code></li>
<li class="lijst-inline-item"><code class="notranslate">mil.tt</code></li>
<li class="lijst-inline-item"><code class="notranslate">edu.tt</code></li>
<li class="lijst-inline-item"><code class="notranslate">edu.tr</code></li>
<li class="lijst-inline-item"><code class="notranslate">edu.ua</code></li>
<li class="lijst-inline-item"><code class="notranslate">edu.au</code></li>
<li class="lijst-inline-item"><code class="notranslate">ac.at</code></li>
<li class="lijst-inline-item"><code class="notranslate">edu.br</code></li>
<li class="lijst-inline-item"><code class="notranslate">ac.nz</code></li>
<li class="lijst-inline-item"><code class="notranslate">school.nz</code></li>
<li class="lijst-inline-item"><code class="notranslate">cri.nz</code></li>
<li class="lijst-inline-item"><code class="notranslate">gezondheid.nz</code></li>
<li class="lijst-inline-item"><code class="notranslate">mil.nz</code></li>
<li class="lijst-inline-item"><code class="notranslate">parlement.nz</code></li>
<li class="lijst-inline-item"><code class="notranslate">ac.in</code></li>
<li class="lijst-inline-item"><code class="notranslate">edu.in</code></li>
<li class="lijst-inline-item"><code class="notranslate">mil.in</code></li>
<li class="lijst-inline-item"><code class="notranslate">ac.jp</code></li>
<li class="lijst-inline-item"><code class="notranslate">ed.jp</code></li>
<li class="lijst-inline-item"><code class="notranslate">lg.jp</code></li>
<li class="lijst-inline-item"><code class="notranslate">ac.za</code></li>
<li class="lijst-inline-item"><code class="notranslate">edu.za</code></li>
<li class="lijst-inline-item"><code class="notranslate">mil.za</code></li>
<li class="lijst-inline-item"><code class="notranslate">school.za</code></li>
<li class="lijst-inline-item"><code class="notranslate">mil.kr</code></li>
<li class="lijst-inline-item"><code class="notranslate">ac.kr</code></li>
<li class="lijst-inline-item"><code class="notranslate">hs.kr</code></li>
<li class="lijst-inline-item"><code class="notranslate">ms.kr</code></li>
<li class="lijst-inline-item"><code class="notranslate">es.kr</code></li>
<li class="lijst-inline-item"><code class="notranslate">sc.kr</code></li>
<li class="lijst-inline-item"><code class="notranslate">kg.kr</code></li>
<li class="lijst-inline-item"><code class="notranslate">edu.es</code></li>
<li class="lijst-inline-item"><code class="notranslate">ac.lk</code></li>
<li class="lijst-inline-item"><code class="notranslate">sch.lk</code></li>
<li class="lijst-inline-item"><code class="notranslate">edu.lk</code></li>
<li class="lijst-inline-item"><code class="notranslate">ac.th</code></li>
<li class="lijst-inline-item"><code class="notranslate">mi.th</code></li>
<li class="lijst-inline-item"><code class="notranslate">admin.ch</code></li>
<li class="lijst-inline-item"><code class="notranslate">canada.ca</code></li>
<li class="lijst-inline-item"><code class="notranslate">gc.ca</code></li>
<li class="lijst-inline-item"><code class="notranslate">go.id</code></li>
<li class="lijst-inline-item"><code class="notranslate">go.jp</code></li>
<li class="lijst-inline-item"><code class="notranslate">go.ke</code></li>
<li class="lijst-inline-item"><code class="notranslate">go.kr</code></li>
<li class="lijst-inline-item"><code class="notranslate">go.th</code></li>
<li class="lijst-inline-item"><code class="notranslate">gob.ar</code></li>
<li class="lijst-inline-item"><code class="notranslate">gob.cl</code></li>
<li class="lijst-inline-item"><code class="notranslate">gob.es</code></li>
<li class="lijst-inline-item"><code class="notranslate">gob.mx</code></li>
<!--<li class="lijst-inline-item"><code class="notranslate">gob.pe</code></li>-->
<li class="lijst-inline-item"><code class="notranslate">gob.ve</code></li>
<li class="lijst-inline-item"><code class="notranslate">gob.sv</code></li>
<li class="lijst-inline-item"><code class="notranslate">gouv.fr</code></li>
<li class="lijst-inline-item"><code class="notranslate">gouv.nc</code></li>
<li class="lijst-inline-item"><code class="notranslate">gouv.qc.ca</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.ad</code></li>
<li klasse="lijst-inline-item"><code class="notranslate">gov.af</code></li>
<li klasse="lijst-inline-item"><code class="notranslate">gov.ai</code></li>
<li klasse="lijst-inline-item"><code class="notranslate">gov.al</code></li>
<li klasse="lijst-inline-item"><code class="notranslate">gov.am</code></li>
<li klasse="lijst-inline-item"><code class="notranslate">gov.ao</code></li>
<li klasse="lijst-inline-item"><code class="notranslate">gov.au</code></li>
<li klasse="lijst-inline-item"><code class="notranslate">gov.aw</code></li>
<li klasse="lijst-inline-item"><code class="notranslate">gov.ax</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.az</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.bd</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.be</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.bg</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.bm</code></li>
<!--<li class="lijst-inline-item"><code class="notranslate">gov.br</code></li>-->
<li class="lijst-inline-item"><code class="notranslate">gov.by</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.cl</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.cn</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.co</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.cy</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.cz</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.dz</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.eg</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.fi</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.fk</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.gg</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.gr</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.hk</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.hr</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.hu</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.ie</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.il</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.im</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.in</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.iq</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.ir</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.it</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.je</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.kp</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.krd</code></li>
<li class="lijst-inline-item"><code klasse="notranslate">gov.ky</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">gov.kz</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">gov.lb</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">gov.lk</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">gov.lt</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">gov.lv</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">gov.ma</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">gov.mm</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">gov.mo</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">gov.mt</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">gov.my</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">gov.ng</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">gov.np</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">gov.ph</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">gov.pk</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">gov.pl</code></li>
<li klasse="lijst-inline-item"><code class="notranslate">gov.pt</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.py</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.ro</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.ru</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.scot</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.se</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.sg</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.si</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.sk</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.tr</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.tt</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.tw</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.ua</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.uk</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.vn</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.wales</code></li>
<li class="lijst-inline-item"><code class="notranslate">gov.za</code></li>
<li class="list-inline-item"><code class="notranslate">government.pn</code></li>
<li class="list-inline-item"><code class="notranslate">govt.nz</code></li>
<!--<li class="list-inline-item"><code class="notranslate">gub.uy</code></li>-->
<li class="list-inline-item"><code class="notranslate">gv.at</code></li>
<li class="list-inline-item"><code class="notranslate">ac.uk</code></li>
<li class="list-inline-item"><code class="notranslate">bl.uk</code></li>
<li class="list-inline-item"><code class="notranslate">juridische macht.uk</code></li>
<li class="list-inline-item"><code class="notranslate">mod.uk</code></li>
<li class="list-inline-item"><code class="notranslate">nhs.uk</code></li>
<li class="list-inline-item"><code class="notranslate">parliament.uk</code></li>
<li class="list-inline-item"><code class="notranslate">police.uk</code></li>
<li class="list-inline-item"><code class="notranslate">rct.uk</code></li>
<li class="list-inline-item"><code class="notranslate">royal.uk</code></li>
<li class="list-inline-item"><code class="notranslate">sch.uk</code></li>
<li class="list-inline-item"><code class="notranslate">ukaea.uk</code></li>
</ul>

Bovendien zijn deze [merk- en bedrijfstopleveldomeinen](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) standaard op de toegestane lijst geplaatst (bijv. `apple` voor `applecard.apple` voor Apple Card-bankafschriften):

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
<li class="list-inline-item"><code class="notranslate">amex</code></li>
<li class="list-inline-item"><code class="notranslate">amica</code></li>
<li class="list-inline-item"><code class="notranslate">android</code></li>
<li class="list-inline-item"><code class="notranslate">anz</code></li>
<li class="list-inline-item"><code class="notranslate">aol</code></li>
<li class="list-inline-item"><code class="notranslate">apple</code></li>
<li class="list-inline-item"><code class="notranslate">aquarel</code></li>
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
<li class="list-inline-item"><code class="notranslate">basketbal</code></li>
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
<li class="list-inline-item"><code class="notranslate">bond</code></li>
<li class="list-inline-item"><code class="notranslate">boeking</code></li>
<li class="list-inline-item"><code class="notranslate">bosch</code></li>
<li class="list-inline-item"><code class="notranslate">bostik</code></li>
<li class="list-inline-item"><code class="notranslate">bradesco</code></li>
<li class="list-inline-item"><code class="notranslate">bridgestone</code></li>
<li class="list-inline-item"><code class="notranslate">broer</code></li>
<li class="list-inline-item"><code class="notranslate">bugatti</code></li>
<li class="list-inline-item"><code class="notranslate">cal</code></li>
<li class="list-inline-item"><code class="notranslate">calvinklein</code></li>
<li class="list-inline-item"><code class="notranslate">canon</code></li>
<li class="list-inline-item"><code class="notranslate">capitalone</code></li>
<li class="list-inline-item"><code class="notranslate">caravan</code></li>
<li class="list-inline-item"><code class="notranslate">cartier</code></li>
<li class="list-inline-item"><code class="notranslate">cba</code></li>
<li class="list-inline-item"><code class="notranslate">cbn</code></li>
<li class="lijst-inline-item"><code class="notranslate">cbre</code></li>
<li class="lijst-inline-item"><code class="notranslate">cbs</code></li>
<li class="lijst-inline-item"><code class="notranslate">cern</code></li>
<li class="lijst-inline-item"><code class="notranslate">cfa</code></li>
<li class="lijst-inline-item"><code class="notranslate">kanaal</code></li>
<li class="lijst-inline-item"><code class="notranslate">chase</code></li>
<li class="lijst-inline-item"><code class="notranslate">chintai</code></li>
<li class="lijst-inline-item"><code class="notranslate">chrome</code></li>
<li class="lijst-inline-item"><code class="notranslate">chrysler</code></li>
<li class="list-inline-item"><code class="notranslate">cipriani</code></li>
<li class="list-inline-item"><code class="notranslate">cisco</code></li>
<li class="list-inline-item"><code class="notranslate">citadel</code></li>
<li class="list-inline-item"><code class="notranslate">citi</code></li>
<li class="list-inline-item"><code class="notranslate">citic</code></li>
<li class="list-inline-item"><code class="notranslate">clubmed</code></li>
<li class="list-inline-item"><code class="notranslate">comcast</code></li>
<li class="list-inline-item"><code class="notranslate">commbank</code></li>
<li class="list-inline-item"><code class="notranslate">creditunion</code></li>
<li class="list-inline-item"><code class="notranslate">kroon</code></li>
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
<li class="list-inline-item"><code class="notranslate">eurovisie</code></li>
<li class="list-inline-item"><code class="notranslate">everbank</code></li>
<li class="list-inline-item"><code class="notranslate">extraspace</code></li>
<li class="list-inline-item"><code class="notranslate">fage</code></li>
<li class="list-inline-item"><code class="notranslate">fairwinds</code></li>
<li class="list-inline-item"><code class="notranslate">boeren</code></li>
<li class="list-inline-item"><code class="notranslate">fedex</code></li>
<li class="list-inline-item"><code class="notranslate">ferrari</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">ferrero</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">fiat</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">fidelity</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">firestone</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">firmdale</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">flickr</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">flir</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">flsmidth</code></li>
<li klasse="lijst-inline-item"><code class="notranslate">ford</code></li>
<li class="list-inline-item"><code class="notranslate">vos</code></li>
<li class="list-inline-item"><code class="notranslate">fresenius</code></li>
<li class="list-inline-item"><code class="notranslate">forex</code></li>
<li class="list-inline-item"><code class="notranslate">kikkers</code></li>
<li class="list-inline-item"><code class="notranslate">grens</code></li>
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
<li class="list-inline-item"><code class="notranslate">voogd</code></li>
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
<li class="lijst-inline-item"><code class="notranslate">ieee</code></li>
<li class="lijst-inline-item"><code class="notranslate">ifm</code></li>
<li class="lijst-inline-item"><code class="notranslate">ikano</code></li>
<li class="lijst-inline-item"><code class="notranslate">imdb</code></li>
<li class="lijst-inline-item"><code class="notranslate">infiniti</code></li>
<li class="lijst-inline-item"><code class="notranslate">intel</code></li>
<li class="lijst-inline-item"><code class="notranslate">intuit</code></li>
<li class="lijst-inline-item"><code class="notranslate">ipiranga</code></li>
<li class="lijst-inline-item"><code class="notranslate">iselect</code></li>
<li class="list-inline-item"><code class="notranslate">itau</code></li>
<li class="list-inline-item"><code class="notranslate">itv</code></li>
<li class="list-inline-item"><code class="notranslate">iveco</code></li>
<li class="list-inline-item"><code class="notranslate">jaguar</code></li>
<li class="list-inline-item"><code class="notranslate">java</code></li>
<li class="list-inline-item"><code class="notranslate">jcb</code></li>
<li class="list-inline-item"><code class="notranslate">jcp</code></li>
<li class="list-inline-item"><code class="notranslate">jeep</code></li>
<li class="list-inline-item"><code class="notranslate">jpmorgan</code></li>
<li class="list-inline-item"><code class="notranslate">jeneverbes</code></li>
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
<li class="list-inline-item"><code class="notranslate">lancôme</code></li>
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
<li class="list-inline-item"><code class="notranslate">levensstijl</code></li>
<li class="list-inline-item"><code class="notranslate">lilly</code></li>
<li class="list-inline-item"><code class="notranslate">lincoln</code></li>
<li class="list-inline-item"><code class="notranslate">linde</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">lipsy</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">lixil</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">locus</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">lotte</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">lpl</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">lplfinancial</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">lundbeck</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">lupin</code></li>
<li klasse="lijst-inline-item"><code class="notranslate">macys</code></li>
<li class="list-inline-item"><code class="notranslate">maif</code></li>
<li class="list-inline-item"><code class="notranslate">man</code></li>
<li class="list-inline-item"><code class="notranslate">mango</code></li>
<li class="list-inline-item"><code class="notranslate">marriott</code></li>
<li class="list-inline-item"><code class="notranslate">maserati</code></li>
<li class="list-inline-item"><code class="notranslate">mattel</code></li>
<li class="list-inline-item"><code class="notranslate">mckinsey</code></li>
<li class="list-inline-item"><code class="notranslate">metlife</code></li>
<li class="lijst-inline-item"><code class="notranslate">microsoft</code></li>
<li class="lijst-inline-item"><code class="notranslate">mini</code></li>
<li class="lijst-inline-item"><code class="notranslate">mit</code></li>
<li class="lijst-inline-item"><code class="notranslate">mitsubishi</code></li>
<li class="lijst-inline-item"><code class="notranslate">mlb</code></li>
<li class="lijst-inline-item"><code class="notranslate">mma</code></li>
<li class="lijst-inline-item"><code class="notranslate">monash</code></li>
<li class="lijst-inline-item"><code class="notranslate">mormoon</code></li>
<li class="lijst-inline-item"><code class="notranslate">moto</code></li>
<li class="list-inline-item"><code class="notranslate">movistar</code></li>
<li class="list-inline-item"><code class="notranslate">msd</code></li>
<li class="list-inline-item"><code class="notranslate">mountainbike</code></li>
<li class="list-inline-item"><code class="notranslate">mtr</code></li>
<li class="list-inline-item"><code class="notranslate">mutual</code></li>
<li class="list-inline-item"><code class="notranslate">nadex</code></li>
<li class="list-inline-item"><code class="notranslate">landelijk</code></li>
<li class="list-inline-item"><code class="notranslate">natura</code></ li>
<li class="lijst-inline-item"><code class="notranslate">nba</code></li>
<li class="lijst-inline-item"><code class="notranslate">nec</code></li>
<li class="lijst-inline-item"><code class="notranslate">netflix</code></li>
<li class="lijst-inline-item"><code class="notranslate">neustar</code></li>
<li class="lijst-inline-item"><code class="notranslate">newholland</code></li>
<li class="lijst-inline-item"><code class="notranslate">nfl</code></li>
<li class="lijst-inline-item"><code class="notranslate">nhk</code></li>
<li class="lijst-inline-item"><code class="notranslate">nico</code></li>
<li class="lijst-inline-item"><code class="notranslate">nike</code></li>
<li class="list-inline-item"><code class="notranslate">nikon</code></li>
<li class="list-inline-item"><code class="notranslate">nissan</code></li>
<li class="list-inline-item"><code class="notranslate">nissay</code></li>
<li class="list-inline-item"><code class="notranslate">nokia</code></li>
<li class="list-inline-item"><code class="notranslate">northwesternmutual</code></li>
<li class="list-inline-item"><code class="notranslate">norton</code></li>
<li class="list-inline-item"><code class="notranslate">nra</code></li>
<li class="list-inline-item"><code class="notranslate">ntt</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">obi</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">kantoor</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">omega</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">oracle</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">oranje</code></li>
<li klasse="lijst-inline-item"><code klasse="notranslate">otsuka</code></li>
<!--<li klasse="lijst-inline-item"><code klasse="notranslate">ovh</code></li>-->
<li klasse="lijst-inline-item"><code klasse="notranslate">panasonic</code></li>
<li klasse="lijst-inline-item"><code class="notranslate">pccw</code></li>
<li class="list-inline-item"><code class="notranslate">pfizer</code></li>
<li class="list-inline-item"><code class="notranslate">philips</code></li>
<li class="list-inline-item"><code class="notranslate">piaget</code></li>
<li class="list-inline-item"><code class="notranslate">pictet</code></li>
<li class="list-inline-item"><code class="notranslate">ping</code></li>
<li class="list-inline-item"><code class="notranslate">pionier</code></li>
<li class="list-inline-item"><code class="notranslate">play</code></li>
<li class="list-inline-item"><code class="notranslate">playstation</code></li>
<li class="list-inline-item"><code class="notranslate">pohl</code></li>
<li class="list-inline-item"><code class="notranslate">politie</code></li>
<li class="list-inline-item"><code class="notranslate">praxi</code></li>
<li class="list-inline-item"><code class="notranslate">prod</code></li>
<li class="list-inline-item"><code class="notranslate">progressief</code></li>
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
<li class="list-inline-item"><code class="notranslate">RWE</code></li>
<li class="list-inline-item"><code class="notranslate">veiligheid</code></li>
<li class="list-inline-item"><code class="notranslate">Sakura</code></li>
<li class="list-inline-item"><code class="notranslate">Samsung</code></li>
<li class="list-inline-item"><code class="notranslate">Sandvik</code></li>
<li class="list-inline-item"><code class="notranslate">SandvikCoromant</code></li>
<li class="list-inline-item"><code class="notranslate">Sanofi</code></li>
<li class="list-inline-item"><code class="notranslate">SAP</code></li>
<li class="list-inline-item"><code class="notranslate">saxo</code></li>
<li class="lijst-inline-item"><code class="notranslate">sbi</code></li>
<!--<li class="lijst-inline-item"><code class="notranslate">sbs</code></li>-->
<li class="lijst-inline-item"><code class="notranslate">sca</code></li>
<li class="lijst-inline-item"><code class="notranslate">scb</code></li>
<li class="lijst-inline-item"><code class="notranslate">schaeffler</code></li>
<li class="lijst-inline-item"><code class="notranslate">schmidt</code></li>
<li class="lijst-inline-item"><code class="notranslate">schwarz</code></li>
<li class="lijst-inline-item"><code class="notranslate">scjohnson</code></li>
<li class="list-inline-item"><code class="notranslate">scor</code></li>
<li class="list-inline-item"><code class="notranslate">zetel</code></li>
<li class="list-inline-item"><code class="notranslate">sener</code></li>
<li class="list-inline-item"><code class="notranslate">ses</code></li>
<li class="list-inline-item"><code class="notranslate">naaien</code></li>
<li class="list-inline-item"><code class="notranslate">zeven</code></li>
<li class="list-inline-item"><code class="notranslate">sfr</code></li>
<li class="list-inline-item"><code class="notranslate">zoeken</code></li>
<li class="list-inline-item"><code class="notranslate">shangrila</code></li>
<li class="list-inline-item"><code class="notranslate">scherp</code></li>
<li class="list-inline-item"><code class="notranslate">shaw</code></li>
<li class="list-inline-item"><code class="notranslate">shell</code></li>
<li class="list-inline-item"><code class="notranslate">shriram</code></li>
<li class="list-inline-item"><code class="notranslate">sina</code></li>
<li class="list-inline-item"><code class="notranslate">sky</code></li>
<li class="list-inline-item"><code class="notranslate">sky</code></li>
<li class="list-inline-item"><code class="notranslate">skype</code></li>
<li class="list-inline-item"><code class="notranslate">slim</code></li>
<li class="list-inline-item"><code class="notranslate">sncf</code></li>
<li class="list-inline-item"><code class="notranslate">softbank</code></li>
<li class="list-inline-item"><code class="notranslate">sohu</code></li>
<li class="list-inline-item"><code class="notranslate">sony</code></li>
<li class="list-inline-item"><code class="notranslate">spiegel</code></li>
<li class="list-inline-item"><code class="notranslate">stada</code></li>
<li class="list-inline-item"><code class="notranslate">staples</code></li>
<li class="list-inline-item"><code class="notranslate">ster</code></li>
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
<li class="list-inline-item"><code class="notranslate">totaal</code></li>
<li class="list-inline-item"><code class="notranslate">toyota</code></li>
<li class="list-inline-item"><code class="notranslate">travelchannel</code></li>
<li class="list-inline-item"><code class="notranslate">reizigers</code></li>
<li class="list-inline-item"><code class="notranslate">tui</code></li>
<li class="list-inline-item"><code class="notranslate">tv's</code></li>
<li class="list-inline-item"><code class="notranslate">ubs</code></li>
<li class="list-inline-item"><code class="notranslate">unicom</code></li>
<li class="list-inline-item"><code class="notranslate">uol</code></li>
<li class="list-inline-item"><code class="notranslate">ups</code></li>
<li class="list-inline-item"><code class="notranslate">vanguard</code></li>
<li class="list-inline-item"><code class="notranslate">verisign</code></li>
<li class="list-inline-item"><code class="notranslate">vig</code></li>
<li class="list-inline-item"><code class="notranslate">viking</code></li>
<li class="list-inline-item"><code class="notranslate">maagd</code></li>
<li class="list-inline-item"><code class="notranslate">visa</code></li>
<li class="list-inline-item"><code class="notranslate">vista</code></li>
<li class="list-inline-item"><code class="notranslate">vistaprint</code></li>
<li class="list-inline-item"><code class="notranslate">vivo</code></li>
<li class="list-inline-item"><code class="notranslate">volkswagen</code></li>
<li class="lijst-inline-item"><code class="notranslate">volvo</code></li>
<li class="lijst-inline-item"><code class="notranslate">walmart</code></li>
<li class="lijst-inline-item"><code class="notranslate">walter</code></li>
<li class="lijst-inline-item"><code class="notranslate">weatherchannel</code></li>
<li class="lijst-inline-item"><code class="notranslate">weber</code></li>
<li class="lijst-inline-item"><code class="notranslate">stuw</code></li>
<li class="lijst-inline-item"><code class="notranslate">williamhill</code></li>
<li class="lijst-inline-item"><code class="notranslate">windows</code></li>
<li class="lijst-inline-item"><code class="notranslate">wme</code></li>
<li class="lijst-inline-item"><code class="notranslate">wolterskluwer</code></li>
<li class="lijst-inline-item"><code class="notranslate">woodside</code></li>
<li class="lijst-inline-item"><code class="notranslate">wtc</code></li>
<li class="lijst-inline-item"><code class="notranslate">xbox</code></li>
<li class="lijst-inline-item"><code class="notranslate">xerox</code></li>
<li class="lijst-inline-item"><code class="notranslate">xfinity</code></li>
<li class="lijst-inline-item"><code class="notranslate">yahoo</code></li>
<li class="lijst-inline-item"><code class="notranslate">yamaxun</code></li>
<li class="list-inline-item"><code class="notranslate">yandex</code></li>
<li class="list-inline-item"><code class="notranslate">yodobashi</code></li>
<li class="list-inline-item"><code class="notranslate">youtube</code></li>
<li class="list-inline-item"><code class="notranslate">zappos</code></li>
<li class="list-inline-item"><code class="notranslate">zara</code></li>
<li class="list-inline-item"><code class="notranslate">zippo</code></li>
</ul>

Vanaf 18 maart 2025 hebben we ook de volgende Franse overzeese gebieden aan deze lijst toegevoegd ([volgens dit GitHub-verzoek](https://github.com/forwardemail/forwardemail.net/issues/327)):

<ul class="lijst-inline">
<li class="lijst-inline-item"><code class="notranslate">bzh</code></li>
<li class="lijst-inline-item"><code class="notranslate">gf</code></li>
<li class="lijst-inline-item"><code class="notranslate">gp</code></li>
<li class="lijst-inline-item"><code class="notranslate">mq</code></li>
<li class="lijst-inline-item"><code class="notranslate">nc</code></li>
<li class="lijst-inline-item"><code class="notranslate">pf</code></li>
<li class="lijst-inline-item"><code class="notranslate">pm</code></li>
<li class="lijst-inline-item"><code class="notranslate">re</code></li>
<li class="lijst-inline-item"><code class="notranslate">tf</code></li>
<li class="lijst-inline-item"><code class="notranslate">wf</code></li>
<li class="lijst-inline-item"><code class="notranslate">yt</code></li>
</ul>

Vanaf 8 juli 2025 hebben we de volgende Europa-specifieke landen toegevoegd:

<ul class="lijst-inline">
<li class="lijst-inline-item"><code class="notranslate">ax</code></li>
<li class="lijst-inline-item"><code class="notranslate">bg</code></li>
<li class="lijst-inline-item"><code class="notranslate">fo</code></li>
<li class="lijst-inline-item"><code class="notranslate">gi</code></li>
<li class="lijst-inline-item"><code class="notranslate">gr</code></li>
<li class="lijst-inline-item"><code class="notranslate">hr</code></li>
<li class="lijst-inline-item"><code class="notranslate">hu</code></li>
<li class="lijst-inline-item"><code class="notranslate">lt</code></li>
<li class="lijst-inline-item"><code class="notranslate">lu</code></li>
<li class="lijst-inline-item"><code class="notranslate">mc</code></li>
<li class="lijst-inline-item"><code class="notranslate">mk</code></li>
<li class="lijst-inline-item"><code class="notranslate">mt</code></li>
<li class="lijst-inline-item"><code class="notranslate">ro</code></li>
<li class="lijst-inline-item"><code class="notranslate">sk</code></li>
<li class="lijst-inline-item"><code class="notranslate">va</code></li>
</ul>

We hebben `cz`, `ru` en `ua` specifiek niet opgenomen vanwege de hoge spamactiviteit.

### Wat zijn uw criteria voor de toelatingslijst? {#what-is-your-allowlist-criteria}

We hebben een statische lijst van [domeinnaamextensies standaard op de toegestane lijst](#what-domain-name-extensions-are-allowlisted-by-default) en we onderhouden ook een dynamische, gecachte, doorlopende allowlist op basis van de volgende strikte criteria:

* Het rootdomein van de afzender moet een [domeinnaamextensie die overeenkomt met de lijst die we aanbieden in ons gratis abonnement](#what-domain-name-extensions-can-be-used-for-free) zijn (met de toevoeging van `biz` en `info`). We nemen ook gedeeltelijke overeenkomsten op voor `edu`, `gov` en `mil`, zoals `xyz.gov.au` en `xyz.edu.au`.
* Het rootdomein van de afzender moet zich in de top 100.000 unieke rootdomeinen bevinden die zijn geparseerd in [Paraplu populariteitslijst](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL").
* Het rootdomein van de afzender moet zich in de top 50.000 resultaten bevinden van unieke rootdomeinen die voorkomen in ten minste 4 van de afgelopen 7 dagen van UPL's (ongeveer 50%+).
* Het rootdomein van de afzender mag niet [gecategoriseerd](https://radar.cloudflare.com/categorization-feedback/) zijn, aangezien het door Cloudflare als adult-content of malware wordt beschouwd. * Het rootdomein van de afzender moet A- of MX-records hebben.
* Het rootdomein van de afzender moet A-record(s), MX-record(s), een DMARC-record met de kwalificatie `biz`0 of `biz`1, of een SPF-record met de kwalificatie `biz`2 of `biz`3 hebben.

Als aan deze criteria is voldaan, wordt het rootdomein van de afzender 7 dagen in de cache opgeslagen. Houd er rekening mee dat onze geautomatiseerde taak dagelijks wordt uitgevoerd; dit is dus een doorlopende cache voor de toegestane lijst die dagelijks wordt bijgewerkt.

Onze geautomatiseerde taak downloadt de voorgaande 7 dagen aan UPL-bestanden in het geheugen, pakt ze uit en parseert ze vervolgens in het geheugen volgens de bovenstaande strikte criteria.

Populaire domeinen op het moment van schrijven zijn uiteraard inbegrepen, zoals Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify en meer.

Als u een afzender bent die niet op onze whitelist staat, krijgt u de eerste keer dat uw FQDN-rootdomein of IP-adres een e-mail verzendt de status [tarief beperkt](#do-you-have-rate-limiting) en [grijze lijst](#do-you-have-a-greylist). Dit is een standaardprocedure die wordt gehanteerd als e-mailstandaard. De meeste e-mailserverclients proberen het opnieuw als ze een foutmelding over de snelheidslimiet of de grijze lijst ontvangen (bijvoorbeeld een foutstatuscode 421 of 4xx).

**Houd er rekening mee dat specifieke afzenders zoals `a@gmail.com`, `b@xyz.edu` en `c@gov.au` nog steeds [geweigerd op de lijst](#do-you-have-a-denylist) kunnen zijn** (bijvoorbeeld als we automatisch spam, phishing of malware van die afzenders detecteren).

### Welke domeinnaamextensies kunnen gratis worden gebruikt {#what-domain-name-extensions-can-be-used-for-free}

Vanaf 31 maart 2023 hebben we een nieuwe, algemene spamregel ingevoerd om onze gebruikers en service te beschermen.

Deze nieuwe regel staat alleen toe dat de volgende domeinnaamextensies gebruikt worden in ons gratis abonnement:

<ul class="lijst-inline">
<li class="lijst-inline-item"><code class="notranslate">ac</code></li>
<li class="lijst-inline-item"><code class="notranslate">ad</code></li>
<li class="lijst-inline-item"><code class="notranslate">ag</code></li>
<li class="lijst-inline-item"><code class="notranslate">ai</code></li>
<li class="lijst-inline-item"><code class="notranslate">al</code></li>
<li class="lijst-inline-item"><code class="notranslate">am</code></li>
<li class="lijst-inline-item"><code class="notranslate">app</code></li>
<li class="lijst-inline-item"><code class="notranslate">as</code></li>
<li class="lijst-inline-item"><code class="notranslate">at</code></li>
<li class="list-inline-item"><code class="notranslate">au</code></li>
<li class="list-inline-item"><code class="notranslate">ba</code></li>
<li class="list-inline-item"><code class="notranslate">be</code></li>
<li class="list-inline-item"><code class="notranslate">br</code></li>
<li class="list-inline-item"><code class="notranslate">by</code></li>
<li class="list-inline-item"><code class="notranslate">ca</code></li>
<li class="list-inline-item"><code class="notranslate">cc</code></li>
<li class="list-inline-item"><code class="notranslate">cd</code></li>
<li class="list-inline-item"><code class="notranslate">ch</code></li>
<li class="lijst-inline-item"><code class="notranslate">ck</code></li>
<li class="lijst-inline-item"><code class="notranslate">co</code></li>
<li class="lijst-inline-item"><code class="notranslate">com</code></li>
<li class="lijst-inline-item"><code class="notranslate">de</code></li>
<li class="lijst-inline-item"><code class="notranslate">dev</code></li>
<li class="lijst-inline-item"><code class="notranslate">dj</code></li>
<li class="lijst-inline-item"><code class="notranslate">dk</code></li>
<li class="lijst-inline-item"><code class="notranslate">ee</code></li>
<li class="lijst-inline-item"><code class="notranslate">es</code></li>
<li class="lijst-inline-item"><code class="notranslate">eu</code></li>
<li class="lijst-inline-item"><code class="notranslate">familie</code></li>
<li class="lijst-inline-item"><code class="notranslate">fi</code></li>
<li class="lijst-inline-item"><code class="notranslate">fm</code></li>
<li class="lijst-inline-item"><code class="notranslate">fr</code></li>
<li class="lijst-inline-item"><code class="notranslate">gg</code></li>
<li class="lijst-inline-item"><code class="notranslate">gl</code></li>
<li class="lijst-inline-item"><code class="notranslate">id</code></li>
<li class="list-inline-item"><code class="notranslate">ie</code></li>
<li class="list-inline-item"><code class="notranslate">il</code></li>
<li class="list-inline-item"><code class="notranslate">im</code></li>
<li class="list-inline-item"><code class="notranslate">in</code></li>
<li class="list-inline-item"><code class="notranslate">io</code></li>
<li class="list-inline-item"><code class="notranslate">ir</code></li>
<li class="list-inline-item"><code class="notranslate">is</code></li>
<li class="list-inline-item"><code class="notranslate">it</code></li>
<li class="list-inline-item"><code class="notranslate">je</code></li>
<li class="lijst-inline-item"><code class="notranslate">jp</code></li>
<li class="lijst-inline-item"><code class="notranslate">ke</code></li>
<li class="lijst-inline-item"><code class="notranslate">kr</code></li>
<li class="lijst-inline-item"><code class="notranslate">la</code></li>
<li class="lijst-inline-item"><code class="notranslate">li</code></li>
<li class="lijst-inline-item"><code class="notranslate">lv</code></li>
<li class="lijst-inline-item"><code class="notranslate">ly</code></li>
<li class="lijst-inline-item"><code class="notranslate">md</code></li>
<li class="lijst-inline-item"><code class="notranslate">me</code></li>
<li class="lijst-inline-item"><code class="notranslate">mn</code></li>
<li class="lijst-inline-item"><code class="notranslate">ms</code></li>
<li class="lijst-inline-item"><code class="notranslate">mu</code></li>
<li class="lijst-inline-item"><code class="notranslate">mx</code></li>
<li class="lijst-inline-item"><code class="notranslate">net</code></li>
<li class="lijst-inline-item"><code class="notranslate">ni</code></li>
<li class="lijst-inline-item"><code class="notranslate">nl</code></li>
<li class="lijst-inline-item"><code class="notranslate">nee</code></li>
<li class="lijst-inline-item"><code class="notranslate">nu</code></li>
<li class="list-inline-item"><code class="notranslate">nz</code></li>
<li class="list-inline-item"><code class="notranslate">org</code></li>
<li class="list-inline-item"><code class="notranslate">pl</code></li>
<li class="list-inline-item"><code class="notranslate">pr</code></li>
<li class="list-inline-item"><code class="notranslate">pt</code></li>
<li class="list-inline-item"><code class="notranslate">pw</code></li>
<li class="list-inline-item"><code class="notranslate">rs</code></li>
<li class="list-inline-item"><code class="notranslate">sc</code></li>
<li class="list-inline-item"><code class="notranslate">se</code></li>
<li klasse="lijst-inline-item"><code class="notranslate">sh</code></li>
<li klasse="lijst-inline-item"><code class="notranslate">si</code></li>
<li klasse="lijst-inline-item"><code class="notranslate">sm</code></li>
<li klasse="lijst-inline-item"><code class="notranslate">sr</code></li>
<li klasse="lijst-inline-item"><code class="notranslate">st</code></li>
<li klasse="lijst-inline-item"><code class="notranslate">tc</code></li>
<li klasse="lijst-inline-item"><code class="notranslate">tm</code></li>
<li klasse="lijst-inline-item"><code class="notranslate">to</code></li>
<li klasse="lijst-inline-item"><code class="notranslate">tv</code></li>
<li class="list-inline-item"><code class="notranslate">vk</code></li>
<li class="list-inline-item"><code class="notranslate">vz</code></li>
<li class="list-inline-item"><code class="notranslate">vg</code></li>
<li class="list-inline-item"><code class="notranslate">vu</code></li>
<li class="list-inline-item"><code class="notranslate">ws</code></li>
<li class="list-inline-item"><code class="notranslate">xyz</code></li>
<li class="list-inline-item"><code class="notranslate">za</code></li>
</ul>

### Heb je een grijze lijst {#do-you-have-a-greylist}

Ja, we hanteren een zeer laks [e-mail greylisting](https://en.wikipedia.org/wiki/Greylisting_\(email\)) beleid. Greylisting is alleen van toepassing op afzenders die niet op onze whitelist staan en blijft 30 dagen in onze cache staan.

Voor elke nieuwe verzender bewaren we 30 dagen lang een sleutel in onze Redis-database met een waarde die is ingesteld op de oorspronkelijke aankomsttijd van hun eerste verzoek. Vervolgens wijzen we hun e-mail af met een retry-statuscode van 450 en laten we deze pas door nadat er 5 minuten zijn verstreken.

Als ze na deze initiële aankomsttijd 5 minuten hebben gewacht, worden hun e-mails geaccepteerd en ontvangen ze geen statuscode 450.

De sleutel bestaat uit het FQDN-rootdomein of het IP-adres van de afzender. Dit betekent dat elk subdomein dat de grijze lijst passeert, ook doorgaat naar het rootdomein, en vice versa (dit is wat we bedoelen met een "zeer laks" beleid).

Als een e-mail bijvoorbeeld afkomstig is van `test.example.com` voordat we een e-mail van `example.com` zien, moet elke e-mail van `test.example.com` en/of `example.com` 5 minuten wachten vanaf de initiële aankomsttijd van de verbinding. We laten `test.example.com` en `example.com` niet elk hun eigen wachttijd van 5 minuten hebben (ons greylistingbeleid is van toepassing op het niveau van het rootdomein).

Houd er rekening mee dat greylisting niet van toepassing is op de verzenders op onze [toegestane lijst](#do-you-have-an-allowlist) (bijv. Meta, Amazon, Netflix, Google, Microsoft op het moment van schrijven).

### Heb je een weigeringslijst {#do-you-have-a-denylist}

Ja, we beheren onze eigen weigeringslijst en werken deze automatisch in realtime en handmatig bij op basis van gedetecteerde spam en schadelijke activiteiten.

We halen ook elk uur alle IP-adressen op van de UCEPROTECT Level 1-weigerlijst op <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> en voegen deze toe aan onze weigeringslijst met een vervaldatum van 7 dagen.

Afzenders die op de weigeringslijst staan, krijgen foutcode 421 (waarmee de afzender wordt gevraagd het later opnieuw te proberen) als ze [staan niet op de toegestane lijst](#do-you-have-an-allowlist).

Door een 421-statuscode te gebruiken in plaats van een 554-statuscode, kunnen potentiële foutpositieve meldingen in real-time worden verminderd en kan het bericht bij de volgende poging succesvol worden afgeleverd.

**Dit is anders dan andere e-maildiensten**, waarbij een blokkeringslijst een permanente foutmelding geeft als u op een blokkeerlijst wordt geplaatst. Het is vaak moeilijk om afzenders te vragen berichten opnieuw te verzenden (vooral van grote organisaties). Daarom geeft deze aanpak ongeveer 5 dagen vanaf de eerste e-mailpoging, zodat de afzender, de ontvanger of wij kunnen ingrijpen en het probleem kunnen verhelpen (door verwijdering van de blokkeerlijst aan te vragen).

Alle verzoeken om verwijdering van de weigeringslijst worden in realtime door beheerders bewaakt (bijvoorbeeld zodat terugkerende foutpositieve resultaten permanent door beheerders op de witte lijst kunnen worden geplaatst).

Verzoeken om verwijdering van de weigeringslijst kunnen worden ingediend via <https://forwardemail.net/denylist>.. Bij betalende gebruikers worden de verzoeken om verwijdering van de weigeringslijst direct verwerkt, terwijl niet-betalende gebruikers moeten wachten tot de beheerders hun verzoek verwerken.

Verzenders waarvan wordt vastgesteld dat ze spam of virussen verzenden, worden op de volgende manier aan de weigeringslijst toegevoegd:

1. De [eerste berichtvingerafdruk](#how-do-you-determine-an-email-fingerprint) wordt op de grijze lijst geplaatst bij detectie van spam of een blokkeerlijst van een "vertrouwde" afzender (bijv. `gmail.com`, `microsoft.com`, `apple.com`).
* Als de afzender op de witte lijst stond, wordt het bericht 1 uur op de grijze lijst geplaatst.
* Als de afzender niet op de witte lijst stond, wordt het bericht 6 uur op de grijze lijst geplaatst.
2. We parseren de sleutels van de weigeringslijst op basis van informatie over de afzender en het bericht. Voor elk van deze sleutels maken we (indien er nog geen bestaat) een teller aan, verhogen deze met 1 en cachen deze gedurende 24 uur.
* Voor afzenders op de witte lijst:
* Voeg een sleutel toe voor het e-mailadres "MAIL FROM" als het een geldige SPF-waarde had of niet, en het niet [een postmaster-gebruikersnaam](#what-are-postmaster-addresses) of [een gebruikersnaam zonder antwoord](#what-are-no-reply-addresses) was. * Als de header "From" op de whitelist stond, voeg dan een sleutel toe voor het e-mailadres in de header "From" als dit voldoet aan de SPF- of DKIM-vereisten.
* Als de header "From" niet op de whitelist stond, voeg dan een sleutel toe voor het e-mailadres in de header "From" en de bijbehorende geparseerde root-domeinnaam.
* Voor afzenders die niet op de whitelist stonden:
* Voeg een sleutel toe voor het e-mailadres in de envelop "MAIL FROM" als dit voldoet aan de SPF-vereisten.
* Als de header "From" op de whitelist stond, voeg dan een sleutel toe voor het e-mailadres in de header "From" als dit voldoet aan de SPF- of DKIM-vereisten.
* Als de header "From" niet op de whitelist stond, voeg dan een sleutel toe voor het e-mailadres in de header "From" en de bijbehorende geparseerde root-domeinnaam.
* Voeg een sleutel toe voor het externe IP-adres van de afzender.
* Voeg een sleutel toe voor de door de client opgeloste hostnaam door middel van reverse lookup vanaf het IP-adres van de afzender (indien van toepassing). * Voeg een sleutel toe voor het rootdomein van de door de client opgeloste hostnaam (indien van toepassing en indien deze verschilt van de door de client opgeloste hostnaam).
3. Als de teller 5 bereikt voor een afzender en sleutel die niet op de toegestane lijst staan, plaatsen we de sleutel 30 dagen op de weigerlijst en sturen we een e-mail naar ons misbruikteam. Deze getallen kunnen wijzigen en updates worden hier weergegeven naarmate we misbruik monitoren.
4. Als de teller 10 bereikt voor een afzender en sleutel die wel op de toegestane lijst staan, plaatsen we de sleutel 7 dagen op de weigerlijst en sturen we een e-mail naar ons misbruikteam. Deze getallen kunnen wijzigen en updates worden hier weergegeven naarmate we misbruik monitoren.

**LET OP:** In de nabije toekomst introduceren we reputatiemonitoring. Reputatiemonitoring berekent in plaats daarvan wanneer een afzender op de weigeringslijst moet worden geplaatst op basis van een percentagedrempel (in tegenstelling tot een rudimentaire teller zoals hierboven vermeld).

### Heb je een snelheidsbeperking voor {#do-you-have-rate-limiting}

De snelheidsbeperking van de afzender wordt bepaald door het rootdomein dat wordt geparseerd via een omgekeerde PTR-lookup op het IP-adres van de afzender. Als dat geen resultaat oplevert, wordt het IP-adres van de afzender gebruikt. Merk op dat we dit hieronder `Sender` noemen.

Onze MX-servers hebben dagelijkse limieten voor binnenkomende e-mail ontvangen voor [gecodeerde IMAP-opslag](/blog/docs/best-quantum-safe-encrypted-email-service):

* In plaats van de snelheidslimiet voor inkomende e-mail te beperken op basis van een individuele alias (bijv. `you@yourdomain.com`), beperken we de snelheid op basis van de domeinnaam van de alias zelf (bijv. `yourdomain.com`). Dit voorkomt dat `Senders` de inbox van alle aliassen binnen uw domein tegelijk overspoelt.

* We hanteren algemene limieten die van toepassing zijn op alle `Senders`-e-mails binnen onze service, ongeacht de ontvanger:
* `Senders`-e-mails die we als "vertrouwd" beschouwen als bron van waarheid (bijv. `gmail.com`, `microsoft.com`, `apple.com`) zijn beperkt tot het verzenden van 100 GB per dag.
* `Senders`-e-mails die [op de toelatingslijst geplaatst](#do-you-have-an-allowlist) zijn, zijn beperkt tot het verzenden van 10 GB per dag. * Alle andere `yourdomain.com`0-servers mogen maximaal 1 GB en/of 1000 berichten per dag versturen.
* We hanteren een specifieke limiet per `yourdomain.com`1 en `yourdomain.com`2 van 1 GB en/of 1000 berichten per dag.

De MX-servers beperken ook de doorstuurmogelijkheden naar een of meer ontvangers door middel van snelheidsbeperking, maar dit geldt alleen voor `Senders` en niet voor [toegestane lijst](#do-you-have-an-allowlist):

* We staan maximaal 100 verbindingen per uur toe, per `Sender` opgelost FQDN-rootdomein (of) `Sender` extern IP-adres (indien er geen reverse PTR beschikbaar is), en per envelopontvanger. We slaan de sleutel voor snelheidsbeperking op als een cryptografische hash in onze Redis-database.

* Als u e-mails via ons systeem verstuurt, zorg er dan voor dat u voor al uw IP-adressen een omgekeerde PTR instelt (anders wordt elk uniek FQDN-hoofddomein of IP-adres waarvandaan u verzendt, beperkt in snelheid).

* Houd er rekening mee dat als u via een populair systeem als Amazon SES verzendt, er geen tariefbeperking geldt, aangezien Amazon SES (op het moment van schrijven) op onze whitelist staat.

* Als u verzendt vanaf een domein zoals `test.abc.123.example.com`, wordt de limiet toegepast op `example.com`. Veel spammers gebruiken honderden subdomeinen om veelgebruikte spamfilters te omzeilen die alleen limieten instellen voor unieke hostnamen in plaats van voor unieke FQDN-rootdomeinen.

* `Senders` die de tarieflimiet overschrijden, worden afgewezen met een 421-fout.

Onze IMAP- en SMTP-servers beperken de mogelijkheid dat uw aliassen meer dan `60` gelijktijdige verbindingen hebben.

Onze MX-servers beperken het aantal gelijktijdige verbindingen voor [niet-toegestane lijst](#do-you-have-an-allowlist)-zenders (met een cachevervaldatum van 3 minuten voor de teller, wat overeenkomt met onze socket-time-out van 3 minuten).

### Hoe bescherm je jezelf tegen backscatter {#how-do-you-protect-against-backscatter}

Verkeerd geadresseerde bounces of bounce spam (ook wel "[Terugverstrooiing](https://en.wikipedia.org/wiki/Backscatter_\(email\)" genoemd) kunnen een negatieve reputatie veroorzaken bij de IP-adressen van de verzenders.

We nemen twee stappen om bescherming te bieden tegen backscatter. Deze worden gedetailleerd beschreven in de secties [Voorkom bounces van bekende MAIL FROM-spammers](#prevent-bounces-from-known-mail-from-spammers) en [Voorkom onnodige stuiters om te beschermen tegen backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter).

### Voorkom bounces van bekende MAIL FROM-spammers {#prevent-bounces-from-known-mail-from-spammers}

Elk uur halen we op <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> de lijst op uit [Backscatter.org](https://www.backscatterer.org/) (aangedreven door [UCEPROTECT](https://www.uceprotect.net/)) en voeren deze in in onze Redis-database (we vergelijken ook vooraf de verschillen, voor het geval er IP's zijn verwijderd die moeten worden gerespecteerd).

Als MAIL FROM leeg is OF gelijk is aan (hoofdlettergevoelig) een van de [adressen van postmeesters](#what-are-postmaster-addresses) (het gedeelte vóór de @ in een e-mail), dan controleren we of het IP-adres van de afzender overeenkomt met een IP-adres uit deze lijst.

Als het IP-adres van de afzender vermeld staat (en niet in onze [toegestane lijst](#do-you-have-an-allowlist)), sturen we een 554-foutmelding met de melding `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`. We worden gewaarschuwd als een afzender zowel op de backscattererlijst als op onze whitelist staat, zodat we het probleem indien nodig kunnen oplossen.

De technieken die in deze sectie worden beschreven, voldoen aan de aanbeveling "SAFE MODE" in <https://www.backscatterer.org/?target=usage>, waarbij we het IP-adres van de afzender alleen controleren als aan bepaalde voorwaarden is voldaan.

### Voorkom onnodige bounces om te beschermen tegen backscatter {#prevent-unnecessary-bounces-to-protect-against-backscatter}

Bounces zijn e-mails die aangeven dat het doorsturen van de e-mail naar de ontvanger volledig is mislukt en dat de e-mail niet opnieuw zal worden verzonden.

Een veelvoorkomende reden om op de Backscatterer-lijst te worden vermeld, zijn verkeerd geadresseerde bounces of bounce-spam. We moeten ons hiertegen op een aantal manieren beschermen:

1. We versturen alleen e-mails als er >= 500 statuscodefouten optreden (wanneer pogingen om e-mails door te sturen mislukt zijn, bijvoorbeeld wanneer Gmail reageert met een 500-fout).

2. We versturen slechts één keer en alleen één keer (we gebruiken een berekende bounce-vingerafdruksleutel en slaan deze op in de cache om te voorkomen dat er duplicaten worden verzonden). De bounce-vingerafdruk is een sleutel die de vingerafdruk van het bericht is, gecombineerd met een hash van het bounce-adres en de bijbehorende foutcode. Zie het gedeelte over [Vingerafdrukken](#how-do-you-determine-an-email-fingerprint) voor meer informatie over hoe de bericht-vingerafdruk wordt berekend. Succesvol verzonden bounce-vingerafdrukken vervallen na 7 dagen in onze Redis-cache.

3. Wij versturen alleen wanneer MAIL FROM en/of From niet leeg is en geen [gebruikersnaam postmeester](#what-are-postmaster-addresses) (het gedeelte vóór de @ in een e-mail) bevat (hoofdlettergevoelig).

4. We versturen geen e-mail als het oorspronkelijke bericht een van de volgende headers bevat (hoofdlettergevoelig):

* Header van `auto-submitted` met een waarde die niet gelijk is aan `no`.
* Header van `x-auto-response-suppress` met een waarde van `dr`, `autoreply`, `auto-reply`, `auto_reply` of `all`.
* Header van `list-id`, `list-subscribe`, `no`0, `no`1, `no`2, `no`3, `no`4, `no`5, `no`6 of `no`7 (ongeacht de waarde).
* Header van `no`8 met een waarde van `no`9, `x-auto-response-suppress`0, `x-auto-response-suppress`1, `x-auto-response-suppress`2 of `x-auto-response-suppress`3.

5. We versturen niets als het MAIL FROM- of Van-e-mailadres eindigt op `+donotreply`, `-donotreply`, `+noreply` of `-noreply`.

6. We versturen geen e-mail als het Van-e-mailadres als gebruikersnaam `mdaemon` heeft en de hoofdletterongevoelige header `X-MDDSN-Message` is.

7. We versturen niets als er een hoofdletterongevoelige `content-type` header van `multipart/report` is.

### Hoe bepaal je een e-mailvingerafdruk {#how-do-you-determine-an-email-fingerprint}

De vingerafdruk van een e-mailbericht wordt gebruikt om de uniciteit van een e-mailbericht te bepalen en om te voorkomen dat dubbele berichten worden afgeleverd en [dubbele bounces](#prevent-unnecessary-bounces-to-protect-against-backscatter) wordt verzonden.

De vingerafdruk wordt berekend aan de hand van de volgende lijst:

* Client-resolve FQDN-hostnaam of IP-adres
* `Message-ID` headerwaarde (indien van toepassing)
* `Date` headerwaarde (indien van toepassing)
* `From` headerwaarde (indien van toepassing)
* `To` headerwaarde (indien van toepassing)
* `Cc` headerwaarde (indien van toepassing)
* `Subject` headerwaarde (indien van toepassing)
* `Body` waarde (indien van toepassing)

### Kan ik e-mails doorsturen naar andere poorten dan 25 (bijvoorbeeld als mijn internetprovider poort 25 heeft geblokkeerd) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Ja, sinds 5 mei 2020 hebben we deze functie toegevoegd. Momenteel is de functie domeinspecifiek, in plaats van aliasspecifiek. Als u aliasspecifiek wilt zijn, neem dan contact met ons op om uw wensen te bespreken.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Verbeterde privacybescherming:
</strong>
<span>
Als je een betaald abonnement hebt (met verbeterde privacybescherming), ga dan naar <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a>, klik op "Instellingen" naast je domein en klik vervolgens op "Instellingen". Wil je meer weten over betaalde abonnementen? Bekijk dan onze pagina <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Prijzen</a>. Anders kun je de onderstaande instructies volgen.
</span>
</div>

Als u het gratis abonnement gebruikt, kunt u eenvoudig een nieuw DNS <strong class="notranslate">TXT</strong>-record toevoegen zoals hieronder weergegeven, maar wijzig de poort van 25 naar de poort van uw keuze.

Als ik bijvoorbeeld wil dat alle e-mails die naar `example.com` gaan, worden doorgestuurd naar de SMTP-poort 1337 van de aliasontvanger in plaats van 25:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Naam/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Type</th>
<th>Antwoord/Waarde</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", of leeg</em></td>
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
Het meest voorkomende scenario voor aangepaste poortdoorschakeling is wanneer u alle e-mails die naar example.com gaan, wilt doorsturen naar een andere poort op example.com, dan de SMTP-standaard van poort 25. Om dit in te stellen, voegt u eenvoudig de volgende <strong class="notranslate">TXT</strong> catch-all-record toe.
<span>
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Naam/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Type</th>
<th>Antwoord/Waarde</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", of leeg</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=example.com</code></td>
</tr>
</tbody>
</table>

### Ondersteunt het het plus-symbool voor Gmail-aliassen {#does-it-support-the-plus--symbol-for-gmail-aliases}

Jazeker.

### Ondersteunt het subdomeinen {#does-it-support-sub-domains}

Jazeker. In plaats van "@", "." of een spatie als naam/host/alias te gebruiken, gebruikt u gewoon de subdomeinnaam als waarde.

Als u wilt dat `foo.example.com` e-mails doorstuurt, voert u `foo` in als de naam/host/alias-waarde in uw DNS-instellingen (voor zowel MX- als <strong class="notranslate">TXT</strong>-records).

### Stuurt dit de headers van mijn e-mail door? {#does-this-forward-my-emails-headers}

Jazeker.

### Is dit goed getest {#is-this-well-tested}

Ja, er zijn testen geschreven met [ava](https://github.com/avajs/ava) en er is ook codedekking.

### Geeft u SMTP-antwoordberichten en codes door {#do-you-pass-along-smtp-response-messages-and-codes}

Jazeker. Als u bijvoorbeeld een e-mail naar `hello@example.com` stuurt en deze is geregistreerd om door te sturen naar `user@gmail.com`, dan worden het SMTP-antwoordbericht en de code van de SMTP-server "gmail.com" teruggestuurd in plaats van de proxyserver op "mx1.forwardemail.net" of "mx2.forwardemail.net".

### Hoe voorkom je spammers en zorg je voor een goede reputatie bij het doorsturen van e-mails? {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Zie onze secties over [Hoe werkt uw e-mail doorstuursysteem?](#how-does-your-email-forwarding-system-work), [Hoe gaat u om met problemen met e-mailbezorging?](#how-do-you-handle-email-delivery-issues) en [Hoe ga je om met het blokkeren van je IP-adressen?](#how-do-you-handle-your-ip-addresses-becoming-blocked) hierboven.

### Hoe voer je DNS-lookups uit op domeinnamen {#how-do-you-perform-dns-lookups-on-domain-names}

We hebben een open-source softwareproject :tangerine: [Mandarijn](https://github.com/forwardemail/tangerine) ontwikkeld en gebruiken dit voor DNS-lookups. De standaard DNS-servers die worden gebruikt, zijn `1.1.1.1` en `1.0.0.1`, en DNS-query's verlopen via [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") op applicatieniveau.

:tangerine: [Mandarijn](https://github.com/tangerine) gebruikt standaard [CloudFlare's privacy-first consumer DNS-service][cloudflare-dns].

## Account en facturering {#account-and-billing}

### Biedt u een geld-terug-garantie op betaalde abonnementen {#do-you-offer-a-money-back-guarantee-on-paid-plans}

Ja! Automatische terugbetalingen vinden plaats wanneer u uw account binnen 30 dagen na de startdatum van uw abonnement upgradet, downgradet of opzegt. Dit geldt alleen voor nieuwe klanten.

### Als ik van abonnement verander, wordt het verschil dan naar rato berekend en terugbetaald? {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

We berekenen het verschil niet naar rato en betalen het ook niet terug wanneer u van abonnement wisselt. In plaats daarvan rekenen we de resterende looptijd vanaf de vervaldatum van uw huidige abonnement om naar de dichtstbijzijnde relatieve looptijd voor uw nieuwe abonnement (afgerond per maand).

Houd er rekening mee dat als u binnen 30 dagen na de start van een betaald abonnement een upgrade of downgrade uitvoert naar een ander betaald abonnement, wij automatisch het volledige bedrag van uw bestaande abonnement terugbetalen.

### Kan ik deze e-mail doorstuurservice gewoon gebruiken als een "fallback" of "fallover" MX-server {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

Nee, dit wordt afgeraden, omdat u slechts één mail exchange-server tegelijk kunt gebruiken. Fallbacks worden meestal niet opnieuw geprobeerd vanwege verkeerde prioriteitsconfiguraties en mailservers die de MX exchange-prioriteitscontrole niet respecteren.

### Kan ik specifieke aliassen uitschakelen {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Belangrijk:
</strong>
<span>
Als je een betaald abonnement hebt, ga dan naar <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mijn account <i class="fa fa-angle-right"></i>Domeinen</a> <i class="fa fa-angle-right"></i> Aliassen <i class="fa fa-angle-right"></i> Alias bewerken <i class="fa fa-angle-right"></i> Vink het vakje 'Actief' uit <i class="fa fa-angle-right"></i> Doorgaan.
</span>
</div>

Ja, u kunt eenvoudig uw DNS <strong class="notranslate">TXT</strong>-record bewerken en de alias laten voorafgaan door één, twee of drie uitroeptekens (zie hieronder).

Houd er rekening mee dat u de ":"-toewijzing *moet* behouden, omdat dit vereist is als u dit ooit wilt uitschakelen (en het wordt ook gebruikt voor het importeren als u upgradet naar een van onze betaalde abonnementen).

**Voor stille afwijzing (het lijkt voor de afzender alsof het bericht succesvol is verzonden, maar het bericht gaat in werkelijkheid nergens heen) (statuscode `250`):** Als u een alias vooraf laat gaan door "!" (enkel uitroepteken), dan wordt de statuscode `250` voor succesvol verzenden geretourneerd aan afzenders die naar dit adres proberen te verzenden. De e-mails zelf gaan echter nergens heen (bijvoorbeeld naar een blackhole of `/dev/null`).

**Voor zachte afwijzing (statuscode `421`):** Als u een alias vooraf laat gaan door "!!" (dubbel uitroepteken), wordt de zachte foutstatuscode `421` geretourneerd aan verzenders die naar dit adres proberen te verzenden. Vaak worden de e-mails tot 5 dagen lang opnieuw verzonden voordat ze worden afgewezen en teruggestuurd.

**Voor harde afwijzing (statuscode `550`):** Als u een alias vooraf laat gaan door "!!!" (drie uitroeptekens), wordt de permanente foutstatuscode `550` geretourneerd aan verzenders die naar dit adres proberen te verzenden. De e-mails worden afgewezen en teruggestuurd.

Als ik bijvoorbeeld wil dat alle e-mails die naar `alias@example.com` gaan, niet meer naar `user@gmail.com` worden doorgestuurd en dus worden afgewezen en teruggestuurd (gebruik dan bijvoorbeeld drie uitroeptekens):

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Naam/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Type</th>
<th>Antwoord/Waarde</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", of leeg</em></td>
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
Je kunt het adres van de doorgestuurde ontvanger ook herschrijven naar "nobody@forwardemail.net", waardoor het naar niemand wordt doorgestuurd, zoals in het onderstaande voorbeeld.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Naam/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Type</th>
<th>Antwoord/Waarde</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", of leeg</em></td>
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
Als u de beveiliging wilt verhogen, kunt u ook het gedeelte ":user@gmail.com" (of ":nobody@forwardemail.net") verwijderen, zodat alleen "!!!alias" overblijft, zoals in het onderstaande voorbeeld.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Naam/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Type</th>
<th>Antwoord/Waarde</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", of leeg</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=!!!alias</code></td>
</tr>
</tbody>
</table>

### Kan ik e-mails doorsturen naar meerdere ontvangers {#can-i-forward-emails-to-multiple-recipients}

Jazeker. Specificeer gewoon meerdere ontvangers in uw <strong class="notranslate">TXT</strong>-records.

Als ik bijvoorbeeld wil dat een e-mail die naar `hello@example.com` gaat, wordt doorgestuurd naar `user+a@gmail.com` en `user+b@gmail.com`, dan ziet mijn <strong class="notranslate">TXT</strong>-record er als volgt uit:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Naam/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Type</th>
<th>Antwoord/Waarde</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", of leeg</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

U kunt ze ook in twee afzonderlijke regels specificeren, zoals in deze:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Naam/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Type</th>
<th>Antwoord/Waarde</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", of leeg</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=hello:user+a@gmail.com</code></td>
</tr>
<tr>
<td><em>"@", ".", of leeg</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=hallo:gebruiker+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Het is aan jou!

### Kan ik meerdere wereldwijde catch-all-ontvangers hebben {#can-i-have-multiple-global-catch-all-recipients}

Ja, dat kan. Specificeer gewoon meerdere wereldwijde catch-all-ontvangers in uw <strong class="notranslate">TXT</strong>-records.

Als ik bijvoorbeeld wil dat alle e-mailberichten die naar `*@example.com` gaan (de asterisk betekent dat het een wildcard is, oftewel een catch-all-adres), worden doorgestuurd naar `user+a@gmail.com` en `user+b@gmail.com`, dan ziet mijn <strong class="notranslate">TXT</strong>-record er als volgt uit:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Naam/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Type</th>
<th>Antwoord/Waarde</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", of leeg</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=gebruiker+a@gmail.com,gebruiker+b@gmail.com</code></td>
</tr>
</tbody>
</table>

U kunt ze ook in twee afzonderlijke regels specificeren, zoals in deze:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Naam/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Type</th>
<th>Antwoord/Waarde</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", of leeg</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+a@gmail.com</code></td>
</tr>
<tr>
<td><em>@, ".", of leeg</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=gebruiker+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Het is aan jou!

### Is er een maximumlimiet aan het aantal e-mailadressen waarnaar ik per alias {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias} kan doorsturen?

Ja, de standaardlimiet is 10. Dit betekent NIET dat u slechts 10 aliassen op uw domeinnaam kunt hebben. U kunt zoveel aliassen hebben als u wilt (een onbeperkt aantal). Dit betekent dat u slechts één alias naar 10 unieke e-mailadressen kunt doorsturen. U kunt bijvoorbeeld `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … hebben (van 1-10) – en alle e-mails naar `hello@example.com` worden doorgestuurd naar `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (van 1-10).

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>
Heeft u meer dan 10 ontvangers per alias nodig? Stuur ons een e-mail en we verhogen graag uw accountlimiet.
</span>
</div>

### Kan ik e-mails recursief doorsturen {#can-i-recursively-forward-emails}

Ja, dat kan, maar u moet zich wel aan de maximale limiet houden. Als u `hello:linus@example.com` en `linus:user@gmail.com` hebt, worden e-mails naar `hello@example.com` doorgestuurd naar `linus@example.com` en `user@gmail.com`. Houd er rekening mee dat er een foutmelding verschijnt als u probeert e-mails recursief door te sturen die de maximale limiet overschrijden.

### Kunnen mensen mijn e-maildoorsturing registreren of afmelden zonder mijn toestemming? {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

We gebruiken MX- en <strong class="notranslate">TXT</strong>-recordverificatie. Als u de betreffende MX- en <strong class="notranslate">TXT</strong>-records van deze service toevoegt, bent u geregistreerd. Als u ze verwijdert, wordt uw registratie ongedaan gemaakt. U bent eigenaar van uw domein en DNS-beheer, dus als iemand daar toegang toe heeft, is dat een probleem.

### Hoe is het gratis {#how-is-it-free}

Forward Email biedt een gratis versie via een combinatie van open-sourceontwikkeling, efficiënte infrastructuur en optionele betaalde abonnementen die de service ondersteunen.

Onze gratis versie wordt ondersteund door:

1. **Open Source Ontwikkeling**: Onze codebase is open source, waardoor bijdragen van de community en een transparante werking mogelijk zijn.

2. **Efficiënte infrastructuur**: We hebben onze systemen geoptimaliseerd om e-maildoorsturing met minimale middelen te verwerken.

3. **Betaalde Premium-abonnementen**: Gebruikers die extra functies nodig hebben, zoals SMTP-verzending, IMAP-ontvangst of verbeterde privacyopties, kunnen zich abonneren op onze betaalde abonnementen.

4. **Redelijke gebruikslimieten**: De gratis versie heeft een redelijk gebruiksbeleid om misbruik te voorkomen.

> \[!NOTE]
> We streven ernaar om basis-e-maildoorsturing gratis te houden en tegelijkertijd premiumfuncties aan te bieden voor gebruikers met meer geavanceerde behoeften.

> \[!TIP]
> Als u onze service waardevol vindt, overweeg dan om te upgraden naar een betaald abonnement om de doorlopende ontwikkeling en het onderhoud te ondersteunen.

### Wat is de maximale e-mailgroottelimiet {#what-is-the-max-email-size-limit}

Standaard hanteren we een bestandsgroottelimiet van 50 MB, inclusief inhoud, headers en bijlagen. Houd er rekening mee dat diensten zoals Gmail en Outlook slechts een bestandsgroottelimiet van 25 MB toestaan. Als u deze limiet overschrijdt bij het verzenden naar adressen van deze providers, ontvangt u een foutmelding.

Er wordt een fout met de juiste responscode geretourneerd als de maximale bestandsgrootte wordt overschreden.

### Slaat u logs op van e-mails {#do-you-store-logs-of-emails}

Nee, we schrijven geen logs naar schijf en slaan deze ook niet op – met [uitzondering van fouten](#do-you-store-error-logs) en [uitgaande SMTP](#do-you-support-sending-email-with-smtp) (zie onze [Privacybeleid](/privacy)).

Alles gebeurt in het geheugen en [onze broncode staat op GitHub](https://github.com/forwardemail).

### Slaat u foutlogboeken op {#do-you-store-error-logs}

**Ja. U kunt de foutlogboeken raadplegen onder [Mijn account → Logboeken](/my-account/logs) of [Mijn account → Domeinen](/my-account/domains).**

Vanaf februari 2023 bewaren we foutlogboeken voor de SMTP-responscodes `4xx` en `5xx` gedurende een periode van 7 dagen. Deze bevatten de SMTP-fout, envelop en e-mailheaders (we slaan **niet** de e-mailtekst of bijlagen op).

Met foutlogboeken kunt u controleren op ontbrekende belangrijke e-mails en spam-valspositieve meldingen voor [uw domeinen](/my-account/domains) beperken. Ze vormen ook een uitstekende bron voor het opsporen van fouten in [e-mail webhooks](#do-you-support-webhooks) (omdat de foutlogboeken de respons van het webhook-eindpunt bevatten).

Foutlogboeken voor [snelheidsbeperkend](#do-you-have-rate-limiting) en [grijze lijst](#do-you-have-a-greylist) zijn niet toegankelijk omdat de verbinding vroegtijdig wordt beëindigd (bijvoorbeeld voordat de opdrachten `RCPT TO` en `MAIL FROM` kunnen worden verzonden).

Zie onze [Privacybeleid](/privacy) voor meer inzicht.

### Leest u mijn e-mails? {#do-you-read-my-emails}

Nee, absoluut niet. Zie onze [Privacybeleid](/privacy).

Veel andere e-maildoorstuurservices slaan uw e-mail op en kunnen deze mogelijk lezen. Er is geen reden waarom doorgestuurde e-mails op schijfruimte moeten worden opgeslagen – en daarom hebben wij de eerste open-sourceoplossing ontworpen die dit allemaal in het geheugen doet.

Wij vinden dat u recht heeft op privacy en respecteren dit strikt. De code die op de server wordt gebruikt, is [open-source software op GitHub](https://github.com/forwardemail) voor transparantie en het opbouwen van vertrouwen.

### Kan ik met deze {#can-i-send-mail-as-in-gmail-with-this} "e-mail verzenden als" in Gmail?

Ja! Sinds 2 oktober 2018 hebben we deze functie toegevoegd. Zie [Hoe u e-mail kunt verzenden met Gmail](#how-to-send-mail-as-using-gmail) hierboven!

U moet ook de SPF-record voor Gmail instellen in uw DNS-configuratie <strong class="notranslate">TXT</strong>-record.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Belangrijk:
</strong>
<span>
Als u Gmail (bijv. E-mail verzenden als) of G Suite gebruikt, moet u <code>include:_spf.google.com</code> toevoegen aan uw SPF <strong class="notranslate">TXT</strong>-record, bijvoorbeeld:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

### Kan ik "e-mail verzenden als" in Outlook met deze {#can-i-send-mail-as-in-outlook-with-this}

Jazeker! Sinds 2 oktober 2018 hebben we deze functie toegevoegd. Bekijk de twee links van Microsoft hieronder:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

U moet ook de SPF-record voor Outlook instellen in uw DNS-configuratie <strong class="notranslate">TXT</strong>-record.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Belangrijk:
</strong>
<span>
Als u Microsoft Outlook of Live.com gebruikt, moet u <code>include:spf.protection.outlook.com</code> toevoegen aan uw SPF <strong class="notranslate">TXT</strong>-record, bijvoorbeeld:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
</span>
</div>

### Kan ik met deze {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this} "e-mail verzenden als" in Apple Mail en iCloud Mail?

Als u abonnee bent van iCloud+, kunt u een aangepast domein gebruiken. [Onze service is ook compatibel met Apple Mail](#apple-mail).

Zie <https://support.apple.com/en-us/102540> voor meer informatie.

### Kan ik met deze {#can-i-forward-unlimited-emails-with-this} onbeperkt e-mails doorsturen?

Ja, maar voor "relatief onbekende" verzenders geldt een snelheidslimiet van 100 verbindingen per uur per hostnaam of IP. Zie de sectie over [Snelheidsbeperking](#do-you-have-rate-limiting) en [Grijze lijst](#do-you-have-a-greylist) hierboven.

Met 'relatief onbekend' bedoelen we afzenders die niet in [toegestane lijst](#do-you-have-an-allowlist) voorkomen.

Als deze limiet wordt overschreden, sturen we een 421-responscode die de mailserver van de verzender vertelt om het later opnieuw te proberen.

### Biedt u onbeperkte domeinen aan voor één prijs {#do-you-offer-unlimited-domains-for-one-price}

Ja. Ongeacht welk abonnement je hebt, betaal je slechts één maandtarief – dat geldt voor al je domeinen.

### Welke betaalmethoden accepteert u? {#which-payment-methods-do-you-accept}

Forward Email accepteert de volgende eenmalige of maandelijkse/driemaandelijkse/jaarlijkse betaalmethoden:

1. **Creditcards/betaalkaarten/bankoverschrijvingen**: Visa, Mastercard, American Express, Discover, JCB, Diners Club, enz.
2. **PayPal**: Koppel je PayPal-account voor eenvoudige betalingen
3. **Cryptovaluta**: We accepteren betalingen via de stablecoin-betalingen van Stripe op de netwerken Ethereum, Polygon en Solana

> \[!NOTE]
> We slaan beperkte betalingsgegevens op op onze servers, waaronder alleen betalings-ID's en verwijzingen naar transactie-, klant-, abonnements- en betalings-ID's van [Streep](https://stripe.com/global) en [PayPal](https://www.paypal.com).

> \[!TIP]
> Voor maximale privacy kunt u overwegen om betalingen met cryptovaluta te doen.

Alle betalingen worden veilig verwerkt via Stripe of PayPal. Uw betalingsgegevens worden nooit op onze servers opgeslagen.

## Aanvullende bronnen {#additional-resources}

> \[!TIP]
> Onze onderstaande artikelen worden regelmatig bijgewerkt met nieuwe handleidingen, tips en technische informatie. Kom regelmatig terug voor de nieuwste content.

* [Casestudies en ontwikkelaarsdocumentatie](/blog/docs)
* [Bronnen](/resources)
* [Gidsen](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/