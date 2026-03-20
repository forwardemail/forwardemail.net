# Self-hosted email: závazek k open source {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="Ilustrace self-hosted emailového řešení" class="rounded-lg" />


## Obsah {#table-of-contents}

* [Předmluva](#foreword)
* [Proč je self-hosted email důležitý](#why-self-hosted-email-matters)
  * [Problém tradičních emailových služeb](#the-problem-with-traditional-email-services)
  * [Self-hosted alternativa](#the-self-hosted-alternative)
* [Naše self-hosted implementace: technický přehled](#our-self-hosted-implementation-technical-overview)
  * [Architektura založená na Dockeru pro jednoduchost a přenositelnost](#docker-based-architecture-for-simplicity-and-portability)
  * [Instalace pomocí Bash skriptu: dostupnost a bezpečnost](#bash-script-installation-accessibility-meets-security)
  * [Kvantově bezpečné šifrování pro budoucí ochranu soukromí](#quantum-safe-encryption-for-future-proof-privacy)
  * [Automatizovaná údržba a aktualizace](#automated-maintenance-and-updates)
* [Závazek k open source](#the-open-source-commitment)
* [Self-hosted vs. spravované: jak vybrat správně](#self-hosted-vs-managed-making-the-right-choice)
  * [Realita self-hostingu emailu](#the-reality-of-self-hosting-email)
  * [Kdy zvolit naši spravovanou službu](#when-to-choose-our-managed-service)
* [Začínáme se self-hosted Forward Email](#getting-started-with-self-hosted-forward-email)
  * [Systémové požadavky](#system-requirements)
  * [Kroky instalace](#installation-steps)
* [Budoucnost self-hosted emailu](#the-future-of-self-hosted-email)
* [Závěr: svoboda emailu pro všechny](#conclusion-email-freedom-for-everyone)
* [Reference](#references)


## Předmluva {#foreword}

V dnešním digitálním světě zůstává email páteří naší online identity a komunikace. Přestože rostou obavy o soukromí, mnoho uživatelů čelí těžké volbě: pohodlí za cenu soukromí, nebo soukromí za cenu pohodlí. Ve Forward Email jsme vždy věřili, že byste si mezi tím neměli vybírat.

Dnes s nadšením oznamujeme významný milník na naší cestě: spuštění našeho self-hosted emailového řešení. Tato funkce představuje náš nejhlubší závazek k principům open source, designu zaměřenému na soukromí a posílení uživatelů. S naší self-hosted možností vám dáváme plnou moc a kontrolu nad vaší emailovou komunikací přímo do vašich rukou.

Tento blogový příspěvek zkoumá filozofii za naším self-hosted řešením, jeho technickou implementaci a proč je důležité pro uživatele, kteří upřednostňují jak soukromí, tak vlastnictví ve své digitální komunikaci.


## Proč je self-hosted email důležitý {#why-self-hosted-email-matters}

Naše self-hosted emailové řešení je nejjasnějším vyjádřením našeho přesvědčení, že skutečné soukromí znamená kontrolu, a kontrola začíná u open source. Pro uživatele, kteří požadují plné vlastnictví své digitální komunikace, už self-hosting není okrajový nápad — je to základní právo. Jsme hrdí, že za tímto přesvědčením stojíme s plně otevřenou, ověřitelnou platformou, kterou můžete provozovat podle svých podmínek.

### Problém tradičních emailových služeb {#the-problem-with-traditional-email-services}

Tradiční emailové služby představují několik zásadních výzev pro uživatele dbající na soukromí:

1. **Požadavky na důvěru**: Musíte věřit poskytovateli, že nebude přistupovat k vašim datům, analyzovat je ani je sdílet
2. **Centralizovaná kontrola**: Přístup vám může být kdykoli odebrán z jakéhokoli důvodu
3. **Zranitelnost vůči dohledu**: Centralizované služby jsou hlavními cíli dohledu
4. **Omezená transparentnost**: Většina služeb používá proprietární, uzavřený software
5. **Závislost na dodavateli**: Migrace od těchto služeb může být obtížná nebo nemožná

Dokonce i „na soukromí zaměřené“ emailové služby často selhávají tím, že zveřejní pouze frontendové aplikace jako open source, zatímco jejich backendové systémy zůstávají proprietární a uzavřené. To vytváří významnou mezeru v důvěře — jste vyzváni, abyste věřili jejich slibům o soukromí, aniž byste je mohli ověřit.

### Self-hosted alternativa {#the-self-hosted-alternative}
Samostatné hostování vaší e-mailové služby nabízí zásadně odlišný přístup:

1. **Úplná kontrola**: Vlastníte a řídíte celou e-mailovou infrastrukturu
2. **Ověřitelná soukromí**: Celý systém je transparentní a auditovatelný
3. **Není potřeba důvěřovat třetí straně**: Nemusíte důvěřovat žádné třetí straně se svými komunikacemi
4. **Svoboda přizpůsobení**: Přizpůsobte systém svým specifickým potřebám
5. **Odolnost**: Vaše služba pokračuje bez ohledu na rozhodnutí jakékoli společnosti

Jak to jeden uživatel vyjádřil: „Samostatné hostování mého e-mailu je digitální ekvivalent pěstování vlastní potravy – vyžaduje to více práce, ale přesně vím, co v tom je.“


## Naše samostatně hostovaná implementace: Technický přehled {#our-self-hosted-implementation-technical-overview}

Naše samostatně hostované e-mailové řešení je postaveno na stejných principech zaměřených na soukromí, které řídí všechny naše produkty. Pojďme prozkoumat technickou implementaci, která to umožňuje.

### Architektura založená na Dockeru pro jednoduchost a přenositelnost {#docker-based-architecture-for-simplicity-and-portability}

Celou naši e-mailovou infrastrukturu jsme zabalili pomocí Dockeru, což usnadňuje nasazení téměř na jakémkoli systému založeném na Linuxu. Tento kontejnerový přístup přináší několik klíčových výhod:

1. **Zjednodušené nasazení**: Jediný příkaz nastaví celou infrastrukturu
2. **Konzistentní prostředí**: Odstraňuje problémy typu „funguje to na mém počítači“
3. **Izolované komponenty**: Každá služba běží ve vlastním kontejneru pro bezpečnost
4. **Snadné aktualizace**: Jednoduché příkazy pro aktualizaci celého stacku
5. **Minimální závislosti**: Vyžaduje pouze Docker a Docker Compose

Architektura zahrnuje kontejnery pro:

* Webové rozhraní pro administraci
* SMTP server pro odchozí e-maily
* IMAP/POP3 servery pro příjem e-mailů
* CalDAV server pro kalendáře
* CardDAV server pro kontakty
* Databázi pro ukládání konfigurace
* Redis pro cache a výkon
* SQLite pro bezpečné, šifrované ukládání poštovních schránek

> \[!NOTE]
> Nezapomeňte si prohlédnout náš [návod pro vývojáře samostatně hostované verze](https://forwardemail.net/self-hosted)

### Instalace pomocí Bash skriptu: Dostupnost a bezpečnost v jednom {#bash-script-installation-accessibility-meets-security}

Instalační proces jsme navrhli tak, aby byl co nejjednodušší a zároveň dodržoval nejlepší bezpečnostní postupy:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

Tento jediný příkaz:

1. Ověří systémové požadavky
2. Provádí vás konfigurací
3. Nastaví DNS záznamy
4. Konfiguruje TLS certifikáty
5. Nasadí Docker kontejnery
6. Provede počáteční zabezpečení

Pro ty, kdo mají obavy z přesměrování skriptů do bash (a měli by mít!), doporučujeme skript před spuštěním zkontrolovat. Je plně open-source a k dispozici ke kontrole.

### Kvantově bezpečné šifrování pro budoucí ochranu soukromí {#quantum-safe-encryption-for-future-proof-privacy}

Stejně jako naše hostovaná služba, i naše samostatně hostované řešení implementuje kvantově odolné šifrování pomocí ChaCha20-Poly1305 jako šifry pro SQLite databáze. Tento přístup chrání vaše e-mailová data nejen před současnými hrozbami, ale i před budoucími útoky kvantových počítačů.

Každá poštovní schránka je uložena ve vlastním šifrovaném SQLite databázovém souboru, což poskytuje úplnou izolaci mezi uživateli – významnou bezpečnostní výhodu oproti tradičním sdíleným databázovým přístupům.

### Automatizovaná údržba a aktualizace {#automated-maintenance-and-updates}

Do samostatně hostovaného řešení jsme integrovali komplexní nástroje pro údržbu:

1. **Automatické zálohy**: Plánované zálohy všech kritických dat
2. **Obnova certifikátů**: Automatizovaná správa certifikátů Let's Encrypt
3. **Aktualizace systému**: Jednoduchý příkaz pro aktualizaci na nejnovější verzi
4. **Monitorování stavu**: Vestavěné kontroly pro zajištění integrity systému

Tyto nástroje jsou přístupné prostřednictvím jednoduchého interaktivního menu:

```bash
# script prompt

1. Počáteční nastavení
2. Nastavení záloh
3. Nastavení automatických aktualizací
4. Obnova certifikátů
5. Obnovení ze zálohy
6. Nápověda
7. Ukončit
```


## Závazek k open-source {#the-open-source-commitment}

Naše samostatně hostované e-mailové řešení, stejně jako všechny naše produkty, je 100% open-source – jak frontend, tak backend. To znamená:
1. **Úplná transparentnost**: Každý řádek kódu, který zpracovává vaše e-maily, je k dispozici k veřejné kontrole  
2. **Příspěvky komunity**: Každý může přispět vylepšeními nebo opravit chyby  
3. **Bezpečnost díky otevřenosti**: Zranitelnosti může identifikovat a opravit globální komunita  
4. **Žádné vázání na dodavatele**: Nikdy nejste závislí na existenci naší společnosti  

Celý kód je dostupný na GitHubu na <https://github.com/forwardemail/forwardemail.net>.


## Self-hosted vs. Managed: Jak udělat správnou volbu {#self-hosted-vs-managed-making-the-right-choice}

I když jsme hrdí, že nabízíme možnost self-hostingu, uvědomujeme si, že to není správná volba pro každého. Self-hosting e-mailu přináší skutečné odpovědnosti a výzvy:

### Realita self-hostingu e-mailu {#the-reality-of-self-hosting-email}

#### Technické úvahy {#technical-considerations}

* **Správa serveru**: Budete muset udržovat VPS nebo dedikovaný server  
* **Konfigurace DNS**: Správné nastavení DNS je klíčové pro doručitelnost  
* **Aktualizace zabezpečení**: Je nezbytné být aktuální s bezpečnostními záplatami  
* **Správa spamu**: Budete muset řešit filtrování spamu  
* **Strategie zálohování**: Implementace spolehlivých záloh je vaší odpovědností  

#### Časová investice {#time-investment}

* **Počáteční nastavení**: Čas na nastavení, ověření a prostudování dokumentace  
* **Průběžná údržba**: Občasné aktualizace a monitorování  
* **Řešení problémů**: Občasný čas na vyřešení potíží  

#### Finanční úvahy {#financial-considerations}

* **Náklady na server**: 5–20 USD/měsíc za základní VPS  
* **Registrace domény**: 10–20 USD/rok  
* **Hodnota času**: Vaše časová investice má skutečnou hodnotu  

### Kdy zvolit naši spravovanou službu {#when-to-choose-our-managed-service}

Pro mnoho uživatelů je naše spravovaná služba stále nejlepší volbou:

1. **Pohodlí**: My se staráme o veškerou údržbu, aktualizace a monitorování  
2. **Spolehlivost**: Využijte naši zavedenou infrastrukturu a odborné znalosti  
3. **Podpora**: Získejte pomoc, když nastanou problémy  
4. **Doručitelnost**: Využijte naši zavedenou reputaci IP adres  
5. **Nákladová efektivita**: Když započítáte časové náklady, naše služba je často ekonomičtější  

Obě možnosti poskytují stejné výhody v oblasti soukromí a otevřené transparentnosti – rozdíl je pouze v tom, kdo spravuje infrastrukturu.


## Začínáme se self-hosted Forward Email {#getting-started-with-self-hosted-forward-email}

Chcete převzít kontrolu nad svou e-mailovou infrastrukturou? Zde je návod, jak začít:

### Systémové požadavky {#system-requirements}

* Ubuntu 20.04 LTS nebo novější (doporučeno)  
* Minimálně 1GB RAM (doporučeno 2GB a více)  
* Doporučeno 20GB úložiště  
* Doména, kterou ovládáte  
* Veřejná IP adresa s podporou portu 25  
* Možnost nastavit [reverse PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)  
* Podpora IPv4 a IPv6  

> \[!TIP]  
> Doporučujeme několik poskytovatelů mail serverů na <https://forwardemail.net/blog/docs/best-mail-server-providers> (zdroj na <https://github.com/forwardemail/awesome-mail-server-providers>)  

### Kroky instalace {#installation-steps}

1. **Spusťte instalační skript**:  
   ```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
   ```

2. **Postupujte podle interaktivních pokynů**:  
   * Zadejte název své domény  
   * Nakonfigurujte přihlašovací údaje správce  
   * Nastavte DNS záznamy podle instrukcí  
   * Vyberte preferované konfigurační možnosti  

3. **Ověřte instalaci**:  
   Po dokončení instalace můžete ověřit, že vše funguje:  
   * Kontrola stavu kontejnerů: `docker ps`  
   * Odeslání testovacího e-mailu  
   * Přihlášení do webového rozhraní  


## Budoucnost self-hosted e-mailu {#the-future-of-self-hosted-email}

Naše self-hosted řešení je teprve začátek. Jsme odhodláni toto řešení neustále vylepšovat:

1. **Vylepšené administrační nástroje**: Výkonnější webová správa  
2. **Další možnosti autentizace**: Včetně podpory hardwarových bezpečnostních klíčů  
3. **Pokročilé monitorování**: Lepší přehled o stavu systému a výkonu  
4. **Nasazení na více serverech**: Možnosti konfigurací s vysokou dostupností  
5. **Vylepšení řízená komunitou**: Začleňování příspěvků od uživatelů
## Závěr: Svoboda e-mailu pro každého {#conclusion-email-freedom-for-everyone}

Spuštění našeho vlastního hostovaného e-mailového řešení představuje významný milník v naší misi poskytovat e-mailové služby zaměřené na soukromí a transparentnost. Ať už si vyberete naši spravovanou službu nebo možnost vlastního hostování, těžíte z našeho neochvějného závazku k principům open-source a designu orientovanému na soukromí.

E-mail je příliš důležitý na to, aby byl ovládán uzavřenými, proprietárními systémy, které upřednostňují sběr dat před ochranou soukromí uživatelů. S vlastním hostovaným řešením Forward Email jsme hrdí, že nabízíme skutečnou alternativu – takovou, která vám dává plnou kontrolu nad vašimi digitálními komunikacemi.

Věříme, že soukromí není jen funkcí; je to základní právo. A s naší možností vlastního hostování e-mailu toto právo zpřístupňujeme více než kdy dříve.

Připraveni převzít kontrolu nad svým e-mailem? [Začněte ještě dnes](https://forwardemail.net/self-hosted) nebo prozkoumejte náš [GitHub repozitář](https://github.com/forwardemail/forwardemail.net), kde se dozvíte více.


## Reference {#references}

\[1] Forward Email GitHub Repository: <https://github.com/forwardemail/forwardemail.net>

\[2] Dokumentace k vlastnímu hostování: <https://forwardemail.net/en/self-hosted>

\[3] Technická implementace ochrany soukromí e-mailu: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] Proč je open-source e-mail důležitý: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>
