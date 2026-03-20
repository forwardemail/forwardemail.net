# Forward Email 소개 {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Email 팀과 회사 이야기" class="rounded-lg" />

# Forward Email 소개 {#about-forward-email-1}


## 목차 {#table-of-contents}

* [개요](#overview)
* [창립자와 미션](#founder-and-mission)
* [연혁](#timeline)
  * [2017 - 창립 및 출시](#2017---founding-and-launch)
  * [2018 - 인프라 및 통합](#2018---infrastructure-and-integration)
  * [2019 - 성능 혁신](#2019---performance-revolution)
  * [2020 - 개인정보 보호 및 보안 집중](#2020---privacy-and-security-focus)
  * [2021 - 플랫폼 현대화](#2021---platform-modernization)
  * [2023 - 인프라 및 기능 확장](#2023---infrastructure-and-feature-expansion)
  * [2024 - 서비스 최적화 및 고급 기능](#2024---service-optimization-and-advanced-features)
  * [2025 - 개인정보 강화 및 프로토콜 지원 {#2025---privacy-enhancements-and-protocol-support}](#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support)
  * [2026 - RFC 준수 및 고급 필터링 {#2026---rfc-compliance-and-advanced-filtering}](#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering)
* [핵심 원칙](#core-principles)
* [현재 상태](#current-status)


## 개요 {#overview}

> \[!TIP]
> 아키텍처, 보안 구현 및 로드맵에 대한 기술적 세부사항은 [기술 백서](https://forwardemail.net/technical-whitepaper.pdf)를 참조하세요.

Forward Email은 사용자의 [프라이버시 권리](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy")에 중점을 둔 [무료 및 오픈 소스](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") [이메일 전달](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") 서비스입니다. 2017년에 단순한 이메일 전달 솔루션으로 시작하여, 무제한 맞춤 도메인 이름, 무제한 이메일 주소 및 별칭, 무제한 일회용 이메일 주소, 스팸 및 피싱 방지, 암호화된 메일박스 저장소, 그리고 다양한 고급 기능을 제공하는 종합 이메일 플랫폼으로 발전했습니다.

이 서비스는 원래의 디자이너 및 개발자 창립 팀이 유지 및 소유하고 있습니다. 100% 오픈 소스 소프트웨어로 구축되었으며, [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS"), 그리고 [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP")를 사용합니다.


## 창립자와 미션 {#founder-and-mission}

Forward Email은 2017년에 **Nicholas Baugh**에 의해 설립되었습니다. [Forward Email 기술 백서](https://forwardemail.net/technical-whitepaper.pdf)에 따르면, Baugh는 처음에 자신의 사이드 프로젝트를 위해 도메인 이름에서 이메일을 사용할 수 있는 비용 효율적이고 간단한 솔루션을 찾고 있었습니다. 사용 가능한 옵션을 조사한 후, 직접 솔루션을 코딩하기 시작했고 2017년 10월 2일에 `forwardemail.net` 도메인을 구매했습니다.

Forward Email의 미션은 단순히 이메일 서비스를 제공하는 것을 넘어, 업계가 이메일 프라이버시와 보안에 접근하는 방식을 변화시키는 데 있습니다. 회사의 핵심 가치는 투명성, 사용자 제어, 그리고 정책 약속뿐만 아니라 기술적 구현을 통한 프라이버시 보호를 포함합니다.


## 연혁 {#timeline}

### 2017 - 창립 및 출시 {#2017---founding-and-launch}

**2017년 10월 2일**: Nicholas Baugh는 자신의 사이드 프로젝트를 위한 비용 효율적인 이메일 솔루션을 조사한 후 `forwardemail.net` 도메인을 구매했습니다.

**2017년 11월 5일**: Baugh는 [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js")를 사용하여 모든 맞춤 도메인 이름에 대해 이메일을 전달하는 634줄의 JavaScript 파일을 작성했습니다. 이 초기 구현은 오픈 소스로 [GitHub](https://github.com/forwardemail)에 공개되었고, GitHub Pages를 통해 서비스가 출시되었습니다.
**2017년 11월**: Forward Email이 초기 출시 후 공식적으로 런칭되었습니다. 초기 버전은 계정 등록이나 가입 절차 없이 순수하게 DNS 기반이었으며, 단순히 Markdown으로 작성된 README 파일에 지침이 포함되어 있었습니다. 사용자는 MX 레코드를 `mx1.forwardemail.net` 및 `mx2.forwardemail.net`으로 설정하고, TXT 레코드에 `forward-email=user@gmail.com`을 추가하여 이메일 전달을 설정할 수 있었습니다.

이 솔루션의 단순함과 효과성은 루비 온 레일스(Ruby on Rails) 창시자인 [David Heinemeier Hansson](https://dhh.dk) 등 저명한 개발자들의 관심을 끌었으며, 그는 현재까지도 자신의 도메인 `dhh.dk`에서 Forward Email을 사용하고 있습니다.

### 2018 - 인프라 및 통합 {#2018---infrastructure-and-integration}

**2018년 4월**: [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare")가 [프라이버시 중심 소비자 DNS 서비스](https://blog.cloudflare.com/announcing-1111/)를 출시하자, Forward Email은 [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS")에서 [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare")로 [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System") 조회 처리를 전환하여 프라이버시 중심 인프라 선택에 대한 회사의 의지를 보여주었습니다.

**2018년 10월**: Forward Email은 사용자가 [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") 및 [Outlook](https://en.wikipedia.org/wiki/Outlook "Outlook")과 함께 "메일 보내기" 기능을 사용할 수 있도록 하여 인기 있는 이메일 제공자와의 통합 기능을 확장했습니다.

### 2019 - 성능 혁명 {#2019---performance-revolution}

**2019년 5월**: Forward Email은 초기 버전에서 대대적인 재작성된 v2를 출시했습니다. 이 업데이트는 [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js")의 [스트림](https://en.wikipedia.org/wiki/Streams "Streams")을 활용한 [성능](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") 향상에 중점을 두어 플랫폼의 확장성 기반을 마련했습니다.

### 2020 - 프라이버시 및 보안 집중 {#2020---privacy-and-security-focus}

**2020년 2월**: Forward Email은 향상된 프라이버시 보호 플랜을 출시하여 사용자가 이메일 전달 구성 별칭에 대한 공개 DNS 레코드 항목 설정을 끌 수 있도록 했습니다. 이 플랜을 통해 사용자의 이메일 별칭 정보가 인터넷 상에서 공개적으로 검색되지 않도록 숨겨집니다. 또한 회사는 특정 별칭을 활성화 또는 비활성화할 수 있는 기능을 출시했으며, 이 별칭들은 여전히 유효한 이메일 주소로 나타나고 성공적인 [SMTP 상태 코드](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes")를 반환하지만, 이메일은 즉시 폐기됩니다 (이는 [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")로 출력 파이핑하는 것과 유사합니다).

**2020년 4월**: Forward Email은 기존 스팸 탐지 솔루션들이 Forward Email의 프라이버시 정책을 존중하지 않아 수많은 난관에 부딪힌 후, 완전 무료이자 오픈 소스인 스팸 스캐너 초기 알파 버전을 출시했습니다. 이 솔루션은 [나이브 베이즈 스팸 필터](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") 방식을 사용하며, [피싱 방지](https://en.wikipedia.org/wiki/Phishing "Phishing") 및 [IDN 동형문자 공격](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack") 보호 기능을 결합합니다. Forward Email은 또한 향상된 계정 보안을 위해 [일회용 비밀번호](https://en.wikipedia.org/wiki/One-time_password "One-time password")(OTP)를 사용하는 [2단계 인증](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication")(2FA)을 출시했습니다.

**2020년 5월**: Forward Email은 사용자가 [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider")의 포트 차단을 우회할 수 있도록 맞춤형 [포트 포워딩](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding")을 허용했습니다. 또한 회사는 완전한 문서와 실시간 요청 및 응답 예제를 포함한 [무료 이메일 전달 RESTful API](email-api)를 출시하고 웹훅 지원도 제공했습니다.
**2020년 8월**: Forward Email은 이메일 보안 및 전달성을 더욱 강화하는 [Authenticated Received Chain](arc) ("ARC") 이메일 인증 시스템 지원을 추가했습니다.

**2020년 11월 23일**: Forward Email이 베타 프로그램을 종료하고 공식적으로 출시되어 플랫폼 개발의 중요한 이정표를 기록했습니다.

### 2021 - 플랫폼 현대화 {#2021---platform-modernization}

**2021년 2월**: Forward Email은 모든 [Python](https://en.wikipedia.org/wiki/Python_\(programming_language\) "Python (programming language)") 의존성을 제거하도록 코드베이스를 리팩토링하여 스택을 100% [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") 및 [Node.js](https://en.wikipedia.org/wiki/Node.js)로 전환했습니다. 이 아키텍처 결정은 일관되고 오픈 소스 기술 스택을 유지하려는 회사의 의지와 부합합니다.

**2021년 9월 27일**: Forward Email은 이메일 전달 별칭이 [정규 표현식](https://en.wikipedia.org/wiki/Regular_expression "Regular expression")과 일치하도록 [지원](email-forwarding-regex-pattern-filter)을 추가하여 사용자에게 더 정교한 이메일 라우팅 기능을 제공했습니다.

### 2023 - 인프라 및 기능 확장 {#2023---infrastructure-and-feature-expansion}

**2023년 1월**: Forward Email은 재설계되고 페이지 속도가 최적화된 웹사이트를 출시하여 사용자 경험과 성능을 향상시켰습니다.

**2023년 2월**: 회사는 [오류 로그](/faq#do-you-store-error-logs) 지원을 추가하고 사용자 선호도 및 접근성 요구에 대응하여 [다크 모드](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme) 웹사이트 색상 체계를 구현했습니다.

**2023년 3월**: Forward Email은 [Tangerine](https://github.com/forwardemail/tangerine#readme)을 출시하고 인프라 전반에 통합하여 애플리케이션 계층에서 [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS)("DoH") 사용을 가능하게 했습니다. 또한 회사는 [MTA-STS](/faq#do-you-support-mta-sts) 지원을 추가하고 [hCaptcha](/)에서 [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile)로 전환했습니다.

**2023년 4월**: Forward Email은 완전히 새로운 인프라를 구현하고 자동화했습니다. 전체 서비스가 이전의 라운드로빈 DNS 방식을 대체하여 [Cloudflare](https://cloudflare.com)를 사용한 글로벌 부하 분산 및 근접성 기반 DNS, 상태 검사 및 장애 조치로 운영되기 시작했습니다. 회사는 [Vultr](https://www.vultr.com/?ref=429848) 및 [Digital Ocean](https://m.do.co/c/a7cecd27e071) 등 SOC 2 Type 1 준수 공급자를 포함한 여러 공급자에 걸쳐 **베어 메탈 서버**로 전환했습니다. MongoDB 및 Redis 데이터베이스는 고가용성을 위한 기본 및 대기 노드가 포함된 클러스터 구성으로 이전되었으며, 종단 간 SSL 암호화, 저장 시 암호화 및 시점 복구(PITR)를 지원합니다.

**2023년 5월**: Forward Email은 [SMTP를 통한 이메일 전송](/faq#do-you-support-sending-email-with-smtp) 및 [API를 통한 이메일 전송](/faq#do-you-support-sending-email-with-api) 요청을 위한 **아웃바운드 SMTP** 기능을 출시했습니다. 이 기능은 높은 전달성을 보장하는 내장 보호 장치, 현대적이고 견고한 큐 및 재시도 시스템을 포함하며 [실시간 오류 로그 지원](/faq#do-you-store-error-logs)을 제공합니다.

**2023년 11월**: Forward Email은 [IMAP 지원](/faq#do-you-support-receiving-email-with-imap)을 위한 [**암호화된 메일박스 저장소**](/blog/docs/best-quantum-safe-encrypted-email-service) 기능을 출시하여 이메일 프라이버시 및 보안에서 중요한 진전을 이루었습니다.

**2023년 12월**: 회사는 [POP3](/faq#do-you-support-pop3) 지원, [패스키 및 WebAuthn](/faq#do-you-support-passkeys-and-webauthn), [수신 시간 모니터링](/faq#i), 그리고 [IMAP 저장용 OpenPGP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) 지원을 추가했습니다.

### 2024 - 서비스 최적화 및 고급 기능 {#2024---service-optimization-and-advanced-features}

**2024년 2월**: Forward Email은 [캘린더 (CalDAV) 지원](/faq#do-you-support-calendars-caldav)을 추가하여 이메일을 넘어 캘린더 동기화 기능으로 플랫폼의 역량을 확장했습니다.
**2024년 3월부터 7월까지**: Forward Email은 IMAP, POP3, CalDAV 서비스에 대한 주요 최적화 및 개선을 출시하여, 대안 서비스와 같거나 더 빠른 속도를 목표로 했습니다.

**2024년 7월**: 회사는 [iOS 푸시 지원](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016)을 추가하여 iOS의 Apple Mail에서 IMAP `IDLE` 명령어를 지원하지 않는 문제를 해결하고, Apple iOS 기기에서 실시간 알림을 가능하게 했습니다. Forward Email은 자체 서비스와 Yahoo/AOL에 대한 인박스 도달 시간("TTI") 모니터링을 추가했으며, 무료 플랜에서도 전체 DNS TXT 레코드를 암호화할 수 있도록 허용하기 시작했습니다. [Privacy Guides 토론](https://discuss.privacyguides.net/t/forward-email-email-provider/13370)과 [GitHub 이슈](https://github.com/forwardemail/forwardemail.net/issues/254)에서 요청된 대로, 회사는 비활성화된 별칭에 대해 조용히 `250` 거부, 소프트 거부 `421`, 하드 거부 `550`을 선택할 수 있는 기능을 추가했습니다.

**2024년 8월**: Forward Email은 메일박스를 기존의 [SQLite](https://en.wikipedia.org/wiki/SQLite) 내보내기 형식 외에 [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) 및 [Mbox](https://en.wikipedia.org/wiki/Mbox) 형식으로 내보내는 기능을 추가했습니다. [웹훅 서명 지원](https://forwardemail.net/faq#do-you-support-bounce-webhooks)이 추가되었고, 사용자가 아웃바운드 SMTP 서비스를 통해 뉴스레터, 공지사항, 이메일 마케팅을 보낼 수 있도록 허용하기 시작했습니다. IMAP/POP3/CalDAV에 대한 도메인 전체 및 별칭별 저장 용량 제한도 구현되었습니다.

### 2025 - 개인정보 보호 강화 및 프로토콜 지원 {#2025---privacy-enhancements-and-protocol-support} {#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support}

**2024년 9월부터 2025년 1월까지**: Forward Email은 이미 구현된 암호화된 메일박스 저장 기능을 기반으로 [많이 요청된 부재중 응답기 기능과 OpenPGP/WKD 암호화 이메일 전달 기능](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254)을 추가했습니다.

**2025년 1월 21일**: 창립자의 가장 친한 친구이자 충실한 반려견 "잭"이 거의 11세의 나이로 평화롭게 세상을 떠났습니다. 잭은 Forward Email 창립을 지지한 변함없는 동반자로서 [항상 기억될 것입니다](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b). [Forward Email 기술 백서](https://forwardemail.net/technical-whitepaper.pdf)는 잭에게 헌정되어, 서비스 개발에 기여한 그의 역할을 인정합니다.

**2025년 2월**: Forward Email은 새로운 주요 데이터 센터 제공업체로 [DataPacket](https://www.datapacket.com)을 선택하고, 맞춤형 성능 중심 베어메탈 하드웨어를 도입하여 서비스 신뢰성과 속도를 더욱 향상시켰습니다.

**2025년 3월**: Forward Email 버전 1.0이 공식 출시되었습니다.

**2025년 4월**: [Forward Email 기술 백서](https://forwardemail.net/technical-whitepaper.pdf) 첫 버전이 발행되었으며, 회사는 암호화폐 결제를 받기 시작했습니다.

**2025년 5월**: 서비스는 [Scalar](https://github.com/scalar/scalar)를 사용한 새로운 API 문서를 출시했습니다.

**2025년 6월**: Forward Email은 [CardDAV 프로토콜](/faq#do-you-support-contacts-carddav) 지원을 시작하여, 기존 이메일 및 캘린더 서비스와 함께 연락처 동기화 기능을 확장했습니다.

**2025년 8월**: 플랫폼은 [CalDAV VTODO/작업 지원](https://en.wikipedia.org/wiki/ICalendar#To-do_\(VTODO\))을 추가하여 캘린더 이벤트와 함께 작업 관리를 가능하게 했습니다.

**2025년 11월**: 플랫폼 보안이 강화되어 비밀번호 해싱에 PBKDF2에서 [Argon2id](https://en.wikipedia.org/wiki/Argon2)로 전환되었고, 인프라가 Redis에서 [Valkey](https://github.com/valkey-io/valkey)로 이전되었습니다.

**2025년 12월**: 버전 2.0이 출시되어 이메일 전송 시 TLS 암호화를 강제하는 [REQUIRETLS (RFC 8689)](/rfc#requiretls-support) 지원이 도입되었으며, [OpenPGP.js](https://github.com/openpgpjs/openpgpjs) v6로 업그레이드되었습니다.
### 2026 - RFC 준수 및 고급 필터링 {#2026---rfc-compliance-and-advanced-filtering} {#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering}

**2026년 1월**: Forward Email은 포괄적인 [RFC 프로토콜 준수 문서](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison)를 발표하고 [S/MIME 암호화 (RFC 8551)](/faq#do-you-support-smime-encryption) 및 [ManageSieve 프로토콜 (RFC 5804)](/faq#do-you-support-sieve-email-filtering) 지원과 함께 포괄적인 [Sieve 이메일 필터링 (RFC 5228)](/faq#do-you-support-sieve-email-filtering)을 추가했습니다. REST API도 39개 엔드포인트로 확장되었습니다.

**2026년 2월**: 공식 오픈 소스 웹메일 클라이언트가 [mail.forwardemail.net](https://mail.forwardemail.net)에서 출시되었으며 ([GitHub 소스 코드](https://github.com/forwardemail/mail.forwardemail.net)) 플랫폼은 또한 [CalDAV 스케줄링 확장 (RFC 6638)](https://www.rfc-editor.org/rfc/rfc6638), [DANE/TLSA (RFC 6698)](https://en.wikipedia.org/wiki/DNS-based_Authentication_of_Named_Entities), 그리고 1클릭 DNS 설정을 위한 [Domain Connect](https://domainconnect.org) 지원을 추가했습니다. IMAP, CalDAV, CardDAV에 대한 실시간 푸시 알림이 WebSockets를 사용하여 출시되었습니다.

**2026년 3월**: 도메인별 맞춤형 S3 호환 스토리지 지원이 추가되었으며, 관리용 커맨드라인 도구도 제공되었습니다. 동일한 오픈 소스 웹메일 코드베이스를 사용하여 macOS, Windows, Linux, iOS, Android용 크로스 플랫폼 데스크톱 및 모바일 애플리케이션 개발 작업이 [Tauri](https://tauri.app)로 시작되었습니다.


## 핵심 원칙 {#core-principles}

Forward Email은 설립 이래로 개인정보 보호 및 보안 원칙에 대한 확고한 의지를 유지해왔습니다:

**100% 오픈 소스 철학**: 프론트엔드만 오픈 소스화하고 백엔드는 비공개로 유지하는 경쟁사들과 달리, Forward Email은 프론트엔드와 백엔드 전체 코드베이스를 [GitHub](https://github.com/forwardemail)에서 공개하여 누구나 검토할 수 있도록 했습니다.

**개인정보 우선 설계**: 처음부터 Forward Email은 이메일을 디스크에 저장하지 않고 메모리 내에서 처리하는 독특한 방식을 구현하여, 메시지를 데이터베이스나 파일 시스템에 저장하는 기존 이메일 서비스와 차별화했습니다.

**지속적인 혁신**: 단순한 이메일 전달 솔루션에서 암호화된 메일박스, 양자 내성 암호화, SMTP, IMAP, POP3, CalDAV 등 표준 프로토콜 지원을 포함한 종합 이메일 플랫폼으로 발전해왔습니다.

**투명성**: 모든 코드를 오픈 소스로 공개하여 사용자가 마케팅 문구를 단순히 신뢰하는 대신 개인정보 보호 주장을 직접 검증할 수 있도록 보장합니다.

**사용자 통제**: 사용자가 원할 경우 전체 플랫폼을 자체 호스팅할 수 있는 옵션을 포함하여 다양한 선택권을 제공합니다.


## 현재 현황 {#current-status}

2026년 3월 기준, Forward Email은 전 세계 50만 개 이상의 도메인에 서비스를 제공하며, 다음과 같은 주목할 만한 조직 및 업계 리더들이 포함되어 있습니다:

* **기술 기업**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **미디어 기관**: Fox News Radio, Disney Ad Sales
* **교육 기관**: 케임브리지 대학교, 메릴랜드 대학교, 워싱턴 대학교, 터프츠 대학교, 스와스모어 칼리지
* **정부 기관**: 남호주 정부, 도미니카 공화국 정부
* **기타 조직**: RCD Hotels, Fly<span>.</span>io
* **주요 개발자**: Isaac Z. Schlueter (npm 창시자), David Heinemeier Hansson (Ruby on Rails 창시자)

이 플랫폼은 정기적인 기능 출시와 인프라 개선을 통해 계속 진화하고 있으며, 오늘날 유일하게 100% 오픈 소스, 암호화, 개인정보 보호 중심, 투명성, 양자 내성 이메일 서비스를 유지하고 있습니다.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />
