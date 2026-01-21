# Saját tárhelyen tárolt e-mail: Elkötelezettség a nyílt forráskód mellett {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="Self-hosted email solution illustration" class="rounded-lg" />

## Tartalomjegyzék {#table-of-contents}

* [Előszó](#foreword)
* [Miért fontos az önállóan üzemeltetett e-mail?](#why-self-hosted-email-matters)
  * [A hagyományos e-mail szolgáltatások problémája](#the-problem-with-traditional-email-services)
  * [Az önállóan üzemeltetett alternatíva](#the-self-hosted-alternative)
* [Saját tárhelyen megvalósított megoldásunk: Műszaki áttekintés](#our-self-hosted-implementation-technical-overview)
  * [Docker-alapú architektúra az egyszerűség és a hordozhatóság érdekében](#docker-based-architecture-for-simplicity-and-portability)
  * [Bash szkript telepítése: Az akadálymentesítés és a biztonság találkozása](#bash-script-installation-accessibility-meets-security)
  * [Kvantumbiztonságos titkosítás a jövőbiztos adatvédelemért](#quantum-safe-encryption-for-future-proof-privacy)
  * [Automatizált karbantartás és frissítések](#automated-maintenance-and-updates)
* [A nyílt forráskódú programra vonatkozó kötelezettségvállalás](#the-open-source-commitment)
* [Saját üzemeltetésű vs. felügyelt: A helyes választás](#self-hosted-vs-managed-making-the-right-choice)
  * [Az önálló tárhelyszolgáltatással működő e-mailek valósága](#the-reality-of-self-hosting-email)
  * [Mikor válassza a mi felügyelt szolgáltatásunkat?](#when-to-choose-our-managed-service)
* [Első lépések az önállóan üzemeltetett e-mail-továbbítással](#getting-started-with-self-hosted-forward-email)
  * [Rendszerkövetelmények](#system-requirements)
  * [Telepítési lépések](#installation-steps)
* [Az önállóan üzemeltetett e-mail jövője](#the-future-of-self-hosted-email)
* [Konklúzió: E-mail szabadság mindenkinek](#conclusion-email-freedom-for-everyone)
* [Referenciák](#references)

## Előszó {#foreword}

A mai digitális környezetben az e-mail továbbra is online identitásunk és kommunikációnk gerincét alkotja. Az adatvédelmi aggodalmak növekedésével azonban sok felhasználó nehéz választással néz szembe: kényelem az adatvédelem rovására, vagy adatvédelem a kényelem rovására. A Forward Emailnél mindig is úgy gondoltuk, hogy nem kell választani a kettő között.

Izgatottan jelentjük be ma utunk egy jelentős mérföldkövét: saját tárhelyen futó e-mail megoldásunk elindítását. Ez a funkció a nyílt forráskódú alapelvek, az adatvédelemre összpontosító tervezés és a felhasználók felhatalmazása iránti legmélyebb elkötelezettségünket képviseli. Saját tárhelyen futó opciónkkal az e-mail kommunikáció teljes hatalmát és irányítását közvetlenül az Ön kezébe adjuk.

Ez a blogbejegyzés a saját tárhelyen futó megoldásunk mögött álló filozófiát, annak technikai megvalósítását, és azt vizsgálja, hogy miért fontos azoknak a felhasználóknak, akik digitális kommunikációjukban mind az adatvédelmet, mind a tulajdonjogot előtérbe helyezik.

## Miért fontos a saját tárhelyen tárolt e-mail {#why-self-hosted-email-matters}

Saját tárhelyen futó e-mail megoldásunk a legtisztább kifejeződése annak a meggyőződésünknek, hogy az igazi adatvédelem kontrollt jelent, és a kontroll a nyílt forráskódú szoftverekkel kezdődik. Azoknak a felhasználóknak, akik teljes tulajdonjogot követelnek digitális kommunikációjuk felett, a saját tárhelyen futó e-mail megoldás már nem marginális ötlet – alapvető jog. Büszkék vagyunk arra, hogy kiállhatunk e meggyőződésünk mellett egy teljesen nyílt, ellenőrizhető platformmal, amelyet a saját feltételeid szerint üzemeltethetsz.

### A hagyományos e-mail szolgáltatások problémája {#the-problem-with-traditional-email-services}

A hagyományos e-mail szolgáltatások számos alapvető kihívást jelentenek az adatvédelmet figyelembe vevő felhasználók számára:

1. **Megbízhatósági követelmények**: Meg kell bíznia a szolgáltatóban, hogy nem fér hozzá, nem elemzi és nem osztja meg az adatait.
2. **Központosított felügyelet**: Hozzáférése bármikor, bármilyen okból visszavonható.
3. **Megfigyelési sebezhetőség**: A központosított szolgáltatások a megfigyelés elsődleges célpontjai.
4. **Korlátozott átláthatóság**: A legtöbb szolgáltatás saját fejlesztésű, zárt forráskódú szoftvert használ.
5. **Beszállítói függőség**: Nehéz vagy lehetetlen lehet eltávolodni ezektől a szolgáltatásoktól.

Még az „adatvédelemre összpontosító” e-mail-szolgáltatók is gyakran kudarcot vallanak azzal, hogy csak a frontend alkalmazásaikat teszik nyílt forráskódúvá, miközben a backend rendszereiket zárt rendszerként és saját forráskódként kezelik. Ez jelentős bizalmi réseket teremt – arra kérik Önt, hogy higgyen az adatvédelmi ígéreteikben anélkül, hogy ellenőrizni tudná azokat.

### Az önállóan üzemeltetett alternatíva {#the-self-hosted-alternative}

Az e-mail saját tárhelyszolgáltatása alapvetően más megközelítést kínál:

1. **Teljes kontroll**: Ön birtokolja és felügyeli a teljes e-mail infrastruktúrát.
2. **Ellenőrizhető adatvédelem**: A teljes rendszer átlátható és auditálható.
3. **Nincs szükség bizalomra**: Nem kell harmadik félre bíznia a kommunikációját.
4. **Testreszabási szabadság**: A rendszert az Ön egyedi igényeihez igazíthatja.
5. **Rugalmasság**: A szolgáltatás a vállalat döntéseitől függetlenül folytatódik.

Ahogy az egyik felhasználó fogalmazott: „Az e-mail fiókom saját tárhelyszolgáltatása olyan, mintha a saját élelmiszeremet termeszteném digitálisan – több munkát igényel, de pontosan tudom, mi van benne.”

## Saját tárhelyen futó megvalósításunk: Műszaki áttekintés {#our-self-hosted-implementation-technical-overview}

Saját tárhelyen futó e-mail-megoldásunk ugyanazon az adatvédelmet előtérbe helyező elvekre épül, amelyek minden termékünket irányítják. Vizsgáljuk meg a technikai megvalósítást, amely ezt lehetővé teszi.

### Docker-alapú architektúra az egyszerűség és a hordozhatóság érdekében {#docker-based-architecture-for-simplicity-and-portability}

A teljes e-mail infrastruktúránkat Docker segítségével csomagoltuk, így gyakorlatilag bármilyen Linux alapú rendszeren könnyen telepíthető. Ez a konténeres megközelítés számos fontos előnnyel jár:

1. **Egyszerűsített telepítés**: Egyetlen parancs beállítja a teljes infrastruktúrát.
2. **Konzisztens környezet**: Kiküszöböli a „saját gépemen működik” problémákat.
3. **Elkülönített komponensek**: Minden szolgáltatás a saját konténerében fut a biztonság érdekében.
4. **Egyszerű frissítések**: Egyszerű parancsok a teljes verem frissítéséhez.
5. **Minimális függőségek**: Csak Docker és Docker Compose szükséges.

Az architektúra a következőkhöz tartalmaz konténereket:

* Webes felület adminisztrációhoz
* SMTP szerver a kimenő e-mailekhez
* IMAP/POP3 szerverek az e-mailek lekéréséhez
* CalDAV szerver a naptárakhoz
* CardDAV szerver a névjegyekhez
* Adatbázis a konfiguráció tárolásához
* Redis a gyorsítótárazáshoz és a teljesítményhez
* SQLite a biztonságos, titkosított postafiók-tároláshoz

IDEIGLENES_PLACE_HOLDER_0
> Mindenképpen tekintse meg a IDEIGLENES_PLACEHOLDER_1 oldalunkat

### Bash szkript telepítése: Az akadálymentesítés megfelel a biztonságnak {#bash-script-installation-accessibility-meets-security}

A telepítési folyamatot a lehető legegyszerűbbre terveztük, miközben betartjuk a biztonsági legjobb gyakorlatokat:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

Ez az egyetlen parancs:

1. Ellenőrzi a rendszerkövetelményeket
2. Végigvezeti a konfiguráción
3. Beállítja a DNS-rekordokat
4. Konfigurálja a TLS-tanúsítványokat
5. Telepíti a Docker-konténereket
6. Elvégzi a kezdeti biztonsági megerősítést

Azoknak, akik aggódnak a szkriptek bash-be küldése miatt (ahogy illik is!), javasoljuk, hogy a végrehajtás előtt ellenőrizzék a szkriptet. Teljesen nyílt forráskódú és megtekinthető.

### Kvantumbiztonságos titkosítás a jövőbiztos adatvédelem érdekében {#quantum-safe-encryption-for-future-proof-privacy}

A hosztolt szolgáltatásunkhoz hasonlóan a saját hosztolt megoldásunk is kvantumrezisztens titkosítást valósít meg ChaCha20-Poly1305 titkosítással az SQLite adatbázisokhoz. Ez a megközelítés nemcsak a jelenlegi fenyegetésekkel, hanem a jövőbeli kvantumszámítástechnikai támadásokkal szemben is védi az e-mail adatait.

Minden postafiók saját titkosított SQLite adatbázisfájlban tárolódik, ami teljes elszigeteltséget biztosít a felhasználók között – ami jelentős biztonsági előnyt jelent a hagyományos megosztott adatbázis-megközelítésekkel szemben.

### Automatizált karbantartás és frissítések {#automated-maintenance-and-updates}

Átfogó karbantartási segédprogramokat építettünk be közvetlenül az önállóan üzemeltetett megoldásba:

1. **Automatikus biztonsági mentések**: Minden kritikus adat ütemezett biztonsági mentése
2. **Tanúsítványmegújítás**: Automatizált Let's Encrypt tanúsítványkezelés
3. **Rendszerfrissítések**: Egyszerű parancs a legújabb verzióra való frissítéshez
4. **Állapotfigyelés**: Beépített ellenőrzések a rendszer integritásának biztosítására

Ezek a segédprogramok egy egyszerű interaktív menün keresztül érhetők el:

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

## A nyílt forráskódú szoftverekre vonatkozó kötelezettségvállalás {#the-open-source-commitment}

Saját tárhelyen futó e-mail megoldásunk, mint minden termékünk, 100%-ban nyílt forráskódú – mind a felhasználói felület, mind a háttérfelület tekintetében. Ez azt jelenti:

1. **Teljes átláthatóság**: Minden egyes kódsor, amely az e-mailjeidet feldolgozza, nyilvánosan ellenőrizhető.
2. **Közösségi hozzájárulások**: Bárki hozzájárulhat fejlesztésekhez vagy problémák megoldásához.
3. **Biztonság a nyitottságon keresztül**: A sebezhetőségeket egy globális közösség azonosíthatja és kijavíthatja.
4. **Nincs szállítói függőség**: Soha nem függsz a cégünk létezésétől.

A teljes kódbázis elérhető a GitHubon a <https://github.com/forwardemail/forwardemail.net>. címen.

## Saját üzemeltetésű vs. felügyelt: A helyes döntés meghozatala {#self-hosted-vs-managed-making-the-right-choice}

Bár büszkék vagyunk arra, hogy saját tárhelyen keresztüli e-mail-szolgáltatást kínálunk, tisztában vagyunk vele, hogy ez nem mindenkinek a megfelelő választás. Az önálló e-mail-tárhelyszolgáltatás valódi felelősséggel és kihívásokkal jár:

### Az önálló tárhelyszolgáltatású e-mailek valósága {#the-reality-of-self-hosting-email}

#### Technikai szempontok {#technical-considerations}

* **Szerverkezelés**: VPS-t vagy dedikált szervert kell fenntartania.* **DNS-konfiguráció**: A megfelelő DNS-beállítás elengedhetetlen a kézbesítéshez.* **Biztonsági frissítések**: A biztonsági javítások naprakészen tartása elengedhetetlen.* **Spamkezelés**: A spam szűrését Önnek kell kezelnie.* **Biztonsági mentési stratégia**: A megbízható biztonsági mentések megvalósítása az Ön felelőssége.

#### Időbefektetés {#time-investment}

* **Kezdeti beállítás**: A beállítás, az ellenőrzés és a dokumentáció elolvasása.
* **Folyamatos karbantartás**: Alkalmankénti frissítések és felügyelet.
* **Hibaelhárítás**: Alkalmankénti problémák megoldása.

#### Pénzügyi megfontolások {#financial-considerations}

* **Szerverköltségek**: $5-$20/hó egy alap VPS-ért
* **Domain regisztráció**: $10-$20/év
* **Időérték**: Az időbefektetésednek valódi értéke van

### Mikor válassza felügyelt szolgáltatásunkat {#when-to-choose-our-managed-service}

Sok felhasználó számára továbbra is a felügyelt szolgáltatásunk a legjobb megoldás:

1. **Kényelem**: Minden karbantartást, frissítést és felügyeletet mi intézünk.
2. **Megbízhatóság**: Használja ki kiforrott infrastruktúránkat és szakértelmünket.
3. **Támogatás**: Probléma esetén segítséget kaphat.
4. **Szállíthatóság**: Használja ki kiforrott szellemi tulajdonunk hírnevét.
5. **Költséghatékonyság**: Ha figyelembe vesszük az időköltségeket, szolgáltatásunk gyakran gazdaságosabb.

Mindkét lehetőség ugyanazokat az adatvédelmi előnyöket és nyílt forráskódú átláthatóságot biztosítja – a különbség egyszerűen az, hogy ki kezeli az infrastruktúrát.

## Első lépések a saját tárhelyen tárolt e-mail-továbbítással {#getting-started-with-self-hosted-forward-email}

Készen áll arra, hogy átvegye az irányítást az e-mail infrastruktúrája felett? Így kezdheti el:

### Rendszerkövetelmények {#system-requirements}

* Ubuntu 20.04 LTS vagy újabb (ajánlott)
* Minimum 1 GB RAM (2 GB+ ajánlott)
* 20 GB tárhely ajánlott
* Egy általad felügyelt domain név
* Nyilvános IP-cím 25-ös port támogatásával
* Lehetőség a [fordított PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/) beállítására
* IPv4 és IPv6 támogatás

> \[!TIP]
> Több levelezőszerver-szolgáltatót is ajánlunk a <https://forwardemail.net/blog/docs/best-mail-server-providers> címen (forrás: <https://github.com/forwardemail/awesome-mail-server-providers>)

### Telepítési lépések {#installation-steps}

1. **Futtassa a telepítőszkriptet**:
```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
   ```

2. **Kövesd az interaktív utasításokat**:
* Add meg a domainnevedet
* Konfiguráld a rendszergazdai hitelesítő adatokat
* Állítsd be a DNS-rekordokat az utasításoknak megfelelően
* Válaszd ki a kívánt konfigurációs beállításokat

3. **Telepítés ellenőrzése**:
A telepítés befejezése után a következőkkel ellenőrizheti, hogy minden működik-e:
* Konténer állapotának ellenőrzése: `docker ps`
* Teszt e-mail küldése
* Bejelentkezés a webes felületre

## Az önállóan üzemeltetett e-mail jövője {#the-future-of-self-hosted-email}

Saját üzemeltetésű megoldásunk csak a kezdet. Elkötelezettek vagyunk amellett, hogy folyamatosan fejlesszük ezt az ajánlatot az alábbiakkal:

1. **Továbbfejlesztett adminisztrációs eszközök**: Hatékonyabb webalapú felügyelet
2. **További hitelesítési lehetőségek**: Hardveres biztonsági kulcs támogatásával
3. **Speciális monitorozás**: Jobb betekintés a rendszer állapotába és teljesítményébe
4. **Többkiszolgálós telepítés**: Lehetőségek magas rendelkezésre állású konfigurációkhoz
5. **Közösségvezérelt fejlesztések**: A felhasználók hozzájárulásainak beépítése

## Konklúzió: E-mail szabadság mindenkinek {#conclusion-email-freedom-for-everyone}

Saját tárhelyen futó e-mail megoldásunk bevezetése jelentős mérföldkövet jelent küldetésünkben, hogy adatvédelmi központú, átlátható e-mail szolgáltatásokat nyújtsunk. Akár a felügyelt szolgáltatásunkat, akár a saját tárhelyen futó opciót választja, Ön is élvezheti a nyílt forráskódú elvek és az adatvédelmet előtérbe helyező tervezés iránti rendíthetetlen elkötelezettségünk előnyeit.

Az e-mail túl fontos ahhoz, hogy zárt, saját fejlesztésű rendszerek irányítsák, amelyek az adatgyűjtést helyezik előtérbe a felhasználói adatok védelmével szemben. A Forward Email saját tárhelyen futó megoldásával büszkén kínálunk valódi alternatívát – olyat, amely teljes mértékben az Ön kezébe adja digitális kommunikációja feletti irányítást.

Úgy gondoljuk, hogy az adatvédelem nem csupán egy tulajdonság, hanem alapvető jog. Saját tárhelyen elérhető e-mail opciónkkal ezt a jogot minden eddiginél elérhetőbbé tesszük.

Készen állsz, hogy átvedd az irányítást az e-mailed felett? [Kezdje el még ma](https://forwardemail.net/self-hosted) vagy tekintsd meg a [GitHub adattár](https://github.com/forwardemail/forwardemail.net) oldalunkat, ha többet szeretnél megtudni.

## Referenciák {#references}

\[1] E-mail továbbítása GitHub adattárba: <IDEIGLENES_PLACEHOLDER_0

\[2] Saját tárhelyen tárolt dokumentáció: <https://forwardemail.net/en/self-hosted>

\[3] E-mail adatvédelem technikai megvalósítása: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] Miért fontos a nyílt forráskódú e-mail: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>