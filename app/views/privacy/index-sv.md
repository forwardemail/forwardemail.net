# Integritetspolicy {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email integritetspolicy" class="rounded-lg" />


## Innehållsförteckning {#table-of-contents}

* [Ansvarsfriskrivning](#disclaimer)
* [Information som inte samlas in](#information-not-collected)
* [Information som samlas in](#information-collected)
  * [Kontoinformation](#account-information)
  * [E-postlagring](#email-storage)
  * [Felloggar](#error-logs)
  * [Utgående SMTP-e-post](#outbound-smtp-emails)
* [Tillfällig databehandling](#temporary-data-processing)
  * [Begränsning av hastighet](#rate-limiting)
  * [Anslutningsspårning](#connection-tracking)
  * [Autentiseringsförsök](#authentication-attempts)
* [Revisionsloggar](#audit-logs)
  * [Kontoförändringar](#account-changes)
  * [Ändringar av domäninställningar](#domain-settings-changes)
* [Cookies och sessioner](#cookies-and-sessions)
* [Analys](#analytics)
* [Delad information](#information-shared)
* [Borttagning av information](#information-removal)
* [Ytterligare upplysningar](#additional-disclosures)


## Ansvarsfriskrivning {#disclaimer}

Vänligen hänvisa till våra [Villkor](/terms) eftersom de gäller för hela webbplatsen.


## Information som inte samlas in {#information-not-collected}

**Med undantag för [felloggar](#error-logs), [utgående SMTP-e-post](#outbound-smtp-emails) och/eller när skräppost eller skadlig aktivitet upptäcks (t.ex. för hastighetsbegränsning):**

* Vi lagrar inga vidarebefordrade e-postmeddelanden på disk eller i databaser.
* Vi lagrar inga metadata om vidarebefordrade e-postmeddelanden på disk eller i databaser.
* Vi lagrar inga loggar eller IP-adresser på disk eller i databaser.
* Vi använder inga tredjepartsanalys- eller telemetritjänster.


## Information som samlas in {#information-collected}

För transparens kan du när som helst <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">granska vår källkod</a> för att se hur informationen nedan samlas in och används.

**Endast för funktionalitet och för att förbättra vår tjänst samlar vi in och lagrar säkert följande information:**

### Kontoinformation {#account-information}

* Vi lagrar din e-postadress som du tillhandahåller oss.
* Vi lagrar dina domännamn, alias och konfigurationer som du tillhandahåller oss.
* All ytterligare information som du frivilligt ger oss, såsom kommentarer eller frågor som skickas till oss via e-post eller på vår <a href="/help">hjälpsida</a>.

**Registreringsattribution** (lagras permanent på ditt konto):

När du skapar ett konto lagrar vi följande information för att förstå hur användare hittar vår tjänst:

* Den hänvisande webbplatsens domän (inte fullständig URL)
* Den första sidan du besökte på vår webbplats
* UTM-kampanjparametrar om de finns i URL:en

### E-postlagring {#email-storage}

* Vi lagrar e-post och kalenderinformation i din [krypterade SQLite-databas](/blog/docs/best-quantum-safe-encrypted-email-service) strikt för din IMAP/POP3/CalDAV/CardDAV-åtkomst och brevlådefunktionalitet.
  * Observera att om du endast använder våra e-postvidarebefordringstjänster lagras inga e-postmeddelanden på disk eller i databasen som beskrivs i [Information som inte samlas in](#information-not-collected).
  * Våra e-postvidarebefordringstjänster fungerar endast i minnet (ingen skrivning till disk eller databaser).
  * IMAP/POP3/CalDAV/CardDAV-lagring är krypterad i vila, krypterad under överföring och lagrad på en LUKS-krypterad disk.
  * Säkerhetskopior för din IMAP/POP3/CalDAV/CardDAV-lagring är krypterade i vila, krypterade under överföring och lagrade på [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/).

### Felloggar {#error-logs}

* Vi lagrar `4xx` och `5xx` SMTP-svarskod [felloggar](/faq#do-you-store-error-logs) i 7 dagar.
* Felloggar innehåller SMTP-felet, kuvert och e-posthuvuden (vi **lagrar inte** e-postens innehåll eller bilagor).
* Felloggar kan innehålla IP-adresser och värdnamn för sändande servrar för felsökningsändamål.
* Felloggar för [hastighetsbegränsning](/faq#do-you-have-rate-limiting) och [greylisting](/faq#do-you-have-a-greylist) är inte tillgängliga eftersom anslutningen avslutas tidigt (t.ex. innan `RCPT TO` och `MAIL FROM` kommandon kan skickas).
### Utgående SMTP-e-post {#outbound-smtp-emails}

* Vi lagrar [utgående SMTP-e-post](/faq#do-you-support-sending-email-with-smtp) i cirka 30 dagar.
  * Denna längd varierar beroende på "Date"-huvudet; eftersom vi tillåter att e-post skickas i framtiden om ett framtida "Date"-huvud finns.
  * **Observera att när ett e-postmeddelande har levererats framgångsrikt eller permanent felar, kommer vi att redigera och radera meddelandets innehåll.**
  * Om du vill konfigurera att innehållet i ditt utgående SMTP-e-postmeddelande ska behållas längre än standardvärdet 0 dagar (efter framgångsrik leverans eller permanent fel), gå till Avancerade inställningar för din domän och ange ett värde mellan `0` och `30`.
  * Vissa användare uppskattar att använda förhandsgranskningsfunktionen [Mitt konto > E-post](/my-account/emails) för att se hur deras e-postmeddelanden visas, därför stödjer vi en konfigurerbar lagringstid.
  * Observera att vi också stödjer [OpenPGP/E2EE](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).


## Tillfällig databehandling {#temporary-data-processing}

Följande data behandlas tillfälligt i minnet eller Redis och lagras **inte** permanent:

### Hastighetsbegränsning {#rate-limiting}

* IP-adresser används tillfälligt i Redis för hastighetsbegränsningsändamål.
* Data för hastighetsbegränsning förfaller automatiskt (vanligtvis inom 24 timmar).
* Detta förhindrar missbruk och säkerställer rättvis användning av våra tjänster.

### Anslutningsspårning {#connection-tracking}

* Antal samtidiga anslutningar spåras per IP-adress i Redis.
* Denna data förfaller automatiskt när anslutningar stängs eller efter en kort timeout.
* Används för att förhindra anslutningsmissbruk och säkerställa tjänstens tillgänglighet.

### Autentiseringsförsök {#authentication-attempts}

* Misslyckade autentiseringsförsök spåras per IP-adress i Redis.
* Denna data förfaller automatiskt (vanligtvis inom 24 timmar).
* Används för att förhindra brute-force-attacker på användarkonton.


## Revisionsloggar {#audit-logs}

För att hjälpa dig övervaka och säkra ditt konto och dina domäner underhåller vi revisionsloggar för vissa ändringar. Dessa loggar används för att skicka notifieringsmail till kontoinnehavare och domänadministratörer.

### Kontoförändringar {#account-changes}

* Vi spårar ändringar i viktiga kontoinställningar (t.ex. tvåfaktorsautentisering, visningsnamn, tidszon).
* När ändringar upptäcks skickar vi en e-postnotifikation till din registrerade e-postadress.
* Känsliga fält (t.ex. lösenord, API-token, återställningsnycklar) spåras men deras värden redigeras i notifikationerna.
* Revisionsloggposter rensas efter att notifieringsmailet har skickats.

### Ändringar i domäninställningar {#domain-settings-changes}

För domäner med flera administratörer tillhandahåller vi detaljerad revisionsloggning för att hjälpa team att spåra konfigurationsändringar:

**Vad vi spårar:**

* Ändringar i domäninställningar (t.ex. bounce-webhooks, spamfiltrering, DKIM-konfiguration)
* Vem som gjorde ändringen (användarens e-postadress)
* När ändringen gjordes (tidsstämpel)
* IP-adressen från vilken ändringen gjordes
* Webbläsarens/klientens user-agent-sträng

**Hur det fungerar:**

* Alla domänadministratörer får en samlad e-postnotifikation när inställningar ändras.
* Notifikationen inkluderar en tabell som visar varje ändring med användaren som gjorde den, deras IP-adress och tidsstämpel.
* Känsliga fält (t.ex. webhook-nycklar, API-token, DKIM-privata nycklar) spåras men deras värden redigeras.
* User-agent-information inkluderas i en fällbar sektion "Tekniska detaljer".
* Revisionsloggposter rensas efter att notifieringsmailet har skickats.

**Varför vi samlar in detta:**

* För att hjälpa domänadministratörer att upprätthålla säkerhetsöversikt
* För att möjliggöra för team att granska vem som gjort konfigurationsändringar
* För att underlätta felsökning vid oväntade ändringar
* För att skapa ansvarstagande vid delad domänhantering


## Cookies och sessioner {#cookies-and-sessions}

* Vi lagrar en cookie i en session för din webbplatstrafik.
* Cookies är HTTP-only, signerade och använder SameSite-skydd.
* Sessionscookies förfaller efter 30 dagars inaktivitet.
* Vi skapar inte sessioner för bots eller crawlers.
* Vi använder cookies för:
  * Autentisering och inloggningsstatus
  * Tvåfaktorsautentiseringens "kom ihåg mig"-funktionalitet
  * Flash-meddelanden och notifikationer
## Analytics {#analytics}

Vi använder vårt eget integritetsfokuserade analyssystem för att förstå hur våra tjänster används. Detta system är utformat med integritet som en kärnprincip:

**Vad vi INTE samlar in:**

* Vi lagrar inte IP-adresser
* Vi använder inte cookies eller permanenta identifierare för analys
* Vi använder inga tredjepartsanalystjänster
* Vi spårar inte användare över dagar eller sessioner

**Vad vi samlar in (anonymiserat):**

* Aggregerade sidvisningar och tjänstanvändning (SMTP, IMAP, POP3, API, etc.)
* Webbläsar- och operativsystemtyp (tolkat från user agent, rådata kastas)
* Enhetstyp (stationär, mobil, surfplatta)
* Referensdomän (inte fullständig URL)
* E-postklienttyp för mailprotokoll (t.ex. Thunderbird, Outlook)

**Dataretention:**

* Analysdata raderas automatiskt efter 30 dagar
* Sessionsidentifierare roteras dagligen och kan inte användas för att spåra användare över dagar


## Information Shared {#information-shared}

Vi delar inte din information med några tredje parter.

Vi kan behöva och kommer att följa rättsliga förfrågningar från domstol (men tänk på att [vi inte samlar in information som nämns ovan under "Information Not Collected"](#information-not-collected), så vi kommer inte kunna tillhandahålla det från början).


## Information Removal {#information-removal}

Om du när som helst vill ta bort information som du har lämnat till oss, gå till <a href="/my-account/security">Mitt konto > Säkerhet</a> och klicka på "Radera konto".

På grund av förebyggande och hantering av missbruk kan ditt konto kräva manuell raderingsgranskning av våra administratörer om du raderar det inom 5 dagar efter din första betalning.

Denna process tar vanligtvis mindre än 24 timmar och infördes eftersom användare spammade med vår tjänst och sedan snabbt raderade sina konton – vilket förhindrade oss från att blockera deras betalningsmetodfingeravtryck i Stripe.


## Additional Disclosures {#additional-disclosures}

Denna webbplats skyddas av Cloudflare och dess [Privacy Policy](https://www.cloudflare.com/privacypolicy/) och [Terms of Service](https://www.cloudflare.com/website-terms/) gäller.
