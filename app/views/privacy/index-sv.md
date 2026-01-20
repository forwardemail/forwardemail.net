# Integritetspolicy {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email privacy policy" class="rounded-lg" />

## Innehållsförteckning {#table-of-contents}

* [Ansvarsfriskrivning](#disclaimer)
* [Information som inte samlats in](#information-not-collected)
* [Insamlad information](#information-collected)
* [Information som delas](#information-shared)
* [Borttagning av information](#information-removal)
* [Ytterligare upplysningar](#additional-disclosures)

## Ansvarsfriskrivning {#disclaimer}

Vänligen hänvisa till vår [Villkor](/terms) eftersom den gäller för hela webbplatsen.

## Information har inte samlats in {#information-not-collected}

**Med undantag för [fel](/faq#do-you-store-error-logs), [utgående SMTP-e-postmeddelanden](/faq#do-you-support-sending-email-with-smtp), och/eller när spam eller skadlig aktivitet upptäcks (t.ex. för hastighetsbegränsning):**

* Vi lagrar inga vidarebefordrade e-postmeddelanden på disk eller i databaser.
* Vi lagrar inga metadata om e-postmeddelanden på disk eller i databaser.
* Vi lagrar inga loggar eller IP-adresser på disk eller i databaser.

## Information insamlad {#information-collected}

För transparensens skull kan du när som helst <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">visa vår källkod</a> för att se hur informationen nedan samlas in och används:

**Enbart för funktionalitet och för att förbättra vår tjänst samlar vi in och lagrar följande information säkert:**

* Vi lagrar e-postmeddelanden och kalenderinformation i din [krypterad SQLite-databas](/blog/docs/best-quantum-safe-encrypted-email-service) enbart för din IMAP/POP3/CalDAV/CardDAV-åtkomst och postlådefunktion.
* Observera att om du endast använder våra e-postvidarebefordringstjänster lagras inga e-postmeddelanden på disk eller databaslagring enligt beskrivningen i [Information som inte samlats in](#information-not-collected).
* Våra e-postvidarebefordringstjänster fungerar endast i minnet (ingen skrivning till disklagring eller databaser).
* IMAP/POP3/CalDAV/CardDAV-lagring är krypterad i vila, krypterad under överföring och lagras på en LUKS-krypterad disk.
* Säkerhetskopieringar för din IMAP/POP3/CalDAV/CardDAV-lagring är krypterad i vila, krypterad under överföring och lagras på [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/).
* Vi lagrar en cookie i en session för din webbplatstrafik.
* Vi lagrar din e-postadress som du anger till oss.
* Vi lagrar dina domännamn, alias och konfigurationer som du anger till oss.
* Vi lagrar `4xx` och `5xx` SMTP-svarskoden [felloggar](/faq#do-you-store-error-logs) i 7 dagar.
* Vi lagrar [utgående SMTP-e-postmeddelanden](/faq#do-you-support-sending-email-with-smtp) i ~30 dagar.
* Denna längd varierar beroende på "Date"-rubriken eftersom vi tillåter att e-postmeddelanden skickas i framtiden om en framtida "Date"-rubrik finns.
* **Observera att när ett e-postmeddelande har levererats eller uppvisar permanenta fel kommer vi att redigera och rensa meddelandets innehåll.**
* Om du vill konfigurera ditt utgående SMTP-e-postmeddelande så att det sparas längre än standardvärdet på 0 dagar (efter lyckad leverans eller permanent fel), gå till Avancerade inställningar för din domän och ange ett värde mellan `0` och `30`.
* Vissa användare tycker om att använda förhandsgranskningsfunktionen [Mitt konto > E-postmeddelanden](/my-account/emails) för att se hur deras e-postmeddelanden renderas, därför stöder vi en konfigurerbar lagringsperiod.
* Observera att vi även stöder __PROTECTED_LINK_30__0.
* All ytterligare information som du frivilligt lämnar till oss, såsom kommentarer eller frågor som skickats till oss via e-post eller på vår <a href="/help">hjälpsida</a>.

## Information delad {#information-shared}

Vi delar inte din information med någon tredje part. Vi använder inte heller några tredjepartstjänster för analys eller telemetri.

Vi kan behöva och kommer att följa domstolsbeslutade rättsliga förfrågningar (men kom ihåg [Vi samlar inte in information som nämns ovan under "Information som inte samlas in"](#information-not-collected), så vi kommer inte att kunna tillhandahålla den till att börja med).

## Borttagning av information {#information-removal}

Om du någon gång vill ta bort information som du har lämnat till oss, gå till <a href="/my-account/security">Mitt konto > Säkerhet</a> och klicka på "Ta bort konto".

På grund av förebyggande och begränsning av missbruk kan ditt konto kräva manuell granskning av våra administratörer om du tar bort det inom 5 dagar efter din första betalning.

Den här processen tar vanligtvis mindre än 24 timmar och implementerades på grund av att användare spammade med vår tjänst och sedan snabbt raderade sina konton – vilket hindrade oss från att blockera deras betalningsmetods fingeravtryck i Stripe.

## Ytterligare upplysningar {#additional-disclosures}

Den här webbplatsen är skyddad av Cloudflare och dess [Integritetspolicy](https://www.cloudflare.com/privacypolicy/) och [Användarvillkor](https://www.cloudflare.com/website-terms/) gäller.