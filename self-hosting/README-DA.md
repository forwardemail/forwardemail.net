# Selvhostede udgivelser {#self-hosted-releases}

Dette afsnit dokumenterer CI/CD-arbejdsgangen for ForwardEmails selvhostede løsning og forklarer, hvordan Docker-billeder bygges, publiceres og implementeres.

## Indholdsfortegnelse {#table-of-contents}

* [Oversigt](#overview)
* [CI/CD-arbejdsgang](#cicd-workflow)
  * [GitHub-handlingsworkflow](#github-actions-workflow)
  * [Docker-billedstruktur](#docker-image-structure)
* [Implementeringsproces](#deployment-process)
  * [Installation](#installation)
  * [Docker Compose-konfiguration](#docker-compose-configuration)
* [Vedligeholdelsesfunktioner](#maintenance-features)
  * [Automatiske opdateringer](#automatic-updates)
  * [Sikkerhedskopiering og gendannelse](#backup-and-restore)
  * [Fornyelse af certifikat](#certificate-renewal)
* [Versionsstyring](#versioning)
* [Adgang til billeder](#accessing-images)
* [Bidragende](#contributing)

## Oversigt {#overview}

ForwardEmails selvhostede løsning bruger GitHub Actions til automatisk at bygge og udgive Docker-billeder, når en ny udgivelse oprettes. Disse billeder er derefter tilgængelige for brugerne til at implementere på deres egne servere ved hjælp af det medfølgende opsætningsscript.

> \[!NOTE]
> Der er også vores [selvhostet blog](https://forwardemail.net/blog/docs/self-hosted-solution) og [guide til selvhostede udviklere](https://forwardemail.net/self-hosted)
>
> Og for de mere opdelte trinvise versioner, se de [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) eller [Debian](https://forwardemail.net/guides/selfhosted-on-debian)-baserede vejledninger.

## CI/CD-arbejdsgang {#cicd-workflow}

### GitHub-handlingsworkflow {#github-actions-workflow}

Den selvhostede Docker-imageopbygnings- og publiceringsprocessen er defineret i `.github/workflows/docker-image-build-publish.yml`. Denne arbejdsgang:

1. **Triggers**: Kører automatisk, når en ny GitHub-udgivelse udgives
2. **Environment**: Kører på Ubuntu med Node.js 18.20.4
3. **Build Process**:
* Tjekker repository-koden
* Opsætter Docker Buildx til multi-platform builds
* Logger ind på GitHub Container Registry (GHCR)
* Opdaterer skemaet til selvhostet implementering
* Bygger Docker-billedet ved hjælp af `self-hosting/Dockerfile-selfhosted`
* Tagger billedet med både udgivelsesversionen og `latest`
* Sender billederne til GitHub Container Registry

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

### Docker-billedstruktur {#docker-image-structure}

Docker-billedet er bygget ved hjælp af en flertrinsmetode defineret i `self-hosting/Dockerfile-selfhosted`:

1. **Builder Stage**:
* Bruger Node.js 20 som basisbillede
* Sætter miljøvariablen `SELF_HOSTED=true`
* Installerer afhængigheder med pnpm
* Bygger applikationen i produktionstilstand

2. **Sidste fase**:
* Bruger et slankere Node.js 20-billede
* Installerer kun de nødvendige systemafhængigheder
* Opretter nødvendige mapper til datalagring
* Kopierer den byggede applikation fra builder-fasen

Denne tilgang sikrer, at det endelige billede er optimeret med hensyn til størrelse og sikkerhed.

## Implementeringsproces {#deployment-process}

### Installation {#installation}

Brugere kan implementere den selvhostede løsning ved hjælp af det medfølgende opsætningsscript:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/refs/heads/master/self-hosting/setup.sh)
```

Dette script:

1. Kloner arkivet
2. Opsætter miljøet
3. Konfigurerer DNS- og firewallindstillinger
4. Genererer SSL-certifikater
5. Henter de seneste Docker-billeder
6. Starter tjenesterne ved hjælp af Docker Compose

### Docker Compose-konfiguration {#docker-compose-configuration}

`docker-compose-self-hosted.yml`-filen definerer alle de tjenester, der kræves til den selvhostede løsning:

* **Web**: Primær webgrænseflade
* **API**: API-server til programmatisk adgang
* **SMTP**: E-mail-afsendelsestjeneste
* **IMAP/POP3**: E-mail-hentningstjenester
* **MX**: Mailudvekslingstjeneste
* **CalDAV**: Kalendertjeneste
* **CardDAV**: Kontakttjeneste
* **MongoDB**: Database til lagring af brugerdata
* **Redis**: Datalager i hukommelsen
* **SQLite**: Database til lagring af e-mails

Hver tjeneste bruger det samme Docker-billede, men med forskellige indgangspunkter, hvilket muliggør en modulær arkitektur og forenkler vedligeholdelsen.

## Vedligeholdelsesfunktioner {#maintenance-features}

Den selvhostede løsning inkluderer adskillige vedligeholdelsesfunktioner:

### Automatiske opdateringer {#automatic-updates}

Brugere kan aktivere automatiske opdateringer, der vil:

* Hent det seneste Docker-billede hver nat
* Genstart tjenester med det opdaterede billede
* Log opdateringsprocessen

```bash
# Setup auto-updates (runs at 1 AM daily)
0 1 * * * docker compose -f /path/to/docker-compose-self-hosted.yml pull && docker compose -f /path/to/docker-compose-self-hosted.yml up -d >> /var/log/autoupdate.log 2>&1
```

### Sikkerhedskopiering og gendannelse {#backup-and-restore}

Opsætningen giver muligheder for:

* Konfiguration af regelmæssige sikkerhedskopier til S3-kompatibelt lager
* Sikkerhedskopiering af MongoDB-, Redis- og SQLite-data
* Gendannelse fra sikkerhedskopier i tilfælde af fejl

### Certifikatfornyelse {#certificate-renewal}

SSL-certifikater administreres automatisk med muligheder for at:

* Generer nye certifikater under opsætningen
* Forny certifikater efter behov
* Konfigurer DKIM til e-mailgodkendelse

## Versionsstyring {#versioning}

Hver GitHub-udgivelse opretter et nyt Docker-billede tagget med:

1. Den specifikke udgivelsesversion (f.eks. `v1.0.0`)
2. `latest`-tagget for den seneste udgivelse

Brugere kan vælge at bruge en bestemt version for stabilitet eller `latest`-tagget for altid at få de nyeste funktioner.

## Adgang til billeder {#accessing-images}

Docker-billederne er offentligt tilgængelige på:

* `ghcr.io/forwardemail/forwardemail.net-selfhosted:latest`
* `ghcr.io/forwardemail/forwardemail.net-selfhosted:v1.0.0` (eksempel på versionstag)

Der kræves ingen godkendelse for at hente disse billeder.

## Bidrager {#contributing}

For at bidrage til den selvhostede løsning:

1. Foretag ændringer i de relevante filer i `self-hosting`-mappen.
2. Test lokalt eller på en Ubuntu-baseret VPS ved hjælp af det medfølgende `setup.sh`-script.
3. Indsend en pull-anmodning.
4. Når den er flettet sammen, og en ny udgivelse er oprettet, vil CI-arbejdsgangen automatisk opbygge og udgive det opdaterede Docker-billede.