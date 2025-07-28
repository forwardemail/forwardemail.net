# Self-Hosted Releases {#self-hosted-releases}

Ez a rész a ForwardEmail saját üzemeltetésű megoldásának CI/CD-munkafolyamatát dokumentálja, elmagyarázva, hogyan készülnek, publikálnak és telepítenek a Docker-képfájlokat.

## Table of Contents {#table-of-contents}

* [Áttekintés](#overview)
* [CI/CD munkafolyamat](#cicd-workflow)
  * [GitHub Actions munkafolyamat](#github-actions-workflow)
  * [Docker képstruktúra](#docker-image-structure)
* [Telepítési folyamat](#deployment-process)
  * [Telepítés](#installation)
  * [Docker Compose konfiguráció](#docker-compose-configuration)
* [Karbantartási funkciók](#maintenance-features)
  * [Automatikus frissítések](#automatic-updates)
  * [Biztonsági mentés és visszaállítás](#backup-and-restore)
  * [Tanúsítvány megújítása](#certificate-renewal)
* [Verziószámítás](#versioning)
* [Képek elérése](#accessing-images)
* [Hozzájárulás](#contributing)

## Overview {#overview}

A ForwardEmail saját üzemeltetésű megoldása a GitHub Actions segítségével automatikusan létrehozza és közzéteszi a Docker-képeket, amikor új kiadás jön létre. Ezeket a lemezképeket ezután a felhasználók saját kiszolgálóikon telepíthetik a mellékelt telepítőszkript segítségével.

> \[!NOTE]
> There is also our [self-hosted blog](https://forwardemail.net/blog/docs/self-hosted-solution) and [self-hosted developer guide](https://forwardemail.net/self-hosted)
>
> And for the more broken down step-by-step versions see the [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) or [Debian](https://forwardemail.net/guides/selfhosted-on-debian) based guides.

## CI/CD Workflow {#cicd-workflow}

### GitHub Actions Workflow {#github-actions-workflow}

A saját üzemeltetésű Docker rendszerkép létrehozási és közzétételi folyamatát a `.github/workflows/docker-image-build-publish.yml` fájlban definiálták. Ez a munkafolyamat:

1. **Triggerek**: Automatikusan lefut, amikor új GitHub kiadás jelenik meg.
2. **Környezet**: Ubuntun fut Node.js 18.20.4 verzióval.
3. **Formálási folyamat**:
* Ellenőrzi a repository kódot.
* Beállítja a Docker Buildx-et többplatformos buildekhez.
* Bejelentkezik a GitHub Container Registry-be (GHCR).
* Frissíti a sémát az önállóan üzemeltetett telepítéshez.
* Felépíti a Docker rendszerképet a `self-hosting/Dockerfile-selfhosted` használatával.
* Megcímkézi a rendszerképet a kiadási verzióval és a `latest` kóddal.
* Elküldi a rendszerképeket a GitHub Container Registry-be.

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

A Docker rendszerkép a `self-hosting/Dockerfile-selfhosted` kódban definiált többlépcsős megközelítéssel épül fel:

1. **Builder Stage**:
* A Node.js 20-at használja alapképként
* Beállítja a `SELF_HOSTED=true` környezeti változót
* Telepíti a függőségeket a pnpm paranccsal
* Éles módban fordítja az alkalmazást

2. **Utolsó szakasz**:
* Egy karcsúbb Node.js 20-as rendszerképet használ
* Csak a szükséges rendszerfüggőségeket telepíti
* Létrehozza a szükséges könyvtárakat az adattároláshoz
* Átmásolja a felépített alkalmazást a builder szakaszból

Ez a megközelítés biztosítja a végső kép méretének és biztonságának optimalizálását.

## Telepítési folyamat {#deployment-process}

### Telepítés {#installation}

A felhasználók telepíthetik a saját üzemeltetésű megoldást a mellékelt telepítőszkript segítségével:

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

### Docker írási konfiguráció {#docker-compose-configuration}

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

Minden szolgáltatás ugyanazt a Docker-képet használja, de különböző belépési pontokkal, ami lehetővé teszi a moduláris architektúrát, miközben leegyszerűsíti a karbantartást.

## Karbantartási funkciók {#maintenance-features}

A saját üzemeltetésű megoldás számos karbantartási funkciót tartalmaz:

### Automatikus frissítések {#automatic-updates}

A felhasználók engedélyezhetik az automatikus frissítéseket, amelyek:

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

Az SSL-tanúsítványokat a rendszer automatikusan kezeli a következő opciókkal:

* Új tanúsítványok generálása a beállítás során
* Tanúsítványok megújítása szükség esetén
* DKIM konfigurálása e-mail hitelesítéshez

## Verziókezelés {#versioning}

Minden GitHub-kiadás új Docker-képet hoz létre, amely a következő címkékkel van ellátva:

1. A konkrét kiadási verzió (pl. `v1.0.0`)
2. A legújabb kiadás `latest` címkéje

A felhasználók választhatnak egy adott verziót a stabilitás érdekében, vagy a `latest` címke segítségével mindig a legújabb funkciókat kaphatják meg.

## Képek elérése {#accessing-images}

A Docker képek nyilvánosan elérhetők a következő címen:

* `ghcr.io/forwardemail/forwardemail.net-selfhosted:latest`
* `ghcr.io/forwardemail/forwardemail.net-selfhosted:v1.0.0` (példa verziócímkére)

A képek letöltéséhez nincs szükség hitelesítésre.

## Hozzájárulás {#contributing}

A saját üzemeltetésű megoldáshoz való hozzájárulás:

1. Módosítsa a megfelelő fájlokat a `self-hosting` könyvtárban.
2. Tesztelje helyben vagy egy Ubuntu alapú VPS-en a mellékelt `setup.sh` szkript használatával.
3. Küldjön be egy pull request-et.
4. Az egyesítés és az új kiadás létrehozása után a CI munkafolyamat automatikusan felépíti és közzéteszi a frissített Docker-képet.