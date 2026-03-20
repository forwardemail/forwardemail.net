# 셀프 호스팅 이메일: 오픈 소스에 대한 약속 {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="셀프 호스팅 이메일 솔루션 일러스트" class="rounded-lg" />


## 목차 {#table-of-contents}

* [서문](#foreword)
* [셀프 호스팅 이메일이 중요한 이유](#why-self-hosted-email-matters)
  * [전통적인 이메일 서비스의 문제점](#the-problem-with-traditional-email-services)
  * [셀프 호스팅 대안](#the-self-hosted-alternative)
* [우리의 셀프 호스팅 구현: 기술 개요](#our-self-hosted-implementation-technical-overview)
  * [간편함과 이식성을 위한 도커 기반 아키텍처](#docker-based-architecture-for-simplicity-and-portability)
  * [배쉬 스크립트 설치: 접근성과 보안의 조화](#bash-script-installation-accessibility-meets-security)
  * [미래를 대비한 양자 안전 암호화](#quantum-safe-encryption-for-future-proof-privacy)
  * [자동화된 유지보수 및 업데이트](#automated-maintenance-and-updates)
* [오픈 소스에 대한 약속](#the-open-source-commitment)
* [셀프 호스팅 vs. 관리형: 올바른 선택하기](#self-hosted-vs-managed-making-the-right-choice)
  * [셀프 호스팅 이메일의 현실](#the-reality-of-self-hosting-email)
  * [관리형 서비스를 선택해야 할 때](#when-to-choose-our-managed-service)
* [셀프 호스팅 포워드 이메일 시작하기](#getting-started-with-self-hosted-forward-email)
  * [시스템 요구사항](#system-requirements)
  * [설치 단계](#installation-steps)
* [셀프 호스팅 이메일의 미래](#the-future-of-self-hosted-email)
* [결론: 모두를 위한 이메일 자유](#conclusion-email-freedom-for-everyone)
* [참고문헌](#references)


## 서문 {#foreword}

오늘날 디지털 환경에서 이메일은 우리의 온라인 정체성과 소통의 중추 역할을 합니다. 하지만 프라이버시 우려가 커지면서 많은 사용자는 어려운 선택에 직면합니다: 프라이버시를 희생하는 편리함, 혹은 편리함을 희생하는 프라이버시. Forward Email에서는 이 둘 중 하나를 선택할 필요가 없다고 항상 믿어왔습니다.

오늘, 우리는 중요한 이정표를 발표하게 되어 기쁩니다: 우리의 셀프 호스팅 이메일 솔루션 출시입니다. 이 기능은 오픈 소스 원칙, 프라이버시 중심 설계, 사용자 권한 부여에 대한 우리의 깊은 약속을 나타냅니다. 셀프 호스팅 옵션을 통해 이메일 소통의 모든 힘과 통제권을 사용자 여러분의 손에 직접 쥐어드립니다.

이 블로그 글에서는 우리의 셀프 호스팅 솔루션 철학, 기술적 구현, 그리고 디지털 소통에서 프라이버시와 소유권을 모두 중시하는 사용자에게 왜 중요한지 탐구합니다.


## 셀프 호스팅 이메일이 중요한 이유 {#why-self-hosted-email-matters}

우리의 셀프 호스팅 이메일 솔루션은 진정한 프라이버시가 통제권을 의미하며, 통제권은 오픈 소스에서 시작된다는 믿음의 가장 명확한 표현입니다. 디지털 소통에 대한 완전한 소유권을 요구하는 사용자에게 셀프 호스팅은 더 이상 주변적인 아이디어가 아니라 필수 권리입니다. 우리는 여러분이 직접 운영할 수 있는 완전 개방적이고 검증 가능한 플랫폼으로 그 믿음을 자랑스럽게 지지합니다.

### 전통적인 이메일 서비스의 문제점 {#the-problem-with-traditional-email-services}

전통적인 이메일 서비스는 프라이버시를 중시하는 사용자에게 몇 가지 근본적인 문제를 제기합니다:

1. **신뢰 요구**: 제공자가 여러분의 데이터를 접근, 분석, 공유하지 않을 것이라고 믿어야 합니다
2. **중앙 집중식 통제**: 언제든 어떤 이유로든 접근 권한이 취소될 수 있습니다
3. **감시 취약성**: 중앙 집중식 서비스는 감시의 주요 대상입니다
4. **제한된 투명성**: 대부분의 서비스는 독점적이고 폐쇄된 소프트웨어를 사용합니다
5. **공급자 종속성**: 이러한 서비스에서 벗어나기가 어렵거나 불가능할 수 있습니다

심지어 "프라이버시 중심" 이메일 제공자들도 프론트엔드 애플리케이션만 오픈 소스로 공개하고 백엔드 시스템은 독점적이고 폐쇄적으로 유지하는 경우가 많습니다. 이는 중요한 신뢰 격차를 만듭니다—사용자는 그들의 프라이버시 약속을 검증할 수 없는 상태에서 믿어야만 합니다.

### 셀프 호스팅 대안 {#the-self-hosted-alternative}
이메일을 자체 호스팅하는 것은 근본적으로 다른 접근 방식을 제공합니다:

1. **완전한 제어**: 전체 이메일 인프라를 소유하고 제어합니다
2. **검증 가능한 프라이버시**: 전체 시스템이 투명하고 감사 가능합니다
3. **신뢰 불필요**: 통신에 대해 제3자를 신뢰할 필요가 없습니다
4. **맞춤화 자유**: 시스템을 특정 요구에 맞게 조정할 수 있습니다
5. **복원력**: 어떤 회사의 결정과 상관없이 서비스가 계속됩니다

한 사용자가 말하길: "내 이메일을 자체 호스팅하는 것은 디지털 버전의 직접 식량 재배와 같습니다—더 많은 노력이 들지만, 정확히 무엇이 들어있는지 알 수 있습니다."


## Our Self-Hosted Implementation: Technical Overview {#our-self-hosted-implementation-technical-overview}

우리의 자체 호스팅 이메일 솔루션은 모든 제품을 안내하는 프라이버시 우선 원칙에 기반하여 구축되었습니다. 이를 가능하게 하는 기술적 구현을 살펴보겠습니다.

### Docker-Based Architecture for Simplicity and Portability {#docker-based-architecture-for-simplicity-and-portability}

우리는 전체 이메일 인프라를 Docker로 패키징하여 사실상 모든 리눅스 기반 시스템에 쉽게 배포할 수 있도록 했습니다. 이 컨테이너화된 접근 방식은 다음과 같은 주요 이점을 제공합니다:

1. **간소화된 배포**: 단일 명령으로 전체 인프라를 설정
2. **일관된 환경**: "내 컴퓨터에서는 작동하는데" 문제 제거
3. **격리된 구성 요소**: 각 서비스가 자체 컨테이너에서 실행되어 보안 강화
4. **쉬운 업데이트**: 전체 스택을 간단한 명령으로 업데이트 가능
5. **최소한의 의존성**: Docker와 Docker Compose만 필요

아키텍처에는 다음 컨테이너가 포함됩니다:

* 관리용 웹 인터페이스
* 발신 이메일용 SMTP 서버
* 이메일 수신용 IMAP/POP3 서버
* 캘린더용 CalDAV 서버
* 연락처용 CardDAV 서버
* 구성 저장용 데이터베이스
* 캐싱 및 성능용 Redis
* 안전하고 암호화된 메일박스 저장용 SQLite

> \[!NOTE]
> 반드시 [자체 호스팅 개발자 가이드](https://forwardemail.net/self-hosted)를 확인하세요

### Bash Script Installation: Accessibility Meets Security {#bash-script-installation-accessibility-meets-security}

우리는 보안 모범 사례를 유지하면서 설치 과정을 최대한 간단하게 설계했습니다:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

이 단일 명령은:

1. 시스템 요구 사항을 확인
2. 구성 과정을 안내
3. DNS 레코드 설정
4. TLS 인증서 구성
5. Docker 컨테이너 배포
6. 초기 보안 강화 수행

bash에 스크립트를 파이핑하는 것에 대해 걱정하는 분들을 위해(그럴 만합니다!), 실행 전에 스크립트를 검토할 것을 권장합니다. 스크립트는 완전히 오픈 소스이며 검토 가능합니다.

### Quantum-Safe Encryption for Future-Proof Privacy {#quantum-safe-encryption-for-future-proof-privacy}

호스팅 서비스와 마찬가지로, 자체 호스팅 솔루션은 SQLite 데이터베이스용 암호로 ChaCha20-Poly1305를 사용하여 양자 내성 암호화를 구현합니다. 이 접근법은 현재 위협뿐 아니라 미래의 양자 컴퓨팅 공격으로부터도 이메일 데이터를 보호합니다.

각 메일박스는 자체 암호화된 SQLite 데이터베이스 파일에 저장되어 사용자 간 완전한 격리를 제공하며, 이는 전통적인 공유 데이터베이스 방식에 비해 상당한 보안 이점입니다.

### Automated Maintenance and Updates {#automated-maintenance-and-updates}

우리는 자체 호스팅 솔루션에 포괄적인 유지보수 유틸리티를 내장했습니다:

1. **자동 백업**: 모든 중요 데이터의 예약 백업
2. **인증서 갱신**: 자동화된 Let's Encrypt 인증서 관리
3. **시스템 업데이트**: 최신 버전으로 간단한 명령으로 업데이트
4. **상태 모니터링**: 시스템 무결성을 보장하는 내장 검사

이 유틸리티들은 간단한 대화형 메뉴를 통해 접근할 수 있습니다:

```bash
# script prompt

1. 초기 설정
2. 백업 설정
3. 자동 업그레이드 설정
4. 인증서 갱신
5. 백업에서 복원
6. 도움말
7. 종료
```


## The Open-Source Commitment {#the-open-source-commitment}

우리의 자체 호스팅 이메일 솔루션은 모든 제품과 마찬가지로 프론트엔드와 백엔드 모두 100% 오픈 소스입니다. 이는:
1. **완전한 투명성**: 이메일을 처리하는 모든 코드 라인은 공개 검토가 가능합니다  
2. **커뮤니티 기여**: 누구나 개선사항을 제안하거나 문제를 수정할 수 있습니다  
3. **개방성을 통한 보안**: 전 세계 커뮤니티가 취약점을 발견하고 수정할 수 있습니다  
4. **공급업체 종속 없음**: 당사 회사의 존재에 의존하지 않습니다  

전체 코드베이스는 GitHub에서 확인할 수 있습니다: <https://github.com/forwardemail/forwardemail.net>.


## 자체 호스팅 vs. 관리형: 올바른 선택하기 {#self-hosted-vs-managed-making-the-right-choice}

자체 호스팅 옵션을 제공하는 것을 자랑스럽게 생각하지만, 모든 사람에게 적합한 선택은 아니라는 점을 인지하고 있습니다. 이메일 자체 호스팅은 실제적인 책임과 도전 과제를 동반합니다:

### 이메일 자체 호스팅의 현실 {#the-reality-of-self-hosting-email}

#### 기술적 고려사항 {#technical-considerations}

* **서버 관리**: VPS 또는 전용 서버를 유지해야 합니다  
* **DNS 구성**: 적절한 DNS 설정은 전달 가능성에 매우 중요합니다  
* **보안 업데이트**: 보안 패치를 최신 상태로 유지하는 것이 필수적입니다  
* **스팸 관리**: 스팸 필터링을 직접 처리해야 합니다  
* **백업 전략**: 신뢰할 수 있는 백업 구현은 사용자 책임입니다  

#### 시간 투자 {#time-investment}

* **초기 설정**: 설정, 검증 및 문서 읽기에 소요되는 시간  
* **지속적 유지보수**: 가끔씩 업데이트 및 모니터링  
* **문제 해결**: 문제 발생 시 해결에 소요되는 시간  

#### 재정적 고려사항 {#financial-considerations}

* **서버 비용**: 기본 VPS의 경우 월 $5~$20  
* **도메인 등록**: 연간 $10~$20  
* **시간 가치**: 시간 투자에는 실제 가치가 있습니다  

### 관리형 서비스를 선택해야 할 때 {#when-to-choose-our-managed-service}

많은 사용자에게 관리형 서비스가 최선의 선택입니다:

1. **편리함**: 모든 유지보수, 업데이트 및 모니터링을 당사가 처리  
2. **신뢰성**: 당사의 구축된 인프라와 전문성 활용  
3. **지원**: 문제 발생 시 도움 제공  
4. **전달 가능성**: 당사의 확립된 IP 평판 활용  
5. **비용 효율성**: 시간 비용을 고려하면 당사 서비스가 종종 더 경제적임  

두 옵션 모두 동일한 개인정보 보호 혜택과 오픈 소스 투명성을 제공하며, 차이는 인프라 관리 주체에 있습니다.


## 자체 호스팅 Forward Email 시작하기 {#getting-started-with-self-hosted-forward-email}

이메일 인프라를 직접 관리할 준비가 되셨나요? 시작하는 방법은 다음과 같습니다:

### 시스템 요구사항 {#system-requirements}

* Ubuntu 20.04 LTS 이상 (권장)  
* 최소 1GB RAM (2GB 이상 권장)  
* 20GB 저장 공간 권장  
* 본인이 소유한 도메인 이름  
* 포트 25 지원이 가능한 공인 IP 주소  
* [역방향 PTR 설정](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/) 가능  
* IPv4 및 IPv6 지원  

> \[!TIP]  
> 여러 메일 서버 제공업체를 <https://forwardemail.net/blog/docs/best-mail-server-providers> 에서 추천합니다 (출처: <https://github.com/forwardemail/awesome-mail-server-providers>)

### 설치 단계 {#installation-steps}

1. **설치 스크립트 실행**:  
   ```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
   ```

2. **대화형 프롬프트 따라하기**:  
   * 도메인 이름 입력  
   * 관리자 자격 증명 구성  
   * 안내에 따라 DNS 레코드 설정  
   * 선호하는 구성 옵션 선택  

3. **설치 확인**:  
   설치가 완료되면 다음으로 정상 작동 여부를 확인할 수 있습니다:  
   * 컨테이너 상태 확인: `docker ps`  
   * 테스트 이메일 전송  
   * 웹 인터페이스 로그인  


## 자체 호스팅 이메일의 미래 {#the-future-of-self-hosted-email}

자체 호스팅 솔루션은 시작에 불과합니다. 우리는 다음과 같은 지속적인 개선을 약속합니다:

1. **향상된 관리 도구**: 더 강력한 웹 기반 관리 기능  
2. **추가 인증 옵션**: 하드웨어 보안 키 지원 포함  
3. **고급 모니터링**: 시스템 상태 및 성능에 대한 더 나은 인사이트  
4. **다중 서버 배포**: 고가용성 구성을 위한 옵션  
5. **커뮤니티 주도 개선**: 사용자 기여 반영
## 결론: 모두를 위한 이메일 자유 {#conclusion-email-freedom-for-everyone}

자체 호스팅 이메일 솔루션의 출시는 프라이버시 중심의 투명한 이메일 서비스를 제공하겠다는 우리의 사명에 있어 중요한 이정표입니다. 관리형 서비스든 자체 호스팅 옵션이든, 오픈 소스 원칙과 프라이버시 우선 설계에 대한 우리의 변함없는 헌신으로부터 혜택을 받으실 수 있습니다.

이메일은 사용자 프라이버시보다 데이터 수집을 우선하는 폐쇄적이고 독점적인 시스템에 의해 통제되어서는 안 될 만큼 중요합니다. Forward Email의 자체 호스팅 솔루션을 통해, 우리는 여러분이 디지털 커뮤니케이션을 완전히 통제할 수 있는 진정한 대안을 자랑스럽게 제공합니다.

우리는 프라이버시가 단순한 기능이 아니라 기본적인 권리라고 믿습니다. 그리고 자체 호스팅 이메일 옵션으로 그 권리를 그 어느 때보다 더 쉽게 접근할 수 있도록 만들고 있습니다.

이메일을 직접 통제할 준비가 되셨나요? [오늘 시작하세요](https://forwardemail.net/self-hosted) 또는 [GitHub 저장소](https://github.com/forwardemail/forwardemail.net)를 탐색하여 더 알아보세요.


## 참고 문헌 {#references}

\[1] Forward Email GitHub 저장소: <https://github.com/forwardemail/forwardemail.net>

\[2] 자체 호스팅 문서: <https://forwardemail.net/en/self-hosted>

\[3] 이메일 프라이버시 기술 구현: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] 오픈 소스 이메일이 중요한 이유: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>
