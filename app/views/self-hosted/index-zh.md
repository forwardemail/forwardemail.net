# 自托管 {#self-hosted}

## 目录 {#table-of-contents}

* [入门](#getting-started)
* [要求](#requirements)
  * [Cloud-init/用户数据](#cloud-init--user-data)
* [安装](#install)
  * [调试安装脚本](#debug-install-script)
  * [提示](#prompts)
  * [初始设置（选项 1）](#initial-setup-option-1)
* [服务](#services)
  * [重要文件路径](#important-file-paths)
* [配置](#configuration)
  * [初始 DNS 设置](#initial-dns-setup)
* [入职](#onboarding)
* [测试](#testing)
  * [创建你的第一个别名](#creating-your-first-alias)
  * [发送/接收您的第一封电子邮件](#sending--receiving-your-first-email)
* [故障排除](#troubleshooting)
  * [基本身份验证用户名和密码是什么](#what-is-the-basic-auth-username-and-password)
  * [我如何知道正在运行什么](#how-do-i-know-what-is-running)
  * [我如何知道应该运行的程序没有运行](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [如何查找日志](#how-do-i-find-logs)
  * [为什么我发送的电子邮件会超时](#why-are-my-outgoing-emails-timing-out)

## 开始使用 {#getting-started}

我们的自托管电子邮件解决方案与我们的所有产品一样，前端和后端均 100% 开源。这意味着：

1. **完全透明**：处理您电子邮件的每一行代码都接受公众审查
2. **社区贡献**：任何人都可以贡献改进或修复问题
3. **开放保障安全**：漏洞可由全球社区识别和修复
4. **无供应商锁定**：您永远不会依赖我们公司的存在

整个代码库可在 GitHub 上的 <https://github.com/forwardemail/forwardemail.net>, 上找到，并根据 MIT 许可证获得许可。

该架构包括以下容器：

* SMTP 服务器用于发送邮件
* IMAP/POP3 服务器用于邮件检索
* Web 界面用于管理
* 数据库用于配置存储
* Redis 用于缓存和性能提升
* SQLite 用于安全加密的邮箱存储

> \[!NOTE]
> 请务必查看我们的 [自托管博客](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> 如果您对更详细的分步版本感兴趣，请参阅我们基于 [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) 或 [Debian](https://forwardemail.net/guides/selfhosted-on-debian) 的指南。

## 要求 {#requirements}

在运行安装脚本之前，请确保您具有以下内容：

* **操作系统**：基于 Linux 的服务器（目前支持 Ubuntu 22.04+）。
* **资源**：1 个 vCPU 和 2GB RAM
* **Root 访问权限**：具有执行命令的管理员权限。
* **域名**：一个自定义域名，可用于 DNS 配置。
* **干净 IP**：通过检查黑名单，确保您的服务器拥有干净的 IP 地址，且之前没有垃圾邮件记录。更多信息，请参阅 [这里](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation)。
* 支持端口 25 的公网 IP 地址
* 可设置 [反向 PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* 支持 IPv4 和 IPv6

> \[!TIP]
> 查看我们的 [优秀的邮件服务器提供商](https://github.com/forwardemail/awesome-mail-server-providers) 列表

### 云初始化 / 用户数据 {#cloud-init--user-data}

大多数云供应商都支持在配置虚拟专用服务器 (VPS) 时使用 cloud-init 配置。这是一种提前设置一些文件和环境变量的好方法，供脚本的初始设置逻辑使用，这样就无需在脚本运行时提示输入更多信息。

**选项**

* `EMAIL` - 用于 certbot 到期提醒的邮箱地址
* `DOMAIN` - 用于自托管设置的自定义域名（例如 `example.com`）
* `AUTH_BASIC_USERNAME` - 首次设置时用于保护网站的用户名
* `AUTH_BASIC_PASSWORD` - 首次设置时用于保护网站的密码
* `/root/.cloudflare.ini` - （**仅限 Cloudflare 用户**）certbot 用于 DNS 配置的 Cloudflare 配置文件。它需要您通过 `dns_cloudflare_api_token` 设置 API 令牌。了解更多 [这里](https://certbot-dns-cloudflare.readthedocs.io/en/stable/)。

例子：

```sh
#cloud-config
write_files:
  - path: /root/.cloudflare.ini
    content: |
      dns_cloudflare_api_token = "xxx"
    owner: root:root
    permissions: '0600'
  - path: /etc/profile.d/env.sh
    content: |
      export EMAIL="test@myemail.com"
      export DOMAIN="mydomain.com"

runcmd:
  - chmod +x /etc/profile.d/env.sh
```

## 安装 {#install}

在您的服务器中运行以下命令来下载并执行安装脚本：

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### 调试安装脚本 {#debug-install-script}

在安装脚本前面添加 `DEBUG=true` 以获得详细输出：

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### 提示 {#prompts}

```sh
1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

* **初始设置**：下载最新的邮件转发代码，配置环境，提示您输入自定义域名，并设置所有必要的证书、密钥和 secret。
* **设置备份**：将设置一个 cron 任务，使用兼容 S3 的存储系统备份 mongoDB 和 redis，以实现安全的远程存储。此外，如果 SQLite 发生更改，系统会在登录时备份，以确保安全加密的备份。
* **设置升级**：设置一个 cron 任务，用于查找夜间更新，以便安全地重建和重启基础架构组件。
* **续订证书**：SSL 证书使用 Certbot / lets encrypt，密钥每 3 个月过期一次。这将续订您域名的证书，并将其放置在相关组件所需的文件夹中。请参阅 [重要文件路径](#important-file-paths)
* **从备份恢复**：将触发 mongodb 和 redis 从备份数据中恢复。

### 初始设置（选项 1）{#initial-setup-option-1}

选择选项 `1. Initial setup` 开始。

完成后，您应该会看到一条成功消息。您甚至可以运行 `docker ps` 来查看组件的启动情况。更多关于组件的信息请见下文。

## 服务 {#services}

| 服务名称 | 默认端口 | 描述 |
| ------------ | :----------: | ------------------------------------------------------ |
| 网络 | `443` | 所有管理员交互的 Web 界面 |
| API | `4000` | API 层抽象数据库 |
| 布里 | 没有任何 | 后台作业和任务运行器 |
| SMTP | `465/587` | 用于发送邮件的 SMTP 服务器 |
| SMTP 布里 | 没有任何 | SMTP 后台作业 |
| MX | `2525` | 用于入站电子邮件和电子邮件转发的邮件交换 |
| IMAP | `993/2993` | 用于入站电子邮件和邮箱管理的 IMAP 服务器 |
| POP3 | `995/2995` | 用于入站电子邮件和邮箱管理的 POP3 服务器 |
| SQLite | `3456` | SQLite 服务器，用于与 SQLite 数据库交互 |
| SQLite Bree | 没有任何 | SQLite 后台作业 |
| 卡尔达夫 | `5000` | 用于日历管理的 CalDAV 服务器 |
| 卡达夫 | `6000` | 用于日历管理的 CardDAV 服务器 |
| MongoDB | `27017` | MongoDB 数据库用于大多数数据管理 |
| Redis | `6379` | Redis 用于缓存和状态管理 |
| SQLite | 没有任何 | 用于加密邮箱的 SQLite 数据库 |

### 重要文件路径 {#important-file-paths}

注意：下面的*主机路径*是相对于`/root/forwardemail.net/self-hosting/`的。

| 成分 | 主机路径 | 容器路径 |
| ---------------------- | :-------------------: | ---------------------------- |
| MongoDB | `./mongo-backups` | `/backups` |
| Redis | `./redis-data` | `/data` |
| SQLite | `./sqlite-data` | `/mnt/{SQLITE_STORAGE_PATH}` |
| 环境文件 | `./.env` | `/app/.env` |
| SSL 证书/密钥 | `./ssl` | `/app/ssl/` |
| 私钥 | `./ssl/privkey.pem` | `/app/ssl/privkey.pem` |
| 全链证书 | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem` |
| 认证的 CA | `./ssl/cert.pem` | `/app/ssl/cert.pem` |
| DKIM 私钥 | `./ssl/dkim.key` | `/app/ssl/dkim.key` |

> \[!IMPORTANT]
> 安全保存 `.env` 文件。这对于故障时的恢复至关重要。
> 您可以在 `/root/forwardemail.net/self-hosting/.env` 中找到它。

## 配置 {#configuration}

### 初始 DNS 设置 {#initial-dns-setup}

在您选择的 DNS 提供商中，配置相应的 DNS 记录。请注意，括号 (`<>`) 内的内容都是动态的，需要根据您的值进行更新。

| 类型 | 姓名 | 内容 | TTL |
| ----- | ------------------ | ----------------------------- | ---- |
| A | “@”、“.”或空白 | <IP 地址> | 汽车 |
| CNAME | API | <域名> | 汽车 |
| CNAME | 卡尔达夫 | <域名> | 汽车 |
| CNAME | 卡达夫 | <域名> | 汽车 |
| CNAME | 铁弹跳 | <域名> | 汽车 |
| CNAME | 映射表 | <域名> | 汽车 |
| CNAME | MX | <域名> | 汽车 |
| CNAME | pop3 | <域名> | 汽车 |
| CNAME | 邮件传输协议 | <域名> | 汽车 |
| MX | “@”、“.”或空白 | mx.<域名>（优先级 0） | 汽车 |
| TXT | “@”、“.”或空白 | “v=spf1 a-全部” | 汽车 |

#### 反向 DNS/PTR 记录 {#reverse-dns--ptr-record}

反向 DNS (rDNS) 或反向指针记录 (PTR 记录) 对于电子邮件服务器至关重要，因为它们有助于验证发送电子邮件的服务器的合法性。每个云提供商的做法不同，因此您需要查找如何添加“反向 DNS”以将主机和 IP 映射到其对应的主机名。最有可能的方法是查看提供商的网络部分。

#### 端口 25 被阻止 {#port-25-blocked}

一些 ISP 和云提供商会屏蔽 25 端口，以防范恶意攻击者。您可能需要提交支持工单，以开放 25 端口用于 SMTP 或外发邮件。

## 入职培训 {#onboarding}

1. 打开登录页面
导航至 https\://\<domain_name>，将 \<domain_name> 替换为您在 DNS 设置中配置的域名。您应该会看到“转发电子邮件”登录页面。

2. 登录并加入您的域名

* 使用有效的电子邮件地址和密码登录。
* 输入您要设置的域名（必须与 DNS 配置一致）。
* 按照提示添加所需的 **MX** 和 **TXT** 记录进行验证。

3. 完成设置

* 验证完成后，请访问“别名”页面创建您的第一个别名。
* （可选）在“域名设置”中配置“用于出站电子邮件的 SMTP”功能。这需要额外的 DNS 记录。

> \[!NOTE]
> 不会将任何信息发送到您的服务器之外。自托管选项和初始帐户仅用于管理员登录和网页视图，以管理域名、别名和相关的电子邮件配置。

## 测试 {#testing}

### 创建您的第一个别名 {#creating-your-first-alias}

1. 前往别名页面
打开别名管理页面：

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. 添加新别名

* 点击“添加别名”（右上角）。
* 输入别名并根据需要调整电子邮件设置。
* （可选）选中复选框以启用 **IMAP/POP3/CalDAV/CardDAV** 支持。
* 点击“创建别名”。

3.设置密码

* 点击**生成密码**来创建一个安全密码。
* 登录您的电子邮件客户端时需要此密码。

4.配置您的电子邮件客户端

* 使用 Thunderbird 等电子邮件客户端。
* 输入别名和生成的密码。
* 相应地配置 **IMAP** 和 **SMTP** 设置。

#### 电子邮件服务器设置 {#email-server-settings}

用户名：`<alias name>`

| 类型 | 主机名 | 港口 | 连接安全 | 验证 |
| ---- | ------------------ | ---- | ------------------- | --------------- |
| SMTP | smtp.<域名> | 465 | SSL / TLS | 普通密码 |
| IMAP | imap.<域名> | 993 | SSL / TLS | 普通密码 |

### 发送/接收您的第一封电子邮件 {#sending--receiving-your-first-email}

配置完成后，您应该能够向新创建的自托管电子邮件地址发送和接收电子邮件！

## 故障排除 {#troubleshooting}

#### 为什么这在 Ubuntu 和 Debian 之外不起作用{#why-doesnt-this-work-outside-of-ubuntu-and-debian}

我们目前正在寻求支持 MacOS，并期待其他操作系统的支持。如果您希望其他操作系统也能获得支持，请创建 [讨论](https://github.com/orgs/forwardemail/discussions) 或参与贡献。

#### 为什么 certbot acme 挑战会失败 {#why-is-the-certbot-acme-challenge-failing}

最常见的陷阱是 certbot / letsencrypt 有时会请求 **2** 个验证。您需要确保同时添加 **BOTH** 个 txt 记录。

例如：
您可能会看到两个这样的挑战：
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

DNS 传播也可能尚未完成。您可以使用类似 `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>` 的工具。这可以帮助您了解 TXT 记录更改是否应该反映出来。也可能是您的主机上的本地 DNS 缓存仍在使用旧的、过时的值，或者尚未获取最近的更改。

另一种选择是使用 Cerbot 自动 DNS 更改，方法是在初始 VPS 设置时，使用 cloud-init / user-data 中的 api 令牌设置 `/root/.cloudflare.ini` 文件，或者创建此文件并再次运行脚本。这将自动管理 DNS 更改和质询更新。

### 基本身份验证用户名和密码是什么？{#what-is-the-basic-auth-username-and-password}

对于自托管，我们添加了一个首次浏览器原生身份验证弹窗，其中包含简单的用户名 (`admin`) 和密码（初始设置时随机生成）。我们添加此功能只是为了防止自动化/爬虫程序以某种方式抢先您注册网页。初始设置后，您可以在 `.env` 文件的 `AUTH_BASIC_USERNAME` 和 `AUTH_BASIC_PASSWORD` 下找到此密码。

### 我如何知道正在运行什么 {#how-do-i-know-what-is-running}

您可以运行 `docker ps` 来查看所有正在运行的容器，这些容器是通过 `docker-compose-self-hosting.yml` 文件启动的。您也可以运行 `docker ps -a` 来查看所有内容（包括未运行的容器）。

### 我如何知道应该运行的程序是否没有运行{#how-do-i-know-if-something-isnt-running-that-should-be}

您可以运行 `docker ps -a` 来查看所有内容（包括未运行的容器）。您可能会看到退出日志或注释。

### 如何查找日志{#how-do-i-find-logs}

您可以通过 `docker logs -f <container_name>` 获取更多日志。如果出现任何问题，则可能与 `.env` 文件配置不正确有关。

在 Web UI 中，您可以分别查看出站电子邮件日志和错误日志的 `/admin/emails` 和 `/admin/logs`。

### 为什么我的外发电子邮件会超时 {#why-are-my-outgoing-emails-timing-out}

如果您看到类似“连接到 MX 服务器时连接超时...”的消息，则可能需要检查 25 端口是否被阻止。ISP 或云服务提供商通常会默认阻止此端口，您可能需要联系客服或提交工单来开通此端口。

#### 我应该使用哪些工具来测试电子邮件配置最佳实践和 IP 信誉{#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

看看我们的[常见问题解答在这里](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)。