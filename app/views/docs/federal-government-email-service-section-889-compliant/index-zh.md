# 转发电子邮件：符合第 889 条的电子邮件转发解决方案 {#forward-email-your-section-889-compliant-email-forwarding-solution}

<img loading="lazy" src="/img/articles/federal.webp" alt="Federal government email service Section 889 compliant" class="rounded-lg" />

## 目录 {#table-of-contents}

* [前言](#foreword)
* [了解第 889 条合规性](#understanding-section-889-compliance)
* [转发电子邮件如何实现第 889 条合规性](#how-forward-email-achieves-section-889-compliance)
  * [Cloudflare 的承诺](#cloudflares-commitment)
  * [DataPacket 的基础设施](#datapackets-infrastructure)
* [超越第889条：更广泛的政府合规性](#beyond-section-889-broader-government-compliance)
* [我们的前进之路：拓展合规视野](#our-path-forward-expanding-compliance-horizons)
* [为什么这对你很重要](#why-this-matters-for-you)
* [安全、合规的电子邮件转发从这里开始](#secure-compliant-email-forwarding-starts-here)
* [参考](#references)

## 前言 {#foreword}

在 Forward Email，我们致力于为每个人提供简单、安全且私密的电子邮件转发服务。我们深知，对于许多组织，尤其是与美国政府合作的组织而言，合规并非只是一句空话，而是切实可行的要求。确保遵守**联邦电子邮件法规**至关重要。因此，我们自豪地宣布，我们的**安全电子邮件转发**服务符合严格的联邦法规，包括 [第889条](https://www.acquisition.gov/Section-889-Policies) 和 [国防授权法案（NDAA）](https://en.wikipedia.org/wiki/National_Defense_Authorization_Act) 的要求。

我们对**政府电子邮件合规性**的承诺，最近在**美国海军学院**与**Forward Email**接洽时得到了充分体现。他们要求**安全的电子邮件转发**服务，并需要提供文件证明我们遵守联邦法规，包括**第889条合规性**。此次经验堪称宝贵的案例研究，展现了我们为支持政府资助机构并满足其严格要求所作的准备和能力。这份敬业精神也适用于所有寻求可靠、**注重隐私的电子邮件**解决方案的用户。

## 了解第 889 条合规性 {#understanding-section-889-compliance}

第889条款是什么？简而言之，这是一项美国联邦法律，禁止政府机构使用或与使用特定公司（例如华为、中兴、海康威视、大华和海能达）的某些电信和视频监控设备或服务的实体签订合同。这项规定通常与“华为禁令”和“中兴禁令”联系在一起，旨在保护国家安全。

> \[!NOTE]
> 第889条特别针对华为、中兴、海能达、海康威视和大华及其子公司和附属公司的设备和服务。

对于像**转发电子邮件**这样的**政府合同电子邮件转发服务**，这意味着确保我们的底层基础设施提供商都不使用这种禁止的设备，使我们符合**第 889 条的规定**。

## 转发电子邮件如何实现第 889 条合规性 {#how-forward-email-achieves-section-889-compliance}

那么，**“转发电子邮件”如何符合第 889 条规定？**我们通过精心挑选基础设施合作伙伴来实现这一点。**“转发电子邮件”完全依赖两家主要供应商来提供符合第 889 条规定的基础设施：

1. **[Cloudflare](https://www.cloudflare.com/)**：我们的主要网络服务和**Cloudflare电子邮件安全**合作伙伴。
2. **[数据包](https://datapacket.com/)**：我们的主要服务器基础设施提供商（我们使用[数字海洋](https://www.digitalocean.com/)和/或[Vultr](https://www.vultr.com/)进行故障转移，并将很快过渡到仅使用DataPacket——当然，我们已从这两家故障转移提供商处书面确认了其符合第889条的规定）。

> \[!IMPORTANT]
> 我们完全依赖 Cloudflare 和 DataPacket，这两家公司均未使用第 889 条禁止的设备，这是我们合规的基石。

[Cloudflare](https://www.cloudflare.com/) 和 [数据包](https://datapacket.com/) 都致力于高安全标准，并且不使用第 889 条禁止的设备。**使用 Cloudflare 和 DataPacket 来遵守第 889 条**是我们服务的基础。

### Cloudflare 的承诺 {#cloudflares-commitment}

[Cloudflare](https://www.cloudflare.com/) 在其 **[第三方行为准则](https://cf-assets.www.cloudflare.com/slt3lc6tev37/284hiWkCYNc49GQpAeBvGN/e137cdac96d1c4cd403c6b525831d284/Third_Party_Code_of_Conduct.pdf)** 中明确提到了 **第 889 条合规性**。他们指出：

> “根据《国防授权法案》（NDAA）第 889 条，Cloudflare 不得在其供应链中使用或以其他方式允许华为技术公司、中兴通讯股份有限公司、海能达通信股份有限公司、杭州海康威视数字技术股份有限公司或大华技术股份有限公司（或此类实体的任何子公司或附属公司）生产或提供的电信设备、视频监控产品或服务。”

*（来源：Cloudflare 第三方行为准则，检索日期：2025 年 4 月 29 日）*

这一明确的声明证实了**转发电子邮件**所利用的 [Cloudflare 的](https://www.cloudflare.com/) 基础设施符合第 889 条的要求。

### 数据包的基础设施 {#datapackets-infrastructure}

我们的服务器提供商 [数据包](https://datapacket.com/) 仅使用 **Arista Networks** 和 **Cisco** 的网络设备。Arista 和 Cisco 均不属于第 889 条禁止的公司。这两家公司都是在安全企业和政府环境中广泛使用的知名供应商，以遵守严格的安全和合规标准而闻名。

通过仅使用 [Cloudflare](https://www.cloudflare.com/) 和 [数据包](https://datapacket.com/)，**Forward Email** 确保其整个服务交付链不受第 889 条禁止的设备的影响，从而为联邦机构和其他注重安全的用户提供**安全的电子邮件转发。

## 超越第 889 条：更广泛的政府合规性 {#beyond-section-889-broader-government-compliance}

我们对**政府电子邮件安全**和合规性的承诺超越了第 889 条的规定。虽然**转发电子邮件**本身并不像大型 SaaS 平台那样直接处理或存储 [受控非机密信息 (CUI)](https://en.wikipedia.org/wiki/Controlled_Unclassified_Information) 等敏感政府数据，但我们的**开源电子邮件转发**架构以及对安全、合规提供商的依赖符合其他关键法规的原则：

* **[FAR（联邦采购条例）](https://en.wikipedia.org/wiki/Federal_Acquisition_Regulation)：通过使用合规的基础设施并提供直接的商业服务，我们提供适用于政府承包商的符合《联邦法规》(FAR) 的电子邮件转发原则。
* **隐私法案 & [FISMA](https://en.wikipedia.org/wiki/Federal_Information_Security_Management_Act_of\_2002)：我们在设计上**注重隐私**，并提供符合《隐私法案》的电子邮件**原则。我们不会存储您的电子邮件。电子邮件会直接转发，从而最大限度地减少数据处理。我们的基础设施提供商（[Cloudflare](https://www.cloudflare.com/)、[数据包](https://datapacket.com/)）根据符合**FISMA 合规电子邮件**原则的高安全标准管理其系统。
* **[HIPAA](https://en.wikipedia.org/wiki/Health_Insurance_Portability_and_Accountability_Act)：对于需要**符合 HIPAA 的电子邮件转发**的组织，“转发电子邮件”可以成为合规解决方案的一部分。由于我们不存储电子邮件，因此主要的合规责任在于终端电子邮件系统。但是，如果正确使用，我们的安全传输层可以支持 HIPAA 要求。

> \[!WARNING]
> 您的最终电子邮件提供商可能需要 [业务伙伴协议 (BAA)](https://en.wikipedia.org/wiki/Business_associate_agreement)，而不是**转发电子邮件**本身，因为我们不会存储您的电子邮件内容（除非您使用 [我们的加密 IMAP/POP3 存储层](/blog/docs/best-quantum-safe-encrypted-email-service)）。

## 我们的前进之路：拓展合规视野 {#our-path-forward-expanding-compliance-horizons}

虽然我们的第 889 条合规性为联邦承包商提供了至关重要的基础，但我们深知，不同的组织和政府机构有着多样化且不断变化的监管需求。在**Forward Email**，透明度至关重要，我们希望分享我们对更广泛的合规格局和未来方向的看法。

我们认识到以下框架和法规的重要性：

* **[奖励管理系统（SAM）](https://sam.gov/)：对于直接联邦合同至关重要。
* **[FAR（联邦采购条例）](https://www.acquisition.gov/browse/index/far)：包括商业服务的标准条款，例如 [FAR 52.212-4](https://www.acquisition.gov/far/52.212-4)。
* **[DFARS（国防联邦采购条例补充）](https://en.wikipedia.org/wiki/Defense_Federal_Acquisition_Regulation_Supplement)：特别是国防部云服务的 [DFARS 252.239-7010](https://www.acquisition.gov/dfars/252.239-7010-cloud-computing-services.)。
* **[CMMC（网络安全成熟度模型认证）](https://en.wikipedia.org/wiki/Cybersecurity_Maturity_Model_Certification)：对于处理 [联邦合同信息（FCI）](https://en.wikipedia.org/wiki/Federal_Contract_Information) 或 CUI 的国防部承包商而言是必需的。
* **[NIST SP 800-171](https://csrc.nist.gov/pubs/sp/800/171/r3/final)：CMMC 2 级的基础，专注于保护 CUI。（[NIST](https://en.wikipedia.org/wiki/National_Institute_of_Standards_and_Technology) - 美国国家标准与技术研究所）
* **[FedRAMP（联邦风险与授权管理计划）](https://en.wikipedia.org/wiki/FedRAMP)：联邦机构使用的云服务标准。
* **__PROTECTED_LINK_77__0：联邦信息安全的总体框架。
* **__PROTECTED_LINK_77__1：用于处理受保护的健康信息 (PHI)。
* **__PROTECTED_LINK_77__2：用于保护学生教育记录。
* **__PROTECTED_LINK_77__3：用于处理与 13 岁以下儿童相关的服务。

**我们目前的立场和未来的目标：**

**Forward Email** 的核心设计——**注重隐私**、**开源**，并最大限度地减少数据处理（尤其是在我们基本的**电子邮件转发**服务中）——与许多此类法规背后的*原则*高度契合。我们现有的安全实践（加密、对现代电子邮件标准的支持）以及对第 889 条的合规性，为我们提供了一个坚实的起点。

然而，获得**FedRAMP**或**CMMC**等框架的正式认证或授权是一项艰巨的任务。它涉及严格的文档记录、实施特定的技术和程序控制（通常多达数百项）、独立评估（例如 FedRAMP 的 [3PAO](https://www.fedramp.gov/glossary/#3pao) - 第三方评估机构）以及持续的监控。

> \[!IMPORTANT]
> 合规不仅仅关乎技术；它还关乎记录的流程、政策和持续的警惕。获得 FedRAMP 或 CMMC 等认证需要大量的投资和时间。

**我们的承诺：**

随着**Forward Email**的发展壮大以及客户需求的不断变化，我们致力于探索并争取相关的合规认证。这包括以下计划：

1. **SAM 注册**：促进与美国联邦机构的直接合作。
2. **规范化流程**：增强我们的内部文档和程序，使其符合 NIST SP 800-171 等标准，这些标准构成了 CMMC 的基础。
3. **评估 FedRAMP 路径**：评估申请 FedRAMP 授权的要求和可行性，可能从低级或中级基准开始，并在适用的情况下利用 [TO-SaaS](https://www.fedramp.gov/blog/fedramp-releases-low-impact-saas-baseline/) 模型。
4. **支持特定需求**：随着我们与医疗保健和教育机构的合作日益增多，我们正努力满足 HIPAA（可能通过 BAA 和针对存储数据的特定配置）和 FERPA（通过适当的合同条款和控制措施）等要求。

这一旅程需要精心规划和投入。虽然我们目前尚未确定所有认证的近期时间表，但加强合规性以满足政府和受监管行业的需求是我们路线图的关键部分。

> \[!NOTE]
> 我们相信，我们的**开源**特性在整个过程中提供了独特的透明度，让我们的社区和客户能够亲眼看到我们的承诺。

随着我们在合规道路上取得重大里程碑，我们将继续向社区通报最新情况。

## 为什么这对你很重要 {#why-this-matters-for-you}

选择符合**第 889 条的电子邮件转发**服务（例如**转发电子邮件**）意味着：

* **安心**：尤其适用于政府机构、承包商和注重安全的组织。
* **降低风险**：避免与**联邦电子邮件法规**发生潜在冲突。
* **信任**：展现对安全和供应链完整性的承诺。

**转发电子邮件**提供了一种简单、可靠且*兼容*的方式来管理您的自定义域**电子邮件转发**需求。

## 安全、合规的电子邮件转发从这里开始 {#secure-compliant-email-forwarding-starts-here}

**Forward Email** 致力于提供**安全、私密且开源的电子邮件转发**服务。我们通过与 [Cloudflare](https://www.cloudflare.com/) 和 [数据包](https://datapacket.com/) 的合作，**遵守了第 889 条的规定**（这体现了我们为美国海军学院提供的**Forward Email 合规性**工作），充分证明了我们对此的承诺。无论您是政府机构、承包商，还是仅仅重视**政府电子邮件安全**，**Forward Email** 都是您的理想之选。

准备好**安全、合规的电子邮件转发**了吗？[今天免费注册！](https://forwardemail.net)

## 参考文献 {#references}

* **第 889 条 (NDAA)：** <https://www.acquisition.gov/Section-889-Policies>
* **Cloudflare：** <https://www.cloudflare.com/>
* **Cloudflare 第三方行为准则：** <https://cf-assets.www.cloudflare.com/slt3lc6tev37/284hiWkCYNc49GQpAeBvGN/e137cdac96d1c4cd403c6b525831d284/Third_Party_Code_of_Conduct.pdf>
* **数据包：** <https://datapacket.com/>
* **奖项管理系统 (SAM)：** <https://sam.gov/>
* **联邦采购条例 (FAR)：** <https://www.acquisition.gov/browse/index/far>
* **FAR 52.212-4：** <https://www.acquisition.gov/far/52.212-4>
* **国防联邦采购条例补充规定 (DFARS)：** <https://www.acquisition.gov/dfars>
* **DFARS 252.239-7010：** <https://www.acquisition.gov/dfars/252.239-7010-cloud-computing-services.>
* **网络安全成熟度模型认证(CMMC)：** <https://dodcio.defense.gov/cmmc/About/>
* **NIST SP 800-171：** <https://www.cloudflare.com/>0
* **联邦风险与授权管理计划 (FedRAMP)：** <https://www.cloudflare.com/>1
* **联邦信息安全现代化法案 (FISMA)：** <https://www.cloudflare.com/>2
* **健康保险流通与责任法案 (HIPAA)：** <https://www.cloudflare.com/>3
* **家庭教育权利和隐私法案 (FERPA)：** <https://www.cloudflare.com/>4
* **儿童在线隐私保护法案 (COPPA)：** <https://www.cloudflare.com/>5