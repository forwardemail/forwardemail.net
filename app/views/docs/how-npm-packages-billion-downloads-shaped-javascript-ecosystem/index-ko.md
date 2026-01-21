# 10년의 영향: npm 패키지가 10억 다운로드를 달성하고 JavaScript에 영향을 미친 과정 {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" 클래스="둥근-lg" />

## 목차 {#table-of-contents}

* [머리말](#foreword)
* [우리를 신뢰하는 선구자들: Isaac Z. Schlueter와 Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [npm의 탄생부터 Node.js 리더십까지](#from-npms-creation-to-nodejs-leadership)
* [코드 뒤에 숨은 건축가: 닉 바우의 여정](#the-architect-behind-the-code-nick-baughs-journey)
  * [Express 기술위원회 및 핵심 기여](#express-technical-committee-and-core-contributions)
  * [Koa 프레임워크 기여](#koa-framework-contributions)
  * [개인 기여자에서 조직 리더로](#from-individual-contributor-to-organization-leader)
* [GitHub 조직: 혁신 생태계](#our-github-organizations-ecosystems-of-innovation)
  * [Cabin: 현대 애플리케이션을 위한 구조화된 로깅](#cabin-structured-logging-for-modern-applications)
  * [스팸 스캐너: 이메일 남용 방지](#spam-scanner-fighting-email-abuse)
  * [Bree: Worker Threads를 활용한 최신 작업 스케줄링](#bree-modern-job-scheduling-with-worker-threads)
  * [이메일 전달: 오픈 소스 이메일 인프라](#forward-email-open-source-email-infrastructure)
  * [Lad: 필수 Koa 유틸리티 및 도구](#lad-essential-koa-utilities-and-tools)
  * [Upptime: 오픈 소스 가동 시간 모니터링](#upptime-open-source-uptime-monitoring)
* [포워드 이메일 생태계에 대한 우리의 기여](#our-contributions-to-the-forward-email-ecosystem)
  * [패키지부터 생산까지](#from-packages-to-production)
  * [피드백 루프](#the-feedback-loop)
* [Forward Email의 핵심 원칙: 우수성을 위한 기반](#forward-emails-core-principles-a-foundation-for-excellence)
  * [항상 개발자 친화적이고 보안 중심적이며 투명합니다.](#always-developer-friendly-security-focused-and-transparent)
  * [시간에 검증된 소프트웨어 개발 원칙 준수](#adherence-to-time-tested-software-development-principles)
  * [끈기 있고 부트스트랩 방식으로 일하는 개발자를 타겟으로 삼다](#targeting-the-scrappy-bootstrapped-developer)
  * [실제 원칙: 전달 이메일 코드베이스](#principles-in-practice-the-forward-email-codebase)
  * [개인 정보 보호 설계](#privacy-by-design)
  * [지속 가능한 오픈 소스](#sustainable-open-source)
* [숫자는 거짓말하지 않습니다: 놀라운 npm 다운로드 통계](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [우리의 영향에 대한 조감도](#a-birds-eye-view-of-our-impact)
  * [규모에 따른 일일 영향](#daily-impact-at-scale)
  * [원시 숫자를 넘어서](#beyond-the-raw-numbers)
* [생태계 지원: 오픈 소스 후원](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [안드리스 라인만: 이메일 인프라 선구자](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: 유틸리티 패키지 마스터마인드](#sindre-sorhus-utility-package-mastermind)
* [JavaScript 생태계의 보안 취약점 발견](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [코아 라우터 구조](#the-koa-router-rescue)
  * [ReDoS 취약점 해결](#addressing-redos-vulnerabilities)
  * [Node.js 및 Chromium 보안 옹호](#advocating-for-nodejs-and-chromium-security)
  * [npm 인프라 보안](#securing-npm-infrastructure)
* [포워드 이메일 생태계에 대한 우리의 기여](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Nodemailer의 핵심 기능 향상](#enhancing-nodemailers-core-functionality)
  * [Mailauth를 사용한 이메일 인증 강화](#advancing-email-authentication-with-mailauth)
  * [주요 가동 시간 향상](#key-upptime-enhancements)
* [모든 것을 하나로 묶는 접착제: 규모에 맞는 사용자 정의 코드](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [대규모 개발 노력](#a-massive-development-effort)
  * [핵심 종속성 통합](#core-dependencies-integration)
  * [Tangerine 및 mx-connect를 사용한 DNS 인프라](#dns-infrastructure-with-tangerine-and-mx-connect)
* [엔터프라이즈 영향: 오픈 소스부터 미션 크리티컬 솔루션까지](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [미션 크리티컬 이메일 인프라 사례 연구](#case-studies-in-mission-critical-email-infrastructure)
* [오픈 소스 10년: 미래를 바라보며](#a-decade-of-open-source-looking-forward)

## 서문 {#foreword}

[자바스크립트](https://en.wikipedia.org/wiki/JavaScript) 및 [Node.js](https://en.wikipedia.org/wiki/Node.js) 환경에서는 매일 수백만 번 다운로드되고 전 세계 앱을 구동하는 필수 패키지가 있습니다. 이러한 도구 뒤에는 오픈 소스 품질에 집중하는 개발자들이 있습니다. 오늘은 저희 팀이 JavaScript 생태계의 핵심 요소가 된 npm 패키지를 어떻게 빌드하고 유지 관리하는지 보여드리겠습니다.

## 우리를 신뢰하는 선구자들: Isaac Z. Schlueter와 Forward Email {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

[아이작 Z. 슐루터](https://izs.me/)([GitHub: isaacs](https://github.com/isaacs))님이 저희 사용자로 참여하게 되어 자랑스럽습니다. Isaac은 [엔피엠](https://en.wikipedia.org/wiki/Npm_\(software\))를 개발하고 [Node.js](https://en.wikipedia.org/wiki/Node.js) 구축에 참여했습니다. Forward Email에 대한 Isaac의 신뢰는 저희가 품질과 보안에 중점을 두고 있음을 보여줍니다. Isaac은 izs.me를 포함한 여러 도메인에서 Forward Email을 사용하고 있습니다.

아이작은 자바스크립트에 지대한 영향을 미쳤습니다. 2009년, 그는 Node.js의 잠재력을 가장 먼저 알아본 사람 중 한 명으로, 이 플랫폼을 만든 [라이언 달](https://en.wikipedia.org/wiki/Ryan_Dahl)과 함께 일했습니다. 아이작은 [Increment 매거진 인터뷰](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/)에서 이렇게 말했습니다. "서버 사이드 자바스크립트를 구현하는 방법을 모색하는 사람들로 구성된 이 작은 커뮤니티에서, 라이언 달이 Node.js를 내놓았는데, 이는 분명 옳은 접근 방식이었습니다. 저는 Node.js에 제 모든 것을 쏟아부었고, 2009년 중반쯤부터 본격적으로 참여하게 되었습니다."

> \[!NOTE]
> Node.js의 역사에 관심 있는 분들을 위해 [Node.js의 이야기](https://www.youtube.com/watch?v=LB8KwiiUGy0)과 [Node.js에 대해 후회하는 10가지 - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I)를 포함하여 Node.js의 개발 과정을 기록한 훌륭한 다큐멘터리가 있습니다. Ryan Dahl의 [개인 웹사이트](https://tinyclouds.org/) 또한 그의 작업에 대한 귀중한 통찰력을 담고 있습니다.

### npm의 탄생부터 Node.js 리더십까지 {#from-npms-creation-to-nodejs-leadership}

Isaac은 2009년 9월에 npm을 개발했고, 2010년 초에 첫 번째 사용 가능한 버전을 출시했습니다. 이 패키지 관리자는 Node.js의 핵심 요구 사항을 충족하여 개발자가 코드를 쉽게 공유하고 재사용할 수 있도록 했습니다. [Node.js 위키피디아 페이지](https://en.wikipedia.org/wiki/Node.js)에 따르면, "2010년 1월, Node.js 환경을 위한 npm이라는 패키지 관리자가 도입되었습니다. 이 패키지 관리자는 프로그래머가 Node.js 패키지와 함께 제공되는 소스 코드를 게시하고 공유할 수 있도록 지원하며, 패키지의 설치, 업데이트 및 제거를 간소화하도록 설계되었습니다."

2012년 1월 Ryan Dahl이 Node.js에서 물러나자 Isaac이 프로젝트 리더를 맡았습니다. [그의 요약](https://izs.me/resume)에서 언급된 바와 같이, 그는 "CommonJS 모듈 시스템, 파일 시스템 API, 스트림을 포함한 여러 기본 Node.js 핵심 API 개발을 주도"했으며, "2년 동안 프로젝트의 BDFL(Benevolent Dictator For Life) 역할을 수행하며 Node.js 버전 v0.6부터 v0.10까지 끊임없이 향상되는 품질과 안정적인 빌드 프로세스를 보장"했습니다.

아이작은 Node.js가 중요한 성장기를 거치는 동안 이끌어 오늘날까지도 플랫폼의 근간을 이루는 기준을 확립했습니다. 이후 2014년에는 npm, Inc.를 설립하여 이전에 직접 운영했던 npm 레지스트리를 지원했습니다.

우리는 Isaac의 JavaScript 개발에 대한 큰 공헌에 감사하며, 그가 만든 많은 패키지를 계속 사용하고 있습니다. 그의 업적은 소프트웨어 개발 방식과 전 세계 수백만 명의 개발자가 코드를 공유하는 방식을 변화시켰습니다.

## 코드 뒤에 숨은 건축가: Nick Baugh의 여정 {#the-architect-behind-the-code-nick-baughs-journey}

오픈 소스 성공의 중심에는 Forward Email의 창립자이자 소유주인 Nick Baugh가 있습니다. 그는 거의 20년에 걸쳐 JavaScript 분야에서 활동하며 수많은 개발자들이 앱을 개발하는 방식에 지대한 영향을 미쳤습니다. 그의 오픈 소스 여정은 뛰어난 기술력과 커뮤니티 리더십을 모두 보여줍니다.

### Express 기술 위원회 및 핵심 기여 {#express-technical-committee-and-core-contributions}

Nick은 웹 프레임워크에 대한 전문 지식을 바탕으로 [익스프레스 기술 위원회](https://expressjs.com/en/resources/community.html)에 참여하여 가장 많이 사용되는 Node.js 프레임워크 중 하나를 개발하는 데 기여했습니다. 현재 Nick은 [익스프레스 커뮤니티 페이지](https://expressjs.com/en/resources/community.html)에 비활성 멤버로 등록되어 있습니다.

> \[!IMPORTANT]
> Express는 Node.js 생태계의 많은 부분을 형성해 온 다작의 오픈 소스 기여자인 TJ Holowaychuk에 의해 처음 만들어졌습니다. TJ의 초석적인 업적에 감사드리며, 그의 광범위한 오픈 소스 기여를 통해 [휴식을 취하기로 결정하다](https://news.ycombinator.com/item?id=37687017)을 존경합니다.

[익스프레스 기술 위원회](https://expressjs.com/en/resources/community.html)의 멤버로서 Nick은 `req.originalUrl` 설명서를 명확히 하고 다중 파트 양식 처리 문제를 해결하는 등의 문제에 대해 세부 사항에 큰 관심을 보였습니다.

### Koa 프레임워크 기여 {#koa-framework-contributions}

TJ Holowaychuk이 만든 Express의 현대적이고 가벼운 대안인 [Koa 프레임워크](https://github.com/koajs/koa)를 활용한 Nick의 작업은 더 나은 웹 개발 도구에 대한 그의 헌신을 더욱 잘 보여줍니다. 그의 Koa 기여에는 풀 리퀘스트를 통한 이슈 및 코드 작성, 오류 처리, 콘텐츠 유형 관리, 문서 개선 등이 포함됩니다.

Express와 Koa를 모두 아우르는 그의 작업은 Node.js 웹 개발에 대한 독특한 관점을 제공하며, 이를 통해 우리 팀이 여러 프레임워크 생태계에서 원활하게 작동하는 패키지를 만드는 데 도움이 됩니다.

### 개인 기여자에서 조직 리더로 {#from-individual-contributor-to-organization-leader}}

기존 프로젝트를 지원하는 것으로 시작된 활동이 전체 패키지 생태계를 구축하고 유지하는 것으로 발전했습니다. Nick은 [선실](https://github.com/cabinjs), [스팸 스캐너](https://github.com/spamscanner), [이메일 전달](https://github.com/forwardemail), [젊은이](https://github.com/ladjs), [브리](https://github.com/breejs)를 포함한 여러 GitHub 조직을 설립했으며, 각 조직은 JavaScript 커뮤니티의 특정 요구 사항을 해결했습니다.

기여자에서 리더로의 이러한 변화는 실제 문제를 해결하는 잘 설계된 소프트웨어에 대한 Nick의 비전을 보여줍니다. 그는 GitHub 조직에 따라 관련 패키지를 체계적으로 정리함으로써, 더 넓은 개발자 커뮤니티를 위해 모듈화되고 유연하면서도 함께 작동하는 도구 생태계를 구축했습니다.

## GitHub 조직: 혁신 생태계 {#our-github-organizations-ecosystems-of-innovation}

저희는 JavaScript의 특정 요구 사항을 해결하는 데 중점을 둔 GitHub 조직을 중심으로 오픈 소스 작업을 구성합니다. 이러한 구조는 모듈성을 유지하면서도 서로 원활하게 작동하는 응집력 있는 패키지 제품군을 생성합니다.

### Cabin: 최신 애플리케이션을 위한 구조화된 로깅 {#cabin-structured-logging-for-modern-applications}

[객실 정리](https://github.com/cabinjs)은 간단하고 강력한 앱 로깅에 대한 저희의 접근 방식입니다. 주요 [`cabin`](https://github.com/cabinjs/cabin) 패키지는 GitHub 별점 약 900개와 주간 다운로드 횟수 10만 건 이상을 기록하고 있습니다. Cabin은 Sentry, LogDNA, Papertrail과 같은 인기 서비스와 연동되는 구조화된 로깅을 제공합니다.

Cabin을 특별하게 만드는 것은 세심한 API와 플러그인 시스템입니다. Express 미들웨어를 위한 [`axe`](https://github.com/cabinjs/axe)과 HTTP 요청 파싱을 위한 [`parse-request`](https://github.com/cabinjs/parse-request)과 같은 지원 패키지는 개별 도구가 아닌 완전한 솔루션을 지향하는 Cabin의 헌신을 보여줍니다.

[`bson-objectid`](https://github.com/cabinjs/bson-objectid) 패키지는 단 두 달 만에 170만 건 이상 다운로드되어 특별히 언급할 가치가 있습니다.\[^2] 이 가벼운 MongoDB ObjectID 구현은 MongoDB에 완전히 종속되지 않은 ID가 필요한 개발자에게 필수적인 솔루션이 되었습니다.

### 스팸 스캐너: 이메일 남용 방지 {#spam-scanner-fighting-email-abuse}}

[스팸 스캐너 조직](https://github.com/spamscanner)은 실제 문제 해결에 대한 저희의 헌신을 보여줍니다. 주요 패키지인 [`spamscanner`](https://github.com/spamscanner/spamscanner)은 고급 이메일 스팸 감지 기능을 제공하지만, [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe) 패키지는 놀라운 도입률을 보였습니다.

두 달 만에 120만 건 이상 다운로드된 `url-regex-safe`는 다른 URL 감지 정규 표현식의 심각한 보안 문제를 해결합니다. 이 패키지는 오픈 소스에 대한 저희의 접근 방식을 보여줍니다. 즉, URL 검증의 일반적인 문제(이 경우 [다시 실행](https://en.wikipedia.org/wiki/ReDoS) 취약점)를 찾아 견고한 솔루션을 구축하고 신중하게 관리하는 것입니다.

### Bree: 작업자 스레드를 사용한 최신 작업 스케줄링 {#bree-modern-job-scheduling-with-worker-threads}

[브리 조직](https://github.com/breejs)은 Node.js에서 흔히 발생하는 과제인 안정적인 작업 스케줄링에 대한 해답입니다. 3,100개 이상의 GitHub 별점을 받은 [`bree`](https://github.com/breejs/bree) 패키지는 Node.js 워커 스레드를 사용하여 성능과 안정성을 향상시키는 최신 작업 스케줄러를 제공합니다.

> \[!NOTE]
> Bree는 [의제](https://github.com/agenda/agenda) 유지 관리를 지원하면서 얻은 교훈을 바탕으로 더 나은 작업 스케줄러를 구축한 후 만들어졌습니다. Agenda에 기여한 내용을 바탕으로 작업 스케줄링을 개선할 방법을 찾았습니다.

Bree를 Agenda와 같은 다른 스케줄러와 차별화하는 요소는 다음과 같습니다.

* **외부 종속성 없음**: MongoDB가 필요한 Agenda와 달리 Bree는 작업 상태 관리를 위해 Redis나 MongoDB가 필요하지 않습니다.
* **워커 스레드**: Bree는 샌드박스 프로세스에 Node.js 워커 스레드를 사용하여 더 나은 격리 및 성능을 제공합니다.
* **간단한 API**: Bree는 단순하면서도 세부적인 제어 기능을 제공하여 복잡한 스케줄링 요구 사항을 더 쉽게 구현할 수 있도록 합니다.
* **기본 지원**: 우아한 리로딩, 크론 작업, 날짜 및 사용자 친화적인 시간 등이 기본적으로 포함되어 있습니다.

Bree는 [forwardemail.net](https://github.com/forwardemail/forwardemail.net)의 핵심 요소로, 이메일 처리, 정리, 예정된 유지 관리와 같은 중요한 백그라운드 작업을 처리합니다. Forward Email에서 Bree를 사용하는 것은 프로덕션 환경에서 자체 도구를 사용하여 높은 안정성 기준을 충족하려는 저희의 노력을 보여줍니다.

[수영장](https://github.com/piscinajs/piscina)과 같은 훌륭한 워커 스레드 패키지와 [열하나](https://github.com/nodejs/undici)과 같은 HTTP 클라이언트도 사용하고 있으며, 매우 감사하게 생각합니다. Bree와 마찬가지로 Piscina는 효율적인 작업 처리를 위해 Node.js 워커 스레드를 사용합니다. undici와 piscina를 모두 관리하고 있는 [매튜 힐](https://github.com/mcollina)에게 Node.js에 크게 기여해 주셔서 감사드립니다. Matteo는 Node.js 기술 운영 위원회에서 활동하며 Node.js의 HTTP 클라이언트 기능을 크게 개선했습니다.

### 이메일 전달: 오픈 소스 이메일 인프라 {#forward-email-open-source-email-infrastructure}

저희의 가장 야심찬 프로젝트는 이메일 전달, 저장, API 서비스를 제공하는 오픈소스 이메일 서비스인 [이메일 전달](https://github.com/forwardemail)입니다. 메인 저장소는 1,100개가 넘는 GitHub 별점을 받았으며, 이는 독점 이메일 서비스의 대안인 이 서비스에 대한 커뮤니티의 호평을 보여줍니다.

이 조직의 [`preview-email`](https://github.com/forwardemail/preview-email) 패키지는 두 달 만에 250만 건 이상 다운로드되었으며, 이메일 템플릿을 사용하는 개발자에게 필수적인 도구로 자리 잡았습니다. 개발 중에 이메일을 미리 볼 수 있는 간편한 방법을 제공함으로써 이메일 지원 애플리케이션 개발 과정에서 흔히 발생하는 어려움을 해결합니다.

### Lad: 필수 Koa 유틸리티 및 도구 {#lad-essential-koa-utilities-and-tools}

[젊은 조직](https://github.com/ladjs)은 Koa 프레임워크 생태계 향상에 중점을 둔 필수 유틸리티와 도구 모음을 제공합니다. 이 패키지들은 웹 개발에서 흔히 발생하는 문제를 해결하며, 독립적으로 유용성을 유지하면서도 서로 원활하게 작동하도록 설계되었습니다.

#### koa-better-error-handler: Koa의 오류 처리가 개선되었습니다.

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler)은 Koa 애플리케이션에 더 나은 오류 처리 솔루션을 제공합니다. GitHub 별점 50개 이상을 받은 이 패키지는 `ctx.throw`이 사용자 친화적인 오류 메시지를 생성하도록 하는 동시에 Koa 내장 오류 처리기의 여러 한계점을 해결합니다.

* Node.js DNS 오류, Mongoose 오류 및 Redis 오류를 감지하고 적절히 처리합니다.
* [팔](https://github.com/hapijs/boom)을 사용하여 일관되고 형식이 잘 지정된 오류 응답을 생성합니다.
* 헤더를 보존합니다(Koa 내장 핸들러와 달리).
* 500을 기본값으로 설정하는 대신 적절한 상태 코드를 유지합니다.
* 플래시 메시지 및 세션 보존을 지원합니다.
* 유효성 검사 오류에 대한 HTML 오류 목록을 제공합니다.
* 다양한 응답 유형(HTML, JSON 및 일반 텍스트)을 지원합니다.

이 패키지는 Koa 애플리케이션에서 포괄적인 오류 관리를 위해 [`koa-404-handler`](https://github.com/ladjs/koa-404-handler)와 함께 사용하면 특히 유용합니다.

#### 여권: Lad {#passport-authentication-for-lad}}에 대한 인증

[`@ladjs/passport`](https://github.com/ladjs/passport)은 널리 사용되는 Passport.js 인증 미들웨어를 확장하여 최신 웹 애플리케이션을 위한 특정 기능을 제공합니다. 이 패키지는 기본적으로 다양한 인증 전략을 지원합니다.

* 이메일을 통한 로컬 인증
* Apple로 로그인
* GitHub 인증
* Google 인증
* 일회용 비밀번호(OTP) 인증

이 패키지는 사용자 정의가 매우 용이하여 개발자가 애플리케이션 요구 사항에 맞게 필드 이름과 구문을 조정할 수 있습니다. Mongoose와 완벽하게 통합되어 사용자 관리를 지원하도록 설계되어 강력한 인증이 필요한 Koa 기반 애플리케이션에 이상적인 솔루션입니다.

#### graceful: 우아한 애플리케이션 종료 {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful)은 Node.js 애플리케이션을 정상적으로 종료하는 중요한 과제를 해결합니다. 70개 이상의 GitHub 별점을 받은 이 패키지는 데이터 손실이나 연결 끊김 없이 애플리케이션이 정상적으로 종료되도록 보장합니다. 주요 기능은 다음과 같습니다.

* HTTP 서버(Express/Koa/Fastify)의 정상적인 종료 지원
* 데이터베이스 연결(MongoDB/Mongoose)의 원활한 종료
* Redis 클라이언트의 적절한 종료
* Bree 작업 스케줄러 처리
* 사용자 지정 종료 핸들러 지원
* 구성 가능한 시간 초과 설정
* 로깅 시스템과의 통합

이 패키지는 예기치 않은 종료로 인해 데이터 손실이나 손상이 발생할 수 있는 프로덕션 애플리케이션에 필수적입니다. `@ladjs/graceful`은 적절한 종료 절차를 구현하여 애플리케이션의 안정성과 신뢰성을 보장합니다.

### Upptime: 오픈 소스 가동 시간 모니터링 {#upptime-open-source-uptime-monitoring}

[업타임 조직](https://github.com/upptime)은 투명한 오픈 소스 모니터링에 대한 저희의 헌신을 나타냅니다. 메인 [`upptime`](https://github.com/upptime/upptime) 저장소는 13,000개 이상의 GitHub 별점을 받았으며, 저희가 기여하는 가장 인기 있는 프로젝트 중 하나입니다. Upptime은 서버 없이도 완벽하게 작동하는 GitHub 기반 가동 시간 모니터 및 상태 페이지를 제공합니다.

우리는 <https://status.forwardemail.net>>의 자체 상태 페이지에 Upptime을 사용하고 <https://github.com/forwardemail/status.forwardemail.net>.>에서 소스 코드를 사용할 수 있습니다.

Upptime을 특별하게 만드는 것은 아키텍처입니다.

* **100% 오픈 소스**: 모든 구성 요소는 완전히 오픈 소스이며 사용자 정의가 가능합니다.
* **GitHub 기반**: 서버리스 모니터링 솔루션을 위해 GitHub Actions, Issues 및 Pages를 활용합니다.
* **서버 불필요**: 기존 모니터링 도구와 달리 Upptime은 서버를 실행하거나 유지할 필요가 없습니다.
* **자동 상태 페이지**: GitHub Pages에 호스팅할 수 있는 멋진 상태 페이지를 생성합니다.
* **강력한 알림**: 이메일, SMS, Slack 등 다양한 알림 채널과 통합됩니다.

사용자 경험을 향상시키기 위해 forwardemail.net 코드베이스에 [@옥토킷/코어](https://github.com/octokit/core.js/)을 통합하여 웹사이트에서 실시간 상태 업데이트 및 인시던트를 직접 제공합니다. 이 통합을 통해 웹사이트, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree 등 전체 스택에서 문제가 발생할 경우 즉각적인 토스트 알림, 배지 아이콘 변경, 경고 색상 등을 통해 사용자에게 명확한 투명성을 제공합니다.

@octokit/core 라이브러리를 사용하면 Upptime GitHub 저장소에서 실시간 데이터를 가져와 처리하고 사용자 친화적인 방식으로 표시할 수 있습니다. 서비스 중단이나 성능 저하가 발생하면 사용자는 메인 애플리케이션을 벗어나지 않고도 시각적인 표시기를 통해 즉시 알림을 받습니다. 이러한 원활한 통합을 통해 사용자는 시스템 상태에 대한 최신 정보를 항상 얻을 수 있으며, 이를 통해 투명성과 신뢰도가 향상됩니다.

Upptime은 투명하고 신뢰할 수 있는 방식으로 서비스를 모니터링하고 사용자에게 상태를 전달하고자 하는 수백 개의 조직에서 채택되었습니다. 이 프로젝트의 성공은 기존 인프라(이 경우 GitHub)를 활용하여 새로운 방식으로 일반적인 문제를 해결하는 도구를 구축하는 것이 얼마나 강력한지를 보여줍니다.

## 포워드 이메일 생태계에 대한 당사의 기여 {#our-contributions-to-the-forward-email-ecosystem}

저희의 오픈 소스 패키지는 전 세계 개발자들이 사용하고 있을 뿐만 아니라, 저희 Forward Email 서비스의 기반이기도 합니다. 이러한 도구의 제작자이자 사용자라는 두 가지 역할을 통해 저희는 실제 적용 사례에 대한 고유한 관점을 확보하고 지속적인 개선을 추진합니다.

### 패키지에서 프로덕션까지 {#from-packages-to-production}

개별 패키지에서 응집력 있는 생산 시스템으로의 전환에는 신중한 통합과 확장이 필요합니다. Forward Email의 경우, 이 프로세스는 다음과 같습니다.

* **맞춤형 확장**: 당사의 고유한 요구 사항을 충족하는 오픈 소스 패키지에 대한 Forward 이메일 전용 확장 기능을 구축합니다.
* **통합 패턴**: 이러한 패키지가 프로덕션 환경에서 상호 작용하는 방식에 대한 패턴을 개발합니다.
* **성능 최적화**: 대규모로 발생하는 성능 병목 현상을 파악하고 해결합니다.
* **보안 강화**: 이메일 처리 및 사용자 데이터 보호에 특화된 보안 계층을 추가합니다.

이 작업은 핵심 패키지 자체를 넘어 수천 시간에 걸친 개발의 결과물이며, 그 결과 오픈 소스 기여의 장점을 최대한 활용한 강력하고 안전한 이메일 서비스가 탄생했습니다.

### 피드백 루프 {#the-feedback-loop}

프로덕션 환경에서 자체 패키지를 사용하는 가장 큰 장점은 피드백 루프를 구축하는 것입니다. Forward Email에서 제약이나 예외 상황에 직면하면, 단순히 로컬 패치를 적용하는 데 그치지 않고 기반 패키지를 개선하여 서비스와 더 나아가 커뮤니티 모두에게 도움을 줍니다.

이러한 접근 방식으로 인해 수많은 개선이 이루어졌습니다.

* **Bree의 정상 종료**: Forward Email의 무중단 배포 필요성으로 인해 Bree의 정상 종료 기능이 향상되었습니다.
* **스팸 스캐너의 패턴 인식**: Forward Email에서 발생하는 실제 스팸 패턴을 스팸 스캐너의 탐지 알고리즘에 적용했습니다.
* **Cabin의 성능 최적화**: 운영 환경에서의 대량 로깅을 통해 Cabin에서 모든 사용자에게 도움이 되는 최적화 기회를 발견했습니다.

오픈 소스 작업과 프로덕션 서비스 간의 선순환을 유지함으로써, 우리는 패키지가 이론적인 구현이 아닌 실용적이고 실전에서 검증된 솔루션으로 남도록 보장합니다.

## 이메일 전달의 핵심 원칙: 우수성을 위한 기반 {#forward-emails-core-principles-a-foundation-for-excellence}

Forward Email은 모든 개발 결정의 기준이 되는 핵심 원칙에 따라 설계되었습니다. [웹사이트](/blog/docs/best-quantum-safe-encrypted-email-service#principles)에 자세히 설명된 이러한 원칙은 저희 서비스가 개발자 친화적이고 안전하며 사용자 개인 정보 보호에 중점을 두고 유지되도록 보장합니다.

### 항상 개발자 친화적이고 보안 중심적이며 투명합니다. {#always-developer-friendly-security-focused-and-transparent}

저희의 최우선 원칙은 최고 수준의 보안 및 개인정보 보호 기준을 유지하면서도 개발자 친화적인 소프트웨어를 만드는 것입니다. 기술적 우수성이 사용성을 저해해서는 안 되며, 투명성을 통해 커뮤니티의 신뢰를 구축할 수 있다고 믿습니다.

이 원칙은 상세한 문서, 명확한 오류 메시지, 그리고 성공과 어려움에 대한 열린 소통을 통해 드러납니다. 전체 코드베이스를 오픈 소스로 공개함으로써, 우리는 면밀한 검토와 협업을 유도하고, 이를 통해 소프트웨어와 더 넓은 생태계를 강화합니다.

### 시간에 검증된 소프트웨어 개발 원칙 준수 {#adherence-to-time-tested-software-development-principles}

우리는 수십 년 동안 가치가 입증된 몇 가지 기존 소프트웨어 개발 원칙을 따릅니다.

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: 모델-뷰-컨트롤러(MVC) 패턴을 통해 관심사 분리
* **[유닉스 철학](https://en.wikipedia.org/wiki/Unix_philosophy)**: 한 가지 기능을 잘 수행하는 모듈식 컴포넌트 생성
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: 간단하고 직관적으로 만들기
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: 반복하지 마세요(Don't Repeat Yourself), 코드 재사용 촉진
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: 필요 없을 거예요(You Aren Gonna Need It), 조기 최적화 방지
* **[열두 가지 요소](https://12factor.net/)**: 현대적이고 확장 가능한 애플리케이션 구축을 위한 모범 사례 따르기
* **[오컴의 면도날](https://en.wikipedia.org/wiki/Occam%27s_razor)**: 요구 사항을 충족하는 가장 간단한 솔루션 선택
* **[도그푸딩](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: 자사 제품 광범위하게 활용

이러한 원칙은 단순한 이론적인 개념이 아니라 우리의 일상적인 개발 관행에 깊이 뿌리내리고 있습니다. 예를 들어, 유닉스 철학을 고수하는 것은 npm 패키지의 구조에서도 분명히 드러납니다. npm 패키지는 작고 집중적인 모듈들을 조합하여 복잡한 문제를 해결하는 방식입니다.

### 끈기 있고 부트스트랩 방식으로 일하는 개발자를 타겟으로 합니다. {#targeting-the-scrappy-bootstrapped-developer}

저희는 특히 엉성하고, 부트스트랩 방식으로 운영되며, [라면-수익성 있는](https://www.paulgraham.com/ramenprofitable.html)인 개발자를 타겟으로 합니다. 이러한 집중력은 가격 모델부터 기술적 결정에 이르기까지 모든 것을 좌우합니다. 저희는 제한된 리소스로 제품을 개발하는 데 따르는 어려움을 잘 알고 있습니다. 왜냐하면 저희도 그 어려움을 직접 겪었기 때문입니다.

이 원칙은 특히 오픈 소스에 대한 접근 방식에서 중요합니다. 우리는 기업 예산이 부족한 개발자들을 위해 실질적인 문제를 해결하는 패키지를 개발하고 유지 관리하며, 이를 통해 누구나 리소스에 관계없이 강력한 도구를 이용할 수 있도록 합니다.

### 실제 원칙: 전달 이메일 코드베이스 {#principles-in-practice-the-forward-email-codebase}

이러한 원칙은 Forward Email 코드베이스에서 명확하게 드러납니다. package.json 파일에는 핵심 가치에 맞춰 신중하게 선택된 종속성이 포함되어 있습니다.

* 이메일 인증을 위한 `mailauth`과 같은 보안 중심 패키지
* 디버깅을 용이하게 하는 `preview-email`과 같은 개발자 친화적 도구
* Sindre Sorhus의 다양한 `p-*` 유틸리티와 같은 모듈식 구성 요소

이러한 원칙을 꾸준히 지켜온 덕분에 우리는 개발자들이 이메일 인프라를 맡길 수 있는 안전하고 신뢰할 수 있으며 오픈 소스 커뮤니티의 가치에 부합하는 서비스를 구축할 수 있었습니다.

### 개인 정보 보호 설계 {#privacy-by-design}

개인정보 보호는 Forward Email의 사후 고려 사항이나 마케팅 기능이 아닙니다. 이는 서비스와 코드의 모든 측면을 알려주는 기본적인 설계 원칙입니다.

* **무접근 암호화**: 기술적으로 사용자 이메일을 읽을 수 없는 시스템을 구축했습니다.
* **최소한의 데이터 수집**: 서비스 제공에 필요한 데이터만 수집하며, 그 이상은 수집하지 않습니다.
* **투명한 정책**: 개인정보 보호정책은 전문 용어 없이 명확하고 이해하기 쉬운 언어로 작성되었습니다.
* **오픈 소스 검증**: 오픈 소스 코드베이스를 통해 보안 연구원들이 개인정보 보호 주장을 검증할 수 있습니다.

이러한 노력은 보안 및 개인정보 보호 모범 사례를 처음부터 내장하여 설계된 오픈 소스 패키지에도 적용됩니다.

### 지속 가능한 오픈 소스 {#sustainable-open-source}

저희는 오픈 소스 소프트웨어가 장기적으로 성공하려면 지속 가능한 모델이 필요하다고 믿습니다. 저희의 접근 방식은 다음과 같습니다.

* **상업적 지원**: 오픈 소스 도구에 대한 프리미엄 지원 및 서비스를 제공합니다.
* **균형 잡힌 라이선스**: 사용자의 자유와 프로젝트의 지속 가능성을 모두 보호하는 라이선스를 사용합니다.
* **커뮤니티 참여**: 기여자들과 적극적으로 소통하여 서로 돕는 커뮤니티를 구축합니다.
* **투명한 로드맵**: 사용자가 계획에 따라 개발 계획을 세울 수 있도록 개발 계획을 공유합니다.

지속 가능성에 초점을 맞춤으로써, 우리는 오픈 소스 기여가 방치되지 않고 시간이 지남에 따라 지속적으로 성장하고 개선될 수 있도록 보장합니다.

## 숫자는 거짓말하지 않습니다: 놀라운 npm 다운로드 통계 {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

오픈 소스 소프트웨어의 영향력에 대해 이야기할 때, 다운로드 통계는 도입과 신뢰도를 보여주는 실질적인 지표입니다. 저희가 관리하는 패키지 중 상당수는 다른 오픈 소스 프로젝트에서는 거의 달성하지 못할 규모에 도달했으며, 총 다운로드 수는 수십억 건에 달합니다.

![다운로드 기준 상위 npm 패키지](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> JavaScript 생태계에서 다운로드 빈도가 높은 여러 패키지를 유지 관리하는 데 도움을 드릴 수 있어 자랑스럽지만, 이러한 패키지 중 상당수는 원래 다른 재능 있는 개발자들이 개발했다는 점을 알려드리고자 합니다. superagent와 supertest와 같은 패키지는 TJ Holowaychuk이 개발했으며, 그는 오픈 소스에 대한 풍부한 기여를 통해 Node.js 생태계 형성에 중요한 역할을 해왔습니다.

### 우리의 영향력을 조감도로 살펴보기 {#a-birds-eye-view-of-our-impact}

2025년 2월부터 3월까지 단 두 달 동안, 우리가 기여하고 유지하는 데 도움을 준 최고의 패키지는 엄청난 다운로드 수를 기록했습니다.

* **[슈퍼에이전트](https://www.npmjs.com/package/superagent)**: 다운로드 84,575,829회\[^7] (TJ Holowaychuk 작성)
* **[슈퍼 테스트](https://www.npmjs.com/package/supertest)**: 다운로드 76,432,591회\[^8] (TJ Holowaychuk 작성)
* **[또한](https://www.npmjs.com/package/koa)**: 다운로드 28,539,295회\[^34] (TJ Holowaychuk 작성)
* **[@koa/라우터](https://www.npmjs.com/package/@koa/router)**: 다운로드 11,007,327회\[^35]
* **[코아 라우터](https://www.npmjs.com/package/koa-router)**: 다운로드 3,498,918회\[^36]
* **[url-정규식](https://www.npmjs.com/package/url-regex)**: 다운로드 2,819,520회\[^37]
* **[미리보기-이메일](https://www.npmjs.com/package/preview-email)**: 다운로드 2,500,000회\[^9]
* **[선실](https://www.npmjs.com/package/cabin)**: 다운로드 1,800,000회\[^10]
* **[@breejs/나중에](https://www.npmjs.com/package/@breejs/later)**: 다운로드 1,709,938회\[^38]
* **[이메일 템플릿](https://www.npmjs.com/package/email-templates)**: 다운로드 1,128,139회\[^39]
* **__PROTECTED_LINK_259__0**: 다운로드 1,124,686회\[^40]
* **__PROTECTED_LINK_259__1**: 다운로드 1,200,000회\[^11]
* **__PROTECTED_LINK_259__2**: 다운로드 894,666회\[^41]
* **__PROTECTED_LINK_259__3**: 839,585회 다운로드\[^42]
* **__PROTECTED_LINK_259__4**: 145,000회 다운로드\[^12]
* **__PROTECTED_LINK_259__5**: 24,270회 다운로드\[^30]

> \[!NOTE]
> 저희가 직접 제작하지는 않았지만 유지 관리를 돕는 다른 패키지들도 있는데, 그중에는 `form-data`(7억 3,800만 회 이상 다운로드), `toidentifier`(3억 900만 회 이상 다운로드), `stackframe`(1억 1,600만 회 이상 다운로드), 그리고 `error-stack-parser`(1억 1,300만 회 이상 다운로드)가 있습니다. 저희는 원저자들의 노고를 존중하며 이러한 패키지 개발에 기여하게 되어 영광입니다.

이는 단순히 인상적인 수치가 아닙니다. 저희가 유지 관리하는 코드를 통해 실제 개발자들이 실제 문제를 해결하고 있음을 보여줍니다. 이러한 패키지가 다운로드될 때마다 취미 프로젝트부터 수백만 명이 사용하는 기업용 애플리케이션까지, 누군가는 의미 있는 무언가를 만드는 데 도움을 받았다는 것을 알 수 있습니다.

![패키지 카테고리 배포](/img/art/category_pie_chart.svg)

### 대규모 일일 영향 {#daily-impact-at-scale}

일일 다운로드 패턴은 일관되고 높은 사용량을 보여주며, 최고 다운로드 수는 하루 수백만 건에 달합니다.\[^13] 이러한 일관성은 이러한 패키지의 안정성과 신뢰성을 보여줍니다. 개발자들은 단순히 사용해 보는 데 그치지 않고 핵심 워크플로에 통합하여 매일 의존하고 있습니다.

주간 다운로드 패턴은 더욱 인상적인 수치를 보이며, 꾸준히 주당 수천만 건을 상회하고 있습니다.\[^14] 이는 JavaScript 생태계에 막대한 영향을 미치며, 이러한 패키지는 전 세계 프로덕션 환경에서 실행되고 있습니다.

### 단순한 숫자를 넘어서 {#beyond-the-raw-numbers}

다운로드 통계 자체도 인상적이지만, 이는 커뮤니티가 이러한 패키지에 얼마나 큰 신뢰를 두고 있는지를 보여줍니다. 이러한 규모의 패키지를 유지하려면 다음 사항에 대한 확고한 의지가 필요합니다.

* **이전 버전과의 호환성**: 기존 구현을 손상시키지 않도록 변경 사항을 신중하게 고려해야 합니다.
* **보안**: 수백만 개의 애플리케이션이 이러한 패키지에 의존하고 있기 때문에 보안 취약점은 광범위한 결과를 초래할 수 있습니다.
* **성능**: 이 규모에서는 사소한 성능 개선만으로도 상당한 종합적인 이점을 얻을 수 있습니다.
* **문서화**: 모든 수준의 개발자가 사용하는 패키지에 대해 명확하고 포괄적인 문서화가 필수적입니다.

시간이 지남에 따라 다운로드 수가 꾸준히 증가한 것은 이러한 약속을 이행하는 데 성공했으며, 안정적이고 잘 유지 관리되는 패키지를 통해 개발자 커뮤니티와의 신뢰를 구축했음을 보여줍니다.

## 생태계 지원: 오픈 소스 후원 {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> 오픈소스의 지속가능성은 단순히 코드 기여에만 국한되지 않습니다. 중요한 인프라를 유지 관리하는 개발자들을 지원하는 것도 중요합니다.

JavaScript 생태계에 대한 직접적인 기여 외에도, 저희는 다양한 최신 애플리케이션의 기반을 형성하는 뛰어난 Node.js 기여자들을 후원하게 되어 자랑스럽게 생각합니다. 저희가 후원하는 분야는 다음과 같습니다.

### Andris Reinman: 이메일 인프라 선구자 {#andris-reinman-email-infrastructure-pioneer}

[안드리스 라인만](https://github.com/andris9)은 Node.js에서 가장 인기 있는 이메일 전송 라이브러리인 [노드메일러](https://github.com/nodemailer/nodemailer)의 개발자로, 주간 다운로드 수가 1,400만 건을 넘습니다.\[^15] 그의 작업은 [SMTP 서버](https://github.com/nodemailer/smtp-server), [메일파서](https://github.com/nodemailer/mailparser), [와일드덕](https://github.com/nodemailer/wildduck)와 같은 다른 중요한 이메일 인프라 구성 요소까지 확장되었습니다.

저희의 후원은 수많은 Node.js 애플리케이션, 특히 저희의 Forward Email 서비스를 포함한 이메일 통신을 지원하는 필수 도구의 지속적인 유지 관리와 개발을 보장하는 데 도움이 됩니다.

### 신드레 소르후스: 유틸리티 패키지 주모자 {#sindre-sorhus-utility-package-mastermind}

[신드레 소르후스](https://github.com/sindresorhus)는 JavaScript 생태계에서 가장 활발하게 오픈소스에 기여하는 사람 중 한 명으로, 1,000개가 넘는 npm 패키지를 보유하고 있습니다. [p-맵](https://github.com/sindresorhus/p-map), [재시도 전](https://github.com/sindresorhus/p-retry), [is-stream](https://github.com/sindresorhus/is-stream)과 같은 그의 유틸리티는 Node.js 생태계 전반에 걸쳐 사용되는 핵심 구성 요소입니다.

Sindre의 작업을 후원함으로써 우리는 JavaScript 개발을 보다 효율적이고 안정적으로 만드는 중요한 유틸리티의 개발을 지속하는 데 도움이 됩니다.

이러한 후원은 더 넓은 오픈 소스 생태계에 대한 우리의 헌신을 반영합니다. 우리는 우리의 성공이 이들과 다른 기여자들이 쌓아온 기반 위에 세워졌다는 것을 인지하고 있으며, 전체 생태계의 지속가능성을 보장하기 위해 최선을 다하고 있습니다.

## JavaScript 생태계의 보안 취약점 발견 {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

오픈 소스에 대한 우리의 헌신은 기능 개발을 넘어 수백만 명의 개발자에게 영향을 미칠 수 있는 보안 취약점을 파악하고 해결하는 데까지 확장됩니다. JavaScript 생태계에 대한 우리의 가장 중요한 기여 중 일부는 보안 분야에서 이루어졌습니다.

### Koa 라우터 복구 {#the-koa-router-rescue}

2019년 2월, Nick은 인기 있는 koa-router 패키지의 유지 관리에 심각한 문제가 있음을 발견했습니다. [해커 뉴스에 보도됨](https://news.ycombinator.com/item?id=19156707)으로 표시된 것은 해당 패키지가 원래 관리자에 의해 폐기되어 보안 취약점이 해결되지 않은 채 커뮤니티에 업데이트가 제공되지 않고 있다는 것을 의미합니다.

> \[!WARNING]
> 보안 취약점이 있는 버려진 패키지는 전체 생태계에 심각한 위험을 초래하며, 특히 매주 수백만 건씩 다운로드되는 경우 더욱 그렇습니다.

이에 대응하여 Nick은 [@koa/라우터](https://github.com/koajs/router)을 생성하고 커뮤니티에 상황을 알리는 데 도움을 주었습니다. 그는 그 이후로 이 중요한 패키지를 유지 관리하여 Koa 사용자들이 안전하고 잘 관리되는 라우팅 솔루션을 이용할 수 있도록 보장해 왔습니다.

### ReDoS 취약점 해결 {#addressing-redos-vulnerabilities}

2020년, Nick은 널리 사용되는 `url-regex` 패키지에서 심각한 [정규 표현식 서비스 거부(ReDoS)](https://en.wikipedia.org/wiki/ReDoS) 취약점을 발견하고 해결했습니다. 이 취약점([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472))은 공격자가 특수하게 조작된 입력을 제공하여 정규 표현식에서 치명적인 백트래킹을 유발함으로써 서비스 거부 공격을 유발할 수 있습니다.

Nick은 기존 패키지를 단순히 패치하는 대신, 기존 API와의 호환성을 유지하면서 취약점을 해결하는 완전히 재작성된 구현체인 [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe)을 개발했습니다. 그는 또한 취약점과 완화 방법을 설명하는 [포괄적인 블로그 게시물](/blog/docs/url-regex-javascript-node-js)을 게시했습니다.

이 작업은 보안에 대한 당사의 접근 방식을 보여줍니다. 단순히 문제를 해결하는 데 그치지 않고 커뮤니티를 교육하고 향후 유사한 문제가 발생하지 않도록 강력한 대안을 제공합니다.

### Node.js 및 Chromium 보안 옹호 {#advocating-for-nodejs-and-chromium-security}

Nick은 또한 더 넓은 생태계의 보안 개선을 위해 적극적으로 활동해 왔습니다. 2020년 8월, 그는 Node.js의 HTTP 헤더 처리와 관련된 심각한 보안 문제를 발견했으며, 이 문제는 [레지스터](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/)에서 보고되었습니다.

Chromium 패치에서 비롯된 이 문제는 공격자가 보안 조치를 우회할 수 있는 가능성을 내포하고 있습니다. Nick의 적극적인 지원 덕분에 문제가 신속하게 해결되어 수백만 개의 Node.js 애플리케이션이 잠재적인 악용으로부터 보호될 수 있었습니다.

### npm 인프라 보안 {#securing-npm-infrastructure}

같은 달 말, Nick은 npm의 이메일 인프라에서 또 다른 심각한 보안 문제를 발견했습니다. [레지스터](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/)에 보고된 바와 같이, npm은 DMARC, SPF, DKIM 이메일 인증 프로토콜을 제대로 구현하지 않아 공격자가 npm에서 발송된 것처럼 보이는 피싱 이메일을 보낼 수 있었습니다.

닉의 보고서는 npm의 이메일 보안 태세를 개선하는 데 도움이 되었고, 패키지 관리를 위해 npm에 의존하는 수백만 명의 개발자를 잠재적인 피싱 공격으로부터 보호했습니다.

## 포워드 이메일 생태계에 대한 당사의 기여 {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Email은 Nodemailer, WildDuck, mailauth를 포함한 여러 주요 오픈소스 프로젝트를 기반으로 구축되었습니다. 저희 팀은 이러한 프로젝트에 상당한 기여를 했으며, 이메일 전송 및 보안에 영향을 미치는 심각한 문제를 파악하고 해결하는 데 기여했습니다.

### Nodemailer의 핵심 기능 향상 {#enhancing-nodemailers-core-functionality}

[노드메일러](https://github.com/nodemailer/nodemailer)는 Node.js에서 이메일 전송의 중추이며, 우리의 기여로 인해 더욱 강력해졌습니다.

* **SMTP 서버 개선**: SMTP 서버 구성 요소에서 구문 분석 버그, 스트림 처리 문제, TLS 구성 문제를 해결했습니다.\[^16]\[^17]
* **메일 파서 개선**: 문자 시퀀스 디코딩 오류를 해결하고 이메일 처리 실패를 유발할 수 있는 파서 문제를 해결했습니다.\[^18]\[^19]

이러한 기여를 통해 Nodemailer는 Forward Email을 포함하여 Node.js 애플리케이션에서 이메일 처리를 위한 안정적인 기반으로 남게 됩니다.

### Mailauth를 사용하여 이메일 인증 강화 {#advancing-email-authentication-with-mailauth}

[메일인증](https://github.com/postalsys/mailauth)은 중요한 이메일 인증 기능을 제공하며, 저희의 기여로 해당 기능이 크게 향상되었습니다.

* **DKIM 인증 개선**: X/Twitter에서 발신 메시지의 DKIM 오류를 유발하는 DNS 캐시 문제가 발생하고 있음을 발견하고 Hacker One에 보고했습니다.\[^20]
* **DMARC 및 ARC 개선**: 잘못된 인증 결과로 이어질 수 있는 DMARC 및 ARC 인증 문제를 해결했습니다.\[^21]\[^22]
* **성능 최적화**: 이메일 인증 프로세스의 성능을 개선하는 최적화를 적용했습니다.\[^23]\[^24]\[^25]\[^26]

이러한 개선 사항은 이메일 인증이 정확하고 신뢰할 수 있도록 보장하고, 사용자를 피싱 및 스푸핑 공격으로부터 보호하는 데 도움이 됩니다.

### 주요 가동 시간 향상 {#key-upptime-enhancements}

Upptime에 대한 우리의 기여는 다음과 같습니다.

* **SSL 인증서 모니터링**: SSL 인증서 만료를 모니터링하는 기능을 추가하여 만료된 인증서로 인한 예기치 않은 다운타임을 방지했습니다.\[^27]
* **다중 SMS 번호 지원**: 인시던트 발생 시 여러 팀원에게 SMS를 통해 알림을 보내는 기능을 구현하여 대응 시간을 단축했습니다.\[^28]
* **IPv6 확인 문제 해결**: IPv6 연결 확인 관련 문제를 해결하여 최신 네트워크 환경에서 더욱 정확한 모니터링을 구현했습니다.\[^29]
* **어두운 모드/밝은 모드 지원**: 상태 페이지의 사용자 경험을 개선하기 위해 테마 지원을 추가했습니다.\[^31]
* **향상된 TCP Ping 지원**: 더욱 안정적인 연결 테스트를 제공하기 위해 TCP Ping 기능을 개선했습니다.\[^32]

이러한 개선 사항은 Forward Email의 상태 모니터링에만 도움이 되는 것이 아니라 Upptime 사용자 커뮤니티 전체에서 사용할 수 있으며, 이는 우리가 사용하는 도구를 개선하려는 우리의 노력을 보여줍니다.

## 모든 것을 하나로 묶는 접착제: 확장 가능한 사용자 정의 코드 {#the-glue-that-holds-it-all-together-custom-code-at-scale}

npm 패키지와 기존 프로젝트에 대한 기여도 중요하지만, 이러한 구성 요소를 통합하는 커스텀 코드는 저희의 기술적 전문성을 진정으로 보여줍니다. Forward Email 코드베이스는 2017년 [무료 이메일 전달](https://github.com/forwardemail/free-email-forwarding)으로 시작하여 모노리포로 병합된 이후 10년간의 개발 노력을 보여줍니다.

### 대규모 개발 노력 {#a-massive-development-effort}

이 사용자 정의 통합 코드의 규모는 인상적입니다.

* **총 기여**: 3,217개 이상의 커밋
* **코드베이스 크기**: JavaScript, Pug, CSS, JSON 파일을 합친 421,545줄 이상의 코드\[^33]

이는 수천 시간의 개발 작업, 디버깅 세션, 그리고 성능 최적화를 의미합니다. 이는 개별 패키지를 매일 수천 명의 고객이 사용하는 통합적이고 안정적인 서비스로 변환하는 "비밀 소스"입니다.

### 핵심 종속성 통합 {#core-dependencies-integration}

Forward Email 코드베이스는 수많은 종속성을 원활하게 통합합니다.

* **이메일 처리**: 전송을 위해 Nodemailer, 수신을 위해 SMTP 서버, 파싱을 위해 Mailparser를 통합합니다.
* **인증**: DKIM, SPF, DMARC 및 ARC 검증을 위해 Mailauth를 사용합니다.
* **DNS 확인**: 글로벌 캐싱을 통해 DNS-over-HTTPS를 위해 Tangerine을 활용합니다.
* **MX 연결**: 안정적인 메일 서버 연결을 위해 Tangerine과 통합된 mx-connect를 사용합니다.
* **작업 스케줄링**: 작업자 스레드를 통한 안정적인 백그라운드 작업 처리를 위해 Bree를 사용합니다.
* **템플릿화**: 고객 커뮤니케이션에서 웹사이트의 스타일시트를 재사용하기 위해 이메일 템플릿을 사용합니다.
* **이메일 저장**: ChaCha20-Poly1305 암호화와 better-sqlite3-multiple-ciphers를 사용하여 개별적으로 암호화된 SQLite 사서함을 구현하여 양자 안전 개인 정보 보호를 보장하고, 사용자 간 완벽한 격리를 보장하며, 사용자만 사서함에 액세스할 수 있도록 합니다.

이러한 각 통합은 예외 상황, 성능 영향 및 보안 문제를 신중하게 고려해야 합니다. 그 결과, 수백만 건의 이메일 거래를 안정적으로 처리하는 강력한 시스템이 탄생했습니다. 또한, SQLite 구현은 효율적인 바이너리 직렬화를 위해 msgpackr을 활용하고, 인프라 전반의 실시간 상태 업데이트를 위해 웹소켓(ws를 통해)을 활용합니다.

Tangerine 및 mx-connect를 사용한 ### DNS 인프라 {#dns-infrastructure-with-tangerine-and-mx-connect}

Forward Email 인프라의 핵심 구성 요소는 두 가지 핵심 패키지를 중심으로 구축된 DNS 확인 시스템입니다.

* **[귤](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: Node.js DNS-over-HTTPS 구현은 기본 제공 재시도, 시간 초과, 스마트 서버 로테이션 및 캐싱 지원 기능을 통해 표준 DNS 확인자를 즉시 대체할 수 있습니다.

* **[mx-커넥트](https://github.com/zone-eu/mx-connect)**: 이 패키지는 대상 도메인이나 이메일 주소를 가져와서 적절한 MX 서버를 확인하고 우선순위에 따라 연결하여 MX 서버에 TCP 연결을 설정합니다.

우리는 [풀 리퀘스트 #4](https://github.com/zone-eu/mx-connect/pull/4), Forward Email 전체에서 HTTP 요청을 통한 애플리케이션 계층 DNS를 보장합니다. 이를 통해 모든 지역, 앱 또는 프로세스에서 1:1 일관성을 유지하면서 규모에 맞는 DNS 글로벌 캐싱을 제공하며, 이는 분산 시스템에서 안정적인 이메일 전송에 필수적입니다.

## 엔터프라이즈 영향: 오픈 소스에서 미션 크리티컬 솔루션으로 {#enterprise-impact-from-open-source-to-mission-critical-solutions}

10년간의 오픈 소스 개발 여정의 결실을 맺은 Forward Email은 개별 개발자뿐만 아니라 오픈 소스 운동의 중추를 이루는 주요 기업 및 교육 기관에도 서비스를 제공할 수 있게 되었습니다.

### 미션 크리티컬 이메일 인프라 사례 연구 {#case-studies-in-mission-critical-email-infrastructure}

안정성, 개인정보 보호 및 오픈 소스 원칙에 대한 Forward Email의 헌신은 까다로운 이메일 요구 사항을 가진 조직에게 Forward Email을 신뢰할 수 있는 선택으로 만들었습니다.

* **교육 기관**: [동문 이메일 전달 사례 연구]에 자세히 설명되어 있습니다.](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)을 통해 Tangerine을 mx-connect와 통합했으며, 주요 대학들은 안정적인 이메일 전달 서비스를 통해 수십만 명의 동문과 평생 지속되는 연결을 유지하기 위해 우리의 인프라에 의존하고 있습니다.

* **엔터프라이즈 Linux 솔루션**: [Canonical Ubuntu 이메일 엔터프라이즈 사례 연구](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)은 당사의 오픈 소스 접근 방식이 엔터프라이즈 Linux 공급업체의 요구 사항과 완벽하게 일치하여 그들에게 필요한 투명성과 제어 기능을 제공하는 방식을 보여줍니다.

* **오픈 소스 재단**: 아마도 가장 확실한 것은 [Linux Foundation 이메일 기업 사례 연구](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)에 기록된 대로 Linux 재단과의 파트너십일 것입니다. 여기서 우리 서비스는 Linux 개발을 관리하는 조직 간의 커뮤니케이션을 강화합니다.

오랜 세월 정성껏 관리해 온 오픈 소스 패키지 덕분에 오픈 소스 소프트웨어를 지지하는 커뮤니티와 단체들을 지원하는 이메일 서비스를 구축할 수 있었던 것은 아름다운 대칭을 보여줍니다. 개별 패키지 제공부터 오픈 소스 리더들을 위한 엔터프라이즈급 이메일 인프라 구축에 이르기까지, 이러한 완벽한 순환 과정은 소프트웨어 개발에 대한 저희의 접근 방식이 궁극적으로 검증되었음을 보여줍니다.

## 오픈 소스 10년: 미래를 바라보며 {#a-decade-of-open-source-looking-forward}

지난 10년간의 오픈 소스 기여를 돌아보고 향후 10년을 내다보면서, 우리의 작업을 지원해 준 커뮤니티에 대한 감사함과 앞으로의 일에 대한 기대감이 가득합니다.

개별 패키지 기여자에서 주요 기업과 오픈 소스 재단에서 사용하는 포괄적인 이메일 인프라의 유지 관리자로 성장해 온 저희의 여정은 놀라웠습니다. 이는 오픈 소스 개발의 힘과 신중하고 잘 관리된 소프트웨어가 더 넓은 생태계에 미칠 수 있는 영향을 보여주는 증거입니다.

앞으로 몇 년 동안 우리는 다음을 위해 노력할 것입니다.

* **기존 패키지를 지속적으로 유지 관리하고 개선하여** 전 세계 개발자에게 안정적인 도구로 남을 수 있도록 노력합니다.
* **이메일 및 보안 분야를 중심으로 주요 인프라 프로젝트에 대한 기여를 확대합니다.**
* **개인정보 보호, 보안 및 투명성에 대한 당사의 약속을 유지하면서 Forward Email의 기능을 강화합니다.**
* 멘토링, 후원 및 커뮤니티 참여를 통해 **차세대 오픈소스 기여자를 지원합니다.**

저희는 소프트웨어 개발의 미래가 개방적이고 협력적이며 신뢰를 기반으로 구축될 것이라고 믿습니다. JavaScript 생태계에 고품질의 보안 중심 패키지를 지속적으로 제공함으로써, 저희는 그러한 미래를 만들어가는 데 조금이나마 기여하고자 합니다.

저희 패키지를 이용해 주시고, 프로젝트에 기여해 주시고, 문제를 보고해 주시거나, 저희의 활동을 널리 알려 주신 모든 분들께 감사드립니다. 여러분의 성원 덕분에 지난 10년간의 영향력을 발휘할 수 있었으며, 앞으로 10년 동안 함께 무엇을 이룰 수 있을지 기대됩니다.

\[^1]: cabin npm 다운로드 통계, 2025년 4월
\[^2]: bson-objectid npm 다운로드 통계, 2025년 2월-3월
\[^3]: url-regex-safe npm 다운로드 통계, 2025년 4월
\[^4]: forwardemail/forwardemail.net의 GitHub 별점(2025년 4월 기준)
\[^5]: preview-email npm 다운로드 통계, 2025년 4월
\[^7]: superagent npm 다운로드 통계, 2025년 2월-3월
\[^8]: supertest npm 다운로드 통계, 2025년 2월-3월
\[^9]: preview-email npm 다운로드 통계, 2025년 2월-3월
\[^10]: cabin npm 다운로드 통계, 2025년 2월-3월
\[^11]: url-regex-safe, 2025년 2-3월
\[^12]: spamscanner npm 다운로드 통계, 2025년 2-3월
\[^13]: npm 통계의 일일 다운로드 패턴, 2025년 4월
\[^14]: npm 통계의 주간 다운로드 패턴, 2025년 4월
\[^15]: nodemailer npm 다운로드 통계, 2025년 4월
\[^16]: <https://github.com/nodemailer/smtp-server/issues/155>
\[^17]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>
\[^18]: <https://github.com/nodemailer/mailparser/issues/261>
\[^19]: <https://github.com/nodemailer/nodemailer/issues/1102>
\[^20]: <https://github.com/postalsys/mailauth/issues/30>
\[^21]: <https://github.com/postalsys/mailauth/issues/58>
\[^22]: <https://github.com/postalsys/mailauth/issues/48>
\[^23]: <https://github.com/postalsys/mailauth/issues/74>
\[^24]: <https://github.com/postalsys/mailauth/issues/75>
\[^25]: <https://github.com/postalsys/mailauth/issues/60>
\[^26]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>0
\[^27]: Upptime 저장소의 GitHub 이슈 기반
\[^28]: Upptime 저장소의 GitHub 이슈 기반
\[^29]: Upptime 저장소의 GitHub 이슈 기반
\[^30]: bree npm 다운로드 통계, 2025년 2월-3월
\[^31]: Upptime에 대한 GitHub 풀 리퀘스트 기반
\[^32]: Upptime에 대한 GitHub 풀 리퀘스트 기반
\[^34]: koa npm 다운로드 통계, 2월-3월 2025
\[^35]: @koa/router npm 다운로드 통계, 2025년 2월-3월
\[^36]: koa-router npm 다운로드 통계, 2025년 2월-3월
\[^37]: url-regex npm 다운로드 통계, 2025년 2월-3월
\[^38]: @breejs/later npm 다운로드 통계, 2025년 2월-3월
\[^39]: email-templates npm 다운로드 통계, 2025년 2월-3월
\[^40]: get-paths npm 다운로드 통계, 2025년 2월-3월
\[^41]: dotenv-parse-variables npm 다운로드 통계, 2025년 2월-3월
\[^42]: @koa/multer npm 다운로드 통계, 2025년 2월-3월