# Integritetspolicy {#privacy-policy}

<!-- <img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email integritetspolicy" class="rounded-lg" /> -->


## Innehållsförteckning {#table-of-contents}

* [Ansvarsfriskrivning](#disclaimer)
* [Information som inte samlas in](#information-not-collected)
* [Information som samlas in](#information-collected)
  * [Kontoinformation](#account-information)
  * [E-postlagring](#email-storage)
  * [Felloggar](#error-logs)
  * [Serverloggar](#server-logs)
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
* [Appar och webbmail](#apps-and-webmail)
  * [Data på din enhet](#data-on-your-device)
  * [Data som apparna skickar till oss](#data-the-apps-send-us)
  * [Push-notiser](#push-notifications)
  * [Bilder och länkar i e-post](#images-and-links-in-emails)
  * [Andra anslutningar](#other-connections)
* [Delad information](#information-shared)
* [Borttagning av information](#information-removal)
* [Ytterligare upplysningar](#additional-disclosures)


## Ansvarsfriskrivning {#disclaimer}

Vänligen hänvisa till våra [Villkor](/terms) eftersom de gäller för hela webbplatsen.


## Information som inte samlas in {#information-not-collected}

**Med undantag för den information som uttryckligen beskrivs i denna policy (inklusive [felloggar](#error-logs), [serverloggar](#server-logs), [utgående SMTP-e-postmeddelanden](#outbound-smtp-emails), [kontoinformation](#account-information), [tillfällig databehandling](#temporary-data-processing), [granskningsloggar](#audit-logs), [cookies och sessioner](#cookies-and-sessions), [analys](#analytics) och [appar och webbmail](#apps-and-webmail)):**

* Vi lagrar inte några vidarebefordrade e-postmeddelanden på disk eller i databaser.
* Vi lagrar inte någon metadata om vidarebefordrade e-postmeddelanden på disk eller i databaser.
* Förutom vad som uttryckligen beskrivs i denna policy, lagrar vi inte loggar eller IP-adresser på disk eller i databaser.
* Vi använder inga tredjepartstjänster för analys eller telemetri.


## Information som samlas in {#information-collected}

För transparens kan du när som helst <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">granska vår källkod</a> för att se hur informationen nedan samlas in och används.

**Endast för funktionalitet och för att förbättra vår tjänst samlar vi in och lagrar säkert följande information:**

### Kontoinformation {#account-information}

* Vi lagrar din e-postadress som du förser oss med.
* Vi lagrar dina domännamn, alias och konfigurationer som du förser oss med.
* Vi lagrar begränsad säkerhetsmetadata för kontot som behövs för att skydda ditt konto och hantera åtkomst, inklusive aktiva sessionsidentifierare för webbplatsen, räknare för misslyckade inloggningsförsök och tidsstämpeln för det senaste inloggningsförsöket.
* All ytterligare information som du frivilligt tillhandahåller oss, såsom kommentarer eller frågor som skickas till oss via e-post eller på vår <a href="/help">hjälp</a>-sida.


**Registreringsattribution** (lagras permanent på ditt konto):

När du skapar ett konto lagrar vi följande information för att förstå hur användare hittar vår tjänst:

* Den hänvisande webbplatsens domän (inte fullständig URL)
* Den första sidan du besökte på vår webbplats, där värden i dess sökväg såsom domännamn, ID:n och token ersätts med platshållare
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
* Vi lagrar också felloggar i 7 dagar för webb- och API-förfrågningar som misslyckas eller tar för lång tid, och för fel på våra IMAP-, POP3-, CalDAV- och CardDAV-servrar.
* Dessa loggar kan innehålla IP-adressen, förfrågans URL (inklusive frågesträngar, t.ex. sökord), förfrågningshuvuden som user agent samt det konto eller alias som berörs.
* Lösenord, API-token, cookies och förfrågningsinnehåll tas bort från dessa loggar innan de lagras.

### Serverloggar {#server-logs}

* För varje webb- och API-förfrågan skriver våra servrar en loggrad som kan innehålla IP-adressen, förfrågans metod och URL (inklusive frågesträngar), förfrågningshuvuden, svarsstatus och det inloggade kontot.
* Vi använder dessa loggar för att hitta och åtgärda problem och för att stoppa missbruk, och vi sparar dem i upp till 30 dagar.

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
* Vi lagrar också begränsad autentiseringsmetadata på kontonivå, inklusive räknare för misslyckade inloggningsförsök och tidsstämpeln för det senaste inloggningsförsöket.
* Redis-baserad data om autentiseringsförsök löper ut automatiskt (vanligtvis inom 24 timmar).
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

* Vi lagrar HTTP-only, signerade cookies och sessionsdata på serversidan för din webbplatstrafik.
* Cookies använder SameSite-skydd.
* Vi lagrar aktiva sessionsidentifierare för webbplatsen på ditt konto för att stödja funktioner som "logga ut från andra enheter" och säkerhetsrelaterad ogiltigförklaring av sessioner.
* Sessionscookies löper ut efter 30 dagars inaktivitet.
* Vi skapar inte sessioner för botar eller sökrobotar.
* Vi använder cookies och sessioner för:
  * Autentisering och inloggningstillstånd
  * "Kom ihåg mig"-funktion för tvåfaktorsautentisering
  * Flash-meddelanden och aviseringar
  * [Analys](#analytics): den första sidan under ditt besök, referensdomänen, kampanjparametrar (UTM) och ett sidantal


## Analytics {#analytics}

Vi använder vårt eget integritetsfokuserade analyssystem för att förstå hur våra tjänster används. Detta system är utformat med integritet som en kärnprincip:

**Vad vi INTE samlar in:**

* Vi lagrar inte IP-adresser
* Vi sätter ingen separat cookie för analys
* Vi använder inga tredjepartsanalystjänster
* Vi spårar inte besökare över dagar eller sessioner när de inte är inloggade

**Vad vi samlar in:**

* Aggregerade sidvisningar och tjänstanvändning (SMTP, IMAP, POP3, API, etc.)
* Webbläsar- och operativsystemtyp och -version (tolkat från user agent, rådata kastas)
* Enhetstyp (stationär, mobil, surfplatta)
* Referensdomän (inte fullständig URL) och kampanjparametrar (UTM)
* E-postklienttyp för mailprotokoll (t.ex. Thunderbird, Outlook)
* Den begärda sidan eller API-sökvägen, där värden såsom domännamn, ID:n och token ersätts med platshållare, och om förfrågan lyckades
* Vid besök på webbplatsen: den första sidan under besöket och ett sidantal, som sparas i din session (se [Cookies och sessioner](#cookies-and-sessions))
* När du är inloggad, ID:t för ditt konto, ditt alias eller din domän, så att vi kan se hur varje tjänst används och felsöka problem

**Dataretention:**

* Analyshändelser raderas automatiskt efter 30 dagar
* Totalsiffror per timme, som inte är kopplade till något konto, sparas i 90 dagar
* Sessionsidentifierare roteras dagligen och kan inte användas för att spåra besökare över dagar


## Appar och webbmail {#apps-and-webmail}

Det här avsnittet omfattar våra e-postappar för iOS, Android, macOS, Windows och Linux samt vår webbmail på <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a>, som alla delar samma kod. Apparna innehåller ingen reklam- eller spårningskod och ingen tredjepartsanalys.

### Data på din enhet {#data-on-your-device}

* Apparna lagrar din e-post, dina kontakter, kalendrar, inställningar och inloggningsuppgifter på din enhet, så att de laddas snabbt och fungerar offline.
* Om du slår på App Lock krypterar appen lagrat e-postinnehåll, kontakter och inloggningsuppgifter med en nyckel som skyddas av din PIN-kod eller lösennyckel. Datum, mappar, etiketter och flaggor förblir okrypterade så att appen kan sortera och räkna dina e-postmeddelanden.
* När du loggar ut från ett konto tas dess data bort från din enhet.

### Data som apparna skickar till oss {#data-the-apps-send-us}

* E-postadressen och lösenordet för ditt alias skickas med varje förfrågan för att logga in dig.
* E-post, kontakter, kalendrar, etiketter och filter som du skickar, skapar eller ändrar. Vi lagrar e-post, kontakter och kalendrar enligt beskrivningen i [E-postlagring](#email-storage), och e-post som du skickar enligt beskrivningen i [Utgående SMTP-e-post](#outbound-smtp-emails).
* Dina sökord, så att vi kan söka i din brevlåda på våra servrar. Sökord är en del av förfrågans URL, så de kan förekomma i [felloggar](#error-logs) och [serverloggar](#server-logs).
* Feedback som du väljer att skicka från appen. Den skickas via e-post från ditt alias till vårt supportteam, tillsammans med eventuella diagnostiska uppgifter som du väljer att ta med.
* E-postmeddelanden som du rapporterar som spam. Appen vidarebefordrar dem till vårt team som hanterar missbruk (eller till en annan adress som du anger under Settings).

### Push-notiser {#push-notifications}

* När du tillåter notiser registrerar appen en push-token hos oss. Vi lagrar den tillsammans med plattformen, det alias och konto den gäller, tidpunkten för dess senaste leverans och ett enhetsnamn från appens user agent, som innehåller versionen av ditt operativsystem och, på Android, din enhetsmodell.
* Vi behåller en push-token i upp till ett år efter att den senast användes. Vi raderar den tidigare om du loggar ut från appen, om leveransen misslyckas tre gånger i rad, om aliaslösenordet ändras, om du raderar aliaset eller ditt konto, eller om aliaset övergår till en annan ägare.
* På iOS och macOS går notiser via Apple Push Notification service. I vår Android-app från Google Play går de via Firebase Cloud Messaging. Notiser om ny e-post innehåller avsändarens namn och adress, ämnet, en kort förhandsvisning och mappnamnet, även för e-post som kommer in utan en synlig notis, t.ex. e-post som läggs i mappen Skräppost eller Skickat. När e-post, kalendrar eller kontakter ändras skickar vi också tysta notiser med identifierare men utan e-postinnehåll, så att appen håller sig uppdaterad.
* Med [UnifiedPush](https://unifiedpush.org/) på Android, och med notiser i en webbläsare, krypteras varje notis så att bara din enhet kan läsa den.
* Vår Android-app från Google Play innehåller Firebase Cloud Messaging, som skickar ett Firebase-installations-ID, appversionen samt enhets- och SDK-uppgifter till Google. Vår Google-fria Android-app från GitHub innehåller inte Firebase.

### Bilder och länkar i e-post {#images-and-links-in-emails}

* Bilder i e-post laddas från avsändarens servrar, som kan se din IP-adress och när bilderna laddades.
* Apparna blockerar spårningspixlar som standard. Du kan också blockera alla externa bilder under Settings > Privacy & Security och sedan ladda dem för ett e-postmeddelande i taget.
* Länkar i e-post öppnas i din webbläsare.

### Andra anslutningar {#other-connections}

* Vår webbmail frågar GitHub efter sin senaste version när den laddas, när du återvänder till den och var 10:e minut medan den är öppen. About & Help frågar GitHub efter den senaste skrivbordsversionen, och skrivbordsapparna söker efter uppdateringar på GitHub. GitHub tar emot din IP-adress med dessa förfrågningar.


## Information Shared {#information-shared}

Vi delar inte din information med några tredje parter, förutom tjänsteleverantörer som driver delar av vår tjänst, såsom Cloudflare (skydd av webbplatsen och krypterade säkerhetskopior), Stripe och PayPal (betalningar), och de tjänster som levererar push-notiser till dina enheter (se [Push-notiser](#push-notifications)).

Vi kan behöva och kommer att följa rättsliga förfrågningar från domstol (men tänk på att [vi inte samlar in information som nämns ovan under "Information Not Collected"](#information-not-collected), så vi kommer inte kunna tillhandahålla det från början).


## Information Removal {#information-removal}

Om du när som helst vill ta bort information som du har lämnat till oss, gå till <a href="/my-account/security">Mitt konto > Säkerhet</a> och klicka på "Radera konto".

På grund av förebyggande och hantering av missbruk kan ditt konto kräva manuell raderingsgranskning av våra administratörer om du raderar det inom 5 dagar efter din första betalning.

Denna process tar vanligtvis mindre än 24 timmar och infördes eftersom användare spammade med vår tjänst och sedan snabbt raderade sina konton – vilket förhindrade oss från att blockera deras betalningsmetodfingeravtryck i Stripe.

När du raderar ditt konto raderas även de domäner du administrerar, dina alias och de push-token som är registrerade för dem. Själva kontoposten finns kvar, men dess e-postadress, faktureringsuppgifter, lösenord och lösennycklar tas bort och dess tvåfaktorsautentisering och API-token återkallas, och vi behåller dess betalningsposter för återbetalningar och bokföring. Loggar och analysdata som hänvisar till ditt konto raderas enligt tidsplanerna ovan.

Om du vill ta bort apparnas data från en enhet loggar du ut från appen eller avinstallerar den.


## Additional Disclosures {#additional-disclosures}

Denna webbplats skyddas av Cloudflare och dess [Privacy Policy](https://www.cloudflare.com/privacypolicy/) och [Terms of Service](https://www.cloudflare.com/website-terms/) gäller.
