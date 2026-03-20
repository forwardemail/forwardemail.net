# Nahlásit zneužití {#report-abuse}

<img loading="lazy" src="/img/articles/report-abuse.webp" alt="Nahlásit zneužití a spam Forward Email" class="rounded-lg" />


## Obsah {#table-of-contents}

* [Prohlášení o vyloučení odpovědnosti](#disclaimer)
* [Jak podat hlášení o zneužití](#how-to-submit-an-abuse-report)
* [Pro širokou veřejnost](#for-the-general-public)
* [Pro orgány činné v trestním řízení](#for-law-enforcement)
  * [Jaké informace jsou k dispozici](#what-information-is-available)
  * [Jaké informace nejsou k dispozici](#what-information-is-not-available)
  * [Orgány činné v trestním řízení se sídlem v USA](#law-enforcement-based-in-the-united-states)
  * [Orgány činné v trestním řízení se sídlem mimo USA](#law-enforcement-based-outside-of-the-united-states)
  * [Nouzové žádosti orgánů činných v trestním řízení](#law-enforcement-emergency-requests)
  * [Žádosti orgánů činných v trestním řízení mohou vyvolat upozornění na účtu](#law-enforcement-requests-may-trigger-account-notices)
  * [Žádosti orgánů činných v trestním řízení o zachování informací](#law-enforcement-requests-to-preserve-information)
  * [Předávání procesních dokumentů orgánům činným v trestním řízení](#law-enforcement-serving-process)


## Prohlášení o vyloučení odpovědnosti {#disclaimer}

Prosím, řiďte se našimi [Podmínkami](/terms), které platí pro celý web.


## Jak podat hlášení o zneužití {#how-to-submit-an-abuse-report}

Hlášení o zneužití a žádosti o informace pro [širokou veřejnost](#for-the-general-public) a [orgány činné v trestním řízení](#for-law-enforcement) posuzujeme případ od případu prostřednictvím e-mailu.

Hlášení o zneužití a žádosti o informace týkající se uživatelů, e-mailů, IP adres a/nebo domén jsou níže společně označovány jako „Účet“.

Naše e-mailové adresy pro kontaktování s vaší žádostí nebo hlášením o zneužití jsou: `support@forwardemail.net`, `abuse@forwardemail.net` a `security@forwardemail.net`.

Pokud je to možné, zašlete kopii na všechny tyto e-mailové adresy a také posílejte připomínající e-maily, pokud neobdržíte odpověď do 24–48+ hodin.

Přečtěte si níže uvedené sekce pro více informací, které se vás mohou týkat.


## Pro širokou veřejnost {#for-the-general-public}

<u>**Pokud jste vy nebo někdo jiný v bezprostředním ohrožení, okamžitě kontaktujte policii a záchranné služby.**</u>

<u>**Měli byste vyhledat odbornou právní pomoc, abyste získali zpět přístup ke svému Účtu nebo pomohli zastavit škodlivého aktéra.**</u>

Pokud jste obětí zneužití ze strany Účtu, který používá naši službu, zašlete nám prosím své hlášení e-mailem na výše uvedenou adresu. Pokud byl váš Účet převzat škodlivým aktérem (např. vaše doména nedávno vypršela a byla zaregistrována třetí stranou a poté použita ke zneužití), zašlete nám prosím e-mailem hlášení na výše uvedenou adresu s přesnými informacemi o vašem Účtu (např. název vaší domény). Můžeme pomoci [shadow banovat](https://en.wikipedia.org/wiki/Shadow_banning) Účet po ověření vašeho předchozího vlastnictví. Upozorňujeme, že nemáme pravomoc vám pomoci získat zpět přístup k vašemu Účtu.

Váš právní zástupce vám může doporučit kontaktovat orgány činné v trestním řízení, vlastníka vašeho Účtu (např. registrátora domény; web, kde jste doménu zaregistrovali) a/nebo odkázat vás na [stránku ICANN o ztracených doménách](https://www.icann.org/resources/pages/lost-domain-names).


## Pro orgány činné v trestním řízení {#for-law-enforcement}

U většiny žádostí je naše schopnost poskytovat informace řízena [Electronic Communications Privacy Act](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285) ([Wikipedia](https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act)), [18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701) a násl. („ECPA“). ECPA nařizuje, že určité uživatelské informace můžeme orgánům činným v trestním řízení poskytnout pouze v reakci na specifické typy právních žádostí, včetně předvolání, soudních příkazů a příkazů k prohlídce.

Pokud jste členem orgánů činných v trestním řízení a žádáte o informace týkající se Účtu, měla by vaše žádost obsahovat informace o Účtu a časové rozmezí. Nemůžeme zpracovávat příliš široké a/nebo vágní žádosti – je to kvůli ochraně dat a důvěry našich uživatelů a především k zajištění bezpečnosti jejich dat.
Pokud váš požadavek signalizuje porušení našich [Podmínek](/terms), budeme jej zpracovávat podle našich interních nejlepších postupů pro řešení zneužití – mějte na paměti, že v některých případech to může vést k pozastavení a/nebo zablokování Účtu.

**Protože nejsme registrátorem doménových jmen**, pokud si přejete získat historické informace o DNS záznamech týkajících se doménového jména, měli byste kontaktovat konkrétního registrátora doménových jmen, který odpovídá dané doméně. Služby jako [Security Trails]() mohou poskytovat vyhledávání historických záznamů, ale přesnější a konkrétnější informace mohou být poskytnuty od registrátora. Pro určení, kdo je registrátorem doménového jména a/nebo vlastníkem DNS nameserverů pro doménu, mohou být užitečné nástroje `dig` a `whois` (např. `whois example.com` nebo `dig example.com ns`). Můžete zjistit, zda je Účet na placeném plánu nebo bezplatném plánu na naší službě provedením vyhledávání DNS záznamů (např. `dig example.com mx` a `dig example.com txt`). Pokud MX záznamy nevrací hodnoty jako `mx1.forwardemail.net` a `mx2.forwardemail.net`, doména naši službu nepoužívá. Pokud TXT záznamy vrací prostý text s e-mailovou adresou (např. `forward-email=user@example.com`), znamená to cílovou adresu přesměrování e-mailů pro doménu. Pokud místo toho vrací hodnotu jako `forward-email-site-verification=XXXXXXXXXX`, znamená to, že je na placeném plánu a konfigurace přesměrování je uložena v naší databázi pod ID `XXXXXXXXXX`. Pro více informací o tom, jak naše služba funguje na úrovni DNS, prosím odkažte se na naši [FAQ](/faq).

### Jaké informace jsou k dispozici {#what-information-is-available}

Prosím, odkažte se na sekci Zásad ochrany osobních údajů pro [Shromažďované informace](/privacy#information-collected). Účty mají právo odstranit své informace z našeho systému v souladu se zákony o uchovávání dat a ochraně soukromí; odkažte se na sekci Zásad ochrany osobních údajů pro [Odstranění informací](/privacy#information-removal). To znamená, že požadované informace nemusí být v době požadavku k dispozici kvůli smazání Účtu.

### Jaké informace nejsou k dispozici {#what-information-is-not-available}

Prosím, odkažte se na sekci Zásad ochrany osobních údajů pro [Neshromažďované informace](/privacy#information-not-collected).

### Orgány činné v trestním řízení se sídlem ve Spojených státech {#law-enforcement-based-in-the-united-states}

S [výjimkou naléhavých případů](#law-enforcement-emergency-requests) sdílíme informace o Účtu pouze po obdržení platného předvolání, soudního příkazu ECPA USA a/nebo soudního příkazu k prohlídce.

Můžeme také [upozornit Účet](#law-enforcement-requests-may-trigger-account-notices) na žádost orgánů činných v trestním řízení, pokud nám to zákon nebo soudní příkaz nebrání.

Pokud obdržíme platné předvolání, soudní příkaz ECPA a/nebo soudní příkaz k prohlídce, poskytneme relevantní a dostupné informace v rámci našich možností.

### Orgány činné v trestním řízení se sídlem mimo Spojené státy {#law-enforcement-based-outside-of-the-united-states}

Požadujeme, aby žádosti byly doručeny orgánům činným v trestním řízení se sídlem mimo Spojené státy prostřednictvím jednoho z následujících:

* Soudem Spojených států.
* Vymáhací agenturou podle postupů [dohody o vzájemné právní pomoci Spojených států](https://www.justice.gov/criminal-oia/file/1498806/download) ([Wikipedia](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty)) („MLAT“).
* Příkazem od zahraniční vlády, který podléhá výkonné dohodě, kterou ministr spravedlnosti Spojených států určil a certifikoval Kongresu, že splňuje požadavky [18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523).

### Naléhavé žádosti orgánů činných v trestním řízení {#law-enforcement-emergency-requests}

Jak zákon umožňuje ve Spojených státech (např. v souladu s [18 U.S.C. §2702 (b)(8)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(8\)to%20a%20governmental%20entity%2C%20if%20the%20provider%2C%20in%20good%20faith%2C%20believes%20that%20an%20emergency%20involving%20danger%20of%20death%20or%20serious%20physical%20injury%20to%20any%20person%20requires%20disclosure%20without%20delay%20of%20communications%20relating%20to%20the%20emergency%3B%20or) a [§2702 (c)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)Exceptions%20for%20Disclosure%20of%20Customer%20Records.%E2%80%94A%20provider%20described%20in%20subsection%20\(a\)%20may%20divulge%20a%20record%20or%20other%20information%20pertaining%20to%20a%20subscriber%20to%20or%20customer%20of%20such%20service%20\(not%20including%20the%20contents%20of%20communications%20covered%20by%20subsection%20\(a\)\(1\)%20or%20\(a\)\(2\)\)%E2%80%94)), pokud v dobré víře a s nezávislým ověřením žadatele – můžeme bez předvolání, soudního příkazu ECPA a/nebo soudního příkazu k prohlídce zveřejnit a sdílet informace o Účtu orgánům činným v trestním řízení, pokud věříme, že je to bez prodlení nutné k zabránění smrti nebo vážnému tělesnému zranění.
Požadujeme, aby žádosti o nouzová data („EDR“) byly zasílány e-mailem a obsahovaly všechny relevantní informace, aby bylo možné zajistit včasný a urychlený proces.

Vezměte na vědomí, že si jsme vědomi sofistikovaných útoků typu spoofing, phishing a napodobování pomocí e-mailu (např. viz [tento článek z The Guardian](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law)).

Naše politika pro zpracování EDR je následující:

1. Nezávisle prozkoumat metadata hlavičky e-mailu (např. DKIM/SPF/DMARC) (nebo jejich absenci) pro ověření.

2. Vynaložit nejlepší úsilí v dobré víře (v případě potřeby opakovaně) k nezávislému telefonickému kontaktu s žadatelem – za účelem potvrzení pravosti žádosti. Například můžeme prozkoumat `.gov` webové stránky související s jurisdikcí, odkud žádost pochází, a poté zavolat na kancelář z jejich veřejně uvedeného oficiálního telefonního čísla, abychom žádost ověřili.

### Žádosti orgánů činných v trestním řízení mohou vyvolat oznámení účtu {#law-enforcement-requests-may-trigger-account-notices}

Můžeme upozornit účet a poskytnout mu kopii žádosti orgánů činných v trestním řízení, která se ho týká, pokud nám zákon nebo soudní příkaz nebrání tak učinit (např. [18 U.S.C. 2705(b)](https://www.govinfo.gov/link/uscode/18/2705)). V těchto případech, pokud je to relevantní, můžeme účet upozornit, když uplyne doba zákazu zveřejnění.

Pokud je žádost o informace ze strany orgánů činných v trestním řízení platná, pak [uchováme nezbytné a požadované informace o účtu](#law-enforcement-requests-to-preserve-information) a učiníme rozumné úsilí kontaktovat vlastníka účtu na jeho registrované a ověřené e-mailové adrese (např. do 7 kalendářních dnů). Pokud obdržíme včasný námitkový dopis (např. do 7 kalendářních dnů), zadržíme sdílení informací o účtu a pokračujeme v právním procesu podle potřeby.

### Žádosti orgánů činných v trestním řízení o uchování informací {#law-enforcement-requests-to-preserve-information}

Budeme respektovat platné žádosti orgánů činných v trestním řízení o uchování informací týkajících se účtu podle [18 U.S.C. 2703(f)](https://www.govinfo.gov/link/uscode/18/2703). Upozorňujeme, že uchování dat je omezeno pouze na to, co je konkrétně požadováno a aktuálně dostupné.

### Předávání procesních dokumentů orgánům činným v trestním řízení {#law-enforcement-serving-process}

Požadujeme, aby všechny platné žádosti orgánů činných v trestním řízení obsahovaly platnou a funkční e-mailovou adresu, na kterou můžeme korespondovat a elektronicky poskytnout požadované informace.

Všechny žádosti by měly být zaslány na e-mailovou adresu uvedenou výše v části [Jak podat hlášení o zneužití](#how-to-submit-an-abuse-report).

Všechny žádosti orgánů činných v trestním řízení musí být zaslány na hlavičkovém papíře agentury nebo oddělení (např. jako PDF naskenovaný příloha), z oficiální a relevantní e-mailové adresy a podepsány.

Pokud se jedná o [nouzovou žádost](#law-enforcement-emergency-requests), napište prosím do předmětu e-mailu „Nouzová žádost orgánů činných v trestním řízení“.

Vezměte prosím na vědomí, že nám může trvat alespoň dva týdny, než budeme schopni vaši žádost přezkoumat a odpovědět na ni.
