# 自托管电子邮件：致力于开源 {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="Self-hosted email solution illustration" class="rounded-lg" />

## 目录 {#table-of-contents}

* [前言](#foreword)
* [自托管电子邮件为何如此重要](#why-self-hosted-email-matters)
  * [传统电子邮件服务的问题](#the-problem-with-traditional-email-services)
  * [自托管替代方案](#the-self-hosted-alternative)
* [我们的自托管实施：技术概述](#our-self-hosted-implementation-technical-overview)
  * [基于 Docker 的架构，简单易用](#docker-based-architecture-for-simplicity-and-portability)
  * [Bash 脚本安装：兼具可访问性和安全性](#bash-script-installation-accessibility-meets-security)
  * [量子安全加密，保障未来隐私](#quantum-safe-encryption-for-future-proof-privacy)
  * [自动维护和更新](#automated-maintenance-and-updates)
* [开源承诺](#the-open-source-commitment)
* [自托管与托管：做出正确的选择](#self-hosted-vs-managed-making-the-right-choice)
  * [自托管电子邮件的现实](#the-reality-of-self-hosting-email)
  * [何时选择我们的托管服务](#when-to-choose-our-managed-service)
* [自托管转发电子邮件入门](#getting-started-with-self-hosted-forward-email)
  * [系统要求](#system-requirements)
  * [安装步骤](#installation-steps)
* [自托管电子邮件的未来](#the-future-of-self-hosted-email)
* [结论：人人享有电子邮件自由](#conclusion-email-freedom-for-everyone)
* [参考](#references)

## 前言 {#foreword}

在当今的数字时代，电子邮件仍然是我们在线身份和沟通的支柱。然而，随着隐私问题的日益增长，许多用户面临着一个艰难的选择：以牺牲隐私为代价追求便利，还是以牺牲便利为代价追求隐私。在 Forward Email，我们始终坚信您无需在两者之间做出选择。

今天，我们非常高兴地宣布，我们旅程中的一个重要里程碑：自托管电子邮件解决方案正式上线。此功能体现了我们对开源原则、注重隐私的设计和用户赋能的坚定承诺。通过我们的自托管选项，我们将电子邮件通信的全部控制权直接交到您的手中。

这篇博文探讨了我们的自托管解决方案背后的理念、它的技术实现，以及它对于那些在数字通信中优先考虑隐私和所有权的用户的重要性。

## 自托管电子邮件为何如此重要 {#why-self-hosted-email-matters}

我们的自托管电子邮件解决方案清晰地体现了我们的信念：真正的隐私意味着掌控，而掌控始于开源。对于要求完全掌控自身数字通信的用户来说，自托管已不再是边缘概念，而是一项基本权利。我们很自豪能够秉持这一信念，打造一个完全开放、可验证的平台，让您按照自己的意愿运行。

### 传统电子邮件服务的问题 {#the-problem-with-traditional-email-services}

传统电子邮件服务对注重隐私的用户提出了几个基本挑战：

1. **信任要求**：您必须信任提供商不会访问、分析或共享您的数据
2. **集中控制**：您的访问权限可能随时因任何原因被撤销
3. **监控漏洞**：集中式服务是监控的主要目标
4. **透明度有限**：大多数服务使用专有闭源软件
5. **供应商锁定**：从这些服务迁移可能很困难甚至不可能

即使是“注重隐私”的电子邮件提供商，也常常会因为只开源前端应用程序，而后端系统却保持专有和封闭而存在缺陷。这造成了巨大的信任鸿沟——你被要求相信他们的隐私承诺，却无法验证。

### 自托管替代方案 {#the-self-hosted-alternative}

自托管电子邮件提供了一种完全不同的方法：

1. **完全控制**：您拥有并控制整个电子邮件基础设施
2. **可验证的隐私**：整个系统透明且可审计
3. **无需信任**：您无需将您的通信委托给第三方
4. **自由定制**：根据您的特定需求调整系统
5. **弹性**：无论任何公司做出何种决定，您的服务都将持续有效

正如一位用户所说：“自行托管我的电子邮件就相当于自己种植食物——虽然需要更多的工作，但我确切地知道里面有什么。”

## 我们的自托管实施：技术概述 {#our-self-hosted-implementation-technical-overview}

我们的自托管电子邮件解决方案秉承着我们所有产品的隐私优先原则。让我们探索实现这一目标的技术实现。

### 基于 Docker 的架构，简单易用 {#docker-based-architecture-for-simplicity-and-portability}

我们使用 Docker 打包了整个电子邮件基础架构，使其能够轻松部署到几乎任何基于 Linux 的系统上。这种容器化方法具有以下几个主要优势：

1. **简化部署**：一条命令即可设置整个基础架构
2. **一致的环境**：消除“在我的机器上工作”的问题
3. **隔离组件**：每个服务都在其自己的容器中运行，以确保安全
4. **轻松更新**：只需简单的命令即可更新整个堆栈
5. **最小依赖项**：仅需要 Docker 和 Docker Compose

该架构包括以下容器：

* Web 管理界面
* SMTP 服务器用于发送邮件
* IMAP/POP3 服务器用于邮件检索
* CalDAV 服务器用于日历
* CardDAV 服务器用于联系人
* 数据库用于配置存储
* Redis 用于缓存和性能提升
* SQLite 用于安全加密的邮箱存储

> \[!NOTE]
> 请务必查看我们的 [自托管开发者指南](https://forwardemail.net/self-hosted)

### Bash 脚本安装：可访问性与安全性相结合 {#bash-script-installation-accessibility-meets-security}

我们将安装过程设计得尽可能简单，同时保持最佳安全实践：

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

此单个命令：

1. 验证系统要求
2. 指导您完成配置
3. 设置 DNS 记录
4. 配置 TLS 证书
5. 部署 Docker 容器
6. 执行初始安全强化

对于那些担心将脚本通过管道传输到 Bash 的人（你应该担心！），我们建议在执行脚本之前先检查一下。它是完全开源的，可以供大家查阅。

### 量子安全加密，保障未来隐私 {#quantum-safe-encryption-for-future-proof-privacy}

与我们的托管服务一样，我们的自托管解决方案使用 ChaCha20-Poly1305 作为 SQLite 数据库的密码，实现了抗量子加密。这种方法不仅可以保护您的电子邮件数据免受当前威胁，还可以抵御未来的量子计算攻击。

每个邮箱都存储在其自己的加密 SQLite 数据库文件中，从而实现用户之间的完全隔离 - 这比传统的共享数据库方法具有显著的安全优势。

### 自动维护和更新 {#automated-maintenance-and-updates}

我们在自托管解决方案中直接构建了全面的维护实用程序：

1. **自动备份**：所有关键数据的定期备份
2. **证书续订**：自动管理 Let's Encrypt 证书
3. **系统更新**：简单命令即可更新至最新版本
4. **健康监测**：内置检查，确保系统完整性

可以通过简单的交互式菜单访问这些实用程序：

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

我们的自托管电子邮件解决方案与我们的所有产品一样，前端和后端均 100% 开源。这意味着：

1. **完全透明**：处理您电子邮件的每一行代码都接受公众审查
2. **社区贡献**：任何人都可以贡献改进或修复问题
3. **开放保障安全**：漏洞可由全球社区识别和修复
4. **无供应商锁定**：您永远不会依赖我们公司的存在

整个代码库可在 GitHub 上找到 <https://github.com/forwardemail/forwardemail.net>.

## 自托管与托管：做出正确的选择 {#self-hosted-vs-managed-making-the-right-choice}

虽然我们很荣幸能够提供自托管选项，但我们深知这并非适合所有人。自托管电子邮件服务确实伴随着一些责任和挑战：

### 自托管电子邮件的现实{#the-reality-of-self-hosting-email}

#### 技术考虑因素 {#technical-considerations}

* **服务器管理**：您需要维护 VPS 或专用服务器
* **DNS 配置**：正确的 DNS 设置对于确保邮件送达至关重要
* **安全更新**：及时安装安全补丁至关重要
* **垃圾邮件管理**：您需要处理垃圾邮件过滤
* **备份策略**：实施可靠的备份是您的责任

#### 时间投入 {#time-investment}

* **初始设置**：设置、验证和阅读文档的时间
* **持续维护**：不定期更新和监控
* **故障排除**：不定期解决问题的时间

#### 财务考虑因素 {#financial-considerations}

* **服务器成本**：基础 VPS 每月 5-20 美元
* **域名注册**：每年 10-20 美元
* **时间价值**：您的时间投资具有真正的价值

### 何时选择我们的托管服务 {#when-to-choose-our-managed-service}

对于许多用户来说，我们的托管服务仍然是最佳选择：

1. **便捷**：我们负责所有维护、更新和监控
2. **可靠**：受益于我们完善的基础设施和专业知识
3. **支持**：出现问题时可获得帮助
4. **交付能力**：利用我们成熟的 IP 声誉
5. **成本效益**：考虑到时间成本，我们的服务通常更经济实惠

这两种选择都提供了相同的隐私优势和开源透明度——区别仅仅在于谁来管理基础设施。

## 自托管转发电子邮件入门 {#getting-started-with-self-hosted-forward-email}

准备好掌控你的电子邮件基础设施了吗？以下是如何开始：

### 系统要求 {#system-requirements}

* Ubuntu 20.04 LTS 或更高版本（推荐）
* 最低 1GB 内存（推荐 2GB 以上）
* 推荐 20GB 存储空间
* 您可控制的域名
* 支持 25 端口的公网 IP 地址
* 可设置 [反向 PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* 支持 IPv4 和 IPv6

> \[!TIP]
> 我们推荐几个位于 <https://forwardemail.net/blog/docs/best-mail-server-providers> 的邮件服务器提供商（来源位于 <https://github.com/forwardemail/awesome-mail-server-providers>）

### 安装步骤 {#installation-steps}

1. **运行安装脚本**:
```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
   ```

2. **按照交互式提示操作**：
* 输入您的域名
* 配置管理员凭据
* 按照说明设置 DNS 记录
* 选择您喜欢的配置选项

3. **验证安装**：
安装完成后，您可以通过以下方式验证一切正常：
* 检查容器状态：`docker ps`
* 发送测试邮件
* 登录 Web 界面

## 自托管电子邮件的未来 {#the-future-of-self-hosted-email}

我们的自托管解决方案仅仅是个开始。我们致力于通过以下方式持续改进此产品：

1. **增强的管理工具**：更强大的基于 Web 的管理
2. **额外的身份验证选项**：包含硬件安全密钥支持
3. **高级监控**：更深入地了解系统健康状况和性能
4. **多服务器部署**：高可用性配置选项
5. **社区驱动的改进**：整合用户的贡献

## 结论：人人享有电子邮件自由 {#conclusion-email-freedom-for-everyone}

我们自托管电子邮件解决方案的推出，标志着我们致力于提供注重隐私、透明的电子邮件服务这一使命迈出了重要的一步。无论您选择我们的托管服务还是自托管服务，您都将受益于我们对开源原则和隐私优先设计的坚定承诺。

电子邮件至关重要，不应被那些优先收集数据、却忽视用户隐私的封闭式专有系统所控制。Forward Email 的自托管解决方案，我们很荣幸能为您提供一个真正的替代方案——让您完全掌控自己的数字通信。

我们相信隐私不仅仅是一项功能，更是一项基本权利。有了我们的自托管电子邮件选项，我们让这项权利比以往任何时候都更容易被享有。

准备好掌控您的电子邮件了吗？[立即开始](https://forwardemail.net/self-hosted) 或浏览我们的 [GitHub 存储库](https://github.com/forwardemail/forwardemail.net) 以了解更多信息。

## 参考文献 {#references}

\[1] 转发电子邮件 GitHub 存储库：<https://github.com/forwardemail/forwardemail.net>

\[2] 自托管文档：<https://forwardemail.net/en/self-hosted>

\[3] 电子邮件隐私技术实施：<https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] 开源电子邮件为何重要：<https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>