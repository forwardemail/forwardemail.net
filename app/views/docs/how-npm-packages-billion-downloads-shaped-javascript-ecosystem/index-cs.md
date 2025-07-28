# Desetiletí dopadu: Jak naše npm balíčky dosáhly 1 miliardy stažení a formovaly JavaScript {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="" class="rounded-lg" />

__CHRÁNĚNÁ_URL_30__ Obsah {__CHRÁNĚNÁ_URL_31__

* [Předmluva](#foreword)
* [Průkopníci, kteří nám důvěřují: Isaac Z. Schlueter a přeposlání e-mailu](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [Od tvorby npm po vedení Node.js](#from-npms-creation-to-nodejs-leadership)
* [Architekt za kódem: Cesta Nicka Baugha](#the-architect-behind-the-code-nick-baughs-journey)
  * [Expresní technický výbor a hlavní příspěvky](#express-technical-committee-and-core-contributions)
  * [Rámcové příspěvky Koa](#koa-framework-contributions)
  * [Od individuálního přispěvatele po vedoucího organizace](#from-individual-contributor-to-organization-leader)
* [Naše organizace GitHub: Ekosystémy inovací](#our-github-organizations-ecosystems-of-innovation)
  * [Kabina: Strukturovaná těžba dřeva pro moderní aplikace](#cabin-structured-logging-for-modern-applications)
  * [Skener spamu: Boj proti zneužívání e-mailů](#spam-scanner-fighting-email-abuse)
  * [Bree: Moderní plánování práce s pracovními vlákny](#bree-modern-job-scheduling-with-worker-threads)
  * [Forward Email: Open Source Email Infrastructure](#forward-email-open-source-email-infrastructure)
  * [Kluk: Základní nástroje a nástroje Koa](#lad-essential-koa-utilities-and-tools)
  * [Uptime: Open Source Uptime Monitoring](#upptime-open-source-uptime-monitoring)
* [Naše příspěvky do ekosystému dopředných e-mailů](#our-contributions-to-the-forward-email-ecosystem)
  * [Od balíčků po výrobu](#from-packages-to-production)
  * [Smyčka zpětné vazby](#the-feedback-loop)
* [Základní principy Forward Email: Základ pro dokonalost](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Vždy přívětivé pro vývojáře, zaměřené na bezpečnost a transparentní](#always-developer-friendly-security-focused-and-transparent)
  * [Dodržování osvědčených zásad vývoje softwaru](#adherence-to-time-tested-software-development-principles)
  * [Cílení na Scrappy, Bootstrapped Developer](#targeting-the-scrappy-bootstrapped-developer)
  * [Principy v praxi: The Forward Email Codebase](#principles-in-practice-the-forward-email-codebase)
  * [Privacy by Design](#privacy-by-design)
  * [Udržitelný otevřený zdroj](#sustainable-open-source)
* [Čísla nelžou: Naše ohromující statistiky ke stažení npm](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [Pohled na náš dopad z ptačí perspektivy](#a-birds-eye-view-of-our-impact)
  * [Denní dopad v měřítku](#daily-impact-at-scale)
  * [Mimo hrubá čísla](#beyond-the-raw-numbers)
* [Podpora ekosystému: Naše sponzorství s otevřeným zdrojem](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: Průkopník e-mailové infrastruktury](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: Utility Package Mastermind](#sindre-sorhus-utility-package-mastermind)
* [Odhalování bezpečnostních zranitelností v ekosystému JavaScriptu](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [Záchrana směrovače Koa](#the-koa-router-rescue)
  * [Řešení zranitelností ReDoS](#addressing-redos-vulnerabilities)
  * [Obhajoba Node.js a Chromium Security](#advocating-for-nodejs-and-chromium-security)
  * [Zabezpečení infrastruktury npm](#securing-npm-infrastructure)
* [Naše příspěvky do ekosystému dopředných e-mailů](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Vylepšení základní funkce Nodemaileru](#enhancing-nodemailers-core-functionality)
  * [Pokročilé ověřování e-mailů pomocí Mailauth](#advancing-email-authentication-with-mailauth)
  * [Klíčová vylepšení doby provozuschopnosti](#key-upptime-enhancements)
* [Lepidlo, které to drží pohromadě: Vlastní kód v měřítku](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [Masivní rozvojové úsilí](#a-massive-development-effort)
  * [Integrace základních závislostí](#core-dependencies-integration)
  * [Infrastruktura DNS s Tangerine a mx-connect](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Dopad na podnik: Od otevřeného zdroje k řešení kritickým pro misi](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Případové studie v kritické e-mailové infrastruktuře](#case-studies-in-mission-critical-email-infrastructure)
* [Dekáda otevřeného zdroje: výhled do budoucna](#a-decade-of-open-source-looking-forward)

__CHRÁNĚNÁ_URL_32__ Předmluva {__CHRÁNĚNÁ_URL_33__

Ve světě [JavaScript](https://en.wikipedia.org/wiki/JavaScript) a [Node.js](https://en.wikipedia.org/wiki/Node.js) jsou některé balíčky nezbytné – stahují se milionykrát denně a pohánějí aplikace po celém světě. Za těmito nástroji stojí vývojáři zaměření na kvalitu open source. Dnes ukážeme, jak náš tým pomáhá vytvářet a udržovat npm balíčky, které se staly klíčovou součástí ekosystému JavaScriptu.

## Průkopníci, kteří nám důvěřují: Isaac Z. Schlueter a přeposílaný e-mail {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

Jsme hrdí na to, že máme uživatele [Isaac Z. Schlueter](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)). Isaac vytvořil [npm](https://en.wikipedia.org/wiki/Npm_\(software\)) a pomohl vybudovat [Node.js](https://en.wikipedia.org/wiki/Node.js). Jeho důvěra v Forward Email ukazuje naše zaměření na kvalitu a bezpečnost. Isaac používá Forward Email pro několik domén, včetně izs.me.

Isaacův vliv na JavaScript je obrovský. V roce 2009 byl mezi prvními, kdo si všiml potenciálu Node.js, a spolupracoval s [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl), který platformu vytvořil. Jak Isaac řekl v [rozhovor pro časopis Increment](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/): „Uprostřed této velmi malé komunity lidí, kteří se snažili přijít na to, jak realizovat serverový JS, přišel Ryan Dahl s Node, což byl zjevně ten správný přístup. Zapojil jsem se do toho a zhruba v polovině roku 2009 jsem se do toho velmi zapojil.“

> \[!NOTE]
> For those interested in the history of Node.js, there are excellent documentaries available that chronicle its development, including [The Story of Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) and [10 Things I Regret About Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). Ryan Dahl's [personal website](https://tinyclouds.org/) also contains valuable insights into his work.

### Od založení npm k vedení Node.js {#from-npms-creation-to-nodejs-leadership}

Isaac vytvořil npm v září 2009 a první použitelná verze byla vydána začátkem roku 2010. Tento správce balíčků vyplnil klíčovou potřebu v Node.js a umožnil vývojářům snadno sdílet a znovu používat kód. Podle [Wikipedická stránka Node.js](https://en.wikipedia.org/wiki/Node.js): „V lednu 2010 byl pro prostředí Node.js představen správce balíčků s názvem npm. Správce balíčků umožňuje programátorům publikovat a sdílet balíčky Node.js spolu s doprovodným zdrojovým kódem a je navržen tak, aby zjednodušil instalaci, aktualizaci a odinstalaci balíčků.“

Když Ryan Dahl v lednu 2012 odstoupil z Node.js, Isaac převzal vedení projektu. Jak je uvedeno na [jeho shrnutí](https://izs.me/resume), „vedl vývoj několika základních API Node.js, včetně modulového systému CommonJS, API souborových systémů a streamů“ a „po dobu 2 let působil jako BDFL (benevolentní diktátor na celý život) projektu, čímž zajišťoval neustále rostoucí kvalitu a spolehlivý proces sestavení pro verze Node.js v0.6 až v0.10.“

Isaac provedl Node.js klíčovým obdobím růstu a stanovil standardy, které platformu formují dodnes. Později v roce 2014 založil společnost npm, Inc. na podporu registru npm, který předtím provozoval sám.

Děkujeme Isaacovi za jeho obrovské příspěvky k JavaScriptu a nadále používáme mnoho balíčků, které vytvořil. Jeho práce změnila způsob, jakým vytváříme software a jak miliony vývojářů sdílejí kód po celém světě.

## Architekt kódu: Cesta Nicka Baugha {#the-architect-behind-the-code-nick-baughs-journey}

Srdcem našeho úspěchu open source je Nick Baugh, zakladatel a vlastník Forward Email. Jeho práce v JavaScriptu trvá téměř 20 let a ovlivnila způsob, jakým nespočet vývojářů vytváří aplikace. Jeho cesta open source ukazuje jak technické dovednosti, tak vedení komunity.

### Příspěvky technického výboru Express a klíčových prvků {#express-technical-committee-and-core-contributions}

Nickovy odborné znalosti webových frameworků mu vynesly místo na [Expresní technický výbor](https://expressjs.com/en/resources/community.html), kde pomáhal s jedním z nejpoužívanějších Node.js frameworků. Nick je nyní uveden jako neaktivní člen na [Expresní komunitní stránka](https://expressjs.com/en/resources/community.html).

> \[!IMPORTANT]
> Express was originally created by TJ Holowaychuk, a prolific open source contributor who has shaped much of the Node.js ecosystem. We're grateful for TJ's foundational work and respect his [decision to take a break](https://news.ycombinator.com/item?id=37687017) from his extensive open source contributions.

Jako člen [Expresní technický výbor](https://expressjs.com/en/resources/community.html) projevoval Nick velkou pozornost k detailům v otázkách, jako je objasňování dokumentace `req.originalUrl` a opravování problémů se zpracováním vícedílných formulářů.

### Příspěvky k rámci Koa {#koa-framework-contributions}

Nickova práce s [Koa rámec](https://github.com/koajs/koa) – moderní a lehčí alternativou k Expressu, kterou také vytvořil TJ Holowaychuk – dále ukazuje jeho odhodlání vytvářet lepší nástroje pro webový vývoj. Jeho příspěvky do Koa zahrnují jak řešení problémů, tak i kódu prostřednictvím pull requestů, řešení ošetření chyb, správu typů obsahu a vylepšení dokumentace.

Jeho práce napříč Express i Koa mu poskytuje jedinečný pohled na vývoj webu Node.js a pomáhá našemu týmu vytvářet balíčky, které dobře fungují s více rámcovými ekosystémy.

### Od individuálního přispěvatele k vedoucímu organizace {#from-individual-contributor-to-organization-leader}

Co začalo jako pomoc stávajícím projektům, se rozrostlo ve vytváření a údržbu celých ekosystémů balíčků. Nick založil několik organizací na GitHubu – včetně [Chata](https://github.com/cabinjs), [Skener spamu](https://github.com/spamscanner), [Přeposlat e-mail](https://github.com/forwardemail), [Chlapec](https://github.com/ladjs) a [Bree](https://github.com/breejs) – z nichž každá řeší specifické potřeby JavaScriptové komunity.

Tento posun od přispěvatele k vedoucímu ukazuje Nickovu vizi dobře navrženého softwaru, který řeší skutečné problémy. Uspořádáním souvisejících balíčků pod zaměřenými organizacemi GitHub vybudoval ekosystémy nástrojů, které spolupracují a přitom zůstávají modulární a flexibilní pro širší komunitu vývojářů.

## Naše organizace na GitHubu: Ekosystémy inovací {#our-github-organizations-ecosystems-of-innovation}

Svou práci s otevřeným zdrojovým kódem organizujeme kolem zaměřených organizací GitHub, z nichž každá řeší specifické potřeby v JavaScriptu. Tato struktura vytváří soudržné rodiny balíčků, které spolu dobře spolupracují a přitom zůstávají modulární.

### Cabin: Strukturované protokolování pro moderní aplikace {#cabin-structured-logging-for-modern-applications}

Balíček [Organizace kabiny](https://github.com/cabinjs) je naše verze jednoduchého a výkonného protokolování aplikací. Hlavní balíček [`cabin`](https://github.com/cabinjs/cabin) má téměř 900 hvězdiček na GitHubu a přes 100 000 stažení týdně\[^1]. Cabin poskytuje strukturované protokolování, které funguje s oblíbenými službami, jako jsou Sentry, LogDNA a Papertrail.

Cabin je výjimečný díky promyšlenému systému API a pluginů. Podpůrné balíčky jako [`axe`](https://github.com/cabinjs/axe) pro middleware Express a [`parse-request`](https://github.com/cabinjs/parse-request) pro parsování HTTP požadavků ukazují náš závazek poskytovat kompletní řešení, nikoli izolované nástroje.

Zvláštní zmínku si zaslouží balíček [`bson-objectid`](https://github.com/cabinjs/bson-objectid) s více než 1,7 miliony stažení za pouhé dva měsíce\[^2]. Tato odlehčená implementace MongoDB ObjectID se stala volbou pro vývojáře, kteří potřebují ID bez plných závislostí MongoDB.

### Kontrola spamu: Boj proti zneužívání e-mailů {#spam-scanner-fighting-email-abuse}

Balíček [Organizace Spam Scanneru](https://github.com/spamscanner) ukazuje náš závazek řešit skutečné problémy. Hlavní balíček [`spamscanner`](https://github.com/spamscanner/spamscanner) poskytuje pokročilou detekci spamu v e-mailech, ale úžasného přijetí se dočkal balíček [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe).

S více než 1,2 miliony stažení za dva měsíce\[^3] opravuje balíček `url-regex-safe` kritické bezpečnostní problémy v jiných regulárních výrazech pro detekci URL. Tento balíček ukazuje náš přístup k open source: nalezení běžného problému (v tomto případě zranitelností [RedoS](https://en.wikipedia.org/wiki/ReDoS) v ověřování URL), vytvoření solidního řešení a jeho pečlivá údržba.

### Bree: Moderní plánování úloh s pracovními vlákny {#bree-modern-job-scheduling-with-worker-threads}

Balíček [Organizace Bree](https://github.com/breejs) je naší odpovědí na běžný problém Node.js: spolehlivé plánování úloh. Hlavní balíček [`bree`](https://github.com/breejs/bree) s více než 3 100 hvězdičkami na GitHubu poskytuje moderní plánovač úloh využívající pracovní vlákna Node.js pro lepší výkon a spolehlivost.

> \[!NOTE]
> Bree was created after we helped maintain [Agenda](https://github.com/agenda/agenda), applying lessons learned to build a better job scheduler. Our Agenda contributions helped us find ways to improve job scheduling.

Čím se Bree liší od jiných plánovačů, jako je Agenda:

* **Žádné externí závislosti**: Na rozdíl od Agenda, která vyžaduje MongoDB, Bree nevyžaduje Redis ani MongoDB ke správě stavu úloh.
* **Pracovní vlákna**: Bree používá pracovní vlákna Node.js pro sandboxové procesy, což poskytuje lepší izolaci a výkon.
* **Jednoduché API**: Bree nabízí detailní kontrolu s jednoduchostí, což usnadňuje implementaci složitých plánovacích potřeb.
* **Vestavěná podpora**: Ve výchozím nastavení jsou zahrnuty funkce jako plynulé opětovné načítání, cron úlohy, data a uživatelsky přívětivé časy.

Bree je klíčovou součástí [forwardemail.net](https://github.com/forwardemail/forwardemail.net), která se stará o kritické úlohy na pozadí, jako je zpracování e-mailů, čištění a plánovaná údržba. Použití Bree v aplikaci Forward Email ukazuje náš závazek používat v produkčním prostředí vlastní nástroje a zajistit, aby splňovaly vysoké standardy spolehlivosti.

Také používáme a oceňujeme další skvělé balíčky pracovních vláken, jako je [bazén](https://github.com/piscinajs/piscina), a HTTP klienty, jako je [jedenáct](https://github.com/nodejs/undici). Piscina, stejně jako Bree, používá pracovní vlákna Node.js pro efektivní zpracování úloh. Děkujeme [Matthew Hill](https://github.com/mcollina), který spravuje undici i piscinu, za jeho významný přínos pro Node.js. Matteo působí v technickém řídícím výboru Node.js a výrazně vylepšil možnosti HTTP klientů v Node.js.

### Přeposílání e-mailů: Open Source e-mailová infrastruktura {#forward-email-open-source-email-infrastructure}

Naším nejambicióznějším projektem je [Přeposlat e-mail](https://github.com/forwardemail), open source e-mailová služba, která poskytuje přeposílání e-mailů, jejich ukládání a služby API. Hlavní repozitář má na GitHubu přes 1100 hvězdiček\[^4], což ukazuje, že komunita si této alternativy k proprietárním e-mailovým službám váží.

Balíček [`preview-email`](https://github.com/forwardemail/preview-email) od této organizace, s více než 2,5 miliony stažení za dva měsíce\[^5], se stal nezbytným nástrojem pro vývojáře pracující s šablonami e-mailů. Tím, že poskytuje jednoduchý způsob náhledu e-mailů během vývoje, řeší běžný problém při vytváření aplikací s podporou e-mailu.

### Chlapče: Základní nástroje a utility Koa {#lad-essential-koa-utilities-and-tools}

Balíček [Lad organizace](https://github.com/ladjs) poskytuje kolekci základních utilit a nástrojů primárně zaměřených na vylepšení ekosystému frameworku Koa. Tyto balíčky řeší běžné problémy ve webovém vývoji a jsou navrženy tak, aby bezproblémově fungovaly společně a zároveň zůstaly užitečné i samostatně.

#### koa-better-error-handler: Vylepšené zpracování chyb pro Koa {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) nabízí lepší řešení pro ošetřování chyb v aplikacích Koa. S více než 50 hvězdičkami na GitHubu tento balíček umožňuje `ctx.throw` vytvářet uživatelsky přívětivé chybové zprávy a zároveň řeší několik omezení vestavěného obslužného programu chyb Koa:

* Detekuje a správně zpracovává chyby DNS Node.js, chyby Mongoose a chyby Redis
* Používá [Výložník](https://github.com/hapijs/boom) pro vytváření konzistentních a dobře formátovaných chybových odpovědí
* Zachovává hlavičky (na rozdíl od vestavěného obslužného programu Koa)
* Zachovává příslušné stavové kódy namísto výchozí hodnoty 500
* Podporuje flash zprávy a zachování relace
* Poskytuje seznamy chyb HTML pro chyby validace
* Podporuje více typů odpovědí (HTML, JSON a prostý text)

Tento balíček je obzvláště cenný při použití společně s [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) pro komplexní správu chyb v aplikacích Koa.

#### pas: Ověření pro Lada {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport) rozšiřuje oblíbený middleware pro ověřování Passport.js o specifická vylepšení pro moderní webové aplikace. Tento balíček podporuje několik strategií ověřování ihned po instalaci:

* Lokální ověřování pomocí e-mailu
* Přihlášení přes Apple
* Ověřování přes GitHub
* Ověřování přes Google
* Ověřování jednorázovým heslem (OTP)

Balíček je vysoce přizpůsobitelný a umožňuje vývojářům upravit názvy polí a fráze tak, aby odpovídaly požadavkům jejich aplikace. Je navržen tak, aby se hladce integroval s Mongoose pro správu uživatelů, takže je ideálním řešením pro aplikace založené na Koa, které vyžadují robustní ověřování.

#### graceful: Elegantní vypnutí aplikace {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful) řeší kritický problém elegantního ukončení aplikací Node.js. S více než 70 hvězdičkami na GitHubu tento balíček zajišťuje, že vaše aplikace může být čistě ukončena bez ztráty dat nebo zablokování připojení. Mezi klíčové funkce patří:

* Podpora pro elegantní zavírání HTTP serverů (Express/Koa/Fastify)
* Bezproblémové ukončení databázových připojení (MongoDB/Mongoose)
* Správné zavírání Redis klientů
* Zvládání plánovačů úloh Bree
* Podpora vlastních obslužných rutin pro vypnutí
* Konfigurovatelné nastavení časového limitu
* Integrace s protokolovacími systémy

Tento balíček je nezbytný pro produkční aplikace, kde by neočekávané vypnutí mohlo vést ke ztrátě nebo poškození dat. Implementací správných postupů vypnutí pomáhá `@ladjs/graceful` zajistit spolehlivost a stabilitu vaší aplikace.

### Dostupnost: Monitorování dostupnosti open source {#upptime-open-source-uptime-monitoring}

[Organizace provozuschopnosti](https://github.com/upptime) představuje náš závazek k transparentnímu monitorování open source. Hlavní repozitář [`upptime`](https://github.com/upptime/upptime) má přes 13 000 hvězdiček na GitHubu, což z něj činí jeden z nejoblíbenějších projektů, do kterých přispíváme. Upptime poskytuje monitor dostupnosti a stavovou stránku s využitím GitHubu, která funguje zcela bez serveru.

Pro naši vlastní stránku se stavem na adrese <https://status.forwardemail.net> používáme Upptime, zdrojový kód je k dispozici na adrese <https://github.com/forwardemail/status.forwardemail.net>.

Co dělá Upptime výjimečným, je jeho architektura:

* **100% open source**: Každá komponenta je plně open source a přizpůsobitelná.
* **Poháněno GitHubem**: Využívá akce, problémy a stránky GitHubu pro bezserverové monitorovací řešení.
* **Není vyžadován server**: Na rozdíl od tradičních monitorovacích nástrojů Upptime nevyžaduje provozování ani údržbu serveru.
* **Automatická stavová stránka**: Generuje krásnou stavovou stránku, kterou lze hostovat na stránkách GitHubu.
* **Výkonná oznámení**: Integruje se s různými notifikačními kanály, včetně e-mailu, SMS a Slacku.

Abychom vylepšili uživatelský komfort, integrovali jsme do kódové základny forwardemail.net [@octokit/core](https://github.com/octokit/core.js/), abychom mohli zobrazovat aktualizace stavu a incidenty v reálném čase přímo na našich webových stránkách. Tato integrace poskytuje našim uživatelům jasnou transparentnost v případě jakýchkoli problémů v celém našem stacku (web, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree atd.) s okamžitými upozorněními, změnami ikon odznaků, barvami varování a dalšími funkcemi.

Knihovna @octokit/core nám umožňuje získávat data v reálném čase z našeho úložiště GitHub Upptime, zpracovávat je a zobrazovat uživatelsky přívětivým způsobem. Když dojde k výpadku jakékoli služby nebo snížení výkonu, uživatelé jsou okamžitě informováni prostřednictvím vizuálních indikátorů, aniž by museli opustit hlavní aplikaci. Tato bezproblémová integrace zajišťuje, že naši uživatelé mají vždy aktuální informace o stavu našeho systému, což zvyšuje transparentnost a důvěru.

Upptime přijaly stovky organizací, které hledají transparentní a spolehlivý způsob monitorování svých služeb a sdělování stavu uživatelům. Úspěch projektu ukazuje sílu budování nástrojů, které využívají stávající infrastrukturu (v tomto případě GitHub) k řešení běžných problémů novými způsoby.

## Naše příspěvky k ekosystému přeposílaných e-mailů {#our-contributions-to-the-forward-email-ecosystem}

Zatímco naše balíčky s otevřeným zdrojovým kódem používají vývojáři po celém světě, tvoří také základ naší vlastní služby Forward Email. Tato dvojí role – jakožto tvůrců i uživatelů těchto nástrojů – nám poskytuje jedinečný pohled na jejich aplikaci v reálném světě a je hnacím motorem neustálého zlepšování.

### Z balíčků do produkce {#from-packages-to-production}

Cesta od jednotlivých balení k soudržnému výrobnímu systému zahrnuje pečlivou integraci a rozšíření. Forward Email, tento proces zahrnuje:

* **Vlastní rozšíření**: Vytváření rozšíření specifických pro Forward Email pro naše balíčky s otevřeným zdrojovým kódem, která splňují naše jedinečné požadavky.
* **Integrační vzory**: Vývoj vzorů pro interakci těchto balíčků v produkčním prostředí.
* **Optimalizace výkonu**: Identifikace a řešení úzkých míst ve výkonu, která se objevují pouze ve velkém měřítku.
* **Zvýšení zabezpečení**: Přidání dalších bezpečnostních vrstev specifických pro zpracování e-mailů a ochranu uživatelských dat.

Tato práce představuje tisíce hodin vývoje nad rámec samotných základních balíčků, jehož výsledkem je robustní a bezpečná e-mailová služba, která využívá to nejlepší z našich příspěvků s otevřeným zdrojovým kódem.

### Zpětná vazba {#the-feedback-loop}

Snad nejcennějším aspektem používání našich vlastních balíčků ve výrobě je smyčka zpětné vazby, kterou vytváří. Když narazíme na omezení nebo okrajové případy v Forward Email, neopravujeme je pouze lokálně – vylepšujeme základní balíčky, což přináší užitek jak naší službě, tak širší komunitě.

Tento přístup vedl k řadě vylepšení:

* **Breeho elegantní vypnutí**: Potřeba nasazení s nulovými prostoji v aplikaci Forward Email vedla k vylepšeným možnostem elegantního vypnutí v Bree.
* **Rozpoznávání vzorů skeneru spamu**: Detekční algoritmy skeneru spamu byly ovlivněny vzory spamu z reálného světa, se kterými se setkáváme v aplikaci Forward Email.
* **Optimalizace výkonu v aplikaci Cabin**: Velkoobjemové protokolování v produkčním prostředí odhalilo optimalizační příležitosti v aplikaci Cabin, které prospívají všem uživatelům.

Udržováním tohoto ctnostného cyklu mezi naší prací s otevřeným zdrojovým kódem a produkčními službami zajišťujeme, že naše balíčky zůstanou praktickými, bitvami vyzkoušenými řešeními spíše než teoretickými implementacemi.

## Základní principy přeposílání e-mailů: Základ pro excelenci {#forward-emails-core-principles-a-foundation-for-excellence}

Služba Forward Email je navržena v souladu se sadou základních principů, kterými se řídí veškerá naše vývojářská rozhodnutí. Tyto principy, podrobně popsané na našem [webové stránky](/blog/docs/best-quantum-safe-encrypted-email-service#principles), zajišťují, že naše služba zůstává uživatelsky přívětivá, bezpečná a zaměřená na soukromí uživatelů.

### Vždy přátelské k vývojářům, zaměřené na zabezpečení a transparentní {#always-developer-friendly-security-focused-and-transparent}

Naší první a nejdůležitější zásadou je vytvářet software, který je přátelský pro vývojáře a zároveň zachovává nejvyšší standardy zabezpečení a soukromí. Věříme, že technická dokonalost by nikdy neměla být na úkor použitelnosti a že transparentnost buduje důvěru v naší komunitě.

Tento princip se projevuje v naší podrobné dokumentaci, jasných chybových hlášeních a otevřené komunikaci o úspěších i výzvách. Tím, že celou naši kódovou základnu vytvoříme jako open source, vyzýváme ke kontrole a spolupráci, čímž posílíme jak náš software, tak širší ekosystém.

### Dodržování osvědčených principů vývoje softwaru {#adherence-to-time-tested-software-development-principles}

Řídíme se několika zavedenými principy vývoje softwaru, které prokázaly svou hodnotu po desetiletí:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: Oddělování odpovědností pomocí vzoru Model-View-Controller
* **[Unixová filozofie](https://en.wikipedia.org/wiki/Unix_philosophy)**: Vytváření modulárních komponent, které dobře dělají jednu věc
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Zachování jednoduchosti a přímočarosti
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Neopakujte se, podpora opětovného použití kódu
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: Nebudete to potřebovat, vyhněte se předčasné optimalizaci
* **[Dvanáctý faktor](https://12factor.net/)**: Dodržování osvědčených postupů pro vytváření moderních, škálovatelných aplikací
* **[Occamova břitva](https://en.wikipedia.org/wiki/Occam%27s_razor)**: Výběr nejjednoduššího řešení, které splňuje požadavky
* **[Interní testování](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Rozsáhlé používání vlastních produktů

Tyto principy nejsou jen teoretické koncepty – jsou součástí našich každodenních vývojových postupů. Například naše dodržování filozofie Unixu je evidentní v tom, jak jsme strukturovali naše balíčky npm: malé, zaměřené moduly, které lze skládat dohromady a řešit složité problémy.

### Zaměřujeme se na nedbalé vývojáře pracující na bootstrapu {#targeting-the-scrappy-bootstrapped-developer}

Zaměřujeme se konkrétně na nezkušené, bootstrapované a [ramen-výnosný](https://www.paulgraham.com/ramenprofitable.html) vývojáře. Toto zaměření formuje vše od našeho cenového modelu až po naše technická rozhodnutí. Chápeme výzvy spojené s tvorbou produktů s omezenými zdroji, protože jsme si tím sami prošli.

Tento princip je zvláště důležitý v tom, jak přistupujeme k open source. Vytváříme a udržujeme balíčky, které řeší skutečné problémy pro vývojáře bez podnikových rozpočtů, čímž zpřístupňujeme výkonné nástroje všem bez ohledu na jejich zdroje.

### Principy v praxi: Kódová základna pro přeposílání e-mailů {#principles-in-practice-the-forward-email-codebase}

Tyto principy jsou jasně viditelné v kódové základně Forward Email. Náš soubor package.json odhaluje promyšlený výběr závislostí, z nichž každá odpovídá našim základním hodnotám:

* Bezpečnostní balíčky, jako například `mailauth` pro ověřování e-mailů
* Nástroje pro vývojáře, jako například `preview-email` pro snadnější ladění
* Modulární komponenty, jako například různé utility `p-*` od Sindre Sorhus

Důsledným dodržováním těchto zásad v průběhu času jsme vytvořili službu, které mohou vývojáři důvěřovat se svou e-mailovou infrastrukturou – je bezpečná, spolehlivá a v souladu s hodnotami komunity s otevřeným zdrojovým kódem.

### Ochrana soukromí již v návrhu {#privacy-by-design}

Ochrana osobních údajů není dodatečným nápadem nebo marketingovou funkcí pro přeposílání e-mailů – je to základní princip návrhu, který informuje o každém aspektu naší služby a kódu:

* **Šifrování s nulovým přístupem**: Implementovali jsme systémy, které nám technicky znemožňují číst e-maily uživatelů.
* **Minimální sběr dat**: Shromažďujeme pouze data nezbytná k poskytování našich služeb, nic víc.
* **Transparentní zásady**: Naše zásady ochrany osobních údajů jsou napsány jasným a srozumitelným jazykem bez právnického žargonu.
* **Ověření otevřeného zdrojového kódu**: Naše kódová základna s otevřeným zdrojovým kódem umožňuje bezpečnostním výzkumníkům ověřit naše tvrzení o ochraně soukromí.

Tento závazek se vztahuje i na naše balíčky s otevřeným zdrojovým kódem, které jsou navrženy s osvědčenými postupy zabezpečení a ochrany soukromí zabudovanými od základů.

### Udržitelný open source {#sustainable-open-source}

Věříme, že software s otevřeným zdrojovým kódem potřebuje udržitelné modely, aby mohl dlouhodobě prosperovat. Náš přístup zahrnuje:

* **Komerční podpora**: Nabízíme prémiovou podporu a služby týkající se našich open source nástrojů.
* **Vyvážené licencování**: Používáme licencí, které chrání jak uživatelské svobody, tak udržitelnost projektu.
* **Zapojení komunity**: Aktivní spolupráce s přispěvateli s cílem vybudovat podpůrnou komunitu.
* **Transparentní plány**: Sdílíme naše vývojové plány, abychom uživatelům umožnili odpovídajícím způsobem plánovat.

Tím, že se zaměříme na udržitelnost, zajistíme, že naše příspěvky s otevřeným zdrojovým kódem mohou v průběhu času nadále růst a zlepšovat se, než aby upadly do zanedbání.

## Čísla nelžou: Naše ohromující statistiky stahování npm {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

Když mluvíme o dopadu softwaru s otevřeným zdrojovým kódem, statistiky stahování poskytují hmatatelné měřítko přijetí a důvěry. Mnoho balíčků, které pomáháme udržovat, dosáhlo rozsahu, jakého kdy dosáhlo jen málo projektů s otevřeným zdrojovým kódem, s celkovým počtem stažení v miliardách.

![Nejlepší balíčky npm podle počtu stažení](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> While we're proud to help maintain several highly-downloaded packages in the JavaScript ecosystem, we want to acknowledge that many of these packages were originally created by other talented developers. Packages like superagent and supertest were originally created by TJ Holowaychuk, whose prolific contributions to open source have been instrumental in shaping the Node.js ecosystem.

### Pohled na náš dopad z ptačí perspektivy {#a-birds-eye-view-of-our-impact}

Pouze za dvouměsíční období od února do března 2025 nejlepší balíčky, do kterých přispíváme a které pomáhají udržovat zaznamenané ohromující počty stažení:

* **[superagent](https://www.npmjs.com/package/superagent)**: 84 575 829 stažení\[^7] (původně vytvořil TJ Holowaychuk)
* **[super test](https://www.npmjs.com/package/supertest)**: 76 432 591 stažení\[^8] (původně vytvořil TJ Holowaychuk)
* **[také](https://www.npmjs.com/package/koa)**: 28 539 295 stažení\[^34] (původně vytvořil TJ Holowaychuk)
* **[@koa/router](https://www.npmjs.com/package/@koa/router)**: 11 007 327 stažení\[^35]
* **[koa-router](https://www.npmjs.com/package/koa-router)**: 3 498 918 stažení\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)**: 2 819 520 stažení\[^37]
* **[náhled-e-mail](https://www.npmjs.com/package/preview-email)**: 2 500 000 stažení\[^9]
* **[chata](https://www.npmjs.com/package/cabin)**: 1 800 000 stažení\[^10]
* **[@breejs/později](https://www.npmjs.com/package/@breejs/later)**: 1 709 938 stažení\[^38]
* **[e-mailové šablony](https://www.npmjs.com/package/email-templates)**: 1 128 139 stažení\[^39]
* **[get-cesty](https://www.npmjs.com/package/get-paths)**: 1 124 686 stažení\[^40]
* **[url-regex-safe](https://www.npmjs.com/package/url-regex-safe)**: 1 200 000 stažení\[^11]
* **[dotenv-parse-variables](https://www.npmjs.com/package/dotenv-parse-variables)**: 894 666 stažení\[^41]
* **[@koa/multer](https://www.npmjs.com/package/@koa/multer)**: 839 585 stažení\[^42]
* **[skener spamu](https://www.npmjs.com/package/spamscanner)**: 145 000 stažení\[^12]
* **[bree](https://www.npmjs.com/package/bree)**: 24 270 stažení\[^30]

> \[!NOTE]
> Several other packages we help maintain but didn't create have even higher download counts, including `form-data` (738M+ downloads), `toidentifier` (309M+ downloads), `stackframe` (116M+ downloads), and `error-stack-parser` (113M+ downloads). We're honored to contribute to these packages while respecting the work of their original authors.

Nejsou to jen působivá čísla – představují skutečné vývojáře, kteří řeší skutečné problémy s kódem, který pomáháme udržovat. Každé stažení je příkladem, kdy tyto balíčky pomohly někomu vytvořit něco smysluplného, od amatérských projektů po podnikové aplikace používané miliony.

![Distribuce kategorií balíčků](/img/art/category_pie_chart.svg)

### Denní dopad ve velkém měřítku {#daily-impact-at-scale}

Denní vzorce stahování odhalují konzistentní a vysoký objem využití, přičemž vrcholy dosahují milionů stažení denně\[^13]. Tato konzistence hovoří o stabilitě a spolehlivosti těchto balíčků – vývojáři je nejen zkoušejí, ale integrují je do svých základních pracovních postupů a spoléhají se na ně den co den.

Týdenní statistiky stahování ukazují ještě působivější čísla, která se trvale pohybují kolem desítek milionů stažení týdně\[^14]. To představuje masivní dopad na ekosystém JavaScriptu, jelikož tyto balíčky běží v produkčních prostředích po celém světě.

### Za hranicemi surových čísel {#beyond-the-raw-numbers}

I když jsou statistiky stahování působivé samy o sobě, vyprávějí hlubší příběh o důvěře, kterou komunita vkládá do těchto balíčků. Udržování balíčků v tomto rozsahu vyžaduje neochvějný závazek:

* **Zpětná kompatibilita**: Změny je nutné pečlivě zvážit, aby se předešlo narušení stávajících implementací.
* **Zabezpečení**: Vzhledem k milionům aplikací závislých na těchto balíčcích by bezpečnostní zranitelnosti mohly mít dalekosáhlé důsledky.
* **Výkon**: V tomto rozsahu mohou mít i drobná vylepšení výkonu významné celkové výhody.
* **Dokumentace**: Jasná a komplexní dokumentace je nezbytná pro balíčky používané vývojáři všech úrovní zkušeností.

Trvalý růst počtu stažení v průběhu času odráží úspěch při plnění těchto závazků, budování důvěry s komunitou vývojářů prostřednictvím spolehlivých a dobře udržovaných balíčků.

## Podpora ekosystému: Naše sponzorství open source {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> Open source sustainability isn't just about contributing code—it's also about supporting the developers who maintain critical infrastructure.

Kromě našich přímých příspěvků do ekosystému JavaScript jsme hrdí na to, že můžeme sponzorovat významné přispěvatele Node.js, jejichž práce tvoří základ mnoha moderních aplikací. Mezi naše sponzorské dary patří:

### Andris Reinman: Průkopník e-mailové infrastruktury {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) je tvůrcem [Nodemailer](https://github.com/nodemailer/nodemailer), nejoblíbenější knihovny pro odesílání e-mailů pro Node.js s více než 14 miliony stažení týdně\[^15]. Jeho práce se rozšiřuje na další kritické komponenty e-mailové infrastruktury, jako jsou [Server SMTP](https://github.com/nodemailer/smtp-server), [Mailparser](https://github.com/nodemailer/mailparser) a [Divoká kachna](https://github.com/nodemailer/wildduck).

Naše sponzorství pomáhá zajistit nepřetržitou údržbu a vývoj těchto základních nástrojů, které podporují e-mailovou komunikaci pro nespočet aplikací Node.js, včetně naší vlastní služby Forward Email.

### Sindre Sorhus: Tvůrce balíčků nástrojů {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus) je jedním z nejproduktivnějších open source přispěvatelů v ekosystému JavaScriptu s více než 1 000 npm balíčky. Jeho utility jako [p-mapa](https://github.com/sindresorhus/p-map), [p-opakovat](https://github.com/sindresorhus/p-retry) a [je-stream](https://github.com/sindresorhus/is-stream) jsou základními stavebními kameny používanými v celém ekosystému Node.js.

Sponzorováním práce Sindre pomáháme udržovat vývoj těchto kritických nástrojů, díky nimž je vývoj JavaScriptu efektivnější a spolehlivější.

Tato sponzorství odrážejí náš závazek vůči širšímu open source ekosystému. Uvědomujeme si, že náš vlastní úspěch je postaven na základech, které položili tito a další přispěvatelé, a věnujeme se zajištění udržitelnosti celého ekosystému.

## Odhalování bezpečnostních zranitelností v ekosystému JavaScriptu {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

Náš závazek k open source přesahuje vývoj funkcí a zahrnuje identifikaci a řešení bezpečnostních slabin, které by mohly mít dopad na miliony vývojářů. Několik našich nejvýznamnějších příspěvků do ekosystému JavaScriptu bylo v oblasti bezpečnosti.

__CHRÁNĚNÁ_URL_104__ Záchrana Koa-Routeru {__CHRÁNĚNÁ_URL_105__

V únoru 2019 Nick identifikoval kritický problém s údržbou populárního balíčku koa-router. Jak uvedl [Informoval o tom server Hacker News](https://news.ycombinator.com/item?id=19156707), balíček byl opuštěn jeho původním správcem, takže bezpečnostní zranitelnosti zůstaly neřešeny a komunita bez aktualizací.

> \[!WARNING]
> Abandoned packages with security vulnerabilities pose significant risks to the entire ecosystem, especially when they're downloaded millions of times weekly.

V reakci na to Nick vytvořil [@koa/router](https://github.com/koajs/router) a pomohl upozornit komunitu na situaci. Od té doby se o tento klíčový balíček stará a zajišťuje tak, aby uživatelé Koa měli bezpečné a dobře udržované řešení směrování.

### Řešení zranitelností ReDoS {#addressing-redos-vulnerabilities}

V roce 2020 Nick identifikoval a opravil kritickou zranitelnost [Regular Expression Denial of Service (ReDoS)](https://en.wikipedia.org/wiki/ReDoS) v široce používaném balíčku `url-regex`. Tato zranitelnost ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) mohla útočníkům umožnit způsobit odmítnutí služby poskytnutím speciálně vytvořeného vstupu, který způsoboval katastrofické backtracking v regulárním výrazu.

Místo pouhé opravy stávajícího balíčku vytvořil Nick [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), kompletně přepsanou implementaci, která řeší danou zranitelnost a zároveň zachovává kompatibilitu s původním API. Také publikoval [obsáhlý příspěvek na blogu](/blog/docs/url-regex-javascript-node-js) vysvětlující zranitelnost a způsoby, jak ji zmírnit.

Tato práce ukazuje náš přístup k bezpečnosti: nejen řešení problémů, ale také vzdělávání komunity a poskytování robustních alternativ, které podobným problémům v budoucnu zabrání.

### Podpora zabezpečení Node.js a Chromia {#advocating-for-nodejs-and-chromium-security}

Nick se také aktivně zasazuje o vylepšení zabezpečení v širším ekosystému. V srpnu 2020 identifikoval významný bezpečnostní problém v Node.js související se zpracováním HTTP hlaviček, který byl nahlášen v [Registr](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/).

Tento problém, který pocházel z opravy v prohlížeči Chromium, by mohl útočníkům potenciálně umožnit obejít bezpečnostní opatření. Nickova obhajoba pomohla zajistit, že problém byl rychle vyřešen a ochránil miliony aplikací Node.js před potenciálním zneužitím.

### Zabezpečení infrastruktury npm {#securing-npm-infrastructure}

Později téhož měsíce Nick identifikoval další kritický bezpečnostní problém, tentokrát v e-mailové infrastruktuře npm. Jak bylo uvedeno v [Registr](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/), npm neimplementoval správně protokoly ověřování e-mailů DMARC, SPF a DKIM, což útočníkům potenciálně umožňovalo odesílat phishingové e-maily, které vypadaly, jako by pocházely od npm.

Nickova zpráva vedla ke zlepšení e-mailového zabezpečení npm, chránící miliony vývojářů, kteří spoléhají na npm pro správu balíčků, před potenciálními phishingovými útoky.

## Naše příspěvky k ekosystému přeposílaných e-mailů {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Email je postaven na několika kritických open source projektech, včetně Nodemailer, WildDuck a mailauth. Náš tým významně přispěl k těmto projektům a pomohl identifikovat a opravit hluboké problémy, které ovlivňují doručování e-mailů a zabezpečení.

### Vylepšení základních funkcí Nodemaileru {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) je páteří odesílání e-mailů v Node.js a naše příspěvky pomohly k jeho robustnějšímu provedení:

* **Vylepšení serveru SMTP**: Opravili jsme chyby v parsování, problémy se zpracováním streamů a problémy s konfigurací TLS v komponentě serveru SMTP\[^16]\[^17].
* **Vylepšení analyzátoru pošty**: Opravili jsme chyby dekódování sekvence znaků a problémy s analyzátorem, které mohly způsobovat selhání zpracování e-mailů\[^18]\[^19].

Tyto příspěvky zajišťují, že Nodemailer zůstane spolehlivým základem pro zpracování e-mailů v aplikacích Node.js, včetně Forward Email.

### Pokročilé ověřování e-mailů pomocí Mailauth {#advancing-email-authentication-with-mailauth}

[Mailauth](https://github.com/postalsys/mailauth) poskytuje kritické funkce ověřování e-mailů a naše příspěvky výrazně vylepšily jeho možnosti:

* **Vylepšení ověřování DKIM**: Zjistili jsme a nahlásili, že X/Twitter má problémy s DNS cache, které způsobují selhání DKIM u odchozích zpráv. Nahlásili jsme to na Hacker One\[^20].
* **Vylepšení DMARC a ARC**: Opravili jsme problémy s ověřováním DMARC a ARC, které mohly vést k nesprávným výsledkům ověřování\[^21]\[^22].
* **Optimalizace výkonu**: Přispěli jsme optimalizacemi, které zlepšují výkon procesů ověřování e-mailů\[^23]\[^24]\[^25]\[^26].

Tato vylepšení pomáhají zajistit, že ověřování e-mailů je přesné a spolehlivé a chrání uživatele před phishingovými a spoofingovými útoky.

### Klíčová vylepšení provozuschopnosti {#key-upptime-enhancements}

Mezi naše příspěvky do Upptime patří:

* **Monitorování SSL certifikátů**: Přidali jsme funkci pro sledování vypršení platnosti SSL certifikátů, čímž jsme zabránili neočekávaným výpadkům způsobeným vypršením platnosti certifikátů\[^27].
* **Podpora více SMS čísel**: Implementovali jsme podporu pro upozorňování více členů týmu prostřednictvím SMS v případě incidentů, čímž jsme zkrátili dobu odezvy\[^28].
* **Opravy kontrol IPv6**: Opravili jsme problémy s kontrolami připojení IPv6, čímž jsme zajistili přesnější monitorování v moderních síťových prostředích\[^29].
* **Podpora tmavého/světlého režimu**: Přidali jsme podporu motivů pro zlepšení uživatelského prostředí stavových stránek\[^31].
* **Lepší podpora TCP-Ping**: Vylepšili jsme funkci TCP ping, abychom zajistili spolehlivější testování připojení\[^32].

Tato vylepšení nejen prospívají monitorování stavu Forward Email, ale jsou dostupná celé komunitě uživatelů Uptime, což dokazuje náš závazek zlepšovat nástroje, na kterých jsme závislí.

## Lepidlo, které drží všechno pohromadě: Vlastní kód ve velkém měřítku {#the-glue-that-holds-it-all-together-custom-code-at-scale}

I když jsou naše npm balíčky a příspěvky ke stávajícím projektům významné, je to právě vlastní kód, který tyto komponenty integruje, co skutečně prezentuje naši technickou odbornost. Kódová základna Forward Email představuje desetiletí vývojového úsilí, které sahá až do roku 2017, kdy projekt začínal jako [bezplatné přeposílání e-mailů](https://github.com/forwardemail/free-email-forwarding), než byl sloučen do monorepozitáře.

### Obrovské vývojové úsilí {#a-massive-development-effort}

Rozsah tohoto vlastního integračního kódu je působivý:

* **Celkový počet příspěvků**: Více než 3 217 commitů
* **Velikost kódové základny**: Více než 421 545 řádků kódu v souborech JavaScript, Pug, CSS a JSON\[^33]

To představuje tisíce hodin vývojové práce, ladění relací a optimalizací výkonu. Je to „tajná omáčka“, která přeměňuje jednotlivé balíčky v soudržnou a spolehlivou službu, kterou denně využívají tisíce zákazníků.

### Integrace základních závislostí {#core-dependencies-integration}

Kódová základna Forward Email integruje četné závislosti do bezproblémového celku:

* **Zpracování e-mailů**: Integruje Nodemailer pro odesílání, SMTP server pro příjem a Mailparser pro parsování.
* **Ověřování**: Používá Mailauth pro ověřování DKIM, SPF, DMARC a ARC.
* **Přeslání DNS**: Využívá Tangerine pro DNS přes HTTPS s globálním ukládáním do mezipaměti.
* **MX Connection**: Využívá mx-connect s integrací Tangerine pro spolehlivé připojení k poštovnímu serveru.
* **Plánování úloh**: Využívá Bree pro spolehlivé zpracování úloh na pozadí s pracovními vlákny.
* **Šablony**: Využívá email-templates k opětovnému použití stylů z webových stránek v komunikaci se zákazníky.
* **Úložiště e-mailů**: Implementuje individuálně šifrované poštovní schránky SQLite pomocí better-sqlite3-multiple-ciphers se šifrováním ChaCha20-Poly1305 pro kvantově bezpečné soukromí, čímž zajišťuje úplnou izolaci mezi uživateli a přístup ke své poštovní schránce pouze daný uživatel.

Každá z těchto integrací vyžaduje pečlivé zvážení okrajových případů, dopadů na výkon a bezpečnostních problémů. Výsledkem je robustní systém, který spolehlivě zpracuje miliony e-mailových transakcí. Naše implementace SQLite také využívá msgpackr pro efektivní binární serializaci a WebSockets (přes ws) pro aktualizace stavu v reálném čase v naší infrastruktuře.

### DNS infrastruktura s Tangerine a mx-connect {#dns-infrastructure-with-tangerine-and-mx-connect}

Důležitou součástí infrastruktury Forward Email je náš systém pro rozlišení DNS, který je postaven na dvou klíčových balíčcích:

* **[Mandarinka](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: Naše implementace Node.js DNS-over-HTTPS poskytuje okamžitou náhradu za standardní DNS resolver s vestavěnými možnostmi opakování, časovými limity, inteligentní rotací serverů a podporou ukládání do mezipaměti.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: Tento balíček navazuje TCP připojení k MX serverům, přičemž bere cílovou doménu nebo e-mailovou adresu, rozlišuje příslušné MX servery a připojuje se k nim v pořadí priority.

Prostřednictvím [pull request #4](https://github.com/zone-eu/mx-connect/pull/4), zajištění DNS na aplikační vrstvě přes HTTP požadavky v celém Forward Email. To poskytuje globální ukládání DNS do mezipaměti ve velkém měřítku s konzistencí 1:1 v jakékoli oblasti, aplikaci nebo procesu – což je zásadní pro spolehlivé doručování e-mailů v distribuovaném systému.

## Dopad na podniky: Od open source k řešením pro kritické potřeby {#enterprise-impact-from-open-source-to-mission-critical-solutions}

Vrcholem naší desetileté cesty ve vývoji open source umožnilo Forward Email sloužit nejen jednotlivým vývojářům, ale i velkým podnikům a vzdělávacím institucím, které tvoří páteř samotného hnutí open source.

### Případové studie infrastruktury pro kritické potřeby e-mailů {#case-studies-in-mission-critical-email-infrastructure}

Náš závazek ke spolehlivosti, soukromí a principům open source učinil z Forward Email důvěryhodnou volbu pro organizace s náročnými požadavky na e-mail:

* **Vzdělávací instituce**: Jak je podrobně uvedeno v naší [případové studii pro přeposílání e-mailů absolventů]](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study) jsme integrovali Tangerine s mx-connect. Velké univerzity se spoléhají na naši infrastrukturu k udržování celoživotního spojení se stovkami tisíc absolventů prostřednictvím spolehlivých služeb přeposílání e-mailů.

* **Řešení pro podnikový Linux**: [Canonical Ubuntu Enterprise Případová studie e-mailu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) ukazuje, jak náš přístup k otevřenému zdrojovému kódu dokonale odpovídá potřebám poskytovatelů podnikového Linuxu a nabízí jim transparentnost a kontrolu, které potřebují.

* **Nadace open source**: Snad nejvíce potvrzující je naše partnerství s Linux Foundation, jak je zdokumentováno v [Případová studie e-mailového podniku Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study), kde naše služba zajišťuje komunikaci pro organizaci, která řídí vývoj Linuxu.

V tom, jak nám naše balíčky s otevřeným zdrojovým kódem, pečlivě udržované po mnoho let, umožnily vybudovat e-mailovou službu, která nyní podporuje právě ty komunity a organizace, které propagují software s otevřeným zdrojovým kódem, je krásná symetrie. Tato komplexní cesta – od přispění jednotlivých balíčků po napájení podnikové e-mailové infrastruktury pro lídry s otevřeným zdrojovým kódem – představuje konečné ověření našeho přístupu k vývoji softwaru.

## Deset let open source: Pohled do budoucna {#a-decade-of-open-source-looking-forward}

Když se ohlížíme za desetiletím příspěvků s otevřeným zdrojovým kódem a těšíme se na dalších deset let, jsme naplněni vděčností za komunitu, která podpořila naši práci, a nadšením pro to, co přijde.

Naše cesta od jednotlivých přispěvatelů balíčků k správcům komplexní e-mailové infrastruktury používané velkými podniky a nadacemi s otevřeným zdrojovým kódem byla pozoruhodná. Je to důkaz síly vývoje s otevřeným zdrojovým kódem a dopadu, který může mít promyšlený a dobře udržovaný software na širší ekosystém.

V příštích letech se zavazujeme:

* **Pokračujeme v údržbě a vylepšování našich stávajících balíčků** a zajišťujeme, aby i nadále sloužily jako spolehlivé nástroje pro vývojáře po celém světě.
* **Rozšiřujeme naše příspěvky k projektům kritické infrastruktury**, zejména v oblasti e-mailů a zabezpečení.
* **Vylepšujeme možnosti Forward Email** a zároveň si zachováváme náš závazek k ochraně soukromí, zabezpečení a transparentnosti.
* **Podporujeme další generaci přispěvatelů s otevřeným zdrojovým kódem** prostřednictvím mentoringu, sponzorství a zapojení komunity.

Věříme, že budoucnost vývoje softwaru je otevřená, spolupracující a postavená na základě důvěry. Doufáme, že tím, že budeme do ekosystému JavaScriptu nadále přispívat vysoce kvalitními balíčky zaměřenými na bezpečnost, budeme hrát malou roli při budování této budoucnosti.

Děkujeme všem, kteří využili naše balíčky, přispěli do našich projektů, nahlásili problémy nebo prostě jen rozšířili povědomí o naší práci. Vaše podpora umožnila toto desetiletí vlivu a my jsme nadšeni, že uvidíme, čeho můžeme společně dosáhnout v příštích deseti letech.

\[^1]: Statistiky stažení npm pro cabin, duben 2025
\[^2]: Statistiky stažení npm pro bson-objectid, únor-březen 2025
\[^3]: Statistiky stažení npm pro url-regex-safe, duben 2025
\[^4]: Počet hvězdiček GitHubu pro forwardemail/forwardemail.net k dubnu 2025
\[^5]: Statistiky stažení npm pro preview-email, duben 2025
\[^7]: Statistiky stažení npm pro superagent, únor-březen 2025
\[^8]: Statistiky stažení npm pro supertest, únor-březen 2025
\[^9]: Statistiky stažení npm pro preview-email, únor-březen 2025
\[^10]: Statistiky stažení npm pro cabin, únor-březen 2025
\[^11]: Statistiky stažení npm pro url-regex-safe, únor-březen 2025
\[^12]: Statistiky stahování npm pro spamscanner, únor-březen 2025
\[^13]: Denní vzorce stahování ze statistik npm, duben 2025
\[^14]: Týdenní vzorce stahování ze statistik npm, duben 2025
\[^15]: Statistiky stahování npm pro nodemailer, duben 2025
\[^16]: <https://github.com/nodemailer/smtp-server/issues/155>
\[^17]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>
\[^18]: <https://github.com/nodemailer/mailparser/issues/261>
\[^19]: <https://github.com/nodemailer/nodemailer/issues/1102>
\[^20]: <https://github.com/postalsys/mailauth/issues/30>
\[^21]: <https://github.com/postalsys/mailauth/issues/58>
\[^22]: <https://github.com/postalsys/mailauth/issues/48>
\[^23]: <https://github.com/postalsys/mailauth/issues/74>
\[^24]: <https://github.com/postalsys/mailauth/issues/75>
\[^25]: <https://github.com/postalsys/mailauth/issues/60>
\[^26]: <https://github.com/postalsys/mailauth/issues/73>
\[^27]: Na základě problémů s GitHubem v repozitáři Upptime
\[^28]: Na základě problémů s GitHubem v repozitáři Upptime
\[^29]: Na základě problémů s GitHubem v repozitáři Upptime
\[^30]: statistiky stahování npm pro bree, únor-březen 2025
\[^31]: Na základě požadavků na stažení z GitHubu do Upptime
\[^32]: Na základě požadavků na stažení z GitHubu do Upptime
\[^34]: statistiky stahování npm pro koa, únor-březen 2025
\[^35]: statistiky stahování npm pro @koa/router, Únor-březen 2025
\[^36]: statistiky stahování npm pro koa-router, únor-březen 2025
\[^37]: statistiky stahování npm pro url-regex, únor-březen 2025
\[^38]: statistiky stahování npm pro @breejs/later, únor-březen 2025
\[^39]: statistiky stahování npm pro email-templates, únor-březen 2025
\[^40]: statistiky stahování npm pro get-paths, únor-březen 2025
\[^41]: statistiky stahování npm pro dotenv-parse-variables, únor-březen 2025
\[^42]: statistiky stahování npm pro @koa/multer, únor-březen 2025