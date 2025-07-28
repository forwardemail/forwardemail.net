# Self-Hosted Releases {#self-hosted-releases}

In dit gedeelte wordt de CI/CD-workflow voor de zelfgehoste oplossing van ForwardEmail beschreven en wordt uitgelegd hoe Docker-images worden gebouwd, gepubliceerd en geïmplementeerd.

## Table of Contents {#table-of-contents}

* [Overzicht](#overview)
* [CI/CD-workflow](#cicd-workflow)
  * [GitHub-actiesworkflow](#github-actions-workflow)
  * [Docker-afbeeldingstructuur](#docker-image-structure)
* [Implementatieproces](#deployment-process)
  * [Installatie](#installation)
  * [Docker Compose-configuratie](#docker-compose-configuration)
* [Onderhoudsfuncties](#maintenance-features)
  * [Automatische updates](#automatic-updates)
  * [Back-up en herstel](#backup-and-restore)
  * [Certificaat Vernieuwing](#certificate-renewal)
* [Versiebeheer](#versioning)
* [Toegang tot afbeeldingen](#accessing-images)
* [Bijdragen](#contributing)

## Overview {#overview}

De zelfgehoste oplossing van ForwardEmail gebruikt GitHub Actions om automatisch Docker-images te bouwen en te publiceren wanneer een nieuwe release wordt gemaakt. Deze images zijn vervolgens beschikbaar voor gebruikers om te implementeren op hun eigen servers met behulp van het meegeleverde installatiescript.

> \[!NOTE]
> There is also our [self-hosted blog](https://forwardemail.net/blog/docs/self-hosted-solution) and [self-hosted developer guide](https://forwardemail.net/self-hosted)
>
> And for the more broken down step-by-step versions see the [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) or [Debian](https://forwardemail.net/guides/selfhosted-on-debian) based guides.

## CI/CD Workflow {#cicd-workflow}

### GitHub Actions Workflow {#github-actions-workflow}

Het zelf-gehoste Docker-image-build- en publicatieproces is gedefinieerd in `.github/workflows/docker-image-build-publish.yml`. Deze workflow:

1. **Triggers**: Wordt automatisch uitgevoerd wanneer een nieuwe GitHub-release wordt gepubliceerd
2. **Omgeving**: Draait op Ubuntu met Node.js 18.20.4
3. **Bouwproces**:
* Checkt de repositorycode uit
* Stelt Docker Buildx in voor multiplatform builds
* Logt in op GitHub Container Registry (GHCR)
* Werkt het schema bij voor zelf-gehoste implementatie
* Bouwt de Docker-image met behulp van `self-hosting/Dockerfile-selfhosted`
* Tagt de image met zowel de releaseversie als `latest`
* Pusht de images naar GitHub Container Registry

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

### Docker-afbeeldingsstructuur {#docker-image-structure}

De Docker-image is gebouwd met behulp van een meerfasenbenadering die is gedefinieerd in `self-hosting/Dockerfile-selfhosted`:

1. **Builder Stage**:
* Gebruikt Node.js 20 als basisimage
* Stelt de omgevingsvariabele `SELF_HOSTED=true` in
* Installeert afhankelijkheden met pnpm
* Bouwt de applicatie in productiemodus

2. **Laatste fase**:
* Gebruikt een slankere Node.js 20-image
* Installeert alleen de benodigde systeemafhankelijkheden
* Maakt de vereiste mappen aan voor gegevensopslag
* Kopieert de gebouwde applicatie vanuit de builder-fase

Deze aanpak zorgt ervoor dat de uiteindelijke afbeelding qua formaat en beveiliging geoptimaliseerd is.

## Implementatieproces {#deployment-process}

### Installatie {#installation}

Gebruikers kunnen de zelf-gehoste oplossing implementeren met behulp van het meegeleverde installatiescript:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/refs/heads/master/self-hosting/setup.sh)
```

Dit script:

1. Kloont de repository
2. Stelt de omgeving in
3. Configureert DNS- en firewallinstellingen
4. Genereert SSL-certificaten
5. Haalt de nieuwste Docker-images op
6. Start de services met Docker Compose

### Docker Compose-configuratie {#docker-compose-configuration}

Het bestand `docker-compose-self-hosted.yml` definieert alle services die nodig zijn voor de zelfgehoste oplossing:

* **Web**: Hoofdwebinterface
* **API**: API-server voor programmatische toegang
* **SMTP**: E-mailverzendservice
* **IMAP/POP3**: E-mailophaalservice
* **MX**: Mailuitwisselingsservice
* **CalDAV**: Agendaservice
* **CardDAV**: Contactenservice
* **MongoDB**: Database voor het opslaan van gebruikersgegevens
* **Redis**: In-memory gegevensopslag
* **SQLite**: Database voor het opslaan van e-mails

Elke service gebruikt dezelfde Docker-image, maar met verschillende toegangspunten. Dit zorgt voor een modulaire architectuur en vereenvoudigt het onderhoud.

## Onderhoudsfuncties {#maintenance-features}

De zelfgehoste oplossing omvat verschillende onderhoudsfuncties:

### Automatische updates {#automatic-updates}

Gebruikers kunnen automatische updates inschakelen die:

* Haal elke nacht de nieuwste Docker-image op
* Start de services opnieuw met de bijgewerkte image
* Log het updateproces

```bash
# Setup auto-updates (runs at 1 AM daily)
0 1 * * * docker compose -f /path/to/docker-compose-self-hosted.yml pull && docker compose -f /path/to/docker-compose-self-hosted.yml up -d >> /var/log/autoupdate.log 2>&1
```

### Back-up en herstel {#backup-and-restore}

De installatie biedt opties voor:

* Regelmatige back-ups configureren naar S3-compatibele opslag
* Een back-up maken van MongoDB-, Redis- en SQLite-gegevens
* Herstellen van back-ups in geval van een storing

### Certificaatvernieuwing {#certificate-renewal}

SSL-certificaten worden automatisch beheerd met opties om:

* Genereer nieuwe certificaten tijdens de installatie
* Vernieuw certificaten indien nodig
* Configureer DKIM voor e-mailauthenticatie

## Versiebeheer {#versioning}

Elke GitHub-release creëert een nieuwe Docker-image met de volgende tags:

1. De specifieke releaseversie (bijv. `v1.0.0`)
2. De tag `latest` voor de meest recente release

Gebruikers kunnen ervoor kiezen om een specifieke versie te gebruiken voor stabiliteit of de `latest` tag om altijd de nieuwste functies te krijgen.

## Toegang tot afbeeldingen {#accessing-images}

De Docker-images zijn openbaar beschikbaar op:

* `ghcr.io/forwardemail/forwardemail.net-selfhosted:latest`
* `ghcr.io/forwardemail/forwardemail.net-selfhosted:v1.0.0` (voorbeeldversietag)

Er is geen authenticatie vereist om deze afbeeldingen op te halen.

## Bijdragen aan {#contributing}

Bijdragen aan de zelf-gehoste oplossing:

1. Breng wijzigingen aan in de relevante bestanden in de map `self-hosting`
2. Test lokaal of op een Ubuntu-gebaseerde VPS met behulp van het meegeleverde script `setup.sh`
3. Dien een pull-aanvraag in
4. Zodra de bestanden zijn samengevoegd en er een nieuwe release is aangemaakt, bouwt en publiceert de CI-workflow automatisch de bijgewerkte Docker-image