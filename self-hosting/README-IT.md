# Versioni auto-ospitate {#self-hosted-releases}

Questa sezione documenta il flusso di lavoro CI/CD per la soluzione self-hosted di ForwardEmail, spiegando come vengono create, pubblicate e distribuite le immagini Docker.

## Indice {#table-of-contents}

* [Panoramica](#overview)
* [Flusso di lavoro CI/CD](#cicd-workflow)
  * [Flusso di lavoro di GitHub Actions](#github-actions-workflow)
  * [Struttura dell'immagine Docker](#docker-image-structure)
* [Processo di distribuzione](#deployment-process)
  * [Installazione](#installation)
  * [Configurazione Docker Compose](#docker-compose-configuration)
* [Caratteristiche di manutenzione](#maintenance-features)
  * [Aggiornamenti automatici](#automatic-updates)
  * [Backup e ripristino](#backup-and-restore)
  * [Rinnovo del certificato](#certificate-renewal)
* [Controllo delle versioni](#versioning)
* [Accesso alle immagini](#accessing-images)
* [Contribuire](#contributing)

## Panoramica {#overview}

La soluzione self-hosted di ForwardEmail utilizza GitHub Actions per creare e pubblicare automaticamente immagini Docker ogni volta che viene creata una nuova release. Queste immagini sono quindi disponibili per la distribuzione da parte degli utenti sui propri server tramite lo script di configurazione fornito.

> \[!NOTE]
> Sono disponibili anche i nostri [blog auto-ospitato](https://forwardemail.net/blog/docs/self-hosted-solution) e [guida per sviluppatori auto-ospitati](https://forwardemail.net/self-hosted)
>
> Per le versioni passo passo più dettagliate, consulta le guide basate su [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) o [Debian](https://forwardemail.net/guides/selfhosted-on-debian).

## Flusso di lavoro CI/CD {#cicd-workflow}

### Flusso di lavoro delle azioni GitHub {#github-actions-workflow}

Il processo di creazione e pubblicazione dell'immagine Docker self-hosted è definito in `.github/workflows/docker-image-build-publish.yml`. Questo flusso di lavoro:

1. **Trigger**: Esegue automaticamente quando viene pubblicata una nuova versione di GitHub
2. **Ambiente**: Esegue su Ubuntu con Node.js 18.20.4
3. **Processo di build**:
* Esegue il check del codice del repository
* Imposta Docker Buildx per build multipiattaforma
* Accede al GitHub Container Registry (GHCR)
* Aggiorna lo schema per la distribuzione self-hosted
* Crea l'immagine Docker utilizzando `self-hosting/Dockerfile-selfhosted`
* Tagga l'immagine sia con la versione di rilascio che con `latest`
* Invio delle immagini al GitHub Container Registry

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

### Struttura dell'immagine Docker {#docker-image-structure}

L'immagine Docker viene creata utilizzando un approccio multifase definito in `self-hosting/Dockerfile-selfhosted`:

1. **Fase di creazione**:
* Utilizza Node.js 20 come immagine di base
* Imposta la variabile d'ambiente `SELF_HOSTED=true`
* Installa le dipendenze con pnpm
* Compila l'applicazione in modalità di produzione

2. **Fase finale**:
* Utilizza un'immagine Node.js 20 più snella
* Installa solo le dipendenze di sistema necessarie
* Crea le directory necessarie per l'archiviazione dei dati
* Copia l'applicazione compilata dalla fase di creazione

Questo approccio garantisce che l'immagine finale sia ottimizzata in termini di dimensioni e sicurezza.

## Processo di distribuzione {#deployment-process}

### Installazione {#installation}

Gli utenti possono implementare la soluzione self-hosted utilizzando lo script di installazione fornito:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/refs/heads/master/self-hosting/setup.sh)
```

Questo script:

1. Clona il repository
2. Configura l'ambiente
3. Configura le impostazioni DNS e del firewall
4. Genera certificati SSL
5. Estrae le immagini Docker più recenti
6. Avvia i servizi tramite Docker Compose

### Configurazione Docker Compose {#docker-compose-configuration}

Il file `docker-compose-self-hosted.yml` definisce tutti i servizi richiesti per la soluzione self-hosted:

* **Web**: Interfaccia web principale
* **API**: Server API per l'accesso programmatico
* **SMTP**: Servizio di invio email
* **IMAP/POP3**: Servizi di recupero email
* **MX**: Servizio di scambio di posta
* **CalDAV**: Servizio calendario
* **CardDAV**: Servizio contatti
* **MongoDB**: Database per l'archiviazione dei dati utente
* **Redis**: Archivio dati in memoria
* **SQLite**: Database per l'archiviazione delle email

Ogni servizio utilizza la stessa immagine Docker ma con punti di ingresso diversi, consentendo un'architettura modulare e semplificando al contempo la manutenzione.

## Funzionalità di manutenzione {#maintenance-features}

La soluzione self-hosted include diverse funzionalità di manutenzione:

### Aggiornamenti automatici {#automatic-updates}

Gli utenti possono abilitare gli aggiornamenti automatici che:

* Estrarre l'immagine Docker più recente ogni notte
* Riavviare i servizi con l'immagine aggiornata
* Registrare il processo di aggiornamento

```bash
# Setup auto-updates (runs at 1 AM daily)
0 1 * * * docker compose -f /path/to/docker-compose-self-hosted.yml pull && docker compose -f /path/to/docker-compose-self-hosted.yml up -d >> /var/log/autoupdate.log 2>&1
```

### Backup e ripristino {#backup-and-restore}

La configurazione fornisce opzioni per:

* Configurazione di backup regolari su storage compatibile con S3
* Backup di dati MongoDB, Redis e SQLite
* Ripristino dai backup in caso di errore

### Rinnovo del certificato {#certificate-renewal}

I certificati SSL vengono gestiti automaticamente con opzioni per:

* Genera nuovi certificati durante la configurazione
* Rinnova i certificati quando necessario
* Configura DKIM per l'autenticazione email

## Controllo delle versioni {#versioning}

Ogni versione di GitHub crea una nuova immagine Docker contrassegnata con:

1. La versione di rilascio specifica (ad esempio, `v1.0.0`)
2. Il tag `latest` per la versione più recente

Gli utenti possono scegliere di utilizzare una versione specifica per la stabilità oppure il tag `latest` per ottenere sempre le funzionalità più recenti.

## Accesso alle immagini {#accessing-images}

Le immagini Docker sono disponibili al pubblico all'indirizzo:

* `ghcr.io/forwardemail/forwardemail.net-selfhosted:latest`
* `ghcr.io/forwardemail/forwardemail.net-selfhosted:v1.0.0` (tag versione di esempio)

Per estrarre queste immagini non è richiesta alcuna autenticazione.

## Contributo di {#contributing}

Per contribuire alla soluzione self-hosted:

1. Apportare modifiche ai file rilevanti nella directory `self-hosting`
2. Eseguire il test in locale o su un VPS basato su Ubuntu utilizzando lo script `setup.sh` fornito
3. Inviare una richiesta pull
4. Una volta completata l'unione e creata una nuova release, il flusso di lavoro di CI compilerà e pubblicherà automaticamente l'immagine Docker aggiornata.