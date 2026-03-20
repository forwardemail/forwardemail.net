# 使用 Forward Email 完整设置 NAS 邮件指南 {#complete-guide-to-nas-email-setup-with-forward-email}

在您的 NAS 上设置邮件通知不应该是一件麻烦事。无论您使用的是 Synology、QNAP，还是 Raspberry Pi，本指南都将帮助您的设备与 Forward Email 连接，让您真正知道何时出现问题。

大多数 NAS 设备可以发送驱动器故障、温度警告、备份完成和安全事件的邮件提醒。问题是？许多邮件服务提供商对安全要求越来越严格，而旧设备往往跟不上。这就是 Forward Email 的用武之地——我们支持现代和传统设备。

本指南涵盖了 75+ NAS 供应商的邮件设置，提供逐步说明、兼容性信息和故障排除技巧。无论您使用什么设备，我们都能帮您让通知正常工作。


## 目录 {#table-of-contents}

* [为什么您需要 NAS 邮件通知](#why-you-need-nas-email-notifications)
* [TLS 问题（以及我们的解决方案）](#the-tls-problem-and-how-we-fix-it)
* [Forward Email SMTP 设置](#forward-email-smtp-settings)
* [全面的 NAS 供应商兼容性矩阵](#comprehensive-nas-provider-compatibility-matrix)
* [Synology NAS 邮件配置](#synology-nas-email-configuration)
  * [配置步骤](#configuration-steps)
* [QNAP NAS 邮件配置](#qnap-nas-email-configuration)
  * [配置步骤](#configuration-steps-1)
  * [常见 QNAP 故障排除问题](#common-qnap-troubleshooting-issues)
* [ReadyNAS 传统配置](#readynas-legacy-configuration)
  * [传统配置步骤](#legacy-configuration-steps)
  * [ReadyNAS 故障排除](#readynas-troubleshooting)
* [TerraMaster NAS 配置](#terramaster-nas-configuration)
* [ASUSTOR NAS 配置](#asustor-nas-configuration)
* [Buffalo TeraStation 配置](#buffalo-terastation-configuration)
* [Western Digital My Cloud 配置](#western-digital-my-cloud-configuration)
* [TrueNAS 邮件配置](#truenas-email-configuration)
* [OpenMediaVault 配置](#openmediavault-configuration)
* [Raspberry Pi NAS 配置](#raspberry-pi-nas-configuration)
  * [Raspberry Pi 初始设置](#initial-raspberry-pi-setup)
  * [Samba 文件共享配置](#samba-file-sharing-configuration)
  * [FTP 服务器设置](#ftp-server-setup)
  * [邮件通知配置](#email-notification-configuration)
  * [高级 Raspberry Pi NAS 功能](#advanced-raspberry-pi-nas-features)
  * [Raspberry Pi 邮件故障排除](#raspberry-pi-email-troubleshooting)
  * [性能优化](#performance-optimization)
  * [安全注意事项](#security-considerations)


## 为什么您需要 NAS 邮件通知 {#why-you-need-nas-email-notifications}

您的 NAS 监控大量内容——驱动器健康、温度、网络问题、安全事件。没有邮件提醒，问题可能会被忽视数周，可能导致数据丢失或安全漏洞。

邮件通知能在驱动器开始故障时立即提醒您，警告未经授权的访问尝试，确认备份成功，并让您随时了解系统健康状况。Forward Email 确保这些关键通知真正送达您手中。


## TLS 问题（以及我们的解决方案） {#the-tls-problem-and-how-we-fix-it}

情况是这样的：如果您的 NAS 是 2020 年之前制造的，它很可能只支持 TLS 1.0。Gmail、Outlook 以及大多数服务提供商多年前就停止支持该协议。您的设备尝试发送邮件时被拒绝，您却一无所知。

Forward Email 通过双端口支持解决了这个问题。现代设备使用我们的标准端口（`465` 和 `587`），而旧设备可以使用我们的传统端口（`2455` 和 `2555`），这些端口仍支持 TLS 1.0。

> \[!IMPORTANT]
> Forward Email 通过双端口策略支持现代和传统 NAS 设备。现代设备请使用支持 TLS 1.2+ 的端口 465/587，传统设备请使用仅支持 TLS 1.0 的端口 2455/2555。


## Forward Email SMTP 设置 {#forward-email-smtp-settings}
以下是您需要了解的 SMTP 设置：

**对于现代 NAS 设备（2020 年及以后）：** 使用 `smtp.forwardemail.net`，端口为 `465`（SSL/TLS）或 `587`（STARTTLS）。这些端口适用于支持 TLS 1.2+ 的当前固件。

**对于较旧的 NAS 设备：** 使用 `smtp.forwardemail.net`，端口为 `2455`（SSL/TLS）或 `2555`（STARTTLS）。这些端口支持 TLS 1.0，适用于旧设备。

**身份验证：** 使用您的 Forward Email 别名作为用户名，密码使用从 [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains) 生成的密码（不是您的账户密码）。

> \[!CAUTION]
> 切勿使用您的账户登录密码进行 SMTP 身份验证。配置 NAS 时，请始终使用从 [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains) 生成的密码。

> \[!TIP]
> 配置前请检查您的 NAS 设备固件版本及 TLS 支持情况。大多数 2020 年以后生产的设备支持现代 TLS 协议，而较旧设备通常需要使用兼容旧版的端口。


## 综合 NAS 供应商兼容性矩阵 {#comprehensive-nas-provider-compatibility-matrix}

下表提供了主要 NAS 供应商的详细兼容性信息，包括 TLS 支持级别、固件状态及推荐的 Forward Email 配置设置。

| NAS 供应商       | 当前型号        | TLS 支持     | 固件状态        | 推荐端口          | 常见问题                                                                                                                                               | 设置指南/截图                                                                                                                                    |
| ---------------- | --------------- | ------------ | --------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Synology         | DSM 7.x         | TLS 1.2+     | 活跃            | `465`, `587`      | [STARTTLS 配置](https://community.synology.com/enu/forum/2/post/124584)                                                                               | [DSM 邮件通知设置](https://kb.synology.com/en-af/DSM/help/DSM/AdminCenter/system_notification_email)                                            |
| QNAP             | QTS 5.x         | TLS 1.2+     | 活跃            | `465`, `587`      | [通知中心失败](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525)               | [QTS 邮件服务器配置](https://docs.qnap.com/operating-system/qts/5.1.x/en-us/configuring-an-email-notification-server-EB4E6D7F.html)               |
| Raspberry Pi     | Raspberry Pi OS | TLS 1.2+     | 活跃            | `465`, `587`      | [DNS 解析问题](https://www.raspberrypi.org/forums/viewtopic.php?t=294014)                                                                             | [Raspberry Pi 邮件设置指南](#raspberry-pi-nas-configuration)                                                                                     |
| ASUSTOR          | ADM 4.x         | TLS 1.2+     | 活跃            | `465`, `587`      | [证书验证](https://forum.asustor.com/viewtopic.php?f=134&t=12345)                                                                                    | [ASUSTOR 通知设置](https://www.asustor.com/en/online/online_help?id=8)                                                                           |
| TerraMaster      | TOS 6.x         | TLS 1.2      | 活跃            | `465`, `587`      | [SMTP 身份验证](https://www.terra-master.com/global/forum/)                                                                                          | [TerraMaster 邮件配置](https://www.terra-master.com/global/support/download.php)                                                                 |
| TrueNAS          | SCALE/CORE      | TLS 1.2+     | 活跃            | `465`, `587`      | [SSL 证书设置](https://www.truenas.com/community/threads/email-notifications-not-working.95234/)                                                    | [TrueNAS 邮件设置指南](https://www.truenas.com/docs/scale/scaletutorials/systemsettings/general/settingupsystememail/)                           |
| Buffalo          | TeraStation     | TLS 1.2      | 有限            | `465`, `587`      | [固件兼容性](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation)                    | [TeraStation 邮件设置](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation)       |
| Western Digital  | My Cloud OS 5   | TLS 1.2      | 有限            | `465`, `587`      | [旧版操作系统兼容性](https://community.wd.com/t/my-cloud-email-notifications-not-working/265432)                                                    | [My Cloud 邮件配置](https://support-en.wd.com/app/answers/detailweb/a_id/10222)                                                                  |
| OpenMediaVault   | OMV 7.x         | TLS 1.2+     | 活跃            | `465`, `587`      | [插件依赖](https://forum.openmediavault.org/index.php?thread/42156-email-notifications-not-working/)                                                | [OMV 通知设置](https://docs.openmediavault.org/en/latest/administration/general/notifications.html)                                              |
| Netgear ReadyNAS | OS 6.x          | 仅 TLS 1.0   | 已停产          | `2455`, `2555`    | [旧版 TLS 支持](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)                              | [ReadyNAS 邮件警报设置](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)                   |
| Drobo            | Dashboard       | TLS 1.2      | 已停产          | `465`, `587`      | [支持有限](https://myprojects.drobo.com/support/)                                                                                                   | [Drobo 邮件通知](https://www.drobo.com/support/)                                                                                                |
此矩阵展示了现代、积极维护的 NAS 系统与需要特殊兼容性考虑的传统设备之间的明确区分。大多数当前的 NAS 设备支持现代 TLS 标准，并且可以在无需特殊配置的情况下使用 Forward Email 的主要 SMTP 端口。


## Synology NAS 邮件配置 {#synology-nas-email-configuration}

带有 DSM 的 Synology 设备设置相当简单。它们支持现代 TLS，因此您可以无忧使用我们的标准端口。

> \[!NOTE]
> Synology DSM 7.x 提供了最全面的邮件通知功能。较旧的 DSM 版本可能配置选项有限。

### 配置步骤 {#configuration-steps}

1. **通过在浏览器中输入 NAS 设备的 IP 地址或 QuickConnect ID 访问 DSM 网页界面。**

2. **导航到控制面板**，选择“通知”部分，然后点击“电子邮件”标签以访问邮件配置选项。

3. **启用邮件通知**，勾选“启用邮件通知”复选框。

4. **配置 SMTP 服务器**，输入 `smtp.forwardemail.net` 作为服务器地址。

5. **设置端口配置**，推荐使用端口 465 进行 SSL/TLS 连接。端口 587 及 STARTTLS 也作为备选支持。

6. **配置身份验证**，选择“需要 SMTP 身份验证”，并在用户名字段中输入您的 Forward Email 别名。

7. **输入密码**，使用从 [我的账户 -> 域名 -> 别名](https://forwardemail.net/my-account/domains) 生成的密码。

8. **设置收件人地址**，输入最多五个应接收通知的电子邮件地址。

9. **配置通知过滤**，控制哪些事件触发邮件提醒，防止通知过载，同时确保关键事件被报告。

10. **使用 DSM 内置测试功能测试配置**，验证所有设置正确且与 Forward Email 服务器的通信正常。

> \[!TIP]
> Synology 允许为不同收件人设置不同的通知类型，灵活分配团队内的警报。


## QNAP NAS 邮件配置 {#qnap-nas-email-configuration}

带有 QTS 的 QNAP 设备与 Forward Email 配合良好。它们支持现代 TLS，并且拥有便捷的网页配置界面。

> \[!IMPORTANT]
> QNAP QTS 5.2.4 存在邮件通知的已知问题，已在 [QTS 5.2.5 中修复](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525)。请确保固件已更新以避免通知失败。

### 配置步骤 {#configuration-steps-1}

1. **通过在浏览器中输入 QNAP 设备的 IP 地址访问其网页界面。**

2. **导航到控制面板**，选择“服务账户与设备配对”，然后点击“电子邮件”部分开始邮件配置。

3. **点击“添加 SMTP 服务”** 创建新的邮件配置。

4. **配置 SMTP 服务器**，输入 `smtp.forwardemail.net` 作为 SMTP 服务器地址。

5. **选择合适的安全协议** — 选择“SSL/TLS”并使用端口 `465`（推荐）。端口 `587` 及 STARTTLS 也支持。

6. **配置端口号** — 推荐使用端口 `465` 的 SSL/TLS。若需要，也可使用端口 `587` 的 STARTTLS。

7. **输入身份验证凭据**，用户名使用您的 Forward Email 别名，密码使用从 [我的账户 -> 域名 -> 别名](https://forwardemail.net/my-account/domains) 生成的密码。

8. **配置发件人信息**，在“发件人”字段输入描述性名称，如“QNAP NAS 系统”或设备主机名。

9. **设置不同通知类型的收件人地址**。QNAP 允许为不同警报类型配置多个收件人组。

10. **使用 QNAP 内置邮件测试功能测试配置**，验证所有设置正常工作。

> \[!TIP]
> 如果遇到 [Gmail SMTP 配置问题](https://forum.qnap.com/viewtopic.php?t=152466)，同样的故障排除步骤适用于 Forward Email。确保身份验证已正确启用且凭据无误。
> \[!NOTE]
> QNAP 设备支持高级通知调度，允许您配置静默时间段，在此期间非关键通知将被抑制。这在商业环境中特别有用。

### 常见 QNAP 故障排除问题 {#common-qnap-troubleshooting-issues}

如果您的 QNAP 设备[无法发送通知邮件](https://www.reddit.com/r/qnap/comments/1dc6z03/qnap_nas_will_not_send_notification_emails/)，请检查以下内容：

* 验证您的 Forward Email 凭据是否正确
* 确保 SMTP 服务器地址准确为 `smtp.forwardemail.net`
* 确认端口与您的加密方式匹配（推荐使用 SSL/TLS 的 `465` 端口；也支持 STARTTLS 的 `587` 端口）
* 检查您的[SMTP 服务器配置](https://www.qnap.com/en/how-to/faq/article/why-does-notification-center-fail-to-send-emails-to-my-smtp-server)是否允许连接


## ReadyNAS 旧版配置 {#readynas-legacy-configuration}

Netgear ReadyNAS 设备由于其固件已停止支持且依赖旧版 TLS 1.0 协议，存在独特的挑战。然而，Forward Email 的旧版端口支持确保这些设备能够继续可靠地发送邮件通知。

> \[!CAUTION]
> ReadyNAS OS 6.x 仅支持 TLS 1.0，这需要使用 Forward Email 的旧版兼容端口 `2455` 和 `2555`。现代端口 `465` 和 `587` 无法与这些设备配合使用。

### 旧版配置步骤 {#legacy-configuration-steps}

1. **通过在浏览器中输入设备的 IP 地址访问 ReadyNAS 网页界面。**

2. **导航至系统 > 设置 > 警报，进入邮件配置部分。**

3. **配置 SMTP 服务器，输入 `smtp.forwardemail.net` 作为服务器地址。**

4. **设置端口配置，选择 `2455` 用于 SSL/TLS 连接，或 `2555` 用于 STARTTLS 连接——这些是 Forward Email 的旧版兼容端口。**

5. **启用身份验证，输入您的 Forward Email 别名作为用户名，以及您在 [我的账户 -> 域名 -> 别名](https://forwardemail.net/my-account/domains) 生成的密码。**

6. **配置发件人信息，使用描述性的“发件人”地址以识别 ReadyNAS 设备。**

7. **使用邮件联系人部分的 + 按钮添加收件人邮箱地址。**

8. **测试配置，确保旧版 TLS 连接正常工作。**

> \[!IMPORTANT]
> ReadyNAS 设备需要使用旧版端口，因为它们无法使用现代 TLS 协议建立安全连接。这是已停止支持的固件的[已知限制](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)。

### ReadyNAS 故障排除 {#readynas-troubleshooting}

ReadyNAS 邮件配置的常见问题包括：

* **TLS 版本不匹配**：确保使用端口 `2455` 或 `2555`，而非现代端口
* **身份验证失败**：验证您的 Forward Email 凭据是否正确
* **网络连接问题**：检查 ReadyNAS 是否能访问 `smtp.forwardemail.net`
* **固件限制**：某些较旧的 ReadyNAS 型号可能有额外的[HTTPS 配置要求](https://kb.netgear.com/23100/How-do-I-configure-HTTPS-HTTP-with-SSL-encryption-settings-on-my-ReadyNAS-OS-6-storage-system)

运行 OS 6.x 及更早版本的 ReadyNAS 设备仅支持 TLS 1.0 连接，而大多数现代邮件服务提供商已不再接受此协议。Forward Email 专用的旧版端口（2455 和 2555）专门支持这些旧协议，确保 ReadyNAS 用户的持续功能。

要在 ReadyNAS 设备上配置邮件，请通过其 IP 地址访问设备的网页界面。导航至系统部分，选择“通知”以进入邮件配置选项。

在邮件配置部分，启用邮件通知并输入 smtp.forwardemail.net 作为 SMTP 服务器。这一点至关重要——请使用 Forward Email 的旧版兼容端口，而非标准 SMTP 端口。

对于 SSL/TLS 连接，配置端口为 2455，而非标准的 465（推荐）。对于 STARTTLS 连接，使用端口 2555，而非 587。这些特殊端口保持了 TLS 1.0 的兼容性，同时为旧设备提供了最佳可用的安全性。
输入您的 Forward Email 别名作为用户名，以及您生成的密码进行身份验证。ReadyNAS 设备支持 SMTP 身份验证，这是 Forward Email 连接所必需的。

根据您的通知需求配置发件人邮箱地址和收件人地址。ReadyNAS 允许多个收件人地址，使您能够将警报分发给不同的团队成员或邮箱账户。

请仔细测试配置，因为 ReadyNAS 设备在配置失败时可能不会提供详细的错误信息。如果标准测试无效，请确认您使用的是正确的旧版端口（2455 或 2555），而非现代 SMTP 端口。

请考虑使用旧版 TLS 协议的安全影响。虽然 Forward Email 的旧版端口为较旧设备提供了最佳可用安全性，但建议在可能的情况下升级到支持当前 TLS 的现代 NAS 系统。


## TerraMaster NAS 配置 {#terramaster-nas-configuration}

运行 TOS 6.x 的 TerraMaster 设备支持现代 TLS，并且与 Forward Email 的标准端口兼容良好。

> \[!NOTE]
> TerraMaster TOS 6.x 提供全面的邮件通知功能。请确保您的固件是最新版本，以获得最佳兼容性。

1. **访问系统设置**
   * 登录您的 TerraMaster 网页界面
   * 导航至 **控制面板** > **通知**

2. **配置 SMTP 设置**
   * 服务器：`smtp.forwardemail.net`
   * 端口：`465`（SSL/TLS，推荐）或 `587`（STARTTLS）
   * 用户名：您的 Forward Email 别名
   * 密码：从 [我的账户 -> 域名 -> 别名](https://forwardemail.net/my-account/domains) 生成的密码

3. **启用通知**
   * 勾选您希望接收的通知类型
   * 使用内置测试功能测试配置

> \[!TIP]
> TerraMaster 设备使用端口 `465` 进行 SSL/TLS 连接效果最佳（推荐）。如果遇到问题，也支持使用端口 `587` 的 STARTTLS。


## ASUSTOR NAS 配置 {#asustor-nas-configuration}

搭载 ADM 4.x 的 ASUSTOR 设备具备完善的邮件通知支持，并能与 Forward Email 无缝配合。

> \[!NOTE]
> ASUSTOR ADM 4.x 包含高级通知过滤选项。您可以自定义哪些事件触发邮件提醒。

1. **打开通知设置**
   * 访问 ADM 网页界面
   * 进入 **设置** > **通知**

2. **设置 SMTP 配置**
   * SMTP 服务器：`smtp.forwardemail.net`
   * 端口：`465`（SSL/TLS，推荐）或 `587`（STARTTLS）
   * 认证：启用
   * 用户名：您的 Forward Email 别名
   * 密码：从 [我的账户 -> 域名 -> 别名](https://forwardemail.net/my-account/domains) 生成的密码

3. **配置警报类型**
   * 选择哪些系统事件应触发邮件
   * 设置收件人地址
   * 测试配置

> \[!IMPORTANT]
> ASUSTOR 设备要求在 SMTP 设置中明确启用身份验证。请务必勾选此选项。


## Buffalo TeraStation 配置 {#buffalo-terastation-configuration}

Buffalo TeraStation 设备的邮件通知功能有限但可用。了解配置位置后，设置过程相对简单。

> \[!CAUTION]
> Buffalo TeraStation 固件更新不频繁。配置邮件前，请确保您使用的是该型号的最新固件。

1. **访问网页配置**
   * 连接到您的 TeraStation 网页界面
   * 导航至 **系统** > **通知**

2. **配置邮件设置**
   * SMTP 服务器：`smtp.forwardemail.net`
   * 端口：`465`（SSL/TLS，推荐）或 `587`（STARTTLS）
   * 用户名：您的 Forward Email 别名
   * 密码：从 [我的账户 -> 域名 -> 别名](https://forwardemail.net/my-account/domains) 生成的密码
   * 启用 SSL/TLS 加密

3. **设置通知偏好**
   * 选择触发邮件的事件（磁盘错误、温度警报等）
   * 输入收件人邮箱地址
   * 保存并测试配置

> \[!NOTE]
> 某些较旧的 TeraStation 型号可能具有有限的 SMTP 配置选项。请查阅您型号的文档以了解具体功能。
## Western Digital My Cloud 配置 {#western-digital-my-cloud-configuration}

运行 OS 5 的 Western Digital My Cloud 设备支持电子邮件通知，尽管该界面在设置中可能有些隐藏。

> \[!WARNING]
> Western Digital 已停止支持许多 My Cloud 型号。在依赖电子邮件通知关键警报之前，请检查您的设备是否仍然接收固件更新。

1. **导航到设置**
   * 打开 My Cloud 网络仪表盘
   * 进入 **Settings** > **General** > **Notifications**

2. **配置 SMTP 详情**
   * 邮件服务器：`smtp.forwardemail.net`
   * 端口：`465`（SSL/TLS，推荐）或 `587`（STARTTLS）
   * 用户名：您的 Forward Email 别名
   * 密码：从 [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains) 生成的密码
   * 启用加密

3. **设置警报类型**
   * 选择通知类别（系统警报、磁盘健康等）
   * 添加收件人电子邮件地址
   * 测试电子邮件配置

> \[!TIP]
> 我们推荐使用端口 `465` 和 SSL/TLS。如果遇到问题，也支持使用端口 `587` 和 STARTTLS。


## TrueNAS 电子邮件配置 {#truenas-email-configuration}

TrueNAS（包括 SCALE 和 CORE）具有出色的电子邮件通知支持和详细的配置选项。

> \[!NOTE]
> TrueNAS 提供了 NAS 系统中最全面的电子邮件通知功能之一。您可以配置详细的警报规则和多个收件人。

1. **访问系统设置**
   * 登录 TrueNAS 网络界面
   * 导航至 **System** > **Email**

2. **配置 SMTP 设置**
   * 发件服务器：`smtp.forwardemail.net`
   * 邮件服务器端口：`465`（推荐）或 `587`
   * 安全性：SSL/TLS（465 推荐）或 STARTTLS（587）
   * 用户名：您的 Forward Email 别名
   * 密码：从 [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains) 生成的密码

3. **设置警报**
   * 进入 **System** > **Alert Services**
   * 配置哪些警报应通过电子邮件发送
   * 设置收件人地址和警报级别
   * 使用内置测试功能测试配置

> \[!IMPORTANT]
> TrueNAS 允许您配置不同的警报级别（INFO、NOTICE、WARNING、ERROR、CRITICAL）。请选择合适的级别以避免邮件垃圾，同时确保关键问题得到报告。


## OpenMediaVault 配置 {#openmediavault-configuration}

OpenMediaVault 通过其网络界面提供了稳健的电子邮件通知功能。设置过程简洁明了。

> \[!NOTE]
> OpenMediaVault 的通知系统基于插件。请确保已安装并启用电子邮件通知插件。

1. **访问通知设置**
   * 打开 OpenMediaVault 网络界面
   * 进入 **System** > **Notification** > **Email**

2. **配置 SMTP 参数**
   * SMTP 服务器：`smtp.forwardemail.net`
   * 端口：`465`（SSL/TLS，推荐）或 `587`（STARTTLS）
   * 用户名：您的 Forward Email 别名
   * 密码：从 [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains) 生成的密码
   * 启用 SSL/TLS

3. **设置通知规则**
   * 导航至 **System** > **Notification** > **Notifications**
   * 配置哪些系统事件应触发电子邮件
   * 设置收件人地址
   * 测试电子邮件功能

> \[!TIP]
> OpenMediaVault 允许您配置通知时间表。您可以设置静音时间或限制通知频率，以避免被警报淹没。


## Raspberry Pi NAS 配置 {#raspberry-pi-nas-configuration}

Raspberry Pi 是进入 NAS 功能的极佳入门选择，为家庭和小型办公环境提供了经济实惠的解决方案。将 Raspberry Pi 设置为 NAS 设备涉及配置文件共享协议、电子邮件通知和基本网络服务。

> \[!TIP]
> 对于 Raspberry Pi 爱好者，我们强烈推荐配合使用 [PiKVM](https://pikvm.org/) 进行远程服务器管理，以及 [Pi-hole](https://pi-hole.net/) 实现全网广告拦截和 DNS 管理。这些工具共同打造了一个全面的家庭实验室环境。
### 初始 Raspberry Pi 设置 {#initial-raspberry-pi-setup}

在配置 NAS 服务之前，确保您的 Raspberry Pi 运行的是最新的 Raspberry Pi OS，并且具有足够的存储空间。高质量的 microSD 卡（Class 10 或更高）或 USB 3.0 SSD 可为 NAS 操作提供更好的性能和可靠性。

1. **更新系统**，运行 `sudo apt update && sudo apt upgrade -y` 以确保所有软件包都是最新的。

2. **启用 SSH 访问**，使用 `sudo systemctl enable ssh && sudo systemctl start ssh` 进行远程管理。

3. **配置静态 IP 地址**，通过编辑 `/etc/dhcpcd.conf` 以确保网络访问的一致性。

4. **设置外部存储**，连接并挂载 USB 驱动器或配置 RAID 阵列以实现数据冗余。

### Samba 文件共享配置 {#samba-file-sharing-configuration}

Samba 提供与 Windows 兼容的文件共享，使您的 Raspberry Pi 可从网络上的任何设备访问。配置过程包括安装 Samba、创建共享和设置用户认证。

使用 `sudo apt install samba samba-common-bin` 安装 Samba，并配置主配置文件 `/etc/samba/smb.conf`。使用 `sudo mkdir -p /srv/samba/shared && sudo chmod 755 /srv/samba/shared` 创建共享目录并设置适当的权限。

通过在配置文件中为每个共享目录添加部分来配置 Samba 共享。使用 `sudo smbpasswd -a username` 设置用户认证，为网络访问创建 Samba 专用密码。

> \[!IMPORTANT]
> 始终为 Samba 用户使用强密码，并考虑仅对非敏感共享文件夹启用访客访问。请查阅 [官方 Samba 文档](https://www.samba.org/samba/docs/current/man-html/smb.conf.5.html) 以获取高级安全配置。

### FTP 服务器设置 {#ftp-server-setup}

FTP 提供另一种文件访问方式，特别适用于自动备份和远程文件管理。安装并配置 vsftpd（非常安全的 FTP 守护进程）以获得可靠的 FTP 服务。

使用 `sudo apt install vsftpd` 安装 vsftpd，并通过编辑 `/etc/vsftpd.conf` 配置服务。启用本地用户访问，配置被动模式设置，并设置适当的安全限制。

创建 FTP 用户并配置目录访问权限。考虑使用 SFTP（SSH 文件传输协议）替代传统 FTP，以增强安全性，因为它加密所有数据传输。

> \[!CAUTION]
> 传统 FTP 以明文传输密码。始终使用 SFTP 或配置带有 TLS 加密的 FTP 以确保文件传输安全。部署前请查阅 [vsftpd 安全最佳实践](https://security.appspot.com/vsftpd.html)。

### 邮件通知配置 {#email-notification-configuration}

配置您的 Raspberry Pi NAS 以发送系统事件、存储警报和备份完成状态的邮件通知。这涉及安装和配置邮件传输代理以及设置 Forward Email 集成。

使用 `sudo apt install msmtp msmtp-mta` 安装轻量级 SMTP 客户端 `msmtp`。在 `/etc/msmtprc` 创建配置文件，内容如下：

```
defaults
auth           on
tls            on
tls_trust_file /etc/ssl/certs/ca-certificates.crt
logfile        /var/log/msmtp.log

account        forwardemail
host           smtp.forwardemail.net
port           465
tls_starttls   off
from           your-alias@yourdomain.com
user           your-alias@yourdomain.com
password       your-generated-password
```

通过设置使用 `msmtp` 发送警报的定时任务和系统监控脚本来配置系统通知。创建磁盘空间监控、温度警报和备份完成通知的脚本。

### 高级 Raspberry Pi NAS 功能 {#advanced-raspberry-pi-nas-features}

通过额外的服务和监控功能增强您的 Raspberry Pi NAS。安装并配置网络监控工具、自动备份解决方案和远程访问服务。

设置 [Nextcloud](https://nextcloud.com/) 实现类似云的功能，支持基于网页的文件访问、日历同步和协作功能。可通过 Docker 或官方 Raspberry Pi Nextcloud 安装指南进行安装。
使用 `rsync` 和 `cron` 配置自动备份，以创建关键数据的定时备份。使用您的 Forward Email 配置设置备份完成和失败警报的电子邮件通知。

使用诸如 [Nagios](https://www.nagios.org/) 或 [Zabbix](https://www.zabbix.com/) 等工具实现网络监控，以监测系统健康状况、网络连接性和服务可用性。

> \[!NOTE]
> 对于管理网络基础设施的用户，考虑将 [Switchbot](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) 与您的 PiKVM 设置集成，实现远程物理开关控制。此 [Python 集成指南](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) 提供了自动化物理设备管理的详细说明。

### Raspberry Pi 邮件故障排除 {#raspberry-pi-email-troubleshooting}

Raspberry Pi 邮件配置的常见问题包括 DNS 解析问题、防火墙限制和身份验证失败。Raspberry Pi 系统的轻量级特性有时会导致 SMTP 连接的时序问题。

如果电子邮件通知失败，请检查 `/var/log/msmtp.log` 中的 `msmtp` 日志文件以获取详细错误信息。确认您的 Forward Email 凭据正确，且 Raspberry Pi 能够解析 `smtp.forwardemail.net`。

使用命令行测试邮件功能：`echo "Test message" | msmtp recipient@example.com`。这有助于将配置问题与特定应用问题区分开。

如果遇到 DNS 解析问题，请在 `/etc/resolv.conf` 中配置正确的 DNS 设置。若本地 DNS 不可靠，可考虑使用公共 DNS 服务器如 `8.8.8.8` 或 `1.1.1.1`。

### 性能优化 {#performance-optimization}

通过合理配置存储、网络设置和系统资源来优化您的 Raspberry Pi NAS 性能。使用高质量存储设备，并根据您的使用场景配置合适的文件系统选项。

如果使用外部驱动器，启用 USB 3.0 启动以提升存储性能。使用 `sudo raspi-config` 配置 GPU 内存分配，将更多 RAM 分配给系统操作而非图形处理。

使用 `htop`、`iotop` 和 `nethogs` 等工具监控系统性能，识别瓶颈并优化资源使用。对于要求较高的 NAS 应用，考虑升级到配备 8GB RAM 的 Raspberry Pi 4。

实施适当的散热方案，防止高强度操作时的热节流。使用 `/opt/vc/bin/vcgencmd measure_temp` 监控 CPU 温度，确保通风良好。

### 安全注意事项 {#security-considerations}

通过实施适当的访问控制、网络安全措施和定期安全更新来保护您的 Raspberry Pi NAS。更改默认密码，禁用不必要的服务，并配置防火墙规则。

安装并配置 `fail2ban`，防止 SSH 和其他服务的暴力破解攻击。使用 `unattended-upgrades` 设置自动安全更新，确保关键安全补丁及时应用。

配置网络分段，在可能的情况下将 NAS 与其他网络设备隔离。远程连接时使用 VPN 访问，而非直接暴露服务到互联网。

定期备份您的 Raspberry Pi 配置和数据，以防止因硬件故障或安全事件导致的数据丢失。测试备份恢复流程，确保具备数据恢复能力。

Raspberry Pi NAS 配置为学习网络存储概念提供了极佳基础，同时为家庭和小型办公环境提供实用功能。与 Forward Email 结合确保系统监控和维护警报的可靠通知传递。
