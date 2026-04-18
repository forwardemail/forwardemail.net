# Email API {#email-api}


## Tartalomjegyzék {#table-of-contents}

* [Könyvtárak](#libraries)
* [Alap URI](#base-uri)
* [Hitelesítés](#authentication)
  * [API token hitelesítés (ajánlott a legtöbb végpontnál)](#api-token-authentication-recommended-for-most-endpoints)
  * [Alias hitelesítés (kimenő e-mailekhez)](#alias-credentials-authentication-for-outbound-email)
  * [Csak alias végpontok](#alias-only-endpoints)
* [Hibák](#errors)
* [Lokalizáció](#localization)
* [Lapozás](#pagination)
* [Naplók](#logs)
  * [Naplók lekérése](#retrieve-logs)
* [Fiók](#account)
  * [Fiók létrehozása](#create-account)
  * [Fiók lekérése](#retrieve-account)
  * [Fiók frissítése](#update-account)
* [Alias kapcsolatok (CardDAV)](#alias-contacts-carddav)
  * [Kapcsolatok listázása](#list-contacts)
  * [Kapcsolat létrehozása](#create-contact)
  * [Kapcsolat lekérése](#retrieve-contact)
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
  * [Mappa lekérése](#retrieve-folder)
  * [Mappa frissítése](#update-folder)
  * [Mappa törlése](#delete-folder)
  * [Mappa másolása](#copy-folder)
* [Kimenő e-mailek](#outbound-emails)
  * [Kimenő SMTP e-mail limit lekérése](#get-outbound-smtp-email-limit)
  * [Kimenő SMTP e-mailek listázása](#list-outbound-smtp-emails)
  * [Kimenő SMTP e-mail létrehozása](#create-outbound-smtp-email)
  * [Kimenő SMTP e-mail lekérése](#retrieve-outbound-smtp-email)
  * [Kimenő SMTP e-mail törlése](#delete-outbound-smtp-email)
* [Domainek](#domains)
  * [Domainek listázása](#list-domains)
  * [Domain létrehozása](#create-domain)
  * [Domain lekérése](#retrieve-domain)
  * [Domain rekordok ellenőrzése](#verify-domain-records)
  * [Domain SMTP rekordok ellenőrzése](#verify-domain-smtp-records)
  * [Domain szintű catch-all jelszavak listázása](#list-domain-wide-catch-all-passwords)
  * [Domain szintű catch-all jelszó létrehozása](#create-domain-wide-catch-all-password)
  * [Domain szintű catch-all jelszó eltávolítása](#remove-domain-wide-catch-all-password)
  * [Domain frissítése](#update-domain)
  * [Domain törlése](#delete-domain)
* [Meghívók](#invites)
  * [Domain meghívó elfogadása](#accept-domain-invite)
  * [Domain meghívó létrehozása](#create-domain-invite)
  * [Domain meghívó eltávolítása](#remove-domain-invite)
* [Tagok](#members)
  * [Domain tag frissítése](#update-domain-member)
  * [Domain tag eltávolítása](#remove-domain-member)
* [Aliasok](#aliases)
  * [Alias jelszó generálása](#generate-an-alias-password)
  * [Domain aliasok listázása](#list-domain-aliases)
  * [Új domain alias létrehozása](#create-new-domain-alias)
  * [Domain alias lekérése](#retrieve-domain-alias)
  * [Domain alias frissítése](#update-domain-alias)
  * [Domain alias törlése](#delete-domain-alias)
* [Titkosítás](#encrypt)
  * [TXT rekord titkosítása](#encrypt-txt-record)


## Könyvtárak {#libraries}

Jelenleg még nem adtunk ki API wrapper-eket, de a közeljövőben tervezzük ezt. Küldj egy e-mailt a <api@forwardemail.net> címre, ha értesítést szeretnél kapni, amikor egy adott programozási nyelv API wrapper-e megjelenik. Addig is használhatod ezeket az ajánlott HTTP kérés könyvtárakat az alkalmazásodban, vagy egyszerűen használd a [curl](https://stackoverflow.com/a/27442239/3586413) parancsot az alábbi példák szerint.

| Nyelv      | Könyvtár                                                               |
| ---------- | ---------------------------------------------------------------------- |
| Ruby       | [Faraday](https://github.com/lostisland/faraday)                       |
| Python     | [requests](https://github.com/psf/requests)                            |
| Java       | [OkHttp](https://github.com/square/okhttp/)                            |
| PHP        | [guzzle](https://github.com/guzzle/guzzle)                             |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (mi vagyunk a karbantartók) |
| Node.js    | [superagent](https://github.com/ladjs/superagent) (mi vagyunk a karbantartók) |
| Go         | [net/http](https://golang.org/pkg/net/http/)                           |
| .NET       | [RestSharp](https://github.com/restsharp/RestSharp)                    |
## Base URI {#base-uri}

A jelenlegi HTTP alap URI útvonal: `BASE_URI`.


## Hitelesítés {#authentication}

Minden végpont hitelesítést igényel [Basic Authorization](https://en.wikipedia.org/wiki/Basic_access_authentication) használatával. Két hitelesítési módszert támogatunk:

### API Token hitelesítés (Ajánlott a legtöbb végponthoz) {#api-token-authentication-recommended-for-most-endpoints}

Állítsd be az [API kulcsodat](https://forwardemail.net/my-account/security) "felhasználónév" értékként, üres jelszóval:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

Figyeld meg a kettőspontot (`:`) az API token után – ez jelzi az üres jelszót Basic Auth formátumban.

### Alias hitelesítés (Kimenő e-mailekhez) {#alias-credentials-authentication-for-outbound-email}

A [Kimenő SMTP e-mail létrehozása](#create-outbound-smtp-email) végpont támogatja az alias e-mail címed és egy [generált alias jelszó](/faq#do-you-support-receiving-email-with-imap) használatával történő hitelesítést is:

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@yourdomain.com:your_generated_password" \
  -d "to=recipient@example.com" \
  -d "subject=Hello" \
  -d "text=Test email"
```

Ez a módszer hasznos, ha olyan alkalmazásokból küldesz e-maileket, amelyek már SMTP hitelesítő adatokat használnak, és megkönnyíti az SMTP-ről az API-ra való átállást.

### Csak alias végpontok {#alias-only-endpoints}

Az [Alias Kapcsolatok](#alias-contacts-carddav), [Alias Naptárak](#alias-calendars-caldav), [Alias Üzenetek](#alias-messages-imappop3) és [Alias Mappák](#alias-folders-imappop3) végpontok alias hitelesítést igényelnek, és nem támogatják az API tokenes hitelesítést.

Ne aggódj – lentebb példákat is találsz, ha nem vagy biztos benne, hogy ez mit jelent.


## Hibák {#errors}

Ha bármilyen hiba történik, az API kérés válaszának törzse részletes hibaüzenetet tartalmaz.

| Kód  | Név                   |
| ---- | --------------------- |
| 200  | OK                    |
| 400  | Hibás kérés           |
| 401  | Nem jogosult          |
| 403  | Tiltott               |
| 404  | Nem található         |
| 429  | Túl sok kérés         |
| 500  | Belső szerverhiba    |
| 501  | Nem megvalósított     |
| 502  | Hibás átjáró          |
| 503  | Szolgáltatás nem elérhető |
| 504  | Átjáró időtúllépés    |

> \[!TIP]
> Ha 5xx státuszkódot kapsz (ami nem szabadna, hogy megtörténjen), kérjük, lépj kapcsolatba velünk a <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a> címen, és azonnal segítünk megoldani a problémádat.


## Lokalizáció {#localization}

Szolgáltatásunk több mint 25 különböző nyelvre le van fordítva. Minden API válaszüzenet a kérés felhasználójának utoljára észlelt lokalizációjára van lefordítva. Ezt felülírhatod egy egyedi `Accept-Language` fejléc megadásával. Nyugodtan próbáld ki a nyelvválasztó legördülő menüjével ezen oldal alján.


## Lapozás {#pagination}

> \[!NOTE]
> 2024. november 1-jétől az API végpontoknál a [Domainek listázása](#list-domains) és a [Domain aliasok listázása](#list-domain-aliases) alapértelmezettként `1000` maximális eredményt adnak oldalanként. Ha korábban szeretnél erre a viselkedésre váltani, adhatsz `?paginate=true` lekérdezési paramétert az adott végpont URL-jéhez.

Lapozás támogatott minden olyan API végponton, amely listáz eredményeket.

Egyszerűen add meg a lekérdezési paramétereket: `page` (és opcionálisan `limit`).

A `page` értékének 1-nél nagyobb vagy egyenlő számnak kell lennie. Ha megadod a `limit` értéket (szintén szám), akkor az érték minimuma 10, maximuma 50 (ha nincs másként jelezve).

| Lekérdezési paraméter | Kötelező | Típus  | Leírás                                                                                                                                                   |
| --------------------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page`                | Nem      | Szám   | Az eredmények oldalszáma. Ha nincs megadva, az alapértelmezett érték `1`. 1-nél nagyobb vagy egyenlő számnak kell lennie.                                  |
| `limit`               | Nem      | Szám   | Az egy oldalon visszaadott eredmények száma. Ha nincs megadva, alapértelmezett érték `10`. 1-nél nagyobb vagy egyenlő, és legfeljebb 50 lehet.             |
Annak meghatározásához, hogy elérhető-e további eredmény, az alábbi HTTP válaszfejléceket biztosítjuk (amelyeket programozott lapozáshoz elemezhet):

| HTTP Response Header | Példa                                                                                                                                                                                                                                                    | Leírás                                                                                                                                                                                                                                                                                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `X-Page-Count`       | `X-Page-Count: 3`                                                                                                                                                                                                                                        | Az elérhető összes oldal száma.                                                                                                                                                                                                                                                                                                                                   |
| `X-Page-Current`     | `X-Page-Current: 1`                                                                                                                                                                                                                                      | A visszaadott eredmények aktuális oldala (pl. a `page` lekérdezési paraméter alapján).                                                                                                                                                                                                                                                                              |
| `X-Page-Size`        | `X-Page-Size: 10`                                                                                                                                                                                                                                        | Az adott oldalon visszaadott eredmények száma (pl. a `limit` lekérdezési paraméter és a tényleges visszaadott eredmények alapján).                                                                                                                                                                                                                                  |
| `X-Item-Count`       | `X-Item-Count: 30`                                                                                                                                                                                                                                       | Az összes oldalon elérhető elemek teljes száma.                                                                                                                                                                                                                                                                                                                   |
| `Link`               | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | Egy `Link` HTTP válaszfejlécet biztosítunk, amelyet az alábbi példában látható módon elemezhet. Ez [hasonló a GitHub-hoz](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (pl. nem minden érték kerül megadásra, ha nem releváns vagy nem elérhető, pl. a `"next"` nem lesz megadva, ha nincs további oldal). |
> Példa kérés:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```


## Naplók {#logs}

### Naplók lekérése {#retrieve-logs}

API-nk programozottan lehetővé teszi fiókja naplóinak letöltését. Ennek a végpontnak a lekérése feldolgozza fiókja összes naplóját, és elküldi Önnek e-mailben csatolmányként ([Gzip](https://en.wikipedia.org/wiki/Gzip) tömörített [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) táblázatfájl) a feldolgozás befejeztével.

Ez lehetővé teszi, hogy háttérfeladatokat hozzon létre egy [Cron job](https://en.wikipedia.org/wiki/Cron) segítségével vagy a mi [Node.js ütemező szoftverünkkel, Bree](https://github.com/breejs/bree), hogy bármikor megkapja a naplókat. Vegye figyelembe, hogy ez a végpont napi `10` lekérésre van korlátozva.

A csatolmány neve kisbetűs formában `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz`, és maga az e-mail tartalmaz egy rövid összefoglalót a lekért naplókról. Naplókat bármikor letölthet a [Saját fiók → Naplók](/my-account/logs) menüpontból is.

> `GET /v1/logs/download`

| Lekérdezési paraméter | Kötelező | Típus          | Leírás                                                                                                                        |
| --------------------- | -------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `domain`              | Nem      | String (FQDN)  | Naplók szűrése teljesen minősített domain alapján ("FQDN"). Ha nem adja meg, akkor az összes domain összes naplója lekérdezésre kerül. |
| `q`                   | Nem      | String         | Naplók keresése e-mail, domain, alias név, IP-cím vagy dátum (`M/Y`, `M/D/YY`, `M-D`, `M-D-YY` vagy `M.D.YY` formátumban).       |
| `bounce_category`     | Nem      | String         | Naplók keresése egy adott visszapattanási kategória szerint (pl. `blocklist`).                                                  |
| `response_code`       | Nem      | Number         | Naplók keresése egy adott hibaválaszkód szerint (pl. `421` vagy `550`).                                                         |

> Példa kérés:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> Példa Cron job (minden nap éjfélkor):

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

Vegye figyelembe, hogy használhat olyan szolgáltatásokat, mint a [Crontab.guru](https://crontab.guru/), hogy ellenőrizze a cron kifejezés szintaxisát.

> Példa Cron job (minden nap éjfélkor **és az előző napi naplókkal**):

MacOS esetén:

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

| Törzs paraméter | Kötelező | Típus           | Leírás        |
| --------------- | -------- | --------------- | ------------- |
| `email`         | Igen     | String (Email)  | E-mail cím    |
| `password`      | Igen     | String          | Jelszó        |

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

| Törzs paraméter | Kötelező | Típus           | Leírás               |
| --------------- | -------- | --------------- | ---------------------|
| `email`         | Nem      | String (Email)  | E-mail cím           |
| `given_name`    | Nem      | String          | Keresztnév           |
| `family_name`   | Nem      | String          | Vezetéknév           |
| `avatar_url`    | Nem      | String (URL)    | Avatar kép linkje    |

> Példa kérés:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```


## Alias kapcsolatok (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> Más API végpontoktól eltérően ezekhez a végpontokhoz a [Hitelesítés](#authentication) "felhasználónév" az alias felhasználónévvel, a "jelszó" pedig az alias által generált jelszóval kell, hogy megegyezzen, Basic Authorization fejlécként.
> \[!WARNING]
> Ez a végpont szakasz fejlesztés alatt áll, és remélhetőleg 2024-ben kerül kiadásra. Addig kérjük, használjon egy IMAP klienst a weboldalunk navigációjában található "Apps" legördülő menüből.

### Kapcsolatok listázása {#list-contacts}

> `GET /v1/contacts`

**Hamarosan elérhető**

### Kapcsolat létrehozása {#create-contact}

> `POST /v1/contacts`

**Hamarosan elérhető**

### Kapcsolat lekérése {#retrieve-contact}

> `GET /v1/contacts/:id`

**Hamarosan elérhető**

### Kapcsolat frissítése {#update-contact}

> `PUT /v1/contacts/:id`

**Hamarosan elérhető**

### Kapcsolat törlése {#delete-contact}

> `DELETE /v1/contacts/:id`

**Hamarosan elérhető**


## Alias Naptárak (CalDAV) {#alias-calendars-caldav}

> \[!NOTE]
> Más API végpontoktól eltérően ezekhez a [Hitelesítés](#authentication) "felhasználónév" mezőjének az alias felhasználónévnek, a "jelszó" mezőjének pedig az alias által generált jelszónak kell lennie Basic Authorization fejlécként.

> \[!WARNING]
> Ez a végpont szakasz fejlesztés alatt áll, és remélhetőleg 2024-ben kerül kiadásra. Addig kérjük, használjon egy IMAP klienst a weboldalunk navigációjában található "Apps" legördülő menüből.

### Naptárak listázása {#list-calendars}

> `GET /v1/calendars`

**Hamarosan elérhető**

### Naptár létrehozása {#create-calendar}

> `POST /v1/calendars`

**Hamarosan elérhető**

### Naptár lekérése {#retrieve-calendar}

> `GET /v1/calendars/:id`

**Hamarosan elérhető**

### Naptár frissítése {#update-calendar}

> `PUT /v1/calendars/:id`

**Hamarosan elérhető**

### Naptár törlése {#delete-calendar}

> `DELETE /v1/calendars/:id`

**Hamarosan elérhető**


## Alias Üzenetek (IMAP/POP3) {#alias-messages-imappop3}

> \[!NOTE]
> Más API végpontoktól eltérően ezekhez a [Hitelesítés](#authentication) "felhasználónév" mezőjének az alias felhasználónévnek, a "jelszó" mezőjének pedig az alias által generált jelszónak kell lennie Basic Authorization fejlécként.

> \[!WARNING]
> Ez a végpont szakasz fejlesztés alatt áll, és remélhetőleg 2024-ben kerül kiadásra. Addig kérjük, használjon egy IMAP klienst a weboldalunk navigációjában található "Apps" legördülő menüből.

Kérjük, győződjön meg róla, hogy követte a domain beállítási utasításait.

Ezek az utasítások megtalálhatók a GYIK szekciónkban [Támogatják az IMAP-pal történő e-mail fogadást?](/faq#do-you-support-receiving-email-with-imap).

### Üzenetek listázása és keresése {#list-and-search-for-messages}

> `GET /v1/messages`

**Hamarosan elérhető**

### Üzenet létrehozása {#create-message}

> \[!NOTE]
> Ez **NEM** fog e-mailt küldeni – egyszerűen csak hozzáadja az üzenetet a postaláda mappájához (például hasonló az IMAP `APPEND` parancshoz). Ha e-mailt szeretne küldeni, akkor lásd lent a [Kimenő SMTP e-mail létrehozása](#create-outbound-smtp-email) részt. A kimenő SMTP e-mail létrehozása után egy másolatát hozzáfűzheti ehhez a végponthoz az alias postaládájához tárolási célból.

> `POST /v1/messages`

**Hamarosan elérhető**

### Üzenet lekérése {#retrieve-message}

> `GET /v1/messages/:id`

**Hamarosan elérhető**

### Üzenet frissítése {#update-message}

> `PUT /v1/messages/:id`

**Hamarosan elérhető**

### Üzenet törlése {#delete-message}

> `DELETE /v1/messages:id`

**Hamarosan elérhető**


## Alias Mappák (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> A mappa végpontok, amelyek mappaútvonalat használnak <code>/v1/folders/:path</code> végpontként, felcserélhetők a mappaazonosítóval <code>:id</code>. Ez azt jelenti, hogy a mappára hivatkozhatunk akár a <code>path</code>, akár az <code>id</code> értékével.

> \[!WARNING]
> Ez a végpont szakasz fejlesztés alatt áll, és remélhetőleg 2024-ben kerül kiadásra. Addig kérjük, használjon egy IMAP klienst a weboldalunk navigációjában található "Apps" legördülő menüből.

### Mappák listázása {#list-folders}

> `GET /v1/folders`

**Hamarosan elérhető**

### Mappa létrehozása {#create-folder}

> `POST /v1/folders`

**Hamarosan elérhető**

### Mappa lekérése {#retrieve-folder}

> `GET /v1/folders/:id`

**Hamarosan elérhető**

### Mappa frissítése {#update-folder}

> `PUT /v1/folders/:id`

**Hamarosan elérhető**

### Mappa törlése {#delete-folder}

> `DELETE /v1/folders/:id`

**Hamarosan elérhető**

### Mappa másolása {#copy-folder}

> `POST /v1/folders/:id/copy`

**Hamarosan elérhető**


## Kimenő e-mailek {#outbound-emails}

Kérjük, győződjön meg róla, hogy követte a domain beállítási utasításait.

Ezek az utasítások megtalálhatók a [Saját fiók → Domain-ek → Beállítások → Kimenő SMTP konfiguráció](/my-account/domains) menüpont alatt. Biztosítania kell a DKIM, Return-Path és DMARC beállítását a domainhez tartozó kimenő SMTP küldéshez.
### Kimenő SMTP e-mail limit lekérése {#get-outbound-smtp-email-limit}

Ez egy egyszerű végpont, amely egy JSON objektumot ad vissza, amely tartalmazza a napi kimenő SMTP üzenetek `count` és `limit` értékeit fiókonként.

> `GET /v1/emails/limit`

> Példa kérés:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### Kimenő SMTP e-mailek listázása {#list-outbound-smtp-emails}

Vegye figyelembe, hogy ez a végpont nem ad vissza tulajdonságértékeket az e-mail `message`, `headers` vagy `rejectedErrors` mezőihez.

Ezeknek a tulajdonságoknak és értékeiknek a visszaadásához kérjük, használja a [E-mail lekérése](#retrieve-email) végpontot egy e-mail azonosítóval.

> `GET /v1/emails`

| Lekérdezési paraméter | Kötelező | Típus                     | Leírás                                                                                                                                             |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`                   | Nem      | String (RegExp támogatott) | E-mailek keresése metaadat alapján                                                                                                               |
| `domain`              | Nem      | String (RegExp támogatott) | E-mailek keresése domain név alapján                                                                                                              |
| `sort`                | Nem      | String                    | Rendezés egy adott mező szerint (prefixként egy kötőjel `-` használatával fordított irányban rendez). Alapértelmezett: `created_at`, ha nincs megadva. |
| `page`                | Nem      | Szám                      | Lásd a [Lapozás](#pagination) szakaszt további információkért                                                                                     |
| `limit`               | Nem      | Szám                      | Lásd a [Lapozás](#pagination) szakaszt további információkért                                                                                     |

> Példa kérés:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### Kimenő SMTP e-mail létrehozása {#create-outbound-smtp-email}

Az e-mail létrehozására szolgáló API-nk a Nodemailer üzenet opcióinak konfigurációján alapul és azt használja. Kérjük, tekintse meg a [Nodemailer üzenet konfigurációját](https://nodemailer.com/message/) az alábbi összes törzsi paraméterhez.

Vegye figyelembe, hogy az `envelope` és `dkim` kivételével (mivel ezeket automatikusan beállítjuk Ön helyett), minden Nodemailer opciót támogatunk. Biztonsági okokból automatikusan `true` értékre állítjuk a `disableFileAccess` és `disableUrlAccess` opciókat.

Vagy az egyetlen `raw` opciót kell megadnia a teljes nyers e-maillel, beleértve a fejlécet **vagy** az egyes törzsi paramétereket külön-külön.

Ez az API végpont automatikusan kódolja az emojikat, ha azok a fejlécben találhatók (pl. a `Subject: 🤓 Hello` tárgy automatikusan `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello` formátumra konvertálódik). Célunk egy rendkívül fejlesztőbarát és hibabiztos e-mail API létrehozása volt.

**Hitelesítés:** Ez a végpont támogatja mind az [API tokenes hitelesítést](#api-token-authentication-recommended-for-most-endpoints), mind az [alias hitelesítést](#alias-credentials-authentication-for-outbound-email). Részletekért lásd a fentebb található [Hitelesítés](#authentication) szakaszt.

> `POST /v1/emails`

| Törzsi paraméter  | Kötelező | Típus             | Leírás                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------- | -------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`            | Nem      | String (E-mail)    | A feladó e-mail címe (a domain aliasaként kell léteznie).                                                                                                                                                                                                                                                                                                                                                                                                      |
| `to`              | Nem      | String vagy Tömb   | Vesszővel elválasztott lista vagy tömb a "To" fejléc címzettjeihez.                                                                                                                                                                                                                                                                                                                                                                                            |
| `cc`              | Nem      | String vagy Tömb   | Vesszővel elválasztott lista vagy tömb a "Cc" fejléc címzettjeihez.                                                                                                                                                                                                                                                                                                                                                                                            |
| `bcc`             | Nem      | String vagy Tömb   | Vesszővel elválasztott lista vagy tömb a "Bcc" fejléc címzettjeihez.                                                                                                                                                                                                                                                                                                                                                                                           |
| `subject`         | Nem      | String            | Az e-mail tárgya.                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `text`            | Nem      | String vagy Buffer | Az üzenet egyszerű szöveges változata.                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `html`            | Nem      | String vagy Buffer | Az üzenet HTML változata.                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `attachments`     | Nem      | Tömb              | Mellékletek tömbje (lásd a [Nodemailer gyakori mezőit](https://nodemailer.com/message/#common-fields)).                                                                                                                                                                                                                                                                                                                                                        |
| `sender`          | Nem      | String            | A "Sender" fejléc e-mail címe (lásd a [Nodemailer haladó mezőit](https://nodemailer.com/message/#more-advanced-fields)).                                                                                                                                                                                                                                                                                                                                        |
| `replyTo`         | Nem      | String            | A "Reply-To" fejléc e-mail címe.                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `inReplyTo`       | Nem      | String            | Az üzenethez válaszként küldött Message-ID.                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `references`      | Nem      | String vagy Tömb   | Szóközzel elválasztott lista vagy tömb Message-ID-kből.                                                                                                                                                                                                                                                                                                                                                                                                        |
| `attachDataUrls`  | Nem      | Boolean           | Ha `true`, akkor a HTML tartalomban található `data:` képeket beágyazott mellékletként konvertálja.                                                                                                                                                                                                                                                                                                                                                             |
| `watchHtml`       | Nem      | String            | Apple Watch specifikus HTML változat az üzenethez ([a Nodemailer dokumentációja szerint](https://nodemailer.com/message/#content-options]), a legújabb órák esetén nem szükséges beállítani).                                                                                                                                                                                                                                                                   |
| `amp`             | Nem      | String            | AMP4EMAIL specifikus HTML változat az üzenethez (lásd a [Nodemailer példáját](https://nodemailer.com/message/#amp-example)).                                                                                                                                                                                                                                                                                                                                   |
| `icalEvent`       | Nem      | Objektum          | iCalendar esemény alternatív üzenettartalomként (lásd a [Nodemailer naptár eseményeit](https://nodemailer.com/message/calendar-events/)).                                                                                                                                                                                                                                                                                                                     |
| `alternatives`    | Nem      | Tömb              | Alternatív üzenettartalmak tömbje (lásd a [Nodemailer alternatív tartalmakat](https://nodemailer.com/message/alternatives/)).                                                                                                                                                                                                                                                                                                                                   |
| `encoding`        | Nem      | String            | A szöveg és HTML karakterláncok kódolása (alapértelmezett `"utf-8"`, de támogatja a `"hex"` és `"base64"` kódolást is).                                                                                                                                                                                                                                                                                                                                        |
| `raw`             | Nem      | String vagy Buffer | Egy egyedi generált RFC822 formátumú üzenet használata (a Nodemailer által generált helyett – lásd a [Nodemailer egyedi forrását](https://nodemailer.com/message/custom-source/)).                                                                                                                                                                                                                                                                              |
| `textEncoding`    | Nem      | String            | A szöveges értékekhez kötelezően használandó kódolás (vagy `"quoted-printable"`, vagy `"base64"`). Az alapértelmezett érték a legközelebbi észlelt érték (ASCII esetén használja a `"quoted-printable"`-t).                                                                                                                                                                                                                                                     |
| `priority`        | Nem      | String            | Az e-mail prioritási szintje (lehet `"high"`, `"normal"` (alapértelmezett) vagy `"low"`). Megjegyzés: a `"normal"` érték nem állít be prioritás fejlécet (ez az alapértelmezett viselkedés). Ha `"high"` vagy `"low"` érték van megadva, akkor az `X-Priority`, `X-MSMail-Priority` és `Importance` fejléc [megfelelően beállításra kerül](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers`         | Nem      | Objektum vagy Tömb | Egy objektum vagy tömb további fejlécmezők beállításához (lásd a [Nodemailer egyedi fejléceit](https://nodemailer.com/message/custom-headers/)).                                                                                                                                                                                                                                                                                                              |
| `messageId`       | Nem      | String            | Opcionális Message-ID érték a "Message-ID" fejléchez (ha nincs megadva, automatikusan létrejön egy alapértelmezett érték – megjegyzés: az értéknek [meg kell felelnie az RFC2822 szabványnak](https://stackoverflow.com/a/4031705)).                                                                                                                                                                                                                               |
| `date`            | Nem      | String vagy Dátum  | Opcionális dátumérték, amelyet akkor használnak, ha a Date fejléc hiányzik az elemzés után, különben az aktuális UTC időpontot használja, ha nincs megadva. A dátum fejléc nem lehet több mint 30 nappal a jelenlegi időpont előtt.                                                                                                                                                                                                                           |
| `list`            | Nem      | Objektum          | Opcionális `List-*` fejléc objektum (lásd a [Nodemailer listafejléceit](https://nodemailer.com/message/list-headers/)).                                                                                                                                                                                                                                                                                                                                           |
> Példa kérés (API tokennel):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Példa kérés (Alias hitelesítő adatokkal):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@DOMAIN_NAME:GENERATED_PASSWORD" \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Példa kérés (Nyers email):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### Kimenő SMTP email lekérése {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> Példa kérés:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### Kimenő SMTP email törlése {#delete-outbound-smtp-email}

Az email törlése a státuszt `"rejected"`-re állítja (és ezáltal nem dolgozza fel a sorban), ha és csak ha az aktuális státusz `"pending"`, `"queued"` vagy `"deferred"`. Automatikusan törölhetünk emaileket 30 nappal az elkészítésük és/vagy elküldésük után – ezért érdemes a kimenő SMTP emailekről másolatot tartani a kliensben, adatbázisban vagy alkalmazásban. Az email ID értékünkre hivatkozhat az adatbázisban, ha szükséges – ez az érték visszatér mind a [Email létrehozása](#create-email), mind a [Email lekérése](#retrieve-email) végpontokból.

> `DELETE /v1/emails/:id`

> Példa kérés:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```


## Tartományok {#domains}

> \[!TIP]
> A tartomány végpontok, amelyek egy tartomány nevével <code>/v1/domains/:domain_name</code> érhetők el, felcserélhetők a tartomány azonosítójával <code>:domain_id</code>. Ez azt jelenti, hogy a tartományra hivatkozhatunk akár a <code>név</code>, akár az <code>azonosító</code> értékével.

### Tartományok listázása {#list-domains}

> \[!NOTE]
> 2024. november 1-jétől az API végpontok a [Tartományok listázása](#list-domains) és a [Tartomány aliasok listázása](#list-domain-aliases) esetén alapértelmezettként `1000` maximális találatot adnak oldalanként. Ha korábban szeretnél erre az új viselkedésre váltani, akkor az URL végpont lekérdezéséhez adhatsz egy `?paginate=true` querystring paramétert. További információért lásd a [Lapozás](#pagination) részt.

> `GET /v1/domains`

| Lekérdezési paraméter | Kötelező | Típus                     | Leírás                                                                                                                                           |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | Nem      | String (RegExp támogatott) | Tartományok keresése név alapján                                                                                                                 |
| `name`                | Nem      | String (RegExp támogatott) | Tartományok keresése név alapján                                                                                                                 |
| `sort`                | Nem      | String                    | Rendezés egy adott mező szerint (prefixként egy kötőjel `-` használható a fordított irányú rendezéshez). Alapértelmezett: `created_at`, ha nincs megadva. |
| `page`                | Nem      | Szám                      | Lásd a [Lapozás](#pagination) részt                                                                                                             |
| `limit`               | Nem      | Szám                      | Lásd a [Lapozás](#pagination) részt                                                                                                             |

> Példa kérés:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### Tartomány létrehozása {#create-domain}

> `POST /v1/domains`

| Törzs paraméter                | Kötelező | Típus                                          | Leírás                                                                                                                                                                                                                                                                                                            |
| ------------------------------ | -------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `domain`                       | Igen     | String (FQDN vagy IP)                          | Teljesen minősített tartománynév ("FQDN") vagy IP cím                                                                                                                                                                                                                                                             |
| `team_domain`                  | Nem      | String (tartomány azonosító vagy név; FQDN)   | Automatikusan hozzárendeli ezt a tartományt ugyanahhoz a csapathoz, mint egy másik tartomány. Ez azt jelenti, hogy ennek a tartománynak az összes tagja csapattagként lesz hozzárendelve, és a `plan` automatikusan `team` lesz. Szükség esetén beállítható `"none"` értékre az explicit tiltáshoz, de ez nem kötelező. |
| `plan`                         | Nem      | String (felsorolható)                          | Előfizetési típus (lehet `"free"`, `"enhanced_protection"` vagy `"team"`, alapértelmezett `"free"` vagy a felhasználó aktuális fizetős előfizetése, ha van)                                                                                                                                                        |
| `catchall`                     | Nem      | String (elválasztott email címek) vagy Boolean | Alapértelmezett catch-all alias létrehozása, alapértelmezett `true` (ha `true`, az API felhasználó email címe lesz a címzett, ha `false`, nem jön létre catch-all). Ha String, akkor az egy elválasztott email címek listája, amely címzettekként használható (sortörés, szóköz és/vagy vessző választja el)                |
| `has_adult_content_protection` | Nem      | Boolean                                       | Spam szűrő felnőtt tartalom elleni védelem engedélyezése ezen a tartományon                                                                                                                                                                                                                                         |
| `has_phishing_protection`      | Nem      | Boolean                                       | Spam szűrő adathalászat elleni védelem engedélyezése ezen a tartományon                                                                                                                                                                                                                                            |
| `has_executable_protection`    | Nem      | Boolean                                       | Spam szűrő futtatható fájlok elleni védelem engedélyezése ezen a tartományon                                                                                                                                                                                                                                        |
| `has_virus_protection`         | Nem      | Boolean                                       | Spam szűrő vírusvédelem engedélyezése ezen a tartományon                                                                                                                                                                                                                                                           |
| `has_recipient_verification`   | Nem      | Boolean                                       | Globális tartomány alapértelmezett beállítása arra, hogy az alias címzetteknek email ellenőrző linkre kell-e kattintaniuk az emailek továbbításához                                                                                                                                                                 |
| `ignore_mx_check`              | Nem      | Boolean                                       | Az MX rekord ellenőrzésének figyelmen kívül hagyása a tartományon a hitelesítéshez. Ez főként azoknak a felhasználóknak hasznos, akik fejlett MX csere konfigurációs szabályokat használnak, és meg akarják tartani a meglévő MX cseréjüket, majd továbbítani a mi rendszerünkre.                                   |
| `retention_days`               | Nem      | Szám                                          | Egész szám 0 és 30 között, amely megadja, hány napig tároljuk a kimenő SMTP emaileket sikeres kézbesítés vagy végleges hiba esetén. Alapértelmezett `0`, ami azt jelenti, hogy a kimenő SMTP emailek azonnal törlődnek és anonimizálódnak a biztonság érdekében.                                                        |
| `bounce_webhook`               | Nem      | String (URL) vagy Boolean (false)             | Az általad választott `http://` vagy `https://` webhook URL, ahová a visszapattanási webhookokat küldjük. Egy `POST` kérést küldünk erre az URL-re a kimenő SMTP hibákról (pl. lágy vagy kemény hibák – így kezelheted az előfizetőidet és programozottan kezelheted a kimenő emailjeidet).                             |
| `max_quota_per_alias`          | Nem      | String                                        | Maximális tárolási kvóta aliasokra ezen a tartománynéven. Adj meg egy értéket, például "1 GB", amelyet a [bytes](https://github.com/visionmedia/bytes.js) fog feldolgozni.                                                                                                                                          |
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

### Domain rekordok ellenőrzése {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Példa kérés:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### Domain SMTP rekordok ellenőrzése {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> Példa kérés:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### Domain szintű catch-all jelszavak listázása {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> Példa kérés:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Domain szintű catch-all jelszó létrehozása {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Body Parameter | Kötelező | Típus  | Leírás                                                                                                                                                                                                                      |
| -------------- | -------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | Nem      | String | Egyéni új jelszó a domain szintű catch-all jelszóhoz. Megjegyzés: ezt üresen hagyhatja vagy teljesen el is hagyhatja az API kérés törzséből, ha véletlenszerűen generált és erős jelszót szeretne kapni.                          Az egyedi postafiók jelszavak legfeljebb 128 karakter hosszúak lehetnek, nem kezdődhetnek vagy végződhetnek szóközzel, és nem tartalmazhatnak idézőjeleket vagy aposztrófokat. A catch-all jelszavak csak SMTP küldésre használhatók. IMAP, POP3, CalDAV, CardDAV és postafiók hozzáféréshez inkább generálj jelszót az adott aliasnak. |
| `description`  | Nem      | String | Csak szervezési célokra szolgáló leírás.                                                                                                                                                                                   |

> Példa kérés:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Domain szintű catch-all jelszó eltávolítása {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> Példa kérés:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### Domain frissítése {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| Body Parameter                 | Kötelező | Típus                            | Leírás                                                                                                                                                                                                                                                                                     |
| ------------------------------ | -------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port`                    | Nem      | String vagy Szám                | Egyéni port az SMTP továbbításhoz (alapértelmezett: `"25"`)                                                                                                                                                                                                                                |
| `has_adult_content_protection` | Nem      | Boolean                         | Spam Scanner felnőtt tartalom elleni védelem engedélyezése ezen a domainen                                                                                                                                                                                                                  |
| `has_phishing_protection`      | Nem      | Boolean                         | Spam Scanner adathalászat elleni védelem engedélyezése ezen a domainen                                                                                                                                                                                                                     |
| `has_executable_protection`    | Nem      | Boolean                         | Spam Scanner futtatható fájlok elleni védelem engedélyezése ezen a domainen                                                                                                                                                                                                                |
| `has_virus_protection`         | Nem      | Boolean                         | Spam Scanner vírusvédelem engedélyezése ezen a domainen                                                                                                                                                                                                                                    |
| `has_recipient_verification`   | Nem      | Boolean                         | Globális domain alapértelmezett beállítás arra, hogy az alias címzetteknek kattintaniuk kell-e egy e-mail ellenőrző linkre, hogy az e-mailek átjussanak                                                                                                                                   |
| `ignore_mx_check`              | Nem      | Boolean                         | Az MX rekord ellenőrzésének figyelmen kívül hagyása a domainnél a hitelesítéshez. Ez főként olyan felhasználóknak szól, akiknek fejlett MX csere konfigurációs szabályaik vannak, és meg akarják tartani a meglévő MX cseréjüket, majd továbbítani a mi rendszerünkre.                      |
| `retention_days`               | Nem      | Szám                            | Egész szám `0` és `30` között, amely megadja, hogy hány napig tároljuk a kimenő SMTP e-maileket sikeres kézbesítés vagy végleges hiba esetén. Alapértelmezett `0`, ami azt jelenti, hogy a kimenő SMTP e-mailek azonnal törlődnek és anonimizálódnak a biztonság érdekében.                     |
| `bounce_webhook`               | Nem      | String (URL) vagy Boolean (false) | Az Ön által választott `http://` vagy `https://` webhook URL, ahová a visszapattanási webhookokat küldjük. Egy `POST` kérést küldünk erre az URL-re a kimenő SMTP hibákról (pl. lágy vagy kemény hibák – így kezelheti előfizetőit és programozottan kezelheti a kimenő e-maileket).               |
| `max_quota_per_alias`          | Nem      | String                          | Maximális tárhely kvóta az aliasok számára ezen a domain néven. Adjon meg egy értéket, például "1 GB", amelyet a [bytes](https://github.com/visionmedia/bytes.js) fog feldolgozni.                                                                                                         |
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

| Body Parameter | Kötelező | Típus               | Leírás                                                                                   |
| -------------- | -------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `email`        | Igen     | String (Email)      | E-mail cím, amelyet meghívnak a domain tagjai közé                                      |
| `group`        | Igen     | String (felsorolható) | Csoport, amelyhez a felhasználót hozzáadják a domain tagságban (lehet `"admin"` vagy `"user"`) |

> Példa kérés:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> Ha a meghívott felhasználó már elfogadott tagja bármely más domainnek, amelynek az őt meghívó adminisztrátor is tagja, akkor a meghívó automatikusan elfogadásra kerül, és nem küld e-mailt.

### Domain meghívó eltávolítása {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| Body Parameter | Kötelező | Típus           | Leírás                                         |
| -------------- | -------- | -------------- | ---------------------------------------------- |
| `email`        | Igen     | String (Email) | E-mail cím, amelyet el kell távolítani a domain tagjai közül |

> Példa kérés:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```


## Tagok {#members}

### Domain tag frissítése {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Body Parameter | Kötelező | Típus               | Leírás                                                                                   |
| -------------- | -------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `group`        | Igen     | String (felsorolható) | Csoport, amelyre a felhasználó frissítve lesz a domain tagságban (lehet `"admin"` vagy `"user"`) |

> Példa kérés:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### Domain tag eltávolítása {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> Példa kérés:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```


## Aliasok {#aliases}

### Alias jelszó generálása {#generate-an-alias-password}

Figyelem, ha nem küldesz e-mailben utasításokat, akkor a felhasználónév és jelszó a sikeres kérés JSON válaszában lesz a következő formátumban: `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }`.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Body Parameter         | Kötelező | Típus    | Leírás                                                                                                                                                                                                                                                                                         |
| ---------------------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password`         | Nem      | String  | Egyéni új jelszó az alias számára. Megjegyzés: ezt üresen hagyhatod vagy teljesen el is hagyhatod az API kérésed törzséből, ha véletlenszerűen generált és erős jelszót szeretnél kapni.                                                                                                     Az egyedi postafiók jelszavak legfeljebb 128 karakter hosszúak lehetnek, nem kezdődhetnek vagy végződhetnek szóközzel, és nem tartalmazhatnak idézőjeleket vagy aposztrófokat. |
| `password`             | Nem      | String  | Meglévő jelszó az alias számára, amellyel a jelszó megváltoztatható anélkül, hogy törölnéd a meglévő IMAP postafiók tárolót (lásd az alábbi `is_override` opciót, ha már nincs meg a meglévő jelszó).                                                                                                                 |
| `is_override`          | Nem      | Boolean | **ÓVATOSAN HASZNÁLD**: Ez teljesen felülírja a meglévő alias jelszót és adatbázist, véglegesen törli a meglévő IMAP tárolót, és teljesen visszaállítja az alias SQLite e-mail adatbázist. Kérjük, készíts biztonsági mentést, ha lehetséges, ha van már meglévő postafiók az aliashoz kapcsolva. |
| `emailed_instructions` | Nem      | String  | E-mail cím, amelyre az alias jelszavát és beállítási utasításait küldjük.                                                                                                                                                                                                                                |
> Példa kérés:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### Tartomány aliasok listázása {#list-domain-aliases}

> \[!NOTE]
> 2024. november 1-jétől az API végpontok a [Tartományok listázása](#list-domains) és a [Tartomány aliasok listázása](#list-domain-aliases) esetén alapértelmezettként oldalanként maximum `1000` találatot adnak vissza. Ha korábban szeretnél erre a viselkedésre áttérni, akkor az URL végpont lekérdezéséhez adhatsz egy `?paginate=true` kiegészítő lekérdezési paramétert. További információért lásd a [Lapozás](#pagination) részt.

> `GET /v1/domains/DOMAIN_NAME/aliases`

| Lekérdezési paraméter | Kötelező | Típus                      | Leírás                                                                                                                                           |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | Nem      | String (RegExp támogatott) | Aliasok keresése egy tartományban név, címke vagy címzett alapján                                                                                 |
| `name`                | Nem      | String (RegExp támogatott) | Aliasok keresése egy tartományban név alapján                                                                                                    |
| `recipient`           | Nem      | String (RegExp támogatott) | Aliasok keresése egy tartományban címzett alapján                                                                                                |
| `sort`                | Nem      | String                    | Rendezés egy adott mező szerint (egy kötőjellel `-` prefixelve fordított irányban rendez). Ha nincs megadva, alapértelmezett a `created_at`.         |
| `page`                | Nem      | Number                    | Lásd a [Lapozás](#pagination) részt további információért                                                                                        |
| `limit`               | Nem      | Number                    | Lásd a [Lapozás](#pagination) részt további információért                                                                                        |

> Példa kérés:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### Új tartomány alias létrehozása {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| Törzs paraméter                | Kötelező | Típus                                   | Leírás                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                        | Nem      | String                                 | Alias neve (ha nincs megadva vagy üres, akkor véletlenszerű alias generálódik)                                                                                                                                                                                                                                                                                                            |
| `recipients`                  | Nem      | String vagy Tömb                       | Címzettek listája (sorvége/space/vesszővel elválasztott String vagy érvényes email címekből, teljesen kvalifikált domain nevekből ("FQDN"), IP címekből és/vagy webhook URL-ekből álló tömb – ha nincs megadva vagy üres tömb, akkor az API kérést végző felhasználó email címe lesz a címzett)                                                                                     |
| `description`                 | Nem      | String                                 | Alias leírása                                                                                                                                                                                                                                                                                                                                                                               |
| `labels`                      | Nem      | String vagy Tömb                       | Címkék listája (sorvége/space/vesszővel elválasztott String vagy tömb)                                                                                                                                                                                                                                                                                                                   |
| `has_recipient_verification`  | Nem      | Boolean                                | Kötelezővé teszi, hogy a címzettek kattintsanak egy emailes megerősítő linkre az emailek továbbításához (ha nincs explicit megadva, akkor a tartomány beállítása érvényesül)                                                                                                                                                                                                             |
| `is_enabled`                  | Nem      | Boolean                                | Az alias engedélyezése vagy letiltása (ha letiltott, az emailek sehova sem kerülnek, de sikeres státuszkódot ad vissza). Ha érték van megadva, akkor azt a [boolean](https://github.com/thenativeweb/boolean#quick-start) könyvtár segítségével boolean értékre konvertálja.                                                                                                               |
| `error_code_if_disabled`      | Nem      | Szám (`250`, `421` vagy `550`)         | Ha az alias `is_enabled` értéke `false`, akkor a bejövő email elutasításra kerül az alábbi kódok valamelyikével: `250` (csendben nem kézbesít, pl. fekete lyuk vagy `/dev/null`), `421` (lágy elutasítás; újrapróbálkozás kb. 5 napig), vagy `550` (végleges hiba és elutasítás). Alapértelmezett érték: `250`.                                                                                     |
| `has_imap`                    | Nem      | Boolean                                | Az alias IMAP tárolásának engedélyezése vagy letiltása (ha letiltott, a bejövő emailek nem kerülnek tárolásra az [IMAP tárolóban](/blog/docs/best-quantum-safe-encrypted-email-service). Ha érték van megadva, akkor azt a [boolean](https://github.com/thenativeweb/boolean#quick-start) könyvtár segítségével boolean értékre konvertálja.                                                  |
| `has_pgp`                     | Nem      | Boolean                                | Az alias [OpenPGP titkosításának](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) engedélyezése vagy letiltása az [IMAP/POP3/CalDAV/CardDAV titkosított email tároláshoz](/blog/docs/best-quantum-safe-encrypted-email-service) az alias `public_key` használatával.                                                                                     |
| `public_key`                  | Nem      | String                                 | OpenPGP publikus kulcs ASCII Armor formátumban ([példa megtekintése](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); pl. GPG kulcs a `support@forwardemail.net` számára). Csak akkor érvényes, ha `has_pgp` értéke `true`. [További információ az end-to-end titkosításról a GYIK-ban](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                   | Nem      | String                                 | Az alias maximális tárolási kvótája. Hagyd üresen a tartomány aktuális maximális kvótájának visszaállításához, vagy adj meg egy értéket, pl. "1 GB", amit a [bytes](https://github.com/visionmedia/bytes.js) könyvtár értelmez. Ezt az értéket csak a tartomány adminisztrátorai módosíthatják.                                                                                             |
| `vacation_responder_is_enabled` | Nem      | Boolean                                | Automatikus szabadságválaszoló engedélyezése vagy letiltása.                                                                                                                                                                                                                                                                                                                               |
| `vacation_responder_start_date` | Nem      | String                                 | Szabadságválaszoló kezdő dátuma (ha engedélyezve van és nincs megadva, akkor már aktívnak tekinti). Támogatott dátumformátumok: `MM/DD/YYYY`, `YYYY-MM-DD` és egyéb formátumok a `dayjs` intelligens elemzése által.                                                                                                                                                                      |
| `vacation_responder_end_date`   | Nem      | String                                 | Szabadságválaszoló záró dátuma (ha engedélyezve van és nincs megadva, akkor végtelen ideig aktív). Támogatott dátumformátumok: `MM/DD/YYYY`, `YYYY-MM-DD` és egyéb formátumok a `dayjs` intelligens elemzése által.                                                                                                                                                                        |
| `vacation_responder_subject`    | Nem      | String                                 | Szabadságválaszoló tárgya egyszerű szövegként, pl. "Iroda zárva". Itt a `striptags` eltávolít minden HTML-t.                                                                                                                                                                                                                                                                                 |
| `vacation_responder_message`    | Nem      | String                                 | Szabadságválaszoló üzenete egyszerű szövegként, pl. "Februárig nem vagyok elérhető.". Itt a `striptags` eltávolít minden HTML-t.                                                                                                                                                                                                                                                             |
> Példa kérés:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### Tartomány alias lekérése {#retrieve-domain-alias}

Egy tartomány aliasát lekérheti az `id` vagy a `name` értéke alapján.

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

### Tartomány alias frissítése {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Body Parameter                  | Kötelező | Típus                                   | Leírás                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                          | Nem      | String                                 | Alias neve                                                                                                                                                                                                                                                                                                                                                                                 |
| `recipients`                    | Nem      | String vagy Tömb                       | Címzettek listája (sorvégekkel/ szóközzel/vesszővel elválasztott String vagy érvényes email címekből, teljesen minősített domain nevekből ("FQDN"), IP címekből és/vagy webhook URL-ekből álló tömb)                                                                                                                                                                                         |
| `description`                   | Nem      | String                                 | Alias leírása                                                                                                                                                                                                                                                                                                                                                                              |
| `labels`                        | Nem      | String vagy Tömb                       | Címkék listája (sorvégekkel/ szóközzel/vesszővel elválasztott String vagy tömb)                                                                                                                                                                                                                                                                                                            |
| `has_recipient_verification`    | Nem      | Boolean                                | Megköveteli, hogy a címzettek kattintsanak egy email ellenőrző linkre, hogy az emailek átjussanak (ha nincs explicit módon beállítva a kérés törzsében, akkor az adott tartomány beállítását használja)                                                                                                                                                                                     |
| `is_enabled`                    | Nem      | Boolean                                | Engedélyezi vagy letiltja ezt az alias-t (ha le van tiltva, az emailek sehova sem kerülnek, de sikeres státuszkódot ad vissza). Ha érték van megadva, az [boolean](https://github.com/thenativeweb/boolean#quick-start) segítségével boolean értékre konvertálódik                                                                                                                                 |
| `error_code_if_disabled`        | Nem      | Szám (lehet `250`, `421` vagy `550`) | Bejövő email erre az aliasra elutasításra kerül, ha az `is_enabled` `false`, az alábbi kódokkal: `250` (csendben nem kézbesít, pl. fekete lyuk vagy `/dev/null`), `421` (lágy elutasítás; és újrapróbálkozás kb. 5 napig) vagy `550` (végleges hiba és elutasítás). Alapértelmezett érték: `250`.                                                                                                   |
| `has_imap`                      | Nem      | Boolean                                | Engedélyezi vagy letiltja az IMAP tárolást ehhez az alias-hoz (ha le van tiltva, a bejövő emailek nem kerülnek tárolásra az [IMAP tárolóban](/blog/docs/best-quantum-safe-encrypted-email-service). Ha érték van megadva, az [boolean](https://github.com/thenativeweb/boolean#quick-start) segítségével boolean értékre konvertálódik)                                                                |
| `has_pgp`                       | Nem      | Boolean                                | Engedélyezi vagy letiltja az [OpenPGP titkosítást](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) az [IMAP/POP3/CalDAV/CardDAV titkosított email tároláshoz](/blog/docs/best-quantum-safe-encrypted-email-service) az alias `public_key` használatával.                                                                                               |
| `public_key`                    | Nem      | String                                 | OpenPGP nyilvános kulcs ASCII Armor formátumban ([kattintson ide egy példa megtekintéséhez](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); pl. GPG kulcs a `support@forwardemail.net` számára). Csak akkor érvényes, ha a `has_pgp` értéke `true`. [További információ az end-to-end titkosításról a GYIK-ben](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                     | Nem      | String                                 | Maximális tárolási kvóta ehhez az alias-hoz. Üresen hagyva visszaállítja a tartomány aktuális maximális kvótáját, vagy megadható egy érték, pl. "1 GB", amit a [bytes](https://github.com/visionmedia/bytes.js) értelmez. Ezt az értéket csak a tartomány adminisztrátorai módosíthatják.                                                                                                   |
| `vacation_responder_is_enabled` | Nem      | Boolean                                | Automatikus szabadságválaszoló engedélyezése vagy letiltása.                                                                                                                                                                                                                                                                                                                              |
| `vacation_responder_start_date` | Nem      | String                                 | Szabadságválaszoló kezdő dátuma (ha engedélyezve van és nincs itt megadva kezdő dátum, akkor úgy tekinti, hogy már elindult). Támogatott dátumformátumok: `MM/DD/YYYY`, `YYYY-MM-DD` és egyéb formátumok a `dayjs` intelligens elemzése által.                                                                                                                                               |
| `vacation_responder_end_date`   | Nem      | String                                 | Szabadságválaszoló záró dátuma (ha engedélyezve van és nincs itt megadva záró dátum, akkor úgy tekinti, hogy soha nem ér véget és örökké válaszol). Támogatott dátumformátumok: `MM/DD/YYYY`, `YYYY-MM-DD` és egyéb formátumok a `dayjs` intelligens elemzése által.                                                                                                                        |
| `vacation_responder_subject`    | Nem      | String                                 | Szabadságválaszoló tárgya egyszerű szövegként, pl. "Iroda zárva". Itt a `striptags` segítségével eltávolítjuk az összes HTML-t.                                                                                                                                                                                                                                                           |
| `vacation_responder_message`    | Nem      | String                                 | Szabadságválaszoló üzenete egyszerű szövegként, pl. "Februárig nem vagyok elérhető.". Itt a `striptags` segítségével eltávolítjuk az összes HTML-t.                                                                                                                                                                                                                                       |
> Példa kérés:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### Tartomány alias törlése {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> Példa kérés:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```


## Titkosítás {#encrypt}

Lehetővé tesszük, hogy még az ingyenes csomagon is titkosíts rekordokat költség nélkül. A magánéletnek nem kellene egy funkciónak lennie, hanem alapvetően be kellene épülnie a termék minden aspektusába. Nagyon sok kérés érkezett egy [Privacy Guides beszélgetésben](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) és a [GitHub hibajegyeinken](https://github.com/forwardemail/forwardemail.net/issues/254), ezért ezt hozzáadtuk.

### TXT rekord titkosítása {#encrypt-txt-record}

> `POST /v1/encrypt`

| Body Parameter | Kötelező | Típus  | Leírás                                      |
| -------------- | -------- | ------ | -------------------------------------------- |
| `input`        | Igen     | String | Bármely érvényes Forward Email sima szöveges TXT rekord |

> Példa kérés:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
