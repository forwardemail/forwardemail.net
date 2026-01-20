# 举报滥用行为 {#report-abuse}

<img loading="lazy" src="/img/articles/report-abuse.webp" alt="Report abuse and spam to Forward Email" class="rounded-lg" />

## 目录 {#table-of-contents}

* [免责声明](#disclaimer)
* [如何提交滥用报告](#how-to-submit-an-abuse-report)
* [对于普通公众](#for-the-general-public)
* [对于执法部门](#for-law-enforcement)
  * [有哪些信息](#what-information-is-available)
  * [哪些信息不可用](#what-information-is-not-available)
  * [位于美国的执法部门](#law-enforcement-based-in-the-united-states)
  * [位于美国境外的执法部门](#law-enforcement-based-outside-of-the-united-states)
  * [执法紧急请求](#law-enforcement-emergency-requests)
  * [执法请求可能会触发账户通知](#law-enforcement-requests-may-trigger-account-notices)
  * [执法部门要求保存信息](#law-enforcement-requests-to-preserve-information)
  * [执法服务流程](#law-enforcement-serving-process)

## 免责声明 {#disclaimer}

请遵循我们的 [条款](/terms)，因为它适用于整个网站。

## 如何提交滥用报告 {#how-to-submit-an-abuse-report}

我们通过电子邮件逐一审查滥用报告并处理针对 [普通公众](#for-the-general-public) 和 [执法](#for-law-enforcement) 的信息请求。

有关用户、电子邮件、IP 地址和/或域的滥用报告和信息请求在下文统称为“帐户”。

用于处理您关于滥用的请求或举报的电子邮件地址是：`abuse@forwardemail.net`

请阅读以下部分以获取更多可能与您相关的信息。

## 面向公众 {#for-the-general-public}

<u>**如果您或其他人即将受到伤害，请立即联系警察和紧急服务部门。**</u>

<u>**您应该寻求专业的法律建议，以重新获得对您帐户的访问权限或帮助阻止恶意行为者。**</u>

如果您在使用我们服务的帐户中遭遇滥用，请通过电子邮件将您的报告发送至上述地址。如果您的帐户被恶意行为者接管（例如，您的域名最近过期，并被第三方重新注册，然后被用于滥用），请通过电子邮件向我们发送报告至上述地址，并提供您的确切帐户信息（例如您的域名）。我们可以在验证您之前的所有权后，协助您[影子禁令](https://en.wikipedia.org/wiki/Shadow_banning)该帐户。请注意，我们没有权限帮助您重新获得帐户访问权限。

您的法定代表人可能会建议您联系执法部门、您的帐户所有者（例如域名注册商；您注册域名的网站）和/或将您推迟到 [ICANN 关于丢失域名的页面](https://www.icann.org/resources/pages/lost-domain-names)。

## 执法部门 {#for-law-enforcement}

对于大多数请求，我们披露信息的权利受《[《电子通信隐私法》](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285)》（[维基百科](https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act)）、[18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701) 等法律法规（以下简称“ECPA”）的约束。ECPA 规定，我们仅在响应特定类型的法律请求（包括传票、法院命令和搜查令）时才会向执法部门披露某些用户信息。

如果您是执法人员，并寻求有关帐户的信息，则您的请求中应包含帐户信息以及日期和时间范围。我们无法处理过于宽泛和/或模糊的请求——这是为了保护用户的数据和信任，最重要的是确保他们的数据安全。

如果您的请求向我们发出违反我们的 [条款](/terms) 的信号，那么我们将根据我们内部处理滥用行为的最佳实践来处理它 - 请注意，在某些情况下，这可能会导致暂停和/或禁止该帐户。

**由于我们并非域名注册商**，如果您想查找某个域名的历史 DNS 记录信息，请联系该域名对应的具体域名注册商。[Security Trails]() 等服务可能提供历史记录查询，但注册商可能会提供更具体、更准确的信息。为了确定域名的注册商和/或 DNS 域名服务器所有者，`dig` 和 `whois` 工具（例如 `whois example.com` 或 `dig example.com ns`）可能会有所帮助。您可以通过执行 DNS 记录查询（例如 `dig example.com mx` 和 `dig example.com txt`）来确定帐户在使用我们的服务时使用的是付费方案还是免费方案。如果 MX 记录未返回诸如 `mx1.forwardemail.net` 和 `mx2.forwardemail.net` 之类的值，则表示该域名未使用我们的服务。如果 TXT 记录返回纯文本电子邮件地址（例如 `forward-email=user@example.com`），则表示该域名的电子邮件转发地址目标。如果返回诸如 `forward-email-site-verification=XXXXXXXXXX` 之类的值，则表示该域名处于付费方案中，并且转发配置存储在我们数据库中的 ID 为 `whois`0 的服务器中。有关我们的服务在 DNS 级别如何运作的更多信息，请参阅我们的 `whois`1。

### 有哪些信息可用 {#what-information-is-available}

[收集的信息](/privacy#information-collected) 的隐私政策部分请参考。账户可以根据数据保留和隐私法律的规定，从我们的系统中移除其信息；[信息删除](/privacy#information-removal) 的隐私政策部分请参考。这意味着，由于账户被删除，请求的信息可能在请求时不可用。

### 哪些信息不可用 {#what-information-is-not-available}

请参阅 [未收集信息](/privacy#information-not-collected) 的隐私政策部分。

### 位于美国的执法部门 {#law-enforcement-based-in-the-united-states}

通过 [紧急情况除外](#law-enforcement-emergency-requests)，我们仅在收到有效传票、ECPA 美国法院命令和/或搜查令后才会共享帐户信息。

我们可能还会根据执法请求提供 [通知帐户](#law-enforcement-requests-may-trigger-account-notices)，除非法律或法院命令禁止我们这样做。

如果我们收到有效的传票、ECPA 法院命令和/或搜查令，我们将尽最大努力提供相关且可用的信息。

### 美国境外的执法机构 {#law-enforcement-based-outside-of-the-united-states}

我们要求通过以下方式之一向美国境外的执法部门提供请求：

* 美国法院。
* 根据 [美国司法协助条约](https://www.justice.gov/criminal-oia/file/1498806/download) ([维基百科](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty))（“司法互助协议”）程序的执法机构。
* 外国政府的命令，该命令受行政协议约束，且经美国司法部长确定并向国会证明，符合 [18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523) 的要求。

### 执法紧急请求 {#law-enforcement-emergency-requests}

根据美国法律允许的情况（例如，根据 [18 美国法典第2702条（b）（8）款](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(8\)，如果服务提供者善意相信，发生涉及任何人死亡或严重人身伤害危险的紧急情况，需要立即披露与紧急情况相关的信息 3B 或），并且[第2702（c）条](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)客户记录披露例外。%E2%80%94 提供商在善意且经过请求者独立核实的情况下，可以向此类服务的用户或客户泄露与此类服务相关的记录或其他信息（不包括 %E2%80%94 子节中所述的通信内容）。 – 当我们认为为了防止死亡或严重的人身伤害需要立即这样做时，我们可能会在没有传票、ECPA 法院命令和/或搜查令的情况下向执法部门披露和共享帐户信息。

我们要求通过电子邮件发送紧急数据请求（“EDR”）并包含所有相关信息，以便提供及时、快速的流程。

请注意，我们知道通过电子邮件存在复杂的欺骗、网络钓鱼和冒充攻击（例如，参见[这篇文章来自《卫报》](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law)）。

我们处理 EDR 的政策如下：

1. 独立研究电子邮件标头元数据（例如 DKIM/SPF/DMARC）（或缺少元数据）进行验证。

2. 我们会尽最大努力（必要时可多次尝试）通过电话联系请求者，以确认请求的真实性。例如，我们可能会查询与请求所在司法管辖区相关的 `.gov` 网站，然后使用其公开的官方电话号码致电该办公室，以验证请求的真实性。

### 执法请求可能会触发帐户通知 {#law-enforcement-requests-may-trigger-account-notices}

我们可能会通知账户，并向其提供与其相关的执法请求副本，除非法律或法院命令禁止我们这样做（例如 [18 美国法典第 2705(b) 条](https://www.govinfo.gov/link/uscode/18/2705)）。在这些情况下（如适用），我们可能会在保密令到期后通知账户。

如果执法部门的信息请求有效，我们将[保存必要和请求的帐户信息](#law-enforcement-requests-to-preserve-information)并尽合理努力（例如在7个日历日内）通过帐户所有者的注册和验证电子邮件地址与其联系。如果我们及时收到异议（例如在7个日历日内），我们将暂停共享帐户信息，并在必要时继续进行法律程序。

### 执法部门要求保留信息 {#law-enforcement-requests-to-preserve-information}

我们将遵从执法部门的有效请求，根据 [18 美国法典第 2703(f) 条](https://www.govinfo.gov/link/uscode/18/2703) 保存帐户信息。请注意，数据保存仅限于明确请求且当前可用的数据。

### 执法服务流程 {#law-enforcement-serving-process}

我们要求所有有效的执法请求都向我们提供一个有效且可用的电子邮件地址，以便我们与之通信并以电子方式提供所请求的信息。

所有请求都应发送至上面 [如何提交滥用报告](#how-to-submit-an-abuse-report) 下指定的电子邮件地址。

所有执法请求必须以机构或部门信头（例如 PDF 扫描附件）的形式从官方相关电子邮件地址发送，并签名。

如果与 [紧急请求](#law-enforcement-emergency-requests) 有关，请在电子邮件的主题标题中写上“紧急执法请求”。

请注意，我们可能需要至少两周的时间才能审核并回复您的请求。