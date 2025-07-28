# Listmonk e-mail továbbítással a biztonságos hírlevélküldéshez {#listmonk-with-forward-email-for-secure-newsletter-delivery}

## Tartalomjegyzék {#table-of-contents}

* [Áttekintés](#overview)
* [Miért a Listmonk és az e-mail továbbítása](#why-listmonk-and-forward-email)
* [Előfeltételek](#prerequisites)
* [Telepítés](#installation)
  * [1. Frissítse a szerverét](#1-update-your-server)
  * [2. Függőségek telepítése](#2-install-dependencies)
  * [3. Töltse le a Listmonk konfigurációját](#3-download-listmonk-configuration)
  * [4. Tűzfal (UFW) konfigurálása](#4-configure-firewall-ufw)
  * [5. HTTPS hozzáférés konfigurálása](#5-configure-https-access)
  * [6. Indítsa el a Listmonkot](#6-start-listmonk)
  * [7. Konfigurálja az e-mail továbbításának SMTP-jét a Listmonkban](#7-configure-forward-email-smtp-in-listmonk)
  * [8. A visszapattanás-feldolgozás konfigurálása](#8-configure-bounce-processing)
* [Tesztelés](#testing)
  * [Hozzon létre egy levelezőlistát](#create-a-mailing-list)
  * [Előfizetők hozzáadása](#add-subscribers)
  * [Kampány létrehozása és elküldése](#create-and-send-a-campaign)
* [Ellenőrzés](#verification)
* [Fejlesztői megjegyzések](#developer-notes)
* [Következtetés](#conclusion)

## Áttekintés {#overview}

Ez az útmutató lépésről lépésre bemutatja a fejlesztőknek, hogyan állítsák be a [Listmonk](https://listmonk.app/)-t, egy hatékony, nyílt forráskódú hírlevél- és levelezőlista-kezelőt, hogy a [E-mail továbbítása](https://forwardemail.net/)-t használja SMTP-szolgáltatóként. Ez a kombináció lehetővé teszi kampányaik hatékony kezelését, miközben biztosítja a biztonságos, privát és megbízható e-mail-kézbesítést.

* **Listmonk**: Feliratkozók kezelését, listák szervezését, kampányok létrehozását és teljesítménykövetést kezel.
* **E-mail továbbítása**: Biztonságos SMTP-kiszolgálóként működik, beépített biztonsági funkciókkal, például SPF, DKIM, DMARC és TLS titkosítással kezeli az e-mailek tényleges küldését.

E kettő integrálásával teljes mértékben kézben tarthatod az adataid és az infrastruktúrád, miközben kihasználod a Forward Email robusztus kézbesítési rendszerét.

## Miért Listmonk és e-mail továbbítása {#why-listmonk-and-forward-email}

* **Nyílt forráskódú**: Mind a Listmonk, mind a Forward Email mögött álló alapelvek hangsúlyozzák az átláthatóságot és az ellenőrzést. A Listmonkot te magad üzemelteted, az adataid tulajdonosa vagy.
* **Adatvédelem-központú**: A Forward Email az adatvédelemre összpontosít, minimalizálja az adatmegőrzést és a biztonságos átvitelre összpontosít.
* **Költséghatékony**: A Listmonk ingyenes, a Forward Email pedig nagylelkű ingyenes szinteket és megfizethető fizetős csomagokat kínál, így ez egy költségvetésbarát megoldás.
* **Skálázhatóság**: A Listmonk nagy teljesítményű, a Forward Email infrastruktúrája pedig a megbízható, nagy léptékű kézbesítésre lett tervezve.
* **Fejlesztőbarát**: A Listmonk robusztus API-t kínál, a Forward Email pedig egyszerű SMTP-integrációt és webhookokat biztosít.

## Előfeltételek {#prerequisites}

Mielőtt elkezdené, győződjön meg arról, hogy a következőkkel rendelkezik:

* Egy virtuális magánszerver (VPS), amely egy újabb Linux disztribúciót futtat (Ubuntu 20.04+ ajánlott), legalább 1 CPU-val és 1 GB RAM-mal (2 GB ajánlott).
* Szüksége van szolgáltatóra? Nézze meg a [ajánlott VPS lista](https://github.com/forwardemail/awesome-mail-server-providers) oldalt.
* Egy Ön által felügyelt domain név (DNS hozzáférés szükséges).
* Egy aktív fiók [E-mail továbbítása](https://forwardemail.net/) címmel.
* Root vagy `sudo` hozzáférés a VPS-hez.
* Alapfokú jártasság a Linux parancssori műveletekben.

## Telepítés {#installation}

Ezek a lépések végigvezetnek a Listmonk Docker és Docker Compose használatával történő telepítésén a VPS-eden.

### 1. Frissítse szerverét {#1-update-your-server}

Győződjön meg róla, hogy a rendszer csomaglistája és a telepített csomagok naprakészek.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Függőségek telepítése {#2-install-dependencies}

Telepítse a Dockert, a Docker Compose-t és az UFW-t (Uncomplicated Firewall).

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Listmonk konfiguráció letöltése {#3-download-listmonk-configuration}

Hozz létre egy könyvtárat a Listmonk számára, és töltsd le a hivatalos `docker-compose.yml` fájlt.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

Ez a fájl definiálja a Listmonk alkalmazáskonténert és a hozzá szükséges PostgreSQL adatbáziskonténert.

### 4. Tűzfal (UFW) konfigurálása {#4-configure-firewall-ufw}

Engedélyezd a létfontosságú forgalmat (SSH, HTTP, HTTPS) a tűzfalon keresztül. Ha az SSH-d nem szabványos porton fut, ennek megfelelően módosítsd a beállítást.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

Amikor a rendszer kéri, erősítse meg a tűzfal engedélyezését.

### 5. HTTPS hozzáférés konfigurálása {#5-configure-https-access}

A Listmonk HTTPS-en keresztüli futtatása kulcsfontosságú a biztonság szempontjából. Két fő lehetőséged van:

#### A lehetőség: Cloudflare Proxy használata (ajánlott az egyszerűség kedvéért) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

Ha a domain DNS-ét a Cloudflare kezeli, kihasználhatja a proxy funkciójukat az egyszerű HTTPS-hez.

1. **Point DNS**: Hozz létre egy `A` rekordot a Cloudflare-ben a Listmonk aldomainedhez (pl. `listmonk.yourdomain.com`), amely a VPS IP-címedre mutat. Győződj meg róla, hogy a **Proxy állapota** **Proxied** (narancssárga felhő) értékre van állítva.

2. **Docker Compose módosítása**: Szerkeszd a letöltött `docker-compose.yml` fájlt:

```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
Ezáltal a Listmonk belsőleg elérhető a 80-as porton, amelyet a Cloudflare ezután HTTPS-sel tud proxyzni és biztonságossá tenni.

#### B. lehetőség: Fordított proxy használata (Nginx, Caddy stb.) {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

Alternatív megoldásként beállíthat egy fordított proxyt, például az Nginx-et vagy a Caddy-t a VPS-én, hogy kezelje a HTTPS megszakítását és a Listmonk felé irányuló proxy kéréseket (alapértelmezés szerint a 9000-es porton fut).

* Tartsa meg az alapértelmezett `ports: - "127.0.0.1:9000:9000"` kódot a `docker-compose.yml` kódban, hogy a Listmonk csak helyben legyen elérhető.
* Konfigurálja a kiválasztott fordított proxyt úgy, hogy a 80-as és 443-as portokon figyeljen, kezelje az SSL-tanúsítványok beszerzését (pl. Let's Encrypt segítségével), és továbbítsa a forgalmat a `http://127.0.0.1:9000` címre.
* A részletes fordított proxy beállítás meghaladja ennek az útmutatónak a kereteit, de számos oktatóanyag elérhető online.

### 6. Indítsd el a Listmonkot {#6-start-listmonk}

Navigálj vissza a `listmonk` könyvtáradba (ha még nem vagy ott), és indítsd el a konténereket leválasztott módban.

```bash
cd ~/listmonk # Or the directory where you saved docker-compose.yml
docker compose up -d
```

A Docker letölti a szükséges képeket, és elindítja a Listmonk alkalmazást és az adatbázis-tárolókat. Ez elsőre eltarthat egy-két percig.

✅ **Hozzáférés a Listmonkhoz**: Most már hozzáférhetsz a Listmonk webes felületéhez a konfigurált domainen keresztül (pl. `https://listmonk.yourdomain.com`).

### 7. Konfigurálja az e-mail továbbítási SMTP-t a Listmonkban {#7-configure-forward-email-smtp-in-listmonk}

Ezután konfigurálja a Listmonkot, hogy e-maileket küldjön a Forward Email fiókjával.

1. **SMTP engedélyezése az e-mail továbbításában**: Győződjön meg róla, hogy létrehozta az SMTP hitelesítő adatokat az e-mail továbbítási fiók irányítópultján. Kövesse a [E-mail továbbítási útmutató egyéni domainnel történő e-mail küldéséhez SMTP-n keresztül](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp) utasításokat, ha még nem tette meg.

2. **A Listmonk konfigurálása**: Jelentkezzen be a Listmonk adminisztrációs felületére.
* Navigáljon a **Beállítások -> SMTP** menüpontra.

* A Listmonk beépített támogatással rendelkezik az e-mail továbbításához. Válassza a **ForwardEmail** lehetőséget a szolgáltatók listájából, vagy adja meg manuálisan a következő adatokat:

| Beállítás | Érték |
| :---------------- | :------------------------------------------------------------------------------------------------------------------ |
| **Házigazda** | `smtp.forwardemail.net` |
| **Kikötő** | `465` |
| **Hitelesítési protokoll** | `LOGIN` |
| **Felhasználónév** | Továbbított e-mail címed **SMTP felhasználónév** |
| **Jelszó** | Továbbított e-mail címed **SMTP jelszó** |
| **TLS** | `SSL/TLS` |
| **E-mailből** | A kívánt `From` cím (pl. `newsletter@yourdomain.com`). Győződjön meg róla, hogy ez a domain konfigurálva van az E-mail továbbítása funkcióban. |

* **Fontos**: Biztonságos e-mail-kapcsolatokhoz mindig a `465` és a `SSL/TLS` portokat használja. Ne használja a STARTTLS-t (587-es port).

* Kattintson a **Mentés** gombra.

3. **Teszt e-mail küldése**: Használja a „Teszt e-mail küldése” gombot az SMTP beállítások oldalon. Adjon meg egy olyan címzett címét, amelyhez hozzáfér, majd kattintson a **Küldés** gombra. Ellenőrizze, hogy az e-mail megérkezett-e a címzett postaládájába.

### 8. A visszapattanás feldolgozásának konfigurálása {#8-configure-bounce-processing}

A visszapattanó levelek feldolgozása lehetővé teszi a Listmonk számára, hogy automatikusan kezelje a kézbesíthetetlen e-maileket (pl. érvénytelen címek miatt). A Forward Email egy webhookot biztosít, amely értesíti a Listmonkot a visszapattanásokról.

#### E-mail továbbítási beállítás {#forward-email-setup}

1. Jelentkezzen be a [E-mail továbbítási irányítópult](https://forwardemail.net/) fiókjába.
2. Navigáljon a **Domainek** menüpontra, válassza ki a küldéshez használt domaint, és lépjen a **Beállítások** oldalra.
3. Görgessen le a **Visszapattanó webhook URL** részhez.
4. Írja be a következő URL-t, a `<your_listmonk_domain>` helyére pedig írja be azt a domaint vagy aldomaint, ahol a Listmonk példány elérhető:
```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
*Példa*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. Görgessen tovább lejjebb a **Webhook aláírás-adatcsomag-ellenőrző kulcs** részhez.
6. **Másolja** a létrehozott ellenőrző kulcsot. Erre szüksége lesz a Listmonkban.
7. Mentse el a módosításokat az e-mail továbbítási domainbeállításaiban.

#### Listmonk beállítása {#listmonk-setup}

1. A Listmonk adminisztrációs felületén lépjen a **Beállítások -> Visszapattanások** menüpontra.

2. Engedélyezze a **Visszapattanás-feldolgozás engedélyezése** lehetőséget.

3. Engedélyezze a **Visszapattanás-webhookok engedélyezése** lehetőséget.

4. Görgessen le a **Webhook-szolgáltatók** részhez.

5. Engedélyezze a **E-mail továbbítása** lehetőséget.

6. Illessze be a **Webhook aláírás-adatcsomag-ellenőrző kulcsot**, amelyet az E-mail továbbítása irányítópultról másolt ki, az **E-mail továbbítási kulcs** mezőbe.

7. Kattintson a **Mentés** gombra az oldal alján.

8. A visszapattanás-feldolgozás most már konfigurálva van! Amikor az E-mail továbbítása funkció visszapattanást észlel a Listmonk által küldött e-mailben, értesíti a Listmonk példányt a webhookon keresztül, és a Listmonk ennek megfelelően megjelöli a feliratkozót.

9. Végezze el az alábbi lépéseket a [Tesztelés](#testing) részben, hogy megbizonyosodjon arról, hogy minden működik.

## A(z) {#testing} tesztelése

Íme egy gyors áttekintés a Listmonk alapvető függvényeiről:

### Levelezőlista létrehozása {#create-a-mailing-list}

* Lépj a **Listák** menüpontra az oldalsávon.
* Kattints az **Új lista** gombra.
* Add meg az adatokat (Név, Típus: Nyilvános/Privát, Leírás, Címkék) és mentsd el.

### Feliratkozók hozzáadása {#add-subscribers}

* Navigálj a **Feliratkozók** részhez.
* Feliratkozókat adhatsz hozzá:
* **Manuálisan**: Kattints az **Új feliratkozó** gombra.
* **Importálás**: Kattints a **Feliratkozók importálása** gombra egy CSV fájl feltöltéséhez.
* **API**: Használd a Listmonk API-t programozott hozzáadáshoz.
* Rendelj feliratkozókat egy vagy több listához a létrehozás vagy importálás során.
* **Bevált gyakorlat**: Használj dupla feliratkozási folyamatot. Konfiguráld ezt a **Beállítások -> Feliratkozás és feliratkozások** alatt.

### Kampány létrehozása és elküldése {#create-and-send-a-campaign}

* Lépjen a **Kampányok** -> **Új kampány** menüpontra.
* Töltse ki a kampány adatait (Név, Tárgy, Feladó e-mail címe, Címzett lista(k)).
* Válassza ki a tartalom típusát (Rich Text/HTML, Sima szöveg, Nyers HTML).
* Írja meg az e-mail tartalmát. Használhat sablonváltozókat, például a `{{ .Subscriber.Email }}` vagy a `{{ .Subscriber.FirstName }}`.
* **Mindig küldjön először egy teszt e-mailt!** A „Teszt küldése” opcióval megtekintheti az e-mailt a beérkező levelek mappájában.
* Ha elégedett, kattintson a **Kampány indítása** gombra az azonnali küldéshez, vagy ütemezze későbbre.

## Ellenőrzés {#verification}

* **SMTP kézbesítés**: Rendszeresen küldjön teszt e-maileket a Listmonk SMTP beállítási oldalán keresztül, és tesztelje a kampányokat, hogy biztosítsa az e-mailek megfelelő kézbesítését.
* **Pattanás kezelése**: Küldjön tesztkampányt egy ismert érvénytelen e-mail címre (pl. `bounce-test@yourdomain.com`, ha nincs kéznél valódi e-mail cím, bár az eredmények eltérőek lehetnek). Rövid idő elteltével ellenőrizze a kampány statisztikáit a Listmonkban, hogy regisztrálva van-e a pattanás.
* **E-mail fejlécek**: Használjon olyan eszközöket, mint a [Mail Tester](https://www.mail-tester.com/), vagy ellenőrizze manuálisan az e-mail fejléceket, hogy ellenőrizze az SPF, DKIM és DMARC áthaladását, jelezve a megfelelő beállításokat az e-mail továbbítása révén.
* **Továbbított e-mail naplók**: Ellenőrizze az e-mail továbbításának irányítópultjának naplóit, ha az SMTP-kiszolgálóról eredő kézbesítési problémákat gyanít.

## Fejlesztői megjegyzések {#developer-notes}

* **Sablonok**: A Listmonk a Go sablonmotorját használja. A speciális személyre szabáshoz tekintse meg a dokumentációját: `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API**: A Listmonk átfogó REST API-t biztosít listák, feliratkozók, kampányok, sablonok és egyebek kezeléséhez. Az API dokumentációs linkjét a Listmonk példány láblécében találja.
* **Egyéni mezők**: A **Beállítások -> Feliratkozó mezők** alatt definiálhat egyéni feliratkozói mezőket további adatok tárolásához.
* **Webhookok**: A visszapattanásokon kívül a Listmonk más eseményekhez (pl. feliratkozásokhoz) is küldhet webhookokat, lehetővé téve más rendszerekkel való integrációt.

## Következtetés {#conclusion}

A Listmonk saját tárhelyen futó erejének és a Forward Email biztonságos, adatvédelmet tiszteletben tartó kézbesítésének integrálásával egy robusztus és etikus e-mail marketing platformot hozhat létre. A közönségadatok feletti teljes tulajdonjogot fenntartja, miközben a magas kézbesítési hatékonyság és az automatizált biztonsági funkciók előnyeit élvezi.

Ez a beállítás egy skálázható, költséghatékony és fejlesztőbarát alternatívát kínál a zárt e-mail szolgáltatásokkal szemben, tökéletesen illeszkedve a nyílt forráskódú szoftverek és a felhasználói adatvédelem szellemiségéhez.

Jó küldést! 🚀