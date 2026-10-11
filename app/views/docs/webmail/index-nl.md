# Forward Email Webmail-handleiding {#forward-email-webmail-guide}

<p class="lead mt-3">
  <strong>TL;DR:</strong> <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">Webmail</a> is waar je e-mail leest en verstuurt. Het <a href="/my-account/domains">webdashboard</a> is waar je domeinen, aliassen en wachtwoorden instelt. Je meldt je aan bij webmail met een aliasadres en een wachtwoord dat je in het dashboard hebt gegenereerd. Webmail is gratis en <a href="/faq#do-you-offer-a-webmail-client">open source</a>, en dezelfde app draait in de browser, op desktop, op mobiel en in een terminal.
</p>


## Inhoudsopgave {#table-of-contents}

* [Waar je webmail vindt](#where-to-get-webmail)
* [Webmail en het webdashboard](#webmail-and-the-web-dashboard)
* [Aanmelden](#signing-in)
  * [Een aliaswachtwoord genereren](#generate-an-alias-password)
  * [Aanmelden bij webmail](#sign-in-to-webmail)
* [Meer dan één account gebruiken](#using-more-than-one-account)
  * [Verzenden als een ander aangemeld account](#send-as-another-signed-in-account)
* [Verzenden vanaf elk adres op je domein](#send-from-any-address-on-your-domain)
  * [Stap 1: Genereer een catch-all-wachtwoord in het dashboard](#step-1-generate-a-catch-all-password-in-the-dashboard)
  * [Stap 2: Sla het op in webmail](#step-2-save-it-in-webmail)
  * [Stap 3: Kies het adres bij het opstellen](#step-3-pick-the-address-when-you-compose)
  * [Wat je moet weten over verzenden met catch-all](#what-to-know-about-catch-all-sending)
* [Webmail-instellingen in één oogopslag](#webmail-settings-at-a-glance)
* [Privacy en App Lock](#privacy-and-app-lock)
* [Problemen oplossen](#troubleshooting)


## Waar je webmail vindt {#where-to-get-webmail}

| Platform                        | Waar                                                                                                                                  |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Browser                         | <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a> (geen installatie nodig) |
| Desktop (macOS, Windows, Linux) | Onze <a href="/download">downloadpagina</a>                                                                                           |
| Mobiel (Android, iOS)           | Onze <a href="/download">downloadpagina</a>                                                                                           |
| Terminal                        | De opdracht `forwardemail`. Zie [Hebben jullie een terminal-app](/faq#do-you-have-a-terminal-app)                                     |

Ze worden allemaal gebouwd vanuit hetzelfde open-sourceproject, dus alles in deze handleiding geldt voor elk ervan. Instellingen en opgeslagen wachtwoorden worden per apparaat bewaard, dus stel ze in op elk apparaat dat je gebruikt.


## Webmail en het webdashboard {#webmail-and-the-web-dashboard}

Forward Email heeft twee aparte plekken om je aan te melden, en die gebruiken verschillende inloggegevens:

|                                | Webdashboard (forwardemail.net)                                                                          | Webmail (mail.forwardemail.net en de apps)                                         |
| ------------------------------ | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Aanmelden met**              | Het e-mailadres en wachtwoord van je Forward Email-account (plus 2FA of een passkey)                     | Een aliasadres (zoals `you@example.com`) en het gegenereerde wachtwoord ervan      |
| **Gebruikt voor**              | Domeinen toevoegen, DNS, aliassen, facturering, teamleden, wachtwoorden genereren, Geavanceerde instellingen | E-mail lezen en versturen, mappen, labels, zoeken, agenda, contacten, filters  |
| **Wachtwoorden die je hier maakt** | Aliaswachtwoorden en catch-all-wachtwoorden                                                          | Geen. Webmail gebruikt de wachtwoorden die je in het dashboard hebt gemaakt        |

Een gebruikelijke opzet ziet er zo uit:

1. Voeg in het dashboard je domein toe en stel DNS in.
2. Maak een alias aan met IMAP-opslag ingeschakeld (bijvoorbeeld `you@example.com`).
3. Genereer een wachtwoord voor die alias.
4. Meld je aan bij webmail met die alias en dat wachtwoord.

Om e-mail te versturen moet voor je domein ook uitgaande SMTP zijn ingeschakeld onder <a href="/my-account/domains">Mijn account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Geavanceerde instellingen <i class="fa fa-angle-right"></i> Uitgaande SMTP-configuratie, net als bij elke andere e-mailclient.


## Aanmelden {#signing-in}

### Een aliaswachtwoord genereren {#generate-an-alias-password}

1. Ga naar <a href="/my-account/domains">Mijn account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Aliassen.
2. Klik naast de alias op **Wachtwoord genereren**.
3. Kopieer het wachtwoord. Het wordt maar één keer getoond.

Dit is hetzelfde wachtwoord dat je voor IMAP, POP3, SMTP, CalDAV en CardDAV zou gebruiken. Je kunt er niet mee inloggen op het webdashboard.

### Aanmelden bij webmail {#sign-in-to-webmail}

Open webmail en voer het volledige aliasadres en het gegenereerde wachtwoord in. Wil je eerst alleen even rondkijken, probeer dan de demo vanaf het aanmeldscherm.


## Meer dan één account gebruiken {#using-more-than-one-account}

Je kunt je bij meerdere aliassen tegelijk aanmelden, zelfs op verschillende domeinen. Wissel ertussen via het accountmenu en beheer ze in **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Your accounts**. Accounts worden bewaard op het apparaat waarop je ze hebt toegevoegd en worden niet gesynchroniseerd.

### Verzenden als een ander aangemeld account {#send-as-another-signed-in-account}

Bij het opstellen toont het **From**-menu elk account dat op dit apparaat is aangemeld. Kies er een om vanaf dat adres te verzenden. Het bericht wordt verzonden met het eigen wachtwoord van dat account, en de kopie gaat naar de map Verzonden (Sent) van dat account.


## Verzenden vanaf elk adres op je domein {#send-from-any-address-on-your-domain}

Als je een domein bezit, kun je vanaf elk adres op dat domein verzenden, zoals `billing@example.com` of `no-reply@example.com`, zonder voor elk adres een alias aan te maken en je aan te melden. Dat doe je met een **catch-all-wachtwoord** voor het domein.

Je meldt je **niet** aan bij webmail als wildcard- of catch-all-account, en er is geen functie die je hoeft in te schakelen. Je slaat het catch-all-wachtwoord één keer op in de webmail-instellingen, en daarna kun je in het **From**-menu elk adres op dat domein typen.

### Stap 1: Genereer een catch-all-wachtwoord in het dashboard {#step-1-generate-a-catch-all-password-in-the-dashboard}

1. Ga naar <a href="/my-account/domains">Mijn account <i class="fa fa-angle-right"></i> Domeinen</a> en kies je domein.
2. Open **Geavanceerde instellingen** en zoek **Vangnetwachtwoorden**.
3. Klik op **Wachtwoord genereren**. Laat het veld leeg voor een sterk willekeurig wachtwoord, en voeg desgewenst een beschrijving toe (bijvoorbeeld "Webmail op mijn laptop").
4. Kopieer het wachtwoord. Het wordt maar één keer getoond.

Je moet beheerder van het domein zijn om dit onderdeel te zien. Gebruik **Wachtwoorden beheren** op dezelfde plek om catch-all-wachtwoorden later te bekijken of te verwijderen. Als je er een verwijdert, werkt het nergens meer waar het is opgeslagen.

### Stap 2: Sla het op in webmail {#step-2-save-it-in-webmail}

1. Open in webmail **Settings <i class="fa fa-angle-right"></i> General**.
2. Zoek de kaart **Send from any address**, net onder **Your accounts**.
3. Klik op **Add catch-all password**.
4. Voer het domein in (bijvoorbeeld `example.com`) en plak het catch-all-wachtwoord.
5. Klik op **Save**. Je ziet "You can now send from any address @example.com".

Je kunt wachtwoorden opslaan voor zoveel domeinen als je wilt. Klik op het prullenbakpictogram ernaast om er een te verwijderen.

### Stap 3: Kies het adres bij het opstellen {#step-3-pick-the-address-when-you-compose}

1. Begin een nieuw bericht.
2. Open het **From**-menu. Onder je aangemelde accounts staat voor elk opgeslagen domein een item: **Other address @example.com…**
3. Kies het. De From-regel wordt een tekstvak met `@example.com` erachter.
4. Typ het deel vóór de @ (bijvoorbeeld `billing`) en verstuur.

Concepten onthouden het adres dat je hebt getypt, dus een opgeslagen concept opent opnieuw met hetzelfde From-adres.

### Wat je moet weten over verzenden met catch-all {#what-to-know-about-catch-all-sending}

* **Het kan alleen verzenden.** Een catch-all-wachtwoord werkt alleen voor verzenden. Het kan geen mailbox openen, dus je kunt er geen e-mail voor `billing@example.com` mee lezen. Om antwoorden te lezen, maak je een alias (of een catch-all-alias die naar jou doorstuurt) voor dat adres.
* **Verzonden kopieën gaan naar het account dat je gebruikt.** Een bericht dat als `billing@example.com` is verzonden, komt in de map Verzonden (Sent) van het account waarmee je het hebt opgesteld.
* **Het werkt vanuit elk account op het apparaat.** Het opgeslagen wachtwoord is niet gekoppeld aan één aangemeld account. Elk account op dat apparaat kan het gebruiken.
* **Het blijft op dit apparaat.** Het wachtwoord wordt alleen opgeslagen op het apparaat waar je het hebt opgeslagen. Het wordt niet gesynchroniseerd, en apparaatkoppeling via QR kopieert het niet. Voeg het op elk apparaat opnieuw toe.
* **App Lock beschermt het.** Als App Lock aan staat, wordt het wachtwoord samen met de rest van je lokale gegevens versleuteld, en zijn de **Other address**-items verborgen zolang de app vergrendeld is.
* **Gepland verzenden is niet beschikbaar** voor adressen die met een catch-all-wachtwoord worden verzonden, omdat dat wachtwoord een gepland bericht niet kan teruglezen of annuleren. Verstuur meteen, of verstuur als een aangemeld account.
* **Een verkeerd wachtwoord meldt je niet af.** Als het catch-all-wachtwoord onjuist is of in het dashboard is verwijderd, mislukt het verzenden met een foutmelding en blijf je aangemeld.


## Webmail-instellingen in één oogopslag {#webmail-settings-at-a-glance}

| Onderdeel              | Wat het omvat                                                                                  |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| **General**            | Je accounts, verzenden vanaf elk adres (catch-all-wachtwoorden), meldingen, opslag             |
| **Appearance**         | Thema, indeling, dichtheid, standaardinstellingen voor opstellen, handtekening, lettertype, externe links |
| **Privacy & Security** | App Lock, PGP-versleuteling, privacyopties, spam melden                                        |
| **Folders & Labels**   | Speciale mappen, je mappen, labels                                                             |
| **Filters**            | E-mailfilters voor de aangemelde alias                                                         |
| **Calendar**           | Begin van de week en taken                                                                     |
| **Search**             | Zoekindexering, indexstatus, opgeslagen zoekopdrachten, zoekoperatoren                         |
| **Advanced**           | Mailboxopslag, lokale cache en de app resetten                                                 |
| **Keyboard Shortcuts** | Alle sneltoetsen                                                                               |
| **About & Help**       | Versie, desktop-app downloaden, feedback en links                                              |

Zaken die bij het domein of de alias zelf horen, zoals DNS, doorstuurontvangers, opslaglimieten, afwezigheidsberichten, catch-all-wachtwoorden en spamscans, stel je in het <a href="/my-account/domains">webdashboard</a> in.


## Privacy en App Lock {#privacy-and-app-lock}

Webmail bewaart een lokale kopie van je e-mail, zodat het snel is en offline werkt. **App Lock** (in **Settings <i class="fa fa-angle-right"></i> Privacy & Security**) versleutelt die lokale gegevens, je instellingen en je opgeslagen wachtwoorden op het apparaat, en ontgrendelt met een passkey of een pincode. E-mail en live-updates gaan rechtstreeks tussen de app en Forward Email, zonder advertentie- of trackingdiensten ertussen.


## Problemen oplossen {#troubleshooting}

**"Can't send as <name@example.com>: sign in to that account on this device again, or save its domain's catch-all password in Settings."**

Webmail heeft op dit apparaat geen wachtwoord voor dat adres. Meld je aan bij die alias, of sla het catch-all-wachtwoord van het domein op in **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Send from any address**. Is de app vergrendeld, ontgrendel hem dan eerst.

**Het item "Other address" ontbreekt in het From-menu.**

Controleer of je het catch-all-wachtwoord op dit apparaat hebt opgeslagen en of App Lock ontgrendeld is.

**Verzenden vanaf een catch-all-adres mislukt met een authenticatiefout.**

Het catch-all-wachtwoord is mogelijk verwijderd of verkeerd getypt. Genereer een nieuw wachtwoord in het dashboard, verwijder daarna het oude in webmail en voeg het nieuwe toe.

**Mijn dashboardwachtwoord werkt niet in webmail.**

Webmail heeft een aliaswachtwoord nodig, niet je dashboardwachtwoord. Zie [Een aliaswachtwoord genereren](#generate-an-alias-password).

Kom je er nog steeds niet uit? Bekijk onze <a href="/faq">FAQ</a> of <a href="/help">neem contact met ons op</a>.
