# Privacybeleid {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email privacy policy" class="rounded-lg" />


## Inhoudsopgave {#table-of-contents}

* [Disclaimer](#disclaimer)
* [Informatie Niet Verzameld](#information-not-collected)
* [Informatie Verzameld](#information-collected)
  * [Accountinformatie](#account-information)
  * [E-mailopslag](#email-storage)
  * [Foutlogboeken](#error-logs)
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
* [Gedeelde Informatie](#information-shared)
* [Verwijdering van Informatie](#information-removal)
* [Aanvullende Openbaarmakingen](#additional-disclosures)


## Disclaimer {#disclaimer}

Raadpleeg onze [Voorwaarden](/terms) aangezien deze sitebreed van toepassing zijn.


## Informatie Niet Verzameld {#information-not-collected}

**Met uitzondering van de informatie die uitdrukkelijk in dit beleid wordt beschreven — waaronder [foutenlogboeken](#error-logs), [uitgaande SMTP-e-mails](#outbound-smtp-emails), [accountinformatie](#account-information), [tijdelijke gegevensverwerking](#temporary-data-processing), [auditlogboeken](#audit-logs) en [cookies en sessies](#cookies-and-sessions):**

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
* De eerste pagina die u op onze site bezocht
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


## Analytics {#analytics}

We gebruiken ons eigen privacygerichte analysetool om te begrijpen hoe onze diensten worden gebruikt. Dit systeem is ontworpen met privacy als kernprincipe:

**Wat we NIET verzamelen:**

* We slaan geen IP-adressen op
* We gebruiken geen cookies of persistente identificatoren voor analytics
* We gebruiken geen derde partij analysetools
* We volgen gebruikers niet over dagen of sessies heen

**Wat we WEL verzamelen (geanonimiseerd):**

* Geaggregeerde paginaweergaven en servicegebruik (SMTP, IMAP, POP3, API, enz.)
* Browser- en besturingssysteemtype (geparsed uit user agent, ruwe data wordt verwijderd)
* Apparaattype (desktop, mobiel, tablet)
* Verwijzend domein (niet de volledige URL)
* E-mailclienttype voor mailprotocollen (bijv. Thunderbird, Outlook)

**Gegevensbewaring:**

* Analyticsgegevens worden automatisch na 30 dagen verwijderd
* Sessie-identificatoren rouleren dagelijks en kunnen niet worden gebruikt om gebruikers over dagen heen te volgen


## Informatie Delen {#information-shared}

We delen uw informatie niet met derden.

We kunnen verplicht zijn om te voldoen aan gerechtelijke bevelen (maar houd er rekening mee dat [we geen informatie verzamelen zoals hierboven vermeld onder "Informatie Niet Verzameld"](#information-not-collected), dus we zullen die informatie niet kunnen verstrekken).


## Informatie Verwijderen {#information-removal}

Als u op elk moment informatie wilt verwijderen die u aan ons heeft verstrekt, ga dan naar <a href="/my-account/security">Mijn Account > Beveiliging</a> en klik op "Account Verwijderen".

Vanwege misbruikpreventie en mitigatie kan uw account handmatige verwijderingscontrole door onze beheerders vereisen als u het binnen 5 dagen na uw eerste betaling verwijdert.

Dit proces duurt meestal minder dan 24 uur en is ingevoerd omdat gebruikers onze dienst spamden en vervolgens snel hun accounts verwijderden – waardoor we hun betaalmethode-fingerprint(s) in Stripe niet konden blokkeren.


## Aanvullende Openbaarmakingen {#additional-disclosures}

Deze site wordt beschermd door Cloudflare en het [Privacybeleid](https://www.cloudflare.com/privacypolicy/) en de [Servicevoorwaarden](https://www.cloudflare.com/website-terms/) zijn van toepassing.
