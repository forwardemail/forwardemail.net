# Zásady ochrany osobních údajů {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email zásady ochrany osobních údajů" class="rounded-lg" />


## Obsah {#table-of-contents}

* [Prohlášení o vyloučení odpovědnosti](#disclaimer)
* [Informace, které nejsou shromažďovány](#information-not-collected)
* [Shromažďované informace](#information-collected)
  * [Informace o účtu](#account-information)
  * [Ukládání e-mailů](#email-storage)
  * [Chybové záznamy](#error-logs)
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
* [Sdílené informace](#information-shared)
* [Odstranění informací](#information-removal)
* [Další zveřejnění](#additional-disclosures)


## Prohlášení o vyloučení odpovědnosti {#disclaimer}

Prosím, řiďte se našimi [Podmínkami](/terms), které platí pro celý web.


## Informace, které nejsou shromažďovány {#information-not-collected}

**S výjimkou [chybových záznamů](#error-logs), [odchozích SMTP e-mailů](#outbound-smtp-emails) a/nebo při zjištění spamu či škodlivé aktivity (např. pro omezení rychlosti):**

* Neukládáme žádné přeposlané e-maily na diskové úložiště ani do databází.
* Neukládáme žádná metadata o přeposlaných e-mailech na diskové úložiště ani do databází.
* Neukládáme žádné záznamy ani IP adresy na diskové úložiště ani do databází.
* Nepoužíváme žádné analytické nebo telemetrické služby třetích stran.


## Shromažďované informace {#information-collected}

Pro transparentnost můžete kdykoli <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">zobrazit náš zdrojový kód</a> a zjistit, jak jsou níže uvedené informace shromažďovány a používány.

**Výhradně pro funkčnost a zlepšení našich služeb shromažďujeme a bezpečně ukládáme následující informace:**

### Informace o účtu {#account-information}

* Ukládáme vaši e-mailovou adresu, kterou nám poskytnete.
* Ukládáme vaše doménová jména, aliasy a konfigurace, které nám poskytnete.
* Jakékoli další informace, které nám dobrovolně poskytnete, například komentáře nebo dotazy zaslané e-mailem nebo na naší <a href="/help">nápovědě</a>.

**Přiřazení registrace** (trvale uložené na vašem účtu):

Když si vytvoříte účet, ukládáme následující informace, abychom pochopili, jak uživatelé nacházejí naši službu:

* Doména odkazujícího webu (nikoli celá URL)
* První stránka, kterou jste na našem webu navštívili
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
* Tato data automaticky vyprší (obvykle do 24 hodin).
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

* Ukládáme cookie v relaci pro provoz vašeho webu.
* Cookies jsou HTTP-only, podepsané a používají ochranu SameSite.
* Relace cookies vyprší po 30 dnech nečinnosti.
* Nevytváříme relace pro boty nebo prohledávače.
* Používáme cookies pro:
  * Ověření a stav přihlášení
  * Funkci „zapamatovat si mě“ pro dvoufaktorové ověření
  * Flash zprávy a notifikace
## Analytics {#analytics}

Používáme vlastní analytický systém zaměřený na ochranu soukromí, abychom pochopili, jak jsou naše služby používány. Tento systém je navržen s ochranou soukromí jako základním principem:

**Co NE shromažďujeme:**

* Neukládáme IP adresy
* Nepoužíváme cookies ani trvalé identifikátory pro analytiku
* Nepoužíváme žádné analytické služby třetích stran
* Nesledujeme uživatele napříč dny nebo relacemi

**Co shromažďujeme (anonymizované):**

* Agregované zobrazení stránek a využití služeb (SMTP, IMAP, POP3, API atd.)
* Typ prohlížeče a operačního systému (parsováno z user agenta, surová data jsou vyřazena)
* Typ zařízení (desktop, mobil, tablet)
* Doména referreru (nikoli celá URL)
* Typ e-mailového klienta pro mailové protokoly (např. Thunderbird, Outlook)

**Ukládání dat:**

* Analytická data jsou automaticky mazána po 30 dnech
* Identifikátory relací se denně mění a nelze je použít ke sledování uživatelů napříč dny


## Information Shared {#information-shared}

Vaše informace nesdílíme s žádnými třetími stranami.

Můžeme být nuceni vyhovět soudně nařízeným právním požadavkům (ale mějte na paměti, že [neshromažďujeme informace uvedené výše v části "Information Not Collected"](#information-not-collected), takže je ani nebudeme schopni poskytnout).


## Information Removal {#information-removal}

Pokud si kdykoli přejete odstranit informace, které jste nám poskytli, přejděte na <a href="/my-account/security">Můj účet > Zabezpečení</a> a klikněte na "Smazat účet".

Z důvodu prevence a zmírnění zneužití může být váš účet při smazání do 5 dnů od první platby vyžadovat manuální kontrolu našimi administrátory.

Tento proces obvykle trvá méně než 24 hodin a byl zaveden kvůli tomu, že uživatelé spamovali naší službu a pak rychle mazali své účty – což nám bránilo zablokovat jejich platební metodu (otisky) ve Stripe.


## Additional Disclosures {#additional-disclosures}

Tato stránka je chráněna službou Cloudflare a platí zde její [Zásady ochrany soukromí](https://www.cloudflare.com/privacypolicy/) a [Podmínky služby](https://www.cloudflare.com/website-terms/).
