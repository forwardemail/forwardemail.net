# Wydania hostowane samodzielnie {#self-hosted-releases}

W tej sekcji opisano przebieg prac CI/CD dla samodzielnie hostowanego rozwiązania ForwardEmail, wyjaśniając, w jaki sposób tworzone, publikowane i wdrażane są obrazy Docker.

## Spis treści {#table-of-contents}

* [Przegląd](#overview)
* [Przepływ pracy CI/CD](#cicd-workflow)
  * [Przepływ pracy akcji GitHub](#github-actions-workflow)
  * [Struktura obrazu Dockera](#docker-image-structure)
* [Proces wdrażania](#deployment-process)
  * [Instalacja](#installation)
  * [Konfiguracja Docker Compose](#docker-compose-configuration)
* [Funkcje konserwacyjne](#maintenance-features)
  * [Automatyczne aktualizacje](#automatic-updates)
  * [Kopia zapasowa i przywracanie](#backup-and-restore)
  * [Odnowienie certyfikatu](#certificate-renewal)
* [Wersjonowanie](#versioning)
* [Dostęp do obrazów](#accessing-images)
* [Wkład](#contributing)

## Przegląd {#overview}

Samodzielnie hostowane rozwiązanie ForwardEmail wykorzystuje GitHub Actions do automatycznego tworzenia i publikowania obrazów Dockera za każdym razem, gdy tworzona jest nowa wersja. Obrazy te są następnie dostępne dla użytkowników do wdrożenia na ich własnych serwerach za pomocą dostarczonego skryptu instalacyjnego.

> \[!NOTE]
> Dostępne są również nasze [blog z własnym hostingiem](https://forwardemail.net/blog/docs/self-hosted-solution) i [przewodnik dla programistów hostujących samodzielnie](https://forwardemail.net/self-hosted)
>
> Bardziej szczegółowe wersje krok po kroku znajdziesz w przewodnikach opartych na [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) lub [Debian](https://forwardemail.net/guides/selfhosted-on-debian).

## Przepływ pracy CI/CD {#cicd-workflow}

### Przepływ pracy akcji GitHub {#github-actions-workflow}

Proces kompilacji i publikacji obrazu Dockera hostowanego samodzielnie jest zdefiniowany w `.github/workflows/docker-image-build-publish.yml`. Ten przepływ pracy:

1. **Wyzwalacze**: Uruchamia się automatycznie po opublikowaniu nowej wersji GitHub
2. **Środowisko**: Działa w systemie Ubuntu z Node.js 18.20.4
3. **Proces kompilacji**:
* Pobiera kod repozytorium
* Konfiguruje Docker Buildx dla kompilacji wieloplatformowych
* Loguje się do Rejestru Kontenerów GitHub (GHCR)
* Aktualizuje schemat dla wdrożenia hostowanego samodzielnie
* Buduje obraz Dockera za pomocą `self-hosting/Dockerfile-selfhosted`
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
* Używa uproszczonego obrazu Node.js 20
* Instaluje tylko niezbędne zależności systemowe
* Tworzy wymagane katalogi do przechowywania danych
* Kopiuje skompilowaną aplikację z etapu budowania

Dzięki temu podejściu końcowy obraz będzie zoptymalizowany pod względem rozmiaru i bezpieczeństwa.

## Proces wdrażania {#deployment-process}

### Instalacja {#installation}

Użytkownicy mogą wdrożyć rozwiązanie hostowane samodzielnie, korzystając z dostarczonego skryptu instalacyjnego:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/refs/heads/master/self-hosting/setup.sh)
```

Ten skrypt:

1. Klonuje repozytorium
2. Konfiguruje środowisko
3. Konfiguruje ustawienia DNS i zapory sieciowej
4. Generuje certyfikaty SSL
5. Pobiera najnowsze obrazy Dockera
6. Uruchamia usługi za pomocą Docker Compose

### Konfiguracja Docker Compose {#docker-compose-configuration}

Plik `docker-compose-self-hosted.yml` definiuje wszystkie usługi wymagane dla rozwiązania hostowanego samodzielnie:

* **Web**: Główny interfejs webowy
* **API**: Serwer API do dostępu programowego
* **SMTP**: Usługa wysyłania wiadomości e-mail
* **IMAP/POP3**: Usługi pobierania wiadomości e-mail
* **MX**: Usługa wymiany poczty
* **CalDAV**: Usługa kalendarza
* **CardDAV**: Usługa kontaktów
* **MongoDB**: Baza danych do przechowywania danych użytkownika
* **Redis**: Magazyn danych w pamięci
* **SQLite**: Baza danych do przechowywania wiadomości e-mail

Każda usługa korzysta z tego samego obrazu Docker, ale z różnymi punktami wejścia, co pozwala na modułową architekturę przy jednoczesnym uproszczeniu konserwacji.

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
* Przywracanie danych z kopii zapasowych w przypadku awarii

### Odnowienie certyfikatu {#certificate-renewal}

Certyfikaty SSL są zarządzane automatycznie, z następującymi opcjami:

* Generuj nowe certyfikaty podczas konfiguracji
* Odnawiaj certyfikaty w razie potrzeby
* Skonfiguruj DKIM do uwierzytelniania poczty e-mail

## Wersjonowanie {#versioning}

Każda wersja GitHub tworzy nowy obraz Dockera oznaczony następującym tagiem:

1. Konkretna wersja wydania (np. `v1.0.0`)
2. Znacznik `latest` dla najnowszej wersji

Użytkownicy mogą wybrać konkretną wersję w celu zapewnienia stabilności lub tag `latest`, aby zawsze otrzymywać najnowsze funkcje.

## Dostęp do obrazów {#accessing-images}

Obrazy Docker są publicznie dostępne pod adresem:

* `ghcr.io/forwardemail/forwardemail.net-selfhosted:latest`
* `ghcr.io/forwardemail/forwardemail.net-selfhosted:v1.0.0` (przykładowy znacznik wersji)

Do pobrania tych obrazów nie jest wymagane uwierzytelnianie.

## Wkład {#contributing}

Aby przyczynić się do rozwiązania hostowanego samodzielnie:

1. Wprowadź zmiany w odpowiednich plikach w katalogu `self-hosting`
2. Przetestuj lokalnie lub na serwerze VPS z systemem Ubuntu, używając dostarczonego skryptu `setup.sh`
3. Prześlij żądanie ściągnięcia
4. Po scaleniu i utworzeniu nowej wersji, przepływ pracy CI automatycznie skompiluje i opublikuje zaktualizowany obraz Dockera