# Saját tárhelyen futó kiadások {#self-hosted-releases}

Ez a szakasz a ForwardEmail saját üzemeltetésű megoldásának CI/CD-munkafolyamatát dokumentálja, ismertetve a Docker-lemezképek létrehozásának, közzétételének és telepítésének módját.

## Tartalomjegyzék {#table-of-contents}

* [Áttekintés](#overview)
* [CI/CD munkafolyamat](#cicd-workflow)
  * [GitHub Actions Workflow](#github-actions-workflow)
  * [Docker képstruktúra](#docker-image-structure)
* [Telepítési folyamat](#deployment-process)
  * [Telepítés](#installation)
  * [Docker Composition konfiguráció](#docker-compose-configuration)
* [Karbantartási jellemzők](#maintenance-features)
  * [Automatikus frissítések](#automatic-updates)
  * [Biztonsági mentés és visszaállítás](#backup-and-restore)
  * [Tanúsítvány megújítása](#certificate-renewal)
* [Verziókezelés](#versioning)
* [Képek elérése](#accessing-images)
* [Hozzájárulás](#contributing)

## Áttekintés {#overview}

A ForwardEmail saját üzemeltetésű megoldása a GitHub Actions segítségével automatikusan létrehozza és közzéteszi a Docker-lemezképeket, valahányszor új kiadás készül. Ezeket a lemezképeket ezután a felhasználók a mellékelt telepítőszkript segítségével telepíthetik saját szervereiken.

> \[!NOTE]
> Létezik még a [saját tárhelyen tárolt blog](https://forwardemail.net/blog/docs/self-hosted-solution) és [saját tárhelyen futó fejlesztői útmutató](https://forwardemail.net/self-hosted) is.
>
> A részletesebb, lépésről lépésre bemutatott verziókért lásd a [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) vagy [Debian](https://forwardemail.net/guides/selfhosted-on-debian) alapú útmutatókat.

## CI/CD munkafolyamat {#cicd-workflow}

### GitHub műveletek munkafolyamata {#github-actions-workflow}

A saját üzemeltetésű Docker rendszerkép létrehozási és közzétételi folyamata a `.github/workflows/docker-image-build-publish.yml` fájlban van definiálva. Ez a munkafolyamat:

1. **Triggerek**: Automatikusan lefut, amikor új GitHub kiadás jelenik meg.
2. **Környezet**: Ubuntun fut Node.js 18.20.4 verzióval.
3. **Formálási folyamat**:
* Ellenőrzi a repository kódot.
* Beállítja a Docker Buildx-et többplatformos buildekhez.
* Bejelentkezik a GitHub Container Registry-be (GHCR).
* Frissíti a sémát az önállóan üzemeltetett telepítéshez.
* Felépíti a Docker rendszerképet a `self-hosting/Dockerfile-selfhosted` használatával.
* Megcímkézi a rendszerképet a kiadási verzióval és a `latest`-gyel is.
* Átküldi a rendszerképeket a GitHub Container Registry-be.

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

### Docker képstruktúra {#docker-image-structure}

A Docker-rendszerkép a `self-hosting/Dockerfile-selfhosted`-ban definiált többlépcsős megközelítéssel épül fel:

1. **Builder Stage**:
* A Node.js 20-at használja alapképként
* Beállítja a `SELF_HOSTED=true` környezeti változót
* Függőségeket telepít a pnpm paranccsal
* Az alkalmazást éles módban építi fel

2. **Utolsó szakasz**:
* Egy karcsúbb Node.js 20-as rendszerképet használ
* Csak a szükséges rendszerfüggőségeket telepíti
* Létrehozza a szükséges könyvtárakat az adattároláshoz
* Átmásolja a felépített alkalmazást a builder szakaszból

Ez a megközelítés biztosítja, hogy a végső kép mérete és biztonsága optimalizált legyen.

## Telepítési folyamat {#deployment-process}

### Telepítés {#installation}

A felhasználók a megadott telepítőszkript segítségével telepíthetik az önállóan üzemeltetett megoldást:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/refs/heads/master/self-hosting/setup.sh)
```

Ez a szkript:

1. Klónozza a tárházat
2. Beállítja a környezetet
3. Konfigurálja a DNS- és tűzfalbeállításokat
4. SSL-tanúsítványokat generál
5. Letölti a legújabb Docker-lemezképeket
6. Elindítja a szolgáltatásokat a Docker Compose használatával

### Docker Composite konfiguráció {#docker-compose-configuration}

A `docker-compose-self-hosted.yml` fájl határozza meg az önállóan üzemeltetett megoldáshoz szükséges összes szolgáltatást:

* **Web**: Fő webes felület
* **API**: API szerver programozott hozzáféréshez
* **SMTP**: E-mail küldő szolgáltatás
* **IMAP/POP3**: E-mail lekérő szolgáltatások
* **MX**: Levélcsere szolgáltatás
* **CalDAV**: Naptár szolgáltatás
* **CardDAV**: Névjegy szolgáltatás
* **MongoDB**: Felhasználói adatok tárolására szolgáló adatbázis
* **Redis**: Memórián belüli adattároló
* **SQLite**: E-mailek tárolására szolgáló adatbázis

Minden szolgáltatás ugyanazt a Docker-rendszerképet használja, de eltérő belépési pontokkal, ami lehetővé teszi a moduláris architektúrát, miközben egyszerűsíti a karbantartást.

## Karbantartási funkciók {#maintenance-features}

Az önállóan üzemeltetett megoldás számos karbantartási funkciót tartalmaz:

### Automatikus frissítések {#automatic-updates}

A felhasználók engedélyezhetik az automatikus frissítéseket, amelyek a következőket teszik:

* A legújabb Docker rendszerkép letöltése éjszakánként
* Szolgáltatások újraindítása a frissített rendszerképpel
* Frissítési folyamat naplózása

```bash
# Setup auto-updates (runs at 1 AM daily)
0 1 * * * docker compose -f /path/to/docker-compose-self-hosted.yml pull && docker compose -f /path/to/docker-compose-self-hosted.yml up -d >> /var/log/autoupdate.log 2>&1
```

### Biztonsági mentés és visszaállítás {#backup-and-restore}

A beállítás a következő lehetőségeket kínálja:

* Rendszeres biztonsági mentések konfigurálása S3-kompatibilis tárolókra
* MongoDB, Redis és SQLite adatok biztonsági mentése
* Visszaállítás biztonsági mentésekből hiba esetén

### Tanúsítvány megújítása {#certificate-renewal}

Az SSL-tanúsítványok automatikusan kezelődnek, a következő lehetőségekkel:

* Új tanúsítványok generálása a beállítás során
* Tanúsítványok megújítása szükség esetén
* DKIM konfigurálása e-mail hitelesítéshez

## Verziókezelés {#versioning}

Minden GitHub kiadás létrehoz egy új Docker rendszerképet, amely a következő címkével van ellátva:

1. A konkrét kiadási verzió (pl. `v1.0.0`)
2. A legújabb kiadás `latest` címkéje

A felhasználók választhatnak egy adott verzió használatát a stabilitás érdekében, vagy a `latest` címke használatával mindig a legújabb funkciókat kapják meg.

## Képek elérése {#accessing-images}

A Docker képek nyilvánosan elérhetők a következő címen:

* `ghcr.io/forwardemail/forwardemail.net-selfhosted:latest`
* `ghcr.io/forwardemail/forwardemail.net-selfhosted:v1.0.0` (példa verziócímkére)

Nincs szükség hitelesítésre ezen képek lekéréséhez.

## Közreműködő {#contributing}

A saját üzemeltetésű megoldáshoz való hozzájárulás:

1. Módosítsa a `self-hosting` könyvtárban található releváns fájlokat.
2. Tesztelje helyben vagy egy Ubuntu alapú VPS-en a mellékelt `setup.sh` szkript használatával.
3. Küldjön be egy pull request-et.
4. Az egyesítés és az új kiadás létrehozása után a CI munkafolyamat automatikusan felépíti és közzéteszi a frissített Docker-képet.