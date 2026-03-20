# 数据处理协议 {#data-processing-agreement}

<!-- v1.0 from <https://github.com/CommonPaper/DPA> -->

<img loading="lazy" src="/img/articles/dpa.webp" alt="Forward Email 数据处理协议" class="rounded-lg" />


## 目录 {#table-of-contents}

* [关键术语](#key-terms)
* [协议变更](#changes-to-the-agreement)
* [1. 处理者与子处理者关系](#1-processor-and-subprocessor-relationships)
  * [1. 提供者作为处理者](#1-provider-as-processor)
  * [2. 提供者作为子处理者](#2-provider-as-subprocessor)
* [2. 处理](#2-processing)
  * [1. 处理详情](#1-processing-details)
  * [2. 处理指令](#2-processing-instructions)
  * [3. 提供者的处理](#3-processing-by-provider)
  * [4. 客户处理](#4-customer-processing)
  * [5. 处理同意](#5-consent-to-processing)
  * [6. 子处理者](#6-subprocessors)
* [3. 受限传输](#3-restricted-transfers)
  * [1. 授权](#1-authorization)
  * [2. 欧洲经济区外传输](#2-ex-eea-transfers)
  * [3. 英国以外传输](#3-ex-uk-transfers)
  * [4. 其他国际传输](#4-other-international-transfers)
* [4. 安全事件响应](#4-security-incident-response)
* [5. 审计与报告](#5-audit--reports)
  * [1. 审计权利](#1-audit-rights)
  * [2. 安全报告](#2-security-reports)
  * [3. 安全尽职调查](#3-security-due-diligence)
* [6. 协调与合作](#6-coordination--cooperation)
  * [1. 回应询问](#1-response-to-inquiries)
  * [2. 数据保护影响评估和数据传输影响评估](#2-dpias-and-dtias)
* [7. 客户个人数据删除](#7-deletion-of-customer-personal-data)
  * [1. 客户删除](#1-deletion-by-customer)
  * [2. 协议到期时删除](#2-deletion-at-dpa-expiration)
* [8. 责任限制](#8-limitation-of-liability)
  * [1. 责任上限与损害赔偿放弃](#1-liability-caps-and-damages-waiver)
  * [2. 关联方索赔](#2-related-party-claims)
  * [3. 例外情况](#3-exceptions)
* [9. 文件间冲突](#9-conflicts-between-documents)
* [10. 协议期限](#10-term-of-agreement)
* [11. 适用法律与指定法院](#11-governing-law-and-chosen-courts)
* [12. 服务提供者关系](#12-service-provider-relationship)
* [13. 定义](#13-definitions)
* [致谢](#credits)


## 关键术语 {#key-terms}

| 术语                                       | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <strong>协议</strong>                       | 本数据处理协议为[服务条款](/terms)的补充                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| <strong>批准的子处理者</strong>             | [Cloudflare](https://cloudflare.com)（美国；DNS、网络和安全提供商），[DataPacket](https://www.datapacket.com/)（美国/英国；托管提供商），[Digital Ocean](https://digitalocean.com)（美国；托管提供商），[GitHub](https://github.com)（美国；源代码托管、CI/CD 和项目管理），[Vultr](https://www.vultr.com)（美国；托管提供商），[Stripe](https://stripe.com)（美国；支付处理），[PayPal](https://paypal.com)（美国；支付处理） |
| <strong>提供者安全联系人</strong>           | <a href="mailto:security@forwardemail.net"><security@forwardemail.net></a>                                                                                                                                                                                                                                                                                                                                                                                                         |
| <strong>安全政策</strong>                   | 查看[我们在 GitHub 上的安全政策](https://github.com/forwardemail/forwardemail.net/security/policy)                                                                                                                                                                                                                                                                                                                                                                               |
| <strong>适用州</strong>                     | 美国特拉华州                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
## 协议变更 {#changes-to-the-agreement}

本文件是[Common Paper DPA 标准条款（版本 1.0）](https://commonpaper.com/standards/data-processing-agreement/1.0)的衍生版本，已做出以下更改：

1. [适用法律和指定法院](#11-governing-law-and-chosen-courts) 已作为下文章节包含，且上文已确定 `适用州`。
2. [服务提供商关系](#12-service-provider-relationship) 已作为下文章节包含。

## 1. 处理者与子处理者关系 {#1-processor-and-subprocessor-relationships}

### 1. 提供者作为处理者 {#1-provider-as-processor}

在 <strong>客户</strong> 作为客户个人数据的控制者的情况下，<strong>提供者</strong> 将被视为代表 <strong>客户</strong> 处理个人数据的处理者。

### 2. 提供者作为子处理者 {#2-provider-as-subprocessor}

在 <strong>客户</strong> 作为客户个人数据的处理者的情况下，<strong>提供者</strong> 将被视为客户个人数据的子处理者。

## 2. 处理 {#2-processing}

### 1. 处理详情 {#1-processing-details}

封面页的附件 I(B) 描述了本次处理的主题、性质、目的和期限，以及收集的 <strong>个人数据类别</strong> 和 <strong>数据主体类别</strong>。

### 2. 处理指令 {#2-processing-instructions}

<strong>客户</strong> 指示 <strong>提供者</strong> 处理客户个人数据：(a) 以提供和维护服务；(b) 可能通过 <strong>客户</strong> 使用服务进一步指定；(c) 如 <strong>协议</strong> 中所述；(d) 如 <strong>客户</strong> 以书面形式提供并经 <strong>提供者</strong> 确认的关于根据本数据处理协议处理客户个人数据的其他指令。除非适用法律禁止，<strong>提供者</strong> 将遵守这些指令。如无法遵守处理指令，<strong>提供者</strong> 将立即通知 <strong>客户</strong>。<strong>客户</strong> 已经并将仅提供符合适用法律的指令。

### 3. 提供者的处理 {#3-processing-by-provider}

<strong>提供者</strong> 仅会根据本数据处理协议及封面页中的详情处理客户个人数据。如果 <strong>提供者</strong> 更新服务以更新现有或包含新的产品、功能或特性，<strong>提供者</strong> 可根据需要更改 <strong>数据主体类别</strong>、<strong>个人数据类别</strong>、<strong>特殊类别数据</strong>、<strong>特殊类别数据限制或保障措施</strong>、<strong>传输频率</strong>、<strong>处理的性质和目的</strong> 以及 <strong>处理期限</strong>，并通过通知 <strong>客户</strong> 更新和变更。

### 4. 客户的处理 {#4-customer-processing}

当 <strong>客户</strong> 是处理者且 <strong>提供者</strong> 是子处理者时，<strong>客户</strong> 将遵守所有适用于其处理客户个人数据的适用法律。<strong>客户</strong> 与其控制者的协议同样要求 <strong>客户</strong> 遵守所有适用于其作为处理者的适用法律。此外，<strong>客户</strong> 将遵守其与控制者协议中关于子处理者的要求。

### 5. 处理同意 {#5-consent-to-processing}

<strong>客户</strong> 已遵守并将继续遵守所有适用的数据保护法律，涉及其向 <strong>提供者</strong> 和/或服务提供客户个人数据，包括进行所有披露、获取所有同意、提供充分选择以及实施适用数据保护法律要求的相关保障措施。
### 6. Subprocessors {#6-subprocessors}

a. <strong>提供方</strong> 不会向任何分包处理方提供、转移或交付任何客户个人数据，除非 <strong>客户</strong> 已批准该分包处理方。当前的 <strong>已批准分包处理方</strong> 列表包括分包处理方的身份、所在国家及其预期的处理任务。<strong>提供方</strong> 将至少提前 10 个工作日以书面形式通知 <strong>客户</strong> 任何对 <strong>已批准分包处理方</strong> 的拟议变更，无论是新增还是替换分包处理方，这使得 <strong>客户</strong> 有足够时间在 <strong>提供方</strong> 开始使用新的分包处理方之前对变更提出异议。<strong>提供方</strong> 将向 <strong>客户</strong> 提供必要的信息，以便 <strong>客户</strong> 行使其对 <strong>已批准分包处理方</strong> 变更提出异议的权利。<strong>客户</strong> 在收到关于 <strong>已批准分包处理方</strong> 变更的通知后有 30 天时间提出异议，否则视为接受该变更。如果 <strong>客户</strong> 在通知后的 30 天内对变更提出异议，<strong>客户</strong> 和 <strong>提供方</strong> 将本着诚信合作解决 <strong>客户</strong> 的异议或关切。

b. 在聘用分包处理方时，<strong>提供方</strong> 将与分包处理方签订书面协议，确保分包处理方仅在 (i) 为履行其分包义务所必需的范围内访问和使用客户个人数据，且 (ii) 符合 <strong>协议</strong> 条款的前提下进行处理。

c. 如果 GDPR 适用于客户个人数据的处理，(i) 本数据处理协议中描述的数据保护义务（如适用，参见 GDPR 第 28(3) 条）也适用于分包处理方，且 (ii) <strong>提供方</strong> 与分包处理方的协议将纳入这些义务，包括关于 <strong>提供方</strong> 及其分包处理方如何协调响应有关客户个人数据处理的查询或请求的细节。此外，<strong>提供方</strong> 将根据 <strong>客户</strong> 的要求，分享其与分包处理方签订的协议（包括任何修订）的副本。为保护商业秘密或其他机密信息（包括个人数据），<strong>提供方</strong> 可在分享协议副本前对协议文本进行涂黑处理。

d. <strong>提供方</strong> 对其分包处理方分包的所有义务，包括分包处理方在处理客户个人数据时的行为和疏忽，承担全部责任。<strong>提供方</strong> 将通知客户其分包处理方未能履行与客户个人数据相关的重大义务。

## 3. Restricted Transfers {#3-restricted-transfers}

### 1. Authorization {#1-authorization}

<strong>客户</strong> 同意 <strong>提供方</strong> 可根据提供服务的需要，将客户个人数据转移至欧洲经济区（EEA）、英国或其他相关地理区域之外。如果 <strong>提供方</strong> 将客户个人数据转移至欧洲委员会或其他相关监管机构尚未发布充分性决定的地区，<strong>提供方</strong> 将根据适用数据保护法律实施适当的保障措施以确保客户个人数据的转移安全。

### 2. Ex-EEA Transfers {#2-ex-eea-transfers}

<strong>客户</strong> 和 <strong>提供方</strong> 同意，如果 GDPR 保护客户个人数据的转移，且该转移是从 <strong>客户</strong> 位于欧洲经济区内向 <strong>提供方</strong> 位于欧洲经济区外进行，且该转移不受欧洲委员会作出的充分性决定管辖，则通过签订本数据处理协议，<strong>客户</strong> 和 <strong>提供方</strong> 被视为已签署欧洲经济区标准合同条款（EEA SCCs）及其附件，且该等条款通过引用纳入本协议。任何此类转移均依据欧洲经济区标准合同条款进行，具体内容如下完成：
a. 当 <strong>客户</strong> 作为控制者，且 <strong>提供者</strong> 作为处理者为 <strong>客户</strong> 处理个人数据时，EEA SCCs 的模块二（控制者到处理者）适用。

b. 当 <strong>客户</strong> 作为处理者，且 <strong>提供者</strong> 作为子处理者代表 <strong>客户</strong> 处理客户个人数据时，EEA SCCs 的模块三（处理者到子处理者）适用。

c. 对于每个模块，以下内容适用（如适用）：

1. 第7条中的可选对接条款不适用；

2. 第9条中，选项2（一般书面授权）适用，且子处理者变更的提前通知最短时间为10个工作日；

3. 第11条中的可选语言不适用；

4. 第13条中的所有方括号均被移除；

5. 第17条（选项1）中，EEA SCCs 受 <strong>管辖成员国</strong> 法律管辖；

6. 第18(b)条中，争议将在 <strong>管辖成员国</strong> 法院解决；

7. 本DPA的封面页包含EEA SCCs附件I、附件II和附件III中要求的信息。

### 3. 英国以外的转移 {#3-ex-uk-transfers}

<strong>客户</strong> 和 <strong>提供者</strong> 同意，如果英国GDPR保护客户个人数据的转移，且该转移是从 <strong>客户</strong> 在英国境内向 <strong>提供者</strong>（位于英国境外）进行，且该转移不受英国国务大臣作出的充分性决定管辖，则通过签订本DPA，<strong>客户</strong> 和 <strong>提供者</strong> 被视为已签署英国附录及其附件，且该附录通过引用纳入本协议。任何此类转移均依据英国附录进行，具体如下：

a. 本DPA第3.2节包含英国附录表2中要求的信息。

b. 英国附录表4作如下修改：任何一方均不得终止英国附录第19节所述的附录；若ICO根据英国附录第18节发布修订的批准附录，双方将本着诚信原则修订本DPA。

c. 封面页包含英国附录附件1A、附件1B、附件II和附件III中要求的信息。

### 4. 其他国际转移 {#4-other-international-transfers}

对于适用瑞士法律（而非任何EEA成员国或英国法律）管辖的个人数据国际转移，EEA SCCs第4条中对GDPR的引用，在法律要求的范围内，将修改为指瑞士联邦数据保护法或其继任者，且监管机构的概念将包括瑞士联邦数据保护与信息专员。

## 4. 安全事件响应 {#4-security-incident-response}

1. 一旦知悉任何安全事件，<strong>提供者</strong> 将：（a）在可行的情况下，尽快通知 <strong>客户</strong>，但不迟于知悉安全事件后72小时内；（b）及时提供关于安全事件的信息，或根据 <strong>客户</strong> 合理请求提供；（c）迅速采取合理措施遏制并调查安全事件。<strong>提供者</strong> 根据本DPA要求对安全事件的通知或响应，不应被视为 <strong>提供者</strong> 对该安全事件的任何过错或责任的承认。

## 5. 审计与报告 {#5-audit--reports}

### 1. 审计权利 {#1-audit-rights}

<strong>提供者</strong> 将向 <strong>客户</strong> 提供合理必要的信息，以证明其遵守本DPA的情况，并允许并协助 <strong>客户</strong> 进行审计，包括检查，以评估 <strong>提供者</strong> 对本DPA的合规性。然而，若 <strong>客户</strong> 访问信息会对 <strong>提供者</strong> 的知识产权、保密义务或适用法律下的其他义务产生负面影响，<strong>提供者</strong> 可限制访问数据或信息。<strong>客户</strong> 承认并同意，其仅通过指示 <strong>提供者</strong> 遵守以下报告和尽职调查要求，行使其根据本DPA及适用数据保护法律授予的审计权利。<strong>提供者</strong> 将在本DPA终止后保留其合规记录3年。
### 2. 安全报告 {#2-security-reports}

<strong>客户</strong> 确认 <strong>提供方</strong> 定期接受独立第三方审计员根据 <strong>安全政策</strong> 中定义的标准进行的审计。经书面请求，<strong>提供方</strong> 将以保密方式向 <strong>客户</strong> 提供其当时有效的报告摘要副本，以便 <strong>客户</strong> 验证 <strong>提供方</strong> 是否符合 <strong>安全政策</strong> 中定义的标准。

### 3. 安全尽职调查 {#3-security-due-diligence}

除了报告之外，<strong>提供方</strong> 将响应 <strong>客户</strong> 合理的信息请求，以确认 <strong>提供方</strong> 遵守本数据处理协议（DPA），包括对信息安全、尽职调查和审计问卷的回复，或提供有关其信息安全计划的额外信息。所有此类请求必须以书面形式提交给 <strong>提供方安全联系人</strong>，且每年仅可提出一次。

## 6. 协调与合作 {#6-coordination--cooperation}

### 1. 对查询的响应 {#1-response-to-inquiries}

如果 <strong>提供方</strong> 收到任何关于客户个人数据处理的其他方的查询或请求，<strong>提供方</strong> 将通知 <strong>客户</strong> 该请求，且未经 <strong>客户</strong> 事先同意，不得回应该请求。此类查询和请求的示例包括司法、行政或监管机构关于客户个人数据的命令（在适用法律不禁止通知客户的情况下），或数据主体的请求。如果适用法律允许，<strong>提供方</strong> 将遵循 <strong>客户</strong> 关于这些请求的合理指示，包括提供状态更新及客户合理要求的其他信息。如果数据主体根据适用数据保护法律提出有效请求，要求删除或选择退出 <strong>客户</strong> 向 <strong>提供方</strong> 提供的客户个人数据，<strong>提供方</strong> 将协助 <strong>客户</strong> 根据适用数据保护法律履行该请求。<strong>提供方</strong> 将配合并向 <strong>客户</strong> 提供合理协助（费用由客户承担），以应对客户针对第三方请求就 <strong>提供方</strong> 根据本DPA处理客户个人数据所采取的任何法律回应或其他程序性行动。

### 2. 数据保护影响评估和数据传输影响评估 {#2-dpias-and-dtias}

如果适用数据保护法律要求，<strong>提供方</strong> 将合理协助 <strong>客户</strong> 进行任何强制性的数据保护影响评估或数据传输影响评估，并与相关数据保护主管机关进行协商，考虑处理的性质及客户个人数据。

## 7. 删除客户个人数据 {#7-deletion-of-customer-personal-data}

### 1. 由客户删除 {#1-deletion-by-customer}

<strong>提供方</strong> 将使 <strong>客户</strong> 能够以与服务功能一致的方式删除客户个人数据。除非适用法律要求进一步存储客户个人数据，<strong>提供方</strong> 将尽快遵守该指示。

### 2. 数据处理协议到期时的删除 {#2-deletion-at-dpa-expiration}

a. 在数据处理协议到期后，<strong>提供方</strong> 将根据 <strong>客户</strong> 的指示归还或删除客户个人数据，除非适用法律要求或授权进一步存储客户个人数据。如果归还或销毁因适用法律而不可行或被禁止，<strong>提供方</strong> 将合理努力防止对客户个人数据的进一步处理，并继续保护其持有、保管或控制的客户个人数据。例如，适用法律可能要求 <strong>提供方</strong> 继续托管或处理客户个人数据。
b. 如果 <strong>客户</strong> 和 <strong>提供方</strong> 已将 EEA SCCs 或英国附录作为本 DPA 的一部分纳入，只有在 <strong>客户</strong> 提出请求时，<strong>提供方</strong> 才会向 <strong>客户</strong> 提供 EEA SCCs 第 8.1(d) 条和第 8.5 条中描述的个人数据删除证明。

## 8. 责任限制 {#8-limitation-of-liability}

### 1. 责任上限及损害赔偿放弃 {#1-liability-caps-and-damages-waiver}

**在适用数据保护法律允许的最大范围内，因本 DPA 引起或与之相关的各方对另一方的累计总责任将受限于 <strong>协议</strong> 中规定的弃权、排除和责任限制。**

### 2. 关联方索赔 {#2-related-party-claims}

**针对 <strong>提供方</strong> 或其关联公司因本 DPA 引起或与之相关的任何索赔，仅可由作为 <strong>协议</strong> 一方的 <strong>客户</strong> 实体提出。**

### 3. 例外情况 {#3-exceptions}

1. 本 DPA 不限制任何个人根据适用数据保护法律对其数据保护权利的责任。此外，本 DPA 不限制双方因违反 EEA SCCs 或英国附录而产生的任何责任。

## 9. 文件间冲突 {#9-conflicts-between-documents}

1. 本 DPA 构成并补充协议的一部分。如本 DPA、<strong>协议</strong> 或其任何部分之间存在不一致，以先列出的部分优先于后列出的部分为准，顺序为：(1) EEA SCCs 或英国附录，(2) 本 DPA，(3) <strong>协议</strong>。

## 10. 协议期限 {#10-term-of-agreement}

本 DPA 自 <strong>提供方</strong> 和 <strong>客户</strong> 同意 DPA 封面页并签署或电子接受 <strong>协议</strong> 起生效，持续有效直至 <strong>协议</strong> 到期或终止。但在 <strong>客户</strong> 停止向 <strong>提供方</strong> 传输客户个人数据且 <strong>提供方</strong> 停止处理客户个人数据之前，双方仍须遵守本 DPA 及适用数据保护法律中的义务。

## 11. 适用法律及指定法院 {#11-governing-law-and-chosen-courts}

尽管 <strong>协议</strong> 中有适用法律或类似条款，所有关于本 DPA 的解释和争议均适用 <strong>管辖州</strong> 法律，且不考虑其法律冲突规定。此外，尽管 <strong>协议</strong> 中有论坛选择、管辖权或类似条款，双方同意将任何关于本 DPA 的法律诉讼、行动或程序提交至 <strong>管辖州</strong> 法院，并且各方不可撤销地接受该法院的专属管辖权。

## 12. 服务提供商关系 {#12-service-provider-relationship}

在加利福尼亚消费者隐私法案（Cal. Civ. Code § 1798.100 及以下条款，“CCPA”）适用的范围内，双方确认并同意 <strong>提供方</strong> 是服务提供商，且根据 <strong>协议</strong> 从 <strong>客户</strong> 接收个人数据以提供服务，这构成商业目的。<strong>提供方</strong> 不会出售 <strong>客户</strong> 根据 <strong>协议</strong> 提供的任何个人数据。此外，<strong>提供方</strong> 除非为向 <strong>客户</strong> 提供服务所必需，或如 <strong>协议</strong> 所述，或适用数据保护法律允许，否则不会保留、使用或披露 <strong>客户</strong> 根据 <strong>协议</strong> 提供的任何个人数据。<strong>提供方</strong> 证明其理解本段的限制。
## 13. 定义 {#13-definitions}

1. **“适用法律”** 指适用于或管辖一方的相关政府机构的法律、规则、法规、法院命令及其他具有约束力的要求。

2. **“适用数据保护法律”** 指管辖服务如何处理或使用个人信息、个人数据、可识别个人身份的信息或其他类似术语的适用法律。

3. **“控制者”** 将具有适用数据保护法律中赋予的含义，指确定处理个人数据的目的和范围的公司。

4. **“封面页”** 指由双方签署或电子接受的文件，该文件纳入本DPA标准条款并标识<strong>提供方</strong>、<strong>客户</strong>及数据处理的主题和详细信息。

5. **“客户个人数据”** 指<strong>客户</strong>作为服务的一部分上传或提供给<strong>提供方</strong>的个人数据，并受本DPA管辖。

6. **“DPA”** 指本DPA标准条款、<strong>提供方</strong>与<strong>客户</strong>之间的封面页，以及封面页中引用或附加的政策和文件。

7. **“EEA SCCs”** 指附属于欧洲委员会2021年6月4日第2021/914号实施决定的标准合同条款，该决定涉及根据欧洲议会和欧洲理事会条例(EU) 2016/679向第三国传输个人数据的标准合同条款。

8. **“欧洲经济区”** 或 **“EEA”** 指欧盟成员国、挪威、冰岛和列支敦士登。

9. **“GDPR”** 指由相关EEA成员国本地法律实施的欧盟条例2016/679。

10. **“个人数据”** 将具有适用数据保护法律中赋予的个人信息、个人数据或其他类似术语的含义。

11. **“处理”** 或 **“处理”** 将具有适用数据保护法律中赋予的含义，指对个人数据的任何使用或计算机操作，包括自动方式。

12. **“处理者”** 将具有适用数据保护法律中赋予的含义，指代表控制者处理个人数据的公司。

13. **“报告”** 指由另一家公司根据安全政策中定义的标准代表提供方准备的审计报告。

14. **“受限传输”** 指 (a) 在GDPR适用时，从EEA向未被欧洲委员会认定为充分保护的国家传输个人数据；以及 (b) 在英国GDPR适用时，从英国向未根据2018年英国数据保护法第17A条通过充分性规定的任何其他国家传输个人数据。

15. **“安全事件”** 指GDPR第4条定义的个人数据泄露。

16. **“服务”** 指在<strong>协议</strong>中描述的产品和/或服务。

17. **“特殊类别数据”** 将具有GDPR第9条中赋予的含义。

18. **“子处理者”** 将具有适用数据保护法律中赋予的含义，指经控制者批准和接受，协助处理者代表控制者处理个人数据的公司。

19. **“英国GDPR”** 指由英国2018年《欧洲联盟（退出）法》第3条实施的欧盟条例2016/679在英国的实施。

20. **“英国附录”** 指信息专员为根据2018年数据保护法第119A(1)条进行受限传输的各方发布的EEA SCCs国际数据传输附录。

## 贡献 {#credits}

本文件为[Common Paper DPA标准条款（版本1.0）](https://commonpaper.com/standards/data-processing-agreement/1.0)的衍生版本，采用[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)许可。
