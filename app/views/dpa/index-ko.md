# 데이터 처리 계약 {#data-processing-agreement}

<!-- <https://github.com/CommonPaper/DPA>에서 v1.0으로 -->

<img loading="lazy" src="/img/articles/dpa.webp" alt="Forward Email data processing agreement" 클래스="둥근-lg" />

## 목차 {#table-of-contents}

* [주요 용어](#key-terms)
* [계약 변경 사항](#changes-to-the-agreement)
* [1. 프로세서와 하위 프로세서 관계](#1-processor-and-subprocessor-relationships)
  * [1. 제공자이자 처리자](#1-provider-as-processor)
  * [2. 하위 처리자로서의 공급자](#2-provider-as-subprocessor)
* [2. 처리](#2-processing)
  * [1. 처리 세부 사항](#1-processing-details)
  * [2. 처리 지침](#2-processing-instructions)
  * [3. 공급자의 처리](#3-processing-by-provider)
  * [4. 고객 처리](#4-customer-processing)
  * [5. 처리에 대한 동의](#5-consent-to-processing)
  * [6. 하위 프로세서](#6-subprocessors)
* [3. 제한된 전송](#3-restricted-transfers)
  * [1. 승인](#1-authorization)
  * [2. EEA 이전](#2-ex-eea-transfers)
  * [3. 영국 외 이전](#3-ex-uk-transfers)
  * [4. 기타 국제 이전](#4-other-international-transfers)
* [4. 보안 사고 대응](#4-security-incident-response)
* [5. 감사 및 보고](#5-audit--reports)
  * [1. 감사권](#1-audit-rights)
  * [2. 보안 보고서](#2-security-reports)
  * [3. 보안 실사](#3-security-due-diligence)
* [6. 조정 및 협력](#6-coordination--cooperation)
  * [1. 문의사항에 대한 답변](#1-response-to-inquiries)
  * [2. DPIA 및 DTIA](#2-dpias-and-dtias)
* [7. 고객 개인 정보 삭제](#7-deletion-of-customer-personal-data)
  * [1. 고객에 의한 삭제](#1-deletion-by-customer)
  * [2. DPA 만료 시 삭제](#2-deletion-at-dpa-expiration)
* [8. 책임의 한계](#8-limitation-of-liability)
  * [1. 책임 한도 및 손해배상 면제](#1-liability-caps-and-damages-waiver)
  * [2. 관련 당사자 청구](#2-related-party-claims)
  * [3. 예외](#3-exceptions)
* [9. 문서 간 충돌](#9-conflicts-between-documents)
* [10. 계약 기간](#10-term-of-agreement)
* [11. 준거법 및 선택된 법원](#11-governing-law-and-chosen-courts)
* [12. 서비스 제공자 관계](#12-service-provider-relationship)
* [13. 정의](#13-definitions)
* [크레딧](#credits)

## 주요 용어 {#key-terms}

| 용어 | 값 |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <strong>동의</strong> | 이 DPA는 [Terms of Service](/terms)을 보완합니다. |
| <strong>승인된 하위 프로세서</strong> | [Cloudflare](https://cloudflare.com) (미국; DNS, 네트워킹 및 보안 제공자), [DataPacket](https://www.datapacket.com/) (미국/영국; 호스팅 제공자), [Digital Ocean](https://digitalocean.com) (미국; 호스팅 제공자), [Vultr](https://www.vultr.com) (미국; 호스팅 제공자), [Stripe](https://stripe.com) (미국; 결제 처리업체), [PayPal](https://paypal.com) (미국; 결제 처리업체) |
| <strong>공급자 보안 담당자</strong> | <a href="mailto:security@forwardemail.net"><security@forwardemail.net></a> |
| <strong>보안 정책</strong> | [our Security Policy on GitHub](https://github.com/forwardemail/forwardemail.net/security/policy) 보기 |
| <strong>통치 국가</strong> | 미국 델라웨어주 |

## 계약 변경 사항 {#changes-to-the-agreement}

이 문서는 [일반 논문 DPA 표준 용어(버전 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0)에서 파생되었으며 다음과 같은 변경 사항이 적용되었습니다.

1. [준거법 및 선택된 법원](#11-governing-law-and-chosen-courts)은 위에 명시된 `Governing State`과 함께 아래 섹션으로 포함되었습니다.
2. [서비스 제공자 관계](#12-service-provider-relationship)는 아래 섹션으로 포함되었습니다.

## 1. 프로세서 및 하위 프로세서 관계 {#1-processor-and-subprocessor-relationships}

### 1. 프로세서로서의 공급자 {#1-provider-as-processor}

<strong>고객</strong>이 고객 개인 데이터의 관리자인 경우, <strong>공급자</strong>는 <strong>고객</strong>을 대신하여 개인 데이터를 처리하는 처리자로 간주됩니다.

### 2. 하위 프로세서로서의 공급자 {#2-provider-as-subprocessor}

<strong>고객</strong>이 고객 개인 데이터의 처리자인 경우, <strong>공급자</strong>는 고객 개인 데이터의 하위 처리자로 간주됩니다.

## 2. {#2-processing}} 처리 중

### 1. 처리 세부 정보 {#1-processing-details}

표지의 부록 I(B)에는 이 처리의 주제, 성격, 목적 및 기간과 함께 수집된 <strong>개인 데이터 범주</strong> 및 <strong>데이터 주체 범주</strong>가 설명되어 있습니다.

### 2. 처리 지침 {#2-processing-instructions}

<strong>고객</strong>은 <strong>공급자</strong>에게 다음과 같이 고객 개인 데이터를 처리하도록 지시합니다. (a) 서비스를 제공하고 유지하기 위해; (b) <strong>고객</strong>이 서비스를 이용함으로써 추가로 명시될 수 있는 경우; (c) <strong>계약</strong>에 문서화된 경우; (d) <strong>고객</strong>이 제공하고 <strong>공급자</strong>가 본 DPA에 따라 고객 개인 데이터를 처리하는 것에 관해 인정한 다른 서면 지침에 문서화된 경우. <strong>공급자</strong>는 해당 법률에 의해 금지되지 않는 한 이러한 지침을 준수합니다. <strong>공급자</strong>는 처리 지침을 따를 수 없는 경우 즉시 <strong>고객</strong>에게 알립니다. <strong>고객</strong>은 해당 법률을 준수하는 지침만 제공했으며 앞으로도 계속 제공할 것입니다.

### 3. 공급자별 처리 {#3-processing-by-provider}

<strong>제공자</strong>는 표지 페이지의 세부 정보를 포함하여 본 DPA에 따라서만 고객 개인 데이터를 처리합니다. <strong>제공자</strong>가 기존 제품, 기능 또는 기능을 업데이트하거나 새로운 제품, 기능 또는 기능을 포함하기 위해 서비스를 업데이트하는 경우, <strong>제공자</strong>는 <strong>데이터 주체 범주</strong>, <strong>개인 데이터 범주</strong>, <strong>특수 범주 데이터</strong>, <strong>특수 범주 데이터 제한 또는 보호 조치</strong>, <strong>전송 빈도</strong>, <strong>처리의 성격 및 목적</strong>, 그리고 <strong>처리 기간</strong>을 필요에 따라 변경하여 <strong>고객</strong>에게 업데이트 및 변경 사항을 알릴 수 있습니다.

### 4. 고객 처리 {#4-customer-processing}

<strong>고객</strong>이 처리자이고 <strong>제공자</strong>가 하위 처리자일 경우, <strong>고객</strong>은 <strong>고객</strong>의 고객 개인 데이터 처리에 적용되는 모든 관련 법률을 준수해야 합니다. <strong>고객</strong>과 고객 관리자 간의 계약은 마찬가지로 <strong>고객</strong>이 처리자로서 <strong>고객</strong>에게 적용되는 모든 관련 법률을 준수하도록 요구합니다. 또한, <strong>고객</strong>은 <strong>고객</strong>과 고객 관리자 간의 계약에 따른 하위 처리자 요건을 준수해야 합니다.

### 5. 처리에 대한 동의 {#5-consent-to-processing}

<strong>고객</strong>은 <strong>공급자</strong> 및/또는 서비스에 고객 개인 데이터를 제공하는 것과 관련하여 모든 해당 데이터 보호법을 준수했으며 앞으로도 계속 준수할 것입니다. 여기에는 모든 공개, 모든 동의 획득, 적절한 선택권 제공, 해당 데이터 보호법에 따라 요구되는 관련 안전장치 구현이 포함됩니다.

### 6. 하위 프로세서 {#6-subprocessors}

a. <strong>공급자</strong>는 <strong>고객</strong>이 하위 처리자를 승인하지 않는 한 고객 개인 데이터를 하위 처리자에게 제공, 이전 또는 인계하지 않습니다. 현재 <strong>승인된 하위 처리자</strong> 목록에는 하위 처리자의 신원, 소재 국가 및 예상 처리 작업이 포함됩니다. <strong>공급자</strong>는 하위 처리자의 추가 또는 교체를 통해 <strong>승인된 하위 처리자</strong>에 대한 변경 사항을 최소 10영업일 전에 서면으로 <strong>고객</strong>에게 알려야 합니다. 이를 통해 <strong>고객</strong>은 <strong>공급자</strong>가 새로운 하위 처리자를 사용하기 시작하기 전에 변경 사항에 이의를 제기할 충분한 시간을 확보할 수 있습니다. <strong>공급자</strong>는 <strong>고객</strong>이 <strong>승인된 하위 처리자</strong> 변경 사항에 이의를 제기할 권리를 행사할 수 있도록 필요한 정보를 <strong>고객</strong>에게 제공합니다. <strong>고객</strong>은 <strong>승인된 하위 처리자</strong>에게 변경 사항을 통지한 후 30일 이내에 이의를 제기할 수 있으며, 그렇지 않을 경우 <strong>고객</strong>은 변경 사항을 수락한 것으로 간주됩니다. <strong>고객</strong>이 통지 후 30일 이내에 변경 사항에 이의를 제기하는 경우, <strong>고객</strong>과 <strong>공급업체</strong>는 <strong>고객</strong>의 이의 또는 우려 사항을 해결하기 위해 성실히 협력합니다.

b. 하청업체를 고용할 경우, <strong>공급자</strong>는 하청업체와 서면 계약을 체결해야 하며, 이 계약은 하청업체가 (i) 하청된 의무를 이행하는 데 필요한 범위 내에서만 고객 개인 데이터에 접근하고 이를 사용하며, (ii) <strong>계약</strong>의 조건에 따라야 함을 보장합니다.

c. GDPR이 고객 개인 데이터 처리에 적용되는 경우, (i) 이 DPA에 설명된 데이터 보호 의무(해당되는 경우 GDPR 제28조(3)항에 언급됨)가 하위 처리자에게도 부과되고, (ii) <strong>공급자</strong>와 하위 처리자의 계약에는 이러한 의무가 포함되며, 여기에는 <strong>공급자</strong>와 하위 처리자가 고객 개인 데이터 처리에 대한 문의나 요청에 응답하기 위해 어떻게 협력할 것인지에 대한 세부 정보가 포함됩니다. 또한 <strong>공급자</strong>는 <strong>고객</strong>의 요청에 따라 계약 사본(수정 사항 포함)을 하위 처리자와 공유합니다. 영업 비밀 또는 개인 데이터를 포함한 기타 기밀 정보를 보호하는 데 필요한 범위 내에서 <strong>공급자</strong>는 사본을 공유하기 전에 하위 처리자와의 계약 텍스트를 삭제할 수 있습니다.

d. <strong>공급자</strong>는 고객 개인 데이터 처리에 있어서 하위 처리자의 행위 및 부작위를 포함하여 하위 처리자에게 하청된 모든 의무에 대해 전적인 책임을 집니다. <strong>공급자</strong>는 <strong>공급자</strong>와 하위 처리자 간의 계약에 따라 하위 처리자가 고객 개인 데이터에 대한 중요한 의무를 이행하지 못하는 경우 고객에게 통지해야 합니다.

## 3. 제한된 전송 {#3-restricted-transfers}

### 1. 권한 부여 {#1-authorization}

<strong>고객</strong>은 <strong>제공자</strong>가 서비스 제공을 위해 필요에 따라 고객 개인 데이터를 EEA, 영국 또는 기타 관련 지역 외부로 전송할 수 있음에 동의합니다. <strong>제공자</strong>가 유럽 위원회 또는 기타 관련 감독 기관에서 적정성 결정을 내리지 않은 지역으로 고객 개인 데이터를 전송하는 경우, <strong>제공자</strong>는 관련 데이터 보호법에 따라 해당 지역으로의 고객 개인 데이터 전송에 대한 적절한 안전 조치를 시행합니다.

### 2. EEA 이전 {#2-ex-eea-transfers}}

<strong>고객</strong>과 <strong>공급업체</strong>는 GDPR이 고객 개인 정보의 전송을 보호하는 경우, 해당 전송이 EEA 내부의 <strong>고객</strong>으로부터 EEA 외부의 <strong>공급업체</strong>로 이루어지며, 해당 전송이 유럽 위원회의 적정성 결정의 적용을 받지 않는 경우, 본 DPA를 체결함으로써 <strong>고객</strong>과 <strong>공급업체</strong>는 참조로 포함된 EEA SCC 및 그 부록에 서명한 것으로 간주된다는 데 동의합니다. 이러한 전송은 다음과 같이 작성되는 EEA SCC에 따라 이루어집니다.

a. EEA SCC의 모듈 2(통제자에서 처리자로)는 <strong>고객</strong>이 통제자이고 <strong>공급자</strong>가 처리자로서 <strong>고객</strong>을 위해 고객 개인 데이터를 처리하는 경우에 적용됩니다.

b. EEA SCC의 모듈 3(처리자에서 하위 처리자로)은 <strong>고객</strong>이 처리자이고 <strong>공급자</strong>가 하위 처리자로서 <strong>고객</strong>을 대신하여 고객 개인 데이터를 처리하는 경우에 적용됩니다.

c. 각 모듈에 대해 다음 사항이 적용됩니다(해당되는 경우):

1. 조항 7의 선택적 도킹 조항은 적용되지 않습니다.

2. 조항 9에서 옵션 2(일반 서면 승인)가 적용되며, 하청업체 변경에 대한 사전 통지의 최소 기간은 10영업일입니다.

3. 제11조에서는 선택적인 언어는 적용되지 않습니다.

4. 조항 13의 모든 대괄호가 제거됩니다.

5. 조항 17(옵션 1)에서 EEA SCC는 <strong>관할 회원국</strong>의 법률에 따라 관리됩니다.

6. 조항 18(b)에서 분쟁은 <strong>통치 회원국</strong>의 법원에서 해결됩니다.

7. 이 DPA의 표지에는 EEA SCC 부록 I, 부록 II 및 부록 III에 필요한 정보가 포함되어 있습니다.

### 3. 영국 외 송금 {#3-ex-uk-transfers}

<strong>고객</strong>과 <strong>공급업체</strong>는 영국 GDPR이 고객 개인 정보 전송을 보호하는 경우, 해당 전송이 영국 내의 <strong>고객</strong>으로부터 영국 외부의 <strong>공급업체</strong>로 이루어지며, 해당 전송이 영국 국무장관의 적정성 결정의 적용을 받지 않는 경우, 본 DPA를 체결함으로써 <strong>고객</strong>과 <strong>공급업체</strong>는 참조로 포함된 영국 추가 조항 및 그 부록에 서명한 것으로 간주된다는 데 동의합니다. 이러한 전송은 다음과 같이 작성된 영국 추가 조항에 따라 이루어집니다.

a. 이 DPA의 섹션 3.2에는 영국 부록의 표 2에 필요한 정보가 포함되어 있습니다.

b. 영국 부록의 표 4는 다음과 같이 수정됩니다. 어느 당사자도 영국 부록 19절에 명시된 대로 영국 부록을 종료할 수 없습니다. ICO가 영국 부록 18절에 따라 개정된 승인 부록을 발행하는 범위 내에서 당사자는 이 DPA를 그에 따라 개정하기 위해 성실히 노력해야 합니다.

c. 표지에는 영국 부록의 부록 1A, 부록 1B, 부록 II 및 부록 III에서 요구하는 정보가 포함되어 있습니다.

### 4. 기타 국제 전송 {#4-other-international-transfers}

스위스 법률(EEA 회원국이나 영국의 법률은 아님)이 국제적 전송의 성격에 적용되는 개인 데이터 전송의 경우, EEA SCC 제4조의 GDPR에 대한 참조는 법적으로 요구되는 범위 내에서 대신 스위스 연방 데이터 보호법 또는 그 후속 법률을 참조하도록 수정되며, 감독 기관의 개념에는 스위스 연방 데이터 보호 및 정보 위원이 포함됩니다.

## 4. 보안 사고 대응 {#4-security-incident-response}

1. <strong>공급자</strong>는 보안 사고를 인지하게 되면 다음을 수행합니다. (a) 가능한 경우 지체 없이 <strong>고객</strong>에게 통지하지만, 보안 사고를 인지한 후 72시간 이내에 통지합니다. (b) 보안 사고가 알려지거나 <strong>고객</strong>이 합리적으로 요청하는 경우 해당 사고에 대한 정보를 적시에 제공합니다. (c) 보안 사고를 억제하고 조사하기 위한 합리적인 조치를 즉시 취합니다. 본 DPA에서 요구하는 대로 <strong>공급자</strong>가 보안 사고를 통지하거나 대응한다고 해서 <strong>공급자</strong>가 보안 사고에 대한 잘못이나 책임을 인정하는 것으로 해석되지 않습니다.

## 5. 감사 및 보고서 {#5-audit--reports}

### 1. 감사 권한 {#1-audit-rights}

<strong>공급자</strong>는 <strong>고객</strong>에게 본 DPA 준수를 입증하는 데 합리적으로 필요한 모든 정보를 제공하고, <strong>공급자</strong>는 <strong>고객</strong>이 <strong>공급자</strong>의 본 DPA 준수 여부를 평가하기 위해 실시하는 감사(검사 포함)를 허용하고 이에 기여합니다. 단, <strong>공급자</strong>는 <strong>고객</strong>의 정보 접근이 <strong>공급자</strong>의 지적 재산권, 기밀 유지 의무 또는 관련 법률에 따른 기타 의무에 부정적인 영향을 미칠 경우, 데이터 또는 정보에 대한 접근을 제한할 수 있습니다. <strong>고객</strong>은 <strong>공급자</strong>에게 아래 보고 및 실사 요건을 준수하도록 지시함으로써만 본 DPA에 따른 감사 권한 및 관련 데이터 보호법에 따라 부여된 감사 권한을 행사할 것임을 인정하고 동의합니다. <strong>제공자</strong>는 DPA가 종료된 후 3년 동안 이 DPA 준수 기록을 보관합니다.

### 2. 보안 보고서 {#2-security-reports}

<strong>고객</strong>은 <strong>공급자</strong>가 <strong>보안 정책</strong>에 정의된 기준에 따라 독립적인 제3자 감사 기관에 의해 정기적으로 감사를 받고 있음을 인정합니다. <strong>공급자</strong>는 서면 요청 시, <strong>고객</strong>에게 당시 최신 보고서 요약본을 기밀로 제공하여 <strong>고객</strong>이 <strong>공급자</strong>가 <strong>보안 정책</strong>에 정의된 기준을 준수하는지 확인할 수 있도록 합니다.

### 3. 보안 실사 {#3-security-due-diligence}

보고서 외에도, <strong>공급업체</strong>는 <strong>고객</strong>이 <strong>공급업체</strong>의 본 DPA 준수 여부를 확인하기 위해 합리적인 정보 제공 요청을 하는 경우, 정보 보안, 실사 및 감사 설문지에 대한 응답이나 정보 보안 프로그램에 대한 추가 정보 제공을 포함하여 이에 응해야 합니다. 이러한 모든 요청은 서면으로 <strong>공급업체 보안 담당자</strong>에게 제출해야 하며, 연 1회만 가능합니다.

## 6. 조정 및 협력 {#6-coordination--cooperation}

### 1. 문의사항에 대한 답변 {#1-response-to-inquiries}

<strong>공급자</strong>가 고객 개인 정보 처리에 대해 타인으로부터 문의나 요청을 받는 경우, <strong>공급자</strong>는 해당 요청에 대해 <strong>고객</strong>에게 통지하며, <strong>공급자</strong>는 <strong>고객</strong>의 사전 동의 없이는 해당 요청에 응답하지 않습니다. 이러한 문의 및 요청의 예로는 고객 개인 정보에 대한 사법, 행정 또는 규제 기관의 명령(<strong>고객</strong>에게 통지하는 것이 관련 법률에 의해 금지되지 않는 경우)이나 정보 주체의 요청이 있습니다. 관련 법률에서 허용하는 경우, <strong>공급자</strong>는 이러한 요청에 대해 <strong>고객</strong>의 합리적인 지시를 따르며, 여기에는 <strong>고객</strong>이 합리적으로 요청한 상태 업데이트 및 기타 정보 제공이 포함됩니다. 개인정보 주체가 적용 가능한 데이터 보호법에 따라 <strong>고객</strong>이 <strong>공급자</strong>에게 고객 개인 데이터를 제공하는 것을 삭제하거나 거부하도록 유효한 요청을 하는 경우, <strong>공급자</strong>는 적용 가능한 데이터 보호법에 따라 <strong>고객</strong>이 요청을 이행하도록 지원합니다. <strong>공급자</strong>는 본 DPA에 따라 <strong>공급자</strong>의 고객 개인 데이터 처리에 관한 제3자의 요청에 응하여 <strong>고객</strong>이 취하는 모든 법적 대응 또는 기타 절차적 조치에 대해 <strong>고객</strong>의 비용으로 <strong>고객</strong>과 협조하고 합리적인 지원을 제공합니다.

### 2. DPIA 및 DTIA {#2-dpias-and-dtias}

해당 데이터 보호법에 따라 요구되는 경우, <strong>공급자</strong>는 <strong>고객</strong>이 의무적인 데이터 보호 영향 평가 또는 데이터 전송 영향 평가 및 관련 데이터 보호 기관과의 협의를 수행하는 데 합리적으로 도움을 줄 것이며, 이때 처리 및 고객 개인 데이터의 특성을 고려해야 합니다.

## 7. 고객 개인 데이터 삭제 {#7-deletion-of-customer-personal-data}

### 1. 고객에 의한 삭제 {#1-deletion-by-customer}

<strong>공급자</strong>는 <strong>고객</strong>이 서비스의 기능과 일치하는 방식으로 고객 개인 데이터를 삭제할 수 있도록 해야 합니다. <strong>공급자</strong>는 적용 가능한 법률에 따라 고객 개인 데이터의 추가 보관이 필요한 경우를 제외하고 합리적으로 가능한 한 빨리 이 지침을 준수해야 합니다.

### 2. DPA 만료 시 삭제 {#2-deletion-at-dpa-expiration}

a. DPA 만료 후, <strong>공급자</strong>는 관련 법률에 따라 고객 개인 정보의 추가 보관이 요구되거나 허용되는 경우를 제외하고 <strong>고객</strong>의 지시에 따라 고객 개인 정보를 반환하거나 삭제합니다. 반환 또는 파기가 관련 법률에 따라 불가능하거나 금지되는 경우, <strong>공급자</strong>는 고객 개인 정보의 추가 처리를 방지하기 위해 합리적인 노력을 기울이고, 보유, 보관 또는 관리 중인 고객 개인 정보를 계속 보호합니다. 예를 들어, 관련 법률에 따라 <strong>공급자</strong>는 고객 개인 정보를 계속 호스팅하거나 처리해야 할 수 있습니다.

b. <strong>고객</strong>과 <strong>공급자</strong>가 본 DPA의 일부로 EEA SCC 또는 영국 추가 조항을 체결한 경우, <strong>공급자</strong>는 <strong>고객</strong>이 요청하는 경우에만 EEA SCC의 조항 8.1(d) 및 조항 8.5에 설명된 개인 데이터 삭제 인증을 <strong>고객</strong>에게 제공합니다.

## 8. 책임의 한계 {#8-limitation-of-liability}

### 1. 책임 한도 및 손해 배상 면제 {#1-liability-caps-and-damages-waiver}

**적용 가능한 데이터 보호법에 따라 허용되는 최대 범위 내에서, 본 DPA로 인해 또는 이와 관련하여 상대방에게 발생하는 각 당사자의 총 누적 책임은 <strong>계약</strong>에 명시된 포기, 제외 및 책임 제한에 따릅니다.**

### 2. 관련 당사자 청구 {#2-related-party-claims}

**본 DPA로 인해 또는 이와 관련하여 <strong>공급자</strong> 또는 그 계열사에 대해 제기되는 모든 청구는 <strong>계약</strong> 당사자인 <strong>고객</strong> 기관에서만 제기할 수 있습니다.**

### 3. 예외 {#3-exceptions}

1. 본 DPA는 관련 데이터 보호법에 따른 개인의 데이터 보호 권리에 대한 개인의 책임을 제한하지 않습니다. 또한, 본 DPA는 EEA SCC 또는 영국 추가 조항 위반에 대한 당사자 간의 책임을 제한하지 않습니다.

## 9. 문서 간 충돌 {#9-conflicts-between-documents}

1. 본 DPA는 본 계약의 일부를 구성하며 본 계약을 보완합니다. 본 DPA와 <strong>계약</strong> 또는 그 일부 사이에 불일치가 있는 경우, 앞서 명시된 부분이 해당 불일치에 대해 나중에 명시된 부분보다 우선합니다. (1) EEA SCC 또는 영국 부록, (2) 본 DPA, 그리고 (3) <strong>계약</strong>.

## 10. 계약 조건 {#10-term-of-agreement}

본 DPA는 <strong>공급자</strong>와 <strong>고객</strong>이 DPA 표지에 동의하고 <strong>계약</strong>에 서명하거나 전자적으로 동의하는 시점부터 시작되며, <strong>계약</strong>이 만료되거나 해지될 때까지 지속됩니다. 단, <strong>공급자</strong>와 <strong>고객</strong>은 <strong>고객</strong>이 <strong>공급자</strong>에게 고객 개인 정보 전송을 중단하고 <strong>공급자</strong>가 고객 개인 정보 처리를 중단할 때까지 본 DPA 및 관련 데이터 보호법의 의무를 각각 준수해야 합니다.

## 11. 준거법 및 선택 법원 {#11-governing-law-and-chosen-courts}

<strong>계약</strong>의 준거법 또는 유사 조항에도 불구하고, 본 DPA에 대한 모든 해석 및 분쟁은 법률 조항의 충돌 여부와 관계없이 <strong>준거국</strong>의 법률에 따라 규율됩니다. 또한, <strong>계약</strong>의 재판지 선택, 관할권 또는 유사 조항에도 불구하고, 당사자들은 본 DPA에 대한 모든 법적 소송, 조치 또는 절차를 <strong>준거국</strong> 법원에서 제기하는 데 동의하며, 각 당사자는 <strong>준거국</strong> 법원의 전속 관할권에 돌이킬 수 없이 복종합니다.

## 12. 서비스 제공자 관계 {#12-service-provider-relationship}

캘리포니아 소비자 개인정보보호법(CCPA)(캘리포니아 민법 제1798.100조 이하)이 적용되는 범위 내에서, 당사자들은 <strong>공급자</strong>가 서비스 제공자이며, <strong>계약</strong>에 명시된 대로 서비스를 제공하기 위해 <strong>고객</strong>으로부터 개인 데이터를 수신하고 있으며, 이는 사업적 목적에 해당함을 인정하고 동의합니다. <strong>공급자</strong>는 <strong>계약</strong>에 따라 <strong>고객</strong>이 제공한 개인 데이터를 판매하지 않습니다. 또한, <strong>공급자</strong>는 <strong>계약</strong>에 따라 <strong>고객</strong>이 제공한 개인 데이터를 <strong>고객</strong>에게 서비스를 제공하기 위해 필요한 경우, <strong>계약</strong>에 명시된 경우 또는 관련 데이터 보호법에서 허용하는 경우를 제외하고는 보관, 사용 또는 공개하지 않습니다. <strong>공급자</strong>는 본 조항의 제한 사항을 이해함을 증명합니다.

## 13. 정의 {#13-definitions}

1. **"적용 법률"**이란 당사자에게 적용되거나 당사자를 규율하는 관련 정부 기관의 법률, 규칙, 규정, 법원 명령 및 기타 구속력 있는 요구 사항을 의미합니다.

2. **"해당 데이터 보호법"**은 서비스가 개인의 개인정보, 개인 데이터, 개인 식별 정보 또는 이와 유사한 용어를 처리하거나 사용하는 방법을 규정하는 해당 법률을 의미합니다.

3. **"통제자"**는 개인 데이터 처리의 목적과 범위를 결정하는 회사에 대해 적용 가능한 데이터 보호법에 명시된 의미를 갖습니다.

4. **"표지"**는 당사자들이 서명하거나 전자적으로 승인한 문서로, 이 DPA 표준 약관을 포함하고 <strong>제공자</strong>, <strong>고객</strong>, 데이터 처리의 주제와 세부 사항을 식별합니다.

5. **"고객 개인 데이터"**는 <strong>고객</strong>이 서비스의 일부로 <strong>공급자</strong>에게 업로드하거나 제공하는 개인 데이터를 의미하며, 이는 본 DPA의 적용을 받습니다.

6. **"DPA"**는 이 DPA 표준 약관, <strong>공급자</strong>와 <strong>고객</strong> 간의 표지 페이지, 표지 페이지에 참조되거나 첨부된 정책 및 문서를 의미합니다.

7. **"EEA SCC"**란 유럽 의회와 유럽 이사회의 규정(EU) 2016/679에 따라 제3국으로의 개인 데이터 전송에 대한 표준 계약 조항에 관한 2021년 6월 4일 유럽 위원회의 이행 결정 2021/914에 첨부된 표준 계약 조항을 의미합니다.

8. **"유럽 경제 지역"** 또는 **"EEA"**는 유럽 연합 회원국, 노르웨이, 아이슬란드, 리히텐슈타인을 의미합니다.

9. **"GDPR"**은 해당 EEA 회원국의 현지 법률에 따라 시행되는 유럽 연합 규정 2016/679를 의미합니다.

10. **"개인 데이터"**는 적용 가능한 데이터 보호법에 따라 개인정보, 개인 데이터 또는 이와 유사한 용어에 대해 정의된 의미를 갖습니다.

11. **"처리"** 또는 **"프로세스"**는 자동 방법을 포함하여 개인 데이터의 사용 또는 개인 데이터에 대한 컴퓨터 작업의 수행에 대해 적용 가능한 데이터 보호법에 명시된 의미를 갖습니다.

12. **"처리자"**는 적용 가능한 데이터 보호법에 따라 통제자를 대신하여 개인 데이터를 처리하는 회사에 대해 정의된 의미를 갖습니다.

13. **"보고서"**란 보안 정책에 정의된 기준에 따라 다른 회사가 공급자를 대신하여 작성한 감사 보고서를 의미합니다.

14. **"제한된 전송"**이란 (a) GDPR이 적용되는 경우, 유럽 위원회의 적정성 결정 대상이 아닌 EEA 외부 국가로의 EEA에서 개인 데이터 전송을 의미하며, (b) 영국 GDPR이 적용되는 경우, 2018년 영국 데이터 보호법 제17A조에 따라 채택된 적정성 규정의 대상이 아닌 영국에서 다른 국가로의 개인 데이터 전송을 의미합니다.

15. **"보안 사고"**는 GDPR 제4조에 정의된 개인 데이터 침해를 의미합니다.

16. **"서비스"**는 <strong>계약</strong>에 설명된 제품 및/또는 서비스를 의미합니다.

17. **"특수 범주 데이터"**는 GDPR 제9조에 명시된 의미를 갖습니다.

18. **"하위 처리자"**는 적용 가능한 데이터 보호법에 따라, 통제자의 승인 및 수락을 받아 통제자를 대신하여 처리자가 개인 데이터를 처리하도록 지원하는 회사를 의미합니다.

19. **"영국 GDPR"**은 영국의 2018년 유럽연합(철회)법 제3조에 따라 영국에서 시행된 유럽연합 규정 2016/679를 의미합니다.

20. **"영국 추가 조항"**은 2018년 데이터 보호법 S119A(1)에 따라 제한된 전송을 하는 당사자를 위해 정보 위원이 발행한 EEA SCC에 대한 국제 데이터 전송 추가 조항을 의미합니다.

## 크레딧 {#credits}

이 문서는 [일반 논문 DPA 표준 용어(버전 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0)에서 파생되었으며 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 라이선스를 받았습니다.