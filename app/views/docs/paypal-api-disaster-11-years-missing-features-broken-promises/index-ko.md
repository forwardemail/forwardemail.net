# PayPal의 11년 API 재앙: 개발자들을 무시하는 동안 우리는 어떻게 해결책을 구축했는가 {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="PayPal API disaster illustration" 클래스="둥근-lg" />

<p class="lead mt-3">Forward Email에서는 10년 넘게 PayPal의 손상된 API 문제를 해결해 왔습니다. 사소한 문제로 시작된 문제가 완전히 재앙으로 변하여 자체적인 해결책을 구축하고, 피싱 템플릿을 차단하고, 중요한 계정 마이그레이션 과정에서 모든 PayPal 결제를 중단해야 했습니다.</p>
<p class="lead mt-3">이것은 저희가 PayPal 플랫폼을 제대로 작동시키기 위해 모든 노력을 기울이는 동안 PayPal이 11년 동안 개발자의 기본적인 요구 사항을 무시해 온 이야기입니다.</p>

## 목차 {#table-of-contents}

* [누락된 부분: 구독을 나열할 방법이 없음](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017: 문제가 나타나다](#2014-2017-the-problem-emerges)
* [2020년: 우리는 그들에게 광범위한 피드백을 제공합니다](#2020-we-give-them-extensive-feedback)
  * [27개 항목 피드백 목록](#the-27-item-feedback-list)
  * [팀이 참여하고 약속이 이루어졌습니다.](#teams-got-involved-promises-were-made)
  * [결과는? 아무것도 없었다.](#the-result-nothing)
* [임원진의 대거 이탈: PayPal이 모든 기관적 기억을 잃은 이유](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025년: 새로운 리더십, 여전히 같은 문제들](#2025-new-leadership-same-problems)
  * [새로운 CEO가 참여합니다](#the-new-ceo-gets-involved)
  * [Michelle Gill의 응답](#michelle-gills-response)
  * [우리의 대응: 더 이상 회의 없음](#our-response-no-more-meetings)
  * [마티 브로드벡의 과잉공학적 대응](#marty-brodbecks-overengineering-response)
  * ["단순 CRUD"의 모순](#the-simple-crud-contradiction)
  * [단절이 명확해진다](#the-disconnect-becomes-clear)
* [수년간 무시된 버그 보고서](#years-of-bug-reports-they-ignored)
  * [2016년: 초기 UI/UX 불만](#2016-early-uiux-complaints)
  * [2021: 비즈니스 이메일 버그 보고서](#2021-business-email-bug-report)
  * [2021: UI 개선 제안](#2021-ui-improvement-suggestions)
  * [2021: 샌드박스 환경 실패](#2021-sandbox-environment-failures)
  * [2021년: 보고서 시스템 완전 고장](#2021-reports-system-completely-broken)
  * [2022: 핵심 API 기능 누락(다시)](#2022-core-api-feature-missing-again)
* [개발자 경험의 악몽](#the-developer-experience-nightmare)
  * [깨진 사용자 인터페이스](#broken-user-interface)
  * [SDK 문제](#sdk-problems)
  * [콘텐츠 보안 정책 위반](#content-security-policy-violations)
  * [문서 혼란](#documentation-chaos)
  * [보안 취약점](#security-vulnerabilities)
  * [세션 관리 재해](#session-management-disaster)
* [2025년 7월: 마지막 순간](#july-2025-the-final-straw)
* [왜 우리는 PayPal을 그냥 폐기할 수 없는가](#why-we-cant-just-drop-paypal)
* [커뮤니티 해결 방법](#the-community-workaround)
* [피싱으로 인한 PayPal 템플릿 차단](#blocking-paypal-templates-due-to-phishing)
  * [진짜 문제: PayPal 템플릿은 사기처럼 보입니다.](#the-real-problem-paypals-templates-look-like-scams)
  * [우리의 구현](#our-implementation)
  * [왜 우리는 PayPal을 차단해야 했는가](#why-we-had-to-block-paypal)
  * [문제의 규모](#the-scale-of-the-problem)
  * [아이러니](#the-irony)
  * [실제 세계에 미치는 영향: 새로운 PayPal 사기](#real-world-impact-novel-paypal-scams)
* [PayPal의 역방향 KYC 프로세스](#paypals-backwards-kyc-process)
  * [작동 방식](#how-it-should-work)
  * [PayPal의 실제 작동 방식](#how-paypal-actually-works)
  * [현실 세계에 미치는 영향](#the-real-world-impact)
  * [2025년 7월 계정 마이그레이션 재난](#the-july-2025-account-migration-disaster)
  * [이것이 중요한 이유](#why-this-matters)
* [다른 모든 결제 처리업체가 올바르게 수행하는 방법](#how-every-other-payment-processor-does-it-right)
  * [줄무늬](#stripe)
  * [외륜](#paddle)
  * [코인베이스 커머스](#coinbase-commerce)
  * [정사각형](#square)
  * [산업 표준](#the-industry-standard)
  * [다른 프로세서가 제공하는 것과 PayPal의 차이점은 무엇입니까?](#what-other-processors-provide-vs-paypal)
* [PayPal의 조직적 은폐: 600만 명의 목소리를 침묵시키다](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [대지각](#the-great-erasure)
  * [제3자 구조](#the-third-party-rescue)
* [11년간의 포획 버그 재앙: 1,899달러, 계속 증가 중](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [전달 이메일의 1,899달러 손실](#forward-emails-1899-loss)
  * [2013년 원본 보고서: 11년 이상의 과실](#the-2013-original-report-11-years-of-negligence)
  * [2016년 입장: PayPal이 자체 SDK를 망가뜨렸다](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [2024년 에스컬레이션: 여전히 깨짐](#the-2024-escalation-still-broken)
  * [웹훅 신뢰성 재앙](#the-webhook-reliability-disaster)
  * [체계적 과실의 패턴](#the-pattern-of-systematic-negligence)
  * [문서화되지 않은 요구 사항](#the-undocumented-requirement)
* [PayPal의 광범위한 사기 패턴](#paypals-broader-pattern-of-deception)
  * [뉴욕 금융 서비스부 조치](#the-new-york-department-of-financial-services-action)
  * [허니 소송: 제휴 링크 재작성](#the-honey-lawsuit-rewriting-affiliate-links)
  * [PayPal의 과실로 인한 비용](#the-cost-of-paypals-negligence)
  * [문서 거짓말](#the-documentation-lie)
* [이것이 개발자에게 의미하는 바](#what-this-means-for-developers)

## 누락된 부분: 구독을 나열할 방법이 없음 {#the-missing-piece-no-way-to-list-subscriptions}

놀라운 점은 PayPal이 2014년부터 구독 청구 서비스를 제공했지만, 판매자가 자체 구독을 등록할 수 있는 방법은 제공한 적이 없다는 것입니다.

잠깐 생각해 보세요. 구독을 생성할 수도 있고, ID가 있으면 취소할 수도 있지만, 계정의 모든 활성 구독 목록을 가져올 수는 없습니다. 마치 SELECT 문이 없는 데이터베이스와 같습니다.

기본적인 비즈니스 운영을 위해 이것이 필요합니다.

* 고객 지원(구독 관련 문의 이메일 발송 시)
* 재무 보고 및 조정
* 자동 청구 관리
* 규정 준수 및 감사

하지만 PayPal은요? 그들은... 그냥 만들어내지 않았을 뿐이에요.

## 2014-2017: 문제가 발생하다 {#2014-2017-the-problem-emerges}

구독 목록 문제는 2017년 PayPal 커뮤니티 포럼에서 처음 나타났습니다. 당시 개발자들은 당연한 질문을 던졌습니다. "내 모든 구독 목록을 어떻게 얻을 수 있나요?"

PayPal의 반응은? 깜빡임뿐이었다.

커뮤니티 회원들은 좌절감을 느끼기 시작했습니다.

> "판매자가 모든 활성 계약을 나열할 수 없다면 매우 이상한 누락입니다. 계약 ID가 분실된 경우 사용자만 계약을 취소하거나 일시 중지할 수 있습니다." - leafspider

> "+1. 거의 3년이 지났네요." - laudukang (문제가 2014년부터 있었다는 뜻)

2017년의 [원래 커뮤니티 게시물](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066)은 개발자들이 이 기본적인 기능을 간절히 원하고 있음을 보여줍니다. PayPal은 사람들이 문제를 보고한 저장소를 보관하는 방식으로 대응했습니다.

## 2020: 우리는 그들에게 광범위한 피드백을 제공합니다 {#2020-we-give-them-extensive-feedback}

2020년 10월, PayPal에서 공식 피드백 세션을 요청했습니다. 단순한 대화가 아니었습니다. PayPal은 Sri Shivananda(CTO), Edwin Aoki, Jim Magats, John Kunze 등 PayPal 임원 8명과 45분간 Microsoft Teams를 활용한 통화를 진행했습니다.

### 27개 항목 피드백 목록 {#the-27-item-feedback-list}

저희는 만반의 준비를 했습니다. 6시간 동안 API 통합을 시도한 끝에 27가지 구체적인 문제를 파악했습니다. PayPal Checkout 팀의 마크 스튜어트는 다음과 같이 말했습니다.

> 안녕하세요, Nick님. 오늘 여러분과 공유해 주셔서 감사합니다! 이 글이 저희 팀이 문제를 해결하는 데 더 많은 지원과 투자를 받는 계기가 될 것 같습니다. 지금까지 남겨주신 것만큼 풍부한 피드백을 받기가 어려웠습니다.

피드백은 이론적인 것이 아니라 실제 통합 시도에서 나왔습니다.

1. **액세스 토큰 생성이 작동하지 않음**:

> 액세스 토큰 생성이 작동하지 않습니다. 또한, cURL 예제만 있는 것이 아니라 더 많은 예제가 있어야 합니다.

2. **구독 생성을 위한 웹 UI 없음**:

> cURL을 사용하지 않고 어떻게 구독을 생성할 수 있나요? Stripe처럼 웹 UI가 없는 것 같습니다.

Mark Stuart는 액세스 토큰 문제가 특히 우려스럽다고 생각했습니다.

> 일반적으로 액세스 토큰 생성과 관련된 문제는 발생하지 않습니다.

### 팀이 참여하고 약속이 이루어졌습니다. {#teams-got-involved-promises-were-made}

더 많은 문제가 발견됨에 따라 PayPal은 계속해서 더 많은 팀을 대화에 참여시켰습니다. 구독 관리 UI 팀의 Darshan Raju가 합류하여 다음과 같이 말했습니다.

> 부족한 부분을 인정해 주세요. 이 부분을 추적하여 해결해 드리겠습니다. 피드백 주셔서 다시 한번 감사드립니다!

이 세션은 다음을 추구하는 것으로 설명되었습니다.

> 귀하의 경험에 대한 솔직한 설명

에게:

> 개발자를 위한 PayPal을 제대로 만들어주세요.

### 결과는? 아무것도 없습니다. {#the-result-nothing}

공식 피드백 세션에도 불구하고, 27개 항목으로 구성된 방대한 목록과 여러 팀의 참여를 통해 다음과 같은 약속을 했습니다.

> 추적 및 주소

문제가 있었지만 아무것도 해결되지 않았습니다.

## 임원진의 대거 이탈: PayPal이 모든 기관적 기억을 잃은 이유 {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

정말 흥미로운 부분이 바로 여기 있습니다. 2020년 피드백을 받은 모든 분들이 PayPal을 떠났습니다.

**리더십 변경 사항:**

* [댄 슐먼(9년 CEO) → 알렉스 크리스](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (2023년 9월)
* [Sri Shivananda(피드백을 조직한 CTO) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (2024년 1월)

**약속을 하고 떠난 기술 리더들:**

* **마크 스튜어트** (약속된 피드백이 "촉매제"가 될 것임) → [지금 Ripple에서](https://www.linkedin.com/in/markstuartsf)
* **짐 매거츠** (페이팔 18년 차 베테랑) → [MX의 CEO](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **존 쿤체** (글로벌 소비재 부문 부사장) → [은퇴](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **에드윈 아오키** (마지막 남은 사람 중 한 명) → [방금 나스닥으로 떠났어요](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (2025년 1월)

PayPal은 임원들이 개발자 피드백을 수집하고, 약속을 한 다음 JPMorgan, Ripple 및 기타 핀테크 회사와 같은 더 나은 회사로 떠나는 회전문이 되었습니다.

이는 2025년 GitHub 이슈에 대한 대응이 2020년 피드백과 전혀 동떨어져 보이는 이유를 설명합니다. 문자 그대로 해당 피드백을 받은 모든 사람이 PayPal을 떠났습니다.

## 2025: 새로운 리더십, 여전히 존재하는 문제 {#2025-new-leadership-same-problems}

2025년으로 넘어가면 정확히 같은 패턴이 나타납니다. 수년간 아무런 진전이 없던 페이팔의 새 경영진이 다시 손을 내밉니다.

### 새 CEO가 참여합니다. {#the-new-ceo-gets-involved}

2025년 6월 30일, 저희는 PayPal의 신임 CEO인 알렉스 크리스에게 직접 이 문제를 보고했습니다. 그의 답변은 간단했습니다.

> 안녕하세요, 닉님. 연락해 주시고 피드백 주셔서 감사합니다. 미셸(참조)은 팀과 함께 이 문제를 해결해 나가고 있습니다. 감사합니다 -A

### Michelle Gill의 응답 {#michelle-gills-response}

중소기업 및 금융 서비스 부문 EVP 겸 총괄 관리자인 Michelle Gill은 다음과 같이 답했습니다.

> 닉, 정말 고마워요. 알렉스를 숨은참조로 옮겼어요. 이전 글 이후로 이 문제를 조사해 왔어요. 이번 주가 끝나기 전에 전화 드리겠습니다. 제 동료가 연락할 수 있도록 연락처를 보내주시겠어요? 미셸

### 당사의 대응: 더 이상 회의가 없습니다 {#our-response-no-more-meetings}

우리는 우리의 좌절감을 설명하며 추가 회의를 거부했습니다.

> 감사합니다. 하지만 전화 통화를 한다고 해서 아무런 효과가 없을 것 같아요. 이유는 다음과 같습니다. 예전에 전화 통화를 했는데 전혀 진전이 없었어요. 전체 팀과 경영진과 두 시간 넘게 이야기를 나눴지만 아무것도 이뤄지지 않았어요. 이메일을 주고받았지만 아무것도 이뤄지지 않았어요. 피드백도 전혀 효과가 없었어요. 몇 년 동안 노력했고, 귀 기울여 들어주었는데, 결국 아무 소용이 없었어요.

### Marty Brodbeck의 과도한 대응 {#marty-brodbecks-overengineering-response}

그러자 PayPal의 소비자 엔지니어링 부문을 총괄하는 Marty Brodbeck이 연락했습니다.

> 안녕하세요, 닉. 저는 마티 브로드벡입니다. 페이팔에서 모든 소비자 엔지니어링을 총괄하고 있으며, 회사의 API 개발을 담당하고 있습니다. 현재 겪고 계신 문제와 저희가 어떻게 도움을 드릴 수 있을지에 대해 저와 이야기를 나눠주시겠어요?

구독 목록 엔드포인트에 대한 간단한 필요성을 설명했을 때 그의 응답은 정확한 문제를 드러냈습니다.

> 닉, 고맙습니다. 저희는 전체 SDK(전체 오류 처리, 이벤트 기반 구독 추적, 안정적인 가동 시간 지원)를 갖춘 단일 구독 API를 만드는 중이며, 청구도 판매자가 여러 엔드포인트에서 단일 응답을 받기 위해 조정할 필요 없이 별도의 API로 분리됩니다.

이건 완전히 잘못된 접근 방식입니다. 몇 달 동안 복잡한 아키텍처를 구축할 필요가 없습니다. 구독 목록을 보여주는 간단한 REST 엔드포인트 하나만 있으면 되는데, 이건 2014년부터 존재했어야 합니다.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### "단순 CRUD" 모순 {#the-simple-crud-contradiction}

우리가 이것이 2014년부터 존재했어야 할 기본 CRUD 기능이라고 지적했을 때, Marty의 반응은 의미심장했습니다.

> 간단한 Crud 작업은 핵심 API의 일부이므로 개발에 몇 달이 걸리지 않습니다.

수개월의 개발 끝에 현재 3개의 엔드포인트만 지원하는 PayPal TypeScript SDK와 그 역사적 타임라인은 이러한 프로젝트가 완료되려면 몇 달 이상이 필요하다는 것을 분명히 보여줍니다.

이 답변은 그가 자신의 API를 이해하지 못한다는 것을 보여줍니다. "간단한 CRUD 작업이 핵심 API의 일부"라면, 구독 목록 엔드포인트는 어디에 있습니까? 저희는 다음과 같이 답변했습니다.

> '간단한 CRUD 작업이 핵심 API의 일부'라면 구독 목록 엔드포인트는 어디에 있습니까? 개발자들은 2014년부터 이 '간단한 CRUD 작업'을 요구해 왔습니다. 벌써 11년이나 되었네요. 다른 모든 결제 처리 업체는 처음부터 이 기본 기능을 갖추고 있었습니다.

### 연결이 끊어졌습니다. {#the-disconnect-becomes-clear}

2025년 Alex Chriss, Michelle Gill, Marty Brodbeck과의 교류는 동일한 조직적 기능 장애를 보여줍니다.

1. **새로운 리더십은 이전 피드백 세션에 대한 지식이 없습니다.**
2. **똑같이 과도하게 설계된 솔루션을 제안합니다.**
3. **자체 API 한계를 이해하지 못합니다.**
4. **단순히 문제를 해결하는 대신 더 많은 회의를 원합니다.**

이러한 패턴은 2025년의 PayPal 팀이 2020년에 제공된 광범위한 피드백과 전혀 단절된 것처럼 보이는 이유를 설명합니다. 피드백을 받은 사람들은 사라졌고, 새로운 리더십은 같은 실수를 반복하고 있습니다.

## 무시된 버그 보고서 {#years-of-bug-reports-they-ignored}

저희는 단순히 기능 부족에 대한 불평만 한 것이 아닙니다. 버그를 적극적으로 보고하고 개선을 위해 노력했습니다. 저희가 기록한 문제들의 전체 타임라인은 다음과 같습니다.

### 2016: 초기 UI/UX 불만 {#2016-early-uiux-complaints}

2016년에도 저희는 Dan Schulman을 비롯한 PayPal 경영진에게 인터페이스 문제와 사용성 문제에 대해 공개적으로 문의했습니다. 9년 전의 일이지만, 오늘날에도 동일한 UI/UX 문제가 지속되고 있습니다.

### 2021: 비즈니스 이메일 버그 보고서 {#2021-business-email-bug-report}

2021년 3월, PayPal의 비즈니스 이메일 시스템에서 잘못된 취소 알림이 발송되고 있다는 사실을 보고했습니다. 이메일 템플릿의 변수가 잘못 렌더링되어 고객에게 혼란스러운 메시지를 표시했습니다.

마크 스튜어트는 이 문제를 인정했습니다.

> 닉, 고마워요! 숨은참조로 넘어가겠습니다. @Prasy, 이 이메일 담당 팀이신가요? 아니면 누구 담당인지 아시나요? "Niftylettuce, LLC, 더 이상 청구하지 않겠습니다"라는 문구를 보니 수신인과 이메일 내용이 혼동된 것 같습니다.

**결과**: 실제로 이 문제를 해결했습니다! 마크 스튜어트가 확인해 주었습니다.

> 알림팀에서 이메일 템플릿이 수정되어 배포되었다는 소식을 방금 받았습니다. 신고해 주셔서 감사합니다. 감사합니다!

이는 그들이 원할 때는 문제를 해결할 수 있다는 것을 보여줍니다. 다만 대부분의 문제에 대해서는 문제를 해결하지 않기로 선택할 뿐입니다.

### 2021: UI 개선 제안 {#2021-ui-improvement-suggestions}

2021년 2월에 우리는 대시보드 UI, 특히 "PayPal 최근 활동" 섹션에 대한 자세한 피드백을 제공했습니다.

> paypal.com의 대시보드, 특히 "PayPal 최근 활동" 기능이 개선되어야 한다고 생각합니다. "결제 완료" 상태 줄에 $0 정기 결제 내역을 표시하면 안 된다고 생각합니다. 너무 많은 줄만 추가되고, 오늘/지난 며칠 동안 발생한 수입을 한눈에 보기도 어렵습니다.

Mark Stuart는 이를 소비자 제품 팀에 전달했습니다.

> 감사합니다! Activity를 담당하는 팀이 어디인지는 잘 모르겠지만, 정확한 팀을 찾기 위해 소비자 제품 책임자에게 전달했습니다. $0.00 정기 결제는 버그인 것 같습니다. 필터링이 필요할 것 같습니다.

**결과**: 수정되지 않았습니다. UI에 여전히 쓸모없는 $0 항목이 표시됩니다.

### 2021: 샌드박스 환경 오류 {#2021-sandbox-environment-failures}

2021년 11월, PayPal 샌드박스 환경에서 다음과 같은 심각한 문제가 보고되었습니다.

* 샌드박스 비밀 API 키가 무작위로 변경되어 비활성화되었습니다.
* 모든 샌드박스 테스트 계정이 예고 없이 삭제되었습니다.
* 샌드박스 계정 세부 정보를 확인하려고 할 때 오류 메시지가 표시됩니다.
* 간헐적인 로딩 실패

> 어떤 이유에서인지 샌드박스 비밀 API 키가 변경되어 비활성화되었습니다. 또한 이전 샌드박스 테스트 계정도 모두 삭제되었습니다.

> 가끔은 잘 로드되고, 가끔은 잘 안 로드되더라고요. 정말 답답하네요.

**결과**: 응답도 없고 해결책도 없습니다. 개발자들은 여전히 샌드박스 안정성 문제에 직면해 있습니다.

### 2021: 보고서 시스템이 완전히 고장났습니다. {#2021-reports-system-completely-broken}

2021년 5월, PayPal의 거래 보고서 다운로드 시스템이 완전히 고장났다고 보고했습니다.

> 다운로드 보고 기능이 현재 작동하지 않는 것 같고, 하루 종일 작동하지 않았습니다. 실패하면 이메일 알림을 받아야 할 것 같습니다.

또한 우리는 세션 관리 재앙에 대해서도 지적했습니다.

> PayPal에 로그인한 상태에서 5분 정도 활동이 없으면 로그아웃됩니다. 그래서 상태를 확인하고 싶은 보고서 옆에 있는 버튼을 다시 새로 고침하면 (영원히 기다린 후에) 다시 로그인해야 하는 번거로움이 있습니다.

Mark Stuart는 세션 시간 초과 문제를 인정했습니다.

> 과거에 IDE와 developer.paypal.com 또는 판매자 대시보드 사이를 전환하는 동안 세션이 자주 만료되어 개발 흐름이 방해를 받고, 다시 돌아와서 다시 로그아웃되는 현상이 발생했다고 보고하신 적이 있습니다.

**결과**: 세션 시간 초과는 여전히 60초입니다. 보고 시스템은 여전히 정기적으로 실패합니다.

### 2022: 핵심 API 기능 누락(다시) {#2022-core-api-feature-missing-again}

2022년 1월에 우리는 구독 목록 문제를 다시 확대했는데, 이번에는 해당 문서가 어떻게 잘못되었는지에 대한 자세한 내용을 전달했습니다.

> 모든 구독(이전에는 청구 계약이라고 함)을 나열하는 GET이 없습니다.

우리는 그들의 공식 문서가 완전히 부정확하다는 것을 발견했습니다.

> API 문서도 완전히 부정확합니다. 하드코딩된 구독 ID 목록을 다운로드하면 해결될 거라고 생각했지만, 그것도 소용없습니다!

> 여기 공식 문서에 따르면... 이렇게 할 수 있다고 나와 있지만, 문제는 어디에도 체크할 수 있는 "구독 ID" 필드가 전혀 없다는 것입니다.

PayPal의 Christina Monti가 다음과 같이 답변했습니다.

> 이러한 단계가 잘못되어 실망을 드린 점 사과드립니다. 이 문제는 이번 주에 해결하겠습니다.

Sri Shivananda(CTO)가 우리에게 감사를 표했습니다.

> 저희를 더 나은 곳으로 만들어 주시는 데 지속적으로 도움을 주셔서 감사합니다. 정말 감사합니다.

**결과**: 문서가 수정되지 않았습니다. 구독 목록 엔드포인트가 생성되지 않았습니다.

## 개발자 경험의 악몽 {#the-developer-experience-nightmare}

PayPal API를 사용하는 것은 마치 10년 전으로 시간을 거슬러 올라가는 것과 같습니다. 저희가 기록한 기술적 문제는 다음과 같습니다.

### 사용자 인터페이스가 손상되었습니다. {#broken-user-interface}

PayPal 개발자 대시보드는 정말 엉망입니다. 저희가 매일 겪는 문제는 다음과 같습니다.

<figure>
<figcaption><div class="alert alert-danger small text-center">
페이팔 UI가 너무 엉망이라 알림 해제조차 할 수 없습니다.
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
사용 중인 브라우저가 비디오 태그를 지원하지 않습니다.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
개발자 대시보드는 말 그대로 슬라이더를 드래그하게 하고 60초 후에 로그아웃됩니다.
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
사용 중인 브라우저는 비디오 태그를 지원하지 않습니다.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
PayPal 개발자 인터페이스의 UI 오류로 인해 워크플로가 손상되는 현상이 더 많이 발생했습니다.
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
브라우저가 비디오 태그를 지원하지 않습니다.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
구독 관리 인터페이스 - 인터페이스가 너무 형편없어서 제품과 구독 플랜을 생성하기 위해 코드에 의존해야 했습니다.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="PayPal subscriptions screenshot" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
기능이 누락된 고장난 구독 인터페이스의 모습입니다(제품/플랜/구독을 쉽게 생성할 수 없으며, UI에서 생성한 제품이나 플랜을 삭제할 방법도 전혀 없는 듯합니다).
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="PayPal subscriptions screenshot 2" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
일반적인 PayPal 오류 메시지 - 이해하기 어렵고 도움이 되지 않음
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### SDK 문제 {#sdk-problems}

* 스크립트 태그를 사용하여 SDK를 다시 로드하는 동안 버튼을 교체하고 다시 렌더링하는 복잡한 방법 없이는 일회성 결제와 구독을 모두 처리할 수 없습니다.
* JavaScript SDK가 기본 규칙(소문자 클래스 이름, 인스턴스 확인 안 함)을 위반합니다.
* 오류 메시지에 누락된 필드가 표시되지 않습니다.
* 일관되지 않은 데이터 유형(숫자 대신 문자열 금액 필요)

### 콘텐츠 보안 정책 위반 {#content-security-policy-violations}

해당 SDK는 CSP에서 unsafe-inline 및 unsafe-eval을 요구하여 **사이트 보안을 손상시키게 됩니다**.

### 문서 혼란 {#documentation-chaos}

마크 스튜어트 자신도 이렇게 인정했습니다.

> 레거시 API와 새로운 API가 엄청나게 많다는 점에는 동의합니다. (여기서 일하는 저희조차도) 무엇을 찾아야 할지 찾기가 정말 어렵습니다.

### 보안 취약점 {#security-vulnerabilities}

**PayPal의 2FA 구현 방식이 역방향입니다**. TOTP 앱을 활성화하더라도 SMS 인증을 강제로 실행하여 계정이 SIM 스왑 공격에 취약해집니다. TOTP를 활성화한 경우, PayPal은 TOTP만 사용해야 합니다. 대체 수단은 SMS가 아닌 이메일이어야 합니다.

### 세션 관리 재해 {#session-management-disaster}

**개발자 대시보드는 60초 동안 아무런 활동이 없으면 로그아웃됩니다.** 생산적인 작업을 하려고 해도 로그인 → 캡차 → 2FA → 로그아웃 → 반복되는 과정을 반복하게 됩니다. VPN을 사용하시나요? 행운을 빕니다.

## 2025년 7월: 마지막 결정타 {#july-2025-the-final-straw}

11년 동안 같은 문제를 겪다가, 정기적인 계정 이전 과정에서 결정적인 문제가 발생했습니다. 회사명인 "Forward Email LLC"와 일치하도록 새 PayPal 계정으로 전환해야 했기 때문입니다. 회계 처리가 더욱 깔끔해졌습니다.

간단해야 할 일이 완전한 재앙으로 바뀌었습니다.

* 초기 테스트 결과 모든 것이 정상적으로 작동하는 것으로 확인되었습니다.
* 몇 시간 후, PayPal은 예고 없이 모든 구독 결제를 갑자기 차단했습니다.
* 고객이 결제할 수 없어 혼란과 지원 부담이 발생했습니다.
* PayPal 지원팀은 계정이 인증되었다고 주장하며 모순된 답변을 제공했습니다.
* PayPal 결제를 완전히 중단해야 했습니다.

<figure>
<figcaption><div class="alert alert-danger small text-center">
고객이 결제를 시도할 때 발생한 오류 - 설명도, 기록도, 아무것도
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
PayPal 지원팀은 모든 것이 괜찮다고 주장했지만 결제는 완전히 중단되었습니다. 마지막 메시지는 "일부 기능을 복구했다"고 하면서도 여전히 구체적인 정보를 요구하고 있습니다. 전형적인 PayPal 지원 방식입니다.
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
아무것도 "고치지" 않았다고 주장하는 신원 확인 절차
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
모호한 메시지와 여전히 해결책이 없습니다. 필요한 추가 정보에 대한 정보나 공지, 그 어떤 것도 없습니다. 고객 지원은 아무런 연락도 받지 못했습니다.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>

## 왜 PayPal을 그냥 폐기할 수 없는가 {#why-we-cant-just-drop-paypal}

이러한 모든 문제에도 불구하고, 일부 고객은 PayPal만 결제 수단으로 사용하고 있기 때문에 PayPal을 완전히 포기할 수는 없습니다. 한 고객이 [상태 페이지](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515)에서 다음과 같이 말씀하셨습니다.

> PayPal이 내 유일한 결제 수단이에요

**PayPal이 특정 사용자를 대상으로 결제 독점을 만들어냈기 때문에 우리는 망가진 플랫폼을 지원하는 데 갇혔습니다.**

## 커뮤니티 해결 방법 {#the-community-workaround}

PayPal이 기본적인 구독 목록 기능을 제공하지 않기 때문에 개발자 커뮤니티에서 해결책을 마련했습니다. PayPal 구독 관리에 도움이 되는 스크립트인 [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)을 만들었습니다.

이 스크립트는 개발자들이 솔루션을 공유하는 [커뮤니티 요점](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4)을 참조합니다. 실제로 사용자는 PayPal이 몇 년 전에 구축했어야 할 것을 제공한 [우리에게 감사하다](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775)입니다.

## 피싱으로 인한 PayPal 템플릿 차단 {#blocking-paypal-templates-due-to-phishing}

문제는 API에만 국한되지 않습니다. PayPal의 이메일 템플릿은 너무 형편없어서 피싱 시도와 구분이 불가능할 정도로 이메일 서비스에 특정 필터링 기능을 구현해야 했습니다.

### 실제 문제: PayPal 템플릿은 사기처럼 보입니다. {#the-real-problem-paypals-templates-look-like-scams}

저희는 피싱 시도와 똑같이 보이는 PayPal 이메일에 대한 신고를 정기적으로 받고 있습니다. 다음은 저희가 신고한 실제 사례입니다.

**제목:** `[Sandbox] TEST - New invoice from PaypalBilling434567 sandbox #A4D369E8-0001`

이 이메일은 피싱 시도로 추정되어 `abuse@microsoft.com`으로 전달되었습니다. 문제는 PayPal의 샌드박스 환경에서 전송된 것이었지만, 템플릿 디자인이 너무 열악해서 피싱 탐지 시스템이 작동한다는 것입니다.

### 구현 {#our-implementation}

[이메일 필터링 코드](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172)에 구현된 PayPal 관련 필터링을 확인할 수 있습니다.

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

### PayPal을 차단해야 했던 이유 {#why-we-had-to-block-paypal}

PayPal의 침해 신고팀에 여러 차례 신고했음에도 불구하고, PayPal이 심각한 스팸/피싱/사기 문제를 해결하지 않아 이 조치를 시행했습니다. 저희가 차단하는 구체적인 이메일 유형은 다음과 같습니다.

* **RT000238** - 의심스러운 송장 알림
* **PPC001017** - 문제가 있는 결제 확인
* **RT000542** - 선물 메시지 해킹 시도

### 문제의 규모 {#the-scale-of-the-problem}

저희 스팸 필터링 로그를 보면 매일 처리되는 엄청난 양의 PayPal 청구서 스팸을 확인할 수 있습니다. 차단된 제목의 예는 다음과 같습니다.

* "PayPal 청구팀 송장: 이 금액은 고객님의 계좌에서 자동 출금됩니다. \[전화번호]로 즉시 문의해 주세요."
* "\[회사명] (\[주문 ID]) 송장"
* 전화번호가 다르거나 주문 ID가 위조된 여러 가지 변형이 있습니다.

이러한 이메일은 종종 `outlook.com` 호스트에서 발송되지만, PayPal의 합법적인 시스템에서 발송된 것으로 보이기 때문에 특히 위험합니다. 이러한 이메일은 PayPal의 실제 인프라를 통해 전송되므로 SPF, DKIM 및 DMARC 인증을 통과합니다.

당사의 기술 로그에 따르면 이러한 스팸 이메일에는 합법적인 PayPal 헤더가 포함되어 있습니다.

* `X-Email-Type-Id: RT000238` (차단하는 ID와 동일)
* `From: "service@paypal.com" <service@paypal.com>`
* `paypal.com`의 유효한 DKIM 서명
* PayPal 메일 서버를 표시하는 적절한 SPF 레코드

이로 인해 불가능한 상황이 발생합니다. 합법적인 PayPal 이메일과 스팸은 모두 동일한 기술적 특성을 가지고 있습니다.

### 아이러니 {#the-irony}

금융 사기 근절을 선도해야 할 PayPal의 이메일 템플릿은 너무 조악하게 설계되어 피싱 방지 시스템을 작동시킵니다. 정상적인 PayPal 이메일은 사기와 구별이 불가능하기 때문에 차단해야 합니다.

이는 보안 연구에 기록되어 있습니다: [PayPal 신규 주소 사기에 주의하세요](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) - PayPal의 자체 시스템이 사기에 어떻게 악용되는지 보여줍니다.

### 실제 영향: 새로운 PayPal 사기 {#real-world-impact-novel-paypal-scams}

문제는 단순히 부실한 템플릿 디자인에만 국한되지 않습니다. PayPal의 송장 시스템은 매우 쉽게 악용되어 사기꾼들이 정기적으로 이를 악용하여 합법적인 것처럼 보이는 사기성 송장을 발송합니다. 보안 연구원 개빈 앤더렉은 사기꾼들이 모든 인증 검사를 통과한 실제 PayPal 송장을 발송하는 [새로운 페이팔 사기](https://anderegg.ca/2023/02/01/a-novel-paypal-scam) 취약점을 발견했습니다.

> "발신지를 확인해 보니, 이메일은 실제로 PayPal에서 보낸 것처럼 보였습니다(SPF, DKIM, DMARC 모두 통과). 버튼은 정상적인 PayPal URL처럼 보이는 곳으로 연결되었습니다... 이메일이 정상이라는 것을 깨닫는 데는 시간이 좀 걸렸습니다. 사기꾼에게서 무작위 '청구서'를 받았던 것입니다."

<figure>
<figcaption><div class="alert alert-danger small text-center">
받은 편지함에 여러 건의 사기성 PayPal 송장이 넘쳐나는 모습을 보여주는 스크린샷입니다. 모두 PayPal 시스템에서 발송되었기 때문에 정상적인 것처럼 보입니다.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="PayPal scam warning screenshot" class="rounded-lg" />
</figure>

연구자는 다음과 같이 언급했습니다.

> "PayPal이 이 기능을 폐쇄하는 것을 고려해야 할 것 같습니다. 저는 이것이 일종의 사기라고 즉시 생각했고 기술적인 세부 사항에만 관심이 있었습니다. 너무 쉽게 해낼 수 있어서 다른 사람들이 속을까 봐 걱정됩니다."

이는 문제를 완벽하게 보여줍니다. PayPal의 합법적인 시스템은 너무나 형편없이 설계되어 사기를 가능하게 하는 동시에 합법적인 의사소통을 의심스럽게 보이게 만듭니다.

문제를 더욱 악화시키는 것은 이로 인해 야후에 대한 당사의 납품성이 영향을 받아 고객 불만이 발생하고 꼼꼼한 테스트와 패턴 검사에 많은 시간이 소요된다는 점입니다.

## PayPal의 역방향 KYC 프로세스 {#paypals-backwards-kyc-process}

PayPal 플랫폼의 가장 큰 단점 중 하나는 규정 준수 및 고객알기제도(KYC) 절차에 대한 후진적인 접근 방식입니다. 다른 결제 처리업체와 달리 PayPal은 개발자가 API를 통합하고 적절한 검증을 완료하기 전에 프로덕션 환경에서 결제를 수집할 수 있도록 허용합니다.

### 작동 방식 {#how-it-should-work}

모든 합법적인 결제 처리업체는 다음과 같은 논리적 순서를 따릅니다.

1. **먼저 KYC 인증을 완료하세요**
2. **판매자 계정을 승인하세요**
3. **프로덕션 API 액세스를 제공하세요**
4. **결제 수금을 허용하세요**

이를 통해 돈이 주고받기 전에 규정 준수를 보장하여 결제 처리자와 판매자 모두를 보호합니다.

### PayPal의 실제 작동 방식 {#how-paypal-actually-works}

PayPal의 프로세스는 완전히 반대입니다.

1. **즉시 프로덕션 API 접근 권한 제공**
2. **몇 시간 또는 며칠 동안 결제 수금 허용**
3. **예고 없이 갑자기 결제 차단**
4. **고객에게 이미 영향을 미친 후 KYC 문서 제출 요구**
5. **판매자에게 사전 통지 없음**
6. **고객이 문제를 발견하고 보고하도록 함**

### 실제 세계에 미치는 영향 {#the-real-world-impact}

이러한 역방향 프로세스는 기업에 재앙을 초래합니다.

* **고객이 성수기 구매를 완료할 수 없음**
* **사전 알림 없음**, 확인 필요
* **결제 차단 시 이메일 알림 없음**
* **가맹점은 혼란스러워하는 고객을 통해 문제점을 파악**
* **중요 영업 기간 중 **매출 손실**
* **의미 없는 결제 실패 시 고객 신뢰 손상**

### 2025년 7월 계정 마이그레이션 재해 {#the-july-2025-account-migration-disaster}

2025년 7월 정기 계좌 이전 과정에서 이와 같은 상황이 발생했습니다. PayPal은 처음에는 결제를 허용했지만, 갑자기 아무런 공지 없이 결제를 차단했습니다. 고객들이 결제가 불가능하다고 신고하기 시작하면서야 문제를 발견했습니다.

고객 지원팀에 문의했지만, 필요한 서류에 대해 상반된 답변을 받았고, 해결까지 명확한 일정도 제시되지 않았습니다. 이로 인해 PayPal 결제를 완전히 중단해야 했고, 다른 결제 수단이 없는 고객들에게 혼란을 초래했습니다.

### 이것이 중요한 이유 {#why-this-matters}

PayPal의 규정 준수 방식은 기업 운영 방식에 대한 근본적인 오해를 보여줍니다. 적절한 KYC는 고객이 결제를 시도한 후가 아니라 실제 운영 통합 **이전**에 이루어져야 합니다. 문제 발생 시 적극적인 소통의 부재는 PayPal이 판매자의 요구와 동떨어져 있음을 보여줍니다.

이런 역행적 과정은 PayPal의 전반적인 조직적 문제를 잘 보여줍니다. PayPal은 판매자와 고객 경험보다 내부 프로세스를 우선시하여 기업이 해당 플랫폼에서 이탈하는 등의 운영적 재앙을 초래합니다.

## 다른 모든 결제 처리업체가 올바르게 처리하는 방법 {#how-every-other-payment-processor-does-it-right}

PayPal이 구현을 거부하는 구독 목록 기능은 10년 넘게 업계 표준으로 자리 잡았습니다. 다른 결제 처리업체들이 이 기본적인 요구 사항을 처리하는 방식은 다음과 같습니다.

### 스트라이프 {#stripe}

Stripe는 API 출시 이후 구독 목록을 제공해 왔습니다. Stripe 설명서에는 고객 또는 판매자 계정의 모든 구독을 검색하는 방법이 명확하게 설명되어 있습니다. 이는 기본적인 CRUD 기능으로 간주됩니다.

### 패들 {#paddle}

Paddle은 목록, 필터링, 페이지 매김 기능을 포함한 포괄적인 구독 관리 API를 제공합니다. Paddle은 판매자가 반복적인 수익 흐름을 확인해야 한다는 점을 잘 알고 있습니다.

### 코인베이스 커머스 {#coinbase-commerce}

Coinbase Commerce와 같은 암호화폐 결제 프로세서조차 PayPal보다 더 나은 구독 관리 기능을 제공합니다.

### 사각형 {#square}

Square의 API에는 구독 목록이 추가된 것이 아니라 기본 기능으로 포함되어 있습니다.

### 업계 표준 {#the-industry-standard}

모든 최신 결제 프로세서는 다음을 제공합니다.

* 모든 구독 목록
* 상태, 날짜, 고객별 필터링
* 대용량 데이터세트 페이지 매김
* 구독 변경 시 웹훅 알림
* 작업 예제를 포함한 포괄적인 설명서

### 다른 프로세서가 제공하는 것과 PayPal의 비교 {#what-other-processors-provide-vs-paypal}

**Stripe - 모든 구독 목록:**

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

**PayPal - 실제로 얻는 것:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# You can ONLY get ONE subscription if you already know the ID
# There is NO endpoint to list all subscriptions
# There is NO way to search or filter
# You must track all subscription IDs yourself
```

**PayPal의 사용 가능한 엔드포인트:**

* `POST /v1/billing/subscriptions` - 구독 생성
* `GET /v1/billing/subscriptions/{id}` - 구독 1개 생성(ID를 아는 경우)
* `PATCH /v1/billing/subscriptions/{id}` - 구독 업데이트
* `POST /v1/billing/subscriptions/{id}/cancel` - 구독 취소
* `POST /v1/billing/subscriptions/{id}/suspend` - 구독 일시 중지

**PayPal에서 누락된 것:**

* ❌ `GET /v1/billing/subscriptions` (전체 목록) 없음
* ❌ 검색 기능 없음
* ❌ 상태, 고객, 날짜별 필터링 없음
* ❌ 페이지 매김 기능 없음

PayPal은 개발자가 자체 데이터베이스에서 구독 ID를 수동으로 추적하도록 강제하는 유일한 주요 결제 처리업체입니다.

## PayPal의 조직적 은폐: 600만 명의 목소리를 침묵시키다 {#paypals-systematic-cover-up-silencing-6-million-voices}

PayPal이 비판을 처리하는 방식을 완벽하게 요약한 조치로, PayPal은 최근 커뮤니티 포럼 전체를 오프라인으로 전환하여 600만 명이 넘는 회원을 사실상 침묵시키고 실패를 기록한 수십만 개의 게시물을 삭제했습니다.

### 대지우기 {#the-great-erasure}

`paypal-community.com`의 초기 PayPal 커뮤니티는 **6,003,558명의 회원**을 보유하고 있었으며, PayPal API 오류에 대한 수십만 건의 게시물, 버그 리포트, 불만 사항 및 토론이 오고 갔습니다. 이는 10년 이상 PayPal의 체계적인 문제에 대한 문서화된 증거였습니다.

2025년 6월 30일, PayPal은 조용히 포럼 전체를 오프라인으로 전환했습니다. 모든 `paypal-community.com` 링크가 이제 404 오류를 반환합니다. 이는 마이그레이션이나 업그레이드가 아니었습니다.

### 제3자 구조 {#the-third-party-rescue}

다행히 [ppl.lithium.com](https://ppl.lithium.com/)의 제3자 서비스가 일부 콘텐츠를 보존하여 PayPal이 숨기려 했던 논의 내용을 확인할 수 있었습니다. 하지만 이 제3자 보존 서비스는 불완전하며 언제든지 사라질 수 있습니다.

PayPal의 이러한 증거 은폐 행태는 새로운 것이 아닙니다. PayPal은 다음과 같은 기록된 이력을 가지고 있습니다.

* 중요 버그 보고서를 공개 목록에서 삭제
* 사전 고지 없이 개발자 도구 중단
* 적절한 문서 없이 API 변경
* 커뮤니티에서 발생한 오류에 대한 논의 중단

포럼 폐쇄는 대중의 감시로부터 체계적인 실패를 숨기려는 지금까지의 가장 노골적인 시도입니다.

## 11년간의 포획 버그 재앙: 1,899달러 이상 계속 증가 {#the-11-year-capture-bug-disaster-1899-and-counting}

PayPal이 피드백 세션을 준비하고 약속을 지키느라 바빴던 동안, 핵심 결제 처리 시스템은 11년 넘게 근본적으로 고장이 났습니다. 그 증거는 참혹하기 그지없습니다.

### 이메일 전달로 인한 $1,899 손실 {#forward-emails-1899-loss}

저희 운영 시스템에서는 PayPal의 결제 오류로 인해 총 **$1,899**에 달하는 108건의 PayPal 결제가 손실된 것을 발견했습니다. 이 결제 건들은 다음과 같은 일관된 패턴을 보입니다.

* `CHECKOUT.ORDER.APPROVED` 웹훅이 수신되었습니다.
* PayPal 캡처 API에서 404 오류가 반환되었습니다.
* PayPal API를 통해 주문에 접근할 수 없게 되었습니다.

PayPal은 14일 후에 디버그 로그를 완전히 숨기고, 캡처되지 않은 주문 ID에 대한 모든 데이터를 대시보드에서 지우므로 고객에게 요금이 청구되었는지 확인하는 것은 불가능합니다.

이는 단 하나의 사업체에 대한 사례일 뿐입니다. **11년 이상 수천 개 가맹점에서 발생한 총 손실액은 수백만 달러에 달할 것으로 추정됩니다.**

**다시 한번 말씀드리겠습니다. 11년 이상 수천 개 상인이 입은 총 손실은 수백만 달러에 달할 것으로 추정됩니다.**

우리가 이것을 발견한 유일한 이유는 우리가 놀라울 정도로 꼼꼼하고 데이터에 기반을 두고 있기 때문입니다.

### 2013년 원본 보고서: 11년 이상의 부주의 {#the-2013-original-report-11-years-of-negligence}

이 문제에 대한 가장 초기의 문서화된 보고서는 [2013년 11월 Stack Overflow](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)([보관됨](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture))에 나타납니다.

> "캡처를 수행할 때 REST API에서 404 오류가 계속 발생합니다."

2013년에 보고된 오류는 2024년에 Forward Email에서 발생한 오류와 **동일합니다**.

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

2013년 지역 사회의 반응은 다음과 같았습니다.

> "현재 REST API에 문제가 보고되었습니다. PayPal에서 해결 중입니다."

**11년이 지난 지금도 그들은 여전히 "그것을 위해 노력하고 있습니다."**

### 2016년 입장: PayPal이 자체 SDK를 망가뜨렸다 {#the-2016-admission-paypal-breaks-their-own-sdk}

2016년, PayPal의 GitHub 저장소에는 [대규모 캡처 실패](https://github.com/paypal/PayPal-PHP-SDK/issues/660) 취약점이 공식 PHP SDK에 영향을 미치는 것으로 기록되어 있었습니다. 그 규모는 엄청났습니다.

> "2016년 9월 20일 이후 모든 PayPal 캡처 시도가 'INVALID_RESOURCE_ID - 요청된 리소스 ID를 찾을 수 없습니다.'라는 오류 메시지와 함께 실패했습니다. 9월 19일부터 9월 20일까지 API 통합에 아무런 변경 사항이 없었습니다. **9월 20일 이후 모든 캡처 시도에서 이 오류가 반환되었습니다.**"

한 상인은 이렇게 보고했습니다.

> "지난 24시간 동안 **1,400회 이상의 캡처 시도가 실패했습니다.** 모두 INVALID_RESOURCE_ID 오류 응답과 함께 발생했습니다."

PayPal의 초기 대응은 판매자에게 책임을 전가하고 기술 지원팀에 문의하는 것이었습니다. 엄청난 압력이 가해진 후에야 PayPal은 잘못을 인정했습니다.

> "제품 개발자로부터 업데이트가 있습니다. 전송되는 헤더에서 PayPal 요청 ID가 42자로 전송되고 있다는 것을 확인했습니다. **최근 변경으로 인해 이 ID가 38자로 제한되는 것 같습니다.**"

이러한 인정은 PayPal의 조직적인 과실을 드러냅니다.

1. **문서화되지 않은 주요 변경 사항을 적용했습니다.**
2. **자체 공식 SDK를 손상시켰습니다.**
3. **먼저 가맹점을 비난했습니다.**
4. **압박을 받았을 때만 잘못을 인정했습니다.**

문제를 "해결"한 후에도 상인들은 다음과 같이 보고했습니다.

> "SDK를 v1.7.4로 업그레이드했지만 **문제가 여전히 발생합니다.**"

### 2024년 에스컬레이션: 여전히 깨짐 {#the-2024-escalation-still-broken}

보존된 PayPal 커뮤니티의 최근 보고서에 따르면 문제가 실제로 악화된 것으로 나타났습니다. [2024년 9월 토론](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)([보관됨](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093))은 동일한 문제를 기록하고 있습니다.

> "이 문제는 약 2주 전부터 발생하기 시작했으며 모든 주문에 영향을 미치는 것은 아닙니다. **더 흔한 문제는 캡처 시 발생하는 404 오류인 것 같습니다.**"

판매자는 Forward Email에서 발생한 동일한 패턴을 다음과 같이 설명합니다.

> "PayPal에서 주문을 캡처하려고 시도한 후 404를 반환합니다. 주문 세부 정보를 검색할 때: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **당사 측에서 성공적으로 캡처했다는 흔적이 전혀 없습니다.**"

### 웹훅 안정성 재해 {#the-webhook-reliability-disaster}

또 다른 [보존된 커뮤니티 토론](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446)은 PayPal의 웹훅 시스템이 근본적으로 신뢰할 수 없다는 것을 보여줍니다.

> "이론적으로는 Webhook 이벤트에서 두 가지 이벤트(CHECKOUT.ORDER.APPROVED 및 PAYMENT.CAPTURE.COMPLETED)가 발생해야 합니다. 하지만 실제로 **이 두 이벤트는 즉시 수신되는 경우가 드물고, PAYMENT.CAPTURE.COMPLETED는 대부분 수신되지 않거나 몇 시간 후에 수신됩니다.**"

구독 결제의 경우:

> "**'PAYMENT.SALE.COMPLETED'가 수신되지 않거나 몇 시간 후까지 수신되지 않는 경우가 있습니다.**"

상인의 질문은 PayPal의 신뢰성 문제가 얼마나 심각한지를 보여줍니다.

1. **"왜 이런 일이 발생하나요?"** - PayPal의 웹훅 시스템이 근본적으로 고장났습니다.
2. **"주문 상태가 '완료'이면 돈을 받은 것으로 간주해도 되나요?"** - 판매자가 PayPal의 API 응답을 신뢰할 수 없습니다.
3. **"'이벤트 로그->웹훅 이벤트'에서 로그를 찾을 수 없는 이유는 무엇인가요?"** - PayPal 자체 로깅 시스템조차 작동하지 않습니다.

### 체계적 과실의 패턴 {#the-pattern-of-systematic-negligence}

증거는 11년 이상에 걸쳐 수집되었으며 명확한 패턴을 보여줍니다.

* **2013**: "PayPal에서 문제 해결 중"
* **2016**: PayPal에서 중대한 변경 사항(breaking change)을 인정하고, 수정 사항을 제공함
* **2024**: 동일한 오류가 여전히 발생하여 Forward Email을 비롯한 수많은 서비스에 영향을 미침

이는 버그가 아닙니다. **이는 체계적인 과실입니다.** PayPal은 10년 이상 이러한 심각한 결제 처리 실패에 대해 알고 있었으며 지속적으로 다음을 수행했습니다.

1. **PayPal 버그에 대해 가맹점 탓으로 돌림**
2. **문서화되지 않은 중대한 변경 사항 적용**
3. **작동하지 않는 부적절한 수정 제공**
4. **기업에 미치는 재정적 영향 무시**
5. **커뮤니티 포럼 폐쇄로 증거 은폐**

### 문서화되지 않은 요구 사항 {#the-undocumented-requirement}

PayPal 공식 문서 어디에도 판매자가 캡처 작업을 위한 재시도 로직을 구현해야 한다는 내용은 없습니다. PayPal 문서에는 판매자가 "승인 후 즉시 캡처"해야 한다고 명시되어 있지만, API가 무작위로 404 오류를 반환하여 복잡한 재시도 메커니즘을 필요로 한다는 사실은 언급되어 있지 않습니다.

이로 인해 모든 상인은 다음을 수행해야 합니다.

* 지수 백오프 재시도 로직 구현
* 일관되지 않은 웹훅 전달 처리
* 복잡한 상태 관리 시스템 구축
* 실패한 캡처 수동 모니터링

**다른 모든 결제 처리업체는 처음부터 작동하는 안정적인 캡처 API를 제공합니다.**

## PayPal의 광범위한 사기 패턴 {#paypals-broader-pattern-of-deception}

캡처 버그 사태는 PayPal이 고객을 속이고 실패를 숨기기 위해 체계적으로 접근하는 방법 중 하나에 불과합니다.

### 뉴욕 금융 서비스부 조치 {#the-new-york-department-of-financial-services-action}

2025년 1월, 뉴욕 금융서비스부는 사기 행위에 대한 [PayPal에 대한 강제 조치](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf) 경고를 발표하여 PayPal의 사기 행각이 API를 훨씬 넘어 확장되었음을 보여주었습니다.

이번 규제 조치는 PayPal이 개발자 도구뿐만 아니라 전체 사업에 걸쳐 사기성 행위를 저지르려는 의지를 보여줍니다.

### 허니 소송: 제휴 링크 재작성 {#the-honey-lawsuit-rewriting-affiliate-links}}

PayPal이 Honey를 인수하면서 콘텐츠 제작자와 인플루언서의 수수료를 가로채는 [Honey가 제휴 링크를 다시 작성했다는 소송](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer) 문제가 발생했습니다. 이는 PayPal이 다른 사람에게 돌아가야 할 수익을 다른 곳으로 돌려 이익을 취하는 또 다른 형태의 조직적인 사기 행각입니다.

패턴은 명확합니다.

1. **API 오류**: 손상된 기능 숨기고 판매자 탓으로 돌리기
2. **커뮤니티 침묵**: 문제의 증거 없애기
3. **규제 위반**: 사기 행위
4. **제휴사 절도**: 기술적 조작을 통한 수수료 횡령

### PayPal의 과실로 인한 비용 {#the-cost-of-paypals-negligence}

포워드 이메일의 1,899달러 손실은 빙산의 일각에 불과합니다. 더 광범위한 영향을 생각해 보세요.

* **개인 판매자**: 수천 명의 판매자가 각각 수백 달러에서 수천 달러의 손실을 입었습니다.
* **기업 고객**: 수백만 달러의 잠재적 매출 손실
* **개발자 시간**: PayPal의 손상된 API를 해결하기 위한 해결책을 구축하는 데 수많은 시간이 소요되었습니다.
* **고객 신뢰**: PayPal의 결제 실패로 인해 고객을 잃는 기업

소규모 이메일 서비스 하나가 2,000달러에 가까운 손실을 입었고, 이 문제가 11년 이상 지속되어 수천 개의 판매자에게 영향을 미쳤다면, 전체 재정적 피해는 **수억 달러**에 달할 가능성이 큽니다.

### 문서의 거짓말 {#the-documentation-lie}

PayPal 공식 문서에는 판매자가 직면하게 될 심각한 제약과 버그에 대한 언급이 계속해서 누락되어 있습니다. 예를 들어 다음과 같습니다.

* **캡처 API**: 404 오류가 흔하며 재시도 로직이 필요하다는 언급이 없습니다.
* **웹훅 안정성**: 웹훅이 몇 시간씩 지연되는 경우가 많다는 언급이 없습니다.
* **구독 등록**: 설명서에는 엔드포인트가 없어도 등록이 가능하다고 명시되어 있습니다.
* **세션 시간 초과**: 공격적인 60초 시간 초과에 대한 언급이 없습니다.

중요한 정보가 체계적으로 누락되면서 판매자는 생산 시스템에서 시행착오를 거쳐 PayPal의 한계를 발견하게 되고, 이는 종종 재정적 손실로 이어집니다.

## 개발자에게 의미하는 바 {#what-this-means-for-developers}

PayPal이 광범위한 피드백을 수집하면서도 기본적인 개발자 요구 사항을 충족하지 못하는 것은 근본적인 조직적 문제를 보여줍니다. 그들은 피드백 수집을 실제 문제 해결의 대안으로 여깁니다.

패턴은 명확합니다.

1. 개발자들이 문제를 보고함
2. PayPal, 임원진과 피드백 세션 개최
3. 광범위한 피드백 제공
4. 팀들이 부족한 부분을 인정하고 "추적 및 해결"을 약속
5. 아무것도 실행되지 않음
6. 임원들이 더 나은 회사로 이직
7. 새로운 팀들이 동일한 피드백을 요구
8. 악순환의 반복

그 사이 개발자들은 결제를 받기 위해 해결책을 만들고, 보안을 약화시키고, 깨진 UI를 다루어야만 했습니다.

결제 시스템을 구축하고 있다면 저희의 경험을 참고하십시오. 여러 프로세서를 갖춘 [트리펙타 접근법](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal)을 구축하되, PayPal이 필요한 기본 기능을 제공할 것이라고 기대하지 마십시오. 처음부터 차선책을 구축할 계획을 세우십시오.

> 이 게시물은 Forward Email에서 PayPal API를 11년간 사용해 온 경험을 담고 있습니다. 모든 코드 예시와 링크는 실제 운영 시스템에서 가져온 것입니다. 이러한 문제에도 불구하고 일부 고객에게는 다른 선택지가 없기 때문에 PayPal 결제를 계속 지원하고 있습니다.

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API disaster illustration" 클래스="둥근-lg" />