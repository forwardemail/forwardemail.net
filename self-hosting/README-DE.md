# Selbst gehostete Releases {#self-hosted-releases}

Dieser Abschnitt dokumentiert den CI/CD-Workflow für die selbstgehostete Lösung von ForwardEmail und erklärt, wie Docker-Images erstellt, veröffentlicht und bereitgestellt werden.

## Inhaltsverzeichnis {#table-of-contents}

* [Überblick](#overview)
* [CI/CD-Workflow](#cicd-workflow)
  * [GitHub Actions-Workflow](#github-actions-workflow)
  * [Docker-Image-Struktur](#docker-image-structure)
* [Bereitstellungsprozess](#deployment-process)
  * [Installation](#installation)
  * [Docker Compose-Konfiguration](#docker-compose-configuration)
* [Wartungsfunktionen](#maintenance-features)
  * [Automatische Updates](#automatic-updates)
  * [Sichern und Wiederherstellen](#backup-and-restore)
  * [Zertifikatserneuerung](#certificate-renewal)
* [Versionierung](#versioning)
* [Zugriff auf Bilder](#accessing-images)
* [Beitragen](#contributing)

## Übersicht {#overview}

Die selbstgehostete Lösung von ForwardEmail nutzt GitHub Actions, um Docker-Images automatisch zu erstellen und zu veröffentlichen, sobald eine neue Version erstellt wird. Diese Images stehen Benutzern dann zur Bereitstellung auf ihren eigenen Servern mithilfe des bereitgestellten Setup-Skripts zur Verfügung.

> \[!NOTE]
> Es gibt auch unsere [selbst gehosteter Blog](https://forwardemail.net/blog/docs/self-hosted-solution) und [selbstgehostetes Entwicklerhandbuch](https://forwardemail.net/self-hosted).
>
> Detailliertere Schritt-für-Schritt-Anleitungen finden Sie in den Anleitungen zu [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) und [Debian](https://forwardemail.net/guides/selfhosted-on-debian).

## CI/CD-Workflow {#cicd-workflow}

### GitHub Actions-Workflow {#github-actions-workflow}

Der Build- und Veröffentlichungsprozess für selbstgehostete Docker-Images ist in `.github/workflows/docker-image-build-publish.yml` definiert. Dieser Workflow:

1. **Trigger**: Wird automatisch ausgeführt, wenn ein neues GitHub-Release veröffentlicht wird.
2. **Umgebung**: Läuft unter Ubuntu mit Node.js 18.20.4.
3. **Build-Prozess**:
* Checkt den Repository-Code aus.
* Richtet Docker Buildx für plattformübergreifende Builds ein.
* Meldet sich bei der GitHub Container Registry (GHCR) an.
* Aktualisiert das Schema für die selbstgehostete Bereitstellung.
* Erstellt das Docker-Image mit `self-hosting/Dockerfile-selfhosted`.
* Kennzeichnet das Image mit der Release-Version und `latest`.
* Überträgt die Images in die GitHub Container Registry.

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

### Docker-Image-Struktur {#docker-image-structure}

Das Docker-Image wird mithilfe eines mehrstufigen Ansatzes erstellt, der in `self-hosting/Dockerfile-selfhosted` definiert ist:

1. **Builder-Phase**:
* Verwendet Node.js 20 als Basis-Image
* Setzt die Umgebungsvariable `SELF_HOSTED=true`
* Installiert Abhängigkeiten mit pnpm
* Erstellt die Anwendung im Produktionsmodus

2. **Letzte Phase**:
* Verwendet ein schlankeres Node.js 20-Image
* Installiert nur die notwendigen Systemabhängigkeiten
* Erstellt die erforderlichen Verzeichnisse für die Datenspeicherung
* Kopiert die erstellte Anwendung aus der Builder-Phase

Dieser Ansatz stellt sicher, dass das endgültige Bild hinsichtlich Größe und Sicherheit optimiert ist.

## Bereitstellungsprozess {#deployment-process}

### Installation {#installation}

Benutzer können die selbstgehostete Lösung mithilfe des bereitgestellten Setup-Skripts bereitstellen:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/refs/heads/master/self-hosting/setup.sh)
```

Dieses Skript:

1. Klont das Repository
2. Richtet die Umgebung ein
3. Konfiguriert DNS- und Firewall-Einstellungen
4. Generiert SSL-Zertifikate
5. Ruft die neuesten Docker-Images ab
6. Startet die Dienste mit Docker Compose

### Docker Compose-Konfiguration {#docker-compose-configuration}

Die Datei `docker-compose-self-hosted.yml` definiert alle Dienste, die für die selbstgehostete Lösung erforderlich sind:

* **Web**: Haupt-Weboberfläche
* **API**: API-Server für programmatischen Zugriff
* **SMTP**: E-Mail-Versanddienst
* **IMAP/POP3**: E-Mail-Abrufdienste
* **MX**: E-Mail-Austauschdienst
* **CalDAV**: Kalenderdienst
* **CardDAV**: Kontaktedienst
* **MongoDB**: Datenbank zur Speicherung von Benutzerdaten
* **Redis**: In-Memory-Datenspeicher
* **SQLite**: Datenbank zur Speicherung von E-Mails

Jeder Dienst verwendet dasselbe Docker-Image, jedoch mit unterschiedlichen Einstiegspunkten, was eine modulare Architektur ermöglicht und gleichzeitig die Wartung vereinfacht.

## Wartungsfunktionen {#maintenance-features}

Die selbstgehostete Lösung umfasst mehrere Wartungsfunktionen:

### Automatische Updates {#automatic-updates}

Benutzer können automatische Updates aktivieren, die Folgendes bewirken:

* Laden Sie das neueste Docker-Image jede Nacht herunter.
* Starten Sie die Dienste mit dem aktualisierten Image neu.
* Protokollieren Sie den Aktualisierungsvorgang.

```bash
# Setup auto-updates (runs at 1 AM daily)
0 1 * * * docker compose -f /path/to/docker-compose-self-hosted.yml pull && docker compose -f /path/to/docker-compose-self-hosted.yml up -d >> /var/log/autoupdate.log 2>&1
```

### Sichern und Wiederherstellen {#backup-and-restore}

Das Setup bietet Optionen für:

* Konfigurieren regelmäßiger Backups auf S3-kompatiblem Speicher
* Sichern von MongoDB-, Redis- und SQLite-Daten
* Wiederherstellen aus Backups im Fehlerfall

### Zertifikatserneuerung {#certificate-renewal}

SSL-Zertifikate werden automatisch verwaltet und bieten folgende Optionen:

* Neue Zertifikate während der Einrichtung generieren
* Zertifikate bei Bedarf erneuern
* DKIM für die E-Mail-Authentifizierung konfigurieren

## Versionierung {#versioning}

Jede GitHub-Version erstellt ein neues Docker-Image mit den Tags:

1. Die spezifische Release-Version (z. B. `v1.0.0`)
2. Das `latest`-Tag für das neueste Release

Benutzer können aus Stabilitätsgründen eine bestimmte Version verwenden oder das Tag `latest` verwenden, um immer die neuesten Funktionen zu erhalten.

## Zugriff auf Bilder {#accessing-images}

Die Docker-Images sind öffentlich verfügbar unter:

* `ghcr.io/forwardemail/forwardemail.net-selfhosted:latest`
* `ghcr.io/forwardemail/forwardemail.net-selfhosted:v1.0.0` (Beispiel für einen Versionstag)

Zum Abrufen dieser Bilder ist keine Authentifizierung erforderlich.

## Beitragen {#contributing}

So tragen Sie zur selbstgehosteten Lösung bei:

1. Nehmen Sie Änderungen an den relevanten Dateien im Verzeichnis `self-hosting` vor.
2. Testen Sie lokal oder auf einem Ubuntu-basierten VPS mit dem bereitgestellten Skript `setup.sh`.
3. Senden Sie einen Pull Request.
4. Sobald die Zusammenführung abgeschlossen ist und ein neues Release erstellt wurde, erstellt und veröffentlicht der CI-Workflow automatisch das aktualisierte Docker-Image.