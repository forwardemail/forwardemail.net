# Sähköposti-API {#email-api}

## Sisällysluettelo {#table-of-contents}

* [Kirjastot](#libraries)
* [Perus-URI](#base-uri)
* [Todennus](#authentication)
* [Virheet](#errors)
* [Lokalisointi](#localization)
* [Sivunumerointi](#pagination)
* [Lokit](#logs)
  * [Lokien nouto](#retrieve-logs)
* [Tili](#account)
  * [Luo tili](#create-account)
  * [Nouda tili](#retrieve-account)
  * [Päivitä tili](#update-account)
* [Alias-yhteystiedot (CardDAV)](#alias-contacts-carddav)
  * [Listaa yhteystiedot](#list-contacts)
  * [Luo yhteystieto](#create-contact)
  * [Hae yhteystieto](#retrieve-contact)
  * [Päivitä yhteystieto](#update-contact)
  * [Poista yhteystieto](#delete-contact)
* [Alias-kalenterit (CalDAV)](#alias-calendars-caldav)
  * [Listaa kalenterit](#list-calendars)
  * [Luo kalenteri](#create-calendar)
  * [Hae kalenteri](#retrieve-calendar)
  * [Päivitä kalenteri](#update-calendar)
  * [Poista kalenteri](#delete-calendar)
* [Alias-viestit (IMAP/POP3)](#alias-messages-imappop3)
  * [Viestien listaaminen ja hakeminen](#list-and-search-for-messages)
  * [Luo viesti](#create-message)
  * [Nouda viesti](#retrieve-message)
  * [Päivitä viesti](#update-message)
  * [Poista viesti](#delete-message)
* [Alias-kansiot (IMAP/POP3)](#alias-folders-imappop3)
  * [Listaa kansiot](#list-folders)
  * [Luo kansio](#create-folder)
  * [Noutokansio](#retrieve-folder)
  * [Päivitä kansio](#update-folder)
  * [Poista kansio](#delete-folder)
  * [Kopioi kansio](#copy-folder)
* [Lähtevät sähköpostit](#outbound-emails)
  * [Hanki lähtevän SMTP-sähköpostin rajoitus](#get-outbound-smtp-email-limit)
  * [Listaa lähtevät SMTP-sähköpostit](#list-outbound-smtp-emails)
  * [Luo lähtevä SMTP-sähköposti](#create-outbound-smtp-email)
  * [Hae lähtevä SMTP-sähköposti](#retrieve-outbound-smtp-email)
  * [Poista lähtevä SMTP-sähköposti](#delete-outbound-smtp-email)
* [Verkkotunnukset](#domains)
  * [Listaa verkkotunnukset](#list-domains)
  * [Luo verkkotunnus](#create-domain)
  * [Hae verkkotunnus](#retrieve-domain)
  * [Tarkista verkkotunnustietueet](#verify-domain-records)
  * [Tarkista verkkotunnuksen SMTP-tietueet](#verify-domain-smtp-records)
  * [Listaa koko verkkotunnuksen kattavat yleiset salasanat](#list-domain-wide-catch-all-passwords)
  * [Luo koko verkkotunnuksen kattava salasana](#create-domain-wide-catch-all-password)
  * [Poista koko verkkotunnuksen kattava yleissalasana](#remove-domain-wide-catch-all-password)
  * [Päivitä verkkotunnus](#update-domain)
  * [Poista verkkotunnus](#delete-domain)
* [Kutsut](#invites)
  * [Hyväksy verkkotunnuskutsu](#accept-domain-invite)
  * [Luo verkkotunnuskutsu](#create-domain-invite)
  * [Poista verkkotunnuskutsu](#remove-domain-invite)
* [Jäsenet](#members)
  * [Päivitä verkkotunnuksen jäsen](#update-domain-member)
  * [Poista verkkotunnuksen jäsen](#remove-domain-member)
* [Aliakset](#aliases)
  * [Luo aliassalasana](#generate-an-alias-password)
  * [Listaa verkkotunnusaliakset](#list-domain-aliases)
  * [Luo uusi verkkotunnusalias](#create-new-domain-alias)
  * [Hae verkkotunnuksen alias](#retrieve-domain-alias)
  * [Päivitä verkkotunnuksen alias](#update-domain-alias)
  * [Poista verkkotunnuksen alias](#delete-domain-alias)
* [Salaa](#encrypt)
  * [Salaa TXT-tietue](#encrypt-txt-record)

## Kirjastot {#libraries}

Tällä hetkellä emme ole vielä julkaisseet API-kääreitä, mutta aiomme tehdä niin lähitulevaisuudessa. Lähetä sähköpostia osoitteeseen <api@forwardemail.net>, jos haluat saada ilmoituksen, kun tietyn ohjelmointikielen API-kääre julkaistaan. Sillä välin voit käyttää näitä suositeltuja HTTP-pyyntökirjastoja sovelluksessasi tai käyttää yksinkertaisesti [kiemura](https://stackoverflow.com/a/27442239/3586413)-kirjastoa kuten alla olevissa esimerkeissä.

| Kieli | Kirjasto |
| ---------- | ---------------------------------------------------------------------- |
| Rubiini | [Faraday](https://github.com/lostisland/faraday) |
| Python | [requests](https://github.com/psf/requests) |
| Java | [OkHttp](https://github.com/square/okhttp/) |
| PHP | [guzzle](https://github.com/guzzle/guzzle) |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (olemme ylläpitäjiä) |
| Node.js | [superagent](https://github.com/ladjs/superagent) (olemme ylläpitäjiä) |
| Mennä | [net/http](https://golang.org/pkg/net/http/) |
| .NET | [RestSharp](https://github.com/restsharp/RestSharp) |

## Perus-URI {#base-uri}

Nykyinen HTTP-perus-URI-polku on: `BASE_URI`.

## Todennus {#authentication}

Kaikki päätepisteet edellyttävät, että [API-avain](https://forwardemail.net/my-account/security) on asetettu pyynnön [Perusvaltuutus](https://en.wikipedia.org/wiki/Basic_access_authentication)-otsikon "username"-arvoksi (lukuun ottamatta [Alias-yhteystiedot](#alias-contacts)-, [Alias-kalenterit](#alias-calendars)- ja [Alias-postilaatikot](#alias-mailboxes)-otsikoita, jotka käyttävät [luotu alias-käyttäjätunnus ja salasana](/faq#do-you-support-receiving-email-with-imap)-arvoa).

Älä huoli – esimerkkejä on alla, jos et ole varma, mistä on kyse.

## Virheet {#errors}

Jos virheitä ilmenee, API-pyynnön vastauksen runko sisältää yksityiskohtaisen virheilmoituksen.

| Koodi | Nimi |
| ---- | --------------------- |
| 200 | OK |
| 400 | Virheellinen pyyntö |
| 401 | Luvaton |
| 403 | Kielletty |
| 404 | Ei löytynyt |
| 429 | Liian monta pyyntöä |
| 500 | Sisäinen palvelinvirhe |
| 501 | Ei toteutettu |
| 502 | Huono yhdyskäytävä |
| 503 | Palvelu ei ole käytettävissä |
| 504 | Yhdyskäytävän aikakatkaisu |

> \[!TIP]
> Jos saat 5xx-tilakoodin (mitä ei pitäisi tapahtua), ota meihin yhteyttä osoitteessa <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a>, niin autamme sinua ratkaisemaan ongelmasi välittömästi.

## Lokalisointi {#localization}

Palvelumme on käännetty yli 25 eri kielelle. Kaikki API-vastausviestit käännetään käyttäjän API-pyynnön viimeksi havaitsemaan kieliasetukseen. Voit ohittaa tämän antamalla mukautetun `Accept-Language`-otsikon. Voit kokeilla sitä tämän sivun alareunassa olevan kielivalikon avulla.

## Sivutus {#pagination}

> \[!NOTE]
> 1. marraskuuta 2024 alkaen [Listaa verkkotunnukset](#list-domains)- ja [Listaa verkkotunnusaliakset](#list-domain-aliases)-sovellusliittymän päätepisteiden oletusarvo on `1000`, jonka enimmäistulokset sivua kohden ovat `1000`. Jos haluat ottaa tämän käyttöön jo aiemmin, voit välittää `?paginate=true`:n lisäkyselymerkkijonoparametrina päätepistekyselyn URL-osoitteeseen.

Kaikki tuloksia listaavat API-päätepisteet tukevat sivutusta.

Anna vain kyselymerkkijonon ominaisuudet `page` (ja valinnaisesti `limit`).

Ominaisuuden `page` tulee olla luku, joka on suurempi tai yhtä suuri kuin `1`. Jos annat `limit`:n (myös luku), pienin arvo on `10` ja suurin `50` (ellei toisin mainita).

| Kyselymerkkijonojen parametrit | Pakollinen | Tyyppi | Kuvaus |
| --------------------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page` | Ei | Määrä | Palautettava tulossivu. Jos ei ole määritetty, `page` -arvo on `1`. Sen on oltava suurempi tai yhtä suuri kuin `1`. |
| `limit` | Ei | Määrä | Sivua kohden palautettavien tulosten määrä. Oletusarvo on `10`, jos sitä ei ole määritetty. Luvun on oltava suurempi tai yhtä suuri kuin `1` ja pienempi tai yhtä suuri kuin `50`. |

Jotta voimme selvittää, onko lisää tuloksia saatavilla, tarjoamme seuraavat HTTP-vastausotsikot (jotka voit jäsentää sivutusta varten):

| HTTP-vastausotsikko | Esimerkki | Kuvaus |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `X-Page-Count` | `X-Page-Count: 3` | Käytettävissä olevien sivujen kokonaismäärä. |
| `X-Page-Current` | `X-Page-Current: 1` | Nykyinen palautettujen tulosten sivu (esim. `page` kyselymerkkijonoparametrin perusteella). |
| `X-Page-Size` | `X-Page-Size: 10` | Sivulla palautettujen tulosten kokonaismäärä (esim. `limit` kyselymerkkijonoparametrin ja palautettujen todellisten tulosten perusteella). |
| `X-Item-Count` | `X-Item-Count: 30` | Kaikilla sivuilla saatavilla olevien kohteiden kokonaismäärä. |
| `Link` | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | Tarjoamme `Link` HTTP-vastausotsikon, jonka voit jäsentää esimerkissä esitetyllä tavalla. Tämä on [similar to GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (esim. kaikkia arvoja ei anneta, jos ne eivät ole relevantteja tai saatavilla, esim. `"next"` ei anneta, jos toista sivua ei ole). |

> Esimerkkipyyntö:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```

## Lokit {#logs}

### Nouda lokit {#retrieve-logs}

API-rajapintamme avulla voit ladata lokeja tilillesi ohjelmallisesti. Pyynnön lähettäminen tähän päätepisteeseen käsittelee kaikki tilisi lokit ja lähettää ne sinulle sähköpostin liitteenä ([Gzip](https://en.wikipedia.org/wiki/Gzip) pakattu [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) taulukkolaskentatiedosto), kun se on valmis.

Näin voit luoda taustatöitä [Cron-työ](https://en.wikipedia.org/wiki/Cron)-kohteella tai käyttää [Node.js-työaikataulutusohjelmisto Bree](https://github.com/breejs/bree)-kohteitamme lokien vastaanottamiseen milloin tahansa. Huomaa, että tämä päätepiste on rajoitettu `10` pyyntöön päivässä.

Liite on `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz`:n pienimuotoinen muoto, ja itse sähköpostiviesti sisältää lyhyen yhteenvedon noudetuista lokeista. Voit myös ladata lokit milloin tahansa osoitteesta [Oma tili → Lokit](/my-account/logs).

> `GET /v1/logs/download`

| Kyselymerkkijonojen parametrit | Pakollinen | Tyyppi | Kuvaus |
| --------------------- | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | Ei | Merkkijono (FQDN) | Suodata lokit täysin pätevän verkkotunnuksen ("FQDN") mukaan. Jos et anna tätä, kaikkien verkkotunnusten kaikki lokit noudetaan. |
| `q` | Ei | Jousi | Hae lokeja sähköpostiosoitteen, verkkotunnuksen, aliaksen, IP-osoitteen tai päivämäärän mukaan (muoto `M/Y`, `M/D/YY`, `M-D`, `M-D-YY` tai `M.D.YY`). |
| `bounce_category` | Ei | Jousi | Hae lokeja tietyn palautusluokan mukaan (esim. `blocklist`). |
| `response_code` | Ei | Määrä | Hae lokeja tietyn virhevastauskoodin perusteella (esim. `421` tai `550`). |

> Esimerkkipyyntö:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> Esimerkki Cron-työstä (joka päivä keskiyöllä):

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

Huomaa, että voit käyttää palveluita, kuten [Crontab.guru](https://crontab.guru/), cron-työlausekkeen syntaksin validointiin.

> Esimerkki Cron-työstä (joka päivä keskiyöllä **ja edellisen päivän lokit**):

MacOS-käyttöjärjestelmälle:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date -v-1d -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

Linuxille ja Ubuntulle:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date --date "-1 days" -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

## Tili {#account}

### Luo tili {#create-account}

> `POST /v1/account`

| Kehon parametri | Pakollinen | Tyyppi | Kuvaus |
| -------------- | -------- | -------------- | ------------- |
| `email` | Kyllä | Merkkijono (sähköpostiosoite) | Sähköpostiosoite |
| `password` | Kyllä | Jousi | Salasana |

> Esimerkkipyyntö:

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### Nouda tili {#retrieve-account}

> `GET /v1/account`

> Esimerkkipyyntö:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### Päivitä tili {#update-account}

> `PUT /v1/account`

| Kehon parametri | Pakollinen | Tyyppi | Kuvaus |
| -------------- | -------- | -------------- | -------------------- |
| `email` | Ei | Merkkijono (sähköpostiosoite) | Sähköpostiosoite |
| `given_name` | Ei | Jousi | Etunimi |
| `family_name` | Ei | Jousi | Sukunimi |
| `avatar_url` | Ei | Merkkijono (URL-osoite) | Linkki avatar-kuvaan |

> Esimerkkipyyntö:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

## Alias-yhteystiedot (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> Toisin kuin muut API-päätepisteet, nämä vaativat perusvaltuutusotsikoiksi [Todennus](#authentication) "käyttäjätunnus", joka on sama kuin aliaksen käyttäjätunnus, ja "salasanan", joka on sama kuin aliaksen luoma salasana.

> \[!WARNING]
> Tämä päätepisteosio on keskeneräinen ja julkaistaan (toivottavasti) vuonna 2024. Käytä sillä välin IMAP-asiakasohjelmaa verkkosivustomme navigoinnin "Sovellukset"-alasvetovalikosta.

### Listaa yhteystiedot {#list-contacts}

> `GET /v1/contacts`

**Tulossa pian**

### Luo yhteystieto {#create-contact}

> `POST /v1/contacts`

**Tulossa pian**

### Hae yhteystieto {#retrieve-contact}

> `GET /v1/contacts/:id`

**Tulossa pian**

### Päivitä yhteystieto {#update-contact}

> `PUT /v1/contacts/:id`

**Tulossa pian**

### Poista yhteystieto {#delete-contact}

> `DELETE /v1/contacts/:id`

**Tulossa pian**

## Alias-kalenterit (CalDAV) {#alias-calendars-caldav}

> \[!NOTE]
> Toisin kuin muut API-päätepisteet, nämä vaativat perusvaltuutusotsikoiksi [Todennus](#authentication) "käyttäjätunnus", joka on sama kuin aliaksen käyttäjätunnus, ja "salasanan", joka on sama kuin aliaksen luoma salasana.

> \[!WARNING]
> Tämä päätepisteosio on keskeneräinen ja julkaistaan (toivottavasti) vuonna 2024. Käytä sillä välin IMAP-asiakasohjelmaa verkkosivustomme navigoinnin "Sovellukset"-alasvetovalikosta.

### Listaa kalenterit {#list-calendars}

> `GET /v1/calendars`

**Tulossa pian**

### Luo kalenteri {#create-calendar}

> `POST /v1/calendars`

**Tulossa pian**

### Hae kalenteri {#retrieve-calendar}

> `GET /v1/calendars/:id`

**Tulossa pian**

### Päivitä kalenteri {#update-calendar}

> `PUT /v1/calendars/:id`

**Tulossa pian**

### Poista kalenteri {#delete-calendar}

> `DELETE /v1/calendars/:id`

**Tulossa pian**

## Alias-viestit (IMAP/POP3) {#alias-messages-imappop3}

> \[!NOTE]
> Toisin kuin muut API-päätepisteet, nämä vaativat perusvaltuutusotsikoiksi [Todennus](#authentication) "käyttäjätunnus", joka on sama kuin aliaksen käyttäjätunnus, ja "salasanan", joka on sama kuin aliaksen luoma salasana.

> \[!WARNING]
> Tämä päätepisteosio on keskeneräinen ja julkaistaan (toivottavasti) vuonna 2024. Käytä sillä välin IMAP-asiakasohjelmaa verkkosivustomme navigoinnin "Sovellukset"-alasvetovalikosta.

Varmista, että olet noudattanut verkkotunnuksesi asennusohjeita.

Nämä ohjeet löytyvät usein kysyttyjen kysymysten osiostamme [Tuetteko sähköpostin vastaanottamista IMAP-protokollan kautta?](/faq#do-you-support-receiving-email-with-imap).

### Listaa ja etsii viestejä {#list-and-search-for-messages}

> `GET /v1/messages`

**Tulossa pian**

### Luo viesti {#create-message}

> \[!NOTE]
> Tämä **EI** lähetä sähköpostia – se vain lisää viestin postilaatikkoosi (esim. tämä on samanlainen kuin IMAP `APPEND` -komento). Jos haluat lähettää sähköpostia, katso [Luo lähtevä SMTP-sähköposti](#create-outbound-smtp-email) alla. Kun olet luonut lähtevän SMTP-sähköpostin, voit liittää sen kopion aliaksesi postilaatikkoon tallennusta varten tämän päätepisteen avulla.

> `POST /v1/messages`

**Tulossa pian**

### Nouda viesti {#retrieve-message}

> `GET /v1/messages/:id`

**Tulossa pian**

### Päivitysviesti {#update-message}

> `PUT /v1/messages/:id`

**Tulossa pian**

### Poista viesti {#delete-message}

> `DELETE /v1/messages:id`

**Tulossa pian**

## Alias-kansiot (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> Kansioiden päätepisteet, joiden päätepisteenä on kansion polku <code>/v1/folders/:path</code>, ovat keskenään vaihdettavissa kansion tunnuksen <code>:id</code> kanssa. Tämä tarkoittaa, että voit viitata kansioon joko sen <code>path</code>- tai <code>id</code>-arvolla.

> \[!WARNING]
> Tämä päätepisteosio on keskeneräinen ja julkaistaan (toivottavasti) vuonna 2024. Käytä sillä välin IMAP-asiakasohjelmaa verkkosivustomme navigoinnin "Sovellukset"-alasvetovalikosta.

### Listaa kansiot {#list-folders}

> `GET /v1/folders`

**Tulossa pian**

### Luo kansio {#create-folder}

> `POST /v1/folders`

**Tulossa pian**

### Nouda kansio {#retrieve-folder}

> `GET /v1/folders/:id`

**Tulossa pian**

### Päivitä kansio {#update-folder}

> `PUT /v1/folders/:id`

**Tulossa pian**

### Poista kansio {#delete-folder}

> `DELETE /v1/folders/:id`

**Tulossa pian**

### Kopioi kansio {#copy-folder}

> `POST /v1/folders/:id/copy`

**Tulossa pian**

## Lähtevät sähköpostit {#outbound-emails}

Varmista, että olet noudattanut verkkotunnuksesi asennusohjeita.

Nämä ohjeet löytyvät osoitteesta [Oma tili → Verkkotunnukset → Asetukset → Lähtevän SMTP:n asetukset](/my-account/domains). Sinun on varmistettava, että DKIM, Return-Path ja DMARC on määritetty lähtevän SMTP-viestin lähettämistä varten verkkotunnuksesi kautta.

### Hae lähtevän SMTP-sähköpostin rajoitus {#get-outbound-smtp-email-limit}

Tämä on yksinkertainen päätepiste, joka palauttaa JSON-objektin, joka sisältää `count`- ja `limit`-arvot päivittäisten SMTP-lähtevien viestien määrälle tilikohtaisesti.

> `GET /v1/emails/limit`

> Esimerkkipyyntö:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### Listaa lähtevät SMTP-sähköpostit {#list-outbound-smtp-emails}

Huomaa, että tämä päätepiste ei palauta sähköpostin `message`-, `headers`- eikä `rejectedErrors`-ominaisuuksien arvoja.

Palauttaaksesi nämä ominaisuudet ja niiden arvot, käytä [Hae sähköposti](#retrieve-email)-päätepistettä ja sähköpostiosoitetta.

> `GET /v1/emails`

| Kyselymerkkijonojen parametrit | Pakollinen | Tyyppi | Kuvaus |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | Ei | Merkkijono (Regulaarilauseke tuettu) | Hae sähköposteja metatietojen perusteella |
| `domain` | Ei | Merkkijono (Regulaarilauseke tuettu) | Hae sähköposteja verkkotunnuksen perusteella |
| `sort` | Ei | Jousi | Lajittele tietyn kentän mukaan (lisää etuliite yhdellä yhdysmerkillä `-` lajitellaksesi kentän käänteiseen suuntaan). Oletusarvo on `created_at`, jos sitä ei ole asetettu. |
| `page` | Ei | Määrä | Katso lisätietoja osoitteesta [Pagination](#pagination) |
| `limit` | Ei | Määrä | Katso lisätietoja osoitteesta [Pagination](#pagination) |

> Esimerkkipyyntö:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### Luo lähtevä SMTP-sähköposti {#create-outbound-smtp-email}

Sähköpostin luomiseen tarkoitettu API-rajapintamme on saanut inspiraationsa Nodemailerin viestiasetusten määrityksistä ja hyödyntää niitä. Käytä [Nodemailer-viestin konfigurointi](https://nodemailer.com/message/)-muuttujaa kaikkien alla olevien tekstiparametrien määrittämiseksi.

Huomaa, että `envelope`:aa ja `dkim`:tä lukuun ottamatta (koska asetamme ne automaattisesti puolestasi) tuemme kaikkia Nodemailer-asetuksia. Asetamme `disableFileAccess`- ja `disableUrlAccess`-asetuksiksi automaattisesti `true` turvallisuussyistä.

Sinun tulisi joko antaa `raw`-niminen yksittäinen asetus raakasähköpostisi kanssa, joka sisältää otsikot, **tai** antaa yksittäiset alla olevat runkoparametrit.

Tämä API-päätepiste koodaa emojeja automaattisesti, jos niitä löytyy otsikoista (esim. otsikkorivi `Subject: 🤓 Hello` muunnetaan automaattisesti muotoon `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello`). Tavoitteenamme oli luoda erittäin kehittäjäystävällinen ja testeiltä suojattu sähköposti-API.

> `POST /v1/emails`

| Kehon parametri | Pakollinen | Tyyppi | Kuvaus |
| ---------------- | -------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from` | Ei | Merkkijono (sähköpostiosoite) | Lähettäjän sähköpostiosoite (sen on oltava verkkotunnuksen alias). |
| `to` | Ei | Merkkijono tai taulukko | Pilkuilla erotettu luettelo tai vastaanottajien taulukko "Vastaanottaja"-otsikolle. |
| `cc` | Ei | Merkkijono tai taulukko | Pilkuilla erotettu luettelo tai vastaanottajien taulukko "Kopio"-otsikolle. |
| `bcc` | Ei | Merkkijono tai taulukko | Pilkuilla erotettu luettelo tai vastaanottajien taulukko "Piilokopio"-otsikolle. |
| `subject` | Ei | Jousi | Sähköpostin aihe. |
| `text` | Ei | Merkkijono tai puskuri | Viestin selkokielinen versio. |
| `html` | Ei | Merkkijono tai puskuri | Viestin HTML-versio. |
| `attachments` | Ei | Taulukko | Liitetiedostojen objekteja sisältävä taulukko (katso [Nodemailer's common fields](https://nodemailer.com/message/#common-fields)). |
| `sender` | Ei | Jousi | "Lähettäjä"-otsikon sähköpostiosoite (katso [Nodemailer's more advanced fields](https://nodemailer.com/message/#more-advanced-fields)). |
| `replyTo` | Ei | Jousi | "Vastaa"-otsikon sähköpostiosoite. |
| `inReplyTo` | Ei | Jousi | Viestin ID, johon viesti on vastaus. |
| `references` | Ei | Merkkijono tai taulukko | Välilyönneillä erotettu luettelo tai viestitunnusten taulukko. |
| `attachDataUrls` | Ei | Totuusarvo | Jos `true`, se muuntaa viestin HTML-sisällössä olevat `data:` kuvat upotetuiksi liitteiksi. |
| `watchHtml` | Ei | Jousi | Viestin Apple Watchille tarkoitettu HTML-versio ([according to the Nodemailer docs](https://nodemailer.com/message/#content-options]), uusimmat kellot eivät vaadi tämän asettamista). |
| `amp` | Ei | Jousi | Viestin AMP4EMAIL-kohtainen HTML-versio (katso [Nodemailer's example](https://nodemailer.com/message/#amp-example)). |
| `icalEvent` | Ei | Esine | iCalendar-tapahtuma, jota käytetään vaihtoehtoisena viestisisältönä (katso [Nodemailer's calendar events](https://nodemailer.com/message/calendar-events/)). |
| `alternatives` | Ei | Taulukko | Vaihtoehtoisen viestisisällön taulukko (katso [Nodemailer's alternative content](https://nodemailer.com/message/alternatives/)). |
| `encoding` | Ei | Jousi | Tekstin ja HTML-merkkijonojen koodaus (oletusarvo on `"utf-8"`, mutta tukee myös `"hex"` ja `"base64"` koodausarvoja). |
| `raw` | Ei | Merkkijono tai puskuri | Käytettävä mukautettu RFC822-muotoiltu viesti (Nodemailerin luoman viestin sijaan – katso [Nodemailer's custom source](https://nodemailer.com/message/custom-source/)). |
| `textEncoding` | Ei | Jousi | Tekstiarvoille pakotettu koodaus (joko `"quoted-printable"` tai `"base64"`). Oletusarvo on lähimpänä havaittu arvo (ASCII-merkistössä käytä `"quoted-printable"`). |
| `priority` | Ei | Jousi | Sähköpostin prioriteettitaso (voi olla joko `"high"`, `"normal"` (oletus) tai `"low"`). Huomaa, että arvo `"normal"` ei aseta prioriteettiotsikkoa (tämä on oletusarvo). Jos arvo `"high"` tai `"low"` on asetettu, niin `X-Priority`, `X-MSMail-Priority` ja `Importance` -otsikot ovat [will be set accordingly](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers` | Ei | Objekti tai taulukko | Objekti tai taulukko lisäotsikkokentistä, jotka asetetaan (katso [Nodemailer's custom headers](https://nodemailer.com/message/custom-headers/)). |
| `messageId` | Ei | Jousi | Valinnainen Message-ID-arvo "Message-ID"-otsikolle (oletusarvo luodaan automaattisesti, jos sitä ei aseteta – huomaa, että arvon tulisi olla [adhere to the RFC2822 specification](https://stackoverflow.com/a/4031705)). |
| `date` | Ei | Merkkijono tai päivämäärä | Valinnainen päivämääräarvo, jota käytetään, jos päivämääräotsikko puuttuu jäsentämisen jälkeen. Muussa tapauksessa käytetään nykyistä UTC-merkkijonoa, jos sitä ei ole asetettu. Päivämääräotsikko ei voi olla yli 30 päivää nykyistä aikaa edellä. |
| `list` | Ei | Esine | Valinnainen `List-*` -otsikoiden objekti (katso [Nodemailer's list headers](https://nodemailer.com/message/list-headers/)). |

> Esimerkkipyyntö:

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Esimerkkipyyntö:

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### Nouda lähtevä SMTP-sähköposti {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> Esimerkkipyyntö:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### Poista lähtevä SMTP-sähköposti {#delete-outbound-smtp-email}

Sähköpostin poistaminen asettaa tilan arvoon `"rejected"` (eikä sitä myöhemmin käsitellä jonossa) vain ja ainoastaan, jos nykyinen tila on jokin seuraavista: `"pending"`, `"queued"` tai `"deferred"`. Saatamme poistaa sähköposteja automaattisesti 30 päivän kuluttua niiden luomisesta ja/tai lähettämisestä – siksi sinun tulee säilyttää kopio lähtevistä SMTP-sähköposteista sähköpostiohjelmassasi, tietokannassasi tai sovelluksessasi. Voit halutessasi viitata sähköpostitunnukseemme tietokannassasi – tämä arvo palautetaan sekä [Luo sähköposti](#create-email)- että [Hae sähköposti](#retrieve-email)-päätepisteistä.

> `DELETE /v1/emails/:id`

> Esimerkkipyyntö:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

## Verkkotunnukset {#domains}

> \[!TIP]
> Verkkotunnusten päätepisteet, joiden päätepisteenä on verkkotunnuksen nimi <code>/v1/domains/:domain_name</code>, ovat keskenään vaihdettavissa verkkotunnuksen tunnuksen <code>:domain_id</code> kanssa. Tämä tarkoittaa, että voit viitata verkkotunnukseen joko sen <code>name</code>- tai <code>id</code>-arvolla.

### Listaa verkkotunnukset {#list-domains}

> \[!NOTE]
> 1. marraskuuta 2024 alkaen [Listaa verkkotunnukset](#list-domains):n ja [Listaa verkkotunnusaliakset](#list-domain-aliases):n API-päätepisteiden oletusarvo on `1000`, jonka enimmäistulosmäärä sivua kohden on TEMP_PLACEHOLDER. Jos haluat ottaa tämän käyttöön jo aiemmin, voit välittää `?paginate=true`:n lisäkyselymerkkijonoparametrina päätepistekyselyn URL-osoitteeseen. Lisätietoja on kohdassa [Sivunumerointi](#pagination).

> `GET /v1/domains`

| Kyselymerkkijonojen parametrit | Pakollinen | Tyyppi | Kuvaus |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | Ei | Merkkijono (Regulaarilauseke tuettu) | Hae verkkotunnuksia nimen perusteella |
| `name` | Ei | Merkkijono (Regulaarilauseke tuettu) | Hae verkkotunnuksia nimen perusteella |
| `sort` | Ei | Jousi | Lajittele tietyn kentän mukaan (lisää etuliite yhdellä yhdysmerkillä `-` lajitellaksesi kentän käänteiseen suuntaan). Oletusarvo on `created_at`, jos sitä ei ole asetettu. |
| `page` | Ei | Määrä | Katso lisätietoja osoitteesta [Pagination](#pagination) |
| `limit` | Ei | Määrä | Katso lisätietoja osoitteesta [Pagination](#pagination) |

> Esimerkkipyyntö:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### Luo verkkotunnus {#create-domain}

> `POST /v1/domains`

| Kehon parametri | Pakollinen | Tyyppi | Kuvaus |
| ------------------------------ | -------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | Kyllä | Merkkijono (FQDN tai IP) | Täydellinen verkkotunnusnimi ("FQDN") tai IP-osoite |
| `team_domain` | Ei | Merkkijono (verkkotunnustunnus tai verkkotunnusnimi; FQDN) | Määritä tämä verkkotunnus automaattisesti samalle tiimille toisesta verkkotunnuksesta. Tämä tarkoittaa, että kaikki tämän verkkotunnuksen jäsenet määritetään tiimin jäseniksi ja `plan` asetetaan automaattisesti myös arvoon `team`. Voit asettaa arvoksi `"none"` tarvittaessa poistaaksesi tämän nimenomaisesti käytöstä, mutta se ei ole välttämätöntä. |
| `plan` | Ei | Merkkijono (luetteloitava) | Sopimuksen tyyppi (täytyy olla `"free"`, `"enhanced_protection"` tai `"team"`, oletusarvo on `"free"` tai käyttäjän nykyinen maksullinen sopimus, jos sellainen on) |
| `catchall` | Ei | Merkkijono (erotelluilla merkeillä sähköpostiosoitteet) tai totuusarvo | Luo oletusarvoinen keräilyalias, jonka oletusarvo on `true` (jos `true`, vastaanottajana käytetään API-käyttäjän sähköpostiosoitetta, ja jos `false`, keräilyaliasta ei luoda). Jos merkkijono annetaan, se on eroteltu luettelo sähköpostiosoitteista, joita käytetään vastaanottajina (eroteltuna rivinvaihdolla, välilyönnillä ja/tai pilkulla). |
| `has_adult_content_protection` | Ei | Totuusarvo | Otetaanko käyttöön roskapostiskannerin aikuisille suunnatun sisällön suojaus tällä verkkotunnuksella |
| `has_phishing_protection` | Ei | Totuusarvo | Otetaanko roskapostiskannerin tietojenkalastelusuoja käyttöön tässä verkkotunnuksessa |
| `has_executable_protection` | Ei | Totuusarvo | Otetaanko käyttöön Roskapostiskannerin suoritettavan tiedoston suojaus tällä verkkotunnuksella |
| `has_virus_protection` | Ei | Totuusarvo | Otetaanko käyttöön roskapostiskannerin virustorjunta tässä verkkotunnuksessa |
| `has_recipient_verification` | Ei | Totuusarvo | Globaali toimialueen oletusasetus sille, vaaditaanko aliasvastaanottajilta sähköpostin vahvistuslinkin napsauttamista sähköpostien kulkemiseksi |
| `ignore_mx_check` | Ei | Totuusarvo | Ohitetaanko MX-tietueen tarkistus verkkotunnuksessa vahvistusta varten. Tämä koskee pääasiassa käyttäjiä, joilla on edistyneet MX-vaihdon määrityssäännöt ja joiden on säilytettävä nykyinen MX-vaihdonsa ja lähetettävä tiedot meille. |
| `retention_days` | Ei | Määrä | Kokonaisluku välillä `0` ja `30`, joka vastaa säilytyspäivien määrää, jonka ajan lähtevät SMTP-sähköpostit tallennetaan onnistuneen toimituksen tai pysyvän virheen jälkeen. Oletusarvo on `0`, mikä tarkoittaa, että lähtevät SMTP-sähköpostit poistetaan ja sensuroidaan välittömästi turvallisuussyistä. |
| `bounce_webhook` | Ei | Merkkijono (URL) tai totuusarvo (false) | Valitsemasi `http://` tai `https://` webhookin URL-osoite, johon palautuswebhookit lähetetään. Lähetämme tähän URL-osoitteeseen `POST` -pyynnön, joka sisältää tietoja lähtevän SMTP-viestinnän epäonnistumisista (esim. ohjelmisto- tai hard-virheet – jotta voit hallita tilaajiasi ja lähtevää sähköpostiasi ohjelmallisesti). |
| `max_quota_per_alias` | Ei | Jousi | Tämän verkkotunnuksen aliaksien tallennuskiintiö. Anna arvo, kuten "1 Gt", jonka [bytes](https://github.com/visionmedia/bytes.js) jäsentää. |

> Esimerkkipyyntö:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### Hae verkkotunnus {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> Esimerkkipyyntö:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Vahvista verkkotunnustietueet {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Esimerkkipyyntö:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### Vahvista verkkotunnuksen SMTP-tietueet {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> Esimerkkipyyntö:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### Listaa koko verkkotunnuksen kattavat yleiset salasanat {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> Esimerkkipyyntö:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Luo koko verkkotunnuksen kattava yleissalasana {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Kehon parametri | Pakollinen | Tyyppi | Kuvaus |
| -------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | Ei | Jousi | Uusi mukautettu salasanasi, jota käytetään koko verkkotunnuksen kattavana keräilysalasanana. Huomaa, että voit jättää tämän tyhjäksi tai puuttua kokonaan API-pyyntösi rungosta, jos haluat satunnaisesti luodun ja vahvan salasanan. |
| `description` | Ei | Jousi | Kuvaus vain organisointitarkoituksiin. |

> Esimerkkipyyntö:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Poista koko verkkotunnuksen kattava yleissalasana {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> Esimerkkipyyntö:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### Päivitä verkkotunnus {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| Kehon parametri | Pakollinen | Tyyppi | Kuvaus |
| ------------------------------ | -------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port` | Ei | Merkkijono tai numero | Mukautettu portti SMTP-edelleenlähetystä varten (oletus on `"25"`) |
| `has_adult_content_protection` | Ei | Totuusarvo | Otetaanko käyttöön roskapostiskannerin aikuisille suunnatun sisällön suojaus tällä verkkotunnuksella |
| `has_phishing_protection` | Ei | Totuusarvo | Otetaanko roskapostiskannerin tietojenkalastelusuoja käyttöön tässä verkkotunnuksessa |
| `has_executable_protection` | Ei | Totuusarvo | Otetaanko käyttöön Roskapostiskannerin suoritettavan tiedoston suojaus tällä verkkotunnuksella |
| `has_virus_protection` | Ei | Totuusarvo | Otetaanko käyttöön roskapostiskannerin virustorjunta tässä verkkotunnuksessa |
| `has_recipient_verification` | Ei | Totuusarvo | Globaali toimialueen oletusasetus sille, vaaditaanko aliasvastaanottajilta sähköpostin vahvistuslinkin napsauttamista sähköpostien kulkemiseksi |
| `ignore_mx_check` | Ei | Totuusarvo | Ohitetaanko MX-tietueen tarkistus verkkotunnuksessa vahvistusta varten. Tämä koskee pääasiassa käyttäjiä, joilla on edistyneet MX-vaihdon määrityssäännöt ja joiden on säilytettävä nykyinen MX-vaihdonsa ja lähetettävä tiedot meille. |
| `retention_days` | Ei | Määrä | Kokonaisluku välillä `0` ja `30`, joka vastaa säilytyspäivien määrää, jonka ajan lähtevät SMTP-sähköpostit tallennetaan onnistuneen toimituksen tai pysyvän virheen jälkeen. Oletusarvo on `0`, mikä tarkoittaa, että lähtevät SMTP-sähköpostit poistetaan ja sensuroidaan välittömästi turvallisuussyistä. |
| `bounce_webhook` | Ei | Merkkijono (URL) tai totuusarvo (false) | Valitsemasi `http://` tai `https://` webhookin URL-osoite, johon palautuswebhookit lähetetään. Lähetämme tähän URL-osoitteeseen `POST` -pyynnön, joka sisältää tietoja lähtevän SMTP-viestinnän epäonnistumisista (esim. ohjelmisto- tai hard-virheet – jotta voit hallita tilaajiasi ja lähtevää sähköpostiasi ohjelmallisesti). |
| `max_quota_per_alias` | Ei | Jousi | Tämän verkkotunnuksen aliaksien tallennuskiintiö. Anna arvo, kuten "1 Gt", jonka [bytes](https://github.com/visionmedia/bytes.js) jäsentää. |

> Esimerkkipyyntö:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Poista verkkotunnus {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> Esimerkkipyyntö:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```

## Kutsuu {#invites}

### Hyväksy verkkotunnuskutsu {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> Esimerkkipyyntö:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### Luo verkkotunnuskutsu {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| Kehon parametri | Pakollinen | Tyyppi | Kuvaus |
| -------------- | -------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `email` | Kyllä | Merkkijono (sähköpostiosoite) | Sähköpostiosoite, johon haluat kutsua verkkotunnuksen jäsenluetteloon |
| `group` | Kyllä | Merkkijono (luetteloitava) | Ryhmä, johon käyttäjä lisätään verkkotunnusjäsenyyteen (voi olla joko `"admin"` tai `"user"`) |

> Esimerkkipyyntö:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> Jos kutsuttava käyttäjä on jo hyväksytty jäsen jollakin muulla verkkotunnuksella, johon kutsun lähettänyt ylläpitäjä kuuluu, kutsu hyväksytään automaattisesti eikä sähköpostia lähetetä.

### Poista verkkotunnuskutsu {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| Kehon parametri | Pakollinen | Tyyppi | Kuvaus |
| -------------- | -------- | -------------- | ------------------------------------------------ |
| `email` | Kyllä | Merkkijono (sähköpostiosoite) | Verkkotunnuksen jäsenluettelosta poistettava sähköpostiosoite |

> Esimerkkipyyntö:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

## Jäsenet {#members}

### Päivitä verkkotunnuksen jäsen {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Kehon parametri | Pakollinen | Tyyppi | Kuvaus |
| -------------- | -------- | ------------------- | -------------------------------------------------------------------------------------------- |
| `group` | Kyllä | Merkkijono (luetteloitava) | Ryhmä, johon käyttäjä päivitetään verkkotunnusjäsenyydeksi (voi olla joko `"admin"` tai `"user"`) |

> Esimerkkipyyntö:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### Poista verkkotunnuksen jäsen {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> Esimerkkipyyntö:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```

## Aliakset {#aliases}

### Luo aliassalasana {#generate-an-alias-password}

Huomaa, että jos et lähetä ohjeita sähköpostitse, käyttäjätunnus ja salasana löytyvät onnistuneen pyynnön JSON-vastauksen rungosta muodossa `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }`.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Kehon parametri | Pakollinen | Tyyppi | Kuvaus |
| ---------------------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | Ei | Jousi | Uusi mukautettu salasanasi aliasta varten. Huomaa, että voit jättää tämän tyhjäksi tai puuttua kokonaan API-pyyntösi rungosta, jos haluat satunnaisesti luodun ja vahvan salasanan. |
| `password` | Ei | Jousi | Aliaksen nykyinen salasana, jos haluat vaihtaa salasanan poistamatta olemassa olevaa IMAP-postilaatikon tallennustilaa (katso `is_override` -vaihtoehto alla, jos sinulla ei enää ole nykyistä salasanaa). |
| `is_override` | Ei | Totuusarvo | **KÄYTÄ VAROVASTI**: Tämä ohittaa olemassa olevan aliaksen salasanan ja tietokannan kokonaan ja poistaa pysyvästi olemassa olevan IMAP-tallennustilan ja nollaa aliaksen SQLite-sähköpostitietokannan kokonaan. Tee varmuuskopio, jos mahdollista, jos sinulla on olemassa oleva postilaatikko liitettynä tähän aliakseen. |
| `emailed_instructions` | Ei | Jousi | Sähköpostiosoite, johon lähetetään aliaksen salasana ja asennusohjeet. |

> Esimerkkipyyntö:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### Listaa verkkotunnusaliakset {#list-domain-aliases}

> \[!NOTE]
> 1. marraskuuta 2024 alkaen [Listaa verkkotunnukset](#list-domains):n ja [Listaa verkkotunnusaliakset](#list-domain-aliases):n API-päätepisteiden oletusarvo on `1000`, jonka enimmäistulosmäärä sivua kohden on TEMP_PLACEHOLDER. Jos haluat ottaa tämän käyttöön jo aiemmin, voit välittää `?paginate=true`:n lisäkyselymerkkijonoparametrina päätepistekyselyn URL-osoitteeseen. Lisätietoja on kohdassa [Sivunumerointi](#pagination).

> `GET /v1/domains/DOMAIN_NAME/aliases`

| Kyselymerkkijonojen parametrit | Pakollinen | Tyyppi | Kuvaus |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | Ei | Merkkijono (Regulaarilauseke tuettu) | Hae aliaksia verkkotunnuksesta nimen, tunnisteen tai vastaanottajan perusteella |
| `name` | Ei | Merkkijono (Regulaarilauseke tuettu) | Hae aliaksia verkkotunnuksesta nimen perusteella |
| `recipient` | Ei | Merkkijono (Regulaarilauseke tuettu) | Etsi aliaksia verkkotunnuksesta vastaanottajan mukaan |
| `sort` | Ei | Jousi | Lajittele tietyn kentän mukaan (lisää etuliite yhdellä yhdysmerkillä `-` lajitellaksesi kentän käänteiseen suuntaan). Oletusarvo on `created_at`, jos sitä ei ole asetettu. |
| `page` | Ei | Määrä | Katso lisätietoja osoitteesta [Pagination](#pagination) |
| `limit` | Ei | Määrä | Katso lisätietoja osoitteesta [Pagination](#pagination) |

> Esimerkkipyyntö:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### Luo uusi verkkotunnusalias {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| Kehon parametri | Pakollinen | Tyyppi | Kuvaus |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | Ei | Jousi | Alias-nimi (jos sitä ei anneta tai jos se on tyhjä, luodaan satunnainen alias) |
| `recipients` | Ei | Merkkijono tai taulukko | Vastaanottajien luettelo (erottelema rivinvaihdolla/välilyönnillä/pilkulla merkkijono tai taulukko, joka sisältää kelvollisia sähköpostiosoitteita, täysin hyväksyttyjä verkkotunnuksia ("FQDN"), IP-osoitteita ja/tai webhook-URL-osoitteita – jos niitä ei ole annettu tai taulukko on tyhjä, API-pyynnön tehneen käyttäjän sähköpostiosoite asetetaan vastaanottajaksi) |
| `description` | Ei | Jousi | Alias-kuvaus |
| `labels` | Ei | Merkkijono tai taulukko | Tunnisteiden luettelo (erotettava rivinvaihdolla/välilyönnillä/pilkulla merkkijono tai taulukko) |
| `has_recipient_verification` | Ei | Totuusarvo | Vaadi vastaanottajia napsauttamaan sähköpostiosoitteen vahvistuslinkkiä, jotta sähköpostit kulkevat eteenpäin (oletuksena käytetään verkkotunnuksen asetuksia, jos niitä ei ole erikseen määritetty pyynnön rungossa) |
| `is_enabled` | Ei | Totuusarvo | Otetaanko tämä alias käyttöön vai poistetaanko se käytöstä (jos poistettu käytöstä, sähköpostit reititetään mihinkään, mutta ne palauttavat onnistumisen tilakoodit). Jos arvo annetaan, se muunnetaan totuusarvoksi käyttämällä [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `error_code_if_disabled` | Ei | Numero (joko `250`, `421` tai `550`) | Tälle aliakselle saapuvat sähköpostit hylätään, jos `is_enabled` on `false` ja siinä on joko `250` (ei toimita hiljaisesti minnekään, esim. mustaan aukkoon tai `/dev/null`), `421` (pehmeä hylkäys; ja uudelleenyritys jopa ~5 päivän ajan) tai `550` pysyvä epäonnistuminen ja hylkäys. Oletusarvo on `250`. |
| `has_imap` | Ei | Totuusarvo | Otetaanko IMAP-tallennus käyttöön vai poistetaanko se käytöstä tälle aliakselle (jos se ei ole käytössä, saapuvia sähköposteja ei tallenneta soluun [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service). Jos arvo annetaan, se muunnetaan totuusarvoksi käyttämällä solua [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `has_pgp` | Ei | Totuusarvo | Otetaanko käyttöön vai poistetaanko käytöstä [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) solulle [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) käyttäen aliasta `public_key`. |
| `public_key` | Ei | Jousi | OpenPGP:n julkinen avain ASCII Armor -muodossa ([click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); esim. GPG-avain solulle `support@forwardemail.net`). Tämä pätee vain, jos `has_pgp` on asetettu arvoon `true`. [Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota` | Ei | Jousi | Tämän aliaksen tallennuskiintiön enimmäismäärä. Jätä tyhjäksi palauttaaksesi verkkotunnuksen nykyisen enimmäiskiintiön tai anna arvo, kuten "1 Gt", jonka [bytes](https://github.com/visionmedia/bytes.js) jäsentää. Vain verkkotunnuksen järjestelmänvalvojat voivat muuttaa tätä arvoa. |
| `vacation_responder_is_enabled` | Ei | Totuusarvo | Otetaanko automaattinen lomaviesti käyttöön vai poistetaanko se käytöstä. |
| `vacation_responder_start_date` | Ei | Jousi | Lomaviestin aloituspäivämäärä (jos käytössä eikä aloituspäivämäärää ole asetettu, oletetaan, että se on jo käynnistetty). Tuemme päivämäärämuotoja, kuten `MM/DD/YYYY`, `YYYY-MM-DD` ja muita päivämäärämuotoja älykkään jäsentämisen avulla käyttäen `dayjs`. |
| `vacation_responder_end_date` | Ei | Jousi | Lomaviestin päättymispäivämäärä (jos käytössä eikä päättymispäivämäärää ole asetettu, oletetaan, että viesti ei lopu koskaan ja että se vastaa ikuisesti). Tuemme päivämäärämuotoja, kuten `MM/DD/YYYY`, `YYYY-MM-DD` ja muita päivämäärämuotoja älykkään jäsentämisen avulla käyttäen `dayjs`. |
| `vacation_responder_subject` | Ei | Jousi | Lomaviestin aihe selkokielisenä, esim. "Poissa toimistolta". Käytämme `striptags` poistaaksemme kaiken HTML-koodin täältä. |
| `vacation_responder_message` | Ei | Jousi | Lomavastaajalle tarkoitettu selkokielinen viesti, esim. "Olen poissa toimistolta helmikuuhun asti.". Käytämme `striptags` poistaaksemme kaiken HTML:n täältä. |

> Esimerkkipyyntö:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### Hae verkkotunnuksen alias {#retrieve-domain-alias}

Voit hakea verkkotunnusaliaksen joko sen `id`- tai `name`-arvon perusteella.

> `GET /v1/domains/:domain_name/aliases/:alias_id`

> Esimerkkipyyntö:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

> `GET /v1/domains/:domain_name/aliases/:alias_name`

> Esimerkkipyyntö:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_name \
  -u API_TOKEN:
```

### Päivitä verkkotunnuksen alias {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Kehon parametri | Pakollinen | Tyyppi | Kuvaus |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | Ei | Jousi | Alias-nimi |
| `recipients` | Ei | Merkkijono tai taulukko | Vastaanottajien luettelo (erotettava rivinvaihdolla/välilyönnillä/pilkulla merkkijono tai taulukko kelvollisista sähköpostiosoitteista, täysin kelvollisista verkkotunnuksista ("FQDN"), IP-osoitteista ja/tai webhook-URL-osoitteista) |
| `description` | Ei | Jousi | Alias-kuvaus |
| `labels` | Ei | Merkkijono tai taulukko | Tunnisteiden luettelo (erotettava rivinvaihdolla/välilyönnillä/pilkulla merkkijono tai taulukko) |
| `has_recipient_verification` | Ei | Totuusarvo | Vaadi vastaanottajia napsauttamaan sähköpostiosoitteen vahvistuslinkkiä, jotta sähköpostit kulkevat eteenpäin (oletuksena käytetään verkkotunnuksen asetuksia, jos niitä ei ole erikseen määritetty pyynnön rungossa) |
| `is_enabled` | Ei | Totuusarvo | Otetaanko tämä alias käyttöön vai poistetaanko se käytöstä (jos poistettu käytöstä, sähköpostit reititetään mihinkään, mutta ne palauttavat onnistumisen tilakoodit). Jos arvo annetaan, se muunnetaan totuusarvoksi käyttämällä [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `error_code_if_disabled` | Ei | Numero (joko `250`, `421` tai `550`) | Tälle aliakselle saapuvat sähköpostit hylätään, jos `is_enabled` on `false` ja siinä on joko `250` (ei toimita hiljaisesti minnekään, esim. mustaan aukkoon tai `/dev/null`), `421` (pehmeä hylkäys; ja uudelleenyritys jopa ~5 päivän ajan) tai `550` pysyvä epäonnistuminen ja hylkäys. Oletusarvo on `250`. |
| `has_imap` | Ei | Totuusarvo | Otetaanko IMAP-tallennus käyttöön vai poistetaanko se käytöstä tälle aliakselle (jos se ei ole käytössä, saapuvia sähköposteja ei tallenneta soluun [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service). Jos arvo annetaan, se muunnetaan totuusarvoksi käyttämällä solua [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `has_pgp` | Ei | Totuusarvo | Otetaanko käyttöön vai poistetaanko käytöstä [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) solulle [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) käyttäen aliasta `public_key`. |
| `public_key` | Ei | Jousi | OpenPGP:n julkinen avain ASCII Armor -muodossa ([click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); esim. GPG-avain solulle `support@forwardemail.net`). Tämä pätee vain, jos `has_pgp` on asetettu arvoon `true`. [Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota` | Ei | Jousi | Tämän aliaksen tallennuskiintiön enimmäismäärä. Jätä tyhjäksi palauttaaksesi verkkotunnuksen nykyisen enimmäiskiintiön tai anna arvo, kuten "1 Gt", jonka [bytes](https://github.com/visionmedia/bytes.js) jäsentää. Vain verkkotunnuksen järjestelmänvalvojat voivat muuttaa tätä arvoa. |
| `vacation_responder_is_enabled` | Ei | Totuusarvo | Otetaanko automaattinen lomaviesti käyttöön vai poistetaanko se käytöstä. |
| `vacation_responder_start_date` | Ei | Jousi | Lomaviestin aloituspäivämäärä (jos käytössä eikä aloituspäivämäärää ole asetettu, oletetaan, että se on jo käynnistetty). Tuemme päivämäärämuotoja, kuten `MM/DD/YYYY`, `YYYY-MM-DD` ja muita päivämäärämuotoja älykkään jäsentämisen avulla käyttäen `dayjs`. |
| `vacation_responder_end_date` | Ei | Jousi | Lomaviestin päättymispäivämäärä (jos käytössä eikä päättymispäivämäärää ole asetettu, oletetaan, että viesti ei lopu koskaan ja että se vastaa ikuisesti). Tuemme päivämäärämuotoja, kuten `MM/DD/YYYY`, `YYYY-MM-DD` ja muita päivämäärämuotoja älykkään jäsentämisen avulla käyttäen `dayjs`. |
| `vacation_responder_subject` | Ei | Jousi | Lomaviestin aihe selkokielisenä, esim. "Poissa toimistolta". Käytämme `striptags` poistaaksemme kaiken HTML-koodin täältä. |
| `vacation_responder_message` | Ei | Jousi | Lomavastaajalle tarkoitettu selkokielinen viesti, esim. "Olen poissa toimistolta helmikuuhun asti.". Käytämme `striptags` poistaaksemme kaiken HTML:n täältä. |

> Esimerkkipyyntö:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### Poista verkkotunnuksen alias {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> Esimerkkipyyntö:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

## Salaa {#encrypt}

Voit salata tietueita jopa ilmaisversiossa täysin ilmaiseksi. Yksityisyyden ei pitäisi olla ominaisuus, vaan sen tulisi olla sisäänrakennettu osa kaikkia tuotteen ominaisuuksia. Olemme lisänneet tämän [Tietosuojaoppaiden keskustelu](https://discuss.privacyguides.net/t/forward-email-email-provider/13370)- ja [GitHub-ongelmamme](https://github.com/forwardemail/forwardemail.net/issues/254)-versioissa esitettyjen pyyntöjen mukaisesti.

### Salaa TXT-tietue {#encrypt-txt-record}

> `POST /v1/encrypt`

| Kehon parametri | Pakollinen | Tyyppi | Kuvaus |
| -------------- | -------- | ------ | -------------------------------------------- |
| `input` | Kyllä | Jousi | Mikä tahansa kelvollinen välityssähköpostin selkotekstitiedosto |

> Esimerkkipyyntö:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
