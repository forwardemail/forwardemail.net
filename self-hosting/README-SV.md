# Self-Hosted Releases {#self-hosted-releases}

Det här avsnittet dokumenterar CI/CD-arbetsflödet för ForwardEmails egenvärdbaserade lösning, och förklarar hur Docker-avbildningar byggs, publiceras och distribueras.

## Table of Contents {#table-of-contents}

* [Översikt](#overview)
* [CI/CD arbetsflöde](#cicd-workflow)
  * [Arbetsflöde för GitHub Actions](#github-actions-workflow)
  * [Docker bildstruktur](#docker-image-structure)
* [Implementeringsprocess](#deployment-process)
  * [Installation](#installation)
  * [Docker Compose-konfiguration](#docker-compose-configuration)
* [Underhållsfunktioner](#maintenance-features)
  * [Automatiska uppdateringar](#automatic-updates)
  * [Säkerhetskopiera och återställa](#backup-and-restore)
  * [Certifikatförnyelse](#certificate-renewal)
* [Versionering](#versioning)
* [Tillgång till bilder](#accessing-images)
* [Bidrar](#contributing)

## Overview {#overview}

ForwardEmails självhostade lösning använder GitHub Actions för att automatiskt bygga och publicera Docker-bilder när en ny version skapas. Dessa bilder är sedan tillgängliga för användare att distribuera på sina egna servrar med hjälp av det medföljande installationsskriptet.

> \[!NOTE]
> There is also our [self-hosted blog](https://forwardemail.net/blog/docs/self-hosted-solution) and [self-hosted developer guide](https://forwardemail.net/self-hosted)
>
> And for the more broken down step-by-step versions see the [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) or [Debian](https://forwardemail.net/guides/selfhosted-on-debian) based guides.

## CI/CD Workflow {#cicd-workflow}

### GitHub Actions Workflow {#github-actions-workflow}

Processen för att bygga och publicera Docker-avbildningar med egen host definieras i `.github/workflows/docker-image-build-publish.yml`. Detta arbetsflöde:

1. **Triggers**: Körs automatiskt när en ny GitHub-release publiceras
2. **Environment**: Körs på Ubuntu med Node.js 18.20.4
3. **Byggprocess**:
* Kontrollerar repository-koden
* Konfigurerar Docker Buildx för flerplattformsbyggen
* Loggar in i GitHub Container Registry (GHCR)
* Uppdaterar schemat för självhostad distribution
* Bygger Docker-avbildningen med `self-hosting/Dockerfile-selfhosted`
* Taggar avbildningen med både releaseversionen och `latest`
* Skickar avbildningarna till GitHub Container Registry

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

### Docker-bildstruktur {#docker-image-structure}

Docker-avbildningen är byggd med en flerstegsmetod som definieras i `self-hosting/Dockerfile-selfhosted`:

1. **Byggsteg**:
* Använder Node.js 20 som basavbildning
* Ställer in miljövariabeln `SELF_HOSTED=true`
* Installerar beroenden med pnpm
* Bygger applikationen i produktionsläge

2. **Slutsteg**:
* Använder en smalare Node.js 20-avbildning
* Installerar endast nödvändiga systemberoenden
* Skapar nödvändiga kataloger för datalagring
* Kopierar den byggda applikationen från byggsteget

Detta tillvägagångssätt säkerställer att den slutliga bilden är optimerad för storlek och säkerhet.

## Implementeringsprocess {#deployment-process}

### Installation {#installation}

Användare kan distribuera den självvärdade lösningen med hjälp av det medföljande installationsskriptet:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/refs/heads/master/self-hosting/setup.sh)
```

Detta script:

1. Klonar arkivet
2. Konfigurerar miljön
3. Konfigurerar DNS- och brandväggsinställningar
4. Genererar SSL-certifikat
5. Hämtar de senaste Docker-avbildningarna
6. Startar tjänsterna med Docker Compose

### Docker Compose-konfiguration {#docker-compose-configuration}

Filen `docker-compose-self-hosted.yml` definierar alla tjänster som krävs för den självhostade lösningen:

* **Webb**: Huvudwebbgränssnitt
* **API**: API-server för programmatisk åtkomst
* **SMTP**: E-postutskickningstjänst
* **IMAP/POP3**: E-posthämtning
* **MX**: E-postutbytestjänst
* **CalDAV**: Kalendertjänst
* **CardDAV**: Kontakttjänst
* **MongoDB**: Databas för lagring av användardata
* **Redis**: Datalagring i minnet
* **SQLite**: Databas för lagring av e-postmeddelanden

Varje tjänst använder samma Docker-bild men med olika ingångspunkter, vilket möjliggör en modulär arkitektur samtidigt som underhållet förenklas.

## Underhållsfunktioner {#maintenance-features}

Den självvärdade lösningen innehåller flera underhållsfunktioner:

### Automatiska uppdateringar {#automatic-updates}

Användare kan aktivera automatiska uppdateringar som kommer att:

* Hämta den senaste Docker-avbildningen varje natt
* Starta om tjänsterna med den uppdaterade avbildningen
* Logga uppdateringsprocessen

```bash
# Setup auto-updates (runs at 1 AM daily)
0 1 * * * docker compose -f /path/to/docker-compose-self-hosted.yml pull && docker compose -f /path/to/docker-compose-self-hosted.yml up -d >> /var/log/autoupdate.log 2>&1
```

### Säkerhetskopiering och återställning {#backup-and-restore}

Inställningen ger alternativ för:

* Konfigurera regelbundna säkerhetskopior till S3-kompatibel lagring
* Säkerhetskopiera MongoDB-, Redis- och SQLite-data
* Återställa från säkerhetskopior vid fel

### Certifikatförnyelse {#certificate-renewal}

SSL-certifikat hanteras automatiskt med alternativ för att:

* Generera nya certifikat under installationen
* Förnya certifikat vid behov
* Konfigurera DKIM för e-postautentisering

## Versionshantering {#versioning}

Varje GitHub-version skapar en ny Docker-bild taggad med:

1. Den specifika utgåvan (t.ex. `v1.0.0`)
2. Taggen `latest` för den senaste utgåvan

Användare kan välja att använda en specifik version för stabilitet eller taggen `latest` för att alltid få de senaste funktionerna.

## Åtkomst till bilder {#accessing-images}

Docker-bilderna är allmänt tillgängliga på:

* `ghcr.io/forwardemail/forwardemail.net-selfhosted:latest`
* `ghcr.io/forwardemail/forwardemail.net-selfhosted:v1.0.0` (exempelversionstagg)

Ingen autentisering krävs för att dra dessa bilder.

## Bidragande {#contributing}

Så här bidrar du till den självvärderade lösningen:

1. Gör ändringar i relevanta filer i katalogen `self-hosting`
2. Testa lokalt eller på en Ubuntu-baserad VPS med hjälp av det medföljande skriptet `setup.sh`
3. Skicka in en pull request
4. När den har sammanfogats och en ny version har skapats kommer CI-arbetsflödet automatiskt att bygga och publicera den uppdaterade Docker-avbildningen.