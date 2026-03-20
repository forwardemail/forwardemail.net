# O Forward Email {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Tým Forward Email a příběh společnosti" class="rounded-lg" />

# O Forward Email {#about-forward-email-1}


## Obsah {#table-of-contents}

* [Přehled](#overview)
* [Zakladatel a mise](#founder-and-mission)
* [Časová osa](#timeline)
  * [2017 - Založení a spuštění](#2017---founding-and-launch)
  * [2018 - Infrastruktura a integrace](#2018---infrastructure-and-integration)
  * [2019 - Revoluce ve výkonu](#2019---performance-revolution)
  * [2020 - Zaměření na soukromí a bezpečnost](#2020---privacy-and-security-focus)
  * [2021 - Modernizace platformy](#2021---platform-modernization)
  * [2023 - Rozšíření infrastruktury a funkcí](#2023---infrastructure-and-feature-expansion)
  * [2024 - Optimalizace služby a pokročilé funkce](#2024---service-optimization-and-advanced-features)
  * [2025 - Vylepšení soukromí a podpora protokolů {#2025---privacy-enhancements-and-protocol-support}](#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support)
  * [2026 - Soulad s RFC a pokročilé filtrování {#2026---rfc-compliance-and-advanced-filtering}](#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering)
* [Základní principy](#core-principles)
* [Současný stav](#current-status)


## Přehled {#overview}

> \[!TIP]
> Pro technické detaily o naší architektuře, implementacích bezpečnosti a plánu vývoje si přečtěte [Technický whitepaper](https://forwardemail.net/technical-whitepaper.pdf).

Forward Email je [bezplatná a open-source](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") služba pro [přeposílání e-mailů](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") zaměřená na uživatelovo [právo na soukromí](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy"). To, co začalo v roce 2017 jako jednoduché řešení pro přeposílání e-mailů, se vyvinulo v komplexní e-mailovou platformu nabízející neomezený počet vlastních domén, neomezený počet e-mailových adres a aliasů, neomezený počet jednorázových e-mailových adres, ochranu proti spamu a phishingu, šifrované úložiště schránek a řadu pokročilých funkcí.

Službu spravuje a vlastní původní zakládající tým designérů a vývojářů. Je postavena na 100% open-source softwaru využívajícím [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") a [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").


## Zakladatel a mise {#founder-and-mission}

Forward Email založil v roce 2017 **Nicholas Baugh**. Podle [Technického whitepaperu Forward Email](https://forwardemail.net/technical-whitepaper.pdf) Baugh původně hledal cenově dostupné a jednoduché řešení pro povolení e-mailů na doménách pro své vedlejší projekty. Po průzkumu dostupných možností začal kódovat vlastní řešení a 2. října 2017 zakoupil doménu `forwardemail.net`.

Mise Forward Email přesahuje poskytování e-mailových služeb – cílem je změnit přístup odvětví k ochraně soukromí a bezpečnosti e-mailů. Základní hodnoty společnosti zahrnují transparentnost, kontrolu uživatele a ochranu soukromí prostřednictvím technické implementace, nikoli pouze slibů v zásadách.


## Časová osa {#timeline}

### 2017 - Založení a spuštění {#2017---founding-and-launch}

**2. října 2017**: Nicholas Baugh zakoupil doménu `forwardemail.net` poté, co hledal cenově efektivní e-mailová řešení pro své vedlejší projekty.

**5. listopadu 2017**: Baugh vytvořil 634řádkový JavaScriptový soubor využívající [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") pro přeposílání e-mailů pro jakoukoli vlastní doménu. Toto počáteční řešení bylo zveřejněno jako open-source na [GitHubu](https://github.com/forwardemail) a služba byla spuštěna pomocí GitHub Pages.
**Listopad 2017**: Forward Email byl oficiálně spuštěn po počátečním vydání. Raná verze byla čistě založená na DNS bez registrace účtu nebo procesu přihlášení — jednoduše README soubor napsaný v Markdownu s instrukcemi. Uživatelé mohli nastavit přesměrování e-mailů konfigurací MX záznamů směřujících na `mx1.forwardemail.net` a `mx2.forwardemail.net` a přidáním TXT záznamu s `forward-email=user@gmail.com`.

Jednoduchost a efektivita tohoto řešení přitáhly pozornost významných vývojářů, včetně [Davida Heinemeiera Hanssona](https://dhh.dk) (tvůrce Ruby on Rails), který Forward Email na své doméně `dhh.dk` používá dodnes.

### 2018 - Infrastruktura a integrace {#2018---infrastructure-and-integration}

**Duben 2018**: Když [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") spustil svou [privacy-first consumer DNS službu](https://blog.cloudflare.com/announcing-1111/), Forward Email přešel z používání [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") na [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") pro zpracování [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System") dotazů, čímž demonstroval závazek společnosti k infrastruktuře zaměřené na ochranu soukromí.

**Říjen 2018**: Forward Email umožnil uživatelům „Odesílat poštu jako“ s [Gmailem](https://en.wikipedia.org/wiki/Gmail "Gmail") a [Outlookem](https://en.wikipedia.org/wiki/Outlook "Outlook"), čímž rozšířil integrační možnosti s populárními poskytovateli e-mailů.

### 2019 - Revoluce výkonu {#2019---performance-revolution}

**Květen 2019**: Forward Email vydal verzi v2, která představovala zásadní přepis oproti počátečním verzím. Tato aktualizace se zaměřila na zlepšení [výkonu](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") pomocí [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") [streamů](https://en.wikipedia.org/wiki/Streams "Streams"), čímž položila základy škálovatelnosti platformy.

### 2020 - Zaměření na soukromí a bezpečnost {#2020---privacy-and-security-focus}

**Únor 2020**: Forward Email vydal plán Enhanced Privacy Protection, který umožňuje uživatelům vypnout nastavování veřejných DNS záznamů s jejich aliasy pro přesměrování e-mailů. Díky tomuto plánu jsou informace o uživatelských e-mailových alíasech skryty před veřejným vyhledáváním na internetu. Společnost také vydala funkci pro povolení nebo zakázání konkrétních aliasů, přičemž tyto aliasy stále vypadají jako platné e-mailové adresy a vracejí úspěšné [SMTP stavové kódy](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes"), přičemž e-maily jsou okamžitě zahazovány (podobně jako přesměrování výstupu do [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

**Duben 2020**: Po mnoha překážkách s existujícími řešeními detekce spamu, která nerespektovala zásady ochrany soukromí Forward Email, společnost vydala svou počáteční alfa verzi Spam Scanneru. Toto zcela bezplatné a open-source [anti-spamové filtrování](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") řešení používá přístup [Naivního Bayesova spam filtru](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") kombinovaný s ochranou proti [phishingu](https://en.wikipedia.org/wiki/Phishing "Phishing") a [IDN homografovým útokům](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack"). Forward Email také vydal [dvojfaktorové ověřování](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) pomocí [jednorázových hesel](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) pro zvýšení bezpečnosti účtu.

**Květen 2020**: Forward Email umožnil vlastní [přesměrování portů](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") jako řešení pro uživatele, kteří chtějí obejít blokování portů ze strany svého [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider"). Společnost také vydala svůj [Free Email Forwarding RESTful API](email-api) s kompletní dokumentací a příklady požadavků a odpovědí v reálném čase, spolu s podporou webhooků.
**Srpen 2020**: Forward Email přidal podporu pro systém ověřování e-mailů [Authenticated Received Chain](arc) ("ARC"), čímž dále posílil bezpečnost a doručitelnost e-mailů.

**23. listopadu 2020**: Forward Email veřejně ukončil beta program, což znamenalo významný milník ve vývoji platformy.

### 2021 - Modernizace platformy {#2021---platform-modernization}

**Únor 2021**: Forward Email přepracoval svůj kódový základ a odstranil všechny závislosti na [Pythonu](https://en.wikipedia.org/wiki/Python_\(programming_language\) "Python (programming language)"), což umožnilo, aby jejich stack byl zcela založen na [JavaScriptu](https://en.wikipedia.org/wiki/JavaScript "JavaScript") a [Node.js](https://en.wikipedia.org/wiki/Node.js). Toto architektonické rozhodnutí bylo v souladu se závazkem společnosti udržovat konzistentní, open-source technologický stack.

**27. září 2021**: Forward Email [přidal podporu](email-forwarding-regex-pattern-filter) pro aliasy přeposílání e-mailů, které odpovídají [regulárním výrazům](https://en.wikipedia.org/wiki/Regular_expression "Regular expression"), což uživatelům poskytlo sofistikovanější možnosti směrování e-mailů.

### 2023 - Rozšíření infrastruktury a funkcí {#2023---infrastructure-and-feature-expansion}

**Leden 2023**: Forward Email spustil přepracovanou a optimalizovanou webovou stránku pro rychlost načítání, čímž zlepšil uživatelský zážitek a výkon.

**Únor 2023**: Společnost přidala podporu pro [chybové záznamy](/faq#do-you-store-error-logs) a implementovala [tmavý režim](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme) webu, reagující na preference uživatelů a potřeby přístupnosti.

**Březen 2023**: Forward Email vydal [Tangerine](https://github.com/forwardemail/tangerine#readme) a integroval jej do celé své infrastruktury, což umožnilo použití [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") na aplikační vrstvě. Společnost také přidala podporu pro [MTA-STS](/faq#do-you-support-mta-sts) a přešla z [hCaptcha](/) na [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile).

**Duben 2023**: Forward Email implementoval a plně automatizoval zcela novou infrastrukturu. Celá služba začala běžet na globálně vyváženém a blízkostně založeném DNS s kontrolami stavu a failoverem pomocí [Cloudflare](https://cloudflare.com), čímž nahradil předchozí přístup round-robin DNS. Společnost přešla na **bare metal servery** u více poskytovatelů, včetně [Vultr](https://www.vultr.com/?ref=429848) a [Digital Ocean](https://m.do.co/c/a7cecd27e071), oba poskytovatelé s certifikací SOC 2 Type 1. Databáze MongoDB a Redis byly přesunuty do clusterových konfigurací s primárními a záložními uzly pro vysokou dostupnost, end-to-end SSL šifrování, šifrování dat v klidu a obnovu dat k určitému časovému bodu (PITR).

**Květen 2023**: Forward Email spustil svou funkci **odchozího SMTP** pro [odesílání e-mailů přes SMTP](/faq#do-you-support-sending-email-with-smtp) a [odesílání e-mailů přes API](/faq#do-you-support-sending-email-with-api). Tato funkce obsahuje vestavěné ochrany pro zajištění vysoké doručitelnosti, moderní a robustní systém front a opakovaných pokusů a [podporuje chybové záznamy v reálném čase](/faq#do-you-store-error-logs).

**Listopad 2023**: Forward Email spustil svou funkci [**šifrovaného úložiště poštovní schránky**](/blog/docs/best-quantum-safe-encrypted-email-service) pro [podporu IMAP](/faq#do-you-support-receiving-email-with-imap), což představuje významný pokrok v ochraně soukromí a bezpečnosti e-mailů.

**Prosinec 2023**: Společnost [přidala podporu](/faq#do-you-support-pop3) pro [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [passkeys a WebAuthn](/faq#do-you-support-passkeys-and-webauthn), monitorování [doby doručení do schránky](/faq#i) a [OpenPGP pro IMAP úložiště](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 - Optimalizace služby a pokročilé funkce {#2024---service-optimization-and-advanced-features}

**Únor 2024**: Forward Email [přidal podporu kalendáře (CalDAV)](/faq#do-you-support-calendars-caldav), čímž rozšířil schopnosti platformy nad rámec e-mailu o synchronizaci kalendáře.
**Březen až červenec 2024**: Forward Email vydal významné optimalizace a vylepšení svých služeb IMAP, POP3 a CalDAV s cílem učinit svou službu stejně rychlou, ne-li rychlejší než alternativy.

**Červenec 2024**: Společnost [přidala podporu iOS Push](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) k řešení nedostatku podpory příkazu IMAP `IDLE` v Apple Mail na iOS, což umožnilo oznámení v reálném čase pro zařízení Apple iOS. Forward Email také přidal monitorování času do doručené pošty ("TTI") pro svou vlastní službu a Yahoo/AOL a začal uživatelům umožňovat šifrování celého DNS TXT záznamu i v bezplatném plánu. Jak bylo požadováno v [diskuzích Privacy Guides](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) a [GitHub issues](https://github.com/forwardemail/forwardemail.net/issues/254), společnost přidala možnost, aby aliasy buď tiše odmítaly `250`, měkce odmítaly `421` nebo tvrdě odmítaly `550`, když jsou zakázány.

**Srpen 2024**: Forward Email přidal podporu pro export poštovních schránek ve formátech [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) a [Mbox](https://en.wikipedia.org/wiki/Mbox) (kromě stávajícího exportního formátu [SQLite](https://en.wikipedia.org/wiki/SQLite)). [Byla přidána podpora podpisu webhooků](https://forwardemail.net/faq#do-you-support-bounce-webhooks) a společnost začala uživatelům umožňovat odesílání newsletterů, oznámení a e-mailového marketingu prostřednictvím své odchozí SMTP služby. Byly také implementovány kvóty úložiště na úrovni domény a specifické pro aliasy pro IMAP/POP3/CalDAV.

### 2025 - Vylepšení ochrany soukromí a podpora protokolů {#2025---privacy-enhancements-and-protocol-support} {#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support}

**Září 2024 až leden 2025**: Forward Email [přidal velmi žádanou funkci automatické odpovědi na dovolenou a šifrování OpenPGP/WKD pro přeposílání e-mailů](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254), navazující na již implementované možnosti šifrovaného ukládání poštovních schránek.

**21. ledna 2025**: Nejlepší přítel zakladatele "Jack", jeho věrný psí společník, pokojně zemřel ve věku téměř 11 let. Jack [bude vždy vzpomínán](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) za svou neochvějnou společnost, která podporovala vznik Forward Email. [Technický whitepaper Forward Email](https://forwardemail.net/technical-whitepaper.pdf) je věnován Jackovi, uznávajíc jeho roli ve vývoji služby.

**Únor 2025**: Forward Email přešel na [DataPacket](https://www.datapacket.com) jako svého nového hlavního poskytovatele datových center, implementující vlastní, výkonnostně zaměřený hardware na holém kovu pro další zvýšení spolehlivosti a rychlosti služby.

**Březen 2025**: Oficiálně byla vydána verze 1.0 Forward Email.

**Duben 2025**: Byla publikována první verze [Technického whitepaperu Forward Email](https://forwardemail.net/technical-whitepaper.pdf) a společnost začala přijímat platby v kryptoměnách.

**Květen 2025**: Služba spustila novou dokumentaci API pomocí [Scalar](https://github.com/scalar/scalar).

**Červen 2025**: Forward Email spustil podporu pro [protokol CardDAV](/faq#do-you-support-contacts-carddav), čímž rozšířil schopnosti platformy o synchronizaci kontaktů vedle stávajících e-mailových a kalendářových služeb.

**Srpen 2025**: Platforma přidala podporu [CalDAV VTODO/úkolů](https://en.wikipedia.org/wiki/ICalendar#To-do_\(VTODO\)), umožňující správu úkolů vedle kalendářových událostí.

**Listopad 2025**: Bezpečnost platformy byla vylepšena migrací z PBKDF2 na [Argon2id](https://en.wikipedia.org/wiki/Argon2) pro hashování hesel a infrastruktura byla migrována z Redis na [Valkey](https://github.com/valkey-io/valkey).

**Prosinec 2025**: Byla vydána verze 2.0, která zavedla podporu [REQUIRETLS (RFC 8689)](/rfc#requiretls-support) pro vynucené TLS šifrování při přenosu e-mailů a aktualizovala na [OpenPGP.js](https://github.com/openpgpjs/openpgpjs) verzi 6.
### 2026 - Soulad s RFC a pokročilé filtrování {#2026---rfc-compliance-and-advanced-filtering} {#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering}

**Leden 2026**: Forward Email vydal komplexní [dokument o souladu s RFC protokoly](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison) a přidal podporu pro [S/MIME šifrování (RFC 8551)](/faq#do-you-support-smime-encryption) a komplexní [Sieve filtrování e-mailů (RFC 5228)](/faq#do-you-support-sieve-email-filtering) s podporou [ManageSieve protokolu (RFC 5804)](/faq#do-you-support-sieve-email-filtering). REST API bylo také rozšířeno na 39 koncových bodů.

**Únor 2026**: Oficiální open-source webmail klient byl spuštěn na [mail.forwardemail.net](https://mail.forwardemail.net) ([zdrojový kód na GitHubu](https://github.com/forwardemail/mail.forwardemail.net)). Platforma také přidala podporu pro [CalDAV Scheduling Extensions (RFC 6638)](https://www.rfc-editor.org/rfc/rfc6638), [DANE/TLSA (RFC 6698)](https://en.wikipedia.org/wiki/DNS-based_Authentication_of_Named_Entities) a [Domain Connect](https://domainconnect.org) pro jedním kliknutím nastavení DNS. Byly spuštěny push notifikace v reálném čase pro IMAP, CalDAV a CardDAV pomocí WebSockets.

**Březen 2026**: Byla přidána podpora pro vlastní S3-kompatibilní úložiště na doménu, spolu s nástrojem příkazové řádky pro správu. Začala práce na multiplatformních desktopových a mobilních aplikacích pro macOS, Windows, Linux, iOS a Android využívajících stejný open-source webmail kód, postavených s [Tauri](https://tauri.app).


## Základní principy {#core-principles}

Od svého vzniku si Forward Email udržuje pevný závazek k zásadám ochrany soukromí a bezpečnosti:

**100% Open-Source filozofie**: Na rozdíl od konkurentů, kteří zveřejňují pouze frontend a backend drží uzavřený, Forward Email zpřístupnil celý svůj kód – frontend i backend – veřejné kontrole na [GitHubu](https://github.com/forwardemail).

**Návrh s důrazem na soukromí**: Od prvního dne Forward Email implementoval unikátní zpracování v paměti, které zabraňuje zápisu e-mailů na disk, čímž se odlišuje od běžných e-mailových služeb, které ukládají zprávy do databází nebo souborových systémů.

**Nepřetržitá inovace**: Služba se vyvinula z jednoduchého přesměrování e-mailů na komplexní e-mailovou platformu s funkcemi jako šifrované schránky, kvantově odolné šifrování a podporou standardních protokolů včetně SMTP, IMAP, POP3 a CalDAV.

**Transparentnost**: Veškerý kód je open-source a dostupný ke kontrole, což uživatelům umožňuje ověřit si tvrzení o ochraně soukromí místo pouhého spoléhání se na marketingová prohlášení.

**Kontrola uživatele**: Uživatelé mají možnost volby, včetně možnosti provozovat celou platformu sami, pokud si to přejí.


## Aktuální stav {#current-status}

K březnu 2026 Forward Email obsluhuje více než 500 000 domén po celém světě, včetně významných organizací a lídrů v oboru, jako jsou:

* **Technologické společnosti**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Mediální organizace**: Fox News Radio, Disney Ad Sales
* **Vzdělávací instituce**: University of Cambridge, University of Maryland, University of Washington, Tufts University, Swarthmore College
* **Vládní subjekty**: Vláda Jižní Austrálie, Vláda Dominikánské republiky
* **Další organizace**: RCD Hotels, Fly<span>.</span>io
* **Významní vývojáři**: Isaac Z. Schlueter (tvůrce npm), David Heinemeier Hansson (tvůrce Ruby on Rails)

Platforma se nadále vyvíjí pravidelnými vydáními nových funkcí a zlepšení infrastruktury, udržujíc si pozici jediné 100% open-source, šifrované, na soukromí zaměřené, transparentní a kvantově odolné e-mailové služby dostupné dnes.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />
