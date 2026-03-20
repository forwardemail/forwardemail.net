# Proč je open-source email budoucnost: Výhoda Forward Email {#why-open-source-email-is-the-future-the-forward-email-advantage}

<img loading="lazy" src="/img/articles/open-source.webp" alt="Open source email security and privacy" class="rounded-lg" />


## Obsah {#table-of-contents}

* [Předmluva](#foreword)
* [Výhoda open-source: Více než jen marketing](#the-open-source-advantage-more-than-just-marketing)
  * [Co skutečně znamená open-source](#what-true-open-source-means)
  * [Problém backendu: Kde většina „open-source“ emailových služeb selhává](#the-backend-problem-where-most-open-source-email-services-fall-short)
* [Forward Email: 100% open-source, frontend I backend](#forward-email-100-open-source-frontend-and-backend)
  * [Náš jedinečný technický přístup](#our-unique-technical-approach)
* [Možnost self-hostingu: Svoboda volby](#the-self-hosting-option-freedom-of-choice)
  * [Proč podporujeme self-hosting](#why-we-support-self-hosting)
  * [Realita self-hostingu emailu](#the-reality-of-self-hosting-email)
* [Proč má smysl naše placená služba (i když jsme open-source)](#why-our-paid-service-makes-sense-even-though-were-open-source)
  * [Porovnání nákladů](#cost-comparison)
  * [To nejlepší z obou světů](#the-best-of-both-worlds)
* [Dezinformace o uzavřeném zdrojovém kódu: Co vám Proton a Tutanota neříkají](#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you)
  * [Prohlášení Proton Mail o open-source](#proton-mails-open-source-claims)
  * [Podobný přístup Tutanoty](#tutanotas-similar-approach)
  * [Debata průvodců soukromím](#the-privacy-guides-debate)
* [Budoucnost je open-source](#the-future-is-open-source)
  * [Proč open-source vítězí](#why-open-source-is-winning)
* [Přechod na Forward Email](#making-the-switch-to-forward-email)
* [Závěr: Open-source email pro soukromou budoucnost](#conclusion-open-source-email-for-a-private-future)


## Předmluva {#foreword}

V době, kdy jsou obavy o digitální soukromí na historickém maximu, záleží na tom, jaké emailové služby si vybereme více než kdy jindy. Zatímco mnoho poskytovatelů tvrdí, že upřednostňují vaše soukromí, existuje zásadní rozdíl mezi těmi, kdo o soukromí jen mluví, a těmi, kdo ho skutečně dodržují. Ve Forward Email jsme vybudovali naši službu na základech úplné transparentnosti prostřednictvím open-source vývoje – nejen v našich frontendových aplikacích, ale v celé naší infrastruktuře.

Tento blogový příspěvek zkoumá, proč jsou open-source emailová řešení lepší než uzavřené alternativy, jak se náš přístup liší od konkurentů jako Proton Mail a Tutanota, a proč – navzdory naší podpoře self-hostingu – naše placená služba nabízí nejlepší hodnotu pro většinu uživatelů.


## Výhoda open-source: Více než jen marketing {#the-open-source-advantage-more-than-just-marketing}

Termín „open-source“ se v posledních letech stal populárním marketingovým heslem, přičemž globální trh s open-source službami má mezi lety 2024 a 2032 růst s CAGR přes 16 %\[^1]. Co ale skutečně znamená být open-source a proč je to důležité pro vaše emailové soukromí?

### Co skutečně znamená open-source {#what-true-open-source-means}

Open-source software zpřístupňuje celý svůj zdrojový kód zdarma komukoli k prohlížení, úpravám a vylepšování. Tato transparentnost vytváří prostředí, kde:

* bezpečnostní zranitelnosti mohou být identifikovány a opraveny globální komunitou vývojářů
* tvrzení o soukromí lze ověřit nezávislým přezkumem kódu
* uživatelé nejsou uvězněni v proprietárních ekosystémech
* inovace probíhají rychleji díky spolupráci

Pokud jde o email – páteř vaší online identity – tato transparentnost není jen příjemná, ale nezbytná pro skutečné soukromí a bezpečnost.

### Problém backendu: Kde většina „open-source“ emailových služeb selhává {#the-backend-problem-where-most-open-source-email-services-fall-short}

Tady to začíná být zajímavé. Mnoho populárních „soukromí zaměřených“ poskytovatelů emailu se prezentuje jako open-source, ale existuje zásadní rozdíl, který doufají, že si nevšimnete: **otevírají pouze své frontendové části, zatímco backendy drží uzavřené**.
Co to znamená? Frontend je to, co vidíte a s čím interagujete – webové rozhraní nebo mobilní aplikace. Backend je místo, kde se skutečně zpracovávají e-maily – kde jsou vaše zprávy uloženy, zašifrovány a přenášeny. Když poskytovatel udržuje svůj backend uzavřený:

1. Nemůžete ověřit, jak jsou vaše e-maily skutečně zpracovávány
2. Nemůžete potvrdit, zda jsou jejich tvrzení o ochraně soukromí legitimní
3. Důvěřujete marketingovým tvrzením místo ověřitelného kódu
4. Bezpečnostní zranitelnosti mohou zůstat skryté před veřejnou kontrolou

Jak bylo zdůrazněno v diskuzích na fórech Privacy Guides, jak Proton Mail, tak Tutanota tvrdí, že jsou open-source, ale jejich backendy zůstávají uzavřené a proprietární\[^2]. To vytváří významnou mezeru v důvěře – jste vyzváni, abyste věřili jejich slibům o ochraně soukromí bez možnosti je ověřit.


## Forward Email: 100% Open-Source, Frontend A BACKEND {#forward-email-100-open-source-frontend-and-backend}

Ve Forward Email jsme zvolili zásadně odlišný přístup. Celý náš kód – frontend i backend – je open-source a k dispozici pro kohokoli ke kontrole na <https://github.com/forwardemail/forwardemail.net>.

To znamená:

1. **Úplná transparentnost**: Každý řádek kódu, který zpracovává vaše e-maily, je k dispozici pro veřejnou kontrolu.
2. **Ověřitelná ochrana soukromí**: Naše tvrzení o ochraně soukromí nejsou marketingová řeč – jsou to ověřitelné fakty, které může kdokoli potvrdit prohlédnutím našeho kódu.
3. **Bezpečnost řízená komunitou**: Naše bezpečnost je posílena kolektivní odborností globální vývojářské komunity.
4. **Žádná skrytá funkčnost**: Co vidíte, to dostanete – žádné skryté sledování, žádné tajné zadní vrátka.

### Náš jedinečný technický přístup {#our-unique-technical-approach}

Náš závazek k ochraně soukromí jde nad rámec pouhého open-source. Implementovali jsme několik technických inovací, které nás odlišují:

#### Individuálně šifrované SQLite schránky {#individually-encrypted-sqlite-mailboxes}

Na rozdíl od tradičních poskytovatelů e-mailů, kteří používají sdílené relační databáze (kde by jediný průnik mohl odhalit data všech uživatelů), používáme individuálně šifrované SQLite soubory pro každou schránku. To znamená:

* Každá schránka je samostatný šifrovaný soubor
* Přístup k datům jednoho uživatele neznamená přístup k datům ostatních
* Dokonce ani naši zaměstnanci nemohou přistupovat k vašim datům – je to základní designové rozhodnutí

Jak jsme vysvětlili v diskuzích Privacy Guides:

> "Sdílené relační databáze (např. MongoDB, SQL Server, PostgreSQL, Oracle, MySQL atd.) všechny vyžadují přihlášení (uživatel/heslo) k navázání připojení k databázi. To znamená, že kdokoli s tímto heslem může databázi dotazovat na cokoli. Ať už jde o zlomyslného zaměstnance nebo útok typu evil maid. To také znamená, že mít přístup k datům jednoho uživatele znamená mít přístup ke všem ostatním. Na druhou stranu, SQLite by mohla být považována za sdílenou databázi, ale způsob, jak ji používáme (každá schránka = individuální SQLite soubor), ji činí sandboxovanou."\[^3]

#### Kvantově odolné šifrování {#quantum-resistant-encryption}

Zatímco ostatní poskytovatelé teprve dohánějí, my jsme již implementovali kvantově odolné šifrovací metody, abychom zajistili budoucí ochranu vašeho e-mailového soukromí před novými hrozbami kvantového počítání.

#### Žádné závislosti na třetích stranách {#no-third-party-dependencies}

Na rozdíl od konkurentů, kteří spoléhají na služby jako Amazon SES pro doručování e-mailů, jsme vybudovali celou naši infrastrukturu interně. To eliminuje potenciální úniky soukromí přes služby třetích stran a dává nám plnou kontrolu nad celým e-mailovým řetězcem.


## Možnost vlastního hostingu: Svoboda volby {#the-self-hosting-option-freedom-of-choice}

Jedním z nejsilnějších aspektů open-source softwaru je svoboda, kterou poskytuje. S Forward Email nikdy nejste v pasti – můžete si celý náš systém provozovat sami, pokud si to přejete.

### Proč podporujeme vlastní hosting {#why-we-support-self-hosting}

Věříme v poskytování úplné kontroly uživatelům nad jejich daty. Proto jsme celý náš systém zpřístupnili pro vlastní hosting s podrobnou dokumentací a návody na nastavení. Tento přístup:

* Poskytuje maximální kontrolu technicky zdatným uživatelům
* Odstraňuje potřebu důvěřovat nám jako poskytovateli služby
* Umožňuje přizpůsobení podle specifických požadavků
* Zajišťuje pokračování služby i v případě, že naše společnost přestane existovat
### Realita vlastního hostování e-mailu {#the-reality-of-self-hosting-email}

I když je vlastní hostování silnou možností, je důležité pochopit skutečné náklady, které s sebou nese:

#### Finanční náklady {#financial-costs}

* Náklady na VPS nebo server: 5–50 $/měsíc za základní nastavení\[^4]
* Registrace a obnova domény: 10–20 $/rok
* SSL certifikáty (i když Let's Encrypt nabízí bezplatné možnosti)
* Potenciální náklady na monitorovací služby a zálohovací řešení

#### Časové náklady {#time-costs}

* Počáteční nastavení: několik hodin až dní v závislosti na technických znalostech
* Průběžná údržba: 5–10 hodin/měsíc na aktualizace, bezpečnostní záplaty a řešení problémů\[^5]
* Křivka učení: pochopení e-mailových protokolů, bezpečnostních nejlepších praktik a správy serveru

#### Technické výzvy {#technical-challenges}

* Problémy s doručitelností e-mailů (zprávy označované jako spam)
* Držení kroku s vyvíjejícími se bezpečnostními standardy
* Zajištění vysoké dostupnosti a spolehlivosti
* Efektivní správa filtrování spamu

Jak řekl jeden zkušený vlastník vlastního hostingu: „E-mail je komoditní služba... Je levnější hostovat můj e-mail u [poskytovatele] než utrácet peníze *a* čas za vlastní hostování.“\[^6]


## Proč má smysl naše placená služba (i když jsme open-source) {#why-our-paid-service-makes-sense-even-though-were-open-source}

Vzhledem k výzvám vlastního hostování naše placená služba nabízí to nejlepší z obou světů: transparentnost a bezpečnost open-source spolu s pohodlím a spolehlivostí spravované služby.

### Porovnání nákladů {#cost-comparison}

Když zohledníte jak finanční, tak časové náklady, naše placená služba nabízí výjimečnou hodnotu:

* **Celkové náklady na vlastní hostování**: 56–252 $/měsíc (včetně nákladů na server a ocenění času)
* **Placené plány Forward Email**: 3–9 $/měsíc

Naše placená služba poskytuje:

* Profesionální správu a údržbu
* Zavedenou reputaci IP pro lepší doručitelnost
* Pravidelné bezpečnostní aktualizace a monitorování
* Podporu při řešení problémů
* Všechny výhody soukromí našeho open-source přístupu

### To nejlepší z obou světů {#the-best-of-both-worlds}

Volbou Forward Email získáte:

1. **Ověřitelné soukromí**: Náš open-source kód znamená, že můžete důvěřovat našim tvrzením o soukromí
2. **Profesionální správu**: Nemusíte se stát expertem na e-mailové servery
3. **Nákladovou efektivitu**: Nižší celkové náklady než při vlastním hostování
4. **Svobodu bez závislosti**: Možnost vlastního hostování je vždy k dispozici


## Zavádějící uzavřený zdroj: Co vám Proton a Tutanota neříkají {#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you}

Pojďme se podívat blíže na to, jak se náš přístup liší od populárních „soukromí zaměřených“ poskytovatelů e-mailu.

### Tvrzení Proton Mail o open-source {#proton-mails-open-source-claims}

Proton Mail se prezentuje jako open-source, ale to platí pouze pro jejich frontendové aplikace. Jejich backend – kde jsou vaše e-maily skutečně zpracovávány a ukládány – zůstává uzavřený zdroj\[^7]. To znamená:

* Nemůžete ověřit, jak jsou vaše e-maily zpracovávány
* Musíte důvěřovat jejich tvrzením o soukromí bez možnosti ověření
* Bezpečnostní zranitelnosti v jejich backendu zůstávají skryté před veřejnou kontrolou
* Jste uvězněni v jejich ekosystému bez možnosti vlastního hostování

### Podobný přístup Tutanoty {#tutanotas-similar-approach}

Stejně jako Proton Mail, i Tutanota zveřejňuje pouze svůj frontend, zatímco backend je proprietární\[^8]. Čelí stejným problémům s důvěrou:

* Není možné ověřit tvrzení o soukromí backendu
* Omezená transparentnost skutečného zpracování e-mailů
* Potenciální bezpečnostní problémy skryté před veřejností
* Uzamčení u dodavatele bez možnosti vlastního hostování

### Debata na Privacy Guides {#the-privacy-guides-debate}

Tato omezení nezůstala bez povšimnutí v komunitě zaměřené na soukromí. V diskuzích na Privacy Guides jsme zdůraznili tento zásadní rozdíl:

> „Uvádí se, že jak Protonmail, tak Tuta jsou uzavřený zdroj. Protože jejich backend je skutečně uzavřený zdroj.“\[^9]

Také jsme uvedli:

> „Dosud nebyly veřejně sdíleny žádné audity backendových infrastruktur žádného z aktuálně uvedených poskytovatelů e-mailových služeb na PG ani nebyly sdíleny open-source úryvky kódu, jak zpracovávají příchozí e-maily.“\[^10]
Tento nedostatek transparentnosti vytváří zásadní problém důvěry. Bez open-source backendů jsou uživatelé nuceni přijímat tvrzení o ochraně soukromí na víru místo ověření.


## Budoucnost je open-source {#the-future-is-open-source}

Trend směrem k open-source řešením se v softwarovém průmyslu zrychluje. Podle nedávného výzkumu:

* Trh s open-source softwarem roste z 41,83 miliard USD v roce 2024 na 48,92 miliard USD v roce 2025\[^11]
* 80 % společností hlásí zvýšené používání open-source v uplynulém roce\[^12]
* Očekává se, že adopce open-source bude i nadále rychle růst

Tento růst odráží zásadní posun v našem pohledu na bezpečnost a soukromí softwaru. Jak uživatelé získávají větší povědomí o ochraně soukromí, poptávka po ověřitelné ochraně soukromí prostřednictvím open-source řešení bude jen růst.

### Proč open-source vítězí {#why-open-source-is-winning}

Výhody open-source jsou stále jasnější:

1. **Bezpečnost díky transparentnosti**: Open-source kód může zkontrolovat tisíce expertů, nejen interní tým
2. **Rychlejší inovace**: Spolupráce urychluje zlepšování
3. **Důvěra díky ověření**: Tvrzení lze ověřit místo přijímání na víru
4. **Svoboda od závislosti na dodavateli**: Uživatelé si udržují kontrolu nad svými daty a službami
5. **Podpora komunity**: Globální komunita pomáhá identifikovat a opravovat problémy


## Přechod na Forward Email {#making-the-switch-to-forward-email}

Přechod na Forward Email je jednoduchý, ať už přecházíte od hlavního poskytovatele jako Gmail nebo od jiné služby zaměřené na soukromí jako Proton Mail či Tutanota.

Naše služba nabízí:

* Neomezené domény a aliasy
* Podpora standardních protokolů (SMTP, IMAP, POP3) bez proprietárních mostů
* Bezproblémovou integraci s existujícími e-mailovými klienty
* Jednoduchý proces nastavení s komplexní dokumentací
* Cenově dostupné plány začínající na pouhých 3 USD/měsíc


## Závěr: Open-source e-mail pro soukromou budoucnost {#conclusion-open-source-email-for-a-private-future}

Ve světě, kde je digitální soukromí stále více ohrožováno, poskytuje transparentnost open-source řešení klíčovou ochranu. Ve Forward Email jsme hrdí, že vedeme cestu s naším plně open-source přístupem k ochraně e-mailového soukromí.

Na rozdíl od konkurentů, kteří open-source přijímají jen částečně, jsme zpřístupnili celou naši platformu — frontend i backend — k veřejné kontrole. Tento závazek k transparentnosti, v kombinaci s naším inovativním technickým přístupem, poskytuje úroveň ověřitelné ochrany soukromí, kterou uzavřená řešení jednoduše nemohou nabídnout.

Ať už si zvolíte naši spravovanou službu, nebo si platformu hostujete sami, získáte bezpečnost, soukromí a klid na duši, které přináší skutečně open-source e-mail.

Budoucnost e-mailu je otevřená, transparentní a zaměřená na soukromí. Budoucnost je Forward Email.

\[^1]: SNS Insider. "The Open Source Services Market was valued at USD 28.6 billion in 2023 and will reach to USD 114.8 Billion by 2032, growing at a CAGR of 16.70% by 2032." [Open Source Services Market Size & Analysis Report 2032](https://www.snsinsider.com/reports/open-source-services-market-3322)

\[^2]: Privacy Guides Community. "Forward Email (email provider) - Site Development / Tool Suggestions." [Privacy Guides Discussion](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^3]: Privacy Guides Community. "Forward Email (email provider) - Site Development / Tool Suggestions." [Privacy Guides Discussion](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^4]: RunCloud. "Generally, you can expect to spend anywhere from $5 to $50 monthly for a basic virtual private server (VPS) to run your email server." [10 Best Self-Hosted Email Server Platforms to Use in 2025](https://runcloud.io/blog/best-self-hosted-email-server)

\[^5]: Mail-in-a-Box Forum. "Maintenance took me maybe 16 hours in that period..." [Self hosting mail server frowned upon](https://discourse.mailinabox.email/t/self-hosting-mail-server-frowned-upon/4143)
\[^6]: Reddit r/selfhosted. "Shrnutí: Jako u všeho self-hosted, BUDE TO VYŽADOVAT VÁŠ ČAS. Pokud na to nemáte čas, je vždy lepší zůstat u hostované služby..." [Self-hosting an email server? Why or why not? What's popular?](https://www.reddit.com/r/selfhosted/comments/1etb8jh/selfhosting_an_email_server_why_or_why_not_whats/)

\[^7]: Forward Email. "Proton Mail tvrdí, že je open-source, ale jejich backend je ve skutečnosti uzavřený." [Tutanota vs Proton Mail Comparison (2025)](https://forwardemail.net/blog/tutanota-vs-proton-mail-email-service-comparison)

\[^8]: Forward Email. "Tutanota tvrdí, že je open-source, ale jejich backend je ve skutečnosti uzavřený." [Proton Mail vs Tutanota Comparison (2025)](https://forwardemail.net/blog/proton-mail-vs-tutanota-email-service-comparison)

\[^9]: Privacy Guides Community. "Uvádí, že jak Protonmail, tak Tuta jsou closed source. Protože jejich backend je skutečně uzavřený." [Forward Email (email provider) - Site Development / Tool Suggestions](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^10]: Privacy Guides Community. "Nebyla zveřejněna žádná veřejná auditní zpráva backendových infrastruktur žádného aktuálně uvedeného poskytovatele e-mailových služeb PG ani nebyly sdíleny otevřené zdrojové kódy, jak zpracovávají příchozí e-maily." [Forward Email (email provider) - Site Development / Tool Suggestions](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^11]: IBM. "Trh s open source softwarem poroste z 41,83 miliard USD v roce 2024 na 48,92 miliard USD v roce 2025 při složeném..." [What Is Open Source Software?](https://www.ibm.com/think/topics/open-source)

\[^12]: PingCAP. "S 80 % společností hlásících zvýšené využívání open source technologií v uplynulém roce je..." [Emerging Trends in Open Source Communities 2024](https://www.pingcap.com/article/emerging-trends-open-source-communities-2024/)
