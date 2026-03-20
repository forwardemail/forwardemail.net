# 举报滥用 {#report-abuse}

<img loading="lazy" src="/img/articles/report-abuse.webp" alt="向 Forward Email 举报滥用和垃圾邮件" class="rounded-lg" />


## 目录 {#table-of-contents}

* [免责声明](#disclaimer)
* [如何提交滥用报告](#how-to-submit-an-abuse-report)
* [面向公众](#for-the-general-public)
* [面向执法部门](#for-law-enforcement)
  * [可提供哪些信息](#what-information-is-available)
  * [不可提供哪些信息](#what-information-is-not-available)
  * [美国境内执法部门](#law-enforcement-based-in-the-united-states)
  * [美国境外执法部门](#law-enforcement-based-outside-of-the-united-states)
  * [执法部门紧急请求](#law-enforcement-emergency-requests)
  * [执法请求可能触发账户通知](#law-enforcement-requests-may-trigger-account-notices)
  * [执法请求保留信息](#law-enforcement-requests-to-preserve-information)
  * [执法送达程序](#law-enforcement-serving-process)


## 免责声明 {#disclaimer}

请参阅我们适用于全站的[条款](/terms)。


## 如何提交滥用报告 {#how-to-submit-an-abuse-report}

我们通过电子邮件逐案审查滥用报告和为[公众](#for-the-general-public)及[执法部门](#for-law-enforcement)提供信息请求。

关于用户、电子邮件、IP 地址和/或域名的滥用报告和信息请求，以下统称为“账户”。

您可以通过以下电子邮件地址联系我们提交滥用相关请求或报告：`support@forwardemail.net`、`abuse@forwardemail.net` 和 `security@forwardemail.net`。

如果可能，请将报告发送至所有这些邮箱地址，并且如果我们在24-48小时内未回复，请发送提醒邮件。

请阅读以下章节，了解可能与您相关的更多信息。


## 面向公众 {#for-the-general-public}

<u>**如果您或他人处于紧急危险中，请立即联系警方和紧急服务。**</u>

<u>**您应寻求专业法律建议，以恢复对您的账户的访问权限或帮助阻止恶意行为者。**</u>

如果您是使用我们服务的账户滥用的受害者，请通过上述邮箱地址向我们发送报告。如果您的账户被恶意行为者接管（例如您的域名最近过期，被第三方重新注册后用于滥用），请通过上述邮箱地址发送包含您准确账户信息（例如您的域名）的报告。我们可以在验证您之前的所有权后帮助[影子封禁](https://en.wikipedia.org/wiki/Shadow_banning)该账户。请注意，我们无权帮助您恢复账户访问权限。

您的法律代表可能会建议您联系执法部门、您的账户所有者（例如域名注册商；您注册域名的网站）和/或参考[ICANN关于丢失域名的页面](https://www.icann.org/resources/pages/lost-domain-names)。


## 面向执法部门 {#for-law-enforcement}

对于大多数请求，我们披露信息的能力受[电子通信隐私法案](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285)（[维基百科](https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act)）、[18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701) 等法律（“ECPA”）的约束。ECPA 规定，我们仅在收到特定类型的法律请求（包括传票、法院命令和搜查令）时，才向执法部门披露某些用户信息。

如果您是执法人员并寻求有关账户的信息，请在请求中包含账户信息以及日期和时间范围。我们无法处理过于宽泛和/或模糊的请求——这是为了保护用户数据和信任，最重要的是保障他们的数据安全。
如果您的请求向我们表明违反了我们的[条款](/terms)，那么我们将根据内部专用的滥用处理最佳实践进行处理——请注意，在某些情况下，这可能导致暂停和/或禁止该账户。

**由于我们不是域名注册商**，如果您希望查询某个域名的历史 DNS 记录信息，则应联系对应该域名的具体域名注册商。诸如[Security Trails]()等服务可能提供历史记录查询，但更具体和准确的信息可能由注册商提供。为了确定域名注册商和/或 DNS 名称服务器所有者，`dig` 和 `whois` 工具可能有用（例如 `whois example.com` 或 `dig example.com ns`）。您可以通过进行 DNS 记录查询（例如 `dig example.com mx` 和 `dig example.com txt`）来确定某账户是在我们的服务上的付费计划还是免费计划。如果 MX 记录未返回诸如 `mx1.forwardemail.net` 和 `mx2.forwardemail.net` 的值，则该域名未使用我们的服务。如果 TXT 记录返回明文电子邮件地址（例如 `forward-email=user@example.com`），则表示该域名的邮件转发地址目的地。如果返回的值是诸如 `forward-email-site-verification=XXXXXXXXXX`，则表示该域名处于付费计划中，转发配置存储在我们的数据库中，ID 为 `XXXXXXXXXX`。有关我们的服务在 DNS 级别如何工作的更多信息，请参阅我们的[常见问题](/faq)。

### 可获取哪些信息 {#what-information-is-available}

请参阅我们的隐私政策部分的[收集的信息](/privacy#information-collected)。账户允许根据数据保留和隐私法律从我们的系统中删除其信息；请参阅我们的隐私政策部分的[信息删除](/privacy#information-removal)。这意味着请求时可能因账户已删除而无法提供所请求的信息。

### 不可获取哪些信息 {#what-information-is-not-available}

请参阅我们的隐私政策部分的[未收集的信息](/privacy#information-not-collected)。

### 美国境内执法机构 {#law-enforcement-based-in-the-united-states}

除[紧急情况](#law-enforcement-emergency-requests)外，我们仅在收到有效的传票、ECPA 美国法院命令和/或搜查令时共享账户信息。

除非法律或法院命令禁止，否则我们可能会[通知账户](#law-enforcement-requests-may-trigger-account-notices)有关执法请求。

如果我们收到有效的传票、ECPA 法院命令和/或搜查令，我们将尽最大努力提供相关且可用的信息。

### 美国境外执法机构 {#law-enforcement-based-outside-of-the-united-states}

我们要求来自美国境外的执法请求通过以下方式之一送达：

* 美国法院。
* 根据[美国相互法律协助条约](https://www.justice.gov/criminal-oia/file/1498806/download)（[维基百科](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty)）程序的执法机构（“MLAT”）。
* 外国政府的命令，该命令受美国司法部长已确定并向国会认证符合[18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523)要求的执行协议约束。

### 执法紧急请求 {#law-enforcement-emergency-requests}

根据美国法律允许的范围（例如根据[18 U.S.C. §2702 (b)(8)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(8\)to%20a%20governmental%20entity%2C%20if%20the%20provider%2C%20in%20good%20faith%2C%20believes%20that%20an%20emergency%20involving%20danger%20of%20death%20or%20serious%20physical%20injury%20to%20any%20person%20requires%20disclosure%20without%20delay%20of%20communications%20relating%20to%20the%20emergency%3B%20or) 和 [§2702 (c)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)Exceptions%20for%20Disclosure%20of%20Customer%20Records.%E2%80%94A%20provider%20described%20in%20subsection%20\(a\)%20may%20divulge%20a%20record%20or%20other%20information%20pertaining%20to%20a%20subscriber%20to%20or%20customer%20of%20such%20service%20\(not%20including%20the%20contents%20of%20communications%20covered%20by%20subsection%20\(a\)\(1\)%20or%20\(a\)\(2\)\)%E2%80%94))，在善意且对请求者进行独立验证的情况下——当我们认为为了防止死亡或严重身体伤害，必须立即披露时，我们可能在没有传票、ECPA 法院命令和/或搜查令的情况下向执法机构披露和共享账户信息。
我们要求紧急数据请求（“EDR”）通过电子邮件发送，并包含所有相关信息，以便提供及时和加快的处理流程。

请注意，我们意识到电子邮件存在复杂的伪造、网络钓鱼和冒充攻击（例如，参见[《卫报》的这篇文章](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law)）。

我们处理EDR的政策如下：

1. 独立研究电子邮件头元数据（例如 DKIM/SPF/DMARC）（或其缺失）以进行验证。

2. 以诚信尽最大努力（如有必要可多次尝试）通过电话独立联系请求者——以确认请求的真实性。例如，我们可能会研究请求所涉及司法管辖区的 `.gov` 网站，然后通过其公开列出的官方电话号码致电该办公室以验证请求。

### 执法请求可能触发账户通知 {#law-enforcement-requests-may-trigger-account-notices}

除非法律或法院命令禁止（例如，[18 U.S.C. 2705(b)](https://www.govinfo.gov/link/uscode/18/2705)），否则我们可能会通知账户并向其提供与其相关的执法请求副本。在这些情况下（如适用），我们可能会在保密令到期后通知账户。

如果执法机关的信息请求有效，我们将[保留必要且请求的账户信息](#law-enforcement-requests-to-preserve-information)，并尽合理努力通过账户注册并验证的电子邮件地址联系账户所有者（例如，在7个日历日内）。如果我们在规定时间内收到异议（例如7个日历日内），则我们将暂停共享账户信息，并根据需要继续法律程序。

### 执法机关请求保留信息 {#law-enforcement-requests-to-preserve-information}

我们将根据[18 U.S.C. 2703(f)](https://www.govinfo.gov/link/uscode/18/2703)尊重执法机关关于保留账户信息的有效请求。请注意，数据保留仅限于具体请求且当前可用的数据。

### 执法机关送达程序 {#law-enforcement-serving-process}

我们要求所有有效的执法请求提供一个有效且可用的电子邮件地址，以便我们进行通信并通过电子方式提供所请求的信息。

所有请求应发送至上述[如何提交滥用报告](#how-to-submit-an-abuse-report)中指定的电子邮件地址。

所有执法请求必须使用机构或部门的信头（例如，作为PDF扫描附件），来自官方且相关的电子邮件地址，并附有签名。

如果是关于[紧急请求](#law-enforcement-emergency-requests)，请在电子邮件主题栏中写明“紧急执法请求”。

请注意，我们可能至少需要两周时间才能审查并回复您的请求。
