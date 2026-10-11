# Forward Email 网页邮件指南 {#forward-email-webmail-guide}

<p class="lead mt-3">
  <strong>摘要：</strong><a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">网页邮件</a>是您阅读和发送邮件的地方。<a href="/my-account/domains">网页控制面板</a>是您设置域名、别名和密码的地方。您使用别名地址和在控制面板中生成的密码登录网页邮件。网页邮件免费且<a href="/faq#do-you-offer-a-webmail-client">开源</a>，同一个应用可在浏览器、桌面、移动设备和终端中运行。
</p>


## 目录 {#table-of-contents}

* [在哪里获取网页邮件](#where-to-get-webmail)
* [网页邮件与网页控制面板](#webmail-and-the-web-dashboard)
* [登录](#signing-in)
  * [生成别名密码](#generate-an-alias-password)
  * [登录网页邮件](#sign-in-to-webmail)
* [使用多个账户](#using-more-than-one-account)
  * [以另一个已登录账户发送](#send-as-another-signed-in-account)
* [从您域名上的任意地址发送](#send-from-any-address-on-your-domain)
  * [第 1 步：在控制面板中生成通配密码](#step-1-generate-a-catch-all-password-in-the-dashboard)
  * [第 2 步：在网页邮件中保存](#step-2-save-it-in-webmail)
  * [第 3 步：撰写时选择地址](#step-3-pick-the-address-when-you-compose)
  * [关于通配发送需要了解的事项](#what-to-know-about-catch-all-sending)
* [网页邮件设置一览](#webmail-settings-at-a-glance)
* [隐私与 App Lock](#privacy-and-app-lock)
* [故障排除](#troubleshooting)


## 在哪里获取网页邮件 {#where-to-get-webmail}

| 平台                          | 获取位置                                                                                                          |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| 浏览器                        | <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a>（无需安装） |
| 桌面（macOS、Windows、Linux） | 我们的<a href="/download">下载页面</a>                                                                            |
| 移动设备（Android、iOS）      | 我们的<a href="/download">下载页面</a>                                                                            |
| 终端                          | `forwardemail` 命令。请参阅[你们有终端应用吗](/faq#do-you-have-a-terminal-app)                                    |

它们都基于同一个开源项目构建，因此本指南的所有内容适用于每一个版本。设置和已保存的密码保存在各自的设备上，因此请在您使用的每台设备上分别设置。


## 网页邮件与网页控制面板 {#webmail-and-the-web-dashboard}

Forward Email 有两个独立的登录入口，它们使用不同的凭据：

|                    | 网页控制面板（forwardemail.net）                                                | 网页邮件（mail.forwardemail.net 及各应用）                         |
| ------------------ | ------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **登录方式**       | 您的 Forward Email 账户邮箱和密码（外加 2FA 或通行密钥）                        | 一个别名地址（如 `you@example.com`）及为其生成的密码               |
| **用途**           | 添加域名、DNS、别名、账单、团队成员、生成密码、高级设置                         | 阅读和发送邮件、文件夹、标签、搜索、日历、联系人、过滤器           |
| **在此生成的密码** | 别名密码和通配密码                                                              | 无。网页邮件使用您在控制面板中生成的密码                           |

常见的设置流程如下：

1. 在控制面板中添加您的域名并设置 DNS。
2. 创建一个开启 IMAP 存储的别名（例如 `you@example.com`）。
3. 为该别名生成密码。
4. 使用该别名和密码登录网页邮件。

要发送邮件，您的域名还需要在 <a href="/my-account/domains">我的账户 <i class="fa fa-angle-right"></i> 域名</a> <i class="fa fa-angle-right"></i> 高级设置 <i class="fa fa-angle-right"></i> 出站 SMTP 配置 中开启出站 SMTP，这与其他任何邮件客户端相同。


## 登录 {#signing-in}

### 生成别名密码 {#generate-an-alias-password}

1. 前往 <a href="/my-account/domains">我的账户 <i class="fa fa-angle-right"></i> 域名</a> <i class="fa fa-angle-right"></i> 别名。
2. 在别名旁边点击 **生成密码**。
3. 复制密码。密码只显示一次。

这与您用于 IMAP、POP3、SMTP、CalDAV 和 CardDAV 的密码相同。它不能用于登录网页控制面板。

### 登录网页邮件 {#sign-in-to-webmail}

打开网页邮件，输入完整的别名地址和生成的密码。如果您只想先随便看看，可以在登录界面试用演示。


## 使用多个账户 {#using-more-than-one-account}

您可以同时登录多个别名，即使它们位于不同的域名。通过账户菜单在它们之间切换，并在 **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Your accounts** 中管理。账户保存在您添加它们的设备上，不会同步。

### 以另一个已登录账户发送 {#send-as-another-signed-in-account}

撰写邮件时，**From** 菜单会列出此设备上所有已登录的账户。选择其中一个即可以该地址发送。邮件会使用该账户自己的密码发送，副本会存入该账户的“已发送”文件夹。


## 从您域名上的任意地址发送 {#send-from-any-address-on-your-domain}

如果您拥有一个域名，就可以从该域名上的任意地址发送邮件，例如 `billing@example.com` 或 `no-reply@example.com`，而无需为每个地址创建别名并登录。这是通过该域名的 **通配（catch-all）密码** 实现的。

您 **不需要** 以通配符或 catch-all 账户登录网页邮件，也没有需要开启的功能。您只需在网页邮件设置中保存一次通配密码，之后 From 菜单就允许您输入该域名上的任意地址。

### 第 1 步：在控制面板中生成通配密码 {#step-1-generate-a-catch-all-password-in-the-dashboard}

1. 前往 <a href="/my-account/domains">我的账户 <i class="fa fa-angle-right"></i> 域名</a> 并选择您的域名。
2. 打开 **高级设置**，找到 **捕获所有密码**。
3. 点击 **生成密码**。将输入框留空即可获得一个强随机密码，也可以按需添加描述（例如“我笔记本电脑上的网页邮件”）。
4. 复制密码。密码只显示一次。

您需要是该域名的管理员才能看到此部分。之后可以在同一位置使用 **管理密码** 查看或删除通配密码。删除某个密码后，它在所有保存过的地方都会失效。

### 第 2 步：在网页邮件中保存 {#step-2-save-it-in-webmail}

1. 在网页邮件中，打开 **Settings <i class="fa fa-angle-right"></i> General**。
2. 在 **Your accounts** 正下方找到名为 **Send from any address** 的卡片。
3. 点击 **Add catch-all password**。
4. 输入域名（例如 `example.com`）并粘贴通配密码。
5. 点击 **Save**。您会看到“You can now send from any address @example.com”。

您可以为任意数量的域名保存密码。要删除某个密码，点击它旁边的垃圾桶图标。

### 第 3 步：撰写时选择地址 {#step-3-pick-the-address-when-you-compose}

1. 新建一封邮件。
2. 打开 **From** 菜单。在已登录账户的下方，每个已保存的域名都有一个条目：**Other address @example.com…**
3. 选择它。From 一栏会变成一个文本框，后面带有 `@example.com`。
4. 输入 @ 前面的部分（例如 `billing`）并发送。

草稿会保留您输入的地址，因此已保存的草稿重新打开时仍是同一个 From 地址。

### 关于通配发送需要了解的事项 {#what-to-know-about-catch-all-sending}

* **只能发送。** 通配密码只能用于发送。它无法打开邮箱，因此您不能用它阅读 `billing@example.com` 的邮件。要阅读回复，请为该地址创建一个别名（或一个转发给您的 catch-all 别名）。
* **已发送副本会存入您正在使用的账户。** 以 `billing@example.com` 发送的邮件会存入您撰写时所用账户的“已发送”文件夹。
* **设备上的每个账户都可以使用。** 已保存的密码不绑定某一个已登录账户。该设备上的任何账户都可以使用它。
* **只保存在此设备上。** 密码只存储在您保存它的设备上。它不会同步，二维码设备配对也不会复制它。请在每台设备上重新添加。
* **App Lock 会保护它。** 如果开启了 App Lock，密码会与您的其他本地数据一起加密，并且在 App Lock 锁定期间 **Other address** 条目会被隐藏。
* **不支持定时发送**：使用通配密码发送的地址无法定时发送，因为该密码无法读取或取消已定时的邮件。请立即发送，或以已登录账户发送。
* **密码错误不会让您退出登录。** 如果通配密码错误或已在控制面板中删除，发送会失败并显示错误，您仍保持登录状态。


## 网页邮件设置一览 {#webmail-settings-at-a-glance}

| 部分                   | 包含内容                                             |
| ---------------------- | ---------------------------------------------------- |
| **General**            | 您的账户、从任意地址发送（通配密码）、通知、存储     |
| **Appearance**         | 主题、布局、密度、撰写默认设置、签名、字体、外部链接 |
| **Privacy & Security** | App Lock、PGP 加密、隐私选项、垃圾邮件举报           |
| **Folders & Labels**   | 特殊文件夹、您的文件夹、标签                         |
| **Filters**            | 已登录别名的邮件过滤器                               |
| **Calendar**           | 每周起始日和任务                                     |
| **Search**             | 搜索索引、索引健康状况、已保存的搜索、搜索运算符     |
| **Advanced**           | 邮箱存储、本地缓存和重置应用                         |
| **Keyboard Shortcuts** | 所有快捷键                                           |
| **About & Help**       | 版本、桌面应用下载、反馈和链接                       |

属于域名或别名本身的内容，如 DNS、转发收件人、存储限制、休假自动回复、通配密码和垃圾邮件扫描，都在<a href="/my-account/domains">网页控制面板</a>中设置。


## 隐私与 App Lock {#privacy-and-app-lock}

网页邮件会在本地保存一份邮件副本，因此速度快并可离线使用。**App Lock**（位于 **Settings <i class="fa fa-angle-right"></i> Privacy & Security**）会加密设备上的这些本地数据、您的设置和已保存的密码，并可通过通行密钥或 PIN 解锁。邮件和实时更新直接在应用与 Forward Email 之间传输，中间没有任何广告或跟踪服务。


## 故障排除 {#troubleshooting}

**"Can't send as <name@example.com>: sign in to that account on this device again, or save its domain's catch-all password in Settings."**

此设备上的网页邮件没有该地址的密码。请登录该别名，或在 **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Send from any address** 中保存该域名的通配密码。如果应用已锁定，请先解锁。

**From 菜单中没有“Other address”条目。**

请检查您是否已在此设备上保存通配密码，以及 App Lock 是否已解锁。

**从通配地址发送时出现身份验证错误。**

通配密码可能已被删除或输入有误。请在控制面板中生成一个新密码，然后在网页邮件中删除旧密码并添加新密码。

**我的控制面板密码在网页邮件中无法使用。**

网页邮件需要的是别名密码，而不是控制面板密码。请参阅[生成别名密码](#generate-an-alias-password)。

仍有问题？请查看我们的<a href="/faq">常见问题</a>或<a href="/help">联系我们</a>。
