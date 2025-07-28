# Itse isännöidyt julkaisut {#self-hosted-releases}

Tässä osiossa dokumentoidaan ForwardEmailin itse isännöidyn ratkaisun CI/CD-työnkulku ja selitetään, miten Docker-levykuvat rakennetaan, julkaistaan ja otetaan käyttöön.

## Sisällysluettelo {#table-of-contents}

* [Yleiskatsaus](#overview)
* [CI/CD-työnkulku](#cicd-workflow)
  * [GitHub-toimintojen työnkulku](#github-actions-workflow)
  * [Docker-kuvan rakenne](#docker-image-structure)
* [Käyttöönottoprosessi](#deployment-process)
  * [Asennus](#installation)
  * [Docker Composen konfigurointi](#docker-compose-configuration)
* [Huolto-ominaisuudet](#maintenance-features)
  * [Automaattiset päivitykset](#automatic-updates)
  * [Varmuuskopiointi ja palautus](#backup-and-restore)
  * [Todistuksen uusiminen](#certificate-renewal)
* [Versiointi](#versioning)
* [Kuvien käyttö](#accessing-images)
* [Osallistuminen](#contributing)

## Yleiskatsaus {#overview}

ForwardEmailin itse isännöity ratkaisu käyttää GitHub Actionsia Docker-kuvien automaattiseen luomiseen ja julkaisemiseen aina, kun uusi julkaisu luodaan. Nämä kuvat ovat sitten käyttäjien käytettävissä omille palvelimilleen käyttöönotettavaksi toimitetun asennusskriptin avulla.

> \[!NOTE]
> Löydät myös [itse isännöity blogi](https://forwardemail.net/blog/docs/self-hosted-solution)- ja [itse isännöidyn kehittäjän opas](https://forwardemail.net/self-hosted)-oppaat
>
> Tarkempia vaiheittaisia ohjeita varten katso [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu)- tai [Debian](https://forwardemail.net/guides/selfhosted-on-debian)-pohjaiset oppaat.

## CI/CD-työnkulku {#cicd-workflow}

### GitHub-toimintojen työnkulku {#github-actions-workflow}

Itse isännöidyn Docker-kuvan rakennus- ja julkaisuprosessi on määritelty `.github/workflows/docker-image-build-publish.yml`-kohteessa. Tämä työnkulku:

1. **Käynnistimet**: Suoritetaan automaattisesti, kun uusi GitHub-julkaisu julkaistaan
2. **Ympäristö**: Toimii Ubuntussa Node.js 18.20.4:n kanssa
3. **Käännösprosessi**:
* Tarkistaa repositorion koodin
* Asettaa Docker Buildxin monialustaisille koonneille
* Kirjauduu GitHub Container Registryyn (GHCR)
* Päivittää skeeman itse isännöityä käyttöönottoa varten
* Rakentaa Docker-kuvan käyttämällä `self-hosting/Dockerfile-selfhosted`-tunnistetta
* Merkitsee kuvan sekä julkaisuversiolla että `latest`-tunnisteella
* Työntää kuvat GitHub Container Registryyn

```yaml
# Key workflow steps
name: Build and Publish Self-Hosted Docker Image

on:
  release:
    types: [published]  # Trigger on new releases

jobs:
  build-and-publish:
    runs-on: ubuntu-latest
    steps:
      # Setup steps...

      # Build and publish Docker image
      - name: Build / Publish Docker image to GitHub Container Registry
        run: |
          IMAGE_NAME=ghcr.io/${{ github.repository }}-selfhosted:${{ github.ref_name }}
          docker build -f self-hosting/Dockerfile-selfhosted -t $IMAGE_NAME .
          docker tag $IMAGE_NAME ghcr.io/${{ github.repository }}-selfhosted:latest
          docker push $IMAGE_NAME
          docker push ghcr.io/${{ github.repository }}-selfhosted:latest
```

### Docker-kuvan rakenne {#docker-image-structure}

Docker-kuva rakennetaan käyttämällä `self-hosting/Dockerfile-selfhosted`-muuttujassa määriteltyä monivaiheista lähestymistapaa:

1. **Rakentajavaihe**:
* Käyttää Node.js 20:tä peruskuvana
* Asettaa `SELF_HOSTED=true`-ympäristömuuttujan
* Asentaa riippuvuudet pnpm:llä
* Kääntää sovelluksen tuotantotilassa

2. **Viimeinen vaihe**:
* Käyttää suppeampaa Node.js 20 -levykuvaa
* Asentaa vain tarvittavat järjestelmäriippuvuudet
* Luo tarvittavat hakemistot tietojen tallennukseen
* Kopioi rakennetun sovelluksen rakentajavaiheesta

Tämä lähestymistapa varmistaa, että lopullinen kuva on optimoitu koon ja turvallisuuden suhteen.

## Käyttöönottoprosessi {#deployment-process}

### Asennus {#installation}

Käyttäjät voivat ottaa käyttöön itse isännöidyn ratkaisun käyttämällä annettua asennusskriptiä:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/refs/heads/master/self-hosting/setup.sh)
```

Tämä skripti:

1. Kloonaa tietovaraston
2. Määrittää ympäristön
3. Määrittää DNS- ja palomuuriasetukset
4. Luo SSL-varmenteet
5. Noutaa uusimmat Docker-kuvat
6. Käynnistää palvelut Docker Composen avulla

### Dockerin kirjoitusasetukset {#docker-compose-configuration}

`docker-compose-self-hosted.yml`-tiedosto määrittää kaikki itse isännöidyn ratkaisun vaatimat palvelut:

* **Verkko**: Pääkäyttöliittymä
* **API**: API-palvelin ohjelmalliseen käyttöön
* **SMTP**: Sähköpostin lähetyspalvelu
* **IMAP/POP3**: Sähköpostin hakupalvelut
* **MX**: Sähköpostinvaihtopalvelu
* **CalDAV**: Kalenteripalvelu
* **CardDAV**: Yhteystietopalvelu
* **MongoDB**: Tietokanta käyttäjätietojen tallentamiseen
* **Redis**: Muistissa oleva tietovarasto
* **SQLite**: Tietokanta sähköpostien tallentamiseen

Jokainen palvelu käyttää samaa Docker-kuvaa, mutta eri aloituskohdilla, mikä mahdollistaa modulaarisen arkkitehtuurin ja yksinkertaistaa ylläpitoa.

## Ylläpito-ominaisuudet {#maintenance-features}

Itse isännöity ratkaisu sisältää useita ylläpito-ominaisuuksia:

### Automaattiset päivitykset {#automatic-updates}

Käyttäjät voivat ottaa käyttöön automaattiset päivitykset, jotka:

* Hae uusin Docker-levykuva joka yö
* Käynnistä palvelut uudelleen päivitetyllä levykuvalla
* Kirjaa päivitysprosessi

```bash
# Setup auto-updates (runs at 1 AM daily)
0 1 * * * docker compose -f /path/to/docker-compose-self-hosted.yml pull && docker compose -f /path/to/docker-compose-self-hosted.yml up -d >> /var/log/autoupdate.log 2>&1
```

### Varmuuskopiointi ja palautus {#backup-and-restore}

Asennus tarjoaa vaihtoehtoja:

* Säännöllisten varmuuskopioiden määrittäminen S3-yhteensopivaan tallennustilaan
* MongoDB-, Redis- ja SQLite-tietojen varmuuskopiointi
* Varmuuskopioista palauttaminen vikatilanteessa

### Varmenteen uusiminen {#certificate-renewal}

SSL-varmenteita hallitaan automaattisesti, ja niissä on asetuksia:

* Luo uusia varmenteita asennuksen aikana
* Uudista varmenteet tarvittaessa
* Määritä DKIM sähköpostitodennusta varten

## Versiointi {#versioning}

Jokainen GitHub-julkaisu luo uuden Docker-kuvan, johon on merkitty seuraava tunniste:

1. Tarkka julkaisuversio (esim. `v1.0.0`)
2. Uusimman julkaisun `latest`-tunniste

Käyttäjät voivat valita tietyn version vakauden takaamiseksi tai `latest`-tunnisteen saadakseen aina uusimmat ominaisuudet.

## Kuvien käyttö {#accessing-images}

Docker-kuvat ovat julkisesti saatavilla osoitteessa:

* `ghcr.io/forwardemail/forwardemail.net-selfhosted:latest`
* `ghcr.io/forwardemail/forwardemail.net-selfhosted:v1.0.0` (esimerkki versiotunnisteesta)

Näiden kuvien hakemiseen ei tarvita todennusta.

## Avustava {#contributing}

Voit osallistua itse isännöityyn ratkaisuun seuraavasti:

1. Tee muutokset asiaankuuluviin tiedostoihin `self-hosting`-hakemistossa.
2. Testaa paikallisesti tai Ubuntu-pohjaisella VPS:llä käyttämällä annettua `setup.sh`-skriptiä.
3. Lähetä pull-pyyntö.
4. Kun yhdistäminen ja uusi julkaisu on luotu, CI-työnkulku rakentaa ja julkaisee päivitetyn Docker-kuvan automaattisesti.