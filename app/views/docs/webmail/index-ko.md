# Forward Email 웹메일 가이드 {#forward-email-webmail-guide}

<p class="lead mt-3">
  <strong>요약:</strong> <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">웹메일</a>은 메일을 읽고 보내는 곳입니다. <a href="/my-account/domains">웹 대시보드</a>는 도메인, 별칭, 비밀번호를 설정하는 곳입니다. 웹메일에는 별칭 주소와 대시보드에서 생성한 비밀번호로 로그인합니다. 웹메일은 무료이며 <a href="/faq#do-you-offer-a-webmail-client">오픈 소스</a>이고, 같은 앱이 브라우저, 데스크톱, 모바일, 터미널에서 실행됩니다.
</p>


## 목차 {#table-of-contents}

* [웹메일을 받을 수 있는 곳](#where-to-get-webmail)
* [웹메일과 웹 대시보드](#webmail-and-the-web-dashboard)
* [로그인](#signing-in)
  * [별칭 비밀번호 생성](#generate-an-alias-password)
  * [웹메일에 로그인](#sign-in-to-webmail)
* [여러 계정 사용](#using-more-than-one-account)
  * [로그인한 다른 계정으로 보내기](#send-as-another-signed-in-account)
* [도메인의 모든 주소에서 보내기](#send-from-any-address-on-your-domain)
  * [1단계: 대시보드에서 catch-all 비밀번호 생성](#step-1-generate-a-catch-all-password-in-the-dashboard)
  * [2단계: 웹메일에 저장](#step-2-save-it-in-webmail)
  * [3단계: 메일 작성 시 주소 선택](#step-3-pick-the-address-when-you-compose)
  * [catch-all 발송에 대해 알아둘 점](#what-to-know-about-catch-all-sending)
* [웹메일 설정 한눈에 보기](#webmail-settings-at-a-glance)
* [개인정보 보호와 App Lock](#privacy-and-app-lock)
* [문제 해결](#troubleshooting)


## 웹메일을 받을 수 있는 곳 {#where-to-get-webmail}

| 플랫폼                         | 위치                                                                                                                       |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| 브라우저                       | <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a> (설치 필요 없음) |
| 데스크톱 (macOS, Windows, Linux) | <a href="/download">다운로드 페이지</a>                                                                                     |
| 모바일 (Android, iOS)          | <a href="/download">다운로드 페이지</a>                                                                                     |
| 터미널                         | `forwardemail` 명령. [터미널 앱이 있나요](/faq#do-you-have-a-terminal-app)를 참고하세요                                     |

모두 같은 오픈 소스 프로젝트로 만들어지므로 이 가이드의 내용은 모든 플랫폼에 적용됩니다. 설정과 저장된 비밀번호는 기기마다 따로 보관되므로, 사용하는 모든 기기에서 각각 설정하세요.


## 웹메일과 웹 대시보드 {#webmail-and-the-web-dashboard}

Forward Email에는 로그인하는 곳이 두 군데 있으며, 서로 다른 자격 증명을 사용합니다.

|                       | 웹 대시보드 (forwardemail.net)                                                    | 웹메일 (mail.forwardemail.net 및 앱)                                  |
| --------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| **로그인 방법**       | Forward Email 계정 이메일과 비밀번호 (및 2FA 또는 패스키)                         | 별칭 주소 (예: `you@example.com`)와 생성된 비밀번호                   |
| **용도**              | 도메인 추가, DNS, 별칭, 결제, 팀원, 비밀번호 생성, 고급 설정                      | 메일 읽기 및 보내기, 폴더, 라벨, 검색, 캘린더, 연락처, 필터           |
| **여기서 만드는 비밀번호** | 별칭 비밀번호와 catch-all 비밀번호                                           | 없음. 웹메일은 대시보드에서 만든 비밀번호를 사용합니다                |

일반적인 설정 순서는 다음과 같습니다.

1. 대시보드에서 도메인을 추가하고 DNS를 설정합니다.
2. IMAP 저장소를 켠 별칭을 만듭니다 (예: `you@example.com`).
3. 그 별칭의 비밀번호를 생성합니다.
4. 그 별칭과 비밀번호로 웹메일에 로그인합니다.

메일을 보내려면 다른 이메일 클라이언트와 마찬가지로 <a href="/my-account/domains">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 고급 설정 <i class="fa fa-angle-right"></i> 아웃바운드 SMTP 구성에서 도메인의 발신 SMTP도 켜야 합니다.


## 로그인 {#signing-in}

### 별칭 비밀번호 생성 {#generate-an-alias-password}

1. <a href="/my-account/domains">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 별칭으로 이동합니다.
2. 별칭 옆의 **비밀번호 생성**을 클릭합니다.
3. 비밀번호를 복사합니다. 비밀번호는 한 번만 표시됩니다.

이 비밀번호는 IMAP, POP3, SMTP, CalDAV, CardDAV에 사용하는 것과 같은 비밀번호입니다. 웹 대시보드 로그인에는 사용할 수 없습니다.

### 웹메일에 로그인 {#sign-in-to-webmail}

웹메일을 열고 전체 별칭 주소와 생성된 비밀번호를 입력하세요. 먼저 둘러보기만 하고 싶다면 로그인 화면에서 데모를 사용해 보세요.


## 여러 계정 사용 {#using-more-than-one-account}

다른 도메인의 별칭이라도 여러 별칭에 동시에 로그인할 수 있습니다. 계정 메뉴에서 계정을 전환하고, **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Your accounts**에서 관리하세요. 계정은 추가한 기기에만 보관되며 동기화되지 않습니다.

### 로그인한 다른 계정으로 보내기 {#send-as-another-signed-in-account}

메일을 작성할 때 **From** 메뉴에 이 기기에서 로그인한 모든 계정이 표시됩니다. 하나를 선택하면 그 주소로 보냅니다. 메시지는 그 계정의 비밀번호로 전송되며, 사본은 그 계정의 보낸편지함(Sent)에 저장됩니다.


## 도메인의 모든 주소에서 보내기 {#send-from-any-address-on-your-domain}

도메인을 소유하고 있다면 주소마다 별칭을 만들고 로그인하지 않아도 `billing@example.com`이나 `no-reply@example.com` 같은 도메인의 모든 주소에서 메일을 보낼 수 있습니다. 이를 위해 도메인의 **catch-all 비밀번호**를 사용합니다.

웹메일에 와일드카드나 catch-all 계정으로 로그인하는 것이 **아니며**, 따로 켜야 하는 기능도 없습니다. 웹메일 설정에 catch-all 비밀번호를 한 번 저장하면, **From** 메뉴에서 그 도메인의 아무 주소나 입력할 수 있습니다.

### 1단계: 대시보드에서 catch-all 비밀번호 생성 {#step-1-generate-a-catch-all-password-in-the-dashboard}

1. <a href="/my-account/domains">내 계정 <i class="fa fa-angle-right"></i> 도메인</a>으로 이동해 도메인을 선택합니다.
2. **고급 설정**을 열고 **포괄적인 비밀번호** 항목을 찾습니다.
3. **비밀번호 생성**을 클릭합니다. 입력란을 비워 두면 강력한 무작위 비밀번호가 생성되며, 원하면 설명을 추가할 수 있습니다 (예: "노트북의 웹메일").
4. 비밀번호를 복사합니다. 비밀번호는 한 번만 표시됩니다.

이 항목을 보려면 도메인 관리자여야 합니다. 나중에 같은 곳의 **비밀번호 관리**에서 catch-all 비밀번호를 확인하거나 삭제할 수 있습니다. 삭제하면 저장된 모든 곳에서 더 이상 작동하지 않습니다.

### 2단계: 웹메일에 저장 {#step-2-save-it-in-webmail}

1. 웹메일에서 **Settings <i class="fa fa-angle-right"></i> General**을 엽니다.
2. **Your accounts** 바로 아래에 있는 **Send from any address** 카드를 찾습니다.
3. **Add catch-all password**를 클릭합니다.
4. 도메인 (예: `example.com`)을 입력하고 catch-all 비밀번호를 붙여 넣습니다.
5. **Save**를 클릭합니다. "You can now send from any address @example.com"이라는 메시지가 표시됩니다.

원하는 만큼 여러 도메인의 비밀번호를 저장할 수 있습니다. 삭제하려면 옆에 있는 휴지통 아이콘을 클릭하세요.

### 3단계: 메일 작성 시 주소 선택 {#step-3-pick-the-address-when-you-compose}

1. 새 메시지를 작성합니다.
2. **From** 메뉴를 엽니다. 로그인한 계정 아래에 저장한 도메인마다 **Other address @example.com…** 항목이 있습니다.
3. 그 항목을 선택합니다. From 줄이 `@example.com`이 뒤에 붙은 입력란으로 바뀝니다.
4. @ 앞부분 (예: `billing`)을 입력하고 보냅니다.

임시 보관함은 입력한 주소를 유지하므로, 저장된 임시 메일을 다시 열면 같은 From 주소가 표시됩니다.

### catch-all 발송에 대해 알아둘 점 {#what-to-know-about-catch-all-sending}

* **보내기만 할 수 있습니다.** catch-all 비밀번호는 발송에만 사용됩니다. 메일함을 열 수 없으므로 이 비밀번호로 `billing@example.com`의 메일을 읽을 수 없습니다. 답장을 읽으려면 그 주소의 별칭 (또는 내게 전달되는 catch-all 별칭)을 만드세요.
* **보낸 메일 사본은 사용 중인 계정으로 갑니다.** `billing@example.com`으로 보낸 메시지는 메일을 작성한 계정의 보낸편지함(Sent)에 저장됩니다.
* **기기의 모든 계정에서 작동합니다.** 저장된 비밀번호는 로그인한 특정 계정에 묶여 있지 않습니다. 그 기기의 어느 계정이든 사용할 수 있습니다.
* **이 기기에만 보관됩니다.** 비밀번호는 저장한 기기에만 보관됩니다. 동기화되지 않으며, QR 기기 페어링으로도 복사되지 않습니다. 기기마다 다시 추가하세요.
* **App Lock이 보호합니다.** App Lock이 켜져 있으면 비밀번호는 다른 로컬 데이터와 함께 암호화되며, 앱이 잠겨 있는 동안에는 **Other address** 항목이 숨겨집니다.
* **예약 발송은 사용할 수 없습니다.** catch-all 비밀번호로 보내는 주소는 예약 발송을 사용할 수 없습니다. 이 비밀번호로는 예약된 메시지를 다시 읽거나 취소할 수 없기 때문입니다. 바로 보내거나, 로그인한 계정으로 보내세요.
* **잘못된 비밀번호 때문에 로그아웃되지 않습니다.** catch-all 비밀번호가 틀렸거나 대시보드에서 삭제된 경우 발송이 오류와 함께 실패하지만, 로그인 상태는 유지됩니다.


## 웹메일 설정 한눈에 보기 {#webmail-settings-at-a-glance}

| 섹션                   | 다루는 내용                                                             |
| ---------------------- | ----------------------------------------------------------------------- |
| **General**            | 내 계정, 모든 주소에서 보내기 (catch-all 비밀번호), 알림, 저장소        |
| **Appearance**         | 테마, 레이아웃, 밀도, 작성기 기본값, 서명, 글꼴, 외부 링크              |
| **Privacy & Security** | App Lock, PGP 암호화, 개인정보 보호 옵션, 스팸 신고                     |
| **Folders & Labels**   | 특수 폴더, 내 폴더, 라벨                                                |
| **Filters**            | 로그인한 별칭의 메일 필터                                               |
| **Calendar**           | 주 시작 요일과 작업                                                     |
| **Search**             | 검색 색인, 색인 상태, 저장된 검색, 검색 연산자                          |
| **Advanced**           | 메일함 저장소, 로컬 캐시, 앱 초기화                                     |
| **Keyboard Shortcuts** | 모든 단축키                                                             |
| **About & Help**       | 버전, 데스크톱 앱 다운로드, 피드백, 링크                                |

DNS, 전달 수신자, 저장 용량 한도, 부재중 자동 응답, catch-all 비밀번호, 스팸 검사처럼 도메인이나 별칭 자체에 속하는 항목은 <a href="/my-account/domains">웹 대시보드</a>에서 설정합니다.


## 개인정보 보호와 App Lock {#privacy-and-app-lock}

웹메일은 빠르게 동작하고 오프라인에서도 사용할 수 있도록 메일의 로컬 사본을 보관합니다. **App Lock** (**Settings <i class="fa fa-angle-right"></i> Privacy & Security**에 있음)은 기기에 있는 이 로컬 데이터, 설정, 저장된 비밀번호를 암호화하며, 패스키나 PIN으로 잠금을 해제합니다. 메일과 실시간 업데이트는 앱과 Forward Email 사이에서 직접 오가며, 중간에 광고나 추적 서비스가 없습니다.


## 문제 해결 {#troubleshooting}

**"Can't send as <name@example.com>: sign in to that account on this device again, or save its domain's catch-all password in Settings."**

이 기기의 웹메일에 그 주소의 비밀번호가 없습니다. 그 별칭에 로그인하거나, **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Send from any address**에 도메인의 catch-all 비밀번호를 저장하세요. 앱이 잠겨 있다면 먼저 잠금을 해제하세요.

**From 메뉴에 "Other address" 항목이 없습니다.**

이 기기에 catch-all 비밀번호를 저장했는지, App Lock이 해제되어 있는지 확인하세요.

**catch-all 주소에서 보낼 때 인증 오류로 실패합니다.**

catch-all 비밀번호가 삭제되었거나 잘못 입력되었을 수 있습니다. 대시보드에서 새 비밀번호를 생성한 다음, 웹메일에서 이전 비밀번호를 삭제하고 새 비밀번호를 추가하세요.

**대시보드 비밀번호가 웹메일에서 작동하지 않습니다.**

웹메일에는 대시보드 비밀번호가 아니라 별칭 비밀번호가 필요합니다. [별칭 비밀번호 생성](#generate-an-alias-password)을 참고하세요.

그래도 해결되지 않나요? <a href="/faq">FAQ</a>를 보거나 <a href="/help">문의해 주세요</a>.
