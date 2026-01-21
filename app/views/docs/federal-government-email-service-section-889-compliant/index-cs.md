# Přeposílání e-mailů: Vaše řešení pro přeposílání e-mailů v souladu se § 889 {#forward-email-your-section-889-compliant-email-forwarding-solution}

<img loading="lazy" src="/img/articles/federal.webp" alt="Federal government email service Section 889 compliant" class="rounded-lg" />

## Obsah {#table-of-contents}

* [Předmluva](#foreword)
* [Pochopení souladu s paragrafem 889](#understanding-section-889-compliance)
* [Jak přeposílaní e-mailů dosahuje souladu s paragrafem 889](#how-forward-email-achieves-section-889-compliance)
  * [Závazek společnosti Cloudflare](#cloudflares-commitment)
  * [Infrastruktura DataPacketu](#datapackets-infrastructure)
* [Nad rámec § 889: Širší dodržování předpisů ze strany vlády](#beyond-section-889-broader-government-compliance)
* [Naše cesta vpřed: Rozšiřování horizontů v oblasti dodržování předpisů](#our-path-forward-expanding-compliance-horizons)
* [Proč je to pro vás důležité](#why-this-matters-for-you)
* [Bezpečné a kompatibilní přeposílání e-mailů začíná zde](#secure-compliant-email-forwarding-starts-here)
* [Reference](#references)

## Předmluva {#foreword}

Ve společnosti Forward Email věříme v jednoduché, bezpečné a soukromé přeposílání e-mailů pro každého. Víme, že pro mnoho organizací, zejména pro ty, které spolupracují s vládou USA, není dodržování předpisů jen módním slovem – je to nutnost. Zajištění dodržování **federálních předpisů pro e-mail** je klíčové. Proto s hrdostí potvrzujeme, že naše služba **bezpečného přeposílání e-mailů** je vytvořena tak, aby splňovala přísné federální požadavky, včetně [Oddíl 889](https://www.acquisition.gov/Section-889-Policies) požadavku [Zákon o zmocnění k národní obraně (NDAA)](https://en.wikipedia.org/wiki/National_Defense_Authorization_Act).

Náš závazek k **dodržování předpisů pro vládní e-maily** byl nedávno uveden do praxe, když **Americká námořní akademie** oslovila **Forward Email**. Požadovali služby **zabezpečeného přeposílání e-mailů** a potřebovali dokumentaci potvrzující naše dodržování federálních předpisů, včetně **dodržování paragrafu 889**. Tato zkušenost slouží jako cenná případová studie, která demonstruje naši připravenost a schopnost podporovat vládou financované organizace a plnit jejich přísné požadavky. Tento závazek se vztahuje na všechny naše uživatele, kteří hledají spolehlivé **e-mailové řešení zaměřené na soukromí**.

## Pochopení souladu s paragrafem 889 {#understanding-section-889-compliance}

Co je paragraf 889? Jednoduše řečeno, jedná se o federální zákon USA, který zakazuje vládním agenturám používat nebo uzavírat smlouvy se subjekty, které používají určitá telekomunikační a kamerová sledovací zařízení nebo služby od konkrétních společností (jako jsou Huawei, ZTE, Hikvision, Dahua a Hytera). Toto pravidlo, často spojované se **zákazem Huawei** a **zákazem ZTE**, pomáhá chránit národní bezpečnost.

> \[!NOTE]
> Oddíl 889 se konkrétně zaměřuje na zařízení a služby společností Huawei, ZTE, Hytera, Hikvision a Dahua, včetně jejich dceřiných společností a přidružených společností.

Pro **službu přeposílání e-mailů pro vládní zakázky**, jako je **Forward Email**, to znamená zajistit, aby žádný z našich poskytovatelů základní infrastruktury toto zakázané zařízení nepoužíval, a my tak **dodržujeme požadavky § 889**.

## Jak přeposílaní e-mailů dosahuje souladu s paragrafem 889 {#how-forward-email-achieves-section-889-compliance}

Takže **jak je Forward Email v souladu s paragrafem 889**? Toho dosahujeme pečlivým výběrem našich infrastrukturních partnerů. **Forward Email** se pro svou **infrastrukturu v souladu s paragrafem 889** spoléhá výhradně na dva klíčové poskytovatele:

1. **[Cloudflare](https://www.cloudflare.com/):** Náš primární partner pro síťové služby a **zabezpečení e-mailů Cloudflare**.
2. **[Datový paket](https://datapacket.com/):** Náš primární poskytovatel serverové infrastruktury (pro failover používáme [Digitální oceán](https://www.digitalocean.com/) a/nebo [Vultr](https://www.vultr.com/) a brzy přejdeme výhradně na používání DataPacket – samozřejmě jsme písemně potvrdili soulad s paragrafem 889 od obou těchto poskytovatelů failoveru).

> \[!IMPORTANT]
> Základem našeho souladu s předpisy je naše výhradní spoléhání se na Cloudflare a DataPacket, z nichž ani jeden nepoužívá zařízení zakázaná podle paragrafu 889.

[Cloudflare](https://www.cloudflare.com/) i [Datový paket](https://datapacket.com/) se zavazují k dodržování vysokých bezpečnostních standardů a nepoužívají zařízení zakázaná podle § 889. **Používání služeb Cloudflare a DataPacket pro dodržování předpisů podle § 889** je pro naši službu zásadní.

### Závazek Cloudflare {#cloudflares-commitment}

[Cloudflare](https://www.cloudflare.com/) explicitně řeší **soulad s paragrafem 889** ve svém **[Kodex chování třetích stran](https://cf-assets.www.cloudflare.com/slt3lc6tev37/284hiWkCYNc49GQpAeBvGN/e137cdac96d1c4cd403c6b525831d284/Third_Party_Code_of_Conduct.pdf)**. Uvádí:

> „Podle § 889 zákona o zmocnění k národní obraně (NDAA) společnost Cloudflare ve svém dodavatelském řetězci nepoužívá ani jinak nepovoluje telekomunikační zařízení, produkty pro video dohled ani služby vyrobené nebo poskytované společnostmi Huawei Technologies Company, ZTE Corporation, Hytera Communications Corporation, Hangzhou Hikvision Digital Technology Company nebo Dahua Technology Company (nebo jakoukoli dceřinou společností či přidruženou společností těchto subjektů).“

*(Zdroj: Kodex chování třetích stran Cloudflare, načteno 29. dubna 2025)*

Toto jasné prohlášení potvrzuje, že infrastruktura [Cloudflare](https://www.cloudflare.com/), kterou funkce **Forward Email** využívá, splňuje požadavky § 889.

### Infrastruktura datových paketů {#datapackets-infrastructure}

[Datový paket](https://datapacket.com/), náš poskytovatel serverů, využívá síťové vybavení výhradně od společností **Arista Networks** a **Cisco**. Ani Arista, ani Cisco nepatří mezi společnosti zakázané podle paragrafu 889. Obě společnosti jsou zavedenými dodavateli, kteří se široce používají v bezpečném podnikovém a vládním prostředí a jsou známí dodržováním přísných bezpečnostních a shodných standardů.

Používáním pouze parametrů [Cloudflare](https://www.cloudflare.com/) a [Datový paket](https://datapacket.com/) zajišťuje **Forward Email**, že celý řetězec poskytování služeb neobsahuje zařízení zakázaná podle paragrafu 889, a poskytuje tak **bezpečné přeposílání e-mailů pro federální agentury** a další uživatele, kteří dbají na bezpečnost.

## Nad rámec § 889: Širší dodržování předpisů vlády {#beyond-section-889-broader-government-compliance}

Náš závazek k **zabezpečení vládních e-mailů** a dodržování předpisů přesahuje rámec § 889. I když samotná služba **Přeposílání e-mailů** přímo nezpracovává ani neukládá citlivá vládní data, jako je [Kontrolované neutajované informace (CUI)](https://en.wikipedia.org/wiki/Controlled_Unclassified_Information), stejným způsobem jako velká SaaS platforma, naše architektura **přeposílání e-mailů s otevřeným zdrojovým kódem** a spoléhání se na bezpečné a kompatibilní poskytovatele je v souladu se zásadami dalších klíčových předpisů:

* **[FAR (Federální nařízení o zadávání veřejných zakázek)](https://en.wikipedia.org/wiki/Federal_Acquisition_Regulation):** Díky používání infrastruktury v souladu s HIPAA a nabídce přímočarých komerčních služeb poskytujeme principy přeposílání e-mailů v souladu s FAR, které jsou vhodné pro vládní dodavatele.
* **Zákon o ochraně osobních údajů a [FISMA](https://en.wikipedia.org/wiki/Federal_Information_Security_Management_Act_of\_2002):** Jsme navrženi tak, abychom **dbali na soukromí** a dodržovali principy zákona o ochraně osobních údajů. Vaše e-maily neukládáme. E-maily jsou přeposílány přímo, čímž se minimalizuje manipulace s daty. Naši poskytovatelé infrastruktury ([Cloudflare](https://www.cloudflare.com/), [Datový paket](https://datapacket.com/)) spravují své systémy v souladu s vysokými bezpečnostními standardy, které jsou v souladu s principy **e-mailů v souladu s FISMA**.
* **[HIPAA](https://en.wikipedia.org/wiki/Health_Insurance_Portability_and_Accountability_Act):** Pro organizace, které potřebují **přeposílání e-mailů v souladu s HIPAA**, může být **Přeposílání e-mailů** součástí řešení v souladu s HIPAA. Vzhledem k tomu, že e-maily neukládáme, primární odpovědnost za dodržování předpisů leží na koncových e-mailových systémech. Naše bezpečná transportní vrstva však při správném použití splňuje požadavky HIPAA.

> \[!WARNING]
> U vašeho poskytovatele e-mailů může být potřeba [Smlouva o obchodním partnerství (BAA)](https://en.wikipedia.org/wiki/Business_associate_agreement), nikoli samotná funkce **Přeposílání e-mailů**, protože my neukládáme obsah vašich e-mailů (pokud nepoužíváte [naše šifrovaná úložná vrstva IMAP/POP3](/blog/docs/best-quantum-safe-encrypted-email-service)).

## Naše cesta vpřed: Rozšiřování horizontů dodržování předpisů {#our-path-forward-expanding-compliance-horizons}

Přestože naše shoda s paragrafem 889 poskytuje klíčový základ, zejména pro federální dodavatele, chápeme, že různé organizace a vládní agentury mají rozmanité a vyvíjející se regulační potřeby. Ve společnosti **Forward Email** je transparentnost klíčová a chceme se s vámi podělit o náš pohled na širší oblast dodržování předpisů a naše směřování do budoucna.

Uznáváme důležitost rámců a předpisů, jako například:

* **[Systém pro správu ocenění (SAM)](https://sam.gov/):** Nezbytné pro přímé federální zakázky. * **[FAR (Federální nařízení o zadávání veřejných zakázek)](https://www.acquisition.gov/browse/index/far):** Včetně standardních klauzulí jako [FAR 52.212-4](https://www.acquisition.gov/far/52.212-4) pro komerční služby. * **[DFARS (Dodatek k nařízení o federálních obranných akvizicích)](https://en.wikipedia.org/wiki/Defense_Federal_Acquisition_Regulation_Supplement):** Zejména [DFARS 252.239-7010](https://www.acquisition.gov/dfars/252.239-7010-cloud-computing-services.) pro cloudové služby Ministerstva obrany USA. * **[CMMC (Certifikace modelu vyspělosti kybernetické bezpečnosti)](https://en.wikipedia.org/wiki/Cybersecurity_Maturity_Model_Certification):** Požadované pro dodavatele Ministerstva obrany USA, kteří pracují s [Informace o federálních smlouvách (FCI)](https://en.wikipedia.org/wiki/Federal_Contract_Information) nebo CUI. * **[NIST SP 800-171](https://csrc.nist.gov/pubs/sp/800/171/r3/final):** Základ pro CMMC úrovně 2, zaměřený na ochranu CUI. ([NIST](https://en.wikipedia.org/wiki/National_Institute_of_Standards_and_Technology) - Národní institut pro standardy a technologie)
* **[FedRAMP (Federální program pro řízení rizik a autorizací)](https://en.wikipedia.org/wiki/FedRAMP):** Standard pro cloudové služby používané federálními agenturami. * **__PROTECTED_LINK_77__0:** Zastřešující rámec pro federální informační bezpečnost. * **__PROTECTED_LINK_77__1:** Pro práci s chráněnými zdravotními informacemi (PHI). * **__PROTECTED_LINK_77__2:** Pro ochranu záznamů o vzdělávání studentů.
* **__PROTECTED_LINK_77__3:** Pro služby zabývající se dětmi mladšími 13 let.

**Naše současná pozice a budoucí cíle:**

Základní design služby **Forward Email** – **zaměření na soukromí**, **otevřený zdrojový kód** a minimalizace zpracování dat (zejména v naší základní službě **přeposílání e-mailů**) – je v souladu s *principy*, na kterých stojí mnoho z těchto předpisů. Naše stávající bezpečnostní postupy (šifrování, podpora moderních e-mailových standardů) a dodržování § 889 poskytují silný výchozí bod.

Získání formální certifikace nebo autorizace pro frameworky jako **FedRAMP** nebo **CMMC** je však významný úkol. Zahrnuje důkladnou dokumentaci, implementaci specifických technických a procedurálních kontrol (často jich jsou stovky), nezávislá hodnocení (jako [3PAO](https://www.fedramp.gov/glossary/#3pao) pro FedRAMP - Third-Party Assessment Organization) a průběžné monitorování.

> \[!IMPORTANT]
> Dodržování předpisů se netýká jen technologií; jde o zdokumentované procesy, zásady a neustálou ostražitost. Získání certifikací, jako je FedRAMP nebo CMMC, vyžaduje značné investice a čas.

**Náš závazek:**

S růstem **Forward Email** a s vývojem potřeb našich zákazníků se zavazujeme zkoumat a usilovat o relevantní certifikace v oblasti shody. To zahrnuje plány pro:

1. **Registrace SAM:** Usnadnění přímé spolupráce s federálními agenturami USA.
2. **Formalizace procesů:** Vylepšení naší interní dokumentace a postupů tak, aby byly v souladu se standardy, jako je NIST SP 800-171, který tvoří základ pro CMMC.
3. **Hodnocení postupů FedRAMP:** Posouzení požadavků a proveditelnosti získání autorizace FedRAMP, pravděpodobně počínaje nízkou nebo střední základní úrovní, s potenciálním využitím modelu [TO-SaaS](https://www.fedramp.gov/blog/fedramp-releases-low-impact-saas-baseline/), kde je to relevantní.
4. **Podpora specifických potřeb:** Řešení požadavků, jako je HIPAA (potenciálně prostřednictvím BAA a specifických konfigurací pro uložená data) a FERPA (prostřednictvím vhodných smluvních podmínek a kontrol), jelikož se více zapojujeme do zdravotnických a vzdělávacích institucí.

Tato cesta vyžaduje pečlivé plánování a investice. I když nemáme bezprostřední časové harmonogramy pro všechny certifikace, klíčovou součástí našeho plánu je posílení naší pozice v oblasti dodržování předpisů s cílem splnit potřeby vlády a regulovaných odvětví.

> \[!NOTE]
> Věříme, že naše **open source** povaha poskytuje v celém tomto procesu jedinečnou transparentnost a umožňuje naší komunitě a zákazníkům vidět náš závazek na vlastní oči.

Naši komunitu budeme i nadále informovat o dosažení významných milníků na naší cestě k dodržování předpisů.

## Proč je to pro vás důležité {#why-this-matters-for-you}

Výběr služby pro přeposílání e-mailů v souladu s paragrafem 889**, jako je **Forward Email**, znamená:

* **Klid v duši:** Zejména pro vládní agentury, dodavatele a organizace dbající na bezpečnost.
* **Snížené riziko:** Zabraňuje potenciálním konfliktům s **federálními předpisy pro e-maily**.
* **Důvěra:** Prokazuje závazek k bezpečnosti a integritě dodavatelského řetězce.

**Přeposílání e-mailů** nabízí jednoduchý, spolehlivý a *kompatibilní* způsob správy potřeb vaší vlastní domény v oblasti **přeposílání e-mailů**.

## Bezpečné a kompatibilní přeposílání e-mailů začíná zde {#secure-compliant-email-forwarding-starts-here}

Společnost **Forward Email** se věnuje poskytování **bezpečné, soukromé a open-source služby přeposílání e-mailů**. Naše **soulad s paragrafem 889**, kterého jsme dosáhli díky partnerství se společnostmi [Cloudflare](https://www.cloudflare.com/) a [Datový paket](https://datapacket.com/) (což odráží naši práci v oblasti **přeposílání e-mailů pro Námořní akademii Spojených států**), je důkazem tohoto závazku. Ať už jste vládní subjekt, dodavatel nebo si jednoduše ceníte **zabezpečení vládních e-mailů**, služba **Forward Email** je tu pro vás.

Jste připraveni na **bezpečné a kompatibilní přeposílání e-mailů**? [Zaregistrujte se zdarma ještě dnes!](https://forwardemail.net)

## Odkazy {#references}

* **Oddíl 889 (NDAA):** <https://www.acquisition.gov/Section-889-Policies>
* **Cloudflare:** <https://www.cloudflare.com/>
* **Kodex chování třetích stran Cloudflare:** <https://cf-assets.www.cloudflare.com/slt3lc6tev37/284hiWkCYNc49GQpAeBvGN/e137cdac96d1c4cd403c6b525831d284/Third_Party_Code_of_Conduct.pdf>
* **Datový paket:** <https://datapacket.com/>
* **Systém pro správu zakázek (SAM):** <https://sam.gov/>
* **Federální nařízení o zadávání veřejných zakázek (FAR):** <https://www.acquisition.gov/browse/index/far>
* **FAR 52.212-4:** <https://www.acquisition.gov/far/52.212-4>
* **Dodatek k federálnímu nařízení o zadávání veřejných zakázek pro obranu (DFARS):** <https://www.acquisition.gov/dfars>
* **DFARS 252.239-7010:** <https://www.acquisition.gov/dfars/252.239-7010-cloud-computing-services.>
* **Certifikace modelu vyspělosti kybernetické bezpečnosti (CMMC):** <https://dodcio.defense.gov/cmmc/About/>
* **NIST SP 800-171:** <https://www.cloudflare.com/>0
* **Federální program pro řízení rizik a autorizací (FedRAMP):** <https://www.cloudflare.com/>1
* **Federální zákon o modernizaci informační bezpečnosti (FISMA):** <https://www.cloudflare.com/>2
* **Zákon o přenositelnosti a odpovědnosti zdravotního pojištění (HIPAA):** <https://www.cloudflare.com/>3
* **Zákon o vzdělávacích právech a ochraně soukromí rodin (FERPA):** <https://www.cloudflare.com/>4
* **Zákon o ochraně soukromí dětí online (COPPA):** <https://www.cloudflare.com/>5