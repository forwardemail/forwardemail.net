# Nahlásit zneužití {#report-abuse}

<img loading="lazy" src="/img/articles/report-abuse.webp" alt="" class="rounded-lg" />

__CHRÁNĚNÁ_URL_14__ Obsah {__CHRÁNĚNÁ_URL_15__

* [Zřeknutí se odpovědnosti](#disclaimer)
* [Jak podat hlášení o zneužití](#how-to-submit-an-abuse-report)
* [Pro širokou veřejnost](#for-the-general-public)
* [Pro vymáhání práva](#for-law-enforcement)
  * [Jaké informace jsou k dispozici](#what-information-is-available)
  * [Jaké informace nejsou k dispozici](#what-information-is-not-available)
  * [Vymáhání práva se sídlem ve Spojených státech](#law-enforcement-based-in-the-united-states)
  * [Vymáhání práva se sídlem mimo Spojené státy](#law-enforcement-based-outside-of-the-united-states)
  * [Nouzové žádosti orgánů činných v trestním řízení](#law-enforcement-emergency-requests)
  * [Žádosti donucovacích orgánů mohou vyvolat upozornění na účet](#law-enforcement-requests-may-trigger-account-notices)
  * [Donucovací orgány žádají o zachování informací](#law-enforcement-requests-to-preserve-information)
  * [Proces podání donucovacích orgánů](#law-enforcement-serving-process)

__CHRÁNĚNÁ_URL_16__ Prohlášení o vyloučení odpovědnosti {__CHRÁNĚNÁ_URL_17__

Řiďte se prosím našimi [Podmínky](/terms), protože platí pro celý web.

## Jak nahlásit zneužití {#how-to-submit-an-abuse-report}

Hlášení o zneužití prověřujeme a žádosti o informace týkající se [široké veřejnosti](#for-the-general-public) a [vymáhání práva](#for-law-enforcement) zasíláme e-mailem individuálně.

Hlášení o zneužití a žádosti o informace týkající se uživatelů, e-mailů, IP adres a/nebo domén jsou níže souhrnně označovány jako „Účet“.

Naše e-mailová adresa, na kterou se můžete obrátit s vaší žádostí nebo hlášením zneužití, je: `abuse@forwardemail.net`

Přečtěte si níže uvedené sekce, kde najdete další informace, které se vás mohou týkat.

__CHRÁNĚNÁ_URL_20__ Pro širokou veřejnost {__CHRÁNĚNÁ_URL_21__

<u>**Pokud vy nebo někdo jiný bezprostředně trpí nebezpečím, okamžitě kontaktujte policii a záchranné složky.**</u>

<u>**Chcete-li znovu získat ztracený přístup ke svému účtu nebo zastavit útočníka, měli byste vyhledat odbornou právní pomoc.**</u>

Pokud jste se stali obětí zneužití z účtu, který využívá naši službu, zašlete nám prosím své hlášení e-mailem na výše uvedenou adresu. Pokud byl váš účet převzat zlým úmyslem (např. vaše doména nedávno vypršela a byla znovu zaregistrována třetí stranou a poté použita ke zneužití), zašlete nám prosím e-mail s hlášením na výše uvedenou adresu s přesnými informacemi o vašem účtu (např. názvem vaší domény). Po ověření vašeho předchozího vlastnictví vám můžeme pomoci s [zákaz stínu](https://en.wikipedia.org/wiki/Shadow_banning) účtem. Upozorňujeme, že nemáme pravomoc vám pomoci znovu získat přístup k vašemu účtu.

Váš právní zástupce vám může doporučit, abyste kontaktovali orgány činné v trestním řízení, vlastníka vašeho účtu (např. registrátora doménového jména; webové stránky, kde jste si doménové jméno zaregistrovali) a/nebo vás odkázal na [Stránka ICANN o ztracených doménách](https://www.icann.org/resources/pages/lost-domain-names).

## Pro orgány činné v trestním řízení {#for-law-enforcement}

U většiny žádostí se naše možnost zveřejňovat informace řídí zákony [Zákon o ochraně osobních údajů elektronických komunikací](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285) ([Wikipedie](https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act)), [18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701) a násl. („ECPA“). ECPA nařizuje, abychom určité uživatelské informace sdělovali orgánům činným v trestním řízení pouze v reakci na konkrétní typy právních žádostí, včetně předvolání, soudních příkazů a domovních prohlídek.

Pokud jste členem orgánů činných v trestním řízení a hledáte informace týkající se účtu, měly by být ve vaší žádosti uvedeny informace o účtu a také datum a časové období.  Nemůžeme zpracovávat příliš široké a/nebo vágní požadavky – je to z důvodu ochrany dat a důvěry našich uživatelů, a co je nejdůležitější, abychom jejich data udrželi v bezpečí.

Pokud nám vaše žádost signalizuje porušení našich [Podmínky](/terms), pak ji zpracujeme v souladu s našimi interními osvědčenými postupy pro řešení zneužívání – upozorňujeme, že v některých případech to může vést k pozastavení a/nebo zablokování účtu.

**Jelikož nejsme registrátorem doménových jmen**, pokud si přejete vyhledat informace o historických záznamech DNS týkajících se doménového jména, měli byste se obrátit na konkrétního registrátora doménových jmen, který odpovídá dané doméně. Vyhledávání historických záznamů mohou poskytovat služby jako [Security Trails](), ale konkrétnější a přesnější informace může poskytnout registrátor. Pro zjištění, kdo je vlastníkem registrátora doménových jmen a/nebo nameserveru DNS pro danou doménu, mohou být užitečné nástroje `dig` a `whois` (např. `whois example.com` nebo `dig example.com ns`). Zda je účet v naší službě v placeném nebo bezplatném tarifu, můžete zjistit provedením vyhledávání záznamů DNS (např. `dig example.com mx` a `dig example.com txt`). Pokud záznamy MX nevrací hodnoty jako `mx1.forwardemail.net` a `mx2.forwardemail.net`, pak doména naši službu nepoužívá. Pokud záznamy TXT vracejí e-mailovou adresu v prostém textu (např. `forward-email=user@example.com`), pak to indikuje cílovou adresu pro přesměrování e-mailů pro danou doménu. Pokud místo toho vrátí hodnotu jako `forward-email-site-verification=XXXXXXXXXX`, pak to znamená, že se jedná o placený tarif a konfigurace přesměrování je uložena v naší databázi pod ID `XXXXXXXXXX`. Další informace o tom, jak naše služba funguje na úrovni DNS, naleznete na našich [FAQ](/faq).

### Jaké informace jsou k dispozici {#what-information-is-available}

Pro [Shromážděné informace](/privacy#information-collected) se řiďte našimi Zásadami ochrany osobních údajů. Účty mohou odstranit své informace z našeho systému v souladu se zákony o uchovávání údajů a ochraně osobních údajů; pro [Odstranění informací](/privacy#information-removal) se řiďte našimi Zásadami ochrany osobních údajů. To znamená, že požadované informace nemusí být v době žádosti k dispozici z důvodu smazání účtu.

### Jaké informace nejsou k dispozici {#what-information-is-not-available}

Pro [Informace nebyly shromážděny](/privacy#information-not-collected) si prosím přečtěte naši sekci Zásady ochrany osobních údajů.

### Orgány činné v trestním řízení se sídlem ve Spojených státech {#law-enforcement-based-in-the-united-states}

S [výjimkou případů nouze](#law-enforcement-emergency-requests) sdílíme informace o účtu pouze po obdržení platného soudního příkazu, soudního příkazu USA dle zákona ECPA a/nebo povolení k domovní prohlídce.

Dále můžeme [upozornit Účet](#law-enforcement-requests-may-trigger-account-notices) o žádosti orgánů činných v trestním řízení, pokud nám to nezakazuje zákon nebo soudní příkaz.

Pokud obdržíme platné předvolání k soudu, soudní příkaz ECPA a/nebo příkaz k prohlídce, poskytneme relevantní a dostupné informace podle našich nejlepších možností.

### Orgány činné v trestním řízení se sídlem mimo Spojené státy {#law-enforcement-based-outside-of-the-united-states}

Požadujeme, aby byly žádosti doručovány orgánům činným v trestním řízení se sídlem mimo Spojené státy jedním z následujících způsobů:

* Soud Spojených států.
* Orgán pro vynucování práva podle postupů [Smlouva o vzájemné právní pomoci Spojených států](https://www.justice.gov/criminal-oia/file/1498806/download) ([Wikipedie](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty)) („MLAT“).
* Příkaz zahraniční vlády, který podléhá výkonné dohodě, o níž generální prokurátor Spojených států rozhodl a ověřil Kongresu, že splňuje požadavky [18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523).

### Žádosti o mimořádné události od orgánů činných v trestním řízení {#law-enforcement-emergency-requests}

Jak to zákon ve Spojených státech dovoluje (např. v souladu s [18 U.S.C. § 2702 (b) (8)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(8\) vládnímu subjektu, pokud poskytovatel v dobré víře věří, že nouzová situace zahrnující nebezpečí smrti nebo vážného fyzického zranění jakékoli osoby vyžaduje zveřejnění bez zpoždění komunikace týkající se nouzové situace) a [§ 2702 (c)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)Výjimky pro zveřejnění záznamů zákazníků. Poskytovatel popsaný v pododdíle (a) může zveřejnit záznamy nebo jiné informace týkající se předplatitele nebo zákazníka takové služby (nezahrnuje obsah komunikace uvedené v pododdíle (a) (1) nebo (a) (2)), pokud je tak učiněno v dobré víře a s nezávislým ověřením žadatele – Informace o účtu můžeme sdělit a zveřejnit orgánům činným v trestním řízení bez předvolání, soudního příkazu dle zákona ECPA a/nebo povolení k prohlídce, pokud se domníváme, že je to nezbytné k zabránění smrti nebo vážnému zranění.

Požadujeme, aby byly nouzové datové žádosti ("EDR") zasílány e-mailem a obsahovaly všechny relevantní informace, abychom zajistili včasný a urychlený proces.

Upozorňujeme, že jsme si vědomi sofistikovaných útoků typu spoofing, phishing a zosobnění pomocí e-mailu (viz např. [tento článek z The Guardian](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law)).

Naše zásady pro zpracování EDR jsou následující:

1. Nezávisle si ověřte metadata v záhlaví e-mailu (např. DKIM/SPF/DMARC) (nebo jejich absenci).

2. V dobré víře se co nejvíce pokusíme (v případě potřeby i opakovaně) nezávisle kontaktovat žadatele telefonicky – abychom ověřili pravost žádosti. Můžeme například prozkoumat webové stránky `.gov` týkající se jurisdikce, ze které žádost pochází, a poté zavolat na úřad z jejich veřejně uvedeného oficiálního telefonního čísla, abychom žádost ověřili.

### Žádosti orgánů činných v trestním řízení mohou vést k oznámení o účtech {#law-enforcement-requests-may-trigger-account-notices}

Účet můžeme informovat a poskytnout mu kopii žádosti o vymáhání práva, která se ho týká, pokud nám to nezakazuje zákon nebo soudní příkaz (např. [18 U.S.C. 2705(b)](https://www.govinfo.gov/link/uscode/18/2705)). V takových případech, pokud je to relevantní, můžeme Účet informovat po vypršení platnosti příkazu k mlčenlivosti.

Pokud je žádost o informace ze strany orgánů činných v trestním řízení oprávněná, pak [zachovat potřebné a požadované informace o účtu](#law-enforcement-requests-to-preserve-information) vynaložíme přiměřené úsilí, abychom kontaktovali majitele účtu prostřednictvím jeho registrované a ověřené e-mailové adresy (např. do 7 kalendářních dnů). Pokud obdržíme včasnou námitku (např. do 7 kalendářních dnů), pak nebudeme sdílet informace o účtu a budeme pokračovat v právním procesu v případě potřeby.

### Žádosti orgánů činných v trestním řízení o uchování informací {#law-enforcement-requests-to-preserve-information}

Vyhovíme platným žádostem orgánů činných v trestním řízení o uchování informací týkajících se účtu v souladu s [18 U.S.C. 2703(f)](https://www.govinfo.gov/link/uscode/18/2703). Upozorňujeme, že uchovávání dat je omezeno pouze na to, co je konkrétně požadováno a je aktuálně k dispozici.

### Proces doručování dokumentů orgánům činným v trestním řízení {#law-enforcement-serving-process}

Požadujeme, aby nám všechny platné žádosti orgánů činných v trestním řízení poskytly platnou a funkční e-mailovou adresu, se kterou můžeme korespondovat a na kterou můžeme elektronicky poskytnout požadované informace.

Všechny žádosti by měly být zasílány na e-mailovou adresu uvedenou výše v části [Jak podat hlášení o zneužití](#how-to-submit-an-abuse-report).

Všechny žádosti orgánů činných v trestním řízení musí být zaslány na hlavičkovém papíře agentury nebo oddělení (např. jako naskenovaná příloha PDF), z oficiální a relevantní e-mailové adresy a podepsané.

Pokud se jedná o [nouzový požadavek](#law-enforcement-emergency-requests), napište prosím do předmětu e-mailu „Žádost o pomoc v oblasti vymáhání práva v naléhavých případech“.

Vezměte prosím na vědomí, že nám může trvat nejméně dva týdny, než budeme moci vaši žádost zkontrolovat a odpovědět na ni.