# Veelgestelde Vragen {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="Forward Email veelgestelde vragen" class="rounded-lg" />


## Inhoudsopgave {#table-of-contents}

* [Snel aan de slag](#quick-start)
* [Introductie](#introduction)
  * [Wat is Forward Email](#what-is-forward-email)
  * [Wie gebruikt Forward Email](#who-uses-forward-email)
  * [Wat is de geschiedenis van Forward Email](#what-is-forward-emails-history)
  * [Hoe snel is deze dienst](#how-fast-is-this-service)
* [E-mailclients](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [eM Client](#em-client)
  * [Mobiele apparaten](#mobile-devices)
  * [Sendmail SMTP Relay Configuratie](#sendmail-smtp-relay-configuration)
  * [Exim4 SMTP Relay Configuratie](#exim4-smtp-relay-configuration)
  * [msmtp SMTP Client Configuratie](#msmtp-smtp-client-configuration)
  * [Command-line E-mailclients](#command-line-email-clients)
  * [Windows E-mail Configuratie](#windows-email-configuration)
  * [Postfix SMTP Relay Configuratie](#postfix-smtp-relay-configuration)
  * [Hoe mail te verzenden als met Gmail](#how-to-send-mail-as-using-gmail)
  * [Wat is de legacy gratis gids voor Send Mail As met Gmail](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Geavanceerde Gmail Routing Configuratie](#advanced-gmail-routing-configuration)
  * [Geavanceerde Outlook Routing Configuratie](#advanced-outlook-routing-configuration)
* [Probleemoplossing](#troubleshooting)
  * [Waarom ontvang ik mijn testmails niet](#why-am-i-not-receiving-my-test-emails)
  * [Hoe configureer ik mijn e-mailclient om met Forward Email te werken](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Waarom komen mijn e-mails in Spam en Ongewenste mail terecht en hoe kan ik mijn domeinreputatie controleren](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [Wat moet ik doen als ik spam-e-mails ontvang](#what-should-i-do-if-i-receive-spam-emails)
  * [Waarom worden mijn testmails die ik naar mezelf stuur in Gmail als "verdacht" weergegeven](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Kan ik de via forwardemail dot net in Gmail verwijderen](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Gegevensbeheer](#data-management)
  * [Waar bevinden uw servers zich](#where-are-your-servers-located)
  * [Hoe exporteer en back-up ik mijn mailbox](#how-do-i-export-and-backup-my-mailbox)
  * [Hoe importeer en migreer ik mijn bestaande mailbox](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Hoe gebruik ik mijn eigen S3-compatibele opslag voor back-ups](#how-do-i-use-my-own-s3-compatible-storage-for-backups)
  * [Hoe converteer ik SQLite-back-ups naar EML-bestanden](#how-do-i-convert-sqlite-backups-to-eml-files)
  * [Ondersteunt u zelfhosting](#do-you-support-self-hosting)
* [E-mailconfiguratie](#email-configuration)
  * [Hoe begin ik en stel ik e-mail forwarding in](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Kan ik meerdere MX-uitwisselingen en servers gebruiken voor geavanceerde forwarding](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Hoe stel ik een afwezigheidsassistent in (out of office auto-responder)](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Hoe stel ik SPF in voor Forward Email](#how-do-i-set-up-spf-for-forward-email)
  * [Hoe stel ik DKIM in voor Forward Email](#how-do-i-set-up-dkim-for-forward-email)
  * [Hoe stel ik DMARC in voor Forward Email](#how-do-i-set-up-dmarc-for-forward-email)
  * [Hoe bekijk ik DMARC-rapporten](#how-do-i-view-dmarc-reports)
  * [Hoe verbind en configureer ik mijn contacten](#how-do-i-connect-and-configure-my-contacts)
  * [Hoe verbind en configureer ik mijn agenda's](#how-do-i-connect-and-configure-my-calendars)
  * [Hoe voeg ik meer agenda's toe en beheer ik bestaande agenda's](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Hoe verbind en configureer ik taken en herinneringen](#how-do-i-connect-and-configure-tasks-and-reminders)
  * [Waarom kan ik geen taken aanmaken in macOS Herinneringen](#why-cant-i-create-tasks-in-macos-reminders)
  * [Hoe stel ik Tasks.org in op Android](#how-do-i-set-up-tasksorg-on-android)
  * [Hoe stel ik SRS in voor Forward Email](#how-do-i-set-up-srs-for-forward-email)
  * [Hoe stel ik MTA-STS in voor Forward Email](#how-do-i-set-up-mta-sts-for-forward-email)
  * [Hoe voeg ik een profielfoto toe aan mijn e-mailadres](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Geavanceerde functies](#advanced-features)
  * [Ondersteunt u nieuwsbrieven of mailinglijsten voor marketinggerelateerde e-mail](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Ondersteunt u het verzenden van e-mail met API](#do-you-support-sending-email-with-api)
  * [Ondersteunt u het ontvangen van e-mail met IMAP](#do-you-support-receiving-email-with-imap)
  * [Ondersteunt u POP3](#do-you-support-pop3)
  * [Ondersteunt u agenda's (CalDAV)](#do-you-support-calendars-caldav)
  * [Ondersteunt u taken en herinneringen (CalDAV VTODO)](#do-you-support-tasks-and-reminders-caldav-vtodo)
  * [Ondersteunt u contacten (CardDAV)](#do-you-support-contacts-carddav)
  * [Ondersteunt u het verzenden van e-mail met SMTP](#do-you-support-sending-email-with-smtp)
  * [Ondersteunt u OpenPGP/MIME, end-to-end encryptie ("E2EE") en Web Key Directory ("WKD")](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Ondersteunt u S/MIME encryptie](#do-you-support-smime-encryption)
  * [Ondersteunt u Sieve e-mailfiltering](#do-you-support-sieve-email-filtering)
  * [Ondersteunt u MTA-STS](#do-you-support-mta-sts)
  * [Ondersteunt u passkeys en WebAuthn](#do-you-support-passkeys-and-webauthn)
  * [Ondersteunt u e-mail best practices](#do-you-support-email-best-practices)
  * [Ondersteunt u bounce webhooks](#do-you-support-bounce-webhooks)
  * [Ondersteunt u webhooks](#do-you-support-webhooks)
  * [Ondersteunt u reguliere expressies of regex](#do-you-support-regular-expressions-or-regex)
  * [Wat zijn uw uitgaande SMTP-limieten](#what-are-your-outbound-smtp-limits)
  * [Heb ik goedkeuring nodig om SMTP in te schakelen](#do-i-need-approval-to-enable-smtp)
  * [Wat zijn uw SMTP-serverconfiguratie-instellingen](#what-are-your-smtp-server-configuration-settings)
  * [Wat zijn uw IMAP-serverconfiguratie-instellingen](#what-are-your-imap-server-configuration-settings)
  * [Wat zijn uw POP3-serverconfiguratie-instellingen](#what-are-your-pop3-server-configuration-settings)
  * [Hoe stel ik e-mail autodiscovery in voor mijn domein](#how-do-i-set-up-email-autodiscovery-for-my-domain)
* [Beveiliging](#security-1)
  * [Geavanceerde serververhardingstechnieken](#advanced-server-hardening-techniques)
  * [Heeft u SOC 2 of ISO 27001 certificeringen](#do-you-have-soc-2-or-iso-27001-certifications)
  * [Gebruikt u TLS-encryptie voor e-mail forwarding](#do-you-use-tls-encryption-for-email-forwarding)
  * [Behoudt u e-mail authenticatieheaders](#do-you-preserve-email-authentication-headers)
  * [Behoudt u originele e-mailheaders en voorkomt u spoofing](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Hoe beschermt u tegen spam en misbruik](#how-do-you-protect-against-spam-and-abuse)
  * [Slaat u e-mailinhoud op schijf op](#do-you-store-email-content-on-disk)
  * [Kan e-mailinhoud worden blootgesteld tijdens systeemcrashes](#can-email-content-be-exposed-during-system-crashes)
  * [Wie heeft toegang tot uw e-mailinfrastructuur](#who-has-access-to-your-email-infrastructure)
  * [Welke infrastructuurproviders gebruikt u](#what-infrastructure-providers-do-you-use)
  * [Biedt u een gegevensverwerkingsovereenkomst (DPA)](#do-you-offer-a-data-processing-agreement-dpa)
  * [Hoe gaat u om met meldingen van datalekken](#how-do-you-handle-data-breach-notifications)
  * [Biedt u een testomgeving](#do-you-offer-a-test-environment)
  * [Biedt u monitoring- en waarschuwingshulpmiddelen](#do-you-provide-monitoring-and-alerting-tools)
  * [Hoe zorgt u voor hoge beschikbaarheid](#how-do-you-ensure-high-availability)
  * [Voldoet u aan Sectie 889 van de National Defense Authorization Act (NDAA)](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [Systeem- en technische details](#system-and-technical-details)
  * [Slaat u e-mails en hun inhoud op](#do-you-store-emails-and-their-contents)
  * [Hoe werkt uw e-mail forwarding systeem](#how-does-your-email-forwarding-system-work)
  * [Hoe verwerkt u een e-mail voor forwarding](#how-do-you-process-an-email-for-forwarding)
  * [Hoe gaat u om met problemen bij e-mailbezorging](#how-do-you-handle-email-delivery-issues)
  * [Hoe gaat u om met het blokkeren van uw IP-adressen](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [Wat zijn postmaster-adressen](#what-are-postmaster-addresses)
  * [Wat zijn no-reply-adressen](#what-are-no-reply-addresses)
  * [Wat zijn de IP-adressen van uw server](#what-are-your-servers-ip-addresses)
  * [Heeft u een allowlist](#do-you-have-an-allowlist)
  * [Welke domeinnaamextensies zijn standaard allowlisted](#what-domain-name-extensions-are-allowlisted-by-default)
  * [Wat is uw allowlist-criteria](#what-is-your-allowlist-criteria)
  * [Welke domeinnaamextensies kunnen gratis worden gebruikt](#what-domain-name-extensions-can-be-used-for-free)
  * [Heeft u een greylist](#do-you-have-a-greylist)
  * [Heeft u een denylist](#do-you-have-a-denylist)
  * [Heeft u rate limiting](#do-you-have-rate-limiting)
  * [Hoe beschermt u tegen backscatter](#how-do-you-protect-against-backscatter)
  * [Voorkom bounces van bekende MAIL FROM spammers](#prevent-bounces-from-known-mail-from-spammers)
  * [Voorkom onnodige bounces ter bescherming tegen backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Hoe bepaalt u een e-mail fingerprint](#how-do-you-determine-an-email-fingerprint)
  * [Kan ik e-mails doorsturen naar andere poorten dan 25 (bijv. als mijn ISP poort 25 heeft geblokkeerd)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Ondersteunt het het plus + symbool voor Gmail aliassen](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Ondersteunt het subdomeinen](#does-it-support-sub-domains)
  * [Stuurt dit mijn e-mailheaders door](#does-this-forward-my-emails-headers)
  * [Is dit goed getest](#is-this-well-tested)
  * [Geeft u SMTP-responsberichten en codes door](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Hoe voorkomt u spammers en zorgt u voor een goede e-mail forwarding reputatie](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Hoe voert u DNS-zoekopdrachten uit op domeinnamen](#how-do-you-perform-dns-lookups-on-domain-names)
* [Account en facturering](#account-and-billing)
  * [Biedt u een geld-terug-garantie op betaalde abonnementen](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Als ik van abonnement wissel, past u dan pro rata aan en vergoedt u het verschil](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Kan ik deze e-mail forwarding dienst gewoon gebruiken als een "fallback" of "fallover" MX-server](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Kan ik specifieke aliassen uitschakelen](#can-i-disable-specific-aliases)
  * [Kan ik e-mails doorsturen naar meerdere ontvangers](#can-i-forward-emails-to-multiple-recipients)
  * [Kan ik meerdere globale catch-all ontvangers hebben](#can-i-have-multiple-global-catch-all-recipients)
  * [Is er een maximumlimiet voor het aantal e-mailadressen waar ik per alias naar kan doorsturen](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Kan ik e-mails recursief doorsturen](#can-i-recursively-forward-emails)
  * [Kunnen mensen mijn e-mail forwarding registreren of deregistreren zonder mijn toestemming](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Hoe is het gratis](#how-is-it-free)
  * [Wat is de maximale e-mailgrootte](#what-is-the-max-email-size-limit)
  * [Slaat u logs van e-mails op](#do-you-store-logs-of-emails)
  * [Slaat u foutlogs op](#do-you-store-error-logs)
  * [Leest u mijn e-mails](#do-you-read-my-emails)
  * [Kan ik "send mail as" gebruiken in Gmail hiermee](#can-i-send-mail-as-in-gmail-with-this)
  * [Kan ik "send mail as" gebruiken in Outlook hiermee](#can-i-send-mail-as-in-outlook-with-this)
  * [Kan ik "send mail as" gebruiken in Apple Mail en iCloud Mail hiermee](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Kan ik hiermee onbeperkt e-mails doorsturen](#can-i-forward-unlimited-emails-with-this)
  * [Biedt u onbeperkte domeinen voor één prijs](#do-you-offer-unlimited-domains-for-one-price)
  * [Welke betaalmethoden accepteert u](#which-payment-methods-do-you-accept)
* [Aanvullende bronnen](#additional-resources)
## Snel aan de slag {#quick-start}

Om te beginnen met Forward Email:

1. **Maak een account aan** op [forwardemail.net/register](https://forwardemail.net/register)

2. **Voeg je domein toe en verifieer het** onder [Mijn Account → Domeinen](/my-account/domains)

3. **Voeg e-mailaliassen/postvakken toe en configureer ze** onder [Mijn Account → Domeinen](/my-account/domains) → Aliassen

4. **Test je setup** door een e-mail te sturen naar een van je nieuwe aliassen

> \[!TIP]
> DNS-wijzigingen kunnen tot 24-48 uur duren om wereldwijd door te voeren, hoewel ze vaak veel sneller van kracht zijn.

> \[!BELANGRIJK]
> Voor verbeterde afleverbaarheid raden we aan om [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) en [DMARC](#how-do-i-set-up-dmarc-for-forward-email) records in te stellen.


## Introductie {#introduction}

### Wat is Forward Email {#what-is-forward-email}

> \[!OPMERKING]
> Forward Email is perfect voor particulieren, kleine bedrijven en ontwikkelaars die professionele e-mailadressen willen zonder de kosten en het onderhoud van een volledige e-mailhostingoplossing.

Forward Email is een **volledig uitgeruste e-mailserviceprovider** en **e-mailhostingprovider voor aangepaste domeinnamen**.

Het is de enige gratis en open-source service, en stelt je in staat om aangepaste domein-e-mailadressen te gebruiken zonder de complexiteit van het opzetten en onderhouden van je eigen e-mailserver.

Onze service stuurt e-mails die naar je aangepaste domein worden gestuurd door naar je bestaande e-mailaccount – en je kunt ons zelfs gebruiken als je toegewijde e-mailhostingprovider.

Belangrijke kenmerken van Forward Email:

* **Aangepaste domein-e-mail**: Gebruik professionele e-mailadressen met je eigen domeinnaam
* **Gratis niveau**: Basis e-maildoorsturing zonder kosten
* **Verbeterde privacy**: We lezen je e-mails niet en verkopen je gegevens niet
* **Open Source**: Onze volledige codebase is beschikbaar op GitHub
* **SMTP-, IMAP- en POP3-ondersteuning**: Volledige mogelijkheden voor het verzenden en ontvangen van e-mail
* **End-to-End encryptie**: Ondersteuning voor OpenPGP/MIME
* **Aangepaste catch-all aliassen**: Maak onbeperkt e-mailaliassen aan

Je kunt ons vergelijken met 56+ andere e-mailserviceproviders op [onze pagina met e-mailvergelijkingen](/blog/best-email-service).

> \[!TIP]
> Leer meer over Forward Email door ons gratis [Technisch Whitepaper](/technical-whitepaper.pdf) te lezen

### Wie gebruikt Forward Email {#who-uses-forward-email}

We bieden e-mailhosting en e-maildoorstuurservice aan 500.000+ domeinen en deze opmerkelijke gebruikers:

| Klant                                   | Case Study                                                                                               |
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
### Wat is de geschiedenis van Forward Email {#what-is-forward-emails-history}

Je kunt meer over Forward Email lezen op [onze Over-pagina](/about).

### Hoe snel is deze dienst {#how-fast-is-this-service}

> \[!NOTE]
> Ons systeem is ontworpen voor snelheid en betrouwbaarheid, met meerdere redundante servers om ervoor te zorgen dat je e-mails snel worden afgeleverd.

Forward Email levert berichten met minimale vertraging, meestal binnen enkele seconden na ontvangst.

Prestatiegegevens:

* **Gemiddelde bezorgtijd**: Minder dan 5-10 seconden van ontvangst tot doorsturen ([zie onze Time to Inbox "TTI" monitoringpagina](/tti))
* **Uptime**: 99,9%+ beschikbaarheid van de dienst
* **Wereldwijde infrastructuur**: Servers strategisch geplaatst voor optimale routering
* **Automatische schaalvergroting**: Ons systeem schaalt tijdens piekperiodes van e-mailverkeer

Wij werken in realtime, in tegenstelling tot andere providers die gebruikmaken van vertraagde wachtrijen.

We schrijven niet naar schijf en slaan geen logs op – met de [uitzondering van fouten](#do-you-store-error-logs) en [uitgaande SMTP](#do-you-support-sending-email-with-smtp) (zie ons [Privacybeleid](/privacy)).

Alles gebeurt in het geheugen en [onze broncode staat op GitHub](https://github.com/forwardemail).


## E-mailclients {#email-clients}

### Thunderbird {#thunderbird}

1. Maak een nieuw alias aan en genereer een wachtwoord in je Forward Email dashboard
2. Open Thunderbird en ga naar **Bewerken → Accountinstellingen → Accountacties → E-mailaccount toevoegen**
3. Voer je naam, Forward Email-adres en wachtwoord in
4. Klik op **Handmatig configureren** en voer in:
   * Binnenkomend: IMAP, `imap.forwardemail.net`, poort 993, SSL/TLS
   * Uitgaand: SMTP, `smtp.forwardemail.net`, poort 465, SSL/TLS (aanbevolen; poort 587 met STARTTLS wordt ook ondersteund)
5. Klik op **Gereed**

### Microsoft Outlook {#microsoft-outlook}

1. Maak een nieuw alias aan en genereer een wachtwoord in je Forward Email dashboard
2. Ga naar **Bestand → Account toevoegen**
3. Voer je Forward Email-adres in en klik op **Verbinden**
4. Kies **Geavanceerde opties** en selecteer **Laat me mijn account handmatig instellen**
5. Selecteer **IMAP** en voer in:
   * Binnenkomend: `imap.forwardemail.net`, poort 993, SSL
   * Uitgaand: `smtp.forwardemail.net`, poort 465, SSL/TLS (aanbevolen; poort 587 met STARTTLS wordt ook ondersteund)
   * Gebruikersnaam: Je volledige e-mailadres
   * Wachtwoord: Je gegenereerde wachtwoord
6. Klik op **Verbinden**

### Apple Mail {#apple-mail}

1. Maak een nieuw alias aan en genereer een wachtwoord in je Forward Email dashboard
2. Ga naar **Mail → Voorkeuren → Accounts → +**
3. Selecteer **Ander e-mailaccount**
4. Voer je naam, Forward Email-adres en wachtwoord in
5. Voor serverinstellingen, voer in:
   * Binnenkomend: `imap.forwardemail.net`
   * Uitgaand: `smtp.forwardemail.net`
   * Gebruikersnaam: Je volledige e-mailadres
   * Wachtwoord: Je gegenereerde wachtwoord
6. Klik op **Log in**

### eM Client {#em-client}

1. Maak een nieuw alias aan en genereer een wachtwoord in je Forward Email dashboard
2. Open eM Client en ga naar **Menu → Accounts → + Account toevoegen**
3. Klik op **Mail** en selecteer vervolgens **Anders**
4. Voer je Forward Email-adres in en klik op **Volgende**
5. Voer de volgende serverinstellingen in:
   * **Binnenkomende server**: `imap.forwardemail.net`
   * **Uitgaande server**: `smtp.forwardemail.net`
6. Voer je volledige e-mailadres in als **Gebruikersnaam** en je gegenereerde wachtwoord als **Wachtwoord** voor zowel binnenkomende als uitgaande servers.
7. eM Client test de verbinding. Zodra deze slaagt, klik je op **Volgende**.
8. Voer je naam in en kies een accountnaam.
9. Klik op **Voltooien**.

### Mobiele apparaten {#mobile-devices}

Voor iOS:

1. Ga naar **Instellingen → Mail → Accounts → Account toevoegen → Anders**
2. Tik op **E-mailaccount toevoegen** en voer je gegevens in
3. Gebruik voor serverinstellingen dezelfde IMAP- en SMTP-instellingen als hierboven

Voor Android:

1. Ga naar **Instellingen → Accounts → Account toevoegen → Persoonlijk (IMAP)**
2. Voer je Forward Email-adres en wachtwoord in
3. Gebruik voor serverinstellingen dezelfde IMAP- en SMTP-instellingen als hierboven

### Sendmail SMTP Relay Configuratie {#sendmail-smtp-relay-configuration}

Je kunt Sendmail configureren om e-mails te relayen via de SMTP-servers van Forward Email. Dit is een veelvoorkomende setup voor legacy-systemen of applicaties die afhankelijk zijn van Sendmail.
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Geschatte Installatietijd:</strong>
  <span>Minder dan 20 minuten</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Belangrijk:
  </strong>
  <span>
    Dit vereist een betaald abonnement met ingeschakelde SMTP-toegang.
  </span>
</div>

#### Configuratie {#configuration}

1. Bewerk je `sendmail.mc` bestand, meestal te vinden op `/etc/mail/sendmail.mc`:

   ```bash
   sudo nano /etc/mail/sendmail.mc
   ```

2. Voeg de volgende regels toe om de smart host en authenticatie te definiëren:

   ```
   define(`SMART_HOST', `smtp.forwardemail.net')dnl
   define(`RELAY_MAILER_ARGS', `TCP $h 465')dnl
   define(`confAUTH_MECHANISMS', `EXTERNAL GSSAPI DIGEST-MD5 CRAM-MD5 LOGIN PLAIN')dnl
   FEATURE(`authinfo',`hash -o /etc/mail/authinfo.db')dnl
   ```

3. Maak het authenticatiebestand `/etc/mail/authinfo` aan:

   ```bash
   sudo nano /etc/mail/authinfo
   ```

4. Voeg je Forward Email inloggegevens toe aan het `authinfo` bestand:

   ```
   AuthInfo:smtp.forwardemail.net "U:your-alias@yourdomain.com" "P:your-generated-password" "M:PLAIN"
   ```

5. Genereer de authenticatiedatabase en beveilig de bestanden:

   ```bash
   sudo makemap hash /etc/mail/authinfo < /etc/mail/authinfo
   sudo chmod 600 /etc/mail/authinfo /etc/mail/authinfo.db
   ```

6. Bouw de Sendmail configuratie opnieuw en herstart de service:

   ```bash
   sudo make -C /etc/mail
   sudo systemctl restart sendmail
   ```

#### Testen {#testing}

Stuur een testmail om de configuratie te verifiëren:

```bash
echo "Test email from Sendmail" | mail -s "Sendmail Test" recipient@example.com
```

### Exim4 SMTP Relay Configuratie {#exim4-smtp-relay-configuration}

Exim4 is een populaire MTA op Debian-gebaseerde systemen. Je kunt het configureren om Forward Email als smarthost te gebruiken.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Geschatte Installatietijd:</strong>
  <span>Minder dan 15 minuten</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Belangrijk:
  </strong>
  <span>
    Dit vereist een betaald abonnement met ingeschakelde SMTP-toegang.
  </span>
</div>

#### Configuratie {#configuration-1}

1. Start de Exim4 configuratietool:

   ```bash
   sudo dpkg-reconfigure exim4-config
   ```

2. Selecteer de volgende opties:
   * **Algemeen type mailconfiguratie:** mail verzonden via smarthost; ontvangen via SMTP of fetchmail
   * **Systeem mailnaam:** your.hostname
   * **IP-adressen om te luisteren voor inkomende SMTP-verbindingen:** 127.0.0.1 ; ::1
   * **Andere bestemmingen waarvoor mail wordt geaccepteerd:** (leeg laten)
   * **Domeinen waarvoor mail wordt doorgestuurd:** (leeg laten)
   * **IP-adres of hostnaam van de uitgaande smarthost:** smtp.forwardemail.net::465
   * **Lokale mailnaam verbergen in uitgaande mail?** Nee
   * **Aantal DNS-queries minimaliseren (Dial-on-Demand)?** Nee
   * **Bezorgmethode voor lokale mail:** Mbox-formaat in /var/mail/
   * **Configuratie opsplitsen in kleine bestanden?** Nee

3. Bewerk het `passwd.client` bestand om je inloggegevens toe te voegen:

   ```bash
   sudo nano /etc/exim4/passwd.client
   ```

4. Voeg de volgende regel toe:

   ```
   smtp.forwardemail.net:your-alias@yourdomain.com:your-generated-password
   ```

5. Werk de configuratie bij en herstart Exim4:

   ```bash
   sudo update-exim4.conf
   sudo systemctl restart exim4
   ```

#### Testen {#testing-1}

Stuur een testmail:

```bash
echo "Test from Exim4" | mail -s "Exim4 Test" recipient@example.com
```

### msmtp SMTP Client Configuratie {#msmtp-smtp-client-configuration}

msmtp is een lichte SMTP-client die handig is voor het verzenden van e-mails vanuit scripts of command-line applicaties.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Geschatte Installatietijd:</strong>
  <span>Minder dan 10 minuten</span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Belangrijk:
  </strong>
  <span>
    Dit vereist een betaald abonnement met ingeschakelde SMTP-toegang.
  </span>
</div>

#### Configuratie {#configuration-2}

1. Maak het msmtp-configuratiebestand aan of bewerk het op `~/.msmtprc`:

   ```bash
   nano ~/.msmtprc
   ```

2. Voeg de volgende configuratie toe:

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

3. Stel de juiste rechten in voor het configuratiebestand:

   ```bash
   chmod 600 ~/.msmtprc
   ```

#### Testen {#testing-2}

Stuur een testmail:

```bash
echo "This is a test email from msmtp" | msmtp -a default recipient@example.com
```

### Command-line e-mailclients {#command-line-email-clients}

Populaire command-line e-mailclients zoals [Mutt](https://gitlab.com/muttmua/mutt), [NeoMutt](https://neomutt.org), en [Alpine](https://alpine.x10.mx/alpine/release/) kunnen worden geconfigureerd om de SMTP-servers van Forward Email te gebruiken voor het verzenden van e-mail. De configuratie zal vergelijkbaar zijn met de `msmtp`-instelling, waarbij je de SMTP-servergegevens en je inloggegevens opgeeft in de respectievelijke configuratiebestanden (`.muttrc`, `.neomuttrc`, of `.pinerc`).

### Windows e-mailconfiguratie {#windows-email-configuration}

Voor Windows-gebruikers kun je populaire e-mailclients zoals **Microsoft Outlook** en **eM Client** configureren met de IMAP- en SMTP-instellingen die in je Forward Email-account worden verstrekt. Voor command-line of scripting gebruik kun je PowerShell's `Send-MailMessage` cmdlet gebruiken (hoewel deze als verouderd wordt beschouwd) of een lichte SMTP-relay tool zoals [E-MailRelay](https://github.com/graeme-walker/emailrelay).

### Postfix SMTP Relay Configuratie {#postfix-smtp-relay-configuration}

Je kunt Postfix configureren om e-mails te relayen via de SMTP-servers van Forward Email. Dit is handig voor serverapplicaties die e-mails moeten versturen.

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
    Dit vereist een betaald abonnement met ingeschakelde SMTP-toegang.
  </span>
</div>

#### Installatie {#installation}

1. Installeer Postfix op je server:

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. Kies tijdens de installatie "Internet Site" wanneer gevraagd wordt naar het configuratietype.

#### Configuratie {#configuration-3}

1. Bewerk het hoofdconfiguratiebestand van Postfix:

```bash
sudo nano /etc/postfix/main.cf
```

2. Voeg deze instellingen toe of wijzig ze:

```
# SMTP relay configuratie
relayhost = [smtp.forwardemail.net]:465
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Maak het SASL-wachtwoordbestand aan:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Voeg je Forward Email-inloggegevens toe:

```
[smtp.forwardemail.net]:465 your-alias@yourdomain.com:your-generated-password
```

5. Beveilig en hash het wachtwoordbestand:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Herstart Postfix:

```bash
sudo systemctl restart postfix
```

#### Testen {#testing-3}

Test je configuratie door een testmail te sturen:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

### Hoe mail verzenden als met Gmail {#how-to-send-mail-as-using-gmail}
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Geschatte Installatietijd:</strong>
  <span>Minder dan 10 minuten</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Aan de slag:
  </strong>
  <span>
    Als je de bovenstaande instructies hebt gevolgd onder <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Hoe begin ik en stel ik e-maildoorsturing in</a>, dan kun je hieronder verder lezen.
  </span>
</div>

<div id="send-mail-as-content">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Belangrijk:
  </strong>
  <span>
    Zorg ervoor dat je onze <a href="/terms" class="alert-link" target="_blank">Voorwaarden</a>, <a href="/privacy" class="alert-link" target="_blank">Privacybeleid</a> en <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Outbound SMTP-limieten</a> hebt gelezen – jouw gebruik wordt beschouwd als erkenning en akkoord.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Belangrijk:
  </strong>
  <span>
    Als je een ontwikkelaar bent, raadpleeg dan onze <a class="alert-link" href="/email-api#outbound-emails" target="_blank">email API-documentatie</a>.
  </span>
</div>

1. Ga naar <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Instellingen <i class="fa fa-angle-right"></i> Outbound SMTP-configuratie en volg de installatie-instructies

2. Maak een nieuw alias aan voor je domein onder <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Aliassen (bijv. <code><hello@example.com></code>)

3. Klik op <strong class="text-success"><i class="fa fa-key"></i> Wachtwoord genereren</strong> naast het zojuist aangemaakte alias. Kopieer naar je klembord en bewaar het gegenereerde wachtwoord veilig dat op het scherm wordt weergegeven.

4. Ga naar [Gmail](https://gmail.com) en onder [Instellingen <i class="fa fa-angle-right"></i> Accounts en import <i class="fa fa-angle-right"></i> Verzenden als](https://mail.google.com/mail/u/0/#settings/accounts), klik op "Een ander e-mailadres toevoegen"

5. Wanneer gevraagd om "Naam", voer de naam in waaronder je wilt dat je e-mail wordt weergegeven als "Van" (bijv. "Linus Torvalds").

6. Wanneer gevraagd om "E-mailadres", voer het volledige e-mailadres in van een alias die je hebt aangemaakt onder <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Aliassen (bijv. <code><hello@example.com></code>)

7. Haal het vinkje weg bij "Behandelen als alias"

8. Klik op "Volgende stap" om door te gaan

9. Wanneer gevraagd om "SMTP-server", voer <code>smtp.forwardemail.net</code> in en wijzig de poort naar <code>465</code>

10. Wanneer gevraagd om "Gebruikersnaam", voer het volledige e-mailadres in van een alias die je hebt aangemaakt onder <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Aliassen (bijv. <code><hello@example.com></code>)

11. Wanneer gevraagd om "Wachtwoord", plak het wachtwoord van <strong class="text-success"><i class="fa fa-key"></i> Wachtwoord genereren</strong> uit stap 3 hierboven

12. Selecteer de radioknop voor "Beveiligde verbinding met SSL"

13. Klik op "Account toevoegen" om door te gaan

14. Open een nieuw tabblad naar [Gmail](https://gmail.com) en wacht tot je verificatie-e-mail aankomt (je ontvangt een verificatiecode die bevestigt dat jij de eigenaar bent van het e-mailadres waarvan je probeert te "Verzenden als")

15. Zodra deze aankomt, kopieer en plak je de verificatiecode bij de prompt die je in de vorige stap hebt ontvangen
16. Zodra je dat gedaan hebt, ga je terug naar de e-mail en klik je op de link om de aanvraag te "bevestigen". Je zult deze stap en de vorige stap waarschijnlijk moeten doen om de e-mail correct te configureren.

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

### Wat is de legacy free gids voor Send Mail As met Gmail {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Belangrijk:</strong> Deze legacy free gids is verouderd sinds mei 2023 omdat <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">we nu uitgaand SMTP ondersteunen</a>. Als je de onderstaande gids gebruikt, dan <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">zal dit ervoor zorgen dat je uitgaande e-mail</a> in Gmail "<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>" vermeldt.</a></div>

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
    Als je de instructies hierboven hebt gevolgd onder <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Hoe begin ik en stel ik e-mail forwarding in</a>, dan kun je hieronder verder lezen.
  </span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="How to Send Mail As using Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. Je moet [Gmail's Two-Factor Authentication][gmail-2fa] ingeschakeld hebben om dit te laten werken. Bezoek <https://www.google.com/landing/2step/> als je het nog niet hebt ingeschakeld.

2. Zodra Two-Factor Authentication is ingeschakeld (of als je het al had ingeschakeld), bezoek dan <https://myaccount.google.com/apppasswords>.

3. Wanneer gevraagd wordt om "Selecteer de app en het apparaat waarvoor je het app-wachtwoord wilt genereren":
   * Selecteer "Mail" in het dropdownmenu bij "Selecteer app"
   * Selecteer "Anders" in het dropdownmenu bij "Selecteer apparaat"
   * Wanneer om tekstinvoer wordt gevraagd, voer je het e-mailadres van je eigen domein in waarvan je doorstuurt (bijv. <code><hello@example.com></code> - dit helpt je bij het bijhouden als je deze service voor meerdere accounts gebruikt)

4. Kopieer het automatisch gegenereerde wachtwoord naar je klembord
   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Belangrijk:
     </strong>
     <span>
       Als je G Suite gebruikt, bezoek dan je beheerderspaneel <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Apps <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Instellingen voor Gmail <i class="fa fa-angle-right"></i> Instellingen</a> en zorg ervoor dat "Gebruikers toestaan om e-mail te verzenden via een externe SMTP-server..." is aangevinkt. Er zal enige vertraging zijn voordat deze wijziging actief wordt, wacht daarom een paar minuten.
     </span>
   </div>

5. Ga naar [Gmail](https://gmail.com) en klik onder [Instellingen <i class="fa fa-angle-right"></i> Accounts en Import <i class="fa fa-angle-right"></i> Verstuur mail als](https://mail.google.com/mail/u/0/#settings/accounts) op "Een ander e-mailadres toevoegen"

6. Wanneer gevraagd wordt om "Naam", voer dan de naam in waaronder je wilt dat je e-mail wordt weergegeven als "Van" (bijv. "Linus Torvalds")

7. Wanneer gevraagd wordt om "E-mailadres", voer dan het e-mailadres met je eigen domein in dat je hierboven hebt gebruikt (bijv. <code><hello@example.com></code>)
8. Vink "Behandelen als alias" uit

9. Klik op "Volgende stap" om door te gaan

10. Wanneer gevraagd om "SMTP-server", voer <code>smtp.gmail.com</code> in en laat de poort op <code>587</code>

11. Wanneer gevraagd om "Gebruikersnaam", voer het gedeelte van je Gmail-adres in zonder het <span>gmail.com</span> gedeelte (bijv. alleen "user" als mijn e-mail <span><user@gmail.com></span> is)
    <div class="alert my-3 alert-primary">
      <i class="fa fa-info-circle font-weight-bold"></i>
      <strong class="font-weight-bold">
        Belangrijk:
      </strong>
      <span>
        Als het gedeelte "Gebruikersnaam" automatisch wordt ingevuld, dan <u><strong>moet je dit wijzigen</strong></u> naar het gebruikersnaamgedeelte van je Gmail-adres.
      </span>
    </div>

12. Wanneer gevraagd om "Wachtwoord", plak dan het wachtwoord dat je in stap 2 hierboven hebt gegenereerd vanuit je klembord

13. Laat de radioknop aangevinkt voor "Beveiligde verbinding met TLS"

14. Klik op "Account toevoegen" om door te gaan

15. Open een nieuw tabblad naar [Gmail](https://gmail.com) en wacht tot je verificatie-e-mail arriveert (je ontvangt een verificatiecode die bevestigt dat jij de eigenaar bent van het e-mailadres dat je probeert te "Verzenden als")

16. Zodra deze arriveert, kopieer en plak je de verificatiecode bij de prompt die je in de vorige stap hebt ontvangen

17. Zodra je dat hebt gedaan, ga je terug naar de e-mail en klik je op de link om "de aanvraag te bevestigen". Waarschijnlijk moet je deze stap en de vorige stap uitvoeren om de e-mail correct te configureren.

</div>

### Geavanceerde Gmail-routeringsconfiguratie {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Geschatte installatietijd:</strong>
  <span>15-30 minuten</span>
</div>

Als je geavanceerde routering in Gmail wilt instellen zodat aliassen die niet overeenkomen met een mailbox worden doorgestuurd naar de mailservers van Forward Email, volg dan deze stappen:

1. Log in op je Google Admin-console via [admin.google.com](https://admin.google.com)
2. Ga naar **Apps → Google Workspace → Gmail → Routering**
3. Klik op **Route toevoegen** en configureer de volgende instellingen:

**Instellingen voor enkele ontvanger:**

* Selecteer "Wijzig envelopontvanger" en voer je primaire Gmail-adres in
* Vink "Voeg X-Gm-Original-To-header toe met originele ontvanger" aan

**Patronen voor envelopontvanger:**

* Voeg een patroon toe dat alle niet-bestaande mailboxen matcht (bijv. `.*@yourdomain.com`)

**E-mailserverinstellingen:**

* Selecteer "Routeren naar host" en voer `mx1.forwardemail.net` in als primaire server
* Voeg `mx2.forwardemail.net` toe als back-upserver
* Stel poort in op 25
* Selecteer "TLS vereisen" voor beveiliging

4. Klik op **Opslaan** om de route aan te maken

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Belangrijk:
  </strong>
  <span>
    Deze configuratie werkt alleen voor Google Workspace-accounts met aangepaste domeinen, niet voor reguliere Gmail-accounts.
  </span>
</div>

### Geavanceerde Outlook-routeringsconfiguratie {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Geschatte installatietijd:</strong>
  <span>15-30 minuten</span>
</div>

Voor Microsoft 365 (voorheen Office 365) gebruikers die geavanceerde routering willen instellen zodat aliassen die niet overeenkomen met een mailbox worden doorgestuurd naar de mailservers van Forward Email:

1. Log in op het Microsoft 365-beheercentrum via [admin.microsoft.com](https://admin.microsoft.com)
2. Ga naar **Exchange → Mailflow → Regels**
3. Klik op **Regel toevoegen** en selecteer **Maak een nieuwe regel**
4. Geef je regel een naam (bijv. "Niet-bestaande mailboxen doorsturen naar Forward Email")
5. Onder **Pas deze regel toe als**, selecteer:
   * "Het ontvangeradres komt overeen met..."
   * Voer een patroon in dat alle adressen op je domein matcht (bijv. `*@yourdomain.com`)
6. Onder **Doe het volgende**, selecteer:
   * "Stuur het bericht door naar..."
   * Kies "De volgende mailserver"
   * Voer `mx1.forwardemail.net` in en poort 25
   * Voeg `mx2.forwardemail.net` toe als back-upserver
7. Onder **Behalve als**, selecteer:
   * "De ontvanger is..."
   * Voeg al je bestaande mailboxen toe die niet doorgestuurd mogen worden
8. Stel de regelprioriteit in zodat deze na andere mailflowregels wordt uitgevoerd
9. Klik op **Opslaan** om de regel te activeren
## Problemen oplossen {#troubleshooting}

### Waarom ontvang ik mijn test-e-mails niet {#why-am-i-not-receiving-my-test-emails}

Als je een test-e-mail naar jezelf stuurt, kan het zijn dat deze niet in je inbox verschijnt omdat deze dezelfde "Message-ID" header heeft.

Dit is een algemeen bekend probleem en treft ook diensten zoals Gmail.  <a href="https://support.google.com/a/answer/1703601">Hier is het officiële antwoord van Gmail over dit probleem</a>.

Als je nog steeds problemen ondervindt, is het waarschijnlijk een probleem met DNS-propagatie.  Je zult iets langer moeten wachten en het opnieuw proberen (of proberen een lagere TTL-waarde in te stellen op je <strong class="notranslate">TXT</strong>-records).

**Nog steeds problemen?**  Neem dan <a href="/help">contact met ons op</a> zodat we kunnen helpen het probleem te onderzoeken en snel op te lossen.

### Hoe configureer ik mijn e-mailclient om te werken met Forward Email {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
  Onze dienst werkt met populaire e-mailclients zoals:
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
  Je gebruikersnaam is het e-mailadres van je alias en het wachtwoord is van <strong class="text-success"><i class="fa fa-key"></i> Wachtwoord genereren</strong> ("Normaal wachtwoord").
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>Als je Thunderbird gebruikt, zorg er dan voor dat "Verbindingsbeveiliging" is ingesteld op "SSL/TLS" en de authenticatiemethode is ingesteld op "Normaal wachtwoord".</span>
</div>

| Type |         Hostnaam        |         Protocol        |                                            Poorten                                           |
| :--: | :---------------------: | :---------------------: | :------------------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` |  SSL/TLS **Voorkeur**   |                                      `993` en `2993`                                        |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **Aanbevolen**  | `465` en `2465` voor SSL/TLS (aanbevolen) of `587`, `2587`, `2525` en `25` voor STARTTLS    |

### Waarom komen mijn e-mails in Spam en Ongewenste e-mail terecht en hoe kan ik de reputatie van mijn domein controleren {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}
Deze sectie begeleidt je als je uitgaande mail onze SMTP-servers gebruikt (bijv. `smtp.forwardemail.net`) (of doorgestuurd via `mx1.forwardemail.net` of `mx2.forwardemail.net`) en deze wordt afgeleverd in de Spam- of Ongewenste map van ontvangers.

We monitoren routinematig onze [IP-adressen](#what-are-your-servers-ip-addresses) tegen [alle gerenommeerde DNS-denylists](#how-do-you-handle-your-ip-addresses-becoming-blocked), **dus het is hoogstwaarschijnlijk een domein-reputatie specifiek probleem**.

E-mails kunnen om verschillende redenen in spamfolders terechtkomen:

1. **Ontbrekende authenticatie**: Stel [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) en [DMARC](#how-do-i-set-up-dmarc-for-forward-email) records in.

2. **Domeinreputatie**: Nieuwe domeinen hebben vaak een neutrale reputatie totdat ze een verzendgeschiedenis opbouwen.

3. **Content triggers**: Bepaalde woorden of zinnen kunnen spamfilters activeren.

4. **Verzendpatronen**: Plotselinge stijgingen in e-mailvolume kunnen verdacht lijken.

Je kunt proberen een of meer van deze tools te gebruiken om de reputatie en categorisering van je domein te controleren:

#### Reputation and Blocklist Check Tools {#reputation-and-blocklist-check-tools}

| Tool Naam                                  | URL                                                          | Type                   |
| ------------------------------------------- | ------------------------------------------------------------ | ---------------------- |
| Cloudflare Domain Categorization Feedback   | <https://radar.cloudflare.com/domains/feedback>              | Categorisatie          |
| Spamhaus IP and Domain Reputation Checker   | <https://check.spamhaus.org/>                                | DNSBL                  |
| Cisco Talos IP and Domain Reputation Center | <https://talosintelligence.com/reputation_center>            | Reputatie              |
| Barracuda IP and Domain Reputation Lookup   | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL                  |
| MX Toolbox Blacklist Check                  | <https://mxtoolbox.com/blacklists.aspx>                      | Zwarte lijst           |
| Google Postmaster Tools                     | <https://www.gmail.com/postmaster/>                          | Reputatie              |
| Yahoo Sender Hub                            | <https://senders.yahooinc.com/>                              | Reputatie              |
| MultiRBL.valli.org Blacklist Check          | <https://multirbl.valli.org/lookup/>                         | DNSBL                  |
| Sender Score                                | <https://senderscore.org/act/blocklist-remover/>             | Reputatie              |
| Invaluement                                 | <https://www.invaluement.com/lookup/>                        | DNSBL                  |
| SURBL                                       | <https://www.surbl.org/>                                     | DNSBL                  |
| SpamCop                                     | <https://www.spamcop.net/bl.shtml>                           | DNSBL                  |
| UCEPROTECT's Levels 1, 2, and 3             | <https://www.uceprotect.net/en/rblcheck.php>                 | DNSBL                  |
| UCEPROTECT's backscatterer.org              | <https://www.backscatterer.org/>                             | Backscatter Protection |
| UCEPROTECT's whitelisted.org                | <https://www.whitelisted.org/> (requires a fee)              | DNSWL                  |

#### IP Removal Request Forms by Provider {#ip-removal-request-forms-by-provider}

Als je IP-adres door een specifieke e-mailprovider is geblokkeerd, gebruik dan het juiste verwijderingsformulier of contact hieronder:

| Provider                               | Verwijderingsformulier / Contact                                                                                     | Opmerkingen                                  |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Google/Gmail                           | <https://support.google.com/mail/contact/bulk_send_new>                                                    | Bulk verzender contactformulier              |
| Microsoft (Outlook/Office 365/Hotmail) | <https://sender.office.com>                                                                                | Office 365 IP delist portal                   |
| Yahoo/AOL/Verizon                      | <https://senders.yahooinc.com/>                                                                            | Yahoo Sender Hub                              |
| Apple/iCloud                           | <https://ipcheck.proofpoint.com/>                                                                          | Apple gebruikt Proofpoint voor IP-reputatie  |
| Proofpoint                             | <https://ipcheck.proofpoint.com/>                                                                          | Proofpoint IP-check en verwijdering           |
| Barracuda Networks                     | <https://www.barracudacentral.org/lookups/lookup-reputation>                                               | Barracuda reputatie lookup en verwijdering    |
| Cloudmark                              | <https://csi.cloudmark.com/en/reset/>                                                                      | Cloudmark CSI reset aanvraag                   |
| GoDaddy/SecureServer                   | <https://unblock.secureserver.net>                                                                         | GoDaddy IP unblock aanvraagformulier           |
| Comcast/Xfinity                        | <https://spa.xfinity.com/report>                                                                           | Comcast IP verwijderingsverzoek                |
| Charter/Spectrum                       | <https://www.spectrum.net/support/internet/understanding-email-error-codes>                                | Neem contact op met Spectrum support voor verwijdering |
| AT&T                                   | `abuse_rbl@abuse-att.net`                                                                                  | E-mail voor verwijderingsverzoek               |
| Cox Communications                     | `unblock.request@cox.net`                                                                                  | E-mail voor verwijderingsverzoek               |
| CenturyLink/Lumen                      | `abuse@centurylink.com`                                                                                    | Gebruikt Cloudfilter                            |
| Windstream                             | `abuse@windstream.net`                                                                                     | E-mail voor verwijderingsverzoek               |
| t-online.de (Duitsland)                | `tobr@rx.t-online.de`                                                                                      | E-mail voor verwijderingsverzoek               |
| Orange France                          | <https://postmaster.orange.fr/>                                                                            | Gebruik contactformulier of e-mail `abuse@orange.fr` |
| GMX                                    | <https://postmaster.gmx.net/en/contact>                                                                    | GMX postmaster contactformulier                 |
| Mail.ru                                | <https://postmaster.mail.ru/>                                                                              | Mail.ru postmaster portal                       |
| Yandex                                 | <https://postmaster.yandex.ru/>                                                                            | Yandex postmaster portal                        |
| QQ Mail (Tencent)                      | <https://open.mail.qq.com/>                                                                                | QQ Mail whitelist aanvraag (Chinees)           |
| Netease (163.com)                      | <https://mail.163.com/postmaster/>                                                                         | Netease postmaster portal                       |
| Alibaba/Aliyun/HiChina                 | <https://www.alibabacloud.com/help/en/alibaba-mail/>                                                       | Contact via Alibaba Cloud console               |
| Amazon SES                             | <https://docs.aws.amazon.com/ses/latest/dg/faqs-dnsbls.html>                                               | AWS SES console > Blacklist Removal             |
| SendGrid                               | <https://support.sendgrid.com/>                                                                            | Contact SendGrid support                        |
| Mimecast                               | <https://community.mimecast.com/>                                                                          | Gebruikt derde partij RBLs - contacteer specifieke RBL |
| Fastmail                               | <https://www.fastmail.com/support/>                                                                        | Contact Fastmail support                        |
| Zoho                                   | <https://help.zoho.com/portal/en/kb/campaigns/faqs/campaign-review/articles/how-do-i-delist-my-ip-address> | Contact Zoho support                            |
| ProtonMail                             | <https://proton.me/support/contact>                                                                        | Contact Proton support                          |
| Tutanota                               | <https://tutanota.com/support>                                                                             | Contact Tutanota support                        |
| Hushmail                               | <https://www.hushmail.com/support/>                                                                        | Contact Hushmail support                        |
| Mailbox.org                            | <https://mailbox.org/en/support>                                                                           | Contact Mailbox.org support                     |
| Posteo                                 | <https://posteo.de/en/site/contact>                                                                        | Contact Posteo support                          |
| DuckDuckGo Email                       | <https://duckduckgo.com/email/support>                                                                     | Contact DuckDuckGo support                      |
| Sonic.net                              | <https://www.sonic.com/support>                                                                            | Contact Sonic support                           |
| Telus                                  | <https://www.telus.com/en/support>                                                                         | Contact Telus support                           |
| Vodafone Germany                       | <https://www.vodafone.de/hilfe/>                                                                           | Contact Vodafone support                        |
| Xtra (Spark NZ)                        | <https://www.spark.co.nz/help/>                                                                            | Contact Spark NZ support                        |
| UOL/BOL (Brazilië)                     | <https://ajuda.uol.com.br/>                                                                                | Contact UOL support (Portugees)                 |
| Libero (Italië)                       | <https://aiuto.libero.it/>                                                                                 | Contact Libero support (Italiaans)              |
| Telenet (België)                      | <https://www2.telenet.be/en/support/>                                                                      | Contact Telenet support                         |
| Facebook/WhatsApp                      | <https://www.facebook.com/business/help>                                                                   | Contact Facebook business support               |
| LinkedIn                               | <https://www.linkedin.com/help/linkedin>                                                                   | Contact LinkedIn support                        |
| Groups.io                              | <https://groups.io/helpcenter>                                                                             | Contact Groups.io support                       |
| Earthlink/Vade Secure                  | <https://sendertool.vadesecure.com/en/>                                                                    | Vade Secure verzendtool                         |
| Cloudflare Email Security              | <https://www.cloudflare.com/products/zero-trust/email-security/>                                           | Contact Cloudflare support                      |
| Hornetsecurity/Expurgate               | <https://www.hornetsecurity.com/>                                                                          | Contact Hornetsecurity support                  |
| SpamExperts/Antispamcloud              | <https://www.spamexperts.com/>                                                                             | Contact via hostingprovider                      |
| Mail2World                             | <https://www.mail2world.com/support/>                                                                      | Contact Mail2World support                      |
> \[!TIP]
> Begin met een laag volume aan e-mails van hoge kwaliteit om een positieve reputatie op te bouwen voordat je grotere volumes verstuurt.

> \[!IMPORTANT]
> Als je domein op een blacklist staat, heeft elke blacklist zijn eigen verwijderingsproces. Controleer hun websites voor instructies.

> \[!TIP]
> Als je extra hulp nodig hebt of merkt dat wij ten onrechte als spam worden gemarkeerd door een bepaalde e-mailprovider, neem dan <a href="/help">contact met ons op</a>.

### Wat moet ik doen als ik spam-e-mails ontvang {#what-should-i-do-if-i-receive-spam-emails}

Je moet je afmelden voor de mailinglijst (indien mogelijk) en de afzender blokkeren.

Rapporteer het bericht niet als spam, maar stuur het in plaats daarvan door naar ons handmatig samengestelde en privacygerichte misbruikpreventiesysteem.

**Het e-mailadres om spam naartoe te sturen is:** <abuse@forwardemail.net>

### Waarom worden mijn test-e-mails die ik naar mezelf stuur in Gmail als "verdacht" weergegeven {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Als je deze foutmelding in Gmail ziet wanneer je een test naar jezelf stuurt, of wanneer iemand met wie je e-mailt via je alias voor het eerst een e-mail van je ontvangt, maak je dan **geen zorgen** – dit is een ingebouwde veiligheidsfunctie van Gmail.

Je kunt simpelweg op "Lijkt veilig" klikken. Bijvoorbeeld, als je een testbericht zou sturen met de functie 'verzenden als' (naar iemand anders), dan zullen zij dit bericht niet zien.

Als zij dit bericht wel zien, komt dat omdat ze normaal gesproken gewend zijn je e-mails te ontvangen van <john@gmail.com> in plaats van <john@customdomain.com> (slechts een voorbeeld). Gmail waarschuwt gebruikers om zeker te zijn dat alles veilig is, er is geen omweg.

### Kan ik de via forwardemail dot net in Gmail verwijderen {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

Dit onderwerp heeft betrekking op een [breed bekend probleem in Gmail waarbij extra info naast de naam van de afzender verschijnt](https://support.google.com/mail/answer/1311182).

Vanaf mei 2023 ondersteunen we het verzenden van e-mail via SMTP als add-on voor alle betaalde gebruikers – wat betekent dat je de <span class="notranslate">via forwardemail dot net</span> in Gmail kunt verwijderen.

Let op dat deze FAQ specifiek is voor degenen die de [Hoe mail verzenden als met Gmail](#how-to-send-mail-as-using-gmail) functie gebruiken.

Zie de sectie over [Ondersteunen jullie het verzenden van e-mail via SMTP](#do-you-support-sending-email-with-smtp) voor configuratie-instructies.


## Gegevensbeheer {#data-management}

### Waar bevinden zich jullie servers {#where-are-your-servers-located}

> \[!TIP]
> We zullen binnenkort onze EU-datacenterlocatie aankondigen die wordt gehost onder [forwardemail.eu](https://forwardemail.eu). Abonneer je op de discussie via <https://github.com/orgs/forwardemail/discussions/336> voor updates.

Onze servers bevinden zich voornamelijk in Denver, Colorado – zie <https://forwardemail.net/ips> voor onze volledige lijst met IP-adressen.

Je kunt meer leren over onze subprocessors op onze [GDPR](/gdpr), [DPA](/dpa), en [Privacy](/privacy) pagina's.

### Hoe exporteer en back-up ik mijn mailbox {#how-do-i-export-and-backup-my-mailbox}

Je kunt op elk moment je mailboxen exporteren als [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox), of versleutelde [SQLite](https://en.wikipedia.org/wiki/SQLite) formaten.

Ga naar <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Aliassen <i class="fa fa-angle-right"></i> Download Back-up en selecteer je gewenste exportformaat.

Je ontvangt een e-mail met een link om de export te downloaden zodra deze klaar is.

Let op dat deze downloadlink voor de export na 4 uur verloopt vanwege beveiligingsredenen.

Als je je geëxporteerde EML- of Mbox-formaten wilt inspecteren, kunnen deze open-source tools nuttig zijn:

| Naam            | Formaat | Platform      | GitHub URL                                          |
| --------------- | :-----: | ------------- | -------------------------------------------------- |
| MBox Viewer     |  Mbox   | Windows       | <https://github.com/eneam/mboxviewer>              |
| mbox-web-viewer |  Mbox   | Alle platformen | <https://github.com/PHMRanger/mbox-web-viewer>    |
| EmlReader       |   EML   | Windows       | <https://github.com/ayamadori/EmlReader>           |
| Email viewer    |   EML   | VSCode        | <https://github.com/joelharkes/vscode_email_viewer>|
| eml-reader      |   EML   | Alle platformen | <https://github.com/s0ph1e/eml-reader>             |
Daarnaast, als je een Mbox-bestand naar een EML-bestand moet converteren, kun je <https://github.com/noelmartinon/mboxzilla> gebruiken.

### Hoe importeer en migreer ik mijn bestaande mailbox {#how-do-i-import-and-migrate-my-existing-mailbox}

Je kunt eenvoudig je e-mail importeren naar Forward Email (bijv. met [Thunderbird](https://www.thunderbird.net)) met de onderstaande instructies:

<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Belangrijk:
  </strong>
  <span>
    Je moet alle onderstaande stappen volgen om je bestaande e-mail te importeren.
  </span>
</div>

1. Exporteer je e-mail van je huidige e-mailprovider:

   | E-mailprovider | Exportformaat                                  | Exportinstructies                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
   | -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Gmail          | MBOX                                           | <https://takeout.google.com/settings/takeout/custom/gmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
   | Outlook        | PST                                            | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Tip:</strong> <span>Als je Outlook gebruikt (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">PST exportformaat</a>), kun je eenvoudig de instructies onder "Overig" hieronder volgen. We hebben echter ook links toegevoegd om PST naar MBOX/EML te converteren op basis van je besturingssysteem:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba voor Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst voor Windows cygwin</a> – (bijv. <code>readpst -u -o $OUT_DIR $IN_DIR</code> waarbij je <code>$OUT_DIR</code> en <code>$IN_DIR</code> vervangt door de paden van de uitvoer- en invoermap).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst voor Ubuntu/Linux</a> – (bijv. <code>sudo apt-get install readpst</code> en daarna <code>readpst -u -o $OUT_DIR $IN_DIR</code>, waarbij je <code>$OUT_DIR</code> en <code>$IN_DIR</code> vervangt door de paden van de uitvoer- en invoermap).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst voor macOS (via brew)</a> – (bijv. <code>brew install libpst</code> en daarna <code>readpst -u -o $OUT_DIR $IN_DIR</code>, waarbij je <code>$OUT_DIR</code> en <code>$IN_DIR</code> vervangt door de paden van de uitvoer- en invoermap).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">PST Converter voor Windows (GitHub)</a></li></ul><br /></span></div> |
   | Apple Mail     | MBOX                                           | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Fastmail       | EML                                            | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
   | Proton Mail    | MBOX/EML                                       | <https://proton.me/support/export-emails-import-export-app>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
   | Tutanota       | EML                                            | <https://github.com/crepererum-oss/tatutanatata>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Gandi          | EML                                            | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
   | Zoho           | EML                                            | <https://www.zoho.com/mail/help/import-export-emails.html#alink2>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
   | Overig         | [Gebruik Thunderbird](https://www.thunderbird.net) | Stel je bestaande e-mailaccount in Thunderbird in en gebruik vervolgens de [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) plugin om je e-mail te exporteren en importeren.  **Je kunt mogelijk ook eenvoudig e-mails kopiëren/plakken of slepen/neerzetten tussen accounts.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
2. Download, installeer en open [Thunderbird](https://www.thunderbird.net).

3. Maak een nieuw account aan met het volledige e-mailadres van je alias (bijv. <code><you@yourdomain.com></code>) en je gegenereerde wachtwoord.  <strong>Als je nog geen gegenereerd wachtwoord hebt, <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">raadpleeg dan onze installatie-instructies</a></strong>.

4. Download en installeer de [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) Thunderbird-plugin.

5. Maak een nieuwe lokale map aan in Thunderbird, klik er vervolgens met de rechtermuisknop op → selecteer de optie `ImportExportTools NG` → kies `Import mbox file` (voor MBOX exportformaat) – of – `Import messages` / `Import all messages from a directory` (voor EML exportformaat).

6. Sleep/verplaats vanuit de lokale map naar een nieuwe (of bestaande) IMAP-map in Thunderbird waar je berichten naartoe wilt uploaden in IMAP-opslag met onze service.  Dit zorgt ervoor dat ze online worden geback-upt met onze SQLite versleutelde opslag.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>
       Als je niet zeker weet hoe je moet importeren in Thunderbird, kun je de officiële instructies raadplegen op <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> en <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
     </span>
   </div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Belangrijk:
  </strong>
  <span>
    Zodra je het export- en importproces hebt voltooid, wil je misschien ook doorsturen inschakelen op je bestaande e-mailaccount en een automatische beantwoorder instellen om afzenders te informeren dat je een nieuw e-mailadres hebt (bijv. als je eerder Gmail gebruikte en nu een e-mail met je eigen domeinnaam gebruikt).
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

### Hoe gebruik ik mijn eigen S3-compatibele opslag voor backups {#how-do-i-use-my-own-s3-compatible-storage-for-backups}

Betaalde gebruikers kunnen hun eigen [S3](https://en.wikipedia.org/wiki/Amazon_S3)-compatibele opslagprovider configureren per domein voor IMAP/SQLite backups.  Dit betekent dat je versleutelde mailbox-backups kunnen worden opgeslagen op je eigen infrastructuur in plaats van (of naast) onze standaardopslag.

Ondersteunde providers zijn onder andere [Amazon S3](https://aws.amazon.com/s3/), [Cloudflare R2](https://developers.cloudflare.com/r2/), [MinIO](https://github.com/minio/minio), [Backblaze B2](https://www.backblaze.com/cloud-storage), [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces) en elke andere S3-compatibele dienst.

#### Installatie {#setup}

1. Maak een **privé** bucket aan bij je S3-compatibele provider. De bucket mag niet publiek toegankelijk zijn.
2. Maak toegangsreferenties aan (access key ID en secret access key) met lees-/schrijfrechten voor de bucket.
3. Ga naar <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Geavanceerde Instellingen <i class="fa fa-angle-right"></i> Aangepaste S3-Compatibele Opslag.
4. Vink **"Aangepaste S3-compatibele opslag inschakelen"** aan en vul je endpoint-URL, access key ID, secret access key, regio en bucketnaam in.
5. Klik op **"Test verbinding"** om je referenties, buckettoegang en schrijfrechten te verifiëren.
6. Klik op **"Opslaan"** om de instellingen toe te passen.

#### Hoe Backups Werken {#how-backups-work}

Backups worden automatisch gestart voor elke verbonden IMAP-alias. De IMAP-server controleert elk uur alle actieve verbindingen en start een backup voor elke verbonden alias. Een op Redis gebaseerde lock voorkomt dat dubbele backups binnen 30 minuten worden uitgevoerd, en de daadwerkelijke backup wordt overgeslagen als er binnen de laatste 24 uur al een succesvolle backup is voltooid (tenzij de backup expliciet door een gebruiker is aangevraagd voor download).
Back-ups kunnen ook handmatig worden gestart door te klikken op **"Download Backup"** voor een alias in het dashboard. Handmatige back-ups worden altijd uitgevoerd, ongeacht het 24-uurs venster.

Het back-upproces werkt als volgt:

1. De SQLite-database wordt gekopieerd met `VACUUM INTO`, wat een consistente snapshot maakt zonder actieve verbindingen te onderbreken en de database-encryptie behoudt.
2. Het back-upbestand wordt geverifieerd door het te openen om te bevestigen dat de encryptie nog geldig is.
3. Er wordt een SHA-256-hash berekend en vergeleken met de bestaande back-up in opslag. Als de hash overeenkomt, wordt de upload overgeslagen (geen wijzigingen sinds de laatste back-up).
4. De back-up wordt geüpload naar S3 met multipart upload via de [@aws-sdk/lib-storage](https://github.com/aws/aws-sdk-js-v3/tree/main/lib/lib-storage) bibliotheek.
5. Er wordt een ondertekende download-URL (geldig voor 4 uur) gegenereerd en per e-mail naar de gebruiker gestuurd.

#### Backup Formats {#backup-formats}

Drie back-upformaten worden ondersteund:

| Formaat  | Extensie  | Beschrijving                                                                 |
| -------- | --------- | --------------------------------------------------------------------------- |
| `sqlite` | `.sqlite` | Ruwe versleutelde SQLite database snapshot (standaard voor automatische IMAP-back-ups) |
| `mbox`   | `.zip`    | Wachtwoordbeveiligde ZIP met mailbox in mbox-formaat                        |
| `eml`    | `.zip`    | Wachtwoordbeveiligde ZIP met individuele `.eml` bestanden per bericht       |

> **Tip:** Als je `.sqlite` back-upbestanden hebt en deze lokaal wilt converteren naar `.eml` bestanden, gebruik dan onze standalone CLI-tool **[convert-sqlite-to-eml](#how-do-i-convert-sqlite-backups-to-eml-files)**. Deze werkt op Windows, Linux en macOS en vereist geen netwerkverbinding.

#### File Naming and Key Structure {#file-naming-and-key-structure}

Bij gebruik van **aangepaste S3-opslag** worden back-upbestanden opgeslagen met een [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) tijdstempelprefix zodat elke back-up als een apart object wordt bewaard. Dit geeft je een volledige back-upgeschiedenis in je eigen bucket.

Het sleutel-formaat is:

```
{ISO 8601 timestamp}-{alias_id}.{extension}
```

Bijvoorbeeld:

```
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.zip
2025-03-02T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
```

De `alias_id` is de MongoDB ObjectId van de alias. Je kunt deze vinden op de alias-instellingenpagina of via de API.

Bij gebruik van de **standaard (systeem) opslag** is de sleutel vlak (bijv. `65a31c53c36b75ed685f3fda.sqlite`) en overschrijft elke back-up de vorige.

> **Opmerking:** Omdat aangepaste S3-opslag alle back-upversies bewaart, zal het opslaggebruik in de loop van de tijd toenemen. We raden aan om [lifecycle regels](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html) in te stellen op je bucket om oude back-ups automatisch te verwijderen (bijv. objecten ouder dan 30 of 90 dagen verwijderen).

#### Data Ownership and Deletion Policy {#data-ownership-and-deletion-policy}

Je aangepaste S3-bucket staat volledig onder jouw controle. Wij **verwijderen of wijzigen nooit** bestanden in jouw aangepaste S3-bucket — niet wanneer een alias wordt verwijderd, niet wanneer een domein wordt verwijderd, en niet tijdens opruimacties. We schrijven alleen nieuwe back-upbestanden naar jouw bucket.

Dit betekent:

* **Alias verwijderen** — Wanneer je een alias verwijdert, verwijderen wij de back-up alleen uit onze standaard systeemopslag. Back-ups die eerder naar jouw aangepaste S3-bucket zijn geschreven blijven onaangeroerd.
* **Domein verwijderen** — Het verwijderen van een domein heeft geen invloed op bestanden in jouw aangepaste bucket.
* **Bewaarbeheer** — Jij bent verantwoordelijk voor het beheren van opslag in je eigen bucket, inclusief het instellen van lifecycle regels om oude back-ups te verwijderen.

Als je aangepaste S3-opslag uitschakelt of terugschakelt naar onze standaardopslag, blijven bestaande bestanden in je bucket behouden. Toekomstige back-ups worden dan gewoon naar onze standaardopslag geschreven.

#### Security {#security}

* Je access key ID en secret access key zijn **versleuteld in rust** met [AES-256-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode) voordat ze in onze database worden opgeslagen. Ze worden alleen ontsleuteld tijdens runtime bij het uitvoeren van back-upoperaties.
* We valideren automatisch dat je bucket **niet publiek toegankelijk** is. Als een publieke bucket wordt gedetecteerd, wordt de configuratie geweigerd bij opslaan. Als publieke toegang wordt gedetecteerd tijdens back-up, schakelen we terug naar onze standaardopslag en informeren we alle domeinbeheerders per e-mail.
* Referenties worden gevalideerd bij opslaan via een [HeadBucket](https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadBucket.html) oproep om te controleren of de bucket bestaat en de referenties correct zijn. Als validatie faalt, wordt aangepaste S3-opslag automatisch uitgeschakeld.
* Elk back-upbestand bevat een SHA-256-hash in zijn S3-metadata, die wordt gebruikt om ongewijzigde databases te detecteren en overbodige uploads over te slaan.
#### Foutmeldingen {#error-notifications}

Als een back-up mislukt bij het gebruik van je aangepaste S3-opslag (bijv. door verlopen referenties of een verbindingsprobleem), worden alle domeinbeheerders per e-mail op de hoogte gebracht. Deze meldingen worden beperkt tot eenmaal per 6 uur om dubbele waarschuwingen te voorkomen. Als je bucket tijdens de back-up als openbaar toegankelijk wordt gedetecteerd, worden beheerders eenmaal per dag geïnformeerd.

#### API {#api}

Je kunt ook aangepaste S3-opslag configureren via de API:

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

Om de verbinding via de API te testen:

```sh
curl -X POST https://api.forwardemail.net/v1/domains/example.com/test-s3-connection \
  -u API_TOKEN:
```

### Hoe converteer ik SQLite-back-ups naar EML-bestanden {#how-do-i-convert-sqlite-backups-to-eml-files}

Als je SQLite-back-ups downloadt of opslaat (ofwel van onze standaardopslag of je eigen [aangepaste S3-bucket](#how-do-i-use-my-own-s3-compatible-storage-for-backups)), kun je deze converteren naar standaard `.eml`-bestanden met onze zelfstandige CLI-tool **[convert-sqlite-to-eml](https://github.com/forwardemail/forwardemail.net/tree/master/tools/convert-sqlite-to-eml)**. EML-bestanden kunnen worden geopend met elke e-mailclient ([Thunderbird](https://www.thunderbird.net/), [Outlook](https://www.microsoft.com/en-us/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook), [Apple Mail](https://support.apple.com/mail), enz.) of geïmporteerd in andere mailservers.

#### Installatie {#installation-1}

Je kunt een vooraf gebouwde binary downloaden (geen [Node.js](https://github.com/nodejs/node) vereist) of het direct uitvoeren met [Node.js](https://github.com/nodejs/node):

**Vooraf gebouwde binaries** — Download de nieuwste release voor jouw platform van [GitHub Releases](https://github.com/forwardemail/forwardemail.net/releases):

| Platform | Architectuur  | Bestand                              |
| -------- | ------------- | ----------------------------------- |
| Linux    | x64           | `convert-sqlite-to-eml-linux-x64`   |
| Linux    | arm64         | `convert-sqlite-to-eml-linux-arm64` |
| macOS    | Apple Silicon | `convert-sqlite-to-eml-darwin-arm64`|
| Windows  | x64           | `convert-sqlite-to-eml-win-x64.exe` |

> **macOS-gebruikers:** Na het downloaden moet je mogelijk het quarantaine-attribuut verwijderen voordat je de binary uitvoert:
>
> ```bash
> sudo xattr -rd com.apple.quarantine ./convert-sqlite-to-eml-darwin-arm64
> ```
>
> (Vervang `./convert-sqlite-to-eml-darwin-arm64` door het daadwerkelijke pad naar het gedownloade bestand.)

> **Linux-gebruikers:** Na het downloaden moet je mogelijk de binary uitvoerbaar maken:
>
> ```bash
> chmod +x ./convert-sqlite-to-eml-linux-x64
> ```
>
> (Vervang `./convert-sqlite-to-eml-linux-x64` door het daadwerkelijke pad naar het gedownloade bestand.)

**Vanuit de bron** (vereist [Node.js](https://github.com/nodejs/node) >= 18):

```bash
cd tools/convert-sqlite-to-eml
npm install
node index.js
```

#### Gebruik {#usage}

De tool ondersteunt zowel interactieve als niet-interactieve modi.

**Interactieve modus** — voer uit zonder argumenten en je wordt gevraagd om alle invoer:

```bash
./convert-sqlite-to-eml
```

```
  Forward Email - Converteer SQLite-back-up naar EML
  ================================================

  Pad naar SQLite-back-upbestand: /path/to/backup.sqlite
  IMAP/alias wachtwoord: ********
  Uitvoer ZIP-pad [/path/to/backup-2025-03-01T12-00-00-000Z.zip]:
```

**Niet-interactieve modus** — geef argumenten door via commandoregelvlaggen voor scripting en automatisering:

```bash
./convert-sqlite-to-eml \
  --path /path/to/backup.sqlite \
  --password "your-imap-password" \
  --output /path/to/output.zip
```

| Vlag                | Beschrijving                                                                   |
| ------------------- | ----------------------------------------------------------------------------- |
| `--path <path>`     | Pad naar het versleutelde SQLite-back-upbestand                               |
| `--password <pass>` | IMAP/alias wachtwoord voor decryptie                                          |
| `--output <path>`   | Uitvoerpad voor het ZIP-bestand (standaard: automatisch gegenereerd met ISO 8601-tijdstempel) |
| `--help`            | Toon helpbericht                                                              |
#### Output Formaat {#output-format}

De tool produceert een met een wachtwoord beveiligd ZIP-archief (AES-256 versleuteld) met daarin:

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

EML-bestanden zijn georganiseerd per mailboxmap. Het ZIP-wachtwoord is hetzelfde als je IMAP/alias wachtwoord. Elk `.eml` bestand is een standaard [RFC 5322](https://datatracker.ietf.org/doc/html/rfc5322) e-mailbericht met volledige headers, berichttekst en bijlagen die zijn gereconstrueerd uit de SQLite-database.

#### Hoe Het Werkt {#how-it-works}

1. Opent de versleutelde SQLite-database met je IMAP/alias wachtwoord (ondersteunt zowel [ChaCha20](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) als [AES-256-CBC](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) ciphers).
2. Leest de Mailboxes-tabel om de mappenstructuur te ontdekken.
3. Voor elk bericht decodeert het de mimeTree (opgeslagen als [Brotli](https://github.com/google/brotli)-gecomprimeerde JSON) uit de Messages-tabel.
4. Reconstrueert de volledige EML door de MIME-boom te doorlopen en bijlagen op te halen uit de Attachments-tabel.
5. Verpakt alles in een met een wachtwoord beveiligd ZIP-archief met behulp van [archiver-zip-encrypted](https://github.com/artem-silaev/archiver-zip-encrypted).

### Ondersteunen jullie zelf-hosting? {#do-you-support-self-hosting}

Ja, vanaf maart 2025 ondersteunen we een zelf-gehoste optie. Lees de blog [hier](https://forwardemail.net/blog/docs/self-hosted-solution). Bekijk de [zelf-gehoste gids](https://forwardemail.net/self-hosted) om aan de slag te gaan. En voor wie geïnteresseerd is in een meer stapsgewijze versie, zie onze [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) of [Debian](https://forwardemail.net/guides/selfhosted-on-debian) gebaseerde handleidingen.


## E-mailconfiguratie {#email-configuration}

### Hoe begin ik en stel ik e-mail forwarding in? {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Geschatte Installatietijd:</strong>
  <span>Minder dan 10 minuten</span>
</div>

<div class="alert my-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Aan de slag:
  </strong>
  <span>
    Lees zorgvuldig en volg de stappen één tot en met acht hieronder. Vervang zeker het e-mailadres <code>user@gmail.com</code> door het e-mailadres waar je e-mails naartoe wilt doorsturen (als dit nog niet correct is). Vervang ook <code>example.com</code> door je eigen domeinnaam (als dit nog niet correct is).
  </span>
</div>

<ol>
  <li class="mb-2 mb-md-3 mb-lg-5">Als je je domeinnaam al ergens hebt geregistreerd, sla dan deze stap volledig over en ga door naar stap twee! Anders kun je <a href="/domain-registration" rel="noopener noreferrer">hier klikken om je domeinnaam te registreren</a>.</li>
  <li class="mb-2 mb-md-3 mb-lg-5">
  Weet je nog waar je je domein hebt geregistreerd? Zodra je dat weet, volg dan de onderstaande instructies:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Belangrijk:
  </strong>
  <span>
    Je moet een nieuw tabblad openen en inloggen bij je domeinregistrar. Je kunt eenvoudig op je "Registrar" hieronder klikken om dit automatisch te doen. In dit nieuwe tabblad moet je navigeren naar de DNS-beheerpagina bij je registrar – we hebben de stapsgewijze navigatiestappen hieronder onder de kolom "Stappen om te configureren" gegeven. Zodra je op deze pagina bent in het nieuwe tabblad, kun je terugkeren naar dit tabblad en doorgaan met stap drie hieronder.
    <strong class="font-weight-bold">Sluit het geopende tabblad nog niet; je hebt het nodig voor toekomstige stappen!</strong>
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
      <td>Inloggen <i class="fa fa-angle-right"></i> Domain Center <i class="fa fa-angle-right"></i> (Selecteer je domein) <i class="fa fa-angle-right"></i> DNS-instellingen bewerken</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Route 53</a></td>
      <td>Inloggen <i class="fa fa-angle-right"></i> Hosted Zones <i class="fa fa-angle-right"></i> (Selecteer je domein)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
      <td>Inloggen <i class="fa fa-angle-right"></i> My Servers <i class="fa fa-angle-right"></i> Domeinbeheer <i class="fa fa-angle-right"></i> DNS Manager</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
      <td>VOOR ROCK: Inloggen <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> (Klik op het ▼-icoon naast beheren) <i class="fa fa-angle-right"></i> DNS
      <br />
      VOOR LEGACY: Inloggen <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> Zone editor <i class="fa fa-angle-right"></i> (Selecteer je domein)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
      <td>Inloggen <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Made Easy</a></td>
      <td>Inloggen <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Selecteer je domein)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
      <td>Inloggen <i class="fa fa-angle-right"></i> (Selecteer je domein)  <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Beheren</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
      <td>Inloggen <i class="fa fa-angle-right"></i> Networking <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> (Selecteer je domein) <i class="fa fa-angle-right"></i> Meer <i class="fa fa-angle-right"></i> Domein beheren</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
      <td>Inloggen <i class="fa fa-angle-right"></i> In kaartweergave, klik beheren op je domein <i class="fa fa-angle-right"></i> In lijstweergave, klik op het tandwiel-icoon <i class="fa fa-angle-right"></i> DNS & Nameservers <i class="fa fa-angle-right"></i> DNS Records</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> Bekijk</a>
      </td>
      <td>Inloggen <i class="fa fa-angle-right"></i> (Selecteer je domein) <i class="fa fa-angle-right"></i> Beheren <i class="fa fa-angle-right"></i> (klik op het tandwiel-icoon) <i class="fa fa-angle-right"></i> Klik op DNS &amp; Nameservers in het menu aan de linkerkant</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
      <td>Inloggen <i class="fa fa-angle-right"></i> Panel <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> Manage Domains <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
      <td>Inloggen <i class="fa fa-angle-right"></i> Overview <i class="fa fa-angle-right"></i> Manage <i class="fa fa-angle-right"></i> Simple Editor <i class="fa fa-angle-right"></i> Records</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
      <td>Inloggen <i class="fa fa-angle-right"></i> (Selecteer je domein) <i class="fa fa-angle-right"></i> Beheer <i class="fa fa-angle-right"></i> Bewerk de zone</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> Bekijk</a>
      </td>
      <td>Inloggen <i class="fa fa-angle-right"></i> Manage My Domains <i class="fa fa-angle-right"></i> (Selecteer je domein) <i class="fa fa-angle-right"></i> Manage DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google Domains</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> Bekijk</a>
      </td>
      <td>Inloggen <i class="fa fa-angle-right"></i> (Selecteer je domein) <i class="fa fa-angle-right"></i> Configureer DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> Bekijk</a>
      </td>
      <td>Inloggen <i class="fa fa-angle-right"></i> Domain List <i class="fa fa-angle-right"></i> (Selecteer je domein) <i class="fa fa-angle-right"></i> Beheren <i class="fa fa-angle-right"></i> Geavanceerde DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
      <td>Inloggen <i class="fa fa-angle-right"></i> (Selecteer je domein) <i class="fa fa-angle-right"></i> Stel Netlify DNS in</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Solutions</a></td>
      <td>Inloggen <i class="fa fa-angle-right"></i> Account Manager <i class="fa fa-angle-right"></i> My Domain Names <i class="fa fa-angle-right"></i> (Selecteer je domein) <i class="fa fa-angle-right"></i> Beheren <i class="fa fa-angle-right"></i> Wijzig waar domein naar wijst <i class="fa fa-angle-right"></i> Geavanceerde DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> Bekijk</a>
      </td>
      <td>Inloggen <i class="fa fa-angle-right"></i> Managed Domains <i class="fa fa-angle-right"></i> (Selecteer je domein) <i class="fa fa-angle-right"></i> DNS-instellingen</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
      <td>Inloggen <i class="fa fa-angle-right"></i> Home-menu <i class="fa fa-angle-right"></i> Instellingen <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> (Selecteer je domein) <i class="fa fa-angle-right"></i>
Geavanceerde instellingen <i class="fa fa-angle-right"></i> Aangepaste records</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Vercel's Now</a></td>
      <td>Gebruik "now" CLI <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
      <td>Inloggen <i class="fa fa-angle-right"></i> Domains-pagina <i class="fa fa-angle-right"></i> (Selecteer je domein) <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
      <td>Inloggen <i class="fa fa-angle-right"></i> Domains-pagina <i class="fa fa-angle-right"></i> (Klik op het <i class="fa fa-ellipsis-h"></i> icoon) <i class="fa fa-angle-right"></i> Selecteer Beheer DNS-records</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
      <td>Inloggen <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> Mijn domeinen</td>
    </tr>
    <tr>
      <td>Overig</td>
      <td>
        <div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Belangrijk:</strong> Zie je je registrar niet in deze lijst? Zoek dan eenvoudig op internet naar "hoe DNS-records wijzigen bij $REGISTRAR" (vervang $REGISTRAR door de naam van je registrar – bijvoorbeeld "hoe DNS-records wijzigen bij GoDaddy" als je GoDaddy gebruikt).</div>
      </td>
    </tr>
  </tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">Gebruikmakend van de DNS-beheerpagina van je registrar (het andere tabblad dat je hebt geopend), stel de volgende "MX" records in:
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Belangrijk:
  </strong>
  <span>
    Let op dat er GEEN andere MX-records ingesteld mogen zijn. Beide hieronder getoonde records MOETEN bestaan. Zorg ervoor dat er geen typefouten zijn; en dat je zowel mx1 als mx2 correct gespeld hebt. Als er al MX-records bestonden, verwijder deze dan volledig.
    De "TTL"-waarde hoeft niet 3600 te zijn, het kan indien nodig een lagere of hogere waarde zijn.
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

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Gebruik de DNS-beheerpagina van je registrar (het andere tabblad dat je hebt geopend) en stel de volgende <strong class="notranslate">TXT</strong>-record(s) in:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Belangrijk:
  </strong>
  <span>
    Als je een betaald abonnement hebt, moet je deze stap volledig overslaan en doorgaan naar stap vijf! Als je geen betaald abonnement hebt, dan zijn je doorgestuurde adressen openbaar doorzoekbaar – ga naar <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> en upgrade je domein naar een betaald abonnement indien gewenst. Als je meer wilt weten over betaalde abonnementen, zie onze <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Prijsinformatie</a> pagina. Anders kun je doorgaan en een of meer combinaties kiezen uit Optie A tot en met Optie F hieronder.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Optie A:
  </strong>
  <span>
    Als je alle e-mails van je domein doorstuurt, (bijv. "all@example.com", "hello@example.com", enz.) naar een specifiek adres "user@gmail.com":
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
    Zorg ervoor dat je de waarden hierboven in de kolom "Waarde" vervangt door je eigen e-mailadres. De "TTL"-waarde hoeft niet 3600 te zijn, het kan indien nodig een lagere of hogere waarde zijn. Een lagere time to live ("TTL") waarde zorgt ervoor dat eventuele toekomstige wijzigingen aan je DNS-records sneller over het internet worden verspreid – beschouw dit als hoe lang het in het geheugen wordt gecached (in seconden). Je kunt meer leren over <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL op Wikipedia</a>.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Optie B:
  </strong>
  <span>
    Als je slechts één e-mailadres hoeft door te sturen (bijv. <code>hello@example.com</code> naar <code>user@gmail.com</code>; dit stuurt ook automatisch "hello+test@example.com" door naar "user+test@gmail.com"):
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
    Als je meerdere e-mails doorstuurt, wil je ze scheiden met een komma:
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
    Je kunt een oneindig aantal doorstuur-e-mails instellen – zorg er gewoon voor dat je niet meer dan 255 tekens in één regel gebruikt en dat elke regel begint met "forward-email=". Hieronder staat een voorbeeld:
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
        <code>forward-email=help:user@gmail.com,foo:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", of leeg</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", of leeg</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", of leeg</em></td>
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
    Optie E:
  </strong>
  <span>
    Je kunt ook een domeinnaam opgeven in je <strong class="notranslate">TXT</strong>-record om globale alias-doorsturing te hebben (bijv. "user@example.com" wordt doorgestuurd naar "user@example.net"):
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
    Je kunt zelfs webhooks gebruiken als globale of individuele alias om e-mails naartoe door te sturen. Zie het voorbeeld en de volledige sectie over webhooks getiteld <a href="#do-you-support-webhooks" class="alert-link">Ondersteunen jullie webhooks</a> hieronder.
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
    Je kunt zelfs reguliere expressies ("regex") gebruiken om aliassen te matchen en om substituties te verwerken om e-mails door te sturen. Zie de voorbeelden en de volledige sectie over regex getiteld <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Ondersteunen jullie reguliere expressies of regex</a> hieronder.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Geavanceerde regex met substitutie nodig?</strong> Zie de voorbeelden en de volledige sectie over regex getiteld <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Ondersteunen jullie reguliere expressies of regex</a> hieronder.
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Eenvoudig voorbeeld:</strong> Als ik wil dat alle e-mails die naar `linus@example.com` of `torvalds@example.com` gaan worden doorgestuurd naar `user@gmail.com`:
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
    Dit betekent dat binnenkomende e-mails die overeenkomen met ten minste één specifieke doorstuurregel worden gebruikt in plaats van de catch-all.
    Specifieke regels omvatten e-mailadressen en reguliere expressies.
    <br /><br />
    Bijvoorbeeld:
    <br />
    <code>forward-email=hello:first@gmail.com,second@gmail.com</code>
    <br />
    E-mails gestuurd naar <code>hello@example.com</code> worden **niet** doorgestuurd naar <code>second@gmail.com</code> (catch-all) met deze configuratie, en worden in plaats daarvan alleen afgeleverd bij <code>first@gmail.com</code>.
  </span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Gebruikmakend van de DNS-beheerpagina van je registrar (het andere tabblad dat je hebt geopend), stel daarnaast de volgende <strong class="notranslate">TXT</strong>-record in:

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
    Als je Gmail gebruikt (bijv. Send Mail As) of G Suite, dan moet je <code>include:_spf.google.com</code> toevoegen aan de bovenstaande waarde, bijvoorbeeld:
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
    Als je al een vergelijkbare regel hebt met "v=spf1", dan moet je <code>include:spf.forwardemail.net</code> toevoegen vlak voor bestaande "include:host.com" records en vóór de "-all" in dezelfde regel, bijvoorbeeld:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Let op dat er een verschil is tussen "-all" en "~all". De "-" geeft aan dat de SPF-controle MOET FAILEN als het niet overeenkomt, en "~" geeft aan dat de SPF-controle SOFTFAIL moet zijn. Wij raden aan de "-all" methode te gebruiken om domeinvervalsing te voorkomen.
    <br /><br />
    Mogelijk moet je ook de SPF-record opnemen voor de host waarvan je e-mail verstuurt (bijv. Outlook).
  </span>
</div>
</li><li class="mb-2 mb-md-3 mb-lg-5">Controleer uw DNS-records met onze tool "Records Verifiëren" beschikbaar op <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Instellingen.

</li><li class="mb-2 mb-md-3 mb-lg-5">Stuur een testmail om te bevestigen dat het werkt. Houd er rekening mee dat het enige tijd kan duren voordat uw DNS-records zijn doorgevoerd.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>
  </span>
    Als u geen testmails ontvangt, of een testmail ontvangt met de melding "Wees voorzichtig met dit bericht", bekijk dan de antwoorden op <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Waarom ontvang ik mijn testmails niet</a> en <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Waarom worden mijn testmails die ik naar mezelf in Gmail stuur als "verdacht" weergegeven</a>.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Als u "Mail Verzenden Als" vanuit Gmail wilt gebruiken, moet u <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">deze video bekijken</a></strong>, of de stappen volgen onder <a href="#how-to-send-mail-as-using-gmail">Hoe Mail Verzenden Als te gebruiken met Gmail</a> hieronder.

</li></ol>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gefeliciteerd!
    </strong>
    <span>
      U heeft alle stappen succesvol voltooid.
    </span>
  </div>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>
    Optionele add-ons staan hieronder vermeld. Houd er rekening mee dat deze add-ons volledig optioneel zijn en mogelijk niet nodig. We wilden u in ieder geval aanvullende informatie bieden indien nodig.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Optionele Add-on:
  </strong>
  <span>
    Als u de functie <a class="alert-link" href="#how-to-send-mail-as-using-gmail">Hoe Mail Verzenden Als te gebruiken met Gmail</a> gebruikt, wilt u uzelf misschien aan een allowlist toevoegen. Zie <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">deze instructies van Gmail</a> over dit onderwerp.
  </span>
</div>

### Kan ik meerdere MX-exchanges en servers gebruiken voor geavanceerde doorsturing {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Ja, maar **u mag slechts één MX-exchange in uw DNS-records hebben staan**.

Probeer niet "Prioriteit" te gebruiken als manier om meerdere MX-exchanges te configureren.

In plaats daarvan moet u uw bestaande MX-exchange zo configureren dat deze mail doorstuurt voor alle niet-overeenkomende aliassen naar de exchanges van onze service (`mx1.forwardemail.net` en/of `mx2.forwardemail.net`).

Als u Google Workspace gebruikt en u wilt alle niet-overeenkomende aliassen naar onze service doorsturen, zie dan <https://support.google.com/a/answer/6297084>.

Als u Microsoft 365 (Outlook) gebruikt en u wilt alle niet-overeenkomende aliassen naar onze service doorsturen, zie dan <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> en <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### Hoe stel ik een afwezigheidsassistent in (out of office auto-responder) {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

Ga naar <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Aliassen en maak een alias aan of bewerk de alias waarvoor u een afwezigheidsassistent wilt instellen.
Je hebt de mogelijkheid om een startdatum, einddatum, onderwerp en bericht te configureren, en deze op elk moment in of uit te schakelen:

* Alleen platte tekst onderwerp en bericht worden momenteel ondersteund (we gebruiken intern het `striptags` pakket om eventuele HTML te verwijderen).
* Het onderwerp is beperkt tot 100 tekens.
* Het bericht is beperkt tot 1000 tekens.
* De setup vereist Outbound SMTP-configuratie (bijv. je moet DKIM, DMARC en Return-Path DNS-records instellen).
  * Ga naar <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Instellingen <i class="fa fa-angle-right"></i> Outbound SMTP-configuratie en volg de setup-instructies.
* De vakantie-responder kan niet worden ingeschakeld op globale vanity-domeinnamen (bijv. [wegwerpadressen](/disposable-addresses) worden niet ondersteund).
* De vakantie-responder kan niet worden ingeschakeld voor aliassen met wildcard/catch-all (`*`) noch reguliere expressies.

In tegenstelling tot mailsystemen zoals `postfix` (bijv. die de `sieve` vacation filter extensie gebruiken) – voegt Forward Email automatisch je DKIM-handtekening toe, voorkomt het problemen met verbindingen bij het verzenden van vakantie-antwoorden (bijv. door veelvoorkomende SSL/TLS verbindingsproblemen en legacy onderhouden servers), en ondersteunt het zelfs Open WKD en PGP-encryptie voor vakantie-antwoorden.

<!--
* Om misbruik te voorkomen, wordt er 1 outbound SMTP-credit afgetrokken voor elk verzonden vakantie-responder bericht.
  * Alle betaalde accounts bevatten standaard 300 credits per dag. Als je een groter aantal nodig hebt, neem dan contact met ons op.
-->

1. We sturen slechts één keer per [toegelaten](#do-you-have-an-allowlist) afzender elke 4 dagen (wat vergelijkbaar is met het gedrag van Gmail).

   * Onze Redis-cache gebruikt een vingerafdruk van `alias_id` en `sender`, waarbij `alias_id` de alias MongoDB ID is en `sender` ofwel het From-adres (als toegelaten) of het rootdomein in het From-adres (als niet toegelaten). Voor de eenvoud is de vervaltijd van deze vingerafdruk in de cache ingesteld op 4 dagen.

   * Onze aanpak om het rootdomein te gebruiken dat geparsed is uit het From-adres voor niet-toegelaten afzenders voorkomt misbruik door relatief onbekende afzenders (bijv. kwaadwillenden) die vakantie-responder berichten willen overspoelen.

2. We sturen alleen als de MAIL FROM en/of From niet leeg is en geen (hoofdletterongevoelige) [postmaster gebruikersnaam](#what-are-postmaster-addresses) bevat (het gedeelte vóór de @ in een e-mailadres).

3. We sturen niet als het originele bericht een van de volgende headers bevatte (hoofdletterongevoelig):

   * Header `auto-submitted` met een waarde ongelijk aan `no`.
   * Header `x-auto-response-suppress` met een waarde van `dr`, `autoreply`, `auto-reply`, `auto_reply`, of `all`.
   * Header `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond`, of `x-auto-respond` (ongeacht de waarde).
   * Header `precedence` met een waarde van `bulk`, `autoreply`, `auto-reply`, `auto_reply`, of `list`.

4. We sturen niet als het MAIL FROM of From e-mailadres eindigt op `+donotreply`, `-donotreply`, `+noreply`, of `-noreply`.

5. We sturen niet als het gebruikersnaamgedeelte van het From e-mailadres `mdaemon` was en het een hoofdletterongevoelige header `X-MDDSN-Message` had.

6. We sturen niet als er een hoofdletterongevoelige `content-type` header was van `multipart/report`.

### Hoe stel ik SPF in voor Forward Email {#how-do-i-set-up-spf-for-forward-email}

Gebruik de DNS-beheerpagina van je registrar en stel het volgende <strong class="notranslate">TXT</strong> record in:

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
    Als je Gmail gebruikt (bijv. Send Mail As) of G Suite, dan moet je <code>include:_spf.google.com</code> toevoegen aan bovenstaande waarde, bijvoorbeeld:
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
    Als u al een vergelijkbare regel met "v=spf1" hebt, moet u <code>include:spf.forwardemail.net</code> toevoegen direct vóór bestaande "include:host.com" records en vóór de "-all" in dezelfde regel, bijvoorbeeld:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Let op dat er een verschil is tussen "-all" en "~all". De "-" geeft aan dat de SPF-controle MOET FAILEN als het niet overeenkomt, en "~" geeft aan dat de SPF-controle SOFTFAIL moet zijn. Wij raden aan de "-all" methode te gebruiken om domeinvervalsing te voorkomen.
    <br /><br />
    Mogelijk moet u ook het SPF-record opnemen voor de host waarvan u e-mail verzendt (bijv. Outlook).
  </span>
</div>

### Hoe stel ik DKIM in voor Forward Email {#how-do-i-set-up-dkim-for-forward-email}

Ga naar <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Instellingen <i class="fa fa-angle-right"></i> Uitgaande SMTP-configuratie en volg de installatie-instructies.

### Hoe stel ik DMARC in voor Forward Email {#how-do-i-set-up-dmarc-for-forward-email}

Ga naar <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Instellingen <i class="fa fa-angle-right"></i> Uitgaande SMTP-configuratie en volg de installatie-instructies.

### Hoe bekijk ik DMARC-rapporten {#how-do-i-view-dmarc-reports}

Forward Email biedt een uitgebreid DMARC-rapportagedashboard waarmee u de prestaties van uw e-mailauthenticatie over al uw domeinen vanuit één interface kunt volgen.

**Wat zijn DMARC-rapporten?**

DMARC (Domain-based Message Authentication, Reporting, and Conformance) rapporten zijn XML-bestanden die door ontvangende mailservers worden verzonden en u vertellen hoe uw e-mails worden geverifieerd. Deze rapporten helpen u te begrijpen:

* Hoeveel e-mails er vanaf uw domein worden verzonden
* Of die e-mails SPF- en DKIM-authenticatie doorstaan
* Welke acties ontvangende servers ondernemen (accepteren, in quarantaine plaatsen of weigeren)
* Welke IP-adressen namens uw domein e-mail verzenden

**Hoe krijg ik toegang tot DMARC-rapporten**

Ga naar <a href="/my-account/dmarc-reports" class="alert-link" target="_blank" rel="noopener noreferrer">Mijn Account <i class="fa fa-angle-right"></i> DMARC-rapporten</a> om uw dashboard te bekijken. U kunt ook domeinspecifieke rapporten openen via <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> door op de knop "DMARC" naast een domein te klikken.

**Dashboardfuncties**

Het DMARC-rapportagedashboard biedt:

* **Samenvattende statistieken**: Totaal ontvangen rapporten, totaal geanalyseerde berichten, SPF-uitlijningspercentage, DKIM-uitlijningspercentage en algemene slaagpercentage
* **Berichten in de tijd-grafiek**: Visuele trend van e-mailvolume en authenticatiepercentages over de afgelopen 30 dagen
* **Uitlijningssamenvatting**: Donutgrafiek die de verdeling van SPF- versus DKIM-uitlijning toont
* **Berichtdispositie**: Gestapelde staafgrafiek die laat zien hoe ontvangende servers uw e-mails hebben behandeld (geaccepteerd, in quarantaine geplaatst of geweigerd)
* **Recente rapportentabel**: Gedetailleerde lijst van individuele DMARC-rapporten met filter- en paginatiemogelijkheden
* **Domeinfiltering**: Filter rapporten op specifiek domein bij het beheren van meerdere domeinen
**Waarom Dit Belangrijk Is**

Voor organisaties die meerdere domeinen beheren (zoals ondernemingen, non-profitorganisaties of bureaus), zijn DMARC-rapporten essentieel voor:

* **Het identificeren van ongeautoriseerde afzenders**: Detecteer of iemand je domein spoofet
* **Het verbeteren van de afleverbaarheid**: Zorg ervoor dat je legitieme e-mails authenticatie doorstaan
* **Het monitoren van e-mailinfrastructuur**: Volg welke diensten en IP's namens jou verzenden
* **Naleving**: Behoud zichtbaarheid in e-mailauthenticatie voor beveiligingsaudits

In tegenstelling tot andere diensten die aparte DMARC-monitoringtools vereisen, bevat Forward Email DMARC-rapportverwerking en visualisatie als onderdeel van je account zonder extra kosten.

**Vereisten**

* DMARC-rapporten zijn alleen beschikbaar voor betaalde abonnementen
* Je domein moet DMARC geconfigureerd hebben (zie [Hoe stel ik DMARC in voor Forward Email](#how-do-i-set-up-dmarc-for-forward-email))
* Rapporten worden automatisch verzameld wanneer ontvangende mailservers ze naar je geconfigureerde DMARC-rapportageadres sturen

**Wekelijkse E-mailrapporten**

Gebruikers met een betaald abonnement ontvangen automatisch wekelijkse samenvattingen van DMARC-rapporten via e-mail. Deze e-mails bevatten:

* Samenvattende statistieken voor al je domeinen
* SPF- en DKIM-uitlijningspercentages
* Overzicht van berichtafhandeling (geaccepteerd, in quarantaine, geweigerd)
* Top rapporterende organisaties (Google, Microsoft, Yahoo, enz.)
* IP-adressen met uitlijningsproblemen die mogelijk aandacht vereisen
* Directe links naar je DMARC-rapportagedashboard

Wekelijkse rapporten worden automatisch verzonden en kunnen niet afzonderlijk worden uitgeschakeld van andere e-mailmeldingen.

### Hoe verbind en configureer ik mijn contacten {#how-do-i-connect-and-configure-my-contacts}

**Om je contacten te configureren, gebruik de CardDAV-URL van:** `https://carddav.forwardemail.net` (of gewoon `carddav.forwardemail.net` als je client dit toestaat)

### Hoe verbind en configureer ik mijn agenda's {#how-do-i-connect-and-configure-my-calendars}

**Om je agenda te configureren, gebruik de CalDAV-URL van:** `https://caldav.forwardemail.net` (of gewoon `caldav.forwardemail.net` als je client dit toestaat)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Forward Email Calendar CalDAV Thunderbird Example Setup" />

### Hoe voeg ik meer agenda's toe en beheer ik bestaande agenda's {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Als je extra agenda's wilt toevoegen, voeg dan gewoon een nieuwe agenda-URL toe van: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**vergeet niet `calendar-name` te vervangen door de gewenste agendanaam**)

Je kunt de naam en kleur van een agenda na aanmaak wijzigen – gebruik gewoon je favoriete agenda-applicatie (bijv. Apple Mail of [Thunderbird](https://thunderbird.net)).

### Hoe verbind en configureer ik taken en herinneringen {#how-do-i-connect-and-configure-tasks-and-reminders}

**Om taken en herinneringen te configureren, gebruik je dezelfde CalDAV-URL als voor agenda's:** `https://caldav.forwardemail.net` (of gewoon `caldav.forwardemail.net` als je client dit toestaat)

Taken en herinneringen worden automatisch gescheiden van agendagebeurtenissen in hun eigen "Herinneringen" of "Taken" agenda-collectie.

**Installatie-instructies per platform:**

**macOS/iOS:**

1. Voeg een nieuw CalDAV-account toe in Systeemvoorkeuren > Internetaccounts (of Instellingen > Accounts op iOS)
2. Gebruik `caldav.forwardemail.net` als server
3. Voer je Forward Email-alias en gegenereerd wachtwoord in
4. Na installatie zie je zowel "Agenda" als "Herinneringen" collecties
5. Gebruik de Herinneringen-app om taken te maken en beheren

**Android met Tasks.org:**

1. Installeer Tasks.org vanuit Google Play Store of F-Droid
2. Ga naar Instellingen > Synchronisatie > Account toevoegen > CalDAV
3. Voer server in: `https://caldav.forwardemail.net`
4. Voer je Forward Email-alias en gegenereerd wachtwoord in
5. Tasks.org ontdekt automatisch je takenagenda's

**Thunderbird:**

1. Installeer de Lightning-add-on als deze nog niet geïnstalleerd is
2. Maak een nieuwe agenda aan met type "CalDAV"
3. Gebruik URL: `https://caldav.forwardemail.net`
4. Voer je Forward Email-inloggegevens in
5. Zowel evenementen als taken zijn beschikbaar in de agenda-interface

### Waarom kan ik geen taken aanmaken in macOS Herinneringen {#why-cant-i-create-tasks-in-macos-reminders}
Als je problemen hebt met het aanmaken van taken in macOS Herinneringen, probeer dan deze stappen voor probleemoplossing:

1. **Controleer accountinstellingen**: Zorg ervoor dat je CalDAV-account correct is geconfigureerd met `caldav.forwardemail.net`

2. **Controleer aparte agenda's**: Je zou zowel "Agenda" als "Herinneringen" in je account moeten zien. Als je alleen "Agenda" ziet, is de taakondersteuning mogelijk nog niet volledig geactiveerd.

3. **Ververs account**: Probeer je CalDAV-account te verwijderen en opnieuw toe te voegen in Systeemvoorkeuren > Internetaccounts

4. **Controleer serververbinding**: Test of je toegang hebt tot `https://caldav.forwardemail.net` in je browser

5. **Controleer inloggegevens**: Zorg dat je het juiste alias-e-mailadres en het gegenereerde wachtwoord gebruikt (niet je accountwachtwoord)

6. **Forceer synchronisatie**: Probeer in de Herinneringen-app een taak aan te maken en vervolgens handmatig de synchronisatie te verversen

**Veelvoorkomende problemen:**

* **"Herinneringen-agenda niet gevonden"**: De server heeft mogelijk even tijd nodig om de Herinneringen-collectie aan te maken bij de eerste toegang
* **Taken synchroniseren niet**: Controleer of beide apparaten dezelfde CalDAV-accountgegevens gebruiken
* **Gemengde inhoud**: Zorg dat taken worden aangemaakt in de "Herinneringen" agenda, niet in de algemene "Agenda"

### Hoe stel ik Tasks.org in op Android {#how-do-i-set-up-tasksorg-on-android}

Tasks.org is een populaire open-source takenbeheerder die uitstekend werkt met Forward Email's CalDAV-taakondersteuning.

**Installatie en configuratie:**

1. **Installeer Tasks.org**:
   * Vanuit Google Play Store: [Tasks.org](https://play.google.com/store/apps/details?id=org.tasks)
   * Vanuit F-Droid: [Tasks.org op F-Droid](https://f-droid.org/packages/org.tasks/)

2. **Configureer CalDAV-synchronisatie**:
   * Open Tasks.org
   * Ga naar ☰ Menu > Instellingen > Synchronisatie
   * Tik op "Account toevoegen"
   * Selecteer "CalDAV"

3. **Voer Forward Email-instellingen in**:
   * **Server-URL**: `https://caldav.forwardemail.net`
   * **Gebruikersnaam**: Je Forward Email alias (bijv. `jij@jouwdomein.com`)
   * **Wachtwoord**: Je alias-specifiek gegenereerde wachtwoord
   * Tik op "Account toevoegen"

4. **Accountdetectie**:
   * Tasks.org zal automatisch je taakagenda's ontdekken
   * Je zou je "Herinneringen" collectie moeten zien verschijnen
   * Tik op "Abonneren" om synchronisatie voor de taakagenda in te schakelen

5. **Test synchronisatie**:
   * Maak een testtaak aan in Tasks.org
   * Controleer of deze verschijnt in andere CalDAV-clients (zoals macOS Herinneringen)
   * Verifieer dat wijzigingen in beide richtingen synchroniseren

**Beschikbare functies:**

* ✅ Taak aanmaken en bewerken
* ✅ Vervaldatums en herinneringen
* ✅ Taakvoltooiing en status
* ✅ Prioriteitsniveaus
* ✅ Subtaken en taakhiërarchie
* ✅ Labels en categorieën
* ✅ Tweezijdige synchronisatie met andere CalDAV-clients

**Probleemoplossing:**

* Als er geen taakagenda's verschijnen, probeer dan handmatig te verversen in de instellingen van Tasks.org
* Zorg dat je minstens één taak op de server hebt aangemaakt (je kunt er eerst één aanmaken in macOS Herinneringen)
* Controleer netwerkverbinding met `caldav.forwardemail.net`

### Hoe stel ik SRS in voor Forward Email {#how-do-i-set-up-srs-for-forward-email}

We configureren automatisch [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") – je hoeft dit zelf niet te doen.

### Hoe stel ik MTA-STS in voor Forward Email {#how-do-i-set-up-mta-sts-for-forward-email}

Zie [onze sectie over MTA-STS](#do-you-support-mta-sts) voor meer informatie.

### Hoe voeg ik een profielfoto toe aan mijn e-mailadres {#how-do-i-add-a-profile-picture-to-my-email-address}

Als je Gmail gebruikt, volg dan onderstaande stappen:

1. Ga naar <https://google.com> en log uit bij alle e-mailaccounts
2. Klik op "Inloggen" en klik in het dropdownmenu op "ander account"
3. Selecteer "Gebruik een ander account"
4. Selecteer "Account aanmaken"
5. Selecteer "Gebruik in plaats daarvan mijn huidige e-mailadres"
6. Voer je e-mailadres van je eigen domein in
7. Haal de verificatiemail op die naar je e-mailadres is gestuurd
8. Voer de verificatiecode uit deze mail in
9. Vul de profielinformatie in voor je nieuwe Google-account
10. Ga akkoord met alle privacy- en gebruiksvoorwaarden
11. Ga naar <https://google.com> en klik rechtsboven op je profielfoto, klik op de knop "wijzigen"
12. Upload een nieuwe foto of avatar voor je account
13. Wijzigingen worden binnen ongeveer 1-2 uur doorgevoerd, maar soms kan het ook sneller zijn.
14. Stuur een testmail en de profielfoto zou moeten verschijnen.
## Geavanceerde Functies {#advanced-features}

### Ondersteunt u nieuwsbrieven of mailinglijsten voor marketing gerelateerde e-mail {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Ja, u kunt meer lezen op <https://forwardemail.net/guides/newsletter-with-listmonk>.

Houd er rekening mee dat om de IP-reputatie te behouden en de afleverbaarheid te waarborgen, Forward Email een handmatig beoordelingsproces per domein heeft voor **goedkeuring van nieuwsbrieven**. Stuur een e-mail naar <support@forwardemail.net> of open een [hulpverzoek](https://forwardemail.net/help) voor goedkeuring. Dit duurt meestal minder dan 24 uur, waarbij de meeste verzoeken binnen 1-2 uur worden gehonoreerd. In de nabije toekomst streven we ernaar dit proces direct te maken met extra spamcontroles en waarschuwingen. Dit proces zorgt ervoor dat uw e-mails de inbox bereiken en uw berichten niet als spam worden gemarkeerd.

### Ondersteunt u het verzenden van e-mail via API {#do-you-support-sending-email-with-api}

Ja, sinds mei 2023 ondersteunen we het verzenden van e-mail via API als een add-on voor alle betaalde gebruikers.

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Belangrijk:
  </strong>
  <span>
    Zorg ervoor dat u onze <a href="/terms" class="alert-link" target="_blank">Voorwaarden</a>, <a href="/privacy" class="alert-link" target="_blank">Privacybeleid</a> en <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Outbound SMTP-limieten</a> hebt gelezen – uw gebruik wordt beschouwd als erkenning en akkoord.
  </span>
</div>

Bekijk onze sectie over [E-mails](/email-api#outbound-emails) in onze API-documentatie voor opties, voorbeelden en meer inzicht.

Om uitgaande e-mail te verzenden met onze API, moet u uw API-token gebruiken dat beschikbaar is onder [Mijn Beveiliging](/my-account/security).

### Ondersteunt u het ontvangen van e-mail via IMAP {#do-you-support-receiving-email-with-imap}

Ja, sinds 16 oktober 2023 ondersteunen we het ontvangen van e-mail via IMAP als een add-on voor alle betaalde gebruikers.  **Lees alstublieft ons diepgaande artikel** over [hoe onze versleutelde SQLite mailbox opslagfunctie werkt](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="imap-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Belangrijk:
  </strong>
  <span>
    Zorg ervoor dat u onze <a href="/terms" class="alert-link" target="_blank">Voorwaarden</a> en <a href="/privacy" class="alert-link" target="_blank">Privacybeleid</a> hebt gelezen – uw gebruik wordt beschouwd als erkenning en akkoord.
  </span>
</div>

1. Maak een nieuw alias aan voor uw domein onder <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Aliassen (bijv. <code><hello@example.com></code>)

2. Klik op <strong class="text-success"><i class="fa fa-key"></i> Wachtwoord genereren</strong> naast het nieuw aangemaakte alias.  Kopieer naar uw klembord en bewaar het gegenereerde wachtwoord veilig dat op het scherm wordt weergegeven.

3. Gebruik uw favoriete e-mailapplicatie om een account toe te voegen of te configureren met uw nieuw aangemaakte alias (bijv. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>We raden aan <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> of <a href="/blog/open-source" class="alert-link" target="_blank">een open-source en privacygerichte alternatief</a> te gebruiken.</span>
   </div>

4. Wanneer u wordt gevraagd om de IMAP-servernaam, voer in `imap.forwardemail.net`

5. Wanneer u wordt gevraagd om de IMAP-serverpoort, voer in `993` (SSL/TLS) – zie [alternatieve IMAP-poorten](/faq#what-are-your-imap-server-configuration-settings) indien nodig
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>Als u Thunderbird gebruikt, zorg er dan voor dat "Verbindingsbeveiliging" is ingesteld op "SSL/TLS" en de authenticatiemethode is ingesteld op "Normaal wachtwoord".</span>
   </div>
6. Wanneer om het IMAP-serverwachtwoord wordt gevraagd, plak dan het wachtwoord van <strong class="text-success"><i class="fa fa-key"></i> Wachtwoord genereren</strong> in stap 2 hierboven

7. **Sla uw instellingen op** – als u problemen ondervindt, neem dan <a href="/help">contact met ons op</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gefeliciteerd!
    </strong>
    <span>
      U heeft alle stappen succesvol voltooid.
    </span>
  </div>
</div>

</div>

### Ondersteunt u POP3 {#do-you-support-pop3}

Ja, vanaf 4 december 2023 ondersteunen we [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) als een add-on voor alle betalende gebruikers.  **Lees alstublieft ons diepgaande artikel** over [hoe onze versleutelde SQLite mailboxopslagfunctie werkt](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="pop3-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Belangrijk:
  </strong>
  <span>
    Zorg ervoor dat u onze <a href="/terms" class="alert-link" target="_blank">Voorwaarden</a> en <a href="/privacy" class="alert-link" target="_blank">Privacybeleid</a> hebt gelezen – uw gebruik wordt beschouwd als erkenning en instemming.
  </span>
</div>

1. Maak een nieuw alias aan voor uw domein onder <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Aliassen (bijv. <code><hello@example.com></code>)

2. Klik op <strong class="text-success"><i class="fa fa-key"></i> Wachtwoord genereren</strong> naast het nieuw aangemaakte alias.  Kopieer naar uw klembord en bewaar het gegenereerde wachtwoord veilig dat op het scherm wordt weergegeven.

3. Voeg met uw favoriete e-mailapplicatie een account toe of configureer een account met uw nieuw aangemaakte alias (bijv. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>We raden aan om <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, of <a href="/blog/open-source" class="alert-link" target="_blank">een open-source en privacygerichte alternatief</a> te gebruiken.</span>
   </div>

4. Wanneer om de POP3-servernaam wordt gevraagd, voer in `pop3.forwardemail.net`

5. Wanneer om de POP3-serverpoort wordt gevraagd, voer in `995` (SSL/TLS) – zie [alternatieve POP3-poorten](/faq#what-are-your-pop3-server-configuration-settings) indien nodig
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>Als u Thunderbird gebruikt, zorg er dan voor dat "Verbindingsbeveiliging" is ingesteld op "SSL/TLS" en de authenticatiemethode is ingesteld op "Normaal wachtwoord".</span>
   </div>

6. Wanneer om het POP3-serverwachtwoord wordt gevraagd, plak dan het wachtwoord van <strong class="text-success"><i class="fa fa-key"></i> Wachtwoord genereren</strong> in stap 2 hierboven

7. **Sla uw instellingen op** – als u problemen ondervindt, neem dan <a href="/help">contact met ons op</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gefeliciteerd!
    </strong>
    <span>
      U heeft alle stappen succesvol voltooid.
    </span>
  </div>
</div>

</div>

### Ondersteunt u agenda's (CalDAV) {#do-you-support-calendars-caldav}

Ja, vanaf 5 februari 2024 hebben we deze functie toegevoegd. Onze server is `caldav.forwardemail.net` en wordt ook gemonitord op onze <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statuspagina</a>.
Het ondersteunt zowel IPv4 als IPv6 en is beschikbaar via poort `443` (HTTPS).

| Inloggen | Voorbeeld                  | Beschrijving                                                                                                                                                                              |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gebruikersnaam | `user@example.com`         | E-mailadres van een alias die bestaat voor het domein bij <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a>. |
| Wachtwoord | `************************` | Alias-specifiek gegenereerd wachtwoord.                                                                                                                                                   |

Om kalenderondersteuning te gebruiken, moet de **gebruiker** het e-mailadres zijn van een alias die bestaat voor het domein bij <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> – en het **wachtwoord** moet een alias-specifiek gegenereerd wachtwoord zijn.

### Ondersteunt u taken en herinneringen (CalDAV VTODO) {#do-you-support-tasks-and-reminders-caldav-vtodo}

Ja, sinds 14 oktober 2025 hebben we CalDAV VTODO-ondersteuning toegevoegd voor taken en herinneringen. Dit gebruikt dezelfde server als onze kalenderondersteuning: `caldav.forwardemail.net`.

Onze CalDAV-server ondersteunt zowel kalenderevenementen (VEVENT) als taken (VTODO) componenten met behulp van **geünificeerde kalenders**. Dit betekent dat elke kalender zowel evenementen als taken kan bevatten, wat maximale flexibiliteit en compatibiliteit biedt met alle CalDAV-clients.

**Hoe kalenders en lijsten werken:**

* **Elke kalender ondersteunt zowel evenementen als taken** - Je kunt evenementen, taken of beide toevoegen aan elke kalender
* **Apple Herinneringen-lijsten** - Elke lijst die je maakt in Apple Herinneringen wordt een aparte kalender op de server
* **Meerdere kalenders** - Je kunt zoveel kalenders maken als je nodig hebt, elk met een eigen naam, kleur en organisatie
* **Synchronisatie tussen clients** - Taken en evenementen synchroniseren naadloos tussen alle compatibele clients

**Ondersteunde taakclients:**

* **macOS Herinneringen** - Volledige native ondersteuning voor het aanmaken, bewerken, voltooien en synchroniseren van taken
* **iOS Herinneringen** - Volledige native ondersteuning op alle iOS-apparaten
* **Tasks.org (Android)** - Populaire open-source takenbeheerder met CalDAV-synchronisatie
* **Thunderbird** - Taak- en kalenderondersteuning in desktop e-mailclient
* **Elke CalDAV-compatibele takenbeheerder** - Standaard VTODO-componentondersteuning

**Ondersteunde taakfuncties:**

* Aanmaken, bewerken en verwijderen van taken
* Vervaldatums en startdatums
* Taakvoltooiingsstatus (NEEDS-ACTION, IN-PROCESS, COMPLETED, CANCELLED)
* Taakprioriteitsniveaus
* Terugkerende taken
* Taakomschrijvingen en notities
* Synchronisatie op meerdere apparaten
* Subtaken met RELATED-TO-eigenschap
* Taakherinneringen met VALARM

De inloggegevens zijn hetzelfde als voor kalenderondersteuning:

| Inloggen | Voorbeeld                  | Beschrijving                                                                                                                                                                              |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gebruikersnaam | `user@example.com`         | E-mailadres van een alias die bestaat voor het domein bij <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a>. |
| Wachtwoord | `************************` | Alias-specifiek gegenereerd wachtwoord.                                                                                                                                                   |

**Belangrijke opmerkingen:**

* **Elke Herinneringen-lijst is een aparte kalender** - Wanneer je een nieuwe lijst maakt in Apple Herinneringen, wordt er een nieuwe kalender aangemaakt op de CalDAV-server
* **Thunderbird-gebruikers** - Je moet handmatig abonneren op elke kalender/lijst die je wilt synchroniseren, of gebruik maken van de kalender home URL: `https://caldav.forwardemail.net/dav/your-email@domain.com/`
* **Apple-gebruikers** - Kalenderontdekking gebeurt automatisch, dus al je kalenders en lijsten verschijnen in Calendar.app en Reminders.app
* **Geünificeerde kalenders** - Alle kalenders ondersteunen zowel evenementen als taken, wat je flexibiliteit geeft in hoe je je gegevens organiseert
### Ondersteunt u contacten (CardDAV) {#do-you-support-contacts-carddav}

Ja, vanaf 12 juni 2025 hebben we deze functie toegevoegd. Onze server is `carddav.forwardemail.net` en wordt ook gemonitord op onze <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statuspagina</a>.

Het ondersteunt zowel IPv4 als IPv6 en is beschikbaar via poort `443` (HTTPS).

| Inloggen | Voorbeeld                  | Beschrijving                                                                                                                                                                              |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gebruikersnaam | `user@example.com`         | E-mailadres van een alias die bestaat voor het domein bij <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a>. |
| Wachtwoord | `************************` | Alias-specifiek gegenereerd wachtwoord.                                                                                                                                                   |

Om contactondersteuning te gebruiken, moet de **gebruiker** het e-mailadres zijn van een alias die bestaat voor het domein bij <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> – en het **wachtwoord** moet een alias-specifiek gegenereerd wachtwoord zijn.

### Ondersteunt u het verzenden van e-mail met SMTP {#do-you-support-sending-email-with-smtp}

Ja, vanaf mei 2023 ondersteunen we het verzenden van e-mail met SMTP als een add-on voor alle betaalde gebruikers.

<div id="smtp-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Belangrijk:
  </strong>
  <span>
    Zorg ervoor dat u onze <a href="/terms" class="alert-link" target="_blank">Voorwaarden</a>, <a href="/privacy" class="alert-link" target="_blank">Privacybeleid</a> en <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Outbound SMTP-limieten</a> hebt gelezen – uw gebruik wordt beschouwd als erkenning en akkoord.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Belangrijk:
  </strong>
  <span>
    Als u Gmail gebruikt, raadpleeg dan onze <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">Handleiding Verzenden als met Gmail</a>. Als u een ontwikkelaar bent, raadpleeg dan onze <a class="alert-link" href="/email-api#outbound-emails" target="_blank">e-mail API-documentatie</a>.
  </span>
</div>

1. Ga naar <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Instellingen <i class="fa fa-angle-right"></i> Outbound SMTP-configuratie en volg de installatie-instructies

2. Maak een nieuwe alias aan voor uw domein onder <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Aliassen (bijv. <code><hello@example.com></code>)

3. Klik op <strong class="text-success"><i class="fa fa-key"></i> Wachtwoord genereren</strong> naast de nieuw aangemaakte alias. Kopieer naar uw klembord en bewaar het gegenereerde wachtwoord dat op het scherm wordt weergegeven veilig.

4. Gebruik uw favoriete e-mailapplicatie om een account toe te voegen of te configureren met uw nieuw aangemaakte alias (bijv. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>We raden aan om <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> of <a href="/blog/open-source" class="alert-link" target="_blank">een open-source en privacygerichte alternatief</a> te gebruiken.</span>
   </div>
5. Wanneer u wordt gevraagd om de naam van de SMTP-server, voer dan `smtp.forwardemail.net` in

6. Wanneer u wordt gevraagd om de poort van de SMTP-server, voer dan `465` (SSL/TLS) in – zie [alternatieve SMTP-poorten](/faq#what-are-your-smtp-server-configuration-settings) indien nodig
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>Als u Thunderbird gebruikt, zorg er dan voor dat "Verbindingsbeveiliging" is ingesteld op "SSL/TLS" en dat de authenticatiemethode is ingesteld op "Normaal wachtwoord".</span>
   </div>

7. Wanneer u wordt gevraagd om het wachtwoord van de SMTP-server, plak dan het wachtwoord van <strong class="text-success"><i class="fa fa-key"></i> Wachtwoord genereren</strong> in stap 3 hierboven

8. **Sla uw instellingen op en stuur uw eerste testmail** – als u problemen ondervindt, neem dan contact met ons op via <a href="/help">contact</a>

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Belangrijk:
  </strong>
  <span>
    Houd er rekening mee dat we om de IP-reputatie te behouden en de afleverbaarheid te waarborgen, een handmatig beoordelingsproces per domein hebben voor goedkeuring van uitgaande SMTP. Dit duurt meestal minder dan 24 uur, waarbij de meeste verzoeken binnen 1-2 uur worden gehonoreerd. In de nabije toekomst streven we ernaar dit proces direct te maken met extra spamcontroles en waarschuwingen. Dit proces zorgt ervoor dat uw e-mails de inbox bereiken en uw berichten niet als spam worden gemarkeerd.
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gefeliciteerd!
    </strong>
    <span>
      U heeft alle stappen succesvol voltooid.
    </span>
  </div>
</div>

</div>

### Ondersteunt u OpenPGP/MIME, end-to-end encryptie ("E2EE") en Web Key Directory ("WKD") {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Ja, wij ondersteunen [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [end-to-end encryptie ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption), en het vinden van publieke sleutels via [Web Key Directory ("WKD")](https://wiki.gnupg.org/WKD). U kunt OpenPGP configureren met [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) of [host uw eigen sleutels](https://wiki.gnupg.org/WKDHosting) (raadpleeg [deze gist voor WKD-serverconfiguratie](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* WKD-zoekopdrachten worden 1 uur gecachet om tijdige e-mailbezorging te garanderen → als u uw WKD-sleutel toevoegt, wijzigt of verwijdert, stuur dan een e-mail naar `support@forwardemail.net` met uw e-mailadres zodat wij de cache handmatig kunnen legen.
* Wij ondersteunen PGP-encryptie voor berichten die worden doorgestuurd via WKD-zoekopdracht of met een geüploade PGP-sleutel via onze interface.
* Geüploade sleutels hebben voorrang zolang het PGP-vakje is ingeschakeld/aangevinkt.
* Berichten die naar webhooks worden gestuurd, zijn momenteel niet versleuteld met PGP.
* Als u meerdere aliassen heeft die overeenkomen met een bepaald doorstuuradres (bijv. regex/wildcard/exacte combinatie) en als meer dan één hiervan een geüploade PGP-sleutel bevat en PGP is aangevinkt → dan sturen wij u een foutmelding per e-mail en versleutelen wij het bericht niet met uw geüploade PGP-sleutel. Dit is zeer zeldzaam en geldt meestal alleen voor gevorderde gebruikers met complexe aliasregels.
* **PGP-encryptie wordt niet toegepast op e-maildoorsturing via onze MX-servers als de afzender een DMARC-beleid van reject had. Als u PGP-encryptie op *alle* mail wilt, raden wij aan onze IMAP-service te gebruiken en uw PGP-sleutel voor uw alias te configureren voor inkomende mail.**

**U kunt uw Web Key Directory-configuratie valideren op <https://wkd.chimbosonic.com/> (open-source) of <https://www.webkeydirectory.com/> (proprietair).**

<div class="alert my-3 alert-success">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Automatische encryptie:
  </strong>
  <span>Als u onze <a href="#do-you-support-sending-email-with-smtp" class="alert-link">uitgaande SMTP-service</a> gebruikt en onversleutelde berichten verstuurt, zullen wij automatisch proberen berichten per ontvanger te versleutelen met behulp van <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Key Directory ("WKD")</a>.</span>
</div>
<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Belangrijk:
  </strong>
  <span>
    U moet alle onderstaande stappen volgen om OpenPGP in te schakelen voor uw aangepaste domeinnaam.
  </span>
</div>

1. Download en installeer de aanbevolen plugin voor uw e-mailclient hieronder:

   | E-mailclient   | Platform | Aanbevolen plugin                                                                                                                                                                    | Opmerkingen                                                                                                                                                                                                                                                                                                                                                                                                                              |
   | -------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Thunderbird    | Desktop  | [OpenPGP configureren in Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird heeft ingebouwde ondersteuning voor OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                |
   | Gmail          | Browser  | [Mailvelope](https://mailvelope.com/) of [FlowCrypt](https://flowcrypt.com/download) (proprietaire licentie)                                                                        | Gmail ondersteunt OpenPGP niet, maar u kunt de open-source plugin [Mailvelope](https://mailvelope.com/) of [FlowCrypt](https://flowcrypt.com/download) downloaden.                                                                                                                                                                                                                                                                       |
   | Apple Mail     | macOS    | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation)                                                                                        | Apple Mail ondersteunt OpenPGP niet, maar u kunt de open-source plugin [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) downloaden.                                                                                                                                                                                                                                                           |
   | Apple Mail     | iOS      | [PGPro](https://github.com/opensourceios/PGPro/) of [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (proprietaire licentie)                       | Apple Mail ondersteunt OpenPGP niet, maar u kunt de open-source plugin [PGPro](https://github.com/opensourceios/PGPro/) of [FlowCrypt](https://flowcrypt.com/download) downloaden.                                                                                                                                                                                                                                                      |
   | Outlook        | Windows  | [gpg4win](https://www.gpg4win.de/index.html)                                                                                                                                        | De desktop mailclient van Outlook ondersteunt OpenPGP niet, maar u kunt de open-source plugin [gpg4win](https://www.gpg4win.de/index.html) downloaden.                                                                                                                                                                                                                                                                                  |
   | Outlook        | Browser  | [Mailvelope](https://mailvelope.com/) of [FlowCrypt](https://flowcrypt.com/download) (proprietaire licentie)                                                                        | De webmailclient van Outlook ondersteunt OpenPGP niet, maar u kunt de open-source plugin [Mailvelope](https://mailvelope.com/) of [FlowCrypt](https://flowcrypt.com/download) downloaden.                                                                                                                                                                                                                                                |
   | Android        | Mobiel   | [OpenKeychain](https://www.openkeychain.org/) of [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email)                                                   | [Android mailclients](/blog/open-source/android-email-clients) zoals [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) en [FairEmail](https://github.com/M66B/FairEmail) ondersteunen beide de open-source plugin [OpenKeychain](https://www.openkeychain.org/). U kunt ook de open-source (proprietaire licentie) plugin [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) gebruiken.                      |
   | Google Chrome  | Browser  | [Mailvelope](https://mailvelope.com/) of [FlowCrypt](https://flowcrypt.com/download) (proprietaire licentie)                                                                        | U kunt de open-source browserextensie [Mailvelope](https://mailvelope.com/) of [FlowCrypt](https://flowcrypt.com/download) downloaden.                                                                                                                                                                                                                                                                                                   |
   | Mozilla Firefox| Browser  | [Mailvelope](https://mailvelope.com/) of [FlowCrypt](https://flowcrypt.com/download) (proprietaire licentie)                                                                        | U kunt de open-source browserextensie [Mailvelope](https://mailvelope.com/) of [FlowCrypt](https://flowcrypt.com/download) downloaden.                                                                                                                                                                                                                                                                                                   |
   | Microsoft Edge | Browser  | [Mailvelope](https://mailvelope.com/)                                                                                                                                               | U kunt de open-source browserextensie [Mailvelope](https://mailvelope.com/) downloaden.                                                                                                                                                                                                                                                                                                                                                  |
   | Brave          | Browser  | [Mailvelope](https://mailvelope.com/) of [FlowCrypt](https://flowcrypt.com/download) (proprietaire licentie)                                                                        | U kunt de open-source browserextensie [Mailvelope](https://mailvelope.com/) of [FlowCrypt](https://flowcrypt.com/download) downloaden.                                                                                                                                                                                                                                                                                                   |
   | Balsa          | Desktop  | [OpenPGP configureren in Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING)                                                                        | Balsa heeft ingebouwde ondersteuning voor OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                      |
   | KMail          | Desktop  | [OpenPGP configureren in KMail](https://userbase.kde.org/KMail/PGP_MIME)                                                                                                           | KMail heeft ingebouwde ondersteuning voor OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                      |
   | GNOME Evolution| Desktop  | [OpenPGP configureren in Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en)                                                                         | GNOME Evolution heeft ingebouwde ondersteuning voor OpenPGP.                                                                                                                                                                                                                                                                                                                                                                            |
   | Terminal       | Desktop  | [gpg configureren in Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key)                     | U kunt de open-source [gpg command line tool](https://www.gnupg.org/download/) gebruiken om een nieuwe sleutel via de opdrachtregel te genereren.                                                                                                                                                                                                                                                                                        |
2. Open de plugin, maak je publieke sleutel aan en configureer je e-mailclient om deze te gebruiken.

3. Upload je publieke sleutel op <https://keys.openpgp.org/upload>.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>Je kunt <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a> bezoeken om je sleutel in de toekomst te beheren.</span>
   </div>

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Optionele toevoeging:
     </strong>
     <span>
       Als je onze <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">versleutelde opslag (IMAP/POP3)</a> service gebruikt en wilt dat <i>alle</i> e-mail die in je (al versleutelde) SQLite-database wordt opgeslagen, wordt versleuteld met je publieke sleutel, ga dan naar <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Aliassen (bijv. <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Bewerken <i class="fa fa-angle-right"></i> OpenPGP en upload je publieke sleutel.
     </span>
   </div>

4. Voeg een nieuw `CNAME` record toe aan je domeinnaam (bijv. `example.com`):

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
     <span>Als je alias gebruikmaakt van onze <a class="alert-link" href="/disposable-addresses" target="_blank">vanity/disposable domeinen</a> (bijv. <code>hideaddress.net</code>), dan kun je deze stap overslaan.</span>
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

### Ondersteunen jullie S/MIME-encryptie {#do-you-support-smime-encryption}

Ja, wij ondersteunen [S/MIME (Secure/Multipurpose Internet Mail Extensions)](https://en.wikipedia.org/wiki/S/MIME) encryptie zoals gedefinieerd in [RFC 8551](https://datatracker.ietf.org/doc/html/rfc8551). S/MIME biedt end-to-end encryptie met behulp van X.509-certificaten, die breed worden ondersteund door zakelijke e-mailclients.

We ondersteunen zowel RSA- als ECC (Elliptic Curve Cryptography) certificaten:

* **RSA-certificaten**: minimaal 2048-bit, aanbevolen 4096-bit
* **ECC-certificaten**: P-256, P-384 en P-521 NIST-curves

Om S/MIME-encryptie voor je alias te configureren:

1. Verkrijg een S/MIME-certificaat van een vertrouwde Certificate Authority (CA) of genereer een zelfondertekend certificaat voor testdoeleinden.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>Gratis S/MIME-certificaten zijn beschikbaar bij aanbieders zoals <a class="alert-link" href="https://www.actalis.com/s-mime-certificates.aspx">Actalis</a> of <a class="alert-link" href="https://extrassl.actalis.com/portal/uapub/freemail">Actalis Free S/MIME</a>.</span>
   </div>

2. Exporteer je certificaat in PEM-formaat (alleen het publieke certificaat, niet de private sleutel).

3. Ga naar <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Aliassen (bijv. <code><hello@example.com></code>) <i class="fa fa-angle-right"></i> Bewerken <i class="fa fa-angle-right"></i> S/MIME en upload je publieke certificaat.
4. Zodra geconfigureerd, worden alle binnenkomende e-mails naar uw alias versleuteld met uw S/MIME-certificaat voordat ze worden opgeslagen of doorgestuurd.

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Opmerking:
     </strong>
     <span>
       S/MIME-versleuteling wordt toegepast op binnenkomende berichten die nog niet versleuteld zijn. Als een bericht al versleuteld is met OpenPGP of S/MIME, wordt het niet opnieuw versleuteld.
     </span>
   </div>

   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Belangrijk:
     </strong>
     <span>
       S/MIME-versleuteling wordt niet toegepast op e-maildoorsturing via onze MX-servers als de afzender een DMARC-beleid van reject had. Als u S/MIME-versleuteling op <em>alle</em> mail nodig heeft, raden wij aan onze IMAP-service te gebruiken en uw S/MIME-certificaat te configureren voor uw alias voor inkomende mail.
     </span>
   </div>

De volgende e-mailclients hebben ingebouwde S/MIME-ondersteuning:

| E-mailclient      | Platform | Opmerkingen                                                                                                         |
| ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| Apple Mail        | macOS    | Ingebouwde S/MIME-ondersteuning. Ga naar Mail > Voorkeuren > Accounts > uw account > Vertrouwen om certificaten te configureren.      |
| Apple Mail        | iOS      | Ingebouwde S/MIME-ondersteuning. Ga naar Instellingen > Mail > Accounts > uw account > Geavanceerd > S/MIME om te configureren.          |
| Microsoft Outlook | Windows  | Ingebouwde S/MIME-ondersteuning. Ga naar Bestand > Opties > Vertrouwenscentrum > Instellingen Vertrouwenscentrum > E-mailbeveiliging om te configureren. |
| Microsoft Outlook | macOS    | Ingebouwde S/MIME-ondersteuning. Ga naar Extra > Accounts > Geavanceerd > Beveiliging om te configureren.                                 |
| Thunderbird       | Desktop  | Ingebouwde S/MIME-ondersteuning. Ga naar Accountinstellingen > End-To-End Encryptie > S/MIME om te configureren.                      |
| GNOME Evolution   | Desktop  | Ingebouwde S/MIME-ondersteuning. Ga naar Bewerken > Voorkeuren > Mailaccounts > uw account > Beveiliging om te configureren.           |
| KMail             | Desktop  | Ingebouwde S/MIME-ondersteuning. Ga naar Instellingen > Configureer KMail > Identiteiten > uw identiteit > Cryptografie om te configureren. |

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gefeliciteerd!
    </strong>
    <span>
      U heeft S/MIME-versleuteling succesvol geconfigureerd voor uw alias.
    </span>
  </div>
</div>

### Ondersteunt u Sieve e-mailfiltering {#do-you-support-sieve-email-filtering}

Ja! Wij ondersteunen [Sieve](https://en.wikipedia.org/wiki/Sieve_\(mail_filtering_language\)) e-mailfiltering zoals gedefinieerd in [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228). Sieve is een krachtige, gestandaardiseerde scripttaal voor server-side e-mailfiltering waarmee u binnenkomende berichten automatisch kunt organiseren, filteren en beantwoorden.

#### Ondersteunde Sieve-extensies {#supported-sieve-extensions}

Wij ondersteunen een uitgebreide set Sieve-extensies:

| Extensie                    | RFC                                                                                    | Beschrijving                                      |
| ---------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `fileinto`                   | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                              | Plaats berichten in specifieke mappen             |
| `reject` / `ereject`         | [RFC 5429](https://datatracker.ietf.org/doc/html/rfc5429)                              | Weiger berichten met een foutmelding              |
| `vacation`                   | [RFC 5230](https://datatracker.ietf.org/doc/html/rfc5230)                              | Automatische vakantie-/afwezigheidsantwoorden     |
| `vacation-seconds`           | [RFC 6131](https://datatracker.ietf.org/doc/html/rfc6131)                              | Fijnmazige vakantieantwoordintervallen            |
| `imap4flags`                 | [RFC 5232](https://datatracker.ietf.org/doc/html/rfc5232)                              | Stel IMAP-vlaggen in (\Seen, \Flagged, enz.)      |
| `envelope`                   | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                              | Test afzender/ontvanger van de envelop            |
| `body`                       | [RFC 5173](https://datatracker.ietf.org/doc/html/rfc5173)                              | Test inhoud van het bericht                        |
| `variables`                  | [RFC 5229](https://datatracker.ietf.org/doc/html/rfc5229)                              | Sla variabelen op en gebruik ze in scripts        |
| `relational`                 | [RFC 5231](https://datatracker.ietf.org/doc/html/rfc5231)                              | Relationele vergelijkingen (groter dan, kleiner dan) |
| `comparator-i;ascii-numeric` | [RFC 4790](https://datatracker.ietf.org/doc/html/rfc4790)                              | Numerieke vergelijkingen                           |
| `copy`                       | [RFC 3894](https://datatracker.ietf.org/doc/html/rfc3894)                              | Kopieer berichten tijdens het doorsturen          |
| `editheader`                 | [RFC 5293](https://datatracker.ietf.org/doc/html/rfc5293)                              | Voeg berichtkoppen toe of verwijder ze            |
| `date`                       | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                              | Test datum/tijd waarden                            |
| `index`                      | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                              | Toegang tot specifieke header-voorkomens          |
| `regex`                      | [draft-ietf-sieve-regex](https://datatracker.ietf.org/doc/html/draft-ietf-sieve-regex) | Reguliere expressie matching                       |
| `enotify`                    | [RFC 5435](https://datatracker.ietf.org/doc/html/rfc5435)                              | Verstuur notificaties (bijv. mailto:)              |
| `environment`                | [RFC 5183](https://datatracker.ietf.org/doc/html/rfc5183)                              | Toegang tot omgevingsinformatie                    |
| `mailbox`                    | [RFC 5490](https://datatracker.ietf.org/doc/html/rfc5490)                              | Test bestaan mailbox, maak mailboxen aan           |
| `special-use`                | [RFC 8579](https://datatracker.ietf.org/doc/html/rfc8579)                              | Plaats in speciale mailboxen (\Junk, \Trash)      |
| `duplicate`                  | [RFC 7352](https://datatracker.ietf.org/doc/html/rfc7352)                              | Detecteer dubbele berichten                        |
| `ihave`                      | [RFC 5463](https://datatracker.ietf.org/doc/html/rfc5463)                              | Test beschikbaarheid van extensies                 |
| `subaddress`                 | [RFC 5233](https://datatracker.ietf.org/doc/html/rfc5233)                              | Toegang tot user+detail adresdelen                 |
#### Extensies Niet Ondersteund {#extensions-not-supported}

De volgende extensies worden momenteel niet ondersteund:

| Extensie                                                       | Reden                                                              |
| --------------------------------------------------------------- | ------------------------------------------------------------------- |
| `include`                                                       | Beveiligingsrisico (scriptinjectie) en vereist globale scriptopslag |
| `mboxmetadata` / `servermetadata`                               | Vereist IMAP METADATA extensie-ondersteuning                        |
| `foreverypart` / `mime` / `extracttext` / `replace` / `enclose` | Complexe MIME-boom manipulatie nog niet geïmplementeerd             |

#### Voorbeeld Sieve Scripts {#example-sieve-scripts}

**Nieuwsbrieven in een map plaatsen:**

```sieve
require ["fileinto"];

if header :contains "List-Id" "newsletter" {
    fileinto "Newsletters";
}
```

**Automatisch antwoord bij afwezigheid:**

```sieve
require ["vacation"];

vacation :days 7 :subject "Out of Office"
    "Ik ben momenteel afwezig en zal reageren zodra ik terug ben.";
```

**Berichten van belangrijke afzenders markeren:**

```sieve
require ["imap4flags"];

if address :is "from" "boss@example.com" {
    setflag "\\Flagged";
}
```

**Spam afwijzen met specifieke onderwerpen:**

```sieve
require ["reject"];

if header :contains "subject" ["lottery", "winner", "urgent transfer"] {
    reject "Bericht afgewezen vanwege spaminhoud.";
}
```

#### Sieve Scripts Beheren {#managing-sieve-scripts}

Je kunt je Sieve scripts op verschillende manieren beheren:

1. **Webinterface**: Ga naar <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Aliassen <i class="fa fa-angle-right"></i> Sieve Scripts om scripts aan te maken en te beheren.

2. **ManageSieve Protocol**: Verbind met elke ManageSieve-compatibele client (zoals de Sieve add-on van Thunderbird of [sieve-connect](https://github.com/philpennock/sieve-connect)) met `imap.forwardemail.net`. Gebruik poort `2190` met STARTTLS (aanbevolen voor de meeste clients) of poort `4190` met impliciete TLS.

3. **API**: Gebruik onze [REST API](/api#sieve-scripts) om scripts programmatisch te beheren.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Opmerking:
  </strong>
  <span>
    Sieve filtering wordt toegepast op binnenkomende berichten voordat ze in je mailbox worden opgeslagen. Scripts worden uitgevoerd op volgorde van prioriteit, en de eerste passende actie bepaalt hoe het bericht wordt afgehandeld.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Beveiliging:
  </strong>
  <span>
    Om veiligheidsredenen zijn doorstuuracties beperkt tot 10 per script en 100 per dag. Afwezigheidsantwoorden zijn gelimiteerd om misbruik te voorkomen.
  </span>
</div>

### Ondersteunen jullie MTA-STS {#do-you-support-mta-sts}

Ja, sinds 2 maart 2023 ondersteunen we [MTA-STS](https://www.hardenize.com/blog/mta-sts). Je kunt [deze template](https://github.com/jpawlowski/mta-sts.template) gebruiken als je het op je domein wilt inschakelen.

Onze configuratie is openbaar te vinden op GitHub via <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### Ondersteunen jullie passkeys en WebAuthn {#do-you-support-passkeys-and-webauthn}

Ja! Sinds 13 december 2023 hebben we ondersteuning toegevoegd voor passkeys [vanwege grote vraag](https://github.com/orgs/forwardemail/discussions/182).

Passkeys stellen je in staat om veilig in te loggen zonder een wachtwoord en tweefactorauthenticatie.

Je kunt je identiteit valideren met aanraking, gezichtsherkenning, apparaatgebonden wachtwoord of pincode.

We laten je tot 30 passkeys tegelijk beheren, zodat je gemakkelijk met al je apparaten kunt inloggen.

Lees meer over passkeys via de volgende links:

* [Inloggen bij je apps en websites met passkeys](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [Gebruik passkeys om in te loggen bij apps en websites op iPhone](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Wikipedia-artikel over Passkeys](https://en.wikipedia.org/wiki/Passkey_\(credential\))
### Ondersteunt u de beste praktijken voor e-mail {#do-you-support-email-best-practices}

Ja. We hebben ingebouwde ondersteuning voor SPF, DKIM, DMARC, ARC en SRS in alle plannen. We hebben ook uitgebreid samengewerkt met de oorspronkelijke auteurs van deze specificaties en andere e-mailexperts om perfectie en een hoge afleverbaarheid te garanderen.

### Ondersteunt u bounce-webhooks {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
    Op zoek naar documentatie over e-mailwebhooks? Zie <a href="/faq#do-you-support-webhooks" class="alert-link">Ondersteunt u webhooks?</a> voor meer inzicht.
  <span>
  </span>
</div>

Ja, vanaf 14 augustus 2024 hebben we deze functie toegevoegd. U kunt nu naar Mijn Account → Domeinen → Instellingen → Bounce Webhook URL gaan en een `http://` of `https://` URL configureren waar we een `POST`-verzoek naartoe sturen telkens wanneer uitgaande SMTP-e-mails bounce.

Dit is nuttig voor u om uw uitgaande SMTP te beheren en te monitoren – en kan worden gebruikt om abonnees te onderhouden, afmeldingen te verwerken en te detecteren wanneer bounces optreden.

Bounce webhook payloads worden verzonden als een JSON met deze eigenschappen:

* `email_id` (String) - e-mail-ID die overeenkomt met een e-mail in Mijn Account → E-mails (uitgaande SMTP)
* `list_id` (String) - de waarde van de `List-ID` header (niet-hoofdlettergevoelig), indien aanwezig, uit de originele uitgaande e-mail
* `list_unsubscribe` (String) - de waarde van de `List-Unsubscribe` header (niet-hoofdlettergevoelig), indien aanwezig, uit de originele uitgaande e-mail
* `feedback_id` (String) - de waarde van de `Feedback-ID` header (niet-hoofdlettergevoelig), indien aanwezig, uit de originele uitgaande e-mail
* `recipient` (String) - het e-mailadres van de ontvanger dat is gebounced of een fout gaf
* `message` (String) - een gedetailleerd foutbericht voor de bounce
* `response` (String) - het SMTP-responsbericht
* `response_code` (Number) - de geparseerde SMTP-responscode
* `truth_source` (String) - als de responscode van een vertrouwde bron kwam, wordt deze waarde gevuld met de root-domeinnaam (bijv. `google.com` of `yahoo.com`)
* `bounce` (Object) - een object met de volgende eigenschappen die de bounce- en afwijzingsstatus beschrijven
  * `action` (String) - bounce-actie (bijv. `"reject"`)
  * `message` (String) - bounce-reden (bijv. `"Message Sender Blocked By Receiving Server"`)
  * `category` (String) - bounce-categorie (bijv. `"block"`)
  * `code` (Number) - bounce-statuscode (bijv. `554`)
  * `status` (String) - bounce-code uit het responsbericht (bijv. `5.7.1`)
  * `line` (Number) - geparseerd regelnummer, indien aanwezig, [vanuit de Zone-MTA bounce parse lijst](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt) (bijv. `526`)
* `headers` (Object) - sleutel-waarde paar van headers voor de uitgaande e-mail
* `bounced_at` (String) - [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) geformatteerde datum waarop de bounce-fout optrad

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

* Als de webhook payload een `list_id`, `list_unsubscribe` of `feedback_id` waarde bevat, dan moet u passende actie ondernemen om de `recipient` indien nodig van de lijst te verwijderen.
  * Als de waarde van `bounce.category` één van `"block"`, `"recipient"`, `"spam"` of `"virus"` was, dan moet u de gebruiker zeker van de lijst verwijderen.
* Als u webhook payloads moet verifiëren (om te verzekeren dat ze daadwerkelijk van onze server komen), dan kunt u [het IP-adres van de externe client hostnaam opzoeken met een reverse lookup](https://nodejs.org/api/dns.html#dnspromisesreverseip) – dit moet `smtp.forwardemail.net` zijn.
  * U kunt ook het IP controleren tegen [onze gepubliceerde IP-adressen](#what-are-your-servers-ip-addresses).
  * Ga naar Mijn Account → Domeinen → Instellingen → Webhook Signature Payload Verification Key om uw webhook-sleutel te verkrijgen.
    * U kunt deze sleutel op elk moment roteren om veiligheidsredenen.
    * Bereken en vergelijk de `X-Webhook-Signature` waarde van ons webhook-verzoek met de berekende body-waarde met deze sleutel. Een voorbeeld hiervan is beschikbaar in [deze Stack Overflow post](https://stackoverflow.com/a/68885281).
  * Zie de discussie op <https://github.com/forwardemail/free-email-forwarding/issues/235> voor meer inzicht.
* We wachten tot maximaal `5` seconden op uw webhook-eindpunt om te reageren met een `200` statuscode, en we proberen het maximaal `1` keer opnieuw.
* Als we detecteren dat uw bounce webhook URL een fout heeft terwijl we proberen een verzoek te sturen, dan sturen we u eenmaal per week een beleefde e-mail.
### Ondersteunt u webhooks {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
    Op zoek naar documentatie over bounce webhooks? Zie <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Ondersteunt u bounce webhooks?</a> voor meer inzicht.
  <span>
  </span>
</div>

Ja, sinds 15 mei 2020 hebben we deze functie toegevoegd. U kunt eenvoudig webhook(s) toevoegen precies zoals u dat met elke ontvanger zou doen! Zorg ervoor dat u het "http" of "https" protocol voorvoegt in de URL van de webhook.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Verbeterde privacybescherming:
  </strong>
  <span>
    Als u een betaald abonnement heeft (dat verbeterde privacybescherming biedt), ga dan naar <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> en klik op "Aliassen" naast uw domein om uw webhooks te configureren. Wilt u meer weten over betaalde abonnementen, zie dan onze <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Prijzen</a> pagina. Anders kunt u de onderstaande instructies blijven volgen.
  </span>
</div>

Als u het gratis abonnement gebruikt, voeg dan eenvoudig een nieuw DNS <strong class="notranslate">TXT</strong> record toe zoals hieronder weergegeven:

Bijvoorbeeld, als ik alle e-mails die naar `alias@example.com` gaan wil doorsturen naar een nieuwe [request bin](https://requestbin.com/r/en8pfhdgcculn?inspect) test endpoint:

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

Of misschien wilt u alle e-mails die naar `example.com` gaan doorsturen naar dit endpoint:

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

* Als u webhook payloads moet verifiëren (om te verzekeren dat ze daadwerkelijk van onze server komen), dan kunt u [het IP-adres van de externe client hostnaam opzoeken met een reverse lookup](https://nodejs.org/api/dns.html#dnspromisesreverseip) – dit moet ofwel `mx1.forwardemail.net` of `mx2.forwardemail.net` zijn.
  * U kunt ook het IP controleren tegen [onze gepubliceerde IP-adressen](#what-are-your-servers-ip-addresses).
  * Als u een betaald abonnement heeft, ga dan naar Mijn Account → Domeinen → Instellingen → Webhook Signature Payload Verification Key om uw webhook sleutel te verkrijgen.
    * U kunt deze sleutel op elk moment om veiligheidsredenen roteren.
    * Bereken en vergelijk de `X-Webhook-Signature` waarde van ons webhook verzoek met de berekende body waarde met deze sleutel. Een voorbeeld hoe dit te doen is beschikbaar op [deze Stack Overflow post](https://stackoverflow.com/a/68885281).
  * Zie de discussie op <https://github.com/forwardemail/free-email-forwarding/issues/235> voor meer inzicht.
* Als een webhook niet reageert met een `200` statuscode, slaan we de reactie op in het [foutlogboek dat wordt aangemaakt](#do-you-store-error-logs) – wat nuttig is voor het debuggen.
* Webhook HTTP-verzoeken worden tot 3 keer opnieuw geprobeerd bij elke SMTP-verbinding poging, met een maximale timeout van 60 seconden per endpoint POST-verzoek. **Let op dat dit niet betekent dat het maar 3 keer opnieuw probeert**, het zal eigenlijk continu opnieuw proberen door een SMTP-code 421 te sturen (wat aangeeft aan de verzender om later opnieuw te proberen) na de 3e mislukte HTTP POST poging. Dit betekent dat de e-mail continu opnieuw zal proberen gedurende dagen totdat een 200 statuscode wordt behaald.
* We proberen automatisch opnieuw op basis van de standaard status- en foutcodes die worden gebruikt in de [retry-methode van superagent](https://ladjs.github.io/superagent/#retrying-requests) (wij zijn onderhouders).
* We groeperen webhook HTTP-verzoeken naar hetzelfde endpoint in één verzoek in plaats van meerdere, om middelen te besparen en de responstijd te versnellen. Bijvoorbeeld, als u een e-mail stuurt naar <webhook1@example.com>, <webhook2@example.com>, en <webhook3@example.com>, en al deze zijn geconfigureerd om hetzelfde *exacte* endpoint URL te raken, dan wordt er slechts één verzoek gedaan. We groeperen op exacte endpoint-overeenkomst met strikte gelijkheid.
* Let op dat we de [mailparser](https://nodemailer.com/extras/mailparser/) bibliotheek's "simpleParser" methode gebruiken om het bericht te parseren naar een JSON-vriendelijk object.
* De ruwe e-mailwaarde als String wordt gegeven als de eigenschap "raw".
* Authenticatieresultaten worden gegeven als eigenschappen "dkim", "spf", "arc", "dmarc", en "bimi".
* De geparseerde e-mailheaders worden gegeven als de eigenschap "headers" – maar let ook op dat u "headerLines" kunt gebruiken voor eenvoudigere iteratie en parsing.
* De gegroepeerde ontvangers voor deze webhook zijn gegroepeerd en gegeven als de eigenschap "recipients".
* De SMTP-sessie-informatie wordt gegeven als de eigenschap "session". Dit bevat informatie over de afzender van het bericht, aankomsttijd van het bericht, HELO, en client hostnaam. De client hostnaam waarde als `session.clientHostname` is ofwel de FQDN (van een reverse PTR lookup) of het is `session.remoteAddress` tussen haakjes (bijv. `"[127.0.0.1]"`).
* Als u snel de waarde van `X-Original-To` wilt krijgen, kunt u de waarde van `session.recipient` gebruiken (zie voorbeeld hieronder). De header `X-Original-To` is een header die we toevoegen aan berichten voor debugging met de originele ontvanger (voor gemaskeerde forwarding) van het bericht.
* Als u `attachments` en/of `raw` eigenschappen uit de payload body wilt verwijderen, voeg dan eenvoudig `?attachments=false`, `?raw=false`, of `?attachments=false&raw=false` toe aan uw webhook endpoint als querystring parameter (bijv. `https://example.com/webhook?attachments=false&raw=false`).
* Als er bijlagen zijn, worden deze toegevoegd aan de `attachments` Array met Buffer waarden. U kunt ze terug parseren naar inhoud met een aanpak in JavaScript zoals:
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

### Ondersteunt u reguliere expressies of regex {#do-you-support-regular-expressions-or-regex}

Ja, sinds 27 september 2021 hebben we deze functie toegevoegd. U kunt eenvoudig reguliere expressies ("regex") schrijven om aliassen te matchen en substituties uit te voeren.

Reguliere expressie-ondersteunde aliassen zijn degene die beginnen met een `/` en eindigen met een `/` en waarvan de ontvangers e-mailadressen of webhooks zijn. De ontvangers kunnen ook regex-substitutie ondersteunen (bijv. `$1`, `$2`).

We ondersteunen twee reguliere expressie-vlaggen, namelijk `i` en `g`. De hoofdletterongevoelige vlag `i` is een permanente standaard en wordt altijd afgedwongen. De globale vlag `g` kan door u worden toegevoegd door de afsluitende `/` te voorzien van `/g`.

Let op dat we ook onze <a href="#can-i-disable-specific-aliases">uitgeschakelde alias-functie</a> voor het ontvanger-gedeelte ondersteunen met onze regex-ondersteuning.

Reguliere expressies worden niet ondersteund op <a href="/disposable-addresses" target="_blank">globale vanity-domeinen</a> (aangezien dit een beveiligingsrisico kan zijn).

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Verbeterde Privacybescherming:
  </strong>
  <span>
    Als u een betaald abonnement heeft (met verbeterde privacybescherming), ga dan naar <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> en klik op "Aliassen" naast uw domein om aliassen te configureren, inclusief die met reguliere expressies. Wilt u meer weten over betaalde abonnementen, zie dan onze <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Prijzen</a> pagina.
  </span>
</div>

#### Voorbeelden voor Verbeterde Privacybescherming {#examples-for-enhanced-privacy-protection}

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Aliasnaam</th>
      <th>Effect</th>
      <th>Test</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>/^(linus|torvalds)$/</code></td>
      <td>E-mails naar `linus@example.com` of `torvalds@example.com`</td>
      <td>(<a href="https://regexr.com/8gb8n" class="alert-link">bekijk test op RegExr</a>)</td>
    </tr>
    <tr>
      <td><code>/^24highst(reet)$/</code></td>
      <td>E-mails naar `24highst@example.com` of `24highstreet@example.com`</td>
      <td>(<a href="https://regexr.com/8g9rb" class="alert-link">bekijk test op RegExr</a>)</td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
    Om deze te testen op <a href="https://regexr.com" class="alert-link">RegExr</a>, schrijf de expressie in het bovenste vak en typ vervolgens een voorbeeldalias in het tekstvak eronder. Als het overeenkomt, wordt het blauw.
  <span>
  </span>
</div>

#### Voorbeelden voor het gratis abonnement {#examples-for-the-free-plan}

Als u het gratis abonnement gebruikt, voeg dan eenvoudig een nieuw DNS <strong class="notranslate">TXT</strong>-record toe met een of meer van de onderstaande voorbeelden:

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Eenvoudig voorbeeld:</strong> Als ik wil dat alle e-mails die naar `linus@example.com` of `torvalds@example.com` gaan worden doorgestuurd naar `user@gmail.com`:
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
  <strong>Voorbeeld voor voornaam achternaam substitutie:</strong> Stel dat al uw bedrijfs-e-mailadressen het patroon `voornaam.achternaam@example.com` hebben. Als ik wil dat alle e-mails die naar het patroon `voornaam.achternaam@example.com` gaan worden doorgestuurd naar `voornaam.achternaam@bedrijf.com` met substitutie-ondersteuning (<a href="https://regexr.com/66hnu" class="alert-link">bekijk test op RegExr</a>):
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
  <strong>Voorbeeld van substitutie met plustekenfiltering:</strong> Als ik wil dat alle e-mails die naar `info@example.com` of `support@example.com` gaan respectievelijk worden doorgestuurd naar `user+info@gmail.com` of `user+support@gmail.com` (met substitutie-ondersteuning) (<a href="https://regexr.com/66ho7" class="alert-link">bekijk test op RegExr</a>):
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
  <strong>Voorbeeld van webhook querystring substitutie:</strong> Misschien wil je dat alle e-mails die naar `example.com` gaan naar een <a href="#do-you-support-webhooks" class="alert-link">webhook</a> gaan en een dynamische querystring sleutel "to" hebben met een waarde van het gebruikersnaamgedeelte van het e-mailadres (<a href="https://regexr.com/66ho4" class="alert-link">bekijk test op RegExr</a>):
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
  <strong>Voorbeeld van stille afwijzing:</strong> Als je wilt dat alle e-mails die aan een bepaald patroon voldoen worden uitgeschakeld en stil worden afgewezen (verschijnt voor de afzender alsof het bericht succesvol is verzonden, maar gaat eigenlijk nergens heen) met statuscode `250` (zie <a href="#can-i-disable-specific-aliases" class="alert-link">Kan ik specifieke aliassen uitschakelen</a>), gebruik dan gewoon dezelfde aanpak met een enkel uitroepteken "!". Dit geeft aan de afzender aan dat het bericht succesvol is afgeleverd, maar het ging eigenlijk nergens heen (bijv. blackhole of `/dev/null`).
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
  <strong>Voorbeeld van zachte afwijzing:</strong> Als je wilt dat alle e-mails die aan een bepaald patroon voldoen worden uitgeschakeld en zacht worden afgewezen met statuscode `421` (zie <a href="#can-i-disable-specific-aliases" class="alert-link">Kan ik specifieke aliassen uitschakelen</a>), gebruik dan gewoon dezelfde aanpak met een dubbel uitroepteken "!!". Dit geeft aan de afzender aan om de e-mail opnieuw te proberen, en e-mails naar deze alias worden ongeveer 5 dagen opnieuw geprobeerd en daarna permanent afgewezen.
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
  <strong>Voorbeeld van harde afwijzing:</strong> Als je wilt dat alle e-mails die aan een bepaald patroon voldoen worden uitgeschakeld en hard worden afgewezen met statuscode `550` (zie <a href="#can-i-disable-specific-aliases" class="alert-link">Kan ik specifieke aliassen uitschakelen</a>), gebruik dan gewoon dezelfde methode met een drievoudig uitroepteken "!!!". Dit geeft aan de afzender een permanente fout aan en e-mails worden niet opnieuw geprobeerd, ze worden voor deze alias afgewezen.
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
    Benieuwd hoe je een reguliere expressie schrijft of wil je je vervanging testen? Je kunt naar de gratis website voor het testen van reguliere expressies <a href="https://regexr.com" class="alert-link">RegExr</a> gaan op <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
  <span>
  </span>
</div>

### Wat zijn jullie limieten voor uitgaande SMTP {#what-are-your-outbound-smtp-limits}

We beperken gebruikers en domeinen tot 300 uitgaande SMTP-berichten per 1 dag. Dit komt gemiddeld neer op meer dan 9000 e-mails in een kalendermaand. Als je deze hoeveelheid moet overschrijden of consequent grote e-mails hebt, neem dan contact met ons op via [contact](https://forwardemail.net/help).

### Heb ik goedkeuring nodig om SMTP in te schakelen {#do-i-need-approval-to-enable-smtp}

Ja, houd er rekening mee dat Forward Email een handmatig beoordelingsproces per domein hanteert voor goedkeuring van uitgaande SMTP om de IP-reputatie te behouden en de afleverbaarheid te waarborgen. Stuur een e-mail naar <support@forwardemail.net> of open een [hulpverzoek](https://forwardemail.net/help) voor goedkeuring. Dit duurt meestal minder dan 24 uur, waarbij de meeste verzoeken binnen 1-2 uur worden gehonoreerd. In de nabije toekomst streven we ernaar dit proces direct te maken met extra spamcontroles en waarschuwingen. Dit proces zorgt ervoor dat je e-mails de inbox bereiken en je berichten niet als spam worden gemarkeerd.

### Wat zijn jullie SMTP-serverconfiguratie-instellingen {#what-are-your-smtp-server-configuration-settings}

Onze server is `smtp.forwardemail.net` en wordt ook gemonitord op onze <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statuspagina</a>.

Hij ondersteunt zowel IPv4 als IPv6 en is beschikbaar via poorten `465` en `2465` voor SSL/TLS (aanbevolen) en `587`, `2587`, `2525` en `25` voor TLS (STARTTLS).

**Vanaf oktober 2025** ondersteunen we nu **legacy TLS 1.0** verbindingen op poorten `2455` (SSL/TLS) en `2555` (STARTTLS) voor oudere apparaten zoals printers, scanners, camera's en legacy e-mailclients die geen moderne TLS-versies kunnen ondersteunen. Deze poorten worden aangeboden als alternatief voor Gmail, Yahoo, Outlook en andere providers die de ondersteuning voor oudere TLS-protocollen hebben stopgezet.

> \[!CAUTION]
> **Legacy TLS 1.0-ondersteuning (poorten 2455 en 2555)**: Deze poorten gebruiken het verouderde TLS 1.0-protocol dat bekende beveiligingsproblemen heeft (BEAST, POODLE). Gebruik deze poorten alleen als je apparaat absoluut geen TLS 1.2 of hoger kan ondersteunen. We raden sterk aan om de firmware van je apparaat te upgraden of over te schakelen naar moderne e-mailclients waar mogelijk. Deze poorten zijn uitsluitend bedoeld voor compatibiliteit met legacy hardware (oude printers, scanners, camera's, IoT-apparaten).

|                                     Protocol                                     | Hostnaam                |            Poorten            |        IPv4        |        IPv6        | Opmerkingen                            |
| :------------------------------------------------------------------------------: | ----------------------- | :---------------------------: | :----------------: | :----------------: | ------------------------------------- |
|                              `SSL/TLS` **Aanbevolen**                            | `smtp.forwardemail.net` |        `465`, `2465`          | :white_check_mark: | :white_check_mark: | Moderne TLS 1.2+ (Aanbevolen)         |
|         `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS))         | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25`   | :white_check_mark: | :white_check_mark: | Ondersteund (bij voorkeur SSL/TLS poort `465`) |
|                             `SSL/TLS` **Alleen legacy**                          | `smtp.forwardemail.net` |            `2455`             | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 alleen voor oude apparaten |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) **Alleen legacy** | `smtp.forwardemail.net` |            `2555`             | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 alleen voor oude apparaten |
| Login    | Voorbeeld                 | Beschrijving                                                                                                                                                                              |
| -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Gebruikersnaam | `user@example.com`         | E-mailadres van een alias die bestaat voor het domein bij <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a>. |
| Wachtwoord | `************************` | Alias                                                                                                                                                                                    |

Om uitgaande e-mail te verzenden met SMTP, moet de **SMTP-gebruiker** het e-mailadres zijn van een alias die bestaat voor het domein bij <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> – en het **SMTP-wachtwoord** moet een alias-specifiek gegenereerd wachtwoord zijn.

Zie [Ondersteunt u het verzenden van e-mail met SMTP](#do-you-support-sending-email-with-smtp) voor stapsgewijze instructies.

### Wat zijn uw IMAP-serverconfiguratie-instellingen {#what-are-your-imap-server-configuration-settings}

Onze server is `imap.forwardemail.net` en wordt ook gemonitord op onze <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statuspagina</a>.

Deze ondersteunt zowel IPv4 als IPv6 en is beschikbaar via poorten `993` en `2993` voor SSL/TLS.

|         Protocol        | Hostnaam                |     Poorten     |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :-------------: | :----------------: | :----------------: |
| `SSL/TLS` **Voorkeur**  | `imap.forwardemail.net` | `993`, `2993`   | :white_check_mark: | :white_check_mark: |

| Login    | Voorbeeld                 | Beschrijving                                                                                                                                                                              |
| -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Gebruikersnaam | `user@example.com`         | E-mailadres van een alias die bestaat voor het domein bij <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a>. |
| Wachtwoord | `************************` | Alias-specifiek gegenereerd wachtwoord.                                                                                                                                                   |

Om verbinding te maken met IMAP, moet de **IMAP-gebruiker** het e-mailadres zijn van een alias die bestaat voor het domein bij <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> – en het **IMAP-wachtwoord** moet een alias-specifiek gegenereerd wachtwoord zijn.

Zie [Ondersteunt u het ontvangen van e-mail met IMAP](#do-you-support-receiving-email-with-imap) voor stapsgewijze instructies.

### Wat zijn uw POP3-serverconfiguratie-instellingen {#what-are-your-pop3-server-configuration-settings}

Onze server is `pop3.forwardemail.net` en wordt ook gemonitord op onze <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statuspagina</a>.

Deze ondersteunt zowel IPv4 als IPv6 en is beschikbaar via poorten `995` en `2995` voor SSL/TLS.

|         Protocol        | Hostnaam                |     Poorten     |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :-------------: | :----------------: | :----------------: |
| `SSL/TLS` **Voorkeur**  | `pop3.forwardemail.net` | `995`, `2995`   | :white_check_mark: | :white_check_mark: |
| Login    | Voorbeeld                 | Beschrijving                                                                                                                                                                              |
| -------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gebruikersnaam | `user@example.com`         | E-mailadres van een alias die bestaat voor het domein bij <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a>. |
| Wachtwoord | `************************` | Alias-specifiek gegenereerd wachtwoord.                                                                                                                                                   |

Om verbinding te maken met POP3, moet de **POP3-gebruiker** het e-mailadres zijn van een alias die bestaat voor het domein bij <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> – en het **IMAP-wachtwoord** moet een alias-specifiek gegenereerd wachtwoord zijn.

Zie [Ondersteunt u POP3](#do-you-support-pop3) voor stapsgewijze instructies.

### Hoe stel ik e-mail autodiscovery in voor mijn domein {#how-do-i-set-up-email-autodiscovery-for-my-domain}

E-mail autodiscovery stelt e-mailclients zoals **Thunderbird**, **Apple Mail**, **Microsoft Outlook** en mobiele apparaten in staat om automatisch de juiste IMAP-, SMTP-, POP3-, CalDAV- en CardDAV-serverinstellingen te detecteren wanneer een gebruiker zijn e-mailaccount toevoegt. Dit wordt gedefinieerd door [RFC 6186](https://www.rfc-editor.org/rfc/rfc6186.html) (e-mail) en [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) (CalDAV/CardDAV) en maakt gebruik van DNS SRV-records.

Forward Email publiceert autodiscovery-records op `forwardemail.net`. Je kunt ofwel SRV-records direct aan je domein toevoegen, of een eenvoudigere CNAME-aanpak gebruiken.

#### Optie A: CNAME-records (eenvoudigst) {#option-a-cname-records-simplest}

Voeg deze twee CNAME-records toe aan de DNS van je domein. Dit delegeert autodiscovery aan de servers van Forward Email:

|  Type | Naam/Host      | Doel/Waarde                    |
| :---: | -------------- | ----------------------------- |
| CNAME | `autoconfig`   | `autoconfig.forwardemail.net` |
| CNAME | `autodiscover` | `autodiscover.forwardemail.net` |

Het `autoconfig`-record wordt gebruikt door **Thunderbird** en andere Mozilla-gebaseerde clients. Het `autodiscover`-record wordt gebruikt door **Microsoft Outlook**.

#### Optie B: SRV-records (direct) {#option-b-srv-records-direct}

Als je de records liever direct toevoegt (of als je DNS-provider geen CNAME op subdomeinen ondersteunt), voeg dan deze SRV-records toe aan je domein:

| Type | Naam/Host           | Prioriteit | Gewicht | Poort | Doel/Waarde               | Doel                                  |
| :--: | ------------------- | :--------: | :-----: | :----: | ------------------------- | ------------------------------------ |
|  SRV | `_imaps._tcp`       |     0      |    1    |  993   | `imap.forwardemail.net`    | IMAP over SSL/TLS (voorkeur)         |
|  SRV | `_imap._tcp`        |     0      |    0    |   0    | `.`                        | Plaintext IMAP uitgeschakeld         |
|  SRV | `_submissions._tcp` |     0      |    1    |  465   | `smtp.forwardemail.net`    | SMTP-submissie (SSL/TLS, aanbevolen) |
|  SRV | `_submission._tcp`  |     5      |    1    |  587   | `smtp.forwardemail.net`    | SMTP-submissie (STARTTLS)             |
|  SRV | `_pop3s._tcp`       |    10      |    1    |  995   | `pop3.forwardemail.net`    | POP3 over SSL/TLS                    |
|  SRV | `_pop3._tcp`        |     0      |    0    |   0    | `.`                        | Plaintext POP3 uitgeschakeld         |
|  SRV | `_caldavs._tcp`     |     0      |    1    |  443   | `caldav.forwardemail.net`  | CalDAV over TLS (agenda's)            |
|  SRV | `_caldav._tcp`      |     0      |    0    |   0    | `.`                        | Plaintext CalDAV uitgeschakeld       |
|  SRV | `_carddavs._tcp`    |     0      |    1    |  443   | `carddav.forwardemail.net` | CardDAV over TLS (contacten)          |
|  SRV | `_carddav._tcp`     |     0      |    0    |   0    | `.`                        | Plaintext CardDAV uitgeschakeld      |
> \[!NOTE]
> IMAP heeft een lagere prioriteitswaarde (0) dan POP3 (10), wat e-mailclients vertelt om IMAP te verkiezen boven POP3 wanneer beide beschikbaar zijn. De records met een target van `.` (een enkele punt) geven aan dat de platte tekst (niet-versleutelde) versies van die protocollen opzettelijk zijn uitgeschakeld volgens [RFC 6186 Sectie 3.4](https://www.rfc-editor.org/rfc/rfc6186.html#section-3.4). De CalDAV- en CardDAV-SRV-records volgen [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) voor automatische ontdekking van agenda- en contactgegevens.

#### Welke e-mailclients ondersteunen autodiscovery? {#which-email-clients-support-autodiscovery}

| Client             | E-mail                                           | CalDAV/CardDAV                             |
| ------------------ | ------------------------------------------------ | ------------------------------------------ |
| Thunderbird        | `autoconfig` CNAME- of SRV-records               | `autoconfig` XML- of SRV-records (RFC 6764) |
| Apple Mail (macOS) | SRV-records (RFC 6186)                            | SRV-records (RFC 6764)                     |
| Apple Mail (iOS)   | SRV-records (RFC 6186)                            | SRV-records (RFC 6764)                     |
| Microsoft Outlook  | `autodiscover` CNAME of `_autodiscover._tcp` SRV | Niet ondersteund                           |
| GNOME (Evolution)  | SRV-records (RFC 6186)                            | SRV-records (RFC 6764)                     |
| KDE (KMail)        | SRV-records (RFC 6186)                            | SRV-records (RFC 6764)                     |
| eM Client          | `autoconfig` of `autodiscover`                    | SRV-records (RFC 6764)                     |

> \[!TIP]
> Voor de beste compatibiliteit met alle clients raden we aan **Optie A** (CNAME-records) te gebruiken in combinatie met de SRV-records uit **Optie B**. De CNAME-methode dekt de meerderheid van de e-mailclients. De CalDAV/CardDAV SRV-records zorgen ervoor dat agenda- en contactclients ook automatisch je serverinstellingen kunnen ontdekken.


## Beveiliging {#security-1}

### Geavanceerde technieken voor serververharding {#advanced-server-hardening-techniques}

> \[!TIP]
> Lees meer over onze beveiligingsinfrastructuur op [onze beveiligingspagina](/security).

Forward Email implementeert talrijke technieken voor serververharding om de beveiliging van onze infrastructuur en jouw gegevens te waarborgen:

1. **Netwerkbeveiliging**:
   * IP tables firewall met strikte regels
   * Fail2ban voor bescherming tegen brute force
   * Regelmatige beveiligingsaudits en penetratietests
   * Alleen VPN-toegang voor administratie

2. **Systeemverharding**:
   * Minimale pakketinstallatie
   * Regelmatige beveiligingsupdates
   * SELinux in afdwingmodus
   * Uitgeschakelde root SSH-toegang
   * Alleen sleutelgebaseerde authenticatie

3. **Applicatiebeveiliging**:
   * Content Security Policy (CSP) headers
   * HTTPS Strict Transport Security (HSTS)
   * XSS-beschermingsheaders
   * Frame-opties en referrer policy headers
   * Regelmatige afhankelijkheidsaudits

4. **Gegevensbescherming**:
   * Volledige schijfversleuteling met LUKS
   * Veilige sleutelbeheer
   * Regelmatige back-ups met encryptie
   * Praktijken voor dataminimalisatie

5. **Monitoring en respons**:
   * Real-time inbraakdetectie
   * Geautomatiseerde beveiligingsscans
   * Gecentraliseerde logging en analyse
   * Procedures voor incidentrespons

> \[!IMPORTANT]
> Onze beveiligingspraktijken worden continu bijgewerkt om nieuwe bedreigingen en kwetsbaarheden aan te pakken.

> \[!TIP]
> Voor maximale beveiliging raden we aan onze dienst te gebruiken met end-to-end encryptie via OpenPGP.

### Heb je SOC 2 of ISO 27001 certificeringen {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email draait op infrastructuur die wordt geleverd door gecertificeerde subprocessors om te voldoen aan industrienormen.

Forward Email beschikt niet direct over SOC 2 Type II of ISO 27001 certificeringen. De dienst draait echter op infrastructuur die wordt geleverd door gecertificeerde subprocessors:

* **DigitalOcean**: SOC 2 Type II en SOC 3 Type II gecertificeerd (geaudit door Schellman & Company LLC), ISO 27001 gecertificeerd in meerdere datacenters. Details: <https://www.digitalocean.com/trust/certification-reports>
* **Vultr**: SOC 2+ (HIPAA) gecertificeerd, ISO/IEC certificeringen: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Details: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: SOC 2 compliant (neem rechtstreeks contact op met DataPacket om certificering te verkrijgen), infrastructuurprovider van ondernemingsniveau (locatie Denver). Details: <https://www.datapacket.com/datacenters/denver>

Forward Email volgt de beste praktijken in de industrie voor beveiligingsaudits en werkt regelmatig samen met onafhankelijke beveiligingsonderzoekers. Bron: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### Gebruikt u TLS-encryptie voor e-mail forwarding {#do-you-use-tls-encryption-for-email-forwarding}

Ja. Forward Email handhaaft strikt TLS 1.2+ voor alle verbindingen (HTTPS, SMTP, IMAP, POP3) en implementeert MTA-STS voor verbeterde TLS-ondersteuning. De implementatie omvat:

* TLS 1.2+ afdwinging voor alle e-mailverbindingen
* ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) sleuteluitwisseling voor perfecte forward secrecy
* Moderne cipher suites met regelmatige beveiligingsupdates
* HTTP/2 ondersteuning voor verbeterde prestaties en beveiliging
* HSTS (HTTP Strict Transport Security) met preloading in grote browsers
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** voor strikte TLS-handhaving

Bron: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**MTA-STS Implementatie**: Forward Email implementeert strikte MTA-STS afdwinging in de codebase. Wanneer TLS-fouten optreden en MTA-STS wordt afgedwongen, retourneert het systeem 421 SMTP-statuscodes om ervoor te zorgen dat e-mails later opnieuw worden geprobeerd in plaats van onveilig te worden afgeleverd. Implementatiedetails:

* TLS-foutdetectie: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* MTA-STS afdwinging in send-email helper: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Validatie door derden: <https://www.hardenize.com/report/forwardemail.net/1750312779> toont "Good" beoordelingen voor alle TLS- en transportbeveiligingsmaatregelen.

### Bewaart u e-mail authenticatieheaders {#do-you-preserve-email-authentication-headers}

Ja. Forward Email implementeert en bewaart e-mail authenticatieheaders uitgebreid:

* **SPF (Sender Policy Framework)**: Correct geïmplementeerd en bewaard
* **DKIM (DomainKeys Identified Mail)**: Volledige ondersteuning met correct sleutelbeheer
* **DMARC**: Beleidsafdwinging voor e-mails die SPF- of DKIM-validatie niet doorstaan
* **ARC**: Hoewel niet expliciet gedetailleerd, suggereren de perfecte compliance scores van de dienst een uitgebreide afhandeling van authenticatieheaders

Bron: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Validatie: Internet.nl Mail Test toont een score van 100/100 specifiek voor de implementatie van "SPF, DKIM en DMARC". Hardenize beoordeling bevestigt "Good" beoordelingen voor SPF en DMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Bewaart u originele e-mailheaders en voorkomt u spoofing {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email implementeert geavanceerde anti-spoofing bescherming om misbruik van e-mail te voorkomen.

Forward Email bewaart originele e-mailheaders terwijl het uitgebreide anti-spoofing bescherming implementeert via de MX codebase:

* **Headerbehoud**: Originele authenticatieheaders worden behouden tijdens het doorsturen
* **Anti-Spoofing**: DMARC beleidsafdwinging voorkomt header spoofing door e-mails die SPF- of DKIM-validatie niet doorstaan te weigeren
* **Voorkoming van headerinjectie**: Invoervalidatie en sanering met behulp van de striptags bibliotheek
* **Geavanceerde bescherming**: Geavanceerde phishingdetectie met spoofingdetectie, impersonatiepreventie en gebruikersnotificatiesystemen

**MX Implementatiedetails**: De kernlogica voor e-mailverwerking wordt afgehandeld door de MX server codebase, specifiek:

* Hoofd MX data handler: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Willekeurige e-mail filtering (anti-spoofing): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

De `isArbitrary` helper implementeert geavanceerde anti-spoofing regels inclusief detectie van domeinimitatie, geblokkeerde zinnen en diverse phishingpatronen.
### Hoe beschermt u tegen spam en misbruik {#how-do-you-protect-against-spam-and-abuse}

Forward Email implementeert uitgebreide meerlaagse bescherming:

* **Rate Limiting**: Toegepast op authenticatiepogingen, API-eindpunten en SMTP-verbindingen
* **Resource-isolatie**: Tussen gebruikers om impact van gebruikers met hoog volume te voorkomen
* **DDoS-bescherming**: Meerlaagse bescherming via het Shield-systeem van DataPacket en Cloudflare
* **Automatische schaalvergroting**: Dynamische aanpassing van middelen op basis van vraag
* **Misbruikpreventie**: Gebruikersspecifieke misbruikpreventiecontroles en op hashes gebaseerde blokkering voor kwaadaardige inhoud
* **E-mailauthenticatie**: SPF-, DKIM-, DMARC-protocollen met geavanceerde phishingdetectie

Bronnen:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (Details DDoS-bescherming)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### Slaat u e-mailinhoud op de schijf op {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email gebruikt een zero-knowledge architectuur die voorkomt dat e-mailinhoud naar de schijf wordt geschreven.

* **Zero-Knowledge Architectuur**: Individueel versleutelde SQLite-mailboxen betekenen dat Forward Email geen toegang heeft tot e-mailinhoud
* **In-Memory Verwerking**: E-mailverwerking vindt volledig in het geheugen plaats, zonder opslag op schijf
* **Geen Inhoudslogging**: "We loggen of bewaren geen e-mailinhoud of metadata op de schijf"
* **Sandboxed Encryptie**: Encryptiesleutels worden nooit in platte tekst op de schijf opgeslagen

**MX Codebase Bewijs**: De MX-server verwerkt e-mails volledig in het geheugen zonder inhoud naar de schijf te schrijven. De hoofdhandler voor e-mailverwerking toont deze in-memory aanpak: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Bronnen:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Abstract)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Zero-knowledge details)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Sandboxed encryptie)

### Kan e-mailinhoud worden blootgesteld tijdens systeemcrashes {#can-email-content-be-exposed-during-system-crashes}

Nee. Forward Email implementeert uitgebreide beveiligingen tegen blootstelling van gegevens bij crashes:

* **Core Dumps Uitgeschakeld**: Voorkomt blootstelling van geheugen tijdens crashes
* **Swapgeheugen Uitgeschakeld**: Volledig uitgeschakeld om extractie van gevoelige gegevens uit swapbestanden te voorkomen
* **In-Memory Architectuur**: E-mailinhoud bestaat alleen in vluchtig geheugen tijdens verwerking
* **Bescherming Encryptiesleutels**: Sleutels worden nooit in platte tekst op de schijf opgeslagen
* **Fysieke Beveiliging**: LUKS v2 versleutelde schijven voorkomen fysieke toegang tot data
* **USB-opslag Uitgeschakeld**: Voorkomt ongeautoriseerde data-extractie

**Foutafhandeling voor Systeemproblemen**: Forward Email gebruikt helperfuncties `isCodeBug` en `isTimeoutError` om ervoor te zorgen dat bij databaseconnectiviteitsproblemen, DNS-netwerk-/blocklistproblemen of upstream-connectiviteitsproblemen het systeem 421 SMTP-statuscodes retourneert zodat e-mails later opnieuw geprobeerd worden in plaats van verloren te gaan of blootgesteld te worden.

Implementatiedetails:

* Foutclassificatie: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Timeout-foutafhandeling in MX-verwerking: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Bron: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### Wie heeft toegang tot uw e-mailinfrastructuur {#who-has-access-to-your-email-infrastructure}

Forward Email implementeert uitgebreide toegangscontroles voor de minimale 2-3 koppige engineeringteamtoegang met strikte 2FA-vereisten:

* **Role-Based Access Control**: Voor teamaccounts met op middelen gebaseerde permissies
* **Least Privilege Principe**: Toegepast in alle systemen
* **Scheiding van Taken**: Tussen operationele rollen
* **Gebruikersbeheer**: Gescheiden deploy- en devops-gebruikers met verschillende permissies
* **Root-login Uitgeschakeld**: Dwingt toegang via correct geauthenticeerde accounts af
* **Strikte 2FA**: Geen SMS-gebaseerde 2FA vanwege risico op MiTM-aanvallen - alleen app-gebaseerde of hardwaretokens
* **Uitgebreide Auditlogging**: Met redactie van gevoelige gegevens
* **Geautomatiseerde Anomaliedetectie**: Voor ongebruikelijke toegangs-patronen
* **Regelmatige Beveiligingsreviews**: Van toegangslogs
* **Evil Maid Attack Preventie**: USB-opslag uitgeschakeld en andere fysieke beveiligingsmaatregelen
Bronnen:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Autorisatiecontroles)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Netwerkbeveiliging)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Preventie van evil maid-aanvallen)

### Welke infrastructuurproviders gebruikt u {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email gebruikt meerdere infrastructuur subprocessors met uitgebreide compliance-certificeringen.

Volledige details zijn beschikbaar op onze GDPR-compliancepagina: <https://forwardemail.net/gdpr>

**Primaire infrastructuur subprocessors:**

| Provider         | Data Privacy Framework gecertificeerd | GDPR-compliancepagina                                                                    |
| ---------------- | ------------------------------------ | ---------------------------------------------------------------------------------------- |
| **Cloudflare**   | ✅ Ja                                | <https://www.cloudflare.com/trust-hub/gdpr/>                                            |
| **DataPacket**   | ❌ Nee                               | <https://www.datapacket.com/privacy-policy>                                             |
| **DigitalOcean** | ❌ Nee                               | <https://www.digitalocean.com/legal/gdpr>                                               |
| **GitHub**       | ✅ Ja                                | <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement> |
| **Vultr**        | ❌ Nee                               | <https://www.vultr.com/legal/eea-gdpr-privacy/>                                         |

**Gedetailleerde certificeringen:**

**DigitalOcean**

* SOC 2 Type II & SOC 3 Type II (geaudit door Schellman & Company LLC)
* ISO 27001 gecertificeerd in meerdere datacenters
* PCI-DSS compliant
* CSA STAR Level 1 gecertificeerd
* APEC CBPR PRP gecertificeerd
* Details: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* SOC 2+ (HIPAA) gecertificeerd
* PCI Merchant compliant
* CSA STAR Level 1 gecertificeerd
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Details: <https://www.vultr.com/legal/compliance/>

**DataPacket**

* SOC 2 compliant (neem rechtstreeks contact op met DataPacket om certificering te verkrijgen)
* Enterprise-grade infrastructuur (locatie Denver)
* DDoS-bescherming via Shield cybersecurity stack
* 24/7 technische ondersteuning
* Wereldwijd netwerk met 58 datacenters
* Details: <https://www.datapacket.com/datacenters/denver>

**GitHub**

* Data Privacy Framework gecertificeerd (EU-VS, Zwitserland-VS en UK Extension)
* Hosting van broncode, CI/CD en projectbeheer
* GitHub Data Protection Agreement beschikbaar
* Details: <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement>

**Betalingsverwerkers:**

* **Stripe**: Data Privacy Framework gecertificeerd - <https://stripe.com/legal/privacy-center>
* **PayPal**: Niet DPF gecertificeerd - <https://www.paypal.com/uk/legalhub/privacy-full>

### Biedt u een Data Processing Agreement (DPA) aan {#do-you-offer-a-data-processing-agreement-dpa}

Ja, Forward Email biedt een uitgebreide Data Processing Agreement (DPA) die kan worden ondertekend met onze enterprise-overeenkomst. Een kopie van onze DPA is beschikbaar op: <https://forwardemail.net/dpa>

**DPA-details:**

* Omvat GDPR-compliance en EU-VS/Zwitserland-VS Privacy Shield-kaders
* Wordt automatisch geaccepteerd bij akkoord gaan met onze Servicevoorwaarden
* Geen aparte handtekening vereist voor standaard DPA
* Maatwerk DPA-regelingen beschikbaar via Enterprise License

**GDPR Compliance Framework:**
Onze DPA beschrijft de naleving van GDPR evenals internationale vereisten voor gegevensoverdracht. Volledige informatie is beschikbaar op: <https://forwardemail.net/gdpr>

Voor enterprise-klanten die maatwerk DPA-voorwaarden of specifieke contractuele regelingen nodig hebben, kunnen deze worden geregeld via ons **Enterprise License ($250/maand)** programma.

### Hoe gaat u om met meldingen van datalekken {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> De zero-knowledge architectuur van Forward Email beperkt de impact van een datalek aanzienlijk.
* **Beperkte Gegevensblootstelling**: Kan geen toegang krijgen tot versleutelde e-mailinhoud vanwege zero-knowledge architectuur
* **Minimale Gegevensverzameling**: Alleen basisinformatie van abonnees en beperkte IP-logs voor beveiliging
* **Subprocessor Kaders**: DigitalOcean, GitHub en Vultr hanteren GDPR-conforme procedures voor incidentrespons

**GDPR Vertegenwoordiger Informatie:**
Forward Email heeft GDPR-vertegenwoordigers aangesteld in overeenstemming met Artikel 27:

**EU Vertegenwoordiger:**
Osano International Compliance Services Limited
ATTN: LFHC
3 Dublin Landings, North Wall Quay
Dublin 1, D01C4E0

**VK Vertegenwoordiger:**
Osano UK Compliance LTD
ATTN: LFHC
42-46 Fountain Street, Belfast
Antrim, BT1 - 5EF

Voor zakelijke klanten die specifieke meldings-SLA's voor datalekken vereisen, dienen deze te worden besproken als onderdeel van een **Enterprise License** overeenkomst.

Bronnen:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### Biedt u een testomgeving aan {#do-you-offer-a-test-environment}

De technische documentatie van Forward Email beschrijft niet expliciet een toegewijde sandbox-modus. Mogelijke testbenaderingen zijn echter:

* **Zelfhosting Optie**: Uitgebreide zelfhostingmogelijkheden voor het creëren van testomgevingen
* **API Interface**: Mogelijkheid voor programmatische tests van configuraties
* **Open Source**: 100% open-source code stelt klanten in staat de doorstuurlogica te onderzoeken
* **Meerdere Domeinen**: Ondersteuning voor meerdere domeinen kan het aanmaken van testdomeinen mogelijk maken

Voor zakelijke klanten die formele sandbox-mogelijkheden vereisen, dient dit te worden besproken als onderdeel van een **Enterprise License** regeling.

Bron: <https://github.com/forwardemail/forwardemail.net> (Details ontwikkelomgeving)

### Biedt u monitoring- en waarschuwingshulpmiddelen aan {#do-you-provide-monitoring-and-alerting-tools}

Forward Email biedt realtime monitoring met enkele beperkingen:

**Beschikbaar:**

* **Realtime Leveringsmonitoring**: Openbaar zichtbare prestatiestatistieken voor grote e-mailproviders
* **Automatische Waarschuwingen**: Engineeringteam wordt gewaarschuwd wanneer levertijden langer dan 10 seconden zijn
* **Transparante Monitoring**: 100% open-source monitoringsystemen
* **Infrastructuurmonitoring**: Geautomatiseerde anomaliedetectie en uitgebreide auditlogging

**Beperkingen:**

* Klantgerichte webhooks of API-gebaseerde leveringsstatusmeldingen zijn niet expliciet gedocumenteerd

Voor zakelijke klanten die gedetailleerde leveringsstatus-webhooks of aangepaste monitoringintegraties vereisen, kunnen deze mogelijkheden beschikbaar zijn via **Enterprise License** regelingen.

Bronnen:

* <https://forwardemail.net> (Realtime monitoring weergave)
* <https://github.com/forwardemail/forwardemail.net> (Monitoring implementatie)

### Hoe zorgt u voor hoge beschikbaarheid {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Forward Email implementeert uitgebreide redundantie via meerdere infrastructuurproviders.

* **Gedistribueerde Infrastructuur**: Meerdere providers (DigitalOcean, Vultr, DataPacket) verspreid over geografische regio's
* **Geografische Load Balancing**: Cloudflare-gebaseerde geo-gelokaliseerde load balancing met automatische failover
* **Automatische Schaling**: Dynamische aanpassing van resources op basis van vraag
* **Meervoudige DDoS-bescherming**: Via DataPacket's Shield-systeem en Cloudflare
* **Serverredundantie**: Meerdere servers per regio met automatische failover
* **Database Replicatie**: Realtime datasynchronisatie over meerdere locaties
* **Monitoring en Waarschuwing**: 24/7 monitoring met automatische incidentrespons

**Beschikbaarheidsgarantie**: 99,9%+ servicebeschikbaarheid met transparante monitoring beschikbaar op <https://forwardemail.net>

Bronnen:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Voldoet u aan Sectie 889 van de National Defense Authorization Act (NDAA) {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Forward Email voldoet volledig aan Sectie 889 door zorgvuldige selectie van infrastructuurpartners.

Ja, Forward Email is **Sectie 889 compliant**. Sectie 889 van de National Defense Authorization Act (NDAA) verbiedt overheidsinstanties het gebruik van of contracteren met entiteiten die telecommunicatie- en videobewakingsapparatuur gebruiken van specifieke bedrijven (Huawei, ZTE, Hikvision, Dahua en Hytera).
**Hoe Forward Email Sectie 889 naleving bereikt:**

Forward Email vertrouwt uitsluitend op twee belangrijke infrastructuurproviders, die geen van beiden apparatuur gebruiken die verboden is volgens Sectie 889:

1. **Cloudflare**: Onze primaire partner voor netwerkdiensten en e-mailbeveiliging
2. **DataPacket**: Onze primaire leverancier voor serverinfrastructuur (exclusief gebruikmakend van Arista Networks en Cisco apparatuur)
3. **Backup Providers**: Onze backup providers Digital Ocean en Vultr zijn bovendien schriftelijk bevestigd als Sectie 889 compliant.

**De toezegging van Cloudflare**: Cloudflare stelt expliciet in hun Third Party Code of Conduct dat zij geen telecommunicatieapparatuur, videobewakingsproducten of diensten gebruiken van entiteiten die verboden zijn volgens Sectie 889.

**Overheidsgebruik**: Onze Sectie 889 naleving werd gevalideerd toen de **US Naval Academy** Forward Email selecteerde voor hun veilige e-mail forwarding behoeften, waarbij documentatie van onze federale nalevingsnormen werd vereist.

Voor volledige details over ons overheidsnalevingskader, inclusief bredere federale regelgeving, lees onze uitgebreide case study: [Federal Government Email Service Section 889 Compliant](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)


## Systeem- en technische details {#system-and-technical-details}

### Slaat u e-mails en hun inhoud op {#do-you-store-emails-and-their-contents}

Nee, wij schrijven niet naar schijf en slaan geen logs op – met uitzondering van [fouten](#do-you-store-error-logs) en [uitgaande SMTP](#do-you-support-sending-email-with-smtp) (zie ons [Privacybeleid](/privacy)).

Alles gebeurt in het geheugen en [onze broncode staat op GitHub](https://github.com/forwardemail).

### Hoe werkt uw e-mail forwarding systeem {#how-does-your-email-forwarding-system-work}

E-mail maakt gebruik van het [SMTP-protocol](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). Dit protocol bestaat uit commando’s die naar een server worden gestuurd (meestal draaiend op poort 25). Er is een initiële verbinding, daarna geeft de afzender aan van wie de mail is ("MAIL FROM"), gevolgd door waar het naartoe gaat ("RCPT TO"), en tenslotte de headers en de inhoud van de e-mail zelf ("DATA"). De flow van ons e-mail forwarding systeem wordt hieronder beschreven aan de hand van elk SMTP protocolcommando:

* Initiële verbinding (geen commando naam, bv. `telnet example.com 25`) - Dit is de initiële verbinding. We controleren afzenders die niet op onze [allowlist](#do-you-have-an-allowlist) staan tegen onze [denylist](#do-you-have-a-denylist). Ten slotte, als een afzender niet op onze allowlist staat, controleren we of deze [greylisted](#do-you-have-a-greylist) is.

* `HELO` - Dit geeft een begroeting aan om de FQDN, IP-adres of mail handler naam van de afzender te identificeren. Deze waarde kan worden gespoofd, dus vertrouwen wij niet op deze data en gebruiken we in plaats daarvan de reverse hostname lookup van het IP-adres van de verbinding.

* `MAIL FROM` - Dit geeft het enveloppe mail from adres van de e-mail aan. Als er een waarde wordt ingevoerd, moet dit een geldig RFC 5322 e-mailadres zijn. Lege waarden zijn toegestaan. We [controleren hier op backscatter](#how-do-you-protect-against-backscatter) en we controleren ook de MAIL FROM tegen onze [denylist](#do-you-have-a-denylist). We controleren ten slotte afzenders die niet op de allowlist staan op rate limiting (zie de sectie over [Rate Limiting](#do-you-have-rate-limiting) en [allowlist](#do-you-have-an-allowlist) voor meer informatie).

* `RCPT TO` - Dit geeft de ontvanger(s) van de e-mail aan. Dit moeten geldige RFC 5322 e-mailadressen zijn. We staan maximaal 50 enveloppe ontvangers per bericht toe (dit is anders dan de "To" header van een e-mail). We controleren hier ook op een geldig [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") adres om spoofing tegen te gaan met onze SRS domeinnaam.

* `DATA` - Dit is het kernonderdeel van onze service die een e-mail verwerkt. Zie de sectie [Hoe verwerkt u een e-mail voor forwarding](#how-do-you-process-an-email-for-forwarding) hieronder voor meer inzicht.
### Hoe verwerk je een e-mail voor doorsturen {#how-do-you-process-an-email-for-forwarding}

Deze sectie beschrijft ons proces met betrekking tot het SMTP-protocolcommando `DATA` in de sectie [Hoe werkt jullie e-mail doorstuur systeem](#how-does-your-email-forwarding-system-work) hierboven – het is hoe wij de headers, de inhoud, de beveiliging van een e-mail verwerken, bepalen waar deze afgeleverd moet worden, en hoe wij verbindingen afhandelen.

1. Als het bericht de maximale grootte van 50mb overschrijdt, wordt het geweigerd met een 552-foutcode.

2. Als het bericht geen "From" header bevatte, of als een van de waarden in de "From" header geen geldige RFC 5322 e-mailadressen waren, wordt het geweigerd met een 550-foutcode.

3. Als het bericht meer dan 25 "Received" headers had, werd vastgesteld dat het vastzat in een redirect-lus, en wordt het geweigerd met een 550-foutcode.

4. Met behulp van de vingerafdruk van de e-mail (zie de sectie over [Fingerprinting](#how-do-you-determine-an-email-fingerprint)), controleren we of er geprobeerd is het bericht langer dan 5 dagen opnieuw te verzenden (wat overeenkomt met het [standaardgedrag van postfix](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)), en zo ja, dan wordt het geweigerd met een 550-foutcode.

5. We slaan in het geheugen de resultaten op van het scannen van de e-mail met behulp van [Spam Scanner](https://spamscanner.net).

6. Als er willekeurige resultaten van Spam Scanner waren, wordt het geweigerd met een 554-foutcode. Willekeurige resultaten omvatten op het moment van schrijven alleen de GTUBE-test. Zie <https://spamassassin.apache.org/gtube/> voor meer inzicht.

7. We voegen de volgende headers toe aan het bericht voor debugging en misbruikpreventie:

   * `Received` - we voegen deze standaard Received-header toe met oorsprong IP en host, transmissietype, TLS-verbindinginformatie, datum/tijd en ontvanger.
   * `X-Original-To` - de oorspronkelijke ontvanger van het bericht:
     * Dit is nuttig om te bepalen waar een e-mail oorspronkelijk naartoe is afgeleverd (naast de "Received" header).
     * Dit wordt per ontvanger toegevoegd op het moment van IMAP en/of gemaskeerd doorsturen (om privacy te beschermen).
   * `X-Forward-Email-Website` - bevat een link naar onze website <https://forwardemail.net>
   * `X-Forward-Email-Version` - de huidige [SemVer](https://semver.org/) versie uit `package.json` van onze codebase.
   * `X-Forward-Email-Session-ID` - een sessie-ID waarde gebruikt voor debugdoeleinden (geldt alleen in niet-productieomgevingen).
   * `X-Forward-Email-Sender` - een door komma's gescheiden lijst met het originele envelope MAIL FROM-adres (als dit niet leeg was), de reverse PTR client FQDN (indien aanwezig), en het IP-adres van de afzender.
   * `X-Forward-Email-ID` - dit is alleen van toepassing op uitgaande SMTP en correleert met het e-mail-ID opgeslagen in Mijn Account → E-mails
   * `X-Report-Abuse` - met de waarde `abuse@forwardemail.net`.
   * `X-Report-Abuse-To` - met de waarde `abuse@forwardemail.net`.
   * `X-Complaints-To` - met de waarde `abuse@forwardemail.net`.

8. We controleren vervolgens het bericht op [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain), en [DMARC](https://en.wikipedia.org/wiki/DMARC).

   * Als het bericht DMARC niet doorstond en het domein een afwijzingsbeleid had (bijv. `p=reject` [was in het DMARC-beleid](https://wikipedia.org/wiki/DMARC)), wordt het geweigerd met een 550-foutcode. Meestal is een DMARC-beleid voor een domein te vinden in het `_dmarc` subdomein <strong class="notranslate">TXT</strong> record, (bijv. `dig _dmarc.example.com txt`).
   * Als het bericht SPF niet doorstond en het domein een hard fail beleid had (bijv. `-all` stond in het SPF-beleid in plaats van `~all` of helemaal geen beleid), wordt het geweigerd met een 550-foutcode. Meestal is een SPF-beleid voor een domein te vinden in het <strong class="notranslate">TXT</strong> record van het hoofddomein (bijv. `dig example.com txt`). Zie deze sectie voor meer informatie over [mail verzenden als met Gmail](#can-i-send-mail-as-in-gmail-with-this) met betrekking tot SPF.
9. Nu verwerken we de ontvangers van het bericht zoals verzameld uit het `RCPT TO`-commando in de sectie [Hoe werkt jouw e-mail doorstuur systeem](#how-does-your-email-forwarding-system-work) hierboven. Voor elke ontvanger voeren we de volgende handelingen uit:

   * We zoeken de <strong class="notranslate">TXT</strong>-records op van de domeinnaam (het deel na het `@`-symbool, bijvoorbeeld `example.com` als het e-mailadres `test@example.com` was). Bijvoorbeeld, als het domein `example.com` is, doen we een DNS-lookup zoals `dig example.com txt`.
   * We parseren alle <strong class="notranslate">TXT</strong>-records die beginnen met `forward-email=` (gratis plannen) of `forward-email-site-verification=` (betaalde plannen). Let op dat we beide parseren om e-mails te verwerken terwijl een gebruiker een upgrade of downgrade van plannen uitvoert.
   * Uit deze geparseerde <strong class="notranslate">TXT</strong>-records itereren we om de doorstuurconfiguratie te extraheren (zoals beschreven in de sectie [Hoe begin ik en stel ik e-mail doorsturen in](#how-do-i-get-started-and-set-up-email-forwarding) hierboven). Let op dat we slechts één `forward-email-site-verification=` waarde ondersteunen, en als er meer dan één wordt opgegeven, zal een 550-fout optreden en ontvangt de afzender een bounce voor deze ontvanger.
   * We itereren recursief over de geëxtraheerde doorstuurconfiguratie om globale doorsturing, regex-gebaseerde doorsturing en alle andere ondersteunde doorstuurconfiguraties te bepalen – die nu bekendstaan als onze "Doorstuuradressen".
   * Voor elk Doorstuuradres ondersteunen we één recursieve lookup (die deze reeks operaties opnieuw start voor het gegeven adres). Als een recursieve match wordt gevonden, wordt het ouderresultaat verwijderd uit Doorstuuradressen en worden de kinderen toegevoegd.
   * Doorstuuradressen worden geparsed op uniekheid (omdat we geen duplicaten naar één adres willen sturen of onnodige extra SMTP-clientverbindingen willen maken).
   * Voor elk Doorstuuradres zoeken we de domeinnaam op via onze API-endpoint `/v1/max-forwarded-addresses` (om te bepalen naar hoeveel adressen het domein e-mail mag doorsturen per alias, bijvoorbeeld standaard 10 – zie de sectie over [maximale limiet op doorsturen per alias](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)). Als deze limiet wordt overschreden, treedt een 550-fout op en ontvangt de afzender een bounce voor deze ontvanger.
   * We zoeken de instellingen van de originele ontvanger op via onze API-endpoint `/v1/settings`, die een lookup ondersteunt voor betaalde gebruikers (met een fallback voor gratis gebruikers). Dit retourneert een configuratieobject voor geavanceerde instellingen voor `port` (Nummer, bijvoorbeeld `25`), `has_adult_content_protection` (Boolean), `has_phishing_protection` (Boolean), `has_executable_protection` (Boolean), en `has_virus_protection` (Boolean).
   * Op basis van deze instellingen controleren we vervolgens de resultaten van de Spam Scanner en als er fouten optreden, wordt het bericht afgewezen met een 554-foutcode (bijvoorbeeld als `has_virus_protection` is ingeschakeld, controleren we de Spam Scanner-resultaten op virussen). Let op dat alle gebruikers van het gratis plan automatisch zijn ingeschreven voor controles op volwassen inhoud, phishing, uitvoerbare bestanden en virussen. Standaard zijn ook alle betaalde gebruikers ingeschreven, maar deze configuratie kan worden aangepast op de Instellingenpagina voor een domein in het Forward Email-dashboard).

10. Voor elk verwerkte Doorstuuradres van de ontvanger voeren we vervolgens de volgende handelingen uit:

    * Het adres wordt gecontroleerd tegen onze [denylist](#do-you-have-a-denylist), en als het op de lijst staat, treedt een 421-foutcode op (geeft aan de afzender aan om later opnieuw te proberen).
    * Als het adres een webhook is, zetten we een Boolean voor toekomstige operaties (zie hieronder – we groeperen vergelijkbare webhooks om één POST-verzoek te doen in plaats van meerdere voor aflevering).
    * Als het adres een e-mailadres is, parseren we de host voor toekomstige operaties (zie hieronder – we groeperen vergelijkbare hosts om één verbinding te maken in plaats van meerdere individuele verbindingen voor aflevering).
11. Als er geen ontvangers zijn en er zijn geen bounces, dan reageren we met een 550-foutmelding "Ongeldige ontvangers".

12. Als er ontvangers zijn, dan itereren we over hen (gegroepeerd per dezelfde host) en bezorgen we de e-mails. Zie de sectie [Hoe gaat u om met problemen bij e-mailbezorging](#how-do-you-handle-email-delivery-issues) hieronder voor meer inzicht.

    * Als er fouten optreden tijdens het verzenden van e-mails, slaan we deze in het geheugen op voor latere verwerking.
    * We nemen de laagste foutcode (indien aanwezig) van het verzenden van e-mails – en gebruiken die als de responscode op het `DATA`-commando. Dit betekent dat e-mails die niet zijn afgeleverd doorgaans opnieuw worden geprobeerd door de oorspronkelijke afzender, terwijl e-mails die al zijn afgeleverd niet opnieuw worden verzonden bij de volgende keer dat het bericht wordt verzonden (omdat we gebruikmaken van [Fingerprinting](#how-do-you-determine-an-email-fingerprint)).
    * Als er geen fouten zijn opgetreden, sturen we een 250 succesvolle SMTP-responsstatuscode.
    * Een bounce wordt bepaald als elke bezorgpoging die resulteert in een statuscode >= 500 (permanente fouten).

13. Als er geen bounces zijn opgetreden (permanente fouten), dan retourneren we een SMTP-responsstatuscode van de laagste foutcode van niet-permanente fouten (of een 250 succesvolle statuscode als die er niet waren).

14. Als er wel bounces zijn opgetreden, dan sturen we bounce-e-mails op de achtergrond nadat we de laagste van alle foutcodes aan de afzender hebben geretourneerd. Echter, als de laagste foutcode >= 500 is, sturen we geen bounce-e-mails. Dit komt omdat als we dat wel deden, afzenders een dubbele bounce-e-mail zouden ontvangen (bijvoorbeeld één van hun uitgaande MTA, zoals Gmail – en ook één van ons). Zie de sectie over [Hoe beschermt u tegen backscatter](#how-do-you-protect-against-backscatter) hieronder voor meer inzicht.

### Hoe gaat u om met problemen bij e-mailbezorging {#how-do-you-handle-email-delivery-issues}

Let op dat we een "Friendly-From" herschrijving uitvoeren op de e-mails als en alleen als het DMARC-beleid van de afzender niet slaagde EN er geen DKIM-handtekeningen waren die overeenkwamen met de "From"-header. Dit betekent dat we de "From"-header in het bericht aanpassen, "X-Original-From" instellen, en ook een "Reply-To" instellen als die nog niet was ingesteld. We verzegelen ook opnieuw de ARC-seal op het bericht nadat we deze headers hebben aangepast.

We gebruiken ook slimme parsing van foutmeldingen op elk niveau van onze stack – in onze code, DNS-verzoeken, Node.js-internals, HTTP-verzoeken (bijv. 408, 413 en 429 worden gemapt naar de SMTP-responscode 421 als de ontvanger een webhook is), en mailserver-responsen (bijv. responsen met "defer" of "slowdown" worden opnieuw geprobeerd als 421-fouten).

Onze logica is idiot-proof en zal ook opnieuw proberen bij SSL/TLS-fouten, verbindingsproblemen en meer. Het doel van idiot-proofing is om de afleverbaarheid aan alle ontvangers voor een doorstuurconfiguratie te maximaliseren.

Als de ontvanger een webhook is, dan staan we een time-out van 60 seconden toe voor het voltooien van het verzoek met maximaal 3 pogingen (dus 4 verzoeken in totaal voordat het faalt). Let op dat we foutcodes 408, 413 en 429 correct parseren en mappen naar een SMTP-responscode van 421.

Als de ontvanger een e-mailadres is, proberen we de e-mail te verzenden met opportunistische TLS (we proberen STARTTLS te gebruiken als dat beschikbaar is op de mailserver van de ontvanger). Als er een SSL/TLS-fout optreedt tijdens het verzenden van de e-mail, proberen we de e-mail te verzenden zonder TLS (zonder STARTTLS te gebruiken).

Als er DNS- of verbindingsfouten optreden, retourneren we een SMTP-responscode van 421 op het `DATA`-commando, anders als er >= 500 niveau fouten zijn, worden bounces verzonden.

Als we detecteren dat een e-mailserver waar we naar proberen te leveren een of meer van onze mail exchange IP-adressen heeft geblokkeerd (bijv. door welke technologie ze ook gebruiken om spammers uit te stellen), sturen we een SMTP-responscode van 421 zodat de afzender het bericht later opnieuw kan proberen (en we worden op de hoogte gesteld van het probleem zodat we het hopelijk kunnen oplossen vóór de volgende poging).

### Hoe gaat u om met het blokkeren van uw IP-adressen {#how-do-you-handle-your-ip-addresses-becoming-blocked}
We controleren routinematig alle grote DNS-denylijsten en als een van onze mail exchange ("MX") IP-adressen op een grote denylist staat, halen we deze indien mogelijk uit de relevante DNS A-record round robin totdat het probleem is opgelost.

Op het moment van schrijven staan we ook op verschillende DNS-toestemmingslijsten en nemen we het monitoren van denylijsten serieus. Als u problemen ziet voordat wij de kans hebben gehad ze op te lossen, neem dan schriftelijk contact met ons op via <support@forwardemail.net>.

Onze IP-adressen zijn openbaar beschikbaar, [zie deze sectie hieronder voor meer inzicht](#what-are-your-servers-ip-addresses).

### Wat zijn postmaster-adressen {#what-are-postmaster-addresses}

Om verkeerd gerichte bounces en het verzenden van afwezigheidsmeldingen naar niet-gemonitorde of niet-bestaande mailboxen te voorkomen, onderhouden we een lijst met mailer-daemon-achtige gebruikersnamen:

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
* [en elk no-reply adres](#what-are-no-reply-addresses)

Zie [RFC 5320 Sectie 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) voor meer inzicht in hoe dergelijke lijsten worden gebruikt om efficiënte e-mailsystemen te creëren.

### Wat zijn no-reply-adressen {#what-are-no-reply-addresses}

E-mailgebruikersnamen gelijk aan een van de volgende (ongevoelig voor hoofdletters) worden beschouwd als no-reply-adressen:

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

Deze lijst wordt onderhouden [als een open-source project op GitHub](https://github.com/forwardemail/reserved-email-addresses-list).

### Wat zijn de IP-adressen van uw server {#what-are-your-servers-ip-addresses}

We publiceren onze IP-adressen op <https://forwardemail.net/ips>.

### Heeft u een toestemmingslijst {#do-you-have-an-allowlist}

Ja, we hebben een [lijst van domeinnaamextensies](#what-domain-name-extensions-are-allowlisted-by-default) die standaard op de toestemmingslijst staan en een dynamische, gecachte en rollende toestemmingslijst gebaseerd op [strikte criteria](#what-is-your-allowlist-criteria).

Alle domeinen, e-mails en IP-adressen die door betalende klanten worden gebruikt, worden automatisch elk uur gecontroleerd tegen onze denylist – wat beheerders waarschuwt die indien nodig handmatig kunnen ingrijpen.

Daarnaast, als een van uw domeinen of e-mailadressen op een denylist staat (bijvoorbeeld vanwege het verzenden van spam, virussen of vanwege imitatie-aanvallen) – dan worden de domeinbeheerders (u) en onze teambeheerders onmiddellijk per e-mail op de hoogte gebracht. We raden sterk aan dat u [DMARC configureert](#how-do-i-set-up-dmarc-for-forward-email) om dit te voorkomen.

### Welke domeinnaamextensies staan standaard op de toestemmingslijst {#what-domain-name-extensions-are-allowlisted-by-default}

De volgende domeinnaamextensies worden standaard als toegestaan beschouwd (ongeacht of ze op de Umbrella Popularity List staan of niet):

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
Daarnaast zijn deze [brand- en corporate top-level domeinen](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) standaard toegestaan (bijv. `apple` voor `applecard.apple` voor Apple Card bankafschriften):

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
Vanaf 18 maart 2025 hebben we ook deze Franse overzeese gebieden aan deze lijst toegevoegd ([volgens dit GitHub-verzoek](https://github.com/forwardemail/forwardemail.net/issues/327)):

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

Vanaf 8 juli 2025 hebben we deze specifiek Europese landen toegevoegd:

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

In oktober 2025 hebben we ook <code class="notranslate">cz</code> (Tsjechië) toegevoegd vanwege de vraag.

We hebben specifiek `ru` en `ua` niet opgenomen vanwege hoge spamactiviteit.

### Wat zijn uw criteria voor de allowlist {#what-is-your-allowlist-criteria}

We hebben een statische lijst van [domeinnaamextensies die standaard op de allowlist staan](#what-domain-name-extensions-are-allowlisted-by-default) – en we onderhouden ook een dynamische, gecachte, rollende allowlist gebaseerd op de volgende strikte criteria:

* De rootdomein van de afzender moet een [domeinnaamextensie zijn die overeenkomt met de lijst die we aanbieden in ons gratis plan](#what-domain-name-extensions-can-be-used-for-free) (met de toevoeging van `biz` en `info`). We nemen ook gedeeltelijke overeenkomsten op met `edu`, `gov` en `mil`, zoals `xyz.gov.au` en `xyz.edu.au`.
* De rootdomein van de afzender moet binnen de top 100.000 unieke rootdomeinen staan volgens de resultaten van de [Umbrella Popularity List](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL").
* De rootdomein van de afzender moet binnen de top 50.000 resultaten staan van unieke rootdomeinen die in ten minste 4 van de afgelopen 7 dagen van UPL voorkomen (~50%+).
* De rootdomein van de afzender mag niet [gecategoriseerd](https://radar.cloudflare.com/categorization-feedback/) zijn als adult-content of malware door Cloudflare.
* De rootdomein van de afzender moet A- of MX-records ingesteld hebben.
* De rootdomein van de afzender moet A-record(s), MX-record(s), een DMARC-record met `p=reject` of `p=quarantine`, of een SPF-record met `-all` of `~all` qualifier hebben.

Als aan deze criteria wordt voldaan, wordt de rootdomein van de afzender 7 dagen gecachet. Let op dat onze geautomatiseerde taak dagelijks draait – dit is dus een rollende allowlist-cache die dagelijks wordt bijgewerkt.

Onze geautomatiseerde taak downloadt de voorgaande 7 dagen van UPL's in het geheugen, pakt ze uit en verwerkt ze vervolgens in het geheugen volgens bovenstaande strikte criteria.

Populaire domeinen op het moment van schrijven zoals Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify en meer – zijn natuurlijk inbegrepen.
Als u een afzender bent die niet op onze allowlist staat, wordt u de eerste keer dat uw FQDN rootdomein of IP-adres een e-mail verzendt, [rate limited](#do-you-have-rate-limiting) en [greylisted](#do-you-have-a-greylist). Let op dat dit standaardpraktijk is die als e-mailstandaard is aangenomen. De meeste e-mailserverclients zullen proberen opnieuw te verzenden als ze een rate limit- of greylist-fout ontvangen (bijv. een 421- of 4xx-foutstatuscode).

**Let op dat specifieke afzenders zoals `a@gmail.com`, `b@xyz.edu` en `c@gov.au` nog steeds kunnen worden [denylisted](#do-you-have-a-denylist)** (bijv. als we automatisch spam, phishing of malware van die afzenders detecteren).

### Welke domeinnaamextensies kunnen gratis worden gebruikt {#what-domain-name-extensions-can-be-used-for-free}

Vanaf 31 maart 2023 hebben we een nieuwe algemene spamregel ingevoerd om onze gebruikers en dienst te beschermen.

Deze nieuwe regel staat alleen de volgende domeinnaamextensies toe op ons gratis abonnement:

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
### Heeft u een greylist {#do-you-have-a-greylist}

Ja, we hanteren een zeer soepele [email greylisting](https://en.wikipedia.org/wiki/Greylisting_\(email\)) policy. Greylisting geldt alleen voor afzenders die niet op onze allowlist staan en blijft 30 dagen in onze cache.

Voor elke nieuwe afzender slaan we een sleutel op in onze Redis-database voor 30 dagen met een waarde die is ingesteld op de initiële aankomsttijd van hun eerste verzoek. Vervolgens weigeren we hun e-mail met een retry-statuscode 450 en laten we deze pas door zodra er 5 minuten zijn verstreken.

Als ze succesvol 5 minuten hebben gewacht vanaf deze initiële aankomsttijd, worden hun e-mails geaccepteerd en ontvangen ze deze 450-statuscode niet meer.

De sleutel bestaat uit ofwel het FQDN rootdomein of het IP-adres van de afzender. Dit betekent dat elk subdomein dat de greylist passeert ook zal slagen voor het rootdomein, en vice versa (dit is wat we bedoelen met een "zeer soepele" policy).

Bijvoorbeeld, als een e-mail afkomstig is van `test.example.com` voordat we een e-mail van `example.com` zien, dan moet elke e-mail van `test.example.com` en/of `example.com` 5 minuten wachten vanaf de initiële aankomsttijd van de verbinding. We laten zowel `test.example.com` als `example.com` niet elk hun eigen 5 minuten wachten (onze greylisting policy geldt op rootdomeinniveau).

Let op dat greylisting niet geldt voor afzenders op onze [allowlist](#do-you-have-an-allowlist) (bijv. Meta, Amazon, Netflix, Google, Microsoft op het moment van schrijven).

### Heeft u een denylist {#do-you-have-a-denylist}

Ja, we beheren onze eigen denylist en werken deze automatisch in realtime en handmatig bij op basis van gedetecteerde spam en kwaadaardige activiteiten.

We halen ook elk uur alle IP-adressen van de UCEPROTECT Level 1 denylist op via <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> en voeren deze in onze denylist in met een vervaltijd van 7 dagen.

Afzenders die op de denylist staan ontvangen een 421-foutcode (geeft aan dat de afzender het later opnieuw moet proberen) als ze [niet op de allowlist staan](#do-you-have-an-allowlist).

Door een 421-statuscode te gebruiken in plaats van een 554-statuscode, kunnen mogelijke false positives realtime worden verminderd en kan het bericht bij de volgende poging succesvol worden afgeleverd.

**Dit is anders dan bij andere maildiensten**, waar als je op een blocklist komt te staan, er een harde en permanente fout optreedt. Het is vaak moeilijk om afzenders te vragen berichten opnieuw te proberen (vooral van grote organisaties), en daarom geeft deze aanpak ongeveer 5 dagen vanaf de eerste e-mailpoging om door de afzender, ontvanger of ons te worden ingegrepen en het probleem op te lossen (door verwijdering van de denylist aan te vragen).

Alle verzoeken tot verwijdering van de denylist worden realtime door beheerders gemonitord (bijv. zodat terugkerende false positives permanent door beheerders op de allowlist kunnen worden gezet).

Verzoeken tot verwijdering van de denylist kunnen worden ingediend via <https://forwardemail.net/denylist>. Betaalde gebruikers krijgen hun verzoeken tot verwijdering direct verwerkt, terwijl niet-betaalde gebruikers moeten wachten tot beheerders hun verzoek verwerken.

Afzenders die worden gedetecteerd als het verzenden van spam of virusinhoud worden als volgt aan de denylist toegevoegd:

1. De [initiële berichtfingerprint](#how-do-you-determine-an-email-fingerprint) wordt greylisted bij detectie van spam of blocklist van een "vertrouwde" afzender (bijv. `gmail.com`, `microsoft.com`, `apple.com`).
   * Als de afzender op de allowlist stond, wordt het bericht 1 uur greylisted.
   * Als de afzender niet op de allowlist staat, wordt het bericht 6 uur greylisted.
2. We halen denylist-sleutels uit informatie van de afzender en het bericht, en voor elk van deze sleutels maken we (indien nog niet aanwezig) een teller aan, verhogen deze met 1 en cachen deze 24 uur.
   * Voor allowlisted afzenders:
     * Voeg een sleutel toe voor het envelope "MAIL FROM" e-mailadres als het een geslaagde SPF had of geen SPF, en het geen [postmaster gebruikersnaam](#what-are-postmaster-addresses) of [no-reply gebruikersnaam](#what-are-no-reply-addresses) was.
     * Als de "From" header op de allowlist stond, voeg dan een sleutel toe voor het "From" header e-mailadres als het een geslaagde SPF of geslaagde en uitgelijnde DKIM had.
     * Als de "From" header niet op de allowlist stond, voeg dan een sleutel toe voor het "From" header e-mailadres en het root geparseerde domeinnaam.
   * Voor niet-allowlisted afzenders:
     * Voeg een sleutel toe voor het envelope "MAIL FROM" e-mailadres als het een geslaagde SPF had.
     * Als de "From" header op de allowlist stond, voeg dan een sleutel toe voor het "From" header e-mailadres als het een geslaagde SPF of geslaagde en uitgelijnde DKIM had.
     * Als de "From" header niet op de allowlist stond, voeg dan een sleutel toe voor het "From" header e-mailadres en het root geparseerde domeinnaam.
     * Voeg een sleutel toe voor het externe IP-adres van de afzender.
     * Voeg een sleutel toe voor de client-resolved hostname via reverse lookup van het IP-adres van de afzender (indien aanwezig).
     * Voeg een sleutel toe voor het rootdomein van de client-resolved hostname (indien aanwezig en als dit verschilt van de client-resolved hostname).
3. Als de teller 5 bereikt voor een niet-allowlisted afzender en sleutel, dan zetten we de sleutel 30 dagen op de denylist en wordt er een e-mail naar ons abuse-team gestuurd. Deze aantallen kunnen veranderen en updates worden hier weergegeven terwijl we het misbruik monitoren.
4. Als de teller 10 bereikt voor een allowlisted afzender en sleutel, dan zetten we de sleutel 7 dagen op de denylist en wordt er een e-mail naar ons abuse-team gestuurd. Deze aantallen kunnen veranderen en updates worden hier weergegeven terwijl we het misbruik monitoren.
> **OPMERKING:** In de nabije toekomst zullen we reputatiemonitoring introduceren. Reputatiemonitoring zal in plaats daarvan berekenen wanneer een afzender op de denylist moet worden geplaatst op basis van een percentage drempelwaarde (in plaats van een rudimentaire teller zoals hierboven vermeld).

### Heeft u rate limiting {#do-you-have-rate-limiting}

Sender rate limiting gebeurt ofwel op basis van het rootdomein dat wordt geparseerd uit een reverse PTR lookup op het IP-adres van de afzender – of als dat geen resultaat oplevert, dan wordt gewoon het IP-adres van de afzender gebruikt.  Merk op dat we hieronder naar dit verwijzen als `Sender`.

Onze MX-servers hebben dagelijkse limieten voor binnenkomende mail die wordt ontvangen voor [versleutelde IMAP-opslag](/blog/docs/best-quantum-safe-encrypted-email-service):

* In plaats van rate limiting toe te passen op binnenkomende mail per individuele alias (bijv. `you@yourdomain.com`) – passen we rate limiting toe op de domeinnaam van de alias zelf (bijv. `yourdomain.com`). Dit voorkomt dat `Senders` de inboxen van alle aliassen binnen uw domein tegelijk overspoelen.
* We hebben algemene limieten die gelden voor alle `Senders` binnen onze dienst ongeacht de ontvanger:
  * `Senders` die wij als "vertrouwd" beschouwen als bron van waarheid (bijv. `gmail.com`, `microsoft.com`, `apple.com`) mogen maximaal 100 GB per dag verzenden.
  * `Senders` die [allowlisted](#do-you-have-an-allowlist) zijn mogen maximaal 10 GB per dag verzenden.
  * Alle andere `Senders` mogen maximaal 1 GB en/of 1000 berichten per dag verzenden.
* We hebben een specifieke limiet per `Sender` en `yourdomain.com` van 1 GB en/of 1000 berichten per dag.

De MX-servers beperken ook het aantal berichten dat wordt doorgestuurd naar een of meer ontvangers via rate limiting – maar dit geldt alleen voor `Senders` die niet op de [allowlist](#do-you-have-an-allowlist) staan:

* We staan maximaal 100 verbindingen per uur toe, per `Sender` opgelost FQDN rootdomein (of) `Sender` remote IP-adres (als er geen reverse PTR beschikbaar is), en per envelope ontvanger. We slaan de sleutel voor rate limiting op als een cryptografische hash in onze Redis-database.

* Als u e-mail via ons systeem verzendt, zorg er dan voor dat u een reverse PTR heeft ingesteld voor al uw IP-adressen (anders wordt elk uniek FQDN rootdomein of IP-adres waarvan u verzendt beperkt).

* Merk op dat als u verzendt via een populair systeem zoals Amazon SES, u niet wordt beperkt aangezien (op het moment van schrijven) Amazon SES op onze allowlist staat.

* Als u verzendt vanaf een domein zoals `test.abc.123.example.com`, dan wordt de rate limit opgelegd op `example.com`. Veel spammers gebruiken honderden subdomeinen om spamfilters te omzeilen die alleen unieke hostnamen beperken in plaats van unieke FQDN rootdomeinen.

* `Senders` die de rate limit overschrijden, worden geweigerd met een 421-fout.

Onze IMAP- en SMTP-servers beperken uw aliassen tot niet meer dan `60` gelijktijdige verbindingen tegelijk.

Onze MX-servers beperken [niet-allowlisted](#do-you-have-an-allowlist) afzenders tot niet meer dan 10 gelijktijdige verbindingen (met een cache-verval van 3 minuten voor de teller, wat overeenkomt met onze socket timeout van 3 minuten).

### Hoe beschermt u tegen backscatter {#how-do-you-protect-against-backscatter}

Verkeerd gerichte bounces of bounce spam (bekend als "[Backscatter](https://en.wikipedia.org/wiki/Backscatter_\(email\))") kunnen een negatieve reputatie veroorzaken voor het IP-adres van de afzender.

We nemen twee stappen om te beschermen tegen backscatter, die worden toegelicht in de volgende secties [Voorkom bounces van bekende MAIL FROM spammers](#prevent-bounces-from-known-mail-from-spammers) en [Voorkom onnodige bounces ter bescherming tegen backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter) hieronder.

### Voorkom bounces van bekende MAIL FROM spammers {#prevent-bounces-from-known-mail-from-spammers}

We halen de lijst van [Backscatter.org](https://www.backscatterer.org/) (aangedreven door [UCEPROTECT](https://www.uceprotect.net/)) op via <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> elk uur en voeren deze in onze Redis-database in (we vergelijken ook vooraf het verschil; voor het geval IP's zijn verwijderd die nog steeds moeten worden gehonoreerd).
Als de MAIL FROM leeg is OF gelijk is aan (ongevoelig voor hoofdletters) een van de [postmaster-adressen](#what-are-postmaster-addresses) (het gedeelte vóór de @ in een e-mailadres), dan controleren we of het IP-adres van de afzender overeenkomt met een uit deze lijst.

Als het IP-adres van de afzender op de lijst staat (en niet in onze [allowlist](#do-you-have-an-allowlist)), dan sturen we een 554-fout met het bericht `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`. We worden gewaarschuwd als een afzender zowel op de Backscatterer-lijst als in onze allowlist staat, zodat we het probleem indien nodig kunnen oplossen.

De in deze sectie beschreven technieken volgen de "SAFE MODE"-aanbeveling op <https://www.backscatterer.org/?target=usage> – waarbij we het IP-adres van de afzender alleen controleren als aan bepaalde voorwaarden is voldaan.

### Voorkom onnodige bounces ter bescherming tegen backscatter {#prevent-unnecessary-bounces-to-protect-against-backscatter}

Bounces zijn e-mails die aangeven dat het doorsturen van e-mail volledig is mislukt naar de ontvanger en de e-mail niet opnieuw zal worden geprobeerd.

Een veelvoorkomende reden om op de Backscatterer-lijst te komen is verkeerd gerichte bounces of bounce-spam, dus moeten we ons hier op een paar manieren tegen beschermen:

1. We sturen alleen wanneer >= 500 statuscode-fouten optreden (wanneer e-mails die geprobeerd zijn door te sturen zijn mislukt, bijvoorbeeld als Gmail reageert met een 500-niveau fout).

2. We sturen slechts één keer en slechts één keer (we gebruiken een berekende bounce fingerprint key en slaan deze op in de cache om het verzenden van duplicaten te voorkomen). De bounce fingerprint is een sleutel die de fingerprint van het bericht combineert met een hash van het bounce-adres en de foutcode). Zie de sectie over [Fingerprinting](#how-do-you-determine-an-email-fingerprint) voor meer inzicht in hoe de message fingerprint wordt berekend. Succesvol verzonden bounce fingerprints verlopen na 7 dagen in onze Redis-cache.

3. We sturen alleen wanneer de MAIL FROM en/of From niet leeg is en niet (ongevoelig voor hoofdletters) een [postmaster-gebruikersnaam](#what-are-postmaster-addresses) bevat (het gedeelte vóór de @ in een e-mailadres).

4. We sturen niet als het originele bericht een van de volgende headers bevatte (ongevoelig voor hoofdletters):

   * Header `auto-submitted` met een waarde die niet gelijk is aan `no`.
   * Header `x-auto-response-suppress` met een waarde van `dr`, `autoreply`, `auto-reply`, `auto_reply`, of `all`
   * Header `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond`, of `x-auto-respond` (ongeacht de waarde).
   * Header `precedence` met een waarde van `bulk`, `autoreply`, `auto-reply`, `auto_reply`, of `list`.

5. We sturen niet als het MAIL FROM- of From-e-mailadres eindigt op `+donotreply`, `-donotreply`, `+noreply`, of `-noreply`.

6. We sturen niet als het gebruikersnaamgedeelte van het From-e-mailadres `mdaemon` was en het een ongevoelige header `X-MDDSN-Message` had.

7. We sturen niet als er een ongevoelige `content-type` header was van `multipart/report`.

### Hoe bepaal je een e-mail fingerprint {#how-do-you-determine-an-email-fingerprint}

De fingerprint van een e-mail wordt gebruikt om de uniekheid van een e-mail te bepalen en om te voorkomen dat dubbele berichten worden afgeleverd en [dubbele bounces](#prevent-unnecessary-bounces-to-protect-against-backscatter) worden verzonden.

De fingerprint wordt berekend uit de volgende lijst:

* Door de client opgeloste FQDN-hostnaam of IP-adres
* `Message-ID` headerwaarde (indien aanwezig)
* `Date` headerwaarde (indien aanwezig)
* `From` headerwaarde (indien aanwezig)
* `To` headerwaarde (indien aanwezig)
* `Cc` headerwaarde (indien aanwezig)
* `Subject` headerwaarde (indien aanwezig)
* `Body` waarde (indien aanwezig)

### Kan ik e-mails doorsturen naar andere poorten dan 25 (bijv. als mijn ISP poort 25 heeft geblokkeerd) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Ja, sinds 5 mei 2020 hebben we deze functie toegevoegd. Op dit moment is de functie domeinspecifiek, in plaats van aliasspecifiek. Als u het aliasspecifiek nodig heeft, neem dan contact met ons op om uw wensen door te geven.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Verbeterde privacybescherming:
  </strong>
  <span>
    Als u een betaald abonnement heeft (met verbeterde privacybescherming), ga dan naar <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a>, klik op "Instellen" naast uw domein, en klik vervolgens op "Instellingen". Als u meer wilt weten over betaalde abonnementen, zie dan onze <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Prijzen</a>-pagina. Anders kunt u de onderstaande instructies blijven volgen.
  </span>
</div>
Als je het gratis abonnement gebruikt, voeg dan eenvoudig een nieuw DNS <strong class="notranslate">TXT</strong>-record toe zoals hieronder weergegeven, maar wijzig de poort van 25 naar de poort van jouw keuze.

Als voorbeeld, als ik wil dat alle e-mails die naar `example.com` gaan worden doorgestuurd naar de SMTP-poort 1337 van aliasontvangers in plaats van 25:

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
    Het meest voorkomende scenario voor het instellen van aangepaste poortdoorsturing is wanneer je alle e-mails die naar example.com gaan wilt doorsturen naar een andere poort bij example.com, anders dan de SMTP-standaardpoort 25. Om dit in te stellen, voeg je eenvoudig het volgende <strong class="notranslate">TXT</strong> catch-all record toe.
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

### Ondersteunt het het plus + symbool voor Gmail-aliasen {#does-it-support-the-plus--symbol-for-gmail-aliases}

Ja, absoluut.

### Ondersteunt het subdomeinen {#does-it-support-sub-domains}

Ja, absoluut. In plaats van "@", ".", of leeg als naam/host/alias te gebruiken, gebruik je gewoon de subdomeinnaam als waarde.

Als je `foo.example.com` e-mails wilt laten doorsturen, voer dan `foo` in als naam/host/alias waarde in je DNS-instellingen (voor zowel MX als <strong class="notranslate">TXT</strong> records).

### Worden de headers van mijn e-mails doorgestuurd {#does-this-forward-my-emails-headers}

Ja, absoluut.

### Is dit goed getest {#is-this-well-tested}

Ja, er zijn tests geschreven met [ava](https://github.com/avajs/ava) en er is ook code coverage.

### Worden SMTP-responsberichten en codes doorgegeven {#do-you-pass-along-smtp-response-messages-and-codes}

Ja, absoluut. Bijvoorbeeld, als je een e-mail stuurt naar `hello@example.com` en deze is geregistreerd om door te sturen naar `user@gmail.com`, dan wordt het SMTP-responsbericht en de code van de "gmail.com" SMTP-server teruggegeven in plaats van de proxyserver op "mx1.forwardemail.net" of "mx2.forwardemail.net".

### Hoe voorkom je spammers en zorg je voor een goede reputatie bij e-maildoorsturing {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Zie onze secties over [Hoe werkt jullie e-maildoorsturingssysteem](#how-does-your-email-forwarding-system-work), [Hoe gaan jullie om met problemen bij e-mailbezorging](#how-do-you-handle-email-delivery-issues), en [Hoe gaan jullie om met het blokkeren van jullie IP-adressen](#how-do-you-handle-your-ip-addresses-becoming-blocked) hierboven.

### Hoe voer je DNS-zoekopdrachten uit op domeinnamen {#how-do-you-perform-dns-lookups-on-domain-names}

We hebben een open-source softwareproject :tangerine: [Tangerine](https://github.com/forwardemail/tangerine) gemaakt en gebruiken dit voor DNS-zoekopdrachten. De standaard DNS-servers die worden gebruikt zijn `1.1.1.1` en `1.0.0.1`, en DNS-query's verlopen via [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") op applicatieniveau.

:tangerine: [Tangerine](https://github.com/tangerine) gebruikt standaard de privacygerichte consumenten-DNS-service van [CloudFlare][cloudflare-dns].


## Account en facturatie {#account-and-billing}

### Bieden jullie een geld-terug-garantie op betaalde abonnementen {#do-you-offer-a-money-back-guarantee-on-paid-plans}

Ja! Automatische terugbetalingen vinden plaats wanneer je je account binnen 30 dagen na de start van je abonnement upgrade, downgrade of annuleert. Dit geldt alleen voor nieuwe klanten.
### Als ik van abonnement wissel, verrekenen en vergoeden jullie dan het verschil {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

Wij verrekenen noch vergoeden het verschil wanneer je van abonnement wisselt. In plaats daarvan zetten we de resterende duur vanaf de vervaldatum van je huidige abonnement om naar de dichtstbijzijnde relatieve duur voor je nieuwe abonnement (afgerond naar beneden op maandbasis).

Let op dat als je binnen een periode van 30 dagen na het starten van een betaald abonnement upgrade of downgrade tussen betaalde abonnementen, wij automatisch het volledige bedrag van je huidige abonnement terugbetalen.

### Kan ik deze e-mail doorstuurservice gewoon gebruiken als een "fallback" of "fallover" MX-server {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

Nee, dat wordt niet aanbevolen, omdat je maar één mail exchange-server tegelijk kunt gebruiken. Fallbacks worden meestal nooit opnieuw geprobeerd vanwege prioriteitsfouten in de configuratie en mailservers die de MX-exchange prioriteitscontrole niet respecteren.

### Kan ik specifieke aliassen uitschakelen {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Belangrijk:
  </strong>
  <span>
    Als je een betaald abonnement hebt, moet je naar <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Aliassen <i class="fa fa-angle-right"></i> Alias bewerken <i class="fa fa-angle-right"></i> Vink het vakje "Actief" uit <i class="fa fa-angle-right"></i> Doorgaan.
  </span>
</div>

Ja, bewerk eenvoudig je DNS <strong class="notranslate">TXT</strong>-record en zet een, twee of drie uitroeptekens voor de alias (zie hieronder).

Let op dat je de ":"-mapping *moet* behouden, omdat dit nodig is als je dit ooit weer wilt inschakelen (en het wordt ook gebruikt voor importeren als je upgrade naar een van onze betaalde abonnementen).

**Voor stille weigering (voor de afzender lijkt het alsof het bericht succesvol is verzonden, maar het gaat eigenlijk nergens heen) (statuscode `250`):** Als je een alias voorziet van een "!" (één uitroepteken) dan zal het een succesvolle statuscode `250` teruggeven aan afzenders die naar dit adres proberen te sturen, maar de e-mails gaan zelf nergens heen (bijv. een blackhole of `/dev/null`).

**Voor zachte weigering (statuscode `421`):** Als je een alias voorziet van "!!" (twee uitroeptekens) dan zal het een zachte foutstatuscode `421` teruggeven aan afzenders die naar dit adres proberen te sturen, en de e-mails worden vaak tot 5 dagen opnieuw geprobeerd voordat ze worden geweigerd en teruggestuurd.

**Voor harde weigering (statuscode `550`):** Als je een alias voorziet van "!!!" (drie uitroeptekens) dan zal het een permanente foutstatuscode `550` teruggeven aan afzenders die naar dit adres proberen te sturen en de e-mails worden geweigerd en teruggestuurd.

Bijvoorbeeld, als ik wil dat alle e-mails die naar `alias@example.com` gaan niet meer worden doorgestuurd naar `user@gmail.com` en worden geweigerd en teruggestuurd (bijv. gebruik drie uitroeptekens):

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
    Je kunt ook het doorgestuurde ontvangersadres herschrijven naar simpelweg "nobody@forwardemail.net", wat het naar niemand zal routeren zoals in het onderstaande voorbeeld.
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
    Als je meer beveiliging wilt, kun je ook het gedeelte ":user@gmail.com" (of ":nobody@forwardemail.net") verwijderen, zodat alleen "!!!alias" overblijft zoals in het onderstaande voorbeeld.
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

Ja, absoluut. Geef gewoon meerdere ontvangers op in je <strong class="notranslate">TXT</strong> records.

Bijvoorbeeld, als ik een e-mail die naar `hello@example.com` gaat wil doorsturen naar `user+a@gmail.com` en `user+b@gmail.com`, dan zou mijn <strong class="notranslate">TXT</strong> record er zo uitzien:

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

Of je kunt ze op twee aparte regels specificeren, zoals dit:

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
      <td><code>forward-email=hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Het is aan jou!

### Kan ik meerdere globale catch-all ontvangers hebben {#can-i-have-multiple-global-catch-all-recipients}

Ja, dat kan. Geef gewoon meerdere globale catch-all ontvangers op in je <strong class="notranslate">TXT</strong> records.

Bijvoorbeeld, als ik wil dat elke e-mail die naar `*@example.com` gaat (de asterisk betekent dat het een wildcard oftewel catch-all is) wordt doorgestuurd naar `user+a@gmail.com` en `user+b@gmail.com`, dan zou mijn <strong class="notranslate">TXT</strong> record er zo uitzien:

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
      <td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Of je kunt ze op twee aparte regels specificeren, zoals dit:

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
      <td><code>forward-email=user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>
Het is aan jou!

### Is er een maximumlimiet voor het aantal e-mailadressen waarnaar ik per alias kan doorsturen {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

Ja, de standaardlimiet is 10. Dit betekent NIET dat je slechts 10 aliassen op je domeinnaam kunt hebben. Je kunt zoveel aliassen hebben als je wilt (een onbeperkt aantal). Het betekent dat je slechts één alias kunt doorsturen naar 10 unieke e-mailadressen. Je zou `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (van 1-10) kunnen hebben – en alle e-mails naar `hello@example.com` worden doorgestuurd naar `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (van 1-10).

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>
    Heb je meer dan 10 ontvangers per alias nodig? Stuur ons een e-mail en we verhogen graag de limiet van je account.
  </span>
</div>

### Kan ik e-mails recursief doorsturen {#can-i-recursively-forward-emails}

Ja, dat kan, maar je moet nog steeds de maximumlimiet respecteren. Als je `hello:linus@example.com` en `linus:user@gmail.com` hebt, dan worden e-mails naar `hello@example.com` doorgestuurd naar `linus@example.com` en `user@gmail.com`. Let op dat er een foutmelding wordt gegeven als je probeert e-mails recursief door te sturen boven de maximumlimiet.

### Kunnen mensen mijn e-maildoorsturing registreren of afmelden zonder mijn toestemming {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

We gebruiken MX- en <strong class="notranslate">TXT</strong>-recordverificatie, dus als je de respectievelijke MX- en <strong class="notranslate">TXT</strong>-records van deze dienst toevoegt, ben je geregistreerd. Als je ze verwijdert, ben je afgemeld. Jij hebt het eigendom van je domein en DNS-beheer, dus als iemand daar toegang toe heeft, is dat een probleem.

### Hoe is het gratis {#how-is-it-free}

Forward Email biedt een gratis laag via een combinatie van open-source ontwikkeling, efficiënte infrastructuur en optionele betaalde abonnementen die de dienst ondersteunen.

Onze gratis laag wordt ondersteund door:

1. **Open Source Ontwikkeling**: Onze codebasis is open source, wat bijdragen van de gemeenschap en transparante werking mogelijk maakt.

2. **Efficiënte Infrastructuur**: We hebben onze systemen geoptimaliseerd om e-maildoorsturing met minimale middelen te verwerken.

3. **Betaalde Premium Abonnementen**: Gebruikers die extra functies nodig hebben zoals SMTP-verzending, IMAP-ontvangst of verbeterde privacy-opties, nemen een betaald abonnement.

4. **Redelijke Gebruikslimieten**: De gratis laag heeft eerlijke gebruiksregels om misbruik te voorkomen.

> \[!NOTE]
> We zetten ons in om basis e-maildoorsturing gratis te houden terwijl we premium functies aanbieden voor gebruikers met meer geavanceerde behoeften.

> \[!TIP]
> Als je onze dienst waardeert, overweeg dan te upgraden naar een betaald abonnement om de voortdurende ontwikkeling en het onderhoud te ondersteunen.

### Wat is de maximale e-mailgrootte {#what-is-the-max-email-size-limit}

De standaardlimiet is 50MB, inclusief inhoud, headers en bijlagen. Let op dat diensten zoals Gmail en Outlook slechts een limiet van 25MB toestaan, en als je die limiet overschrijdt bij het verzenden naar adressen bij die providers, ontvang je een foutmelding.

Er wordt een fout met de juiste responscode teruggegeven als de bestandsgrootte limiet wordt overschreden.

### Slaan jullie logs van e-mails op {#do-you-store-logs-of-emails}

Nee, we schrijven niet naar schijf en slaan geen logs op – met uitzondering van [fouten](#do-you-store-error-logs) en [uitgaande SMTP](#do-you-support-sending-email-with-smtp) (zie ons [Privacybeleid](/privacy)).

Alles gebeurt in het geheugen en [onze broncode staat op GitHub](https://github.com/forwardemail).

### Slaan jullie foutlogs op {#do-you-store-error-logs}

**Ja. Je kunt foutlogs bekijken onder [Mijn Account → Logs](/my-account/logs) of [Mijn Account → Domeinen](/my-account/domains).**

Vanaf februari 2023 slaan we foutlogs op voor `4xx` en `5xx` SMTP-responscodes gedurende een periode van 7 dagen – deze bevatten de SMTP-fout, envelop en e-mailheaders (we slaan **niet** de e-mailinhoud of bijlagen op).
Foutlogboeken stellen je in staat om te controleren op ontbrekende belangrijke e-mails en om valse positieven van spam te verminderen voor [je domeinen](/my-account/domains). Ze zijn ook een geweldige bron voor het debuggen van problemen met [e-mail webhooks](#do-you-support-webhooks) (aangezien de foutlogboeken de webhook endpoint respons bevatten).

Foutlogboeken voor [rate limiting](#do-you-have-rate-limiting) en [greylisting](#do-you-have-a-greylist) zijn niet toegankelijk omdat de verbinding vroegtijdig wordt beëindigd (bijv. voordat `RCPT TO` en `MAIL FROM` commando's kunnen worden verzonden).

Zie ons [Privacybeleid](/privacy) voor meer inzicht.

### Leest u mijn e-mails {#do-you-read-my-emails}

Nee, absoluut niet. Zie ons [Privacybeleid](/privacy).

Veel andere e-mail doorstuurdiensten slaan je e-mail op en zouden deze mogelijk kunnen lezen. Er is geen reden waarom doorgestuurde e-mails op schijfopslag moeten worden opgeslagen – daarom hebben wij de eerste open-source oplossing ontworpen die alles in het geheugen doet.

Wij geloven dat je recht hebt op privacy en wij respecteren dat strikt. De code die op de server wordt ingezet is [open-source software op GitHub](https://github.com/forwardemail) voor transparantie en om vertrouwen op te bouwen.

### Kan ik "mail verzenden als" in Gmail met dit {#can-i-send-mail-as-in-gmail-with-this}

Ja! Sinds 2 oktober 2018 hebben we deze functie toegevoegd. Zie [Hoe mail te verzenden als met Gmail](#how-to-send-mail-as-using-gmail) hierboven!

Je moet ook het SPF-record voor Gmail instellen in je DNS-configuratie <strong class="notranslate">TXT</strong> record.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Belangrijk:
  </strong>
  <span>
    Als je Gmail gebruikt (bijv. Mail verzenden als) of G Suite, moet je <code>include:_spf.google.com</code> toevoegen aan je SPF <strong class="notranslate">TXT</strong> record, bijvoorbeeld:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

### Kan ik "mail verzenden als" in Outlook met dit {#can-i-send-mail-as-in-outlook-with-this}

Ja! Sinds 2 oktober 2018 hebben we deze functie toegevoegd. Bekijk simpelweg deze twee links van Microsoft hieronder:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

Je moet ook het SPF-record voor Outlook instellen in je DNS-configuratie <strong class="notranslate">TXT</strong> record.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Belangrijk:
  </strong>
  <span>
    Als je Microsoft Outlook of Live.com gebruikt, moet je <code>include:spf.protection.outlook.com</code> toevoegen aan je SPF <strong class="notranslate">TXT</strong> record, bijvoorbeeld:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

### Kan ik "mail verzenden als" in Apple Mail en iCloud Mail met dit {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

Als je een abonnee bent van iCloud+, kun je een aangepast domein gebruiken. [Onze dienst is ook compatibel met Apple Mail](#apple-mail).

Zie <https://support.apple.com/en-us/102540> voor meer informatie.

### Kan ik onbeperkt e-mails doorsturen met dit {#can-i-forward-unlimited-emails-with-this}

Ja, echter worden "relatief onbekende" afzenders beperkt tot 100 verbindingen per uur per hostnaam of IP. Zie de sectie over [Rate Limiting](#do-you-have-rate-limiting) en [Greylisting](#do-you-have-a-greylist) hierboven.

Met "relatief onbekend" bedoelen we afzenders die niet voorkomen in de [whitelist](#do-you-have-an-allowlist).

Als deze limiet wordt overschreden, sturen we een 421-responscode die de mailserver van de afzender vertelt om het later opnieuw te proberen.

### Biedt u onbeperkte domeinen voor één prijs aan {#do-you-offer-unlimited-domains-for-one-price}

Ja. Ongeacht welk abonnement je hebt, betaal je slechts één maandtarief – dat alle je domeinen dekt.
### Welke betaalmethoden accepteert u {#which-payment-methods-do-you-accept}

Forward Email accepteert de volgende eenmalige of maandelijkse/kwartaal-/jaarlijkse betaalmethoden:

1. **Creditcard/Debetkaart/Bankoverschrijvingen**: Visa, Mastercard, American Express, Discover, JCB, Diners Club, enz.
2. **PayPal**: Verbind uw PayPal-account voor gemakkelijke betalingen
3. **Cryptocurrency**: We accepteren betalingen via Stripe's stablecoin-betalingen op Ethereum-, Polygon- en Solana-netwerken

> \[!NOTE]
> We slaan beperkte betalingsinformatie op onze servers op, die alleen betalingsidentificaties en verwijzingen naar [Stripe](https://stripe.com/global) en [PayPal](https://www.paypal.com) transactie-, klant-, abonnement- en betalings-ID's bevatten.

> \[!TIP]
> Voor maximale privacy kunt u overwegen om betalingen met cryptocurrency te gebruiken.

Alle betalingen worden veilig verwerkt via Stripe of PayPal. Uw betalingsgegevens worden nooit op onze servers opgeslagen.


## Aanvullende bronnen {#additional-resources}

> \[!TIP]
> Onze onderstaande artikelen worden regelmatig bijgewerkt met nieuwe handleidingen, tips en technische informatie. Kom vaak terug voor de nieuwste inhoud.

* [Case Studies & Ontwikkelaarsdocumentatie](/blog/docs)
* [Bronnen](/resources)
* [Handleidingen](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/
