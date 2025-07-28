# Saját tárhelyen tárolt {#self-hosted}

## Tartalomjegyzék {#table-of-contents}

* [Első lépések](#getting-started)
* [Követelmények](#requirements)
  * [Felhőalapú init / Felhasználói adatok](#cloud-init--user-data)
* [Telepítés](#install)
  * [Hibakeresési telepítőszkript](#debug-install-script)
  * [Promptok](#prompts)
  * [Kezdeti beállítás (1. opció)](#initial-setup-option-1)
* [Szolgáltatások](#services)
  * [Fontos fájlelérési utak](#important-file-paths)
* [Konfiguráció](#configuration)
  * [Kezdeti DNS-beállítás](#initial-dns-setup)
* [Bevezetés](#onboarding)
* [Tesztelés](#testing)
  * [Az első alias létrehozása](#creating-your-first-alias)
  * [Első e-mail küldése / fogadása](#sending--receiving-your-first-email)
* [Hibaelhárítás](#troubleshooting)
  * [Mi az alapvető hitelesítési felhasználónév és jelszó?](#what-is-the-basic-auth-username-and-password)
  * [Honnan tudom, hogy mi fut?](#how-do-i-know-what-is-running)
  * [Honnan tudom, hogy valami nem működik, pedig annak működnie kellene?](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Hogyan találok naplókat?](#how-do-i-find-logs)
  * [Miért túllépik az időkorlátot a kimenő e-mailjeim?](#why-are-my-outgoing-emails-timing-out)

## Első lépések {#getting-started}

Saját tárhelyen futó e-mail megoldásunk, mint minden termékünk, 100%-ban nyílt forráskódú – mind a felhasználói felület, mind a háttérfelület tekintetében. Ez azt jelenti:

1. **Teljes átláthatóság**: Minden egyes kódsor, amely az e-mailjeidet feldolgozza, nyilvánosan ellenőrizhető.
2. **Közösségi hozzájárulások**: Bárki hozzájárulhat fejlesztésekhez vagy problémák megoldásához.
3. **Biztonság a nyitottságon keresztül**: A sebezhetőségeket egy globális közösség azonosíthatja és kijavíthatja.
4. **Nincs szállítói függőség**: Soha nem függsz a cégünk létezésétől.

A teljes kódbázis elérhető a GitHubon a <https://github.com/forwardemail/forwardemail.net>, címen, MIT licenc alatt.

Az architektúra a következőkhöz tartalmaz konténereket:

* SMTP szerver a kimenő e-mailekhez
* IMAP/POP3 szerverek az e-mailek lekéréséhez
* Webes felület adminisztrációhoz
* Adatbázis a konfiguráció tárolásához
* Redis a gyorsítótárazáshoz és a teljesítmény javításához
* SQLite a biztonságos, titkosított postafiók-tároláshoz

> \[!NOTE]
> Mindenképpen tekintse meg a [saját tárhelyen tárolt blog](https://forwardemail.net/blog/docs/self-hosted-solution) útmutatónkat
>
> Azok számára, akiket érdekel egy részletesebb, lépésről lépésre bemutatott verzió, tekintse meg a [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) vagy [Debian](https://forwardemail.net/guides/selfhosted-on-debian) alapú útmutatóinkat.

## Követelmények {#requirements}

A telepítőszkript futtatása előtt győződjön meg arról, hogy a következőkkel rendelkezik:

* **Operációs rendszer**: Linux alapú szerver (jelenleg Ubuntu 22.04+ támogatással).
* **Erőforrások**: 1 vCPU és 2 GB RAM
* **Root hozzáférés**: Rendszergazdai jogosultságok parancsok végrehajtásához.
* **Domain név**: Egyéni domain, amely készen áll a DNS-konfigurációra.
* **Tiszta IP cím**: Győződjön meg róla, hogy szervere tiszta, korábbi spam hírnévnek örvendő IP-címmel rendelkezik a tiltólisták ellenőrzésével. További információ: [itt](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Nyilvános IP-cím 25-ös port támogatással
* Lehetőség a [fordított PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/) beállítására
* IPv4 és IPv6 támogatás

> \[!TIP]
> Tekintse meg a [nagyszerű levelezőszerver-szolgáltatók](https://github.com/forwardemail/awesome-mail-server-providers) listánkat

### Felhőalapú init / Felhasználói adatok {#cloud-init--user-data}

A legtöbb felhőszolgáltató támogatja a felhőalapú init konfigurációt a virtuális magánkiszolgáló (VPS) kiépítésekor. Ez egy nagyszerű módja annak, hogy előre beállítsunk néhány fájlt és környezeti változót a szkript kezdeti beállítási logikája számára, így nem kell további információkat kérnie a szkript futása közben.

**Opciók**

* `EMAIL` - a certbot lejárati emlékeztetőihez használt e-mail cím
* `DOMAIN` - egyéni domain (pl. `example.com`) saját tárhely beállításához
* `AUTH_BASIC_USERNAME` - az első beállításkor használt felhasználónév a webhely védelméhez
* `AUTH_BASIC_PASSWORD` - az első beállításkor használt jelszó a webhely védelméhez
* `/root/.cloudflare.ini` - (**Csak Cloudflare felhasználók**) a certbot által a DNS-konfigurációhoz használt cloudflare konfigurációs fájl. Ehhez az API-tokent a `dns_cloudflare_api_token` paraméteren keresztül kell beállítani. További információ: [itt](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).

Példa:

```sh
#cloud-config
write_files:
  - path: /root/.cloudflare.ini
    content: |
      dns_cloudflare_api_token = "xxx"
    owner: root:root
    permissions: '0600'
  - path: /etc/profile.d/env.sh
    content: |
      export EMAIL="test@myemail.com"
      export DOMAIN="mydomain.com"

runcmd:
  - chmod +x /etc/profile.d/env.sh
```

## Telepítés {#install}

Futtassa a következő parancsot a szerverén a telepítőszkript letöltéséhez és végrehajtásához:

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Hibakeresési telepítőszkript {#debug-install-script}

A részletes kimenet érdekében a telepítőszkript elé adjuk hozzá a `DEBUG=true` karakterláncot:

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Promptok {#prompts}

```sh
1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

* **Kezdeti beállítás**: Töltse le a legújabb továbbítási e-mail kódot, konfigurálja a környezetet, kérje az egyéni domain megadását, és állítsa be az összes szükséges tanúsítványt, kulcsot és titkos kódot.
* **Biztonsági mentés beállítása**: Beállít egy cront a mongoDB és a redis biztonsági mentéséhez egy S3-kompatibilis tároló használatával a biztonságos, távoli tárolás érdekében. Az sqlite külön biztonsági mentésre kerül bejelentkezéskor, ha változások történnek a biztonságos, titkosított biztonsági mentésekben.
* **Frissítés beállítása**: Beállít egy cront az éjszakai frissítések kereséséhez, amelyek biztonságosan újraépítik és újraindítják az infrastruktúra-összetevőket.
* **Tanúsítványok megújítása**: A Certbot /lets encrypt az SSL-tanúsítványokhoz használatos, és a kulcsok 3 havonta lejárnak. Ez megújítja a domain tanúsítványait, és a kapcsolódó komponensek számára a szükséges mappába helyezi azokat. Lásd: [fontos fájlútvonalak](#important-file-paths)
* **Visszaállítás biztonsági mentésből**: Elindítja a mongodb és a redis általi visszaállítást a biztonsági mentésből.

### Kezdeti beállítás (1. opció) {#initial-setup-option-1}

Válassza a `1. Initial setup` lehetőséget a kezdéshez.

Ha kész, sikeres műveletről szóló üzenetet kell látnod. A `docker ps` parancs futtatásával is láthatod a **összetevők** felpörgését. További információ a komponensekről alább található.

## Szolgáltatások {#services}

| Szolgáltatás neve | Alapértelmezett port | Leírás |
| ------------ | :----------: | ------------------------------------------------------ |
| Web | `443` | Webes felület az összes adminisztrációs interakcióhoz |
| API | `4000` | API réteg absztrakt adatbázisokhoz |
| Bree | Egyik sem | Háttérben futó feladatok és feladatok futtatása |
| SMTP | `465/587` | SMTP-kiszolgáló a kimenő e-mailekhez |
| SMTP Bree | Egyik sem | SMTP háttérfeladat |
| MX | `2525` | Bejövő e-mailek levelezése és továbbítása |
| IMAP | `993/2993` | IMAP szerver a bejövő e-mailek és postafiókok kezeléséhez |
| POP3 | `995/2995` | POP3 szerver a bejövő e-mailek és postafiókok kezeléséhez |
| SQLite | `3456` | SQLite szerver az SQLite adatbázis(ok)kal való interakcióhoz |
| SQLite Bree | Egyik sem | SQLite háttérmunka |
| CalDAV | `5000` | CalDAV szerver a naptárkezeléshez |
| CardDAV | `6000` | CardDAV szerver a naptár kezeléséhez |
| MongoDB | `27017` | MongoDB adatbázis a legtöbb adatkezeléshez |
| Redis | `6379` | Redis gyorsítótárazáshoz és állapotkezeléshez |
| SQLite | Egyik sem | SQLite adatbázis(ok) titkosított postaládákhoz |

### Fontos fájlútvonalak {#important-file-paths}

Megjegyzés: Az alábbi *Host path* a `/root/forwardemail.net/self-hosting/`-hoz képest értendő.

| Összetevő | Gazdagép elérési útja | Konténer elérési útja |
| ---------------------- | :-------------------: | ---------------------------- |
| MongoDB | `./mongo-backups` | `/backups` |
| Redis | `./redis-data` | `/data` |
| Sqlite | `./sqlite-data` | `/mnt/{SQLITE_STORAGE_PATH}` |
| Környezetfájl | `./.env` | `/app/.env` |
| SSL tanúsítványok/kulcsok | `./ssl` | `/app/ssl/` |
| Privát kulcs | `./ssl/privkey.pem` | `/app/ssl/privkey.pem` |
| Teljes láncú tanúsítvány | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem` |
| Tanúsított hitelesítésszolgáltatók | `./ssl/cert.pem` | `/app/ssl/cert.pem` |
| DKIM privát kulcs | `./ssl/dkim.key` | `/app/ssl/dkim.key` |

> \[!IMPORTANT]
> Mentse el biztonságosan a `.env` fájlt. Hiba esetén elengedhetetlen a helyreállításhoz.
> Ezt a `/root/forwardemail.net/self-hosting/.env` mappában találja.

## konfiguráció {#configuration}

### Kezdeti DNS-beállítás {#initial-dns-setup}

A választott DNS-szolgáltatódban konfiguráld a megfelelő DNS-rekordokat. Felhívjuk a figyelmet arra, hogy a zárójelben (`<>`) lévő értékek dinamikusak, és frissíteni kell az általad megadott értékkel.

| Típus | Név | Tartalom | TTL |
| ----- | ------------------ | ----------------------------- | ---- |
| A | „@”, „.” vagy üres | <ip_cím> | autó |
| CNAME | API | <tartománynév> | autó |
| CNAME | caldav | <tartománynév> | autó |
| CNAME | carddav | <tartománynév> | autó |
| CNAME | fe-pattanások | <tartománynév> | autó |
| CNAME | IMAP | <tartománynév> | autó |
| CNAME | mx | <tartománynév> | autó |
| CNAME | pop3 | <tartománynév> | autó |
| CNAME | smtp | <tartománynév> | autó |
| MX | „@”, „.” vagy üres | mx.<tartománynév> (0. prioritás) | autó |
| TXT | „@”, „.” vagy üres | "v=spf1 a -all" | autó |

#### Fordított DNS / PTR rekord {#reverse-dns--ptr-record}

A fordított DNS (rDNS) vagy fordított mutatórekordok (PTR) elengedhetetlenek az e-mail-kiszolgálók számára, mivel segítenek ellenőrizni az e-mailt küldő kiszolgáló jogosságát. Minden felhőszolgáltató ezt másképp teszi, ezért meg kell néznie, hogyan adhatja hozzá a „Fordított DNS” rekordot a gazdagép és az IP-cím megfelelő gazdagépnévhez való leképezéséhez. Valószínűleg a szolgáltató hálózati részében található.

#### 25-ös port blokkolva {#port-25-blocked}

Néhány internetszolgáltató és felhőszolgáltató blokkolja a 25-ös portot a rosszindulatú szereplők elkerülése érdekében. Előfordulhat, hogy támogatási jegyet kell küldenie a 25-ös port SMTP / kimenő e-mailek számára történő megnyitásához.

## Bevezetés {#onboarding}

1. Nyissa meg a céloldalt.
Navigáljon a https\://\<domain_név> oldalra, és a \<domain_név> részt cserélje le a DNS-beállításokban konfigurált domainre. Ekkor megjelenik az E-mail továbbítása céloldal.

2. Jelentkezzen be és regisztrálja domainjét

* Jelentkezzen be érvényes e-mail címmel és jelszóval.
* Adja meg a beállítani kívánt domain nevet (ennek meg kell egyeznie a DNS-konfigurációval).
* Kövesse az utasításokat a szükséges **MX** és **TXT** rekordok hozzáadásához az ellenőrzéshez.

3. A beállítás befejezése

* Az ellenőrzés után nyissa meg az Aliasok oldalt az első alias létrehozásához.

* Opcionálisan konfigurálja az **SMTP-t a kimenő e-mailekhez** a **Domainbeállításokban**. Ehhez további DNS-rekordok szükségesek.

> \[!NOTE]
> A szerveren kívülre nem küldünk információt. Az önállóan üzemeltetett opció és a kezdeti fiók csak az adminisztrátori bejelentkezéshez és a webes nézethez használható a domainek, aliasok és a kapcsolódó e-mail konfigurációk kezeléséhez.

## Tesztelés {#testing}

### Első alias létrehozása {#creating-your-first-alias}

1. Navigáljon az Aliasok oldalra.
Nyissa meg az aliasok kezelési oldalát:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Új álnév hozzáadása

* Kattintson az **Alias hozzáadása** gombra (jobb felső sarokban).
* Adja meg az alias nevét, és szükség szerint módosítsa az e-mail beállításokat.
* (Opcionális) Engedélyezze az **IMAP/POP3/CalDAV/CardDAV** támogatást a jelölőnégyzet bejelölésével.
* Kattintson az **Alias létrehozása** gombra.

3. Jelszó beállítása

* Kattintson a **Jelszó generálása** gombra egy biztonságos jelszó létrehozásához.
* Erre a jelszóra szükség lesz az e-mail kliensbe való bejelentkezéshez.

4. Konfigurálja e-mail kliensét

* Használjon egy levelezőprogramot, például a Thunderbirdöt.
* Adja meg az aliasnevet és a létrehozott jelszót.
* Konfigurálja az **IMAP** és **SMTP** beállításokat ennek megfelelően.

#### E-mail szerver beállításai {#email-server-settings}

Felhasználónév: `<alias name>`

| Típus | Gazdagépnév | Kikötő | Kapcsolatbiztonság | Hitelesítés |
| ---- | ------------------ | ---- | ------------------- | --------------- |
| SMTP | smtp.<tartománynév> | 465 | SSL / TLS | Normál jelszó |
| IMAP | imap.<tartománynév> | 993 | SSL / TLS | Normál jelszó |

### Első e-mail küldése / fogadása {#sending--receiving-your-first-email}

A konfigurálás után képesnek kell lennie e-mailek küldésére és fogadására az újonnan létrehozott és saját tárhelyen tárolt e-mail címére!

## Hibaelhárítás {#troubleshooting}

#### Miért nem működik ez Ubuntu és Debian rendszeren kívül? {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Jelenleg MacOS támogatást keresünk, és továbbiakat is keresünk. Kérjük, nyisson meg egy [vita](https://github.com/orgs/forwardemail/discussions) fájlt, vagy járuljon hozzá, ha szeretné, hogy mások is támogatást kapjanak.

#### Miért hiúsul meg a certbot acme kihívás? {#why-is-the-certbot-acme-challenge-failing}

A leggyakoribb buktató, hogy a certbot / letsencrypt néha **2** kihívást kér. Ügyelj arra, hogy **MINDKÉT** txt rekordot adj hozzá.

Példa:
Két ehhez hasonló kihívással találkozhat:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

Az is lehetséges, hogy a DNS-terjesztés nem fejeződött be. Használhatsz olyan eszközöket, mint a `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. Ez segít eldönteni, hogy a TXT rekord változásainak tükröződniük kellene-e. Az is lehetséges, hogy a gazdagépeden lévő helyi DNS-gyorsítótár továbbra is egy régi, elavult értéket használ, vagy nem vette fel a legutóbbi változásokat.

Egy másik lehetőség az automatikus cerbot DNS-módosítások használata a `/root/.cloudflare.ini` fájl beállításával az API tokennel a cloud-init / user-data mappában a VPS kezdeti beállításakor, vagy a fájl létrehozása és a szkript újbóli futtatása. Ez automatikusan kezeli a DNS-módosításokat és a kihívásokkal teli frissítéseket.

### Mi az alapvető hitelesítési felhasználónév és jelszó? {#what-is-the-basic-auth-username-and-password}

Saját tárhely esetén egy első alkalommal böngészőn keresztüli hitelesítési felugró ablakot adunk hozzá, amely egy egyszerű felhasználónévvel (`admin`) és jelszóval (véletlenszerűen generálva a kezdeti beállítás során) rendelkezik. Ezt csak védelemként adjuk hozzá arra az esetre, ha az automatizálás/adatgyűjtők valahogyan meghiúsítanák a webes felületen történő első regisztrációt. Ezt a jelszót a kezdeti beállítás után a `.env` fájlban találod a `AUTH_BASIC_USERNAME` és `AUTH_BASIC_PASSWORD` alatt.

### Honnan tudom, hogy mi fut {#how-do-i-know-what-is-running}

A `docker ps` paranccsal megtekintheted az összes futó konténert, amelyeket a `docker-compose-self-hosting.yml` fájlból állítanak elő. A `docker ps -a` paranccsal mindent megtekinthetsz (beleértve a nem futó konténereket is).

### Honnan tudom, hogy valami nem fut, pedig annak kéne lennie? {#how-do-i-know-if-something-isnt-running-that-should-be}

A `docker ps -a` parancs futtatásával mindent megtekinthetsz (beleértve a nem futó konténereket is). Előfordulhat, hogy kilépési naplót vagy megjegyzést látsz.

### Hogyan találom meg a naplókat? {#how-do-i-find-logs}

További naplókat a `docker logs -f <container_name>` segítségével érhet el. Ha bármi kilépett, az valószínűleg a `.env` fájl helytelen konfigurációjához kapcsolódik.

A webes felhasználói felületen megtekintheti a `/admin/emails` és a `/admin/logs` naplókat a kimenő e-mailekhez, illetve a hibanaplókhoz.

### Miért túllépik az időkorlátot a kimenő e-mailjeim? {#why-are-my-outgoing-emails-timing-out}

Ha olyan üzenetet lát, mint például a „Kapcsolat időtúllépése történt az MX szerverhez való csatlakozáskor...”, akkor ellenőriznie kell, hogy a 25-ös port nincs-e blokkolva. Gyakori, hogy az internetszolgáltatók vagy a felhőszolgáltatók alapértelmezés szerint blokkolják ezt, ilyenkor előfordulhat, hogy fel kell vennie a kapcsolatot az ügyfélszolgálattal / be kell nyújtania egy ticketet a probléma feloldásához.

#### Milyen eszközöket használjak az e-mail konfiguráció legjobb gyakorlatainak és az IP-cím hírnevének teszteléséhez? {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Vessen egy pillantást a [GYIK itt](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation) oldalunkra.