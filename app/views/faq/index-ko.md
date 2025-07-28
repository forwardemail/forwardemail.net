# 자주 묻는 질문 {#frequently-asked-questions}

<img 로딩="게으른" src="/img/articles/faq.webp" alt="" 클래스="둥근-lg" />

## 목차 {#table-of-contents}

* [빠른 시작](#quick-start)
* [소개](#introduction)
  * [전달 이메일이란 무엇입니까?](#what-is-forward-email)
  * [누가 이메일 전달을 사용합니까?](#who-uses-forward-email)
  * [전달 이메일의 기록은 무엇입니까?](#what-is-forward-emails-history)
  * [이 서비스는 얼마나 빠른가요?](#how-fast-is-this-service)
* [이메일 클라이언트](#email-clients)
  * [천둥새](#thunderbird)
  * [마이크로소프트 아웃룩](#microsoft-outlook)
  * [애플 메일](#apple-mail)
  * [모바일 기기](#mobile-devices)
  * [Gmail을 사용하여 메일을 보내는 방법](#how-to-send-mail-as-using-gmail)
  * [Gmail을 사용하여 메일 보내기에 대한 기존 무료 가이드는 무엇입니까?](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [고급 Gmail 라우팅 구성](#advanced-gmail-routing-configuration)
  * [고급 Outlook 라우팅 구성](#advanced-outlook-routing-configuration)
* [문제 해결](#troubleshooting)
  * [테스트 이메일을 받지 못하는 이유는 무엇입니까?](#why-am-i-not-receiving-my-test-emails)
  * [이메일 전달 기능을 사용하려면 이메일 클라이언트를 어떻게 구성해야 합니까?](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [내 이메일이 스팸 및 정크 메일에 분류되는 이유는 무엇이며 도메인 평판을 어떻게 확인할 수 있습니까?](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [스팸 메일을 받으면 어떻게 해야 하나요?](#what-should-i-do-if-i-receive-spam-emails)
  * [Gmail에서 나에게 전송된 테스트 이메일이 "의심스럽다"고 표시되는 이유는 무엇입니까?](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Gmail에서 via forwardemail dot net을 제거할 수 있나요?](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [데이터 관리](#data-management)
  * [귀하의 서버는 어디에 있습니까?](#where-are-your-servers-located)
  * [내 사서함을 내보내고 백업하려면 어떻게 해야 하나요?](#how-do-i-export-and-backup-my-mailbox)
  * [기존 사서함을 가져오고 마이그레이션하려면 어떻게 해야 합니까?](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [셀프 호스팅을 지원하시나요?](#do-you-support-self-hosting)
* [이메일 구성](#email-configuration)
  * [이메일 전달을 시작하고 설정하려면 어떻게 해야 하나요?](#how-do-i-get-started-and-set-up-email-forwarding)
  * [고급 전달을 위해 여러 MX 교환 및 서버를 사용할 수 있습니까?](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [부재중 자동응답 기능을 어떻게 설정하나요?](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [전달 이메일에 SPF를 설정하려면 어떻게 해야 하나요?](#how-do-i-set-up-spf-for-forward-email)
  * [전달 이메일에 대한 DKIM을 어떻게 설정합니까?](#how-do-i-set-up-dkim-for-forward-email)
  * [전달 이메일에 DMARC를 설정하려면 어떻게 해야 하나요?](#how-do-i-set-up-dmarc-for-forward-email)
  * [연락처를 연결하고 구성하려면 어떻게 해야 합니까?](#how-do-i-connect-and-configure-my-contacts)
  * [캘린더를 연결하고 구성하려면 어떻게 해야 하나요?](#how-do-i-connect-and-configure-my-calendars)
  * [더 많은 캘린더를 추가하고 기존 캘린더를 관리하려면 어떻게 해야 합니까?](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [전달 이메일에 대한 SRS를 어떻게 설정합니까?](#how-do-i-set-up-srs-for-forward-email)
  * [전달 이메일에 MTA-STS를 어떻게 설정합니까?](#how-do-i-set-up-mta-sts-for-forward-email)
  * [이메일 주소에 프로필 사진을 추가하려면 어떻게 해야 하나요?](#how-do-i-add-a-profile-picture-to-my-email-address)
* [고급 기능](#advanced-features)
  * [마케팅 관련 이메일을 위한 뉴스레터나 메일링 리스트를 지원하시나요?](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [API를 사용하여 이메일 전송을 지원하시나요?](#do-you-support-sending-email-with-api)
  * [IMAP으로 이메일 수신을 지원하시나요?](#do-you-support-receiving-email-with-imap)
  * [POP3를 지원하시나요?](#do-you-support-pop3)
  * [캘린더(CalDAV)를 지원하시나요?](#do-you-support-calendars-caldav)
  * [연락처(CardDAV)를 지원하시나요?](#do-you-support-contacts-carddav)
  * [SMTP를 사용하여 이메일을 보내는 것을 지원합니까?](#do-you-support-sending-email-with-smtp)
  * [OpenPGP/MIME, 종단 간 암호화("E2EE") 및 웹 키 디렉토리("WKD")를 지원합니까?](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [MTA-STS를 지원하시나요?](#do-you-support-mta-sts)
  * [패스키와 WebAuthn을 지원하시나요?](#do-you-support-passkeys-and-webauthn)
  * [이메일 모범 사례를 지원하시나요?](#do-you-support-email-best-practices)
  * [바운스 웹훅을 지원하시나요?](#do-you-support-bounce-webhooks)
  * [웹훅을 지원하시나요?](#do-you-support-webhooks)
  * [정규 표현식이나 정규식을 지원하시나요?](#do-you-support-regular-expressions-or-regex)
  * [아웃바운드 SMTP 제한은 무엇입니까?](#what-are-your-outbound-smtp-limits)
  * [SMTP를 활성화하려면 승인이 필요합니까?](#do-i-need-approval-to-enable-smtp)
  * [SMTP 서버 구성 설정은 무엇입니까?](#what-are-your-smtp-server-configuration-settings)
  * [IMAP 서버 구성 설정은 무엇입니까?](#what-are-your-imap-server-configuration-settings)
  * [POP3 서버 구성 설정은 무엇입니까?](#what-are-your-pop3-server-configuration-settings)
  * [Postfix SMTP 릴레이 구성](#postfix-smtp-relay-configuration)
* [보안](#security)
  * [고급 서버 강화 기술](#advanced-server-hardening-techniques)
  * [SOC 2 또는 ISO 27001 인증을 받았습니까?](#do-you-have-soc-2-or-iso-27001-certifications)
  * [이메일 전달에 TLS 암호화를 사용하시나요?](#do-you-use-tls-encryption-for-email-forwarding)
  * [이메일 인증 헤더를 보존합니까?](#do-you-preserve-email-authentication-headers)
  * [원본 이메일 헤더를 보존하고 스푸핑을 방지합니까?](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [스팸 및 남용으로부터 어떻게 보호합니까?](#how-do-you-protect-against-spam-and-abuse)
  * [이메일 콘텐츠를 디스크에 저장하시나요?](#do-you-store-email-content-on-disk)
  * [시스템 충돌 중에 이메일 내용이 노출될 수 있습니까?](#can-email-content-be-exposed-during-system-crashes)
  * [누가 귀하의 이메일 인프라에 액세스할 수 있습니까?](#who-has-access-to-your-email-infrastructure)
  * [어떤 인프라 제공자를 사용하시나요?](#what-infrastructure-providers-do-you-use)
  * [데이터 처리 계약(DPA)을 제공하시나요?](#do-you-offer-a-data-processing-agreement-dpa)
  * [데이터 침해 알림을 어떻게 처리하시나요?](#how-do-you-handle-data-breach-notifications)
  * [테스트 환경을 제공하시나요?](#do-you-offer-a-test-environment)
  * [모니터링 및 알림 도구를 제공하시나요?](#do-you-provide-monitoring-and-alerting-tools)
  * [고가용성을 어떻게 보장하시나요?](#how-do-you-ensure-high-availability)
  * [귀하는 국방권한법(NDAA) 제889조를 준수하고 있습니까?](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [시스템 및 기술 세부 정보](#system-and-technical-details)
  * [이메일과 그 내용을 저장하시나요?](#do-you-store-emails-and-their-contents)
  * [이메일 전달 시스템은 어떻게 작동합니까?](#how-does-your-email-forwarding-system-work)
  * [이메일을 전달하기 위해 어떻게 처리합니까?](#how-do-you-process-an-email-for-forwarding)
  * [이메일 배달 문제를 어떻게 처리하시나요?](#how-do-you-handle-email-delivery-issues)
  * [IP 주소가 차단되면 어떻게 처리하시나요?](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [우편마스터 주소란 무엇입니까?](#what-are-postmaster-addresses)
  * [답장 불가 주소란 무엇입니까?](#what-are-no-reply-addresses)
  * [귀하의 서버의 IP 주소는 무엇입니까?](#what-are-your-servers-ip-addresses)
  * [허용 목록이 있나요?](#do-you-have-an-allowlist)
  * [기본적으로 허용 목록에 추가되는 도메인 이름 확장자는 무엇입니까?](#what-domain-name-extensions-are-allowlisted-by-default)
  * [허용 목록 기준은 무엇입니까?](#what-is-your-allowlist-criteria)
  * [무료로 사용할 수 있는 도메인 이름 확장자는 무엇입니까?](#what-domain-name-extensions-can-be-used-for-free)
  * [그레이리스트가 있나요?](#do-you-have-a-greylist)
  * [거부 목록이 있나요?](#do-you-have-a-denylist)
  * [속도 제한이 있나요?](#do-you-have-rate-limiting)
  * [백스캐터로부터 어떻게 보호합니까?](#how-do-you-protect-against-backscatter)
  * [알려진 스팸 발송자의 메일 반송 방지](#prevent-bounces-from-known-mail-from-spammers)
  * [백스캐터로부터 보호하기 위해 불필요한 반사를 방지합니다.](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [이메일 지문을 어떻게 결정합니까?](#how-do-you-determine-an-email-fingerprint)
  * [25번 포트가 아닌 다른 포트로 이메일을 전달할 수 있나요? (예: ISP에서 25번 포트를 차단한 경우)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Gmail 별칭에 플러스 + 기호를 지원합니까?](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [하위 도메인을 지원합니까?](#does-it-support-sub-domains)
  * [이것이 내 이메일 헤더를 전달합니까?](#does-this-forward-my-emails-headers)
  * [이게 잘 테스트된 건가요?](#is-this-well-tested)
  * [SMTP 응답 메시지와 코드를 전달하시나요?](#do-you-pass-along-smtp-response-messages-and-codes)
  * [스팸 발송자를 방지하고 좋은 이메일 전달 평판을 보장하려면 어떻게 해야 합니까?](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [도메인 이름에 대한 DNS 조회를 어떻게 수행합니까?](#how-do-you-perform-dns-lookups-on-domain-names)
* [계정 및 청구](#account-and-billing)
  * [유료 플랜에 대해 환불 보장을 제공하시나요?](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [요금제를 변경하면 일할 계산하여 차액을 환불해 주시나요?](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [이 이메일 전달 서비스를 "대체" 또는 "폴오버" MX 서버로만 사용할 수 있나요?](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [특정 별칭을 비활성화할 수 있나요?](#can-i-disable-specific-aliases)
  * [여러 수신자에게 이메일을 전달할 수 있나요?](#can-i-forward-emails-to-multiple-recipients)
  * [여러 개의 글로벌 포괄 수신자를 가질 수 있습니까?](#can-i-have-multiple-global-catch-all-recipients)
  * [별칭별로 전달할 수 있는 이메일 주소 수에 최대 제한이 있습니까?](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [이메일을 재귀적으로 전달할 수 있나요?](#can-i-recursively-forward-emails)
  * [내 허락 없이 사람들이 내 이메일 전달을 등록하거나 등록 취소할 수 있습니까?](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [어떻게 무료인가요?](#how-is-it-free)
  * [최대 이메일 크기 제한은 무엇입니까?](#what-is-the-max-email-size-limit)
  * [이메일 로그를 저장하시나요?](#do-you-store-logs-of-emails)
  * [오류 로그를 저장하시나요?](#do-you-store-error-logs)
  * [내 이메일을 읽어요?](#do-you-read-my-emails)
  * [이걸로 Gmail에서 "메일 보내기"를 할 수 있나요?](#can-i-send-mail-as-in-gmail-with-this)
  * [이걸로 Outlook에서 "메일 보내기"를 할 수 있나요?](#can-i-send-mail-as-in-outlook-with-this)
  * [이것으로 Apple Mail 및 iCloud Mail에서 "메일 보내기"를 할 수 있나요?](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [이걸로 무제한으로 이메일을 전달할 수 있나요?](#can-i-forward-unlimited-emails-with-this)
  * [하나의 가격으로 무제한 도메인을 제공하시나요?](#do-you-offer-unlimited-domains-for-one-price)
  * [어떤 결제 방법을 허용하시나요?](#which-payment-methods-do-you-accept)
* [추가 자료](#additional-resources)

## 빠른 시작 {#quick-start}

이메일 전달을 시작하려면:

1. **[forwardemail.net/register](https://forwardemail.net/register)에서 계정 생성**

2. **[내 계정 → 도메인](/my-account/domains)에서 도메인 추가 및 확인**

3. **[내 계정 → 도메인](/my-account/domains) → 별칭 아래 이메일 별칭/사서함 추가 및 구성**

4. 새 별칭 중 하나로 이메일을 보내어 **설정 테스트**

> \[!TIP]
> DNS 변경 사항이 전 세계에 적용되는 데 최대 24~48시간이 걸릴 수 있지만, 일반적으로 훨씬 빨리 적용됩니다.

> \[!IMPORTANT]
> 전달성을 향상시키려면 [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email), [DMARC](#how-do-i-set-up-dmarc-for-forward-email) 레코드를 설정하는 것이 좋습니다.

## 소개 {#introduction}

### 전달 이메일이란 무엇입니까? {#what-is-forward-email}

> \[!NOTE]
> Forward Email은 전체 이메일 호스팅 솔루션의 비용과 유지 관리 없이 전문적인 이메일 주소를 원하는 개인, 소규모 기업 및 개발자에게 적합합니다.

Forward Email은 **모든 기능을 갖춘 이메일 서비스 제공업체**이자 **맞춤형 도메인 이름을 위한 이메일 호스팅 제공업체**입니다.

유일하게 무료이고 오픈 소스인 서비스로, 자체 이메일 서버를 설정하고 유지 관리하는 복잡한 작업 없이 사용자 정의 도메인 이메일 주소를 사용할 수 있습니다.

당사 서비스는 귀하의 사용자 지정 도메인으로 전송된 이메일을 귀하의 기존 이메일 계정으로 전달해 드립니다. 심지어 당사를 전담 이메일 호스팅 제공업체로 이용하실 수도 있습니다.

Forward Email의 주요 기능:

* **맞춤형 도메인 이메일**: 자체 도메인 이름과 함께 전문 이메일 주소를 사용하세요.
* **프리 티어**: 기본 이메일 전달 서비스 무료 제공
* **강화된 개인정보 보호**: 이메일을 열람하거나 데이터를 판매하지 않습니다.
* **오픈 소스**: 전체 코드베이스는 GitHub에서 이용 가능합니다.
* **SMTP, IMAP, POP3 지원**: 완벽한 이메일 송수신 기능 제공
* **종단 간 암호화**: OpenPGP/MIME 지원
* **맞춤형 포괄 별칭**: 무제한 이메일 별칭 생성

[이메일 비교 페이지](/blog/best-email-service)에서 56개 이상의 다른 이메일 서비스 제공업체와 비교해 보세요.

> \[!TIP]
> 무료 [기술 백서](/technical-whitepaper.pdf)을 읽고 이메일 전달에 대해 자세히 알아보세요.

### 전달 이메일 {#who-uses-forward-email}}을 사용하는 사람은 누구입니까?

저희는 50만 개 이상의 도메인과 다음과 같은 주요 사용자에게 이메일 호스팅 및 이메일 전달 서비스를 제공합니다.

| 고객 | 사례 연구 |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 미국 해군사관학교 | [:page_facing_up: Case Study](/blog/docs/federal-government-email-service-section-889-compliant) |
| 정식 | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| 넷플릭스 게임 |  |
| 리눅스 재단 | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| PHP 재단 |  |
| 폭스 뉴스 라디오 |  |
| 디즈니 광고 판매 |  |
| 제이쿼리 | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| 리니지OS |  |
| 우분투 | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| 무료 | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| 루분투 | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| 케임브리지 대학교 | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| 메릴랜드 대학교 | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| 워싱턴 대학교 | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| 터프츠 대학교 | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| 스와스모어 칼리지 | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| 남호주 정부 |  |
| 도미니카 공화국 정부 |  |
| Fly<span>.</span>io |  |
| RCD 호텔 |  |
| 아이작 Z. 슐루터(npm) | [:page_facing_up: Case Study](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| 데이비드 하이네마이어 한슨(Ruby on Rails) |  |

### 전달 이메일 기록은 무엇입니까? {#what-is-forward-emails-history}

[저희 소개 페이지](/about)에서 이메일 전달에 대한 자세한 내용을 알아보세요.

### 이 서비스는 얼마나 빠릅니까? {#how-fast-is-this-service}

> \[!NOTE]
> 저희 시스템은 속도와 안정성을 고려하여 설계되었으며, 여러 대의 중복 서버를 통해 이메일이 신속하게 전달되도록 보장합니다.

전달 이메일은 일반적으로 수신 후 몇 초 이내에 최소한의 지연으로 메시지를 전달합니다.

성과 지표:

* **평균 전송 시간**: 수신에서 전달까지 5~10초 이내 ([TTI(Time to Inbox) 모니터링 페이지를 참조하세요.](/tti))
* **가동 시간**: 99.9% 이상의 서비스 가용성
* **글로벌 인프라**: 최적의 라우팅을 위해 전략적으로 배치된 서버
* **자동 확장**: 이메일 사용량이 많은 시간대에 시스템이 확장됩니다.

지연된 대기열에 의존하는 다른 공급업체와 달리 당사는 실시간으로 운영합니다.

우리는 [오류의 예외](#do-you-store-error-logs)과 [아웃바운드 SMTP](#do-you-support-sending-email-with-smtp)을 사용하여 디스크에 쓰거나 로그를 저장하지 않습니다([개인정보 보호정책](/privacy) 참조).

모든 작업은 메모리와 [우리의 소스 코드는 GitHub에 있습니다](https://github.com/forwardemail)에서 수행됩니다.

## 이메일 클라이언트 {#email-clients}

### 썬더버드 {#thunderbird}

1. 전달 이메일 대시보드에서 새 별칭을 만들고 비밀번호를 생성하세요.
2. Thunderbird를 열고 **편집 → 계정 설정 → 계정 작업 → 메일 계정 추가**로 이동하세요.
3. 이름, 전달 이메일 주소, 비밀번호를 입력하세요.
4. **수동 구성**을 클릭하고 다음을 입력하세요.
* 수신: IMAP, `imap.forwardemail.net`, 포트 993, SSL/TLS
* 발신: SMTP, `smtp.forwardemail.net`, 포트 587, STARTTLS
5. **완료**를 클릭하세요.

### Microsoft Outlook {#microsoft-outlook}

1. 전달 이메일 대시보드에서 새 별칭을 만들고 비밀번호를 생성하세요.
2. **파일 → 계정 추가**로 이동하세요.
3. 전달 이메일 주소를 입력하고 **연결**을 클릭하세요.
4. **고급 옵션**을 선택하고 **계정을 직접 설정**을 선택하세요.
5. **IMAP**을 선택하고 다음을 입력하세요.
* 수신: `imap.forwardemail.net`, 포트 993, SSL
* 발신: `smtp.forwardemail.net`, 포트 587, TLS
* 사용자 이름: 전체 이메일 주소
* 비밀번호: 생성된 비밀번호
6. **연결**을 클릭하세요.

### Apple 메일 {#apple-mail}

1. 전달 이메일 대시보드에서 새 별칭을 만들고 비밀번호를 생성하세요.
2. **메일 → 환경설정 → 계정 → +**로 이동하세요.
3. **다른 메일 계정**을 선택하세요.
4. 이름, 전달 이메일 주소, 비밀번호를 입력하세요.
5. 서버 설정에서 다음을 입력하세요.
* 수신: `imap.forwardemail.net`
* 발신: `smtp.forwardemail.net`
* 사용자 이름: 전체 이메일 주소
* 비밀번호: 생성된 비밀번호
6. **로그인**을 클릭하세요.

### 모바일 기기 {#mobile-devices}

iOS의 경우:

1. **설정 → 메일 → 계정 → 계정 추가 → 기타**로 이동합니다.
2. **메일 계정 추가**를 탭하고 세부 정보를 입력합니다.
3. 서버 설정은 위와 동일한 IMAP 및 SMTP 설정을 사용합니다.

안드로이드의 경우:

1. **설정 → 계정 → 계정 추가 → 개인(IMAP)**으로 이동합니다.
2. 전달 이메일 주소와 비밀번호를 입력합니다.
3. 서버 설정은 위와 동일한 IMAP 및 SMTP 설정을 사용합니다.

### Gmail을 사용하여 메일을 보내는 방법 {#how-to-send-mail-as-using-gmail}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">예상 설정 시간:</strong>
<span>10분 미만</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
시작하기:
</strong>
<span>
위의 <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">이메일 전달을 시작하고 설정하는 방법</a>에 있는 지침을 따르셨다면 아래 내용을 계속 읽어보세요.
</span>
</div>

<div id="메일을 콘텐츠로 보내기">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
중요:
</strong>
<span>
<a href="/terms" class="alert-link" target="_blank">이용약관</a>, <a href="/privacy" class="alert-link" target="_blank">개인정보처리방침</a> 및 <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">아웃바운드 SMTP 제한</a>을 반드시 읽어보시기 바랍니다. 귀하의 사용은 본 약관을 인지하고 동의하는 것으로 간주됩니다.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
중요:
</strong>
<span>
개발자이신 경우 <a class="alert-link" href="/email-api#outbound-emails" target="_blank">이메일 API 문서</a>를 참조하세요.
</span>
</div>

1. <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 설정 <i class="fa fa-angle-right"></i> 아웃바운드 SMTP 구성으로 이동하여 설정 지침을 따르세요.

2. <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">내 계정 <i class="fa fa-angle-right"></i>도메인</a> <i class="fa fa-angle-right"></i>별칭(예: <code><hello@example.com></code>)에서 도메인에 대한 새 별칭을 만듭니다.

3. 새로 생성된 별칭 옆에 있는 <strong class="text-success"><i class="fa fa-key"></i>비밀번호 생성</strong>을 클릭하세요. 화면에 표시된 생성된 비밀번호를 클립보드에 복사하여 안전하게 저장하세요.

4. [지메일](https://gmail.com)으로 이동한 후 [설정 <i class="fa fa-angle-right"></i> 계정 및 가져오기 <i class="fa fa-angle-right"></i> 메일 보내기](https://mail.google.com/mail/u/0/#settings/accounts) 아래에서 "다른 이메일 주소 추가"를 클릭합니다.

5. "이름"을 입력하라는 메시지가 나타나면 이메일을 "보낸 사람"으로 표시할 이름을 입력합니다(예: "Linus Torvalds").

6. "이메일 주소"를 입력하라는 메시지가 표시되면 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 별칭(예: <code><hello@example.com></code>)에서 생성한 별칭의 전체 이메일 주소를 입력하세요.

7. "별칭으로 처리" 체크 해제

8. 계속하려면 "다음 단계"를 클릭하세요.

9. "SMTP 서버"를 입력하라는 메시지가 표시되면 <code>smtp.forwardemail.net</code>을 입력하고 포트는 <code>587</code>로 둡니다.

10. "사용자 이름"을 입력하라는 메시지가 표시되면 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 별칭(예: <code><hello@example.com></code>)에서 생성한 별칭의 전체 이메일 주소를 입력하세요.

11. "비밀번호"를 입력하라는 메시지가 표시되면 위 3단계의 <strong class="text-success"><i class="fa fa-key"></i>비밀번호 생성</strong>에서 입력한 비밀번호를 붙여넣습니다.

12. "TLS를 사용한 보안 연결" 라디오 버튼을 체크된 상태로 둡니다.

13. "계정 추가"를 클릭하여 계속 진행하세요.

14. [지메일](https://gmail.com)에 대한 새 탭을 열고 확인 이메일이 도착할 때까지 기다리세요("메일 보내기"를 시도하는 이메일 주소의 소유자임을 확인하는 확인 코드를 받게 됩니다).

15. 도착하면 이전 단계에서 받은 프롬프트에 확인 코드를 복사하여 붙여넣습니다.

16. 완료 후 이메일로 돌아가 "요청 확인" 링크를 클릭하세요. 이메일이 올바르게 설정되려면 이 단계와 이전 단계를 모두 수행해야 할 가능성이 높습니다.

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
축하합니다!
</strong>
<span>
모든 단계를 성공적으로 완료했습니다.
</span>
</div>
</div>

</div>

### Gmail을 사용하여 메일 보내기에 대한 기존 무료 가이드는 무엇입니까? {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">중요:</strong> 이 기존 무료 가이드는 <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">we에서 이제 아웃바운드 SMTP를 지원</a>하므로 2023년 5월부터 지원이 중단됩니다. 아래 가이드를 사용하는 경우, <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">this을 사용하면 Gmail에서 아웃바운드 이메일이 <span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>으로 표시됩니다.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">예상 설정 시간:</strong>
<span>10분 미만</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
시작하기:
</strong>
<span>
위의 <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">이메일 전달을 시작하고 설정하는 방법</a>에 있는 지침을 따르셨다면 아래 내용을 계속 읽어보세요.
</span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="Gmail을 사용하여 메일을 보내는 방법" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="레거시-프리-가이드">

1. 이 기능을 사용하려면 [Gmail의 2단계 인증][gmail-2fa]을 활성화해야 합니다. 활성화되어 있지 않으면 <https://www.google.com/landing/2step/>>을 방문하세요.

2. 2단계 인증이 활성화되면(또는 이미 활성화한 경우) <https://myaccount.google.com/apppasswords>.>을 방문하세요.

3. "앱 비밀번호를 생성할 앱 및 기기를 선택하세요"라는 메시지가 표시되면:
* "앱 선택" 드롭다운에서 "메일"을 선택하세요.
* "기기 선택" 드롭다운에서 "기타"를 선택하세요.
* 텍스트 입력 메시지가 표시되면 전달받을 사용자 지정 도메인의 이메일 주소를 입력하세요(예: <code><hello@example.com></code> - 여러 계정으로 이 서비스를 사용하는 경우 추적하는 데 도움이 됩니다).

4. 자동으로 생성된 비밀번호를 클립보드에 복사하세요.
<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
중요:
</strong>
<span>
G Suite를 사용하는 경우 관리자 패널 <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">앱 <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Gmail 설정 <i class="fa fa-angle-right"></i> 설정</a>으로 이동하여 "사용자가 외부 SMTP 서버를 통해 메일을 보내도록 허용..."을 선택하세요. 이 변경 사항이 적용되려면 약간의 시간이 소요될 수 있으니 잠시 기다려 주세요.
</span>
</div>

5. [지메일](https://gmail.com)으로 이동한 후 [설정 <i class="fa fa-angle-right"></i> 계정 및 가져오기 <i class="fa fa-angle-right"></i> 메일 보내기](https://mail.google.com/mail/u/0/#settings/accounts) 아래에서 "다른 이메일 주소 추가"를 클릭합니다.

6. "이름"을 입력하라는 메시지가 표시되면 "보낸 사람"으로 이메일을 표시할 이름을 입력합니다(예: "Linus Torvalds").

7. "이메일 주소"를 입력하라는 메시지가 표시되면 위에서 사용한 사용자 지정 도메인의 이메일 주소를 입력하세요(예: <code><hello@example.com></code>).

8. "별칭으로 처리" 체크 해제

9. 계속하려면 "다음 단계"를 클릭하세요.

10. "SMTP 서버"를 입력하라는 메시지가 표시되면 <code>smtp.gmail.com</code>을 입력하고 포트는 <code>587</code>로 두세요.

11. "사용자 이름"을 입력하라는 메시지가 표시되면 Gmail 주소에서 <span>gmail.com</span> 부분을 제외한 부분을 입력하세요(예: 이메일 주소가 <span><user@gmail.com></span>인 경우 "user"만 입력).
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
중요:
</strong>
<span>
"사용자 이름" 부분이 자동 완성된 경우, Gmail 주소의 사용자 이름 부분으로 <u><strong>변경</strong></u>해야 합니다.
</span>
</div>

12. "비밀번호"를 입력하라는 메시지가 표시되면 위 2단계에서 생성한 비밀번호를 클립보드에서 붙여넣습니다.

13. "TLS를 사용한 보안 연결" 라디오 버튼을 체크된 상태로 둡니다.

14. "계정 추가"를 클릭하여 계속 진행하세요.

15. [지메일](https://gmail.com)에 대한 새 탭을 열고 확인 이메일이 도착할 때까지 기다리세요("메일 보내기"를 시도하는 이메일 주소의 소유자임을 확인하는 확인 코드를 받게 됩니다).

16. 도착하면 이전 단계에서 받은 프롬프트에 확인 코드를 복사하여 붙여넣습니다.

17. 완료 후 이메일로 돌아가 "요청 확인" 링크를 클릭하세요. 이메일이 올바르게 설정되려면 이 단계와 이전 단계를 모두 수행해야 할 가능성이 높습니다.

</div>

### 고급 Gmail 라우팅 구성 {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">예상 설정 시간:</strong>
<span>15-30분</span>
</div>

Gmail에서 고급 라우팅을 설정하여 사서함과 일치하지 않는 별칭을 Forward Email의 메일 교환으로 전달하려면 다음 단계를 따르세요.

1. [admin.google.com](https://admin.google.com)에서 Google 관리 콘솔에 로그인하세요.
2. **앱 → Google Workspace → Gmail → 라우팅**으로 이동하세요.
3. **경로 추가**를 클릭하고 다음 설정을 구성하세요.

**단일 수신자 설정:**

* "봉투 수신자 변경"을 선택하고 기본 Gmail 주소를 입력하세요.
* "X-Gm-Original-To 헤더를 원래 수신자와 함께 추가"를 체크하세요.

**봉투 수신자 패턴:**

* 존재하지 않는 모든 사서함과 일치하는 패턴을 추가합니다(예: `.*@yourdomain.com`)

**이메일 서버 설정:**

* "호스트로 라우팅"을 선택하고 `mx1.forwardemail.net`을 기본 서버로 입력하세요.
* `mx2.forwardemail.net`을 백업 서버로 추가하세요.
* 포트를 25로 설정하세요.
* 보안을 위해 "TLS 필요"를 선택하세요.

4. **저장**을 클릭하여 경로를 생성합니다.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
중요:
</strong>
<span>
이 구성은 맞춤 도메인이 있는 Google Workspace 계정에만 적용되며, 일반 Gmail 계정에는 적용되지 않습니다.
</span>
</div>

### 고급 Outlook 라우팅 구성 {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">예상 설정 시간:</strong>
<span>15-30분</span>
</div>

사서함과 일치하지 않는 별칭이 Forward Email의 메일 교환으로 전달되도록 고급 라우팅을 설정하려는 Microsoft 365(이전 Office 365) 사용자의 경우:

1. [admin.microsoft.com](https://admin.microsoft.com)에서 Microsoft 365 관리 센터에 로그인합니다.
2. **Exchange → 메일 흐름 → 규칙**으로 이동합니다.
3. **규칙 추가**를 클릭하고 **새 규칙 만들기**를 선택합니다.
4. 규칙 이름을 지정합니다(예: "존재하지 않는 사서함을 전달하려면 전자 메일을 전달합니다").
5. **다음과 같은 경우 이 규칙 적용**에서 다음을 선택합니다.
* "받는 사람 주소가..."와 일치합니다.
* 도메인의 모든 주소와 일치하는 패턴을 입력합니다(예: `*@yourdomain.com`).
6. **다음 작업을 수행합니다**에서 다음을 선택합니다.
* "메시지를 다음으로 리디렉션합니다..."
* "다음 메일 서버"를 선택합니다.
* `mx1.forwardemail.net`와 포트 25를 입력합니다.
* `mx2.forwardemail.net`을 백업 서버로 추가합니다.
7. **다음 조건을 제외하고**에서 다음을 선택합니다.
* "받는 사람..."
* 전달하지 않을 기존 사서함을 모두 추가합니다.
8. 다음을 설정합니다. 다른 메일 흐름 규칙 이후에 실행되도록 규칙 우선순위를 설정합니다.
9. **저장**을 클릭하여 규칙을 활성화합니다.

## 문제 해결 {#troubleshooting}

### 테스트 이메일을 받지 못하는 이유는 무엇입니까? {#why-am-i-not-receiving-my-test-emails}

자신에게 테스트 이메일을 보내는 경우 동일한 "Message-ID" 헤더가 있기 때문에 받은 편지함에 표시되지 않을 수 있습니다.

이는 널리 알려진 문제이며 Gmail과 같은 서비스에도 영향을 미칩니다. <a href="https://support.google.com/a/answer/1703601">Here은 이 문제와 관련된 공식 Gmail 답변입니다</a>.

문제가 계속되면 DNS 전파 문제일 가능성이 높습니다. 조금 더 기다렸다가 다시 시도해 보세요(또는 <strong class="notranslate">TXT</strong> 레코드에 더 낮은 TTL 값을 설정해 보세요).

**아직도 문제가 있나요?** <a href="/help">저희에게 문의</a>하시면 문제를 조사하고 빠른 해결책을 찾을 수 있도록 도와드리겠습니다.

### 이메일 전달 기능을 사용하려면 이메일 클라이언트를 어떻게 구성해야 합니까? {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
저희 서비스는 다음과 같은 인기 이메일 클라이언트와 호환됩니다.
<ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
<li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> 안드로이드&trade;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="배지 배지-밝은색 배경-밝은색 텍스트-어두운색"><i class="fab fa-linux"></i> 리눅스&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="배지 배지-밝은색 배경-밝은색 텍스트-어두운색"><i class="fas fa-desktop"></i> 데스크톱</a></li>
<li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="배지 배지-밝은색 배경-밝은색 텍스트-어두운색"><i class="fab fa-firefox-browser"></i> 모질라 파이어폭스&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="배지 배지-밝음 배경-밝음 텍스트-어두움">사파리&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="배지 배지-밝음 배경-밝음 텍스트-어두움"><i class="fab fa-chrome"></i> 구글 크롬&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="배지 배지-밝음 배경-밝음 텍스트-어두움"><i class="fas fa-terminal"></i> 터미널</a></li>
  </ul>
</div>

<div class="alert alert-primary">
사용자 이름은 별칭의 이메일 주소이고, 비밀번호는 <strong class="text-success"><i class="fa fa-key"></i>비밀번호 생성</strong>("일반 비밀번호")에서 생성한 것입니다.
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
팁:
</strong>
<span>Thunderbird를 사용하는 경우 "연결 보안"이 "SSL/TLS"로, 인증 방법이 "일반 비밀번호"로 설정되어 있는지 확인하세요.</span>
</div>

| 유형 | 호스트 이름 | 규약 | 포트 |
| :--: | :---------------------: | :-------------------------------------: | :----------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` | SSL/TLS **권장** | `993` 및 `2993` |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **권장** 또는 TLS(STARTTLS) | SSL/TLS의 경우 `465` 및 `2465` (또는) TLS(STARTTLS)의 경우 `587`, `2587`, `2525` 및 `25` |

### 내 이메일이 스팸 및 정크 메일에 분류되는 이유는 무엇이며 도메인 평판을 어떻게 확인할 수 있습니까? {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}

이 섹션에서는 발신 메일이 SMTP 서버(예: `smtp.forwardemail.net`)를 사용하는지(또는 `mx1.forwardemail.net` 또는 `mx2.forwardemail.net`를 통해 전달되는지)와 해당 메일이 수신자의 스팸 또는 정크 메일 폴더로 배달되는지에 대한 안내를 제공합니다.

저희는 [IP 주소](#what-are-your-servers-ip-addresses)과 [모든 평판 좋은 DNS 거부 목록](#how-do-you-handle-your-ip-addresses-becoming-blocked)을 정기적으로 모니터링합니다. **따라서 이는 도메인 평판과 관련된 문제일 가능성이 높습니다.**

이메일은 여러 가지 이유로 스팸 폴더로 갈 수 있습니다.

1. **인증 누락**: [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) 및 [DMARC](#how-do-i-set-up-dmarc-for-forward-email) 레코드를 설정합니다.

2. **도메인 평판**: 새로운 도메인은 전송 내역을 확립하기 전까지는 중립적인 평판을 갖는 경우가 많습니다.

3. **콘텐츠 트리거**: 특정 단어나 구문은 스팸 필터를 트리거할 수 있습니다.

4. **전송 패턴**: 이메일 양이 갑자기 늘어나면 의심스러워 보일 수 있습니다.

다음 도구 중 하나 이상을 사용하여 도메인의 평판과 분류를 확인해 보세요.

| 도구 이름 | URL | 유형 |
| ------------------------------------------- | ---------------------------------------------------------------- | ---------------------- |
| Cloudflare 도메인 분류 피드백 | <https://radar.cloudflare.com/도메인/피드백> | 분류 |
| Spamhaus IP 및 도메인 평판 검사기 | <https://check.spamhaus.org/> | DNSBL |
| Cisco Talos IP 및 도메인 평판 센터 | <https://talosintelligence.com/reputation_center> | 평판 |
| Barracuda IP 및 도메인 평판 조회 | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL |
| MX Toolbox 블랙리스트 확인 | <https://mxtoolbox.com/blacklists.aspx> | 블랙리스트 |
| Google 포스트마스터 도구 | <https://www.gmail.com/postmaster/> | 평판 |
| 야후 발신자 허브 | <https://senders.yahooinc.com/> | 평판 |
| MultiRBL.valli.org 블랙리스트 확인 | <https://multirbl.valli.org/lookup/> | DNSBL |
| 발신자 점수 | <https://senderscore.org/act/차단목록-제거/> | 평판 |
| 평가절하 | <https://www.invaluement.com/lookup/> | DNSBL |
| SURBL | <https://www.surbl.org/> | DNSBL |
| Apple/Proofpoint IP 제거 | <https://ipcheck.proofpoint.com/> | 제거 |
| 클라우드마크 IP 제거 | <https://csi.cloudmark.com/ko/reset/> | 제거 |
| 스팸캅 | <https://www.spamcop.net/bl.shtml> | DNSBL |
| Microsoft Outlook 및 Office 365 IP 제거 | <https://sendersupport.olc.protection.outlook.com/pm/우편번호> | 제거 |
| UCEPROTECT의 레벨 1, 2, 3 | <https://www.uceprotect.net/ko/rblcheck.php> | DNSBL |
| UCEPROTECT의 backscatterer.org | <https://www.backscatterer.org/> | 백스캐터 보호 |
| UCEPROTECT의 whitelisted.org | <https://www.whitelisted.org/> (수수료 필요) | DNSWL |
| AT&T | `abuse_rbl@abuse-att.net` | 제거 |
| AOL/Verizon(예: `[IPTS04]`) | <https://senders.yahooinc.com/> | 제거 |
| 콕스 커뮤니케이션즈 | `unblock.request@cox.net` | 제거 |
| t-online.de(독일/T-Mobile) | `tobr@rx.t-online.de` | 제거 |

> \[!TIP]
> 긍정적인 평판을 구축하기 위해 소량의 고품질 이메일로 시작한 후, 대량의 이메일을 보내세요.

> \[!IMPORTANT]
> 도메인이 블랙리스트에 등록된 경우, 각 블랙리스트마다 별도의 삭제 절차가 있습니다. 자세한 내용은 해당 웹사이트를 참조하세요.

> \[!TIP]
> 추가 도움이 필요하시거나 특정 이메일 서비스 제공업체에서 저희 이메일을 스팸으로 오인하는 경우, <a href="/help">문의</a>해 주세요.

### 스팸 이메일을 받으면 어떻게 해야 하나요? {#what-should-i-do-if-i-receive-spam-emails}

가능하다면 이메일 수신을 거부하고 발신자를 차단하세요.

해당 메시지를 스팸으로 신고하지 마시고, 대신 수동으로 선별하고 개인정보 보호에 중점을 둔 학대 방지 시스템으로 전달해 주세요.

**스팸을 전달할 이메일 주소는 다음과 같습니다.** <abuse@forwardemail.net>

### Gmail에서 나에게 전송된 테스트 이메일이 "의심스럽다"고 표시되는 이유는 무엇입니까? {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Gmail에서 자신에게 테스트 메일을 보낼 때 이 오류 메시지가 나타나거나 별칭으로 이메일을 보내는 사람이 처음으로 귀하의 이메일을 볼 때 이 오류 메시지가 나타나면 **걱정하지 마세요**. 이는 Gmail에 내장된 안전 기능입니다.

"안전해 보입니다"를 클릭하기만 하면 됩니다. 예를 들어, 다른 사람에게 메일 보내기 기능을 사용하여 테스트 메시지를 보내면 상대방은 이 메시지를 보지 못하게 됩니다.

하지만 이 메시지가 표시된다면, 일반적으로 이메일이 <john@customdomain.com> 대신 <john@gmail.com>에서 오는 것을 보고 익숙해졌기 때문일 수 있습니다(단순 예시일 뿐입니다). Gmail은 만일의 사태에 대비하여 사용자에게 알림을 보내 안전을 확보하는 역할을 하며, 이 경우 해결 방법은 없습니다.

### Gmail에서 via forwardemail dot net을 제거할 수 있나요? {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

이 주제는 [Gmail에서 발신자 이름 옆에 추가 정보가 나타나는 널리 알려진 문제](https://support.google.com/mail/answer/1311182)와 관련이 있습니다.

2023년 5월부터 모든 유료 사용자를 대상으로 SMTP를 이용한 이메일 전송 기능을 추가 기능으로 지원합니다. 즉, Gmail에서 <span class="notranslate">via forwardemail dot net</span> 기능을 제거할 수 있습니다.

이 FAQ 주제는 [Gmail을 사용하여 메일을 보내는 방법](#how-to-send-mail-as-using-gmail) 기능을 사용하는 사람들에게만 해당됩니다.

구성 지침은 [SMTP를 사용하여 이메일을 보내는 것을 지원합니까?](#do-you-support-sending-email-with-smtp) 섹션을 참조하세요.

## 데이터 관리 {#data-management}

### 서버는 어디에 있습니까? {#where-are-your-servers-located}

> \[!TIP]
> 곧 [forwardemail.eu](https://forwardemail.eu)에서 호스팅되는 EU 데이터 센터 위치를 발표할 예정입니다. 최신 소식을 확인하려면 <https://github.com/orgs/forwardemail/discussions/336>>에서 토론을 구독하세요.

당사 서버는 주로 콜로라도주 덴버에 위치해 있습니다. 전체 IP 주소 목록은 <https://forwardemail.net/ips>>에서 확인하세요.

[GDPR](/gdpr), [DPA](/dpa), [은둔](/privacy) 페이지에서 하위 프로세서에 대해 알아볼 수 있습니다.

### 내 사서함을 내보내고 백업하려면 어떻게 해야 합니까? {#how-do-i-export-and-backup-my-mailbox}

언제든지 사서함을 [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [엠박스](https://en.wikipedia.org/wiki/Mbox) 또는 암호화된 [SQLite](https://en.wikipedia.org/wiki/SQLite) 형식으로 내보낼 수 있습니다.

<a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 별칭 <i class="fa fa-angle-right"></i>으로 이동하여 백업을 다운로드하고 원하는 내보내기 형식 유형을 선택하세요.

내보내기가 완료되면 다운로드 링크가 이메일로 전송됩니다.

보안상의 이유로 이 내보내기 다운로드 링크는 4시간 후에 만료됩니다.

내보낸 EML 또는 Mbox 형식을 검사해야 하는 경우 다음과 같은 오픈 소스 도구가 유용할 수 있습니다.

| 이름 | 체재 | 플랫폼 | GitHub URL |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| MBox 뷰어 | 엠박스 | 윈도우 | <https://github.com/eneam/mboxviewer> |
| mbox-웹뷰어 | 엠박스 | 모든 플랫폼 | <https://github.com/PHMRanger/mbox-웹-뷰어> |
| EmlReader | EML | 윈도우 | <https://github.com/ayamadori/EmlReader> |
| 이메일 뷰어 | EML | VS코드 | <https://github.com/joelharkes/vscode_email_viewer> |
| eml 리더 | EML | 모든 플랫폼 | <https://github.com/s0ph1e/eml-reader> |

또한 Mbox 파일을 EML 파일로 변환해야 하는 경우 <https://github.com/noelmartinon/mboxzilla>.을 사용할 수 있습니다.

### 기존 사서함을 가져오고 마이그레이션하려면 어떻게 해야 합니까? {#how-do-i-import-and-migrate-my-existing-mailbox}

아래 지침에 따라 이메일을 Forward Email로 쉽게 가져올 수 있습니다(예: [천둥새](https://www.thunderbird.net) 사용):

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
중요:
</strong>
<span>
기존 이메일을 가져오려면 다음 단계를 모두 따라야 합니다.
</span>
</div>

1. 기존 이메일 제공업체에서 이메일을 내보냅니다.

| 이메일 제공자 | 내보내기 형식 | 수출 지침 |
| -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 지메일 | MBOX | <https://takeout.google.com/settings/takeout/custom/gmail> |
| 시야 | PST | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">팁:</strong> <span>Outlook(<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">PST 내보내기 형식</a>)을 사용하는 경우 아래 "기타"에 있는 지침을 따르세요. 하지만 아래에는 운영 체제에 따라 PST를 MBOX/EML 형식으로 변환하는 링크를 제공합니다.<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Windows용 Zinkuba</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">Windows cygwin용 readpst</a> – (예: <code>readpst -u -o $OUT_DIR $IN_DIR</code>은 <code>$OUT_DIR</code>과 <code>$IN_DIR</code>을 대체합니다. (각각 출력 디렉토리 및 입력 디렉토리 경로로 대체).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">Ubuntu/Linux의 경우 readpst</a> – (예: <code>sudo apt-get install readpst</code>를 실행한 다음 <code>readpst -u -o $OUT_DIR $IN_DIR</code>을 실행하여 <code>$OUT_DIR</code> 및 <code>$IN_DIR</code>을 각각 출력 디렉토리 및 입력 디렉토리 경로로 대체).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">macOS의 경우 readpst(brew를 통해)</a> – (예: <code>brew install libpst</code>를 실행한 다음 <code>readpst -u -o $OUT_DIR $IN_DIR</code>을 실행하여 <code>$OUT_DIR</code> 및 <code>$IN_DIR</code>은 각각 출력 디렉터리와 입력 디렉터리 경로입니다.)</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">Windows용 PST 변환기(GitHub)</a></li></ul><br /></span></div> |
| 애플 메일 | MBOX | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974> |
| 패스트메일 | EML | <https://www.fastmail.help/hc/en-us/articles/360060590573-모든-데이터-다운로드#downloadmail> |
| 프로톤 메일 | MBOX/EML | <https://proton.me/support/이메일 내보내기-가져오기-내보내기-앱> |
| 투타노타 | EML | <https://github.com/crepererum-oss/tatutanatata> |
| 생각하다 | EML | <https://docs.gandi.net/ko/gandimail/common_operations/backup_email.html#contents> |
| 조호 | EML | <https://www.zoho.com/mail/help/import-export-emails.html#alink2> |
| 다른 | [Use Thunderbird](https://www.thunderbird.net) | Thunderbird에서 기존 이메일 계정을 설정한 다음 [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) 플러그인을 사용하여 이메일을 내보내고 가져오세요. **한 계정에서 다른 계정으로 이메일을 복사/붙여넣기하거나 끌어서 놓을 수도 있습니다.** |

2. [천둥새](https://www.thunderbird.net)을 다운로드, 설치하고 엽니다.

3. 별칭의 전체 이메일 주소(예: <code><you@yourdomain.com></code>)와 생성된 비밀번호를 사용하여 새 계정을 만드세요. <strong>아직 생성된 비밀번호가 없는 경우 <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">설정 지침을 참조하세요</a></strong>.

4. [ImportExportTools OF](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) Thunderbird 플러그인을 다운로드하여 설치합니다.

5. Thunderbird에서 새 로컬 폴더를 만든 다음 마우스 오른쪽 버튼을 클릭합니다. → `ImportExportTools NG` 옵션을 선택합니다. → `Import mbox file`(MBOX 내보내기 형식의 경우) 또는 `Import messages` / `Import all messages from a directory`(EML 내보내기 형식의 경우)을 선택합니다.

6. 로컬 폴더에서 Thunderbird의 새(또는 기존) IMAP 폴더로 드래그 앤 드롭하여 서비스를 통해 IMAP 저장소에 메시지를 업로드하세요. 이렇게 하면 SQLite 암호화 저장소에 메시지가 온라인으로 백업됩니다.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
팁:
</strong>
<span>
Thunderbird로 가져오는 방법이 궁금하시다면 <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> 및 <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
중요:
</strong>
<span>
내보내기 및 가져오기 과정을 완료한 후에는 기존 이메일 계정에서 전달 기능을 활성화하고, 발신자에게 새 이메일 주소가 있음을 알리는 자동 응답 기능을 설정하는 것이 좋습니다(예: 이전에 Gmail을 사용하다가 이제 사용자 지정 도메인 이름으로 이메일을 사용하는 경우).
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
축하합니다!
</strong>
<span>
모든 단계를 성공적으로 완료했습니다.
</span>
</div>
</div>

### 셀프 호스팅을 지원하시나요? {#do-you-support-self-hosting}

네, 2025년 3월부터 자체 호스팅 옵션을 지원합니다. [여기](https://forwardemail.net/blog/docs/self-hosted-solution) 블로그를 읽어보세요. [셀프 호스팅 가이드](https://forwardemail.net/self-hosted)을 확인하여 시작해 보세요. 더 자세한 단계별 안내를 원하시면 [우분투](https://forwardemail.net/guides/selfhosted-on-ubuntu) 또는 [데비안](https://forwardemail.net/guides/selfhosted-on-debian) 기반 가이드를 참조하세요.

## 이메일 구성 {#email-configuration}

### 이메일 전달을 시작하고 설정하려면 어떻게 해야 하나요? {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">예상 설정 시간:</strong>
<span>10분 미만</span>
</div>

<div class="alert my-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
시작하기:
</strong>
<span>
아래 1단계부터 8단계까지 주의 깊게 읽고 따르세요. <code>user@gmail.com</code>의 이메일 주소를 이메일을 전달하려는 이메일 주소로 바꾸세요(아직 정확하지 않은 경우). 마찬가지로 <code>example.com</code>을 사용자 지정 도메인 이름으로 바꾸세요(아직 정확하지 않은 경우).
</span>
</div>

<ol>
<li class="mb-2 mb-md-3 mb-lg-5">이미 도메인 이름을 어딘가에 등록하셨다면 이 단계를 완전히 건너뛰고 2단계로 이동하세요! 그렇지 않은 경우 <a href="/domain-registration" rel="noopener noreferrer">여기를 클릭하여 도메인 이름을 등록하세요</a>.</li>
<li class="mb-2 mb-md-3 mb-lg-5">
도메인을 어디에 등록했는지 기억하시나요? 기억하셨다면 아래 지침을 따르세요.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
중요:
</strong>
<span>
새 탭을 열고 도메인 등록 기관에 로그인해야 합니다. 아래 "등록 기관"을 클릭하면 자동으로 로그인됩니다. 새 탭에서 등록 기관의 DNS 관리 페이지로 이동해야 합니다. "구성 단계" 열 아래에 단계별 이동 단계가 나와 있습니다. 새 탭에서 이 페이지로 이동한 후 이 탭으로 돌아와 아래 3단계를 진행할 수 있습니다.
<strong class="font-weight-bold">열려 있는 탭은 아직 닫지 마세요. 이후 단계에 필요합니다!</strong>
</span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>등록기관</th>
<th>구성 단계</th>
</tr>
</thead>
<tbody>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
<td>로그인 <i class="fa fa-angle-right"></i> 도메인 센터 <i class="fa fa-angle-right"></i> (도메인 선택) <i class="fa fa-angle-right"></i> DNS 설정 편집</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon 경로 53</a></td>
<td>로그인 <i class="fa fa-angle-right"></i> 호스팅 영역 <i class="fa fa-angle-right"></i> (도메인 선택)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
<td>로그인 <i class="fa fa-angle-right"></i> 내 서버 <i class="fa fa-angle-right"></i> 도메인 관리 <i class="fa fa-angle-right"></i> DNS 관리자</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
<td>ROCK의 경우: 로그인 <i class="fa fa-angle-right"></i> 도메인 <i class="fa fa-angle-right"></i> (관리 옆의 ▼ 아이콘 클릭) <i class="fa fa-angle-right"></i> DNS
<br />
기존 사용자: 로그인 <i class="fa fa-angle-right"></i> 도메인 <i class="fa fa-angle-right"></i> 영역 편집기 <i class="fa fa-angle-right"></i> (도메인 선택)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
<td>로그인 <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS 간편 설정</a></td>
<td>로그인 <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (도메인 선택)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
<td>로그인 <i class="fa fa-angle-right"></i> (도메인 선택) <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> 관리</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
<td>로그인 <i class="fa fa-angle-right"></i> 네트워킹 <i class="fa fa-angle-right"></i> 도메인 <i class="fa fa-angle-right"></i> (도메인 선택 도메인) <i class="fa fa-angle-right"></i> 더 보기 <i class="fa fa-angle-right"></i> 도메인 관리</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
<td>로그인 <i class="fa fa-angle-right"></i> 카드 보기에서 도메인 관리를 클릭합니다. <i class="fa fa-angle-right"></i> 목록 보기에서
기어 아이콘을 클릭합니다. <i class="fa fa-angle-right"></i> DNS 및 네임서버 <i class="fa fa-angle-right"></i> DNS 레코드</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon0 class="fa fa-play-circle"></i> 보기</a>
</td>
<td>로그인 <i class="fa fa-angle-right"></i> (도메인 선택) <i class="fa fa-angle-right"></i> 관리 <i class="fa fa-angle-right"></i> (기어 아이콘 클릭) <i class="fa fa-angle-right"></i> 왼쪽 메뉴에서 DNS 및 네임서버 클릭</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon1
<td>로그인 <i class="fa fa-angle-right"></i> 패널 <i class="fa fa-angle-right"></i> 도메인 <i class="fa fa-angle-right"></i> 관리 도메인 <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon2
<td>로그인 <i class="fa fa-angle-right"></i> 개요 <i class="fa fa-angle-right"></i> 관리 <i class="fa fa-angle-right"></i> 간편 편집기 <i class="fa fa-angle-right"></i> 레코드</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon3
<td>로그인 <i class="fa fa-angle-right"></i> (도메인 선택) <i class="fa fa-angle-right"></i> 관리 <i class="fa fa-angle-right"></i> 편집 영역</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon4
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon5 class="fa fa-play-circle"></i> 시청하기</a>
</td>
<td>로그인 <i class="fa fa-angle-right"></i> 내 도메인 관리 <i class="fa fa-angle-right"></i> (도메인 선택) <i class="fa fa-angle-right"></i> DNS 관리</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon6 도메인</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon7 class="fa fa-play-circle"></i> 시청하기</a>
</td>
<td>로그인 <i class="fa fa-angle-right"></i> (도메인 선택) <i class="fa fa-angle-right"></i> DNS 설정</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon8
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon9 class="fa fa-play-circle"></i> 시청하기</a>
</td>
<td>로그인 <i class="fa fa-angle-right"></i> 도메인 목록 <i class="fa fa-angle-right"></i> (도메인 선택) <i class="fa fa-angle-right"></i> 관리 <i class="fa fa-angle-right"></i> 고급 DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>0
<td>로그인 <i class="fa fa-angle-right"></i> (도메인 선택) <i class="fa fa-angle-right"></i> Netlify DNS 설정</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>1 솔루션</a></td>
<td>로그인 <i class="fa fa-angle-right"></i> 계정 관리자 <i class="fa fa-angle-right"></i> 내 도메인 이름 <i class="fa fa-angle-right"></i> (도메인 선택) <i class="fa fa-angle-right"></i> 관리 <i class="fa fa-angle-right"></i> 도메인이 가리키는 위치 변경 <i class="fa fa-angle-right"></i> 고급 DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>2
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>3 class="fa fa-play-circle"></i> 보기</a>
</td>
<td>로그인 <i class="fa fa-angle-right"></i> 관리되는 도메인 <i class="fa fa-angle-right"></i> (도메인 선택) <i class="fa fa-angle-right"></i> DNS 설정</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>4
<td>로그인 <i class="fa fa-angle-right"></i> 홈 메뉴 <i class="fa fa-angle-right"></i> 설정 <i class="fa fa-angle-right"></i> 도메인 <i class="fa fa-angle-right"></i> (도메인 선택) <i class="fa fa-angle-right"></i>
고급 설정 <i class="fa fa-angle-right"></i> 사용자 지정 레코드</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>5 지금</a></td>
<td>"now" CLI 사용 <i class="fa fa-angle-right"></i> <code>now dns add [도메인] '@' MX [레코드 값] [우선순위]</code></td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>6
<td>로그인 <i class="fa fa-angle-right"></i> 도메인 페이지 <i class="fa fa-angle-right"></i> (도메인 선택) <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>7
<td>로그인 <i class="fa fa-angle-right"></i> 도메인 페이지 <i class="fa fa-angle-right"></i> (<i class="fa fa-ellipsis-h"></i> 아이콘 클릭) <i class="fa fa-angle-right"></i> DNS 레코드 관리 선택</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>8
<td>로그인 <i class="fa fa-angle-right"></i> 도메인 <i class="fa fa-angle-right"></i> 내 도메인</td>
</tr>
<tr>
<td>기타</td>
<td>
<div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">중요:</strong> 여기에 등록기관 이름이 표시되지 않나요? 인터넷에서 "how to $REGISTRAR의 DNS 레코드를 변경하세요"($REGISTRAR를 등록 기관의 이름으로 바꾸세요. 예: GoDaddy를 사용하는 경우 "GoDaddy에서 DNS 레코드를 변경하는 방법").</div>
</td>
</tr>
</tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">등록 기관의 DNS 관리 페이지(열려 있는 다른 탭)를 사용하여 다음 "MX" 레코드를 설정하세요.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
중요:
</strong>
<span>
다른 MX 레코드가 설정되어서는 안 됩니다. 아래 표시된 두 레코드는 반드시 존재해야 합니다. 오타가 없는지 확인하고 mx1과 mx2의 철자를 정확하게 입력하세요. 이미 MX 레코드가 있는 경우 완전히 삭제하세요.
"TTL" 값은 3600일 필요는 없으며, 필요에 따라 더 낮거나 높은 값을 사용할 수 있습니다.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>이름/호스트/별칭</th>
<th class="text-center">TTL</th>
<th>유형</th>
<th>우선순위</th>
<th>답변/값</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", 또는 공백</em></td>
<td class="text-center">3600</td>
<td>MX</td>
<td>0</td>
<td><code>mx1.forwardemail.net</code></td>
</tr>
<tr>
<td><em>"@", ".", 또는 공백</em></td>
<td class="text-center">3600</td>
<td>MX</td>
<td>0</td>
<td><code>mx2.forwardemail.net</code></td>
</tr>
</tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">등록 기관의 DNS 관리 페이지(열려 있는 다른 탭)를 사용하여 다음 <strong class="notranslate">TXT</strong> 레코드를 설정하세요.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
중요:
</strong>
<span>
유료 플랜을 사용 중이시라면 이 단계를 완전히 건너뛰고 5단계로 이동하세요! 유료 플랜을 사용 중이시지 않다면 전달된 주소는 공개적으로 검색 가능합니다. <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">내 계정 <i class="fa fa-angle-right"></i>도메인</a>으로 이동하여 원하는 경우 도메인을 유료 플랜으로 업그레이드하세요. 유료 플랜에 대한 자세한 내용은 <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">가격</a> 페이지를 참조하세요. 그렇지 않으면 아래 나열된 옵션 A부터 옵션 F까지 하나 이상의 조합을 계속 선택할 수 있습니다.
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
옵션 A:
</strong>
<span>
도메인(예: "all@example.com", "hello@example.com" 등)의 모든 이메일을 특정 주소 "user@gmail.com"으로 전달하는 경우:
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>이름/호스트/별칭</th>
<th class="text-center">TTL</th>
<th>유형</th>
<th>답변/값</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", 또는 공백</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=user@gmail.com</code>
</td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
팁:
</strong>
<span>
위의 "값" 열에 있는 값을 본인의 이메일 주소로 바꾸세요. "TTL" 값은 3600일 필요는 없으며, 필요한 경우 더 낮거나 높은 값을 사용할 수 있습니다. TTL(Time To Live) 값이 낮을수록 향후 DNS 레코드 변경 사항이 인터넷 전체에 더 빠르게 전파됩니다. TTL은 메모리에 캐시되는 시간(초)이라고 생각하면 됩니다. <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">위키백과의 TTL</a>에 대한 자세한 내용을 확인하세요.
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
옵션 B:
</strong>
<span>
단일 이메일 주소만 전달해야 하는 경우(예: <code>hello@example.com</code>을 <code>user@gmail.com</code>으로 전달하면 "hello+test@example.com"도 "user+test@gmail.com"으로 자동 전달됨):
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>이름/호스트/별칭</th>
<th class="text-center">TTL</th>
<th>유형</th>
<th>답변/값</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", 또는 공백</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=hello:user@gmail.com</code>
</td>
</tr>
</tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
옵션 C:
</strong>
<span>
여러 이메일을 전달하는 경우 쉼표로 구분하세요.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>이름/호스트/별칭</th>
<th class="text-center">TTL</th>
<th>유형</th>
<th>답변/값</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", 또는 공백</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
</td>
</tr>
</tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
옵션 D:
</strong>
<span>
무제한으로 이메일 전달을 설정할 수 있습니다. 단, 한 줄에 255자를 넘지 않도록 하고 각 줄을 "forward-email="로 시작해야 합니다. 아래 예시를 참조하세요.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>이름/호스트/별칭</th>
<th class="text-center">TTL</th>
<th>유형</th>
<th>답변/값</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", 또는 공백</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", 또는 공백</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=help:user@gmail.com,foo:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", "." 또는 공백</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", "." 또는 공백</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", 또는 공백</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=errors:user@gmail.com,boop:user@gmail.com</code>
</td>
</tr>
</tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
옵션 E:
</strong>
<span>
<strong class="notranslate">TXT</strong> 레코드에 도메인 이름을 지정하여 글로벌 별칭 전달을 설정할 수도 있습니다(예: "user@example.com"은 "user@example.net"으로 전달됨).
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>이름/호스트/별칭</th>
<th class="text-center">TTL</th>
<th>유형</th>
<th>답변/값</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", 또는 공백</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=example.net</code>
</td>
</tr>
</tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
옵션 F:
</strong>
<span>
웹훅을 전역 또는 개별 별칭으로 사용하여 이메일을 전달할 수도 있습니다. 아래 <a href="#do-you-support-webhooks" class="alert-link">웹훅을 지원하십니까?</a>라는 제목의 웹훅 예시와 전체 섹션을 참조하세요.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>이름/호스트/별칭</th>
<th class="text-center">TTL</th>
<th>유형</th>
<th>답변/값</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", 또는 공백</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code>
</td>
</tr>
</tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
옵션 G:
</strong>
<span>
별칭 일치 및 이메일 전달 대상 대체 처리에 정규 표현식("regex")을 사용할 수도 있습니다. 아래 <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">정규 표현식 또는 정규 표현식을 지원하십니까?</a>라는 제목의 정규 표현식 관련 예시 및 전체 섹션을 참조하세요.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>대체 기능이 포함된 고급 정규 표현식이 필요하신가요?</strong> 아래 <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">정규 표현식 또는 정규 표현식을 지원하시나요?</a>라는 제목의 정규 표현식 관련 예시와 전체 섹션을 참조하세요.
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>간단한 예:</strong> `linus@example.com` 또는 `torvalds@example.com`로 전송되는 모든 이메일을 `user@gmail.com`로 전달하려면 다음과 같이 설정합니다.
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>이름/호스트/별칭</th>
<th class="text-center">TTL</th>
<th>유형</th>
<th>답변/값</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", 또는 공백</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code>
</td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
중요:
</strong>
<span>
포괄 전달 규칙은 "fall-through"라고도 합니다.
즉, 포괄 전달 규칙 대신 하나 이상의 특정 전달 규칙과 일치하는 수신 이메일이 사용됩니다.
구체적인 규칙에는 이메일 주소와 정규 표현식이 포함됩니다.
<br /><br />
예:
<br />
<code>forward-email=hello:first@gmail.com,second@gmail.com</code>
<br />
이 구성을 사용하면 <code>hello@example.com</code>으로 전송된 이메일은 <code>second@gmail.com</code>(포괄 전달 규칙)으로 **전달되지** 않고, <code>first@gmail.com</code>으로만 전송됩니다.
</span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">등록 기관의 DNS 관리 페이지(열려 있는 다른 탭)를 사용하여 다음 <strong class="notranslate">TXT</strong> 레코드를 추가로 설정하세요.

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>이름/호스트/별칭</th>
<th class="text-center">TTL</th>
<th>유형</th>
<th>답변/값</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", 또는 공백</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
중요:
</strong>
<span>
Gmail(예: 다른 주소에서 메일 보내기) 또는 G Suite를 사용하는 경우 위 값에 <code>include:_spf.google.com</code>을 추가해야 합니다. 예:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
팁:
</strong>
<span>
"v=spf1"이 포함된 유사한 줄이 이미 있는 경우, 기존 "include:host.com" 레코드 바로 앞과 같은 줄의 "-all" 앞에 <code>include:spf.forwardemail.net</code>을 추가해야 합니다. 예:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
"-all"과 "~all"에는 차이가 있습니다. "-"는 SPF가 일치하지 않을 경우 검사가 실패함을 나타내고, "~"는 SPF 검사가 SOFTFAIL(실패)됨을 나타냅니다. 도메인 위조를 방지하려면 "-all" 방식을 사용하는 것이 좋습니다.
<br /><br />
메일을 보내는 호스트(예: Outlook)의 SPF 레코드도 포함해야 할 수 있습니다.
</span>
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 설정에서 제공되는 "레코드 확인" 도구를 사용하여 DNS 레코드를 확인하세요.

</li><li class="mb-2 mb-md-3 mb-lg-5">테스트 이메일을 보내 제대로 작동하는지 확인하세요. DNS 레코드가 전파되는 데 시간이 걸릴 수 있습니다.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
팁:
</strong>
<span>
</span>
테스트 이메일을 받지 못하거나 "이 메시지에 주의하세요"라는 테스트 이메일을 받은 경우, 각각 <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">테스트 이메일을 받지 못하는 이유</a> 및 <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Gmail에서 제게 전송된 테스트 이메일이 "의심스러운" 것으로 표시되는 이유</a>에 대한 답변을 확인하세요.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Gmail에서 "다른 이름으로 메일 보내기"를 원하시면 <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">이 영상을 시청</a></strong>하시거나 아래의 <a href="#how-to-send-mail-as-using-gmail">How Gmail을 사용하여 다른 이름으로 메일 보내기</a> 단계를 따르세요.

</li></ol>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
축하합니다!
</strong>
<span>
모든 단계를 성공적으로 완료했습니다.
</span>
</div>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
팁:
</strong>
<span>
선택 가능한 추가 기능은 아래와 같습니다. 이러한 추가 기능은 완전히 선택 사항이며 필수가 아닐 수 있습니다. 필요한 경우 추가 정보를 제공해 드리고자 합니다.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
선택적 추가 기능:
</strong>
<span>
<a class="alert-link" href="#how-to-send-mail-as-using-gmail">How Gmail에서 다른 주소로 메일 보내기</a> 기능을 사용 중이라면, 허용 목록에 자신을 추가하는 것이 좋습니다. 이 주제에 대한 <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">Gmail의 다음 지침</a>을 참조하세요.
</span>
</div>

### 고급 전달을 위해 여러 MX 교환 및 서버를 사용할 수 있습니까? {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

네, 하지만 **DNS 레코드에는 MX 교환을 하나만 나열해야 합니다**.

"우선순위"를 사용하여 여러 MX 교환을 구성하려고 하지 마세요.

대신, 기존 MX 교환을 구성하여 일치하지 않는 모든 별칭에 대한 메일을 당사 서비스의 교환(`mx1.forwardemail.net` 및/또는 `mx2.forwardemail.net`)으로 전달해야 합니다.

Google Workspace를 사용하고 일치하지 않는 모든 별칭을 당사 서비스로 전달하려면 <https://support.google.com/a/answer/6297084>.>을 참조하세요.

Microsoft 365(Outlook)를 사용하고 일치하지 않는 모든 별칭을 서비스로 전달하려면 <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> 및 <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.>을 참조하세요.

### 부재중 자동응답 기능을 어떻게 설정하나요? {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

<a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 별칭으로 이동하여 휴가 자동 응답을 구성하려는 별칭을 만들거나 편집하세요.

시작 날짜, 종료 날짜, 제목, 메시지를 구성하고 언제든지 활성화하거나 비활성화할 수 있습니다.

* 현재 일반 텍스트 제목과 메시지가 지원됩니다(`striptags` 패키지를 내부적으로 사용하여 HTML을 제거합니다).
* 제목은 100자로 제한됩니다.
* 메시지는 1000자로 제한됩니다.
* 설정에는 아웃바운드 SMTP 구성이 필요합니다(예: DKIM, DMARC 및 반환 경로 DNS 레코드 설정).
* <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 설정 <i class="fa fa-angle-right"></i> 아웃바운드 SMTP 구성으로 이동하여 설정 지침을 따르세요.
* 글로벌 베니티 도메인 이름에는 부재중 자동 응답 기능을 활성화할 수 없습니다(예: [일회용 주소](/disposable-addresses)은 지원되지 않음).
* 와일드카드/포괄(`*`) 또는 정규 표현식을 사용하는 별칭에는 휴가 응답 기능을 활성화할 수 없습니다.

`postfix`(예: `sieve` 휴가 필터 확장을 사용하는 시스템)과 달리 Forward Email은 자동으로 DKIM 서명을 추가하고, 휴가 응답을 보낼 때 연결 문제를 방지하고(예: 일반적인 SSL/TLS 연결 문제 및 기존 유지 관리 서버로 인해 발생), 휴가 응답에 대한 Open WKD 및 PGP 암호화도 지원합니다.

<!--
* 오용 방지를 위해 부재중 자동응답 메시지 전송 시 발신 SMTP 크레딧 1개가 차감됩니다.
* 모든 유료 계정에는 기본적으로 하루 300크레딧이 제공됩니다. 더 많은 크레딧이 필요하시면 문의해 주세요.
-->

1. [허용 목록에 추가됨](#do-you-have-an-allowlist) 발신자당 4일에 한 번씩만 보냅니다(Gmail의 동작과 유사).

* Redis 캐시는 `alias_id`과 `sender`의 지문을 사용합니다. `alias_id`는 MongoDB 별칭 ID이고, `sender`은 허용 목록에 있는 경우 보낸 사람 주소이거나, 허용 목록에 없는 경우 보낸 사람 주소의 루트 도메인입니다. 편의상 캐시에서 이 지문의 만료일은 4일로 설정되었습니다.

* 허용 목록에 없는 발신자의 보낸 사람 주소에서 구문 분석된 루트 도메인을 사용하는 접근 방식은 비교적 알려지지 않은 발신자(예: 악의적인 행위자)가 휴가 응답 메시지를 폭주시키는 것을 방지합니다.

2. MAIL FROM 및/또는 From이 비어 있지 않고 (대소문자 구분 없이) [포스트마스터 사용자 이름](#what-are-postmaster-addresses)(이메일의 @ 앞에 있는 부분)이 포함되지 않은 경우에만 전송합니다.

3. 원본 메시지에 다음 헤더가 포함되어 있는 경우 전송하지 않습니다(대소문자 구분 없음):

* `auto-submitted`의 헤더 값이 `no`과 같지 않습니다.
* `dr`, `autoreply`, `auto-reply`, `auto_reply` 또는 `all` 값을 갖는 `x-auto-response-suppress`의 헤더
* `list-id`, `list-subscribe`, `no`0, `no`1, `no`2, `no`3, `no`4, `no`5, `no`6 또는 `no`7의 헤더(값과 무관)
* `no`9, `x-auto-response-suppress`0, `x-auto-response-suppress`1, `x-auto-response-suppress`2 또는 `x-auto-response-suppress`3 값을 갖는 `no`8의 헤더.

4. MAIL FROM 또는 From 이메일 주소가 `+donotreply`, `-donotreply`, `+noreply` 또는 `-noreply`으로 끝나면 이메일을 보내지 않습니다.

5. 보낸 사람 이메일 주소 사용자 이름 부분이 `mdaemon`이고 대소문자를 구분하지 않는 헤더가 `X-MDDSN-Message`인 경우에는 보내지 않습니다.

6. 대소문자를 구분하지 않는 `content-type` 헤더가 `multipart/report`에 있는 경우에는 전송하지 않습니다.

### 전달 이메일에 대한 SPF를 어떻게 설정합니까? {#how-do-i-set-up-spf-for-forward-email}

등록 기관의 DNS 관리 페이지를 사용하여 다음 <strong class="notranslate">TXT</strong> 레코드를 설정하세요.

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>이름/호스트/별칭</th>
<th class="text-center">TTL</th>
<th>유형</th>
<th>답변/값</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", 또는 공백</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
중요:
</strong>
<span>
Gmail(예: 다른 주소에서 메일 보내기) 또는 G Suite를 사용하는 경우 위 값에 <code>include:_spf.google.com</code>을 추가해야 합니다. 예:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
중요:
</strong>
<span>
Microsoft Outlook 또는 Live.com을 사용하는 경우 SPF <strong class="notranslate">TXT</strong> 레코드에 <code>include:spf.protection.outlook.com</code>을 추가해야 합니다. 예:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
</span>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
팁:
</strong>
<span>
"v=spf1"이 포함된 유사한 줄이 이미 있는 경우, 기존 "include:host.com" 레코드 바로 앞과 같은 줄의 "-all" 앞에 <code>include:spf.forwardemail.net</code>을 추가해야 합니다. 예:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
"-all"과 "~all"에는 차이가 있습니다. "-"는 SPF가 일치하지 않을 경우 검사가 실패함을 나타내고, "~"는 SPF 검사가 SOFTFAIL(실패)됨을 나타냅니다. 도메인 위조를 방지하려면 "-all" 방식을 사용하는 것이 좋습니다.
<br /><br />
메일을 보내는 호스트(예: Outlook)의 SPF 레코드도 포함해야 할 수 있습니다.
</span>
</div>

### 전달 이메일에 대한 DKIM을 어떻게 설정합니까? {#how-do-i-set-up-dkim-for-forward-email}

<a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 설정 <i class="fa fa-angle-right"></i> 아웃바운드 SMTP 구성으로 이동하여 설정 지침을 따르세요.

### 전달 이메일에 대한 DMARC를 어떻게 설정합니까? {#how-do-i-set-up-dmarc-for-forward-email}

<a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 설정 <i class="fa fa-angle-right"></i> 아웃바운드 SMTP 구성으로 이동하여 설정 지침을 따르세요.

### 연락처를 어떻게 연결하고 구성합니까? {#how-do-i-connect-and-configure-my-contacts}

**연락처를 구성하려면 다음의 CardDAV URL을 사용하세요:** `https://carddav.forwardemail.net`(또는 클라이언트가 허용하는 경우 간단히 `carddav.forwardemail.net`)

### 캘린더를 연결하고 구성하려면 어떻게 해야 하나요? {#how-do-i-connect-and-configure-my-calendars}

**캘린더를 구성하려면 다음의 CalDAV URL을 사용하세요:** `https://caldav.forwardemail.net`(또는 클라이언트가 허용하는 경우 간단히 `caldav.forwardemail.net`)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="이메일 전달 캘린더 CalDAV Thunderbird 예제 설정" />

### 캘린더를 더 추가하고 기존 캘린더를 관리하려면 어떻게 해야 하나요? {#how-do-i-add-more-calendars-and-manage-existing-calendars}

추가 캘린더를 추가하려면 `https://caldav.forwardemail.net/dav/principals/calendar-name`이라는 새 캘린더 URL을 추가하기만 하면 됩니다(**`calendar-name`을 원하는 캘린더 이름으로 바꿔야 합니다**)

캘린더를 만든 후에도 캘린더의 이름과 색상을 변경할 수 있습니다. 선호하는 캘린더 애플리케이션(예: Apple Mail 또는 [천둥새](https://thunderbird.net))을 사용하면 됩니다.

### 전달 이메일에 대한 SRS를 어떻게 설정합니까? {#how-do-i-set-up-srs-for-forward-email}

[발신자 재작성 계획](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme)("SRS")은 자동으로 구성되므로 직접 구성할 필요가 없습니다.

### 이메일 전달을 위해 MTA-STS를 어떻게 설정합니까? {#how-do-i-set-up-mta-sts-for-forward-email}

자세한 내용은 [MTA-STS에 대한 섹션](#do-you-support-mta-sts)을 참조하세요.

### 이메일 주소에 프로필 사진을 추가하려면 어떻게 해야 하나요? {#how-do-i-add-a-profile-picture-to-my-email-address}

Gmail을 사용하는 경우 아래 단계를 따르세요.

1. <https://google.com>>으로 이동하여 모든 이메일 계정에서 로그아웃하세요.
2. "로그인"을 클릭하고 드롭다운 메뉴에서 "다른 계정"을 클릭하세요.
3. "다른 계정 사용"을 선택하세요.
4. "계정 만들기"를 선택하세요.
5. "현재 이메일 주소 사용"을 선택하세요.
6. 맞춤 도메인 이름 이메일 주소를 입력하세요.
7. 이메일 주소로 발송된 확인 이메일을 받으세요.
8. 이 이메일의 확인 코드를 입력하세요.
9. 새 Google 계정의 프로필 정보를 입력하세요.
10. 모든 개인정보 보호정책 및 이용약관에 동의하세요.
11. <https://google.com>>으로 이동하여 오른쪽 상단의 프로필 아이콘을 클릭하고 "변경" 버튼을 클릭하세요.
12. 계정에 사용할 새 사진이나 아바타를 업로드하세요.
13. 변경 사항이 적용되는 데 약 1~2시간이 소요되지만, 경우에 따라 매우 빠르게 적용될 수 있습니다.
14. 테스트 이메일을 보내면 프로필 사진이 표시됩니다.

## 고급 기능 {#advanced-features}

### 마케팅 관련 이메일을 위한 뉴스레터나 메일링 리스트를 지원하시나요? {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

네, <https://forwardemail.net/guides/newsletter-with-listmonk>.>에서 더 자세히 읽어보실 수 있습니다.

IP 평판을 유지하고 전달성을 보장하기 위해 Forward Email은 **뉴스레터 승인**을 위해 도메인별로 수동 검토 프로세스를 시행하고 있습니다. <support@forwardemail.net>으로 이메일을 보내시거나 [도움 요청](https://forwardemail.net/help)을 열어 승인을 요청해 주세요. 일반적으로 24시간 이내에 완료되며, 대부분의 요청은 1~2시간 이내에 처리됩니다. 향후 추가적인 스팸 차단 및 알림 기능을 통해 이 프로세스를 즉시 진행할 예정입니다. 이 프로세스를 통해 이메일이 받은 편지함에 도착하고 스팸으로 표시되지 않도록 할 수 있습니다.

### API를 사용하여 이메일 전송을 지원하십니까? {#do-you-support-sending-email-with-api}

네, 2023년 5월부터 모든 유료 사용자를 대상으로 API를 이용한 이메일 전송 기능을 추가 기능으로 지원합니다.

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
중요:
</strong>
<span>
<a href="/terms" class="alert-link" target="_blank">이용약관</a>, <a href="/privacy" class="alert-link" target="_blank">개인정보처리방침</a> 및 <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">아웃바운드 SMTP 제한</a>을 반드시 읽어보시기 바랍니다. 귀하의 사용은 본 약관을 인지하고 동의하는 것으로 간주됩니다.
</span>
</div>

옵션, 예제 및 더 많은 정보를 보려면 API 설명서의 [이메일](/email-api#outbound-emails) 섹션을 참조하세요.

API를 사용하여 아웃바운드 이메일을 보내려면 [내 보안](/my-account/security)에서 사용 가능한 API 토큰을 사용해야 합니다.

### IMAP을 사용하여 이메일 수신을 지원하십니까? {#do-you-support-receiving-email-with-imap}

네, 2023년 10월 16일부터 모든 유료 사용자를 위한 추가 기능으로 IMAP을 통한 이메일 수신을 지원합니다. **자세한 내용은 [암호화된 SQLite 사서함 저장 기능의 작동 방식](/blog/docs/best-quantum-safe-encrypted-email-service)에서 **문서를 참조하세요.**

<div id="imap-instructions">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
중요:
</strong>
<span>
<a href="/terms" class="alert-link" target="_blank">이용약관</a> 및 <a href="/privacy" class="alert-link" target="_blank">개인정보처리방침</a>을 반드시 읽어보시기 바랍니다. 귀하의 사용은 본 약관에 동의하는 것으로 간주됩니다.
</span>
</div>

1. <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">내 계정 <i class="fa fa-angle-right"></i>도메인</a> <i class="fa fa-angle-right"></i>별칭(예: <code><hello@example.com></code>)에서 도메인에 대한 새 별칭을 만듭니다.

2. 새로 생성된 별칭 옆에 있는 <strong class="text-success"><i class="fa fa-key"></i>비밀번호 생성</strong>을 클릭하세요. 화면에 표시된 생성된 비밀번호를 클립보드에 복사하여 안전하게 저장하세요.

3. 선호하는 이메일 애플리케이션을 사용하여 새로 만든 별칭(예: <code><hello@example.com></code>)으로 계정을 추가하거나 구성하세요.
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
팁:
</strong>
<span><a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>을 사용하는 것이 좋습니다. 또는 <a href="/blog/open-source" class="alert-link" target="_blank">오픈 소스이자 개인정보 보호에 중점을 둔 대안</a>입니다.</span>
</div>

4. IMAP 서버 이름을 입력하라는 메시지가 표시되면 `imap.forwardemail.net`을 입력합니다.

5. IMAP 서버 포트를 입력하라는 메시지가 표시되면 `993`(SSL/TLS)을 입력하세요. 필요한 경우 [대체 IMAP 포트](/faq#what-are-your-imap-server-configuration-settings)을 참조하세요.
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
팁:
</strong>
<span>Thunderbird를 사용하는 경우 "연결 보안"이 "SSL/TLS"로, 인증 방법이 "일반 비밀번호"로 설정되어 있는지 확인하세요.</span>
</div>

6. IMAP 서버 비밀번호를 입력하라는 메시지가 표시되면 위 2단계의 <strong class="text-success"><i class="fa fa-key"></i>비밀번호 생성</strong>에서 비밀번호를 붙여넣습니다.

7. **설정 저장** - 문제가 있는 경우 <a href="/help">문의</a>해 주세요.

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
축하합니다!
</strong>
<span>
모든 단계를 성공적으로 완료했습니다.
</span>
</div>
</div>

</div>

### POP3를 지원하시나요? {#do-you-support-pop3}

네, 2023년 12월 4일부터 모든 유료 사용자를 위한 애드온으로 [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol)을 지원합니다. **[암호화된 SQLite 사서함 저장 기능의 작동 방식](/blog/docs/best-quantum-safe-encrypted-email-service)에 대한 자세한 내용은 **자세한 내용**을 참조하세요.

<div id="pop3-instructions">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
중요:
</strong>
<span>
<a href="/terms" class="alert-link" target="_blank">이용약관</a> 및 <a href="/privacy" class="alert-link" target="_blank">개인정보처리방침</a>을 반드시 읽어보시기 바랍니다. 귀하의 사용은 본 약관에 동의하는 것으로 간주됩니다.
</span>
</div>

1. <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">내 계정 <i class="fa fa-angle-right"></i>도메인</a> <i class="fa fa-angle-right"></i>별칭(예: <code><hello@example.com></code>)에서 도메인에 대한 새 별칭을 만듭니다.

2. 새로 생성된 별칭 옆에 있는 <strong class="text-success"><i class="fa fa-key"></i>비밀번호 생성</strong>을 클릭하세요. 화면에 표시된 생성된 비밀번호를 클립보드에 복사하여 안전하게 저장하세요.

3. 선호하는 이메일 애플리케이션을 사용하여 새로 만든 별칭(예: <code><hello@example.com></code>)으로 계정을 추가하거나 구성하세요.
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
팁:
</strong>
<span><a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>을 사용하는 것이 좋습니다. 또는 <a href="/blog/open-source" class="alert-link" target="_blank">오픈 소스이자 개인정보 보호에 중점을 둔 대안</a>입니다.</span>
</div>

4. POP3 서버 이름을 입력하라는 메시지가 표시되면 `pop3.forwardemail.net`을 입력하세요.

5. POP3 서버 포트를 입력하라는 메시지가 표시되면 `995`(SSL/TLS)을 입력합니다. 필요한 경우 [대체 POP3 포트](/faq#what-are-your-pop3-server-configuration-settings)을 참조하세요.
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
팁:
</strong>
<span>Thunderbird를 사용하는 경우 "연결 보안"이 "SSL/TLS"로, 인증 방법이 "일반 비밀번호"로 설정되어 있는지 확인하세요.</span>
</div>

6. POP3 서버 비밀번호를 입력하라는 메시지가 표시되면 위 2단계의 <strong class="text-success"><i class="fa fa-key"></i>비밀번호 생성</strong>에서 비밀번호를 붙여넣습니다.

7. **설정 저장** - 문제가 있는 경우 <a href="/help">문의</a>해 주세요.

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
축하합니다!
</strong>
<span>
모든 단계를 성공적으로 완료했습니다.
</span>
</div>
</div>

</div>

### 캘린더(CalDAV)를 지원하시나요? {#do-you-support-calendars-caldav}

네, 2024년 2월 5일부터 이 기능을 추가했습니다. 저희 서버는 `caldav.forwardemail.net`이며, <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">상태 페이지</a>에서도 모니터링됩니다.

IPv4와 IPv6를 모두 지원하며 포트 `443`(HTTPS)를 통해 사용할 수 있습니다.

| 로그인 | 예 | 설명 |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 사용자 이름 | `user@example.com` | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a>에 존재하는 별칭의 이메일 주소입니다. |
| 비밀번호 | `************************` | 별칭별로 생성된 비밀번호입니다. |

캘린더 지원을 사용하려면 **사용자**는 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a>에 존재하는 별칭의 이메일 주소여야 하며, **비밀번호**는 별칭별로 생성된 비밀번호여야 합니다.

### 연락처(CardDAV)를 지원하시나요? {#do-you-support-contacts-carddav}

네, 2025년 6월 12일부터 이 기능을 추가했습니다. 저희 서버는 `carddav.forwardemail.net`이며, <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">상태 페이지</a>에서도 모니터링됩니다.

IPv4와 IPv6를 모두 지원하며 포트 `443`(HTTPS)를 통해 사용할 수 있습니다.

| 로그인 | 예 | 설명 |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 사용자 이름 | `user@example.com` | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a>에 존재하는 별칭의 이메일 주소입니다. |
| 비밀번호 | `************************` | 별칭별로 생성된 비밀번호입니다. |

연락처 지원을 사용하려면 **사용자**는 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a>에 존재하는 별칭의 이메일 주소여야 하며, **비밀번호**는 별칭별로 생성된 비밀번호여야 합니다.

### SMTP를 사용하여 이메일을 보내는 것을 지원하십니까? {#do-you-support-sending-email-with-smtp}

네, 2023년 5월부터 모든 유료 사용자를 대상으로 SMTP를 이용한 이메일 전송 기능을 추가 기능으로 지원합니다.

<div id="smtp-지침">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
중요:
</strong>
<span>
<a href="/terms" class="alert-link" target="_blank">이용약관</a>, <a href="/privacy" class="alert-link" target="_blank">개인정보처리방침</a> 및 <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">아웃바운드 SMTP 제한</a>을 반드시 읽어보시기 바랍니다. 귀하의 사용은 본 약관을 인지하고 동의하는 것으로 간주됩니다.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
중요:
</strong>
<span>
Gmail을 사용하는 경우 <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">Gmail을 사용하여 다른 계정으로 메일 보내기 가이드</a>를 참조하세요. 개발자인 경우 <a class="alert-link" href="/email-api#outbound-emails" target="_blank">이메일 API 문서</a>를 참조하세요.
</span>
</div>

1. <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 설정 <i class="fa fa-angle-right"></i> 아웃바운드 SMTP 구성으로 이동하여 설정 지침을 따르세요.

2. <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">내 계정 <i class="fa fa-angle-right"></i>도메인</a> <i class="fa fa-angle-right"></i>별칭(예: <code><hello@example.com></code>)에서 도메인에 대한 새 별칭을 만듭니다.

3. 새로 생성된 별칭 옆에 있는 <strong class="text-success"><i class="fa fa-key"></i>비밀번호 생성</strong>을 클릭하세요. 화면에 표시된 생성된 비밀번호를 클립보드에 복사하여 안전하게 저장하세요.

4. 선호하는 이메일 애플리케이션을 사용하여 새로 만든 별칭(예: <code><hello@example.com></code>)으로 계정을 추가하거나 구성하세요.
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
팁:
</strong>
<span><a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>을 사용하는 것이 좋습니다. 또는 <a href="/blog/open-source" class="alert-link" target="_blank">오픈 소스이자 개인정보 보호에 중점을 둔 대안</a>입니다.</span>
</div>

5. SMTP 서버 이름을 입력하라는 메시지가 표시되면 `smtp.forwardemail.net`을 입력합니다.

6. SMTP 서버 포트를 입력하라는 메시지가 표시되면 `465`(SSL/TLS)을 입력하세요. 필요한 경우 [대체 SMTP 포트](/faq#what-are-your-smtp-server-configuration-settings)을 참조하세요.
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
팁:
</strong>
<span>Thunderbird를 사용하는 경우 "연결 보안"이 "SSL/TLS"로, 인증 방법이 "일반 비밀번호"로 설정되어 있는지 확인하세요.</span>
</div>

7. SMTP 서버 비밀번호를 입력하라는 메시지가 표시되면 위 3단계의 <strong class="text-success"><i class="fa fa-key"></i>비밀번호 생성</strong>에서 비밀번호를 붙여넣습니다.

8. **설정을 저장하고 첫 번째 테스트 이메일을 보내세요** - 문제가 있는 경우 <a href="/help">문의</a>해 주세요.

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
중요:
</strong>
<span>
IP 평판을 유지하고 전달성을 보장하기 위해 아웃바운드 SMTP 승인 시 도메인별로 수동 검토 프로세스를 진행하고 있습니다. 일반적으로 24시간 이내에 처리되며, 대부분의 요청은 1~2시간 내에 처리됩니다. 향후 추가적인 스팸 제어 및 알림을 통해 이 프로세스를 즉시 진행할 예정입니다. 이 프로세스를 통해 이메일이 받은 편지함에 도착하고 스팸으로 표시되지 않도록 보장합니다.
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
축하합니다!
</strong>
<span>
모든 단계를 성공적으로 완료했습니다.
</span>
</div>
</div>

</div>

### OpenPGP/MIME, 종단 간 암호화("E2EE") 및 웹 키 디렉터리("WKD")를 지원합니까? {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

네, [오픈PGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [종단간 암호화("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption)을 지원하며, [웹 키 디렉토리("WKD")](https://wiki.gnupg.org/WKD)를 사용한 공개 키 검색도 지원합니다. [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) 또는 [자신의 키를 직접 호스팅하세요](https://wiki.gnupg.org/WKDHosting)를 사용하여 OpenPGP를 구성할 수 있습니다([WKD 서버 설정에 대한 요점](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79) 참조).

* WKD 조회는 이메일 적시 전송을 위해 1시간 동안 캐시됩니다. 따라서 WKD 키를 추가, 변경 또는 삭제하시는 경우, `support@forwardemail.net`으로 이메일 주소를 보내주시면 캐시를 수동으로 삭제해 드리겠습니다.
* WKD 조회를 통해 전달되거나 인터페이스에 업로드된 PGP 키를 사용하여 전달되는 메시지에 대해 PGP 암호화를 지원합니다.
* PGP 체크박스가 활성화/선택되어 있는 경우, 업로드된 키가 우선적으로 적용됩니다.
* 웹훅으로 전송된 메시지는 현재 PGP로 암호화되지 않습니다.
* 특정 전달 주소와 일치하는 별칭(예: 정규식/와일드카드/정확히 일치)이 여러 개 있고, 그중 두 개 이상에 업로드된 PGP 키가 포함되어 있고 PGP가 체크된 경우, 오류 알림 이메일을 보내드리며, 업로드된 PGP 키로 메시지를 암호화하지 않습니다. 이는 매우 드물며, 일반적으로 복잡한 별칭 규칙을 사용하는 고급 사용자에게만 적용됩니다.
* **발신자가 거부 DMARC 정책을 설정한 경우, MX 서버를 통한 이메일 전달에는 PGP 암호화가 적용되지 않습니다. *모든* 메일에 PGP 암호화가 필요한 경우, IMAP 서비스를 사용하고 수신 메일의 별칭에 PGP 키를 설정하는 것이 좋습니다.**

**<https://wkd.chimbosonic.com/>(오픈 소스) 또는 <https://www.webkeydirectory.com/>(독점)에서 웹 키 디렉토리 설정을 검증할 수 있습니다.**

<div class="alert my-3 alert-success">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
자동 암호화:
</strong>
<span><a href="#do-you-support-sending-email-with-smtp" class="alert-link">아웃바운드 SMTP 서비스</a>를 사용하고 암호화되지 않은 메시지를 보내는 경우, <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web 키 디렉터리("WKD")</a>를 사용하여 수신자별로 메시지를 자동으로 암호화합니다.</span>
</div>

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
중요:
</strong>
<span>
사용자 지정 도메인 이름에 OpenPGP를 활성화하려면 다음 단계를 모두 따라야 합니다.
</span>
</div>

1. 아래에서 이메일 클라이언트의 권장 플러그인을 다운로드하여 설치하세요.

| 이메일 클라이언트 | 플랫폼 | 추천 플러그인 | 노트 |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 천둥새 | 데스크톱 | [Configure OpenPGP in Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird에는 OpenPGP에 대한 지원이 기본으로 내장되어 있습니다. |
| 지메일 | 브라우저 | [Mailvelope](https://mailvelope.com/) 또는 [FlowCrypt](https://flowcrypt.com/download) (독점 라이센스) | Gmail은 OpenPGP를 지원하지 않지만 오픈 소스 플러그인 [Mailvelope](https://mailvelope.com/) 또는 [FlowCrypt](https://flowcrypt.com/download)을 다운로드할 수 있습니다. |
| 애플 메일 | 맥OS | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) | Apple Mail은 OpenPGP를 지원하지 않지만, 오픈 소스 플러그인 [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation)을 다운로드할 수 있습니다. |
| 애플 메일 | iOS | [PGPro](https://github.com/opensourceios/PGPro/) 또는 [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (독점 라이센스) | Apple Mail은 OpenPGP를 지원하지 않지만 오픈 소스 플러그인 [PGPro](https://github.com/opensourceios/PGPro/) 또는 [FlowCrypt](https://flowcrypt.com/download)을 다운로드할 수 있습니다. |
| 시야 | 윈도우 | [gpg4win](https://www.gpg4win.de/index.html) | Outlook의 데스크톱 메일 클라이언트는 OpenPGP를 지원하지 않지만, 오픈 소스 플러그인 [gpg4win](https://www.gpg4win.de/index.html)을 다운로드할 수 있습니다. |
| 시야 | 브라우저 | [Mailvelope](https://mailvelope.com/) 또는 [FlowCrypt](https://flowcrypt.com/download) (독점 라이센스) | Outlook의 웹 기반 메일 클라이언트는 OpenPGP를 지원하지 않지만 오픈 소스 플러그인 [Mailvelope](https://mailvelope.com/) 또는 [FlowCrypt](https://flowcrypt.com/download)을 다운로드할 수 있습니다. |
| 기계적 인조 인간 | 이동하는 | [OpenKeychain](https://www.openkeychain.org/) 또는 [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) | [Android mail clients](/blog/open-source/android-email-clients)(예: [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) 및 [FairEmail](https://github.com/M66B/FairEmail))은 모두 오픈 소스 플러그인 [OpenKeychain](https://www.openkeychain.org/)을 지원합니다. 또는 오픈 소스(독점 라이선스) 플러그인 [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email)를 사용할 수도 있습니다. |
| 구글 크롬 | 브라우저 | [Mailvelope](https://mailvelope.com/) 또는 [FlowCrypt](https://flowcrypt.com/download) (독점 라이센스) | 오픈소스 브라우저 확장 프로그램 [Mailvelope](https://mailvelope.com/) 또는 [FlowCrypt](https://flowcrypt.com/download)을 다운로드할 수 있습니다. |
| 모질라 파이어폭스 | 브라우저 | [Mailvelope](https://mailvelope.com/) 또는 [FlowCrypt](https://flowcrypt.com/download) (독점 라이센스) | 오픈소스 브라우저 확장 프로그램 [Mailvelope](https://mailvelope.com/) 또는 [FlowCrypt](https://flowcrypt.com/download)을 다운로드할 수 있습니다. |
| 마이크로소프트 엣지 | 브라우저 | [Mailvelope](https://mailvelope.com/) | 오픈소스 브라우저 확장 프로그램 [Mailvelope](https://mailvelope.com/)을 다운로드할 수 있습니다. |
| 용감한 | 브라우저 | [Mailvelope](https://mailvelope.com/) 또는 [FlowCrypt](https://flowcrypt.com/download) (독점 라이센스) | 오픈소스 브라우저 확장 프로그램 [Mailvelope](https://mailvelope.com/) 또는 [FlowCrypt](https://flowcrypt.com/download)을 다운로드할 수 있습니다. |
| 발사 | 데스크톱 | [Configure OpenPGP in Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING) | 발사에는 OpenPGP에 대한 지원이 내장되어 있습니다. |
| 케이메일 | 데스크톱 | [Configure OpenPGP in KMail](https://userbase.kde.org/KMail/PGP_MIME) | KMail에는 OpenPGP에 대한 지원이 내장되어 있습니다. |
| 그놈 에볼루션 | 데스크톱 | [Configure OpenPGP in Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en) | GNOME Evolution에는 OpenPGP에 대한 기본 지원이 포함되어 있습니다. |
| 단말기 | 데스크톱 | [Configure gpg in Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key) | 오픈 소스 [gpg command line tool](https://www.gnupg.org/download/)을 사용하여 명령줄에서 새로운 키를 생성할 수 있습니다. |

2. 플러그인을 열고 공개 키를 생성한 후 이를 사용하도록 이메일 클라이언트를 구성합니다.

3. <https://keys.openpgp.org/upload>.>에 공개 키를 업로드하세요.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
팁:
</strong>
<span>나중에 키를 관리하려면 <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a></span>을 방문하세요.
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
선택적 추가 기능:
</strong>
<span>
<a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">암호화된 저장소(IMAP/POP3)</a> 서비스를 사용 중이고 (이미 암호화된) SQLite 데이터베이스에 저장된 <i>모든</i> 이메일을 공개 키로 암호화하려면 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 별칭(예: <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> OpenPGP를 편집하고 공개 키를 업로드하세요. <i class="fa fa-angle-right"></i>
</span>
</div>

4. 도메인 이름에 새로운 `CNAME` 레코드를 추가합니다(예: `example.com`):

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>이름/호스트/별칭</th>
<th class="text-center">TTL</th>
<th>유형</th>
<th>답변/값</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>openpgpkey</code></td>
<td class="text-center">3600</td>
<td class="notranslate">CNAME</td>
<td><code>wkd.keys.openpgp.org</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
팁:
</strong>
<span>별칭에서 <a class="alert-link" href="/disposable-addresses" target="_blank">허영/일회용 도메인</a>(예: <code>hideaddress.net</code>)을 사용하는 경우 이 단계를 건너뛸 수 있습니다.</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
축하합니다!
</strong>
<span>
모든 단계를 성공적으로 완료했습니다.
</span>
</div>
</div>

### MTA-STS를 지원하시나요? {#do-you-support-mta-sts}

네, 2023년 3월 2일부터 [MTA-STS](https://www.hardenize.com/blog/mta-sts)을 지원합니다. 도메인에서 [이 템플릿](https://github.com/jpawlowski/mta-sts.template)을 활성화하려면 __PROTECTED_LINK_1065__을 사용하세요.

우리의 구성은 GitHub의 <https://github.com/forwardemail/mta-sts.forwardemail.net>.에서 공개적으로 찾을 수 있습니다.

### 패스키와 WebAuthn을 지원하시나요? {#do-you-support-passkeys-and-webauthn}

네! 2023년 12월 13일부터 [수요가 많아서](https://github.com/orgs/forwardemail/discussions/182) 암호 키에 대한 지원이 추가되었습니다.

패스키를 사용하면 비밀번호나 2단계 인증 없이도 안전하게 로그인할 수 있습니다.

터치, 얼굴 인식, 기기 기반 비밀번호 또는 PIN을 통해 신원을 확인할 수 있습니다.

최대 30개의 패스키를 동시에 관리할 수 있으므로 모든 기기에서 손쉽게 로그인할 수 있습니다.

다음 링크에서 패스키에 대해 자세히 알아보세요.

* [패스키를 사용하여 애플리케이션 및 웹사이트에 로그인하세요](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [iPhone에서 앱과 웹사이트에 로그인하려면 패스키를 사용하세요](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Passkeys에 대한 Wikipedia 문서](https://en.wikipedia.org/wiki/Passkey_\(credential\))

### 이메일 모범 사례를 지원하십니까? {#do-you-support-email-best-practices}

네. 모든 플랜에서 SPF, DKIM, DMARC, ARC, SRS를 기본적으로 지원합니다. 또한, 이러한 사양의 원저자 및 다른 이메일 전문가들과 폭넓게 협력하여 완벽함과 높은 전달성을 보장했습니다.

### 바운스 웹훅을 지원하시나요? {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
팁:
</strong>
이메일 웹훅에 대한 문서를 찾고 계신가요? 자세한 내용은 <a href="/faq#do-you-support-webhooks" class="alert-link">웹훅을 지원하시나요?</a>를 참조하세요.
<span>
</span>
</div>

네, 2024년 8월 14일부터 이 기능이 추가되었습니다. 이제 내 계정 → 도메인 → 설정 → 반송 웹훅 URL로 이동하여 아웃바운드 SMTP 이메일이 반송될 때마다 `POST` 요청을 전송할 `http://` 또는 `https://` URL을 설정할 수 있습니다.

이 기능은 아웃바운드 SMTP를 관리하고 모니터링하는 데 유용하며, 구독자 유지 관리, 옵트아웃, 반송 발생 시 감지 등에 사용할 수 있습니다.

Bounce 웹훅 페이로드는 다음 속성을 포함하는 JSON으로 전송됩니다.

* `email_id`(문자열) - 내 계정 → 이메일(발신 SMTP)에 있는 이메일에 해당하는 이메일 ID
* `list_id`(문자열) - 원본 발신 이메일의 `List-ID` 헤더(대소문자 구분 없음) 값(있는 경우)
* `list_unsubscribe`(문자열) - 원본 발신 이메일의 `List-Unsubscribe` 헤더(대소문자 구분 없음) 값(있는 경우)
* `feedback_id`(문자열) - 원본 발신 이메일의 `Feedback-ID` 헤더(대소문자 구분 없음) 값(있는 경우)
* `recipient`(문자열) - 반송 또는 오류가 발생한 수신자의 이메일 주소
* `message`(문자열) - 반송에 대한 자세한 오류 메시지
* `response` (문자열) - SMTP 응답 메시지
* `list_id`0 (숫자) - 구문 분석된 SMTP 응답 코드
* `list_id`1 (문자열) - 응답 코드가 신뢰할 수 있는 출처에서 온 경우, 이 값은 루트 도메인 이름으로 채워집니다(예: `list_id`2 또는 `list_id`3).
* `list_id`4 (객체) - 반송 및 거부 상태를 자세히 설명하는 다음 속성을 포함하는 객체
* `list_id`5 (문자열) - 반송 작업(예: `list_id`6)
* `list_id`7 (문자열) - 반송 사유(예: `list_id`8)
* `list_id`9 (문자열) - 반송 범주(예: `List-ID`0)
* `List-ID`1(숫자) - 반송 상태 코드(예: `List-ID`2)
* `List-ID`3(문자열) - 응답 메시지의 반송 코드(예: `List-ID`4)
* `List-ID`5(숫자) - 파싱된 줄 번호(있는 경우), `List-ID`6(예: `List-ID`7)
* `List-ID`8(객체) - 발신 이메일 헤더의 키 값 쌍
* `List-ID`9(문자열) - `list_unsubscribe`0 형식의 반송 오류 발생 날짜

예를 들어:

```json
{
  "email_id": "66bcce793ef7b2a0928e14ba",
  "recipient": "example@gmail.com",
  "message": "The email account that you tried to reach is over quota.",
  "response": "552 5.2.2 The email account that you tried to reach is over quota.",
  "response_code": 552,
  "truth_source": "google.com",
  "bounce": {
    "action": "reject",
    "message": "Gmail Mailbox is full",
    "category": "capacity",
    "code": 552,
    "status": "5.2.2",
    "line": 300
  },
  "headers": {},
  "bounced_at": "2024-08-24T01:50:02.828Z"
}
```

바운스 웹훅과 관련된 몇 가지 추가 참고 사항은 다음과 같습니다.

* 웹훅 페이로드에 `list_id`, `list_unsubscribe` 또는 `feedback_id` 값이 포함된 경우, 필요에 따라 목록에서 `recipient`을 제거하는 적절한 조치를 취해야 합니다.
* `bounce.category` 값이 `"block"`, `"recipient"`, `"spam"` 또는 `"virus"` 중 하나라면, 해당 사용자를 목록에서 반드시 제거해야 합니다.
* 웹훅 페이로드를 확인해야 하는 경우(실제로 서버에서 전송되었는지 확인하기 위해), [역방향 조회를 사용하여 원격 클라이언트 IP 주소 클라이언트 호스트 이름을 확인합니다.](https://nodejs.org/api/dns.html#dnspromisesreverseip)를 사용할 수 있으며, `list_unsubscribe`0이어야 합니다.
* `list_unsubscribe`1과 비교하여 IP를 확인할 수도 있습니다.
* 내 계정 → 도메인 → 설정 → 웹훅 서명 페이로드 확인 키로 이동하여 웹훅 키를 받으세요.
* 보안상의 이유로 이 키는 언제든지 교체할 수 있습니다.
* 웹훅 요청의 `list_unsubscribe`2 값을 이 키를 사용하여 계산된 본문 값과 계산하여 비교합니다. 이 작업의 예는 `list_unsubscribe`3에서 확인할 수 있습니다.
* 자세한 내용은 <`list_unsubscribe`4>의 설명을 참조하세요.
* 웹훅 엔드포인트가 `list_unsubscribe`6 상태 코드로 응답할 때까지 최대 `list_unsubscribe`5초 동안 대기하며, 최대 `list_unsubscribe`7초 동안 재시도합니다.
* 요청을 보내는 동안 반송 웹훅 URL에 오류가 감지되면 일주일에 한 번 이메일을 보내드립니다.

### 웹훅을 지원하시나요? {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
팁:
</strong>
바운스 웹훅에 대한 문서를 찾고 계신가요? 자세한 내용은 <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">바운스 웹훅을 지원하시나요?</a>를 참조하세요.
<span>
</span>
</div>

네, 2020년 5월 15일부터 이 기능이 추가되었습니다. 다른 수신자와 마찬가지로 웹훅을 간편하게 추가하실 수 있습니다! 웹훅 URL에 "http" 또는 "https" 프로토콜 접두사가 포함되어 있는지 확인하세요.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
강화된 개인정보 보호:
</strong>
<span>
유료 플랜(강화된 개인정보 보호 기능 포함)을 사용 중이신 경우, <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">내 계정 <i class="fa fa-angle-right"></i>도메인</a>으로 이동하여 도메인 옆의 "별칭"을 클릭하여 웹훅을 구성하세요. 유료 플랜에 대한 자세한 내용은 <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">가격</a> 페이지를 참조하세요. 그렇지 않은 경우 아래 지침을 따르세요.
</span>
</div>

무료 플랜을 사용 중이라면 아래와 같이 새 DNS <strong class="notranslate">TXT</strong> 레코드를 추가하기만 하면 됩니다.

예를 들어, `alias@example.com`으로 전송되는 모든 이메일을 새 [요청 빈](https://requestbin.com/r/en8pfhdgcculn?inspect) 테스트 엔드포인트로 전달하려면 다음을 수행합니다.

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>이름/호스트/별칭</th>
<th class="text-center">TTL</th>
<th>유형</th>
<th>답변/값</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", 또는 공백</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

또는 `example.com`으로 전송되는 모든 이메일을 이 엔드포인트로 전달하려고 할 수도 있습니다.

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>이름/호스트/별칭</th>
<th class="text-center">TTL</th>
<th>유형</th>
<th>답변/값</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", 또는 공백</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

**웹훅에 대한 추가 참고 사항은 다음과 같습니다.**

* 웹훅 페이로드를 확인해야 하는 경우(실제로 저희 서버에서 전송되는지 확인하기 위해) [역방향 조회를 사용하여 원격 클라이언트 IP 주소 클라이언트 호스트 이름을 확인합니다.](https://nodejs.org/api/dns.html#dnspromisesreverseip)을 사용할 수 있습니다. `mx1.forwardemail.net` 또는 `mx2.forwardemail.net`여야 합니다.
* IP 주소를 [우리의 공개된 IP 주소](#what-are-your-servers-ip-addresses)과 비교할 수도 있습니다.
* 유료 플랜을 사용 중이시라면 내 계정 → 도메인 → 설정 → 웹훅 서명 페이로드 확인 키로 이동하여 웹훅 키를 받으세요.
* 보안상의 이유로 이 키는 언제든지 교체할 수 있습니다.
* 이 키를 사용하여 저희 웹훅 요청의 `X-Webhook-Signature` 값을 계산하여 본문의 계산된 값과 비교합니다. [이 Stack Overflow 게시물](https://stackoverflow.com/a/68885281)에서 이 작업을 수행하는 방법의 예시를 확인할 수 있습니다.
* 자세한 내용은 <https://github.com/forwardemail/free-email-forwarding/issues/235>>의 설명을 참조하세요.
* 웹훅이 `200` 상태 코드로 응답하지 않으면, 디버깅에 유용한 [오류 로그가 생성되었습니다](#do-you-store-error-logs)에 응답을 저장합니다.
* 웹훅 HTTP 요청은 SMTP 연결 시도 시마다 최대 3회까지 재시도하며, 엔드포인트 POST 요청당 최대 60초의 제한 시간을 가집니다. **단지 3회만 재시도한다는 의미는 아닙니다.** 실제로는 3번째 HTTP POST 요청 시도 실패 후 SMTP 코드 421(발신자에게 나중에 재시도하라는 의미)을 전송하여 지속적으로 재시도합니다. 즉, 이메일은 200 상태 코드에 도달할 때까지 며칠 동안 지속적으로 재시도됩니다.
* [슈퍼에이전트의 재시도 방법](https://ladjs.github.io/superagent/#retrying-requests)에 사용된 기본 상태 및 오류 코드를 기반으로 자동으로 재시도합니다(저희는 유지 관리 담당자입니다).
* 리소스를 절약하고 응답 시간을 단축하기 위해 동일한 엔드포인트에 대한 웹훅 HTTP 요청을 여러 번 요청하는 대신 하나의 요청으로 그룹화합니다. 예를 들어, <webhook1@example.com>, <webhook2@example.com>, <webhook3@example.com>으로 이메일을 보내고, 이 주소들이 모두 동일한 *정확한* 엔드포인트 URL에 연결되도록 구성된 경우, 요청은 하나만 생성됩니다. 엄격한 동등성(stretch equality)을 적용하여 정확한 엔드포인트 매칭을 통해 그룹화합니다.
* `mx1.forwardemail.net`0 라이브러리의 "simpleParser" 메서드를 사용하여 메시지를 JSON 친화적인 객체로 파싱합니다.
* 원시 이메일 값은 문자열로 "raw" 속성에 지정됩니다.
* 인증 결과는 "dkim", "spf", "arc", "dmarc", "bimi" 속성에 지정됩니다.
* 파싱된 이메일 헤더는 "headers" 속성에 지정됩니다. 하지만 반복 및 파싱을 더 쉽게 하기 위해 "headerLines"를 사용할 수도 있습니다.
* 이 웹훅의 그룹화된 수신자는 그룹화되어 "recipients" 속성에 지정됩니다.
* SMTP 세션 정보는 "session" 속성으로 제공됩니다. 여기에는 메시지 발신자, 메시지 도착 시간, HELO, 클라이언트 호스트 이름에 대한 정보가 포함됩니다. 클라이언트 호스트 이름 값인 `mx1.forwardemail.net`1은 역방향 PTR 조회를 통해 얻은 FQDN이거나 대괄호로 묶인 `mx1.forwardemail.net`2(예: `mx1.forwardemail.net`3)입니다.
* `mx1.forwardemail.net`4 값을 빠르게 가져오려면 `mx1.forwardemail.net`5 값을 사용할 수 있습니다(아래 예 참조). `mx1.forwardemail.net`6 헤더는 메시지의 원래 수신자(마스크 전달 전)와의 디버깅을 위해 메시지에 추가하는 헤더입니다.
* 페이로드 본문에서 `mx1.forwardemail.net`7 및/또는 `mx1.forwardemail.net`8 속성을 제거해야 하는 경우, 웹훅 엔드포인트에 쿼리스트링 매개변수(예: `mx2.forwardemail.net`2)로 `mx1.forwardemail.net`9, `mx2.forwardemail.net`0 또는 `mx2.forwardemail.net`1을 추가하기만 하면 됩니다.
* 첨부 파일이 있는 경우, 버퍼 값을 사용하여 `mx2.forwardemail.net`3 배열에 추가됩니다. 다음과 같은 JavaScript 방식을 사용하여 첨부 파일을 다시 콘텐츠로 파싱할 수 있습니다.

  ```js
  const data = [
    104,
    101,
    108,
    108,
    111,
    32,
    119,
    111,
    114,
    108,
    100,
    33
  ];

  //
  // outputs "hello world!" to the console
  // (this is the content from the filename "text1.txt" in the example JSON request payload above)
  //
  console.log(Buffer.from(data).toString());
  ```

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
팁:
</strong>
전달된 이메일에서 웹훅 요청이 어떻게 보이는지 궁금하신가요? 아래에 예시를 첨부했습니다!
<span>
</span>
</div>

```json
{
  "attachments": [
    {
      "type": "attachment",
      "content": {
        "type": "Buffer",
        "data": [
          104,
          101,
          108,
          108,
          111,
          32,
          119,
          111,
          114,
          108,
          100,
          33
        ]
      },
      "contentType": "text/plain",
      "partId": "2",
      "release": null,
      "contentDisposition": "attachment",
      "filename": "text1.txt",
      "headers": {},
      "checksum": "fc3ff98e8c6a0d3087d515c0473f8677",
      "size": 12
    }
  ],
  "headers": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\n",
  "headerLines": [
    {
      "key": "arc-seal",
      "line": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0="
    },
    {
      "key": "arc-message-signature",
      "line": "ARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino="
    },
    {
      "key": "arc-authentication-results",
      "line": "ARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "received-spf",
      "line": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;"
    },
    {
      "key": "authentication-results",
      "line": "Authentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "x-forward-email-sender",
      "line": "X-Forward-Email-Sender: rfc822; test@example.net"
    },
    {
      "key": "x-forward-email-session-id",
      "line": "X-Forward-Email-Session-ID: w2czxgznghn5ryyw"
    },
    {
      "key": "x-forward-email-version",
      "line": "X-Forward-Email-Version: 9.0.0"
    },
    {
      "key": "content-type",
      "line": "Content-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\""
    },
    {
      "key": "from",
      "line": "From: some <random@example.com>"
    },
    {
      "key": "message-id",
      "line": "Message-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>"
    },
    {
      "key": "date",
      "line": "Date: Wed, 25 May 2022 19:26:41 +0000"
    },
    {
      "key": "mime-version",
      "line": "MIME-Version: 1.0"
    }
  ],
  "html": "<strong>some random text</strong>",
  "text": "some random text",
  "textAsHtml": "<p>some random text</p>",
  "date": "2022-05-25T19:26:41.000Z",
  "from": {
    "value": [
      {
        "address": "random@example.com",
        "name": "some"
      }
    ],
    "html": "<span class=\"mp_address_group\"><span class=\"mp_address_name\">some</span> &lt;<a href=\"mailto:random@example.com\" class=\"mp_address_email\">random@example.com</a>&gt;</span>",
    "text": "some <random@example.com>"
  },
  "messageId": "<69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>",
  "raw": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nX-Forward-Email-Sender: rfc822; test@example.net\r\nX-Forward-Email-Session-ID: w2czxgznghn5ryyw\r\nX-Forward-Email-Version: 9.0.0\r\nContent-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\"\r\nFrom: some <random@example.com>\r\nMessage-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>\r\nDate: Wed, 25 May 2022 19:26:41 +0000\r\nMIME-Version: 1.0\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: multipart/alternative;\r\n boundary=\"--_NmP-179a735428ca7575-Part_2\"\r\n\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\nsome random text\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/html; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\n<strong>some random text</strong>\r\n----_NmP-179a735428ca7575-Part_2--\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: text/plain; name=text1.txt\r\nContent-Transfer-Encoding: base64\r\nContent-Disposition: attachment; filename=text1.txt\r\n\r\naGVsbG8gd29ybGQh\r\n----_NmP-179a735428ca7575-Part_1--\r\n",
  "dkim": {
    "headerFrom": [
      "random@example.com"
    ],
    "envelopeFrom": "test@example.net",
    "results": [
      {
        "status": {
          "result": "none",
          "comment": "message not signed"
        },
        "info": "dkim=none (message not signed)"
      }
    ]
  },
  "spf": {
    "domain": "example.net",
    "client-ip": "127.0.0.1",
    "helo": "user.oem.local",
    "envelope-from": "test@example.net",
    "status": {
      "result": "none",
      "comment": "mx1.forwardemail.net: example.net does not designate permitted sender hosts",
      "smtp": {
        "mailfrom": "test@example.net",
        "helo": "user.oem.local"
      }
    },
    "header": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;",
    "info": "spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local",
    "lookups": {
      "limit": 50,
      "count": 1
    }
  },
  "arc": {
    "status": {
      "result": "none"
    },
    "i": 0,
    "authResults": "mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
  },
  "dmarc": {
    "status": {
      "result": "none",
      "header": {
        "from": "example.com"
      }
    },
    "domain": "example.com",
    "info": "dmarc=none header.from=example.com"
  },
  "bimi": {
    "status": {
      "header": {},
      "result": "skipped",
      "comment": "DMARC not enabled"
    },
    "info": "bimi=skipped (DMARC not enabled)"
  },
  "recipients": [
    "webhook1@webhooks.net"
  ],
  "session": {
    "recipient": "webhook1@webhooks.net",
    "remoteAddress": "127.0.0.1",
    "remotePort": 65138,
    "clientHostname": "[127.0.0.1]",
    "hostNameAppearsAs": "user.oem.local",
    "sender": "test@example.net",
    "mta": "mx1.forwardemail.net",
    "arrivalDate": "2022-05-25T19:26:41.423Z",
    "arrivalTime": 1653506801423
  }
}
```

### 정규 표현식이나 정규식을 지원합니까? {#do-you-support-regular-expressions-or-regex}

네, 2021년 9월 27일부터 이 기능이 추가되었습니다. 정규 표현식("regex")을 작성하여 별칭을 일치시키고 대체 작업을 수행할 수 있습니다.

정규 표현식에서 지원하는 별칭은 `/`으로 시작하고 `/`로 끝나는 별칭이며, 수신자는 이메일 주소 또는 웹훅입니다. 수신자는 정규 표현식 대체 지원(예: `$1`, `$2`)을 포함할 수도 있습니다.

`i`과 `g`을 포함한 두 가지 정규 표현식 플래그를 지원합니다. `i`의 대소문자 구분 플래그는 영구적인 기본값이며 항상 적용됩니다. `g`의 전역 플래그는 `/`의 끝에 `/g`를 붙여서 추가할 수 있습니다.

정규식 지원을 통해 수신자 부분에 대한 <a href="#can-i-disable-specific-aliases">disabled 별칭 기능</a>도 지원합니다.

<a href="/disposable-addresses" target="_blank">글로벌 베니티 도메인</a>에서는 정규 표현식이 지원되지 않습니다(보안 취약점이 될 수 있음).

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
강화된 개인정보 보호:
</strong>
<span>
유료 플랜(강화된 개인정보 보호 기능 포함)을 사용 중이신 경우, <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">내 계정 <i class="fa fa-angle-right"></i>도메인</a>으로 이동하여 도메인 옆의 "별칭"을 클릭하여 정규 표현식을 설정하세요. 유료 플랜에 대한 자세한 내용은 <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">가격</a> 페이지를 참조하세요. 그렇지 않은 경우 아래 지침을 따르세요.
</span>
</div>

무료 플랜을 사용 중이시라면 아래에 제공된 예시 중 하나 이상을 사용하여 새 DNS <strong class="notranslate">TXT</strong> 레코드를 추가하기만 하면 됩니다.

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>간단한 예:</strong> `linus@example.com` 또는 `torvalds@example.com`로 전송되는 모든 이메일을 `user@gmail.com`로 전달하려면 다음과 같이 설정합니다.
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>이름/호스트/별칭</th>
<th class="text-center">TTL</th>
<th>유형</th>
<th>답변/값</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", 또는 공백</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>이름 성 대체 예시:</strong> 모든 회사 이메일 주소가 `firstname.lastname@example.com` 패턴을 따른다고 가정해 보겠습니다. `firstname.lastname@example.com` 패턴으로 전송되는 모든 이메일을 대체 기능을 지원하는 `firstname.lastname@company.com`로 전달하려면 다음과 같이 합니다(<a href="https://regexr.com/66hnu" class="alert-link">RegExr 테스트 보기</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>이름/호스트/별칭</th>
<th class="text-center">TTL</th>
<th>유형</th>
<th>답변/값</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", 또는 공백</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>더하기 기호 필터링 대체 예:</strong> `info@example.com` 또는 `support@example.com`로 전송되는 모든 이메일을 각각 `user+info@gmail.com` 또는 `user+support@gmail.com`으로 전달하려는 경우(대체 기능 지원) (<a href="https://regexr.com/66ho7" class="alert-link">RegExr 테스트 보기</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>이름/호스트/별칭</th>
<th class="text-center">TTL</th>
<th>유형</th>
<th>답변/값</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", 또는 공백</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>웹훅 쿼리 문자열 대체 예시:</strong> `example.com`으로 전송되는 모든 이메일을 <a href="#do-you-support-webhooks" class="alert-link">웹훅</a>으로 전송하고, 이메일 주소의 사용자 이름 부분을 값으로 갖는 동적 쿼리 문자열 키 "to"를 지정하고 싶을 수 있습니다(<a href="https://regexr.com/66ho4" class="alert-link">RegExr에서 테스트 보기</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>이름/호스트/별칭</th>
<th class="text-center">TTL</th>
<th>유형</th>
<th>답변/값</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", 또는 공백</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>자동 거부 예시:</strong> 특정 패턴과 일치하는 모든 이메일을 비활성화하고, 상태 코드 `250`(<a href="#can-i-disable-specific-aliases" class="alert-link">특정 별칭을 비활성화할 수 있나요?</a> 참조)을 사용하여 자동 거부(발신자에게는 메시지가 성공적으로 전송된 것처럼 보이지만 실제로는 아무 데도 전송되지 않음)하려면 느낌표("!") 하나만 사용하여 동일한 방법을 사용하면 됩니다. 이는 발신자에게 메시지가 성공적으로 전송되었지만 실제로는 아무 데도 전송되지 않았음을 나타냅니다(예: 블랙홀 또는 `/dev/null`).
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>이름/호스트/별칭</th>
<th class="text-center">TTL</th>
<th>유형</th>
<th>답변/값</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", 또는 공백</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>소프트 거부 예시:</strong> 특정 패턴과 일치하는 모든 이메일을 비활성화하고 상태 코드 `421`을 사용하여 소프트 거부하려면(<a href="#can-i-disable-specific-aliases" class="alert-link">특정 별칭을 비활성화할 수 있나요?</a> 참조), 동일한 방법에 느낌표 두 개("!!")를 추가하면 됩니다. 이는 발신자에게 이메일을 다시 보내라는 의미이며, 이 별칭으로 전송된 이메일은 약 5일 동안 재시도된 후 영구적으로 거부됩니다.
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>이름/호스트/별칭</th>
<th class="text-center">TTL</th>
<th>유형</th>
<th>답변/값</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", 또는 공백</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>강제 거부 예시:</strong> 특정 패턴과 일치하는 모든 이메일을 비활성화하고 상태 코드 `550`을 사용하여 강제 거부하려면(<a href="#can-i-disable-specific-aliases" class="alert-link">특정 별칭을 비활성화할 수 있나요?</a> 참조), 동일한 방법에 느낌표 세 개("!!!")를 추가하면 됩니다. 이렇게 하면 발신자에게 영구적인 오류가 발생했음을 알리고 이메일이 재시도되지 않으며, 해당 별칭으로 인해 거부됩니다.
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>이름/호스트/별칭</th>
<th class="text-center">TTL</th>
<th>유형</th>
<th>답변/값</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", 또는 공백</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!!!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
팁:
</strong>
정규 표현식을 작성하는 방법이 궁금하거나 대체 표현식을 테스트해야 하나요? 무료 정규 표현식 테스트 웹사이트 <a href="https://regexr.com" class="alert-link">RegExr</a>(<a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.)를 방문하세요.
<span>
</span>
</div>

### 아웃바운드 SMTP 한도는 얼마입니까? {#what-are-your-outbound-smtp-limits}

사용자와 도메인에 대해 하루에 최대 300개의 SMTP 발신 메시지로 제한합니다. 이는 한 달 평균 9,000개 이상의 이메일에 해당합니다. 이 용량을 초과하거나 지속적으로 대용량 이메일을 수신해야 하는 경우 [문의하기](https://forwardemail.net/help)을 사용해 주세요.

### SMTP를 활성화하려면 승인이 필요합니까? {#do-i-need-approval-to-enable-smtp}

네, IP 평판을 유지하고 전달성을 보장하기 위해 Forward Email은 아웃바운드 SMTP 승인 시 도메인별로 수동 검토 프로세스를 진행합니다. <support@forwardemail.net>으로 이메일을 보내시거나 [도움 요청](https://forwardemail.net/help)을 열어 승인을 요청하세요. 일반적으로 24시간 이내에 완료되며, 대부분의 요청은 1~2시간 이내에 처리됩니다. 향후 추가적인 스팸 차단 및 알림 기능을 통해 이 프로세스를 즉시 진행할 예정입니다. 이 프로세스를 통해 이메일이 받은 편지함에 도착하고 스팸으로 표시되지 않도록 할 수 있습니다.

### SMTP 서버 구성 설정은 무엇입니까? {#what-are-your-smtp-server-configuration-settings}

저희 서버는 `smtp.forwardemail.net`이며, <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">상태 페이지</a>에서도 모니터링됩니다.

IPv4와 IPv6를 모두 지원하고 SSL/TLS의 경우 `465` 및 `2465` 포트에서 사용할 수 있으며 TLS(STARTTLS)의 경우 `587`, `2587`, `2525`, `25` 포트에서 사용할 수 있습니다.

| 규약 | 호스트 이름 | 포트 | IPv4 | IPv6 |
| :--------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: |
| `SSL/TLS` **권장** | `smtp.forwardemail.net` | `465`, `2465` | :흰색_체크_표시: | :흰색_체크_표시: |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :흰색_체크_표시: | :흰색_체크_표시: |

| 로그인 | 예 | 설명 |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 사용자 이름 | `user@example.com` | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a>에 존재하는 별칭의 이메일 주소입니다. |
| 비밀번호 | `************************` | 별칭별로 생성된 비밀번호입니다. |

SMTP를 사용하여 아웃바운드 이메일을 보내려면 **SMTP 사용자**는 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a>에 존재하는 별칭의 이메일 주소여야 하며, **SMTP 비밀번호**는 별칭별로 생성된 비밀번호여야 합니다.

단계별 지침은 [SMTP를 사용하여 이메일을 보내는 것을 지원합니까?](#do-you-support-sending-email-with-smtp)을 참조하세요.

### IMAP 서버 구성 설정은 무엇입니까? {#what-are-your-imap-server-configuration-settings}

저희 서버는 `imap.forwardemail.net`이며, <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">상태 페이지</a>에서도 모니터링됩니다.

IPv4와 IPv6를 모두 지원하며 SSL/TLS의 경우 `993` 및 `2993` 포트를 통해 사용할 수 있습니다.

| 규약 | 호스트 이름 | 포트 | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **권장** | `imap.forwardemail.net` | `993`, `2993` | :흰색_체크_표시: | :흰색_체크_표시: |

| 로그인 | 예 | 설명 |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 사용자 이름 | `user@example.com` | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a>에 존재하는 별칭의 이메일 주소입니다. |
| 비밀번호 | `************************` | 별칭별로 생성된 비밀번호입니다. |

IMAP에 연결하려면 **IMAP 사용자**는 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a>에 존재하는 별칭의 이메일 주소여야 하며, **IMAP 비밀번호**는 별칭별로 생성된 비밀번호여야 합니다.

단계별 지침은 [IMAP으로 이메일 수신을 지원하시나요?](#do-you-support-receiving-email-with-imap)을 참조하세요.

### POP3 서버 구성 설정은 무엇입니까? {#what-are-your-pop3-server-configuration-settings}

저희 서버는 `pop3.forwardemail.net`이며, <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">상태 페이지</a>에서도 모니터링됩니다.

IPv4와 IPv6를 모두 지원하며 SSL/TLS의 경우 `995` 및 `2995` 포트를 통해 사용할 수 있습니다.

| 규약 | 호스트 이름 | 포트 | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **권장** | `pop3.forwardemail.net` | `995`, `2995` | :흰색_체크_표시: | :흰색_체크_표시: |

| 로그인 | 예 | 설명 |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 사용자 이름 | `user@example.com` | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a>에 존재하는 별칭의 이메일 주소입니다. |
| 비밀번호 | `************************` | 별칭별로 생성된 비밀번호입니다. |

POP3에 연결하려면 **POP3 사용자**는 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a>에 존재하는 별칭의 이메일 주소여야 하며, **IMAP 비밀번호**는 별칭별로 생성된 비밀번호여야 합니다.

단계별 지침은 [POP3를 지원하시나요?](#do-you-support-pop3)을 참조하세요.

### Postfix SMTP 릴레이 구성 {#postfix-smtp-relay-configuration}

Postfix를 구성하여 Forward Email의 SMTP 서버를 통해 이메일을 릴레이할 수 있습니다. 이 기능은 이메일을 보내야 하는 서버 애플리케이션에 유용합니다.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">예상 설정 시간:</strong>
<span>15분 미만</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
중요:
</strong>
<span>
SMTP 액세스가 활성화된 유료 플랜이 필요합니다.
</span>
</div>

#### 설치 {#installation}

1. 서버에 Postfix를 설치하세요:

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. 설치 중에 구성 유형을 묻는 메시지가 나타나면 "인터넷 사이트"를 선택하세요.

#### 구성 {#configuration}

1. 주요 Postfix 구성 파일을 편집합니다.

```bash
sudo nano /etc/postfix/main.cf
```

2. 다음 설정을 추가하거나 수정하세요.

```
# SMTP relay configuration
relayhost = [smtp.forwardemail.net]:587
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. SASL 암호 파일을 만듭니다.

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. 전달 이메일 자격 증명을 추가합니다.

```
[smtp.forwardemail.net]:587 your-alias@yourdomain.com:your-generated-password
```

5. 비밀번호 파일을 보호하고 해시합니다.

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Postfix를 다시 시작합니다.

```bash
sudo systemctl restart postfix
```

#### 테스트 중 {#testing}}

테스트 이메일을 보내어 구성을 테스트하세요.

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

## 보안 {#security}

### 고급 서버 강화 기술 {#advanced-server-hardening-techniques}

> \[!TIP]
> [보안 페이지](/security)에서 보안 인프라에 대해 자세히 알아보세요.

Forward Email은 인프라와 귀하의 데이터의 보안을 보장하기 위해 다양한 서버 강화 기술을 구현합니다.

1. **네트워크 보안**:
* 엄격한 규칙을 적용하는 IP 테이블 방화벽
* 무차별 대입 공격 방어를 위한 Fail2ban
* 정기적인 보안 감사 및 침투 테스트
* VPN 전용 관리자 접근 권한

2. **시스템 강화**:
* 최소 패키지 설치
* 정기적인 보안 업데이트
* SELinux 강제 모드
* 루트 SSH 액세스 비활성화
* 키 기반 인증만 사용

3. **애플리케이션 보안**:
* 콘텐츠 보안 정책(CSP) 헤더
* HTTPS 엄격한 전송 보안(HSTS)
* XSS 보호 헤더
* 프레임 옵션 및 참조자 정책 헤더
* 정기적인 종속성 감사

4. **데이터 보호**:
* LUKS를 통한 전체 디스크 암호화
* 안전한 키 관리
* 암호화를 통한 정기 백업
* 데이터 최소화 관행

5. **모니터링 및 대응**:
* 실시간 침입 탐지
* 자동 보안 스캐닝
* 중앙 집중식 로깅 및 분석
* 사고 대응 절차

> \[!IMPORTANT]
> 당사의 보안 관행은 새로운 위협과 취약점에 대응하기 위해 지속적으로 업데이트됩니다.

> \[!TIP]
> 최고의 보안을 위해 OpenPGP를 통한 종단 간 암호화를 지원하는 서비스를 이용하시는 것을 권장합니다.

### SOC 2 또는 ISO 27001 인증을 받았습니까? {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> 이메일 전달은 업계 표준 준수를 보장하기 위해 인증된 하위 프로세서가 제공하는 인프라를 기반으로 운영됩니다.

Forward Email은 SOC 2 Type II 또는 ISO 27001 인증을 직접 보유하고 있지 않습니다. 하지만 이 서비스는 인증된 하위 처리업체가 제공하는 인프라를 기반으로 운영됩니다.

* **DigitalOcean**: SOC 2 Type II 및 SOC 3 Type II 인증(Schellman & Company LLC 감사), 여러 데이터 센터에서 ISO 27001 인증 획득. 자세한 내용: <https://www.digitalocean.com/trust/certification-reports>

* **Vultr**: SOC 2+ (HIPAA) 인증, ISO/IEC 인증: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. 자세한 내용: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: SOC 2 준수(인증을 받으려면 DataPacket에 직접 문의하세요), 엔터프라이즈급 인프라 제공업체(덴버 소재). 세부 정보: <https://www.datapacket.com/datacenters/denver>

Forward Email은 보안 감사에 대한 업계 모범 사례를 준수하며 독립적인 보안 연구원들과 정기적으로 협력합니다. 출처: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### 이메일 전달에 TLS 암호화를 사용하시나요? {#do-you-use-tls-encryption-for-email-forwarding}

네. Forward Email은 모든 연결(HTTPS, SMTP, IMAP, POP3)에 대해 TLS 1.2+를 엄격하게 적용하고, 향상된 TLS 지원을 위해 MTA-STS를 구현합니다. 구현 내용은 다음과 같습니다.

* 모든 이메일 연결에 TLS 1.2+ 적용
* 완전 순방향 비밀성을 위한 ECDHE(Elliptic Curve Diffie-Hellman Ephemeral) 키 교환
* 정기적인 보안 업데이트가 포함된 최신 암호화 제품군
* 향상된 성능 및 보안을 위한 HTTP/2 지원
* 주요 브라우저에 사전 로딩되는 HSTS(HTTP Strict Transport Security)
* 엄격한 TLS 적용을 위한 **MTA-STS(Mail Transfer Agent Strict Transport Security)**

출처: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**MTA-STS 구현**: Forward Email은 코드베이스에 엄격한 MTA-STS 적용을 구현합니다. TLS 오류가 발생하고 MTA-STS가 적용되면 시스템은 421 SMTP 상태 코드를 반환하여 이메일이 안전하지 않게 전송되는 것을 방지하고 나중에 재시도되도록 합니다. 구현 세부 정보:

* TLS 오류 감지: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* 이메일 보내기 도우미에서 MTA-STS 적용: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

타사 검증: <https://www.hardenize.com/report/forwardemail.net/1750312779>은 모든 TLS 및 전송 보안 조치에 대해 "좋음" 등급을 표시합니다.

### 이메일 인증 헤더를 보존합니까? {#do-you-preserve-email-authentication-headers}

네. Forward Email은 이메일 인증 헤더를 포괄적으로 구현하고 보존합니다.

* **SPF(발신자 정책 프레임워크)**: 적절하게 구현 및 유지됨
* **DKIM(도메인키 식별 메일)**: 적절한 키 관리를 통한 완벽한 지원
* **DMARC**: SPF 또는 DKIM 유효성 검사에 실패한 이메일에 대한 정책 적용
* **ARC**: 명시적으로 자세히 설명되어 있지는 않지만, 서비스의 완벽한 규정 준수 점수는 포괄적인 인증 헤더 처리를 시사합니다.

출처: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

검증: Internet.nl 메일 테스트에서 "SPF, DKIM, DMARC" 구현에 대해 100/100점을 받았습니다. Hardenize 평가에서 SPF 및 DMARC에 대해 "좋음" 등급을 확인했습니다. <https://www.hardenize.com/report/forwardemail.net/1750312779>

### 원래 이메일 헤더를 보존하고 스푸핑을 방지합니까? {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email은 정교한 스푸핑 방지 기능을 구현하여 이메일 남용을 방지합니다.

Forward Email은 MX 코드베이스를 통해 포괄적인 스푸핑 방지 보호 기능을 구현하는 동시에 원래 이메일 헤더를 보존합니다.

* **헤더 보존**: 전달 중에 원본 인증 헤더가 유지됩니다.
* **스푸핑 방지**: DMARC 정책 적용을 통해 SPF 또는 DKIM 검증에 실패한 이메일을 거부하여 헤더 스푸핑을 방지합니다.
* **헤더 삽입 방지**: striptags 라이브러리를 사용한 입력 검증 및 삭제
* **고급 보호**: 스푸핑 탐지, 사칭 방지 및 사용자 알림 시스템을 갖춘 정교한 피싱 탐지 기능

**MX 구현 세부 정보**: 핵심 이메일 처리 로직은 MX 서버 코드베이스에서 처리됩니다. 구체적으로는 다음과 같습니다.

* 기본 MX 데이터 핸들러: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* 임의 이메일 필터링(스푸핑 방지): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

`isArbitrary` 도우미는 도메인 사칭, 차단된 구문, 다양한 피싱 패턴 감지를 포함한 정교한 스푸핑 방지 규칙을 구현합니다.

출처: <https://forwardemail.net/technical-whitepaper.pdf#page=32>

### 스팸 및 남용으로부터 어떻게 보호하나요? {#how-do-you-protect-against-spam-and-abuse}

Forward Email은 포괄적인 다중 계층 보호 기능을 구현합니다.

* **속도 제한**: 인증 시도, API 엔드포인트 및 SMTP 연결에 적용됩니다.
* **리소스 격리**: 사용자 간 트래픽이 많은 사용자의 영향을 방지합니다.
* **DDoS 보호**: DataPacket의 Shield 시스템과 Cloudflare를 통한 다층 보호
* **자동 확장**: 수요에 따른 동적 리소스 조정
* **오류 방지**: 사용자별 오류 방지 검사 및 악성 콘텐츠에 대한 해시 기반 차단
* **이메일 인증**: 고급 피싱 탐지 기능을 갖춘 SPF, DKIM, DMARC 프로토콜

출처:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (DDoS 보호 세부 정보)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### 이메일 콘텐츠를 디스크에 저장하시나요? {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> 이메일 전달은 이메일 내용이 디스크에 기록되는 것을 방지하는 영지식 아키텍처를 사용합니다.

* **영지식 아키텍처**: 개별적으로 암호화된 SQLite 사서함으로 인해 Forward Email이 이메일 콘텐츠에 액세스할 수 없습니다.
* **메모리 내 처리**: 이메일 처리가 디스크 저장을 피하고 메모리에서 완전히 처리됩니다.
* **콘텐츠 로깅 없음**: "이메일 콘텐츠나 메타데이터를 디스크에 로깅하거나 저장하지 않습니다."
* **샌드박스 암호화**: 암호화 키는 디스크에 일반 텍스트로 저장되지 않습니다.

**MX 코드베이스 증거**: MX 서버는 디스크에 내용을 쓰지 않고 메모리에서 이메일을 완전히 처리합니다. 주요 이메일 처리 핸들러는 이러한 메모리 내 접근 방식을 보여줍니다. <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

출처:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (초록)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (영지식 세부 정보)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (샌드박스 암호화)

### 시스템 충돌 중에 이메일 콘텐츠가 노출될 수 있습니까? {#can-email-content-be-exposed-during-system-crashes}

아니요. Forward Email은 충돌 관련 데이터 노출에 대한 포괄적인 보호 장치를 구현합니다.

* **코어 덤프 비활성화**: 충돌 시 메모리 노출 방지
* **스왑 메모리 비활성화**: 스왑 파일에서 민감한 데이터 추출 방지를 위해 완전히 비활성화
* **인메모리 아키텍처**: 이메일 콘텐츠는 처리 중 휘발성 메모리에만 존재합니다.
* **암호화 키 보호**: 키는 디스크에 일반 텍스트로 저장되지 않습니다.
* **물리적 보안**: LUKS v2 암호화 디스크는 데이터에 대한 물리적 액세스를 방지합니다.
* **USB 저장 장치 비활성화**: 무단 데이터 추출 방지

**시스템 문제에 대한 오류 처리**: Forward Email은 도우미 함수 `isCodeBug` 및 `isTimeoutError`을 사용하여 데이터베이스 연결 문제, DNS 네트워크/차단 목록 문제 또는 업스트림 연결 문제가 발생할 경우 시스템에서 421 SMTP 상태 코드를 반환하여 이메일이 손실되거나 노출되는 것을 방지하기 위해 나중에 다시 시도되도록 합니다.

구현 세부 정보:

* 오류 분류: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* MX 처리 시 시간 초과 오류 처리: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

출처: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### 이메일 인프라에 액세스할 수 있는 사람 {#who-has-access-to-your-email-infrastructure}

Forward Email은 엄격한 2FA 요구 사항을 충족하는 최소 2~3명의 엔지니어링 팀 접근에 대한 포괄적인 접근 제어를 구현합니다.

* **역할 기반 접근 제어**: 리소스 기반 권한이 있는 팀 계정용
* **최소 권한 원칙**: 모든 시스템에 적용
* **업무 분리**: 운영 역할 간
* **사용자 관리**: 배포 및 DevOps 사용자를 별도의 권한으로 분리
* **루트 로그인 비활성화**: 올바르게 인증된 계정을 통해서만 접근
* **엄격한 2FA**: MiTM 공격 위험으로 인해 SMS 기반 2FA 사용 안 함 - 앱 기반 또는 하드웨어 토큰만 사용
* **종합 감사 로깅**: 민감한 데이터 삭제
* **자동 이상 탐지**: 비정상적인 접근 패턴
* **정기 보안 검토**: 접근 로그
* **악의적인 메이드 공격 방지**: USB 저장 장치 비활성화 및 기타 물리적 보안 조치

출처:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (권한 제어)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (네트워크 보안)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (악의적인 메이드 공격 방지)

### 어떤 인프라 제공자를 사용하십니까? {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> 이메일 전달은 포괄적인 규정 준수 인증을 받은 여러 인프라 하위 프로세서를 사용합니다.

자세한 내용은 GDPR 준수 페이지에서 확인할 수 있습니다: <https://forwardemail.net/gdpr>

**주요 인프라 하위 프로세서:**

| 공급자 | 데이터 개인 정보 보호 프레임워크 인증 | GDPR 준수 페이지 |
| ---------------- | -------------------------------- | ----------------------------------------------- |
| **클라우드플레어** | ✅ 네 | <https://www.cloudflare.com/trust-hub/gdpr/> |
| **데이터 패킷** | ❌ 아니요 | <https://www.datapacket.com/privacy-policy> |
| **디지털오션** | ❌ 아니요 | <https://www.digitalocean.com/legal/gdpr> |
| **벌트르** | ❌ 아니요 | <https://www.vultr.com/legal/eea-gdpr-privacy/> |

**자세한 인증:**

**디지털오션**

* SOC 2 Type II 및 SOC 3 Type II(Schellman & Company LLC 감사)
* 여러 데이터 센터에서 ISO 27001 인증 획득
* PCI-DSS 준수
* CSA STAR 레벨 1 인증
* APEC CBPR PRP 인증
* 세부 정보: <https://www.digitalocean.com/trust/certification-reports>

**벌트르**

* SOC 2+ (HIPAA) 인증
* PCI Merchant 준수
* CSA STAR 레벨 1 인증
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* 세부 정보: <https://www.vultr.com/legal/compliance/>

**데이터 패킷**

* SOC 2 준수(인증 획득을 위해 DataPacket에 직접 문의하세요)
* 엔터프라이즈급 인프라(덴버 지점)
* Shield 사이버 보안 스택을 통한 DDoS 보호
* 24시간 연중무휴 기술 지원
* 58개 데이터 센터에 걸친 글로벌 네트워크
* 세부 정보: <https://www.datapacket.com/datacenters/denver>

**결제 처리업체:**

* **Stripe**: 데이터 프라이버시 프레임워크 인증 - <https://stripe.com/legal/privacy-center>
* **PayPal**: DPF 인증 없음 - <https://www.paypal.com/uk/legalhub/privacy-full>

### 데이터 처리 계약(DPA)을 제공하시나요? {#do-you-offer-a-data-processing-agreement-dpa}

네, Forward Email은 기업 계약과 함께 체결할 수 있는 포괄적인 데이터 처리 계약(DPA)을 제공합니다. DPA 사본은 <https://forwardemail.net/dpa>>에서 확인하실 수 있습니다.

**DPA 세부 정보:**

* GDPR 준수 및 EU-US/Swiss-US Privacy Shield 프레임워크 적용
* 서비스 약관 동의 시 자동 동의
* 표준 DPA에 별도 서명 필요 없음
* Enterprise License를 통해 맞춤형 DPA 구성 가능

**GDPR 준수 프레임워크:**
당사의 DPA는 GDPR 및 국제 데이터 전송 요건 준수에 대한 자세한 내용을 담고 있습니다. 자세한 내용은 <https://forwardemail.net/gdpr>>에서 확인하실 수 있습니다.

맞춤형 DPA 약관이나 특정 계약 조건이 필요한 기업 고객의 경우 **기업용 라이선스(월 $250)** 프로그램을 통해 해결할 수 있습니다.

### 데이터 침해 알림을 어떻게 처리하시나요? {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Forward Email의 제로 지식 아키텍처는 침해 영향을 크게 제한합니다.

* **제한된 데이터 노출**: 제로 지식 아키텍처로 인해 암호화된 이메일 콘텐츠에 접근할 수 없습니다.
* **최소한의 데이터 수집**: 보안을 위해 기본 구독자 정보와 제한된 IP 로그만 수집합니다.
* **하위 프로세서 프레임워크**: DigitalOcean과 Vultr는 GDPR을 준수하는 사고 대응 절차를 유지합니다.

**GDPR 담당자 정보:**
Forward Email은 제27조에 따라 GDPR 담당자를 임명했습니다.

**EU 담당자:**
Osano International Compliance Services Limited
담당자: LFHC
더블린 랜딩스 3번지, 노스 월 키
더블린 1, D01C4E0

**영국 담당자:**
Osano UK Compliance LTD
담당: LFHC
벨파운틴 스트리트 42-46번지, 벨파스트
앤트림, BT1 - 5EF

특정 침해 알림 SLA가 필요한 기업 고객의 경우 **기업 라이선스** 계약의 일부로 논의해야 합니다.

출처:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### 테스트 환경을 제공하시나요? {#do-you-offer-a-test-environment}

Forward Email의 기술 문서에는 전용 샌드박스 모드에 대한 구체적인 설명이 없습니다. 그러나 다음과 같은 테스트 방법을 사용할 수 있습니다.

* **셀프 호스팅 옵션**: 테스트 환경 구축을 위한 포괄적인 셀프 호스팅 기능
* **API 인터페이스**: 구성의 프로그래밍 방식 테스트 가능성
* **오픈 소스**: 100% 오픈 소스 코드를 통해 고객이 전달 로직을 검토할 수 있습니다.
* **다중 도메인**: 다중 도메인 지원을 통해 테스트 도메인 생성이 가능

정식 샌드박스 기능이 필요한 기업 고객의 경우, **기업 라이선스** 계약의 일부로 이를 논의해야 합니다.

출처: <https://github.com/forwardemail/forwardemail.net> (개발 환경 세부 정보)

### 모니터링 및 알림 도구를 제공하시나요? {#do-you-provide-monitoring-and-alerting-tools}

Forward Email은 일부 제한 사항이 있지만 실시간 모니터링을 제공합니다.

**사용 가능:**

* **실시간 전송 모니터링**: 주요 이메일 제공업체의 성과 지표를 공개적으로 확인할 수 있습니다.
* **자동 알림**: 전송 시간이 10초를 초과하면 엔지니어링 팀에 알림이 전송됩니다.
* **투명한 모니터링**: 100% 오픈소스 모니터링 시스템
* **인프라 모니터링**: 자동 이상 탐지 및 포괄적인 감사 로깅

**제한 사항:**

* 고객 중심 웹훅이나 API 기반 배달 상태 알림은 명시적으로 문서화되지 않습니다.

자세한 배달 상태 웹훅이나 사용자 정의 모니터링 통합이 필요한 기업 고객의 경우, **기업 라이선스** 계약을 통해 이러한 기능을 사용할 수 있습니다.

출처:

* <https://forwardemail.net> (실시간 모니터링 표시)
* <https://github.com/forwardemail/forwardemail.net> (모니터링 구현)

### 고가용성을 어떻게 보장하시나요? {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> 이메일 전달 기능은 여러 인프라 제공업체에 걸쳐 포괄적인 중복성을 구현합니다.

* **분산 인프라**: 여러 지역에 걸쳐 여러 공급업체(DigitalOcean, Vultr, DataPacket)
* **지리적 부하 분산**: 자동 장애 조치를 지원하는 Cloudflare 기반 지리적 부하 분산
* **자동 확장**: 수요에 따른 동적 리소스 조정
* **다계층 DDoS 보호**: DataPacket의 Shield 시스템 및 Cloudflare를 통해
* **서버 이중화**: 자동 장애 조치를 지원하는 지역별 여러 서버
* **데이터베이스 복제**: 여러 위치에서 실시간 데이터 동기화
* **모니터링 및 알림**: 자동 사고 대응을 통한 24시간 연중무휴 모니터링

**가동 시간 약속**: <https://forwardemail.net>에서 사용 가능한 투명한 모니터링을 통해 99.9% 이상의 서비스 가용성 제공

출처:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### 귀하는 국방권한법(NDAA) 제889조를 준수하고 있습니까? {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Forward Email은 인프라 파트너를 신중하게 선정하여 889항을 완벽하게 준수합니다.

네, Forward Email은 **889조를 준수합니다**. 국방수권법(NDAA) 889조는 정부 기관이 특정 기업(Huawei, ZTE, Hikvision, Dahua, Hytera)의 통신 및 영상 감시 장비를 사용하는 기관을 이용하거나 해당 기관과 계약을 체결하는 것을 금지합니다.

**Forward Email이 섹션 889 규정을 준수하는 방법:**

Forward Email은 두 가지 주요 인프라 공급업체에만 의존하는데, 둘 다 섹션 889 금지 장비를 사용하지 않습니다.

1. **Cloudflare**: 네트워크 서비스 및 이메일 보안 분야의 주요 파트너
2. **DataPacket**: 서버 인프라 분야의 주요 공급업체(Arista Networks 및 Cisco 장비만 사용)
3. **백업 공급업체**: Digital Ocean 및 Vultr 백업 공급업체는 889항을 준수하는 것으로 서면으로 확인되었습니다.

**Cloudflare의 약속**: Cloudflare는 제3자 행동 강령에서 섹션 889에 따라 금지된 모든 기관의 통신 장비, 비디오 감시 제품 또는 서비스를 사용하지 않는다고 명시적으로 밝혔습니다.

**정부 사용 사례**: **미국 해군사관학교**에서 보안 이메일 전달 요구 사항에 대해 Forward Email을 선택하여 연방 규정 준수 표준에 대한 문서화를 요구했을 때 당사의 섹션 889 준수 사항이 검증되었습니다.

보다 광범위한 연방 규정을 포함한 정부 규정 준수 프레임워크에 대한 자세한 내용은 포괄적인 사례 연구인 [연방 정부 이메일 서비스 섹션 889 준수](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)을 읽어보세요.

## 시스템 및 기술 세부 정보 {#system-and-technical-details}

### 이메일과 그 내용을 저장하시나요? {#do-you-store-emails-and-their-contents}

아니요, [오류의 예외](#do-you-store-error-logs) 및 [아웃바운드 SMTP](#do-you-support-sending-email-with-smtp)을 사용하여 디스크에 쓰거나 로그를 저장하지 않습니다([개인정보 보호정책](/privacy) 참조).

모든 작업은 메모리와 [우리의 소스 코드는 GitHub에 있습니다](https://github.com/forwardemail)에서 수행됩니다.

### 이메일 전달 시스템은 어떻게 작동합니까? {#how-does-your-email-forwarding-system-work}

이메일은 [SMTP 프로토콜](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol) 프로토콜을 사용합니다. 이 프로토콜은 서버(대부분 25번 포트에서 실행)로 전송되는 명령으로 구성됩니다. 초기 연결이 이루어지면 발신자는 메일 발신자("MAIL FROM")를 지정하고, 다음으로 메일 수신지("RCPT TO")를 지정하며, 마지막으로 이메일 헤더와 본문("DATA")을 지정합니다. 아래는 각 SMTP 프로토콜 명령에 대한 이메일 전달 시스템의 흐름입니다.

* 초기 연결(명령 이름 없음, 예: `telnet example.com 25`) - 초기 연결입니다. [허용 목록](#do-you-have-an-allowlist)에 없는 발신자를 [거부 목록](#do-you-have-a-denylist)와 비교하여 확인합니다. 마지막으로, 발신자가 허용 목록에 없는 경우 [그레이리스트](#do-you-have-a-greylist)에 있는지 확인합니다.

* `HELO` - 발신자의 FQDN, IP 주소 또는 메일 처리기 이름을 식별하는 인사말입니다. 이 값은 위조될 수 있으므로 이 데이터에 의존하지 않고 연결 IP 주소의 역방향 호스트 이름 조회를 사용합니다.

* `MAIL FROM` - 이메일의 봉투 발신자 주소를 나타냅니다. 값을 입력하는 경우 유효한 RFC 5322 이메일 주소여야 합니다. 빈칸에 값을 입력해도 됩니다. 여기서는 [후방 산란을 확인하다](#how-do-you-protect-against-backscatter)을 사용하고, MAIL FROM을 [거부 목록](#do-you-have-a-denylist)와 비교합니다. 마지막으로, 허용 목록에 없는 발신자를 확인하여 속도 제한을 적용합니다(자세한 내용은 [속도 제한](#do-you-have-rate-limiting) 및 [허용 목록](#do-you-have-an-allowlist) 섹션 참조).

* `RCPT TO` - 이메일 수신자를 나타냅니다. 유효한 RFC 5322 이메일 주소여야 합니다. 메시지당 최대 50명의 수신자를 허용합니다(이는 이메일의 "받는 사람" 헤더와는 다릅니다). 또한 SRS 도메인 이름을 이용한 스푸핑을 방지하기 위해 유효한 [발신자 재작성 계획](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme)("SRS") 주소도 확인합니다.

* `DATA` - 이메일을 처리하는 서비스의 핵심 부분입니다. 자세한 내용은 아래 [이메일을 전달하기 위해 어떻게 처리합니까?](#how-do-you-process-an-email-for-forwarding) 섹션을 참조하세요.

### 이메일을 어떻게 처리하나요? {#how-do-you-process-an-email-for-forwarding}

이 섹션에서는 위의 [이메일 전달 시스템은 어떻게 작동합니까?](#how-does-your-email-forwarding-system-work) 섹션에 있는 SMTP 프로토콜 명령 `DATA`과 관련된 프로세스를 설명합니다. 이 프로세스를 통해 이메일의 헤더, 본문, 보안을 처리하고, 전달해야 하는 위치를 결정하고, 연결을 처리하는 방법이 설명됩니다.

1. 메시지가 최대 크기인 50MB를 초과하면 552 오류 코드와 함께 거부됩니다.

2. 메시지에 "보낸 사람" 헤더가 없거나 "보낸 사람" 헤더의 값 중 유효한 RFC 5322 이메일 주소가 아닌 경우 550 오류 코드와 함께 해당 메시지는 거부됩니다.

3. 메시지에 "수신됨" 헤더가 25개 이상 있는 경우, 리디렉트 루프에 갇힌 것으로 판단되어 550 오류 코드와 함께 거부됩니다.

4. 이메일의 지문을 사용하여([지문](#how-do-you-determine-an-email-fingerprint) 섹션 참조) 메시지가 5일 이상 재시도되었는지 확인합니다([기본 접미사 동작](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)과 일치). 그렇다면 550 오류 코드와 함께 거부합니다.

5. [스팸 스캐너](https://spamscanner.net)을 사용하여 이메일 스캔 결과를 메모리에 저장합니다.

6. 스팸 스캐너에서 임의의 결과가 나온 경우 554 오류 코드와 함께 거부됩니다. 이 글 작성 시점에는 임의 결과에 GTUBE 테스트 결과만 포함됩니다. 자세한 내용은 <https://spamassassin.apache.org/gtube/>>을 참조하세요.

7. 디버깅 및 남용 방지 목적으로 다음 헤더를 메시지에 추가합니다.

* `Received` - 원본 IP 및 호스트, 전송 유형, TLS 연결 정보, 날짜/시간 및 수신자가 포함된 표준 수신 헤더를 추가합니다.
* `X-Original-To` - 메시지의 원래 수신자:
* 이는 "수신" 헤더 외에도 이메일이 원래 어디로 전달되었는지 확인하는 데 유용합니다.
* 이는 IMAP 및/또는 마스크 전달 시 개인 정보 보호를 위해 수신자별로 추가됩니다.
* `X-Forward-Email-Website` - <https://forwardemail.net>> 웹사이트 링크 포함
* `X-Forward-Email-Version` - 코드베이스의 `package.json`에서 가져온 현재 [SemVer](https://semver.org/) 버전입니다.
* `X-Forward-Email-Session-ID` - 디버깅 목적으로 사용되는 세션 ID 값입니다(비프로덕션 환경에서만 적용).
* `X-Forward-Email-Sender` - 원본 봉투 MAIL FROM 주소(공백이 아닌 경우), 역방향 PTR 클라이언트 FQDN(있는 경우), 그리고 발신자 IP 주소를 포함하는 쉼표로 구분된 목록입니다.
* `X-Forward-Email-ID` - 아웃바운드 SMTP에만 적용되며 내 계정 → 이메일에 저장된 이메일 ID와 연관됩니다.
* `X-Original-To`0 - 값은 `X-Original-To`1입니다.
* `X-Original-To`2 - 값은 `X-Original-To`3입니다.
* `X-Original-To`4 - 값은 `X-Original-To`5입니다.

8. 그런 다음 [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain), [DMARC](https://en.wikipedia.org/wiki/DMARC)에 대한 메시지를 확인합니다.

* 메시지가 DMARC에 실패하고 도메인에 거부 정책(예: `p=reject` [DMARC 정책에 있었습니다](https://wikipedia.org/wiki/DMARC))이 있는 경우, 550 오류 코드와 함께 거부됩니다. 일반적으로 도메인의 DMARC 정책은 `_dmarc` 하위 도메인의 <strong class="notranslate">TXT</strong> 레코드(예: `dig _dmarc.example.com txt`)에서 찾을 수 있습니다.
* 메시지가 SPF에 실패하고 도메인에 강제 실패 정책(예: `-all`가 SPF 정책에 포함되어 있고 `~all`가 포함되어 있거나 정책이 없는 경우)이 있는 경우, 550 오류 코드와 함께 거부됩니다. 일반적으로 도메인의 SPF 정책은 루트 도메인의 <strong class="notranslate">TXT</strong> 레코드(예: `dig example.com txt`)에서 찾을 수 있습니다. SPF에 관한 [Gmail처럼 메일 보내기](#can-i-send-mail-as-in-gmail-with-this)에 대한 자세한 내용은 이 섹션을 참조하세요.

9. 이제 위의 [이메일 전달 시스템은 어떻게 작동합니까?](#how-does-your-email-forwarding-system-work) 섹션에 있는 `RCPT TO` 명령에서 수집된 메시지 수신자를 처리합니다. 각 수신자에 대해 다음 작업을 수행합니다.

* 도메인 이름의 <strong class="notranslate">TXT</strong> 레코드(`@` 기호 뒤 부분, 예: 이메일 주소가 `test@example.com`인 경우 `example.com`)를 조회합니다. 예를 들어, 도메인이 `example.com`인 경우 `dig example.com txt`와 같은 DNS 조회를 수행합니다.
* `forward-email=`(무료 플랜) 또는 `forward-email-site-verification=`(유료 플랜)으로 시작하는 모든 <strong class="notranslate">TXT</strong> 레코드를 구문 분석합니다. 사용자가 플랜을 업그레이드하거나 다운그레이드하는 동안 이메일을 처리하기 위해 두 레코드를 모두 구문 분석합니다.
* 파싱된 <strong class="notranslate">TXT</strong> 레코드에서 전달 구성을 추출하기 위해 반복 작업을 수행합니다(위의 [이메일 전달을 시작하고 설정하려면 어떻게 해야 하나요?](#how-do-i-get-started-and-set-up-email-forwarding) 섹션에서 설명한 대로). `forward-email-site-verification=` 값은 하나만 지원하며, 두 개 이상 입력하면 550 오류가 발생하고 발신자는 해당 수신자에 대한 반송 메일을 받게 됩니다.
* 추출된 전달 구성을 재귀적으로 반복하여 전역 전달, 정규식 기반 전달, 그리고 이제 "전달 주소"라고 하는 기타 모든 지원되는 전달 구성을 확인합니다.
* 각 전달 주소에 대해 하나의 재귀 조회를 지원합니다(지정된 주소에서 이러한 일련의 작업을 다시 시작합니다). 재귀적으로 일치하는 항목이 발견되면 전달 주소에서 상위 결과가 제거되고 하위 결과가 추가됩니다.
* 전달 주소는 고유성을 위해 구문 분석됩니다(하나의 주소로 중복된 이메일을 보내거나 불필요한 SMTP 클라이언트 연결을 추가로 생성하지 않도록 하기 위함).
* 각 전달 주소에 대해 API 엔드포인트 `/v1/max-forwarded-addresses`에서 도메인 이름을 조회합니다(도메인이 별칭별로 이메일을 전달할 수 있는 주소 수를 확인하기 위함, 예: 기본적으로 10개 - `example.com`0 섹션 참조). 이 제한을 초과하면 550 오류가 발생하고 발신자는 해당 수신자에 대한 반송 메일을 받게 됩니다.
* 유료 사용자에 대한 조회를 지원하는 API 엔드포인트 `example.com`1에서 원래 수신자의 설정을 조회합니다(무료 사용자에 대한 대체 기능 포함). 이 함수는 `example.com`2(숫자, 예: `example.com`3), `example.com`4(부울), `example.com`5(부울), `example.com`6(부울), `example.com`7(부울)에 대한 고급 설정 구성 객체를 반환합니다.
* 이러한 설정을 기반으로 스팸 스캐너 결과를 확인하고, 오류가 발생하면 554 오류 코드와 함께 메시지를 거부합니다(예: `example.com`8이 활성화된 경우 스팸 스캐너 결과에서 바이러스를 확인합니다). 모든 무료 플랜 사용자는 성인 콘텐츠, 피싱, 실행 파일 및 바이러스 검사에 참여하게 됩니다. 기본적으로 모든 유료 플랜 사용자도 참여하게 되지만, 이 구성은 전달 이메일 대시보드의 도메인 설정 페이지에서 변경할 수 있습니다.

10. 처리된 각 수신자의 전달 주소에 대해 다음 작업을 수행합니다.

* 주소는 [거부 목록](#do-you-have-a-denylist)과 비교하여 확인되며, 목록에 있는 경우 421 오류 코드가 발생합니다(발신자에게 나중에 다시 시도하도록 알림).
* 주소가 웹훅인 경우, 향후 작업을 위해 부울 값을 설정합니다(아래 참조 - 유사한 웹훅을 그룹화하여 하나의 POST 요청을 전송하는 대신 여러 개의 POST 요청을 전송합니다).
* 주소가 이메일 주소인 경우, 향후 작업을 위해 호스트를 파싱합니다(아래 참조 - 유사한 호스트를 그룹화하여 하나의 연결을 전송하는 대신 여러 개의 개별 연결을 전송합니다).

11. 수신자가 없고 반송 메일도 없는 경우 "잘못된 수신자"라는 550 오류로 응답합니다.

12. 수신자가 있는 경우, 동일한 호스트로 그룹화된 수신자를 대상으로 반복 작업을 수행하여 이메일을 전달합니다. 자세한 내용은 아래 [이메일 배달 문제를 어떻게 처리하시나요?](#how-do-you-handle-email-delivery-issues) 섹션을 참조하세요.

* 이메일 전송 중 오류가 발생하면 나중에 처리할 수 있도록 메모리에 저장합니다.
* 이메일 전송 시 가장 낮은 오류 코드(있는 경우)를 가져와 `DATA` 명령에 대한 응답 코드로 사용합니다. 즉, 전송되지 않은 이메일은 일반적으로 원래 발신자가 재전송을 시도하지만, 이미 전송된 이메일은 다음에 메시지를 전송할 때 재전송되지 않습니다([지문](#how-do-you-determine-an-email-fingerprint)을 사용함).
* 오류가 발생하지 않으면 250 성공 SMTP 응답 상태 코드를 전송합니다.
* 반송은 상태 코드가 500 이상(영구 실패)인 모든 전송 시도를 의미합니다.

13. 반송이 발생하지 않은 경우(영구적 실패), 비영구적 실패의 가장 낮은 오류 코드인 SMTP 응답 상태 코드를 반환합니다(반송이 발생하지 않은 경우 250 성공 상태 코드).

14. 반송 메일이 발생한 경우, 모든 오류 코드 중 가장 낮은 오류 코드를 발신자에게 반환한 후 백그라운드에서 반송 이메일을 발송합니다. 하지만 가장 낮은 오류 코드가 500 이상인 경우에는 반송 이메일을 발송하지 않습니다. 반송 메일을 발송할 경우 발신자는 이중 반송 메일(예: Gmail과 같은 발신 MTA에서 보낸 이메일과 저희에서 보낸 이메일)을 받게 되기 때문입니다. 자세한 내용은 아래 [백스캐터로부터 어떻게 보호합니까?](#how-do-you-protect-against-backscatter) 섹션을 참조하세요.

### 이메일 전송 문제를 어떻게 처리하시나요? {#how-do-you-handle-email-delivery-issues}

발신자의 DMARC 정책이 통과되지 않고 "보낸 사람" 헤더와 DKIM 서명이 일치하지 않는 경우에만 이메일에 "Friendly-From" 재작성을 수행합니다. 즉, 메시지의 "보낸 사람" 헤더를 변경하고, "X-Original-From"을 설정하고, "Reply-To"가 아직 설정되지 않은 경우 설정합니다. 또한 이러한 헤더를 변경한 후 메시지의 ARC 봉인을 다시 봉인합니다.

또한 스택의 모든 레벨에서 오류 메시지의 스마트 파싱을 사용합니다. 코드, DNS 요청, Node.js 내부, HTTP 요청(예: 수신자가 웹훅인 경우 408, 413, 429는 SMTP 응답 코드 421에 매핑됨) 및 메일 서버 응답(예: "지연" 또는 "속도 저하"가 포함된 응답은 421 오류로 재시도됨)에서 사용됩니다.

저희 로직은 더미 검증(dummy-proof)을 지원하며, SSL/TLS 오류, 연결 문제 등이 발생할 경우 재시도합니다. 더미 검증의 목표는 전달 구성 시 모든 수신자에게 전달 가능성을 극대화하는 것입니다.

수신자가 웹훅인 경우, 요청이 완료될 때까지 60초의 시간 초과를 허용하며, 최대 3번의 재시도(즉, 실패하기 전까지 총 4번의 요청)가 허용됩니다. 오류 코드 408, 413, 429를 올바르게 구문 분석하여 SMTP 응답 코드 421에 매핑합니다.

수신자가 이메일 주소인 경우, 기회주의적 TLS를 사용하여 이메일을 전송하려고 시도합니다(수신자 메일 서버에서 STARTTLS를 사용할 수 있는 경우 사용하려고 시도합니다). 이메일 전송 중 SSL/TLS 오류가 발생하는 경우, STARTTLS를 사용하지 않고 TLS 없이 이메일을 전송하려고 시도합니다.

DNS 또는 연결 오류가 발생하면 `DATA` 명령에 SMTP 응답 코드 421을 반환합니다. 그렇지 않고 500개 이상의 오류가 있는 경우 반송이 전송됩니다.

전달하려는 이메일 서버에서 하나 이상의 메일 교환 IP 주소가 차단된 것을 감지하면(예: 스팸 발송자를 지연하는 데 사용하는 기술) 보낸 사람이 나중에 메시지를 다시 시도할 수 있도록 SMTP 응답 코드 421을 보냅니다(그러면 문제가 알림으로 전달되어 다음 시도 전에 문제를 해결할 수 있습니다).

### IP 주소가 차단되면 어떻게 처리하시나요? {#how-do-you-handle-your-ip-addresses-becoming-blocked}

저희는 정기적으로 모든 주요 DNS 거부 목록을 모니터링하고, 저희의 메일 교환("MX") IP 주소가 주요 거부 목록에 있는 경우, 문제가 해결될 때까지 가능하다면 해당 DNS A 레코드 라운드 로빈에서 해당 주소를 제거합니다.

이 글을 쓰는 시점을 기준으로 저희는 여러 DNS 허용 목록에 등록되어 있으며, 모니터링 거부 목록에도 매우 중요하게 생각합니다. 저희가 해결하기 전에 문제가 발견되면 <support@forwardemail.net>으로 서면으로 알려주시기 바랍니다.

당사의 IP 주소는 공개적으로 사용 가능합니다([더 자세한 내용은 아래 섹션을 참조하세요.](#what-are-your-servers-ip-addresses)).

### 포스트마스터 주소는 무엇입니까? {#what-are-postmaster-addresses}

잘못된 반송을 방지하고 모니터링되지 않거나 존재하지 않는 사서함으로 휴가 응답 메시지를 보내는 것을 방지하기 위해 메일러 데몬과 같은 사용자 이름 목록을 유지 관리합니다.

* `automailer`
* `autoresponder`
* `bounce`
* `bounce-notification`
* `bounce-notifications`
* `bounces`
* `hostmaster`
* `listserv`
* `localhost`
* `mail-daemon`
* `mail.daemon`
* `maildaemon`
* `mailer-daemon`
* `mailer.daemon`
* `mailerdaemon`
* `majordomo`
* `postmaster`
* [그리고 회신이 불가능한 주소](#what-are-no-reply-addresses)

이러한 목록을 사용하여 효율적인 이메일 시스템을 만드는 방법에 대한 자세한 내용은 [RFC 5320 섹션 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6)을 참조하세요.

### 회신 불가 주소는 무엇입니까? {#what-are-no-reply-addresses}

다음 중 하나와 동일한 이메일 사용자 이름은 (대소문자 구분 없이) 회신 불가 주소로 간주됩니다.

* `do-not-reply`
* `do-not-respond`
* `do.not.reply`
* `donotreply`
* `donotrespond`
* `dont-reply`
* `naoresponda`
* `no-replies`
* `no-reply`
* `no-replys`
* `no.replies`
* `no.reply`
* `no.replys`
* `no_reply`
* `nobody`
* `noreplies`
* `noreply`
* `noreplys`

이 목록은 [GitHub의 오픈 소스 프로젝트로서](https://github.com/forwardemail/reserved-email-addresses-list)에서 관리됩니다.

### 서버의 IP 주소는 무엇입니까? {#what-are-your-servers-ip-addresses}

저희는 IP 주소를 <https://forwardemail.net/ips>.>에 게시합니다.

### 허용 목록이 있습니까? {#do-you-have-an-allowlist}

네, 기본적으로 허용 목록에 포함된 [도메인 이름 확장자 목록](#what-domain-name-extensions-are-allowlisted-by-default)이 있고, [엄격한 기준](#what-is-your-allowlist-criteria)을 기반으로 하는 동적, 캐시 및 롤링 허용 목록이 있습니다.

유료 플랜을 사용하는 고객의 모든 이메일, 도메인 및 수신자는 자동으로 허용 목록에 추가됩니다.

### 기본적으로 허용 목록에 추가되는 도메인 이름 확장자는 무엇입니까? {#what-domain-name-extensions-are-allowlisted-by-default}

다음 도메인 이름 확장자는 기본적으로 허용 목록에 포함된 것으로 간주됩니다(엄브렐라 인기 목록에 있는지 여부와 관계없음):

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">edu</code></li>
<li class="list-inline-item"><code class="notranslate">gov</code></li>
<li class="list-inline-item"><code class="notranslate">mil</code></li>
<li class="list-inline-item"><code class="notranslate">int</code></li>
<li class="list-inline-item"><code class="notranslate">arpa</code></li>
<li class="list-inline-item"><code class="notranslate">dni.us</code></li>
<li class="list-inline-item"><code class="notranslate">fed.us</code></li>
<li class="list-inline-item"><code class="notranslate">isa.us</code></li>
<li class="list-inline-item"><code class="notranslate">kids.us</code></li>
<li class="list-inline-item"><code class="notranslate">nsn.us</code></li>
<li class="list-inline-item"><code class="notranslate">ak.us</code></li>
<li class="list-inline-item"><code class="notranslate">al.us</code></li>
<li class="list-inline-item"><code class="notranslate">ar.us</code></li>
<li class="list-inline-item"><code class="notranslate">as.us</code></li>
<li class="list-inline-item"><code class="notranslate">az.us</code></li>
<li class="list-inline-item"><code class="notranslate">ca.us</code></li>
<li class="list-inline-item"><code class="notranslate">co.us</code></li>
<li class="list-inline-item"><code class="notranslate">ct.us</code></li>
<li class="list-inline-item"><code class="notranslate">dc.us</code></li>
<li class="list-inline-item"><code class="notranslate">de.us</code></li>
<li class="list-inline-item"><code class="notranslate">fl.us</code></li>
<li class="list-inline-item"><code class="notranslate">ga.us</code></li>
<li class="list-inline-item"><code class="notranslate">gu.us</code></li>
<li class="list-inline-item"><code class="notranslate">hi.us</code></li>
<li class="list-inline-item"><code class="notranslate">ia.us</code></li>
<li class="list-inline-item"><code class="notranslate">id.us</code></li>
<li class="list-inline-item"><code class="notranslate">il.us</code></li>
<li class="list-inline-item"><code class="notranslate">in.us</code></li>
<li class="list-inline-item"><code class="notranslate">ks.us</code></li>
<li class="list-inline-item"><code class="notranslate">ky.us</code></li>
<li class="list-inline-item"><code class="notranslate">la.us</code></li>
<li class="list-inline-item"><code class="notranslate">ma.us</code></li>
<li class="list-inline-item"><code class="notranslate">md.us</code></li>
<li class="list-inline-item"><code class="notranslate">me.us</code></li>
<li class="list-inline-item"><code class="notranslate">mi.us</code></li>
<li class="list-inline-item"><code class="notranslate">mn.us</code></li>
<li class="list-inline-item"><code class="notranslate">mo.us</code></li>
<li class="list-inline-item"><code class="notranslate">ms.us</code></li>
<li class="list-inline-item"><code class="notranslate">mt.us</code></li>
<li class="list-inline-item"><code class="notranslate">nc.us</code></li>
<li class="list-inline-item"><code class="notranslate">nd.us</code></li>
<li class="list-inline-item"><code class="notranslate">ne.us</code></li>
<li class="list-inline-item"><code class="notranslate">nh.us</code></li>
<li class="list-inline-item"><code class="notranslate">nj.us</code></li>
<li class="list-inline-item"><code class="notranslate">nm.us</code></li>
<li class="list-inline-item"><code class="notranslate">nv.us</code></li>
<li class="list-inline-item"><code class="notranslate">ny.us</code></li>
<li class="list-inline-item"><code class="notranslate">oh.us</code></li>
<li class="list-inline-item"><code class="notranslate">ok.us</code></li>
<li class="list-inline-item"><code class="notranslate">or.us</code></li>
<li class="list-inline-item"><code class="notranslate">pa.us</code></li>
<li class="list-inline-item"><code class="notranslate">pr.us</code></li>
<li class="list-inline-item"><code class="notranslate">ri.us</code></li>
<li class="list-inline-item"><code class="notranslate">sc.us</code></li>
<li class="list-inline-item"><code class="notranslate">sd.us</code></li>
<li class="list-inline-item"><code class="notranslate">tn.us</code></li>
<li class="list-inline-item"><code class="notranslate">텍사스주.미국</code></li>
<li class="list-inline-item"><code class="notranslate">유타주.미국</code></li>
<li class="list-inline-item"><code class="notranslate">버지니아주.미국</code></li>
<li class="list-inline-item"><code class="notranslate">비엔나주.미국</code></li>
<li class="list-inline-item"><code class="notranslate">버몬트주.미국</code></li>
<li class="list-inline-item"><code class="notranslate">버몬트주.미국</code></li>
<li class="list-inline-item"><code class="notranslate">와이오밍주.미국</code></li>
<li class="list-inline-item"><code class="notranslate">와이오밍주.미국</code></li>
<li class="list-inline-item"><code class="notranslate">위스콘신주.미국</code></li>
<li class="list-inline-item"><code class="notranslate">웨일스주.미국</code></li>
<li class="list-inline-item"><code class="notranslate">wy.us</code></li>
<li class="list-inline-item"><code class="notranslate">mil.tt</code></li>
<li class="list-inline-item"><code class="notranslate">edu.tt</code></li>
<li class="list-inline-item"><code class="notranslate">edu.tr</code></li>
<li class="list-inline-item"><code class="notranslate">edu.ua</code></li>
<li class="list-inline-item"><code class="notranslate">edu.au</code></li>
<li class="list-inline-item"><code class="notranslate">ac.at</code></li>
<li class="list-inline-item"><code class="notranslate">edu.br</code></li>
<li class="list-inline-item"><code class="notranslate">ac.nz</code></li>
<li class="list-inline-item"><code class="notranslate">school.nz</code></li>
<li class="list-inline-item"><code class="notranslate">cri.nz</code></li>
<li class="list-inline-item"><code class="notranslate">health.nz</code></li>
<li class="list-inline-item"><code class="notranslate">mil.nz</code></li>
<li class="list-inline-item"><code class="notranslate">parliament.nz</code></li>
<li class="list-inline-item"><code class="notranslate">ac.in</code></li>
<li class="list-inline-item"><code class="notranslate">edu.in</code></li>
<li class="list-inline-item"><code class="notranslate">mil.in</code></li>
<li class="list-inline-item"><code class="notranslate">ac.jp</code></li>
<li class="list-inline-item"><code class="notranslate">ed.jp</code></li>
<li class="list-inline-item"><code class="notranslate">lg.jp</code></li>
<li class="list-inline-item"><code class="notranslate">ac.za</code></li>
<li class="list-inline-item"><code class="notranslate">edu.za</code></li>
<li class="list-inline-item"><code class="notranslate">mil.za</code></li>
<li class="list-inline-item"><code class="notranslate">school.za</code></li>
<li class="list-inline-item"><code class="notranslate">mil.kr</code></li>
<li class="list-inline-item"><code class="notranslate">ac.kr</code></li>
<li class="list-inline-item"><code class="notranslate">hs.kr</code></li>
<li class="list-inline-item"><code class="notranslate">ms.kr</code></li>
<li class="list-inline-item"><code class="notranslate">es.kr</code></li>
<li class="list-inline-item"><code class="notranslate">sc.kr</code></li>
<li class="list-inline-item"><code class="notranslate">kg.kr</code></li>
<li class="list-inline-item"><code class="notranslate">edu.es</code></li>
<li class="list-inline-item"><code class="notranslate">ac.lk</code></li>
<li class="list-inline-item"><code class="notranslate">sch.lk</code></li>
<li class="list-inline-item"><code class="notranslate">edu.lk</code></li>
<li class="list-inline-item"><code class="notranslate">ac.th</code></li>
<li class="list-inline-item"><code class="notranslate">mi.th</code></li>
<li class="list-inline-item"><code class="notranslate">admin.ch</code></li>
<li class="list-inline-item"><code class="notranslate">canada.ca</code></li>
<li class="list-inline-item"><code class="notranslate">gc.ca</code></li>
<li class="list-inline-item"><code class="notranslate">go.id</code></li>
<li class="list-inline-item"><code class="notranslate">go.jp</code></li>
<li class="list-inline-item"><code class="notranslate">go.ke</code></li>
<li class="list-inline-item"><code class="notranslate">go.kr</code></li>
<li class="list-inline-item"><code class="notranslate">go.th</code></li>
<li class="list-inline-item"><code class="notranslate">gob.ar</code></li>
<li class="list-inline-item"><code class="notranslate">gob.cl</code></li>
<li class="list-inline-item"><code class="notranslate">gob.es</code></li>
<li class="list-inline-item"><code class="notranslate">gob.mx</code></li>
<!--<li class="list-inline-item"><code class="notranslate">gob.pe</code></li>-->
<li class="list-inline-item"><code class="notranslate">gob.ve</code></li>
<li class="list-inline-item"><code class="notranslate">gob.sv</code></li>
<li class="list-inline-item"><code class="notranslate">gouv.fr</code></li>
<li class="list-inline-item"><code class="notranslate">gouv.nc</code></li>
<li class="list-inline-item"><code class="notranslate">gouv.qc.ca</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ad</code></li>
<li class="list-inline-item"><code class="notranslate">gov.af</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ai</code></li>
<li class="list-inline-item"><code class="notranslate">gov.al</code></li>
<li class="list-inline-item"><code class="notranslate">gov.am</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ao</code></li>
<li class="list-inline-item"><code class="notranslate">gov.au</code></li>
<li class="list-inline-item"><code class="notranslate">gov.aw</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ax</code></li>
<li class="list-inline-item"><code class="notranslate">gov.az</code></li>
<li class="list-inline-item"><code class="notranslate">gov.bd</code></li>
<li class="list-inline-item"><code class="notranslate">gov.be</code></li>
<li class="list-inline-item"><code class="notranslate">gov.bg</code></li>
<li class="list-inline-item"><code class="notranslate">gov.bm</code></li>
<!--<li class="list-inline-item"><code class="notranslate">gov.br</code></li>-->
<li class="list-inline-item"><code class="notranslate">gov.by</code></li>
<li class="list-inline-item"><code class="notranslate">gov.cl</code></li>
<li class="list-inline-item"><code class="notranslate">gov.cn</code></li>
<li class="list-inline-item"><code class="notranslate">gov.co</code></li>
<li class="list-inline-item"><code class="notranslate">gov.cy</code></li>
<li class="list-inline-item"><code class="notranslate">gov.cz</code></li>
<li class="list-inline-item"><code class="notranslate">gov.dz</code></li>
<li class="list-inline-item"><code class="notranslate">gov.eg</code></li>
<li class="list-inline-item"><code class="notranslate">gov.fi</code></li>
<li class="list-inline-item"><code class="notranslate">gov.fk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.gg</code></li>
<li class="list-inline-item"><code class="notranslate">gov.gr</code></li>
<li class="list-inline-item"><code class="notranslate">gov.hk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.hr</code></li>
<li class="list-inline-item"><code class="notranslate">gov.hu</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ie</code></li>
<li class="list-inline-item"><code class="notranslate">gov.il</code></li>
<li class="list-inline-item"><code class="notranslate">gov.im</code></li>
<li class="list-inline-item"><code class="notranslate">gov.in</code></li>
<li class="list-inline-item"><code class="notranslate">gov.iq</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ir</code></li>
<li class="list-inline-item"><code class="notranslate">gov.it</code></li>
<li class="list-inline-item"><code class="notranslate">gov.je</code></li>
<li class="list-inline-item"><code class="notranslate">gov.kp</code></li>
<li class="list-inline-item"><code class="notranslate">gov.krd</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ky</code></li>
<li class="list-inline-item"><code class="notranslate">gov.kz</code></li>
<li class="list-inline-item"><code class="notranslate">gov.lb</code></li>
<li class="list-inline-item"><code class="notranslate">gov.lk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.lt</code></li>
<li class="list-inline-item"><code class="notranslate">gov.lv</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ma</code></li>
<li class="list-inline-item"><code class="notranslate">gov.mm</code></li>
<li class="list-inline-item"><code class="notranslate">gov.mo</code></li>
<li class="list-inline-item"><code class="notranslate">gov.mt</code></li>
<li class="list-inline-item"><code class="notranslate">gov.my</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ng</code></li>
<li class="list-inline-item"><code class="notranslate">gov.np</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ph</code></li>
<li class="list-inline-item"><code class="notranslate">gov.pk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.pl</code></li>
<li class="list-inline-item"><code class="notranslate">gov.pt</code></li>
<li class="list-inline-item"><code class="notranslate">gov.py</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ro</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ru</code></li>
<li class="list-inline-item"><code class="notranslate">gov.scot</code></li>
<li class="list-inline-item"><code class="notranslate">gov.se</code></li>
<li class="list-inline-item"><code class="notranslate">gov.sg</code></li>
<li class="list-inline-item"><code class="notranslate">gov.si</code></li>
<li class="list-inline-item"><code class="notranslate">gov.sk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.tr</code></li>
<li class="list-inline-item"><code class="notranslate">gov.tt</code></li>
<li class="list-inline-item"><code class="notranslate">gov.tw</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ua</code></li>
<li class="list-inline-item"><code class="notranslate">gov.uk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.vn</code></li>
<li class="list-inline-item"><code class="notranslate">gov.wales</code></li>
<li class="list-inline-item"><code class="notranslate">gov.za</code></li>
<li class="list-inline-item"><code class="notranslate">government.pn</code></li>
<li class="list-inline-item"><code class="notranslate">govt.nz</code></li>
<!--<li class="list-inline-item"><code class="notranslate">gub.uy</code></li>-->
<li class="list-inline-item"><code class="notranslate">gv.at</code></li>
<li class="list-inline-item"><code class="notranslate">ac.uk</code></li>
<li class="list-inline-item"><code class="notranslate">bl.uk</code></li>
<li class="list-inline-item"><code class="notranslate">judiciary.uk</code></li>
<li class="list-inline-item"><code class="notranslate">mod.uk</code></li>
<li class="list-inline-item"><code class="notranslate">nhs.uk</code></li>
<li class="list-inline-item"><code class="notranslate">parliament.uk</code></li>
<li class="list-inline-item"><code class="notranslate">police.uk</code></li>
<li class="list-inline-item"><code class="notranslate">rct.uk</code></li>
<li class="list-inline-item"><code class="notranslate">royal.uk</code></li>
<li class="list-inline-item"><code class="notranslate">sch.uk</code></li>
<li class="list-inline-item"><code class="notranslate">ukaea.uk</code></li>
</ul>

또한 다음 [브랜드 및 기업 최상위 도메인](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains)은 기본적으로 허용 목록에 포함됩니다(예: Apple Card 은행 거래 내역서의 `applecard.apple`에 대한 `apple`):

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">aaa</code></li>
<li class="list-inline-item"><code class="notranslate">aarp</code></li>
<li class="list-inline-item"><code class="notranslate">아바르트</code></li>
<li class="list-inline-item"><code class="notranslate">abb</code></li>
<li class="list-inline-item"><code class="notranslate">abbott</code></li>
<li class="list-inline-item"><code class="notranslate">abbvie</code></li>
<li class="list-inline-item"><code class="notranslate">abc</code></li>
<li class="list-inline-item"><code class="notranslate">액센츄어</code></li>
<li class="list-inline-item"><code class="notranslate">아코</code></li>
<li class="list-inline-item"><code class="notranslate">에그</code></li>
<li class="list-inline-item"><code class="notranslate">에트나</code></li>
<li class="list-inline-item"><code class="notranslate">아플</code></li>
<li class="list-inline-item"><code class="notranslate">아가칸</code></li>
<li class="list-inline-item"><code class="notranslate">에이그</code></li>
<li class="list-inline-item"><code class="notranslate">아이고</code></li>
<li class="list-inline-item"><code class="notranslate">에어버스</code></li>
<li class="list-inline-item"><code class="notranslate">에어텔</code></li>
<li class="list-inline-item"><code class="notranslate">AKDN</code></li>
<li class="list-inline-item"><code class="notranslate">알파로메오</code></li>
<li class="list-inline-item"><code class="notranslate">알리바바</code></li>
<li class="list-inline-item"><code class="notranslate">알리페이</code></li>
<li class="list-inline-item"><code class="notranslate">올파이낸스</code></li>
<li class="list-inline-item"><code class="notranslate">올스테이트</code></li>
<li class="list-inline-item"><code class="notranslate">앨리</code></li>
<li class="list-inline-item"><code class="notranslate">아마존</code></li>
<li class="list-inline-item"><code class="notranslate">아메리칸익스프레스</code></li>
<li class="list-inline-item"><code class="notranslate">아멕스</code></li>
<li class="list-inline-item"><code class="notranslate">아미카</code></li>
<li class="list-inline-item"><code class="notranslate">안드로이드</code></li>
<li class="list-inline-item"><code class="notranslate">AOL</code></li>
<li class="list-inline-item"><code class="notranslate">애플</code></li>
<li class="list-inline-item"><code class="notranslate">수채화</code></li>
<li class="list-inline-item"><code class="notranslate">아람코</code></li>
<li class="list-inline-item"><code class="notranslate">아우디</code></li>
<li class="list-inline-item"><code class="notranslate">auspost</code></li>
<li class="list-inline-item"><code class="notranslate">AWS</code></li>
<li class="list-inline-item"><code class="notranslate">AXA</code></li>
<li class="list-inline-item"><code class="notranslate">애저</code></li>
<li class="list-inline-item"><code class="notranslate">바이두</code></li>
<li class="list-inline-item"><code class="notranslate">바나나리퍼블릭</code></li>
<li class="list-inline-item"><code class="notranslate">바클레이카드</code></li>
<li class="list-inline-item"><code class="notranslate">바클레이스</code></li>
<li class="list-inline-item"><code class="notranslate">농구</code></li>
<li class="list-inline-item"><code class="notranslate">바우하우스</code></li>
<li class="list-inline-item"><code class="notranslate">BBC</code></li>
<li class="list-inline-item"><code class="notranslate">BBT</code></li>
<li class="list-inline-item"><code class="notranslate">BBVA</code></li>
<li class="list-inline-item"><code class="notranslate">BCG</code></li>
<li class="list-inline-item"><code class="notranslate">벤틀리</code></li>
<li class="list-inline-item"><code class="notranslate">바르티</code></li>
<li class="list-inline-item"><code class="notranslate">빙</code></li>
<li class="list-inline-item"><code class="notranslate">블랑코</code></li>
<li class="list-inline-item"><code class="notranslate">블룸버그</code></li>
<li class="list-inline-item"><code class="notranslate">BMS</code></li>
<li class="list-inline-item"><code class="notranslate">BMW</code></li>
<li class="list-inline-item"><code class="notranslate">bnl</code></li>
<li class="list-inline-item"><code class="notranslate">bnpparibas</code></li>
<li class="list-inline-item"><code class="notranslate">베링거</code></li>
<li class="list-inline-item"><code class="notranslate">본드</code></li>
<li class="list-inline-item"><code class="notranslate">부킹</code></li>
<li class="list-inline-item"><code class="notranslate">보쉬</code></li>
<li class="list-inline-item"><code class="notranslate">보스틱</code></li>
<li class="list-inline-item"><code class="notranslate">브라데스코</code></li>
<li class="list-inline-item"><code class="notranslate">브리지스톤</code></li>
<li class="list-inline-item"><code class="notranslate">브라더</code></li>
<li class="list-inline-item"><code class="notranslate">부가티</code></li>
<li class="list-inline-item"><code class="notranslate">칼</code></li>
<li class="list-inline-item"><code class="notranslate">캘빈클라인</code></li>
<li class="list-inline-item"><code class="notranslate">캐논</code></li>
<li class="list-inline-item"><code class="notranslate">캐피탈론</code></li>
<li class="list-inline-item"><code class="notranslate">카라반</code></li>
<li class="list-inline-item"><code class="notranslate">까르띠에</code></li>
<li class="list-inline-item"><code class="notranslate">CBA</code></li>
<li class="list-inline-item"><code class="notranslate">CBN</code></li>
<li class="list-inline-item"><code class="notranslate">cbre</code></li>
<li class="list-inline-item"><code class="notranslate">cbs</code></li>
<li class="list-inline-item"><code class="notranslate">cern</code></li>
<li class="list-inline-item"><code class="notranslate">cfa</code></li>
<li class="list-inline-item"><code class="notranslate">채널</code></li>
<li class="list-inline-item"><code class="notranslate">체이스</code></li>
<li class="list-inline-item"><code class="notranslate">친타이</code></li>
<li class="list-inline-item"><code class="notranslate">크롬</code></li>
<li class="list-inline-item"><code class="notranslate">크라이슬러</code></li>
<li class="list-inline-item"><code class="notranslate">시프리아니</code></li>
<li class="list-inline-item"><code class="notranslate">시스코</code></li>
<li class="list-inline-item"><code class="notranslate">시타델</code></li>
<li class="list-inline-item"><code class="notranslate">시티</code></li>
<li class="list-inline-item"><code class="notranslate">시티</code></li>
<li class="list-inline-item"><code class="notranslate">클럽메드</code></li>
<li class="list-inline-item"><code class="notranslate">컴캐스트</code></li>
<li class="list-inline-item"><code class="notranslate">컴뱅크</code></li>
<li class="list-inline-item"><code class="notranslate">신용조합</code></li>
<li class="list-inline-item"><code class="notranslate">크라운</code></li>
<li class="list-inline-item"><code class="notranslate">크레스</code></li>
<li class="list-inline-item"><code class="notranslate">csc</code></li>
<li class="list-inline-item"><code class="notranslate">퀴지넬라</code></li>
<li class="list-inline-item"><code class="notranslate">다부르</code></li>
<li class="list-inline-item"><code class="notranslate">닷선</code></li>
<li class="list-inline-item"><code class="notranslate">딜러</code></li>
<li class="list-inline-item"><code class="notranslate">델</code></li>
<li class="list-inline-item"><code class="notranslate">딜로이트</code></li>
<li class="list-inline-item"><code class="notranslate">델타</code></li>
<li class="list-inline-item"><code class="notranslate">DHL</code></li>
<li class="list-inline-item"><code class="notranslate">디스커버</code></li>
<li class="list-inline-item"><code class="notranslate">디시</code></li>
<li class="list-inline-item"><code class="notranslate">DNP</code></li>
<li class="list-inline-item"><code class="notranslate">닷지</code></li>
<li class="list-inline-item"><code class="notranslate">던롭</code></li>
<li class="list-inline-item"><code class="notranslate">듀퐁</code></li>
<li class="list-inline-item"><code class="notranslate">드바그</code></li>
<li class="list-inline-item"><code class="notranslate">에데카</code></li>
<li class="list-inline-item"><code class="notranslate">에머크</code></li>
<li class="list-inline-item"><code class="notranslate">엡손</code></li>
<li class="list-inline-item"><code class="notranslate">에릭슨</code></li>
<li class="list-inline-item"><code class="notranslate">에릭슨</code></li>
<li class="list-inline-item"><code class="notranslate">에르니</code></li>
<li class="list-inline-item"><code class="notranslate">에슈런스</code></li>
<li class="list-inline-item"><code class="notranslate">etisalat</code></li>
<li class="list-inline-item"><code class="notranslate">유로비전</code></li>
<li class="list-inline-item"><code class="notranslate">에버뱅크</code></li>
<li class="list-inline-item"><code class="notranslate">엑스트라스페이스</code></li>
<li class="list-inline-item"><code class="notranslate">페이즈</code></li>
<li class="list-inline-item"><code class="notranslate">페어윈드</code></li>
<li class="list-inline-item"><code class="notranslate">파머스</code></li>
<li class="list-inline-item"><code class="notranslate">페덱스</code></li>
<li class="list-inline-item"><code class="notranslate">페라리</code></li>
<li class="list-inline-item"><code class="notranslate">페레로</code></li>
<li class="list-inline-item"><code class="notranslate">피아트</code></li>
<li class="list-inline-item"><code class="notranslate">피델리티</code></li>
<li class="list-inline-item"><code class="notranslate">파이어스톤</code></li>
<li class="list-inline-item"><code class="notranslate">펌데일</code></li>
<li class="list-inline-item"><code class="notranslate">플리커</code></li>
<li class="list-inline-item"><code class="notranslate">플리어</code></li>
<li class="list-inline-item"><code class="notranslate">플스미드</code></li>
<li class="list-inline-item"><code class="notranslate">포드</code></li>
<li class="list-inline-item"><code class="notranslate">폭스</code></li>
<li class="list-inline-item"><code class="notranslate">프레제니우스</code></li>
<li class="list-inline-item"><code class="notranslate">외환</code></li>
<li class="list-inline-item"><code class="notranslate">프로건스</code></li>
<li class="list-inline-item"><code class="notranslate">프론티어</code></li>
<li class="list-inline-item"><code class="notranslate">후지쯔</code></li>
<li class="list-inline-item"><code class="notranslate">후지제록스</code></li>
<li class="list-inline-item"><code class="notranslate">갈로</code></li>
<li class="list-inline-item"><code class="notranslate">갤럽</code></li>
<li class="list-inline-item"><code class="notranslate">갭</code></li>
<li class="list-inline-item"><code class="notranslate">GBiz</code></li>
<li class="list-inline-item"><code class="notranslate">GEA</code></li>
<li class="list-inline-item"><code class="notranslate">젠팅</code></li>
<li class="list-inline-item"><code class="notranslate">기빙</code></li>
<li class="list-inline-item"><code class="notranslate">글로보</code></li>
<li class="list-inline-item"><code class="notranslate">글로보</code></li>
<li class="list-inline-item"><code class="notranslate">Gmail</code></li>
<li class="list-inline-item"><code class="notranslate">GMO</code></li>
<li class="list-inline-item"><code class="notranslate">GMX</code></li>
<li class="list-inline-item"><code class="notranslate">GoDaddy</code></li>
<li class="list-inline-item"><code class="notranslate">골드포인트</code></li>
<li class="list-inline-item"><code class="notranslate">굿이어</code></li>
<li class="list-inline-item"><code class="notranslate">구글</code></li>
<li class="list-inline-item"><code class="notranslate">구글</code></li>
<li class="list-inline-item"><code class="notranslate">구글</code></li>
<li class="list-inline-item"><code class="notranslate">그레인저</code></li>
<li class="list-inline-item"><code class="notranslate">가디언</code></li>
<li class="list-inline-item"><code class="notranslate">구찌</code></li>
<li class="list-inline-item"><code class="notranslate">HBO</code></li>
<li class="list-inline-item"><code class="notranslate">HDFC</code></li>
<li class="list-inline-item"><code class="notranslate">HDFC뱅크</code></li>
<li class="list-inline-item"><code class="notranslate">에르메스</code></li>
<li class="list-inline-item"><code class="notranslate">히사미츠</code></li>
<li class="list-inline-item"><code class="notranslate">히타치</code></li>
<li class="list-inline-item"><code class="notranslate">hkt</code></li>
<li class="list-inline-item"><code class="notranslate">혼다</code></li>
<li class="list-inline-item"><code class="notranslate">하니웰</code></li>
<li class="list-inline-item"><code class="notranslate">핫메일</code></li>
<li class="list-inline-item"><code class="notranslate">HSBC</code></li>
<li class="list-inline-item"><code class="notranslate">휴즈</code></li>
<li class="list-inline-item"><code class="notranslate">하얏트</code></li>
<li class="list-inline-item"><code class="notranslate">현대</code></li>
<li class="list-inline-item"><code class="notranslate">IBM</code></li>
<li class="list-inline-item"><code class="notranslate">IEEE</code></li>
<li class="list-inline-item"><code class="notranslate">ifm</code></li>
<li class="list-inline-item"><code class="notranslate">이카노</code></li>
<li class="list-inline-item"><code class="notranslate">IMDB</code></li>
<li class="list-inline-item"><code class="notranslate">인피니티</code></li>
<li class="list-inline-item"><code class="notranslate">인텔</code></li>
<li class="list-inline-item"><code class="notranslate">인투이트</code></li>
<li class="list-inline-item"><code class="notranslate">이피랑가</code></li>
<li class="list-inline-item"><code class="notranslate">iselect</code></li>
<li class="list-inline-item"><code class="notranslate">이타우</code></li>
<li class="list-inline-item"><code class="notranslate">itv</code></li>
<li class="list-inline-item"><code class="notranslate">이베코</code></li>
<li class="list-inline-item"><code class="notranslate">재규어</code></li>
<li class="list-inline-item"><code class="notranslate">자바</code></li>
<li class="list-inline-item"><code class="notranslate">jcb</code></li>
<li class="list-inline-item"><code class="notranslate">jcp</code></li>
<li class="list-inline-item"><code class="notranslate">지프</code></li>
<li class="list-inline-item"><code class="notranslate">jpmorgan</code></li>
<li class="list-inline-item"><code class="notranslate">주니퍼</code></li>
<li class="list-inline-item"><code class="notranslate">kddi</code></li>
<li class="list-inline-item"><code class="notranslate">케리호텔</code></li>
<li class="list-inline-item"><code class="notranslate">케리로지스틱스</code></li>
<li class="list-inline-item"><code class="notranslate">케리프로퍼티스</code></li>
<li class="list-inline-item"><code class="notranslate">kfh</code></li>
<li class="list-inline-item"><code class="notranslate">기아</code></li>
<li class="list-inline-item"><code class="notranslate">킨더</code></li>
<li class="list-inline-item"><code class="notranslate">킨들</code></li>
<li class="list-inline-item"><code class="notranslate">코마츠</code></li>
<li class="list-inline-item"><code class="notranslate">KPMG</code></li>
<li class="list-inline-item"><code class="notranslate">크레드</code></li>
<li class="list-inline-item"><code class="notranslate">쿠옥그룹</code></li>
<li class="list-inline-item"><code class="notranslate">라카이사</code></li>
<li class="list-inline-item"><code class="notranslate">래드브룩스</code></li>
<li class="list-inline-item"><code class="notranslate">람보르기니</code></li>
<li class="list-inline-item"><code class="notranslate">랭커스터</code></li>
<li class="list-inline-item"><code class="notranslate">란시아</code></li>
<li class="list-inline-item"><code class="notranslate">랑콤</code></li>
<li class="list-inline-item"><code class="notranslate">랜드로버</code></li>
<li class="list-inline-item"><code class="notranslate">랑세스</code></li>
<li class="list-inline-item"><code class="notranslate">라살레</code></li>
<li class="list-inline-item"><code class="notranslate">라트로브</code></li>
<li class="list-inline-item"><code class="notranslate">LDS</code></li>
<li class="list-inline-item"><code class="notranslate">르클레르</code></li>
<li class="list-inline-item"><code class="notranslate">레고</code></li>
<li class="list-inline-item"><code class="notranslate">연락처</code></li>
<li class="list-inline-item"><code class="notranslate">렉서스</code></li>
<li class="list-inline-item"><code class="notranslate">리들</code></li>
<li class="list-inline-item"><code class="notranslate">라이프스타일</code></li>
<li class="list-inline-item"><code class="notranslate">릴리</code></li>
<li class="list-inline-item"><code class="notranslate">링컨</code></li>
<li class="list-inline-item"><code class="notranslate">린데</code></li>
<li class="list-inline-item"><code class="notranslate">립시</code></li>
<li class="list-inline-item"><code class="notranslate">릭실</code></li>
<li class="list-inline-item"><code class="notranslate">로커스</code></li>
<li class="list-inline-item"><code class="notranslate">롯데</code></li>
<li class="list-inline-item"><code class="notranslate">lpl</code></li>
<li class="list-inline-item"><code class="notranslate">lplfinancial</code></li>
<li class="list-inline-item"><code class="notranslate">룬드벡</code></li>
<li class="list-inline-item"><code class="notranslate">루팡</code></li>
<li class="list-inline-item"><code class="notranslate">메이시스</code></li>
<li class="list-inline-item"><code class="notranslate">마이프</code></li>
<li class="list-inline-item"><code class="notranslate">맨</code></li>
<li class="list-inline-item"><code class="notranslate">망고</code></li>
<li class="list-inline-item"><code class="notranslate">메리어트</code></li>
<li class="list-inline-item"><code class="notranslate">마세라티</code></li>
<li class="list-inline-item"><code class="notranslate">마텔</code></li>
<li class="list-inline-item"><code class="notranslate">맥킨지</code></li>
<li class="list-inline-item"><code class="notranslate">메트라이프</code></li>
<li class="list-inline-item"><code class="notranslate">마이크로소프트</code></li>
<li class="list-inline-item"><code class="notranslate">미니</code></li>
<li class="list-inline-item"><code class="notranslate">MIT</code></li>
<li class="list-inline-item"><code class="notranslate">미쓰비시</code></li>
<li class="list-inline-item"><code class="notranslate">MLB</code></li>
<li class="list-inline-item"><code class="notranslate">MMA</code></li>
<li class="list-inline-item"><code class="notranslate">모나쉬</code></li>
<li class="list-inline-item"><code class="notranslate">몰몬</code></li>
<li class="list-inline-item"><code class="notranslate">모토</code></li>
<li class="list-inline-item"><code class="notranslate">무비스타</code></li>
<li class="list-inline-item"><code class="notranslate">MSD</code></li>
<li class="list-inline-item"><code class="notranslate">MTN</code></li>
<li class="list-inline-item"><code class="notranslate">MTR</code></li>
<li class="list-inline-item"><code class="notranslate">상호</code></li>
<li class="list-inline-item"><code class="notranslate">나덱스</code></li>
<li class="list-inline-item"><code class="notranslate">전국</code></li>
<li class="list-inline-item"><code class="notranslate">자연</code></ li>
<li class="list-inline-item"><code class="notranslate">NBA</code></li>
<li class="list-inline-item"><code class="notranslate">NEC</code></li>
<li class="list-inline-item"><code class="notranslate">넷플릭스</code></li>
<li class="list-inline-item"><code class="notranslate">뉴스타</code></li>
<li class="list-inline-item"><code class="notranslate">뉴홀랜드</code></li>
<li class="list-inline-item"><code class="notranslate">NFL</code></li>
<li class="list-inline-item"><code class="notranslate">NHK</code></li>
<li class="list-inline-item"><code class="notranslate">니코</code></li>
<li class="list-inline-item"><code class="notranslate">나이키</code></li>
<li class="list-inline-item"><code class="notranslate">니콘</code></li>
<li class="list-inline-item"><code class="notranslate">닛산</code></li>
<li class="list-inline-item"><code class="notranslate">니세이</code></li>
<li class="list-inline-item"><code class="notranslate">노키아</code></li>
<li class="list-inline-item"><code class="notranslate">노스웨스턴뮤추얼</code></li>
<li class="list-inline-item"><code class="notranslate">노턴</code></li>
<li class="list-inline-item"><code class="notranslate">NRA</code></li>
<li class="list-inline-item"><code class="notranslate">NTT</code></li>
<li class="list-inline-item"><code class="notranslate">오비</code></li>
<li class="list-inline-item"><code class="notranslate">오메가</code></li>
<li class="list-inline-item"><code class="notranslate">오클라호마</code></li>
<li class="list-inline-item"><code class="notranslate">오츠카</code></li>
<!--<li class="list-inline-item"><code class="notranslate">ovh</code></li>-->
<li class="list-inline-item"><code class="notranslate">파나소닉</code></li>
<li class="list-inline-item"><code class="notranslate">pccw</code></li>
<li class="list-inline-item"><code class="notranslate">화이자</code></li>
<li class="list-inline-item"><code class="notranslate">필립스</code></li>
<li class="list-inline-item"><code class="notranslate">피아제</code></li>
<li class="list-inline-item"><code class="notranslate">픽텟</code></li>
<li class="list-inline-item"><code class="notranslate">핑</code></li>
<li class="list-inline-item"><code class="notranslate">파이오니어</code></li>
<li class="list-inline-item"><code class="notranslate">플레이</code></li>
<li class="list-inline-item"><code class="notranslate">플레이스테이션</code></li>
<li class="list-inline-item"><code class="notranslate">포흘</code></li>
<li class="list-inline-item"><code class="notranslate">정책</code></li>
<li class="list-inline-item"><code class="notranslate">실천</code></li>
<li class="list-inline-item"><code class="notranslate">제품</code></li>
<li class="list-inline-item"><code class="notranslate">진보적</code></li>
<li class="list-inline-item"><code class="notranslate">건전성</code></li>
<li class="list-inline-item"><code class="notranslate">건전성</code></li>
<li class="list-inline-item"><code class="notranslate">pwc</code></li>
<!--<li class="list-inline-item"><code class="notranslate">퀘스트</code></li>-->
<li class="list-inline-item"><code class="notranslate">QVC</code></li>
<li class="list-inline-item"><code class="notranslate">레드스톤</code></li>
<li class="list-inline-item"><code class="notranslate">릴라이언스</code></li>
<li class="list-inline-item"><code class="notranslate">렉스로스</code></li>
<li class="list-inline-item"><code class="notranslate">리코</code></li>
<li class="list-inline-item"><code class="notranslate">rmit</code></li>
<li class="list-inline-item"><code class="notranslate">로셔</code></li>
<li class="list-inline-item"><code class="notranslate">로저스</code></li>
<li class="list-inline-item"><code class="notranslate">rwe</code></li>
<li class="list-inline-item"><code class="notranslate">안전</code></li>
<li class="list-inline-item"><code class="notranslate">사쿠라</code></li>
<li class="list-inline-item"><code class="notranslate">삼성</code></li>
<li class="list-inline-item"><code class="notranslate">샌드빅</code></li>
<li class="list-inline-item"><code class="notranslate">샌드빅코로만트</code></li>
<li class="list-inline-item"><code class="notranslate">사노피</code></li>
<li class="list-inline-item"><code class="notranslate">SAP</code></li>
<li class="list-inline-item"><code class="notranslate">색소</code></li>
<li class="list-inline-item"><code class="notranslate">SBI</code></li>
<!--<li class="list-inline-item"><code class="notranslate">SBS</code></li>-->
<li class="list-inline-item"><code class="notranslate">스카</code></li>
<li class="list-inline-item"><code class="notranslate">SCB</code></li>
<li class="list-inline-item"><code class="notranslate">셰플러</code></li>
<li class="list-inline-item"><code class="notranslate">슈미트</code></li>
<li class="list-inline-item"><code class="notranslate">슈바르츠</code></li>
<li class="list-inline-item"><code class="notranslate">scjohnson</code></li>
<li class="list-inline-item"><code class="notranslate">스코어</code></li>
<li class="list-inline-item"><code class="notranslate">좌석</code></li>
<li class="list-inline-item"><code class="notranslate">세너</code></li>
<li class="list-inline-item"><code class="notranslate">세스</code></li>
<li class="list-inline-item"><code class="notranslate">바느질</code></li>
<li class="list-inline-item"><code class="notranslate">일곱</code></li>
<li class="list-inline-item"><code class="notranslate">sfr</code></li>
<li class="list-inline-item"><code class="notranslate">탐색</code></li>
<li class="list-inline-item"><code class="notranslate">샹그릴라</code></li>
<li class="list-inline-item"><code class="notranslate">샤프</code></li>
<li class="list-inline-item"><code class="notranslate">쇼</code></li>
<li class="list-inline-item"><code class="notranslate">셸</code></li>
<li class="list-inline-item"><code class="notranslate">슈리람</code></li>
<li class="list-inline-item"><code class="notranslate">시나</code></li>
<li class="list-inline-item"><code class="notranslate">스카이</code></li>
<li class="list-inline-item"><code class="notranslate">스카이프</code></li>
<li class="list-inline-item"><code class="notranslate">스마트</code></li>
<li class="list-inline-item"><code class="notranslate">SNCF</code></li>
<li class="list-inline-item"><code class="notranslate">소프트뱅크</code></li>
<li class="list-inline-item"><code class="notranslate">소후</code></li>
<li class="list-inline-item"><code class="notranslate">소니</code></li>
<li class="list-inline-item"><code class="notranslate">슈피겔</code></li>
<li class="list-inline-item"><code class="notranslate">스타다</code></li>
<li class="list-inline-item"><code class="notranslate">스테이플</code></li>
<li class="list-inline-item"><code class="notranslate">스타</code></li>
<li class="list-inline-item"><code class="notranslate">스타허브</code></li>
<li class="list-inline-item"><code class="notranslate">스테이트뱅크</code></li>
<li class="list-inline-item"><code class="notranslate">스테이트팜</code></li>
<li class="list-inline-item"><code class="notranslate">스타토일</code></li>
<li class="list-inline-item"><code class="notranslate">stc</code></li>
<li class="list-inline-item"><code class="notranslate">stc그룹</code></li>
<li class="list-inline-item"><code class="notranslate">스즈키</code></li>
<li class="list-inline-item"><code class="notranslate">스와치</code></li>
<li class="list-inline-item"><code class="notranslate">스위프트커버</code></li>
<li class="list-inline-item"><code class="notranslate">시만텍</code></li>
<li class="list-inline-item"><code class="notranslate">타오바오</code></li>
<li class="list-inline-item"><code class="notranslate">타타모토스</code></li>
<li class="list-inline-item"><code class="notranslate">TDK</code></li>
<li class="list-inline-item"><code class="notranslate">텔레시티</code></li>
<li class="list-inline-item"><code class="notranslate">텔레포니카</code></li>
<li class="list-inline-item"><code class="notranslate">테마섹</code></li>
<li class="list-inline-item"><code class="notranslate">테바</code></li>
<li class="list-inline-item"><code class="notranslate">티파니</code></li>
<li class="list-inline-item"><code class="notranslate">티제이엑스</code></li>
<li class="list-inline-item"><code class="notranslate">토레이</code></li>
<li class="list-inline-item"><code class="notranslate">도시바</code></li>
<li class="list-inline-item"><code class="notranslate">총계</code></li>
<li class="list-inline-item"><code class="notranslate">토요타</code></li>
<li class="list-inline-item"><code class="notranslate">트래블채널</code></li>
<li class="list-inline-item"><code class="notranslate">여행자</code></li>
<li class="list-inline-item"><code class="notranslate">투이</code></li>
<li class="list-inline-item"><code class="notranslate">TVS</code></li>
<li class="list-inline-item"><code class="notranslate">UBS</code></li>
<li class="list-inline-item"><code class="notranslate">유니콤</code></li>
<li class="list-inline-item"><code class="notranslate">UOL</code></li>
<li class="list-inline-item"><code class="notranslate">UPS</code></li>
<li class="list-inline-item"><code class="notranslate">뱅가드</code></li>
<li class="list-inline-item"><code class="notranslate">베리사인</code></li>
<li class="list-inline-item"><code class="notranslate">vig</code></li>
<li class="list-inline-item"><code class="notranslate">바이킹</code></li>
<li class="list-inline-item"><code class="notranslate">virgin</code></li>
<li class="list-inline-item"><code class="notranslate">visa</code></li>
<li class="list-inline-item"><code class="notranslate">vista</code></li>
<li class="list-inline-item"><code class="notranslate">vistaprint</code></li>
<li class="list-inline-item"><code class="notranslate">vivo</code></li>
<li class="list-inline-item"><code class="notranslate">폭스바겐</code></li>
<li class="list-inline-item"><code class="notranslate">볼보</code></li>
<li class="list-inline-item"><code class="notranslate">월마트</code></li>
<li class="list-inline-item"><code class="notranslate">월터</code></li>
<li class="list-inline-item"><code class="notranslate">웨더채널</code></li>
<li class="list-inline-item"><code class="notranslate">웨버</code></li>
<li class="list-inline-item"><code class="notranslate">위어</code></li>
<li class="list-inline-item"><code class="notranslate">윌리엄힐</code></li>
<li class="list-inline-item"><code class="notranslate">윈도우즈</code></li>
<li class="list-inline-item"><code class="notranslate">WME</code></li>
<li class="list-inline-item"><code class="notranslate">월터스클루워</code></li>
<li class="list-inline-item"><code class="notranslate">우드사이드</code></li>
<li class="list-inline-item"><code class="notranslate">WTC</code></li>
<li class="list-inline-item"><code class="notranslate">Xbox</code></li>
<li class="list-inline-item"><code class="notranslate">제록스</code></li>
<li class="list-inline-item"><code class="notranslate">엑스피니티</code></li>
<li class="list-inline-item"><code class="notranslate">야후</code></li>
<li class="list-inline-item"><code class="notranslate">야마순</code></li>
<li class="list-inline-item"><code class="notranslate">얀덱스</code></li>
<li class="list-inline-item"><code class="notranslate">요도바시</code></li>
<li class="list-inline-item"><code class="notranslate">유튜브</code></li>
<li class="list-inline-item"><code class="notranslate">자포스</code></li>
<li class="list-inline-item"><code class="notranslate">자라</code></li>
<li class="list-inline-item"><code class="notranslate">지포</code></li>
</ul>

2025년 3월 18일부터 이 목록에 다음 프랑스 해외 영토도 추가되었습니다([이 GitHub 요청에 따라](https://github.com/forwardemail/forwardemail.net/issues/327)):

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">bzh</code></li>
<li class="list-inline-item"><code class="notranslate">gf</code></li>
<li class="list-inline-item"><code class="notranslate">gp</code></li>
<li class="list-inline-item"><code class="notranslate">mq</code></li>
<li class="list-inline-item"><code class="notranslate">nc</code></li>
<li class="list-inline-item"><code class="notranslate">pf</code></li>
<li class="list-inline-item"><code class="notranslate">pm</code></li>
<li class="list-inline-item"><code class="notranslate">re</code></li>
<li class="list-inline-item"><code class="notranslate">tf</code></li>
<li class="list-inline-item"><code class="notranslate">wf</code></li>
<li class="list-inline-item"><code class="notranslate">yt</code></li>
</ul>

2025년 7월 8일부터 다음과 같은 유럽 국가가 추가되었습니다.

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">ax</code></li>
<li class="list-inline-item"><code class="notranslate">bg</code></li>
<li class="list-inline-item"><code class="notranslate">fo</code></li>
<li class="list-inline-item"><code class="notranslate">gi</code></li>
<li class="list-inline-item"><code class="notranslate">gr</code></li>
<li class="list-inline-item"><code class="notranslate">hr</code></li>
<li class="list-inline-item"><code class="notranslate">hu</code></li>
<li class="list-inline-item"><code class="notranslate">lt</code></li>
<li class="list-inline-item"><code class="notranslate">루</code></li>
<li class="list-inline-item"><code class="notranslate">mc</code></li>
<li class="list-inline-item"><code class="notranslate">mk</code></li>
<li class="list-inline-item"><code class="notranslate">mt</code></li>
<li class="list-inline-item"><code class="notranslate">ro</code></li>
<li class="list-inline-item"><code class="notranslate">sk</code></li>
<li class="list-inline-item"><code class="notranslate">va</code></li>
</ul>

스팸 활동이 많기 때문에 `cz`, `ru`, `ua`는 특별히 포함하지 않았습니다.

### 허용 목록 기준은 무엇입니까? {#what-is-your-allowlist-criteria}

우리는 [기본적으로 허용 목록에 포함된 도메인 이름 확장자](#what-domain-name-extensions-are-allowlisted-by-default)의 정적 목록을 가지고 있으며, 다음의 엄격한 기준에 따라 동적이고 캐시된 롤링 허용 목록도 유지 관리합니다.

* 발신자 루트 도메인은 [무료 플랜에서 제공하는 목록과 일치하는 도메인 이름 확장자](#what-domain-name-extensions-can-be-used-for-free)(`biz` 및 `info` 추가)이어야 합니다. `edu`, `gov` 및 `mil` 부분 일치 항목(예: `xyz.gov.au` 및 `xyz.edu.au`)도 포함합니다.
* 발신자 루트 도메인은 [우산 인기 목록](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List")("UPL")에서 파싱된 고유 루트 도메인 결과 상위 100,000개 내에 있어야 합니다.
* 발신자 루트 도메인은 지난 7일 중 최소 4일 이상 UPL에 나타난 고유 루트 도메인 결과 상위 50,000개 내에 있어야 합니다(약 50% 이상).
* 발신자 루트 도메인은 Cloudflare에서 성인 콘텐츠 또는 맬웨어로 분류된 [분류된](https://radar.cloudflare.com/categorization-feedback/)가 아니어야 합니다.
* 발신자 루트 도메인에는 A 레코드 또는 MX 레코드가 설정되어 있어야 합니다.
* 발신자 루트 도메인에는 A 레코드, MX 레코드, `biz`0 또는 `biz`1이 포함된 DMARC 레코드, 또는 `biz`2 또는 `biz`3 한정자가 포함된 SPF 레코드가 있어야 합니다.

이 기준이 충족되면 발신자 루트 도메인이 7일 동안 캐시됩니다. 자동화된 작업은 매일 실행되므로 매일 업데이트되는 롤링 허용 목록 캐시입니다.

자동화된 작업은 UPL의 지난 7일간 메모리 내 데이터를 다운로드하고 압축을 푼 다음, 위의 엄격한 기준에 따라 메모리 내 데이터를 구문 분석합니다.

이 글을 쓰는 시점에서 Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify 등 인기 있는 도메인도 물론 포함됩니다.

허용 목록에 없는 발신자이신 경우, FQDN 루트 도메인 또는 IP 주소에서 이메일을 처음 보낼 때 [속도 제한](#do-you-have-rate-limiting) 및 [그레이리스트](#do-you-have-a-greylist) 상태가 됩니다. 이는 이메일 표준으로 채택된 표준 관행입니다. 대부분의 이메일 서버 클라이언트는 속도 제한 또는 그레이리스트 오류(예: 421 또는 4xx 수준 오류 상태 코드)를 수신하면 재시도를 시도합니다.

**`a@gmail.com`, `b@xyz.edu`, `c@gov.au`와 같은 특정 발신자는 여전히 [거부됨](#do-you-have-a-denylist)일 수 있습니다.** (예: 해당 발신자에서 스팸, 피싱 또는 맬웨어를 자동으로 감지하는 경우).

### 무료로 사용할 수 있는 도메인 이름 확장자는 무엇입니까? {#what-domain-name-extensions-can-be-used-for-free}

2023년 3월 31일부터 당사는 사용자와 서비스를 보호하기 위해 새로운 전면 스팸 규칙을 시행했습니다.

이 새로운 규칙은 다음 도메인 이름 확장자만 무료 플랜에서 사용할 수 있도록 허용합니다.

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">ac</code></li>
<li class="list-inline-item"><code class="notranslate">ad</code></li>
<li class="list-inline-item"><code class="notranslate">ag</code></li>
<li class="list-inline-item"><code class="notranslate">ai</code></li>
<li class="list-inline-item"><code class="notranslate">al</code></li>
<li class="list-inline-item"><code class="notranslate">am</code></li>
<li class="list-inline-item"><code class="notranslate">앱</code></li>
<li class="list-inline-item"><code class="notranslate">as</code></li>
<li class="list-inline-item"><code class="notranslate">에서</code></li>
<li class="list-inline-item"><code class="notranslate">호주</code></li>
<li class="list-inline-item"><code class="notranslate">바</code></li>
<li class="list-inline-item"><code class="notranslate">베</code></li>
<li class="list-inline-item"><code class="notranslate">브라질</code></li>
<li class="list-inline-item"><code class="notranslate">에서</code></li>
<li class="list-inline-item"><code class="notranslate">캐나다</code></li>
<li class="list-inline-item"><code class="notranslate">카탈로그</code></li>
<li class="list-inline-item"><code class="notranslate">카운티</code></li>
<li class="list-inline-item"><code class="notranslate">카운티</code></li>
<li class="list-inline-item"><code class="notranslate">cd</code></li>
<li class="list-inline-item"><code class="notranslate">ch</code></li>
<li class="list-inline-item"><code class="notranslate">ck</code></li>
<li class="list-inline-item"><code class="notranslate">co</code></li>
<li class="list-inline-item"><code class="notranslate">com</code></li>
<li class="list-inline-item"><code class="notranslate">de</code></li>
<li class="list-inline-item"><code class="notranslate">dev</code></li>
<li class="list-inline-item"><code class="notranslate">dj</code></li>
<li class="list-inline-item"><code class="notranslate">dk</code></li>
<li class="list-inline-item"><code class="notranslate">ee</code></li>
<li class="list-inline-item"><code class="notranslate">es</code></li>
<li class="list-inline-item"><code class="notranslate">eu</code></li>
<li class="list-inline-item"><code class="notranslate">가족</code></li>
<li class="list-inline-item"><code class="notranslate">fi</code></li>
<li class="list-inline-item"><code class="notranslate">fm</code></li>
<li class="list-inline-item"><code class="notranslate">fr</code></li>
<li class="list-inline-item"><code class="notranslate">gg</code></li>
<li class="list-inline-item"><code class="notranslate">gl</code></li>
<li class="list-inline-item"><code class="notranslate">id</code></li>
<li class="list-inline-item"><code class="notranslate">즉</code></li>
<li class="list-inline-item"><code class="notranslate">il</code></li>
<li class="list-inline-item"><code class="notranslate">im</code></li>
<li class="list-inline-item"><code class="notranslate">in</code></li>
<li class="list-inline-item"><code class="notranslate">io</code></li>
<li class="list-inline-item"><code class="notranslate">ir</code></li>
<li class="list-inline-item"><code class="notranslate">is</code></li>
<li class="list-inline-item"><code class="notranslate">it</code></li>
<li class="list-inline-item"><code class="notranslate">je</code></li>
<li class="list-inline-item"><code class="notranslate">일본</code></li>
<li class="list-inline-item"><code class="notranslate">케</code></li>
<li class="list-inline-item"><code class="notranslate">대한민국</code></li>
<li class="list-inline-item"><code class="notranslate">라</code></li>
<li class="list-inline-item"><code class="notranslate">리버풀</code></li>
<li class="list-inline-item"><code class="notranslate">벨기에</code></li>
<li class="list-inline-item"><code class="notranslate">리버풀</code></li>
<li class="list-inline-item"><code class="notranslate">멜버른</code></li>
<li class="list-inline-item"><code class="notranslate">mn</code></li>
<li class="list-inline-item"><code class="notranslate">ms</code></li>
<li class="list-inline-item"><code class="notranslate">mu</code></li>
<li class="list-inline-item"><code class="notranslate">mx</code></li>
<li class="list-inline-item"><code class="notranslate">net</code></li>
<li class="list-inline-item"><code class="notranslate">ni</code></li>
<li class="list-inline-item"><code class="notranslate">nl</code></li>
<li class="list-inline-item"><code class="notranslate">no</code></li>
<li class="list-inline-item"><code class="notranslate">nu</code></li>
<li class="list-inline-item"><code class="notranslate">nz</code></li>
<li class="list-inline-item"><code class="notranslate">org</code></li>
<li class="list-inline-item"><code class="notranslate">pl</code></li>
<li class="list-inline-item"><code class="notranslate">pr</code></li>
<li class="list-inline-item"><code class="notranslate">pt</code></li>
<li class="list-inline-item"><code class="notranslate">pw</code></li>
<li class="list-inline-item"><code class="notranslate">rs</code></li>
<li class="list-inline-item"><code class="notranslate">sc</code></li>
<li class="list-inline-item"><code class="notranslate">se</code></li>
<li class="list-inline-item"><code class="notranslate">sh</code></li>
<li class="list-inline-item"><code class="notranslate">si</code></li>
<li class="list-inline-item"><code class="notranslate">sm</code></li>
<li class="list-inline-item"><code class="notranslate">sr</code></li>
<li class="list-inline-item"><code class="notranslate">st</code></li>
<li class="list-inline-item"><code class="notranslate">tc</code></li>
<li class="list-inline-item"><code class="notranslate">tm</code></li>
<li class="list-inline-item"><code class="notranslate">to</code></li>
<li class="list-inline-item"><code class="notranslate">tv</code></li>
<li class="list-inline-item"><code class="notranslate">영국</code></li>
<li class="list-inline-item"><code class="notranslate">미국</code></li>
<li class="list-inline-item"><code class="notranslate">우즈베키스탄</code></li>
<li class="list-inline-item"><code class="notranslate">베트남</code></li>
<li class="list-inline-item"><code class="notranslate">부탄</code></li>
<li class="list-inline-item"><code class="notranslate">스웨덴</code></li>
<li class="list-inline-item"><code class="notranslate">XYZ</code></li>
<li class="list-inline-item"><code class="notranslate">자</code></li>
</ul>

### 그레이리스트가 있나요? {#do-you-have-a-greylist}

네, 저희는 매우 느슨한 [이메일 그레이리스트](https://en.wikipedia.org/wiki/Greylisting_\(email\)) 정책을 사용하고 있습니다. 그레이리스트는 허용 목록에 없는 발신자에게만 적용되며 캐시에 30일 동안 보관됩니다.

모든 신규 발신자의 경우, 저희는 Redis 데이터베이스에 30일 동안 키를 저장하며, 이 키 값은 첫 번째 요청의 최초 도착 시간으로 설정됩니다. 이후 재시도 상태 코드 450을 부여하여 해당 이메일을 거부하고, 5분이 지난 후에야 이메일을 전달합니다.

이 초기 도착 시간으로부터 5분을 성공적으로 기다린 경우, 해당 이메일은 수락되고 450 상태 코드는 수신되지 않습니다.

키는 FQDN 루트 도메인 또는 발신자의 IP 주소로 구성됩니다. 즉, 그레이리스트를 통과하는 모든 하위 도메인은 루트 도메인으로도 통과되며, 그 반대의 경우도 마찬가지입니다(이것이 바로 "매우 느슨한" 정책이라는 의미입니다).

예를 들어, `test.example.com`에서 이메일이 도착한 후에 `example.com`에서 이메일이 도착하면, `test.example.com` 및/또는 `example.com`에서 온 모든 이메일은 연결 초기 도착 시간으로부터 5분을 기다려야 합니다. `test.example.com`와 `example.com`가 각각 5분씩 대기하도록 설정하지는 않습니다(저희의 그레이리스팅 정책은 루트 도메인 수준에서 적용됩니다).

그레이리스트는 [허용 목록](#do-you-have-an-allowlist)에 있는 모든 발신자(이 글을 쓰는 시점에서는 Meta, Amazon, Netflix, Google, Microsoft)에게는 적용되지 않습니다.

### 거부 목록이 있습니까? {#do-you-have-a-denylist}

네, 저희는 자체적인 거부 목록을 운영하고 있으며, 스팸 및 악성 활동이 감지되면 실시간으로 자동 업데이트하고, 수동으로도 업데이트합니다.

또한 매시간 <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz>의 UCEPROTECT 레벨 1 거부 목록에서 모든 IP 주소를 가져와 7일 만료 기간이 있는 거부 목록에 입력합니다.

거부 목록에 있는 발신자는 [허용 목록에 없습니다](#do-you-have-an-allowlist)인 경우 421 오류 코드(나중에 다시 시도하라는 발신자의 지시)를 받습니다.

554 상태 코드 대신 421 상태 코드를 사용하면 실시간으로 잠재적인 오탐지를 완화하고 다음 시도에서 메시지를 성공적으로 전달할 수 있습니다.

**이 기능은 다른 메일 서비스와는 다르게 설계되었습니다.** 차단 목록에 추가되면 영구적인 실패가 발생합니다. 발신자에게 메시지 재전송을 요청하는 것은 (특히 대규모 조직의 경우) 어려운 경우가 많기 때문에, 이 방식을 사용하면 발신자, 수신자 또는 저희가 초기 이메일 시도 후 약 5일 동안 개입하여 문제를 해결할 수 있습니다(차단 목록 삭제 요청).

모든 거부 목록 제거 요청은 관리자가 실시간으로 모니터링합니다(예: 관리자가 반복되는 거짓 양성 결과를 영구적으로 허용 목록에 추가할 수 있음).

거부 목록 제거 요청은 <https://forwardemail.net/denylist>.>에서 요청할 수 있습니다. 유료 사용자의 거부 목록 제거 요청은 즉시 처리되지만, 무료 사용자의 경우 관리자가 요청을 처리할 때까지 기다려야 합니다.

스팸이나 바이러스 콘텐츠를 보내는 것으로 감지된 발신자는 다음과 같은 방법으로 거부 목록에 추가됩니다.

1. "신뢰할 수 있는" 발신자(예: `gmail.com`, `microsoft.com`, `apple.com`)의 스팸 또는 차단 메일이 감지되면 [초기 메시지 지문](#how-do-you-determine-an-email-fingerprint)이 그레이리스트에 추가됩니다.
* 발신자가 허용 목록에 포함된 경우, 메시지는 1시간 동안 그레이리스트에 추가됩니다.
* 발신자가 허용 목록에 포함되지 않은 경우, 메시지는 6시간 동안 그레이리스트에 추가됩니다.
2. 발신자와 메시지의 정보에서 거부 목록 키를 구문 분석하고, 각 키에 대해 카운터를 생성하고(아직 존재하지 않는 경우) 1씩 증가시킨 후 24시간 동안 캐시합니다.
* 허용 목록에 포함된 발신자의 경우:
* SPF가 통과했거나 SPF가 없고 [포스트마스터 사용자 이름](#what-are-postmaster-addresses) 또는 [답장 불가 사용자 이름](#what-are-no-reply-addresses)가 아닌 경우, 봉투 "MAIL FROM" 이메일 주소에 대한 키를 추가합니다.
* "보낸 사람" 헤더가 허용 목록에 있는 경우, SPF 통과 또는 DKIM 통과가 확인된 경우 "보낸 사람" 헤더 이메일 주소에 대한 키를 추가합니다.
* "보낸 사람" 헤더가 허용 목록에 없는 경우, "보낸 사람" 헤더 이메일 주소와 루트 파싱된 도메인 이름에 대한 키를 추가합니다.
* 허용 목록에 없는 발신자의 경우:
* SPF 통과가 확인된 경우 봉투 "MAIL FROM" 이메일 주소에 대한 키를 추가합니다.
* "보낸 사람" 헤더가 허용 목록에 있는 경우, SPF 통과 또는 DKIM 통과가 확인된 경우 "보낸 사람" 헤더 이메일 주소에 대한 키를 추가합니다.
* "보낸 사람" 헤더가 허용 목록에 없는 경우, "보낸 사람" 헤더 이메일 주소와 루트 파싱된 도메인 이름에 대한 키를 추가합니다.
* 발신자의 원격 IP 주소에 대한 키를 추가합니다.
* 발신자의 IP 주소(있는 경우)에서 역방향 조회를 통해 클라이언트에서 확인된 호스트 이름에 대한 키를 추가합니다.
* 클라이언트에서 확인된 호스트 이름(있는 경우, 클라이언트에서 확인된 호스트 이름과 다른 경우)의 루트 도메인에 대한 키를 추가합니다.
3. 허용 목록에 없는 발신자와 키에 대한 카운터가 5에 도달하면, 해당 키를 30일 동안 거부 목록에 추가하고, 남용 방지팀에 이메일을 발송합니다. 이 수치는 변경될 수 있으며, 남용 방지팀에서 모니터링하는 동안 업데이트가 여기에 반영됩니다.
4. 허용 목록에 있는 발신자와 키에 대한 카운터가 10에 도달하면, 해당 키를 7일 동안 거부 목록에 추가하고, 남용 방지팀에 이메일을 발송합니다. 이 수치는 변경될 수 있으며, 남용 방지팀에서 모니터링하는 동안 업데이트가 여기에 반영됩니다.

> **참고:** 가까운 시일 내에 평판 모니터링 기능을 도입할 예정입니다. 평판 모니터링은 위에서 언급한 기본적인 카운터 방식이 아닌, 일정 비율의 임계값을 기반으로 발신자를 차단 목록에 추가할 시점을 계산합니다.

### 속도 제한이 있습니까? {#do-you-have-rate-limiting}

발신자 속도 제한은 발신자 IP 주소에 대한 역방향 PTR 조회를 통해 루트 도메인을 파싱하여 적용하거나, 해당 결과가 나오지 않으면 발신자 IP 주소를 그대로 사용합니다. 아래에서는 이를 `Sender`이라고 합니다.

MX 서버에는 [암호화된 IMAP 저장소](/blog/docs/best-quantum-safe-encrypted-email-service)에 대해 수신되는 인바운드 메일에 대한 일일 제한이 있습니다.

* 개별 별칭(예: `you@yourdomain.com`)으로 수신되는 수신 메일의 속도를 제한하는 대신, 별칭 도메인 이름 자체(예: `yourdomain.com`)로 속도를 제한합니다. 이렇게 하면 `Senders`가 도메인 내 모든 별칭의 받은 편지함에 동시에 넘쳐나는 것을 방지할 수 있습니다.
* 수신자와 관계없이 서비스 전체의 모든 `Senders`에 적용되는 일반적인 제한 사항이 있습니다.
* "신뢰할 수 있는" 출처로 간주되는 `Senders`(예: `gmail.com`, `microsoft.com`, `apple.com`)는 하루 100GB로 전송이 제한됩니다.
* `Senders` 중 [허용 목록에 추가됨](#do-you-have-an-allowlist)인 `Senders`은 하루 10GB로 전송이 제한됩니다.
* 다른 모든 `yourdomain.com`0은 하루 1GB 및/또는 1000개의 메시지 전송으로 제한됩니다.
* `yourdomain.com`1 및 `yourdomain.com`2에는 하루 1GB 및/또는 1000개의 메시지 전송이라는 특정 제한이 있습니다.

MX 서버는 또한 속도 제한을 통해 한 명 이상의 수신자에게 전달되는 메시지를 제한합니다. 하지만 이는 `Senders`에만 적용되고 [허용 목록](#do-you-have-an-allowlist)에는 적용되지 않습니다.

* 시간당 최대 100개의 연결, `Sender` 확인된 FQDN 루트 도메인(또는) `Sender` 원격 IP 주소(역방향 PTR을 사용할 수 없는 경우)당, 그리고 봉투 수신자당 연결만 허용합니다. 속도 제한을 위한 키는 Redis 데이터베이스에 암호화 해시 형태로 저장됩니다.

* 당사 시스템을 통해 이메일을 보내는 경우 모든 IP 주소에 역방향 PTR을 설정했는지 확인하세요(그렇지 않으면 보내는 각 고유 FQDN 루트 도메인 또는 IP 주소의 속도가 제한됩니다).

* Amazon SES와 같은 인기 있는 시스템을 통해 보내는 경우, (이 글을 쓰는 시점에) Amazon SES가 허용 목록에 있으므로 속도 제한이 적용되지 않습니다.

* `test.abc.123.example.com`과 같은 도메인에서 전송하는 경우, `example.com`에 속도 제한이 적용됩니다. 많은 스패머는 고유한 FQDN 루트 도메인이 아닌 고유한 호스트 이름에만 속도 제한을 적용하는 일반적인 스팸 필터를 우회하기 위해 수백 개의 하위 도메인을 사용합니다.

* 속도 제한을 초과하는 `Senders`은 421 오류와 함께 거부됩니다.

당사의 IMAP 및 SMTP 서버는 별칭에서 동시에 `60`개가 넘는 동시 연결이 발생하는 것을 제한합니다.

MX 서버는 [허용 목록에 없음](#do-you-have-an-allowlist) 발신자가 동시에 10개를 초과하는 연결을 설정하지 못하도록 제한합니다(카운터의 캐시 만료 시간은 3분으로, 소켓 시간 제한인 3분과 동일).

### 백스캐터로부터 어떻게 보호하나요? {#how-do-you-protect-against-backscatter}

잘못 전달된 반송 메일이나 반송 스팸(일명 "[백스캐터](https://en.wikipedia.org/wiki/Backscatter_\(email\)")은 발신자 IP 주소에 부정적인 평판을 초래할 수 있습니다.

우리는 백스캐터로부터 보호하기 위해 두 가지 단계를 취하는데, 이는 아래의 [알려진 스팸 발송자의 메일 반송 방지](#prevent-bounces-from-known-mail-from-spammers) 및 [백스캐터로부터 보호하기 위해 불필요한 반사를 방지합니다.](#prevent-unnecessary-bounces-to-protect-against-backscatter) 섹션에서 자세히 설명합니다.

### 스패머의 알려진 메일에서 반송을 방지합니다. {#prevent-bounces-from-known-mail-from-spammers}

우리는 [Backscatter.org](https://www.backscatterer.org/)([UCEPROTECT](https://www.uceprotect.net/) 기반)에서 매 시간 목록을 끌어와서 <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz>에 Redis 데이터베이스에 입력합니다(또한 제거되어야 할 IP가 있는 경우를 대비해 사전에 차이를 비교합니다).

MAIL FROM이 비어 있거나 대소문자를 구분하지 않고 [우편 관리자 주소](#what-are-postmaster-addresses)(이메일의 @ 앞에 있는 부분)과 같으면 발신자 IP가 이 목록에 있는 IP와 일치하는지 확인합니다.

발신자의 IP가 등록되어 있고 [허용 목록](#do-you-have-an-allowlist)에 없는 경우, `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}` 메시지와 함께 554 오류를 전송합니다. 발신자가 Backscatterer 목록과 허용 목록에 모두 있는 경우 알림을 보내 필요한 경우 문제를 해결할 수 있도록 합니다.

이 섹션에 설명된 기술은 <https://www.backscatterer.org/?target=usage>의 "안전 모드" 권장 사항을 따릅니다. 이 권장 사항에서는 특정 조건이 이미 충족된 경우에만 발신자 IP를 확인합니다.

### 불필요한 반사를 방지하여 백스캐터로부터 보호합니다. {#prevent-unnecessary-bounces-to-protect-against-backscatter}

반송은 수신자에게 이메일 전달이 완전히 실패했으며 이메일이 다시 시도되지 않음을 나타내는 이메일입니다.

Backscatterer 목록에 등록되는 일반적인 이유 중 하나는 잘못된 반송이나 반송 스팸입니다. 따라서 다음과 같은 몇 가지 방법으로 이를 방지해야 합니다.

1. 상태 코드 오류가 500 이상 발생할 때만 이메일을 전송합니다(이메일 전달이 실패할 때, 예: Gmail이 500 수준 오류로 응답할 때).

2. 단 한 번만 전송합니다(계산된 바운스 지문 키를 사용하여 중복 전송을 방지하기 위해 캐시에 저장합니다). 바운스 지문은 메시지의 지문과 바운스 주소의 해시값, 그리고 오류 코드를 결합한 키입니다. 메시지 지문 계산 방식에 대한 자세한 내용은 [지문](#how-do-you-determine-an-email-fingerprint) 섹션을 참조하세요. 성공적으로 전송된 바운스 지문은 Redis 캐시에서 7일 후에 만료됩니다.

3. MAIL FROM 및/또는 From이 비어 있지 않고 (대소문자 구분 없이) [포스트마스터 사용자 이름](#what-are-postmaster-addresses)(이메일의 @ 앞에 있는 부분)이 포함되지 않은 경우에만 전송합니다.

4. 원본 메시지에 다음 헤더가 포함되어 있는 경우 전송하지 않습니다(대소문자 구분 없음):

* `auto-submitted`의 헤더 값이 `no`과 같지 않습니다.
* `dr`, `autoreply`, `auto-reply`, `auto_reply` 또는 `all` 값을 갖는 `x-auto-response-suppress`의 헤더
* `list-id`, `list-subscribe`, `no`0, `no`1, `no`2, `no`3, `no`4, `no`5, `no`6 또는 `no`7의 헤더(값과 무관)
* `no`9, `x-auto-response-suppress`0, `x-auto-response-suppress`1, `x-auto-response-suppress`2 또는 `x-auto-response-suppress`3 값을 갖는 `no`8의 헤더.

5. MAIL FROM 또는 From 이메일 주소가 `+donotreply`, `-donotreply`, `+noreply` 또는 `-noreply`으로 끝나면 이메일을 보내지 않습니다.

6. 보낸 사람 이메일 주소 사용자 이름 부분이 `mdaemon`이고 대소문자를 구분하지 않는 헤더가 `X-MDDSN-Message`인 경우에는 보내지 않습니다.

7. 대소문자를 구분하지 않는 `content-type` 헤더가 `multipart/report`에 있는 경우에는 전송하지 않습니다.

### 이메일 지문을 어떻게 결정합니까? {#how-do-you-determine-an-email-fingerprint}

이메일의 지문은 이메일의 고유성을 확인하고 중복 메시지가 전달되는 것을 방지하고 [중복 반송](#prevent-unnecessary-bounces-to-protect-against-backscatter)이 전송되는 것을 방지하는 데 사용됩니다.

지문은 다음 목록에서 계산됩니다.

* 클라이언트가 확인한 FQDN 호스트 이름 또는 IP 주소
* `Message-ID` 헤더 값(있는 경우)
* `Date` 헤더 값(있는 경우)
* `From` 헤더 값(있는 경우)
* `To` 헤더 값(있는 경우)
* `Cc` 헤더 값(있는 경우)
* `Subject` 헤더 값(있는 경우)
* `Body` 값(있는 경우)

### 25번 포트가 아닌 다른 포트로 이메일을 전달할 수 있나요?(예: ISP에서 25번 포트를 차단한 경우) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

네, 2020년 5월 5일부터 이 기능이 추가되었습니다. 현재 이 기능은 별칭이 아닌 도메인별로 제공됩니다. 별칭별로 기능을 설정해야 하는 경우, 저희에게 연락하여 필요한 사항을 알려주시기 바랍니다.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
강화된 개인정보 보호:
</strong>
<span>
유료 플랜(강화된 개인정보 보호 기능 포함)을 사용 중이신 경우, <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">내 계정 <i class="fa fa-angle-right"></i>도메인</a>으로 이동하여 도메인 옆의 "설정"을 클릭한 다음 "설정"을 클릭하세요. 유료 플랜에 대한 자세한 내용은 <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">가격</a> 페이지를 참조하세요. 그렇지 않은 경우 아래 지침을 따르세요.
</span>
</div>

무료 플랜을 사용 중이라면 아래와 같이 새 DNS <strong class="notranslate">TXT</strong> 레코드를 추가하고 포트를 25에서 원하는 포트로 변경하세요.

예를 들어, `example.com`으로 전송되는 모든 이메일을 25 대신 별칭 수신자의 SMTP 포트 1337로 전달하려면 다음을 수행합니다.

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>이름/호스트/별칭</th>
<th class="text-center">TTL</th>
<th>유형</th>
<th>답변/값</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", 또는 공백</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email-port=1337</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
팁:
</strong>
사용자 지정 포트 포워딩 설정의 가장 일반적인 시나리오는 example.com으로 전송되는 모든 이메일을 SMTP 표준 포트인 25번이 아닌 example.com의 다른 포트로 전달하려는 경우입니다. 이를 설정하려면 다음 <strong class="notranslate">TXT</strong> catch-all 레코드를 추가하기만 하면 됩니다.
<span>
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>이름/호스트/별칭</th>
<th class="text-center">TTL</th>
<th>유형</th>
<th>답변/값</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", 또는 공백</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=example.com</code></td>
</tr>
</tbody>
</table>

### Gmail 별칭에 대한 더하기 + 기호를 지원합니까? {#does-it-support-the-plus--symbol-for-gmail-aliases}

네, 물론입니다.

### 하위 도메인을 지원합니까? {#does-it-support-sub-domains}

네, 물론입니다. 이름/호스트/별칭에 "@", ".", 또는 공백을 사용하는 대신 하위 도메인 이름을 값으로 사용하면 됩니다.

`foo.example.com`에서 이메일을 전달하려면 DNS 설정(MX 및 <strong class="notranslate">TXT</strong> 레코드 모두)에서 이름/호스트/별칭 값으로 `foo`을 입력합니다.

### 이것이 내 이메일 헤더를 전달합니까? {#does-this-forward-my-emails-headers}

네, 물론입니다.

### 이것은 잘 테스트된 {#is-this-well-tested}}입니까?

네, [아바](https://github.com/avajs/ava)으로 작성된 테스트가 있고 코드 커버리지도 있습니다.

### SMTP 응답 메시지와 코드를 전달해 주시겠습니까? {#do-you-pass-along-smtp-response-messages-and-codes}

네, 물론입니다. 예를 들어 `hello@example.com`으로 이메일을 보내고 `user@gmail.com`로 전달되도록 등록되어 있는 경우, "mx1.forwardemail.net" 또는 "mx2.forwardemail.net"의 프록시 서버 대신 "gmail.com" SMTP 서버의 SMTP 응답 메시지와 코드가 반환됩니다.

### 스팸 발송자를 방지하고 좋은 이메일 전달 평판을 유지하려면 어떻게 해야 합니까? {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

위의 [이메일 전달 시스템은 어떻게 작동합니까?](#how-does-your-email-forwarding-system-work), [이메일 배달 문제를 어떻게 처리하시나요?](#how-do-you-handle-email-delivery-issues), [IP 주소가 차단되면 어떻게 처리하시나요?](#how-do-you-handle-your-ip-addresses-becoming-blocked) 섹션을 참조하세요.

### 도메인 이름에 대한 DNS 조회를 어떻게 수행합니까? {#how-do-you-perform-dns-lookups-on-domain-names}

저희는 오픈소스 소프트웨어 프로젝트인 :tangerine: [귤](https://github.com/forwardemail/tangerine)을 만들어 DNS 조회에 사용합니다. 사용되는 기본 DNS 서버는 `1.1.1.1`과 `1.0.0.1`이며, DNS 쿼리는 애플리케이션 계층에서 [HTTPS를 통한 DNS](https://en.wikipedia.org/wiki/DNS_over_HTTPS)("DoH")을 통해 이루어집니다.

:tangerine: [귤](https://github.com/tangerine)은 [기본적으로 CloudFlare의 개인 정보 보호 우선 소비자 DNS 서비스][cloudflare-dns]를 사용합니다.

## 계정 및 청구 {#account-and-billing}

### 유료 플랜에 대해 환불 보장을 제공하시나요? {#do-you-offer-a-money-back-guarantee-on-paid-plans}

네! 플랜 시작일로부터 30일 이내에 계정을 업그레이드, 다운그레이드 또는 취소하시면 자동 환불됩니다. 이는 신규 고객에게만 적용됩니다.

### 요금제를 변경하면 요금을 비례적으로 조정하고 차액을 환불해 주시나요? {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

요금제 변경 시, 차액을 일할 계산하거나 환불해 드리지 않습니다. 대신, 기존 요금제 만료일로부터 남은 기간을 새 요금제의 가장 가까운 기간으로 환산합니다(월 단위로 반올림).

유료 플랜을 처음 시작한 후 30일 이내에 유료 플랜으로 업그레이드하거나 다운그레이드하는 경우 기존 플랜의 전체 금액이 자동으로 환불됩니다.

### 이 이메일 전달 서비스를 "대체" 또는 "폴오버" MX 서버로 사용할 수 있습니까? {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

아니요, 한 번에 하나의 메일 교환 서버만 사용할 수 있으므로 권장하지 않습니다. 우선순위 설정 오류 및 메일 서버가 MX 교환 우선순위 검사를 따르지 않는 경우, 대체 시도는 일반적으로 재시도되지 않습니다.

### 특정 별칭을 비활성화할 수 있나요? {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
중요:
</strong>
<span>
유료 플랜을 사용 중이신 경우 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 별칭 <i class="fa fa-angle-right"></i> 별칭 편집 <i class="fa fa-angle-right"></i> "활성" 체크박스 선택 해제 <i class="fa fa-angle-right"></i> 계속 진행하세요.
</span>
</div>

네, DNS <strong class="notranslate">TXT</strong> 레코드를 편집하고 별칭 앞에 느낌표를 하나, 둘 또는 세 개 붙이면 됩니다(아래 참조).

":" 매핑은 반드시 보존해야 합니다. 이 매핑은 이 기능을 끄기로 결정할 경우 필요하며, 유료 플랜으로 업그레이드하는 경우 가져오기에도 사용됩니다.

**조용한 거부(보낸 사람에게는 메시지가 성공적으로 전송된 것처럼 보이지만 실제로는 아무 데도 가지 않음)(상태 코드 `250`):** 별칭 앞에 "!"(느낌표 하나)를 접두사로 붙이면 이 주소로 전송을 시도하는 보낸 사람에게 `250`의 성공 상태 코드가 반환되지만 이메일 자체는 아무 데도 가지 않습니다(예: 블랙홀 또는 `/dev/null`).

**소프트 거부(상태 코드 `421`):** 별칭 앞에 "!!"(느낌표 두 개)를 붙이면 이 주소로 이메일을 보내려는 발신자에게 소프트 오류 상태 코드인 `421`이 반환되고, 이메일은 거부 및 반송되기 전까지 최대 5일 동안 재시도됩니다.

**강제 거부(상태 코드 `550`):** 별칭 앞에 "!!!"(느낌표 세 개)를 접두사로 붙이면 이 주소로 보내려는 발신자에게 영구 오류 상태 코드 `550`이 반환되고 이메일은 거부되고 반송됩니다.

예를 들어, `alias@example.com`으로 전송되는 모든 이메일이 `user@gmail.com`로 흐르는 것을 멈추고 거부되어 반송되도록 하려면(예: 느낌표 세 개 사용):

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>이름/호스트/별칭</th>
<th class="text-center">TTL</th>
<th>유형</th>
<th>답변/값</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", 또는 공백</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=!!!alias:user@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
팁:
</strong>
<span>
전달되는 수신자 주소를 "nobody@forwardemail.net"으로 간단히 다시 작성할 수도 있습니다. 이렇게 하면 아래 예와 같이 nobody에게 전달됩니다.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>이름/호스트/별칭</th>
<th class="text-center">TTL</th>
<th>유형</th>
<th>답변/값</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", 또는 공백</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=!!!alias:nobody@forwardemail.net</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
팁:
</strong>
<span>
보안을 강화하려면 아래 예시처럼 ":user@gmail.com"(또는 ":nobody@forwardemail.net") 부분을 제거하고 "!!!alias"만 남겨둘 수도 있습니다.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>이름/호스트/별칭</th>
<th class="text-center">TTL</th>
<th>유형</th>
<th>답변/값</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", 또는 공백</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=!!!alias</code></td>
</tr>
</tbody>
</table>

### 여러 수신자에게 이메일을 전달할 수 있나요? {#can-i-forward-emails-to-multiple-recipients}

네, 물론입니다. <strong class="notranslate">TXT</strong> 레코드에 여러 수신자를 지정하기만 하면 됩니다.

예를 들어, `hello@example.com`으로 전송되는 이메일을 `user+a@gmail.com`과 `user+b@gmail.com`로 전달하려면 <strong class="notranslate">TXT</strong> 레코드는 다음과 같습니다.

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>이름/호스트/별칭</th>
<th class="text-center">TTL</th>
<th>유형</th>
<th>답변/값</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", 또는 공백</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

또는 다음과 같이 두 개의 별도 줄에 지정할 수도 있습니다.

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>이름/호스트/별칭</th>
<th class="text-center">TTL</th>
<th>유형</th>
<th>답변/값</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", 또는 공백</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=hello:user+a@gmail.com</code></td>
</tr>
<tr>
<td><em>"@", ".", 또는 공백</em></td>
<td class="text-center">3600</td>
<td class="notranslate">텍스트</td>
<td><code>forward-email=hello:user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

당신에게 달려 있습니다!

### 여러 개의 글로벌 포괄 수신자를 가질 수 있습니까? {#can-i-have-multiple-global-catch-all-recipients}

네, 가능합니다. <strong class="notranslate">TXT</strong> 레코드에 여러 개의 글로벌 포괄 수신자를 지정하기만 하면 됩니다.

예를 들어, `*@example.com`(별표는 와일드카드, 즉 포괄적인 것을 의미)으로 전송되는 모든 이메일을 `user+a@gmail.com`과 `user+b@gmail.com`로 전달하려는 경우 <strong class="notranslate">TXT</strong> 레코드는 다음과 같습니다.

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>이름/호스트/별칭</th>
<th class="text-center">TTL</th>
<th>유형</th>
<th>답변/값</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", 또는 공백</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

또는 다음과 같이 두 개의 별도 줄에 지정할 수도 있습니다.

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>이름/호스트/별칭</th>
<th class="text-center">TTL</th>
<th>유형</th>
<th>답변/값</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", 또는 공백</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+a@gmail.com</code></td>
</tr>
<tr>
<td><em>@, ".", 또는 공백</em></td>
<td class="text-center">3600</td>
<td class="notranslate">텍스트</td>
<td><code>forward-email=user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

당신에게 달려 있습니다!

### 별칭별로 전달할 수 있는 이메일 주소 수에 최대 제한이 있습니까? {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

네, 기본 제한은 10개입니다. 이는 도메인 이름에 별칭을 10개만 사용할 수 있다는 의미가 아닙니다. 원하는 만큼 별칭을 사용할 수 있습니다(무제한). 즉, 하나의 별칭을 최대 10개의 고유 이메일 주소로만 전달할 수 있습니다. `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (1~10)를 사용할 수 있으며, `hello@example.com`으로 전송된 이메일은 `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (1~10)으로 전달됩니다.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
팁:
</strong>
<span>
별칭당 수신자가 10명 이상 필요하신가요? 이메일을 보내주시면 계정 한도를 늘려드리겠습니다.
</span>
</div>

### 이메일을 재귀적으로 전달할 수 있나요? {#can-i-recursively-forward-emails}

네, 가능합니다. 하지만 최대 한도를 준수해야 합니다. `hello:linus@example.com`과 `linus:user@gmail.com`이 있는 경우, `hello@example.com`로 전송된 이메일은 `linus@example.com`과 `user@gmail.com`로 전달됩니다. 최대 한도를 초과하여 이메일을 재귀적으로 전달하려고 하면 오류가 발생합니다.

### 내 허락 없이 사람들이 내 이메일 전달을 등록하거나 등록 취소할 수 있습니까? {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

저희는 MX 및 <strong class="notranslate">TXT</strong> 레코드 확인을 사용합니다. 따라서 이 서비스의 MX 및 <strong class="notranslate">TXT</strong> 레코드를 추가하면 등록이 완료됩니다. 삭제하면 등록이 취소됩니다. 도메인 및 DNS 관리에 대한 소유권은 귀하에게 있으므로 다른 사람이 해당 정보에 접근할 수 있다면 문제가 될 수 있습니다.

### 어떻게 무료인가요? {#how-is-it-free}

Forward Email은 오픈 소스 개발, 효율적인 인프라, 서비스를 지원하는 선택적 유료 플랜을 결합하여 무료 계층을 제공합니다.

무료 계층은 다음에서 지원됩니다.

1. **오픈 소스 개발**: 당사의 코드베이스는 오픈 소스이므로 커뮤니티 기여와 투명한 운영이 가능합니다.

2. **효율적인 인프라**: 최소한의 리소스로 이메일 전달을 처리할 수 있도록 시스템을 최적화했습니다.

3. **유료 프리미엄 플랜**: SMTP 전송, IMAP 수신 또는 향상된 개인정보 보호 옵션과 같은 추가 기능이 필요한 사용자는 유료 플랜을 구독합니다.

4. **합리적인 사용 제한**: 무료 계층에는 남용을 방지하기 위한 공정 사용 정책이 있습니다.

> \[!NOTE]
> 저희는 기본 이메일 전달 기능은 무료로 제공하는 동시에, 더욱 전문적인 기능을 필요로 하는 사용자에게는 프리미엄 기능을 제공하고자 최선을 다하고 있습니다.

> \[!TIP]
> 저희 서비스가 유용하다고 생각되시면 지속적인 개발 및 유지 관리를 지원하는 유료 플랜으로 업그레이드해 보세요.

### 최대 이메일 크기 제한은 무엇입니까? {#what-is-the-max-email-size-limit}

기본적으로 콘텐츠, 헤더, 첨부 파일을 포함하여 50MB 크기 제한이 적용됩니다. Gmail이나 Outlook과 같은 서비스는 최대 25MB까지만 허용하며, 해당 업체의 주소로 전송할 때 제한을 초과하면 오류 메시지가 표시됩니다.

파일 크기 제한을 초과하면 적절한 응답 코드와 함께 오류가 반환됩니다.

### 이메일 로그를 저장하시나요? {#do-you-store-logs-of-emails}

아니요, [오류의 예외](#do-you-store-error-logs) 및 [아웃바운드 SMTP](#do-you-support-sending-email-with-smtp)을 사용하여 디스크에 쓰거나 로그를 저장하지 않습니다([개인정보 보호정책](/privacy) 참조).

모든 작업은 메모리와 [우리의 소스 코드는 GitHub에 있습니다](https://github.com/forwardemail)에서 수행됩니다.

### 오류 로그를 저장하시나요? {#do-you-store-error-logs}

**네. [내 계정 → 로그](/my-account/logs) 또는 [내 계정 → 도메인](/my-account/domains)에서 오류 로그에 액세스할 수 있습니다.**

2023년 2월부터 `4xx` 및 `5xx` SMTP 응답 코드에 대한 오류 로그를 7일 동안 저장합니다. 여기에는 SMTP 오류, 봉투 및 이메일 헤더가 포함됩니다(이메일 본문이나 첨부 파일은 저장하지 **않습니다**).

오류 로그를 통해 중요한 이메일 누락 여부를 확인하고 [귀하의 도메인](/my-account/domains)에 대한 스팸 오탐을 줄일 수 있습니다. 또한 오류 로그에는 웹훅 엔드포인트 응답이 포함되어 있으므로 [이메일 웹훅](#do-you-support-webhooks) 관련 문제를 디버깅하는 데에도 유용한 자료입니다.

연결이 일찍 종료되기 때문에(예: `RCPT TO` 및 `MAIL FROM` 명령을 전송할 수 있기 전) [속도 제한](#do-you-have-rate-limiting) 및 [그레이리스트](#do-you-have-a-greylist)에 대한 오류 로그에 액세스할 수 없습니다.

자세한 내용은 [개인정보 보호정책](/privacy)을 참조하세요.

### 내 이메일을 읽으시나요? {#do-you-read-my-emails}

아니요, 절대 아닙니다. [개인정보 보호정책](/privacy)을 참조하세요.

다른 많은 이메일 전달 서비스들은 이메일을 저장하고 잠재적으로 읽을 수도 있습니다. 전달된 이메일을 디스크 저장소에 저장할 필요가 없습니다. 그래서 저희는 이 모든 작업을 메모리 내에서 처리하는 최초의 오픈소스 솔루션을 설계했습니다.

저희는 귀하의 개인정보 보호 권리를 존중하며, 이를 엄격히 준수합니다. 투명성과 신뢰 구축을 위해 서버에 배포되는 코드는 [GitHub의 오픈소스 소프트웨어](https://github.com/forwardemail)입니다.

### 이 {#can-i-send-mail-as-in-gmail-with-this}}를 사용하여 Gmail에서 "메일 보내기"를 할 수 있나요?

네! 2018년 10월 2일부터 이 기능이 추가되었습니다. 위의 [Gmail을 사용하여 메일을 보내는 방법](#how-to-send-mail-as-using-gmail)을 참조하세요!

DNS 구성 <strong class="notranslate">TXT</strong> 레코드에서 Gmail에 대한 SPF 레코드도 설정해야 합니다.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
중요:
</strong>
<span>
Gmail(예: 다른 주소에서 메일 보내기) 또는 G Suite를 사용하는 경우, SPF <strong class="notranslate">TXT</strong> 레코드에 <code>include:_spf.google.com</code>을 추가해야 합니다. 예:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

### 이 {#can-i-send-mail-as-in-outlook-with-this}}을 사용하여 Outlook에서 "메일 보내기"를 할 수 있나요?

네! 2018년 10월 2일부터 이 기능이 추가되었습니다. 아래 Microsoft 링크 두 개를 확인해 보세요.

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

DNS 구성 <strong class="notranslate">TXT</strong> 레코드에서 Outlook에 대한 SPF 레코드도 설정해야 합니다.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
중요:
</strong>
<span>
Microsoft Outlook 또는 Live.com을 사용하는 경우 SPF <strong class="notranslate">TXT</strong> 레코드에 <code>include:spf.protection.outlook.com</code>을 추가해야 합니다. 예:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
</span>
</div>

### 이 {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}}을 사용하여 Apple Mail 및 iCloud Mail에서 "메일 보내기"를 할 수 있나요?

iCloud+ 구독자라면 사용자 지정 도메인을 사용할 수 있습니다. [저희 서비스는 Apple Mail과도 호환됩니다.](#apple-mail).

자세한 내용은 <https://support.apple.com/en-us/102540>>을 참조하세요.

### 이 {#can-i-forward-unlimited-emails-with-this}}로 무제한으로 이메일을 전달할 수 있나요?

네, 하지만 "비교적 알려지지 않은" 발신자는 호스트 이름 또는 IP당 시간당 100개의 연결로 속도가 제한됩니다. 위의 [속도 제한](#do-you-have-rate-limiting) 및 [그레이리스트](#do-you-have-a-greylist) 섹션을 참조하세요.

"비교적 알려지지 않음"이란 [허용 목록](#do-you-have-an-allowlist)에 나타나지 않는 발신자를 의미합니다.

이 제한을 초과하면 발신자 메일 서버에 나중에 다시 시도하라고 알리는 421 응답 코드를 보냅니다.

### 하나의 가격으로 무제한 도메인을 제공하시나요? {#do-you-offer-unlimited-domains-for-one-price}

네. 어떤 요금제를 사용하시든 모든 도메인에 적용되는 월별 요금을 한 번만 지불하시면 됩니다.

### 어떤 결제 방법을 허용하시나요? {#which-payment-methods-do-you-accept}

Forward Email에서는 다음과 같은 일회성 또는 월별/분기별/연간 결제 방법을 허용합니다.

1. **신용/직불 카드/은행 송금**: Visa, Mastercard, American Express, Discover, JCB, Diners Club 등
2. **PayPal**: PayPal 계정을 연결하여 간편하게 결제하세요.
3. **암호화폐**: Ethereum, Polygon, Solana 네트워크에서 Stripe의 스테이블코인 결제를 지원합니다.

> \[!NOTE]
> 당사 서버에는 제한된 결제 정보가 저장되며, 여기에는 결제 식별자와 [줄무늬](https://stripe.com/global) 및 [페이팔](https://www.paypal.com) 거래, 고객, 구독 및 결제 ID에 대한 참조만 포함됩니다.

> \[!TIP]
> 개인정보 보호를 극대화하려면 암호화폐 결제를 고려해 보세요.

모든 결제는 Stripe 또는 PayPal을 통해 안전하게 처리됩니다. 고객님의 결제 정보는 당사 서버에 저장되지 않습니다.

## 추가 리소스 {#additional-resources}

> \[!TIP]
> 아래 게시글은 새로운 가이드, 팁, 기술 정보로 정기적으로 업데이트됩니다. 최신 콘텐츠를 자주 확인해 주세요.

* [사례 연구 및 개발자 문서](/blog/docs)
* [자원](/resources)
* [가이드](/guides)

[gmail-2fa]: 임시 자리 표시자 0

[클라우드플레어-DNS]: https://blog.cloudflare.com/announcing-1111/