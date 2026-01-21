# E-mail s vlastním hostingem: Závazek k open source {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="Self-hosted email solution illustration" class="rounded-lg" />

## Obsah {#table-of-contents}

* [Předmluva](#foreword)
* [Proč záleží na vlastním hostování e-mailů](#why-self-hosted-email-matters)
  * [Problém s tradičními e-mailovými službami](#the-problem-with-traditional-email-services)
  * [Alternativa k vlastnímu hostování](#the-self-hosted-alternative)
* [Naše implementace hostovaná na vlastních serverech: Technický přehled](#our-self-hosted-implementation-technical-overview)
  * [Architektura založená na Dockeru pro jednoduchost a přenositelnost](#docker-based-architecture-for-simplicity-and-portability)
  * [Instalace bash skriptu: Přístupnost se setkává s bezpečností](#bash-script-installation-accessibility-meets-security)
  * [Kvantově bezpečné šifrování pro soukromí připravené na budoucnost](#quantum-safe-encryption-for-future-proof-privacy)
  * [Automatizovaná údržba a aktualizace](#automated-maintenance-and-updates)
* [Závazek k open-source technologiím](#the-open-source-commitment)
* [Samostatně hostované vs. spravované: Jak se správně rozhodnout](#self-hosted-vs-managed-making-the-right-choice)
  * [Realita samoobslužného hostování e-mailů](#the-reality-of-self-hosting-email)
  * [Kdy si vybrat naši spravovanou službu](#when-to-choose-our-managed-service)
* [Začínáme s vlastním hostováním přeposílaných e-mailů](#getting-started-with-self-hosted-forward-email)
  * [Systémové požadavky](#system-requirements)
  * [Kroky instalace](#installation-steps)
* [Budoucnost samoobslužného e-mailu](#the-future-of-self-hosted-email)
* [Závěr: Svoboda e-mailů pro každého](#conclusion-email-freedom-for-everyone)
* [Reference](#references)

## Předmluva {#foreword}

V dnešní digitální krajině zůstává e-mail páteří naší online identity a komunikace. S rostoucími obavami o soukromí však mnoho uživatelů čelí obtížné volbě: pohodlí na úkor soukromí, nebo soukromí na úkor pohodlí. Ve Forward Email jsme vždy věřili, že byste si mezi těmito dvěma možnostmi neměli muset vybírat.

Dnes s radostí oznamujeme významný milník na naší cestě: spuštění našeho samohostovaného e-mailového řešení. Tato funkce představuje náš nejhlubší závazek k principům open source, designu zaměřenému na soukromí a posílení postavení uživatelů. Díky naší možnosti samohostování vám dáváme plnou moc a kontrolu nad vaší e-mailovou komunikací přímo do rukou.

Tento blogový příspěvek zkoumá filozofii našeho samohostovaného řešení, jeho technickou implementaci a proč je důležité pro uživatele, kteří ve své digitální komunikaci upřednostňují soukromí i vlastnictví.

## Proč je důležitý samoobslužný e-mail {#why-self-hosted-email-matters}

Naše samoobslužné e-mailové řešení je nejjasnějším vyjádřením našeho přesvědčení, že skutečné soukromí znamená kontrolu a kontrola začíná u open source. Pro uživatele, kteří požadují plné vlastnictví nad svou digitální komunikací, již samoobslužný hosting není jen okrajovou myšlenkou – je to základní právo. Jsme hrdí na to, že si za tímto přesvědčením stojíme s plně otevřenou a ověřitelnou platformou, kterou můžete provozovat podle svých vlastních podmínek.

### Problém s tradičními e-mailovými službami {#the-problem-with-traditional-email-services}

Tradiční e-mailové služby představují pro uživatele, kteří dbá na soukromí, několik zásadních výzev:

1. **Požadavky na důvěryhodnost**: Musíte důvěřovat poskytovateli, že nebude přistupovat k vašim datům, analyzovat je ani je sdílet.
2. **Centralizované řízení**: Váš přístup může být kdykoli a z jakéhokoli důvodu odvolán.
3. **Zranitelnost sledování**: Centralizované služby jsou hlavním cílem sledování.
4. **Omezená transparentnost**: Většina služeb používá proprietární software s uzavřeným zdrojovým kódem.
5. **Uzamčení dodavatele**: Migrace od těchto služeb může být obtížná nebo nemožná.

Dokonce i poskytovatelé e-mailů „zaměření na soukromí“ často selhávají tím, že open-source poskytují pouze své frontendové aplikace, zatímco backendové systémy ponechávají proprietární a uzavřené. To vytváří značnou mezeru v důvěře – jste nuceni věřit jejich slibům ohledně soukromí, aniž byste si je mohli ověřit.

### Alternativa k vlastnímu hostování {#the-self-hosted-alternative}

Samostatné hostování e-mailů nabízí zásadně odlišný přístup:

1. **Úplná kontrola**: Celou e-mailovou infrastrukturu vlastníte a ovládáte.
2. **Ověřitelné soukromí**: Celý systém je transparentní a auditovatelný.
3. **Není vyžadována žádná důvěra**: Nemusíte svěřovat svou komunikaci třetí straně.
4. **Svoboda přizpůsobení**: Přizpůsobte si systém svým specifickým potřebám.
5. **Odolnost**: Vaše služba je nadále poskytována bez ohledu na rozhodnutí jakékoli společnosti.

Jak to vyjádřil jeden uživatel: „Vlastní hosting mého e-mailu je digitálním ekvivalentem pěstování vlastních potravin – vyžaduje to více práce, ale přesně vím, co to obsahuje.“

## Naše implementace hostovaná na vlastním serveru: Technický přehled {#our-self-hosted-implementation-technical-overview}

Naše samoobslužné e-mailové řešení je postaveno na stejných principech ochrany osobních údajů, které jsou základem všech našich produktů. Pojďme se podívat na technickou implementaci, která to umožňuje.

### Architektura založená na Dockeru pro jednoduchost a přenositelnost {#docker-based-architecture-for-simplicity-and-portability}

Celou naši e-mailovou infrastrukturu jsme zabalili pomocí Dockeru, takže ji lze snadno nasadit prakticky na jakýkoli systém založený na Linuxu. Tento kontejnerizovaný přístup nabízí několik klíčových výhod:

1. **Zjednodušené nasazení**: Jediný příkaz nastaví celou infrastrukturu
2. **Konzistentní prostředí**: Eliminuje problémy typu „funguje na mém počítači“
3. **Izolované komponenty**: Každá služba běží ve vlastním kontejneru z důvodu zabezpečení
4. **Snadné aktualizace**: Jednoduché příkazy pro aktualizaci celého stacku
5. **Minimální závislosti**: Vyžaduje pouze Docker a Docker Compose

Architektura zahrnuje kontejnery pro:

* Webové rozhraní pro administraci
* SMTP server pro odchozí e-maily
* IMAP/POP3 servery pro načítání e-mailů
* CalDAV server pro kalendáře
* CardDAV server pro kontakty
* Databáze pro ukládání konfigurace
* Redis pro ukládání do mezipaměti a výkon
* SQLite pro bezpečné a šifrované ukládání poštovních schránek

> \[!NOTE]
> Nezapomeňte se podívat na naši [průvodce pro vývojáře s vlastním hostingem](https://forwardemail.net/self-hosted)

### Instalace bash skriptu: Přístupnost se setkává se zabezpečením {#bash-script-installation-accessibility-meets-security}

Proces instalace jsme navrhli tak, aby byl co nejjednodušší a zároveň dodržoval osvědčené bezpečnostní postupy:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

Tento jediný příkaz:

1. Ověřuje systémové požadavky
2. Provede vás konfigurací
3. Nastavuje záznamy DNS
4. Konfiguruje certifikáty TLS
5. Nasazuje kontejnery Docker
6. Provádí počáteční posílení zabezpečení

Pro ty, kteří se obávají přeposílání skriptů do bash (což by měli mít!), doporučujeme si skript před spuštěním prohlédnout. Je plně open-source a dostupný k nahlédnutí.

### Kvantově bezpečné šifrování pro soukromí připravené na budoucnost {#quantum-safe-encryption-for-future-proof-privacy}

Stejně jako naše hostovaná služba, i naše samohostované řešení implementuje kvantově odolné šifrování s využitím šifry ChaCha20-Poly1305 pro databáze SQLite. Tento přístup chrání vaše e-mailová data nejen před současnými hrozbami, ale i před budoucími útoky kvantových počítačů.

Každá poštovní schránka je uložena ve vlastním šifrovaném souboru databáze SQLite, což zajišťuje úplnou izolaci mezi uživateli – významnou bezpečnostní výhodu oproti tradičním přístupům ke sdíleným databázím.

### Automatizovaná údržba a aktualizace {#automated-maintenance-and-updates}

Přímo do samoobslužného řešení jsme zabudovali komplexní nástroje pro údržbu:

1. **Automatické zálohy**: Plánované zálohy všech důležitých dat
2. **Obnovení certifikátu**: Automatizovaná správa certifikátů Let's Encrypt
3. **Aktualizace systému**: Jednoduchý příkaz pro aktualizaci na nejnovější verzi
4. **Monitorování stavu**: Vestavěné kontroly pro zajištění integrity systému

Tyto nástroje jsou přístupné prostřednictvím jednoduché interaktivní nabídky:

```bash
# script prompt

1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

## Závazek k open-source {#the-open-source-commitment}

Naše e-mailové řešení s vlastním hostingem, stejně jako všechny naše produkty, je 100% open-source – a to jak na frontendu, tak i na backendu. To znamená:

1. **Naprostá transparentnost**: Každý řádek kódu, který zpracovává vaše e-maily, je k dispozici pro veřejnou kontrolu.
2. **Příspěvky komunity**: Kdokoli může přispět vylepšeními nebo opravit problémy.
3. **Zabezpečení prostřednictvím otevřenosti**: Zranitelnosti může identifikovat a opravit globální komunita.
4. **Žádná vázanost na dodavatele**: Nikdy nejste závislí na existenci naší společnosti.

Celá kódová základna je k dispozici na GitHubu na adrese <https://github.com/forwardemail/forwardemail.net>.

## Samostatně hostované vs. spravované: Jak se správně rozhodnout {#self-hosted-vs-managed-making-the-right-choice}

I když jsme hrdí na to, že nabízíme možnost vlastního hostování, uvědomujeme si, že to není ta správná volba pro každého. Vlastní hostování e-mailů s sebou nese skutečné povinnosti a výzvy:

### Realita samoobslužného hostování e-mailů {#the-reality-of-self-hosting-email}

#### Technické aspekty {#technical-considerations}

* **Správa serveru**: Budete muset spravovat VPS nebo dedikovaný server.
* **Konfigurace DNS**: Správné nastavení DNS je zásadní pro doručitelnost.
* **Aktualizace zabezpečení**: Udržování aktuálních bezpečnostních záplat je nezbytné.
* **Správa spamu**: Budete muset spravovat filtrování spamu.
* **Strategie zálohování**: Implementace spolehlivých záloh je vaší odpovědností.

#### Časová investice {#time-investment}

* **Počáteční nastavení**: Čas na nastavení, ověření a přečtení dokumentace
* **Průběžná údržba**: Občasné aktualizace a monitorování
* **Řešení problémů**: Občasný čas na řešení problémů

#### Finanční aspekty {#financial-considerations}

* **Náklady na server**: 5–20 USD/měsíc pro základní VPS
* **Registrace domény**: 10–20 USD/rok
* **Časová hodnota**: Vaše časová investice má skutečnou hodnotu

### Kdy si vybrat naši spravovanou službu {#when-to-choose-our-managed-service}

Pro mnoho uživatelů zůstává naše spravovaná služba tou nejlepší volbou:

1. **Pohodlí**: Zajistíme veškerou údržbu, aktualizace a monitorování.
2. **Spolehlivost**: Využijte výhod naší zavedené infrastruktury a odborných znalostí.
3. **Podpora**: Získejte pomoc, když nastanou problémy.
4. **Dodatelnost**: Využijte naši zavedenou reputaci v oblasti duševního vlastnictví.
5. **Nákladová efektivita**: Když započítáte časové náklady, naše služby jsou často ekonomičtější.

Obě možnosti poskytují stejné výhody v oblasti soukromí a transparentnosti open source – rozdíl je jednoduše v tom, kdo infrastrukturu spravuje.

## Začínáme s samostatně hostovaným přeposílaným e-mailem {#getting-started-with-self-hosted-forward-email}

Jste připraveni převzít kontrolu nad svou e-mailovou infrastrukturou? Zde je návod, jak začít:

### Systémové požadavky {#system-requirements}

* Ubuntu 20.04 LTS nebo novější (doporučeno)
* Minimálně 1 GB RAM (doporučeno 2 GB a více)
* Doporučeno 20 GB úložiště
* Název domény, kterou spravujete
* Veřejná IP adresa s podporou portu 25
* Možnost nastavení [reverzní PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* Podpora IPv4 a IPv6

> \[!TIP]
> Doporučujeme několik poskytovatelů poštovních serverů na adrese <https://forwardemail.net/blog/docs/best-mail-server-providers> (zdroj na adrese <https://github.com/forwardemail/awesome-mail-server-providers>)

### Kroky instalace {#installation-steps}

1. **Spusťte instalační skript**:
```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
   ```

2. **Postupujte podle interaktivních pokynů**:
* Zadejte název vaší domény
* Nakonfigurujte přihlašovací údaje správce
* Nastavte záznamy DNS podle pokynů
* Vyberte preferované možnosti konfigurace

3. **Ověření instalace**:
Po dokončení instalace můžete ověřit, zda vše funguje:
* Kontrola stavu kontejneru: `docker ps`
* Odeslání testovacího e-mailu
* Přihlášení do webového rozhraní

## Budoucnost samoobslužného e-mailu {#the-future-of-self-hosted-email}

Naše řešení s vlastním hostingem je jen začátek. Jsme odhodláni tuto nabídku neustále vylepšovat pomocí:

1. **Vylepšené nástroje pro správu**: Výkonnější webová správa
2. **Další možnosti ověřování**: Včetně podpory hardwarového bezpečnostního klíče
3. **Pokročilé monitorování**: Lepší přehled o stavu a výkonu systému
4. **Nasazení na více serverů**: Možnosti konfigurací s vysokou dostupností
5. **Vylepšení řízená komunitou**: Začlenění příspěvků od uživatelů

## Závěr: Svoboda e-mailu pro každého {#conclusion-email-freedom-for-everyone}

Spuštění našeho samoobslužného e-mailového řešení představuje významný milník v našem poslání poskytovat transparentní e-mailové služby zaměřené na soukromí. Ať už si vyberete naši spravovanou službu nebo samoobslužnou variantu, budete těžit z našeho neochvějného závazku k principům open source a designu kladenému na soukromí přednostně.

E-mail je příliš důležitý na to, aby byl kontrolován uzavřenými, proprietárními systémy, které upřednostňují shromažďování dat před soukromím uživatelů. S řešením hostovaným na vlastní pěst od Forward Email jsme hrdí na to, že nabízíme skutečnou alternativu – takovou, která vám dává plnou kontrolu nad vaší digitální komunikací.

Věříme, že soukromí není jen vlastnost; je to základní právo. A díky naší možnosti vlastního hostování e-mailů toto právo zpřístupňujeme dostupněji než kdykoli předtím.

Jste připraveni převzít kontrolu nad svým e-mailem? [Začněte ještě dnes](https://forwardemail.net/self-hosted) nebo si prohlédněte naši [Repozitář GitHubu](https://github.com/forwardemail/forwardemail.net), kde se dozvíte více.

## Odkazy {#references}

\[1] Repozitář GitHub pro přeposílání e-mailů: <https://github.com/forwardemail/forwardemail.net>

\[2] Samostatně hostovaná dokumentace: <https://forwardemail.net/en/self-hosted>

\[3] Technická implementace ochrany osobních údajů v e-mailu: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] Proč je důležitý open-source e-mail: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>