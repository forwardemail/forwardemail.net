# Průvodce webmailem Forward Email {#forward-email-webmail-guide}

<p class="lead mt-3">
  <strong>TL;DR:</strong> Ve <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">webmailu</a> čtete a odesíláte poštu. Ve <a href="/my-account/domains">webovém panelu</a> nastavujete domény, aliasy a hesla. Do webmailu se přihlašujete adresou aliasu a heslem vygenerovaným v panelu. Webmail je zdarma a <a href="/faq#do-you-offer-a-webmail-client">open source</a> a stejná aplikace běží v prohlížeči, na počítači, na mobilu i v terminálu.
</p>


## Obsah {#table-of-contents}

* [Kde webmail získat](#where-to-get-webmail)
* [Webmail a webový panel](#webmail-and-the-web-dashboard)
* [Přihlášení](#signing-in)
  * [Vygenerujte heslo aliasu](#generate-an-alias-password)
  * [Přihlaste se do webmailu](#sign-in-to-webmail)
* [Používání více účtů](#using-more-than-one-account)
  * [Odeslání jako jiný přihlášený účet](#send-as-another-signed-in-account)
* [Odesílání z libovolné adresy na vaší doméně](#send-from-any-address-on-your-domain)
  * [Krok 1: Vygenerujte catch-all heslo v panelu](#step-1-generate-a-catch-all-password-in-the-dashboard)
  * [Krok 2: Uložte ho ve webmailu](#step-2-save-it-in-webmail)
  * [Krok 3: Při psaní zprávy vyberte adresu](#step-3-pick-the-address-when-you-compose)
  * [Co vědět o odesílání přes catch-all](#what-to-know-about-catch-all-sending)
* [Přehled nastavení webmailu](#webmail-settings-at-a-glance)
* [Soukromí a App Lock](#privacy-and-app-lock)
* [Řešení problémů](#troubleshooting)


## Kde webmail získat {#where-to-get-webmail}

| Platforma                       | Kde                                                                                                                       |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Prohlížeč                       | <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a> (bez instalace) |
| Počítač (macOS, Windows, Linux) | Naše <a href="/download">stránka ke stažení</a>                                                                           |
| Mobil (Android, iOS)            | Naše <a href="/download">stránka ke stažení</a>                                                                           |
| Terminál                        | Příkaz `forwardemail`. Viz [Máte terminálovou aplikaci](/faq#do-you-have-a-terminal-app)                                  |

Všechny vznikají ze stejného open-source projektu, takže vše v tomto průvodci platí pro každou z nich. Nastavení a uložená hesla se ukládají na každém zařízení zvlášť, proto je nastavte na každém zařízení, které používáte.


## Webmail a webový panel {#webmail-and-the-web-dashboard}

Forward Email má dvě oddělená místa pro přihlášení a každé používá jiné přihlašovací údaje:

|                               | Webový panel (forwardemail.net)                                                                     | Webmail (mail.forwardemail.net a aplikace)                                   |
| ----------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Přihlášení pomocí**         | E-mailu a hesla k vašemu účtu Forward Email (plus 2FA nebo passkey)                                 | Adresy aliasu (např. `you@example.com`) a jejího vygenerovaného hesla        |
| **Slouží k**                  | Přidání domén, DNS, aliasy, fakturace, členové týmu, generování hesel, Pokročilá nastavení          | Čtení a odesílání pošty, složky, štítky, hledání, kalendář, kontakty, filtry |
| **Zde vytvořená hesla**       | Hesla aliasů a catch-all hesla                                                                      | Žádná. Webmail používá hesla, která jste vytvořili v panelu                  |

Běžné nastavení vypadá takto:

1. V panelu přidejte svou doménu a nastavte DNS.
2. Vytvořte alias se zapnutým úložištěm IMAP (například `you@example.com`).
3. Vygenerujte pro tento alias heslo.
4. Přihlaste se do webmailu tímto aliasem a heslem.

Pro odesílání pošty musí mít vaše doména také zapnuté odchozí SMTP v <a href="/my-account/domains">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Pokročilá nastavení <i class="fa fa-angle-right"></i> Konfigurace odchozího SMTP, stejně jako u jakéhokoli jiného e-mailového klienta.


## Přihlášení {#signing-in}

### Vygenerujte heslo aliasu {#generate-an-alias-password}

1. Přejděte do <a href="/my-account/domains">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Aliasy.
2. Vedle aliasu klikněte na **Vygenerovat heslo**.
3. Zkopírujte heslo. Zobrazí se jen jednou.

Je to stejné heslo, jaké byste použili pro IMAP, POP3, SMTP, CalDAV a CardDAV. Do webového panelu se s ním přihlásit nelze.

### Přihlaste se do webmailu {#sign-in-to-webmail}

Otevřete webmail a zadejte celou adresu aliasu a vygenerované heslo. Pokud se chcete nejdřív jen porozhlédnout, vyzkoušejte demo z přihlašovací obrazovky.


## Používání více účtů {#using-more-than-one-account}

Můžete být přihlášeni k několika aliasům najednou, i na různých doménách. Přepínejte mezi nimi v nabídce účtu a spravujte je v **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Your accounts**. Účty se ukládají na zařízení, na kterém jste je přidali, a nesynchronizují se.

### Odeslání jako jiný přihlášený účet {#send-as-another-signed-in-account}

Při psaní zprávy nabídka **From** zobrazuje všechny účty přihlášené na tomto zařízení. Vyberte jeden a odešlete zprávu z jeho adresy. Zpráva se odešle s vlastním heslem tohoto účtu a kopie se uloží do složky Odeslané tohoto účtu.


## Odesílání z libovolné adresy na vaší doméně {#send-from-any-address-on-your-domain}

Pokud vlastníte doménu, můžete odesílat z libovolné adresy na ní, například `billing@example.com` nebo `no-reply@example.com`, aniž byste pro každou vytvářeli alias a přihlašovali se. K tomu slouží **catch-all heslo** pro doménu.

Do webmailu se **nepřihlašujete** jako wildcard ani catch-all účet a není potřeba zapínat žádnou funkci. Catch-all heslo jednou uložíte v nastavení webmailu a v nabídce From pak můžete napsat libovolnou adresu na této doméně.

### Krok 1: Vygenerujte catch-all heslo v panelu {#step-1-generate-a-catch-all-password-in-the-dashboard}

1. Přejděte do <a href="/my-account/domains">Můj účet <i class="fa fa-angle-right"></i> Domény</a> a vyberte svou doménu.
2. Otevřete **Pokročilá nastavení** a najděte **Catch-all hesla**.
3. Klikněte na **Vygenerovat heslo**. Nechte pole prázdné, abyste získali silné náhodné heslo, a pokud chcete, přidejte popis (například „Webmail na mém notebooku“).
4. Zkopírujte heslo. Zobrazí se jen jednou.

Abyste tuto sekci viděli, musíte být správcem domény. Pomocí **Správa hesel** na stejném místě můžete catch-all hesla později zobrazit nebo smazat. Smazané heslo přestane fungovat všude, kde je uložené.

### Krok 2: Uložte ho ve webmailu {#step-2-save-it-in-webmail}

1. Ve webmailu otevřete **Settings <i class="fa fa-angle-right"></i> General**.
2. Najděte kartu **Send from any address** hned pod **Your accounts**.
3. Klikněte na **Add catch-all password**.
4. Zadejte doménu (například `example.com`) a vložte catch-all heslo.
5. Klikněte na **Save**. Zobrazí se „You can now send from any address @example.com“.

Hesla si můžete uložit pro libovolný počet domén. Chcete-li některé odebrat, klikněte na ikonu koše vedle něj.

### Krok 3: Při psaní zprávy vyberte adresu {#step-3-pick-the-address-when-you-compose}

1. Začněte novou zprávu.
2. Otevřete nabídku **From**. Pod přihlášenými účty je položka pro každou uloženou doménu: **Other address @example.com…**
3. Vyberte ji. Řádek From se změní na textové pole, za kterým je `@example.com`.
4. Napište část před @ (například `billing`) a odešlete.

Koncepty si zadanou adresu pamatují, takže uložený koncept se znovu otevře se stejnou adresou odesílatele.

### Co vědět o odesílání přes catch-all {#what-to-know-about-catch-all-sending}

* **Umí jen odesílat.** Catch-all heslo funguje pouze pro odesílání. Neotevře schránku, takže s ním nemůžete číst poštu pro `billing@example.com`. Chcete-li číst odpovědi, vytvořte pro tuto adresu alias (nebo catch-all alias, který vám poštu přeposílá).
* **Odeslané kopie jdou do účtu, který používáte.** Zpráva odeslaná jako `billing@example.com` se uloží do složky Odeslané účtu, ze kterého jste ji psali.
* **Funguje ze všech účtů na zařízení.** Uložené heslo není vázané na jeden přihlášený účet. Může ho použít kterýkoli účet na tomto zařízení.
* **Zůstává na tomto zařízení.** Heslo je uložené jen na zařízení, kde jste ho uložili. Nesynchronizuje se a párování zařízení přes QR kód ho nezkopíruje. Přidejte ho znovu na každém zařízení.
* **Chrání ho App Lock.** Pokud je App Lock zapnutý, heslo je zašifrované spolu s ostatními lokálními daty a položky **Other address** jsou skryté, dokud je aplikace zamčená.
* **Plánované odeslání není k dispozici** pro adresy odesílané s catch-all heslem, protože toto heslo nedokáže naplánovanou zprávu načíst zpět ani zrušit. Odešlete zprávu hned, nebo ji odešlete jako přihlášený účet.
* **Špatné heslo vás neodhlásí.** Pokud je catch-all heslo špatné nebo bylo v panelu smazáno, odeslání selže s chybou a vy zůstanete přihlášeni.


## Přehled nastavení webmailu {#webmail-settings-at-a-glance}

| Sekce                  | Co zahrnuje                                                                             |
| ---------------------- | --------------------------------------------------------------------------------------- |
| **General**            | Vaše účty, odesílání z libovolné adresy (catch-all hesla), oznámení, úložiště           |
| **Appearance**         | Motiv, rozvržení, hustota, výchozí nastavení editoru, podpis, písmo, externí odkazy     |
| **Privacy & Security** | App Lock, šifrování PGP, možnosti soukromí, hlášení spamu                               |
| **Folders & Labels**   | Speciální složky, vaše složky, štítky                                                   |
| **Filters**            | Filtry pošty pro přihlášený alias                                                       |
| **Calendar**           | Začátek týdne a úkoly                                                                   |
| **Search**             | Indexování vyhledávání, stav indexu, uložená hledání, vyhledávací operátory             |
| **Advanced**           | Úložiště schránky, lokální mezipaměť a obnovení aplikace                                |
| **Keyboard Shortcuts** | Všechny klávesové zkratky                                                               |
| **About & Help**       | Verze, stažení desktopové aplikace, zpětná vazba a odkazy                               |

Věci, které patří k samotné doméně nebo aliasu, jako DNS, příjemci přeposílání, limity úložiště, automatické odpovědi v nepřítomnosti, catch-all hesla a kontrola spamu, se nastavují ve <a href="/my-account/domains">webovém panelu</a>.


## Soukromí a App Lock {#privacy-and-app-lock}

Webmail si uchovává lokální kopii vaší pošty, aby byl rychlý a fungoval offline. **App Lock** (v **Settings <i class="fa fa-angle-right"></i> Privacy & Security**) šifruje tato lokální data, vaše nastavení a uložená hesla na zařízení a odemyká se pomocí passkey nebo PINu. Pošta a živé aktualizace putují přímo mezi aplikací a Forward Email, bez reklamních nebo sledovacích služeb mezi nimi.


## Řešení problémů {#troubleshooting}

**„Can't send as <name@example.com>: sign in to that account on this device again, or save its domain's catch-all password in Settings.“**

Webmail nemá na tomto zařízení pro tuto adresu žádné heslo. Buď se přihlaste k tomuto aliasu, nebo uložte catch-all heslo domény v **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Send from any address**. Pokud je aplikace zamčená, nejdřív ji odemkněte.

**V nabídce From chybí položka „Other address“.**

Zkontrolujte, že jste na tomto zařízení uložili catch-all heslo a že je App Lock odemčený.

**Odesílání z catch-all adresy selže s chybou ověření.**

Catch-all heslo mohlo být smazáno nebo špatně zadáno. Vygenerujte v panelu nové, pak ve webmailu odeberte staré a přidejte nové.

**Moje heslo k panelu ve webmailu nefunguje.**

Webmail potřebuje heslo aliasu, ne heslo k panelu. Viz [Vygenerujte heslo aliasu](#generate-an-alias-password).

Stále si nevíte rady? Podívejte se na naše <a href="/faq">FAQ</a> nebo nás <a href="/help">kontaktujte</a>.
