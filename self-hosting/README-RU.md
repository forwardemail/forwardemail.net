# Self-Hosted Releases {#self-hosted-releases}

В этом разделе описывается рабочий процесс CI/CD для самостоятельно размещенного решения ForwardEmail, а также объясняется, как создаются, публикуются и развертываются образы Docker.

## Table of Contents {#table-of-contents}

* [Обзор](#overview)
* [Рабочий процесс CI/CD](#cicd-workflow)
  * [Рабочий процесс действий GitHub](#github-actions-workflow)
  * [Структура образа Docker](#docker-image-structure)
* [Процесс развертывания](#deployment-process)
  * [Установка](#installation)
  * [Конфигурация Docker Compose](#docker-compose-configuration)
* [Особенности обслуживания](#maintenance-features)
  * [Автоматические обновления](#automatic-updates)
  * [Резервное копирование и восстановление](#backup-and-restore)
  * [Продление сертификата](#certificate-renewal)
* [Версионирование](#versioning)
* [Доступ к изображениям](#accessing-images)
* [Внося вклад](#contributing)

## Overview {#overview}

Самостоятельное решение ForwardEmail использует GitHub Actions для автоматического создания и публикации образов Docker всякий раз, когда создается новый релиз. Затем эти образы доступны пользователям для развертывания на их собственных серверах с помощью предоставленного скрипта настройки.

> \[!NOTE]
> There is also our [self-hosted blog](https://forwardemail.net/blog/docs/self-hosted-solution) and [self-hosted developer guide](https://forwardemail.net/self-hosted)
>
> And for the more broken down step-by-step versions see the [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) or [Debian](https://forwardemail.net/guides/selfhosted-on-debian) based guides.

## CI/CD Workflow {#cicd-workflow}

### GitHub Actions Workflow {#github-actions-workflow}

Процесс сборки и публикации образа Docker на собственном сервере описан в `.github/workflows/docker-image-build-publish.yml`. Этот рабочий процесс:

1. **Триггеры**: Автоматически запускается при публикации нового релиза GitHub.
2. **Окружение**: Работает в Ubuntu с Node.js 18.20.4.
3. **Процесс сборки**:
* Проверка кода репозитория.
* Настройка Docker Buildx для многоплатформенных сборок.
* Вход в GitHub Container Registry (GHCR).
* Обновление схемы для самостоятельного развёртывания.
* Сборка образа Docker с использованием `self-hosting/Dockerfile-selfhosted`.
* Добавление к образу меток версии релиза и `latest`.
* Отправка образов в GitHub Container Registry.

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

### Структура образа Docker {#docker-image-structure}

Образ Docker создается с использованием многоэтапного подхода, определенного в `self-hosting/Dockerfile-selfhosted`:

1. **Этап сборки**:
* Использует Node.js 20 в качестве базового образа
* Устанавливает переменную окружения `SELF_HOSTED=true`
* Устанавливает зависимости с помощью pnpm
* Собирает приложение в режиме производства

2. **Финальный этап**:
* Использует более тонкий образ Node.js 20
* Устанавливает только необходимые системные зависимости
* Создает необходимые каталоги для хранения данных
* Копирует собранное приложение из этапа сборки

Такой подход гарантирует, что конечное изображение будет оптимизировано по размеру и безопасности.

## Процесс развертывания {#deployment-process}

### Установка {#installation}

Пользователи могут развернуть самостоятельно размещенное решение с помощью предоставленного скрипта настройки:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/refs/heads/master/self-hosting/setup.sh)
```

Этот скрипт:

1. Клонирует репозиторий
2. Настраивает среду
3. Настраивает параметры DNS и брандмауэра
4. Генерирует сертификаты SSL
5. Извлекает последние образы Docker
6. Запускает службы с помощью Docker Compose

### Конфигурация Docker Compose {#docker-compose-configuration}

Файл `docker-compose-self-hosted.yml` определяет все службы, необходимые для решения с самостоятельным размещением:

* **Web**: Основной веб-интерфейс
* **API**: API-сервер для программного доступа
* **SMTP**: Служба отправки электронной почты
* **IMAP/POP3**: Службы получения электронной почты
* **MX**: Служба обмена почтой
* **CalDAV**: Служба календаря
* **CardDAV**: Служба контактов
* **MongoDB**: База данных для хранения пользовательских данных
* **Redis**: Хранилище данных в памяти
* **SQLite**: База данных для хранения электронных писем

Каждая служба использует один и тот же образ Docker, но с разными точками входа, что позволяет реализовать модульную архитектуру и упростить обслуживание.

## Функции обслуживания {#maintenance-features}

Решение с самостоятельным размещением включает в себя несколько функций обслуживания:

### Автоматические обновления {#automatic-updates}

Пользователи могут включить автоматические обновления, которые:

* Каждую ночь извлекайте последний образ Docker
* Перезапускайте службы с обновленным образом
* Регистрируйте процесс обновления

```bash
# Setup auto-updates (runs at 1 AM daily)
0 1 * * * docker compose -f /path/to/docker-compose-self-hosted.yml pull && docker compose -f /path/to/docker-compose-self-hosted.yml up -d >> /var/log/autoupdate.log 2>&1
```

### Резервное копирование и восстановление {#backup-and-restore}

Настройка предоставляет возможности для:

* Настройка регулярных резервных копий в хранилище, совместимом с S3
* Резервное копирование данных MongoDB, Redis и SQLite
* Восстановление из резервных копий в случае сбоя

### Продление сертификата {#certificate-renewal}

SSL-сертификаты управляются автоматически и имеют следующие возможности:

* Сгенерируйте новые сертификаты во время настройки
* Обновите сертификаты при необходимости
* Настройте DKIM для аутентификации электронной почты

## Управление версиями {#versioning}

Каждый релиз GitHub создает новый образ Docker, помеченный следующими тегами:

1. Конкретная версия выпуска (например, `v1.0.0`)
2. Тег `latest` для последней версии.

Пользователи могут выбрать определенную версию для стабильности или тег `latest`, чтобы всегда получать самые новые функции.

## Доступ к изображениям {#accessing-images}

Образы Docker доступны публично по адресу:

* `ghcr.io/forwardemail/forwardemail.net-selfhosted:latest`
* `ghcr.io/forwardemail/forwardemail.net-selfhosted:v1.0.0` (пример тега версии)

Для извлечения этих изображений аутентификация не требуется.

## Вклад {#contributing}

Чтобы внести свой вклад в решение, размещенное на собственном сервере:

1. Внесите изменения в соответствующие файлы в каталоге `self-hosting`
2. Выполните тестирование локально или на VPS-сервере на базе Ubuntu, используя предоставленный скрипт `setup.sh`
3. Отправьте запрос на извлечение
4. После слияния и создания нового релиза рабочий процесс непрерывной интеграции автоматически соберет и опубликует обновлённый образ Docker.