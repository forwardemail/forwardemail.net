# Smlouva o zpracování dat {#data-processing-agreement}

<!-- v1.0 z <https://github.com/CommonPaper/DPA> -->

<img loading="lazy" src="/img/articles/dpa.webp" alt="" class="rounded-lg" />

__CHRÁNĚNÁ_URL_4__ Obsah {__CHRÁNĚNÁ_URL_5__

* [Klíčové pojmy](#key-terms)
* [Změny Smlouvy](#changes-to-the-agreement)
* [1. Vztahy mezi procesory a subprocesory](#1-processor-and-subprocessor-relationships)
  * [1. Poskytovatel jako zpracovatel](#1-provider-as-processor)
  * [2. Poskytovatel jako dílčí zpracovatel](#2-provider-as-subprocessor)
* [2. Zpracování](#2-processing)
  * [1. Podrobnosti o zpracování](#1-processing-details)
  * [2. Pokyny pro zpracování](#2-processing-instructions)
  * [3. Zpracování Poskytovatelem](#3-processing-by-provider)
  * [4. Zákaznické zpracování](#4-customer-processing)
  * [5. Souhlas se zpracováním](#5-consent-to-processing)
  * [6. Subzpracovatelé](#6-subprocessors)
* [3. Omezené převody](#3-restricted-transfers)
  * [1. Autorizace](#1-authorization)
  * [2. Převody z EHP](#2-ex-eea-transfers)
  * [3. Převody ze Spojeného království](#3-ex-uk-transfers)
  * [4. Jiné mezinárodní převody](#4-other-international-transfers)
* [4. Reakce na bezpečnostní incident](#4-security-incident-response)
* [5. Audit a zprávy](#5-audit--reports)
  * [1. Práva auditu](#1-audit-rights)
  * [2. Bezpečnostní zprávy](#2-security-reports)
  * [3. Bezpečnostní due diligence](#3-security-due-diligence)
* [6. Koordinace a spolupráce](#6-coordination--cooperation)
  * [1. Reakce na dotazy](#1-response-to-inquiries)
  * [2. DPIA a DTIA](#2-dpias-and-dtias)
* [7. Výmaz osobních údajů zákazníka](#7-deletion-of-customer-personal-data)
  * [1. Vymazání zákazníkem](#1-deletion-by-customer)
  * [2. Smazání při vypršení platnosti DPA](#2-deletion-at-dpa-expiration)
* [8. Omezení odpovědnosti](#8-limitation-of-liability)
  * [1. Omezení odpovědnosti a zřeknutí se škod](#1-liability-caps-and-damages-waiver)
  * [2. Nároky spřízněných stran](#2-related-party-claims)
  * [3. Výjimky](#3-exceptions)
* [9. Konflikty mezi dokumenty](#9-conflicts-between-documents)
* [10. Doba trvání smlouvy](#10-term-of-agreement)
* [11. Rozhodné právo a vybrané soudy](#11-governing-law-and-chosen-courts)
* [12. Vztah poskytovatele služeb](#12-service-provider-relationship)
* [13. Definice](#13-definitions)
* [Kredity](#credits)

__CHRÁNĚNÁ_URL_6__ Klíčové pojmy {__CHRÁNĚNÁ_URL_7__

| Období | Hodnota |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dohoda | Tato dohoda o zpracování dat (DPA) doplňuje [Terms of Service](/terms) |
| <strong>Schválení subzpracovatelé</strong> | [Cloudflare](https://cloudflare.com) (USA; poskytovatel DNS, sítí a zabezpečení), [DataPacket](https://www.datapacket.com/) (USA/Spojené království; poskytovatel hostingu), [Digital Ocean](https://digitalocean.com) (USA; poskytovatel hostingu), [Vultr](https://www.vultr.com) (USA; poskytovatel hostingu), [Stripe](https://stripe.com) (USA; zpracovatel plateb), [PayPal](https://paypal.com) (USA; zpracovatel plateb) |
| <strong>Kontakt pro zabezpečení poskytovatele</strong> | <a href="mailto:security@forwardemail.net"><security@forwardemail.net></a> |
| <strong>Bezpečnostní zásady</strong> | Zobrazit [our Security Policy on GitHub](https://github.com/forwardemail/forwardemail.net/security/policy) |
| <strong>Řídící stát</strong> | Stát Delaware, Spojené státy americké |

## Změny smlouvy {#changes-to-the-agreement}

Tento dokument je odvozen od [Společné tištěné standardní podmínky DPA (verze 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) a byly provedeny následující změny:

1. [Rozhodné právo a vybrané soudy](#11-governing-law-and-chosen-courts) byl zahrnut jako sekce níže s `Governing State` identifikovaným výše.
2. [Vztah poskytovatele služeb](#12-service-provider-relationship) byl zahrnut jako sekce níže.

## 1. Vztahy mezi zpracovateli a subzpracovateli {#1-processor-and-subprocessor-relationships}

### 1. Poskytovatel jako zpracovatel {#1-provider-as-processor}

V situacích, kdy je <strong>Zákazník</strong> Správcem Osobních údajů Zákazníka, bude <strong>Poskytovatel</strong> považován za Zpracovatele, který Zpracovává Osobní údaje jménem <strong>Zákazníka</strong>.

### 2. Poskytovatel jako subzpracovatel {#2-provider-as-subprocessor}

V situacích, kdy je <strong>Zákazník</strong> Zpracovatelem Osobních údajů Zákazníka, bude <strong>Poskytovatel</strong> považován za Subzpracovatele Osobních údajů Zákazníka.

__CHRÁNĚNÁ_URL_16__ 2. Zpracování {__CHRÁNĚNÁ_URL_17__

### 1. Podrobnosti o zpracování {#1-processing-details}

Příloha I(B) na titulní straně popisuje předmět, povahu, účel a dobu trvání tohoto zpracování, jakož i **kategorie shromažďovaných osobních údajů** a **kategorie subjektů údajů**.

### 2. Pokyny ke zpracování {#2-processing-instructions}

<strong>Zákazník</strong> pověřuje <strong>Poskytovatele</strong> zpracováním osobních údajů zákazníků: (a) za účelem poskytování a údržby Služby; (b) jak může být dále specifikováno v rámci používání Služby zákazníkem; (c) jak je zdokumentováno ve <strong>Smlouvě</strong>; a (d) jak je zdokumentováno v jakýchkoli jiných písemných pokynech poskytnutých <strong>Zákazníkem</strong> a potvrzených <strong>Poskytovatelem</strong> ohledně zpracování osobních údajů zákazníků v rámci této Dohody o zpracování osobních údajů. <strong>Poskytovatel</strong> se bude těmito pokyny řídit, pokud to nezakazují Platné právní předpisy. <strong>Poskytovatel</strong> bude <strong>Zákazníka</strong> neprodleně informovat, pokud nebude moci pokyny ke zpracování dodržovat. <strong>Zákazník</strong> vydal a bude dávat pouze pokyny, které jsou v souladu s Platnými právními předpisy.

### 3. Zpracování poskytovatelem {#3-processing-by-provider}

<strong>Poskytovatel</strong> bude zpracovávat osobní údaje zákazníků pouze v souladu s touto dohodou o zpracování osobních údajů (DPA), včetně podrobností uvedených na titulní straně. Pokud <strong>Poskytovatel</strong> aktualizuje Službu za účelem aktualizace stávajících nebo zahrnutí nových produktů, funkcí či možností, může <strong>Poskytovatel</strong> podle potřeby změnit <strong>Kategorie subjektů údajů</strong>, <strong>Kategorie osobních údajů</strong>, <strong>Údaje zvláštní kategorie</strong>, <strong>Omezení nebo ochranná opatření pro údaje zvláštní kategorie</strong>, <strong>Četnost přenosu</strong>, <strong>Povahu a účel zpracování</strong> a <strong>Dobu trvání zpracování</strong> tak, aby odrážely aktualizace, a to oznámením <strong>Zákazníka</strong> o aktualizacích a změnách.

### 4. Zpracování zákazníků {#4-customer-processing}

Pokud je <strong>Zákazník</strong> Zpracovatelem a <strong>Poskytovatel</strong> Subzpracovatelem, bude <strong>Zákazník</strong> dodržovat všechny Platné zákony, které se vztahují na <strong>Zákazníkovo</strong> zpracování osobních údajů. Smlouva <strong>Zákazníka</strong> s jeho Správcem bude obdobně vyžadovat, aby <strong>Zákazník</strong> dodržoval všechny Platné zákony, které se vztahují na <strong>Zákazníka</strong> jako Zpracovatele. Kromě toho bude <strong>Zákazník</strong> dodržovat požadavky na Subzpracovatele uvedené v <strong>Zákazníkově</strong> smlouvě s jeho Správcem.

### 5. Souhlas se zpracováním {#5-consent-to-processing}

<strong>Zákazník</strong> dodržel a bude i nadále dodržovat všechny platné zákony na ochranu osobních údajů týkající se poskytování osobních údajů zákazníka <strong>Poskytovateli</strong> a/nebo Službě, včetně provedení všech zveřejnění, získání všech souhlasů, poskytnutí odpovídající volby a zavedení příslušných ochranných opatření požadovaných platnými zákony na ochranu osobních údajů.

### 6. Dílčí zpracovatelé {#6-subprocessors}

a. <strong>Poskytovatel</strong> neposkytne, nepřevede ani nepředá žádné Osobní údaje Zákazníka Dílčímu zpracovateli, pokud <strong>Zákazník</strong> Dílčího zpracovatele neschválí. Aktuální seznam <strong>Schválených Dílčích zpracovatelů</strong> zahrnuje totožnost Dílčích zpracovatelů, jejich zemi sídla a jejich předpokládané úkoly zpracování. <strong>Poskytovatel</strong> bude <strong>Zákazníka</strong> informovat nejméně 10 pracovních dnů předem a písemně o všech zamýšlených změnách <strong>Schválených Dílčích zpracovatelů</strong>, ať už přidáním nebo nahrazením Dílčího zpracovatele, což <strong>Zákazníkovi</strong> umožní dostatek času na vznesení námitek proti změnám dříve, než <strong>Poskytovatel</strong> začne využívat nového(é) Dílčího(é) zpracovatele(ů). <strong>Poskytovatel</strong> poskytne <strong>Zákazníkovi</strong> informace nezbytné k tomu, aby mohl <strong>Zákazník</strong> uplatnit své právo vznést námitky proti změně <strong>Schválených Dílčích zpracovatelů</strong>. <strong>Zákazník</strong> má 30 dní od oznámení změny <strong>Schválených subzpracovatelů</strong> na vznesení námitky, jinak se má za to, že <strong>Zákazník</strong> změny přijal. Pokud <strong>Zákazník</strong> vznese námitku proti změně do 30 dnů od oznámení, <strong>Zákazník</strong> a <strong>Poskytovatel</strong> budou v dobré víře spolupracovat na vyřešení <strong>Zákazníkovy</strong> námitky nebo obavy.

b. Při zapojení subdodavatele bude mít poskytovatel s ním písemnou smlouvu, která zajistí, že subdodavatel bude přistupovat k osobním údajům zákazníka a používat je pouze (i) v rozsahu nezbytném k plnění povinností, které mu byly svěřeny, a (ii) v souladu s podmínkami smlouvy.

c. Pokud se na zpracování osobních údajů zákazníků vztahuje GDPR, (i) povinnosti týkající se ochrany osobních údajů popsané v tomto DPA (jak je uvedeno v článku 28(3) GDPR, pokud je to relevantní) jsou uloženy i subdodavateli a (ii) smlouva mezi poskytovatelem a subdodavatelem bude zahrnovat tyto povinnosti, včetně podrobností o tom, jak budou poskytovatel a jeho subdodavatel koordinovat své reakce na dotazy nebo žádosti týkající se zpracování osobních údajů zákazníků. Kromě toho poskytovatel na žádost zákazníka sdílí kopii svých smluv (včetně případných dodatků) se svými subdodavateli. V rozsahu nezbytném k ochraně obchodního tajemství nebo jiných důvěrných informací, včetně osobních údajů, může poskytovatel před sdílením kopie text své smlouvy se subdodavatelem redigovat.

d. <strong>Poskytovatel</strong> zůstává plně odpovědný za všechny závazky svěřené jeho subdodavatelům, včetně jednání a opomenutí jeho subdodavatelů při zpracování osobních údajů zákazníků. <strong>Poskytovatel</strong> bude zákazníka informovat o jakémkoli neplnění podstatné povinnosti ze strany jeho subdodavatelů týkající se osobních údajů zákazníků podle smlouvy mezi <strong>Poskytovatelem</strong> a subdodavatelem.

## 3. Omezené převody {#3-restricted-transfers}

### 1. Autorizace {#1-authorization}

<strong>Zákazník</strong> souhlasí s tím, že <strong>Poskytovatel</strong> může v případě potřeby převést Osobní údaje Zákazníka mimo EHP, Spojené království nebo jiné relevantní zeměpisné území k poskytování Služby. Pokud <strong>Poskytovatel</strong> převede Osobní údaje Zákazníka na území, pro které Evropská komise nebo jiný příslušný orgán dohledu nevydal rozhodnutí o odpovídající ochraně, <strong>Poskytovatel</strong> zavede vhodná ochranná opatření pro přenos Osobních údajů Zákazníka na toto území v souladu s Platnými zákony na ochranu osobních údajů.

### 2. Převody mimo EHP {#2-ex-eea-transfers}

<strong>Zákazník</strong> a <strong>Poskytovatel</strong> se dohodli, že pokud GDPR chrání přenos osobních údajů zákazníků, přenos probíhá od <strong>Zákazníka</strong> z EHP k <strong>Poskytovateli</strong> mimo EHP a přenos se neřídí rozhodnutím o odpovídající ochraně vydaným Evropskou komisí, pak uzavřením této Dohody o zpracování osobních údajů se má za to, že <strong>Zákazník</strong> a <strong>Poskytovatel</strong> podepsali standardní smluvní podmínky EHP a jejich přílohy, které jsou začleněny odkazem. Jakýkoli takový přenos se provádí v souladu se standardními smluvními podmínkami EHP, které jsou doplněny takto:

a. Modul dva (od správce ke zpracovateli) standardních smluvních doložek EHP se uplatní, pokud je <strong>Zákazník</strong> správcem a <strong>Poskytovatel</strong> zpracovává osobní údaje zákazníka pro <strong>Zákazníka</strong> jako zpracovatel.

b. Modul tři (Zpracovatel vůči Subzpracovateli) standardních smluvních doložek EHP se uplatní, pokud je <strong>Zákazník</strong> Zpracovatelem a <strong>Poskytovatel</strong> zpracovává osobní údaje Zákazníka jménem <strong>Zákazníka</strong> jako Subzpracovatel.

C. Pro každý modul platí následující (pokud je to možné):

1. Volitelná klauzule o dokování v článku 7 se nepoužije;

2. V článku 9 se uplatňuje možnost 2 (obecné písemné zmocnění) a minimální lhůta pro předchozí oznámení změn subdodavatele je 10 pracovních dnů;

3. V článku 11 se nepoužije volitelné znění;

4. Všechny hranaté závorky v článku 13 se odstraňují;

5. V článku 17 (možnost 1) se standardní smluvní doložky EHP budou řídit právem **rozhodného členského státu**;

6. V článku 18(b) budou spory řešeny u soudů **řídícího členského státu**; a

7. Titulní strana této dohody o zpracování dat obsahuje informace požadované v příloze I, příloze II a příloze III standardních smluvních doložek EHP.

### 3. Převody z/do Spojeného království {#3-ex-uk-transfers}

<strong>Zákazník</strong> a <strong>Poskytovatel</strong> se dohodli, že pokud britské GDPR chrání přenos osobních údajů zákazníků, přenos probíhá od <strong>Zákazníka</strong> ze Spojeného království k <strong>Poskytovateli</strong> mimo Spojené království a přenos se neřídí rozhodnutím o odpovídající ochraně vydaným ministrem zahraničí Spojeného království, pak uzavřením této DPA se má za to, že <strong>Zákazník</strong> a <strong>Poskytovatel</strong> podepsali dodatek pro Spojené království a jeho přílohy, které jsou začleněny odkazem. Jakýkoli takový přenos se provádí v souladu s dodatkem pro Spojené království, který se vyplňuje takto:

A. Oddíl 3.2 této DPA obsahuje informace požadované v tabulce 2 dodatku pro Spojené království.

b. Tabulka 4 Dodatku pro Spojené království je upravena takto: Žádná ze stran nesmí ukončit Dodatek pro Spojené království, jak je uvedeno v části 19 Dodatku pro Spojené království; v rozsahu, v jakém ICO vydá revidovaný schválený dodatek podle oddílu ‎18 dodatku pro Spojené království, budou strany v dobré víře pracovat na odpovídající revizi tohoto DPA.

C. Titulní strana obsahuje informace požadované přílohou 1A, přílohou 1B, přílohou II a přílohou III dodatku Spojeného království.

### 4. Ostatní mezinárodní převody {#4-other-international-transfers}

U předávání osobních údajů, kde se na mezinárodní povahu předávání vztahuje švýcarské právo (a nikoli právo v žádném členském státě EHP nebo Spojeném království), jsou odkazy na GDPR v článku 4 SCC EHP v rozsahu, v jakém to vyžaduje zákon, pozměněny tak, aby odkazovaly na švýcarský federální zákon o ochraně údajů nebo jeho nástupce, a pojem dozorčího úřadu bude zahrnovat švýcarského federálního komisaře pro ochranu údajů a informací.

## 4. Reakce na bezpečnostní incident {#4-security-incident-response}

1. Jakmile se <strong>Poskytovatel</strong> dozví o jakémkoli bezpečnostním incidentu, <strong>(poskytovatel)</strong>: (a) bez zbytečného odkladu informuje <strong>Zákazníka</strong>, pokud je to proveditelné, nejpozději však do 72 hodin od zjištění bezpečnostního incidentu; (b) poskytne včasné informace o bezpečnostním incidentu, jakmile se o něm dozví nebo jak si <strong>Zákazník</strong> rozumně vyžádá; a (c) neprodleně podnikne přiměřené kroky k omezení a vyšetření bezpečnostního incidentu. Oznámení <strong>Poskytovatele</strong> o bezpečnostním incidentu nebo jeho reakce na něj, jak vyžaduje tato Dohoda o zpracování dat, nebude vykládáno jako uznání jakékoli viny nebo odpovědnosti za bezpečnostní incident ze strany <strong>Poskytovatele</strong>.

__CHRÁNĚNÁ_URL_42__ 5. Audit a zprávy {__CHRÁNĚNÁ_URL_43__

__CHRÁNĚNÁ_URL_44__ 1. Auditní práva {__CHRÁNĚNÁ_URL_45__

<strong>Poskytovatel</strong> poskytne <strong>Zákazníkovi</strong> veškeré informace přiměřeně nezbytné k prokázání souladu s touto Dohodou o ochraně osobních údajů (DPA) a <strong>Poskytovatel</strong> umožní a bude se podílet na auditech, včetně inspekcí ze strany <strong>Zákazníka</strong>, za účelem posouzení souladu s touto Dohodou o ochraně osobních údajů ze strany <strong>Poskytovatel</strong>. <strong>Poskytovatel</strong> však může omezit přístup k datům nebo informacím, pokud by přístup <strong>Zákazníka</strong> k informacím negativně ovlivnil práva duševního vlastnictví <strong>Poskytovatele</strong>, povinnosti mlčenlivosti nebo jiné povinnosti podle Platných zákonů. <strong>Zákazník</strong> bere na vědomí a souhlasí s tím, že svá auditorská práva podle této Dohody o ochraně osobních údajů a veškerá auditorská práva udělená Platnými zákony o ochraně osobních údajů uplatní pouze tím, že <strong>Poskytovateli</strong> dá pokyn k dodržování níže uvedených požadavků na podávání zpráv a due diligence. <strong>Poskytovatel</strong> bude uchovávat záznamy o svém souladu s touto Dohodou o ochraně osobních údajů po dobu 3 let po skončení Dohody.

### 2. Bezpečnostní zprávy {#2-security-reports}

<strong>Zákazník</strong> bere na vědomí, že <strong>Poskytovatel</strong> je pravidelně auditován podle standardů definovaných v <strong>Bezpečnostních zásadách</strong> nezávislými externími auditory. Na písemnou žádost <strong>Poskytovatel</strong> poskytne <strong>Zákazníkovi</strong> důvěrně souhrnnou kopii své aktuální zprávy, aby <strong>Zákazník</strong> mohl ověřit, zda <strong>Poskytovatel</strong> dodržuje standardy definované v <strong>Bezpečnostních zásadách</strong>.

### 3. Bezpečnostní due diligence {#3-security-due-diligence}

Kromě Zprávy bude <strong>Poskytovatel</strong> reagovat na přiměřené žádosti o informace podané <strong>Zákazníkem</strong> za účelem potvrzení souladu <strong>Poskytovatele</strong> s touto Dohodou o zpracování dat, včetně odpovědí na dotazníky týkající se bezpečnosti informací, due diligence a auditu, nebo poskytnutím dalších informací o jeho programu bezpečnosti informací. Všechny takové žádosti musí být písemné a doručené <strong>kontaktní osobě poskytovatele pro bezpečnost</strong> a lze je podat pouze jednou ročně.

## 6. Koordinace a spolupráce {#6-coordination--cooperation}

### 1. Odpověď na dotazy {#1-response-to-inquiries}

Pokud <strong>Poskytovatel</strong> obdrží od kohokoli jiného dotaz nebo žádost týkající se zpracování osobních údajů zákazníků, <strong>Poskytovatel</strong> o žádosti <strong>Zákazníka</strong> informuje a <strong>Poskytovatel</strong> na žádost bez předchozího souhlasu <strong>Zákazníka</strong> neodpoví. Mezi příklady těchto dotazů a žádostí patří soudní, správní nebo regulační příkaz týkající se osobních údajů zákazníků, pokud informování <strong>Zákazníka</strong> není zakázáno platnými právními předpisy, nebo žádost subjektu údajů. Pokud to platné právní předpisy umožňují, <strong>Poskytovatel</strong> se bude řídit přiměřenými pokyny <strong>Zákazníka</strong> ohledně těchto žádostí, včetně poskytování aktualizací stavu a dalších informací, které <strong>Zákazník</strong> přiměřeně požaduje. Pokud subjekt údajů podá platnou žádost podle platných zákonů na ochranu osobních údajů o smazání nebo odhlášení z poskytování osobních údajů zákazníka poskytovateli, poskytovatel pomůže zákazníkovi s vyřízením žádosti v souladu s platnými zákony na ochranu osobních údajů. poskytovatel bude se zákazníkem spolupracovat a poskytne mu přiměřenou pomoc na jeho náklady při jakékoli právní reakci nebo jiném procesním úkonu, který zákazník podnikne v reakci na žádost třetí strany týkající se zpracování osobních údajů zákazníka poskytovatelem v souladu s touto dohodou o zpracování osobních údajů.

### 2. Posouzení vlivu na ochranu osobních údajů a posouzení odvrácení dopadu na ochranu osobních údajů {#2-dpias-and-dtias}

Pokud to vyžadují platné zákony na ochranu osobních údajů, <strong>Poskytovatel</strong> bude <strong>Zákazníkovi</strong> přiměřeně pomáhat s prováděním jakýchkoli povinných posouzení vlivu na ochranu osobních údajů nebo posouzení vlivu na přenos dat a konzultací s příslušnými orgány pro ochranu osobních údajů, s přihlédnutím k povaze Zpracování a Osobních údajů Zákazníka.

## 7. Smazání osobních údajů zákazníka {#7-deletion-of-customer-personal-data}

### 1. Smazání zákazníkem {#1-deletion-by-customer}

Poskytovatel umožní Zákazníkovi smazat Osobní údaje Zákazníka způsobem, který je v souladu s funkčností Služeb. Poskytovatel se tomuto pokynu bude řídit, jakmile to bude přiměřeně proveditelné, s výjimkou případů, kdy je další uchovávání Osobních údajů Zákazníka vyžadováno Platnými právními předpisy.

### 2. Smazání po vypršení platnosti DPA {#2-deletion-at-dpa-expiration}

a. Po uplynutí platnosti DPA <strong>Poskytovatel</strong> vrátí nebo smaže Osobní údaje Zákazníka na pokyn <strong>Zákazníka</strong>, pokud není další ukládání Osobních údajů Zákazníka vyžadováno nebo povoleno Platnými právními předpisy. Pokud je vrácení nebo zničení neproveditelné nebo zakázáno Platnými právními předpisy, <strong>Poskytovatel</strong> vynaloží přiměřené úsilí, aby zabránil dalšímu zpracování Osobních údajů Zákazníka, a bude i nadále chránit Osobní údaje Zákazníka, které zůstávají v jeho držení, úschově nebo pod jeho kontrolou. Platné právní předpisy mohou například vyžadovat, aby <strong>Poskytovatel</strong> pokračoval v ukládání nebo zpracování Osobních údajů Zákazníka.

b. Pokud <strong>Zákazník</strong> a <strong>Poskytovatel</strong> v rámci této Dohody o zpracování osobních údajů uzavřeli SSD EHP nebo dodatek Spojeného království, <strong>Poskytovatel</strong> vydá <strong>Zákazníkovi</strong> potvrzení o výmazu Osobních údajů popsané v článku 8.1(d) a článku 8.5 SSD EHP pouze tehdy, pokud si o něj <strong>Zákazník</strong> požádá.

__CHRÁNĚNÁ_URL_62__ 8. Omezení odpovědnosti {__CHRÁNĚNÁ_URL_63__

### 1. Limity odpovědnosti a zřeknutí se odpovědnosti za škody {#1-liability-caps-and-damages-waiver}

**V maximálním rozsahu povoleném platnými zákony na ochranu osobních údajů bude celková kumulativní odpovědnost každé strany vůči druhé straně vyplývající z této DPA nebo s ní související podléhat zřeknutí se odpovědnosti, vyloučení a omezením odpovědnosti uvedeným ve **Smlouvě**.**

### 2. Nároky spřízněných stran {#2-related-party-claims}

**Veškeré nároky uplatněné vůči <strong>Poskytovateli</strong> nebo jeho Přidruženým společnostem vyplývající z této Dohody o zpracování osobních údajů nebo s ní související mohou být uplatněny pouze <strong>Zákazníkem</strong>, který je stranou <strong>Smlouvy</strong>.**

### 3. Výjimky {#3-exceptions}

1. Tato dohoda o ochraně osobních údajů (DPA) neomezuje žádnou odpovědnost vůči jednotlivci ohledně jeho práv na ochranu osobních údajů podle platných zákonů o ochraně osobních údajů. Tato dohoda o ochraně osobních údajů dále neomezuje žádnou odpovědnost mezi stranami za porušení standardních smluvních doložek EHP nebo dodatku Spojeného království.

## 9. Konflikty mezi dokumenty {#9-conflicts-between-documents}

1. Tato Dohoda o zpracování dat (DPA) je součástí Dohody a doplňuje ji. V případě jakéhokoli rozporu mezi touto Dohodou o zpracování dat, Dohodou nebo některou z jejich částí má přednost část uvedená dříve před částí uvedenou dále v případě daného rozporu: (1) Standardní smluvní doložky EHP nebo dodatek Spojeného království, (2) tato Dohoda o zpracování dat a poté (3) Dohoda o zpracování dat.

## 10. Doba trvání smlouvy {#10-term-of-agreement}

Tato Dohoda o ochraně osobních údajů (DPA) začne platit okamžikem, kdy se <strong>Poskytovatel</strong> a <strong>Zákazník</strong> dohodnou na titulní straně Dohody o ochraně osobních údajů a podepíší nebo elektronicky přijmou <strong>Smlouvu</strong>, a bude platit až do vypršení platnosti nebo ukončení <strong>Smlouvy</strong>. <strong>Poskytovatel</strong> i <strong>Zákazník</strong> však budou i nadále vázáni povinnostmi vyplývajícími z této Dohody o ochraně osobních údajů a platných zákonů na ochranu osobních údajů, dokud <strong>Zákazník</strong> nepřestane předávat Osobní údaje zákazníka <strong>Poskytovateli</strong> a <strong>Poskytovatel</strong> nepřestane Osobní údaje zákazníka zpracovávat.

__CHRÁNĚNÁ_URL_74__ 11. Rozhodné právo a zvolené soudy {__CHRÁNĚNÁ_URL_75__

Bez ohledu na rozhodné právo nebo podobná ustanovení Smlouvy se veškeré výklady a spory týkající se této Dohody o zpracování dat řídí zákony Správního státu bez ohledu na jeho ustanovení o kolizi právních norem. Kromě toho a bez ohledu na výběr soudu, jurisdikci nebo podobná ustanovení Smlouvy se strany dohodly, že jakékoli soudní spory, žaloby nebo řízení týkající se této Dohody o zpracování dat budou vést u soudů Správního státu a každá strana se neodvolatelně podřizuje výlučné jurisdikci těchto soudů.

## 12. Vztah s poskytovatelem služeb {#12-service-provider-relationship}

V rozsahu, v jakém se uplatňuje kalifornský zákon o ochraně soukromí spotřebitelů, kalifornský občanský zákoník § 1798.100 a násl. („CCPA“), strany berou na vědomí a souhlasí s tím, že <strong>Poskytovatel</strong> je poskytovatelem služeb a přijímá osobní údaje od <strong>Zákazníka</strong> za účelem poskytování Služby, jak je dohodnuto ve <strong>Smlouvě</strong>, což představuje obchodní účel. <strong>Poskytovatel</strong> nebude prodávat žádné osobní údaje poskytnuté <strong>Zákazníkem</strong> v rámci <strong>Smlouvy</strong>. Kromě toho <strong>Poskytovatel</strong> nebude uchovávat, používat ani zveřejňovat žádné osobní údaje poskytnuté <strong>Zákazníkem</strong> v rámci <strong>Smlouvy</strong>, s výjimkou případů, kdy je to nezbytné pro poskytování Služby pro <strong>Zákazníka</strong>, jak je uvedeno ve <strong>Smlouvě</strong>, nebo jak to povolují platné zákony na ochranu osobních údajů. <strong>Poskytovatel</strong> potvrzuje, že rozumí omezením tohoto odstavce.

__CHRÁNĚNÁ_URL_78__ 13. Definice {__CHRÁNĚNÁ_URL_79__

1. **„Platné zákony“** znamenají zákony, pravidla, nařízení, soudní příkazy a další závazné požadavky příslušného vládního orgánu, které se vztahují na stranu nebo se jimi řídí.

2. **„Příslušné zákony na ochranu osobních údajů“** znamenají Příslušné zákony, které upravují, jak může Služba zpracovávat nebo používat osobní údaje jednotlivce, osobní údaje, osobně identifikovatelné informace nebo jiné podobné výrazy.

3. **„Správce“** bude mít význam uvedený v platných zákonech o ochraně osobních údajů pro společnost, která určuje účel a rozsah zpracování osobních údajů.

4. **„Titulní strana“** znamená dokument podepsaný nebo elektronicky přijatý stranami, který obsahuje tyto Standardní podmínky DPA a identifikuje **Poskytovatele**, **Zákazníka** a předmět a podrobnosti zpracování údajů.

5. **„Osobní údaje zákazníka“** znamenají osobní údaje, které **Zákazník** nahraje nebo poskytne **Poskytovateli** v rámci Služby a které se řídí touto Dohodou o zpracování osobních údajů.

6. **„Dohoda o zpracování osobních údajů“** znamená tyto Standardní podmínky Dohody o zpracování osobních údajů, titulní stranu mezi Poskytovatelem a Zákazníkem a zásady a dokumenty uvedené na titulní straně nebo k ní připojené.

7. **„standardní smluvní doložky EHP“** znamenají standardní smluvní doložky připojené k prováděcímu rozhodnutí Evropské komise 2021/914 ze dne 4. června 2021 o standardních smluvních doložkách pro předávání osobních údajů do třetích zemí podle nařízení Evropského parlamentu a Evropské rady (EU) 2016/679.

8. **Evropský hospodářský prostor** nebo **EHP** znamená členské státy Evropské unie, Norsko, Island a Lichtenštejnsko.

9. **„GDPR“** znamená nařízení Evropské unie 2016/679 ve znění provedeném místními právními předpisy v příslušném členském státě EHP.

10. **„Osobní údaje“** budou mít význam uvedený v platných zákonech o ochraně osobních údajů pro osobní informace, osobní údaje nebo jiné podobné pojmy.

11. Pojmy **„Zpracování“** nebo **„Proces“** budou mít význam uvedený v platných zákonech o ochraně osobních údajů pro jakékoli použití osobních údajů nebo provádění počítačové operace s nimi, a to i automatizovanými metodami.

12. **„Zpracovatel“** bude mít význam uvedený v platných zákonech o ochraně osobních údajů pro společnost, která zpracovává osobní údaje jménem správce.

13. **„Zpráva“** znamená auditní zprávy vypracované jinou společností v souladu se standardy definovanými v Bezpečnostních zásadách jménem Poskytovatele.

14. **„Omezený přenos“** znamená (a) v případě, že se vztahuje GDPR, přenos osobních údajů z EHP do země mimo EHP, na který se nevztahuje posouzení odpovídající ochrany ze strany Evropské komise; a (b) v případě, že se vztahuje GDPR Spojeného království, přenos osobních údajů ze Spojeného království do jakékoli jiné země, na kterou se nevztahují předpisy o odpovídající ochraně přijaté podle § 17A zákona Spojeného království o ochraně osobních údajů z roku 2018.

15. **„Bezpečnostní incident“** znamená narušení bezpečnosti osobních údajů ve smyslu článku 4 GDPR.

16. **„Služba“** znamená produkt a/nebo služby popsané ve **Smlouvě**.

17. **„Údaje zvláštní kategorie“** budou mít význam uvedený v článku 9 GDPR.

18. **„Subzpracovatel“** bude mít význam uvedený v platných zákonech o ochraně osobních údajů pro společnost, která se souhlasem a souhlasem Správce pomáhá Zpracovateli při zpracování osobních údajů jménem Správce.

19. **„GDPR Spojeného království“** znamená nařízení Evropské unie 2016/679, jak je provedeno ve Spojeném království § 3 zákona Spojeného království o vystoupení z Evropské unie z roku 2018.

20. **„Dodatek pro Spojené království“** znamená dodatek k standardním smluvním podmínkám EHP o mezinárodním předávání údajů vydaný informačním komisařem pro strany provádějící omezené předávání podle § 119A(1) zákona o ochraně osobních údajů z roku 2018.

## Autorské práva {#credits}

Tento dokument je odvozen od [Společné tištěné standardní podmínky DPA (verze 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) a je licencován pod [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).