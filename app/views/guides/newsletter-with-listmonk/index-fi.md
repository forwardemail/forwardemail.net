# Listmonk ja Forward Email turvalliseen uutiskirjeiden toimitukseen {#listmonk-with-forward-email-for-secure-newsletter-delivery}


## Sisällysluettelo {#table-of-contents}

* [Yleiskatsaus](#overview)
* [Miksi Listmonk ja Forward Email](#why-listmonk-and-forward-email)
* [Esivaatimukset](#prerequisites)
* [Asennus](#installation)
  * [1. Päivitä palvelimesi](#1-update-your-server)
  * [2. Asenna riippuvuudet](#2-install-dependencies)
  * [3. Lataa Listmonk-konfiguraatio](#3-download-listmonk-configuration)
  * [4. Määritä palomuuri (UFW)](#4-configure-firewall-ufw)
  * [5. Määritä HTTPS-yhteys](#5-configure-https-access)
  * [6. Käynnistä Listmonk](#6-start-listmonk)
  * [7. Määritä Forward Email SMTP Listmonkissa](#7-configure-forward-email-smtp-in-listmonk)
  * [8. Määritä bounce-käsittely](#8-configure-bounce-processing)
* [Testaus](#testing)
  * [Luo postituslista](#create-a-mailing-list)
  * [Lisää tilaajia](#add-subscribers)
  * [Luo ja lähetä kampanja](#create-and-send-a-campaign)
* [Varmistus](#verification)
* [Kehittäjän muistiinpanot](#developer-notes)
* [Yhteenveto](#conclusion)


## Yleiskatsaus {#overview}

Tämä opas tarjoaa kehittäjille vaiheittaiset ohjeet [Listmonkin](https://listmonk.app/) – tehokkaan avoimen lähdekoodin uutiskirje- ja postituslistanhallinnan – käyttöönottoon yhdessä [Forward Emailin](https://forwardemail.net/) kanssa SMTP-palveluntarjoajana. Tämä yhdistelmä mahdollistaa kampanjoiden tehokkaan hallinnan samalla kun varmistetaan turvallinen, yksityinen ja luotettava sähköpostin toimitus.

* **Listmonk**: Hallinnoi tilaajia, listojen järjestämistä, kampanjoiden luontia ja suorituskyvyn seurantaa.
* **Forward Email**: Toimii turvallisena SMTP-palvelimena, hoitaen sähköpostien varsinaisen lähetyksen sisäänrakennetuilla suojausominaisuuksilla kuten SPF, DKIM, DMARC ja TLS-salaus.

Näiden kahden integroinnilla säilytät täyden hallinnan tietoihisi ja infrastruktuuriisi samalla kun hyödynnät Forward Emailin vankkaa toimitusjärjestelmää.


## Miksi Listmonk ja Forward Email {#why-listmonk-and-forward-email}

* **Avoin lähdekoodi**: Sekä Listmonk että Forward Emailin periaatteet korostavat läpinäkyvyyttä ja hallintaa. Isännöit Listmonkia itse, omistat tietosi.
* **Yksityisyyteen keskittyvä**: Forward Email on rakennettu yksityisyys mielessä pitäen, minimoiden tietojen säilytyksen ja keskittyen turvalliseen siirtoon.
* **Kustannustehokas**: Listmonk on ilmainen, ja Forward Email tarjoaa anteliaat ilmaiset tasot sekä edulliset maksulliset suunnitelmat, tehden tästä budjettiystävällisen ratkaisun.
* **Skaalautuvuus**: Listmonk on erittäin suorituskykyinen, ja Forward Emailin infrastruktuuri on suunniteltu luotettavaan toimitukseen suuressa mittakaavassa.
* **Kehittäjäystävällinen**: Listmonk tarjoaa vankan API:n, ja Forward Email tarjoaa suoraviivaisen SMTP-integraation ja webhookit.


## Esivaatimukset {#prerequisites}

Ennen aloittamista varmista, että sinulla on seuraavat:

* Virtuaalipalvelin (VPS), jossa on uusin Linux-jakelu (suositellaan Ubuntu 20.04+), vähintään 1 CPU ja 1GB RAM (suositellaan 2GB).
  * Tarvitsetko palveluntarjoajan? Katso [suositeltu VPS-lista](https://github.com/forwardemail/awesome-mail-server-providers).
* Hallitsemasi verkkotunnus (DNS-käyttöoikeus vaaditaan).
* Aktiivinen tili [Forward Emailissa](https://forwardemail.net/).
* Root- tai `sudo`-käyttöoikeus VPS:lläsi.
* Perustason Linux-komentorivitoimintojen tuntemus.


## Asennus {#installation}

Nämä vaiheet ohjaavat sinut Listmonkin asentamiseen Dockerin ja Docker Composen avulla VPS:lläsi.

### 1. Päivitä palvelimesi {#1-update-your-server}

Varmista, että järjestelmän pakettien lista ja asennetut paketit ovat ajan tasalla.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Asenna riippuvuudet {#2-install-dependencies}

Asenna Docker, Docker Compose ja UFW (Uncomplicated Firewall).

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Lataa Listmonk-konfiguraatio {#3-download-listmonk-configuration}

Luo hakemisto Listmonkille ja lataa virallinen `docker-compose.yml`-tiedosto.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

Tämä tiedosto määrittelee Listmonkin sovelluskontin ja sen vaatiman PostgreSQL-tietokantakontin.
### 4. Määritä palomuuri (UFW) {#4-configure-firewall-ufw}

Salli välttämätön liikenne (SSH, HTTP, HTTPS) palomuurin läpi. Jos SSH käyttää ei-standardiporttia, säädä asetukset sen mukaisesti.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

Vahvista palomuurin käyttöönotto, kun sinulta kysytään.

### 5. Määritä HTTPS-yhteys {#5-configure-https-access}

Listmonkin ajaminen HTTPS:n yli on tärkeää turvallisuuden kannalta. Sinulla on kaksi päävaihtoehtoa:

#### Vaihtoehto A: Cloudflare-välityspalvelimen käyttö (Suositeltu yksinkertaisuuden vuoksi) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

Jos verkkotunnuksesi DNS-hallinta on Cloudflaren käsissä, voit hyödyntää heidän välityspalvelintoimintoaan helppoa HTTPS-yhteyttä varten.

1. **Ohjaa DNS**: Luo Cloudflareen `A`-tietue Listmonk-aliverkkotunnuksellesi (esim. `listmonk.sinundomainisi.com`), joka osoittaa VPS:n IP-osoitteeseen. Varmista, että **Proxy status** on asetettu **Proxied** (oranssi pilvi).
2. **Muokkaa Docker Composea**: Muokkaa lataamaasi `docker-compose.yml`-tiedostoa:
   ```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
   Tämä tekee Listmonkista sisäisesti portissa 80 saavutettavan, jota Cloudflare voi sitten välittää ja suojata HTTPS:llä.

#### Vaihtoehto B: Käänteisen välityspalvelimen käyttö (Nginx, Caddy jne.) {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

Vaihtoehtoisesti voit asentaa VPS:lle käänteisen välityspalvelimen, kuten Nginxin tai Caddyn, hoitamaan HTTPS-päätepisteen ja välittämään pyynnöt Listmonkille (joka oletuksena toimii portissa 9000).

* Säilytä oletus `ports: - "127.0.0.1:9000:9000"` `docker-compose.yml`-tiedostossa, jotta Listmonk on saavutettavissa vain paikallisesti.
* Määritä valitsemasi käänteinen välityspalvelin kuuntelemaan porteissa 80 ja 443, hoitamaan SSL-varmenteen hankinta (esim. Let's Encryptin kautta) ja välittämään liikenne osoitteeseen `http://127.0.0.1:9000`.
* Yksityiskohtainen käänteisen välityspalvelimen asennus on tämän oppaan ulkopuolella, mutta netistä löytyy runsaasti ohjeita.

### 6. Käynnistä Listmonk {#6-start-listmonk}

Siirry takaisin `listmonk`-hakemistoosi (jos et ole siellä) ja käynnistä kontit irrotetussa tilassa.

```bash
cd ~/listmonk # Tai hakemisto, johon tallensit docker-compose.yml-tiedoston
docker compose up -d
```

Docker lataa tarvittavat kuvat ja käynnistää Listmonkin sovellus- ja tietokantakontit. Ensimmäisellä kerralla se voi kestää minuutin tai kaksi.

✅ **Pääsy Listmonkiin**: Sinun pitäisi nyt pystyä käyttämään Listmonkin verkkokäyttöliittymää määrittämäsi verkkotunnuksen kautta (esim. `https://listmonk.sinundomainisi.com`).

### 7. Määritä Forward Email SMTP Listmonkissa {#7-configure-forward-email-smtp-in-listmonk}

Seuraavaksi määritä Listmonk lähettämään sähköposteja Forward Email -tilisi kautta.

1. **Ota SMTP käyttöön Forward Emailissa**: Varmista, että olet luonut SMTP-tunnukset Forward Email -tilisi hallintapaneelissa. Noudata ohjetta [Forward Email guide to send email with a custom domain via SMTP](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp), jos et ole vielä tehnyt tätä.
2. **Määritä Listmonk**: Kirjaudu Listmonkin hallintapaneeliin.
   * Siirry kohtaan **Asetukset -> SMTP**.

   * Listmonk tukee sisäänrakennetusti Forward Emailia. Valitse tarjoajalistasta **ForwardEmail** tai syötä tiedot manuaalisesti seuraavasti:

     | Asetus            | Arvo                                                                                                                |
     | :---------------- | :------------------------------------------------------------------------------------------------------------------ |
     | **Isäntä**        | `smtp.forwardemail.net`                                                                                            |
     | **Portti**        | `465`                                                                                                              |
     | **Todennusprotokolla** | `LOGIN`                                                                                                        |
     | **Käyttäjätunnus**| Forward Email -tilisi **SMTP-käyttäjätunnus**                                                                       |
     | **Salasana**      | Forward Email -tilisi **SMTP-salasana**                                                                             |
     | **TLS**           | `SSL/TLS`                                                                                                          |
     | **Lähettäjän sähköposti** | Haluamasi `From`-osoite (esim. `newsletter@sinundomainisi.com`). Varmista, että tämä verkkotunnus on määritetty Forward Emailissa. |
* **Tärkeää**: Käytä aina porttia `465` yhdessä `SSL/TLS` kanssa turvallisiin yhteyksiin Forward Emailin kanssa (suositeltu). Portti `587` STARTTLS:llä on myös tuettu, mutta SSL/TLS on suositeltavampi.

   * Klikkaa **Tallenna**.
3. **Lähetä testisähköposti**: Käytä "Lähetä testisähköposti" -painiketta SMTP-asetussivulla. Syötä vastaanottajan osoite, johon sinulla on pääsy, ja klikkaa **Lähetä**. Varmista, että sähköposti saapuu vastaanottajan postilaatikkoon.

### 8. Konfiguroi Bounce-käsittely {#8-configure-bounce-processing}

Bounce-käsittely mahdollistaa Listmonkin automaattisen käsittelyn sähköposteille, joita ei voitu toimittaa (esim. virheellisten osoitteiden vuoksi). Forward Email tarjoaa webhookin, joka ilmoittaa Listmonkille bounce-tapahtumista.

#### Forward Emailin asetukset {#forward-email-setup}

1. Kirjaudu sisään [Forward Email -hallintapaneeliin](https://forwardemail.net/).
2. Siirry kohtaan **Domains**, valitse käyttämäsi lähetysalue ja mene sen **Settings**-sivulle.
3. Selaa alas kohtaan **Bounce Webhook URL**.
4. Syötä seuraava URL, korvaten `<your_listmonk_domain>` sillä varsinaisella domainilla tai alidomainilla, josta Listmonkisi on saavutettavissa:
   ```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
   *Esimerkki*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. Selaa vielä alemmaksi kohtaan **Webhook Signature Payload Verification Key**.
6. **Kopioi** generoitu varmennusavain. Tarvitset tätä Listmonkissa.
7. Tallenna muutokset Forward Email -domainin asetuksissa.

#### Listmonkin asetukset {#listmonk-setup}

1. Mene Listmonkin hallintapaneelissa kohtaan **Settings -> Bounces**.
2. Ota käyttöön **Enable bounce processing**.
3. Ota käyttöön **Enable bounce webhooks**.
4. Selaa alas kohtaan **Webhook Providers**.
5. Ota käyttöön **Forward Email**.
6. Liitä Forward Email -hallintapaneelista kopioimasi **Webhook Signature Payload Verification Key** kenttään **Forward Email Key**.
7. Klikkaa sivun alareunasta **Save**.
8. Bounce-käsittely on nyt konfiguroitu! Kun Forward Email havaitsee bounce-tapahtuman Listmonkin lähettämässä sähköpostissa, se ilmoittaa siitä Listmonkille webhookin kautta, ja Listmonk merkitsee tilaajan asianmukaisesti.
9. Suorita alla olevat vaiheet kohdassa [Testing](#testing) varmistaaksesi, että kaikki toimii.

## Testaus {#testing}

Tässä nopea yleiskatsaus Listmonkin keskeisistä toiminnoista:

### Luo postituslista {#create-a-mailing-list}

* Mene sivupalkista kohtaan **Lists**.
* Klikkaa **New List**.
* Täytä tiedot (Nimi, Tyyppi: Julkinen/Yksityinen, Kuvaus, Tagit) ja **Tallenna**.

### Lisää tilaajia {#add-subscribers}

* Siirry kohtaan **Subscribers**.
* Voit lisätä tilaajia:
  * **Manuaalisesti**: Klikkaa **New Subscriber**.
  * **Tuonti**: Klikkaa **Import Subscribers** ladataksesi CSV-tiedoston.
  * **API**: Käytä Listmonkin APIa ohjelmalliseen lisäykseen.
* Määritä tilaajat yhdelle tai useammalle listalle luomisen tai tuonnin yhteydessä.
* **Parhaat käytännöt**: Käytä kaksivaiheista vahvistusprosessia (double opt-in). Määritä tämä kohdassa **Settings -> Opt-in & Subscriptions**.

### Luo ja lähetä kampanja {#create-and-send-a-campaign}

* Mene kohtaan **Campaigns** -> **New Campaign**.
* Täytä kampanjan tiedot (Nimi, Aihe, Lähettäjän sähköposti, Lähetyslista(t)).
* Valitse sisältötyyppi (Rich Text/HTML, Plain Text, Raw HTML).
* Laadi sähköpostin sisältö. Voit käyttää mallimuuttujia kuten `{{ .Subscriber.Email }}` tai `{{ .Subscriber.FirstName }}`.
* **Lähetä aina ensin testisähköposti!** Käytä "Send Test" -vaihtoehtoa esikatsellaksesi sähköpostia omassa postilaatikossasi.
* Kun olet tyytyväinen, klikkaa **Start Campaign** lähettääksesi heti tai ajoita lähetys myöhemmäksi.

## Varmistus {#verification}

* **SMTP-toimitus**: Lähetä säännöllisesti testisähköposteja Listmonkin SMTP-asetussivun kautta ja testikampanjoita varmistaaksesi, että sähköpostit toimitetaan oikein.
* **Bounce-käsittely**: Lähetä testikampanja tunnettuun virheelliseen sähköpostiosoitteeseen (esim. `bounce-test@yourdomain.com`, jos sinulla ei ole oikeaa osoitetta, tulokset voivat vaihdella). Tarkista kampanjatilastot Listmonkissa hetken kuluttua nähdäksesi, onko bounce rekisteröity.
* **Sähköpostin otsikot**: Käytä työkaluja kuten [Mail-Tester](https://www.mail-tester.com/) tai tarkista sähköpostin otsikot manuaalisesti varmistaaksesi, että SPF, DKIM ja DMARC menevät läpi, mikä osoittaa oikean asetuksen Forward Emailin kautta.
* **Forward Emailin lokit**: Tarkista Forward Email -hallintapaneelin lokit, jos epäilet toimitusongelmia SMTP-palvelimelta.
## Kehittäjän Muistiinpanot {#developer-notes}

* **Mallinnus**: Listmonk käyttää Go:n mallinnusmoottoria. Tutustu sen dokumentaatioon edistyneeseen personointiin: `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API**: Listmonk tarjoaa kattavan REST API:n listojen, tilaajien, kampanjoiden, mallien ja muun hallintaan. Löydät API-dokumentaation linkin Listmonk-instanssisi alatunnisteesta.
* **Mukautetut Kentät**: Määrittele mukautetut tilaajakentät kohdassa **Asetukset -> Tilaajakentät** tallentaaksesi lisätietoja.
* **Webhookit**: Palautusten lisäksi Listmonk voi lähettää webhookkeja muista tapahtumista (esim. tilaukset), mahdollistaen integraation muihin järjestelmiin.


## Yhteenveto {#conclusion}

Yhdistämällä Listmonkin itseisännöity voima Forward Emailin turvalliseen ja yksityisyyttä kunnioittavaan toimitukseen luot vahvan ja eettisen sähköpostimarkkinointialustan. Säilytät täyden omistajuuden yleisötiedoistasi samalla kun hyödyt korkeasta toimitettavuudesta ja automatisoiduista turvallisuusominaisuuksista.

Tämä ratkaisu tarjoaa skaalautuvan, kustannustehokkaan ja kehittäjäystävällisen vaihtoehdon suljetuille sähköpostipalveluille, sopien täydellisesti avoimen lähdekoodin ohjelmistojen ja käyttäjien yksityisyyden arvoihin.

Onnellista lähettämistä! 🚀
