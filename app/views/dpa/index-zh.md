# 数据处理协议 {#data-processing-agreement}

<!-- v1.0 来自 <https://github.com/CommonPaper/DPA> -->

<img loading="lazy" src="/img/articles/dpa.webp" alt="Forward Email data processing agreement" class="rounded-lg" />

## 目录 {#table-of-contents}

* [关键术语](#key-terms)
* [协议变更](#changes-to-the-agreement)
* [1. 处理者与子处理者的关系](#1-processor-and-subprocessor-relationships)
  * [1. 提供商作为处理者](#1-provider-as-processor)
  * [2. 提供商作为子处理者](#2-provider-as-subprocessor)
* [2. 处理](#2-processing)
  * [1. 处理细节](#1-processing-details)
  * [2. 处理说明](#2-processing-instructions)
  * [3. 提供商处理](#3-processing-by-provider)
  * [4. 客户处理](#4-customer-processing)
  * [5.同意处理](#5-consent-to-processing)
  * [6. 子处理器](#6-subprocessors)
* [3. 限制转让](#3-restricted-transfers)
  * [1.授权](#1-authorization)
  * [2. 欧洲经济区外的转移](#2-ex-eea-transfers)
  * [3. 英国境外的转账](#3-ex-uk-transfers)
  * [4. 其他国际转移](#4-other-international-transfers)
* [4.安全事件响应](#4-security-incident-response)
* [5. 审计与报告](#5-audit--reports)
  * [1.审计权利](#1-audit-rights)
  * [2.安全报告](#2-security-reports)
  * [3. 安全尽职调查](#3-security-due-diligence)
* [6.协调与合作](#6-coordination--cooperation)
  * [1. 回应问询](#1-response-to-inquiries)
  * [2. DPIA 和 DTIA](#2-dpias-and-dtias)
* [7. 删除客户个人数据](#7-deletion-of-customer-personal-data)
  * [1. 客户删除](#1-deletion-by-customer)
  * [2. DPA 到期时的删除](#2-deletion-at-dpa-expiration)
* [8. 责任限制](#8-limitation-of-liability)
  * [1. 责任限额和损害赔偿豁免](#1-liability-caps-and-damages-waiver)
  * [2. 关联方索赔](#2-related-party-claims)
  * [3. 例外](#3-exceptions)
* [9. 文件之间的冲突](#9-conflicts-between-documents)
* [10. 协议期限](#10-term-of-agreement)
* [11. 适用法律和选定法院](#11-governing-law-and-chosen-courts)
* [12. 服务提供商关系](#12-service-provider-relationship)
* [13.定义](#13-definitions)
* [致谢](#credits)

## 关键术语 {#key-terms}

| 学期 | 价值 |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <strong>协议</strong> | 本 DPA 补充了 [Terms of Service](/terms) |
| <strong>已批准的子处理商</strong> | [Cloudflare](https://cloudflare.com)（美国；DNS、网络和安全提供商）、[DataPacket](https://www.datapacket.com/)（美国/英国；托管服务提供商）、[Digital Ocean](https://digitalocean.com)（美国；托管服务提供商）、[GitHub](https://github.com) (US; source code hosting, CI/CD, and project management), [Vultr](https://www.vultr.com)（美国；托管服务提供商）、[Stripe](https://stripe.com)（美国；支付处理器）、[PayPal](https://paypal.com)（美国；支付处理器） |
| <strong>提供商安全联系人</strong> | <a href="mailto:security@forwardemail.net"><security@forwardemail.net></a> |
| <strong>安全政策</strong> | 查看 [our Security Policy on GitHub](https://github.com/forwardemail/forwardemail.net/security/policy) |
| <strong>治理国家</strong> | 美国特拉华州 |

## 协议变更 {#changes-to-the-agreement}

本文档是 [通用纸质DPA标准术语（1.0版）](https://commonpaper.com/standards/data-processing-agreement/1.0) 的衍生文档，并做出了以下更改：

1. [适用法律和选定法院](#11-governing-law-and-chosen-courts) 已作为下方的一个部分包含在内，其中 `Governing State` 已在上方标识。
2. [服务提供商关系](#12-service-provider-relationship) 已作为下方的一个部分包含在内。

## 1. 处理器和子处理器关系 {#1-processor-and-subprocessor-relationships}

### 1. 提供商作为处理器 {#1-provider-as-processor}

在<strong>客户</strong>是客户个人数据控制者的情况下，<strong>提供商</strong>将被视为代表<strong>客户</strong>处理个人数据的处理者。

### 2. 提供商作为子处理器 {#2-provider-as-subprocessor}

在<strong>客户</strong>是客户个人数据处理者的情况下，<strong>提供商</strong>将被视为客户个人数据的子处理者。

## 2. 处理 {#2-processing}

### 1. 处理详情 {#1-processing-details}

封面上的附件 I(B) 描述了此处理的主题、性质、目的和持续时间，以及所收集的<strong>个人数据类别</strong>和<strong>数据主体类别</strong>。

### 2.处理说明 {#2-processing-instructions}

<strong>客户</strong>指示<strong>提供商</strong>处理客户个人数据：(a) 提供和维护服务；(b) 通过在<strong>客户</strong>使用服务时进一步指定；(c) 按照<strong>协议</strong>中的规定；以及 (d) 按照<strong>客户</strong>给出的并且<strong>提供商</strong>确认的关于根据本 DPA 处理客户个人数据的任何其他书面指示中的规定。<strong>提供商</strong>将遵守这些指示，除非适用法律禁止这样做。如果<strong>提供商</strong>无法遵循处理指示，将立即通知<strong>客户</strong>。<strong>客户</strong>已经给出并且只会给出符合适用法律的指示。

### 3. 由提供商处理 {#3-processing-by-provider}

<strong>提供商</strong>将仅根据本 DPA 处理客户个人数据，包括封面中的详细信息。如果<strong>提供商</strong>更新服务以更新现有产品、特性或功能或包含新的产品、特性或功能，<strong>提供商</strong>可根据需要更改<strong>数据主体类别</strong>、<strong>个人数据类别</strong>、<strong>特殊类别数据</strong>、<strong>特殊类别数据限制或保障措施</strong>、<strong>传输频率</strong>、<strong>处理的性质和目的</strong>以及<strong>处理持续时间</strong>，并通过将更新和变更通知<strong>客户</strong>来反映更新。

### 4. 客户处理 {#4-customer-processing}

如果<strong>客户</strong>是处理者，而<strong>提供商</strong>是子处理者，则<strong>客户</strong>将遵守适用于<strong>客户</strong>处理客户个人数据的所有适用法律。<strong>客户</strong>与其控制者之间的协议同样要求<strong>客户</strong>遵守适用于<strong>客户</strong>作为处理者的所有适用法律。此外，<strong>客户</strong>还将遵守<strong>客户</strong>与其控制者之间的协议中关于子处理者的要求。

### 5. 同意处理 {#5-consent-to-processing}

<strong>客户</strong>已经遵守并将继续遵守有关向<strong>提供商</strong>和/或服务提供客户个人数据的所有适用数据保护法，包括进行所有披露、获得所有同意、提供充分的选择以及实施适用数据保护法所要求的相关保障措施。

### 6. 分包商 {#6-subprocessors}

a. 除非<strong>客户</strong>已批准子处理商，否则<strong>提供商</strong>不会向子处理商提供、转移或移交任何客户个人数据。<strong>已批准子处理商</strong>的当前列表包括子处理商的身份、其所在国家/地区以及其预期的处理任务。<strong>提供商</strong>将至少提前 10 个工作日以书面形式通知<strong>客户</strong>任何<strong>已批准子处理商</strong>的拟议变更，无论是增加还是更换子处理商，这让<strong>客户</strong>有足够的时间在<strong>提供商</strong>开始使用新的子处理商之前反对这些变更。<strong>提供商</strong>将向<strong>客户提供必要信息，以允许<strong>客户</strong>行使其反对<strong>已批准子处理商</strong>变更的权利。 <strong>客户</strong>在收到<strong>批准的子处理商</strong>变更通知后，有 30 天的时间提出异议，否则<strong>客户</strong>将被视为接受变更。如果<strong>客户</strong>在通知后 30 天内对变更提出异议，<strong>客户</strong>和<strong>提供商</strong>应真诚合作，以解决<strong>客户</strong>的异议或疑虑。

b. 在聘用分包商时，<strong>提供商</strong>将与分包商签订书面协议，确保分包商仅在 (i) 履行分包义务所需的范围内，以及 (ii) 符合<strong>协议</strong>的条款的情况下访问和使用客户个人数据。

c. 如果 GDPR 适用于客户个人数据的处理，则 (i) 本 DPA 中所述的数据保护义务（如适用，请参阅 GDPR 第 28(3) 条）也适用于分包商，以及 (ii) <strong>提供商</strong>与分包商的协议将纳入这些义务，包括关于<strong>提供商</strong>及其分包商将如何协调以响应有关客户个人数据处理的问询或请求的详细信息。此外，<strong>提供商</strong>将根据<strong>客户</strong>的要求，与其分包商共享其协议（包括任何修订）的副本。在保护商业秘密或其他机密信息（包括个人数据）所需的范围内，<strong>提供商</strong>可在共享副本之前编辑其与分包商的协议文本。

d. <strong>提供商</strong>对其分包给子处理商的所有义务负全部责任，包括其子处理商在处理客户个人数据方面的作为和不作为。如果其子处理商未能根据<strong>提供商</strong>与子处理商之间的协议履行有关客户个人数据的重大义务，<strong>提供商</strong>将通知客户。

## 3. 限制转移 {#3-restricted-transfers}

### 1. 授权 {#1-authorization}

<strong>客户</strong>同意<strong>提供商</strong>可以根据需要将客户个人数据转移到欧洲经济区 (EEA)、英国或其他相关地理区域以外，以提供服务。如果<strong>提供商</strong>将客户个人数据转移到欧盟委员会或其他相关监管机构尚未发布充分性决定的地区，<strong>提供商</strong>将根据适用的数据保护法，对客户个人数据转移到该地区采取适当的保护措施。

### 2. 欧洲经济区外转移 {#2-ex-eea-transfers}

<strong>客户</strong>和<strong>提供商</strong>同意，如果 GDPR 保护客户个人数据的传输，且该传输是从<strong>客户</strong>从 EEA 内部传输到<strong>提供商</strong> EEA 外部的，并且该传输不受欧盟委员会作出的充分性决定的约束，则通过签订本 DPA，<strong>客户</strong>和<strong>提供商</strong>将被视为已签署 EEA SCC 及其附件，这些条款通过引用纳入本 DPA。任何此类传输均根据 EEA SCC 进行，其填写方式如下：

a. 当<strong>客户</strong>是控制者，且<strong>提供商</strong>作为处理者为<strong>客户</strong>处理客户个人数据时，适用EEA SCC 的第二个模块（控制者到处理者）。

b. 当<strong>客户</strong>是处理者，且<strong>提供商</strong>作为子处理者代表<strong>客户</strong>处理客户个人数据时，适用 EEA SCC 的模块三（处理者对子处理者）。

c. 对于每个模块，适用以下内容（如适用）：

1.第7条中的可选对接条款不适用；

2. 在第9条中，选项2（一般书面授权）适用，且子处理商变更的提前通知最短时间为10个工作日；

3.第11条中的可选语言不适用；

4.删除第13条中的所有方括号；

5. 在第 17 条（选项 1）中，EEA SCC 将受<strong>管辖成员国</strong>的法律管辖；

6. 在第 18(b) 条中，争议应由<strong>管理成员国</strong>的法院解决；并且

7. 本 DPA 的封面包含 EEA SCC 附件 I、附件 II 和附件 III 中要求的信息。

### 3. 英国境外转账 {#3-ex-uk-transfers}

<strong>客户</strong>和<strong>提供商</strong>同意，如果英国 GDPR 保护客户个人数据的转移，且该转移是从<strong>客户</strong>在英国境内转移到<strong>提供商</strong>在英国境外，且该转移不受英国国务大臣做出的充分性决定的约束，则通过签订本 DPA，<strong>客户</strong>和<strong>提供商</strong>将被视为已签署英国附录及其附件，这些附录通过引用纳入本 DPA。任何此类转移均根据英国附录进行，该附录填写如下：

a. 本 DPA 第 3.2 节包含英国附录表 2 中要求的信息。

b. 英国附录表 4 修改如下：任何一方均不得按照英国附录第 19 条的规定终止英国附录；如果 ICO 根据英国附录第 18 条发布修订后的批准附录，双方将本着诚信的原则对本 DPA 进行相应修改。

c. 封面包含英国附录附件 1A、附件 1B、附件 II 和附件 III 所要求的信息。

### 4. 其他国际转账 {#4-other-international-transfers}

对于个人数据传输，如果瑞士法律（而非任何欧洲经济区成员国或英国的法律）适用于传输的国际性质，则在法律要求的范围内，欧洲经济区标准条款第 4 条中对 GDPR 的引用将被修改为参考瑞士联邦数据保护法或其后续法案，而监管机构的概念将包括瑞士联邦数据保护和信息专员。

## 4. 安全事件响应 {#4-security-incident-response}

1. 在获悉任何安全事件后，<strong>提供商</strong> 应：(a) 在可行的情况下毫不拖延地通知<strong>客户</strong>，但不得晚于获悉安全事件后 72 小时；(b) 在获悉安全事件或<strong>客户</strong>合理要求时及时提供有关安全事件的信息；以及 (c) 立即采取合理措施遏制和调查安全事件。<strong>提供商</strong>根据本 DPA 的要求对安全事件进行的通知或响应不应被视为<strong>提供商</strong>对安全事件的任何过错或责任的承认。

## 5. 审计与报告 {#5-audit--reports}

### 1. 审计权限 {#1-audit-rights}

<strong>提供商</strong>将向<strong>客户</strong>提供所有合理必要的信息，以证明其遵守本 DPA，并且<strong>提供商</strong>将允许并协助审计（包括<strong>客户</strong>的检查），以评估<strong>提供商</strong>对本 DPA 的遵守情况。但是，如果<strong>客户</strong>访问信息会对<strong>提供商</strong>的知识产权、保密义务或适用法律规定的其他义务产生负面影响，则<strong>提供商</strong>可以限制对数据或信息的访问。<strong>客户</strong>承认并同意，其将仅通过指示<strong>提供商</strong>遵守以下报告和尽职调查要求来行使其在本 DPA 下的审计权利以及适用数据保护法授予的任何审计权利。<strong>提供商</strong>将在 DPA 结束后保留其遵守本 DPA 的记录 3 年。

### 2. 安全报告 {#2-security-reports}

<strong>客户</strong>确认，<strong>提供商</strong>会定期接受独立第三方审计机构根据<strong>安全政策</strong>中定义的标准进行的审计。<strong>提供商</strong>将根据书面请求，以保密的方式向<strong>客户</strong>提供其当时最新报告的摘要副本，以便<strong>客户</strong>能够验证<strong>提供商</strong>是否遵守<strong>安全政策</strong>中定义的标准。

### 3. 安全尽职调查 {#3-security-due-diligence}

除报告外，<strong>提供商</strong>还将响应<strong>客户</strong>提出的合理信息请求，以确认<strong>提供商</strong>遵守本数据保护协议 (DPA)，包括回复信息安全、尽职调查和审计问卷，或提供有关其信息安全计划的其他信息。所有此类请求必须以书面形式提交给<strong>提供商安全联系人</strong>，且每年仅可提出一次。

## 6. 协调与合作 {#6-coordination--cooperation}

### 1. 回复问询 {#1-response-to-inquiries}

如果<strong>提供商</strong>收到任何其他人关于处理客户个人数据的询问或请求，<strong>提供商</strong>将通知<strong>客户</strong>该请求，并且<strong>提供商</strong>未经<strong>客户</strong>事先同意不得回应该请求。此类询问和请求的示例包括司法、行政或监管机构关于客户个人数据的命令（适用法律不禁止通知<strong>客户</strong>），或数据主体的请求。如果适用法律允许，<strong>提供商</strong>将遵循<strong>客户</strong>关于这些请求的合理指示，包括提供状态更新和<strong>客户</strong>合理要求的其他信息。如果数据主体根据适用的数据保护法提出有效请求，要求删除或拒绝<strong>客户</strong>向<strong>提供商</strong>提供客户个人数据，<strong>提供商</strong>将协助<strong>客户</strong>根据适用的数据保护法履行该请求。<strong>提供商</strong>将配合<strong>客户</strong>并向其提供合理协助，费用由<strong>客户</strong>承担，以响应第三方关于<strong>提供商</strong>根据本 DPA 处理客户个人数据的请求。

### 2. DPIA 和 DTIA {#2-dpias-and-dtias}

如果适用的数据保护法有所要求，<strong>提供商</strong>将合理协助<strong>客户</strong>进行任何强制性的数据保护影响评估或数据传输影响评估，并与相关数据保护机构进行磋商，同时考虑到处理和客户个人数据的性质。

## 7. 删除客户个人数据 {#7-deletion-of-customer-personal-data}

### 1. 客户删除 {#1-deletion-by-customer}

<strong>提供商</strong>将允许<strong>客户</strong>以与服务功能一致的方式删除客户个人数据。<strong>提供商</strong>将在合理可行的情况下尽快遵守此指示，除非适用法律要求进一步存储客户个人数据。

### 2. DPA 到期时删除 {#2-deletion-at-dpa-expiration}

a. DPA 到期后，<strong>提供商</strong>将根据<strong>客户</strong>的指示归还或删除客户个人数据，除非适用法律要求或授权进一步存储客户个人数据。如果归还或销毁不可行或适用法律禁止，<strong>提供商</strong>将尽合理努力防止进一步处理客户个人数据，并将继续保护其仍持有、保管或控制的客户个人数据。例如，适用法律可能要求<strong>提供商</strong>继续托管或处理客户个人数据。

b. 如果<strong>客户</strong>和<strong>提供商</strong>已作为本 DPA 的一部分签署了 EEA SCC 或英国附录，则<strong>提供商</strong>仅在<strong>客户</strong>提出要求时才向<strong>客户</strong>提供 EEA SCC 第 8.1(d) 条和第 8.5 条所述的个人数据删除证明。

## 8. 责任限制 {#8-limitation-of-liability}

### 1. 责任限额和损害赔偿豁免 {#1-liability-caps-and-damages-waiver}

**在适用数据保护法允许的最大范围内，各方因本 DPA 而产生或与本 DPA 相关而对另一方承担的总累计责任将受<strong>协议</strong>中规定的责任豁免、排除和限制的约束。**

### 2. 关联方索赔 {#2-related-party-claims}

**因本 DPA 引起或与本 DPA 相关的针对<strong>提供商</strong>或其关联公司的任何索赔只能由作为<strong>协议</strong>一方的<strong>客户</strong>实体提出。**

### 3. 异常 {#3-exceptions}

1. 本数据保护协议 (DPA) 不限制个人根据适用数据保护法就其数据保护权利承担的任何责任。此外，本数据保护协议 (DPA) 不限制双方因违反欧洲经济区 (EEA) 补充条款 (SCC) 或英国附录而承担的任何责任。

## 9. 文档之间的冲突 {#9-conflicts-between-documents}

1. 本 DPA 构成本协议的一部分并作为其补充。如果本 DPA、<strong>本协议</strong>或其任何部分之间存在任何不一致，则在出现该不一致时，以先列出的部分为准：(1) 欧洲经济区 (EEA) 的 SCC 或英国附录；(2) 本 DPA；以及 (3) <strong>本协议</strong>。

## 10. 协议期限 {#10-term-of-agreement}

本数据保护协议 (DPA) 将于<strong>提供商</strong>和<strong>客户</strong>同意本数据保护协议的封面并签署或以电子方式接受<strong>协议</strong>时生效，并持续至<strong>协议</strong>到期或终止。但是，在<strong>客户</strong>停止向<strong>提供商</strong>传输客户个人数据，且<strong>提供商</strong>停止处理客户个人数据之前，<strong>提供商</strong>和<strong>客户</strong>仍将各自受本数据保护协议 (DPA) 和适用数据保护法的约束。

## 11. 适用法律和选定法院 {#11-governing-law-and-chosen-courts}

尽管<strong>协议</strong>中有适用法律或类似条款，所有关于本 DPA 的解释和争议均受<strong>管辖国</strong>的法律管辖，而不考虑其法律冲突条款。此外，尽管<strong>协议</strong>中有法院选择、管辖权或类似条款，双方同意将与本 DPA 相关的任何诉讼、行动或程序提交至<strong>管辖国</strong>法院，且各方不可撤销地接受该法院的专属管辖权。

## 12. 服务提供商关系 {#12-service-provider-relationship}

在《加州消费者隐私法案》（加州民法典第 1798.100 条及以下条款）（“CCPA”）适用的范围内，双方承认并同意<strong>提供商</strong>是服务提供商，并且正在从<strong>客户</strong>接收个人数据以按照<strong>协议</strong>中的约定提供服务，这构成了商业目的。<strong>提供商</strong>不会出售<strong>客户</strong>根据<strong>协议</strong>提供的任何个人数据。此外，<strong>提供商</strong>不会保留、使用或披露<strong>客户</strong>根据<strong>协议</strong>提供的任何个人数据，除非根据<strong>协议</strong>为<strong>客户</strong>提供服务所必需，或适用的数据保护法允许。<strong>提供商</strong>证明其理解本段的限制。

## 13. 定义 {#13-definitions}

1.“适用法律”是指适用于或管辖一方的法律、法规、规章、法院命令以及相关政府部门的其他具有约束力的要求。

2.“适用的数据保护法”**是指管辖服务如何处理或使用个人的个人信息、个人数据、个人身份信息或其他类似术语的适用法律。

3.“控制者”**的含义与适用数据保护法中为决定处理个人数据的目的和范围的公司所赋予的含义相同。

4. **“封面”**是指经双方签署或以电子方式接受的文件，其中包含这些 DPA 标准条款，并标明<strong>提供商</strong>、<strong>客户</strong>以及数据处理的主题和细节。

5. **“客户个人数据”** 是指<strong>客户</strong>作为服务的一部分上传或提供给<strong>提供商</strong>的个人数据，并且受本 DPA 管辖。

6. **“DPA”** 指这些 DPA 标准条款、<strong>提供商</strong> 与 <strong>客户</strong> 之间的封面页以及封面页中引用或附加的政策和文件。

7. **“EEA SCC”** 是指根据欧洲议会和欧洲理事会第 2016/679 号条例 (EU)，欧盟委员会于 2021 年 6 月 4 日颁布的关于向第三国转移个人数据的标准合同条款的第 2021/914 号实施决定所附的标准合同条款。

8.“欧洲经济区”或“EEA”是指欧盟成员国、挪威、冰岛和列支敦士登。

9.“GDPR”是指根据相关欧洲经济区成员国当地法律实施的欧盟法规 2016/679。

10.“个人数据”将具有适用数据保护法中对个人信息、个人数据或其他类似术语所赋予的含义。

11.“处理”或“进程”应具有适用数据保护法中规定的含义，指对个人数据的任何使用或执行计算机操作，包括通过自动方法。

12.“处理者”**的含义与适用数据保护法中为代表控制者处理个人数据的公司所赋予的含义相同。

13.“报告”是指由另一家公司根据安全政策中定义的标准代表提供商准备的审计报告。

14.“受限转移”**指 (a) 在适用 GDPR 的情况下，将个人数据从欧洲经济区 (EEA) 转移到欧洲经济区以外的国家/地区，且该国家/地区不受欧盟委员会的充分性判定约束；以及 (b) 在适用英国 GDPR 的情况下，将个人数据从英国转移到任何其他国家/地区，且该国家/地区不受根据 2018 年英国数据保护法第 17A 条制定的充分性法规约束。

15.“安全事件”是指 GDPR 第 4 条定义的个人数据泄露。

16.“服务”是指<strong>协议</strong>中描述的产品和/或服务。

17.“特殊类别数据”具有 GDPR 第 9 条中赋予的含义。

18.“子处理者”**具有适用数据保护法中赋予的含义，指在控制者的批准和接受下，代表控制者协助处理者处理个人数据的公司。

19. **“英国 GDPR”** 是指根据英国 2018 年《欧盟（退出）法案》第 3 条在英国实施的欧盟条例 2016/679。

20. **“英国附录”**是指信息专员根据 2018 年数据保护法 S119A(1) 为进行限制性转移的各方颁发的 EEA SCC 的国际数据传输附录。

## 积分 {#credits}

本文档是 [通用纸质DPA标准术语（1.0版）](https://commonpaper.com/standards/data-processing-agreement/1.0) 的衍生文档，并根据 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 获得许可。