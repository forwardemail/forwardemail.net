# Selvhostede utgivelser {#self-hosted-releases}

Denne delen dokumenterer CI/CD-arbeidsflyten for ForwardEmails selvhostede løsning, og forklarer hvordan Docker-bilder bygges, publiseres og distribueres.

## Innholdsfortegnelse {#table-of-contents}

* [Oversikt](#overview)
* [CI/CD-arbeidsflyt](#cicd-workflow)
  * [GitHub-handlinger Arbeidsflyt](#github-actions-workflow)
  * [Docker-bildestruktur](#docker-image-structure)
* [Distribusjonsprosess](#deployment-process)
  * [Installasjon](#installation)
  * [Docker Compose-konfigurasjon](#docker-compose-configuration)
* [Vedlikeholdsfunksjoner](#maintenance-features)
  * [Automatiske oppdateringer](#automatic-updates)
  * [Sikkerhetskopiering og gjenoppretting](#backup-and-restore)
  * [Fornyelse av sertifikat](#certificate-renewal)
* [Versjonering](#versioning)
* [Tilgang til bilder](#accessing-images)
* [Bidragende](#contributing)

## Oversikt {#overview}

ForwardEmails selvhostede løsning bruker GitHub Actions til å automatisk bygge og publisere Docker-bilder når en ny utgivelse opprettes. Disse bildene er deretter tilgjengelige for brukere å distribuere på sine egne servere ved hjelp av det medfølgende oppsettskriptet.

> \[!NOTE]
> Det finnes også våre [selvhostet blogg](https://forwardemail.net/blog/docs/self-hosted-solution) og [veiledning for utviklere med egen hosting](https://forwardemail.net/self-hosted)
>
> Og for de mer oppdelte trinnvise versjonene, se veiledningene basert på [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) eller [Debian](https://forwardemail.net/guides/selfhosted-on-debian).

## CI/CD-arbeidsflyt {#cicd-workflow}

### GitHub-handlinger Arbeidsflyt {#github-actions-workflow}

Prosessen for bygging og publisering av Docker-bilder med egen hosting er definert i `.github/workflows/docker-image-build-publish.yml`. Denne arbeidsflyten:

1. **Utløsere**: Kjører automatisk når en ny GitHub-utgivelse publiseres
2. **Miljø**: Kjører på Ubuntu med Node.js 18.20.4
3. **Byggeprosess**:
* Sjekker ut repositorykoden
* Setter opp Docker Buildx for flerplattformbygg
* Logger seg inn i GitHub Container Registry (GHCR)
* Oppdaterer skjemaet for selvhostet distribusjon
* Bygger Docker-avbildningen ved hjelp av `self-hosting/Dockerfile-selfhosted`
* Tagger avbildningen med både utgivelsesversjonen og `latest`
* Sender avbildningene til GitHub Container Registry

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

### Docker-bildestruktur {#docker-image-structure}

Docker-avbildningen er bygget ved hjelp av en flertrinnsmetode definert i `self-hosting/Dockerfile-selfhosted`:

1. **Byggerfase**:
* Bruker Node.js 20 som basisbilde
* Setter miljøvariabelen `SELF_HOSTED=true`
* Installerer avhengigheter med pnpm
* Bygger applikasjonen i produksjonsmodus

2. **Siste trinn**:
* Bruker et slankere Node.js 20-bilde
* Installerer bare nødvendige systemavhengigheter
* Oppretter nødvendige mapper for datalagring
* Kopierer den innebygde applikasjonen fra byggefasen

Denne tilnærmingen sikrer at det endelige bildet er optimalisert for størrelse og sikkerhet.

## Distribusjonsprosess {#deployment-process}

### Installasjon {#installation}

Brukere kan distribuere den selvhostede løsningen ved hjelp av det medfølgende oppsettskriptet:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/refs/heads/master/self-hosting/setup.sh)
```

Dette skriptet:

1. Kloner depotet
2. Setter opp miljøet
3. Konfigurerer DNS- og brannmurinnstillinger
4. Genererer SSL-sertifikater
5. Henter de nyeste Docker-bildene
6. Starter tjenestene ved hjelp av Docker Compose

### Docker Compose-konfigurasjon {#docker-compose-configuration}

`docker-compose-self-hosted.yml`-filen definerer alle tjenestene som kreves for den selvhostede løsningen:

* **Web**: Hovednettgrensesnitt
* **API**: API-server for programmatisk tilgang
* **SMTP**: E-posttjeneste
* **IMAP/POP3**: E-posthentingstjenester
* **MX**: E-postutvekslingstjeneste
* **CalDAV**: Kalendertjeneste
* **CardDAV**: Kontakttjeneste
* **MongoDB**: Database for lagring av brukerdata
* **Redis**: Datalager i minnet
* **SQLite**: Database for lagring av e-poster

Hver tjeneste bruker det samme Docker-imaget, men med forskjellige inngangspunkter, noe som gir mulighet for en modulær arkitektur samtidig som vedlikeholdet forenkles.

## Vedlikeholdsfunksjoner {#maintenance-features}

Den selvhostede løsningen inkluderer flere vedlikeholdsfunksjoner:

### Automatiske oppdateringer {#automatic-updates}

Brukere kan aktivere automatiske oppdateringer som vil:

* Hent det nyeste Docker-imaget hver natt
* Start tjenestene på nytt med det oppdaterte imaget
* Logg oppdateringsprosessen

```bash
# Setup auto-updates (runs at 1 AM daily)
0 1 * * * docker compose -f /path/to/docker-compose-self-hosted.yml pull && docker compose -f /path/to/docker-compose-self-hosted.yml up -d >> /var/log/autoupdate.log 2>&1
```

### Sikkerhetskopiering og gjenoppretting {#backup-and-restore}

Oppsettet gir alternativer for:

* Konfigurering av regelmessige sikkerhetskopier til S3-kompatibel lagring
* Sikkerhetskopiering av MongoDB-, Redis- og SQLite-data
* Gjenoppretting fra sikkerhetskopier ved feil

### Sertifikatfornyelse {#certificate-renewal}

SSL-sertifikater administreres automatisk med alternativer for å:

* Generer nye sertifikater under oppsettet
* Forny sertifikater ved behov
* Konfigurer DKIM for e-postautentisering

## Versjonskontroll {#versioning}

Hver GitHub-utgivelse oppretter et nytt Docker-bilde merket med:

1. Den spesifikke utgivelsesversjonen (f.eks. `v1.0.0`)
2. `latest`-taggen for den nyeste utgivelsen

Brukere kan velge å bruke en bestemt versjon for stabilitet eller `latest`-taggen for alltid å få de nyeste funksjonene.

## Tilgang til bilder {#accessing-images}

Docker-bildene er offentlig tilgjengelige på:

* `ghcr.io/forwardemail/forwardemail.net-selfhosted:latest`
* `ghcr.io/forwardemail/forwardemail.net-selfhosted:v1.0.0` (eksempelversjonstag)

Ingen autentisering er nødvendig for å hente disse bildene.

## Bidrager {#contributing}

For å bidra til den selvhostede løsningen:

1. Gjør endringer i de relevante filene i `self-hosting`-katalogen.
2. Test lokalt eller på en Ubuntu-basert VPS ved hjelp av det medfølgende `setup.sh`-skriptet.
3. Send inn en pull-forespørsel.
4. Når filene er slått sammen og en ny utgivelse er opprettet, vil CI-arbeidsflyten automatisk bygge og publisere det oppdaterte Docker-imaget.