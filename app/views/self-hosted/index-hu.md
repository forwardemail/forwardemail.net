# Önállóan hosztolt {#self-hosted}


## Tartalomjegyzék {#table-of-contents}

* [Első lépések](#getting-started)
* [Követelmények](#requirements)
  * [Cloud-init / User-data](#cloud-init--user-data)
* [Telepítés](#install)
  * [Telepítő script hibakeresése](#debug-install-script)
  * [Kérdések](#prompts)
  * [Kezdeti beállítás (1. lehetőség)](#initial-setup-option-1)
* [Szolgáltatások](#services)
  * [Fontos fájl elérési utak](#important-file-paths)
* [Konfiguráció](#configuration)
  * [Kezdeti DNS beállítás](#initial-dns-setup)
* [Bevezetés](#onboarding)
* [Tesztelés](#testing)
  * [Első alias létrehozása](#creating-your-first-alias)
  * [Első email küldése / fogadása](#sending--receiving-your-first-email)
* [Hibaelhárítás](#troubleshooting)
  * [Mi az alapvető hitelesítés felhasználóneve és jelszava](#what-is-the-basic-auth-username-and-password)
  * [Honnan tudom, mi fut éppen](#how-do-i-know-what-is-running)
  * [Honnan tudom, ha valami nem fut, pedig kellene](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Hogyan találok naplókat](#how-do-i-find-logs)
  * [Miért időtúllépésesek a kimenő leveleim](#why-are-my-outgoing-emails-timing-out)


## Első lépések {#getting-started}

Az önállóan hosztolt email megoldásunk, mint minden termékünk, 100%-ban nyílt forráskódú — mind frontend, mind backend tekintetében. Ez azt jelenti:

1. **Teljes átláthatóság**: Minden egyes kódsor, amely az emailjeidet feldolgozza, nyilvánosan megtekinthető
2. **Közösségi hozzájárulások**: Bárki hozzájárulhat fejlesztésekkel vagy hibajavításokkal
3. **Biztonság a nyitottság által**: A sebezhetőségek globális közösség által azonosíthatók és javíthatók
4. **Nincs szolgáltatófüggőség**: Soha nem vagyunk a cégünk létezésétől függő helyzetben

Az egész kódbázis elérhető a GitHubon a <https://github.com/forwardemail/forwardemail.net> címen, MIT licenc alatt.

Az architektúra tartalmaz konténereket:

* SMTP szerver a kimenő levelekhez
* IMAP/POP3 szerverek az emailek lekéréséhez
* Webes felület az adminisztrációhoz
* Adatbázis a konfiguráció tárolásához
* Redis a gyorsítótárazáshoz és teljesítményhez
* SQLite a biztonságos, titkosított postaláda tároláshoz

> \[!NOTE]
> Feltétlenül nézd meg a [önállóan hosztolt blogunkat](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> És azoknak, akik részletesebb, lépésről lépésre útmutatót szeretnének, ajánljuk az [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) vagy [Debian](https://forwardemail.net/guides/selfhosted-on-debian) alapú útmutatóinkat.


## Követelmények {#requirements}

A telepítő script futtatása előtt győződj meg a következőkről:

* **Operációs rendszer**: Linux alapú szerver (jelenleg Ubuntu 22.04+ támogatott).
* **Erőforrások**: 1 vCPU és 2GB RAM
* **Root hozzáférés**: Adminisztrátori jogosultságok a parancsok végrehajtásához.
* **Domain név**: Egy egyedi domain, amely készen áll a DNS konfigurációra.
* **Tiszta IP**: Győződj meg róla, hogy a szervered IP címe tiszta, nincs spam előélete, ezt ellenőrizheted feketelistákon. További info [itt](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Nyilvános IP cím port 25 támogatással
* Képes vagy beállítani [fordított PTR rekordot](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* IPv4 és IPv6 támogatás

> \[!TIP]
> Nézd meg a [szuper mail szerver szolgáltatók listáját](https://github.com/forwardemail/awesome-mail-server-providers)

### Cloud-init / User-data {#cloud-init--user-data}

A legtöbb felhőszolgáltató támogatja a cloud-init konfigurációt, amely a virtuális privát szerver (VPS) előkészítésekor használható. Ez nagyszerű mód arra, hogy előre beállíts fájlokat és környezeti változókat, amelyeket a script kezdeti beállítási logikája használ, így a script futása közben nem kell további információkat bekérni.

**Opciók**

* `EMAIL` - az email cím, amelyet a certbot lejárati emlékeztetőkhöz használ
* `DOMAIN` - egyedi domain (pl. `example.com`), amelyet az önálló hosztolás beállításához használsz
* `AUTH_BASIC_USERNAME` - felhasználónév, amelyet az első beállításkor a webhely védelmére használsz
* `AUTH_BASIC_PASSWORD` - jelszó, amelyet az első beállításkor a webhely védelmére használsz
* `/root/.cloudflare.ini` - (**csak Cloudflare felhasználóknak**) a certbot által DNS konfigurációhoz használt cloudflare konfigurációs fájl. Ehhez be kell állítanod az API tokent a `dns_cloudflare_api_token` segítségével. További információ [itt](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).
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

Futtassa a következő parancsot a szerverén az installációs szkript letöltéséhez és végrehajtásához:

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Hibakeresés telepítő szkripttel {#debug-install-script}

Adja hozzá a `DEBUG=true` előtagot az installációs szkript elé a részletes kimenethez:

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Kérdések {#prompts}

```sh
1. Kezdeti beállítás
2. Biztonsági mentések beállítása
3. Automatikus frissítések beállítása
4. Tanúsítványok megújítása
5. Visszaállítás biztonsági mentésből
6. Segítség
7. Kilépés
```

* **Kezdeti beállítás**: Letölti a legfrissebb forward email kódot, konfigurálja a környezetet, bekéri az egyedi domain nevét, és beállítja az összes szükséges tanúsítványt, kulcsot és titkot.
* **Biztonsági mentés beállítása**: Beállít egy cron-t a mongoDB és redis biztonsági mentéséhez egy S3-kompatibilis tároló használatával a biztonságos, távoli tároláshoz. Külön-külön az sqlite is mentésre kerül bejelentkezéskor, ha történt változás, a biztonságos, titkosított mentések érdekében.
* **Frissítés beállítása**: Beállít egy cron-t az éjszakai frissítések keresésére, amelyek biztonságosan újraépítik és újraindítják az infrastruktúra komponenseit.
* **Tanúsítványok megújítása**: A Certbot / lets encrypt SSL tanúsítványokat és kulcsokat kezel, amelyek 3 havonta lejárnak. Ez megújítja a domain tanúsítványait, és elhelyezi azokat a szükséges mappában, hogy a kapcsolódó komponensek használhassák. Lásd [fontos fájl elérési útvonalak](#important-file-paths)
* **Visszaállítás biztonsági mentésből**: Elindítja a mongodb és redis visszaállítását a mentett adatokból.

### Kezdeti beállítás (1. opció) {#initial-setup-option-1}

Válassza az `1. Kezdeti beállítás` opciót a kezdéshez.

A befejezés után sikerüzenetet kell látnia. Futtathatja a `docker ps` parancsot is, hogy lássa az elindított komponenseket. További információk a komponensekről lentebb.


## Szolgáltatások {#services}

| Szolgáltatás neve |         Alapértelmezett port         | Leírás                                               |
| ----------------- | :---------------------------------: | ---------------------------------------------------- |
| Web               |               `443`                 | Webes felület az összes adminisztrációs művelethez  |
| API               |               `4000`                | API réteg az adatbázisok absztrakciójához            |
| Bree              |                Nincs                | Háttérfeladat és munkafuttató                        |
| SMTP              | `465` (ajánlott) / `587`            | SMTP szerver a kimenő levelekhez                     |
| SMTP Bree         |                Nincs                | SMTP háttérfeladat                                    |
| MX                |               `2525`                | Levelező szerver bejövő levelekhez és továbbításhoz |
| IMAP              |             `993/2993`              | IMAP szerver bejövő levelekhez és postaláda kezeléshez |
| POP3              |             `995/2995`              | POP3 szerver bejövő levelekhez és postaláda kezeléshez |
| SQLite            |               `3456`                | SQLite szerver az sqlite adatbázis(ok) kezeléséhez  |
| SQLite Bree       |                Nincs                | SQLite háttérfeladat                                  |
| CalDAV            |               `5000`                | CalDAV szerver naptárkezeléshez                       |
| CardDAV           |               `6000`                | CardDAV szerver névjegykezeléshez                     |
| MongoDB           |              `27017`                | MongoDB adatbázis a legtöbb adat kezeléséhez         |
| Redis             |               `6379`                | Redis gyorsítótárazáshoz és állapotkezeléshez        |
| SQLite            |                Nincs                | SQLite adatbázis(ok) titkosított postaládákhoz       |

### Fontos fájl elérési útvonalak {#important-file-paths}

Megjegyzés: Az *Host path* alább a `/root/forwardemail.net/self-hosting/`-hez viszonyított útvonal.

| Komponens              |       Host útvonal       | Konténer útvonal             |
| ---------------------- | :---------------------: | ---------------------------- |
| MongoDB                |   `./mongo-backups`     | `/backups`                   |
| Redis                  |     `./redis-data`      | `/data`                      |
| Sqlite                 |    `./sqlite-data`      | `/mnt/{SQLITE_STORAGE_PATH}` |
| Env fájl               |        `./.env`         | `/app/.env`                  |
| SSL tanúsítványok/kulcsok |        `./ssl`          | `/app/ssl/`                  |
| Privát kulcs           |  `./ssl/privkey.pem`    | `/app/ssl/privkey.pem`       |
| Teljes lánc tanúsítvány | `./ssl/fullchain.pem`   | `/app/ssl/fullchain.pem`     |
| CA tanúsítvány         |    `./ssl/cert.pem`     | `/app/ssl/cert.pem`          |
| DKIM privát kulcs      |    `./ssl/dkim.key`     | `/app/ssl/dkim.key`          |
> \[!IMPORTANT]
> Mentse biztonságosan a `.env` fájlt. Kritikus a helyreállításhoz hiba esetén.
> Ezt megtalálja a `/root/forwardemail.net/self-hosting/.env` útvonalon.


## Konfiguráció {#configuration}

### Kezdeti DNS beállítás {#initial-dns-setup}

A választott DNS szolgáltatójánál állítsa be a megfelelő DNS rekordokat. Vegye figyelembe, hogy a zárójelben lévő (`<>`) érték dinamikus, és a saját értékére kell cserélni.

| Típus | Név                | Tartalom                     | TTL  |
| ----- | ------------------ | ---------------------------- | ---- |
| A     | "@", ".", vagy üres| <ip_address>                 | auto |
| CNAME | api                | <domain_name>                | auto |
| CNAME | caldav             | <domain_name>                | auto |
| CNAME | carddav            | <domain_name>                | auto |
| CNAME | fe-bounces         | <domain_name>                | auto |
| CNAME | imap               | <domain_name>                | auto |
| CNAME | mx                 | <domain_name>                | auto |
| CNAME | pop3               | <domain_name>                | auto |
| CNAME | smtp               | <domain_name>                | auto |
| MX    | "@", ".", vagy üres| mx.<domain_name> (prioritás 0) | auto |
| TXT   | "@", ".", vagy üres| "v=spf1 a -all"              | auto |

#### Fordított DNS / PTR rekord {#reverse-dns--ptr-record}

A fordított DNS (rDNS) vagy fordított mutató rekordok (PTR rekordok) elengedhetetlenek az e-mail szerverek számára, mert segítenek ellenőrizni az e-mailt küldő szerver hitelességét. Minden felhőszolgáltató másképp kezeli ezt, ezért meg kell néznie, hogyan lehet hozzáadni a "Fordított DNS"-t, hogy a hoszt és az IP a megfelelő hosztnévhez legyen társítva. Valószínűleg a szolgáltató hálózati szekciójában található.

#### 25-ös port blokkolva {#port-25-blocked}

Néhány internetszolgáltató és felhőszolgáltató blokkolja a 25-ös portot a rosszindulatú felhasználók elkerülése érdekében. Előfordulhat, hogy támogatási jegyet kell benyújtania a 25-ös port megnyitásához SMTP / kimenő e-mailhez.


## Bevezetés {#onboarding}

1. Nyissa meg a kezdőlapot  
   Navigáljon a https\://\<domain_name> címre, ahol a \<domain_name> helyére a DNS beállításokban megadott domaint írja. Meg kell jelennie a Forward Email kezdőlapjának.

2. Jelentkezzen be és regisztrálja a domainjét

* Jelentkezzen be érvényes e-mail címmel és jelszóval.
* Adja meg a beállítani kívánt domain nevet (ennek meg kell egyeznie a DNS konfigurációval).
* Kövesse az utasításokat a szükséges **MX** és **TXT** rekordok hozzáadásához az ellenőrzéshez.

3. Befejezés

* Az ellenőrzés után lépjen az Aliases oldalra az első alias létrehozásához.
* Opcionálisan állítsa be az **SMTP-t a kimenő e-mailekhez** a **Domain beállítások** között. Ehhez további DNS rekordok szükségesek.

> \[!NOTE]
> Semmilyen információ nem kerül ki a szerveréről. Az önállóan hosztolt opció és az első fiók csak az admin bejelentkezéshez és a webes felülethez szükséges a domainek, aliasok és kapcsolódó e-mail beállítások kezeléséhez.


## Tesztelés {#testing}

### Első alias létrehozása {#creating-your-first-alias}

1. Navigáljon az Aliasok oldalra  
   Nyissa meg az alias kezelő oldalt:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Új alias hozzáadása

* Kattintson az **Alias hozzáadása** gombra (jobb felső sarok).
* Adja meg az alias nevét és állítsa be az e-mail beállításokat szükség szerint.
* (Opcionális) Engedélyezze az **IMAP/POP3/CalDAV/CardDAV** támogatást a jelölőnégyzet bejelölésével.
* Kattintson az **Alias létrehozása** gombra.

3. Jelszó beállítása

* Kattintson a **Jelszó generálása** gombra egy biztonságos jelszó létrehozásához.
* Ez a jelszó szükséges lesz az e-mail kliensbe való bejelentkezéshez.

4. E-mail kliens beállítása

* Használjon olyan e-mail klienst, mint a Thunderbird.
* Adja meg az alias nevet és a generált jelszót.
* Állítsa be az **IMAP** és **SMTP** beállításokat ennek megfelelően.

#### E-mail szerver beállítások {#email-server-settings}

Felhasználónév: `<alias name>`

| Típus | Hosztnév           | Port | Kapcsolat biztonsága | Hitelesítés    |
| ----- | ------------------ | ---- | -------------------- | -------------- |
| SMTP  | smtp.<domain_name> | 465  | SSL / TLS            | Normál jelszó  |
| IMAP  | imap.<domain_name> | 993  | SSL / TLS            | Normál jelszó  |

### Első e-mail küldése / fogadása {#sending--receiving-your-first-email}

A beállítás után képesnek kell lennie arra, hogy küldjön és fogadjon e-maileket az újonnan létrehozott és önállóan hosztolt e-mail címére!
## Hibakeresés {#troubleshooting}

#### Miért nem működik ez Ubuntu és Debian rendszereken kívül? {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Jelenleg a MacOS támogatásán dolgozunk, és más rendszerek felé is nyitottak vagyunk. Kérjük, nyisson egy [beszélgetést](https://github.com/orgs/forwardemail/discussions) vagy járuljon hozzá, ha szeretné, hogy más rendszerek is támogatottak legyenek.

#### Miért sikertelen a certbot acme kihívás {#why-is-the-certbot-acme-challenge-failing}

A leggyakoribb buktató, hogy a certbot / letsencrypt néha **2** kihívást kér. Biztosnak kell lennie abban, hogy **MINDKÉT** txt rekordot hozzáadja.

Példa:
Lehet, hogy két kihívást lát így:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

Az is előfordulhat, hogy a DNS propagáció még nem fejeződött be. Használhat olyan eszközöket, mint: `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. Ez megmutatja, hogy a TXT rekord változásai tükröződnek-e már. Az is lehetséges, hogy a helyi DNS gyorsítótár a gazdagépen még egy régi, elavult értéket használ, vagy még nem vette át a legutóbbi változásokat.

Egy másik lehetőség az automatikus certbot DNS változtatások használata a `/root/.cloudflare.ini` fájl beállításával az api tokennel a cloud-init / user-data-ban az első VPS beállításkor, vagy hozza létre ezt a fájlt és futtassa újra a szkriptet. Ez automatikusan kezeli a DNS változtatásokat és a kihívás frissítéseket.

### Mi az alapértelmezett felhasználónév és jelszó a basic auth-hoz? {#what-is-the-basic-auth-username-and-password}

Önmagunk általi hosztolás esetén egy első alkalommal megjelenő böngésző natív hitelesítési felugró ablakot adunk hozzá egyszerű felhasználónévvel (`admin`) és jelszóval (ami az első beállításkor véletlenszerűen generálódik). Ezt védelemként adjuk hozzá arra az esetre, ha az automatizálás / adatgyűjtők valahogy megelőznének az első webes regisztrációnál. Ezt a jelszót az első beállítás után megtalálja a `.env` fájlban az `AUTH_BASIC_USERNAME` és `AUTH_BASIC_PASSWORD` alatt.

### Hogyan tudom, mi fut éppen? {#how-do-i-know-what-is-running}

Futtassa a `docker ps` parancsot, hogy lássa az összes futó konténert, amely a `docker-compose-self-hosting.yml` fájlból indul. A `docker ps -a` parancsot is használhatja, hogy mindent lásson (beleértve a nem futó konténereket is).

### Hogyan tudom, ha valami nem fut, pedig futnia kellene? {#how-do-i-know-if-something-isnt-running-that-should-be}

Futtassa a `docker ps -a` parancsot, hogy mindent lásson (beleértve a nem futó konténereket is). Láthat egy kilépési naplót vagy megjegyzést.

### Hogyan találom meg a naplókat? {#how-do-i-find-logs}

További naplókat a `docker logs -f <container_name>` paranccsal érhet el. Ha valami kilépett, valószínűleg a `.env` fájl helytelen konfigurációja okozza.

A webes felületen megtekintheti az `/admin/emails` és az `/admin/logs` oldalakat a kimenő e-mailek naplózásához és a hibák naplózásához.

### Miért időzik ki a kimenő e-mailem? {#why-are-my-outgoing-emails-timing-out}

Ha olyan üzenetet lát, hogy Connection timed out when connecting to MX server..., akkor ellenőriznie kell, hogy a 25-ös port nincs-e blokkolva. Gyakori, hogy az internetszolgáltatók vagy felhőszolgáltatók alapértelmezés szerint blokkolják ezt, ilyenkor támogatáshoz kell fordulni vagy jegyet kell nyitni a feloldáshoz.

#### Milyen eszközöket használjak az e-mail konfiguráció legjobb gyakorlatai és az IP hírnév teszteléséhez? {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Nézze meg a [GYIK-unkat itt](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation).
