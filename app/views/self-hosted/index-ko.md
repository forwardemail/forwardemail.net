# 자체 호스팅 {#self-hosted}

## 목차 {#table-of-contents}

* [시작하기](#getting-started)
* [요구 사항](#requirements)
  * [클라우드 초기화/사용자 데이터](#cloud-init--user-data)
* [설치하다](#install)
  * [디버그 설치 스크립트](#debug-install-script)
  * [프롬프트](#prompts)
  * [초기 설정(옵션 1)](#initial-setup-option-1)
* [서비스](#services)
  * [중요한 파일 경로](#important-file-paths)
* [구성](#configuration)
  * [초기 DNS 설정](#initial-dns-setup)
* [온보딩](#onboarding)
* [테스트](#testing)
  * [첫 번째 별칭 만들기](#creating-your-first-alias)
  * [첫 번째 이메일 보내기/받기](#sending--receiving-your-first-email)
* [문제 해결](#troubleshooting)
  * [기본 인증 사용자 이름과 비밀번호는 무엇입니까?](#what-is-the-basic-auth-username-and-password)
  * [무엇이 실행 중인지 어떻게 알 수 있나요?](#how-do-i-know-what-is-running)
  * [실행 중이 아닌 것이 있는지 어떻게 알 수 있나요?](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [로그를 어떻게 찾을 수 있나요?](#how-do-i-find-logs)
  * [발신 이메일 시간이 초과되는 이유는 무엇입니까?](#why-are-my-outgoing-emails-timing-out)

## 시작하기 {#getting-started}

당사의 자체 호스팅 이메일 솔루션은 다른 모든 제품과 마찬가지로 프런트엔드와 백엔드 모두 100% 오픈 소스입니다. 즉, 다음과 같은 이점이 있습니다.

1. **완전한 투명성**: 이메일을 처리하는 모든 코드 라인이 공개 검토 대상입니다.
2. **커뮤니티 기여**: 누구나 개선 사항을 기여하거나 문제를 해결할 수 있습니다.
3. **개방성을 통한 보안**: 글로벌 커뮤니티를 통해 취약점을 파악하고 수정할 수 있습니다.
4. **벤더 종속 없음**: 귀하는 당사에 의존할 필요가 없습니다.

전체 코드베이스는 MIT 라이선스에 따라 GitHub의 <https://github.com/forwardemail/forwardemail.net>,>에서 확인할 수 있습니다.

아키텍처에는 다음을 위한 컨테이너가 포함됩니다.

* 아웃바운드 이메일용 SMTP 서버
* 이메일 검색용 IMAP/POP3 서버
* 관리용 웹 인터페이스
* 구성 저장용 데이터베이스
* 캐싱 및 성능 향상을 위한 Redis
* 안전하고 암호화된 사서함 저장을 위한 SQLite

> \[!NOTE]
> [셀프 호스팅 블로그](https://forwardemail.net/blog/docs/self-hosted-solution)도 꼭 확인해 보세요.
>
> 더 자세한 단계별 설명이 필요하신 분은 [우분투](https://forwardemail.net/guides/selfhosted-on-ubuntu) 또는 [데비안](https://forwardemail.net/guides/selfhosted-on-debian) 기반 가이드를 참조하세요.

## 요구 사항 {#requirements}

설치 스크립트를 실행하기 전에 다음 사항이 있는지 확인하세요.

* **운영 체제**: Linux 기반 서버(현재 Ubuntu 22.04 이상 지원).
* **리소스**: vCPU 1개 및 RAM 2GB
* **루트 액세스**: 명령을 실행할 수 있는 관리자 권한.
* **도메인 이름**: DNS 구성을 위한 사용자 지정 도메인.
* **클린 IP**: 블랙리스트를 확인하여 서버에 스팸 평판이 없는 깨끗한 IP 주소가 있는지 확인하십시오. 자세한 내용은 [여기](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation)을 참조하십시오.
* 포트 25를 지원하는 공용 IP 주소
* [역방향 PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/) 설정 기능
* IPv4 및 IPv6 지원

> \[!TIP]
> [훌륭한 메일 서버 제공업체](https://github.com/forwardemail/awesome-mail-server-providers) 목록을 확인하세요

### 클라우드 초기화/사용자 데이터 {#cloud-init--user-data}

대부분의 클라우드 공급업체는 가상 사설 서버(VPS) 프로비저닝 시 cloud-init 구성을 지원합니다. 이는 스크립트 초기 설정 로직에 사용할 파일과 환경 변수를 미리 설정하는 좋은 방법이며, 스크립트 실행 중 추가 정보를 묻는 메시지를 표시할 필요가 없습니다.

**옵션**

* `EMAIL` - Certbot 만료 알림에 사용되는 이메일
* `DOMAIN` - 셀프 호스팅 설정에 사용되는 사용자 지정 도메인(예: `example.com`)
* `AUTH_BASIC_USERNAME` - 사이트 보호를 위해 최초 설정 시 사용되는 사용자 이름
* `AUTH_BASIC_PASSWORD` - 사이트 보호를 위해 최초 설정 시 사용되는 비밀번호
* `/root/.cloudflare.ini` - (**Cloudflare 사용자 전용**) Certbot이 DNS 설정을 위해 사용하는 Cloudflare 구성 파일입니다. `dns_cloudflare_api_token`을 통해 API 토큰을 설정해야 합니다. 자세한 내용은 [여기](https://certbot-dns-cloudflare.readthedocs.io/en/stable/)을 참조하세요.

예:

```sh
#cloud-config
write_files:
  - path: /root/.cloudflare.ini
    content: |
      dns_cloudflare_api_token = "xxx"
    owner: root:root
    permissions: '0600'
  - path: /etc/profile.d/env.sh
    content: |
      export EMAIL="test@myemail.com"
      export DOMAIN="mydomain.com"

runcmd:
  - chmod +x /etc/profile.d/env.sh
```

## {#install}} 설치

서버에서 다음 명령을 실행하여 설치 스크립트를 다운로드하고 실행하세요.

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### 디버그 설치 스크립트 {#debug-install-script}

자세한 출력을 위해 설치 스크립트 앞에 `DEBUG=true`을 추가하세요.

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### 프롬프트 {#prompts}

```sh
1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

* **초기 설정**: 최신 전달 이메일 코드를 다운로드하고, 환경을 구성하고, 사용자 지정 도메인을 선택하고, 필요한 모든 인증서, 키 및 비밀번호를 설정합니다.
* **백업 설정**: S3 호환 저장소를 사용하여 MongoDB 및 Redis를 백업하는 Cron을 설정하여 안전한 원격 저장소로 사용합니다. SQLite는 로그인 시 변경 사항이 있는 경우 안전하고 암호화된 백업으로 별도로 백업됩니다.
* **업그레이드 설정**: 인프라 구성 요소를 안전하게 재구축하고 다시 시작할 수 있도록 야간 업데이트를 확인하는 Cron을 설정합니다.
* **인증서 갱신**: Certbot / lets encrypt를 사용하여 SSL 인증서와 키를 3개월마다 만료합니다. 이 명령을 실행하면 도메인의 인증서가 갱신되고 관련 구성 요소가 사용할 수 있도록 필요한 폴더에 저장됩니다. [중요한 파일 경로](#important-file-paths)을 참조하세요.
* **백업에서 복원**: MongoDB 및 Redis가 백업 데이터에서 복원되도록 합니다.

### 초기 설정(옵션 1) {#initial-setup-option-1}

시작하려면 `1. Initial setup` 옵션을 선택하세요.

완료되면 성공 메시지가 표시됩니다. `docker ps`을 실행하여 **해당** 구성 요소가 실행되는 것을 확인할 수도 있습니다. 구성 요소에 대한 자세한 내용은 아래를 참조하세요.

## 서비스 {#services}

| 서비스 이름 | 기본 포트 | 설명 |
| ------------ | :----------: | ------------------------------------------------------ |
| 편물 | `443` | 모든 관리자 상호 작용을 위한 웹 인터페이스 |
| API | `4000` | 추상화된 데이터베이스를 위한 API 계층 |
| 브리 | 없음 | 백그라운드 작업 및 작업 실행자 |
| SMTP | `465/587` | 발신 이메일용 SMTP 서버 |
| SMTP 브리 | 없음 | SMTP 백그라운드 작업 |
| MX | `2525` | 수신 이메일 및 이메일 전달을 위한 메일 교환 |
| IMAP | `993/2993` | 수신 이메일 및 사서함 관리를 위한 IMAP 서버 |
| POP3 | `995/2995` | 수신 이메일 및 사서함 관리를 위한 POP3 서버 |
| SQLite | `3456` | SQLite 데이터베이스와의 상호 작용을 위한 SQLite 서버 |
| SQLite 브리 | 없음 | SQLite 백그라운드 작업 |
| 칼다브 | `5000` | 캘린더 관리를 위한 CalDAV 서버 |
| 카드다브 | `6000` | 캘린더 관리를 위한 CardDAV 서버 |
| 몽고디비 | `27017` | 대부분의 데이터 관리를 위한 MongoDB 데이터베이스 |
| 레디스 | `6379` | 캐싱 및 상태 관리를 위한 Redis |
| SQLite | 없음 | 암호화된 사서함을 위한 SQLite 데이터베이스 |

### 중요 파일 경로 {#important-file-paths}

참고: 아래의 *호스트 경로*는 `/root/forwardemail.net/self-hosting/`을 기준으로 합니다.

| 요소 | 호스트 경로 | 컨테이너 경로 |
| ---------------------- | :-------------------: | ---------------------------- |
| 몽고디비 | `./mongo-backups` | `/backups` |
| 레디스 | `./redis-data` | `/data` |
| SQLite | `./sqlite-data` | `/mnt/{SQLITE_STORAGE_PATH}` |
| Env 파일 | `./.env` | `/app/.env` |
| SSL 인증서/키 | `./ssl` | `/app/ssl/` |
| 개인 키 | `./ssl/privkey.pem` | `/app/ssl/privkey.pem` |
| 풀 체인 인증서 | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem` |
| 인증된 CA | `./ssl/cert.pem` | `/app/ssl/cert.pem` |
| DKIM 개인 키 | `./ssl/dkim.key` | `/app/ssl/dkim.key` |

> \[!IMPORTANT]
> `.env` 파일을 안전하게 저장하세요. 오류 발생 시 복구에 필수적입니다.
> `/root/forwardemail.net/self-hosting/.env`에서 이 파일을 찾을 수 있습니다.

## 구성 {#configuration}

### 초기 DNS 설정 {#initial-dns-setup}

선택한 DNS 제공업체에서 적절한 DNS 레코드를 구성하세요. 괄호(`<>`) 안의 내용은 동적이므로 사용자가 설정한 값으로 업데이트해야 합니다.

| 유형 | 이름 | 콘텐츠 | TTL |
| ----- | ------------------ | ----------------------------- | ---- |
| A | "@", ".", 또는 공백 | <아이피 주소> | 자동차 |
| CNAME | API | <도메인_이름> | 자동차 |
| CNAME | 칼다브 | <도메인_이름> | 자동차 |
| CNAME | 카드다브 | <도메인_이름> | 자동차 |
| CNAME | fe-바운스 | <도메인_이름> | 자동차 |
| CNAME | 아이맵 | <도메인_이름> | 자동차 |
| CNAME | 엠엑스 | <도메인_이름> | 자동차 |
| CNAME | 팝3 | <도메인_이름> | 자동차 |
| CNAME | SMTP | <도메인_이름> | 자동차 |
| MX | "@", ".", 또는 공백 | mx.<도메인_이름> (우선순위 0) | 자동차 |
| TXT | "@", ".", 또는 공백 | "v=spf1 a -all" | 자동차 |

#### 역방향 DNS/PTR 레코드 {#reverse-dns--ptr-record}

역방향 DNS(rDNS) 또는 역방향 포인터 레코드(PTR 레코드)는 이메일을 보내는 서버의 적법성을 확인하는 데 도움이 되므로 이메일 서버에 필수적입니다. 클라우드 제공업체마다 이 과정이 다르므로, 호스트와 IP를 해당 호스트 이름에 매핑하는 "역방향 DNS"를 추가하는 방법을 찾아야 합니다. 아마도 제공업체의 네트워킹 섹션에서 찾을 수 있을 것입니다.

#### 포트 25 차단됨 {#port-25-blocked}

일부 ISP와 클라우드 제공업체는 악의적인 사용자를 방지하기 위해 25번 포트를 차단합니다. SMTP/발신 이메일용 25번 포트를 열려면 지원 티켓을 제출해야 할 수도 있습니다.

## 온보딩 {#onboarding}

1. 랜딩 페이지 열기
https\://\<domain_name>으로 이동합니다. \<domain_name>은 DNS 설정에 설정된 도메인으로 바꾸세요. 이메일 전달 랜딩 페이지가 나타납니다.

2. 도메인에 로그인하고 온보딩하세요

* 유효한 이메일과 비밀번호로 로그인하세요.
* 설정할 도메인 이름을 입력하세요(DNS 구성과 일치해야 합니다).
* 안내에 따라 확인을 위해 필요한 **MX** 및 **TXT** 레코드를 추가하세요.

3. 설정 완료

* 확인 후 별칭 페이지에 접속하여 첫 번째 별칭을 만드세요.
* 선택 사항으로, **도메인 설정**에서 **발신 이메일용 SMTP**를 구성하세요. 이 경우 추가 DNS 레코드가 필요합니다.

> \[!NOTE]
> 서버 외부로 정보가 전송되지 않습니다. 자체 호스팅 옵션과 초기 계정은 도메인, 별칭 및 관련 이메일 구성을 관리하기 위한 관리자 로그인 및 웹 보기 용도로만 사용됩니다.

## 테스트 중 {#testing}}

### 첫 번째 별칭을 만드는 중 {#creating-your-first-alias}

1. 별칭 페이지로 이동
별칭 관리 페이지를 엽니다.

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. 새 별칭 추가

* **별칭 추가**(오른쪽 상단)를 클릭합니다.
* 별칭 이름을 입력하고 필요에 따라 이메일 설정을 조정합니다.
* (선택 사항) 확인란을 선택하여 **IMAP/POP3/CalDAV/CardDAV** 지원을 활성화합니다.
* **별칭 만들기**를 클릭합니다.

3. 비밀번호 설정

* **비밀번호 생성**을 클릭하여 안전한 비밀번호를 생성하세요.
* 이 비밀번호는 이메일 클라이언트에 로그인하는 데 필요합니다.

4. 이메일 클라이언트 구성

* Thunderbird와 같은 이메일 클라이언트를 사용하세요.
* 별칭 이름과 생성된 비밀번호를 입력하세요.
* **IMAP** 및 **SMTP** 설정을 적절히 구성하세요.

#### 이메일 서버 설정 {#email-server-settings}

사용자 이름: `<alias name>`

| 유형 | 호스트 이름 | 포트 | 연결 보안 | 입증 |
| ---- | ------------------ | ---- | ------------------- | --------------- |
| SMTP | smtp.<도메인_이름> | 465 | SSL / TLS | 일반 비밀번호 |
| IMAP | imap.<도메인_이름> | 993 | SSL / TLS | 일반 비밀번호 |

### 첫 번째 이메일 보내기/받기 {#sending--receiving-your-first-email}

구성이 완료되면 새로 생성하고 직접 호스팅한 이메일 주소로 이메일을 보내고 받을 수 있습니다!

## 문제 해결 {#troubleshooting}

#### 왜 이 기능이 Ubuntu 및 Debian 외부에서는 작동하지 않습니까? {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

현재 MacOS를 지원하려고 하고 있으며, 다른 OS도 지원할 예정입니다. 다른 OS도 지원되기를 원하시면 [논의](https://github.com/orgs/forwardemail/discussions)을 열거나 기여해 주세요.

#### certbot acme 챌린지가 실패하는 이유는 무엇입니까? {#why-is-the-certbot-acme-challenge-failing}

가장 흔한 함정은 certbot/letsencrypt가 때때로 **2**개의 챌린지를 요청한다는 것입니다. **두 개**의 txt 레코드를 모두 추가해야 합니다.

예:
다음과 같은 두 가지 챌린지가 표시될 수 있습니다.
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

DNS 전파가 완료되지 않았을 수도 있습니다. `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`과 같은 도구를 사용해 보세요. 이를 통해 TXT 레코드 변경 사항이 반영되어야 하는지 확인할 수 있습니다. 또한 호스트의 로컬 DNS 캐시가 여전히 오래된 값을 사용하고 있거나 최근 변경 사항을 반영하지 못했을 수도 있습니다.

또 다른 방법은 초기 VPS 설정 시 cloud-init/user-data에 API 토큰을 포함한 `/root/.cloudflare.ini` 파일을 설정하여 자동화된 Cerbot DNS 변경을 사용하는 것입니다. 또는 이 파일을 생성하고 스크립트를 다시 실행하면 DNS 변경 사항과 챌린지 업데이트가 자동으로 관리됩니다.

### 기본 인증 사용자 이름과 비밀번호는 무엇입니까? {#what-is-the-basic-auth-username-and-password}

셀프 호스팅의 경우, 간단한 사용자 이름(`admin`)과 비밀번호(초기 설정 시 무작위로 생성됨)를 입력하는 최초 브라우저 기본 인증 팝업을 추가합니다. 이는 자동화/스크래퍼가 웹 환경에서 처음 가입하는 것을 방해하는 경우를 대비한 보호 조치입니다. 초기 설정 후 `.env` 파일의 `AUTH_BASIC_USERNAME`와 `AUTH_BASIC_PASSWORD`에서 이 비밀번호를 찾을 수 있습니다.

### {#how-do-i-know-what-is-running}}이 실행 중인지 어떻게 알 수 있나요?

`docker ps`을 실행하면 `docker-compose-self-hosting.yml` 파일에서 실행 중인 모든 컨테이너를 확인할 수 있습니다. `docker ps -a`를 실행하면 실행 중이 아닌 컨테이너를 포함한 모든 컨테이너를 확인할 수 있습니다.

### {#how-do-i-know-if-something-isnt-running-that-should-be}}이 실행되고 있지 않은지 어떻게 알 수 있나요?

`docker ps -a`을 실행하면 모든 내용(실행 중이 아닌 컨테이너 포함)을 볼 수 있습니다. 종료 로그나 메모가 표시될 수도 있습니다.

### 로그를 어떻게 찾을 수 있나요? {#how-do-i-find-logs}

`docker logs -f <container_name>`을 통해 더 많은 로그를 얻을 수 있습니다. 문제가 발생한 경우 `.env` 파일이 잘못 구성되었기 때문일 가능성이 높습니다.

웹 UI 내에서는 아웃바운드 이메일 로그의 `/admin/emails`과 오류 로그의 `/admin/logs`을 각각 볼 수 있습니다.

### 발신 이메일 시간이 초과되는 이유는 무엇입니까? {#why-are-my-outgoing-emails-timing-out}

MX 서버에 연결할 때 "연결 시간 초과"와 같은 메시지가 표시되면 25번 포트가 차단되었는지 확인해야 할 수 있습니다. ISP나 클라우드 제공업체에서 기본적으로 이 포트를 차단하는 경우가 많으므로, 지원팀에 문의하거나 티켓을 제출하여 포트를 열어달라고 요청해야 할 수 있습니다.

#### 이메일 구성 모범 사례와 IP 평판을 테스트하는 데 어떤 도구를 사용해야 합니까? {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

[FAQ 여기](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)을 살펴보세요.