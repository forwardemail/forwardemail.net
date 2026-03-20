# 自托管电子邮件：对开源的承诺 {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="自托管电子邮件解决方案插图" class="rounded-lg" />


## 目录 {#table-of-contents}

* [前言](#foreword)
* [为什么自托管电子邮件很重要](#why-self-hosted-email-matters)
  * [传统电子邮件服务的问题](#the-problem-with-traditional-email-services)
  * [自托管的替代方案](#the-self-hosted-alternative)
* [我们的自托管实现：技术概览](#our-self-hosted-implementation-technical-overview)
  * [基于 Docker 的架构：简洁与可移植性](#docker-based-architecture-for-simplicity-and-portability)
  * [Bash 脚本安装：易用性与安全性的结合](#bash-script-installation-accessibility-meets-security)
  * [量子安全加密：面向未来的隐私保护](#quantum-safe-encryption-for-future-proof-privacy)
  * [自动化维护与更新](#automated-maintenance-and-updates)
* [开源承诺](#the-open-source-commitment)
* [自托管 vs 托管服务：做出正确选择](#self-hosted-vs-managed-making-the-right-choice)
  * [自托管电子邮件的现实](#the-reality-of-self-hosting-email)
  * [何时选择我们的托管服务](#when-to-choose-our-managed-service)
* [开始使用自托管转发电子邮件](#getting-started-with-self-hosted-forward-email)
  * [系统要求](#system-requirements)
  * [安装步骤](#installation-steps)
* [自托管电子邮件的未来](#the-future-of-self-hosted-email)
* [结论：人人享有电子邮件自由](#conclusion-email-freedom-for-everyone)
* [参考文献](#references)


## 前言 {#foreword}

在当今的数字环境中，电子邮件依然是我们在线身份和沟通的支柱。然而，随着隐私问题日益突出，许多用户面临艰难的选择：便利以牺牲隐私，或隐私以牺牲便利。在 Forward Email，我们始终相信你不应该在两者之间做出选择。

今天，我们很高兴宣布我们旅程中的一个重要里程碑：推出我们的自托管电子邮件解决方案。此功能代表了我们对开源原则、以隐私为中心的设计和用户赋权的最深承诺。通过我们的自托管选项，我们将电子邮件通信的全部力量和控制权直接交到你手中。

这篇博客文章将探讨我们自托管解决方案背后的理念、技术实现，以及为什么它对重视隐私和数字通信所有权的用户至关重要。


## 为什么自托管电子邮件很重要 {#why-self-hosted-email-matters}

我们的自托管电子邮件解决方案最清晰地表达了我们的信念：真正的隐私意味着控制，而控制始于开源。对于那些要求完全拥有其数字通信的用户来说，自托管不再是边缘想法——它是一项基本权利。我们自豪地支持这一信念，提供一个完全开源、可验证的平台，你可以按自己的条件运行。

### 传统电子邮件服务的问题 {#the-problem-with-traditional-email-services}

传统电子邮件服务对注重隐私的用户提出了几个根本性挑战：

1. **信任要求**：你必须信任服务提供商不会访问、分析或分享你的数据
2. **集中控制**：你的访问权限可能随时因任何原因被撤销
3. **监控风险**：集中式服务是监控的主要目标
4. **透明度有限**：大多数服务使用专有的闭源软件
5. **供应商锁定**：迁移离开这些服务可能困难甚至不可能

即使是“注重隐私”的电子邮件提供商，通常也只是开源其前端应用程序，而将后端系统保持专有和闭源。这造成了显著的信任缺口——你被要求相信他们的隐私承诺，却无法验证。

### 自托管的替代方案 {#the-self-hosted-alternative}
自托管您的电子邮件提供了一种根本不同的方法：

1. **完全控制**：您拥有并控制整个电子邮件基础设施
2. **可验证的隐私**：整个系统透明且可审计
3. **无需信任**：您无需信任第三方处理您的通信
4. **自由定制**：根据您的具体需求调整系统
5. **高可用性**：无论任何公司的决策，您的服务都能持续运行

正如一位用户所说：“自托管我的电子邮件就像数字时代自己种植食物——虽然更费力，但我确切知道里面有什么。”


## 我们的自托管实现：技术概览 {#our-self-hosted-implementation-technical-overview}

我们的自托管电子邮件解决方案基于指导我们所有产品的隐私优先原则。让我们来探讨实现这一目标的技术细节。

### 基于 Docker 的架构：简洁与可移植性 {#docker-based-architecture-for-simplicity-and-portability}

我们使用 Docker 打包了整个电子邮件基础设施，使其能够轻松部署在几乎任何基于 Linux 的系统上。这种容器化方法带来了几个关键优势：

1. **简化部署**：一条命令即可搭建整个基础设施
2. **环境一致性**：消除“在我机器上能用”的问题
3. **组件隔离**：每个服务运行在独立容器中，保障安全
4. **轻松更新**：简单命令即可更新整个堆栈
5. **依赖最小化**：仅需 Docker 和 Docker Compose

架构包含以下容器：

* 用于管理的 Web 界面
* 用于发信的 SMTP 服务器
* 用于收信的 IMAP/POP3 服务器
* 用于日历的 CalDAV 服务器
* 用于联系人管理的 CardDAV 服务器
* 用于配置存储的数据库
* 用于缓存和性能的 Redis
* 用于安全加密邮箱存储的 SQLite

> \[!NOTE]
> 请务必查看我们的 [自托管开发者指南](https://forwardemail.net/self-hosted)

### Bash 脚本安装：易用与安全兼顾 {#bash-script-installation-accessibility-meets-security}

我们设计了尽可能简单的安装流程，同时遵循安全最佳实践：

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

这条命令将：

1. 验证系统要求
2. 引导您完成配置
3. 设置 DNS 记录
4. 配置 TLS 证书
5. 部署 Docker 容器
6. 执行初步安全加固

对于担心将脚本通过管道传给 bash 的用户（这是合理的！），我们鼓励您在执行前审查脚本。它是完全开源的，供您检查。

### 量子安全加密，保障未来隐私 {#quantum-safe-encryption-for-future-proof-privacy}

与我们的托管服务一样，自托管方案采用量子抗性加密，使用 ChaCha20-Poly1305 作为 SQLite 数据库的加密算法。这种方法不仅保护您的邮件数据免受当前威胁，也防范未来量子计算攻击。

每个邮箱存储在独立加密的 SQLite 数据库文件中，实现用户间完全隔离——这相比传统共享数据库方案具有显著的安全优势。

### 自动维护与更新 {#automated-maintenance-and-updates}

我们在自托管方案中内置了全面的维护工具：

1. **自动备份**：定时备份所有关键数据
2. **证书续期**：自动管理 Let’s Encrypt 证书
3. **系统更新**：简单命令升级到最新版本
4. **健康监测**：内置检查确保系统完整性

这些工具通过一个简单的交互式菜单访问：

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


## 开源承诺 {#the-open-source-commitment}

我们的自托管电子邮件解决方案，和我们所有产品一样，100% 开源——包括前端和后端。这意味着：
1. **完全透明**：处理您电子邮件的每一行代码都可供公众审查  
2. **社区贡献**：任何人都可以贡献改进或修复问题  
3. **通过开放实现安全**：漏洞可以由全球社区识别并修复  
4. **无供应商锁定**：您永远不会依赖于我们公司的存在  

整个代码库可在 GitHub 上获取，地址为 <https://github.com/forwardemail/forwardemail.net>。  


## 自托管 vs. 托管：做出正确选择 {#self-hosted-vs-managed-making-the-right-choice}

虽然我们自豪地提供自托管选项，但我们也认识到这并不适合所有人。自托管电子邮件伴随着真实的责任和挑战：

### 自托管电子邮件的现实 {#the-reality-of-self-hosting-email}

#### 技术考虑 {#technical-considerations}

* **服务器管理**：您需要维护 VPS 或专用服务器  
* **DNS 配置**：正确的 DNS 设置对邮件送达至关重要  
* **安全更新**：保持安全补丁的最新状态非常重要  
* **垃圾邮件管理**：您需要处理垃圾邮件过滤  
* **备份策略**：实施可靠的备份是您的责任  

#### 时间投入 {#time-investment}

* **初始设置**：设置、验证并阅读文档所需时间  
* **持续维护**：偶尔的更新和监控  
* **故障排除**：解决问题所需的偶尔时间  

#### 财务考虑 {#financial-considerations}

* **服务器费用**：基础 VPS 每月 5-20 美元  
* **域名注册**：每年 10-20 美元  
* **时间价值**：您的时间投入具有实际价值  

### 何时选择我们的托管服务 {#when-to-choose-our-managed-service}

对于许多用户来说，我们的托管服务仍然是最佳选择：

1. **便利性**：我们处理所有维护、更新和监控  
2. **可靠性**：受益于我们成熟的基础设施和专业知识  
3. **支持**：出现问题时获得帮助  
4. **送达率**：利用我们建立的 IP 声誉  
5. **成本效益**：考虑时间成本后，我们的服务通常更经济  

两种选项都提供相同的隐私保护和开源透明度——区别仅在于谁来管理基础设施。  


## 开始使用自托管 Forward Email {#getting-started-with-self-hosted-forward-email}

准备好掌控您的电子邮件基础设施了吗？以下是入门指南：

### 系统要求 {#system-requirements}

* Ubuntu 20.04 LTS 或更高版本（推荐）  
* 最少 1GB 内存（推荐 2GB 以上）  
* 推荐 20GB 存储空间  
* 您控制的域名  
* 支持端口 25 的公网 IP 地址  
* 能够设置 [反向 PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)  
* 支持 IPv4 和 IPv6  

> \[!TIP]  
> 我们推荐的多个邮件服务器提供商见 <https://forwardemail.net/blog/docs/best-mail-server-providers>（源代码见 <https://github.com/forwardemail/awesome-mail-server-providers>）  

### 安装步骤 {#installation-steps}

1. **运行安装脚本**：  
   ```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
   ```

2. **按照交互提示操作**：  
   * 输入您的域名  
   * 配置管理员凭据  
   * 按照指示设置 DNS 记录  
   * 选择您偏好的配置选项  

3. **验证安装**：  
   安装完成后，您可以通过以下方式验证一切正常：  
   * 检查容器状态：`docker ps`  
   * 发送测试邮件  
   * 登录 Web 界面  


## 自托管电子邮件的未来 {#the-future-of-self-hosted-email}

我们的自托管解决方案只是开始。我们致力于不断改进此产品，包括：

1. **增强的管理工具**：更强大的基于 Web 的管理功能  
2. **更多认证选项**：包括硬件安全密钥支持  
3. **高级监控**：更好地洞察系统健康和性能  
4. **多服务器部署**：支持高可用性配置选项  
5. **社区驱动的改进**：吸纳用户贡献
## 结论：人人享有电子邮件自由 {#conclusion-email-freedom-for-everyone}

我们自托管电子邮件解决方案的推出，标志着我们在提供注重隐私、透明的电子邮件服务使命上的一个重要里程碑。无论您选择我们的托管服务还是自托管选项，您都将受益于我们对开源原则和隐私优先设计的坚定承诺。

电子邮件太重要了，不能被那些优先收集数据而非保护用户隐私的封闭专有系统所控制。通过 Forward Email 的自托管解决方案，我们自豪地提供了一个真正的替代方案——一个让您完全掌控数字通信的方案。

我们相信隐私不仅仅是一项功能；它是一项基本权利。通过我们的自托管电子邮件选项，我们让这项权利比以往任何时候都更易获得。

准备好掌控您的电子邮件了吗？[立即开始](https://forwardemail.net/self-hosted) 或探索我们的 [GitHub 仓库](https://github.com/forwardemail/forwardemail.net) 了解更多。


## 参考资料 {#references}

\[1] Forward Email GitHub 仓库: <https://github.com/forwardemail/forwardemail.net>

\[2] 自托管文档: <https://forwardemail.net/en/self-hosted>

\[3] 电子邮件隐私技术实现: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] 为什么开源电子邮件很重要: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>
