# Dekáda dopadu: Jak naše npm balíčky dosáhly 1 miliardy stažení a formovaly JavaScript {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" class="rounded-lg" />


## Obsah {#table-of-contents}

* [Předmluva](#foreword)
* [Průkopníci, kteří nám důvěřují: Isaac Z. Schlueter a Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [Od vzniku npm k vedení Node.js](#from-npms-creation-to-nodejs-leadership)
* [Architekt za kódem: Cesta Nicka Baugha](#the-architect-behind-the-code-nick-baughs-journey)
  * [Technický výbor Express a příspěvky do jádra](#express-technical-committee-and-core-contributions)
  * [Příspěvky do frameworku Koa](#koa-framework-contributions)
  * [Od jednotlivého přispěvatele k vedoucímu organizace](#from-individual-contributor-to-organization-leader)
* [Naše GitHub organizace: Ekosystémy inovací](#our-github-organizations-ecosystems-of-innovation)
  * [Cabin: Strukturované logování pro moderní aplikace](#cabin-structured-logging-for-modern-applications)
  * [Spam Scanner: Boj proti zneužívání e-mailů](#spam-scanner-fighting-email-abuse)
  * [Bree: Moderní plánování úloh s worker threads](#bree-modern-job-scheduling-with-worker-threads)
  * [Forward Email: Open source infrastruktura e-mailů](#forward-email-open-source-email-infrastructure)
  * [Lad: Základní nástroje a utility pro Koa](#lad-essential-koa-utilities-and-tools)
  * [Upptime: Open source monitorování dostupnosti](#upptime-open-source-uptime-monitoring)
* [Naše příspěvky do ekosystému Forward Email](#our-contributions-to-the-forward-email-ecosystem)
  * [Od balíčků k produkci](#from-packages-to-production)
  * [Zpětná vazba](#the-feedback-loop)
* [Základní principy Forward Email: Základ pro excelenci](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Vždy přívětivé k vývojářům, zaměřené na bezpečnost a transparentní](#always-developer-friendly-security-focused-and-transparent)
  * [Dodržování osvědčených principů vývoje softwaru](#adherence-to-time-tested-software-development-principles)
  * [Cílení na houževnaté, samostatné vývojáře](#targeting-the-scrappy-bootstrapped-developer)
  * [Principy v praxi: Kódová základna Forward Email](#principles-in-practice-the-forward-email-codebase)
  * [Ochrana soukromí od začátku](#privacy-by-design)
  * [Udržitelný open source](#sustainable-open-source)
* [Čísla nelžou: Naše ohromující statistiky stažení npm](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [Přehled našeho dopadu](#a-birds-eye-view-of-our-impact)
  * [Denní dopad v měřítku](#daily-impact-at-scale)
  * [Za hranicí čistých čísel](#beyond-the-raw-numbers)
* [Podpora ekosystému: Naše open source sponzorství](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: Průkopník e-mailové infrastruktury](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: Mistr utility balíčků](#sindre-sorhus-utility-package-mastermind)
* [Odhalování bezpečnostních zranitelností v JavaScript ekosystému](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [Záchrana Koa-Routeru](#the-koa-router-rescue)
  * [Řešení zranitelností ReDoS](#addressing-redos-vulnerabilities)
  * [Prosazování bezpečnosti Node.js a Chromia](#advocating-for-nodejs-and-chromium-security)
  * [Zabezpečení infrastruktury npm](#securing-npm-infrastructure)
* [Naše příspěvky do ekosystému Forward Email](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Vylepšení základní funkčnosti Nodemaileru](#enhancing-nodemailers-core-functionality)
  * [Pokrok v autentizaci e-mailů s Mailauth](#advancing-email-authentication-with-mailauth)
  * [Klíčová vylepšení Upptime](#key-upptime-enhancements)
* [Lepidlo, které vše drží pohromadě: Vlastní kód v měřítku](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [Obrovské vývojové úsilí](#a-massive-development-effort)
  * [Integrace klíčových závislostí](#core-dependencies-integration)
  * [DNS infrastruktura s Tangerine a mx-connect](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Dopad v podnicích: Od open source k řešením kritickým pro mise](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Případové studie kritické e-mailové infrastruktury](#case-studies-in-mission-critical-email-infrastructure)
* [Dekáda open source: Výhled do budoucna](#a-decade-of-open-source-looking-forward)
## Předmluva {#foreword}

Ve světě [JavaScriptu](https://en.wikipedia.org/wiki/JavaScript) a [Node.js](https://en.wikipedia.org/wiki/Node.js) jsou některé balíčky nezbytné – stahují se milionykrát denně a pohánějí aplikace po celém světě. Za těmito nástroji stojí vývojáři zaměření na kvalitu open source. Dnes ukazujeme, jak náš tým pomáhá vytvářet a udržovat npm balíčky, které se staly klíčovými součástmi ekosystému JavaScriptu.


## Průkopníci, kteří nám důvěřují: Isaac Z. Schlueter a Forward Email {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

Jsme hrdí, že máme mezi uživateli [Isaaca Z. Schluetera](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)). Isaac vytvořil [npm](https://en.wikipedia.org/wiki/Npm_\(software\)) a pomáhal budovat [Node.js](https://en.wikipedia.org/wiki/Node.js). Jeho důvěra ve Forward Email ukazuje náš důraz na kvalitu a bezpečnost. Isaac používá Forward Email pro několik domén včetně izs.me.

Isaacův vliv na JavaScript je obrovský. V roce 2009 byl mezi prvními, kdo viděli potenciál Node.js, když spolupracoval s [Ryanem Dahlem](https://en.wikipedia.org/wiki/Ryan_Dahl), který platformu vytvořil. Jak Isaac řekl v [rozhovoru pro časopis Increment](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/): „Uprostřed této velmi malé komunity lidí, kteří se snažili přijít na to, jak uskutečnit serverový JS, přišel Ryan Dahl s Node, což bylo jasně správné řešení. Vsadil jsem na to a velmi se zapojil někdy v polovině roku 2009.“

> \[!NOTE]
> Pro zájemce o historii Node.js jsou k dispozici vynikající dokumenty, které sledují jeho vývoj, včetně [The Story of Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) a [10 Things I Regret About Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). Ryan Dahlův [osobní web](https://tinyclouds.org/) také obsahuje cenné poznatky o jeho práci.

### Od vzniku npm k vedení Node.js {#from-npms-creation-to-nodejs-leadership}

Isaac vytvořil npm v září 2009, přičemž první použitelná verze byla vydána začátkem roku 2010. Tento správce balíčků vyplnil klíčovou potřebu v Node.js, umožňující vývojářům snadno sdílet a znovu používat kód. Podle [stránky Node.js na Wikipedii](https://en.wikipedia.org/wiki/Node.js): „V lednu 2010 byl pro prostředí Node.js zaveden správce balíčků nazvaný npm. Správce balíčků umožňuje programátorům publikovat a sdílet Node.js balíčky spolu s přiloženým zdrojovým kódem a je navržen tak, aby usnadnil instalaci, aktualizaci a odinstalaci balíčků.“

Když se Ryan Dahl v lednu 2012 stáhl z Node.js, Isaac převzal vedení projektu. Jak je uvedeno v [jeho životopise](https://izs.me/resume), „vedl vývoj několika základních Node.js core API, včetně systému modulů CommonJS, API pro souborový systém a streamů“ a „působil jako BDFL (Benevolent Dictator For Life) projektu po dobu 2 let, zajišťující stále rostoucí kvalitu a spolehlivý proces sestavení pro verze Node.js v0.6 až v0.10.“

Isaac vedl Node.js během klíčového období růstu a stanovil standardy, které platformu formují dodnes. Později v roce 2014 založil npm, Inc., aby podporoval npm registry, které dříve provozoval sám.

Děkujeme Isaacovi za jeho obrovský přínos pro JavaScript a nadále používáme mnoho balíčků, které vytvořil. Jeho práce změnila způsob, jakým vytváříme software a jak miliony vývojářů sdílejí kód po celém světě.


## Architekt za kódem: cesta Nicka Baugha {#the-architect-behind-the-code-nick-baughs-journey}

V srdci našeho úspěchu v open source je Nick Baugh, zakladatel a majitel Forward Email. Jeho práce v JavaScriptu trvá téměř 20 let a ovlivnila, jak nespočet vývojářů vytváří aplikace. Jeho cesta v open source ukazuje jak technické dovednosti, tak vedení komunity.

### Technický výbor Express a hlavní příspěvky {#express-technical-committee-and-core-contributions}

Nickova odbornost v oblasti webových frameworků mu zajistila místo v [Technickém výboru Express](https://expressjs.com/en/resources/community.html), kde pomáhal s jedním z nejpoužívanějších Node.js frameworků. Nick je nyní uveden jako neaktivní člen na [stránce komunity Express](https://expressjs.com/en/resources/community.html).
> \[!IMPORTANT]
> Express byl původně vytvořen TJ Holowaychukem, plodným přispěvatelem do open source, který formoval velkou část ekosystému Node.js. Jsme vděční za TJho základní práci a respektujeme jeho [rozhodnutí si dát pauzu](https://news.ycombinator.com/item?id=37687017) od jeho rozsáhlých open source příspěvků.

Jako člen [Technického výboru Express](https://expressjs.com/en/resources/community.html) Nick prokázal velkou pozornost k detailům v otázkách jako je upřesnění dokumentace `req.originalUrl` a oprava problémů s manipulací multipart formulářů.

### Příspěvky do frameworku Koa {#koa-framework-contributions}

Nickova práce s [Koa frameworkem](https://github.com/koajs/koa)—moderní, lehčí alternativou k Express, kterou také vytvořil TJ Holowaychuk—dále ukazuje jeho závazek k lepším nástrojům pro webový vývoj. Jeho příspěvky do Koa zahrnují jak řešení problémů, tak kód prostřednictvím pull requestů, zaměřené na zpracování chyb, správu typů obsahu a zlepšení dokumentace.

Jeho práce napříč Express i Koa mu dává jedinečný pohled na webový vývoj v Node.js, což pomáhá našemu týmu vytvářet balíčky, které dobře fungují v rámci více frameworkových ekosystémů.

### Od jednotlivého přispěvatele k lídrovi organizace {#from-individual-contributor-to-organization-leader}

Co začalo jako pomoc existujícím projektům, vyrostlo v tvorbu a údržbu celých ekosystémů balíčků. Nick založil několik GitHub organizací—včetně [Cabin](https://github.com/cabinjs), [Spam Scanner](https://github.com/spamscanner), [Forward Email](https://github.com/forwardemail), [Lad](https://github.com/ladjs) a [Bree](https://github.com/breejs)—z nichž každá řeší specifické potřeby v JavaScript komunitě.

Tento přechod od přispěvatele k lídrovi ukazuje Nickovu vizi dobře navrženého softwaru, který řeší skutečné problémy. Organizováním souvisejících balíčků pod zaměřené GitHub organizace vybudoval nástrojové ekosystémy, které spolupracují, přitom zůstávají modulární a flexibilní pro širší vývojářskou komunitu.


## Naše GitHub organizace: Ekosystémy inovací {#our-github-organizations-ecosystems-of-innovation}

Naši open source práci organizujeme kolem zaměřených GitHub organizací, z nichž každá řeší specifické potřeby v JavaScriptu. Tato struktura vytváří soudržné rodiny balíčků, které spolu dobře fungují a zároveň zůstávají modulární.

### Cabin: Strukturované logování pro moderní aplikace {#cabin-structured-logging-for-modern-applications}

[Organizace Cabin](https://github.com/cabinjs) je náš pohled na jednoduché, výkonné logování aplikací. Hlavní balíček [`cabin`](https://github.com/cabinjs/cabin) má téměř 900 hvězdiček na GitHubu a přes 100 000 týdenních stažení\[^1]. Cabin poskytuje strukturované logování, které funguje s populárními službami jako Sentry, LogDNA a Papertrail.

Co dělá Cabin výjimečným, je jeho promyšlené API a systém pluginů. Podpůrné balíčky jako [`axe`](https://github.com/cabinjs/axe) pro Express middleware a [`parse-request`](https://github.com/cabinjs/parse-request) pro parsování HTTP požadavků ukazují náš závazek k úplným řešením místo izolovaných nástrojů.

Balíček [`bson-objectid`](https://github.com/cabinjs/bson-objectid) si zaslouží zvláštní zmínku, s více než 1,7 miliony stažení za pouhé dva měsíce\[^2]. Tato lehká implementace MongoDB ObjectID se stala oblíbenou volbou pro vývojáře, kteří potřebují ID bez plných závislostí na MongoDB.

### Spam Scanner: Boj proti zneužívání e-mailů {#spam-scanner-fighting-email-abuse}

[Organizace Spam Scanner](https://github.com/spamscanner) ukazuje náš závazek řešit skutečné problémy. Hlavní balíček [`spamscanner`](https://github.com/spamscanner/spamscanner) poskytuje pokročilou detekci spamových e-mailů, ale balíček [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe) zaznamenal úžasné přijetí.

S více než 1,2 miliony stažení za dva měsíce\[^3], `url-regex-safe` opravuje kritické bezpečnostní problémy v jiných regulárních výrazech pro detekci URL. Tento balíček ukazuje náš přístup k open source: najít běžný problém (v tomto případě [ReDoS](https://en.wikipedia.org/wiki/ReDoS) zranitelnosti v ověřování URL), vytvořit solidní řešení a pečlivě jej udržovat.
### Bree: Moderní plánování úloh s pracovními vlákny {#bree-modern-job-scheduling-with-worker-threads}

Organizace [Bree](https://github.com/breejs) je naší odpovědí na běžný problém v Node.js: spolehlivé plánování úloh. Hlavní balíček [`bree`](https://github.com/breejs/bree), s více než 3 100 hvězdami na GitHubu, poskytuje moderní plánovač úloh využívající pracovní vlákna Node.js pro lepší výkon a spolehlivost.

> \[!NOTE]
> Bree vzniklo poté, co jsme pomáhali udržovat [Agenda](https://github.com/agenda/agenda), přičemž jsme aplikovali získané zkušenosti k vytvoření lepšího plánovače úloh. Naše příspěvky do Agendy nám pomohly najít způsoby, jak zlepšit plánování úloh.

Co dělá Bree odlišným od jiných plánovačů jako Agenda:

* **Žádné externí závislosti**: Na rozdíl od Agendy, která potřebuje MongoDB, Bree nevyžaduje Redis ani MongoDB pro správu stavu úloh.
* **Pracovní vlákna**: Bree používá pracovní vlákna Node.js pro sandboxované procesy, což poskytuje lepší izolaci a výkon.
* **Jednoduché API**: Bree nabízí podrobnou kontrolu s jednoduchostí, což usnadňuje implementaci složitých požadavků na plánování.
* **Vestavěná podpora**: Funkce jako plynulé přenačítání, cron úlohy, data a uživatelsky přívětivé časy jsou zahrnuty ve výchozím nastavení.

Bree je klíčovou součástí [forwardemail.net](https://github.com/forwardemail/forwardemail.net), kde zajišťuje kritické úlohy na pozadí jako zpracování e-mailů, úklid a plánovanou údržbu. Použití Bree ve Forward Email ukazuje náš závazek používat vlastní nástroje v produkci a zajistit, že splňují vysoké standardy spolehlivosti.

Také používáme a oceňujeme další skvělé balíčky pro pracovní vlákna jako [piscina](https://github.com/piscinajs/piscina) a HTTP klienty jako [undici](https://github.com/nodejs/undici). Piscina, stejně jako Bree, využívá pracovní vlákna Node.js pro efektivní zpracování úloh. Děkujeme [Matteu Collinovi](https://github.com/mcollina), který udržuje jak undici, tak piscina, za jeho významné příspěvky do Node.js. Matteo je členem Technického řídícího výboru Node.js a výrazně zlepšil schopnosti HTTP klientů v Node.js.

### Forward Email: Open Source e-mailová infrastruktura {#forward-email-open-source-email-infrastructure}

Náš nejambicióznější projekt je [Forward Email](https://github.com/forwardemail), open source e-mailová služba, která poskytuje přeposílání e-mailů, úložiště a API služby. Hlavní repozitář má přes 1 100 hvězd na GitHubu\[^4], což ukazuje ocenění komunity pro tuto alternativu k proprietárním e-mailovým službám.

Balíček [`preview-email`](https://github.com/forwardemail/preview-email) z této organizace, s více než 2,5 miliony stažení za dva měsíce\[^5], se stal nezbytným nástrojem pro vývojáře pracující s e-mailovými šablonami. Poskytuje jednoduchý způsob náhledu e-mailů během vývoje, čímž řeší běžný problém při tvorbě aplikací podporujících e-maily.

### Lad: Základní nástroje a utility pro Koa {#lad-essential-koa-utilities-and-tools}

Organizace [Lad](https://github.com/ladjs) poskytuje sbírku základních utilit a nástrojů zaměřených především na rozšíření ekosystému frameworku Koa. Tyto balíčky řeší běžné výzvy ve webovém vývoji a jsou navrženy tak, aby spolu hladce spolupracovaly a zároveň byly samostatně užitečné.

#### koa-better-error-handler: Vylepšené zpracování chyb pro Koa {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) nabízí lepší řešení zpracování chyb pro aplikace Koa. S více než 50 hvězdami na GitHubu tento balíček umožňuje, aby `ctx.throw` produkovalo uživatelsky přívětivé chybové zprávy a zároveň řeší několik omezení vestavěného zpracování chyb v Koa:

* Detekuje a správně zpracovává chyby Node.js DNS, chyby Mongoose a chyby Redis
* Používá [Boom](https://github.com/hapijs/boom) pro vytváření konzistentních, dobře formátovaných chybových odpovědí
* Zachovává hlavičky (na rozdíl od vestavěného zpracování Koa)
* Udržuje vhodné stavové kódy místo výchozího 500
* Podporuje flash zprávy a zachování session
* Poskytuje HTML seznamy chyb pro validační chyby
* Podporuje více typů odpovědí (HTML, JSON a prostý text)
Tento balíček je obzvláště cenný při použití společně s [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) pro komplexní správu chyb v aplikacích Koa.

#### passport: Autentizace pro Lad {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport) rozšiřuje populární middleware pro autentizaci Passport.js o specifická vylepšení pro moderní webové aplikace. Tento balíček podporuje více autentizačních strategií ihned po vybalení:

* Lokální autentizace pomocí e-mailu
* Přihlášení přes Apple
* Autentizace přes GitHub
* Autentizace přes Google
* Autentizace pomocí jednorázového hesla (OTP)

Balíček je vysoce přizpůsobitelný, umožňuje vývojářům upravit názvy polí a fráze tak, aby odpovídaly požadavkům jejich aplikace. Je navržen tak, aby se bezproblémově integroval s Mongoose pro správu uživatelů, což z něj činí ideální řešení pro aplikace založené na Koa, které potřebují robustní autentizaci.

#### graceful: Elegantní ukončení aplikace {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful) řeší kritický problém elegantního ukončení aplikací Node.js. S více než 70 hvězdami na GitHubu tento balíček zajišťuje, že vaše aplikace může být ukončena čistě, aniž by došlo ke ztrátě dat nebo ponechání otevřených spojení. Klíčové vlastnosti zahrnují:

* Podpora pro elegantní uzavření HTTP serverů (Express/Koa/Fastify)
* Čisté ukončení připojení k databázi (MongoDB/Mongoose)
* Správné uzavření Redis klientů
* Správa plánovačů úloh Bree
* Podpora vlastních handlerů pro ukončení
* Konfigurovatelná časová omezení
* Integrace se systémy logování

Tento balíček je nezbytný pro produkční aplikace, kde neočekávané ukončení může vést ke ztrátě nebo poškození dat. Implementací správných postupů ukončení pomáhá `@ladjs/graceful` zajistit spolehlivost a stabilitu vaší aplikace.

### Upptime: Open Source monitorování dostupnosti {#upptime-open-source-uptime-monitoring}

Organizace [Upptime](https://github.com/upptime) představuje náš závazek k transparentnímu, open source monitorování. Hlavní repozitář [`upptime`](https://github.com/upptime/upptime) má přes 13 000 hvězd na GitHubu, což z něj činí jeden z nejpopulárnějších projektů, na kterých přispíváme. Upptime poskytuje monitor dostupnosti a statusovou stránku poháněnou GitHubem, která funguje zcela bez serveru.

Upptime používáme pro naši vlastní statusovou stránku na <https://status.forwardemail.net> s dostupným zdrojovým kódem na <https://github.com/forwardemail/status.forwardemail.net>.

Co dělá Upptime výjimečným, je jeho architektura:

* **100% Open Source**: Každá součást je plně open source a přizpůsobitelná.
* **Poháněno GitHubem**: Využívá GitHub Actions, Issues a Pages pro bezserverové monitorování.
* **Není potřeba server**: Na rozdíl od tradičních monitorovacích nástrojů Upptime nevyžaduje provoz nebo údržbu serveru.
* **Automatická statusová stránka**: Generuje krásnou statusovou stránku, kterou lze hostovat na GitHub Pages.
* **Výkonná oznámení**: Integruje se s různými kanály oznámení včetně e-mailu, SMS a Slacku.

Pro zlepšení uživatelského zážitku jsme integrovali [@octokit/core](https://github.com/octokit/core.js/) do kódu forwardemail.net, aby zobrazoval aktualizace stavu a incidentů v reálném čase přímo na našem webu. Tato integrace poskytuje jasnou transparentnost našim uživatelům v případě jakýchkoli problémů napříč celým naším stackem (Web, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree atd.) s okamžitými toast notifikacemi, změnami ikon odznaků, varovnými barvami a dalšími.

Knihovna @octokit/core nám umožňuje získávat data v reálném čase z našeho Upptime GitHub repozitáře, zpracovávat je a zobrazovat uživatelsky přívětivým způsobem. Když má jakákoliv služba výpadek nebo snížený výkon, uživatelé jsou okamžitě upozorněni vizuálními indikátory, aniž by museli opustit hlavní aplikaci. Tato bezproblémová integrace zajišťuje, že naši uživatelé mají vždy aktuální informace o stavu našeho systému, což zvyšuje transparentnost a důvěru.

Upptime bylo přijato stovkami organizací, které hledají transparentní a spolehlivý způsob, jak monitorovat své služby a komunikovat stav uživatelům. Úspěch projektu ukazuje sílu vytváření nástrojů, které využívají existující infrastrukturu (v tomto případě GitHub) k řešení běžných problémů novými způsoby.
## Naše příspěvky do ekosystému Forward Email {#our-contributions-to-the-forward-email-ecosystem}

Zatímco naše open source balíčky používají vývojáři po celém světě, tvoří také základ naší vlastní služby Forward Email. Tato dvojí role – jako tvůrců i uživatelů těchto nástrojů – nám poskytuje jedinečný pohled na jejich reálné použití a pohání neustálé zlepšování.

### Od balíčků k produkci {#from-packages-to-production}

Cesta od jednotlivých balíčků k soudržnému produkčnímu systému zahrnuje pečlivou integraci a rozšíření. Pro Forward Email tento proces zahrnuje:

* **Vlastní rozšíření**: Vytváření rozšíření specifických pro Forward Email k našim open source balíčkům, která řeší naše jedinečné požadavky.
* **Vzorce integrace**: Vývoj vzorců, jak tyto balíčky spolupracují v produkčním prostředí.
* **Optimalizace výkonu**: Identifikace a řešení výkonových úzkých míst, která se projeví až ve velkém měřítku.
* **Zesílení bezpečnosti**: Přidání dalších bezpečnostních vrstev specifických pro zpracování e-mailů a ochranu uživatelských dat.

Tato práce představuje tisíce hodin vývoje nad rámec samotných základních balíčků, což vede k robustní a bezpečné e-mailové službě, která využívá to nejlepší z našich open source příspěvků.

### Zpětná vazba {#the-feedback-loop}

Možná nejcennějším aspektem používání našich vlastních balíčků v produkci je zpětná vazba, kterou to vytváří. Když narazíme na omezení nebo okrajové případy ve Forward Email, neřešíme je pouze lokálně – zlepšujeme základní balíčky, což prospívá jak naší službě, tak širší komunitě.

Tento přístup vedl k mnoha vylepšením:

* **Graceful Shutdown v Bree**: Potřeba Forward Email pro nasazení bez výpadků vedla k vylepšeným schopnostem elegantního ukončení v Bree.
* **Rozpoznávání vzorů ve Spam Scanneru**: Reálné spamové vzory zachycené ve Forward Email ovlivnily detekční algoritmy Spam Scanneru.
* **Optimalizace výkonu v Cabinu**: Vysoký objem logování v produkci odhalil možnosti optimalizace v Cabinu, které prospívají všem uživatelům.

Udržováním tohoto ctnostného cyklu mezi naší open source prací a produkční službou zajišťujeme, že naše balíčky zůstávají praktickými, v boji prověřenými řešeními, nikoli teoretickými implementacemi.


## Základní principy Forward Email: Základ pro excelenci {#forward-emails-core-principles-a-foundation-for-excellence}

Forward Email je navržen podle sady základních principů, které řídí všechna naše vývojová rozhodnutí. Tyto principy, podrobně popsány na naší [webové stránce](/blog/docs/best-quantum-safe-encrypted-email-service#principles), zajišťují, že naše služba zůstává přívětivá pro vývojáře, bezpečná a zaměřená na ochranu soukromí uživatelů.

### Vždy přívětivý pro vývojáře, zaměřený na bezpečnost a transparentní {#always-developer-friendly-security-focused-and-transparent}

Naším prvním a nejdůležitějším principem je vytvářet software, který je přívětivý pro vývojáře a zároveň udržuje nejvyšší standardy bezpečnosti a soukromí. Věříme, že technická dokonalost by nikdy neměla být na úkor použitelnosti a že transparentnost buduje důvěru v naší komunitu.

Tento princip se projevuje v naší podrobné dokumentaci, jasných chybových hlášeních a otevřené komunikaci o úspěších i výzvách. Tím, že celý náš kód zpřístupňujeme jako open source, zveme k přezkoumání a spolupráci, což posiluje jak náš software, tak širší ekosystém.

### Dodržování osvědčených principů vývoje softwaru {#adherence-to-time-tested-software-development-principles}

Řídíme se několika zavedenými principy vývoje softwaru, které se osvědčily během desetiletí:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: Oddělení zodpovědností pomocí vzoru Model-View-Controller
* **[Unix filozofie](https://en.wikipedia.org/wiki/Unix_philosophy)**: Vytváření modulárních komponent, které dělají jednu věc dobře
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Držet to jednoduché a přímočaré
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Nepřepisuj se, podporující opětovné použití kódu
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: Nebudeš to potřebovat, vyhýbání se předčasné optimalizaci
* **[Twelve Factor](https://12factor.net/)**: Dodržování osvědčených postupů pro tvorbu moderních, škálovatelných aplikací
* **[Occamova břitva](https://en.wikipedia.org/wiki/Occam%27s_razor)**: Volba nejjednoduššího řešení, které splňuje požadavky
* **[Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Intenzivní používání vlastních produktů
Tyto principy nejsou jen teoretické koncepty – jsou zakotveny v našich každodenních vývojových postupech. Například naše dodržování unixové filozofie je patrné v tom, jak jsme strukturovali naše npm balíčky: malé, zaměřené moduly, které lze složit dohromady k řešení složitých problémů.

### Cílení na houževnatého, samofinancovaného vývojáře {#targeting-the-scrappy-bootstrapped-developer}

Specificky cílíme na houževnatého, samofinancovaného a [ramen-profitable](https://www.paulgraham.com/ramenprofitable.html) vývojáře. Tento fokus formuje vše od našeho cenového modelu až po naše technická rozhodnutí. Rozumíme výzvám budování produktů s omezenými zdroji, protože jsme si tím sami prošli.

Tento princip je obzvlášť důležitý v našem přístupu k open source. Vytváříme a udržujeme balíčky, které řeší skutečné problémy vývojářů bez podnikových rozpočtů, čímž zpřístupňujeme výkonné nástroje všem bez ohledu na jejich zdroje.

### Principy v praxi: Kódová základna Forward Email {#principles-in-practice-the-forward-email-codebase}

Tyto principy jsou jasně viditelné v kódové základně Forward Email. Náš soubor package.json odhaluje promyšlený výběr závislostí, z nichž každá byla vybrána tak, aby odpovídala našim základním hodnotám:

* Bezpečnostně zaměřené balíčky jako `mailauth` pro autentizaci e-mailů
* Vývojářsky přívětivé nástroje jako `preview-email` pro snadnější ladění
* Modulární komponenty jako různé utility `p-*` od Sindre Sorhuse

Díky důslednému dodržování těchto principů v průběhu času jsme vybudovali službu, které vývojáři mohou důvěřovat se svou e-mailovou infrastrukturou – bezpečnou, spolehlivou a v souladu s hodnotami open source komunity.

### Ochrana soukromí již v návrhu {#privacy-by-design}

Ochrana soukromí není pro Forward Email dodatečná myšlenka nebo marketingová funkce – je to základní princip návrhu, který ovlivňuje každý aspekt naší služby a kódu:

* **Šifrování bez přístupu**: Implementovali jsme systémy, které nám technicky znemožňují číst uživatelské e-maily.
* **Minimální sběr dat**: Sbíráme pouze data nezbytná pro poskytování naší služby, nic navíc.
* **Transparentní zásady**: Naše zásady ochrany soukromí jsou napsány jasným, srozumitelným jazykem bez právnického žargonu.
* **Ověření open source**: Naše open source kódová základna umožňuje bezpečnostním výzkumníkům ověřit naše tvrzení o ochraně soukromí.

Tento závazek se vztahuje i na naše open source balíčky, které jsou navrženy s bezpečnostními a soukromí podporujícími nejlepšími praktikami již od základu.

### Udržitelný open source {#sustainable-open-source}

Věříme, že open source software potřebuje udržitelné modely, aby mohl dlouhodobě prosperovat. Náš přístup zahrnuje:

* **Komerční podpora**: Nabízíme prémiovou podporu a služby kolem našich open source nástrojů.
* **Vyvážené licencování**: Používáme licence, které chrání jak svobody uživatelů, tak udržitelnost projektu.
* **Zapojení komunity**: Aktivně spolupracujeme s přispěvateli, abychom vybudovali podpůrnou komunitu.
* **Transparentní plány vývoje**: Sdílíme naše plány vývoje, aby uživatelé mohli plánovat dopředu.

Zaměřením na udržitelnost zajišťujeme, že naše open source příspěvky mohou nadále růst a zlepšovat se v průběhu času, místo aby upadly v zapomnění.


## Čísla nelžou: Naše ohromující statistiky stažení npm {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

Když mluvíme o dopadu open source softwaru, statistiky stažení poskytují hmatatelnou míru adopce a důvěry. Mnoho balíčků, které pomáháme udržovat, dosáhlo rozsahu, kterého jen málo open source projektů kdy dosáhne, s celkovým počtem stažení v miliardách.

![Top npm Packages by Downloads](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> I když jsme hrdí na to, že pomáháme udržovat několik vysoce stahovaných balíčků v ekosystému JavaScriptu, chceme uznat, že mnoho z těchto balíčků původně vytvořili jiní talentovaní vývojáři. Balíčky jako superagent a supertest původně vytvořil TJ Holowaychuk, jehož plodné příspěvky do open source byly zásadní pro formování ekosystému Node.js.
### Přehled našeho dopadu {#a-birds-eye-view-of-our-impact}

Za pouhé dvouměsíční období od února do března 2025 zaznamenaly nejvýznamnější balíčky, na kterých se podílíme a které pomáháme udržovat, ohromující počet stažení:

* **[superagent](https://www.npmjs.com/package/superagent)**: 84 575 829 stažení\[^7] (původně vytvořil TJ Holowaychuk)
* **[supertest](https://www.npmjs.com/package/supertest)**: 76 432 591 stažení\[^8] (původně vytvořil TJ Holowaychuk)
* **[koa](https://www.npmjs.com/package/koa)**: 28 539 295 stažení\[^34] (původně vytvořil TJ Holowaychuk)
* **[@koa/router](https://www.npmjs.com/package/@koa/router)**: 11 007 327 stažení\[^35]
* **[koa-router](https://www.npmjs.com/package/koa-router)**: 3 498 918 stažení\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)**: 2 819 520 stažení\[^37]
* **[preview-email](https://www.npmjs.com/package/preview-email)**: 2 500 000 stažení\[^9]
* **[cabin](https://www.npmjs.com/package/cabin)**: 1 800 000 stažení\[^10]
* **[@breejs/later](https://www.npmjs.com/package/@breejs/later)**: 1 709 938 stažení\[^38]
* **[email-templates](https://www.npmjs.com/package/email-templates)**: 1 128 139 stažení\[^39]
* **[get-paths](https://www.npmjs.com/package/get-paths)**: 1 124 686 stažení\[^40]
* **[url-regex-safe](https://www.npmjs.com/package/url-regex-safe)**: 1 200 000 stažení\[^11]
* **[dotenv-parse-variables](https://www.npmjs.com/package/dotenv-parse-variables)**: 894 666 stažení\[^41]
* **[@koa/multer](https://www.npmjs.com/package/@koa/multer)**: 839 585 stažení\[^42]
* **[spamscanner](https://www.npmjs.com/package/spamscanner)**: 145 000 stažení\[^12]
* **[bree](https://www.npmjs.com/package/bree)**: 24 270 stažení\[^30]

> \[!NOTE]
> Několik dalších balíčků, které pomáháme udržovat, ale nevytvořili jsme je, má ještě vyšší počet stažení, včetně `form-data` (738M+ stažení), `toidentifier` (309M+ stažení), `stackframe` (116M+ stažení) a `error-stack-parser` (113M+ stažení). Je pro nás ctí přispívat do těchto balíčků a zároveň respektovat práci jejich původních autorů.

Nejde jen o působivá čísla — představují skutečné vývojáře řešící skutečné problémy s kódem, který pomáháme udržovat. Každé stažení je příležitostí, kdy tyto balíčky pomohly někomu vytvořit něco smysluplného, od hobby projektů až po podnikové aplikace používané miliony.

![Package Categories Distribution](/img/art/category_pie_chart.svg)

### Denní dopad v rozsahu {#daily-impact-at-scale}

Denní vzory stahování odhalují konzistentní, vysoký objem používání, s vrcholy dosahujícími milionů stažení za den\[^13]. Tato konzistence svědčí o stabilitě a spolehlivosti těchto balíčků — vývojáři je nejen zkouší; integrují je do svých hlavních pracovních postupů a spoléhají na ně den co den.

Týdenní vzory stahování ukazují ještě působivější čísla, která se stabilně pohybují kolem desítek milionů stažení týdně\[^14]. To představuje obrovskou stopu v ekosystému JavaScriptu, přičemž tyto balíčky běží v produkčních prostředích po celém světě.

### Za hranicí čistých čísel {#beyond-the-raw-numbers}

I když jsou statistiky stažení samy o sobě působivé, vyprávějí hlubší příběh o důvěře, kterou komunita těmto balíčkům věnuje. Údržba balíčků v takovém rozsahu vyžaduje neochvějný závazek k:

* **Zpětné kompatibilitě**: Změny musí být pečlivě zváženy, aby nedošlo k narušení stávajících implementací.
* **Bezpečnosti**: S miliony aplikací závislých na těchto balíčcích by bezpečnostní zranitelnosti mohly mít dalekosáhlé důsledky.
* **Výkonu**: V takovém rozsahu mohou i drobná zlepšení výkonu přinést významné kumulativní přínosy.
* **Dokumentaci**: Jasná, komplexní dokumentace je nezbytná pro balíčky používané vývojáři všech úrovní zkušeností.

Konzistentní růst počtu stažení v průběhu času odráží úspěch v plnění těchto závazků a budování důvěry s vývojářskou komunitou prostřednictvím spolehlivých, dobře udržovaných balíčků.
## Podpora ekosystému: Naše sponzorství open source projektů {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> Udržitelnost open source není jen o přispívání kódu — je to také o podpoře vývojářů, kteří udržují kritickou infrastrukturu.

Kromě našich přímých příspěvků do JavaScriptového ekosystému jsme hrdí na to, že sponzorujeme významné přispěvatele do Node.js, jejichž práce tvoří základ mnoha moderních aplikací. Naše sponzorství zahrnují:

### Andris Reinman: Průkopník e-mailové infrastruktury {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) je tvůrcem [Nodemailer](https://github.com/nodemailer/nodemailer), nejpopulárnější knihovny pro odesílání e-mailů v Node.js s více než 14 miliony týdenních stažení\[^15]. Jeho práce zahrnuje i další klíčové komponenty e-mailové infrastruktury jako [SMTP Server](https://github.com/nodemailer/smtp-server), [Mailparser](https://github.com/nodemailer/mailparser) a [WildDuck](https://github.com/nodemailer/wildduck).

Naše sponzorství pomáhá zajistit pokračující údržbu a vývoj těchto nezbytných nástrojů, které pohánějí e-mailovou komunikaci pro nespočet Node.js aplikací, včetně naší vlastní služby Forward Email.

### Sindre Sorhus: Mistr utilitárních balíčků {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus) je jedním z nejplodnějších přispěvatelů do open source v JavaScriptovém ekosystému, s více než 1 000 balíčky na npm na svém kontě. Jeho utility jako [p-map](https://github.com/sindresorhus/p-map), [p-retry](https://github.com/sindresorhus/p-retry) a [is-stream](https://github.com/sindresorhus/is-stream) jsou základními stavebními kameny používanými v celém Node.js ekosystému.

Sponzorováním Sindrovy práce pomáháme udržet vývoj těchto klíčových utilit, které činí vývoj v JavaScriptu efektivnějším a spolehlivějším.

Tato sponzorství odrážejí náš závazek k širšímu open source ekosystému. Uvědomujeme si, že náš vlastní úspěch je postaven na základech položených těmito a dalšími přispěvateli, a jsme odhodláni zajistit udržitelnost celého ekosystému.


## Odhalování bezpečnostních zranitelností v JavaScriptovém ekosystému {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

Náš závazek k open source přesahuje vývoj funkcí a zahrnuje identifikaci a řešení bezpečnostních zranitelností, které by mohly ovlivnit miliony vývojářů. Několik našich nejvýznamnějších příspěvků do JavaScriptového ekosystému bylo v oblasti bezpečnosti.

### Záchrana Koa-Routeru {#the-koa-router-rescue}

V únoru 2019 Nick identifikoval kritický problém s údržbou populárního balíčku koa-router. Jak [ohlásil na Hacker News](https://news.ycombinator.com/item?id=19156707), balíček byl opuštěn svým původním správcem, což vedlo k neřešeným bezpečnostním zranitelnostem a komunitě bez aktualizací.

> \[!WARNING]
> Opuštěné balíčky s bezpečnostními zranitelnostmi představují významná rizika pro celý ekosystém, zvláště když jsou stahovány miliony krát týdně.

Na reakci Nick vytvořil [@koa/router](https://github.com/koajs/router) a pomohl komunitě situaci oznámit. Od té doby tento kritický balíček udržuje, aby uživatelé Koa měli bezpečné a dobře udržované řešení směrování.

### Řešení zranitelností ReDoS {#addressing-redos-vulnerabilities}

V roce 2020 Nick identifikoval a vyřešil kritickou zranitelnost [Regular Expression Denial of Service (ReDoS)](https://en.wikipedia.org/wiki/ReDoS) v široce používaném balíčku `url-regex`. Tato zranitelnost ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) mohla umožnit útočníkům způsobit odmítnutí služby zadáním speciálně vytvořeného vstupu, který způsobil katastrofální zpětné sledování v regulárním výrazu.

Místo pouhého záplatu stávajícího balíčku Nick vytvořil [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), zcela přepsanou implementaci, která řeší zranitelnost a zároveň zachovává kompatibilitu s původním API. Také publikoval [komplexní blogový příspěvek](/blog/docs/url-regex-javascript-node-js), který vysvětluje zranitelnost a jak ji zmírnit.
Tato práce ukazuje náš přístup k bezpečnosti: nejen řešení problémů, ale také vzdělávání komunity a poskytování robustních alternativ, které zabraňují podobným problémům v budoucnu.

### Prosazování bezpečnosti Node.js a Chromia {#advocating-for-nodejs-and-chromium-security}

Nick byl také aktivní v prosazování zlepšení bezpečnosti v širším ekosystému. V srpnu 2020 identifikoval významný bezpečnostní problém v Node.js související s jeho zpracováním HTTP hlaviček, který byl popsán v [The Register](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/).

Tento problém, který vycházel z opravy v Chromiu, mohl potenciálně umožnit útočníkům obejít bezpečnostní opatření. Nickovo prosazování pomohlo zajistit, že byl problém rychle vyřešen, čímž ochránil miliony aplikací Node.js před možným zneužitím.

### Zajištění infrastruktury npm {#securing-npm-infrastructure}

Později téhož měsíce Nick identifikoval další kritický bezpečnostní problém, tentokrát v e-mailové infrastruktuře npm. Jak bylo uvedeno v [The Register](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/), npm správně neimplementovalo autentizační protokoly DMARC, SPF a DKIM, což mohlo útočníkům umožnit odesílat phishingové e-maily, které vypadaly, že pocházejí od npm.

Nickova zpráva vedla ke zlepšení bezpečnostního postavení e-mailů npm, čímž ochránila miliony vývojářů, kteří spoléhají na npm pro správu balíčků, před možnými phishingovými útoky.


## Naše příspěvky do ekosystému Forward Email {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Email je postaven na několika klíčových open source projektech, včetně Nodemailer, WildDuck a mailauth. Náš tým významně přispěl k těmto projektům, pomáhajíc identifikovat a opravit hluboké problémy, které ovlivňují doručování a bezpečnost e-mailů.

### Vylepšení základní funkčnosti Nodemaileru {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) je páteří odesílání e-mailů v Node.js a naše příspěvky pomohly učinit jej robustnějším:

* **Vylepšení SMTP serveru**: Opravili jsme chyby v parsování, problémy se zpracováním streamů a konfigurací TLS v komponentě SMTP serveru\[^16]\[^17].
* **Vylepšení mail parseru**: Řešili jsme chyby dekódování znakových sekvencí a problémy s parserem adres, které mohly způsobit selhání zpracování e-mailů\[^18]\[^19].

Tyto příspěvky zajišťují, že Nodemailer zůstává spolehlivým základem pro zpracování e-mailů v aplikacích Node.js, včetně Forward Email.

### Pokrok v autentizaci e-mailů s Mailauth {#advancing-email-authentication-with-mailauth}

[Mailauth](https://github.com/postalsys/mailauth) poskytuje klíčovou funkčnost autentizace e-mailů a naše příspěvky výrazně zlepšily jeho schopnosti:

* **Vylepšení ověřování DKIM**: Objevili jsme a nahlásili jsme, že X/Twitter měl problémy s DNS cache, které způsobovaly selhání DKIM pro jejich odchozí zprávy, a nahlásili jsme to na Hacker One\[^20].
* **Vylepšení DMARC a ARC**: Opravili jsme problémy s ověřováním DMARC a ARC, které mohly vést k nesprávným výsledkům autentizace\[^21]\[^22].
* **Optimalizace výkonu**: Přispěli jsme optimalizacemi, které zlepšují výkon procesů autentizace e-mailů\[^23]\[^24]\[^25]\[^26].

Tato vylepšení pomáhají zajistit, že autentizace e-mailů je přesná a spolehlivá, čímž chrání uživatele před phishingem a spoofingem.

### Klíčová vylepšení Upptime {#key-upptime-enhancements}

Naše příspěvky do Upptime zahrnují:

* **Monitorování SSL certifikátů**: Přidali jsme funkci pro sledování expirace SSL certifikátů, čímž se zabránilo neočekávaným výpadkům kvůli expirovaným certifikátům\[^27].
* **Podpora více SMS čísel**: Implementovali jsme podporu pro upozornění více členů týmu přes SMS při výskytu incidentů, což zlepšuje reakční časy\[^28].
* **Opravy kontroly IPv6**: Opravili jsme problémy s kontrolou konektivity IPv6, čímž jsme zajistili přesnější monitorování v moderních síťových prostředích\[^29].
* **Podpora tmavého/světlého režimu**: Přidali jsme podporu témat pro zlepšení uživatelského zážitku na stránkách stavu\[^31].
* **Lepší podpora TCP-Ping**: Vylepšili jsme funkčnost TCP ping pro spolehlivější testování připojení\[^32].
Tyto vylepšení nejenže zlepšují monitorování stavu Forward Email, ale jsou k dispozici celé komunitě uživatelů Upptime, což demonstruje náš závazek ke zlepšování nástrojů, na kterých závisíme.


## Lepidlo, které vše drží pohromadě: Vlastní kód v rozsahu {#the-glue-that-holds-it-all-together-custom-code-at-scale}

I když jsou naše npm balíčky a příspěvky do existujících projektů významné, právě vlastní kód, který tyto komponenty integruje, skutečně ukazuje naše technické znalosti. Kódová základna Forward Email představuje desetiletí vývojové práce, sahající až do roku 2017, kdy projekt začal jako [free-email-forwarding](https://github.com/forwardemail/free-email-forwarding), než byl sloučen do monorepa.

### Obrovské vývojové úsilí {#a-massive-development-effort}

Rozsah tohoto vlastního integračního kódu je impozantní:

* **Celkové příspěvky**: Více než 3 217 commitů
* **Velikost kódové základny**: Více než 421 545 řádků kódu v souborech JavaScript, Pug, CSS a JSON\[^33]

To představuje tisíce hodin vývojové práce, ladění a optimalizace výkonu. Je to „tajná přísada“, která proměňuje jednotlivé balíčky v soudržnou, spolehlivou službu, kterou denně používají tisíce zákazníků.

### Integrace klíčových závislostí {#core-dependencies-integration}

Kódová základna Forward Email integruje řadu závislostí do bezproblémového celku:

* **Zpracování e-mailů**: Integruje Nodemailer pro odesílání, SMTP Server pro příjem a Mailparser pro parsování
* **Autentizace**: Používá Mailauth pro ověřování DKIM, SPF, DMARC a ARC
* **DNS resoluce**: Využívá Tangerine pro DNS-over-HTTPS s globálním cachováním
* **MX připojení**: Využívá mx-connect s integrací Tangerine pro spolehlivá připojení k mailovým serverům
* **Plánování úloh**: Používá Bree pro spolehlivé zpracování úloh na pozadí s worker threads
* **Šablonování**: Používá email-templates pro opětovné použití stylů z webu v komunikaci se zákazníky
* **Ukládání e-mailů**: Implementuje individuálně šifrované SQLite schránky pomocí better-sqlite3-multiple-ciphers s šifrováním ChaCha20-Poly1305 pro kvantově bezpečné soukromí, zajišťující úplnou izolaci mezi uživateli a že pouze uživatel má přístup ke své schránce

Každá z těchto integrací vyžaduje pečlivé zvážení okrajových případů, dopadů na výkon a bezpečnostních aspektů. Výsledkem je robustní systém, který spolehlivě zpracovává miliony e-mailových transakcí. Naše implementace SQLite také využívá msgpackr pro efektivní binární serializaci a WebSockets (pomocí ws) pro aktualizace stavu v reálném čase napříč naší infrastrukturou.

### DNS infrastruktura s Tangerine a mx-connect {#dns-infrastructure-with-tangerine-and-mx-connect}

Klíčovou součástí infrastruktury Forward Email je náš systém DNS resoluce, postavený kolem dvou klíčových balíčků:

* **[Tangerine](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: Naše Node.js implementace DNS-over-HTTPS poskytuje náhradu za standardní DNS resolver s vestavěnými opakováními, timeouty, chytrou rotací serverů a podporou cachování.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: Tento balíček navazuje TCP spojení na MX servery, přijímá cílovou doménu nebo e-mailovou adresu, vyhledává vhodné MX servery a připojuje se k nim podle priority.

Tangerine jsme integrovali s mx-connect prostřednictvím [pull requestu #4](https://github.com/zone-eu/mx-connect/pull/4), čímž zajišťujeme DNS přes HTTP požadavky na aplikační vrstvě v celém Forward Email. To poskytuje globální cachování DNS v rozsahu s 1:1 konzistencí napříč jakýmkoli regionem, aplikací nebo procesem — což je klíčové pro spolehlivé doručování e-mailů v distribuovaném systému.


## Dopad na podnikání: Od open source k řešením kritickým pro mise {#enterprise-impact-from-open-source-to-mission-critical-solutions}

Vyvrcholením našeho desetiletého vývoje v open source je to, že Forward Email slouží nejen jednotlivým vývojářům, ale také velkým podnikům a vzdělávacím institucím, které tvoří páteř samotného open source hnutí.
### Případové studie v infrastruktuře e-mailů kritických pro mise {#case-studies-in-mission-critical-email-infrastructure}

Naše závazek k spolehlivosti, ochraně soukromí a principům open source učinil z Forward Email důvěryhodnou volbu pro organizace s náročnými požadavky na e-mail:

* **Vzdělávací instituce**: Jak je podrobně popsáno v naší [případové studii přesměrování e-mailů absolventů](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study), velké univerzity spoléhají na naši infrastrukturu, aby udržely celoživotní spojení se stovkami tisíc absolventů prostřednictvím spolehlivých služeb přesměrování e-mailů.

* **Podniková řešení Linuxu**: [Případová studie podnikových e-mailů Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) ukazuje, jak náš open source přístup dokonale odpovídá potřebám poskytovatelů podnikových Linuxových řešení, nabízejíc jim transparentnost a kontrolu, kterou vyžadují.

* **Open Source nadace**: Asi nejvíce potvrzující je naše partnerství s Linux Foundation, jak je zdokumentováno v [případové studii podnikových e-mailů Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study), kde naše služba zajišťuje komunikaci pro samotnou organizaci, která spravuje vývoj Linuxu.

Existuje krásná symetrie v tom, jak naše open source balíčky, pečlivě udržované po mnoho let, umožnily vybudovat e-mailovou službu, která nyní podporuje právě ty komunity a organizace, které prosazují open source software. Tato cesta v plném kruhu – od přispívání jednotlivých balíčků až po napájení podnikové e-mailové infrastruktury pro lídry open source – představuje konečné potvrzení našeho přístupu k vývoji softwaru.


## Deset let open source: Pohled do budoucna {#a-decade-of-open-source-looking-forward}

Když se ohlížíme za deseti lety přispívání do open source a zároveň hledíme na dalších deset let, jsme plni vděčnosti za komunitu, která nás podporovala, a nadšení pro to, co přijde.

Naše cesta od přispěvatelů jednotlivých balíčků k správcům komplexní e-mailové infrastruktury používané velkými podniky a open source nadacemi byla pozoruhodná. Je to důkaz síly open source vývoje a dopadu, jaký může mít promyšlený, dobře udržovaný software na širší ekosystém.

V nadcházejících letech se zavazujeme:

* **Pokračovat v údržbě a zlepšování našich stávajících balíčků**, aby zůstaly spolehlivými nástroji pro vývojáře po celém světě.
* **Rozšiřovat naše příspěvky do kritických infrastrukturních projektů**, zejména v oblasti e-mailů a bezpečnosti.
* **Zlepšovat schopnosti Forward Email** při zachování našeho závazku k ochraně soukromí, bezpečnosti a transparentnosti.
* **Podporovat další generaci open source přispěvatelů** prostřednictvím mentorství, sponzorství a zapojení komunity.

Věříme, že budoucnost vývoje softwaru je otevřená, spolupracující a postavená na základech důvěry. Pokračováním v přispívání vysoce kvalitních balíčků zaměřených na bezpečnost do JavaScriptového ekosystému doufáme, že sehráváme malou roli při budování této budoucnosti.

Děkujeme všem, kteří používali naše balíčky, přispívali do našich projektů, hlásili problémy nebo jednoduše šířili povědomí o naší práci. Vaše podpora umožnila tento desetiletý dopad a těšíme se, co společně dokážeme v dalších deseti letech.

\[^1]: statistiky stažení npm pro cabin, duben 2025  
\[^2]: statistiky stažení npm pro bson-objectid, únor-březen 2025  
\[^3]: statistiky stažení npm pro url-regex-safe, duben 2025  
\[^4]: počet hvězd na GitHubu pro forwardemail/forwardemail.net k dubnu 2025  
\[^5]: statistiky stažení npm pro preview-email, duben 2025  
\[^7]: statistiky stažení npm pro superagent, únor-březen 2025  
\[^8]: statistiky stažení npm pro supertest, únor-březen 2025  
\[^9]: statistiky stažení npm pro preview-email, únor-březen 2025  
\[^10]: statistiky stažení npm pro cabin, únor-březen 2025  
\[^11]: statistiky stažení npm pro url-regex-safe, únor-březen 2025  
\[^12]: statistiky stažení npm pro spamscanner, únor-březen 2025  
\[^13]: denní vzory stahování ze statistik npm, duben 2025  
\[^14]: týdenní vzory stahování ze statistik npm, duben 2025  
\[^15]: statistiky stažení npm pro nodemailer, duben 2025  
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
\[^27]: Na základě GitHub issues v repozitáři Upptime  
\[^28]: Na základě GitHub issues v repozitáři Upptime  
\[^29]: Na základě GitHub issues v repozitáři Upptime  
\[^30]: statistiky stažení npm pro bree, únor-březen 2025  
\[^31]: Na základě GitHub pull requestů do Upptime  
\[^32]: Na základě GitHub pull requestů do Upptime  
\[^34]: statistiky stažení npm pro koa, únor-březen 2025  
\[^35]: statistiky stažení npm pro @koa/router, únor-březen 2025  
\[^36]: statistiky stažení npm pro koa-router, únor-březen 2025  
\[^37]: statistiky stažení npm pro url-regex, únor-březen 2025  
\[^38]: statistiky stažení npm pro @breejs/later, únor-březen 2025  
\[^39]: statistiky stažení npm pro email-templates, únor-březen 2025  
\[^40]: statistiky stažení npm pro get-paths, únor-březen 2025  
\[^41]: statistiky stažení npm pro dotenv-parse-variables, únor-březen 2025  
\[^42]: statistiky stažení npm pro @koa/multer, únor-březen 2025
