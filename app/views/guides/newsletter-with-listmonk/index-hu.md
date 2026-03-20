# Listmonk a Forward Email-vel a Biztonságos Hírlevélküldéshez {#listmonk-with-forward-email-for-secure-newsletter-delivery}


## Tartalomjegyzék {#table-of-contents}

* [Áttekintés](#overview)
* [Miért Listmonk és Forward Email](#why-listmonk-and-forward-email)
* [Előfeltételek](#prerequisites)
* [Telepítés](#installation)
  * [1. Frissítse a szerverét](#1-update-your-server)
  * [2. Telepítse a függőségeket](#2-install-dependencies)
  * [3. Töltse le a Listmonk konfigurációt](#3-download-listmonk-configuration)
  * [4. Tűzfal konfigurálása (UFW)](#4-configure-firewall-ufw)
  * [5. HTTPS hozzáférés beállítása](#5-configure-https-access)
  * [6. Listmonk indítása](#6-start-listmonk)
  * [7. Forward Email SMTP konfigurálása Listmonk-ban](#7-configure-forward-email-smtp-in-listmonk)
  * [8. Bounce feldolgozás konfigurálása](#8-configure-bounce-processing)
* [Tesztelés](#testing)
  * [Hírlevél lista létrehozása](#create-a-mailing-list)
  * [Feliratkozók hozzáadása](#add-subscribers)
  * [Kampány létrehozása és küldése](#create-and-send-a-campaign)
* [Ellenőrzés](#verification)
* [Fejlesztői megjegyzések](#developer-notes)
* [Összegzés](#conclusion)


## Áttekintés {#overview}

Ez az útmutató lépésről lépésre segíti a fejlesztőket a [Listmonk](https://listmonk.app/) – egy erőteljes, nyílt forráskódú hírlevél- és levelezőlista-kezelő – beállításában, hogy a [Forward Email](https://forwardemail.net/) SMTP szolgáltatóját használja. Ez a kombináció lehetővé teszi a kampányok hatékony kezelését, miközben biztosítja a biztonságos, privát és megbízható e-mail kézbesítést.

* **Listmonk**: Kezeli a feliratkozókat, a listák szervezését, kampányok létrehozását és teljesítményük nyomon követését.
* **Forward Email**: Biztonságos SMTP szerverként működik, kezeli az e-mailek tényleges küldését beépített biztonsági funkciókkal, mint az SPF, DKIM, DMARC és TLS titkosítás.

Ezek integrálásával teljes kontrollt tarthat az adatai és infrastruktúrája felett, miközben kihasználja a Forward Email robusztus kézbesítési rendszerét.


## Miért Listmonk és Forward Email {#why-listmonk-and-forward-email}

* **Nyílt forráskódú**: Mind a Listmonk, mind a Forward Email mögötti elvek átláthatóságot és kontrollt hangsúlyoznak. Ön üzemelteti a Listmonk-ot, így az adatai az Önéi.
* **Adatvédelem-központú**: A Forward Email a magánélet védelmét helyezi előtérbe, minimalizálva az adatmegőrzést és a biztonságos továbbítást.
* **Költséghatékony**: A Listmonk ingyenes, a Forward Email pedig bőkezű ingyenes csomagokat és megfizethető fizetős terveket kínál, így költséghatékony megoldás.
* **Skálázhatóság**: A Listmonk nagy teljesítményű, a Forward Email infrastruktúrája pedig megbízható kézbesítést biztosít nagy volumenben is.
* **Fejlesztőbarát**: A Listmonk erős API-t kínál, a Forward Email pedig egyszerű SMTP integrációt és webhookokat biztosít.


## Előfeltételek {#prerequisites}

Mielőtt elkezdené, győződjön meg a következőkről:

* Egy virtuális privát szerver (VPS), amely egy friss Linux disztribúciót futtat (ajánlott Ubuntu 20.04+), legalább 1 CPU-val és 1GB RAM-mal (ajánlott 2GB).
  * Kell szolgáltató? Tekintse meg a [ajánlott VPS listát](https://github.com/forwardemail/awesome-mail-server-providers).
* Egy domain név, amelyet Ön irányít (DNS hozzáféréssel).
* Aktív fiók a [Forward Email](https://forwardemail.net/) szolgáltatásnál.
* Root vagy `sudo` hozzáférés a VPS-hez.
* Alapvető ismeretek a Linux parancssoros műveletekről.


## Telepítés {#installation}

Ezek a lépések végigvezetik a Listmonk telepítését Docker és Docker Compose használatával a VPS-en.

### 1. Frissítse a szerverét {#1-update-your-server}

Győződjön meg róla, hogy a rendszer csomaglistája és telepített csomagjai naprakészek.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Telepítse a függőségeket {#2-install-dependencies}

Telepítse a Dockert, Docker Compose-t és az UFW-t (Egyszerűsített tűzfal).

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Töltse le a Listmonk konfigurációt {#3-download-listmonk-configuration}

Hozzon létre egy könyvtárat a Listmonk számára, és töltse le a hivatalos `docker-compose.yml` fájlt.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

Ez a fájl definiálja a Listmonk alkalmazás konténert és a szükséges PostgreSQL adatbázis konténert.
### 4. Tűzfal konfigurálása (UFW) {#4-configure-firewall-ufw}

Engedélyezze az alapvető forgalmat (SSH, HTTP, HTTPS) a tűzfalon keresztül. Ha az SSH nem szabványos porton fut, állítsa be ennek megfelelően.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

Erősítse meg a tűzfal engedélyezését, amikor a rendszer kéri.

### 5. HTTPS hozzáférés konfigurálása {#5-configure-https-access}

A Listmonk HTTPS-en keresztüli futtatása elengedhetetlen a biztonság érdekében. Két fő lehetőség közül választhat:

#### A lehetőség: Cloudflare proxy használata (Egyszerűség miatt ajánlott) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

Ha a domain DNS kezelését a Cloudflare végzi, kihasználhatja a proxy szolgáltatásukat az egyszerű HTTPS-hez.

1. **DNS beállítása**: Hozzon létre egy `A` rekordot a Cloudflare-ben a Listmonk aldomainjéhez (pl. `listmonk.yourdomain.com`), amely a VPS IP-címére mutat. Győződjön meg róla, hogy a **Proxy állapot** **Proxied** (narancssárga felhő) értékre van állítva.
2. **Docker Compose módosítása**: Szerkessze a letöltött `docker-compose.yml` fájlt:
   ```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
   Ez lehetővé teszi, hogy a Listmonk belsőleg a 80-as porton legyen elérhető, amelyet a Cloudflare proxyzhat és HTTPS-sel biztosíthat.

#### B lehetőség: Reverse proxy használata (Nginx, Caddy, stb.) {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

Alternatívaként beállíthat egy reverse proxy-t, például Nginx-et vagy Caddy-t a VPS-én, amely kezeli a HTTPS lezárást és továbbítja a kéréseket a Listmonk felé (alapértelmezettként a 9000-es porton fut).

* Tartsa meg az alapértelmezett `ports: - "127.0.0.1:9000:9000"` beállítást a `docker-compose.yml`-ben, hogy a Listmonk csak helyileg legyen elérhető.
* Konfigurálja a választott reverse proxy-t, hogy figyeljen a 80-as és 443-as portokon, kezelje az SSL tanúsítvány beszerzését (pl. Let's Encrypt segítségével), és továbbítsa a forgalmat a `http://127.0.0.1:9000` címre.
* A reverse proxy részletes beállítása ezen útmutató hatókörén kívül esik, de számos oktatóanyag elérhető az interneten.

### 6. Listmonk indítása {#6-start-listmonk}

Lépjen vissza a `listmonk` könyvtárba (ha még nem ott van), és indítsa el a konténereket leválasztott módban.

```bash
cd ~/listmonk # Vagy ahová a docker-compose.yml fájlt mentette
docker compose up -d
```

A Docker letölti a szükséges képeket, és elindítja a Listmonk alkalmazás és adatbázis konténereket. Ez az első alkalommal egy-két percet is igénybe vehet.

✅ **Listmonk elérése**: Most már el kell tudnia érni a Listmonk webes felületét a beállított domainen keresztül (pl. `https://listmonk.yourdomain.com`).

### 7. Forward Email SMTP konfigurálása Listmonkban {#7-configure-forward-email-smtp-in-listmonk}

Ezután állítsa be a Listmonkot, hogy a Forward Email fiókján keresztül küldjön e-maileket.

1. **SMTP engedélyezése a Forward Email-ben**: Győződjön meg róla, hogy létrehozott SMTP hitelesítő adatokat a Forward Email fiókja irányítópultján. Ha még nem tette meg, kövesse a [Forward Email útmutatót az egyedi domainnel SMTP-n keresztüli e-mail küldéshez](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp).
2. **Listmonk konfigurálása**: Jelentkezzen be a Listmonk admin panelbe.
   * Navigáljon a **Beállítások -> SMTP** menüponthoz.

   * A Listmonk beépített támogatást nyújt a Forward Emailhez. Válassza ki a szolgáltatók listájából a **ForwardEmail** opciót, vagy adja meg kézzel az alábbi adatokat:

     | Beállítás         | Érték                                                                                                              |
     | :---------------- | :----------------------------------------------------------------------------------------------------------------- |
     | **Host**          | `smtp.forwardemail.net`                                                                                            |
     | **Port**          | `465`                                                                                                              |
     | **Hitelesítési protokoll** | `LOGIN`                                                                                                      |
     | **Felhasználónév** | Az Ön Forward Email **SMTP felhasználóneve**                                                                       |
     | **Jelszó**        | Az Ön Forward Email **SMTP jelszava**                                                                              |
     | **TLS**           | `SSL/TLS`                                                                                                          |
     | **Feladó e-mail** | Az Ön kívánt `Feladó` címe (pl. `newsletter@yourdomain.com`). Győződjön meg róla, hogy ez a domain be van állítva a Forward Emailben. |
* **Fontos**: Mindig használd a `465`-ös portot `SSL/TLS`-sel a Forward Email biztonságos kapcsolataihoz (ajánlott). A `587`-es port STARTTLS-sel is támogatott, de az SSL/TLS az előnyben részesített.

   * Kattints a **Mentés** gombra.
3. **Teszt e-mail küldése**: Használd az SMTP beállítások oldalán található "Teszt e-mail küldése" gombot. Adj meg egy olyan címzett címet, amelyhez hozzáférsz, majd kattints a **Küldés** gombra. Ellenőrizd, hogy az e-mail megérkezik-e a címzett postaládájába.

### 8. Visszapattanások feldolgozásának beállítása {#8-configure-bounce-processing}

A visszapattanások feldolgozása lehetővé teszi, hogy a Listmonk automatikusan kezelje azokat az e-maileket, amelyeket nem sikerült kézbesíteni (pl. érvénytelen címek miatt). A Forward Email webhookot biztosít, hogy értesítse a Listmonkot a visszapattanásokról.

#### Forward Email beállítása {#forward-email-setup}

1. Jelentkezz be a [Forward Email irányítópultodra](https://forwardemail.net/).
2. Navigálj a **Domainok** menüponthoz, válaszd ki a küldéshez használt domaint, majd lépj a **Beállítások** oldalára.
3. Görgess le a **Bounce Webhook URL** szekcióhoz.
4. Írd be a következő URL-t, helyettesítve a `<your_listmonk_domain>` részt azzal a tényleges domainnel vagy aldomainnel, ahol a Listmonk példányod elérhető:
   ```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
   *Példa*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. Görgess tovább a **Webhook Signature Payload Verification Key** szekcióhoz.
6. **Másold ki** a generált ellenőrző kulcsot. Erre szükséged lesz a Listmonkban.
7. Mentsd el a változtatásokat a Forward Email domain beállításaiban.

#### Listmonk beállítása {#listmonk-setup}

1. A Listmonk admin paneljében navigálj a **Beállítások -> Visszapattanások** menüponthoz.
2. Engedélyezd az **Visszapattanások feldolgozásának engedélyezése** opciót.
3. Engedélyezd a **Visszapattanás webhookok engedélyezése** opciót.
4. Görgess le a **Webhook szolgáltatók** szekcióhoz.
5. Engedélyezd a **Forward Email** opciót.
6. Illeszd be a Forward Email irányítópultjáról kimásolt **Webhook Signature Payload Verification Key**-t a **Forward Email kulcs** mezőbe.
7. Kattints az oldal alján a **Mentés** gombra.
8. A visszapattanások feldolgozása most be van állítva! Amikor a Forward Email visszapattanást észlel egy Listmonk által küldött e-mail esetén, webhookon keresztül értesíti a Listmonk példányodat, amely ennek megfelelően jelöli a feliratkozót.
9. A működés ellenőrzéséhez végezd el az alábbi lépéseket a [Tesztelés](#testing) szakaszban.

## Tesztelés {#testing}

Íme egy gyors áttekintés a Listmonk alapvető funkcióiról:

### Hírlevél lista létrehozása {#create-a-mailing-list}

* Menj a bal oldali menüben a **Listák** pontra.
* Kattints az **Új lista** gombra.
* Töltsd ki az adatokat (Név, Típus: Nyilvános/Privát, Leírás, Címkék), majd **Mentés**.

### Feliratkozók hozzáadása {#add-subscribers}

* Navigálj a **Feliratkozók** szekcióhoz.
* Feliratkozókat hozzáadhatsz:
  * **Kézzel**: Kattints az **Új feliratkozó** gombra.
  * **Importálás**: Kattints a **Feliratkozók importálása** gombra, és tölts fel egy CSV fájlt.
  * **API**: Használd a Listmonk API-t programozott hozzáadáshoz.
* A feliratkozókat hozzárendelheted egy vagy több listához létrehozás vagy importálás közben.
* **Legjobb gyakorlat**: Használj dupla megerősítést (double opt-in). Ezt a **Beállítások -> Opt-in & Feliratkozások** alatt konfigurálhatod.

### Kampány létrehozása és küldése {#create-and-send-a-campaign}

* Menj a **Kampányok** -> **Új kampány** menüpontra.
* Töltsd ki a kampány adatait (Név, Tárgy, Feladó e-mail, Küldendő lista(ka)t).
* Válaszd ki a tartalom típusát (Formázott szöveg/HTML, Egyszerű szöveg, Nyers HTML).
* Írd meg az e-mail tartalmát. Használhatsz sablon változókat, például `{{ .Subscriber.Email }}` vagy `{{ .Subscriber.FirstName }}`.
* **Mindig küldj először teszt e-mailt!** Használd a "Teszt küldése" opciót, hogy előnézetben megkapd az e-mailt a postaládádban.
* Ha elégedett vagy, kattints a **Kampány indítása** gombra az azonnali küldéshez, vagy ütemezd későbbre.

## Ellenőrzés {#verification}

* **SMTP kézbesítés**: Rendszeresen küldj teszt e-maileket a Listmonk SMTP beállítások oldalán keresztül, valamint teszt kampányokat, hogy megbizonyosodj az e-mailek helyes kézbesítéséről.
* **Visszapattanások kezelése**: Küldj teszt kampányt egy ismert érvénytelen e-mail címre (pl. `bounce-test@yourdomain.com`, ha nincs kéznél valódi, bár az eredmények változhatnak). Rövid idő múlva ellenőrizd a kampány statisztikáit a Listmonkban, hogy regisztrálta-e a visszapattanást.
* **E-mail fejléc ellenőrzése**: Használj olyan eszközöket, mint a [Mail-Tester](https://www.mail-tester.com/), vagy vizsgáld meg manuálisan az e-mail fejléceket, hogy ellenőrizd az SPF, DKIM és DMARC sikeres átmenetét, ami a Forward Email helyes beállítását jelzi.
* **Forward Email naplók**: Ha kézbesítési problémákra gyanakszol az SMTP szerver felől, ellenőrizd a Forward Email irányítópultjának naplóit.
## Fejlesztői megjegyzések {#developer-notes}

* **Sablonozás**: A Listmonk a Go sablonmotorját használja. Fedezd fel a dokumentációját a fejlett személyre szabásért: `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API**: A Listmonk átfogó REST API-t biztosít listák, feliratkozók, kampányok, sablonok és egyéb kezelése céljából. Az API dokumentáció linkjét a Listmonk példányod láblécében találod.
* **Egyedi mezők**: Egyedi feliratkozói mezőket definiálhatsz a **Beállítások -> Feliratkozói mezők** alatt további adatok tárolásához.
* **Webhookok**: A visszapattanások mellett a Listmonk más eseményekhez is tud webhookokat küldeni (pl. feliratkozások), lehetővé téve az integrációt más rendszerekkel.


## Összefoglalás {#conclusion}

A Listmonk önállóan üzemeltetett erejének integrálásával a Forward Email biztonságos, adatvédelmet tiszteletben tartó kézbesítésével egy robusztus és etikus e-mail marketing platformot hozol létre. Teljes tulajdonjogodat megőrzöd a közönséged adatai felett, miközben élvezheted a magas kézbesíthetőséget és az automatizált biztonsági funkciókat.

Ez a beállítás skálázható, költséghatékony és fejlesztőbarát alternatívát kínál a zárt forráskódú e-mail szolgáltatásokkal szemben, tökéletesen illeszkedve a nyílt forráskódú szoftverek és a felhasználói adatvédelem szellemiségéhez.

Jó küldözgetést! 🚀
