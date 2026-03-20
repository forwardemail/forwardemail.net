# 10년의 영향력: 우리의 npm 패키지가 10억 다운로드를 달성하고 자바스크립트를 형성한 방법 {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" class="rounded-lg" />


## 목차 {#table-of-contents}

* [서문](#foreword)
* [우리를 신뢰하는 개척자들: Isaac Z. Schlueter와 Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [npm의 탄생부터 Node.js 리더십까지](#from-npms-creation-to-nodejs-leadership)
* [코드 뒤의 설계자: Nick Baugh의 여정](#the-architect-behind-the-code-nick-baughs-journey)
  * [Express 기술 위원회 및 핵심 기여](#express-technical-committee-and-core-contributions)
  * [Koa 프레임워크 기여](#koa-framework-contributions)
  * [개별 기여자에서 조직 리더로](#from-individual-contributor-to-organization-leader)
* [우리의 GitHub 조직들: 혁신의 생태계](#our-github-organizations-ecosystems-of-innovation)
  * [Cabin: 현대 애플리케이션을 위한 구조화된 로깅](#cabin-structured-logging-for-modern-applications)
  * [Spam Scanner: 이메일 남용과의 싸움](#spam-scanner-fighting-email-abuse)
  * [Bree: 워커 스레드를 활용한 현대적 작업 스케줄링](#bree-modern-job-scheduling-with-worker-threads)
  * [Forward Email: 오픈 소스 이메일 인프라](#forward-email-open-source-email-infrastructure)
  * [Lad: 필수 Koa 유틸리티 및 도구](#lad-essential-koa-utilities-and-tools)
  * [Upptime: 오픈 소스 가동 시간 모니터링](#upptime-open-source-uptime-monitoring)
* [Forward Email 생태계에 대한 우리의 기여](#our-contributions-to-the-forward-email-ecosystem)
  * [패키지에서 프로덕션까지](#from-packages-to-production)
  * [피드백 루프](#the-feedback-loop)
* [Forward Email의 핵심 원칙: 탁월함을 위한 기반](#forward-emails-core-principles-a-foundation-for-excellence)
  * [항상 개발자 친화적이고, 보안 중심이며, 투명함](#always-developer-friendly-security-focused-and-transparent)
  * [시간이 검증한 소프트웨어 개발 원칙 준수](#adherence-to-time-tested-software-development-principles)
  * [자립형, 부트스트랩 개발자 대상](#targeting-the-scrappy-bootstrapped-developer)
  * [실천 속의 원칙: Forward Email 코드베이스](#principles-in-practice-the-forward-email-codebase)
  * [설계 단계부터의 프라이버시](#privacy-by-design)
  * [지속 가능한 오픈 소스](#sustainable-open-source)
* [숫자는 거짓말하지 않는다: 우리의 놀라운 npm 다운로드 통계](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [우리 영향력의 조감도](#a-birds-eye-view-of-our-impact)
  * [대규모 일일 영향력](#daily-impact-at-scale)
  * [단순 숫자를 넘어서](#beyond-the-raw-numbers)
* [생태계 지원: 우리의 오픈 소스 후원](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: 이메일 인프라 개척자](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: 유틸리티 패키지의 대가](#sindre-sorhus-utility-package-mastermind)
* [자바스크립트 생태계의 보안 취약점 발견](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [Koa-Router 구조](#the-koa-router-rescue)
  * [ReDoS 취약점 대응](#addressing-redos-vulnerabilities)
  * [Node.js 및 Chromium 보안 옹호](#advocating-for-nodejs-and-chromium-security)
  * [npm 인프라 보안 강화](#securing-npm-infrastructure)
* [Forward Email 생태계에 대한 우리의 기여](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Nodemailer 핵심 기능 향상](#enhancing-nodemailers-core-functionality)
  * [Mailauth로 이메일 인증 발전](#advancing-email-authentication-with-mailauth)
  * [주요 Upptime 개선사항](#key-upptime-enhancements)
* [모든 것을 연결하는 접착제: 대규모 맞춤 코드](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [대규모 개발 노력](#a-massive-development-effort)
  * [핵심 의존성 통합](#core-dependencies-integration)
  * [Tangerine과 mx-connect를 활용한 DNS 인프라](#dns-infrastructure-with-tangerine-and-mx-connect)
* [기업 영향력: 오픈 소스에서 미션 크리티컬 솔루션까지](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [미션 크리티컬 이메일 인프라 사례 연구](#case-studies-in-mission-critical-email-infrastructure)
* [10년간의 오픈 소스: 앞으로를 바라보며](#a-decade-of-open-source-looking-forward)
## 서문 {#foreword}

[JavaScript](https://en.wikipedia.org/wiki/JavaScript)와 [Node.js](https://en.wikipedia.org/wiki/Node.js) 세계에서는 일부 패키지가 필수적입니다—매일 수백만 번 다운로드되며 전 세계 앱을 구동합니다. 이러한 도구 뒤에는 오픈 소스 품질에 집중하는 개발자들이 있습니다. 오늘은 저희 팀이 JavaScript 생태계의 핵심 부분이 된 npm 패키지를 어떻게 구축하고 유지하는지 보여드리겠습니다.


## 우리를 신뢰하는 개척자들: Isaac Z. Schlueter와 Forward Email {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

저희는 [Isaac Z. Schlueter](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs))를 사용자로 모시게 되어 자랑스럽습니다. Isaac은 [npm](https://en.wikipedia.org/wiki/Npm_\(software\))을 만들었고 [Node.js](https://en.wikipedia.org/wiki/Node.js) 구축에 기여했습니다. Forward Email에 대한 그의 신뢰는 저희가 품질과 보안에 집중하고 있음을 보여줍니다. Isaac은 izs.me를 포함한 여러 도메인에 Forward Email을 사용합니다.

Isaac이 JavaScript에 끼친 영향은 매우 큽니다. 2009년 그는 Node.js의 잠재력을 가장 먼저 알아본 사람 중 하나로, 플랫폼을 만든 [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl)과 함께 일했습니다. Isaac이 [Increment 매거진과의 인터뷰](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/)에서 말했듯이: "서버 사이드 JS를 어떻게 구현할지 고민하는 아주 작은 커뮤니티 한가운데서, Ryan Dahl이 Node를 내놓았는데, 그것이 명확히 올바른 접근법이었습니다. 저는 그쪽에 올인했고 2009년 중반쯤 매우 깊이 관여하게 되었습니다."

> \[!NOTE]
> Node.js의 역사에 관심 있는 분들을 위해, 개발 과정을 다룬 훌륭한 다큐멘터리가 있습니다. [The Story of Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0)와 [10 Things I Regret About Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I) 등이 그것입니다. Ryan Dahl의 [개인 웹사이트](https://tinyclouds.org/)에도 그의 작업에 대한 귀중한 통찰이 담겨 있습니다.

### npm 창립부터 Node.js 리더십까지 {#from-npms-creation-to-nodejs-leadership}

Isaac은 2009년 9월에 npm을 만들었고, 첫 사용 가능한 버전은 2010년 초에 출시되었습니다. 이 패키지 매니저는 Node.js에서 중요한 필요를 채워 개발자들이 코드를 쉽게 공유하고 재사용할 수 있게 했습니다. [Node.js 위키피디아 페이지](https://en.wikipedia.org/wiki/Node.js)에 따르면, "2010년 1월, Node.js 환경을 위한 패키지 매니저인 npm이 도입되었습니다. 이 패키지 매니저는 프로그래머가 Node.js 패키지와 함께 소스 코드를 게시하고 공유할 수 있게 하며, 패키지 설치, 업데이트, 제거를 간소화하도록 설계되었습니다."

2012년 1월 Ryan Dahl이 Node.js에서 물러나자 Isaac이 프로젝트 리더를 맡았습니다. [그의 이력서](https://izs.me/resume)에 따르면, 그는 "CommonJS 모듈 시스템, 파일 시스템 API, 스트림 등 여러 핵심 Node.js 코어 API 개발을 주도했고" "2년간 프로젝트의 BDFL(평생 자비로운 독재자)로 활동하며 Node.js 버전 v0.6부터 v0.10까지 품질과 안정적인 빌드 프로세스를 보장했다"고 합니다.

Isaac은 Node.js의 중요한 성장기를 이끌며 오늘날까지 플랫폼을 형성하는 기준을 세웠습니다. 이후 2014년에 npm 레지스트리를 지원하기 위해 npm, Inc.를 설립했으며, 이전에는 혼자서 운영했습니다.

저희는 Isaac의 JavaScript에 대한 막대한 기여에 감사드리며, 그가 만든 많은 패키지를 계속 사용하고 있습니다. 그의 작업은 소프트웨어 구축 방식과 전 세계 수백만 개발자가 코드를 공유하는 방식을 바꾸어 놓았습니다.


## 코드 뒤의 설계자: Nick Baugh의 여정 {#the-architect-behind-the-code-nick-baughs-journey}

저희 오픈 소스 성공의 중심에는 Forward Email의 창립자이자 소유주인 Nick Baugh가 있습니다. 그의 JavaScript 작업은 거의 20년에 걸쳐 수많은 개발자가 앱을 구축하는 방식을 형성했습니다. 그의 오픈 소스 여정은 기술적 역량과 커뮤니티 리더십을 모두 보여줍니다.

### Express 기술 위원회 및 핵심 기여 {#express-technical-committee-and-core-contributions}

Nick의 웹 프레임워크 전문성은 그를 [Express 기술 위원회](https://expressjs.com/en/resources/community.html)에 합류하게 했으며, 여기서 그는 가장 많이 사용되는 Node.js 프레임워크 중 하나를 지원했습니다. Nick은 현재 [Express 커뮤니티 페이지](https://expressjs.com/en/resources/community.html)에서 비활성 멤버로 등재되어 있습니다.
> \[!IMPORTANT]
> Express는 원래 Node.js 생태계의 많은 부분을 형성한 다작 오픈 소스 기여자인 TJ Holowaychuk에 의해 만들어졌습니다. 우리는 TJ의 기초 작업에 감사하며 그의 광범위한 오픈 소스 기여에서 [휴식을 취하기로 한 결정](https://news.ycombinator.com/item?id=37687017)을 존중합니다.

[Express 기술 위원회](https://expressjs.com/en/resources/community.html) 멤버로서 Nick은 `req.originalUrl` 문서 명확화 및 멀티파트 폼 처리 문제 수정과 같은 이슈에서 세심한 주의를 기울였습니다.

### Koa Framework Contributions {#koa-framework-contributions}

Nick이 [Koa 프레임워크](https://github.com/koajs/koa)와 함께한 작업은—Express의 현대적이고 가벼운 대안으로 역시 TJ Holowaychuk가 만든—더 나은 웹 개발 도구에 대한 그의 헌신을 보여줍니다. 그의 Koa 기여는 이슈와 풀 리퀘스트를 통한 코드 모두를 포함하며, 오류 처리, 콘텐츠 타입 관리, 문서 개선을 다룹니다.

Express와 Koa 모두에서의 그의 작업은 Node.js 웹 개발에 대한 독특한 시각을 제공하여, 여러 프레임워크 생태계와 잘 작동하는 패키지를 만드는 데 팀에 도움을 줍니다.

### From Individual Contributor to Organization Leader {#from-individual-contributor-to-organization-leader}

기존 프로젝트를 돕는 것에서 시작해 전체 패키지 생태계를 만들고 유지하는 것으로 성장했습니다. Nick은 JavaScript 커뮤니티의 특정 요구를 해결하는 여러 GitHub 조직—[Cabin](https://github.com/cabinjs), [Spam Scanner](https://github.com/spamscanner), [Forward Email](https://github.com/forwardemail), [Lad](https://github.com/ladjs), [Bree](https://github.com/breejs)—을 설립했습니다.

기여자에서 리더로의 이 전환은 실제 문제를 해결하는 잘 설계된 소프트웨어에 대한 Nick의 비전을 보여줍니다. 관련 패키지를 집중된 GitHub 조직 아래에 조직함으로써, 그는 더 넓은 개발자 커뮤니티를 위해 모듈화되고 유연한 동시에 함께 작동하는 도구 생태계를 구축했습니다.


## Our GitHub Organizations: Ecosystems of Innovation {#our-github-organizations-ecosystems-of-innovation}

우리는 JavaScript의 특정 요구를 해결하는 집중된 GitHub 조직을 중심으로 오픈 소스 작업을 조직합니다. 이 구조는 모듈성을 유지하면서도 잘 작동하는 응집력 있는 패키지 가족을 만듭니다.

### Cabin: Structured Logging for Modern Applications {#cabin-structured-logging-for-modern-applications}

[Cabin 조직](https://github.com/cabinjs)은 간단하고 강력한 앱 로깅에 대한 우리의 접근입니다. 주요 [`cabin`](https://github.com/cabinjs/cabin) 패키지는 거의 900개의 GitHub 스타와 주간 100,000회 이상의 다운로드를 기록하고 있습니다\[^1]. Cabin은 Sentry, LogDNA, Papertrail과 같은 인기 서비스와 함께 작동하는 구조화된 로깅을 제공합니다.

Cabin의 특별함은 사려 깊은 API와 플러그인 시스템에 있습니다. Express 미들웨어용 [`axe`](https://github.com/cabinjs/axe)와 HTTP 요청 파싱용 [`parse-request`](https://github.com/cabinjs/parse-request) 같은 지원 패키지는 고립된 도구가 아닌 완전한 솔루션에 대한 우리의 헌신을 보여줍니다.

[`bson-objectid`](https://github.com/cabinjs/bson-objectid) 패키지는 특별히 언급할 만하며, 단 2개월 만에 170만 회 이상의 다운로드를 기록했습니다\[^2]. 이 가벼운 MongoDB ObjectID 구현은 전체 MongoDB 의존성 없이 ID가 필요한 개발자들의 필수 도구가 되었습니다.

### Spam Scanner: Fighting Email Abuse {#spam-scanner-fighting-email-abuse}

[Spam Scanner 조직](https://github.com/spamscanner)은 실제 문제 해결에 대한 우리의 헌신을 보여줍니다. 주요 [`spamscanner`](https://github.com/spamscanner/spamscanner) 패키지는 고급 이메일 스팸 탐지를 제공하지만, 놀라운 채택률을 보인 것은 [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe) 패키지입니다.

2개월 만에 120만 회 이상의 다운로드를 기록한\[^3] `url-regex-safe`는 다른 URL 탐지 정규식의 치명적인 보안 문제를 해결합니다. 이 패키지는 공통 문제(이 경우 URL 검증의 [ReDoS](https://en.wikipedia.org/wiki/ReDoS) 취약점)를 찾아 견고한 솔루션을 만들고 신중하게 유지하는 우리의 오픈 소스 접근 방식을 보여줍니다.
### Bree: 워커 스레드를 이용한 현대적인 작업 스케줄링 {#bree-modern-job-scheduling-with-worker-threads}

[Bree 조직](https://github.com/breejs)은 Node.js에서 흔히 겪는 문제인 신뢰할 수 있는 작업 스케줄링에 대한 우리의 해답입니다. 3,100개 이상의 GitHub 스타를 보유한 주요 [`bree`](https://github.com/breejs/bree) 패키지는 더 나은 성능과 신뢰성을 위해 Node.js 워커 스레드를 사용하는 현대적인 작업 스케줄러를 제공합니다.

> \[!NOTE]
> Bree는 우리가 [Agenda](https://github.com/agenda/agenda) 유지보수를 도운 후에 만들어졌으며, 배운 교훈을 적용해 더 나은 작업 스케줄러를 구축했습니다. 우리의 Agenda 기여는 작업 스케줄링을 개선할 방법을 찾는 데 도움이 되었습니다.

Bree가 Agenda 같은 다른 스케줄러와 다른 점:

* **외부 의존성 없음**: MongoDB가 필요한 Agenda와 달리, Bree는 작업 상태 관리를 위해 Redis나 MongoDB가 필요하지 않습니다.
* **워커 스레드**: Bree는 Node.js 워커 스레드를 사용해 샌드박스 프로세스를 제공하며, 더 나은 격리와 성능을 제공합니다.
* **간단한 API**: Bree는 복잡한 스케줄링 요구사항을 쉽게 구현할 수 있도록 상세한 제어와 단순함을 제공합니다.
* **내장 지원**: 우아한 재시작, 크론 작업, 날짜, 사람이 이해하기 쉬운 시간 등이 기본으로 포함되어 있습니다.

Bree는 [forwardemail.net](https://github.com/forwardemail/forwardemail.net)의 핵심 부분으로, 이메일 처리, 정리, 예약된 유지보수 같은 중요한 백그라운드 작업을 처리합니다. Forward Email에서 Bree를 사용하는 것은 우리가 직접 만든 도구를 프로덕션에서 사용하며 높은 신뢰성 기준을 충족함을 보여줍니다.

우리는 또한 [piscina](https://github.com/piscinajs/piscina) 같은 훌륭한 워커 스레드 패키지와 [undici](https://github.com/nodejs/undici) 같은 HTTP 클라이언트도 사용하고 높이 평가합니다. Piscina는 Bree처럼 효율적인 작업 처리를 위해 Node.js 워커 스레드를 사용합니다. undici와 piscina를 모두 유지하는 [Matteo Collina](https://github.com/mcollina)에게 Node.js에 대한 큰 기여에 감사드립니다. Matteo는 Node.js 기술 운영 위원회에서 활동하며 Node.js의 HTTP 클라이언트 기능을 크게 향상시켰습니다.

### Forward Email: 오픈 소스 이메일 인프라 {#forward-email-open-source-email-infrastructure}

우리의 가장 야심찬 프로젝트는 이메일 전달, 저장, API 서비스를 제공하는 오픈 소스 이메일 서비스인 [Forward Email](https://github.com/forwardemail)입니다. 주요 저장소는 1,100개 이상의 GitHub 스타\[^4]를 보유하고 있어 독점 이메일 서비스에 대한 대안으로서 커뮤니티의 인정을 받고 있습니다.

이 조직의 [`preview-email`](https://github.com/forwardemail/preview-email) 패키지는 두 달 만에 250만 회 이상의 다운로드\[^5]를 기록하며 이메일 템플릿 작업을 하는 개발자들에게 필수 도구가 되었습니다. 개발 중 이메일을 간단히 미리 볼 수 있게 하여 이메일 기능이 포함된 애플리케이션 개발 시 흔한 어려움을 해결합니다.

### Lad: 필수 Koa 유틸리티 및 도구 {#lad-essential-koa-utilities-and-tools}

[Lad 조직](https://github.com/ladjs)은 주로 Koa 프레임워크 생태계 향상에 중점을 둔 필수 유틸리티와 도구 모음을 제공합니다. 이 패키지들은 웹 개발에서 흔히 겪는 문제를 해결하며, 독립적으로도 유용하면서도 함께 원활하게 작동하도록 설계되었습니다.

#### koa-better-error-handler: Koa를 위한 향상된 에러 처리 {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler)는 Koa 애플리케이션을 위한 더 나은 에러 처리 솔루션을 제공합니다. 50개 이상의 GitHub 스타를 보유한 이 패키지는 `ctx.throw`가 사용자 친화적인 에러 메시지를 생성하도록 하며 Koa 내장 에러 핸들러의 여러 한계를 해결합니다:

* Node.js DNS 에러, Mongoose 에러, Redis 에러를 감지하고 적절히 처리
* 일관되고 잘 포맷된 에러 응답 생성을 위해 [Boom](https://github.com/hapijs/boom) 사용
* 헤더 보존 (Koa 내장 핸들러와 달리)
* 기본값 500 대신 적절한 상태 코드 유지
* 플래시 메시지 및 세션 보존 지원
* 검증 에러에 대한 HTML 에러 목록 제공
* 여러 응답 타입 지원 (HTML, JSON, 일반 텍스트)
이 패키지는 Koa 애플리케이션에서 포괄적인 오류 관리를 위해 [`koa-404-handler`](https://github.com/ladjs/koa-404-handler)와 함께 사용할 때 특히 유용합니다.

#### passport: Lad를 위한 인증 {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport)는 인기 있는 Passport.js 인증 미들웨어를 현대 웹 애플리케이션에 맞춘 특정 향상 기능과 함께 확장합니다. 이 패키지는 기본적으로 여러 인증 전략을 지원합니다:

* 이메일을 이용한 로컬 인증
* Apple 로그인
* GitHub 인증
* Google 인증
* 일회용 비밀번호(OTP) 인증

이 패키지는 매우 커스터마이징이 가능하여 개발자가 필드 이름과 문구를 애플리케이션 요구사항에 맞게 조정할 수 있습니다. 사용자 관리를 위해 Mongoose와 원활하게 통합되도록 설계되어, 견고한 인증이 필요한 Koa 기반 애플리케이션에 이상적인 솔루션입니다.

#### graceful: 우아한 애플리케이션 종료 {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful)는 Node.js 애플리케이션을 우아하게 종료하는 중요한 문제를 해결합니다. 70개 이상의 GitHub 스타를 보유한 이 패키지는 데이터 손실이나 연결 유지를 방지하며 애플리케이션이 깔끔하게 종료될 수 있도록 보장합니다. 주요 기능은 다음과 같습니다:

* HTTP 서버(Express/Koa/Fastify)의 우아한 종료 지원
* 데이터베이스 연결(MongoDB/Mongoose)의 깔끔한 종료
* Redis 클라이언트의 적절한 종료
* Bree 작업 스케줄러 처리
* 사용자 정의 종료 핸들러 지원
* 구성 가능한 타임아웃 설정
* 로깅 시스템과의 통합

이 패키지는 예기치 않은 종료가 데이터 손실이나 손상을 초래할 수 있는 프로덕션 애플리케이션에 필수적입니다. 적절한 종료 절차를 구현함으로써 `@ladjs/graceful`은 애플리케이션의 신뢰성과 안정성을 보장하는 데 도움을 줍니다.

### Upptime: 오픈 소스 가동 시간 모니터링 {#upptime-open-source-uptime-monitoring}

[Upptime 조직](https://github.com/upptime)은 투명하고 오픈 소스 모니터링에 대한 우리의 의지를 나타냅니다. 주요 [`upptime`](https://github.com/upptime/upptime) 저장소는 13,000개 이상의 GitHub 스타를 보유하여 우리가 기여하는 가장 인기 있는 프로젝트 중 하나입니다. Upptime은 서버 없이 완전히 작동하는 GitHub 기반 가동 시간 모니터 및 상태 페이지를 제공합니다.

우리는 <https://status.forwardemail.net>에서 자체 상태 페이지로 Upptime을 사용하며, 소스 코드는 <https://github.com/forwardemail/status.forwardemail.net>에서 확인할 수 있습니다.

Upptime의 특별한 점은 그 아키텍처에 있습니다:

* **100% 오픈 소스**: 모든 구성 요소가 완전히 오픈 소스이며 커스터마이징 가능합니다.
* **GitHub 기반**: GitHub Actions, Issues, Pages를 활용한 서버리스 모니터링 솔루션입니다.
* **서버 불필요**: 기존 모니터링 도구와 달리 Upptime은 서버를 운영하거나 유지할 필요가 없습니다.
* **자동 상태 페이지**: GitHub Pages에 호스팅할 수 있는 아름다운 상태 페이지를 생성합니다.
* **강력한 알림 기능**: 이메일, SMS, Slack 등 다양한 알림 채널과 통합됩니다.

사용자 경험을 향상시키기 위해, 우리는 [@octokit/core](https://github.com/octokit/core.js/)를 forwardemail.net 코드베이스에 통합하여 실시간 상태 업데이트와 사고를 웹사이트에 직접 렌더링합니다. 이 통합은 전체 스택(웹사이트, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree 등)에서 발생하는 문제에 대해 즉각적인 토스트 알림, 배지 아이콘 변경, 경고 색상 등으로 사용자에게 명확한 투명성을 제공합니다.

@octokit/core 라이브러리는 Upptime GitHub 저장소에서 실시간 데이터를 가져와 처리하고 사용자 친화적인 방식으로 표시할 수 있게 해줍니다. 서비스에 장애나 성능 저하가 발생하면 사용자는 메인 애플리케이션을 떠나지 않고도 시각적 표시를 통해 즉시 알림을 받습니다. 이 원활한 통합은 사용자가 항상 시스템 상태에 대한 최신 정보를 얻을 수 있도록 하여 투명성과 신뢰를 높입니다.

Upptime은 투명하고 신뢰할 수 있는 서비스 모니터링 및 상태 커뮤니케이션 방법을 찾는 수백 개 조직에서 채택되었습니다. 이 프로젝트의 성공은 기존 인프라(이 경우 GitHub)를 활용하여 새로운 방식으로 일반적인 문제를 해결하는 도구를 구축하는 힘을 보여줍니다.
## Forward Email 생태계에 대한 우리의 기여 {#our-contributions-to-the-forward-email-ecosystem}

우리의 오픈 소스 패키지는 전 세계 개발자들이 사용하지만, 동시에 Forward Email 서비스의 기반을 형성합니다. 이러한 이중 역할—도구의 제작자이자 사용자로서—은 실제 적용에 대한 독특한 관점을 제공하며 지속적인 개선을 촉진합니다.

### 패키지에서 프로덕션까지 {#from-packages-to-production}

개별 패키지에서 통합된 프로덕션 시스템으로의 여정은 신중한 통합과 확장을 포함합니다. Forward Email의 경우, 이 과정은 다음을 포함합니다:

* **맞춤 확장**: 고유한 요구사항을 해결하기 위해 Forward Email 전용 오픈 소스 패키지 확장 구축
* **통합 패턴**: 프로덕션 환경에서 이 패키지들이 상호작용하는 방식에 대한 패턴 개발
* **성능 최적화**: 대규모에서만 나타나는 성능 병목 현상 식별 및 해결
* **보안 강화**: 이메일 처리 및 사용자 데이터 보호에 특화된 추가 보안 계층 추가

이 작업은 핵심 패키지 자체를 넘어 수천 시간의 개발을 의미하며, 우리의 오픈 소스 기여의 장점을 활용하는 견고하고 안전한 이메일 서비스를 만들어냅니다.

### 피드백 루프 {#the-feedback-loop}

자체 패키지를 프로덕션에서 사용하는 가장 가치 있는 측면은 피드백 루프입니다. Forward Email에서 한계나 예외 상황을 발견할 때 단순히 로컬에서 패치하는 것이 아니라, 근본 패키지를 개선하여 우리 서비스와 더 넓은 커뮤니티 모두에게 이익을 줍니다.

이 접근법은 다음과 같은 수많은 개선으로 이어졌습니다:

* **Bree의 우아한 종료**: 무중단 배포를 위한 Forward Email의 요구로 Bree의 우아한 종료 기능이 향상됨
* **Spam Scanner의 패턴 인식**: Forward Email에서 발견된 실제 스팸 패턴이 Spam Scanner의 탐지 알고리즘에 반영됨
* **Cabin의 성능 최적화**: 프로덕션에서의 대량 로깅이 Cabin의 최적화 기회를 발견하여 모든 사용자에게 혜택 제공

오픈 소스 작업과 프로덕션 서비스 간의 이 선순환을 유지함으로써, 우리의 패키지는 이론적 구현이 아닌 실용적이고 검증된 솔루션으로 남습니다.


## Forward Email의 핵심 원칙: 탁월함을 위한 기반 {#forward-emails-core-principles-a-foundation-for-excellence}

Forward Email은 모든 개발 결정을 안내하는 핵심 원칙에 따라 설계되었습니다. 이 원칙들은 [웹사이트](/blog/docs/best-quantum-safe-encrypted-email-service#principles)에 자세히 설명되어 있으며, 서비스가 개발자 친화적이고 안전하며 사용자 프라이버시에 집중하도록 보장합니다.

### 항상 개발자 친화적이고, 보안 중심이며, 투명함 {#always-developer-friendly-security-focused-and-transparent}

우리의 가장 중요한 원칙은 최고 수준의 보안과 프라이버시를 유지하면서 개발자 친화적인 소프트웨어를 만드는 것입니다. 기술적 우수성이 사용성 희생 없이 이루어져야 하며, 투명성이 커뮤니티와의 신뢰를 구축한다고 믿습니다.

이 원칙은 상세한 문서, 명확한 오류 메시지, 성공과 도전 모두에 대한 개방적 소통에서 드러납니다. 전체 코드베이스를 오픈 소스로 공개함으로써 검토와 협업을 초대하여 소프트웨어와 생태계 모두를 강화합니다.

### 검증된 소프트웨어 개발 원칙 준수 {#adherence-to-time-tested-software-development-principles}

우리는 수십 년간 그 가치를 입증한 여러 소프트웨어 개발 원칙을 따릅니다:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: 모델-뷰-컨트롤러 패턴을 통한 관심사의 분리
* **[Unix Philosophy](https://en.wikipedia.org/wiki/Unix_philosophy)**: 하나의 작업을 잘 수행하는 모듈형 컴포넌트 생성
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: 단순하고 직관적으로 유지
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: 중복을 피하고 코드 재사용 촉진
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: 불필요한 기능은 미리 구현하지 않음
* **[Twelve Factor](https://12factor.net/)**: 현대적이고 확장 가능한 애플리케이션 구축을 위한 모범 사례 준수
* **[Occam's razor](https://en.wikipedia.org/wiki/Occam%27s_razor)**: 요구사항을 충족하는 가장 단순한 해결책 선택
* **[Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: 자사 제품을 광범위하게 사용하기
이 원칙들은 단순한 이론적 개념이 아니라 우리의 일상 개발 관행에 깊이 내재되어 있습니다. 예를 들어, Unix 철학을 준수하는 방식은 우리가 npm 패키지를 구성한 방식에서 명확히 드러납니다: 작고 집중된 모듈들이 복잡한 문제를 해결하기 위해 함께 조합될 수 있습니다.

### 자립형, 부트스트랩 개발자 타겟팅 {#targeting-the-scrappy-bootstrapped-developer}

우리는 특히 자립형, 부트스트랩, 그리고 [라면 수익성(https://www.paulgraham.com/ramenprofitable.html)](https://www.paulgraham.com/ramenprofitable.html)을 가진 개발자를 타겟팅합니다. 이러한 초점은 우리의 가격 모델부터 기술적 결정에 이르기까지 모든 것을 형성합니다. 우리는 제한된 자원으로 제품을 만드는 어려움을 잘 이해하고 있습니다. 왜냐하면 우리도 그런 경험을 했기 때문입니다.

이 원칙은 오픈 소스 접근 방식에서 특히 중요합니다. 우리는 기업 예산이 없는 개발자들을 위해 실제 문제를 해결하는 패키지를 만들고 유지하며, 자원에 상관없이 모두가 강력한 도구를 사용할 수 있도록 합니다.

### 실천 속의 원칙: Forward Email 코드베이스 {#principles-in-practice-the-forward-email-codebase}

이 원칙들은 Forward Email 코드베이스에서 명확히 볼 수 있습니다. 우리의 package.json 파일은 핵심 가치에 부합하도록 신중하게 선택된 의존성을 보여줍니다:

* 이메일 인증을 위한 `mailauth` 같은 보안 중심 패키지
* 디버깅을 쉽게 하는 `preview-email` 같은 개발자 친화적 도구
* Sindre Sorhus의 다양한 `p-*` 유틸리티 같은 모듈형 컴포넌트

이 원칙들을 일관되게 지켜온 덕분에, 우리는 개발자들이 이메일 인프라를 신뢰할 수 있는 서비스—안전하고, 신뢰할 수 있으며, 오픈 소스 커뮤니티의 가치에 부합하는—를 구축할 수 있었습니다.

### 설계 단계부터의 프라이버시 {#privacy-by-design}

프라이버시는 Forward Email에서 사후 고려사항이나 마케팅 기능이 아니라, 서비스와 코드의 모든 측면을 안내하는 근본적인 설계 원칙입니다:

* **제로 액세스 암호화**: 사용자의 이메일을 우리가 읽는 것이 기술적으로 불가능한 시스템을 구현했습니다.
* **최소한의 데이터 수집**: 서비스 제공에 필요한 데이터만 수집하며 그 이상은 수집하지 않습니다.
* **투명한 정책**: 우리의 개인정보 보호정책은 법률 용어 없이 명확하고 이해하기 쉬운 언어로 작성되어 있습니다.
* **오픈 소스 검증**: 우리의 오픈 소스 코드베이스는 보안 연구자들이 우리의 프라이버시 주장을 검증할 수 있도록 합니다.

이러한 약속은 보안과 프라이버시 최선의 관행이 처음부터 내장된 오픈 소스 패키지에도 확장됩니다.

### 지속 가능한 오픈 소스 {#sustainable-open-source}

우리는 오픈 소스 소프트웨어가 장기적으로 번영하기 위해서는 지속 가능한 모델이 필요하다고 믿습니다. 우리의 접근법은 다음을 포함합니다:

* **상업적 지원**: 오픈 소스 도구에 대한 프리미엄 지원 및 서비스를 제공합니다.
* **균형 잡힌 라이선스**: 사용자 자유와 프로젝트 지속 가능성을 모두 보호하는 라이선스를 사용합니다.
* **커뮤니티 참여**: 기여자들과 적극적으로 소통하여 지원하는 커뮤니티를 구축합니다.
* **투명한 로드맵**: 개발 계획을 공유하여 사용자가 이에 맞춰 계획할 수 있도록 합니다.

지속 가능성에 집중함으로써, 우리의 오픈 소스 기여가 방치되지 않고 시간이 지남에 따라 계속 성장하고 개선될 수 있도록 보장합니다.


## 숫자는 거짓말하지 않는다: 우리의 놀라운 npm 다운로드 통계 {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

오픈 소스 소프트웨어의 영향력을 이야기할 때, 다운로드 통계는 채택과 신뢰의 구체적인 척도를 제공합니다. 우리가 유지하는 많은 패키지는 수십억 건의 누적 다운로드 수를 기록하며, 이는 거의 모든 오픈 소스 프로젝트가 달성하기 어려운 규모입니다.

![Top npm Packages by Downloads](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> 우리는 JavaScript 생태계에서 매우 많이 다운로드된 여러 패키지 유지에 기여하고 있다는 점을 자랑스럽게 생각하지만, 이들 중 많은 패키지가 원래 다른 재능 있는 개발자들에 의해 만들어졌음을 인정하고자 합니다. 예를 들어 superagent와 supertest는 원래 TJ Holowaychuk가 만들었으며, 그의 풍부한 오픈 소스 기여는 Node.js 생태계 형성에 중요한 역할을 했습니다.
### 우리의 영향력 한눈에 보기 {#a-birds-eye-view-of-our-impact}

2025년 2월부터 3월까지 단 두 달 동안, 우리가 기여하고 유지하는 주요 패키지들은 엄청난 다운로드 수를 기록했습니다:

* **[superagent](https://www.npmjs.com/package/superagent)**: 84,575,829 다운로드\[^7] (원래 TJ Holowaychuk가 제작)
* **[supertest](https://www.npmjs.com/package/supertest)**: 76,432,591 다운로드\[^8] (원래 TJ Holowaychuk가 제작)
* **[koa](https://www.npmjs.com/package/koa)**: 28,539,295 다운로드\[^34] (원래 TJ Holowaychuk가 제작)
* **[@koa/router](https://www.npmjs.com/package/@koa/router)**: 11,007,327 다운로드\[^35]
* **[koa-router](https://www.npmjs.com/package/koa-router)**: 3,498,918 다운로드\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)**: 2,819,520 다운로드\[^37]
* **[preview-email](https://www.npmjs.com/package/preview-email)**: 2,500,000 다운로드\[^9]
* **[cabin](https://www.npmjs.com/package/cabin)**: 1,800,000 다운로드\[^10]
* **[@breejs/later](https://www.npmjs.com/package/@breejs/later)**: 1,709,938 다운로드\[^38]
* **[email-templates](https://www.npmjs.com/package/email-templates)**: 1,128,139 다운로드\[^39]
* **[get-paths](https://www.npmjs.com/package/get-paths)**: 1,124,686 다운로드\[^40]
* **[url-regex-safe](https://www.npmjs.com/package/url-regex-safe)**: 1,200,000 다운로드\[^11]
* **[dotenv-parse-variables](https://www.npmjs.com/package/dotenv-parse-variables)**: 894,666 다운로드\[^41]
* **[@koa/multer](https://www.npmjs.com/package/@koa/multer)**: 839,585 다운로드\[^42]
* **[spamscanner](https://www.npmjs.com/package/spamscanner)**: 145,000 다운로드\[^12]
* **[bree](https://www.npmjs.com/package/bree)**: 24,270 다운로드\[^30]

> \[!NOTE]
> 우리가 유지 관리하지만 직접 만들지 않은 다른 여러 패키지들은 더 높은 다운로드 수를 기록하고 있습니다. 예를 들어 `form-data` (7억 3,800만+ 다운로드), `toidentifier` (3억 900만+ 다운로드), `stackframe` (1억 1,600만+ 다운로드), `error-stack-parser` (1억 1,300만+ 다운로드) 등이 있습니다. 우리는 이 패키지들에 기여할 수 있어 영광이며, 원저자의 노력을 존중합니다.

이 숫자들은 단순히 인상적인 수치가 아니라, 우리가 유지하는 코드로 실제 개발자들이 실제 문제를 해결하고 있음을 의미합니다. 모든 다운로드는 이 패키지들이 취미 프로젝트부터 수백만 명이 사용하는 기업용 애플리케이션까지 의미 있는 무언가를 만드는 데 도움을 준 사례입니다.

![Package Categories Distribution](/img/art/category_pie_chart.svg)

### 대규모 일일 영향력 {#daily-impact-at-scale}

일일 다운로드 패턴은 일관되고 대량의 사용을 보여주며, 하루 수백만 다운로드에 달하는 피크를 기록합니다\[^13]. 이러한 일관성은 이 패키지들의 안정성과 신뢰성을 나타냅니다—개발자들은 단순히 시도하는 것이 아니라 핵심 워크플로우에 통합하고 매일 의존합니다.

주간 다운로드 패턴은 더욱 인상적이며, 매주 수천만 다운로드를 꾸준히 유지합니다\[^14]. 이는 전 세계 프로덕션 환경에서 이 패키지들이 광범위하게 사용되고 있음을 의미합니다.

### 단순한 숫자를 넘어서 {#beyond-the-raw-numbers}

다운로드 통계는 그 자체로도 인상적이지만, 이 패키지들에 대한 커뮤니티의 신뢰를 더 깊이 보여줍니다. 이 규모의 패키지를 유지하려면 다음에 대한 확고한 헌신이 필요합니다:

* **하위 호환성**: 기존 구현을 깨뜨리지 않도록 변경 사항을 신중히 고려해야 합니다.
* **보안**: 수백만 애플리케이션이 의존하는 만큼, 보안 취약점은 광범위한 영향을 미칠 수 있습니다.
* **성능**: 이 규모에서는 작은 성능 개선도 큰 누적 효과를 가져옵니다.
* **문서화**: 모든 경험 수준의 개발자가 사용할 수 있도록 명확하고 포괄적인 문서가 필수적입니다.

시간에 따른 다운로드 수의 꾸준한 증가는 이러한 약속을 지키며, 신뢰할 수 있고 잘 유지되는 패키지를 통해 개발자 커뮤니티와 신뢰를 쌓아온 성공을 반영합니다.
## 생태계 지원: 우리의 오픈 소스 후원 {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> 오픈 소스 지속 가능성은 단순히 코드를 기여하는 것만이 아니라, 중요한 인프라를 유지하는 개발자들을 지원하는 것이기도 합니다.

자바스크립트 생태계에 대한 직접적인 기여를 넘어, 우리는 많은 현대 애플리케이션의 기반을 형성하는 저명한 Node.js 기여자들을 후원하게 된 것을 자랑스럽게 생각합니다. 우리의 후원 대상은 다음과 같습니다:

### Andris Reinman: 이메일 인프라 개척자 {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9)는 Node.js용 가장 인기 있는 이메일 전송 라이브러리인 [Nodemailer](https://github.com/nodemailer/nodemailer)의 창시자로, 주간 다운로드 수가 1,400만 회를 넘습니다\[^15]. 그의 작업은 [SMTP Server](https://github.com/nodemailer/smtp-server), [Mailparser](https://github.com/nodemailer/mailparser), [WildDuck](https://github.com/nodemailer/wildduck)와 같은 다른 중요한 이메일 인프라 구성 요소로도 확장됩니다.

우리의 후원은 수많은 Node.js 애플리케이션, 포함하여 우리 자체 Forward Email 서비스의 이메일 통신을 지원하는 이 필수 도구들의 지속적인 유지보수와 개발을 보장하는 데 도움을 줍니다.

### Sindre Sorhus: 유틸리티 패키지의 대가 {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus)는 자바스크립트 생태계에서 가장 다작하는 오픈 소스 기여자 중 한 명으로, 1,000개 이상의 npm 패키지를 보유하고 있습니다. 그의 유틸리티들인 [p-map](https://github.com/sindresorhus/p-map), [p-retry](https://github.com/sindresorhus/p-retry), [is-stream](https://github.com/sindresorhus/is-stream)은 Node.js 생태계 전반에서 사용되는 기본 빌딩 블록입니다.

Sindre의 작업을 후원함으로써, 우리는 자바스크립트 개발을 더 효율적이고 신뢰할 수 있게 만드는 이 중요한 유틸리티들의 개발을 지속할 수 있도록 돕습니다.

이러한 후원은 더 넓은 오픈 소스 생태계에 대한 우리의 헌신을 반영합니다. 우리는 우리의 성공이 이들 및 다른 기여자들이 쌓아온 기반 위에 세워졌음을 인식하며, 전체 생태계의 지속 가능성을 보장하는 데 전념하고 있습니다.


## 자바스크립트 생태계의 보안 취약점 발견 {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

우리의 오픈 소스에 대한 헌신은 기능 개발을 넘어 수백만 개발자에게 영향을 미칠 수 있는 보안 취약점을 식별하고 해결하는 데까지 확장됩니다. 자바스크립트 생태계에 대한 우리의 가장 중요한 기여 중 다수는 보안 분야에서 이루어졌습니다.

### Koa-Router 구출 {#the-koa-router-rescue}

2019년 2월, Nick은 인기 있는 koa-router 패키지의 유지보수에 심각한 문제가 있음을 발견했습니다. 그가 [Hacker News에 보고한 바와 같이](https://news.ycombinator.com/item?id=19156707), 이 패키지는 원래 유지관리자가 포기하여 보안 취약점이 해결되지 않고 커뮤니티에 업데이트가 제공되지 않고 있었습니다.

> \[!WARNING]
> 보안 취약점이 있는 방치된 패키지는 주간 수백만 번 다운로드될 때 전체 생태계에 심각한 위험을 초래합니다.

이에 대응하여 Nick은 [@koa/router](https://github.com/koajs/router)를 만들고 상황에 대해 커뮤니티에 경고했습니다. 이후로 그는 이 중요한 패키지를 유지보수하며 Koa 사용자들이 안전하고 잘 관리되는 라우팅 솔루션을 사용할 수 있도록 보장하고 있습니다.

### ReDoS 취약점 대응 {#addressing-redos-vulnerabilities}

2020년, Nick은 널리 사용되는 `url-regex` 패키지에서 심각한 [정규 표현식 서비스 거부(Regular Expression Denial of Service, ReDoS)](https://en.wikipedia.org/wiki/ReDoS) 취약점을 발견하고 해결했습니다. 이 취약점([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472))은 공격자가 특수하게 조작된 입력을 제공하여 정규 표현식에서 치명적인 백트래킹을 유발함으로써 서비스 거부를 초래할 수 있었습니다.

기존 패키지를 단순히 패치하는 대신, Nick은 취약점을 해결하면서 원래 API와 호환성을 유지하는 완전히 새로 작성된 구현체인 [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe)를 만들었습니다. 또한 취약점과 이를 완화하는 방법을 설명하는 [포괄적인 블로그 게시물](/blog/docs/url-regex-javascript-node-js)도 게시했습니다.
이 작업은 문제를 단순히 해결하는 것뿐만 아니라 커뮤니티를 교육하고 유사한 문제를 미래에 방지할 수 있는 강력한 대안을 제공하는 우리의 보안 접근 방식을 보여줍니다.

### Node.js 및 Chromium 보안 옹호 {#advocating-for-nodejs-and-chromium-security}

Nick은 더 넓은 생태계에서 보안 개선을 옹호하는 데에도 활발히 활동해 왔습니다. 2020년 8월, 그는 HTTP 헤더 처리와 관련된 Node.js의 중요한 보안 문제를 발견했으며, 이는 [The Register](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/)에 보고되었습니다.

Chromium의 패치에서 비롯된 이 문제는 공격자가 보안 조치를 우회할 수 있게 할 가능성이 있었습니다. Nick의 옹호 덕분에 이 문제가 신속히 해결되어 수백만 개의 Node.js 애플리케이션이 잠재적 악용으로부터 보호받을 수 있었습니다.

### npm 인프라 보안 강화 {#securing-npm-infrastructure}

같은 달 후반, Nick은 이번에는 npm의 이메일 인프라에서 또 다른 치명적인 보안 문제를 발견했습니다. [The Register](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/)에 보도된 바와 같이, npm은 DMARC, SPF, DKIM 이메일 인증 프로토콜을 제대로 구현하지 않아 공격자가 npm에서 보낸 것처럼 보이는 피싱 이메일을 보낼 수 있었습니다.

Nick의 보고는 npm의 이메일 보안 태세 개선으로 이어져, 패키지 관리를 위해 npm에 의존하는 수백만 개발자를 잠재적 피싱 공격으로부터 보호했습니다.


## Forward Email 생태계에 대한 우리의 기여 {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Email은 Nodemailer, WildDuck, mailauth 등 여러 중요한 오픈 소스 프로젝트 위에 구축되어 있습니다. 우리 팀은 이러한 프로젝트에 깊이 있는 문제를 식별하고 수정하는 데 중요한 기여를 해왔으며, 이는 이메일 전달 및 보안에 영향을 미칩니다.

### Nodemailer 핵심 기능 강화 {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer)는 Node.js에서 이메일 전송의 중추이며, 우리의 기여는 이를 더욱 견고하게 만들었습니다:

* **SMTP 서버 개선**: SMTP 서버 구성 요소에서 파싱 버그, 스트림 처리 문제, TLS 구성 문제를 수정했습니다\[^16]\[^17].
* **메일 파서 향상**: 문자 시퀀스 디코딩 오류 및 이메일 처리 실패를 유발할 수 있는 주소 파서 문제를 해결했습니다\[^18]\[^19].

이러한 기여는 Nodemailer가 Forward Email을 포함한 Node.js 애플리케이션에서 신뢰할 수 있는 이메일 처리 기반으로 남도록 보장합니다.

### Mailauth를 통한 이메일 인증 발전 {#advancing-email-authentication-with-mailauth}

[Mailauth](https://github.com/postalsys/mailauth)는 중요한 이메일 인증 기능을 제공하며, 우리의 기여로 그 기능이 크게 향상되었습니다:

* **DKIM 검증 개선**: X/Twitter가 발신 메시지에 대해 DKIM 실패를 일으키는 DNS 캐시 문제를 발견하고 Hacker One에 보고했습니다\[^20].
* **DMARC 및 ARC 개선**: 잘못된 인증 결과를 초래할 수 있는 DMARC 및 ARC 검증 문제를 수정했습니다\[^21]\[^22].
* **성능 최적화**: 이메일 인증 프로세스의 성능을 향상시키는 최적화를 기여했습니다\[^23]\[^24]\[^25]\[^26].

이러한 개선은 이메일 인증이 정확하고 신뢰할 수 있도록 하여 피싱 및 스푸핑 공격으로부터 사용자를 보호합니다.

### Upptime 주요 개선 사항 {#key-upptime-enhancements}

Upptime에 대한 우리의 기여는 다음과 같습니다:

* **SSL 인증서 모니터링**: 만료된 인증서로 인한 예기치 않은 다운타임을 방지하기 위해 SSL 인증서 만료 모니터링 기능을 추가했습니다\[^27].
* **다중 SMS 번호 지원**: 사고 발생 시 여러 팀원에게 SMS로 알림을 보내는 기능을 구현하여 대응 시간을 개선했습니다\[^28].
* **IPv6 검사 수정**: 현대 네트워크 환경에서 더 정확한 모니터링을 위해 IPv6 연결 검사 문제를 수정했습니다\[^29].
* **다크/라이트 모드 지원**: 상태 페이지의 사용자 경험을 개선하기 위해 테마 지원을 추가했습니다\[^31].
* **향상된 TCP-Ping 지원**: 더 신뢰할 수 있는 연결 테스트를 제공하기 위해 TCP 핑 기능을 강화했습니다\[^32].
이러한 개선 사항은 Forward Email의 상태 모니터링에만 도움이 되는 것이 아니라 Upptime 사용자 전체 커뮤니티가 이용할 수 있어, 우리가 의존하는 도구들을 개선하려는 우리의 의지를 보여줍니다.


## 모든 것을 하나로 묶는 접착제: 대규모 맞춤 코드 {#the-glue-that-holds-it-all-together-custom-code-at-scale}

우리의 npm 패키지와 기존 프로젝트에 대한 기여도 중요하지만, 이러한 구성 요소들을 통합하는 맞춤 코드가 진정으로 우리의 기술 전문성을 보여줍니다. Forward Email 코드베이스는 2017년 프로젝트가 [free-email-forwarding](https://github.com/forwardemail/free-email-forwarding)으로 시작되어 모노레포로 병합되기 전까지의 10년간 개발 노력을 나타냅니다.

### 대규모 개발 노력 {#a-massive-development-effort}

이 맞춤 통합 코드의 규모는 인상적입니다:

* **총 기여 횟수**: 3,217회 이상의 커밋
* **코드베이스 크기**: JavaScript, Pug, CSS, JSON 파일을 합쳐 421,545줄 이상의 코드\[^33]

이는 수천 시간의 개발 작업, 디버깅 세션, 성능 최적화를 의미합니다. 개별 패키지를 수천 명의 고객이 매일 사용하는 일관되고 신뢰할 수 있는 서비스로 변모시키는 "비밀 소스"입니다.

### 핵심 의존성 통합 {#core-dependencies-integration}

Forward Email 코드베이스는 수많은 의존성을 원활하게 통합합니다:

* **이메일 처리**: 발송을 위한 Nodemailer, 수신을 위한 SMTP Server, 파싱을 위한 Mailparser 통합
* **인증**: DKIM, SPF, DMARC, ARC 검증을 위한 Mailauth 사용
* **DNS 해석**: 전 세계 캐싱을 지원하는 DNS-over-HTTPS용 Tangerine 활용
* **MX 연결**: 안정적인 메일 서버 연결을 위한 Tangerine 통합 mx-connect 사용
* **작업 스케줄링**: 워커 스레드를 통한 신뢰성 있는 백그라운드 작업 처리를 위한 Bree 사용
* **템플릿**: 고객 커뮤니케이션에 웹사이트 스타일시트를 재사용하기 위한 email-templates 사용
* **이메일 저장**: better-sqlite3-multiple-ciphers와 ChaCha20-Poly1305 암호화를 사용한 개별 암호화된 SQLite 메일박스 구현으로 양자 안전 프라이버시 보장, 사용자 간 완전한 격리 및 사용자만 메일박스 접근 가능

각 통합은 엣지 케이스, 성능 영향, 보안 문제를 신중히 고려해야 합니다. 그 결과 수백만 건의 이메일 거래를 안정적으로 처리하는 견고한 시스템이 완성되었습니다. 우리의 SQLite 구현은 또한 효율적인 바이너리 직렬화를 위해 msgpackr를 활용하며, 인프라 전반에 걸친 실시간 상태 업데이트를 위해 WebSockets(ws)를 사용합니다.

### Tangerine과 mx-connect를 이용한 DNS 인프라 {#dns-infrastructure-with-tangerine-and-mx-connect}

Forward Email 인프라의 핵심 구성 요소는 두 가지 주요 패키지를 중심으로 구축된 DNS 해석 시스템입니다:

* **[Tangerine](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: Node.js DNS-over-HTTPS 구현으로, 표준 DNS 해석기를 대체하며 내장된 재시도, 타임아웃, 스마트 서버 회전 및 캐싱 지원을 제공합니다.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: 대상 도메인 또는 이메일 주소를 받아 적절한 MX 서버를 해석하고 우선순위 순서대로 연결하는 TCP 연결을 설정하는 패키지입니다.

우리는 [풀 리퀘스트 #4](https://github.com/zone-eu/mx-connect/pull/4)를 통해 Tangerine과 mx-connect를 통합하여 Forward Email 전반에 걸쳐 애플리케이션 계층 DNS over HTTP 요청을 보장합니다. 이는 분산 시스템에서 신뢰할 수 있는 이메일 전달을 위해 지역, 앱, 프로세스에 관계없이 1:1 일관성을 가진 글로벌 DNS 캐싱을 제공합니다.


## 엔터프라이즈 영향력: 오픈 소스에서 미션 크리티컬 솔루션까지 {#enterprise-impact-from-open-source-to-mission-critical-solutions}

10년에 걸친 오픈 소스 개발 여정의 결실로 Forward Email은 개별 개발자뿐만 아니라 오픈 소스 운동의 중추를 이루는 주요 기업과 교육 기관에도 서비스를 제공할 수 있게 되었습니다.
### 미션 크리티컬 이메일 인프라 사례 연구 {#case-studies-in-mission-critical-email-infrastructure}

신뢰성, 개인정보 보호, 오픈 소스 원칙에 대한 우리의 헌신은 까다로운 이메일 요구 사항을 가진 조직들이 Forward Email을 신뢰하는 선택으로 만들었습니다:

* **교육 기관**: [졸업생 이메일 전달 사례 연구](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)에서 자세히 설명된 바와 같이, 주요 대학들은 수십만 명의 졸업생과 평생 연결을 유지하기 위해 신뢰할 수 있는 이메일 전달 서비스를 제공하는 우리의 인프라에 의존하고 있습니다.

* **엔터프라이즈 리눅스 솔루션**: [Canonical Ubuntu 이메일 엔터프라이즈 사례 연구](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)는 우리의 오픈 소스 접근 방식이 엔터프라이즈 리눅스 제공업체의 요구에 완벽히 부합하여 그들이 필요로 하는 투명성과 제어를 제공하는 방법을 보여줍니다.

* **오픈 소스 재단**: 아마도 가장 검증된 사례는 [Linux Foundation 이메일 엔터프라이즈 사례 연구](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)에서 문서화된 대로, 리눅스 개발을 관리하는 바로 그 조직의 커뮤니케이션을 지원하는 우리의 서비스와 Linux Foundation과의 파트너십입니다.

수년간 정성껏 유지해온 우리의 오픈 소스 패키지들이 오픈 소스 소프트웨어를 지지하는 커뮤니티와 조직을 지원하는 이메일 서비스를 구축할 수 있게 해준 데에는 아름다운 대칭성이 있습니다. 개별 패키지 기여에서부터 오픈 소스 리더를 위한 엔터프라이즈급 이메일 인프라를 구축하는 완전한 순환 여정은 소프트웨어 개발에 대한 우리의 접근법에 대한 궁극적인 검증을 의미합니다.


## 오픈 소스 10년: 앞으로의 전망 {#a-decade-of-open-source-looking-forward}

10년간의 오픈 소스 기여를 되돌아보고 앞으로 10년을 내다보며, 우리의 작업을 지원해 준 커뮤니티에 감사함과 앞으로 다가올 일들에 대한 기대감으로 가득 차 있습니다.

개별 패키지 기여자에서 주요 기업과 오픈 소스 재단이 사용하는 포괄적인 이메일 인프라 유지 관리자로 성장한 우리의 여정은 놀라웠습니다. 이는 오픈 소스 개발의 힘과 신중하고 잘 관리된 소프트웨어가 더 넓은 생태계에 미칠 수 있는 영향에 대한 증거입니다.

앞으로 몇 년 동안 우리는 다음에 전념할 것입니다:

* **기존 패키지 유지 및 개선 지속**, 전 세계 개발자들에게 신뢰할 수 있는 도구로 남도록 보장합니다.
* **이메일 및 보안 분야의 중요한 인프라 프로젝트에 대한 기여 확대**.
* **Forward Email의 기능 향상**과 동시에 개인정보 보호, 보안, 투명성에 대한 우리의 약속을 유지합니다.
* **멘토링, 후원, 커뮤니티 참여를 통해 차세대 오픈 소스 기여자 지원**.

우리는 소프트웨어 개발의 미래가 개방적이고 협력적이며 신뢰를 기반으로 구축된다고 믿습니다. JavaScript 생태계에 고품질의 보안 중심 패키지를 계속 기여함으로써 그 미래를 구축하는 데 작은 역할을 하길 희망합니다.

우리의 패키지를 사용하고, 프로젝트에 기여하고, 문제를 보고하거나 단순히 우리의 작업을 알린 모든 분들께 감사드립니다. 여러분의 지원 덕분에 이 10년간의 영향력이 가능했으며, 앞으로 10년 동안 함께 이룰 수 있는 일들이 기대됩니다.

\[^1]: cabin의 npm 다운로드 통계, 2025년 4월  
\[^2]: bson-objectid의 npm 다운로드 통계, 2025년 2-3월  
\[^3]: url-regex-safe의 npm 다운로드 통계, 2025년 4월  
\[^4]: 2025년 4월 기준 forwardemail/forwardemail.net의 GitHub 스타 수  
\[^5]: preview-email의 npm 다운로드 통계, 2025년 4월  
\[^7]: superagent의 npm 다운로드 통계, 2025년 2-3월  
\[^8]: supertest의 npm 다운로드 통계, 2025년 2-3월  
\[^9]: preview-email의 npm 다운로드 통계, 2025년 2-3월  
\[^10]: cabin의 npm 다운로드 통계, 2025년 2-3월  
\[^11]: url-regex-safe의 npm 다운로드 통계, 2025년 2-3월  
\[^12]: spamscanner의 npm 다운로드 통계, 2025년 2-3월  
\[^13]: npm 통계의 일일 다운로드 패턴, 2025년 4월  
\[^14]: npm 통계의 주간 다운로드 패턴, 2025년 4월  
\[^15]: nodemailer의 npm 다운로드 통계, 2025년 4월  
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
\[^26]: <https://github.com/postalsys/mailauth/issues/73>  
\[^27]: Upptime 저장소의 GitHub 이슈 기반  
\[^28]: Upptime 저장소의 GitHub 이슈 기반  
\[^29]: Upptime 저장소의 GitHub 이슈 기반  
\[^30]: bree의 npm 다운로드 통계, 2025년 2-3월  
\[^31]: Upptime에 대한 GitHub 풀 리퀘스트 기반  
\[^32]: Upptime에 대한 GitHub 풀 리퀘스트 기반  
\[^34]: koa의 npm 다운로드 통계, 2025년 2-3월  
\[^35]: @koa/router의 npm 다운로드 통계, 2025년 2-3월  
\[^36]: koa-router의 npm 다운로드 통계, 2025년 2-3월  
\[^37]: url-regex의 npm 다운로드 통계, 2025년 2-3월  
\[^38]: @breejs/later의 npm 다운로드 통계, 2025년 2-3월  
\[^39]: email-templates의 npm 다운로드 통계, 2025년 2-3월  
\[^40]: get-paths의 npm 다운로드 통계, 2025년 2-3월  
\[^41]: dotenv-parse-variables의 npm 다운로드 통계, 2025년 2-3월  
\[^42]: @koa/multer의 npm 다운로드 통계, 2025년 2-3월
