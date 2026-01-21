# Proč je open-source e-mail budoucností: Výhoda forwarding e-mailů {#why-open-source-email-is-the-future-the-forward-email-advantage}

<img loading="lazy" src="/img/articles/open-source.webp" alt="Open source email security and privacy" class="rounded-lg" />

## Obsah {#table-of-contents}

* [Předmluva](#foreword)
* [Výhoda open-source: Víc než jen marketing](#the-open-source-advantage-more-than-just-marketing)
  * [Co znamená skutečný open-source](#what-true-open-source-means)
  * [Problém backendu: Kde selhává většina „open-source“ e-mailových služeb](#the-backend-problem-where-most-open-source-email-services-fall-short)
* [Přeposílání e-mailů: 100% open source, frontend i backend](#forward-email-100-open-source-frontend-and-backend)
  * [Náš unikátní technický přístup](#our-unique-technical-approach)
* [Možnost vlastního hostingu: Svoboda volby](#the-self-hosting-option-freedom-of-choice)
  * [Proč podporujeme vlastní hosting](#why-we-support-self-hosting)
  * [Realita samoobslužného hostování e-mailů](#the-reality-of-self-hosting-email)
* [Proč dává naše placená služba smysl (i když jsme open-source)](#why-our-paid-service-makes-sense-even-though-were-open-source)
  * [Porovnání nákladů](#cost-comparison)
  * [To nejlepší z obou světů](#the-best-of-both-worlds)
* [Klam uzavřeného zdroje: Co vám Proton a Tutanota neřeknou](#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you)
  * [Tvrzení společnosti Proton Mail o otevřeném zdrojovém kódu](#proton-mails-open-source-claims)
  * [Podobný přístup Tutanoty](#tutanotas-similar-approach)
  * [Debata o příručkách k ochraně soukromí](#the-privacy-guides-debate)
* [Budoucnost je open-source](#the-future-is-open-source)
  * [Proč open-source vítězí](#why-open-source-is-winning)
* [Přepnutí na přeposílání e-mailů](#making-the-switch-to-forward-email)
* [Závěr: Open-source e-mail pro soukromou budoucnost](#conclusion-open-source-email-for-a-private-future)

## Předmluva {#foreword}

V době, kdy jsou obavy o digitální soukromí na historickém maximu, je na e-mailových službách, které si vybíráme, záležet více než kdy jindy. Zatímco mnoho poskytovatelů tvrdí, že upřednostňují vaše soukromí, existuje zásadní rozdíl mezi těmi, kteří o soukromí pouze mluví, a těmi, kteří skutečně žijí podle pravidel. Ve Forward Email jsme naši službu postavili na základech naprosté transparentnosti prostřednictvím vývoje s otevřeným zdrojovým kódem – nejen v našich frontendových aplikacích, ale v celé naší infrastruktuře.

Tento blogový příspěvek zkoumá, proč jsou open-source e-mailová řešení lepší než alternativy s closed-source, jak se náš přístup liší od konkurence, jako jsou Proton Mail a Tutanota, a proč – i přes náš závazek k možnostem vlastního hostingu – naše placená služba nabízí pro většinu uživatelů nejlepší hodnotu.

## Výhoda open-source: Víc než jen marketing {#the-open-source-advantage-more-than-just-marketing}

Termín „open-source“ se v posledních letech stal populárním marketingovým heslem a předpokládá se, že globální trh se službami s otevřeným zdrojovým kódem poroste v letech 2024 až 2032 složenou roční mírou růstu přes 16 %.\[^1] Co ale znamená být skutečně open-source a proč je to důležité pro vaše soukromí v e-mailech?

### Co znamená skutečný open-source {#what-true-open-source-means}

Software s otevřeným zdrojovým kódem zpřístupňuje veškerý svůj zdrojový kód komukoli k nahlédnutí, úpravám a vylepšením. Tato transparentnost vytváří prostředí, kde:

* Bezpečnostní zranitelnosti může identifikovat a opravit globální komunita vývojářů.
* Nároky na ochranu soukromí lze ověřit prostřednictvím nezávislé kontroly kódu.
* Uživatelé nejsou vázáni na proprietární ekosystémy.
* Inovace probíhají rychleji díky společnému zlepšování.

Pokud jde o e-mail – páteř vaší online identity – tato transparentnost není jen příjemná, je nezbytná pro skutečné soukromí a bezpečnost.

### Problém s backendem: Kde většina „open-source“ e-mailových služeb selhává {#the-backend-problem-where-most-open-source-email-services-fall-short}

A tady se věci začínají zajímat. Mnoho populárních poskytovatelů e-mailů „zaměřených na soukromí“ se inzeruje jako poskytovatelé s otevřeným zdrojovým kódem, ale existuje jeden zásadní rozdíl, kterého si, jak doufají, nevšimnete: **open source poskytují pouze své frontendy, zatímco backendy nechávají uzavřené**.

Co to znamená? Frontend je to, co vidíte a s čím interagujete – webové rozhraní nebo mobilní aplikace. Backend je místo, kde probíhá skutečné zpracování e-mailů – kde jsou vaše zprávy ukládány, šifrovány a přenášeny. Když poskytovatel udržuje svůj backend jako uzavřený:

1. Nemůžete ověřit, jak jsou vaše e-maily skutečně zpracovávány.
2. Nemůžete potvrdit, zda jsou jejich tvrzení o porušení soukromí legitimní.
3. Důvěřujete marketingovým tvrzením spíše než ověřitelnému kódu.
4. Bezpečnostní zranitelnosti mohou zůstat skryty před veřejnou kontrolou.

Jak zdůraznily diskuse na fórech Privacy Guides, Proton Mail i Tutanota tvrdí, že jsou open-source, ale jejich backendy zůstávají uzavřené a proprietární\[^2]. To vytváří značnou mezeru v důvěře – jste nuceni věřit jejich slibům o ochraně soukromí, aniž byste si je mohli ověřit.

## Přeposílaný e-mail: 100% open source, frontend I backend {#forward-email-100-open-source-frontend-and-backend}

Ve Forward Email jsme zvolili zásadně odlišný přístup. Celá naše kódová základna – frontend i backend – je open source a dostupná pro nahlédnutí komukoli na adrese <https://github.com/forwardemail/forwardemail.net>.

To znamená:

1. **Naprostá transparentnost**: Každý řádek kódu, který zpracovává vaše e-maily, je k dispozici pro veřejnou kontrolu.
2. **Ověřitelné soukromí**: Naše tvrzení o ochraně soukromí nejsou marketingovým žargonem – jsou to ověřitelná fakta, která si kdokoli může ověřit prozkoumáním našeho kódu.
3. **Zabezpečení řízené komunitou**: Naše zabezpečení je posíleno kolektivní odborností globální komunity vývojářů.
4. **Žádné skryté funkce**: Co vidíte, to dostanete – žádné skryté sledování, žádná tajná zadní vrátka.

### Náš jedinečný technický přístup {#our-unique-technical-approach}

Náš závazek k ochraně soukromí jde nad rámec pouhého open source. Zavedli jsme několik technických inovací, které nás odlišují:

#### Jednotlivě šifrované poštovní schránky SQLite {#individually-encrypted-sqlite-mailboxes}

Na rozdíl od tradičních poskytovatelů e-mailových služeb, kteří používají sdílené relační databáze (kde by jediný útok mohl odhalit data všech uživatelů), my používáme pro každou poštovní schránku individuálně šifrované soubory SQLite. To znamená:

* Každá poštovní schránka je samostatný šifrovaný soubor
* Přístup k datům jednoho uživatele neumožňuje přístup ostatním
* Ani naši vlastní zaměstnanci nemají přístup k vašim datům – je to klíčové konstrukční rozhodnutí

Jak jsme vysvětlili v diskusích o Průvodcích ochranou osobních údajů:

> „Sdílené relační databáze (např. MongoDB, SQL Server, PostgreSQL, Oracle, MySQL atd.) vyžadují pro navázání připojení k databázi přihlášení (s uživatelským jménem/heslem). To znamená, že kdokoli s tímto heslem by se mohl do databáze dotazovat na cokoli. Ať už se jedná o útok nepoctivého zaměstnance nebo zlé služebné. To také znamená, že přístup k datům jednoho uživatele znamená, že máte také přístup k datům všech ostatních. Na druhou stranu, SQLite by se dal považovat za sdílenou databázi, ale způsob, jakým ji používáme (každá poštovní schránka = samostatný soubor SQLite), ji činí uzavřenou v sandboxu.“\[^3]

#### Kvantově odolné šifrování {#quantum-resistant-encryption}

Zatímco ostatní poskytovatelé stále dohánějí, my jsme již implementovali metody kvantově odolného šifrování, abychom zajistili soukromí vašich e-mailů i v budoucnu před vznikajícími hrozbami z kvantových výpočtů.

#### Žádné závislosti třetích stran {#no-third-party-dependencies}

Na rozdíl od konkurence, která se pro doručování e-mailů spoléhá na služby jako Amazon SES, jsme si celou infrastrukturu vybudovali interně. To eliminuje potenciální úniky soukromí prostřednictvím služeb třetích stran a dává nám plnou kontrolu nad celým e-mailovým procesem.

## Možnost vlastního hostování: Svoboda volby {#the-self-hosting-option-freedom-of-choice}

Jedním z nejsilnějších aspektů softwaru s otevřeným zdrojovým kódem je svoboda, kterou poskytuje. S Forward Email nikdy nejste vázáni – pokud se tak rozhodnete, můžete si celou naši platformu hostovat sami.

### Proč podporujeme vlastní hosting {#why-we-support-self-hosting}

Věříme v to, že uživatelům je třeba dát úplnou kontrolu nad jejich daty. Proto jsme celou naši platformu zařídili jako samohostovanou s komplexní dokumentací a návody k nastavení. Tento přístup:

* Poskytuje maximální kontrolu pro technicky zdatné uživatele
* Eliminuje jakoukoli potřebu důvěřovat nám jako poskytovateli služeb
* Umožňuje přizpůsobení specifickým požadavkům
* Zajišťuje, aby služba mohla pokračovat, i když naše společnost ne

### Realita samoobslužného hostování e-mailů {#the-reality-of-self-hosting-email}

I když je vlastní hosting účinnou možností, je důležité pochopit skutečné náklady s ním spojené:

#### Finanční náklady {#financial-costs}

* Cena VPS nebo serveru: 5–50 USD/měsíc pro základní nastavení\[^4]
* Registrace a obnovení domény: 10–20 USD/rok
* SSL certifikáty (i když Let's Encrypt nabízí bezplatné možnosti)
* Potenciální náklady na monitorovací služby a zálohovací řešení

#### Časové náklady {#time-costs}

* Počáteční nastavení: Několik hodin až dní v závislosti na technických znalostech
* Průběžná údržba: 5–10 hodin měsíčně pro aktualizace, bezpečnostní záplaty a řešení problémů\[^5]
* Křivka učení: Pochopení e-mailových protokolů, osvědčených postupů zabezpečení a správy serverů

#### Technické výzvy {#technical-challenges}

* Problémy s doručitelností e-mailů (zprávy označované jako spam)
* Udržování kroku s vyvíjejícími se bezpečnostními standardy
* Zajištění vysoké dostupnosti a spolehlivosti
* Efektivní správa filtrování spamu

Jak to vyjádřil jeden zkušený hostitel: „E-mail je komoditní služba... Je levnější hostovat e-mail u \[poskytovatele], než utrácet peníze *a* čas za jeho hostování sami.“\[^6]

## Proč dává naše placená služba smysl (i když jsme open-source) {#why-our-paid-service-makes-sense-even-though-were-open-source}

Vzhledem k výzvám spojeným s vlastním hostingem nabízí naše placená služba to nejlepší z obou světů: transparentnost a bezpečnost open-source řešení s pohodlím a spolehlivostí spravované služby.

### Porovnání nákladů {#cost-comparison}

Když započítáte finanční i časové náklady, naše placená služba nabízí výjimečnou hodnotu:

* **Celkové náklady na vlastní hosting**: 56–252 USD/měsíc (včetně nákladů na server a časového ohodnocení)
* **Placené tarify pro přeposílání e-mailů**: 3–9 USD/měsíc

Naše placená služba nabízí:

* Profesionální správa a údržba
* Zavedená reputace v oblasti IP pro lepší doručitelnost
* Pravidelné aktualizace a monitorování zabezpečení
* Podpora v případě problémů
* Všechny výhody ochrany osobních údajů, které nám poskytuje náš open source přístup

### To nejlepší z obou světů {#the-best-of-both-worlds}

Volbou možnosti Přeposlat e-mail získáte:

1. **Ověřitelné soukromí**: Naše open-source kódová základna znamená, že se můžete spolehnout na naše tvrzení o ochraně soukromí.
2. **Profesionální správa**: Není třeba se stát expertem na e-mailové servery.
3. **Cenová efektivita**: Nižší celkové náklady než u vlastního hostingu.
4. **Nezávislost na vázanosti na konkrétního poskytovatele.**: Možnost vlastního hostingu je vždy k dispozici.

## Klam uzavřeného zdrojového kódu: Co vám Proton a Tutanota neřeknou {#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you}

Pojďme se blíže podívat na to, jak se náš přístup liší od populárních poskytovatelů e-mailů „zaměřených na soukromí“.

### Tvrzení o otevřeném zdrojovém kódu od Proton Mail {#proton-mails-open-source-claims}

Proton Mail se prezentuje jako open-source, ale to se týká pouze jejich frontendových aplikací. Jejich backend – kde se vaše e-maily skutečně zpracovávají a ukládají – zůstává closed-source\[^7]. To znamená:

* Nemůžete ověřit, jak se s vašimi e-maily nakládá.
* Musíte důvěřovat jejich tvrzením o ochraně soukromí bez ověření.
* Bezpečnostní zranitelnosti v jejich backendu zůstávají skryty před veřejnou kontrolou.
* Jste uzamčeni v jejich ekosystému bez možností vlastního hostingu.

### Podobný přístup Tutanoty {#tutanotas-similar-approach}

Stejně jako Proton Mail, i Tutanota open-source poskytuje pouze svůj frontend, zatímco backend si ponechává proprietární\[^8]. Potýkají se stejnými problémy s důvěrou:

* Žádný způsob, jak ověřit tvrzení o porušení soukromí na backendu
* Omezená transparentnost skutečného zpracování e-mailů
* Potenciální bezpečnostní problémy skryté před veřejností
* Závislost na dodavateli bez možnosti vlastního hostingu

### Debata o Průvodcích ochranou soukromí {#the-privacy-guides-debate}

Tato omezení nezůstala v komunitě zabývající se ochranou soukromí bez povšimnutí. V diskusích o Průvodcích ochranou soukromí jsme zdůraznili tento zásadní rozdíl:

> „Uvádí se v něm, že Protonmail i Tuta mají uzavřený zdrojový kód. Protože jejich backend skutečně má uzavřený zdrojový kód.“\[^9]

Také jsme uvedli:

> „Nebyly provedeny žádné veřejně sdílené audity backendových infrastruktur žádného z aktuálně uvedených poskytovatelů e-mailových služeb PG ani nebyly sdíleny úryvky open source kódu o tom, jak zpracovávají příchozí e-maily.“\[^10]

Tato nedostatečná transparentnost vytváří zásadní problém s důvěrou. Bez open-source backendů jsou uživatelé nuceni brát tvrzení o porušení soukromí na víru, nikoli na ověření.

## Budoucnost je open-source {#the-future-is-open-source}

Trend směrem k open-source řešením se v celém softwarovém průmyslu zrychluje. Podle nedávného výzkumu:

* Trh s open-source softwarem roste ze 41,83 miliardy dolarů v roce 2024 na 48,92 miliardy dolarů v roce 2025\[^11]
* 80 % společností hlásí zvýšené využívání open-source softwaru za poslední rok\[^12]
* Předpokládá se, že přijetí open-source softwaru bude pokračovat ve svém rychlém růstu

Tento růst odráží zásadní posun v našem pohledu na bezpečnost a soukromí softwaru. S tím, jak si uživatelé více uvědomují soukromí, poptávka po ověřitelném soukromí prostřednictvím open source řešení bude jen růst.

### Proč vítězí open-source {#why-open-source-is-winning}

Výhody open source technologií jsou stále zřetelnější:

1. **Bezpečnost díky transparentnosti**: Open-source kód mohou kontrolovat tisíce odborníků, nejen interní tým.
2. **Rychlejší inovace**: Spolupráce na vývoji urychluje zlepšování.
3. **Důvěra díky ověřování**: Tvrzení lze ověřit, nikoli jim věřit.
4. **Svoboda od závislosti na dodavateli**: Uživatelé si udržují kontrolu nad svými daty a službami.
5. **Podpora komunity**: Globální komunita pomáhá identifikovat a řešit problémy.

## Přepínání na přeposílání e-mailů {#making-the-switch-to-forward-email}

Přechod na přeposílání e-mailů je jednoduchý, ať už používáte běžného poskytovatele, jako je Gmail, nebo jinou službu zaměřenou na soukromí, jako je Proton Mail nebo Tutanota.

Naše služby nabízí:

* Neomezený počet domén a aliasů
* Podpora standardních protokolů (SMTP, IMAP, POP3) bez proprietárních mostů
* Bezproblémová integrace se stávajícími e-mailovými klienty
* Jednoduchý proces nastavení s komplexní dokumentací
* Dostupné cenové plány již od 3 USD/měsíc

## Závěr: Open-source e-mail pro soukromou budoucnost {#conclusion-open-source-email-for-a-private-future}

Ve světě, kde je digitální soukromí stále více ohroženo, poskytuje transparentnost open-source řešení klíčovou ochranu. Ve společnosti Forward Email jsme hrdí na to, že jsme s naším plně open-source přístupem k ochraně soukromí v e-mailech v čele.

Na rozdíl od konkurence, která open source využívá pouze částečně, jsme celou naši platformu – frontend i backend – zpřístupnili veřejné kontrole. Tento závazek k transparentnosti v kombinaci s naším inovativním technickým přístupem poskytuje úroveň ověřitelného soukromí, které se alternativy s uzavřeným zdrojovým kódem jednoduše nemohou rovnat.

Ať už se rozhodnete využívat naši spravovanou službu, nebo si naši platformu sami hostovat, budete mít prospěch z bezpečí, soukromí a klidu, které plynou z e-mailů s otevřeným zdrojovým kódem.

Budoucnost e-mailu je otevřená, transparentní a zaměřená na soukromí. Budoucností je přeposílání e-mailů.

\[^1]: SNS Insider. „Trh s open source službami byl v roce 2023 oceněn na 28,6 miliardy USD a do roku 2032 dosáhne 114,8 miliardy USD s průměrnou roční mírou růstu 16,70 %.“ [Zpráva o velikosti a analýze trhu s open source službami pro rok 2032](https://www.snsinsider.com/reports/open-source-services-market-3322)

\[^2]: Komunita průvodců ochranou soukromí. „Přeposílání e-mailů (poskytovatel e-mailů) – Vývoj webu / Návrhy nástrojů.“ [Diskuse o průvodcích ochranou osobních údajů](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^3]: Komunita průvodců ochranou soukromí. „Přeposílání e-mailů (poskytovatel e-mailů) – Vývoj webu / Návrhy nástrojů.“ [Diskuse o průvodcích ochranou osobních údajů](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^4]: RunCloud. „Obecně můžete očekávat, že za základní virtuální privátní server (VPS) pro provoz vašeho e-mailového serveru utratíte 5 až 50 dolarů měsíčně.“ [10 nejlepších samoobslužných e-mailových serverů pro rok 2025](https://runcloud.io/blog/best-self-hosted-email-server)

\[^5]: Fórum Mail-in-a-Box. „Údržba mi v tomto období trvala asi 16 hodin...“ [Samostatný hostingový poštovní server je odsuzován](https://discourse.mailinabox.email/t/self-hosting-mail-server-frowned-upon/4143)

\[^6]: Reddit r/selfhosted. „TL:DR: Protože vše hostované samostatně, BUDE TO VYŽADOVAT VÁŠ ČAS. Pokud na to nemáte čas, je vždy lepší se držet hostovaného...“ [Vlastní hosting e-mailového serveru? Proč ano nebo proč ne? Co je populární?](https://www.reddit.com/r/selfhosted/comments/1etb8jh/selfhosting_an_email_server_why_or_why_not_whats/)

\[^7]: Přeposílání e-mailů. „Proton Mail tvrdí, že je open source, ale jejich back-end je ve skutečnosti closed source.“ [Srovnání Tutanota vs. Proton Mail (2025)](https://forwardemail.net/blog/tutanota-vs-proton-mail-email-service-comparison)

\[^8]: Přeposlat e-mail. „Tutanota tvrdí, že je open-source, ale jejich back-end je ve skutečnosti closed-source.“ [Srovnání Proton Mail a Tutanota (2025)](https://forwardemail.net/blog/proton-mail-vs-tutanota-email-service-comparison)

\[^9]: Komunita průvodců ochranou osobních údajů. „Uvádí se v ní, že Protonmail i Tuta mají uzavřený zdrojový kód. Protože jejich backend skutečně má uzavřený zdrojový kód.“ [Přeposílání e-mailů (poskytovatel e-mailů) - Návrhy na vývoj webu / nástroje](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^10]: Komunita průvodců ochranou soukromí. „Nebyly provedeny žádné veřejně sdílené audity backendových infrastruktur žádného z aktuálně uvedených poskytovatelů e-mailových služeb PG ani nebyly sdíleny úryvky open source kódu o tom, jak zpracovávají příchozí e-maily.“ [Přeposílání e-mailů (poskytovatel e-mailů) - Návrhy na vývoj webu / nástroje](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^11]: IBM. „Trh s open source softwarem vzroste ze 41,83 miliardy USD v roce 2024 na 48,92 miliardy USD v roce 2025 složeným...“ [Co je to software s otevřeným zdrojovým kódem?](https://www.ibm.com/think/topics/open-source)

\[^12]: PingCAP. „Vzhledem k tomu, že 80 % společností hlásí za poslední rok zvýšené využívání technologií s otevřeným zdrojovým kódem, je to...“ [Nové trendy v komunitách s otevřeným zdrojovým kódem v roce 2024](https://www.pingcap.com/article/emerging-trends-open-source-communities-2024/)