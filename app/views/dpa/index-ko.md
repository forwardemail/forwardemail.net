# 데이터 처리 계약 {#data-processing-agreement}

<!-- v1.0 from <https://github.com/CommonPaper/DPA> -->

<img loading="lazy" src="/img/articles/dpa.webp" alt="Forward Email 데이터 처리 계약" class="rounded-lg" />


## 목차 {#table-of-contents}

* [주요 용어](#key-terms)
* [계약 변경 사항](#changes-to-the-agreement)
* [1. 처리자 및 하위 처리자 관계](#1-processor-and-subprocessor-relationships)
  * [1. 처리자로서의 제공자](#1-provider-as-processor)
  * [2. 하위 처리자로서의 제공자](#2-provider-as-subprocessor)
* [2. 처리](#2-processing)
  * [1. 처리 세부사항](#1-processing-details)
  * [2. 처리 지침](#2-processing-instructions)
  * [3. 제공자에 의한 처리](#3-processing-by-provider)
  * [4. 고객 처리](#4-customer-processing)
  * [5. 처리에 대한 동의](#5-consent-to-processing)
  * [6. 하위 처리자](#6-subprocessors)
* [3. 제한된 전송](#3-restricted-transfers)
  * [1. 승인](#1-authorization)
  * [2. EEA 외 전송](#2-ex-eea-transfers)
  * [3. 영국 외 전송](#3-ex-uk-transfers)
  * [4. 기타 국제 전송](#4-other-international-transfers)
* [4. 보안 사고 대응](#4-security-incident-response)
* [5. 감사 및 보고서](#5-audit--reports)
  * [1. 감사 권한](#1-audit-rights)
  * [2. 보안 보고서](#2-security-reports)
  * [3. 보안 실사](#3-security-due-diligence)
* [6. 조정 및 협력](#6-coordination--cooperation)
  * [1. 문의에 대한 대응](#1-response-to-inquiries)
  * [2. DPIA 및 DTIA](#2-dpias-and-dtias)
* [7. 고객 개인 데이터 삭제](#7-deletion-of-customer-personal-data)
  * [1. 고객에 의한 삭제](#1-deletion-by-customer)
  * [2. DPA 만료 시 삭제](#2-deletion-at-dpa-expiration)
* [8. 책임 제한](#8-limitation-of-liability)
  * [1. 책임 한도 및 손해 배상 포기](#1-liability-caps-and-damages-waiver)
  * [2. 관련 당사자 청구](#2-related-party-claims)
  * [3. 예외](#3-exceptions)
* [9. 문서 간 충돌](#9-conflicts-between-documents)
* [10. 계약 기간](#10-term-of-agreement)
* [11. 준거법 및 지정 법원](#11-governing-law-and-chosen-courts)
* [12. 서비스 제공자 관계](#12-service-provider-relationship)
* [13. 정의](#13-definitions)
* [크레딧](#credits)


## 주요 용어 {#key-terms}

| 용어                                       | 내용                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <strong>계약</strong>                       | 이 DPA는 [서비스 약관](/terms)을 보완합니다                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| <strong>승인된 하위 처리자</strong>         | [Cloudflare](https://cloudflare.com) (미국; DNS, 네트워킹 및 보안 제공자), [DataPacket](https://www.datapacket.com/) (미국/영국; 호스팅 제공자), [Digital Ocean](https://digitalocean.com) (미국; 호스팅 제공자), [GitHub](https://github.com) (미국; 소스 코드 호스팅, CI/CD 및 프로젝트 관리), [Vultr](https://www.vultr.com) (미국; 호스팅 제공자), [Stripe](https://stripe.com) (미국; 결제 처리자), [PayPal](https://paypal.com) (미국; 결제 처리자) |
| <strong>제공자 보안 연락처</strong>          | <a href="mailto:security@forwardemail.net"><security@forwardemail.net></a>                                                                                                                                                                                                                                                                                                                                                                                                         |
| <strong>보안 정책</strong>                   | [GitHub에서 보안 정책 보기](https://github.com/forwardemail/forwardemail.net/security/policy)                                                                                                                                                                                                                                                                                                                                                                                     |
| <strong>준거 주</strong>                     | 미국 델라웨어 주                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
## 계약 변경 사항 {#changes-to-the-agreement}

이 문서는 [Common Paper DPA 표준 약관 (버전 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0)의 파생 문서이며 다음과 같은 변경 사항이 적용되었습니다:

1. [준거법 및 지정 법원](#11-governing-law-and-chosen-courts)이 아래 섹션으로 포함되었으며 위에 `준거 주`가 명시되어 있습니다.
2. [서비스 제공자 관계](#12-service-provider-relationship)가 아래 섹션으로 포함되었습니다.


## 1. 처리자 및 하위 처리자 관계 {#1-processor-and-subprocessor-relationships}

### 1. 처리자로서의 제공자 {#1-provider-as-processor}

<strong>고객</strong>이 고객 개인 데이터의 관리자인 경우, <strong>제공자</strong>는 <strong>고객</strong>을 대신하여 개인 데이터를 처리하는 처리자로 간주됩니다.

### 2. 하위 처리자로서의 제공자 {#2-provider-as-subprocessor}

<strong>고객</strong>이 고객 개인 데이터의 처리자인 경우, <strong>제공자</strong>는 고객 개인 데이터의 하위 처리자로 간주됩니다.


## 2. 처리 {#2-processing}

### 1. 처리 세부사항 {#1-processing-details}

표지의 부록 I(B)는 본 처리의 대상, 성격, 목적 및 기간과 수집되는 <strong>개인 데이터 범주</strong> 및 <strong>데이터 주체 범주</strong>를 설명합니다.

### 2. 처리 지침 {#2-processing-instructions}

<strong>고객</strong>은 <strong>제공자</strong>에게 고객 개인 데이터를 처리하도록 지시합니다: (a) 서비스를 제공하고 유지하기 위해; (b) <strong>고객</strong>의 서비스 사용을 통해 추가로 명시될 수 있는 경우; (c) <strong>계약</strong>에 문서화된 경우; 및 (d) 본 DPA에 따라 고객 개인 데이터 처리를 위해 <strong>고객</strong>이 제공하고 <strong>제공자</strong>가 승인한 기타 서면 지침에 문서화된 경우. <strong>제공자</strong>는 적용 법률에 의해 금지되지 않는 한 이러한 지침을 준수합니다. <strong>제공자</strong>는 처리 지침을 따를 수 없는 경우 즉시 <strong>고객</strong>에게 알립니다. <strong>고객</strong>은 적용 법률을 준수하는 지침만을 제공하였으며 앞으로도 제공할 것입니다.

### 3. 제공자에 의한 처리 {#3-processing-by-provider}

<strong>제공자</strong>는 본 DPA 및 표지에 명시된 세부사항에 따라 고객 개인 데이터만 처리합니다. <strong>제공자</strong>가 기존 제품을 업데이트하거나 새로운 제품, 기능 또는 기능성을 포함하기 위해 서비스를 업데이트하는 경우, <strong>제공자</strong>는 업데이트를 반영하기 위해 <strong>데이터 주체 범주</strong>, <strong>개인 데이터 범주</strong>, <strong>특별 범주 데이터</strong>, <strong>특별 범주 데이터 제한 또는 보호 조치</strong>, <strong>전송 빈도</strong>, <strong>처리의 성격 및 목적</strong>, <strong>처리 기간</strong>을 변경할 수 있으며, 이 경우 <strong>고객</strong>에게 업데이트 및 변경 사항을 통지합니다.

### 4. 고객 처리 {#4-customer-processing}

<strong>고객</strong>이 처리자이고 <strong>제공자</strong>가 하위 처리자인 경우, <strong>고객</strong>은 고객 개인 데이터 처리에 적용되는 모든 적용 법률을 준수합니다. <strong>고객</strong>과 그 관리인 간의 계약은 유사하게 <strong>고객</strong>이 처리자로서 적용 법률을 준수하도록 요구합니다. 또한, <strong>고객</strong>은 그 관리인과의 계약에 명시된 하위 처리자 요구사항을 준수합니다.

### 5. 처리 동의 {#5-consent-to-processing}

<strong>고객</strong>은 <strong>제공자</strong> 및/또는 서비스에 고객 개인 데이터를 제공함에 있어 모든 적용 데이터 보호법을 준수하였으며, 계속 준수할 것입니다. 여기에는 모든 공개, 동의 획득, 적절한 선택 제공 및 적용 데이터 보호법에 따른 관련 보호 조치 구현이 포함됩니다.
### 6. 하위 처리자 {#6-subprocessors}

a. <strong>제공자</strong>는 <strong>고객</strong>이 하위 처리자를 승인하지 않는 한, 어떠한 고객 개인 데이터도 하위 처리자에게 제공, 이전 또는 인도하지 않습니다. 현재 <strong>승인된 하위 처리자</strong> 목록에는 하위 처리자의 신원, 위치 국가 및 예상 처리 업무가 포함되어 있습니다. <strong>제공자</strong>는 하위 처리자의 추가 또는 교체 등 <strong>승인된 하위 처리자</strong>에 대한 변경 사항이 있을 경우 최소 10 영업일 전에 서면으로 <strong>고객</strong>에게 통지하여, <strong>고객</strong>이 <strong>제공자</strong>가 새로운 하위 처리자를 사용하기 전에 변경 사항에 대해 이의를 제기할 충분한 시간을 가질 수 있도록 합니다. <strong>제공자</strong>는 <strong>고객</strong>이 <strong>승인된 하위 처리자</strong> 변경에 대해 이의를 제기할 권리를 행사할 수 있도록 필요한 정보를 제공합니다. <strong>고객</strong>은 <strong>승인된 하위 처리자</strong> 변경 통지 후 30일 이내에 이의를 제기해야 하며, 그렇지 않으면 변경 사항을 수락한 것으로 간주됩니다. 만약 <strong>고객</strong>이 통지 후 30일 이내에 변경에 대해 이의를 제기하는 경우, <strong>고객</strong>과 <strong>제공자</strong>는 선의로 협력하여 <strong>고객</strong>의 이의 또는 우려를 해결합니다.

b. 하위 처리자를 고용할 때, <strong>제공자</strong>는 하위 처리자가 고객 개인 데이터에 (i) 위탁받은 의무를 수행하는 데 필요한 범위 내에서만 접근하고 사용하며, (ii) <strong>계약</strong> 조건에 부합하도록 보장하는 서면 계약을 체결합니다.

c. GDPR이 고객 개인 데이터 처리에 적용되는 경우, (i) 본 DPA에 명시된 데이터 보호 의무(해당되는 경우 GDPR 제28조(3항)에서 언급된 의무)가 하위 처리자에게도 부과되며, (ii) <strong>제공자</strong>와 하위 처리자 간의 계약에는 이러한 의무가 포함되고, <strong>제공자</strong>와 하위 처리자가 고객 개인 데이터 처리에 관한 문의나 요청에 대응하는 방법에 대한 세부사항이 포함됩니다. 또한, <strong>제공자</strong>는 <strong>고객</strong>의 요청 시 하위 처리자와의 계약서(수정 사항 포함) 사본을 공유합니다. 영업 비밀 또는 기타 기밀 정보(개인 데이터 포함)를 보호하기 위해 필요한 범위 내에서, <strong>제공자</strong>는 하위 처리자와의 계약서 내용을 공유 전에 편집할 수 있습니다.

d. <strong>제공자</strong>는 하위 처리자에게 위탁한 모든 의무에 대해 전적으로 책임을 지며, 하위 처리자의 고객 개인 데이터 처리와 관련된 행위 및 부작위에 대해서도 책임을 집니다. <strong>제공자</strong>는 하위 처리자가 고객 개인 데이터와 관련된 중대한 의무를 이행하지 못한 경우 <strong>고객</strong>에게 통지합니다.


## 3. 제한된 이전 {#3-restricted-transfers}

### 1. 승인 {#1-authorization}

<strong>고객</strong>은 <strong>제공자</strong>가 서비스를 제공하기 위해 필요할 경우 고객 개인 데이터를 EEA, 영국 또는 기타 관련 지리적 영역 외부로 이전할 수 있음을 동의합니다. <strong>제공자</strong>가 고객 개인 데이터를 유럽연합 집행위원회 또는 기타 관련 감독 당국이 적정성 결정을 내리지 않은 지역으로 이전하는 경우, <strong>제공자</strong>는 해당 지역으로의 고객 개인 데이터 이전에 대해 적용 가능한 데이터 보호 법률에 부합하는 적절한 보호 조치를 시행합니다.

### 2. EEA 외 이전 {#2-ex-eea-transfers}

<strong>고객</strong>과 <strong>제공자</strong>는 GDPR이 고객 개인 데이터 이전을 보호하는 경우, 이전이 EEA 내 <strong>고객</strong>에서 EEA 외부 <strong>제공자</strong>로 이루어지고, 유럽연합 집행위원회의 적정성 결정에 의해 규율되지 않는 경우, 본 DPA 체결을 통해 <strong>고객</strong>과 <strong>제공자</strong>가 EEA SCCs 및 그 부속서를 서명한 것으로 간주되며, 이는 참조로 포함됩니다. 이러한 이전은 다음과 같이 완성된 EEA SCCs에 따라 이루어집니다:
a. EEA SCCs의 모듈 2 (컨트롤러에서 프로세서로)는 <strong>고객</strong>이 컨트롤러이고 <strong>제공자</strong>가 프로세서로서 <strong>고객</strong>의 개인 데이터를 처리하는 경우에 적용됩니다.

b. EEA SCCs의 모듈 3 (프로세서에서 하위 프로세서로)는 <strong>고객</strong>이 프로세서이고 <strong>제공자</strong>가 하위 프로세서로서 <strong>고객</strong>을 대신하여 고객 개인 데이터를 처리하는 경우에 적용됩니다.

c. 각 모듈에 대해 다음이 적용됩니다 (해당되는 경우):

1. 조항 7의 선택적 도킹 조항은 적용되지 않습니다;

2. 조항 9의 옵션 2 (일반 서면 승인)가 적용되며, 하위 프로세서 변경에 대한 사전 통지 최소 기간은 10 영업일입니다;

3. 조항 11의 선택적 문구는 적용되지 않습니다;

4. 조항 13의 모든 대괄호는 제거됩니다;

5. 조항 17 (옵션 1)에서 EEA SCCs는 <strong>관할 회원국</strong> 법률에 따라 규율됩니다;

6. 조항 18(b)에서 분쟁은 <strong>관할 회원국</strong> 법원의 관할에 따릅니다; 그리고

7. 이 DPA의 표지에는 EEA SCCs의 부록 I, 부록 II 및 부록 III에 요구되는 정보가 포함되어 있습니다.

### 3. 영국 제외 이전 {#3-ex-uk-transfers}

<strong>고객</strong>과 <strong>제공자</strong>는 UK GDPR이 고객 개인 데이터 이전을 보호하는 경우, 이전이 영국 내의 <strong>고객</strong>에서 영국 외부의 <strong>제공자</strong>로 이루어지고, 이전이 영국 국무장관이 내린 적정성 결정에 의해 규율되지 않는 경우, 본 DPA 체결을 통해 <strong>고객</strong>과 <strong>제공자</strong>는 UK 부록 및 그 부속 문서에 서명한 것으로 간주되며, 이는 참조에 의해 통합됩니다. 이러한 이전은 다음과 같이 완성된 UK 부록에 따라 이루어집니다:

a. 본 DPA의 섹션 3.2에는 UK 부록의 표 2에 요구되는 정보가 포함되어 있습니다.

b. UK 부록의 표 4는 다음과 같이 수정됩니다: 어느 당사자도 UK 부록의 섹션 19에 명시된 대로 UK 부록을 종료할 수 없으며; ICO가 UK 부록의 섹션 18에 따라 수정된 승인 부록을 발행하는 경우, 당사자들은 선의로 협력하여 본 DPA를 이에 맞게 수정합니다.

c. 표지에는 UK 부록의 부록 1A, 부록 1B, 부록 II 및 부록 III에 요구되는 정보가 포함되어 있습니다.

### 4. 기타 국제 이전 {#4-other-international-transfers}

스위스 법률(및 EEA 회원국 또는 영국 법률이 아닌)이 국제 이전의 적용 법률인 경우, EEA SCCs 조항 4에서 GDPR에 대한 언급은 법적으로 요구되는 범위 내에서 스위스 연방 데이터 보호법 또는 그 후속 법률로 수정되며, 감독 기관의 개념에는 스위스 연방 데이터 보호 및 정보 위원회가 포함됩니다.


## 4. 보안 사고 대응 {#4-security-incident-response}

1. 보안 사고를 인지하는 즉시, <strong>제공자</strong>는: (a) 가능한 한 지체 없이, 그러나 보안 사고 인지 후 72시간 이내에 <strong>고객</strong>에게 통지합니다; (b) 보안 사고에 대해 알게 되는 즉시 또는 <strong>고객</strong>이 합리적으로 요청하는 경우 적시에 정보를 제공합니다; 그리고 (c) 신속하게 보안 사고를 통제하고 조사하기 위한 합리적인 조치를 취합니다. 본 DPA에 따라 요구되는 <strong>제공자</strong>의 보안 사고 통지 또는 대응은 <strong>제공자</strong>가 보안 사고에 대해 어떠한 과실이나 책임을 인정하는 것으로 해석되지 않습니다.


## 5. 감사 및 보고 {#5-audit--reports}

### 1. 감사 권한 {#1-audit-rights}

<strong>제공자</strong>는 본 DPA 준수를 입증하는 데 합리적으로 필요한 모든 정보를 <strong>고객</strong>에게 제공하며, 본 DPA 준수를 평가하기 위한 감사, 포함하여 <strong>고객</strong>의 검사를 허용하고 이에 협력합니다. 다만, <strong>고객</strong>의 정보 접근이 <strong>제공자</strong>의 지적 재산권, 비밀 유지 의무 또는 기타 적용 법률상의 의무에 부정적인 영향을 미치는 경우, <strong>제공자</strong>는 데이터 또는 정보에 대한 접근을 제한할 수 있습니다. <strong>고객</strong>은 본 DPA 및 적용 데이터 보호법에 의해 부여된 감사 권한을 본 DPA에 따른 보고 및 실사 요구 사항 준수를 <strong>제공자</strong>에게 지시함으로써만 행사할 것임을 인정하고 동의합니다. <strong>제공자</strong>는 본 DPA 종료 후 3년간 본 DPA 준수 기록을 유지합니다.
### 2. 보안 보고서 {#2-security-reports}

<strong>고객</strong>은 <strong>제공자</strong>가 독립적인 제3자 감사인에 의해 <strong>보안 정책</strong>에 정의된 기준에 따라 정기적으로 감사를 받는다는 것을 인정합니다. 서면 요청 시, <strong>제공자</strong>는 <strong>고객</strong>에게 기밀로 현재 보고서의 요약본을 제공하여 <strong>고객</strong>이 <strong>보안 정책</strong>에 정의된 기준에 대한 <strong>제공자</strong>의 준수를 확인할 수 있도록 합니다.

### 3. 보안 실사 {#3-security-due-diligence}

보고서 외에도, <strong>제공자</strong>는 이 DPA 준수를 확인하기 위해 <strong>고객</strong>이 합리적으로 요청하는 정보에 응답하며, 여기에는 정보 보안, 실사 및 감사 설문지에 대한 응답 또는 정보 보안 프로그램에 관한 추가 정보 제공이 포함됩니다. 모든 요청은 서면으로 <strong>제공자 보안 연락처</strong>에게 제출되어야 하며 연 1회만 요청할 수 있습니다.


## 6. 조정 및 협력 {#6-coordination--cooperation}

### 1. 문의에 대한 대응 {#1-response-to-inquiries}

<strong>제공자</strong>가 고객 개인 데이터 처리에 관해 타인으로부터 문의나 요청을 받으면, <strong>제공자</strong>는 해당 요청을 <strong>고객</strong>에게 통지하며 <strong>고객</strong>의 사전 동의 없이 요청에 응답하지 않습니다. 이러한 문의 및 요청의 예로는 고객 개인 데이터에 관한 사법, 행정 또는 규제 기관의 명령이 있으며, 해당 법률에 따라 <strong>고객</strong>에게 통지하는 것이 금지되지 않은 경우 또는 데이터 주체의 요청이 있습니다. 해당 법률이 허용하는 경우, <strong>제공자</strong>는 이러한 요청에 대해 <strong>고객</strong>의 합리적인 지침을 따르며, 상태 업데이트 및 <strong>고객</strong>이 합리적으로 요청하는 기타 정보를 제공합니다. 데이터 주체가 적용 데이터 보호법에 따라 <strong>고객</strong>이 <strong>제공자</strong>에게 제공한 고객 개인 데이터의 삭제 또는 수신 거부를 유효하게 요청하는 경우, <strong>제공자</strong>는 적용 데이터 보호법에 따라 <strong>고객</strong>이 요청을 이행할 수 있도록 지원합니다. <strong>제공자</strong>는 이 DPA에 따른 고객 개인 데이터 처리에 관한 제3자 요청에 대해 <strong>고객</strong>이 취하는 법적 대응 또는 기타 절차적 조치에 대해 <strong>고객</strong>의 비용 부담 하에 협력하고 합리적인 지원을 제공합니다.

### 2. DPIA 및 DTIA {#2-dpias-and-dtias}

적용 데이터 보호법에서 요구하는 경우, <strong>제공자</strong>는 처리 및 고객 개인 데이터의 성격을 고려하여, <strong>고객</strong>이 의무적인 데이터 보호 영향 평가 또는 데이터 전송 영향 평가 및 관련 데이터 보호 당국과의 협의를 수행하는 데 합리적으로 지원합니다.


## 7. 고객 개인 데이터 삭제 {#7-deletion-of-customer-personal-data}

### 1. 고객에 의한 삭제 {#1-deletion-by-customer}

<strong>제공자</strong>는 서비스 기능과 일치하는 방식으로 <strong>고객</strong>이 고객 개인 데이터를 삭제할 수 있도록 합니다. <strong>제공자</strong>는 적용 법률에 의해 고객 개인 데이터의 추가 저장이 요구되는 경우를 제외하고, 가능한 한 신속하게 이 지침을 준수합니다.

### 2. DPA 만료 시 삭제 {#2-deletion-at-dpa-expiration}

a. DPA가 만료된 후, <strong>제공자</strong>는 적용 법률에 의해 고객 개인 데이터의 추가 저장이 요구되거나 허용되지 않는 한, <strong>고객</strong>의 지시에 따라 고객 개인 데이터를 반환하거나 삭제합니다. 반환 또는 파기가 실현 불가능하거나 적용 법률에 의해 금지된 경우, <strong>제공자</strong>는 고객 개인 데이터의 추가 처리를 방지하기 위해 합리적인 노력을 기울이며, 소유, 관리 또는 통제하에 남아 있는 고객 개인 데이터를 계속 보호합니다. 예를 들어, 적용 법률은 <strong>제공자</strong>가 고객 개인 데이터를 계속 호스팅하거나 처리하도록 요구할 수 있습니다.
b. <strong>고객</strong>과 <strong>제공자</strong>가 본 DPA의 일부로 EEA SCCs 또는 UK 부속서를 체결한 경우, <strong>고객</strong>이 요청하는 경우에만 <strong>제공자</strong>는 EEA SCCs의 조항 8.1(d) 및 조항 8.5에 설명된 개인정보 삭제 인증서를 <strong>고객</strong>에게 제공합니다.


## 8. 책임 제한 {#8-limitation-of-liability}

### 1. 책임 한도 및 손해 배상 포기 {#1-liability-caps-and-damages-waiver}

**적용 가능한 데이터 보호법이 허용하는 최대 범위 내에서, 본 DPA와 관련하여 각 당사자가 상대방에게 지는 총 누적 책임은 <strong>계약</strong>에 명시된 면책, 제외 및 책임 제한에 따릅니다.**

### 2. 관련 당사자 청구 {#2-related-party-claims}

**본 DPA와 관련하여 <strong>제공자</strong> 또는 그 계열사에 대해 제기되는 모든 청구는 <strong>계약</strong>의 당사자인 <strong>고객</strong> 법인만이 제기할 수 있습니다.**

### 3. 예외 {#3-exceptions}

1. 본 DPA는 적용 가능한 데이터 보호법에 따른 개인의 데이터 보호 권리에 관한 개인에 대한 어떠한 책임도 제한하지 않습니다. 또한, 본 DPA는 당사자 간 EEA SCCs 또는 UK 부속서 위반에 대한 책임도 제한하지 않습니다.


## 9. 문서 간 충돌 {#9-conflicts-between-documents}

1. 본 DPA는 <strong>계약</strong>의 일부이며 이를 보완합니다. 본 DPA, <strong>계약</strong> 또는 그 일부 간에 불일치가 있는 경우, 불일치에 대해 앞에 나열된 부분이 뒤에 나열된 부분보다 우선합니다: (1) EEA SCCs 또는 UK 부속서, (2) 본 DPA, 그리고 (3) <strong>계약</strong>.


## 10. 계약 기간 {#10-term-of-agreement}

본 DPA는 <strong>제공자</strong>와 <strong>고객</strong>이 DPA 커버 페이지에 동의하고 <strong>계약</strong>에 서명하거나 전자적으로 수락하는 시점에 시작되며, <strong>계약</strong>이 만료되거나 종료될 때까지 계속됩니다. 그러나 <strong>고객</strong>이 <strong>제공자</strong>에게 고객 개인정보 전송을 중단하고 <strong>제공자</strong>가 고객 개인정보 처리를 중단할 때까지, <strong>제공자</strong>와 <strong>고객</strong>은 본 DPA 및 적용 가능한 데이터 보호법상의 의무를 계속 준수합니다.


## 11. 준거법 및 관할 법원 {#11-governing-law-and-chosen-courts}

<strong>계약</strong>의 준거법 또는 유사 조항에도 불구하고, 본 DPA에 관한 모든 해석 및 분쟁은 법률 충돌 규정을 무시하고 <strong>준거 주</strong>의 법률에 따릅니다. 또한, <strong>계약</strong>의 포럼 선택, 관할권 또는 유사 조항에도 불구하고, 당사자들은 본 DPA와 관련된 모든 법적 소송, 행위 또는 절차를 <strong>준거 주</strong> 법원의 전속 관할권에 제기하며, 각 당사자는 이에 대해 취소할 수 없는 전속 관할권에 복종하는 데 동의합니다.


## 12. 서비스 제공자 관계 {#12-service-provider-relationship}

캘리포니아 소비자 개인정보 보호법(Cal. Civ. Code § 1798.100 등, "CCPA")이 적용되는 범위 내에서, 당사자들은 <strong>제공자</strong>가 서비스 제공자로서 <strong>계약</strong>에 따라 서비스를 제공하기 위해 <strong>고객</strong>으로부터 개인정보를 수신하고 있음을 인정하고 동의합니다. 이는 사업 목적에 해당합니다. <strong>제공자</strong>는 <strong>계약</strong>에 따라 <strong>고객</strong>이 제공한 개인정보를 판매하지 않습니다. 또한, <strong>제공자</strong>는 <strong>계약</strong>에 명시된 서비스 제공에 필요한 경우, 또는 적용 가능한 데이터 보호법에 의해 허용되는 경우를 제외하고는 <strong>고객</strong>이 제공한 개인정보를 보유, 사용 또는 공개하지 않습니다. <strong>제공자</strong>는 본 문단의 제한 사항을 이해함을 인증합니다.
## 13. 정의 {#13-definitions}

1. **"적용 법률"**은 당사자에게 적용되거나 당사자를 규율하는 관련 정부 당국의 법률, 규칙, 규정, 법원 명령 및 기타 구속력 있는 요구사항을 의미합니다.

2. **"적용 데이터 보호 법률"**은 서비스가 개인의 개인 정보, 개인 데이터, 개인 식별 정보 또는 이와 유사한 용어를 처리하거나 사용할 수 있는 방식을 규율하는 적용 법률을 의미합니다.

3. **"관리자"**는 개인 데이터 처리의 목적과 범위를 결정하는 회사에 대해 적용 데이터 보호 법률에서 부여하는 의미를 갖습니다.

4. **"표지 문서"**는 당사자들이 서명하거나 전자적으로 수락한 문서로, 이 DPA 표준 조건을 포함하고 <strong>제공자</strong>, <strong>고객</strong> 및 데이터 처리의 주제와 세부 사항을 식별하는 문서를 의미합니다.

5. **"고객 개인 데이터"**는 <strong>고객</strong>이 서비스의 일부로 <strong>제공자</strong>에게 업로드하거나 제공하며 이 DPA에 의해 규율되는 개인 데이터를 의미합니다.

6. **"DPA"**는 이 DPA 표준 조건, <strong>제공자</strong>와 <strong>고객</strong> 간의 표지 문서, 그리고 표지 문서에 참조되거나 첨부된 정책 및 문서를 의미합니다.

7. **"EEA SCCs"**는 유럽 의회 및 유럽 이사회 규정 (EU) 2016/679에 따라 개인 데이터를 제3국으로 전송하기 위한 표준 계약 조항에 관한 2021년 6월 4일 유럽 위원회의 시행 결정 2021/914에 부속된 표준 계약 조항을 의미합니다.

8. **"유럽 경제 지역"** 또는 **"EEA"**는 유럽 연합 회원국, 노르웨이, 아이슬란드 및 리히텐슈타인을 의미합니다.

9. **"GDPR"**은 관련 EEA 회원국의 현지 법률에 의해 시행된 유럽 연합 규정 2016/679을 의미합니다.

10. **"개인 데이터"**는 적용 데이터 보호 법률에서 개인 정보, 개인 데이터 또는 이와 유사한 용어에 대해 부여하는 의미를 갖습니다.

11. **"처리"** 또는 **"처리하다"**는 적용 데이터 보호 법률에서 자동화된 방법을 포함하여 개인 데이터에 대한 모든 사용 또는 컴퓨터 작업 수행에 대해 부여하는 의미를 갖습니다.

12. **"처리자"**는 관리자 대신 개인 데이터를 처리하는 회사에 대해 적용 데이터 보호 법률에서 부여하는 의미를 갖습니다.

13. **"보고서"**는 제공자를 대신하여 보안 정책에 정의된 기준에 따라 다른 회사가 작성한 감사 보고서를 의미합니다.

14. **"제한된 전송"**은 (a) GDPR이 적용되는 경우, 유럽 위원회의 적정성 결정 대상이 아닌 EEA 외 국가로의 개인 데이터 전송; 및 (b) UK GDPR이 적용되는 경우, 영국 데이터 보호법 2018년 제17A조에 따른 적정성 규정을 적용받지 않는 영국에서 다른 국가로의 개인 데이터 전송을 의미합니다.

15. **"보안 사고"**는 GDPR 제4조에 정의된 개인 데이터 유출을 의미합니다.

16. **"서비스"**는 <strong>계약</strong>에 설명된 제품 및/또는 서비스를 의미합니다.

17. **"특별 범주 데이터"**는 GDPR 제9조에 부여된 의미를 갖습니다.

18. **"하위 처리자"**는 관리자 승인 및 수락을 받아 처리자를 지원하여 관리자를 대신해 개인 데이터를 처리하는 회사에 대해 적용 데이터 보호 법률에서 부여하는 의미를 갖습니다.

19. **"UK GDPR"**은 2018년 영국의 유럽 연합 (탈퇴) 법 제3조에 의해 영국에서 시행된 유럽 연합 규정 2016/679을 의미합니다.

20. **"UK 부록"**은 2018년 데이터 보호법 S119A(1)조에 따른 제한된 전송을 수행하는 당사자를 위해 정보 위원회가 발행한 EEA SCCs에 대한 국제 데이터 전송 부록을 의미합니다.


## 크레딧 {#credits}

이 문서는 [Common Paper DPA Standard Terms (버전 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0)를 기반으로 하며 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 라이선스 하에 있습니다.
