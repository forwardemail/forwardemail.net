# 개인정보 처리방침 {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email privacy policy" class="rounded-lg" />


## 목차 {#table-of-contents}

* [면책 조항](#disclaimer)
* [수집하지 않는 정보](#information-not-collected)
* [수집하는 정보](#information-collected)
  * [계정 정보](#account-information)
  * [이메일 저장](#email-storage)
  * [오류 로그](#error-logs)
  * [발신 SMTP 이메일](#outbound-smtp-emails)
* [임시 데이터 처리](#temporary-data-processing)
  * [속도 제한](#rate-limiting)
  * [연결 추적](#connection-tracking)
  * [인증 시도](#authentication-attempts)
* [감사 로그](#audit-logs)
  * [계정 변경](#account-changes)
  * [도메인 설정 변경](#domain-settings-changes)
* [쿠키 및 세션](#cookies-and-sessions)
* [분석](#analytics)
* [공유된 정보](#information-shared)
* [정보 삭제](#information-removal)
* [추가 공개 사항](#additional-disclosures)


## 면책 조항 {#disclaimer}

사이트 전반에 적용되는 사항은 당사의 [이용 약관](/terms)을 참고해 주시기 바랍니다.


## 수집하지 않는 정보 {#information-not-collected}

**[오류 로그](#error-logs), [발신 SMTP 이메일](#outbound-smtp-emails), 그리고 스팸 또는 악성 활동이 감지될 때(예: 속도 제한을 위해)를 제외하고:**

* 전달된 이메일을 디스크 저장소나 데이터베이스에 저장하지 않습니다.
* 전달된 이메일에 대한 메타데이터를 디스크 저장소나 데이터베이스에 저장하지 않습니다.
* 로그나 IP 주소를 디스크 저장소나 데이터베이스에 저장하지 않습니다.
* 제3자 분석 또는 원격 측정 서비스를 사용하지 않습니다.


## 수집하는 정보 {#information-collected}

투명성을 위해 언제든지 <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">소스 코드를 확인</a>하여 아래 정보가 어떻게 수집되고 사용되는지 볼 수 있습니다.

**기능 제공 및 서비스 개선을 위해 엄격히 다음 정보를 안전하게 수집 및 저장합니다:**

### 계정 정보 {#account-information}

* 제공하신 이메일 주소를 저장합니다.
* 제공하신 도메인 이름, 별칭, 구성 정보를 저장합니다.
* 이메일이나 <a href="/help">도움말</a> 페이지를 통해 자발적으로 제공하신 추가 정보(예: 의견이나 질문)를 저장합니다.

**가입 출처 정보** (계정에 영구 저장):

계정을 생성할 때 사용자가 서비스를 어떻게 찾았는지 이해하기 위해 다음 정보를 저장합니다:

* 참조 웹사이트 도메인(전체 URL 아님)
* 사이트에서 처음 방문한 페이지
* URL에 있는 경우 UTM 캠페인 매개변수

### 이메일 저장 {#email-storage}

* IMAP/POP3/CalDAV/CardDAV 접근 및 메일박스 기능을 위해 [암호화된 SQLite 데이터베이스](/blog/docs/best-quantum-safe-encrypted-email-service)에 이메일 및 캘린더 정보를 저장합니다.
  * 이메일 전달 서비스만 사용하는 경우, [수집하지 않는 정보](#information-not-collected)에서 설명한 대로 이메일을 디스크나 데이터베이스에 저장하지 않습니다.
  * 이메일 전달 서비스는 메모리 내에서만 작동하며(디스크 저장소나 데이터베이스에 기록하지 않음) 운영됩니다.
  * IMAP/POP3/CalDAV/CardDAV 저장소는 저장 시 암호화, 전송 시 암호화되며 LUKS 암호화 디스크에 저장됩니다.
  * IMAP/POP3/CalDAV/CardDAV 저장소 백업은 저장 시 암호화, 전송 시 암호화되며 [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/)에 저장됩니다.

### 오류 로그 {#error-logs}

* `4xx` 및 `5xx` SMTP 응답 코드 [오류 로그](/faq#do-you-store-error-logs)를 7일간 저장합니다.
* 오류 로그에는 SMTP 오류, 봉투, 이메일 헤더가 포함되며(이메일 본문이나 첨부파일은 저장하지 않습니다).
* 오류 로그에는 디버깅 목적으로 발신 서버의 IP 주소 및 호스트명이 포함될 수 있습니다.
* [속도 제한](/faq#do-you-have-rate-limiting) 및 [그레이리스트](/faq#do-you-have-a-greylist) 오류 로그는 연결이 조기에 종료되어(예: `RCPT TO` 및 `MAIL FROM` 명령 전) 접근할 수 없습니다.
### 아웃바운드 SMTP 이메일 {#outbound-smtp-emails}

* 우리는 [아웃바운드 SMTP 이메일](/faq#do-you-support-sending-email-with-smtp)을 약 30일간 저장합니다.
  * 이 기간은 "Date" 헤더에 따라 달라지며, 미래의 "Date" 헤더가 있을 경우 미래에 이메일을 보낼 수 있도록 허용합니다.
  * **이메일이 성공적으로 전달되거나 영구 오류가 발생하면 메시지 본문은 삭제 및 정리됩니다.**
  * 성공적인 전달 또는 영구 오류 후 기본값인 0일보다 더 오래 아웃바운드 SMTP 이메일 메시지 본문을 보관하려면 도메인의 고급 설정에서 `0`에서 `30` 사이의 값을 입력하세요.
  * 일부 사용자는 [내 계정 > 이메일](/my-account/emails) 미리보기 기능을 사용하여 이메일 렌더링을 확인하는 것을 선호하므로, 구성 가능한 보존 기간을 지원합니다.
  * 또한 [OpenPGP/E2EE](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)도 지원합니다.


## 임시 데이터 처리 {#temporary-data-processing}

다음 데이터는 메모리 또는 Redis에서 임시로 처리되며 **영구적으로 저장되지 않습니다**:

### 속도 제한 {#rate-limiting}

* IP 주소는 속도 제한 목적으로 Redis에 임시로 사용됩니다.
* 속도 제한 데이터는 자동으로 만료됩니다(일반적으로 24시간 이내).
* 이는 남용을 방지하고 서비스의 공정한 사용을 보장합니다.

### 연결 추적 {#connection-tracking}

* 동시 연결 수는 IP 주소별로 Redis에서 추적됩니다.
* 이 데이터는 연결이 종료되거나 짧은 시간 초과 후 자동으로 만료됩니다.
* 연결 남용을 방지하고 서비스 가용성을 보장하는 데 사용됩니다.

### 인증 시도 {#authentication-attempts}

* 실패한 인증 시도는 IP 주소별로 Redis에서 추적됩니다.
* 이 데이터는 자동으로 만료됩니다(일반적으로 24시간 이내).
* 사용자 계정에 대한 무차별 대입 공격을 방지하는 데 사용됩니다.


## 감사 로그 {#audit-logs}

계정 및 도메인을 모니터링하고 보안을 강화하기 위해 특정 변경 사항에 대해 감사 로그를 유지합니다. 이 로그는 계정 소유자 및 도메인 관리자에게 알림 이메일을 보내는 데 사용됩니다.

### 계정 변경 사항 {#account-changes}

* 중요한 계정 설정 변경 사항(예: 이중 인증, 표시 이름, 시간대)을 추적합니다.
* 변경 사항이 감지되면 등록된 이메일 주소로 알림 이메일을 보냅니다.
* 민감한 필드(예: 비밀번호, API 토큰, 복구 키)는 추적하지만 알림에서는 값이 가려집니다.
* 알림 이메일 발송 후 감사 로그 항목은 삭제됩니다.

### 도메인 설정 변경 사항 {#domain-settings-changes}

여러 관리자가 있는 도메인의 경우, 팀이 구성 변경 사항을 추적할 수 있도록 상세한 감사 로그를 제공합니다:

**추적 항목:**

* 도메인 설정 변경 사항(예: 바운스 웹훅, 스팸 필터링, DKIM 구성)
* 변경을 수행한 사용자(사용자 이메일 주소)
* 변경 시각(타임스탬프)
* 변경이 이루어진 IP 주소
* 브라우저/클라이언트 사용자 에이전트 문자열

**작동 방식:**

* 모든 도메인 관리자는 설정 변경 시 단일 통합 이메일 알림을 받습니다.
* 알림에는 변경 사항별로 사용자, IP 주소, 타임스탬프가 포함된 표가 포함됩니다.
* 민감한 필드(예: 웹훅 키, API 토큰, DKIM 개인 키)는 추적하지만 값은 가려집니다.
* 사용자 에이전트 정보는 접을 수 있는 "기술 세부 정보" 섹션에 포함됩니다.
* 알림 이메일 발송 후 감사 로그 항목은 삭제됩니다.

**수집 이유:**

* 도메인 관리자가 보안 감독을 유지하도록 지원
* 팀이 누가 구성 변경을 했는지 감사할 수 있도록 지원
* 예상치 못한 변경 발생 시 문제 해결 지원
* 공유 도메인 관리에 대한 책임성 제공


## 쿠키 및 세션 {#cookies-and-sessions}

* 웹사이트 트래픽을 위해 세션에 쿠키를 저장합니다.
* 쿠키는 HTTP 전용이며 서명되고 SameSite 보호를 사용합니다.
* 세션 쿠키는 30일간 비활성 상태일 때 만료됩니다.
* 봇이나 크롤러에 대해서는 세션을 생성하지 않습니다.
* 쿠키는 다음 용도로 사용됩니다:
  * 인증 및 로그인 상태
  * 이중 인증 "기억하기" 기능
  * 플래시 메시지 및 알림
## Analytics {#analytics}

우리는 서비스 사용 방식을 이해하기 위해 자체적인 개인정보 보호 중심의 분석 시스템을 사용합니다. 이 시스템은 개인정보 보호를 핵심 원칙으로 설계되었습니다:

**수집하지 않는 항목:**

* IP 주소를 저장하지 않습니다
* 분석을 위해 쿠키나 지속 식별자를 사용하지 않습니다
* 제3자 분석 서비스를 사용하지 않습니다
* 사용자들을 일별 또는 세션별로 추적하지 않습니다

**수집하는 항목 (익명화됨):**

* 집계된 페이지 조회수 및 서비스 사용량 (SMTP, IMAP, POP3, API 등)
* 브라우저 및 운영 체제 유형 (사용자 에이전트에서 파싱, 원본 데이터는 폐기)
* 기기 유형 (데스크톱, 모바일, 태블릿)
* 리퍼러 도메인 (전체 URL 아님)
* 메일 프로토콜용 이메일 클라이언트 유형 (예: Thunderbird, Outlook)

**데이터 보존:**

* 분석 데이터는 30일 후 자동 삭제됩니다
* 세션 식별자는 매일 변경되며 일별로 사용자를 추적하는 데 사용할 수 없습니다


## Information Shared {#information-shared}

우리는 귀하의 정보를 제3자와 공유하지 않습니다.

법원의 명령에 따른 법적 요청이 있을 경우 준수할 수 있으나 ([정보 미수집 항목](#information-not-collected)에서 언급한 정보를 수집하지 않으므로) 처음부터 제공할 수 없음을 유의해 주십시오.


## Information Removal {#information-removal}

언제든지 제공하신 정보를 삭제하고 싶으시면 <a href="/my-account/security">내 계정 > 보안</a>으로 이동하여 "계정 삭제"를 클릭하세요.

악용 방지 및 완화를 위해, 첫 결제 후 5일 이내에 계정을 삭제할 경우 관리자에 의한 수동 삭제 검토가 필요할 수 있습니다.

이 과정은 보통 24시간 이내에 완료되며, 사용자가 서비스를 스팸으로 악용한 후 신속히 계정을 삭제하여 Stripe에서 결제 수단 지문을 차단하지 못하는 문제를 방지하기 위해 도입되었습니다.


## Additional Disclosures {#additional-disclosures}

이 사이트는 Cloudflare에 의해 보호되며, [개인정보 보호정책](https://www.cloudflare.com/privacypolicy/) 및 [서비스 약관](https://www.cloudflare.com/website-terms/)이 적용됩니다.
