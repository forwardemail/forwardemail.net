# E-mail API {#email-api}

## Tartalomjegyzék {#table-of-contents}

* [Könyvtárak](#libraries)
* [Alap URI](#base-uri)
* [Hitelesítés](#authentication)
* [Hibák](#errors)
* [Lokalizáció](#localization)
* [Lapszámozás](#pagination)
* [Naplók](#logs)
  * [Naplók lekérése](#retrieve-logs)
* [Fiók](#account)
  * [Fiók létrehozása](#create-account)
  * [Fiók lekérése](#retrieve-account)
  * [Fiók frissítése](#update-account)
* [Alias-kapcsolatok (CardDAV)](#alias-contacts-carddav)
  * [Kapcsolatok listázása](#list-contacts)
  * [Kapcsolat létrehozása](#create-contact)
  * [Kapcsolatfelvétel](#retrieve-contact)
  * [Kapcsolat frissítése](#update-contact)
  * [Kapcsolat törlése](#delete-contact)
* [Alias naptárak (CalDAV)](#alias-calendars-caldav)
  * [Naptárak listázása](#list-calendars)
  * [Naptár létrehozása](#create-calendar)
  * [Naptár lekérése](#retrieve-calendar)
  * [Naptár frissítése](#update-calendar)
  * [Naptár törlése](#delete-calendar)
* [Alias üzenetek (IMAP/POP3)](#alias-messages-imappop3)
  * [Üzenetek listázása és keresése](#list-and-search-for-messages)
  * [Üzenet létrehozása](#create-message)
  * [Üzenet lekérése](#retrieve-message)
  * [Üzenet frissítése](#update-message)
  * [Üzenet törlése](#delete-message)
* [Alias mappák (IMAP/POP3)](#alias-folders-imappop3)
  * [Mappák listázása](#list-folders)
  * [Mappa létrehozása](#create-folder)
  * [Visszaállítási mappa](#retrieve-folder)
  * [Mappa frissítése](#update-folder)
  * [Mappa törlése](#delete-folder)
  * [Mappa másolása](#copy-folder)
* [Kimenő e-mailek](#outbound-emails)
  * [Kimenő SMTP e-mail korlát lekérése](#get-outbound-smtp-email-limit)
  * [Kimenő SMTP e-mailek listázása](#list-outbound-smtp-emails)
  * [Kimenő SMTP e-mail létrehozása](#create-outbound-smtp-email)
  * [Kimenő SMTP e-mailek lekérése](#retrieve-outbound-smtp-email)
  * [Kimenő SMTP e-mailek törlése](#delete-outbound-smtp-email)
* [Domainek](#domains)
  * [Domainek listázása](#list-domains)
  * [Domain létrehozása](#create-domain)
  * [Domain lekérése](#retrieve-domain)
  * [Domainrekordok ellenőrzése](#verify-domain-records)
  * [Domain SMTP-rekordok ellenőrzése](#verify-domain-smtp-records)
  * [Domain szintű, mindent lefedő jelszavak listája](#list-domain-wide-catch-all-passwords)
  * [Hozzon létre egy domain szintű, mindent lefedő jelszót](#create-domain-wide-catch-all-password)
  * [Távolítsa el a domain szintű, mindent lefedő jelszót](#remove-domain-wide-catch-all-password)
  * [Domain frissítése](#update-domain)
  * [Domain törlése](#delete-domain)
* [Meghívók](#invites)
  * [Domain meghívó elfogadása](#accept-domain-invite)
  * [Domain meghívó létrehozása](#create-domain-invite)
  * [Domain meghívó eltávolítása](#remove-domain-invite)
* [Tagok](#members)
  * [Tartományi tag frissítése](#update-domain-member)
  * [Domaintag eltávolítása](#remove-domain-member)
* [Álnevek](#aliases)
  * [Alias jelszó létrehozása](#generate-an-alias-password)
  * [Domain aliasok listázása](#list-domain-aliases)
  * [Új domain alias létrehozása](#create-new-domain-alias)
  * [Domainalias lekérése](#retrieve-domain-alias)
  * [Domainalias frissítése](#update-domain-alias)
  * [Domainalias törlése](#delete-domain-alias)
* [Titkosítás](#encrypt)
  * [TXT rekord titkosítása](#encrypt-txt-record)

## Könyvtárak {#libraries}

Jelenleg még nem adtunk ki API-csomagolókat, de a közeljövőben tervezzük, hogy megteszünk egyet. Küldjön egy e-mailt a <api@forwardemail.net> címre, ha értesítést szeretne kapni egy adott programozási nyelv API-csomagolójának kiadásáról. Addig is használhatja ezeket az ajánlott HTTP-kéréskönyvtárakat az alkalmazásában, vagy egyszerűen használhatja a [becsavar](https://stackoverflow.com/a/27442239/3586413) függvényt az alábbi példák szerint.

| Nyelv | Könyvtár |
| ---------- | ---------------------------------------------------------------------- |
| Rubin | [Faraday](https://github.com/lostisland/faraday) |
| Piton | [requests](https://github.com/psf/requests) |
| Jáva | [OkHttp](https://github.com/square/okhttp/) |
| PHP | [guzzle](https://github.com/guzzle/guzzle) |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (mi vagyunk a karbantartók) |
| Node.js | [superagent](https://github.com/ladjs/superagent) (mi vagyunk a karbantartók) |
| Megy | [net/http](https://golang.org/pkg/net/http/) |
| .NET | [RestSharp](https://github.com/restsharp/RestSharp) |

## Alap URI {#base-uri}

A jelenlegi HTTP alap URI elérési út: `BASE_URI`.

## Hitelesítés {#authentication}

Minden végponthoz a [API-kulcs](https://forwardemail.net/my-account/security) paramétert kell a kérés [Alapszintű engedélyezés](https://en.wikipedia.org/wiki/Basic_access_authentication) fejlécének „username” értékeként beállítani (a [Alias-kapcsolatok](#alias-contacts), [Alias naptárak](#alias-calendars) és [Alias postaládák](#alias-mailboxes) kivételével, amelyek [generált alias felhasználónév és jelszó](/faq#do-you-support-receiving-email-with-imap) paramétert használnak).

Ne aggódj – ha nem vagy biztos benne, hogy miről is van szó, alább láthatsz néhány példát.

## Hibák {#errors}

Ha bármilyen hiba történik, az API-kérés válaszának törzse részletes hibaüzenetet tartalmaz.

| Kód | Név |
| ---- | --------------------- |
| 200 | OK |
| 400 | Hibás kérés |
| 401 | Jogosulatlan |
| 403 | Tiltott |
| 404 | Nem található |
| 429 | Túl sok kérés |
| 500 | Belső szerverhiba |
| 501 | Nincs megvalósítva |
| 502 | Rossz átjáró |
| 503 | Szolgáltatás nem elérhető |
| 504 | Átjáró időtúllépése |

> \[!TIP]
> Ha 5xx állapotkódot kap (aminek nem szabadna előfordulnia), kérjük, vegye fel velünk a kapcsolatot a <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a> címen, és azonnal segítünk a probléma megoldásában.

## Lokalizáció {#localization}

Szolgáltatásunk több mint 25 különböző nyelvre van lefordítva. Minden API-válaszüzenet az API-kérést kezdeményező felhasználó által utoljára észlelt területi beállításra van lefordítva. Ezt felülbírálhatja egy egyéni `Accept-Language` fejléc megadásával. Nyugodtan próbálja ki a lap alján található nyelvi legördülő menü segítségével.

## Lapozás {#pagination}

> \[!NOTE]
> 2024. november 1-jétől a [Domainek listázása](#list-domains) és [Domain aliasok listázása](#list-domain-aliases) API-végpontjai alapértelmezés szerint `1000` maximális találatot állítanak be oldalanként. Ha korábban szeretné engedélyezni ezt a viselkedést, átadhatja a `?paginate=true` paramétert további lekérdezési karakterlánc paraméterként a végpont lekérdezésének URL-címéhez.

A lapozást minden olyan API-végpont támogatja, amely listázza az eredményeket.

Egyszerűen adja meg a `page` (és opcionálisan a `limit`) lekérdezési karakterlánc tulajdonságait.

A `page` tulajdonságnak a `1` tulajdonságnál nagyobb vagy azzal egyenlő számnak kell lennie. Ha megadja a `limit` tulajdonságot (ami szintén egy szám), akkor a minimális érték `10`, a maximális pedig `50` (kivéve, ha másképp van feltüntetve).

| Lekérdezési karakterlánc paraméterei | Kívánt | Típus | Leírás |
| --------------------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page` | Nem | Szám | A visszaadandó eredmények oldala. Ha nincs megadva, a `page` értéke `1` lesz. A számnak nagyobbnak vagy egyenlőnek kell lennie, mint `1`. |
| `limit` | Nem | Szám | Oldalanként visszaadandó találatok száma. Alapértelmezés szerint `10`, ha nincs megadva. A számnak nagyobbnak vagy egyenlőnek kell lennie, mint `1`, és kisebbnek vagy egyenlőnek kell lennie, mint `50`. |

Annak megállapításához, hogy elérhetők-e további találatok, ezeket a HTTP válaszfejléceket biztosítjuk (amelyeket programozottan elemezhet a lapozáshoz):

| HTTP válasz fejléc | Példa | Leírás |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `X-Page-Count` | `X-Page-Count: 3` | A teljes elérhető oldalszám. |
| `X-Page-Current` | `X-Page-Current: 1` | Az aktuálisan visszaadott eredmények oldala (pl. a `page` lekérdezési karakterlánc paraméter alapján). |
| `X-Page-Size` | `X-Page-Size: 10` | Az oldalon visszaadott eredmények teljes száma (pl. a `limit` lekérdezési karakterlánc paraméter és a ténylegesen visszaadott eredmények alapján). |
| `X-Item-Count` | `X-Item-Count: 30` | Az összes oldalon elérhető elemek teljes száma. |
| `Link` | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | Egy `Link` HTTP válaszfejlécet biztosítunk, amelyet a példában látható módon elemezhet. Ez a [similar to GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (pl. nem minden érték kerül megadásra, ha nem relevánsak vagy nem elérhetők, pl. a `"next"` nem kerül megadásra, ha nincs másik oldal). |

> Példa kérés:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```

## Naplók {#logs}

### Naplók lekérése {#retrieve-logs}

API-nk programozott módon lehetővé teszi fiókod naplóinak letöltését. Ha erre a végpontra küldesz egy kérést, a rendszer feldolgozza a fiókod összes naplóját, és a folyamat befejezése után mellékletként ([Gzip](https://en.wikipedia.org/wiki/Gzip) tömörített [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) táblázatfájl) elküldi neked e-mailben.

Ez lehetővé teszi háttérfeladatok létrehozását [Cron-feladat](https://en.wikipedia.org/wiki/Cron) segítségével, vagy a [Node.js munkaütemező szoftver Bree](https://github.com/breejs/bree) használatával naplókat fogadhat, amikor csak szeretné. Vegye figyelembe, hogy ez a végpont napi `10` kérésre korlátozódik.

A melléklet a `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz` kisbetűs alakja, és maga az e-mail tartalmazza a lekért naplók rövid összefoglalását. A naplókat bármikor letöltheti a [Fiókom → Naplók](/my-account/logs) oldalról.

> `GET /v1/logs/download`

| Lekérdezési karakterlánc paraméterei | Kívánt | Típus | Leírás |
| --------------------- | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | Nem | Karakterlánc (FQDN) | Naplók szűrése teljes domain ("FQDN") szerint. Ha ezt nem adja meg, akkor az összes domain összes naplója lekérésre kerül. |
| `q` | Nem | Húr | Naplók keresése e-mail cím, domain, aliasnév, IP-cím vagy dátum alapján (`M/Y`, `M/D/YY`, `M-D`, `M-D-YY` vagy `M.D.YY` formátum). |
| `bounce_category` | Nem | Húr | Naplók keresése egy adott visszapattanási kategória szerint (pl. `blocklist`). |
| `response_code` | Nem | Szám | Naplók keresése egy adott hibakód alapján (pl. `421` vagy `550`). |

> Példa kérés:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> Példa Cron feladatra (minden nap éjfélkor):

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

Vegye figyelembe, hogy olyan szolgáltatásokat is használhat, mint a [Crontab.guru](https://crontab.guru/), a cron feladatkifejezés szintaxisának érvényesítéséhez.

> Példa Cron feladatra (minden nap éjfélkor **és az előző napi naplókkal**):

MacOS rendszeren:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date -v-1d -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

Linux és Ubuntu esetén:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date --date "-1 days" -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

## Fiók {#account}

### Fiók létrehozása {#create-account}

> `POST /v1/account`

| Testparaméter | Kívánt | Típus | Leírás |
| -------------- | -------- | -------------- | ------------- |
| `email` | Igen | Karakterlánc (e-mail) | E-mail cím |
| `password` | Igen | Húr | Jelszó |

> Példa kérés:

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### Fiók lekérése {#retrieve-account}

> `GET /v1/account`

> Példa kérés:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### Fiók frissítése {#update-account}

> `PUT /v1/account`

| Testparaméter | Kívánt | Típus | Leírás |
| -------------- | -------- | -------------- | -------------------- |
| `email` | Nem | Karakterlánc (e-mail) | E-mail cím |
| `given_name` | Nem | Húr | Keresztnév |
| `family_name` | Nem | Húr | Vezetéknév |
| `avatar_url` | Nem | Karakterlánc (URL) | Link az avatar képhez |

> Példa kérés:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

## Alias-kapcsolatok (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> Más API végpontokkal ellentétben ezekhez alapvető jogosultságfejlécként a [Hitelesítés](#authentication) „felhasználónév” paramétere megegyezik az alias felhasználónevével, valamint a „jelszó” paramétere megegyezik az alias által generált jelszóval.

> \[!WARNING]
> Ez a végpont szakasz még fejlesztés alatt áll, és (remélhetőleg) 2024-ben jelenik meg. Addig is kérjük, használjon egy IMAP klienst, amelyet a weboldalunk navigációjában található „Alkalmazások” legördülő menüből választhat.

### Kapcsolatok listázása {#list-contacts}

> `GET /v1/contacts`

**Hamarosan**

### Kapcsolat létrehozása {#create-contact}

> `POST /v1/contacts`

**Hamarosan**

### Kapcsolat lekérése {#retrieve-contact}

> `GET /v1/contacts/:id`

**Hamarosan**

### Kapcsolattartó frissítése {#update-contact}

> `PUT /v1/contacts/:id`

**Hamarosan**

### Kapcsolat törlése {#delete-contact}

> `DELETE /v1/contacts/:id`

**Hamarosan**

## Alias naptárak (CalDAV) {#alias-calendars-caldav}

> \[!NOTE]
> Más API végpontokkal ellentétben ezekhez alapvető jogosultságfejlécként a [Hitelesítés](#authentication) „felhasználónév” paramétere megegyezik az alias felhasználónevével, valamint a „jelszó” paramétere megegyezik az alias által generált jelszóval.

> \[!WARNING]
> Ez a végpont szakasz még fejlesztés alatt áll, és (remélhetőleg) 2024-ben jelenik meg. Addig is kérjük, használjon egy IMAP klienst, amelyet a weboldalunk navigációjában található „Alkalmazások” legördülő menüből választhat.

### Naptárak listázása {#list-calendars}

> `GET /v1/calendars`

**Hamarosan**

### Naptár létrehozása {#create-calendar}

> `POST /v1/calendars`

**Hamarosan**

### Naptár lekérése {#retrieve-calendar}

> `GET /v1/calendars/:id`

**Hamarosan**

### Naptár frissítése {#update-calendar}

> `PUT /v1/calendars/:id`

**Hamarosan**

### Naptár törlése {#delete-calendar}

> `DELETE /v1/calendars/:id`

**Hamarosan**

## Alias üzenetek (IMAP/POP3) {#alias-messages-imappop3}

> \[!NOTE]
> Más API végpontokkal ellentétben ezekhez alapvető jogosultságfejlécként a [Hitelesítés](#authentication) „felhasználónév” paramétere megegyezik az alias felhasználónevével, valamint a „jelszó” paramétere megegyezik az alias által generált jelszóval.

> \[!WARNING]
> Ez a végpont szakasz még fejlesztés alatt áll, és (remélhetőleg) 2024-ben jelenik meg. Addig is kérjük, használjon egy IMAP klienst, amelyet a weboldalunk navigációjában található „Alkalmazások” legördülő menüből választhat.

Kérjük, győződjön meg róla, hogy követte a domain beállítására vonatkozó utasításokat.

Ezek az utasítások a GYIK részben találhatók: [Támogatja az IMAP-on keresztüli e-mail fogadást?](/faq#do-you-support-receiving-email-with-imap).

### Üzenetek listázása és keresése {#list-and-search-for-messages}

> `GET /v1/messages`

**Hamarosan**

### Üzenet létrehozása {#create-message}

> \[!NOTE]
> Ez **NEM** fog e-mailt küldeni – csak egyszerűen hozzáadja az üzenetet a postaláda mappájához (pl. ez hasonló az IMAP `APPEND` parancshoz). Ha e-mailt szeretne küldeni, akkor tekintse meg a [Kimenő SMTP e-mail létrehozása](#create-outbound-smtp-email) részt alább. Miután létrehozta a kimenő SMTP e-mailt, annak egy másolatát hozzáfűzheti az alias postaládájához tárolási célból.

> `POST /v1/messages`

**Hamarosan**

### Üzenet lekérése {#retrieve-message}

> `GET /v1/messages/:id`

**Hamarosan**

### Üzenet frissítése {#update-message}

> `PUT /v1/messages/:id`

**Hamarosan**

### Üzenet törlése {#delete-message}

> `DELETE /v1/messages:id`

**Hamarosan**

## Alias mappák (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> A mappa végpontjai, amelyeknek a mappa elérési útja <code>/v1/folders/:path</code>, felcserélhetők a mappa azonosítójával <code>:id</code>. Ez azt jelenti, hogy a mappára a <code>path</code> vagy a <code>id</code> értékével is hivatkozhat.

> \[!WARNING]
> Ez a végpont szakasz még fejlesztés alatt áll, és (remélhetőleg) 2024-ben jelenik meg. Addig is kérjük, használjon egy IMAP klienst, amelyet a weboldalunk navigációjában található „Alkalmazások” legördülő menüből választhat.

### Mappák listázása {#list-folders}

> `GET /v1/folders`

**Hamarosan**

### Mappa létrehozása {#create-folder}

> `POST /v1/folders`

**Hamarosan**

### Mappa lekérése {#retrieve-folder}

> `GET /v1/folders/:id`

**Hamarosan**

### Frissítési mappa {#update-folder}

> `PUT /v1/folders/:id`

**Hamarosan**

### Mappa törlése {#delete-folder}

> `DELETE /v1/folders/:id`

**Hamarosan**

### Mappa másolása {#copy-folder}

> `POST /v1/folders/:id/copy`

**Hamarosan**

## Kimenő e-mailek {#outbound-emails}

Kérjük, győződjön meg róla, hogy követte a domain beállítására vonatkozó utasításokat.

Ezek az utasítások a [Fiókom → Domainek → Beállítások → Kimenő SMTP konfiguráció](/my-account/domains) címen találhatók. Gondoskodnia kell a DKIM, a Return-Path és a DMARC beállításáról a kimenő SMTP-üzenetek domainnel történő küldéséhez.

### Kimenő SMTP e-mail korlát lekérése {#get-outbound-smtp-email-limit}

Ez egy egyszerű végpont, amely egy JSON objektumot ad vissza, amely a `count` és `limit` értékeket tartalmazza a napi SMTP kimenő üzenetek számára vonatkozóan fiókonként.

> `GET /v1/emails/limit`

> Példa kérés:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### Kimenő SMTP e-mailek listázása {#list-outbound-smtp-emails}

Vegye figyelembe, hogy ez a végpont nem ad vissza tulajdonságértékeket az e-mailek `message`, `headers` és `rejectedErrors` tulajdonságaihoz.

Ezen tulajdonságok és értékük visszaadásához kérjük, használja a [E-mail lekérése](#retrieve-email) végpontot egy e-mail azonosítóval.

> `GET /v1/emails`

| Lekérdezési karakterlánc paraméterei | Kívánt | Típus | Leírás |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | Nem | Karakterlánc (Reguláris kifejezés támogatott) | E-mailek keresése metaadatok alapján |
| `domain` | Nem | Karakterlánc (Reguláris kifejezés támogatott) | E-mailek keresése domain név alapján |
| `sort` | Nem | Húr | Rendezés egy adott mező szerint (egyetlen kötőjellel előzve: `-`, ha az adott mezőhöz képest fordított sorrendben szeretné rendezni). Ha nincs beállítva, az alapértelmezett érték `created_at`. |
| `page` | Nem | Szám | További információkért lásd: [Pagination](#pagination) |
| `limit` | Nem | Szám | További információkért lásd: [Pagination](#pagination) |

> Példa kérés:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### Kimenő SMTP e-mail létrehozása {#create-outbound-smtp-email}

Az e-mailek létrehozására szolgáló API-nkat a Nodemailer üzenetküldési beállításainak konfigurációja ihlette és azt használja ki. Kérjük, az összes alábbi törzsparaméter esetében a [Nodemailer üzenetkonfiguráció](https://nodemailer.com/message/) paramétert használja.

Vegye figyelembe, hogy a `envelope` és `dkim` kivételével (mivel ezeket automatikusan beállítjuk), az összes Nodemailer opciót támogatjuk. Biztonsági okokból a `disableFileAccess` és `disableUrlAccess` opciókat automatikusan `true` értékre állítjuk.

Vagy a `raw` egyetlen opcióját kell átadnod a nyers, teljes e-maileddel, beleértve a fejléceket is, **vagy** az alábbi, különálló törzsparaméter-opciókat kell megadnod.

Ez az API végpont automatikusan kódolja az emojikat, ha megtalálhatók a fejlécekben (pl. a `Subject: 🤓 Hello` tárgysor automatikusan `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello`-re konvertálódik). Célunk egy rendkívül fejlesztőbarát és becsapásbiztos e-mail API létrehozása volt.

> `POST /v1/emails`

| Testparaméter | Kívánt | Típus | Leírás |
| ---------------- | -------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from` | Nem | Karakterlánc (e-mail) | A feladó e-mail címe (léteznie kell a domain aliasaként). |
| `to` | Nem | Karakterlánc vagy tömb | Vesszővel elválasztott lista vagy címzettek tömbje a „Címzett” fejléchez. |
| `cc` | Nem | Karakterlánc vagy tömb | Vesszővel elválasztott lista vagy címzettek tömbje a „Másolatot kap” fejléchez. |
| `bcc` | Nem | Karakterlánc vagy tömb | Vesszővel elválasztott lista vagy címzettek tömbje a „Bcc” fejléchez. |
| `subject` | Nem | Húr | Az e-mail tárgya. |
| `text` | Nem | Karakterlánc vagy puffer | Az üzenet sima szöveges változata. |
| `html` | Nem | Karakterlánc vagy puffer | Az üzenet HTML-verziója. |
| `attachments` | Nem | Sor | Mellékletobjektumok tömbje (lásd: [Nodemailer's common fields](https://nodemailer.com/message/#common-fields)). |
| `sender` | Nem | Húr | A „Feladó” fejléchez tartozó e-mail cím (lásd: [Nodemailer's more advanced fields](https://nodemailer.com/message/#more-advanced-fields)). |
| `replyTo` | Nem | Húr | A „Válasz” fejléchez tartozó e-mail cím. |
| `inReplyTo` | Nem | Húr | Az üzenet azonosítója, amelyre a válaszüzenet vonatkozik. |
| `references` | Nem | Karakterlánc vagy tömb | Szóközökkel elválasztott lista vagy üzenetazonosítók tömbje. |
| `attachDataUrls` | Nem | Logikai | Ha a `true` paramétert használja, akkor a HTML-tartalomban található `data:` képeket beágyazott mellékletekké alakítja. |
| `watchHtml` | Nem | Húr | Az üzenet Apple Watch-specifikus HTML-verziója ([according to the Nodemailer docs](https://nodemailer.com/message/#content-options]), a legújabb órákon ennek a beállítása nem szükséges). |
| `amp` | Nem | Húr | Az üzenet AMP4EMAIL-specifikus HTML-verziója (lásd: [Nodemailer's example](https://nodemailer.com/message/#amp-example)). |
| `icalEvent` | Nem | Objektum | Egy iCalendar esemény, amely alternatív üzenettartalomként használható (lásd: [Nodemailer's calendar events](https://nodemailer.com/message/calendar-events/)). |
| `alternatives` | Nem | Sor | Alternatív üzenettartalom tömbje (lásd: [Nodemailer's alternative content](https://nodemailer.com/message/alternatives/)). |
| `encoding` | Nem | Húr | A szöveg és a HTML karakterláncok kódolása (alapértelmezett: `"utf-8"`, de támogatja a `"hex"` és `"base64"` kódolási értékeket is). |
| `raw` | Nem | Karakterlánc vagy puffer | Egy egyénileg generált RFC822 formátumú üzenet használata (a Nodemailer által generált helyett – lásd [Nodemailer's custom source](https://nodemailer.com/message/custom-source/)). |
| `textEncoding` | Nem | Húr | Szöveges értékekhez kötelezően használandó kódolás (`"quoted-printable"` vagy `"base64"`). Az alapértelmezett érték a legközelebbi észlelt érték (ASCII esetén `"quoted-printable"`). |
| `priority` | Nem | Húr | Az e-mail prioritási szintje (lehet `"high"`, `"normal"` (alapértelmezett) vagy `"low"`). Vegye figyelembe, hogy a `"normal"` érték nem állít be prioritási fejlécet (ez az alapértelmezett viselkedés). Ha a `"high"` vagy a `"low"` érték van beállítva, akkor a `X-Priority`, `X-MSMail-Priority` és `Importance` fejlécek [will be set accordingly](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers` | Nem | Objektum vagy tömb | Egy objektum vagy további fejlécmezőkből álló tömb, amelyet be kell állítani (lásd: [Nodemailer's custom headers](https://nodemailer.com/message/custom-headers/)). |
| `messageId` | Nem | Húr | Egy opcionális Message-ID érték a „Message-ID” fejléchez (ha nincs beállítva, automatikusan létrejön egy alapértelmezett érték – vegye figyelembe, hogy az értéknek [adhere to the RFC2822 specification](https://stackoverflow.com/a/4031705)-nak kell lennie). |
| `date` | Nem | Karakterlánc vagy dátum | Egy opcionális dátumérték, amelyet akkor használ a rendszer, ha a dátum fejléc hiányzik az elemzés után, ellenkező esetben az aktuális UTC karakterláncot használja a rendszer, ha nincs beállítva. A dátum fejléc nem lehet 30 napnál régebbi az aktuális időhöz képest. |
| `list` | Nem | Objektum | Egy opcionális `List-*` fejléc objektum (lásd [Nodemailer's list headers](https://nodemailer.com/message/list-headers/)). |

> Példa kérés:

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Példa kérés:

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### Kimenő SMTP e-mail lekérése {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> Példa kérés:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### Kimenő SMTP e-mail törlése {#delete-outbound-smtp-email}

Az e-mail törlése akkor és csak akkor állítja be az állapotot `"rejected"` értékre (és ezt követően nem dolgozza fel a sorban), ha az aktuális állapot a `"pending"`, `"queued"` vagy `"deferred"` egyike. Az e-maileket a létrehozásuk és/vagy elküldésük után 30 nappal automatikusan törölhetjük – ezért érdemes a kimenő SMTP e-mailekről másolatot tartani a kliensben, az adatbázisban vagy az alkalmazásban. Szükség esetén hivatkozhat az adatbázisban található e-mail azonosító értékünkre – ezt az értéket mind a [E-mail létrehozása](#create-email), mind a [E-mail lekérése](#retrieve-email) végpont visszaadja.

> `DELETE /v1/emails/:id`

> Példa kérés:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

## Domainek {#domains}

> \[!TIP]
> A <code>/v1/domains/:domain_name</code> domainnévvel rendelkező domainvégpontok felcserélhetők a <code>:domain_id</code> domainazonosítóval. Ez azt jelenti, hogy a domainre a <code>name</code> vagy a <code>id</code> értékével is hivatkozhat.

### Domainek listázása {#list-domains}

> \[!NOTE]
> 2024. november 1-jétől a [Domainek listázása](#list-domains) és [Domain aliasok listázása](#list-domain-aliases) API-végpontjai alapértelmezés szerint `1000` maximális találatot fognak használni oldalanként. Ha korábban szeretné engedélyezni ezt a viselkedést, átadhatja a `?paginate=true` paramétert további lekérdezési karakterlánc paraméterként a végpont lekérdezésének URL-címéhez. További információkért lásd a [Lapszámozás](#pagination) részt.

> `GET /v1/domains`

| Lekérdezési karakterlánc paraméterei | Kívánt | Típus | Leírás |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | Nem | Karakterlánc (Reguláris kifejezés támogatott) | Domainek keresése név alapján |
| `name` | Nem | Karakterlánc (Reguláris kifejezés támogatott) | Domainek keresése név alapján |
| `sort` | Nem | Húr | Rendezés egy adott mező szerint (egyetlen kötőjellel előzve: `-`, ha az adott mezőhöz képest fordított sorrendben szeretné rendezni). Ha nincs beállítva, az alapértelmezett érték `created_at`. |
| `page` | Nem | Szám | További információkért lásd: [Pagination](#pagination) |
| `limit` | Nem | Szám | További információkért lásd: [Pagination](#pagination) |

> Példa kérés:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### Tartomány létrehozása {#create-domain}

> `POST /v1/domains`

| Testparaméter | Kívánt | Típus | Leírás |
| ------------------------------ | -------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | Igen | Karakterlánc (FQDN vagy IP) | Teljesen minősített domainnév ("FQDN") vagy IP-cím |
| `team_domain` | Nem | Karakterlánc (tartományazonosító vagy tartománynév; FQDN) | Automatikusan rendelje hozzá ezt a domaint ugyanahhoz a csapathoz egy másik domainből. Ez azt jelenti, hogy a domain összes tagja csapattagként lesz hozzárendelve, és a `plan` is automatikusan `team`-ra lesz állítva. Szükség esetén beállíthatja ezt `"none"`-ra, hogy ezt kifejezetten letiltsa, de ez nem kötelező. |
| `plan` | Nem | Karakterlánc (felsorolható) | Előfizetés típusa (`"free"`, `"enhanced_protection"` vagy `"team"` kell lennie, alapértelmezett érték `"free"` vagy a felhasználó aktuális fizetős előfizetése, ha van ilyen) |
| `catchall` | Nem | Karakterlánc (elválasztott e-mail címek) vagy logikai érték | Hozz létre egy alapértelmezett gyűjtőaliast, amelynek alapértelmezett értéke `true` (ha `true`, akkor az API-felhasználó e-mail címét használja címzettként, és ha `false`, akkor nem jön létre gyűjtőalias). Ha karakterláncot adsz meg, akkor az egy elválasztott lista az e-mail címekről, amelyeket címzettként kell használni (sortöréssel, szóközzel és/vagy vesszővel elválasztva). |
| `has_adult_content_protection` | Nem | Logikai | Engedélyezze-e a Spam Scanner felnőtt tartalomvédelmét ezen a domainen |
| `has_phishing_protection` | Nem | Logikai | Engedélyezze-e a Spam Scanner adathalászat elleni védelmét ezen a domainen |
| `has_executable_protection` | Nem | Logikai | Engedélyezze-e a Spam Scanner futtatható fájlvédelmét ezen a domainen |
| `has_virus_protection` | Nem | Logikai | Engedélyezze-e a Spam Scanner vírusvédelmet ezen a domainen |
| `has_recipient_verification` | Nem | Logikai | Globális domain alapértelmezett beállítása, amely meghatározza, hogy az alias címzetteknek rá kell-e kattintaniuk egy e-mail ellenőrző linkre az e-mailek fogadásához. |
| `ignore_mx_check` | Nem | Logikai | Azt határozza meg, hogy figyelmen kívül hagyja-e az MX rekordok ellenőrzését a domainen az ellenőrzés során. Ez főként azoknak a felhasználóknak szól, akik speciális MX exchange konfigurációs szabályokkal rendelkeznek, és meg kell őrizniük a meglévő MX exchange-jüket, valamint át kell-e irányítaniuk azokat a miénkbe. |
| `retention_days` | Nem | Szám | `0` és `30` közötti egész szám, amely a kimenő SMTP e-mailek tárolásának megőrzési napjainak számát jelenti a sikeres kézbesítés vagy a véglegesen hibássá válás után. Az alapértelmezett érték `0`, ami azt jelenti, hogy a kimenő SMTP e-mailek azonnal törlődnek és szerkesztve lesznek a biztonságod érdekében. |
| `bounce_webhook` | Nem | Karakterlánc (URL) vagy logikai érték (hamis) | Az Ön által választott `http://` vagy `https://` webhook URL, ahová a visszapattanó webhookokat küldeni lehet. Egy `POST` kérést küldünk erre az URL-re, amely tartalmazza a kimenő SMTP-hibákra vonatkozó információkat (pl. lágy vagy kemény hibák – így kezelheti feliratkozóit és programozottan kezelheti kimenő e-mailjeit). |
| `max_quota_per_alias` | Nem | Húr | Az aliasok maximális tárhelykvótája ezen a domainnéven. Adjon meg egy értéket, például „1 GB”, amelyet a [bytes](https://github.com/visionmedia/bytes.js) fog elemezni. |

> Példa kérés:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### Domain lekérése {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> Példa kérés:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Domainrekordok ellenőrzése {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Példa kérés:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### Domain SMTP-rekordok ellenőrzése {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> Példa kérés:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### Domain szintű, mindent lefedő jelszavak listája {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> Példa kérés:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Hozzon létre egy domain szintű, mindent lefedő jelszót {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Testparaméter | Kívánt | Típus | Leírás |
| -------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | Nem | Húr | Az Ön egyéni új jelszava, amelyet a domain egészére kiterjedő gyűjtőjelszóként kell használni. Ne feledje, hogy ezt üresen hagyhatja, vagy teljesen kihagyhatja az API-kérelem törzséből, ha véletlenszerűen generált és erős jelszót szeretne kapni. |
| `description` | Nem | Húr | A leírás csak szervezési célokat szolgál. |

> Példa kérés:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Domain szintű, mindent lefedő jelszó eltávolítása {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> Példa kérés:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### Tartomány frissítése {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| Testparaméter | Kívánt | Típus | Leírás |
| ------------------------------ | -------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port` | Nem | Karakterlánc vagy szám | Egyéni port az SMTP továbbításhoz konfiguráláshoz (alapértelmezett: `"25"`) |
| `has_adult_content_protection` | Nem | Logikai | Engedélyezze-e a Spam Scanner felnőtt tartalomvédelmét ezen a domainen |
| `has_phishing_protection` | Nem | Logikai | Engedélyezze-e a Spam Scanner adathalászat elleni védelmét ezen a domainen |
| `has_executable_protection` | Nem | Logikai | Engedélyezze-e a Spam Scanner futtatható fájlvédelmét ezen a domainen |
| `has_virus_protection` | Nem | Logikai | Engedélyezze-e a Spam Scanner vírusvédelmet ezen a domainen |
| `has_recipient_verification` | Nem | Logikai | Globális domain alapértelmezett beállítása, amely meghatározza, hogy az alias címzetteknek rá kell-e kattintaniuk egy e-mail ellenőrző linkre az e-mailek fogadásához. |
| `ignore_mx_check` | Nem | Logikai | Azt határozza meg, hogy figyelmen kívül hagyja-e az MX rekordok ellenőrzését a domainen az ellenőrzés során. Ez főként azoknak a felhasználóknak szól, akik speciális MX exchange konfigurációs szabályokkal rendelkeznek, és meg kell őrizniük a meglévő MX exchange-jüket, valamint át kell-e irányítaniuk azokat a miénkbe. |
| `retention_days` | Nem | Szám | `0` és `30` közötti egész szám, amely a kimenő SMTP e-mailek tárolásának megőrzési napjainak számát jelenti a sikeres kézbesítés vagy a véglegesen hibássá válás után. Az alapértelmezett érték `0`, ami azt jelenti, hogy a kimenő SMTP e-mailek azonnal törlődnek és szerkesztve lesznek a biztonságod érdekében. |
| `bounce_webhook` | Nem | Karakterlánc (URL) vagy logikai érték (hamis) | Az Ön által választott `http://` vagy `https://` webhook URL, ahová a visszapattanó webhookokat küldeni lehet. Egy `POST` kérést küldünk erre az URL-re, amely tartalmazza a kimenő SMTP-hibákra vonatkozó információkat (pl. lágy vagy kemény hibák – így kezelheti feliratkozóit és programozottan kezelheti kimenő e-mailjeit). |
| `max_quota_per_alias` | Nem | Húr | Az aliasok maximális tárhelykvótája ezen a domainnéven. Adjon meg egy értéket, például „1 GB”, amelyet a [bytes](https://github.com/visionmedia/bytes.js) fog elemezni. |

> Példa kérés:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Domain törlése {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> Példa kérés:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```

## Meghívók {#invites}

### Domain meghívó elfogadása {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> Példa kérés:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### Domain meghívó létrehozása {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| Testparaméter | Kívánt | Típus | Leírás |
| -------------- | -------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `email` | Igen | Karakterlánc (e-mail) | A domain tagjainak listájára meghívandó e-mail cím |
| `group` | Igen | Karakterlánc (felsorolható) | A felhasználó domain tagságához hozzáadandó csoport (lehet `"admin"` vagy `"user"`) |

> Példa kérés:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> Ha a meghívott felhasználó már elfogadott tagja bármely más domainnek, amelynek a meghívót küldő adminisztrátor is tagja, akkor a rendszer automatikusan elfogadja a meghívást, és nem küld e-mailt.

### Domain meghívó eltávolítása {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| Testparaméter | Kívánt | Típus | Leírás |
| -------------- | -------- | -------------- | ------------------------------------------------ |
| `email` | Igen | Karakterlánc (e-mail) | A domain tagok listájáról eltávolítandó e-mail cím |

> Példa kérés:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

## Tagok {#members}

### Tartománytag frissítése {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Testparaméter | Kívánt | Típus | Leírás |
| -------------- | -------- | ------------------- | -------------------------------------------------------------------------------------------- |
| `group` | Igen | Karakterlánc (felsorolható) | A felhasználó domaintagságának frissítéséhez használandó csoport (lehet `"admin"` vagy `"user"`) |

> Példa kérés:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### Tartománytag eltávolítása {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> Példa kérés:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```

## Aliasok {#aliases}

### Alias jelszó létrehozása {#generate-an-alias-password}

Vegye figyelembe, hogy ha nem küld e-mailben utasításokat, akkor a felhasználónév és a jelszó a sikeres kérés JSON-választörzsében lesz `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }` formátumban.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Testparaméter | Kívánt | Típus | Leírás |
| ---------------------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | Nem | Húr | Az aliashoz használandó új egyéni jelszó. Ne feledd, hogy ezt üresen hagyhatod, vagy teljesen kihagyhatod az API-kérelem törzséből, ha véletlenszerűen generált és erős jelszót szeretnél. |
| `password` | Nem | Húr | Az alias meglévő jelszava a jelszó módosításához a meglévő IMAP postaláda-tárhely törlése nélkül (lásd a `is_override` opciót alább, ha már nem rendelkezik a meglévő jelszóval). |
| `is_override` | Nem | Logikai | **ÓVATOSAN HASZNÁLJA**: Ez teljesen felülírja a meglévő alias jelszavát és adatbázisát, véglegesen törli a meglévő IMAP-tárhelyet, és teljesen visszaállítja az alias SQLite e-mail adatbázisát. Kérjük, készítsen biztonsági másolatot, ha van egy meglévő postaládája ehhez az aliashoz csatolva. |
| `emailed_instructions` | Nem | Húr | Az alias jelszavának és beállítási utasításainak elküldéséhez szükséges e-mail cím. |

> Példa kérés:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### Domainaliasok listázása {#list-domain-aliases}

> \[!NOTE]
> 2024. november 1-jétől a [Domainek listázása](#list-domains) és [Domain aliasok listázása](#list-domain-aliases) API-végpontjai alapértelmezés szerint `1000` maximális találatot fognak használni oldalanként. Ha korábban szeretné engedélyezni ezt a viselkedést, átadhatja a `?paginate=true` paramétert további lekérdezési karakterlánc paraméterként a végpont lekérdezésének URL-címéhez. További információkért lásd a [Lapszámozás](#pagination) részt.

> `GET /v1/domains/DOMAIN_NAME/aliases`

| Lekérdezési karakterlánc paraméterei | Kívánt | Típus | Leírás |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | Nem | Karakterlánc (Reguláris kifejezés támogatott) | Aliasok keresése egy domainben név, címke vagy címzett alapján |
| `name` | Nem | Karakterlánc (Reguláris kifejezés támogatott) | Aliasok keresése egy domainben név alapján |
| `recipient` | Nem | Karakterlánc (Reguláris kifejezés támogatott) | Aliasok keresése egy domainben címzett szerint |
| `sort` | Nem | Húr | Rendezés egy adott mező szerint (egyetlen kötőjellel előzve: `-`, ha az adott mezőhöz képest fordított sorrendben szeretné rendezni). Ha nincs beállítva, az alapértelmezett érték `created_at`. |
| `page` | Nem | Szám | További információkért lásd: [Pagination](#pagination) |
| `limit` | Nem | Szám | További információkért lásd: [Pagination](#pagination) |

> Példa kérés:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### Új domainalias létrehozása {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| Testparaméter | Kívánt | Típus | Leírás |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | Nem | Húr | Alias név (ha nincs megadva, vagy üres, akkor egy véletlenszerű alias generálódik) |
| `recipients` | Nem | Karakterlánc vagy tömb | Címzettek listája (sortöréssel/szóközzel/vesszővel elválasztva) Érvényes e-mail-címek, teljesen minősített domainnevek ("FQDN"), IP-címek és/vagy webhook URL-ek karakterlánca vagy tömbje – ha nincs megadva, vagy üres tömb, akkor az API-kérést küldő felhasználó e-mail-címe lesz beállítva címzettként) |
| `description` | Nem | Húr | Álnév leírása |
| `labels` | Nem | Karakterlánc vagy tömb | Címkék listája (sortöréssel/szóközzel/vesszővel elválasztott karakterláncként vagy tömbként kell megadni) |
| `has_recipient_verification` | Nem | Logikai | A címzetteknek e-mail ellenőrző linkre kell kattintaniuk az e-mailek fogadásához (alapértelmezés szerint a domain beállításai érvényesek, ha a kérés törzsében nincs explicit módon beállítva). |
| `is_enabled` | Nem | Logikai | Engedélyezi vagy letiltja ezt az aliast (ha le van tiltva, az e-mailek sehová sem kerülnek átirányításra, hanem sikeres állapotkódokat adnak vissza). Ha egy értéket átadunk, akkor azt logikai értékké alakítja a [boolean](https://github.com/thenativeweb/boolean#quick-start) használatával) |
| `error_code_if_disabled` | Nem | Szám (vagy `250`, `421`, vagy `550`) | Az erre az aliasra bejövő e-mailek elutasításra kerülnek, ha a `is_enabled` cella azonosítója `false`, és a `250` (csendes kézbesítés sehova, pl. blackhole vagy `/dev/null`), `421` (puha elutasítás; és újrapróbálkozás legfeljebb ~5 napig) vagy `550` állandó hiba és elutasítás következik be. Alapértelmezés szerint a `250` cella a cella. |
| `has_imap` | Nem | Logikai | Engedélyezze vagy tiltsa le az IMAP-tárolást ehhez az aliashoz (ha le van tiltva, akkor a bejövő e-mailek nem kerülnek tárolásra a [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service) cellában. Ha értéket adunk meg, akkor azt a [boolean](https://github.com/thenativeweb/boolean#quick-start) használatával logikai értékké alakítja) |
| `has_pgp` | Nem | Logikai | Engedélyezze vagy tiltsa le a [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) elemet a [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) elemhez a' `public_key` alias használatával. |
| `public_key` | Nem | Húr | OpenPGP nyilvános kulcs ASCII Armor formátumban ([click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); pl. GPG kulcs a `support@forwardemail.net`-hoz). Ez csak akkor érvényes, ha a `has_pgp` értéke `true`. [Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota` | Nem | Húr | Maximális tárhelykvóta ehhez az aliashoz. Hagyja üresen a domain aktuális maximális kvótájának visszaállításához, vagy adjon meg egy értéket, például „1 GB”, amelyet a [bytes](https://github.com/visionmedia/bytes.js) elemezni fog. Ezt az értéket csak a domain adminisztrátorai módosíthatják. |
| `vacation_responder_is_enabled` | Nem | Logikai | Az automatikus vakációs válasz engedélyezése vagy letiltása. |
| `vacation_responder_start_date` | Nem | Húr | Az automatikus válaszadó kezdési dátuma (ha engedélyezve van, és itt nincs beállítva kezdési dátum, akkor feltételezi, hogy már elindult). Támogatott dátumformátumok, például `MM/DD/YYYY`, `YYYY-MM-DD` és más dátumformátumok intelligens elemzéssel, `dayjs` használatával. |
| `vacation_responder_end_date` | Nem | Húr | Az automatikus válaszadó befejező dátuma (ha engedélyezve van, és itt nincs beállítva befejező dátum, akkor azt feltételezi, hogy soha nem ér véget, és örökre válaszol). Támogatjuk a `MM/DD/YYYY`, `YYYY-MM-DD` és más dátumformátumokat intelligens elemzéssel, `dayjs` használatával. |
| `vacation_responder_subject` | Nem | Húr | A tárgy szöveges formában jelenik meg az automatikus válaszban, pl. „Távol vagyok”. A `striptags` kódot használjuk az összes HTML eltávolítására. |
| `vacation_responder_message` | Nem | Húr | Egyszerű szöveges üzenet az automatikus válaszadónak, pl. „Februárig nem leszek az irodában.”. A `striptags` kódot használjuk az összes HTML eltávolítására. |

> Példa kérés:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### Domainalias lekérése {#retrieve-domain-alias}

Egy domain aliast a `id` vagy a `name` értéke alapján kérhet le.

> `GET /v1/domains/:domain_name/aliases/:alias_id`

> Példa kérés:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

> `GET /v1/domains/:domain_name/aliases/:alias_name`

> Példa kérés:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_name \
  -u API_TOKEN:
```

### Domainalias frissítése {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Testparaméter | Kívánt | Típus | Leírás |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | Nem | Húr | Álnév |
| `recipients` | Nem | Karakterlánc vagy tömb | Címzettek listája (sortöréssel/szóközzel/vesszővel elválasztva) Érvényes e-mail címek, teljesen minősített domainnevek ("FQDN"), IP-címek és/vagy webhook URL-ek karakterlánca vagy tömbje) |
| `description` | Nem | Húr | Álnév leírása |
| `labels` | Nem | Karakterlánc vagy tömb | Címkék listája (sortöréssel/szóközzel/vesszővel elválasztott karakterláncként vagy tömbként kell megadni) |
| `has_recipient_verification` | Nem | Logikai | A címzetteknek e-mail ellenőrző linkre kell kattintaniuk az e-mailek fogadásához (alapértelmezés szerint a domain beállításai érvényesek, ha a kérés törzsében nincs explicit módon beállítva). |
| `is_enabled` | Nem | Logikai | Engedélyezi vagy letiltja ezt az aliast (ha le van tiltva, az e-mailek sehová sem kerülnek átirányításra, hanem sikeres állapotkódokat adnak vissza). Ha egy értéket átadunk, akkor azt logikai értékké alakítja a [boolean](https://github.com/thenativeweb/boolean#quick-start) használatával) |
| `error_code_if_disabled` | Nem | Szám (vagy `250`, `421`, vagy `550`) | Az erre az aliasra bejövő e-mailek elutasításra kerülnek, ha a `is_enabled` cella azonosítója `false`, és a `250` (csendes kézbesítés sehova, pl. blackhole vagy `/dev/null`), `421` (puha elutasítás; és újrapróbálkozás legfeljebb ~5 napig) vagy `550` állandó hiba és elutasítás következik be. Alapértelmezés szerint a `250` cella a cella. |
| `has_imap` | Nem | Logikai | Engedélyezze vagy tiltsa le az IMAP-tárolást ehhez az aliashoz (ha le van tiltva, akkor a bejövő e-mailek nem kerülnek tárolásra a [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service) cellában. Ha értéket adunk meg, akkor azt a [boolean](https://github.com/thenativeweb/boolean#quick-start) használatával logikai értékké alakítja) |
| `has_pgp` | Nem | Logikai | Engedélyezze vagy tiltsa le a [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) elemet a [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) elemhez a' `public_key` alias használatával. |
| `public_key` | Nem | Húr | OpenPGP nyilvános kulcs ASCII Armor formátumban ([click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); pl. GPG kulcs a `support@forwardemail.net`-hoz). Ez csak akkor érvényes, ha a `has_pgp` értéke `true`. [Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota` | Nem | Húr | Maximális tárhelykvóta ehhez az aliashoz. Hagyja üresen a domain aktuális maximális kvótájának visszaállításához, vagy adjon meg egy értéket, például „1 GB”, amelyet a [bytes](https://github.com/visionmedia/bytes.js) elemezni fog. Ezt az értéket csak a domain adminisztrátorai módosíthatják. |
| `vacation_responder_is_enabled` | Nem | Logikai | Az automatikus vakációs válasz engedélyezése vagy letiltása. |
| `vacation_responder_start_date` | Nem | Húr | Az automatikus válaszadó kezdési dátuma (ha engedélyezve van, és itt nincs beállítva kezdési dátum, akkor feltételezi, hogy már elindult). Támogatott dátumformátumok, például `MM/DD/YYYY`, `YYYY-MM-DD` és más dátumformátumok intelligens elemzéssel, `dayjs` használatával. |
| `vacation_responder_end_date` | Nem | Húr | Az automatikus válaszadó befejező dátuma (ha engedélyezve van, és itt nincs beállítva befejező dátum, akkor azt feltételezi, hogy soha nem ér véget, és örökre válaszol). Támogatjuk a `MM/DD/YYYY`, `YYYY-MM-DD` és más dátumformátumokat intelligens elemzéssel, `dayjs` használatával. |
| `vacation_responder_subject` | Nem | Húr | A tárgy szöveges formában jelenik meg az automatikus válaszban, pl. „Távol vagyok”. A `striptags` kódot használjuk az összes HTML eltávolítására. |
| `vacation_responder_message` | Nem | Húr | Egyszerű szöveges üzenet az automatikus válaszadónak, pl. „Februárig nem leszek az irodában.”. A `striptags` kódot használjuk az összes HTML eltávolítására. |

> Példa kérés:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### Domainalias törlése {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> Példa kérés:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

## Titkosítás {#encrypt}

Lehetővé tesszük a rekordok ingyenes titkosítását még az ingyenes csomagban is. Az adatvédelemnek nem szabadna funkciónak lennie, hanem a termék minden aspektusába beépítettnek. Ahogy azt a [Adatvédelmi útmutatók megbeszélése](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) és a [GitHub-problémáink](https://github.com/forwardemail/forwardemail.net/issues/254) csomagokban is erősen kérték, ezt hozzáadtuk.

### TXT rekord titkosítása {#encrypt-txt-record}

> `POST /v1/encrypt`

| Testparaméter | Kívánt | Típus | Leírás |
| -------------- | -------- | ------ | -------------------------------------------- |
| `input` | Igen | Húr | Bármely érvényes e-mail továbbítási egyszerű szöveges TXT rekord |

> Példa kérés:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
