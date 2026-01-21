# 이메일 전달: 섹션 889 준수 이메일 전달 솔루션 {#forward-email-your-section-889-compliant-email-forwarding-solution}

<img loading="lazy" src="/img/articles/federal.webp" alt="Federal government email service Section 889 compliant" 클래스="둥근-lg" />

## 목차 {#table-of-contents}

* [머리말](#foreword)
* [섹션 889 준수 이해](#understanding-section-889-compliance)
* [Forward Email이 섹션 889 규정을 준수하는 방법](#how-forward-email-achieves-section-889-compliance)
  * [Cloudflare의 약속](#cloudflares-commitment)
  * [DataPacket의 인프라](#datapackets-infrastructure)
* [섹션 889 이후: 더 광범위한 정부 규정 준수](#beyond-section-889-broader-government-compliance)
* [앞으로의 우리의 길: 규정 준수 지평 확장](#our-path-forward-expanding-compliance-horizons)
* [이것이 당신에게 중요한 이유](#why-this-matters-for-you)
* [안전하고 규정을 준수하는 이메일 전달이 여기서 시작됩니다](#secure-compliant-email-forwarding-starts-here)
* [참고문헌](#references)

## 서문 {#foreword}

Forward Email은 모든 사용자를 위한 간편하고 안전하며 개인 정보를 보호하는 이메일 전달 서비스를 제공합니다. 많은 조직, 특히 미국 정부와 협력하는 조직에게 규정 준수는 단순한 유행어가 아니라 필수 요소라는 것을 알고 있습니다. **이메일 관련 연방 규정**을 준수하는 것은 매우 중요합니다. 그렇기 때문에 저희의 **안전한 이메일 전달** 서비스가 [제889조](https://www.acquisition.gov/Section-889-Policies)의 [국방권한법(NDAA)](https://en.wikipedia.org/wiki/National_Defense_Authorization_Act)을 포함한 엄격한 연방 요건을 충족하도록 구축되었음을 자랑스럽게 생각합니다.

**정부 이메일 규정 준수**에 대한 저희의 헌신은 최근 **미국 해군사관학교**가 **Forward Email**에 연락하면서 실제로 구현되었습니다.** 그들은 **안전한 이메일 전달** 서비스와 **889조 준수**를 포함한 연방 규정 준수를 확인하는 서류를 요구했습니다. 이 경험은 정부 지원 기관을 지원하고 엄격한 요건을 충족할 수 있는 저희의 준비성과 역량을 보여주는 귀중한 사례 연구입니다. 이러한 헌신은 신뢰할 수 있고 **개인정보 보호에 중점을 둔 이메일** 솔루션을 찾는 모든 사용자에게 적용됩니다.

## 섹션 889 준수 사항 이해 {#understanding-section-889-compliance}

889조란 무엇일까요? 간단히 말해, 미국 연방법으로, 정부 기관이 특정 기업(예: 화웨이, ZTE, 하이크비전, 다화, 하이테라)의 특정 통신 및 영상 감시 장비나 서비스를 사용하는 기관을 이용하거나 해당 기관과 계약을 체결하는 것을 금지합니다. 이 규정은 종종 **화웨이 금지** 및 **ZTE 금지**와 연관되며, 국가 안보를 보호하는 데 도움이 됩니다.

> \[!NOTE]
> 889조는 Huawei, ZTE, Hytera, Hikvision, Dahua 및 그 자회사와 계열사의 장비 및 서비스를 구체적으로 대상으로 합니다.

**Forward Email**과 같은 **정부 계약을 위한 이메일 전달 서비스**의 경우, 이는 당사의 기반 인프라 공급업체가 이러한 금지된 장비를 사용하지 않도록 해야 함을 의미하며, **섹션 889를 준수**해야 함을 의미합니다.

## 전달 이메일이 섹션 889 규정을 준수하는 방법 {#how-forward-email-achieves-section-889-compliance}

그렇다면 **Forward Email은 어떻게 섹션 889 규정을 준수할 수 있을까요?** 저희는 인프라 파트너를 신중하게 선정하여 이를 달성합니다. **Forward Email**은 **섹션 889 규정을 준수하는 인프라**를 위해 두 곳의 주요 공급업체에 전적으로 의존하고 있습니다.

1. **[클라우드플레어](https://www.cloudflare.com/):** 네트워크 서비스 및 **Cloudflare 이메일 보안**을 위한 주요 파트너입니다.
2. **[데이터 패킷](https://datapacket.com/):** 서버 인프라를 위한 주요 공급업체입니다. (장애 조치에는 [디지털 오션](https://www.digitalocean.com/) 및/또는 [불트르](https://www.vultr.com/)을 사용하며, 곧 DataPacket만 사용하도록 전환할 예정입니다. 물론, 두 장애 조치 공급업체 모두 섹션 889 준수를 서면으로 확인했습니다.)

> \[!IMPORTANT]
> 섹션 889에 명시된 금지 장비를 사용하지 않는 Cloudflare와 DataPacket에 대한 당사의 전적인 의존은 당사의 규정 준수의 초석입니다.

[클라우드플레어](https://www.cloudflare.com/)과 [데이터 패킷](https://datapacket.com/)은 모두 높은 보안 표준을 준수하고 있으며 섹션 889에 따라 금지된 장비를 사용하지 않습니다. **섹션 889 준수를 위해 Cloudflare와 DataPacket을 사용하는 것**은 당사 서비스의 기본입니다.

### Cloudflare의 약속 {#cloudflares-commitment}

[클라우드플레어](https://www.cloudflare.com/)은 **[제3자 행동 강령](https://cf-assets.www.cloudflare.com/slt3lc6tev37/284hiWkCYNc49GQpAeBvGN/e137cdac96d1c4cd403c6b525831d284/Third_Party_Code_of_Conduct.pdf)**에서 **섹션 889 준수**를 명시적으로 다루고 있습니다. 해당 내용은 다음과 같습니다.

> "국방권한법(NDAA) 889조에 따라 Cloudflare는 자사 공급망에서 Huawei Technologies Company, ZTE Corporation, Hytera Communications Corporation, Hangzhou Hikvision Digital Technology Company, Dahua Technology Company(또는 이러한 법인의 자회사나 계열사)가 생산 또는 제공하는 통신 장비, 비디오 감시 제품 또는 서비스를 사용하거나 허용하지 않습니다."

*(출처: Cloudflare 제3자 행동 강령, 2025년 4월 29일 검색)*

이 명확한 진술은 **Forward Email**이 활용하는 [클라우드플레어의](https://www.cloudflare.com/) 인프라가 섹션 889 요구 사항을 충족한다는 것을 확인합니다.

### DataPacket의 인프라 {#datapackets-infrastructure}

저희 서버 공급업체인 [데이터 패킷](https://datapacket.com/)은 **Arista Networks**와 **Cisco**의 네트워킹 장비만 사용합니다. Arista와 Cisco는 889조에 따라 금지된 업체에 포함되지 않습니다. 두 회사 모두 보안이 강화된 기업 및 정부 환경에서 널리 사용되는 유수 공급업체로, 엄격한 보안 및 규정 준수 기준을 준수하는 것으로 알려져 있습니다.

**이메일 전달**은 [클라우드플레어](https://www.cloudflare.com/)과 [데이터 패킷](https://datapacket.com/)만 사용하여 전체 서비스 제공 체인에 섹션 889 금지 장비가 없도록 보장하고, **연방 기관**과 기타 보안을 중시하는 사용자를 위한 안전한 이메일 전달을 제공합니다.

## 섹션 889 이후: 보다 광범위한 정부 규정 준수 {#beyond-section-889-broader-government-compliance}

**정부 이메일 보안** 및 규정 준수에 대한 당사의 노력은 섹션 889를 넘어 확장됩니다. **Forward Email** 자체는 대규모 SaaS 플랫폼이 하는 것과 같은 방식으로 [통제된 비밀 정보(CUI)](https://en.wikipedia.org/wiki/Controlled_Unclassified_Information)과 같은 민감한 정부 데이터를 직접 처리하거나 저장하지는 않지만, 당사의 **오픈 소스 이메일 전달** 아키텍처와 안전하고 규정을 준수하는 공급업체에 대한 의존성은 다른 주요 규정의 원칙과 일치합니다.

* **[FAR(연방 조달 규정)](https://en.wikipedia.org/wiki/Federal_Acquisition_Regulation):** 규정을 준수하는 인프라를 사용하고 간편한 상용 서비스를 제공함으로써, 정부 계약업체에 적합한 **FAR(미국 연방 법률) 규정 준수** 이메일 전달 원칙을 제공합니다.
* **개인정보보호법 및 [FISMA](https://en.wikipedia.org/wiki/Federal_Information_Security_Management_Act_of\_2002):** 저희는 **개인정보보호에 중점을 두고** 설계되었으며, **개인정보보호법 이메일** 원칙을 준수합니다. 저희는 고객님의 이메일을 저장하지 않습니다. 이메일은 직접 전달되므로 데이터 처리가 최소화됩니다. 저희 인프라 제공업체([클라우드플레어](https://www.cloudflare.com/), [데이터 패킷](https://datapacket.com/))는 **FISMA 준수 이메일** 원칙에 따라 높은 보안 표준에 따라 시스템을 관리합니다.
* **[HIPAA](https://en.wikipedia.org/wiki/Health_Insurance_Portability_and_Accountability_Act):** **HIPAA 준수 이메일 전달**이 필요한 조직의 경우, **Forward Email**을 규정 준수 솔루션의 일부로 활용할 수 있습니다. 저희는 이메일을 저장하지 않으므로, 주요 규정 준수 책임은 엔드포인트 이메일 시스템에 있습니다. 하지만 저희의 보안 전송 계층은 올바르게 사용할 경우 HIPAA 요구 사항을 충족합니다.

> \[!WARNING]
> **전달 이메일**이 아닌 최종 이메일 제공업체에 [사업 파트너 계약(BAA)](https://en.wikipedia.org/wiki/Business_associate_agreement)이 필요할 수 있습니다. [암호화된 IMAP/POP3 저장 계층](/blog/docs/best-quantum-safe-encrypted-email-service)를 사용하지 않는 한, 저희는 귀하의 이메일 콘텐츠를 저장하지 않습니다.

## 앞으로 나아갈 길: 규정 준수 지평 확장 {#our-path-forward-expanding-compliance-horizons}

특히 연방 정부 계약업체에게 섹션 889 준수는 중요한 기반을 제공하지만, 다양한 조직과 정부 기관의 규제 요구 사항이 다양하고 끊임없이 변화한다는 점을 잘 알고 있습니다. **Forward Email**에서는 투명성을 최우선으로 생각하며, 더 광범위한 규정 준수 환경과 향후 방향에 대한 저희의 관점을 공유하고자 합니다.

우리는 다음과 같은 프레임워크와 규정의 중요성을 인식합니다.

* **[수상 관리 시스템(SAM)](https://sam.gov/):** 직접 연방 계약에 필수적입니다.
* **[FAR(연방 조달 규정)](https://www.acquisition.gov/browse/index/far):** 상업 서비스의 경우 [FAR 52.212-4](https://www.acquisition.gov/far/52.212-4)와 같은 표준 조항을 포함합니다.
* **[DFARS(국방 연방 조달 규정 보충)](https://en.wikipedia.org/wiki/Defense_Federal_Acquisition_Regulation_Supplement):** 특히 DoD 클라우드 서비스의 경우 [DFARS 252.239-7010](https://www.acquisition.gov/dfars/252.239-7010-cloud-computing-services.)가 필요합니다.
* **[CMMC(사이버보안 성숙도 모델 인증)](https://en.wikipedia.org/wiki/Cybersecurity_Maturity_Model_Certification):** [연방 계약 정보(FCI)](https://en.wikipedia.org/wiki/Federal_Contract_Information) 또는 CUI를 처리하는 DoD 계약업체에 필수입니다.
* **[NIST SP 800-171](https://csrc.nist.gov/pubs/sp/800/171/r3/final):** CUI 보호에 중점을 둔 CMMC 레벨 2의 기반입니다. ([NIST](https://en.wikipedia.org/wiki/National_Institute_of_Standards_and_Technology) - 미국 국립표준기술연구소)
* **[FedRAMP(연방 위험 및 승인 관리 프로그램)](https://en.wikipedia.org/wiki/FedRAMP):** 연방 기관에서 사용하는 클라우드 서비스 표준입니다.
* **__PROTECTED_LINK_77__0:** 연방 정보 보안을 위한 포괄적인 프레임워크입니다.
* **__PROTECTED_LINK_77__1:** 개인 건강 정보(PHI) 처리용입니다.
* **__PROTECTED_LINK_77__2:** 학생 교육 기록 보호용입니다.
* **__PROTECTED_LINK_77__3:** 13세 미만 아동을 대상으로 하는 서비스용입니다.

**현재 위치 및 미래 목표:**

**Forward Email**의 핵심 설계는 **개인정보 보호 중심**, **오픈소스**, 그리고 데이터 처리 최소화(특히 기본 **이메일 전달** 서비스)이며, 이러한 규정의 많은 *원칙*과 잘 부합합니다. 기존 보안 관행(암호화, 최신 이메일 표준 지원)과 섹션 889 준수는 강력한 시작점을 제공합니다.

하지만 **FedRAMP** 또는 **CMMC**와 같은 프레임워크에 대한 공식 인증이나 승인을 획득하는 것은 상당한 작업입니다. 엄격한 문서화, 특정 기술 및 절차적 통제(종종 수백 개에 달함) 구현, 독립적인 평가(예: FedRAMP - 제3자 평가 기관의 [3PAO](https://www.fedramp.gov/glossary/#3pao)) 및 지속적인 모니터링이 필요합니다.

> \[!IMPORTANT]
> 규정 준수는 단순히 기술에만 국한되지 않습니다. 문서화된 프로세스, 정책, 그리고 지속적인 경계가 중요합니다. FedRAMP 또는 CMMC와 같은 인증을 획득하려면 상당한 투자와 시간이 필요합니다.

**우리의 약속:**

**Forward Email**이 성장하고 고객의 요구가 변화함에 따라, 저희는 관련 규정 준수 인증을 모색하고 추진하기 위해 최선을 다하고 있습니다. 여기에는 다음 계획이 포함됩니다.

1. **SAM 등록:** 미국 연방 기관과의 직접적인 협력을 촉진합니다.
2. **프로세스 공식화:** CMMC의 기반이 되는 NIST SP 800-171과 같은 표준에 맞춰 내부 문서 및 절차를 개선합니다.
3. **FedRAMP 경로 평가:** FedRAMP 승인 추진의 요건 및 타당성을 평가합니다. 이는 낮음 또는 보통 기준선에서 시작하여, 해당되는 경우 [TO-SaaS](https://www.fedramp.gov/blog/fedramp-releases-low-impact-saas-baseline/) 모델을 활용할 가능성이 있습니다.
4. **특정 요구 사항 지원:** 의료 및 교육 기관과의 협력을 확대함에 따라 HIPAA(BAA 및 저장된 데이터에 대한 특정 구성을 통해) 및 FERPA(적절한 계약 조건 및 통제를 통해)와 같은 요건을 충족합니다.

이 여정에는 신중한 계획과 투자가 필요합니다. 모든 인증에 대한 즉각적인 일정은 없지만, 정부 및 규제 대상 산업의 요구를 충족하기 위해 규정 준수 태세를 강화하는 것이 로드맵의 핵심 부분입니다.

> \[!NOTE]
> 저희는 **오픈 소스**라는 특성 덕분에 이 과정 전반에 걸쳐 독보적인 투명성을 확보할 수 있다고 믿으며, 이를 통해 커뮤니티와 고객 여러분께 저희의 헌신을 직접 보여드릴 수 있습니다.

우리는 규정 준수 과정에서 중요한 이정표에 도달할 때마다 커뮤니티에 지속적으로 업데이트를 제공할 것입니다.

## 이것이 당신에게 중요한 이유 {#why-this-matters-for-you}

**섹션 889 준수 이메일 전달** 서비스(예: **Forward Email**)를 선택하는 것은 다음을 의미합니다.

* **안심 보장:** 특히 정부 기관, 계약업체 및 보안에 민감한 조직에 적합합니다.
* **위험 감소:** **이메일 관련 연방 규정**과의 잠재적 충돌을 방지합니다.
* **신뢰:** 보안 및 공급망 무결성에 대한 의지를 보여줍니다.

**Forward Email**은 사용자 지정 도메인 **이메일 전달** 요구 사항을 관리할 수 있는 간단하고 안정적이며 *규정을 준수하는* 방법을 제공합니다.

## 안전하고 규정을 준수하는 이메일 전달이 여기서 시작됩니다. {#secure-compliant-email-forwarding-starts-here}

**Forward Email**은 **안전하고 개인정보 보호가 보장되는 오픈 소스 이메일 전달** 서비스를 제공하기 위해 최선을 다하고 있습니다. [클라우드플레어](https://www.cloudflare.com/) 및 [데이터 패킷](https://datapacket.com/)과의 파트너십을 통해 **889조 준수**를 달성했으며(**미국 해군사관학교**를 위한 Forward Email 준수** 활동 반영), 이는 이러한 노력을 입증합니다. 정부 기관, 계약업체 또는 단순히 **정부 이메일 보안**을 중요하게 생각하는 모든 분들을 위해 **Forward Email**이 구축되었습니다.

**안전하고 규정을 준수하는 이메일 전달**을 준비하셨나요? [오늘 무료로 가입하세요!](https://forwardemail.net)

## 참조 {#references}

* **889조(NDAA):** <https://www.acquisition.gov/Section-889-Policies>
* **Cloudflare:** <https://www.cloudflare.com/>
* **Cloudflare 제3자 행동 강령:** <https://cf-assets.www.cloudflare.com/slt3lc6tev37/284hiWkCYNc49GQpAeBvGN/e137cdac96d1c4cd403c6b525831d284/Third_Party_Code_of_Conduct.pdf>
* **데이터 패킷:** <https://datapacket.com/>
* **입찰 관리 시스템(SAM):** <https://sam.gov/>
* **연방 조달 규정(FAR):** <https://www.acquisition.gov/browse/index/far>
* **FAR 52.212-4:** <https://www.acquisition.gov/far/52.212-4>
* **국방 연방 조달 규정 보충 문서(DFARS):** <https://www.acquisition.gov/dfars>
* **DFARS 252.239-7010:** <https://www.acquisition.gov/dfars/252.239-7010-cloud-computing-services.>
* **사이버 보안 성숙도 모델 인증(CMMC):** <https://dodcio.defense.gov/cmmc/About/>
* **NIST SP 800-171:** <https://www.cloudflare.com/>0
* **연방 위험 및 승인 관리 프로그램(FedRAMP):** <https://www.cloudflare.com/>1
* **연방 정보 보안 현대화법(FISMA):** <https://www.cloudflare.com/>2
* **건강보험 양도성 및 책임법(HIPAA):** <https://www.cloudflare.com/>3
* **가족 교육 권리 및 개인정보 보호법(FERPA):** <https://www.cloudflare.com/>4
* **아동 온라인 개인정보 보호법(COPPA):** <https://www.cloudflare.com/>5