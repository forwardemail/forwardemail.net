# Listmonk ja sähköpostin edelleenlähetys uutiskirjeiden turvalliseen toimitukseen {#listmonk-with-forward-email-for-secure-newsletter-delivery}

## Sisällysluettelo {#table-of-contents}

* [Yleiskatsaus](#overview)
* [Miksi Listmonk ja sähköpostin välittäminen](#why-listmonk-and-forward-email)
* [Edellytykset](#prerequisites)
* [Asennus](#installation)
  * [1. Päivitä palvelimesi](#1-update-your-server)
  * [2. Asenna riippuvuudet](#2-install-dependencies)
  * [3. Lataa Listmonkin kokoonpano](#3-download-listmonk-configuration)
  * [4. Palomuurin (UFW) määrittäminen](#4-configure-firewall-ufw)
  * [5. HTTPS-yhteyden määrittäminen](#5-configure-https-access)
  * [6. Käynnistä Listmonk](#6-start-listmonk)
  * [7. Määritä sähköpostin edelleenlähetys SMTP Listmonkissa](#7-configure-forward-email-smtp-in-listmonk)
  * [8. Määritä palautuskäsittely](#8-configure-bounce-processing)
* [Testaus](#testing)
  * [Luo postituslista](#create-a-mailing-list)
  * [Lisää tilaajia](#add-subscribers)
  * [Luo ja lähetä kampanja](#create-and-send-a-campaign)
* [Vahvistus](#verification)
* [Kehittäjän huomautukset](#developer-notes)
* [Johtopäätös](#conclusion)

## Yleiskatsaus {#overview}

Tämä opas tarjoaa kehittäjille vaiheittaiset ohjeet [Listmonk](https://listmonk.app/):n, tehokkaan avoimen lähdekoodin uutiskirjeiden ja postituslistojen hallintaohjelman, määrittämiseen käyttämään [Lähetä sähköpostia eteenpäin](https://forwardemail.net/):tä SMTP-palveluntarjoajanaan. Tämän yhdistelmän avulla voit hallita kampanjoitasi tehokkaasti ja varmistaa samalla turvallisen, yksityisen ja luotettavan sähköpostin toimituksen.

* **Listmonk**: Hoitaa tilaajien hallinnan, listan organisoinnin, kampanjoiden luomisen ja suorituskyvyn seurannan.
* **Sähköpostin edelleenlähetys**: Toimii suojattuna SMTP-palvelimena ja käsittelee sähköpostien varsinaisen lähettämisen sisäänrakennettujen suojausominaisuuksien, kuten SPF:n, DKIM:n, DMARC:n ja TLS-salauksen, avulla.

Yhdistämällä nämä kaksi säilytät täyden hallinnan tietoihisi ja infrastruktuuriisi hyödyntäen samalla Forward Emailin vankkaa toimitusjärjestelmää.

## Miksi Listmonk ja sähköpostin välittäminen {#why-listmonk-and-forward-email}

* **Avoin lähdekoodi**: Sekä Listmonk että Forward Emailin taustalla olevat periaatteet korostavat läpinäkyvyyttä ja hallintaa. Ylläpidät Listmonkia itse ja omistat tietosi.
* **Tietosuojakeskeinen**: Forward Email on rakennettu yksityisyys keskiössä, minimoimalla tietojen säilytyksen ja keskittyen turvalliseen tiedonsiirtoon.
* **Kustannustehokas**: Listmonk on ilmainen, ja Forward Email tarjoaa runsaasti ilmaispaketteja ja edullisia maksullisia paketteja, mikä tekee tästä budjettiystävällisen ratkaisun.
* **Skaalautuvuus**: Listmonk on erittäin suorituskykyinen, ja Forward Emailin infrastruktuuri on suunniteltu luotettavaa ja skaalautuvaa toimitusta varten.
* **Kehittäjäystävällinen**: Listmonk tarjoaa vankan API:n, ja Forward Email tarjoaa suoraviivaisen SMTP-integraation ja webhookit.

## Edellytykset {#prerequisites}

Ennen kuin aloitat, varmista, että sinulla on seuraavat:

* Virtuaalipalvelin (VPS), jossa on uusi Linux-jakelu (suositellaan Ubuntu 20.04+) ja vähintään yksi suoritin ja 1 Gt RAM-muistia (suositellaan 2 Gt).
* Tarvitsetko palveluntarjoajaa? Tutustu [suositeltu VPS-luettelo](https://github.com/forwardemail/awesome-mail-server-providers)-ominaisuuteen.
* Hallitsemasi verkkotunnus (DNS-käyttöoikeus vaaditaan).
* Aktiivinen tili, jolla on [Lähetä sähköpostia eteenpäin](https://forwardemail.net/).
* Pääkäyttäjän tai `sudo`-käyttöoikeus VPS:ään.
* Perustiedot Linuxin komentorivitoiminnoista.

## Asennus {#installation}

Nämä vaiheet opastavat sinua Listmonkin asentamisessa Dockerin ja Docker Composen avulla VPS:llesi.

### 1. Päivitä palvelimesi {#1-update-your-server}

Varmista, että järjestelmäsi pakettiluettelo ja asennetut paketit ovat ajan tasalla.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Asenna riippuvuudet {#2-install-dependencies}

Asenna Docker, Docker Compose ja UFW (Uncomplicated Firewall).

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Lataa Listmonkin kokoonpano {#3-download-listmonk-configuration}

Luo hakemisto Listmonkille ja lataa virallinen `docker-compose.yml`-tiedosto.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

Tämä tiedosto määrittelee Listmonk-sovellussäiliön ja sen vaatiman PostgreSQL-tietokantasäiliön.

### 4. Palomuurin (UFW) määrittäminen {#4-configure-firewall-ufw}

Salli välttämätön liikenne (SSH, HTTP, HTTPS) palomuurin läpi. Jos SSH-yhteytesi toimii epästandardin portin kautta, muuta asetuksia vastaavasti.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

Vahvista palomuurin käyttöönotto pyydettäessä.

### 5. HTTPS-yhteyden määrittäminen {#5-configure-https-access}

Listmonkin käyttäminen HTTPS:n kautta on ratkaisevan tärkeää turvallisuuden kannalta. Sinulla on kaksi päävaihtoehtoa:

#### Vaihtoehto A: Cloudflare-välityspalvelimen käyttö (suositellaan Simplicityn vuoksi) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

Jos verkkotunnuksesi DNS:ää hallinnoi Cloudflare, voit hyödyntää heidän välityspalvelinominaisuuttaan helpon HTTPS:n käyttöön.

1. **Piste DNS**: Luo Cloudflareen `A`-tietue Listmonk-aliverkkotunnuksellesi (esim. `listmonk.yourdomain.com`), joka osoittaa VPS:n IP-osoitteeseen. Varmista, että **Välityspalvelimen tila** on **Välityspalvelimella** (oranssi pilvi).

2. **Muokkaa Docker Compose -tiedostoa**: Muokkaa lataamaasi `docker-compose.yml`-tiedostoa:

```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
Tämä tekee Listmonkista sisäisesti käytettävän portin 80 kautta, jonka Cloudflare voi sitten välityspalvelimena käyttää ja suojata HTTPS:llä.

#### Vaihtoehto B: Käänteisen välityspalvelimen (Nginx, Caddy jne.) käyttö {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

Vaihtoehtoisesti voit määrittää virtuaalipalvelimellesi käänteisen välityspalvelimen, kuten Nginxin tai Caddyn, käsittelemään HTTPS-päättämistä ja välityspalvelinpyyntöjä Listmonkille (joka toimii oletusarvoisesti portissa 9000).

* Säilytä oletusarvoinen `ports: - "127.0.0.1:9000:9000"` kohdassa `docker-compose.yml` varmistaaksesi, että Listmonkiin pääsee käsiksi vain paikallisesti.
* Määritä valitsemasi käänteinen välityspalvelin kuuntelemaan portteja 80 ja 443, käsittelemään SSL-varmenteiden hankinnan (esim. Let's Encryptin kautta) ja välittämään liikenteen `http://127.0.0.1:9000`:een.
* Yksityiskohtainen käänteisen välityspalvelimen määritys ei kuulu tämän oppaan piiriin, mutta verkossa on saatavilla monia opetusohjelmia.

### 6. Käynnistä Listmonk {#6-start-listmonk}

Siirry takaisin `listmonk`-hakemistoon (jos et ole jo siellä) ja käynnistä säilöt irrotetussa tilassa.

```bash
cd ~/listmonk # Or the directory where you saved docker-compose.yml
docker compose up -d
```

Docker lataa tarvittavat levykuvat ja käynnistää Listmonk-sovelluksen ja tietokantasäiliöt. Ensimmäisellä kerralla se voi kestää minuutin tai kaksi.

✅ **Käytä Listmonkia**: Sinun pitäisi nyt voida käyttää Listmonkin verkkokäyttöliittymää määrittämäsi verkkotunnuksen kautta (esim. `https://listmonk.yourdomain.com`).

### 7. Sähköpostin edelleenlähetyksen SMTP-palvelimen määrittäminen Listmonkissa {#7-configure-forward-email-smtp-in-listmonk}

Seuraavaksi määritä Listmonk lähettämään sähköposteja Lähetä sähköposti -tilisi kautta.

1. **Ota SMTP käyttöön sähköpostin edelleenlähetyksessä**: Varmista, että olet luonut SMTP-tunnukset sähköpostin edelleenlähetystilisi hallintapaneelissa. Noudata [Sähköpostin edelleenlähetysopas sähköpostin lähettämiseen mukautetulla verkkotunnuksella SMTP:n kautta](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp)-ohjetta, jos et ole jo tehnyt niin.

2. **Määritä Listmonk**: Kirjaudu sisään Listmonkin hallintapaneeliin.
* Siirry kohtaan **Asetukset -> SMTP**.

* Listmonkissa on sisäänrakennettu tuki sähköpostin edelleenlähetykselle. Valitse **Sähköpostin edelleenlähetys** palveluntarjoajaluettelosta tai anna seuraavat tiedot manuaalisesti:

| Asetus | Arvo |
| :---------------- | :------------------------------------------------------------------------------------------------------------------ |
| **Isäntä** | `smtp.forwardemail.net` |
| **Satama** | `465` |
| **Valtuutusprotokolla** | `LOGIN` |
| **Käyttäjänimi** | Sähköpostin edelleenlähetys **SMTP-käyttäjätunnus** |
| **Salasana** | Sähköpostin edelleenlähetys **SMTP-salasana** |
| **TLS** | `SSL/TLS` |
| **Sähköpostista** | Haluamasi `From`-osoite (esim. `newsletter@yourdomain.com`). Varmista, että tämä verkkotunnus on määritetty sähköpostin edelleenlähetyksessä. |

* **Tärkeää**: Käytä aina porttia `465` yhdessä `SSL/TLS`:n kanssa suojattujen sähköpostiyhteyksien muodostamiseen. Älä käytä STARTTLS:ää (portti 587).

* Napsauta **Tallenna**.

3. **Lähetä testisähköposti**: Käytä SMTP-asetussivulla olevaa Lähetä testisähköposti -painiketta. Anna vastaanottajan osoite, johon sinulla on käyttöoikeus, ja napsauta **Lähetä**. Varmista, että sähköposti saapuu vastaanottajan postilaatikkoon.

### 8. Määritä palautuskäsittely {#8-configure-bounce-processing}

Palautusten käsittely mahdollistaa Listmonkin käsitellä automaattisesti sähköposteja, joita ei voitu toimittaa (esim. virheellisten osoitteiden vuoksi). Sähköpostin välitys tarjoaa webhookin, jonka avulla Listmonk voi ilmoittaa palautuksista.

#### Sähköpostin edelleenlähetyksen asetukset {#forward-email-setup}

1. Kirjaudu sisään [Sähköpostin edelleenlähetyshallintapaneeli](https://forwardemail.net/)-tilille.
2. Siirry kohtaan **Verkkotunnukset**, valitse lähettämiseen käyttämäsi verkkotunnus ja siirry sen **Asetukset**-sivulle.
3. Vieritä alas **Palautus-Webhookin URL-osoite** -osioon.
4. Syötä seuraava URL-osoite ja korvaa `<your_listmonk_domain>` sen verkkotunnuksen tai aliverkkotunnuksen nimellä, josta Listmonk-instanssisi on käytettävissä:

```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
*Esimerkki*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. Vieritä edelleen alas **Webhook Signature Payload Verification Key** -osioon.
6. **Kopioi** luotu vahvistusavain. Tarvitset sitä Listmonkissa.
7. Tallenna muutokset sähköpostin edelleenlähetysverkkotunnusasetuksiin.

#### Listmonk-asetukset {#listmonk-setup}

1. Siirry Listmonkin hallintapaneelissa kohtaan **Asetukset -> Palautukset**.

2. Ota käyttöön **Ota käyttöön palautuskäsittely**.

3. Ota käyttöön **Ota käyttöön palautuswebhookit**.

4. Vieritä alas **Webhook-palveluntarjoajat**-osioon.

5. Ota käyttöön **Sähköpostin edelleenlähetys**.

6. Liitä **Webhook-allekirjoituksen hyötykuorman vahvistusavain**, jonka kopioit Sähköpostin edelleenlähetyksen hallintapaneelista **Sähköpostin edelleenlähetysavain** -kenttään.

7. Napsauta **Tallenna** sivun alareunassa.

8. Palautuskäsittely on nyt määritetty! Kun Sähköpostin edelleenlähetys havaitsee Listmonkin lähettämän sähköpostin palautuksen, se ilmoittaa siitä Listmonk-instanssillesi webhookin kautta, ja Listmonk merkitsee tilaajan vastaavasti.

9. Suorita alla olevat vaiheet kohdassa [Testaus](#testing) varmistaaksesi, että kaikki toimii.

## Testataan {#testing}

Tässä on lyhyt yleiskatsaus Listmonkin ydinfunktioista:

### Luo postituslista {#create-a-mailing-list}

* Siirry sivupalkissa kohtaan **Listat**.
* Napsauta **Uusi lista**.
* Täytä tiedot (nimi, tyyppi: julkinen/yksityinen, kuvaus, tunnisteet) ja **Tallenna**.

### Lisää tilaajia {#add-subscribers}

* Siirry **Tilaajat**-osioon.
* Voit lisätä tilaajia:
* **Manuaalisesti**: Napsauta **Uusi tilaaja**.
* **Tuo**: Lataa CSV-tiedosto napsauttamalla **Tuo tilaajat**.
* **API**: Käytä Listmonk-API:a ohjelmallisiin lisäyksiin.
* Määritä tilaajat yhdelle tai useammalle listalle luonnin tai tuonnin aikana.
* **Paras käytäntö**: Käytä kaksinkertaista suostumusprosessia. Määritä tämä kohdassa **Asetukset -> Liittyminen ja tilaukset**.

### Luo ja lähetä kampanja {#create-and-send-a-campaign}

* Siirry kohtaan **Kampanjat** -> **Uusi kampanja**.
* Täytä kampanjan tiedot (nimi, aihe, lähettäjän sähköposti, vastaanottajalista(t).
* Valitse sisältötyyppi (Rich Text/HTML, pelkkä teksti, raaka HTML).
* Kirjoita sähköpostin sisältö. Voit käyttää mallimuuttujia, kuten `{{ .Subscriber.Email }}` tai `{{ .Subscriber.FirstName }}`.
* **Lähetä aina ensin testisähköposti!** Käytä "Lähetä testi" -vaihtoehtoa esikatsellaksesi sähköpostia postilaatikossasi.
* Kun olet tyytyväinen, napsauta **Aloita kampanja** lähettääksesi sen heti tai ajoittaaksesi sen myöhempään ajankohtaan.

## Vahvistus {#verification}

* **SMTP-toimitus**: Lähetä säännöllisesti testisähköposteja Listmonkin SMTP-asetussivun kautta ja testaa kampanjoita varmistaaksesi, että sähköpostit toimitetaan oikein.
* **Palautuksen käsittely**: Lähetä testikampanja tunnetusti virheelliseen sähköpostiosoitteeseen (esim. `bounce-test@yourdomain.com`, jos sinulla ei ole oikeaa sähköpostiosoitetta käsillä, vaikka tulokset voivat vaihdella). Tarkista kampanjan tilastot Listmonkissa hetken kuluttua nähdäksesi, onko palautus rekisteröity.
* **Sähköpostin otsikot**: Käytä työkaluja, kuten [Sähköpostin testaaja](https://www.mail-tester.com/), tai tarkista sähköpostin otsikot manuaalisesti varmistaaksesi, että SPF, DKIM ja DMARC läpäisevät viestin. Tämä osoittaa oikeat asetukset sähköpostin edelleenlähetyksen kautta.
* **Sähköpostin edelleenlähetyslokit**: Tarkista sähköpostin edelleenlähetyksen hallintapaneelin lokit, jos epäilet SMTP-palvelimelta johtuvia toimitusongelmia.

## Kehittäjän muistiinpanot {#developer-notes}

* **Mallipohjat**: Listmonk käyttää Go:n mallipohjamoottoria. Tutustu sen dokumentaatioon edistyneitä personointiominaisuuksia varten: `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API**: Listmonk tarjoaa kattavan REST-rajapinnan listojen, tilaajien, kampanjoiden, mallipohjien ja muiden hallintaan. Löydät API-dokumentaatiolinkin Listmonk-instanssisi alatunnisteesta.
* **Mukautetut kentät**: Määritä mukautettuja tilaajakenttiä kohdassa **Asetukset -> Tilaajakentät** tallentaaksesi lisätietoja.
* **Webhookit**: Palautusten lisäksi Listmonk voi lähettää webhookeja muista tapahtumista (esim. tilauksista), mikä mahdollistaa integroinnin muihin järjestelmiin.

## Johtopäätös {#conclusion}

Yhdistämällä Listmonkin itse isännöidyn tehon Forward Emailin turvalliseen ja yksityisyyttä kunnioittavaan toimitukseen, luot vankan ja eettisen sähköpostimarkkinointialustan. Säilytät täyden omistusoikeuden yleisötietoihisi ja hyödyt samalla korkeasta toimitettavuudesta ja automatisoiduista tietoturvaominaisuuksista.

Tämä ratkaisu tarjoaa skaalautuvan, kustannustehokkaan ja kehittäjäystävällisen vaihtoehdon suljetuille sähköpostipalveluille ja on täydellisessä linjassa avoimen lähdekoodin ohjelmistojen ja käyttäjien yksityisyyden eetoksen kanssa.

Hyvää lähettämistä! 🚀