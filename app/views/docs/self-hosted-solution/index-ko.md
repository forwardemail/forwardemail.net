# 자체 호스팅 이메일: 오픈 소스에 대한 약속 {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="Self-hosted email solution illustration" 클래스="둥근-lg" />

## 목차 {#table-of-contents}

* [머리말](#foreword)
* [셀프 호스팅 이메일이 중요한 이유](#why-self-hosted-email-matters)
  * [기존 이메일 서비스의 문제점](#the-problem-with-traditional-email-services)
  * [셀프 호스팅 대안](#the-self-hosted-alternative)
* [자체 호스팅 구현: 기술 개요](#our-self-hosted-implementation-technical-overview)
  * [단순성과 이식성을 위한 Docker 기반 아키텍처](#docker-based-architecture-for-simplicity-and-portability)
  * [Bash 스크립트 설치: 접근성과 보안의 만남](#bash-script-installation-accessibility-meets-security)
  * [미래 지향적 개인 정보 보호를 위한 양자 안전 암호화](#quantum-safe-encryption-for-future-proof-privacy)
  * [자동화된 유지 관리 및 업데이트](#automated-maintenance-and-updates)
* [오픈 소스 약속](#the-open-source-commitment)
* [셀프 호스팅 vs. 관리형: 올바른 선택하기](#self-hosted-vs-managed-making-the-right-choice)
  * [셀프 호스팅 이메일의 현실](#the-reality-of-self-hosting-email)
  * [당사의 관리 서비스를 선택해야 하는 경우](#when-to-choose-our-managed-service)
* [셀프 호스팅 전달 이메일 시작하기](#getting-started-with-self-hosted-forward-email)
  * [시스템 요구 사항](#system-requirements)
  * [설치 단계](#installation-steps)
* [셀프 호스팅 이메일의 미래](#the-future-of-self-hosted-email)
* [결론: 모든 사람을 위한 이메일의 자유](#conclusion-email-freedom-for-everyone)
* [참고문헌](#references)

## 서문 {#foreword}

오늘날의 디지털 환경에서 이메일은 여전히 온라인 정체성과 소통의 근간을 이루고 있습니다. 하지만 개인정보 보호에 대한 우려가 커지면서 많은 사용자는 어려운 선택에 직면합니다. 편의성을 희생하면서 개인정보를 보호할 것인가, 아니면 편의성을 희생하면서 개인정보를 보호할 것인가. Forward Email은 항상 둘 중 하나를 선택해야 하는 상황이 되어서는 안 된다고 믿어 왔습니다.

오늘, 저희 여정의 중요한 이정표를 발표하게 되어 기쁩니다. 바로 셀프 호스팅 이메일 솔루션 출시입니다. 이 기능은 오픈 소스 원칙, 개인정보 보호 중심 설계, 그리고 사용자 권한 강화에 대한 저희의 확고한 의지를 보여줍니다. 셀프 호스팅 옵션을 통해 이메일 커뮤니케이션의 모든 권한과 제어권을 사용자에게 직접 제공합니다.

이 블로그 게시물에서는 당사의 셀프 호스팅 솔루션의 철학과 기술적 구현 방식을 살펴보고, 디지털 커뮤니케이션에서 개인정보 보호와 소유권을 모두 우선시하는 사용자에게 이것이 중요한 이유를 설명합니다.

## 자체 호스팅 이메일이 중요한 이유 {#why-self-hosted-email-matters}

저희의 셀프 호스팅 이메일 솔루션은 진정한 개인정보 보호는 통제를 의미하며, 통제는 오픈 소스에서 시작된다는 저희의 신념을 가장 분명하게 보여줍니다. 디지털 커뮤니케이션에 대한 완전한 소유권을 요구하는 사용자에게 셀프 호스팅은 더 이상 비주류가 아니라 필수적인 권리입니다. 저희는 고객이 원하는 방식으로 운영할 수 있는 완전히 개방적이고 검증 가능한 플랫폼을 통해 이러한 신념을 실천할 수 있게 되어 자랑스럽게 생각합니다.

### 기존 이메일 서비스의 문제점 {#the-problem-with-traditional-email-services}

기존 이메일 서비스는 개인 정보 보호를 중시하는 사용자에게 몇 가지 근본적인 과제를 안겨줍니다.

1. **신뢰 요건**: 귀하는 제공자가 귀하의 데이터에 접근, 분석 또는 공유하지 않을 것이라고 신뢰해야 합니다.
2. **중앙 집중식 제어**: 귀하의 접근 권한은 언제든지 어떤 이유로든 취소될 수 있습니다.
3. **감시 취약성**: 중앙 집중식 서비스는 감시의 주요 대상입니다.
4. **제한된 투명성**: 대부분의 서비스는 독점적이고 폐쇄적인 소스 소프트웨어를 사용합니다.
5. **공급업체 종속성**: 이러한 서비스에서 다른 서비스로 마이그레이션하는 것은 어렵거나 불가능할 수 있습니다.

"개인정보 보호에 중점을 둔" 이메일 제공업체조차도 프런트엔드 애플리케이션만 오픈소스로 공개하고 백엔드 시스템은 독점적이고 폐쇄적인 방식으로 유지하는 등 종종 기대에 미치지 못합니다. 이는 상당한 신뢰 격차를 야기합니다. 검증할 수 없는 개인정보 보호 약속을 믿으라는 요구와 마찬가지입니다.

### 자체 호스팅 대안 {#the-self-hosted-alternative}

이메일을 셀프호스팅하면 근본적으로 다른 접근 방식이 제공됩니다.

1. **완벽한 제어**: 전체 이메일 인프라를 소유하고 제어할 수 있습니다.
2. **검증 가능한 개인 정보 보호**: 전체 시스템은 투명하고 감사 가능합니다.
3. **신뢰 불필요**: 커뮤니케이션을 제3자에게 맡길 필요가 없습니다.
4. **맞춤 설정의 자유**: 특정 요구 사항에 맞게 시스템을 조정할 수 있습니다.
5. **복원력**: 회사의 결정과 관계없이 서비스가 지속됩니다.

한 사용자는 이렇게 말했습니다. "이메일을 직접 호스팅하는 것은 내가 먹을 음식을 직접 재배하는 것과 같은 디지털 방식입니다. 더 많은 노력이 필요하지만, 그 내용이 정확히 무엇인지 알고 있습니다."

## 자체 호스팅 구현: 기술 개요 {#our-self-hosted-implementation-technical-overview}

당사의 셀프 호스팅 이메일 솔루션은 모든 제품과 동일한 개인정보 보호 원칙을 기반으로 구축되었습니다. 이를 가능하게 하는 기술적 구현 방식을 살펴보겠습니다.

### 간편성과 이동성을 위한 Docker 기반 아키텍처 {#docker-based-architecture-for-simplicity-and-portability}

Docker를 사용하여 전체 이메일 인프라를 패키징하여 거의 모든 Linux 기반 시스템에 쉽게 배포할 수 있도록 했습니다. 이러한 컨테이너화된 접근 방식은 다음과 같은 몇 가지 주요 이점을 제공합니다.

1. **간소화된 배포**: 단일 명령으로 전체 인프라 설정
2. **일관된 환경**: "내 컴퓨터에서만 작동"하는 문제 해결
3. **격리된 구성 요소**: 보안을 위해 각 서비스가 별도의 컨테이너에서 실행됩니다.
4. **간편한 업데이트**: 간단한 명령으로 전체 스택을 업데이트할 수 있습니다.
5. **최소 종속성**: Docker와 Docker Compose만 필요합니다.

아키텍처에는 다음을 위한 컨테이너가 포함됩니다.

* 관리용 웹 인터페이스
* 발신 이메일용 SMTP 서버
* 이메일 검색용 IMAP/POP3 서버
* 캘린더용 CalDAV 서버
* 연락처용 CardDAV 서버
* 구성 저장용 데이터베이스
* 캐싱 및 성능용 Redis
* 안전하고 암호화된 사서함 저장용 SQLite

> \[!NOTE]
> [셀프 호스팅 개발자 가이드](https://forwardemail.net/self-hosted)도 꼭 확인해 보세요.

### Bash 스크립트 설치: 접근성과 보안의 조화 {#bash-script-installation-accessibility-meets-security}

우리는 보안 모범 사례를 유지하면서도 설치 과정을 최대한 간단하게 설계했습니다.

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

이 단일 명령:

1. 시스템 요구 사항 확인
2. 구성 안내
3. DNS 레코드 설정
4. TLS 인증서 구성
5. Docker 컨테이너 배포
6. 초기 보안 강화 수행

스크립트를 bash로 파이핑하는 것에 대해 걱정되시는 분들은 (당연히 그럴 겁니다!), 실행 전에 스크립트를 검토해 보시기를 권장합니다. 스크립트는 완전히 오픈 소스이며, 검토가 가능합니다.

### 미래 지향적 개인 정보 보호를 위한 양자 안전 암호화 {#quantum-safe-encryption-for-future-proof-privacy}

저희 호스팅 서비스와 마찬가지로, 자체 호스팅 솔루션은 SQLite 데이터베이스의 암호로 ChaCha20-Poly1305를 사용하는 양자 저항 암호화를 구현합니다. 이러한 접근 방식은 현재의 위협뿐만 아니라 미래의 양자 컴퓨팅 공격으로부터도 이메일 데이터를 보호합니다.

각 사서함은 자체 암호화된 SQLite 데이터베이스 파일에 저장되어 사용자 간에 완벽한 격리를 제공합니다. 이는 기존의 공유 데이터베이스 접근 방식에 비해 상당한 보안 이점입니다.

### 자동 유지 관리 및 업데이트 {#automated-maintenance-and-updates}

우리는 포괄적인 유지 관리 유틸리티를 셀프 호스팅 솔루션에 직접 구축했습니다.

1. **자동 백업**: 모든 중요 데이터의 예약 백업
2. **인증서 갱신**: Let's Encrypt 인증서 자동 관리
3. **시스템 업데이트**: 최신 버전으로 업데이트하는 간단한 명령
4. **상태 모니터링**: 시스템 무결성을 보장하기 위한 기본 제공 검사 기능

이러한 유틸리티는 간단한 대화형 메뉴를 통해 접근할 수 있습니다.

```bash
# script prompt

1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

## 오픈 소스 약속 {#the-open-source-commitment}

당사의 자체 호스팅 이메일 솔루션은 다른 모든 제품과 마찬가지로 프런트엔드와 백엔드 모두 100% 오픈 소스입니다. 즉, 다음과 같은 이점이 있습니다.

1. **완전한 투명성**: 이메일을 처리하는 모든 코드 라인이 공개 검토 대상입니다.
2. **커뮤니티 기여**: 누구나 개선 사항을 기여하거나 문제를 해결할 수 있습니다.
3. **개방성을 통한 보안**: 글로벌 커뮤니티를 통해 취약점을 파악하고 수정할 수 있습니다.
4. **벤더 종속 없음**: 귀하는 당사에 의존할 필요가 없습니다.

전체 코드베이스는 GitHub의 <https://github.com/forwardemail/forwardemail.net>.>에서 사용할 수 있습니다.

## 자체 호스팅 vs. 관리형: 올바른 선택하기 {#self-hosted-vs-managed-making-the-right-choice}

셀프 호스팅 옵션을 제공하게 되어 자랑스럽지만, 모든 사람에게 적합한 선택은 아니라는 점을 잘 알고 있습니다. 셀프 호스팅 이메일에는 실질적인 책임과 어려움이 따릅니다.

### 셀프 호스팅 이메일의 현실 {#the-reality-of-self-hosting-email}

#### 기술적 고려 사항 {#technical-considerations}

* **서버 관리**: VPS 또는 전용 서버를 유지 관리해야 합니다.
* **DNS 구성**: 전송성을 위해서는 적절한 DNS 설정이 필수적입니다.
* **보안 업데이트**: 보안 패치를 최신 상태로 유지하는 것이 필수입니다.
* **스팸 관리**: 스팸 필터링을 처리해야 합니다.
* **백업 전략**: 안정적인 백업을 구현하는 것은 귀하의 책임입니다.

#### 시간 투자 {#time-investment}

* **초기 설정**: 설정, 확인 및 설명서 읽기 시간
* **지속적인 유지 관리**: 비정기적인 업데이트 및 모니터링
* **문제 해결**: 비정기적인 문제 해결 시간

#### 재정적 고려 사항 {#financial-considerations}

* **서버 비용**: 기본 VPS의 경우 월 $5-$20
* **도메인 등록**: 연 $10-$20
* **시간적 가치**: 시간 투자는 실질적인 가치를 지닙니다.

### 관리 서비스를 선택해야 하는 경우 {#when-to-choose-our-managed-service}}

많은 사용자에게 당사의 관리형 서비스는 여전히 최고의 옵션입니다.

1. **편리성**: 모든 유지 관리, 업데이트 및 모니터링을 처리합니다.
2. **안정성**: 당사의 탄탄한 인프라와 전문성을 활용합니다.
3. **지원**: 문제 발생 시 도움을 받을 수 있습니다.
4. **제공 가능성**: 당사의 확고한 IP 평판을 활용합니다.
5. **비용 효율성**: 시간 비용을 고려하면 당사 서비스가 더 경제적일 수 있습니다.

두 옵션 모두 동일한 개인정보 보호 혜택과 오픈 소스 투명성을 제공합니다. 차이점은 인프라를 누가 관리하느냐는 것입니다.

## 자체 호스팅 전달 이메일 시작하기 {#getting-started-with-self-hosted-forward-email}

이메일 인프라를 관리할 준비가 되셨나요? 시작하는 방법은 다음과 같습니다.

### 시스템 요구 사항 {#system-requirements}

* Ubuntu 20.04 LTS 이상 (권장)
* 최소 1GB RAM (2GB 이상 권장)
* 20GB 저장 공간 권장
* 직접 관리하는 도메인 이름
* 25번 포트를 지원하는 공용 IP 주소
* [역방향 PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/) 설정 가능
* IPv4 및 IPv6 지원

> \[!TIP]
> <https://forwardemail.net/blog/docs/best-mail-server-providers>>에서 여러 메일 서버 제공업체를 추천합니다(출처: <https://github.com/forwardemail/awesome-mail-server-providers>>).

### 설치 단계 {#installation-steps}

1. **설치 스크립트 실행**:
```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
   ```

2. **대화형 프롬프트를 따르세요**:
* 도메인 이름을 입력하세요
* 관리자 자격 증명을 구성하세요
* 지시에 따라 DNS 레코드를 설정하세요
* 원하는 구성 옵션을 선택하세요

3. **설치 확인**:
설치가 완료되면 다음을 통해 모든 것이 제대로 작동하는지 확인할 수 있습니다.
* 컨테이너 상태 확인: `docker ps`
* 테스트 이메일 전송
* 웹 인터페이스 로그인

## 자체 호스팅 이메일의 미래 {#the-future-of-self-hosted-email}

저희의 셀프 호스팅 솔루션은 시작에 불과합니다. 저희는 다음과 같은 기능을 통해 이 솔루션을 지속적으로 개선해 나갈 것을 약속드립니다.

1. **향상된 관리 도구**: 더욱 강력한 웹 기반 관리
2. **추가 인증 옵션**: 하드웨어 보안 키 지원 포함
3. **고급 모니터링**: 시스템 상태 및 성능에 대한 더욱 정확한 분석
4. **다중 서버 배포**: 고가용성 구성 옵션
5. **커뮤니티 기반 개선 사항**: 사용자 참여 반영

## 결론: 모든 사람을 위한 이메일의 자유 {#conclusion-email-freedom-for-everyone}

셀프 호스팅 이메일 솔루션 출시는 개인정보 보호에 중점을 둔 투명한 이메일 서비스를 제공하고자 하는 저희의 사명에 있어 중요한 이정표입니다. 관리형 서비스든 셀프 호스팅 옵션이든, 오픈 소스 원칙과 개인정보 보호 중심 설계에 대한 저희의 확고한 의지를 경험하실 수 있습니다.

이메일은 사용자 개인 정보 보호보다 데이터 수집을 우선시하는 폐쇄적이고 독점적인 시스템으로 관리하기에는 너무나 중요합니다. Forward Email의 셀프 호스팅 솔루션을 통해 디지털 커뮤니케이션을 완벽하게 제어할 수 있는 진정한 대안을 제시하게 되어 자랑스럽게 생각합니다.

저희는 개인정보 보호가 단순한 기능이 아니라 기본 권리라고 믿습니다. 그리고 셀프 호스팅 이메일 옵션을 통해 그 어느 때보다 쉽게 개인정보 보호 권리를 누릴 수 있도록 하고 있습니다.

이메일을 직접 관리할 준비가 되셨나요? [오늘 시작하세요](https://forwardemail.net/self-hosted) 또는 [GitHub 저장소](https://github.com/forwardemail/forwardemail.net)에서 자세한 내용을 확인하세요.

## 참조 {#references}

\[1] 전달 이메일 GitHub 저장소: <https://github.com/forwardemail/forwardemail.net>

\[2] 자체 호스팅 문서: <https://forwardemail.net/en/self-hosted>

\[3] 이메일 개인 정보 보호 기술 구현: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

[4] 오픈 소스 이메일이 중요한 이유: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>