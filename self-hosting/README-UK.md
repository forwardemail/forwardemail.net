# Релізи, розміщені на власному хостингу {#self-hosted-releases}

У цьому розділі документовано робочий процес CI/CD для самостійно розміщеного рішення ForwardEmail, а також пояснюється, як створюються, публікуються та розгортаються образи Docker.

## Зміст {#table-of-contents}

* [Огляд](#overview)
* [Робочий процес CI/CD](#cicd-workflow)
  * [Робочий процес дій GitHub](#github-actions-workflow)
  * [Структура образу Docker](#docker-image-structure)
* [Процес розгортання](#deployment-process)
  * [Встановлення](#installation)
  * [Конфігурація Docker Compose](#docker-compose-configuration)
* [Особливості технічного обслуговування](#maintenance-features)
  * [Автоматичні оновлення](#automatic-updates)
  * [Резервне копіювання та відновлення](#backup-and-restore)
  * [Поновлення сертифіката](#certificate-renewal)
* [Версіонування](#versioning)
* [Доступ до зображень](#accessing-images)
* [Сприяння](#contributing)

## Огляд {#overview}

Рішення ForwardEmail для самостійного розміщення використовує дії GitHub для автоматичного створення та публікації образів Docker щоразу, коли створюється новий реліз. Ці образи потім доступні для розгортання користувачами на власних серверах за допомогою наданого скрипта налаштування.

> \[!NOTE]
> Також є наші [самостійно розміщений блог](https://forwardemail.net/blog/docs/self-hosted-solution) та [посібник розробника для самостійного розміщення](https://forwardemail.net/self-hosted)
>> А для більш детальних покрокових версій дивіться посібники на основі [Убунту](https://forwardemail.net/guides/selfhosted-on-ubuntu) або [Дебіан](https://forwardemail.net/guides/selfhosted-on-debian).

## Робочий процес CI/CD {#cicd-workflow}

### Робочий процес дій GitHub {#github-actions-workflow}

Процес створення та публікації образу Docker на власному хостингу визначено в `.github/workflows/docker-image-build-publish.yml`. Цей робочий процес:

1. **Тригери**: Автоматично запускається, коли публікується новий реліз GitHub
2. **Середовище**: Працює на Ubuntu з Node.js 18.20.4
3. **Процес збірки**:
* Перевіряє код репозиторію
* Налаштовує Docker Buildx для багатоплатформних збірок
* Входить до реєстру контейнерів GitHub (GHCR)
* Оновлює схему для самостійного розгортання
* Збирає образ Docker за допомогою `self-hosting/Dockerfile-selfhosted`
* Позначає образ тегом версії релізу та `latest`
* Завантажує образи до реєстру контейнерів GitHub

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

### Структура образу Docker {#docker-image-structure}

Образ Docker створюється за допомогою багатоетапного підходу, визначеного в `self-hosting/Dockerfile-selfhosted`:

1. **Етап конструктора**:
* Використовує Node.js 20 як базовий образ
* Встановлює змінну середовища `SELF_HOSTED=true`
* Встановлює залежності за допомогою pnpm
* Збирає застосунок у продакшн-режимі

2. **Заключний етап**:
* Використовує менший образ Node.js 20
* Встановлює лише необхідні системні залежності
* Створює необхідні каталоги для зберігання даних
* Копіює зібраний застосунок з етапу конструктора

Такий підхід гарантує, що кінцеве зображення оптимізоване за розміром та безпекою.

## Процес розгортання {#deployment-process}

### Інсталяція {#installation}

Користувачі можуть розгорнути самостійно розміщене рішення за допомогою наданого сценарію налаштування:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/refs/heads/master/self-hosting/setup.sh)
```

Цей скрипт:

1. Клонує репозиторій
2. Налаштовує середовище
3. Налаштовує параметри DNS та брандмауера
4. Генерує SSL-сертифікати
5. Отримує найновіші образи Docker
6. Запускає служби за допомогою Docker Compose

### Конфігурація створення Docker {#docker-compose-configuration}

Файл `docker-compose-self-hosted.yml` визначає всі служби, необхідні для самостійно розміщеного рішення:

* **Web**: Головний веб-інтерфейс
* **API**: Сервер API для програмного доступу
* **SMTP**: Служба надсилання електронної пошти
* **IMAP/POP3**: Служби отримання електронної пошти
* **MX**: Служба обміну поштою
* **CalDAV**: Служба календаря
* **CardDAV**: Служба контактів
* **MongoDB**: База даних для зберігання даних користувачів
* **Redis**: Сховище даних в пам'яті
* **SQLite**: База даних для зберігання електронних листів

Кожен сервіс використовує один і той самий образ Docker, але з різними точками входу, що дозволяє створювати модульну архітектуру та спрощувати обслуговування.

## Функції технічного обслуговування {#maintenance-features}

Самостійне рішення включає кілька функцій обслуговування:

### Автоматичні оновлення {#automatic-updates}

Користувачі можуть увімкнути автоматичні оновлення, які будуть:

* Щоночі завантажувати останній образ Docker
* Перезапускати служби з оновленим образом
* Записувати процес оновлення

```bash
# Setup auto-updates (runs at 1 AM daily)
0 1 * * * docker compose -f /path/to/docker-compose-self-hosted.yml pull && docker compose -f /path/to/docker-compose-self-hosted.yml up -d >> /var/log/autoupdate.log 2>&1
```

### Резервне копіювання та відновлення {#backup-and-restore}

Налаштування пропонує такі опції:

* Налаштування регулярних резервних копій на сховище, сумісне з S3
* Резервне копіювання даних MongoDB, Redis та SQLite
* Відновлення з резервних копій у разі збою

### Поновлення сертифіката {#certificate-renewal}

SSL-сертифікати керуються автоматично та мають такі опції:

* Генерувати нові сертифікати під час налаштування
* Поновлювати сертифікати за потреби
* Налаштовувати DKIM для автентифікації електронної пошти

## Версіонування {#versioning}

Кожен реліз GitHub створює новий образ Docker з тегами:

1. Конкретна версія випуску (наприклад, `v1.0.0`)
2. Тег `latest` для найновішого випуску

Користувачі можуть вибрати певну версію для стабільності або тег `latest`, щоб завжди отримувати найновіші функції.

## Доступ до зображень {#accessing-images}

Образи Docker доступні для загального доступу за адресою:

* `ghcr.io/forwardemail/forwardemail.net-selfhosted:latest`
* `ghcr.io/forwardemail/forwardemail.net-selfhosted:v1.0.0` (приклад тегу версії)

Для отримання цих зображень автентифікація не потрібна.

## Робить внесок {#contributing}

Щоб зробити свій внесок у розробку самостійно розміщеного рішення:

1. Внесіть зміни до відповідних файлів у каталозі `self-hosting`
2. Тестуйте локально або на VPS на базі Ubuntu, використовуючи наданий скрипт `setup.sh`
3. Надішліть запит на впровадження (pull request)
4. Після об'єднання та створення нового релізу, робочий процес CI автоматично створить та опублікує оновлений образ Docker