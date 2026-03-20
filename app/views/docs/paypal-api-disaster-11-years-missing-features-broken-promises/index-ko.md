# 페이팔의 11년간 API 재앙: 개발자를 무시하는 동안 우리가 우회 방법을 만든 이야기 {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

> \[!NOTE]
> **성공! 페이팔이 마침내 `GET /v1/billing/subscriptions` 엔드포인트를 추가했습니다.**
>
> 이 글을 게시하고 페이팔 경영진에게 이메일을 보낸 후, 그들의 팀은 구독 목록을 불러오는 꼭 필요한 엔드포인트를 구현했습니다. 이 변경은 [2025년 6월 25일](https://web.archive.org/web/20250625121019/https://developer.paypal.com/docs/api/subscriptions/v1/)과 [2025년 7월 9일](https://web.archive.org/web/20250709102200/https://developer.paypal.com/docs/api/subscriptions/v1/) 사이에 이루어졌습니다.
>
> 그러나 페이팔답게 우리에게는 전혀 알리지 않았습니다. 우리는 이 업데이트가 조용히 출시된 지 몇 달 후인 2025년 12월에야 스스로 발견했습니다.

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="PayPal API disaster illustration" class="rounded-lg" />

<p class="lead mt-3">Forward Email에서는 10년 넘게 페이팔의 망가진 API와 씨름해왔습니다. 사소한 불만에서 시작된 일이 완전한 재앙으로 변해, 자체 우회 방법을 만들고, 그들의 피싱 템플릿을 차단하며, 결국 중요한 계정 이전 기간 동안 모든 페이팔 결제를 중단해야 했습니다.</p>
<p class="lead mt-3">이것은 11년 동안 페이팔이 기본적인 개발자 요구를 무시하는 동안 우리가 그들의 플랫폼을 작동시키기 위해 모든 노력을 기울인 이야기입니다.</p>


## 목차 {#table-of-contents}

* [빠진 조각: 구독 목록을 불러올 방법이 없음](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017: 문제의 출현](#2014-2017-the-problem-emerges)
* [2020: 광범위한 피드백 제공](#2020-we-give-them-extensive-feedback)
  * [27개 항목 피드백 목록](#the-27-item-feedback-list)
  * [팀 개입, 약속이 이루어짐](#teams-got-involved-promises-were-made)
  * [결과는? 아무것도 없음.](#the-result-nothing)
* [경영진 대이동: 페이팔이 모든 조직 기억을 잃은 방법](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025: 새로운 리더십, 같은 문제](#2025-new-leadership-same-problems)
  * [새 CEO의 개입](#the-new-ceo-gets-involved)
  * [미셸 길의 답변](#michelle-gills-response)
  * [우리의 답변: 더 이상 미팅 없음](#our-response-no-more-meetings)
  * [마티 브로드벡의 과도한 엔지니어링 답변](#marty-brodbecks-overengineering-response)
  * [“간단한 CRUD” 모순](#the-simple-crud-contradiction)
  * [단절이 명확해지다](#the-disconnect-becomes-clear)
* [무시된 수년간의 버그 리포트](#years-of-bug-reports-they-ignored)
  * [2016: 초기 UI/UX 불만](#2016-early-uiux-complaints)
  * [2021: 비즈니스 이메일 버그 리포트](#2021-business-email-bug-report)
  * [2021: UI 개선 제안](#2021-ui-improvement-suggestions)
  * [2021: 샌드박스 환경 실패](#2021-sandbox-environment-failures)
  * [2021: 리포트 시스템 완전 고장](#2021-reports-system-completely-broken)
  * [2022: 핵심 API 기능 누락 (또 다시)](#2022-core-api-feature-missing-again)
* [개발자 경험 악몽](#the-developer-experience-nightmare)
  * [망가진 사용자 인터페이스](#broken-user-interface)
  * [SDK 문제](#sdk-problems)
  * [콘텐츠 보안 정책 위반](#content-security-policy-violations)
  * [문서 혼란](#documentation-chaos)
  * [보안 취약점](#security-vulnerabilities)
  * [세션 관리 재앙](#session-management-disaster)
* [2025년 7월: 마지막 한계](#july-2025-the-final-straw)
* [왜 페이팔을 그냥 포기할 수 없는가](#why-we-cant-just-drop-paypal)
* [커뮤니티 우회 방법](#the-community-workaround)
* [피싱 때문에 페이팔 템플릿 차단](#blocking-paypal-templates-due-to-phishing)
  * [진짜 문제: 페이팔 템플릿이 사기처럼 보임](#the-real-problem-paypals-templates-look-like-scams)
  * [우리의 구현](#our-implementation)
  * [왜 페이팔을 차단해야 했는가](#why-we-had-to-block-paypal)
  * [문제의 규모](#the-scale-of-the-problem)
  * [아이러니](#the-irony)
  * [실제 영향: 새로운 페이팔 사기](#real-world-impact-novel-paypal-scams)
* [페이팔의 역행하는 KYC 프로세스](#paypals-backwards-kyc-process)
  * [어떻게 작동해야 하는가](#how-it-should-work)
  * [페이팔이 실제로 작동하는 방식](#how-paypal-actually-works)
  * [실제 영향](#the-real-world-impact)
  * [2025년 7월 계정 이전 재앙](#the-july-2025-account-migration-disaster)
  * [왜 이것이 중요한가](#why-this-matters)
* [다른 모든 결제 처리기가 제대로 하는 방법](#how-every-other-payment-processor-does-it-right)
  * [스트라이프](#stripe)
  * [패들](#paddle)
  * [코인베이스 커머스](#coinbase-commerce)
  * [스퀘어](#square)
  * [업계 표준](#the-industry-standard)
  * [다른 처리기들이 제공하는 것 vs 페이팔](#what-other-processors-provide-vs-paypal)
* [페이팔의 조직적 은폐: 600만 목소리 침묵시키기](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [대규모 삭제](#the-great-erasure)
  * [서드파티 구출](#the-third-party-rescue)
* [11년간 캡처 버그 재앙: $1,899 그리고 계속](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [Forward Email의 $1,899 손실](#forward-emails-1899-loss)
  * [2013년 최초 보고: 11년 이상의 방치](#the-2013-original-report-11-years-of-negligence)
  * [2016년 인정: 페이팔이 자체 SDK를 망가뜨림](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [2024년 고조: 여전히 고장남](#the-2024-escalation-still-broken)
  * [웹훅 신뢰성 재앙](#the-webhook-reliability-disaster)
  * [조직적 방치의 패턴](#the-pattern-of-systematic-negligence)
  * [문서화되지 않은 요구사항](#the-undocumented-requirement)
* [페이팔의 더 넓은 사기 패턴](#paypals-broader-pattern-of-deception)
  * [뉴욕 금융 서비스국 조치](#the-new-york-department-of-financial-services-action)
  * [허니 소송: 제휴 링크 재작성](#the-honey-lawsuit-rewriting-affiliate-links)
  * [페이팔 방치의 비용](#the-cost-of-paypals-negligence)
  * [문서 거짓말](#the-documentation-lie)
* [개발자에게 의미하는 바](#what-this-means-for-developers)
## 빠진 조각: 구독 목록을 볼 방법이 없음 {#the-missing-piece-no-way-to-list-subscriptions}

이게 우리를 정말 놀라게 하는 점입니다: PayPal은 2014년부터 구독 결제를 지원해왔지만, 상인들이 자신의 구독 목록을 볼 수 있는 방법을 한 번도 제공하지 않았습니다.

잠깐 생각해보세요. 구독을 생성할 수 있고, ID가 있으면 취소도 할 수 있지만, 계정의 모든 활성 구독 목록을 가져올 수는 없습니다. 마치 SELECT 문이 없는 데이터베이스와 같습니다.

우리는 기본적인 비즈니스 운영을 위해 이것이 필요합니다:

* 고객 지원 (누군가 구독에 대해 문의할 때)
* 재무 보고 및 조정
* 자동 청구 관리
* 규정 준수 및 감사

하지만 PayPal은? 그냥... 절대 만들지 않았습니다.


## 2014-2017: 문제의 등장 {#2014-2017-the-problem-emerges}

구독 목록 문제는 2017년 PayPal 커뮤니티 포럼에서 처음 나타났습니다. 개발자들은 당연한 질문을 했습니다: "내 모든 구독 목록을 어떻게 얻나요?"

PayPal의 답변은? 침묵이었습니다.

커뮤니티 회원들은 점점 답답해졌습니다:

> "상인이 모든 활성 계약을 나열할 수 없다니 매우 이상한 누락입니다. 계약 ID를 잃어버리면 사용자만 계약을 취소하거나 중단할 수 있습니다." - leafspider

> "+1. 거의 3년이 지났습니다." - laudukang (문제가 \~2014년부터 존재했음을 의미)

2017년의 [원본 커뮤니티 게시물](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066)에서는 개발자들이 이 기본 기능을 간절히 요청하는 모습을 볼 수 있습니다. PayPal은 문제를 보고하던 저장소를 아카이브하는 것으로 대응했습니다.


## 2020: 광범위한 피드백 제공 {#2020-we-give-them-extensive-feedback}

2020년 10월, PayPal이 공식 피드백 세션을 위해 우리에게 연락했습니다. 단순한 대화가 아니라, Sri Shivananda(CTO), Edwin Aoki, Jim Magats, John Kunze 등 8명의 PayPal 임원이 참여한 45분짜리 Microsoft Teams 통화를 조직했습니다.

### 27개 항목 피드백 목록 {#the-27-item-feedback-list}

우리는 준비를 철저히 했습니다. 6시간 동안 API 통합을 시도한 후, 27개의 구체적인 문제를 정리했습니다. PayPal Checkout 팀의 Mark Stuart는 이렇게 말했습니다:

> 오늘 여러분과 공유해줘서 고마워요, Nick! 이 피드백이 우리 팀이 이 문제들을 해결하기 위해 더 많은 지원과 투자를 받는 촉매제가 될 것 같아요. 지금까지 받은 이런 풍부한 피드백은 얻기 어려웠습니다.

피드백은 이론적인 것이 아니라 실제 통합 시도에서 나온 것이었습니다:

1. **액세스 토큰 생성이 작동하지 않음**:

> 액세스 토큰 생성이 작동하지 않습니다. 또한 cURL 예제만 있는 것은 부족합니다.

2. **구독 생성용 웹 UI가 없음**:

> cURL을 사용하지 않고 구독을 어떻게 생성하나요? Stripe처럼 웹 UI가 없는 것 같습니다.

Mark Stuart는 액세스 토큰 문제를 특히 심각하게 여겼습니다:

> 액세스 토큰 생성 관련 문제는 보통 듣지 못합니다.

### 여러 팀이 참여하고 약속이 이루어짐 {#teams-got-involved-promises-were-made}

더 많은 문제를 발견하면서 PayPal은 대화에 더 많은 팀을 참여시켰습니다. 구독 관리 UI 팀의 Darshan Raju가 합류해 이렇게 말했습니다:

> 격차를 인정합니다. 추적하고 해결하겠습니다. 다시 한 번 피드백 감사합니다!

이 세션은 다음을 목표로 했다고 설명되었습니다:

> 여러분의 경험을 솔직하게 살펴보기 위해

그리고:

> 개발자를 위한 PayPal이 되어야 할 모습을 만들기 위해.

### 결과는? 아무것도 없음. {#the-result-nothing}

공식 피드백 세션, 27개 항목의 광범위한 목록, 여러 팀의 참여, 그리고

> 추적하고 해결하겠다

는 약속에도 불구하고, 전혀 고쳐진 것이 없습니다.


## 임원 대이동: PayPal이 모든 조직 기억을 잃은 방법 {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

여기서 정말 흥미로운 점이 나옵니다. 2020년 피드백을 받은 모든 사람이 PayPal을 떠났습니다:

**리더십 변화:**

* [Dan Schulman (9년간 CEO) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (2023년 9월)
* [Sri Shivananda (피드백을 조직한 CTO) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (2024년 1월)
**약속을 하고 떠난 기술 리더들:**

* **Mark Stuart** (피드백이 "촉매제"가 될 것이라고 약속) → [현재 Ripple 근무](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (18년 경력의 PayPal 베테랑) → [MX CEO](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (글로벌 소비자 제품 부사장) → [은퇴](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (남아있는 마지막 인물 중 한 명) → [최근 Nasdaq로 이직](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (2025년 1월)

PayPal은 임원들이 개발자 피드백을 수집하고 약속을 한 뒤, JPMorgan, Ripple 및 기타 핀테크 회사로 떠나는 순환문이 되었다.

이것이 2025년 GitHub 이슈 대응이 2020년 우리의 피드백과 완전히 단절된 것처럼 보였던 이유를 설명한다 - 그 피드백을 받은 모든 사람이 PayPal을 떠났기 때문이다.


## 2025년: 새로운 리더십, 같은 문제들 {#2025-new-leadership-same-problems}

2025년으로 빠르게 넘어가면, 똑같은 패턴이 나타난다. 수년간 진전이 없은 후, PayPal의 새로운 리더십이 다시 연락을 취한다.

### 새로운 CEO의 개입 {#the-new-ceo-gets-involved}

2025년 6월 30일, 우리는 PayPal의 새로운 CEO Alex Chriss에게 직접 문제를 제기했다. 그의 답변은 간단했다:

> 안녕하세요 Nick – 연락 주시고 피드백 주셔서 감사합니다. Michelle (참조됨)과 그녀의 팀이 이 문제를 함께 해결하기 위해 참여할 것입니다. 감사합니다 -A

### Michelle Gill의 답변 {#michelle-gills-response}

중소기업 및 금융 서비스 담당 EVP 겸 총괄 매니저 Michelle Gill이 답변했다:

> 매우 감사합니다 Nick, Alex를 숨은 참조로 이동합니다. 이전 게시물 이후로 이 문제를 조사해왔습니다. 이번 주가 끝나기 전에 전화 드리겠습니다. 제 동료 중 한 명이 연락할 수 있도록 연락처 정보를 보내주시겠어요? Michelle

### 우리의 답변: 더 이상 미팅은 없다 {#our-response-no-more-meetings}

우리는 또 다른 미팅을 거절하며 우리의 좌절감을 설명했다:

> 감사합니다. 하지만 전화 통화가 아무런 도움이 될 것 같지 않습니다. 이유는... 과거에 전화 통화를 했지만 전혀 진전이 없었습니다. 팀 전체와 리더십과 2시간 넘게 이야기했지만 아무것도 해결되지 않았습니다... 수많은 이메일이 오갔지만 전혀 해결되지 않았습니다. 피드백은 어디에도 반영되지 않았습니다. 수년간 노력했지만 듣기만 하고 결국 아무것도 변하지 않았습니다.

### Marty Brodbeck의 과도한 엔지니어링 답변 {#marty-brodbecks-overengineering-response}

그 후 PayPal의 소비자 엔지니어링 책임자인 Marty Brodbeck가 연락해왔다:

> 안녕하세요 Nick, 저는 Marty Brodbeck입니다. PayPal에서 모든 소비자 엔지니어링을 총괄하며 회사의 API 개발을 주도하고 있습니다. 직면한 문제와 우리가 어떻게 도울 수 있을지 논의할 수 있을까요?

우리가 구독 목록 엔드포인트가 필요하다고 간단히 설명했을 때, 그의 답변은 문제의 핵심을 드러냈다:

> 감사합니다 Nick, 우리는 완전한 SDK(전체 오류 처리, 이벤트 기반 구독 추적, 견고한 가동 시간 지원)를 갖춘 단일 구독 API를 만드는 중이며, 청구는 별도의 API로 분리하여 판매자가 여러 엔드포인트를 조율하지 않고도 단일 응답을 받을 수 있도록 할 예정입니다.

이것은 완전히 잘못된 접근법이다. 우리는 복잡한 아키텍처에 몇 달을 쓸 필요가 없다. 2014년부터 있어야 했던 단순한 REST 엔드포인트 하나, 구독 목록을 보여주는 것이 필요하다.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### "단순 CRUD" 모순 {#the-simple-crud-contradiction}

우리가 이것이 2014년부터 있어야 했던 기본 CRUD 기능이라고 지적했을 때, Marty의 답변은 의미심장했다:

> 단순 CRUD 작업은 핵심 API의 일부이므로 개발에 몇 달이 걸리지 않을 것입니다

현재 몇 달간 개발 후 세 개의 엔드포인트만 지원하는 PayPal TypeScript SDK와 그 역사적 타임라인은 이러한 프로젝트가 완료되기까지 몇 달 이상이 필요하다는 것을 명확히 보여준다.
이 응답은 그가 자신의 API를 이해하지 못한다는 것을 보여줍니다. 만약 "간단한 CRUD 작업이 핵심 API의 일부"라면, 구독 목록 엔드포인트는 어디에 있습니까? 우리는 이렇게 답변했습니다:

> 만약 '간단한 CRUD 작업이 핵심 API의 일부'라면 구독 목록 엔드포인트는 어디에 있습니까? 개발자들은 2014년부터 이 '간단한 CRUD 작업'을 요청해왔습니다. 벌써 11년이 지났습니다. 다른 모든 결제 처리업체는 처음부터 이 기본 기능을 제공해왔습니다.

### 단절이 명확해지다 {#the-disconnect-becomes-clear}

2025년에 있었던 Alex Chriss, Michelle Gill, Marty Brodbeck와의 교류는 동일한 조직적 기능 장애를 보여줍니다:

1. **새로운 리더십은 이전 피드백 세션에 대해 전혀 알지 못한다**
2. **그들은 동일한 과도하게 설계된 해결책을 제안한다**
3. **자신들의 API 한계를 이해하지 못한다**
4. **문제를 해결하기보다는 더 많은 회의를 원한다**

이 패턴은 2025년 PayPal 팀들이 2020년에 제공된 광범위한 피드백과 완전히 단절된 것처럼 보이는 이유를 설명합니다 - 그 피드백을 받았던 사람들이 떠났고, 새로운 리더십은 같은 실수를 반복하고 있습니다.


## 그들이 무시한 수년간의 버그 리포트 {#years-of-bug-reports-they-ignored}

우리는 단순히 기능이 없다고 불평만 한 것이 아닙니다. 적극적으로 버그를 보고하고 개선을 도우려 했습니다. 우리가 문서화한 문제들의 종합적인 타임라인은 다음과 같습니다:

### 2016년: 초기 UI/UX 불만 {#2016-early-uiux-complaints}

2016년에도 우리는 Dan Schulman을 포함한 PayPal 리더십에게 인터페이스 문제와 사용성 문제를 공개적으로 알리고 있었습니다. 9년 전이고, 동일한 UI/UX 문제가 오늘날에도 계속되고 있습니다.

### 2021년: 비즈니스 이메일 버그 리포트 {#2021-business-email-bug-report}

2021년 3월, PayPal의 비즈니스 이메일 시스템이 잘못된 취소 알림을 보내고 있음을 보고했습니다. 이메일 템플릿의 변수들이 잘못 렌더링되어 고객에게 혼란스러운 메시지를 보여주고 있었습니다.

Mark Stuart가 문제를 인정했습니다:

> 고마워요 Nick! BCC로 전환 중입니다. @Prasy, 이 이메일에 대해 당신 팀이 책임이 있나요, 아니면 누가 담당하는지 아나요? "Niftylettuce, LLC, 더 이상 청구하지 않겠습니다"라는 문구 때문에 수신자와 이메일 내용이 혼동된 것 같습니다.

**결과**: 실제로 이 문제를 고쳤습니다! Mark Stuart가 확인했습니다:

> 알림 팀으로부터 이메일 템플릿이 수정되어 배포되었다는 소식을 방금 들었습니다. 신고해 주셔서 감사합니다. 고맙습니다!

이것은 그들이 원할 때는 문제를 고칠 수 있다는 것을 보여줍니다 - 단지 대부분의 문제에 대해서는 고치지 않기로 선택할 뿐입니다.

### 2021년: UI 개선 제안 {#2021-ui-improvement-suggestions}

2021년 2월, 우리는 대시보드 UI, 특히 "PayPal 최근 활동" 섹션에 대해 상세한 피드백을 제공했습니다:

> 저는 paypal.com 대시보드, 특히 "PayPal 최근 활동"이 개선되어야 한다고 생각합니다. $0 반복 결제의 "생성됨" 상태 라인을 보여줄 필요가 없다고 봅니다 - 불필요한 라인이 너무 많아지고 하루 또는 며칠간 발생한 수입이 한눈에 쉽게 보이지 않습니다.

Mark Stuart는 이를 소비자 제품 팀에 전달했습니다:

> 감사합니다! Activity를 담당하는 팀이 어디인지 확실하지 않지만, 올바른 팀을 찾기 위해 소비자 제품 책임자에게 전달했습니다. $0.00 반복 결제는 버그로 보입니다. 필터링되어야 할 것 같습니다.

**결과**: 전혀 고쳐지지 않았습니다. UI는 여전히 쓸모없는 $0 항목들을 보여줍니다.

### 2021년: 샌드박스 환경 문제 {#2021-sandbox-environment-failures}

2021년 11월, 우리는 PayPal 샌드박스 환경의 심각한 문제들을 보고했습니다:

* 샌드박스 비밀 API 키가 무작위로 변경되고 비활성화됨
* 모든 샌드박스 테스트 계정이 통보 없이 삭제됨
* 샌드박스 계정 세부정보 조회 시 오류 메시지 발생
* 간헐적인 로딩 실패

> 이유는 모르겠지만 내 샌드박스 비밀 API 키가 변경되어 비활성화되었습니다. 또한 내 모든 이전 샌드박스 테스트 계정이 삭제되었습니다.

> 때때로 로딩이 되고 때때로 안 됩니다. 정말 짜증납니다.

**결과**: 응답도 없고, 수정도 없었습니다. 개발자들은 여전히 샌드박스 신뢰성 문제에 직면해 있습니다.

### 2021년: 보고 시스템 완전 고장 {#2021-reports-system-completely-broken}
2021년 5월, 우리는 PayPal의 거래 보고서 다운로드 시스템이 완전히 고장났다고 보고했습니다:

> 현재 보고서 다운로드가 작동하지 않는 것 같고 하루 종일 그렇습니다. 실패할 경우 이메일 알림도 받아야 할 것 같습니다.

우리는 또한 세션 관리 재앙도 지적했습니다:

> 또한 PayPal에 로그인한 상태에서 5분 정도 비활성 상태면 로그아웃됩니다. 그래서 보고서 상태를 확인하려고 버튼을 다시 새로고침하면(영원히 기다린 후) 다시 로그인해야 해서 매우 번거롭습니다.

Mark Stuart는 세션 타임아웃 문제를 인정했습니다:

> 과거에 세션이 자주 만료되어 IDE와 developer.paypal.com 또는 상인 대시보드 사이를 전환할 때 개발 흐름이 방해받는다고 보고한 것을 기억합니다. 그리고 다시 돌아오면 또 로그아웃되어 있었습니다.

**결과**: 세션 타임아웃은 여전히 60초입니다. 보고서 시스템은 여전히 정기적으로 실패합니다.

### 2022년: 핵심 API 기능 누락 (다시) {#2022-core-api-feature-missing-again}

2022년 1월, 우리는 구독 목록 문제를 다시 제기했으며 이번에는 문서가 잘못되었다는 점을 더 자세히 설명했습니다:

> 모든 구독(이전에는 청구 계약이라고 불림)을 나열하는 GET이 없습니다.

우리는 공식 문서가 완전히 부정확하다는 것을 발견했습니다:

> API 문서도 완전히 부정확합니다. 구독 ID의 하드코딩된 목록을 다운로드하는 우회 방법을 시도해 보았지만 그것도 작동하지 않습니다!

> 공식 문서에서... 이렇게 할 수 있다고 나와 있습니다... 문제는 "구독 ID" 필드가 전혀 없다는 것입니다.

PayPal의 Christina Monti가 응답했습니다:

> 잘못된 단계로 인해 불편을 끼쳐 드려 죄송합니다. 이번 주에 수정하겠습니다.

Sri Shivananda(CTO)가 감사를 표했습니다:

> 저희를 더 나아지게 하는 데 지속적으로 도움을 주셔서 감사합니다. 매우 감사드립니다.

**결과**: 문서는 결코 수정되지 않았습니다. 구독 목록 엔드포인트도 결코 생성되지 않았습니다.


## 개발자 경험 악몽 {#the-developer-experience-nightmare}

PayPal API와 작업하는 것은 10년 전으로 돌아가는 것과 같습니다. 우리가 문서화한 기술적 문제는 다음과 같습니다:

### 깨진 사용자 인터페이스 {#broken-user-interface}

PayPal 개발자 대시보드는 재앙입니다. 우리가 매일 겪는 상황은 다음과 같습니다:

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  PayPal의 UI는 너무 망가져서 알림을 닫을 수도 없습니다
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  개발자 대시보드는 슬라이더를 끌게 만들고 60초 후에 로그아웃시킵니다
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  PayPal 개발자 인터페이스의 더 많은 UI 재앙, 깨진 워크플로우를 보여줍니다
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  구독 관리 인터페이스 - 인터페이스가 너무 나빠서 제품과 구독 플랜을 생성하기 위해 코드를 사용해야 했습니다
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="PayPal subscriptions screenshot" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  기능이 누락된 깨진 구독 인터페이스 뷰 (제품/플랜/구독을 쉽게 생성할 수 없으며, UI에서 생성된 제품이나 플랜을 삭제하는 방법도 전혀 없는 것 같습니다)
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="PayPal subscriptions screenshot 2" class="rounded-lg" />
</figure>
<figure>
  <figcaption><div class="alert alert-danger small text-center">
  일반적인 PayPal 오류 메시지 - 암호 같고 도움이 되지 않음
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### SDK 문제점 {#sdk-problems}

* 스크립트 태그로 SDK를 다시 로드하면서 버튼을 교체하고 다시 렌더링하는 복잡한 우회 방법 없이는 일회성 결제와 구독을 모두 처리할 수 없음
* JavaScript SDK가 기본 규칙을 위반함 (소문자 클래스 이름, 인스턴스 검사 없음)
* 오류 메시지가 어떤 필드가 누락되었는지 알려주지 않음
* 일관성 없는 데이터 타입 (숫자 대신 문자열 금액 요구)

### 콘텐츠 보안 정책 위반 {#content-security-policy-violations}

그들의 SDK는 CSP에 unsafe-inline과 unsafe-eval을 요구하여, **사이트 보안을 타협하도록 강요함**.

### 문서 혼란 {#documentation-chaos}

Mark Stuart 본인이 인정함:

> 레거시와 새로운 API가 너무 많다는 데 동의합니다. (여기서 일하는 우리도) 정말 찾기 어렵습니다.

### 보안 취약점 {#security-vulnerabilities}

**PayPal의 2FA 구현은 역방향임**. TOTP 앱을 활성화해도 SMS 인증을 강제하여 SIM 스왑 공격에 취약함. TOTP가 활성화되어 있으면 그것만 사용해야 하며, 대체 수단은 SMS가 아니라 이메일이어야 함.

### 세션 관리 재앙 {#session-management-disaster}

**개발자 대시보드는 60초 비활성 후 로그아웃됨**. 생산적인 작업을 하려면 계속 로그인 → 캡차 → 2FA → 로그아웃 → 반복 과정을 거쳐야 함. VPN 사용 중인가? 행운을 빕니다.


## 2025년 7월: 마지막 한계 {#july-2025-the-final-straw}

11년간 같은 문제들이 반복된 후, 일상적인 계정 이전 중에 한계점에 도달함. 회사명 "Forward Email LLC"에 맞춰 새 PayPal 계정으로 전환해야 했음.

간단해야 할 일이 완전한 재앙으로 변함:

* 초기 테스트에서는 모든 것이 정상 작동함
* 몇 시간 후, PayPal이 예고 없이 모든 구독 결제를 차단함
* 고객이 결제할 수 없어 혼란과 지원 부담 발생
* PayPal 지원팀은 계정이 인증되었다고 모순된 답변을 줌
* PayPal 결제를 완전히 중단할 수밖에 없었음

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  고객이 결제 시도 시 본 오류 - 설명도, 로그도 없음
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  결제가 완전히 고장난 동안 PayPal 지원팀은 모든 것이 정상이라고 주장함. 마지막 메시지에서는 "일부 기능을 복구했다"고 하면서도 여전히 더 많은 불명확한 정보를 요구함 - 전형적인 PayPal 지원 쇼
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-help-center-1.png" alt="PayPal help center screenshot 1" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-2.png" alt="PayPal help center screenshot 2" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-3.png" alt="PayPal help center screenshot 3" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-4.png" alt="PayPal help center screenshot 4" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-5.png" alt="PayPal help center screenshot 5" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-6.png" alt="PayPal help center screenshot 6" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  아무것도 "고치지 못한" 것으로 추정되는 신원 확인 절차
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-take-care-1.png" alt="PayPal take care screenshot 1" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-2.png" alt="PayPal take care screenshot 2" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-3.png" alt="PayPal take care screenshot 3" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-4.png" alt="PayPal take care screenshot 4" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-5.png" alt="PayPal take care screenshot 5" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-6.png" alt="PayPal take care screenshot 6" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-7.png" alt="PayPal take care screenshot 7" class="rounded-lg" />
</figure>
<figure>
  <figcaption><div class="alert alert-danger small text-center">
  모호한 메시지와 여전히 해결되지 않은 문제. 추가로 어떤 정보가 필요한지에 대한 정보, 공지 또는 아무런 안내도 없습니다. 고객 지원은 침묵합니다.
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>


## 왜 PayPal을 그냥 포기할 수 없는가 {#why-we-cant-just-drop-paypal}

이 모든 문제에도 불구하고, 일부 고객들은 결제 수단으로 PayPal만을 가지고 있기 때문에 PayPal을 완전히 포기할 수 없습니다. 한 고객이 우리 [상태 페이지](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515)에서 말했듯이:

> PayPal은 제가 결제할 수 있는 유일한 수단입니다

**PayPal이 특정 사용자들에게 결제 독점을 만들어서 우리는 고장난 플랫폼을 계속 지원할 수밖에 없습니다.**


## 커뮤니티의 우회 방법 {#the-community-workaround}

PayPal이 기본 구독 목록 기능을 제공하지 않기 때문에 개발자 커뮤니티가 우회 방법을 만들었습니다. 우리는 PayPal 구독 관리를 돕는 스크립트를 만들었습니다: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

이 스크립트는 개발자들이 해결책을 공유하는 [커뮤니티 gist](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4)를 참조합니다. 사용자들은 실제로 PayPal이 몇 년 전에 만들어야 했던 기능을 제공해줘서 [감사 인사를 전하고 있습니다](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775).


## 피싱 때문에 PayPal 템플릿 차단 {#blocking-paypal-templates-due-to-phishing}

문제는 API를 넘어섭니다. PayPal의 이메일 템플릿은 너무 형편없게 디자인되어서, 피싱 시도와 구분이 안 되어 우리 이메일 서비스에서 특정 필터링을 구현해야 했습니다.

### 진짜 문제: PayPal 템플릿이 사기처럼 보임 {#the-real-problem-paypals-templates-look-like-scams}

우리는 정기적으로 PayPal 이메일이 피싱 시도와 똑같이 보인다는 신고를 받습니다. 다음은 우리 남용 신고에서 실제 예시입니다:

**제목:** `[Sandbox] TEST - New invoice from PaypalBilling434567 sandbox #A4D369E8-0001`

이 이메일은 피싱 시도로 보였기 때문에 `abuse@microsoft.com`으로 전달되었습니다. 문제는? 실제로는 PayPal 샌드박스 환경에서 온 것이지만, 템플릿 디자인이 너무 형편없어서 피싱 탐지 시스템을 작동시켰습니다.

### 우리의 구현 {#our-implementation}

우리의 PayPal 전용 필터링은 [이메일 필터링 코드](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172)에서 확인할 수 있습니다:

```javascript
// check for paypal scam (very strict until PayPal resolves phishing on their end)
// (seems to only come from "outlook.com" and "paypal.com" hosts)
//
// X-Email-Type-Id = RT000238
// PPC001017
// RT000542 = gift message hack
// RT002947 = paypal invoice spam
// <https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-fraud/>
//
if (
  session.originalFromAddressRootDomain === 'paypal.com' &&
  headers.hasHeader('x-email-type-id') &&
  ['PPC001017', 'RT000238', 'RT000542', 'RT002947'].includes(
    headers.getFirst('x-email-type-id')
  )
) {
  const err = new SMTPError(
    'Due to ongoing PayPal invoice spam, you must manually send an invoice link'
  );
  err.isCodeBug = true; // alert admins for inspection
  throw err;
}
```

### 우리가 PayPal을 차단할 수밖에 없었던 이유 {#why-we-had-to-block-paypal}

우리는 PayPal이 반복된 남용 신고에도 불구하고 대규모 스팸/피싱/사기 문제를 해결하지 않아서 이 필터링을 구현했습니다. 우리가 차단하는 특정 이메일 유형은 다음과 같습니다:

* **RT000238** - 의심스러운 송장 알림
* **PPC001017** - 문제 있는 결제 확인
* **RT000542** - 선물 메시지 해킹 시도

### 문제의 규모 {#the-scale-of-the-problem}

우리 스팸 필터링 로그는 매일 처리하는 PayPal 송장 스팸의 엄청난 양을 보여줍니다. 차단된 제목 예시는 다음과 같습니다:

* "PayPal 청구 팀에서 보낸 송장:- 이 요금은 귀하의 계좌에서 자동으로 인출됩니다. 즉시 \[PHONE]으로 연락해 주세요"
* "\[COMPANY NAME] (\[ORDER-ID])에서 보낸 송장"
* 다양한 전화번호와 가짜 주문 ID가 포함된 여러 변형들
이 이메일들은 종종 `outlook.com` 호스트에서 발송되지만 PayPal의 정식 시스템에서 온 것처럼 보여 특히 위험합니다. 이 이메일들은 PayPal의 실제 인프라를 통해 발송되기 때문에 SPF, DKIM, DMARC 인증을 통과합니다.

우리의 기술 로그에 따르면 이 스팸 이메일들은 정식 PayPal 헤더를 포함하고 있습니다:

* `X-Email-Type-Id: RT000238` (우리가 차단하는 동일한 ID)
* `From: "service@paypal.com" <service@paypal.com>`
* `paypal.com`의 유효한 DKIM 서명
* PayPal 메일 서버를 나타내는 적절한 SPF 레코드

이로 인해 불가능한 상황이 발생합니다: 정식 PayPal 이메일과 스팸이 동일한 기술적 특성을 가집니다.

### 아이러니 {#the-irony}

금융 사기와의 싸움을 선도해야 할 PayPal이 이메일 템플릿을 너무 형편없이 설계하여 안티 피싱 시스템을 작동시키고 있습니다. 우리는 사기와 구분할 수 없기 때문에 정식 PayPal 이메일을 차단할 수밖에 없습니다.

이는 보안 연구에 문서화되어 있습니다: [PayPal 새 주소 사기 주의](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) - PayPal 자체 시스템이 사기에 어떻게 악용되는지 보여줍니다.

### 실제 영향: 새로운 PayPal 사기 {#real-world-impact-novel-paypal-scams}

문제는 단순한 템플릿 설계 미흡을 넘어섭니다. PayPal의 송장 시스템은 너무 쉽게 악용되어 사기꾼들이 정식처럼 보이는 사기 송장을 정기적으로 보냅니다. 보안 연구원 Gavin Anderegg는 [새로운 PayPal 사기](https://anderegg.ca/2023/02/01/a-novel-paypal-scam)를 문서화했는데, 사기꾼들이 모든 인증 검사를 통과하는 실제 PayPal 송장을 보냅니다:

> "소스를 검사해보니 이메일이 실제로 PayPal에서 온 것처럼 보였습니다(SPF, DKIM, DMARC 모두 통과). 버튼도 정식 PayPal URL처럼 연결되어 있었고... 잠시 후에야 이게 정식 이메일임을 깨달았습니다. 사기꾼이 보낸 무작위 '송장'을 받은 것이었습니다."

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  여러 개의 사기 PayPal 송장이 받은 편지함을 가득 채우고 있으며, 모두 실제로 PayPal 시스템에서 온 것처럼 보여 정식으로 보이는 스크린샷
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="PayPal scam warning screenshot" class="rounded-lg" />
</figure>

연구원은 다음과 같이 언급했습니다:

> "이것은 PayPal이 잠가야 할 편의 기능처럼 보입니다. 저는 즉시 이것이 일종의 사기라고 생각했고 기술적 세부사항에만 관심이 있었습니다. 너무 쉽게 실행할 수 있어 다른 사람들이 속을까 걱정됩니다."

이것은 문제를 완벽히 보여줍니다: PayPal 자체의 정식 시스템이 너무 형편없이 설계되어 사기를 가능하게 하면서 동시에 정식 커뮤니케이션을 의심스럽게 만듭니다.

더 나쁜 것은, 이로 인해 Yahoo와의 전달률에 영향을 미쳐 고객 불만과 수시간에 걸친 세심한 테스트 및 패턴 확인이 필요했습니다.


## PayPal의 역행하는 KYC 절차 {#paypals-backwards-kyc-process}

PayPal 플랫폼에서 가장 답답한 점 중 하나는 컴플라이언스 및 고객확인(KYC) 절차에 대한 역행하는 접근 방식입니다. 다른 모든 결제 처리업체와 달리 PayPal은 개발자가 API를 통합하고 적절한 인증을 완료하기 전에 프로덕션에서 결제 수집을 시작할 수 있도록 허용합니다.

### 올바른 절차 {#how-it-should-work}

모든 정식 결제 처리업체는 다음 논리적 순서를 따릅니다:

1. **먼저 KYC 인증 완료**
2. **가맹점 계정 승인**
3. **프로덕션 API 접근 권한 제공**
4. **결제 수집 허용**

이것은 돈이 오가기 전에 컴플라이언스를 보장하여 결제 처리업체와 가맹점 모두를 보호합니다.

### PayPal의 실제 절차 {#how-paypal-actually-works}

PayPal의 절차는 완전히 역행합니다:

1. **즉시 프로덕션 API 접근 권한 제공**
2. **수 시간 또는 수 일 동안 결제 수집 허용**
3. **예고 없이 갑자기 결제 차단**
4. **고객이 이미 영향을 받은 후 KYC 문서 요구**
5. **가맹점에 아무 통지 제공 안 함**
6. **고객이 문제를 발견하고 신고하도록 방치**
### 실제 영향 {#the-real-world-impact}

이 역방향 프로세스는 비즈니스에 재앙을 초래합니다:

* **고객이 피크 판매 기간에 구매를 완료할 수 없음**
* **검증이 필요하다는 사전 경고 없음**
* **결제가 차단될 때 이메일 알림 없음**
* **가맹점이 혼란스러운 고객으로부터 문제를 알게 됨**
* **중요한 비즈니스 기간 동안 수익 손실**
* **결제가 원인 모르게 실패할 때 고객 신뢰 손상**

### 2025년 7월 계정 이전 재앙 {#the-july-2025-account-migration-disaster}

이 정확한 시나리오는 2025년 7월 정기 계정 이전 중에 발생했습니다. PayPal은 처음에는 결제가 작동하도록 허용하다가 갑자기 아무 알림 없이 결제를 차단했습니다. 고객들이 결제할 수 없다고 보고하기 시작했을 때에야 문제를 발견했습니다.

지원팀에 연락했을 때, 어떤 문서가 필요한지에 대해 상반된 답변을 받았고 해결 일정도 명확하지 않았습니다. 이로 인해 PayPal 결제를 완전히 중단할 수밖에 없었고, 다른 결제 수단이 없는 고객들을 혼란스럽게 만들었습니다.

### 이것이 중요한 이유 {#why-this-matters}

PayPal의 컴플라이언스 접근 방식은 비즈니스 운영 방식을 근본적으로 오해하고 있음을 보여줍니다. 적절한 KYC는 고객이 이미 결제하려고 시도하기 전에 **생산 통합 이전에** 이루어져야 합니다. 문제가 발생했을 때 사전 소통이 전혀 없는 것은 PayPal이 가맹점의 요구와 단절되어 있음을 나타냅니다.

이 역방향 프로세스는 PayPal의 더 넓은 조직 문제의 증상입니다: 내부 프로세스를 가맹점과 고객 경험보다 우선시하여, 비즈니스를 플랫폼에서 멀어지게 하는 운영 재앙을 초래합니다.


## 다른 모든 결제 프로세서가 제대로 하는 방법 {#how-every-other-payment-processor-does-it-right}

PayPal이 구현을 거부하는 구독 목록 기능은 업계에서 10년 넘게 표준으로 자리 잡았습니다. 다른 결제 프로세서들이 이 기본 요구사항을 처리하는 방법은 다음과 같습니다:

### Stripe {#stripe}

Stripe는 API 출시 때부터 구독 목록 기능을 제공해왔습니다. 그들의 문서는 고객 또는 가맹점 계정의 모든 구독을 조회하는 방법을 명확히 보여줍니다. 이는 기본 CRUD 기능으로 간주됩니다.

### Paddle {#paddle}

Paddle은 목록 조회, 필터링, 페이지네이션을 포함한 포괄적인 구독 관리 API를 제공합니다. 그들은 가맹점이 반복 수익 흐름을 볼 필요가 있음을 이해합니다.

### Coinbase Commerce {#coinbase-commerce}

암호화폐 결제 프로세서인 Coinbase Commerce조차 PayPal보다 나은 구독 관리를 제공합니다.

### Square {#square}

Square의 API는 구독 목록을 기본 기능으로 포함하며, 부수적인 기능이 아닙니다.

### 업계 표준 {#the-industry-standard}

모든 현대 결제 프로세서는 다음을 제공합니다:

* 모든 구독 목록 조회
* 상태, 날짜, 고객별 필터링
* 대용량 데이터셋에 대한 페이지네이션
* 구독 변경에 대한 웹훅 알림
* 작동하는 예제가 포함된 포괄적인 문서

### 다른 프로세서가 제공하는 것 vs PayPal {#what-other-processors-provide-vs-paypal}

**Stripe - 모든 구독 목록 조회:**

```http
GET https://api.stripe.com/v1/subscriptions
Authorization: Bearer sk_test_...

Response:
{
  "object": "list",
  "data": [
    {
      "id": "sub_1MowQVLkdIwHu7ixeRlqHVzs",
      "object": "subscription",
      "status": "active",
      "customer": "cus_Na6dX7aXxi11N4",
      "current_period_start": 1679609767,
      "current_period_end": 1682288167
    }
  ],
  "has_more": false
}
```

**Stripe - 고객별 필터링:**

```http
GET https://api.stripe.com/v1/subscriptions?customer=cus_Na6dX7aXxi11N4
```

**Stripe - 상태별 필터링:**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal - 실제로 얻을 수 있는 것:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# ID를 이미 알고 있는 경우에만 단일 구독을 조회할 수 있음
# 모든 구독을 나열하는 엔드포인트가 없음
# 검색 또는 필터링 방법이 없음
# 모든 구독 ID를 직접 추적해야 함
```

**PayPal에서 제공하는 엔드포인트:**

* `POST /v1/billing/subscriptions` - 구독 생성
* `GET /v1/billing/subscriptions/{id}` - 단일 구독 조회 (ID를 알고 있을 경우)
* `PATCH /v1/billing/subscriptions/{id}` - 구독 업데이트
* `POST /v1/billing/subscriptions/{id}/cancel` - 구독 취소
* `POST /v1/billing/subscriptions/{id}/suspend` - 구독 일시 중지
**PayPal에서 누락된 사항:**

* ❌ `GET /v1/billing/subscriptions` (전체 목록) 없음
* ❌ 검색 기능 없음
* ❌ 상태, 고객, 날짜별 필터링 없음
* ❌ 페이지네이션 지원 없음

PayPal은 개발자들이 구독 ID를 자체 데이터베이스에 수동으로 추적하도록 강요하는 유일한 주요 결제 처리업체입니다.


## PayPal의 조직적인 은폐: 600만 목소리 침묵시키기 {#paypals-systematic-cover-up-silencing-6-million-voices}

PayPal이 비판을 처리하는 방식을 완벽하게 보여주는 조치로, 최근 전체 커뮤니티 포럼을 오프라인으로 전환하여 600만 명이 넘는 회원들의 목소리를 효과적으로 차단하고 수십만 건의 실패 기록 게시물을 삭제했습니다.

### 대규모 삭제 {#the-great-erasure}

원래 `paypal-community.com`에 있던 PayPal 커뮤니티는 **6,003,558명의 회원**을 보유하고 있었으며, 수십만 건의 게시물, 버그 리포트, 불만 및 PayPal API 실패에 관한 토론을 포함하고 있었습니다. 이는 PayPal의 체계적인 문제를 10년 넘게 문서화한 증거였습니다.

2025년 6월 30일, PayPal은 조용히 전체 포럼을 오프라인으로 전환했습니다. 모든 `paypal-community.com` 링크는 현재 404 오류를 반환합니다. 이는 마이그레이션이나 업그레이드가 아니었습니다.

### 제3자 구출 {#the-third-party-rescue}

다행히도 [ppl.lithium.com](https://ppl.lithium.com/)의 제3자 서비스가 일부 콘텐츠를 보존하여 PayPal이 숨기려 했던 토론에 접근할 수 있게 해주고 있습니다. 그러나 이 제3자 보존은 불완전하며 언제든지 사라질 수 있습니다.

이러한 증거 은폐 패턴은 PayPal에게 새롭지 않습니다. 그들은 다음과 같은 기록된 역사를 가지고 있습니다:

* 중요한 버그 리포트를 공개에서 제거
* 개발자 도구를 예고 없이 중단
* 적절한 문서화 없이 API 변경
* 실패에 관한 커뮤니티 토론을 침묵시키기

포럼 폐쇄는 그들의 체계적인 실패를 대중의 감시로부터 숨기려는 가장 대담한 시도를 나타냅니다.


## 11년간의 캡처 버그 재앙: $1,899 그리고 계속 증가 중 {#the-11-year-capture-bug-disaster-1899-and-counting}

PayPal이 피드백 세션을 조직하고 약속을 하는 동안, 그들의 핵심 결제 처리 시스템은 11년 넘게 근본적으로 고장 난 상태였습니다. 증거는 충격적입니다.

### Forward Email의 $1,899 손실 {#forward-emails-1899-loss}

우리의 운영 시스템에서 PayPal의 캡처 실패로 인해 손실된 총 **$1,899**에 달하는 108건의 PayPal 결제를 발견했습니다. 이 결제들은 일관된 패턴을 보여줍니다:

* `CHECKOUT.ORDER.APPROVED` 웹훅이 수신됨
* PayPal의 캡처 API가 404 오류 반환
* 주문이 PayPal API를 통해 접근 불가 상태가 됨

PayPal이 14일 후 디버그 로그를 완전히 숨기고 캡처되지 않은 주문 ID에 대한 모든 데이터를 대시보드에서 삭제하기 때문에 고객이 실제로 결제되었는지 확인하는 것은 불가능합니다.

이는 단지 한 사업체의 사례입니다. **수천 개의 상점에서 11년 이상 누적된 손실은 수백만 달러에 이를 가능성이 큽니다.**

**다시 한 번 말씀드립니다: 수천 개 상점에서 11년 이상 누적된 손실은 수백만 달러에 이를 가능성이 큽니다.**

우리가 이 사실을 발견할 수 있었던 유일한 이유는 매우 꼼꼼하고 데이터 중심적이었기 때문입니다.

### 2013년 최초 보고: 11년 이상의 방치 {#the-2013-original-report-11-years-of-negligence}

이 동일한 문제에 대한 가장 초기 문서화된 보고서는 [2013년 11월 Stack Overflow](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([아카이브](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture))에 나타납니다:

> "캡처 시 REST API에서 404 오류가 계속 발생합니다"

2013년에 보고된 오류는 2024년 Forward Email이 경험한 것과 **동일**합니다:

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

2013년 커뮤니티 반응은 다음과 같았습니다:

> "현재 REST API에 문제가 보고되고 있습니다. PayPal이 이를 해결 중입니다."
**11년이 넘도록, 그들은 여전히 "작업 중"입니다.**

### 2016년 인정: PayPal이 자사 SDK를 망가뜨리다 {#the-2016-admission-paypal-breaks-their-own-sdk}

2016년, PayPal의 공식 GitHub 저장소에는 [대규모 캡처 실패](https://github.com/paypal/PayPal-PHP-SDK/issues/660)가 공식 PHP SDK에 영향을 미친 것으로 기록되어 있습니다. 그 규모는 엄청났습니다:

> "2016년 9월 20일부터 모든 PayPal 캡처 시도가 'INVALID_RESOURCE_ID - 요청한 리소스 ID를 찾을 수 없습니다.' 오류로 실패하고 있습니다. 9월 19일과 20일 사이 API 통합에 아무런 변경도 없었습니다. **9월 20일 이후 모든 캡처 시도 100%가 이 오류를 반환했습니다.**"

한 상인은 이렇게 보고했습니다:

> "지난 24시간 동안 **1,400건 이상의 캡처 실패 시도**가 있었으며, 모두 INVALID_RESOURCE_ID 오류 응답이었습니다."

PayPal의 초기 대응은 상인 탓을 하며 기술 지원으로 돌리는 것이었습니다. 대규모 압박이 있은 후에야 그들은 잘못을 인정했습니다:

> "제품 개발팀으로부터 업데이트를 받았습니다. 전송되는 헤더에서 PayPal-Request-ID가 42자 길이로 전송되고 있지만, **최근 변경으로 이 ID가 38자로 제한된 것 같습니다.**"

이 인정은 PayPal의 체계적인 태만을 드러냅니다:

1. **문서화되지 않은 파괴적 변경을 했습니다**
2. **자사 공식 SDK를 망가뜨렸습니다**
3. **먼저 상인들을 탓했습니다**
4. **압박을 받기 전까지 잘못을 인정하지 않았습니다**

문제를 "수정"한 후에도 상인들은 보고했습니다:

> "SDK를 v1.7.4로 업그레이드했지만 **문제가 여전히 발생하고 있습니다.**"

### 2024년 상황 악화: 여전히 고장 {#the-2024-escalation-still-broken}

보존된 PayPal 커뮤니티의 최근 보고서에 따르면 문제가 실제로 더 악화되었습니다. [2024년 9월 토론](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([아카이브](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093))에서는 동일한 문제가 문서화되어 있습니다:

> "문제는 약 2주 전부터 나타나기 시작했으며 모든 주문에 영향을 미치지는 않습니다. **가장 흔한 문제는 캡처 시 404 오류입니다.**"

상인은 Forward Email이 경험한 동일한 패턴을 설명합니다:

> "주문을 캡처하려고 시도한 후 PayPal이 404를 반환합니다. 주문 세부 정보를 조회할 때: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **우리 쪽에서는 성공적인 캡처 흔적이 전혀 없습니다.**"

### 웹훅 신뢰성 재앙 {#the-webhook-reliability-disaster}

또 다른 [보존된 커뮤니티 토론](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446)은 PayPal의 웹훅 시스템이 근본적으로 신뢰할 수 없음을 보여줍니다:

> "이론적으로는 Webhook 이벤트에서 두 가지 이벤트(CHECKOUT.ORDER.APPROVED 및 PAYMENT.CAPTURE.COMPLETED)가 있어야 합니다. 실제로는 **이 두 이벤트가 거의 즉시 수신되지 않으며, PAYMENT.CAPTURE.COMPLETED는 대부분 수신되지 않거나 몇 시간 후에 수신됩니다.**"

구독 결제의 경우:

> "**'PAYMENT.SALE.COMPLETED'가 때때로 수신되지 않거나 몇 시간 후에 수신됩니다.**"

상인의 질문은 PayPal 신뢰성 문제의 심각성을 드러냅니다:

1. **"왜 이런 일이 발생합니까?"** - PayPal의 웹훅 시스템은 근본적으로 고장났습니다
2. **"주문 상태가 'COMPLETED'라면 돈을 받은 것으로 봐도 됩니까?"** - 상인들은 PayPal API 응답을 신뢰할 수 없습니다
3. **"'이벤트 로그->웹훅 이벤트'에서 로그를 찾을 수 없는 이유는 무엇입니까?"** - PayPal 자체 로깅 시스템조차 작동하지 않습니다

### 체계적인 태만의 패턴 {#the-pattern-of-systematic-negligence}

증거는 11년 이상에 걸쳐 명확한 패턴을 보여줍니다:

* **2013년**: "PayPal이 작업 중입니다"
* **2016년**: PayPal이 파괴적 변경을 인정하고, 망가진 수정안을 제공합니다
* **2024년**: 동일한 오류가 여전히 발생하며 Forward Email과 수많은 다른 사용자에게 영향을 미칩니다

이것은 단순한 버그가 아닙니다 - **체계적인 태만입니다.** PayPal은 10년 넘게 이러한 치명적인 결제 처리 실패를 알고 있었으며 지속적으로:
1. **PayPal의 버그에 대해 상인을 비난함**
2. **문서화되지 않은 파괴적 변경을 수행함**
3. **작동하지 않는 부적절한 수정사항을 제공함**
4. **비즈니스에 미치는 재정적 영향을 무시함**
5. **커뮤니티 포럼을 폐쇄하여 증거를 은폐함**

### 문서화되지 않은 요구사항 {#the-undocumented-requirement}

PayPal의 공식 문서 어디에도 상인이 캡처 작업에 대해 재시도 로직을 구현해야 한다고 명시되어 있지 않습니다. 그들의 문서에는 상인이 "승인 직후 캡처해야 한다"고만 되어 있을 뿐, API가 무작위로 404 오류를 반환하여 복잡한 재시도 메커니즘이 필요하다는 점은 언급하지 않습니다.

이로 인해 모든 상인은 다음을 강제당합니다:

* 지수 백오프 재시도 로직 구현
* 불규칙한 웹훅 전달 처리
* 복잡한 상태 관리 시스템 구축
* 실패한 캡처를 수동으로 모니터링

**다른 모든 결제 처리업체는 처음부터 작동하는 신뢰할 수 있는 캡처 API를 제공합니다.**


## PayPal의 더 넓은 기만 패턴 {#paypals-broader-pattern-of-deception}

캡처 버그 재앙은 PayPal이 고객을 속이고 실패를 은폐하는 체계적인 접근 방식의 한 예일 뿐입니다.

### 뉴욕 금융서비스국 조치 {#the-new-york-department-of-financial-services-action}

2025년 1월, 뉴욕 금융서비스국은 [PayPal에 대해 기만적 행위에 관한 집행 조치](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf)를 발표했으며, 이는 PayPal의 기만 패턴이 API를 넘어 비즈니스 전반에 걸쳐 있음을 보여줍니다.

이 규제 조치는 PayPal이 개발자 도구뿐만 아니라 전체 비즈니스에서 기만적 행위에 관여할 의지가 있음을 나타냅니다.

### 허니 소송: 제휴 링크 재작성 {#the-honey-lawsuit-rewriting-affiliate-links}

PayPal의 허니 인수는 [허니가 제휴 링크를 재작성한다는 소송](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer)으로 이어졌으며, 이는 콘텐츠 제작자와 인플루언서의 수수료를 훔치는 행위입니다. 이는 PayPal이 다른 사람에게 돌아가야 할 수익을 리디렉션하여 이익을 얻는 또 다른 체계적 기만의 형태입니다.

패턴은 명확합니다:

1. **API 실패**: 기능 고장 은폐, 상인 탓으로 돌림
2. **커뮤니티 침묵**: 문제 증거 제거
3. **규제 위반**: 기만적 행위 수행
4. **제휴 수수료 절도**: 기술적 조작으로 수수료 탈취

### PayPal의 태만 비용 {#the-cost-of-paypals-negligence}

Forward Email의 $1,899 손실은 빙산의 일각에 불과합니다. 더 넓은 영향을 고려해보면:

* **개별 상인**: 수천 명이 수백에서 수천 달러 손실
* **기업 고객**: 잠재적으로 수백만 달러의 매출 손실
* **개발자 시간**: PayPal의 고장난 API를 위한 수많은 우회 작업 시간
* **고객 신뢰**: PayPal 결제 실패로 인한 고객 이탈

작은 이메일 서비스 하나가 거의 $2,000를 잃었고, 이 문제가 11년 이상 수천 명의 상인에게 영향을 미쳤다면, 총 재정적 피해는 아마도 **수억 달러**에 이를 것입니다.

### 문서의 거짓말 {#the-documentation-lie}

PayPal의 공식 문서는 상인이 직면할 중요한 제한사항과 버그를 지속적으로 누락합니다. 예를 들어:

* **캡처 API**: 404 오류가 흔하며 재시도 로직이 필요하다는 언급 없음
* **웹훅 신뢰성**: 웹훅이 종종 몇 시간 지연된다는 언급 없음
* **구독 목록**: 엔드포인트가 없음에도 목록 조회가 가능하다고 암시
* **세션 타임아웃**: 공격적인 60초 타임아웃에 대한 언급 없음

이러한 중요한 정보의 체계적 누락은 상인들이 운영 시스템에서 시행착오를 통해 PayPal의 한계를 발견하도록 강요하며, 종종 재정적 손실로 이어집니다.


## 개발자에게 의미하는 바 {#what-this-means-for-developers}

PayPal이 광범위한 피드백을 수집하면서도 기본적인 개발자 요구를 해결하지 못하는 체계적 실패는 근본적인 조직 문제를 보여줍니다. 그들은 문제를 실제로 해결하는 대신 피드백 수집을 대체 수단으로 취급합니다.
패턴은 명확합니다:

1. 개발자들이 문제를 보고합니다
2. PayPal은 경영진과 피드백 세션을 조직합니다
3. 광범위한 피드백이 제공됩니다
4. 팀들은 격차를 인정하고 "추적 및 해결"을 약속합니다
5. 아무 것도 구현되지 않습니다
6. 경영진은 더 나은 회사로 떠납니다
7. 새로운 팀이 같은 피드백을 요청합니다
8. 사이클이 반복됩니다

그동안 개발자들은 결제를 수락하기 위해 우회 방법을 만들고, 보안을 타협하며, 깨진 UI를 다뤄야만 합니다.

결제 시스템을 구축 중이라면, 우리의 경험에서 배우세요: 여러 결제 처리업체와 함께 [삼위일체 접근법](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal)을 구축하되, PayPal이 필요한 기본 기능을 제공할 것이라고 기대하지 마세요. 첫날부터 우회 방법을 구축할 계획을 세우세요.

> 이 게시물은 Forward Email에서 PayPal API를 사용한 11년간의 경험을 문서화한 것입니다. 모든 코드 예제와 링크는 실제 운영 시스템에서 가져온 것입니다. 일부 고객에게 다른 선택지가 없기 때문에 이러한 문제에도 불구하고 PayPal 결제를 계속 지원하고 있습니다

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API disaster illustration" class="rounded-lg" />
