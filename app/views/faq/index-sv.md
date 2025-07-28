# Vanliga frågor {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="" class="rounded-lg" />

## Innehållsförteckning {#table-of-contents}

* [Snabbstart](#quick-start)
* [Introduktion](#introduction)
  * [Vad är vidarebefordran av e-post](#what-is-forward-email)
  * [Vem använder vidarebefordra e-post](#who-uses-forward-email)
  * [Vad är historiken för vidarebefordran av e-post?](#what-is-forward-emails-history)
  * [Hur snabb är den här tjänsten](#how-fast-is-this-service)
* [E-postklienter](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [Mobila enheter](#mobile-devices)
  * [Hur man skickar e-post som med Gmail](#how-to-send-mail-as-using-gmail)
  * [Vad är den äldre kostnadsfria guiden för Skicka e-post som med Gmail](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Avancerad Gmail-routingkonfiguration](#advanced-gmail-routing-configuration)
  * [Avancerad Outlook-routingkonfiguration](#advanced-outlook-routing-configuration)
* [Felsökning](#troubleshooting)
  * [Varför får jag inte mina testmejl](#why-am-i-not-receiving-my-test-emails)
  * [Hur konfigurerar jag min e-postklient för att fungera med vidarebefordran av e-post](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Varför hamnar mina e-postmeddelanden i skräppost och skräppost och hur kan jag kontrollera mitt domänrykte?](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [Vad ska jag göra om jag får skräppostmejl](#what-should-i-do-if-i-receive-spam-emails)
  * [Varför visas mina testmejl som skickats till mig själv i Gmail som "misstänkta"?](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Kan jag ta bort via forwardemail punkt .net i Gmail?](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Datahantering](#data-management)
  * [Var finns era servrar](#where-are-your-servers-located)
  * [Hur exporterar och säkerhetskopierar jag min e-postlåda](#how-do-i-export-and-backup-my-mailbox)
  * [Hur importerar och migrerar jag min befintliga postlåda](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Stöder du självhotell](#do-you-support-self-hosting)
* [E-postkonfiguration](#email-configuration)
  * [Hur kommer jag igång och konfigurerar vidarebefordran av e-post](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Kan jag använda flera MX-börser och servrar för avancerad vidarebefordran?](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Hur ställer jag in en semestersvarare (automatisk svarare utanför kontoret)](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Hur konfigurerar jag SPF för vidarebefordran av e-post?](#how-do-i-set-up-spf-for-forward-email)
  * [Hur konfigurerar jag DKIM för vidarebefordran av e-post?](#how-do-i-set-up-dkim-for-forward-email)
  * [Hur konfigurerar jag DMARC för vidarebefordran av e-post](#how-do-i-set-up-dmarc-for-forward-email)
  * [Hur ansluter och konfigurerar jag mina kontakter](#how-do-i-connect-and-configure-my-contacts)
  * [Hur ansluter och konfigurerar jag mina kalendrar](#how-do-i-connect-and-configure-my-calendars)
  * [Hur lägger jag till fler kalendrar och hanterar befintliga kalendrar?](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Hur konfigurerar jag SRS för vidarebefordran av e-post?](#how-do-i-set-up-srs-for-forward-email)
  * [Hur konfigurerar jag MTA-STS för vidarebefordran av e-post?](#how-do-i-set-up-mta-sts-for-forward-email)
  * [Hur lägger jag till en profilbild till min e-postadress](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Avancerade funktioner](#advanced-features)
  * [Stöder ni nyhetsbrev eller e-postlistor för marknadsföringsrelaterad e-post?](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Stöder ni att skicka e-post med API?](#do-you-support-sending-email-with-api)
  * [Stöder ni att ta emot e-post med IMAP](#do-you-support-receiving-email-with-imap)
  * [Stöder du POP3](#do-you-support-pop3)
  * [Stöder ni kalendrar (CalDAV)?](#do-you-support-calendars-caldav)
  * [Stödjer ni kontakter (CardDAV)](#do-you-support-contacts-carddav)
  * [Stöder ni att skicka e-post med SMTP](#do-you-support-sending-email-with-smtp)
  * [Stöder ni OpenPGP/MIME, end-to-end-kryptering ("E2EE") och Web Key Directory ("WKD")?](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Stödjer du MTA-STS?](#do-you-support-mta-sts)
  * [Stöder ni lösenord och WebAuthn?](#do-you-support-passkeys-and-webauthn)
  * [Stöder ni bästa praxis för e-post](#do-you-support-email-best-practices)
  * [Stödjer ni studsande webhooks](#do-you-support-bounce-webhooks)
  * [Stödjer ni webhooks?](#do-you-support-webhooks)
  * [Stöder ni reguljära uttryck eller regex?](#do-you-support-regular-expressions-or-regex)
  * [Vilka är era utgående SMTP-gränser](#what-are-your-outbound-smtp-limits)
  * [Behöver jag godkännande för att aktivera SMTP](#do-i-need-approval-to-enable-smtp)
  * [Vilka är dina SMTP-serverkonfigurationsinställningar](#what-are-your-smtp-server-configuration-settings)
  * [Vilka är dina IMAP-serverkonfigurationsinställningar](#what-are-your-imap-server-configuration-settings)
  * [Vilka är dina POP3-serverkonfigurationsinställningar](#what-are-your-pop3-server-configuration-settings)
  * [Postfix SMTP-reläkonfiguration](#postfix-smtp-relay-configuration)
* [Säkerhet](#security)
  * [Avancerade serverhärdningstekniker](#advanced-server-hardening-techniques)
  * [Har ni SOC 2- eller ISO 27001-certifieringar?](#do-you-have-soc-2-or-iso-27001-certifications)
  * [Använder ni TLS-kryptering för vidarebefordran av e-post?](#do-you-use-tls-encryption-for-email-forwarding)
  * [Bevarar ni rubriker för e-postautentisering](#do-you-preserve-email-authentication-headers)
  * [Bevarar ni ursprungliga e-postrubriker och förhindrar förfalskning?](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Hur skyddar du dig mot spam och missbruk](#how-do-you-protect-against-spam-and-abuse)
  * [Lagrar ni e-postinnehåll på disk?](#do-you-store-email-content-on-disk)
  * [Kan e-postinnehåll exponeras vid systemkrascher](#can-email-content-be-exposed-during-system-crashes)
  * [Vem har åtkomst till er e-postinfrastruktur](#who-has-access-to-your-email-infrastructure)
  * [Vilka infrastrukturleverantörer använder ni](#what-infrastructure-providers-do-you-use)
  * [Erbjuder ni ett databehandlingsavtal (DPA)?](#do-you-offer-a-data-processing-agreement-dpa)
  * [Hur hanterar ni anmälningar om dataintrång](#how-do-you-handle-data-breach-notifications)
  * [Erbjuder ni en testmiljö](#do-you-offer-a-test-environment)
  * [Tillhandahåller ni övervaknings- och varningsverktyg?](#do-you-provide-monitoring-and-alerting-tools)
  * [Hur säkerställer du hög tillgänglighet](#how-do-you-ensure-high-availability)
  * [Följer du kraven i avsnitt 889 i lagen om nationell försvarsauktorisering (NDAA)?](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [System- och tekniska detaljer](#system-and-technical-details)
  * [Lagrar ni e-postmeddelanden och deras innehåll](#do-you-store-emails-and-their-contents)
  * [Hur fungerar ert system för vidarebefordran av e-post?](#how-does-your-email-forwarding-system-work)
  * [Hur hanterar man ett e-postmeddelande för vidarebefordran](#how-do-you-process-an-email-for-forwarding)
  * [Hur hanterar ni problem med e-postleverans](#how-do-you-handle-email-delivery-issues)
  * [Hur hanterar du blockeringar av dina IP-adresser?](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [Vad är postmästaradresser](#what-are-postmaster-addresses)
  * [Vad är adresser utan svarsregler](#what-are-no-reply-addresses)
  * [Vilka är din servers IP-adresser](#what-are-your-servers-ip-addresses)
  * [Har du en tillåtelselista](#do-you-have-an-allowlist)
  * [Vilka domännamnstillägg är tillåtna som standard](#what-domain-name-extensions-are-allowlisted-by-default)
  * [Vilka är era kriterier för godkännandelista](#what-is-your-allowlist-criteria)
  * [Vilka domännamnstillägg kan användas gratis](#what-domain-name-extensions-can-be-used-for-free)
  * [Har du en grålista](#do-you-have-a-greylist)
  * [Har du en avvisarlista](#do-you-have-a-denylist)
  * [Har du en gräns för hastigheten](#do-you-have-rate-limiting)
  * [Hur skyddar man sig mot bakåtspridning](#how-do-you-protect-against-backscatter)
  * [Förhindra studsar från kända E-POSTFRÅN-spammare](#prevent-bounces-from-known-mail-from-spammers)
  * [Förhindra onödiga studsar för att skydda mot bakåtspridning](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Hur man bestämmer ett e-postfingeravtryck](#how-do-you-determine-an-email-fingerprint)
  * [Kan jag vidarebefordra e-postmeddelanden till andra portar än 25 (t.ex. om min internetleverantör har blockerat port 25)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Stöder det plustecknet + för Gmail-alias](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Stöder det underdomäner](#does-it-support-sub-domains)
  * [Vidarebefordrar detta mina e-postrubriker?](#does-this-forward-my-emails-headers)
  * [Är detta välbeprövat](#is-this-well-tested)
  * [Skickar du vidare SMTP-svarsmeddelanden och koder](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Hur förhindrar du spammare och säkerställer ett gott rykte för vidarebefordran av e-post](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Hur gör man DNS-sökningar på domännamn](#how-do-you-perform-dns-lookups-on-domain-names)
* [Konto och fakturering](#account-and-billing)
  * [Erbjuder ni pengarna-tillbaka-garanti på betalda planer](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Om jag byter abonnemang, betalar ni då proportionellt och återbetalar mellanskillnaden?](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Kan jag bara använda den här e-postvidarebefordringstjänsten som en "fallback" eller "fallover" MX-server?](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Kan jag inaktivera specifika alias](#can-i-disable-specific-aliases)
  * [Kan jag vidarebefordra e-postmeddelanden till flera mottagare](#can-i-forward-emails-to-multiple-recipients)
  * [Kan jag ha flera globala catch-all-mottagare](#can-i-have-multiple-global-catch-all-recipients)
  * [Finns det en maxgräns för antalet e-postadresser jag kan vidarebefordra till per alias](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Kan jag vidarebefordra e-postmeddelanden rekursivt?](#can-i-recursively-forward-emails)
  * [Kan folk avregistrera sig eller registrera min vidarebefordran av e-post utan mitt tillstånd](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Hur är det gratis](#how-is-it-free)
  * [Vad är den maximala storleken på e-postmeddelanden?](#what-is-the-max-email-size-limit)
  * [Lagrar ni loggar över e-postmeddelanden](#do-you-store-logs-of-emails)
  * [Lagrar ni felloggar](#do-you-store-error-logs)
  * [Läser du mina mejl](#do-you-read-my-emails)
  * [Kan jag "skicka e-post som" i Gmail med detta?](#can-i-send-mail-as-in-gmail-with-this)
  * [Kan jag "skicka e-post som" i Outlook med detta?](#can-i-send-mail-as-in-outlook-with-this)
  * [Kan jag "skicka e-post som" i Apple Mail och iCloud Mail med detta?](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Kan jag vidarebefordra obegränsat med e-postmeddelanden med detta?](#can-i-forward-unlimited-emails-with-this)
  * [Erbjuder ni obegränsat med domäner till ett pris?](#do-you-offer-unlimited-domains-for-one-price)
  * [Vilka betalningsmetoder accepterar ni](#which-payment-methods-do-you-accept)
* [Ytterligare resurser](#additional-resources)

## Snabbstart {#quick-start}

Så här kommer du igång med vidarebefordran av e-post:

1. **Skapa ett konto** på [forwardemail.net/register](https://forwardemail.net/register)

2. **Lägg till och verifiera din domän** under [Mitt konto → Domäner](/my-account/domains)

3. **Lägg till och konfigurera e-postalias/brevlådor** under [Mitt konto → Domäner](/my-account/domains) → Alias

4. **Testa din installation** genom att skicka ett e-postmeddelande till ett av dina nya alias

> \[!TIP]
> DNS changes can take up to 24-48 hours to propagate globally, though they often take effect much sooner.

> \[!IMPORTANT]
> For enhanced deliverability, we recommend setting up [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email), and [DMARC](#how-do-i-set-up-dmarc-for-forward-email) records.

## Introduktion {#introduction}

### Vad är vidarebefordran av e-post {#what-is-forward-email}

> \[!NOTE]
> Forward Email is perfect for individuals, small businesses, and developers who want professional email addresses without the cost and maintenance of a full email hosting solution.

Forward Email är en **fullfjädrad e-postleverantör** och **e-posthotellleverantör för anpassade domännamn**.

Det är den enda kostnadsfria tjänsten med öppen källkod, och låter dig använda anpassade domän-e-postadresser utan komplexiteten i att konfigurera och underhålla din egen e-postserver.

Vår tjänst vidarebefordrar e-postmeddelanden som skickas till din anpassade domän till ditt befintliga e-postkonto – och du kan till och med använda oss som din dedikerade e-posthotellleverantör.

Viktiga funktioner för vidarebefordran av e-post:

* **E-postadress med anpassad domän**: Använd professionella e-postadresser med ditt eget domännamn
* **Gratisnivå**: Grundläggande vidarebefordran av e-post utan kostnad
* **Förbättrad integritet**: Vi läser inte dina e-postmeddelanden eller säljer dina data
* **Öppen källkod**: Hela vår kodbas finns tillgänglig på GitHub
* **Stöd för SMTP, IMAP och POP3**: Fullständiga funktioner för att skicka och ta emot e-post
* **End-to-End-kryptering**: Stöd för OpenPGP/MIME
* **Anpassade Catch-All-alias**: Skapa obegränsat antal e-postalias

Du kan jämföra oss med fler än 56 andra e-postleverantörer på [vår sida om e-postjämförelse](/blog/best-email-service).

> \[!TIP]
> Learn more about Forward Email by reading our free [Technical Whitepaper](/technical-whitepaper.pdf)

### Vem använder vidarebefordran av e-post {#who-uses-forward-email}

Vi erbjuder e-posthosting och vidarebefordran av e-post till över 500 000 domäner och dessa anmärkningsvärda användare:

| Kund | Fallstudie |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Amerikanska marinakademin | [:page_facing_up: Case Study](/blog/docs/federal-government-email-service-section-889-compliant) |
| Kanonisk | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Netflix-spel |  |
| Linuxstiftelsen | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| PHP-stiftelsen |  |
| Fox News Radio |  |
| Disneys annonsförsäljning |  |
| jQuery | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| LineageOS |  |
| Ubuntu | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| I mänskligheten | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Lubuntu | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| University of Cambridge | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| University of Maryland | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| University of Washington | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Tufts universitet | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Swarthmore College | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Södra Australiens regering |  |
| Dominikanska republikens regering |  |
| Flyg<span>.</span>io |  |
| RCD-hotell |  |
| Isaac Z. Schlueter (npm) | [:page_facing_up: Case Study](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |  |

### Vad är historiken för vidarebefordrade e-postmeddelanden {#what-is-forward-emails-history}

Du kan läsa mer om vidarebefordran av e-post på [vår Om-sida](/about).

### Hur snabb är den här tjänsten {#how-fast-is-this-service}

> \[!NOTE]
> Our system is designed for speed and reliability, with multiple redundant servers to ensure your emails are delivered promptly.

Vidarebefordra e-post levererar meddelanden med minimal fördröjning, vanligtvis inom några sekunder efter mottagandet.

Prestandamätvärden:

* **Genomsnittlig leveranstid**: Mindre än 5–10 sekunder från mottagande till vidarebefordran ([se vår sida för övervakning av tid till inkorg "TTI"](/tti))
* **Drifttid**: 99,9 %+ tillgänglighet
* **Global infrastruktur**: Servrar strategiskt placerade för optimal routing
* **Automatisk skalning**: Vårt system skalar under perioder med hög e-postbelastning

Vi arbetar i realtid, till skillnad från andra leverantörer som förlitar sig på fördröjda köer.

Vi skriver inte till disk eller lagrar loggar – med [undantag för fel](#do-you-store-error-logs) och [utgående SMTP](#do-you-support-sending-email-with-smtp) (se vår [Integritetspolicy](/privacy)).

Allt görs i minnet och [vår källkod finns på GitHub](https://github.com/forwardemail).

## E-postklienter {#email-clients}

### Thunderbird {#thunderbird}

1. Skapa ett nytt alias och generera ett lösenord i din instrumentpanel för vidarebefordran av e-post.
2. Öppna Thunderbird och gå till **Redigera → Kontoinställningar → Kontoåtgärder → Lägg till e-postkonto**.
3. Ange ditt namn, din e-postadress för vidarebefordran och ditt lösenord.
4. Klicka på **Konfigurera manuellt** och ange:
* Inkommande: IMAP, `imap.forwardemail.net`, port 993, SSL/TLS
* Utgående: SMTP, `smtp.forwardemail.net`, port 587, STARTTLS
5. Klicka på **Klart**.

### Microsoft Outlook {#microsoft-outlook}

1. Skapa ett nytt alias och generera ett lösenord i din instrumentpanel för vidarebefordran av e-post.
2. Gå till **Arkiv → Lägg till konto**
3. Ange din vidarebefordran av e-postadress och klicka på **Anslut**
4. Välj **Avancerade alternativ** och välj **Låt mig konfigurera mitt konto manuellt**
5. Välj **IMAP** och ange:
* Inkommande: `imap.forwardemail.net`, port 993, SSL
* Utgående: `smtp.forwardemail.net`, port 587, TLS
* Användarnamn: Din fullständiga e-postadress
* Lösenord: Ditt genererade lösenord
6. Klicka på **Anslut**

### Apple Mail {#apple-mail}

1. Skapa ett nytt alias och generera ett lösenord i din instrumentpanel för vidarebefordran av e-post.
2. Gå till **E-post → Inställningar → Konton → +**
3. Välj **Annat e-postkonto**
4. Ange ditt namn, din e-postadress för vidarebefordran och ditt lösenord.
5. För serverinställningar, ange:
* Inkommande: `imap.forwardemail.net`
* Utgående: `smtp.forwardemail.net`
* Användarnamn: Din fullständiga e-postadress.
* Lösenord: Ditt genererade lösenord.
6. Klicka på **Logga in**

### Mobila enheter {#mobile-devices}

För iOS:

1. Gå till **Inställningar → E-post → Konton → Lägg till konto → Annat**
2. Tryck på **Lägg till e-postkonto** och ange dina uppgifter
3. För serverinställningar, använd samma IMAP- och SMTP-inställningar som ovan

För Android:

1. Gå till **Inställningar → Konton → Lägg till konto → Personligt (IMAP)**
2. Ange din vidarebefordransadress och ditt lösenord
3. För serverinställningar, använd samma IMAP- och SMTP-inställningar som ovan

### Hur man skickar e-post som med Gmail {#how-to-send-mail-as-using-gmail}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Beräknad installationstid:</strong>
<span>Mindre än 10 minuter</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Komma igång:
</strong>
<span>
Om du har följt instruktionerna ovan under <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Hur kommer jag igång och konfigurerar vidarebefordran av e-post</a> kan du fortsätta läsa nedan.
</span>
</div>

<div id="skicka-e-post-som-innehåll">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktigt:
</strong>
<span>
Var god läs vår <a href="/terms" class="alert-link" target="_blank">Villkor</a>, <a href="/privacy" class="alert-link" target="_blank">Integritetspolicy</a> och <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Utgående SMTP-gränser</a> – din användning betraktas som ett godkännande och godkännande.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktigt:
</strong>
<span>
Om du är en utvecklare, se våra <a class="alert-link" href="/email-api#outbound-emails" target="_blank">dokumentationer för e-post-API</a>.
</span>
</div>

1. Gå till <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Inställningar <i class="fa fa-angle-right"></i> Utgående SMTP-konfiguration och följ installationsanvisningarna.

2. Skapa ett nytt alias för din domän under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mitt konto <i class="fa fa-angle-right"></i>Domäner</a> <i class="fa fa-angle-right"></i>Alias (t.ex. <code><hello@example.com></code>)

3. Klicka på <strong class="text-success"><i class="fa fa-key"></i>Generera lösenord</strong> bredvid det nyskapade aliaset. Kopiera till Urklipp och lagra det genererade lösenordet som visas på skärmen på ett säkert sätt.

4. Gå till [Gmail](https://gmail.com) och under [Inställningar <i class="fa fa-angle-right"></i> Konton och import <i class="fa fa-angle-right"></i> Skicka e-post som](https://mail.google.com/mail/u/0/#settings/accounts) klickar du på "Lägg till ytterligare en e-postadress".

5. När du blir ombedd att ange "Namn", ange namnet som du vill att din e-postadress ska visas som "Från" (t.ex. "Linus Torvalds").

6. När du blir ombedd att ange "E-postadress", ange den fullständiga e-postadressen för ett alias du skapade under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Alias (t.ex. <code><hello@example.com></code>)

7. Avmarkera "Behandla som ett alias"

8. Klicka på "Nästa steg" för att fortsätta

9. När du uppmanas att ange "SMTP-server", ange <code>smtp.forwardemail.net</code> och lämna porten <code>587</code>

10. När du blir ombedd att ange "Användarnamn", ange den fullständiga e-postadressen för ett alias du skapade under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Alias (t.ex. <code><hello@example.com></code>)

11. När du blir ombedd att ange "Lösenord", klistra in lösenordet från <strong class="text-success"><i class="fa fa-key"></i>Generera lösenord</strong> i steg 3 ovan.

12. Lämna alternativknappen markerad för "Säker anslutning med TLS"

13. Klicka på "Lägg till konto" för att fortsätta

14. Öppna en ny flik i [Gmail](https://gmail.com) och vänta på att ditt verifieringsmejl ska komma (du får en verifieringskod som bekräftar att du är ägare till den e-postadress du försöker "Skicka e-post som").

15. När den har kommit, kopiera och klistra in verifieringskoden vid uppmaningen du fick i föregående steg.

16. När du har gjort det, gå tillbaka till e-postmeddelandet och klicka på länken för att "bekräfta begäran". Du kommer troligtvis att behöva göra detta steg och föregående steg för att e-postmeddelandet ska konfigureras korrekt.

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Grattis!
</strong>
<span>
Du har slutfört alla steg.
</span>
</div>
</div>

</div>

### Vilken är den kostnadsfria guiden för Skicka e-post som med Gmail? {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Viktigt:</strong> Denna äldre gratisguide är föråldrad från och med maj 2023 eftersom <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">we nu stöder utgående SMTP</a>. Om du använder guiden nedan kommer <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">this att få din utgående e-post</a> att visa "<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>" i Gmail.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Beräknad installationstid:</strong>
<span>Mindre än 10 minuter</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Komma igång:
</strong>
<span>
Om du har följt instruktionerna ovan under <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Hur kommer jag igång och konfigurerar vidarebefordran av e-post</a> kan du fortsätta läsa nedan.
</span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="Hur man skickar e-post som med Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>"

<div id="äldre-fri-guide">

1. Du måste ha [Gmails tvåfaktorsautentisering][gmail-2fa] aktiverat för att detta ska fungera. Besök <https://www.google.com/landing/2step/> om du inte har det aktiverat.

2. När tvåfaktorsautentisering är aktiverat (eller om du redan hade det aktiverat), besök <https://myaccount.google.com/apppasswords>.

3. När du uppmanas att välja "Välj den app och enhet du vill generera applösenordet för":
* Välj "E-post" i rullgardinsmenyn för "Välj app"
* Välj "Annat" i rullgardinsmenyn för "Välj enhet"
* När du uppmanas att skriva in text anger du den e-postadress för din anpassade domän som du vidarebefordrar från (t.ex. <kod><hello@example.com></kod> – detta hjälper dig att hålla koll om du använder den här tjänsten för flera konton)

4. Kopiera lösenordet till ditt urklipp som genereras automatiskt.
<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktigt:
</strong>
<span>
Om du använder G Suite, besök din administratörspanel <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Appar <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Inställningar för Gmail <i class="fa fa-angle-right"></i> Inställningar</a> och se till att markera "Tillåt användare att skicka e-post via en extern SMTP-server...". Det kommer att dröja en stund innan den här ändringen aktiveras, så vänta några minuter.
</span>
</div>

5. Gå till [Gmail](https://gmail.com) och under [Inställningar <i class="fa fa-angle-right"></i> Konton och import <i class="fa fa-angle-right"></i> Skicka e-post som](https://mail.google.com/mail/u/0/#settings/accounts) klickar du på "Lägg till ytterligare en e-postadress".

6. När du blir ombedd att ange "Namn", ange namnet som du vill att din e-postadress ska visas som "Från" (t.ex. "Linus Torvalds")

7. När du blir ombedd att ange "E-postadress", ange e-postadressen med den anpassade domänen du använde ovan (t.ex. <kod><hello@example.com></kod>)

8. Avmarkera "Behandla som ett alias"

9. Klicka på "Nästa steg" för att fortsätta

10. När du uppmanas att ange "SMTP-server", ange <code>smtp.gmail.com</code> och lämna porten <code>587</code>

11. När du blir ombedd att ange "Användarnamn", ange den del av din Gmail-adress som inte innehåller <span>gmail.com</span>-delen (t.ex. bara "användare" om min e-postadress är <span><user@gmail.com></span>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktigt:
</strong>
<span>
Om "Användarnamn"-delen fylls i automatiskt, <u><strong>måste du ändra detta</strong></u> till användarnamnsdelen av din Gmail-adress istället.
</span>
</div>

12. När du uppmanas att ange "Lösenord", klistra in lösenordet du genererade i steg 2 ovan från urklipp.

13. Lämna alternativknappen markerad för "Säker anslutning med TLS"

14. Klicka på "Lägg till konto" för att fortsätta

15. Öppna en ny flik i [Gmail](https://gmail.com) och vänta på att ditt verifieringsmejl ska komma (du får en verifieringskod som bekräftar att du är ägare till den e-postadress du försöker "Skicka e-post som").

16. När den har kommit, kopiera och klistra in verifieringskoden vid uppmaningen du fick i föregående steg.

17. När du har gjort det, gå tillbaka till e-postmeddelandet och klicka på länken för att "bekräfta begäran". Du kommer troligtvis att behöva göra detta steg och föregående steg för att e-postmeddelandet ska konfigureras korrekt.

</div>

### Avancerad Gmail-routingkonfiguration {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Beräknad installationstid:</strong>
<span>15–30 minuter</span>
</div>

Om du vill konfigurera avancerad routing i Gmail så att alias som inte matchar en postlåda vidarebefordrar till e-postutbytena för Vidarebefordra e-post, följ dessa steg:

1. Logga in på din Google-administratörskonsol på [admin.google.com](https://admin.google.com)
2. Gå till **Appar → Google Workspace → Gmail → Routning**
3. Klicka på **Lägg till rutt** och konfigurera följande inställningar:

**Inställningar för enskild mottagare:**

* Välj "Ändra kuvertmottagare" och ange din primära Gmail-adress
* Markera "Lägg till X-Gm-Original-To-rubrik med originalmottagare"

**Mottagarmönster för kuvert:**

* Lägg till ett mönster som matchar alla icke-existerande brevlådor (t.ex. `.*@yourdomain.com`)

**Inställningar för e-postserver:**

* Välj "Route to host" och ange `mx1.forwardemail.net` som primär server
* Lägg till `mx2.forwardemail.net` som backupserver
* Ställ in port 25
* Välj "Kräv TLS" för säkerhet

4. Klicka på **Spara** för att skapa rutten

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktigt:
</strong>
<span>
Denna konfiguration fungerar endast för Google Workspace-konton med anpassade domäner, inte för vanliga Gmail-konton.
</span>
</div>

### Avancerad Outlook-routingkonfiguration {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Beräknad installationstid:</strong>
<span>15–30 minuter</span>
</div>

För Microsoft 365-användare (tidigare Office 365) som vill konfigurera avancerad routning så att alias som inte matchar en postlåda vidarebefordrar till e-postutbytena för Vidarebefordra e-post:

1. Logga in på Microsoft 365 administratörscenter på [admin.microsoft.com](https://admin.microsoft.com)
2. Gå till **Exchange → E-postflöde → Regler**
3. Klicka på **Lägg till en regel** och välj **Skapa en ny regel**
4. Namnge din regel (t.ex. "Vidarebefordra icke-existerande postlådor till Vidarebefordra e-post")
5. Under **Tillämpa denna regel om**, välj:
* "Mottagaradressen matchar..."
* Ange ett mönster som matchar alla adresser på din domän (t.ex. `*@yourdomain.com`)
6. Under **Gör följande**, välj:
* "Omdirigera meddelandet till..."
* Välj "Följande e-postserver"
* Ange `mx1.forwardemail.net` och port 25
* Lägg till `mx2.forwardemail.net` som en säkerhetskopia
7. Under **Förutom om**, välj:
* "Mottagaren är..."
* Lägg till alla dina befintliga postlådor som inte ska vara vidarebefordrad
8. Ställ in regelprioriteten för att säkerställa att den körs efter andra regler för e-postflödet
9. Klicka på **Spara** för att aktivera regeln

## Felsökning {#troubleshooting}

### Varför får jag inte mina testmejl {#why-am-i-not-receiving-my-test-emails}

Om du skickar ett testmejl till dig själv kanske det inte visas i din inkorg eftersom det har samma rubrik som "Meddelande-ID".

Detta är ett allmänt känt problem och påverkar även tjänster som Gmail. <a href="https://support.google.com/a/answer/1703601">Here" är det officiella svaret från Gmail angående detta problem</a>.

Om du fortsätter att ha problem är det troligtvis ett problem med DNS-spridningen. Du måste vänta lite längre och försöka igen (eller försöka ställa in ett lägre TTL-värde för dina <strong class="notranslate">TXT</strong>-poster).

**Har du fortfarande problem?** Vänligen <a href="/help">kontakta oss</a> så att vi kan hjälpa till att undersöka problemet och hitta en snabb lösning.

### Hur konfigurerar jag min e-postklient för att fungera med vidarebefordran av e-post {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
Vår tjänst fungerar med populära e-postklienter som:
<ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
<li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android™</a></li>
<li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux™</a></li>
<li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> Skrivbord</a></li>
<li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> Mozilla Firefox®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i>Google Chrome®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i>Terminal</a></li>
</ul>
</div>

<div class="alert alert-primary">
Ditt användarnamn är din alias e-postadress och lösenordet är från <strong class="text-success"><i class="fa fa-key"></i> Generera lösenord</strong> ("Vanligt lösenord").
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>Om du använder Thunderbird, se till att "Anslutningssäkerhet" är inställd på "SSL/TLS" och autentiseringsmetod är inställd på "Normalt lösenord".</span>
</div>

| Typ | Värdnamn | Protokoll | Hamnar |
| :--: | :---------------------: | :-------------------------------------: | :----------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` | SSL/TLS **Föredraget** | `993` och `2993` |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **Föredraget** eller TLS (STARTTLS) | `465` och `2465` för SSL/TLS (eller) `587`, `2587`, `2525` och `25` för TLS (STARTTLS) |

### Varför hamnar mina e-postmeddelanden i skräppost och skräppost och hur kan jag kontrollera mitt domänrykte {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}

Det här avsnittet vägleder dig om din utgående e-post använder våra SMTP-servrar (t.ex. `smtp.forwardemail.net`) (eller vidarebefordras via `mx1.forwardemail.net` eller `mx2.forwardemail.net`) och levereras i mottagarnas skräppostmapp.

Vi övervakar rutinmässigt vår [IP-adresser](#what-are-your-servers-ip-addresses) mot [alla välrenommerade DNS-avvisandelistor](#how-do-you-handle-your-ip-addresses-becoming-blocked), **därför är det troligtvis ett domänryktesspecifikt problem**.

E-postmeddelanden kan hamna i skräppostmappar av flera anledningar:

1. **Autentisering saknas**: Konfigurera posterna [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) och [DMARC](#how-do-i-set-up-dmarc-for-forward-email).

2. **Domänrykte**: Nya domäner har ofta ett neutralt rykte tills de etablerar en avsändningshistorik.

3. **Innehållsutlösare**: Vissa ord eller fraser kan utlösa skräppostfilter.

4. **Sändningsmönster**: Plötsliga ökningar av e-postvolymen kan se misstänkta ut.

Du kan prova att använda ett eller flera av dessa verktyg för att kontrollera din domäns rykte och kategorisering:

| Verktygsnamn | URL | Typ |
| ------------------------------------------- | ---------------------------------------------------------------- | ---------------------- |
| Feedback om Cloudflare-domänkategorisering | <https://radar.cloudflare.com/domains/feedback> | Kategorisering |
| Spamhaus IP- och domänrykteskontroll | <https://check.spamhaus.org/> | DNSBL |
| Cisco Talos IP- och domänryktescenter | <https://talosintelligence.com/reputation_center> | Rykte |
| Barracuda IP och domänryktessökning | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL |
| MX Toolbox Blacklist Check | <https://mxtoolbox.com/blacklists.aspx> | Svarta listan |
| Google Postmaster Tools | <https://www.gmail.com/postmaster/> | Rykte |
| Yahoo Sender Hub | <https://senders.yahooinc.com/> | Rykte |
| MultiRBL.valli.org Blacklist Check | <https://multirbl.valli.org/lookup/> | DNSBL |
| Avsändarens poäng | <https://senderscore.org/act/blocklist-remover/> | Rykte |
| Värdering | <https://www.invaluement.com/lookup/> | DNSBL |
| SURBL | <https://www.surbl.org/> | DNSBL |
| Apple/Proofpoint IP-borttagning | <https://ipcheck.proofpoint.com/> | Borttagning |
| Cloudmark IP-borttagning | <https://csi.cloudmark.com/en/reset/> | Borttagning |
| SpamCop | <https://www.spamcop.net/bl.shtml> | DNSBL |
| Microsoft Outlook och Office 365 IP-borttagning | <https://sendersupport.olc.protection.outlook.com/pm/Postmaster> | Borttagning |
| UCEPROTECTs nivåer 1, 2 och 3 | <https://www.uceprotect.net/en/rblcheck.php> | DNSBL |
| UCEPROTECTs backscatterer.org | <https://www.backscatterer.org/> | Skydd mot bakåtspridning |
| UCEPROTECTs whitelisted.org | <https://www.whitelisted.org/> (kräver en avgift) | DNSWL |
| AT&T | `abuse_rbl@abuse-att.net` | Borttagning |
| AOL/Verizon (t.ex. `[IPTS04]`) | <https://senders.yahooinc.com/> | Borttagning |
| Cox Communications | `unblock.request@cox.net` | Borttagning |
| t-online.de (tyska/T-Mobile) | `tobr@rx.t-online.de` | Borttagning |

> \[!TIP]
> Start with a low volume of high-quality emails to build a positive reputation before sending in larger volumes.

> \[!IMPORTANT]
> If your domain is on a blacklist, each blacklist has its own removal process. Check their websites for instructions.

> \[!TIP]
> If you need additional help or find that we are false-positive listed as spam by a certain email service provider, then please <a href="/help">contact us</a>.

### Vad ska jag göra om jag får skräppost {#what-should-i-do-if-i-receive-spam-emails}

Du bör avsluta prenumerationen från e-postlistan (om möjligt) och blockera avsändaren.

Rapportera inte meddelandet som skräppost, utan vidarebefordra det istället till vårt manuellt utvalda och integritetsfokuserade system för att förebygga missbruk.

**E-postadressen att vidarebefordra skräppost till är:** <abuse@forwardemail.net>

### Varför visas mina testmejl som skickas till mig själv i Gmail som "misstänkta" {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Om du ser det här felmeddelandet i Gmail när du skickar ett testmeddelande till dig själv, eller när en person du mejlar med ditt alias ser ett mejl från dig för första gången, **oroa dig inte** – eftersom det här är en inbyggd säkerhetsfunktion i Gmail.

Du kan helt enkelt klicka på "Ser säkert ut". Om du till exempel skulle skicka ett testmeddelande med funktionen "skicka e-post som" (till någon annan), kommer de inte att se det här meddelandet.

Men om de ser det här meddelandet beror det på att de normalt sett var vana vid att se dina e-postmeddelanden komma från <john@gmail.com> istället för <john@customdomain.com> (bara ett exempel). Gmail kommer att varna användarna bara för att se till att allt är säkert ifall det inte finns någon lösning.

### Kan jag ta bort via forwardemail punkt .net i Gmail {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

Det här ämnet är relaterat till en [allmänt känt problem i Gmail där extra information visas bredvid avsändarens namn](https://support.google.com/mail/answer/1311182).

Från och med maj 2023 stöder vi e-post med SMTP som ett tillägg för alla betalande användare – vilket innebär att du kan ta bort <span class="notranslate">via forwardemail dot net</span> i Gmail.

Observera att detta FAQ-ämne är specifikt för dem som använder [Hur man skickar e-post som med Gmail](#how-to-send-mail-as-using-gmail)-funktionen.

Se avsnittet om [Stöder ni att skicka e-post med SMTP](#do-you-support-sending-email-with-smtp) för konfigurationsinstruktioner.

## Datahantering {#data-management}

### Var finns era servrar? {#where-are-your-servers-located}

> \[!TIP]
> We may soon announce our EU datacenter location hosted under [forwardemail.eu](https://forwardemail.eu).  Subscribe to the discussion at <https://github.com/orgs/forwardemail/discussions/336> for updates.

Våra servrar finns huvudsakligen i Denver, Colorado – se <https://forwardemail.net/ips> för vår kompletta lista över IP-adresser.

Du kan läsa mer om våra underleverantörer på våra sidor [GDPR](/gdpr), [DPA](/dpa) och [Privatliv](/privacy).

### Hur exporterar och säkerhetskopierar jag min postlåda {#how-do-i-export-and-backup-my-mailbox}

Du kan när som helst exportera dina brevlådor i formaten [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox) eller krypterade [SQLite](https://en.wikipedia.org/wiki/SQLite).

Gå till <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Alias <i class="fa fa-angle-right"></i> Ladda ner säkerhetskopia och välj önskad exportformattyp.

Du kommer att få en länk för att ladda ner exporten via e-post när den är klar.

Observera att den här exportlänken för nedladdning upphör att gälla efter 4 timmar av säkerhetsskäl.

Om du behöver granska dina exporterade EML- eller Mbox-format kan dessa verktyg med öppen källkod vara användbara:

| Namn | Formatera | Plattform | GitHub URL |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| MBox Viewer | Mbox | Windows | <https://github.com/ename/mboxviewer> |
| mbox-web-viewer | Mbox | Alla plattformar | <https://github.com/PHMRanger/mbox-web-viewer> |
| EmlReader | EML | Windows | <https://github.com/ayamadori/EmlReader> |
| E-postläsare | EML | VSCode | <https://github.com/joelharkes/vscode_email_viewer> |
| eml-läsare | EML | Alla plattformar | <https://github.com/s0ph1e/eml-reader> |

Om du dessutom behöver konvertera en Mbox-fil till en EML-fil kan du använda <https://github.com/noelmartinon/mboxzilla>.

### Hur importerar och migrerar jag min befintliga postlåda {#how-do-i-import-and-migrate-my-existing-mailbox}

Du kan enkelt importera din e-post till Vidarebefordra e-post (t.ex. med hjälp av [Thunderbird](https://www.thunderbird.net)) med instruktionerna nedan:

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktigt:
</strong>
<span>
Du måste följa alla följande steg för att importera din befintliga e-post.
</span>
</div>

1. Exportera din e-post från din befintliga e-postleverantör:

| E-postleverantör | Exportformat | Exportinstruktioner |
| -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gmail | MBOX | <https://takeout.google.com/settings/takeout/custom/gmail> |
| Syn | PST | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Tips:</strong> <span>Om du använder Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">PST-exportformat</a>), kan du helt enkelt följa instruktionerna under "Övrigt" nedan. Vi har dock länkar nedan för att konvertera PST till MBOX/EML-format baserat på ditt operativsystem:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba för Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst för Windows cygwin</a> – (t.ex. <code>readpst -u -o $OUT_DIR $IN_DIR</code> ersätter <code>$OUT_DIR</code> och <code>$IN_DIR</code> med utdatakatalogen och indatakatalogen) sökvägar).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst för Ubuntu/Linux</a> – (t.ex. <code>sudo apt-get install readpst</code> och sedan <code>readpst -u -o $OUT_DIR $IN_DIR</code>, och ersätter <code>$OUT_DIR</code> och <code>$IN_DIR</code> med sökvägarna till utdatakatalogen respektive indatakatalogen).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst för macOS (via brew)</a> – (t.ex. <code>brew install libpst</code> och sedan <code>readpst -u -o $OUT_DIR $IN_DIR</code>, och ersätter <code>$OUT_DIR</code> och <code>$IN_DIR</code> med sökvägarna för utdatakatalogen respektive indatakatalogen).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">PST-konverterare för Windows (GitHub)</a></li></ul><br /></span></div> |
| Apple Mail | MBOX | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974> |
| Fastmail | EML | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail> |
| Proton Mail | MBOX/EML | <https://proton.me/support/export-emails-import-export-app> |
| Tutanota | EML | <https://github.com/crepererum-oss/tatutanatata> |
| Tänka | EML | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents> |
| Zoho | EML | <https://www.zoho.com/mail/help/import-export-emails.html#alink2> |
| Andra | [Use Thunderbird](https://www.thunderbird.net) | Konfigurera ditt befintliga e-postkonto i Thunderbird och använd sedan plugin-programmet [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) för att exportera och importera din e-post. **Du kan också kopiera/klistra in eller dra/släppa e-postmeddelanden mellan ett konto och ett annat.** |

2. Ladda ner, installera och öppna [Thunderbird](https://www.thunderbird.net).

3. Skapa ett nytt konto med ditt alias fullständiga e-postadress (t.ex. <kod><du@dindomän.com></kod>) och ditt genererade lösenord. <strong>Om du inte redan har ett genererat lösenord kan du <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">läsa våra installationsanvisningar</a></strong>.

4. Ladda ner och installera [ImportExportVerktyg AV](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) Thunderbird-pluginet.

5. Skapa en ny lokal mapp i Thunderbird och högerklicka sedan på den → välj alternativet `ImportExportTools NG` → välj `Import mbox file` (för MBOX-exportformat) – eller – `Import messages` / `Import all messages from a directory` (för EML-exportformat).

6. Dra/släpp från den lokala mappen till en ny (eller befintlig) IMAP-mapp i Thunderbird som du vill ladda upp meddelanden till i IMAP-lagring med vår tjänst. Detta säkerställer att de säkerhetskopieras online med vår SQLite-krypterade lagring.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>
Om du är osäker på hur man importerar till Thunderbird kan du läsa de officiella instruktionerna på <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> och <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktigt:
</strong>
<span>
När du har slutfört export- och importprocessen kan du också aktivera vidarebefordran på ditt befintliga e-postkonto och ställa in en autosvarare för att meddela avsändare att du har en ny e-postadress (t.ex. om du tidigare använde Gmail och nu använder en e-postadress med ditt anpassade domännamn).
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Grattis!
</strong>
<span>
Du har slutfört alla steg.
</span>
</div>
</div>

### Stöder ni egenhosting {#do-you-support-self-hosting}

Ja, från och med mars 2025 stöder vi ett alternativ med egen webbhotell. Läs bloggen [här](https://forwardemail.net/blog/docs/self-hosted-solution). Kolla in [självvärd guide](https://forwardemail.net/self-hosted) för att komma igång. Och för de som är intresserade av en mer detaljerad steg-för-steg-version, se våra [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) eller [Debian](https://forwardemail.net/guides/selfhosted-on-debian) baserade guider.

## E-postkonfiguration {#email-configuration}

### Hur kommer jag igång och konfigurerar vidarebefordran av e-post {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Beräknad installationstid:</strong>
<span>Mindre än 10 minuter</span>
</div>

<div class="alert my-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Komma igång:
</strong>
<span>
Läs noggrant och följ steg ett till åtta nedan. Se till att ersätta e-postadressen <code>användare@gmail.com</code> med den e-postadress du vill vidarebefordra e-postmeddelanden till (om den inte redan är korrekt). Se också till att ersätta <code>example.com</code> med ditt anpassade domännamn (om det inte redan är korrekt).
</span>
</div>

<ol>
<li class="mb-2 mb-md-3 mb-lg-5">Om du redan har registrerat ditt domännamn någonstans måste du hoppa över det här steget helt och gå till steg två! Annars kan du <a href="/domain-registration" rel="noopener noreferrer">klicka här för att registrera ditt domännamn</a>.</li>
<li class="mb-2 mb-md-3 mb-lg-5">
Kommer du ihåg var du registrerade din domän? När du kommer ihåg detta följer du instruktionerna nedan:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktigt:
</strong>
<span>
Du måste öppna en ny flik och logga in hos din domänregistrator. Du kan enkelt klicka på din "Registrator" nedan för att göra detta automatiskt. I den här nya fliken måste du navigera till DNS-hanteringssidan hos din registrator – och vi har angett steg-för-steg-navigeringsstegen nedan under kolumnen "Steg för att konfigurera". När du har navigerat till den här sidan i den nya fliken kan du återgå till den här fliken och fortsätta till steg tre nedan.
<strong class="font-weight-bold">Stäng inte den öppnade fliken än; du kommer att behöva den för framtida steg!</strong>
</span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr> <th>Registrator</th> <th>Steg för att konfigurera</th>
</tr> </thead> <tbody> <tr> <td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
<td>Logga in <i class="fa fa-angle-right"></i> Domäncenter <i class="fa fa-angle-right"></i> (Välj din domän) <i class="fa fa-angle-right"></i> Redigera DNS-inställningar</td>
</tr>
<tr> <td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Rutt 53</a></td>
<td>Logga in <i class="fa fa-angle-right"></i> Hostade zoner <i class="fa fa-angle-right"></i> (Välj din domän)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
<td>Logga in <i class="fa fa-angle-right"></i> Mina servrar <i class="fa fa-angle-right"></i> Domänhantering <i class="fa fa-angle-right"></i> DNS-hanterare</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
<td>FÖR ROCK: Logga in <i class="fa fa-angle-right"></i> Domäner <i class="fa fa-angle-right"></i> (Klicka på ikonen ▼ bredvid för att hantera) <i class="fa fa-angle-right"></i> DNS
<br />
FÖR ÄLDRE VERSIONER: Logga in <i class="fa fa-angle-right"></i> Domäner <i class="fa fa-angle-right"></i> Zonredigerare <i class="fa fa-angle-right"></i> (Välj din domän)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
<td>Logga in <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Gjorde enkelt</a></td>
<td>Logga in <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Välj din domän)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
<td>Logga in <i class="fa fa-angle-right"></i> (Välj din domän) <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Hantera</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
<td>Logga in <i class="fa fa-angle-right"></i> Nätverk <i class="fa fa-angle-right"></i> Domäner <i class="fa fa-angle-right"></i> (Välj din domän) <i class="fa fa-angle-right"></i> Mer <i class="fa fa-angle-right"></i> Hantera domän</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
<td>Logga in <i class="fa fa-angle-right"></i> I kortvyn, klicka på hantera på din domän <i class="fa fa-angle-right"></i> I listvyn, klicka på
kugghjulsikonen <i class="fa fa-angle-right"></i> DNS och namnservrar <i class="fa fa-angle-right"></i> DNS-poster</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> Titta</a>
</td>
<td>Logga in <i class="fa fa-angle-right"></i> (Välj din domän) <i class="fa fa-angle-right"></i> Hantera <i class="fa fa-angle-right"></i> (klicka på kugghjulsikonen) <i class="fa fa-angle-right"></i> Klicka på DNS och namnservrar i vänstermenyn</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
<td>Logga in <i class="fa fa-angle-right"></i> Panel <i class="fa fa-angle-right"></i> Domäner <i class="fa fa-angle-right"></i> Hantera domäner <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
<td>Logga in <i class="fa fa-angle-right"></i> Översikt <i class="fa fa-angle-right"></i> Hantera <i class="fa fa-angle-right"></i> Enkel redigerare <i class="fa fa-angle-right"></i> Poster</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
<td>Logga in <i class="fa fa-angle-right"></i> (Välj din domän) <i class="fa fa-angle-right"></i> Hantering <i class="fa fa-angle-right"></i> Redigera zonen</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> Titta</a>
</td>
<td>Logga in <i class="fa fa-angle-right"></i> Hantera mina domäner <i class="fa fa-angle-right"></i> (Välj din domän) <i class="fa fa-angle-right"></i> Hantera DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google Domäner</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> Övervaka</a>
</td>
<td>Logga in <i class="fa fa-angle-right"></i> (Välj din domän) <i class="fa fa-angle-right"></i> Konfigurera DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> Övervaka</a>
</td>
<td>Logga in <i class="fa fa-angle-right"></i> Domänlista <i class="fa fa-angle-right"></i> (Välj din domän) <i class="fa fa-angle-right"></i> Hantera <i class="fa fa-angle-right"></i> Avancerad DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
<td>Logga in <i class="fa fa-angle-right"></i> (Välj din domän) <i class="fa fa-angle-right"></i> Konfigurera Netlify DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Lösningar</a></td>
<td>Logga in <i class="fa fa-angle-right"></i> Kontohanterare <i class="fa fa-angle-right"></i> Mina domännamn <i class="fa fa-angle-right"></i> (Välj din domän) <i class="fa fa-angle-right"></i> Hantera <i class="fa fa-angle-right"></i> Ändra var domänen pekar <i class="fa fa-angle-right"></i> Avancerad DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> Titta</a>
</td>
<td>Logga in <i class="fa fa-angle-right"></i> Hanterade domäner <i class="fa fa-angle-right"></i> (Välj din domän) <i class="fa fa-angle-right"></i> DNS Inställningar</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
<td>Logga in <i class="fa fa-angle-right"></i> Hemmeny <i class="fa fa-angle-right"></i> Inställningar <i class="fa fa-angle-right"></i> Domäner <i class="fa fa-angle-right"></i> (Välj din domän) <i class="fa fa-angle-right"></i>
Avancerade inställningar <i class="fa fa-angle-right"></i> Anpassade poster</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Vercel's Nu</a></td>
<td>Använda "now" CLI <i class="fa fa-angle-right"></i> <code>now dns lägg till [domän] '@' MX [postvärde] [prioritet]</kod></td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
<td>Logga in <i class="fa fa-angle-right"></i> Domänsidan <i class="fa fa-angle-right"></i> (Välj din domän) <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
<td>Logga in <i class="fa fa-angle-right"></i> Domänsidan <i class="fa fa-angle-right"></i> (Klicka på ikonen <i class="fa fa-ellipsis-h"></i>) <i class="fa fa-angle-right"></i> Välj Hantera DNS-poster</td>
</tr>
<tr> <td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
<td>Logga in <i class="fa fa-angle-right"></i> Domäner <i class="fa fa-angle-right"></i> Mina domäner</td>
</tr>
<tr> <td>Annat</td>
<td> <div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Viktigt:</strong> Ser du inte ditt registrarnamn listat här? Sök bara på internet efter "hur man ändrar DNS-poster på $REGISTRAR" (ersätt $REGISTRAR med namnet på din registrar &ndash; t.ex. "hur man ändrar DNS-poster på GoDaddy" om du använder GoDaddy).</div>
</td>
</tr>
</tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">Använd din registrars DNS-hanteringssida (den andra fliken du har öppnat) och ställ in följande "MX"-poster:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktigt:
</strong>
<span>
Observera att det inte ska finnas några andra MX-poster. Båda posterna som visas nedan MÅSTE finnas. Se till att det inte finns några stavfel och att du har stavat både mx1 och mx2 korrekt. Om det redan fanns MX-poster, vänligen radera dem helt.

"TTL"-värdet behöver inte vara 3600, det kan vara ett lägre eller högre värde om det behövs.
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Namn/Värd/Alias</th> <th class="text-center">TTL</th> <th>Typ</th> <th>Prioritet</th> <th>Svar/Värde</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td> <td>MX</td> <td>0</td> <td><code>mx1.forwardemail.net</code></td> </tr> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td>
<td>MX</td> <td>0</td> <td><code>mx2.forwardemail.net</code></td> </tr> </tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Använd din registrars DNS-hanteringssida (den andra fliken du har öppnat) och ställ in följande <strong class="notranslate">TXT</strong>-post(er):

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktigt:
</strong>
<span>
Om du har ett betalt abonnemang måste du hoppa över det här steget helt och gå till steg fem! Om du inte har ett betalt abonnemang kommer dina vidarebefordrade adresser att vara offentligt sökbara – gå till <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mitt konto <i class="fa fa-angle-right"></i>Domäner</a> och uppgradera din domän till ett betalt abonnemang om så önskas. Om du vill veta mer om betalda abonnemang, se vår <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Prissättning</a>-sida. Annars kan du fortsätta att välja en eller flera kombinationer från alternativ A till alternativ F som listas nedan. </span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Alternativ A:
</strong>
<span>
Om du vidarebefordrar alla e-postmeddelanden från din domän (t.ex. "alla@example.com", "hello@example.com" etc.) till en specifik adress "user@gmail.com":
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Namn/Värd/Alias</th> <th class="text-center">TTL</th> <th>Typ</th> <th>Svar/Värde</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=användare@gmail.com</code> </td> </tr> </tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>
Se till att ersätta värdena ovan i kolumnen "Värde" med din egen e-postadress. "TTL"-värdet behöver inte vara 3600, det kan vara ett lägre eller högre värde om det behövs. Ett lägre TTL-värde säkerställer att framtida ändringar som görs i dina DNS-poster sprids snabbare över internet – tänk på detta som hur länge det kommer att cachas i minnet (i sekunder). Du kan läsa mer om <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL på Wikipedia</a>.
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Alternativ B:
</strong>
<span>
Om du bara behöver vidarebefordra en enda e-postadress (t.ex. <code>hello@example.com</code> till <code>user@gmail.com</code>; detta kommer också att vidarebefordra "hello+test@example.com" till "user+test@gmail.com" automatiskt):
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Namn/Värd/Alias</th> <th class="text-center">TTL</th> <th>Typ</th> <th>Svar/Värde</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=hello:user@gmail.com</code> </td> </tr> </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Alternativ C:
</strong>
<span>
Om du vidarebefordrar flera e-postmeddelanden bör du separera dem med ett kommatecken:
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Namn/Värd/Alias</th> <th class="text-center">TTL</th> <th>Typ</th> <th>Svar/Värde</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code> </td> </tr> </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Alternativ D:
</strong>
<span>
Du kan konfigurera ett obegränsat antal vidarebefordrande e-postmeddelanden – se bara till att inte radbryta fler än 255 tecken på en enda rad och börja varje rad med "forward-email=". Ett exempel ges nedan:
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Namn/Värd/Alias</th> <th class="text-center">TTL</th> <th>Typ</th> <th>Svar/Värde</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code> </td> </tr> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td>
<td class="notranslate">TXT</td> <td> <code>forward-email=help:user@gmail.com,foo:user@gmail.com</code> </td> </tr> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code> </td> </tr> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td>
<code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
</td>
</tr> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=errors:user@gmail.com,boop:user@gmail.com</code> </td> </tr> </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Alternativ E:
</strong>
<span>
Du kan också ange ett domännamn i din <strong class="notranslate">TXT</strong>-post för att få global aliasvidarebefordran (t.ex. "användare@example.com" vidarebefordras till "användare@example.net"):
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Namn/Värd/Alias</th> <th class="text-center">TTL</th> <th>Typ</th> <th>Svar/Värde</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=example.net</code> </td> </tr> </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Alternativ F:
</strong>
<span>
Du kan till och med använda webhooks som ett globalt eller individuellt alias att vidarebefordra e-postmeddelanden till. Se exemplet och hela avsnittet om webhooks med titeln <a href="#do-you-support-webhooks" class="alert-link">Stödjer ni webhooks</a> nedan.
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Namn/Värd/Alias</th> <th class="text-center">TTL</th> <th>Typ</th> <th>Svar/Värde</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code>
</td> </tr> </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Alternativ G:
</strong>
<span>
Du kan till och med använda reguljära uttryck ("regex") för att matcha alias och för att hantera ersättningar att vidarebefordra e-postmeddelanden till. Se exemplen och hela avsnittet om regex med titeln <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Stöder ni reguljära uttryck eller regex</a> nedan.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Behöver du avancerad regex med substitution?</strong> Se exemplen och hela avsnittet om regex med titeln <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Stöder ni reguljära uttryck eller regex</a> nedan.
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Enkelt exempel:</strong> Om jag vill att alla e-postmeddelanden som går till `linus@example.com` eller `torvalds@example.com` ska vidarebefordras till `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Namn/Värd/Alias</th> <th class="text-center">TTL</th> <th>Typ</th> <th>Svar/Värde</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code> </td> </tr> </tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktigt:
</strong>
<span>
Alla vidarebefordringsregler kan också beskrivas som "fall-through".
Detta innebär att inkommande e-postmeddelanden som matchar minst en specifik vidarebefordringsregel kommer att användas istället för all-regeln.
Specifika regler inkluderar e-postadresser och reguljära uttryck.
<br /><br />
Till exempel:
<br /> <code>forward-email=hello:first@gmail.com,second@gmail.com</code>
<br />
E-postmeddelanden som skickas till <code>hello@example.com</code> kommer **inte** att vidarebefordras till <code>second@gmail.com</code> (all-regel) med denna konfiguration, utan levereras istället endast till <code>first@gmail.com</code>.
</span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Använd din registrars DNS-hanteringssida (den andra fliken du har öppnat) och ställ dessutom in följande <strong class="notranslate">TXT</strong>-post:

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Namn/Värd/Alias</th> <th class="text-center">TTL</th> <th>Typ</th> <th>Svar/Värde</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktigt:
</strong>
<span>
Om du använder Gmail (t.ex. Skicka e-post som) eller G Suite måste du lägga till <code>include:_spf.google.com</code> till värdet ovan, till exempel:
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
Om du redan har en liknande rad med "v=spf1" måste du lägga till <code>include:spf.forwardemail.net</code> precis före eventuella befintliga "include:host.com"-poster och före "-all" på samma rad, till exempel:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
Observera att det är skillnad mellan "-all" och "~all". "-" indikerar att SPF-kontrollen ska MISSLYCKAS om den inte matchar, och "~" indikerar att SPF-kontrollen ska MISSLYCKAS MED SOFTFAIL. Vi rekommenderar att du använder "-all"-metoden för att förhindra domänförfalskning.
<br /><br />
Du kan också behöva inkludera SPF-posten för den värd du skickar e-post från (t.ex. Outlook).
</span>
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Verifiera dina DNS-poster med vårt verktyg "Verifiera poster" som finns tillgängligt på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Inställningar.

Skicka ett testmejl för att bekräfta att det fungerar. Observera att det kan ta lite tid för dina DNS-poster att spridas.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>
</span>
Om du inte får testmejl, eller får ett testmejl som säger "Var försiktig med det här meddelandet", se då svaren för <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Varför får jag inte mina testmejl</a> respektive <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Varför visas mina testmejl som skickas till mig själv i Gmail som "misstänkta"</a>.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Om du vill "Skicka e-post som" från Gmail måste du <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">titta på den här videon</a></strong> eller följa stegen under <a href="#how-to-send-mail-as-using-gmail">How för att skicka e-post som med Gmail</a> nedan.

</li></ol>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Grattis!
</strong>
<span>
Du har slutfört alla steg.
</span>
</div>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>
Valfria tillägg listas nedan. Observera att dessa tillägg är helt valfria och kanske inte nödvändiga. Vi ville åtminstone ge dig ytterligare information om det behövs.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Valfritt tillägg:
</strong>
<span>
Om du använder funktionen <a class="alert-link" href="#how-to-send-mail-as-using-gmail">How för att skicka e-post som med Gmail</a> kanske du vill lägga till dig själv på en godkännandelista. Se <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">dessa instruktioner från Gmail</a> om detta ämne.
</span>
</div>

### Kan jag använda flera MX-börser och servrar för avancerad vidarebefordran {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Ja, men **du ska bara ha en MX-börs listad i dina DNS-poster**.

Försök inte använda "Prioritet" som ett sätt att konfigurera flera MX-börser.

Istället behöver du konfigurera din befintliga MX-börs för att vidarebefordra e-post för alla icke-matchande alias till vår tjänsts börser (`mx1.forwardemail.net` och/eller `mx2.forwardemail.net`).

Om du använder Google Workspace och vill vidarebefordra alla icke-matchande alias till vår tjänst, se <https://support.google.com/a/answer/6297084>.

Om du använder Microsoft 365 (Outlook) och vill vidarebefordra alla icke-matchande alias till vår tjänst, se <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> och <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### Hur ställer jag in en semestersvarare (autosvarare för frånvarande) {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

Gå till <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Alias och skapa eller redigera det alias du vill konfigurera ett autosvar för semesteranvändning för.

Du har möjlighet att konfigurera ett startdatum, slutdatum, ämne och meddelande och aktivera eller inaktivera det när som helst:

* Ämne och meddelande i klartext stöds för närvarande (vi använder `striptags`-paketet internt för att ta bort all HTML).

* Ämnet är begränsat till 100 tecken.

* Meddelandet är begränsat till 1000 tecken.

* Installationen kräver utgående SMTP-konfiguration (t.ex. måste du konfigurera DKIM-, DMARC- och Return-Path DNS-poster).

* Gå till <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Inställningar <i class="fa fa-angle-right"></i> Utgående SMTP-konfiguration och följ installationsanvisningarna.

* Semestersvar kan inte aktiveras på globala vanity-domännamn (t.ex. stöds inte [engångsadresser](/disposable-addresses)).
* Semestersvar kan inte aktiveras för alias med jokertecken/allt-i-ett-uttryck (`*`) eller reguljära uttryck.

Till skillnad från e-postsystem som `postfix` (t.ex. som använder semesterfiltertillägget `sieve`) – lägger Vidarebefordra e-post automatiskt till din DKIM-signatur, dummysäkrar anslutningsproblem när du skickar semestersvar (t.ex. på grund av vanliga SSL/TLS-anslutningsproblem och äldre servrar) och stöder till och med Open WKD- och PGP-kryptering för semestersvar.

<!--
* För att förhindra missbruk kommer 1 utgående SMTP-kredit att dras av för varje skickat semestersvarsmeddelande.
* Alla betalda konton inkluderar 300 krediter per dag som standard. Om du behöver ett större belopp, vänligen kontakta oss.
-->

1. Vi skickar bara en gång per [tillåten på listan](#do-you-have-an-allowlist) avsändare var fjärde dag (vilket liknar Gmails beteende).

* Vår Redis-cache använder ett fingeravtryck på `alias_id` och `sender`, medan `alias_id` är alias MongoDB-ID och `sender` är antingen Från-adressen (om den är tillåten) eller rotdomänen i Från-adressen (om den inte är tillåten). För enkelhetens skull är utgångsdatumet för detta fingeravtryck i cachen satt till 4 dagar.

* Vår metod att använda rotdomänen som analyserats i Från-adressen för avsändare som inte finns med på tillåtelselistan förhindrar att missbruk från relativt okända avsändare (t.ex. illvilliga aktörer) översvämmar semestersvarsmeddelanden.

2. Vi skickar bara när MAIL FRÅN och/eller Från inte är tomma och inte innehåller (skiftlägeskänsligt) en [postmaster användarnamn](#what-are-postmaster-addresses) (delen före @ i ett e-postmeddelande).

3. Vi skickar inte om det ursprungliga meddelandet hade någon av följande rubriker (skiftlägeskänsligt):

* Rubrik för `auto-submitted` med ett värde som inte är lika med `no`. * Rubrik för `x-auto-response-suppress` med värdet `dr`, `autoreply`, `auto-reply`, `auto_reply` eller `all`
* Rubrik för `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` eller `x-auto-respond` (oavsett värde).
* Rubrik för `precedence` med värdet `bulk`, `autoreply`, `auto-reply`, `auto_reply` eller `list`.

4. Vi skickar inte om e-postadressen MAIL FRÅN eller Från slutar med `+donotreply`, `-donotreply`, `+noreply` eller `-noreply`.

5. Vi skickar inte om användarnamnsdelen för e-postadressen "Från" var `mdaemon` och den hade en rubrik med `X-MDDSN-Message` som inte känsligt för gemener och versaler.

6. Vi skickar inte om det fanns en `content-type`-rubrik som inte är skiftlägeskänslig för `multipart/report`.

### Hur konfigurerar jag SPF för vidarebefordran av e-post {#how-do-i-set-up-spf-for-forward-email}

Använd din registrars DNS-hanteringssida och ange följande <strong class="notranslate">TXT</strong>-post:

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Namn/Värd/Alias</th> <th class="text-center">TTL</th> <th>Typ</th> <th>Svar/Värde</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktigt:
</strong>
<span>
Om du använder Gmail (t.ex. Skicka e-post som) eller G Suite måste du lägga till <code>include:_spf.google.com</code> till värdet ovan, till exempel:
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
Om du redan har en liknande rad med "v=spf1" måste du lägga till <code>include:spf.forwardemail.net</code> precis före eventuella befintliga "include:host.com"-poster och före "-all" på samma rad, till exempel:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
Observera att det är skillnad mellan "-all" och "~all". "-" indikerar att SPF-kontrollen ska MISSLYCKAS om den inte matchar, och "~" indikerar att SPF-kontrollen ska MISSLYCKAS MED SOFTFAIL. Vi rekommenderar att du använder "-all"-metoden för att förhindra domänförfalskning.
<br /><br />
Du kan också behöva inkludera SPF-posten för den värd du skickar e-post från (t.ex. Outlook).
</span>
</div>

### Hur konfigurerar jag DKIM för vidarebefordran av e-post {#how-do-i-set-up-dkim-for-forward-email}

Gå till <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Inställningar <i class="fa fa-angle-right"></i> Utgående SMTP-konfiguration och följ installationsanvisningarna.

### Hur konfigurerar jag DMARC för vidarebefordran av e-post {#how-do-i-set-up-dmarc-for-forward-email}

Gå till <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Inställningar <i class="fa fa-angle-right"></i> Utgående SMTP-konfiguration och följ installationsanvisningarna.

### Hur ansluter och konfigurerar jag mina kontakter {#how-do-i-connect-and-configure-my-contacts}

**För att konfigurera dina kontakter, använd CardDAV-URL:** `https://carddav.forwardemail.net` (eller helt enkelt `carddav.forwardemail.net` om din klient tillåter det)**

### Hur ansluter och konfigurerar jag mina kalendrar {#how-do-i-connect-and-configure-my-calendars}

**För att konfigurera din kalender, använd CalDAV-URL:** `https://caldav.forwardemail.net` (eller helt enkelt `caldav.forwardemail.net` om din klient tillåter det)**

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Vidarebefordra e-postkalender CalDAV Thunderbird exempelkonfiguration" />

### Hur lägger jag till fler kalendrar och hanterar befintliga kalendrar {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Om du vill lägga till ytterligare kalendrar lägger du bara till en ny kalender-URL: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**se till att ersätta `calendar-name` med ditt önskade kalendernamn**)

Du kan ändra en kalenders namn och färg efter att den har skapats – använd bara ditt föredragna kalenderprogram (t.ex. Apple Mail eller [Thunderbird](https://thunderbird.net)).

### Hur konfigurerar jag SRS för vidarebefordran av e-post {#how-do-i-set-up-srs-for-forward-email}

Vi konfigurerar automatiskt [Avsändarens omskrivningsschema](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") – du behöver inte göra detta själv.

### Hur konfigurerar jag MTA-STS för vidarebefordran av e-post {#how-do-i-set-up-mta-sts-for-forward-email}

Se [vår sektion om MTA-STS](#do-you-support-mta-sts) för mer information.

### Hur lägger jag till en profilbild i min e-postadress {#how-do-i-add-a-profile-picture-to-my-email-address}

Om du använder Gmail följer du stegen nedan:

1. Gå till <https://google.com> och logga ut från alla e-postkonton.
2. Klicka på "Logga in" och klicka på "annat konto" i rullgardinsmenyn.
3. Välj "Använd ett annat konto".
4. Välj "Skapa konto".
5. Välj "Använd min nuvarande e-postadress istället".
6. Ange din e-postadress för ditt anpassade domännamn.
7. Hämta verifieringsmejlet som skickades till din e-postadress.
8. Ange verifieringskoden från det här mejlet.
9. Fyll i profilinformationen för ditt nya Google-konto.
10. Godkänn alla sekretess- och användarvillkor.
11. Gå till <https://google.com> och klicka på din profilikon i det övre högra hörnet och klicka på knappen "ändra".
12. Ladda upp ett nytt foto eller en ny avatar för ditt konto.
13. Ändringarna tar cirka 1–2 timmar att implementera, men kan ibland gå väldigt snabbt.
14. Skicka ett testmejl så bör profilfotot visas.

## Avancerade funktioner {#advanced-features}

### Stöder ni nyhetsbrev eller e-postlistor för marknadsföringsrelaterad e-post? {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Ja, du kan läsa mer på <https://forwardemail.net/guides/newsletter-with-listmonk>.

Observera att för att bibehålla IP-rykte och säkerställa leveransbarhet har Forward Email en manuell granskningsprocess per domän för **godkännande av nyhetsbrev**. Skicka e-post till <support@forwardemail.net> eller öppna en [hjälp begäran](https://forwardemail.net/help) för godkännande. Detta tar vanligtvis mindre än 24 timmar, och de flesta förfrågningar hanteras inom 1–2 timmar. Inom en snar framtid strävar vi efter att göra denna process omedelbar med ytterligare skräppostkontroller och varningar. Denna process säkerställer att dina e-postmeddelanden når inkorgen och att dina meddelanden inte markeras som skräppost.

### Stöder ni e-post med API {#do-you-support-sending-email-with-api}

Ja, från och med maj 2023 stöder vi e-post med API som ett tillägg för alla betalande användare.

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktigt:
</strong>
<span>
Var god läs vår <a href="/terms" class="alert-link" target="_blank">Villkor</a>, <a href="/privacy" class="alert-link" target="_blank">Integritetspolicy</a> och <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Utgående SMTP-gränser</a> – din användning betraktas som ett godkännande och godkännande.
</span>
</div>

Se vårt avsnitt om [E-postmeddelanden](/email-api#outbound-emails) i vår API-dokumentation för alternativ, exempel och mer insikt.

För att kunna skicka utgående e-post med vårt API måste du använda din API-token som finns tillgänglig under [Min säkerhet](/my-account/security).

### Stöder ni e-post med IMAP? {#do-you-support-receiving-email-with-imap}

Ja, från och med den 16 oktober 2023 stöder vi e-post via IMAP som ett tillägg för alla betalande användare. **Läs vår djupgående artikel** om [hur vår krypterade SQLite-postlådelagringsfunktion fungerar](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="imap-instruktioner">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktigt:
</strong>
<span>
Var god läs vår <a href="/terms" class="alert-link" target="_blank">Villkor</a> och <a href="/privacy" class="alert-link" target="_blank">Integritetspolicy</a> – din användning betraktas som ett godkännande och godkännande.
</span>
</div>

1. Skapa ett nytt alias för din domän under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Alias (t.ex. <code><hello@example.com></code>)

2. Klicka på <strong class="text-success"><i class="fa fa-key"></i>Generera lösenord</strong> bredvid det nyskapade aliaset. Kopiera till Urklipp och lagra det genererade lösenordet som visas på skärmen på ett säkert sätt.

3. Använd ditt föredragna e-postprogram och lägg till eller konfigurera ett konto med ditt nyskapade alias (t.ex. <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>Vi rekommenderar att du använder <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> eller <a href="/blog/open-source" class="alert-link" target="_blank">ett öppen källkod och integritetsfokuserat alternativ</a>.</span>
</div>

4. När du blir ombedd att ange IMAP-servernamnet, ange `imap.forwardemail.net`

5. När du blir ombedd att ange IMAP-serverport, ange `993` (SSL/TLS) – se [alternativa IMAP-portar](/faq#what-are-your-imap-server-configuration-settings) om det behövs
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>Om du använder Thunderbird, se till att "Anslutningssäkerhet" är inställt på "SSL/TLS" och autentiseringsmetoden är inställd på "Normalt lösenord".</span>
</div>

6. När du blir ombedd att ange lösenordet för IMAP-servern, klistra in lösenordet från <strong class="text-success"><i class="fa fa-key"></i>Generera lösenord</strong> i steg 2 ovan.

7. **Spara dina inställningar** – om du har problem, vänligen <a href="/help">kontakta oss</a>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Grattis!
</strong>
<span>
Du har slutfört alla steg.
</span>
</div>
</div>

</div>

### Stöder du POP3 {#do-you-support-pop3}

Ja, från och med den 4 december 2023 stöder vi [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) som ett tillägg för alla betalande användare. **Läs gärna vår djupgående artikel** om [hur vår krypterade SQLite-postlådelagringsfunktion fungerar](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="pop3-instruktioner">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktigt:
</strong>
<span>
Var god läs vår <a href="/terms" class="alert-link" target="_blank">Villkor</a> och <a href="/privacy" class="alert-link" target="_blank">Integritetspolicy</a> – din användning betraktas som ett godkännande och godkännande.
</span>
</div>

1. Skapa ett nytt alias för din domän under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Alias (t.ex. <code><hello@example.com></code>)

2. Klicka på <strong class="text-success"><i class="fa fa-key"></i>Generera lösenord</strong> bredvid det nyskapade aliaset. Kopiera till Urklipp och lagra det genererade lösenordet som visas på skärmen på ett säkert sätt.

3. Använd ditt föredragna e-postprogram och lägg till eller konfigurera ett konto med ditt nyskapade alias (t.ex. <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>Vi rekommenderar att du använder <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> eller <a href="/blog/open-source" class="alert-link" target="_blank">ett öppen källkod och integritetsfokuserat alternativ</a>.</span>
</div>

4. När du blir ombedd att ange POP3-servernamnet, ange `pop3.forwardemail.net`

5. När du blir ombedd att ange POP3-serverporten, ange `995` (SSL/TLS) – se [alternativa POP3-portar](/faq#what-are-your-pop3-server-configuration-settings) om det behövs
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>Om du använder Thunderbird, se till att "Anslutningssäkerhet" är inställd på "SSL/TLS" och autentiseringsmetoden är inställd på "Normalt lösenord".</span>
</div>

6. När du blir ombedd att ange lösenordet för POP3-servern, klistra in lösenordet från <strong class="text-success"><i class="fa fa-key"></i>Generera lösenord</strong> i steg 2 ovan.

7. **Spara dina inställningar** – om du har problem, vänligen <a href="/help">kontakta oss</a>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Grattis!
</strong>
<span>
Du har slutfört alla steg.
</span>
</div>
</div>

</div>

### Stöder ni kalendrar (CalDAV) {#do-you-support-calendars-caldav}

Ja, från och med den 5 februari 2024 har vi lagt till den här funktionen. Vår server är `caldav.forwardemail.net` och övervakas även på vår <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statussida</a>.

Den stöder både IPv4 och IPv6 och är tillgänglig via port `443` (HTTPS).

| Inloggning | Exempel | Beskrivning |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Användarnamn | `user@example.com` | E-postadressen för ett alias som finns för domänen på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a>. |
| Lösenord | `************************` | Aliasspecifikt genererat lösenord. |

För att använda kalenderstöd måste **användaren** vara e-postadressen till ett alias som finns för domänen på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i>-domäner</a> – och **lösenordet** måste vara ett aliasspecifikt genererat lösenord.

### Stöder ni kontakter (CardDAV) {#do-you-support-contacts-carddav}

Ja, från och med den 12 juni 2025 har vi lagt till den här funktionen. Vår server är `carddav.forwardemail.net` och övervakas även på vår <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statussida</a>.

Den stöder både IPv4 och IPv6 och är tillgänglig via port `443` (HTTPS).

| Inloggning | Exempel | Beskrivning |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Användarnamn | `user@example.com` | E-postadressen för ett alias som finns för domänen på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a>. |
| Lösenord | `************************` | Aliasspecifikt genererat lösenord. |

För att använda kontaktsupporten måste **användaren** vara e-postadressen till ett alias som finns för domänen på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i>Domäner</a> – och **lösenordet** måste vara ett aliasspecifikt genererat lösenord.

### Stöder ni e-post med SMTP {#do-you-support-sending-email-with-smtp}

Ja, från och med maj 2023 stöder vi e-post med SMTP som ett tillägg för alla betalande användare.

<div id="smtp-instruktioner">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktigt:
</strong>
<span>
Var god läs vår <a href="/terms" class="alert-link" target="_blank">Villkor</a>, <a href="/privacy" class="alert-link" target="_blank">Integritetspolicy</a> och <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Utgående SMTP-gränser</a> – din användning betraktas som ett godkännande och godkännande.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktigt:
</strong>
<span>
Om du använder Gmail, se vår <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">guide för att skicka e-post som med Gmail</a>. Om du är utvecklare, se vår <a class="alert-link" href="/email-api#outbound-emails" target="_blank">dokumentation för e-post-API</a>.
</span>
</div>

1. Gå till <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Inställningar <i class="fa fa-angle-right"></i> Utgående SMTP-konfiguration och följ installationsanvisningarna.

2. Skapa ett nytt alias för din domän under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mitt konto <i class="fa fa-angle-right"></i>Domäner</a> <i class="fa fa-angle-right"></i>Alias (t.ex. <code><hello@example.com></code>)

3. Klicka på <strong class="text-success"><i class="fa fa-key"></i>Generera lösenord</strong> bredvid det nyskapade aliaset. Kopiera till Urklipp och lagra det genererade lösenordet som visas på skärmen på ett säkert sätt.

4. Använd ditt föredragna e-postprogram och lägg till eller konfigurera ett konto med ditt nyskapade alias (t.ex. <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>Vi rekommenderar att du använder <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> eller <a href="/blog/open-source" class="alert-link" target="_blank">ett öppen källkod och integritetsfokuserat alternativ</a>.</span>
</div>

5. När du blir ombedd att ange SMTP-servernamnet, ange `smtp.forwardemail.net`

6. När du blir ombedd att ange SMTP-serverport, ange `465` (SSL/TLS) – se [alternativa SMTP-portar](/faq#what-are-your-smtp-server-configuration-settings) om det behövs
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>Om du använder Thunderbird, se till att "Anslutningssäkerhet" är inställt på "SSL/TLS" och autentiseringsmetoden är inställd på "Normalt lösenord".</span>
</div>

7. När du blir ombedd att ange lösenordet för SMTP-servern, klistra in lösenordet från <strong class="text-success"><i class="fa fa-key"></i>Generera lösenord</strong> i steg 3 ovan.

8. **Spara dina inställningar och skicka ditt första testmejl** – om du har problem, vänligen <a href="/help">kontakta oss</a>

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktigt:
</strong>
<span>
Observera att för att bibehålla IP-rykte och säkerställa leveransbarhet har vi en manuell granskningsprocess per domän för utgående SMTP-godkännande. Detta tar vanligtvis mindre än 24 timmar, och de flesta förfrågningar hanteras inom 1–2 timmar. Inom en snar framtid strävar vi efter att göra denna process omedelbar med ytterligare skräppostkontroller och varningar. Denna process säkerställer att dina e-postmeddelanden når inkorgen och att dina meddelanden inte markeras som skräppost.
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Grattis!
</strong>
<span>
Du har slutfört alla steg.
</span>
</div>
</div>

</div>

### Stöder ni OpenPGP/MIME, end-to-end-kryptering ("E2EE") och Web Key Directory ("WKD")? {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Ja, vi stöder [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [end-to-end-kryptering ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption) och identifiering av publika nycklar med hjälp av [Web Key Directory ("WKD")](https://wiki.gnupg.org/WKD). Du kan konfigurera OpenPGP med hjälp av [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) eller [självhosta dina egna nycklar](https://wiki.gnupg.org/WKDHosting) (se [denna referens för WKD-serverinstallation](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* WKD-sökningar cachas i 1 timme för att säkerställa snabb e-postleverans → Om du lägger till, ändrar eller tar bort din WKD-nyckel, vänligen maila oss på `support@forwardemail.net` med din e-postadress så att vi kan rensa cachen manuellt.

* Vi stöder PGP-kryptering för meddelanden som vidarebefordras via WKD-sökning eller med en uppladdad PGP-nyckel i vårt gränssnitt.

* Uppladdade nycklar har företräde så länge kryssrutan PGP är aktiverad/markerad.

* Meddelanden som skickas till webhooks är för närvarande inte krypterade med PGP.

* Om du har flera alias som matchar en given vidarebefordringsadress (t.ex. regex/wildcard/exact combo) och om mer än ett av dessa innehåller en uppladdad PGP-nyckel och har PGP markerat → skickar vi ett felmeddelande och krypterar inte meddelandet med din uppladdade PGP-nyckel. Detta är mycket sällsynt och gäller vanligtvis bara avancerade användare med komplexa aliasregler.
* **PGP-kryptering kommer inte att tillämpas på vidarebefordran av e-post via våra MX-servrar om avsändaren hade en DMARC-policy för avvisning. Om du behöver PGP-kryptering för *all* e-post föreslår vi att du använder vår IMAP-tjänst och konfigurerar din PGP-nyckel för ditt alias för inkommande e-post.**

**Du kan validera din webbnyckelkatalogskonfiguration på <https://wkd.chimbosonic.com/> (öppen källkod) eller <https://www.webkeydirectory.com/> (proprietär).**

<div class="alert my-3 alert-success">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Automatisk kryptering:
</strong>
<span>Om du använder vår <a href="#do-you-support-sending-email-with-smtp" class="alert-link">utgående SMTP-tjänst</a> och skickar okrypterade meddelanden, kommer vi automatiskt att försöka kryptera meddelanden per mottagare med hjälp av <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Key Directory ("WKD")</a>.</span>
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

| E-postklient | Plattform | Rekommenderat plugin | Anteckningar |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Thunderbird | Skrivbord | [Configure OpenPGP in Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird har inbyggt stöd för OpenPGP. |
| Gmail | Webbläsare | [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download) (proprietär licens) | Gmail stöder inte OpenPGP, men du kan ladda ner plugin-programmet med öppen källkod [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download). |
| Apple Mail | macOS | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) | Apple Mail stöder inte OpenPGP, men du kan ladda ner plugin-programmet med öppen källkod [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation). |
| Apple Mail | iOS | [PGPro](https://github.com/opensourceios/PGPro/) eller [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (proprietär licens) | Apple Mail stöder inte OpenPGP, men du kan ladda ner plugin-programmet med öppen källkod [PGPro](https://github.com/opensourceios/PGPro/) eller [FlowCrypt](https://flowcrypt.com/download). |
| Syn | Windows | [gpg4win](https://www.gpg4win.de/index.html) | Outlooks e-postklient för skrivbordet stöder inte OpenPGP, men du kan ladda ner plugin-programmet med öppen källkod [gpg4win](https://www.gpg4win.de/index.html). |
| Syn | Webbläsare | [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download) (proprietär licens) | Outlooks webbaserade e-postklient stöder inte OpenPGP, men du kan ladda ner plugin-programmet med öppen källkod [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download). |
| Android | Mobil | [OpenKeychain](https://www.openkeychain.org/) eller [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) | [Android mail clients](/blog/open-source/android-email-clients) som [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) och [FairEmail](https://github.com/M66B/FairEmail) stöder båda plugin-programmet med öppen källkod [OpenKeychain](https://www.openkeychain.org/). Alternativt kan du använda plugin-programmet med öppen källkod (proprietär licens) [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email). |
| Google Chrome | Webbläsare | [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download) (proprietär licens) | Du kan ladda ner webbläsartillägget med öppen källkod [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download). |
| Mozilla Firefox | Webbläsare | [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download) (proprietär licens) | Du kan ladda ner webbläsartillägget med öppen källkod [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download). |
| Microsoft Edge | Webbläsare | [Mailvelope](https://mailvelope.com/) | Du kan ladda ner webbläsartillägget med öppen källkod [Mailvelope](https://mailvelope.com/). |
| Modig | Webbläsare | [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download) (proprietär licens) | Du kan ladda ner webbläsartillägget med öppen källkod [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download). |
| Balsa | Skrivbord | [Configure OpenPGP in Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING) | Balsa har inbyggt stöd för OpenPGP. |
| KMail | Skrivbord | [Configure OpenPGP in KMail](https://userbase.kde.org/KMail/PGP_MIME) | KMail har inbyggt stöd för OpenPGP. |
| GNOME Evolution | Skrivbord | [Configure OpenPGP in Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en) | GNOME Evolution har inbyggt stöd för OpenPGP. |
| Terminal | Skrivbord | [Configure gpg in Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key) | Du kan använda den öppna källkoden [gpg command line tool](https://www.gnupg.org/download/) för att generera en ny nyckel från kommandoraden. |

2. Öppna plugin-programmet, skapa din publika nyckel och konfigurera din e-postklient för att använda den.

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
Om du använder vår <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">krypterade lagringstjänst (IMAP/POP3)</a> och vill att <i>all</i> e-post som lagras i din (redan krypterade) SQLite-databas ska krypteras med din publika nyckel, gå då till <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Alias (t.ex. <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Redigera <i class="fa fa-angle-right"></i> OpenPGP och ladda upp din publika nyckel.

4. Lägg till en ny `CNAME`-post till ditt domännamn (t.ex. `example.com`):

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Namn/Värd/Alias</th> <th class="text-center">TTL</th> <th>Typ</th> <th>Svar/Värde</th> </tr> </thead> <tbody> <tr> <td><code>openpgpkey</code></td> <td class="text-center">3600</td> <td class="notranslate">CNAME</td> <td><code>wkd.keys.openpgp.org</code></td> </tr> </tbody> </table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>Om ditt alias använder våra <a class="alert-link" href="/disposable-addresses" target="_blank">vanity/disposable-domäner</a> (t.ex. <code>hideaddress.net</code>) kan du hoppa över det här steget.</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Grattis!
</strong>
<span>
Du har slutfört alla steg.
</span>
</div>
</div>

### Stöder du MTA-STS {#do-you-support-mta-sts}

Ja, från och med den 2 mars 2023 stöder vi [MTA-STS](https://www.hardenize.com/blog/mta-sts). Du kan använda [den här mallen](https://github.com/jpawlowski/mta-sts.template) om du vill aktivera det på din domän.

Vår konfiguration finns tillgänglig offentligt på GitHub på <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### Stöder ni lösenord och WebAuthn {#do-you-support-passkeys-and-webauthn}

Ja! Från och med den 13 december 2023 har vi lagt till stöd för lösenord [på grund av hög efterfrågan](https://github.com/orgs/forwardemail/discussions/182).

Med lösenordsnycklar kan du logga in säkert utan att behöva lösenord och tvåfaktorsautentisering.

Du kan bekräfta din identitet med beröring, ansiktsigenkänning, enhetsbaserat lösenord eller PIN-kod.

Vi låter dig hantera upp till 30 lösenord samtidigt, så att du enkelt kan logga in med alla dina enheter.

Läs mer om lösennycklar på följande länkar:

* [Logga in på dina appar och webbplatser med lösenord](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [Använda lösenord för att logga in på appar och webbplatser på iPhone](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Wikipedia-artikel om lösenord](https://en.wikipedia.org/wiki/Passkey_\(credential\))

### Stöder ni bästa praxis för e-post? {#do-you-support-email-best-practices}

Ja. Vi har inbyggt stöd för SPF, DKIM, DMARC, ARC och SRS i alla våra abonnemang. Vi har också arbetat omfattande med de ursprungliga författarna till dessa specifikationer och andra e-postexperter för att säkerställa perfektion och hög leveranssäkerhet.

### Stöder ni studsande webhooks {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
Letar du efter dokumentation om e-postwebhooks? Se <a href="/faq#do-you-support-webhooks" class="alert-link">Stödjer ni webhooks?</a> för mer information.
<span>
</span>
</div>

Ja, från och med den 14 augusti 2024 har vi lagt till den här funktionen. Du kan nu gå till Mitt konto → Domäner → Inställningar → Bounce Webhook-URL och konfigurera en `http://` eller `https://` URL som vi skickar en `POST` begäran till när utgående SMTP-e-postmeddelanden studsar.

Detta är användbart för att hantera och övervaka din utgående SMTP – och kan användas för att underhålla prenumeranter, välja bort och upptäcka när avvisningar inträffar.

Bounce webhook-nyttolaster skickas som en JSON med dessa egenskaper:

* `email_id` (Sträng) - e-postadress som motsvarar en e-postadress i Mitt konto → E-postmeddelanden (utgående SMTP)
* `list_id` (Sträng) - `List-ID`-rubrikens värde (skiftlägesokänsligt), om sådant finns, från det ursprungliga utgående e-postmeddelandet
* `list_unsubscribe` (Sträng) - `List-Unsubscribe`-rubrikens värde (skiftlägesokänsligt), om sådant finns, från det ursprungliga utgående e-postmeddelandet
* `feedback_id` (Sträng) - `Feedback-ID`-rubrikens värde (skiftlägesokänsligt), om sådant finns, från det ursprungliga utgående e-postmeddelandet
* `recipient` (Sträng) - e-postadressen till mottagaren som studsade eller fick ett fel
* `message` (Sträng) - ett detaljerat felmeddelande för studsen
* `response` (Sträng) - SMTP-svarsmeddelandet
* `response_code` (Nummer) - den analyserade SMTP-svarskoden
* `truth_source` (Sträng) - om svarskoden kom från en betrodd källa kommer detta värde att fyllas i med rotdomännamnet (t.ex. `google.com` eller `yahoo.com`)
* `bounce` (Objekt) - ett objekt som innehåller följande egenskaper som specificerar studs- och avvisningsstatus
* `action` (Sträng) - studsningsåtgärd (t.ex. `"reject"`)
* `message` (Sträng) - orsak till studs (t.ex. `"Message Sender Blocked By Receiving Server"`)
* `category` (Sträng) - studskategori (t.ex. `"block"`)
* `code` (Nummer) - kod för studsstatus (t.ex. `554`)
* `status` (Sträng) - studskod från svarsmeddelande (t.ex. `5.7.1`)
* `line` (Nummer) - analyserat radnummer, om sådant finns, [från Zone-MTA-avvisningsparslistan](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt) (t.ex. `526`)
* `headers` (Objekt) - nyckelvärdespar av rubriker för det utgående e-postmeddelandet
* `bounced_at` (Sträng) - [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) formaterat datum för när avvisningsfelet inträffade

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

Här är några ytterligare anmärkningar angående studsande webhooks:

* Om webhook-nyttolasten innehåller ett `list_id`, `list_unsubscribe` eller `feedback_id` värde, bör du vidta lämpliga åtgärder för att ta bort `recipient` från listan om det behövs.

* Om `bounce.category` värdet var ett av följande: `"block"`, `"recipient"`, `"spam"` eller `"virus"`, bör du definitivt ta bort användaren från listan.

* Om du behöver verifiera webhook-nyttolaster (för att säkerställa att de faktiskt kommer från vår server) kan du [hitta fjärrklientens IP-adress för klientens värdnamn med hjälp av en omvänd sökning](https://nodejs.org/api/dns.html#dnspromisesreverseip) – det ska vara `smtp.forwardemail.net`.
* Du kan också kontrollera IP-adressen mot [våra publicerade IP-adresser](#what-are-your-servers-ip-addresses).
* Gå till Mitt konto → Domäner → Inställningar → Webhook Signature Payload Verification Key för att få din webhook-nyckel.
* Du kan rotera den här nyckeln när som helst av säkerhetsskäl.
* Beräkna och jämför `X-Webhook-Signature`-värdet från vår webhook-förfrågan med det beräknade body-värdet med hjälp av den här nyckeln. Ett exempel på hur man gör detta finns på [detta Stack Overflow-inlägg](https://stackoverflow.com/a/68885281).
* Se diskussionen på <https://github.com/forwardemail/free-email-forwarding/issues/235> för mer insikt.
* Vi väntar i upp till `5` sekunder på att din webhook-slutpunkt ska svara med statuskoden `200`, och vi försöker igen i upp till `1` tid.
* Om vi upptäcker att din studsande webhook-URL innehåller ett fel när vi försöker skicka en begäran till den, skickar vi ett e-postmeddelande till dig en gång i veckan.

### Stöder ni webhooks {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
Letar du efter dokumentation om studsande webhooks? Se <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Stödjer ni studsande webhooks?</a> för mer information.
<span>
</span>
</div>

Ja, från och med den 15 maj 2020 har vi lagt till den här funktionen. Du kan helt enkelt lägga till webhooks precis som du skulle göra med vilken mottagare som helst! Se till att du har protokollet "http" eller "https" prefixat i webhookens URL.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Förbättrat integritetsskydd:
</strong>
<span>
Om du har ett betalt abonnemang (som har förbättrat integritetsskydd) går du till <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mitt konto <i class="fa fa-angle-right"></i>Domäner</a> och klickar på "Alias" bredvid din domän för att konfigurera dina webhooks. Om du vill veta mer om betaltabonnemang kan du se vår <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Prissättningssida</a>. Annars kan du fortsätta att följa instruktionerna nedan.
</span>
</div>

Om du har gratisplanen lägger du helt enkelt till en ny DNS-<strong class="notranslate">TXT</strong>-post enligt nedan:

Om jag till exempel vill att alla e-postmeddelanden som går till `alias@example.com` ska vidarebefordras till en ny [förfrågningsfack](https://requestbin.com/r/en8pfhdgcculn?inspect) testslutpunkt:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr> <th>Namn/Värd/Alias</th> <th class="text-center">TTL</th> <th>Typ</th> <th>Svar/Värde</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr> </tbody>
</table>

Eller kanske vill du att alla e-postmeddelanden som går till `example.com` ska vidarebefordras till denna slutpunkt:

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Namn/Värd/Alias</th> <th class="text-center">TTL</th> <th>Typ</th> <th>Svar/Värde</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr> </tbody>
</table>

**Här är ytterligare information om webhooks:**

* Om du behöver verifiera webhook-nyttolaster (för att säkerställa att de faktiskt kommer från vår server) kan du [hitta fjärrklientens IP-adress för klientens värdnamn med hjälp av en omvänd sökning](https://nodejs.org/api/dns.html#dnspromisesreverseip) – det ska antingen vara `mx1.forwardemail.net` eller `mx2.forwardemail.net`.
* Du kan också kontrollera IP-adressen mot [våra publicerade IP-adresser](#what-are-your-servers-ip-addresses).
* Om du har ett betalt abonnemang går du till Mitt konto → Domäner → Inställningar → Webhook Signature Payload Verification Key för att få din webhook-nyckel.
* Du kan rotera den här nyckeln när som helst av säkerhetsskäl.
* Beräkna och jämför `X-Webhook-Signature`-värdet från vår webhook-förfrågan med det beräknade body-värdet med hjälp av den här nyckeln. Ett exempel på hur du gör detta finns på [detta Stack Overflow-inlägg](https://stackoverflow.com/a/68885281).
* Se diskussionen på <https://github.com/forwardemail/free-email-forwarding/issues/235> för mer insikt.
* Om en webhook inte svarar med statuskoden `200`, lagrar vi dess svar i [fellogg skapad](#do-you-store-error-logs) – vilket är användbart för felsökning.
* Webhook HTTP-förfrågningar försöker igen upp till 3 gånger per SMTP-anslutningsförsök, med en maximal timeout på 60 sekunder per slutpunkts-POST-förfrågan. **Observera att detta inte betyder att den bara försöker igen 3 gånger**, den kommer faktiskt att försöka igen kontinuerligt över tid genom att skicka SMTP-koden 421 (vilket indikerar för avsändaren att försöka igen senare) efter det tredje misslyckade HTTP POST-förfrågningsförsöket. Detta innebär att e-postmeddelandet försöker igen kontinuerligt i flera dagar tills statuskoden 200 uppnås.
* Vi försöker igen automatiskt baserat på standardstatusen och felkoderna som används i [superagentens återförsöksmetod](https://ladjs.github.io/superagent/#retrying-requests) (vi är underhållare).
* Vi grupperar webhook HTTP-förfrågningar till samma slutpunkt i en förfrågan istället för flera) för att spara resurser och snabba upp svarstiden. Om du till exempel skickar ett e-postmeddelande till <webhook1@example.com>, <webhook2@example.com> och <webhook3@example.com>, och alla dessa är konfigurerade för att träffa samma *exakta* slutpunkts-URL, kommer endast en begäran att göras. Vi grupperar tillsammans efter exakt slutpunktsmatchning med strikt likhet.
* Observera att vi använder [mailparser](https://nodemailer.com/extras/mailparser/)-bibliotekets "simpleParser"-metod för att analysera meddelandet till ett JSON-vänligt objekt.
* Rå e-postvärde som en sträng anges som egenskapen "raw".
* Autentiseringsresultat anges som egenskaperna "dkim", "spf", "arc", "dmarc" och "bimi".
* De analyserade e-postrubrikerna anges som egenskapen "headers" – men observera också att du kan använda "headerLines" för enklare iteration och parsning.
* De grupperade mottagarna för denna webhook grupperas tillsammans och anges som egenskapen "recipients".
* SMTP-sessionsinformationen anges som egenskapen "session". Denna innehåller information om meddelandets avsändare, meddelandets ankomsttid, HELO och klientens värdnamn. Klientens värdnamnsvärde som `session.clientHostname` är antingen FQDN (från en omvänd PTR-sökning) eller `session.remoteAddress` omslutet av hakparenteser (t.ex. `"[127.0.0.1]"`).
* Om du behöver ett snabbt sätt att få värdet för `X-Original-To` kan du använda värdet för `session.recipient` (se exemplet nedan). Rubriken `X-Original-To` är en rubrik som vi lägger till i meddelanden för felsökning med den ursprungliga mottagaren (innan maskerad vidarebefordran) för meddelandet. * Om du behöver ta bort egenskaperna `attachments` och/eller `raw` från nyttolasten, lägg helt enkelt till `?attachments=false`, `?raw=false` eller `?attachments=false&raw=false` till din webhook-slutpunkt som en frågesträngparameter (t.ex. `https://example.com/webhook?attachments=false&raw=false`).
* Om det finns bilagor kommer de att läggas till i `attachments`-arrayen med buffertvärden. Du kan analysera dem tillbaka till innehållet med hjälp av en metod med JavaScript som:

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
Nyfiken på hur webhook-förfrågan ser ut från vidarebefordrade e-postmeddelanden? Vi har inkluderat ett exempel nedan!
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

Ja, från och med den 27 september 2021 har vi lagt till den här funktionen. Du kan helt enkelt skriva reguljära uttryck ("regex") för att matcha alias och utföra substitutioner.

Alias som stöds av reguljära uttryck är de som börjar med `/` och slutar med `/` och deras mottagare är e-postadresser eller webhooks. Mottagarna kan också inkludera stöd för regex-ersättning (t.ex. `$1`, `$2`).

Vi stöder två flaggor för reguljära uttryck, inklusive `i` och `g`. Den skiftlägeskänsliga flaggan `i` är en permanent standard och tillämpas alltid. Den globala flaggan `g` kan läggas till av dig genom att lägga till ändelsen `/` med `/g`.

Observera att vi även stöder vår <a href="#can-i-disable-specific-aliases">disabled aliasfunktion</a> för mottagardelen med vårt stöd för regex.

Reguljära uttryck stöds inte på <a href="/disposable-addresses" target="_blank">globala vanity-domäner</a> (eftersom detta kan vara en säkerhetsbrist).

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Förbättrat integritetsskydd:
</strong>
<span>
Om du har ett betalt abonnemang (som har förbättrat integritetsskydd) går du till <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mitt konto <i class="fa fa-angle-right"></i>Domäner</a> och klickar på "Alias" bredvid din domän för att konfigurera reguljära uttryck. Om du vill veta mer om betaltabonnemang kan du se vår <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Prissättningssida</a>. Annars kan du fortsätta att följa instruktionerna nedan.
</span>
</div>

Om du har gratisplanen lägger du helt enkelt till en ny DNS-<strong class="notranslate">TXT</strong>-post med hjälp av ett eller flera av exemplen nedan:

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Enkelt exempel:</strong> Om jag vill att alla e-postmeddelanden som går till `linus@example.com` eller `torvalds@example.com` ska vidarebefordras till `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr> <th>Namn/Värd/Alias</th> <th class="text-center">TTL</th> <th>Typ</th> <th>Svar/Värde</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Exempel på ersättning av förnamn och efternamn:</strong> Tänk dig att alla dina företags e-postadresser har mönstret `firstname.lastname@example.com`. Om jag vill att alla e-postmeddelanden som går till mönstret `firstname.lastname@example.com` ska vidarebefordras till `firstname.lastname@company.com` med stöd för ersättning (<a href="https://regexr.com/66hnu" class="alert-link">visa test på RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr> <th>Namn/Värd/Alias</th> <th class="text-center">TTL</th> <th>Typ</th> <th>Svar/Värde</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>vidarebefordra-e-post=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@företag.com</code></td>
</tr> </tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Exempel på substitution av plussymbolfiltrering:</strong> Om jag vill att alla e-postmeddelanden som går till `info@example.com` eller `support@example.com` ska vidarebefordras till `user+info@gmail.com` respektive `user+support@gmail.com` (med stöd för substitution) (<a href="https://regexr.com/66ho7" class="alert-link">visa test på RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr> <th>Namn/Värd/Alias</th> <th class="text-center">TTL</th> <th>Typ</th> <th>Svar/Värde</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Exempel på Webhook Querystring-substitution:</strong> Du kanske vill att alla e-postmeddelanden som går till `example.com` ska gå till en <a href="#do-you-support-webhooks" class="alert-link">webhook</a> och ha en dynamisk querystring-nyckel "till" med värdet "användarnamnsdelen" av e-postadressen (<a href="https://regexr.com/66ho4" class="alert-link">visa test på RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr> <th>Namn/Värd/Alias</th> <th class="text-center">TTL</th> <th>Typ</th> <th>Svar/Värde</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
</tr> </tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Exempel på tyst avvisning:</strong> Om du vill att alla e-postmeddelanden som matchar ett visst mönster ska inaktiveras och tyst avvisas (verkar för avsändaren som om meddelandet skickades, men det leder egentligen ingenstans) med statuskoden `250` (se <a href="#can-i-disable-specific-aliases" class="alert-link">Kan jag inaktivera specifika alias</a>), använd då helt enkelt samma metod med ett enda utropstecken "!". Detta indikerar för avsändaren att meddelandet levererades, men att det egentligen inte ledde någonstans (t.ex. svart hål eller `/dev/null`).
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Namn/Värd/Alias</th> <th class="text-center">TTL</th> <th>Typ</th> <th>Svar/Värde</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=/^(linus|torvalds)$/:!</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Exempel på mjuk avvisning:</strong> Om du vill att alla e-postmeddelanden som matchar ett visst mönster ska inaktiveras och mjukavvisas med statuskoden `421` (se <a href="#can-i-disable-specific-aliases" class="alert-link">Kan jag inaktivera specifika alias</a>), använd helt enkelt samma metod med ett dubbelt utropstecken "!!". Detta indikerar för avsändaren att försöka igen med sin e-post, och e-postmeddelanden till detta alias kommer att försöka igen i cirka 5 dagar och sedan avvisas permanent.
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Namn/Värd/Alias</th> <th class="text-center">TTL</th> <th>Typ</th> <th>Svar/Värde</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=/^(linus|torvalds)$/:!!</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Exempel på fullständig avvisning:</strong> Om du vill att alla e-postmeddelanden som matchar ett visst mönster ska inaktiveras och fullständigt avvisas med statuskoden `550` (se <a href="#can-i-disable-specific-aliases" class="alert-link">Kan jag inaktivera specifika alias</a>), använd helt enkelt samma metod med ett trippelt utropstecken "!!!". Detta indikerar för avsändaren ett permanent fel och e-postmeddelanden kommer inte att försöka igen, de kommer att avvisas för detta alias.

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Namn/Värd/Alias</th> <th class="text-center">TTL</th> <th>Typ</th> <th>Svar/Värde</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=/^(linus|torvalds)$/:!!!</code></td> </tr> </tbody>
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

### Vilka är dina utgående SMTP-gränser {#what-are-your-outbound-smtp-limits}

Vi begränsar användare och domäner till 300 utgående SMTP-meddelanden per dag. Detta innebär i genomsnitt 9000+ e-postmeddelanden under en kalendermånad. Om du behöver överskrida detta antal eller har genomgående stora e-postmeddelanden, vänligen [kontakta oss](https://forwardemail.net/help).

### Behöver jag godkännande för att aktivera SMTP {#do-i-need-approval-to-enable-smtp}

Ja, observera att för att bibehålla IP-rykte och säkerställa leveransbarhet har Forward Email en manuell granskningsprocess per domän för utgående SMTP-godkännande. Skicka e-post till <support@forwardemail.net> eller öppna en [hjälp begäran](https://forwardemail.net/help) för godkännande. Detta tar vanligtvis mindre än 24 timmar, och de flesta förfrågningar hanteras inom 1–2 timmar. Inom en snar framtid strävar vi efter att göra denna process omedelbar med ytterligare skräppostkontroller och varningar. Denna process säkerställer att dina e-postmeddelanden når inkorgen och att dina meddelanden inte markeras som skräppost.

### Vilka är dina SMTP-serverkonfigurationsinställningar {#what-are-your-smtp-server-configuration-settings}

Vår server är `smtp.forwardemail.net` och övervakas även på vår <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statussida</a>.

Den stöder både IPv4 och IPv6 och är tillgänglig via portarna `465` och `2465` för SSL/TLS och `587`, `2587`, `2525` och `25` för TLS (STARTTLS).

| Protokoll | Värdnamn | Hamnar | IPv4 | IPv6 |
| :--------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: |
| `SSL/TLS` **Föredragen** | `smtp.forwardemail.net` | `465`, `2465` | :vit_check_markering: | :vit_check_markering: |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :vit_check_markering: | :vit_check_markering: |

| Inloggning | Exempel | Beskrivning |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Användarnamn | `user@example.com` | E-postadressen för ett alias som finns för domänen på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a>. |
| Lösenord | `************************` | Aliasspecifikt genererat lösenord. |

För att kunna skicka utgående e-post med SMTP måste **SMTP-användaren** vara e-postadressen för ett alias som finns för domänen på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i>-domäner</a> – och **SMTP-lösenordet** måste vara ett aliasspecifikt genererat lösenord.

Se [Stöder ni att skicka e-post med SMTP](#do-you-support-sending-email-with-smtp) för steg-för-steg-instruktioner.

### Vilka är dina IMAP-serverkonfigurationsinställningar {#what-are-your-imap-server-configuration-settings}

Vår server är `imap.forwardemail.net` och övervakas även på vår <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statussida</a>.

Den stöder både IPv4 och IPv6 och är tillgänglig via portarna `993` och `2993` för SSL/TLS.

| Protokoll | Värdnamn | Hamnar | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Föredragen** | `imap.forwardemail.net` | `993`, `2993` | :vit_check_markering: | :vit_check_markering: |

| Inloggning | Exempel | Beskrivning |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Användarnamn | `user@example.com` | E-postadressen för ett alias som finns för domänen på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a>. |
| Lösenord | `************************` | Aliasspecifikt genererat lösenord. |

För att ansluta med IMAP måste **IMAP-användaren** vara e-postadressen för ett alias som finns för domänen på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i>-domäner</a> – och **IMAP-lösenordet** måste vara ett aliasspecifikt genererat lösenord.

Se [Stöder ni att ta emot e-post med IMAP](#do-you-support-receiving-email-with-imap) för steg-för-steg-instruktioner.

### Vilka är dina POP3-serverkonfigurationsinställningar {#what-are-your-pop3-server-configuration-settings}

Vår server är `pop3.forwardemail.net` och övervakas även på vår <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statussida</a>.

Den stöder både IPv4 och IPv6 och är tillgänglig via portarna `995` och `2995` för SSL/TLS.

| Protokoll | Värdnamn | Hamnar | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Föredragen** | `pop3.forwardemail.net` | `995`, `2995` | :vit_check_markering: | :vit_check_markering: |

| Inloggning | Exempel | Beskrivning |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Användarnamn | `user@example.com` | E-postadressen för ett alias som finns för domänen på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a>. |
| Lösenord | `************************` | Aliasspecifikt genererat lösenord. |

För att ansluta med POP3 måste **POP3-användaren** vara e-postadressen för ett alias som finns för domänen på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mitt konto <i class="fa fa-angle-right"></i>-domäner</a> – och **IMAP-lösenordet** måste vara ett aliasspecifikt genererat lösenord.

Se [Stöder du POP3](#do-you-support-pop3) för steg-för-steg-instruktioner.

### Postfix SMTP-reläkonfiguration {#postfix-smtp-relay-configuration}

Du kan konfigurera Postfix att vidarebefordra e-postmeddelanden via Forward Emails SMTP-servrar. Detta är användbart för serverapplikationer som behöver skicka e-post.

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
Detta kräver ett betalt abonnemang med aktiverad SMTP-åtkomst.
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

2. Under installationen väljer du "Internetwebbplats" när du blir ombedd att ange konfigurationstyp.

#### Konfiguration {#configuration}

1. Redigera den huvudsakliga Postfix-konfigurationsfilen:

```bash
sudo nano /etc/postfix/main.cf
```

2. Lägg till eller ändra dessa inställningar:

```
# SMTP relay configuration
relayhost = [smtp.forwardemail.net]:587
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Skapa SASL-lösenordsfilen:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Lägg till dina inloggningsuppgifter för vidarebefordran av e-post:

```
[smtp.forwardemail.net]:587 your-alias@yourdomain.com:your-generated-password
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

#### Testning {#testing}

Testa din konfiguration genom att skicka ett testmejl:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

## Säkerhet {#security}

### Avancerade serverhärdningstekniker {#advanced-server-hardening-techniques}

> \[!TIP]
> Learn more about our security infrastructure on [our Security page](/security).

Vidarebefordra e-post implementerar ett flertal serverhärdningstekniker för att säkerställa säkerheten för vår infrastruktur och dina data:

1. **Nätverkssäkerhet**:
* IP-tabeller brandvägg med strikta regler
* Fail2ban för brute force-skydd
* Regelbundna säkerhetsrevisioner och penetrationstester
* Endast VPN-administratörsåtkomst

2. **Systemhärdning**:
* Minimal paketinstallation
* Regelbundna säkerhetsuppdateringar
* SELinux i tvingande läge
* Inaktiverad root SSH-åtkomst
* Endast nyckelbaserad autentisering

3. **Applikationssäkerhet**:
* CSP-rubriker (Content Security Policy)
* HTTPS Strict Transport Security (HSTS)
* XSS-skyddsrubriker
* Ramalternativ och hänvisningspolicyrubriker
* Regelbundna beroendegranskningar

4. **Dataskydd**:
* Fullständig diskkryptering med LUKS
* Säker nyckelhantering
* Regelbundna säkerhetskopior med kryptering
* Dataminimeringsrutiner

5. **Övervakning och respons**:
* Intrångsdetektering i realtid
* Automatiserad säkerhetsskanning
* Centraliserad loggning och analys
* Procedurer för incidenthantering

> \[!IMPORTANT]
> Our security practices are continuously updated to address emerging threats and vulnerabilities.

> \[!TIP]
> For maximum security, we recommend using our service with end-to-end encryption via OpenPGP.

### Har du SOC 2- eller ISO 27001-certifieringar? {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email operates on infrastructure provided by certified subprocessors to ensure compliance with industry standards.

Vidarebefordran av e-post har inte direkt SOC 2 Typ II- eller ISO 27001-certifieringar. Tjänsten drivs dock på infrastruktur som tillhandahålls av certifierade underleverantörer:

* **DigitalOcean**: SOC 2 Typ II och SOC 3 Typ II-certifierad (granskad av Schellman & Company LLC), ISO 27001-certifierad vid flera datacenter. Detaljer: <https://www.digitalocean.com/trust/certification-reports>

* **Vultr**: SOC 2+ (HIPAA)-certifierad, ISO/IEC-certifieringar: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Detaljer: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: SOC 2-kompatibel (kontakta DataPacket direkt för att få certifiering), infrastrukturleverantör i företagsklass (plats i Denver). Detaljer: <https://www.datapacket.com/datacenters/denver>

Vidarebefordra e-post följer branschens bästa praxis för säkerhetsrevisioner och samarbetar regelbundet med oberoende säkerhetsforskare. Källa: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### Använder du TLS-kryptering för vidarebefordran av e-post? {#do-you-use-tls-encryption-for-email-forwarding}

Ja. Vidarebefordra e-post tillämpar strikt TLS 1.2+ för alla anslutningar (HTTPS, SMTP, IMAP, POP3) och implementerar MTA-STS för förbättrat TLS-stöd. Implementeringen inkluderar:

* TLS 1.2+-tillämpning för alla e-postanslutningar
* ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) nyckelutbyte för perfekt framåtriktad sekretess
* Moderna krypteringssviter med regelbundna säkerhetsuppdateringar
* HTTP/2-stöd för förbättrad prestanda och säkerhet
* HSTS (HTTP Strict Transport Security) med förladdning i de flesta webbläsare
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** för strikt TLS-tillämpning

Källa: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**MTA-STS-implementering**: Vidarebefordran av e-post implementerar strikt MTA-STS-tillämpning i kodbasen. När TLS-fel uppstår och MTA-STS tillämpas returnerar systemet 421 SMTP-statuskoder för att säkerställa att e-postmeddelanden försöks igen senare snarare än att levereras osäkert. Implementeringsdetaljer:

* TLS-feldetektering: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* MTA-STS-tillämpning i hjälpen för att skicka e-post: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Tredjepartsvalidering: <https://www.hardenize.com/report/forwardemail.net/1750312779> visar betyget "Bra" för alla TLS- och transportsäkerhetsåtgärder.

### Bevarar ni rubriker för e-postautentisering? {#do-you-preserve-email-authentication-headers}

Ja. Vidarebefordra e-post implementerar och bevarar e-postautentiseringsrubriker på ett omfattande sätt:

* **SPF (Sender Policy Framework)**: Korrekt implementerad och bevarad
* **DKIM (DomainKeys Identified Mail)**: Fullt stöd med korrekt nyckelhantering
* **DMARC**: Policytillämpning för e-postmeddelanden som inte klarar SPF- eller DKIM-validering
* **ARC**: Även om det inte är explicit beskrivet, tyder tjänstens perfekta efterlevnadspoäng på omfattande hantering av autentiseringshuvuden

Källa: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Validering: Internet.nl Mail Test visar 100/100 poäng specifikt för implementeringen av "SPF, DKIM och DMARC". Hardenize-bedömningen bekräftar "Bra" betyg för SPF och DMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Bevarar ni ursprungliga e-postrubriker och förhindrar ni förfalskning? {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email implements sophisticated anti-spoofing protection to prevent email abuse.

Vidarebefordra e-post bevarar ursprungliga e-postrubriker samtidigt som det implementerar omfattande skydd mot förfalskning genom MX-kodbasen:

* **Bevarande av rubriker**: Ursprungliga autentiseringsrubriker bibehålls under vidarebefordran
* **Anti-spoofing**: DMARC-policytillämpning förhindrar header-spoofing genom att avvisa e-postmeddelanden som inte klarar SPF- eller DKIM-validering
* **Förebyggande av header-injektion**: Validering och sanering av indata med hjälp av striptags-bibliotek
* **Avancerat skydd**: Sofistikerad nätfiskedetektering med spoofingdetektering, personifieringsskydd och användarmeddelandesystem

**MX-implementeringsdetaljer**: Den centrala e-postbehandlingslogiken hanteras av MX-serverns kodbas, specifikt:

* Huvudsaklig MX-datahanterare: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Godtycklig e-postfiltrering (anti-spoofing): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

Hjälpern `isArbitrary` implementerar sofistikerade regler mot förfalskning, inklusive detektering av domänimitation, blockerade fraser och olika nätfiskemönster.

Källa: <https://forwardemail.net/technical-whitepaper.pdf#page=32>

### Hur skyddar ni er mot skräppost och otillåten användning {#how-do-you-protect-against-spam-and-abuse}

Vidarebefordra e-post implementerar omfattande flerskiktsskydd:

* **Hastighetsbegränsning**: Tillämpas på autentiseringsförsök, API-slutpunkter och SMTP-anslutningar
* **Resursisolering**: Mellan användare för att förhindra påverkan från användare med hög volym
* **DDoS-skydd**: Flerskiktsskydd genom DataPackets Shield-system och Cloudflare
* **Automatisk skalning**: Dynamisk resursjustering baserad på efterfrågan
* **Missbruksförebyggande**: Användarspecifika kontroller av missbruksförebyggande och hashbaserad blockering för skadligt innehåll
* **E-postautentisering**: SPF-, DKIM-, DMARC-protokoll med avancerad nätfiskedetektering

Källor:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (DDoS-skyddsinformation)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### Lagrar ni e-postinnehåll på disk? {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email uses a zero-knowledge architecture that prevents email content from being written to disk.

* **Nollkunskapsarkitektur**: Individuellt krypterade SQLite-postlådor innebär att vidarebefordran av e-post inte kan komma åt e-postinnehåll
* **Minnesbaserad bearbetning**: E-postbearbetning sker helt i minnet, vilket undviker disklagring
* **Ingen innehållsloggning**: "Vi loggar eller lagrar inte e-postinnehåll eller metadata på disk"
* **Sandlådebaserad kryptering**: Krypteringsnycklar lagras aldrig på disk i klartext

**Bevis för MX-kodbas**: MX-servern bearbetar e-postmeddelanden helt i minnet utan att skriva innehåll till disk. Den huvudsakliga hanteraren för e-postbearbetning demonstrerar denna metod i minnet: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Källor:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Sammanfattning)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Nollkunskapsinformation)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Sandlådekryptering)

### Kan e-postinnehåll exponeras vid systemkrascher {#can-email-content-be-exposed-during-system-crashes}

Nej. Vidarebefordra e-post implementerar omfattande skyddsåtgärder mot kraschrelaterad dataexponering:

* **Core Dumps inaktiverade**: Förhindrar minnesexponering vid krascher
* **Swap Memory inaktiverat**: Helt inaktiverat för att förhindra extraktion av känslig data från växlingsfiler
* **Minnesbaserad arkitektur**: E-postinnehåll finns endast i flyktigt minne under bearbetning
* **Krypteringsnyckelskydd**: Nycklar lagras aldrig på disk i klartext
* **Fysisk säkerhet**: LUKS v2-krypterade diskar förhindrar fysisk åtkomst till data
* **USB-lagring inaktiverad**: Förhindrar obehörig dataextraktion

**Felhantering för systemproblem**: Vidarebefordra e-post använder hjälpfunktionerna `isCodeBug` och `isTimeoutError` för att säkerställa att om problem med databasens anslutning, DNS-nätverk/blocklistor eller uppströmsanslutningar uppstår, returnerar systemet 421 SMTP-statuskoder för att säkerställa att e-postmeddelanden försöks igen senare snarare än att förloras eller exponeras.

Implementeringsdetaljer:

* Felklassificering: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Hantering av timeout-fel i MX-bearbetning: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Källa: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### Vem har åtkomst till din e-postinfrastruktur {#who-has-access-to-your-email-infrastructure}

Vidarebefordra e-post implementerar omfattande åtkomstkontroller för sitt minimala teknikteam på 2–3 personer med strikta 2FA-krav:

* **Rollbaserad åtkomstkontroll**: För teamkonton med resursbaserade behörigheter
* **Principen om lägsta behörighet**: Tillämpas i alla system
* **Ansvarsfördelning**: Mellan operativa roller
* **Användarhantering**: Separera distributions- och devops-användare med distinkta behörigheter
* **Root-inloggning inaktiverad**: Tvingar fram åtkomst genom korrekt autentiserade konton
* **Strikt 2FA**: Ingen SMS-baserad 2FA på grund av risk för MiTM-attacker - endast appbaserade eller hårdvarutokens
* **Omfattande granskningsloggning**: Med redigering av känsliga data
* **Automatisk avvikelsedetektering**: För ovanliga åtkomstmönster
* **Regelbundna säkerhetsgranskningar**: Av åtkomstloggar
* **Förebyggande av Evil Maid-attacker**: USB-lagring inaktiverad och andra fysiska säkerhetsåtgärder inaktiverade

Källor:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Auktoriseringskontroller)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Nätverkssäkerhet)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Förebyggande av Evil Maid-attacker)

### Vilka infrastrukturleverantörer använder du {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email uses multiple infrastructure subprocessors with comprehensive compliance certifications.

Fullständig information finns på vår sida om GDPR-efterlevnad: <https://forwardemail.net/gdpr>

**Primära infrastrukturunderbiträden:**

| Leverantör | Certifierad ram för dataskydd | Sida om efterlevnad av GDPR |
| ---------------- | -------------------------------- | ----------------------------------------------- |
| **Cloudflare** | ✅ Ja | <https://www.cloudflare.com/trust-hub/gdpr/> |
| **Datapaket** | ❌ Nej | <https://www.datapacket.com/privacy-policy> |
| **DigitalOcean** | ❌ Nej | <https://www.digitalocean.com/legal/gdpr> |
| **Vultr** | ❌ Nej | <https://www.vultr.com/legal/eea-gdpr-privacy/> |

**Detaljerade certifieringar:**

**DigitalOcean**

* SOC 2 Typ II och SOC 3 Typ II (granskad av Schellman & Company LLC)
* ISO 27001-certifierad vid flera datacenter
* PCI-DSS-kompatibel
* CSA STAR Nivå 1-certifierad
* APEC CBPR PRP-certifierad
* Detaljer: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* SOC 2+ (HIPAA)-certifierad
* PCI Merchant-kompatibel
* CSA STAR Level 1-certifierad
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Detaljer: <https://www.vultr.com/legal/compliance/>

**Datapaket**

* SOC 2-kompatibel (kontakta DataPacket direkt för att få certifiering)
* Infrastruktur i företagsklass (Denver)
* DDoS-skydd genom Shield cybersäkerhetsstack
* Teknisk support dygnet runt
* Globalt nätverk över 58 datacenter
* Detaljer: <https://www.datapacket.com/datacenters/denver>

**Betalningsleverantörer:**

* **Stripe**: Certifierad enligt Data Privacy Framework - <https://stripe.com/legal/privacy-center>
* **PayPal**: Inte DPF-certifierad - <https://www.paypal.com/uk/legalhub/privacy-full>

### Erbjuder ni ett databehandlingsavtal (DPA)? {#do-you-offer-a-data-processing-agreement-dpa}

Ja, Vidarebefordra e-post erbjuder ett omfattande databehandlingsavtal (DPA) som kan undertecknas med vårt företagsavtal. En kopia av vårt DPA finns tillgänglig på: <https://forwardemail.net/dpa>

**DPA-uppgifter:**

* Omfattar GDPR-efterlevnad och ramverket för Privacy Shield mellan EU och USA/Schweiz och USA
* Accepteras automatiskt när du godkänner våra användarvillkor
* Ingen separat underskrift krävs för standardiserat DPA
* Anpassade DPA-arrangemang tillgängliga via Enterprise License

**GDPR-efterlevnadsramverk:**
Vårt dataskyddsavtal beskriver i detalj efterlevnaden av GDPR samt internationella krav på dataöverföring. Fullständig information finns på: <https://forwardemail.net/gdpr>

För företagskunder som behöver anpassade DPA-villkor eller specifika avtalsarrangemang kan dessa hanteras via vårt **Företagslicensprogram (250 USD/månad)**.

### Hur hanterar ni anmälningar om dataintrång {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Forward Email's zero-knowledge architecture significantly limits breach impact.

* **Begränsad dataexponering**: Kan inte komma åt krypterat e-postinnehåll på grund av nollkunskapsarkitektur
* **Minimal datainsamling**: Endast grundläggande prenumerantinformation och begränsade IP-loggar för säkerhet
* **Ramverk för underleverantörer**: DigitalOcean och Vultr upprätthåller GDPR-kompatibla incidenthanteringsprocedurer

**Information om GDPR-ombud:**
Forward Email har utsett GDPR-ombud i enlighet med artikel 27:

**EU-representant:**
Osano International Compliance Services Limited
ATTN: LFHC
3 Dublin Landings, North Wall Quay
Dublin 1, D01C4E0

**Representant i Storbritannien:**
Osano UK Compliance LTD
ATTN: LFHC
42-46 Fountain Street, Belfast
Antrim, BT1 - 5EF

För företagskunder som behöver specifika servicenivåavtal för intrångsmeddelanden bör dessa diskuteras som en del av ett **företagslicensavtal**.

Källor:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### Erbjuder ni en testmiljö {#do-you-offer-a-test-environment}

Den tekniska dokumentationen för Vidarebefordra e-post beskriver inte uttryckligen ett dedikerat sandlådeläge. Potentiella testmetoder inkluderar dock:

* **Alternativ för egenhosting**: Omfattande egenhostingsfunktioner för att skapa testmiljöer
* **API-gränssnitt**: Potential för programmatisk testning av konfigurationer
* **Öppen källkod**: 100 % öppen källkod låter kunderna undersöka vidarebefordringslogik
* **Flera domäner**: Stöd för flera domäner kan möjliggöra skapande av testdomäner

För företagskunder som behöver formella sandbox-funktioner bör detta diskuteras som en del av ett **företagslicensavtal**.

Källa: <https://github.com/forwardemail/forwardemail.net> (Information om utvecklingsmiljön)

### Tillhandahåller ni övervaknings- och varningsverktyg {#do-you-provide-monitoring-and-alerting-tools}

Vidarebefordra e-post ger övervakning i realtid med vissa begränsningar:

**Tillgänglig:**

* **Övervakning av leverans i realtid**: Offentligt synliga prestandamått för större e-postleverantörer
* **Automatiska aviseringar**: Ingenjörsteamet varnas när leveranstiderna överstiger 10 sekunder
* **Transparent övervakning**: 100 % övervakningssystem med öppen källkod
* **Infrastrukturövervakning**: Automatiserad avvikelsedetektering och omfattande granskningsloggning

**Begränsningar:**

* Kundvända webhooks eller API-baserade leveransstatusmeddelanden är inte explicit dokumenterade

För företagskunder som behöver detaljerade webhooks för leveransstatus eller anpassade övervakningsintegrationer kan dessa funktioner vara tillgängliga via **Företagslicens**.

Källor:

* <https://forwardemail.net> (Visning av realtidsövervakning)
* <https://github.com/forwardemail/forwardemail.net> (Implementering av övervakning)

### Hur säkerställer du hög tillgänglighet {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Forward Email implements comprehensive redundancy across multiple infrastructure providers.

* **Distribuerad infrastruktur**: Flera leverantörer (DigitalOcean, Vultr, DataPacket) över geografiska regioner
* **Geografisk lastbalansering**: Cloudflare-baserad geolokaliserad lastbalansering med automatisk redundans
* **Automatisk skalning**: Dynamisk resursjustering baserad på efterfrågan
* **Flerskikts-DDoS-skydd**: Genom DataPackets Shield-system och Cloudflare
* **Serverredundans**: Flera servrar per region med automatisk redundans
* **Databasreplikering**: Datasynkronisering i realtid över flera platser
* **Övervakning och aviseringar**: Övervakning dygnet runt med automatisk incidentrespons

**Åtagande för drifttid**: 99,9 %+ tjänsttillgänglighet med transparent övervakning tillgänglig på <https://forwardemail.net>

Källor:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Följer du kraven i avsnitt 889 i National Defense Authorization Act (NDAA)? {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Forward Email is fully compliant with Section 889 through careful selection of infrastructure partners.

Ja, vidarebefordran av e-post är **kompatibel med avsnitt 889**. Avsnitt 889 i National Defense Authorization Act (NDAA) förbjuder myndigheter att använda eller ingå avtal med enheter som använder telekommunikations- och videoövervakningsutrustning från specifika företag (Huawei, ZTE, Hikvision, Dahua och Hytera).

**Hur vidarebefordran av e-post uppnår efterlevnad av avsnitt 889:**

Vidarebefordra e-post förlitar sig uteslutande på två viktiga infrastrukturleverantörer, varav ingen använder utrustning som är förbjuden enligt paragraf 889:

1. **Cloudflare**: Vår primära partner för nätverkstjänster och e-postsäkerhet
2. **DataPacket**: Vår primära leverantör av serverinfrastruktur (med exklusiva Arista Networks- och Cisco-utrustning)
3. **Säkerhetskopieringsleverantörer**: Våra säkerhetskopieringsleverantörer av Digital Ocean och Vultr har dessutom skriftligen bekräftats vara kompatibla med Section 889.

**Cloudflares åtagande**: Cloudflare anger uttryckligen i sin uppförandekod för tredje part att de inte använder telekommunikationsutrustning, videoövervakningsprodukter eller tjänster från några enheter som är förbjudna enligt avsnitt 889.

**Användningsfall för myndigheter**: Vår efterlevnad av avsnitt 889 validerades när **US Naval Academy** valde vidarebefordra e-post för sina behov av säker vidarebefordran av e-post, vilket krävde dokumentation av våra federala efterlevnadsstandarder.

För fullständig information om vårt ramverk för efterlevnad av myndighetsregler, inklusive bredare federala bestämmelser, läs vår omfattande fallstudie: [Kompatibel med avsnitt 889 i den federala regeringens e-posttjänst](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)

## System- och tekniska detaljer {#system-and-technical-details}

### Lagrar ni e-postmeddelanden och deras innehåll? {#do-you-store-emails-and-their-contents}

Nej, vi skriver inte till disk eller lagrar loggar – med [undantag för fel](#do-you-store-error-logs) och [utgående SMTP](#do-you-support-sending-email-with-smtp) (se vår [Integritetspolicy](/privacy)).

Allt görs i minnet och [vår källkod finns på GitHub](https://github.com/forwardemail).

### Hur fungerar ert system för vidarebefordran av e-post? {#how-does-your-email-forwarding-system-work}

E-post är beroende av [SMTP-protokoll](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). Detta protokoll består av kommandon som skickas till en server (som oftast körs på port 25). Det finns en initial anslutning, sedan anger avsändaren vem e-postmeddelandet kommer ifrån ("MAIL FROM"), följt av vart det ska ("RCPT TO"), och slutligen rubrikerna och själva e-postmeddelandets brödtext ("DATA"). Flödet i vårt system för vidarebefordran av e-post beskrivs i förhållande till varje SMTP-protokollkommando nedan:

* Initial anslutning (inget kommandonamn, t.ex. `telnet example.com 25`) – Detta är den initiala anslutningen. Vi kontrollerar avsändare som inte finns i vår [tillåtelselista](#do-you-have-an-allowlist) mot vår [denylist](#do-you-have-a-denylist). Slutligen, om en avsändare inte finns i vår tillåtelselista, kontrollerar vi om de har blivit [grålistad](#do-you-have-a-greylist).

* `HELO` – Detta indikerar en hälsning som identifierar avsändarens FQDN, IP-adress eller e-posthanterarens namn. Detta värde kan förfalskas, så vi förlitar oss inte på dessa data utan använder istället omvänd värdnamnssökning av anslutningens IP-adress.

* `MAIL FROM` – Detta anger e-postens kuvertadress. Om ett värde anges måste det vara en giltig RFC 5322-e-postadress. Tomma värden är tillåtna. Vi [kontrollera efter bakåtspridning](#how-do-you-protect-against-backscatter) här, och vi kontrollerar även MAIL FROM mot vår [denylist](#do-you-have-a-denylist). Vi kontrollerar slutligen avsändare som inte finns på tillåtelselistan för hastighetsbegränsning (se avsnittet om [Hastighetsbegränsande](#do-you-have-rate-limiting) och [tillåtelselista](#do-you-have-an-allowlist) för mer information).

* `RCPT TO` – Detta anger mottagaren/mottagarna av e-postmeddelandet. Dessa måste vara giltiga RFC 5322-e-postadresser. Vi tillåter endast upp till 50 kuvertmottagare per meddelande (detta skiljer sig från "Till"-rubriken i ett e-postmeddelande). Vi kontrollerar också om det finns en giltig [Avsändarens omskrivningsschema](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS")-adress här för att skydda mot förfalskning med vårt SRS-domännamn.

* `DATA` – Detta är kärndelen av vår tjänst som behandlar e-post. Se avsnittet [Hur hanterar man ett e-postmeddelande för vidarebefordran](#how-do-you-process-an-email-for-forwarding) nedan för mer information.

### Hur vidarebefordrar man ett e-postmeddelande? {#how-do-you-process-an-email-for-forwarding}

Det här avsnittet beskriver vår process relaterad till SMTP-protokollkommandot `DATA` i avsnittet [Hur fungerar ert system för vidarebefordran av e-post?](#how-does-your-email-forwarding-system-work) ovan – det handlar om hur vi bearbetar ett e-postmeddelandes rubriker, brödtext, säkerhet, avgör vart det ska levereras och hur vi hanterar anslutningar.

1. Om meddelandet överskrider den maximala storleken på 50 MB avvisas det med felkoden 552.

2. Om meddelandet inte innehöll en "Från"-rubrik, eller om något av värdena i "Från"-rubriken inte var giltiga RFC 5322-e-postadresser, avvisas det med felkoden 550.

3. Om meddelandet hade fler än 25 "Received"-rubriker, fastnade det i en omdirigeringsslinga och det avvisades med felkoden 550.

4. Med hjälp av e-postmeddelandets fingeravtryck (se avsnittet om [Fingeravtryck](#how-do-you-determine-an-email-fingerprint)) kontrollerar vi om meddelandet har försökts skickas igen i mer än 5 dagar (vilket matchar [standardbeteende för postfix](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)), och om så är fallet kommer det att avvisas med felkoden 550.

5. Vi lagrar resultaten från skanningen av e-postmeddelandet i minnet med hjälp av [Skräppostskanner](https://spamscanner.net).

6. Om det fanns några godtyckliga resultat från Spam Scanner, avvisas det med felkoden 554. Godtyckliga resultat inkluderar endast GTUBE-testet vid tidpunkten för detta skrivande. Se <https://spamassassin.apache.org/gtube/> för mer information.

7. Vi kommer att lägga till följande rubriker i meddelandet för felsökning och för att förhindra missbruk:

* `Received` - vi lägger till denna standardiserade Received-rubrik med ursprungs-IP och värd, överföringstyp, TLS-anslutningsinformation, datum/tid och mottagare.
* `X-Original-To` - den ursprungliga mottagaren för meddelandet:
* Detta är användbart för att avgöra vart ett e-postmeddelande ursprungligen levererades (utöver rubriken "Received").
* Detta läggs till per mottagare vid tidpunkten för IMAP och/eller maskerad vidarebefordran (för att skydda integriteten).
* `X-Forward-Email-Website` - innehåller en länk till vår webbplats <https://forwardemail.net>
* `X-Forward-Email-Version` - den aktuella [SemVer](https://semver.org/)-versionen från `package.json` av vår kodbas.
* `X-Forward-Email-Session-ID` - ett sessions-ID-värde som används för felsökning (gäller endast i icke-produktionsmiljöer).
* `X-Forward-Email-Sender` - en kommaseparerad lista som innehåller den ursprungliga kuvertadressen MAIL FROM (om den inte var tom), den omvända PTR-klientens FQDN (om den finns) och avsändarens IP-adress.
* `X-Forward-Email-ID` - detta gäller endast för utgående SMTP och korrelerar med e-post-ID:t som lagras i Mitt konto → E-postmeddelanden.
* `X-Report-Abuse` - med värdet `abuse@forwardemail.net`.
* `X-Report-Abuse-To` - med värdet `abuse@forwardemail.net`.
* `X-Complaints-To` - med värdet `abuse@forwardemail.net`.

8. Vi kontrollerar sedan meddelandet för [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain) och [DMARC](https://en.wikipedia.org/wiki/DMARC).

* Om meddelandet misslyckades med DMARC och domänen hade en avvisningspolicy (t.ex. `p=reject` [fanns i DMARC-policyn](https://wikipedia.org/wiki/DMARC)), avvisas det med felkoden 550. Vanligtvis finns en DMARC-policy för en domän i underdomänens <strong class="notranslate">TXT</strong>-post (t.ex. `dig _dmarc.example.com txt`).

* Om meddelandet misslyckades med SPF och domänen hade en hård felpolicy (t.ex. `-all` fanns i SPF-policyn istället för `~all` eller ingen policy alls), avvisas det med felkoden 550. Vanligtvis finns en SPF-policy för en domän i <strong class="notranslate">TXT</strong>-posten för rotdomänen (t.ex. `dig example.com txt`). Se det här avsnittet för mer information om [skicka e-post som med Gmail](#can-i-send-mail-as-in-gmail-with-this) angående SPF.

9. Nu bearbetar vi mottagarna av meddelandet som samlats in från kommandot `RCPT TO` i avsnittet [Hur fungerar ert system för vidarebefordran av e-post?](#how-does-your-email-forwarding-system-work) ovan. För varje mottagare utför vi följande operationer:

* Vi söker upp <strong class="notranslate">TXT</strong>-posterna för domännamnet (delen efter symbolen `@`, t.ex. `example.com` om e-postadressen var `test@example.com`). Om domänen till exempel är `example.com` gör vi en DNS-sökning, till exempel `dig example.com txt`.

* Vi analyserar alla <strong class="notranslate">TXT</strong>-poster som börjar med antingen `forward-email=` (gratisabonnemang) eller `forward-email-site-verification=` (betalda abonnemang). Observera att vi analyserar båda för att kunna bearbeta e-postmeddelanden medan en användare uppgraderar eller nedgraderar abonnemang. * Från dessa analyserade <strong class="notranslate">TXT</strong>-poster itererar vi över dem för att extrahera vidarebefordringskonfigurationen (som beskrivs i avsnittet [Hur kommer jag igång och konfigurerar vidarebefordran av e-post](#how-do-i-get-started-and-set-up-email-forwarding) ovan). Observera att vi endast stöder ett `forward-email-site-verification=`-värde, och om fler än ett anges kommer ett 550-fel att uppstå och avsändaren får en studs för denna mottagare.

* Rekursivt itererar vi över den extraherade vidarebefordringskonfigurationen för att bestämma global vidarebefordring, regex-baserad vidarebefordring och alla andra vidarebefordringskonfigurationer som stöds – vilka nu kallas våra "vidarebefordringsadresser".

* För varje vidarebefordringsadress stöder vi en rekursiv sökning (som startar denna serie operationer om på den angivna adressen). Om en rekursiv matchning hittades kommer det överordnade resultatet att tas bort från vidarebefordringsadresserna och de underordnade läggs till.
* Vidarebefordringsadresser analyseras för unikhet (eftersom vi inte vill skicka dubbletter till en adress eller skapa ytterligare onödiga SMTP-klientanslutningar).
* För varje vidarebefordringsadress söker vi upp dess domännamn mot vår API-slutpunkt `/v1/max-forwarded-addresses` (för att avgöra hur många adresser domänen får vidarebefordra e-post till per alias, t.ex. 10 som standard – se avsnittet om [maximal gräns för vidarebefordran per alias](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)). Om denna gräns överskrids uppstår ett 550-fel och avsändaren får en studs för denna mottagare.
* Vi söker upp inställningarna för den ursprungliga mottagaren mot vår API-slutpunkt `/v1/settings`, som stöder en sökning för betalande användare (med en reserv för gratisanvändare). Detta returnerar ett konfigurationsobjekt för avancerade inställningar för `port` (tal, t.ex. `25`), `has_adult_content_protection` (booleskt), `has_phishing_protection` (booleskt), `has_executable_protection` (booleskt) och `has_virus_protection` (booleskt).
* Baserat på dessa inställningar kontrollerar vi sedan mot Spam Scanners resultat och om några fel uppstår avvisas meddelandet med felkoden 554 (t.ex. om `has_virus_protection` är aktiverat kontrollerar vi Spam Scanners resultat för virus). Observera att alla användare av gratisplanen kommer att välja att kontrollera mot vuxeninnehåll, nätfiske, körbara filer och virus. Som standard är alla användare av betalande abonnemang också aktiverade, men den här konfigurationen kan ändras under inställningssidan för en domän i instrumentpanelen för vidarebefordran av e-post.

10. För varje bearbetad mottagares vidarebefordringsadress utför vi sedan följande operationer:

* Adressen kontrolleras mot vår [denylist](#do-you-have-a-denylist), och om den listades kommer en 421-felkod att visas (indikerar för avsändaren att försöka igen senare).

* Om adressen är en webhook ställer vi in ett booleskt värde för framtida åtgärder (se nedan – vi grupperar liknande webhooks för att göra en POST-förfrågan istället för flera för leverans).

* Om adressen är en e-postadress analyserar vi värden för framtida åtgärder (se nedan – vi grupperar liknande värdar för att göra en anslutning istället för flera individuella anslutningar för leverans).

11. Om det inte finns några mottagare och inga returer, svarar vi med felet 550 "Ogiltiga mottagare".

12. Om det finns mottagare itererar vi över dem (grupperade av samma värd) och levererar e-postmeddelandena. Se avsnittet [Hur hanterar ni problem med e-postleverans](#how-do-you-handle-email-delivery-issues) nedan för mer information.

* Om några fel uppstår när vi skickar e-postmeddelanden lagrar vi dem i minnet för senare bearbetning.
* Vi tar den lägsta felkoden (om någon) från att skicka e-postmeddelanden – och använder den som svarskod på kommandot `DATA`. Det betyder att e-postmeddelanden som inte levererats vanligtvis försöks skickas igen av den ursprungliga avsändaren, men e-postmeddelanden som redan levererats skickas inte igen nästa gång meddelandet skickas (eftersom vi använder [Fingeravtryck](#how-do-you-determine-an-email-fingerprint)).
* Om inga fel uppstod skickar vi en 250 lyckad SMTP-svarsstatuskod.
* En studs definieras som varje leveransförsök som resulterar i en statuskod som är >= 500 (permanenta fel).

13. Om inga studsar inträffade (permanenta fel) returnerar vi en SMTP-svarsstatuskod med den lägsta felkoden från icke-permanenta fel (eller en statuskod för lyckade 250 om inga fel förekom).

14. Om avvisningar inträffar skickar vi avvisningsmejl i bakgrunden efter att ha returnerat den lägsta av alla felkoder till avsändaren. Om den lägsta felkoden är >= 500 skickar vi dock inga avvisningsmejl. Detta beror på att om vi gjorde det skulle avsändarna få ett dubbelt avvisningsmejl (t.ex. ett från deras utgående MTA, till exempel Gmail – och även ett från oss). Se avsnittet om [Hur skyddar man sig mot bakåtspridning](#how-do-you-protect-against-backscatter) nedan för mer information.

### Hur hanterar ni problem med e-postleverans? {#how-do-you-handle-email-delivery-issues}

Observera att vi kommer att göra en "Friendly-From"-omskrivning av e-postmeddelandena om och endast om avsändarens DMARC-policy inte godkändes OCH inga DKIM-signaturer var anpassade till "Från"-huvudet.  Det betyder att vi kommer att ändra rubriken "Från" på meddelandet, ställa in "X-Original-Från" och även ställa in ett "Svara-till" om det inte redan var inställt.  Vi kommer också att återförsegla ARC-förseglingen på meddelandet efter att ha ändrat dessa rubriker.

Vi använder också smart parsing av felmeddelanden på varje nivå i vår stack – i vår kod, DNS-förfrågningar, Node.js interna funktioner, HTTP-förfrågningar (t.ex. 408, 413 och 429 mappas till SMTP-svarskoden 421 om mottagaren är en webhook) och e-postserversvar (t.ex. svar med "defer" eller "slowdown" skulle försökas igen som 421-fel).

Vår logik är dummy-säker och den kommer även att försöka igen vid SSL/TLS-fel, anslutningsproblem med mera. Målet med dummy-proofing är att maximera leveransbarheten till alla mottagare för en vidarebefordringskonfiguration.

Om mottagaren är en webhook tillåter vi en timeout på 60 sekunder för att begäran ska kunna slutföras, med upp till 3 försök (dvs. totalt 4 begäranden innan ett misslyckande). Observera att vi korrekt analyserar felkoderna 408, 413 och 429 och mappar dem till SMTP-svarskoden 421.

Om mottagaren är en e-postadress försöker vi skicka e-postmeddelandet med opportunistisk TLS (vi försöker använda STARTTLS om det är tillgängligt på mottagarens e-postserver). Om ett SSL/TLS-fel uppstår när vi försöker skicka e-postmeddelandet försöker vi skicka e-postmeddelandet utan TLS (utan att använda STARTTLS).

Om några DNS- eller anslutningsfel uppstår, returnerar vi SMTP-svarskoden 421 till kommandot `DATA`. Annars skickas returer om det finns fel på nivån >= 500.

Om vi upptäcker att en e-postserver som vi försöker leverera till har en eller flera av våra IP-adresser blockerade (t.ex. av den teknik de använder för att avvisa spammare), skickar vi en SMTP-svarskod på 421 till avsändaren så att de kan försöka skicka meddelandet igen senare (och vi meddelas om problemet så att vi förhoppningsvis kan lösa det före nästa försök).

### Hur hanterar du blockering av dina IP-adresser? {#how-do-you-handle-your-ip-addresses-becoming-blocked}

Vi övervakar rutinmässigt alla större DNS-avvisningslistor och om någon av våra IP-adresser för e-postutbyte ("MX") finns med i en större avvisningslista kommer vi att ta bort den från den relevanta DNS A-post-rundan om möjligt tills problemet är löst.

I skrivande stund finns vi även med i flera DNS-godkännandelistor, och vi tar övervakning av avvisningslistor på största allvar. Om du ser några problem innan vi har en chans att lösa dem, vänligen meddela oss skriftligen på <support@forwardemail.net>.

Våra IP-adresser är offentligt tillgängliga, [se avsnittet nedan för mer insikt](#what-are-your-servers-ip-addresses).

### Vad är postmasteradresser {#what-are-postmaster-addresses}

För att förhindra missriktade avvisningar och att skicka semestersvarsmeddelanden till oövervakade eller obefintliga postlådor, upprätthåller vi en lista över mailer-daemon-liknande användarnamn:

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
* [och eventuell obesvarad adress](#what-are-no-reply-addresses)

Se [RFC 5320 Avsnitt 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) för mer insikt i hur listor som dessa används för att skapa effektiva e-postsystem.

### Vad är adresser utan svar {#what-are-no-reply-addresses}

E-postadresser med något av följande (skiftlägeskänsliga) anses vara adresser som inte får svara:

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

Denna lista underhålls [som ett öppen källkodsprojekt på GitHub](https://github.com/forwardemail/reserved-email-addresses-list).

### Vilka är din servers IP-adresser {#what-are-your-servers-ip-addresses}

Vi publicerar våra IP-adresser på <https://forwardemail.net/ips>.

### Har du en godkännandelista {#do-you-have-an-allowlist}

Ja, vi har en [lista över domännamnstillägg](#what-domain-name-extensions-are-allowlisted-by-default) som är tillåtelselistad som standard och en dynamisk, cachad och rullande tillåtelselista baserad på [strikta kriterier](#what-is-your-allowlist-criteria).

Alla e-postadresser, domäner och mottagare från kunder med betalda abonnemang läggs automatiskt till i vår godkännandelista.

### Vilka domännamnstillägg är tillåtna som standard {#what-domain-name-extensions-are-allowlisted-by-default}

Följande domännamnstillägg anses som standard vara godkända (oavsett om de finns på Umbrella Popularity List eller inte):

<ul class="list-inline"> <li class="list-inline-item"><code class="notranslate">edu</code></li> <li class="list-inline-item"><code class="notranslate">gov</code></li> <li class="list-inline-item"><code class="notranslate">mil</code></li> <li class="list-inline-item"><code class="notranslate">int</code></li> <li class="list-inline-item"><code class="notranslate">arpa</code></li> <li class="list-inline-item"><code class="notranslate">dni.us</code></li> <li class="list-inline-item"><code class="notranslate">fed.us</code></li> <li class="list-inline-item"><code class="notranslate">isa.us</code></li> <li class="list-inline-item"><code class="notranslate">kids.us</code></li> <li class="list-inline-item"><code class="notranslate">nsn.us</code></li> <li class="list-inline-item"><code class="notranslate">ak.us</code></li> <li class="list-inline-item"><code class="notranslate">al.us</code></li> <li class="list-inline-item"><code class="notranslate">ar.us</code></li> <li class="list-inline-item"><code class="notranslate">as.us</code></li> <li class="list-inline-item"><code class="notranslate">az.us</code></li> <li class="list-inline-item"><code class="notranslate">ca.us</code></li> <li class="list-inline-item"><code class="notranslate">co.us</code></li> <li class="list-inline-item"><code class="notranslate">ct.us</code></li> <li class="list-inline-item"><code class="notranslate">dc.us</code></li> <li class="list-inline-item"><code class="notranslate">de.us</code></li> <li class="list-inline-item"><code class="notranslate">fl.us</code></li> <li class="list-inline-item"><code class="notranslate">ga.us</code></li> <li class="list-inline-item"><code class="notranslate">gu.us</code></li> <li class="list-inline-item"><code class="notranslate">hi.us</code></li> <li class="list-inline-item"><code class="notranslate">ia.us</code></li> <li class="list-inline-item"><code class="notranslate">id.us</code></li> <li class="list-inline-item"><code class="notranslate">il.us</code></li> <li class="list-inline-item"><code class="notranslate">in.us</code></li> <li class="list-inline-item"><code class="notranslate">ks.us</code></li> <li class="list-inline-item"><code class="notranslate">ky.us</code></li> <li class="list-inline-item"><code class="notranslate">la.us</code></li> <li class="list-inline-item"><code class="notranslate">ma.us</code></li> <li class="list-inline-item"><code class="notranslate">md.us</code></li> <li class="list-inline-item"><code class="notranslate">me.us</code></li> <li class="list-inline-item"><code class="notranslate">mi.us</code></li> <li class="list-inline-item"><code class="notranslate">mn.us</code></li> <li class="list-inline-item"><code class="notranslate">mo.us</code></li> <li class="list-inline-item"><code class="notranslate">ms.us</code></li> <li class="list-inline-item"><code class="notranslate">mt.us</code></li> <li class="list-inline-item"><code class="notranslate">nc.us</code></li> <li class="list-inline-item"><code class="notranslate">nd.us</code></li> <li class="list-inline-item"><code class="notranslate">ne.us</code></li> <li class="list-inline-item"><code class="notranslate">nh.us</code></li> <li class="list-inline-item"><code class="notranslate">nj.us</code></li> <li class="list-inline-item"><code class="notranslate">nv.us</code></li> <li class="list-inline-item"><code class="notranslate">ny.us</code></li> <li class="list-inline-item"><code class="notranslate">oh.us</code></li> <li class="list-inline-item"><code class="notranslate">ok.us</code></li> <li class="list-inline-item"><code class="notranslate">or.us</code></li> <li class="list-inline-item"><code class="notranslate">pa.us</code></li> <li class="list-inline-item"><code class="notranslate">pr.us</code></li> <li class="list-inline-item"><code class="notranslate">ri.us</code></li> <li class="list-inline-item"><code class="notranslate">sc.us</code></li> <li class="list-inline-item"><code class="notranslate">sd.us</code></li> <li class="list-inline-item"><code class="notranslate">tn.us</code></li> <li class="list-inline-item"><code class="notranslate">tx.us</code></li> <li class="list-inline-item"><code class="notranslate">ut.us</code></li> <li class="list-inline-item"><code class="notranslate">va.us</code></li> <li class="list-inline-item"><code class="notranslate">vi.us</code></li> <li class="list-inline-item"><code class="notranslate">vt.us</code></li> <li class="list-inline-item"><code class="notranslate">wa.us</code></li> <li class="list-inline-item"><code class="notranslate">wi.us</code></li> <li class="list-inline-item"><code class="notranslate">wv.us</code></li> <li class="list-inline-item"><code class="notranslate">wy.us</code></li>
<li class="list-inline-item"><code class="notranslate">mil.tt</code></li>
<li class="list-inline-item"><code class="notranslate">edu.tt</code></li>
<li class="list-inline-item"><code class="notranslate">edu.tr</code></li>
<li class="list-inline-item"><code class="notranslate">edu.ua</code></li>
<li class="list-inline-item"><code class="notranslate">edu.au</code></li>
<li class="list-inline-item"><code class="notranslate">ac.at</code></li>
<li class="list-inline-item"><code class="notranslate">edu.br</code></li>
<li class="list-inline-item"><code class="notranslate">ac.nz</code></li> <li class="list-inline-item"><code class="notranslate">skola.nz</code></li> <li class="list-inline-item"><code class="notranslate">cri.nz</code></li> <li class="list-inline-item"><code class="notranslate">hälsa.nz</code></li> <li class="list-inline-item"><code class="notranslate">mil.nz</code></li> <li class="list-inline-item"><code class="notranslate">parlamentet.nz</code></li> <li class="list-inline-item"><code class="notranslate">ac.in</code></li> <li class="list-inline-item"><code class="notranslate">edu.in</code></li> <li class="list-inline-item"><code class="notranslate">mil.in</code></li> <li class="list-inline-item"><code class="notranslate">ac.jp</code></li> <li class="list-inline-item"><code class="notranslate">ed.jp</code></li> <li class="list-inline-item"><code class="notranslate">lg.jp</code></li> <li class="list-inline-item"><code class="notranslate">ac.za</code></li> <li class="list-inline-item"><code class="notranslate">edu.za</code></li> <li class="list-inline-item"><code class="notranslate">mil.za</code></li> <li class="list-inline-item"><code class="notranslate">skola.za</code></li> <li class="list-inline-item"><code class="notranslate">mil.kr</code></li>
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
<li class="list-inline-item"><code class="notranslate">gov.ad</code></li> <li class="list-inline-item"><code class="notranslate">gov.af</code></li> <li class="list-inline-item"><code class="notranslate">gov.ai</code></li> <li class="list-inline-item"><code class="notranslate">gov.al</code></li> <li class="list-inline-item"><code class="notranslate">gov.am</code></li> <li class="list-inline-item"><code class="notranslate">gov.ao</code></li> <li class="list-inline-item"><code class="notranslate">gov.au</code></li> <li class="list-inline-item"><code class="notranslate">gov.aw</code></li> <li class="list-inline-item"><code class="notranslate">gov.ax</code></li> <li class="list-inline-item"><code class="notranslate">gov.az</code></li> <li class="list-inline-item"><code class="notranslate">gov.bd</code></li> <li class="list-inline-item"><code class="notranslate">gov.be</code></li> <li class="list-inline-item"><code class="notranslate">gov.bg</code></li> <li class="list-inline-item"><code class="notranslate">gov.bm</code></li> <!--<li class="list-inline-item"><code class="notranslate">gov.br</code></li>--> <li class="list-inline-item"><code class="notranslate">gov.by</code></li> <li class="list-inline-item"><code class="notranslate">gov.cl</code></li>
<li class="list-inline-item"><code class="notranslate">gov.cn</code></li>
<li class="list-inline-item"><code class="notranslate">gov.co</code></li>
<li class="list-inline-item"><code class="notranslate">gov.cy</code></li>
<li class="list-inline-item"><code class="notranslate">gov.cz</code></li>
<li class="list-inline-item"><code class="notranslate">gov.dz</code></li>
<li class="list-inline-item"><code class="notranslate">gov.eg</code></li>
<li class="list-inline-item"><code class="notranslate">gov.fi</code></li>
<li class="list-inline-item"><code class="notranslate">gov.fk</code></li> <li class="list-inline-item"><code class="notranslate">gov.gg</code></li> <li class="list-inline-item"><code class="notranslate">gov.gr</code></li> <li class="list-inline-item"><code class="notranslate">gov.hk</code></li> <li class="list-inline-item"><code class="notranslate">gov.hr</code></li> <li class="list-inline-item"><code class="notranslate">gov.hu</code></li> <li class="list-inline-item"><code class="notranslate">gov.ie</code></li> <li class="list-inline-item"><code class="notranslate">gov.il</code></li> <li class="list-inline-item"><code class="notranslate">gov.im</code></li> <li class="list-inline-item"><code class="notranslate">gov.in</code></li> <li class="list-inline-item"><code class="notranslate">gov.iq</code></li> <li class="list-inline-item"><code class="notranslate">gov.ir</code></li> <li class="list-inline-item"><code class="notranslate">gov.it</code></li> <li class="list-inline-item"><code class="notranslate">gov.je</code></li> <li class="list-inline-item"><code class="notranslate">gov.kp</code></li> <li class="list-inline-item"><code class="notranslate">gov.krd</code></li> <li class="list-inline-item"><code class="notranslate">gov.ky</code></li> <li class="list-inline-item"><code class="notranslate">gov.kz</code></li> <li class="list-inline-item"><code class="notranslate">gov.lb</code></li> <li class="list-inline-item"><code class="notranslate">gov.lk</code></li> <li class="list-inline-item"><code class="notranslate">gov.lt</code></li> <li class="list-inline-item"><code class="notranslate">gov.lv</code></li> <li class="list-inline-item"><code class="notranslate">gov.ma</code></li> <li class="list-inline-item"><code class="notranslate">gov.mm</code></li> <li class="list-inline-item"><code class="notranslate">gov.mo</code></li> <li class="list-inline-item"><code class="notranslate">gov.mt</code></li> <li class="list-inline-item"><code class="notranslate">gov.my</code></li> <li class="list-inline-item"><code class="notranslate">gov.ng</code></li> <li class="list-inline-item"><code class="notranslate">gov.np</code></li> <li class="list-inline-item"><code class="notranslate">gov.ph</code></li> <li class="list-inline-item"><code class="notranslate">gov.pk</code></li> <li class="list-inline-item"><code class="notranslate">gov.pl</code></li> <li class="list-inline-item"><code class="notranslate">gov.pt</code></li> <li class="list-inline-item"><code class="notranslate">gov.py</code></li> <li class="list-inline-item"><code class="notranslate">gov.ro</code></li> <li class="list-inline-item"><code class="notranslate">gov.ru</code></li> <li class="list-inline-item"><code class="notranslate">gov.scot</code></li> <li class="list-inline-item"><code class="notranslate">gov.se</code></li> <li class="list-inline-item"><code class="notranslate">gov.sg</code></li> <li class="list-inline-item"><code class="notranslate">gov.si</code></li> <li class="list-inline-item"><code class="notranslate">gov.sk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.tr</code></li>
<li class="list-inline-item"><code class="notranslate">gov.tt</code></li>
<li class="list-inline-item"><code class="notranslate">gov.tw</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ua</code></li>
<li class="list-inline-item"><code class="notranslate">gov.uk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.vn</code></li>
<li class="list-inline-item"><code class="notranslate">gov.wales</code></li>
<li class="list-inline-item"><code class="notranslate">gov.za</code></li> <li class="list-inline-item"><code class="notranslate">government.pn</code></li> <li class="list-inline-item"><code class="notranslate">govt.nz</code></li> <!--<li class="list-inline-item"><code class="notranslate">gub.uy</code></li>--> <li class="list-inline-item"><code class="notranslate">gv.at</code></li> <li class="list-inline-item"><code class="notranslate">ac.uk</code></li> <li class="list-inline-item"><code class="notranslate">bl.uk</code></li> <li class="list-inline-item"><code class="notranslate">judiciary.uk</code></li> <li class="list-inline-item"><code class="notranslate">mod.uk</code></li> <li class="list-inline-item"><code class="notranslate">nhs.uk</code></li> <li class="list-inline-item"><code class="notranslate">parlamentet.uk</code></li> <li class="list-inline-item"><code class="notranslate">polisen.uk</code></li> <li class="list-inline-item"><code class="notranslate">rct.uk</code></li> <li class="list-inline-item"><code class="notranslate">royal.uk</code></li> <li class="list-inline-item"><code class="notranslate">sch.uk</code></li> <li class="list-inline-item"><code class="notranslate">ukaea.uk</code></li>
</ul>

Dessutom är dessa [varumärkes- och företagsdomäner för toppnivå](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) tillåtna som standard (t.ex. `apple` för `applecard.apple` för Apple Card-kontoutdrag):

<ul class="list-inline"> <li class="list-inline-item"><code class="notranslate">aaa</code></li> <li class="list-inline-item"><code class="notranslate">aarp</code></li> <li class="list-inline-item"><code class="notranslate">abarth</code></li> <li class="list-inline-item"><code class="notranslate">abb</code></li> <li class="list-inline-item"><code class="notranslate">abbott</code></li> <li class="list-inline-item"><code class="notranslate">abbvie</code></li> <li class="list-inline-item"><code class="notranslate">abc</code></li> <li class="list-inline-item"><code class="notranslate">accenture</code></li>
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
<li class="list-inline-item"><code class="notranslate">apple</code></li> <li class="list-inline-item"><code class="notranslate">akvarell</code></li> <li class="list-inline-item"><code class="notranslate">aramco</code></li> <li class="list-inline-item"><code class="notranslate">audi</code></li> <li class="list-inline-item"><code class="notranslate">auspost</code></li> <li class="list-inline-item"><code class="notranslate">aws</code></li> <li class="list-inline-item"><code class="notranslate">axa</code></li> <li class="list-inline-item"><code class="notranslate">azure</code></li> <li class="list-inline-item"><code class="notranslate">baidu</code></li> <li class="list-inline-item"><code class="notranslate">bananarepublic</code></li> <li class="list-inline-item"><code class="notranslate">barclaycard</code></li> <li class="list-inline-item"><code class="notranslate">barclays</code></li> <li class="list-inline-item"><code class="notranslate">basket</code></li> <li class="list-inline-item"><code class="notranslate">bauhaus</code></li> <li class="list-inline-item"><code class="notranslate">bbc</code></li> <li class="list-inline-item"><code class="notranslate">bbt</code></li> <li class="list-inline-item"><code class="notranslate">bbva</code></li> <li class="list-inline-item"><code class="notranslate">bcg</code></li> <li class="list-inline-item"><code class="notranslate">bentley</code></li> <li class="list-inline-item"><code class="notranslate">bharti</code></li> <li class="list-inline-item"><code class="notranslate">bing</code></li> <li class="list-inline-item"><code class="notranslate">vit</code></li> <li class="list-inline-item"><code class="notranslate">bloomberg</code></li> <li class="list-inline-item"><code class="notranslate">bms</code></li> <li class="list-inline-item"><code class="notranslate">BMW</code></li> <li class="list-inline-item"><code class="notranslate">bnl</code></li> <li class="list-inline-item"><code class="notranslate">bnpparibas</code></li> <li class="list-inline-item"><code class="notranslate">boehringer</code></li> <li class="list-inline-item"><code class="notranslate">bond</code></li> <li class="list-inline-item"><code class="notranslate">bokning</code></li> <li class="list-inline-item"><code class="notranslate">bosch</code></li> <li class="list-inline-item"><code class="notranslate">bostik</code></li> <li class="list-inline-item"><code class="notranslate">bradesco</code></li> <li class="list-inline-item"><code class="notranslate">bridgestone</code></li> <li class="list-inline-item"><code class="notranslate">brother</code></li> <li class="list-inline-item"><code class="notranslate">bugatti</code></li> <li class="list-inline-item"><code class="notranslate">cal</code></li> <li class="list-inline-item"><code class="notranslate">calvinklein</code></li> <li class="list-inline-item"><code class="notranslate">canon</code></li> <li class="list-inline-item"><code class="notranslate">capitalone</code></li> <li class="list-inline-item"><code class="notranslate">husvagn</code></li> <li class="list-inline-item"><code class="notranslate">cartier</code></li> <li class="list-inline-item"><code class="notranslate">cba</code></li> <li class="list-inline-item"><code class="notranslate">cbn</code></li> <li class="list-inline-item"><code class="notranslate">cbre</code></li> <li class="list-inline-item"><code class="notranslate">cbs</code></li> <li class="list-inline-item"><code class="notranslate">cern</code></li> <li class="list-inline-item"><code class="notranslate">cfa</code></li> <li class="list-inline-item"><code class="notranslate">Chanel</code></li> <li class="list-inline-item"><code class="notranslate">Chase</code></li> <li class="list-inline-item"><code class="notranslate">Chintai</code></li> <li class="list-inline-item"><code class="notranslate">Chrysler</code></li> <li class="list-inline-item"><code class="notranslate">Cipriani</code></li> <li class="list-inline-item"><code class="notranslate">Cisco</code></li> <li class="list-inline-item"><code class="notranslate">Citadel</code></li> <li class="list-inline-item"><code class="notranslate">citi</code></li> <li class="list-inline-item"><code class="notranslate">citic</code></li> <li class="list-inline-item"><code class="notranslate">clubmed</code></li> <li class="list-inline-item"><code class="notranslate">comcast</code></li> <li class="list-inline-item"><code class="notranslate">commbank</code></li> <li class="list-inline-item"><code class="notranslate">kreditförening</code></li> <li class="list-inline-item"><code class="notranslate">krona</code></li> <li class="list-inline-item"><code class="notranslate">crs</code></li> <li class="list-inline-item"><code class="notranslate">csc</code></li> <li class="list-inline-item"><code class="notranslate">cuisinella</code></li> <li class="list-inline-item"><code class="notranslate">dabur</code></li> <li class="list-inline-item"><code class="notranslate">datsun</code></li> <li class="list-inline-item"><code class="notranslate">återförsäljare</code></li> <li class="list-inline-item"><code class="notranslate">dell</code></li> <li class="list-inline-item"><code class="notranslate">deloitte</code></li> <li class="list-inline-item"><code class="notranslate">delta</code></li> <li class="list-inline-item"><code class="notranslate">dhl</code></li> <li class="list-inline-item"><code class="notranslate">upptäck</code></li> <li class="list-inline-item"><code class="notranslate">dish</code></li> <li class="list-inline-item"><code class="notranslate">dnp</code></li> <li class="list-inline-item"><code class="notranslate">dodge</code></li> <li class="list-inline-item"><code class="notranslate">dunlop</code></li> <li class="list-inline-item"><code class="notranslate">dupont</code></li> <li class="list-inline-item"><code class="notranslate">dvag</code></li> <li class="list-inline-item"><code class="notranslate">edeka</code></li> <li class="list-inline-item"><code class="notranslate">emerck</code></li> <li class="list-inline-item"><code class="notranslate">epson</code></li> <li class="list-inline-item"><code class="notranslate">ericsson</code></li> <li class="list-inline-item"><code class="notranslate">erni</code></li> <li class="list-inline-item"><code class="notranslate">försäkring</code></li> <li class="list-inline-item"><code class="notranslate">etisalat</code></li> <li class="list-inline-item"><code class="notranslate">eurovision</code></li> <li class="list-inline-item"><code class="notranslate">everbank</code></li> <li class="list-inline-item"><code class="notranslate">extraspace</code></li> <li class="list-inline-item"><code class="notranslate">fage</code></li> <li class="list-inline-item"><code class="notranslate">fairwinds</code></li> <li class="list-inline-item"><code class="notranslate">farmers</code></li> <li class="list-inline-item"><code class="notranslate">fedex</code></li> <li class="list-inline-item"><code class="notranslate">ferrari</code></li> <li class="list-inline-item"><code class="notranslate">ferrero</code></li> <li class="list-inline-item"><code class="notranslate">fiat</code></li> <li class="list-inline-item"><code class="notranslate">fidelity</code></li> <li class="list-inline-item"><code class="notranslate">firestone</code></li> <li class="list-inline-item"><code class="notranslate">firmdale</code></li> <li class="list-inline-item"><code class="notranslate">flickr</code></li> <li class="list-inline-item"><code class="notranslate">flir</code></li> <li class="list-inline-item"><code class="notranslate">flsmidth</code></li> <li class="list-inline-item"><code class="notranslate">ford</code></li> <li class="list-inline-item"><code class="notranslate">fox</code></li> <li class="list-inline-item"><code class="notranslate">fresenius</code></li> <li class="list-inline-item"><code class="notranslate">forex</code></li> <li class="list-inline-item"><code class="notranslate">frogans</code></li> <li class="list-inline-item"><code class="notranslate">frontier</code></li> <li class="list-inline-item"><code class="notranslate">fujitsu</code></li> <li class="list-inline-item"><code class="notranslate">fujixerox</code></li> <li class="list-inline-item"><code class="notranslate">gallo</code></li> <li class="list-inline-item"><code class="notranslate">gallup</code></li> <li class="list-inline-item"><code class="notranslate">gap</code></li> <li class="list-inline-item"><code class="notranslate">gbiz</code></li> <li class="list-inline-item"><code class="notranslate">gea</code></li> <li class="list-inline-item"><code class="notranslate">genting</code></li> <li class="list-inline-item"><code class="notranslate">givande</code></li> <li class="list-inline-item"><code class="notranslate">gle</code></li> <li class="list-inline-item"><code class="notranslate">globo</code></li> <li class="list-inline-item"><code class="notranslate">gmail</code></li>
<li class="list-inline-item"><code class="notranslate">gmo</code></li> <li class="list-inline-item"><code class="notranslate">gmx</code></li> <li class="list-inline-item"><code class="notranslate">godaddy</code></li> <li class="list-inline-item"><code class="notranslate">goldpoint</code></li> <li class="list-inline-item"><code class="notranslate">goodyear</code></li> <li class="list-inline-item"><code class="notranslate">goog</code></li> <li class="list-inline-item"><code class="notranslate">google</code></li> <li class="list-inline-item"><code class="notranslate">grainger</code></li> <li class="list-inline-item"><code class="notranslate">Guardian</code></li> <li class="list-inline-item"><code class="notranslate">Gucci</code></li> <li class="list-inline-item"><code class="notranslate">HBO</code></li> <li class="list-inline-item"><code class="notranslate">HDFC</code></li> <li class="list-inline-item"><code class="notranslate">HDFCBank</code></li> <li class="list-inline-item"><code class="notranslate">Hermes</code></li> <li class="list-inline-item"><code class="notranslate">Hisamitsu</code></li> <li class="list-inline-item"><code class="notranslate">Hitachi</code></li> <li class="list-inline-item"><code class="notranslate">hkt</code></li> <li class="list-inline-item"><code class="notranslate">honda</code></li> <li class="list-inline-item"><code class="notranslate">honeywell</code></li> <li class="list-inline-item"><code class="notranslate">hotmail</code></li> <li class="list-inline-item"><code class="notranslate">hsbc</code></li> <li class="list-inline-item"><code class="notranslate">hughes</code></li> <li class="list-inline-item"><code class="notranslate">hyatt</code></li> <li class="list-inline-item"><code class="notranslate">hyundai</code></li> <li class="list-inline-item"><code class="notranslate">ibm</code></li> <li class="list-inline-item"><code class="notranslate">ieee</code></li> <li class="list-inline-item"><code class="notranslate">ifm</code></li> <li class="list-inline-item"><code class="notranslate">ikano</code></li> <li class="list-inline-item"><code class="notranslate">imdb</code></li> <li class="list-inline-item"><code class="notranslate">infiniti</code></li> <li class="list-inline-item"><code class="notranslate">intel</code></li> <li class="list-inline-item"><code class="notranslate">intuit</code></li> <li class="list-inline-item"><code class="notranslate">ipiranga</code></li> <li class="list-inline-item"><code class="notranslate">iselect</code></li> <li class="list-inline-item"><code class="notranslate">Italien</code></li> <li class="list-inline-item"><code class="notranslate">itv</code></li> <li class="list-inline-item"><code class="notranslate">iveco</code></li> <li class="list-inline-item"><code class="notranslate">jaguar</code></li> <li class="list-inline-item"><code class="notranslate">java</code></li> <li class="list-inline-item"><code class="notranslate">jcb</code></li> <li class="list-inline-item"><code class="notranslate">jcp</code></li> <li class="list-inline-item"><code class="notranslate">jeep</code></li> <li class="list-inline-item"><code class="notranslate">jpmorgan</code></li> <li class="list-inline-item"><code class="notranslate">juniper</code></li> <li class="list-inline-item"><code class="notranslate">kddi</code></li> <li class="list-inline-item"><code class="notranslate">kerryhotels</code></li> <li class="list-inline-item"><code class="notranslate">kerrylogistics</code></li> <li class="list-inline-item"><code class="notranslate">kerryproperties</code></li> <li class="list-inline-item"><code class="notranslate">kfh</code></li> <li class="list-inline-item"><code class="notranslate">kia</code></li> <li class="list-inline-item"><code class="notranslate">kinder</code></li> <li class="list-inline-item"><code class="notranslate">kindle</code></li> <li class="list-inline-item"><code class="notranslate">komatsu</code></li> <li class="list-inline-item"><code class="notranslate">kpmg</code></li> <li class="list-inline-item"><code class="notranslate">kred</code></li> <li class="list-inline-item"><code class="notranslate">kuokgroup</code></li> <li class="list-inline-item"><code class="notranslate">lacaixa</code></li> <li class="list-inline-item"><code class="notranslate">ladbrokes</code></li> <li class="list-inline-item"><code class="notranslate">lamborghini</code></li> <li class="list-inline-item"><code class="notranslate">lancaster</code></li> <li class="list-inline-item"><code class="notranslate">lancia</code></li> <li class="list-inline-item"><code class="notranslate">lancome</code></li> <li class="list-inline-item"><code class="notranslate">landrover</code></li> <li class="list-inline-item"><code class="notranslate">lanxess</code></li> <li class="list-inline-item"><code class="notranslate">lasalle</code></li> <li class="list-inline-item"><code class="notranslate">latrobe</code></li> <li class="list-inline-item"><code class="notranslate">lds</code></li> <li class="list-inline-item"><code class="notranslate">leclerc</code></li> <li class="list-inline-item"><code class="notranslate">lego</code></li> <li class="list-inline-item"><code class="notranslate">liaison</code></li> <li class="list-inline-item"><code class="notranslate">lexus</code></li> <li class="list-inline-item"><code class="notranslate">lidl</code></li> <li class="list-inline-item"><code class="notranslate">livsstil</code></li> <li class="list-inline-item"><code class="notranslate">lilly</code></li> <li class="list-inline-item"><code class="notranslate">lincoln</code></li> <li class="list-inline-item"><code class="notranslate">linde</code></li> <li class="list-inline-item"><code class="notranslate">lipsy</code></li> <li class="list-inline-item"><code class="notranslate">lixil</code></li> <li class="list-inline-item"><code class="notranslate">locus</code></li> <li class="list-inline-item"><code class="notranslate">lotte</code></li> <li class="list-inline-item"><code class="notranslate">lpl</code></li> <li class="list-inline-item"><code class="notranslate">lplfinancial</code></li> <li class="list-inline-item"><code class="notranslate">lundbeck</code></li> <li class="list-inline-item"><code class="notranslate">lupin</code></li> <li class="list-inline-item"><code class="notranslate">macys</code></li> <li class="list-inline-item"><code class="notranslate">maif</code></li> <li class="list-inline-item"><code class="notranslate">man</code></li> <li class="list-inline-item"><code class="notranslate">mango</code></li> <li class="list-inline-item"><code class="notranslate">Marriott</code></li> <li class="list-inline-item"><code class="notranslate">Maserati</code></li> <li class="list-inline-item"><code class="notranslate">Mattel</code></li> <li class="list-inline-item"><code class="notranslate">McKinsey</code></li> <li class="list-inline-item"><code class="notranslate">MetLife</code></li> <li class="list-inline-item"><code class="notranslate">Microsoft</code></li> <li class="list-inline-item"><code class="notranslate">Mini</code></li> <li class="list-inline-item"><code class="notranslate">mit</code></li> <li class="list-inline-item"><code class="notranslate">mitsubishi</code></li> <li class="list-inline-item"><code class="notranslate">mlb</code></li> <li class="list-inline-item"><code class="notranslate">mma</code></li> <li class="list-inline-item"><code class="notranslate">monash</code></li> <li class="list-inline-item"><code class="notranslate">mormon</code></li> <li class="list-inline-item"><code class="notranslate">moto</code></li> <li class="list-inline-item"><code class="notranslate">movistar</code></li> <li class="list-inline-item"><code class="notranslate">msd</code></li> <li class="list-inline-item"><code class="notranslate">mtn</code></li> <li class="list-inline-item"><code class="notranslate">mtr</code></li> <li class="list-inline-item"><code class="notranslate">ömsesidig</code></li> <li class="list-inline-item"><code class="notranslate">nadex</code></li> <li class="list-inline-item"><code class="notranslate">rikstäckande</code></li> <li class="list-inline-item"><code class="notranslate">natura</code></ li> <li class="list-inline-item"><code class="notranslate">nba</code></li> <li class="list-inline-item"><code class="notranslate">nec</code></li> <li class="list-inline-item"><code class="notranslate">netflix</code></li> <li class="list-inline-item"><code class="notranslate">neustar</code></li> <li class="list-inline-item"><code class="notranslate">newholland</code></li> <li class="list-inline-item"><code class="notranslate">nfl</code></li> <li class="list-inline-item"><code class="notranslate">nhk</code></li> <li class="list-inline-item"><code class="notranslate">nico</code></li> <li class="list-inline-item"><code class="notranslate">nike</code></li> <li class="list-inline-item"><code class="notranslate">nikon</code></li> <li class="list-inline-item"><code class="notranslate">nissan</code></li> <li class="list-inline-item"><code class="notranslate">nissay</code></li> <li class="list-inline-item"><code class="notranslate">nokia</code></li> <li class="list-inline-item"><code class="notranslate">northwesternmutual</code></li> <li class="list-inline-item"><code class="notranslate">norton</code></li> <li class="list-inline-item"><code class="notranslate">nra</code></li> <li class="list-inline-item"><code class="notranslate">ntt</code></li> <li class="list-inline-item"><code class="notranslate">obi</code></li> <li class="list-inline-item"><code class="notranslate">office</code></li> <li class="list-inline-item"><code class="notranslate">omega</code></li> <li class="list-inline-item"><code class="notranslate">oracle</code></li> <li class="list-inline-item"><code class="notranslate">orange</code></li> <li class="list-inline-item"><code class="notranslate">otsuka</code></li> <!--<li class="list-inline-item"><code class="notranslate">ovh</code></li>--> <li class="list-inline-item"><code class="notranslate">panasonic</code></li>
<li class="list-inline-item"><code class="notranslate">pccw</code></li>
<li class="list-inline-item"><code class="notranslate">pfizer</code></li>
<li class="list-inline-item"><code class="notranslate">philips</code></li>
<li class="list-inline-item"><code class="notranslate">piaget</code></li>
<li class="list-inline-item"><code class="notranslate">pictet</code></li>
<li class="list-inline-item"><code class="notranslate">ping</code></li>
<li class="list-inline-item"><code class="notranslate">pioneer</code></li>
<li class="list-inline-item"><code class="notranslate">spela</code></li>
<li class="list-inline-item"><code class="notranslate">playstation</code></li>
<li class="list-inline-item"><code class="notranslate">pohl</code></li>
<li class="list-inline-item"><code class="notranslate">politik</code></li>
<li class="list-inline-item"><code class="notranslate">praxi</code></li>
<li class="list-inline-item"><code class="notranslate">prod</code></li>
<li class="list-inline-item"><code class="notranslate">progressiv</code></li>
<li class="list-inline-item"><code class="notranslate">pru</code></li>
<li class="list-inline-item"><code class="notranslate">prudential</code></li> <li class="list-inline-item"><code class="notranslate">pwc</code></li> <!--<li class="list-inline-item"><code class="notranslate">quest</code></li>--> <li class="list-inline-item"><code class="notranslate">qvc</code></li> <li class="list-inline-item"><code class="notranslate">redstone</code></li> <li class="list-inline-item"><code class="notranslate">reliance</code></li> <li class="list-inline-item"><code class="notranslate">rexroth</code></li> <li class="list-inline-item"><code class="notranslate">ricoh</code></li> <li class="list-inline-item"><code class="notranslate">säkerhet</code></li> <li class="list-inline-item"><code class="notranslate">rocher</code></li> <li class="list-inline-item"><code class="notranslate">rogers</code></li> <li class="list-inline-item"><code class="notranslate">rwe</code></li> <li class="list-inline-item"><code class="notranslate">säkerhet</code></li> <li class="list-inline-item"><code class="notranslate">sakura</code></li> <li class="list-inline-item"><code class="notranslate">samsung</code></li> <li class="list-inline-item"><code class="notranslate">sandvik</code></li> <li class="list-inline-item"><code class="notranslate">sandvikcoromant</code></li> <li class="list-inline-item"><code class="notranslate">sanofi</code></li> <li class="list-inline-item"><code class="notranslate">sap</code></li> <li class="list-inline-item"><code class="notranslate">saxo</code></li> <li class="list-inline-item"><code class="notranslate">sbi</code></li> <!--<li class="list-inline-item"><code class="notranslate">sbs</code></li>--> <li class="list-inline-item"><code class="notranslate">sca</code></li> <li class="list-inline-item"><code class="notranslate">scb</code></li> <li class="list-inline-item"><code class="notranslate">Schaeffler</code></li> <li class="list-inline-item"><code class="notranslate">Schmidt</code></li> <li class="list-inline-item"><code class="notranslate">Schwarz</code></li> <li class="list-inline-item"><code class="notranslate">SchoolJohnson</code></li> <li class="list-inline-item"><code class="notranslate">Scor</code></li> <li class="list-inline-item"><code class="notranslate">Säte</code></li> <li class="list-inline-item"><code class="notranslate">Sener</code></li> <li class="list-inline-item"><code class="notranslate">Ses</code></li> <li class="list-inline-item"><code class="notranslate">sy</code></li> <li class="list-inline-item"><code class="notranslate">sju</code></li> <li class="list-inline-item"><code class="notranslate">sfr</code></li> <li class="list-inline-item"><code class="notranslate">sök</code></li> <li class="list-inline-item"><code class="notranslate">sharp</code></li> <li class="list-inline-item"><code class="notranslate">shaw</code></li> <li class="list-inline-item"><code class="notranslate">snäckskal</code></li> <li class="list-inline-item"><code class="notranslate">shriram</code></li>
<li class="list-inline-item"><code class="notranslate">sina</code></li> <li class="list-inline-item"><code class="notranslate">sky</code></li> <li class="list-inline-item"><code class="notranslate">skype</code></li> <li class="list-inline-item"><code class="notranslate">smart</code></li> <li class="list-inline-item"><code class="notranslate">sncf</code></li> <li class="list-inline-item"><code class="notranslate">softbank</code></li> <li class="list-inline-item"><code class="notranslate">sohu</code></li> <li class="list-inline-item"><code class="notranslate">sony</code></li> <li class="list-inline-item"><code class="notranslate">spegel</code></li> <li class="list-inline-item"><code class="notranslate">stada</code></li> <li class="list-inline-item"><code class="notranslate">häftklamrar</code></li> <li class="list-inline-item"><code class="notranslate">stjärna</code></li> <li class="list-inline-item"><code class="notranslate">stjärnhub</code></li> <li class="list-inline-item"><code class="notranslate">statsbank</code></li> <li class="list-inline-item"><code class="notranslate">statsfarm</code></li> <li class="list-inline-item"><code class="notranslate">statoil</code></li> <li class="list-inline-item"><code class="notranslate">stc</code></li> <li class="list-inline-item"><code class="notranslate">stcgroup</code></li> <li class="list-inline-item"><code class="notranslate">suzuki</code></li> <li class="list-inline-item"><code class="notranslate">swatch</code></li> <li class="list-inline-item"><code class="notranslate">swintcover</code></li> <li class="list-inline-item"><code class="notranslate">symantec</code></li> <li class="list-inline-item"><code class="notranslate">taobao</code></li> <li class="list-inline-item"><code class="notranslate">target</code></li> <li class="list-inline-item"><code class="notranslate">tatamotors</code></li> <li class="list-inline-item"><code class="notranslate">tdk</code></li> <li class="list-inline-item"><code class="notranslate">telecity</code></li> <li class="list-inline-item"><code class="notranslate">telefonica</code></li> <li class="list-inline-item"><code class="notranslate">temasek</code></li> <li class="list-inline-item"><code class="notranslate">teva</code></li> <li class="list-inline-item"><code class="notranslate">tiffany</code></li> <li class="list-inline-item"><code class="notranslate">tjx</code></li> <li class="list-inline-item"><code class="notranslate">Toray</code></li> <li class="list-inline-item"><code class="notranslate">Toshiba</code></li> <li class="list-inline-item"><code class="notranslate">totalt</code></li> <li class="list-inline-item"><code class="notranslate">Toyota</code></li> <li class="list-inline-item"><code class="notranslate">travelchannel</code></li> <li class="list-inline-item"><code class="notranslate">resenärer</code></li> <li class="list-inline-item"><code class="notranslate">tui</code></li> <li class="list-inline-item"><code class="notranslate">TV-apparater</code></li> <li class="list-inline-item"><code class="notranslate">ubs</code></li> <li class="list-inline-item"><code class="notranslate">unicom</code></li> <li class="list-inline-item"><code class="notranslate">uol</code></li> <li class="list-inline-item"><code class="notranslate">ups</code></li> <li class="list-inline-item"><code class="notranslate">vanguard</code></li> <li class="list-inline-item"><code class="notranslate">verisign</code></li> <li class="list-inline-item"><code class="notranslate">vig</code></li> <li class="list-inline-item"><code class="notranslate">viking</code></li> <li class="list-inline-item"><code class="notranslate">jungfru</code></li>
<li class="list-inline-item"><code class="notranslate">Visa</code></li>
<li class="list-inline-item"><code class="notranslate">Vista</code></li>
<li class="list-inline-item"><code class="notranslate">Vistaprint</code></li>
<li class="list-inline-item"><code class="notranslate">Vivo</code></li>
<li class="list-inline-item"><code class="notranslate">Volvo</code></li>
<li class="list-inline-item"><code class="notranslate">Volvo</code></li>
<li class="list-inline-item"><code class="notranslate">Walmart</code></li>
<li class="list-inline-item"><code class="notranslate">Walter</code></li>
<li class="list-inline-item"><code class="notranslate">väderkanal</code></li>
<li class="list-inline-item"><code class="notranslate">weber</code></li>
<li class="list-inline-item"><code class="notranslate">damm</code></li>
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

Från och med den 18 mars 2025 har vi även lagt till dessa franska utomeuropeiska territorier i den här listan ([enligt denna GitHub-förfrågan](https://github.com/forwardemail/forwardemail.net/issues/327)):

<ul class="list-inline"> <li class="list-inline-item"><code class="notranslate">bzh</code></li> <li class="list-inline-item"><code class="notranslate">gf</code></li> <li class="list-inline-item"><code class="notranslate">gp</code></li> <li class="list-inline-item"><code class="notranslate">mq</code></li> <li class="list-inline-item"><code class="notranslate">nc</code></li> <li class="list-inline-item"><code class="notranslate">pf</code></li> <li class="list-inline-item"><code class="notranslate">pm</code></li> <li class="list-inline-item"><code class="notranslate">re</code></li> <li class="list-inline-item"><code class="notranslate">tf</code></li>
<li class="list-inline-item"><code class="notranslate">wf</code></li>
<li class="list-inline-item"><code class="notranslate">yt</code></li>
</ul>

Från och med den 8 juli 2025 har vi lagt till dessa Europaspecifika länder:

<ul class="list-inline"> <li class="list-inline-item"><code class="notranslate">ax</code></li> <li class="list-inline-item"><code class="notranslate">bg</code></li> <li class="list-inline-item"><code class="notranslate">fo</code></li> <li class="list-inline-item"><code class="notranslate">gi</code></li> <li class="list-inline-item"><code class="notranslate">gr</code></li> <li class="list-inline-item"><code class="notranslate">timme</code></li> <li class="list-inline-item"><code class="notranslate">hu</code></li> <li class="list-inline-item"><code class="notranslate">lt</code></li> <li class="list-inline-item"><code class="notranslate">lu</code></li>
<li class="list-inline-item"><code class="notranslate">mc</code></li>
<li class="list-inline-item"><code class="notranslate">mk</code></li>
<li class="list-inline-item"><code class="notranslate">mt</code></li>
<li class="list-inline-item"><code class="notranslate">ro</code></li>
<li class="list-inline-item"><code class="notranslate">sk</code></li>
<li class="list-inline-item"><code class="notranslate">va</code></li>
</ul>

Vi inkluderade specifikt inte `cz`, `ru` och `ua` på grund av hög spamaktivitet.

### Vilka är dina kriterier för godkännandelistan {#what-is-your-allowlist-criteria}

Vi har en statisk lista med [domännamnstillägg tillåtna som standard](#what-domain-name-extensions-are-allowlisted-by-default) – och vi underhåller även en dynamisk, cachad, rullande tillåtelselista baserad på följande strikta kriterier:

* Avsändarens rotdomän måste vara av en [domännamnstillägg som matchar listan vi erbjuder i vår gratisplan](#what-domain-name-extensions-can-be-used-for-free) (med tillägg av `biz` och `info`). Vi inkluderar även `edu`, `gov` och `mil` delvisa matchningar, såsom `xyz.gov.au` och `xyz.edu.au`.

* Avsändarens rotdomän måste vara bland de 100 000 bästa unika rotdomänerna som analyserats i [Paraply popularitetslista](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL").

* Avsändarens rotdomän måste vara bland de 50 000 bästa resultaten från unika rotdomäner som förekommer i minst 4 av de senaste 7 dagarna av UPL:er (\~50%+).

* Avsändarens rotdomän får inte vara [kategoriserad](https://radar.cloudflare.com/categorization-feedback/) klassad som vuxeninnehåll eller skadlig kod av Cloudflare.

* Avsändarens rotdomän måste ha antingen A- eller MX-poster angivna.

* Avsändarens rotdomän måste ha antingen A-post(er), MX-post(er), DMARC-post med `p=reject` eller `p=quarantine`, eller en SPF-post med kvalificeringen `-all` eller `~all`.

Om detta kriterium är uppfyllt kommer avsändarens rotdomän att cacha i 7 dagar. Observera att vårt automatiserade jobb körs dagligen – därför är detta en rullande cache för tillåtelselistan som uppdateras dagligen.

Vårt automatiserade jobb kommer att ladda ner de senaste 7 dagarna av UPL:er i minnet, packa upp dem och sedan analysera dem i minnet enligt de strikta kriterierna ovan.

Populära domäner vid tidpunkten för detta skrivande, såsom Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify och fler – ingår naturligtvis.

Om du är en avsändare som inte finns med på vår godkännandelista, kommer du att vara [begränsad hastighet](#do-you-have-rate-limiting) och [grålistad](#do-you-have-a-greylist) första gången din FQDN-rotdomän eller IP-adress skickar ett e-postmeddelande. Observera att detta är standardpraxis som antagits som en e-poststandard. De flesta e-postserverklienter kommer att försöka igen om de får ett hastighetsgräns- eller grålistfel (t.ex. en felkod på nivå 421 eller 4xx).

**Observera att specifika avsändare som `a@gmail.com`, `b@xyz.edu` och `c@gov.au` fortfarande kan vara [nekad lista](#do-you-have-a-denylist)** (t.ex. om vi automatiskt upptäcker skräppost, nätfiske eller skadlig kod från dessa avsändare).**

### Vilka domännamnstillägg kan användas gratis {#what-domain-name-extensions-can-be-used-for-free}

Från och med den 31 mars 2023 har vi infört en ny generell spamregel för att skydda våra användare och vår tjänst.

Denna nya regel tillåter endast följande domännamnstillägg att användas i vår gratisplan:

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">ac</code></li>
<li class="list-inline-item"><code class="notranslate">ad</code></li>
<li class="list-inline-item"><code class="notranslate">ag</code></li>
<li class="list-inline-item"><code class="notranslate">ai</code></li>
<li class="list-inline-item"><code class="notranslate">al</code></li>
<li class="list-inline-item"><code class="notranslate">am</code></li>
<li class="list-inline-item"><code class="notranslate">app</code></li>
<li class="list-inline-item"><code class="notranslate">as</code></li>
<li class="list-inline-item"><code class="notranslate">at</code></li> <li class="list-inline-item"><code class="notranslate">au</code></li> <li class="list-inline-item"><code class="notranslate">ba</code></li> <li class="list-inline-item"><code class="notranslate">vara</code></li> <li class="list-inline-item"><code class="notranslate">br</code></li> <li class="list-inline-item"><code class="notranslate">av</code></li> <li class="list-inline-item"><code class="notranslate">ca</code></li> <li class="list-inline-item"><code class="notranslate">cc</code></li> <li class="list-inline-item"><code class="notranslate">cd</code></li> <li class="list-inline-item"><code class="notranslate">ch</code></li> <li class="list-inline-item"><code class="notranslate">ck</code></li> <li class="list-inline-item"><code class="notranslate">co</code></li> <li class="list-inline-item"><code class="notranslate">com</code></li> <li class="list-inline-item"><code class="notranslate">de</code></li> <li class="list-inline-item"><code class="notranslate">dev</code></li> <li class="list-inline-item"><code class="notranslate">dj</code></li> <li class="list-inline-item"><code class="notranslate">dk</code></li> <li class="list-inline-item"><code class="notranslate">ee</code></li> <li class="list-inline-item"><code class="notranslate">es</code></li> <li class="list-inline-item"><code class="notranslate">eu</code></li> <li class="list-inline-item"><code class="notranslate">family</code></li> <li class="list-inline-item"><code class="notranslate">fi</code></li> <li class="list-inline-item"><code class="notranslate">fm</code></li> <li class="list-inline-item"><code class="notranslate">fr</code></li> <li class="list-inline-item"><code class="notranslate">gg</code></li> <li class="list-inline-item"><code class="notranslate">gl</code></li> <li class="list-inline-item"><code class="notranslate">id</code></li> <li class="list-inline-item"><code class="notranslate">ie</code></li> <li class="list-inline-item"><code class="notranslate">il</code></li> <li class="list-inline-item"><code class="notranslate">im</code></li> <li class="list-inline-item"><code class="notranslate">in</code></li> <li class="list-inline-item"><code class="notranslate">io</code></li> <li class="list-inline-item"><code class="notranslate">ir</code></li> <li class="list-inline-item"><code class="notranslate">är</code></li> <li class="list-inline-item"><code class="notranslate">det</code></li> <li class="list-inline-item"><code class="notranslate">ja</code></li> <li class="list-inline-item"><code class="notranslate">jp</code></li> <li class="list-inline-item"><code class="notranslate">ke</code></li> <li class="list-inline-item"><code class="notranslate">kr</code></li> <li class="list-inline-item"><code class="notranslate">la</code></li> <li class="list-inline-item"><code class="notranslate">li</code></li> <li class="list-inline-item"><code class="notranslate">lv</code></li> <li class="list-inline-item"><code class="notranslate">ly</code></li> <li class="list-inline-item"><code class="notranslate">md</code></li> <li class="list-inline-item"><code class="notranslate">me</code></li> <li class="list-inline-item"><code class="notranslate">mn</code></li> <li class="list-inline-item"><code class="notranslate">ms</code></li> <li class="list-inline-item"><code class="notranslate">mu</code></li> <li class="list-inline-item"><code class="notranslate">mx</code></li> <li class="list-inline-item"><code class="notranslate">net</code></li> <li class="list-inline-item"><code class="notranslate">ni</code></li> <li class="list-inline-item"><code class="notranslate">nl</code></li> <li class="list-inline-item"><code class="notranslate">nej</code></li> <li class="list-inline-item"><code class="notranslate">nu</code></li> <li class="list-inline-item"><code class="notranslate">nz</code></li> <li class="list-inline-item"><code class="notranslate">org</code></li> <li class="list-inline-item"><code class="notranslate">pl</code></li> <li class="list-inline-item"><code class="notranslate">pr</code></li> <li class="list-inline-item"><code class="notranslate">pt</code></li> <li class="list-inline-item"><code class="notranslate">pw</code></li> <li class="list-inline-item"><code class="notranslate">rs</code></li> <li class="list-inline-item"><code class="notranslate">sc</code></li> <li class="list-inline-item"><code class="notranslate">se</code></li> <li class="list-inline-item"><code class="notranslate">sh</code></li> <li class="list-inline-item"><code class="notranslate">si</code></li> <li class="list-inline-item"><code class="notranslate">sm</code></li> <li class="list-inline-item"><code class="notranslate">sr</code></li> <li class="list-inline-item"><code class="notranslate">st</code></li> <li class="list-inline-item"><code class="notranslate">tc</code></li> <li class="list-inline-item"><code class="notranslate">tm</code></li> <li class="list-inline-item"><code class="notranslate">till</code></li> <li class="list-inline-item"><code class="notranslate">tv</code></li> <li class="list-inline-item"><code class="notranslate">uk</code></li> <li class="list-inline-item"><code class="notranslate">us</code></li> <li class="list-inline-item"><code class="notranslate">uz</code></li> <li class="list-inline-item"><code class="notranslate">vc</code></li> <li class="list-inline-item"><code class="notranslate">vg</code></li>
<li class="list-inline-item"><code class="notranslate">vu</code></li>
<li class="list-inline-item"><code class="notranslate">ws</code></li>
<li class="list-inline-item"><code class="notranslate">xyz</code></li>
<li class="list-inline-item"><code class="notranslate">za</code></li>
</ul>

### Har du en grålista {#do-you-have-a-greylist}

Ja, vi har en väldigt slapp [grålistning av e-post](https://en.wikipedia.org/wiki/Greylisting_\(email\)) policy. Grålistning gäller endast för avsändare som inte finns på vår godkännandelista och lagras i vår cache i 30 dagar.

För alla nya avsändare lagrar vi en nyckel i vår Redis-databas i 30 dagar med ett värde satt till den ursprungliga ankomsttiden för deras första begäran. Vi avvisar sedan deras e-postmeddelande med statuskoden 450 för återförsök och tillåter det bara att passera när det har gått 5 minuter.

Om de har väntat i 5 minuter från denna ursprungliga ankomsttid kommer deras e-postmeddelanden att accepteras och de kommer inte att få denna 450-statuskod.

Nyckeln består antingen av FQDN-rotdomänen eller avsändarens IP-adress. Det betyder att alla underdomäner som passerar grålistan också kommer att passera för rotdomänen, och vice versa (detta är vad vi menar med en "väldigt slapp" policy).

Om till exempel ett e-postmeddelande kommer från `test.example.com` innan vi ser ett e-postmeddelande komma från `example.com`, då måste alla e-postmeddelanden från `test.example.com` och/eller `example.com` vänta 5 minuter från anslutningens ursprungliga ankomsttid. Vi låter inte både `test.example.com` och `example.com` vänta sina egna 5-minutersperioder (vår grålistningspolicy gäller på rotdomännivå).

Observera att grålistning inte gäller någon avsändare på vår [tillåtelselista](#do-you-have-an-allowlist) (t.ex. Meta, Amazon, Netflix, Google, Microsoft i skrivande stund).

### Har du en avvisningslista {#do-you-have-a-denylist}

Ja, vi använder vår egen lista över nekade abonnemang och uppdaterar den automatiskt i realtid och manuellt baserat på upptäckt skräppost och skadlig aktivitet.

Vi hämtar också alla IP-adresser från UCEPROTECT nivå 1-avvisningslistan på <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> varje timme och matar in dem i vår avvisningslista med en utgångsdatum på 7 dagar.

Avsändare som hittas i nekallistan får felkoden 421 (indikerar att avsändaren ska försöka igen senare) om de [är inte tillåtna på listan](#do-you-have-an-allowlist).

Genom att använda en statuskod 421 istället för en statuskod 554 kan potentiella falska positiva resultat undvikas i realtid och meddelandet kan sedan levereras vid nästa försök.

**Detta är utformat till skillnad från andra e-posttjänster**, där om du hamnar på en blockeringslista uppstår ett permanent fel. Det är ofta svårt att be avsändare att försöka skicka meddelanden igen (särskilt från stora organisationer), och därför ger den här metoden ungefär 5 dagar från det första e-postförsöket för antingen avsändaren, mottagaren eller oss att ingripa och åtgärda problemet (genom att begära borttagning från blockeringslistan).

Alla begäranden om borttagning från avvisningslista övervakas i realtid av administratörer (t.ex. så att återkommande falska positiva resultat permanent kan tillåtas av administratörer).

Begäran om borttagning från avvisningslista kan begäras på <https://forwardemail.net/denylist>. Betalda användares begäran om borttagning från avvisningslista behandlas omedelbart, medan icke-betalda användare måste vänta på att administratörer ska behandla deras begäran.

Avsändare som upptäcks skicka skräppost eller virusinnehåll läggs till i nekallistan på följande sätt:

1. [fingeravtryck för första meddelandet](#how-do-you-determine-an-email-fingerprint) grålistas vid upptäckt av skräppost eller blockeringslista från en "betrodd" avsändare (t.ex. `gmail.com`, `microsoft.com`, `apple.com`).
* Om avsändaren var tillåten grålistas meddelandet i 1 timme.
* Om avsändaren inte är tillåten grålistas meddelandet i 6 timmar.

2. Vi analyserar nekningslistanycklar från information från avsändaren och meddelandet, och för var och en av dessa nycklar skapar vi (om en inte redan finns) en räknare, ökar den med 1 och cachar den i 24 timmar.
* För avsändare på godkännandelistan:
* Lägg till en nyckel för kuvertets e-postadress "MAIL FROM" om den hade godkänd SPF eller ingen SPF, och den inte var [ett postmaster användarnamn](#what-are-postmaster-addresses) eller [ett användarnamn utan svar](#what-are-no-reply-addresses).
* Om "Från"-rubriken var godkänd, lägg då till en nyckel för "Från"-rubrikens e-postadress om den hade godkänd SPF eller godkänd och justerad DKIM.
* Om "Från"-rubriken inte var godkänd, lägg då till en nyckel för "Från"-rubrikens e-postadress och dess rotparsade domännamn.
* För avsändare som inte är godkända:
* Lägg till en nyckel för kuvertets e-postadress "MAIL FROM" om den hade godkänd SPF.
* Om "Från"-rubriken var godkänd, lägg då till en nyckel för "Från"-rubrikens e-postadress om den hade godkänd SPF eller godkänd och justerad DKIM.
* Om "Från"-rubriken inte var godkänd, lägg då till en nyckel för "Från"-rubrikens e-postadress och dess rotparsade domännamn.
* Lägg till en nyckel för avsändarens fjärr-IP-adress.
* Lägg till en nyckel för klientens värdnamn genom omvänd sökning från avsändarens IP-adress (om sådan finns).
* Lägg till en nyckel för rotdomänen för klientens värdnamn (om sådan finns, och om den skiljer sig från klientens värdnamn).

3. Om räknaren når 5 för en avsändare och nyckel som inte finns på godkännandelistan, nekar vi nyckeln i 30 dagar och ett e-postmeddelande skickas till vårt missbruksteam. Dessa siffror kan ändras och uppdateringar kommer att visas här när vi övervakar missbruk.

4. Om räknaren når 10 för en avsändare och nyckel som finns på godkännandelistan, nekar vi nyckeln i 7 dagar och ett e-postmeddelande skickas till vårt missbruksteam. Dessa siffror kan ändras och uppdateringar kommer att visas här när vi övervakar missbruk.

> **OBS:** Inom en snar framtid kommer vi att introducera ryktesövervakning. Ryktesövervakningen kommer istället att beräkna när en avsändare ska nekas baserat på en procentuell tröskel (i motsats till en rudimentär räknare som nämnts ovan).

### Har du en hastighetsbegränsning {#do-you-have-rate-limiting}

Begränsningen av avsändarhastigheten sker antingen via rotdomänen som analyserats från en omvänd PTR-sökning på avsändarens IP-adress – eller om det inte ger något resultat används helt enkelt avsändarens IP-adress. Observera att vi refererar till detta som `Sender` nedan.

Våra MX-servrar har dagliga gränser för inkommande e-post som tas emot för [krypterad IMAP-lagring](/blog/docs/best-quantum-safe-encrypted-email-service):

* Istället för att begränsa sändningshastigheten för inkommande e-post som tas emot på individuella alias (t.ex. `you@yourdomain.com`) – begränsar vi sändningshastigheten utifrån aliaset själva domännamnet (t.ex. `yourdomain.com`). Detta förhindrar att `Senders` översvämmar inkorgarna för alla alias i din domän samtidigt.

* Vi har generella gränser som gäller för alla `Senders` i vår tjänst oavsett mottagare:

* `Senders` som vi anser vara "betrodda" som en sanningskälla (t.ex. `gmail.com`, `microsoft.com`, `apple.com`) är begränsade till att skicka 100 GB per dag.

* `Senders` som är [tillåten på listan](#do-you-have-an-allowlist) är begränsade till att skicka 10 GB per dag.
* Alla andra `Senders` är begränsade till att skicka 1 GB och/eller 1000 meddelanden per dag.
* Vi har en specifik gräns per `Sender` och `yourdomain.com` på 1 GB och/eller 1000 meddelanden dagligen.

MX-servrarna begränsar också vidarebefordran av meddelanden till en eller flera mottagare genom hastighetsbegränsning – men detta gäller endast `Senders` som inte är på [tillåtelselista](#do-you-have-an-allowlist):

* Vi tillåter endast upp till 100 anslutningar per timme, per `Sender` upplöst FQDN-rotdomän (eller) `Sender` fjärr-IP-adress (om ingen omvänd PTR är tillgänglig), och per kuvertmottagare. Vi lagrar nyckeln för hastighetsbegränsning som en kryptografisk hash i vår Redis-databas.

* Om du skickar e-post via vårt system, se till att du har konfigurerat en omvänd PTR för alla dina IP-adresser (annars kommer varje unik FQDN-rotdomän eller IP-adress du skickar från att vara hastighetsbegränsad).

* Observera att om du skickar via ett populärt system som Amazon SES, så kommer du inte att vara begränsad i hastighet eftersom (i skrivande stund) Amazon SES finns med i vår godkännandelista.

* Om du skickar från en domän som `test.abc.123.example.com`, kommer hastighetsgränsen att gälla för `example.com`. Många spammare använder hundratals underdomäner för att kringgå vanliga spamfilter som bara hastighetsbegränsar unika värdnamn i motsats till unika FQDN-rotdomäner.

* `Senders` som överskrider hastighetsgränsen kommer att avvisas med ett 421-fel.

Våra IMAP- och SMTP-servrar begränsar dina alias från att ha fler än `60` samtidiga anslutningar.

Våra MX-servrar begränsar [inte tillåten på listan](#do-you-have-an-allowlist) avsändare från att upprätta fler än 10 samtidiga anslutningar (med ett cache-utgångsdatum på 3 minuter för räknaren, vilket speglar vår socket-timeout på 3 minuter).

### Hur skyddar man sig mot bakåtspridning {#how-do-you-protect-against-backscatter}

Felriktade studsar eller bounce spam (känt som "[Backscatter](https://en.wikipedia.org/wiki/Backscatter_\(email\))") kan orsaka negativt rykte för avsändarens IP-adresser.

Vi vidtar två steg för att skydda mot bakåtspridning, vilket beskrivs i följande avsnitt [Förhindra studsar från kända E-POSTFRÅN-spammare](#prevent-bounces-from-known-mail-from-spammers) och [Förhindra onödiga studsar för att skydda mot bakåtspridning](#prevent-unnecessary-bounces-to-protect-against-backscatter) nedan.

### Förhindra studsar från kända E-POST FRÅN spammare {#prevent-bounces-from-known-mail-from-spammers}

Vi hämtar listan från [Backscatter.org](https://www.backscatterer.org/) (drivs av [UCEPROTECT](https://www.uceprotect.net/)) på <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> varje timme och matar in den i vår Redis-databas (vi jämför också skillnaden i förväg; ifall några IP-adresser har tagits bort som behöver respekteras).

Om MAIL FRÅN är tomt ELLER är lika med (skiftlägesokänsligt) någon av [postmästaradresser](#what-are-postmaster-addresses) (delen före @ i ett e-postmeddelande), kontrollerar vi om avsändarens IP-adress matchar någon från den här listan.

Om avsändarens IP-adress finns med i listan (och inte finns i vår [tillåtelselista](#do-you-have-an-allowlist)) skickar vi ett 554-fel med meddelandet `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`. Vi får ett meddelande om en avsändare finns både på Backscatterer-listan och i vår tillåtelselista så att vi kan lösa problemet om det behövs.

Teknikerna som beskrivs i det här avsnittet följer rekommendationen "SAFE MODE" på <https://www.backscatterer.org/?target=usage> – där vi bara kontrollerar avsändarens IP-adress om vissa villkor redan är uppfyllda.

### Förhindra onödiga studsar för att skydda mot bakåtspridning {#prevent-unnecessary-bounces-to-protect-against-backscatter}

Avvisade e-postmeddelanden är e-postmeddelanden som indikerar att vidarebefordran av e-post till mottagaren misslyckades helt och att e-postmeddelandet inte kommer att skickas igen.

En vanlig anledning till att man hamnar på Backscatterer-listan är felriktade studsar eller bounce spam, så vi måste skydda oss mot detta på några sätt:

1. Vi skickar endast när >= 500 statuskodfel uppstår (när e-postmeddelanden som försökts vidarebefordras har misslyckats, t.ex. Gmail svarar med ett fel på nivå 500).

2. Vi skickar bara en gång och endast en gång (vi använder en beräknad studsfingeravtrycksnyckel och lagrar den i cachen för att förhindra att dubbletter skickas). Stödfingeravtrycket är en nyckel som är meddelandets fingeravtryck kombinerat med en hash av studsadressen och dess felkod). Se avsnittet om [Fingeravtryck](#how-do-you-determine-an-email-fingerprint) för mer insikt i hur meddelandets fingeravtryck beräknas. Skickade studsfingeravtryck upphör att gälla efter 7 dagar i vår Redis-cache.

3. Vi skickar bara när MAIL FRÅN och/eller Från inte är tomma och inte innehåller (skiftlägeskänsligt) en [postmaster användarnamn](#what-are-postmaster-addresses) (delen före @ i ett e-postmeddelande).

4. Vi skickar inte om det ursprungliga meddelandet hade någon av följande rubriker (skiftlägeskänsligt):

* Rubrik för `auto-submitted` med ett värde som inte är lika med `no`. * Rubrik för `x-auto-response-suppress` med värdet `dr`, `autoreply`, `auto-reply`, `auto_reply` eller `all`
* Rubrik för `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply` `x-autorespond`, eller `x-auto-respond` (oavsett värde).
* Rubrik för `precedence` med värdet `bulk`, `autoreply`, `auto-reply`, `auto_reply`, eller `list`.

5. Vi skickar inte om e-postadressen MAIL FRÅN eller Från slutar med `+donotreply`, `-donotreply`, `+noreply` eller `-noreply`.

6. Vi skickar inte om delen med användarnamnet i e-postadressen "Från" var `mdaemon` och den hade en rubrik med `X-MDDSN-Message` som inte känsligt för gemener och versaler.

7. Vi skickar inte om det fanns en `content-type`-rubrik som inte är skiftlägeskänslig för `multipart/report`.

### Hur avgör man ett e-postfingeravtryck {#how-do-you-determine-an-email-fingerprint}

Ett e-postmeddelandes fingeravtryck används för att avgöra hur unikt det är och för att förhindra att dubbletter av meddelanden levereras och att [duplicerade avvisningar](#prevent-unnecessary-bounces-to-protect-against-backscatter) skickas.

Fingeravtrycket beräknas från följande lista:

* Klientens lösta FQDN-värdnamn eller IP-adress
* `Message-ID` headervärde (om sådant finns)
* `Date` headervärde (om sådant finns)
* `From` headervärde (om sådant finns)
* `To` headervärde (om sådant finns)
* `Cc` headervärde (om sådant finns)
* `Subject` headervärde (om sådant finns)
* `Body` värde (om sådant finns)

### Kan jag vidarebefordra e-postmeddelanden till andra portar än 25 (t.ex. om min internetleverantör har blockerat port 25) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Ja, från och med den 5 maj 2020 har vi lagt till den här funktionen. Just nu är funktionen domänspecifik, till skillnad från aliasspecifik. Om du behöver aliasspecifikt, vänligen kontakta oss för att informera oss om dina behov.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Förbättrat integritetsskydd:
</strong>
<span>
Om du har ett betalt abonnemang (som har förbättrat integritetsskydd) går du till <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a>, klickar på "Konfigurera" bredvid din domän och klickar sedan på "Inställningar". Om du vill veta mer om betalda abonnemang kan du se vår <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Prissättningssida</a>. Annars kan du fortsätta att följa instruktionerna nedan.
</span>
</div>

Om du har gratisplanen lägger du helt enkelt till en ny DNS-<strong class="notranslate">TXT</strong>-post som visas nedan, men ändra porten från 25 till den port du väljer.

Om jag till exempel vill att alla e-postmeddelanden som går till `example.com` ska vidarebefordras till aliasmottagarens SMTP-port 1337 istället för 25:

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Namn/Värd/Alias</th> <th class="text-center">TTL</th> <th>Typ</th> <th>Svar/Värde</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email-port=1337</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
Det vanligaste scenariot för anpassad portvidarebefordran är när du vill vidarebefordra alla e-postmeddelanden som går till example.com till en annan port på example.com, annan än SMTP-standarden för port 25. För att konfigurera detta, lägg helt enkelt till följande <strong class="notranslate">TXT</strong> catch-all-post.
<span>
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Namn/Värd/Alias</th> <th class="text-center">TTL</th> <th>Typ</th> <th>Svar/Värde</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=example.com</code></td> </tr> </tbody>
</table>

### Stöder den plustecknet + för Gmail-alias {#does-it-support-the-plus--symbol-for-gmail-aliases}

Ja, absolut.

### Stöder den underdomäner {#does-it-support-sub-domains}

Ja, absolut. Istället för att använda "@", "." eller blankt som namn/värd/alias använder du bara underdomännamnet som värde istället.

Om du vill att `foo.example.com` ska vidarebefordra e-postmeddelanden, ange då `foo` som namn/värd/alias-värd i dina DNS-inställningar (för både MX- och <strong class="notranslate">TXT</strong>-poster).

### Vidarebefordrar detta mina e-postrubriker {#does-this-forward-my-emails-headers}

Ja, absolut.

### Är detta väl testat {#is-this-well-tested}

Ja, den har tester skrivna med [ava](https://github.com/avajs/ava) och har även kodtäckning.

### Skickar du vidare SMTP-svarsmeddelanden och koder? {#do-you-pass-along-smtp-response-messages-and-codes}

Ja, absolut. Om du till exempel skickar ett e-postmeddelande till `hello@example.com` och det är registrerat för vidarebefordran till `user@gmail.com`, så kommer SMTP-svarsmeddelandet och koden från SMTP-servern "gmail.com" att returneras istället för proxyservern på "mx1.forwardemail.net" eller "mx2.forwardemail.net".

### Hur förhindrar du spammare och säkerställer ett gott rykte för vidarebefordran av e-post? {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Se våra avsnitt om [Hur fungerar ert system för vidarebefordran av e-post?](#how-does-your-email-forwarding-system-work), [Hur hanterar ni problem med e-postleverans](#how-do-you-handle-email-delivery-issues) och [Hur hanterar du blockeringar av dina IP-adresser?](#how-do-you-handle-your-ip-addresses-becoming-blocked) ovan.

### Hur utför man DNS-sökningar på domännamn {#how-do-you-perform-dns-lookups-on-domain-names}

Vi skapade ett programvaruprojekt med öppen källkod :tangerine: [Mandarin](https://github.com/forwardemail/tangerine) och använder det för DNS-sökningar. Standard-DNS-servrarna som används är `1.1.1.1` och `1.0.0.1`, och DNS-frågor går via [DNS över HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") på applikationslagret.

:tangerine: [Mandarin](https://github.com/tangerine) använder [CloudFlares integritetsfokuserade konsument-DNS-tjänst som standard][cloudflare-dns].

## Konto och fakturering {#account-and-billing}

### Erbjuder ni pengarna-tillbaka-garanti på betalda abonnemang? {#do-you-offer-a-money-back-guarantee-on-paid-plans}

Ja! Automatiska återbetalningar sker när du uppgraderar, nedgraderar eller avslutar ditt konto inom 30 dagar från det att din plan först startade. Detta gäller endast för förstagångskunder.

### Om jag byter abonnemang, betalar ni då proportionellt och återbetalar mellanskillnaden? {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

Vi varken proportionellt beräknar eller återbetalar skillnaden när du byter abonnemang. Istället omvandlar vi den återstående perioden från ditt befintliga abonnemangs utgångsdatum till den närmaste relativa perioden för ditt nya abonnemang (avrundat nedåt med månad).

Observera att om du uppgraderar eller nedgraderar mellan betalda planer inom 30 dagar sedan du först startade en betalplan, återbetalar vi automatiskt hela beloppet från din befintliga plan.

### Kan jag bara använda den här vidarebefordringstjänsten för e-post som en "reserv" eller "fallover" MX-server {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

Nej, det rekommenderas inte, eftersom du bara kan använda en e-postutbytesserver åt gången. Reservservrar görs vanligtvis aldrig om på grund av felaktiga prioritetskonfigurationer och e-postservrar som inte respekterar MX Exchange-prioritetskontroll.

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

Ja, redigera bara din DNS-<strong class="notranslate">TXT</strong>-post och lägg till antingen ett, två eller tre utropstecken före aliaset (se nedan).

Observera att du *bör* behålla mappningen ":", eftersom detta krävs om du någonsin väljer att inaktivera detta (och det används även för import om du uppgraderar till ett av våra betalda abonnemang).

**Vid tyst avvisning (verkar för avsändaren som om meddelandet skickades, men leder egentligen ingenstans) (statuskod `250`):** Om du prefixar ett alias med "!" (enkelt utropstecken) kommer det att returnera en lyckad statuskod på `250` till avsändare som försöker skicka till den här adressen, men själva e-postmeddelandena kommer ingenstans (t.ex. ett svart hål eller `/dev/null`).

**För mjuk avvisning (statuskod `421`):** Om du prefixar ett alias med "!!" (dubbelt utropstecken) returneras en mjuk felstatuskod på `421` till avsändare som försöker skicka till denna adress, och e-postmeddelandena kommer ofta att försökas skickas igen i upp till 5 dagar innan de avvisas och studsar.

**För hård avvisning (statuskod `550`):** Om du prefixar ett alias med "!!!" (trippelt utropstecken) returneras en permanent felkod på `550` till avsändare som försöker skicka till denna adress och e-postmeddelandena kommer att avvisas och studsa.

Om jag till exempel vill att alla e-postmeddelanden som går till `alias@example.com` ska sluta flöda vidare till `user@gmail.com` och bli avvisade och studsade (t.ex. använd tre utropstecken):

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Namn/Värd/Alias</th> <th class="text-center">TTL</th> <th>Typ</th> <th>Svar/Värde</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=!!!alias:user@gmail.com</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>
Du kan också skriva om den vidarebefordrade mottagarens adress till helt enkelt "nobody@forwardemail.net", vilket dirigerar den till nobody som i exemplet nedan.
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Namn/Värd/Alias</th> <th class="text-center">TTL</th> <th>Typ</th> <th>Svar/Värde</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=!!!alias:nobody@forwardemail.net</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>
Om du vill ha ökad säkerhet kan du också ta bort delen ":user@gmail.com" (eller ":nobody@forwardemail.net") och bara lämna "!!!alias" som i exemplet nedan.
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Namn/Värd/Alias</th> <th class="text-center">TTL</th> <th>Typ</th> <th>Svar/Värde</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=!!!alias</code></td> </tr> </tbody>
</table>

### Kan jag vidarebefordra e-postmeddelanden till flera mottagare {#can-i-forward-emails-to-multiple-recipients}

Ja, absolut. Ange bara flera mottagare i dina <strong class="notranslate">TXT</strong>-poster.

Om jag till exempel vill att ett e-postmeddelande som går till `hello@example.com` ska vidarebefordras till `user+a@gmail.com` och `user+b@gmail.com`, då skulle min <strong class="notranslate">TXT</strong>-post se ut så här:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr> <th>Namn/Värd/Alias</th> <th class="text-center">TTL</th> <th>Typ</th> <th>Svar/Värde</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
</tr> </tbody>
</table>

Eller så kan du ange dem i två separata rader, till exempel så här:

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Namn/Värd/Alias</th> <th class="text-center">TTL</th> <th>Typ</th> <th>Svar/Värde</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=hello:user+a@gmail.com</code></td> </tr> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>vidarebefordra-e-post=hello:användare+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Det är upp till dig!

### Kan jag ha flera globala catch-all-mottagare {#can-i-have-multiple-global-catch-all-recipients}

Ja, det kan du. Ange bara flera globala catch-all-mottagare i dina <strong class="notranslate">TXT</strong>-poster.

Om jag till exempel vill att alla e-postmeddelanden som går till `*@example.com` (asterisken betyder att det är ett jokertecken, dvs. en samlingsfil) ska vidarebefordras till `user+a@gmail.com` och `user+b@gmail.com`, då skulle min <strong class="notranslate">TXT</strong>-post se ut så här:

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Namn/Värd/Alias</th> <th class="text-center">TTL</th> <th>Typ</th> <th>Svar/Värde</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=användare+a@gmail.com,användare+b@gmail.com</code></td> </tr> </tbody>
</table>

Eller så kan du ange dem i två separata rader, till exempel så här:

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Namn/Värd/Alias</th> <th class="text-center">TTL</th> <th>Typ</th> <th>Svar/Värde</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller tomt</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=user+a@gmail.com</code></td> </tr> <tr> <td><em>@, ".", eller tomt</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>vidarebefordra-e-post=användare+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Det är upp till dig!

### Finns det en maxgräns för antalet e-postadresser jag kan vidarebefordra till per alias {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

Ja, standardgränsen är 10. Detta betyder INTE att du bara kan ha 10 alias på ditt domännamn. Du kan ha så många alias du vill (ett obegränsat antal). Det betyder att du bara kan vidarebefordra ett alias till 10 unika e-postadresser. Du kan ha `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (från 1-10) – och alla e-postmeddelanden till `hello@example.com` skulle vidarebefordras till `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (från 1-10).

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>
Behöver du fler än 10 mottagare per alias? Skicka oss ett e-postmeddelande så ökar vi gärna din kontogräns.
</span>
</div>

### Kan jag vidarebefordra e-postmeddelanden rekursivt {#can-i-recursively-forward-emails}

Ja, det kan du, men du måste fortfarande hålla dig till maxgränsen. Om du har `hello:linus@example.com` och `linus:user@gmail.com`, kommer e-postmeddelanden till `hello@example.com` att vidarebefordras till `linus@example.com` och `user@gmail.com`. Observera att ett felmeddelande kommer att utlösas om du försöker vidarebefordra e-postmeddelanden rekursivt utöver maxgränsen.

### Kan folk avregistrera sig eller registrera min vidarebefordran av e-post utan mitt tillstånd {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

Vi använder MX- och <strong class="notranslate">TXT</strong>-postverifiering, så om du lägger till den här tjänstens respektive MX- och <strong class="notranslate">TXT</strong>-poster är du registrerad. Om du tar bort dem är du avregistrerad. Du äger din domän och DNS-hantering, så om någon har åtkomst till det är det ett problem.

### Hur är det gratis {#how-is-it-free}

Forward Email erbjuder en gratisnivå genom en kombination av öppen källkodsutveckling, effektiv infrastruktur och valfria betalda planer som stöder tjänsten.

Vår gratisnivå stöds av:

1. **Utveckling med öppen källkod**: Vår kodbas är öppen källkod, vilket möjliggör bidrag från communityn och transparent drift.

2. **Effektiv infrastruktur**: Vi har optimerat våra system för att hantera vidarebefordran av e-post med minimala resurser.

3. **Betalda premiumplaner**: Användare som behöver ytterligare funktioner som SMTP-sändning, IMAP-mottagning eller utökade sekretessalternativ prenumererar på våra betalda planer.

4. **Rimliga användningsgränser**: Gratisnivån har policyer för rättvis användning för att förhindra missbruk.

> \[!NOTE]
> We're committed to keeping basic email forwarding free while offering premium features for users with more advanced needs.

> \[!TIP]
> If you find our service valuable, consider upgrading to a paid plan to support ongoing development and maintenance.

### Vad är den maximala storleksgränsen för e-postmeddelanden {#what-is-the-max-email-size-limit}

Vi har en standardstorleksgräns på 50 MB, vilket inkluderar innehåll, rubriker och bilagor. Observera att tjänster som Gmail och Outlook endast tillåter en storleksgräns på 25 MB, och om du överskrider gränsen när du skickar till adresser hos dessa leverantörer får du ett felmeddelande.

Ett fel med rätt svarskod returneras om filstorleksgränsen överskrids.

### Lagrar ni loggar över e-postmeddelanden? {#do-you-store-logs-of-emails}

Nej, vi skriver inte till disk eller lagrar loggar – med [undantag för fel](#do-you-store-error-logs) och [utgående SMTP](#do-you-support-sending-email-with-smtp) (se vår [Integritetspolicy](/privacy)).

Allt görs i minnet och [vår källkod finns på GitHub](https://github.com/forwardemail).

### Lagrar ni felloggar {#do-you-store-error-logs}

**Ja. Du kan komma åt felloggar under [Mitt konto → Loggar](/my-account/logs) eller [Mitt konto → Domäner](/my-account/domains).**

Från och med februari 2023 lagrar vi felloggar för SMTP-svarskoderna `4xx` och `5xx` i 7 dagar – vilka innehåller SMTP-felet, kuvertet och e-postrubriker (vi **lagrar** inte e-postmeddelandets brödtext eller bilagor).

Felloggar låter dig kontrollera om viktiga e-postmeddelanden saknas och minska risken för falska positiva resultat från skräppost för [dina domäner](/my-account/domains). De är också en utmärkt resurs för att felsöka problem med [e-postwebhooks](#do-you-support-webhooks) (eftersom felloggarna innehåller webhook-slutpunktssvaret).

Felloggar för [hastighetsbegränsande](#do-you-have-rate-limiting) och [grålistning](#do-you-have-a-greylist) är inte tillgängliga eftersom anslutningen avslutas tidigt (t.ex. innan kommandona `RCPT TO` och `MAIL FROM` kan överföras).

Se vår [Integritetspolicy](/privacy) för mer insikt.

### Läser du mina e-postmeddelanden {#do-you-read-my-emails}

Nej, absolut inte. Se vår [Integritetspolicy](/privacy).

Många andra e-postvidarebefordringstjänster lagrar och kan potentiellt läsa din e-post. Det finns ingen anledning till att vidarebefordrade e-postmeddelanden behöver lagras på disklagring – och därför har vi skapat den första lösningen med öppen källkod som gör allt detta i minnet.

Vi anser att du ska ha rätt till integritet och vi respekterar den strikt. Koden som distribueras till servern är [öppen källkodsprogramvara på GitHub](https://github.com/forwardemail) för transparens och för att bygga förtroende.

### Kan jag "skicka e-post som" i Gmail med denna {#can-i-send-mail-as-in-gmail-with-this}

Ja! Från och med den 2 oktober 2018 har vi lagt till den här funktionen. Se [Hur man skickar e-post som med Gmail](#how-to-send-mail-as-using-gmail) ovan!

Du bör också ställa in SPF-posten för Gmail i din DNS-konfigurations-<strong class="notranslate">TXT</strong>-post.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Viktigt:
</strong>
<span>
Om du använder Gmail (t.ex. Skicka e-post som) eller G Suite måste du lägga till <code>include:_spf.google.com</code> i din SPF <strong class="notranslate">TXT</strong>-post, till exempel:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

### Kan jag "skicka e-post som" i Outlook med denna {#can-i-send-mail-as-in-outlook-with-this}

Ja! Från och med den 2 oktober 2018 har vi lagt till den här funktionen. Se bara dessa två länkar från Microsoft nedan:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

Du bör också ange SPF-posten för Outlook i din DNS-konfigurations-<strong class="notranslate">TXT</strong>-post.

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

### Kan jag "skicka e-post som" i Apple Mail och iCloud Mail med denna {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

Om du prenumererar på iCloud+ kan du använda en anpassad domän. [Vår tjänst är även kompatibel med Apple Mail](#apple-mail).

Se <https://support.apple.com/en-us/102540> för mer information.

### Kan jag vidarebefordra obegränsat antal e-postmeddelanden med denna {#can-i-forward-unlimited-emails-with-this}

Ja, men "relativt okända" avsändare är begränsade till 100 anslutningar per timme per värdnamn eller IP-adress. Se avsnittet om [Hastighetsbegränsande](#do-you-have-rate-limiting) och [Grålistning](#do-you-have-a-greylist) ovan.

Med "relativt okänd" menar vi avsändare som inte visas i [tillåtelselista](#do-you-have-an-allowlist).

Om denna gräns överskrids skickar vi en svarskod 421 som ber avsändarens e-postserver att försöka igen senare.

### Erbjuder ni obegränsat antal domäner till ett pris? {#do-you-offer-unlimited-domains-for-one-price}

Ja. Oavsett vilket abonnemang du har betalar du bara en månadsavgift – som täcker alla dina domäner.

### Vilka betalningsmetoder accepterar ni? {#which-payment-methods-do-you-accept}

Vidarebefordran av e-post accepterar följande engångs- eller månatliga/kvartalsvisa/årliga betalningsmetoder:

1. **Kredit-/betalkort/banköverföringar**: Visa, Mastercard, American Express, Discover, JCB, Diners Club, etc.
2. **PayPal**: Anslut ditt PayPal-konto för enkla betalningar
3. **Kryptovaluta**: Vi accepterar betalningar via Stripes stablecoin-betalningar på Ethereum-, Polygon- och Solana-nätverk

> \[!NOTE]
> We store limited payment information on our servers, which only includes payment identifiers and references to [Stripe](https://stripe.com/global) and [PayPal](https://www.paypal.com) transaction, customer, subscription, and payment ID's.

> \[!TIP]
> For maximum privacy, consider using cryptocurrency payments.

Alla betalningar behandlas säkert via Stripe eller PayPal. Dina betalningsuppgifter lagras aldrig på våra servrar.

## Ytterligare resurser {#additional-resources}

> \[!TIP]
> Our articles below are regularly updated with new guides, tips, and technical information. Check back often for the latest content.

* [Fallstudier och utvecklardokumentation](/blog/docs)
* [Resurser](/resources)
* [Guider](/guides)

[gmail-2fa]: __SKYDDAD_URL_868__

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/