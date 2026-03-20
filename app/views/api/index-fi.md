# Sähköpostin API {#email-api}


## Sisällysluettelo {#table-of-contents}

* [Kirjastot](#libraries)
* [Perus-URI](#base-uri)
* [Todennus](#authentication)
  * [API-tunnisteen todennus (suositeltu useimmille päätepisteille)](#api-token-authentication-recommended-for-most-endpoints)
  * [Alias-tunnistetietojen todennus (lähtöviesteille)](#alias-credentials-authentication-for-outbound-email)
  * [Vain alias-päätepisteet](#alias-only-endpoints)
* [Virheet](#errors)
* [Lokalisaatio](#localization)
* [Sivutus](#pagination)
* [Lokit](#logs)
  * [Hae lokit](#retrieve-logs)
* [Tili](#account)
  * [Luo tili](#create-account)
  * [Hae tili](#retrieve-account)
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
  * [Listaa ja hae viestejä](#list-and-search-for-messages)
  * [Luo viesti](#create-message)
  * [Hae viesti](#retrieve-message)
  * [Päivitä viesti](#update-message)
  * [Poista viesti](#delete-message)
* [Alias-kansiot (IMAP/POP3)](#alias-folders-imappop3)
  * [Listaa kansiot](#list-folders)
  * [Luo kansio](#create-folder)
  * [Hae kansio](#retrieve-folder)
  * [Päivitä kansio](#update-folder)
  * [Poista kansio](#delete-folder)
  * [Kopioi kansio](#copy-folder)
* [Lähtevät sähköpostit](#outbound-emails)
  * [Hae lähtevän SMTP-sähköpostin raja](#get-outbound-smtp-email-limit)
  * [Listaa lähtevät SMTP-sähköpostit](#list-outbound-smtp-emails)
  * [Luo lähtevä SMTP-sähköposti](#create-outbound-smtp-email)
  * [Hae lähtevä SMTP-sähköposti](#retrieve-outbound-smtp-email)
  * [Poista lähtevä SMTP-sähköposti](#delete-outbound-smtp-email)
* [Domainit](#domains)
  * [Listaa domainit](#list-domains)
  * [Luo domain](#create-domain)
  * [Hae domain](#retrieve-domain)
  * [Vahvista domain-tietueet](#verify-domain-records)
  * [Vahvista domainin SMTP-tietueet](#verify-domain-smtp-records)
  * [Listaa domainin catch-all-salasanat](#list-domain-wide-catch-all-passwords)
  * [Luo domainin catch-all-salasana](#create-domain-wide-catch-all-password)
  * [Poista domainin catch-all-salasana](#remove-domain-wide-catch-all-password)
  * [Päivitä domain](#update-domain)
  * [Poista domain](#delete-domain)
* [Kutsut](#invites)
  * [Hyväksy domain-kutsu](#accept-domain-invite)
  * [Luo domain-kutsu](#create-domain-invite)
  * [Poista domain-kutsu](#remove-domain-invite)
* [Jäsenet](#members)
  * [Päivitä domainin jäsen](#update-domain-member)
  * [Poista domainin jäsen](#remove-domain-member)
* [Alias-nimet](#aliases)
  * [Luo alias-salasana](#generate-an-alias-password)
  * [Listaa domainin alias-nimet](#list-domain-aliases)
  * [Luo uusi domainin alias](#create-new-domain-alias)
  * [Hae domainin alias](#retrieve-domain-alias)
  * [Päivitä domainin alias](#update-domain-alias)
  * [Poista domainin alias](#delete-domain-alias)
* [Salaus](#encrypt)
  * [Salaa TXT-tietue](#encrypt-txt-record)


## Kirjastot {#libraries}

Tällä hetkellä emme ole vielä julkaisseet API-kääreitä, mutta aiomme tehdä sen lähitulevaisuudessa. Lähetä sähköpostia osoitteeseen <api@forwardemail.net>, jos haluat saada ilmoituksen, kun tietyn ohjelmointikielen API-kääre julkaistaan. Sillä välin voit käyttää näitä suositeltuja HTTP-pyyntökirjastoja sovelluksessasi tai yksinkertaisesti käyttää [curl](https://stackoverflow.com/a/27442239/3586413) kuten alla olevissa esimerkeissä.

| Kieli      | Kirjasto                                                               |
| ---------- | ---------------------------------------------------------------------- |
| Ruby       | [Faraday](https://github.com/lostisland/faraday)                       |
| Python     | [requests](https://github.com/psf/requests)                            |
| Java       | [OkHttp](https://github.com/square/okhttp/)                            |
| PHP        | [guzzle](https://github.com/guzzle/guzzle)                             |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (me ylläpidämme)     |
| Node.js    | [superagent](https://github.com/ladjs/superagent) (me ylläpidämme)     |
| Go         | [net/http](https://golang.org/pkg/net/http/)                           |
| .NET       | [RestSharp](https://github.com/restsharp/RestSharp)                    |
## Base URI {#base-uri}

Nykyinen HTTP-perus-URI-polku on: `BASE_URI`.


## Authentication {#authentication}

Kaikki päätepisteet vaativat todennuksen käyttäen [Basic Authorization](https://en.wikipedia.org/wiki/Basic_access_authentication). Tuemme kahta todennusmenetelmää:

### API Token Authentication (Suositeltu useimmille päätepisteille) {#api-token-authentication-recommended-for-most-endpoints}

Aseta [API-avaimesi](https://forwardemail.net/my-account/security) "käyttäjätunnus" -arvoksi tyhjällä salasanalla:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

Huomaa kaksoispiste (`:`) API-tokenin jälkeen – tämä ilmaisee tyhjän salasanan Basic Auth -muodossa.

### Alias Credentials Authentication (Lähtevälle sähköpostille) {#alias-credentials-authentication-for-outbound-email}

[Create outbound SMTP email](#create-outbound-smtp-email) -päätepiste tukee myös todennusta käyttämällä alias-sähköpostiosoitetta ja [luotua alias-salasanaa](/faq#do-you-support-receiving-email-with-imap):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@yourdomain.com:your_generated_password" \
  -d "to=recipient@example.com" \
  -d "subject=Hello" \
  -d "text=Test email"
```

Tämä menetelmä on hyödyllinen, kun lähetät sähköposteja sovelluksista, jotka jo käyttävät SMTP-tunnuksia, ja tekee siirtymisen SMTP:stä API:imme saumattomaksi.

### Alias-Only Endpoints {#alias-only-endpoints}

[Alias Contacts](#alias-contacts-carddav), [Alias Calendars](#alias-calendars-caldav), [Alias Messages](#alias-messages-imappop3) ja [Alias Folders](#alias-folders-imappop3) -päätepisteet vaativat alias-tunnukset eivätkä tue API-token-todennusta.

Älä huoli – alla on esimerkkejä, jos et ole varma, mitä tämä tarkoittaa.


## Errors {#errors}

Jos virheitä ilmenee, API-pyynnön vastausrungossa on yksityiskohtainen virheilmoitus.

| Koodi | Nimi                  |
| ---- | --------------------- |
| 200  | OK                    |
| 400  | Virheellinen pyyntö   |
| 401  | Valtuuttamaton        |
| 403  | Kielletty             |
| 404  | Ei löydy              |
| 429  | Liian monta pyyntöä   |
| 500  | Sisäinen palvelinvirhe|
| 501  | Toteuttamatta         |
| 502  | Huono välityspalvelin |
| 503  | Palvelu ei käytettävissä |
| 504  | Välityspalvelimen aikakatkaisu |

> \[!TIP]
> Jos saat 5xx-tilakoodin (jonka ei pitäisi tapahtua), ota yhteyttä osoitteeseen <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a>, niin autamme sinua ratkaisemaan ongelmasi välittömästi.


## Localization {#localization}

Palvelumme on käännetty yli 25 eri kielelle. Kaikki API-vastausviestit käännetään viimeksi havaitulle käyttäjän paikalliselle asetukselle, joka tekee API-pyynnön. Voit ohittaa tämän asettamalla mukautetun `Accept-Language` -otsikon. Kokeile vapaasti kielen valintaa tämän sivun alareunassa olevasta pudotusvalikosta.


## Pagination {#pagination}

> \[!NOTE]
> 1. marraskuuta 2024 alkaen API-päätepisteet [List domains](#list-domains) ja [List domain aliases](#list-domain-aliases) käyttävät oletuksena `1000` maksimimäärää tuloksia per sivu. Jos haluat ottaa tämän toiminnon käyttöön jo aikaisemmin, voit lisätä `?paginate=true` lisäparametrina päätepisteen URL-osoitteeseen.

Sivutus on tuettu kaikissa API-päätepisteissä, jotka listaavat tuloksia.

Anna yksinkertaisesti kyselymerkkijonon ominaisuudet `page` (ja valinnaisesti `limit`).

Ominaisuuden `page` tulee olla luku, joka on suurempi tai yhtä suuri kuin `1`. Jos annat `limit`-arvon (myös luku), sen vähimmäisarvo on `10` ja enimmäisarvo `50` (ellei toisin mainita).

| Kyselymerkkijonon parametri | Pakollinen | Tyyppi | Kuvaus                                                                                                                                                  |
| --------------------------- | ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page`                      | Ei         | Luku   | Palautettavan tulossivun numero. Jos ei määritetty, `page` on `1`. Arvon tulee olla luku, joka on suurempi tai yhtä suuri kuin `1`.                      |
| `limit`                     | Ei         | Luku   | Palautettavien tulosten määrä per sivu. Oletuksena `10`, jos ei määritetty. Arvon tulee olla luku, joka on suurempi tai yhtä suuri kuin `1` ja enintään `50`. |
Jotta voidaan määrittää, onko lisää tuloksia saatavilla, tarjoamme nämä HTTP-vastausotsikot (joita voit jäsentää ohjelmallisesti sivutusta varten):

| HTTP Response Header | Esimerkki                                                                                                                                                                                                                                                | Kuvaus                                                                                                                                                                                                                                                                                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `X-Page-Count`       | `X-Page-Count: 3`                                                                                                                                                                                                                                        | Saatavilla olevien sivujen kokonaismäärä.                                                                                                                                                                                                                                                                                                                         |
| `X-Page-Current`     | `X-Page-Current: 1`                                                                                                                                                                                                                                      | Palautettujen tulosten nykyinen sivu (esim. `page`-kyselymerkkijonoparametrin perusteella).                                                                                                                                                                                                                                                                         |
| `X-Page-Size`        | `X-Page-Size: 10`                                                                                                                                                                                                                                        | Palautetun sivun tulosten kokonaismäärä (esim. `limit`-kyselymerkkijonoparametrin ja todellisten palautettujen tulosten perusteella).                                                                                                                                                                                                                                |
| `X-Item-Count`       | `X-Item-Count: 30`                                                                                                                                                                                                                                       | Saatavilla olevien kohteiden kokonaismäärä kaikilla sivuilla.                                                                                                                                                                                                                                                                                                     |
| `Link`               | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | Tarjoamme `Link` HTTP-vastausotsikon, jonka voit jäsentää esimerkin mukaisesti. Tämä on [samankaltainen kuin GitHubissa](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (esim. kaikkia arvoja ei anneta, jos ne eivät ole merkityksellisiä tai saatavilla, esim. `"next"` ei anneta, jos seuraavaa sivua ei ole). |
> Esimerkkipyyntö:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```


## Lokit {#logs}

### Nouda lokit {#retrieve-logs}

API:mme avulla voit ohjelmallisesti ladata tilisi lokitiedot. Lähettämällä pyynnön tähän päätepisteeseen käsitellään kaikki tilisi lokit ja lähetetään ne sinulle sähköpostitse liitteenä ([Gzip](https://en.wikipedia.org/wiki/Gzip) pakattu [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) taulukkomuotoinen tiedosto) valmistuttuaan.

Tämä mahdollistaa taustatehtävien luomisen [Cron job](https://en.wikipedia.org/wiki/Cron) -ajastimella tai käyttämällä [Node.js työaikataulutusohjelmisto Bree](https://github.com/breejs/bree) -ohjelmaa, jolloin voit vastaanottaa lokit halutessasi. Huomaa, että tämä päätepiste on rajoitettu `10` pyyntöön päivässä.

Liitteenä on pienaakkosilla muotoiltu tiedosto nimeltä `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz` ja sähköposti sisältää lyhyen yhteenvedon haetuista lokeista. Voit myös ladata lokit milloin tahansa [Oma tili → Lokit](/my-account/logs) -sivulta.

> `GET /v1/logs/download`

| Kyselyparametri       | Pakollinen | Tyyppi        | Kuvaus                                                                                                                        |
| --------------------- | ---------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `domain`              | Ei         | Merkkijono (FQDN) | Suodata lokit täysin määritellyn verkkotunnuksen ("FQDN") mukaan. Jos tätä ei anneta, haetaan lokit kaikista verkkotunnuksista. |
| `q`                   | Ei         | Merkkijono    | Etsi lokit sähköpostin, verkkotunnuksen, aliaksen nimen, IP-osoitteen tai päivämäärän (`M/Y`, `M/D/YY`, `M-D`, `M-D-YY`, tai `M.D.YY` -muodossa) perusteella. |
| `bounce_category`     | Ei         | Merkkijono    | Etsi lokit tietyn bounce-kategorian mukaan (esim. `blocklist`).                                                                |
| `response_code`       | Ei         | Numero        | Etsi lokit tietyn virhevastauksen koodin mukaan (esim. `421` tai `550`).                                                      |

> Esimerkkipyyntö:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> Esimerkki Cron-tehtävästä (keskellä yötä joka päivä):

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

Huomaa, että voit käyttää palveluita kuten [Crontab.guru](https://crontab.guru/) validoidaksesi cron-tehtäväilmaisusi syntaksin.

> Esimerkki Cron-tehtävästä (keskellä yötä joka päivä **ja edellisen päivän lokit**):

MacOS:lle:

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

| Vartalon parametri | Pakollinen | Tyyppi           | Kuvaus        |
| ------------------ | ---------- | ---------------- | ------------- |
| `email`            | Kyllä      | Merkkijono (Sähköposti) | Sähköpostiosoite |
| `password`         | Kyllä      | Merkkijono       | Salasana      |

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

| Vartalon parametri | Pakollinen | Tyyppi           | Kuvaus             |
| ------------------ | ---------- | ---------------- | ------------------- |
| `email`            | Ei         | Merkkijono (Sähköposti) | Sähköpostiosoite   |
| `given_name`       | Ei         | Merkkijono       | Etunimi             |
| `family_name`      | Ei         | Merkkijono       | Sukunimi            |
| `avatar_url`       | Ei         | Merkkijono (URL) | Linkki avatar-kuvaan |

> Esimerkkipyyntö:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```


## Aliaskontaktit (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> Toisin kuin muut API-päätepisteet, nämä vaativat [Autentikoinnin](#authentication) "käyttäjätunnuksen" vastaamaan aliaksen käyttäjätunnusta ja "salasanan" vastaamaan aliaksen luotua salasanaa Basic Authorization -otsikoissa.
> \[!WARNING]
> Tämä päätepisteosio on työn alla ja julkaistaan (toivottavasti) vuonna 2024. Sillä välin käytä IMAP-asiakasohjelmaa verkkosivustomme navigaation "Apps"-valikosta.

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
> Toisin kuin muut API-päätepisteet, nämä vaativat [Authentication](#authentication) "käyttäjätunnuksen", joka on sama kuin alias-käyttäjätunnus, ja "salasanan", joka on aliasin luoma salasana, Basic Authorization -otsikoina.

> \[!WARNING]
> Tämä päätepisteosio on työn alla ja julkaistaan (toivottavasti) vuonna 2024. Sillä välin käytä IMAP-asiakasohjelmaa verkkosivustomme navigaation "Apps"-valikosta.

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
> Toisin kuin muut API-päätepisteet, nämä vaativat [Authentication](#authentication) "käyttäjätunnuksen", joka on sama kuin alias-käyttäjätunnus, ja "salasanan", joka on aliasin luoma salasana, Basic Authorization -otsikoina.

> \[!WARNING]
> Tämä päätepisteosio on työn alla ja julkaistaan (toivottavasti) vuonna 2024. Sillä välin käytä IMAP-asiakasohjelmaa verkkosivustomme navigaation "Apps"-valikosta.

Varmista, että olet noudattanut verkkotunnuksesi asennusohjeita.

Nämä ohjeet löytyvät UKK-osastostamme [Tuetteko sähköpostin vastaanottoa IMAPilla?](/faq#do-you-support-receiving-email-with-imap).

### Listaa ja hae viestejä {#list-and-search-for-messages}

> `GET /v1/messages`

**Tulossa pian**

### Luo viesti {#create-message}

> \[!NOTE]
> Tämä **EI** lähetä sähköpostia – se lisää viestin vain postilaatikkokansioosi (esim. tämä on samanlainen kuin IMAP-komento `APPEND`). Jos haluat lähettää sähköpostin, katso alla [Luo lähtevä SMTP-sähköposti](#create-outbound-smtp-email). Lähtevän SMTP-sähköpostin luomisen jälkeen voit liittää kopion siitä tähän päätepisteeseen alias-postilaatikkoosi tallennustarkoituksia varten.

> `POST /v1/messages`

**Tulossa pian**

### Hae viesti {#retrieve-message}

> `GET /v1/messages/:id`

**Tulossa pian**

### Päivitä viesti {#update-message}

> `PUT /v1/messages/:id`

**Tulossa pian**

### Poista viesti {#delete-message}

> `DELETE /v1/messages:id`

**Tulossa pian**


## Alias-kansiot (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> Kansioiden päätepisteet, joiden polku on <code>/v1/folders/:path</code>, ovat vaihdettavissa kansioiden ID:n <code>:id</code> kanssa. Tämä tarkoittaa, että voit viitata kansioon joko sen <code>polulla</code> tai <code>id:llä</code>.

> \[!WARNING]
> Tämä päätepisteosio on työn alla ja julkaistaan (toivottavasti) vuonna 2024. Sillä välin käytä IMAP-asiakasohjelmaa verkkosivustomme navigaation "Apps"-valikosta.

### Listaa kansiot {#list-folders}

> `GET /v1/folders`

**Tulossa pian**

### Luo kansio {#create-folder}

> `POST /v1/folders`

**Tulossa pian**

### Hae kansio {#retrieve-folder}

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

Nämä ohjeet löytyvät kohdasta [Oma tili → Verkkotunnukset → Asetukset → Lähtevän SMTP:n asetukset](/my-account/domains). Sinun tulee varmistaa DKIM:n, Return-Pathin ja DMARCin asennus lähtevän SMTP:n lähettämistä varten verkkotunnuksellasi.
### Hanki lähtevän SMTP-sähköpostin raja {#get-outbound-smtp-email-limit}

Tämä on yksinkertainen päätepiste, joka palauttaa JSON-objektin, joka sisältää `count` ja `limit` päivittäisten SMTP-lähtevien viestien määrälle tilikohtaisesti.

> `GET /v1/emails/limit`

> Esimerkkipyyntö:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### Listaa lähtevät SMTP-sähköpostit {#list-outbound-smtp-emails}

Huomaa, että tämä päätepiste ei palauta ominaisuuksien arvoja sähköpostin `message`, `headers` eikä `rejectedErrors` osalta.

Palautaaksesi nämä ominaisuudet ja niiden arvot, käytä [Hae sähköposti](#retrieve-email) -päätepistettä sähköpostin tunnuksella.

> `GET /v1/emails`

| Kyselymerkkijonon parametri | Pakollinen | Tyyppi                    | Kuvaus                                                                                                                                              |
| --------------------------- | ---------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`                         | Ei         | Merkkijono (RegExp tuettu) | Hae sähköposteja metatietojen perusteella                                                                                                          |
| `domain`                    | Ei         | Merkkijono (RegExp tuettu) | Hae sähköposteja verkkotunnuksen perusteella                                                                                                      |
| `sort`                      | Ei         | Merkkijono                | Lajittele tietyn kentän mukaan (etuliitä `-` käänteiseen lajitteluun kyseisen kentän osalta). Oletuksena `created_at`, jos ei asetettu.              |
| `page`                      | Ei         | Numero                    | Katso [Sivutus](#pagination) lisätietoja                                                                                                          |
| `limit`                     | Ei         | Numero                    | Katso [Sivutus](#pagination) lisätietoja                                                                                                          |

> Esimerkkipyyntö:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### Luo lähtevä SMTP-sähköposti {#create-outbound-smtp-email}

Sähköpostin luomisen API on inspiroitunut ja hyödyntää Nodemailerin viestivaihtoehtojen konfiguraatiota. Katso kaikki alla olevat runkoparametrit [Nodemailerin viestikonfiguraatiosta](https://nodemailer.com/message/).

Huomaa, että lukuun ottamatta `envelope` ja `dkim` (koska asetamme ne automaattisesti puolestasi), tuemme kaikkia Nodemailerin vaihtoehtoja. Asetamme automaattisesti `disableFileAccess` ja `disableUrlAccess` arvoksi `true` turvallisuussyistä.

Sinun tulee joko antaa yksittäinen `raw`-vaihtoehto, joka sisältää koko raakadatan sähköpostista otsikoineen **tai** antaa yksittäiset runkoparametrit alla.

Tämä API-päätepiste koodaa automaattisesti emojit, jos niitä löytyy otsikoista (esim. otsikkorivi `Subject: 🤓 Hello` muunnetaan automaattisesti muotoon `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello`). Tavoitteemme oli tehdä erittäin kehittäjäystävällinen ja virheenkestävä sähköpostin API.

**Autentikointi:** Tämä päätepiste tukee sekä [API-tunnisteautentikointia](#api-token-authentication-recommended-for-most-endpoints) että [alias-tunnistetietojen autentikointia](#alias-credentials-authentication-for-outbound-email). Katso yllä oleva [Autentikointi](#authentication) -osio yksityiskohtia varten.

> `POST /v1/emails`

| Runkoparametri   | Pakollinen | Tyyppi             | Kuvaus                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------- | ---------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`           | Ei         | Merkkijono (Sähköposti) | Lähettäjän sähköpostiosoite (täytyy olla olemassa verkkotunnuksen aliasena).                                                                                                                                                                                                                                                                                                                                                                                  |
| `to`             | Ei         | Merkkijono tai Taulukko | Pilkuilla eroteltu lista tai taulukko vastaanottajista "To"-otsikossa.                                                                                                                                                                                                                                                                                                                                                                                        |
| `cc`             | Ei         | Merkkijono tai Taulukko | Pilkuilla eroteltu lista tai taulukko vastaanottajista "Cc"-otsikossa.                                                                                                                                                                                                                                                                                                                                                                                        |
| `bcc`            | Ei         | Merkkijono tai Taulukko | Pilkuilla eroteltu lista tai taulukko vastaanottajista "Bcc"-otsikossa.                                                                                                                                                                                                                                                                                                                                                                                       |
| `subject`        | Ei         | Merkkijono         | Sähköpostin aihe.                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `text`           | Ei         | Merkkijono tai Buffer | Viestin tekstiversio.                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `html`           | Ei         | Merkkijono tai Buffer | Viestin HTML-versio.                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `attachments`    | Ei         | Taulukko           | Liitetiedostojen taulukko (katso [Nodemailerin yleiset kentät](https://nodemailer.com/message/#common-fields)).                                                                                                                                                                                                                                                                                                                                                 |
| `sender`         | Ei         | Merkkijono         | Sähköpostiosoite "Sender"-otsikolle (katso [Nodemailerin edistyneemmät kentät](https://nodemailer.com/message/#more-advanced-fields)).                                                                                                                                                                                                                                                                                                                        |
| `replyTo`        | Ei         | Merkkijono         | Sähköpostiosoite "Reply-To"-otsikolle.                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `inReplyTo`      | Ei         | Merkkijono         | Viestin Message-ID, johon vastataan.                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `references`     | Ei         | Merkkijono tai Taulukko | Välilyönnillä eroteltu lista tai taulukko Message-ID:istä.                                                                                                                                                                                                                                                                                                                                                                                                    |
| `attachDataUrls` | Ei         | Totuusarvo         | Jos `true`, muuntaa `data:`-kuvat viestin HTML-sisällössä upotetuiksi liitteiksi.                                                                                                                                                                                                                                                                                                                                                                               |
| `watchHtml`      | Ei         | Merkkijono         | Apple Watch -kohtainen HTML-versio viestistä ([Nodemailerin dokumentaation mukaan](https://nodemailer.com/message/#content-options]), uusimmat kellot eivät vaadi tämän asettamista).                                                                                                                                                                                                                                                                           |
| `amp`            | Ei         | Merkkijono         | AMP4EMAIL-spesifinen HTML-versio viestistä (katso [Nodemailerin esimerkki](https://nodemailer.com/message/#amp-example)).                                                                                                                                                                                                                                                                                                                                       |
| `icalEvent`      | Ei         | Objekti            | iCalendar-tapahtuma vaihtoehtoisena viestisisältönä (katso [Nodemailerin kalenteritapahtumat](https://nodemailer.com/message/calendar-events/)).                                                                                                                                                                                                                                                                                                               |
| `alternatives`   | Ei         | Taulukko           | Vaihtoehtoisten viestisisältöjen taulukko (katso [Nodemailerin vaihtoehtoinen sisältö](https://nodemailer.com/message/alternatives/)).                                                                                                                                                                                                                                                                                                                        |
| `encoding`       | Ei         | Merkkijono         | Tekstin ja HTML:n koodaus (oletuksena `"utf-8"`, tukee myös `"hex"` ja `"base64"`-koodausta).                                                                                                                                                                                                                                                                                                                                                                   |
| `raw`            | Ei         | Merkkijono tai Buffer | Räätälöity RFC822-muotoinen viesti käytettäväksi (sen sijaan, että Nodemailer generoi viestin – katso [Nodemailerin räätälöity lähde](https://nodemailer.com/message/custom-source/)).                                                                                                                                                                                                                                                                         |
| `textEncoding`   | Ei         | Merkkijono         | Tekstiarvoille pakotettu koodaus ( joko `"quoted-printable"` tai `"base64"`). Oletusarvo on lähin havaittu arvo (ASCII:lle käytä `"quoted-printable"`).                                                                                                                                                                                                                                                                                                     |
| `priority`       | Ei         | Merkkijono         | Sähköpostin prioriteettitaso (voi olla `"high"`, `"normal"` (oletus) tai `"low"`). Huomaa, että arvo `"normal"` ei aseta prioriteettiotsikkoa (tämä on oletuskäyttäytyminen). Jos asetetaan `"high"` tai `"low"`, niin `X-Priority`, `X-MSMail-Priority` ja `Importance` otsikot [asetetaan vastaavasti](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers`        | Ei         | Objekti tai Taulukko | Lisäotsikkokentät objektina tai taulukkona (katso [Nodemailerin räätälöidyt otsikot](https://nodemailer.com/message/custom-headers/)).                                                                                                                                                                                                                                                                                                                        |
| `messageId`      | Ei         | Merkkijono         | Valinnainen Message-ID-arvo "Message-ID"-otsikolle (oletusarvo luodaan automaattisesti, jos ei asetettu – huomaa, että arvon tulee [noudattaa RFC2822-spesifikaatiota](https://stackoverflow.com/a/4031705)).                                                                                                                                                                                                                                                   |
| `date`           | Ei         | Merkkijono tai Päivämäärä | Valinnainen päivämääräarvo, jota käytetään, jos Date-otsikko puuttuu jäsentämisen jälkeen, muuten käytetään nykyistä UTC-aikaa, jos ei asetettu. Päivämääräotsikko ei voi olla yli 30 päivää tulevaisuudessa nykyhetkestä.                                                                                                                                                                                                                                     |
| `list`           | Ei         | Objekti            | Valinnainen `List-*` otsikoiden objekti (katso [Nodemailerin list-otsikot](https://nodemailer.com/message/list-headers/)).                                                                                                                                                                                                                                                                                                                                      |
> Esimerkkipyyntö (API-tunnus):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=testi" \
  -d "text=testi"
```

> Esimerkkipyyntö (Alias-tunnukset):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@DOMAIN_NAME:GENERATED_PASSWORD" \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=testi" \
  -d "text=testi"
```

> Esimerkkipyyntö (Raaka sähköposti):

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

Sähköpostin poisto asettaa tilaksi `"rejected"` (eikä sitä tämän jälkeen käsitellä jonossa) vain jos nykyinen tila on jokin seuraavista: `"pending"`, `"queued"` tai `"deferred"`. Saatamme poistaa sähköposteja automaattisesti 30 päivän kuluttua niiden luomisesta ja/tai lähettämisestä – siksi sinun tulisi säilyttää kopio lähtevistä SMTP-sähköposteista asiakkaassasi, tietokannassasi tai sovelluksessasi. Voit halutessasi viitata sähköpostin ID-arvoon tietokannassasi – tämä arvo palautetaan sekä [Luo sähköposti](#create-email) että [Nouda sähköposti](#retrieve-email) -rajapinnoista.

> `DELETE /v1/emails/:id`

> Esimerkkipyyntö:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```


## Verkkotunnukset {#domains}

> \[!TIP]
> Verkkotunnusrajapinnat, joiden päätepisteenä on verkkotunnuksen nimi <code>/v1/domains/:domain_name</code>, ovat vaihdettavissa verkkotunnuksen ID:n <code>:domain_id</code> kanssa. Tämä tarkoittaa, että voit viitata verkkotunnukseen joko sen <code>nimellä</code> tai <code>id:llä</code>.

### Listaa verkkotunnukset {#list-domains}

> \[!NOTE]
> 1. marraskuuta 2024 alkaen API-päätepisteet [Listaa verkkotunnukset](#list-domains) ja [Listaa verkkotunnuksen aliakset](#list-domain-aliases) palauttavat oletuksena enintään `1000` tulosta per sivu. Jos haluat ottaa tämän toiminnon käyttöön jo aikaisemmin, voit lisätä URL-osoitteeseen päätepistekyselyssä lisäparametrin `?paginate=true`. Katso lisätietoja [Sivutus](#pagination)-kohdasta.

> `GET /v1/domains`

| Kyselyparametri       | Pakollinen | Tyyppi                    | Kuvaus                                                                                                                                               |
| --------------------- | ---------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`                   | Ei         | Merkkijono (RegExp tuettu) | Etsi verkkotunnuksia nimen perusteella                                                                                                              |
| `name`                | Ei         | Merkkijono (RegExp tuettu) | Etsi verkkotunnuksia nimen perusteella                                                                                                              |
| `sort`                | Ei         | Merkkijono                | Lajittele tietyn kentän mukaan (etuliite yhdellä miinusmerkillä `-` kääntää lajittelun päinvastaiseksi). Oletuksena `created_at`, jos ei asetettu.    |
| `page`                | Ei         | Numero                    | Katso lisätietoja [Sivutus](#pagination)-kohdasta                                                                                                  |
| `limit`               | Ei         | Numero                    | Katso lisätietoja [Sivutus](#pagination)-kohdasta                                                                                                  |

> Esimerkkipyyntö:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### Luo verkkotunnus {#create-domain}

> `POST /v1/domains`

| Pyynnön parametri             | Pakollinen | Tyyppi                                         | Kuvaus                                                                                                                                                                                                                                                                                                            |
| ----------------------------- | ---------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `domain`                      | Kyllä      | Merkkijono (FQDN tai IP)                       | Täysin määritelty verkkotunnus ("FQDN") tai IP-osoite                                                                                                                                                                                                                                                             |
| `team_domain`                 | Ei         | Merkkijono (verkkotunnuksen ID tai nimi; FQDN) | Määritä tämä verkkotunnus automaattisesti samalle tiimille kuin toinen verkkotunnus. Tämä tarkoittaa, että kaikki tämän verkkotunnuksen jäsenet lisätään tiimin jäseniksi ja `plan` asetetaan automaattisesti arvoksi `team`. Voit tarvittaessa asettaa arvoksi `"none"` poistaaksesi tämän toiminnon käytöstä, mutta se ei ole pakollista. |
| `plan`                        | Ei         | Merkkijono (luetteloitu)                       | Suunnitelmatyyppi (voi olla `"free"`, `"enhanced_protection"` tai `"team"`, oletuksena `"free"` tai käyttäjän nykyinen maksullinen suunnitelma, jos sellainen on)                                                                                                                                                 |
| `catchall`                    | Ei         | Merkkijono (erotellut sähköpostiosoitteet) tai Boolean | Luo oletusarvoinen catch-all-aliaksen, oletuksena `true` (jos `true`, käytetään API-käyttäjän sähköpostiosoitetta vastaanottajana, ja jos `false`, catch-all-aliasta ei luoda). Jos annetaan merkkijono, se on eroteltu lista vastaanottajista (eroteltu rivinvaihdolla, välilyönnillä ja/tai pilkulla)          |
| `has_adult_content_protection`| Ei         | Boolean                                        | Otetaanko käyttöön roskapostin aikuissisällön suojaus tällä verkkotunnuksella                                                                                                                                                                                                                                       |
| `has_phishing_protection`     | Ei         | Boolean                                        | Otetaanko käyttöön roskapostin kalastelusuojaus tällä verkkotunnuksella                                                                                                                                                                                                                                            |
| `has_executable_protection`   | Ei         | Boolean                                        | Otetaanko käyttöön roskapostin suoritettavien tiedostojen suojaus tällä verkkotunnuksella                                                                                                                                                                                                                            |
| `has_virus_protection`        | Ei         | Boolean                                        | Otetaanko käyttöön roskapostin virussuojaus tällä verkkotunnuksella                                                                                                                                                                                                                                                |
| `has_recipient_verification`  | Ei         | Boolean                                        | Verkkotunnuksen globaali oletus, vaaditaanko aliaksen vastaanottajien klikkaavan sähköpostivahvistuslinkkiä, jotta sähköpostit kulkevat läpi                                                                                                                                                                      |
| `ignore_mx_check`             | Ei         | Boolean                                        | Ohitetaanko MX-tietueen tarkistus verkkotunnuksen vahvistuksessa. Tämä on tarkoitettu käyttäjille, joilla on edistyneet MX-vaihtosäännöt ja jotka haluavat säilyttää nykyisen MX-vaihtonsa ja ohjata sen meidän palvelimillemme.                                                                                   |
| `retention_days`              | Ei         | Numero                                         | Kokonaisluku välillä `0`–`30`, joka määrittää säilytyspäivien määrän lähtevien SMTP-sähköpostien tallentamiseen onnistuneen toimituksen tai pysyvän virheen jälkeen. Oletuksena `0`, mikä tarkoittaa, että lähtevät SMTP-sähköpostit poistetaan ja sensuroidaan välittömästi turvallisuutesi vuoksi.                      |
| `bounce_webhook`              | Ei         | Merkkijono (URL) tai Boolean (false)          | Valitsemasi `http://` tai `https://` webhook-URL, johon lähetetään bounce-webhookit. Lähetämme tähän URL-osoitteeseen `POST`-pyynnön, joka sisältää tietoa lähtevien SMTP-virheiden syistä (esim. pehmeät tai kovat virheet – jotta voit hallita tilaajiasi ja hallita lähtevää sähköpostiasi ohjelmallisesti).             |
| `max_quota_per_alias`         | Ei         | Merkkijono                                     | Tallennustilan enimmäisraja tämän verkkotunnuksen aliaksille. Syötä arvo kuten "1 GB", joka tulkitaan [bytes](https://github.com/visionmedia/bytes.js)-kirjastolla.                                                                                                                                                 |
> Esimerkkipyyntö:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### Hae domain {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> Esimerkkipyyntö:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Vahvista domainin tietueet {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Esimerkkipyyntö:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### Vahvista domainin SMTP-tietueet {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> Esimerkkipyyntö:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### Listaa domainin catch-all-salasanat {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> Esimerkkipyyntö:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Luo domainin catch-all-salasana {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Body Parameter | Pakollinen | Tyyppi | Kuvaus                                                                                                                                                                                                                     |
| -------------- | ---------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | Ei         | Merkkijono | Oma uusi salasanasi, jota käytetään domainin catch-all-salasanana. Huomaa, että voit jättää tämän tyhjäksi tai kokonaan pois API-pyynnön rungosta, jos haluat saada satunnaisesti luodun ja vahvan salasanan.               |
| `description`  | Ei         | Merkkijono | Kuvaus vain organisaatiotarkoituksiin.                                                                                                                                                                                     |

> Esimerkkipyyntö:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Poista domainin catch-all-salasana {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> Esimerkkipyyntö:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### Päivitä domain {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| Body Parameter                 | Pakollinen | Tyyppi                            | Kuvaus                                                                                                                                                                                                                                                                                   |
| ------------------------------ | ---------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port`                    | Ei         | Merkkijono tai Numero            | Mukautettu portti SMTP-uudelleenohjaukselle (oletus on `"25"`)                                                                                                                                                                                                                            |
| `has_adult_content_protection` | Ei         | Totuusarvo                      | Otetaanko Spam Scannerin aikuisviestien suojaus käyttöön tässä domainissa                                                                                                                                                                                                                 |
| `has_phishing_protection`      | Ei         | Totuusarvo                      | Otetaanko Spam Scannerin kalastelusuojaus käyttöön tässä domainissa                                                                                                                                                                                                                      |
| `has_executable_protection`    | Ei         | Totuusarvo                      | Otetaanko Spam Scannerin suoritettavien tiedostojen suojaus käyttöön tässä domainissa                                                                                                                                                                                                    |
| `has_virus_protection`         | Ei         | Totuusarvo                      | Otetaanko Spam Scannerin virussuojaus käyttöön tässä domainissa                                                                                                                                                                                                                          |
| `has_recipient_verification`   | Ei         | Totuusarvo                      | Domainin globaali oletus siitä, vaaditaanko alias-vastaanottajien klikkaavan sähköpostivahvistuslinkkiä, jotta sähköpostit kulkevat läpi                                                                                                                                                  |
| `ignore_mx_check`              | Ei         | Totuusarvo                      | Ohitetaanko MX-tietueen tarkistus domainilla vahvistusta varten. Tämä on pääasiassa käyttäjille, joilla on edistyneet MX-vaihtosäännöt ja jotka haluavat säilyttää nykyisen MX-vaihtonsa ja ohjata sen meidän palveluumme.                                                             |
| `retention_days`               | Ei         | Numero                         | Kokonaisluku välillä `0`–`30`, joka määrittää säilytyspäivien määrän lähtevien SMTP-sähköpostien tallentamiseen onnistuneen toimituksen tai pysyvän virheen jälkeen. Oletuksena `0`, mikä tarkoittaa, että lähtevät SMTP-sähköpostit poistetaan ja sensuroidaan välittömästi turvallisuutesi vuoksi. |
| `bounce_webhook`               | Ei         | Merkkijono (URL) tai Totuusarvo (false) | Valitsemasi `http://` tai `https://` webhook-URL, johon lähetetään bounce-webhookit. Lähetämme tähän URL-osoitteeseen `POST`-pyynnön tiedoilla lähtevien SMTP-virheiden (esim. pehmeät tai kovat virheet) hallintaan, jotta voit hallita tilaajiasi ja ohjelmallisesti hallita lähtevää sähköpostiasi. |
| `max_quota_per_alias`          | Ei         | Merkkijono                     | Tallennustilan enimmäisraja tämän domainin aliaksille. Syötä arvo kuten "1 GB", joka tulkitaan [bytes](https://github.com/visionmedia/bytes.js) -kirjastolla.                                                                                                                               |
> Esimerkkipyyntö:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Poista domain {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> Esimerkkipyyntö:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```


## Kutsut {#invites}

### Hyväksy domain-kutsu {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> Esimerkkipyyntö:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### Luo domain-kutsu {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| Body Parameter | Pakollinen | Tyyppi              | Kuvaus                                                                                     |
| -------------- | ---------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `email`        | Kyllä      | Merkkijono (Sähköposti) | Sähköpostiosoite, johon kutsu lähetetään domainin jäsenten listalle                      |
| `group`        | Kyllä      | Merkkijono (luettelo) | Ryhmä, johon käyttäjä lisätään domainin jäsenyyteen (voi olla joko `"admin"` tai `"user"`) |

> Esimerkkipyyntö:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> Jos kutsuttava käyttäjä on jo hyväksytty jäsen jossain muussa domainissa, jonka ylläpitäjä on jäsenenä, kutsu hyväksytään automaattisesti eikä sähköpostia lähetetä.

### Poista domain-kutsu {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| Body Parameter | Pakollinen | Tyyppi           | Kuvaus                                           |
| -------------- | ---------- | ---------------- | ------------------------------------------------ |
| `email`        | Kyllä      | Merkkijono (Sähköposti) | Sähköpostiosoite, joka poistetaan domainin jäsenten listalta |

> Esimerkkipyyntö:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```


## Jäsenet {#members}

### Päivitä domain-jäsen {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Body Parameter | Pakollinen | Tyyppi              | Kuvaus                                                                                   |
| -------------- | ---------- | ------------------- | --------------------------------------------------------------------------------------- |
| `group`        | Kyllä      | Merkkijono (luettelo) | Ryhmä, johon käyttäjä päivitetään domainin jäsenyyteen (voi olla joko `"admin"` tai `"user"`) |

> Esimerkkipyyntö:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### Poista domain-jäsen {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> Esimerkkipyyntö:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```


## Aliasnimet {#aliases}

### Luo alias-salasana {#generate-an-alias-password}

Huomaa, että jos et lähetä ohjeita sähköpostitse, käyttäjätunnus ja salasana ovat onnistuneen pyynnön JSON-vastauksen rungossa muodossa `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }`.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Body Parameter         | Pakollinen | Tyyppi   | Kuvaus                                                                                                                                                                                                                                                                                           |
| ---------------------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `new_password`         | Ei         | Merkkijono | Oma uusi salasana aliasille. Voit jättää tämän tyhjäksi tai kokonaan pois API-pyynnön rungosta, jos haluat saada satunnaisesti luodun vahvan salasanan.                                                                                                                                        |
| `password`             | Ei         | Merkkijono | Aliasin nykyinen salasana salasanan vaihtamista varten ilman olemassa olevan IMAP-postilaatikon tallennuksen poistamista (katso alla oleva `is_override`-vaihtoehto, jos et enää tiedä nykyistä salasanaa).                                                                                         |
| `is_override`          | Ei         | Totuusarvo | **KÄYTÄ VAROVASTI**: Tämä korvaa olemassa olevan alias-salasanan ja tietokannan kokonaan, ja poistaa pysyvästi olemassa olevan IMAP-tallennuksen sekä nollaa aliasin SQLite-sähköpostitietokannan kokonaan. Tee varmuuskopio, jos sinulla on olemassa oleva postilaatikko liitettynä tähän aliasiin. |
| `emailed_instructions` | Ei         | Merkkijono | Sähköpostiosoite, johon aliasin salasana ja asennusohjeet lähetetään.                                                                                                                                                                                                                            |
> Esimerkkipyyntö:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### Listaa domainin aliakset {#list-domain-aliases}

> \[!NOTE]
> 1. marraskuuta 2024 alkaen API-päätepisteet [Listaa domainit](#list-domains) ja [Listaa domainin aliakset](#list-domain-aliases) palauttavat oletuksena enintään `1000` tulosta sivua kohden. Jos haluat ottaa tämän toiminnon käyttöön jo aikaisemmin, voit lisätä URL-osoitteeseen päätepistekyselyssä lisäparametrin `?paginate=true`. Katso lisätietoja kohdasta [Sivutus](#pagination).

> `GET /v1/domains/DOMAIN_NAME/aliases`

| Kyselyparametri        | Pakollinen | Tyyppi                      | Kuvaus                                                                                                                                          |
| ---------------------- | ---------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`                    | Ei         | Merkkijono (RegExp tuettu)  | Etsi aliaksia domainissa nimen, tunnisteen tai vastaanottajan perusteella                                                                         |
| `name`                 | Ei         | Merkkijono (RegExp tuettu)  | Etsi aliaksia domainissa nimen perusteella                                                                                                      |
| `recipient`            | Ei         | Merkkijono (RegExp tuettu)  | Etsi aliaksia domainissa vastaanottajan perusteella                                                                                            |
| `sort`                 | Ei         | Merkkijono                  | Lajittele tietyn kentän mukaan (etuliite yhdellä miinusmerkillä `-` kääntää lajittelujärjestyksen). Oletuksena `created_at`, jos ei asetettu.     |
| `page`                 | Ei         | Numero                      | Katso lisätietoja kohdasta [Sivutus](#pagination)                                                                                              |
| `limit`                | Ei         | Numero                      | Katso lisätietoja kohdasta [Sivutus](#pagination)                                                                                              |

> Esimerkkipyyntö:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### Luo uusi domainin alias {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| Pyynnön runkoparametri         | Pakollinen | Tyyppi                                   | Kuvaus                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------ | ---------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                        | Ei         | Merkkijono                               | Aliaksen nimi (jos ei anneta tai on tyhjä, generoidaan satunnainen alias)                                                                                                                                                                                                                                                                                                                  |
| `recipients`                  | Ei         | Merkkijono tai Taulukko                  | Vastaanottajien lista (täytyy olla rivinvaihto-/välilyönti-/pilkulla erotettu merkkijono tai taulukko, joka sisältää kelvollisia sähköpostiosoitteita, täysin määriteltyjä domain-nimiä ("FQDN"), IP-osoitteita ja/tai webhook-URL-osoitteita – ja jos ei anneta tai taulukko on tyhjä, API-pyynnön tekijän sähköpostiosoite asetetaan vastaanottajaksi)                                                                                     |
| `description`                 | Ei         | Merkkijono                               | Aliaksen kuvaus                                                                                                                                                                                                                                                                                                                                                                             |
| `labels`                      | Ei         | Merkkijono tai Taulukko                  | Tunnisteiden lista (täytyy olla rivinvaihto-/välilyönti-/pilkulla erotettu merkkijono tai taulukko)                                                                                                                                                                                                                                                                                         |
| `has_recipient_verification`  | Ei         | Totuusarvo                              | Vaadi vastaanottajia klikkaamaan sähköpostivahvistuslinkkiä, jotta sähköpostit kulkevat läpi (oletuksena domainin asetus, jos ei aseteta pyynnön rungossa)                                                                                                                                                                                                                                  |
| `is_enabled`                  | Ei         | Totuusarvo                              | Ota alias käyttöön tai poista käytöstä (jos pois käytöstä, sähköpostit ohjataan minnekään, mutta palautetaan onnistuneita tilakoodeja). Jos arvo annetaan, se muunnetaan totuusarvoksi käyttäen [boolean](https://github.com/thenativeweb/boolean#quick-start) -kirjastoa                                                                                                               |
| `error_code_if_disabled`      | Ei         | Numero (`250`, `421` tai `550`)          | Saapuva sähköposti tähän aliakseen hylätään, jos `is_enabled` on `false`, joko koodilla `250` (hiljainen toimitus minnekään, esim. musta aukko tai `/dev/null`), `421` (pehmeä hylkäys; yritetään uudelleen noin 5 päivän ajan) tai `550` (pysyvä virhe ja hylkäys). Oletuksena `250`.                                                                                                         |
| `has_imap`                    | Ei         | Totuusarvo                              | Ota IMAP-tallennus käyttöön tai pois käytöstä tälle aliakselle (jos pois käytöstä, saapuvia sähköposteja ei tallenneta [IMAP-tallennukseen](/blog/docs/best-quantum-safe-encrypted-email-service)). Jos arvo annetaan, se muunnetaan totuusarvoksi käyttäen [boolean](https://github.com/thenativeweb/boolean#quick-start) -kirjastoa                                                                 |
| `has_pgp`                     | Ei         | Totuusarvo                              | Ota käyttöön tai pois käytöstä [OpenPGP-salaus](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) [IMAP/POP3/CalDAV/CardDAV salatun sähköpostin tallennuksen](/blog/docs/best-quantum-safe-encrypted-email-service) käyttäen aliaksen `public_key` -avainta.                                                                                         |
| `public_key`                  | Ei         | Merkkijono                               | OpenPGP-julkinen avain ASCII Armor -muodossa ([katso esimerkki](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); esim. GPG-avain `support@forwardemail.net`). Tämä koskee vain, jos `has_pgp` on asetettu `true`. [Lue lisää päästä päähän -salauksesta FAQ:ssamme](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).                      |
| `max_quota`                   | Ei         | Merkkijono                               | Tallennustilan enimmäisraja tälle aliakselle. Jätä tyhjäksi palauttaaksesi domainin nykyisen enimmäisrajan tai anna arvo kuten "1 GB", joka jäsennetään [bytes](https://github.com/visionmedia/bytes.js) -kirjastolla. Tätä arvoa voivat muuttaa vain domainin ylläpitäjät.                                                                                                               |
| `vacation_responder_is_enabled` | Ei         | Totuusarvo                              | Ota automaattinen lomavastaaja käyttöön tai pois käytöstä.                                                                                                                                                                                                                                                                                                                                 |
| `vacation_responder_start_date` | Ei         | Merkkijono                               | Lomavastaajan aloituspäivä (jos käytössä eikä aloituspäivää aseteta, oletetaan, että se on jo alkanut). Tuemme päivämäärämuotoja kuten `MM/DD/YYYY`, `YYYY-MM-DD` ja muita älykkäällä jäsentämisellä `dayjs`-kirjastolla.                                                                                                                                                                   |
| `vacation_responder_end_date`   | Ei         | Merkkijono                               | Lomavastaajan lopetuspäivä (jos käytössä eikä lopetuspäivää aseteta, oletetaan, että se ei lopu koskaan ja vastaa ikuisesti). Tuemme päivämäärämuotoja kuten `MM/DD/YYYY`, `YYYY-MM-DD` ja muita älykkäällä jäsentämisellä `dayjs`-kirjastolla.                                                                                                                                           |
| `vacation_responder_subject`    | Ei         | Merkkijono                               | Lomavastaajan viestin aihe pelkkänä tekstinä, esim. "Poissa toimistolta". Käytämme `striptags`-kirjastoa poistamaan kaiken HTML:n.                                                                                                                                                                                                                                                         |
| `vacation_responder_message`    | Ei         | Merkkijono                               | Lomavastaajan viesti pelkkänä tekstinä, esim. "Olen poissa toimistolta helmikuuhun asti.". Käytämme `striptags`-kirjastoa poistamaan kaiken HTML:n.                                                                                                                                                                                                                                         |
> Esimerkkipyyntö:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### Hae verkkotunnuksen alias {#retrieve-domain-alias}

Voit hakea verkkotunnuksen aliasin joko sen `id`- tai `name`-arvon perusteella.

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

| Body Parameter                  | Pakollinen | Tyyppi                                 | Kuvaus                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------- | ---------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                          | Ei         | Merkkijono                            | Aliaksen nimi                                                                                                                                                                                                                                                                                                                                                                              |
| `recipients`                    | Ei         | Merkkijono tai Taulukko               | Vastaanottajien lista (täytyy olla rivinvaihto-/välilyönti-/pilkulla erotettu merkkijono tai taulukko, joka sisältää kelvollisia sähköpostiosoitteita, täysin määriteltyjä verkkotunnuksia ("FQDN"), IP-osoitteita ja/tai webhook-URL-osoitteita)                                                                                                                                           |
| `description`                   | Ei         | Merkkijono                            | Aliaksen kuvaus                                                                                                                                                                                                                                                                                                                                                                           |
| `labels`                        | Ei         | Merkkijono tai Taulukko               | Tunnisteiden lista (täytyy olla rivinvaihto-/välilyönti-/pilkulla erotettu merkkijono tai taulukko)                                                                                                                                                                                                                                                                                         |
| `has_recipient_verification`    | Ei         | Totuusarvo                           | Vaaditaanko vastaanottajien klikkaavan sähköpostivarmistuslinkkiä, jotta sähköpostit kulkevat läpi (oletuksena verkkotunnuksen asetus, jos ei ole erikseen määritelty pyyntötekstissä)                                                                                                                                                                                                       |
| `is_enabled`                    | Ei         | Totuusarvo                           | Otetaanko tämä alias käyttöön vai pois käytöstä (jos pois käytöstä, sähköposteja ei reititetä minnekään, mutta palautetaan onnistuneita tilakoodeja). Jos arvo annetaan, se muunnetaan totuusarvoksi käyttäen [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                               |
| `error_code_if_disabled`        | Ei         | Numero (joko `250`, `421` tai `550`) | Saapuva sähköposti tähän aliasiin hylätään, jos `is_enabled` on `false`, joko koodilla `250` (hiljainen toimitus minnekään, esim. musta aukko tai `/dev/null`), `421` (pehmeä hylkäys; ja yritetään uudelleen noin 5 päivän ajan) tai `550` (pysyvä virhe ja hylkäys). Oletuksena `250`.                                                                                                         |
| `has_imap`                      | Ei         | Totuusarvo                           | Otetaanko IMAP-tallennus käyttöön tai pois käytöstä tälle aliasille (jos pois käytöstä, saapuvia sähköposteja ei tallenneta [IMAP-tallennukseen](/blog/docs/best-quantum-safe-encrypted-email-service). Jos arvo annetaan, se muunnetaan totuusarvoksi käyttäen [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                |
| `has_pgp`                       | Ei         | Totuusarvo                           | Otetaanko käyttöön tai pois käytöstä [OpenPGP-salaus](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) [IMAP/POP3/CalDAV/CardDAV-salatussa sähköpostitallennuksessa](/blog/docs/best-quantum-safe-encrypted-email-service) aliasin `public_key`-avaimen avulla.                                                                                         |
| `public_key`                    | Ei         | Merkkijono                            | OpenPGP-julkinen avain ASCII Armor -muodossa ([katso esimerkki](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); esim. GPG-avain `support@forwardemail.net`). Tämä koskee vain, jos `has_pgp` on asetettu arvoon `true`. [Lisätietoja päästä päähän -salauksesta FAQ:ssamme](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                     | Ei         | Merkkijono                            | Tallennustilan enimmäisraja tälle aliasille. Jätä tyhjäksi palauttaaksesi verkkotunnuksen nykyisen enimmäisrajan tai anna arvo kuten "1 GB", joka tulkitaan [bytes](https://github.com/visionmedia/bytes.js) -kirjastolla. Tätä arvoa voivat muuttaa vain verkkotunnuksen ylläpitäjät.                                                                                                     |
| `vacation_responder_is_enabled` | Ei         | Totuusarvo                           | Otetaanko automaattinen lomavastaaja käyttöön vai pois käytöstä.                                                                                                                                                                                                                                                                                                                           |
| `vacation_responder_start_date` | Ei         | Merkkijono                            | Lomavastaajan aloituspäivä (jos käytössä eikä aloituspäivää ole asetettu, oletetaan, että se on jo alkanut). Tuemme päivämäärämuotoja kuten `MM/DD/YYYY`, `YYYY-MM-DD` ja muita päivämääriä älykkään jäsentämisen avulla `dayjs`-kirjastolla.                                                                                                                                              |
| `vacation_responder_end_date`   | Ei         | Merkkijono                            | Lomavastaajan lopetuspäivä (jos käytössä eikä lopetuspäivää ole asetettu, oletetaan, että se ei lopu koskaan ja vastaa ikuisesti). Tuemme päivämäärämuotoja kuten `MM/DD/YYYY`, `YYYY-MM-DD` ja muita päivämääriä älykkään jäsentämisen avulla `dayjs`-kirjastolla.                                                                                                                      |
| `vacation_responder_subject`    | Ei         | Merkkijono                            | Lomavastaajan viestin aihe selkokielisenä, esim. "Poissa toimistolta". Käytämme `striptags`-kirjastoa poistamaan kaiken HTML:n.                                                                                                                                                                                                                                                             |
| `vacation_responder_message`    | Ei         | Merkkijono                            | Lomavastaajan viestin sisältö selkokielisenä, esim. "Olen poissa toimistolta helmikuuhun asti.". Käytämme `striptags`-kirjastoa poistamaan kaiken HTML:n.                                                                                                                                                                                                                                   |
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

Sallimme tietueiden salaamisen myös ilmaisella suunnitelmalla ilman kustannuksia. Yksityisyys ei saisi olla ominaisuus, vaan sen tulisi olla sisäänrakennettuna kaikissa tuotteen osa-alueissa. Kuten erittäin toivottu [Privacy Guides -keskustelussa](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) ja [GitHub-ongelmissamme](https://github.com/forwardemail/forwardemail.net/issues/254), olemme lisänneet tämän.

### Salaa TXT-tietue {#encrypt-txt-record}

> `POST /v1/encrypt`

| Body Parameter | Pakollinen | Tyyppi | Kuvaus                                      |
| -------------- | ---------- | ------ | -------------------------------------------- |
| `input`        | Kyllä      | Merkkijono | Mikä tahansa kelvollinen Forward Emailin selväkielinen TXT-tietue |

> Esimerkkipyyntö:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
