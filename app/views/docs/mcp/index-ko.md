# Forward Email MCP 서버 {#forward-email-mcp-server}

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>요약:</strong> 저희의 <a href="https://github.com/forwardemail/mcp-server">오픈 소스 MCP 서버</a>는 Claude, ChatGPT, Cursor, Windsurf와 같은 AI 비서가 자연어를 통해 이메일, 도메인, 별칭, 연락처, 캘린더를 관리할 수 있도록 합니다. 68개의 모든 API 엔드포인트는 MCP 도구로 노출됩니다. <code>npx @forwardemail/mcp-server</code>를 통해 로컬에서 실행되며, 귀하의 자격 증명은 절대로 귀하의 컴퓨터를 벗어나지 않습니다.
</p>

## 목차 {#table-of-contents}

* [MCP란 무엇인가요?](#what-is-mcp)
* [빠른 시작](#quick-start)
  * [API 키 받기](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [기타 MCP 클라이언트](#other-mcp-clients)
* [인증](#authentication)
  * [API 키 인증](#api-key-auth)
  * [별칭 인증](#alias-auth)
  * [별칭 비밀번호 생성](#generating-an-alias-password)
* [68가지 모든 도구](#all-68-tools)
  * [계정 (API 키 또는 별칭 인증)](#account-api-key-or-alias-auth)
  * [도메인 (API 키)](#domains-api-key)
  * [별칭 (API 키)](#aliases-api-key)
  * [이메일 — 아웃바운드 SMTP (API 키; 전송은 둘 다 지원)](#emails--outbound-smtp-api-key-send-supports-both)
  * [메시지 — IMAP (별칭 인증)](#messages--imap-alias-auth)
  * [폴더 — IMAP (별칭 인증)](#folders--imap-alias-auth)
  * [연락처 — CardDAV (별칭 인증)](#contacts--carddav-alias-auth)
  * [캘린더 — CalDAV (별칭 인증)](#calendars--caldav-alias-auth)
  * [캘린더 이벤트 — CalDAV (별칭 인증)](#calendar-events--caldav-alias-auth)
  * [Sieve 스크립트 (API 키)](#sieve-scripts-api-key)
  * [Sieve 스크립트 (별칭 인증)](#sieve-scripts-alias-auth)
  * [도메인 멤버 및 초대 (API 키)](#domain-members-and-invites-api-key)
  * [캐치올 비밀번호 (API 키)](#catch-all-passwords-api-key)
  * [로그 (API 키)](#logs-api-key)
  * [암호화 (인증 없음)](#encrypt-no-auth)
* [20가지 실제 사용 사례](#20-real-world-use-cases)
* [프롬프트 예시](#example-prompts)
* [환경 변수](#environment-variables)
* [보안](#security)
* [프로그래밍 방식 사용](#programmatic-usage)
* [오픈 소스](#open-source)


## MCP란 무엇인가요? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP)은 Anthropic이 만든 개방형 표준으로, AI 모델이 외부 도구를 안전하게 호출할 수 있도록 합니다. 채팅 창에 API 응답을 복사하여 붙여넣는 대신, MCP는 모델에 서비스에 대한 직접적이고 구조화된 액세스를 제공합니다.

저희 MCP 서버는 전체 [Forward Email API](/email-api)를 래핑하여 모든 엔드포인트, 모든 매개변수를 MCP 호환 클라이언트가 사용할 수 있는 도구로 노출합니다. 서버는 stdio 전송을 사용하여 로컬 컴퓨터에서 실행됩니다. 귀하의 자격 증명은 환경 변수에 저장되며 AI 모델로 전송되지 않습니다.


## 빠른 시작 {#quick-start}

### API 키 받기 {#get-an-api-key}

1. [Forward Email 계정](/my-account/domains)에 로그인합니다.
2. **내 계정** → **보안** → **API 키**로 이동합니다.
3. 새 API 키를 생성하고 복사합니다.

### Claude Desktop {#claude-desktop}

Claude Desktop 구성 파일에 다음을 추가합니다:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "forwardemail": {
      "command": "npx",
      "args": ["-y", "@forwardemail/mcp-server"],
      "env": {
        "FORWARD_EMAIL_API_KEY": "your-api-key-here",
        "FORWARD_EMAIL_ALIAS_USER": "you@example.com",
        "FORWARD_EMAIL_ALIAS_PASSWORD": "your-generated-alias-password"
      }
    }
  }
}
```

Claude Desktop을 다시 시작합니다. 도구 선택기에서 Forward Email 도구를 볼 수 있을 것입니다.

> **참고:** `FORWARD_EMAIL_ALIAS_USER` 및 `FORWARD_EMAIL_ALIAS_PASSWORD` 변수는 선택 사항이지만 사서함 도구(메시지, 폴더, 연락처, 캘린더)에는 필수입니다. 자세한 내용은 [인증](#authentication)을 참조하십시오.

### Cursor {#cursor}

Cursor 설정 → MCP → 서버 추가를 엽니다:

```json
{
  "mcpServers": {
    "forwardemail": {
      "command": "npx",
      "args": ["-y", "@forwardemail/mcp-server"],
      "env": {
        "FORWARD_EMAIL_API_KEY": "your-api-key-here",
        "FORWARD_EMAIL_ALIAS_USER": "you@example.com",
        "FORWARD_EMAIL_ALIAS_PASSWORD": "your-generated-alias-password"
      }
    }
  }
}
```

### Windsurf {#windsurf}

Windsurf 설정 → MCP → 위와 동일한 구성으로 서버 추가를 엽니다.

### 기타 MCP 클라이언트 {#other-mcp-clients}

MCP stdio 전송을 지원하는 모든 클라이언트가 작동합니다. 명령어는 다음과 같습니다:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## 인증 {#authentication}

Forward Email API는 엔드포인트에 따라 두 가지 다른 자격 증명 유형을 사용하여 **HTTP 기본 인증**을 사용합니다. MCP 서버는 이를 자동으로 처리합니다. 올바른 자격 증명을 제공하기만 하면 됩니다.

### API 키 인증 {#api-key-auth}

대부분의 관리 엔드포인트(도메인, 별칭, 아웃바운드 이메일, 로그)는 **API 키**를 기본 인증 사용자 이름으로 사용하고 비밀번호는 비워둡니다.

이는 REST API에 사용하는 것과 동일한 API 키입니다. `FORWARD_EMAIL_API_KEY` 환경 변수를 통해 설정합니다.

### 별칭 인증 {#alias-auth}

사서함 엔드포인트(메시지, 폴더, 연락처, 캘린더, 별칭 범위 Sieve 스크립트)는 **별칭 자격 증명**을 사용합니다. 별칭 이메일 주소를 사용자 이름으로 사용하고 생성된 비밀번호를 비밀번호로 사용합니다.

이러한 엔드포인트는 IMAP, CalDAV, CardDAV 프로토콜을 통해 별칭별 데이터에 액세스합니다. 이들은 API 키가 아닌 별칭 이메일과 생성된 비밀번호를 필요로 합니다.

별칭 자격 증명은 두 가지 방법으로 제공할 수 있습니다:

1. **환경 변수** (기본 별칭에 권장): `FORWARD_EMAIL_ALIAS_USER` 및 `FORWARD_EMAIL_ALIAS_PASSWORD`를 설정합니다.
2. **도구 호출별 매개변수**: `alias_username` 및 `alias_password`를 별칭 인증 도구의 인수로 전달합니다. 이는 환경 변수를 재정의하며, 여러 별칭으로 작업할 때 유용합니다.

### 별칭 비밀번호 생성 {#generating-an-alias-password}

별칭 인증 도구를 사용하려면 먼저 별칭에 대한 비밀번호를 생성해야 합니다. `generateAliasPassword` 도구를 사용하거나 API를 통해 이 작업을 수행할 수 있습니다:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

응답에는 `username` (별칭 이메일) 및 `password` 필드가 포함됩니다. 이를 별칭 자격 증명으로 사용하십시오.

> **팁:** AI 비서에게도 요청할 수 있습니다: *"example.com 도메인의 user@example.com 별칭에 대한 비밀번호를 생성해 줘"* — 그러면 `generateAliasPassword` 도구를 호출하고 자격 증명을 반환합니다.

아래 표는 각 도구 그룹에 필요한 인증 방법을 요약합니다:

| 도구 그룹 | 인증 방법 | 자격 증명 |
|-----------|-------------|-------------|
| 계정 | API 키 **또는** 별칭 인증 | 둘 중 하나 |
| 도메인, 별칭, 도메인 멤버, 초대, 캐치올 비밀번호 | API 키 | `FORWARD_EMAIL_API_KEY` |
| 아웃바운드 이메일 (목록, 가져오기, 삭제, 제한) | API 키 | `FORWARD_EMAIL_API_KEY` |
| 이메일 전송 | API 키 **또는** 별칭 인증 | 둘 중 하나 |
| 메시지 (IMAP) | 별칭 인증 | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| 폴더 (IMAP) | 별칭 인증 | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| 연락처 (CardDAV) | 별칭 인증 | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| 캘린더 (CalDAV) | 별칭 인증 | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| 캘린더 이벤트 (CalDAV) | 별칭 인증 | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Sieve 스크립트 (도메인 범위) | API 키 | `FORWARD_EMAIL_API_KEY` |
| Sieve 스크립트 (별칭 범위) | 별칭 인증 | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| 로그 | API 키 | `FORWARD_EMAIL_API_KEY` |
| 암호화 | 없음 | 자격 증명 필요 없음 |


## 68가지 모든 도구 {#all-68-tools}

모든 도구는 [Forward Email API](/email-api) 엔드포인트에 직접 매핑됩니다. 매개변수는 API 문서와 동일한 이름을 사용합니다. 각 섹션 헤더에 인증 방법이 명시되어 있습니다.

### 계정 (API 키 또는 별칭 인증) {#account-api-key-or-alias-auth}

API 키 인증을 사용하면 사용자 계정 정보가 반환됩니다. 별칭 인증을 사용하면 저장 공간 할당량 및 설정을 포함한 별칭/사서함 정보가 반환됩니다.

| 도구 | API 엔드포인트 | 설명 |
|------|-------------|-------------|
| `getAccount` | `GET /v1/account` | 계정 정보 가져오기 |
| `updateAccount` | `PUT /v1/account` | 계정 설정 업데이트 |

### 도메인 (API 키) {#domains-api-key}

| 도구 | API 엔드포인트 | 설명 |
|------|-------------|-------------|
| `listDomains` | `GET /v1/domains` | 모든 도메인 나열 |
| `createDomain` | `POST /v1/domains` | 새 도메인 추가 |
| `getDomain` | `GET /v1/domains/:domain_id` | 도메인 세부 정보 가져오기 |
| `updateDomain` | `PUT /v1/domains/:domain_id` | 도메인 설정 업데이트 |
| `deleteDomain` | `DELETE /v1/domains/:domain_id` | 도메인 제거 |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records` | DNS 레코드 확인 |
| `verifySmtpRecords` | `GET /v1/domains/:domain_id/verify-smtp` | SMTP 구성 확인 |
| `testS3Connection` | `POST /v1/domains/:domain_id/test-s3-connection` | 사용자 지정 S3 저장소 테스트 |

### 별칭 (API 키) {#aliases-api-key}

| 도구 | API 엔드포인트 | 설명 |
|------|-------------|-------------|
| `listAliases` | `GET /v1/domains/:domain_id/aliases` | 도메인의 별칭 나열 |
| `createAlias` | `POST /v1/domains/:domain_id/aliases` | 새 별칭 생성 |
| `getAlias` | `GET /v1/domains/:domain_id/aliases/:alias_id` | 별칭 세부 정보 가져오기 |
| `updateAlias` | `PUT /v1/domains/:domain_id/aliases/:alias_id` | 별칭 업데이트 |
| `deleteAlias` | `DELETE /v1/domains/:domain_id/aliases/:alias_id` | 별칭 삭제 |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | 별칭 인증을 위한 IMAP/SMTP 비밀번호 생성 |

### 이메일 — 아웃바운드 SMTP (API 키; 전송은 둘 다 지원) {#emails--outbound-smtp-api-key-send-supports-both}

| 도구 | API 엔드포인트 | 인증 | 설명 |
|------|-------------|------|-------------|
| `sendEmail` | `POST /v1/emails` | API 키 또는 별칭 인증 | SMTP를 통해 이메일 전송 |
| `listEmails` | `GET /v1/emails` | API 키 | 아웃바운드 이메일 나열 |
| `getEmail` | `GET /v1/emails/:id` | API 키 | 이메일 세부 정보 및 상태 가져오기 |
| `deleteEmail` | `DELETE /v1/emails/:id` | API 키 | 대기 중인 이메일 삭제 |
| `getEmailLimit` | `GET /v1/emails/limit` | API 키 | 전송 제한 확인 |

`sendEmail` 도구는 `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html`, `attachments`를 허용합니다. 이는 `POST /v1/emails` 엔드포인트와 동일합니다.

### 메시지 — IMAP (별칭 인증) {#messages--imap-alias-auth}

> **별칭 자격 증명이 필요합니다.** `alias_username` 및 `alias_password`를 전달하거나 `FORWARD_EMAIL_ALIAS_USER` 및 `FORWARD_EMAIL_ALIAS_PASSWORD` 환경 변수를 설정하십시오.

| 도구 | API 엔드포인트 | 설명 |
|------|-------------|-------------|
| `listMessages` | `GET /v1/messages` | 사서함의 메시지 나열 및 검색 |
| `createMessage` | `POST /v1/messages` | 초안 생성 또는 메시지 업로드 |
| `getMessage` | `GET /v1/messages/:id` | ID로 메시지 가져오기 |
| `updateMessage` | `PUT /v1/messages/:id` | 플래그 업데이트 (읽음, 별표 표시 등) |
| `deleteMessage` | `DELETE /v1/messages/:id` | 메시지 삭제 |

`listMessages` 도구는 `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread`, `has_attachment`를 포함한 15개 이상의 검색 매개변수를 지원합니다. 전체 목록은 [API 문서](/email-api)를 참조하십시오.

### 폴더 — IMAP (별칭 인증) {#folders--imap-alias-auth}

> **별칭 자격 증명이 필요합니다.** `alias_username` 및 `alias_password`를 전달하거나 `FORWARD_EMAIL_ALIAS_USER` 및 `FORWARD_EMAIL_ALIAS_PASSWORD` 환경 변수를 설정하십시오.

| 도구 | API 엔드포인트 | 설명 |
|------|-------------|-------------|
| `listFolders` | `GET /v1/folders` | 모든 사서함 폴더 나열 |
| `createFolder` | `POST /v1/folders` | 새 폴더 생성 |
| `getFolder` | `GET /v1/folders/:id` | 폴더 세부 정보 가져오기 |
| `updateFolder` | `PUT /v1/folders/:id` | 폴더 이름 변경 |
| `deleteFolder` | `DELETE /v1/folders/:id` | 폴더 삭제 |

### 연락처 — CardDAV (별칭 인증) {#contacts--carddav-alias-auth}

> **별칭 자격 증명이 필요합니다.** `alias_username` 및 `alias_password`를 전달하거나 `FORWARD_EMAIL_ALIAS_USER` 및 `FORWARD_EMAIL_ALIAS_PASSWORD` 환경 변수를 설정하십시오.

| 도구 | API 엔드포인트 | 설명 |
|------|-------------|-------------|
| `listContacts` | `GET /v1/contacts` | 모든 연락처 나열 |
| `createContact` | `POST /v1/contacts` | 새 연락처 생성 |
| `getContact` | `GET /v1/contacts/:id` | 연락처 세부 정보 가져오기 |
| `updateContact` | `PUT /v1/contacts/:id` | 연락처 업데이트 |
| `deleteContact` | `DELETE /v1/contacts/:id` | 연락처 삭제 |

### 캘린더 — CalDAV (별칭 인증) {#calendars--caldav-alias-auth}

> **별칭 자격 증명이 필요합니다.** `alias_username` 및 `alias_password`를 전달하거나 `FORWARD_EMAIL_ALIAS_USER` 및 `FORWARD_EMAIL_ALIAS_PASSWORD` 환경 변수를 설정하십시오.

| 도구 | API 엔드포인트 | 설명 |
|------|-------------|-------------|
| `listCalendars` | `GET /v1/calendars` | 모든 캘린더 나열 |
| `createCalendar` | `POST /v1/calendars` | 새 캘린더 생성 |
| `getCalendar` | `GET /v1/calendars/:id` | 캘린더 세부 정보 가져오기 |
| `updateCalendar` | `PUT /v1/calendars/:id` | 캘린더 업데이트 |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | 캘린더 삭제 |

### 캘린더 이벤트 — CalDAV (별칭 인증) {#calendar-events--caldav-alias-auth}

> **별칭 자격 증명이 필요합니다.** `alias_username` 및 `alias_password`를 전달하거나 `FORWARD_EMAIL_ALIAS_USER` 및 `FORWARD_EMAIL_ALIAS_PASSWORD` 환경 변수를 설정하십시오.

| 도구 | API 엔드포인트 | 설명 |
|------|-------------|-------------|
| `listCalendarEvents` | `GET /v1/calendar-events` | 모든 이벤트 나열 |
| `createCalendarEvent` | `POST /v1/calendar-events` | 새 이벤트 생성 |
| `getCalendarEvent` | `GET /v1/calendar-events/:id` | 이벤트 세부 정보 가져오기 |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id` | 이벤트 업데이트 |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | 이벤트 삭제 |

### Sieve 스크립트 (API 키) {#sieve-scripts-api-key}

이들은 도메인 범위 경로를 사용하며 API 키로 인증합니다.

| 도구 | API 엔드포인트 | 설명 |
|------|-------------|-------------|
| `listSieveScripts` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve` | 별칭에 대한 스크립트 나열 |
| `createSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve` | 새 스크립트 생성 |
| `getSieveScript` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | 스크립트 세부 정보 가져오기 |
| `updateSieveScript` | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | 스크립트 업데이트 |
| `deleteSieveScript` | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | 스크립트 삭제 |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | 스크립트 활성화 |

### Sieve 스크립트 (별칭 인증) {#sieve-scripts-alias-auth}

이들은 별칭 수준 인증을 사용합니다. API 키 없이 별칭별 자동화에 유용합니다.

> **별칭 자격 증명이 필요합니다.** `alias_username` 및 `alias_password`를 전달하거나 `FORWARD_EMAIL_ALIAS_USER` 및 `FORWARD_EMAIL_ALIAS_PASSWORD` 환경 변수를 설정하십시오.

| 도구 | API 엔드포인트 | 설명 |
|------|-------------|-------------|
| `listSieveScriptsAliasAuth` | `GET /v1/sieve-scripts` | 스크립트 나열 |
| `createSieveScriptAliasAuth` | `POST /v1/sieve-scripts` | 스크립트 생성 |
| `getSieveScriptAliasAuth` | `GET /v1/sieve-scripts/:script_id` | 스크립트 세부 정보 가져오기 |
| `updateSieveScriptAliasAuth` | `PUT /v1/sieve-scripts/:script_id` | 스크립트 업데이트 |
| `deleteSieveScriptAliasAuth` | `DELETE /v1/sieve-scripts/:script_id` | 스크립트 삭제 |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | 스크립트 활성화 |

### 도메인 멤버 및 초대 (API 키) {#domain-members-and-invites-api-key}

| 도구 | API 엔드포인트 | 설명 |
|------|-------------|-------------|
| `updateDomainMember` | `PUT /v1/domains/:domain_id/members/:member_id` | 멤버 역할 변경 |
| `removeDomainMember` | `DELETE /v1/domains/:domain_id/members/:member_id` | 멤버 제거 |
| `acceptDomainInvite` | `GET /v1/domains/:domain_id/invites` | 보류 중인 초대 수락 |
| `createDomainInvite` | `POST /v1/domains/:domain_id/invites` | 도메인에 사용자 초대 |
| `removeDomainInvite` | `DELETE /v1/domains/:domain_id/invites` | 초대 취소 |

### 캐치올 비밀번호 (API 키) {#catch-all-passwords-api-key}

| 도구 | API 엔드포인트 | 설명 |
|------|-------------|-------------|
| `listCatchAllPasswords` | `GET /v1/domains/:domain_id/catch-all-passwords` | 캐치올 비밀번호 나열 |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords` | 캐치올 비밀번호 생성 |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | 캐치올 비밀번호 삭제 |

### 로그 (API 키) {#logs-api-key}

| 도구 | API 엔드포인트 | 설명 |
|------|-------------|-------------|
| `downloadLogs` | `GET /v1/logs/download` | 이메일 전송 로그 다운로드 |

### 암호화 (인증 없음) {#encrypt-no-auth}

| 도구 | API 엔드포인트 | 설명 |
|------|-------------|-------------|
| `encryptRecord` | `POST /v1/encrypt` | DNS TXT 레코드 암호화 |

이 도구는 인증이 필요하지 않습니다. `forward-email=user@example.com`과 같은 전달 레코드를 DNS TXT 레코드에 사용하기 위해 암호화합니다.


## 20가지 실제 사용 사례 {#20-real-world-use-cases}

다음은 AI 비서와 MCP 서버를 사용하는 실용적인 방법입니다:

### 1. 이메일 분류 {#email-triage}

AI에게 받은 편지함을 스캔하고 읽지 않은 메시지를 요약해달라고 요청합니다. 긴급 이메일을 표시하고, 발신자별로 분류하고, 답장을 작성할 수 있습니다. 이 모든 것이 자연어를 통해 이루어집니다. *(받은 편지함 액세스를 위해 별칭 자격 증명 필요)*

### 2. 도메인 설정 자동화 {#domain-setup-automation}

새 도메인을 설정하시나요? AI에게 도메인을 생성하고, 별칭을 추가하고, DNS 레코드를 확인하고, SMTP 구성을 테스트해달라고 요청합니다. 일반적으로 대시보드를 클릭하는 데 10분이 걸리던 작업이 한 번의 대화로 해결됩니다.

### 3. 대량 별칭 관리 {#bulk-alias-management}

새 프로젝트를 위해 20개의 별칭을 생성해야 하나요? 필요한 것을 설명하면 AI가 반복적인 작업을 처리합니다. 별칭을 생성하고, 전달 규칙을 설정하고, 비밀번호를 한 번에 생성할 수 있습니다.

### 4. 이메일 캠페인 모니터링 {#email-campaign-monitoring}

AI에게 전송 제한을 확인하고, 최근 아웃바운드 이메일을 나열하고, 전송 상태를 보고해달라고 요청합니다. 트랜잭션 이메일 상태를 모니터링하는 데 유용합니다.

### 5. 연락처 동기화 및 정리 {#contact-sync-and-cleanup}

CardDAV 도구를 사용하여 모든 연락처를 나열하고, 중복을 찾고, 오래된 정보를 업데이트하거나, 채팅에 붙여넣은 스프레드시트에서 연락처를 대량으로 생성합니다. *(별칭 자격 증명 필요)*

### 6. 캘린더 관리 {#calendar-management}

캘린더를 생성하고, 이벤트를 추가하고, 회의 시간을 업데이트하고, 취소된 이벤트를 삭제하는 모든 작업을 대화를 통해 수행합니다. CalDAV 도구는 캘린더와 이벤트 모두에 대한 완전한 CRUD를 지원합니다. *(별칭 자격 증명 필요)*

### 7. Sieve 스크립트 자동화 {#sieve-script-automation}

Sieve 스크립트는 강력하지만 구문이 난해합니다. AI에게 Sieve 스크립트를 작성해달라고 요청합니다: "billing@example.com에서 오는 모든 이메일을 Billing 폴더로 필터링해 줘"는 RFC 5228 사양을 건드리지 않고도 작동하는 스크립트가 됩니다.

### 8. 팀 온보딩 {#team-onboarding}

새 팀원이 합류하면 AI에게 별칭을 생성하고, 비밀번호를 생성하고, 자격 증명이 포함된 환영 이메일을 보내고, 도메인 멤버로 추가해달라고 요청합니다. 한 번의 프롬프트로 네 번의 API 호출이 이루어집니다.

### 9. 보안 감사 {#security-auditing}

AI에게 모든 도메인을 나열하고, DNS 확인 상태를 확인하고, 별칭 구성을 검토하고, 확인되지 않은 레코드가 있는 도메인을 식별해달라고 요청합니다. 자연어로 빠른 보안 점검을 수행합니다.

### 10. 이메일 전달 설정 {#email-forwarding-setup}

새 도메인에 대한 이메일 전달을 설정하시나요? AI에게 도메인을 생성하고, 전달 별칭을 추가하고, DNS 레코드를 암호화하고, 모든 것이 올바르게 구성되었는지 확인해달라고 요청합니다.

### 11. 받은 편지함 검색 및 분석 {#inbox-search-and-analysis}

메시지 검색 도구를 사용하여 특정 이메일을 찾습니다: "지난 30일 동안 john@example.com에서 온 첨부 파일이 있는 모든 이메일을 찾아 줘." 15개 이상의 검색 매개변수가 이를 강력하게 만듭니다. *(별칭 자격 증명 필요)*

### 12. 폴더 구성 {#folder-organization}

AI에게 새 프로젝트를 위한 폴더 구조를 생성하고, 폴더 간에 메시지를 이동하거나, 더 이상 필요 없는 오래된 폴더를 정리해달라고 요청합니다. *(별칭 자격 증명 필요)*

### 13. 비밀번호 순환 {#password-rotation}

정기적으로 새 별칭 비밀번호를 생성합니다. AI에게 각 별칭에 대한 새 비밀번호를 생성하고 새 자격 증명을 보고해달라고 요청합니다.

### 14. DNS 레코드 암호화 {#dns-record-encryption}

DNS에 추가하기 전에 전달 레코드를 암호화합니다. `encryptRecord` 도구는 인증 없이 이 작업을 처리합니다. 빠른 일회성 암호화에 유용합니다.

### 15. 전송 로그 분석 {#delivery-log-analysis}

이메일 전송 로그를 다운로드하고 AI에게 반송률을 분석하고, 문제가 있는 수신자를 식별하거나, 전송 시간을 추적해달라고 요청합니다.

### 16. 다중 도메인 관리 {#multi-domain-management}

여러 도메인을 관리하는 경우 AI에게 상태 보고서를 요청합니다: 어떤 도메인이 확인되었는지, 어떤 문제가 있는지, 각 도메인에 몇 개의 별칭이 있는지, 전송 제한은 어떤지 등.

### 17. 캐치올 구성 {#catch-all-configuration}

어떤 주소로든 이메일을 받아야 하는 도메인에 대한 캐치올 비밀번호를 설정합니다. AI가 이러한 비밀번호를 생성, 나열 및 관리할 수 있습니다.

### 18. 도메인 초대 관리 {#domain-invite-management}

팀원을 초대하여 도메인을 관리하고, 보류 중인 초대를 확인하고, 만료된 초대를 정리합니다. 여러 도메인 관리자가 있는 조직에 유용합니다.

### 19. S3 저장소 테스트 {#s3-storage-testing}

이메일 백업을 위해 사용자 지정 S3 저장소를 사용하는 경우 AI에게 연결을 테스트하고 올바르게 작동하는지 확인해달라고 요청합니다.

### 20. 이메일 초안 작성 {#email-draft-composition}

보내지 않고 사서함에 이메일 초안을 작성합니다. 보내기 전에 검토가 필요한 이메일을 준비하거나 이메일 템플릿을 만드는 데 유용합니다. *(별칭 자격 증명 필요)*


## 프롬프트 예시 {#example-prompts}

AI 비서와 직접 사용할 수 있는 프롬프트는 다음과 같습니다:

**이메일 전송:**
> "hello@mydomain.com에서 john@example.com으로 '내일 회의'라는 제목과 '존, 우리 내일 오후 2시에 만날 건가요?'라는 본문으로 이메일을 보내 줘."

**도메인 관리:**
> "내 모든 도메인을 나열하고 DNS 레코드가 확인되지 않은 도메인을 알려 줘."

**별칭 생성:**
> "내 개인 이메일로 전달되는 support@mydomain.com이라는 새 별칭을 만들어 줘."

**받은 편지함 검색 (별칭 자격 증명 필요):**
> "지난주에 '송장'을 언급한 읽지 않은 모든 이메일을 찾아 줘."

**캘린더 (별칭 자격 증명 필요):**
> "'업무'라는 캘린더를 만들고 내일 오후 2시에 '팀 스탠드업'이라는 회의를 추가해 줘."

**Sieve 스크립트:**
> "info@mydomain.com에 대한 Sieve 스크립트를 작성해 줘. '연락해 주셔서 감사합니다. 24시간 이내에 회신드리겠습니다.'라는 내용으로 이메일에 자동 답장하도록 해 줘."

**대량 작업:**
> "mydomain.com에 sales@, support@, billing@, info@ 별칭을 만들고 모두 team@mydomain.com으로 전달되도록 해 줘."

**보안 점검:**
> "내 모든 도메인의 DNS 및 SMTP 확인 상태를 확인하고 주의가 필요한 사항이 있는지 알려 줘."

**별칭 비밀번호 생성:**
> "내 받은 편지함에 액세스할 수 있도록 user@example.com 별칭에 대한 비밀번호를 생성해 줘."


## 환경 변수 {#environment-variables}

| 변수 | 필수 | 기본값 | 설명 |
|----------|----------|---------|-------------|
| `FORWARD_EMAIL_API_KEY` | 예 | — | Forward Email API 키 (API 키 엔드포인트에 대한 기본 인증 사용자 이름으로 사용됨) |
| `FORWARD_EMAIL_ALIAS_USER` | 아니요 | — | 사서함 엔드포인트에 대한 별칭 이메일 주소 (예: `user@example.com`) |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | 아니요 | — | 사서함 엔드포인트에 대한 생성된 별칭 비밀번호 |
| `FORWARD_EMAIL_API_URL` | 아니요 | `https://api.forwardemail.net` | API 기본 URL (자체 호스팅 또는 테스트용) |


## 보안 {#security}

MCP 서버는 로컬 컴퓨터에서 실행됩니다. 보안 작동 방식은 다음과 같습니다:

*   **자격 증명은 로컬에 유지됩니다.** API 키와 별칭 자격 증명 모두 환경 변수에서 읽어와 HTTP 기본 인증을 통해 API 요청을 인증하는 데 사용됩니다. AI 모델로 전송되지 않습니다.
*   **stdio 전송.** 서버는 stdin/stdout을 통해 AI 클라이언트와 통신합니다. 네트워크 포트가 열리지 않습니다.
*   **데이터 저장 없음.** 서버는 상태 비저장입니다. 이메일 데이터를 캐시, 로깅 또는 저장하지 않습니다.
*   **오픈 소스.** 전체 코드베이스는 [GitHub](https://github.com/forwardemail/mcp-server)에 있습니다. 모든 줄을 감사할 수 있습니다.


## 프로그래밍 방식 사용 {#programmatic-usage}

서버를 라이브러리로도 사용할 수 있습니다:

```js
const { McpServer } = require('@forwardemail/mcp-server');

const server = new McpServer({
  apiKey: 'your-api-key',
  aliasUser: 'user@example.com',
  aliasPassword: 'generated-alias-password',
});

server.listen();
```


## 오픈 소스 {#open-source}

Forward Email MCP 서버는 BUSL-1.1 라이선스에 따라 [GitHub에서 오픈 소스](https://github.com/forwardemail/mcp-server)로 제공됩니다. 우리는 투명성을 믿습니다. 버그를 발견하거나 기능을 원하시면 [이슈를 열어주세요](https://github.com/forwardemail/mcp-server/issues).
