# Listmonk와 Forward Email을 이용한 안전한 뉴스레터 발송 {#listmonk-with-forward-email-for-secure-newsletter-delivery}


## 목차 {#table-of-contents}

* [개요](#overview)
* [왜 Listmonk와 Forward Email인가](#why-listmonk-and-forward-email)
* [사전 준비 사항](#prerequisites)
* [설치](#installation)
  * [1. 서버 업데이트](#1-update-your-server)
  * [2. 의존성 설치](#2-install-dependencies)
  * [3. Listmonk 구성 다운로드](#3-download-listmonk-configuration)
  * [4. 방화벽 설정 (UFW)](#4-configure-firewall-ufw)
  * [5. HTTPS 접근 설정](#5-configure-https-access)
  * [6. Listmonk 시작](#6-start-listmonk)
  * [7. Listmonk에서 Forward Email SMTP 설정](#7-configure-forward-email-smtp-in-listmonk)
  * [8. 반송 처리 설정](#8-configure-bounce-processing)
* [테스트](#testing)
  * [메일링 리스트 생성](#create-a-mailing-list)
  * [구독자 추가](#add-subscribers)
  * [캠페인 생성 및 발송](#create-and-send-a-campaign)
* [검증](#verification)
* [개발자 노트](#developer-notes)
* [결론](#conclusion)


## 개요 {#overview}

이 가이드는 강력한 오픈 소스 뉴스레터 및 메일링 리스트 관리자 [Listmonk](https://listmonk.app/)를 [Forward Email](https://forwardemail.net/)을 SMTP 공급자로 사용하도록 설정하는 단계별 지침을 개발자에게 제공합니다. 이 조합은 캠페인을 효과적으로 관리하면서 안전하고 개인 정보 보호가 보장된 신뢰할 수 있는 이메일 발송을 가능하게 합니다.

* **Listmonk**: 구독자 관리, 리스트 조직, 캠페인 생성 및 성과 추적을 담당합니다.
* **Forward Email**: SPF, DKIM, DMARC, TLS 암호화와 같은 내장 보안 기능을 갖춘 안전한 SMTP 서버 역할을 하며 실제 이메일 발송을 처리합니다.

이 둘을 통합함으로써 데이터와 인프라에 대한 완전한 제어권을 유지하면서 Forward Email의 강력한 발송 시스템을 활용할 수 있습니다.


## 왜 Listmonk와 Forward Email인가 {#why-listmonk-and-forward-email}

* **오픈 소스**: Listmonk와 Forward Email의 원칙 모두 투명성과 제어를 강조합니다. Listmonk는 직접 호스팅하여 데이터를 소유합니다.
* **개인정보 보호 중심**: Forward Email은 개인정보 보호를 핵심으로 설계되어 데이터 보유를 최소화하고 안전한 전송에 집중합니다.
* **비용 효율적**: Listmonk는 무료이며 Forward Email은 관대한 무료 요금제와 저렴한 유료 요금제를 제공하여 예산 친화적인 솔루션입니다.
* **확장성**: Listmonk는 높은 성능을 제공하며 Forward Email의 인프라는 대규모 신뢰성 있는 발송을 위해 설계되었습니다.
* **개발자 친화적**: Listmonk는 강력한 API를 제공하며 Forward Email은 간단한 SMTP 통합과 웹훅을 지원합니다.


## 사전 준비 사항 {#prerequisites}

시작하기 전에 다음을 준비하세요:

* 최신 리눅스 배포판(Ubuntu 20.04 이상 권장)이 실행 중인 가상 사설 서버(VPS)로 최소 1 CPU와 1GB RAM(2GB 권장)을 갖춘 환경.
  * 공급자가 필요하신가요? [추천 VPS 목록](https://github.com/forwardemail/awesome-mail-server-providers)을 확인하세요.
* 도메인 이름(관리 가능한 DNS 접근 권한 필요).
* [Forward Email](https://forwardemail.net/) 활성 계정.
* VPS에 대한 루트 또는 `sudo` 권한.
* 리눅스 명령줄 기본 사용법에 대한 이해.


## 설치 {#installation}

이 단계들은 VPS에서 Docker와 Docker Compose를 사용하여 Listmonk를 설치하는 방법을 안내합니다.

### 1. 서버 업데이트 {#1-update-your-server}

시스템의 패키지 목록과 설치된 패키지를 최신 상태로 유지하세요.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. 의존성 설치 {#2-install-dependencies}

Docker, Docker Compose, 그리고 UFW(Uncomplicated Firewall)를 설치하세요.

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Listmonk 구성 다운로드 {#3-download-listmonk-configuration}

Listmonk용 디렉터리를 만들고 공식 `docker-compose.yml` 파일을 다운로드하세요.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

이 파일은 Listmonk 애플리케이션 컨테이너와 필요한 PostgreSQL 데이터베이스 컨테이너를 정의합니다.
### 4. Configure Firewall (UFW) {#4-configure-firewall-ufw}

필수 트래픽(SSH, HTTP, HTTPS)을 방화벽을 통해 허용하세요. SSH가 비표준 포트에서 실행 중이라면 적절히 조정하세요.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

프롬프트가 뜨면 방화벽 활성화를 확인하세요.

### 5. Configure HTTPS Access {#5-configure-https-access}

Listmonk을 HTTPS로 실행하는 것은 보안을 위해 매우 중요합니다. 두 가지 주요 옵션이 있습니다:

#### Option A: Using Cloudflare Proxy (Recommended for Simplicity) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

도메인의 DNS가 Cloudflare에서 관리되는 경우, Cloudflare의 프록시 기능을 활용하여 간편하게 HTTPS를 사용할 수 있습니다.

1. **DNS 지정**: Cloudflare에서 Listmonk 서브도메인(예: `listmonk.yourdomain.com`)에 대해 VPS IP 주소를 가리키는 `A` 레코드를 생성하세요. **Proxy status**가 **Proxied**(주황색 구름)로 설정되어 있는지 확인하세요.
2. **Docker Compose 수정**: 다운로드한 `docker-compose.yml` 파일을 편집하세요:
   ```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
   이렇게 하면 Listmonk이 내부적으로 포트 80에서 접근 가능해지고, Cloudflare가 이를 프록시하여 HTTPS로 보안합니다.

#### Option B: Using a Reverse Proxy (Nginx, Caddy, etc.) {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

또는 VPS에서 Nginx, Caddy 등의 리버스 프록시를 설정하여 HTTPS 종료를 처리하고 Listmonk(기본 포트 9000)로 요청을 프록시할 수 있습니다.

* `docker-compose.yml`에서 기본 `ports: - "127.0.0.1:9000:9000"` 설정을 유지하여 Listmonk이 로컬에서만 접근 가능하도록 하세요.
* 선택한 리버스 프록시를 포트 80과 443에서 수신하도록 설정하고, SSL 인증서 획득(예: Let's Encrypt) 및 트래픽을 `http://127.0.0.1:9000`으로 전달하도록 구성하세요.
* 리버스 프록시 설정에 대한 자세한 내용은 이 가이드 범위를 벗어나지만, 온라인에 많은 튜토리얼이 있습니다.

### 6. Start Listmonk {#6-start-listmonk}

`listmonk` 디렉터리로 돌아가서(이미 그곳에 있지 않다면) 컨테이너를 분리 모드로 시작하세요.

```bash
cd ~/listmonk # 또는 docker-compose.yml을 저장한 디렉터리
docker compose up -d
```

Docker가 필요한 이미지를 다운로드하고 Listmonk 애플리케이션 및 데이터베이스 컨테이너를 시작합니다. 처음 실행 시 1~2분 정도 걸릴 수 있습니다.

✅ **Listmonk 접속**: 이제 구성한 도메인(예: `https://listmonk.yourdomain.com`)을 통해 Listmonk 웹 인터페이스에 접속할 수 있습니다.

### 7. Configure Forward Email SMTP in Listmonk {#7-configure-forward-email-smtp-in-listmonk}

다음으로, Forward Email 계정을 사용하여 Listmonk에서 이메일을 보내도록 설정합니다.

1. **Forward Email에서 SMTP 활성화**: Forward Email 계정 대시보드에서 SMTP 자격 증명을 생성했는지 확인하세요. 아직 생성하지 않았다면 [Forward Email 가이드: SMTP를 통한 커스텀 도메인 이메일 전송](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp)을 참고하세요.
2. **Listmonk 설정**: Listmonk 관리자 패널에 로그인하세요.
   * **Settings -> SMTP**로 이동합니다.

   * Listmonk은 Forward Email을 기본 지원합니다. 공급자 목록에서 **ForwardEmail**을 선택하거나 다음 정보를 수동으로 입력하세요:

     | 설정               | 값                                                                                                                 |
     | :---------------- | :------------------------------------------------------------------------------------------------------------------ |
     | **Host**          | `smtp.forwardemail.net`                                                                                             |
     | **Port**          | `465`                                                                                                               |
     | **Auth protocol** | `LOGIN`                                                                                                             |
     | **Username**      | Forward Email **SMTP 사용자 이름**                                                                                   |
     | **Password**      | Forward Email **SMTP 비밀번호**                                                                                       |
     | **TLS**           | `SSL/TLS`                                                                                                           |
     | **From e-mail**   | 원하는 `From` 주소(예: `newsletter@yourdomain.com`). 이 도메인이 Forward Email에 구성되어 있어야 합니다.              |
* **중요**: Forward Email과의 보안 연결을 위해 항상 `SSL/TLS`를 사용하는 포트 `465`를 사용하세요(권장). 포트 `587`과 STARTTLS도 지원되지만 SSL/TLS가 더 권장됩니다.

   * **저장**을 클릭하세요.
3. **테스트 이메일 보내기**: SMTP 설정 페이지 내의 "테스트 이메일 보내기" 버튼을 사용하세요. 접근 가능한 수신자 주소를 입력하고 **보내기**를 클릭하세요. 이메일이 수신자의 받은편지함에 도착했는지 확인하세요.

### 8. 반송 처리 구성 {#8-configure-bounce-processing}

반송 처리는 Listmonk가 배달되지 않은 이메일(예: 잘못된 주소 등)을 자동으로 처리할 수 있게 합니다. Forward Email은 반송에 대해 Listmonk에 알릴 수 있는 웹훅을 제공합니다.

#### Forward Email 설정 {#forward-email-setup}

1. [Forward Email 대시보드](https://forwardemail.net/)에 로그인하세요.
2. **도메인**으로 이동하여 발송에 사용하는 도메인을 선택한 후 **설정** 페이지로 이동하세요.
3. 아래로 스크롤하여 **Bounce Webhook URL** 섹션을 찾으세요.
4. 다음 URL을 입력하되 `<your_listmonk_domain>`을 Listmonk 인스턴스가 접근 가능한 실제 도메인 또는 서브도메인으로 교체하세요:
   ```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
   *예시*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. 더 아래로 스크롤하여 **Webhook Signature Payload Verification Key** 섹션을 찾으세요.
6. 생성된 검증 키를 **복사**하세요. Listmonk에서 필요합니다.
7. Forward Email 도메인 설정에서 변경사항을 저장하세요.

#### Listmonk 설정 {#listmonk-setup}

1. Listmonk 관리자 패널에서 **설정 -> 반송**으로 이동하세요.
2. **반송 처리 활성화**를 켜세요.
3. **반송 웹훅 활성화**를 켜세요.
4. 아래로 스크롤하여 **웹훅 제공자** 섹션을 찾으세요.
5. **Forward Email**을 활성화하세요.
6. Forward Email 대시보드에서 복사한 **Webhook Signature Payload Verification Key**를 **Forward Email 키** 필드에 붙여넣으세요.
7. 페이지 하단의 **저장**을 클릭하세요.
8. 이제 반송 처리가 구성되었습니다! Forward Email이 Listmonk에서 보낸 이메일의 반송을 감지하면 웹훅을 통해 Listmonk 인스턴스에 알리고, Listmonk가 구독자를 적절히 표시합니다.
9. 모든 것이 정상 작동하는지 확인하려면 아래 [테스트](#testing) 단계를 완료하세요.


## 테스트 {#testing}

다음은 Listmonk 핵심 기능의 간단한 개요입니다:

### 메일링 리스트 생성 {#create-a-mailing-list}

* 사이드바에서 **리스트**로 이동하세요.
* **새 리스트**를 클릭하세요.
* 세부 정보를 입력하세요(이름, 유형: 공개/비공개, 설명, 태그) 그리고 **저장**하세요.

### 구독자 추가 {#add-subscribers}

* **구독자** 섹션으로 이동하세요.
* 구독자를 추가할 수 있습니다:
  * **수동으로**: **새 구독자**를 클릭하세요.
  * **가져오기**: **구독자 가져오기**를 클릭하여 CSV 파일을 업로드하세요.
  * **API**: Listmonk API를 사용하여 프로그래밍 방식으로 추가하세요.
* 생성 또는 가져오기 시 구독자를 하나 이상의 리스트에 할당하세요.
* **권장 방법**: 이중 옵트인 프로세스를 사용하세요. **설정 -> 옵트인 및 구독**에서 구성할 수 있습니다.

### 캠페인 생성 및 발송 {#create-and-send-a-campaign}

* **캠페인** -> **새 캠페인**으로 이동하세요.
* 캠페인 세부 정보(이름, 제목, 발신 이메일, 발송할 리스트)를 입력하세요.
* 콘텐츠 유형을 선택하세요(리치 텍스트/HTML, 일반 텍스트, 원시 HTML).
* 이메일 내용을 작성하세요. `{{ .Subscriber.Email }}` 또는 `{{ .Subscriber.FirstName }}` 같은 템플릿 변수를 사용할 수 있습니다.
* **항상 먼저 테스트 이메일을 보내세요!** "테스트 보내기" 옵션을 사용해 받은편지함에서 이메일을 미리보기 하세요.
* 만족하면 **캠페인 시작**을 클릭해 즉시 보내거나 예약하세요.


## 검증 {#verification}

* **SMTP 전달**: Listmonk SMTP 설정 페이지와 테스트 캠페인을 통해 정기적으로 테스트 이메일을 보내 이메일이 제대로 전달되는지 확인하세요.
* **반송 처리**: 알려진 잘못된 이메일 주소(예: 실제 주소가 없으면 `bounce-test@yourdomain.com`)로 테스트 캠페인을 보내세요(결과는 다를 수 있음). 잠시 후 Listmonk에서 캠페인 통계를 확인해 반송이 기록되었는지 확인하세요.
* **이메일 헤더**: [Mail-Tester](https://www.mail-tester.com/) 같은 도구를 사용하거나 이메일 헤더를 수동으로 검사해 SPF, DKIM, DMARC가 통과하는지 확인하세요. 이는 Forward Email을 통한 올바른 설정을 의미합니다.
* **Forward Email 로그**: SMTP 서버에서 발생하는 전달 문제 의심 시 Forward Email 대시보드 로그를 확인하세요.
## 개발자 노트 {#developer-notes}

* **템플릿**: Listmonk은 Go의 템플릿 엔진을 사용합니다. 고급 개인화 기능은 문서를 참고하세요: `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API**: Listmonk은 리스트, 구독자, 캠페인, 템플릿 등 관리를 위한 종합 REST API를 제공합니다. API 문서 링크는 Listmonk 인스턴스 하단에서 확인할 수 있습니다.
* **사용자 정의 필드**: 추가 데이터를 저장하려면 **설정 -> 구독자 필드**에서 사용자 정의 구독자 필드를 정의하세요.
* **웹훅**: 반송 외에도 Listmonk은 구독 등 다른 이벤트에 대해 웹훅을 전송할 수 있어 다른 시스템과의 통합이 가능합니다.


## 결론 {#conclusion}

셀프 호스팅된 Listmonk의 강력함과 Forward Email의 안전하고 개인정보를 존중하는 전송 기능을 결합하면 견고하고 윤리적인 이메일 마케팅 플랫폼을 만들 수 있습니다. 높은 전달률과 자동 보안 기능을 누리면서도 청중 데이터에 대한 완전한 소유권을 유지할 수 있습니다.

이 설정은 확장 가능하고 비용 효율적이며 개발자 친화적인 독점 이메일 서비스 대안을 제공하며, 오픈 소스 소프트웨어와 사용자 개인정보 보호라는 정신에 완벽히 부합합니다.

행복한 발송 되세요! 🚀
