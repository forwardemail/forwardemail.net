# Saját tárhelyen tárolt {#self-hosted}

## Tartalomjegyzék {#table-of-contents}

* [Kezdő lépések](#getting-started)
* [Követelmények](#requirements)
  * [Cloud-init / Felhasználói adatok](#cloud-init--user-data)
* [Telepítés](#install)
  * [Telepítési szkript hibakeresése](#debug-install-script)
  * [Kéri](#prompts)
  * [Kezdeti beállítás (1. lehetőség)](#initial-setup-option-1)
* [Szolgáltatások](#services)
  * [Fontos fájl elérési utak](#important-file-paths)
* [Konfiguráció](#configuration)
  * [Kezdeti DNS-beállítás](#initial-dns-setup)
* [Felvétel](#onboarding)
* [Tesztelés](#testing)
  * [Az első alias létrehozása](#creating-your-first-alias)
  * [Az első e-mail küldése / fogadása](#sending--receiving-your-first-email)
* [Hibaelhárítás](#troubleshooting)
  * [Mi az alapvető hitelesítési felhasználónév és jelszó](#what-is-the-basic-auth-username-and-password)
  * [Honnan tudhatom, hogy mi fut](#how-do-i-know-what-is-running)
  * [Honnan tudhatom, ha valami nem fut, annak lennie kellene](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Hogyan találhatok naplókat](#how-do-i-find-logs)
  * [Miért lépnek túl a kimenő e-mailjeim](#why-are-my-outgoing-emails-timing-out)

## Első lépések {#getting-started}

Saját hosztolt e-mail megoldásunk, mint minden termékünk, 100%-ban nyílt forráskódú – előtérben és háttérben egyaránt. Ez azt jelenti:

1. **Teljes átláthatóság**: Minden egyes kódsor, amely az e-mailjeidet feldolgozza, nyilvánosan ellenőrizhető.
2. **Közösségi hozzájárulások**: Bárki hozzájárulhat fejlesztésekhez vagy problémák megoldásához.
3. **Biztonság a nyitottságon keresztül**: A sebezhetőségeket egy globális közösség azonosíthatja és kijavíthatja.
4. **Nincs szállítói függőség**: Soha nem függsz a cégünk létezésétől.

A teljes kódbázis elérhető a GitHubon a <https://github.com/forwardemail/forwardemail.net>, címen, MIT licenc alatt.

Az architektúra konténereket tartalmaz:

* SMTP szerver a kimenő e-mailekhez
* IMAP/POP3 szerverek az e-mailek lekéréséhez
* Webes felület adminisztrációhoz
* Adatbázis a konfiguráció tárolásához
* Redis a gyorsítótárazáshoz és a teljesítmény javításához
* SQLite a biztonságos, titkosított postafiók-tároláshoz

> \[!NOTE]
> Be sure to check out our [self-hosted blog](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> And for those interested in a more broken down step-by-step version see our [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) or [Debian](https://forwardemail.net/guides/selfhosted-on-debian) based guides.

## Követelmények {#requirements}

A telepítő szkript futtatása előtt győződjön meg arról, hogy rendelkezik a következőkkel:

* **Operációs rendszer**: Linux alapú szerver (jelenleg Ubuntu 22.04+ támogatással).
* **Erőforrások**: 1 vCPU és 2 GB RAM
* **Root hozzáférés**: Rendszergazdai jogosultságok parancsok végrehajtásához.
* **Domain név**: Egyéni domain, amely készen áll a DNS-konfigurációra.
* **Tiszta IP cím**: Győződjön meg róla, hogy szervere tiszta, korábbi spam hírnévtől mentes IP-címmel rendelkezik a tiltólisták ellenőrzésével. További információ: [itt](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Nyilvános IP-cím 25-ös port támogatással
* Lehetőség van a [fordított PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/) beállítására
* IPv4 és IPv6 támogatás

> \[!TIP]
> See our list of [awesome mail server providers](https://github.com/forwardemail/awesome-mail-server-providers)

### Felhőalapú init / Felhasználói adatok {#cloud-init--user-data}

A legtöbb felhőszolgáltató támogatja a felhő-init konfigurációt a virtuális magánkiszolgáló (VPS) kiépítéséhez. Ez nagyszerű módja annak, hogy bizonyos fájlokat és környezeti változókat idő előtt beállítson a szkriptek kezdeti beállítási logikájának használatára, amely megkerüli a további információk kérését, miközben a szkript fut.

**Opciók**

* `EMAIL` - a certbot lejárati emlékeztetőihez használt e-mail cím
* `DOMAIN` - egyéni domain (pl. `example.com`) saját tárhely beállításához
* `AUTH_BASIC_USERNAME` - az első beállításkor használt felhasználónév a webhely védelméhez
* `AUTH_BASIC_PASSWORD` - az első beállításkor használt jelszó a webhely védelméhez
* `/root/.cloudflare.ini` - (**Csak Cloudflare felhasználóknak**) a certbot által a DNS-konfigurációhoz használt cloudflare konfigurációs fájl. Ehhez az API-tokent a `dns_cloudflare_api_token` segítségével kell beállítania. További információ: [itt](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).

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

## Telepítse a(z) {#install} webhelyet

Futtassa a következő parancsot a kiszolgálón a telepítőszkript letöltéséhez és végrehajtásához:

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Telepítőszkript hibakeresése {#debug-install-script}

A részletes kimenet érdekében a telepítőszkript elé írjuk be a `DEBUG=true` kódot:

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
* **Tanúsítványok megújítása**: A Certbot /lets encrypt az SSL-tanúsítványokhoz használatos, és a kulcsok 3 havonta lejárnak. Ez megújítja a domain tanúsítványait, és a kapcsolódó komponensek számára a szükséges mappába helyezi azokat. Lásd: [fontos fájl útvonalak](#important-file-paths)
* **Visszaállítás biztonsági mentésből**: Elindítja a mongodb és a redis általi visszaállítást a biztonsági mentésből.

### Kezdeti beállítás (1. opció) {#initial-setup-option-1}

Válassza a `1. Initial setup` lehetőséget a kezdéshez.

Ha kész, sikeres műveletről szóló üzenetet kell látnod. A `docker ps` parancs futtatásával is láthatod a **összetevők** felpörgését. További információ a komponensekről alább található.

## Szolgáltatások {#services}

| Szolgáltatás neve | Alapértelmezett port | Leírás |
| ------------ | :----------: | ------------------------------------------------------ |
| Web | `443` | Webes felület minden adminisztrátori interakcióhoz |
| API | `4000` | Api réteg absztrakt adatbázisokhoz |
| Bree | Egyik sem | Háttér munka és feladat futó |
| SMTP | `465/587` | SMTP szerver a kimenő e-mailekhez |
| SMTP Bree | Egyik sem | SMTP háttérmunka |
| MX | `2525` | Levélváltás bejövő e-mailekhez és e-mail-továbbításhoz |
| IMAP | `993/2993` | IMAP szerver a bejövő e-mailek és postafiókok kezeléséhez |
| POP3 | `995/2995` | POP3 szerver a bejövő e-mailek és postafiókok kezelésére |
| SQLite | `3456` | SQLite szerver az sqlite adatbázis(ok)kal való interakcióhoz |
| SQLite Bree | Egyik sem | SQLite háttérmunka |
| CalDAV | `5000` | CalDAV szerver naptárkezeléshez |
| CardDAV | `6000` | CardDAV szerver naptárkezeléshez |
| MongoDB | `27017` | MongoDB adatbázis a legtöbb adatkezeléshez |
| Redis | `6379` | Redis gyorsítótárazáshoz és állapotkezeléshez |
| SQLite | Egyik sem | SQLite adatbázis(ok) titkosított postafiókokhoz |

### Fontos fájlútvonalak {#important-file-paths}

Megjegyzés: Az alábbi *Host path* a `/root/forwardemail.net/self-hosting/`-hoz képest relatív.

| Összetevő | Gazda útvonala | Konténer útvonala |
| ---------------------- | :-------------------: | ---------------------------- |
| MongoDB | `./mongo-backups` | `/backups` |
| Redis | `./redis-data` | `/data` |
| Sqlite | `./sqlite-data` | `/mnt/{SQLITE_STORAGE_PATH}` |
| Env fájl | `./.env` | `/app/.env` |
| SSL-tanúsítványok/kulcsok | `./ssl` | `/app/ssl/` |
| Privát kulcs | `./ssl/privkey.pem` | `/app/ssl/privkey.pem` |
| Teljes lánc tanúsítvány | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem` |
| CA tanúsítványok | `./ssl/cert.pem` | `/app/ssl/cert.pem` |
| DKIM privát kulcs | `./ssl/dkim.key` | `/app/ssl/dkim.key` |

> \[!IMPORTANT]
> Save the `.env` file securely. It is critical for recovery in case of failure.
> You can find this in `/root/forwardemail.net/self-hosting/.env`.

## Konfiguráció {#configuration}

### Kezdeti DNS-beállítás {#initial-dns-setup}

A választott DNS-szolgáltatódban konfiguráld a megfelelő DNS-rekordokat. Felhívjuk a figyelmet arra, hogy a zárójelben (`<>`) lévő értékek dinamikusak, és frissíteni kell az általad megadott értékkel.

| Típus | Név | Tartalom | TTL |
| ----- | ------------------ | ----------------------------- | ---- |
| A | „@”, „.” vagy üres | <ip_cím> | auto |
| CNAME | api | <domain_name> | auto |
| CNAME | caldav | <domain_name> | auto |
| CNAME | carddav | <domain_name> | auto |
| CNAME | fe-pattan | <domain_name> | auto |
| CNAME | imap | <domain_name> | auto |
| CNAME | mx | <domain_name> | auto |
| CNAME | pop3 | <domain_name> | auto |
| CNAME | smtp | <domain_name> | auto |
| MX | „@”, „.” vagy üres | mx.<domain_name> (0. prioritás) | auto |
| TXT | „@”, „.” vagy üres | "v=spf1 a -all" | auto |

#### Fordított DNS / PTR rekord {#reverse-dns--ptr-record}

A fordított DNS (rDNS) vagy a fordított mutató rekordok (PTR rekordok) elengedhetetlenek az e-mail szerverek számára, mert segítenek ellenőrizni az e-mailt küldő szerver legitimitását. Minden felhőszolgáltató ezt másképp csinálja, ezért meg kell keresnie, hogyan adhatja hozzá a "Reverse DNS"-t, hogy a gazdagépet és az IP-t a megfelelő gazdagépnévhez rendelje. Valószínűleg a szolgáltató hálózati szakaszában.

#### 25-ös port blokkolva {#port-25-blocked}

Egyes internetszolgáltatók és felhőszolgáltatók blokkolják a 25-öt, hogy elkerüljék a rossz szereplőket. Előfordulhat, hogy támogatási jegyet kell benyújtania a 25-ös port megnyitásához az SMTP / kimenő e-mailek számára.

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
> No information is sent outside of your server. The self hosted option and initial account is just for the admin login and web view to manage domains, aliases and related email configurations.

## A(z) {#testing} tesztelése

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
| SMTP | smtp.<domain_name> | 465 | SSL / TLS | Normál jelszó |
| IMAP | imap.<domain_name> | 993 | SSL / TLS | Normál jelszó |

### Első e-mail küldése / fogadása {#sending--receiving-your-first-email}

A konfigurálás után képesnek kell lennie arra, hogy e-maileket küldjön és fogadjon az újonnan létrehozott és saját e-mail címére!

## Hibaelhárítás {#troubleshooting}

#### Miért nem működik ez Ubuntu és Debian rendszeren kívül? {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Jelenleg MacOS támogatást keresünk, és továbbiakat is keresünk. Kérjük, nyisson meg egy [vita](https://github.com/orgs/forwardemail/discussions) linket, vagy járuljon hozzá, ha szeretné, hogy mások is támogatást kapjanak.

#### Miért hiúsul meg a certbot acme kihívás? {#why-is-the-certbot-acme-challenge-failing}

A leggyakoribb buktató, hogy a certbot / letsencrypt néha **2** kihívást kér. Ügyelj arra, hogy **MINDKÉT** txt rekordot adj hozzá.

Példa:
Két ehhez hasonló kihívással találkozhat:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

Az is lehetséges, hogy a DNS-terjesztés nem fejeződött be. Használhatsz olyan eszközöket, mint a `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. Ez segít eldönteni, hogy a TXT rekord változásainak tükröződniük kellene-e. Az is lehetséges, hogy a gazdagépeden lévő helyi DNS-gyorsítótár továbbra is egy régi, elavult értéket használ, vagy nem vette fel a legutóbbi változásokat.

Egy másik lehetőség az automatikus cerbot DNS-módosítások használata a `/root/.cloudflare.ini` fájl API-tokennel való beállításával a cloud-init / user-data mappában a VPS kezdeti beállításakor, vagy a fájl létrehozása és a szkript újbóli futtatása. Ez automatikusan kezeli a DNS-módosításokat és a kihívásokkal teli frissítéseket.

### Mi az alapvető hitelesítési felhasználónév és jelszó? {#what-is-the-basic-auth-username-and-password}

Saját tárhely esetén egy első alkalommal böngészőn keresztüli hitelesítési felugró ablakot adunk hozzá, amely egy egyszerű felhasználónévvel (`admin`) és jelszóval (véletlenszerűen generálva a kezdeti beállítás során) rendelkezik. Ezt csak védelemként adjuk hozzá arra az esetre, ha az automatizálás/adatgyűjtés valahogy megelőzné a webes felületen történő első regisztrációt. Ezt a jelszót a kezdeti beállítás után a `.env` fájlban találod a `AUTH_BASIC_USERNAME` és `AUTH_BASIC_PASSWORD` alatt.

### Honnan tudom, hogy mi fut a(z) {#how-do-i-know-what-is-running} oldalon?

A `docker ps` parancs futtatásával megtekintheted az összes futó konténert, amelyeket a `docker-compose-self-hosting.yml` fájlból állítanak elő. A `docker ps -a` parancs futtatásával mindent láthatsz (beleértve a nem futó konténereket is).

### Honnan tudom, hogy valami nem fut, pedig annak {#how-do-i-know-if-something-isnt-running-that-should-be} kellene lennie?

A `docker ps -a` parancs futtatásával mindent láthatsz (beleértve a nem futó konténereket is). Láthatsz egy kilépési naplót vagy megjegyzést.

### Hogyan találom meg a naplókat {#how-do-i-find-logs}

További naplókat a `docker logs -f <container_name>` fájlon keresztül érhet el. Ha bármi kilépett, az valószínűleg a `.env` fájl helytelen konfigurációjához kapcsolódik.

A webes felhasználói felületen a kimenő e-mailek naplóit a `/admin/emails`, a hibanaplókat pedig a `/admin/logs` naplóval tekintheti meg.

### Miért túllépik az időkorlátot a kimenő e-mailjeim? {#why-are-my-outgoing-emails-timing-out}

Ha az MX szerverhez való csatlakozáskor olyan üzenetet lát, mint a Connection time out..., akkor előfordulhat, hogy ellenőriznie kell, hogy a 25-ös port blokkolva van-e. Gyakori, hogy az internetszolgáltatók vagy a felhőszolgáltatók ezt alapértelmezés szerint blokkolják, ahol előfordulhat, hogy fel kell vennie a kapcsolatot a támogatással / jegyet kell benyújtania a megnyitáshoz.

#### Milyen eszközöket használjak az e-mail konfiguráció legjobb gyakorlatainak és az IP-cím hírnevének teszteléséhez {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Vessen egy pillantást a [GYIK itt](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation) oldalunkra.