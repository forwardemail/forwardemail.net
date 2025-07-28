# 보안 뉴스레터 전달을 위한 이메일 전달 기능이 있는 Listmonk {#listmonk-with-forward-email-for-secure-newsletter-delivery}

## 목차 {#table-of-contents}

* [개요](#overview)
* [Listmonk와 Forward Email을 선택해야 하는 이유](#why-listmonk-and-forward-email)
* [필수 조건](#prerequisites)
* [설치](#installation)
  * [1. 서버 업데이트](#1-update-your-server)
  * [2. 종속성 설치](#2-install-dependencies)
  * [3. Listmonk 구성 다운로드](#3-download-listmonk-configuration)
  * [4. 방화벽(UFW) 구성](#4-configure-firewall-ufw)
  * [5. HTTPS 액세스 구성](#5-configure-https-access)
  * [6. Listmonk 시작하기](#6-start-listmonk)
  * [7. Listmonk에서 전달 이메일 SMTP 구성](#7-configure-forward-email-smtp-in-listmonk)
  * [8. 반송 처리 구성](#8-configure-bounce-processing)
* [테스트](#testing)
  * [메일링 리스트 만들기](#create-a-mailing-list)
  * [구독자 추가](#add-subscribers)
  * [캠페인 만들기 및 보내기](#create-and-send-a-campaign)
* [확인](#verification)
* [개발자 노트](#developer-notes)
* [결론](#conclusion)

## 개요 {#overview}

이 가이드는 개발자에게 강력한 오픈소스 뉴스레터 및 메일링 리스트 관리자인 [리스트몽크](https://listmonk.app/)에서 [이메일 전달](https://forwardemail.net/)을 SMTP 공급자로 사용하도록 설정하는 단계별 지침을 제공합니다. 이러한 조합을 통해 안전하고 개인 정보 보호되며 안정적인 이메일 전송을 보장하면서 캠페인을 효과적으로 관리할 수 있습니다.

* **Listmonk**: 구독자 관리, 목록 구성, 캠페인 생성 및 성과 추적을 처리합니다.
* **이메일 전달**: 보안 SMTP 서버 역할을 하며, SPF, DKIM, DMARC, TLS 암호화와 같은 내장 보안 기능을 사용하여 실제 이메일 발송을 처리합니다.

이 두 가지를 통합하면 Forward Email의 강력한 전송 시스템을 활용하는 동시에 데이터와 인프라에 대한 완벽한 제어권을 확보할 수 있습니다.

## Listmonk와 Forward Email을 사용하는 이유 {#why-listmonk-and-forward-email}

* **오픈 소스**: Listmonk와 Forward Email의 원칙은 모두 투명성과 통제력을 강조합니다. Listmonk는 직접 호스팅하고 데이터를 소유합니다.
* **개인정보 보호 중심**: Forward Email은 개인정보 보호를 핵심으로 구축되어 데이터 보존을 최소화하고 안전한 전송에 중점을 둡니다.
* **비용 효율적**: Listmonk는 무료이며, Forward Email은 넉넉한 무료 티어와 저렴한 유료 플랜을 제공하여 예산에 맞는 솔루션입니다.
* **확장성**: Listmonk는 성능이 뛰어나고, Forward Email의 인프라는 대규모 전송 시 안정적인 전송을 위해 설계되었습니다.
* **개발자 친화적**: Listmonk는 강력한 API를 제공하고, Forward Email은 간편한 SMTP 통합 및 웹훅을 제공합니다.

## 필수 조건 {#prerequisites}

시작하기 전에 다음 사항이 있는지 확인하세요.

* 최신 Linux 배포판(Ubuntu 20.04 이상 권장)을 실행하고 CPU 1개와 RAM 1GB(2GB 권장) 이상을 갖춘 가상 사설 서버(VPS)가 필요합니다.
* 제공업체가 필요하신가요? [추천 VPS 목록](https://github.com/forwardemail/awesome-mail-server-providers)을 확인해 보세요.
* 직접 관리하는 도메인 이름(DNS 접근 권한 필요)
* [이메일 전달](https://forwardemail.net/) 권한이 있는 활성 계정
* VPS에 대한 루트 또는 `sudo` 접근 권한
* Linux 명령줄 작업에 대한 기본적인 지식이 필요합니다.

## 설치 {#installation}

이 단계에서는 Docker와 Docker Compose를 사용하여 VPS에 Listmonk를 설치하는 방법을 안내합니다.

### 1. 서버 업데이트 {#1-update-your-server}

시스템의 패키지 목록과 설치된 패키지가 최신 상태인지 확인하세요.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. 종속성 설치 {#2-install-dependencies}

Docker, Docker Compose, UFW(Uncomplicated Firewall)를 설치합니다.

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Listmonk 구성 다운로드 {#3-download-listmonk-configuration}

Listmonk용 디렉토리를 만들고 공식 `docker-compose.yml` 파일을 다운로드합니다.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

이 파일은 Listmonk 애플리케이션 컨테이너와 필요한 PostgreSQL 데이터베이스 컨테이너를 정의합니다.

### 4. 방화벽 구성(UFW) {#4-configure-firewall-ufw}

필수 트래픽(SSH, HTTP, HTTPS)이 방화벽을 통과하도록 허용하세요. SSH가 비표준 포트에서 실행되는 경우, 그에 맞게 포트를 조정하세요.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

메시지가 표시되면 방화벽을 활성화하세요.

### 5. HTTPS 액세스 구성 {#5-configure-https-access}

HTTPS를 통해 Listmonk를 실행하는 것은 보안에 매우 중요합니다. 두 가지 주요 옵션이 있습니다.

#### 옵션 A: Cloudflare Proxy 사용(간편성을 위해 권장) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

도메인의 DNS가 Cloudflare에서 관리되는 경우, Cloudflare의 프록시 기능을 활용하여 간편한 HTTPS를 사용할 수 있습니다.

1. **지정 DNS**: Cloudflare에 Listmonk 하위 도메인(예: `listmonk.yourdomain.com`)에 대한 `A` 레코드를 생성하여 VPS IP 주소를 가리키도록 합니다. **프록시 상태**가 **프록시됨**(주황색 구름)으로 설정되어 있는지 확인합니다.
2. **Docker Compose 수정**: 다운로드한 `docker-compose.yml` 파일을 편집합니다.
```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
이렇게 하면 Listmonk가 포트 80을 통해 내부적으로 접근할 수 있게 되며, Cloudflare는 이 포트를 HTTPS로 프록시하고 보호할 수 있습니다.

#### 옵션 B: 역방향 프록시 사용(Nginx, Caddy 등) {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

또는 VPS에 Nginx나 Caddy와 같은 역방향 프록시를 설정하여 HTTPS 종료 및 Listmonk(기본적으로 포트 9000에서 실행)에 대한 프록시 요청을 처리할 수 있습니다.

* Listmonk가 로컬에서만 접근 가능하도록 기본 `ports: - "127.0.0.1:9000:9000"`을 `docker-compose.yml`에 유지합니다.
* 선택한 역방향 프록시가 80번 및 443번 포트에서 수신 대기하고, SSL 인증서 획득(예: Let's Encrypt를 통해)을 처리하고, 트래픽을 `http://127.0.0.1:9000`로 전달하도록 구성합니다.
* 자세한 역방향 프록시 설정은 이 가이드의 범위를 벗어나지만, 온라인에서 다양한 튜토리얼을 확인할 수 있습니다.

### 6. Listmonk 시작 {#6-start-listmonk}

`listmonk` 디렉토리로 다시 이동합니다(아직 거기에 있지 않다면). 그리고 분리 모드로 컨테이너를 시작합니다.

```bash
cd ~/listmonk # Or the directory where you saved docker-compose.yml
docker compose up -d
```

Docker가 필요한 이미지를 다운로드하고 Listmonk 애플리케이션과 데이터베이스 컨테이너를 시작합니다. 처음에는 1~2분 정도 걸릴 수 있습니다.

✅ **Listmonk에 액세스**: 이제 구성한 도메인(예: `https://listmonk.yourdomain.com`)을 통해 Listmonk 웹 인터페이스에 액세스할 수 있습니다.

### 7. Listmonk에서 전달 이메일 SMTP 구성 {#7-configure-forward-email-smtp-in-listmonk}

다음으로, Forward Email 계정을 사용하여 Listmonk가 이메일을 보내도록 구성합니다.

1. **전달 이메일에서 SMTP 활성화**: 전달 이메일 계정 대시보드에서 SMTP 자격 증명을 생성했는지 확인하세요. 아직 생성하지 않았다면 [SMTP를 통해 사용자 정의 도메인으로 이메일을 보내는 방법 이메일 전달 가이드](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp)을 따르세요.
2. **Listmonk 구성**: Listmonk 관리자 패널에 로그인하세요.
* **설정 -> SMTP**로 이동하세요.

* Listmonk에는 이메일 전달 기능이 기본으로 내장되어 있습니다. 제공업체 목록에서 **ForwardEmail**을 선택하거나 다음 정보를 직접 입력하세요.

| 환경 | 값 |
| :---------------- | :------------------------------------------------------------------------------------------------------------------ |
| **주인** | `smtp.forwardemail.net` |
| **포트** | `465` |
| **인증 프로토콜** | `LOGIN` |
| **사용자 이름** | 전달 이메일 **SMTP 사용자 이름** |
| **비밀번호** | 전달 이메일 **SMTP 비밀번호** |
| **TLS** | `SSL/TLS` |
| **이메일에서** | 원하는 `From` 주소(예: `newsletter@yourdomain.com`). 이 도메인이 전달 이메일에 구성되어 있는지 확인하세요. |

* **중요**: 이메일 전달 시 보안 연결을 위해 항상 `465` 포트와 `SSL/TLS` 포트를 함께 사용하세요. STARTTLS(포트 587)는 사용하지 마세요.

* **저장**을 클릭하세요.
3. **테스트 이메일 보내기**: SMTP 설정 페이지에서 "테스트 이메일 보내기" 버튼을 클릭하세요. 접근 가능한 수신자 주소를 입력하고 **보내기**를 클릭하세요. 이메일이 수신자의 받은 편지함에 도착하는지 확인하세요.

### 8. 반송 처리 구성 {#8-configure-bounce-processing}

반송 처리를 통해 Listmonk는 전달되지 못한 이메일(예: 잘못된 주소로 인해)을 자동으로 처리할 수 있습니다. 이메일 전달 기능은 Listmonk에 반송 메일을 알리는 웹훅을 제공합니다.

#### 이메일 전달 설정 {#forward-email-setup}

1. [전달 이메일 대시보드](https://forwardemail.net/)에 로그인하세요.
2. **도메인**으로 이동하여 발송에 사용할 도메인을 선택하고 **설정** 페이지로 이동하세요.
3. **반송 웹훅 URL** 섹션까지 아래로 스크롤하세요.
4. 다음 URL을 입력하세요. `<your_listmonk_domain>`을 Listmonk 인스턴스에 액세스할 수 있는 실제 도메인 또는 하위 도메인으로 바꾸세요.
```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
*예*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. **웹훅 서명 페이로드 확인 키** 섹션까지 아래로 스크롤하세요.
6. 생성된 확인 키를 **복사**하세요. Listmonk에서 이 키가 필요합니다.
7. 전달 이메일 도메인 설정에서 변경 사항을 저장하세요.

#### Listmonk 설정 {#listmonk-setup}

1. Listmonk 관리자 패널에서 **설정 -> 반송**으로 이동합니다.
2. **반송 처리 사용**을 활성화합니다.
3. **반송 웹훅 사용**을 활성화합니다.
4. **웹훅 제공자** 섹션까지 아래로 스크롤합니다.
5. **이메일 전달**을 활성화합니다.
6. 이메일 전달 대시보드에서 복사한 **웹훅 서명 페이로드 확인 키**를 **이메일 전달 키** 필드에 붙여넣습니다.
7. 페이지 하단의 **저장**을 클릭합니다.
8. 이제 반송 처리가 설정되었습니다! Listmonk에서 보낸 이메일의 반송을 감지하면 전달 이메일이 웹훅을 통해 Listmonk 인스턴스에 알리고 Listmonk는 해당 구독자를 표시합니다.
9. [테스트](#testing)에서 아래 단계를 완료하여 모든 것이 제대로 작동하는지 확인합니다.

## 테스트 중 {#testing}}

Listmonk의 핵심 기능에 대한 간략한 개요는 다음과 같습니다.

### 메일링 리스트 만들기 {#create-a-mailing-list}

* 사이드바에서 **목록**으로 이동합니다.
* **새 목록**을 클릭합니다.
* 세부 정보(이름, 유형: 공개/비공개, 설명, 태그)를 입력하고 **저장**합니다.

### 구독자 추가 {#add-subscribers}

* **구독자** 섹션으로 이동하세요.
* 구독자를 추가할 수 있습니다.
* **수동**: **새 구독자**를 클릭하세요.
* **가져오기**: **구독자 가져오기**를 클릭하여 CSV 파일을 업로드하세요.
* **API**: Listmonk API를 사용하여 프로그래밍 방식으로 구독자를 추가하세요.
* 목록을 만들거나 가져오는 동안 하나 이상의 목록에 구독자를 할당하세요.
* **모범 사례**: 이중 옵트인 프로세스를 사용하세요. **설정 -> 옵트인 및 구독**에서 설정하세요.

### 캠페인 만들기 및 보내기 {#create-and-send-a-campaign}

* **캠페인** -> **새 캠페인**으로 이동합니다.
* 캠페인 세부 정보(이름, 제목, 발신 이메일, 보낼 목록)를 입력합니다.
* 콘텐츠 유형(서식 있는 텍스트/HTML, 일반 텍스트, 원시 HTML)을 선택합니다.
* 이메일 콘텐츠를 작성합니다. `{{ .Subscriber.Email }}` 또는 `{{ .Subscriber.FirstName }}`과 같은 템플릿 변수를 사용할 수 있습니다.
* **먼저 테스트 이메일을 보내세요!** "테스트 전송" 옵션을 사용하여 받은 편지함에서 이메일을 미리 확인하세요.
* 만족스러우면 **캠페인 시작**을 클릭하여 즉시 전송하거나 나중에 전송하도록 예약합니다.

## 확인 {#verification}

* **SMTP 전송**: Listmonk의 SMTP 설정 페이지를 통해 정기적으로 테스트 이메일을 발송하고 캠페인을 테스트하여 이메일이 정상적으로 전송되는지 확인하세요.
* **반송 처리**: 유효하지 않은 것으로 알려진 이메일 주소(예: 실제 이메일 주소가 없는 경우 `bounce-test@yourdomain.com`)로 테스트 캠페인을 발송합니다. 단, 결과는 다를 수 있습니다.)로 발송 후 잠시 후 Listmonk에서 캠페인 통계를 확인하여 반송 메일이 등록되었는지 확인하세요.
* **이메일 헤더**: [메일 테스터](https://www.mail-tester.com/)과 같은 도구를 사용하거나 이메일 헤더를 직접 검사하여 SPF, DKIM, DMARC가 통과하는지 확인하세요. 이는 전달 이메일을 통해 설정이 제대로 되었음을 나타냅니다.
* **전달 이메일 로그**: SMTP 서버에서 전송 문제가 발생한 것으로 의심되는 경우 전달 이메일 대시보드 로그를 확인하세요.

## 개발자 노트 {#developer-notes}

* **템플릿**: Listmonk는 Go의 템플릿 엔진을 사용합니다. 고급 개인화에 대한 문서는 `{{ .Subscriber.Attribs.your_custom_field }}`에서 확인하세요.
* **API**: Listmonk는 목록, 구독자, 캠페인, 템플릿 등을 관리하기 위한 포괄적인 REST API를 제공합니다. Listmonk 인스턴스의 푸터에서 API 문서 링크를 확인하세요.
* **사용자 정의 필드**: **설정 -> 구독자 필드**에서 사용자 정의 구독자 필드를 정의하여 추가 데이터를 저장할 수 있습니다.
* **웹훅**: Listmonk는 반송 외에도 다른 이벤트(예: 구독)에 대한 웹훅을 전송하여 다른 시스템과 통합할 수 있습니다.

## 결론 {#conclusion}

Listmonk의 셀프 호스팅 기능과 Forward Email의 안전하고 개인 정보를 보호하는 전송 기능을 통합하여 강력하고 윤리적인 이메일 마케팅 플랫폼을 구축할 수 있습니다. 높은 전달률과 자동화된 보안 기능의 이점을 누리면서 잠재 고객 데이터에 대한 완전한 소유권을 확보할 수 있습니다.

이러한 설정은 독점적인 이메일 서비스에 비해 확장 가능하고 비용 효율적이며 개발자 친화적인 대안을 제공하며, 오픈 소스 소프트웨어와 사용자 개인 정보 보호의 정신에 완벽하게 부합합니다.

즐거운 발송 되세요! 🚀