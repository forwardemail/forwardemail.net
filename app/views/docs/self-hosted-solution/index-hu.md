# Saját tárhelyen tárolt e-mail: Elkötelezettség a nyílt forráskódú megoldások iránt {#self-hosted-email-commitment-to-open-source}

<img loading="lusta" src="/img/articles/self-hosted.webp" alt="" class="rounded-lg" />

## Tartalomjegyzék {#table-of-contents}

* [Előszó](#foreword)
* [Miért számít a saját üzemeltetésű e-mail?](#why-self-hosted-email-matters)
  * [Probléma a hagyományos e-mail szolgáltatásokkal](#the-problem-with-traditional-email-services)
  * [A saját üzemeltetésű alternatíva](#the-self-hosted-alternative)
* [Saját üzemeltetésű megvalósításunk: Műszaki áttekintés](#our-self-hosted-implementation-technical-overview)
  * [Docker-alapú architektúra az egyszerűség és hordozhatóság érdekében](#docker-based-architecture-for-simplicity-and-portability)
  * [Bash Script telepítése: A kisegítő lehetőségek megfelelnek a biztonságnak](#bash-script-installation-accessibility-meets-security)
  * [Kvantumbiztos titkosítás a jövőbiztos adatvédelem érdekében](#quantum-safe-encryption-for-future-proof-privacy)
  * [Automatizált karbantartás és frissítések](#automated-maintenance-and-updates)
* [A nyílt forráskódú kötelezettségvállalás](#the-open-source-commitment)
* [Self-Hosted vs. Managed: A helyes választás](#self-hosted-vs-managed-making-the-right-choice)
  * [Az önkiszolgáló e-mail valósága](#the-reality-of-self-hosting-email)
  * [Mikor válassza menedzselt szolgáltatásunkat](#when-to-choose-our-managed-service)
* [Kezdő lépések az önállóan tárolt e-mail-továbbítással](#getting-started-with-self-hosted-forward-email)
  * [Rendszerkövetelmények](#system-requirements)
  * [Telepítési lépések](#installation-steps)
* [A saját üzemeltetésű e-mail jövője](#the-future-of-self-hosted-email)
* [Következtetés: E-mail szabadság mindenkinek](#conclusion-email-freedom-for-everyone)
* [Hivatkozások](#references)

## Előszó {#foreword}

A mai digitális környezetben az e-mail továbbra is online identitásunk és kommunikációnk gerince. Mégis, ahogy az adatvédelmi aggodalmak nőnek, sok felhasználó nehéz választás elé néz: a kényelem a magánélet árán, vagy a magánélet a kényelem árán. A Forward Emailnél mindig is úgy gondoltuk, hogy nem kell választania a kettő közül.

A mai napon örömmel jelentjük be utunk egy jelentős mérföldkövét: saját üzemeltetésű e-mail megoldásunk elindítását. Ez a funkció a nyílt forráskódú alapelvek, az adatvédelemre fókuszáló tervezés és a felhasználók felhatalmazása iránti legmélyebb elkötelezettségünket tükrözi. Saját üzemeltetésű lehetőségünkkel közvetlenül az Ön kezébe adjuk az e-mail kommunikáció teljes erejét és irányítását.

Ez a blogbejegyzés feltárja a saját üzemeltetésű megoldásunk mögött meghúzódó filozófiát, annak műszaki megvalósítását, és azt, hogy miért számít ez azoknak a felhasználóknak, akik digitális kommunikációjuk során a magánélet védelmét és a tulajdonjogot egyaránt előnyben részesítik.

## Miért fontos a saját tárhelyen tárolt e-mail {#why-self-hosted-email-matters}

Saját hosztolt e-mail megoldásunk a legtisztább kifejezése annak a hitünknek, hogy az igazi adatvédelem ellenőrzést jelent, és az ellenőrzés a nyílt forráskóddal kezdődik. Azon felhasználók számára, akik teljes tulajdonjogot követelnek digitális kommunikációjuk felett, az önálló tárhelyszolgáltatás többé már nem mellékes ötlet – ez alapvető jog. Büszkék vagyunk arra, hogy e hit mögött állhatunk egy teljesen nyitott, ellenőrizhető platformmal, amelyet saját feltételeid szerint működtethetsz.

### A hagyományos e-mail szolgáltatások problémája {#the-problem-with-traditional-email-services}

A hagyományos e-mail szolgáltatások számos alapvető kihívást jelentenek a magánélet-tudatos felhasználók számára:

1. **Megbízhatósági követelmények**: Meg kell bíznia a szolgáltatóban, hogy nem fér hozzá, nem elemzi és nem osztja meg az adatait.
2. **Központosított felügyelet**: Hozzáférése bármikor, bármilyen okból visszavonható.
3. **Megfigyelési sebezhetőség**: A központosított szolgáltatások a megfigyelés elsődleges célpontjai.
4. **Korlátozott átláthatóság**: A legtöbb szolgáltatás saját fejlesztésű, zárt forráskódú szoftvert használ.
5. **Beszállítói függőség**: Nehéz vagy lehetetlen lehet eltávolodni ezektől a szolgáltatásoktól.

Még az „adatvédelemre összpontosító” e-mail szolgáltatók is gyakran alulmaradnak azzal, hogy csak nyílt forráskódú előtér-alkalmazásaikat végzik, miközben háttérrendszereiket saját tulajdonúként és zárva tartják. Ez jelentős bizalomhiányt hoz létre – meg kell hinni az adatvédelmi ígéreteiket anélkül, hogy ellenőrizni tudná őket.

### Az önállóan tárhelyezett alternatíva {#the-self-hosted-alternative}

Az e-mailek önálló tárolása alapvetően más megközelítést kínál:

1. **Teljes kontroll**: Ön birtokolja és felügyeli a teljes e-mail infrastruktúrát.
2. **Ellenőrizhető adatvédelem**: A teljes rendszer átlátható és auditálható.
3. **Nincs szükség bizalomra**: Nem kell harmadik félre bíznia a kommunikációját.
4. **Testreszabási szabadság**: A rendszert az Ön egyedi igényeihez igazíthatja.
5. **Rugalmasság**: A szolgáltatás a vállalat döntéseitől függetlenül folytatódik.

Ahogy egy felhasználó fogalmazott: "Az e-mailjeim öntárolása a saját ételem termesztésének digitális megfelelője – több munkát igényel, de pontosan tudom, mi van benne."

## Saját tárhelyen futó megvalósításunk: Műszaki áttekintés {#our-self-hosted-implementation-technical-overview}

Saját üzemeltetésű e-mail megoldásunk ugyanazokra az alapelvekre épül, amelyek az összes termékünket vezérlik. Vizsgáljuk meg azt a technikai megvalósítást, amely ezt lehetővé teszi.

### Docker-alapú architektúra az egyszerűség és a hordozhatóság érdekében {#docker-based-architecture-for-simplicity-and-portability}

A teljes e-mail infrastruktúránkat a Docker segítségével csomagoltuk, így gyakorlatilag bármilyen Linux-alapú rendszeren könnyen telepíthető. Ez a konténeres megközelítés számos kulcsfontosságú előnnyel jár:

1. **Egyszerűsített telepítés**: Egyetlen parancs beállítja a teljes infrastruktúrát.
2. **Konzisztens környezet**: Kiküszöböli a „saját gépemen működik” problémákat.
3. **Elkülönített komponensek**: Minden szolgáltatás a saját konténerében fut a biztonság érdekében.
4. **Egyszerű frissítések**: Egyszerű parancsok a teljes verem frissítéséhez.
5. **Minimális függőségek**: Csak Docker és Docker Compose szükséges.

Az architektúra konténereket tartalmaz:

* Webes felület adminisztrációhoz
* SMTP szerver a kimenő e-mailekhez
* IMAP/POP3 szerverek az e-mailek lekéréséhez
* CalDAV szerver a naptárakhoz
* CardDAV szerver a névjegyekhez
* Adatbázis a konfiguráció tárolásához
* Redis a gyorsítótárazáshoz és a teljesítményhez
* SQLite a biztonságos, titkosított postafiók-tároláshoz

> \[!NOTE]
> Be sure to check out our [self-hosted developer guide](https://forwardemail.net/self-hosted)

### Bash szkript telepítése: Az akadálymentesítés találkozik a biztonsággal {#bash-script-installation-accessibility-meets-security}

A telepítési folyamatot úgy alakítottuk ki, hogy a lehető legegyszerűbb legyen, miközben megtartjuk a legjobb biztonsági gyakorlatokat:

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

Azok számára, akik aggódnak a szkriptek bash-be állítása miatt (ahogyan annak lennie kell), javasoljuk a szkript áttekintését a végrehajtás előtt. Teljesen nyílt forráskódú, és ellenőrizhető.

### Kvantumbiztonságos titkosítás a jövőbiztos adatvédelemért {#quantum-safe-encryption-for-future-proof-privacy}

A hosztolt szolgáltatásunkhoz hasonlóan saját hosztolt megoldásunk is kvantumálló titkosítást valósít meg a ChaCha20-Poly1305 titkosítással az SQLite adatbázisok titkosításaként. Ez a megközelítés nemcsak a jelenlegi fenyegetésekkel szemben védi meg e-mail-adatait, hanem a jövőbeni kvantumszámítási támadásoktól is.

Minden postafiók a saját titkosított SQLite adatbázisfájljában van tárolva, ami teljes elszigetelést biztosít a felhasználók között – ez jelentős biztonsági előny a hagyományos megosztott adatbázis-megközelítésekkel szemben.

### Automatizált karbantartás és frissítések {#automated-maintenance-and-updates}

Átfogó karbantartási segédprogramokat építettünk be közvetlenül a saját üzemeltetésű megoldásba:

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

Saját hosztolt e-mail megoldásunk, mint minden termékünk, 100%-ban nyílt forráskódú – előtérben és háttérben egyaránt. Ez azt jelenti:

1. **Teljes átláthatóság**: Minden egyes kódsor, amely az e-mailjeidet feldolgozza, nyilvánosan ellenőrizhető.
2. **Közösségi hozzájárulások**: Bárki hozzájárulhat fejlesztésekhez vagy problémák megoldásához.
3. **Biztonság a nyitottságon keresztül**: A sebezhetőségeket egy globális közösség azonosíthatja és kijavíthatja.
4. **Nincs szállítói függőség**: Soha nem függsz a cégünk létezésétől.

A teljes kódbázis elérhető a GitHubon a <https://github.com/forwardemail/forwardemail.net>. címen.

## Saját tárhelyen tárolt vagy felügyelt webhelyek: A helyes választás {#self-hosted-vs-managed-making-the-right-choice}

Noha büszkék vagyunk arra, hogy saját üzemeltetésű lehetőséget kínálunk, felismerjük, hogy ez nem mindenki számára a megfelelő választás. Az önkiszolgáló e-mailek valódi felelősségekkel és kihívásokkal járnak:

### Az önálló tárhelyszolgáltatással működő e-mailek valósága {#the-reality-of-self-hosting-email}

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

Sok felhasználó számára továbbra is menedzselt szolgáltatásunk a legjobb megoldás:

1. **Kényelem**: Minden karbantartást, frissítést és felügyeletet mi intézünk.
2. **Megbízhatóság**: Használja ki kiforrott infrastruktúránkat és szakértelmünket.
3. **Támogatás**: Probléma esetén segítséget kaphat.
4. **Szállíthatóság**: Használja ki kiforrott szellemi tulajdonunk hírnevét.
5. **Költséghatékonyság**: Ha figyelembe vesszük az időköltségeket, szolgáltatásunk gyakran gazdaságosabb.

Mindkét lehetőség ugyanazokat az adatvédelmi előnyöket és a nyílt forráskódú átláthatóságot biztosítja – a különbség egyszerűen az, hogy ki kezeli az infrastruktúrát.

## Első lépések a saját tárhelyen tárolt e-mail-továbbítással {#getting-started-with-self-hosted-forward-email}

Készen áll arra, hogy átvegye e-mail infrastruktúrája irányítását? Így kezdheti el:

### Rendszerkövetelmények {#system-requirements}

* Ubuntu 20.04 LTS vagy újabb (ajánlott)
* Minimum 1 GB RAM (2 GB+ ajánlott)
* 20 GB tárhely ajánlott
* Egy általad felügyelt domain név
* Nyilvános IP-cím 25-ös port támogatással
* Lehetőség a [fordított PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/) beállítására
* IPv4 és IPv6 támogatás

> \[!TIP]
> We recommend several mail server providers at <https://forwardemail.net/blog/docs/best-mail-server-providers> (source at <https://github.com/forwardemail/awesome-mail-server-providers>)

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
* A konténer állapotának ellenőrzése: `docker ps`
* Teszt e-mail küldése
* Bejelentkezés a webes felületre

## Az önállóan üzemeltetett e-mail jövője {#the-future-of-self-hosted-email}

Saját üzemeltetésű megoldásunk csak a kezdet. Elkötelezettek vagyunk amellett, hogy folyamatosan fejlesztjük ezt az ajánlatot:

1. **Továbbfejlesztett adminisztrációs eszközök**: Hatékonyabb webalapú felügyelet
2. **További hitelesítési lehetőségek**: Hardveres biztonsági kulcs támogatásával
3. **Speciális monitorozás**: Jobb betekintés a rendszer állapotába és teljesítményébe
4. **Többkiszolgálós telepítés**: Lehetőségek magas rendelkezésre állású konfigurációkhoz
5. **Közösségvezérelt fejlesztések**: A felhasználók hozzájárulásainak beépítése

## Konklúzió: E-mail szabadság mindenkinek {#conclusion-email-freedom-for-everyone}

Saját hosztolt e-mail megoldásunk bevezetése jelentős mérföldkövet jelent küldetésünkben, hogy az adatvédelemre fókuszáló, átlátható e-mail szolgáltatásokat nyújtsunk. Akár a felügyelt szolgáltatásunkat, akár a saját üzemeltetésű szolgáltatásunkat választja, hasznot húzhat a nyílt forráskódú alapelvek és a személyes adatok védelmét szolgáló tervezés iránti megingathatatlan elkötelezettségünkből.

Az e-mail túlságosan fontos ahhoz, hogy zárt, szabadalmaztatott rendszerek irányítsák, amelyek az adatgyűjtést helyezik előtérbe a felhasználói adatvédelemmel szemben. A Forward Email saját üzemeltetésű megoldásával büszkék vagyunk arra, hogy egy valódi alternatívát kínálunk – amely lehetővé teszi digitális kommunikációja teljes irányítását.

Hiszünk abban, hogy az adatvédelem nem csak egy szolgáltatás; ez alapvető jog. Saját hosztolt e-mail lehetőségünkkel pedig minden eddiginél elérhetőbbé tesszük ezt a jogot.

Készen állsz, hogy átvedd az irányítást az e-mailed felett? [Kezdje el még ma](https://forwardemail.net/self-hosted) vagy tekintsd meg a [GitHub adattár](https://github.com/forwardemail/forwardemail.net) oldalunkat, ha többet szeretnél megtudni.

## Hivatkozások {#references}

\[1] E-mail továbbítása GitHub adattárba: <https://github.com/forwardemail/forwardemail.net>

\[2] Saját tárhelyen tárolt dokumentáció: <https://forwardemail.net/en/self-hosted>

\[3] E-mail adatvédelem technikai megvalósítása: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] Miért fontos a nyílt forráskódú e-mail: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>