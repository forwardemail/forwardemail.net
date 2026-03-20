# PayPalova 11letá katastrofa API: Jak jsme stavěli obcházení, zatímco ignorovali vývojáře {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

> \[!NOTE]
> **Úspěch! PayPal konečně přidal endpoint `GET /v1/billing/subscriptions`.**
>
> Poté, co jsme tento příspěvek zveřejnili a poslali e-mailem vedoucím představitelům PayPalu, jejich týmy implementovaly tolik potřebný endpoint pro výpis předplatných. Změna se objevila někdy mezi [25. červnem 2025](https://web.archive.org/web/20250625121019/https://developer.paypal.com/docs/api/subscriptions/v1/) a [9. červencem 2025](https://web.archive.org/web/20250709102200/https://developer.paypal.com/docs/api/subscriptions/v1/).
>
> Nicméně, v pravém stylu PayPalu, nás nikdy neinformovali. O této aktualizaci jsme se dozvěděli sami až v prosinci 2025, měsíce poté, co byla funkce tiše vydána.

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="Ilustrace katastrofy PayPal API" class="rounded-lg" />

<p class="lead mt-3">Ve Forward Email se již více než deset let potýkáme s rozbitými API PayPalu. To, co začalo jako drobné frustrace, se proměnilo v úplnou katastrofu, která nás donutila vytvářet vlastní obcházení, blokovat jejich phishingové šablony a nakonec během kritické migrace účtu zastavit všechny platby přes PayPal.</p>
<p class="lead mt-3">Toto je příběh 11 let, kdy PayPal ignoroval základní potřeby vývojářů, zatímco jsme dělali vše pro to, aby jejich platforma fungovala.</p>


## Obsah {#table-of-contents}

* [Chybějící dílek: Žádný způsob, jak vypsat předplatná](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017: Problém se objevuje](#2014-2017-the-problem-emerges)
* [2020: Poskytujeme rozsáhlou zpětnou vazbu](#2020-we-give-them-extensive-feedback)
  * [Seznam 27 položek zpětné vazby](#the-27-item-feedback-list)
  * [Zapojení týmů, sliby byly učiněny](#teams-got-involved-promises-were-made)
  * [Výsledek? Nic.](#the-result-nothing)
* [Odchod vedení: Jak PayPal ztratil veškerou institucionální paměť](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025: Nové vedení, stejné problémy](#2025-new-leadership-same-problems)
  * [Nový CEO se zapojuje](#the-new-ceo-gets-involved)
  * [Odpověď Michelle Gill](#michelle-gills-response)
  * [Naše odpověď: Už žádná setkání](#our-response-no-more-meetings)
  * [Přehnaně složitá odpověď Martyho Brodbecka](#marty-brodbecks-overengineering-response)
  * [Protiklad „jednoduchého CRUD“](#the-simple-crud-contradiction)
  * [Odpojení se stává jasným](#the-disconnect-becomes-clear)
* [Roky ignorovaných hlášení chyb](#years-of-bug-reports-they-ignored)
  * [2016: Rané stížnosti na UI/UX](#2016-early-uiux-complaints)
  * [2021: Hlášení chyby obchodního e-mailu](#2021-business-email-bug-report)
  * [2021: Návrhy na zlepšení UI](#2021-ui-improvement-suggestions)
  * [2021: Selhání sandbox prostředí](#2021-sandbox-environment-failures)
  * [2021: Systém reportů zcela rozbitý](#2021-reports-system-completely-broken)
  * [2022: Chybějící klíčová funkce API (znovu)](#2022-core-api-feature-missing-again)
* [Noční můra vývojářské zkušenosti](#the-developer-experience-nightmare)
  * [Rozbité uživatelské rozhraní](#broken-user-interface)
  * [Problémy se SDK](#sdk-problems)
  * [Porušení Content Security Policy](#content-security-policy-violations)
  * [Chaos v dokumentaci](#documentation-chaos)
  * [Bezpečnostní zranitelnosti](#security-vulnerabilities)
  * [Katastrofa správy relací](#session-management-disaster)
* [Červenec 2025: Poslední kapka](#july-2025-the-final-straw)
* [Proč nemůžeme PayPal jen tak opustit](#why-we-cant-just-drop-paypal)
* [Komunitní obcházení](#the-community-workaround)
* [Blokování PayPal šablon kvůli phishingu](#blocking-paypal-templates-due-to-phishing)
  * [Skutečný problém: Šablony PayPalu vypadají jako podvody](#the-real-problem-paypals-templates-look-like-scams)
  * [Naše implementace](#our-implementation)
  * [Proč jsme museli PayPal blokovat](#why-we-had-to-block-paypal)
  * [Rozsah problému](#the-scale-of-the-problem)
  * [Ironie](#the-irony)
  * [Dopad v reálném světě: Nové PayPal podvody](#real-world-impact-novel-paypal-scams)
* [PayPalův zpětný KYC proces](#paypals-backwards-kyc-process)
  * [Jak by to mělo fungovat](#how-it-should-work)
  * [Jak PayPal skutečně funguje](#how-paypal-actually-works)
  * [Dopad v reálném světě](#the-real-world-impact)
  * [Katastrofa migrace účtu v červenci 2025](#the-july-2025-account-migration-disaster)
  * [Proč je to důležité](#why-this-matters)
* [Jak to dělají správně ostatní platební procesory](#how-every-other-payment-processor-does-it-right)
  * [Stripe](#stripe)
  * [Paddle](#paddle)
  * [Coinbase Commerce](#coinbase-commerce)
  * [Square](#square)
  * [Průmyslový standard](#the-industry-standard)
  * [Co ostatní procesory poskytují vs PayPal](#what-other-processors-provide-vs-paypal)
* [Systematické zakrývání PayPalu: Ztišení 6 milionů hlasů](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [Velké vymazání](#the-great-erasure)
  * [Záchrana třetí stranou](#the-third-party-rescue)
* [11letá katastrofa chyby zachycení: 1 899 $ a stále roste](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [Ztráta Forward Email 1 899 $](#forward-emails-1899-loss)
  * [Původní hlášení z roku 2013: 11+ let zanedbávání](#the-2013-original-report-11-years-of-negligence)
  * [Přiznání z roku 2016: PayPal rozbíjí vlastní SDK](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [Esklace v roce 2024: Stále rozbité](#the-2024-escalation-still-broken)
  * [Katastrofa spolehlivosti webhooků](#the-webhook-reliability-disaster)
  * [Vzor systematického zanedbávání](#the-pattern-of-systematic-negligence)
  * [Nedokumentovaný požadavek](#the-undocumented-requirement)
* [Širší vzorec klamání PayPalu](#paypals-broader-pattern-of-deception)
  * [Akce newyorského finančního úřadu](#the-new-york-department-of-financial-services-action)
  * [Žaloba Honey: Přepisování affiliate odkazů](#the-honey-lawsuit-rewriting-affiliate-links)
  * [Cena PayPalova zanedbávání](#the-cost-of-paypals-negligence)
  * [Lež v dokumentaci](#the-documentation-lie)
* [Co to znamená pro vývojáře](#what-this-means-for-developers)
## Chybějící dílek: Žádný způsob, jak vypsat předplatné {#the-missing-piece-no-way-to-list-subscriptions}

Tady je věc, která nás opravdu udivuje: PayPal má předplatné účtování už od roku 2014, ale nikdy neposkytl způsob, jak si obchodníci mohou vypsat svá vlastní předplatná.

Zamyslete se nad tím na chvíli. Můžete vytvářet předplatné, můžete je zrušit, pokud máte ID, ale nemůžete získat seznam všech aktivních předplatných na svém účtu. Je to jako mít databázi bez příkazu SELECT.

Potřebujeme to pro základní obchodní operace:

* Zákaznická podpora (když někdo píše e-mail ohledně svého předplatného)
* Finanční reportování a vyrovnání
* Automatizovaná správa fakturace
* Soulad s předpisy a audit

Ale PayPal? Oni to prostě... nikdy nevybudovali.


## 2014-2017: Problém se objevuje {#2014-2017-the-problem-emerges}

Problém s výpisem předplatných se poprvé objevil v komunitních fórech PayPalu v roce 2017. Vývojáři kladli zřejmou otázku: „Jak získám seznam všech svých předplatných?“

Odpověď PayPalu? Ticho po pěšině.

Členové komunity začali být frustrovaní:

> „Velmi zvláštní opomenutí, pokud obchodník nemůže vypsat všechna aktivní ujednání. Pokud je ID ujednání ztraceno, znamená to, že pouze uživatel může ujednání zrušit nebo pozastavit.“ - leafspider

> „+1. Už to jsou skoro 3 roky.“ - laudukang (což znamená, že problém existoval od \~2014)

[Originální příspěvek v komunitě](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) z roku 2017 ukazuje, jak vývojáři prosili o tuto základní funkci. PayPal na to reagoval archivací repozitáře, kde lidé hlásili problém.


## 2020: Poskytli jsme jim rozsáhlou zpětnou vazbu {#2020-we-give-them-extensive-feedback}

V říjnu 2020 nás PayPal kontaktoval kvůli formální zpětnovazební schůzce. Nebyl to žádný neformální rozhovor – zorganizovali 45minutový hovor přes Microsoft Teams s 8 vedoucími pracovníky PayPalu včetně Sri Shivanandy (CTO), Edwina Aokiho, Jima Magatse, Johna Kunzeho a dalších.

### Seznam 27 bodů zpětné vazby {#the-27-item-feedback-list}

Přišli jsme připraveni. Po 6 hodinách pokusů o integraci s jejich API jsme sestavili 27 konkrétních problémů. Mark Stuart z týmu PayPal Checkout řekl:

> Ahoj Nicku, díky, že jsi to dnes všem sdílel! Myslím, že to bude katalyzátor pro získání větší podpory a investic pro náš tým, aby tyto věci opravil. Bylo těžké získat tak bohatou zpětnou vazbu, jako jsi nám zatím poskytl.

Zpětná vazba nebyla teoretická – vycházela z reálných pokusů o integraci:

1. **Generování přístupového tokenu nefunguje**:

> Generování přístupového tokenu nefunguje. Také by mělo být více než jen příklady v cURL.

2. **Žádné webové UI pro vytváření předplatného**:

> Jak sakra můžete vytvářet předplatná, aniž byste to museli dělat pomocí cURL? Zdá se, že neexistuje žádné webové UI pro tuto funkci (jako má Stripe).

Mark Stuart považoval problém s generováním přístupového tokenu za zvlášť znepokojující:

> Obvykle neslyšíme o problémech s generováním přístupového tokenu.

### Zapojily se týmy, byly učiněny sliby {#teams-got-involved-promises-were-made}

Jak jsme objevovali další problémy, PayPal přidával do konverzace další týmy. Darshan Raju z týmu správy UI předplatného se připojil a řekl:

> Uznáváme mezeru. Budeme to sledovat a řešit. Ještě jednou díky za vaši zpětnou vazbu!

Schůzka byla popsána jako hledání:

> upřímného průchodu vaší zkušeností

s cílem:

> udělat z PayPalu to, čím by měl být pro vývojáře.

### Výsledek? Nic. {#the-result-nothing}

Navzdory formální zpětnovazební schůzce, rozsáhlému seznamu 27 bodů, zapojení více týmů a slibům:

> sledovat a řešit

problémy, nebylo opraveno absolutně nic.


## Odchod vedení: Jak PayPal ztratil veškerou institucionální paměť {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

Tady to začíná být opravdu zajímavé. Každý člověk, který obdržel naši zpětnou vazbu v roce 2020, PayPal opustil:

**Změny ve vedení:**

* [Dan Schulman (CEO po 9 let) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (září 2023)
* [Sri Shivananda (CTO, který organizoval zpětnou vazbu) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (leden 2024)
**Technické vedení, které dalo sliby a pak odešlo:**

* **Mark Stuart** (slíbil, že zpětná vazba bude "katalyzátor") → [Nyní v Ripple](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (18 let veterán PayPalu) → [CEO MX](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (VP globálního spotřebitelského produktu) → [V důchodu](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (jeden z posledních zbývajících) → [Právě odešel do Nasdaq](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (leden 2025)

PayPal se stal revolvingovými dveřmi, kde vedoucí sbírají zpětnou vazbu od vývojářů, dávají sliby a pak odcházejí do lepších společností jako JPMorgan, Ripple a další fintech firmy.

To vysvětluje, proč se odpověď na GitHub issue z roku 2025 zdála být úplně odtržená od naší zpětné vazby z roku 2020 – doslova všichni, kdo tu zpětnou vazbu obdrželi, PayPal opustili.


## 2025: Nové vedení, stejné problémy {#2025-new-leadership-same-problems}

Přesuňme se do roku 2025 a objevuje se přesně stejný vzorec. Po letech bez pokroku se nové vedení PayPalu opět ozývá.

### Nový CEO se zapojuje {#the-new-ceo-gets-involved}

Dne 30. června 2025 jsme eskalovali přímo na nového CEO PayPalu, Alexe Chrisse. Jeho odpověď byla stručná:

> Ahoj Nicku – děkuji, že jste se ozval a za zpětnou vazbu. Michelle (v kopii) je s jejím týmem připravena se zapojit a projít to s vámi. Díky -A

### Odpověď Michelle Gill {#michelle-gills-response}

Michelle Gill, EVP a generální ředitelka pro malé podnikání a finanční služby, odpověděla:

> Moc děkuji Nicku, dávám Alexe do bcc. Od vašeho předchozího příspěvku to zkoumáme. Zavoláme vám ještě tento týden. Můžete mi prosím poslat své kontaktní údaje, aby vás mohl někdo z mých kolegů kontaktovat. Michelle

### Naše odpověď: Už žádná setkání {#our-response-no-more-meetings}

Další schůzku jsme odmítli a vysvětlili jsme naši frustraci:

> Děkuji. Nicméně nemám pocit, že by zavolání něco změnilo. Tady je proč... Už jsem se jednou připojil k hovoru a nikam to nevedlo. Ztratil jsem přes 2 hodiny svého času, když jsem mluvil s celým týmem a vedením a nic se neudělalo... Spousta e-mailů tam a zpět. Naprosto nic hotovo. Zpětná vazba nikam nevedla. Snažil jsem se roky, byl jsem vyslyšen, a pak to nikam nevedlo.

### Přehnaně složitá odpověď Martyho Brodbecka {#marty-brodbecks-overengineering-response}

Pak se ozval Marty Brodbeck, který vede spotřebitelské inženýrství v PayPalu:

> Ahoj Nicku, tady Marty Brodbeck. Vedu veškeré spotřebitelské inženýrství zde v PayPalu a řídím vývoj API pro společnost. Můžeme se spojit ohledně problému, kterému čelíte, a jak vám můžeme pomoci.

Když jsme vysvětlili jednoduchou potřebu endpointu pro výpis předplatných, jeho odpověď odhalila přesný problém:

> Díky Nicku, právě vytváříme jedno API pro předplatné s plným SDK (podporuje plné zpracování chyb, sledování předplatného založené na událostech, robustní dostupnost), kde je fakturace také oddělena jako samostatné API, na které mohou obchodníci přistupovat, místo aby museli orchestrálně pracovat přes více endpointů, aby získali jednu odpověď.

To je přesně špatný přístup. Nepotřebujeme měsíce složité architektury. Potřebujeme jeden jednoduchý REST endpoint, který vypisuje předplatná – něco, co mělo existovat už od roku 2014.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### Protiklad "jednoduchých CRUD operací" {#the-simple-crud-contradiction}

Když jsme poukázali na to, že jde o základní CRUD funkčnost, která měla existovat už od roku 2014, Martyho odpověď byla výmluvná:

> Jednoduché CRUD operace jsou součástí základního API, příteli, takže to nebude trvat měsíce vývoje

PayPal TypeScript SDK, které po měsících vývoje podporuje pouze tři endpointy, spolu s jeho historickým časovým rámcem jasně ukazuje, že takové projekty vyžadují více než pár měsíců dokončení.
Tato odpověď ukazuje, že nerozumí vlastnímu API. Pokud jsou „jednoduché CRUD operace součástí základního API“, kde je pak endpoint pro výpis předplatného? Odpověděli jsme:

> Pokud jsou „jednoduché CRUD operace součástí základního API“, kde je pak endpoint pro výpis předplatného? Vývojáři o tuto „jednoduchou CRUD operaci“ žádají od roku 2014. Už je to 11 let. Každý jiný platební procesor má tuto základní funkčnost od prvního dne.

### Rozpojení se stává jasným {#the-disconnect-becomes-clear}

Výměny názorů v roce 2025 s Alexem Chrissem, Michelle Gill a Martym Brodbeckem ukazují stejnou organizační dysfunkci:

1. **Nové vedení nemá žádné znalosti o předchozích zpětných vazbách**
2. **Navrhují stejné předimenzované řešení**
3. **Nerozumí omezením vlastního API**
4. **Chtějí více schůzek místo toho, aby problém prostě vyřešili**

Tento vzorec vysvětluje, proč týmy PayPalu v roce 2025 působí zcela odtrženě od rozsáhlé zpětné vazby poskytnuté v roce 2020 – lidé, kteří tu zpětnou vazbu přijali, už nejsou, a nové vedení opakuje stejné chyby.


## Roky hlášení chyb, které ignorovali {#years-of-bug-reports-they-ignored}

Nejenže jsme si stěžovali na chybějící funkce. Aktivně jsme hlásili chyby a snažili se jim pomoci zlepšit se. Zde je komplexní časová osa problémů, které jsme zdokumentovali:

### 2016: Rané stížnosti na UI/UX {#2016-early-uiux-complaints}

Už v roce 2016 jsme veřejně oslovovali vedení PayPalu včetně Dana Schulmana ohledně problémů s rozhraním a použitelností. To bylo před 9 lety a stejné problémy s UI/UX přetrvávají dodnes.

### 2021: Hlášení chyby obchodního e-mailu {#2021-business-email-bug-report}

V březnu 2021 jsme nahlásili, že systém obchodních e-mailů PayPalu posílá nesprávná oznámení o zrušení. Šablona e-mailu měla nesprávně vykreslené proměnné, což zákazníkům zobrazovalo matoucí zprávy.

Mark Stuart problém potvrdil:

> Díky Nicku! Přecházíme na BCC. @Prasy, je váš tým za tento e-mail zodpovědný nebo víte, kdo je? „Niftylettuce, LLC, už vám nebudeme účtovat“ mě vede k domněnce, že je záměna, komu je e-mail adresován a co obsahuje.

**Výsledek**: Tento problém skutečně opravili! Mark Stuart potvrdil:

> Právě jsem slyšel od týmu notifikací, že šablona e-mailu byla opravena a nasazena. Děkuji, že jste to nahlásil. Díky!

To ukazuje, že věci OPRAVIT umí, když chtějí – většinu problémů ale raději neřeší.

### 2021: Návrhy na zlepšení UI {#2021-ui-improvement-suggestions}

V únoru 2021 jsme poskytli podrobnou zpětnou vazbu k jejich dashboardu, konkrétně k sekci „Nedávná aktivita PayPalu“:

> Myslím, že dashboard na paypal.com, konkrétně „Nedávná aktivita PayPalu“, potřebuje zlepšení. Nemyslím si, že byste měli zobrazovat řádky stavu „Vytvořeno“ u opakovaných plateb s hodnotou 0 $ – jen to přidává spoustu zbytečných řádků a nelze na první pohled snadno vidět, kolik příjmů se generuje za den/poslední dny.

Mark Stuart to přeposlal týmu spotřebitelských produktů:

> Díky! Nejsem si jistý, který tým je za Aktivitu zodpovědný, ale přeposlal jsem to vedoucímu spotřebitelských produktů, aby našel správný tým. Opakovaná platba 0,00 $ vypadá jako chyba. Měla by být pravděpodobně filtrována.

**Výsledek**: Nikdy to neopravili. UI stále zobrazuje tyto zbytečné položky s hodnotou 0 $.

### 2021: Selhání sandboxového prostředí {#2021-sandbox-environment-failures}

V listopadu 2021 jsme nahlásili kritické problémy se sandboxovým prostředím PayPalu:

* Tajné API klíče sandboxu byly náhodně měněny a deaktivovány
* Všechny testovací sandboxové účty byly bez upozornění smazány
* Chybové zprávy při pokusu o zobrazení detailů sandboxového účtu
* Přerušované selhání načítání

> Z nějakého důvodu byl můj tajný API klíč sandboxu změněn a deaktivován. Také všechny mé staré testovací sandboxové účty byly smazány.

> Někdy se načtou a někdy ne. Je to nesmírně frustrující.

**Výsledek**: Žádná odpověď, žádná oprava. Vývojáři stále čelí problémům s spolehlivostí sandboxu.

### 2021: Systém reportů zcela rozbitý {#2021-reports-system-completely-broken}
V květnu 2021 jsme oznámili, že systém stahování transakčních reportů PayPalu je zcela rozbitý:

> Zdá se, že stahování reportů momentálně nefunguje a nefungovalo celý den. Také by pravděpodobně měla přijít e-mailová notifikace, pokud to selže.

Také jsme upozornili na katastrofu v řízení relací:

> Také pokud jste neaktivní, když jste přihlášeni do PayPalu asi 5 minut, jste odhlášeni. Takže když obnovíte tlačítko vedle reportu, jehož stav chcete zkontrolovat (po nekonečném čekání), je otravné se znovu přihlašovat.

Mark Stuart potvrdil problém s vypršením relace:

> Pamatuji si, že jste to v minulosti hlásili, že vaše relace často vyprší a narušuje váš vývojový tok, když přepínáte mezi IDE a developer.paypal.com nebo vaší obchodnickou konzolí, pak se vrátíte a jste opět odhlášeni.

**Výsledek**: Vypršení relace je stále 60 sekund. Systém reportů stále pravidelně selhává.

### 2022: Chybějící klíčová funkce API (opět) {#2022-core-api-feature-missing-again}

V lednu 2022 jsme znovu eskalovali problém s výpisem předplatných, tentokrát s ještě podrobnějšími informacemi o tom, jak je jejich dokumentace chybná:

> Neexistuje žádný GET, který by vypsal všechna předplatná (dříve nazývaná billing agreements)

Zjistili jsme, že jejich oficiální dokumentace je zcela nepřesná:

> Dokumentace API je také úplně nepřesná. Mysleli jsme si, že můžeme obejít problém stažením pevně zakódovaného seznamu ID předplatných. Ale ani to nefunguje!

> Z oficiální dokumentace zde... Říká, že to můžete udělat... Ale tady je háček – vůbec neexistuje žádné pole "Subscription ID", které by se dalo zkontrolovat.

Christina Monti z PayPalu odpověděla:

> Omlouváme se za frustrace způsobené těmito chybnými kroky, tento týden to opravíme.

Sri Shivananda (CTO) nám poděkoval:

> Děkujeme za vaši trvalou pomoc při našem zlepšování. Velmi si toho vážíme.

**Výsledek**: Dokumentace nikdy nebyla opravena. Endpoint pro výpis předplatných nikdy nebyl vytvořen.


## Noční můra vývojáře {#the-developer-experience-nightmare}

Práce s PayPal API je jako vrátit se o 10 let zpět. Zde jsou technické problémy, které jsme zdokumentovali:

### Rozbité uživatelské rozhraní {#broken-user-interface}

Vývojářská konzole PayPalu je katastrofa. Toto řešíme denně:

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Uživatelské rozhraní PayPalu je tak rozbité, že ani nemůžete zavřít notifikace
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Vývojářská konzole vás doslova nutí táhnout posuvník a pak vás po 60 sekundách odhlásí
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Další katastrofy uživatelského rozhraní v PayPal vývojářském rozhraní ukazující rozbité pracovní postupy
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Rozhraní pro správu předplatných – rozhraní je tak špatné, že jsme museli spoléhat na kód pro generování produktů a plánů předplatného
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="PayPal subscriptions screenshot" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Pohled na rozbité rozhraní předplatného s chybějící funkcionalitou (nemůžete snadno vytvářet produkty/plány/předplatná – a zdá se, že v UI není vůbec žádný způsob, jak smazat produkty ani plány po jejich vytvoření)
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="PayPal subscriptions screenshot 2" class="rounded-lg" />
</figure>
<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Typické chybové zprávy PayPalu - záhadné a nepomáhající
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### Problémy se SDK {#sdk-problems}

* Nedokáže zvládnout jednorázové platby i předplatné bez složitých obcházek zahrnujících přepínání a znovu vykreslování tlačítek při opětovném načítání SDK pomocí skriptových tagů
* JavaScript SDK porušuje základní konvence (malá písmena u názvů tříd, žádná kontrola instancí)
* Chybové zprávy neukazují, které pole chybí
* Nekonzistentní datové typy (vyžadují částky jako řetězce místo čísel)

### Porušení politiky zabezpečení obsahu {#content-security-policy-violations}

Jejich SDK vyžaduje unsafe-inline a unsafe-eval ve vaší CSP, **nutí vás tak ohrozit bezpečnost vašeho webu**.

### Chaos v dokumentaci {#documentation-chaos}

Sám Mark Stuart přiznal:

> Souhlasím, že je tam absurdní množství starých i nových API. Opravdu těžké najít, co hledat (i pro nás, co tu pracujeme).

### Zranitelnosti zabezpečení {#security-vulnerabilities}

**Implementace 2FA od PayPalu je obrácená**. I když máte povolené TOTP aplikace, nutí vás ověřování přes SMS – což činí účty zranitelnými vůči útokům SIM swap. Pokud máte povolené TOTP, mělo by se používat výhradně to. Náhradou by měl být e-mail, ne SMS.

### Katastrofa správy relací {#session-management-disaster}

**Jejich vývojářský dashboard vás po 60 sekundách nečinnosti odhlásí**. Snažte se dělat cokoli produktivního a neustále procházíte: přihlášení → captcha → 2FA → odhlášení → opakovat. Používáte VPN? Hodně štěstí.


## Červenec 2025: Poslední kapka {#july-2025-the-final-straw}

Po 11 letech stejných problémů přišel zlom během rutinní migrace účtu. Potřebovali jsme přejít na nový PayPal účet, který by odpovídal názvu naší firmy "Forward Email LLC" pro přehlednější účetnictví.

Co mělo být jednoduché, se změnilo v úplnou katastrofu:

* Počáteční testování ukázalo, že vše funguje správně
* O několik hodin později PayPal náhle zablokoval všechny platby předplatného bez upozornění
* Zákazníci nemohli platit, což způsobilo zmatek a zvýšenou zátěž podpory
* Podpora PayPalu dávala protichůdné odpovědi, že účty jsou ověřené
* Byli jsme nuceni úplně zastavit platby přes PayPal

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Chyba, kterou zákazníci viděli při pokusu o platbu - žádné vysvětlení, žádné záznamy, nic
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Podpora PayPalu tvrdí, že je vše v pořádku, zatímco platby byly úplně rozbité. Závěrečná zpráva ukazuje, že „některé funkce obnovili“, ale stále žádají o další nespecifikované informace – klasické divadlo podpory PayPalu
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-help-center-1.png" alt="PayPal help center screenshot 1" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-2.png" alt="PayPal help center screenshot 2" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-3.png" alt="PayPal help center screenshot 3" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-4.png" alt="PayPal help center screenshot 4" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-5.png" alt="PayPal help center screenshot 5" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-6.png" alt="PayPal help center screenshot 6" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Proces ověření identity, který údajně „nic neopravilo“
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-take-care-1.png" alt="PayPal take care screenshot 1" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-2.png" alt="PayPal take care screenshot 2" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-3.png" alt="PayPal take care screenshot 3" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-4.png" alt="PayPal take care screenshot 4" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-5.png" alt="PayPal take care screenshot 5" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-6.png" alt="PayPal take care screenshot 6" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-7.png" alt="PayPal take care screenshot 7" class="rounded-lg" />
</figure>
<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Vágní zpráva a stále žádné řešení. Žádné informace, upozornění ani cokoli, co by naznačovalo, jaké další informace jsou potřeba. Zákaznická podpora mlčí.
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>


## Proč nemůžeme jednoduše opustit PayPal {#why-we-cant-just-drop-paypal}

Navzdory všem těmto problémům nemůžeme PayPal úplně opustit, protože někteří zákazníci mají PayPal jako jedinou možnost platby. Jak řekl jeden zákazník na naší [status stránce](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515):

> PayPal je moje jediná možnost platby

**Jsme nuceni podporovat rozbitou platformu, protože PayPal vytvořil platební monopol pro určité uživatele.**


## Komunitní řešení {#the-community-workaround}

Jelikož PayPal neposkytuje základní funkce pro správu předplatných, vývojářská komunita vytvořila obcházení. Vytvořili jsme skript, který pomáhá spravovat PayPal předplatná: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

Tento skript odkazuje na [komunitní gist](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4), kde vývojáři sdílejí řešení. Uživatelé nám dokonce [děkují](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775) za to, co měl PayPal vyvinout už před lety.


## Blokování PayPal šablon kvůli phishingu {#blocking-paypal-templates-due-to-phishing}

Problémy přesahují API. E-mailové šablony PayPal jsou tak špatně navržené, že jsme museli implementovat specifické filtrování v naší e-mailové službě, protože jsou k nerozeznání od phishingových pokusů.

### Skutečný problém: Šablony PayPal vypadají jako podvody {#the-real-problem-paypals-templates-look-like-scams}

Pravidelně dostáváme hlášení o e-mailech z PayPalu, které vypadají přesně jako phishingové pokusy. Zde je skutečný příklad z našich hlášení zneužití:

**Předmět:** `[Sandbox] TEST - Nová faktura od PaypalBilling434567 sandbox #A4D369E8-0001`

Tento e-mail byl přeposlán na `abuse@microsoft.com`, protože vypadal jako phishingový pokus. Problém? Ve skutečnosti pocházel ze sandboxového prostředí PayPalu, ale jejich design šablony je tak špatný, že spouští systémy detekce phishingu.

### Naše implementace {#our-implementation}

Naše filtrování specifické pro PayPal můžete vidět v našem [kódu pro filtrování e-mailů](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172):

```javascript
// check for paypal scam (very strict until PayPal resolves phishing on their end)
// (seems to only come from "outlook.com" and "paypal.com" hosts)
//
// X-Email-Type-Id = RT000238
// PPC001017
// RT000542 = gift message hack
// RT002947 = paypal invoice spam
// <https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-fraud/>
//
if (
  session.originalFromAddressRootDomain === 'paypal.com' &&
  headers.hasHeader('x-email-type-id') &&
  ['PPC001017', 'RT000238', 'RT000542', 'RT002947'].includes(
    headers.getFirst('x-email-type-id')
  )
) {
  const err = new SMTPError(
    'Kvůli pokračujícímu spamu s fakturami z PayPalu musíte ručně odeslat odkaz na fakturu'
  );
  err.isCodeBug = true; // upozornit administrátory k prozkoumání
  throw err;
}
```

### Proč jsme museli PayPal zablokovat {#why-we-had-to-block-paypal}

Toto jsme implementovali, protože PayPal odmítal řešit masivní problémy se spamem/phishingem/podvody navzdory našim opakovaným hlášením jejich abuse týmům. Specifické typy e-mailů, které blokujeme, zahrnují:

* **RT000238** - Podezřelé oznámení o fakturách
* **PPC001017** - Problematičtí potvrzení plateb
* **RT000542** - Pokusy o zneužití zpráv o dárcích

### Rozsah problému {#the-scale-of-the-problem}

Naše logy filtrování spamu ukazují obrovské množství spamu s fakturami z PayPalu, které denně zpracováváme. Příklady zablokovaných předmětů zahrnují:

* "Faktura od PayPal Billing Team:- Tato platba bude automaticky odečtena z vašeho účtu. Kontaktujte nás ihned na \[PHONE]"
* "Faktura od \[COMPANY NAME] (\[ORDER-ID])"
* Více variant s různými telefonními čísly a falešnými čísly objednávek
Tyto e-maily často pocházejí z hostitelů `outlook.com`, ale zdají se být odeslány z legitimních systémů PayPalu, což je činí obzvlášť nebezpečnými. E-maily procházejí autentizací SPF, DKIM a DMARC, protože jsou odesílány přes skutečnou infrastrukturu PayPalu.

Naše technické záznamy ukazují, že tyto spamové e-maily obsahují legitimní hlavičky PayPalu:

* `X-Email-Type-Id: RT000238` (stejné ID, které blokujeme)
* `From: "service@paypal.com" <service@paypal.com>`
* Platné DKIM podpisy od `paypal.com`
* Správné SPF záznamy ukazující poštovní servery PayPalu

To vytváří nemožnou situaci: legitimní e-maily PayPalu i spam mají identické technické charakteristiky.

### Ironie {#the-irony}

PayPal, společnost, která by měla vést boj proti finančnímu podvodu, má e-mailové šablony tak špatně navržené, že spouštějí anti-phishingové systémy. Jsme nuceni blokovat legitimní e-maily PayPalu, protože nejsou odlišitelné od podvodů.

Toto je zdokumentováno v bezpečnostním výzkumu: [Pozor na nový podvod s adresou PayPalu](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) – ukazující, jak jsou PayPalovy vlastní systémy zneužívány k podvodům.

### Dopad v reálném světě: Nové podvody s PayPalem {#real-world-impact-novel-paypal-scams}

Problém přesahuje jen špatný design šablon. Fakturační systém PayPalu je tak snadno zneužitelný, že podvodníci jej pravidelně zneužívají k odesílání legitimně vypadajících podvodných faktur. Bezpečnostní výzkumník Gavin Anderegg zdokumentoval [Nový podvod s PayPalem](https://anderegg.ca/2023/02/01/a-novel-paypal-scam), kde podvodníci posílají skutečné PayPal faktury, které projdou všemi autentizačními kontrolami:

> „Při kontrole zdroje e-mail vypadal, jako by skutečně pocházel z PayPalu (SPF, DKIM a DMARC všechny prošly). Tlačítko také odkazovalo na URL, která vypadala jako legitimní PayPal... Trvalo mi chvíli, než mi došlo, že jde o legitimní e-mail. Právě mi byl zaslán náhodný ‚fakturační‘ e-mail od podvodníka.“

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Screenshot ukazující několik podvodných PayPal faktur zaplavujících schránku, všechny vypadající legitimně, protože skutečně pocházejí ze systémů PayPalu
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="Screenshot varování před podvodem PayPal" class="rounded-lg" />
</figure>

Výzkumník poznamenal:

> „Zdá se také, že jde o funkci pohodlí, kterou by PayPal měl zvážit zablokovat. Okamžitě jsem předpokládal, že jde o nějaký podvod a zajímaly mě jen technické detaily. Zdá se to příliš snadné na provedení a obávám se, že na to mohou naletět i jiní.“

To dokonale ilustruje problém: PayPalovy vlastní legitimní systémy jsou tak špatně navržené, že umožňují podvody a zároveň dělají legitimní komunikaci podezřelou.

Aby toho nebylo málo, toto ovlivnilo naši doručitelnost u Yahoo, což vedlo ke stížnostem zákazníků a hodinám pečlivého testování a kontroly vzorců.


## Zpětný KYC proces PayPalu {#paypals-backwards-kyc-process}

Jedním z nejfrustrujících aspektů platformy PayPal je jejich zpětný přístup k dodržování předpisů a procedurám Know Your Customer (KYC). Na rozdíl od všech ostatních platebních procesorů PayPal umožňuje vývojářům integrovat jejich API a začít přijímat platby v produkci ještě před dokončením řádné verifikace.

### Jak by to mělo fungovat {#how-it-should-work}

Každý legitimní platební procesor dodržuje tuto logickou posloupnost:

1. **Nejprve dokončit KYC verifikaci**
2. **Schválit obchodnický účet**
3. **Poskytnout přístup k produkčnímu API**
4. **Umožnit sběr plateb**

To chrání jak platebního procesora, tak obchodníka tím, že zajistí dodržování předpisů před jakýmkoliv převodem peněz.

### Jak PayPal skutečně funguje {#how-paypal-actually-works}

Proces PayPalu je zcela opačný:

1. **Okamžitě poskytnout přístup k produkčnímu API**
2. **Umožnit sběr plateb na hodiny nebo dny**
3. **Náhle zablokovat platby bez upozornění**
4. **Požadovat KYC dokumentaci až poté, co jsou zákazníci již ovlivněni**
5. **Nezaslat žádné oznámení obchodníkovi**
6. **Nechat zákazníky, aby problém objevili a nahlásili jej**
### Skutečný dopad v reálném světě {#the-real-world-impact}

Tento zpětný proces způsobuje katastrofy pro podniky:

* **Zákazníci nemohou dokončit nákupy** během období vrcholných prodejů
* **Žádné předchozí upozornění**, že je potřeba ověření
* **Žádná e-mailová oznámení**, když jsou platby zablokovány
* **Obchodníci se o problémech dozvídají od zmatených zákazníků**
* **Ztráta příjmů** během kritických obchodních období
* **Poškození důvěry zákazníků**, když platby záhadně selhávají

### Katastrofa migrace účtů v červenci 2025 {#the-july-2025-account-migration-disaster}

Tento přesný scénář se odehrál během naší rutinní migrace účtů v červenci 2025. PayPal nejprve umožňoval platby, pak je náhle zablokoval bez jakéhokoli upozornění. Problém jsme objevili až poté, co zákazníci začali hlásit, že nemohou zaplatit.

Když jsme kontaktovali podporu, dostali jsme protichůdné odpovědi ohledně požadovaných dokumentů, bez jasného časového rámce řešení. To nás donutilo úplně zastavit platby přes PayPal, což zmátlo zákazníky, kteří neměli jiné platební možnosti.

### Proč je to důležité {#why-this-matters}

Přístup PayPalu ke shodě s předpisy ukazuje zásadní nepochopení toho, jak podniky fungují. Správné KYC by mělo proběhnout **před** integrací do produkce, ne poté, co zákazníci už zkoušejí platit. Nedostatek proaktivní komunikace při vzniku problémů ukazuje na odtržení PayPalu od potřeb obchodníků.

Tento zpětný proces je symptomem širších organizačních problémů PayPalu: upřednostňují své interní procesy před zkušeností obchodníků a zákazníků, což vede k provozním katastrofám, které odrazují podniky od jejich platformy.


## Jak to dělají správně všichni ostatní platební procesory {#how-every-other-payment-processor-does-it-right}

Funkce výpisu předplatných, kterou PayPal odmítá implementovat, je v oboru standardem už více než deset let. Takto ostatní platební procesory řeší tento základní požadavek:

### Stripe {#stripe}

Stripe má výpis předplatných od spuštění svého API. Jejich dokumentace jasně ukazuje, jak získat všechny předplatné pro zákazníka nebo obchodní účet. To je považováno za základní CRUD funkci.

### Paddle {#paddle}

Paddle poskytuje komplexní API pro správu předplatných včetně výpisu, filtrování a stránkování. Chápou, že obchodníci potřebují vidět své opakující se příjmy.

### Coinbase Commerce {#coinbase-commerce}

Dokonce i kryptoměnoví platební procesory jako Coinbase Commerce poskytují lepší správu předplatných než PayPal.

### Square {#square}

API Square zahrnuje výpis předplatných jako základní funkci, ne jako dodatečnou.

### Průmyslový standard {#the-industry-standard}

Každý moderní platební procesor poskytuje:

* Výpis všech předplatných
* Filtrování podle stavu, data, zákazníka
* Stránkování pro velké datové sady
* Webhook oznámení o změnách předplatného
* Komplexní dokumentaci s funkčními příklady

### Co poskytují ostatní procesory vs PayPal {#what-other-processors-provide-vs-paypal}

**Stripe - Výpis všech předplatných:**

```http
GET https://api.stripe.com/v1/subscriptions
Authorization: Bearer sk_test_...

Response:
{
  "object": "list",
  "data": [
    {
      "id": "sub_1MowQVLkdIwHu7ixeRlqHVzs",
      "object": "subscription",
      "status": "active",
      "customer": "cus_Na6dX7aXxi11N4",
      "current_period_start": 1679609767,
      "current_period_end": 1682288167
    }
  ],
  "has_more": false
}
```

**Stripe - Filtrování podle zákazníka:**

```http
GET https://api.stripe.com/v1/subscriptions?customer=cus_Na6dX7aXxi11N4
```

**Stripe - Filtrování podle stavu:**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal - Co skutečně dostanete:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# Můžete získat POUZE JEDNO předplatné, pokud už znáte ID
# Neexistuje žádný endpoint pro výpis všech předplatných
# Neexistuje žádný způsob, jak vyhledávat nebo filtrovat
# Musíte si sledovat všechna ID předplatných sami
```

**Dostupné endpointy PayPalu:**

* `POST /v1/billing/subscriptions` - Vytvořit předplatné
* `GET /v1/billing/subscriptions/{id}` - Získat JEDNO předplatné (pokud znáte ID)
* `PATCH /v1/billing/subscriptions/{id}` - Aktualizovat předplatné
* `POST /v1/billing/subscriptions/{id}/cancel` - Zrušit předplatné
* `POST /v1/billing/subscriptions/{id}/suspend` - Pozastavit předplatné
**Co PayPal postrádá:**

* ❌ Žádné `GET /v1/billing/subscriptions` (výpis všech)
* ❌ Žádná funkce vyhledávání
* ❌ Žádné filtrování podle stavu, zákazníka, data
* ❌ Žádná podpora stránkování

PayPal je jediný významný platební procesor, který nutí vývojáře ručně sledovat ID předplatného ve svých vlastních databázích.


## Systematické zakrývání PayPalu: Utišení 6 milionů hlasů {#paypals-systematic-cover-up-silencing-6-million-voices}

V kroku, který dokonale vystihuje přístup PayPalu k řešení kritiky, nedávno kompletně odstranili své komunitní fórum, čímž efektivně utišili více než 6 milionů členů a vymazali stovky tisíc příspěvků dokumentujících jejich selhání.

### Velké vymazání {#the-great-erasure}

Původní PayPal Community na `paypal-community.com` hostila **6 003 558 členů** a obsahovala stovky tisíc příspěvků, hlášení chyb, stížností a diskuzí o selháních PayPal API. To představovalo více než desetiletí zdokumentovaných důkazů o systematických problémech PayPalu.

Dne 30. června 2025 PayPal tiše odstranil celé fórum. Všechny odkazy na `paypal-community.com` nyní vracejí chybu 404. Nešlo o migraci ani upgrade.

### Záchrana třetí stranou {#the-third-party-rescue}

Naštěstí třetí strana na [ppl.lithium.com](https://ppl.lithium.com/) zachovala část obsahu, což nám umožňuje přístup k diskuzím, které se PayPal snažil skrýt. Tato třetí strana však zachovala obsah neúplně a může kdykoli zmizet.

Tento vzorec skrývání důkazů není pro PayPal nový. Mají zdokumentovanou historii:

* Odstraňování kritických hlášení chyb z veřejného přístupu
* Ukončování vývojářských nástrojů bez upozornění
* Změny API bez řádné dokumentace
* Utišování komunitních diskuzí o jejich selháních

Odstranění fóra představuje dosud nejdrzejší pokus skrýt jejich systematická selhání před veřejnou kontrolou.


## 11letá katastrofa chyby zachycení: 1 899 $ a stále roste {#the-11-year-capture-bug-disaster-1899-and-counting}

Zatímco PayPal pořádal zpětnovazební sezení a dával sliby, jejich základní platební systém byl více než 11 let zásadně rozbitý. Důkazy jsou devastující.

### Ztráta Forward Email ve výši 1 899 $ {#forward-emails-1899-loss}

V našich produkčních systémech jsme objevili 108 plateb PayPal v celkové hodnotě **1 899 $**, které byly ztraceny kvůli selháním zachycení PayPal. Tyto platby vykazují konzistentní vzorec:

* Byly přijaty webhooky `CHECKOUT.ORDER.APPROVED`
* PayPal API pro zachycení vracelo chyby 404
* Objednávky se staly nedostupnými přes PayPal API

Není možné určit, zda byli zákazníci účtováni, protože PayPal po 14 dnech zcela skryje ladicí logy a vymaže všechna data z dashboardu pro ID objednávek, které nebyly zachyceny.

To představuje pouze jeden podnik. **Kolektivní ztráty tisíců obchodníků za více než 11 let pravděpodobně dosahují milionů dolarů.**

**Řekneme to znovu: kolektivní ztráty tisíců obchodníků za více než 11 let pravděpodobně dosahují milionů dolarů.**

Jediný důvod, proč jsme to objevili, je ten, že jsme neuvěřitelně pečliví a orientovaní na data.

### Původní zpráva z roku 2013: více než 11 let zanedbávání {#the-2013-original-report-11-years-of-negligence}

Nejstarší zdokumentovaná zpráva o tomto přesném problému se objevila na [Stack Overflow v listopadu 2013](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([archivováno](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)):

> "Stále dostávám chybu 404 s REST API při provádění zachycení"

Chyba hlášená v roce 2013 je **identická** s tím, co Forward Email zažil v roce 2024:

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

Reakce komunity v roce 2013 byla výmluvná:

> "Momentálně je hlášený problém s REST API. PayPal na tom pracuje."
**O více než 11 let později na tom stále "pracují."**

### Přiznání z roku 2016: PayPal rozbil vlastní SDK {#the-2016-admission-paypal-breaks-their-own-sdk}

V roce 2016 dokumentoval oficiální GitHub repozitář PayPalu [masivní selhání zachycení](https://github.com/paypal/PayPal-PHP-SDK/issues/660) ovlivňující jejich oficiální PHP SDK. Rozsah byl ohromující:

> "Od 20. 9. 2016 všechny pokusy o zachycení PayPalem selhávají s chybou 'INVALID_RESOURCE_ID - Requested resource ID was not found.'. Mezi 19. 9. a 20. 9. nedošlo k žádné změně v integraci API. **100 % pokusů o zachycení od 20. 9. vrací tuto chybu.**"

Jeden obchodník uvedl:

> "Měl jsem **více než 1 400 neúspěšných pokusů o zachycení za posledních 24 hodin**, všechny s chybovou odpovědí INVALID_RESOURCE_ID."

Počáteční reakce PayPalu byla obvinit obchodníka a odkázat ho na technickou podporu. Teprve po masivním tlaku přiznali chybu:

> "Mám aktualizaci od našich produktových vývojářů. Všimli si v hlavičkách, které jsou odesílány, že PayPal-Request-ID je odesíláno s 42 znaky, ale **zdá se, že nedávná změna omezila toto ID na pouhých 38 znaků.**"

Toto přiznání odhaluje systematickou nedbalost PayPalu:

1. **Provedli nedokumentované rozbíjející změny**
2. **Rozbili vlastní oficiální SDK**
3. **Nejprve obvinili obchodníky**
4. **Chybu přiznali až pod tlakem**

I po "opravení" problému obchodníci hlásili:

> "Aktualizoval jsem SDK na verzi v1.7.4 a **problém stále přetrvává.**"

### Eskalace v roce 2024: Stále rozbité {#the-2024-escalation-still-broken}

Nedávné zprávy z archivované PayPal komunity ukazují, že problém se ve skutečnosti zhoršil. [Diskuse ze září 2024](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([archivováno](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) dokumentuje přesně stejné problémy:

> "Problém se začal objevovat asi před 2 týdny a nepostihuje všechny objednávky. **Častější je chyba 404 při zachycení.**"

Obchodník popisuje stejný vzorec, jaký zažila Forward Email:

> "Po pokusu o zachycení objednávky PayPal vrací 404. Při získávání detailů objednávky: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **To je bez jakékoliv stopy úspěšného zachycení na naší straně.**"

### Katastrofa spolehlivosti webhooků {#the-webhook-reliability-disaster}

Další [archivovaná diskuse komunity](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) odhaluje, že PayPalův systém webhooků je zásadně nespolehlivý:

> "Teoreticky by měly být dvě události (CHECKOUT.ORDER.APPROVED a PAYMENT.CAPTURE.COMPLETED) z webhooku. Ve skutečnosti **tyto dvě události jsou zřídka přijímány okamžitě, PAYMENT.CAPTURE.COMPLETED většinou není přijata vůbec nebo až po několika hodinách.**"

U plateb za předplatné:

> "**'PAYMENT.SALE.COMPLETED' nebyla někdy přijata nebo až po několika hodinách.**"

Otázky obchodníka odhalují hloubku problémů spolehlivosti PayPalu:

1. **"Proč se to děje?"** - PayPalův systém webhooků je zásadně rozbitý
2. **"Pokud je stav objednávky 'COMPLETED', mohu předpokládat, že jsem peníze obdržel?"** - Obchodníci nemohou důvěřovat odpovědím PayPal API
3. **"Proč v 'Event Logs->Webhook Events' nejsou žádné záznamy?"** - Dokonce ani PayPalův vlastní systém logování nefunguje

### Vzorec systematické nedbalosti {#the-pattern-of-systematic-negligence}

Důkazy sahají přes 11 let a ukazují jasný vzorec:

* **2013**: "PayPal na tom pracuje"
* **2016**: PayPal přiznává rozbíjející změnu, poskytuje rozbitou opravu
* **2024**: Stále se vyskytují stejné chyby, ovlivňující Forward Email a nespočet dalších

Toto není chyba - **to je systematická nedbalost.** PayPal o těchto kritických selháních platebního zpracování ví více než deset let a konzistentně:
1. **Obviňovali obchodníky za chyby PayPalu**
2. **Provedli nedokumentované zásadní změny**
3. **Poskytli nedostatečné opravy, které nefungují**
4. **Ignorovali finanční dopad na podniky**
5. **Skrývali důkazy odstraněním komunitních fór**

### Nedokumentovaná požadavek {#the-undocumented-requirement}

Nikde v oficiální dokumentaci PayPalu není zmíněno, že obchodníci musí implementovat logiku opakování pokusů pro operace zachycení (capture). Jejich dokumentace uvádí, že obchodníci by měli „zachytit ihned po schválení“, ale nezmiňuje, že jejich API náhodně vrací chyby 404, které vyžadují složité mechanismy opakování pokusů.

To nutí každého obchodníka:

* Implementovat logiku opakování pokusů s exponenciálním zpomalením
* Řešit nekonzistentní doručování webhooků
* Vytvářet složité systémy správy stavů
* Manuálně sledovat neúspěšná zachycení

**Všichni ostatní poskytovatelé platebních služeb nabízejí spolehlivá API pro zachycení, která fungují na první pokus.**


## Širší vzorec klamání PayPalu {#paypals-broader-pattern-of-deception}

Katastrofa s chybou zachycení je jen jedním příkladem systematického přístupu PayPalu k oklamání zákazníků a skrývání jejich selhání.

### Akce newyorského oddělení finančních služeb {#the-new-york-department-of-financial-services-action}

V lednu 2025 vydalo newyorské oddělení finančních služeb [vykonávací opatření proti PayPalu](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf) za klamavé praktiky, což dokazuje, že vzorec klamání PayPalu přesahuje jejich API.

Toto regulační opatření ukazuje ochotu PayPalu zapojit se do klamavých praktik v celém jejich podnikání, nejen v nástrojích pro vývojáře.

### Žaloba Honey: Přepisování affiliate odkazů {#the-honey-lawsuit-rewriting-affiliate-links}

Akvizice Honey společností PayPal vedla k [žalobám, že Honey přepisuje affiliate odkazy](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer), čímž krade provize tvůrcům obsahu a influencerům. To představuje další formu systematického klamání, kdy PayPal profitují přesměrováním příjmů, které by měly patřit jiným.

Vzorec je jasný:

1. **Selhání API**: Skrývání nefunkční funkcionality, obviňování obchodníků
2. **Ticho v komunitě**: Odstraňování důkazů o problémech
3. **Porušování předpisů**: Zapojení do klamavých praktik
4. **Krádež affiliate**: Krádež provizí technickou manipulací

### Náklady na nedbalost PayPalu {#the-cost-of-paypals-negligence}

Ztráta 1 899 USD společnosti Forward Email představuje jen špičku ledovce. Zvažte širší dopad:

* **Jednotliví obchodníci**: Tisíce ztrácející stovky až tisíce dolarů každý
* **Podnikové zákazníky**: Potenciálně miliony ztracených příjmů
* **Čas vývojářů**: Nespočet hodin vytváření obcházek pro rozbité API PayPalu
* **Důvěra zákazníků**: Podniky ztrácející zákazníky kvůli selháním plateb PayPalu

Pokud jedna malá e-mailová služba ztratila téměř 2 000 USD a tento problém existuje více než 11 let a ovlivňuje tisíce obchodníků, kolektivní finanční škody pravděpodobně dosahují **stovek milionů dolarů**.

### Lež v dokumentaci {#the-documentation-lie}

Oficiální dokumentace PayPalu konzistentně nezmiňuje kritická omezení a chyby, na které obchodníci narazí. Například:

* **Capture API**: Není zmíněno, že chyby 404 jsou běžné a vyžadují logiku opakování pokusů
* **Spolehlivost webhooků**: Není zmíněno, že webhooky jsou často zpožděné o hodiny
* **Výpis předplatných**: Dokumentace naznačuje, že výpis je možný, i když žádný endpoint neexistuje
* **Časové limity relace**: Není zmíněno agresivní 60sekundové timeouty

Toto systematické vynechání kritických informací nutí obchodníky objevovat omezení PayPalu metodou pokus-omyl v produkčních systémech, což často vede k finančním ztrátám.


## Co to znamená pro vývojáře {#what-this-means-for-developers}

Systematické selhání PayPalu řešit základní potřeby vývojářů při současném sběru rozsáhlé zpětné vazby ukazuje na zásadní organizační problém. Sbírání zpětné vazby berou jako náhradu za skutečné řešení problémů.
Vzor je jasný:

1. Vývojáři hlásí problémy  
2. PayPal organizuje zpětnovazební sezení s vedením  
3. Poskytuje se rozsáhlá zpětná vazba  
4. Týmy uznávají nedostatky a slibují „sledovat a řešit“  
5. Nic se neimplementuje  
6. Vedení odchází do lepších společností  
7. Nové týmy žádají o stejnou zpětnou vazbu  
8. Cyklus se opakuje  

Mezitím jsou vývojáři nuceni vytvářet obcházení, dělat kompromisy v bezpečnosti a řešit rozbité uživatelské rozhraní jen proto, aby mohli přijímat platby.

Pokud budujete platební systém, poučte se z naší zkušenosti: vytvořte si svůj [trifecta přístup](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal) s více procesory, ale neočekávejte, že vám PayPal poskytne základní funkce, které potřebujete. Plánujte vytvářet obcházení od prvního dne.

> Tento příspěvek dokumentuje naši 11letou zkušenost s PayPal API ve Forward Email. Všechny ukázky kódu a odkazy pocházejí z našich skutečných produkčních systémů. Přestože tyto problémy existují, nadále podporujeme platby přes PayPal, protože někteří zákazníci nemají jinou možnost

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API disaster illustration" class="rounded-lg" />
