# Self-Hosted Releases {#self-hosted-releases}

W tej sekcji opisano przepływ pracy CI/CD dla samodzielnie hostowanego rozwiązania ForwardEmail, wyjaśniając, w jaki sposób obrazy Docker są tworzone, publikowane i wdrażane.

## Table of Contents {#table-of-contents}

* [Przegląd](#overview)
* [Przepływ pracy CI/CD](#cicd-workflow)
  * [Przepływ pracy akcji GitHub](#github-actions-workflow)
  * [Struktura obrazu Dockera](#docker-image-structure)
* [Proces wdrażania](#deployment-process)
  * [Instalacja](#installation)
  * [Konfiguracja Docker Compose](#docker-compose-configuration)
* [Funkcje konserwacyjne](#maintenance-features)
  * [Aktualizacje automatyczne](#automatic-updates)
  * [Kopia zapasowa i przywracanie](#backup-and-restore)
  * [Odnowienie certyfikatu](#certificate-renewal)
* [Wersjonowanie](#versioning)
* [Dostęp do obrazów](#accessing-images)
* [Wkład](#contributing)

## Overview {#overview}

Samodzielnie hostowane rozwiązanie ForwardEmail wykorzystuje GitHub Actions do automatycznego budowania i publikowania obrazów Docker za każdym razem, gdy tworzona jest nowa wersja. Następnie obrazy te są dostępne dla użytkowników do wdrożenia na ich własnych serwerach za pomocą dostarczonego skryptu instalacyjnego.

> \[!NOTE]
> There is also our [self-hosted blog](https://forwardemail.net/blog/docs/self-hosted-solution) and [self-hosted developer guide](https://forwardemail.net/self-hosted)
>
> And for the more broken down step-by-step versions see the [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) or [Debian](https://forwardemail.net/guides/selfhosted-on-debian) based guides.

## CI/CD Workflow {#cicd-workflow}

### GitHub Actions Workflow {#github-actions-workflow}

Proces kompilacji i publikacji obrazu Dockera hostowanego samodzielnie jest zdefiniowany w `.github/workflows/docker-image-build-publish.yml`. Ten przepływ pracy:

1. **Wyzwalacze**: Uruchamia się automatycznie po opublikowaniu nowej wersji GitHub
2. **Środowisko**: Działa w systemie Ubuntu z Node.js 18.20.4
3. **Proces kompilacji**:
* Pobiera kod repozytorium
* Konfiguruje Docker Buildx do kompilacji wieloplatformowych
* Loguje się do Rejestru Kontenerów GitHub (GHCR)
* Aktualizuje schemat dla wdrożenia hostowanego samodzielnie
* Kompiluje obraz Dockera za pomocą `self-hosting/Dockerfile-selfhosted`
* Oznacza obraz zarówno wersją wydania, jak i `latest`
* Przesyła obrazy do Rejestru Kontenerów GitHub

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

### Struktura obrazu Dockera {#docker-image-structure}

Obraz Dockera jest tworzony przy użyciu wieloetapowego podejścia zdefiniowanego w `self-hosting/Dockerfile-selfhosted`:

1. **Etap Buildera**:
* Używa Node.js 20 jako obrazu bazowego
* Ustawia zmienną środowiskową `SELF_HOSTED=true`
* Instaluje zależności za pomocą pnpm
* Kompiluje aplikację w trybie produkcyjnym

2. **Etap końcowy**:
* Używa cieńszego obrazu Node.js 20
* Instaluje tylko niezbędne zależności systemowe
* Tworzy wymagane katalogi do przechowywania danych
* Kopiuje skompilowaną aplikację z etapu buildera

Takie podejście gwarantuje, że końcowy obraz będzie zoptymalizowany pod względem rozmiaru i bezpieczeństwa.

## Proces wdrażania {#deployment-process}

### Instalacja {#installation}

Użytkownicy mogą wdrożyć samodzielnie hostowane rozwiązanie, korzystając z dostarczonego skryptu instalacyjnego:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/refs/heads/master/self-hosting/setup.sh)
```

Ten skrypt:

1. Klonuje repozytorium
2. Konfiguruje środowisko
3. Konfiguruje ustawienia DNS i zapory
4. Generuje certyfikaty SSL
5. Pobiera najnowsze obrazy Docker
6. Uruchamia usługi za pomocą Docker Compose

### Konfiguracja Docker Compose {#docker-compose-configuration}

Plik `docker-compose-self-hosted.yml` definiuje wszystkie usługi wymagane dla rozwiązania hostowanego samodzielnie:

* **Web**: Główny interfejs sieciowy
* **API**: Serwer API do dostępu programowego
* **SMTP**: Usługa wysyłania wiadomości e-mail
* **IMAP/POP3**: Usługi pobierania wiadomości e-mail
* **MX**: Usługa wymiany poczty
* **CalDAV**: Usługa kalendarza
* **CardDAV**: Usługa kontaktów
* **MongoDB**: Baza danych do przechowywania danych użytkownika
* **Redis**: Magazyn danych w pamięci
* **SQLite**: Baza danych do przechowywania wiadomości e-mail

Każda usługa korzysta z tego samego obrazu Docker, ale z różnymi punktami wejścia, co pozwala na modułową architekturę i upraszcza konserwację.

## Funkcje konserwacyjne {#maintenance-features}

Rozwiązanie z własnym hostingiem obejmuje szereg funkcji konserwacyjnych:

### Aktualizacje automatyczne {#automatic-updates}

Użytkownicy mogą włączyć automatyczne aktualizacje, które:

* Pobieraj najnowszy obraz Dockera co noc
* Uruchom ponownie usługi z zaktualizowanym obrazem
* Rejestruj proces aktualizacji

```bash
# Setup auto-updates (runs at 1 AM daily)
0 1 * * * docker compose -f /path/to/docker-compose-self-hosted.yml pull && docker compose -f /path/to/docker-compose-self-hosted.yml up -d >> /var/log/autoupdate.log 2>&1
```

### Kopia zapasowa i przywracanie {#backup-and-restore}

Konfiguracja zapewnia następujące opcje:

* Konfigurowanie regularnych kopii zapasowych w pamięci masowej zgodnej z S3
* Tworzenie kopii zapasowych danych MongoDB, Redis i SQLite
* Przywracanie z kopii zapasowych w przypadku awarii

### Odnowienie certyfikatu {#certificate-renewal}

Certyfikaty SSL są zarządzane automatycznie, a dostępne opcje to:

* Generuj nowe certyfikaty podczas konfiguracji
* Odnawiaj certyfikaty w razie potrzeby
* Skonfiguruj DKIM do uwierzytelniania poczty e-mail

## Wersjonowanie {#versioning}

Każda wersja GitHub tworzy nowy obraz Dockera oznaczony następującym tagiem:

1. Konkretna wersja wydania (np. `v1.0.0`)
2. Znacznik `latest` dla najnowszej wersji

Użytkownicy mogą wybrać konkretną wersję zapewniającą stabilność lub tag `latest`, aby zawsze mieć dostęp do najnowszych funkcji.

## Dostęp do obrazów {#accessing-images}

Obrazy Docker są publicznie dostępne pod adresem:

* `ghcr.io/forwardemail/forwardemail.net-selfhosted:latest`
* `ghcr.io/forwardemail/forwardemail.net-selfhosted:v1.0.0` (przykładowy tag wersji)

Do pobrania tych obrazów nie jest wymagane uwierzytelnianie.

## Współtworzenie {#contributing}

Aby przyczynić się do rozwiązania hostowanego samodzielnie:

1. Wprowadź zmiany w odpowiednich plikach w katalogu `self-hosting`
2. Przetestuj lokalnie lub na serwerze VPS z systemem Ubuntu, używając dostarczonego skryptu `setup.sh`
3. Prześlij żądanie ściągnięcia
4. Po scaleniu i utworzeniu nowej wersji, przepływ pracy CI automatycznie skompiluje i opublikuje zaktualizowany obraz Dockera