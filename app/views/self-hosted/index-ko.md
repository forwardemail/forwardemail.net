# 셀프 호스팅 {#self-hosted}


## 목차 {#table-of-contents}

* [시작하기](#getting-started)
* [요구사항](#requirements)
  * [Cloud-init / User-data](#cloud-init--user-data)
* [설치](#install)
  * [설치 스크립트 디버깅](#debug-install-script)
  * [프롬프트](#prompts)
  * [초기 설정 (옵션 1)](#initial-setup-option-1)
* [서비스](#services)
  * [중요한 파일 경로](#important-file-paths)
* [구성](#configuration)
  * [초기 DNS 설정](#initial-dns-setup)
* [온보딩](#onboarding)
* [테스트](#testing)
  * [첫 번째 별칭 만들기](#creating-your-first-alias)
  * [첫 이메일 보내기 / 받기](#sending--receiving-your-first-email)
* [문제 해결](#troubleshooting)
  * [기본 인증 사용자 이름과 비밀번호는 무엇인가요](#what-is-the-basic-auth-username-and-password)
  * [무엇이 실행 중인지 어떻게 알 수 있나요](#how-do-i-know-what-is-running)
  * [실행되어야 하는데 실행되지 않는 것이 있는지 어떻게 알 수 있나요](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [로그는 어떻게 찾나요](#how-do-i-find-logs)
  * [발신 이메일이 타임아웃되는 이유는 무엇인가요](#why-are-my-outgoing-emails-timing-out)


## 시작하기 {#getting-started}

우리의 셀프 호스팅 이메일 솔루션은 모든 제품과 마찬가지로 프론트엔드와 백엔드 모두 100% 오픈 소스입니다. 이는 다음을 의미합니다:

1. **완전한 투명성**: 이메일을 처리하는 모든 코드 라인이 공개되어 있습니다.
2. **커뮤니티 기여**: 누구나 개선하거나 문제를 수정할 수 있습니다.
3. **개방성을 통한 보안**: 전 세계 커뮤니티가 취약점을 식별하고 수정할 수 있습니다.
4. **공급업체 종속 없음**: 우리 회사의 존재에 의존하지 않습니다.

전체 코드베이스는 MIT 라이선스 하에 GitHub <https://github.com/forwardemail/forwardemail.net>에서 확인할 수 있습니다.

아키텍처는 다음 컨테이너를 포함합니다:

* 발신 이메일용 SMTP 서버
* 이메일 수신용 IMAP/POP3 서버
* 관리용 웹 인터페이스
* 구성 저장용 데이터베이스
* 캐싱 및 성능 향상을 위한 Redis
* 안전하고 암호화된 메일박스 저장용 SQLite

> \[!NOTE]
> 우리의 [셀프 호스팅 블로그](https://forwardemail.net/blog/docs/self-hosted-solution)를 꼭 확인하세요
>
> 그리고 더 세분화된 단계별 버전을 원하시면 [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) 또는 [Debian](https://forwardemail.net/guides/selfhosted-on-debian) 기반 가이드를 참고하세요.


## 요구사항 {#requirements}

설치 스크립트를 실행하기 전에 다음 사항을 확인하세요:

* **운영 체제**: Linux 기반 서버 (현재 Ubuntu 22.04+ 지원).
* **자원**: 1 vCPU 및 2GB RAM
* **루트 권한**: 명령어 실행을 위한 관리자 권한.
* **도메인 이름**: DNS 구성을 위한 커스텀 도메인.
* **깨끗한 IP**: 블랙리스트를 확인하여 스팸 이력이 없는 깨끗한 IP 주소인지 확인하세요. 자세한 내용은 [여기](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation)에서 확인하세요.
* 포트 25를 지원하는 공인 IP 주소
* [역방향 PTR 설정](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/) 가능
* IPv4 및 IPv6 지원

> \[!TIP]
> [멋진 메일 서버 제공업체 목록](https://github.com/forwardemail/awesome-mail-server-providers)을 참고하세요

### Cloud-init / User-data {#cloud-init--user-data}

대부분의 클라우드 공급자는 가상 사설 서버(VPS) 프로비저닝 시 cloud-init 구성을 지원합니다. 이는 스크립트 초기 설정 로직에서 추가 정보를 묻는 프롬프트를 건너뛰고 미리 파일과 환경 변수를 설정하는 좋은 방법입니다.

**옵션**

* `EMAIL` - certbot 만료 알림에 사용되는 이메일
* `DOMAIN` - 셀프 호스팅 설정에 사용되는 커스텀 도메인 (예: `example.com`)
* `AUTH_BASIC_USERNAME` - 사이트 보호를 위한 초기 설정 시 사용되는 사용자 이름
* `AUTH_BASIC_PASSWORD` - 사이트 보호를 위한 초기 설정 시 사용되는 비밀번호
* `/root/.cloudflare.ini` - (**Cloudflare 사용자 전용**) certbot이 DNS 구성을 위해 사용하는 cloudflare 구성 파일입니다. `dns_cloudflare_api_token`을 통해 API 토큰을 설정해야 합니다. 자세한 내용은 [여기](https://certbot-dns-cloudflare.readthedocs.io/en/stable/)를 참고하세요.
Example:

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

## 설치 {#install}

서버에서 다음 명령어를 실행하여 설치 스크립트를 다운로드하고 실행하세요:

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### 설치 스크립트 디버그 {#debug-install-script}

자세한 출력을 위해 설치 스크립트 앞에 `DEBUG=true`를 추가하세요:

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### 프롬프트 {#prompts}

```sh
1. 초기 설정
2. 백업 설정
3. 자동 업그레이드 설정
4. 인증서 갱신
5. 백업에서 복원
6. 도움말
7. 종료
```

* **초기 설정**: 최신 forward email 코드를 다운로드하고, 환경을 구성하며, 사용자 지정 도메인을 입력받고 필요한 모든 인증서, 키 및 비밀 정보를 설정합니다.
* **백업 설정**: mongoDB와 redis를 S3 호환 스토어를 사용하여 안전한 원격 저장소에 백업하는 크론 작업을 설정합니다. 별도로, sqlite는 변경 사항이 있을 경우 로그인 시 안전하고 암호화된 백업을 위해 백업됩니다.
* **업그레이드 설정**: 야간 업데이트를 확인하는 크론 작업을 설정하여 인프라 구성 요소를 안전하게 재빌드하고 재시작합니다.
* **인증서 갱신**: SSL 인증서와 키는 Certbot / lets encrypt를 사용하며 3개월마다 만료됩니다. 이 옵션은 도메인 인증서를 갱신하고 관련 구성 요소가 사용할 수 있도록 필요한 폴더에 배치합니다. 자세한 내용은 [중요한 파일 경로](#important-file-paths)를 참조하세요.
* **백업에서 복원**: mongodb와 redis가 백업 데이터에서 복원되도록 트리거합니다.

### 초기 설정 (옵션 1) {#initial-setup-option-1}

`1. 초기 설정` 옵션을 선택하여 시작하세요.

완료되면 성공 메시지가 표시됩니다. `docker ps` 명령어를 실행하여 실행 중인 구성 요소를 확인할 수도 있습니다. 구성 요소에 대한 자세한 내용은 아래를 참조하세요.


## 서비스 {#services}

| 서비스 이름 |         기본 포트         | 설명                                                   |
| ------------ | :-----------------------: | ------------------------------------------------------ |
| Web          |            `443`          | 모든 관리자 상호작용을 위한 웹 인터페이스              |
| API          |            `4000`         | 데이터베이스를 추상화하는 API 계층                      |
| Bree         |            없음           | 백그라운드 작업 및 태스크 실행기                        |
| SMTP         | `465` (권장) / `587`      | 아웃바운드 이메일용 SMTP 서버                           |
| SMTP Bree    |            없음           | SMTP 백그라운드 작업                                    |
| MX           |            `2525`         | 인바운드 이메일 및 이메일 전달용 메일 교환기            |
| IMAP         |          `993/2993`       | 인바운드 이메일 및 메일박스 관리를 위한 IMAP 서버       |
| POP3         |          `995/2995`       | 인바운드 이메일 및 메일박스 관리를 위한 POP3 서버       |
| SQLite       |            `3456`         | sqlite 데이터베이스와 상호작용을 위한 SQLite 서버       |
| SQLite Bree  |            없음           | SQLite 백그라운드 작업                                  |
| CalDAV       |            `5000`         | 캘린더 관리를 위한 CalDAV 서버                          |
| CardDAV      |            `6000`         | 캘린더 관리를 위한 CardDAV 서버                         |
| MongoDB      |           `27017`         | 대부분 데이터 관리를 위한 MongoDB 데이터베이스          |
| Redis        |            `6379`         | 캐싱 및 상태 관리를 위한 Redis                           |
| SQLite       |            없음           | 암호화된 메일박스를 위한 SQLite 데이터베이스             |

### 중요한 파일 경로 {#important-file-paths}

참고: 아래 *호스트 경로*는 `/root/forwardemail.net/self-hosting/`를 기준으로 한 상대 경로입니다.

| 구성 요소              |       호스트 경로       | 컨테이너 경로                 |
| ---------------------- | :---------------------: | ---------------------------- |
| MongoDB                |   `./mongo-backups`     | `/backups`                   |
| Redis                  |     `./redis-data`      | `/data`                      |
| Sqlite                 |    `./sqlite-data`      | `/mnt/{SQLITE_STORAGE_PATH}` |
| 환경 파일              |        `./.env`         | `/app/.env`                  |
| SSL 인증서/키          |        `./ssl`          | `/app/ssl/`                  |
| 개인 키                |  `./ssl/privkey.pem`    | `/app/ssl/privkey.pem`       |
| 전체 체인 인증서       | `./ssl/fullchain.pem`   | `/app/ssl/fullchain.pem`     |
| CA 인증서              |    `./ssl/cert.pem`     | `/app/ssl/cert.pem`          |
| DKIM 개인 키           |    `./ssl/dkim.key`     | `/app/ssl/dkim.key`          |
> \[!IMPORTANT]
> `.env` 파일을 안전하게 저장하세요. 장애 발생 시 복구에 매우 중요합니다.
> 이 파일은 `/root/forwardemail.net/self-hosting/.env`에서 찾을 수 있습니다.


## 구성 {#configuration}

### 초기 DNS 설정 {#initial-dns-setup}

선호하는 DNS 제공업체에서 적절한 DNS 레코드를 구성하세요. 괄호(`< >`) 안의 내용은 동적이며 본인의 값으로 업데이트해야 합니다.

| 유형  | 이름               | 내용                          | TTL  |
| ----- | ------------------ | ----------------------------- | ---- |
| A     | "@", ".", 또는 빈칸 | <ip_address>                  | auto |
| CNAME | api                | <domain_name>                 | auto |
| CNAME | caldav             | <domain_name>                 | auto |
| CNAME | carddav            | <domain_name>                 | auto |
| CNAME | fe-bounces         | <domain_name>                 | auto |
| CNAME | imap               | <domain_name>                 | auto |
| CNAME | mx                 | <domain_name>                 | auto |
| CNAME | pop3               | <domain_name>                 | auto |
| CNAME | smtp               | <domain_name>                 | auto |
| MX    | "@", ".", 또는 빈칸 | mx.<domain_name> (우선순위 0) | auto |
| TXT   | "@", ".", 또는 빈칸 | "v=spf1 a -all"               | auto |

#### 역방향 DNS / PTR 레코드 {#reverse-dns--ptr-record}

역방향 DNS(rDNS) 또는 역방향 포인터 레코드(PTR 레코드)는 이메일 서버에서 매우 중요합니다. 이는 이메일을 보내는 서버의 신뢰성을 검증하는 데 도움을 주기 때문입니다. 각 클라우드 제공업체마다 방법이 다르므로, 호스트와 IP를 해당 호스트명에 매핑하는 "역방향 DNS" 추가 방법을 확인해야 합니다. 대부분 제공업체의 네트워킹 섹션에서 설정할 수 있습니다.

#### 포트 25 차단됨 {#port-25-blocked}

일부 ISP 및 클라우드 제공업체는 악용 방지를 위해 포트 25를 차단합니다. SMTP/발신 이메일용 포트 25를 열기 위해 지원 티켓을 제출해야 할 수도 있습니다.


## 온보딩 {#onboarding}

1. 랜딩 페이지 열기  
   DNS 설정에 구성한 도메인으로 https\://\<domain_name>에 접속하세요. Forward Email 랜딩 페이지가 표시됩니다.

2. 로그인 및 도메인 온보딩

* 유효한 이메일과 비밀번호로 로그인하세요.
* 설정하려는 도메인 이름을 입력하세요(이 도메인은 DNS 구성과 일치해야 합니다).
* 확인을 위해 필요한 **MX** 및 **TXT** 레코드를 추가하라는 안내를 따르세요.

3. 설정 완료

* 확인이 완료되면 별칭 페이지에 접속하여 첫 번째 별칭을 만드세요.
* 선택적으로 **도메인 설정**에서 **발신 이메일용 SMTP**를 구성할 수 있습니다. 추가 DNS 레코드가 필요합니다.

> \[!NOTE]
> 정보는 서버 외부로 전송되지 않습니다. 자체 호스팅 옵션과 초기 계정은 관리자 로그인 및 도메인, 별칭, 관련 이메일 구성을 관리하기 위한 웹 뷰용입니다.


## 테스트 {#testing}

### 첫 번째 별칭 만들기 {#creating-your-first-alias}

1. 별칭 페이지로 이동  
   별칭 관리 페이지를 엽니다:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. 새 별칭 추가

* 오른쪽 상단의 **별칭 추가**를 클릭하세요.
* 별칭 이름을 입력하고 필요에 따라 이메일 설정을 조정하세요.
* (선택 사항) 체크박스를 선택하여 **IMAP/POP3/CalDAV/CardDAV** 지원을 활성화하세요.
* **별칭 생성**을 클릭하세요.

3. 비밀번호 설정

* **비밀번호 생성**을 클릭하여 안전한 비밀번호를 만드세요.
* 이 비밀번호는 이메일 클라이언트 로그인 시 필요합니다.

4. 이메일 클라이언트 구성

* Thunderbird 같은 이메일 클라이언트를 사용하세요.
* 별칭 이름과 생성한 비밀번호를 입력하세요.
* **IMAP** 및 **SMTP** 설정을 적절히 구성하세요.

#### 이메일 서버 설정 {#email-server-settings}

사용자 이름: `<alias name>`

| 유형 | 호스트명            | 포트 | 연결 보안           | 인증 방식       |
| ---- | ------------------ | ---- | ------------------- | --------------- |
| SMTP | smtp.<domain_name> | 465  | SSL / TLS           | 일반 비밀번호   |
| IMAP | imap.<domain_name> | 993  | SSL / TLS           | 일반 비밀번호   |

### 첫 이메일 보내기 / 받기 {#sending--receiving-your-first-email}

구성이 완료되면 새로 생성한 자체 호스팅 이메일 주소로 이메일을 보내고 받을 수 있습니다!
## 문제 해결 {#troubleshooting}

#### 왜 이것이 우분투와 데비안 외부에서 작동하지 않나요 {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

현재 MacOS 지원을 검토 중이며 다른 플랫폼도 고려할 예정입니다. 다른 플랫폼 지원을 원하시면 [discussion](https://github.com/orgs/forwardemail/discussions)을 열거나 기여해 주세요.

#### 왜 certbot acme 챌린지가 실패하나요 {#why-is-the-certbot-acme-challenge-failing}

가장 흔한 실수는 certbot / letsencrypt가 때때로 **2개의** 챌린지를 요청한다는 점입니다. 반드시 **두 개의** txt 레코드를 모두 추가해야 합니다.

예시:
다음과 같이 두 개의 챌린지를 볼 수 있습니다:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

또한 DNS 전파가 완료되지 않았을 수도 있습니다. `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>` 같은 도구를 사용해 보세요. 이 도구는 TXT 레코드 변경 사항이 반영되었는지 확인하는 데 도움이 됩니다. 호스트의 로컬 DNS 캐시가 오래된 값이나 최근 변경 사항을 아직 반영하지 않았을 가능성도 있습니다.

또 다른 방법은 자동 cerbot DNS 변경을 사용하는 것입니다. 초기 VPS 설정 시 cloud-init / user-data에 API 토큰이 포함된 `/root/.cloudflare.ini` 파일을 설정하거나 이 파일을 생성한 후 스크립트를 다시 실행하세요. 이렇게 하면 DNS 변경과 챌린지 업데이트가 자동으로 관리됩니다.

### 기본 인증 사용자 이름과 비밀번호는 무엇인가요 {#what-is-the-basic-auth-username-and-password}

셀프 호스팅의 경우, 처음 브라우저에서 네이티브 인증 팝업이 나타나며 간단한 사용자 이름(`admin`)과 비밀번호(초기 설정 시 무작위 생성)를 입력해야 합니다. 이는 자동화 도구나 스크래퍼가 웹 경험에서 먼저 가입하는 것을 방지하기 위한 보호 장치입니다. 초기 설정 후 `.env` 파일의 `AUTH_BASIC_USERNAME` 및 `AUTH_BASIC_PASSWORD`에서 이 비밀번호를 확인할 수 있습니다.

### 어떤 것이 실행 중인지 어떻게 알 수 있나요 {#how-do-i-know-what-is-running}

`docker ps` 명령어를 실행하면 `docker-compose-self-hosting.yml` 파일에서 실행 중인 모든 컨테이너를 볼 수 있습니다. `docker ps -a`를 실행하면 실행 중이지 않은 컨테이너를 포함한 모든 컨테이너를 확인할 수 있습니다.

### 실행되어야 하는 것이 실행되지 않는지 어떻게 알 수 있나요 {#how-do-i-know-if-something-isnt-running-that-should-be}

`docker ps -a` 명령어를 실행하면 실행 중이지 않은 컨테이너를 포함한 모든 컨테이너를 볼 수 있습니다. 종료 로그나 메모를 확인할 수 있습니다.

### 로그는 어떻게 찾나요 {#how-do-i-find-logs}

`docker logs -f <container_name>` 명령어로 더 많은 로그를 확인할 수 있습니다. 만약 어떤 컨테이너가 종료되었다면 `.env` 파일 설정이 잘못되었을 가능성이 큽니다.

웹 UI 내에서는 `/admin/emails`와 `/admin/logs`에서 각각 발신 이메일 로그와 오류 로그를 볼 수 있습니다.

### 왜 내 발신 이메일이 시간 초과되나요 {#why-are-my-outgoing-emails-timing-out}

"Connection timed out when connecting to MX server..." 같은 메시지가 보인다면 포트 25가 차단되었는지 확인해야 합니다. ISP나 클라우드 제공자가 기본적으로 이 포트를 차단하는 경우가 많으므로, 지원팀에 문의하거나 티켓을 제출해 포트를 열어야 할 수 있습니다.

#### 이메일 구성 모범 사례 및 IP 평판 테스트에 어떤 도구를 사용해야 하나요 {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

우리의 [FAQ here](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)를 참고하세요.
