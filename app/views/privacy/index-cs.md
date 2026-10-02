# Zásady ochrany osobních údajů {#privacy-policy}

<!-- <img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email zásady ochrany osobních údajů" class="rounded-lg" /> -->


## Obsah {#table-of-contents}

* [Prohlášení o vyloučení odpovědnosti](#disclaimer)
* [Informace, které nejsou shromažďovány](#information-not-collected)
* [Shromažďované informace](#information-collected)
  * [Informace o účtu](#account-information)
  * [Ukládání e-mailů](#email-storage)
  * [Chybové záznamy](#error-logs)
  * [Serverové záznamy](#server-logs)
  * [Odchozí SMTP e-maily](#outbound-smtp-emails)
* [Dočasné zpracování dat](#temporary-data-processing)
  * [Omezení rychlosti](#rate-limiting)
  * [Sledování připojení](#connection-tracking)
  * [Pokusy o ověření](#authentication-attempts)
* [Auditní záznamy](#audit-logs)
  * [Změny účtu](#account-changes)
  * [Změny nastavení domény](#domain-settings-changes)
* [Cookies a relace](#cookies-and-sessions)
* [Analytika](#analytics)
* [Aplikace a webmail](#apps-and-webmail)
  * [Data ve vašem zařízení](#data-on-your-device)
  * [Data, která nám aplikace odesílají](#data-the-apps-send-us)
  * [Push notifikace](#push-notifications)
  * [Obrázky a odkazy v e-mailech](#images-and-links-in-emails)
  * [Další připojení](#other-connections)
* [Sdílené informace](#information-shared)
* [Odstranění informací](#information-removal)
* [Další zveřejnění](#additional-disclosures)


## Prohlášení o vyloučení odpovědnosti {#disclaimer}

Prosím, řiďte se našimi [Podmínkami](/terms), které platí pro celý web.


## Informace, které nejsou shromažďovány {#information-not-collected}

**S výjimkou informací výslovně popsaných v těchto zásadách (včetně [chybových protokolů](#error-logs), [serverových protokolů](#server-logs), [odchozích e-mailů SMTP](#outbound-smtp-emails), [informací o účtu](#account-information), [dočasného zpracování dat](#temporary-data-processing), [protokolů auditu](#audit-logs), [souborů cookie a relací](#cookies-and-sessions), [analytiky](#analytics) a [aplikací a webmailu](#apps-and-webmail)):**

* Neukládáme žádné přeposílané e-maily na disková úložiště ani do databází.
* Neukládáme žádná metadata o přeposílaných e-mailech na disková úložiště ani do databází.
* S výjimkou případů výslovně popsaných v těchto zásadách neukládáme protokoly ani IP adresy na disková úložiště ani do databází.
* Nepoužíváme žádné analytické ani telemetrické služby třetích stran.


## Shromažďované informace {#information-collected}

Pro transparentnost můžete kdykoli <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">zobrazit náš zdrojový kód</a> a zjistit, jak jsou níže uvedené informace shromažďovány a používány.

**Výhradně pro funkčnost a zlepšení našich služeb shromažďujeme a bezpečně ukládáme následující informace:**

### Informace o účtu {#account-information}

* Ukládáme vaši e-mailovou adresu, kterou nám poskytnete.
* Ukládáme vaše doménová jména, aliasy a konfigurace, které nám poskytnete.
* Ukládáme omezená bezpečnostní metadata účtu potřebná k ochraně vašeho účtu a správě přístupu, včetně identifikátorů aktivních relací na webových stránkách, počítadel neúspěšných pokusů o přihlášení a časového razítka posledního pokusu o přihlášení.
* Jakékoli další informace, které nám dobrovolně poskytnete, jako jsou komentáře nebo dotazy zaslané e-mailem nebo na naší stránce <a href="/help">nápovědy</a>.


**Přiřazení registrace** (trvale uložené na vašem účtu):

Když si vytvoříte účet, ukládáme následující informace, abychom pochopili, jak uživatelé nacházejí naši službu:

* Doména odkazujícího webu (nikoli celá URL)
* První stránka, kterou jste na našem webu navštívili, přičemž v její cestě jsou hodnoty, například názvy domén, ID a tokeny, nahrazeny zástupnými symboly
* Parametry kampaně UTM, pokud jsou přítomny v URL

### Ukládání e-mailů {#email-storage}

* Ukládáme e-maily a informace o kalendáři ve vaší [šifrované SQLite databázi](/blog/docs/best-quantum-safe-encrypted-email-service) výhradně pro váš přístup IMAP/POP3/CalDAV/CardDAV a funkčnost schránky.
  * Vezměte prosím na vědomí, že pokud používáte pouze naše služby přeposílání e-mailů, žádné e-maily nejsou ukládány na disk ani do databáze, jak je popsáno v [Informace, které nejsou shromažďovány](#information-not-collected).
  * Naše služby přeposílání e-mailů fungují pouze v paměti (žádné zápisy na diskové úložiště ani do databází).
  * Ukládání IMAP/POP3/CalDAV/CardDAV je šifrováno v klidu, šifrováno při přenosu a uloženo na disku šifrovaném pomocí LUKS.
  * Zálohy pro vaše úložiště IMAP/POP3/CalDAV/CardDAV jsou šifrovány v klidu, šifrovány při přenosu a uloženy na [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/).

### Chybové záznamy {#error-logs}

* Ukládáme [chybové záznamy](/faq#do-you-store-error-logs) s kódy odpovědi SMTP `4xx` a `5xx` po dobu 7 dnů.
* Chybové záznamy obsahují SMTP chybu, obálku a hlavičky e-mailu (**neukládáme** tělo e-mailu ani přílohy).
* Chybové záznamy mohou obsahovat IP adresy a názvy hostitelů odesílacích serverů pro účely ladění.
* Chybové záznamy pro [omezení rychlosti](/faq#do-you-have-rate-limiting) a [greylisting](/faq#do-you-have-a-greylist) nejsou přístupné, protože připojení končí dříve (např. před přenosem příkazů `RCPT TO` a `MAIL FROM`).
* Po dobu 7 dnů také ukládáme chybové záznamy neúspěšných nebo příliš dlouho trvajících požadavků na webové stránky a API i chyb na našich serverech IMAP, POP3, CalDAV a CardDAV.
* Tyto záznamy mohou obsahovat IP adresu, URL požadavku (včetně parametrů dotazu, například hledaných výrazů), hlavičky požadavku, jako je user agent, a příslušný účet nebo alias.
* Hesla, API tokeny, soubory cookie a těla požadavků jsou z těchto záznamů před uložením odstraněny.

### Serverové záznamy {#server-logs}

* Naše servery zapisují pro každý požadavek na webové stránky a API jeden řádek záznamu, který může obsahovat IP adresu, metodu a URL požadavku (včetně parametrů dotazu), hlavičky požadavku, stav odpovědi a přihlášený účet.
* Tyto záznamy používáme k hledání a odstraňování problémů a k zastavení zneužívání. Uchováváme je nejdéle 30 dní.

### Odchozí SMTP e-maily {#outbound-smtp-emails}

* Uchováváme [odchozí SMTP e-maily](/faq#do-you-support-sending-email-with-smtp) přibližně 30 dní.
  * Délka uchování se liší podle hlavičky "Date"; protože umožňujeme odesílání e-mailů do budoucna, pokud existuje budoucí hlavička "Date".
  * **Poznámka: Jakmile je e-mail úspěšně doručen nebo trvale chybně doručen, pak vymažeme a odstraníme tělo zprávy.**
  * Pokud chcete nastavit, aby tělo odchozího SMTP e-mailu bylo uchováváno déle než výchozích 0 dní (po úspěšném doručení nebo trvalé chybě), přejděte do Pokročilých nastavení pro vaši doménu a zadejte hodnotu mezi `0` a `30`.
  * Někteří uživatelé rádi používají náhledovou funkci [Můj účet > E-maily](/my-account/emails), aby viděli, jak jsou jejich e-maily zobrazeny, proto podporujeme konfigurovatelnou dobu uchování.
  * Poznámka: Také podporujeme [OpenPGP/E2EE](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).


## Dočasné zpracování dat {#temporary-data-processing}

Následující data jsou zpracovávána dočasně v paměti nebo v Redis a **nejsou** trvale ukládána:

### Omezení rychlosti {#rate-limiting}

* IP adresy jsou dočasně používány v Redis pro účely omezení rychlosti.
* Data o omezení rychlosti automaticky vyprší (obvykle do 24 hodin).
* To zabraňuje zneužití a zajišťuje spravedlivé používání našich služeb.

### Sledování připojení {#connection-tracking}

* Počty současných připojení jsou sledovány podle IP adresy v Redis.
* Tato data automaticky vyprší, když se připojení uzavřou nebo po krátkém časovém limitu.
* Používá se k prevenci zneužití připojení a zajištění dostupnosti služby.

### Pokusy o ověření {#authentication-attempts}

* Neúspěšné pokusy o ověření jsou sledovány podle IP adresy v Redis.
* Ukládáme také omezená metadata o ověřování na úrovni účtu, včetně počítadel neúspěšných pokusů o přihlášení a časového razítka posledního pokusu o přihlášení.
* Data o pokusech o ověření založená na Redis automaticky vyprší (obvykle do 24 hodin).
* Používá se k prevenci útoků hrubou silou na uživatelské účty.


## Auditní záznamy {#audit-logs}

Abychom vám pomohli sledovat a zabezpečit váš účet a domény, uchováváme auditní záznamy o určitých změnách. Tyto záznamy se používají k odesílání notifikačních e-mailů držitelům účtů a správcům domén.

### Změny účtu {#account-changes}

* Sledujeme změny důležitých nastavení účtu (např. dvoufaktorové ověření, zobrazované jméno, časové pásmo).
* Když jsou detekovány změny, odesíláme notifikační e-mail na vaši registrovanou e-mailovou adresu.
* Citlivá pole (např. heslo, API tokeny, klíče pro obnovení) jsou sledována, ale jejich hodnoty jsou v notifikacích skryty.
* Položky auditního záznamu jsou vymazány po odeslání notifikačního e-mailu.

### Změny nastavení domény {#domain-settings-changes}

Pro domény s více správci poskytujeme podrobné auditní záznamy, které pomáhají týmům sledovat změny konfigurace:

**Co sledujeme:**

* Změny nastavení domény (např. bounce webhooky, filtrování spamu, konfigurace DKIM)
* Kdo změnu provedl (e-mailová adresa uživatele)
* Kdy byla změna provedena (časové razítko)
* IP adresa, ze které byla změna provedena
* Řetězec user-agent prohlížeče/klienta

**Jak to funguje:**

* Všichni správci domény obdrží jedinou konsolidovanou notifikaci e-mailem, když dojde ke změně nastavení.
* Notifikace obsahuje tabulku s každou změnou, uživatelem, který ji provedl, jeho IP adresou a časovým razítkem.
* Citlivá pole (např. klíče webhooků, API tokeny, soukromé klíče DKIM) jsou sledována, ale jejich hodnoty jsou skryty.
* Informace o user-agent jsou zahrnuty v rozbalovací sekci „Technické detaily“.
* Položky auditního záznamu jsou vymazány po odeslání notifikačního e-mailu.

**Proč to sbíráme:**

* Aby správci domény mohli udržovat přehled o bezpečnosti
* Aby týmy mohly auditovat, kdo provedl změny konfigurace
* Abychom pomohli při řešení problémů, pokud dojde k neočekávaným změnám
* Abychom zajistili odpovědnost za sdílenou správu domény


## Cookies a relace {#cookies-and-sessions}

* Ukládáme podepsané soubory cookie pouze pro HTTP a data relací na straně serveru pro váš provoz na webových stránkách.
* Soubory cookie používají ochranu SameSite.
* Ukládáme identifikátory aktivních relací na webových stránkách ve vašem účtu pro podporu funkcí, jako je "odhlásit ostatní zařízení" a zneplatnění relací z bezpečnostních důvodů.
* Soubory cookie relace vyprší po 30 dnech nečinnosti.
* Nevytváříme relace pro boty nebo crawlery.
* Soubory cookie a relace používáme pro:
  * Ověřování a stav přihlášení
  * Funkci "pamatovat si mě" pro dvoufaktorové ověřování
  * Flash zprávy a upozornění
  * [Analytiku](#analytics): první stránka vaší návštěvy, doména referreru, parametry kampaně (UTM) a počet zobrazených stránek


## Analytics {#analytics}

Používáme vlastní analytický systém zaměřený na ochranu soukromí, abychom pochopili, jak jsou naše služby používány. Tento systém je navržen s ochranou soukromí jako základním principem:

**Co NE shromažďujeme:**

* Neukládáme IP adresy
* Nenastavujeme pro analytiku samostatný soubor cookie
* Nepoužíváme žádné analytické služby třetích stran
* Nesledujeme návštěvníky napříč dny nebo relacemi, pokud nejsou přihlášeni

**Co shromažďujeme:**

* Agregované zobrazení stránek a využití služeb (SMTP, IMAP, POP3, API atd.)
* Typ a verze prohlížeče a operačního systému (parsováno z user agenta, surová data jsou vyřazena)
* Typ zařízení (desktop, mobil, tablet)
* Doména referreru (nikoli celá URL) a parametry kampaně (UTM)
* Typ e-mailového klienta pro mailové protokoly (např. Thunderbird, Outlook)
* Cesta požadované stránky nebo API, ve které jsou hodnoty, například názvy domén, ID a tokeny, nahrazeny zástupnými symboly, a informace o tom, zda byl požadavek úspěšný
* U návštěv webu první stránka návštěvy a počet zobrazených stránek, uchovávané ve vaší relaci (viz [Cookies a relace](#cookies-and-sessions))
* Když jste přihlášeni, ID vašeho účtu, aliasu nebo domény, abychom viděli, jak se jednotlivé služby používají, a mohli řešit problémy

**Ukládání dat:**

* Analytické události jsou automaticky mazány po 30 dnech
* Hodinové součty, které nejsou propojeny s žádným účtem, jsou uchovávány 90 dní
* Identifikátory relací se denně mění a nelze je použít ke sledování návštěvníků napříč dny


## Aplikace a webmail {#apps-and-webmail}

Tato část se týká našich e-mailových aplikací pro iOS, Android, macOS, Windows a Linux a našeho webmailu na adrese <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a>, které sdílejí stejný kód. Aplikace neobsahují žádný reklamní ani sledovací kód ani analytiku třetích stran.

### Data ve vašem zařízení {#data-on-your-device}

* Aplikace ukládají vaše e-maily, kontakty, kalendáře, nastavení a přihlašovací údaje ve vašem zařízení, aby se rychle načítaly a fungovaly offline.
* Pokud zapnete App Lock, aplikace šifruje uložený obsah e-mailů, kontakty a přihlašovací údaje klíčem chráněným vaším PINem nebo přístupovým klíčem. Údaje o datu, složky, štítky a příznaky zůstávají nešifrované, aby aplikace mohla vaše e-maily řadit a počítat.
* Odhlášení z účtu odstraní jeho data z vašeho zařízení.

### Data, která nám aplikace odesílají {#data-the-apps-send-us}

* E-mailová adresa vašeho aliasu a heslo, které se odesílají s každým požadavkem, abychom vás mohli přihlásit.
* E-maily, kontakty, kalendáře, štítky a filtry, které odesíláte, vytváříte nebo měníte. E-maily, kontakty a kalendáře ukládáme tak, jak je popsáno v části [Ukládání e-mailů](#email-storage), a odeslané e-maily tak, jak je popsáno v části [Odchozí SMTP e-maily](#outbound-smtp-emails).
* Vaše hledané výrazy, abychom mohli prohledat vaši schránku na našich serverech. Hledané výrazy jsou součástí URL požadavku, takže se mohou objevit v [chybových záznamech](#error-logs) a [serverových záznamech](#server-logs).
* Zpětná vazba, kterou se rozhodnete odeslat z aplikace. Odešle se e-mailem z vašeho aliasu našemu týmu podpory spolu s diagnostickými údaji, které se rozhodnete přiložit.
* E-maily, které nahlásíte jako spam a které aplikace přepošle našemu týmu pro řešení zneužití (nebo na jinou adresu, kterou zadáte v nastavení).

### Push notifikace {#push-notifications}

* Když povolíte notifikace, aplikace u nás zaregistruje push token. Ukládáme ho spolu s platformou, aliasem a účtem, pro které je určen, časem jeho posledního doručení a názvem zařízení převzatým z user agenta aplikace, který obsahuje verzi vašeho operačního systému a v Androidu také model vašeho zařízení.
* Push token uchováváme nejdéle jeden rok od jeho posledního použití. Dříve ho smažeme, když se z aplikace odhlásíte, když se doručení třikrát po sobě nezdaří, když se změní heslo aliasu, když smažete alias či svůj účet nebo když alias přejde k jinému vlastníkovi.
* V systémech iOS a macOS jsou notifikace doručovány přes Apple Push Notification service. V naší aplikaci pro Android z Google Play jsou doručovány přes Firebase Cloud Messaging. Notifikace o nových e-mailech obsahují jméno a adresu odesílatele, předmět, krátký náhled a název složky, a to i u e-mailů, které přijdou bez upozornění, například u e-mailů zařazených do složky Nevyžádaná pošta nebo Odeslaná pošta. Když se změní e-maily, kalendáře nebo kontakty, posíláme také tiché notifikace s identifikátory, ale bez obsahu e-mailů, aby aplikace zůstala aktuální.
* Při použití [UnifiedPush](https://unifiedpush.org/) v Androidu a u notifikací ve webovém prohlížeči je každá notifikace šifrována tak, aby ji mohlo přečíst pouze vaše zařízení.
* Naše aplikace pro Android z Google Play obsahuje službu Firebase Cloud Messaging, která odesílá společnosti Google ID instalace Firebase, verzi aplikace a údaje o zařízení a SDK. Naše aplikace pro Android bez služeb Google, dostupná na GitHubu, Firebase neobsahuje.

### Obrázky a odkazy v e-mailech {#images-and-links-in-emails}

* Obrázky v e-mailech se načítají ze serverů odesílatele, které mohou vidět vaši IP adresu a čas, kdy byly obrázky načteny.
* Aplikace ve výchozím nastavení blokují sledovací pixely. V části Settings > Privacy & Security můžete také zablokovat všechny externí obrázky a pak je načítat vždy jen pro jeden e-mail.
* Odkazy v e-mailech se otevírají ve vašem webovém prohlížeči.

### Další připojení {#other-connections}

* Náš webmail zjišťuje na GitHubu svou nejnovější verzi, když se načte, když se do něj vrátíte a každých 10 minut, dokud je otevřený. About & Help zjišťuje na GitHubu nejnovější desktopové vydání a desktopové aplikace kontrolují na GitHubu dostupnost aktualizací. Spolu s těmito požadavky GitHub obdrží vaši IP adresu.


## Information Shared {#information-shared}

Vaše informace nesdílíme s žádnými třetími stranami, s výjimkou poskytovatelů služeb, kteří provozují části naší služby, například Cloudflare (ochrana webových stránek a šifrované zálohy), Stripe a PayPal (platby), a služeb, které doručují push notifikace do vašich zařízení (viz [Push notifikace](#push-notifications)).

Můžeme být nuceni vyhovět soudně nařízeným právním požadavkům (ale mějte na paměti, že [neshromažďujeme informace uvedené výše v části "Information Not Collected"](#information-not-collected), takže je ani nebudeme schopni poskytnout).


## Information Removal {#information-removal}

Pokud si kdykoli přejete odstranit informace, které jste nám poskytli, přejděte na <a href="/my-account/security">Můj účet > Zabezpečení</a> a klikněte na "Smazat účet".

Z důvodu prevence a zmírnění zneužití může být váš účet při smazání do 5 dnů od první platby vyžadovat manuální kontrolu našimi administrátory.

Tento proces obvykle trvá méně než 24 hodin a byl zaveden kvůli tomu, že uživatelé spamovali naší službu a pak rychle mazali své účty – což nám bránilo zablokovat jejich platební metodu (otisky) ve Stripe.

Při smazání účtu se odstraní také domény, které spravujete, vaše aliasy a push tokeny, které jsou pro ně zaregistrované. Samotný záznam účtu zůstává, přičemž se z něj odstraní e-mailová adresa, fakturační údaje, heslo a přístupové klíče a zneplatní se jeho dvoufaktorové ověřování a token API, a jeho záznamy o platbách uchováváme pro vracení peněz a účetnictví. Záznamy a analytická data, která se vztahují k vašemu účtu, se mažou podle lhůt uvedených výše.

Chcete-li odstranit data aplikací ze zařízení, odhlaste se z aplikace nebo ji odinstalujte.


## Additional Disclosures {#additional-disclosures}

Tato stránka je chráněna službou Cloudflare a platí zde její [Zásady ochrany soukromí](https://www.cloudflare.com/privacypolicy/) a [Podmínky služby](https://www.cloudflare.com/website-terms/).
