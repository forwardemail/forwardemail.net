# 자주 묻는 질문 {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="Forward Email 자주 묻는 질문" class="rounded-lg" />


## 목차 {#table-of-contents}

* [빠른 시작](#quick-start)
* [소개](#introduction)
  * [Forward Email이란 무엇인가요](#what-is-forward-email)
  * [누가 Forward Email을 사용하나요](#who-uses-forward-email)
  * [Forward Email의 역사](#what-is-forward-emails-history)
  * [이 서비스는 얼마나 빠른가요](#how-fast-is-this-service)
* [이메일 클라이언트](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [eM Client](#em-client)
  * [모바일 기기](#mobile-devices)
  * [Sendmail SMTP 릴레이 구성](#sendmail-smtp-relay-configuration)
  * [Exim4 SMTP 릴레이 구성](#exim4-smtp-relay-configuration)
  * [msmtp SMTP 클라이언트 구성](#msmtp-smtp-client-configuration)
  * [명령줄 이메일 클라이언트](#command-line-email-clients)
  * [Windows 이메일 구성](#windows-email-configuration)
  * [Postfix SMTP 릴레이 구성](#postfix-smtp-relay-configuration)
  * [Gmail을 사용하여 메일 보내기 설정 방법](#how-to-send-mail-as-using-gmail)
  * [Gmail을 사용한 메일 보내기 구식 무료 가이드란 무엇인가요](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [고급 Gmail 라우팅 구성](#advanced-gmail-routing-configuration)
  * [고급 Outlook 라우팅 구성](#advanced-outlook-routing-configuration)
* [문제 해결](#troubleshooting)
  * [테스트 이메일을 받지 못하는 이유는 무엇인가요](#why-am-i-not-receiving-my-test-emails)
  * [Forward Email과 함께 이메일 클라이언트를 구성하는 방법](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [내 이메일이 스팸 및 정크로 가는 이유와 도메인 평판 확인 방법](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [스팸 이메일을 받으면 어떻게 해야 하나요](#what-should-i-do-if-i-receive-spam-emails)
  * [Gmail에서 나에게 보낸 테스트 이메일이 "의심스러움"으로 표시되는 이유](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Gmail에서 via forwardemail dot net 제거할 수 있나요](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [데이터 관리](#data-management)
  * [서버 위치는 어디인가요](#where-are-your-servers-located)
  * [메일박스 내보내기 및 백업 방법](#how-do-i-export-and-backup-my-mailbox)
  * [기존 메일박스 가져오기 및 마이그레이션 방법](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [자체 S3 호환 스토리지를 백업에 사용하는 방법](#how-do-i-use-my-own-s3-compatible-storage-for-backups)
  * [SQLite 백업을 EML 파일로 변환하는 방법](#how-do-i-convert-sqlite-backups-to-eml-files)
  * [셀프 호스팅을 지원하나요](#do-you-support-self-hosting)
* [이메일 구성](#email-configuration)
  * [이메일 전달 설정 시작 방법](#how-do-i-get-started-and-set-up-email-forwarding)
  * [고급 전달을 위해 여러 MX 교환기 및 서버를 사용할 수 있나요](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [부재중 자동응답기(휴가 응답기) 설정 방법](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Forward Email용 SPF 설정 방법](#how-do-i-set-up-spf-for-forward-email)
  * [Forward Email용 DKIM 설정 방법](#how-do-i-set-up-dkim-for-forward-email)
  * [Forward Email용 DMARC 설정 방법](#how-do-i-set-up-dmarc-for-forward-email)
  * [DMARC 보고서 보는 방법](#how-do-i-view-dmarc-reports)
  * [연락처 연결 및 구성 방법](#how-do-i-connect-and-configure-my-contacts)
  * [캘린더 연결 및 구성 방법](#how-do-i-connect-and-configure-my-calendars)
  * [캘린더 추가 및 기존 캘린더 관리 방법](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [작업 및 알림 연결 및 구성 방법](#how-do-i-connect-and-configure-tasks-and-reminders)
  * [macOS 알림에서 작업을 생성할 수 없는 이유](#why-cant-i-create-tasks-in-macos-reminders)
  * [Android에서 Tasks.org 설정 방법](#how-do-i-set-up-tasksorg-on-android)
  * [Forward Email용 SRS 설정 방법](#how-do-i-set-up-srs-for-forward-email)
  * [Forward Email용 MTA-STS 설정 방법](#how-do-i-set-up-mta-sts-for-forward-email)
  * [이메일 주소에 프로필 사진 추가 방법](#how-do-i-add-a-profile-picture-to-my-email-address)
* [고급 기능](#advanced-features)
  * [마케팅 관련 이메일용 뉴스레터 또는 메일링 리스트를 지원하나요](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [API를 통한 이메일 발송을 지원하나요](#do-you-support-sending-email-with-api)
  * [IMAP을 통한 이메일 수신을 지원하나요](#do-you-support-receiving-email-with-imap)
  * [POP3를 지원하나요](#do-you-support-pop3)
  * [캘린더(CalDAV)를 지원하나요](#do-you-support-calendars-caldav)
  * [작업 및 알림(CalDAV VTODO)를 지원하나요](#do-you-support-tasks-and-reminders-caldav-vtodo)
  * [연락처(CardDAV)를 지원하나요](#do-you-support-contacts-carddav)
  * [SMTP를 통한 이메일 발송을 지원하나요](#do-you-support-sending-email-with-smtp)
  * [OpenPGP/MIME, 종단 간 암호화("E2EE"), Web Key Directory("WKD")를 지원하나요](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [S/MIME 암호화를 지원하나요](#do-you-support-smime-encryption)
  * [Sieve 이메일 필터링을 지원하나요](#do-you-support-sieve-email-filtering)
  * [MTA-STS를 지원하나요](#do-you-support-mta-sts)
  * [패스키 및 WebAuthn을 지원하나요](#do-you-support-passkeys-and-webauthn)
  * [이메일 모범 사례를 지원하나요](#do-you-support-email-best-practices)
  * [바운스 웹훅을 지원하나요](#do-you-support-bounce-webhooks)
  * [웹훅을 지원하나요](#do-you-support-webhooks)
  * [정규 표현식 또는 regex를 지원하나요](#do-you-support-regular-expressions-or-regex)
  * [발신 SMTP 제한은 어떻게 되나요](#what-are-your-outbound-smtp-limits)
  * [SMTP 활성화에 승인이 필요한가요](#do-i-need-approval-to-enable-smtp)
  * [SMTP 서버 구성 설정은 어떻게 되나요](#what-are-your-smtp-server-configuration-settings)
  * [IMAP 서버 구성 설정은 어떻게 되나요](#what-are-your-imap-server-configuration-settings)
  * [POP3 서버 구성 설정은 어떻게 되나요](#what-are-your-pop3-server-configuration-settings)
  * [도메인용 이메일 자동 검색 설정 방법](#how-do-i-set-up-email-autodiscovery-for-my-domain)
* [보안](#security-1)
  * [고급 서버 강화 기술](#advanced-server-hardening-techniques)
  * [SOC 2 또는 ISO 27001 인증이 있나요](#do-you-have-soc-2-or-iso-27001-certifications)
  * [이메일 전달에 TLS 암호화를 사용하나요](#do-you-use-tls-encryption-for-email-forwarding)
  * [이메일 인증 헤더를 보존하나요](#do-you-preserve-email-authentication-headers)
  * [원본 이메일 헤더를 보존하고 스푸핑을 방지하나요](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [스팸 및 악용으로부터 어떻게 보호하나요](#how-do-you-protect-against-spam-and-abuse)
  * [이메일 내용을 디스크에 저장하나요](#do-you-store-email-content-on-disk)
  * [시스템 충돌 시 이메일 내용이 노출될 수 있나요](#can-email-content-be-exposed-during-system-crashes)
  * [누가 이메일 인프라에 접근할 수 있나요](#who-has-access-to-your-email-infrastructure)
  * [어떤 인프라 제공업체를 사용하나요](#what-infrastructure-providers-do-you-use)
  * [데이터 처리 계약서(DPA)를 제공하나요](#do-you-offer-a-data-processing-agreement-dpa)
  * [데이터 유출 알림을 어떻게 처리하나요](#how-do-you-handle-data-breach-notifications)
  * [테스트 환경을 제공하나요](#do-you-offer-a-test-environment)
  * [모니터링 및 경고 도구를 제공하나요](#do-you-provide-monitoring-and-alerting-tools)
  * [고가용성을 어떻게 보장하나요](#how-do-you-ensure-high-availability)
  * [국방수권법(NDAA) 섹션 889를 준수하나요](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [시스템 및 기술 세부사항](#system-and-technical-details)
  * [이메일과 그 내용을 저장하나요](#do-you-store-emails-and-their-contents)
  * [이메일 전달 시스템은 어떻게 작동하나요](#how-does-your-email-forwarding-system-work)
  * [이메일 전달을 위해 이메일을 어떻게 처리하나요](#how-do-you-process-an-email-for-forwarding)
  * [이메일 전달 문제를 어떻게 처리하나요](#how-do-you-handle-email-delivery-issues)
  * [IP 주소가 차단되면 어떻게 처리하나요](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [포스트마스터 주소란 무엇인가요](#what-are-postmaster-addresses)
  * [회신 금지 주소란 무엇인가요](#what-are-no-reply-addresses)
  * [서버의 IP 주소는 무엇인가요](#what-are-your-servers-ip-addresses)
  * [허용 목록이 있나요](#do-you-have-an-allowlist)
  * [기본적으로 허용된 도메인 이름 확장자는 무엇인가요](#what-domain-name-extensions-are-allowlisted-by-default)
  * [허용 목록 기준은 무엇인가요](#what-is-your-allowlist-criteria)
  * [무료로 사용할 수 있는 도메인 이름 확장자는 무엇인가요](#what-domain-name-extensions-can-be-used-for-free)
  * [그레이리스트가 있나요](#do-you-have-a-greylist)
  * [거부 목록이 있나요](#do-you-have-a-denylist)
  * [속도 제한이 있나요](#do-you-have-rate-limiting)
  * [백스캐터를 어떻게 방지하나요](#how-do-you-protect-against-backscatter)
  * [알려진 MAIL FROM 스패머로부터의 바운스 방지](#prevent-bounces-from-known-mail-from-spammers)
  * [불필요한 바운스를 방지하여 백스캐터 보호](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [이메일 지문을 어떻게 결정하나요](#how-do-you-determine-an-email-fingerprint)
  * [포트 25 이외의 포트로 이메일을 전달할 수 있나요 (예: ISP가 포트 25를 차단한 경우)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Gmail 별칭에 + 기호를 지원하나요](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [서브도메인을 지원하나요](#does-it-support-sub-domains)
  * [이메일 헤더를 전달하나요](#does-this-forward-my-emails-headers)
  * [충분히 테스트되었나요](#is-this-well-tested)
  * [SMTP 응답 메시지 및 코드를 전달하나요](#do-you-pass-along-smtp-response-messages-and-codes)
  * [스패머를 방지하고 좋은 이메일 전달 평판을 유지하는 방법](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [도메인 이름에 대해 DNS 조회를 수행하는 방법](#how-do-you-perform-dns-lookups-on-domain-names)
* [계정 및 결제](#account-and-billing)
  * [유료 플랜에 환불 보증이 있나요](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [플랜 변경 시 차액을 비례 환불하나요](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [이 이메일 전달 서비스를 "대체" 또는 "백업" MX 서버로만 사용할 수 있나요](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [특정 별칭을 비활성화할 수 있나요](#can-i-disable-specific-aliases)
  * [이메일을 여러 수신자에게 전달할 수 있나요](#can-i-forward-emails-to-multiple-recipients)
  * [여러 글로벌 캐치올 수신자를 가질 수 있나요](#can-i-have-multiple-global-catch-all-recipients)
  * [별칭당 전달할 수 있는 이메일 주소 수에 최대 한도가 있나요](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [이메일을 재귀적으로 전달할 수 있나요](#can-i-recursively-forward-emails)
  * [내 허락 없이 내 이메일 전달을 등록하거나 등록 해제할 수 있나요](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [어떻게 무료인가요](#how-is-it-free)
  * [최대 이메일 크기 제한은 무엇인가요](#what-is-the-max-email-size-limit)
  * [이메일 로그를 저장하나요](#do-you-store-logs-of-emails)
  * [오류 로그를 저장하나요](#do-you-store-error-logs)
  * [내 이메일을 읽나요](#do-you-read-my-emails)
  * [이 서비스로 Gmail에서 "메일 보내기"를 할 수 있나요](#can-i-send-mail-as-in-gmail-with-this)
  * [이 서비스로 Outlook에서 "메일 보내기"를 할 수 있나요](#can-i-send-mail-as-in-outlook-with-this)
  * [이 서비스로 Apple Mail 및 iCloud Mail에서 "메일 보내기"를 할 수 있나요](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [무제한 이메일 전달이 가능한가요](#can-i-forward-unlimited-emails-with-this)
  * [한 가격에 무제한 도메인을 제공하나요](#do-you-offer-unlimited-domains-for-one-price)
  * [어떤 결제 수단을 받나요](#which-payment-methods-do-you-accept)
* [추가 자료](#additional-resources)
## 빠른 시작 {#quick-start}

Forward Email을 시작하려면:

1. **계정 생성** [forwardemail.net/register](https://forwardemail.net/register)에서

2. **도메인 추가 및 인증** [내 계정 → 도메인](/my-account/domains)에서

3. **이메일 별칭/메일박스 추가 및 구성** [내 계정 → 도메인](/my-account/domains) → 별칭에서

4. **설정 테스트** 새 별칭 중 하나로 이메일을 보내 확인

> \[!TIP]
> DNS 변경 사항은 전 세계에 전파되는 데 최대 24-48시간이 걸릴 수 있지만, 보통 훨씬 빨리 적용됩니다.

> \[!IMPORTANT]
> 향상된 전달 가능성을 위해 [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email), [DMARC](#how-do-i-set-up-dmarc-for-forward-email) 레코드 설정을 권장합니다.


## 소개 {#introduction}

### Forward Email이란? {#what-is-forward-email}

> \[!NOTE]
> Forward Email은 전문적인 이메일 주소를 원하지만 전체 이메일 호스팅 솔루션의 비용과 유지 관리를 원하지 않는 개인, 소규모 비즈니스, 개발자에게 완벽합니다.

Forward Email은 **완전한 기능을 갖춘 이메일 서비스 제공자**이자 **맞춤 도메인 이름용 이메일 호스팅 제공자**입니다.

유일한 무료 오픈 소스 서비스로, 자체 이메일 서버를 설정하고 유지하는 복잡함 없이 맞춤 도메인 이메일 주소를 사용할 수 있습니다.

우리 서비스는 맞춤 도메인으로 보내진 이메일을 기존 이메일 계정으로 전달하며, 전용 이메일 호스팅 제공자로도 사용할 수 있습니다.

Forward Email의 주요 기능:

* **맞춤 도메인 이메일**: 자신의 도메인 이름으로 전문적인 이메일 주소 사용
* **무료 요금제**: 기본 이메일 전달 무료 제공
* **향상된 개인정보 보호**: 이메일을 읽거나 데이터를 판매하지 않음
* **오픈 소스**: 전체 코드베이스가 GitHub에 공개됨
* **SMTP, IMAP, POP3 지원**: 완전한 이메일 송수신 기능
* **종단 간 암호화**: OpenPGP/MIME 지원
* **맞춤 캐치올 별칭**: 무제한 이메일 별칭 생성 가능

[우리의 이메일 비교 페이지](/blog/best-email-service)에서 56개 이상의 다른 이메일 서비스 제공자와 비교할 수 있습니다.

> \[!TIP]
> 무료 [기술 백서](/technical-whitepaper.pdf)를 읽어 Forward Email에 대해 더 알아보세요.

### Forward Email 사용자 {#who-uses-forward-email}

우리는 500,000개 이상의 도메인에 이메일 호스팅 및 이메일 전달 서비스를 제공하며, 다음과 같은 주목할 만한 사용자가 있습니다:

| 고객                                    | 사례 연구                                                                                               |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 미국 해군사관학교                       | [:page_facing_up: 사례 연구](/blog/docs/federal-government-email-service-section-889-compliant)         |
| 캐노니컬                                | [:page_facing_up: 사례 연구](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| 넷플릭스 게임                          |                                                                                                          |
| 리눅스 재단                            | [:page_facing_up: 사례 연구](/blog/docs/linux-foundation-email-enterprise-case-study)                   |
| PHP 재단                               |                                                                                                          |
| 폭스 뉴스 라디오                       |                                                                                                          |
| 디즈니 광고 판매                      |                                                                                                          |
| jQuery                                 | [:page_facing_up: 사례 연구](/blog/docs/linux-foundation-email-enterprise-case-study)                   |
| LineageOS                             |                                                                                                          |
| 우분투                                 | [:page_facing_up: 사례 연구](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| 쿠분투                                 | [:page_facing_up: 사례 연구](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| 루분투                                 | [:page_facing_up: 사례 연구](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| 케임브리지 대학교                     | [:page_facing_up: 사례 연구](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| 메릴랜드 대학교                       | [:page_facing_up: 사례 연구](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| 워싱턴 대학교                         | [:page_facing_up: 사례 연구](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| 터프츠 대학교                         | [:page_facing_up: 사례 연구](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| 스와스모어 칼리지                   | [:page_facing_up: 사례 연구](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| 남호주 정부                         |                                                                                                          |
| 도미니카 공화국 정부                 |                                                                                                          |
| Fly<span>.</span>io                   |                                                                                                          |
| RCD 호텔                             |                                                                                                          |
| Isaac Z. Schlueter (npm)             | [:page_facing_up: 사례 연구](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |                                                                                                          |
### Forward Email의 역사란? {#what-is-forward-emails-history}

Forward Email에 대해 더 알고 싶다면 [우리의 소개 페이지](/about)를 방문하세요.

### 이 서비스는 얼마나 빠른가요? {#how-fast-is-this-service}

> \[!NOTE]
> 저희 시스템은 속도와 신뢰성을 위해 설계되었으며, 여러 중복 서버를 통해 이메일이 신속하게 전달되도록 보장합니다.

Forward Email은 메시지를 거의 지연 없이, 일반적으로 수신 후 몇 초 내에 전달합니다.

성능 지표:

* **평균 전달 시간**: 수신 후 전달까지 5-10초 미만 ([우리의 Time to Inbox "TTI" 모니터링 페이지](/tti) 참조)
* **가동 시간**: 99.9% 이상의 서비스 가용성
* **글로벌 인프라**: 최적의 라우팅을 위한 전략적 서버 배치
* **자동 확장**: 이메일 피크 기간 동안 시스템 자동 확장

저희는 지연 큐에 의존하는 다른 제공업체와 달리 실시간으로 운영합니다.

디스크에 기록하거나 로그를 저장하지 않습니다 – [오류 로그 저장 예외](#do-you-store-error-logs) 및 [발신 SMTP](#do-you-support-sending-email-with-smtp)만 해당됩니다 (자세한 내용은 [개인정보 처리방침](/privacy) 참조).

모든 처리는 메모리 내에서 이루어지며 [소스 코드는 GitHub에 공개되어 있습니다](https://github.com/forwardemail).


## 이메일 클라이언트 {#email-clients}

### Thunderbird {#thunderbird}

1. Forward Email 대시보드에서 새 별칭을 만들고 비밀번호를 생성하세요
2. Thunderbird를 열고 **편집 → 계정 설정 → 계정 작업 → 메일 계정 추가**로 이동하세요
3. 이름, Forward Email 주소, 비밀번호를 입력하세요
4. **수동 구성**을 클릭하고 다음을 입력하세요:
   * 수신: IMAP, `imap.forwardemail.net`, 포트 993, SSL/TLS
   * 발신: SMTP, `smtp.forwardemail.net`, 포트 465, SSL/TLS (권장; 포트 587 STARTTLS도 지원)
5. **완료**를 클릭하세요

### Microsoft Outlook {#microsoft-outlook}

1. Forward Email 대시보드에서 새 별칭을 만들고 비밀번호를 생성하세요
2. **파일 → 계정 추가**로 이동하세요
3. Forward Email 주소를 입력하고 **연결**을 클릭하세요
4. **고급 옵션**을 선택하고 **내 계정을 수동으로 설정**을 선택하세요
5. **IMAP**을 선택하고 다음을 입력하세요:
   * 수신: `imap.forwardemail.net`, 포트 993, SSL
   * 발신: `smtp.forwardemail.net`, 포트 465, SSL/TLS (권장; 포트 587 STARTTLS도 지원)
   * 사용자 이름: 전체 이메일 주소
   * 비밀번호: 생성한 비밀번호
6. **연결**을 클릭하세요

### Apple Mail {#apple-mail}

1. Forward Email 대시보드에서 새 별칭을 만들고 비밀번호를 생성하세요
2. **메일 → 환경설정 → 계정 → +**로 이동하세요
3. **기타 메일 계정**을 선택하세요
4. 이름, Forward Email 주소, 비밀번호를 입력하세요
5. 서버 설정에 다음을 입력하세요:
   * 수신: `imap.forwardemail.net`
   * 발신: `smtp.forwardemail.net`
   * 사용자 이름: 전체 이메일 주소
   * 비밀번호: 생성한 비밀번호
6. **로그인**을 클릭하세요

### eM Client {#em-client}

1. Forward Email 대시보드에서 새 별칭을 만들고 비밀번호를 생성하세요
2. eM Client를 열고 **메뉴 → 계정 → + 계정 추가**로 이동하세요
3. **메일**을 클릭한 후 **기타**를 선택하세요
4. Forward Email 주소를 입력하고 **다음**을 클릭하세요
5. 다음 서버 설정을 입력하세요:
   * **수신 서버**: `imap.forwardemail.net`
   * **발신 서버**: `smtp.forwardemail.net`
6. 수신 및 발신 서버 모두에 대해 전체 이메일 주소를 **사용자 이름**으로, 생성한 비밀번호를 **비밀번호**로 입력하세요.
7. eM Client가 연결을 테스트합니다. 성공하면 **다음**을 클릭하세요.
8. 이름을 입력하고 계정 이름을 선택하세요.
9. **완료**를 클릭하세요.

### 모바일 기기 {#mobile-devices}

iOS의 경우:

1. **설정 → 메일 → 계정 → 계정 추가 → 기타**로 이동하세요
2. **메일 계정 추가**를 탭하고 정보를 입력하세요
3. 서버 설정은 위의 IMAP 및 SMTP 설정과 동일하게 사용하세요

Android의 경우:

1. **설정 → 계정 → 계정 추가 → 개인(IMAP)**으로 이동하세요
2. Forward Email 주소와 비밀번호를 입력하세요
3. 서버 설정은 위의 IMAP 및 SMTP 설정과 동일하게 사용하세요

### Sendmail SMTP 릴레이 구성 {#sendmail-smtp-relay-configuration}

Sendmail을 Forward Email의 SMTP 서버를 통해 이메일을 릴레이하도록 구성할 수 있습니다. 이는 Sendmail에 의존하는 레거시 시스템이나 애플리케이션에서 흔히 사용하는 설정입니다.
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">예상 설정 시간:</strong>
  <span>20분 미만</span>
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

#### 구성 {#configuration}

1. 일반적으로 `/etc/mail/sendmail.mc`에 위치한 `sendmail.mc` 파일을 편집합니다:

   ```bash
   sudo nano /etc/mail/sendmail.mc
   ```

2. 스마트 호스트와 인증을 정의하기 위해 다음 줄을 추가합니다:

   ```
   define(`SMART_HOST', `smtp.forwardemail.net')dnl
   define(`RELAY_MAILER_ARGS', `TCP $h 465')dnl
   define(`confAUTH_MECHANISMS', `EXTERNAL GSSAPI DIGEST-MD5 CRAM-MD5 LOGIN PLAIN')dnl
   FEATURE(`authinfo',`hash -o /etc/mail/authinfo.db')dnl
   ```

3. 인증 파일 `/etc/mail/authinfo`를 생성합니다:

   ```bash
   sudo nano /etc/mail/authinfo
   ```

4. `authinfo` 파일에 Forward Email 자격 증명을 추가합니다:

   ```
   AuthInfo:smtp.forwardemail.net "U:your-alias@yourdomain.com" "P:your-generated-password" "M:PLAIN"
   ```

5. 인증 데이터베이스를 생성하고 파일 권한을 설정합니다:

   ```bash
   sudo makemap hash /etc/mail/authinfo < /etc/mail/authinfo
   sudo chmod 600 /etc/mail/authinfo /etc/mail/authinfo.db
   ```

6. Sendmail 구성을 다시 빌드하고 서비스를 재시작합니다:

   ```bash
   sudo make -C /etc/mail
   sudo systemctl restart sendmail
   ```

#### 테스트 {#testing}

구성을 확인하기 위해 테스트 이메일을 보냅니다:

```bash
echo "Test email from Sendmail" | mail -s "Sendmail Test" recipient@example.com
```

### Exim4 SMTP 릴레이 구성 {#exim4-smtp-relay-configuration}

Exim4는 Debian 기반 시스템에서 인기 있는 MTA입니다. Forward Email을 스마트호스트로 사용하도록 구성할 수 있습니다.

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

#### 구성 {#configuration-1}

1. Exim4 구성 도구를 실행합니다:

   ```bash
   sudo dpkg-reconfigure exim4-config
   ```

2. 다음 옵션을 선택합니다:
   * **메일 구성의 일반 유형:** 스마트호스트를 통해 발송; SMTP 또는 fetchmail로 수신
   * **시스템 메일 이름:** your.hostname
   * **수신 SMTP 연결을 위한 IP 주소:** 127.0.0.1 ; ::1
   * **메일을 수락하는 기타 대상:** (비워둠)
   * **메일 릴레이 대상 도메인:** (비워둠)
   * **발신 스마트호스트의 IP 주소 또는 호스트 이름:** smtp.forwardemail.net::465
   * **발신 메일에서 로컬 메일 이름 숨기기?** 아니요
   * **DNS 쿼리 수 최소화 (Dial-on-Demand)?** 아니요
   * **로컬 메일 배달 방법:** /var/mail/의 Mbox 형식
   * **구성을 작은 파일로 분할?** 아니요

3. 자격 증명을 추가하기 위해 `passwd.client` 파일을 편집합니다:

   ```bash
   sudo nano /etc/exim4/passwd.client
   ```

4. 다음 줄을 추가합니다:

   ```
   smtp.forwardemail.net:your-alias@yourdomain.com:your-generated-password
   ```

5. 구성을 업데이트하고 Exim4를 재시작합니다:

   ```bash
   sudo update-exim4.conf
   sudo systemctl restart exim4
   ```

#### 테스트 {#testing-1}

테스트 이메일을 보냅니다:

```bash
echo "Test from Exim4" | mail -s "Exim4 Test" recipient@example.com
```

### msmtp SMTP 클라이언트 구성 {#msmtp-smtp-client-configuration}

msmtp는 스크립트나 명령줄 애플리케이션에서 이메일을 보내는 데 유용한 경량 SMTP 클라이언트입니다.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">예상 설정 시간:</strong>
  <span>10분 미만</span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    중요:
  </strong>
  <span>
    이 기능은 SMTP 액세스가 활성화된 유료 플랜이 필요합니다.
  </span>
</div>

#### 구성 {#configuration-2}

1. `~/.msmtprc`에 msmtp 구성 파일을 생성하거나 편집합니다:

   ```bash
   nano ~/.msmtprc
   ```

2. 다음 구성을 추가합니다:

   ```
   defaults
   auth           on
   tls            on
   tls_trust_file /etc/ssl/certs/ca-certificates.crt
   logfile        ~/.msmtp.log

   account        forwardemail
   host           smtp.forwardemail.net
   port           465
   tls_starttls   off
   from           your-alias@yourdomain.com
   user           your-alias@yourdomain.com
   password       your-generated-password

   account default : forwardemail
   ```

3. 구성 파일에 올바른 권한을 설정합니다:

   ```bash
   chmod 600 ~/.msmtprc
   ```

#### 테스트 {#testing-2}

테스트 이메일을 보냅니다:

```bash
echo "This is a test email from msmtp" | msmtp -a default recipient@example.com
```

### 커맨드라인 이메일 클라이언트 {#command-line-email-clients}

[Mutt](https://gitlab.com/muttmua/mutt), [NeoMutt](https://neomutt.org), [Alpine](https://alpine.x10.mx/alpine/release/) 같은 인기 있는 커맨드라인 이메일 클라이언트는 Forward Email의 SMTP 서버를 사용하도록 구성할 수 있습니다. 구성은 `msmtp` 설정과 유사하며, 각 클라이언트의 구성 파일(`.muttrc`, `.neomuttrc`, 또는 `.pinerc`)에 SMTP 서버 정보와 자격 증명을 입력하면 됩니다.

### 윈도우 이메일 구성 {#windows-email-configuration}

윈도우 사용자는 Forward Email 계정에서 제공하는 IMAP 및 SMTP 설정을 사용하여 **Microsoft Outlook** 및 **eM Client** 같은 인기 이메일 클라이언트를 구성할 수 있습니다. 커맨드라인 또는 스크립트 용도로는 PowerShell의 `Send-MailMessage` cmdlet(비록 구식으로 간주됨)이나 [E-MailRelay](https://github.com/graeme-walker/emailrelay) 같은 경량 SMTP 릴레이 도구를 사용할 수 있습니다.

### Postfix SMTP 릴레이 구성 {#postfix-smtp-relay-configuration}

Postfix를 구성하여 Forward Email의 SMTP 서버를 통해 이메일을 릴레이할 수 있습니다. 이는 이메일을 보내야 하는 서버 애플리케이션에 유용합니다.

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
    이 기능은 SMTP 액세스가 활성화된 유료 플랜이 필요합니다.
  </span>
</div>

#### 설치 {#installation}

1. 서버에 Postfix를 설치합니다:

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. 설치 중 구성 유형을 묻는 질문에 "Internet Site"를 선택합니다.

#### 구성 {#configuration-3}

1. Postfix 메인 구성 파일을 편집합니다:

```bash
sudo nano /etc/postfix/main.cf
```

2. 다음 설정을 추가하거나 수정합니다:

```
# SMTP 릴레이 구성
relayhost = [smtp.forwardemail.net]:465
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. SASL 비밀번호 파일을 생성합니다:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Forward Email 자격 증명을 추가합니다:

```
[smtp.forwardemail.net]:465 your-alias@yourdomain.com:your-generated-password
```

5. 비밀번호 파일을 보호하고 해시합니다:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Postfix를 재시작합니다:

```bash
sudo systemctl restart postfix
```

#### 테스트 {#testing-3}

테스트 이메일을 보내 구성 상태를 확인합니다:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

### Gmail을 사용하여 메일 보내기 방법 {#how-to-send-mail-as-using-gmail}
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
    위의 <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">시작 방법 및 이메일 전달 설정</a> 지침을 따르셨다면, 아래 내용을 계속 읽으실 수 있습니다.
  </span>
</div>

<div id="send-mail-as-content">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    중요:
  </strong>
  <span>
    반드시 <a href="/terms" class="alert-link" target="_blank">이용 약관</a>, <a href="/privacy" class="alert-link" target="_blank">개인정보 처리방침</a>, 그리고 <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">발신 SMTP 제한</a>을 읽었는지 확인해 주세요 – 사용하시는 것은 동의 및 인정을 의미합니다.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    중요:
  </strong>
  <span>
    개발자이신 경우, <a class="alert-link" href="/email-api#outbound-emails" target="_blank">이메일 API 문서</a>를 참조하세요.
  </span>
</div>

1. <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 설정 <i class="fa fa-angle-right"></i> 발신 SMTP 구성으로 이동하여 설정 지침을 따르세요

2. <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 별칭에서 도메인에 대한 새 별칭을 만드세요 (예: <code><hello@example.com></code>)

3. 새로 생성한 별칭 옆에 있는 <strong class="text-success"><i class="fa fa-key"></i> 비밀번호 생성</strong>을 클릭하세요. 클립보드에 복사하고 화면에 표시된 생성된 비밀번호를 안전하게 보관하세요.

4. [Gmail](https://gmail.com)로 이동하여 [설정 <i class="fa fa-angle-right"></i> 계정 및 가져오기 <i class="fa fa-angle-right"></i> 메일 보내기](https://mail.google.com/mail/u/0/#settings/accounts)에서 "다른 이메일 주소 추가"를 클릭하세요

5. "이름" 입력 요청 시, 이메일 발신자 이름으로 표시할 이름을 입력하세요 (예: "Linus Torvalds").

6. "이메일 주소" 입력 요청 시, <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 별칭에서 생성한 전체 이메일 주소를 입력하세요 (예: <code><hello@example.com></code>)

7. "별칭으로 취급" 선택을 해제하세요

8. "다음 단계"를 클릭하여 진행하세요

9. "SMTP 서버" 입력 요청 시, <code>smtp.forwardemail.net</code>을 입력하고 포트를 <code>465</code>로 변경하세요

10. "사용자 이름" 입력 요청 시, <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 별칭에서 생성한 전체 이메일 주소를 입력하세요 (예: <code><hello@example.com></code>)

11. "비밀번호" 입력 요청 시, 3단계에서 <strong class="text-success"><i class="fa fa-key"></i> 비밀번호 생성</strong>에서 복사한 비밀번호를 붙여넣으세요

12. "SSL을 사용한 보안 연결" 라디오 버튼을 선택하세요

13. "계정 추가"를 클릭하여 진행하세요

14. 새 탭에서 [Gmail](https://gmail.com)을 열고 인증 이메일이 도착할 때까지 기다리세요 (이메일 주소 소유자임을 확인하는 인증 코드가 포함된 이메일을 받게 됩니다)

15. 이메일이 도착하면, 이전 단계에서 받은 입력란에 인증 코드를 복사하여 붙여넣으세요
16. 완료하셨으면 이메일로 돌아가서 "요청 확인" 링크를 클릭하세요. 이메일이 올바르게 구성되려면 이 단계와 이전 단계를 모두 수행해야 할 가능성이 높습니다.

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      축하합니다!
    </strong>
    <span>
      모든 단계를 성공적으로 완료하셨습니다.
    </span>
  </div>
</div>

</div>

### Gmail을 사용한 Send Mail As의 레거시 무료 가이드란 무엇인가요 {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">중요:</strong> 이 레거시 무료 가이드는 2023년 5월부터 <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">이제 아웃바운드 SMTP를 지원하기 때문에</a> 더 이상 사용되지 않습니다. 아래 가이드를 사용하면 <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">Gmail에서 아웃바운드 이메일에 "<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>"가 표시됩니다.</a></div>

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
    위의 <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">시작 방법 및 이메일 전달 설정</a> 지침을 따르셨다면 아래 내용을 계속 읽으시면 됩니다.
  </span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="How to Send Mail As using Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. 이 방법을 사용하려면 [Gmail의 2단계 인증][gmail-2fa]이 활성화되어 있어야 합니다. 활성화되어 있지 않다면 <https://www.google.com/landing/2step/>를 방문하세요.

2. 2단계 인증이 활성화된 후(또는 이미 활성화되어 있다면) <https://myaccount.google.com/apppasswords>를 방문하세요.

3. "앱 비밀번호를 생성할 앱 및 기기 선택" 요청 시:
   * "앱 선택" 드롭다운에서 "메일"을 선택하세요
   * "기기 선택" 드롭다운에서 "기타"를 선택하세요
   * 텍스트 입력 요청 시, 전달하려는 맞춤 도메인의 이메일 주소를 입력하세요 (예: <code><hello@example.com></code> - 여러 계정에 이 서비스를 사용하는 경우 추적에 도움이 됩니다)

4. 자동으로 생성된 비밀번호를 클립보드에 복사하세요
   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       중요:
     </strong>
     <span>
       G Suite를 사용하는 경우, 관리자 패널 <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">앱 <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Gmail 설정 <i class="fa fa-angle-right"></i> 설정</a>으로 이동하여 "사용자가 외부 SMTP 서버를 통해 메일을 보낼 수 있도록 허용..."을 반드시 체크하세요. 이 변경 사항이 활성화되기까지 약간의 지연이 있으니 몇 분 기다려 주세요.
     </span>
   </div>

5. [Gmail](https://gmail.com)로 이동하여 [설정 <i class="fa fa-angle-right"></i> 계정 및 가져오기 <i class="fa fa-angle-right"></i> 메일 보내기](https://mail.google.com/mail/u/0/#settings/accounts)에서 "다른 이메일 주소 추가"를 클릭하세요

6. "이름" 요청 시, 이메일 발신자 이름으로 표시할 이름을 입력하세요 (예: "Linus Torvalds")

7. "이메일 주소" 요청 시, 위에서 사용한 맞춤 도메인의 이메일 주소를 입력하세요 (예: <code><hello@example.com></code>)
8. "별칭으로 처리" 선택 해제

9. "다음 단계"를 클릭하여 진행

10. "SMTP 서버" 입력 요청 시 <code>smtp.gmail.com</code>을 입력하고 포트는 <code>587</code>로 둡니다

11. "사용자 이름" 입력 요청 시 Gmail 주소에서 <span>gmail.com</span> 부분을 제외한 부분만 입력합니다 (예: 이메일이 <span><user@gmail.com></span>이라면 "user"만 입력)
    <div class="alert my-3 alert-primary">
      <i class="fa fa-info-circle font-weight-bold"></i>
      <strong class="font-weight-bold">
        중요:
      </strong>
      <span>
        "사용자 이름" 부분이 자동 입력된 경우, <u><strong>반드시 이를 Gmail 주소의 사용자 이름 부분으로 변경해야 합니다</strong></u>.
      </span>
    </div>

12. "비밀번호" 입력 요청 시 위 2단계에서 생성한 비밀번호를 클립보드에서 붙여넣기 합니다

13. "TLS를 사용한 보안 연결" 라디오 버튼이 선택된 상태로 둡니다

14. "계정 추가"를 클릭하여 진행

15. 새 탭에서 [Gmail](https://gmail.com)을 열고 인증 이메일이 도착할 때까지 기다립니다 (이메일 주소 소유자임을 확인하는 인증 코드가 포함되어 있습니다)

16. 인증 코드가 도착하면 이전 단계에서 받은 입력란에 복사하여 붙여넣기 합니다

17. 완료 후 이메일로 돌아가 "요청 확인" 링크를 클릭합니다. 이메일이 올바르게 설정되려면 이 단계와 이전 단계를 모두 수행해야 할 가능성이 높습니다.

</div>

### 고급 Gmail 라우팅 구성 {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">예상 설정 시간:</strong>
  <span>15-30분</span>
</div>

메일박스와 일치하지 않는 별칭이 Forward Email의 메일 교환기로 전달되도록 Gmail에서 고급 라우팅을 설정하려면 다음 단계를 따르세요:

1. [admin.google.com](https://admin.google.com)에서 Google 관리자 콘솔에 로그인
2. **앱 → Google Workspace → Gmail → 라우팅**으로 이동
3. **라우트 추가**를 클릭하고 다음 설정을 구성:

**단일 수신자 설정:**

* "봉투 수신자 변경" 선택 후 기본 Gmail 주소 입력
* "원래 수신자와 함께 X-Gm-Original-To 헤더 추가" 체크

**봉투 수신자 패턴:**

* 존재하지 않는 모든 메일박스에 일치하는 패턴 추가 (예: `.*@yourdomain.com`)

**이메일 서버 설정:**

* "호스트로 라우팅" 선택 후 기본 서버에 `mx1.forwardemail.net` 입력
* 백업 서버로 `mx2.forwardemail.net` 추가
* 포트는 25로 설정
* 보안 설정에서 "TLS 필요" 선택

4. **저장**을 클릭하여 라우트를 생성

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    중요:
  </strong>
  <span>
    이 구성은 일반 Gmail 계정이 아닌 맞춤 도메인이 있는 Google Workspace 계정에서만 작동합니다.
  </span>
</div>

### 고급 Outlook 라우팅 구성 {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">예상 설정 시간:</strong>
  <span>15-30분</span>
</div>

Microsoft 365(이전 Office 365) 사용자가 메일박스와 일치하지 않는 별칭이 Forward Email의 메일 교환기로 전달되도록 고급 라우팅을 설정하려면:

1. [admin.microsoft.com](https://admin.microsoft.com)에서 Microsoft 365 관리 센터에 로그인
2. **Exchange → 메일 흐름 → 규칙**으로 이동
3. **규칙 추가**를 클릭하고 **새 규칙 만들기** 선택
4. 규칙 이름 지정 (예: "존재하지 않는 메일박스 Forward Email로 전달")
5. **이 규칙 적용 대상**에서 다음 선택:
   * "수신자 주소가 일치하는 경우..."
   * 도메인의 모든 주소에 일치하는 패턴 입력 (예: `*@yourdomain.com`)
6. **다음 작업 수행**에서 다음 선택:
   * "메시지를 다음으로 리디렉션..."
   * "다음 메일 서버" 선택
   * `mx1.forwardemail.net` 및 포트 25 입력
   * 백업 서버로 `mx2.forwardemail.net` 추가
7. **예외 조건**에서 다음 선택:
   * "수신자가 다음인 경우..."
   * 전달하지 않을 기존 모든 메일박스 추가
8. 규칙 우선순위를 설정하여 다른 메일 흐름 규칙 이후에 실행되도록 함
9. **저장**을 클릭하여 규칙 활성화
## 문제 해결 {#troubleshooting}

### 테스트 이메일을 받지 못하는 이유 {#why-am-i-not-receiving-my-test-emails}

자신에게 테스트 이메일을 보내는 경우, 동일한 "Message-ID" 헤더 때문에 받은편지함에 나타나지 않을 수 있습니다.

이 문제는 널리 알려져 있으며 Gmail과 같은 서비스에도 영향을 미칩니다.  <a href="https://support.google.com/a/answer/1703601">이 문제에 대한 공식 Gmail 답변은 여기에서 확인할 수 있습니다</a>.

문제가 계속된다면, 대부분 DNS 전파 문제일 가능성이 큽니다.  조금 더 기다렸다가 다시 시도하거나 <strong class="notranslate">TXT</strong> 레코드의 TTL 값을 낮게 설정해 보세요.

**여전히 문제가 있나요?**  <a href="/help">문의해 주세요</a> 저희가 문제를 조사하고 빠른 해결책을 찾을 수 있도록 도와드리겠습니다.

### Forward Email과 함께 이메일 클라이언트를 설정하는 방법 {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
  저희 서비스는 다음과 같은 인기 있는 이메일 클라이언트와 함께 작동합니다:
  <ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
    <li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android&trade;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> 데스크톱</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> Mozilla Firefox&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i> Google Chrome&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i> 터미널</a></li>
  </ul>
</div>

<div class="alert alert-primary">
  사용자 이름은 별칭 이메일 주소이며 비밀번호는 <strong class="text-success"><i class="fa fa-key"></i> 비밀번호 생성</strong> ("일반 비밀번호")에서 가져옵니다.
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    팁:
  </strong>
  <span>Thunderbird를 사용하는 경우 "연결 보안"이 "SSL/TLS"로 설정되어 있고 인증 방법이 "일반 비밀번호"로 설정되어 있는지 확인하세요.</span>
</div>

| 유형 |         호스트명         |         프로토콜         |                                            포트                                            |
| :--: | :---------------------: | :---------------------: | :----------------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` |  SSL/TLS **권장**        |                                      `993` 및 `2993`                                      |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **권장**         | SSL/TLS(권장)용 `465` 및 `2465` 또는 STARTTLS용 `587`, `2587`, `2525`, `25` |

### 내 이메일이 스팸 및 정크 메일함에 도착하는 이유와 도메인 평판을 확인하는 방법 {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}
이 섹션은 아웃바운드 메일이 당사 SMTP 서버(예: `smtp.forwardemail.net`)를 사용하거나(`mx1.forwardemail.net` 또는 `mx2.forwardemail.net`을 통해 전달되는 경우) 수신자의 스팸 또는 정크 폴더에 배달되는 경우를 안내합니다.

당사는 정기적으로 [IP 주소](#what-are-your-servers-ip-addresses)를 [모든 신뢰할 수 있는 DNS 차단 목록](#how-do-you-handle-your-ip-addresses-becoming-blocked)과 대조하여 모니터링하며, **따라서 이는 도메인 평판과 관련된 문제일 가능성이 가장 높습니다**.

이메일이 스팸 폴더에 들어가는 이유는 여러 가지가 있습니다:

1. **인증 누락**: [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email), [DMARC](#how-do-i-set-up-dmarc-for-forward-email) 레코드를 설정하세요.

2. **도메인 평판**: 신규 도메인은 발송 이력이 쌓일 때까지 중립적인 평판을 가집니다.

3. **내용 트리거**: 특정 단어나 구문이 스팸 필터를 작동시킬 수 있습니다.

4. **발송 패턴**: 이메일 발송량이 갑자기 증가하면 의심스러워 보일 수 있습니다.

도메인의 평판과 분류를 확인하기 위해 다음 도구 중 하나 이상을 사용해 볼 수 있습니다:

#### 평판 및 차단 목록 확인 도구 {#reputation-and-blocklist-check-tools}

| 도구 이름                                   | URL                                                          | 유형                   |
| ------------------------------------------- | ------------------------------------------------------------ | ---------------------- |
| Cloudflare 도메인 분류 피드백               | <https://radar.cloudflare.com/domains/feedback>              | 분류                   |
| Spamhaus IP 및 도메인 평판 확인기           | <https://check.spamhaus.org/>                                | DNSBL                  |
| Cisco Talos IP 및 도메인 평판 센터           | <https://talosintelligence.com/reputation_center>            | 평판                   |
| Barracuda IP 및 도메인 평판 조회             | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL                  |
| MX Toolbox 블랙리스트 확인                   | <https://mxtoolbox.com/blacklists.aspx>                      | 블랙리스트             |
| Google Postmaster 도구                      | <https://www.gmail.com/postmaster/>                          | 평판                   |
| Yahoo 발신자 허브                           | <https://senders.yahooinc.com/>                              | 평판                   |
| MultiRBL.valli.org 블랙리스트 확인           | <https://multirbl.valli.org/lookup/>                         | DNSBL                  |
| Sender Score                                | <https://senderscore.org/act/blocklist-remover/>             | 평판                   |
| Invaluement                                 | <https://www.invaluement.com/lookup/>                        | DNSBL                  |
| SURBL                                       | <https://www.surbl.org/>                                     | DNSBL                  |
| SpamCop                                     | <https://www.spamcop.net/bl.shtml>                           | DNSBL                  |
| UCEPROTECT의 레벨 1, 2, 3                   | <https://www.uceprotect.net/en/rblcheck.php>                 | DNSBL                  |
| UCEPROTECT의 backscatterer.org              | <https://www.backscatterer.org/>                             | 백스캐터 보호          |
| UCEPROTECT의 whitelisted.org                | <https://www.whitelisted.org/> (유료)                         | DNSWL                  |

#### 공급자별 IP 제거 요청 양식 {#ip-removal-request-forms-by-provider}

특정 이메일 공급자가 귀하의 IP 주소를 차단한 경우, 아래 적절한 제거 양식이나 연락처를 사용하세요:

| 공급자                                 | 제거 양식 / 연락처                                                                                         | 비고                                         |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Google/Gmail                           | <https://support.google.com/mail/contact/bulk_send_new>                                                    | 대량 발송자 연락 양식                        |
| Microsoft (Outlook/Office 365/Hotmail) | <https://sender.office.com>                                                                                | Office 365 IP 제거 포털                      |
| Yahoo/AOL/Verizon                      | <https://senders.yahooinc.com/>                                                                            | Yahoo 발신자 허브                           |
| Apple/iCloud                           | <https://ipcheck.proofpoint.com/>                                                                          | Apple은 IP 평판에 Proofpoint 사용           |
| Proofpoint                             | <https://ipcheck.proofpoint.com/>                                                                          | Proofpoint IP 확인 및 제거                   |
| Barracuda Networks                     | <https://www.barracudacentral.org/lookups/lookup-reputation>                                               | Barracuda 평판 조회 및 제거                  |
| Cloudmark                              | <https://csi.cloudmark.com/en/reset/>                                                                      | Cloudmark CSI 재설정 요청                    |
| GoDaddy/SecureServer                   | <https://unblock.secureserver.net>                                                                         | GoDaddy IP 차단 해제 요청 양식              |
| Comcast/Xfinity                        | <https://spa.xfinity.com/report>                                                                           | Comcast IP 제거 요청                         |
| Charter/Spectrum                       | <https://www.spectrum.net/support/internet/understanding-email-error-codes>                                | 제거 요청은 Spectrum 지원에 문의             |
| AT&T                                   | `abuse_rbl@abuse-att.net`                                                                                  | 제거 요청 이메일                            |
| Cox Communications                     | `unblock.request@cox.net`                                                                                  | 제거 요청 이메일                            |
| CenturyLink/Lumen                      | `abuse@centurylink.com`                                                                                    | Cloudfilter 사용                            |
| Windstream                             | `abuse@windstream.net`                                                                                     | 제거 요청 이메일                            |
| t-online.de (독일)                     | `tobr@rx.t-online.de`                                                                                      | 제거 요청 이메일                            |
| Orange France                          | <https://postmaster.orange.fr/>                                                                            | 연락 양식 또는 이메일 `abuse@orange.fr` 사용 |
| GMX                                    | <https://postmaster.gmx.net/en/contact>                                                                    | GMX 포스트마스터 연락 양식                  |
| Mail.ru                                | <https://postmaster.mail.ru/>                                                                              | Mail.ru 포스트마스터 포털                   |
| Yandex                                 | <https://postmaster.yandex.ru/>                                                                            | Yandex 포스트마스터 포털                    |
| QQ Mail (Tencent)                      | <https://open.mail.qq.com/>                                                                                | QQ Mail 화이트리스트 신청 (중국어)           |
| Netease (163.com)                      | <https://mail.163.com/postmaster/>                                                                         | Netease 포스트마스터 포털                   |
| Alibaba/Aliyun/HiChina                 | <https://www.alibabacloud.com/help/en/alibaba-mail/>                                                       | Alibaba Cloud 콘솔 통해 연락                |
| Amazon SES                             | <https://docs.aws.amazon.com/ses/latest/dg/faqs-dnsbls.html>                                               | AWS SES 콘솔 > 블랙리스트 제거              |
| SendGrid                               | <https://support.sendgrid.com/>                                                                            | SendGrid 지원에 연락                        |
| Mimecast                               | <https://community.mimecast.com/>                                                                          | 타사 RBL 사용 - 특정 RBL에 연락             |
| Fastmail                               | <https://www.fastmail.com/support/>                                                                        | Fastmail 지원에 연락                        |
| Zoho                                   | <https://help.zoho.com/portal/en/kb/campaigns/faqs/campaign-review/articles/how-do-i-delist-my-ip-address> | Zoho 지원에 연락                            |
| ProtonMail                             | <https://proton.me/support/contact>                                                                        | Proton 지원에 연락                          |
| Tutanota                               | <https://tutanota.com/support>                                                                             | Tutanota 지원에 연락                        |
| Hushmail                               | <https://www.hushmail.com/support/>                                                                        | Hushmail 지원에 연락                        |
| Mailbox.org                            | <https://mailbox.org/en/support>                                                                           | Mailbox.org 지원에 연락                     |
| Posteo                                 | <https://posteo.de/en/site/contact>                                                                        | Posteo 지원에 연락                          |
| DuckDuckGo Email                       | <https://duckduckgo.com/email/support>                                                                     | DuckDuckGo 지원에 연락                      |
| Sonic.net                              | <https://www.sonic.com/support>                                                                            | Sonic 지원에 연락                           |
| Telus                                  | <https://www.telus.com/en/support>                                                                         | Telus 지원에 연락                           |
| Vodafone Germany                       | <https://www.vodafone.de/hilfe/>                                                                           | Vodafone 지원에 연락                        |
| Xtra (Spark NZ)                        | <https://www.spark.co.nz/help/>                                                                            | Spark NZ 지원에 연락                        |
| UOL/BOL (브라질)                      | <https://ajuda.uol.com.br/>                                                                                | UOL 지원에 연락 (포르투갈어)                 |
| Libero (이탈리아)                     | <https://aiuto.libero.it/>                                                                                 | Libero 지원에 연락 (이탈리아어)              |
| Telenet (벨기에)                      | <https://www2.telenet.be/en/support/>                                                                      | Telenet 지원에 연락                         |
| Facebook/WhatsApp                      | <https://www.facebook.com/business/help>                                                                   | Facebook 비즈니스 지원에 연락               |
| LinkedIn                               | <https://www.linkedin.com/help/linkedin>                                                                   | LinkedIn 지원에 연락                        |
| Groups.io                              | <https://groups.io/helpcenter>                                                                             | Groups.io 지원에 연락                       |
| Earthlink/Vade Secure                  | <https://sendertool.vadesecure.com/en/>                                                                    | Vade Secure 발신자 도구                     |
| Cloudflare Email Security              | <https://www.cloudflare.com/products/zero-trust/email-security/>                                           | Cloudflare 지원에 연락                      |
| Hornetsecurity/Expurgate               | <https://www.hornetsecurity.com/>                                                                          | Hornetsecurity 지원에 연락                  |
| SpamExperts/Antispamcloud              | <https://www.spamexperts.com/>                                                                             | 호스팅 공급자를 통해 연락                   |
| Mail2World                             | <https://www.mail2world.com/support/>                                                                      | Mail2World 지원에 연락                      |
> \[!TIP]
> 더 큰 용량으로 이메일을 보내기 전에 긍정적인 평판을 쌓기 위해 적은 양의 고품질 이메일부터 시작하세요.

> \[!IMPORTANT]
> 도메인이 블랙리스트에 올라가 있다면, 각 블랙리스트마다 제거 절차가 다릅니다. 해당 웹사이트에서 지침을 확인하세요.

> \[!TIP]
> 추가 도움이 필요하거나 특정 이메일 서비스 제공업체에서 저희가 스팸으로 오인되어 등록된 경우, <a href="/help">문의해 주세요</a>.

### 스팸 이메일을 받으면 어떻게 해야 하나요 {#what-should-i-do-if-i-receive-spam-emails}

가능하다면 메일링 리스트에서 구독을 취소하고 발신자를 차단해야 합니다.

메시지를 스팸으로 신고하지 말고, 대신 수동으로 관리되고 개인정보 보호에 중점을 둔 저희 남용 방지 시스템으로 전달해 주세요.

**스팸을 전달할 이메일 주소는:** <abuse@forwardemail.net>

### Gmail에서 나에게 보낸 테스트 이메일이 "의심스러움"으로 표시되는 이유는 무엇인가요 {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

자신에게 테스트 메일을 보낼 때 또는 별칭으로 이메일을 주고받는 사람이 처음으로 당신의 이메일을 받았을 때 Gmail에서 이 오류 메시지가 표시된다면, **걱정하지 마세요** – 이것은 Gmail의 내장 안전 기능입니다.

간단히 "안전해 보임"을 클릭하면 됩니다. 예를 들어, 보내기 기능을 사용해 테스트 메시지를 다른 사람에게 보낸다면 그들은 이 메시지를 보지 않습니다.

하지만 만약 그들이 이 메시지를 본다면, 이는 보통 <john@gmail.com>에서 오는 이메일을 보던 사용자가 <john@customdomain.com> (예시)에서 온 이메일을 처음 봤기 때문입니다. Gmail은 안전을 위해 사용자에게 알림을 표시하며, 이를 우회하는 방법은 없습니다.

### Gmail에서 via forwardemail dot net을 제거할 수 있나요 {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

이 주제는 [발신자 이름 옆에 추가 정보가 표시되는 Gmail의 널리 알려진 문제](https://support.google.com/mail/answer/1311182)와 관련이 있습니다.

2023년 5월부터 모든 유료 사용자에게 SMTP를 통한 이메일 전송을 애드온으로 지원하므로, Gmail에서 <span class="notranslate">via forwardemail dot net</span>을 제거할 수 있습니다.

이 FAQ 주제는 [Gmail을 사용한 메일 보내기 기능](#how-to-send-mail-as-using-gmail)을 사용하는 분들을 위한 것입니다.

설정 방법은 [SMTP를 통한 이메일 전송 지원 여부](#do-you-support-sending-email-with-smtp) 섹션을 참고하세요.


## 데이터 관리 {#data-management}

### 서버 위치는 어디인가요 {#where-are-your-servers-located}

> \[!TIP]
> 곧 [forwardemail.eu](https://forwardemail.eu)에서 호스팅하는 EU 데이터센터 위치를 발표할 예정입니다. 업데이트를 원하시면 <https://github.com/orgs/forwardemail/discussions/336>에서 토론을 구독하세요.

저희 서버는 주로 콜로라도 덴버에 위치해 있습니다 – 전체 IP 주소 목록은 <https://forwardemail.net/ips>에서 확인하세요.

서브프로세서에 관한 내용은 저희 [GDPR](/gdpr), [DPA](/dpa), [개인정보 보호](/privacy) 페이지에서 확인할 수 있습니다.

### 메일박스를 어떻게 내보내고 백업하나요 {#how-do-i-export-and-backup-my-mailbox}

언제든지 메일박스를 [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox), 또는 암호화된 [SQLite](https://en.wikipedia.org/wiki/SQLite) 형식으로 내보낼 수 있습니다.

<a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 별칭 <i class="fa fa-angle-right"></i> 백업 다운로드로 이동하여 원하는 내보내기 형식을 선택하세요.

내보내기가 완료되면 다운로드 링크가 이메일로 전송됩니다.

보안상의 이유로 이 내보내기 다운로드 링크는 4시간 후 만료됩니다.

내보낸 EML 또는 Mbox 형식을 검사해야 한다면, 다음 오픈 소스 도구들이 유용할 수 있습니다:

| 이름             | 형식  | 플랫폼       | GitHub URL                                          |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| MBox Viewer     |  Mbox  | Windows       | <https://github.com/eneam/mboxviewer>               |
| mbox-web-viewer |  Mbox  | 모든 플랫폼   | <https://github.com/PHMRanger/mbox-web-viewer>      |
| EmlReader       |   EML  | Windows       | <https://github.com/ayamadori/EmlReader>            |
| Email viewer    |   EML  | VSCode        | <https://github.com/joelharkes/vscode_email_viewer> |
| eml-reader      |   EML  | 모든 플랫폼   | <https://github.com/s0ph1e/eml-reader>              |
또한 Mbox 파일을 EML 파일로 변환해야 하는 경우 <https://github.com/noelmartinon/mboxzilla>를 사용할 수 있습니다.

### 기존 메일박스를 어떻게 가져오고 마이그레이션하나요 {#how-do-i-import-and-migrate-my-existing-mailbox}

아래 지침을 따라 Forward Email로 이메일을 쉽게 가져올 수 있습니다(예: [Thunderbird](https://www.thunderbird.net) 사용).

<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    중요:
  </strong>
  <span>
    기존 이메일을 가져오려면 아래 모든 단계를 반드시 따라야 합니다.
  </span>
</div>

1. 기존 이메일 제공자에서 이메일을 내보내기:

   | 이메일 제공자 | 내보내기 형식                                  | 내보내기 지침                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
   | -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Gmail          | MBOX                                           | <https://takeout.google.com/settings/takeout/custom/gmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
   | Outlook        | PST                                            | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">팁:</strong> <span>Outlook을 사용 중이라면 (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">PST 내보내기 형식</a>) 아래 "기타" 항목의 지침을 따를 수 있습니다. 그러나 운영 체제에 따라 PST를 MBOX/EML 형식으로 변환하는 링크도 아래에 제공했습니다:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Windows용 Zinkuba</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">Windows cygwin용 readpst</a> – (예: <code>readpst -u -o $OUT_DIR $IN_DIR</code> 여기서 <code>$OUT_DIR</code>와 <code>$IN_DIR</code>는 각각 출력 디렉터리와 입력 디렉터리 경로로 교체).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">Ubuntu/Linux용 readpst</a> – (예: <code>sudo apt-get install readpst</code> 후 <code>readpst -u -o $OUT_DIR $IN_DIR</code>, 여기서 <code>$OUT_DIR</code>와 <code>$IN_DIR</code>는 각각 출력 디렉터리와 입력 디렉터리 경로로 교체).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">macOS용 readpst (brew 사용)</a> – (예: <code>brew install libpst</code> 후 <code>readpst -u -o $OUT_DIR $IN_DIR</code>, 여기서 <code>$OUT_DIR</code>와 <code>$IN_DIR</code>는 각각 출력 디렉터리와 입력 디렉터리 경로로 교체).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">Windows용 PST 변환기 (GitHub)</a></li></ul><br /></span></div> |
   | Apple Mail     | MBOX                                           | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Fastmail       | EML                                            | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
   | Proton Mail    | MBOX/EML                                       | <https://proton.me/support/export-emails-import-export-app>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
   | Tutanota       | EML                                            | <https://github.com/crepererum-oss/tatutanatata>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Gandi          | EML                                            | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
   | Zoho           | EML                                            | <https://www.zoho.com/mail/help/import-export-emails.html#alink2>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
   | 기타           | [Thunderbird 사용](https://www.thunderbird.net) | Thunderbird에 기존 이메일 계정을 설정한 후 [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) 플러그인을 사용하여 이메일을 내보내고 가져옵니다.  **또한 한 계정에서 다른 계정으로 이메일을 복사/붙여넣기 또는 드래그/드롭으로 간단히 이동할 수도 있습니다.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
2. [Thunderbird](https://www.thunderbird.net)를 다운로드, 설치하고 실행합니다.

3. 별칭의 전체 이메일 주소(예: <code><you@yourdomain.com></code>)와 생성된 비밀번호를 사용하여 새 계정을 만듭니다.  <strong>아직 생성된 비밀번호가 없다면, <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">설치 지침을 참고하세요</a></strong>.

4. [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) Thunderbird 플러그인을 다운로드하고 설치합니다.

5. Thunderbird에서 새 로컬 폴더를 만들고, 해당 폴더를 마우스 오른쪽 버튼으로 클릭 → `ImportExportTools NG` 옵션 선택 → `Import mbox file`(MBOX 내보내기 형식용) 또는 `Import messages` / `Import all messages from a directory`(EML 내보내기 형식용)를 선택합니다.

6. 로컬 폴더에서 Thunderbird의 새 IMAP 폴더(또는 기존 폴더)로 메시지를 드래그/드롭하여 IMAP 저장소에 업로드합니다.  이렇게 하면 SQLite 암호화 저장소를 통해 온라인으로 백업됩니다.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       팁:
     </strong>
     <span>
       Thunderbird로 가져오는 방법이 헷갈린다면, 공식 지침을 <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> 및 <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>에서 참고할 수 있습니다.
     </span>
   </div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    중요:
  </strong>
  <span>
    내보내기 및 가져오기 과정을 완료한 후에는 기존 이메일 계정에서 전달 설정을 활성화하고 자동 응답기를 설정하여 발신자에게 새 이메일 주소가 있음을 알리는 것이 좋습니다(예: 이전에 Gmail을 사용하다가 이제는 맞춤 도메인 이메일을 사용하는 경우).
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

### 백업을 위해 내 S3 호환 스토리지를 사용하는 방법 {#how-do-i-use-my-own-s3-compatible-storage-for-backups}

유료 플랜 사용자는 도메인별로 자신의 [S3](https://en.wikipedia.org/wiki/Amazon_S3) 호환 스토리지 공급자를 IMAP/SQLite 백업용으로 구성할 수 있습니다.  이는 암호화된 메일박스 백업을 기본 저장소 대신(또는 추가로) 자신의 인프라에 저장할 수 있음을 의미합니다.

지원되는 공급자는 [Amazon S3](https://aws.amazon.com/s3/), [Cloudflare R2](https://developers.cloudflare.com/r2/), [MinIO](https://github.com/minio/minio), [Backblaze B2](https://www.backblaze.com/cloud-storage), [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces) 및 기타 모든 S3 호환 서비스입니다.

#### 설정 {#setup}

1. S3 호환 공급자에서 **비공개** 버킷을 만듭니다. 버킷은 공개 접근이 불가능해야 합니다.
2. 버킷에 대한 읽기/쓰기 권한이 있는 액세스 자격 증명(액세스 키 ID 및 비밀 액세스 키)을 생성합니다.
3. <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 고급 설정 <i class="fa fa-angle-right"></i> 맞춤 S3 호환 스토리지로 이동합니다.
4. **"맞춤 S3 호환 스토리지 활성화"**를 체크하고 엔드포인트 URL, 액세스 키 ID, 비밀 액세스 키, 리전, 버킷 이름을 입력합니다.
5. **"연결 테스트"**를 클릭하여 자격 증명, 버킷 접근 및 쓰기 권한을 확인합니다.
6. **"저장"**을 클릭하여 설정을 적용합니다.

#### 백업 작동 방식 {#how-backups-work}

백업은 연결된 모든 IMAP 별칭에 대해 자동으로 트리거됩니다. IMAP 서버는 활성 연결을 매시간 확인하고 각 연결된 별칭에 대해 백업을 실행합니다. Redis 기반 잠금 장치는 30분 이내 중복 백업 실행을 방지하며, 최근 24시간 내에 성공적인 백업이 완료된 경우(사용자가 다운로드를 위해 명시적으로 백업을 요청한 경우 제외) 실제 백업은 건너뜁니다.
백업은 대시보드에서 모든 별칭에 대해 **"백업 다운로드"**를 클릭하여 수동으로도 실행할 수 있습니다. 수동 백업은 24시간 창과 상관없이 항상 실행됩니다.

백업 프로세스는 다음과 같이 작동합니다:

1. SQLite 데이터베이스는 `VACUUM INTO`를 사용하여 복사되며, 이는 활성 연결을 중단하지 않고 일관된 스냅샷을 생성하며 데이터베이스 암호화를 유지합니다.
2. 백업 파일을 열어 암호화가 여전히 유효한지 확인하여 검증합니다.
3. SHA-256 해시를 계산하고 저장된 기존 백업과 비교합니다. 해시가 일치하면 업로드를 건너뜁니다(마지막 백업 이후 변경 사항 없음).
4. 백업은 [@aws-sdk/lib-storage](https://github.com/aws/aws-sdk-js-v3/tree/main/lib/lib-storage) 라이브러리를 통해 멀티파트 업로드 방식으로 S3에 업로드됩니다.
5. 서명된 다운로드 URL(4시간 유효)이 생성되어 사용자에게 이메일로 전송됩니다.

#### 백업 형식 {#backup-formats}

세 가지 백업 형식이 지원됩니다:

| 형식     | 확장자    | 설명                                                                        |
| -------- | --------- | --------------------------------------------------------------------------- |
| `sqlite` | `.sqlite` | 원시 암호화된 SQLite 데이터베이스 스냅샷 (자동 IMAP 백업의 기본값)            |
| `mbox`   | `.zip`    | mbox 형식의 메일박스를 포함하는 비밀번호 보호 ZIP                           |
| `eml`    | `.zip`    | 메시지별 개별 `.eml` 파일을 포함하는 비밀번호 보호 ZIP                      |

> **팁:** `.sqlite` 백업 파일을 가지고 있고 로컬에서 `.eml` 파일로 변환하려면 독립 실행형 CLI 도구 **[convert-sqlite-to-eml](#how-do-i-convert-sqlite-backups-to-eml-files)**를 사용하세요. Windows, Linux, macOS에서 작동하며 네트워크 연결이 필요 없습니다.

#### 파일 명명 및 키 구조 {#file-naming-and-key-structure}

**사용자 지정 S3 스토리지**를 사용할 때 백업 파일은 [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) 타임스탬프 접두사와 함께 저장되어 각 백업이 별도의 객체로 보존됩니다. 이를 통해 자신의 버킷에서 전체 백업 기록을 확인할 수 있습니다.

키 형식은 다음과 같습니다:

```
{ISO 8601 timestamp}-{alias_id}.{extension}
```

예를 들어:

```
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.zip
2025-03-02T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
```

`alias_id`는 별칭의 MongoDB ObjectId입니다. 별칭 설정 페이지나 API를 통해 확인할 수 있습니다.

**기본(시스템) 스토리지**를 사용할 경우 키는 평면 구조이며(예: `65a31c53c36b75ed685f3fda.sqlite`), 각 백업은 이전 백업을 덮어씁니다.

> **참고:** 사용자 지정 S3 스토리지는 모든 백업 버전을 보존하므로 저장 공간 사용량이 시간이 지남에 따라 증가합니다. 버킷에 [수명 주기 규칙](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html)을 구성하여 오래된 백업을 자동으로 만료시키는 것을 권장합니다(예: 30일 또는 90일 이상 된 객체 삭제).

#### 데이터 소유권 및 삭제 정책 {#data-ownership-and-deletion-policy}

사용자 지정 S3 버킷은 전적으로 귀하의 관리 하에 있습니다. 우리는 별칭 삭제, 도메인 제거, 정리 작업 중에도 사용자 지정 S3 버킷 내 파일을 **절대 삭제하거나 수정하지 않습니다**. 새 백업 파일만 버킷에 씁니다.

즉:

* **별칭 삭제** — 별칭을 삭제하면 기본 시스템 스토리지에서만 백업을 제거합니다. 사용자 지정 S3 버킷에 이전에 작성된 백업은 그대로 유지됩니다.
* **도메인 제거** — 도메인 제거는 사용자 지정 버킷 내 파일에 영향을 주지 않습니다.
* **보존 관리** — 오래된 백업 만료를 위한 수명 주기 규칙 구성 등 저장소 관리는 귀하의 책임입니다.

사용자 지정 S3 스토리지를 비활성화하거나 기본 스토리지로 전환해도 버킷 내 기존 파일은 보존됩니다. 이후 백업은 기본 스토리지에 작성됩니다.

#### 보안 {#security}

* 액세스 키 ID와 비밀 액세스 키는 데이터베이스에 저장되기 전에 [AES-256-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode)을 사용해 **휴지 상태 암호화**됩니다. 백업 작업 시에만 런타임에 복호화됩니다.
* 버킷이 **공개 접근이 불가능한지** 자동으로 검증합니다. 공개 버킷이 감지되면 저장 시 구성이 거부됩니다. 백업 시 공개 접근이 감지되면 기본 스토리지로 대체하며 모든 도메인 관리자에게 이메일로 알립니다.
* 저장 시 [HeadBucket](https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadBucket.html) 호출을 통해 버킷 존재 여부와 자격 증명 유효성을 검증합니다. 검증 실패 시 사용자 지정 S3 스토리지가 자동으로 비활성화됩니다.
* 각 백업 파일에는 S3 메타데이터에 SHA-256 해시가 포함되어 있어 변경되지 않은 데이터베이스를 감지하고 중복 업로드를 건너뜁니다.
#### 오류 알림 {#error-notifications}

사용자 지정 S3 스토리지를 사용할 때 백업이 실패하면(예: 만료된 자격 증명 또는 연결 문제로 인해) 모든 도메인 관리자가 이메일로 알림을 받습니다. 이러한 알림은 중복 경고를 방지하기 위해 6시간에 한 번씩 제한됩니다. 백업 시 버킷이 공개적으로 액세스 가능한 것으로 감지되면 관리자는 하루에 한 번 알림을 받습니다.

#### API {#api}

API를 통해서도 사용자 지정 S3 스토리지를 구성할 수 있습니다:

```sh
curl -X PUT https://api.forwardemail.net/v1/domains/example.com \
  -u API_TOKEN: \
  -d has_custom_s3=true \
  -d s3_endpoint=https://s3.us-east-1.amazonaws.com \
  -d s3_access_key_id=YOUR_ACCESS_KEY_ID \
  -d s3_secret_access_key=YOUR_SECRET_ACCESS_KEY \
  -d s3_region=us-east-1 \
  -d s3_bucket=my-email-backups
```

API를 통해 연결을 테스트하려면:

```sh
curl -X POST https://api.forwardemail.net/v1/domains/example.com/test-s3-connection \
  -u API_TOKEN:
```

### SQLite 백업을 EML 파일로 변환하는 방법 {#how-do-i-convert-sqlite-backups-to-eml-files}

SQLite 백업을 다운로드하거나 저장한 경우(기본 스토리지 또는 자신의 [사용자 지정 S3 버킷](#how-do-i-use-my-own-s3-compatible-storage-for-backups)에서), 독립 실행형 CLI 도구 **[convert-sqlite-to-eml](https://github.com/forwardemail/forwardemail.net/tree/master/tools/convert-sqlite-to-eml)** 를 사용하여 표준 `.eml` 파일로 변환할 수 있습니다. EML 파일은 모든 이메일 클라이언트([Thunderbird](https://www.thunderbird.net/), [Outlook](https://www.microsoft.com/en-us/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook), [Apple Mail](https://support.apple.com/mail) 등)에서 열거나 다른 메일 서버로 가져올 수 있습니다.

#### 설치 {#installation-1}

사전 빌드된 바이너리( [Node.js](https://github.com/nodejs/node) 필요 없음)를 다운로드하거나 [Node.js](https://github.com/nodejs/node)로 직접 실행할 수 있습니다:

**사전 빌드된 바이너리** — 플랫폼에 맞는 최신 릴리스를 [GitHub Releases](https://github.com/forwardemail/forwardemail.net/releases)에서 다운로드하세요:

| 플랫폼  | 아키텍처       | 파일                                   |
| ------- | -------------- | ------------------------------------ |
| Linux   | x64            | `convert-sqlite-to-eml-linux-x64`    |
| Linux   | arm64          | `convert-sqlite-to-eml-linux-arm64`  |
| macOS   | Apple Silicon  | `convert-sqlite-to-eml-darwin-arm64` |
| Windows | x64            | `convert-sqlite-to-eml-win-x64.exe`  |

> **macOS 사용자:** 다운로드 후 바이너리를 실행하기 전에 격리 속성을 제거해야 할 수 있습니다:
>
> ```bash
> sudo xattr -rd com.apple.quarantine ./convert-sqlite-to-eml-darwin-arm64
> ```
>
> (`./convert-sqlite-to-eml-darwin-arm64`를 다운로드한 파일의 실제 경로로 바꾸세요.)

> **Linux 사용자:** 다운로드 후 바이너리에 실행 권한을 부여해야 할 수 있습니다:
>
> ```bash
> chmod +x ./convert-sqlite-to-eml-linux-x64
> ```
>
> (`./convert-sqlite-to-eml-linux-x64`를 다운로드한 파일의 실제 경로로 바꾸세요.)

**소스에서 설치** ([Node.js](https://github.com/nodejs/node) >= 18 필요):

```bash
cd tools/convert-sqlite-to-eml
npm install
node index.js
```

#### 사용법 {#usage}

이 도구는 대화형 및 비대화형 모드를 모두 지원합니다.

**대화형 모드** — 인수 없이 실행하면 모든 입력을 안내받습니다:

```bash
./convert-sqlite-to-eml
```

```
  Forward Email - SQLite 백업을 EML로 변환
  ========================================

  SQLite 백업 파일 경로: /path/to/backup.sqlite
  IMAP/별칭 비밀번호: ********
  출력 ZIP 경로 [/path/to/backup-2025-03-01T12-00-00-000Z.zip]:
```

**비대화형 모드** — 스크립팅 및 자동화를 위해 명령줄 플래그로 인수를 전달합니다:

```bash
./convert-sqlite-to-eml \
  --path /path/to/backup.sqlite \
  --password "your-imap-password" \
  --output /path/to/output.zip
```

| 플래그               | 설명                                                                            |
| -------------------- | ------------------------------------------------------------------------------- |
| `--path <path>`      | 암호화된 SQLite 백업 파일 경로                                                  |
| `--password <pass>`  | 복호화를 위한 IMAP/별칭 비밀번호                                                |
| `--output <path>`    | ZIP 파일 출력 경로 (기본값: ISO 8601 타임스탬프로 자동 생성)                   |
| `--help`             | 도움말 메시지 표시                                                              |
#### 출력 형식 {#output-format}

이 도구는 다음을 포함하는 비밀번호로 보호된 ZIP 아카이브(AES-256 암호화)를 생성합니다:

```
README.txt
INBOX/
  <message-id-1>.eml
  <message-id-2>.eml
Sent/
  <message-id-3>.eml
Drafts/
  <message-id-4>.eml
```

EML 파일은 메일박스 폴더별로 정리됩니다. ZIP 비밀번호는 IMAP/별칭 비밀번호와 동일합니다. 각 `.eml` 파일은 SQLite 데이터베이스에서 재구성된 전체 헤더, 본문 텍스트 및 첨부파일이 포함된 표준 [RFC 5322](https://datatracker.ietf.org/doc/html/rfc5322) 이메일 메시지입니다.

#### 작동 방식 {#how-it-works}

1. IMAP/별칭 비밀번호를 사용하여 암호화된 SQLite 데이터베이스를 엽니다 ([ChaCha20](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) 및 [AES-256-CBC](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) 암호화 방식 모두 지원).
2. Mailboxes 테이블을 읽어 폴더 구조를 확인합니다.
3. 각 메시지에 대해 Messages 테이블에 저장된 [Brotli](https://github.com/google/brotli) 압축 JSON 형식의 mimeTree를 디코딩합니다.
4. MIME 트리를 순회하며 Attachments 테이블에서 첨부파일 본문을 가져와 전체 EML을 재구성합니다.
5. 모든 내용을 [archiver-zip-encrypted](https://github.com/artem-silaev/archiver-zip-encrypted)를 사용해 비밀번호로 보호된 ZIP 아카이브로 패키징합니다.

### 자체 호스팅을 지원하나요? {#do-you-support-self-hosting}

네, 2025년 3월부터 자체 호스팅 옵션을 지원합니다. 블로그를 [여기](https://forwardemail.net/blog/docs/self-hosted-solution)에서 읽어보세요. 시작하려면 [자체 호스팅 가이드](https://forwardemail.net/self-hosted)를 참고하세요. 좀 더 세분화된 단계별 버전을 원하시면 [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) 또는 [Debian](https://forwardemail.net/guides/selfhosted-on-debian) 기반 가이드를 확인하세요.


## 이메일 설정 {#email-configuration}

### 이메일 전달 설정을 어떻게 시작하나요? {#how-do-i-get-started-and-set-up-email-forwarding}

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
    아래 나열된 1단계부터 8단계까지를 주의 깊게 읽고 따라 하세요. <code>user@gmail.com</code> 이메일 주소를 이메일을 전달할 실제 이메일 주소로 반드시 교체하세요(이미 정확하지 않은 경우). 마찬가지로 <code>example.com</code>도 맞춤 도메인 이름으로 반드시 교체하세요(이미 정확하지 않은 경우).
  </span>
</div>

<ol>
  <li class="mb-2 mb-md-3 mb-lg-5">이미 도메인 이름을 등록한 경우 이 단계를 완전히 건너뛰고 2단계로 이동하세요! 그렇지 않으면 <a href="/domain-registration" rel="noopener noreferrer">여기에서 도메인 이름을 등록하세요</a>.</li>
  <li class="mb-2 mb-md-3 mb-lg-5">
  도메인을 어디에 등록했는지 기억나나요? 기억나면 아래 지침을 따르세요:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    중요:
  </strong>
  <span>
    새 탭을 열고 도메인 등록기관에 로그인해야 합니다. 아래 "등록기관"을 클릭하면 자동으로 로그인 페이지가 열립니다. 새 탭에서 등록기관의 DNS 관리 페이지로 이동하세요 – "설정 단계" 열에 단계별 안내가 제공되어 있습니다. 새 탭에서 해당 페이지로 이동한 후 이 탭으로 돌아와 3단계로 진행하세요.
    <strong class="font-weight-bold">열어둔 탭을 아직 닫지 마세요; 이후 단계에서 필요합니다!</strong>
  </span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>등록기관</th>
      <th>설정 단계</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
      <td>로그인 <i class="fa fa-angle-right"></i> 도메인 센터 <i class="fa fa-angle-right"></i> (도메인 선택) <i class="fa fa-angle-right"></i> DNS 설정 편집</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Route 53</a></td>
      <td>로그인 <i class="fa fa-angle-right"></i> 호스티드 존 <i class="fa fa-angle-right"></i> (도메인 선택)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
      <td>로그인 <i class="fa fa-angle-right"></i> 내 서버 <i class="fa fa-angle-right"></i> 도메인 관리 <i class="fa fa-angle-right"></i> DNS 관리자</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
      <td>ROCK 버전: 로그인 <i class="fa fa-angle-right"></i> 도메인 <i class="fa fa-angle-right"></i> (관리 옆 ▼ 아이콘 클릭) <i class="fa fa-angle-right"></i> DNS
      <br />
      LEGACY 버전: 로그인 <i class="fa fa-angle-right"></i> 도메인 <i class="fa fa-angle-right"></i> 존 편집기 <i class="fa fa-angle-right"></i> (도메인 선택)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
      <td>로그인 <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Made Easy</a></td>
      <td>로그인 <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (도메인 선택)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
      <td>로그인 <i class="fa fa-angle-right"></i> (도메인 선택) <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> 관리</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
      <td>로그인 <i class="fa fa-angle-right"></i> 네트워킹 <i class="fa fa-angle-right"></i> 도메인 <i class="fa fa-angle-right"></i> (도메인 선택) <i class="fa fa-angle-right"></i> 더보기 <i class="fa fa-angle-right"></i> 도메인 관리</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
      <td>로그인 <i class="fa fa-angle-right"></i> 카드 뷰에서 도메인 관리 클릭 <i class="fa fa-angle-right"></i> 리스트 뷰에서 톱니바퀴 아이콘 클릭 <i class="fa fa-angle-right"></i> DNS 및 네임서버 <i class="fa fa-angle-right"></i> DNS 레코드</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> 시청</a>
      </td>
      <td>로그인 <i class="fa fa-angle-right"></i> (도메인 선택) <i class="fa fa-angle-right"></i> 관리 <i class="fa fa-angle-right"></i> (톱니바퀴 아이콘 클릭) <i class="fa fa-angle-right"></i> 왼쪽 메뉴에서 DNS 및 네임서버 클릭</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
      <td>로그인 <i class="fa fa-angle-right"></i> 패널 <i class="fa fa-angle-right"></i> 도메인 <i class="fa fa-angle-right"></i> 도메인 관리 <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
      <td>로그인 <i class="fa fa-angle-right"></i> 개요 <i class="fa fa-angle-right"></i> 관리 <i class="fa fa-angle-right"></i> 간단 편집기 <i class="fa fa-angle-right"></i> 레코드</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
      <td>로그인 <i class="fa fa-angle-right"></i> (도메인 선택) <i class="fa fa-angle-right"></i> 관리 <i class="fa fa-angle-right"></i> 존 편집</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> 시청</a>
      </td>
      <td>로그인 <i class="fa fa-angle-right"></i> 내 도메인 관리 <i class="fa fa-angle-right"></i> (도메인 선택) <i class="fa fa-angle-right"></i> DNS 관리</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google Domains</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> 시청</a>
      </td>
      <td>로그인 <i class="fa fa-angle-right"></i> (도메인 선택) <i class="fa fa-angle-right"></i> DNS 구성</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> 시청</a>
      </td>
      <td>로그인 <i class="fa fa-angle-right"></i> 도메인 목록 <i class="fa fa-angle-right"></i> (도메인 선택) <i class="fa fa-angle-right"></i> 관리 <i class="fa fa-angle-right"></i> 고급 DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
      <td>로그인 <i class="fa fa-angle-right"></i> (도메인 선택) <i class="fa fa-angle-right"></i> Netlify DNS 설정</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Solutions</a></td>
      <td>로그인 <i class="fa fa-angle-right"></i> 계정 관리자 <i class="fa fa-angle-right"></i> 내 도메인 이름 <i class="fa fa-angle-right"></i> (도메인 선택) <i class="fa fa-angle-right"></i> 관리 <i class="fa fa-angle-right"></i> 도메인 포인트 변경 <i class="fa fa-angle-right"></i> 고급 DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> 시청</a>
      </td>
      <td>로그인 <i class="fa fa-angle-right"></i> 관리 도메인 <i class="fa fa-angle-right"></i> (도메인 선택) <i class="fa fa-angle-right"></i> DNS 설정</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
      <td>로그인 <i class="fa fa-angle-right"></i> 홈 메뉴 <i class="fa fa-angle-right"></i> 설정 <i class="fa fa-angle-right"></i> 도메인 <i class="fa fa-angle-right"></i> (도메인 선택) <i class="fa fa-angle-right"></i>
고급 설정 <i class="fa fa-angle-right"></i> 사용자 정의 레코드</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Vercel's Now</a></td>
      <td>"now" CLI 사용 <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
      <td>로그인 <i class="fa fa-angle-right"></i> 도메인 페이지 <i class="fa fa-angle-right"></i> (도메인 선택) <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
      <td>로그인 <i class="fa fa-angle-right"></i> 도메인 페이지 <i class="fa fa-angle-right"></i> (<i class="fa fa-ellipsis-h"></i> 아이콘 클릭) <i class="fa fa-angle-right"></i> DNS 레코드 관리 선택</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
      <td>로그인 <i class="fa fa-angle-right"></i> 도메인 <i class="fa fa-angle-right"></i> 내 도메인</td>
    </tr>
    <tr>
      <td>기타</td>
      <td>
        <div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">중요:</strong> 등록기관 이름이 목록에 없나요? 인터넷에서 "how to change DNS records on $REGISTRAR" (여기서 $REGISTRAR는 등록기관 이름, 예: GoDaddy 사용 시 "how to change DNS records on GoDaddy")를 검색하세요.</div>
      </td>
    </tr>
  </tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">등록기관의 DNS 관리 페이지(열어둔 다른 탭)를 사용하여 다음 "MX" 레코드를 설정하세요:
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    중요:
  </strong>
  <span>
    다른 MX 레코드는 절대 설정하면 안 됩니다. 아래에 표시된 두 레코드가 반드시 존재해야 합니다. 오타가 없는지, mx1과 mx2가 정확히 맞게 입력되었는지 꼭 확인하세요. 이미 MX 레코드가 존재한다면 완전히 삭제해 주세요.
    "TTL" 값은 반드시 3600일 필요는 없으며, 필요에 따라 더 낮거나 높은 값으로 설정할 수 있습니다.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Priority</th>
      <th>Answer/Value</th>
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

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">등록기관의 DNS 관리 페이지(열어둔 다른 탭)에서 다음 <strong class="notranslate">TXT</strong> 레코드를 설정하세요:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    중요:
  </strong>
  <span>
    유료 플랜을 사용 중이라면 이 단계를 완전히 건너뛰고 5단계로 바로 이동하세요! 유료 플랜이 아니라면, 전달된 주소들이 공개적으로 검색 가능해집니다 – <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">내 계정 <i class="fa fa-angle-right"></i> 도메인</a>으로 가서 원한다면 도메인을 유료 플랜으로 업그레이드하세요. 유료 플랜에 대해 더 알고 싶다면 <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">가격 정책</a> 페이지를 참고하세요. 그렇지 않으면 아래 옵션 A부터 옵션 F 중 하나 이상을 선택해 계속 진행할 수 있습니다.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    옵션 A:
  </strong>
  <span>
    도메인의 모든 이메일(예: "all@example.com", "hello@example.com" 등)을 특정 주소 "user@gmail.com"으로 전달하는 경우:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
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
    위 "값" 열의 내용을 반드시 본인의 이메일 주소로 바꾸세요. "TTL" 값은 반드시 3600일 필요 없으며, 필요에 따라 더 낮거나 높은 값으로 설정할 수 있습니다. TTL 값이 낮을수록 DNS 레코드 변경 사항이 인터넷 전역에 더 빨리 전파됩니다 – 이는 메모리 내 캐시 유지 시간(초 단위)과 같습니다. <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">위키피디아의 TTL 설명</a>에서 더 자세히 알아볼 수 있습니다.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    옵션 B:
  </strong>
  <span>
    단일 이메일 주소만 전달하려는 경우(예: <code>hello@example.com</code>을 <code>user@gmail.com</code>으로; 이 경우 "hello+test@example.com"도 자동으로 "user+test@gmail.com"으로 전달됨):
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
    여러 이메일을 전달하는 경우 쉼표로 구분해야 합니다:
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
    무한한 수의 전달 이메일을 설정할 수 있습니다 – 단일 줄에 255자를 넘지 않도록 하고 각 줄은 "forward-email="로 시작해야 합니다. 아래에 예시가 제공되어 있습니다:
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
      <td><em>"@", ".", 또는 공백</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", 또는 공백</em></td>
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
    <strong class="notranslate">TXT</strong> 레코드에 도메인 이름을 지정하여 전역 별칭 전달을 할 수도 있습니다 (예: "user@example.com"이 "user@example.net"으로 전달됨):
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
    웹훅을 전역 또는 개별 별칭으로 사용하여 이메일을 전달할 수도 있습니다. 아래 <a href="#do-you-support-webhooks" class="alert-link">웹훅을 지원하나요</a> 섹션에서 예시와 전체 내용을 확인하세요.
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
    별칭을 매칭하고 이메일 전달을 위한 치환을 처리하기 위해 정규 표현식("regex")을 사용할 수도 있습니다. 아래 <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">정규 표현식 또는 regex를 지원하나요</a> 섹션과 예제를 참조하세요.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>치환이 포함된 고급 정규식이 필요하신가요?</strong> 아래 <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">정규 표현식 또는 regex를 지원하나요</a> 섹션과 예제를 참조하세요.
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>간단한 예:</strong> `linus@example.com` 또는 `torvalds@example.com`으로 가는 모든 이메일을 `user@gmail.com`으로 전달하고 싶다면:
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
    캐치올 전달 규칙은 "낙차(fall-through)"라고도 설명할 수 있습니다.
    이는 최소 하나의 특정 전달 규칙과 일치하는 수신 이메일이 캐치올 대신 사용된다는 의미입니다.
    특정 규칙에는 이메일 주소와 정규 표현식이 포함됩니다.
    <br /><br />
    예를 들어:
    <br />
    <code>forward-email=hello:first@gmail.com,second@gmail.com</code>
    <br />
    이 구성에서는 <code>hello@example.com</code>으로 보내진 이메일이 <code>second@gmail.com</code>(캐치올)로 전달되지 않고, 오직 <code>first@gmail.com</code>으로만 전달됩니다.
  </span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">등록기관의 DNS 관리 페이지(열어둔 다른 탭)를 사용하여 다음 <strong class="notranslate">TXT</strong> 레코드를 추가로 설정하세요:

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
    Gmail(예: 메일 보내기 기능) 또는 G Suite를 사용하는 경우 위 값에 <code>include:_spf.google.com</code>을 추가해야 합니다. 예를 들어:
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
    이미 "v=spf1"이 포함된 유사한 라인이 있다면, 기존 "include:host.com" 레코드 바로 앞과 같은 줄의 "-all" 앞에 <code>include:spf.forwardemail.net</code>을 추가해야 합니다. 예를 들어:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    "-all"과 "~all"은 차이가 있습니다. "-"는 SPF 검사가 일치하지 않을 경우 실패(FAIL)해야 함을 나타내고, "~"는 소프트 실패(SOFTFAIL)를 의미합니다. 도메인 위조 방지를 위해 "-all" 방식을 사용하는 것을 권장합니다.
    <br /><br />
    또한 메일을 보내는 호스트(예: Outlook)의 SPF 레코드를 포함해야 할 수도 있습니다.
  </span>
</div>
</li><li class="mb-2 mb-md-3 mb-lg-5">우리의 "레코드 확인" 도구를 사용하여 DNS 레코드를 확인하세요. 도구는 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 설정에서 이용할 수 있습니다.

</li><li class="mb-2 mb-md-3 mb-lg-5">작동 여부를 확인하기 위해 테스트 이메일을 보내세요. DNS 레코드가 전파되는 데 시간이 걸릴 수 있다는 점을 유의하세요.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    팁:
  </strong>
  <span>
  </span>
    테스트 이메일을 받지 못하거나 "이 메시지에 주의하세요"라는 내용의 테스트 이메일을 받는 경우, 각각 <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">테스트 이메일을 받지 못하는 이유</a>와 <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Gmail에서 자신에게 보낸 테스트 이메일이 "의심스러움"으로 표시되는 이유</a>에 대한 답변을 참조하세요.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Gmail에서 "다른 이름으로 메일 보내기"를 사용하려면 <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">이 영상을 시청</a></strong>하거나 아래 <a href="#how-to-send-mail-as-using-gmail">Gmail을 사용하여 메일 보내기 설정 방법</a> 단계를 따르세요.

</li></ol>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      축하합니다!
    </strong>
    <span>
      모든 단계를 성공적으로 완료하셨습니다.
    </span>
  </div>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    팁:
  </strong>
  <span>
    선택적 추가 기능이 아래에 나열되어 있습니다. 이 추가 기능들은 완전히 선택 사항이며 반드시 필요하지 않을 수 있습니다. 필요할 경우 추가 정보를 제공하고자 합니다.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    선택적 추가 기능:
  </strong>
  <span>
    <a class="alert-link" href="#how-to-send-mail-as-using-gmail">Gmail을 사용하여 메일 보내기</a> 기능을 사용하는 경우, 허용 목록에 자신을 추가하는 것이 좋습니다. 이 주제에 관한 <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">Gmail의 지침</a>을 참조하세요.
  </span>
</div>

### 고급 전달을 위해 여러 MX 교환기 및 서버를 사용할 수 있나요? {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

예, 하지만 **DNS 레코드에는 하나의 MX 교환기만 등록해야 합니다**.

여러 MX 교환기를 구성하기 위해 "우선순위"를 사용하는 시도는 하지 마세요.

대신, 기존 MX 교환기를 구성하여 일치하지 않는 모든 별칭에 대한 메일을 우리 서비스의 교환기(`mx1.forwardemail.net` 및/또는 `mx2.forwardemail.net`)로 전달하도록 해야 합니다.

Google Workspace를 사용 중이며 일치하지 않는 모든 별칭을 우리 서비스로 전달하려면 <https://support.google.com/a/answer/6297084>를 참조하세요.

Microsoft 365(Outlook)를 사용 중이며 일치하지 않는 모든 별칭을 우리 서비스로 전달하려면 <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> 및 <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>를 참조하세요.

### 휴가 자동응답기(부재중 자동응답기)를 어떻게 설정하나요? {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

<a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 별칭으로 이동하여 휴가 자동응답기를 설정하려는 별칭을 생성하거나 편집하세요.
시작 날짜, 종료 날짜, 제목 및 메시지를 구성하고 언제든지 활성화 또는 비활성화할 수 있습니다:

* 현재는 일반 텍스트 제목과 메시지만 지원됩니다 (`striptags` 패키지를 내부적으로 사용하여 모든 HTML을 제거합니다).
* 제목은 100자 이내로 제한됩니다.
* 메시지는 1000자 이내로 제한됩니다.
* 설정하려면 아웃바운드 SMTP 구성이 필요합니다 (예: DKIM, DMARC 및 Return-Path DNS 레코드를 설정해야 합니다).
  * <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 설정 <i class="fa fa-angle-right"></i> 아웃바운드 SMTP 구성으로 이동하여 설정 지침을 따르세요.
* 글로벌 바니티 도메인 이름에서는 휴가 응답기를 활성화할 수 없습니다 (예: [일회용 주소](/disposable-addresses)는 지원되지 않습니다).
* 와일드카드/캐치올(`*`) 또는 정규 표현식을 사용하는 별칭에는 휴가 응답기를 활성화할 수 없습니다.

`postfix`와 같은 메일 시스템(예: `sieve` 휴가 필터 확장 사용)과 달리 – Forward Email은 자동으로 DKIM 서명을 추가하고, 휴가 응답을 보낼 때 연결 문제를 방지하며(예: 일반적인 SSL/TLS 연결 문제 및 유지 관리되는 레거시 서버로 인한 문제), 휴가 응답에 대해 Open WKD 및 PGP 암호화도 지원합니다.

<!--
* 남용을 방지하기 위해, 휴가 응답 메시지 1건당 아웃바운드 SMTP 크레딧 1개가 차감됩니다.
  * 모든 유료 계정은 기본적으로 하루 300 크레딧을 포함합니다. 더 많은 크레딧이 필요하면 문의해 주세요.
-->

1. [허용 목록](#do-you-have-an-allowlist)에 있는 발신자에게는 4일마다 한 번만 보냅니다 (이는 Gmail의 동작과 유사합니다).

   * Redis 캐시는 `alias_id`와 `sender`의 지문을 사용하며, 여기서 `alias_id`는 별칭 MongoDB ID이고 `sender`는 허용 목록에 있으면 From 주소, 없으면 From 주소의 루트 도메인입니다. 간단히 하기 위해 이 지문의 캐시 만료 시간은 4일로 설정되어 있습니다.

   * 허용 목록에 없는 발신자에 대해 From 주소에서 파싱한 루트 도메인을 사용하는 방식은 비교적 알려지지 않은 발신자(예: 악의적인 행위자)가 휴가 응답 메시지를 대량으로 보내는 것을 방지합니다.

2. MAIL FROM 및/또는 From이 비어 있지 않고 (대소문자 구분 없이) [postmaster 사용자 이름](#what-are-postmaster-addresses)(이메일의 @ 앞 부분)을 포함하지 않을 때만 보냅니다.

3. 원본 메시지에 다음 헤더가 있으면 (대소문자 구분 없이) 보내지 않습니다:

   * 값이 `no`가 아닌 `auto-submitted` 헤더.
   * 값이 `dr`, `autoreply`, `auto-reply`, `auto_reply`, 또는 `all`인 `x-auto-response-suppress` 헤더.
   * 값과 상관없이 `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond`, 또는 `x-auto-respond` 헤더.
   * 값이 `bulk`, `autoreply`, `auto-reply`, `auto_reply`, 또는 `list`인 `precedence` 헤더.

4. MAIL FROM 또는 From 이메일 주소가 `+donotreply`, `-donotreply`, `+noreply`, 또는 `-noreply`로 끝나면 보내지 않습니다.

5. From 이메일 주소의 사용자 이름 부분이 `mdaemon`이고 대소문자 구분 없이 `X-MDDSN-Message` 헤더가 있으면 보내지 않습니다.

6. 대소문자 구분 없이 `content-type` 헤더가 `multipart/report`인 경우 보내지 않습니다.

### Forward Email용 SPF 설정 방법 {#how-do-i-set-up-spf-for-forward-email}

등록기관의 DNS 관리 페이지에서 다음 <strong class="notranslate">TXT</strong> 레코드를 설정하세요:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>이름/호스트/별칭</th>
      <th class="text-center">TTL</th>
      <th>유형</th>
      <th>응답/값</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", 또는 빈칸</em></td>
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
    Gmail(예: 보내는 사람으로 메일 보내기) 또는 G Suite를 사용하는 경우 위 값에 <code>include:_spf.google.com</code>을 추가해야 합니다. 예를 들어:
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
    Microsoft Outlook 또는 Live.com을 사용하는 경우, SPF <strong class="notranslate">TXT</strong> 레코드에 <code>include:spf.protection.outlook.com</code>을 추가해야 합니다. 예를 들어:
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
    이미 "v=spf1"이 포함된 유사한 줄이 있다면, 기존의 "include:host.com" 레코드 바로 앞과 같은 줄의 "-all" 앞에 <code>include:spf.forwardemail.net</code>을 추가해야 합니다. 예를 들어:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    "-all"과 "~all"은 차이가 있습니다. "-"는 SPF 검사가 일치하지 않을 경우 실패(FAIL)해야 함을 의미하고, "~"는 SPF 검사가 소프트 실패(SOFTFAIL)해야 함을 의미합니다. 도메인 위조를 방지하기 위해 "-all" 방식을 사용하는 것을 권장합니다.
    <br /><br />
    또한 메일을 보내는 호스트(예: Outlook)에 대한 SPF 레코드를 포함해야 할 수도 있습니다.
  </span>
</div>

### Forward Email용 DKIM 설정 방법 {#how-do-i-set-up-dkim-for-forward-email}

<a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 설정 <i class="fa fa-angle-right"></i> 아웃바운드 SMTP 구성으로 이동하여 설정 지침을 따르세요.

### Forward Email용 DMARC 설정 방법 {#how-do-i-set-up-dmarc-for-forward-email}

<a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 설정 <i class="fa fa-angle-right"></i> 아웃바운드 SMTP 구성으로 이동하여 설정 지침을 따르세요.

### DMARC 보고서 보는 방법 {#how-do-i-view-dmarc-reports}

Forward Email은 모든 도메인에서 이메일 인증 성능을 단일 인터페이스로 모니터링할 수 있는 종합적인 DMARC 보고서 대시보드를 제공합니다.

**DMARC 보고서란?**

DMARC(도메인 기반 메시지 인증, 보고 및 준수) 보고서는 수신 메일 서버가 보내는 XML 파일로, 이메일이 어떻게 인증되고 있는지 알려줍니다. 이 보고서는 다음을 이해하는 데 도움이 됩니다:

* 도메인에서 얼마나 많은 이메일이 발송되고 있는지
* 해당 이메일이 SPF 및 DKIM 인증을 통과하는지 여부
* 수신 서버가 취하는 조치(수락, 격리, 거부)
* 도메인을 대신해 이메일을 보내는 IP 주소

**DMARC 보고서 접근 방법**

<a href="/my-account/dmarc-reports" class="alert-link" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> DMARC 보고서</a>로 이동하여 대시보드를 확인하세요. 또한 <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a>에서 각 도메인 옆의 "DMARC" 버튼을 클릭하여 도메인별 보고서에 접근할 수 있습니다.

**대시보드 기능**

DMARC 보고서 대시보드는 다음을 제공합니다:

* **요약 지표**: 수신된 총 보고서 수, 분석된 총 메시지 수, SPF 정렬률, DKIM 정렬률, 전체 통과율
* **시간별 메시지 차트**: 지난 30일간 이메일 발송량 및 인증률의 시각적 추세
* **정렬 요약**: SPF와 DKIM 정렬 분포를 보여주는 도넛 차트
* **메시지 처리 현황**: 수신 서버가 이메일을 어떻게 처리했는지(수락, 격리, 거부)를 보여주는 누적 막대 차트
* **최근 보고서 표**: 개별 DMARC 보고서의 상세 목록(필터링 및 페이지네이션 가능)
* **도메인 필터링**: 여러 도메인을 관리할 때 특정 도메인별로 보고서를 필터링 가능
**이것이 중요한 이유**

여러 도메인을 관리하는 조직(기업, 비영리 단체, 에이전시 등)의 경우, DMARC 보고서는 다음을 위해 필수적입니다:

* **무단 발신자 식별**: 누군가가 귀하의 도메인을 스푸핑하는지 감지
* **전달률 향상**: 합법적인 이메일이 인증을 통과하도록 보장
* **이메일 인프라 모니터링**: 어떤 서비스와 IP가 귀하를 대신해 발송하는지 추적
* **규정 준수**: 보안 감사용 이메일 인증 가시성 유지

별도의 DMARC 모니터링 도구가 필요한 다른 서비스와 달리, Forward Email은 추가 비용 없이 계정 내에서 DMARC 보고서 처리 및 시각화를 포함합니다.

**요구 사항**

* DMARC 보고서는 유료 플랜에서만 제공됩니다
* 도메인에 DMARC가 구성되어 있어야 합니다 ([Forward Email용 DMARC 설정 방법](#how-do-i-set-up-dmarc-for-forward-email) 참조)
* 보고서는 수신 메일 서버가 구성된 DMARC 보고 주소로 전송할 때 자동으로 수집됩니다

**주간 이메일 보고서**

유료 플랜 사용자는 주간 DMARC 보고서 요약을 이메일로 자동 수신합니다. 이 이메일에는 다음이 포함됩니다:

* 모든 도메인에 대한 요약 통계
* SPF 및 DKIM 정렬 비율
* 메시지 처리 결과 분류(수락, 격리, 거부)
* 주요 보고 기관(Google, Microsoft, Yahoo 등)
* 주의가 필요한 정렬 문제 IP 주소
* DMARC 보고서 대시보드로 직접 연결되는 링크

주간 보고서는 자동으로 발송되며 다른 이메일 알림과 별도로 비활성화할 수 없습니다.

### 연락처 연결 및 구성 방법 {#how-do-i-connect-and-configure-my-contacts}

**연락처를 구성하려면 다음 CardDAV URL을 사용하세요:** `https://carddav.forwardemail.net` (또는 클라이언트가 허용하면 단순히 `carddav.forwardemail.net`)

### 캘린더 연결 및 구성 방법 {#how-do-i-connect-and-configure-my-calendars}

**캘린더를 구성하려면 다음 CalDAV URL을 사용하세요:** `https://caldav.forwardemail.net` (또는 클라이언트가 허용하면 단순히 `caldav.forwardemail.net`)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Forward Email Calendar CalDAV Thunderbird Example Setup" />

### 추가 캘린더 추가 및 기존 캘린더 관리 방법 {#how-do-i-add-more-calendars-and-manage-existing-calendars}

추가 캘린더를 추가하려면 새 캘린더 URL로 다음을 추가하세요: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**`calendar-name`을 원하는 캘린더 이름으로 반드시 교체하세요**)

캘린더 생성 후 이름과 색상을 변경할 수 있습니다 – 선호하는 캘린더 애플리케이션(예: Apple Mail 또는 [Thunderbird](https://thunderbird.net))을 사용하세요.

### 작업 및 알림 연결 및 구성 방법 {#how-do-i-connect-and-configure-tasks-and-reminders}

**작업 및 알림을 구성하려면 캘린더와 동일한 CalDAV URL을 사용하세요:** `https://caldav.forwardemail.net` (또는 클라이언트가 허용하면 단순히 `caldav.forwardemail.net`)

작업과 알림은 자동으로 캘린더 이벤트와 분리되어 별도의 "Reminders" 또는 "Tasks" 캘린더 컬렉션으로 관리됩니다.

**플랫폼별 설정 지침:**

**macOS/iOS:**

1. 시스템 환경설정 > 인터넷 계정(또는 iOS의 설정 > 계정)에서 새 CalDAV 계정 추가
2. 서버에 `caldav.forwardemail.net` 입력
3. Forward Email 별칭과 생성된 비밀번호 입력
4. 설정 후 "Calendar"와 "Reminders" 컬렉션 모두 표시됨
5. Reminders 앱을 사용해 작업 생성 및 관리

**Android (Tasks.org 사용 시):**

1. Google Play 스토어나 F-Droid에서 Tasks.org 설치
2. 설정 > 동기화 > 계정 추가 > CalDAV 선택
3. 서버에 `https://caldav.forwardemail.net` 입력
4. Forward Email 별칭과 생성된 비밀번호 입력
5. Tasks.org가 자동으로 작업 캘린더를 발견

**Thunderbird:**

1. Lightning 애드온이 설치되어 있지 않으면 설치
2. 새 캘린더를 "CalDAV" 유형으로 생성
3. URL에 `https://caldav.forwardemail.net` 입력
4. Forward Email 자격 증명 입력
5. 이벤트와 작업 모두 캘린더 인터페이스에서 사용 가능

### macOS Reminders에서 작업을 생성할 수 없는 이유 {#why-cant-i-create-tasks-in-macos-reminders}
macOS 미리 알림에서 작업 생성에 문제가 있는 경우, 다음 문제 해결 단계를 시도해 보세요:

1. **계정 설정 확인**: CalDAV 계정이 `caldav.forwardemail.net`으로 올바르게 구성되었는지 확인하세요

2. **별도의 캘린더 확인**: 계정에서 "캘린더"와 "미리 알림"이 모두 보여야 합니다. "캘린더"만 보인다면 작업 지원이 아직 완전히 활성화되지 않은 것일 수 있습니다.

3. **계정 새로 고침**: 시스템 환경설정 > 인터넷 계정에서 CalDAV 계정을 제거한 후 다시 추가해 보세요

4. **서버 연결 확인**: 브라우저에서 `https://caldav.forwardemail.net`에 접속할 수 있는지 테스트하세요

5. **자격 증명 확인**: 올바른 별칭 이메일과 생성된 비밀번호(계정 비밀번호가 아님)를 사용하고 있는지 확인하세요

6. **강제 동기화**: 미리 알림 앱에서 작업을 생성한 후 수동으로 동기화를 새로 고침해 보세요

**일반적인 문제:**

* **"미리 알림 캘린더를 찾을 수 없음"**: 서버가 처음 접근 시 미리 알림 컬렉션을 생성하는 데 시간이 필요할 수 있습니다
* **작업이 동기화되지 않음**: 두 장치 모두 동일한 CalDAV 계정 자격 증명을 사용하는지 확인하세요
* **혼합된 콘텐츠**: 작업이 일반 "캘린더"가 아닌 "미리 알림" 캘린더에 생성되고 있는지 확인하세요

### Android에서 Tasks.org 설정 방법 {#how-do-i-set-up-tasksorg-on-android}

Tasks.org는 Forward Email의 CalDAV 작업 지원과 훌륭하게 작동하는 인기 있는 오픈 소스 작업 관리자입니다.

**설치 및 설정:**

1. **Tasks.org 설치**:
   * 구글 플레이 스토어에서: [Tasks.org](https://play.google.com/store/apps/details?id=org.tasks)
   * F-Droid에서: [Tasks.org on F-Droid](https://f-droid.org/packages/org.tasks/)

2. **CalDAV 동기화 구성**:
   * Tasks.org를 엽니다
   * ☰ 메뉴 > 설정 > 동기화로 이동합니다
   * "계정 추가"를 탭합니다
   * "CalDAV"를 선택합니다

3. **Forward Email 설정 입력**:
   * **서버 URL**: `https://caldav.forwardemail.net`
   * **사용자 이름**: Forward Email 별칭 (예: `you@yourdomain.com`)
   * **비밀번호**: 별칭별로 생성된 비밀번호
   * "계정 추가"를 탭합니다

4. **계정 검색**:
   * Tasks.org가 자동으로 작업 캘린더를 검색합니다
   * "미리 알림" 컬렉션이 나타나야 합니다
   * 작업 캘린더 동기화를 활성화하려면 "구독"을 탭하세요

5. **동기화 테스트**:
   * Tasks.org에서 테스트 작업을 생성합니다
   * 다른 CalDAV 클라이언트(예: macOS 미리 알림)에서 작업이 나타나는지 확인합니다
   * 양방향 동기화가 정상 작동하는지 검증합니다

**사용 가능한 기능:**

* ✅ 작업 생성 및 편집
* ✅ 마감일 및 알림
* ✅ 작업 완료 및 상태
* ✅ 우선순위 수준
* ✅ 하위 작업 및 작업 계층 구조
* ✅ 태그 및 카테고리
* ✅ 다른 CalDAV 클라이언트와의 양방향 동기화

**문제 해결:**

* 작업 캘린더가 나타나지 않으면 Tasks.org 설정에서 수동 새로 고침을 시도하세요
* 서버에 최소한 하나의 작업이 생성되어 있는지 확인하세요 (macOS 미리 알림에서 먼저 생성 가능)
* `caldav.forwardemail.net`에 대한 네트워크 연결을 확인하세요

### Forward Email용 SRS 설정 방법 {#how-do-i-set-up-srs-for-forward-email}

[발신자 재작성 스킴](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme)("SRS")는 자동으로 구성되므로 직접 설정할 필요가 없습니다.

### Forward Email용 MTA-STS 설정 방법 {#how-do-i-set-up-mta-sts-for-forward-email}

자세한 내용은 [MTA-STS 관련 섹션](#do-you-support-mta-sts)을 참고하세요.

### 이메일 주소에 프로필 사진 추가 방법 {#how-do-i-add-a-profile-picture-to-my-email-address}

Gmail을 사용 중이라면 아래 단계를 따르세요:

1. <https://google.com>에 접속하여 모든 이메일 계정에서 로그아웃합니다
2. "로그인"을 클릭하고 드롭다운에서 "다른 계정"을 클릭합니다
3. "다른 계정 사용"을 선택합니다
4. "계정 만들기"를 선택합니다
5. "대신 현재 이메일 주소 사용"을 선택합니다
6. 사용자 지정 도메인 이메일 주소를 입력합니다
7. 이메일 주소로 전송된 확인 이메일을 받습니다
8. 이메일에 있는 확인 코드를 입력합니다
9. 새 Google 계정의 프로필 정보를 완성합니다
10. 모든 개인정보 보호 및 이용 약관에 동의합니다
11. <https://google.com>에 접속하여 오른쪽 상단의 프로필 아이콘을 클릭한 후 "변경" 버튼을 클릭합니다
12. 계정용 새 사진 또는 아바타를 업로드합니다
13. 변경 사항이 전파되는 데 약 1-2시간이 걸리지만 때로는 매우 빠를 수 있습니다
14. 테스트 이메일을 보내면 프로필 사진이 표시됩니다.
## 고급 기능 {#advanced-features}

### 마케팅 관련 이메일을 위한 뉴스레터 또는 메일링 리스트를 지원하나요? {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

네, 자세한 내용은 <https://forwardemail.net/guides/newsletter-with-listmonk>에서 확인할 수 있습니다.

IP 평판을 유지하고 전달 가능성을 보장하기 위해 Forward Email은 **뉴스레터 승인**을 위해 도메인별 수동 검토 절차를 운영하고 있습니다. 승인을 위해 <support@forwardemail.net>으로 이메일을 보내거나 [도움 요청](https://forwardemail.net/help)을 열어주세요. 일반적으로 24시간 이내에 처리되며 대부분의 요청은 1-2시간 내에 승인됩니다. 가까운 미래에는 추가 스팸 제어 및 알림 기능과 함께 이 절차를 즉시 처리할 수 있도록 할 예정입니다. 이 절차는 이메일이 받은편지함에 도달하고 메시지가 스팸으로 표시되지 않도록 보장합니다.

### API를 통한 이메일 발송을 지원하나요? {#do-you-support-sending-email-with-api}

네, 2023년 5월부터 모든 유료 사용자에게 추가 기능으로 API를 통한 이메일 발송을 지원합니다.

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    중요:
  </strong>
  <span>
    <a href="/terms" class="alert-link" target="_blank">이용 약관</a>, <a href="/privacy" class="alert-link" target="_blank">개인정보 처리방침</a>, 그리고 <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">아웃바운드 SMTP 제한</a>을 반드시 읽어보시기 바랍니다 – 사용하시는 것은 이에 대한 인정과 동의로 간주됩니다.
  </span>
</div>

API 문서 내 [이메일](/email-api#outbound-emails) 섹션에서 옵션, 예제 및 추가 정보를 확인하세요.

API를 통해 아웃바운드 이메일을 보내려면 [내 보안](/my-account/security)에서 확인할 수 있는 API 토큰을 사용해야 합니다.

### IMAP을 통한 이메일 수신을 지원하나요? {#do-you-support-receiving-email-with-imap}

네, 2023년 10월 16일부터 모든 유료 사용자에게 추가 기능으로 IMAP을 통한 이메일 수신을 지원합니다. **[암호화된 SQLite 메일박스 저장 기능 작동 방식](/blog/docs/best-quantum-safe-encrypted-email-service)**에 관한 심층 기사를 꼭 읽어보시기 바랍니다.

<div id="imap-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    중요:
  </strong>
  <span>
    <a href="/terms" class="alert-link" target="_blank">이용 약관</a>과 <a href="/privacy" class="alert-link" target="_blank">개인정보 처리방침</a>을 반드시 읽어보시기 바랍니다 – 사용하시는 것은 이에 대한 인정과 동의로 간주됩니다.
  </span>
</div>

1. <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 별칭에서 도메인에 대한 새 별칭을 생성하세요 (예: <code><hello@example.com></code>)

2. 새로 생성한 별칭 옆에 있는 <strong class="text-success"><i class="fa fa-key"></i> 비밀번호 생성</strong>을 클릭하세요. 클립보드에 복사하고 화면에 표시된 생성된 비밀번호를 안전하게 보관하세요.

3. 선호하는 이메일 애플리케이션을 사용하여 새로 생성한 별칭(예: <code><hello@example.com></code>)으로 계정을 추가하거나 구성하세요.
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       팁:
     </strong>
     <span><a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> 또는 <a href="/blog/open-source" class="alert-link" target="_blank">오픈 소스 및 개인정보 보호 중심 대안</a> 사용을 권장합니다.</span>
   </div>

4. IMAP 서버 이름을 묻는 경우 `imap.forwardemail.net`을 입력하세요.

5. IMAP 서버 포트를 묻는 경우 `993` (SSL/TLS)을 입력하세요 – 필요 시 [대체 IMAP 포트](/faq#what-are-your-imap-server-configuration-settings)를 참고하세요.
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       팁:
     </strong>
     <span>Thunderbird를 사용하는 경우 "연결 보안"이 "SSL/TLS"로 설정되어 있고 인증 방법이 "일반 비밀번호"로 설정되어 있는지 확인하세요.</span>
   </div>
6. IMAP 서버 비밀번호를 입력하라는 메시지가 표시되면 위 2단계에서 <strong class="text-success"><i class="fa fa-key"></i> 비밀번호 생성</strong>에서 복사한 비밀번호를 붙여넣으세요.

7. **설정을 저장하세요** – 문제가 발생하면 <a href="/help">문의해 주세요</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      축하합니다!
    </strong>
    <span>
      모든 단계를 성공적으로 완료하셨습니다.
    </span>
  </div>
</div>

</div>

### POP3를 지원하나요? {#do-you-support-pop3}

네, 2023년 12월 4일부터 모든 유료 사용자에게 추가 기능으로 [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol)를 지원합니다. **저희의 암호화된 SQLite 메일박스 저장 기능이 어떻게 작동하는지에 대한 심층 기사**를 꼭 읽어보세요: [how our encrypted SQLite mailbox storage feature works](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="pop3-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    중요:
  </strong>
  <span>
    <a href="/terms" class="alert-link" target="_blank">이용 약관</a>과 <a href="/privacy" class="alert-link" target="_blank">개인정보 처리방침</a>을 반드시 읽으시기 바랍니다 – 사용하시는 것은 동의 및 인정을 의미합니다.
  </span>
</div>

1. <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 별칭에서 도메인에 대한 새 별칭을 만드세요 (예: <code><hello@example.com></code>)

2. 새로 생성한 별칭 옆에 있는 <strong class="text-success"><i class="fa fa-key"></i> 비밀번호 생성</strong>을 클릭하세요. 클립보드에 복사하고 화면에 표시된 생성된 비밀번호를 안전하게 보관하세요.

3. 선호하는 이메일 애플리케이션을 사용하여 새로 만든 별칭으로 계정을 추가하거나 구성하세요 (예: <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       팁:
     </strong>
     <span><a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> 또는 <a href="/blog/open-source" class="alert-link" target="_blank">오픈 소스 및 개인정보 보호 중심 대안</a> 사용을 권장합니다.</span>
   </div>

4. POP3 서버 이름을 입력하라는 메시지가 표시되면 `pop3.forwardemail.net`을 입력하세요.

5. POP3 서버 포트를 입력하라는 메시지가 표시되면 `995` (SSL/TLS)를 입력하세요 – 필요시 [대체 POP3 포트](/faq#what-are-your-pop3-server-configuration-settings)를 참조하세요.
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       팁:
     </strong>
     <span>Thunderbird를 사용하는 경우 "연결 보안"이 "SSL/TLS"로 설정되어 있고 인증 방법이 "일반 비밀번호"로 설정되어 있는지 확인하세요.</span>
   </div>

6. POP3 서버 비밀번호를 입력하라는 메시지가 표시되면 위 2단계에서 <strong class="text-success"><i class="fa fa-key"></i> 비밀번호 생성</strong>에서 복사한 비밀번호를 붙여넣으세요.

7. **설정을 저장하세요** – 문제가 발생하면 <a href="/help">문의해 주세요</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      축하합니다!
    </strong>
    <span>
      모든 단계를 성공적으로 완료하셨습니다.
    </span>
  </div>
</div>

</div>

### 캘린더(CalDAV)를 지원하나요? {#do-you-support-calendars-caldav}

네, 2024년 2월 5일부터 이 기능을 추가했습니다. 저희 서버는 `caldav.forwardemail.net`이며 <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">상태 페이지</a>에서 모니터링 중입니다.
IPv4와 IPv6를 모두 지원하며 포트 `443` (HTTPS)에서 사용할 수 있습니다.

| 로그인    | 예시                       | 설명                                                                                                                                                                                    |
| -------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 사용자명 | `user@example.com`         | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a>에 존재하는 도메인의 별칭 이메일 주소입니다.                          |
| 비밀번호 | `************************` | 별칭별로 생성된 비밀번호입니다.                                                                                                                                                          |

캘린더 지원을 사용하려면, **사용자**는 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a>에 존재하는 도메인의 별칭 이메일 주소여야 하며, **비밀번호**는 별칭별로 생성된 비밀번호여야 합니다.

### 작업 및 알림(CalDAV VTODO)을 지원하나요? {#do-you-support-tasks-and-reminders-caldav-vtodo}

네, 2025년 10월 14일부터 작업 및 알림을 위한 CalDAV VTODO 지원을 추가했습니다. 이는 캘린더 지원과 동일한 서버인 `caldav.forwardemail.net`을 사용합니다.

우리의 CalDAV 서버는 **통합 캘린더**를 사용하여 캘린더 이벤트(VEVENT)와 작업(VTODO) 구성 요소를 모두 지원합니다. 즉, 각 캘린더는 이벤트와 작업을 모두 포함할 수 있어 모든 CalDAV 클라이언트에서 최대한의 유연성과 호환성을 제공합니다.

**캘린더와 목록 작동 방식:**

* **각 캘린더는 이벤트와 작업을 모두 지원** - 어떤 캘린더에도 이벤트, 작업 또는 둘 다 추가할 수 있습니다
* **Apple 알림 목록** - Apple 알림에서 생성하는 각 목록은 서버에서 별도의 캘린더가 됩니다
* **다중 캘린더** - 필요에 따라 원하는 만큼 캘린더를 생성할 수 있으며, 각 캘린더는 고유한 이름, 색상 및 구성을 가집니다
* **클라이언트 간 동기화** - 작업과 이벤트가 모든 호환 클라이언트 간에 원활하게 동기화됩니다

**지원되는 작업 클라이언트:**

* **macOS 알림** - 작업 생성, 편집, 완료 및 동기화를 완벽하게 네이티브 지원
* **iOS 알림** - 모든 iOS 기기에서 완벽한 네이티브 지원
* **Tasks.org (Android)** - CalDAV 동기화를 지원하는 인기 오픈소스 작업 관리자
* **Thunderbird** - 데스크톱 이메일 클라이언트에서 작업 및 캘린더 지원
* **모든 CalDAV 호환 작업 관리자** - 표준 VTODO 구성 요소 지원

**지원되는 작업 기능:**

* 작업 생성, 편집 및 삭제
* 마감일 및 시작일
* 작업 완료 상태 (NEEDS-ACTION, IN-PROCESS, COMPLETED, CANCELLED)
* 작업 우선순위 수준
* 반복 작업
* 작업 설명 및 메모
* 다중 기기 동기화
* RELATED-TO 속성을 가진 하위 작업
* VALARM을 이용한 작업 알림

로그인 자격 증명은 캘린더 지원과 동일합니다:

| 로그인    | 예시                       | 설명                                                                                                                                                                                    |
| -------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 사용자명 | `user@example.com`         | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a>에 존재하는 도메인의 별칭 이메일 주소입니다.                          |
| 비밀번호 | `************************` | 별칭별로 생성된 비밀번호입니다.                                                                                                                                                          |

**중요 참고 사항:**

* **각 알림 목록은 별도의 캘린더입니다** - Apple 알림에서 새 목록을 생성하면 CalDAV 서버에 새 캘린더가 생성됩니다
* **Thunderbird 사용자** - 동기화하려는 각 캘린더/목록을 수동으로 구독하거나 캘린더 홈 URL `https://caldav.forwardemail.net/dav/your-email@domain.com/`을 사용해야 합니다
* **Apple 사용자** - 캘린더 검색이 자동으로 이루어져 모든 캘린더와 목록이 Calendar.app 및 Reminders.app에 표시됩니다
* **통합 캘린더** - 모든 캘린더가 이벤트와 작업을 모두 지원하여 데이터를 조직하는 데 유연성을 제공합니다
### 연락처(CardDAV)를 지원하나요? {#do-you-support-contacts-carddav}

네, 2025년 6월 12일부터 이 기능을 추가했습니다. 저희 서버는 `carddav.forwardemail.net`이며 <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">상태 페이지</a>에서도 모니터링되고 있습니다.

IPv4와 IPv6 모두를 지원하며 포트 `443`(HTTPS)에서 이용 가능합니다.

| 로그인    | 예시                       | 설명                                                                                                                                                                                      |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 사용자명 | `user@example.com`         | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a>에 존재하는 도메인의 별칭 이메일 주소입니다.                      |
| 비밀번호 | `************************` | 별칭별로 생성된 비밀번호입니다.                                                                                                                                                            |

연락처 지원을 사용하려면, **사용자명**은 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a>에 존재하는 도메인의 별칭 이메일 주소여야 하며, **비밀번호**는 별칭별로 생성된 비밀번호여야 합니다.

### SMTP로 이메일 전송을 지원하나요? {#do-you-support-sending-email-with-smtp}

네, 2023년 5월부터 모든 유료 사용자에게 SMTP를 통한 이메일 전송 기능을 애드온으로 지원합니다.

<div id="smtp-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    중요:
  </strong>
  <span>
    저희 <a href="/terms" class="alert-link" target="_blank">이용 약관</a>, <a href="/privacy" class="alert-link" target="_blank">개인정보 처리방침</a>, 그리고 <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">아웃바운드 SMTP 제한</a>을 반드시 읽어주세요 – 사용하시는 것은 동의와 인정을 의미합니다.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    중요:
  </strong>
  <span>
    Gmail을 사용 중이라면 <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">Gmail 맞춤 도메인으로 메일 보내기 가이드</a>를 참고하세요. 개발자라면 <a class="alert-link" href="/email-api#outbound-emails" target="_blank">이메일 API 문서</a>를 참고하세요.
  </span>
</div>

1. <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 설정 <i class="fa fa-angle-right"></i> 아웃바운드 SMTP 구성으로 이동하여 설정 지침을 따르세요.

2. <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 별칭에서 도메인에 대한 새 별칭을 만드세요 (예: <code><hello@example.com></code>)

3. 새로 생성한 별칭 옆에 있는 <strong class="text-success"><i class="fa fa-key"></i> 비밀번호 생성</strong>을 클릭하세요. 클립보드에 복사하고 화면에 표시된 생성된 비밀번호를 안전하게 보관하세요.

4. 선호하는 이메일 애플리케이션에서 새로 생성한 별칭(예: <code><hello@example.com></code>)으로 계정을 추가하거나 구성하세요.
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       팁:
     </strong>
     <span><a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> 또는 <a href="/blog/open-source" class="alert-link" target="_blank">오픈 소스 및 개인정보 보호 중심 대안</a> 사용을 권장합니다.</span>
   </div>
5. SMTP 서버 이름을 묻는 메시지가 표시되면 `smtp.forwardemail.net`을 입력하세요.

6. SMTP 서버 포트를 묻는 메시지가 표시되면 `465` (SSL/TLS)를 입력하세요 – 필요 시 [대체 SMTP 포트](/faq#what-are-your-smtp-server-configuration-settings)를 참조하세요.
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       팁:
     </strong>
     <span>Thunderbird를 사용하는 경우 "연결 보안"이 "SSL/TLS"로 설정되어 있고 인증 방법이 "일반 암호"로 설정되어 있는지 확인하세요.</span>
   </div>

7. SMTP 서버 비밀번호를 묻는 메시지가 표시되면 위 3단계에서 <strong class="text-success"><i class="fa fa-key"></i> 비밀번호 생성</strong>에서 복사한 비밀번호를 붙여넣으세요.

8. **설정을 저장하고 첫 번째 테스트 이메일을 보내세요** – 문제가 발생하면 <a href="/help">문의해 주세요</a>.

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    중요:
  </strong>
  <span>
    IP 평판을 유지하고 전달 가능성을 보장하기 위해, 발신 SMTP 승인에 대해 도메인별 수동 검토 절차가 있음을 알려드립니다. 이 절차는 일반적으로 24시간 이내에 완료되며, 대부분의 요청은 1-2시간 내에 처리됩니다. 가까운 미래에는 추가 스팸 제어 및 알림 기능을 통해 이 과정을 즉시 처리할 수 있도록 할 예정입니다. 이 절차는 이메일이 받은편지함에 도달하고 메시지가 스팸으로 표시되지 않도록 보장합니다.
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      축하합니다!
    </strong>
    <span>
      모든 단계를 성공적으로 완료하셨습니다.
    </span>
  </div>
</div>

</div>

### OpenPGP/MIME, 종단 간 암호화("E2EE"), 및 웹 키 디렉토리("WKD")를 지원하나요? {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

네, 저희는 [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [종단 간 암호화("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption), 그리고 공개 키 검색을 위한 [웹 키 디렉토리("WKD")](https://wiki.gnupg.org/WKD)를 지원합니다. OpenPGP는 [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service)를 사용하거나 [직접 키를 호스팅](https://wiki.gnupg.org/WKDHosting)하여 구성할 수 있습니다 (WKD 서버 설정에 대해서는 [이 gist](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)를 참조하세요).

* WKD 조회 결과는 1시간 동안 캐시되어 신속한 이메일 전달을 보장합니다 → 따라서 WKD 키를 추가, 변경 또는 제거한 경우, 수동으로 캐시를 삭제할 수 있도록 이메일 주소와 함께 `support@forwardemail.net`으로 연락해 주세요.
* WKD 조회를 통해 전달되거나 인터페이스에 업로드된 PGP 키를 사용하는 메시지에 대해 PGP 암호화를 지원합니다.
* 업로드된 키는 PGP 체크박스가 활성화/선택된 경우 우선 적용됩니다.
* 웹훅으로 전송되는 메시지는 현재 PGP로 암호화되지 않습니다.
* 특정 전달 주소에 대해 여러 별칭이 일치하고(예: 정규식/와일드카드/정확한 조합) 이 중 둘 이상에 업로드된 PGP 키가 있고 PGP가 선택된 경우 → 오류 알림 이메일을 보내며 업로드된 PGP 키로 메시지를 암호화하지 않습니다. 이는 매우 드물며 주로 복잡한 별칭 규칙을 가진 고급 사용자에게 해당됩니다.
* **발신자가 DMARC 정책을 reject로 설정한 경우, 저희 MX 서버를 통한 이메일 전달에는 PGP 암호화가 적용되지 않습니다. 모든 메일에 대해 PGP 암호화가 필요하다면, IMAP 서비스를 사용하고 별칭에 대해 PGP 키를 구성하여 수신 메일에 적용할 것을 권장합니다.**

**웹 키 디렉토리 설정은 <https://wkd.chimbosonic.com/> (오픈 소스) 또는 <https://www.webkeydirectory.com/> (상용)에서 검증할 수 있습니다.**

<div class="alert my-3 alert-success">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    자동 암호화:
  </strong>
  <span>저희 <a href="#do-you-support-sending-email-with-smtp" class="alert-link">발신 SMTP 서비스</a>를 사용하여 암호화되지 않은 메시지를 보내는 경우, 수신자별로 <a class="alert-link" href="https://wiki.gnupg.org/WKD">웹 키 디렉토리("WKD")</a>를 사용하여 자동으로 메시지 암호화를 시도합니다.</span>
</div>
<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    중요:
  </strong>
  <span>
    맞춤 도메인 이름에 대해 OpenPGP를 활성화하려면 다음 모든 단계를 반드시 따라야 합니다.
  </span>
</div>

1. 아래에서 이메일 클라이언트에 권장되는 플러그인을 다운로드하고 설치하세요:

   | 이메일 클라이언트    | 플랫폼 | 권장 플러그인                                                                                                                                                                    | 참고                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Thunderbird     | 데스크톱  | [Thunderbird에서 OpenPGP 구성하기](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird는 OpenPGP를 기본 지원합니다.                                                                                                                                                                                                                                                                                                                                                                                            |
   | Gmail           | 브라우저  | [Mailvelope](https://mailvelope.com/) 또는 [FlowCrypt](https://flowcrypt.com/download) (독점 라이선스)                                                                            | Gmail은 OpenPGP를 지원하지 않지만, 오픈 소스 플러그인 [Mailvelope](https://mailvelope.com/) 또는 [FlowCrypt](https://flowcrypt.com/download)를 다운로드할 수 있습니다.                                                                                                                                                                                                                                                                    |
   | Apple Mail      | macOS    | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation)                                                                                          | Apple Mail은 OpenPGP를 지원하지 않지만, 오픈 소스 플러그인 [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation)를 다운로드할 수 있습니다.                                                                                                                                                                                                                                                       |
   | Apple Mail      | iOS      | [PGPro](https://github.com/opensourceios/PGPro/) 또는 [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (독점 라이선스)                           | Apple Mail은 OpenPGP를 지원하지 않지만, 오픈 소스 플러그인 [PGPro](https://github.com/opensourceios/PGPro/) 또는 [FlowCrypt](https://flowcrypt.com/download)를 다운로드할 수 있습니다.                                                                                                                                                                                                                                                    |
   | Outlook         | Windows  | [gpg4win](https://www.gpg4win.de/index.html)                                                                                                                                          | Outlook 데스크톱 메일 클라이언트는 OpenPGP를 지원하지 않지만, 오픈 소스 플러그인 [gpg4win](https://www.gpg4win.de/index.html)을 다운로드할 수 있습니다.                                                                                                                                                                                                                                                                                    |
   | Outlook         | 브라우저  | [Mailvelope](https://mailvelope.com/) 또는 [FlowCrypt](https://flowcrypt.com/download) (독점 라이선스)                                                                            | Outlook 웹 기반 메일 클라이언트는 OpenPGP를 지원하지 않지만, 오픈 소스 플러그인 [Mailvelope](https://mailvelope.com/) 또는 [FlowCrypt](https://flowcrypt.com/download)를 다운로드할 수 있습니다.                                                                                                                                                                                                                                          |
   | Android         | 모바일   | [OpenKeychain](https://www.openkeychain.org/) 또는 [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email)                                                       | [Android 메일 클라이언트](/blog/open-source/android-email-clients)인 [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/)과 [FairEmail](https://github.com/M66B/FairEmail)은 모두 오픈 소스 플러그인 [OpenKeychain](https://www.openkeychain.org/)을 지원합니다. 또는 오픈 소스(독점 라이선스) 플러그인 [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email)를 사용할 수 있습니다. |
   | Google Chrome   | 브라우저  | [Mailvelope](https://mailvelope.com/) 또는 [FlowCrypt](https://flowcrypt.com/download) (독점 라이선스)                                                                            | 오픈 소스 브라우저 확장 프로그램 [Mailvelope](https://mailvelope.com/) 또는 [FlowCrypt](https://flowcrypt.com/download)를 다운로드할 수 있습니다.                                                                                                                                                                                                                                                                                                 |
   | Mozilla Firefox | 브라우저  | [Mailvelope](https://mailvelope.com/) 또는 [FlowCrypt](https://flowcrypt.com/download) (독점 라이선스)                                                                            | 오픈 소스 브라우저 확장 프로그램 [Mailvelope](https://mailvelope.com/) 또는 [FlowCrypt](https://flowcrypt.com/download)를 다운로드할 수 있습니다.                                                                                                                                                                                                                                                                                                 |
   | Microsoft Edge  | 브라우저  | [Mailvelope](https://mailvelope.com/)                                                                                                                                                 | 오픈 소스 브라우저 확장 프로그램 [Mailvelope](https://mailvelope.com/)를 다운로드할 수 있습니다.                                                                                                                                                                                                                                                                                                                                                |
   | Brave           | 브라우저  | [Mailvelope](https://mailvelope.com/) 또는 [FlowCrypt](https://flowcrypt.com/download) (독점 라이선스)                                                                            | 오픈 소스 브라우저 확장 프로그램 [Mailvelope](https://mailvelope.com/) 또는 [FlowCrypt](https://flowcrypt.com/download)를 다운로드할 수 있습니다.                                                                                                                                                                                                                                                                                                 |
   | Balsa           | 데스크톱  | [Balsa에서 OpenPGP 구성하기](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING)                                                                            | Balsa는 OpenPGP를 기본 지원합니다.                                                                                                                                                                                                                                                                                                                                                                                                  |
   | KMail           | 데스크톱  | [KMail에서 OpenPGP 구성하기](https://userbase.kde.org/KMail/PGP_MIME)                                                                                                                 | KMail은 OpenPGP를 기본 지원합니다.                                                                                                                                                                                                                                                                                                                                                                                                  |
   | GNOME Evolution | 데스크톱  | [Evolution에서 OpenPGP 구성하기](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en)                                                                               | GNOME Evolution은 OpenPGP를 기본 지원합니다.                                                                                                                                                                                                                                                                                                                                                                                        |
   | Terminal        | 데스크톱  | [터미널에서 gpg 구성하기](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key)                           | 오픈 소스 [gpg 명령줄 도구](https://www.gnupg.org/download/)를 사용하여 명령줄에서 새 키를 생성할 수 있습니다.                                                                                                                                                                                                                                                                                                            |
2. 플러그인을 열고 공개 키를 생성한 후 이메일 클라이언트가 이를 사용하도록 설정하세요.

3. 공개 키를 <https://keys.openpgp.org/upload>에 업로드하세요.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       팁:
     </strong>
     <span>나중에 키를 관리하려면 <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a>를 방문할 수 있습니다.</span>
   </div>

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       선택적 추가 기능:
     </strong>
     <span>
       당사의 <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">암호화 저장소(IMAP/POP3)</a> 서비스를 사용 중이며 (이미 암호화된) SQLite 데이터베이스에 저장된 <i>모든</i> 이메일을 공개 키로 암호화하려면 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 별칭(예: <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> 편집 <i class="fa fa-angle-right"></i> OpenPGP로 이동하여 공개 키를 업로드하세요.
     </span>
   </div>

4. 도메인 이름(예: `example.com`)에 새 `CNAME` 레코드를 추가하세요:

   <table class="table table-striped table-hover my-3">
     <thead class="thead-dark">
       <tr>
         <th>이름/호스트/별칭</th>
         <th class="text-center">TTL</th>
         <th>유형</th>
         <th>응답/값</th>
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
     <span>별칭이 당사의 <a class="alert-link" href="/disposable-addresses" target="_blank">바니티/일회용 도메인</a>(예: <code>hideaddress.net</code>)을 사용하는 경우 이 단계를 건너뛸 수 있습니다.</span>
   </div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      축하합니다!
    </strong>
    <span>
      모든 단계를 성공적으로 완료하셨습니다.
    </span>
  </div>
</div>

### S/MIME 암호화를 지원하나요? {#do-you-support-smime-encryption}

네, 저희는 [RFC 8551](https://datatracker.ietf.org/doc/html/rfc8551)에 정의된 대로 [S/MIME (Secure/Multipurpose Internet Mail Extensions)](https://en.wikipedia.org/wiki/S/MIME) 암호화를 지원합니다. S/MIME은 X.509 인증서를 사용하여 종단 간 암호화를 제공하며, 기업용 이메일 클라이언트에서 널리 지원됩니다.

저희는 RSA와 ECC(타원 곡선 암호화) 인증서를 모두 지원합니다:

* **RSA 인증서**: 최소 2048비트, 권장 4096비트
* **ECC 인증서**: P-256, P-384, P-521 NIST 곡선

별칭에 대해 S/MIME 암호화를 설정하려면:

1. 신뢰할 수 있는 인증 기관(CA)에서 S/MIME 인증서를 받거나 테스트용으로 자체 서명 인증서를 생성하세요.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       팁:
     </strong>
     <span>무료 S/MIME 인증서는 <a class="alert-link" href="https://www.actalis.com/s-mime-certificates.aspx">Actalis</a> 또는 <a class="alert-link" href="https://extrassl.actalis.com/portal/uapub/freemail">Actalis Free S/MIME</a>와 같은 제공업체에서 받을 수 있습니다.</span>
   </div>

2. 인증서를 PEM 형식으로 내보내세요(공개 인증서만, 개인 키는 제외).

3. <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 별칭(예: <code><hello@example.com></code>) <i class="fa fa-angle-right"></i> 편집 <i class="fa fa-angle-right"></i> S/MIME로 이동하여 공개 인증서를 업로드하세요.
4. 구성되면, 별칭으로 들어오는 모든 이메일은 저장되거나 전달되기 전에 S/MIME 인증서를 사용하여 암호화됩니다.

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       참고:
     </strong>
     <span>
       S/MIME 암호화는 이미 암호화되지 않은 수신 메시지에 적용됩니다. 메시지가 이미 OpenPGP 또는 S/MIME으로 암호화된 경우, 다시 암호화되지 않습니다.
     </span>
   </div>

   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       중요:
     </strong>
     <span>
       발신자가 DMARC 정책을 거부(reject)로 설정한 경우, 당사의 MX 서버를 통한 이메일 전달에는 S/MIME 암호화가 적용되지 않습니다. <em>모든</em> 메일에 대해 S/MIME 암호화가 필요하다면, 당사의 IMAP 서비스를 사용하고 별칭에 대해 수신 메일용 S/MIME 인증서를 구성할 것을 권장합니다.
     </span>
   </div>

다음 이메일 클라이언트는 내장된 S/MIME 지원을 제공합니다:

| 이메일 클라이언트    | 플랫폼   | 참고사항                                                                                                           |
| ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| Apple Mail        | macOS    | 내장된 S/MIME 지원. Mail > 환경설정 > 계정 > 해당 계정 > 신뢰에서 인증서 구성 가능.                                  |
| Apple Mail        | iOS      | 내장된 S/MIME 지원. 설정 > 메일 > 계정 > 해당 계정 > 고급 > S/MIME에서 구성 가능.                                   |
| Microsoft Outlook | Windows  | 내장된 S/MIME 지원. 파일 > 옵션 > 신뢰 센터 > 신뢰 센터 설정 > 이메일 보안에서 구성 가능.                            |
| Microsoft Outlook | macOS    | 내장된 S/MIME 지원. 도구 > 계정 > 고급 > 보안에서 구성 가능.                                                        |
| Thunderbird       | 데스크톱 | 내장된 S/MIME 지원. 계정 설정 > 종단 간 암호화 > S/MIME에서 구성 가능.                                              |
| GNOME Evolution   | 데스크톱 | 내장된 S/MIME 지원. 편집 > 환경설정 > 메일 계정 > 해당 계정 > 보안에서 구성 가능.                                    |
| KMail             | 데스크톱 | 내장된 S/MIME 지원. 설정 > KMail 구성 > 신원 > 해당 신원 > 암호화에서 구성 가능.                                     |

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      축하합니다!
    </strong>
    <span>
      별칭에 대해 S/MIME 암호화를 성공적으로 구성하셨습니다.
    </span>
  </div>
</div>

### Sieve 이메일 필터링을 지원하나요? {#do-you-support-sieve-email-filtering}

네! 저희는 [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)에 정의된 대로 [Sieve](https://en.wikipedia.org/wiki/Sieve_\(mail_filtering_language\)) 이메일 필터링을 지원합니다. Sieve는 서버 측 이메일 필터링을 위한 강력하고 표준화된 스크립팅 언어로, 수신 메시지를 자동으로 정리, 필터링 및 응답할 수 있게 해줍니다.

#### 지원하는 Sieve 확장 {#supported-sieve-extensions}

저희는 다음과 같은 포괄적인 Sieve 확장 세트를 지원합니다:

| 확장                        | RFC                                                                                     | 설명                                             |
| ---------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `fileinto`                   | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                              | 메시지를 특정 폴더에 저장                         |
| `reject` / `ereject`         | [RFC 5429](https://datatracker.ietf.org/doc/html/rfc5429)                              | 오류와 함께 메시지 거부                           |
| `vacation`                   | [RFC 5230](https://datatracker.ietf.org/doc/html/rfc5230)                              | 자동 부재중/휴가 응답                             |
| `vacation-seconds`           | [RFC 6131](https://datatracker.ietf.org/doc/html/rfc6131)                              | 세분화된 휴가 응답 간격                           |
| `imap4flags`                 | [RFC 5232](https://datatracker.ietf.org/doc/html/rfc5232)                              | IMAP 플래그 설정 (\Seen, \Flagged 등)             |
| `envelope`                   | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                              | 봉투 발신자/수신자 테스트                         |
| `body`                       | [RFC 5173](https://datatracker.ietf.org/doc/html/rfc5173)                              | 메시지 본문 내용 테스트                           |
| `variables`                  | [RFC 5229](https://datatracker.ietf.org/doc/html/rfc5229)                              | 스크립트 내 변수 저장 및 사용                      |
| `relational`                 | [RFC 5231](https://datatracker.ietf.org/doc/html/rfc5231)                              | 관계 비교 (크다, 작다)                            |
| `comparator-i;ascii-numeric` | [RFC 4790](https://datatracker.ietf.org/doc/html/rfc4790)                              | 숫자 비교                                        |
| `copy`                       | [RFC 3894](https://datatracker.ietf.org/doc/html/rfc3894)                              | 리디렉션 시 메시지 복사                           |
| `editheader`                 | [RFC 5293](https://datatracker.ietf.org/doc/html/rfc5293)                              | 메시지 헤더 추가 또는 삭제                        |
| `date`                       | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                              | 날짜/시간 값 테스트                              |
| `index`                      | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                              | 특정 헤더 발생 위치 접근                          |
| `regex`                      | [draft-ietf-sieve-regex](https://datatracker.ietf.org/doc/html/draft-ietf-sieve-regex) | 정규 표현식 매칭                                 |
| `enotify`                    | [RFC 5435](https://datatracker.ietf.org/doc/html/rfc5435)                              | 알림 전송 (예: mailto:)                          |
| `environment`                | [RFC 5183](https://datatracker.ietf.org/doc/html/rfc5183)                              | 환경 정보 접근                                   |
| `mailbox`                    | [RFC 5490](https://datatracker.ietf.org/doc/html/rfc5490)                              | 메일박스 존재 테스트, 메일박스 생성               |
| `special-use`                | [RFC 8579](https://datatracker.ietf.org/doc/html/rfc8579)                              | 특수 용도 메일박스에 저장 (\Junk, \Trash 등)      |
| `duplicate`                  | [RFC 7352](https://datatracker.ietf.org/doc/html/rfc7352)                              | 중복 메시지 감지                                |
| `ihave`                      | [RFC 5463](https://datatracker.ietf.org/doc/html/rfc5463)                              | 확장 기능 사용 가능 여부 테스트                    |
| `subaddress`                 | [RFC 5233](https://datatracker.ietf.org/doc/html/rfc5233)                              | 사용자+세부 주소 부분 접근                        |
#### 지원되지 않는 확장 기능 {#extensions-not-supported}

다음 확장 기능은 현재 지원되지 않습니다:

| 확장 기능                                                       | 이유                                                              |
| --------------------------------------------------------------- | ------------------------------------------------------------------- |
| `include`                                                       | 보안 위험(스크립트 인젝션) 및 전역 스크립트 저장소 필요               |
| `mboxmetadata` / `servermetadata`                               | IMAP METADATA 확장 기능 지원 필요                                   |
| `foreverypart` / `mime` / `extracttext` / `replace` / `enclose` | 복잡한 MIME 트리 조작이 아직 구현되지 않음                          |

#### 예제 Sieve 스크립트 {#example-sieve-scripts}

**뉴스레터를 폴더에 분류하기:**

```sieve
require ["fileinto"];

if header :contains "List-Id" "newsletter" {
    fileinto "Newsletters";
}
```

**휴가 중 자동 응답:**

```sieve
require ["vacation"];

vacation :days 7 :subject "Out of Office"
    "현재 부재 중이며 복귀 후 답변드리겠습니다.";
```

**중요 발신자 메시지 표시:**

```sieve
require ["imap4flags"];

if address :is "from" "boss@example.com" {
    setflag "\\Flagged";
}
```

**특정 제목의 스팸 거부:**

```sieve
require ["reject"];

if header :contains "subject" ["lottery", "winner", "urgent transfer"] {
    reject "스팸 내용으로 인해 메시지가 거부되었습니다.";
}
```

#### Sieve 스크립트 관리 {#managing-sieve-scripts}

Sieve 스크립트는 여러 방법으로 관리할 수 있습니다:

1. **웹 인터페이스**: <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 별칭 <i class="fa fa-angle-right"></i> Sieve 스크립트에서 스크립트를 생성하고 관리하세요.

2. **ManageSieve 프로토콜**: Thunderbird의 Sieve 애드온이나 [sieve-connect](https://github.com/philpennock/sieve-connect) 같은 ManageSieve 호환 클라이언트를 사용해 `imap.forwardemail.net`에 연결하세요. 대부분 클라이언트에 권장되는 STARTTLS 포트 `2190` 또는 암시적 TLS 포트 `4190`을 사용합니다.

3. **API**: [REST API](/api#sieve-scripts)를 사용해 프로그래밍 방식으로 스크립트를 관리할 수 있습니다.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    참고:
  </strong>
  <span>
    Sieve 필터링은 메일함에 저장되기 전에 수신 메시지에 적용됩니다. 스크립트는 우선순위 순서대로 실행되며, 첫 번째 일치하는 동작이 메시지 처리 방식을 결정합니다.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    보안:
  </strong>
  <span>
    보안을 위해 리디렉션 동작은 스크립트당 10회, 하루 100회로 제한됩니다. 휴가 응답은 남용 방지를 위해 속도 제한이 적용됩니다.
  </span>
</div>

### MTA-STS를 지원하나요? {#do-you-support-mta-sts}

네, 2023년 3월 2일부터 [MTA-STS](https://www.hardenize.com/blog/mta-sts)를 지원합니다. 도메인에서 활성화하려면 [이 템플릿](https://github.com/jpawlowski/mta-sts.template)을 사용할 수 있습니다.

구성은 GitHub에서 공개되어 있습니다: <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### 패스키 및 WebAuthn을 지원하나요? {#do-you-support-passkeys-and-webauthn}

네! 2023년 12월 13일부터 높은 수요에 따라 [패스키](https://github.com/orgs/forwardemail/discussions/182) 지원을 추가했습니다.

패스키를 사용하면 비밀번호와 2단계 인증 없이 안전하게 로그인할 수 있습니다.

터치, 얼굴 인식, 기기 기반 비밀번호 또는 PIN으로 신원을 확인할 수 있습니다.

최대 30개의 패스키를 한 번에 관리할 수 있어 모든 기기에서 쉽게 로그인할 수 있습니다.

패스키에 대해 더 알아보려면 다음 링크를 참고하세요:

* [패스키로 애플리케이션 및 웹사이트에 로그인하기](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [iPhone에서 앱 및 웹사이트에 패스키로 로그인하기](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [패스키에 관한 위키피디아 문서](https://en.wikipedia.org/wiki/Passkey_\(credential\))
### 이메일 모범 사례를 지원하나요? {#do-you-support-email-best-practices}

네. 모든 요금제에서 SPF, DKIM, DMARC, ARC, SRS에 대한 내장 지원을 제공합니다. 또한 이러한 사양의 원저자 및 다른 이메일 전문가들과 광범위하게 협력하여 완벽함과 높은 전달률을 보장하고 있습니다.

### 바운스 웹훅을 지원하나요? {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    팁:
  </strong>
    이메일 웹훅 문서를 찾고 계신가요? 자세한 내용은 <a href="/faq#do-you-support-webhooks" class="alert-link">웹훅을 지원하나요?</a>를 참조하세요.
  <span>
  </span>
</div>

네, 2024년 8월 14일부터 이 기능을 추가했습니다. 이제 내 계정 → 도메인 → 설정 → 바운스 웹훅 URL로 이동하여 아웃바운드 SMTP 이메일이 바운스될 때마다 `POST` 요청을 보낼 `http://` 또는 `https://` URL을 구성할 수 있습니다.

이 기능은 아웃바운드 SMTP를 관리하고 모니터링하는 데 유용하며, 구독자 유지, 옵트아웃 처리, 바운스 발생 시 감지 등에 사용할 수 있습니다.

바운스 웹훅 페이로드는 다음 속성을 포함하는 JSON 형식으로 전송됩니다:

* `email_id` (문자열) - 내 계정 → 이메일(아웃바운드 SMTP)에서 해당 이메일 ID
* `list_id` (문자열) - 원본 아웃바운드 이메일의 `List-ID` 헤더(대소문자 구분 없음) 값, 있으면
* `list_unsubscribe` (문자열) - 원본 아웃바운드 이메일의 `List-Unsubscribe` 헤더(대소문자 구분 없음) 값, 있으면
* `feedback_id` (문자열) - 원본 아웃바운드 이메일의 `Feedback-ID` 헤더(대소문자 구분 없음) 값, 있으면
* `recipient` (문자열) - 바운스되거나 오류가 발생한 수신자 이메일 주소
* `message` (문자열) - 바운스에 대한 상세 오류 메시지
* `response` (문자열) - SMTP 응답 메시지
* `response_code` (숫자) - 파싱된 SMTP 응답 코드
* `truth_source` (문자열) - 응답 코드가 신뢰할 수 있는 출처에서 온 경우, 루트 도메인 이름(예: `google.com` 또는 `yahoo.com`)이 채워짐
* `bounce` (객체) - 바운스 및 거부 상태를 상세히 나타내는 다음 속성을 포함하는 객체
  * `action` (문자열) - 바운스 동작 (예: `"reject"`)
  * `message` (문자열) - 바운스 사유 (예: `"Message Sender Blocked By Receiving Server"`)
  * `category` (문자열) - 바운스 카테고리 (예: `"block"`)
  * `code` (숫자) - 바운스 상태 코드 (예: `554`)
  * `status` (문자열) - 응답 메시지의 바운스 코드 (예: `5.7.1`)
  * `line` (숫자) - 파싱된 라인 번호, 있으면, [Zone-MTA 바운스 파싱 리스트](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt)에서 (예: `526`)
* `headers` (객체) - 아웃바운드 이메일의 헤더 키-값 쌍
* `bounced_at` (문자열) - 바운스 오류가 발생한 시점의 [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) 형식 날짜

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

바운스 웹훅에 관한 추가 참고 사항은 다음과 같습니다:

* 웹훅 페이로드에 `list_id`, `list_unsubscribe`, 또는 `feedback_id` 값이 포함되어 있으면, 필요에 따라 `recipient`를 목록에서 제거하는 적절한 조치를 취해야 합니다.
  * `bounce.category` 값이 `"block"`, `"recipient"`, `"spam"`, 또는 `"virus"` 중 하나라면 반드시 사용자를 목록에서 제거해야 합니다.
* 웹훅 페이로드가 실제로 우리 서버에서 온 것인지 확인하려면, [역방향 조회를 사용하여 원격 클라이언트 IP 주소의 호스트 이름을 확인](https://nodejs.org/api/dns.html#dnspromisesreverseip)할 수 있습니다 – `smtp.forwardemail.net`이어야 합니다.
  * 또한 [공개된 IP 주소](#what-are-your-servers-ip-addresses)와 IP를 대조할 수 있습니다.
  * 내 계정 → 도메인 → 설정 → 웹훅 서명 페이로드 검증 키에서 웹훅 키를 얻을 수 있습니다.
    * 보안상의 이유로 언제든지 이 키를 교체할 수 있습니다.
    * 이 키를 사용하여 웹훅 요청의 `X-Webhook-Signature` 값과 계산된 본문 값을 비교하여 검증할 수 있습니다. 방법 예시는 [이 Stack Overflow 게시물](https://stackoverflow.com/a/68885281)에서 확인할 수 있습니다.
  * 자세한 내용은 <https://github.com/forwardemail/free-email-forwarding/issues/235> 토론을 참조하세요.
* 웹훅 엔드포인트가 `200` 상태 코드를 반환할 때까지 최대 `5`초간 기다리며, 최대 `1`회 재시도합니다.
* 바운스 웹훅 URL에 오류가 감지되면, 주 1회 예의상 이메일을 보내드립니다.
### 웹훅을 지원하나요 {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    팁:
  </strong>
    바운스 웹훅에 대한 문서를 찾고 계신가요? 자세한 내용은 <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">바운스 웹훅을 지원하나요?</a>를 참고하세요.
  <span>
  </span>
</div>

네, 2020년 5월 15일부터 이 기능이 추가되었습니다. 수신자와 동일하게 웹훅을 간단히 추가할 수 있습니다! 웹훅 URL에 "http" 또는 "https" 프로토콜이 접두사로 붙어 있는지 반드시 확인하세요.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    강화된 개인정보 보호:
  </strong>
  <span>
    유료 플랜(강화된 개인정보 보호 기능 포함)을 사용 중이라면 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">내 계정 <i class="fa fa-angle-right"></i> 도메인</a>으로 이동하여 도메인 옆의 "별칭"을 클릭해 웹훅을 설정하세요. 유료 플랜에 대해 더 알고 싶다면 <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">가격 정책</a> 페이지를 참고하세요. 그렇지 않으면 아래 지침을 계속 따라주세요.
  </span>
</div>

무료 플랜을 사용 중이라면 아래와 같이 새 DNS <strong class="notranslate">TXT</strong> 레코드를 추가하세요:

예를 들어, `alias@example.com`으로 가는 모든 이메일을 새 [request bin](https://requestbin.com/r/en8pfhdgcculn?inspect) 테스트 엔드포인트로 전달하고 싶다면:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>이름/호스트/별칭</th>
      <th class="text-center">TTL</th>
      <th>유형</th>
      <th>응답/값</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", 또는 빈칸</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

또는 `example.com`으로 가는 모든 이메일을 이 엔드포인트로 전달하고 싶다면:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>이름/호스트/별칭</th>
      <th class="text-center">TTL</th>
      <th>유형</th>
      <th>응답/값</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", 또는 빈칸</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

**웹훅에 관한 추가 참고 사항은 다음과 같습니다:**

* 웹훅 페이로드가 실제로 우리 서버에서 온 것인지 확인해야 한다면, [역방향 조회를 사용해 원격 클라이언트 IP 주소의 클라이언트 호스트명을 확인할 수 있습니다](https://nodejs.org/api/dns.html#dnspromisesreverseip) – `mx1.forwardemail.net` 또는 `mx2.forwardemail.net`이어야 합니다.
  * 또한 IP를 [공개된 IP 주소](#what-are-your-servers-ip-addresses)와 대조할 수 있습니다.
  * 유료 플랜 사용자는 내 계정 → 도메인 → 설정 → 웹훅 서명 페이로드 검증 키에서 웹훅 키를 얻을 수 있습니다.
    * 보안을 위해 언제든지 이 키를 교체할 수 있습니다.
    * 이 키를 사용해 웹훅 요청의 `X-Webhook-Signature` 값과 계산된 본문 값을 비교하세요. 방법 예시는 [이 Stack Overflow 게시물](https://stackoverflow.com/a/68885281)에서 확인할 수 있습니다.
  * 자세한 내용은 <https://github.com/forwardemail/free-email-forwarding/issues/235> 토론을 참고하세요.
* 웹훅이 `200` 상태 코드를 응답하지 않으면, [오류 로그가 생성되어 저장됩니다](#do-you-store-error-logs) – 디버깅에 유용합니다.
* 웹훅 HTTP 요청은 SMTP 연결 시도마다 최대 3회 재시도하며, 엔드포인트 POST 요청당 최대 60초 타임아웃이 있습니다. **이는 3회만 재시도한다는 뜻이 아니며**, 3번째 실패 후 SMTP 코드 421(나중에 재시도하라는 의미)을 보내 지속적으로 재시도합니다. 즉, 200 상태 코드가 나올 때까지 며칠간 계속 재시도합니다.
* 기본 상태 및 오류 코드는 [superagent의 재시도 메서드](https://ladjs.github.io/superagent/#retrying-requests)를 기반으로 자동 재시도됩니다(저희가 유지 관리 중입니다).
* 동일한 엔드포인트에 대한 웹훅 HTTP 요청은 여러 개가 아닌 하나로 묶어 리소스를 절약하고 응답 속도를 높입니다. 예를 들어, <webhook1@example.com>, <webhook2@example.com>, <webhook3@example.com>으로 이메일을 보내고 모두 정확히 같은 엔드포인트 URL로 설정되어 있다면, 요청은 하나만 발생합니다. 엄격한 일치로 엔드포인트를 그룹화합니다.
* 메시지를 JSON 친화적인 객체로 파싱하기 위해 [mailparser](https://nodemailer.com/extras/mailparser/) 라이브러리의 "simpleParser" 메서드를 사용합니다.
* 원시 이메일 값은 문자열로 "raw" 속성에 제공됩니다.
* 인증 결과는 "dkim", "spf", "arc", "dmarc", "bimi" 속성으로 제공됩니다.
* 파싱된 이메일 헤더는 "headers" 속성에 제공되며, 반복 및 파싱이 쉬운 "headerLines"도 사용할 수 있습니다.
* 이 웹훅에 대한 그룹화된 수신자는 "recipients" 속성에 함께 묶여 제공됩니다.
* SMTP 세션 정보는 "session" 속성에 제공됩니다. 여기에는 메시지 발신자, 도착 시간, HELO, 클라이언트 호스트명이 포함됩니다. 클라이언트 호스트명 값인 `session.clientHostname`은 역방향 PTR 조회에서 얻은 FQDN이거나, `session.remoteAddress`를 대괄호로 감싼 형태(e.g. `"[127.0.0.1]"`)입니다.
* `X-Original-To` 값을 빠르게 얻고 싶다면 `session.recipient` 값을 사용할 수 있습니다(아래 예시 참조). `X-Original-To` 헤더는 마스킹 전달 전 원래 수신자를 디버깅용으로 메시지에 추가하는 헤더입니다.
* 페이로드 본문에서 `attachments` 및/또는 `raw` 속성을 제거하려면 웹훅 엔드포인트에 쿼리 문자열 파라미터로 `?attachments=false`, `?raw=false`, 또는 `?attachments=false&raw=false`를 추가하세요(e.g. `https://example.com/webhook?attachments=false&raw=false`).
* 첨부파일이 있을 경우, Buffer 값과 함께 `attachments` 배열에 추가됩니다. JavaScript를 사용해 다시 콘텐츠로 파싱할 수 있습니다:
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
    Tip:
  </strong>
    Curious what the webhook request looks like from forwarded emails?  We've included an example below for you!
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

### 정규 표현식 또는 regex를 지원하나요? {#do-you-support-regular-expressions-or-regex}

네, 2021년 9월 27일부터 이 기능이 추가되었습니다. 별칭(alias) 매칭 및 치환(substitution)을 위해 정규 표현식("regex")을 간단히 작성할 수 있습니다.

정규 표현식이 지원되는 별칭은 `/`로 시작하고 `/`로 끝나며, 수신자는 이메일 주소 또는 웹훅(webhook)입니다. 수신자는 또한 정규식 치환 지원(e.g. `$1`, `$2`)을 포함할 수 있습니다.

`i`와 `g` 두 가지 정규 표현식 플래그를 지원합니다. 대소문자 구분 없는 `i` 플래그는 영구 기본값이며 항상 적용됩니다. 전역 플래그 `g`는 끝 `/` 뒤에 `/g`를 붙여서 추가할 수 있습니다.

또한 정규식 지원 시 수신자 부분에 대해 <a href="#can-i-disable-specific-aliases">비활성화된 별칭 기능</a>도 지원합니다.

정규 표현식은 <a href="/disposable-addresses" target="_blank">글로벌 바니티 도메인</a>에서는 지원되지 않습니다(보안 취약점이 될 수 있기 때문입니다).

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    향상된 개인정보 보호:
  </strong>
  <span>
    유료 플랜(향상된 개인정보 보호 기능 포함)을 사용 중이라면 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">내 계정 <i class="fa fa-angle-right"></i> 도메인</a>으로 이동하여 도메인 옆의 "별칭"을 클릭해 정규 표현식을 포함한 별칭을 구성하세요. 유료 플랜에 대해 더 알고 싶다면 <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">가격 정책</a> 페이지를 참고하세요.
  </span>
</div>

#### 향상된 개인정보 보호 예시 {#examples-for-enhanced-privacy-protection}

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>별칭 이름</th>
      <th>효과</th>
      <th>테스트</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>/^(linus|torvalds)$/</code></td>
      <td>`linus@example.com` 또는 `torvalds@example.com`으로 이메일 전달</td>
      <td>(<a href="https://regexr.com/8gb8n" class="alert-link">RegExr에서 테스트 보기</a>)</td>
    </tr>
    <tr>
      <td><code>/^24highst(reet)$/</code></td>
      <td>`24highst@example.com` 또는 `24highstreet@example.com`으로 이메일 전달</td>
      <td>(<a href="https://regexr.com/8g9rb" class="alert-link">RegExr에서 테스트 보기</a>)</td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    팁:
  </strong>
    <a href="https://regexr.com" class="alert-link">RegExr</a>에서 테스트하려면, 상단 박스에 표현식을 작성하고 아래 텍스트 박스에 예시 별칭을 입력하세요. 일치하면 파란색으로 표시됩니다.
  <span>
  </span>
</div>

#### 무료 플랜 예시 {#examples-for-the-free-plan}

무료 플랜을 사용 중이라면, 아래 제공된 예시 중 하나 이상을 사용하여 새 DNS <strong class="notranslate">TXT</strong> 레코드를 추가하세요:

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>간단한 예시:</strong> `linus@example.com` 또는 `torvalds@example.com`으로 가는 모든 이메일을 `user@gmail.com`으로 전달하려면:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>이름/호스트/별칭</th>
      <th class="text-center">TTL</th>
      <th>타입</th>
      <th>응답/값</th>
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
  <strong>이름 치환 예시:</strong> 회사 이메일 주소가 모두 `firstname.lastname@example.com` 패턴이라고 가정해 보겠습니다. `firstname.lastname@example.com` 패턴으로 오는 모든 이메일을 치환 지원과 함께 `firstname.lastname@company.com`으로 전달하려면 (<a href="https://regexr.com/66hnu" class="alert-link">RegExr에서 테스트 보기</a>):
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
  <strong>플러스 기호 필터링 치환 예시:</strong> `info@example.com` 또는 `support@example.com` 으로 가는 모든 이메일을 각각 `user+info@gmail.com` 또는 `user+support@gmail.com` 으로 전달하고 싶을 때 (치환 지원 포함) (<a href="https://regexr.com/66ho7" class="alert-link">RegExr에서 테스트 보기</a>):
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
  <strong>웹훅 쿼리스트링 치환 예시:</strong> `example.com` 으로 가는 모든 이메일을 <a href="#do-you-support-webhooks" class="alert-link">웹훅</a> 으로 보내고, 이메일 주소의 사용자 이름 부분을 값으로 하는 "to"라는 동적 쿼리스트링 키를 포함시키고 싶을 때 (<a href="https://regexr.com/66ho4" class="alert-link">RegExr에서 테스트 보기</a>):
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
  <strong>조용한 거부 예시:</strong> 특정 패턴과 일치하는 모든 이메일을 비활성화하고 조용히 거부하려면 (발신자에게는 메시지가 성공적으로 전송된 것처럼 보이지만 실제로는 어디에도 가지 않음) 상태 코드 `250` (참조 <a href="#can-i-disable-specific-aliases" class="alert-link">특정 별칭을 비활성화할 수 있나요</a>)을 사용하여, 단일 느낌표 "!"를 사용하면 됩니다. 이는 발신자에게 메시지가 성공적으로 전달되었음을 나타내지만 실제로는 어디에도 전달되지 않음을 의미합니다 (예: 블랙홀 또는 `/dev/null`).
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
  <strong>소프트 거부 예시:</strong> 특정 패턴과 일치하는 모든 이메일을 비활성화하고 상태 코드 `421` (참조 <a href="#can-i-disable-specific-aliases" class="alert-link">특정 별칭을 비활성화할 수 있나요</a>)로 소프트 거부하려면, 이중 느낌표 "!!"를 사용하면 됩니다. 이는 발신자에게 이메일을 재시도하라는 신호를 보내며, 이 별칭으로 가는 이메일은 약 5일간 재시도되고 이후 영구적으로 거부됩니다.
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
  <strong>강제 거부 예시:</strong> 특정 패턴과 일치하는 모든 이메일을 비활성화하고 상태 코드 `550`으로 강제 거부하려면 (자세한 내용은 <a href="#can-i-disable-specific-aliases" class="alert-link">특정 별칭을 비활성화할 수 있나요</a> 참조), 삼중 느낌표 "!!!"를 사용하면 됩니다. 이는 발신자에게 영구 오류를 알리며 이메일은 재시도되지 않고 해당 별칭에 대해 거부됩니다.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>이름/호스트/별칭</th>
      <th class="text-center">TTL</th>
      <th>유형</th>
      <th>응답/값</th>
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
    정규 표현식을 작성하는 방법이 궁금하거나 대체할 내용을 테스트해야 한다면, 무료 정규 표현식 테스트 웹사이트 <a href="https://regexr.com" class="alert-link">RegExr</a>를 방문하세요: <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
  <span>
  </span>
</div>

### 귀하의 아웃바운드 SMTP 제한은 무엇인가요 {#what-are-your-outbound-smtp-limits}

저희는 사용자 및 도메인별로 1일당 300건의 아웃바운드 SMTP 메시지로 속도 제한을 둡니다. 이는 한 달 기준으로 평균 9000건 이상의 이메일에 해당합니다. 이 수치를 초과해야 하거나 지속적으로 대용량 이메일을 보내야 하는 경우, [문의해 주세요](https://forwardemail.net/help).

### SMTP 활성화를 위해 승인이 필요한가요 {#do-i-need-approval-to-enable-smtp}

네, IP 평판 유지 및 전달 보장을 위해 Forward Email은 도메인별로 아웃바운드 SMTP 승인을 위한 수동 검토 절차를 운영합니다. 승인 요청은 <support@forwardemail.net>으로 이메일을 보내거나 [도움 요청](https://forwardemail.net/help)을 열어주세요. 일반적으로 24시간 이내에 처리되며 대부분 1~2시간 내에 승인됩니다. 가까운 미래에는 추가 스팸 제어 및 알림과 함께 이 절차를 즉시 처리할 수 있도록 할 예정입니다. 이 절차는 이메일이 받은편지함에 도달하고 메시지가 스팸으로 표시되지 않도록 보장합니다.

### SMTP 서버 구성 설정은 무엇인가요 {#what-are-your-smtp-server-configuration-settings}

저희 서버는 `smtp.forwardemail.net`이며 <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">상태 페이지</a>에서 모니터링됩니다.

IPv4와 IPv6를 모두 지원하며 SSL/TLS(권장)용 포트 `465`와 `2465`, TLS(STARTTLS)용 포트 `587`, `2587`, `2525`, `25`를 통해 이용 가능합니다.

**2025년 10월부터**, 프린터, 스캐너, 카메라 및 최신 TLS 버전을 지원하지 않는 레거시 이메일 클라이언트와 같은 구형 장치를 위해 포트 `2455`(SSL/TLS)와 `2555`(STARTTLS)에서 **레거시 TLS 1.0** 연결을 지원합니다. 이 포트들은 Gmail, Yahoo, Outlook 등에서 구형 TLS 프로토콜 지원을 중단한 것에 대한 대안으로 제공됩니다.

> \[!CAUTION]
> **레거시 TLS 1.0 지원 (포트 2455 및 2555)**: 이 포트들은 알려진 보안 취약점(BEAST, POODLE)이 있는 구식 TLS 1.0 프로토콜을 사용합니다. 장치가 TLS 1.2 이상을 절대 지원하지 못하는 경우에만 이 포트를 사용하세요. 가능하면 장치 펌웨어를 업그레이드하거나 최신 이메일 클라이언트로 전환할 것을 강력히 권장합니다. 이 포트들은 구형 하드웨어 호환성(구형 프린터, 스캐너, 카메라, IoT 장치)을 위해서만 의도되었습니다.

|                                     프로토콜                                     | 호스트명                  |            포트             |        IPv4        |        IPv6        | 비고                                   |
| :------------------------------------------------------------------------------: | ------------------------- | :-------------------------: | :----------------: | :----------------: | -------------------------------------- |
|                              `SSL/TLS` **권장**                                | `smtp.forwardemail.net`   |        `465`, `2465`        | :white_check_mark: | :white_check_mark: | 최신 TLS 1.2 이상 (권장)               |
|         `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS))         | `smtp.forwardemail.net`   | `587`, `2587`, `2525`, `25` | :white_check_mark: | :white_check_mark: | 지원됨 (SSL/TLS 포트 `465` 권장)       |
|                             `SSL/TLS` **레거시 전용**                           | `smtp.forwardemail.net`   |            `2455`           | :white_check_mark: | :white_check_mark: | :warning: 구형 장치 전용 TLS 1.0        |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) **레거시 전용** | `smtp.forwardemail.net`   |            `2555`           | :white_check_mark: | :white_check_mark: | :warning: 구형 장치 전용 TLS 1.0        |
| 로그인    | 예시                       | 설명                                                                                                                                                                                     |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 사용자명 | `user@example.com`         | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a>에 존재하는 도메인의 별칭 이메일 주소입니다.                              |
| 비밀번호 | `************************` | 별칭                                                                                                                                                                                     |

SMTP로 아웃바운드 이메일을 보내기 위해서는 **SMTP 사용자**가 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a>에 존재하는 도메인의 별칭 이메일 주소여야 하며, **SMTP 비밀번호**는 별칭별로 생성된 비밀번호여야 합니다.

단계별 지침은 [SMTP로 이메일 전송을 지원하나요](#do-you-support-sending-email-with-smtp)를 참조하세요.

### IMAP 서버 구성 설정은 무엇인가요 {#what-are-your-imap-server-configuration-settings}

저희 서버는 `imap.forwardemail.net`이며 <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">상태 페이지</a>에서도 모니터링되고 있습니다.

IPv4와 IPv6를 모두 지원하며 SSL/TLS용 포트 `993`과 `2993`에서 사용할 수 있습니다.

|         프로토콜         | 호스트명                  |     포트      |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **권장**       | `imap.forwardemail.net` | `993`, `2993` | :white_check_mark: | :white_check_mark: |

| 로그인    | 예시                       | 설명                                                                                                                                                                                     |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 사용자명 | `user@example.com`         | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a>에 존재하는 도메인의 별칭 이메일 주소입니다.                              |
| 비밀번호 | `************************` | 별칭별로 생성된 비밀번호입니다.                                                                                                                                                           |

IMAP에 연결하려면 **IMAP 사용자**가 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a>에 존재하는 도메인의 별칭 이메일 주소여야 하며, **IMAP 비밀번호**는 별칭별로 생성된 비밀번호여야 합니다.

단계별 지침은 [IMAP으로 이메일 수신을 지원하나요](#do-you-support-receiving-email-with-imap)를 참조하세요.

### POP3 서버 구성 설정은 무엇인가요 {#what-are-your-pop3-server-configuration-settings}

저희 서버는 `pop3.forwardemail.net`이며 <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">상태 페이지</a>에서도 모니터링되고 있습니다.

IPv4와 IPv6를 모두 지원하며 SSL/TLS용 포트 `995`와 `2995`에서 사용할 수 있습니다.

|         프로토콜         | 호스트명                  |     포트      |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **권장**       | `pop3.forwardemail.net` | `995`, `2995` | :white_check_mark: | :white_check_mark: |
| 로그인    | 예시                       | 설명                                                                                                                                                                                     |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 사용자명 | `user@example.com`         | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a>에 존재하는 도메인의 별칭 이메일 주소입니다.                                      |
| 비밀번호 | `************************` | 별칭별로 생성된 비밀번호입니다.                                                                                                                                                            |

POP3에 연결하려면, **POP3 사용자**는 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">내 계정 <i class="fa fa-angle-right"></i> 도메인</a>에 존재하는 도메인의 별칭 이메일 주소여야 하며, **IMAP 비밀번호**는 별칭별로 생성된 비밀번호여야 합니다.

단계별 지침은 [POP3를 지원하나요](#do-you-support-pop3)를 참조하세요.

### 내 도메인에 이메일 자동 검색을 설정하는 방법 {#how-do-i-set-up-email-autodiscovery-for-my-domain}

이메일 자동 검색은 **Thunderbird**, **Apple Mail**, **Microsoft Outlook** 및 모바일 장치와 같은 이메일 클라이언트가 사용자가 이메일 계정을 추가할 때 올바른 IMAP, SMTP, POP3, CalDAV 및 CardDAV 서버 설정을 자동으로 감지할 수 있게 합니다. 이는 [RFC 6186](https://www.rfc-editor.org/rfc/rfc6186.html) (이메일) 및 [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) (CalDAV/CardDAV)에 정의되어 있으며 DNS SRV 레코드를 사용합니다.

Forward Email은 `forwardemail.net`에 자동 검색 레코드를 게시합니다. 도메인에 SRV 레코드를 직접 추가하거나 더 간단한 CNAME 방식을 사용할 수 있습니다.

#### 옵션 A: CNAME 레코드 (가장 간단) {#option-a-cname-records-simplest}

도메인의 DNS에 다음 두 개의 CNAME 레코드를 추가하세요. 이는 자동 검색을 Forward Email 서버로 위임합니다:

|  유형 | 이름/호스트    | 대상/값                        |
| :---: | -------------- | ----------------------------- |
| CNAME | `autoconfig`   | `autoconfig.forwardemail.net` |
| CNAME | `autodiscover` | `autodiscover.forwardemail.net` |

`autoconfig` 레코드는 **Thunderbird** 및 기타 Mozilla 기반 클라이언트에서 사용됩니다. `autodiscover` 레코드는 **Microsoft Outlook**에서 사용됩니다.

#### 옵션 B: SRV 레코드 (직접) {#option-b-srv-records-direct}

레코드를 직접 추가하거나 DNS 공급자가 하위 도메인에 CNAME을 지원하지 않는 경우, 도메인에 다음 SRV 레코드를 추가하세요:

| 유형 | 이름/호스트           | 우선순위 | 가중치 | 포트 | 대상/값                    | 용도                                   |
| :--: | --------------------- | :------: | :----: | :--: | -------------------------- | ------------------------------------- |
|  SRV | `_imaps._tcp`         |     0    |    1   |  993 | `imap.forwardemail.net`    | SSL/TLS를 사용하는 IMAP (권장)         |
|  SRV | `_imap._tcp`          |     0    |    0   |   0  | `.`                        | 일반 텍스트 IMAP 비활성화              |
|  SRV | `_submissions._tcp`   |     0    |    1   |  465 | `smtp.forwardemail.net`    | SMTP 제출 (SSL/TLS, 권장)              |
|  SRV | `_submission._tcp`    |     5    |    1   |  587 | `smtp.forwardemail.net`    | SMTP 제출 (STARTTLS)                   |
|  SRV | `_pop3s._tcp`         |    10    |    1   |  995 | `pop3.forwardemail.net`    | SSL/TLS를 사용하는 POP3                 |
|  SRV | `_pop3._tcp`          |     0    |    0   |   0  | `.`                        | 일반 텍스트 POP3 비활성화              |
|  SRV | `_caldavs._tcp`       |     0    |    1   |  443 | `caldav.forwardemail.net`  | TLS를 사용하는 CalDAV (캘린더)          |
|  SRV | `_caldav._tcp`        |     0    |    0   |   0  | `.`                        | 일반 텍스트 CalDAV 비활성화            |
|  SRV | `_carddavs._tcp`      |     0    |    1   |  443 | `carddav.forwardemail.net` | TLS를 사용하는 CardDAV (연락처)         |
|  SRV | `_carddav._tcp`       |     0    |    0   |   0  | `.`                        | 일반 텍스트 CardDAV 비활성화           |
> \[!NOTE]
> IMAP은 POP3(10)보다 낮은 우선순위 값(0)을 가지며, 이는 이메일 클라이언트가 두 프로토콜이 모두 사용 가능할 때 IMAP을 우선하도록 지시합니다. 대상이 `.` (단일 점)인 레코드는 해당 프로토콜의 평문(암호화되지 않은) 버전이 [RFC 6186 섹션 3.4](https://www.rfc-editor.org/rfc/rfc6186.html#section-3.4)에 따라 의도적으로 비활성화되었음을 나타냅니다. CalDAV 및 CardDAV SRV 레코드는 일정 및 연락처 자동 검색을 위해 [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html)를 따릅니다.

#### 어떤 이메일 클라이언트가 자동 검색을 지원하나요? {#which-email-clients-support-autodiscovery}

| 클라이언트           | 이메일                                            | CalDAV/CardDAV                             |
| ------------------ | ------------------------------------------------ | ------------------------------------------ |
| Thunderbird        | `autoconfig` CNAME 또는 SRV 레코드                | `autoconfig` XML 또는 SRV 레코드 (RFC 6764) |
| Apple Mail (macOS) | SRV 레코드 (RFC 6186)                           | SRV 레코드 (RFC 6764)                     |
| Apple Mail (iOS)   | SRV 레코드 (RFC 6186)                           | SRV 레코드 (RFC 6764)                     |
| Microsoft Outlook  | `autodiscover` CNAME 또는 `_autodiscover._tcp` SRV | 지원하지 않음                              |
| GNOME (Evolution)  | SRV 레코드 (RFC 6186)                           | SRV 레코드 (RFC 6764)                     |
| KDE (KMail)        | SRV 레코드 (RFC 6186)                           | SRV 레코드 (RFC 6764)                     |
| eM Client          | `autoconfig` 또는 `autodiscover`                   | SRV 레코드 (RFC 6764)                     |

> \[!TIP]
> 모든 클라이언트에서 최고의 호환성을 위해, **옵션 A**(CNAME 레코드)와 **옵션 B**의 SRV 레코드를 함께 사용하는 것을 권장합니다. CNAME 방식만으로도 대부분의 이메일 클라이언트를 지원합니다. CalDAV/CardDAV SRV 레코드는 일정 및 연락처 클라이언트가 서버 설정을 자동으로 검색할 수 있도록 보장합니다.


## 보안 {#security-1}

### 고급 서버 강화 기법 {#advanced-server-hardening-techniques}

> \[!TIP]
> 보안 인프라에 대해 더 알아보려면 [보안 페이지](/security)를 방문하세요.

Forward Email은 인프라와 귀하의 데이터를 보호하기 위해 다양한 서버 강화 기법을 구현합니다:

1. **네트워크 보안**:
   * 엄격한 규칙의 IP 테이블 방화벽
   * 무차별 대입 공격 방지를 위한 Fail2ban
   * 정기적인 보안 감사 및 침투 테스트
   * VPN 전용 관리자 접근

2. **시스템 강화**:
   * 최소한의 패키지 설치
   * 정기적인 보안 업데이트
   * 강제 모드의 SELinux
   * 루트 SSH 접근 비활성화
   * 키 기반 인증만 허용

3. **애플리케이션 보안**:
   * 콘텐츠 보안 정책(CSP) 헤더
   * HTTPS 엄격 전송 보안(HSTS)
   * XSS 보호 헤더
   * 프레임 옵션 및 리퍼러 정책 헤더
   * 정기적인 의존성 감사

4. **데이터 보호**:
   * LUKS를 이용한 전체 디스크 암호화
   * 안전한 키 관리
   * 암호화된 정기 백업
   * 데이터 최소화 관행

5. **모니터링 및 대응**:
   * 실시간 침입 탐지
   * 자동화된 보안 스캔
   * 중앙 집중식 로깅 및 분석
   * 사고 대응 절차

> \[!IMPORTANT]
> 당사의 보안 관행은 새로운 위협과 취약점에 대응하기 위해 지속적으로 업데이트됩니다.

> \[!TIP]
> 최대 보안을 위해 OpenPGP를 통한 종단 간 암호화와 함께 서비스를 사용하는 것을 권장합니다.

### SOC 2 또는 ISO 27001 인증을 보유하고 있나요? {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email은 업계 표준 준수를 보장하기 위해 인증된 하위 프로세서가 제공하는 인프라에서 운영됩니다.

Forward Email은 SOC 2 Type II 또는 ISO 27001 인증을 직접 보유하고 있지 않습니다. 그러나 서비스는 인증된 하위 프로세서가 제공하는 인프라에서 운영됩니다:

* **DigitalOcean**: SOC 2 Type II 및 SOC 3 Type II 인증(감사 기관: Schellman & Company LLC), 여러 데이터 센터에서 ISO 27001 인증 보유. 자세한 내용: <https://www.digitalocean.com/trust/certification-reports>
* **Vultr**: SOC 2+ (HIPAA) 인증, ISO/IEC 인증: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. 세부사항: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: SOC 2 준수 (인증 획득을 위해 DataPacket에 직접 문의), 엔터프라이즈급 인프라 제공업체 (덴버 위치). 세부사항: <https://www.datapacket.com/datacenters/denver>

Forward Email은 보안 감사에 대한 업계 모범 사례를 따르며 정기적으로 독립 보안 연구원과 협력합니다. 출처: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### 이메일 전달에 TLS 암호화를 사용하나요? {#do-you-use-tls-encryption-for-email-forwarding}

예. Forward Email은 모든 연결(HTTPS, SMTP, IMAP, POP3)에 대해 TLS 1.2+를 엄격히 적용하며 향상된 TLS 지원을 위해 MTA-STS를 구현합니다. 구현 내용은 다음과 같습니다:

* 모든 이메일 연결에 대해 TLS 1.2+ 적용
* 완벽한 전달 보안을 위한 ECDHE(타원 곡선 디피-헬만 임시) 키 교환
* 정기적인 보안 업데이트가 이루어지는 최신 암호화 스위트
* 향상된 성능과 보안을 위한 HTTP/2 지원
* 주요 브라우저에서 사전 로딩되는 HSTS(HTTP 엄격 전송 보안)
* 엄격한 TLS 적용을 위한 **MTA-STS (메일 전송 에이전트 엄격 전송 보안)**

출처: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**MTA-STS 구현**: Forward Email은 코드베이스에서 엄격한 MTA-STS 적용을 구현합니다. TLS 오류가 발생하고 MTA-STS가 적용될 때, 시스템은 이메일이 안전하지 않게 전달되는 대신 나중에 재시도되도록 421 SMTP 상태 코드를 반환합니다. 구현 세부사항:

* TLS 오류 감지: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* send-email 헬퍼에서 MTA-STS 적용: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

서드파티 검증: <https://www.hardenize.com/report/forwardemail.net/1750312779> 에서 모든 TLS 및 전송 보안 조치에 대해 "Good" 등급을 받았습니다.

### 이메일 인증 헤더를 보존하나요? {#do-you-preserve-email-authentication-headers}

예. Forward Email은 이메일 인증 헤더를 포괄적으로 구현하고 보존합니다:

* **SPF (발신자 정책 프레임워크)**: 적절히 구현 및 보존
* **DKIM (도메인키 식별 메일)**: 적절한 키 관리와 함께 완전 지원
* **DMARC**: SPF 또는 DKIM 검증 실패 시 정책 적용
* **ARC**: 명시적으로 상세하지는 않으나, 완벽한 준수 점수로 보아 포괄적인 인증 헤더 처리가 이루어짐을 시사

출처: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

검증: Internet.nl 메일 테스트에서 "SPF, DKIM, DMARC" 구현에 대해 100/100 점수를 받았습니다. Hardenize 평가에서도 SPF 및 DMARC에 대해 "Good" 등급을 확인할 수 있습니다: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### 원본 이메일 헤더를 보존하고 스푸핑을 방지하나요? {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email은 이메일 남용을 방지하기 위해 정교한 안티 스푸핑 보호를 구현합니다.

Forward Email은 원본 이메일 헤더를 보존하면서 MX 코드베이스를 통해 포괄적인 안티 스푸핑 보호를 구현합니다:

* **헤더 보존**: 전달 중 원본 인증 헤더 유지
* **안티 스푸핑**: DMARC 정책 적용으로 SPF 또는 DKIM 검증 실패 시 헤더 스푸핑 방지 및 이메일 거부
* **헤더 인젝션 방지**: striptags 라이브러리를 사용한 입력 검증 및 정화
* **고급 보호**: 스푸핑 탐지, 사칭 방지, 사용자 알림 시스템을 포함한 정교한 피싱 탐지

**MX 구현 세부사항**: 핵심 이메일 처리 로직은 MX 서버 코드베이스에서 처리되며, 구체적으로:

* 주요 MX 데이터 핸들러: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* 임의 이메일 필터링(안티 스푸핑): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

`isArbitrary` 헬퍼는 도메인 사칭 탐지, 차단된 문구, 다양한 피싱 패턴을 포함한 정교한 안티 스푸핑 규칙을 구현합니다.
### 스팸 및 남용으로부터 어떻게 보호하나요 {#how-do-you-protect-against-spam-and-abuse}

Forward Email은 포괄적인 다중 계층 보호를 구현합니다:

* **속도 제한**: 인증 시도, API 엔드포인트, SMTP 연결에 적용
* **자원 격리**: 대량 사용자로 인한 영향 방지를 위해 사용자 간 격리
* **DDoS 보호**: DataPacket의 Shield 시스템과 Cloudflare를 통한 다중 계층 보호
* **자동 확장**: 수요에 따른 동적 자원 조정
* **남용 방지**: 사용자별 남용 방지 검사 및 악성 콘텐츠에 대한 해시 기반 차단
* **이메일 인증**: 고급 피싱 탐지가 포함된 SPF, DKIM, DMARC 프로토콜

출처:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (DDoS 보호 세부사항)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### 이메일 내용을 디스크에 저장하나요 {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email은 이메일 내용이 디스크에 기록되는 것을 방지하는 제로 지식 아키텍처를 사용합니다.

* **제로 지식 아키텍처**: 개별 암호화된 SQLite 메일박스로 Forward Email이 이메일 내용에 접근할 수 없음
* **메모리 내 처리**: 이메일 처리가 전적으로 메모리 내에서 이루어져 디스크 저장을 회피
* **내용 로그 없음**: "이메일 내용이나 메타데이터를 디스크에 기록하거나 저장하지 않습니다"
* **샌드박스 암호화**: 암호화 키는 평문으로 디스크에 절대 저장되지 않음

**MX 코드베이스 증거**: MX 서버는 이메일을 디스크에 기록하지 않고 전적으로 메모리 내에서 처리합니다. 주요 이메일 처리 핸들러는 이 메모리 내 접근 방식을 보여줍니다: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

출처:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (요약)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (제로 지식 세부사항)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (샌드박스 암호화)

### 시스템 충돌 시 이메일 내용이 노출될 수 있나요 {#can-email-content-be-exposed-during-system-crashes}

아니요. Forward Email은 충돌 관련 데이터 노출을 방지하기 위한 포괄적인 안전장치를 구현합니다:

* **코어 덤프 비활성화**: 충돌 시 메모리 노출 방지
* **스왑 메모리 비활성화**: 스왑 파일에서 민감 데이터 추출 방지를 위해 완전 비활성화
* **메모리 내 아키텍처**: 이메일 내용은 처리 중 휘발성 메모리에만 존재
* **암호화 키 보호**: 키는 평문으로 디스크에 절대 저장되지 않음
* **물리적 보안**: LUKS v2 암호화 디스크로 물리적 데이터 접근 방지
* **USB 저장장치 비활성화**: 무단 데이터 추출 방지

**시스템 문제에 대한 오류 처리**: Forward Email은 `isCodeBug` 및 `isTimeoutError` 헬퍼 함수를 사용하여 데이터베이스 연결 문제, DNS 네트워크/차단 목록 문제, 업스트림 연결 문제 발생 시 시스템이 421 SMTP 상태 코드를 반환하도록 하여 이메일이 손실되거나 노출되지 않고 나중에 재시도되도록 보장합니다.

구현 세부사항:

* 오류 분류: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* MX 처리 내 타임아웃 오류 처리: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

출처: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### 누가 이메일 인프라에 접근할 수 있나요 {#who-has-access-to-your-email-infrastructure}

Forward Email은 최소 2-3명의 엔지니어링 팀 접근에 대해 엄격한 2단계 인증 요구사항과 함께 포괄적인 접근 제어를 구현합니다:

* **역할 기반 접근 제어**: 리소스 기반 권한이 부여된 팀 계정용
* **최소 권한 원칙**: 모든 시스템에 적용
* **직무 분리**: 운영 역할 간 분리
* **사용자 관리**: 별도의 배포 및 데브옵스 사용자로 구분된 권한 부여
* **루트 로그인 비활성화**: 적절히 인증된 계정을 통한 접근 강제
* **엄격한 2단계 인증**: MiTM 공격 위험으로 인해 SMS 기반 2FA 금지 - 앱 기반 또는 하드웨어 토큰만 허용
* **포괄적 감사 로그**: 민감 데이터는 마스킹 처리
* **자동 이상 탐지**: 비정상 접근 패턴 감지
* **정기 보안 검토**: 접근 로그에 대해 수행
* **이빌 메이드 공격 방지**: USB 저장장치 비활성화 및 기타 물리적 보안 조치
Sources:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (권한 제어)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (네트워크 보안)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (이블 메이드 공격 방지)

### 어떤 인프라 제공업체를 사용하나요 {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email은 포괄적인 컴플라이언스 인증을 갖춘 여러 인프라 하위 처리업체를 사용합니다.

자세한 내용은 당사의 GDPR 준수 페이지에서 확인할 수 있습니다: <https://forwardemail.net/gdpr>

**주요 인프라 하위 처리업체:**

| 제공업체         | 데이터 프라이버시 프레임워크 인증 여부 | GDPR 준수 페이지                                                                        |
| ---------------- | ------------------------------------- | --------------------------------------------------------------------------------------- |
| **Cloudflare**   | ✅ 예                                | <https://www.cloudflare.com/trust-hub/gdpr/>                                           |
| **DataPacket**   | ❌ 아니요                            | <https://www.datapacket.com/privacy-policy>                                            |
| **DigitalOcean** | ❌ 아니요                            | <https://www.digitalocean.com/legal/gdpr>                                              |
| **GitHub**       | ✅ 예                                | <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement> |
| **Vultr**        | ❌ 아니요                            | <https://www.vultr.com/legal/eea-gdpr-privacy/>                                        |

**상세 인증 내역:**

**DigitalOcean**

* SOC 2 Type II 및 SOC 3 Type II (Schellman & Company LLC 감사)
* 여러 데이터 센터에서 ISO 27001 인증
* PCI-DSS 준수
* CSA STAR 레벨 1 인증
* APEC CBPR PRP 인증
* 상세 정보: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* SOC 2+ (HIPAA) 인증
* PCI 상인 준수
* CSA STAR 레벨 1 인증
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* 상세 정보: <https://www.vultr.com/legal/compliance/>

**DataPacket**

* SOC 2 준수 (인증서 획득을 위해 DataPacket에 직접 문의)
* 엔터프라이즈급 인프라 (덴버 위치)
* Shield 사이버보안 스택을 통한 DDoS 보호
* 24/7 기술 지원
* 58개 데이터 센터에 걸친 글로벌 네트워크
* 상세 정보: <https://www.datapacket.com/datacenters/denver>

**GitHub**

* 데이터 프라이버시 프레임워크 인증 (EU-US, Swiss-US, UK 확장)
* 소스 코드 호스팅, CI/CD, 프로젝트 관리
* GitHub 데이터 보호 계약 제공
* 상세 정보: <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement>

**결제 처리업체:**

* **Stripe**: 데이터 프라이버시 프레임워크 인증 - <https://stripe.com/legal/privacy-center>
* **PayPal**: DPF 인증 없음 - <https://www.paypal.com/uk/legalhub/privacy-full>

### 데이터 처리 계약서(DPA)를 제공하나요 {#do-you-offer-a-data-processing-agreement-dpa}

네, Forward Email은 엔터프라이즈 계약과 함께 서명할 수 있는 포괄적인 데이터 처리 계약서(DPA)를 제공합니다. DPA 사본은 다음에서 확인할 수 있습니다: <https://forwardemail.net/dpa>

**DPA 세부사항:**

* GDPR 준수 및 EU-US/Swiss-US 프라이버시 실드 프레임워크 포함
* 서비스 약관 동의 시 자동 수락
* 표준 DPA는 별도의 서명 필요 없음
* 엔터프라이즈 라이선스를 통한 맞춤형 DPA 제공 가능

**GDPR 준수 프레임워크:**
당사의 DPA는 GDPR 및 국제 데이터 전송 요건 준수를 상세히 다룹니다. 자세한 정보는 다음에서 확인할 수 있습니다: <https://forwardemail.net/gdpr>

맞춤형 DPA 조건이나 특정 계약 조항이 필요한 엔터프라이즈 고객은 **엔터프라이즈 라이선스(월 $250)** 프로그램을 통해 지원받을 수 있습니다.

### 데이터 유출 통지는 어떻게 처리하나요 {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Forward Email의 제로 지식 아키텍처는 유출 영향 범위를 크게 제한합니다.
* **제한된 데이터 노출**: 제로 지식 아키텍처로 인해 암호화된 이메일 내용에 접근 불가
* **최소한의 데이터 수집**: 보안을 위해 기본 구독자 정보와 제한된 IP 로그만 수집
* **하위 처리자 프레임워크**: DigitalOcean, GitHub, Vultr는 GDPR 준수 사고 대응 절차를 유지

**GDPR 대표자 정보:**
Forward Email은 제27조에 따라 GDPR 대표자를 지정했습니다:

**EU 대표자:**
Osano International Compliance Services Limited
ATTN: LFHC
3 Dublin Landings, North Wall Quay
Dublin 1, D01C4E0

**영국 대표자:**
Osano UK Compliance LTD
ATTN: LFHC
42-46 Fountain Street, Belfast
Antrim, BT1 - 5EF

특정 침해 통지 SLA가 필요한 기업 고객은 **Enterprise License** 계약의 일부로 논의해야 합니다.

출처:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### 테스트 환경을 제공하나요? {#do-you-offer-a-test-environment}

Forward Email의 기술 문서에는 전용 샌드박스 모드가 명시적으로 설명되어 있지 않습니다. 그러나 가능한 테스트 접근법은 다음과 같습니다:

* **셀프 호스팅 옵션**: 테스트 환경 구축을 위한 포괄적인 셀프 호스팅 기능
* **API 인터페이스**: 구성의 프로그래밍 방식 테스트 가능성
* **오픈 소스**: 100% 오픈 소스 코드로 전달 로직 검토 가능
* **다중 도메인**: 다중 도메인 지원으로 테스트 도메인 생성 가능

공식 샌드박스 기능이 필요한 기업 고객은 **Enterprise License** 계약의 일부로 논의해야 합니다.

출처: <https://github.com/forwardemail/forwardemail.net> (개발 환경 세부 정보)

### 모니터링 및 알림 도구를 제공하나요? {#do-you-provide-monitoring-and-alerting-tools}

Forward Email은 일부 제한 사항이 있는 실시간 모니터링을 제공합니다:

**제공 항목:**

* **실시간 전달 모니터링**: 주요 이메일 제공업체에 대한 공개 성능 지표
* **자동 알림**: 전달 시간이 10초를 초과하면 엔지니어링 팀에 알림
* **투명한 모니터링**: 100% 오픈 소스 모니터링 시스템
* **인프라 모니터링**: 자동 이상 탐지 및 포괄적 감사 로그

**제한 사항:**

* 고객 대상 웹훅 또는 API 기반 전달 상태 알림은 명확히 문서화되어 있지 않음

상세한 전달 상태 웹훅 또는 맞춤형 모니터링 통합이 필요한 기업 고객은 **Enterprise License** 계약을 통해 가능할 수 있습니다.

출처:

* <https://forwardemail.net> (실시간 모니터링 표시)
* <https://github.com/forwardemail/forwardemail.net> (모니터링 구현)

### 고가용성을 어떻게 보장하나요? {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Forward Email은 여러 인프라 제공업체에 걸친 포괄적인 중복성을 구현합니다.

* **분산 인프라**: 지리적 지역에 걸친 여러 제공업체(DigitalOcean, Vultr, DataPacket)
* **지리적 부하 분산**: Cloudflare 기반 지리 위치 부하 분산 및 자동 장애 조치
* **자동 확장**: 수요에 따른 동적 자원 조정
* **다중 계층 DDoS 보호**: DataPacket의 Shield 시스템과 Cloudflare를 통한 보호
* **서버 중복성**: 지역별 다중 서버 및 자동 장애 조치
* **데이터베이스 복제**: 여러 위치 간 실시간 데이터 동기화
* **모니터링 및 알림**: 24/7 모니터링 및 자동 사고 대응

**가동 시간 약속**: 99.9% 이상의 서비스 가용성, 투명한 모니터링은 <https://forwardemail.net>에서 확인 가능

출처:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### 국가 방위 승인법(NDAA) 제889조를 준수하나요? {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Forward Email은 신중한 인프라 파트너 선정으로 제889조를 완전히 준수합니다.

네, Forward Email은 **제889조 준수** 상태입니다. 국가 방위 승인법(NDAA) 제889조는 정부 기관이 특정 회사(Huawei, ZTE, Hikvision, Dahua, Hytera)의 통신 및 영상 감시 장비를 사용하는 업체와 계약하거나 사용하는 것을 금지합니다.
**Forward Email이 섹션 889 준수를 달성하는 방법:**

Forward Email은 섹션 889에서 금지된 장비를 사용하지 않는 두 개의 주요 인프라 제공업체에만 전적으로 의존합니다:

1. **Cloudflare**: 네트워크 서비스 및 이메일 보안을 위한 주요 파트너
2. **DataPacket**: 서버 인프라 제공업체 (Arista Networks 및 Cisco 장비만 사용)
3. **백업 제공업체**: Digital Ocean과 Vultr 백업 제공업체도 서면으로 섹션 889 준수를 확인받았습니다.

**Cloudflare의 약속**: Cloudflare는 제3자 행동 강령에서 섹션 889 금지 대상 업체의 통신 장비, 비디오 감시 제품 또는 서비스를 사용하지 않는다고 명확히 밝히고 있습니다.

**정부 사용 사례**: Forward Email의 섹션 889 준수는 **미 해군사관학교(US Naval Academy)**가 보안 이메일 전달 요구를 위해 Forward Email을 선택하면서 검증되었으며, 연방 준수 기준 문서 제출이 요구되었습니다.

정부 준수 프레임워크 및 광범위한 연방 규정에 대한 자세한 내용은 다음 종합 사례 연구를 참조하세요: [연방 정부 이메일 서비스 섹션 889 준수](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)


## 시스템 및 기술 세부사항 {#system-and-technical-details}

### 이메일과 그 내용을 저장하나요? {#do-you-store-emails-and-their-contents}

아니요, 우리는 디스크에 기록하거나 로그를 저장하지 않습니다 – [오류](#do-you-store-error-logs) 및 [발신 SMTP](#do-you-support-sending-email-with-smtp) 경우를 제외하고 (자세한 내용은 [개인정보 보호정책](/privacy) 참조).

모든 처리는 메모리 내에서 이루어지며 [소스 코드는 GitHub에 공개되어 있습니다](https://github.com/forwardemail).

### 이메일 전달 시스템은 어떻게 작동하나요? {#how-does-your-email-forwarding-system-work}

이메일은 [SMTP 프로토콜](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol)에 의존합니다. 이 프로토콜은 서버(일반적으로 포트 25에서 실행)에 명령을 전송하는 방식으로 구성됩니다. 초기 연결 후 발신자가 메일 발신자("MAIL FROM")를 지정하고, 수신자("RCPT TO")를 지정하며, 마지막으로 이메일 헤더와 본문("DATA")이 전송됩니다. 이메일 전달 시스템의 흐름은 각 SMTP 명령에 따라 아래와 같이 설명됩니다:

* 초기 연결 (명령 이름 없음, 예: `telnet example.com 25`) - 초기 연결입니다. [허용 목록](#do-you-have-an-allowlist)에 없는 발신자는 [차단 목록](#do-you-have-a-denylist)과 대조합니다. 마지막으로, 허용 목록에 없는 발신자는 [그레이리스트](#do-you-have-a-greylist) 여부를 확인합니다.

* `HELO` - 발신자의 FQDN, IP 주소 또는 메일 핸들러 이름을 식별하는 인사 명령입니다. 이 값은 위조될 수 있으므로, 우리는 이 데이터를 신뢰하지 않고 연결 IP 주소의 역방향 호스트 이름 조회를 사용합니다.

* `MAIL FROM` - 이메일의 봉투 발신자 주소를 나타냅니다. 값이 입력되면 유효한 RFC 5322 이메일 주소여야 합니다. 빈 값도 허용됩니다. 여기서 [백스캐터 방지](#how-do-you-protect-against-backscatter)를 수행하며, MAIL FROM를 [차단 목록](#do-you-have-a-denylist)과 대조합니다. 마지막으로 허용 목록에 없는 발신자는 속도 제한을 확인합니다 ([속도 제한](#do-you-have-rate-limiting) 및 [허용 목록](#do-you-have-an-allowlist) 섹션 참조).

* `RCPT TO` - 이메일 수신자를 나타냅니다. 유효한 RFC 5322 이메일 주소여야 하며, 메시지당 최대 50명의 봉투 수신자만 허용합니다(이메일의 "To" 헤더와는 다릅니다). 또한 위조 방지를 위해 유효한 [발신자 재작성 스킴](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme)("SRS") 주소를 확인합니다.

* `DATA` - 이메일을 처리하는 핵심 부분입니다. 자세한 내용은 아래 [이메일 전달을 위해 이메일을 어떻게 처리하나요](#how-do-you-process-an-email-for-forwarding) 섹션을 참조하세요.
### 이메일 전달을 위해 이메일을 어떻게 처리합니까 {#how-do-you-process-an-email-for-forwarding}

이 섹션에서는 위의 [이메일 전달 시스템은 어떻게 작동합니까](#how-does-your-email-forwarding-system-work) 섹션에서 SMTP 프로토콜 명령어 `DATA`와 관련된 프로세스를 설명합니다 – 이메일의 헤더, 본문, 보안 처리, 전달 대상 결정 및 연결 처리 방법에 관한 내용입니다.

1. 메시지 크기가 최대 50mb를 초과하면 552 오류 코드와 함께 거부됩니다.

2. 메시지에 "From" 헤더가 없거나 "From" 헤더의 값 중 하나라도 유효한 RFC 5322 이메일 주소가 아니면 550 오류 코드와 함께 거부됩니다.

3. 메시지에 "Received" 헤더가 25개를 초과하면 리디렉션 루프에 갇힌 것으로 판단되어 550 오류 코드와 함께 거부됩니다.

4. 이메일의 지문(자세한 내용은 [지문 확인](#how-do-you-determine-an-email-fingerprint) 섹션 참조)을 사용하여 메시지가 5일 이상 재시도된 적이 있는지 확인합니다(이는 [기본 postfix 동작](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)과 일치). 해당하는 경우 550 오류 코드와 함께 거부됩니다.

5. [Spam Scanner](https://spamscanner.net)를 사용하여 이메일을 스캔한 결과를 메모리에 저장합니다.

6. Spam Scanner에서 임의의 결과가 있으면 554 오류 코드와 함께 거부됩니다. 임의의 결과는 이 문서 작성 시점에서 GTUBE 테스트만 포함합니다. 자세한 내용은 <https://spamassassin.apache.org/gtube/>를 참조하세요.

7. 디버깅 및 악용 방지를 위해 메시지에 다음 헤더를 추가합니다:

   * `Received` - 원본 IP 및 호스트, 전송 유형, TLS 연결 정보, 날짜/시간, 수신자를 포함하는 표준 Received 헤더를 추가합니다.
   * `X-Original-To` - 메시지의 원래 수신자:
     * 이메일이 원래 어디로 전달되었는지 확인하는 데 유용합니다("Received" 헤더 외에도).
     * IMAP 및/또는 마스킹 전달 시 수신자별로 추가되어 개인정보를 보호합니다.
   * `X-Forward-Email-Website` - <https://forwardemail.net> 웹사이트 링크를 포함합니다.
   * `X-Forward-Email-Version` - 코드베이스의 `package.json`에 명시된 현재 [SemVer](https://semver.org/) 버전입니다.
   * `X-Forward-Email-Session-ID` - 디버그 용도의 세션 ID 값(비생산 환경에만 적용).
   * `X-Forward-Email-Sender` - 원래 봉투 MAIL FROM 주소(비어 있지 않은 경우), 역방향 PTR 클라이언트 FQDN(존재하는 경우), 발신자 IP 주소를 쉼표로 구분한 목록입니다.
   * `X-Forward-Email-ID` - 아웃바운드 SMTP에만 적용되며, 내 계정 → 이메일에 저장된 이메일 ID와 연관됩니다.
   * `X-Report-Abuse` - 값은 `abuse@forwardemail.net`입니다.
   * `X-Report-Abuse-To` - 값은 `abuse@forwardemail.net`입니다.
   * `X-Complaints-To` - 값은 `abuse@forwardemail.net`입니다.

8. 메시지에 대해 [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain), [DMARC](https://en.wikipedia.org/wiki/DMARC)를 검사합니다.

   * 메시지가 DMARC 검사에 실패했고 도메인에 거부 정책(e.g. `p=reject` [DMARC 정책에 포함](https://wikipedia.org/wiki/DMARC))이 있으면 550 오류 코드와 함께 거부됩니다. 일반적으로 도메인의 DMARC 정책은 `_dmarc` 서브도메인의 <strong class="notranslate">TXT</strong> 레코드에서 확인할 수 있습니다(예: `dig _dmarc.example.com txt`).
   * 메시지가 SPF 검사에 실패했고 도메인에 하드 실패 정책(e.g. SPF 정책에 `-all`이 포함되어 있고 `~all` 또는 정책 없음과는 다름)이 있으면 550 오류 코드와 함께 거부됩니다. 일반적으로 도메인의 SPF 정책은 루트 도메인의 <strong class="notranslate">TXT</strong> 레코드에서 확인할 수 있습니다(예: `dig example.com txt`). SPF 관련 자세한 내용은 [Gmail에서 메일 보내기](#can-i-send-mail-as-in-gmail-with-this) 섹션을 참조하세요.
9. 이제 위의 [이메일 전달 시스템은 어떻게 작동하나요](#how-does-your-email-forwarding-system-work) 섹션에서 `RCPT TO` 명령어로 수집한 메시지 수신자를 처리합니다. 각 수신자에 대해 다음 작업을 수행합니다:

   * 도메인 이름(예: 이메일 주소가 `test@example.com`일 경우 `@` 기호 뒤의 부분인 `example.com`)의 <strong class="notranslate">TXT</strong> 레코드를 조회합니다. 예를 들어 도메인이 `example.com`이라면 `dig example.com txt`와 같은 DNS 조회를 수행합니다.
   * `forward-email=` (무료 플랜) 또는 `forward-email-site-verification=` (유료 플랜)로 시작하는 모든 <strong class="notranslate">TXT</strong> 레코드를 파싱합니다. 사용자가 플랜을 업그레이드하거나 다운그레이드하는 동안 이메일을 처리하기 위해 두 가지 모두 파싱한다는 점에 유의하세요.
   * 파싱한 <strong class="notranslate">TXT</strong> 레코드에서 전달 구성(위의 [이메일 전달 시작 및 설정 방법](#how-do-i-get-started-and-set-up-email-forwarding) 섹션에 설명된 대로)을 추출하기 위해 반복합니다. `forward-email-site-verification=` 값은 하나만 지원하며, 둘 이상 제공되면 550 오류가 발생하고 발신자는 해당 수신자에 대해 반송 메일을 받게 됩니다.
   * 추출한 전달 구성을 재귀적으로 반복하여 전역 전달, 정규식 기반 전달 및 기타 지원되는 모든 전달 구성을 결정합니다. 이들은 이제 "전달 주소"로 알려져 있습니다.
   * 각 전달 주소에 대해 하나의 재귀 조회를 지원합니다(이 작업은 해당 주소에 대해 이 일련의 작업을 다시 시작합니다). 재귀 일치가 발견되면 상위 결과는 전달 주소에서 제거되고 하위 항목이 추가됩니다.
   * 전달 주소는 중복 전송이나 불필요한 SMTP 클라이언트 연결 생성을 방지하기 위해 고유성 검사를 거칩니다.
   * 각 전달 주소에 대해 도메인 이름을 API 엔드포인트 `/v1/max-forwarded-addresses`에 조회하여 도메인이 별칭당 이메일을 전달할 수 있는 최대 주소 수(기본값 10 – [별칭당 전달 최대 제한](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias) 섹션 참조)를 확인합니다. 이 제한을 초과하면 550 오류가 발생하고 발신자는 해당 수신자에 대해 반송 메일을 받게 됩니다.
   * 원래 수신자의 설정을 API 엔드포인트 `/v1/settings`에 조회합니다. 이 엔드포인트는 유료 사용자 조회를 지원하며 무료 사용자에 대한 대체 경로도 제공합니다. 이 조회는 `port` (숫자, 예: `25`), `has_adult_content_protection` (불리언), `has_phishing_protection` (불리언), `has_executable_protection` (불리언), `has_virus_protection` (불리언)에 대한 고급 설정 구성 객체를 반환합니다.
   * 이러한 설정을 기반으로 스팸 스캐너 결과를 확인하고 오류가 발생하면 554 오류 코드로 메시지를 거부합니다(예: `has_virus_protection`이 활성화된 경우 스팸 스캐너 결과에서 바이러스를 검사합니다). 모든 무료 플랜 사용자는 성인 콘텐츠, 피싱, 실행 파일, 바이러스 검사에 기본적으로 옵트인됩니다. 기본적으로 모든 유료 플랜 사용자도 옵트인되어 있지만, 이 구성은 Forward Email 대시보드의 도메인 설정 페이지에서 변경할 수 있습니다.

10. 처리된 각 수신자의 전달 주소에 대해 다음 작업을 수행합니다:

    * 주소가 [거부 목록](#do-you-have-a-denylist)에 있는지 확인하고, 목록에 있으면 421 오류 코드가 발생합니다(발신자에게 나중에 다시 시도하라는 신호).
    * 주소가 웹훅인 경우, 이후 작업을 위해 불리언 값을 설정합니다(아래 참조 – 유사한 웹훅을 그룹화하여 여러 번의 POST 요청 대신 한 번의 POST 요청으로 전달).
    * 주소가 이메일 주소인 경우, 이후 작업을 위해 호스트를 파싱합니다(아래 참조 – 유사한 호스트를 그룹화하여 여러 개별 연결 대신 한 번의 연결로 전달).
11. 수신자가 없고 반송도 없으면 "Invalid recipients"라는 550 오류로 응답합니다.

12. 수신자가 있으면 동일한 호스트별로 그룹화하여 반복 처리하고 이메일을 전달합니다. 자세한 내용은 아래 [이메일 전달 문제를 어떻게 처리합니까](#how-do-you-handle-email-delivery-issues) 섹션을 참조하세요.

    * 이메일 전송 중 오류가 발생하면 나중에 처리할 수 있도록 메모리에 저장합니다.
    * 이메일 전송 시 발생한 가장 낮은 오류 코드를 `DATA` 명령에 대한 응답 코드로 사용합니다. 이는 전달되지 않은 이메일은 일반적으로 원래 발신자가 재시도하지만, 이미 전달된 이메일은 메시지가 다시 전송될 때 재전송되지 않음을 의미합니다 ([Fingerprinting](#how-do-you-determine-an-email-fingerprint) 사용).
    * 오류가 없으면 250 성공 SMTP 응답 상태 코드를 보냅니다.
    * 반송은 상태 코드가 500 이상인 (영구 실패) 모든 전달 시도로 판단합니다.

13. 반송(영구 실패)이 없으면 영구 실패가 아닌 오류 중 가장 낮은 오류 코드의 SMTP 응답 상태 코드를 반환하거나 오류가 없으면 250 성공 상태 코드를 반환합니다.

14. 반송이 발생하면 모든 오류 코드 중 가장 낮은 코드를 발신자에게 반환한 후 백그라운드에서 반송 이메일을 보냅니다. 그러나 가장 낮은 오류 코드가 500 이상이면 반송 이메일을 보내지 않습니다. 이는 그렇지 않으면 발신자가 이중 반송 이메일(예: Gmail과 같은 발신 MTA에서 하나, 우리로부터 하나)을 받게 되기 때문입니다. 자세한 내용은 아래 [백스캐터 방지 방법](#how-do-you-protect-against-backscatter) 섹션을 참조하세요.

### 이메일 전달 문제를 어떻게 처리합니까 {#how-do-you-handle-email-delivery-issues}

발신자의 DMARC 정책이 통과하지 못했고 "From" 헤더와 정렬된 DKIM 서명이 없을 경우에만 이메일에 대해 "Friendly-From" 재작성 작업을 수행합니다. 이는 메시지의 "From" 헤더를 변경하고 "X-Original-From"을 설정하며, "Reply-To"가 설정되어 있지 않으면 이를 설정함을 의미합니다. 또한 이러한 헤더를 변경한 후 메시지의 ARC 봉인을 다시 봉인합니다.

또한 코드, DNS 요청, Node.js 내부, HTTP 요청(예: 408, 413, 429는 수신자가 웹훅인 경우 SMTP 응답 코드 421로 매핑) 및 메일 서버 응답(예: "defer" 또는 "slowdown" 응답은 421 오류로 재시도) 등 스택의 모든 수준에서 오류 메시지를 스마트하게 파싱합니다.

우리의 로직은 매우 견고하며 SSL/TLS 오류, 연결 문제 등도 재시도합니다. 견고성의 목표는 전달 구성을 위한 모든 수신자에 대한 전달 가능성을 극대화하는 것입니다.

수신자가 웹훅인 경우 요청 완료를 위해 최대 60초 타임아웃과 최대 3회 재시도(총 4회 요청)를 허용합니다. 408, 413, 429 오류 코드를 올바르게 파싱하여 SMTP 응답 코드 421로 매핑합니다.

수신자가 이메일 주소인 경우 수신자 메일 서버에서 STARTTLS가 가능하면 기회주의적 TLS로 이메일을 전송하려 시도합니다. 이메일 전송 중 SSL/TLS 오류가 발생하면 TLS 없이(STARTTLS 사용 안 함) 이메일 전송을 시도합니다.

DNS 또는 연결 오류가 발생하면 `DATA` 명령에 SMTP 응답 코드 421을 반환하며, 500 이상 오류가 있으면 반송이 전송됩니다.

전달하려는 이메일 서버가 당사의 메일 교환 IP 주소 중 하나 이상을 차단한 경우(예: 스패머 차단 기술 사용 시), 발신자가 나중에 메시지를 재시도하도록 SMTP 응답 코드 421을 보내며, 문제 해결을 위해 알림을 받습니다.

### IP 주소가 차단되는 경우 어떻게 처리합니까 {#how-do-you-handle-your-ip-addresses-becoming-blocked}
우리는 모든 주요 DNS 차단 목록을 정기적으로 모니터링하며, 만약 우리의 메일 교환("MX") IP 주소가 주요 차단 목록에 등재될 경우, 문제가 해결될 때까지 해당 DNS A 레코드 라운드 로빈에서 가능한 한 제외합니다.

이 글을 작성하는 시점에서, 우리는 여러 DNS 허용 목록에도 등재되어 있으며, 차단 목록 모니터링을 매우 중요하게 생각합니다. 문제가 발생했을 때 우리가 해결할 기회가 있기 전에 문제를 발견하면, <support@forwardemail.net>으로 서면 통지해 주시기 바랍니다.

우리의 IP 주소는 공개되어 있으며, [아래 섹션에서 더 자세한 정보를 확인하세요](#what-are-your-servers-ip-addresses).

### 우편 관리자 주소란 무엇인가요 {#what-are-postmaster-addresses}

잘못된 반송 메일과 모니터링되지 않거나 존재하지 않는 메일박스에 휴가 자동응답 메시지가 전송되는 것을 방지하기 위해, 우리는 메일러 데몬과 유사한 사용자 이름 목록을 유지합니다:

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
* [그리고 모든 no-reply 주소](#what-are-no-reply-addresses)

효율적인 이메일 시스템을 만들기 위해 이러한 목록이 어떻게 사용되는지에 대한 자세한 내용은 [RFC 5320 섹션 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6)을 참조하세요.

### no-reply 주소란 무엇인가요 {#what-are-no-reply-addresses}

다음 중 어느 하나와 동일한 이메일 사용자 이름(대소문자 구분 없음)은 no-reply 주소로 간주됩니다:

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

이 목록은 [GitHub에서 오픈 소스 프로젝트로 유지 관리되고 있습니다](https://github.com/forwardemail/reserved-email-addresses-list).

### 서버의 IP 주소는 무엇인가요 {#what-are-your-servers-ip-addresses}

우리의 IP 주소는 <https://forwardemail.net/ips>에서 공개하고 있습니다.

### 허용 목록이 있나요 {#do-you-have-an-allowlist}

네, 기본적으로 허용된 [도메인 이름 확장자 목록](#what-domain-name-extensions-are-allowlisted-by-default)과 엄격한 기준에 기반한 동적, 캐시 및 순환 허용 목록이 있습니다([허용 목록 기준은 무엇인가요](#what-is-your-allowlist-criteria)).

유료 고객이 사용하는 모든 도메인, 이메일 및 IP 주소는 매시간 자동으로 차단 목록과 대조되어, 필요 시 관리자가 수동으로 개입할 수 있도록 알림을 받습니다.

또한, 귀하의 도메인 또는 이메일 주소가 차단 목록에 등재된 경우(예: 스팸, 바이러스 전송 또는 사칭 공격으로 인해) 도메인 관리자(귀하)와 우리 팀 관리자에게 즉시 이메일로 통지됩니다. 이를 방지하기 위해 [DMARC 설정을 강력히 권장합니다](#how-do-i-set-up-dmarc-for-forward-email).

### 기본적으로 허용된 도메인 이름 확장자는 무엇인가요 {#what-domain-name-extensions-are-allowlisted-by-default}

다음 도메인 이름 확장자는 Umbrella 인기 목록에 포함되어 있든 아니든 기본적으로 허용된 것으로 간주됩니다:

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
  <li class="list-inline-item"><code class="notranslate">tx.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ut.us</code></li>
  <li class="list-inline-item"><code class="notranslate">va.us</code></li>
  <li class="list-inline-item"><code class="notranslate">vi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">vt.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wv.us</code></li>
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
추가로, 이 [브랜드 및 기업 최상위 도메인](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains)은 기본적으로 허용 목록에 포함되어 있습니다 (예: Apple Card 은행 명세서의 `applecard.apple`에서 `apple`):

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">aaa</code></li>
  <li class="list-inline-item"><code class="notranslate">aarp</code></li>
  <li class="list-inline-item"><code class="notranslate">abarth</code></li>
  <li class="list-inline-item"><code class="notranslate">abb</code></li>
  <li class="list-inline-item"><code class="notranslate">abbott</code></li>
  <li class="list-inline-item"><code class="notranslate">abbvie</code></li>
  <li class="list-inline-item"><code class="notranslate">abc</code></li>
  <li class="list-inline-item"><code class="notranslate">accenture</code></li>
  <li class="list-inline-item"><code class="notranslate">aco</code></li>
  <li class="list-inline-item"><code class="notranslate">aeg</code></li>
  <li class="list-inline-item"><code class="notranslate">aetna</code></li>
  <li class="list-inline-item"><code class="notranslate">afl</code></li>
  <li class="list-inline-item"><code class="notranslate">agakhan</code></li>
  <li class="list-inline-item"><code class="notranslate">aig</code></li>
  <li class="list-inline-item"><code class="notranslate">aigo</code></li>
  <li class="list-inline-item"><code class="notranslate">airbus</code></li>
  <li class="list-inline-item"><code class="notranslate">airtel</code></li>
  <li class="list-inline-item"><code class="notranslate">akdn</code></li>
  <li class="list-inline-item"><code class="notranslate">alfaromeo</code></li>
  <li class="list-inline-item"><code class="notranslate">alibaba</code></li>
  <li class="list-inline-item"><code class="notranslate">alipay</code></li>
  <li class="list-inline-item"><code class="notranslate">allfinanz</code></li>
  <li class="list-inline-item"><code class="notranslate">allstate</code></li>
  <li class="list-inline-item"><code class="notranslate">ally</code></li>
  <li class="list-inline-item"><code class="notranslate">alstom</code></li>
  <li class="list-inline-item"><code class="notranslate">amazon</code></li>
  <li class="list-inline-item"><code class="notranslate">americanexpress</code></li>
  <li class="list-inline-item"><code class="notranslate">amex</code></li>
  <li class="list-inline-item"><code class="notranslate">amica</code></li>
  <li class="list-inline-item"><code class="notranslate">android</code></li>
  <li class="list-inline-item"><code class="notranslate">anz</code></li>
  <li class="list-inline-item"><code class="notranslate">aol</code></li>
  <li class="list-inline-item"><code class="notranslate">apple</code></li>
  <li class="list-inline-item"><code class="notranslate">aquarelle</code></li>
  <li class="list-inline-item"><code class="notranslate">aramco</code></li>
  <li class="list-inline-item"><code class="notranslate">audi</code></li>
  <li class="list-inline-item"><code class="notranslate">auspost</code></li>
  <li class="list-inline-item"><code class="notranslate">aws</code></li>
  <li class="list-inline-item"><code class="notranslate">axa</code></li>
  <li class="list-inline-item"><code class="notranslate">azure</code></li>
  <li class="list-inline-item"><code class="notranslate">baidu</code></li>
  <li class="list-inline-item"><code class="notranslate">bananarepublic</code></li>
  <li class="list-inline-item"><code class="notranslate">barclaycard</code></li>
  <li class="list-inline-item"><code class="notranslate">barclays</code></li>
  <li class="list-inline-item"><code class="notranslate">basketball</code></li>
  <li class="list-inline-item"><code class="notranslate">bauhaus</code></li>
  <li class="list-inline-item"><code class="notranslate">bbc</code></li>
  <li class="list-inline-item"><code class="notranslate">bbt</code></li>
  <li class="list-inline-item"><code class="notranslate">bbva</code></li>
  <li class="list-inline-item"><code class="notranslate">bcg</code></li>
  <li class="list-inline-item"><code class="notranslate">bentley</code></li>
  <li class="list-inline-item"><code class="notranslate">bharti</code></li>
  <li class="list-inline-item"><code class="notranslate">bing</code></li>
  <li class="list-inline-item"><code class="notranslate">blanco</code></li>
  <li class="list-inline-item"><code class="notranslate">bloomberg</code></li>
  <li class="list-inline-item"><code class="notranslate">bms</code></li>
  <li class="list-inline-item"><code class="notranslate">bmw</code></li>
  <li class="list-inline-item"><code class="notranslate">bnl</code></li>
  <li class="list-inline-item"><code class="notranslate">bnpparibas</code></li>
  <li class="list-inline-item"><code class="notranslate">boehringer</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">bond</code></li>-->
  <li class="list-inline-item"><code class="notranslate">booking</code></li>
  <li class="list-inline-item"><code class="notranslate">bosch</code></li>
  <li class="list-inline-item"><code class="notranslate">bostik</code></li>
  <li class="list-inline-item"><code class="notranslate">bradesco</code></li>
  <li class="list-inline-item"><code class="notranslate">bridgestone</code></li>
  <li class="list-inline-item"><code class="notranslate">brother</code></li>
  <li class="list-inline-item"><code class="notranslate">bugatti</code></li>
  <li class="list-inline-item"><code class="notranslate">cal</code></li>
  <li class="list-inline-item"><code class="notranslate">calvinklein</code></li>
  <li class="list-inline-item"><code class="notranslate">canon</code></li>
  <li class="list-inline-item"><code class="notranslate">capitalone</code></li>
  <li class="list-inline-item"><code class="notranslate">caravan</code></li>
  <li class="list-inline-item"><code class="notranslate">cartier</code></li>
  <li class="list-inline-item"><code class="notranslate">cba</code></li>
  <li class="list-inline-item"><code class="notranslate">cbn</code></li>
  <li class="list-inline-item"><code class="notranslate">cbre</code></li>
  <li class="list-inline-item"><code class="notranslate">cbs</code></li>
  <li class="list-inline-item"><code class="notranslate">cern</code></li>
  <li class="list-inline-item"><code class="notranslate">cfa</code></li>
  <li class="list-inline-item"><code class="notranslate">chanel</code></li>
  <li class="list-inline-item"><code class="notranslate">chase</code></li>
  <li class="list-inline-item"><code class="notranslate">chintai</code></li>
  <li class="list-inline-item"><code class="notranslate">chrome</code></li>
  <li class="list-inline-item"><code class="notranslate">chrysler</code></li>
  <li class="list-inline-item"><code class="notranslate">cipriani</code></li>
  <li class="list-inline-item"><code class="notranslate">cisco</code></li>
  <li class="list-inline-item"><code class="notranslate">citadel</code></li>
  <li class="list-inline-item"><code class="notranslate">citi</code></li>
  <li class="list-inline-item"><code class="notranslate">citic</code></li>
  <li class="list-inline-item"><code class="notranslate">clubmed</code></li>
  <li class="list-inline-item"><code class="notranslate">comcast</code></li>
  <li class="list-inline-item"><code class="notranslate">commbank</code></li>
  <li class="list-inline-item"><code class="notranslate">creditunion</code></li>
  <li class="list-inline-item"><code class="notranslate">crown</code></li>
  <li class="list-inline-item"><code class="notranslate">crs</code></li>
  <li class="list-inline-item"><code class="notranslate">csc</code></li>
  <li class="list-inline-item"><code class="notranslate">cuisinella</code></li>
  <li class="list-inline-item"><code class="notranslate">dabur</code></li>
  <li class="list-inline-item"><code class="notranslate">datsun</code></li>
  <li class="list-inline-item"><code class="notranslate">dealer</code></li>
  <li class="list-inline-item"><code class="notranslate">dell</code></li>
  <li class="list-inline-item"><code class="notranslate">deloitte</code></li>
  <li class="list-inline-item"><code class="notranslate">delta</code></li>
  <li class="list-inline-item"><code class="notranslate">dhl</code></li>
  <li class="list-inline-item"><code class="notranslate">discover</code></li>
  <li class="list-inline-item"><code class="notranslate">dish</code></li>
  <li class="list-inline-item"><code class="notranslate">dnp</code></li>
  <li class="list-inline-item"><code class="notranslate">dodge</code></li>
  <li class="list-inline-item"><code class="notranslate">dunlop</code></li>
  <li class="list-inline-item"><code class="notranslate">dupont</code></li>
  <li class="list-inline-item"><code class="notranslate">dvag</code></li>
  <li class="list-inline-item"><code class="notranslate">edeka</code></li>
  <li class="list-inline-item"><code class="notranslate">emerck</code></li>
  <li class="list-inline-item"><code class="notranslate">epson</code></li>
  <li class="list-inline-item"><code class="notranslate">ericsson</code></li>
  <li class="list-inline-item"><code class="notranslate">erni</code></li>
  <li class="list-inline-item"><code class="notranslate">esurance</code></li>
  <li class="list-inline-item"><code class="notranslate">etisalat</code></li>
  <li class="list-inline-item"><code class="notranslate">eurovision</code></li>
  <li class="list-inline-item"><code class="notranslate">everbank</code></li>
  <li class="list-inline-item"><code class="notranslate">extraspace</code></li>
  <li class="list-inline-item"><code class="notranslate">fage</code></li>
  <li class="list-inline-item"><code class="notranslate">fairwinds</code></li>
  <li class="list-inline-item"><code class="notranslate">farmers</code></li>
  <li class="list-inline-item"><code class="notranslate">fedex</code></li>
  <li class="list-inline-item"><code class="notranslate">ferrari</code></li>
  <li class="list-inline-item"><code class="notranslate">ferrero</code></li>
  <li class="list-inline-item"><code class="notranslate">fiat</code></li>
  <li class="list-inline-item"><code class="notranslate">fidelity</code></li>
  <li class="list-inline-item"><code class="notranslate">firestone</code></li>
  <li class="list-inline-item"><code class="notranslate">firmdale</code></li>
  <li class="list-inline-item"><code class="notranslate">flickr</code></li>
  <li class="list-inline-item"><code class="notranslate">flir</code></li>
  <li class="list-inline-item"><code class="notranslate">flsmidth</code></li>
  <li class="list-inline-item"><code class="notranslate">ford</code></li>
  <li class="list-inline-item"><code class="notranslate">fox</code></li>
  <li class="list-inline-item"><code class="notranslate">fresenius</code></li>
  <li class="list-inline-item"><code class="notranslate">forex</code></li>
  <li class="list-inline-item"><code class="notranslate">frogans</code></li>
  <li class="list-inline-item"><code class="notranslate">frontier</code></li>
  <li class="list-inline-item"><code class="notranslate">fujitsu</code></li>
  <li class="list-inline-item"><code class="notranslate">fujixerox</code></li>
  <li class="list-inline-item"><code class="notranslate">gallo</code></li>
  <li class="list-inline-item"><code class="notranslate">gallup</code></li>
  <li class="list-inline-item"><code class="notranslate">gap</code></li>
  <li class="list-inline-item"><code class="notranslate">gbiz</code></li>
  <li class="list-inline-item"><code class="notranslate">gea</code></li>
  <li class="list-inline-item"><code class="notranslate">genting</code></li>
  <li class="list-inline-item"><code class="notranslate">giving</code></li>
  <li class="list-inline-item"><code class="notranslate">gle</code></li>
  <li class="list-inline-item"><code class="notranslate">globo</code></li>
  <li class="list-inline-item"><code class="notranslate">gmail</code></li>
  <li class="list-inline-item"><code class="notranslate">gmo</code></li>
  <li class="list-inline-item"><code class="notranslate">gmx</code></li>
  <li class="list-inline-item"><code class="notranslate">godaddy</code></li>
  <li class="list-inline-item"><code class="notranslate">goldpoint</code></li>
  <li class="list-inline-item"><code class="notranslate">goodyear</code></li>
  <li class="list-inline-item"><code class="notranslate">goog</code></li>
  <li class="list-inline-item"><code class="notranslate">google</code></li>
  <li class="list-inline-item"><code class="notranslate">grainger</code></li>
  <li class="list-inline-item"><code class="notranslate">guardian</code></li>
  <li class="list-inline-item"><code class="notranslate">gucci</code></li>
  <li class="list-inline-item"><code class="notranslate">hbo</code></li>
  <li class="list-inline-item"><code class="notranslate">hdfc</code></li>
  <li class="list-inline-item"><code class="notranslate">hdfcbank</code></li>
  <li class="list-inline-item"><code class="notranslate">hermes</code></li>
  <li class="list-inline-item"><code class="notranslate">hisamitsu</code></li>
  <li class="list-inline-item"><code class="notranslate">hitachi</code></li>
  <li class="list-inline-item"><code class="notranslate">hkt</code></li>
  <li class="list-inline-item"><code class="notranslate">honda</code></li>
  <li class="list-inline-item"><code class="notranslate">honeywell</code></li>
  <li class="list-inline-item"><code class="notranslate">hotmail</code></li>
  <li class="list-inline-item"><code class="notranslate">hsbc</code></li>
  <li class="list-inline-item"><code class="notranslate">hughes</code></li>
  <li class="list-inline-item"><code class="notranslate">hyatt</code></li>
  <li class="list-inline-item"><code class="notranslate">hyundai</code></li>
  <li class="list-inline-item"><code class="notranslate">ibm</code></li>
  <li class="list-inline-item"><code class="notranslate">ieee</code></li>
  <li class="list-inline-item"><code class="notranslate">ifm</code></li>
  <li class="list-inline-item"><code class="notranslate">ikano</code></li>
  <li class="list-inline-item"><code class="notranslate">imdb</code></li>
  <li class="list-inline-item"><code class="notranslate">infiniti</code></li>
  <li class="list-inline-item"><code class="notranslate">intel</code></li>
  <li class="list-inline-item"><code class="notranslate">intuit</code></li>
  <li class="list-inline-item"><code class="notranslate">ipiranga</code></li>
  <li class="list-inline-item"><code class="notranslate">iselect</code></li>
  <li class="list-inline-item"><code class="notranslate">itau</code></li>
  <li class="list-inline-item"><code class="notranslate">itv</code></li>
  <li class="list-inline-item"><code class="notranslate">iveco</code></li>
  <li class="list-inline-item"><code class="notranslate">jaguar</code></li>
  <li class="list-inline-item"><code class="notranslate">java</code></li>
  <li class="list-inline-item"><code class="notranslate">jcb</code></li>
  <li class="list-inline-item"><code class="notranslate">jcp</code></li>
  <li class="list-inline-item"><code class="notranslate">jeep</code></li>
  <li class="list-inline-item"><code class="notranslate">jpmorgan</code></li>
  <li class="list-inline-item"><code class="notranslate">juniper</code></li>
  <li class="list-inline-item"><code class="notranslate">kddi</code></li>
  <li class="list-inline-item"><code class="notranslate">kerryhotels</code></li>
  <li class="list-inline-item"><code class="notranslate">kerrylogistics</code></li>
  <li class="list-inline-item"><code class="notranslate">kerryproperties</code></li>
  <li class="list-inline-item"><code class="notranslate">kfh</code></li>
  <li class="list-inline-item"><code class="notranslate">kia</code></li>
  <li class="list-inline-item"><code class="notranslate">kinder</code></li>
  <li class="list-inline-item"><code class="notranslate">kindle</code></li>
  <li class="list-inline-item"><code class="notranslate">komatsu</code></li>
  <li class="list-inline-item"><code class="notranslate">kpmg</code></li>
  <li class="list-inline-item"><code class="notranslate">kred</code></li>
  <li class="list-inline-item"><code class="notranslate">kuokgroup</code></li>
  <li class="list-inline-item"><code class="notranslate">lacaixa</code></li>
  <li class="list-inline-item"><code class="notranslate">ladbrokes</code></li>
  <li class="list-inline-item"><code class="notranslate">lamborghini</code></li>
  <li class="list-inline-item"><code class="notranslate">lancaster</code></li>
  <li class="list-inline-item"><code class="notranslate">lancia</code></li>
  <li class="list-inline-item"><code class="notranslate">lancome</code></li>
  <li class="list-inline-item"><code class="notranslate">landrover</code></li>
  <li class="list-inline-item"><code class="notranslate">lanxess</code></li>
  <li class="list-inline-item"><code class="notranslate">lasalle</code></li>
  <li class="list-inline-item"><code class="notranslate">latrobe</code></li>
  <li class="list-inline-item"><code class="notranslate">lds</code></li>
  <li class="list-inline-item"><code class="notranslate">leclerc</code></li>
  <li class="list-inline-item"><code class="notranslate">lego</code></li>
  <li class="list-inline-item"><code class="notranslate">liaison</code></li>
  <li class="list-inline-item"><code class="notranslate">lexus</code></li>
  <li class="list-inline-item"><code class="notranslate">lidl</code></li>
  <li class="list-inline-item"><code class="notranslate">lifestyle</code></li>
  <li class="list-inline-item"><code class="notranslate">lilly</code></li>
  <li class="list-inline-item"><code class="notranslate">lincoln</code></li>
  <li class="list-inline-item"><code class="notranslate">linde</code></li>
  <li class="list-inline-item"><code class="notranslate">lipsy</code></li>
  <li class="list-inline-item"><code class="notranslate">lixil</code></li>
  <li class="list-inline-item"><code class="notranslate">locus</code></li>
  <li class="list-inline-item"><code class="notranslate">lotte</code></li>
  <li class="list-inline-item"><code class="notranslate">lpl</code></li>
  <li class="list-inline-item"><code class="notranslate">lplfinancial</code></li>
  <li class="list-inline-item"><code class="notranslate">lundbeck</code></li>
  <li class="list-inline-item"><code class="notranslate">lupin</code></li>
  <li class="list-inline-item"><code class="notranslate">macys</code></li>
  <li class="list-inline-item"><code class="notranslate">maif</code></li>
  <li class="list-inline-item"><code class="notranslate">man</code></li>
  <li class="list-inline-item"><code class="notranslate">mango</code></li>
  <li class="list-inline-item"><code class="notranslate">marriott</code></li>
  <li class="list-inline-item"><code class="notranslate">maserati</code></li>
  <li class="list-inline-item"><code class="notranslate">mattel</code></li>
  <li class="list-inline-item"><code class="notranslate">mckinsey</code></li>
  <li class="list-inline-item"><code class="notranslate">metlife</code></li>
  <li class="list-inline-item"><code class="notranslate">microsoft</code></li>
  <li class="list-inline-item"><code class="notranslate">mini</code></li>
  <li class="list-inline-item"><code class="notranslate">mit</code></li>
  <li class="list-inline-item"><code class="notranslate">mitsubishi</code></li>
  <li class="list-inline-item"><code class="notranslate">mlb</code></li>
  <li class="list-inline-item"><code class="notranslate">mma</code></li>
  <li class="list-inline-item"><code class="notranslate">monash</code></li>
  <li class="list-inline-item"><code class="notranslate">mormon</code></li>
  <li class="list-inline-item"><code class="notranslate">moto</code></li>
  <li class="list-inline-item"><code class="notranslate">movistar</code></li>
  <li class="list-inline-item"><code class="notranslate">msd</code></li>
  <li class="list-inline-item"><code class="notranslate">mtn</code></li>
  <li class="list-inline-item"><code class="notranslate">mtr</code></li>
  <li class="list-inline-item"><code class="notranslate">mutual</code></li>
  <li class="list-inline-item"><code class="notranslate">nadex</code></li>
  <li class="list-inline-item"><code class="notranslate">nationwide</code></li>
  <li class="list-inline-item"><code class="notranslate">natura</code></li>
  <li class="list-inline-item"><code class="notranslate">nba</code></li>
  <li class="list-inline-item"><code class="notranslate">nec</code></li>
  <li class="list-inline-item"><code class="notranslate">netflix</code></li>
  <li class="list-inline-item"><code class="notranslate">neustar</code></li>
  <li class="list-inline-item"><code class="notranslate">newholland</code></li>
  <li class="list-inline-item"><code class="notranslate">nfl</code></li>
  <li class="list-inline-item"><code class="notranslate">nhk</code></li>
  <li class="list-inline-item"><code class="notranslate">nico</code></li>
  <li class="list-inline-item"><code class="notranslate">nike</code></li>
  <li class="list-inline-item"><code class="notranslate">nikon</code></li>
  <li class="list-inline-item"><code class="notranslate">nissan</code></li>
  <li class="list-inline-item"><code class="notranslate">nissay</code></li>
  <li class="list-inline-item"><code class="notranslate">nokia</code></li>
  <li class="list-inline-item"><code class="notranslate">northwesternmutual</code></li>
  <li class="list-inline-item"><code class="notranslate">norton</code></li>
  <li class="list-inline-item"><code class="notranslate">nra</code></li>
  <li class="list-inline-item"><code class="notranslate">ntt</code></li>
  <li class="list-inline-item"><code class="notranslate">obi</code></li>
  <li class="list-inline-item"><code class="notranslate">office</code></li>
  <li class="list-inline-item"><code class="notranslate">omega</code></li>
  <li class="list-inline-item"><code class="notranslate">oracle</code></li>
  <li class="list-inline-item"><code class="notranslate">orange</code></li>
  <li class="list-inline-item"><code class="notranslate">otsuka</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">ovh</code></li>-->
  <li class="list-inline-item"><code class="notranslate">panasonic</code></li>
  <li class="list-inline-item"><code class="notranslate">pccw</code></li>
  <li class="list-inline-item"><code class="notranslate">pfizer</code></li>
  <li class="list-inline-item"><code class="notranslate">philips</code></li>
  <li class="list-inline-item"><code class="notranslate">piaget</code></li>
  <li class="list-inline-item"><code class="notranslate">pictet</code></li>
  <li class="list-inline-item"><code class="notranslate">ping</code></li>
  <li class="list-inline-item"><code class="notranslate">pioneer</code></li>
  <li class="list-inline-item"><code class="notranslate">play</code></li>
  <li class="list-inline-item"><code class="notranslate">playstation</code></li>
  <li class="list-inline-item"><code class="notranslate">pohl</code></li>
  <li class="list-inline-item"><code class="notranslate">politie</code></li>
  <li class="list-inline-item"><code class="notranslate">praxi</code></li>
  <li class="list-inline-item"><code class="notranslate">prod</code></li>
  <li class="list-inline-item"><code class="notranslate">progressive</code></li>
  <li class="list-inline-item"><code class="notranslate">pru</code></li>
  <li class="list-inline-item"><code class="notranslate">prudential</code></li>
  <li class="list-inline-item"><code class="notranslate">pwc</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">quest</code></li>-->
  <li class="list-inline-item"><code class="notranslate">qvc</code></li>
  <li class="list-inline-item"><code class="notranslate">redstone</code></li>
  <li class="list-inline-item"><code class="notranslate">reliance</code></li>
  <li class="list-inline-item"><code class="notranslate">rexroth</code></li>
  <li class="list-inline-item"><code class="notranslate">ricoh</code></li>
  <li class="list-inline-item"><code class="notranslate">rmit</code></li>
  <li class="list-inline-item"><code class="notranslate">rocher</code></li>
  <li class="list-inline-item"><code class="notranslate">rogers</code></li>
  <li class="list-inline-item"><code class="notranslate">rwe</code></li>
  <li class="list-inline-item"><code class="notranslate">safety</code></li>
  <li class="list-inline-item"><code class="notranslate">sakura</code></li>
  <li class="list-inline-item"><code class="notranslate">samsung</code></li>
  <li class="list-inline-item"><code class="notranslate">sandvik</code></li>
  <li class="list-inline-item"><code class="notranslate">sandvikcoromant</code></li>
  <li class="list-inline-item"><code class="notranslate">sanofi</code></li>
  <li class="list-inline-item"><code class="notranslate">sap</code></li>
  <li class="list-inline-item"><code class="notranslate">saxo</code></li>
  <li class="list-inline-item"><code class="notranslate">sbi</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">sbs</code></li>-->
  <li class="list-inline-item"><code class="notranslate">sca</code></li>
  <li class="list-inline-item"><code class="notranslate">scb</code></li>
  <li class="list-inline-item"><code class="notranslate">schaeffler</code></li>
  <li class="list-inline-item"><code class="notranslate">schmidt</code></li>
  <li class="list-inline-item"><code class="notranslate">schwarz</code></li>
  <li class="list-inline-item"><code class="notranslate">scjohnson</code></li>
  <li class="list-inline-item"><code class="notranslate">scor</code></li>
  <li class="list-inline-item"><code class="notranslate">seat</code></li>
  <li class="list-inline-item"><code class="notranslate">sener</code></li>
  <li class="list-inline-item"><code class="notranslate">ses</code></li>
  <li class="list-inline-item"><code class="notranslate">sew</code></li>
  <li class="list-inline-item"><code class="notranslate">seven</code></li>
  <li class="list-inline-item"><code class="notranslate">sfr</code></li>
  <li class="list-inline-item"><code class="notranslate">seek</code></li>
  <li class="list-inline-item"><code class="notranslate">shangrila</code></li>
  <li class="list-inline-item"><code class="notranslate">sharp</code></li>
  <li class="list-inline-item"><code class="notranslate">shaw</code></li>
  <li class="list-inline-item"><code class="notranslate">shell</code></li>
  <li class="list-inline-item"><code class="notranslate">shriram</code></li>
  <li class="list-inline-item"><code class="notranslate">sina</code></li>
  <li class="list-inline-item"><code class="notranslate">sky</code></li>
  <li class="list-inline-item"><code class="notranslate">skype</code></li>
  <li class="list-inline-item"><code class="notranslate">smart</code></li>
  <li class="list-inline-item"><code class="notranslate">sncf</code></li>
  <li class="list-inline-item"><code class="notranslate">softbank</code></li>
  <li class="list-inline-item"><code class="notranslate">sohu</code></li>
  <li class="list-inline-item"><code class="notranslate">sony</code></li>
  <li class="list-inline-item"><code class="notranslate">spiegel</code></li>
  <li class="list-inline-item"><code class="notranslate">stada</code></li>
  <li class="list-inline-item"><code class="notranslate">staples</code></li>
  <li class="list-inline-item"><code class="notranslate">star</code></li>
  <li class="list-inline-item"><code class="notranslate">starhub</code></li>
  <li class="list-inline-item"><code class="notranslate">statebank</code></li>
  <li class="list-inline-item"><code class="notranslate">statefarm</code></li>
  <li class="list-inline-item"><code class="notranslate">statoil</code></li>
  <li class="list-inline-item"><code class="notranslate">stc</code></li>
  <li class="list-inline-item"><code class="notranslate">stcgroup</code></li>
  <li class="list-inline-item"><code class="notranslate">suzuki</code></li>
  <li class="list-inline-item"><code class="notranslate">swatch</code></li>
  <li class="list-inline-item"><code class="notranslate">swiftcover</code></li>
  <li class="list-inline-item"><code class="notranslate">symantec</code></li>
  <li class="list-inline-item"><code class="notranslate">taobao</code></li>
  <li class="list-inline-item"><code class="notranslate">target</code></li>
  <li class="list-inline-item"><code class="notranslate">tatamotors</code></li>
  <li class="list-inline-item"><code class="notranslate">tdk</code></li>
  <li class="list-inline-item"><code class="notranslate">telecity</code></li>
  <li class="list-inline-item"><code class="notranslate">telefonica</code></li>
  <li class="list-inline-item"><code class="notranslate">temasek</code></li>
  <li class="list-inline-item"><code class="notranslate">teva</code></li>
  <li class="list-inline-item"><code class="notranslate">tiffany</code></li>
  <li class="list-inline-item"><code class="notranslate">tjx</code></li>
  <li class="list-inline-item"><code class="notranslate">toray</code></li>
  <li class="list-inline-item"><code class="notranslate">toshiba</code></li>
  <li class="list-inline-item"><code class="notranslate">total</code></li>
  <li class="list-inline-item"><code class="notranslate">toyota</code></li>
  <li class="list-inline-item"><code class="notranslate">travelchannel</code></li>
  <li class="list-inline-item"><code class="notranslate">travelers</code></li>
  <li class="list-inline-item"><code class="notranslate">tui</code></li>
  <li class="list-inline-item"><code class="notranslate">tvs</code></li>
  <li class="list-inline-item"><code class="notranslate">ubs</code></li>
  <li class="list-inline-item"><code class="notranslate">unicom</code></li>
  <li class="list-inline-item"><code class="notranslate">uol</code></li>
  <li class="list-inline-item"><code class="notranslate">ups</code></li>
  <li class="list-inline-item"><code class="notranslate">vanguard</code></li>
  <li class="list-inline-item"><code class="notranslate">verisign</code></li>
  <li class="list-inline-item"><code class="notranslate">vig</code></li>
  <li class="list-inline-item"><code class="notranslate">viking</code></li>
  <li class="list-inline-item"><code class="notranslate">virgin</code></li>
  <li class="list-inline-item"><code class="notranslate">visa</code></li>
  <li class="list-inline-item"><code class="notranslate">vista</code></li>
  <li class="list-inline-item"><code class="notranslate">vistaprint</code></li>
  <li class="list-inline-item"><code class="notranslate">vivo</code></li>
  <li class="list-inline-item"><code class="notranslate">volkswagen</code></li>
  <li class="list-inline-item"><code class="notranslate">volvo</code></li>
  <li class="list-inline-item"><code class="notranslate">walmart</code></li>
  <li class="list-inline-item"><code class="notranslate">walter</code></li>
  <li class="list-inline-item"><code class="notranslate">weatherchannel</code></li>
  <li class="list-inline-item"><code class="notranslate">weber</code></li>
  <li class="list-inline-item"><code class="notranslate">weir</code></li>
  <li class="list-inline-item"><code class="notranslate">williamhill</code></li>
  <li class="list-inline-item"><code class="notranslate">windows</code></li>
  <li class="list-inline-item"><code class="notranslate">wme</code></li>
  <li class="list-inline-item"><code class="notranslate">wolterskluwer</code></li>
  <li class="list-inline-item"><code class="notranslate">woodside</code></li>
  <li class="list-inline-item"><code class="notranslate">wtc</code></li>
  <li class="list-inline-item"><code class="notranslate">xbox</code></li>
  <li class="list-inline-item"><code class="notranslate">xerox</code></li>
  <li class="list-inline-item"><code class="notranslate">xfinity</code></li>
  <li class="list-inline-item"><code class="notranslate">yahoo</code></li>
  <li class="list-inline-item"><code class="notranslate">yamaxun</code></li>
  <li class="list-inline-item"><code class="notranslate">yandex</code></li>
  <li class="list-inline-item"><code class="notranslate">yodobashi</code></li>
  <li class="list-inline-item"><code class="notranslate">youtube</code></li>
  <li class="list-inline-item"><code class="notranslate">zappos</code></li>
  <li class="list-inline-item"><code class="notranslate">zara</code></li>
  <li class="list-inline-item"><code class="notranslate">zippo</code></li>
</ul>
2025년 3월 18일 기준으로 다음 프랑스 해외 영토도 이 목록에 추가되었습니다 ([이 GitHub 요청에 따라](https://github.com/forwardemail/forwardemail.net/issues/327)):

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

2025년 7월 8일 기준으로 다음 유럽 특정 국가들이 추가되었습니다:

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">ax</code></li>
  <li class="list-inline-item"><code class="notranslate">bg</code></li>
  <li class="list-inline-item"><code class="notranslate">fo</code></li>
  <li class="list-inline-item"><code class="notranslate">gi</code></li>
  <li class="list-inline-item"><code class="notranslate">gr</code></li>
  <li class="list-inline-item"><code class="notranslate">hr</code></li>
  <li class="list-inline-item"><code class="notranslate">hu</code></li>
  <li class="list-inline-item"><code class="notranslate">lt</code></li>
  <li class="list-inline-item"><code class="notranslate">lu</code></li>
  <li class="list-inline-item"><code class="notranslate">mc</code></li>
  <li class="list-inline-item"><code class="notranslate">mk</code></li>
  <li class="list-inline-item"><code class="notranslate">mt</code></li>
  <li class="list-inline-item"><code class="notranslate">ro</code></li>
  <li class="list-inline-item"><code class="notranslate">sk</code></li>
  <li class="list-inline-item"><code class="notranslate">va</code></li>
</ul>

2025년 10월에는 수요에 따라 <code class="notranslate">cz</code> (체코 공화국)도 추가되었습니다.

`ru`와 `ua`는 스팸 활동이 많아 특별히 포함하지 않았습니다.

### 허용 목록 기준이 무엇인가요 {#what-is-your-allowlist-criteria}

우리는 [기본적으로 허용된 도메인 이름 확장자 목록](#what-domain-name-extensions-are-allowlisted-by-default)을 고정적으로 가지고 있으며, 다음 엄격한 기준에 따라 동적이고 캐시된 롤링 허용 목록도 유지합니다:

* 발신자 루트 도메인은 [무료 플랜에서 제공하는 도메인 이름 확장자 목록과 일치하는 도메인 이름 확장자](#what-domain-name-extensions-can-be-used-for-free)여야 합니다 (`biz`와 `info` 추가 포함). 또한 `edu`, `gov`, `mil`의 부분 일치도 포함하며, 예를 들어 `xyz.gov.au`와 `xyz.edu.au`가 있습니다.
* 발신자 루트 도메인은 [Umbrella 인기 목록](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List")("UPL")에서 상위 100,000개의 고유 루트 도메인 파싱 결과 내에 있어야 합니다.
* 발신자 루트 도메인은 UPL의 지난 7일 중 최소 4일 이상(약 50% 이상) 나타난 고유 루트 도메인 중 상위 50,000개 내에 있어야 합니다.
* 발신자 루트 도메인은 Cloudflare에서 성인 콘텐츠 또는 악성코드로 [분류](https://radar.cloudflare.com/categorization-feedback/)되지 않아야 합니다.
* 발신자 루트 도메인은 A 레코드 또는 MX 레코드가 설정되어 있어야 합니다.
* 발신자 루트 도메인은 A 레코드, MX 레코드, `p=reject` 또는 `p=quarantine`이 포함된 DMARC 레코드, 또는 `-all` 또는 `~all` 한정자가 포함된 SPF 레코드 중 하나 이상을 가지고 있어야 합니다.

이 기준을 충족하면 발신자 루트 도메인은 7일간 캐시됩니다. 자동 작업은 매일 실행되므로, 이는 매일 업데이트되는 롤링 허용 목록 캐시입니다.

자동 작업은 지난 7일간의 UPL을 메모리 내에서 다운로드하고 압축을 해제한 후, 위 엄격한 기준에 따라 메모리 내에서 파싱합니다.

작성 시점에 인기 있는 도메인들, 예를 들어 Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify 등도 물론 포함됩니다.
허용 목록에 없는 발신자인 경우, FQDN 루트 도메인 또는 IP 주소가 처음으로 이메일을 보내면 [비율 제한](#do-you-have-rate-limiting) 및 [그레이리스트](#do-you-have-a-greylist)가 적용됩니다. 이는 이메일 표준으로 채택된 일반적인 관행임을 참고하세요. 대부분의 이메일 서버 클라이언트는 비율 제한 또는 그레이리스트 오류(예: 421 또는 4xx 수준 오류 상태 코드)를 받으면 재시도하려고 시도합니다.

**`a@gmail.com`, `b@xyz.edu`, `c@gov.au`와 같은 특정 발신자는 여전히 [차단 목록](#do-you-have-a-denylist)에 포함될 수 있습니다** (예: 해당 발신자로부터 스팸, 피싱 또는 악성코드가 자동으로 감지되는 경우).

### 무료로 사용할 수 있는 도메인 이름 확장자 {#what-domain-name-extensions-can-be-used-for-free}

2023년 3월 31일부터 사용자와 서비스를 보호하기 위해 새로운 포괄적 스팸 규칙을 시행했습니다.

이 새로운 규칙은 무료 플랜에서 다음 도메인 이름 확장자만 사용할 수 있도록 허용합니다:

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">ac</code></li>
  <li class="list-inline-item"><code class="notranslate">ad</code></li>
  <li class="list-inline-item"><code class="notranslate">ag</code></li>
  <li class="list-inline-item"><code class="notranslate">ai</code></li>
  <li class="list-inline-item"><code class="notranslate">al</code></li>
  <li class="list-inline-item"><code class="notranslate">am</code></li>
  <li class="list-inline-item"><code class="notranslate">app</code></li>
  <li class="list-inline-item"><code class="notranslate">as</code></li>
  <li class="list-inline-item"><code class="notranslate">at</code></li>
  <li class="list-inline-item"><code class="notranslate">au</code></li>
  <li class="list-inline-item"><code class="notranslate">ax</code></li>
  <li class="list-inline-item"><code class="notranslate">ba</code></li>
  <li class="list-inline-item"><code class="notranslate">be</code></li>
  <li class="list-inline-item"><code class="notranslate">bg</code></li>
  <li class="list-inline-item"><code class="notranslate">br</code></li>
  <li class="list-inline-item"><code class="notranslate">by</code></li>
  <li class="list-inline-item"><code class="notranslate">bzh</code></li>
  <li class="list-inline-item"><code class="notranslate">ca</code></li>
  <li class="list-inline-item"><code class="notranslate">cat</code></li>
  <li class="list-inline-item"><code class="notranslate">cc</code></li>
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
  <li class="list-inline-item"><code class="notranslate">family</code></li>
  <li class="list-inline-item"><code class="notranslate">fi</code></li>
  <li class="list-inline-item"><code class="notranslate">fm</code></li>
  <li class="list-inline-item"><code class="notranslate">fo</code></li>
  <li class="list-inline-item"><code class="notranslate">fr</code></li>
  <li class="list-inline-item"><code class="notranslate">gf</code></li>
  <li class="list-inline-item"><code class="notranslate">gg</code></li>
  <li class="list-inline-item"><code class="notranslate">gi</code></li>
  <li class="list-inline-item"><code class="notranslate">gl</code></li>
  <li class="list-inline-item"><code class="notranslate">gp</code></li>
  <li class="list-inline-item"><code class="notranslate">gr</code></li>
  <li class="list-inline-item"><code class="notranslate">hr</code></li>
  <li class="list-inline-item"><code class="notranslate">hu</code></li>
  <li class="list-inline-item"><code class="notranslate">id</code></li>
  <li class="list-inline-item"><code class="notranslate">ie</code></li>
  <li class="list-inline-item"><code class="notranslate">il</code></li>
  <li class="list-inline-item"><code class="notranslate">im</code></li>
  <li class="list-inline-item"><code class="notranslate">in</code></li>
  <li class="list-inline-item"><code class="notranslate">io</code></li>
  <li class="list-inline-item"><code class="notranslate">ir</code></li>
  <li class="list-inline-item"><code class="notranslate">is</code></li>
  <li class="list-inline-item"><code class="notranslate">it</code></li>
  <li class="list-inline-item"><code class="notranslate">je</code></li>
  <li class="list-inline-item"><code class="notranslate">jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ke</code></li>
  <li class="list-inline-item"><code class="notranslate">kr</code></li>
  <li class="list-inline-item"><code class="notranslate">la</code></li>
  <li class="list-inline-item"><code class="notranslate">li</code></li>
  <li class="list-inline-item"><code class="notranslate">lt</code></li>
  <li class="list-inline-item"><code class="notranslate">lu</code></li>
  <li class="list-inline-item"><code class="notranslate">lv</code></li>
  <li class="list-inline-item"><code class="notranslate">ly</code></li>
  <li class="list-inline-item"><code class="notranslate">mc</code></li>
  <li class="list-inline-item"><code class="notranslate">md</code></li>
  <li class="list-inline-item"><code class="notranslate">me</code></li>
  <li class="list-inline-item"><code class="notranslate">mk</code></li>
  <li class="list-inline-item"><code class="notranslate">mn</code></li>
  <li class="list-inline-item"><code class="notranslate">mq</code></li>
  <li class="list-inline-item"><code class="notranslate">ms</code></li>
  <li class="list-inline-item"><code class="notranslate">mt</code></li>
  <li class="list-inline-item"><code class="notranslate">mu</code></li>
  <li class="list-inline-item"><code class="notranslate">mx</code></li>
  <li class="list-inline-item"><code class="notranslate">nc</code></li>
  <li class="list-inline-item"><code class="notranslate">net</code></li>
  <li class="list-inline-item"><code class="notranslate">ni</code></li>
  <li class="list-inline-item"><code class="notranslate">nl</code></li>
  <li class="list-inline-item"><code class="notranslate">no</code></li>
  <li class="list-inline-item"><code class="notranslate">nu</code></li>
  <li class="list-inline-item"><code class="notranslate">nz</code></li>
  <li class="list-inline-item"><code class="notranslate">org</code></li>
  <li class="list-inline-item"><code class="notranslate">pf</code></li>
  <li class="list-inline-item"><code class="notranslate">pl</code></li>
  <li class="list-inline-item"><code class="notranslate">pm</code></li>
  <li class="list-inline-item"><code class="notranslate">pr</code></li>
  <li class="list-inline-item"><code class="notranslate">pt</code></li>
  <li class="list-inline-item"><code class="notranslate">pw</code></li>
  <li class="list-inline-item"><code class="notranslate">re</code></li>
  <li class="list-inline-item"><code class="notranslate">ro</code></li>
  <li class="list-inline-item"><code class="notranslate">rs</code></li>
  <li class="list-inline-item"><code class="notranslate">sc</code></li>
  <li class="list-inline-item"><code class="notranslate">se</code></li>
  <li class="list-inline-item"><code class="notranslate">sh</code></li>
  <li class="list-inline-item"><code class="notranslate">si</code></li>
  <li class="list-inline-item"><code class="notranslate">sk</code></li>
  <li class="list-inline-item"><code class="notranslate">sm</code></li>
  <li class="list-inline-item"><code class="notranslate">sr</code></li>
  <li class="list-inline-item"><code class="notranslate">st</code></li>
  <li class="list-inline-item"><code class="notranslate">tc</code></li>
  <li class="list-inline-item"><code class="notranslate">tf</code></li>
  <li class="list-inline-item"><code class="notranslate">tm</code></li>
  <li class="list-inline-item"><code class="notranslate">to</code></li>
  <li class="list-inline-item"><code class="notranslate">tv</code></li>
  <li class="list-inline-item"><code class="notranslate">uk</code></li>
  <li class="list-inline-item"><code class="notranslate">us</code></li>
  <li class="list-inline-item"><code class="notranslate">uz</code></li>
  <li class="list-inline-item"><code class="notranslate">va</code></li>
  <li class="list-inline-item"><code class="notranslate">vc</code></li>
  <li class="list-inline-item"><code class="notranslate">vg</code></li>
  <li class="list-inline-item"><code class="notranslate">vu</code></li>
  <li class="list-inline-item"><code class="notranslate">wf</code></li>
  <li class="list-inline-item"><code class="notranslate">ws</code></li>
  <li class="list-inline-item"><code class="notranslate">xyz</code></li>
  <li class="list-inline-item"><code class="notranslate">yt</code></li>
  <li class="list-inline-item"><code class="notranslate">za</code></li>
</ul>
### 그레이리스트가 있나요? {#do-you-have-a-greylist}

네, 저희는 매우 느슨한 [이메일 그레이리스트](https://en.wikipedia.org/wiki/Greylisting_\(email\)) 정책을 사용하고 있습니다. 그레이리스트는 허용 목록에 없는 발신자에게만 적용되며, 캐시에 30일 동안 유지됩니다.

새로운 발신자에 대해서는 Redis 데이터베이스에 30일 동안 키를 저장하며, 값은 첫 요청의 초기 도착 시간으로 설정됩니다. 이후 이메일을 450 재시도 상태 코드로 거부하고 5분이 경과한 후에만 통과를 허용합니다.

초기 도착 시간으로부터 5분을 성공적으로 기다린 경우, 해당 발신자의 이메일은 수락되며 450 상태 코드를 받지 않습니다.

키는 FQDN 루트 도메인 또는 발신자의 IP 주소로 구성됩니다. 이는 하위 도메인이 그레이리스트를 통과하면 루트 도메인도 통과하며, 그 반대도 마찬가지임을 의미합니다(이것이 "매우 느슨한" 정책이라는 의미입니다).

예를 들어, `test.example.com`에서 이메일이 먼저 도착하고 `example.com`에서 이메일이 도착하기 전이라면, `test.example.com` 및/또는 `example.com`에서 오는 모든 이메일은 연결의 초기 도착 시간으로부터 5분을 기다려야 합니다. `test.example.com`과 `example.com` 각각이 별도의 5분 대기 시간을 갖지 않습니다(그레이리스트 정책은 루트 도메인 수준에서 적용됩니다).

그레이리스트는 저희 [허용 목록](#do-you-have-an-allowlist)에 있는 발신자(예: 이 문서 작성 시점의 Meta, Amazon, Netflix, Google, Microsoft)에는 적용되지 않습니다.

### 거부 목록이 있나요? {#do-you-have-a-denylist}

네, 저희는 자체 거부 목록을 운영하며, 스팸 및 악성 활동이 감지될 때 실시간으로 자동 업데이트하고 수동으로도 갱신합니다.

또한 매시간 <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz>에서 UCEPROTECT 레벨 1 거부 목록의 모든 IP 주소를 가져와 7일 만료 기간으로 저희 거부 목록에 추가합니다.

거부 목록에 있는 발신자는 [허용 목록에 없을 경우](#do-you-have-an-allowlist) 421 오류 코드(발신자에게 나중에 다시 시도하라는 의미)를 받게 됩니다.

554 상태 코드 대신 421 상태 코드를 사용함으로써 잠재적인 오탐을 실시간으로 완화할 수 있으며, 다음 시도에서 메시지가 성공적으로 전달될 수 있습니다.

**이는 다른 메일 서비스와 다르게 설계된 것입니다.** 블랙리스트에 오르면 영구적이고 강력한 실패가 발생하는 대신, 발신자에게 메시지 재시도를 요청하는 것이 어려운 경우가 많기 때문에(특히 대규모 조직의 경우), 이 방식은 초기 이메일 시도 후 약 5일 동안 발신자, 수신자 또는 저희가 개입하여 문제를 해결할 수 있도록 합니다(거부 목록 제거 요청을 통해).

모든 거부 목록 제거 요청은 관리자에 의해 실시간으로 모니터링됩니다(예: 반복되는 오탐은 관리자가 영구 허용 목록에 추가할 수 있도록).

거부 목록 제거 요청은 <https://forwardemail.net/denylist>에서 할 수 있습니다. 유료 사용자는 거부 목록 제거 요청이 즉시 처리되며, 비유료 사용자는 관리자의 처리를 기다려야 합니다.

스팸 또는 바이러스 콘텐츠를 보내는 것으로 감지된 발신자는 다음 절차에 따라 거부 목록에 추가됩니다:

1. [초기 메시지 지문](#how-do-you-determine-an-email-fingerprint)은 "신뢰된" 발신자(예: `gmail.com`, `microsoft.com`, `apple.com`)로부터 스팸 또는 블랙리스트가 감지되면 그레이리스트 처리됩니다.
   * 발신자가 허용 목록에 있으면 메시지는 1시간 동안 그레이리스트 처리됩니다.
   * 발신자가 허용 목록에 없으면 메시지는 6시간 동안 그레이리스트 처리됩니다.
2. 발신자 및 메시지 정보에서 거부 목록 키를 파싱하고, 각 키에 대해(존재하지 않으면) 카운터를 생성하여 1씩 증가시키고 24시간 동안 캐시합니다.
   * 허용 목록 발신자의 경우:
     * SPF가 통과했거나 SPF가 없고 [postmaster 사용자 이름](#what-are-postmaster-addresses) 또는 [no-reply 사용자 이름](#what-are-no-reply-addresses)이 아닌 경우, 봉투 "MAIL FROM" 이메일 주소에 대한 키를 추가합니다.
     * "From" 헤더가 허용 목록에 있으면, SPF가 통과했거나 DKIM이 통과 및 정렬된 경우 "From" 헤더 이메일 주소에 대한 키를 추가합니다.
     * "From" 헤더가 허용 목록에 없으면, "From" 헤더 이메일 주소와 그 루트 파싱 도메인 이름에 대한 키를 추가합니다.
   * 허용 목록에 없는 발신자의 경우:
     * SPF가 통과한 경우 봉투 "MAIL FROM" 이메일 주소에 대한 키를 추가합니다.
     * "From" 헤더가 허용 목록에 있으면, SPF가 통과했거나 DKIM이 통과 및 정렬된 경우 "From" 헤더 이메일 주소에 대한 키를 추가합니다.
     * "From" 헤더가 허용 목록에 없으면, "From" 헤더 이메일 주소와 그 루트 파싱 도메인 이름에 대한 키를 추가합니다.
     * 발신자의 원격 IP 주소에 대한 키를 추가합니다.
     * 발신자의 IP 주소로부터 역방향 조회된 클라이언트 호스트 이름에 대한 키를 추가합니다(있는 경우).
     * 클라이언트 호스트 이름의 루트 도메인에 대한 키를 추가합니다(있는 경우 및 클라이언트 호스트 이름과 다를 경우).
3. 허용 목록에 없는 발신자 및 키에 대해 카운터가 5에 도달하면 해당 키를 30일 동안 거부 목록에 추가하고, 저희 남용 팀에 이메일이 발송됩니다. 이 숫자는 변경될 수 있으며, 모니터링하면서 여기에 업데이트됩니다.
4. 허용 목록 발신자 및 키에 대해 카운터가 10에 도달하면 해당 키를 7일 동안 거부 목록에 추가하고, 저희 남용 팀에 이메일이 발송됩니다. 이 숫자도 변경될 수 있으며, 모니터링하면서 여기에 업데이트됩니다.
> **참고:** 가까운 미래에 평판 모니터링을 도입할 예정입니다. 평판 모니터링은 위에서 언급한 원시 카운터 대신 백분율 임계값을 기반으로 발신자를 거부 목록에 올릴 시기를 계산합니다.

### 속도 제한이 있나요 {#do-you-have-rate-limiting}

발신자 속도 제한은 발신자 IP 주소에 대한 역 PTR 조회에서 파싱된 루트 도메인별로 적용되거나, 결과가 없으면 단순히 발신자 IP 주소를 사용합니다. 아래에서는 이를 `발신자`라고 합니다.

우리 MX 서버는 [암호화된 IMAP 저장](/blog/docs/best-quantum-safe-encrypted-email-service)을 위해 수신된 메일에 대해 일일 제한을 둡니다:

* 개별 별칭(예: `you@yourdomain.com`) 기준으로 수신 메일을 속도 제한하는 대신, 별칭의 도메인 이름 자체(예: `yourdomain.com`)로 속도 제한을 합니다. 이는 `발신자`가 도메인 내 모든 별칭의 받은편지함을 한꺼번에 폭주시키는 것을 방지합니다.
* 수신자와 관계없이 서비스 전반에 적용되는 일반 제한이 있습니다:
  * 진실된 출처로 간주되는 "신뢰된" `발신자`(예: `gmail.com`, `microsoft.com`, `apple.com`)는 하루에 100GB 전송으로 제한됩니다.
  * [허용 목록](#do-you-have-an-allowlist)에 있는 `발신자`는 하루에 10GB 전송으로 제한됩니다.
  * 기타 모든 `발신자`는 하루에 1GB 및/또는 1000 메시지로 제한됩니다.
* `발신자`와 `yourdomain.com`별로 하루에 1GB 및/또는 1000 메시지의 구체적인 제한이 있습니다.

MX 서버는 또한 [허용 목록](#do-you-have-an-allowlist)에 없는 `발신자`에 대해 한 명 이상의 수신자에게 전달되는 메시지에 대해 속도 제한을 적용합니다:

* 시간당 최대 100 연결만 허용하며, 이는 `발신자`의 FQDN 루트 도메인(또는 역 PTR이 없으면) 원격 IP 주소별, 그리고 봉투 수신자별로 적용됩니다. 속도 제한 키는 Redis 데이터베이스에 암호화 해시로 저장됩니다.

* 시스템을 통해 이메일을 보내는 경우 모든 IP 주소에 대해 역 PTR이 설정되어 있는지 확인하세요(설정되지 않으면 보내는 각 고유 FQDN 루트 도메인 또는 IP 주소별로 속도 제한이 적용됩니다).

* Amazon SES와 같은 인기 시스템을 통해 보내는 경우, (작성 시점 기준) Amazon SES가 허용 목록에 포함되어 있어 속도 제한이 적용되지 않습니다.

* `test.abc.123.example.com`과 같은 도메인에서 보내는 경우, 속도 제한은 `example.com`에 적용됩니다. 많은 스패머가 고유 FQDN 루트 도메인 대신 고유 호스트 이름만 속도 제한하는 일반 스팸 필터를 우회하기 위해 수백 개의 하위 도메인을 사용합니다.

* 속도 제한을 초과하는 `발신자`는 421 오류로 거부됩니다.

우리 IMAP 및 SMTP 서버는 별칭이 동시에 `60`개 이상의 연결을 갖지 못하도록 제한합니다.

우리 MX 서버는 [허용 목록에 없는](#do-you-have-an-allowlist) 발신자가 10개 이상의 동시 연결을 설정하지 못하도록 제한하며, 카운터는 3분 캐시 만료(소켓 타임아웃 3분과 동일)를 가집니다.

### 백스캐터를 어떻게 방지하나요 {#how-do-you-protect-against-backscatter}

잘못 전달된 반송 메일 또는 반송 스팸(일명 "[Backscatter](https://en.wikipedia.org/wiki/Backscatter_\(email\))")은 발신자 IP 주소의 평판에 부정적인 영향을 줄 수 있습니다.

우리는 다음 섹션 [알려진 MAIL FROM 스패머로부터 반송 방지](#prevent-bounces-from-known-mail-from-spammers) 및 [백스캐터 방지를 위한 불필요한 반송 방지](#prevent-unnecessary-bounces-to-protect-against-backscatter)에서 자세히 설명하는 두 가지 조치를 취합니다.

### 알려진 MAIL FROM 스패머로부터 반송 방지 {#prevent-bounces-from-known-mail-from-spammers}

우리는 [Backscatter.org](https://www.backscatterer.org/) (powered by [UCEPROTECT](https://www.uceprotect.net/))에서 매시간 <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> 목록을 가져와 Redis 데이터베이스에 입력합니다(또한 사전에 차이를 비교하여 존중해야 할 IP가 제거되었는지 확인합니다).
MAIL FROM가 비어 있거나 (대소문자 구분 없이) [postmaster 주소들](#what-are-postmaster-addresses) 중 하나와 같으면 (이메일에서 @ 앞부분), 발신자 IP가 이 목록에 있는지 확인합니다.

발신자 IP가 목록에 있고 (우리의 [허용 목록](#do-you-have-an-allowlist)에 없으면), `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}` 메시지와 함께 554 오류를 보냅니다. 발신자가 Backscatterer 목록과 허용 목록 모두에 있을 경우 문제를 해결할 수 있도록 알림을 받습니다.

이 섹션에서 설명하는 기술은 <https://www.backscatterer.org/?target=usage>의 "SAFE MODE" 권고사항을 준수하며 – 특정 조건이 충족된 경우에만 발신자 IP를 확인합니다.

### 백스캐터 방지를 위한 불필요한 반송 방지 {#prevent-unnecessary-bounces-to-protect-against-backscatter}

반송은 이메일 전달이 수신자에게 완전히 실패했음을 나타내며 이메일이 재시도되지 않는 경우입니다.

Backscatterer 목록에 오르는 일반적인 이유는 잘못된 반송 또는 반송 스팸이므로, 다음과 같은 방법으로 이를 방지해야 합니다:

1. 500 이상 상태 코드 오류가 발생한 경우에만 전송합니다 (예: 이메일 전달 시도가 실패하여 Gmail이 500 수준 오류를 응답할 때).

2. 한 번만 전송합니다 (중복 전송 방지를 위해 계산된 반송 지문 키를 캐시에 저장). 반송 지문은 메시지 지문과 반송 주소 및 오류 코드의 해시를 결합한 키입니다. 메시지 지문 계산 방법에 대한 자세한 내용은 [Fingerprinting](#how-do-you-determine-an-email-fingerprint) 섹션을 참조하세요. 성공적으로 전송된 반송 지문은 Redis 캐시에서 7일 후 만료됩니다.

3. MAIL FROM 및/또는 From이 비어 있지 않고 (대소문자 구분 없이) [postmaster 사용자 이름](#what-are-postmaster-addresses)을 포함하지 않을 때만 전송합니다.

4. 원본 메시지에 다음 헤더가 있으면 전송하지 않습니다 (대소문자 구분 없음):

   * 값이 `no`가 아닌 `auto-submitted` 헤더
   * 값이 `dr`, `autoreply`, `auto-reply`, `auto_reply`, 또는 `all`인 `x-auto-response-suppress` 헤더
   * 값과 상관없이 `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond`, 또는 `x-auto-respond` 헤더
   * 값이 `bulk`, `autoreply`, `auto-reply`, `auto_reply`, 또는 `list`인 `precedence` 헤더

5. MAIL FROM 또는 From 이메일 주소가 `+donotreply`, `-donotreply`, `+noreply`, 또는 `-noreply`로 끝나면 전송하지 않습니다.

6. From 이메일 주소의 사용자 이름 부분이 `mdaemon`이고 대소문자 구분 없이 `X-MDDSN-Message` 헤더가 있으면 전송하지 않습니다.

7. 대소문자 구분 없이 `content-type` 헤더가 `multipart/report`인 경우 전송하지 않습니다.

### 이메일 지문은 어떻게 결정합니까? {#how-do-you-determine-an-email-fingerprint}

이메일 지문은 이메일의 고유성을 판단하고 중복 메시지 전달 및 [중복 반송](#prevent-unnecessary-bounces-to-protect-against-backscatter) 전송을 방지하는 데 사용됩니다.

지문은 다음 목록에서 계산됩니다:

* 클라이언트가 확인한 FQDN 호스트명 또는 IP 주소
* `Message-ID` 헤더 값 (있을 경우)
* `Date` 헤더 값 (있을 경우)
* `From` 헤더 값 (있을 경우)
* `To` 헤더 값 (있을 경우)
* `Cc` 헤더 값 (있을 경우)
* `Subject` 헤더 값 (있을 경우)
* `Body` 값 (있을 경우)

### 25번 포트 이외의 포트로 이메일을 전달할 수 있나요? (예: ISP가 25번 포트를 차단한 경우) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

네, 2020년 5월 5일부터 이 기능이 추가되었습니다. 현재 이 기능은 별칭별이 아닌 도메인별로 적용됩니다. 별칭별 적용이 필요하시면 저희에게 연락하여 필요 사항을 알려주세요.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    강화된 개인정보 보호:
  </strong>
  <span>
    유료 플랜(강화된 개인정보 보호 기능 포함)을 사용 중이시면 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">내 계정 <i class="fa fa-angle-right"></i> 도메인</a>으로 이동하여 도메인 옆의 "설정"을 클릭한 후 "환경 설정"을 클릭하세요. 유료 플랜에 대해 더 알고 싶으시면 <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">가격</a> 페이지를 참조하세요. 그렇지 않으면 아래 지침을 계속 따라주세요.
  </span>
</div>
무료 플랜을 사용 중이라면, 아래와 같이 새 DNS <strong class="notranslate">TXT</strong> 레코드를 추가하되, 포트를 25에서 원하는 포트로 변경하면 됩니다.

예를 들어, `example.com`으로 가는 모든 이메일을 25번 대신 별도의 SMTP 포트 1337로 별칭 수신자에게 전달하고 싶다면:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>이름/호스트/별칭</th>
      <th class="text-center">TTL</th>
      <th>유형</th>
      <th>응답/값</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", 또는 빈칸</em></td>
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
    커스텀 포트 포워딩 설정에서 가장 흔한 시나리오는 example.com으로 가는 모든 이메일을 SMTP 표준 포트 25가 아닌 example.com의 다른 포트로 전달하고 싶을 때입니다. 이를 설정하려면, 다음과 같은 <strong class="notranslate">TXT</strong> 캐치올 레코드를 추가하면 됩니다.
  <span>
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>이름/호스트/별칭</th>
      <th class="text-center">TTL</th>
      <th>유형</th>
      <th>응답/값</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", 또는 빈칸</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=example.com</code></td>
    </tr>
  </tbody>
</table>

### Gmail 별칭에 대해 플러스 + 기호를 지원하나요? {#does-it-support-the-plus--symbol-for-gmail-aliases}

네, 물론입니다.

### 서브도메인을 지원하나요? {#does-it-support-sub-domains}

네, 물론입니다. 이름/호스트/별칭으로 "@", ".", 또는 빈칸 대신 서브도메인 이름을 값으로 사용하면 됩니다.

예를 들어 `foo.example.com`으로 이메일을 전달하려면 DNS 설정에서 이름/호스트/별칭 값으로 `foo`를 입력하세요 (MX 및 <strong class="notranslate">TXT</strong> 레코드 모두).

### 이메일 헤더도 전달되나요? {#does-this-forward-my-emails-headers}

네, 물론입니다.

### 충분히 테스트되었나요? {#is-this-well-tested}

네, [ava](https://github.com/avajs/ava)로 작성된 테스트와 코드 커버리지가 있습니다.

### SMTP 응답 메시지와 코드를 전달하나요? {#do-you-pass-along-smtp-response-messages-and-codes}

네, 물론입니다. 예를 들어 `hello@example.com`으로 이메일을 보내고 이 주소가 `user@gmail.com`으로 전달되도록 등록되어 있다면, "mx1.forwardemail.net" 또는 "mx2.forwardemail.net" 프록시 서버 대신 "gmail.com" SMTP 서버의 응답 메시지와 코드가 반환됩니다.

### 스패머를 어떻게 차단하고 좋은 이메일 전달 평판을 유지하나요? {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

위의 [이메일 전달 시스템은 어떻게 작동하나요](#how-does-your-email-forwarding-system-work), [이메일 전달 문제는 어떻게 처리하나요](#how-do-you-handle-email-delivery-issues), [IP 주소가 차단되면 어떻게 하나요](#how-do-you-handle-your-ip-addresses-becoming-blocked) 섹션을 참고하세요.

### 도메인 이름에 대해 DNS 조회는 어떻게 수행하나요? {#how-do-you-perform-dns-lookups-on-domain-names}

우리는 오픈 소스 소프트웨어 프로젝트 :tangerine: [Tangerine](https://github.com/forwardemail/tangerine)을 만들어 DNS 조회에 사용합니다. 기본 DNS 서버는 `1.1.1.1`과 `1.0.0.1`이며, DNS 쿼리는 애플리케이션 계층에서 [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH")를 통해 수행됩니다.

:tangerine: [Tangerine](https://github.com/tangerine)은 기본적으로 [CloudFlare의 개인정보 보호 우선 소비자 DNS 서비스][cloudflare-dns]를 사용합니다.


## 계정 및 결제 {#account-and-billing}

### 유료 플랜에 환불 보증이 있나요? {#do-you-offer-a-money-back-guarantee-on-paid-plans}

네! 플랜 시작일로부터 30일 이내에 업그레이드, 다운그레이드 또는 계정 취소 시 자동 환불이 이루어집니다. 이는 첫 구매 고객에 한해 적용됩니다.
### 플랜을 변경하면 차액을 비례 계산하여 환불해 주나요? {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

플랜을 변경할 때 차액을 비례 계산하거나 환불하지 않습니다. 대신 기존 플랜의 만료일로부터 남은 기간을 새 플랜에 가장 근접한 기간(월 단위로 내림)으로 변환합니다.

유료 플랜을 처음 시작한 후 30일 이내에 업그레이드 또는 다운그레이드하는 경우 기존 플랜의 금액을 전액 자동 환불해 드립니다.

### 이 이메일 전달 서비스를 "대체" 또는 "백업" MX 서버로만 사용할 수 있나요? {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

아니요, 권장하지 않습니다. 한 번에 하나의 메일 교환 서버만 사용할 수 있기 때문입니다. 백업 서버는 우선순위 설정 오류와 메일 서버가 MX 우선순위 확인을 준수하지 않아 일반적으로 재시도되지 않습니다.

### 특정 별칭을 비활성화할 수 있나요? {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    중요:
  </strong>
  <span>
    유료 플랜을 사용 중이라면 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">내 계정 <i class="fa fa-angle-right"></i> 도메인</a> <i class="fa fa-angle-right"></i> 별칭 <i class="fa fa-angle-right"></i> 별칭 편집 <i class="fa fa-angle-right"></i> "활성" 체크박스 선택 해제 <i class="fa fa-angle-right"></i> 계속 진행해야 합니다.
  </span>
</div>

네, DNS <strong class="notranslate">TXT</strong> 레코드를 편집하고 별칭 앞에 느낌표 한 개, 두 개 또는 세 개를 붙이면 됩니다(아래 참조).

":" 매핑은 유지하는 것이 좋습니다. 이는 나중에 이 기능을 끄거나 유료 플랜으로 업그레이드할 때 가져오기용으로 필요합니다.

**조용한 거부(발신자에게는 메시지가 성공적으로 전송된 것처럼 보이나 실제로는 어디에도 전달되지 않음) (상태 코드 `250`):** 별칭 앞에 "!"(느낌표 한 개)를 붙이면 이 주소로 보내는 발신자에게 성공 상태 코드 `250`을 반환하지만 이메일은 어디에도 전달되지 않습니다(예: 블랙홀 또는 `/dev/null`).

**소프트 거부(상태 코드 `421`):** 별칭 앞에 "!!"(느낌표 두 개)를 붙이면 이 주소로 보내는 발신자에게 소프트 오류 상태 코드 `421`을 반환하며, 이메일은 최대 5일 동안 재시도된 후 거부되고 반송됩니다.

**하드 거부(상태 코드 `550`):** 별칭 앞에 "!!!"(느낌표 세 개)를 붙이면 이 주소로 보내는 발신자에게 영구 오류 상태 코드 `550`을 반환하며, 이메일은 거부되고 반송됩니다.

예를 들어, `alias@example.com`으로 가는 모든 이메일이 `user@gmail.com`으로 전달되지 않고 거부 및 반송되도록 하려면(느낌표 세 개 사용):

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>이름/호스트/별칭</th>
      <th class="text-center">TTL</th>
      <th>유형</th>
      <th>응답/값</th>
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
    전달 대상 주소를 단순히 "nobody@forwardemail.net"으로 재작성하여 아래 예시처럼 아무도 받지 않도록 라우팅할 수도 있습니다.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>이름/호스트/별칭</th>
      <th class="text-center">TTL</th>
      <th>유형</th>
      <th>응답/값</th>
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
    보안을 강화하고 싶다면, 아래 예시처럼 ":user@gmail.com" (또는 ":nobody@forwardemail.net") 부분을 제거하고 "!!!alias"만 남길 수도 있습니다.
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
      <td><em>"@", ".", 또는 빈칸</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias</code></td>
    </tr>
  </tbody>
</table>

### 여러 수신자에게 이메일을 전달할 수 있나요? {#can-i-forward-emails-to-multiple-recipients}

네, 물론입니다. <strong class="notranslate">TXT</strong> 레코드에 여러 수신자를 지정하면 됩니다.

예를 들어, `hello@example.com`으로 오는 이메일을 `user+a@gmail.com`과 `user+b@gmail.com`으로 전달하고 싶다면, <strong class="notranslate">TXT</strong> 레코드는 다음과 같이 설정합니다:

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
      <td><em>"@", ".", 또는 빈칸</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

또는, 다음과 같이 두 줄로 나누어 지정할 수도 있습니다:

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
      <td><em>"@", ".", 또는 빈칸</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", 또는 빈칸</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

선택은 여러분에게 달려 있습니다!

### 여러 글로벌 캐치올 수신자를 가질 수 있나요? {#can-i-have-multiple-global-catch-all-recipients}

네, 가능합니다. <strong class="notranslate">TXT</strong> 레코드에 여러 글로벌 캐치올 수신자를 지정하면 됩니다.

예를 들어, `*@example.com` (별표는 와일드카드, 즉 캐치올을 의미)으로 오는 모든 이메일을 `user+a@gmail.com`과 `user+b@gmail.com`으로 전달하고 싶다면, <strong class="notranslate">TXT</strong> 레코드는 다음과 같이 설정합니다:

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
      <td><em>"@", ".", 또는 빈칸</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

또는, 다음과 같이 두 줄로 나누어 지정할 수도 있습니다:

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
      <td><em>"@", ".", 또는 빈칸</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>@, ".", 또는 빈칸</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>
당신에게 달려 있습니다!

### 별칭당 전달할 수 있는 이메일 주소 수에 최대 한도가 있나요? {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

네, 기본 한도는 10개입니다. 이것은 도메인 이름에 별칭을 10개만 가질 수 있다는 의미가 아닙니다. 원하는 만큼 많은 별칭을 가질 수 있습니다(무제한). 이는 하나의 별칭이 10개의 고유 이메일 주소로만 전달될 수 있다는 뜻입니다. 예를 들어 `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (1~10까지) 가 있을 수 있으며, `hello@example.com`으로 오는 모든 이메일은 `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (1~10까지) 으로 전달됩니다.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    팁:
  </strong>
  <span>
    별칭당 10명 이상의 수신자가 필요하신가요? 저희에게 이메일을 보내주시면 계정 한도를 늘려드리겠습니다.
  </span>
</div>

### 이메일을 재귀적으로 전달할 수 있나요? {#can-i-recursively-forward-emails}

네, 가능합니다. 다만 최대 한도는 반드시 준수해야 합니다. 예를 들어 `hello:linus@example.com` 과 `linus:user@gmail.com` 이 있다면, `hello@example.com` 으로 오는 이메일은 `linus@example.com` 과 `user@gmail.com` 으로 전달됩니다. 최대 한도를 초과하여 재귀적으로 이메일을 전달하려고 하면 오류가 발생합니다.

### 내 허락 없이 누군가 내 이메일 전달을 등록하거나 해제할 수 있나요? {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

저희는 MX 및 <strong class="notranslate">TXT</strong> 레코드 검증을 사용합니다. 따라서 이 서비스의 해당 MX 및 <strong class="notranslate">TXT</strong> 레코드를 추가하면 등록된 것이고, 제거하면 등록 해제된 것입니다. 도메인과 DNS 관리는 본인이 소유하고 있으므로, 누군가가 그에 접근할 수 있다면 문제가 될 수 있습니다.

### 어떻게 무료인가요? {#how-is-it-free}

Forward Email은 오픈 소스 개발, 효율적인 인프라, 그리고 선택적 유료 플랜의 조합을 통해 무료 서비스를 제공합니다.

저희 무료 플랜은 다음에 의해 지원됩니다:

1. **오픈 소스 개발**: 저희 코드베이스는 오픈 소스로, 커뮤니티 기여와 투명한 운영이 가능합니다.

2. **효율적인 인프라**: 최소한의 자원으로 이메일 전달을 처리하도록 시스템을 최적화했습니다.

3. **유료 프리미엄 플랜**: SMTP 발송, IMAP 수신, 향상된 개인정보 보호 옵션 등 추가 기능이 필요한 사용자는 유료 플랜을 구독합니다.

4. **합리적인 사용 한도**: 무료 플랜은 남용을 방지하기 위한 공정한 사용 정책을 가지고 있습니다.

> \[!NOTE]
> 기본 이메일 전달은 무료로 유지하면서, 고급 기능은 더 많은 필요가 있는 사용자에게 프리미엄으로 제공합니다.

> \[!TIP]
> 저희 서비스를 가치 있게 느끼신다면, 지속적인 개발과 유지 관리를 지원하기 위해 유료 플랜으로 업그레이드하는 것을 고려해 주세요.

### 최대 이메일 크기 제한은 얼마인가요? {#what-is-the-max-email-size-limit}

기본적으로 50MB 크기 제한을 적용하며, 여기에는 콘텐츠, 헤더, 첨부파일이 포함됩니다. Gmail과 Outlook 같은 서비스는 25MB 크기 제한만 허용하므로, 해당 제공자 주소로 보낼 때 이 한도를 초과하면 오류 메시지가 표시됩니다.

파일 크기 제한을 초과하면 적절한 응답 코드와 함께 오류가 반환됩니다.

### 이메일 로그를 저장하나요? {#do-you-store-logs-of-emails}

아니요, 디스크에 기록하거나 로그를 저장하지 않습니다 – [오류 로그](#do-you-store-error-logs)와 [발신 SMTP](#do-you-support-sending-email-with-smtp) (자세한 내용은 [개인정보 처리방침](/privacy) 참조)를 제외하고는요.

모든 처리는 메모리 내에서 이루어지며, [저희 소스 코드는 GitHub에 공개되어 있습니다](https://github.com/forwardemail).

### 오류 로그를 저장하나요? {#do-you-store-error-logs}

**네. 오류 로그는 [내 계정 → 로그](/my-account/logs) 또는 [내 계정 → 도메인](/my-account/domains)에서 확인할 수 있습니다.**

2023년 2월 기준으로, `4xx` 및 `5xx` SMTP 응답 코드에 대한 오류 로그를 7일간 저장하며, 여기에는 SMTP 오류, 봉투, 이메일 헤더가 포함됩니다 (이메일 본문과 첨부파일은 저장하지 않습니다).
오류 로그를 통해 [귀하의 도메인](/my-account/domains)에 대한 중요한 이메일 누락 여부를 확인하고 스팸 오탐지를 완화할 수 있습니다. 또한 오류 로그에는 웹훅 엔드포인트 응답이 포함되어 있어 [이메일 웹훅](#do-you-support-webhooks) 문제를 디버깅하는 데도 훌륭한 자료입니다.

[속도 제한](#do-you-have-rate-limiting) 및 [그레이리스트](#do-you-have-a-greylist) 관련 오류 로그는 연결이 조기에 종료되기 때문에 접근할 수 없습니다(예: `RCPT TO` 및 `MAIL FROM` 명령이 전송되기 전에).

자세한 내용은 [개인정보 처리방침](/privacy)을 참조하세요.

### 내 이메일을 읽나요 {#do-you-read-my-emails}

아니요, 절대 아닙니다. [개인정보 처리방침](/privacy)을 참조하세요.

다른 많은 이메일 전달 서비스는 이메일을 저장하고 잠재적으로 읽을 수 있습니다. 전달된 이메일을 디스크 저장소에 저장할 이유가 없으며, 따라서 우리는 모든 처리를 메모리 내에서 수행하는 최초의 오픈 소스 솔루션을 설계했습니다.

우리는 사용자가 프라이버시 권리를 가져야 한다고 믿으며 이를 엄격히 존중합니다. 서버에 배포된 코드는 투명성과 신뢰 구축을 위해 [GitHub의 오픈 소스 소프트웨어](https://github.com/forwardemail)입니다.

### Gmail에서 "보내는 사람으로 메일 보내기" 기능을 사용할 수 있나요 {#can-i-send-mail-as-in-gmail-with-this}

네! 2018년 10월 2일부터 이 기능을 추가했습니다. 위의 [Gmail을 사용하여 보내는 사람으로 메일 보내기 방법](#how-to-send-mail-as-using-gmail)을 참조하세요!

또한 DNS 구성의 SPF <strong class="notranslate">TXT</strong> 레코드에 Gmail용 SPF 레코드를 설정해야 합니다.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    중요:
  </strong>
  <span>
    Gmail(예: 보내는 사람으로 메일 보내기) 또는 G Suite를 사용하는 경우 SPF <strong class="notranslate">TXT</strong> 레코드에 <code>include:_spf.google.com</code>을 추가해야 합니다. 예를 들어:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

### Outlook에서 "보내는 사람으로 메일 보내기" 기능을 사용할 수 있나요 {#can-i-send-mail-as-in-outlook-with-this}

네! 2018년 10월 2일부터 이 기능을 추가했습니다. 아래 Microsoft의 두 링크를 참조하세요:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

또한 DNS 구성의 SPF <strong class="notranslate">TXT</strong> 레코드에 Outlook용 SPF 레코드를 설정해야 합니다.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    중요:
  </strong>
  <span>
    Microsoft Outlook 또는 Live.com을 사용하는 경우 SPF <strong class="notranslate">TXT</strong> 레코드에 <code>include:spf.protection.outlook.com</code>을 추가해야 합니다. 예를 들어:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

### Apple Mail 및 iCloud Mail에서 "보내는 사람으로 메일 보내기" 기능을 사용할 수 있나요 {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

iCloud+ 구독자라면 커스텀 도메인을 사용할 수 있습니다. [우리 서비스는 Apple Mail과도 호환됩니다](#apple-mail).

자세한 내용은 <https://support.apple.com/en-us/102540>를 참조하세요.

### 무제한 이메일 전달이 가능한가요 {#can-i-forward-unlimited-emails-with-this}

네, 다만 "상대적으로 알려지지 않은" 발신자는 호스트명 또는 IP당 시간당 100회 연결로 속도 제한됩니다. 위의 [속도 제한](#do-you-have-rate-limiting) 및 [그레이리스트](#do-you-have-a-greylist) 섹션을 참조하세요.

"상대적으로 알려지지 않은"이란 [허용 목록](#do-you-have-an-allowlist)에 없는 발신자를 의미합니다.

이 제한을 초과하면 421 응답 코드를 보내 발신자의 메일 서버에 나중에 다시 시도하도록 알립니다.

### 한 가격으로 무제한 도메인을 제공하나요 {#do-you-offer-unlimited-domains-for-one-price}

네. 어떤 요금제를 사용하든 모든 도메인을 포함하는 월 요금은 하나만 지불하면 됩니다.
### 어떤 결제 수단을 받나요 {#which-payment-methods-do-you-accept}

Forward Email은 다음과 같은 일회성 또는 월간/분기별/연간 결제 수단을 받습니다:

1. **신용/직불 카드/은행 송금**: Visa, Mastercard, American Express, Discover, JCB, Diners Club 등
2. **PayPal**: 간편 결제를 위해 PayPal 계정을 연결하세요
3. **암호화폐**: Ethereum, Polygon, Solana 네트워크에서 Stripe의 스테이블코인 결제를 통해 결제 가능합니다

> \[!NOTE]
> 저희는 결제 식별자와 [Stripe](https://stripe.com/global) 및 [PayPal](https://www.paypal.com) 거래, 고객, 구독, 결제 ID에 대한 참조만 포함하는 제한된 결제 정보를 서버에 저장합니다.

> \[!TIP]
> 최대한의 프라이버시를 위해 암호화폐 결제를 고려해 보세요.

모든 결제는 Stripe 또는 PayPal을 통해 안전하게 처리됩니다. 결제 정보는 절대 저희 서버에 저장되지 않습니다.


## 추가 자료 {#additional-resources}

> \[!TIP]
> 아래의 저희 글들은 정기적으로 새로운 가이드, 팁, 기술 정보를 업데이트합니다. 최신 내용을 위해 자주 확인하세요.

* [사례 연구 및 개발자 문서](/blog/docs)
* [자료](/resources)
* [가이드](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/
