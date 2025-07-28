# Self-Hosted Releases {#self-hosted-releases}

이 섹션에서는 ForwardEmail의 자체 호스팅 솔루션에 대한 CI/CD 워크플로를 문서화하고 Docker 이미지가 어떻게 빌드, 게시, 배포되는지 설명합니다.

## Table of Contents {#table-of-contents}

* [개요](#overview)
* [CI/CD 워크플로](#cicd-workflow)
  * [GitHub Actions 워크플로](#github-actions-workflow)
  * [Docker 이미지 구조](#docker-image-structure)
* [배포 프로세스](#deployment-process)
  * [설치](#installation)
  * [Docker Compose 구성](#docker-compose-configuration)
* [유지 보수 기능](#maintenance-features)
  * [자동 업데이트](#automatic-updates)
  * [백업 및 복원](#backup-and-restore)
  * [인증서 갱신](#certificate-renewal)
* [버전 관리](#versioning)
* [이미지 접근](#accessing-images)
* [기여하다](#contributing)

## Overview {#overview}

ForwardEmail의 자체 호스팅 솔루션은 GitHub Actions를 사용하여 새 릴리스가 생성될 때마다 Docker 이미지를 자동으로 빌드하고 게시합니다. 이러한 이미지는 제공된 설정 스크립트를 사용하여 사용자가 자신의 서버에 배포할 수 있습니다.

> \[!NOTE]
> There is also our [self-hosted blog](https://forwardemail.net/blog/docs/self-hosted-solution) and [self-hosted developer guide](https://forwardemail.net/self-hosted)
>
> And for the more broken down step-by-step versions see the [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) or [Debian](https://forwardemail.net/guides/selfhosted-on-debian) based guides.

## CI/CD Workflow {#cicd-workflow}

### GitHub Actions Workflow {#github-actions-workflow}

자체 호스팅 Docker 이미지 빌드 및 게시 프로세스는 `.github/workflows/docker-image-build-publish.yml`에 정의되어 있습니다. 이 워크플로는 다음과 같습니다.

1. **트리거**: 새 GitHub 릴리스가 게시되면 자동으로 실행됩니다.
2. **환경**: Node.js 18.20.4를 사용하는 Ubuntu에서 실행됩니다.
3. **빌드 프로세스**:
* 저장소 코드를 체크아웃합니다.
* 다중 플랫폼 빌드를 위한 Docker Buildx를 설정합니다.
* GitHub 컨테이너 레지스트리(GHCR)에 로그인합니다.
* 자체 호스팅 배포를 위한 스키마를 업데이트합니다.
* `self-hosting/Dockerfile-selfhosted`를 사용하여 Docker 이미지를 빌드합니다.
* 이미지에 릴리스 버전과 `latest` 태그를 지정합니다.
* 이미지를 GitHub 컨테이너 레지스트리에 푸시합니다.

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

### Docker 이미지 구조 {#docker-image-structure}

Docker 이미지는 `self-hosting/Dockerfile-selfhosted`에 정의된 다단계 접근 방식을 사용하여 빌드됩니다.

1. **빌더 단계**:
* Node.js 20을 기본 이미지로 사용합니다.
* `SELF_HOSTED=true` 환경 변수를 설정합니다.
* pnpm을 사용하여 종속성을 설치합니다.
* 프로덕션 모드에서 애플리케이션을 빌드합니다.

2. **최종 단계**:
* 더 가벼운 Node.js 20 이미지 사용
* 필요한 시스템 종속성만 설치
* 데이터 저장에 필요한 디렉터리 생성
* 빌더 단계에서 빌드된 애플리케이션 복사

이 접근 방식을 사용하면 최종 이미지의 크기와 보안이 최적화됩니다.

## 배포 프로세스 {#deployment-process}

### 설치 {#installation}

사용자는 제공된 설정 스크립트를 사용하여 셀프 호스팅 솔루션을 배포할 수 있습니다.

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/refs/heads/master/self-hosting/setup.sh)
```

이 스크립트:

1. 저장소 복제
2. 환경 설정
3. DNS 및 방화벽 설정 구성
4. SSL 인증서 생성
5. 최신 Docker 이미지 가져오기
6. Docker Compose를 사용하여 서비스 시작

### Docker Compose 구성 {#docker-compose-configuration}

`docker-compose-self-hosted.yml` 파일은 셀프 호스팅 솔루션에 필요한 모든 서비스를 정의합니다.

* **웹**: 주요 웹 인터페이스
* **API**: 프로그래밍 방식 액세스를 위한 API 서버
* **SMTP**: 이메일 전송 서비스
* **IMAP/POP3**: 이메일 검색 서비스
* **MX**: 메일 교환 서비스
* **CalDAV**: 캘린더 서비스
* **CardDAV**: 연락처 서비스
* **MongoDB**: 사용자 데이터 저장 데이터베이스
* **Redis**: 메모리 내 데이터 저장소
* **SQLite**: 이메일 저장 데이터베이스

각 서비스는 동일한 Docker 이미지를 사용하지만 진입점이 다르므로 모듈식 아키텍처가 가능하고 유지 관리도 간소화됩니다.

## 유지 관리 기능 {#maintenance-features}

셀프 호스팅 솔루션에는 다음과 같은 여러 유지 관리 기능이 포함되어 있습니다.

### 자동 업데이트 {#automatic-updates}

사용자는 다음을 위한 자동 업데이트를 활성화할 수 있습니다.

* 매일 밤 최신 Docker 이미지를 가져옵니다.
* 업데이트된 이미지로 서비스를 다시 시작합니다.
* 업데이트 프로세스를 기록합니다.

```bash
# Setup auto-updates (runs at 1 AM daily)
0 1 * * * docker compose -f /path/to/docker-compose-self-hosted.yml pull && docker compose -f /path/to/docker-compose-self-hosted.yml up -d >> /var/log/autoupdate.log 2>&1
```

### 백업 및 복원 {#backup-and-restore}

설정에는 다음과 같은 옵션이 제공됩니다.

* S3 호환 스토리지에 대한 정기 백업 구성
* MongoDB, Redis, SQLite 데이터 백업
* 장애 발생 시 백업에서 복원

### 인증서 갱신 {#certificate-renewal}

SSL 인증서는 다음 옵션을 통해 자동으로 관리됩니다.

* 설정 중 새 인증서 생성
* 필요 시 인증서 갱신
* 이메일 인증을 위한 DKIM 구성

## 버전 관리 {#versioning}

각 GitHub 릴리스는 다음 태그가 지정된 새로운 Docker 이미지를 생성합니다.

1. 특정 릴리스 버전(예: `v1.0.0`)
2. 최신 릴리스에 대한 `latest` 태그

사용자는 안정성을 위해 특정 버전을 사용하거나 `latest` 태그를 사용하여 항상 최신 기능을 사용할 수 있습니다.

## 이미지 액세스 {#accessing-images}

Docker 이미지는 다음 위치에서 공개적으로 사용 가능합니다.

* `ghcr.io/forwardemail/forwardemail.net-selfhosted:latest`
* `ghcr.io/forwardemail/forwardemail.net-selfhosted:v1.0.0` (예시 버전 태그)

이러한 이미지를 가져오는 데는 인증이 필요하지 않습니다.

## 기여 {#contributing}

셀프 호스팅 솔루션에 기여하려면:

1. `self-hosting` 디렉터리의 관련 파일을 변경합니다.
2. 제공된 `setup.sh` 스크립트를 사용하여 로컬 또는 Ubuntu 기반 VPS에서 테스트합니다.
3. 풀 리퀘스트를 제출합니다.
4. 병합되고 새 릴리스가 생성되면 CI 워크플로가 업데이트된 Docker 이미지를 자동으로 빌드하고 게시합니다.