# Privacybeleid {#privacy-policy}

<!-- <img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email privacy policy" class="rounded-lg" /> -->


## Inhoudsopgave {#table-of-contents}

* [Disclaimer](#disclaimer)
* [Informatie Niet Verzameld](#information-not-collected)
* [Informatie Verzameld](#information-collected)
  * [Accountinformatie](#account-information)
  * [E-mailopslag](#email-storage)
  * [Foutlogboeken](#error-logs)
  * [Serverlogboeken](#server-logs)
  * [Uitgaande SMTP-e-mails](#outbound-smtp-emails)
* [Tijdelijke Gegevensverwerking](#temporary-data-processing)
  * [Rate Limiting](#rate-limiting)
  * [Verbindingsregistratie](#connection-tracking)
  * [Authenticatiepogingen](#authentication-attempts)
* [Auditlogboeken](#audit-logs)
  * [Accountwijzigingen](#account-changes)
  * [Wijzigingen in Domeininstellingen](#domain-settings-changes)
* [Cookies en Sessies](#cookies-and-sessions)
* [Analyse](#analytics)
* [Apps en Webmail](#apps-and-webmail)
  * [Gegevens op uw apparaat](#data-on-your-device)
  * [Gegevens die de apps naar ons sturen](#data-the-apps-send-us)
  * [Pushmeldingen](#push-notifications)
  * [Afbeeldingen en links in e-mails](#images-and-links-in-emails)
  * [Overige verbindingen](#other-connections)
* [Gedeelde Informatie](#information-shared)
* [Verwijdering van Informatie](#information-removal)
* [Aanvullende Openbaarmakingen](#additional-disclosures)


## Disclaimer {#disclaimer}

Raadpleeg onze [Voorwaarden](/terms) aangezien deze sitebreed van toepassing zijn.


## Informatie Niet Verzameld {#information-not-collected}

**Met uitzondering van de informatie die uitdrukkelijk in dit beleid wordt beschreven (waaronder [foutenlogboeken](#error-logs), [serverlogboeken](#server-logs), [uitgaande SMTP-e-mails](#outbound-smtp-emails), [accountinformatie](#account-information), [tijdelijke gegevensverwerking](#temporary-data-processing), [auditlogboeken](#audit-logs), [cookies en sessies](#cookies-and-sessions), [analytics](#analytics) en [apps en webmail](#apps-and-webmail)):**

* Wij slaan geen doorgestuurde e-mails op op schijfopslag of in databases.
* Wij slaan geen metagegevens over doorgestuurde e-mails op op schijfopslag of in databases.
* Behalve zoals uitdrukkelijk beschreven in dit beleid, slaan wij geen logboeken of IP-adressen op op schijfopslag of in databases.
* Wij gebruiken geen analyse- of telemetriediensten van derden.


## Informatie Verzameld {#information-collected}

Voor transparantie kunt u te allen tijde <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">onze broncode bekijken</a> om te zien hoe onderstaande informatie wordt verzameld en gebruikt.

**Strikt voor functionaliteit en ter verbetering van onze dienst verzamelen en bewaren wij veilig de volgende informatie:**

### Accountinformatie {#account-information}

* Wij slaan uw e-mailadres op dat u aan ons verstrekt.
* Wij slaan uw domeinnamen, aliassen en configuraties op die u aan ons verstrekt.
* Wij slaan beperkte metagegevens voor accountbeveiliging op die nodig zijn om uw account te beschermen en de toegang te beheren, waaronder actieve website-sessie-identificatoren, tellers van mislukte inlogpogingen en de tijdstempel van de laatste inlogpoging.
* Alle aanvullende informatie die u vrijwillig aan ons verstrekt, zoals opmerkingen of vragen die per e-mail of op onze <a href="/help">help</a>-pagina aan ons zijn voorgelegd.


**Aanmeldingsattributie** (permanent opgeslagen op uw account):

Wanneer u een account aanmaakt, slaan wij de volgende informatie op om te begrijpen hoe gebruikers onze dienst vinden:

* Het verwijzende website-domein (niet de volledige URL)
* De eerste pagina die u op onze site bezocht, waarbij waarden zoals domeinnamen, ID's en tokens in het pad zijn vervangen door tijdelijke aanduidingen
* UTM-campagneparameters indien aanwezig in de URL

### E-mailopslag {#email-storage}

* Wij slaan e-mails en kalenderinformatie op in uw [versleutelde SQLite-database](/blog/docs/best-quantum-safe-encrypted-email-service) strikt voor uw IMAP/POP3/CalDAV/CardDAV-toegang en mailboxfunctionaliteit.
  * Let op: als u alleen onze e-maildoorstuurdiensten gebruikt, worden er geen e-mails opgeslagen op schijf of in een database zoals beschreven in [Informatie Niet Verzameld](#information-not-collected).
  * Onze e-maildoorstuurdiensten werken alleen in het geheugen (geen opslag op schijf of in databases).
  * IMAP/POP3/CalDAV/CardDAV-opslag is versleuteld in rust, versleuteld tijdens overdracht en opgeslagen op een LUKS-versleutelde schijf.
  * Back-ups van uw IMAP/POP3/CalDAV/CardDAV-opslag zijn versleuteld in rust, versleuteld tijdens overdracht en opgeslagen op [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/).

### Foutlogboeken {#error-logs}

* Wij bewaren `4xx` en `5xx` SMTP-responscode [foutlogboeken](/faq#do-you-store-error-logs) gedurende 7 dagen.
* Foutlogboeken bevatten de SMTP-fout, envelop en e-mailheaders (wij slaan **niet** de e-mailinhoud of bijlagen op).
* Foutlogboeken kunnen IP-adressen en hostnamen van verzendende servers bevatten voor debugdoeleinden.
* Foutlogboeken voor [rate limiting](/faq#do-you-have-rate-limiting) en [greylisting](/faq#do-you-have-a-greylist) zijn niet toegankelijk omdat de verbinding vroegtijdig wordt beëindigd (bijv. voordat `RCPT TO` en `MAIL FROM` commando's kunnen worden verzonden).
* Wij bewaren ook 7 dagen lang foutlogboeken van website- en API-verzoeken die mislukken of te lang duren, en van fouten op onze IMAP-, POP3-, CalDAV- en CardDAV-servers.
* Deze logboeken kunnen het IP-adres, de verzoek-URL (inclusief querystrings zoals zoektermen), verzoekheaders zoals de user agent, en het betrokken account of de betrokken alias bevatten.
* Wachtwoorden, API-tokens, cookies en de inhoud van verzoeken worden uit deze logboeken verwijderd voordat ze worden opgeslagen.

### Serverlogboeken {#server-logs}

* Onze servers schrijven voor elk website- en API-verzoek een logregel, die het IP-adres, de methode en URL van het verzoek (inclusief querystrings), verzoekheaders, de responsstatus en het ingelogde account kan bevatten.
* We gebruiken deze logboeken om problemen op te sporen en op te lossen en om misbruik te stoppen, en we bewaren ze maximaal 30 dagen.

### Uitgaande SMTP-e-mails {#outbound-smtp-emails}

* We bewaren [uitgaande SMTP-e-mails](/faq#do-you-support-sending-email-with-smtp) ongeveer 30 dagen.
  * Deze duur varieert op basis van de "Date" header; aangezien we toestaan dat e-mails in de toekomst worden verzonden als er een toekomstige "Date" header aanwezig is.
  * **Let op dat zodra een e-mail succesvol is afgeleverd of permanent een fout geeft, we de berichtinhoud zullen redigeren en verwijderen.**
  * Als u wilt dat de inhoud van uw uitgaande SMTP-e-mailberichten langer wordt bewaard dan de standaard 0 dagen (na succesvolle aflevering of permanente fout), ga dan naar Geavanceerde instellingen voor uw domein en voer een waarde in tussen `0` en `30`.
  * Sommige gebruikers vinden het prettig om de [Mijn Account > E-mails](/my-account/emails) preview-functie te gebruiken om te zien hoe hun e-mails worden weergegeven, daarom ondersteunen we een configureerbare bewaartermijn.
  * Let op dat we ook [OpenPGP/E2EE](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) ondersteunen.


## Tijdelijke gegevensverwerking {#temporary-data-processing}

De volgende gegevens worden tijdelijk in het geheugen of Redis verwerkt en worden **niet** permanent opgeslagen:

### Rate Limiting {#rate-limiting}

* IP-adressen worden tijdelijk in Redis gebruikt voor rate limiting doeleinden.
* Rate limiting gegevens verlopen automatisch (meestal binnen 24 uur).
* Dit voorkomt misbruik en zorgt voor eerlijk gebruik van onze diensten.

### Verbindingstracering {#connection-tracking}

* Aantal gelijktijdige verbindingen wordt per IP-adres bijgehouden in Redis.
* Deze gegevens verlopen automatisch wanneer verbindingen sluiten of na een korte time-out.
* Wordt gebruikt om misbruik van verbindingen te voorkomen en beschikbaarheid van de dienst te waarborgen.

### Authenticatiepogingen {#authentication-attempts}

* Mislukte authenticatiepogingen worden per IP-adres bijgehouden in Redis.
* Wij slaan ook beperkte authenticatie-metagegevens op accountniveau op, waaronder tellers van mislukte inlogpogingen en de tijdstempel van de laatste inlogpoging.
* Op Redis gebaseerde gegevens van authenticatiepogingen verlopen automatisch (doorgaans binnen 24 uur).
* Wordt gebruikt om brute-force-aanvallen op gebruikersaccounts te voorkomen.


## Auditlogs {#audit-logs}

Om u te helpen uw account en domeinen te monitoren en beveiligen, houden we auditlogs bij voor bepaalde wijzigingen. Deze logs worden gebruikt om notificatie-e-mails te sturen naar accounthouders en domeinbeheerders.

### Accountwijzigingen {#account-changes}

* We houden wijzigingen bij in belangrijke accountinstellingen (bijv. tweefactorauthenticatie, weergavenaam, tijdzone).
* Wanneer wijzigingen worden gedetecteerd, sturen we een e-mailnotificatie naar uw geregistreerde e-mailadres.
* Gevoelige velden (bijv. wachtwoord, API-tokens, herstelcodes) worden bijgehouden maar hun waarden worden in notificaties geredigeerd.
* Auditlogvermeldingen worden verwijderd nadat de notificatie-e-mail is verzonden.

### Wijzigingen in domeininstellingen {#domain-settings-changes}

Voor domeinen met meerdere beheerders bieden we gedetailleerde auditlogging om teams te helpen configuratiewijzigingen bij te houden:

**Wat we bijhouden:**

* Wijzigingen in domeininstellingen (bijv. bounce webhooks, spamfiltering, DKIM-configuratie)
* Wie de wijziging heeft aangebracht (e-mailadres van de gebruiker)
* Wanneer de wijziging is aangebracht (tijdstempel)
* Het IP-adres van waaruit de wijziging is aangebracht
* De browser/client user-agent string

**Hoe het werkt:**

* Alle domeinbeheerders ontvangen een enkele geconsolideerde e-mailnotificatie wanneer instellingen wijzigen.
* De notificatie bevat een tabel met elke wijziging, de gebruiker die het heeft gedaan, hun IP-adres en tijdstempel.
* Gevoelige velden (bijv. webhook-sleutels, API-tokens, DKIM-private sleutels) worden bijgehouden maar hun waarden worden geredigeerd.
* User-agent informatie is opgenomen in een inklapbare sectie "Technische details".
* Auditlogvermeldingen worden verwijderd nadat de notificatie-e-mail is verzonden.

**Waarom we dit verzamelen:**

* Om domeinbeheerders te helpen beveiligingsoverzicht te behouden
* Om teams in staat te stellen te auditen wie configuratiewijzigingen heeft aangebracht
* Om te helpen bij het oplossen van problemen als onverwachte wijzigingen optreden
* Om verantwoordelijkheid te bieden voor gedeeld domeinbeheer


## Cookies en sessies {#cookies-and-sessions}

* Wij slaan HTTP-only, ondertekende cookies en server-side sessiegegevens op voor uw websiteverkeer.
* Cookies gebruiken SameSite-bescherming.
* Wij slaan actieve website-sessie-identificatoren op uw account op om functies te ondersteunen zoals "log out other devices" en beveiligingsgerelateerde sessie-invalidatie.
* Sessiecookies verlopen na 30 dagen inactiviteit.
* Wij maken geen sessies aan voor bots of crawlers.
* Wij gebruiken cookies en sessies voor:
  * Authenticatie en inlogstatus
  * Tweefactorauthenticatie "remember me"-functionaliteit
  * Flash-berichten en meldingen
  * [Analytics](#analytics): de eerste pagina van uw bezoek, het verwijzende domein, UTM-campagneparameters en een paginateller


## Analytics {#analytics}

We gebruiken ons eigen privacygerichte analysetool om te begrijpen hoe onze diensten worden gebruikt. Dit systeem is ontworpen met privacy als kernprincipe:

**Wat we NIET verzamelen:**

* We slaan geen IP-adressen op
* We plaatsen geen aparte cookie voor analytics
* We gebruiken geen derde partij analysetools
* We volgen bezoekers niet over dagen of sessies heen wanneer ze niet zijn ingelogd

**Wat we WEL verzamelen:**

* Geaggregeerde paginaweergaven en servicegebruik (SMTP, IMAP, POP3, API, enz.)
* Type en versie van browser en besturingssysteem (geparsed uit user agent, ruwe data wordt verwijderd)
* Apparaattype (desktop, mobiel, tablet)
* Verwijzend domein (niet de volledige URL) en UTM-campagneparameters
* E-mailclienttype voor mailprotocollen (bijv. Thunderbird, Outlook)
* De opgevraagde pagina of het opgevraagde API-pad, waarin waarden zoals domeinnamen, ID's en tokens zijn vervangen door tijdelijke aanduidingen, en of het verzoek is gelukt
* Bij websitebezoeken de eerste pagina van het bezoek en een paginateller, die in uw sessie worden bewaard (zie [Cookies en sessies](#cookies-and-sessions))
* Wanneer u bent ingelogd, het ID van uw account, alias of domein, zodat we kunnen zien hoe elke dienst wordt gebruikt en problemen kunnen oplossen

**Gegevensbewaring:**

* Analyticsgebeurtenissen worden automatisch na 30 dagen verwijderd
* Totalen per uur, die niet aan een account zijn gekoppeld, worden 90 dagen bewaard
* Sessie-identificatoren rouleren dagelijks en kunnen niet worden gebruikt om bezoekers over dagen heen te volgen


## Apps en Webmail {#apps-and-webmail}

Deze sectie gaat over onze e-mailapps voor iOS, Android, macOS, Windows en Linux, en over onze webmail op <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a>, die dezelfde code delen. De apps bevatten geen advertentie- of trackingcode en geen analytics van derden.

### Gegevens op uw apparaat {#data-on-your-device}

* De apps slaan uw e-mails, contacten, agenda's, instellingen en inloggegevens op uw apparaat op, zodat ze snel laden en offline werken.
* Als u App Lock inschakelt, versleutelt de app opgeslagen e-mailinhoud, contacten en inloggegevens met een sleutel die wordt beschermd door uw PIN of passkey. Datums, mappen, labels en markeringen blijven onversleuteld, zodat de app uw e-mails kan sorteren en tellen.
* Als u uitlogt bij een account, worden de gegevens van dat account van uw apparaat verwijderd.

### Gegevens die de apps naar ons sturen {#data-the-apps-send-us}

* Uw alias-e-mailadres en wachtwoord bij elk verzoek, om u in te loggen.
* De e-mails, contacten, agenda's, labels en filters die u verstuurt, aanmaakt of wijzigt. We slaan e-mails, contacten en agenda's op zoals beschreven in [E-mailopslag](#email-storage), en e-mails die u verstuurt zoals beschreven in [Uitgaande SMTP-e-mails](#outbound-smtp-emails).
* Uw zoektermen, zodat we uw mailbox op onze servers kunnen doorzoeken. Zoektermen maken deel uit van de verzoek-URL en kunnen daardoor voorkomen in [foutlogboeken](#error-logs) en [serverlogboeken](#server-logs).
* Feedback die u vrijwillig vanuit de app verstuurt. Deze wordt vanaf uw alias naar ons supportteam gemaild, samen met eventuele diagnostische gegevens die u wilt meesturen.
* E-mails die u als spam meldt. De app stuurt deze door naar ons misbruikteam (of naar een ander adres dat u in de instellingen opgeeft).

### Pushmeldingen {#push-notifications}

* Wanneer u meldingen toestaat, registreert de app een pushtoken bij ons. We slaan dit op samen met het platform, de alias en het account waarvoor het bedoeld is, het tijdstip van de laatste aflevering en een apparaatnaam uit de user agent van de app, met daarin uw besturingssysteemversie en op Android uw apparaatmodel.
* We bewaren een pushtoken maximaal één jaar na het laatste gebruik. We verwijderen het eerder wanneer u uitlogt in de app, wanneer de aflevering drie keer achter elkaar mislukt, wanneer het aliaswachtwoord wordt gewijzigd, wanneer u de alias of uw account verwijdert of wanneer de alias overgaat naar een andere eigenaar.
* Op iOS en macOS lopen meldingen via Apple Push Notification service. In onze Android-app uit Google Play lopen ze via Firebase Cloud Messaging. Meldingen over nieuwe e-mails bevatten de naam en het adres van de afzender, het onderwerp, een korte preview en de mapnaam, ook voor e-mails die zonder zichtbare melding binnenkomen, zoals e-mails die in de map Ongewenst of Verzonden worden geplaatst. Wanneer e-mails, agenda's of contacten wijzigen, sturen we ook stille meldingen met identificatoren maar zonder e-mailinhoud, zodat de app up-to-date blijft.
* Met [UnifiedPush](https://unifiedpush.org/) op Android en met meldingen in een webbrowser wordt elke melding versleuteld, zodat alleen uw apparaat deze kan lezen.
* Onze Android-app uit Google Play bevat Firebase Cloud Messaging, dat een Firebase-installatie-ID, de appversie en apparaat- en SDK-gegevens naar Google stuurt. Onze Google-vrije Android-app van GitHub bevat geen Firebase.

### Afbeeldingen en links in e-mails {#images-and-links-in-emails}

* Afbeeldingen in e-mails worden geladen vanaf de servers van de afzender, die uw IP-adres kunnen zien en het moment waarop de afbeeldingen zijn geladen.
* De apps blokkeren standaard trackingpixels. U kunt ook alle externe afbeeldingen blokkeren onder Settings > Privacy & Security en ze daarna voor één e-mail tegelijk laden.
* Links in e-mails worden geopend in uw webbrowser.

### Overige verbindingen {#other-connections}

* Onze webmail vraagt bij GitHub zijn nieuwste versie op wanneer deze wordt geladen, wanneer u ernaar terugkeert en elke 10 minuten zolang deze geopend is. About & Help vraagt bij GitHub de nieuwste desktopversie op, en de desktopapps controleren bij GitHub of er updates zijn. GitHub ontvangt bij deze verzoeken uw IP-adres.


## Informatie Delen {#information-shared}

We delen uw informatie niet met derden, behalve met dienstverleners die onderdelen van onze dienst verzorgen, zoals Cloudflare (websitebeveiliging en versleutelde back-ups), Stripe en PayPal (betalingen), en de diensten die pushmeldingen op uw apparaten afleveren (zie [Pushmeldingen](#push-notifications)).

We kunnen verplicht zijn om te voldoen aan gerechtelijke bevelen (maar houd er rekening mee dat [we geen informatie verzamelen zoals hierboven vermeld onder "Informatie Niet Verzameld"](#information-not-collected), dus we zullen die informatie niet kunnen verstrekken).


## Informatie Verwijderen {#information-removal}

Als u op elk moment informatie wilt verwijderen die u aan ons heeft verstrekt, ga dan naar <a href="/my-account/security">Mijn Account > Beveiliging</a> en klik op "Account Verwijderen".

Vanwege misbruikpreventie en mitigatie kan uw account handmatige verwijderingscontrole door onze beheerders vereisen als u het binnen 5 dagen na uw eerste betaling verwijdert.

Dit proces duurt meestal minder dan 24 uur en is ingevoerd omdat gebruikers onze dienst spamden en vervolgens snel hun accounts verwijderden – waardoor we hun betaalmethode-fingerprint(s) in Stripe niet konden blokkeren.

Als u uw account verwijdert, worden ook de domeinen die u beheert, uw aliassen en de daarvoor geregistreerde pushtokens verwijderd. Het accountrecord zelf blijft bestaan, maar het e-mailadres, de factuurgegevens, het wachtwoord en de passkeys worden eruit verwijderd en de tweefactorauthenticatie en het API-token worden ingetrokken, en we bewaren de bijbehorende betalingsgegevens voor terugbetalingen en de boekhouding. Logboeken en analyticsgegevens die naar uw account verwijzen, worden verwijderd volgens de hierboven genoemde termijnen.

Om de gegevens van de apps van een apparaat te verwijderen, logt u uit in de app of de-installeert u deze.


## Aanvullende Openbaarmakingen {#additional-disclosures}

Deze site wordt beschermd door Cloudflare en het [Privacybeleid](https://www.cloudflare.com/privacypolicy/) en de [Servicevoorwaarden](https://www.cloudflare.com/website-terms/) zijn van toepassing.
