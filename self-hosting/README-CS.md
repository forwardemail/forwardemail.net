# Self-Hosted Releases {#self-hosted-releases}

Tato část dokumentuje pracovní postup CI/CD pro samohostované řešení ForwardEmail a vysvětluje, jak se vytvářejí, publikují a nasazují obrazy Docker.

## Table of Contents {#table-of-contents}

* [Přehled](#overview)
* [Pracovní postup CI/CD](#cicd-workflow)
  * [Pracovní postup akcí GitHub](#github-actions-workflow)
  * [Struktura obrázku Docker](#docker-image-structure)
* [Proces nasazení](#deployment-process)
  * [Instalace](#installation)
  * [Konfigurace Docker Compose](#docker-compose-configuration)
* [Funkce údržby](#maintenance-features)
  * [Automatické aktualizace](#automatic-updates)
  * [Zálohování a obnovení](#backup-and-restore)
  * [Obnovení certifikátu](#certificate-renewal)
* [Verzování](#versioning)
* [Přístup k obrázkům](#accessing-images)
* [Přispívání](#contributing)

## Overview {#overview}

Samoobslužné řešení ForwardEmail používá akce GitHub k automatickému vytváření a publikování obrázků Docker, kdykoli je vytvořeno nové vydání. Tyto obrazy jsou pak uživatelům k dispozici k nasazení na jejich vlastních serverech pomocí poskytnutého instalačního skriptu.

> \[!NOTE]
> There is also our [self-hosted blog](https://forwardemail.net/blog/docs/self-hosted-solution) and [self-hosted developer guide](https://forwardemail.net/self-hosted)
>
> And for the more broken down step-by-step versions see the [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) or [Debian](https://forwardemail.net/guides/selfhosted-on-debian) based guides.

## CI/CD Workflow {#cicd-workflow}

### GitHub Actions Workflow {#github-actions-workflow}

Proces sestavení a publikování vlastního obrazu Dockeru je definován v `.github/workflows/docker-image-build-publish.yml`. Tento pracovní postup:

1. **Triggery**: Automaticky se spustí při publikování nové verze GitHubu
2. **Prostředí**: Běží na Ubuntu s Node.js 18.20.4
3. **Proces sestavení**:
* Zkontroluje kód repozitáře
* Nastaví Docker Buildx pro multiplatformní sestavení
* Přihlásí se do registru kontejnerů GitHub (GHCR)
* Aktualizuje schéma pro samoobslužné nasazení
* Sestaví obraz Dockeru pomocí `self-hosting/Dockerfile-selfhosted`
* Označí obraz jak verzí vydání, tak `latest`
* Odešle obrazy do registru kontejnerů GitHub

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

### Struktura obrazu Dockeru {#docker-image-structure}

Obraz Dockeru je sestaven pomocí vícestupňového přístupu definovaného v `self-hosting/Dockerfile-selfhosted`:

1. **Fáze Builderu**:
* Používá Node.js 20 jako základní obraz
* Nastavuje proměnnou prostředí `SELF_HOSTED=true`
* Instaluje závislosti pomocí pnpm
* Sestavuje aplikaci v produkčním režimu

2. **Závěrečná fáze**:
* Používá štíhlejší obraz Node.js 20
* Instaluje pouze nezbytné systémové závislosti
* Vytvoří požadované adresáře pro ukládání dat
* Zkopíruje sestavenou aplikaci z fáze builderu

Tento přístup zajišťuje, že výsledný obraz je optimalizován pro velikost a zabezpečení.

## Proces nasazení {#deployment-process}

Instalace ### {#installation}

Uživatelé mohou nasadit vlastní hostované řešení pomocí poskytnutého instalačního skriptu:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/refs/heads/master/self-hosting/setup.sh)
```

Tento skript:

1. Klonuje repozitář
2. Nastavuje prostředí
3. Konfiguruje nastavení DNS a firewallu
4. Generuje SSL certifikáty
5. Načítá nejnovější obrazy Dockeru
6. Spouští služby pomocí Docker Compose

### Konfigurace psaní v Dockeru {#docker-compose-configuration}

Soubor `docker-compose-self-hosted.yml` definuje všechny služby potřebné pro samoobslužné řešení:

* **Web**: Hlavní webové rozhraní
* **API**: API server pro programový přístup
* **SMTP**: Služba odesílání e-mailů
* **IMAP/POP3**: Služby pro vyhledávání e-mailů
* **MX**: Služba pro výměnu pošty
* **CalDAV**: Služba kalendáře
* **CardDAV**: Služba kontaktů
* **MongoDB**: Databáze pro ukládání uživatelských dat
* **Redis**: Úložiště dat v paměti
* **SQLite**: Databáze pro ukládání e-mailů

Každá služba používá stejný obraz Dockeru, ale s různými vstupními body, což umožňuje modulární architekturu a zároveň zjednodušuje údržbu.

## Funkce údržby {#maintenance-features}

Samoobslužné řešení zahrnuje několik funkcí údržby:

### Automatické aktualizace {#automatic-updates}

Uživatelé mohou povolit automatické aktualizace, které:

* Každý večer stáhnout nejnovější obraz Dockeru
* Restartovat služby s aktualizovaným obrazem
* Zaznamenat proces aktualizace

```bash
# Setup auto-updates (runs at 1 AM daily)
0 1 * * * docker compose -f /path/to/docker-compose-self-hosted.yml pull && docker compose -f /path/to/docker-compose-self-hosted.yml up -d >> /var/log/autoupdate.log 2>&1
```

### Zálohování a obnovení {#backup-and-restore}

Nastavení poskytuje možnosti pro:

* Konfigurace pravidelných záloh na úložiště kompatibilní s S3
* Zálohování dat MongoDB, Redis a SQLite
* Obnova ze záloh v případě selhání

### Obnovení certifikátu {#certificate-renewal}

Certifikáty SSL jsou spravovány automaticky s následujícími možnostmi:

* Generování nových certifikátů během nastavení
* Obnovení certifikátů v případě potřeby
* Konfigurace DKIM pro ověřování e-mailů

## Verze {#versioning}

Každá verze GitHubu vytvoří nový obrázek Dockeru označený:

1. Konkrétní verze (např. `v1.0.0`)
2. Tag `latest` pro nejnovější verzi

Uživatelé si mohou zvolit použití konkrétní verze pro zajištění stability nebo tagu `latest`, aby vždy získali nejnovější funkce.

## Přístup k obrázkům {#accessing-images}

Obrázky Dockeru jsou veřejně dostupné na:

* `ghcr.io/forwardemail/forwardemail.net-selfhosted:latest`
* `ghcr.io/forwardemail/forwardemail.net-selfhosted:v1.0.0` (příklad tagu verze)

K získání těchto obrázků není vyžadováno žádné ověření.

## Přispívá {#contributing}

Chcete-li přispět k řešení s vlastním hostitelem:

1. Proveďte změny v příslušných souborech v adresáři `self-hosting`
2. Otestujte lokálně nebo na VPS s Ubuntu pomocí poskytnutého skriptu `setup.sh`
3. Odešlete žádost o stažení aktualizací (pull request)
4. Po sloučení a vytvoření nové verze pracovní postup CI automaticky sestaví a publikuje aktualizovaný obraz Dockeru.