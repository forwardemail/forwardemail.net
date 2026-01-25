# O přeposílaném e-mailu {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Email team and company story" class="rounded-lg" />

# O přeposílaném e-mailu {#about-forward-email-1}

## Obsah {#table-of-contents}

* [Přehled](#overview)
* [Zakladatel a poslání](#founder-and-mission)
* [Časová osa](#timeline)
  * [2017 - Založení a spuštění](#2017---founding-and-launch)
  * [2018 - Infrastruktura a integrace](#2018---infrastructure-and-integration)
  * [2019 - Revoluce ve výkonu](#2019---performance-revolution)
  * [2020 – Zaměření na soukromí a bezpečnost](#2020---privacy-and-security-focus)
  * [2021 - Modernizace platformy](#2021---platform-modernization)
  * [2023 – Rozšíření infrastruktury a funkcí](#2023---infrastructure-and-feature-expansion)
  * [2024 – Optimalizace služeb a pokročilé funkce](#2024---service-optimization-and-advanced-features)
  * [2025 - Vylepšení ochrany soukromí a podpora protokolů](#2025---privacy-enhancements-and-protocol-support)
  * [2026 - Shoda s RFC a pokročilé filtrování](#2026---rfc-compliance-and-advanced-filtering)
* [Základní principy](#core-principles)
* [Aktuální stav](#current-status)

## Přehled {#overview}

> \[!TIP]
> Technické podrobnosti o naší architektuře, implementacích zabezpečení a plánu naleznete v dokumentu [Technická bílá kniha](https://forwardemail.net/technical-whitepaper.pdf).

Přeposílání e-mailů je služba [zdarma a s otevřeným zdrojovým kódem](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") [přeposílání e-mailů](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") zaměřená na uživatele [právo na soukromí](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy"). To, co začalo jako jednoduché řešení pro přeposílání e-mailů v roce 2017, se vyvinulo v komplexní e-mailovou platformu nabízející neomezený počet vlastních domén, neomezený počet e-mailových adres a aliasů, neomezený počet jednorázových e-mailových adres, ochranu proti spamu a phishingu, šifrované úložiště poštovní schránky a řadu pokročilých funkcí.

Službu spravuje a vlastní její původní zakládající tým designérů a vývojářů. Je postavena na 100% open-source softwaru s využitím [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") a [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").

## Zakladatel a poslání {#founder-and-mission}

Společnost Forward Email založil **Nicholas Baugh** v roce 2017. Podle uživatele [Technická bílá kniha pro přeposílání e-mailů](https://forwardemail.net/technical-whitepaper.pdf) Baugh zpočátku hledal cenově dostupné a jednoduché řešení pro povolení e-mailu na doménových jménech pro své vedlejší projekty. Po prozkoumání dostupných možností začal programovat vlastní řešení a 2. října 2017 zakoupil doménu `forwardemail.net`.

Poslání společnosti Forward Email přesahuje rámec poskytování e-mailových služeb – jejím cílem je transformovat přístup odvětví k ochraně soukromí a zabezpečení e-mailů. Mezi klíčové hodnoty společnosti patří transparentnost, kontrola uživatelů a ochrana soukromí prostřednictvím technické implementace, nikoli pouze prostřednictvím politických slibů.

## Časová osa {#timeline}

### 2017 - Založení a spuštění {#2017---founding-and-launch}

**2. října 2017**: Nicholas Baugh zakoupil doménu `forwardemail.net` poté, co prozkoumal cenově výhodná e-mailová řešení pro své vedlejší projekty.

**5. listopadu 2017**: Baugh vytvořil 634řádkový JavaScriptový soubor s použitím [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") pro přeposílání e-mailů pro libovolný vlastní název domény. Tato počáteční implementace byla publikována jako open-source pro [GitHub](https://github.com/forwardemail) a služba byla spuštěna pomocí GitHub Pages.

**Listopad 2017**: Po prvním vydání bylo oficiálně spuštěno přeposílání e-mailů. První verze byla založena čistě na DNS bez registrace účtu nebo registrace – pouze soubor README napsaný v Markdownu s pokyny. Uživatelé si mohli nastavit přeposílání e-mailů konfigurací záznamů MX tak, aby odkazovaly na `mx1.forwardemail.net` a `mx2.forwardemail.net`, a přidáním záznamu TXT s `forward-email=user@gmail.com`.

Jednoduchost a efektivita tohoto řešení přilákala pozornost významných vývojářů, včetně [David Heinemeier Hansson](https://dhh.dk) (tvůrce Ruby on Rails), který dodnes používá Forward Email na své doméně `dhh.dk`.

### 2018 - Infrastruktura a integrace {#2018---infrastructure-and-integration}

**Duben 2018**: Když společnost [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") spustila protokol [Služba DNS pro spotřebitele s prioritou soukromí](https://blog.cloudflare.com/announcing-1111/), služba Forward Email přešla z protokolu [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") na protokol [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") pro zpracování vyhledávání [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), což demonstruje závazek společnosti k volbám infrastruktury zaměřeným na soukromí.

**Říjen 2018**: Funkce Přeposílání e-mailů umožnila uživatelům „Odesílat poštu jako“ s parametry [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") a [Výhled](https://en.wikipedia.org/wiki/Outlook "Outlook"), čímž se rozšířily možnosti integrace s oblíbenými poskytovateli e-mailu.

### 2019 - Revoluce ve výkonu {#2019---performance-revolution}

**Květen 2019**: Vydána verze 2 pro Forward Email, která představovala zásadní přepracování původních verzí. Tato aktualizace se zaměřila na vylepšení [výkon](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") pomocí [proudy](https://en.wikipedia.org/wiki/Streams "Streams") z [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), čímž položil základy pro škálovatelnost platformy.

### 2020 – Zaměření na soukromí a bezpečnost {#2020---privacy-and-security-focus}

**Únor 2020**: Společnost Forward Email vydala plán Enhanced Privacy Protection, který uživatelům umožňuje vypnout nastavování záznamů veřejného DNS s aliasy konfigurace pro přesměrování e-mailů. Díky tomuto plánu jsou informace o aliasech e-mailů uživatele skryty před veřejným vyhledáváním na internetu. Společnost také vydala funkci, která umožňuje povolit nebo zakázat konkrétní aliasy a zároveň jim umožňuje zobrazovat se jako platné e-mailové adresy a vracet úspěšnou hodnotu [Stavové kódy SMTP](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes"), přičemž e-maily jsou okamžitě zahozeny (podobně jako při přesměrování výstupu na [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

**Duben 2020**: Poté, co společnost narazila na nespočet překážek u stávajících řešení pro detekci spamu, která nerespektovala zásady ochrany osobních údajů společnosti Forward Email, vydala svou první alfa verzi Spam Scanneru. Toto zcela bezplatné a open-source řešení [filtrování spamu](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") používá přístup [Naivní Bayesův spamový filtr](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") v kombinaci s ochranou [anti-phishing](https://en.wikipedia.org/wiki/Phishing "Phishing") a [Útok na homograf IDN](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack"). Společnost Forward Email také vydala [dvoufaktorové ověřování](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) s využitím [jednorázová hesla](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) pro zvýšení zabezpečení účtu.

**Květen 2020**: Funkce Forward Email povolila uživateli vlastní [přesměrování portů](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") jako alternativní řešení pro obejití blokování portů pomocí [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider"). Společnost také vydala [Bezplatné RESTful API pro přeposílání e-mailů](email-api) s kompletní dokumentací a příklady požadavků a odpovědí v reálném čase, spolu s podporou webhooků.

**Srpen 2020**: Funkce Forward Email přidala podporu pro systém ověřování e-mailů [Ověřený přijatý řetězec](arc) („ARC“), čímž se dále posílilo zabezpečení a doručitelnost e-mailů.

**23. listopadu 2020**: Služba Forward Email byla veřejně spuštěna po ukončení beta testování, což představuje významný milník ve vývoji platformy.

### 2021 - Modernizace platformy {#2021---platform-modernization}

**Únor 2021**: Společnost Forward Email provedla refaktoring své kódové základny, aby odstranila všechny závislosti [Krajta](https://en.wikipedia.org/wiki/Python_\(programming_language\) ("Python (programovací jazyk)"), což umožnilo, aby se jejich stack stal 100% [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") a [Node.js](https://en.wikipedia.org/wiki/Node.js). Toto architektonické rozhodnutí bylo v souladu se závazkem společnosti udržovat konzistentní technologický stack s otevřeným zdrojovým kódem.

**27. září 2021**: Přeposílání e-mailu [přidaná podpora](email-forwarding-regex-pattern-filter) pro aliasy pro přeposílání e-mailů, které odpovídají [regulární výrazy](https://en.wikipedia.org/wiki/Regular_expression "Regular expression"), což uživatelům poskytuje sofistikovanější možnosti směrování e-mailů.

### 2023 – Rozšíření infrastruktury a funkcí {#2023---infrastructure-and-feature-expansion}

**Leden 2023**: Společnost Forward Email spustila přepracovaný web optimalizovaný pro rychlost načítání stránek, čímž zlepšila uživatelský zážitek a výkon.

**Únor 2023**: Společnost přidala podporu pro [protokoly chyb](/faq#do-you-store-error-logs) a implementovala barevné schéma webových stránek [tmavý režim](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme), které reaguje na preference uživatelů a potřeby přístupnosti.

**Březen 2023**: Společnost Forward Email vydala [Mandarinka](https://github.com/forwardemail/tangerine#readme) a integrovala ho do celé své infrastruktury, což umožnilo použití [DNS přes HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) („DoH“) na aplikační vrstvě. Společnost také přidala podporu pro [MTA-STS](/faq#do-you-support-mta-sts) a přešla z [hCaptcha](/) na [Turniket Cloudflare](https://developers.cloudflare.com/turnstile).

**Duben 2023**: Implementace a automatizace zcela nové infrastruktury pro přeposílání e-mailů. Celá služba začala běžet na globálně vyvažovaném DNS s DNS založeným na blízkosti, s kontrolami stavu a failoverem pomocí [Cloudflare](https://cloudflare.com), čímž nahradil předchozí přístup DNS typu round robin. Společnost přešla na **bare metal servery** u více poskytovatelů, včetně [Vultr](https://www.vultr.com/?ref=429848) a [Digitální oceán](https://m.do.co/c/a7cecd27e071), kteří jsou oba kompatibilní s SOC 2 Type 1. Databáze MongoDB a Redis byly přesunuty do clusterovaných konfigurací s primárními a záložními uzly pro zajištění vysoké dostupnosti, end-to-end SSL šifrování, šifrování v klidu a obnovení v daném bodě (PITR).

**Květen 2023**: Společnost Forward Email spustila funkci **odchozí SMTP** pro požadavky [odesílání e-mailů přes SMTP](/faq#do-you-support-sending-email-with-smtp) a [odesílání e-mailů pomocí API](/faq#do-you-support-sending-email-with-api). Tato funkce zahrnuje vestavěná ochranná opatření pro zajištění vysoké doručitelnosti, moderní a robustní systém front a opakování a také funkci [podporuje protokolování chyb v reálném čase](/faq#do-you-store-error-logs).

**Listopad 2023**: Společnost Forward Email spustila funkci [**šifrované úložiště poštovní schránky**](/blog/docs/best-quantum-safe-encrypted-email-service) pro e-mail [Podpora IMAPu](/faq#do-you-support-receiving-email-with-imap), což představuje významný pokrok v oblasti ochrany soukromí a zabezpečení e-mailů.

**Prosinec 2023**: Společnost [přidaná podpora](/faq#do-you-support-pop3) pro monitorování [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [přístupové klíče a WebAuthn](/faq#do-you-support-passkeys-and-webauthn), [čas na doručení](/faq#i) a [OpenPGP pro úložiště IMAP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 – Optimalizace služeb a pokročilé funkce {#2024---service-optimization-and-advanced-features}

**Únor 2024**: Přeposílání e-mailů [přidána podpora kalendáře (CalDAV)](/faq#do-you-support-calendars-caldav), rozšiřující možnosti platformy nad rámec e-mailu o synchronizaci kalendáře.

**Březen až červenec 2024**: Společnost Forward Email vydala zásadní optimalizace a vylepšení svých služeb IMAP, POP3 a CalDAV s cílem zrychlit svou službu na úroveň alternativ, ne-li dokonce rychlejší.

**Červenec 2024**: Společnost [přidána podpora pro iOS Push](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) se chystá řešit nedostatečnou podporu příkazu IMAP `IDLE` v aplikaci Apple Mail na iOS, čímž umožní odesílání oznámení v reálném čase pro zařízení Apple iOS. Funkce Forward Email také přidala čas do monitorování doručené pošty („TTI“) pro vlastní službu a Yahoo/AOL a začala uživatelům umožňovat šifrování celého TXT záznamu DNS i v bezplatném tarifu. Jak bylo požadováno v dokumentech [Diskuse o Průvodcích ochranou osobních údajů](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) a [Problémy s GitHubem](https://github.com/forwardemail/forwardemail.net/issues/254), společnost přidala možnost pro aliasy buď tiše odmítnout `250`, měkce odmítnout `421` nebo tvrdě odmítnout `550`, pokud je tato možnost zakázána.

**Srpen 2024**: Funkce Forward Email přidala podporu pro export poštovních schránek ve formátech [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) a [Mbox](https://en.wikipedia.org/wiki/Mbox) (kromě stávajícího exportního formátu [SQLite](https://en.wikipedia.org/wiki/SQLite)), [Byla přidána podpora podpisů webhooků](https://forwardemail.net/faq#do-you-support-bounce-webhooks) a společnost začala uživatelům umožňovat odesílání newsletterů, oznámení a e-mailového marketingu prostřednictvím své odchozí služby SMTP. Byly také implementovány kvóty úložiště pro IMAP/POP3/CalDAV v rámci celé domény a pro specifické aliasy.

### 2025 - Vylepšení ochrany soukromí a podpora protokolů {#2025---privacy-enhancements-and-protocol-support}

**Září 2024 až leden 2025**: Přeposílání e-mailů [přidána velmi žádaná funkce odpovědi na dovolenou a šifrování OpenPGP/WKD pro přeposílání e-mailů](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254) na základě již implementovaných možností šifrovaného úložiště poštovních schránek.

**21. ledna 2025**: Nejlepší přítel zakladatele „Jack“, jeho věrný psí společník, pokojně zemřel ve věku téměř 11 let. Jack [bude vždycky vzpomínáno](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) za jeho neochvějnou společnost, která podpořila vznik služby Forward Email. [Technická bílá kniha pro přeposílání e-mailů](https://forwardemail.net/technical-whitepaper.pdf) je věnováno Jackovi a uznává jeho roli při vývoji služby.

**Únor 2025**: Služba Forward Email přešla na [Datový paket](https://www.datapacket.com) jako nového primárního poskytovatele datového centra a implementovala vlastní, výkonnostně orientovaný hardware bez nutnosti instalace pro další zvýšení spolehlivosti a rychlosti služeb.

**Červen 2025**: Služba Forward Email spustila podporu pro [Protokol CardDAV](/faq#do-you-support-contacts-carddav), čímž rozšířila možnosti platformy o synchronizaci kontaktů vedle stávajících e-mailových a kalendářových služeb.

### 2026 - Shoda s RFC a pokročilé filtrování {#2026---rfc-compliance-and-advanced-filtering}

**Leden 2026**: Forward Email vydal komplexní [dokument o shodě s protokolem RFC](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison) s podrobnostmi o úplné podpoře standardů SMTP, IMAP, POP3 a CalDAV. Platforma také přidala [podporu REQUIRETLS (RFC 8689)](/faq#requiretls-support) pro vynucené šifrování TLS při přenosu e-mailů, [šifrování S/MIME (RFC 8551)](/faq#do-you-support-smime-encryption) pro bezpečné podepisování a šifrování zpráv a komplexní [filtrování e-mailů Sieve (RFC 5228)](/faq#do-you-support-sieve-email-filtering) s [protokolem ManageSieve (RFC 5804)](/faq#do-you-support-sieve-email-filtering) pro filtrování e-mailů na straně serveru. [REST API](/email-api) bylo rozšířeno na 39 koncových bodů pokrývajících zprávy, složky, kontakty, kalendáře a události kalendáře.

## Základní principy {#core-principles}

Od svého vzniku se společnost Forward Email pevně zavázala k zásadám ochrany soukromí a bezpečnosti:

**Filozofie 100% open-source**: Na rozdíl od konkurence, která open-source poskytuje pouze frontendovým komponentám, zatímco backendové komponenty nechává uzavřené, Forward Email zpřístupnil celou svou kódovou základnu – frontend i backend – k veřejné kontrole na [GitHub](https://github.com/forwardemail).

**Design zaměřený na soukromí**: Od prvního dne implementovala služba Forward Email unikátní přístup ke zpracování e-mailů v paměti, který zabraňuje zápisu e-mailů na disk, čímž se odlišuje od konvenčních e-mailových služeb, které ukládají zprávy do databází nebo souborových systémů.

**Neustálá inovace**: Služba se vyvinula z jednoduchého řešení pro přeposílání e-mailů na komplexní e-mailovou platformu s funkcemi, jako jsou šifrované poštovní schránky, kvantově odolné šifrování a podpora standardních protokolů včetně SMTP, IMAP, POP3 a CalDAV.

**Transparentnost**: Zpřístupnění veškerého kódu jako open-source a jeho dostupnosti k nahlédnutí, což zajišťuje, že si uživatelé mohou ověřit tvrzení o ochraně soukromí, a nebudou se spoléhat pouze na marketingová prohlášení.

**Kontrola uživatelů**: Poskytnutí uživatelům možností, včetně možnosti samostatného hostování celé platformy, pokud si to přejí.

## Aktuální stav {#current-status}

V roce 2025 služba Forward Email obsluhuje více než 500 000 domén po celém světě, včetně významných organizací a lídrů v oboru, jako například:

* **Technologické společnosti**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Mediální organizace**: Fox News Radio, Disney Ad Sales
* **Vzdělávací instituce**: The University of Cambridge, The University of Maryland, The University of Washington, Tufts University, Swarthmore College
* **Vládní subjekty**: Government of South Australia, Government of Dominican Republic
* **Další organizace**: RCD Hotels, Fly<span>.</span>io
* **Významní vývojáři**: Isaac Z. Schlueter (tvůrce npm), David Heinemeier Hansson (tvůrce Ruby on Rails)

Platforma se neustále vyvíjí s pravidelnými vydáváním funkcí a vylepšeními infrastruktury a udržuje si tak pozici jediné 100% open-source, šifrované, na soukromí zaměřené, transparentní a kvantově odolné e-mailové služby, která je dnes k dispozici.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />