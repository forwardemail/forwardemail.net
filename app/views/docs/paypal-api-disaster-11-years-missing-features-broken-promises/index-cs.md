# Jedenáctiletá katastrofa API PayPalu: Jak jsme vytvářeli alternativní řešení, zatímco oni ignorovali vývojáře {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="PayPal API disaster illustration" class="rounded-lg" />

<p class="lead mt-3">Ve Forward Email se již více než deset let potýkáme s nefunkčními API PayPalu. Co začalo jako drobná frustrace, se změnilo v naprostou katastrofu, která nás donutila vymyslet si vlastní řešení, blokovat jejich phishingové šablony a nakonec zastavit všechny platby přes PayPal během kritické migrace účtu.</p>
<p class="lead mt-3">Toto je příběh o 11 letech, kdy PayPal ignoroval základní potřeby vývojářů, zatímco jsme se snažili všemožně zprovoznit jejich platformu.</p>

## Obsah {#table-of-contents}

* [Chybějící kousek: Není možné zobrazit seznam předplatných](#the-missing-piece-no-way-to-list-subscriptions)
* [2014–2017: Problém se objevuje](#2014-2017-the-problem-emerges)
* [2020: Poskytujeme jim rozsáhlou zpětnou vazbu](#2020-we-give-them-extensive-feedback)
  * [Seznam zpětné vazby s 27 položkami](#the-27-item-feedback-list)
  * [Týmy se zapojily, sliby padly](#teams-got-involved-promises-were-made)
  * [Výsledek? Nic.](#the-result-nothing)
* [Exodus manažerů: Jak PayPal ztratil veškerou institucionální paměť](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025: Nové vedení, stejné problémy](#2025-new-leadership-same-problems)
  * [Nový generální ředitel se zapojuje](#the-new-ceo-gets-involved)
  * [Odpověď Michelle Gill](#michelle-gills-response)
  * [Naše odpověď: Žádné další schůzky](#our-response-no-more-meetings)
  * [Marty Brodbeckův nadměrný inženýrský přístup](#marty-brodbecks-overengineering-response)
  * [Rozpor „jednoduchého CRUD“](#the-simple-crud-contradiction)
  * [Rozpor se vyjasňuje](#the-disconnect-becomes-clear)
* [Roky hlášení chyb, které ignorovali](#years-of-bug-reports-they-ignored)
  * [2016: První stížnosti na UI/UX](#2016-early-uiux-complaints)
  * [2021: Zpráva o chybě firemního e-mailu](#2021-business-email-bug-report)
  * [2021: Návrhy na vylepšení uživatelského rozhraní](#2021-ui-improvement-suggestions)
  * [2021: Selhání sandboxového prostředí](#2021-sandbox-environment-failures)
  * [2021: Systém hlášení zcela nefunkční](#2021-reports-system-completely-broken)
  * [2022: Chybí (opět) základní funkce API](#2022-core-api-feature-missing-again)
* [Noční můra vývojářského prostředí](#the-developer-experience-nightmare)
  * [Nefunkční uživatelské rozhraní](#broken-user-interface)
  * [Problémy se SDK](#sdk-problems)
  * [Porušení zásad zabezpečení obsahu](#content-security-policy-violations)
  * [Dokumentační chaos](#documentation-chaos)
  * [Bezpečnostní zranitelnosti](#security-vulnerabilities)
  * [Katastrofa správy relací](#session-management-disaster)
* [Červenec 2025: Poslední kapka](#july-2025-the-final-straw)
* [Proč nemůžeme jen tak zrušit PayPal](#why-we-cant-just-drop-paypal)
* [Řešení komunity](#the-community-workaround)
* [Blokování šablon PayPal kvůli phishingu](#blocking-paypal-templates-due-to-phishing)
  * [Skutečný problém: Šablony PayPal vypadají jako podvody](#the-real-problem-paypals-templates-look-like-scams)
  * [Naše implementace](#our-implementation)
  * [Proč jsme museli zablokovat PayPal](#why-we-had-to-block-paypal)
  * [Rozsah problému](#the-scale-of-the-problem)
  * [Ironie](#the-irony)
  * [Dopad na reálný svět: Nové podvody s PayPalem](#real-world-impact-novel-paypal-scams)
* [Proces zpětného KYC u PayPalu](#paypals-backwards-kyc-process)
  * [Jak by to mělo fungovat](#how-it-should-work)
  * [Jak PayPal ve skutečnosti funguje](#how-paypal-actually-works)
  * [Dopad na reálný svět](#the-real-world-impact)
  * [Katastrofa s migrací účtů v červenci 2025](#the-july-2025-account-migration-disaster)
  * [Proč je to důležité](#why-this-matters)
* [Jak to dělá každý jiný platební procesor správně](#how-every-other-payment-processor-does-it-right)
  * [Proužek](#stripe)
  * [Pádlo](#paddle)
  * [Coinbase Commerce](#coinbase-commerce)
  * [Náměstí](#square)
  * [Průmyslový standard](#the-industry-standard)
  * [Co poskytují ostatní zpracovatelé v porovnání s PayPalem](#what-other-processors-provide-vs-paypal)
* [Systematické zatajování ze strany PayPal: Umlčení 6 milionů hlasů](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [Velké vymazání](#the-great-erasure)
  * [Záchrana třetí strany](#the-third-party-rescue)
* [Jedenáctiletá katastrofa s chybou v zachycování: 1 899 dolarů a stále přibývá](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [Ztráta 1 899 dolarů za přeposílaný e-mail](#forward-emails-1899-loss)
  * [Původní zpráva z roku 2013: Více než 11 let nedbalosti](#the-2013-original-report-11-years-of-negligence)
  * [Přiznání z roku 2016: PayPal prolomil vlastní SDK](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [Eskalace v roce 2024: Stále zlomená](#the-2024-escalation-still-broken)
  * [Katastrofa spolehlivosti webhooku](#the-webhook-reliability-disaster)
  * [Vzor systematické nedbalosti](#the-pattern-of-systematic-negligence)
  * [Nedokumentovaný požadavek](#the-undocumented-requirement)
* [Širší vzorec podvodů PayPalu](#paypals-broader-pattern-of-deception)
  * [Akce Ministerstva finančních služeb New Yorku](#the-new-york-department-of-financial-services-action)
  * [Soudní spor s medem: Přepisování partnerských odkazů](#the-honey-lawsuit-rewriting-affiliate-links)
  * [Cena za nedbalost společnosti PayPal](#the-cost-of-paypals-negligence)
  * [Lež o dokumentaci](#the-documentation-lie)
* [Co to znamená pro vývojáře](#what-this-means-for-developers)

## Chybějící kousek: Není možné zobrazit seznam předplatných {#the-missing-piece-no-way-to-list-subscriptions}

Tady je ta věc, která nás zaráží: PayPal má fakturaci za předplatné od roku 2014, ale nikdy neposkytl obchodníkům způsob, jak si sami zobrazovat svá předplatná.

Zamyslete se nad tím na chvilku. Můžete vytvářet předplatné, můžete je rušit, pokud máte ID, ale nemůžete získat seznam všech aktivních předplatných pro váš účet. Je to jako mít databázi bez příkazu SELECT.

Pro základní obchodní operace potřebujeme:

* Zákaznická podpora (když se někdo e-mailem ptá na své předplatné)
* Finanční reporting a odsouhlasování
* Automatizovaná správa fakturace
* Dodržování předpisů a audit

Ale PayPal? Prostě ho... nikdy nevytvořili.

## 2014–2017: Problém se objevuje {#2014-2017-the-problem-emerges}

Problém se seznamem předplatných se poprvé objevil na komunitních fórech PayPal v roce 2017. Vývojáři si kladli zřejmou otázku: „Jak získám seznam všech svých předplatných?“

Reakce PayPalu? Cvrčci.

Členové komunity začali být frustrovaní:

> „Velmi zvláštní opomenutí, pokud obchodník nemůže zobrazit seznam všech aktivních smluv. Pokud se ztratí ID smlouvy, znamená to, že smlouvu může zrušit nebo pozastavit pouze uživatel.“ - leafspider

> „+1. Jsou to téměř 3 roky.“ - laudukang (což znamená, že problém existoval od roku \~2014)

Souhrn [původní příspěvek komunity](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) z roku 2017 ukazuje vývojáře, kteří o tuto základní funkci prosili. Reakcí PayPal byla archivace repozitáře, kde lidé problém hlásili.

## 2020: Poskytujeme jim rozsáhlou zpětnou vazbu {#2020-we-give-them-extensive-feedback}

V říjnu 2020 nás společnost PayPal kontaktovala s žádostí o formální zpětnou vazbu. Nejednalo se o nezávazný rozhovor – zorganizovali 45minutový hovor o platformě Microsoft Teams s 8 vedoucími pracovníky společnosti PayPal, včetně Sri Shivanandy (CTO), Edwina Aokiho, Jima Magatse, Johna Kunzeho a dalších.

### Seznam zpětné vazby s 27 položkami {#the-27-item-feedback-list}

Přišli jsme připraveni. Po 6 hodinách pokusů o integraci s jejich API jsme sestavili 27 konkrétních problémů. Mark Stuart z týmu PayPal Checkout řekl:

> Ahoj Nicku, díky za dnešní sdílení s ostatními! Myslím, že tohle bude katalyzátorem pro získání větší podpory a investic pro náš tým, aby se s těmito věcmi vypořádal. Bylo těžké získat tak bohatou zpětnou vazbu, jakou jsi nám zatím zanechal.

Zpětná vazba nebyla teoretická – pocházela ze skutečných pokusů o integraci:

1. **Generování přístupových tokenů nefunguje**:

> Generování přístupových tokenů nefunguje. Také by mělo být více než jen příklady cURL.

2. **Žádné webové rozhraní pro vytváření předplatného**:

> Jak sakra můžete vytvářet odběry, aniž byste to museli dělat pomocí cURL? Zdá se, že na to neexistuje webové rozhraní (jako to má Stripe)

Mark Stuart shledal problém s přístupovým tokenem obzvláště znepokojivým:

> O problémech s generováním přístupových tokenů obvykle neslyšíme.

### Týmy se zapojily, sliby byly dány {#teams-got-involved-promises-were-made}

Jak jsme objevovali další problémy, PayPal do konverzace přidával další týmy. Darshan Raju z týmu pro správu uživatelského rozhraní předplatného se připojil a řekl:

> Uznejte mezeru. Budeme ji sledovat a řešit. Ještě jednou děkujeme za vaši zpětnou vazbu!

Sezení bylo popsáno jako hledání:

> upřímný popis vaší zkušenosti

na:

> udělejte z PayPalu to, čím by měl být pro vývojáře.

### Výsledek? Nic. {#the-result-nothing}

Navzdory formálnímu zasedání pro zpětnou vazbu, rozsáhlému seznamu 27 položek, zapojení více týmů a slibům:

> sledovat a adresovat

problémy, absolutně nic se neopravilo.

## Exodus manažerů: Jak PayPal ztratil veškerou institucionální paměť {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

A tady to začíná být opravdu zajímavé. Každý, kdo obdržel naši zpětnou vazbu za rok 2020, opustil PayPal:

**Změny ve vedení:**

* [Dan Schulman (generální ředitel 9 let) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (září 2023)
* [Sri Shivananda (technický ředitel, který organizoval zpětnou vazbu) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (leden 2024)

**Techničtí lídři, kteří slibovali a pak odešli:**

* **Mark Stuart** (slibovaná zpětná vazba bude „katalyzátorem“) → [Nyní u Ripple](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (18letý veterán PayPal) → [Generální ředitel společnosti MX](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (viceprezident pro globální spotřebitelské produkty) → [V důchodu](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (jeden z posledních zbývajících) → [Právě odešel na Nasdaq](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (leden 2025)

PayPal se stal otáčivým systémem, kde manažeři shromažďují zpětnou vazbu od vývojářů, dávají sliby a poté odcházejí do lepších společností, jako je JPMorgan, Ripple a další fintech firmy.

To vysvětluje, proč se odpověď na problém GitHubu z roku 2025 zdála být zcela odpojená od naší zpětné vazby z roku 2020 – doslova každý, kdo tuto zpětnou vazbu obdržel, PayPal opustil.

## 2025: Nové vedení, stejné problémy {#2025-new-leadership-same-problems}

Přeneseme-li se do roku 2025, objeví se přesně stejný vzorec. Po letech bez pokroku se nové vedení PayPalu opět obrací na společnost.

### Nový generální ředitel se zapojuje {#the-new-ceo-gets-involved}

Dne 30. června 2025 jsme se obrátili přímo na nového generálního ředitele PayPalu, Alexe Chrissa. Jeho odpověď byla stručná:

> Ahoj Nicku – děkuji za tvůj kontakt a za zpětnou vazbu. Michelle (v cc'd) se svým týmem je připravena se s tebou spojit a vyřešit to s tebou. Díky -A

### Odpověď Michelle Gill {#michelle-gills-response}

Michelle Gill, výkonná viceprezidentka a generální ředitelka pro malé podniky a finanční služby, odpověděla:

> Moc děkuji, Nicku, přesouvám Alex do skryté kopie. Zabýváme se tím od tvého předchozího příspěvku. Zavoláme ti do konce týdne. Mohl bys mi prosím poslat své kontaktní údaje, aby se s tebou mohl spojit jeden z mých kolegů? Michelle

### Naše odpověď: Žádné další schůzky {#our-response-no-more-meetings}

Další schůzku jsme odmítli s tím, že naši frustraci vysvětlujeme takto:

> Děkuji. Nicméně si nemyslím, že když se někdo ozve, tak to k něčemu pomůže. A tady je důvod... V minulosti jsem se ozve někdo, kdo mi volal, ale nikam to nevedlo. Ztratil jsem více než 2 hodiny času mluvením s celým týmem a vedením a nic se nedělo... Spousty e-mailů tam a zpět. Absolutně nic se nedělo. Zpětná vazba nikam nevedla. Snažil jsem se to roky, byli jsem vyslyšeni a pak to nikam nevedlo.

### Marty Brodbeck: Reakce na přehnané inženýrství {#marty-brodbecks-overengineering-response}

Pak se ozval Marty Brodbeck, který vede oddělení spotřebitelského inženýrství ve společnosti PayPal:

> Ahoj Nicku, tady Marty Brodbeck. Vedu veškeré spotřebitelské inženýrství tady v PayPalu a řídil jsem vývoj API pro tuto společnost. Můžeme se s vámi spojit ohledně problému, kterému čelíte, a jak vám můžeme pomoci?

Když jsme vysvětlili jednoduchou potřebu koncového bodu pro výpis předplatného, jeho odpověď odhalila přesný problém:

> Díky Nicku, právě vytváříme jednotné API pro předplatné s plnohodnotným SDK (podporuje plné zpracování chyb, sledování předplatného na základě událostí, robustní dostupnost), kde je fakturace také oddělena jako samostatné API, na které se obchodníci mohou obrátit, místo aby museli orchestrovat napříč více koncovými body, aby získali jednu odpověď.

To je přesně špatný přístup. Nepotřebujeme měsíce složité architektury. Potřebujeme jeden jednoduchý REST endpoint, který vypisuje předplatné – něco, co mělo existovat už od roku 2014.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### Rozpor typu „jednoduchý CRUD“ {#the-simple-crud-contradiction}

Když jsme zdůraznili, že se jedná o základní funkcionalitu CRUD, která měla existovat od roku 2014, Martyho odpověď byla výmluvná:

> Jednoduché Crud operace jsou součástí jádra API, příteli, takže vývoj nezabere měsíce

Sada PayPal TypeScript SDK, která po měsících vývoje v současnosti podporuje pouze tři koncové body, spolu s její historickou časovou osou jasně ukazuje, že dokončení takových projektů vyžaduje více než jen několik měsíců.

Tato odpověď ukazuje, že nerozumí svému vlastnímu API. Pokud jsou „jednoduché operace CRUD součástí základního API“, kde je pak koncový bod pro výpis předplatného? Odpověděli jsme:

> Pokud jsou „jednoduché operace CRUD součástí základního API“, kde je pak koncový bod pro výpis předplatného? Vývojáři požadují tuto „jednoduchou operaci CRUD“ od roku 2014. Je to už 11 let. Každý jiný platební procesor má tuto základní funkcionalitu od prvního dne.

### Odpojení se vyjasňuje {#the-disconnect-becomes-clear}

Výměny názorů s Alexem Chrissem, Michelle Gillovou a Martym Brodbeckem z roku 2025 ukazují stejnou organizační dysfunkci:

1. **Nové vedení nemá žádné znalosti o předchozích setkáních se zpětnou vazbou**
2. **Navrhují stejná přepracovaná řešení**
3. **Nerozumí omezením vlastního API**
4. **Chtějí více schůzek, místo aby jen řešili problém**

Tento vzorec vysvětluje, proč se týmy PayPal v roce 2025 zdají být zcela odpojeny od rozsáhlé zpětné vazby poskytnuté v roce 2020 – lidé, kteří tuto zpětnou vazbu obdrželi, jsou pryč a nové vedení opakuje stejné chyby.

## Roky hlášení chyb, které ignorovali {#years-of-bug-reports-they-ignored}

Nejenže jsme si stěžovali na chybějící funkce. Aktivně jsme hlásili chyby a snažili se je pomoci vylepšit. Zde je podrobný časový přehled problémů, které jsme zdokumentovali:

### 2016: První stížnosti na UI/UX {#2016-early-uiux-complaints}

Už v roce 2016 jsme veřejně kontaktovali vedení PayPalu, včetně Dana Schulmana, ohledně problémů s rozhraním a použitelností. To bylo před 9 lety a stejné problémy s UI/UX přetrvávají dodnes.

### 2021: Hlášení chyby firemního e-mailu {#2021-business-email-bug-report}

V březnu 2021 jsme nahlásili, že firemní e-mailový systém PayPal odesílal nesprávná oznámení o zrušení. Šablona e-mailu obsahovala nesprávně vykreslené proměnné, což zákazníkům zobrazovalo matoucí zprávy.

Mark Stuart problém uznal:

> Díky Nicku! Přecházím k skryté kopii. @Prasy, je za tento e-mail zodpovědný váš tým, nebo víte kdo? Tvrzení „Niftylettuce, LLC, už vám nebudeme účtovat“ mě vede k domněnce, že došlo k záměně v tom, komu je e-mail adresován, a v jeho obsahu.

**Výsledek**: Tohle opravdu opravili! Mark Stuart potvrdil:

> Právě jsem se dozvěděl od týmu pro oznámení, že šablona e-mailu byla opravena a spuštěna. Děkuji, že jste se na nás obrátili s nahlášením. Děkujeme!

To ukazuje, že MOHOU věci opravit, když chtějí - jen se u většiny problémů rozhodnou to neudělat.

### 2021: Návrhy na vylepšení uživatelského rozhraní {#2021-ui-improvement-suggestions}

V únoru 2021 jsme poskytli podrobnou zpětnou vazbu k uživatelskému rozhraní jejich dashboardu, konkrétně k sekci „Nedávná aktivita PayPalu“:

> Myslím, že dashboard na paypal.com, konkrétně „Nedávná aktivita PayPalu“, potřebuje vylepšit. Nemyslím si, že byste měli zobrazovat stavové řádky „Vytvořeno“ pro opakující se platbu ve výši 0 $ – jen by to přidalo spoustu dalších řádků a na první pohled nebylo možné snadno vidět, kolik příjmů generuje daný den/posledních pár dní.

Mark Stuart to přeposlal týmu pro spotřební zboží:

> Díky! Nejsem si jistý/á, který tým je zodpovědný za aktivitu, ale přeposlal/a jsem to vedoucímu oddělení spotřebitelských produktů, aby našel správný tým. Opakující se platba 0,00 USD se zdá být chybou. Pravděpodobně by to mělo být odfiltrováno.

**Výsledek**: Nikdy neopraveno. Uživatelské rozhraní stále zobrazuje tyto zbytečné položky $0.

### 2021: Chyby sandboxového prostředí {#2021-sandbox-environment-failures}

V listopadu 2021 jsme nahlásili kritické problémy s prostředím sandboxu služby PayPal:

* Tajné klíče API sandboxu byly náhodně změněny a deaktivovány.
* Všechny testovací účty sandboxu byly bez upozornění smazány.
* Chybové zprávy při pokusu o zobrazení podrobností o účtu sandboxu.
* Občasné selhání načítání.

> Z nějakého důvodu byl můj tajný klíč API pro sandbox změněn a byl deaktivován. Také byly smazány všechny mé staré testovací účty pro sandbox.

> Někdy se načítají a někdy ne tak dobře. To je neskutečně frustrující.

**Výsledek**: Žádná odpověď, žádná oprava. Vývojáři stále čelí problémům se spolehlivostí sandboxu.

### 2021: Systém hlášení zcela nefunkční {#2021-reports-system-completely-broken}

V květnu 2021 jsme informovali, že systém stahování transakčních zpráv od PayPalu byl zcela nefunkční:

> Zdá se, že stahování přehledů momentálně nefunguje a nefunguje celý den. Také by se pravděpodobně mělo dostat e-mailové upozornění, pokud se to nepodaří.

Také jsme poukázali na katastrofu ve správě relací:

> Také pokud jste během přihlášení do PayPalu neaktivní po dobu asi 5 minut, budete odhlášeni. Takže když znovu obnovíte tlačítko vedle zprávy, jejíž stav chcete zkontrolovat (po věčném čekání), je otravné se znovu přihlašovat.

Mark Stuart uznal problém s časovým limitem relace:

> Vzpomínám si, že jsi v minulosti hlásil, že ti často vypršela relace a narušila to tvůj vývojový proces při přepínání mezi IDE a developer.paypal.com nebo obchodním dashboardem. Pak ses vrátil a byl jsi znovu odhlášen.

**Výsledek**: Časové limity relací jsou stále 60 sekund. Systém hlášení stále pravidelně selhává.

### 2022: Chybí (opět) základní funkce API {#2022-core-api-feature-missing-again}

V lednu 2022 jsme problém s výpisem předplatného znovu eskalovali, tentokrát s ještě podrobnějším popisem chyb v dokumentaci:

> Neexistuje žádný příkaz GET, který by vypisoval všechna předplatná (dříve nazývaná fakturační smlouvy)

Zjistili jsme, že jejich oficiální dokumentace byla zcela nepřesná:

> Dokumentace k API je také naprosto nepřesná. Mysleli jsme si, že bychom to mohli obejít stažením pevně naprogramovaného seznamu ID předplatného. Ale ani to nefunguje!

> Z oficiální dokumentace zde... Píše se tam, že tohle můžete udělat... Háček je v tom - nikde není zaškrtnuté pole „ID předplatného“.

Christina Monti z PayPalu odpověděla:

> Omlouváme se za frustrace způsobené chybnými kroky, tento týden to napravíme.

Šrí Šivananda (CTO) nám poděkoval:

> Děkujeme za vaši neustálou pomoc při zlepšování našich služeb. Velice si toho vážíme.

**Výsledek**: Dokumentace nebyla nikdy opravena. Koncový bod seznamu předplatného nebyl nikdy vytvořen.

## Noční můra vývojářského prostředí {#the-developer-experience-nightmare}

Práce s API PayPal je jako návrat o 10 let zpět v čase. Zde jsou technické problémy, které jsme zdokumentovali:

### Nefunkční uživatelské rozhraní {#broken-user-interface}

Vývojářský dashboard PayPalu je katastrofa. S tímto se denně potýkáme:

<figure>
<figcaption><div class="alert alert-danger small text-center">
Uživatelské rozhraní PayPalu je tak nefunkční, že nelze ani zavřít oznámení
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
Váš prohlížeč nepodporuje tag video.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Vývojářský panel vás doslova nutí přetahovat posuvník a po 60 sekundách vás odhlásí.
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
Váš prohlížeč nepodporuje tag video.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Další katastrofy uživatelského rozhraní ve vývojářském rozhraní PayPal ukazující na nefunkční pracovní postupy
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
Váš prohlížeč nepodporuje tag video.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Rozhraní pro správu předplatného – rozhraní je tak špatné, že jsme se museli spoléhat na kód pro generování produktů a plánů předplatného
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="PayPal subscriptions screenshot" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Pohled na nefunkční rozhraní předplatného s chybějící funkcionalitou (nelze snadno vytvářet produkty/plány/předplatné – a zdá se, že neexistuje žádný způsob, jak produkty ani plány po vytvoření v uživatelském rozhraní smazat)
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="PayPal subscriptions screenshot 2" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Typické chybové zprávy PayPalu – tajemné a neužitečné
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### Problémy se sadou SDK {#sdk-problems}

* Nelze zpracovat jednorázové platby i předplatné bez složitých řešení zahrnujících výměnu a opětovné vykreslování tlačítek při opětovném načítání SDK pomocí skriptových tagů.
* JavaScript SDK porušuje základní konvence (názvy tříd malými písmeny, žádná kontrola instancí).
* Chybové zprávy neuvádějí, která pole chybí.
* Nekonzistentní datové typy (vyžadují řetězcové částky místo čísel).

### Porušení zásad zabezpečení obsahu {#content-security-policy-violations}

Jejich SDK vyžaduje ve vašem CSP parametry unsafe-inline a unsafe-eval, což vás **nutí ohrozit zabezpečení vašeho webu**.

### Dokumentační chaos {#documentation-chaos}

Sám Mark Stuart přiznal:

> Souhlasím, že existuje absurdní množství starších a nových API. Je opravdu těžké najít, co hledat (i pro nás, kteří tady pracujeme).

### Bezpečnostní zranitelnosti {#security-vulnerabilities}

**Implementace 2FA u PayPalu je obrácená.** I s povolenými aplikacemi TOTP vynucují ověření pomocí SMS – čímž činí účty zranitelnými vůči útokům na výměnu SIM karty. Pokud máte povolený TOTP, měl by systém používat výhradně toto ověřování. Záložní možností by měl být e-mail, nikoli SMS.

### Havárie správy relací {#session-management-disaster}

**Jejich vývojářský panel vás po 60 sekundách nečinnosti odhlásí.** Zkuste dělat cokoli produktivního a neustále procházíte: přihlášení → captcha → 2FA → odhlášení → opakování. Používáte VPN? Hodně štěstí.

## Červenec 2025: Poslední kapka {#july-2025-the-final-straw}

Po 11 letech stejných problémů nastal zlomový bod během rutinní migrace účtu. Potřebovali jsme přejít na nový účet PayPal, který by odpovídal názvu naší společnosti „Forward Email LLC“, abychom měli přehlednější účetnictví.

Co mělo být jednoduché, se změnilo v naprostou katastrofu:

* Počáteční testování ukázalo, že vše funguje správně.
* O několik hodin později PayPal náhle a bez upozornění zablokoval všechny platby předplatného.
* Zákazníci nemohli platit, což způsobilo zmatek a zátěž podpory.
* Podpora PayPal poskytla protichůdné odpovědi s tvrzením, že účty byly ověřeny.
* Byli jsme nuceni platby přes PayPal zcela zastavit.

<figure>
<figcaption><div class="alert alert-danger small text-center">
Chyba, kterou zákazníci viděli při pokusu o platbu - žádné vysvětlení, žádné protokoly, nic
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Podpora PayPalu tvrdí, že vše bylo v pořádku, zatímco platby byly zcela nefunkční. V poslední zprávě se píše, že „obnovili některé funkce“, ale stále se ptají na blíže neurčené informace – klasické divadlo podpory PayPal
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
Proces ověřování identity, který údajně nic „neopravil“
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
Nejasná zpráva a stále žádné řešení. Žádné informace, oznámení ani cokoli o tom, jaké další informace jsou vyžadovány. Zákaznická podpora mlčí.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>

## Proč nemůžeme jen tak zrušit PayPal {#why-we-cant-just-drop-paypal}

Navzdory všem těmto problémům nemůžeme PayPal úplně opustit, protože někteří zákazníci mají jako platební možnost pouze PayPal. Jak uvedl jeden zákazník na našem [stavová stránka](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515):

> PayPal je moje jediná možnost platby

**Jsme nuceni podporovat nefunkční platformu, protože PayPal vytvořil platební monopol pro určité uživatele.**

## Komunitní řešení {#the-community-workaround}

Protože PayPal neposkytuje základní funkce pro správu předplatného, komunita vývojářů vytvořila alternativní řešení. Vytvořili jsme skript, který pomáhá spravovat předplatné PayPal: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

Tento skript odkazuje na [podstata komunity](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4), kde vývojáři sdílejí řešení. Uživatelé jsou ve skutečnosti [děkují nám](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775) za to, že poskytují to, co měl PayPal vytvořit už před lety.

## Blokování šablon PayPal kvůli phishingu {#blocking-paypal-templates-due-to-phishing}

Problémy sahají nad rámec API. Šablony e-mailů PayPal jsou tak špatně navržené, že jsme museli v naší e-mailové službě implementovat specifické filtrování, protože jsou nerozeznatelné od phishingových pokusů.

### Skutečný problém: Šablony PayPalu vypadají jako podvody {#the-real-problem-paypals-templates-look-like-scams}

Pravidelně dostáváme hlášení o e-mailech od PayPalu, které vypadají přesně jako pokusy o phishing. Zde je skutečný příklad z našich hlášení o zneužití:

**Předmět:** DOČASNÝ_ZÁSADNÍ_PŘÍSPĚVEK_0

Tento e-mail byl přeposlán na adresu `abuse@microsoft.com`, protože se zdálo, že se jedná o pokus o phishing. Problém? Ve skutečnosti pocházel z prostředí sandboxu PayPal, ale design jejich šablony je tak špatný, že spustí systémy pro detekci phishingu.

### Naše implementace {#our-implementation}

Filtrování specifické pro PayPal implementované v našem [kód pro filtrování e-mailů](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172) si můžete prohlédnout:

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
    'Due to ongoing PayPal invoice spam, you must manually send an invoice link'
  );
  err.isCodeBug = true; // alert admins for inspection
  throw err;
}
```

### Proč jsme museli zablokovat PayPal {#why-we-had-to-block-paypal}

Toto jsme zavedli, protože PayPal odmítl opravit masivní problémy se spamem/phishingem/podvody i přes naše opakované hlášení jejich týmům pro zneužívání. Mezi konkrétní typy e-mailů, které blokujeme, patří:

* **RT000238** - Podezřelá oznámení o fakturách
* **PPC001017** - Problematická potvrzení plateb
* **RT000542** - Pokusy o hacknutí dárkových zpráv

### Rozsah problému {#the-scale-of-the-problem}

Naše protokoly filtrování spamu ukazují obrovský objem spamu s fakturami PayPal, který denně zpracováváme. Mezi blokované subjekty patří například:

* „Faktura od fakturačního týmu PayPal: – Tato částka bude automaticky stržena z vašeho účtu. Kontaktujte nás prosím neprodleně na čísle \[TELEFON]“
* „Faktura od \[NÁZEV SPOLEČNOSTI] (\[ID OBJEDNÁVKY])“
* Více variant s různými telefonními čísly a falešnými ID objednávek

Tyto e-maily často pocházejí z hostitelů `outlook.com`, ale zdá se, že pocházejí z legitimních systémů PayPalu, což je činí obzvláště nebezpečnými. E-maily procházejí ověřováním SPF, DKIM a DMARC, protože jsou odesílány prostřednictvím skutečné infrastruktury PayPalu.

Naše technické protokoly ukazují, že tyto spamové e-maily obsahují legitimní hlavičky PayPal:

* `X-Email-Type-Id: RT000238` (stejné ID, které blokujeme)
* `From: "service@paypal.com" <service@paypal.com>`
* Platné podpisy DKIM z `paypal.com`
* Správné záznamy SPF zobrazující poštovní servery PayPal

To vytváří nemožnou situaci: legitimní e-maily PayPal a spam mají stejné technické vlastnosti.

### Ironie {#the-irony}

PayPal, společnost, která by měla vést boj proti finančním podvodům, má šablony e-mailů navržené tak špatně, že spouštějí anti-phishingové systémy. Jsme nuceni blokovat legitimní e-maily PayPal, protože jsou k nerozeznání od podvodných.

Toto je zdokumentováno v bezpečnostním výzkumu: [Pozor na podvod s novými adresami v PayPalu](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) – ukazuje, jak jsou systémy PayPalu zneužívány k podvodům.

### Dopad na reálný svět: Nové podvody s PayPalem {#real-world-impact-novel-paypal-scams}

Problém sahá víc než jen nad rámec špatného designu šablony. Fakturační systém PayPal je tak snadno zneužitelný, že ho podvodníci pravidelně zneužívají k zasílání podvodných faktur vypadajících jako legitimní. Bezpečnostní výzkumník Gavin Anderegg zdokumentoval [Nový podvod s PayPalem](https://anderegg.ca/2023/02/01/a-novel-paypal-scam), kdy podvodníci zasílají skutečné faktury PayPal, které projdou všemi ověřovacími kontrolami:

> „Při kontrole zdroje vypadalo, že e-mail skutečně pocházel z PayPalu (SPF, DKIM a DMARC prošly testem). Tlačítko také odkazovalo na něco, co vypadalo jako legitimní URL adresa PayPalu... Chvíli mi trvalo, než mi došlo, že se jedná o legitimní e-mail. Právě mi podvodník poslal náhodnou „fakturu“.“

<figure>
<figcaption><div class="alert alert-danger small text-center">
Snímek obrazovky ukazující několik podvodných faktur PayPal zaplavujících doručenou poštu, které se zdají být legitimní, protože ve skutečnosti pocházejí ze systémů PayPal.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="PayPal scam warning screenshot" class="rounded-lg" />
</figure>

Výzkumník poznamenal:

> „Zdá se mi to také jako praktická funkce, kterou by PayPal měl zvážit uzamčení. Okamžitě jsem předpokládal, že se jedná o nějaký podvod, a zajímaly mě jen technické detaily. Zdá se mi to až příliš snadné a obávám se, že by na to mohli naletět i ostatní.“

To dokonale ilustruje problém: legitimní systémy PayPalu jsou tak špatně navržené, že umožňují podvody a zároveň legitimní komunikaci činí podezřelou.

Aby toho nebylo málo, ovlivnilo to naši doručitelnost s Yahoo, což vedlo ke stížnostem zákazníků a hodinám pečlivého testování a kontroly vzorců.

## Zpětný proces KYC u PayPalu {#paypals-backwards-kyc-process}

Jedním z nejvíce frustrujících aspektů platformy PayPal je jejich obrácený přístup k dodržování předpisů a postupům Know Your Customer (KYC). Na rozdíl od všech ostatních platebních procesorů umožňuje PayPal vývojářům integrovat svá API a začít shromažďovat platby v produkčním prostředí ještě před dokončením řádného ověření.

### Jak by to mělo fungovat {#how-it-should-work}

Každý legitimní platební procesor se řídí touto logickou posloupností:

1. **Nejprve dokončete ověření KYC**
2. **Schválení obchodního účtu**
3. **Poskytnutí přístupu k produkčnímu API**
4. **Povolení inkasa plateb**

To chrání jak zpracovatele plateb, tak obchodníka tím, že zajišťuje soulad s předpisy ještě předtím, než peníze změní majitele.

### Jak PayPal ve skutečnosti funguje {#how-paypal-actually-works}

Proces PayPalu je zcela obrácený:

1. **Okamžitě poskytněte přístup k produkčnímu API**
2. **Povolte inkaso plateb na hodiny nebo dny**
3. **Náhle zablokujte platby bez upozornění**
4. **Požadujte dokumentaci KYC poté, co jsou zákazníci již postiženi**
5. **Neposkytujte obchodníkovi žádné upozornění**
6. **Nechte zákazníky problém zjistit a nahlásit**

### Dopad na reálný svět {#the-real-world-impact}

Tento zpětný proces vytváří pro firmy katastrofy:

* **Zákazníci nemohou dokončit nákupy** během období špičkových výprodejů
* **Žádné předběžné varování** o nutnosti ověření
* **Žádná e-mailová oznámení** při blokování plateb
* **Obchodníci se o problémech dozvídají od zmatených zákazníků**
* **Ztráta tržeb** během kritických obchodních období
* **Poškození důvěry zákazníků** při záhadném selhání plateb

### Katastrofa s migrací účtů v červenci 2025 {#the-july-2025-account-migration-disaster}

Přesně tento scénář se odehrál během naší rutinní migrace účtu v červenci 2025. PayPal zpočátku umožňoval platby, pak je náhle bez jakéhokoli upozornění zablokoval. Problém jsme objevili, až když zákazníci začali hlásit, že nemohou platit.

Když jsme kontaktovali podporu, obdrželi jsme protichůdné odpovědi ohledně toho, jaká dokumentace je potřeba, bez jasného časového harmonogramu pro řešení. To nás donutilo zcela zastavit platby přes PayPal, což mátlo zákazníky, kteří neměli žádné jiné možnosti platby.

### Proč je to důležité {#why-this-matters}

Přístup společnosti PayPal k dodržování předpisů ukazuje zásadní nepochopení fungování podniků. Správné KYC by mělo proběhnout **před** integrací do produkčního prostředí, nikoli poté, co se zákazníci již snaží platit. Nedostatek proaktivní komunikace v případě vzniku problémů ukazuje na odtržení PayPalu od potřeb obchodníků.

Tento zpětný proces je příznakem širších organizačních problémů PayPalu: upřednostňují své interní procesy před zkušenostmi obchodníků a zákazníků, což vede k provozním katastrofám, které firmy od jejich platformy odvádějí.

## Jak to dělají všichni ostatní zpracovatelé plateb správně {#how-every-other-payment-processor-does-it-right}

Funkce pro výpis předplatného, kterou PayPal odmítá implementovat, je v tomto odvětví standardem již více než deset let. Zde je návod, jak tento základní požadavek řeší ostatní platební zpracovatelé:

### Proužek {#stripe}

Stripe má seznam předplatných od spuštění svého API. Jejich dokumentace jasně ukazuje, jak načíst všechna předplatná pro zákaznický nebo obchodní účet. Toto je považováno za základní funkcionalitu CRUD.

### Pádlo {#paddle}

Paddle poskytuje komplexní API pro správu předplatného, včetně výpisů, filtrování a stránkování. Chápou, že obchodníci potřebují vidět své opakující se toky příjmů.

### Coinbase Commerce {#coinbase-commerce}

Dokonce i zpracovatelé plateb za kryptoměny, jako je Coinbase Commerce, poskytují lepší správu předplatného než PayPal.

### Čtverec {#square}

API Square zahrnuje seznam předplatných jako základní funkci, nikoli jako dodatečnou.

### Průmyslový standard {#the-industry-standard}

Každý moderní platební procesor nabízí:

* Seznam všech předplatných
* Filtrování podle stavu, data, zákazníka
* Stránkování pro velké datové sady
* Upozornění webhookem na změny předplatného
* Komplexní dokumentace s funkčními příklady

### Co poskytují ostatní zpracovatelé v porovnání s PayPalem {#what-other-processors-provide-vs-paypal}

**Stripe - Seznam všech předplatných:**

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

**Stripe - Filtrovat podle zákazníka:**

```http
GET https://api.stripe.com/v1/subscriptions?customer=cus_Na6dX7aXxi11N4
```

**Stripe - Filtrovat podle stavu:**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal – Co skutečně získáte:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# You can ONLY get ONE subscription if you already know the ID
# There is NO endpoint to list all subscriptions
# There is NO way to search or filter
# You must track all subscription IDs yourself
```

**Dostupné koncové systémy PayPalu:**

* `POST /v1/billing/subscriptions` - Vytvořit předplatné
* `GET /v1/billing/subscriptions/{id}` - Získejte JEDNO předplatné (pokud znáte ID)
* `PATCH /v1/billing/subscriptions/{id}` - Aktualizovat předplatné
* `POST /v1/billing/subscriptions/{id}/cancel` - Zrušit předplatné
* `POST /v1/billing/subscriptions/{id}/suspend` - Pozastavit předplatné

**Co chybí v PayPalu:**

* ❌ Žádný `GET /v1/billing/subscriptions` (vypsat vše)
* ❌ Žádná funkce vyhledávání
* ❌ Žádné filtrování podle stavu, zákazníka, data
* ❌ Žádná podpora stránkování

PayPal je jediný významný platební procesor, který nutí vývojáře ručně sledovat ID předplatného ve svých vlastních databázích.

## Systematické zatajování ze strany PayPalu: Umlčení 6 milionů hlasů {#paypals-systematic-cover-up-silencing-6-million-voices}

V kroku, který dokonale vystihuje přístup PayPalu k řešení kritiky, nedávno odpojili celé své komunitní fórum, čímž efektivně umlčeli přes 6 milionů členů a smazali statisíce příspěvků dokumentujících jejich selhání.

### Velké vymazání {#the-great-erasure}

Původní komunita PayPal na adrese `paypal-community.com` hostila **6 003 558 členů** a obsahovala stovky tisíc příspěvků, hlášení o chybách, stížností a diskusí o selhání API PayPalu. To představovalo více než deset let zdokumentovaných důkazů o systematických problémech PayPalu.

Dne 30. června 2025 PayPal tiše odpojil celé fórum. Všechny odkazy `paypal-community.com` nyní vracejí chyby 404. Nejednalo se o migraci ani upgrade.

### Záchrana třetí strany {#the-third-party-rescue}

Naštěstí služba třetí strany na adrese [ppl.lithium.com](https://ppl.lithium.com/) zachovala část obsahu, což nám umožňuje přístup k diskusím, které se PayPal snažil skrýt. Toto uchování třetí stranou je však neúplné a mohlo by kdykoli zmizet.

Tento vzorec skrývání důkazů není pro PayPal ničím novým. Mají zdokumentovanou historii:

* Odstraňování hlášení o kritických chybách z veřejného pohledu
* Ukončování vývojářských nástrojů bez předchozího upozornění
* Změna API bez řádné dokumentace
* Umlčování diskusí komunity o jejich selháních

Zablokování fóra představuje dosud nejdrzejší pokus skrýt jejich systematické selhání před veřejnou kontrolou.

## Jedenáctiletá katastrofa s chybou v zachycování dat: 1 899 dolarů a stále přibývá {#the-11-year-capture-bug-disaster-1899-and-counting}

Zatímco PayPal se pilně věnoval organizování zpětné vazby a dával sliby, jejich základní systém pro zpracování plateb byl již více než 11 let zásadně narušen. Důkazy jsou zničující.

### Ztráta 1 899 USD z přeposílaného e-mailu {#forward-emails-1899-loss}

V našich produkčních systémech jsme objevili 108 plateb přes PayPal v celkové hodnotě **1 899 USD**, které byly ztraceny kvůli chybám při zachycování plateb PayPalem. Tyto platby vykazují konzistentní vzorec:

* Byly přijaty webové hooky `CHECKOUT.ORDER.APPROVED`
* Rozhraní API pro zachycení dat PayPal vrátilo chyby 404
* Objednávky se staly nepřístupnými prostřednictvím API PayPal

Není možné určit, zda byly zákazníkům účtovány poplatky, protože PayPal po 14 dnech zcela skryje ladicí protokoly a vymaže z řídicího panelu všechna data pro ID objednávek, která nebyla zaznamenána.

Toto představuje pouze jeden podnik. **Celkové ztráty tisíců obchodníků za více než 11 let pravděpodobně dosahují milionů dolarů.**

**Znovu to zopakujeme: celkové ztráty tisíců obchodníků za více než 11 let pravděpodobně dosáhnou milionů dolarů.**

Jediný důvod, proč jsme to objevili, je ten, že jsme neuvěřitelně puntičkáři a zaměřujeme se na data.

### Původní zpráva z roku 2013: Více než 11 let nedbalosti {#the-2013-original-report-11-years-of-negligence}

Nejstarší zdokumentovaná zpráva o tomto konkrétním problému se objevuje na [Přetečení zásobníku v listopadu 2013](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([archivováno](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)):

> „Při zachycení se stále zobrazuje chyba 404 s Rest API“

Chyba hlášená v roce 2013 je **identická** s chybou, která se vyskytla u služby Forward Email v roce 2024:

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

Reakce komunity v roce 2013 byla výmluvná:

> „Momentálně je hlášen problém s REST API. PayPal na něm pracuje.“

**Po více než 11 letech na tom stále „pracují“.**

### Přiznání z roku 2016: PayPal prolomil vlastní SDK {#the-2016-admission-paypal-breaks-their-own-sdk}

V roce 2016 zdokumentoval repozitář GitHub společnosti PayPal, který [masivní selhání zachycení](https://github.com/paypal/PayPal-PHP-SDK/issues/660) ovlivňoval jejich oficiální PHP SDK. Rozsah byl ohromující:

> „Od 20. září 2016 všechny pokusy o zachycení plateb přes PayPal selhávají s chybou ‚INVALID_RESOURCE_ID - Požadované ID zdroje nebylo nalezeno‘. Mezi 19. a 20. zářím se v integraci API nic nezměnilo. **100 % pokusů o zachycení plateb od 20. září vrátilo tuto chybu.**“

Jeden obchodník uvedl:

> „Za posledních 24 hodin se mi **přes 1400 neúspěšných pokusů o zachycení dat** nezdařilo, všechny s chybovou odpovědí INVALID_RESOURCE_ID.“

PayPal zpočátku obvinil obchodníka a odkázal ho na technickou podporu. Teprve po obrovském tlaku přiznal vinu:

> „Mám aktualizaci od našich vývojářů produktů. Všimli si v odesílaných záhlavích, že PayPal-Request-ID je odesíláno s 42 znaky, ale **zdá se, že nedávno došlo ke změně, která toto ID omezuje na pouhých 38 znaků.**“

Toto přiznání odhaluje systematickou nedbalost společnosti PayPal:

1. **Provedli nezdokumentované zásadní změny**
2. **Narušili svůj vlastní oficiální SDK**
3. **Nejdříve obvinili obchodníky**
4. **Chybu přiznali až pod tlakem**

I po „opravě“ problému obchodníci hlásili:

> „Aktualizoval jsem sadu SDK na verzi 1.7.4 a **problém stále přetrvává.**“

### Eskalace v roce 2024: Stále nefunkční {#the-2024-escalation-still-broken}

Nedávné zprávy ze zachovalé komunity PayPal ukazují, že se problém ve skutečnosti zhoršil. Soubor [Diskuse ze září 2024](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([archivováno](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) dokumentuje přesně stejné problémy:

> „Problém se začal objevovat teprve asi před 2 týdny a neovlivňuje všechny objednávky. **Mnohem častějším problémem se zdá být chyba 404 při zachycení objednávky.**“

Obchodník popisuje stejný vzorec, jaký se vyskytl při přeposlání e-mailu:

> „Po pokusu o zachycení objednávky PayPal vrátí chybu 404. Při načítání podrobností objednávky: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **Toto je bez jakékoli stopy po úspěšném zachycení z naší strany.**“

### Katastrofa spolehlivosti webhooku {#the-webhook-reliability-disaster}

Další [zachovaná komunitní diskuse](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) odhaluje, že systém webhooků PayPalu je zásadně nespolehlivý:

> „Teoreticky by to mělo mít dvě události (CHECKOUT.ORDER.APPROVED a PAYMENT.CAPTURE.COMPLETED) z události Webhook. Ve skutečnosti **tyto dvě události se zřídkakdy přijímají okamžitě, PAYMENT.CAPTURE.COMPLETED většinou nelze přijmout nebo by se přijala až za několik hodin.**“

Pro platby předplatného:

> „**Zpráva ‚PLATBA.PRODEJ.DOKONČENA‘ nebyla někdy přijata nebo dorazila až za několik hodin.**“

Obchodníkovy otázky odhalují hloubku problémů se spolehlivostí PayPalu:

1. **„Proč se to děje?“** - Systém webhooků PayPalu je zásadně nefunkční.
2. **„Pokud je stav objednávky 'DOKONČENO', mohu považovat peníze za přijaté?“** - Obchodníci nemohou důvěřovat odpovědím API PayPalu.
3. **„Proč 'Protokoly událostí->Události webhooku' nenajdou žádné protokoly?“** - Ani vlastní systém protokolování PayPalu nefunguje.

### Vzorec systematické nedbalosti {#the-pattern-of-systematic-negligence}

Důkazy pokrývají více než 11 let a ukazují jasný vzorec:

* **2013**: „PayPal na tom pracuje“
* **2016**: PayPal přiznává zásadní změnu a poskytuje opravu
* **2024**: Stále se vyskytují stejné chyby, které ovlivňují funkci Forward Email a bezpočet dalších

Nejedná se o chybu – **jedná se o systematickou nedbalost.** PayPal o těchto kritických selháních při zpracování plateb ví již více než deset let a důsledně:

1. **Obviňoval obchodníky z chyb PayPalu**
2. **Prováděl nezdokumentované zásadní změny**
3. **Poskytoval nedostatečné opravy, které nefungují**
4. **Ignoroval finanční dopad na podniky**
5. **Skrýval důkazy rušením komunitních fór**

### Nedokumentovaný požadavek {#the-undocumented-requirement}

Nikde v oficiální dokumentaci PayPalu se nezmiňuje, že obchodníci musí implementovat logiku opakování operací zachycení. Jejich dokumentace uvádí, že obchodníci by měli „zachycovat data ihned po schválení“, ale nezmiňuje se, že jejich API náhodně vrací chyby 404 vyžadující složité mechanismy opakování.

To nutí každého obchodníka:

* Implementace logiky exponenciálního odkladu opakovaných pokusů
* Řešení nekonzistentního doručování webhooků
* Vytváření komplexních systémů pro správu stavu
* Ruční monitorování neúspěšných zachycení

**Každý jiný platební procesor poskytuje spolehlivá API pro zachycení plateb, která fungují hned napoprvé.**

## Širší vzorec podvodů PayPalu {#paypals-broader-pattern-of-deception}

Katastrofa způsobená chybou v zachycování je jen jedním z příkladů systematického přístupu PayPalu k klamání zákazníků a skrývání jejich selhání.

### Akce Ministerstva finančních služeb státu New York {#the-new-york-department-of-financial-services-action}

V lednu 2025 vydalo newyorské ministerstvo finančních služeb příkaz [vynucovací opatření proti PayPalu](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf) za klamavé praktiky, což dokazuje, že vzorec podvodů PayPalu sahá daleko za hranice jejich API.

Toto regulační opatření ukazuje ochotu společnosti PayPal používat klamavé praktiky v celém svém podnikání, nejen ve svých vývojářských nástrojích.

### Soudní spor s Medem: Přepisování partnerských odkazů {#the-honey-lawsuit-rewriting-affiliate-links}

Akvizice společnosti Honey společností PayPal vedla k tomu, že [soudní spory, které tvrdí, že Honey přepisuje partnerské odkazy](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer) kradl provize od tvůrců obsahu a influencerů. To představuje další formu systematického podvodu, kdy PayPal profituje z přesměrování příjmů, které by měly jít jiným.

Vzor je jasný:

1. **Selhání API**: Skrývání nefunkčních funkcí, obviňování obchodníků
2. **Umlčování komunity**: Odstraňování důkazů o problémech
3. **Porušení předpisů**: Zapojování se do klamavých praktik
4. **Krádež affiliate partnerů**: Krádež provizí prostřednictvím technických manipulací

### Cena za nedbalost společnosti PayPal {#the-cost-of-paypals-negligence}

Ztráta společnosti Forward Email ve výši 1 899 dolarů představuje jen špičku ledovce. Zvažte širší dopad:

* **Jednotliví obchodníci**: Tisíce lidí přicházejí o stovky až tisíce dolarů
* **Podnikoví zákazníci**: Potenciálně miliony ušlých příjmů
* **Čas vývojářů**: Nespočet hodin budování řešení pro nefunkční API PayPal
* **Důvěra zákazníků**: Firmy ztrácejí zákazníky kvůli selhání plateb PayPal

Pokud jedna malá e-mailová služba přišla o téměř 2 000 dolarů a tento problém trvá již více než 11 let a postihuje tisíce obchodníků, celková finanční škoda pravděpodobně dosahuje **stovek milionů dolarů**.

### Lež o dokumentaci {#the-documentation-lie}

Oficiální dokumentace PayPalu soustavně nezmiňuje kritická omezení a chyby, se kterými se obchodníci setkají. Například:

* **Capture API**: Nezmiňuje se, že chyby 404 jsou běžné a vyžadují logiku opakování.
* **Spolehlivost webhooků**: Nezmiňuje se, že webhooky jsou často zpožděny o hodiny.
* **Výpis předplatného**: Dokumentace naznačuje, že výpis je možný, i když neexistuje žádný koncový bod.
* **Časové limity relace**: Nezmiňuje se agresivní 60sekundové časové limity.

Toto systematické vynechávání důležitých informací nutí obchodníky objevovat omezení PayPalu metodou pokusů a omylů v produkčních systémech, což často vede k finančním ztrátám.

## Co to znamená pro vývojáře {#what-this-means-for-developers}

Systematické selhání PayPalu v řešení základních potřeb vývojářů při shromažďování rozsáhlé zpětné vazby ukazuje na zásadní organizační problém. Shromažďování zpětné vazby považují za náhradu za skutečné řešení problémů.

Vzor je jasný:

1. Vývojáři hlásí problémy
2. PayPal pořádá setkání s vedoucími pracovníky pro získávání zpětné vazby
3. Poskytuje se rozsáhlá zpětná vazba
4. Týmy uznávají nedostatky a slibují, že je budou „sledovat a řešit“
5. Nic se neimplementuje
6. Vedoucí pracovníci odcházejí do lepších společností
7. Nové týmy požadují stejnou zpětnou vazbu
8. Cyklus se opakuje

Mezitím jsou vývojáři nuceni vytvářet alternativní řešení, narušovat bezpečnost a zabývat se nefunkčními uživatelskými rozhraními, jen aby mohli přijímat platby.

Pokud vytváříte platební systém, poučte se z našich zkušeností: vytvořte si [trojitý přístup](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal) s více procesory, ale neočekávejte, že PayPal poskytne základní funkce, které potřebujete. Plánujte si vytváření alternativních řešení od prvního dne.

> Tento příspěvek dokumentuje naše 11leté zkušenosti s API PayPal na Forward Email. Všechny příklady kódu a odkazy pocházejí z našich skutečných produkčních systémů. Platby přes PayPal i přes tyto problémy nadále podporujeme, protože někteří zákazníci nemají jinou možnost.

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API disaster illustration" class="rounded-lg" />