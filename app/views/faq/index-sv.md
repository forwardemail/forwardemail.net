# Vanliga frågor {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="Forward Email frequently asked questions" class="rounded-lg" />


## Innehållsförteckning {#table-of-contents}

* [Snabbstart](#quick-start)
* [Introduktion](#introduction)
  * [Vad är Forward Email](#what-is-forward-email)
  * [Vem använder Forward Email](#who-uses-forward-email)
  * [Vad är Forward Emails historia](#what-is-forward-emails-history)
  * [Hur snabbt är denna tjänst](#how-fast-is-this-service)
* [E-postklienter](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [eM Client](#em-client)
  * [Mobila enheter](#mobile-devices)
  * [Sendmail SMTP Relay-konfiguration](#sendmail-smtp-relay-configuration)
  * [Exim4 SMTP Relay-konfiguration](#exim4-smtp-relay-configuration)
  * [msmtp SMTP-klientkonfiguration](#msmtp-smtp-client-configuration)
  * [Kommandorads-e-postklienter](#command-line-email-clients)
  * [Windows e-postkonfiguration](#windows-email-configuration)
  * [Postfix SMTP Relay-konfiguration](#postfix-smtp-relay-configuration)
  * [Hur man skickar mail som med Gmail](#how-to-send-mail-as-using-gmail)
  * [Vad är den äldre gratisguiden för Skicka mail som med Gmail](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Avancerad Gmail-routingkonfiguration](#advanced-gmail-routing-configuration)
  * [Avancerad Outlook-routingkonfiguration](#advanced-outlook-routing-configuration)
* [Felsökning](#troubleshooting)
  * [Varför får jag inte mina testmail](#why-am-i-not-receiving-my-test-emails)
  * [Hur konfigurerar jag min e-postklient för att fungera med Forward Email](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Varför hamnar mina mail i Spam och Skräppost och hur kan jag kontrollera mitt domänrykte](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [Vad ska jag göra om jag får spam-mail](#what-should-i-do-if-i-receive-spam-emails)
  * [Varför visas mina testmail som jag skickar till mig själv i Gmail som "suspekta"](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Kan jag ta bort via forwardemail dot net i Gmail](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Datahantering](#data-management)
  * [Var finns era servrar](#where-are-your-servers-located)
  * [Hur exporterar och säkerhetskopierar jag min brevlåda](#how-do-i-export-and-backup-my-mailbox)
  * [Hur importerar och migrerar jag min befintliga brevlåda](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Hur använder jag min egen S3-kompatibla lagring för säkerhetskopior](#how-do-i-use-my-own-s3-compatible-storage-for-backups)
  * [Hur konverterar jag SQLite-säkerhetskopior till EML-filer](#how-do-i-convert-sqlite-backups-to-eml-files)
  * [Stöder ni självhosting](#do-you-support-self-hosting)
* [E-postkonfiguration](#email-configuration)
  * [Hur kommer jag igång och ställer in e-postvidarebefordran](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Kan jag använda flera MX-utbyten och servrar för avancerad vidarebefordran](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Hur ställer jag in ett autosvar för semester (out of office auto-responder)](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Hur ställer jag in SPF för Forward Email](#how-do-i-set-up-spf-for-forward-email)
  * [Hur ställer jag in DKIM för Forward Email](#how-do-i-set-up-dkim-for-forward-email)
  * [Hur ställer jag in DMARC för Forward Email](#how-do-i-set-up-dmarc-for-forward-email)
  * [Hur visar jag DMARC-rapporter](#how-do-i-view-dmarc-reports)
  * [Hur kopplar och konfigurerar jag mina kontakter](#how-do-i-connect-and-configure-my-contacts)
  * [Hur kopplar och konfigurerar jag mina kalendrar](#how-do-i-connect-and-configure-my-calendars)
  * [Hur lägger jag till fler kalendrar och hanterar befintliga kalendrar](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Hur kopplar och konfigurerar jag uppgifter och påminnelser](#how-do-i-connect-and-configure-tasks-and-reminders)
  * [Varför kan jag inte skapa uppgifter i macOS Påminnelser](#why-cant-i-create-tasks-in-macos-reminders)
  * [Hur ställer jag in Tasks.org på Android](#how-do-i-set-up-tasksorg-on-android)
  * [Hur ställer jag in SRS för Forward Email](#how-do-i-set-up-srs-for-forward-email)
  * [Hur ställer jag in MTA-STS för Forward Email](#how-do-i-set-up-mta-sts-for-forward-email)
  * [Hur lägger jag till en profilbild till min e-postadress](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Avancerade funktioner](#advanced-features)
  * [Stöder ni nyhetsbrev eller mailinglistor för marknadsföringsrelaterad e-post](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Stöder ni att skicka e-post med API](#do-you-support-sending-email-with-api)
  * [Stöder ni att ta emot e-post med IMAP](#do-you-support-receiving-email-with-imap)
  * [Stöder ni POP3](#do-you-support-pop3)
  * [Stöder ni kalendrar (CalDAV)](#do-you-support-calendars-caldav)
  * [Stöder ni uppgifter och påminnelser (CalDAV VTODO)](#do-you-support-tasks-and-reminders-caldav-vtodo)
  * [Stöder ni kontakter (CardDAV)](#do-you-support-contacts-carddav)
  * [Stöder ni att skicka e-post med SMTP](#do-you-support-sending-email-with-smtp)
  * [Stöder ni OpenPGP/MIME, end-to-end-kryptering ("E2EE") och Web Key Directory ("WKD")](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Stöder ni S/MIME-kryptering](#do-you-support-smime-encryption)
  * [Stöder ni Sieve e-postfiltrering](#do-you-support-sieve-email-filtering)
  * [Stöder ni MTA-STS](#do-you-support-mta-sts)
  * [Stöder ni passkeys och WebAuthn](#do-you-support-passkeys-and-webauthn)
  * [Stöder ni bästa praxis för e-post](#do-you-support-email-best-practices)
  * [Stöder ni bounce-webhooks](#do-you-support-bounce-webhooks)
  * [Stöder ni webhooks](#do-you-support-webhooks)
  * [Stöder ni reguljära uttryck eller regex](#do-you-support-regular-expressions-or-regex)
  * [Vilka är era gränser för utgående SMTP](#what-are-your-outbound-smtp-limits)
  * [Behöver jag godkännande för att aktivera SMTP](#do-i-need-approval-to-enable-smtp)
  * [Vilka är era SMTP-serverkonfigurationsinställningar](#what-are-your-smtp-server-configuration-settings)
  * [Vilka är era IMAP-serverkonfigurationsinställningar](#what-are-your-imap-server-configuration-settings)
  * [Vilka är era POP3-serverkonfigurationsinställningar](#what-are-your-pop3-server-configuration-settings)
  * [Hur ställer jag in e-postautoupptäckt för min domän](#how-do-i-set-up-email-autodiscovery-for-my-domain)
* [Säkerhet](#security-1)
  * [Avancerade tekniker för serverhärdning](#advanced-server-hardening-techniques)
  * [Har ni SOC 2- eller ISO 27001-certifieringar](#do-you-have-soc-2-or-iso-27001-certifications)
  * [Använder ni TLS-kryptering för e-postvidarebefordran](#do-you-use-tls-encryption-for-email-forwarding)
  * [Bevarar ni e-postautentiseringshuvuden](#do-you-preserve-email-authentication-headers)
  * [Bevarar ni ursprungliga e-posthuvuden och förhindrar spoofing](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Hur skyddar ni mot spam och missbruk](#how-do-you-protect-against-spam-and-abuse)
  * [Sparar ni e-postinnehåll på disk](#do-you-store-email-content-on-disk)
  * [Kan e-postinnehåll exponeras vid systemkrascher](#can-email-content-be-exposed-during-system-crashes)
  * [Vem har tillgång till er e-postinfrastruktur](#who-has-access-to-your-email-infrastructure)
  * [Vilka infrastrukturleverantörer använder ni](#what-infrastructure-providers-do-you-use)
  * [Erbjuder ni ett databehandlingsavtal (DPA)](#do-you-offer-a-data-processing-agreement-dpa)
  * [Hur hanterar ni dataintrångsmeddelanden](#how-do-you-handle-data-breach-notifications)
  * [Erbjuder ni en testmiljö](#do-you-offer-a-test-environment)
  * [Tillhandahåller ni övervaknings- och larmverktyg](#do-you-provide-monitoring-and-alerting-tools)
  * [Hur säkerställer ni hög tillgänglighet](#how-do-you-ensure-high-availability)
  * [Följer ni Section 889 i National Defense Authorization Act (NDAA)](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [System- och tekniska detaljer](#system-and-technical-details)
  * [Sparar ni e-post och dess innehåll](#do-you-store-emails-and-their-contents)
  * [Hur fungerar ert system för e-postvidarebefordran](#how-does-your-email-forwarding-system-work)
  * [Hur behandlar ni ett mail för vidarebefordran](#how-do-you-process-an-email-for-forwarding)
  * [Hur hanterar ni problem med e-postleverans](#how-do-you-handle-email-delivery-issues)
  * [Hur hanterar ni att era IP-adresser blir blockerade](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [Vad är postmaster-adresser](#what-are-postmaster-addresses)
  * [Vad är no-reply-adresser](#what-are-no-reply-addresses)
  * [Vilka är era servers IP-adresser](#what-are-your-servers-ip-addresses)
  * [Har ni en tillåtelselista](#do-you-have-an-allowlist)
  * [Vilka domännamnstillägg är tillåtna som standard](#what-domain-name-extensions-are-allowlisted-by-default)
  * [Vad är era kriterier för tillåtelselistan](#what-is-your-allowlist-criteria)
  * [Vilka domännamnstillägg kan användas gratis](#what-domain-name-extensions-can-be-used-for-free)
  * [Har ni en grålista](#do-you-have-a-greylist)
  * [Har ni en blocklista](#do-you-have-a-denylist)
  * [Har ni hastighetsbegränsning](#do-you-have-rate-limiting)
  * [Hur skyddar ni mot backscatter](#how-do-you-protect-against-backscatter)
  * [Förhindra studs från kända MAIL FROM-spammare](#prevent-bounces-from-known-mail-from-spammers)
  * [Förhindra onödiga studs för att skydda mot backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Hur bestämmer ni ett e-postfingeravtryck](#how-do-you-determine-an-email-fingerprint)
  * [Kan jag vidarebefordra mail till andra portar än 25 (t.ex. om min ISP har blockerat port 25)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Stöder det plus + symbolen för Gmail-alias](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Stöder det subdomäner](#does-it-support-sub-domains)
  * [Vidarebefordrar detta mina e-posthuvuden](#does-this-forward-my-emails-headers)
  * [Är detta väl testat](#is-this-well-tested)
  * [Vidarebefordrar ni SMTP-svarsmeldingar och koder](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Hur förhindrar ni spammare och säkerställer gott rykte för e-postvidarebefordran](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Hur utför ni DNS-uppslag på domännamn](#how-do-you-perform-dns-lookups-on-domain-names)
* [Konto och fakturering](#account-and-billing)
  * [Erbjuder ni pengarna tillbaka-garanti på betalda planer](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Om jag byter plan, gör ni proportionell återbetalning av skillnaden](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Kan jag bara använda denna e-postvidarebefordran som en "fallback" eller "fallover" MX-server](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Kan jag inaktivera specifika alias](#can-i-disable-specific-aliases)
  * [Kan jag vidarebefordra mail till flera mottagare](#can-i-forward-emails-to-multiple-recipients)
  * [Kan jag ha flera globala catch-all-mottagare](#can-i-have-multiple-global-catch-all-recipients)
  * [Finns det en maxgräns för antal e-postadresser jag kan vidarebefordra till per alias](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Kan jag vidarebefordra mail rekursivt](#can-i-recursively-forward-emails)
  * [Kan folk avregistrera eller registrera min e-postvidarebefordran utan mitt tillstånd](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Hur är det gratis](#how-is-it-free)
  * [Vad är maxstorleken för e-post](#what-is-the-max-email-size-limit)
  * [Sparar ni loggar över e-post](#do-you-store-logs-of-emails)
  * [Sparar ni fel-loggar](#do-you-store-error-logs)
  * [Läser ni mina mail](#do-you-read-my-emails)
  * [Kan jag "skicka mail som" i Gmail med detta](#can-i-send-mail-as-in-gmail-with-this)
  * [Kan jag "skicka mail som" i Outlook med detta](#can-i-send-mail-as-in-outlook-with-this)
  * [Kan jag "skicka mail som" i Apple Mail och iCloud Mail med detta](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Kan jag vidarebefordra obegränsat med mail med detta](#can-i-forward-unlimited-emails-with-this)
  * [Erbjuder ni obegränsade domäner för ett pris](#do-you-offer-unlimited-domains-for-one-price)
  * [Vilka betalningsmetoder accepterar ni](#which-payment-methods-do-you-accept)
* [Ytterligare resurser](#additional-resources)
## Kom igång snabbt {#quick-start}

För att komma igång med Forward Email:

1. **Skapa ett konto** på [forwardemail.net/register](https://forwardemail.net/register)

2. **Lägg till och verifiera din domän** under [Mitt konto → Domäner](/my-account/domains)

3. **Lägg till och konfigurera e-postalias/mailboxar** under [Mitt konto → Domäner](/my-account/domains) → Aliaser

4. **Testa din installation** genom att skicka ett e-postmeddelande till ett av dina nya alias

> \[!TIP]
> DNS-ändringar kan ta upp till 24-48 timmar att spridas globalt, även om de ofta träder i kraft mycket snabbare.

> \[!IMPORTANT]
> För förbättrad leveranssäkerhet rekommenderar vi att du ställer in [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) och [DMARC](#how-do-i-set-up-dmarc-for-forward-email)-poster.


## Introduktion {#introduction}

### Vad är Forward Email {#what-is-forward-email}

> \[!NOTE]
> Forward Email är perfekt för privatpersoner, småföretag och utvecklare som vill ha professionella e-postadresser utan kostnaden och underhållet av en fullständig e-posthostinglösning.

Forward Email är en **fullfjädrad e-postleverantör** och **e-posthostingleverantör för egna domännamn**.

Det är den enda kostnadsfria och öppen källkod-tjänsten som låter dig använda e-postadresser med egen domän utan komplexiteten att sätta upp och underhålla en egen e-postserver.

Vår tjänst vidarebefordrar e-post som skickas till din egen domän till ditt befintliga e-postkonto – och du kan till och med använda oss som din dedikerade e-posthostingleverantör.

Viktiga funktioner i Forward Email:

* **E-post med egen domän**: Använd professionella e-postadresser med ditt eget domännamn
* **Gratisnivå**: Grundläggande e-postvidarebefordran utan kostnad
* **Förbättrad integritet**: Vi läser inte dina e-postmeddelanden eller säljer dina data
* **Öppen källkod**: Vår hela kodbas finns tillgänglig på GitHub
* **SMTP-, IMAP- och POP3-stöd**: Fullständiga möjligheter att skicka och ta emot e-post
* **End-to-End-kryptering**: Stöd för OpenPGP/MIME
* **Anpassade Catch-All-alias**: Skapa obegränsat med e-postalias

Du kan jämföra oss med 56+ andra e-postleverantörer på [vår sida för e-postjämförelse](/blog/best-email-service).

> \[!TIP]
> Läs mer om Forward Email genom att läsa vårt kostnadsfria [Tekniska Whitepaper](/technical-whitepaper.pdf)

### Vem använder Forward Email {#who-uses-forward-email}

Vi tillhandahåller e-posthosting och e-postvidarebefordran till över 500 000 domäner och dessa framstående användare:

| Kund                                    | Fallstudie                                                                                              |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| U.S. Naval Academy                       | [:page_facing_up: Fallstudie](/blog/docs/federal-government-email-service-section-889-compliant)         |
| Canonical                                | [:page_facing_up: Fallstudie](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Netflix Games                            |                                                                                                          |
| The Linux Foundation                     | [:page_facing_up: Fallstudie](/blog/docs/linux-foundation-email-enterprise-case-study)                   |
| The PHP Foundation                       |                                                                                                          |
| Fox News Radio                           |                                                                                                          |
| Disney Ad Sales                          |                                                                                                          |
| jQuery                                   | [:page_facing_up: Fallstudie](/blog/docs/linux-foundation-email-enterprise-case-study)                   |
| LineageOS                                |                                                                                                          |
| Ubuntu                                   | [:page_facing_up: Fallstudie](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Kubuntu                                  | [:page_facing_up: Fallstudie](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Lubuntu                                  | [:page_facing_up: Fallstudie](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| The University of Cambridge              | [:page_facing_up: Fallstudie](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| The University of Maryland               | [:page_facing_up: Fallstudie](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| The University of Washington             | [:page_facing_up: Fallstudie](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Tufts University                         | [:page_facing_up: Fallstudie](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Swarthmore College                       | [:page_facing_up: Fallstudie](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Government of South Australia            |                                                                                                          |
| Government of Dominican Republic         |                                                                                                          |
| Fly<span>.</span>io                      |                                                                                                          |
| RCD Hotels                               |                                                                                                          |
| Isaac Z. Schlueter (npm)                 | [:page_facing_up: Fallstudie](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |                                                                                                          |
### Vad är Forward Emails historia {#what-is-forward-emails-history}

Du kan lära dig mer om Forward Email på [vår Om-sida](/about).

### Hur snabbt är denna tjänst {#how-fast-is-this-service}

> \[!NOTE]
> Vårt system är designat för snabbhet och tillförlitlighet, med flera redundanta servrar för att säkerställa att dina mejl levereras snabbt.

Forward Email levererar meddelanden med minimal fördröjning, vanligtvis inom sekunder efter mottagandet.

Prestandamått:

* **Genomsnittlig leveranstid**: Mindre än 5-10 sekunder från mottagande till vidarebefordran ([se vår Time to Inbox "TTI"-övervakningssida](/tti))
* **Drifttid**: 99,9 %+ tillgänglighet
* **Global infrastruktur**: Servrar strategiskt placerade för optimal routing
* **Automatisk skalning**: Vårt system skalar under perioder med hög e-posttrafik

Vi arbetar i realtid, till skillnad från andra leverantörer som förlitar sig på fördröjda köer.

Vi skriver inte till disk eller lagrar loggar – med [undantag för fel](#do-you-store-error-logs) och [utgående SMTP](#do-you-support-sending-email-with-smtp) (se vår [Integritetspolicy](/privacy)).

Allt görs i minnet och [vår källkod finns på GitHub](https://github.com/forwardemail).


## E-postklienter {#email-clients}

### Thunderbird {#thunderbird}

1. Skapa en ny alias och generera ett lösenord i din Forward Email-instrumentpanel
2. Öppna Thunderbird och gå till **Redigera → Kontoinställningar → Kontohandlingar → Lägg till e-postkonto**
3. Ange ditt namn, Forward Email-adress och lösenord
4. Klicka på **Konfigurera manuellt** och ange:
   * Inkommande: IMAP, `imap.forwardemail.net`, port 993, SSL/TLS
   * Utgående: SMTP, `smtp.forwardemail.net`, port 465, SSL/TLS (rekommenderas; port 587 med STARTTLS stöds också)
5. Klicka på **Klar**

### Microsoft Outlook {#microsoft-outlook}

1. Skapa en ny alias och generera ett lösenord i din Forward Email-instrumentpanel
2. Gå till **Arkiv → Lägg till konto**
3. Ange din Forward Email-adress och klicka på **Anslut**
4. Välj **Avancerade alternativ** och markera **Låt mig konfigurera mitt konto manuellt**
5. Välj **IMAP** och ange:
   * Inkommande: `imap.forwardemail.net`, port 993, SSL
   * Utgående: `smtp.forwardemail.net`, port 465, SSL/TLS (rekommenderas; port 587 med STARTTLS stöds också)
   * Användarnamn: Din fullständiga e-postadress
   * Lösenord: Ditt genererade lösenord
6. Klicka på **Anslut**

### Apple Mail {#apple-mail}

1. Skapa en ny alias och generera ett lösenord i din Forward Email-instrumentpanel
2. Gå till **Mail → Inställningar → Konton → +**
3. Välj **Annat e-postkonto**
4. Ange ditt namn, Forward Email-adress och lösenord
5. För serverinställningar, ange:
   * Inkommande: `imap.forwardemail.net`
   * Utgående: `smtp.forwardemail.net`
   * Användarnamn: Din fullständiga e-postadress
   * Lösenord: Ditt genererade lösenord
6. Klicka på **Logga in**

### eM Client {#em-client}

1. Skapa en ny alias och generera ett lösenord i din Forward Email-instrumentpanel
2. Öppna eM Client och gå till **Meny → Konton → + Lägg till konto**
3. Klicka på **E-post** och välj sedan **Annat**
4. Ange din Forward Email-adress och klicka på **Nästa**
5. Ange följande serverinställningar:
   * **Inkommande server**: `imap.forwardemail.net`
   * **Utgående server**: `smtp.forwardemail.net`
6. Ange din fullständiga e-postadress som **Användarnamn** och ditt genererade lösenord som **Lösenord** för både inkommande och utgående servrar.
7. eM Client testar anslutningen. När den lyckas, klicka på **Nästa**.
8. Ange ditt namn och välj ett kontonamn.
9. Klicka på **Slutför**.

### Mobila enheter {#mobile-devices}

För iOS:

1. Gå till **Inställningar → Mail → Konton → Lägg till konto → Annat**
2. Tryck på **Lägg till e-postkonto** och ange dina uppgifter
3. För serverinställningar, använd samma IMAP- och SMTP-inställningar som ovan

För Android:

1. Gå till **Inställningar → Konton → Lägg till konto → Personligt (IMAP)**
2. Ange din Forward Email-adress och lösenord
3. För serverinställningar, använd samma IMAP- och SMTP-inställningar som ovan

### Sendmail SMTP Relay-konfiguration {#sendmail-smtp-relay-configuration}

Du kan konfigurera Sendmail för att vidarebefordra e-post via Forward Emails SMTP-servrar. Detta är en vanlig konfiguration för äldre system eller applikationer som förlitar sig på Sendmail.
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Beräknad installationstid:</strong>
  <span>Mindre än 20 minuter</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktigt:
  </strong>
  <span>
    Detta kräver en betald plan med SMTP-åtkomst aktiverad.
  </span>
</div>

#### Konfiguration {#configuration}

1. Redigera din `sendmail.mc`-fil, vanligtvis placerad på `/etc/mail/sendmail.mc`:

   ```bash
   sudo nano /etc/mail/sendmail.mc
   ```

2. Lägg till följande rader för att definiera smart host och autentisering:

   ```
   define(`SMART_HOST', `smtp.forwardemail.net')dnl
   define(`RELAY_MAILER_ARGS', `TCP $h 465')dnl
   define(`confAUTH_MECHANISMS', `EXTERNAL GSSAPI DIGEST-MD5 CRAM-MD5 LOGIN PLAIN')dnl
   FEATURE(`authinfo',`hash -o /etc/mail/authinfo.db')dnl
   ```

3. Skapa autentiseringsfilen `/etc/mail/authinfo`:

   ```bash
   sudo nano /etc/mail/authinfo
   ```

4. Lägg till dina Forward Email-uppgifter i `authinfo`-filen:

   ```
   AuthInfo:smtp.forwardemail.net "U:your-alias@yourdomain.com" "P:your-generated-password" "M:PLAIN"
   ```

5. Generera autentiseringsdatabasen och säkra filerna:

   ```bash
   sudo makemap hash /etc/mail/authinfo < /etc/mail/authinfo
   sudo chmod 600 /etc/mail/authinfo /etc/mail/authinfo.db
   ```

6. Bygg om Sendmail-konfigurationen och starta om tjänsten:

   ```bash
   sudo make -C /etc/mail
   sudo systemctl restart sendmail
   ```

#### Testning {#testing}

Skicka ett testmail för att verifiera konfigurationen:

```bash
echo "Test email from Sendmail" | mail -s "Sendmail Test" recipient@example.com
```

### Exim4 SMTP Relay-konfiguration {#exim4-smtp-relay-configuration}

Exim4 är en populär MTA på Debian-baserade system. Du kan konfigurera den att använda Forward Email som smarthost.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Beräknad installationstid:</strong>
  <span>Mindre än 15 minuter</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktigt:
  </strong>
  <span>
    Detta kräver en betald plan med SMTP-åtkomst aktiverad.
  </span>
</div>

#### Konfiguration {#configuration-1}

1. Kör Exim4-konfigurationsverktyget:

   ```bash
   sudo dpkg-reconfigure exim4-config
   ```

2. Välj följande alternativ:
   * **Allmän typ av mailkonfiguration:** mail skickas via smarthost; tas emot via SMTP eller fetchmail
   * **Systemets mailnamn:** your.hostname
   * **IP-adresser att lyssna på för inkommande SMTP-anslutningar:** 127.0.0.1 ; ::1
   * **Andra destinationer för vilka mail accepteras:** (lämna tomt)
   * **Domäner att vidarebefordra mail för:** (lämna tomt)
   * **IP-adress eller värdnamn för utgående smarthost:** smtp.forwardemail.net::465
   * **Dölj lokalt mailnamn i utgående mail?** Nej
   * **Håll antalet DNS-förfrågningar minimalt (Dial-on-Demand)?** Nej
   * **Leveransmetod för lokalt mail:** Mbox-format i /var/mail/
   * **Dela upp konfigurationen i små filer?** Nej

3. Redigera filen `passwd.client` för att lägga till dina uppgifter:

   ```bash
   sudo nano /etc/exim4/passwd.client
   ```

4. Lägg till följande rad:

   ```
   smtp.forwardemail.net:your-alias@yourdomain.com:your-generated-password
   ```

5. Uppdatera konfigurationen och starta om Exim4:

   ```bash
   sudo update-exim4.conf
   sudo systemctl restart exim4
   ```

#### Testning {#testing-1}

Skicka ett testmail:

```bash
echo "Test from Exim4" | mail -s "Exim4 Test" recipient@example.com
```

### msmtp SMTP-klientkonfiguration {#msmtp-smtp-client-configuration}

msmtp är en lättviktig SMTP-klient som är användbar för att skicka e-post från skript eller kommandoradsapplikationer.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Beräknad installationstid:</strong>
  <span>Mindre än 10 minuter</span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktigt:
  </strong>
  <span>
    Detta kräver en betald plan med SMTP-åtkomst aktiverad.
  </span>
</div>

#### Konfiguration {#configuration-2}

1. Skapa eller redigera msmtp-konfigurationsfilen på `~/.msmtprc`:

   ```bash
   nano ~/.msmtprc
   ```

2. Lägg till följande konfiguration:

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

3. Sätt rätt behörigheter för konfigurationsfilen:

   ```bash
   chmod 600 ~/.msmtprc
   ```

#### Testning {#testing-2}

Skicka ett testmail:

```bash
echo "This is a test email from msmtp" | msmtp -a default recipient@example.com
```

### Kommandorads-e-postklienter {#command-line-email-clients}

Populära kommandorads-e-postklienter som [Mutt](https://gitlab.com/muttmua/mutt), [NeoMutt](https://neomutt.org) och [Alpine](https://alpine.x10.mx/alpine/release/) kan konfigureras för att använda Forward Emails SMTP-servrar för att skicka mail. Konfigurationen liknar `msmtp`-inställningen, där du anger SMTP-serveruppgifter och dina inloggningsuppgifter i respektive konfigurationsfiler (`.muttrc`, `.neomuttrc` eller `.pinerc`).

### Windows e-postkonfiguration {#windows-email-configuration}

För Windows-användare kan du konfigurera populära e-postklienter som **Microsoft Outlook** och **eM Client** med IMAP- och SMTP-inställningarna som tillhandahålls i ditt Forward Email-konto. För kommandorads- eller skriptanvändning kan du använda PowerShells `Send-MailMessage` cmdlet (även om den anses vara föråldrad) eller ett lättviktigt SMTP-reläverktyg som [E-MailRelay](https://github.com/graeme-walker/emailrelay).

### Postfix SMTP-reläkonfiguration {#postfix-smtp-relay-configuration}

Du kan konfigurera Postfix för att reläa e-post via Forward Emails SMTP-servrar. Detta är användbart för serverapplikationer som behöver skicka e-post.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Beräknad installationstid:</strong>
  <span>Mindre än 15 minuter</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktigt:
  </strong>
  <span>
    Detta kräver en betald plan med SMTP-åtkomst aktiverad.
  </span>
</div>

#### Installation {#installation}

1. Installera Postfix på din server:

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. Välj "Internet Site" när du uppmanas att välja konfigurationstyp under installationen.

#### Konfiguration {#configuration-3}

1. Redigera huvudkonfigurationsfilen för Postfix:

```bash
sudo nano /etc/postfix/main.cf
```

2. Lägg till eller ändra dessa inställningar:

```
# SMTP-reläkonfiguration
relayhost = [smtp.forwardemail.net]:465
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Skapa SASL-lösenordsfilen:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Lägg till dina Forward Email-uppgifter:

```
[smtp.forwardemail.net]:465 your-alias@yourdomain.com:your-generated-password
```

5. Säkra och hasha lösenordsfilen:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Starta om Postfix:

```bash
sudo systemctl restart postfix
```

#### Testning {#testing-3}

Testa din konfiguration genom att skicka ett testmail:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

### Hur man skickar mail som med Gmail {#how-to-send-mail-as-using-gmail}
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Uppskattad installationstid:</strong>
  <span>Mindre än 10 minuter</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Kom igång:
  </strong>
  <span>
    Om du har följt instruktionerna ovan under <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Hur kommer jag igång och ställer in e-post vidarebefordran</a>, kan du fortsätta läsa nedan.
  </span>
</div>

<div id="send-mail-as-content">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktigt:
  </strong>
  <span>
    Vänligen säkerställ att du har läst våra <a href="/terms" class="alert-link" target="_blank">Villkor</a>, <a href="/privacy" class="alert-link" target="_blank">Integritetspolicy</a>, och <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Outbound SMTP-begränsningar</a> &ndash; din användning betraktas som bekräftelse och godkännande.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktigt:
  </strong>
  <span>
    Om du är utvecklare, hänvisa till vår <a class="alert-link" href="/email-api#outbound-emails" target="_blank">e-post API-dokumentation</a>.
  </span>
</div>

1. Gå till <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Inställningar <i class="fa fa-angle-right"></i> Outbound SMTP-konfiguration och följ installationsinstruktionerna

2. Skapa ett nytt alias för din domän under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Aliaser (t.ex. <code><hello@example.com></code>)

3. Klicka på <strong class="text-success"><i class="fa fa-key"></i> Generera lösenord</strong> bredvid det nyligen skapade aliaset. Kopiera till ditt urklipp och spara det genererade lösenordet säkert som visas på skärmen.

4. Gå till [Gmail](https://gmail.com) och under [Inställningar <i class="fa fa-angle-right"></i> Konton och import <i class="fa fa-angle-right"></i> Skicka e-post som](https://mail.google.com/mail/u/0/#settings/accounts), klicka på "Lägg till en annan e-postadress"

5. När du uppmanas att ange "Namn", skriv det namn som du vill att din e-post ska visas som "Från" (t.ex. "Linus Torvalds").

6. När du uppmanas att ange "E-postadress", skriv in hela e-postadressen för ett alias du skapade under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Aliaser (t.ex. <code><hello@example.com></code>)

7. Avmarkera "Behandla som ett alias"

8. Klicka på "Nästa steg" för att fortsätta

9. När du uppmanas att ange "SMTP-server", skriv <code>smtp.forwardemail.net</code> och ändra porten till <code>465</code>

10. När du uppmanas att ange "Användarnamn", skriv in hela e-postadressen för ett alias du skapade under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Aliaser (t.ex. <code><hello@example.com></code>)

11. När du uppmanas att ange "Lösenord", klistra in lösenordet från <strong class="text-success"><i class="fa fa-key"></i> Generera lösenord</strong> i steg 3 ovan

12. Välj radioknappen för "Säkrad anslutning med SSL"

13. Klicka på "Lägg till konto" för att fortsätta

14. Öppna en ny flik till [Gmail](https://gmail.com) och vänta på att din verifieringsmail ska komma (du kommer att få en verifieringskod som bekräftar att du är ägare till den e-postadress du försöker "Skicka e-post som")

15. När den anländer, kopiera och klistra in verifieringskoden vid prompten du fick i föregående steg
16. När du har gjort det, gå tillbaka till e-posten och klicka på länken för att "bekräfta förfrågan". Du kommer troligen behöva göra detta steg och föregående steg för att e-posten ska vara korrekt konfigurerad.

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Grattis!
    </strong>
    <span>
      Du har framgångsrikt slutfört alla steg.
    </span>
  </div>
</div>

</div>

### Vad är den legacy-fria guiden för Send Mail As med Gmail {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Viktigt:</strong> Denna legacy-fria guide är föråldrad från och med maj 2023 eftersom <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">vi nu stödjer utgående SMTP</a>. Om du använder guiden nedan, så <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">kommer detta göra att din utgående e-post</a> säger "<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>" i Gmail.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Beräknad installationstid:</strong>
  <span>Mindre än 10 minuter</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Kom igång:
  </strong>
  <span>
    Om du har följt instruktionerna ovan under <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Hur kommer jag igång och ställer in e-post vidarebefordran</a>, kan du fortsätta läsa nedan.
  </span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="How to Send Mail As using Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. Du behöver ha [Gmails tvåfaktorsautentisering][gmail-2fa] aktiverad för att detta ska fungera. Besök <https://www.google.com/landing/2step/> om du inte har den aktiverad.

2. När tvåfaktorsautentisering är aktiverad (eller om du redan hade den aktiverad), besök <https://myaccount.google.com/apppasswords>.

3. När du uppmanas att "Välj app och enhet du vill generera app-lösenord för":
   * Välj "Mail" under rullgardinsmenyn för "Välj app"
   * Välj "Annat" under rullgardinsmenyn för "Välj enhet"
   * När du uppmanas att skriva text, ange din anpassade domäns e-postadress som du vidarebefordrar från (t.ex. <code><hello@example.com></code> - detta hjälper dig att hålla koll om du använder tjänsten för flera konton)

4. Kopiera lösenordet som automatiskt genereras till ditt urklipp
   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Viktigt:
     </strong>
     <span>
       Om du använder G Suite, besök din adminpanel <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Appar <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Inställningar för Gmail <i class="fa fa-angle-right"></i> Inställningar</a> och se till att kryssa i "Tillåt användare att skicka e-post via en extern SMTP-server...". Det kan ta några minuter innan denna ändring aktiveras, så vänligen vänta en stund.
     </span>
   </div>

5. Gå till [Gmail](https://gmail.com) och under [Inställningar <i class="fa fa-angle-right"></i> Konton och import <i class="fa fa-angle-right"></i> Skicka e-post som](https://mail.google.com/mail/u/0/#settings/accounts), klicka på "Lägg till en annan e-postadress"

6. När du uppmanas att ange "Namn", skriv det namn du vill att din e-post ska visas som "Från" (t.ex. "Linus Torvalds")

7. När du uppmanas att ange "E-postadress", skriv in e-postadressen med den anpassade domän du använde ovan (t.ex. <code><hello@example.com></code>)
8. Avmarkera "Behandla som alias"

9. Klicka på "Nästa steg" för att fortsätta

10. När du uppmanas att ange "SMTP-server", skriv <code>smtp.gmail.com</code> och låt porten vara <code>587</code>

11. När du uppmanas att ange "Användarnamn", skriv delen av din Gmail-adress utan <span>gmail.com</span>-delen (t.ex. bara "user" om min e-post är <span><user@gmail.com></span>)
    <div class="alert my-3 alert-primary">
      <i class="fa fa-info-circle font-weight-bold"></i>
      <strong class="font-weight-bold">
        Viktigt:
      </strong>
      <span>
        Om "Användarnamn"-delen fylls i automatiskt, måste <u><strong>du ändra detta</strong></u> till användarnamnsdelen av din Gmail-adress istället.
      </span>
    </div>

12. När du uppmanas att ange "Lösenord", klistra in från ditt urklipp det lösenord du genererade i steg 2 ovan

13. Lämna radioknappen markerad för "Säker anslutning med TLS"

14. Klicka på "Lägg till konto" för att fortsätta

15. Öppna en ny flik till [Gmail](https://gmail.com) och vänta på att ditt verifieringsmail ska komma (du kommer att få en verifieringskod som bekräftar att du är ägare till den e-postadress du försöker "Skicka som")

16. När det kommer, kopiera och klistra in verifieringskoden i prompten du fick i föregående steg

17. När du gjort det, gå tillbaka till e-posten och klicka på länken för att "bekräfta förfrågan". Du kommer troligen behöva göra detta steg och föregående steg för att e-posten ska konfigureras korrekt.

</div>

### Avancerad Gmail-routningskonfiguration {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Beräknad installationstid:</strong>
  <span>15-30 minuter</span>
</div>

Om du vill ställa in avancerad routning i Gmail så att alias som inte matchar en brevlåda vidarebefordras till Forward Emails mailservrar, följ dessa steg:

1. Logga in på din Google Admin-konsol på [admin.google.com](https://admin.google.com)
2. Gå till **Appar → Google Workspace → Gmail → Routing**
3. Klicka på **Lägg till rutt** och konfigurera följande inställningar:

**Inställningar för enskild mottagare:**

* Välj "Ändra kuvertmottagare" och ange din primära Gmail-adress
* Markera "Lägg till X-Gm-Original-To-header med ursprunglig mottagare"

**Mönster för kuvertmottagare:**

* Lägg till ett mönster som matchar alla icke-existerande brevlådor (t.ex. `.*@dindomän.com`)

**E-postserverinställningar:**

* Välj "Routa till värd" och ange `mx1.forwardemail.net` som primär server
* Lägg till `mx2.forwardemail.net` som backupserver
* Sätt port till 25
* Välj "Kräv TLS" för säkerhet

4. Klicka på **Spara** för att skapa rutten

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktigt:
  </strong>
  <span>
    Denna konfiguration fungerar endast för Google Workspace-konton med egna domäner, inte för vanliga Gmail-konton.
  </span>
</div>

### Avancerad Outlook-routningskonfiguration {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Beräknad installationstid:</strong>
  <span>15-30 minuter</span>
</div>

För Microsoft 365 (tidigare Office 365)-användare som vill ställa in avancerad routning så att alias som inte matchar en brevlåda vidarebefordras till Forward Emails mailservrar:

1. Logga in på Microsoft 365 administrationscenter på [admin.microsoft.com](https://admin.microsoft.com)
2. Gå till **Exchange → E-postflöde → Regler**
3. Klicka på **Lägg till en regel** och välj **Skapa en ny regel**
4. Namnge din regel (t.ex. "Vidarebefordra icke-existerande brevlådor till Forward Email")
5. Under **Tillämpa denna regel om**, välj:
   * "Mottagaradressen matchar..."
   * Ange ett mönster som matchar alla adresser på din domän (t.ex. `*@dindomän.com`)
6. Under **Gör följande**, välj:
   * "Omdirigera meddelandet till..."
   * Välj "Följande e-postserver"
   * Ange `mx1.forwardemail.net` och port 25
   * Lägg till `mx2.forwardemail.net` som backupserver
7. Under **Undantag om**, välj:
   * "Mottagaren är..."
   * Lägg till alla dina befintliga brevlådor som inte ska vidarebefordras
8. Sätt regelns prioritet så att den körs efter andra e-postflödesregler
9. Klicka på **Spara** för att aktivera regeln
## Felsökning {#troubleshooting}

### Varför får jag inte mina testmail {#why-am-i-not-receiving-my-test-emails}

Om du skickar ett testmail till dig själv kan det hända att det inte visas i din inkorg eftersom det har samma "Message-ID"-huvud.

Detta är ett välkänt problem och påverkar även tjänster som Gmail.  <a href="https://support.google.com/a/answer/1703601">Här är det officiella svaret från Gmail angående detta problem</a>.

Om du fortsätter att ha problem är det troligtvis ett problem med DNS-propagation. Du behöver vänta lite längre och försöka igen (eller prova att sätta ett lägre TTL-värde på dina <strong class="notranslate">TXT</strong>-poster).

**Fortfarande problem?**  Vänligen <a href="/help">kontakta oss</a> så kan vi hjälpa till att undersöka problemet och hitta en snabb lösning.

### Hur konfigurerar jag min e-postklient för att fungera med Forward Email {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
  Vår tjänst fungerar med populära e-postklienter såsom:
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
  Ditt användarnamn är din alias e-postadress och lösenordet kommer från <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> ("Normalt lösenord").
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tips:
  </strong>
  <span>Om du använder Thunderbird, se till att "Connection security" är inställt på "SSL/TLS" och autentiseringsmetoden är inställd på "Normal password".</span>
</div>

| Typ  |         Värdnamn        |         Protokoll       |                                            Portar                                           |
| :--: | :---------------------: | :---------------------: | :----------------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` |  SSL/TLS **Föredras**   |                                      `993` och `2993`                                      |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **Rekommenderas** | `465` och `2465` för SSL/TLS (rekommenderas) eller `587`, `2587`, `2525` och `25` för STARTTLS |

### Varför hamnar mina mail i Spam och Skräppost och hur kan jag kontrollera mitt domänrykte {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}
Denna sektion vägleder dig om din utgående e-post använder våra SMTP-servrar (t.ex. `smtp.forwardemail.net`) (eller vidarebefordras via `mx1.forwardemail.net` eller `mx2.forwardemail.net`) och den hamnar i mottagarens mapp för skräppost eller skräp.

Vi övervakar rutinmässigt våra [IP-adresser](#what-are-your-servers-ip-addresses) mot [alla ansedda DNS-blocklistor](#how-do-you-handle-your-ip-addresses-becoming-blocked), **därför är det mest sannolikt ett domänryktesrelaterat problem**.

E-post kan hamna i skräppostmappar av flera anledningar:

1. **Saknad autentisering**: Ställ in [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) och [DMARC](#how-do-i-set-up-dmarc-for-forward-email)-poster.

2. **Domänrykte**: Nya domäner har ofta neutralt rykte tills de etablerar en sändningshistorik.

3. **Innehållstriggers**: Vissa ord eller fraser kan trigga skräppostfilter.

4. **Sändningsmönster**: Plötsliga ökningar i e-postvolym kan se misstänkta ut.

Du kan försöka använda ett eller flera av dessa verktyg för att kontrollera din domäns rykte och kategorisering:

#### Verktyg för kontroll av rykte och blocklistor {#reputation-and-blocklist-check-tools}

| Verktygsnamn                               | URL                                                          | Typ                    |
| ------------------------------------------- | ------------------------------------------------------------ | ---------------------- |
| Cloudflare Domain Categorization Feedback   | <https://radar.cloudflare.com/domains/feedback>              | Kategorisering         |
| Spamhaus IP and Domain Reputation Checker   | <https://check.spamhaus.org/>                                | DNSBL                  |
| Cisco Talos IP and Domain Reputation Center | <https://talosintelligence.com/reputation_center>            | Rykte                  |
| Barracuda IP and Domain Reputation Lookup   | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL                  |
| MX Toolbox Blacklist Check                  | <https://mxtoolbox.com/blacklists.aspx>                      | Svartlista             |
| Google Postmaster Tools                     | <https://www.gmail.com/postmaster/>                          | Rykte                  |
| Yahoo Sender Hub                            | <https://senders.yahooinc.com/>                              | Rykte                  |
| MultiRBL.valli.org Blacklist Check          | <https://multirbl.valli.org/lookup/>                         | DNSBL                  |
| Sender Score                                | <https://senderscore.org/act/blocklist-remover/>             | Rykte                  |
| Invaluement                                 | <https://www.invaluement.com/lookup/>                        | DNSBL                  |
| SURBL                                       | <https://www.surbl.org/>                                     | DNSBL                  |
| SpamCop                                     | <https://www.spamcop.net/bl.shtml>                           | DNSBL                  |
| UCEPROTECT's Levels 1, 2, and 3             | <https://www.uceprotect.net/en/rblcheck.php>                 | DNSBL                  |
| UCEPROTECT's backscatterer.org              | <https://www.backscatterer.org/>                             | Backscatter-skydd      |
| UCEPROTECT's whitelisted.org                | <https://www.whitelisted.org/> (requires a fee)              | DNSWL                  |

#### Formulär för borttagning av IP-adress per leverantör {#ip-removal-request-forms-by-provider}

Om din IP-adress har blockerats av en specifik e-postleverantör, använd lämpligt borttagningsformulär eller kontakt nedan:

| Leverantör                             | Borttagningsformulär / Kontakt                                                                                     | Noteringar                                   |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Google/Gmail                           | <https://support.google.com/mail/contact/bulk_send_new>                                                    | Kontaktformulär för massändare               |
| Microsoft (Outlook/Office 365/Hotmail) | <https://sender.office.com>                                                                                | Office 365 IP-borttagningsportal             |
| Yahoo/AOL/Verizon                      | <https://senders.yahooinc.com/>                                                                            | Yahoo Sender Hub                             |
| Apple/iCloud                           | <https://ipcheck.proofpoint.com/>                                                                          | Apple använder Proofpoint för IP-rykte       |
| Proofpoint                             | <https://ipcheck.proofpoint.com/>                                                                          | Proofpoint IP-kontroll och borttagning      |
| Barracuda Networks                     | <https://www.barracudacentral.org/lookups/lookup-reputation>                                               | Barracuda ryktekontroll och borttagning     |
| Cloudmark                              | <https://csi.cloudmark.com/en/reset/>                                                                      | Cloudmark CSI återställningsbegäran          |
| GoDaddy/SecureServer                   | <https://unblock.secureserver.net>                                                                         | GoDaddy IP-borttagningsformulär              |
| Comcast/Xfinity                        | <https://spa.xfinity.com/report>                                                                           | Comcast IP-borttagningsbegäran                |
| Charter/Spectrum                       | <https://www.spectrum.net/support/internet/understanding-email-error-codes>                                | Kontakta Spectrum support för borttagning    |
| AT&T                                   | `abuse_rbl@abuse-att.net`                                                                                  | E-post för borttagningsbegäran               |
| Cox Communications                     | `unblock.request@cox.net`                                                                                  | E-post för borttagningsbegäran               |
| CenturyLink/Lumen                      | `abuse@centurylink.com`                                                                                    | Använder Cloudfilter                          |
| Windstream                             | `abuse@windstream.net`                                                                                     | E-post för borttagningsbegäran               |
| t-online.de (Tyskland)                  | `tobr@rx.t-online.de`                                                                                      | E-post för borttagningsbegäran               |
| Orange France                          | <https://postmaster.orange.fr/>                                                                            | Använd kontaktformulär eller e-post `abuse@orange.fr` |
| GMX                                    | <https://postmaster.gmx.net/en/contact>                                                                    | GMX postmaster kontaktformulär                |
| Mail.ru                                | <https://postmaster.mail.ru/>                                                                              | Mail.ru postmasterportal                      |
| Yandex                                 | <https://postmaster.yandex.ru/>                                                                            | Yandex postmasterportal                       |
| QQ Mail (Tencent)                      | <https://open.mail.qq.com/>                                                                                | QQ Mail whitelist-ansökan (kinesiska)        |
| Netease (163.com)                      | <https://mail.163.com/postmaster/>                                                                         | Netease postmasterportal                      |
| Alibaba/Aliyun/HiChina                 | <https://www.alibabacloud.com/help/en/alibaba-mail/>                                                       | Kontakt via Alibaba Cloud-konsol              |
| Amazon SES                             | <https://docs.aws.amazon.com/ses/latest/dg/faqs-dnsbls.html>                                               | AWS SES-konsol > Borttagning från svartlista |
| SendGrid                               | <https://support.sendgrid.com/>                                                                            | Kontakta SendGrid support                      |
| Mimecast                               | <https://community.mimecast.com/>                                                                          | Använder tredjeparts RBLs - kontakta specifik RBL |
| Fastmail                               | <https://www.fastmail.com/support/>                                                                        | Kontakta Fastmail support                      |
| Zoho                                   | <https://help.zoho.com/portal/en/kb/campaigns/faqs/campaign-review/articles/how-do-i-delist-my-ip-address> | Kontakta Zoho support                         |
| ProtonMail                             | <https://proton.me/support/contact>                                                                        | Kontakta Proton support                       |
| Tutanota                               | <https://tutanota.com/support>                                                                             | Kontakta Tutanota support                     |
| Hushmail                               | <https://www.hushmail.com/support/>                                                                        | Kontakta Hushmail support                     |
| Mailbox.org                            | <https://mailbox.org/en/support>                                                                           | Kontakta Mailbox.org support                  |
| Posteo                                 | <https://posteo.de/en/site/contact>                                                                        | Kontakta Posteo support                       |
| DuckDuckGo Email                       | <https://duckduckgo.com/email/support>                                                                     | Kontakta DuckDuckGo support                   |
| Sonic.net                              | <https://www.sonic.com/support>                                                                            | Kontakta Sonic support                        |
| Telus                                  | <https://www.telus.com/en/support>                                                                         | Kontakta Telus support                        |
| Vodafone Germany                       | <https://www.vodafone.de/hilfe/>                                                                           | Kontakta Vodafone support                     |
| Xtra (Spark NZ)                        | <https://www.spark.co.nz/help/>                                                                            | Kontakta Spark NZ support                     |
| UOL/BOL (Brasilien)                    | <https://ajuda.uol.com.br/>                                                                                | Kontakta UOL support (portugisiska)           |
| Libero (Italien)                       | <https://aiuto.libero.it/>                                                                                 | Kontakta Libero support (italienska)           |
| Telenet (Belgien)                      | <https://www2.telenet.be/en/support/>                                                                      | Kontakta Telenet support                      |
| Facebook/WhatsApp                      | <https://www.facebook.com/business/help>                                                                   | Kontakta Facebook business support            |
| LinkedIn                               | <https://www.linkedin.com/help/linkedin>                                                                   | Kontakta LinkedIn support                     |
| Groups.io                              | <https://groups.io/helpcenter>                                                                             | Kontakta Groups.io support                    |
| Earthlink/Vade Secure                  | <https://sendertool.vadesecure.com/en/>                                                                    | Vade Secure sändarverktyg                     |
| Cloudflare Email Security              | <https://www.cloudflare.com/products/zero-trust/email-security/>                                           | Kontakta Cloudflare support                   |
| Hornetsecurity/Expurgate               | <https://www.hornetsecurity.com/>                                                                          | Kontakta Hornetsecurity support               |
| SpamExperts/Antispamcloud              | <https://www.spamexperts.com/>                                                                             | Kontakta via hosting-leverantör               |
| Mail2World                             | <https://www.mail2world.com/support/>                                                                      | Kontakta Mail2World support                   |
> \[!TIP]
> Börja med en låg volym av högkvalitativa e-postmeddelanden för att bygga upp ett positivt rykte innan du skickar i större volymer.

> \[!IMPORTANT]
> Om din domän finns på en svartlista har varje svartlista sin egen borttagningsprocess. Kontrollera deras webbplatser för instruktioner.

> \[!TIP]
> Om du behöver ytterligare hjälp eller upptäcker att vi felaktigt listas som skräppost av en viss e-postleverantör, vänligen <a href="/help">kontakta oss</a>.

### Vad ska jag göra om jag får skräppost {#what-should-i-do-if-i-receive-spam-emails}

Du bör avanmäla dig från e-postlistan (om möjligt) och blockera avsändaren.

Vänligen rapportera inte meddelandet som skräppost, utan vidarebefordra det istället till vårt manuellt kuraterade och integritetsfokuserade system för missbruksprevention.

**E-postadressen att vidarebefordra skräppost till är:** <abuse@forwardemail.net>

### Varför visas mina testmail som jag skickar till mig själv i Gmail som "misstänkta" {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Om du ser detta felmeddelande i Gmail när du skickar ett test till dig själv, eller när en person du mejlar med din alias ser ett e-postmeddelande från dig för första gången, så **var vänlig och oroa dig inte** – detta är en inbyggd säkerhetsfunktion i Gmail.

Du kan helt enkelt klicka på "Ser säkert ut". Till exempel, om du skickar ett testmeddelande med funktionen skicka e-post som (till någon annan), så kommer de inte att se detta meddelande.

Om de däremot ser detta meddelande beror det på att de vanligtvis är vana vid att se dina e-postmeddelanden komma från <john@gmail.com> istället för <john@customdomain.com> (bara ett exempel). Gmail varnar användarna för att säkerställa att allt är säkert, och det finns ingen lösning för att ta bort detta.

### Kan jag ta bort via forwardemail dot net i Gmail {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

Detta ämne är relaterat till ett [välkänt problem i Gmail där extra information visas bredvid avsändarens namn](https://support.google.com/mail/answer/1311182).

Från och med maj 2023 stödjer vi att skicka e-post med SMTP som ett tillägg för alla betalande användare – vilket innebär att du kan ta bort <span class="notranslate">via forwardemail dot net</span> i Gmail.

Observera att denna FAQ är specifik för de som använder funktionen [Hur man skickar e-post som med Gmail](#how-to-send-mail-as-using-gmail).

Se avsnittet om [Stöder ni att skicka e-post med SMTP](#do-you-support-sending-email-with-smtp) för konfigurationsinstruktioner.


## Datahantering {#data-management}

### Var finns era servrar {#where-are-your-servers-located}

> \[!TIP]
> Vi kan snart komma att tillkännage vår EU-datacenterplats som hostas under [forwardemail.eu](https://forwardemail.eu). Prenumerera på diskussionen på <https://github.com/orgs/forwardemail/discussions/336> för uppdateringar.

Våra servrar är främst placerade i Denver, Colorado – se <https://forwardemail.net/ips> för vår kompletta lista över IP-adresser.

Du kan läsa om våra underleverantörer på våra sidor för [GDPR](/gdpr), [DPA](/dpa) och [Integritet](/privacy).

### Hur exporterar och säkerhetskopierar jag min brevlåda {#how-do-i-export-and-backup-my-mailbox}

När som helst kan du exportera dina brevlådor i [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox) eller krypterade [SQLite](https://en.wikipedia.org/wiki/SQLite) format.

Gå till <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Aliaser <i class="fa fa-angle-right"></i> Ladda ner säkerhetskopia och välj din föredragna exportformattyp.

Du kommer att få en länk för nedladdning av exporten via e-post när den är klar.

Observera att denna nedladdningslänk för exporten upphör att gälla efter 4 timmar av säkerhetsskäl.

Om du behöver inspektera dina exporterade EML- eller Mbox-format kan dessa open-source-verktyg vara användbara:

| Namn            | Format | Plattform    | GitHub URL                                          |
| --------------- | :----: | ----------- | --------------------------------------------------- |
| MBox Viewer     |  Mbox  | Windows     | <https://github.com/eneam/mboxviewer>               |
| mbox-web-viewer |  Mbox  | Alla plattformar | <https://github.com/PHMRanger/mbox-web-viewer>      |
| EmlReader       |   EML  | Windows     | <https://github.com/ayamadori/EmlReader>            |
| Email viewer    |   EML  | VSCode      | <https://github.com/joelharkes/vscode_email_viewer> |
| eml-reader      |   EML  | Alla plattformar | <https://github.com/s0ph1e/eml-reader>              |
Dessutom, om du behöver konvertera en Mbox-fil till en EML-fil, kan du använda <https://github.com/noelmartinon/mboxzilla>.

### Hur importerar och migrerar jag min befintliga brevlåda {#how-do-i-import-and-migrate-my-existing-mailbox}

Du kan enkelt importera din e-post till Forward Email (t.ex. med [Thunderbird](https://www.thunderbird.net)) med instruktionerna nedan:

<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktigt:
  </strong>
  <span>
    Du måste följa alla följande steg för att importera din befintliga e-post.
  </span>
</div>

1. Exportera din e-post från din nuvarande e-postleverantör:

   | E-postleverantör | Exportformat                                  | Exportinstruktioner                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
   | -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Gmail          | MBOX                                           | <https://takeout.google.com/settings/takeout/custom/gmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
   | Outlook        | PST                                            | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Tips:</strong> <span>Om du använder Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">PST exportformat</a>), kan du helt enkelt följa instruktionerna under "Other" nedan. Vi har dock tillhandahållit länkar nedan för att konvertera PST till MBOX/EML-format baserat på ditt operativsystem:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba för Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst för Windows cygwin</a> – (t.ex. <code>readpst -u -o $OUT_DIR $IN_DIR</code> där du ersätter <code>$OUT_DIR</code> och <code>$IN_DIR</code> med sökvägarna för utdata- respektive indatakatalog).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst för Ubuntu/Linux</a> – (t.ex. <code>sudo apt-get install readpst</code> och sedan <code>readpst -u -o $OUT_DIR $IN_DIR</code>, där du ersätter <code>$OUT_DIR</code> och <code>$IN_DIR</code> med sökvägarna för utdata- respektive indatakatalog).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst för macOS (via brew)</a> – (t.ex. <code>brew install libpst</code> och sedan <code>readpst -u -o $OUT_DIR $IN_DIR</code>, där du ersätter <code>$OUT_DIR</code> och <code>$IN_DIR</code> med sökvägarna för utdata- respektive indatakatalog).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">PST Converter för Windows (GitHub)</a></li></ul><br /></span></div> |
   | Apple Mail     | MBOX                                           | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Fastmail       | EML                                            | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
   | Proton Mail    | MBOX/EML                                       | <https://proton.me/support/export-emails-import-export-app>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
   | Tutanota       | EML                                            | <https://github.com/crepererum-oss/tatutanatata>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Gandi          | EML                                            | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
   | Zoho           | EML                                            | <https://www.zoho.com/mail/help/import-export-emails.html#alink2>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
   | Other          | [Använd Thunderbird](https://www.thunderbird.net) | Ställ in ditt befintliga e-postkonto i Thunderbird och använd sedan tillägget [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) för att exportera och importera din e-post.  **Du kan också eventuellt bara kopiera/klistra in eller dra/släppa e-postmeddelanden mellan konton.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
2. Ladda ner, installera och öppna [Thunderbird](https://www.thunderbird.net).

3. Skapa ett nytt konto med din alias fullständiga e-postadress (t.ex. <code><you@yourdomain.com></code>) och ditt genererade lösenord.  <strong>Om du ännu inte har ett genererat lösenord, <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">se våra installationsinstruktioner</a></strong>.

4. Ladda ner och installera [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) Thunderbird-tillägget.

5. Skapa en ny lokal mapp i Thunderbird, högerklicka sedan på den → välj alternativet `ImportExportTools NG` → välj `Import mbox file` (för MBOX-exportformat) – eller – `Import messages` / `Import all messages from a directory` (för EML-exportformat).

6. Dra/släpp från den lokala mappen till en ny (eller befintlig) IMAP-mapp i Thunderbird som du vill ladda upp meddelanden till i IMAP-lagring med vår tjänst.  Detta säkerställer att de säkerhetskopieras online med vår SQLite-krypterade lagring.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tips:
     </strong>
     <span>
       Om du är osäker på hur du importerar till Thunderbird kan du hänvisa till officiella instruktioner på <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> och <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
     </span>
   </div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktigt:
  </strong>
  <span>
    När du har slutfört export- och importprocessen kan du även vilja aktivera vidarebefordran på ditt befintliga e-postkonto och ställa in ett autosvar för att meddela avsändare att du har en ny e-postadress (t.ex. om du tidigare använde Gmail och nu använder en e-post med ditt egna domännamn).
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Grattis!
    </strong>
    <span>
      Du har framgångsrikt slutfört alla steg.
    </span>
  </div>
</div>

### Hur använder jag min egen S3-kompatibla lagring för säkerhetskopior {#how-do-i-use-my-own-s3-compatible-storage-for-backups}

Användare med betalda planer kan konfigurera sin egen [S3](https://en.wikipedia.org/wiki/Amazon_S3)-kompatibla lagringsleverantör per domän för IMAP/SQLite-säkerhetskopior.  Detta innebär att dina krypterade brevlådesäkerhetskopior kan lagras på din egen infrastruktur istället för (eller som ett komplement till) vår standardlagring.

Stödda leverantörer inkluderar [Amazon S3](https://aws.amazon.com/s3/), [Cloudflare R2](https://developers.cloudflare.com/r2/), [MinIO](https://github.com/minio/minio), [Backblaze B2](https://www.backblaze.com/cloud-storage), [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces) och andra S3-kompatibla tjänster.

#### Installation {#setup}

1. Skapa en **privat** bucket hos din S3-kompatibla leverantör. Bucketen får inte vara offentligt tillgänglig.
2. Skapa åtkomstuppgifter (access key ID och secret access key) med läs-/skrivrättigheter till bucketen.
3. Gå till <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Avancerade inställningar <i class="fa fa-angle-right"></i> Anpassad S3-kompatibel lagring.
4. Kryssa i **"Aktivera anpassad S3-kompatibel lagring"** och fyll i din endpoint-URL, access key ID, secret access key, region och bucket-namn.
5. Klicka på **"Testa anslutning"** för att verifiera dina uppgifter, bucket-åtkomst och skrivbehörigheter.
6. Klicka på **"Spara"** för att tillämpa inställningarna.

#### Hur säkerhetskopior fungerar {#how-backups-work}

Säkerhetskopior triggas automatiskt för varje ansluten IMAP-alias. IMAP-servern kontrollerar alla aktiva anslutningar en gång i timmen och startar en säkerhetskopia för varje ansluten alias. Ett Redis-baserat lås förhindrar att dubblettsäkerhetskopior körs inom 30 minuter från varandra, och den faktiska säkerhetskopian hoppas över om en lyckad säkerhetskopia redan har slutförts inom de senaste 24 timmarna (om inte säkerhetskopian uttryckligen begärts av en användare för nedladdning).
Backuper kan också triggas manuellt genom att klicka på **"Download Backup"** för vilken alias som helst i instrumentpanelen. Manuella backuper körs alltid oavsett 24-timmarsfönstret.

Backup-processen fungerar enligt följande:

1. SQLite-databasen kopieras med `VACUUM INTO`, vilket skapar en konsekvent ögonblicksbild utan att avbryta aktiva anslutningar och bevarar databasens kryptering.
2. Backup-filen verifieras genom att öppnas för att bekräfta att krypteringen fortfarande är giltig.
3. En SHA-256-hash beräknas och jämförs med den befintliga backuppen i lagringen. Om hashen matchar hoppas uppladdningen över (inga ändringar sedan senaste backup).
4. Backuppen laddas upp till S3 med multipart upload via [@aws-sdk/lib-storage](https://github.com/aws/aws-sdk-js-v3/tree/main/lib/lib-storage)-biblioteket.
5. En signerad nedladdnings-URL (giltig i 4 timmar) genereras och skickas via e-post till användaren.

#### Backup Formats {#backup-formats}

Tre backupformat stöds:

| Format   | Extension | Beskrivning                                                                 |
| -------- | --------- | --------------------------------------------------------------------------- |
| `sqlite` | `.sqlite` | Rå krypterad SQLite-databassnapshot (standard för automatiska IMAP-backuper) |
| `mbox`   | `.zip`    | Lösenordsskyddad ZIP som innehåller brevlåda i mbox-format                   |
| `eml`    | `.zip`    | Lösenordsskyddad ZIP som innehåller individuella `.eml`-filer per meddelande |

> **Tips:** Om du har `.sqlite` backupfiler och vill konvertera dem till `.eml`-filer lokalt, använd vårt fristående CLI-verktyg **[convert-sqlite-to-eml](#how-do-i-convert-sqlite-backups-to-eml-files)**. Det fungerar på Windows, Linux och macOS och kräver ingen nätverksanslutning.

#### File Naming and Key Structure {#file-naming-and-key-structure}

När du använder **anpassad S3-lagring** lagras backupfiler med ett [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601)-tidsstämpelprefix så att varje backup bevaras som ett separat objekt. Detta ger dig en fullständig backuphistorik i din egen bucket.

Nyckelformatet är:

```
{ISO 8601 timestamp}-{alias_id}.{extension}
```

Till exempel:

```
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.zip
2025-03-02T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
```

`alias_id` är MongoDB ObjectId för aliaset. Du kan hitta det på aliasinställningssidan eller via API:et.

När du använder **standardlagringen (systemlagring)** är nyckeln platt (t.ex. `65a31c53c36b75ed685f3fda.sqlite`) och varje backup skriver över den föregående.

> **Notera:** Eftersom anpassad S3-lagring behåller alla backupversioner kommer lagringsanvändningen att öka över tid. Vi rekommenderar att du konfigurerar [lifecycle rules](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html) på din bucket för att automatiskt ta bort gamla backuper (t.ex. radera objekt äldre än 30 eller 90 dagar).

#### Data Ownership and Deletion Policy {#data-ownership-and-deletion-policy}

Din anpassade S3-bucket är helt under din kontroll. Vi **tar aldrig bort eller ändrar** filer i din anpassade S3-bucket – inte när ett alias tas bort, inte när en domän tas bort och inte under några städningsoperationer. Vi skriver endast nya backupfiler till din bucket.

Detta innebär:

* **Aliasborttagning** — När du tar bort ett alias tar vi bort backuppen från vår standard systemlagring endast. Eventuella backuper som tidigare skrivits till din anpassade S3-bucket förblir orörda.
* **Domänborttagning** — Att ta bort en domän påverkar inte filer i din anpassade bucket.
* **Retention management** — Du ansvarar för att hantera lagringen i din egen bucket, inklusive att konfigurera lifecycle rules för att ta bort gamla backuper.

Om du inaktiverar anpassad S3-lagring eller byter tillbaka till vår standardlagring bevaras befintliga filer i din bucket. Framtida backuper kommer helt enkelt att skrivas till vår standardlagring istället.

#### Security {#security}

* Din access key ID och secret access key är **krypterade i vila** med [AES-256-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode) innan de lagras i vår databas. De dekrypteras endast vid körning när backup-operationer utförs.
* Vi validerar automatiskt att din bucket **inte är offentligt tillgänglig**. Om en offentlig bucket upptäcks kommer konfigurationen att avvisas vid sparande. Om offentlig åtkomst upptäcks vid backup-tidpunkt faller vi tillbaka till vår standardlagring och meddelar alla domänadministratörer via e-post.
* Referenser valideras vid sparande via ett [HeadBucket](https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadBucket.html)-anrop för att säkerställa att bucketen finns och att referenserna är korrekta. Om valideringen misslyckas inaktiveras anpassad S3-lagring automatiskt.
* Varje backupfil inkluderar en SHA-256-hash i sin S3-metadata, som används för att upptäcka oförändrade databaser och hoppa över redundanta uppladdningar.
#### Felmeddelanden {#error-notifications}

Om en säkerhetskopia misslyckas när du använder din anpassade S3-lagring (t.ex. på grund av utgångna autentiseringsuppgifter eller ett anslutningsproblem), kommer alla domänadministratörer att meddelas via e-post. Dessa meddelanden begränsas till en gång var sjätte timme för att förhindra dubblettvarningar. Om din bucket upptäcks som offentligt tillgänglig vid säkerhetskopieringstillfället, kommer administratörerna att meddelas en gång per dag.

#### API {#api}

Du kan också konfigurera anpassad S3-lagring via API:

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

För att testa anslutningen via API:

```sh
curl -X POST https://api.forwardemail.net/v1/domains/example.com/test-s3-connection \
  -u API_TOKEN:
```

### Hur konverterar jag SQLite-säkerhetskopior till EML-filer {#how-do-i-convert-sqlite-backups-to-eml-files}

Om du laddar ner eller lagrar SQLite-säkerhetskopior (antingen från vår standardlagring eller din egen [anpassade S3-bucket](#how-do-i-use-my-own-s3-compatible-storage-for-backups)) kan du konvertera dem till standard `.eml`-filer med vårt fristående CLI-verktyg **[convert-sqlite-to-eml](https://github.com/forwardemail/forwardemail.net/tree/master/tools/convert-sqlite-to-eml)**. EML-filer kan öppnas med vilken e-postklient som helst ([Thunderbird](https://www.thunderbird.net/), [Outlook](https://www.microsoft.com/en-us/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook), [Apple Mail](https://support.apple.com/mail), etc.) eller importeras till andra e-postservrar.

#### Installation {#installation-1}

Du kan antingen ladda ner en förbyggd binärfil (ingen [Node.js](https://github.com/nodejs/node) krävs) eller köra den direkt med [Node.js](https://github.com/nodejs/node):

**Förbyggda binärfiler** — Ladda ner den senaste versionen för din plattform från [GitHub Releases](https://github.com/forwardemail/forwardemail.net/releases):

| Plattform | Arkitektur   | Fil                                  |
| --------- | ------------ | ----------------------------------- |
| Linux     | x64          | `convert-sqlite-to-eml-linux-x64`    |
| Linux     | arm64        | `convert-sqlite-to-eml-linux-arm64`  |
| macOS     | Apple Silicon| `convert-sqlite-to-eml-darwin-arm64` |
| Windows   | x64          | `convert-sqlite-to-eml-win-x64.exe`  |

> **macOS-användare:** Efter nedladdning kan du behöva ta bort karantäns-attributet innan du kör binärfilen:
>
> ```bash
> sudo xattr -rd com.apple.quarantine ./convert-sqlite-to-eml-darwin-arm64
> ```
>
> (Byt ut `./convert-sqlite-to-eml-darwin-arm64` mot den faktiska sökvägen till den nedladdade filen.)

> **Linux-användare:** Efter nedladdning kan du behöva göra binärfilen körbar:
>
> ```bash
> chmod +x ./convert-sqlite-to-eml-linux-x64
> ```
>
> (Byt ut `./convert-sqlite-to-eml-linux-x64` mot den faktiska sökvägen till den nedladdade filen.)

**Från källkod** (kräver [Node.js](https://github.com/nodejs/node) >= 18):

```bash
cd tools/convert-sqlite-to-eml
npm install
node index.js
```

#### Användning {#usage}

Verktyget stödjer både interaktivt och icke-interaktivt läge.

**Interaktivt läge** — kör utan argument och du kommer att bli tillfrågad om alla indata:

```bash
./convert-sqlite-to-eml
```

```
  Forward Email - Konvertera SQLite-säkerhetskopia till EML
  =============================================

  Sökväg till SQLite-säkerhetskopian: /path/to/backup.sqlite
  IMAP/alias-lösenord: ********
  Utdata ZIP-sökväg [/path/to/backup-2025-03-01T12-00-00-000Z.zip]:
```

**Icke-interaktivt läge** — skicka argument via kommandoradsflaggor för skriptning och automatisering:

```bash
./convert-sqlite-to-eml \
  --path /path/to/backup.sqlite \
  --password "ditt-imap-lösenord" \
  --output /path/to/output.zip
```

| Flagga               | Beskrivning                                                                   |
| -------------------- | ----------------------------------------------------------------------------- |
| `--path <path>`      | Sökväg till den krypterade SQLite-säkerhetskopian                            |
| `--password <pass>`  | IMAP/alias-lösenord för dekryptering                                         |
| `--output <path>`    | Utdata-sökväg för ZIP-filen (standard: autogenererad med ISO 8601-tidsstämpel)|
| `--help`             | Visa hjälpmelding                                                             |
#### Output Format {#output-format}

Verktyget producerar ett lösenordsskyddat ZIP-arkiv (AES-256-krypterat) som innehåller:

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

EML-filer är organiserade efter brevlåde-mapp. ZIP-lösenordet är samma som ditt IMAP/alias-lösenord. Varje `.eml`-fil är ett standardiserat [RFC 5322](https://datatracker.ietf.org/doc/html/rfc5322) e-postmeddelande med fullständiga headers, brödtext och bilagor rekonstruerade från SQLite-databasen.

#### How It Works {#how-it-works}

1. Öppnar den krypterade SQLite-databasen med ditt IMAP/alias-lösenord (stöder både [ChaCha20](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) och [AES-256-CBC](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) chiffer).
2. Läser tabellen Mailboxes för att upptäcka mappstrukturen.
3. För varje meddelande avkodar mimeTree (lagrat som [Brotli](https://github.com/google/brotli)-komprimerad JSON) från tabellen Messages.
4. Rekonstruerar hela EML genom att gå igenom MIME-trädet och hämta bilagornas innehåll från tabellen Attachments.
5. Paketerar allt i ett lösenordsskyddat ZIP-arkiv med hjälp av [archiver-zip-encrypted](https://github.com/artem-silaev/archiver-zip-encrypted).

### Do you support self-hosting {#do-you-support-self-hosting}

Ja, från och med mars 2025 stödjer vi ett självhostat alternativ. Läs bloggen [här](https://forwardemail.net/blog/docs/self-hosted-solution). Kolla in [självhostad guide](https://forwardemail.net/self-hosted) för att komma igång. Och för de som är intresserade av en mer nedbruten steg-för-steg-version, se våra [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) eller [Debian](https://forwardemail.net/guides/selfhosted-on-debian) baserade guider.


## Email Configuration {#email-configuration}

### How do I get started and set up email forwarding {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Uppskattad installationstid:</strong>
  <span>Mindre än 10 minuter</span>
</div>

<div class="alert my-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Kom igång:
  </strong>
  <span>
    Läs noggrant och följ steg ett till åtta nedan. Var noga med att ersätta e-postadressen <code>user@gmail.com</code> med den e-postadress du vill vidarebefordra e-post till (om den inte redan är korrekt). På samma sätt, se till att ersätta <code>example.com</code> med ditt anpassade domännamn (om det inte redan är korrekt).
  </span>
</div>

<ol>
  <li class="mb-2 mb-md-3 mb-lg-5">Om du redan har registrerat ditt domännamn någonstans, måste du helt hoppa över detta steg och gå till steg två! Annars kan du <a href="/domain-registration" rel="noopener noreferrer">klicka här för att registrera ditt domännamn</a>.</li>
  <li class="mb-2 mb-md-3 mb-lg-5">
  Kommer du ihåg var du registrerade ditt domännamn? När du kommer ihåg detta, följ instruktionerna nedan:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktigt:
  </strong>
  <span>
    Du måste öppna en ny flik och logga in hos din domänregistrator. Du kan enkelt klicka på din "Registrar" nedan för att automatiskt göra detta. I denna nya flik måste du navigera till DNS-hanteringssidan hos din registrator – och vi har tillhandahållit steg-för-steg navigationssteg nedan under kolumnen "Steps to Configure". När du har navigerat till denna sida i den nya fliken kan du återvända till denna flik och fortsätta till steg tre nedan.
    <strong class="font-weight-bold">Stäng inte den öppnade fliken än; du kommer att behöva den för framtida steg!</strong>
  </span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Registrar</th>
      <th>Steg för konfiguration</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
      <td>Logga in <i class="fa fa-angle-right"></i> Domain Center <i class="fa fa-angle-right"></i> (Välj din domän) <i class="fa fa-angle-right"></i> Redigera DNS-inställningar</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Route 53</a></td>
      <td>Logga in <i class="fa fa-angle-right"></i> Hosted Zones <i class="fa fa-angle-right"></i> (Välj din domän)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
      <td>Logga in <i class="fa fa-angle-right"></i> My Servers <i class="fa fa-angle-right"></i> Domain Management <i class="fa fa-angle-right"></i> DNS Manager</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
      <td>FÖR ROCK: Logga in <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> (Klicka på ▼-ikonen bredvid hantera) <i class="fa fa-angle-right"></i> DNS
      <br />
      FÖR LEGACY: Logga in <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> Zone editor <i class="fa fa-angle-right"></i> (Välj din domän)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
      <td>Logga in <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Made Easy</a></td>
      <td>Logga in <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Välj din domän)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
      <td>Logga in <i class="fa fa-angle-right"></i> (Välj din domän)  <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Hantera</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
      <td>Logga in <i class="fa fa-angle-right"></i> Networking <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> (Välj din domän) <i class="fa fa-angle-right"></i> More <i class="fa fa-angle-right"></i> Manage Domain</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
      <td>Logga in <i class="fa fa-angle-right"></i> I kortvy, klicka på hantera på din domän <i class="fa fa-angle-right"></i> I listvy, klicka på kugghjulsikonen <i class="fa fa-angle-right"></i> DNS & Nameservers <i class="fa fa-angle-right"></i> DNS Records</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> Titta</a>
      </td>
      <td>Logga in <i class="fa fa-angle-right"></i> (Välj din domän) <i class="fa fa-angle-right"></i> Hantera <i class="fa fa-angle-right"></i> (klicka på kugghjulsikonen) <i class="fa fa-angle-right"></i> Klicka på DNS &amp; Nameservers i vänstermenyn</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
      <td>Logga in <i class="fa fa-angle-right"></i> Panel <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> Manage Domains <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
      <td>Logga in <i class="fa fa-angle-right"></i> Overview <i class="fa fa-angle-right"></i> Manage <i class="fa fa-angle-right"></i> Simple Editor <i class="fa fa-angle-right"></i> Records</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
      <td>Logga in <i class="fa fa-angle-right"></i> (Välj din domän) <i class="fa fa-angle-right"></i> Management <i class="fa fa-angle-right"></i> Redigera zonen</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> Titta</a>
      </td>
      <td>Logga in <i class="fa fa-angle-right"></i> Manage My Domains <i class="fa fa-angle-right"></i> (Välj din domän) <i class="fa fa-angle-right"></i> Manage DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google Domains</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> Titta</a>
      </td>
      <td>Logga in <i class="fa fa-angle-right"></i> (Välj din domän) <i class="fa fa-angle-right"></i> Konfigurera DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> Titta</a>
      </td>
      <td>Logga in <i class="fa fa-angle-right"></i> Domain List <i class="fa fa-angle-right"></i> (Välj din domän) <i class="fa fa-angle-right"></i> Hantera <i class="fa fa-angle-right"></i> Advanced DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
      <td>Logga in <i class="fa fa-angle-right"></i> (Välj din domän) <i class="fa fa-angle-right"></i> Setup Netlify DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Solutions</a></td>
      <td>Logga in <i class="fa fa-angle-right"></i> Account Manager <i class="fa fa-angle-right"></i> My Domain Names <i class="fa fa-angle-right"></i> (Välj din domän) <i class="fa fa-angle-right"></i> Hantera <i class="fa fa-angle-right"></i> Ändra vart domänen pekar <i class="fa fa-angle-right"></i> Advanced DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> Titta</a>
      </td>
      <td>Logga in <i class="fa fa-angle-right"></i> Managed Domains <i class="fa fa-angle-right"></i> (Välj din domän) <i class="fa fa-angle-right"></i> DNS-inställningar</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
      <td>Logga in <i class="fa fa-angle-right"></i> Hemmeny <i class="fa fa-angle-right"></i> Inställningar <i class="fa fa-angle-right"></i> Domäner <i class="fa fa-angle-right"></i> (Välj din domän) <i class="fa fa-angle-right"></i>
Avancerade inställningar <i class="fa fa-angle-right"></i> Anpassade poster</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Vercel's Now</a></td>
      <td>Använder "now" CLI <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
      <td>Logga in <i class="fa fa-angle-right"></i> Domänsida <i class="fa fa-angle-right"></i> (Välj din domän) <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
      <td>Logga in <i class="fa fa-angle-right"></i> Domänsida <i class="fa fa-angle-right"></i> (Klicka på <i class="fa fa-ellipsis-h"></i>-ikonen) <i class="fa fa-angle-right"></i> Välj Hantera DNS-poster</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
      <td>Logga in <i class="fa fa-angle-right"></i> Domäner <i class="fa fa-angle-right"></i> Mina domäner</td>
    </tr>
    <tr>
      <td>Övrigt</td>
      <td>
        <div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Viktigt:</strong> Ser du inte namnet på din registrator här? Sök helt enkelt på Internet efter "hur ändrar man DNS-poster på $REGISTRAR" (ersätt $REGISTRAR med namnet på din registrator – t.ex. "hur ändrar man DNS-poster på GoDaddy" om du använder GoDaddy).</div>
      </td>
    </tr>
  </tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">Använd din registrators DNS-hanteringssida (den andra fliken du har öppnat) och ställ in följande "MX"-poster:
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktigt:
  </strong>
  <span>
    Observera att det inte får finnas några andra MX-poster inställda. Båda posterna som visas nedan MÅSTE finnas. Se till att det inte finns några stavfel; och att du har både mx1 och mx2 rättstavade. Om det redan fanns MX-poster, vänligen ta bort dem helt.
    Värdet för "TTL" behöver inte vara 3600, det kan vara ett lägre eller högre värde om det behövs.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Namn/Värd/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Prioritet</th>
      <th>Svar/Värde</th>
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

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Använd din registrators DNS-hanteringssida (den andra fliken du har öppnat), och ställ in följande <strong class="notranslate">TXT</strong>-post(er):

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktigt:
  </strong>
  <span>
    Om du har en betald plan måste du helt hoppa över detta steg och gå till steg fem! Om du inte har en betald plan kommer dina vidarebefordrade adresser att vara offentligt sökbara – gå till <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> och uppgradera din domän till en betald plan om du vill. Om du vill veta mer om betalda planer, se vår <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Prissättning</a>-sida. Annars kan du fortsätta och välja en eller flera kombinationer från Alternativ A till Alternativ F som listas nedan.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Alternativ A:
  </strong>
  <span>
    Om du vidarebefordrar alla e-postmeddelanden från din domän, (t.ex. "all@example.com", "hello@example.com", osv) till en specifik adress "user@gmail.com":
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Namn/Värd/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Svar/Värde</th>
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
    Se till att byta ut värdena ovan i kolumnen "Värde" mot din egen e-postadress. Värdet för "TTL" behöver inte vara 3600, det kan vara ett lägre eller högre värde om det behövs. Ett lägre time to live ("TTL")-värde säkerställer att framtida ändringar i dina DNS-poster sprids snabbare över Internet – tänk på detta som hur länge det kommer att cachas i minnet (i sekunder). Du kan lära dig mer om <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL på Wikipedia</a>.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Alternativ B:
  </strong>
  <span>
    Om du bara behöver vidarebefordra en enda e-postadress (t.ex. <code>hello@example.com</code> till <code>user@gmail.com</code>; detta vidarebefordrar också automatiskt "hello+test@example.com" till "user+test@gmail.com"):
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Namn/Värd/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Svar/Värde</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tomt</em></td>
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
    Om du vidarebefordrar flera e-postmeddelanden vill du separera dem med ett kommatecken:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Namn/Värd/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Svar/Värde</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tomt</em></td>
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
    Du kan ha ett obegränsat antal vidarebefordringsadresser inställda – se bara till att inte överskrida 255 tecken på en rad och börja varje rad med "forward-email=". Ett exempel ges nedan:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Namn/Värd/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Svar/Värde</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tomt</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", eller tomt</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=help:user@gmail.com,foo:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", eller tomt</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", eller tomt</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", eller tomt</em></td>
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
    Du kan också ange ett domännamn i din <strong class="notranslate">TXT</strong>-post för att ha global alias-vidarebefordran (t.ex. "user@example.com" kommer att vidarebefordras till "user@example.net"):
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Namn/Värd/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Svar/Värde</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tomt</em></td>
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
    Du kan till och med använda webhooks som globalt eller individuellt alias för att vidarebefordra e-post till. Se exemplet och hela avsnittet om webhooks med titeln <a href="#do-you-support-webhooks" class="alert-link">Do you support webhooks</a> nedan.
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Namn/Värd/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Svar/Värde</th>
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
    Du kan till och med använda reguljära uttryck ("regex") för att matcha alias och för att hantera substitutioner för att vidarebefordra e-post till. Se exemplen och hela avsnittet om regex med titeln <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Stöder ni reguljära uttryck eller regex</a> nedan.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Behöver du avancerad regex med substitution?</strong> Se exemplen och hela avsnittet om regex med titeln <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Stöder ni reguljära uttryck eller regex</a> nedan.
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Enkelt exempel:</strong> Om jag vill att all e-post som går till `linus@example.com` eller `torvalds@example.com` ska vidarebefordras till `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Namn/Värd/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Svar/Värde</th>
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
    Viktigt:
  </strong>
  <span>
    Catch-all vidarebefordringsregler kan också beskrivas som "fall-through".
    Det betyder att inkommande e-post som matchar minst en specifik vidarebefordringsregel kommer att användas istället för catch-all.
    Specifika regler inkluderar e-postadresser och reguljära uttryck.
    <br /><br />
    Till exempel:
    <br />
    <code>forward-email=hello:first@gmail.com,second@gmail.com</code>
    <br />
    E-post skickad till <code>hello@example.com</code> kommer **inte** att vidarebefordras till <code>second@gmail.com</code> (catch-all) med denna konfiguration, utan levereras endast till <code>first@gmail.com</code>.
  </span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Använd din registrators DNS-hanteringssida (den andra fliken du har öppen), och lägg dessutom till följande <strong class="notranslate">TXT</strong>-post:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Namn/Värd/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Svar/Värde</th>
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
    Viktigt:
  </strong>
  <span>
    Om du använder Gmail (t.ex. Skicka e-post som) eller G Suite, behöver du lägga till <code>include:_spf.google.com</code> till värdet ovan, till exempel:
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
    Om du redan har en liknande rad med "v=spf1", behöver du lägga till <code>include:spf.forwardemail.net</code> precis före eventuella befintliga "include:host.com"-poster och före "-all" på samma rad, till exempel:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Observera att det finns en skillnad mellan "-all" och "~all". "-" indikerar att SPF-kontrollen ska MISSLYCKAS om den inte matchar, och "~" indikerar att SPF-kontrollen ska SOFTFAILA. Vi rekommenderar att använda "-all"-metoden för att förhindra domänförfalskning.
    <br /><br />
    Du kan också behöva inkludera SPF-posten för den värd du skickar e-post från (t.ex. Outlook).
  </span>
</div>
</li><li class="mb-2 mb-md-3 mb-lg-5">Verifiera dina DNS-poster med vårt verktyg "Verify Records" som finns på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mitt Konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Installation.

</li><li class="mb-2 mb-md-3 mb-lg-5">Skicka ett testmail för att bekräfta att det fungerar. Observera att det kan ta lite tid innan dina DNS-poster har spridits.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tips:
  </strong>
  <span>
  </span>
    Om du inte tar emot testmail, eller får ett testmail som säger "Var försiktig med detta meddelande", se då svaren för <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Varför tar jag inte emot mina testmail</a> och <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Varför visas mina testmail som jag skickar till mig själv i Gmail som "misstänkta"</a> respektive.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Om du vill "Skicka mail som" från Gmail, behöver du <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">titta på denna video</a></strong>, eller följa stegen under <a href="#how-to-send-mail-as-using-gmail">Hur man skickar mail som med Gmail</a> nedan.

</li></ol>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Grattis!
    </strong>
    <span>
      Du har framgångsrikt slutfört alla steg.
    </span>
  </div>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tips:
  </strong>
  <span>
    Valfria tillägg listas nedan. Observera att dessa tillägg är helt frivilliga och kanske inte är nödvändiga. Vi ville åtminstone ge dig ytterligare information om det behövs.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Valfritt tillägg:
  </strong>
  <span>
    Om du använder funktionen <a class="alert-link" href="#how-to-send-mail-as-using-gmail">Hur man skickar mail som med Gmail</a> kan du vilja lägga till dig själv i en vitlista. Se <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">dessa instruktioner från Gmail</a> om detta ämne.
  </span>
</div>

### Kan jag använda flera MX-utbyten och servrar för avancerad vidarebefordran {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Ja, men **du bör endast ha en MX-utbyte listad i dina DNS-poster**.

Försök inte använda "Prioritet" som ett sätt att konfigurera flera MX-utbyten.

Istället behöver du konfigurera ditt befintliga MX-utbyte för att vidarebefordra mail för alla icke-matchande alias till vår tjänsts utbyten (`mx1.forwardemail.net` och/eller `mx2.forwardemail.net`).

Om du använder Google Workspace och vill vidarebefordra alla icke-matchande alias till vår tjänst, se <https://support.google.com/a/answer/6297084>.

Om du använder Microsoft 365 (Outlook) och vill vidarebefordra alla icke-matchande alias till vår tjänst, se <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> och <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### Hur ställer jag in en semesterautomatiskt svar (out of office auto-responder) {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

Gå till <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mitt Konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Alias och skapa eller redigera det alias du vill konfigurera en semesterautomatiskt svar för.
Du har möjlighet att konfigurera ett startdatum, slutdatum, ämne och meddelande, samt aktivera eller inaktivera det när som helst:

* Ämne och meddelande i ren text stöds för närvarande (vi använder `striptags`-paketet internt för att ta bort eventuell HTML).
* Ämnet är begränsat till 100 tecken.
* Meddelandet är begränsat till 1000 tecken.
* Uppställning kräver konfiguration av utgående SMTP (t.ex. måste du konfigurera DKIM, DMARC och Return-Path DNS-poster).
  * Gå till <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Inställningar <i class="fa fa-angle-right"></i> Konfiguration av utgående SMTP och följ installationsinstruktionerna.
* Semesterresponder kan inte aktiveras på globala vanity-domännamn (t.ex. stöds inte [engångsadresser](/disposable-addresses)).
* Semesterresponder kan inte aktiveras för alias med wildcard/catch-all (`*`) eller reguljära uttryck.

Till skillnad från mailsystem som `postfix` (t.ex. som använder `sieve`-semesterfiltertillägget) – lägger Forward Email automatiskt till din DKIM-signatur, skyddar mot anslutningsproblem vid utskick av semesterresponser (t.ex. på grund av vanliga SSL/TLS-anslutningsproblem och äldre servrar), och stödjer till och med Open WKD och PGP-kryptering för semesterresponser.

<!--
* För att förhindra missbruk dras 1 utgående SMTP-kredit för varje skickat semesterresponsermeddelande.
  * Alla betalda konton inkluderar som standard 300 krediter per dag. Om du behöver fler, vänligen kontakta oss.
-->

1. Vi skickar endast en gång per [tillåten avsändare](#do-you-have-an-allowlist) var fjärde dag (vilket liknar Gmail:s beteende).

   * Vår Redis-cache använder ett fingeravtryck av `alias_id` och `sender`, där `alias_id` är aliasets MongoDB-ID och `sender` är antingen Från-adressen (om tillåten) eller rot-domänen i Från-adressen (om inte tillåten). För enkelhetens skull är utgångstiden för detta fingeravtryck i cachen satt till 4 dagar.

   * Vår metod att använda rot-domänen som parsas från Från-adressen för icke tillåtna avsändare förhindrar missbruk från relativt okända avsändare (t.ex. illvilliga aktörer) som försöker översvämma semesterresponser.

2. Vi skickar endast när MAIL FROM och/eller Från inte är tomma och inte innehåller (skiftlägesokänsligt) ett [postmaster-användarnamn](#what-are-postmaster-addresses) (delen före @ i en e-postadress).

3. Vi skickar inte om det ursprungliga meddelandet hade någon av följande rubriker (skiftlägesokänsligt):

   * Rubrik `auto-submitted` med ett värde som inte är `no`.
   * Rubrik `x-auto-response-suppress` med värdet `dr`, `autoreply`, `auto-reply`, `auto_reply` eller `all`.
   * Rubrik `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` eller `x-auto-respond` (oavsett värde).
   * Rubrik `precedence` med värdet `bulk`, `autoreply`, `auto-reply`, `auto_reply` eller `list`.

4. Vi skickar inte om MAIL FROM eller Från-e-postadressen slutar med `+donotreply`, `-donotreply`, `+noreply` eller `-noreply`.

5. Vi skickar inte om användardelen i Från-e-postadressen var `mdaemon` och den hade en skiftlägesokänslig rubrik `X-MDDSN-Message`.

6. Vi skickar inte om det fanns en skiftlägesokänslig `content-type`-rubrik med värdet `multipart/report`.

### Hur ställer jag in SPF för Forward Email {#how-do-i-set-up-spf-for-forward-email}

Använd din registrators DNS-hanteringssida och skapa följande <strong class="notranslate">TXT</strong>-post:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Namn/Värd/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Svar/Värde</th>
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
    Viktigt:
  </strong>
  <span>
    Om du använder Gmail (t.ex. Skicka som) eller G Suite måste du lägga till <code>include:_spf.google.com</code> till värdet ovan, till exempel:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktigt:
  </strong>
  <span>
    Om du använder Microsoft Outlook eller Live.com måste du lägga till <code>include:spf.protection.outlook.com</code> i din SPF <strong class="notranslate">TXT</strong>-post, till exempel:
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
    Om du redan har en liknande rad med "v=spf1", måste du lägga till <code>include:spf.forwardemail.net</code> precis före eventuella befintliga "include:host.com"-poster och före "-all" på samma rad, till exempel:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Observera att det finns en skillnad mellan "-all" och "~all". "-" indikerar att SPF-kontrollen ska MISSLYCKAS om den inte matchar, och "~" indikerar att SPF-kontrollen ska SOFTFAIL. Vi rekommenderar att använda "-all"-metoden för att förhindra domänförfalskning.
    <br /><br />
    Du kan också behöva inkludera SPF-posten för den värd du skickar mail från (t.ex. Outlook).
  </span>
</div>

### Hur ställer jag in DKIM för Forward Email {#how-do-i-set-up-dkim-for-forward-email}

Gå till <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Inställningar <i class="fa fa-angle-right"></i> Utgående SMTP-konfiguration och följ installationsinstruktionerna.

### Hur ställer jag in DMARC för Forward Email {#how-do-i-set-up-dmarc-for-forward-email}

Gå till <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Inställningar <i class="fa fa-angle-right"></i> Utgående SMTP-konfiguration och följ installationsinstruktionerna.

### Hur visar jag DMARC-rapporter {#how-do-i-view-dmarc-reports}

Forward Email erbjuder en omfattande DMARC-rapportsinstrumentpanel som låter dig övervaka din e-postautentiseringsprestanda över alla dina domäner från ett enda gränssnitt.

**Vad är DMARC-rapporter?**

DMARC (Domain-based Message Authentication, Reporting, and Conformance) rapporter är XML-filer som skickas av mottagande e-postservrar och berättar hur dina e-postmeddelanden autentiseras. Dessa rapporter hjälper dig att förstå:

* Hur många e-postmeddelanden som skickas från din domän
* Om dessa e-postmeddelanden passerar SPF- och DKIM-autentisering
* Vilka åtgärder mottagande servrar vidtar (acceptera, karantänsätta eller avvisa)
* Vilka IP-adresser som skickar e-post å din domäns vägnar

**Hur man får tillgång till DMARC-rapporter**

Gå till <a href="/my-account/dmarc-reports" class="alert-link" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i> DMARC-rapporter</a> för att visa din instrumentpanel. Du kan också komma åt domänspecifika rapporter från <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> genom att klicka på "DMARC"-knappen bredvid valfri domän.

**Instrumentpanelens funktioner**

DMARC-rapportsinstrumentpanelen erbjuder:

* **Sammanfattande mått**: Totalt antal mottagna rapporter, totalt analyserade meddelanden, SPF-justeringsgrad, DKIM-justeringsgrad och total godkänd andel
* **Diagram över meddelanden över tid**: Visuell trend av e-postvolym och autentiseringsgrader under de senaste 30 dagarna
* **Justering sammanfattning**: Cirkeldiagram som visar fördelningen mellan SPF- och DKIM-justering
* **Meddelandes disposition**: Staplat stapeldiagram som visar hur mottagande servrar hanterade dina e-postmeddelanden (accepterade, karantänsatta eller avvisade)
* **Tabell med senaste rapporter**: Detaljerad lista över individuella DMARC-rapporter med filtrering och paginering
* **Domänfiltrering**: Filtrera rapporter efter specifik domän när du hanterar flera domäner
**Varför detta är viktigt**

För organisationer som hanterar flera domäner (som företag, ideella organisationer eller byråer) är DMARC-rapporter avgörande för:

* **Identifiera obehöriga avsändare**: Upptäck om någon förfalskar din domän
* **Förbättra leveransbarheten**: Säkerställ att dina legitima e-postmeddelanden passerar autentisering
* **Övervaka e-postinfrastrukturen**: Spåra vilka tjänster och IP-adresser som skickar å dina vägnar
* **Efterlevnad**: Behåll insyn i e-postautentisering för säkerhetsrevisioner

Till skillnad från andra tjänster som kräver separata DMARC-övervakningsverktyg inkluderar Forward Email DMARC-rapportering och visualisering som en del av ditt konto utan extra kostnad.

**Krav**

* DMARC-rapporter är endast tillgängliga för betalda planer
* Din domän måste ha DMARC konfigurerat (se [Hur ställer jag in DMARC för Forward Email](#how-do-i-set-up-dmarc-for-forward-email))
* Rapporter samlas automatiskt in när mottagande e-postservrar skickar dem till din konfigurerade DMARC-rapporteringsadress

**Veckovisa e-postrapporter**

Användare med betald plan får automatiskt veckovisa sammanfattningar av DMARC-rapporter via e-post. Dessa e-postmeddelanden inkluderar:

* Sammanfattande statistik för alla dina domäner
* SPF- och DKIM-justeringsgrader
* Uppdelning av meddelandets disposition (accepterade, karantän, avvisade)
* Topp rapporterande organisationer (Google, Microsoft, Yahoo, etc.)
* IP-adresser med justeringsproblem som kan behöva åtgärdas
* Direktlänkar till din DMARC-rapporteringspanel

Veckorapporter skickas automatiskt och kan inte inaktiveras separat från andra e-postaviseringar.

### Hur ansluter och konfigurerar jag mina kontakter {#how-do-i-connect-and-configure-my-contacts}

**För att konfigurera dina kontakter, använd CardDAV-URL:en:** `https://carddav.forwardemail.net` (eller helt enkelt `carddav.forwardemail.net` om din klient tillåter det)

### Hur ansluter och konfigurerar jag mina kalendrar {#how-do-i-connect-and-configure-my-calendars}

**För att konfigurera din kalender, använd CalDAV-URL:en:** `https://caldav.forwardemail.net` (eller helt enkelt `caldav.forwardemail.net` om din klient tillåter det)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Forward Email Calendar CalDAV Thunderbird Example Setup" />

### Hur lägger jag till fler kalendrar och hanterar befintliga kalendrar {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Om du vill lägga till ytterligare kalendrar, lägg bara till en ny kalender-URL: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**se till att ersätta `calendar-name` med önskat kalendarnamn**)

Du kan ändra en kalenders namn och färg efter skapandet – använd bara din föredragna kalenderapplikation (t.ex. Apple Mail eller [Thunderbird](https://thunderbird.net)).

### Hur ansluter och konfigurerar jag uppgifter och påminnelser {#how-do-i-connect-and-configure-tasks-and-reminders}

**För att konfigurera uppgifter och påminnelser, använd samma CalDAV-URL som för kalendrar:** `https://caldav.forwardemail.net` (eller helt enkelt `caldav.forwardemail.net` om din klient tillåter det)

Uppgifter och påminnelser separeras automatiskt från kalenderhändelser till sina egna "Påminnelser" eller "Uppgifter"-kalendersamlingar.

**Installationsinstruktioner per plattform:**

**macOS/iOS:**

1. Lägg till ett nytt CalDAV-konto i Systeminställningar > Internetkonton (eller Inställningar > Konton på iOS)
2. Använd `caldav.forwardemail.net` som server
3. Ange din Forward Email-alias och genererade lösenord
4. Efter installationen ser du både "Kalender" och "Påminnelser"-samlingar
5. Använd Påminnelser-appen för att skapa och hantera uppgifter

**Android med Tasks.org:**

1. Installera Tasks.org från Google Play Store eller F-Droid
2. Gå till Inställningar > Synkronisering > Lägg till konto > CalDAV
3. Ange server: `https://caldav.forwardemail.net`
4. Ange din Forward Email-alias och genererade lösenord
5. Tasks.org hittar automatiskt dina uppgiftskalendrar

**Thunderbird:**

1. Installera Lightning-tillägget om det inte redan är installerat
2. Skapa en ny kalender med typen "CalDAV"
3. Använd URL: `https://caldav.forwardemail.net`
4. Ange dina Forward Email-uppgifter
5. Både händelser och uppgifter kommer att vara tillgängliga i kalendergränssnittet

### Varför kan jag inte skapa uppgifter i macOS Påminnelser {#why-cant-i-create-tasks-in-macos-reminders}
Om du har problem med att skapa uppgifter i macOS Påminnelser, prova dessa felsökningssteg:

1. **Kontrollera kontoinställningar**: Se till att ditt CalDAV-konto är korrekt konfigurerat med `caldav.forwardemail.net`

2. **Verifiera separata kalendrar**: Du bör se både "Calendar" och "Reminders" i ditt konto. Om du bara ser "Calendar" kan uppgiftssupporten ännu inte vara helt aktiverad.

3. **Uppdatera konto**: Försök ta bort och lägga till ditt CalDAV-konto igen i Systeminställningar > Internetkonton

4. **Kontrollera serveranslutning**: Testa att du kan komma åt `https://caldav.forwardemail.net` i din webbläsare

5. **Verifiera inloggningsuppgifter**: Se till att du använder rätt alias-e-post och genererat lösenord (inte ditt kontolösenord)

6. **Tvinga synkronisering**: I Påminnelser-appen, försök skapa en uppgift och uppdatera sedan synken manuellt

**Vanliga problem:**

* **"Reminders calendar not found"**: Servern kan behöva en stund för att skapa Reminders-samlingen vid första åtkomst
* **Uppgifter synkroniseras inte**: Kontrollera att båda enheterna använder samma CalDAV-kontouppgifter
* **Blandat innehåll**: Se till att uppgifter skapas i "Reminders"-kalendern, inte i den allmänna "Calendar"

### Hur ställer jag in Tasks.org på Android {#how-do-i-set-up-tasksorg-on-android}

Tasks.org är en populär öppen källkod-uppgiftshanterare som fungerar utmärkt med Forward Emails CalDAV-uppgiftssupport.

**Installation och inställning:**

1. **Installera Tasks.org**:
   * Från Google Play Store: [Tasks.org](https://play.google.com/store/apps/details?id=org.tasks)
   * Från F-Droid: [Tasks.org on F-Droid](https://f-droid.org/packages/org.tasks/)

2. **Konfigurera CalDAV-synk**:
   * Öppna Tasks.org
   * Gå till ☰ Meny > Inställningar > Synkronisering
   * Tryck på "Lägg till konto"
   * Välj "CalDAV"

3. **Ange Forward Email-inställningar**:
   * **Server-URL**: `https://caldav.forwardemail.net`
   * **Användarnamn**: Ditt Forward Email-alias (t.ex. `du@dindomän.com`)
   * **Lösenord**: Ditt alias-specifika genererade lösenord
   * Tryck på "Lägg till konto"

4. **Kontoupptäckt**:
   * Tasks.org kommer automatiskt att hitta dina uppgiftskalendrar
   * Du bör se din "Reminders"-samling dyka upp
   * Tryck på "Prenumerera" för att aktivera synk för uppgiftskalendern

5. **Testa synk**:
   * Skapa en testuppgift i Tasks.org
   * Kontrollera att den visas i andra CalDAV-klienter (som macOS Påminnelser)
   * Verifiera att ändringar synkroniseras åt båda hållen

**Tillgängliga funktioner:**

* ✅ Skapa och redigera uppgifter
* ✅ Förfallodatum och påminnelser
* ✅ Uppgiftsavslut och status
* ✅ Prioritetsnivåer
* ✅ Deluppgifter och uppgiftshierarki
* ✅ Taggar och kategorier
* ✅ Tvåvägssynk med andra CalDAV-klienter

**Felsökning:**

* Om inga uppgiftskalendrar visas, försök uppdatera manuellt i Tasks.org-inställningarna
* Se till att du har minst en uppgift skapad på servern (du kan skapa en i macOS Påminnelser först)
* Kontrollera nätverksanslutning till `caldav.forwardemail.net`

### Hur ställer jag in SRS för Forward Email {#how-do-i-set-up-srs-for-forward-email}

Vi konfigurerar automatiskt [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") – du behöver inte göra detta själv.

### Hur ställer jag in MTA-STS för Forward Email {#how-do-i-set-up-mta-sts-for-forward-email}

Vänligen se [vår sektion om MTA-STS](#do-you-support-mta-sts) för mer information.

### Hur lägger jag till en profilbild till min e-postadress {#how-do-i-add-a-profile-picture-to-my-email-address}

Om du använder Gmail, följ dessa steg nedan:

1. Gå till <https://google.com> och logga ut från alla e-postkonton
2. Klicka på "Logga in" och i rullgardinsmenyn klicka på "annat konto"
3. Välj "Använd ett annat konto"
4. Välj "Skapa konto"
5. Välj "Använd min nuvarande e-postadress istället"
6. Ange din e-postadress med egen domän
7. Hämta verifieringsmailet som skickats till din e-postadress
8. Ange verifieringskoden från detta mail
9. Fyll i profilinformationen för ditt nya Google-konto
10. Godkänn alla sekretess- och användarvillkor
11. Gå till <https://google.com> och klicka uppe till höger på din profilikon, klicka sedan på "ändra"-knappen
12. Ladda upp ett nytt foto eller avatar för ditt konto
13. Ändringarna tar ungefär 1-2 timmar att slå igenom, men kan ibland gå mycket snabbt.
14. Skicka ett testmail och profilbilden bör visas.
## Avancerade funktioner {#advanced-features}

### Stöder ni nyhetsbrev eller e-postlistor för marknadsföringsrelaterad e-post {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Ja, du kan läsa mer på <https://forwardemail.net/guides/newsletter-with-listmonk>.

Observera att för att upprätthålla IP-rykte och säkerställa leveransbarhet har Forward Email en manuell granskningsprocess per domän för **godkännande av nyhetsbrev**. Mejla <support@forwardemail.net> eller öppna en [hjälpförfrågan](https://forwardemail.net/help) för godkännande. Detta tar vanligtvis mindre än 24 timmar, där de flesta förfrågningar behandlas inom 1-2 timmar. Inom en snar framtid siktar vi på att göra denna process omedelbar med ytterligare spamkontroller och varningar. Denna process säkerställer att dina mejl når inkorgen och att dina meddelanden inte markeras som skräppost.

### Stöder ni att skicka e-post med API {#do-you-support-sending-email-with-api}

Ja, från och med maj 2023 stödjer vi att skicka e-post med API som ett tillägg för alla betalande användare.

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktigt:
  </strong>
  <span>
    Vänligen säkerställ att du har läst våra <a href="/terms" class="alert-link" target="_blank">Villkor</a>, <a href="/privacy" class="alert-link" target="_blank">Integritetspolicy</a>, och <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Outbound SMTP Limits</a> &ndash; din användning betraktas som bekräftelse och godkännande.
  </span>
</div>

Se vår sektion om [E-post](/email-api#outbound-emails) i vår API-dokumentation för alternativ, exempel och mer insikt.

För att skicka utgående e-post med vårt API måste du använda din API-token som finns under [Min säkerhet](/my-account/security).

### Stöder ni att ta emot e-post med IMAP {#do-you-support-receiving-email-with-imap}

Ja, från och med 16 oktober 2023 stödjer vi att ta emot e-post via IMAP som ett tillägg för alla betalande användare.  **Vänligen läs vår djupgående artikel** om [hur vår krypterade SQLite-mailboxlagringsfunktion fungerar](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="imap-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktigt:
  </strong>
  <span>
    Vänligen säkerställ att du har läst våra <a href="/terms" class="alert-link" target="_blank">Villkor</a> och <a href="/privacy" class="alert-link" target="_blank">Integritetspolicy</a> &ndash; din användning betraktas som bekräftelse och godkännande.
  </span>
</div>

1. Skapa ett nytt alias för din domän under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Aliaser (t.ex. <code><hello@example.com></code>)

2. Klicka på <strong class="text-success"><i class="fa fa-key"></i> Generera lösenord</strong> bredvid det nyligen skapade aliaset. Kopiera till ditt urklipp och spara det genererade lösenordet säkert som visas på skärmen.

3. Använd din föredragna e-postapplikation för att lägga till eller konfigurera ett konto med ditt nyss skapade alias (t.ex. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tips:
     </strong>
     <span>Vi rekommenderar att använda <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, eller <a href="/blog/open-source" class="alert-link" target="_blank">ett open-source och integritetsfokuserat alternativ</a>.</span>
   </div>

4. När du uppmanas att ange IMAP-servernamn, skriv `imap.forwardemail.net`

5. När du uppmanas att ange IMAP-serverport, skriv `993` (SSL/TLS) – se [alternativa IMAP-portar](/faq#what-are-your-imap-server-configuration-settings) vid behov
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tips:
     </strong>
     <span>Om du använder Thunderbird, se till att "Anslutningssäkerhet" är inställd på "SSL/TLS" och autentiseringsmetoden är inställd på "Normalt lösenord".</span>
   </div>
6. När du uppmanas att ange IMAP-serverlösenord, klistra in lösenordet från <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> i steg 2 ovan

7. **Spara dina inställningar** – om du har problem, vänligen <a href="/help">kontakta oss</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Grattis!
    </strong>
    <span>
      Du har framgångsrikt slutfört alla steg.
    </span>
  </div>
</div>

</div>

### Stöder ni POP3 {#do-you-support-pop3}

Ja, från och med den 4 december 2023 stödjer vi [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) som ett tillägg för alla betalande användare.  **Vänligen läs vår djupgående artikel** om [hur vår krypterade SQLite-postlådefunktion fungerar](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="pop3-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktigt:
  </strong>
  <span>
    Vänligen säkerställ att du har läst våra <a href="/terms" class="alert-link" target="_blank">Villkor</a> och <a href="/privacy" class="alert-link" target="_blank">Integritetspolicy</a> &ndash; din användning betraktas som bekräftelse och godkännande.
  </span>
</div>

1. Skapa ett nytt alias för din domän under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Aliaser (t.ex. <code><hello@example.com></code>)

2. Klicka på <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> bredvid det nyligen skapade aliaset. Kopiera till ditt urklipp och spara det genererade lösenordet säkert som visas på skärmen.

3. Använd din föredragna e-postapplikation för att lägga till eller konfigurera ett konto med ditt nyligen skapade alias (t.ex. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tips:
     </strong>
     <span>Vi rekommenderar att använda <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, eller <a href="/blog/open-source" class="alert-link" target="_blank">ett open-source och integritetsfokuserat alternativ</a>.</span>
   </div>

4. När du uppmanas att ange POP3-servernamn, skriv `pop3.forwardemail.net`

5. När du uppmanas att ange POP3-serverport, skriv `995` (SSL/TLS) – se [alternativa POP3-portar](/faq#what-are-your-pop3-server-configuration-settings) vid behov
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tips:
     </strong>
     <span>Om du använder Thunderbird, se till att "Anslutningssäkerhet" är inställd på "SSL/TLS" och autentiseringsmetoden är inställd på "Normalt lösenord".</span>
   </div>

6. När du uppmanas att ange POP3-serverlösenord, klistra in lösenordet från <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> i steg 2 ovan

7. **Spara dina inställningar** – om du har problem, vänligen <a href="/help">kontakta oss</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Grattis!
    </strong>
    <span>
      Du har framgångsrikt slutfört alla steg.
    </span>
  </div>
</div>

</div>

### Stöder ni kalendrar (CalDAV) {#do-you-support-calendars-caldav}

Ja, från och med den 5 februari 2024 har vi lagt till denna funktion. Vår server är `caldav.forwardemail.net` och övervakas även på vår <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statussida</a>.
Det stöder både IPv4 och IPv6 och är tillgängligt över port `443` (HTTPS).

| Inloggning | Exempel                    | Beskrivning                                                                                                                                                                               |
| ---------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Användarnamn | `user@example.com`         | E-postadress för ett alias som finns för domänen på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a>. |
| Lösenord   | `************************` | Alias-specifikt genererat lösenord.                                                                                                                                                        |

För att använda kalenderstöd måste **användaren** vara e-postadressen för ett alias som finns för domänen på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> – och **lösenordet** måste vara ett alias-specifikt genererat lösenord.

### Stöder ni uppgifter och påminnelser (CalDAV VTODO) {#do-you-support-tasks-and-reminders-caldav-vtodo}

Ja, från och med 14 oktober 2025 har vi lagt till CalDAV VTODO-stöd för uppgifter och påminnelser. Detta använder samma server som vårt kalenderstöd: `caldav.forwardemail.net`.

Vår CalDAV-server stöder både kalenderhändelser (VEVENT) och uppgiftskomponenter (VTODO) med hjälp av **enhetliga kalendrar**. Det betyder att varje kalender kan innehålla både händelser och uppgifter, vilket ger maximal flexibilitet och kompatibilitet över alla CalDAV-klienter.

**Hur kalendrar och listor fungerar:**

* **Varje kalender stöder både händelser och uppgifter** – Du kan lägga till händelser, uppgifter eller båda i vilken kalender som helst
* **Apple Påminnelser-listor** – Varje lista du skapar i Apple Påminnelser blir en separat kalender på servern
* **Flera kalendrar** – Du kan skapa så många kalendrar du behöver, var och en med eget namn, färg och organisation
* **Synkronisering mellan klienter** – Uppgifter och händelser synkroniseras sömlöst mellan alla kompatibla klienter

**Stödda uppgiftsklienter:**

* **macOS Påminnelser** – Fullt inbyggt stöd för skapande, redigering, slutförande och synkronisering av uppgifter
* **iOS Påminnelser** – Fullt inbyggt stöd på alla iOS-enheter
* **Tasks.org (Android)** – Populär öppen källkod-uppgiftshanterare med CalDAV-synk
* **Thunderbird** – Uppgifts- och kalenderstöd i skrivbords-e-postklient
* **Alla CalDAV-kompatibla uppgiftshanterare** – Standardstöd för VTODO-komponenten

**Stödda uppgiftsfunktioner:**

* Skapande, redigering och borttagning av uppgifter
* Förfallodatum och startdatum
* Uppgiftsstatus (NEEDS-ACTION, IN-PROCESS, COMPLETED, CANCELLED)
* Prioritetsnivåer för uppgifter
* Återkommande uppgifter
* Uppgiftsbeskrivningar och anteckningar
* Synkronisering över flera enheter
* Deluppgifter med RELATED-TO-egenskap
* Uppgiftspåminnelser med VALARM

Inloggningsuppgifterna är samma som för kalenderstöd:

| Inloggning | Exempel                    | Beskrivning                                                                                                                                                                               |
| ---------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Användarnamn | `user@example.com`         | E-postadress för ett alias som finns för domänen på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a>. |
| Lösenord   | `************************` | Alias-specifikt genererat lösenord.                                                                                                                                                        |

**Viktiga anteckningar:**

* **Varje Påminnelser-lista är en separat kalender** – När du skapar en ny lista i Apple Påminnelser skapas en ny kalender på CalDAV-servern
* **Thunderbird-användare** – Du måste manuellt prenumerera på varje kalender/lista du vill synkronisera, eller använda kalenderns hem-URL: `https://caldav.forwardemail.net/dav/your-email@domain.com/`
* **Apple-användare** – Kalenderupptäckt sker automatiskt, så alla dina kalendrar och listor visas i Kalender.app och Påminnelser.app
* **Enhetliga kalendrar** – Alla kalendrar stöder både händelser och uppgifter, vilket ger dig flexibilitet i hur du organiserar din data
### Stöder ni kontakter (CardDAV) {#do-you-support-contacts-carddav}

Ja, från och med den 12 juni 2025 har vi lagt till denna funktion. Vår server är `carddav.forwardemail.net` och övervakas även på vår <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statussida</a>.

Den stöder både IPv4 och IPv6 och är tillgänglig över port `443` (HTTPS).

| Inloggning | Exempel                    | Beskrivning                                                                                                                                                                               |
| -----------| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Användarnamn | `user@example.com`         | E-postadress för ett alias som finns för domänen på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a>.       |
| Lösenord   | `************************` | Alias-specifikt genererat lösenord.                                                                                                                                                        |

För att använda kontaktsupporten måste **användaren** vara e-postadressen för ett alias som finns för domänen på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> – och **lösenordet** måste vara ett alias-specifikt genererat lösenord.

### Stöder ni att skicka e-post med SMTP {#do-you-support-sending-email-with-smtp}

Ja, från och med maj 2023 stödjer vi att skicka e-post med SMTP som ett tillägg för alla betalande användare.

<div id="smtp-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktigt:
  </strong>
  <span>
    Se till att du har läst våra <a href="/terms" class="alert-link" target="_blank">Villkor</a>, <a href="/privacy" class="alert-link" target="_blank">Integritetspolicy</a> och <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Outbound SMTP Limits</a> &ndash; din användning betraktas som bekräftelse och godkännande.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktigt:
  </strong>
  <span>
    Om du använder Gmail, se vår <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">Guide för att skicka mail som Gmail med anpassad domän</a>. Om du är utvecklare, se vår <a class="alert-link" href="/email-api#outbound-emails" target="_blank">email API-dokumentation</a>.
  </span>
</div>

1. Gå till <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Inställningar <i class="fa fa-angle-right"></i> Outbound SMTP-konfiguration och följ installationsinstruktionerna

2. Skapa ett nytt alias för din domän under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Aliaser (t.ex. <code><hello@example.com></code>)

3. Klicka på <strong class="text-success"><i class="fa fa-key"></i> Generera lösenord</strong> bredvid det nyligen skapade aliaset. Kopiera till ditt urklipp och spara det genererade lösenordet säkert som visas på skärmen.

4. Använd din föredragna e-postapplikation för att lägga till eller konfigurera ett konto med ditt nyligen skapade alias (t.ex. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tips:
     </strong>
     <span>Vi rekommenderar att du använder <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> eller <a href="/blog/open-source" class="alert-link" target="_blank">ett open-source och integritetsfokuserat alternativ</a>.</span>
   </div>
5. När du uppmanas att ange SMTP-servernamn, skriv `smtp.forwardemail.net`

6. När du uppmanas att ange SMTP-serverport, skriv `465` (SSL/TLS) – se [alternativa SMTP-portar](/faq#what-are-your-smtp-server-configuration-settings) vid behov
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tips:
     </strong>
     <span>Om du använder Thunderbird, se till att "Anslutningssäkerhet" är inställt på "SSL/TLS" och att autentiseringsmetoden är inställd på "Normalt lösenord".</span>
   </div>

7. När du uppmanas att ange SMTP-serverlösenord, klistra in lösenordet från <strong class="text-success"><i class="fa fa-key"></i> Generera lösenord</strong> i steg 3 ovan

8. **Spara dina inställningar och skicka ditt första testmail** – om du har problem, vänligen <a href="/help">kontakta oss</a>

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktigt:
  </strong>
  <span>
    Observera att för att upprätthålla IP-rykte och säkerställa leveransbarhet har vi en manuell granskningsprocess per domän för godkännande av utgående SMTP. Detta tar vanligtvis mindre än 24 timmar, där de flesta förfrågningar behandlas inom 1-2 timmar. Inom en snar framtid siktar vi på att göra denna process omedelbar med ytterligare spamkontroller och aviseringar. Denna process säkerställer att dina mejl når inkorgen och att dina meddelanden inte markeras som skräppost.
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Grattis!
    </strong>
    <span>
      Du har framgångsrikt slutfört alla steg.
    </span>
  </div>
</div>

</div>

### Stöder ni OpenPGP/MIME, end-to-end-kryptering ("E2EE") och Web Key Directory ("WKD") {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Ja, vi stödjer [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [end-to-end-kryptering ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption) och upptäckt av publika nycklar med hjälp av [Web Key Directory ("WKD")](https://wiki.gnupg.org/WKD). Du kan konfigurera OpenPGP med [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) eller [hosta dina egna nycklar](https://wiki.gnupg.org/WKDHosting) (se [denna gist för WKD-serverinställning](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* WKD-uppslag cachas i 1 timme för att säkerställa snabb e-postleverans → därför, om du lägger till, ändrar eller tar bort din WKD-nyckel, vänligen mejla oss på `support@forwardemail.net` med din e-postadress så att vi manuellt kan rensa cachen.
* Vi stödjer PGP-kryptering för meddelanden som vidarebefordras via WKD-uppslag eller med en uppladdad PGP-nyckel i vårt gränssnitt.
* Uppladdade nycklar har företräde så länge PGP-rutan är aktiverad/ikryssad.
* Meddelanden som skickas till webhooks är för närvarande inte krypterade med PGP.
* Om du har flera alias som matchar en given vidarebefordringsadress (t.ex. regex/wildcard/exakt kombination) och om mer än ett av dessa innehåller en uppladdad PGP-nyckel och har PGP ikryssat → då skickar vi ett felmeddelande via e-post och krypterar inte meddelandet med din uppladdade PGP-nyckel. Detta är mycket ovanligt och gäller vanligtvis avancerade användare med komplexa aliasregler.
* **PGP-kryptering kommer inte att tillämpas på e-post vidarebefordrad via våra MX-servrar om avsändaren har en DMARC-policy som avvisar. Om du behöver PGP-kryptering på *all* e-post rekommenderar vi att använda vår IMAP-tjänst och konfigurera din PGP-nyckel för ditt alias för inkommande e-post.**

**Du kan validera din Web Key Directory-konfiguration på <https://wkd.chimbosonic.com/> (öppen källkod) eller <https://www.webkeydirectory.com/> (proprietär).**

<div class="alert my-3 alert-success">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Automatisk kryptering:
  </strong>
  <span>Om du använder vår <a href="#do-you-support-sending-email-with-smtp" class="alert-link">utgående SMTP-tjänst</a> och skickar okrypterade meddelanden, kommer vi automatiskt att försöka kryptera meddelanden på per-mottagare-basis med hjälp av <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Key Directory ("WKD")</a>.</span>
</div>
<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktigt:
  </strong>
  <span>
    Du måste följa alla följande steg för att aktivera OpenPGP för ditt anpassade domännamn.
  </span>
</div>

1. Ladda ner och installera din e-postklients rekommenderade plugin nedan:

   | E-postklient   | Plattform | Rekommenderad plugin                                                                                                                                                                | Noteringar                                                                                                                                                                                                                                                                                                                                                                                                                              |
   | -------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Thunderbird    | Skrivbord | [Konfigurera OpenPGP i Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird har inbyggt stöd för OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                              |
   | Gmail          | Webbläsare| [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download) (proprietär licens)                                                                        | Gmail stödjer inte OpenPGP, men du kan ladda ner den öppna källkodspluginen [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                      |
   | Apple Mail     | macOS     | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation)                                                                                       | Apple Mail stödjer inte OpenPGP, men du kan ladda ner den öppna källkodspluginen [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation).                                                                                                                                                                                                                                                             |
   | Apple Mail     | iOS       | [PGPro](https://github.com/opensourceios/PGPro/) eller [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (proprietär licens)                      | Apple Mail stödjer inte OpenPGP, men du kan ladda ner den öppna källkodspluginen [PGPro](https://github.com/opensourceios/PGPro/) eller [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                    |
   | Outlook        | Windows   | [gpg4win](https://www.gpg4win.de/index.html)                                                                                                                                       | Outlooks skrivbords-e-postklient stödjer inte OpenPGP, men du kan ladda ner den öppna källkodspluginen [gpg4win](https://www.gpg4win.de/index.html).                                                                                                                                                                                                                                                                                    |
   | Outlook        | Webbläsare| [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download) (proprietär licens)                                                                        | Outlooks webbaserade e-postklient stödjer inte OpenPGP, men du kan ladda ner den öppna källkodspluginen [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                          |
   | Android        | Mobil     | [OpenKeychain](https://www.openkeychain.org/) eller [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email)                                               | [Android e-postklienter](/blog/open-source/android-email-clients) såsom [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) och [FairEmail](https://github.com/M66B/FairEmail) stödjer båda den öppna källkodspluginen [OpenKeychain](https://www.openkeychain.org/). Du kan alternativt använda den öppna källkodspluginen (proprietär licensiering) [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email). |
   | Google Chrome  | Webbläsare| [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download) (proprietär licens)                                                                        | Du kan ladda ner den öppna källkods webbläsartillägget [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                         |
   | Mozilla Firefox| Webbläsare| [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download) (proprietär licens)                                                                        | Du kan ladda ner den öppna källkods webbläsartillägget [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                         |
   | Microsoft Edge | Webbläsare| [Mailvelope](https://mailvelope.com/)                                                                                                                                               | Du kan ladda ner den öppna källkods webbläsartillägget [Mailvelope](https://mailvelope.com/).                                                                                                                                                                                                                                                                                                                                          |
   | Brave          | Webbläsare| [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download) (proprietär licens)                                                                        | Du kan ladda ner den öppna källkods webbläsartillägget [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                         |
   | Balsa          | Skrivbord | [Konfigurera OpenPGP i Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING)                                                                        | Balsa har inbyggt stöd för OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                                      |
   | KMail          | Skrivbord | [Konfigurera OpenPGP i KMail](https://userbase.kde.org/KMail/PGP_MIME)                                                                                                             | KMail har inbyggt stöd för OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                                      |
   | GNOME Evolution| Skrivbord | [Konfigurera OpenPGP i Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en)                                                                           | GNOME Evolution har inbyggt stöd för OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                          |
   | Terminal       | Skrivbord | [Konfigurera gpg i Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key)                     | Du kan använda det öppna källkodsverktyget [gpg kommandorad](https://www.gnupg.org/download/) för att generera en ny nyckel från kommandoraden.                                                                                                                                                                                                                                                                                        |
2. Öppna pluginet, skapa din publika nyckel och konfigurera din e-postklient för att använda den.

3. Ladda upp din publika nyckel på <https://keys.openpgp.org/upload>.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tips:
     </strong>
     <span>Du kan besöka <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a> för att hantera din nyckel i framtiden.</span>
   </div>

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Valfritt tillägg:
     </strong>
     <span>
       Om du använder vår <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">krypterade lagring (IMAP/POP3)</a>-tjänst och vill att <i>all</i> e-post som lagras i din (redan krypterade) SQLite-databas ska krypteras med din publika nyckel, gå då till <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Aliaser (t.ex. <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Redigera <i class="fa fa-angle-right"></i> OpenPGP och ladda upp din publika nyckel.
     </span>
   </div>

4. Lägg till en ny `CNAME`-post till ditt domännamn (t.ex. `example.com`):

   <table class="table table-striped table-hover my-3">
     <thead class="thead-dark">
       <tr>
         <th>Namn/Värd/Alias</th>
         <th class="text-center">TTL</th>
         <th>Typ</th>
         <th>Svar/Värde</th>
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
     <span>Om ditt alias använder våra <a class="alert-link" href="/disposable-addresses" target="_blank">vanity/disposable-domäner</a> (t.ex. <code>hideaddress.net</code>), kan du hoppa över detta steg.</span>
   </div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Grattis!
    </strong>
    <span>
      Du har framgångsrikt slutfört alla steg.
    </span>
  </div>
</div>

### Stöder ni S/MIME-kryptering {#do-you-support-smime-encryption}

Ja, vi stödjer [S/MIME (Secure/Multipurpose Internet Mail Extensions)](https://en.wikipedia.org/wiki/S/MIME)-kryptering enligt definitionen i [RFC 8551](https://datatracker.ietf.org/doc/html/rfc8551). S/MIME erbjuder end-to-end-kryptering med hjälp av X.509-certifikat, vilket är brett stödjat av företags-e-postklienter.

Vi stödjer både RSA- och ECC (Elliptic Curve Cryptography)-certifikat:

* **RSA-certifikat**: minst 2048-bitars, 4096-bitars rekommenderas
* **ECC-certifikat**: P-256, P-384 och P-521 NIST-kurvor

För att konfigurera S/MIME-kryptering för ditt alias:

1. Skaffa ett S/MIME-certifikat från en betrodd certifikatutfärdare (CA) eller generera ett självsignerat certifikat för testning.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tips:
     </strong>
     <span>Gratis S/MIME-certifikat finns tillgängliga från leverantörer som <a class="alert-link" href="https://www.actalis.com/s-mime-certificates.aspx">Actalis</a> eller <a class="alert-link" href="https://extrassl.actalis.com/portal/uapub/freemail">Actalis Free S/MIME</a>.</span>
   </div>

2. Exportera ditt certifikat i PEM-format (endast det publika certifikatet, inte den privata nyckeln).

3. Gå till <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Aliaser (t.ex. <code><hello@example.com></code>) <i class="fa fa-angle-right"></i> Redigera <i class="fa fa-angle-right"></i> S/MIME och ladda upp ditt publika certifikat.
4. När det är konfigurerat kommer alla inkommande e-postmeddelanden till din alias att krypteras med ditt S/MIME-certifikat innan de lagras eller vidarebefordras.

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Notera:
     </strong>
     <span>
       S/MIME-kryptering tillämpas på inkommande meddelanden som inte redan är krypterade. Om ett meddelande redan är krypterat med OpenPGP eller S/MIME kommer det inte att krypteras igen.
     </span>
   </div>

   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Viktigt:
     </strong>
     <span>
       S/MIME-kryptering kommer inte att tillämpas på e-post vidarebefordran via våra MX-servrar om avsändaren hade en DMARC-policy för avvisning. Om du behöver S/MIME-kryptering på <em>all</em> e-post föreslår vi att du använder vår IMAP-tjänst och konfigurerar ditt S/MIME-certifikat för din alias för inkommande e-post.
     </span>
   </div>

Följande e-postklienter har inbyggt stöd för S/MIME:

| E-postklient     | Plattform | Noteringar                                                                                                         |
| ---------------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| Apple Mail       | macOS    | Inbyggt stöd för S/MIME. Gå till Mail > Inställningar > Konton > ditt konto > Tillit för att konfigurera certifikat. |
| Apple Mail       | iOS      | Inbyggt stöd för S/MIME. Gå till Inställningar > Mail > Konton > ditt konto > Avancerat > S/MIME för att konfigurera. |
| Microsoft Outlook| Windows  | Inbyggt stöd för S/MIME. Gå till Arkiv > Alternativ > Trust Center > Inställningar för Trust Center > E-postsäkerhet för att konfigurera. |
| Microsoft Outlook| macOS    | Inbyggt stöd för S/MIME. Gå till Verktyg > Konton > Avancerat > Säkerhet för att konfigurera.                      |
| Thunderbird      | Skrivbord| Inbyggt stöd för S/MIME. Gå till Kontoinställningar > End-To-End Encryption > S/MIME för att konfigurera.          |
| GNOME Evolution  | Skrivbord| Inbyggt stöd för S/MIME. Gå till Redigera > Inställningar > E-postkonton > ditt konto > Säkerhet för att konfigurera. |
| KMail            | Skrivbord| Inbyggt stöd för S/MIME. Gå till Inställningar > Konfigurera KMail > Identiteter > din identitet > Kryptografi för att konfigurera. |

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Grattis!
    </strong>
    <span>
      Du har framgångsrikt konfigurerat S/MIME-kryptering för din alias.
    </span>
  </div>
</div>

### Stöder ni Sieve e-postfiltrering {#do-you-support-sieve-email-filtering}

Ja! Vi stödjer [Sieve](https://en.wikipedia.org/wiki/Sieve_\(mail_filtering_language\)) e-postfiltrering enligt definitionen i [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228). Sieve är ett kraftfullt, standardiserat skriptspråk för serverbaserad e-postfiltrering som låter dig automatiskt organisera, filtrera och svara på inkommande meddelanden.

#### Stödda Sieve-tillägg {#supported-sieve-extensions}

Vi stödjer ett omfattande set av Sieve-tillägg:

| Tillägg                      | RFC                                                                                     | Beskrivning                                     |
| ---------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `fileinto`                   | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                               | Placera meddelanden i specifika mappar          |
| `reject` / `ereject`         | [RFC 5429](https://datatracker.ietf.org/doc/html/rfc5429)                               | Avvisa meddelanden med ett fel                   |
| `vacation`                   | [RFC 5230](https://datatracker.ietf.org/doc/html/rfc5230)                               | Automatiska semester-/frånvarosvar               |
| `vacation-seconds`           | [RFC 6131](https://datatracker.ietf.org/doc/html/rfc6131)                               | Finjusterade intervall för semester-svar         |
| `imap4flags`                 | [RFC 5232](https://datatracker.ietf.org/doc/html/rfc5232)                               | Sätt IMAP-flaggor (\Seen, \Flagged, etc.)        |
| `envelope`                   | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                               | Testa avsändare/mottagare i kuvertet             |
| `body`                       | [RFC 5173](https://datatracker.ietf.org/doc/html/rfc5173)                               | Testa innehållet i meddelandets kropp            |
| `variables`                  | [RFC 5229](https://datatracker.ietf.org/doc/html/rfc5229)                               | Spara och använd variabler i skript               |
| `relational`                 | [RFC 5231](https://datatracker.ietf.org/doc/html/rfc5231)                               | Relationella jämförelser (större än, mindre än)  |
| `comparator-i;ascii-numeric` | [RFC 4790](https://datatracker.ietf.org/doc/html/rfc4790)                               | Numeriska jämförelser                             |
| `copy`                       | [RFC 3894](https://datatracker.ietf.org/doc/html/rfc3894)                               | Kopiera meddelanden vid omdirigering             |
| `editheader`                 | [RFC 5293](https://datatracker.ietf.org/doc/html/rfc5293)                               | Lägg till eller ta bort meddelandehuvuden        |
| `date`                       | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                               | Testa datum-/tidsvärden                           |
| `index`                      | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                               | Åtkomst till specifika förekomster i huvuden     |
| `regex`                      | [draft-ietf-sieve-regex](https://datatracker.ietf.org/doc/html/draft-ietf-sieve-regex)  | Matchning med reguljära uttryck                   |
| `enotify`                    | [RFC 5435](https://datatracker.ietf.org/doc/html/rfc5435)                               | Skicka notifieringar (t.ex. mailto:)              |
| `environment`                | [RFC 5183](https://datatracker.ietf.org/doc/html/rfc5183)                               | Åtkomst till miljöinformation                      |
| `mailbox`                    | [RFC 5490](https://datatracker.ietf.org/doc/html/rfc5490)                               | Testa postlådas existens, skapa postlådor        |
| `special-use`                | [RFC 8579](https://datatracker.ietf.org/doc/html/rfc8579)                               | Placera i specialanvända postlådor (\Junk, \Trash) |
| `duplicate`                  | [RFC 7352](https://datatracker.ietf.org/doc/html/rfc7352)                               | Upptäck dubblettmeddelanden                       |
| `ihave`                      | [RFC 5463](https://datatracker.ietf.org/doc/html/rfc5463)                               | Testa tillgänglighet av tillägg                    |
| `subaddress`                 | [RFC 5233](https://datatracker.ietf.org/doc/html/rfc5233)                               | Åtkomst till delar av användar+detalj-adresser    |
#### Extensions som inte stöds {#extensions-not-supported}

Följande extensions stöds för närvarande inte:

| Extension                                                       | Orsak                                                              |
| --------------------------------------------------------------- | ------------------------------------------------------------------- |
| `include`                                                       | Säkerhetsrisk (scriptinjektion) och kräver global skriptlagring    |
| `mboxmetadata` / `servermetadata`                               | Kräver stöd för IMAP METADATA extension                             |
| `foreverypart` / `mime` / `extracttext` / `replace` / `enclose` | Komplex MIME-trädmanipulation är ännu inte implementerad           |

#### Exempel på Sieve-skript {#example-sieve-scripts}

**Filtrera nyhetsbrev till en mapp:**

```sieve
require ["fileinto"];

if header :contains "List-Id" "newsletter" {
    fileinto "Newsletters";
}
```

**Automatiskt svar vid semester:**

```sieve
require ["vacation"];

vacation :days 7 :subject "Out of Office"
    "I am currently out of the office and will respond when I return.";
```

**Markera meddelanden från viktiga avsändare:**

```sieve
require ["imap4flags"];

if address :is "from" "boss@example.com" {
    setflag "\\Flagged";
}
```

**Avvisa spam med specifika ämnen:**

```sieve
require ["reject"];

if header :contains "subject" ["lottery", "winner", "urgent transfer"] {
    reject "Message rejected due to spam content.";
}
```

#### Hantera Sieve-skript {#managing-sieve-scripts}

Du kan hantera dina Sieve-skript på flera sätt:

1. **Webbgränssnitt**: Gå till <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Aliaser <i class="fa fa-angle-right"></i> Sieve-skript för att skapa och hantera skript.

2. **ManageSieve-protokoll**: Anslut med valfri ManageSieve-kompatibel klient (som Thunderbirds Sieve-tillägg eller [sieve-connect](https://github.com/philpennock/sieve-connect)) till `imap.forwardemail.net`. Använd port `2190` med STARTTLS (rekommenderas för de flesta klienter) eller port `4190` med implicit TLS.

3. **API**: Använd vårt [REST API](/api#sieve-scripts) för att programmera hantering av skript.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Notera:
  </strong>
  <span>
    Sieve-filtrering tillämpas på inkommande meddelanden innan de lagras i din brevlåda. Skript körs i prioritetsordning och den första matchande åtgärden avgör hur meddelandet hanteras.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Säkerhet:
  </strong>
  <span>
    Av säkerhetsskäl är omdirigeringsåtgärder begränsade till 10 per skript och 100 per dag. Semester-svar är hastighetsbegränsade för att förhindra missbruk.
  </span>
</div>

### Stöder ni MTA-STS {#do-you-support-mta-sts}

Ja, från och med den 2 mars 2023 stöder vi [MTA-STS](https://www.hardenize.com/blog/mta-sts). Du kan använda [denna mall](https://github.com/jpawlowski/mta-sts.template) om du vill aktivera det på din domän.

Vår konfiguration finns offentligt på GitHub på <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### Stöder ni passkeys och WebAuthn {#do-you-support-passkeys-and-webauthn}

Ja! Från och med den 13 december 2023 har vi lagt till stöd för passkeys [på grund av stor efterfrågan](https://github.com/orgs/forwardemail/discussions/182).

Passkeys låter dig logga in säkert utan att behöva lösenord och tvåfaktorsautentisering.

Du kan verifiera din identitet med touch, ansiktsigenkänning, enhetsbaserat lösenord eller PIN-kod.

Vi tillåter att du hanterar upp till 30 passkeys samtidigt, så att du enkelt kan logga in med alla dina enheter.

Läs mer om passkeys på följande länkar:

* [Logga in på dina appar och webbplatser med passkeys](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [Använd passkeys för att logga in på appar och webbplatser på iPhone](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Wikipedia-artikel om Passkeys](https://en.wikipedia.org/wiki/Passkey_\(credential\))
### Stöder ni bästa praxis för e-post {#do-you-support-email-best-practices}

Ja. Vi har inbyggt stöd för SPF, DKIM, DMARC, ARC och SRS i alla planer. Vi har också arbetat omfattande med de ursprungliga författarna till dessa specifikationer och andra e-postexperter för att säkerställa perfektion och hög leveransbarhet.

### Stöder ni bounce-webhooks {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tips:
  </strong>
    Letar du efter dokumentation om e-postwebhooks? Se <a href="/faq#do-you-support-webhooks" class="alert-link">Stöder ni webhooks?</a> för mer insikt.
  <span>
  </span>
</div>

Ja, från och med 14 augusti 2024 har vi lagt till denna funktion. Du kan nu gå till Mitt konto → Domäner → Inställningar → Bounce Webhook URL och konfigurera en `http://` eller `https://` URL som vi skickar en `POST`-förfrågan till varje gång utgående SMTP-e-post studsar.

Detta är användbart för att du ska kunna hantera och övervaka din utgående SMTP – och kan användas för att underhålla prenumeranter, avregistreringar och upptäcka när studsar inträffar.

Bounce-webhook-payloads skickas som JSON med dessa egenskaper:

* `email_id` (Sträng) - e-post-ID som motsvarar ett e-postmeddelande i Mitt konto → E-post (utgående SMTP)
* `list_id` (Sträng) - värdet för `List-ID`-huvudet (skiftlägesokänsligt), om något, från det ursprungliga utgående e-postmeddelandet
* `list_unsubscribe` (Sträng) - värdet för `List-Unsubscribe`-huvudet (skiftlägesokänsligt), om något, från det ursprungliga utgående e-postmeddelandet
* `feedback_id` (Sträng) - värdet för `Feedback-ID`-huvudet (skiftlägesokänsligt), om något, från det ursprungliga utgående e-postmeddelandet
* `recipient` (Sträng) - e-postadressen för mottagaren som studsat eller fått fel
* `message` (Sträng) - ett detaljerat felmeddelande för studsen
* `response` (Sträng) - SMTP-svarsmeddelandet
* `response_code` (Nummer) - den tolkade SMTP-svarskoden
* `truth_source` (Sträng) - om svarskoden kom från en betrodd källa, kommer detta värde att fyllas med rot-domännamnet (t.ex. `google.com` eller `yahoo.com`)
* `bounce` (Objekt) - ett objekt som innehåller följande egenskaper som beskriver studsen och avvisningsstatusen
  * `action` (Sträng) - studshandling (t.ex. `"reject"`)
  * `message` (Sträng) - studsanledning (t.ex. `"Message Sender Blocked By Receiving Server"`)
  * `category` (Sträng) - studskategori (t.ex. `"block"`)
  * `code` (Nummer) - studskod (t.ex. `554`)
  * `status` (Sträng) - studskod från svarsmeddelandet (t.ex. `5.7.1`)
  * `line` (Nummer) - tolkad radnummer, om något, [från Zone-MTA bounce parse list](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt) (t.ex. `526`)
* `headers` (Objekt) - nyckel-värde-par av headers för det utgående e-postmeddelandet
* `bounced_at` (Sträng) - [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) formaterat datum för när studsfel inträffade

Till exempel:

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

Här är några ytterligare anteckningar angående bounce-webhooks:

* Om webhook-payloaden innehåller ett värde för `list_id`, `list_unsubscribe` eller `feedback_id`, bör du vidta lämpliga åtgärder för att ta bort `recipient` från listan om det behövs.
  * Om värdet för `bounce.category` var någon av `"block"`, `"recipient"`, `"spam"` eller `"virus"`, bör du definitivt ta bort användaren från listan.
* Om du behöver verifiera webhook-payloads (för att säkerställa att de faktiskt kommer från vår server), kan du [lösa den fjärranslutna klientens IP-adress till klientens värdnamn med en omvänd uppslagning](https://nodejs.org/api/dns.html#dnspromisesreverseip) – det ska vara `smtp.forwardemail.net`.
  * Du kan också kontrollera IP-adressen mot [våra publicerade IP-adresser](#what-are-your-servers-ip-addresses).
  * Gå till Mitt konto → Domäner → Inställningar → Webhook Signature Payload Verification Key för att få din webhook-nyckel.
    * Du kan rotera denna nyckel när som helst av säkerhetsskäl.
    * Beräkna och jämför värdet `X-Webhook-Signature` från vår webhook-förfrågan med det beräknade kroppsvärdet med hjälp av denna nyckel. Ett exempel på hur man gör detta finns i [detta Stack Overflow-inlägg](https://stackoverflow.com/a/68885281).
  * Se diskussionen på <https://github.com/forwardemail/free-email-forwarding/issues/235> för mer insikt.
* Vi väntar upp till `5` sekunder på att din webhook-endpoint ska svara med statuskod `200`, och vi försöker igen upp till `1` gång.
* Om vi upptäcker att din bounce-webhook-URL har ett fel när vi försöker skicka en förfrågan till den, skickar vi ett vänligt e-postmeddelande till dig en gång i veckan.
### Stöder ni webhooks {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tips:
  </strong>
    Letar du efter dokumentation om bounce-webhooks? Se <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Stöder ni bounce-webhooks?</a> för mer insikt.
  <span>
  </span>
</div>

Ja, från och med den 15 maj 2020 har vi lagt till denna funktion. Du kan enkelt lägga till webhook(s) precis som du skulle med vilken mottagare som helst! Vänligen säkerställ att du har "http" eller "https" protokollet prefixat i webhookens URL.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Förbättrat sekretesskydd:
  </strong>
  <span>
    Om du har en betald plan (som har förbättrat sekretesskydd), gå då till <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> och klicka på "Aliaser" bredvid din domän för att konfigurera dina webhooks. Om du vill veta mer om betalda planer, se vår <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Prissättning</a>-sida. Annars kan du fortsätta följa instruktionerna nedan.
  </span>
</div>

Om du har gratisplanen, lägg då helt enkelt till en ny DNS <strong class="notranslate">TXT</strong>-post som visas nedan:

Till exempel, om jag vill att alla e-postmeddelanden som går till `alias@example.com` ska vidarebefordras till en ny [request bin](https://requestbin.com/r/en8pfhdgcculn?inspect) test-endpoint:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Namn/Värd/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Svar/Värde</th>
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

Eller kanske vill du att alla e-postmeddelanden som går till `example.com` ska vidarebefordras till denna endpoint:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Namn/Värd/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Svar/Värde</th>
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

**Här är ytterligare anteckningar angående webhooks:**

* Om du behöver verifiera webhook-payloads (för att säkerställa att de faktiskt kommer från vår server), kan du [lösa den fjärranslutna klientens IP-adress klientvärdnamn med en omvänd uppslagning](https://nodejs.org/api/dns.html#dnspromisesreverseip) – det ska vara antingen `mx1.forwardemail.net` eller `mx2.forwardemail.net`.
  * Du kan också kontrollera IP:n mot [våra publicerade IP-adresser](#what-are-your-servers-ip-addresses).
  * Om du har en betald plan, gå till Mitt konto → Domäner → Inställningar → Webhook Signature Payload Verification Key för att få din webhook-nyckel.
    * Du kan rotera denna nyckel när som helst av säkerhetsskäl.
    * Beräkna och jämför värdet `X-Webhook-Signature` från vår webhook-förfrågan med det beräknade kroppsvärdet med hjälp av denna nyckel. Ett exempel på hur man gör detta finns i [detta Stack Overflow-inlägg](https://stackoverflow.com/a/68885281).
  * Se diskussionen på <https://github.com/forwardemail/free-email-forwarding/issues/235> för mer insikt.
* Om en webhook inte svarar med statuskod `200`, kommer vi att lagra dess svar i [felloggen som skapas](#do-you-store-error-logs) – vilket är användbart för felsökning.
* Webhook HTTP-förfrågningar kommer att försöka igen upp till 3 gånger vid varje SMTP-anslutningsförsök, med en max timeout på 60 sekunder per endpoint POST-förfrågan. **Observera att detta inte betyder att det bara försöker 3 gånger**, det kommer faktiskt att försöka kontinuerligt över tid genom att skicka en SMTP-kod 421 (vilket indikerar för avsändaren att försöka senare) efter det tredje misslyckade HTTP POST-försöket. Detta betyder att e-posten kommer att försöka kontinuerligt i dagar tills en 200-statuskod uppnås.
* Vi försöker automatiskt igen baserat på standardstatus- och felkoder som används i [superagents retry-metod](https://ladjs.github.io/superagent/#retrying-requests) (vi är underhållare).
* Vi grupperar ihop webhook HTTP-förfrågningar till samma endpoint i en förfrågan istället för flera för att spara resurser och snabba upp svarstiden. Till exempel, om du skickar ett e-postmeddelande till <webhook1@example.com>, <webhook2@example.com> och <webhook3@example.com>, och alla är konfigurerade att träffa samma *exakta* endpoint-URL, görs endast en förfrågan. Vi grupperar ihop efter exakt endpoint-matchning med strikt likhet.
* Observera att vi använder [mailparser](https://nodemailer.com/extras/mailparser/)-bibliotekets "simpleParser"-metod för att parsa meddelandet till ett JSON-vänligt objekt.
* Rå e-postvärde som en Sträng ges som egenskapen "raw".
* Autentiseringsresultat ges som egenskaperna "dkim", "spf", "arc", "dmarc" och "bimi".
* De parsade e-posthuvudena ges som egenskapen "headers" – men notera också att du kan använda "headerLines" för enklare iteration och parsing.
* De grupperade mottagarna för denna webhook grupperas ihop och ges som egenskapen "recipients".
* SMTP-sessionens information ges som egenskapen "session". Den innehåller information om avsändaren av meddelandet, ankomsttid för meddelandet, HELO och klientvärdnamn. Klientvärdnamnsvärdet som `session.clientHostname` är antingen FQDN (från en omvänd PTR-uppslagning) eller det är `session.remoteAddress` inneslutet i hakparenteser (t.ex. `"[127.0.0.1]"`).
* Om du snabbt behöver få värdet av `X-Original-To`, kan du använda värdet av `session.recipient` (se exempel nedan). Headern `X-Original-To` är en header vi lägger till meddelanden för felsökning med den ursprungliga mottagaren (innan maskerad vidarebefordran) för meddelandet.
* Om du behöver ta bort `attachments` och/eller `raw` egenskaper från payload-kroppen, lägg helt enkelt till `?attachments=false`, `?raw=false` eller `?attachments=false&raw=false` till din webhook-endpoint som en querystring-parameter (t.ex. `https://example.com/webhook?attachments=false&raw=false`).
* Om det finns bilagor, kommer de att läggas till i `attachments`-arrayen med Buffer-värden. Du kan parsa tillbaka dem till innehåll med en metod i JavaScript som:
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

### Stöder ni reguljära uttryck eller regex {#do-you-support-regular-expressions-or-regex}

Ja, från och med den 27 september 2021 har vi lagt till denna funktion. Du kan enkelt skriva reguljära uttryck ("regex") för att matcha alias och utföra ersättningar.

Reguljära uttrycks-stödda alias är sådana som börjar med `/` och slutar med `/` och deras mottagare är e-postadresser eller webhooks. Mottagarna kan också inkludera regex-ersättningsstöd (t.ex. `$1`, `$2`).

Vi stödjer två reguljära uttrycksflaggor inklusive `i` och `g`. Den skiftlägesokänsliga flaggan `i` är en permanent standard och den tillämpas alltid. Den globala flaggan `g` kan du lägga till genom att fästa slut-`/` med `/g`.

Observera att vi också stödjer vår <a href="#can-i-disable-specific-aliases">funktion för att inaktivera specifika alias</a> för mottagardelen med vårt regex-stöd.

Reguljära uttryck stöds inte på <a href="/disposable-addresses" target="_blank">globala vanity-domäner</a> (eftersom detta kan utgöra en säkerhetsrisk).

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Förbättrat integritetsskydd:
  </strong>
  <span>
    Om du har en betald plan (som har förbättrat integritetsskydd), gå då till <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> och klicka på "Alias" bredvid din domän för att konfigurera alias, inklusive sådana med reguljära uttryck. Om du vill veta mer om betalda planer, se vår <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Prissättning</a>-sida.
  </span>
</div>

#### Exempel för förbättrat integritetsskydd {#examples-for-enhanced-privacy-protection}

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Aliasnamn</th>
      <th>Effekt</th>
      <th>Test</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>/^(linus|torvalds)$/</code></td>
      <td>E-post till `linus@example.com` eller `torvalds@example.com`</td>
      <td>(<a href="https://regexr.com/8gb8n" class="alert-link">visa test på RegExr</a>)</td>
    </tr>
    <tr>
      <td><code>/^24highst(reet)$/</code></td>
      <td>E-post till `24highst@example.com` eller `24highstreet@example.com`</td>
      <td>(<a href="https://regexr.com/8g9rb" class="alert-link">visa test på RegExr</a>)</td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tips:
  </strong>
    För att testa dessa på <a href="https://regexr.com" class="alert-link">RegExr</a>, skriv uttrycket i översta rutan och skriv sedan ett exempelalias i textrutan nedanför. Om det matchar blir det blått.
  <span>
  </span>
</div>

#### Exempel för gratisplanen {#examples-for-the-free-plan}

Om du har gratisplanen, lägg då helt enkelt till en ny DNS <strong class="notranslate">TXT</strong>-post med ett eller flera av exemplen nedan:

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Enkelt exempel:</strong> Om jag vill att all e-post som går till `linus@example.com` eller `torvalds@example.com` ska vidarebefordras till `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Namn/Värd/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Svar/Värde</th>
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
  <strong>Exempel på ersättning för förnamn efternamn:</strong> Föreställ dig att alla dina företags-e-postadresser följer mönstret `firstname.lastname@example.com`. Om jag vill att all e-post som går till mönstret `firstname.lastname@example.com` ska vidarebefordras till `firstname.lastname@company.com` med ersättningsstöd (<a href="https://regexr.com/66hnu" class="alert-link">visa test på RegExr</a>):
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Namn/Värd/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Svar/Värde</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tomt</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Exempel på filtrering med plustecken och substitution:</strong> Om jag vill att alla e-postmeddelanden som går till `info@example.com` eller `support@example.com` ska vidarebefordras till `user+info@gmail.com` eller `user+support@gmail.com` respektive (med substitutionsstöd) (<a href="https://regexr.com/66ho7" class="alert-link">visa test på RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Namn/Värd/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Svar/Värde</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tomt</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Exempel på webhook-querystring-substitution:</strong> Kanske vill du att alla e-postmeddelanden som går till `example.com` ska gå till en <a href="#do-you-support-webhooks" class="alert-link">webhook</a> och ha en dynamisk querystring-nyckel "to" med värdet av användardelen i e-postadressen (<a href="https://regexr.com/66ho4" class="alert-link">visa test på RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Namn/Värd/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Svar/Värde</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tomt</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Exempel på tyst avvisning:</strong> Om du vill att alla e-postmeddelanden som matchar ett visst mönster ska inaktiveras och tyst avvisas (ser för avsändaren ut som om meddelandet skickades framgångsrikt, men går faktiskt ingenstans) med statuskod `250` (se <a href="#can-i-disable-specific-aliases" class="alert-link">Kan jag inaktivera specifika alias</a>), använd då helt enkelt samma metod med ett enda utropstecken "!". Detta indikerar för avsändaren att meddelandet levererades framgångsrikt, men det gick faktiskt ingenstans (t.ex. svart hål eller `/dev/null`).
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Namn/Värd/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Svar/Värde</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tomt</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Exempel på mjuk avvisning:</strong> Om du vill att alla e-postmeddelanden som matchar ett visst mönster ska inaktiveras och mjukt avvisas med statuskod `421` (se <a href="#can-i-disable-specific-aliases" class="alert-link">Kan jag inaktivera specifika alias</a>), använd då helt enkelt samma metod med dubbla utropstecken "!!". Detta indikerar för avsändaren att försöka skicka e-posten igen, och e-post till detta alias kommer att försöka skickas om i cirka 5 dagar och sedan avvisas permanent.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Namn/Värd/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Svar/Värde</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tomt</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!</code></td>
    </tr>
  </tbody>
</table>
<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Exempel på hård avvisning:</strong> Om du vill att alla e-postmeddelanden som matchar ett visst mönster ska inaktiveras och hårt avvisas med statuskod `550` (se <a href="#can-i-disable-specific-aliases" class="alert-link">Kan jag inaktivera specifika alias</a>), använd helt enkelt samma metod med tre utropstecken "!!!". Detta indikerar för avsändaren ett permanent fel och e-postmeddelanden kommer inte att försöka igen, de kommer att avvisas för detta alias.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Namn/Värd/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Svar/Värde</th>
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
    Nyfiken på hur man skriver ett reguljärt uttryck eller behöver testa din ersättning? Du kan gå till den kostnadsfria webbplatsen för testning av reguljära uttryck <a href="https://regexr.com" class="alert-link">RegExr</a> på <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
  <span>
  </span>
</div>

### Vad är era gränser för utgående SMTP {#what-are-your-outbound-smtp-limits}

Vi begränsar användare och domäner till 300 utgående SMTP-meddelanden per 1 dag. Detta motsvarar i genomsnitt över 9000 e-postmeddelanden per kalendermånad. Om du behöver överskrida detta antal eller har konsekvent stora e-postmeddelanden, vänligen [kontakta oss](https://forwardemail.net/help).

### Behöver jag godkännande för att aktivera SMTP {#do-i-need-approval-to-enable-smtp}

Ja, observera att för att upprätthålla IP-rykte och säkerställa leveransbarhet har Forward Email en manuell granskningsprocess per domän för godkännande av utgående SMTP. Skicka e-post till <support@forwardemail.net> eller öppna en [hjälpförfrågan](https://forwardemail.net/help) för godkännande. Detta tar vanligtvis mindre än 24 timmar, där de flesta förfrågningar behandlas inom 1-2 timmar. Inom en snar framtid siktar vi på att göra denna process omedelbar med ytterligare spamkontroller och varningar. Denna process säkerställer att dina e-postmeddelanden når inkorgen och att dina meddelanden inte markeras som skräppost.

### Vilka är era SMTP-serverinställningar {#what-are-your-smtp-server-configuration-settings}

Vår server är `smtp.forwardemail.net` och övervakas även på vår <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statussida</a>.

Den stödjer både IPv4 och IPv6 och är tillgänglig via portarna `465` och `2465` för SSL/TLS (rekommenderas) samt `587`, `2587`, `2525` och `25` för TLS (STARTTLS).

**Från och med oktober 2025** stödjer vi nu **legacy TLS 1.0**-anslutningar på portarna `2455` (SSL/TLS) och `2555` (STARTTLS) för äldre enheter som skrivare, skannrar, kameror och äldre e-postklienter som inte kan stödja moderna TLS-versioner. Dessa portar erbjuds som ett alternativ till Gmail, Yahoo, Outlook och andra leverantörer som har slutat stödja äldre TLS-protokoll.

> \[!CAUTION]
> **Legacy TLS 1.0-stöd (Portar 2455 och 2555)**: Dessa portar använder det föråldrade TLS 1.0-protokollet som har kända säkerhetssårbarheter (BEAST, POODLE). Använd endast dessa portar om din enhet absolut inte kan stödja TLS 1.2 eller högre. Vi rekommenderar starkt att du uppgraderar din enhets firmware eller byter till moderna e-postklienter när det är möjligt. Dessa portar är avsedda enbart för kompatibilitet med äldre hårdvara (gamla skrivare, skannrar, kameror, IoT-enheter).

|                                     Protokoll                                     | Värdnamn                |            Portar            |        IPv4        |        IPv6        | Noteringar                             |
| :------------------------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: | -------------------------------------- |
|                              `SSL/TLS` **Föredras**                             | `smtp.forwardemail.net` |        `465`, `2465`        | :white_check_mark: | :white_check_mark: | Modern TLS 1.2+ (Rekommenderas)       |
|         `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS))         | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :white_check_mark: | :white_check_mark: | Stöds (föredra SSL/TLS-port `465`)     |
|                             `SSL/TLS` **Endast Legacy**                          | `smtp.forwardemail.net` |            `2455`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 endast för gamla enheter |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) **Endast Legacy** | `smtp.forwardemail.net` |            `2555`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 endast för gamla enheter |
| Inloggning | Exempel                   | Beskrivning                                                                                                                                                                               |
| --------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Användarnamn | `user@example.com`        | E-postadress för ett alias som finns för domänen på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a>.        |
| Lösenord  | `************************` | Alias                                                                                                                                                                                     |

För att kunna skicka utgående e-post med SMTP måste **SMTP-användaren** vara e-postadressen för ett alias som finns för domänen på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> – och **SMTP-lösenordet** måste vara ett alias-specifikt genererat lösenord.

Se [Stöder ni att skicka e-post med SMTP](#do-you-support-sending-email-with-smtp) för steg-för-steg-instruktioner.

### Vilka är era IMAP-serverkonfigurationsinställningar {#what-are-your-imap-server-configuration-settings}

Vår server är `imap.forwardemail.net` och övervakas även på vår <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statussida</a>.

Den stödjer både IPv4 och IPv6 och är tillgänglig via portarna `993` och `2993` för SSL/TLS.

|         Protokoll        | Värdnamn                |     Portar     |        IPv4        |        IPv6        |
| :----------------------: | ----------------------- | :------------: | :----------------: | :----------------: |
| `SSL/TLS` **Föredras**   | `imap.forwardemail.net` | `993`, `2993`  | :white_check_mark: | :white_check_mark: |

| Inloggning | Exempel                   | Beskrivning                                                                                                                                                                               |
| --------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Användarnamn | `user@example.com`        | E-postadress för ett alias som finns för domänen på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a>.        |
| Lösenord  | `************************` | Alias-specifikt genererat lösenord.                                                                                                                                                        |

För att kunna ansluta med IMAP måste **IMAP-användaren** vara e-postadressen för ett alias som finns för domänen på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> – och **IMAP-lösenordet** måste vara ett alias-specifikt genererat lösenord.

Se [Stöder ni att ta emot e-post med IMAP](#do-you-support-receiving-email-with-imap) för steg-för-steg-instruktioner.

### Vilka är era POP3-serverkonfigurationsinställningar {#what-are-your-pop3-server-configuration-settings}

Vår server är `pop3.forwardemail.net` och övervakas även på vår <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statussida</a>.

Den stödjer både IPv4 och IPv6 och är tillgänglig via portarna `995` och `2995` för SSL/TLS.

|         Protokoll        | Värdnamn                |     Portar     |        IPv4        |        IPv6        |
| :----------------------: | ----------------------- | :------------: | :----------------: | :----------------: |
| `SSL/TLS` **Föredras**   | `pop3.forwardemail.net` | `995`, `2995`  | :white_check_mark: | :white_check_mark: |
| Inloggning | Exempel                    | Beskrivning                                                                                                                                                                               |
| --------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Användarnamn | `user@example.com`         | E-postadress för ett alias som finns för domänen på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a>. |
| Lösenord  | `************************` | Alias-specifikt genererat lösenord.                                                                                                                                                        |

För att ansluta med POP3 måste **POP3-användaren** vara e-postadressen för ett alias som finns för domänen på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> – och **IMAP-lösenordet** måste vara ett alias-specifikt genererat lösenord.

Se [Stöder ni POP3](#do-you-support-pop3) för steg-för-steg-instruktioner.

### Hur ställer jag in e-postautoupptäckt för min domän {#how-do-i-set-up-email-autodiscovery-for-my-domain}

E-postautoupptäckt gör det möjligt för e-postklienter som **Thunderbird**, **Apple Mail**, **Microsoft Outlook** och mobila enheter att automatiskt upptäcka rätt IMAP-, SMTP-, POP3-, CalDAV- och CardDAV-serverinställningar när en användare lägger till sitt e-postkonto. Detta definieras av [RFC 6186](https://www.rfc-editor.org/rfc/rfc6186.html) (e-post) och [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) (CalDAV/CardDAV) och använder DNS SRV-poster.

Forward Email publicerar autoupptäckts-poster på `forwardemail.net`. Du kan antingen lägga till SRV-poster direkt till din domän, eller använda en enklare CNAME-metod.

#### Alternativ A: CNAME-poster (enklast) {#option-a-cname-records-simplest}

Lägg till dessa två CNAME-poster i din domäns DNS. Detta delegerar autoupptäckten till Forward Emails servrar:

|  Typ  | Namn/Värd      | Mål/Värde                      |
| :---: | -------------- | ------------------------------ |
| CNAME | `autoconfig`   | `autoconfig.forwardemail.net`  |
| CNAME | `autodiscover` | `autodiscover.forwardemail.net` |

`autoconfig`-posten används av **Thunderbird** och andra Mozilla-baserade klienter. `autodiscover`-posten används av **Microsoft Outlook**.

#### Alternativ B: SRV-poster (direkt) {#option-b-srv-records-direct}

Om du föredrar att lägga till posterna direkt (eller om din DNS-leverantör inte stödjer CNAME på underdomäner), lägg till dessa SRV-poster i din domän:

| Typ | Namn/Värd           | Prioritet | Vikt | Port | Mål/Värde                 | Syfte                                  |
| :--: | ------------------- | :-------: | :--: | :--: | ------------------------- | ------------------------------------- |
|  SRV | `_imaps._tcp`       |     0     |  1   |  993 | `imap.forwardemail.net`   | IMAP över SSL/TLS (föredras)          |
|  SRV | `_imap._tcp`        |     0     |  0   |  0   | `.`                       | Klartext IMAP inaktiverat              |
|  SRV | `_submissions._tcp` |     0     |  1   |  465 | `smtp.forwardemail.net`   | SMTP-inlämning (SSL/TLS, rekommenderas) |
|  SRV | `_submission._tcp`  |     5     |  1   |  587 | `smtp.forwardemail.net`   | SMTP-inlämning (STARTTLS)              |
|  SRV | `_pop3s._tcp`       |    10     |  1   |  995 | `pop3.forwardemail.net`   | POP3 över SSL/TLS                      |
|  SRV | `_pop3._tcp`        |     0     |  0   |  0   | `.`                       | Klartext POP3 inaktiverat              |
|  SRV | `_caldavs._tcp`     |     0     |  1   |  443 | `caldav.forwardemail.net` | CalDAV över TLS (kalendrar)            |
|  SRV | `_caldav._tcp`      |     0     |  0   |  0   | `.`                       | Klartext CalDAV inaktiverat            |
|  SRV | `_carddavs._tcp`    |     0     |  1   |  443 | `carddav.forwardemail.net`| CardDAV över TLS (kontakter)           |
|  SRV | `_carddav._tcp`     |     0     |  0   |  0   | `.`                       | Klartext CardDAV inaktiverat           |
> \[!NOTE]
> IMAP har ett lägre prioritetsvärde (0) än POP3 (10), vilket talar om för e-postklienter att föredra IMAP framför POP3 när båda är tillgängliga. Poster med målet `.` (en enda punkt) indikerar att de okrypterade (icke-krypterade) versionerna av dessa protokoll är avsiktligt inaktiverade enligt [RFC 6186 Sektion 3.4](https://www.rfc-editor.org/rfc/rfc6186.html#section-3.4). CalDAV- och CardDAV-SRV-poster följer [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) för kalender- och kontaktautoupptäckt.

#### Vilka e-postklienter stödjer autoupptäckt? {#which-email-clients-support-autodiscovery}

| Klient             | E-post                                           | CalDAV/CardDAV                             |
| ------------------ | ------------------------------------------------ | ------------------------------------------ |
| Thunderbird        | `autoconfig` CNAME- eller SRV-poster             | `autoconfig` XML- eller SRV-poster (RFC 6764) |
| Apple Mail (macOS) | SRV-poster (RFC 6186)                            | SRV-poster (RFC 6764)                      |
| Apple Mail (iOS)   | SRV-poster (RFC 6186)                            | SRV-poster (RFC 6764)                      |
| Microsoft Outlook  | `autodiscover` CNAME eller `_autodiscover._tcp` SRV | Stöds inte                               |
| GNOME (Evolution)  | SRV-poster (RFC 6186)                            | SRV-poster (RFC 6764)                      |
| KDE (KMail)        | SRV-poster (RFC 6186)                            | SRV-poster (RFC 6764)                      |
| eM Client          | `autoconfig` eller `autodiscover`                | SRV-poster (RFC 6764)                      |

> \[!TIP]
> För bästa kompatibilitet över alla klienter rekommenderar vi att använda **Alternativ A** (CNAME-poster) kombinerat med SRV-posterna från **Alternativ B**. CNAME-metoden täcker majoriteten av e-postklienterna. CalDAV/CardDAV SRV-posterna säkerställer att kalender- och kontaktklienter också kan automatiskt upptäcka dina serverinställningar.


## Säkerhet {#security-1}

### Avancerade tekniker för serverhärdning {#advanced-server-hardening-techniques}

> \[!TIP]
> Läs mer om vår säkerhetsinfrastruktur på [vår säkerhetssida](/security).

Forward Email implementerar många tekniker för serverhärdning för att säkerställa säkerheten för vår infrastruktur och dina data:

1. **Nätverkssäkerhet**:
   * IP tables-brandvägg med strikta regler
   * Fail2ban för skydd mot brute force-attacker
   * Regelbundna säkerhetsrevisioner och penetrationstester
   * Administrativ åtkomst endast via VPN

2. **Systemhärdning**:
   * Minimal paketinstallation
   * Regelbundna säkerhetsuppdateringar
   * SELinux i enforcing-läge
   * Inaktiverad root SSH-åtkomst
   * Endast nyckelbaserad autentisering

3. **Applikationssäkerhet**:
   * Content Security Policy (CSP)-headers
   * HTTPS Strict Transport Security (HSTS)
   * XSS-skyddsheaders
   * Frame options och referrer policy-headers
   * Regelbundna beroendegranskningar

4. **Dataskydd**:
   * Full disk-kryptering med LUKS
   * Säker nyckelhantering
   * Regelbundna krypterade säkerhetskopior
   * Principer för dataminimering

5. **Övervakning och respons**:
   * Intrångsdetektion i realtid
   * Automatiserad säkerhetsskanning
   * Centraliserad loggning och analys
   * Rutiner för incidenthantering

> \[!IMPORTANT]
> Våra säkerhetspraxis uppdateras kontinuerligt för att hantera nya hot och sårbarheter.

> \[!TIP]
> För maximal säkerhet rekommenderar vi att använda vår tjänst med end-to-end-kryptering via OpenPGP.

### Har ni SOC 2 eller ISO 27001-certifieringar {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email drivs på infrastruktur som tillhandahålls av certifierade underleverantörer för att säkerställa efterlevnad av branschstandarder.

Forward Email innehar inte direkt SOC 2 Type II eller ISO 27001-certifieringar. Tjänsten drivs dock på infrastruktur som tillhandahålls av certifierade underleverantörer:

* **DigitalOcean**: SOC 2 Type II och SOC 3 Type II-certifierad (granskad av Schellman & Company LLC), ISO 27001-certifierad vid flera datacenter. Detaljer: <https://www.digitalocean.com/trust/certification-reports>
* **Vultr**: SOC 2+ (HIPAA) certifierad, ISO/IEC-certifieringar: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Detaljer: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: SOC 2-kompatibel (kontakta DataPacket direkt för att erhålla certifiering), leverantör av företagsinfrastruktur (Denver-plats). Detaljer: <https://www.datapacket.com/datacenters/denver>

Forward Email följer branschens bästa praxis för säkerhetsrevisioner och samarbetar regelbundet med oberoende säkerhetsforskare. Källa: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### Använder ni TLS-kryptering för e-postvidarebefordran {#do-you-use-tls-encryption-for-email-forwarding}

Ja. Forward Email tillämpar strikt TLS 1.2+ för alla anslutningar (HTTPS, SMTP, IMAP, POP3) och implementerar MTA-STS för förbättrat TLS-stöd. Implementeringen inkluderar:

* TLS 1.2+ tvång för alla e-postanslutningar
* ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) nyckelutbyte för perfekt framåtsekretess
* Moderna chifferpaket med regelbundna säkerhetsuppdateringar
* HTTP/2-stöd för förbättrad prestanda och säkerhet
* HSTS (HTTP Strict Transport Security) med förinläsning i stora webbläsare
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** för strikt TLS-tillämpning

Källa: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**MTA-STS-implementering**: Forward Email implementerar strikt MTA-STS-tillämpning i kodbasen. När TLS-fel uppstår och MTA-STS är aktiverat returnerar systemet 421 SMTP-statuskoder för att säkerställa att e-postmeddelanden försöks skickas igen senare istället för att levereras osäkert. Implementeringsdetaljer:

* TLS-felupptäckt: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* MTA-STS-tillämpning i send-email helper: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Tredjepartsvalidering: <https://www.hardenize.com/report/forwardemail.net/1750312779> visar "Good" betyg för alla TLS- och transport-säkerhetsåtgärder.

### Behåller ni e-postautentiseringshuvuden {#do-you-preserve-email-authentication-headers}

Ja. Forward Email implementerar och bevarar e-postautentiseringshuvuden omfattande:

* **SPF (Sender Policy Framework)**: Korrekt implementerat och bevarat
* **DKIM (DomainKeys Identified Mail)**: Fullt stöd med korrekt nyckelhantering
* **DMARC**: Policytillämpning för e-post som misslyckas med SPF- eller DKIM-validering
* **ARC**: Även om det inte är explicit beskrivet, tyder tjänstens perfekta efterlevnadspoäng på omfattande hantering av autentiseringshuvuden

Källa: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Validering: Internet.nl Mail Test visar 100/100 poäng specifikt för "SPF, DKIM och DMARC"-implementering. Hardenize-bedömning bekräftar "Good" betyg för SPF och DMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Behåller ni ursprungliga e-posthuvuden och förhindrar förfalskning {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email implementerar avancerat skydd mot förfalskning för att förhindra e-postmissbruk.

Forward Email bevarar ursprungliga e-posthuvuden samtidigt som omfattande skydd mot förfalskning implementeras genom MX-kodbasen:

* **Bevarande av huvuden**: Ursprungliga autentiseringshuvuden bibehålls vid vidarebefordran
* **Skydd mot förfalskning**: DMARC-policytillämpning förhindrar förfalskning av huvuden genom att avvisa e-post som misslyckas med SPF- eller DKIM-validering
* **Förebyggande av headerinjektion**: Inmatningsvalidering och sanering med hjälp av striptags-biblioteket
* **Avancerat skydd**: Sofistikerad phishingdetektion med upptäckt av förfalskning, förebyggande av identitetskapning och användarnotifieringssystem

**MX-implementeringsdetaljer**: Kärnlogiken för e-posthantering hanteras av MX-serverns kodbas, specifikt:

* Huvud-MX-datahanterare: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Godtycklig e-postfiltrering (anti-spoofing): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

`isArbitrary`-hjälpen implementerar avancerade anti-spoofing-regler inklusive upptäckt av domänimitation, blockerade fraser och olika phishingmönster.
### Hur skyddar ni mot spam och missbruk {#how-do-you-protect-against-spam-and-abuse}

Forward Email implementerar omfattande flerskiktigt skydd:

* **Hastighetsbegränsning**: Tillämpas på autentiseringsförsök, API-endpoints och SMTP-anslutningar
* **Resursisolering**: Mellan användare för att förhindra påverkan från användare med hög volym
* **DDoS-skydd**: Flerskiktsskydd genom DataPackets Shield-system och Cloudflare
* **Automatisk skalning**: Dynamisk resursanpassning baserat på efterfrågan
* **Missbruksprevention**: Användarspecifika kontroller för missbruk och hash-baserad blockering av skadligt innehåll
* **E-postautentisering**: SPF, DKIM, DMARC-protokoll med avancerad phishingdetektion

Källor:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (Detaljer om DDoS-skydd)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### Lagrar ni e-postinnehåll på disk {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email använder en zero-knowledge-arkitektur som förhindrar att e-postinnehåll skrivs till disk.

* **Zero-Knowledge-arkitektur**: Individuellt krypterade SQLite-postlådor innebär att Forward Email inte kan komma åt e-postinnehåll
* **Bearbetning i minnet**: E-postbearbetning sker helt i minnet, vilket undviker lagring på disk
* **Ingen innehållsloggning**: "Vi loggar eller lagrar inte e-postinnehåll eller metadata på disk"
* **Sandboxad kryptering**: Krypteringsnycklar lagras aldrig i klartext på disk

**Bevis från MX-kodbasen**: MX-servern bearbetar e-post helt i minnet utan att skriva innehåll till disk. Den huvudsakliga e-posthanteraren visar denna minnesbaserade metod: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Källor:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Sammanfattning)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Detaljer om zero-knowledge)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Sandboxad kryptering)

### Kan e-postinnehåll exponeras vid systemkrascher {#can-email-content-be-exposed-during-system-crashes}

Nej. Forward Email implementerar omfattande skydd mot exponering av data vid krascher:

* **Core dumps avaktiverade**: Förhindrar exponering av minne vid krascher
* **Swap-minne avaktiverat**: Helt avstängt för att förhindra extrahering av känslig data från swap-filer
* **Minnesbaserad arkitektur**: E-postinnehåll finns endast i flyktigt minne under bearbetning
* **Skydd av krypteringsnycklar**: Nycklar lagras aldrig i klartext på disk
* **Fysisk säkerhet**: LUKS v2-krypterade diskar förhindrar fysisk åtkomst till data
* **USB-lagring avaktiverad**: Förhindrar obehörig dataextraktion

**Felhantering vid systemproblem**: Forward Email använder hjälpfunktionerna `isCodeBug` och `isTimeoutError` för att säkerställa att om några problem med databasanslutning, DNS-nätverk/blocklistor eller uppströmsanslutning uppstår, returnerar systemet 421 SMTP-statuskoder för att säkerställa att e-post kommer att försöka skickas igen senare istället för att gå förlorad eller exponeras.

Implementeringsdetaljer:

* Felklassificering: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Timeout-felhantering i MX-bearbetning: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Källa: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### Vem har tillgång till er e-postinfrastruktur {#who-has-access-to-your-email-infrastructure}

Forward Email implementerar omfattande åtkomstkontroller för sitt minimala ingenjörsteam på 2-3 personer med strikta krav på 2FA:

* **Rollbaserad åtkomstkontroll**: För teamkonton med resursbaserade behörigheter
* **Principen om minsta privilegium**: Tillämpas i alla system
* **Uppdelning av arbetsuppgifter**: Mellan operativa roller
* **Användarhantering**: Separata deploy- och devops-användare med olika behörigheter
* **Root-inloggning avaktiverad**: Tvingar åtkomst via korrekt autentiserade konton
* **Strikt 2FA**: Ingen SMS-baserad 2FA på grund av risk för MiTM-attacker – endast appbaserade eller hårdvarutoken
* **Omfattande revisionsloggning**: Med maskering av känslig data
* **Automatisk avvikelsedetektion**: För ovanliga åtkomstmönster
* **Regelbundna säkerhetsgranskningar**: Av åtkomstloggar
* **Skydd mot Evil Maid-attacker**: USB-lagring avaktiverad och andra fysiska säkerhetsåtgärder
Källor:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Behörighetskontroller)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Nätverkssäkerhet)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Förebyggande av evil maid-attacker)

### Vilka infrastrukturleverantörer använder ni {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email använder flera infrastrukturunderleverantörer med omfattande efterlevnadscertifieringar.

Fullständiga detaljer finns på vår GDPR-efterlevnadssida: <https://forwardemail.net/gdpr>

**Primära infrastrukturunderleverantörer:**

| Leverantör      | Certifierad enligt ramverk för dataskydd | GDPR-efterlevnadssida                                                                    |
| --------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Cloudflare**  | ✅ Ja                                    | <https://www.cloudflare.com/trust-hub/gdpr/>                                            |
| **DataPacket**  | ❌ Nej                                   | <https://www.datapacket.com/privacy-policy>                                              |
| **DigitalOcean**| ❌ Nej                                   | <https://www.digitalocean.com/legal/gdpr>                                                |
| **GitHub**      | ✅ Ja                                    | <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement> |
| **Vultr**       | ❌ Nej                                   | <https://www.vultr.com/legal/eea-gdpr-privacy/>                                          |

**Detaljerade certifieringar:**

**DigitalOcean**

* SOC 2 Typ II & SOC 3 Typ II (granskade av Schellman & Company LLC)
* ISO 27001-certifierade vid flera datacenter
* PCI-DSS-kompatibla
* CSA STAR nivå 1-certifierade
* APEC CBPR PRP-certifierade
* Detaljer: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* SOC 2+ (HIPAA) certifierade
* PCI Merchant-kompatibla
* CSA STAR nivå 1-certifierade
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Detaljer: <https://www.vultr.com/legal/compliance/>

**DataPacket**

* SOC 2-kompatibla (kontakta DataPacket direkt för att erhålla certifiering)
* Infrastruktur i företagsklass (Denver-plats)
* DDoS-skydd genom Shield cybersäkerhetsstack
* Teknisk support dygnet runt
* Globalt nätverk över 58 datacenter
* Detaljer: <https://www.datapacket.com/datacenters/denver>

**GitHub**

* Certifierade enligt ramverk för dataskydd (EU-USA, Schweiz-USA och UK Extension)
* Källkodshantering, CI/CD och projektledning
* GitHub Data Protection Agreement tillgängligt
* Detaljer: <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement>

**Betalningsprocessorer:**

* **Stripe**: Certifierad enligt ramverk för dataskydd - <https://stripe.com/legal/privacy-center>
* **PayPal**: Inte DPF-certifierad - <https://www.paypal.com/uk/legalhub/privacy-full>

### Erbjuder ni ett databehandlingsavtal (DPA) {#do-you-offer-a-data-processing-agreement-dpa}

Ja, Forward Email erbjuder ett omfattande databehandlingsavtal (DPA) som kan undertecknas tillsammans med vårt företagsavtal. En kopia av vårt DPA finns tillgänglig på: <https://forwardemail.net/dpa>

**DPA-detaljer:**

* Täcker GDPR-efterlevnad och EU-US/Schweiz-US Privacy Shield-ramverk
* Accepteras automatiskt vid godkännande av våra användarvillkor
* Ingen separat underskrift krävs för standard-DPA
* Anpassade DPA-arrangemang finns tillgängliga via Enterprise License

**GDPR-efterlevnadsramverk:**
Vårt DPA beskriver efterlevnad av GDPR samt internationella krav för dataöverföring. Fullständig information finns på: <https://forwardemail.net/gdpr>

För företagskunder som kräver anpassade DPA-villkor eller specifika avtalsarrangemang kan dessa hanteras genom vårt **Enterprise License ($250/månad)**-program.

### Hur hanterar ni anmälningar om dataintrång {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Forward Emails nollkunskapsarkitektur begränsar avsevärt påverkan vid intrång.
* **Begränsad dataexponering**: Kan inte komma åt krypterat e-postinnehåll på grund av nollkunskapsarkitektur
* **Minimal datainsamling**: Endast grundläggande prenumerantinformation och begränsade IP-loggar för säkerhet
* **Underleverantörsramverk**: DigitalOcean, GitHub och Vultr upprätthåller GDPR-kompatibla incidenthanteringsrutiner

**GDPR-representantinformation:**
Forward Email har utsett GDPR-representanter i enlighet med artikel 27:

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

För företagskunder som kräver specifika SLA för anmälan av dataintrång bör dessa diskuteras som en del av ett **Enterprise License**-avtal.

Källor:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### Erbjuder ni en testmiljö {#do-you-offer-a-test-environment}

Forward Emails tekniska dokumentation beskriver inte uttryckligen ett dedikerat sandbox-läge. Möjliga testmetoder inkluderar dock:

* **Självhostningsalternativ**: Omfattande självhostningsmöjligheter för att skapa testmiljöer
* **API-gränssnitt**: Möjlighet till programmatisk testning av konfigurationer
* **Öppen källkod**: 100 % öppen källkod som låter kunder granska vidarebefordringslogiken
* **Flera domäner**: Stöd för flera domäner kan möjliggöra skapande av testdomäner

För företagskunder som kräver formella sandbox-funktioner bör detta diskuteras som en del av ett **Enterprise License**-avtal.

Källa: <https://github.com/forwardemail/forwardemail.net> (Utvecklingsmiljödetaljer)

### Erbjuder ni övervaknings- och larmverktyg {#do-you-provide-monitoring-and-alerting-tools}

Forward Email erbjuder realtidsövervakning med vissa begränsningar:

**Tillgängligt:**

* **Realtidsleveransövervakning**: Publikt synliga prestandamått för stora e-postleverantörer
* **Automatiska larm**: Ingenjörsteamet larmas när leveranstider överstiger 10 sekunder
* **Transparent övervakning**: 100 % öppen källkod för övervakningssystemen
* **Infrastrukturövervakning**: Automatisk avvikelsedetektering och omfattande revisionsloggning

**Begränsningar:**

* Kundvända webhooks eller API-baserade leveransstatusnotifikationer är inte uttryckligen dokumenterade

För företagskunder som kräver detaljerade leveransstatus-webhooks eller anpassade övervakningsintegrationer kan dessa funktioner finnas tillgängliga via **Enterprise License**-avtal.

Källor:

* <https://forwardemail.net> (Realtidsövervakningsvisning)
* <https://github.com/forwardemail/forwardemail.net> (Implementering av övervakning)

### Hur säkerställer ni hög tillgänglighet {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Forward Email implementerar omfattande redundans över flera infrastrukturleverantörer.

* **Distribuerad infrastruktur**: Flera leverantörer (DigitalOcean, Vultr, DataPacket) över geografiska regioner
* **Geografisk lastbalansering**: Cloudflare-baserad geo-lokaliserad lastbalansering med automatisk failover
* **Automatisk skalning**: Dynamisk resursanpassning baserat på efterfrågan
* **Flerlagers DDoS-skydd**: Genom DataPackets Shield-system och Cloudflare
* **Serverredundans**: Flera servrar per region med automatisk failover
* **Databasreplikering**: Realtidssynkronisering av data över flera platser
* **Övervakning och larm**: 24/7-övervakning med automatisk incidenthantering

**Tillgänglighetsåtagande**: 99,9 %+ tjänstetillgänglighet med transparent övervakning tillgänglig på <https://forwardemail.net>

Källor:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Uppfyller ni avsnitt 889 i National Defense Authorization Act (NDAA) {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Forward Email är fullt kompatibelt med avsnitt 889 genom noggrann urval av infrastrukturpartners.

Ja, Forward Email är **kompatibelt med avsnitt 889**. Avsnitt 889 i National Defense Authorization Act (NDAA) förbjuder statliga myndigheter att använda eller kontraktera med enheter som använder telekommunikations- och videosäkerhetsutrustning från specifika företag (Huawei, ZTE, Hikvision, Dahua och Hytera).
**Hur Forward Email uppnår efterlevnad av Section 889:**

Forward Email förlitar sig uteslutande på två viktiga infrastrukturleverantörer, som båda inte använder utrustning som är förbjuden enligt Section 889:

1. **Cloudflare**: Vår huvudsakliga partner för nätverkstjänster och e-postsäkerhet
2. **DataPacket**: Vår huvudsakliga leverantör för serverinfrastruktur (använder uteslutande Arista Networks och Cisco-utrustning)
3. **Backup Providers**: Våra backup-leverantörer Digital Ocean och Vultr är dessutom skriftligen bekräftade som Section 889-kompatibla.

**Cloudflares åtagande**: Cloudflare anger uttryckligen i sin Third Party Code of Conduct att de inte använder telekommunikationsutrustning, videoövervakningsprodukter eller tjänster från några enheter som är förbjudna enligt Section 889.

**Användningsfall för myndigheter**: Vår efterlevnad av Section 889 validerades när **US Naval Academy** valde Forward Email för deras behov av säker e-postvidarebefordran, vilket krävde dokumentation av våra federala efterlevnadsstandarder.

För fullständiga detaljer om vår ram för myndighetsefterlevnad, inklusive bredare federala regler, läs vår omfattande fallstudie: [Federal Government Email Service Section 889 Compliant](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)


## System- och tekniska detaljer {#system-and-technical-details}

### Sparar ni e-post och dess innehåll {#do-you-store-emails-and-their-contents}

Nej, vi skriver inte till disk eller sparar loggar – med [undantag för fel](#do-you-store-error-logs) och [utgående SMTP](#do-you-support-sending-email-with-smtp) (se vår [Integritetspolicy](/privacy)).

Allt görs i minnet och [vår källkod finns på GitHub](https://github.com/forwardemail).

### Hur fungerar ert system för e-postvidarebefordran {#how-does-your-email-forwarding-system-work}

E-post bygger på [SMTP-protokollet](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). Detta protokoll består av kommandon som skickas till en server (vanligtvis på port 25). Det sker en initial anslutning, sedan anger avsändaren vem mailet är från ("MAIL FROM"), följt av vart det ska ("RCPT TO"), och slutligen e-postens headers och kropp ("DATA"). Flödet i vårt system för e-postvidarebefordran beskrivs i förhållande till varje SMTP-protokollkommando nedan:

* Initial anslutning (inget kommando, t.ex. `telnet example.com 25`) – Detta är den initiala anslutningen. Vi kontrollerar avsändare som inte finns i vår [tillåtna lista](#do-you-have-an-allowlist) mot vår [blocklista](#do-you-have-a-denylist). Slutligen, om en avsändare inte finns i vår tillåtna lista, kontrollerar vi om de har blivit [grålistade](#do-you-have-a-greylist).

* `HELO` – Detta är en hälsning för att identifiera avsändarens FQDN, IP-adress eller mailhanterarens namn. Detta värde kan förfalskas, så vi förlitar oss inte på denna data utan använder istället omvänd värdnamnsuppslagning av anslutningens IP-adress.

* `MAIL FROM` – Detta anger avsändaradressen i kuvertet för e-posten. Om ett värde anges måste det vara en giltig RFC 5322-e-postadress. Tomma värden är tillåtna. Vi [kontrollerar för backscatter](#how-do-you-protect-against-backscatter) här, och vi kontrollerar också MAIL FROM mot vår [blocklista](#do-you-have-a-denylist). Slutligen kontrollerar vi avsändare som inte finns på tillåtna listan för hastighetsbegränsning (se avsnitten om [Rate Limiting](#do-you-have-rate-limiting) och [allowlist](#do-you-have-an-allowlist) för mer information).

* `RCPT TO` – Detta anger mottagaren/mottagarna av e-posten. Dessa måste vara giltiga RFC 5322-e-postadresser. Vi tillåter endast upp till 50 kuvertmottagare per meddelande (detta skiljer sig från "To"-headern i ett e-postmeddelande). Vi kontrollerar också för en giltig [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS")-adress här för att skydda mot förfalskning med vårt SRS-domännamn.

* `DATA` – Detta är kärnan i vår tjänst som bearbetar ett e-postmeddelande. Se avsnittet [Hur bearbetar ni ett e-postmeddelande för vidarebefordran](#how-do-you-process-an-email-for-forwarding) nedan för mer insikt.
### Hur behandlar ni ett e-postmeddelande för vidarebefordran {#how-do-you-process-an-email-for-forwarding}

Detta avsnitt beskriver vår process relaterad till SMTP-protokollkommandot `DATA` i avsnittet [Hur fungerar ert e-postvidarebefordringssystem](#how-does-your-email-forwarding-system-work) ovan – det är hur vi behandlar ett e-postmeddelandes headers, kropp, säkerhet, bestämmer vart det behöver levereras, och hur vi hanterar anslutningar.

1. Om meddelandet överskrider maximal storlek på 50mb, så avvisas det med en 552-felkod.

2. Om meddelandet inte innehöll en "From"-header, eller om någon av värdena i "From"-headern inte var giltiga RFC 5322 e-postadresser, så avvisas det med en 550-felkod.

3. Om meddelandet hade fler än 25 "Received"-headers, så bedömdes det ha fastnat i en omdirigeringsloop, och det avvisas med en 550-felkod.

4. Med hjälp av e-postens fingeravtryck (se avsnittet om [Fingerprinting](#how-do-you-determine-an-email-fingerprint)) kommer vi att kontrollera om meddelandet har försökt skickas om i mer än 5 dagar (vilket motsvarar [standardbeteendet i postfix](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)), och om så är fallet, så avvisas det med en 550-felkod.

5. Vi lagrar i minnet resultaten från att ha skannat e-posten med hjälp av [Spam Scanner](https://spamscanner.net).

6. Om det fanns några godtyckliga resultat från Spam Scanner, så avvisas det med en 554-felkod. Godtyckliga resultat inkluderar endast GTUBE-testet vid tidpunkten för denna skrivning. Se <https://spamassassin.apache.org/gtube/> för mer insikt.

7. Vi lägger till följande headers till meddelandet för felsökning och missbruksförebyggande ändamål:

   * `Received` - vi lägger till denna standard Received-header med ursprungs-IP och värd, överföringstyp, TLS-anslutningsinformation, datum/tid och mottagare.
   * `X-Original-To` - den ursprungliga mottagaren för meddelandet:
     * Detta är användbart för att avgöra vart ett e-postmeddelande ursprungligen levererades (utöver "Received"-headern).
     * Detta läggs till per mottagare vid tidpunkten för IMAP och/eller maskerad vidarebefordran (för att skydda integriteten).
   * `X-Forward-Email-Website` - innehåller en länk till vår webbplats <https://forwardemail.net>
   * `X-Forward-Email-Version` - den aktuella [SemVer](https://semver.org/) versionen från `package.json` i vår kodbas.
   * `X-Forward-Email-Session-ID` - ett sessions-ID-värde som används för felsökningsändamål (gäller endast i icke-produktionsmiljöer).
   * `X-Forward-Email-Sender` - en kommaseparerad lista som innehåller den ursprungliga kuvertets MAIL FROM-adress (om den inte var tom), den omvända PTR-klientens FQDN (om den finns), och avsändarens IP-adress.
   * `X-Forward-Email-ID` - detta gäller endast för utgående SMTP och korrelerar till e-post-ID:t som lagras i Mitt Konto → E-post
   * `X-Report-Abuse` - med värdet `abuse@forwardemail.net`.
   * `X-Report-Abuse-To` - med värdet `abuse@forwardemail.net`.
   * `X-Complaints-To` - med värdet `abuse@forwardemail.net`.

8. Vi kontrollerar sedan meddelandet för [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain), och [DMARC](https://en.wikipedia.org/wiki/DMARC).

   * Om meddelandet misslyckades med DMARC och domänen hade en avvisningspolicy (t.ex. `p=reject` [fanns i DMARC-policyn](https://wikipedia.org/wiki/DMARC)), så avvisas det med en 550-felkod. Vanligtvis kan en DMARC-policy för en domän hittas i `_dmarc` subdomänens <strong class="notranslate">TXT</strong>-post, (t.ex. `dig _dmarc.example.com txt`).
   * Om meddelandet misslyckades med SPF och domänen hade en hård felpolicy (t.ex. `-all` fanns i SPF-policyn istället för `~all` eller ingen policy alls), så avvisas det med en 550-felkod. Vanligtvis kan en SPF-policy för en domän hittas i <strong class="notranslate">TXT</strong>-posten för rot-domänen (t.ex. `dig example.com txt`). Se detta avsnitt för mer information om [att skicka mail som med Gmail](#can-i-send-mail-as-in-gmail-with-this) angående SPF.
9. Nu bearbetar vi mottagarna av meddelandet som samlats in från kommandot `RCPT TO` i avsnittet [Hur fungerar ditt e-postvidarebefordringssystem](#how-does-your-email-forwarding-system-work) ovan. För varje mottagare utför vi följande operationer:

   * Vi söker upp <strong class="notranslate">TXT</strong>-poster för domännamnet (delen efter `@`-symbolen, t.ex. `example.com` om e-postadressen var `test@example.com`). Till exempel, om domänen är `example.com` gör vi en DNS-uppslagning som `dig example.com txt`.
   * Vi analyserar alla <strong class="notranslate">TXT</strong>-poster som börjar med antingen `forward-email=` (gratisplaner) eller `forward-email-site-verification=` (betalplaner). Observera att vi analyserar båda för att kunna bearbeta e-post medan en användare uppgraderar eller nedgraderar planer.
   * Från dessa analyserade <strong class="notranslate">TXT</strong>-poster itererar vi över dem för att extrahera vidarebefordringskonfigurationen (som beskrivs i avsnittet [Hur kommer jag igång och ställer in e-postvidarebefordran](#how-do-i-get-started-and-set-up-email-forwarding) ovan). Observera att vi endast stödjer ett värde för `forward-email-site-verification=`, och om mer än ett anges, kommer ett 550-fel att uppstå och avsändaren kommer att få ett studsfel för denna mottagare.
   * Rekursivt itererar vi över den extraherade vidarebefordringskonfigurationen för att bestämma global vidarebefordran, regex-baserad vidarebefordran och alla andra stödjade vidarebefordringskonfigurationer – vilka nu kallas våra "Vidarebefordringsadresser".
   * För varje Vidarebefordringsadress stödjer vi en rekursiv uppslagning (vilket startar denna serie av operationer på den givna adressen). Om en rekursiv matchning hittas, tas föräldraresultatet bort från Vidarebefordringsadresser och barnen läggs till.
   * Vidarebefordringsadresser analyseras för unikhet (eftersom vi inte vill skicka dubbletter till en adress eller skapa onödiga ytterligare SMTP-klientanslutningar).
   * För varje Vidarebefordringsadress söker vi upp dess domännamn mot vår API-endpoint `/v1/max-forwarded-addresses` (för att avgöra hur många adresser domänen får vidarebefordra e-post till per alias, t.ex. 10 som standard – se avsnittet om [maxgräns för vidarebefordran per alias](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)). Om denna gräns överskrids uppstår ett 550-fel och avsändaren får ett studsfel för denna mottagare.
   * Vi söker upp inställningarna för den ursprungliga mottagaren mot vår API-endpoint `/v1/settings`, som stödjer uppslagning för betalande användare (med fallback för gratisanvändare). Detta returnerar ett konfigurationsobjekt för avancerade inställningar för `port` (Nummer, t.ex. `25`), `has_adult_content_protection` (Boolean), `has_phishing_protection` (Boolean), `has_executable_protection` (Boolean) och `has_virus_protection` (Boolean).
   * Baserat på dessa inställningar kontrollerar vi sedan mot Spam Scanner-resultat och om några fel uppstår avvisas meddelandet med felkod 554 (t.ex. om `has_virus_protection` är aktiverat, kontrollerar vi Spam Scanner-resultaten för virus). Observera att alla användare på gratisplan automatiskt omfattas av kontroller mot vuxeninnehåll, nätfiske, körbara filer och virus. Som standard omfattas även alla betalplananvändare, men denna konfiguration kan ändras under inställningssidan för en domän i Forward Email-instrumentpanelen).

10. För varje bearbetad mottagares Vidarebefordringsadresser utför vi sedan följande operationer:

    * Adressen kontrolleras mot vår [blocklista](#do-you-have-a-denylist), och om den finns där uppstår en 421-felkod (indikerar för avsändaren att försöka igen senare).
    * Om adressen är en webhook sätter vi en Boolean för framtida operationer (se nedan – vi grupperar liknande webhooks för att göra en POST-förfrågan istället för flera för leverans).
    * Om adressen är en e-postadress analyserar vi värden för framtida operationer (se nedan – vi grupperar liknande värdar för att göra en anslutning istället för flera individuella anslutningar för leverans).
11. Om det inte finns några mottagare och inga studsar, svarar vi med ett 550-fel med meddelandet "Ogiltiga mottagare".

12. Om det finns mottagare, itererar vi över dem (grupperade efter samma värd) och levererar e-postmeddelandena. Se avsnittet [Hur hanterar ni problem med e-postleverans](#how-do-you-handle-email-delivery-issues) nedan för mer insikt.

    * Om några fel uppstår vid sändning av e-post, lagrar vi dem i minnet för senare bearbetning.
    * Vi tar det lägsta felkoden (om någon) från sändningen av e-post – och använder den som svarskod till `DATA`-kommandot. Detta innebär att e-post som inte levererats vanligtvis kommer att försöka skickas igen av den ursprungliga avsändaren, medan e-post som redan levererats inte skickas om nästa gång meddelandet skickas (eftersom vi använder [Fingerprinting](#how-do-you-determine-an-email-fingerprint)).
    * Om inga fel uppstod skickar vi en 250 framgångsrik SMTP-svarskod.
    * En studs definieras som varje leveransförsök som resulterar i en statuskod som är >= 500 (permanenta fel).

13. Om inga studsar inträffade (permanenta fel), returnerar vi en SMTP-svarskod med den lägsta felkoden från icke-permanenta fel (eller en 250 framgångsrik statuskod om inga sådana fanns).

14. Om studsar inträffade skickar vi studsmejl i bakgrunden efter att ha returnerat den lägsta av alla felkoder till avsändaren. Men om den lägsta felkoden är >= 500 skickar vi inga studsmejl. Detta eftersom om vi gjorde det skulle avsändare få dubbla studsmejl (t.ex. ett från deras utgående MTA, som Gmail – och även ett från oss). Se avsnittet om [Hur skyddar ni mot backscatter](#how-do-you-protect-against-backscatter) nedan för mer insikt.

### Hur hanterar ni problem med e-postleverans {#how-do-you-handle-email-delivery-issues}

Observera att vi gör en "Friendly-From"-omskrivning av e-postmeddelandena endast om DMARC-policyn för avsändaren inte godkändes OCH inga DKIM-signaturer var i linje med "From"-huvudet. Detta innebär att vi ändrar "From"-huvudet i meddelandet, sätter "X-Original-From" och även sätter en "Reply-To" om den inte redan var satt. Vi förseglar också ARC-sigillen på meddelandet igen efter att ha ändrat dessa huvuden.

Vi använder också smart tolkning av felmeddelanden på alla nivåer i vår stack – i vår kod, DNS-förfrågningar, Node.js-interna funktioner, HTTP-förfrågningar (t.ex. 408, 413 och 429 mappas till SMTP-svarskoden 421 om mottagaren är en webhook) och svar från e-postservrar (t.ex. svar med "defer" eller "slowdown" försöks igen som 421-fel).

Vår logik är idiot-säker och den försöker också igen vid SSL/TLS-fel, anslutningsproblem och mer. Målet med idiot-säkerheten är att maximera leveransbarheten till alla mottagare för en vidarebefordringskonfiguration.

Om mottagaren är en webhook tillåter vi en timeout på 60 sekunder för att förfrågan ska slutföras med upp till 3 försök (alltså totalt 4 förfrågningar innan ett fel). Observera att vi korrekt tolkar felkoderna 408, 413 och 429 och mappar dem till SMTP-svarskoden 421.

Om mottagaren istället är en e-postadress försöker vi skicka e-post med opportunistisk TLS (vi försöker använda STARTTLS om det finns tillgängligt på mottagarens e-postserver). Om ett SSL/TLS-fel uppstår vid försök att skicka e-post, försöker vi skicka e-post utan TLS (utan att använda STARTTLS).

Om några DNS- eller anslutningsfel uppstår returnerar vi till `DATA`-kommandot en SMTP-svarskod 421, annars om det finns >= 500-nivåfel skickas studsmejl.

Om vi upptäcker att en e-postserver vi försöker leverera till har en eller flera av våra mail exchange IP-adresser blockerade (t.ex. av vilken teknik de än använder för att skjuta upp spammare), skickar vi en SMTP-svarskod 421 så att avsändaren kan försöka skicka meddelandet senare (och vi blir varnade om problemet så att vi förhoppningsvis kan lösa det innan nästa försök).

### Hur hanterar ni att era IP-adresser blir blockerade {#how-do-you-handle-your-ip-addresses-becoming-blocked}
Vi övervakar rutinmässigt alla större DNS-blocklistor och om någon av våra mailutbytes- ("MX") IP-adresser listas i en större blocklista, kommer vi att ta bort den från den relevanta DNS A-postens round robin om möjligt tills problemet är löst.

Vid tidpunkten för denna skrivning är vi också listade i flera DNS-tillåtelselistor, och vi tar övervakning av blocklistor på allvar. Om du ser några problem innan vi har möjlighet att lösa dem, vänligen meddela oss skriftligen på <support@forwardemail.net>.

Våra IP-adresser är offentligt tillgängliga, [se denna sektion nedan för mer insikt](#what-are-your-servers-ip-addresses).

### Vad är postmaster-adresser {#what-are-postmaster-addresses}

För att förhindra felriktade studsar och att skicka semesterautomatiska svar till obevakade eller icke-existerande brevlådor, underhåller vi en lista med mailer-daemon-liknande användarnamn:

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
* [och alla no-reply-adresser](#what-are-no-reply-addresses)

Se [RFC 5320 Section 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) för mer insikt i hur listor som dessa används för att skapa effektiva e-postsystem.

### Vad är no-reply-adresser {#what-are-no-reply-addresses}

E-postanvändarnamn som är lika med någon av följande (skiftlägesokänsligt) anses vara no-reply-adresser:

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

Denna lista underhålls [som ett open source-projekt på GitHub](https://github.com/forwardemail/reserved-email-addresses-list).

### Vilka är dina servers IP-adresser {#what-are-your-servers-ip-addresses}

Vi publicerar våra IP-adresser på <https://forwardemail.net/ips>.

### Har ni en tillåtelselista {#do-you-have-an-allowlist}

Ja, vi har en [lista över domännamnstillägg](#what-domain-name-extensions-are-allowlisted-by-default) som är tillåtna som standard och en dynamisk, cachelagrad och rullande tillåtelselista baserad på [strikta kriterier](#what-is-your-allowlist-criteria).

Alla domäner, e-postadresser och IP-adresser som används av betalande kunder kontrolleras automatiskt mot vår blocklista varje timme – vilket varnar administratörer som kan ingripa manuellt vid behov.

Dessutom, om en av dina domäner eller dess e-postadresser listas i blocklistan (t.ex. för att skicka skräppost, virus eller på grund av förfalskningsattacker) – då kommer domänadministratörerna (du) och våra teamadministratörer att meddelas omedelbart via e-post. Vi rekommenderar starkt att du [konfigurerar DMARC](#how-do-i-set-up-dmarc-for-forward-email) för att förhindra detta.

### Vilka domännamnstillägg är tillåtna som standard {#what-domain-name-extensions-are-allowlisted-by-default}

Följande domännamnstillägg anses vara tillåtna som standard (oavsett om de finns på Umbrella Popularity List eller inte):

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
Dessutom är dessa [varumärkes- och företags-toppdomäner](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) tillåtna som standard (t.ex. `apple` för `applecard.apple` för Apple Card bankutdrag):

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
Från och med den 18 mars 2025 har vi även lagt till dessa franska utomeuropeiska territorier till denna lista ([enligt denna GitHub-förfrågan](https://github.com/forwardemail/forwardemail.net/issues/327)):

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

Från och med den 8 juli 2025 har vi lagt till dessa Europa-specifika länder:

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

I oktober 2025 har vi även lagt till <code class="notranslate">cz</code> (Tjeckien) på grund av efterfrågan.

Vi inkluderade specifikt inte `ru` och `ua` på grund av hög spamaktivitet.

### Vad är dina kriterier för tillåtelselista {#what-is-your-allowlist-criteria}

Vi har en statisk lista över [domännamnstillägg som är tillåtna som standard](#what-domain-name-extensions-are-allowlisted-by-default) – och vi underhåller också en dynamisk, cachad, rullande tillåtelselista baserad på följande strikta kriterier:

* Avsändarens rot-domän måste vara av ett [domännamnstillägg som matchar listan vi erbjuder på vår gratisplan](#what-domain-name-extensions-can-be-used-for-free) (med tillägget `biz` och `info`). Vi inkluderar också delvisa matchningar för `edu`, `gov` och `mil`, såsom `xyz.gov.au` och `xyz.edu.au`.
* Avsändarens rot-domän måste finnas inom topp 100 000 unika rot-domäner enligt analyserade resultat från [Umbrella Popularity List](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL").
* Avsändarens rot-domän måste finnas inom topp 50 000 resultat från unika rot-domäner som förekommer i minst 4 av de senaste 7 dagarna i UPL:s (~50 %+).
* Avsändarens rot-domän får inte vara [kategoriserad](https://radar.cloudflare.com/categorization-feedback/) som vuxeninnehåll eller skadlig programvara av Cloudflare.
* Avsändarens rot-domän måste ha antingen A- eller MX-poster inställda.
* Avsändarens rot-domän måste ha antingen A-poster, MX-poster, DMARC-post med `p=reject` eller `p=quarantine`, eller en SPF-post med `-all` eller `~all` kvalificerare.

Om dessa kriterier uppfylls kommer avsändarens rot-domän att cachas i 7 dagar. Observera att vårt automatiserade jobb körs dagligen – därför är detta en rullande cache för tillåtelselistan som uppdateras dagligen.

Vårt automatiserade jobb laddar ner de senaste 7 dagarnas UPL i minnet, packar upp dem och analyserar sedan i minnet enligt de strikta kriterierna ovan.

Populära domäner vid skrivande stund såsom Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify och fler – är naturligtvis inkluderade.
Om du är en avsändare som inte finns i vår tillåtna lista, kommer du första gången din FQDN-rootdomän eller IP-adress skickar ett e-postmeddelande att bli [rate limited](#do-you-have-rate-limiting) och [greylisted](#do-you-have-a-greylist). Observera att detta är en standardpraxis som antagits som en e-poststandard. De flesta e-postserverklienter kommer att försöka skicka igen om de får ett felmeddelande om rate limit eller greylist (t.ex. en 421 eller 4xx nivå felstatuskod).

**Observera att specifika avsändare såsom `a@gmail.com`, `b@xyz.edu` och `c@gov.au` fortfarande kan bli [denylisted](#do-you-have-a-denylist)** (t.ex. om vi automatiskt upptäcker skräppost, nätfiske eller skadlig kod från dessa avsändare).

### Vilka domännamnstillägg kan användas gratis {#what-domain-name-extensions-can-be-used-for-free}

Från och med den 31 mars 2023 införde vi en ny generell skräppostregel för att skydda våra användare och tjänst.

Denna nya regel tillåter endast följande domännamnstillägg att användas på vår gratisplan:

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
### Har ni en greylist {#do-you-have-a-greylist}

Ja, vi har en mycket slapp [email greylisting](https://en.wikipedia.org/wiki/Greylisting_\(email\)) policy som används. Greylisting gäller endast för avsändare som inte finns på vår tillåtna lista och varar i vår cache i 30 dagar.

För varje ny avsändare lagrar vi en nyckel i vår Redis-databas i 30 dagar med ett värde satt till den initiala ankomsttiden för deras första förfrågan. Vi avvisar sedan deras e-post med en retry-statuskod 450 och tillåter den bara att passera när 5 minuter har gått.

Om de framgångsrikt har väntat i 5 minuter från denna initiala ankomsttid, kommer deras e-post att accepteras och de kommer inte att få denna 450-statuskod.

Nyckeln består antingen av FQDN root-domänen eller avsändarens IP-adress. Detta innebär att vilken subdomän som helst som passerar greylist också kommer att passera för root-domänen, och vice versa (detta är vad vi menar med en "mycket slapp" policy).

Till exempel, om ett e-postmeddelande kommer från `test.example.com` innan vi ser ett e-postmeddelande från `example.com`, måste alla e-postmeddelanden från `test.example.com` och/eller `example.com` vänta 5 minuter från den initiala ankomsttiden för anslutningen. Vi låter inte både `test.example.com` och `example.com` vänta sina egna 5-minutersperioder (vår greylisting-policy gäller på root-domännivå).

Observera att greylisting inte gäller för någon avsändare på vår [allowlist](#do-you-have-an-allowlist) (t.ex. Meta, Amazon, Netflix, Google, Microsoft vid tidpunkten för denna skrivning).

### Har ni en denylist {#do-you-have-a-denylist}

Ja, vi driver vår egen denylist och uppdaterar den automatiskt i realtid och manuellt baserat på upptäckt spam och skadlig aktivitet.

Vi hämtar också alla IP-adresser från UCEPROTECT Level 1 denylist på <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> varje timme och matar in dem i vår denylist med en giltighetstid på 7 dagar.

Avsändare som finns i denylisten får en 421-felkod (indikerar för avsändaren att försöka igen senare) om de [inte finns på allowlist](#do-you-have-an-allowlist).

Genom att använda en 421-statuskod istället för en 554-statuskod kan potentiella falska positiva hanteras i realtid och sedan kan meddelandet levereras framgångsrikt vid nästa försök.

**Detta är utformat olikt andra e-posttjänster**, där om du hamnar på en blocklista sker ett hårt och permanent fel. Det är ofta svårt att be avsändare att försöka skicka meddelanden igen (särskilt från stora organisationer), och därför ger detta tillvägagångssätt ungefär 5 dagar från det initiala e-postförsöket för att antingen avsändaren, mottagaren eller vi ska kunna ingripa och lösa problemet (genom att begära borttagning från denylist).

Alla begäranden om borttagning från denylist övervakas i realtid av administratörer (t.ex. så att återkommande falska positiva kan tillåtas permanent av administratörer).

Begäran om borttagning från denylist kan göras på <https://forwardemail.net/denylist>. Betalande användare får sina begäranden om borttagning från denylist behandlade omedelbart, medan icke-betalande användare måste vänta på att administratörer behandlar deras begäran.

Avsändare som upptäcks skicka spam eller virusinnehåll kommer att läggas till i denylisten enligt följande tillvägagångssätt:

1. Det [initiala meddelandets fingeravtryck](#how-do-you-determine-an-email-fingerprint) greylistas vid upptäckt av spam eller blocklista från en "betrodd" avsändare (t.ex. `gmail.com`, `microsoft.com`, `apple.com`).
   * Om avsändaren var på allowlist, greylistas meddelandet i 1 timme.
   * Om avsändaren inte är på allowlist, greylistas meddelandet i 6 timmar.
2. Vi analyserar denylist-nycklar från information från avsändaren och meddelandet, och för varje av dessa nycklar skapar vi (om det inte redan finns) en räknare, ökar den med 1 och cachar den i 24 timmar.
   * För allowlistade avsändare:
     * Lägg till en nyckel för kuvertets "MAIL FROM"-e-postadress om den hade godkänd SPF eller ingen SPF, och det inte var [ett postmaster-användarnamn](#what-are-postmaster-addresses) eller [ett no-reply-användarnamn](#what-are-no-reply-addresses).
     * Om "From"-huvudet var allowlistat, lägg då till en nyckel för "From"-huvudets e-postadress om den hade godkänd SPF eller godkänd och justerad DKIM.
     * Om "From"-huvudet inte var allowlistat, lägg då till en nyckel för "From"-huvudets e-postadress och dess rotparade domännamn.
   * För icke-allowlistade avsändare:
     * Lägg till en nyckel för kuvertets "MAIL FROM"-e-postadress om den hade godkänd SPF.
     * Om "From"-huvudet var allowlistat, lägg då till en nyckel för "From"-huvudets e-postadress om den hade godkänd SPF eller godkänd och justerad DKIM.
     * Om "From"-huvudet inte var allowlistat, lägg då till en nyckel för "From"-huvudets e-postadress och dess rotparade domännamn.
     * Lägg till en nyckel för avsändarens fjärr-IP-adress.
     * Lägg till en nyckel för klientens uppslagna värdnamn via omvänd uppslagning från avsändarens IP-adress (om något).
     * Lägg till en nyckel för root-domänen av klientens uppslagna värdnamn (om något, och om den skiljer sig från klientens uppslagna värdnamn).
3. Om räknaren når 5 för en icke-allowlistad avsändare och nyckel, så denylistas nyckeln i 30 dagar och ett e-postmeddelande skickas till vårt abuse-team. Dessa siffror kan ändras och uppdateringar kommer att återspeglas här när vi övervakar missbruk.
4. Om räknaren når 10 för en allowlistad avsändare och nyckel, så denylistas nyckeln i 7 dagar och ett e-postmeddelande skickas till vårt abuse-team. Dessa siffror kan ändras och uppdateringar kommer att återspeglas här när vi övervakar missbruk.
> **OBS:** Inom en snar framtid kommer vi att införa rykteövervakning. Rykteövervakning kommer istället att beräkna när en avsändare ska nekas baserat på en procenttröskel (istället för en rudimentär räknare som nämnts ovan).

### Har ni hastighetsbegränsning {#do-you-have-rate-limiting}

Avsändarens hastighetsbegränsning sker antingen via rot-domänen som tolkas från en omvänd PTR-uppslagning på avsändarens IP-adress – eller om detta inte ger något resultat, används helt enkelt avsändarens IP-adress. Observera att vi nedan refererar till detta som `Sender`.

Våra MX-servrar har dagliga gränser för inkommande e-post mottagen för [krypterad IMAP-lagring](/blog/docs/best-quantum-safe-encrypted-email-service):

* Istället för att hastighetsbegränsa inkommande e-post mottagen på individuell aliasnivå (t.ex. `you@yourdomain.com`) – begränsar vi efter aliasets domännamn i sig (t.ex. `yourdomain.com`). Detta förhindrar att `Senders` översvämmar inkorgarna för alla alias över din domän samtidigt.
* Vi har generella gränser som gäller för alla `Senders` över vår tjänst oavsett mottagare:
  * `Senders` som vi anser vara "pålitliga" som sanningskälla (t.ex. `gmail.com`, `microsoft.com`, `apple.com`) är begränsade till att skicka 100 GB per dag.
  * `Senders` som är [tillåtna](#do-you-have-an-allowlist) är begränsade till att skicka 10 GB per dag.
  * Alla andra `Senders` är begränsade till att skicka 1 GB och/eller 1000 meddelanden per dag.
* Vi har en specifik gräns per `Sender` och `yourdomain.com` på 1 GB och/eller 1000 meddelanden dagligen.

MX-servrarna begränsar också meddelanden som vidarebefordras till en eller flera mottagare genom hastighetsbegränsning – men detta gäller endast `Senders` som inte finns på [tillåtlistan](#do-you-have-an-allowlist):

* Vi tillåter endast upp till 100 anslutningar per timme, per `Sender` upplöst FQDN rot-domän (eller) `Sender` fjärr-IP-adress (om ingen omvänd PTR finns), och per kuvertmottagare. Vi lagrar nyckeln för hastighetsbegränsning som en kryptografisk hash i vår Redis-databas.

* Om du skickar e-post genom vårt system, se till att du har en omvänd PTR inställd för alla dina IP-adresser (annars kommer varje unik FQDN rot-domän eller IP-adress du skickar från att hastighetsbegränsas).

* Observera att om du skickar via ett populärt system som Amazon SES, kommer du inte att hastighetsbegränsas eftersom (vid skrivande stund) Amazon SES finns med på vår tillåtlista.

* Om du skickar från en domän som `test.abc.123.example.com`, kommer hastighetsbegränsningen att tillämpas på `example.com`. Många spammare använder hundratals subdomäner för att kringgå vanliga spamfilter som endast hastighetsbegränsar unika värdnamn istället för unika FQDN rot-domäner.

* `Senders` som överskrider hastighetsgränsen kommer att nekas med ett 421-fel.

Våra IMAP- och SMTP-servrar begränsar dina alias från att ha mer än `60` samtidiga anslutningar samtidigt.

Våra MX-servrar begränsar [icke-tillåtna](#do-you-have-an-allowlist) avsändare från att upprätta mer än 10 samtidiga anslutningar (med 3 minuters cacheutgång för räknaren, vilket speglar vår socket timeout på 3 minuter).

### Hur skyddar ni mot backscatter {#how-do-you-protect-against-backscatter}

Felriktade studsar eller studsspam (kända som "[Backscatter](https://en.wikipedia.org/wiki/Backscatter_\(email\))") kan orsaka negativt rykte för avsändarens IP-adresser.

Vi vidtar två åtgärder för att skydda mot backscatter, vilket beskrivs i följande avsnitt [Förhindra studsar från kända MAIL FROM-spammare](#prevent-bounces-from-known-mail-from-spammers) och [Förhindra onödiga studsar för att skydda mot backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter) nedan.

### Förhindra studsar från kända MAIL FROM-spammare {#prevent-bounces-from-known-mail-from-spammers}

Vi hämtar listan från [Backscatter.org](https://www.backscatterer.org/) (drivs av [UCEPROTECT](https://www.uceprotect.net/)) på <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> varje timme och matar in den i vår Redis-databas (vi jämför också skillnaden i förväg; ifall några IP-adresser tagits bort som måste respekteras).
If the MAIL FROM is blank OR is equal to (case-insensitive) any of the [postmaster addresses](#what-are-postmaster-addresses) (the portion before the @ in an email), then we check to see if the sender IP matches one from this list.

If the sender's IP is listed (and not in our [allowlist](#do-you-have-an-allowlist)), then we send a 554 error with the message `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`.  We will be alerted if a sender is on both the Backscatterer list and in our allowlist so we can resolve the issue if necessary.

The techniques described in this section adhere to the "SAFE MODE" recommendation at <https://www.backscatterer.org/?target=usage> – where we only check the sender IP if certain conditions have already been met.

### Förhindra onödiga studsar för att skydda mot backscatter {#prevent-unnecessary-bounces-to-protect-against-backscatter}

Studsar är e-postmeddelanden som indikerar att e-post vidarebefordran helt misslyckades till mottagaren och e-posten kommer inte att försöka skickas igen.

En vanlig anledning till att hamna på Backscatterer-listan är felriktade studsar eller studsspam, så vi måste skydda mot detta på några sätt:

1. Vi skickar endast när >= 500 statuskodsfel uppstår (när e-post som försökt vidarebefordras har misslyckats, t.ex. Gmail svarar med ett 500-nivå fel).

2. Vi skickar endast en gång och bara en gång (vi använder en beräknad studsfingeravtrycksnyckel och lagrar den i cache för att förhindra dubbletter). Studsfingeravtrycket är en nyckel som är meddelandets fingeravtryck kombinerat med en hash av studsadressen och dess felkod). Se avsnittet om [Fingeravtryck](#how-do-you-determine-an-email-fingerprint) för mer insikt i hur meddelandets fingeravtryck beräknas. Framgångsrikt skickade studsfingeravtryck kommer att löpa ut efter 7 dagar i vår Redis-cache.

3. Vi skickar endast när MAIL FROM och/eller From inte är tomt och inte innehåller (case-insensitive) ett [postmaster-användarnamn](#what-are-postmaster-addresses) (delen före @ i en e-postadress).

4. Vi skickar inte om det ursprungliga meddelandet hade någon av följande headers (case-insensitive):

   * Header `auto-submitted` med ett värde som inte är `no`.
   * Header `x-auto-response-suppress` med värdet `dr`, `autoreply`, `auto-reply`, `auto_reply` eller `all`
   * Header `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` eller `x-auto-respond` (oavsett värde).
   * Header `precedence` med värdet `bulk`, `autoreply`, `auto-reply`, `auto_reply` eller `list`.

5. Vi skickar inte om MAIL FROM eller From e-postadressen slutar med `+donotreply`, `-donotreply`, `+noreply` eller `-noreply`.

6. Vi skickar inte om From e-postadressens användardel var `mdaemon` och den hade en case-insensitive header `X-MDDSN-Message`.

7. Vi skickar inte om det fanns en case-insensitive `content-type` header med värdet `multipart/report`.

### Hur bestämmer ni ett e-postfingeravtryck {#how-do-you-determine-an-email-fingerprint}

Ett e-postmeddelandes fingeravtryck används för att avgöra unika e-postmeddelanden och för att förhindra att dubblettmeddelanden levereras och [dubblettstudsar](#prevent-unnecessary-bounces-to-protect-against-backscatter) skickas.

Fingeravtrycket beräknas från följande lista:

* Klientens uppslagna FQDN-värdnamn eller IP-adress
* `Message-ID` headervärde (om något)
* `Date` headervärde (om något)
* `From` headervärde (om något)
* `To` headervärde (om något)
* `Cc` headervärde (om något)
* `Subject` headervärde (om något)
* `Body` värde (om något)

### Kan jag vidarebefordra e-post till andra portar än 25 (t.ex. om min ISP har blockerat port 25) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Ja, från och med 5 maj 2020 har vi lagt till denna funktion. Just nu är funktionen domänspecifik, till skillnad från alias-specifik. Om du behöver att det ska vara alias-specifikt, vänligen kontakta oss för att meddela dina behov.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Förbättrat integritetsskydd:
  </strong>
  <span>
    Om du har en betald plan (som har förbättrat integritetsskydd), gå då till <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a>, klicka på "Setup" bredvid din domän och klicka sedan på "Inställningar". Om du vill veta mer om betalda planer, se vår <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Prissättning</a>-sida. Annars kan du fortsätta följa instruktionerna nedan.
  </span>
</div>
Om du är på gratisplanen, lägg då helt enkelt till en ny DNS <strong class="notranslate">TXT</strong>-post som visas nedan, men ändra porten från 25 till den port du väljer.

Till exempel, om jag vill att alla e-postmeddelanden som går till `example.com` ska vidarebefordras till aliasmottagares SMTP-port 1337 istället för 25:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Namn/Värd/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Svar/Värde</th>
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
    Det vanligaste scenariot för anpassad portvidarebefordran är när du vill vidarebefordra alla e-postmeddelanden som går till example.com till en annan port på example.com, än SMTP-standarden port 25. För att ställa in detta, lägg helt enkelt till följande <strong class="notranslate">TXT</strong> catch-all-post.
  <span>
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Namn/Värd/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Svar/Värde</th>
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

### Stöder det plus + symbolen för Gmail-alias {#does-it-support-the-plus--symbol-for-gmail-aliases}

Ja, absolut.

### Stöder det subdomäner {#does-it-support-sub-domains}

Ja, absolut. Istället för att använda "@", ".", eller tomt som namn/värd/alias, använder du bara subdomännamnet som värde istället.

Om du vill att `foo.example.com` ska vidarebefordra e-post, ange då `foo` som namn/värd/alias i dina DNS-inställningar (för både MX och <strong class="notranslate">TXT</strong>-poster).

### Vidarebefordrar detta mina e-posthuvuden {#does-this-forward-my-emails-headers}

Ja, absolut.

### Är detta väl testat {#is-this-well-tested}

Ja, det finns tester skrivna med [ava](https://github.com/avajs/ava) och det har även kodtäckning.

### Vidarebefordrar ni SMTP-svarsmeldanden och koder {#do-you-pass-along-smtp-response-messages-and-codes}

Ja, absolut. Till exempel, om du skickar ett e-postmeddelande till `hello@example.com` och det är registrerat att vidarebefordra till `user@gmail.com`, så kommer SMTP-svarsmeddelandet och koden från "gmail.com" SMTP-servern att returneras istället för proxyservern på "mx1.forwardemail.net" eller "mx2.forwardemail.net".

### Hur förhindrar ni spammare och säkerställer gott rykte för e-postvidarebefordran {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Se våra avsnitt om [Hur fungerar ert e-postvidarebefordringssystem](#how-does-your-email-forwarding-system-work), [Hur hanterar ni leveransproblem med e-post](#how-do-you-handle-email-delivery-issues), och [Hur hanterar ni att era IP-adresser blir blockerade](#how-do-you-handle-your-ip-addresses-becoming-blocked) ovan.

### Hur utför ni DNS-uppslagningar på domännamn {#how-do-you-perform-dns-lookups-on-domain-names}

Vi skapade ett open source-program :tangerine: [Tangerine](https://github.com/forwardemail/tangerine) och använder det för DNS-uppslagningar. Standard DNS-servrar som används är `1.1.1.1` och `1.0.0.1`, och DNS-förfrågningar sker via [DNS över HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") på applikationsnivå.

:tangerine: [Tangerine](https://github.com/tangerine) använder [CloudFlares integritetsfokuserade konsument-DNS-tjänst som standard][cloudflare-dns].


## Konto och Fakturering {#account-and-billing}

### Erbjuder ni pengarna tillbaka-garanti på betalda planer {#do-you-offer-a-money-back-guarantee-on-paid-plans}

Ja! Automatiska återbetalningar sker när du uppgraderar, nedgraderar eller avslutar ditt konto inom 30 dagar från när din plan först startade. Detta gäller endast för förstakundsköp.
### Om jag byter abonnemang, gör ni då en proportionell återbetalning av skillnaden {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

Vi gör varken proportionell återbetalning eller återbetalar skillnaden när du byter abonnemang. Istället omvandlar vi den återstående tiden från ditt befintliga abonnemangs utgångsdatum till den närmaste relativa tiden för ditt nya abonnemang (avrundat nedåt per månad).

Observera att om du uppgraderar eller nedgraderar mellan betalda abonnemang inom en 30-dagarsperiod från det att du först började med ett betalt abonnemang, så återbetalar vi automatiskt hela beloppet från ditt befintliga abonnemang.

### Kan jag bara använda denna e-postvidarebefordringstjänst som en "fallback" eller "fallover" MX-server {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

Nej, det rekommenderas inte, eftersom du bara kan använda en mail exchange-server åt gången. Fallbacks försöks vanligtvis aldrig igen på grund av prioriteringsfel och mailservrar som inte respekterar kontroll av MX-prioritet.

### Kan jag inaktivera specifika alias {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktigt:
  </strong>
  <span>
    Om du har ett betalt abonnemang måste du gå till <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Alias <i class="fa fa-angle-right"></i> Redigera alias <i class="fa fa-angle-right"></i> Avmarkera kryssrutan "Aktiv" <i class="fa fa-angle-right"></i> Fortsätt.
  </span>
</div>

Ja, redigera helt enkelt din DNS <strong class="notranslate">TXT</strong>-post och prefixa aliaset med en, två eller tre utropstecken (se nedan).

Observera att du *bör* behålla ":"-mappningen, eftersom detta krävs om du någonsin bestämmer dig för att slå av detta (och det används också för import om du uppgraderar till ett av våra betalda abonnemang).

**För tyst avvisning (ser för avsändaren ut som om meddelandet skickades framgångsrikt, men går egentligen ingenstans) (statuskod `250`):** Om du prefixar ett alias med "!" (ett utropstecken) kommer det att returnera en lyckad statuskod `250` till avsändare som försöker skicka till denna adress, men e-posten går ingenstans (t.ex. ett svart hål eller `/dev/null`).

**För mjuk avvisning (statuskod `421`):** Om du prefixar ett alias med "!!" (två utropstecken) kommer det att returnera en mjuk felstatuskod `421` till avsändare som försöker skicka till denna adress, och e-posten kommer ofta att försöka skickas igen i upp till 5 dagar innan avvisning och studs.

**För hård avvisning (statuskod `550`):** Om du prefixar ett alias med "!!!" (tre utropstecken) kommer det att returnera en permanent felstatuskod `550` till avsändare som försöker skicka till denna adress och e-posten kommer att avvisas och studsa.

Till exempel, om jag vill att all e-post som går till `alias@example.com` ska sluta vidarebefordras till `user@gmail.com` och istället avvisas och studsa (t.ex. använd tre utropstecken):

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Namn/Värd/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Svar/Värde</th>
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
    Du kan också skriva om den vidarebefordrade mottagarens adress till helt enkelt "nobody@forwardemail.net", vilket kommer att dirigera den till nobody som i exemplet nedan.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Namn/Värd/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Svar/Värde</th>
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
    Om du vill ha ökad säkerhet kan du också ta bort delen ":user@gmail.com" (eller ":nobody@forwardemail.net"), så att det bara står "!!!alias" som i exemplet nedan.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Namn/Värd/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Svar/Värde</th>
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

### Kan jag vidarebefordra e-post till flera mottagare {#can-i-forward-emails-to-multiple-recipients}

Ja, absolut. Ange bara flera mottagare i dina <strong class="notranslate">TXT</strong>-poster.

Till exempel, om jag vill att ett e-postmeddelande som går till `hello@example.com` ska vidarebefordras till `user+a@gmail.com` och `user+b@gmail.com`, så skulle min <strong class="notranslate">TXT</strong>-post se ut så här:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Namn/Värd/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Svar/Värde</th>
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

Eller så kan du ange dem på två separata rader, som detta:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Namn/Värd/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Svar/Värde</th>
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

Det är upp till dig!

### Kan jag ha flera globala catch-all-mottagare {#can-i-have-multiple-global-catch-all-recipients}

Ja, det kan du. Ange bara flera globala catch-all-mottagare i dina <strong class="notranslate">TXT</strong>-poster.

Till exempel, om jag vill att varje e-post som går till `*@example.com` (asterisken betyder att det är en wildcard, alltså catch-all) ska vidarebefordras till `user+a@gmail.com` och `user+b@gmail.com`, så skulle min <strong class="notranslate">TXT</strong>-post se ut så här:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Namn/Värd/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Svar/Värde</th>
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

Eller så kan du ange dem på två separata rader, som detta:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Namn/Värd/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Svar/Värde</th>
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
Det är upp till dig!

### Finns det en maximal gräns för hur många e-postadresser jag kan vidarebefordra till per alias {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

Ja, standardgränsen är 10. Detta betyder INTE att du bara kan ha 10 alias på ditt domännamn. Du kan ha så många alias du vill (ett obegränsat antal). Det betyder att du bara kan vidarebefordra ett alias till 10 unika e-postadresser. Du kan ha `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (från 1-10) – och alla e-postmeddelanden till `hello@example.com` skulle vidarebefordras till `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (från 1-10).

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tips:
  </strong>
  <span>
    Behöver du fler än 10 mottagare per alias? Skicka oss ett e-postmeddelande så ökar vi gärna gränsen för ditt konto.
  </span>
</div>

### Kan jag vidarebefordra e-postmeddelanden rekursivt {#can-i-recursively-forward-emails}

Ja, det kan du, men du måste fortfarande följa den maximala gränsen. Om du har `hello:linus@example.com` och `linus:user@gmail.com`, så skulle e-post till `hello@example.com` vidarebefordras till `linus@example.com` och `user@gmail.com`. Observera att ett felmeddelande visas om du försöker vidarebefordra e-post rekursivt bortom den maximala gränsen.

### Kan folk avregistrera eller registrera min e-postvidarebefordran utan mitt tillstånd {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

Vi använder MX- och <strong class="notranslate">TXT</strong>-postverifiering, så om du lägger till denna tjänsts respektive MX- och <strong class="notranslate">TXT</strong>-poster är du registrerad. Om du tar bort dem är du avregistrerad. Du äger din domän och DNS-hantering, så om någon har tillgång till det är det ett problem.

### Hur är det gratis {#how-is-it-free}

Forward Email erbjuder en gratis nivå genom en kombination av öppen källkod, effektiv infrastruktur och valfria betalda planer som stödjer tjänsten.

Vår gratisnivå stöds av:

1. **Öppen källkod**: Vår kodbas är öppen, vilket möjliggör bidrag från communityn och transparent drift.

2. **Effektiv infrastruktur**: Vi har optimerat våra system för att hantera e-postvidarebefordran med minimala resurser.

3. **Betalda premiumplaner**: Användare som behöver extra funktioner som SMTP-sändning, IMAP-mottagning eller förbättrade sekretessalternativ prenumererar på våra betalda planer.

4. **Rimliga användningsgränser**: Gratisnivån har rättvisa användningsregler för att förhindra missbruk.

> \[!NOTE]
> Vi är engagerade i att hålla grundläggande e-postvidarebefordran gratis samtidigt som vi erbjuder premiumfunktioner för användare med mer avancerade behov.

> \[!TIP]
> Om du tycker att vår tjänst är värdefull, överväg att uppgradera till en betald plan för att stödja fortsatt utveckling och underhåll.

### Vad är den maximala e-poststorleksgränsen {#what-is-the-max-email-size-limit}

Vi har som standard en storleksgräns på 50MB, vilket inkluderar innehåll, rubriker och bilagor. Observera att tjänster som Gmail och Outlook endast tillåter en storleksgräns på 25MB, och om du överskrider gränsen när du skickar till adresser hos dessa leverantörer får du ett felmeddelande.

Ett fel med korrekt svarskod returneras om filstorleksgränsen överskrids.

### Sparar ni loggar på e-postmeddelanden {#do-you-store-logs-of-emails}

Nej, vi skriver inte till disk eller sparar loggar – med [undantag för fel](#do-you-store-error-logs) och [utgående SMTP](#do-you-support-sending-email-with-smtp) (se vår [Integritetspolicy](/privacy)).

Allt görs i minnet och [vår källkod finns på GitHub](https://github.com/forwardemail).

### Sparar ni fel-loggar {#do-you-store-error-logs}

**Ja. Du kan komma åt fel-loggar under [Mitt konto → Loggar](/my-account/logs) eller [Mitt konto → Domäner](/my-account/domains).**

Från och med februari 2023 sparar vi fel-loggar för `4xx` och `5xx` SMTP-svarskoder i 7 dagar – som innehåller SMTP-felet, kuvertet och e-postrubrikerna (vi **sparar inte** e-postens innehåll eller bilagor).
Fel-loggar låter dig kontrollera om viktiga e-postmeddelanden saknas och minska falska positiva spam för [dina domäner](/my-account/domains). De är också en utmärkt resurs för att felsöka problem med [e-postwebhooks](#do-you-support-webhooks) (eftersom fel-loggarna innehåller webhook-endpointens svar).

Fel-loggar för [rate limiting](#do-you-have-rate-limiting) och [greylisting](#do-you-have-a-greylist) är inte tillgängliga eftersom anslutningen avslutas tidigt (t.ex. innan `RCPT TO` och `MAIL FROM` kommandon kan skickas).

Se vår [Integritetspolicy](/privacy) för mer insikt.

### Läser ni mina e-postmeddelanden {#do-you-read-my-emails}

Nej, absolut inte. Se vår [Integritetspolicy](/privacy).

Många andra e-postvidarebefordringstjänster lagrar och kan potentiellt läsa din e-post. Det finns ingen anledning till att vidarebefordrade e-postmeddelanden behöver lagras på disk – därför har vi designat den första open-source-lösningen som hanterar allt i minnet.

Vi anser att du ska ha rätt till integritet och vi respekterar det strikt. Koden som körs på servern är [öppen källkod på GitHub](https://github.com/forwardemail) för transparens och för att bygga förtroende.

### Kan jag "skicka mail som" i Gmail med detta {#can-i-send-mail-as-in-gmail-with-this}

Ja! Från och med den 2 oktober 2018 har vi lagt till denna funktion. Se [Hur man skickar mail som med Gmail](#how-to-send-mail-as-using-gmail) ovan!

Du bör också ställa in SPF-posten för Gmail i din DNS-konfiguration som en <strong class="notranslate">TXT</strong>-post.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktigt:
  </strong>
  <span>
    Om du använder Gmail (t.ex. Skicka mail som) eller G Suite, måste du lägga till <code>include:_spf.google.com</code> i din SPF <strong class="notranslate">TXT</strong>-post, till exempel:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

### Kan jag "skicka mail som" i Outlook med detta {#can-i-send-mail-as-in-outlook-with-this}

Ja! Från och med den 2 oktober 2018 har vi lagt till denna funktion. Se helt enkelt dessa två länkar från Microsoft nedan:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

Du bör också ställa in SPF-posten för Outlook i din DNS-konfiguration som en <strong class="notranslate">TXT</strong>-post.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktigt:
  </strong>
  <span>
    Om du använder Microsoft Outlook eller Live.com måste du lägga till <code>include:spf.protection.outlook.com</code> i din SPF <strong class="notranslate">TXT</strong>-post, till exempel:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

### Kan jag "skicka mail som" i Apple Mail och iCloud Mail med detta {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

Om du är prenumerant på iCloud+ kan du använda en egen domän. [Vår tjänst är också kompatibel med Apple Mail](#apple-mail).

Se <https://support.apple.com/en-us/102540> för mer information.

### Kan jag vidarebefordra obegränsat med e-post med detta {#can-i-forward-unlimited-emails-with-this}

Ja, men "relativt okända" avsändare är begränsade till 100 anslutningar per timme per värdnamn eller IP. Se avsnitten om [Rate Limiting](#do-you-have-rate-limiting) och [Greylisting](#do-you-have-a-greylist) ovan.

Med "relativt okända" menar vi avsändare som inte finns i [vitlistan](#do-you-have-an-allowlist).

Om denna gräns överskrids skickar vi en 421-svarskod som talar om för avsändarens mailserver att försöka igen senare.

### Erbjuder ni obegränsade domäner för ett pris {#do-you-offer-unlimited-domains-for-one-price}

Ja. Oavsett vilken plan du har betalar du endast en månadsavgift – som täcker alla dina domäner.
### Vilka betalningsmetoder accepterar ni {#which-payment-methods-do-you-accept}

Forward Email accepterar följande engångs- eller månads-/kvartals-/årsbetalningsmetoder:

1. **Kredit-/Betalkort/Banköverföringar**: Visa, Mastercard, American Express, Discover, JCB, Diners Club, etc.
2. **PayPal**: Koppla ditt PayPal-konto för enkla betalningar
3. **Kryptovaluta**: Vi accepterar betalningar via Stripes stablecoin-betalningar på Ethereum-, Polygon- och Solana-nätverken

> \[!NOTE]
> Vi lagrar begränsad betalningsinformation på våra servrar, vilket endast inkluderar betalningsidentifierare och referenser till [Stripe](https://stripe.com/global) och [PayPal](https://www.paypal.com) transaktions-, kund-, prenumerations- och betalnings-ID:n.

> \[!TIP]
> För maximal integritet, överväg att använda kryptovalutabetalningar.

Alla betalningar behandlas säkert via Stripe eller PayPal. Dina betalningsuppgifter lagras aldrig på våra servrar.


## Ytterligare resurser {#additional-resources}

> \[!TIP]
> Våra artiklar nedan uppdateras regelbundet med nya guider, tips och teknisk information. Kolla ofta för det senaste innehållet.

* [Fallstudier & utvecklardokumentation](/blog/docs)
* [Resurser](/resources)
* [Guider](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/
