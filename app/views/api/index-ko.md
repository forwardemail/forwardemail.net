# 이메일 API {#email-api}


## 목차 {#table-of-contents}

* [라이브러리](#libraries)
* [기본 URI](#base-uri)
* [인증](#authentication)
  * [API 토큰 인증 (대부분의 엔드포인트에 권장)](#api-token-authentication-recommended-for-most-endpoints)
  * [별칭 자격 증명 인증 (발신 이메일용)](#alias-credentials-authentication-for-outbound-email)
  * [별칭 전용 엔드포인트](#alias-only-endpoints)
* [오류](#errors)
* [현지화](#localization)
* [페이지네이션](#pagination)
* [로그](#logs)
  * [로그 조회](#retrieve-logs)
* [계정](#account)
  * [계정 생성](#create-account)
  * [계정 조회](#retrieve-account)
  * [계정 업데이트](#update-account)
* [별칭 연락처 (CardDAV)](#alias-contacts-carddav)
  * [연락처 목록](#list-contacts)
  * [연락처 생성](#create-contact)
  * [연락처 조회](#retrieve-contact)
  * [연락처 업데이트](#update-contact)
  * [연락처 삭제](#delete-contact)
* [별칭 캘린더 (CalDAV)](#alias-calendars-caldav)
  * [캘린더 목록](#list-calendars)
  * [캘린더 생성](#create-calendar)
  * [캘린더 조회](#retrieve-calendar)
  * [캘린더 업데이트](#update-calendar)
  * [캘린더 삭제](#delete-calendar)
* [별칭 메시지 (IMAP/POP3)](#alias-messages-imappop3)
  * [메시지 목록 및 검색](#list-and-search-for-messages)
  * [메시지 생성](#create-message)
  * [메시지 조회](#retrieve-message)
  * [메시지 업데이트](#update-message)
  * [메시지 삭제](#delete-message)
* [별칭 폴더 (IMAP/POP3)](#alias-folders-imappop3)
  * [폴더 목록](#list-folders)
  * [폴더 생성](#create-folder)
  * [폴더 조회](#retrieve-folder)
  * [폴더 업데이트](#update-folder)
  * [폴더 삭제](#delete-folder)
  * [폴더 복사](#copy-folder)
* [발신 이메일](#outbound-emails)
  * [발신 SMTP 이메일 한도 조회](#get-outbound-smtp-email-limit)
  * [발신 SMTP 이메일 목록](#list-outbound-smtp-emails)
  * [발신 SMTP 이메일 생성](#create-outbound-smtp-email)
  * [발신 SMTP 이메일 조회](#retrieve-outbound-smtp-email)
  * [발신 SMTP 이메일 삭제](#delete-outbound-smtp-email)
* [도메인](#domains)
  * [도메인 목록](#list-domains)
  * [도메인 생성](#create-domain)
  * [도메인 조회](#retrieve-domain)
  * [도메인 레코드 검증](#verify-domain-records)
  * [도메인 SMTP 레코드 검증](#verify-domain-smtp-records)
  * [도메인 전체 캐치올 비밀번호 목록](#list-domain-wide-catch-all-passwords)
  * [도메인 전체 캐치올 비밀번호 생성](#create-domain-wide-catch-all-password)
  * [도메인 전체 캐치올 비밀번호 제거](#remove-domain-wide-catch-all-password)
  * [도메인 업데이트](#update-domain)
  * [도메인 삭제](#delete-domain)
* [초대](#invites)
  * [도메인 초대 수락](#accept-domain-invite)
  * [도메인 초대 생성](#create-domain-invite)
  * [도메인 초대 제거](#remove-domain-invite)
* [멤버](#members)
  * [도메인 멤버 업데이트](#update-domain-member)
  * [도메인 멤버 제거](#remove-domain-member)
* [별칭](#aliases)
  * [별칭 비밀번호 생성](#generate-an-alias-password)
  * [도메인 별칭 목록](#list-domain-aliases)
  * [새 도메인 별칭 생성](#create-new-domain-alias)
  * [도메인 별칭 조회](#retrieve-domain-alias)
  * [도메인 별칭 업데이트](#update-domain-alias)
  * [도메인 별칭 삭제](#delete-domain-alias)
* [암호화](#encrypt)
  * [TXT 레코드 암호화](#encrypt-txt-record)


## 라이브러리 {#libraries}

현재 API 래퍼를 아직 출시하지 않았지만, 가까운 시일 내에 출시할 계획입니다. 특정 프로그래밍 언어의 API 래퍼가 출시되면 알림을 받고 싶으시면 <api@forwardemail.net>으로 이메일을 보내주세요. 그동안에는 애플리케이션에서 아래 권장 HTTP 요청 라이브러리를 사용하거나, 아래 예제처럼 [curl](https://stackoverflow.com/a/27442239/3586413)을 사용하실 수 있습니다.

| 언어       | 라이브러리                                                             |
| ---------- | ---------------------------------------------------------------------- |
| Ruby       | [Faraday](https://github.com/lostisland/faraday)                       |
| Python     | [requests](https://github.com/psf/requests)                            |
| Java       | [OkHttp](https://github.com/square/okhttp/)                            |
| PHP        | [guzzle](https://github.com/guzzle/guzzle)                             |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (우리가 유지관리자임) |
| Node.js    | [superagent](https://github.com/ladjs/superagent) (우리가 유지관리자임) |
| Go         | [net/http](https://golang.org/pkg/net/http/)                           |
| .NET       | [RestSharp](https://github.com/restsharp/RestSharp)                    |
## Base URI {#base-uri}

현재 HTTP 기본 URI 경로는: `BASE_URI`입니다.


## Authentication {#authentication}

모든 엔드포인트는 [기본 인증(Basic Authorization)](https://en.wikipedia.org/wiki/Basic_access_authentication)을 사용한 인증이 필요합니다. 두 가지 인증 방법을 지원합니다:

### API 토큰 인증 (대부분의 엔드포인트에 권장) {#api-token-authentication-recommended-for-most-endpoints}

[API 키](https://forwardemail.net/my-account/security)를 "username" 값으로 설정하고 비밀번호는 비워둡니다:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

API 토큰 뒤의 콜론(`:`)에 주의하세요 – 이는 기본 인증 형식에서 비밀번호가 비어 있음을 나타냅니다.

### 별칭 자격 증명 인증 (발신 이메일용) {#alias-credentials-authentication-for-outbound-email}

[발신 SMTP 이메일 생성](#create-outbound-smtp-email) 엔드포인트는 별칭 이메일 주소와 [생성된 별칭 비밀번호](/faq#do-you-support-receiving-email-with-imap)를 사용한 인증도 지원합니다:

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@yourdomain.com:your_generated_password" \
  -d "to=recipient@example.com" \
  -d "subject=Hello" \
  -d "text=Test email"
```

이 방법은 이미 SMTP 자격 증명을 사용하는 애플리케이션에서 이메일을 보낼 때 유용하며 SMTP에서 API로의 마이그레이션을 원활하게 합니다.

### 별칭 전용 엔드포인트 {#alias-only-endpoints}

[별칭 연락처](#alias-contacts-carddav), [별칭 캘린더](#alias-calendars-caldav), [별칭 메시지](#alias-messages-imappop3), 그리고 [별칭 폴더](#alias-folders-imappop3) 엔드포인트는 별칭 자격 증명이 필요하며 API 토큰 인증을 지원하지 않습니다.

걱정하지 마세요 – 아래에 예제가 제공되어 있으니 잘 모르실 경우 참고하세요.


## Errors {#errors}

오류가 발생하면 API 요청의 응답 본문에 자세한 오류 메시지가 포함됩니다.

| 코드 | 이름                  |
| ---- | --------------------- |
| 200  | 정상                   |
| 400  | 잘못된 요청            |
| 401  | 인증 실패              |
| 403  | 금지됨                 |
| 404  | 찾을 수 없음           |
| 429  | 요청 과다              |
| 500  | 내부 서버 오류         |
| 501  | 구현되지 않음          |
| 502  | 잘못된 게이트웨이      |
| 503  | 서비스 이용 불가       |
| 504  | 게이트웨이 시간 초과   |

> \[!TIP]
> 5xx 상태 코드가 발생하면(발생하지 않아야 하지만) <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a>로 연락해 주시면 즉시 문제 해결을 도와드리겠습니다.


## Localization {#localization}

저희 서비스는 25개 이상의 언어로 번역되어 있습니다. 모든 API 응답 메시지는 API 요청을 하는 사용자의 마지막 감지된 로케일로 번역됩니다. `Accept-Language` 헤더를 전달하여 이를 재정의할 수 있습니다. 이 페이지 하단의 언어 드롭다운을 사용해 자유롭게 시도해 보세요.


## Pagination {#pagination}

> \[!NOTE]
> 2024년 11월 1일부터 [도메인 목록](#list-domains) 및 [도메인 별칭 목록](#list-domain-aliases) API 엔드포인트는 기본적으로 페이지당 최대 결과 수가 `1000`으로 설정됩니다. 이 동작을 조기에 적용하려면 엔드포인트 쿼리 URL에 추가 쿼리스트링 매개변수로 `?paginate=true`를 전달할 수 있습니다.

페이지네이션은 결과 목록을 반환하는 모든 API 엔드포인트에서 지원됩니다.

단순히 쿼리스트링 속성 `page` (선택적으로 `limit`)를 제공하세요.

`page` 속성은 `1` 이상인 숫자여야 합니다. `limit`을 제공하는 경우(역시 숫자) 최소값은 `10`, 최대값은 `50`입니다(별도 명시가 없는 한).

| 쿼리스트링 매개변수 | 필수 여부 | 타입   | 설명                                                                                                                                                   |
| --------------------- | -------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page`                | 아니요   | 숫자   | 반환할 결과 페이지. 지정하지 않으면 기본값은 `1`입니다. `1` 이상인 숫자여야 합니다.                                                                   |
| `limit`               | 아니요   | 숫자   | 페이지당 반환할 결과 수. 지정하지 않으면 기본값은 `10`입니다. `1` 이상 `50` 이하의 숫자여야 합니다.                                                  |
더 많은 결과가 있는지 여부를 결정하기 위해, 다음과 같은 HTTP 응답 헤더를 제공합니다(프로그래밍 방식으로 페이지네이션을 하기 위해 파싱할 수 있습니다):

| HTTP Response Header | Example                                                                                                                                                                                                                                                  | Description                                                                                                                                                                                                                                                                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `X-Page-Count`       | `X-Page-Count: 3`                                                                                                                                                                                                                                        | 사용 가능한 총 페이지 수입니다.                                                                                                                                                                                                                                                                                                                                    |
| `X-Page-Current`     | `X-Page-Current: 1`                                                                                                                                                                                                                                      | 반환된 결과의 현재 페이지입니다(예: `page` 쿼리스트링 매개변수를 기준으로 함).                                                                                                                                                                                                                                                                                |
| `X-Page-Size`        | `X-Page-Size: 10`                                                                                                                                                                                                                                        | 반환된 페이지 내 결과의 총 개수입니다(예: `limit` 쿼리스트링 매개변수 및 실제 반환된 결과를 기준으로 함).                                                                                                                                                                                                                                       |
| `X-Item-Count`       | `X-Item-Count: 30`                                                                                                                                                                                                                                       | 모든 페이지에 걸쳐 사용 가능한 총 항목 수입니다.                                                                                                                                                                                                                                                                                                              |
| `Link`               | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | 예제와 같이 파싱할 수 있는 `Link` HTTP 응답 헤더를 제공합니다. 이는 [GitHub와 유사합니다](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (예: 관련 없거나 사용 불가능한 경우 모든 값이 제공되지 않을 수 있습니다. 예를 들어, 다음 페이지가 없으면 `"next"`가 제공되지 않습니다). |
> 예시 요청:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```


## 로그 {#logs}

### 로그 가져오기 {#retrieve-logs}

저희 API는 계정의 로그를 프로그래밍 방식으로 다운로드할 수 있도록 합니다. 이 엔드포인트에 요청을 제출하면 계정의 모든 로그를 처리하여 완료 시 첨부파일([Gzip](https://en.wikipedia.org/wiki/Gzip) 압축된 [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) 스프레드시트 파일)로 이메일로 보내드립니다.

이를 통해 [Cron job](https://en.wikipedia.org/wiki/Cron)이나 저희 [Node.js 작업 스케줄링 소프트웨어 Bree](https://github.com/breejs/bree)를 사용하여 원하는 시점에 로그를 받을 수 있는 백그라운드 작업을 생성할 수 있습니다. 이 엔드포인트는 하루에 `10`회 요청으로 제한됩니다.

첨부파일 이름은 소문자 형태의 `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz`이며, 이메일 본문에는 가져온 로그의 간략한 요약이 포함되어 있습니다. 또한 언제든지 [내 계정 → 로그](/my-account/logs)에서 로그를 다운로드할 수 있습니다.

> `GET /v1/logs/download`

| 쿼리스트링 매개변수 | 필수 | 타입          | 설명                                                                                                                         |
| --------------------- | ---- | ------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `domain`              | 아니오 | 문자열 (FQDN) | 완전한 도메인 이름("FQDN")으로 로그를 필터링합니다. 제공하지 않으면 모든 도메인의 모든 로그가 검색됩니다.                     |
| `q`                   | 아니오 | 문자열        | 이메일, 도메인, 별칭 이름, IP 주소 또는 날짜(`M/Y`, `M/D/YY`, `M-D`, `M-D-YY`, 또는 `M.D.YY` 형식)로 로그를 검색합니다.       |
| `bounce_category`     | 아니오 | 문자열        | 특정 반송 카테고리(예: `blocklist`)로 로그를 검색합니다.                                                                     |
| `response_code`       | 아니오 | 숫자          | 특정 오류 응답 코드(예: `421` 또는 `550`)로 로그를 검색합니다.                                                                |

> 예시 요청:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> 예시 Cron 작업 (매일 자정):

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

Cron 작업 표현식 구문을 검증하려면 [Crontab.guru](https://crontab.guru/)와 같은 서비스를 사용할 수 있습니다.

> 예시 Cron 작업 (매일 자정 **및 전날 로그 포함**):

MacOS용:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date -v-1d -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

Linux 및 Ubuntu용:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date --date "-1 days" -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```


## 계정 {#account}

### 계정 생성 {#create-account}

> `POST /v1/account`

| 본문 매개변수 | 필수 | 타입           | 설명         |
| -------------- | ---- | -------------- | ------------ |
| `email`        | 예   | 문자열 (이메일) | 이메일 주소  |
| `password`     | 예   | 문자열         | 비밀번호     |

> 예시 요청:

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### 계정 조회 {#retrieve-account}

> `GET /v1/account`

> 예시 요청:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### 계정 업데이트 {#update-account}

> `PUT /v1/account`

| 본문 매개변수 | 필수 | 타입           | 설명               |
| -------------- | ---- | -------------- | ------------------ |
| `email`        | 아니오 | 문자열 (이메일) | 이메일 주소        |
| `given_name`   | 아니오 | 문자열         | 이름               |
| `family_name`  | 아니오 | 문자열         | 성                 |
| `avatar_url`   | 아니오 | 문자열 (URL)   | 아바타 이미지 링크 |

> 예시 요청:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```


## 별칭 연락처 (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> 다른 API 엔드포인트와 달리, 이들은 [인증](#authentication)에서 "username"이 별칭 사용자 이름과 같고 "password"가 별칭 생성 비밀번호와 같은 Basic Authorization 헤더를 요구합니다.
> \[!WARNING]
> 이 엔드포인트 섹션은 진행 중이며 (희망컨대) 2024년에 출시될 예정입니다. 그동안은 웹사이트 내비게이션의 "Apps" 드롭다운에서 IMAP 클라이언트를 사용해 주세요.

### 연락처 목록 {#list-contacts}

> `GET /v1/contacts`

**곧 출시 예정**

### 연락처 생성 {#create-contact}

> `POST /v1/contacts`

**곧 출시 예정**

### 연락처 조회 {#retrieve-contact}

> `GET /v1/contacts/:id`

**곧 출시 예정**

### 연락처 업데이트 {#update-contact}

> `PUT /v1/contacts/:id`

**곧 출시 예정**

### 연락처 삭제 {#delete-contact}

> `DELETE /v1/contacts/:id`

**곧 출시 예정**


## 별칭 캘린더 (CalDAV) {#alias-calendars-caldav}

> \[!NOTE]
> 다른 API 엔드포인트와 달리, 이들은 [인증](#authentication)에서 "username"이 별칭 사용자 이름과 같고 "password"가 별칭 생성 비밀번호와 같은 Basic Authorization 헤더를 요구합니다.

> \[!WARNING]
> 이 엔드포인트 섹션은 진행 중이며 (희망컨대) 2024년에 출시될 예정입니다. 그동안은 웹사이트 내비게이션의 "Apps" 드롭다운에서 IMAP 클라이언트를 사용해 주세요.

### 캘린더 목록 {#list-calendars}

> `GET /v1/calendars`

**곧 출시 예정**

### 캘린더 생성 {#create-calendar}

> `POST /v1/calendars`

**곧 출시 예정**

### 캘린더 조회 {#retrieve-calendar}

> `GET /v1/calendars/:id`

**곧 출시 예정**

### 캘린더 업데이트 {#update-calendar}

> `PUT /v1/calendars/:id`

**곧 출시 예정**

### 캘린더 삭제 {#delete-calendar}

> `DELETE /v1/calendars/:id`

**곧 출시 예정**


## 별칭 메시지 (IMAP/POP3) {#alias-messages-imappop3}

> \[!NOTE]
> 다른 API 엔드포인트와 달리, 이들은 [인증](#authentication)에서 "username"이 별칭 사용자 이름과 같고 "password"가 별칭 생성 비밀번호와 같은 Basic Authorization 헤더를 요구합니다.

> \[!WARNING]
> 이 엔드포인트 섹션은 진행 중이며 (희망컨대) 2024년에 출시될 예정입니다. 그동안은 웹사이트 내비게이션의 "Apps" 드롭다운에서 IMAP 클라이언트를 사용해 주세요.

도메인 설정 지침을 반드시 따르셨는지 확인해 주세요.

이 지침은 FAQ 섹션 [IMAP으로 이메일 수신을 지원하나요?](/faq#do-you-support-receiving-email-with-imap)에서 확인할 수 있습니다.

### 메시지 목록 및 검색 {#list-and-search-for-messages}

> `GET /v1/messages`

**곧 출시 예정**

### 메시지 생성 {#create-message}

> \[!NOTE]
> 이 작업은 이메일을 **전송하지 않습니다** – 단순히 메시지를 메일박스 폴더에 추가하는 것뿐입니다 (예: IMAP `APPEND` 명령과 유사합니다). 이메일을 보내고 싶다면 아래 [아웃바운드 SMTP 이메일 생성](#create-outbound-smtp-email)을 참조하세요. 아웃바운드 SMTP 이메일을 생성한 후, 이 엔드포인트를 사용해 별칭 메일박스에 복사본을 추가하여 저장할 수 있습니다.

> `POST /v1/messages`

**곧 출시 예정**

### 메시지 조회 {#retrieve-message}

> `GET /v1/messages/:id`

**곧 출시 예정**

### 메시지 업데이트 {#update-message}

> `PUT /v1/messages/:id`

**곧 출시 예정**

### 메시지 삭제 {#delete-message}

> `DELETE /v1/messages:id`

**곧 출시 예정**


## 별칭 폴더 (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> 폴더 엔드포인트는 폴더 경로 <code>/v1/folders/:path</code>와 폴더 ID <code>:id</code>를 상호 교환하여 사용할 수 있습니다. 즉, 폴더를 <code>path</code> 또는 <code>id</code> 값으로 참조할 수 있습니다.

> \[!WARNING]
> 이 엔드포인트 섹션은 진행 중이며 (희망컨대) 2024년에 출시될 예정입니다. 그동안은 웹사이트 내비게이션의 "Apps" 드롭다운에서 IMAP 클라이언트를 사용해 주세요.

### 폴더 목록 {#list-folders}

> `GET /v1/folders`

**곧 출시 예정**

### 폴더 생성 {#create-folder}

> `POST /v1/folders`

**곧 출시 예정**

### 폴더 조회 {#retrieve-folder}

> `GET /v1/folders/:id`

**곧 출시 예정**

### 폴더 업데이트 {#update-folder}

> `PUT /v1/folders/:id`

**곧 출시 예정**

### 폴더 삭제 {#delete-folder}

> `DELETE /v1/folders/:id`

**곧 출시 예정**

### 폴더 복사 {#copy-folder}

> `POST /v1/folders/:id/copy`

**곧 출시 예정**


## 아웃바운드 이메일 {#outbound-emails}

도메인 설정 지침을 반드시 따르셨는지 확인해 주세요.

이 지침은 [내 계정 → 도메인 → 설정 → 아웃바운드 SMTP 구성](/my-account/domains)에서 확인할 수 있습니다. 도메인으로 아웃바운드 SMTP를 보내려면 DKIM, Return-Path, DMARC 설정이 필요합니다.
### 발신 SMTP 이메일 한도 조회 {#get-outbound-smtp-email-limit}

이 엔드포인트는 계정별 일일 SMTP 발신 메시지 수에 대한 `count`와 `limit`을 포함하는 JSON 객체를 반환하는 간단한 엔드포인트입니다.

> `GET /v1/emails/limit`

> 요청 예시:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### 발신 SMTP 이메일 목록 {#list-outbound-smtp-emails}

이 엔드포인트는 이메일의 `message`, `headers`, 또는 `rejectedErrors` 속성 값을 반환하지 않습니다.

해당 속성과 값을 반환하려면 이메일 ID와 함께 [이메일 조회](#retrieve-email) 엔드포인트를 사용하세요.

> `GET /v1/emails`

| 쿼리스트링 매개변수 | 필수 여부 | 타입                      | 설명                                                                                                                                               |
| --------------------- | -------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`                   | 아니요   | 문자열 (정규식 지원)       | 메타데이터로 이메일 검색                                                                                                                           |
| `domain`              | 아니요   | 문자열 (정규식 지원)       | 도메인 이름으로 이메일 검색                                                                                                                        |
| `sort`                | 아니요   | 문자열                    | 특정 필드로 정렬 (해당 필드의 역순 정렬은 단일 하이픈 `-` 접두사 사용). 설정하지 않으면 기본값은 `created_at` 입니다.                             |
| `page`                | 아니요   | 숫자                      | 자세한 내용은 [페이지네이션](#pagination) 참고                                                                                                     |
| `limit`               | 아니요   | 숫자                      | 자세한 내용은 [페이지네이션](#pagination) 참고                                                                                                     |

> 요청 예시:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### 발신 SMTP 이메일 생성 {#create-outbound-smtp-email}

이메일 생성 API는 Nodemailer의 메시지 옵션 구성을 참고하고 활용합니다. 아래 본문 파라미터에 대해서는 [Nodemailer 메시지 구성](https://nodemailer.com/message/)을 참고하세요.

`envelope`와 `dkim`을 제외하고(이 두 옵션은 자동 설정됨) 모든 Nodemailer 옵션을 지원합니다. 보안상 `disableFileAccess`와 `disableUrlAccess` 옵션은 자동으로 `true`로 설정됩니다.

헤더를 포함한 전체 원시 이메일을 `raw` 단일 옵션으로 전달하거나, 아래 개별 본문 파라미터 옵션을 전달해야 합니다.

이 API 엔드포인트는 헤더에 이모지가 포함된 경우 자동으로 인코딩합니다(예: `Subject: 🤓 Hello`는 자동으로 `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello`로 변환). 개발자 친화적이고 실수 방지에 중점을 둔 이메일 API를 목표로 합니다.

**인증:** 이 엔드포인트는 [API 토큰 인증](#api-token-authentication-recommended-for-most-endpoints)과 [별칭 자격 증명 인증](#alias-credentials-authentication-for-outbound-email)을 모두 지원합니다. 자세한 내용은 위의 [인증](#authentication) 섹션을 참고하세요.

> `POST /v1/emails`

| 본문 파라미터     | 필수 여부 | 타입             | 설명                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------------- | -------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `from`           | 아니요   | 문자열 (이메일)  | 발신자 이메일 주소 (도메인의 별칭으로 존재해야 함).                                                                                                                                                                                                                                                                                                                                                                                                          |
| `to`             | 아니요   | 문자열 또는 배열 | "To" 헤더의 수신자 목록 (쉼표로 구분된 문자열 또는 배열).                                                                                                                                                                                                                                                                                                                                                                                                     |
| `cc`             | 아니요   | 문자열 또는 배열 | "Cc" 헤더의 수신자 목록 (쉼표로 구분된 문자열 또는 배열).                                                                                                                                                                                                                                                                                                                                                                                                     |
| `bcc`            | 아니요   | 문자열 또는 배열 | "Bcc" 헤더의 수신자 목록 (쉼표로 구분된 문자열 또는 배열).                                                                                                                                                                                                                                                                                                                                                                                                     |
| `subject`        | 아니요   | 문자열           | 이메일 제목.                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `text`           | 아니요   | 문자열 또는 버퍼 | 메시지의 일반 텍스트 버전.                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `html`           | 아니요   | 문자열 또는 버퍼 | 메시지의 HTML 버전.                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `attachments`    | 아니요   | 배열             | 첨부파일 객체 배열 ([Nodemailer의 공통 필드](https://nodemailer.com/message/#common-fields) 참고).                                                                                                                                                                                                                                                                                                                                                            |
| `sender`         | 아니요   | 문자열           | "Sender" 헤더의 이메일 주소 ([Nodemailer의 고급 필드](https://nodemailer.com/message/#more-advanced-fields) 참고).                                                                                                                                                                                                                                                                                                                                             |
| `replyTo`        | 아니요   | 문자열           | "Reply-To" 헤더의 이메일 주소.                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `inReplyTo`      | 아니요   | 문자열           | 메시지가 회신하는 Message-ID.                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `references`     | 아니요   | 문자열 또는 배열 | 공백으로 구분된 Message-ID 목록 또는 배열.                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `attachDataUrls` | 아니요   | 불리언           | `true`일 경우 메시지 HTML 내용 내 `data:` 이미지들을 임베디드 첨부파일로 변환.                                                                                                                                                                                                                                                                                                                                                                                  |
| `watchHtml`      | 아니요   | 문자열           | Apple Watch 전용 HTML 메시지 버전 ([Nodemailer 문서](https://nodemailer.com/message/#content-options) 기준, 최신 워치는 설정 불필요).                                                                                                                                                                                                                                                                                                                        |
| `amp`            | 아니요   | 문자열           | AMP4EMAIL 전용 HTML 메시지 버전 ([Nodemailer 예시](https://nodemailer.com/message/#amp-example) 참고).                                                                                                                                                                                                                                                                                                                                                          |
| `icalEvent`      | 아니요   | 객체             | 대체 메시지 콘텐츠로 사용할 iCalendar 이벤트 ([Nodemailer 캘린더 이벤트](https://nodemailer.com/message/calendar-events/) 참고).                                                                                                                                                                                                                                                                                                                              |
| `alternatives`   | 아니요   | 배열             | 대체 메시지 콘텐츠 배열 ([Nodemailer 대체 콘텐츠](https://nodemailer.com/message/alternatives/) 참고).                                                                                                                                                                                                                                                                                                                                                          |
| `encoding`       | 아니요   | 문자열           | 텍스트 및 HTML 문자열 인코딩 (기본값은 `"utf-8"`, `"hex"` 및 `"base64"` 인코딩도 지원).                                                                                                                                                                                                                                                                                                                                                                         |
| `raw`            | 아니요   | 문자열 또는 버퍼 | Nodemailer가 생성하는 메시지 대신 사용할 맞춤형 RFC822 형식 메시지 ([Nodemailer 맞춤 소스](https://nodemailer.com/message/custom-source/) 참고).                                                                                                                                                                                                                                                                                                               |
| `textEncoding`   | 아니요   | 문자열           | 텍스트 값에 강제 적용할 인코딩 (`"quoted-printable"` 또는 `"base64"` 중 하나). 기본값은 감지된 가장 근접한 값 (ASCII의 경우 `"quoted-printable"` 사용).                                                                                                                                                                                                                                                                                                      |
| `priority`       | 아니요   | 문자열           | 이메일 우선순위 (`"high"`, `"normal"` (기본값), `"low"` 중 하나). `"normal"` 값은 우선순위 헤더를 설정하지 않음 (기본 동작). `"high"` 또는 `"low"` 설정 시 `X-Priority`, `X-MSMail-Priority`, `Importance` 헤더가 [적절히 설정됨](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers`        | 아니요   | 객체 또는 배열   | 추가로 설정할 헤더 필드 객체 또는 배열 ([Nodemailer 맞춤 헤더](https://nodemailer.com/message/custom-headers/) 참고).                                                                                                                                                                                                                                                                                                                                           |
| `messageId`      | 아니요   | 문자열           | "Message-ID" 헤더에 사용할 선택적 Message-ID 값 (설정하지 않으면 기본값이 자동 생성됨 – 값은 [RFC2822 규격](https://stackoverflow.com/a/4031705)을 준수해야 함).                                                                                                                                                                                                                                                                                                |
| `date`           | 아니요   | 문자열 또는 날짜 | 파싱 후 Date 헤더가 없으면 사용할 선택적 날짜 값, 설정하지 않으면 현재 UTC 문자열 사용. 날짜 헤더는 현재 시간보다 30일 이상 미래일 수 없음.                                                                                                                                                                                                                                                                                                               |
| `list`           | 아니요   | 객체             | 선택적 `List-*` 헤더 객체 ([Nodemailer 리스트 헤더](https://nodemailer.com/message/list-headers/) 참고).                                                                                                                                                                                                                                                                                                                                                         |
> 예제 요청 (API 토큰):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> 예제 요청 (별칭 자격 증명):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@DOMAIN_NAME:GENERATED_PASSWORD" \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> 예제 요청 (원시 이메일):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### 발신 SMTP 이메일 조회 {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> 예제 요청:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### 발신 SMTP 이메일 삭제 {#delete-outbound-smtp-email}

이메일 삭제는 현재 상태가 `"pending"`, `"queued"`, 또는 `"deferred"` 중 하나일 경우에만 상태를 `"rejected"`로 설정하며(그 후 큐에서 처리하지 않음) 수행됩니다. 이메일은 생성 및/또는 발송 후 30일이 지나면 자동으로 삭제될 수 있으므로, 클라이언트, 데이터베이스 또는 애플리케이션에 발신 SMTP 이메일 사본을 보관해야 합니다. 원하시면 데이터베이스에서 이메일 ID 값을 참조할 수 있으며, 이 값은 [이메일 생성](#create-email) 및 [이메일 조회](#retrieve-email) 엔드포인트 모두에서 반환됩니다.

> `DELETE /v1/emails/:id`

> 예제 요청:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```


## 도메인 {#domains}

> \[!TIP]
> 도메인 이름 <code>/v1/domains/:domain_name</code>을 사용하는 도메인 엔드포인트는 도메인 ID <code>:domain_id</code>와 상호 교환 가능합니다. 즉, 도메인을 <code>name</code> 또는 <code>id</code> 값으로 참조할 수 있습니다.

### 도메인 목록 {#list-domains}

> \[!NOTE]
> 2024년 11월 1일부터 [도메인 목록](#list-domains) 및 [도메인 별칭 목록](#list-domain-aliases) API 엔드포인트는 페이지당 최대 결과 수가 기본적으로 `1000`으로 설정됩니다. 이 동작을 조기에 적용하려면 엔드포인트 쿼리 URL에 추가 쿼리 문자열 매개변수로 `?paginate=true`를 전달할 수 있습니다. 자세한 내용은 [페이지네이션](#pagination)을 참조하세요.

> `GET /v1/domains`

| 쿼리 문자열 매개변수 | 필수 | 유형                      | 설명                                                                                                                                               |
| --------------------- | ---- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`                   | 아니요 | 문자열 (정규식 지원)       | 도메인 이름으로 검색                                                                                                                               |
| `name`                | 아니요 | 문자열 (정규식 지원)       | 도메인 이름으로 검색                                                                                                                               |
| `sort`                | 아니요 | 문자열                    | 특정 필드로 정렬 (해당 필드의 역순 정렬은 접두사로 단일 하이픈 `-` 사용). 설정하지 않으면 기본값은 `created_at`입니다.                            |
| `page`                | 아니요 | 숫자                      | 자세한 내용은 [페이지네이션](#pagination) 참조                                                                                                    |
| `limit`               | 아니요 | 숫자                      | 자세한 내용은 [페이지네이션](#pagination) 참조                                                                                                    |

> 예제 요청:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### 도메인 생성 {#create-domain}

> `POST /v1/domains`

| 본문 매개변수                   | 필수 | 유형                                          | 설명                                                                                                                                                                                                                                                                                                               |
| ------------------------------ | ---- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain`                       | 예   | 문자열 (FQDN 또는 IP)                         | 완전한 도메인 이름("FQDN") 또는 IP 주소                                                                                                                                                                                                                                                                           |
| `team_domain`                  | 아니요 | 문자열 (도메인 ID 또는 도메인 이름; FQDN)     | 이 도메인을 다른 도메인과 동일한 팀에 자동 할당합니다. 즉, 이 도메인의 모든 구성원이 팀 멤버로 할당되며, `plan`도 자동으로 `team`으로 설정됩니다. 필요 시 명시적으로 비활성화하려면 `"none"`으로 설정할 수 있지만, 일반적으로 필요하지 않습니다.                                                                                  |
| `plan`                         | 아니요 | 문자열 (열거형)                               | 플랜 유형 (반드시 `"free"`, `"enhanced_protection"`, 또는 `"team"` 중 하나여야 하며, 기본값은 `"free"` 또는 사용자의 현재 유료 플랜)                                                                                                                                                                               |
| `catchall`                     | 아니요 | 문자열 (구분된 이메일 주소) 또는 불리언       | 기본 캐치올 별칭 생성 여부, 기본값은 `true` (true일 경우 API 사용자 이메일 주소를 수신자로 사용, false일 경우 캐치올 생성 안 함). 문자열이 전달되면 줄 바꿈, 공백, 쉼표로 구분된 이메일 주소 목록을 수신자로 사용                                                                                                         |
| `has_adult_content_protection` | 아니요 | 불리언                                       | 이 도메인에서 스팸 스캐너 성인 콘텐츠 보호 기능 활성화 여부                                                                                                                                                                                                                                                       |
| `has_phishing_protection`      | 아니요 | 불리언                                       | 이 도메인에서 스팸 스캐너 피싱 보호 기능 활성화 여부                                                                                                                                                                                                                                                              |
| `has_executable_protection`    | 아니요 | 불리언                                       | 이 도메인에서 스팸 스캐너 실행 파일 보호 기능 활성화 여부                                                                                                                                                                                                                                                        |
| `has_virus_protection`         | 아니요 | 불리언                                       | 이 도메인에서 스팸 스캐너 바이러스 보호 기능 활성화 여부                                                                                                                                                                                                                                                         |
| `has_recipient_verification`   | 아니요 | 불리언                                       | 별칭 수신자가 이메일 흐름을 위해 이메일 인증 링크를 클릭해야 하는지 여부에 대한 전역 도메인 기본값                                                                                                                                                                                                                   |
| `ignore_mx_check`              | 아니요 | 불리언                                       | 도메인 검증 시 MX 레코드 검사를 무시할지 여부. 주로 고급 MX 교환 구성 규칙이 있고 기존 MX 교환을 유지하며 당사로 전달해야 하는 사용자를 위한 옵션                                                                                                                             |
| `retention_days`               | 아니요 | 숫자                                         | 성공적으로 전달되거나 영구 오류가 발생한 후 발신 SMTP 이메일을 저장할 보존 일수 (0~30 사이 정수). 기본값은 `0`이며, 이는 보안을 위해 발신 SMTP 이메일이 즉시 삭제 및 편집됨을 의미                                                                                                                             |
| `bounce_webhook`               | 아니요 | 문자열 (URL) 또는 불리언 (false)              | 반송 웹훅을 전송할 선택한 `http://` 또는 `https://` 웹훅 URL. 발신 SMTP 실패(예: 소프트 또는 하드 실패)에 대한 정보를 포함하는 `POST` 요청을 이 URL로 전송하여 구독자를 관리하고 발신 이메일을 프로그래밍 방식으로 관리할 수 있음                                                                                   |
| `max_quota_per_alias`          | 아니요 | 문자열                                        | 이 도메인 이름의 별칭에 대한 저장 최대 할당량. [bytes](https://github.com/visionmedia/bytes.js)에서 파싱할 수 있는 "1 GB"와 같은 값을 입력하세요.                                                                                                                                                                   |
> 예제 요청:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### 도메인 조회 {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> 예제 요청:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### 도메인 레코드 검증 {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> 예제 요청:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### 도메인 SMTP 레코드 검증 {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> 예제 요청:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### 도메인 전체 수신 비밀번호 목록 {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> 예제 요청:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### 도메인 전체 수신 비밀번호 생성 {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Body Parameter | 필수 | 타입   | 설명                                                                                                                                                                                                                      |
| -------------- | ---- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | 아니오 | String | 도메인 전체 수신 비밀번호로 사용할 사용자 지정 새 비밀번호입니다.  API 요청 본문에서 이 값을 비워두거나 아예 생략하면 무작위로 생성된 강력한 비밀번호가 발급됩니다.                                                                 |
| `description`  | 아니오 | String | 조직 목적의 설명입니다.                                                                                                                                                                                                   |

> 예제 요청:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### 도메인 전체 수신 비밀번호 삭제 {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> 예제 요청:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### 도메인 업데이트 {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| Body Parameter                 | 필수 | 타입                            | 설명                                                                                                                                                                                                                                                                                     |
| ------------------------------ | ---- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port`                    | 아니오 | String 또는 Number              | SMTP 포워딩에 사용할 사용자 지정 포트 (기본값은 `"25"`)                                                                                                                                                                                                                                  |
| `has_adult_content_protection` | 아니오 | Boolean                        | 이 도메인에서 스팸 스캐너의 성인 콘텐츠 보호 기능 활성화 여부                                                                                                                                                                                                                            |
| `has_phishing_protection`      | 아니오 | Boolean                        | 이 도메인에서 스팸 스캐너의 피싱 보호 기능 활성화 여부                                                                                                                                                                                                                                  |
| `has_executable_protection`    | 아니오 | Boolean                        | 이 도메인에서 스팸 스캐너의 실행 파일 보호 기능 활성화 여부                                                                                                                                                                                                                            |
| `has_virus_protection`         | 아니오 | Boolean                        | 이 도메인에서 스팸 스캐너의 바이러스 보호 기능 활성화 여부                                                                                                                                                                                                                              |
| `has_recipient_verification`   | 아니오 | Boolean                        | 별칭 수신자가 이메일 흐름을 위해 이메일 인증 링크를 클릭해야 하는지 여부에 대한 전역 도메인 기본값                                                                                                                                                                                        |
| `ignore_mx_check`              | 아니오 | Boolean                        | 도메인 검증 시 MX 레코드 검사를 무시할지 여부. 주로 고급 MX 교환 구성 규칙이 있고 기존 MX 교환을 유지하며 당사로 포워딩해야 하는 사용자를 위한 설정입니다.                                                                                                                             |
| `retention_days`               | 아니오 | Number                         | 성공적으로 전달되거나 영구 오류가 발생한 후 보관할 아웃바운드 SMTP 이메일의 보관 일수로 `0`에서 `30` 사이의 정수입니다. 기본값은 `0`이며, 이는 아웃바운드 SMTP 이메일이 즉시 삭제 및 편집됨을 의미합니다.                                                                                 |
| `bounce_webhook`               | 아니오 | String (URL) 또는 Boolean (false) | 반송 웹훅을 보낼 선택한 `http://` 또는 `https://` 웹훅 URL입니다. 아웃바운드 SMTP 실패(예: 소프트 또는 하드 실패)에 대한 정보를 이 URL로 `POST` 요청하여 구독자를 관리하고 아웃바운드 이메일을 프로그래밍 방식으로 관리할 수 있습니다.                                               |
| `max_quota_per_alias`          | 아니오 | String                         | 이 도메인 이름의 별칭에 대한 최대 저장 용량 할당량입니다. [bytes](https://github.com/visionmedia/bytes.js)에서 파싱할 수 있는 "1 GB"와 같은 값을 입력하세요.                                                                                                                           |
> Example Request:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### 도메인 삭제 {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> Example Request:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```


## 초대 {#invites}

### 도메인 초대 수락 {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> Example Request:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### 도메인 초대 생성 {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| Body Parameter | 필수 | 유형                | 설명                                                                                      |
| -------------- | ---- | ------------------- | ----------------------------------------------------------------------------------------- |
| `email`        | 예   | 문자열 (이메일)     | 도메인 멤버 목록에 초대할 이메일 주소                                                    |
| `group`        | 예   | 문자열 (열거형)     | 도메인 멤버십에 사용자를 추가할 그룹 ( `"admin"` 또는 `"user"` 중 하나일 수 있음)         |

> Example Request:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> 초대받는 사용자가 이미 관리자가 속한 다른 도메인의 승인된 멤버인 경우, 초대는 자동으로 수락되며 이메일이 전송되지 않습니다.

### 도메인 초대 제거 {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| Body Parameter | 필수 | 유형           | 설명                                      |
| -------------- | ---- | -------------- | ----------------------------------------- |
| `email`        | 예   | 문자열 (이메일) | 도메인 멤버 목록에서 제거할 이메일 주소    |

> Example Request:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```


## 멤버 {#members}

### 도메인 멤버 업데이트 {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Body Parameter | 필수 | 유형                | 설명                                                                                  |
| -------------- | ---- | ------------------- | ------------------------------------------------------------------------------------- |
| `group`        | 예   | 문자열 (열거형)     | 도메인 멤버십에서 사용자를 업데이트할 그룹 ( `"admin"` 또는 `"user"` 중 하나일 수 있음) |

> Example Request:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### 도메인 멤버 제거 {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> Example Request:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```


## 별칭 {#aliases}

### 별칭 비밀번호 생성 {#generate-an-alias-password}

이메일로 안내를 보내지 않으면, 성공적인 요청의 JSON 응답 본문에 `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }` 형식으로 사용자 이름과 비밀번호가 포함됩니다.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Body Parameter         | 필수 | 유형    | 설명                                                                                                                                                                                                                                                                                         |
| ---------------------- | ---- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password`         | 아니오 | 문자열  | 별칭에 사용할 사용자 지정 새 비밀번호입니다. 무작위로 생성된 강력한 비밀번호를 원하면 API 요청 본문에서 이 값을 비워두거나 생략할 수 있습니다.                                                                                                                                            |
| `password`             | 아니오 | 문자열  | 기존 IMAP 메일박스 저장소를 삭제하지 않고 비밀번호를 변경할 때 사용하는 기존 별칭 비밀번호입니다 (`is_override` 옵션을 참조하세요, 기존 비밀번호를 모를 경우).                                                                                                                             |
| `is_override`          | 아니오 | 불리언  | **주의해서 사용하세요**: 기존 별칭 비밀번호와 데이터베이스를 완전히 덮어쓰며, 기존 IMAP 저장소를 영구 삭제하고 별칭의 SQLite 이메일 데이터베이스를 완전히 초기화합니다. 기존 메일박스가 연결되어 있다면 가능하면 백업을 하세요.                                                                 |
| `emailed_instructions` | 아니오 | 문자열  | 별칭 비밀번호와 설정 안내를 보낼 이메일 주소입니다.                                                                                                                                                                                                                                         |
> Example Request:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### 도메인 별칭 목록 {#list-domain-aliases}

> \[!NOTE]
> 2024년 11월 1일부터 [도메인 목록](#list-domains) 및 [도메인 별칭 목록](#list-domain-aliases) API 엔드포인트는 페이지당 최대 결과 수가 기본값으로 `1000`이 됩니다. 이 동작을 조기에 사용하려면, 엔드포인트 쿼리 URL에 추가 쿼리스트링 매개변수로 `?paginate=true`를 전달할 수 있습니다. 자세한 내용은 [페이지네이션](#pagination)을 참조하세요.

> `GET /v1/domains/DOMAIN_NAME/aliases`

| 쿼리스트링 매개변수       | 필수 여부 | 타입                         | 설명                                                                                                                                               |
| ------------------------- | -------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`                       | 아니요   | 문자열 (정규식 지원)          | 이름, 라벨 또는 수신자로 도메인 내 별칭 검색                                                                                                      |
| `name`                    | 아니요   | 문자열 (정규식 지원)          | 이름으로 도메인 내 별칭 검색                                                                                                                     |
| `recipient`               | 아니요   | 문자열 (정규식 지원)          | 수신자로 도메인 내 별칭 검색                                                                                                                     |
| `sort`                    | 아니요   | 문자열                       | 특정 필드로 정렬 (해당 필드의 역순 정렬은 접두사로 단일 하이픈 `-` 사용). 설정하지 않으면 기본값은 `created_at` 입니다.                         |
| `page`                    | 아니요   | 숫자                         | 자세한 내용은 [페이지네이션](#pagination) 참조                                                                                                   |
| `limit`                   | 아니요   | 숫자                         | 자세한 내용은 [페이지네이션](#pagination) 참조                                                                                                   |

> Example Request:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### 새 도메인 별칭 생성 {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| 본문 매개변수                     | 필수 여부 | 타입                                   | 설명                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`                           | 아니요   | 문자열                                 | 별칭 이름 (제공하지 않거나 빈 값일 경우, 무작위 별칭이 생성됩니다)                                                                                                                                                                                                                                                                                                                        |
| `recipients`                     | 아니요   | 문자열 또는 배열                       | 수신자 목록 (유효한 이메일 주소, 완전한 도메인 이름("FQDN"), IP 주소 및/또는 웹훅 URL이 줄바꿈/공백/쉼표로 구분된 문자열 또는 배열이어야 하며, 제공하지 않거나 빈 배열일 경우 API 요청을 하는 사용자의 이메일이 수신자로 설정됩니다)                                                                                                                                                |
| `description`                    | 아니요   | 문자열                                 | 별칭 설명                                                                                                                                                                                                                                                                                                                                                                                 |
| `labels`                        | 아니요   | 문자열 또는 배열                       | 라벨 목록 (줄바꿈/공백/쉼표로 구분된 문자열 또는 배열이어야 합니다)                                                                                                                                                                                                                                                                                                                     |
| `has_recipient_verification`     | 아니요   | 불리언                                | 이메일 흐름을 위해 수신자가 이메일 인증 링크를 클릭하도록 요구 (요청 본문에 명시적으로 설정하지 않으면 도메인 설정을 기본값으로 사용)                                                                                                                                                                                                                                                     |
| `is_enabled`                    | 아니요   | 불리언                                | 이 별칭을 활성화 또는 비활성화 여부 (비활성화 시 이메일은 어디로도 라우팅되지 않고 성공 상태 코드를 반환). 값이 전달되면 [boolean](https://github.com/thenativeweb/boolean#quick-start)을 사용해 불리언으로 변환됩니다.                                                                                                                                                                   |
| `error_code_if_disabled`         | 아니요   | 숫자 (`250`, `421`, 또는 `550`)       | `is_enabled`가 `false`일 때 이 별칭으로 들어오는 이메일을 거부하는 코드. `250` (조용히 어디에도 전달하지 않음, 예: 블랙홀 또는 `/dev/null`), `421` (소프트 거부; 약 5일간 재시도), `550` (영구 실패 및 거부) 중 하나를 선택. 기본값은 `250`입니다.                                                                                                                                        |
| `has_imap`                      | 아니요   | 불리언                                | 이 별칭에 대해 IMAP 저장소 활성화 여부 (비활성화 시 수신된 이메일은 [IMAP 저장소](/blog/docs/best-quantum-safe-encrypted-email-service)에 저장되지 않음). 값이 전달되면 [boolean](https://github.com/thenativeweb/boolean#quick-start)을 사용해 불리언으로 변환됩니다.                                                                                                                        |
| `has_pgp`                       | 아니요   | 불리언                                | 별칭의 `public_key`를 사용하여 [IMAP/POP3/CalDAV/CardDAV 암호화 이메일 저장소](/blog/docs/best-quantum-safe-encrypted-email-service)에 대해 [OpenPGP 암호화](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)를 활성화 또는 비활성화 여부                                                                                                         |
| `public_key`                    | 아니요   | 문자열                                 | ASCII Armor 형식의 OpenPGP 공개 키 ([예시 보기](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); 예: `support@forwardemail.net`의 GPG 키). `has_pgp`가 `true`로 설정된 경우에만 적용됩니다. [FAQ에서 종단 간 암호화에 대해 자세히 알아보기](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                     | 아니요   | 문자열                                 | 이 별칭의 저장소 최대 할당량. 비워두면 도메인의 현재 최대 할당량으로 재설정되며, "1 GB"와 같이 [bytes](https://github.com/visionmedia/bytes.js)로 파싱 가능한 값을 입력할 수 있습니다. 이 값은 도메인 관리자만 조정할 수 있습니다.                                                                                                                                                   |
| `vacation_responder_is_enabled` | 아니요   | 불리언                                | 자동 부재중 응답기 활성화 여부                                                                                                                                                                                                                                                                                                                                                              |
| `vacation_responder_start_date` | 아니요   | 문자열                                 | 부재중 응답기 시작 날짜 (활성화되어 있고 시작 날짜가 설정되지 않은 경우 이미 시작된 것으로 간주). `MM/DD/YYYY`, `YYYY-MM-DD` 등과 같은 날짜 형식 및 `dayjs`를 사용한 스마트 파싱을 지원합니다.                                                                                                                                                                                    |
| `vacation_responder_end_date`   | 아니요   | 문자열                                 | 부재중 응답기 종료 날짜 (활성화되어 있고 종료 날짜가 설정되지 않은 경우 종료되지 않고 계속 응답하는 것으로 간주). `MM/DD/YYYY`, `YYYY-MM-DD` 등과 같은 날짜 형식 및 `dayjs`를 사용한 스마트 파싱을 지원합니다.                                                                                                                                                                        |
| `vacation_responder_subject`    | 아니요   | 문자열                                 | 부재중 응답기 제목(평문), 예: "부재중". 여기서는 `striptags`를 사용해 모든 HTML을 제거합니다.                                                                                                                                                                                                                                                                                               |
| `vacation_responder_message`    | 아니요   | 문자열                                 | 부재중 응답기 메시지(평문), 예: "2월까지 부재중입니다.". 여기서는 `striptags`를 사용해 모든 HTML을 제거합니다.                                                                                                                                                                                                                                                                                 |
> Example Request:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### 도메인 별칭 조회 {#retrieve-domain-alias}

도메인 별칭은 `id` 또는 `name` 값으로 조회할 수 있습니다.

> `GET /v1/domains/:domain_name/aliases/:alias_id`

> Example Request:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

> `GET /v1/domains/:domain_name/aliases/:alias_name`

> Example Request:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_name \
  -u API_TOKEN:
```

### 도메인 별칭 업데이트 {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Body Parameter                  | 필수 여부 | 타입                                   | 설명                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`                          | 아니요   | 문자열                                 | 별칭 이름                                                                                                                                                                                                                                                                                                                                                                                 |
| `recipients`                    | 아니요   | 문자열 또는 배열                       | 수신자 목록 (유효한 이메일 주소, 완전한 도메인 이름("FQDN"), IP 주소 및/또는 웹훅 URL이 줄바꿈/공백/쉼표로 구분된 문자열 또는 배열이어야 함)                                                                                                                                                                                                                                              |
| `description`                   | 아니요   | 문자열                                 | 별칭 설명                                                                                                                                                                                                                                                                                                                                                                                |
| `labels`                        | 아니요   | 문자열 또는 배열                       | 라벨 목록 (줄바꿈/공백/쉼표로 구분된 문자열 또는 배열이어야 함)                                                                                                                                                                                                                                                                                                                        |
| `has_recipient_verification`    | 아니요   | 불리언                                | 이메일이 정상적으로 전달되기 위해 수신자가 이메일 인증 링크를 클릭하도록 요구 (요청 본문에 명시적으로 설정하지 않으면 도메인 설정을 기본값으로 사용)                                                                                                                                                                                                                                   |
| `is_enabled`                    | 아니요   | 불리언                                | 이 별칭을 활성화 또는 비활성화할지 여부 (비활성화 시 이메일은 어디로도 라우팅되지 않고 성공 상태 코드만 반환). 값이 전달되면 [boolean](https://github.com/thenativeweb/boolean#quick-start)을 사용해 불리언으로 변환됨                                                                                                                                                                   |
| `error_code_if_disabled`        | 아니요   | 숫자 (`250`, `421`, 또는 `550`)       | `is_enabled`가 `false`일 때 이 별칭으로 들어오는 이메일을 거부하는 코드. `250` (조용히 어디에도 전달하지 않음, 예: 블랙홀 또는 `/dev/null`), `421` (소프트 거부; 약 5일간 재시도), `550` (영구 실패 및 거부) 중 하나. 기본값은 `250`                                                                                                                                                     |
| `has_imap`                      | 아니요   | 불리언                                | 이 별칭에 대해 IMAP 저장소를 활성화 또는 비활성화할지 여부 (비활성화 시 수신된 이메일은 [IMAP 저장소](/blog/docs/best-quantum-safe-encrypted-email-service)에 저장되지 않음). 값이 전달되면 [boolean](https://github.com/thenativeweb/boolean#quick-start)을 사용해 불리언으로 변환됨                                                                                                          |
| `has_pgp`                       | 아니요   | 불리언                                | 별칭의 `public_key`를 사용하여 [IMAP/POP3/CalDAV/CardDAV 암호화 이메일 저장소](/blog/docs/best-quantum-safe-encrypted-email-service)에 대해 [OpenPGP 암호화](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)를 활성화 또는 비활성화할지 여부                                                                                                         |
| `public_key`                    | 아니요   | 문자열                                 | ASCII Armor 형식의 OpenPGP 공개 키 ([예시 보기](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); 예: `support@forwardemail.net`의 GPG 키). `has_pgp`가 `true`로 설정된 경우에만 적용됨. [FAQ에서 종단 간 암호화에 대해 자세히 알아보기](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) |
| `max_quota`                     | 아니요   | 문자열                                 | 이 별칭의 저장 용량 최대 할당량. 비워두면 도메인의 현재 최대 할당량으로 재설정되며, "1 GB"와 같이 [bytes](https://github.com/visionmedia/bytes.js)로 파싱 가능한 값을 입력할 수 있음. 이 값은 도메인 관리자만 조정 가능                                                                                                                                                              |
| `vacation_responder_is_enabled` | 아니요   | 불리언                                | 자동 부재중 응답기 활성화 또는 비활성화 여부                                                                                                                                                                                                                                                                                                                                             |
| `vacation_responder_start_date` | 아니요   | 문자열                                 | 부재중 응답기 시작 날짜 (활성화되어 있고 시작 날짜가 설정되지 않은 경우 이미 시작된 것으로 간주). `MM/DD/YYYY`, `YYYY-MM-DD` 등 다양한 날짜 형식을 `dayjs`를 사용해 스마트하게 파싱하여 지원                                                                                                                                                                                     |
| `vacation_responder_end_date`   | 아니요   | 문자열                                 | 부재중 응답기 종료 날짜 (활성화되어 있고 종료 날짜가 설정되지 않은 경우 종료되지 않고 계속 응답하는 것으로 간주). `MM/DD/YYYY`, `YYYY-MM-DD` 등 다양한 날짜 형식을 `dayjs`를 사용해 스마트하게 파싱하여 지원                                                                                                                                                                         |
| `vacation_responder_subject`    | 아니요   | 문자열                                 | 부재중 응답기 제목 (평문), 예: "부재중". 모든 HTML은 `striptags`를 사용해 제거됨                                                                                                                                                                                                                                                                                                         |
| `vacation_responder_message`    | 아니요   | 문자열                                 | 부재중 응답기 메시지 (평문), 예: "2월까지 부재중입니다.". 모든 HTML은 `striptags`를 사용해 제거됨                                                                                                                                                                                                                                                                                           |
> Example Request:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### 도메인 별칭 삭제 {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> Example Request:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```


## 암호화 {#encrypt}

무료 플랜에서도 비용 없이 레코드를 암호화할 수 있습니다. 개인정보 보호는 기능이 아니라 제품의 모든 측면에 본질적으로 내장되어야 합니다. [Privacy Guides 토론](https://discuss.privacyguides.net/t/forward-email-email-provider/13370)과 [저희 GitHub 이슈](https://github.com/forwardemail/forwardemail.net/issues/254)에서 많은 요청을 받아 이를 추가했습니다.

### TXT 레코드 암호화 {#encrypt-txt-record}

> `POST /v1/encrypt`

| Body Parameter | 필수 | 유형   | 설명                                  |
| -------------- | ---- | ------ | ------------------------------------ |
| `input`        | 예   | 문자열 | 유효한 Forward Email 일반 텍스트 TXT 레코드 |

> Example Request:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
