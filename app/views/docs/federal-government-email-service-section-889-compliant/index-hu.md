# Forward Email: Az Ön Section 889-kompatibilis e-mail továbbító megoldása {#forward-email-your-section-889-compliant-email-forwarding-solution}

<img loading="lazy" src="/img/articles/federal.webp" alt="Federal government email service Section 889 compliant" class="rounded-lg" />


## Tartalomjegyzék {#table-of-contents}

* [Előszó](#foreword)
* [A Section 889 megfelelés megértése](#understanding-section-889-compliance)
* [Hogyan éri el a Forward Email a Section 889 megfelelést](#how-forward-email-achieves-section-889-compliance)
  * [A Cloudflare elkötelezettsége](#cloudflares-commitment)
  * [A DataPacket infrastruktúrája](#datapackets-infrastructure)
* [A Section 889-en túl: Szélesebb kormányzati megfelelés](#beyond-section-889-broader-government-compliance)
* [Az előre vezető utunk: A megfelelési horizontok bővítése](#our-path-forward-expanding-compliance-horizons)
* [Miért fontos ez Önnek](#why-this-matters-for-you)
* [Biztonságos, megfelelőségi e-mail továbbítás itt kezdődik](#secure-compliant-email-forwarding-starts-here)
* [Hivatkozások](#references)


## Előszó {#foreword}

A Forward Email-nél hiszünk az egyszerű, biztonságos és privát e-mail továbbításban mindenki számára. Tudjuk, hogy sok szervezet számára, különösen azoknak, akik az Egyesült Államok kormányával dolgoznak, a megfelelés nem csupán divatos kifejezés – hanem szükségszerűség. A **szövetségi e-mail szabályozásoknak való megfelelés** biztosítása létfontosságú. Ezért büszkén erősítjük meg, hogy **biztonságos e-mail továbbító** szolgáltatásunkat úgy építettük fel, hogy megfeleljen a szigorú szövetségi előírásoknak, beleértve a [Section 889](https://www.acquisition.gov/Section-889-Policies) részt a [Nemzeti Védelmi Engedélyezési Törvényben (NDAA)](https://en.wikipedia.org/wiki/National_Defense_Authorization_Act).

Elkötelezettségünk a **kormányzati e-mail megfelelés** iránt nemrégiben valósult meg, amikor az **US Naval Academy** megkereste a **Forward Email**-t. Biztonságos e-mail továbbítási szolgáltatásokat igényeltek, és dokumentációt kértek, amely igazolja a szövetségi előírásoknak, köztük a **Section 889 megfelelésnek** való megfelelésünket. Ez a tapasztalat értékes esettanulmányként szolgál, amely bemutatja felkészültségünket és képességünket a kormányzati finanszírozású szervezetek támogatására és szigorú követelményeik teljesítésére. Ez az elkötelezettség minden felhasználónkra kiterjed, akik megbízható, **adatvédelmi fókuszú e-mail** megoldást keresnek.


## A Section 889 megfelelés megértése {#understanding-section-889-compliance}

Mi az a Section 889? Egyszerűen fogalmazva, ez egy amerikai szövetségi törvény, amely megtiltja a kormányzati ügynökségeknek, hogy olyan vállalatokkal használjanak vagy szerződjenek, amelyek bizonyos távközlési és videó megfigyelő berendezéseket vagy szolgáltatásokat használnak meghatározott cégektől (például Huawei, ZTE, Hikvision, Dahua és Hytera). Ez a szabály, amelyet gyakran a **Huawei tiltás** és a **ZTE tiltás** kapcsán említenek, a nemzetbiztonság védelmét szolgálja.

> \[!NOTE]
> A Section 889 kifejezetten a Huawei, ZTE, Hytera, Hikvision és Dahua berendezéseit és szolgáltatásait célozza, beleértve azok leányvállalatait és kapcsolt vállalkozásait is.

Egy olyan **kormányzati szerződésekhez kapcsolódó e-mail továbbító szolgáltatás** esetében, mint a **Forward Email**, ez azt jelenti, hogy biztosítanunk kell, hogy egyik alapinfrastruktúra-szolgáltatónk sem használja ezt a tiltott berendezést, így mi **Section 889 kompatibilisek** vagyunk.


## Hogyan éri el a Forward Email a Section 889 megfelelést {#how-forward-email-achieves-section-889-compliance}

Szóval, **hogyan felel meg a Forward Email a Section 889-nek?** Ezt az infrastruktúra partnereink gondos kiválasztásával érjük el. A **Forward Email** kizárólag két kulcsfontosságú szolgáltatóra támaszkodik a **Section 889 kompatibilis infrastruktúrája** érdekében:

1. **[Cloudflare](https://www.cloudflare.com/):** Elsődleges partnerünk a hálózati szolgáltatások és a **Cloudflare e-mail biztonság** terén.
2. **[DataPacket](https://datapacket.com/):** Elsődleges szolgáltatónk a szerver infrastruktúrához (a failover-hez [Digital Ocean](https://www.digitalocean.com/) és/vagy [Vultr](https://www.vultr.com/) szolgáltatásokat használunk, és hamarosan kizárólag a DataPacket-re térünk át – természetesen mindkét failover szolgáltatótól írásban megerősítettük a Section 889 megfelelést).

> \[!IMPORTANT]
> A kizárólagos támaszkodásunk a Cloudflare-re és a DataPacket-re, amelyek egyike sem használ Section 889 által tiltott berendezést, a megfelelésünk sarokköve.
Mind a [Cloudflare](https://www.cloudflare.com/), mind a [DataPacket](https://datapacket.com/) elkötelezett a magas biztonsági szabványok mellett, és nem használnak a 889. szakasz által tiltott eszközöket. **A Cloudflare és a DataPacket használata a 889. szakasz szerinti megfeleléshez** alapvető szolgáltatásunk szempontjából.

### A Cloudflare elkötelezettsége {#cloudflares-commitment}

A [Cloudflare](https://www.cloudflare.com/) kifejezetten foglalkozik a **889. szakasz szerinti megfeleléssel** a **[Harmadik Fél Magatartási Kódexében](https://cf-assets.www.cloudflare.com/slt3lc6tev37/284hiWkCYNc49GQpAeBvGN/e137cdac96d1c4cd403c6b525831d284/Third_Party_Code_of_Conduct.pdf)**. Azt állítják:

> „A Nemzeti Védelmi Engedélyezési Törvény (NDAA) 889. szakasza értelmében a Cloudflare nem használ, és nem engedélyez a beszállítói láncában telekommunikációs eszközöket, videómegfigyelő termékeket vagy szolgáltatásokat, amelyeket a Huawei Technologies Company, a ZTE Corporation, a Hytera Communications Corporation, a Hangzhou Hikvision Digital Technology Company vagy a Dahua Technology Company (vagy ezek bármely leányvállalata vagy kapcsolt vállalata) gyárt vagy biztosít.”

*(Forrás: Cloudflare Harmadik Fél Magatartási Kódex, 2025. április 29-én lekérve)*

Ez a világos nyilatkozat megerősíti, hogy a [Cloudflare](https://www.cloudflare.com/) infrastruktúrája, amelyet a **Forward Email** használ, megfelel a 889. szakasz követelményeinek.

### A DataPacket infrastruktúrája {#datapackets-infrastructure}

A [DataPacket](https://datapacket.com/), a szerverszolgáltatónk kizárólag az **Arista Networks** és a **Cisco** hálózati eszközeit használja. Sem az Arista, sem a Cisco nem szerepel a 889. szakasz által tiltott vállalatok között. Mindkettő elismert beszállító, amelyet széles körben használnak biztonságos vállalati és kormányzati környezetekben, és ismert a szigorú biztonsági és megfelelőségi szabványok betartásáról.

Csak a [Cloudflare](https://www.cloudflare.com/) és a [DataPacket](https://datapacket.com/) használatával a **Forward Email** biztosítja, hogy az egész szolgáltatási lánc mentes a 889. szakasz által tiltott eszközöktől, így **biztonságos e-mail továbbítást nyújt szövetségi ügynökségeknek** és más biztonságtudatos felhasználóknak.


## A 889. szakaszon túl: Szélesebb kormányzati megfelelés {#beyond-section-889-broader-government-compliance}

Elkötelezettségünk a **kormányzati e-mail biztonság** és megfelelés iránt túlmutat a 889. szakaszon. Bár a **Forward Email** maga nem dolgoz fel vagy tárol közvetlenül érzékeny kormányzati adatokat, mint például a [Kontrollált Nem Titkosított Információkat (CUI)](https://en.wikipedia.org/wiki/Controlled_Unclassified_Information) ugyanúgy, mint egy nagy SaaS platform, az **open-source e-mail továbbító** architektúránk és a biztonságos, megfelelőségi szolgáltatókra való támaszkodás összhangban áll más kulcsfontosságú szabályozások elveivel:

* **[FAR (Federal Acquisition Regulation)](https://en.wikipedia.org/wiki/Federal_Acquisition_Regulation):** Megfelelő infrastruktúra használatával és egyszerű kereskedelmi szolgáltatás nyújtásával biztosítjuk a **FAR-kompatibilis e-mail** továbbítási elveket, amelyek alkalmasak kormányzati vállalkozók számára.
* **Adatvédelmi törvény & [FISMA](https://en.wikipedia.org/wiki/Federal_Information_Security_Management_Act_of\_2002):** Tervezésünk szerint **adatvédelmi fókuszúak** vagyunk, és kínálunk **Adatvédelmi törvény szerinti e-mail** elveket. Nem tároljuk az e-mailjeit. Az e-mailek közvetlenül továbbítódnak, minimalizálva az adatkezelést. Infrastruktúra szolgáltatóink ([Cloudflare](https://www.cloudflare.com/), [DataPacket](https://datapacket.com/)) rendszereiket magas biztonsági szabványok szerint kezelik, összhangban a **FISMA-kompatibilis e-mail** elvekkel.
* **[HIPAA](https://en.wikipedia.org/wiki/Health_Insurance_Portability_and_Accountability_Act):** Azoknak a szervezeteknek, amelyeknek **HIPAA-kompatibilis e-mail továbbításra** van szükségük, a **Forward Email** része lehet egy megfelelőségi megoldásnak. Mivel nem tároljuk az e-maileket, a fő megfelelőségi felelősség az végponti e-mail rendszereknél van. Ugyanakkor biztonságos átvitel rétegünk támogatja a HIPAA követelményeit, ha helyesen használják.

> \[!WARNING]
> Egy [Üzleti Partneri Megállapodás (BAA)](https://en.wikipedia.org/wiki/Business_associate_agreement) szükséges lehet a végső e-mail szolgáltatóval, nem pedig a **Forward Email**-lel, mivel nem tároljuk az e-mail tartalmát (kivéve, ha használja [titkosított IMAP/POP3 tároló rétegünket](/blog/docs/best-quantum-safe-encrypted-email-service)).
## Előrevezető utunk: a megfelelőségi horizontok bővítése {#our-path-forward-expanding-compliance-horizons}

Bár a 889. szakasz szerinti megfelelőségünk kulcsfontosságú alapot nyújt, különösen a szövetségi vállalkozók számára, megértjük, hogy a különböző szervezeteknek és kormányzati ügynökségeknek eltérő és folyamatosan változó szabályozási igényeik vannak. A **Forward Email** esetében az átláthatóság kulcsfontosságú, és szeretnénk megosztani nézőpontunkat a szélesebb megfelelőségi környezetről és jövőbeli irányunkról.

Elismerjük az olyan keretrendszerek és szabályozások fontosságát, mint:

* **[System for Award Management (SAM)](https://sam.gov/):** Elengedhetetlen a közvetlen szövetségi szerződéskötéshez.
* **[FAR (Federal Acquisition Regulation)](https://www.acquisition.gov/browse/index/far):** Beleértve az olyan szabványos záradékokat, mint a [FAR 52.212-4](https://www.acquisition.gov/far/52.212-4) a kereskedelmi szolgáltatásokra.
* **[DFARS (Defense Federal Acquisition Regulation Supplement)](https://en.wikipedia.org/wiki/Defense_Federal_Acquisition_Regulation_Supplement):** Különösen a [DFARS 252.239-7010](https://www.acquisition.gov/dfars/252.239-7010-cloud-computing-services.) a DoD felhőszolgáltatásaihoz.
* **[CMMC (Cybersecurity Maturity Model Certification)](https://en.wikipedia.org/wiki/Cybersecurity_Maturity_Model_Certification):** Kötelező a DoD vállalkozók számára, akik [Federal Contract Information (FCI)](https://en.wikipedia.org/wiki/Federal_Contract_Information) vagy CUI kezelésével foglalkoznak.
* **[NIST SP 800-171](https://csrc.nist.gov/pubs/sp/800/171/r3/final):** A CMMC 2. szintjének alapja, a CUI védelmére fókuszálva. ([NIST](https://en.wikipedia.org/wiki/National_Institute_of_Standards_and_Technology) – Nemzeti Szabványügyi és Technológiai Intézet)
* **[FedRAMP (Federal Risk and Authorization Management Program)](https://en.wikipedia.org/wiki/FedRAMP):** A szövetségi ügynökségek által használt felhőszolgáltatások szabványa.
* **[FISMA (Federal Information Security Modernization Act)](https://www.cisa.gov/topics/cybersecurity-best-practices/fisma):** A szövetségi információbiztonság átfogó keretrendszere.
* **[HIPAA (Health Insurance Portability and Accountability Act)](https://www.hhs.gov/hipaa/index.html):** A védett egészségügyi információk (PHI) kezelésére.
* **[FERPA (Family Educational Rights and Privacy Act)](https://en.wikipedia.org/wiki/Family_Educational_Rights_and_Privacy_Act):** A tanulói oktatási nyilvántartások védelmére.
* **[COPPA (Children's Online Privacy Protection Act)](https://en.wikipedia.org/wiki/Children%27s_Online_Privacy_Protection_Act):** A 13 év alatti gyermekekkel foglalkozó szolgáltatásokra.

**Jelenlegi helyzetünk és jövőbeli céljaink:**

A **Forward Email** alapvető tervezése – amely **adatvédelmi fókuszú**, **nyílt forráskódú**, és minimalizálja az adatkezelést (különösen az alapvető **email továbbítási** szolgáltatásunkban) – jól illeszkedik ezen szabályozások mögötti *elvekhez*. Meglévő biztonsági gyakorlataik (titkosítás, a modern email szabványok támogatása) és a 889. szakasz szerinti megfelelőség erős kiindulópontot jelentenek.

Ugyanakkor a formális tanúsítás vagy engedélyezés megszerzése olyan keretrendszerekhez, mint a **FedRAMP** vagy a **CMMC**, jelentős vállalkozás. Ez szigorú dokumentációt, specifikus technikai és eljárási kontrollok (gyakran több száz) bevezetését, független értékeléseket (például [3PAO](https://www.fedramp.gov/glossary/#3pao) a FedRAMP esetében – harmadik fél általi értékelő szervezet), valamint folyamatos felügyeletet igényel.

> \[!IMPORTANT]
> A megfelelőség nem csupán technológia kérdése; dokumentált folyamatokról, szabályzatokról és folyamatos éberségről szól. A FedRAMP vagy CMMC tanúsítványok megszerzése jelentős befektetést és időt igényel.

**Elkötelezettségünk:**

Ahogy a **Forward Email** növekszik és ügyfeleink igényei változnak, elkötelezettek vagyunk a releváns megfelelőségi tanúsítványok feltérképezése és megszerzése iránt. Ez magában foglalja a következő terveket:

1. **SAM regisztráció:** A közvetlen kapcsolattartás megkönnyítése az amerikai szövetségi ügynökségekkel.
2. **Folyamatok formalizálása:** Belső dokumentációink és eljárásaink fejlesztése az olyan szabványokhoz igazodva, mint a NIST SP 800-171, amely a CMMC alapját képezi.
3. **FedRAMP útvonalak értékelése:** A követelmények és a FedRAMP engedélyezésének megvalósíthatóságának felmérése, valószínűleg alacsony vagy közepes szintű alapvonallal kezdve, ahol alkalmazható, a [LI-SaaS](https://www.fedramp.gov/blog/fedramp-releases-low-impact-saas-baseline/) modell kihasználásával.
4. **Specifikus igények támogatása:** Olyan követelmények kezelése, mint a HIPAA (esetleg BAÁ-kon és tárolt adatokra vonatkozó speciális konfigurációkon keresztül) és a FERPA (megfelelő szerződéses feltételek és kontrollok révén), ahogy egyre több egészségügyi és oktatási intézménnyel lépünk kapcsolatba.
Ez az út gondos tervezést és befektetést igényel. Bár nem rendelkezünk az összes tanúsítvány azonnali idővonalával, megfelelőségi helyzetünk megerősítése a kormányzati és szabályozott iparágak igényeinek kielégítése érdekében kulcsfontosságú része az ütemtervünknek.

> \[!NOTE]
> Hisszük, hogy **nyílt forráskódú** jellegünk egyedülálló átláthatóságot biztosít ezen a folyamaton keresztül, lehetővé téve közösségünk és ügyfeleink számára, hogy első kézből lássák elkötelezettségünket.

Továbbra is frissítjük közösségünket, ahogy jelentős mérföldköveket érünk el megfelelőségi utunk során.


## Miért fontos ez Önnek {#why-this-matters-for-you}

Egy **Section 889-kompatibilis e-mail továbbító** szolgáltatás, mint a **Forward Email** választása azt jelenti:

* **Nyugalom:** Különösen kormányzati ügynökségek, vállalkozók és biztonságtudatos szervezetek számára.
* **Csökkentett kockázat:** Elkerüli a potenciális konfliktusokat a **szövetségi e-mail szabályozásokkal**.
* **Bizalom:** Biztonság és ellátási lánc integritás iránti elkötelezettséget mutat.

A **Forward Email** egyszerű, megbízható és *megfelelő* módot kínál egyedi domainje **e-mail továbbítási** igényeinek kezelésére.


## Biztonságos, megfelelőségi e-mail továbbítás itt kezdődik {#secure-compliant-email-forwarding-starts-here}

A **Forward Email** elkötelezett egy **biztonságos, privát és nyílt forráskódú e-mail továbbító** szolgáltatás nyújtása mellett. A **Section 889 megfelelőségünk**, amelyet a [Cloudflare](https://www.cloudflare.com/) és a [DataPacket](https://datapacket.com/) partnereinkkel való együttműködés révén értünk el (amely tükrözi a **Forward Email megfelelőségét az US Naval Academy** számára végzett munkánkban), ennek az elkötelezettségnek a bizonyítéka. Akár kormányzati szerv, vállalkozó vagy egyszerűen csak értékeli a **kormányzati e-mail biztonságot**, a **Forward Email** Önnek készült.

Készen áll a **biztonságos, megfelelőségi e-mail továbbításra**? [Regisztráljon ingyen még ma!](https://forwardemail.net)


## Hivatkozások {#references}

* **Section 889 (NDAA):** <https://www.acquisition.gov/Section-889-Policies>
* **Cloudflare:** <https://www.cloudflare.com/>
* **Cloudflare Third Party Code of Conduct:** <https://cf-assets.www.cloudflare.com/slt3lc6tev37/284hiWkCYNc49GQpAeBvGN/e137cdac96d1c4cd403c6b525831d284/Third_Party_Code_of_Conduct.pdf>
* **DataPacket:** <https://datapacket.com/>
* **System for Award Management (SAM):** <https://sam.gov/>
* **Federal Acquisition Regulation (FAR):** <https://www.acquisition.gov/browse/index/far>
* **FAR 52.212-4:** <https://www.acquisition.gov/far/52.212-4>
* **Defense Federal Acquisition Regulation Supplement (DFARS):** <https://www.acquisition.gov/dfars>
* **DFARS 252.239-7010:** <https://www.acquisition.gov/dfars/252.239-7010-cloud-computing-services.>
* **Cybersecurity Maturity Model Certification (CMMC):** <https://dodcio.defense.gov/cmmc/About/>
* **NIST SP 800-171:** <https://csrc.nist.gov/pubs/sp/800/171/r3/final>
* **Federal Risk and Authorization Management Program (FedRAMP):** <https://www.fedramp.gov/>
* **Federal Information Security Modernization Act (FISMA):** <https://www.cisa.gov/topics/cybersecurity-best-practices/fisma>
* **Health Insurance Portability and Accountability Act (HIPAA):** <https://www.hhs.gov/hipaa/index.html>
* **Family Educational Rights and Privacy Act (FERPA):** <https://studentprivacy.ed.gov/ferpa>
* **Children's Online Privacy Protection Act (COPPA):** <https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa>
