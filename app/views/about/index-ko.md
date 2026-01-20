# 전달 이메일 정보 {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Email team and company story" 클래스="둥근-lg" />

# 전달 이메일 정보 {#about-forward-email-1}

## 목차 {#table-of-contents}

* [개요](#overview)
* [창립자와 사명](#founder-and-mission)
* [타임라인](#timeline)
  * [2017 - 창립 및 출시](#2017---founding-and-launch)
  * [2018 - 인프라 및 통합](#2018---infrastructure-and-integration)
  * [2019 - 퍼포먼스 혁명](#2019---performance-revolution)
  * [2020 - 개인정보 보호 및 보안에 초점을 맞추다](#2020---privacy-and-security-focus)
  * [2021 - 플랫폼 현대화](#2021---platform-modernization)
  * [2023 - 인프라 및 기능 확장](#2023---infrastructure-and-feature-expansion)
  * [2024 - 서비스 최적화 및 고급 기능](#2024---service-optimization-and-advanced-features)
  * [2025 - 지속적인 혁신](#2025---continued-innovation)
* [핵심 원칙](#core-principles)
* [현재 상태](#current-status)

## 개요 {#overview}

> \[!TIP]
> 아키텍처, 보안 구현 및 로드맵에 대한 기술적인 세부 정보는 [기술 백서](https://forwardemail.net/technical-whitepaper.pdf)을 참조하세요.

Forward Email은 사용자의 [사생활 보호권](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy")에 초점을 맞춘 [무료 및 오픈 소스](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") [이메일 전달](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") 서비스입니다. 2017년 간단한 이메일 전달 솔루션으로 시작된 이 서비스는 이제 무제한 사용자 지정 도메인 이름, 무제한 이메일 주소 및 별칭, 무제한 일회용 이메일 주소, 스팸 및 피싱 차단, 암호화된 사서함 저장 공간, 그리고 다양한 고급 기능을 제공하는 포괄적인 이메일 플랫폼으로 발전했습니다.

이 서비스는 디자이너와 개발자로 구성된 창립 팀이 관리 및 소유하고 있습니다. [자바스크립트](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS"), [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP")를 사용하여 100% 오픈 소스 소프트웨어로 구축되었습니다.

## 설립자 및 사명 {#founder-and-mission}

Forward Email은 **Nicholas Baugh**가 2017년에 설립했습니다. [이메일 전달 기술 백서](https://forwardemail.net/technical-whitepaper.pdf)에 따르면, Baugh는 처음에는 사이드 프로젝트를 위해 도메인 이름에서 이메일을 활성화할 수 있는 비용 효율적이고 간단한 솔루션을 찾고 있었습니다. 가능한 옵션을 조사한 후, 그는 직접 솔루션을 코딩하기 시작했고 2017년 10월 2일에 `forwardemail.net` 도메인을 구매했습니다.

Forward Email의 사명은 단순히 이메일 서비스를 제공하는 데 그치지 않습니다. 업계의 이메일 개인정보 보호 및 보안 접근 방식을 혁신하는 것을 목표로 합니다. Forward Email의 핵심 가치는 단순한 정책적 약속이 아닌, 투명성, 사용자 통제, 그리고 기술적 구현을 통한 개인정보 보호를 포함합니다.

## 타임라인 {#timeline}

### 2017 - 창립 및 출시 {#2017---founding-and-launch}

**2017년 10월 2일**: Nicholas Baugh는 사이드 프로젝트를 위해 비용 효율적인 이메일 솔루션을 조사한 후 `forwardemail.net` 도메인을 구매했습니다.

**2017년 11월 5일**: Baugh는 [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js")을 사용하여 모든 사용자 지정 도메인 이름으로 이메일을 전달하는 634줄짜리 JavaScript 파일을 만들었습니다. 이 초기 구현은 [깃허브](https://github.com/forwardemail)에 오픈 소스로 공개되었으며, 서비스는 GitHub Pages를 통해 출시되었습니다.

**2017년 11월**: Forward Email이 최초 출시 후 공식 출시되었습니다. 초기 버전은 계정 등록이나 가입 절차 없이 순수 DNS 기반이었으며, 마크다운으로 작성된 README 파일과 사용 설명서만 있었습니다. 사용자는 MX 레코드가 `mx1.forwardemail.net`과 `mx2.forwardemail.net`을 가리키도록 설정하고, `forward-email=user@gmail.com`를 포함하는 TXT 레코드를 추가하여 이메일 전달을 설정할 수 있었습니다.

이 솔루션의 간단함과 효과성은 [데이비드 하이네마이어 한손](https://dhh.dk)(Ruby on Rails의 제작자)를 포함한 유명 개발자들의 주목을 끌었으며, 그는 오늘날까지도 자신의 도메인 `dhh.dk`에서 Forward Email을 사용하고 있습니다.

### 2018 - 인프라 및 통합 {#2018---infrastructure-and-integration}

**2018년 4월**: [클라우드플레어](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare")에서 [개인 정보 보호 우선 소비자 DNS 서비스](https://blog.cloudflare.com/announcing-1111/)을 출시했을 때, Forward Email은 [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System") 조회를 처리하기 위해 [오픈DNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS")에서 [클라우드플레어](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare")으로 전환하여 개인정보 보호에 중점을 둔 인프라 선택에 대한 회사의 노력을 보여주었습니다.

**2018년 10월**: 이메일 전달 기능을 통해 사용자는 [지메일](https://en.wikipedia.org/wiki/Gmail "Gmail") 및 [시야](https://en.wikipedia.org/wiki/Outlook "Outlook")을 사용하여 "메일 보내기"를 할 수 있게 되었고, 이를 통해 인기 있는 이메일 제공업체와의 통합 기능이 확대되었습니다.

### 2019 - 성능 혁명 {#2019---performance-revolution}

**2019년 5월**: Forward Email은 초기 버전을 대대적으로 재작성한 v2를 출시했습니다. 이 업데이트는 [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js")의 [스트림](https://en.wikipedia.org/wiki/Streams "Streams")를 활용하여 [성능](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing")의 개선에 중점을 두었으며, 이를 통해 플랫폼 확장성의 기반을 마련했습니다.

### 2020 - 개인정보 보호 및 보안 중심 {#2020---privacy-and-security-focus}

**2020년 2월**: Forward Email은 향상된 개인정보 보호(Enhanced Privacy Protection) 플랜을 출시하여 사용자가 이메일 전달 구성 별칭을 통해 공개 DNS 레코드 항목 설정을 해제할 수 있도록 했습니다. 이 플랜을 통해 사용자의 이메일 별칭 정보는 인터넷에서 공개적으로 검색되지 않도록 숨겨집니다. 또한, Forward Email은 특정 별칭을 활성화 또는 비활성화하면서도 유효한 이메일 주소로 표시되고, [SMTP 상태 코드](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes")을 성공적으로 반환하며, 이메일은 즉시 삭제되는 기능(출력을 [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")로 파이프하는 것과 유사)을 출시했습니다.

**2020년 4월**: Forward Email의 개인정보 보호정책을 준수하지 않는 기존 스팸 탐지 솔루션으로 수많은 난관에 부딪힌 후, Forward Email은 스팸 스캐너의 초기 알파 버전을 출시했습니다. 완전히 무료이며 오픈소스로 제공되는 이 [스팸 방지 필터링](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") 솔루션은 [나이브 베이즈 스팸 필터](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") 접근 방식과 [안티피싱](https://en.wikipedia.org/wiki/Phishing "Phishing") 및 [IDN 동형이의어 공격](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack") 보호 기능을 결합합니다. Forward Email은 또한 계정 보안 강화를 위해 [일회용 비밀번호](https://en.wikipedia.org/wiki/One-time_password "One-time password")(OTP)를 사용하는 [2단계 인증](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication")(2FA)를 출시했습니다.

**2020년 5월**: Forward Email에서 사용자가 [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider")에 의한 포트 차단을 우회할 수 있도록 사용자 지정 [포트 포워딩](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding")을 허용했습니다. 또한, 회사는 완전한 설명서와 실시간 요청 및 응답 예시, 그리고 웹훅 지원을 포함한 [무료 이메일 전달 RESTful API](email-api)를 출시했습니다.

**2020년 8월**: Forward Email에 [인증된 수신 체인](arc)("ARC") 이메일 인증 시스템에 대한 지원이 추가되어 이메일 보안과 전달성이 더욱 강화되었습니다.

**2020년 11월 23일**: Forward Email이 베타 프로그램을 마치고 공식적으로 출시되었으며, 이는 플랫폼 개발에 있어서 중요한 이정표를 세웠습니다.

### 2021 - 플랫폼 현대화 {#2021---platform-modernization}

**2021년 2월**: Forward Email은 코드베이스를 리팩토링하여 모든 [파이썬](https://en.wikipedia.org/wiki/Python_\(programming_language\) "Python(프로그래밍 언어)" 종속성을 제거했습니다. 이를 통해 스택을 100% [자바스크립트](https://en.wikipedia.org/wiki/JavaScript "JavaScript")과 [Node.js](https://en.wikipedia.org/wiki/Node.js)로 구성했습니다. 이러한 아키텍처 결정은 일관된 오픈 소스 기술 스택을 유지하려는 회사의 의지와 일치했습니다.

**2021년 9월 27일**: 이메일 전달 별칭을 [추가 지원](email-forwarding-regex-pattern-filter)으로 설정하여 [정규 표현식](https://en.wikipedia.org/wiki/Regular_expression "Regular expression")과 일치하도록 하여 사용자에게 더욱 정교한 이메일 라우팅 기능을 제공합니다.

### 2023 - 인프라 및 기능 확장 {#2023---infrastructure-and-feature-expansion}

**2023년 1월**: Forward Email은 재설계하고 페이지 속도를 최적화한 웹사이트를 출시하여 사용자 경험과 성능을 개선했습니다.

**2023년 2월**: 회사는 사용자 선호도와 접근성 요구 사항에 대응하여 [오류 로그](/faq#do-you-store-error-logs)에 대한 지원을 추가하고 [다크 모드](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme) 웹사이트 색 구성표를 구현했습니다.

**2023년 3월**: Forward Email은 [귤](https://github.com/forwardemail/tangerine#readme)을 출시하고 인프라 전반에 통합하여 애플리케이션 계층에서 [HTTPS를 통한 DNS](https://en.wikipedia.org/wiki/DNS_over_HTTPS)("DoH")을 사용할 수 있도록 했습니다. 또한 [MTA-STS](/faq#do-you-support-mta-sts)에 대한 지원을 추가하고 [hCaptcha](/)에서 [클라우드플레어 턴스타일](https://developers.cloudflare.com/turnstile)로 전환했습니다.

**2023년 4월**: Forward Email은 완전히 새로운 인프라를 구축하고 자동화했습니다. 전체 서비스는 [클라우드플레어](https://cloudflare.com)을 사용하여 상태 확인 및 장애 조치를 제공하는 글로벌 로드 밸런싱 및 근접성 기반 DNS에서 실행되기 시작했으며, 이는 기존의 라운드 로빈 DNS 방식을 대체했습니다. 회사는 SOC 2 Type 1을 준수하는 [불트르](https://www.vultr.com/?ref=429848)과 [디지털 오션](https://m.do.co/c/a7cecd27e071)를 포함한 여러 공급업체에서 **베어 메탈 서버**로 전환했습니다. MongoDB와 Redis 데이터베이스는 고가용성, 종단 간 SSL 암호화, 저장 데이터 암호화 및 PITR(Point-in-Time Recovery)을 위해 기본 및 대기 노드를 갖춘 클러스터링 구성으로 전환되었습니다.

**2023년 5월**: Forward Email에서 [SMTP로 이메일 보내기](/faq#do-you-support-sending-email-with-smtp) 및 [API를 사용하여 이메일 보내기](/faq#do-you-support-sending-email-with-api) 요청에 대한 **아웃바운드 SMTP** 기능을 출시했습니다. 이 기능에는 높은 전달성을 보장하는 내장된 보안 장치, 현대적이고 강력한 대기열 및 재시도 시스템, 그리고 [실시간으로 오류 로그를 지원합니다](/faq#do-you-store-error-logs)가 포함되어 있습니다.

**2023년 11월**: Forward Email은 [IMAP 지원](/faq#do-you-support-receiving-email-with-imap)에 대한 [**암호화된 사서함 저장소**](/blog/docs/best-quantum-safe-encrypted-email-service) 기능을 출시했으며, 이는 이메일 개인정보 보호 및 보안 측면에서 상당한 진전을 의미합니다.

**2023년 12월**: [추가 지원](/faq#do-you-support-pop3) 회사는 [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [패스키와 WebAuthn](/faq#do-you-support-passkeys-and-webauthn), [받은 편지함까지 시간](/faq#i) 모니터링 및 [IMAP 저장소용 OpenPGP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)를 담당합니다.

### 2024 - 서비스 최적화 및 고급 기능 {#2024---service-optimization-and-advanced-features}

**2024년 2월**: 이메일 [캘린더(CalDAV) 지원 추가](/faq#do-you-support-calendars-caldav)을 전달하여 이메일을 넘어 일정 동기화를 포함하도록 플랫폼 기능을 확장합니다.

**2024년 3월~7월**: Forward Email은 IMAP, POP3, CalDAV 서비스에 대한 주요 최적화 및 개선 사항을 출시하여, 대안보다 빠르지는 않더라도 최소한 그만큼 빠른 서비스를 제공하는 것을 목표로 했습니다.

**2024년 7월**: [iOS Push 지원 추가](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016)은 iOS용 Apple Mail에서 IMAP `IDLE` 명령어를 지원하지 않는 문제를 해결하여 Apple iOS 기기에서 실시간 알림을 사용할 수 있도록 했습니다. Forward Email은 또한 자체 서비스와 Yahoo/AOL에 대한 받은 편지함 시간("TTI") 모니터링 기능을 추가했으며, 무료 요금제에서도 사용자가 전체 DNS TXT 레코드를 암호화할 수 있도록 했습니다. [개인정보 보호 가이드 토론](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) 및 [GitHub 문제](https://github.com/forwardemail/forwardemail.net/issues/254)에서 요청된 대로, 회사는 별칭이 비활성화 시 `250`를 조용히 거부하거나, `421`를 부드럽게 거부하거나, `550`을 강제 거부할 수 있는 기능을 추가했습니다.

**2024년 8월**: Forward Email에서 사서함을 [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) 및 [엠박스](https://en.wikipedia.org/wiki/Mbox) 형식으로 내보낼 수 있는 기능이 추가되었습니다(기존 [SQLite](https://en.wikipedia.org/wiki/SQLite) 내보내기 형식 외에도). [Webhook 서명 지원이 추가되었습니다.](https://forwardemail.net/faq#do-you-support-bounce-webhooks) 형식으로 내보낼 수 있게 되었으며, 사용자는 아웃바운드 SMTP 서비스를 통해 뉴스레터, 공지 사항 및 이메일 마케팅을 보낼 수 있게 되었습니다. IMAP/POP3/CalDAV에 대한 도메인 전체 및 별칭별 저장 공간 할당량도 구현되었습니다.

### 2025 - 지속적인 혁신 {#2025---continued-innovation}

**2024년 9월부터 2025년 1월까지**: 이미 구현된 암호화된 사서함 저장 기능을 기반으로 [요청이 많았던 휴가 응답 기능과 이메일 전달을 위한 OpenPGP/WKD 암호화를 추가했습니다.](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254) 이메일을 전달합니다.

**2025년 1월 21일**: 설립자의 가장 친한 친구이자 충실한 반려견 "잭"이 거의 11살의 나이로 평화롭게 세상을 떠났습니다. Forward Email의 탄생을 지지해 준 변함없는 동반자 잭에게 [항상 기억될 것이다](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b)을 드립니다. [이메일 전달 기술 백서](https://forwardemail.net/technical-whitepaper.pdf)은 서비스 발전에 기여한 잭의 공로를 기리며 그에게 바칩니다.

**2025년 2월**: Forward Email은 새로운 기본 데이터 센터 공급업체로 [데이터 패킷](https://www.datapacket.com)을 전환하여 서비스 안정성과 속도를 더욱 향상시키기 위해 맞춤형, 성능 중심의 베어 메탈 하드웨어를 구현했습니다.

**2025년 6월**: Forward Email에서 [CardDAV 프로토콜](/faq#do-you-support-contacts-carddav)에 대한 지원을 시작하여 기존 이메일 및 캘린더 서비스와 함께 연락처 동기화를 포함하도록 플랫폼의 기능을 확장했습니다.

## 핵심 원칙 {#core-principles}

Forward Email은 창립 이래로 개인정보 보호 및 보안 원칙을 확고히 지켜왔습니다.

**100% 오픈 소스 철학**: 백엔드는 폐쇄한 채 프런트엔드만 오픈 소스로 공개하는 경쟁사와 달리 Forward Email은 프런트엔드와 백엔드 모두의 전체 코드베이스를 [깃허브](https://github.com/forwardemail)에서 대중이 검토할 수 있도록 공개했습니다.

**개인정보 보호 우선 설계**: Forward Email은 처음부터 이메일을 디스크에 쓰지 않고 메모리 내에서 처리하는 고유한 방식을 구현하여 데이터베이스나 파일 시스템에 메시지를 저장하는 기존 이메일 서비스와 차별화했습니다.

**지속적인 혁신**: 이 서비스는 간단한 이메일 전달 솔루션에서 암호화된 사서함, 양자 저항 암호화, SMTP, IMAP, POP3, CalDAV를 비롯한 표준 프로토콜 지원 등의 기능을 갖춘 포괄적인 이메일 플랫폼으로 발전했습니다.

**투명성**: 모든 코드를 오픈 소스로 공개하여 검사할 수 있도록 하고, 사용자가 마케팅 문구만 믿는 것이 아니라 개인 정보 보호 주장을 직접 확인할 수 있도록 보장합니다.

**사용자 제어**: 원하는 경우 전체 플랫폼을 직접 호스팅하는 기능을 포함하여 사용자에게 옵션을 제공합니다.

## 현재 상태 {#current-status}

2025년 현재 Forward Email은 다음과 같은 유명 조직과 업계 리더를 포함하여 전 세계적으로 50만 개 이상의 도메인에 서비스를 제공하고 있습니다.

* **기술 기업**: Canonical(Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **미디어 기관**: Fox News Radio, Disney Ad Sales
* **교육 기관**: 케임브리지 대학교, 메릴랜드 대학교, 워싱턴 대학교, 터프츠 대학교, 스와스모어 칼리지
* **정부 기관**: 남호주 정부, 도미니카 공화국 정부
* **기타 기관**: RCD Hotels, Fly<span>.</span>io
* **주요 개발자**: Isaac Z. Schlueter(npm 개발자), David Heinemeier Hansson(Ruby on Rails 개발자)

이 플랫폼은 정기적인 기능 릴리스와 인프라 개선을 통해 지속적으로 발전하고 있으며, 현재 이용 가능한 유일한 100% 오픈 소스, 암호화, 개인 정보 보호 중심, 투명성 및 양자 방어 기능을 갖춘 이메일 서비스라는 입지를 유지하고 있습니다.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" 클래스="둥근-lg" />