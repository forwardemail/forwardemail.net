# Guide till Forward Email webbmail {#forward-email-webmail-guide}

<p class="lead mt-3">
  <strong>Kort sagt:</strong> <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">Webbmail</a> är där du läser och skickar e-post. <a href="/my-account/domains">Webbpanelen</a> är där du konfigurerar domäner, alias och lösenord. Du loggar in på webbmailen med en aliasadress och ett lösenord som genererats i panelen. Webbmailen är gratis och har <a href="/faq#do-you-offer-a-webmail-client">öppen källkod</a>, och samma app körs i webbläsaren, på datorn, i mobilen och i en terminal.
</p>


## Innehållsförteckning {#table-of-contents}

* [Var du hittar webbmailen](#where-to-get-webmail)
* [Webbmail och webbpanelen](#webmail-and-the-web-dashboard)
* [Logga in](#signing-in)
  * [Generera ett aliaslösenord](#generate-an-alias-password)
  * [Logga in på webbmailen](#sign-in-to-webmail)
* [Använda mer än ett konto](#using-more-than-one-account)
  * [Skicka som ett annat inloggat konto](#send-as-another-signed-in-account)
* [Skicka från valfri adress på din domän](#send-from-any-address-on-your-domain)
  * [Steg 1: Generera ett allmänt lösenord i panelen](#step-1-generate-a-catch-all-password-in-the-dashboard)
  * [Steg 2: Spara det i webbmailen](#step-2-save-it-in-webmail)
  * [Steg 3: Välj adressen när du skriver](#step-3-pick-the-address-when-you-compose)
  * [Bra att veta om att skicka med allmänt lösenord](#what-to-know-about-catch-all-sending)
* [Webbmailens inställningar i korthet](#webmail-settings-at-a-glance)
* [Integritet och App Lock](#privacy-and-app-lock)
* [Felsökning](#troubleshooting)


## Var du hittar webbmailen {#where-to-get-webmail}

| Plattform                     | Var                                                                                                                              |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Webbläsare                    | <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a> (ingen installation) |
| Dator (macOS, Windows, Linux) | Vår <a href="/download">nedladdningssida</a>                                                                                     |
| Mobil (Android, iOS)          | Vår <a href="/download">nedladdningssida</a>                                                                                     |
| Terminal                      | Kommandot `forwardemail`. Se [Har ni en terminalapp](/faq#do-you-have-a-terminal-app)                                            |

Alla är byggda från samma projekt med öppen källkod, så allt i den här guiden gäller för var och en av dem. Inställningar och sparade lösenord lagras på varje enhet, så ställ in dem på alla enheter du använder.


## Webbmail och webbpanelen {#webmail-and-the-web-dashboard}

Forward Email har två separata ställen att logga in på, och de använder olika inloggningsuppgifter:

|                             | Webbpanelen (forwardemail.net)                                                                          | Webbmail (mail.forwardemail.net och apparna)                                    |
| --------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **Logga in med**            | E-postadressen och lösenordet för ditt Forward Email-konto (plus 2FA eller en passkey)                  | En aliasadress (som `you@example.com`) och dess genererade lösenord             |
| **Används för**             | Lägga till domäner, DNS, alias, fakturering, teammedlemmar, generera lösenord, Avancerade inställningar | Läsa och skicka e-post, mappar, etiketter, sökning, kalender, kontakter, filter |
| **Lösenord som skapas här** | Aliaslösenord och allmänna (catch-all) lösenord                                                         | Inga. Webbmailen använder lösenorden du skapade i panelen                       |

En vanlig konfiguration ser ut så här:

1. Lägg till din domän i panelen och konfigurera DNS.
2. Skapa ett alias med IMAP-lagring påslagen (till exempel `you@example.com`).
3. Generera ett lösenord för det aliaset.
4. Logga in på webbmailen med det aliaset och lösenordet.

För att skicka e-post måste din domän också ha utgående SMTP påslaget under <a href="/my-account/domains">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Avancerade inställningar <i class="fa fa-angle-right"></i> Utgående SMTP-konfiguration, precis som för alla andra e-postklienter.


## Logga in {#signing-in}

### Generera ett aliaslösenord {#generate-an-alias-password}

1. Gå till <a href="/my-account/domains">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Alias.
2. Klicka på **Generera lösenord** bredvid aliaset.
3. Kopiera lösenordet. Det visas bara en gång.

Det här är samma lösenord som du skulle använda för IMAP, POP3, SMTP, CalDAV och CardDAV. Det fungerar inte för att logga in i webbpanelen.

### Logga in på webbmailen {#sign-in-to-webmail}

Öppna webbmailen och ange hela aliasadressen och det genererade lösenordet. Om du bara vill titta runt först kan du prova demon från inloggningsskärmen.


## Använda mer än ett konto {#using-more-than-one-account}

Du kan logga in på flera alias samtidigt, även på olika domäner. Växla mellan dem från kontomenyn och hantera dem under **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Your accounts**. Konton sparas på den enhet där du lade till dem och synkroniseras inte.

### Skicka som ett annat inloggat konto {#send-as-another-signed-in-account}

När du skriver ett meddelande visar menyn **From** alla konton som är inloggade på den här enheten. Välj ett för att skicka från den adressen. Meddelandet skickas med kontots eget lösenord, och kopian hamnar i det kontots mapp Skickat.


## Skicka från valfri adress på din domän {#send-from-any-address-on-your-domain}

Om du äger en domän kan du skicka från vilken adress som helst på den, till exempel `billing@example.com` eller `no-reply@example.com`, utan att skapa ett alias och logga in för var och en. Det gör du med ett **allmänt lösenord** (catch-all) för domänen.

Du loggar **inte** in på webbmailen som ett wildcard- eller catch-all-konto, och det finns ingen funktion att slå på. Du sparar det allmänna lösenordet en gång i webbmailens inställningar, och sedan låter From-menyn dig skriva in vilken adress som helst på den domänen.

### Steg 1: Generera ett allmänt lösenord i panelen {#step-1-generate-a-catch-all-password-in-the-dashboard}

1. Gå till <a href="/my-account/domains">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> och välj din domän.
2. Öppna **Avancerade inställningar** och leta upp **Allmänna lösenord**.
3. Klicka på **Generera lösenord**. Lämna fältet tomt för att få ett starkt slumpmässigt lösenord, och lägg till en beskrivning om du vill (till exempel "Webbmail på min laptop").
4. Kopiera lösenordet. Det visas bara en gång.

Du måste vara administratör för domänen för att se det här avsnittet. Använd **Hantera lösenord** på samma ställe för att se eller ta bort allmänna lösenord senare. Om du tar bort ett slutar det att fungera överallt där det är sparat.

### Steg 2: Spara det i webbmailen {#step-2-save-it-in-webmail}

1. Öppna **Settings <i class="fa fa-angle-right"></i> General** i webbmailen.
2. Leta upp kortet **Send from any address**, precis under **Your accounts**.
3. Klicka på **Add catch-all password**.
4. Ange domänen (till exempel `example.com`) och klistra in det allmänna lösenordet.
5. Klicka på **Save**. Du ser då "You can now send from any address @example.com".

Du kan spara lösenord för hur många domäner du vill. Klicka på papperskorgsikonen bredvid ett lösenord för att ta bort det.

### Steg 3: Välj adressen när du skriver {#step-3-pick-the-address-when-you-compose}

1. Påbörja ett nytt meddelande.
2. Öppna menyn **From**. Under dina inloggade konton finns ett alternativ för varje sparad domän: **Other address @example.com…**
3. Välj det. From-raden blir en textruta med `@example.com` efter.
4. Skriv delen före @ (till exempel `billing`) och skicka.

Utkast behåller adressen du skrev, så ett sparat utkast öppnas igen med samma From-adress.

### Bra att veta om att skicka med allmänt lösenord {#what-to-know-about-catch-all-sending}

* **Det kan bara skicka.** Ett allmänt lösenord fungerar bara för att skicka. Det kan inte öppna en brevlåda, så du kan inte läsa e-post för `billing@example.com` med det. För att läsa svar skapar du ett alias (eller ett catch-all-alias som vidarebefordrar till dig) för den adressen.
* **Skickade kopior hamnar i kontot du använder.** Ett meddelande som skickas som `billing@example.com` sparas i mappen Skickat för det konto du skrev från.
* **Det fungerar från alla konton på enheten.** Det sparade lösenordet är inte knutet till ett enda inloggat konto. Alla konton på den enheten kan använda det.
* **Det stannar på den här enheten.** Lösenordet lagras bara på enheten där du sparade det. Det synkroniseras inte, och parkoppling av enheter via QR-kod kopierar det inte. Lägg till det igen på varje enhet.
* **App Lock skyddar det.** Om App Lock är påslaget krypteras lösenordet tillsammans med resten av dina lokala data, och alternativen **Other address** döljs medan appen är låst.
* **Schemalagd sändning är inte tillgänglig** för adresser som skickas med ett allmänt lösenord, eftersom det lösenordet inte kan läsa tillbaka eller avbryta ett schemalagt meddelande. Skicka direkt, eller skicka som ett inloggat konto.
* **Ett felaktigt lösenord loggar inte ut dig.** Om det allmänna lösenordet är fel eller har tagits bort i panelen misslyckas sändningen med ett fel, och du förblir inloggad.


## Webbmailens inställningar i korthet {#webmail-settings-at-a-glance}

| Avsnitt                | Vad det omfattar                                                                        |
| ---------------------- | --------------------------------------------------------------------------------------- |
| **General**            | Dina konton, skicka från valfri adress (allmänna lösenord), aviseringar, lagring        |
| **Appearance**         | Tema, layout, täthet, standardval för skrivfönstret, signatur, typsnitt, externa länkar |
| **Privacy & Security** | App Lock, PGP-kryptering, integritetsalternativ, rapportering av skräppost              |
| **Folders & Labels**   | Specialmappar, dina mappar, etiketter                                                   |
| **Filters**            | E-postfilter för det inloggade aliaset                                                  |
| **Calendar**           | Veckostart och uppgifter                                                                |
| **Search**             | Sökindexering, indexets hälsa, sparade sökningar, sökoperatorer                         |
| **Advanced**           | Lagring för brevlådan, lokal cache och återställning av appen                           |
| **Keyboard Shortcuts** | Alla kortkommandon                                                                      |
| **About & Help**       | Version, nedladdning av datorappen, feedback och länkar                                 |

Saker som hör till själva domänen eller aliaset, som DNS, mottagare för vidarebefordran, lagringsgränser, frånvaromeddelanden, allmänna lösenord och skräppostskanning, ställs in i <a href="/my-account/domains">webbpanelen</a>.


## Integritet och App Lock {#privacy-and-app-lock}

Webbmailen sparar en lokal kopia av din e-post så att den är snabb och fungerar offline. **App Lock** (under **Settings <i class="fa fa-angle-right"></i> Privacy & Security**) krypterar dessa lokala data, dina inställningar och dina sparade lösenord på enheten, och låses upp med en passkey eller en PIN-kod. E-post och liveuppdateringar går direkt mellan appen och Forward Email, utan några reklam- eller spårningstjänster emellan.


## Felsökning {#troubleshooting}

**"Can't send as <name@example.com>: sign in to that account on this device again, or save its domain's catch-all password in Settings."**

Webbmailen har inget lösenord för den adressen på den här enheten. Logga antingen in på det aliaset, eller spara domänens allmänna lösenord under **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Send from any address**. Om appen är låst måste du låsa upp den först.

**Alternativet "Other address" saknas i From-menyn.**

Kontrollera att du har sparat det allmänna lösenordet på den här enheten och att App Lock är upplåst.

**Att skicka från en catch-all-adress misslyckas med ett autentiseringsfel.**

Det allmänna lösenordet kan ha tagits bort eller skrivits fel. Generera ett nytt i panelen, ta sedan bort det gamla i webbmailen och lägg till det nya.

**Mitt panellösenord fungerar inte i webbmailen.**

Webbmailen behöver ett aliaslösenord, inte ditt panellösenord. Se [Generera ett aliaslösenord](#generate-an-alias-password).

Fortfarande problem? Se vår <a href="/faq">FAQ</a> eller <a href="/help">kontakta oss</a>.
