# Dohoda o zpracování údajů {#data-processing-agreement}

<!-- v1.0 z <https://github.com/CommonPaper/DPA> -->

<img loading="lazy" src="/img/articles/dpa.webp" alt="Forward Email dohoda o zpracování údajů" class="rounded-lg" />


## Obsah {#table-of-contents}

* [Klíčové pojmy](#key-terms)
* [Změny dohody](#changes-to-the-agreement)
* [1. Vztahy mezi správcem a subzpracovateli](#1-processor-and-subprocessor-relationships)
  * [1. Poskytovatel jako správce](#1-provider-as-processor)
  * [2. Poskytovatel jako subzpracovatel](#2-provider-as-subprocessor)
* [2. Zpracování](#2-processing)
  * [1. Podrobnosti zpracování](#1-processing-details)
  * [2. Pokyny ke zpracování](#2-processing-instructions)
  * [3. Zpracování poskytovatelem](#3-processing-by-provider)
  * [4. Zpracování zákazníkem](#4-customer-processing)
  * [5. Souhlas se zpracováním](#5-consent-to-processing)
  * [6. Subzpracovatelé](#6-subprocessors)
* [3. Omezené přenosy](#3-restricted-transfers)
  * [1. Oprávnění](#1-authorization)
  * [2. Přenosy mimo EHP](#2-ex-eea-transfers)
  * [3. Přenosy mimo UK](#3-ex-uk-transfers)
  * [4. Ostatní mezinárodní přenosy](#4-other-international-transfers)
* [4. Reakce na bezpečnostní incidenty](#4-security-incident-response)
* [5. Audit a zprávy](#5-audit--reports)
  * [1. Práva na audit](#1-audit-rights)
  * [2. Bezpečnostní zprávy](#2-security-reports)
  * [3. Bezpečnostní due diligence](#3-security-due-diligence)
* [6. Koordinace a spolupráce](#6-coordination--cooperation)
  * [1. Reakce na dotazy](#1-response-to-inquiries)
  * [2. DPIA a DTIA](#2-dpias-and-dtias)
* [7. Vymazání osobních údajů zákazníka](#7-deletion-of-customer-personal-data)
  * [1. Vymazání zákazníkem](#1-deletion-by-customer)
  * [2. Vymazání po ukončení DPA](#2-deletion-at-dpa-expiration)
* [8. Omezení odpovědnosti](#8-limitation-of-liability)
  * [1. Limity odpovědnosti a vzdání se náhrad škody](#1-liability-caps-and-damages-waiver)
  * [2. Nároky třetích stran](#2-related-party-claims)
  * [3. Výjimky](#3-exceptions)
* [9. Konflikty mezi dokumenty](#9-conflicts-between-documents)
* [10. Doba platnosti dohody](#10-term-of-agreement)
* [11. Rozhodné právo a vybrané soudy](#11-governing-law-and-chosen-courts)
* [12. Vztah poskytovatele služeb](#12-service-provider-relationship)
* [13. Definice](#13-definitions)
* [Poděkování](#credits)


## Klíčové pojmy {#key-terms}

| Termín                                     | Hodnota                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <strong>Dohoda</strong>                     | Tato DPA doplňuje [Podmínky služby](/terms)                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| <strong>Schválení subzpracovatelé</strong> | [Cloudflare](https://cloudflare.com) (USA; poskytovatel DNS, sítí a bezpečnosti), [DataPacket](https://www.datapacket.com/) (USA/UK; poskytovatel hostingu), [Digital Ocean](https://digitalocean.com) (USA; poskytovatel hostingu), [GitHub](https://github.com) (USA; hosting zdrojového kódu, CI/CD a řízení projektů), [Vultr](https://www.vultr.com) (USA; poskytovatel hostingu), [Stripe](https://stripe.com) (USA; platební procesor), [PayPal](https://paypal.com) (USA; platební procesor) |
| <strong>Kontaktní osoba pro bezpečnost poskytovatele</strong> | <a href="mailto:security@forwardemail.net"><security@forwardemail.net></a>                                                                                                                                                                                                                                                                                                                                                                                                          |
| <strong>Bezpečnostní politika</strong>     | Zobrazit [naši bezpečnostní politiku na GitHubu](https://github.com/forwardemail/forwardemail.net/security/policy)                                                                                                                                                                                                                                                                                                                                                                |
| <strong>Rozhodný stát</strong>             | Stát Delaware, Spojené státy americké                                                                                                                                                                                                                                                                                                                                                                                                                                             |
## Změny ve Smlouvě {#changes-to-the-agreement}

Tento dokument je odvozeninou od [Common Paper DPA Standard Terms (Verze 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) a byly provedeny následující změny:

1. [Rozhodné právo a vybrané soudy](#11-governing-law-and-chosen-courts) byly zahrnuty jako sekce níže s identifikovaným `Rozhodným státem` výše.
2. [Vztah poskytovatele služby](#12-service-provider-relationship) byl zahrnut jako sekce níže.


## 1. Vztahy mezi zpracovatelem a subzpracovatelem {#1-processor-and-subprocessor-relationships}

### 1. Poskytovatel jako zpracovatel {#1-provider-as-processor}

V situacích, kdy je <strong>Zákazník</strong> správcem osobních údajů zákazníka, bude <strong>Poskytovatel</strong> považován za zpracovatele, který zpracovává osobní údaje jménem <strong>Zákazníka</strong>.

### 2. Poskytovatel jako subzpracovatel {#2-provider-as-subprocessor}

V situacích, kdy je <strong>Zákazník</strong> zpracovatelem osobních údajů zákazníka, bude <strong>Poskytovatel</strong> považován za subzpracovatele osobních údajů zákazníka.


## 2. Zpracování {#2-processing}

### 1. Podrobnosti o zpracování {#1-processing-details}

Příloha I(B) na titulní straně popisuje předmět, povahu, účel a dobu trvání tohoto zpracování, stejně jako <strong>Kategorie osobních údajů</strong> shromažďovaných a <strong>Kategorie subjektů údajů</strong>.

### 2. Pokyny ke zpracování {#2-processing-instructions}

<strong>Zákazník</strong> dává pokyn <strong>Poskytovateli</strong> ke zpracování osobních údajů zákazníka: (a) za účelem poskytování a údržby služby; (b) jak může být dále specifikováno prostřednictvím používání služby <strong>Zákazníkem</strong>; (c) jak je dokumentováno ve <strong>Smlouvě</strong>; a (d) jak je dokumentováno v jakýchkoli dalších písemných pokynech poskytnutých <strong>Zákazníkem</strong> a potvrzených <strong>Poskytovatelem</strong> ohledně zpracování osobních údajů zákazníka podle této DPA. <strong>Poskytovatel</strong> bude tyto pokyny dodržovat, pokud mu to nebrání platné právní předpisy. <strong>Poskytovatel</strong> okamžitě informuje <strong>Zákazníka</strong>, pokud nebude schopen pokyny ke zpracování dodržet. <strong>Zákazník</strong> dal a bude dávat pouze pokyny, které jsou v souladu s platnými právními předpisy.

### 3. Zpracování poskytovatelem {#3-processing-by-provider}

<strong>Poskytovatel</strong> bude zpracovávat osobní údaje zákazníka pouze v souladu s touto DPA, včetně podrobností na titulní straně. Pokud <strong>Poskytovatel</strong> aktualizuje službu za účelem aktualizace stávajících nebo zahrnutí nových produktů, funkcí nebo funkcionalit, může <strong>Poskytovatel</strong> změnit <strong>Kategorie subjektů údajů</strong>, <strong>Kategorie osobních údajů</strong>, <strong>Zvláštní kategorie údajů</strong>, <strong>Omezení nebo záruky pro zvláštní kategorie údajů</strong>, <strong>Frekvenci přenosu</strong>, <strong>Povahu a účel zpracování</strong> a <strong>Doba trvání zpracování</strong> podle potřeby tak, aby odrážely aktualizace, a to oznámením <strong>Zákazníkovi</strong> o těchto aktualizacích a změnách.

### 4. Zpracování zákazníkem {#4-customer-processing}

Pokud je <strong>Zákazník</strong> zpracovatelem a <strong>Poskytovatel</strong> subzpracovatelem, <strong>Zákazník</strong> bude dodržovat všechny platné právní předpisy, které se vztahují na zpracování osobních údajů zákazníka <strong>Zákazníkem</strong>. Smlouva <strong>Zákazníka</strong> se správcem bude obdobně vyžadovat, aby <strong>Zákazník</strong> dodržoval všechny platné právní předpisy vztahující se na <strong>Zákazníka</strong> jako zpracovatele. Kromě toho bude <strong>Zákazník</strong> dodržovat požadavky na subzpracovatele ve smlouvě <strong>Zákazníka</strong> se správcem.

### 5. Souhlas se zpracováním {#5-consent-to-processing}

<strong>Zákazník</strong> dodržel a bude nadále dodržovat všechny platné zákony na ochranu osobních údajů týkající se poskytování osobních údajů zákazníka <strong>Poskytovateli</strong> a/nebo službě, včetně všech zveřejnění, získání všech souhlasů, poskytnutí dostatečné volby a zavedení příslušných záruk požadovaných platnými zákony na ochranu osobních údajů.
### 6. Subzpracovatelé {#6-subprocessors}

a. <strong>Poskytovatel</strong> nebude poskytovat, přenášet ani předávat žádná osobní data zákazníka subzpracovateli, pokud <strong>Zákazník</strong> neschválil subzpracovatele. Aktuální seznam <strong>Schválených subzpracovatelů</strong> obsahuje identitu subzpracovatelů, jejich zemi působení a předpokládané úkoly zpracování. <strong>Poskytovatel</strong> bude <strong>Zákazníka</strong> informovat nejméně 10 pracovních dnů předem a písemně o jakýchkoli zamýšlených změnách ve <strong>Schválených subzpracovatelích</strong>, ať už přidáním nebo nahrazením subzpracovatele, což umožní <strong>Zákazníkovi</strong> mít dostatek času vznést námitky proti změnám před tím, než <strong>Poskytovatel</strong> začne používat nové subzpracovatele. <strong>Poskytovatel</strong> poskytne <strong>Zákazníkovi</strong> informace nezbytné k tomu, aby <strong>Zákazník</strong> mohl uplatnit své právo vznést námitku proti změně <strong>Schválených subzpracovatelů</strong>. <strong>Zákazník</strong> má 30 dní od oznámení změny <strong>Schválených subzpracovatelů</strong> na vznesení námitky, jinak se má za to, že <strong>Zákazník</strong> změny akceptuje. Pokud <strong>Zákazník</strong> vznesl námitku proti změně do 30 dnů od oznámení, <strong>Zákazník</strong> a <strong>Poskytovatel</strong> budou jednat v dobré víře, aby vyřešili námitku nebo obavy <strong>Zákazníka</strong>.

b. Při zapojení subzpracovatele bude mít <strong>Poskytovatel</strong> písemnou smlouvu se subzpracovatelem, která zajistí, že subzpracovatel bude přistupovat k osobním údajům zákazníka a používat je (i) pouze v rozsahu nezbytném k plnění povinností, které mu byly zadány, a (ii) v souladu s podmínkami <strong>Smlouvy</strong>.

c. Pokud se na zpracování osobních údajů zákazníka vztahuje GDPR, (i) povinnosti ochrany údajů popsané v této DPA (jak je uvedeno v článku 28 odst. 3 GDPR, pokud je to relevantní) se vztahují také na subzpracovatele, a (ii) smlouva <strong>Poskytovatele</strong> se subzpracovatelem tyto povinnosti zahrnuje, včetně podrobností o tom, jak <strong>Poskytovatel</strong> a jeho subzpracovatel budou koordinovat odpovědi na dotazy nebo žádosti týkající se zpracování osobních údajů zákazníka. Navíc <strong>Poskytovatel</strong> na žádost <strong>Zákazníka</strong> sdílí kopii svých smluv (včetně případných dodatků) se svými subzpracovateli. V rozsahu nezbytném k ochraně obchodních tajemství nebo jiných důvěrných informací, včetně osobních údajů, může <strong>Poskytovatel</strong> před sdílením kopie upravit text své smlouvy se subzpracovatelem.

d. <strong>Poskytovatel</strong> zůstává plně odpovědný za všechny povinnosti, které přenesl na své subzpracovatele, včetně činů a opomenutí svých subzpracovatelů při zpracování osobních údajů zákazníka. <strong>Poskytovatel</strong> bude informovat <strong>Zákazníka</strong> o jakémkoli selhání svých subzpracovatelů splnit podstatnou povinnost týkající se osobních údajů zákazníka podle smlouvy mezi <strong>Poskytovatelem</strong> a subzpracovatelem.


## 3. Omezené přenosy {#3-restricted-transfers}

### 1. Oprávnění {#1-authorization}

<strong>Zákazník</strong> souhlasí, že <strong>Poskytovatel</strong> může přenášet osobní údaje zákazníka mimo EHP, Spojené království nebo jiné relevantní geografické území, pokud je to nezbytné k poskytování služby. Pokud <strong>Poskytovatel</strong> přenáší osobní údaje zákazníka do území, pro které Evropská komise nebo jiný příslušný dozorový orgán nevydal rozhodnutí o přiměřenosti, <strong>Poskytovatel</strong> zajistí vhodná opatření pro přenos osobních údajů zákazníka do tohoto území v souladu s platnými zákony o ochraně údajů.

### 2. Přenosy mimo EHP {#2-ex-eea-transfers}

<strong>Zákazník</strong> a <strong>Poskytovatel</strong> souhlasí, že pokud GDPR chrání přenos osobních údajů zákazníka, přenos je z <strong>Zákazníka</strong> z EHP do <strong>Poskytovatele</strong> mimo EHP a přenos není řízen rozhodnutím o přiměřenosti Evropské komise, pak uzavřením této DPA se <strong>Zákazník</strong> a <strong>Poskytovatel</strong> považují za podepsané EHP standardní smluvní doložky a jejich přílohy, které jsou tímto začleněny odkazem. Jakýkoli takový přenos se provádí podle EHP standardních smluvních doložek, které jsou vyplněny následovně:
a. Modul Dva (Správce k Zpracovateli) EEA SCC se uplatňuje, když je <strong>Zákazník</strong> Správcem a <strong>Poskytovatel</strong> Zpracovatelem osobních údajů Zákazníka pro <strong>Zákazníka</strong> jako Zpracovatel.

b. Modul Tři (Zpracovatel k Podzpracovateli) EEA SCC se uplatňuje, když je <strong>Zákazník</strong> Zpracovatelem a <strong>Poskytovatel</strong> Zpracovává osobní údaje Zákazníka jménem <strong>Zákazníka</strong> jako Podzpracovatel.

c. Pro každý modul platí následující (pokud je to relevantní):

1. Nepoužívá se volitelná klauzule připojení v článku 7;

2. V článku 9 platí možnost 2 (obecné písemné povolení) a minimální lhůta pro předchozí oznámení změn Podzpracovatele je 10 pracovních dnů;

3. V článku 11 se volitelný text neuplatňuje;

4. Všechny hranaté závorky v článku 13 jsou odstraněny;

5. V článku 17 (možnost 1) se EEA SCC řídí právem <strong>Řídícího členského státu</strong>;

6. V článku 18(b) budou spory řešeny u soudů <strong>Řídícího členského státu</strong>; a

7. Úvodní stránka této DPA obsahuje informace požadované v přílohách I, II a III EEA SCC.

### 3. Přenosy mimo UK {#3-ex-uk-transfers}

<strong>Zákazník</strong> a <strong>Poskytovatel</strong> souhlasí, že pokud UK GDPR chrání přenos osobních údajů Zákazníka, přenos je z <strong>Zákazníka</strong> uvnitř Spojeného království na <strong>Poskytovatele</strong> mimo Spojené království a přenos není řízen rozhodnutím o přiměřenosti vydaným britským ministrem zahraničí, pak uzavřením této DPA se <strong>Zákazník</strong> a <strong>Poskytovatel</strong> považují za podepsané UK Dodatek a jejich přílohy, které jsou začleněny odkazem. Jakýkoli takový přenos se provádí podle UK Dodatku, který je vyplněn následovně:

a. Oddíl 3.2 této DPA obsahuje informace požadované v tabulce 2 UK Dodatku.

b. Tabulka 4 UK Dodatku je upravena takto: Žádná strana nesmí ukončit UK Dodatek, jak je stanoveno v oddílu 19 UK Dodatku; pokud ICO vydá revidovaný schválený dodatek podle oddílu ‎18 UK Dodatku, strany budou jednat v dobré víře, aby tuto DPA odpovídajícím způsobem upravily.

c. Úvodní stránka obsahuje informace požadované přílohami 1A, 1B, II a III UK Dodatku.

### 4. Ostatní mezinárodní přenosy {#4-other-international-transfers}

U přenosů osobních údajů, kde se na mezinárodní povahu přenosu vztahuje švýcarské právo (a nikoli právo členského státu EEA nebo Spojeného království), se odkazy na GDPR v článku 4 EEA SCC, pokud je to právně vyžadováno, upravují tak, aby odkazovaly na švýcarský federální zákon o ochraně údajů nebo jeho nástupce, a pojem dozorového úřadu bude zahrnovat švýcarského federálního komisaře pro ochranu údajů a informace.


## 4. Reakce na bezpečnostní incident {#4-security-incident-response}

1. Po zjištění jakéhokoli bezpečnostního incidentu <strong>Poskytovatel</strong>: (a) bez zbytečného odkladu, pokud je to možné, ale nejpozději do 72 hodin po zjištění bezpečnostního incidentu, oznámí <strong>Zákazníkovi</strong>; (b) poskytne včasné informace o bezpečnostním incidentu, jakmile budou známy nebo jak je rozumně požadováno <strong>Zákazníkem</strong>; a (c) neprodleně přijme rozumná opatření k omezení a vyšetření bezpečnostního incidentu. Oznámení nebo reakce <strong>Poskytovatele</strong> na bezpečnostní incident podle této DPA nebude vykládáno jako přiznání viny nebo odpovědnosti <strong>Poskytovatele</strong> za bezpečnostní incident.


## 5. Audit a zprávy {#5-audit--reports}

### 1. Práva na audit {#1-audit-rights}

<strong>Poskytovatel</strong> poskytne <strong>Zákazníkovi</strong> veškeré informace nezbytné k prokázání souladu s touto DPA a umožní a přispěje k auditům, včetně kontrol ze strany <strong>Zákazníka</strong>, za účelem posouzení souladu <strong>Poskytovatele</strong> s touto DPA. Nicméně <strong>Poskytovatel</strong> může omezit přístup k datům nebo informacím, pokud by přístup <strong>Zákazníka</strong> k těmto informacím negativně ovlivnil práva duševního vlastnictví <strong>Poskytovatele</strong>, povinnosti mlčenlivosti nebo jiné povinnosti podle platných právních předpisů. <strong>Zákazník</strong> bere na vědomí a souhlasí, že svá práva na audit podle této DPA a jakákoli práva na audit udělená platnými zákony o ochraně osobních údajů bude uplatňovat pouze tím, že nařídí <strong>Poskytovateli</strong> dodržovat níže uvedené požadavky na hlášení a náležitou péči. <strong>Poskytovatel</strong> bude uchovávat záznamy o svém souladu s touto DPA po dobu 3 let po ukončení DPA.
### 2. Zprávy o bezpečnosti {#2-security-reports}

<strong>Zákazník</strong> bere na vědomí, že <strong>Poskytovatel</strong> je pravidelně auditován nezávislými třetími stranami podle standardů definovaných v <strong>Bezpečnostní politice</strong>. Na písemnou žádost poskytne <strong>Poskytovatel</strong> <strong>Zákazníkovi</strong> důvěrnou kopii souhrnné verze své aktuální zprávy, aby si <strong>Zákazník</strong> mohl ověřit dodržování standardů definovaných v <strong>Bezpečnostní politice</strong>.

### 3. Bezpečnostní due diligence {#3-security-due-diligence}

Kromě Zprávy bude <strong>Poskytovatel</strong> reagovat na rozumné žádosti o informace ze strany <strong>Zákazníka</strong>, aby potvrdil dodržování této DPA, včetně odpovědí na dotazníky týkající se informační bezpečnosti, due diligence a auditů, nebo poskytnutím dalších informací o svém programu informační bezpečnosti. Všechny takové žádosti musí být písemné a adresované <strong>Kontaktu pro bezpečnost Poskytovatele</strong> a mohou být podány pouze jednou ročně.


## 6. Koordinace a spolupráce {#6-coordination--cooperation}

### 1. Reakce na dotazy {#1-response-to-inquiries}

Pokud <strong>Poskytovatel</strong> obdrží jakýkoli dotaz nebo žádost od kohokoli jiného ohledně zpracování osobních údajů Zákazníka, <strong>Poskytovatel</strong> o tom informuje <strong>Zákazníka</strong> a bez předchozího souhlasu <strong>Zákazníka</strong> na žádost neodpoví. Příklady takových dotazů a žádostí zahrnují soudní, správní nebo regulační příkaz týkající se osobních údajů Zákazníka, pokud oznámení <strong>Zákazníkovi</strong> není zakázáno platnými právními předpisy, nebo žádost od subjektu údajů. Pokud to dovolují platné právní předpisy, <strong>Poskytovatel</strong> bude postupovat podle rozumných pokynů <strong>Zákazníka</strong> ohledně těchto žádostí, včetně poskytování aktualizací stavu a dalších informací, které <strong>Zákazník</strong> rozumně požaduje. Pokud subjekt údajů učiní platnou žádost podle platných zákonů o ochraně osobních údajů o vymazání nebo odhlášení z poskytování osobních údajů Zákazníka <strong>Poskytovateli</strong>, <strong>Poskytovatel</strong> pomůže <strong>Zákazníkovi</strong> splnit tuto žádost v souladu s platnými zákony o ochraně osobních údajů. <strong>Poskytovatel</strong> bude spolupracovat a poskytovat rozumnou pomoc <strong>Zákazníkovi</strong>, na náklady <strong>Zákazníka</strong>, při jakékoli právní reakci nebo jiném procesním kroku, který <strong>Zákazník</strong> podnikne v reakci na žádost třetí strany týkající se zpracování osobních údajů Zákazníka podle této DPA.

### 2. DPIA a DTIA {#2-dpias-and-dtias}

Pokud to vyžadují platné zákony o ochraně osobních údajů, <strong>Poskytovatel</strong> rozumně pomůže <strong>Zákazníkovi</strong> při provádění jakýchkoli povinných posouzení dopadů na ochranu osobních údajů nebo posouzení dopadů přenosu dat a konzultací s příslušnými orgány pro ochranu osobních údajů, přičemž vezme v úvahu povahu zpracování a osobních údajů Zákazníka.


## 7. Vymazání osobních údajů Zákazníka {#7-deletion-of-customer-personal-data}

### 1. Vymazání ze strany Zákazníka {#1-deletion-by-customer}

<strong>Poskytovatel</strong> umožní <strong>Zákazníkovi</strong> vymazat osobní údaje Zákazníka způsobem, který je v souladu s funkcionalitou Služeb. <strong>Poskytovatel</strong> splní tento pokyn co nejdříve, jak je rozumně možné, kromě případů, kdy další uchovávání osobních údajů Zákazníka vyžaduje platný právní předpis.

### 2. Vymazání po vypršení platnosti DPA {#2-deletion-at-dpa-expiration}

a. Po vypršení platnosti DPA <strong>Poskytovatel</strong> vrátí nebo vymaže osobní údaje Zákazníka podle pokynů <strong>Zákazníka</strong>, pokud další uchovávání osobních údajů Zákazníka nevyžadují nebo neumožňují platné právní předpisy. Pokud je vrácení nebo zničení nepraktické nebo zakázané platnými zákony, <strong>Poskytovatel</strong> učiní rozumné kroky k zabránění dalšímu zpracování osobních údajů Zákazníka a bude i nadále chránit osobní údaje Zákazníka, které má ve své držbě, správě nebo kontrole. Například platné zákony mohou vyžadovat, aby <strong>Poskytovatel</strong> pokračoval v hostování nebo zpracování osobních údajů Zákazníka.
b. Pokud <strong>Zákazník</strong> a <strong>Poskytovatel</strong> uzavřeli EHP SCC nebo dodatky Spojeného království jako součást této DPA, <strong>Poskytovatel</strong> poskytne <strong>Zákazníkovi</strong> potvrzení o vymazání osobních údajů popsané v článku 8.1(d) a článku 8.5 EHP SCC pouze v případě, že o něj <strong>Zákazník</strong> požádá.


## 8. Omezení odpovědnosti {#8-limitation-of-liability}

### 1. Limity odpovědnosti a vzdání se náhrad škody {#1-liability-caps-and-damages-waiver}

**V maximálním rozsahu povoleném platnými zákony o ochraně osobních údajů bude celková kumulativní odpovědnost každé strany vůči druhé straně vyplývající z této DPA nebo s ní související podléhat vzdáním se, vyloučením a omezením odpovědnosti uvedeným ve <strong>Smlouvě</strong>.**

### 2. Nároky třetích stran {#2-related-party-claims}

**Veškeré nároky vznesené proti <strong>Poskytovateli</strong> nebo jeho přidruženým společnostem vyplývající z této DPA nebo s ní související mohou být vzneseny pouze subjektem <strong>Zákazníka</strong>, který je stranou <strong>Smlouvy</strong>.**

### 3. Výjimky {#3-exceptions}

1. Tato DPA neomezuje žádnou odpovědnost vůči jednotlivci ohledně jeho práv na ochranu osobních údajů podle platných zákonů o ochraně osobních údajů. Navíc tato DPA neomezuje žádnou odpovědnost mezi stranami za porušení EHP SCC nebo dodatků Spojeného království.


## 9. Konflikty mezi dokumenty {#9-conflicts-between-documents}

1. Tato DPA je součástí a doplňuje Smlouvu. Pokud existuje jakákoli nesrovnalost mezi touto DPA, <strong>Smlouvou</strong> nebo jejich částmi, řídí se nesrovnalost částí uvedených dříve před částmi uvedenými později v tomto pořadí: (1) EHP SCC nebo dodatky Spojeného království, (2) tato DPA, a poté (3) <strong>Smlouva</strong>.


## 10. Doba trvání smlouvy {#10-term-of-agreement}

Tato DPA začne platit, když <strong>Poskytovatel</strong> a <strong>Zákazník</strong> odsouhlasí úvodní stránku DPA a podepíší nebo elektronicky přijmou <strong>Smlouvu</strong>, a bude pokračovat až do vypršení platnosti nebo ukončení <strong>Smlouvy</strong>. Nicméně <strong>Poskytovatel</strong> a <strong>Zákazník</strong> zůstanou vázáni povinnostmi této DPA a platnými zákony o ochraně osobních údajů, dokud <strong>Zákazník</strong> nepřestane přenášet osobní údaje zákazníka <strong>Poskytovateli</strong> a <strong>Poskytovatel</strong> nepřestane zpracovávat osobní údaje zákazníka.


## 11. Rozhodné právo a vybrané soudy {#11-governing-law-and-chosen-courts}

Bez ohledu na ustanovení o rozhodném právu nebo podobná ustanovení ve <strong>Smlouvě</strong> se veškeré výklady a spory týkající se této DPA řídí právem <strong>Rozhodného státu</strong> bez ohledu na jeho kolizní normy. Navíc, bez ohledu na ustanovení o výběru fóra, jurisdikci nebo podobná ustanovení ve <strong>Smlouvě</strong>, se strany dohodly, že veškeré právní žaloby, akce nebo řízení týkající se této DPA budou vedeny a každá strana se neodvolatelně podřizuje výlučné jurisdikci soudů <strong>Rozhodného státu</strong>.


## 12. Vztah poskytovatele služeb {#12-service-provider-relationship}

V rozsahu, v jakém se vztahuje Kalifornský zákon o ochraně soukromí spotřebitelů, Cal. Civ. Code § 1798.100 a násl. ("CCPA"), strany potvrzují a souhlasí, že <strong>Poskytovatel</strong> je poskytovatelem služeb a přijímá osobní údaje od <strong>Zákazníka</strong> za účelem poskytování služby dle dohody ve <strong>Smlouvě</strong>, což představuje obchodní účel. <strong>Poskytovatel</strong> nebude prodávat žádné osobní údaje poskytnuté <strong>Zákazníkem</strong> podle <strong>Smlouvy</strong>. Dále <strong>Poskytovatel</strong> nebude uchovávat, používat ani zveřejňovat žádné osobní údaje poskytnuté <strong>Zákazníkem</strong> podle <strong>Smlouvy</strong> kromě případů nezbytných pro poskytování služby <strong>Zákazníkovi</strong>, jak je uvedeno ve <strong>Smlouvě</strong>, nebo jak je povoleno platnými zákony o ochraně osobních údajů. <strong>Poskytovatel</strong> potvrzuje, že rozumí omezením tohoto odstavce.
## 13. Definice {#13-definitions}

1. **„Použitelné zákony“** znamenají zákony, pravidla, předpisy, soudní příkazy a další závazné požadavky příslušného vládního orgánu, které se vztahují na nebo upravují stranu.

2. **„Použitelné zákony na ochranu údajů“** znamenají Použitelné zákony, které upravují, jak může Služba zpracovávat nebo používat osobní informace, osobní údaje, osobně identifikovatelné informace nebo jiný podobný termín jednotlivce.

3. **„Správce“** bude mít význam(y) uvedené v Použitelných zákonech na ochranu údajů pro společnost, která určuje účel a rozsah zpracování osobních údajů.

4. **„Úvodní stránka“** znamená dokument, který je podepsán nebo elektronicky přijat stranami a který obsahuje tyto Standardní podmínky DPA a identifikuje <strong>Poskytovatele</strong>, <strong>Zákazníka</strong> a předmět a podrobnosti zpracování údajů.

5. **„Osobní údaje zákazníka“** znamenají osobní údaje, které <strong>Zákazník</strong> nahraje nebo poskytne <strong>Poskytovateli</strong> jako součást Služby a které jsou upraveny touto DPA.

6. **„DPA“** znamená tyto Standardní podmínky DPA, Úvodní stránku mezi <strong>Poskytovatelem</strong> a <strong>Zákazníkem</strong> a zásady a dokumenty uvedené v Úvodní stránce nebo k ní přiložené.

7. **„EEA SCCs“** znamenají standardní smluvní doložky připojené k prováděcímu rozhodnutí Evropské komise 2021/914 ze dne 4. června 2021 o standardních smluvních doložkách pro přenos osobních údajů do třetích zemí podle nařízení (EU) 2016/679 Evropského parlamentu a Rady.

8. **„Evropský hospodářský prostor“** nebo **„EHP“** znamená členské státy Evropské unie, Norsko, Island a Lichtenštejnsko.

9. **„GDPR“** znamená nařízení Evropské unie 2016/679, jak je implementováno místními zákony v příslušném členském státě EHP.

10. **„Osobní údaje“** budou mít význam(y) uvedené v Použitelných zákonech na ochranu údajů pro osobní informace, osobní údaje nebo jiný podobný termín.

11. **„Zpracování“** nebo **„Zpracovávat“** bude mít význam(y) uvedené v Použitelných zákonech na ochranu údajů pro jakékoli použití nebo provedení počítačové operace na osobních údajích, včetně automatických metod.

12. **„Zpracovatel“** bude mít význam(y) uvedené v Použitelných zákonech na ochranu údajů pro společnost, která zpracovává osobní údaje jménem správce.

13. **„Zpráva“** znamená auditní zprávy připravené jinou společností podle standardů definovaných v Bezpečnostní politice jménem Poskytovatele.

14. **„Omezený přenos“** znamená (a) pokud se vztahuje GDPR, přenos osobních údajů z EHP do země mimo EHP, která není předmětem rozhodnutí o přiměřenosti Evropské komise; a (b) pokud se vztahuje UK GDPR, přenos osobních údajů z Velké Británie do jakékoli jiné země, která není předmětem předpisů o přiměřenosti přijatých podle oddílu 17A britského zákona o ochraně údajů z roku 2018.

15. **„Bezpečnostní incident“** znamená porušení osobních údajů, jak je definováno v článku 4 GDPR.

16. **„Služba“** znamená produkt a/nebo služby popsané v <strong>Smlouvě</strong>.

17. **„Zvláštní kategorie údajů“** bude mít význam uvedený v článku 9 GDPR.

18. **„Subzpracovatel“** bude mít význam(y) uvedené v Použitelných zákonech na ochranu údajů pro společnost, která s schválením a přijetím správce pomáhá zpracovateli se zpracováním osobních údajů jménem správce.

19. **„UK GDPR“** znamená nařízení Evropské unie 2016/679, jak je implementováno oddílem 3 britského zákona o vystoupení z Evropské unie (Withdrawal) Act z roku 2018 ve Velké Británii.

20. **„UK dodatěk“** znamená mezinárodní dodatek k přenosu údajů k EEA SCCs vydaný Úřadem pro informace pro strany provádějící omezené přenosy podle S119A(1) zákona o ochraně údajů z roku 2018.


## Poděkování {#credits}

Tento dokument je odvozeninou [Common Paper DPA Standard Terms (Verze 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) a je licencován pod [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
